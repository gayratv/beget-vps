export interface VPSlist {
  vps: Vp[];
}

export interface Vp {
  id: string;
  slug: string;
  display_name: string;
  hostname: string;
  configuration: Configuration;
  status: string;
  ssh_keys: SSHKey[];
  has_password: boolean;
  manage_enabled: boolean;
  description: string;
  date_create: Date;
  ip_address: string;
  rescue_mode: boolean;
  migrating: boolean;
  host_unavailable: boolean;
  unblocking: boolean;
  restoring: boolean;
  disk_used: string;
  disk_left: string;
  additional_ip_address: any[];
  beget_ssh_access_allowed: boolean;
  archived: boolean;
  unarchiving: boolean;
  private_network: PrivateNetwork[];
  technical_domain: string;
  software_domain: string;
  software: Software;
  link_slug: string;
}

export interface Configuration {
  id: string;
  name: string;
  cpu_count: number;
  disk_size: number;
  memory: number;
  price_day: number;
  price_month: number;
  available: boolean;
  custom: boolean;
  configurable: boolean;
}

export interface PrivateNetwork {
  network: Network;
  ip: string[];
}

export interface Network {
  id: string;
  subnet: string;
  mask: number;
}

export interface Software {
  name: string;
  display_name: string;
  version: string;
  address: string;
  status: string;
  field_value: any[];
  metadata: Metadata;
  description: string;
  description_en: string;
  category: Category[];
  slug: string;
  post_install_alert: boolean;
}

export interface Category {
  sys_name: string;
  name: string;
  name_en: string;
  is_main: boolean;
  icon_svg: string;
}

export interface Metadata {
  is_new: boolean;
  is_pinned: boolean;
  icon: string;
  icon2x: string;
  logo: string;
  logo2x: string;
  primary_color: string;
  secondary_color: string;
  weight: number;
}

export interface SSHKey {
  id: number;
  name: string;
  fingerprint: string;
}
