---
title: Azure Site Recovery troubleshooting from VMware to Azure | Microsoft Docs
description: Troubleshooting errors when replicating Azure virtual machines
services: site-recovery
documentationcenter: ''
author: asgang
manager: srinathv
editor: ''

ms.assetid:
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 08/24/2017
ms.author: asgang

---
# Troubleshooting Mobility Service push install issues

This article details the common issues faced when trying to install the Mobility Service on to source server for enabling protection.

## (Error code 95107) Protection could not be enabled.
**Error code** | **Possible causes** | **Error-specific Recommendations**
--- | --- | ---
95107 </br>***Message -***  Push installation of the mobility service to the source machine failed with error code ***EP0858***. <br> Either that the credentials provided to install mobility service is incorrect or the user account has insufficient privileges | User credentials provided to install mobility service on source machine is incorrect | Ensure the user credentials provided for the source machine on configuration server are correct. <br> To add/edit user credentials: go to configuration server > Cspsconfigtool icon > Manage account. </br> In addition, ensure below pre-requisites are checked to successfully complete push install.

## (Error code 95015) Protection could not be enabled.
**Error code** | **Possible causes** | **Error-specific Recommendations**
--- | --- | ---
95105 </br>***Message -***  Push installation of the mobility service to the source machine failed with error code ***EP0856***. <br> Either “File and Printer Sharing” not allowed on the source machine, or there are network connectivity issues between the process server and the source machine| File and print sharing is not enabled | Allow “File and Printer Sharing” on the source machine in the Windows Firewall, Go to the source machine > Under Windows Firewall settings > “Allow an app or feature through Firewall” > select “File and Printer Sharing for all profiles”. </br> In addition, ensure below pre-requisites are checked to successfully complete push install.

## (Error code 95117) Protection could not be enabled.
**Error code** | **Possible causes** | **Error-specific Recommendations**
--- | --- | ---
95117 </br>***Message -***  Push installation of the mobility service to the source machine failed with error code ***EP0865***. <br> Either the source machine is not running, or there are network connectivity issues between the process server and the source machine | Network connectivity between process server and source server | Check connectivity between process server and source server. </br> In addition, ensure below pre-requisites are checked to successfully complete push install.

## (Error code 95103) Protection could not be enabled.
**Error code** | **Possible causes** | **Error-specific Recommendations**
--- | --- | ---
95103 </br>***Message -***  Push installation of the mobility service to the source machine failed with error code ***EP0854***. <br> Either “Windows Management Instrumentation (WMI)”is not allowed on the source machine, or there are network connectivity issues between the process server and the source machine| Windows Management Instrumentation (WMI) blocked in the Windows Firewall | Allow Windows Management Instrumentation (WMI) in the Windows Firewall. Under Windows Firewall settings > “Allow an app or feature through Firewall” > “select WMI for all profiles”. </br> In addition, ensure below pre-requisites are checked to successfully complete push install.

## Check Push Install Logs for errors

On the Configuration/Process server, Navigate to file 'PushinstallService' located at <Microsoft Azure Site Recovery Install Location>\home\svsystems\pushinstallsvc\ to understand the source of the problem and use below troubleshooting steps to resolve the issue.</br>
![pushiinstalllogs](./media/site-recovery-protection-common-errors/pushinstalllogs.png)

## Push Install pre-requisites for Windows
### Ensure "File and Printer Sharing" is enabled
Allow “File and Printer Sharing” and "Windows Management Instrumentation" on the source machine in the Windows Firewall </br>
#### If Source machine is Domain Joined: </br>
Configure firewall settings using Group Policy Management Console (GPMC).
1. Login to Active directory domain machine as administrator and open Group Policy Management Console (GPMC.MSC, run from a Start > Run).</br>
3. If GPMC is not installed, follow the link to [Install the GPMC](https://technet.microsoft.com/library/cc725932.aspx) </br>
4. In the GPMC console tree, double-click Group Policy Objects in the forest and domain and navigate to “Default Domain Policy”. </br>
![gpmc1](./media/site-recovery-protection-common-errors/gpmc1.png) </br>
</br>
5. Right-click on “Default Domain Policy” > edit > A new “Group Policy Management Editor” window will be opened. </br>
![gpmc2](./media/site-recovery-protection-common-errors/gpmc2.png) </br>
</br>
6. In the Group Policy Management Editor navigate to Computer Configuration > Policies > Administrative Templates > Network > Network Connections > Windows Firewall. </br>
![gpmc3](./media/site-recovery-protection-common-errors/gpmc3.png) </br>
</br>
7. Enable the following settings for Domain Profile and  Standard Profile </br>
a)	Double-click on exception “Windows Firewall: Allow inbound file and printer sharing exception”. Select Enabled and click OK. </br>
b)	Double click on exception “Windows Firewall: Allow inbound remote administration exception”. Select Enabled and click OK. </br>
![gpmc4](./media/site-recovery-protection-common-errors/gpmc4.png) </br>
</br>

###### If Source machine is not domain joined and part of workgroup </br>
Configure firewall settings on remote machine (for workgroup):
1. Go to the source machine,</br>
2. Under Windows Firewall settings > “Allow an app or feature through Firewall” > select “File and Printer Sharing for all profiles”. </br>
3. Under Windows Firewall settings > “Allow an app or feature through Firewall” > “select WMI for all profiles”. </br>

