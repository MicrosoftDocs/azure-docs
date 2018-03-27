---
title: Azure virtual machine serial console | Microsoft Docs
description: Bi-Directional serial console for Azure virtual machines.
services: virtual-machines-windows
documentationcenter: ''
author: harijay
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 03/05/2018
ms.author: harijay
---

# Virtual machine serial console (preview) 


The virtual machine serial console on Azure provides access to a text-based console for Linux and Windows virtual machines. This serial connection is to COM1 serial port of the virtual machine and provides access to the virtual machine and are not related to virtual machine's network / operating system state. Access to the serial console for a virtual machine can be done only via Azure portal currently and allowed only for those users who have VM Contributor or above access to the virtual machine. 

> [!Note] 
> Previews are made available to you on the condition that you agree to the terms of use. For more information, see [Microsoft Azure Supplemental Terms of Use for Microsoft Azure Previews.] (https://azure.microsoft.com/support/legal/preview-supplemental-terms/)
>Currently this service is in **public preview** and access to the serial console for virtual machines is available to global Azure regions. At this point serial console is not available Azure Government, Azure Germany, and Azure China cloud.

 

## Prerequisites 

* Virtual machine  MUST have [boot diagnostics](boot-diagnostics.md) enabled 
* The account using the serial console must have [Contributor role](../../active-directory/role-based-access-built-in-roles.md) for VM and the [boot diagnostics](boot-diagnostics.md) storage account. 

## Open the serial console
serial console for virtual machines is only accessible via [Azure portal](https://portal.azure.com). Below are the steps to access the serial console for virtual machines via portal 

  1. Open the Azure portal
  2. In the left menu, select virtual machines.
  3. Click on the VM in the list. The overview page for the VM will open.
  4. Scroll down to the Support + Troubleshooting section and click on the serial console (Preview) option. A new pane with the serial console will open and start the connection.

![](../media/virtual-machines-serial-console/virtual-machine-windows-serial-console-connect.gif)

### Disable feature
The serial console functionality can be deactivated for specific VMs by disabling that VM's boot diagnostics setting.

## Serial console security 

### Access security 
Access to Serial console is limited to users who have [VM Contributors](../../active-directory/role-based-access-built-in-roles.md#virtual-machine-contributor) or above access to the virtual machine. If your AAD tenant requires Multi-Factor Authentication then access to the serial console will also need MFA as its access is via [Azure portal](https://portal.azure.com).

### Channel security
All data is sent back and forth is encrypted on the wire.

### Audit logs
All access to the serial console is currently logged in the [boot diagnostics](https://docs.microsoft.com/azure/virtual-machines/linux/boot-diagnostics) logs of the virtual machine. Access to these logs are owned and controlled by the Azure virtual machine administrator.  

>[!CAUTION] 
While no access passwords for the console are logged, if commands run within the console contain or output passwords, secrets, user names or any other form of Personally Identifiable Information (PII), those will be written to the virtual machine boot diagnostics logs, along with all other visible text, as part of the implementation of the serial console's scroll back functionality. These logs are circular and only individuals with read permissions to the diagnostics storage account have access to them, however we recommend following the best practice of using the Remote Desktop for anything that may involve secrets and/or PII. 

### Concurrent usage
If a user is connected to serial console and another user successfully requests access to that same virtual machine, the first user will be disconnected and the second user connected in a manner akin to the first user standing up and leaving the physical console and a new user sitting down.

>[!CAUTION] 
This means that the user who gets disconnected will not be logged out! The ability to enforce a logout upon disconnect (via SIGHUP or similar mechanism) is still in the roadmap. For Windows, there is an automatic timeout enabled in SAC, however for Linux you can configure terminal timeout setting. 


## Accessing serial console for Windows 
Newer Windows Server images on Azure will have [Special Administrative Console](https://technet.microsoft.com/library/cc787940(v=ws.10).aspx) (SAC) enabled by default. SAC is supported on server versions of Windows but is not available on client versions (for example, Windows 10, Windows 8, or Windows 7). 
To enable Serial console for Windows virtual machines created with using Feb2018 or lower images please use the following steps: 

1. Connect to your Windows virtual machine via Remote Desktop
2. From an Administrative command prompt, run the following commands 
* `bcdedit /ems {current} on`
* `bcdedit /emssettings EMSPORT:1 EMSBAUDRATE:115200`
3. Reboot the system for the SAC console to be enabled

![](../media/virtual-machines-serial-console/virtual-machine-windows-serial-console-connect.gif)

If needed SAC can be enabled offline as well, 

1. Attach the windows disk you want SAC configured for as a data disk to existing VM. 
2. From an Administrative command prompt, run the following commands 
* `bcdedit /store <mountedvolume>\boot\bcd /ems {default} on`
* `bcdedit /store <mountedvolume>\boot\bcd /emssettings EMSPORT:1 EMSBAUDRATE:115200`

### How do I know if SAC is enabled or not 

If [SAC] (https://technet.microsoft.com/library/cc787940(v=ws.10).aspx) is not enabled the serial console will not show the SAC prompt. It can show a VM Health information in some cases or it would be blank.  

### Enabling boot menu to show in the serial console 

If you need to enable Windows boot loader prompts to show in the serial console, you can add the following additional options to Windows boot loader.

1. Connect to your Windows virtual machine via Remote Desktop
2. From an Administrative command prompt run the following commands 
* `bcdedit /set {bootmgr} displaybootmenu yes`
* `bcdedit /set {bootmgr} timeout 5`
* `bcdedit /set {bootmgr} bootems yes`
3. Reboot the system for the boot menu to be enabled

> [!NOTE] 
> At this point support for function keys is not enabled, if you require advanced boot options use bcdedit /set {current} onetimeadvancedoptions on, see [bcdedit](https://docs.microsoft.com/windows-hardware/drivers/devtest/bcdedit--set) for more details

## Windows Commands - CMD 

The table below shows examples of how to accomplish tasks in scenarios where you may need to use SAC to access the VM, such as when you need to troubleshoot RDP connection failures.

SAC has been included in all versions of Windows since Windows Server 2003 but is disabled by default. SAC relies on the `sacdrv.sys` kernel driver, the `Special Administration Console Helper` service (`sacsvr`), and the `sacsess.exe` process. For more information, see [Emergency Management Services Tools and Settings](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2003/cc787940(v%3dws.10)).

SAC allows you to connect to your running OS via serial port. When you launch CMD from SAC, `sacsess.exe` launches `cmd.exe` within your running OS. You can see that in Task Manager if you RDP to your VM at the same time you are connected to SAC via the serial console feature. The CMD you access via SAC is the same `cmd.exe` you use when connected via RDP. All the same commands and tools are available, including the ability to launch PowerShell from that CMD instance. That is a major difference between SAC and the Windows Recovery Environment (WinRE) in that SAC is letting you manage your running OS, where WinRE boots into a different, minimal OS. While Azure VMs do not support the ability to access WinRE, with the serial console feature, Azure VMs can be managed via SAC.

Because SAC is limited to an 80x24 screen buffer with no scroll back, add `| more` to commands to display the output one page at a time. Use `<spacebar>` to see the next page, or `<enter>` to see the next line.  

`SHIFT+INSERT` is the paste shortcut for the serial console window.

Because of SAC's limited screen buffer, longer commands may be easier to type out in a local text editor and then pasted into SAC.

Task | Command | Notes 
-----|---------|----------
Verify RDP is enabled | `reg query "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections`<br><br>`reg query "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v fDenyTSConnections` | The second key (under \Policies) will only exist if the relevant group policy setting is configured.
Enable RDP | `reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0`<br><br>`reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v fDenyTSConnections /t REG_DWORD /d 0` | The second key (under \Policies) would only be needed if the relevant group policy setting had been configured. Value will be rewritten at next group policy refresh if it is configured in group policy.
View service state | `sc query termservice` | 
View service logon account | `sc qc termservice` |
Set service logon account | `sc config termservice obj= "NT Authority\NetworkService"` | A space is required after the equals sign.
Set service start type | `sc config termservice start= demand`| A space is required after the equals sign. Possible start values include `boot`, `system`, `auto`, `demand`, `disabled`, `delayed-auto`.
Set service dependencies | `sc config termservice depend= RPCSS` | A space is required after the equals sign.
Start service | `net start termservice`<br><br>or<br><br>`sc start termservice` | 
Stop service | `net stop termservice`<br><br>or<br><br>`sc stop termservice` |  
Show NIC properties | `netsh interface show interface` |
Show IP properties | `netsh interface ip show config` | 
Enable NIC | `netsh interface set interface name="<interface name>" admin=enabled`
Set NIC to use DHCP | `netsh interface ip set address name="<interface name>" source=dhcp` | Azure VMs should always be configured in the guest OS to use DHCP to obtain an IP address. The Azure static IP setting still uses DHCP to give the static IP to the VM.
Ping | `ping 8.8.8.8` |
Port ping | Install the telnet client<br><br>`dism /online /Enable-Feature /FeatureName:TelnetClient`<br><br>Test connectivity<br><br>`telnet bing.com 80`<br><br>To remove the telnet client<br><br>`dism /online /Disable-Feature /FeatureName:TelnetClient` | When limited to methods available in Windows by default, PowerShell can be a better approach for testing port connectivity. See the PowerShell section below for examples.
Test DNS name resolution | `nslookup bing.com` | 
Show Windows firewall rule | `netsh advfirewall firewall show rule name="Remote Desktop - User Mode (TCP-In)"`
Disable Windows firewall | `netsh advfirewall set allprofiles state off` | 
Create local user account | `net user /add <username> <password>` |
Add local user to local group | `net localgroup Administrators <username> /add` | 
Verify user account is enabled | `net user <username> \\| find /i "active"` | Azure VMs created from generalized image will have the local administrator account renamed to the name specified during VM provisioning. So it will usually not be `Administrator`.
Enable user account | `net user <username> /active:yes` | 
View user account properties | `net user <username>` | Example lines of interest from a local admin account<br>`Account active Yes`<br>`Account expires Never`<br>`Password expires Never`<br>`Workstations allowed All`<br>`Logon hours allowed All`<br>`Local Group Memberships *Administrators`
View local groups | `net localgroup` |
Query event log errors | `wevtutil qe system /c:10 /f:text /q:"Event[System[Level=2]]" | more` | Change `/c:10` to the desired number of events to return, or move it to return all events matching the filter.
Query event log by Event ID | `wevtutil qe system /c:1 /f:text /q:"Event[System[EventID=11]]" | more` |
Query event log by Event ID and Provider | `wevtutil qe system /c:1 /f:text /q:"Event[System[Provider[@Name='Microsoft-Windows-Hyper-V-Netvsc'] and EventID=11]]" | more` |
Query event log by Event ID and Provider for the last 24 hours | `wevtutil qe system /c:1 /f:text /q:"Event[System[Provider[@Name='Microsoft-Windows-Hyper-V-Netvsc'] and EventID=11 and TimeCreated[timediff(@SystemTime) <= 86400000]]]"` | Use `604800000` to look back 7 days instead of 24 hours.
Query event log by Event ID, Provider, and EventData in the last 7 days | `wevtutil qe security /c:1 /f:text /q:"Event[System[Provider[@Name='Microsoft-Windows-Security-Auditing'] and EventID=4624 and TimeCreated[timediff(@SystemTime) <= 604800000]] and EventData[Data[@Name='TargetUserName']='<username>']]" | more` |
List installed software | `wmic product get Name,InstallDate | sort /r | more` | The `sort /r` sorts descending by install date to make it easy to see what was recently installed. Use `<spacebar>` to advance to the next page of output, or `<enter>` to advance one line.
Uninstall software | `wmic path win32_product where name="<name>" call uninstall` | Replace `<name>` with the name returned in the above command for the application you want to remove.
Get file version | `wmic datafile where "drive='C:' and path='\\windows\\system32\\drivers\\' and filename like 'netvsc%'" get version /format:list` | This example returns the file version of the virtual NIC driver, which is netvsc.sys, netvsc63.sys, or netvsc60.sys depending on the Windows version.
Scan for system file corruption | `sfc /scannow` | See also [Repair a Windows Image](https://docs.microsoft.com/en-us/windows-hardware/manufacture/desktop/repair-a-windows-image).
Scan for system file corruption | `dism /online /cleanup-image /scanhealth` | See also [Repair a Windows Image](https://docs.microsoft.com/en-us/windows-hardware/manufacture/desktop/repair-a-windows-image).
Remove non-present PNP devices | `%windir%\System32\RUNDLL32.exe %windir%\System32\pnpclean.dll,RunDLL_PnpClean /Devices /Maxclean` |
Export file permissions to text file | `icacls %programdata%\Microsoft\Crypto\RSA\MachineKeys /t /c > %temp%\MachineKeys_permissions_before.txt`
Save file permissions to ACL file | `icacls %programdata%\Microsoft\Crypto\RSA\MachineKeys /save %temp%\MachineKeys_permissions_before.aclfile /t` | 
Restore file permissions from ACL file | `icacls %programdata%\Microsoft\Crypto\RSA /save %temp%\MachineKeys_permissions_before.aclfile /t` | The path when using `/restore` needs to be the parent folder of the folder you specified when using `/save`. In this example, `\RSA` is the parent of the `\MachineKeys` folder specified in the `/save` example above.
Take NTFS ownership of a folder | `takeown /f %programdata%\Microsoft\Crypto\RSA\MachineKeys /a /r` | 
Grant NTFS permissions to a folder recursively | `icacls C:\ProgramData\Microsoft\Crypto\RSA\MachineKeys /t /c /grant "BUILTIN\Administrators:(F)"` | 
Show IPSec configuration | `netsh nap client show configuration` | 
Force group policy update | `gpupdate /force /wait:-1` | 
Show OS version | `ver`<br><br>`wmic os get caption,version,buildnumber /format:list`<br><br>`systeminfo | find /i "os name"`<br>`systeminfo | findstr /i /r "os.*version.*build"`<br><br>
Restart Windows | `shutdown /r /t 0` | Adding `/f` will force running applications to close without warning users.
Detect Safe Mode boot | `bcdedit /enum | find /i "safeboot"` |
View OS install date | `systeminfo | find /i "original"`<br><br>or<br><br>`wmic os get installdate` |
View last boot time | `systeminfo | find /i "system boot time"` |
View time zone | `systeminfo | find /i "time zone"`<br><br>or<br><br>`wmic timezone get caption,standardname /format:list` | 

## Windows Commands - PowerShell

WARNING: There is a known issue with pasting text into PowerShell in SAC where an extra character may be introduced into the text being pasted. Typically this occurs when pasting consecutive characters that are the same, for example "boot" is pasted as "booot" and "install" is pasted as "installl". The issue does not exist when pasting text in CMD in SAC, only when using PowerShell in SAC, and only on Windows Server 2016 and later.

Carefully review text pasted in PowerShell in SAC for extra characters, or use CMD instead where this issue does not occur.

To run PowerShell in SAC, after you reach a CMD prompt, type:

`powershell <enter>`

Task | Command | Notes 
-----|---------|----------
Verify RDP is enabled | `get-itemproperty -path 'hklm:\system\curRentcontrolset\control\terminal server' -name 'fdenytsconNections'`<br><br>`get-itemproperty -path 'hklm:\software\policies\microsoft\windows nt\terminal services' -name 'fdenytsconNections'` | The second key (under \Policies) will only exist if the relevant group policy setting is configured.
Enable RDP | `set-itemproperty -path 'hklm:\system\curRentcontrolset\control\terminal server' -name 'fdenytsconNections' 0 -type dword`<br><br>`set-itemproperty -path 'hklm:\software\policies\microsoft\windows nt\terminal services' -name 'fdenytsconNections' 0 -type dword` | The second key (under \Policies) would only be needed if the relevant group policy setting had been configured. Value will be rewritten at next group policy refresh if it is configured in group policy.
View service details | `get-wmiobject win32_service -filter "name='termservice'" | fl Name,DisplayName,State,StartMode,StartName,PathName,ServiceType,Status,ExitCode,ServiceSpecificExitCode,ProcessId` | `Get-Service` can be used but doesn't include the service logon account. `Get-WmiObject win32-service` does.
Set service logon account | `(get-wmiobject win32_service -filter "name='termservice'").Change($null,$null,$null,$null,$null,$false,'NT Authority\NetworkService')` | When using a service account other than `NT AUTHORITY\LocalService`, `NT AUTHORITY\NetworkService`, or `LocalSystem`, specify the account password as the last (eighth) argument after the account name.
Set service startup type | `set-service termservice -startuptype Manual`| `Set-service` accepts `Automatic`, `Manual`, or `Disabled` for startup type.
Set service dependencies | `Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Services\TermService' -Name DependOnService -Value @('RPCSS','TermDD')` | 
Start service | `start-service termservice` | 
Stop service | `stop-service termservice` |  
Show NIC properties | `get-netadapter | where {$_.ifdesc.startswith('Microsoft Hyper-V Network Adapter')} | fl status,name,ifdesc,macadDresS,driverversion,MediaConNectState,MediaDuplexState`<br><br>`get-wmiobject win32_networkadapter -filter "servicename='netvsc'" | fl netenabled,name,macaddress` | `Get-NetAdapter` is available in 2012+, for 2008R2 use `Get-WmiObject`.
Show IP properties | `get-wmiobject Win32_NetworkAdapterConfiguration -filter "ServiceName='netvsc'" | fl DNSHostName,IPAddress,DHCPEnabled,IPSubnet,DefaultIPGateway,MACAddress,DHCPServer,DNSServerSearchOrder` | 
Enable NIC | `get-netadapter | where {$_.ifdesc.startswith('Microsoft Hyper-V Network Adapter')} | enable-netadapter`<br><br>`(get-wmiobject win32_networkadapter -filter "servicename='netvsc'").enable()` | `Get-NetAdapter` is available in 2012+, for 2008R2 use `Get-WmiObject`.
Set NIC to use DHCP | `get-netadapter | where {$_.ifdesc.startswith('Microsoft Hyper-V Network Adapter')} | Set-NetIPInterface -DHCP Enabled`<br><br>`(get-wmiobject Win32_NetworkAdapterConfiguration -filter "ServiceName='netvsc'").EnableDHCP()` | `Get-NetAdapter` is available on 2012+. For 2008R2 use `Get-WmiObject`. Azure VMs should always be configured in the guest OS to use DHCP to obtain an IP address. The Azure static IP setting still uses DHCP to give the IP to the VM.
Ping | `test-netconnection`<br><br>`get-wmiobject Win32_PingStatus -Filter 'Address="8.8.8.8"' | ft -a IPV4Address,ReplySize,ResponseTime` | `Test-Netconnection` without any parameters will try to ping `internetbeacon.msedge.net`. It is available on 2012+. For 2008R2 use `Get-WmiObject` as in the second example.
Port Ping | `test-netconnection -ComputerName bing.com -Port 80`<br><br>`(new-object Net.Sockets.TcpClient).BeginConnect('bing.com','80',$null,$null).AsyncWaitHandle.WaitOne(300)` | `Test-NetConnection` is available on 2012+. For 2008R2 use `Net.Sockets.TcpClient`
Test DNS name resolution | `resolve-dnsname bing.com`<br><br>`[System.Net.Dns]::GetHostAddresses('bing.com')` | `Resolve-DnsName` is available on 2012+. For 2008R2 use `System.Net.DNS`.
Show Windows firewall rule by name | `get-netfirewallrule -name RemoteDesktop-UserMode-In-TCP` | 
Show Windows firewall rule by port | `get-netfirewallportfilter | where {$_.localport -eq 3389} | foreach {Get-NetFirewallRule -Name $_.InstanceId} | format-list Name,Enabled,Profile,Direction,Action`<br><br>`(new-object -ComObject hnetcfg.fwpolicy2).rules | where {$_.localports -eq 3389 -and $_.direction -eq 1} | format-table Name,Enabled` | `Get-NetFirewallPortFilter` is available on 2012+. For 2008R2 use the `hnetcfg.fwpolicy2` COM object. 
Disable Windows firewall | `Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False` | `Set-NetFirewallProfile` is available on 2012+. For 2008R2 use `netsh advfirewall` as referenced in the CMD section above.
Create local user account | `new-localuser <name>`|
Verify user account is enabled | `(get-localuser | where {$_.SID -like "S-1-5-21-*-500"}).Enabled`<br><br>`(get-wmiobject Win32_UserAccount -Namespace "root\cimv2" -Filter "SID like 'S-1-5-%-500'").Disabled` | `Get-LocalUser` is available on 2012+. For 2008R2 use `Get-WmiObject`. This example shows the built-in local administrator account, which always has SID `S-1-5-21-*-500`. Azure VMs created from generalized image will have the local administrator account renamed to the name specified during VM provisioning. So it will usually not be `Administrator`.
Add local user to local group | `add-localgroupmember -group Administrators -member <username>` |
Enable local user account | `get-localuser | where {$_.SID -like "S-1-5-21-*-500"} | enable-localuser` | This example enables the built-in local administrator account, which always has SID `S-1-5-21-*-500`. Azure VMs created from generalized image will have the local administrator account renamed to the name specified during VM provisioning. So it will usually not be `Administrator`.
View user account properties | `get-localuser | where {$_.SID -like "S-1-5-21-*-500"} | format-list *`<br><br>`get-wmiobject Win32_UserAccount -Namespace "root\cimv2" -Filter "SID like 'S-1-5-%-500'" | fl Name,Disabled,Status,Lockout,Description,SID` | `Get-LocalUser` is available on 2012+. For 2008R2 use `Get-WmiObject`. This example shows the built-in local administrator account, which always has SID `S-1-5-21-*-500`.
View local groups | `(get-localgroup).name | sort`<br><br>`(get-wmiobject win32_group).Name | sort` | `Get-LocalUser` is available on 2012+. For 2008R2 use `Get-WmiObject`.
Query event log errors | `get-winevent -logname system -maxevents 1 -filterxpath "*[System[Level=2]]" | more` | Change `/c:10` to the desired number of events to return, or move it to return all events matching the filter.
Query event log by Event ID | `get-winevent -logname system -maxevents 1 -filterxpath "*[System[EventID=11]]" | more` |
Query event log by Event ID and Provider | `get-winevent -logname system -maxevents 1 -filterxpath "*[System[Provider[@Name='Microsoft-Windows-Hyper-V-Netvsc'] and EventID=11]]" | more` |
Query event log by Event ID and Provider for the last 24 hours | `get-winevent -logname system -maxevents 1 -filterxpath "*[System[Provider[@Name='Microsoft-Windows-Hyper-V-Netvsc'] and EventID=11 and TimeCreated[timediff(@SystemTime) <= 86400000]]]"` | Use `604800000` to look back 7 days instead of 24 hours. |
Query event log by Event ID, Provider, and EventData in the last 7 days | `get-winevent -logname system -maxevents 1 -filterxpath "*[System[Provider[@Name='Microsoft-Windows-Security-Auditing'] and EventID=4624 and TimeCreated[timediff(@SystemTime) <= 604800000]] and EventData[Data[@Name='TargetUserName']='<username>']]" | more` |
List installed software | `get-wmiobject win32_product | select installdate,name | sort installdate -descending | more` |
Uninstall software | `(get-wmiobject win32_product -filter "Name='<name>'").Uninstall()` |
Show OS version | `get-wmiobject win32_operatingsystem | format-list caption,version,buildnumber`<br><br>
View OS install date | `(get-wmiobject win32_operatingsystem).converttodatetime((get-wmiobject win32_operatingsystem).installdate)` |
View last boot time | `(get-wmiobject win32_operatingsystem).lastbootuptime` |
View Windows uptime | `"{0:dd}:{0:hh}:{0:mm}:{0:ss}.{0:ff}" -f ((get-date)-(get-wmiobject win32_operatingsystem).converttodatetime((get-wmiobject win32_operatingsystem).lastbootuptime))` | Returns uptime as `<days>:<hours>:<minutes>:<seconds>:<milliseconds>`, for example `49:16:48:00.00`. 
Restart Windows | `restart-computer` | Adding `-force` will force running applications to close without warning users.
Get file version | `(get-childitem $env:windir\system32\drivers\netvsc*.sys).VersionInfo.FileVersion` | This example returns the file version of the virtual NIC driver, which is named netvsc.sys, netvsc63.sys, or netvsc60.sys depending on the Windows version.
Download and extract file | `$path='c:\bin';md $path;cd $path;(new-object net.webclient).downloadfile( ('htTp:/'+'/download.sysinternals.com/files/SysinternalsSuite.zip'),"$path\SysinternalsSuite.zip");(new-object -com shelL.apPlication).namespace($path).CopyHere( (new-object -com shelL.apPlication).namespace("$path\SysinternalsSuite.zip").Items(),16)` | 
Instance metadata | `$im = invoke-restmethod -headers @{"metadata"="true"} -uri http://169.254.169.254/metadata/instance?api-version=2017-08-01 -method get`<br>`$im | convertto-json` |
OS Type (Instance Metadata) | `$im.Compute.osType` |
Location (Instance Metadata) | `$im.Compute.Location` |
Size (Instance Metadata) | `$im.Compute.vmSize` |
VM ID (Instance Metadata) | `$im.Compute.vmId` |
VM Name (Instance Metadata) | `$im.Compute.name` |
Resource Group Name (Instance Metadata) | `$im.Compute.resourceGroupName` |
Subscription ID (Instance Metadata) | `$im.Compute.subscriptionId` |
Tags (Instance Metadata) | `$im.Compute.tags` |
Placement Group ID (Instance Metadata) | `$im.Compute.placementGroupId` |
Platform Fault Domain (Instance Metadata) | `$im.Compute.platformFaultDomain` |
Platform Update Domain (Instance Metadata) | `$im.Compute.platformUpdateDomain` |
IPv4 Private IP Address (Instance Metadata) | `$im.network.interface.ipv4.ipAddress.privateIpAddress` |
IPv4 Public IP Address (Instance Metadata) | `$im.network.interface.ipv4.ipAddress.publicIpAddress` |
IPv4 Subnet Address / Prefix (Instance Metadata) | `$im.network.interface.ipv4.subnet.address`<br><br>`$im.network.interface.ipv4.subnet.prefix` |
IPv6 IP Address (Instance Metadata) | `$im.network.interface.ipv6.ipAddress` |
MAC Address (Instance Metadata) | `$im.network.interface.macAddress` |

## Errors
Most errors are transient in nature and retrying connection address these. Below table shows a list of errors and mitigation 

Error                            |   Mitigation 
:---------------------------------|:--------------------------------------------|
Unable to retrieve boot diagnostics settings for '<VMNAME>'. To use the serial console, ensure that boot diagnostics is enabled for this VM. | Ensure that the VM has [boot diagnostics](boot-diagnostics.md) enabled. 
The VM is in a stopped deallocated state. Start the VM and retry the serial console connection. | Virtual machine must be in a started state to access the serial console
You do not have the required permissions to use this VM serial console. Ensure you have at least VM Contributor role permissions.| Serial console access requires certain permission to access. See [access requirements](#prerequisites) for details
Unable to determine the resource group for the boot diagnostics storage account '<STORAGEACCOUNTNAME>'. Verify that boot diagnostics is enabled for this VM and you have access to this storage account. | Serial console access requires certain permission to access. See [access requirements](#prerequisites) for details

## Known issues 
As we are still in the preview stages for serial console access, we are working through some known issues, below is the list of these with possible workarounds 

Issue                           |   Mitigation 
:---------------------------------|:--------------------------------------------|
There is no option with virtual machine scale set instance serial console | At the time of preview, access to the serial console for virtual machine scale set instances is not supported.
Hitting enter after the connection banner does not show a log in prompt | [Hitting enter does nothing](https://github.com/Microsoft/azserialconsole/blob/master/Known_Issues/Hitting_enter_does_nothing.md)
Only health information is shown when connecting to a Windows VM| [Windows Health Signals](https://github.com/Microsoft/azserialconsole/blob/master/Known_Issues/Windows_Health_Info.md)
Unable to type at SAC prompt if kernel debugging is enabled | RDP to VM and run `bcdedit /debug {current} off` from an elevated command prompt. If you can't RDP you can instead attach the OS disk to another Azure VM and modify it while attached as a data disk using `bcdedit /store <drive letter of data disk>:\boot\bcd /debug <identifier> off`, then swap the disk back.

## Frequently asked questions 
**Q. How can I send feedback?**

A. Provide feedback as an issue by going to https://aka.ms/serialconsolefeedback. Alternatively (less preferred) Send feedback via azserialhelp@microsoft.com or in the virtual machine category of http://feedback.azure.com 

**Q. I get an Error "Existing console has conflicting OS type "Windows" with the requested OS type of Linux?**

A. This is a known issue to fix this, simply open [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview) in bash mode and retry.

**Q. I am not able to access the serial console, where can I file a support case?**

A. This preview feature is covered via Azure Preview Terms. Support for this is best handled via channels mentioned above. 

## Next steps
* The serial console is also available for [Linux](../linux/serial-console.md) VMs
* Learn more about [bootdiagnostics](boot-diagnostics.md)
