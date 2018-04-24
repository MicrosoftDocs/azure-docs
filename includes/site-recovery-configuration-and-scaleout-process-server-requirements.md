
**Configuration/Process server requirements**

**Component** | **Requirement** 
--- | ---
**HARDWARE** | 
**CPU cores** | 8 
**RAM** | 16 GB
**Number of disks** | 3, including the OS disk, process server cache disk, and retention drive for failback 
**Free disk space (process server cache)** | 600 GB
**Free disk space (retention disk)** | 600 GB
**SOFTWARE** | 
**Operating system** | Windows Server 2012 R2 <br> Windows Server 2016
**Operating system locale** | English (en-us)
**Windows Server roles** | Don't enable these roles: <br> - Active Directory Domain Services <br>- Internet Information Services <br> - Hyper-V 
**Group policies** | Don't enable these group policies: <br> - Prevent access to the command prompt. <br> - Prevent access to registry editing tools. <br> - Trust logic for file attachments. <br> - Turn on Script Execution. <br> [Learn more](https://technet.microsoft.com/library/gg176671(v=ws.10).aspx)
**IIS** | - No preexisting default website <br> - No preexisting website/application listening on port 443 <br>- Enable  [anonymous authentication](https://technet.microsoft.com/library/cc731244(v=ws.10).aspx) <br> - Enable [FastCGI](https://technet.microsoft.com/library/cc753077(v=ws.10).aspx) setting 
**NETWORK** | 
**IP address type** | Static 
**Internet access** | The server needs access to these URLs (directly or via proxy) <br> - \*.accesscontrol.windows.net<br> - \*.backup.windowsazure.com <br>- \*.store.core.windows.net<br> - \*.blob.core.windows.net<br> - \*.hypervrecoverymanager.windowsazure.com <br> - https://cdn.mysql.com/archives/mysql-5.5/mysql-5.5.37-win32.msi (if you're setting up a configuration server) <br> - time.nist.gov <br> - time.windows.com 
**Ports** | 443 (Control channel orchestration)<br>9443 (Data transport) 
**VMWARE (when you set up the configuration/process server as a VMware VM)**
**NIC type** | VMXNET3  
**VMware vSphere PowerCLI running on VM* | [PowerCLI version 6.0](https://my.vmware.com/web/vmware/details?productId=491&downloadGroup=PCLI600R1 "PowerCLI 6.0")

**Configuration/Process server sizing requirements**

**CPU** | **Memory** | **Cache disk** | **Data change rate** | **Replicated machines**
--- | --- | --- | --- | ---
8 vCPUs<br/><br/> 2 sockets * 4 cores @ 2.5 GHz | 16GB | 300 GB | 500 GB or less | < 100 machines
12 vCPUs<br/><br/> 2 socks  * 6 cores @ 2.5 GHz | 18 GB | 600 GB | 500 GB-1 TB | 100 to 150 machines
16 vCPUs<br/><br/> 2 socks  * 8 cores @ 2.5 GHz | 32 GB | 1 TB | 1-2 TB | 150 -200 machines