#### Disable remote User Account Control (UAC)
Disable UAC using registry key to push the mobility service.
1. Click Start > Run > type regedit > ENTER
2. Locate and then click the following registry subkey: HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System
3. If the LocalAccountTokenFilterPolicy registry entry does not exist, follow these steps:
4. On the Edit menu > New > click DWORD Value.
5. Type LocalAccountTokenFilterPolicy and then press ENTER.
6. Right-click LocalAccountTokenFilterPolicy and then click Modify.
7. In the Value data box, type 1, and then click OK.
8. Exit Registry Editor.


## Push Install pre-requisites for Linux:

1. Create a root user on the source Linux server. (Use this account only for the push installation and updates)</br>
2. Check that the /etc/hosts file on the source Linux server has entries that map the local hostname to IP addresses associated with all network adapters. </br>
3. Make sure the latest openssh, openssh-server, and openssl packages are installed on source Linux server. </br>
Check if ssh port 22 is enabled and running. </br>
4. Check if stale entries of agents are already present on the source server, uninstall the older agents and reboot the server, reinstall agent. </br>

#### Enable SFTP subsystem and password authentication in the sshd_config file
1. On source server, sign in as root. </br>
2. In the file /etc/ssh/sshd_config file,</br> find the line that begins with PasswordAuthentication. </br>
3. d.	Uncomment the line and change the value from “no” to “yes”. </br>
![Linux1](./media/site-recovery-protection-common-errors/linux1.png)
4. Find the line that begins with “Subsystem” and uncomment the line. </br>
![Linux2](./media/site-recovery-protection-common-errors/linux2.png)
5. Save the changes and restart the sshd service. </br>

## Push Installation checks on Configuration/Process server.
#### Validate credentials for discovery and installation

1. From Configuration Server, launch Cspsconfigtool</br>
![WMItestConnect5](./media/site-recovery-protection-common-errors/wmitestconnect5.png) </br>

2. Make sure that the account used for protection has administrator rights on the source machine. </br>

#### Check connectivity between process server and source server
1. Ensure Process Server has internet connection.
2. Verify WMI connection using wbemtest.exe. </br>
On the Process server, Click Start > Run > wbemtest.exe > Windows Management Instrumentation Tester window will be opened as shown.</br>
   ![WMItestConnect1](./media/site-recovery-protection-common-errors/wmitestconnect1.png) </br>
   </br>
Click on Connect > Enter the source server IP in the Namespace
Input User name and Password (If source machine is domain joined, provide the domain name along with user name as “domainName\username”. If source machine is in workgroup, provide only the user name.)
   Select the Authentication level as Packet privacy. </br>
   ![WMItestConnect2](./media/site-recovery-protection-common-errors/wmitestconnect2.png) </br>
   </br>
Click on Connect. Now the WMI connection should be successful with the provided data and the Windows Management Instrumentation Tester window should be displayed as shown below: </br>
   ![WMItestConnect3](./media/site-recovery-protection-common-errors/wmitestconnect3.png) </br>
   </br>
If WMI connection is not successful there will be an error message pop-up. The below screenshot shows an unsuccessful attempt if WMI/Remote Administration is not enabled in Windows firewall allowed app. </br>
   ![WMItestConnect4](./media/site-recovery-protection-common-errors/wmitestconnect4.png) </br>
   </br>

3. Check for the WMI status and connectivity.</br>
On the configuration/Process server, </br>
Click start > run > wmimgmt.msc > Actions > More Actions > connect to another computer (source machine). </br>
Input the credentials of the account used for protection and check if connectivity is fine. </br>

#### Verify network shared folders of source machine is accessible from Process Server (PS) remotely using specified credentials.
  1. Logon to Process Server (PS) machine, Open File Explorer > In the address bar type > "\\\source-machine-ip\C$" > click Enter. </br>
  ![Fileshare1](./media/site-recovery-protection-common-errors/fileshare1.png) </br>
  2. File explorer will prompt for credentials. Enter the username and password > click OK.</br>
   If source machine is domain joined, provide the domain name along with user name as "domainName\username".</br>
   If source machine is in workgroup, provide only the "username". </br>
  ![Fileshare2](./media/site-recovery-protection-common-errors/fileshare2.png) </br>
  3. If connection is successful, you can view the folders of source machine remotely from Process Server (PS) </br>
  ![Fileshare3](./media/site-recovery-protection-common-errors/fileshare3.png) </br>

> [!NOTE] 
> If connection is unsuccessful, please check whether all pre-requisites are met.
>

If you don’t want to open “Windows Management Instrumentation”, you can also install mobility service manually on the source machine.</br> [Install Mobility Service manually through GUI](site-recovery-vmware-to-azure-install-mob-svc.md#install-mobility-service-manually-by-using-the-gui) </br>
[Installation through configuration manager guidance](site-recovery-install-mobility-service-using-sccm.md) </br>

## Next steps
- [Enable replication for VMware virtual machines](vmware-walkthrough-enable-replication.md)
