---
title: Troubleshoot issues with the configuration server during disaster recovery of VMware VMs and physical servers to Azure by using Azure Site Recovery | Microsoft Docs
description: This article provides troubleshooting information for deploying the configuration server for disaster recovery of VMware VMs and physical servers to Azure by using Azure Site Recovery.
author: Rajeswari-Mamilla
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 02/13/2019
ms.author: ramamill

---
# Troubleshoot configuration server issues

This article helps you troubleshoot issues when you deploy and manage the [Azure Site Recovery](site-recovery-overview.md) configuration server. The configuration server acts as a management server. Use the configuration server to set up disaster recovery of on-premises VMware VMs and physical servers to Azure by using Site Recovery. The following sections discuss the most common failures you might experience when you add a new configuration server and when you manage a configuration server.

## Registration failures

The source machine registers with the configuration server when you install the mobility agent. You can debug any failures during this step by following these guidelines:

1. Open the C:\ProgramData\ASR\home\svsystems\var\configurator_register_host_static_info.log file. (The ProgramData folder might be a hidden folder. If you don't see the ProgramData folder, in File Explorer, on the **View** tab, in the **Show/hide** section, select the **Hidden items** check box.) Failures might be caused by multiple issues.

2. Search for the string **No Valid IP Address found**. If the string is found:
   1. Verify that the requested host ID is the same as the host ID of the source machine.
   2. Verify that the source machine has at least one IP address assigned to the physical NIC. For agent registration with the configuration server to succeed, the source machine must have at least one valid IP v4 address assigned to the physical NIC.
   3. Run one of the following commands on the source machine to get all the IP addresses of the source machine:
      - For Windows: `> ipconfig /all`
      - For Linux: `# ifconfig -a`

3. If the string **No Valid IP Address found** isn't found, search for the string **Reason=>NULL**. This error occurs if the source machine uses an empty host to register with the configuration server. If the string is found:
    - After you resolve the issues, follow guidelines in [Register the source machine with the configuration server](vmware-azure-troubleshoot-configuration-server.md#register-source-machine-with-configuration-server) to retry the registration manually.

4. If the string **Reason=>NULL** isn't found, on the source machine, open the C:\ProgramData\ASRSetupLogs\UploadedLogs\ASRUnifiedAgentInstaller.log file. (The ProgramData folder might be a hidden folder. If you don't see the ProgramData folder, in File Explorer, on the **View** tab, in the **Show/hide** section, select the **Hidden items** check box.) Failures might be caused by multiple issues. 

5. Search for the string **post request: (7) - Couldn't connect to server**. If the string is found:
    1. Resolve the network issues between the source machine and the configuration server. Verify that the configuration server is reachable from the source machine by using network tools like ping, traceroute, or a web browser. Ensure that the source machine can reach the configuration server through port 443.
    2. Check whether any firewall rules on the source machine block the connection between the source machine and the configuration server. Work with your network admins to unblock any connection issues.
    3. Ensure that the folders listed in [Site Recovery folder exclusions from antivirus programs](vmware-azure-set-up-source.md#azure-site-recovery-folder-exclusions-from-antivirus-program) are excluded from the antivirus software.
    4. When network issues are resolved, retry the registration by following the guidelines in [Register the source machine with the configuration server](vmware-azure-troubleshoot-configuration-server.md#register-source-machine-with-configuration-server).

6. If the string **post request: (7) - Couldn't connect to server** isn't found, in the same log file, look for the string **request: (60) - Peer certificate cannot be authenticated with given CA certificates**. This error might occur because the configuration server certificate has expired or the source machine doesn't support TLS 1.0 or later protocols. It also might occur if a firewall blocks TLS communication between the source machine and the configuration server. If the string is found: 
    1. To resolve, connect to the configuration server IP address by using a web browser on the source machine. Use the URI https:\/\/<configuration server IP address\>:443/. Ensure that the source machine can reach the configuration server through port 443.
    2. Check whether any firewall rules on the source machine need to be added or removed for the source machine to talk to the configuration server. Because of the variety of firewall software that might be in use, we can't list all required firewall configurations. Work with your network admins to unblock any connection issues.
    3. Ensure that the folders listed in [Site Recovery folder exclusions from antivirus programs](vmware-azure-set-up-source.md#azure-site-recovery-folder-exclusions-from-antivirus-program) are excluded from the antivirus software.  
    4. After you resolve the issues, retry the registration by following guidelines in [Register the source machine with the configuration server](vmware-azure-troubleshoot-configuration-server.md#register-source-machine-with-configuration-server).

7. On Linux, if the value of the platform in <INSTALLATION_DIR\>/etc/drscout.conf is corrupted, registration fails. To identify this issue, open the /var/log/ua_install.log file. Search for the string **Aborting configuration as VM_PLATFORM value is either null or it is not VmWare/Azure**. The platform should be set to either **VmWare** or **Azure**. If the drscout.conf file is corrupted, we recommend that you [uninstall the mobility agent](vmware-physical-manage-mobility-service.md#uninstall-mobility-service) and then reinstall the mobility agent. If uninstallation fails, complete the following steps:
    a. Open the Installation_Directory/uninstall.sh file and comment out the call to the **StopServices** function.
    b. Open the Installation_Directory/Vx/bin/uninstall.sh file and comment out the call to the **stop_services** function.
    c. Open the Installation_Directory/Fx/uninstall.sh file and comment out the entire section that's trying to stop the Fx service.
    d. [Uninstall](vmware-physical-manage-mobility-service.md#uninstall-mobility-service) the mobility agent. After successful uninstallation, reboot the system, and then try to reinstall the mobility agent.

8. Ensure that multi-factor authentication is not enabled for user account. Azure Site Recovery does not support multi-factor authentication for user account as of now. Register the configuration server without multi-factor authentication enabled user account.  

## Installation failure: Failed to load accounts

This error occurs when the service can't read data from the transport connection when it's installing the mobility agent and registering with the configuration server. To resolve the issue, ensure that TLS 1.0 is enabled on your source machine.

## vCenter discovery failures

To resolve vCenter discovery failures, add the vCenter server to the byPass list proxy settings. 

- Download PsExec tool from [here](https://aka.ms/PsExec) to access System user content.
- Open Internet Explorer in system user content by running the following command line
    psexec -s -i "%programfiles%\Internet Explorer\iexplore.exe"
- Add proxy settings in IE and restart tmanssvc service.
- To configure DRA proxy settings, run 
    cd C:\Program Files\Microsoft Azure Site Recovery Provider
- Next, execute DRCONFIGURATOR.EXE /configure /AddBypassUrls [add IP Address/FQDN of vCenter Server provided during **Configure vCenter Server/vSphere ESXi server** step of [Configuration Server deployment](vmware-azure-deploy-configuration-server.md#configure-settings)]

## Change the IP address of the configuration server

We strongly recommend that you don't change the IP address of a configuration server. Ensure that all IP addresses that are assigned to the configuration server are static IP addresses. Don't use DHCP IP addresses.

## ACS50008: SAML token is invalid

To avoid this error, ensure that the time on your system clock isn't different from the local time by more than 15 minutes. Rerun the installer to complete the registration.

## Failed to create a certificate

A certificate that's required to authenticate Site Recovery can't be created. Rerun setup after you ensure that you're running setup as a local administrator.

## Failure to activate Windows License from Server Standard EVALUATION to Server Standard

1. As part of Configuration server deployment through OVF, an evaluation license is used, which is valid for 180 days. You need to activate this License before this gets expired. Else, this can result in frequent shutdown of configuration server and thus cause hindrance to replication activities.
2. If you are unable to activate Windows license, reach out to [Windows support team](https://aka.ms/Windows_Support) to resolve the issue.

## Register source machine with configuration server

### If the source machine runs Windows

Run the following command on the source machine:

```
  cd C:\Program Files (x86)\Microsoft Azure Site Recovery\agent
  UnifiedAgentConfigurator.exe  /CSEndPoint <configuration server IP address> /PassphraseFilePath <passphrase file path>
```

Setting | Details
--- | ---
Usage | UnifiedAgentConfigurator.exe  /CSEndPoint <configuration server IP address\> /PassphraseFilePath <passphrase file path\>
Agent configuration logs | Located under %ProgramData%\ASRSetupLogs\ASRUnifiedAgentConfigurator.log.
/CSEndPoint | Mandatory parameter. Specifies the IP address of the configuration server. Use any valid IP address.
/PassphraseFilePath |  Mandatory. The location of the passphrase. Use any valid UNC or local file path.

### If the source machine runs Linux

Run the following command on the source machine:

```
  /usr/local/ASR/Vx/bin/UnifiedAgentConfigurator.sh -i <configuration server IP address> -P /var/passphrase.txt
  ```

Setting | Details
--- | ---
Usage | cd /usr/local/ASR/Vx/bin<br /><br /> UnifiedAgentConfigurator.sh -i <configuration server IP address\> -P <passphrase file path\>
-i | Mandatory parameter. Specifies the IP address of the configuration server. Use any valid IP address.
-P |  Mandatory. The full file path of the file in which the passphrase is saved. Use any valid folder.

## Unable to configure the configuration server

If you install applications other than the configuration server on the virtual machine, you might be unable to configure the master target. 

The configuration server must be a single purpose server and using it as a shared server is unsupported. 

For more information, see the configuration FAQ in [Deploy a configuration server](vmware-azure-deploy-configuration-server.md#faqs). 

## Remove the stale entries for protected items from the configuration server database 

To remove stale protected machine on the configuration server, use the following steps. 
 
1. To determine the source machine and IP address of the stale entry: 

    1. Open the MYSQL cmdline in administrator mode. 
    2. Execute the following commands. 
   
        ```
        mysql> use svsdb1;
        mysql> select id as hostid, name, ipaddress, ostype as operatingsystem, from_unixtime(lasthostupdatetime) as heartbeat from hosts where name!='InMageProfiler'\G;
        ```

        This returns the list of registered machines along with their IP addresses and last heart beat. Find the host that has stale replication pairs.

2. Open an elevated command prompt and navigate to C:\ProgramData\ASR\home\svsystems\bin. 
4. To remove the registered hosts details and the stale entry information from the configuration server, run the following command using the source machine and the IP address of the stale entry. 
   
    `Syntax: Unregister-ASRComponent.pl -IPAddress <IP_ADDRESS_OF_MACHINE_TO_UNREGISTER> -Component <Source/ PS / MT>`
 
    If you have a source server entry of "OnPrem-VM01" with an ip-address of 10.0.0.4 then use the following command instead.
 
    `perl Unregister-ASRComponent.pl -IPAddress 10.0.0.4 -Component Source`
 
5. Restart the following services on source machine to reregister with the configuration server. 
 
    - InMage Scout Application Service
    - InMage Scout VX Agent - Sentinel/Outpost

## Upgrade fails when the services fail to stop

The configuration server upgrade fails when certain services do not stop. 

To identify the issue, navigate to C:\ProgramData\ASRSetupLogs\CX_TP_InstallLogFile on the configuration server. If you find following errors, use the steps below to resolve the issue: 

	2018-06-28 14:28:12.943   Successfully copied php.ini to C:\Temp from C:\thirdparty\php5nts
	2018-06-28 14:28:12.943   svagents service status - SERVICE_RUNNING
	2018-06-28 14:28:12.944   Stopping svagents service.
	2018-06-28 14:31:32.949   Unable to stop svagents service.
	2018-06-28 14:31:32.949   Stopping svagents service.
	2018-06-28 14:34:52.960   Unable to stop svagents service.
	2018-06-28 14:34:52.960   Stopping svagents service.
	2018-06-28 14:38:12.971   Unable to stop svagents service.
	2018-06-28 14:38:12.971   Rolling back the install changes.
	2018-06-28 14:38:12.971   Upgrade has failed.

To resolve the issue:

Manually stop the following services:

- cxprocessserver
- InMage Scout VX Agent – Sentinel/Outpost, 
- Microsoft Azure Recovery Services Agent, 
- Microsoft Azure Site Recovery Service, 
- tmansvc
  
To update the configuration server, run the [unified setup](service-updates-how-to.md#links-to-currently-supported-update-rollups) again.

## Azure Active Directory application creation failure

You have insufficient permissions to create an application in Azure Active Directory (AAD) using the [Open Virtualization Application (OVA)](vmware-azure-deploy-configuration-server.md#deploy-a-configuration-server-through-an-ova-template
) template.

To resolve the issue, sign in to the Azure portal and do one of the following:

- Request the Application Developer role in AAD. For more information on the Application Developer role, see [Administrator role permissions in Azure Active Directory](../active-directory/users-groups-roles/directory-assign-admin-roles.md).
- Verify that the **User can create application** flag is set to *true* in AAD. For more information, see [How to: Use the portal to create an Azure AD application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md#permissions-required-for-registering-an-app).

## Process server/Master Target are unable to communicate with the configuration server 

The process server (PS) and Master Target (MT) modules are unable to communicate with the configuration server (CS) and their status is shown as not connected on Azure portal.

Typically, this is due to an error with port 443. Use the following steps to unblock the port and re-enable communication with the CS.

**Verify that the MARS agent is being invoked by the Master Target agent**

To verify that the Master Target Agent can create a TCP session for the Configuration server IP, look for a trace similar to the following in the Master Target agent logs:

TCP \<Replace IP with CS IP here>:52739 \<Replace IP with CS IP here>:443 SYN_SENT 

TCP    192.168.1.40:52739     192.168.1.40:443      SYN_SENT  // Replace IP with CS IP here

If you find traces similar to the following in the MT agent logs, the MT Agent is reporting errors on port 443:

    #~> (11-20-2018 20:31:51):   ERROR  2508 8408 313 FAILED : PostToSVServer with error [at curlwrapper.cpp:CurlWrapper::processCurlResponse:212]   failed to post request: (7) - Couldn't connect to server
    #~> (11-20-2018 20:31:54):   ERROR  2508 8408 314 FAILED : PostToSVServer with error [at curlwrapper.cpp:CurlWrapper::processCurlResponse:212]   failed to post request: (7) - Couldn't connect to server
 
This error can be encountered when other applications are also using port 443 or due to a firewall setting blocking the port.

To resolve the issue:

- Verify that port 443 is not blocked by your firewall.
- If the port is unreachable due to another application using that port, stop and uninstall the app.
  - If stopping the app is not feasible, setup a new clean CS.
- Restart the configuration server.
- Restart the IIS service.

### Configuration server is not connected due to incorrect UUID entries

This error can occur when there are multiple configuration server (CS) instance UUID entries in the database. The issue often occurs when you clone the configuration server VM.

To resolve the issue:

1. Remove stale/old CS VM from vCenter. For more information, see  [Remove servers and disable protection](site-recovery-manage-registration-and-protection.md).
2. Sign in to the configuration server VM and connect to the MySQL svsdb1 database. 
3. Execute the following query:

    > [!IMPORTANT]
    >
    > Verify that you are entering the UUID details of the cloned configuration server or the stale entry of the configuration server that is no longer used to protect virtual machines. Entering an incorrect UUID will result in losing the information for all existing protected items.
   
    ```
        MySQL> use svsdb1;
        MySQL> delete from infrastructurevms where infrastructurevmid='<Stale CS VM UUID>';
        MySQL> commit; 
    ```
4. Refresh the portal page.

## An infinite sign in loop occurs when entering your credentials

After entering the correct username and password on the configuration server OVF, Azure sign in continues to prompt for the correct credentials.

This issue can occur when the system time is incorrect.

To resolve the issue:

Set the correct time on the computer and retry the sign in. 
 