| **Hardware** | |
| --- |---|
| Number of CPU cores| 8 |
| RAM| 12 GB|
| Number of disks | 3 <br><br> - OS disk<br> - Process server cache disk<br> - Retention drive (for failback)|
| Disk free space (process server cache) | 600 GB
| Disk free space (retention disk) | 600 GB|
| **Software** | |
| Operating system version | Windows Server 2012 R2 |
| Operating system locale | English (en-us)|
| VMware vSphere PowerCLI version | [PowerCLI 6.0](https://my.vmware.com/web/vmware/details?productId=491&downloadGroup=PCLI600R1 "PowerCLI 6.0")|
| Windows Server roles | Do not enable the following roles: <br> - Active Directory Domain Services <br>- Internet Information Services <br> - Hyper-V |
| Group Policies| The following Group policies should not be enabled on the server <br> - Prevent access to the command prompt <br> - Prevent access to registry editing tools <br> - Trust logic for file attachments <br> - Turn on Script Execution <br> **Note:** More information about these group policies can be found [here](https://technet.microsoft.com/en-us/library/gg176671(v=ws.10).aspx)|
| Internet Information Service(IIS) Configuration | - No pre-existing Default WebSite <br> - Enable  [Anonymous Authentication](https://technet.microsoft.com/en-us/library/cc731244(v=ws.10).aspx) <br> - Enable [FastCGI](https://technet.microsoft.com/en-us/library/cc753077(v=ws.10).aspx) setting  <br> - No pre-existing websit/application should be listening on port 443<br>|
| **Network** | |
| Network interface card type | VMXNET3 |
| IP address type | Static |
| Internet access | The server should be able to access the following URLs either directly or through a proxy server: <br> - \*.accesscontrol.windows.net<br> - \*.backup.windowsazure.com <br>- \*.store.core.windows.net<br> - \*.blob.core.windows.net<br> - \*.hypervrecoverymanager.windowsazure.com <br> - https://cdn.mysql.com/archives/mysql-5.5/mysql-5.5.37-win32.msi (not required for Scale-out Process Servers) <br> - time.nist.gov <br> - time.windows.com |
| Ports | 443 (Control channel orchestration)<br>9443 (Data transport)|
