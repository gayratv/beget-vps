import '../helpers/dotenv-init.js';
import axios, { AxiosHeaders, AxiosInstance } from 'axios';
import { VPSlist } from './beget-types-vps-list.js';
import fs from 'node:fs/promises';
import path from 'node:path';

interface CreateVPSparams {
  display_name: string; //  Отображаемое имя VPS
  hostname: string; //  Имя хоста в операционной системе
  description?: string; //   Дополнительное описание VPS (необязательное поле)
  configuration_id: string; //  Конфигурация: Идентификатор необходимой конфигурации (тариф)

  // Конфигурация: Параметры конфигурации VPS
  configuration_params?: {
    cpu_count: number; //    Количество ядер процессора
    disk_size: number; //    Объем дисковой квоты в Мб
    memory: number; //    Объем оперативной памяти в Мб
  };

  // Информация о ПО, которое необходимо установить
  software: {
    id: number; //    ID устанавливаемого ПО
    //      Дополнительные переменные для установки
    variable?: Record<string, string>;
  };
  snapshot_id?: string; //   Источник для диска сервера: идентификатор снапшота, который восстановится в новую VPS
  ssh_keys?: Array<number>; //  Идентификаторы публичных SSH-ключей, которые будут добавлены в VPS (необязательное поле)
  password: string; //  Пароль (должен включать минимум 1 upper, 1 lower, 1 digit, 1 special char. Мин длина - 8 символов)
  beget_ssh_access_allowed: boolean; //  Открыть доступ к VPS файловому менеджеру

  // Приватные сети, к которым необходимо подключить VPS (необязательное поле)
  private_networks: [
    {
      id: string; //   ID сети
      address?: string; //  Желаемый ip-адрес. Если пустая строка, то выберется случайный
    },
  ];
  link_slug: string; //   Слаг, который вернется в ответе в VpsInfo (необязательное поле).
}

