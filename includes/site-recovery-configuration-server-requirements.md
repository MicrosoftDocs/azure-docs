| **Hardware** | |
| --- |---|
| Number of CPU Cores| 8 Cores |
| RAM| 12 GB|
| Number of Disks | **3 Disks** <br> - OS Disk<br> - Process Server Cache Disk<br> - Retention Drive (for Failback)|
| Disk Free Space (Process Server Cache) | 600 GB
| Disk Free Space (Retention Disk) | 600 GB|
| **Software** | |
| Operating System Version | Windows Server 2012 R2 |
| Operating System Locale | English (en-us)|
| VMware vSphere PowerCLI Version | [PowerCLI 6.0](https://developercenter.vmware.com/tool/vsphere_powercli/6.0 "PowerCLI 6.0")|
| Windows Server Roles | Do not enable the following roles <br> **Active Directory Domain Services** <br>**Internet Information Service** <br> **Hyper-V** |
| **Network** | |
| Network Interface Card Type | VMXNET3 |
| IP Address Type | Static |
| Internet Access | The server should be able to access the following URL either directly or through a Proxy Server <br> - \*.accesscontrol.windows.net<br> - \*.backup.windowsazure.com <br>- \*.store.core.windows.net<br> - \*.blob.core.windows.net<br> - \*.hypervrecoverymanager.windowsazure.com <br> - https://cdn.mysql.com/archives/mysql-5.5/mysql-5.5.37-win32.msi <br> - time.nist.gov <br> - time.windows.com |
| Ports | 443 (Control Channel Orchestration)<br>9443 (Data Transport)|
