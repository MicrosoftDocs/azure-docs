| **Component** | **Requirement** |
| --- |---|
| CPU cores| 8 |
| RAM | 16 GB|
| Number of disks | 3, including the OS disk, process server cache disk, and retention drive for failback |
| Disk free space (process server cache) | 600 GB
| Disk free space (retention disk) | 600 GB|
| Operating system  | Windows Server 2012 R2 <br> Windows Server 2016 |
| Operating system locale | English (en-us)|
| VMware vSphere PowerCLI version | [PowerCLI 6.0](https://my.vmware.com/web/vmware/details?productId=491&downloadGroup=PCLI600R1 "PowerCLI 6.0")|
| Windows Server roles | Don't enable these roles: <br> - Active Directory Domain Services <br>- Internet Information Services <br> - Hyper-V |
| Group policies| Don't enable these group policies: <br> - Prevent access to the command prompt. <br> - Prevent access to registry editing tools. <br> - Trust logic for file attachments. <br> - Turn on Script Execution. <br> [Learn more](https://technet.microsoft.com/en-us/library/gg176671(v=ws.10).aspx)|
| IIS | - No preexisting default website <br> - Enable  [Anonymous Authentication](https://technet.microsoft.com/en-us/library/cc731244(v=ws.10).aspx) <br> - Enable [FastCGI](https://technet.microsoft.com/en-us/library/cc753077(v=ws.10).aspx) setting  <br> - No preexisting website/application listening on port 443<br>|
| NIC type | VMXNET3 (when deployed as a VMware VM) |
| IP address type | Static |
| Internet access | The server needs access to these URLs: <br> - \*.accesscontrol.windows.net<br> - \*.backup.windowsazure.com <br>- \*.store.core.windows.net<br> - \*.blob.core.windows.net<br> - \*.hypervrecoverymanager.windowsazure.com <br> - https://cdn.mysql.com/archives/mysql-5.5/mysql-5.5.37-win32.msi (not required for scale-out process servers) <br> - time.nist.gov <br> - time.windows.com |
| Ports | 443 (Control channel orchestration)<br>9443 (Data transport)|