export class Beget {
  public axiosInstance: AxiosInstance;
  private standartAuth: URLSearchParams;
  private token: string;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: 'https://api.beget.com/' });

    const params = new URLSearchParams();
    params.append('login', process.env.LOGIN);
    params.append('passwd', encodeURIComponent(process.env.PASSWORD));
    this.standartAuth = params;
  }

  async getToken() {
    const res = await this.axiosInstance.post(
      '/v1/auth',
      {
        login: process.env.LOGIN,
        password: process.env.PASSWORD,
        saveMe: false,
      },
      { headers: { 'Content-Type': 'application/json' } },
    );
    this.token = res.data.token;
    // @ts-ignore
    this.axiosInstance.defaults.headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    };
    // <html>TS2322: Type 'AxiosHeaders' is not assignable to type
    // 'HeadersDefaults &amp; { [key: string]: AxiosHeaderValue; }'.<br/>Type 'AxiosHeaders' is missing the following properties from type 'HeadersDefaults': common, head, post, put, patch
    return res.data;
  }

  async revokeToken() {
    const res = await this.axiosInstance.post('/v1/auth/logout', {});
    this.token = null;
    return res.data;
  }

  /*
   * Получить доступные конфигурации VPS
   * https://developer.beget.com/#get-/v1/vps/configuration
   */
  async getVPSconfig() {
    const res = await this.axiosInstance.get('/v1/vps/configuration');
    return res.data;
  }

  /*
   * Получить список доступного ПО
   * https://developer.beget.com/#get-/v1/vps/marketplace/software/list
   */
  async getPOlist() {
    const res = await this.axiosInstance.get('/v1/vps/marketplace/software/list');
    return res.data;
  }
  /*
   {
      id: 1938,
      name: 'ubuntu',
      display_name: 'Ubuntu',
      version: '22.04',
      description: 'Один из&nbsp;самых популярных универсальных дистрибутивов Linux для любых задач.',
      description_en: 'One of&nbsp;the most popular universal Linux distributions for any task.',
      metadata: [Object],
      field_data: [],
      requirements: [Object],
      category: [Array],
      slug: 'ubuntu-22-04',
      documentation_slug: 'ubuntu-22-04',
      unattended_install_available: true
    },

   */

  /*
   * Получить список SSH-ключей
   */
  async getSSHkeysList() {
    const res = await this.axiosInstance.get('/v1/vps/sshKey');
    return res.data;
  }
  /*
  {
      id: 10403,
      name: 'ansible',
      fingerprint: '4d:82:67:77:88:ec:08:f5:67:23:84:6a:8e:ab:fb:bc'
    }

   */

  /*
   * Получить информацию об IP-адресах и сетях
   */
  async getNetworks() {
    const res = await this.axiosInstance.get('/v1/vps/network');
    return res.data;
  }
  /*
  {
  ip: [],
  additional_ip: [],
  private_network: [ { id: '3634', subnet: '10.16.0.0', mask: 16 } ]
}

   */

  /*
   * Создать VPS
   *  id: 'simple_v4' CPU=1 Mem-1
   *  https://developer.beget.com/#post-/v1/vps/server
   */
  async createVPS() {
    const vpsParams: CreateVPSparams = {
      display_name: 'ans1',
      hostname: 'ans1',
      configuration_id: 'simple_v4',

      // Информация о ПО, которое необходимо установить
      software: {
        id: 1938, // ubuntu 22.04
      },
      ssh_keys: [10403],
      password: '1xalto&MPiNu',
      beget_ssh_access_allowed: true,

      // Приватные сети, к которым необходимо подключить VPS (необязательное поле)
      private_networks: [
        {
          id: '3634',
        },
      ],
      link_slug: 'ans1',
    };

    const res = await this.axiosInstance.post('/v1/vps/server', vpsParams);
    return res.data;
  }

  /*
   * Создать VPS
   *  id: 'simple_v4' CPU=1 Mem-1
   *  https://developer.beget.com/#post-/v1/vps/server
   */
  async createVPS2(display_name: string, ssh_key = 10403) {
    const vpsParams: CreateVPSparams = {
      display_name: display_name,
      hostname: display_name,
      configuration_id: 'simple_v4',

      // Информация о ПО, которое необходимо установить
      software: {
        id: 1938, // ubuntu 22.04
      },
      ssh_keys: [ssh_key],
      password: process.env.VPS_PASSWORD,
      beget_ssh_access_allowed: true,

      // Приватные сети, к которым необходимо подключить VPS (необязательное поле)
      private_networks: [
        {
          id: '3634',
        },
      ],
      link_slug: display_name,
    };

    const res = await this.axiosInstance.post('/v1/vps/server', vpsParams);
    return res.data;
  }

  /*
   * Получить список VPS
   */
  async getVPSlist(): Promise<VPSlist> {
    const res = await this.axiosInstance.get('/v1/vps/server/list');
    return res.data;
  }

  /*
   * Удалить VPS
   */
  async deleteVPS(vpsID: string) {
    const res = await this.axiosInstance.post(`/v1/vps/server/${vpsID}/remove`);
    return res.data;
  }

  async deleteAll_VPS() {
    const vpsList = await this.getVPSlist();
    vpsList.vps.forEach(async (val) => {
      await this.deleteVPS(val.id);
    });
  }

  async generateConfigSSH(
    configFileName = 'C:\\Users\\gena6\\.ssh\\config',
    known_hosts = 'C:\\Users\\gena6\\.ssh\\known_hosts',
    lunix = false,
  ) {
    let configText: string = await fs.readFile(configFileName, 'utf8');
    const separator = '#------';
    const ind = configText.search(separator);
    if (ind === -1) return;
    configText = configText.substring(0, ind + separator.length) + '\n\n';

    const vpsList = await this.getVPSlist();
    const dosSSHpriv = 'C:\\Users\\gena6\\.ssh\\ansible\\id_rsa.priv';
    const ubuntuSSHpriv = '~/.ssh/ansible/id_rsa.priv';

    vpsList.vps.forEach((val) => {
      const newSSH = `
host ${val.display_name}
  HostName ${val.ip_address}
  User root
  IdentityFile ${lunix ? ubuntuSSHpriv : dosSSHpriv}
      
      `;
      configText += newSSH;
    });
    await fs.writeFile(configFileName, configText, 'utf8');
    try {
      await fs.unlink(known_hosts);
    } catch (err) {}
    console.log('Конфиг сформирован');
    // return configText;
  }

  async generateAnsibleIP(dirStore = 'F:\\_prg\\docker\\docker-swarm-ansible\\group_vars') {
    const vpsList = await this.getVPSlist();

    let configText = '';
    vpsList.vps.forEach((val) => {
      const newIP = `${val.display_name}_ip : ${val.ip_address} \n`;
      configText += newIP;
    });
    await fs.writeFile(path.resolve(dirStore, 'beget.yml'), configText, 'utf8');
    console.log('Файл с IP сформирован');
    // return configText;
  }

  async generateAnsibleIP2(dirStore = 'F:\\_prg\\docker\\docker-swarm-ansible\\host_vars') {
    const vpsList = await this.getVPSlist();

    vpsList.vps.forEach(async (val) => {
      const newIP = `---\nansible_host: ${val.ip_address} \n`;
      const fname = val.display_name === 'ans1' ? 'master' : val.display_name;
      await fs.writeFile(path.resolve(dirStore, fname), newIP, 'utf8');
    });
    console.log('Файл с IP сформирован');
    // return configText;
  }
}
