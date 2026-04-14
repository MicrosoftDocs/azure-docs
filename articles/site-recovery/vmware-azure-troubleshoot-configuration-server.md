---
title: Troubleshoot Configuration Server Issues During Disaster Recovery by Using Site Recovery
description: This article provides troubleshooting information for deploying the configuration server for disaster recovery of VMware VMs and physical servers to Azure by using Azure Site Recovery.
ms.service: azure-site-recovery
ms.topic: troubleshooting
ms.date: 12/09/2025
author: Jeronika-MS
ms.author: v-gajeronika 

# Customer intent: As a system administrator, I want to troubleshoot issues with the configuration server during disaster recovery of VMware VMs and physical servers to the cloud so that I can ensure a successful and reliable disaster recovery process.
---
# Troubleshoot configuration server issues

This article helps you troubleshoot issues when you deploy and manage the [Azure Site Recovery](site-recovery-overview.md) configuration server. The configuration server acts as a management server. Use the configuration server to set up disaster recovery of on-premises VMware virtual machines (VMs) and physical servers to Azure by using Site Recovery. The following sections discuss the most common failures that you might experience when you add and manage a new configuration server.

## Registration failures

The source machine registers with the configuration server when you install the mobility agent. You can debug any failures during this step by following these guidelines:

1. Open the `C:\ProgramData\ASR\home\svsystems\var\configurator_register_host_static_info.log` file. The `ProgramData` folder might be a hidden folder.

1. If you don't see the `ProgramData` folder, in File Explorer, on the **View** tab, in the **Show/hide** section, select the **Hidden items** checkbox. Multiple issues might cause failures.

1. Search for the string **No Valid IP Address found**:

    - If the string is found:

      1. Verify that the requested host ID is the same as the host ID of the source machine.
      1. Verify that the source machine has at least one IP address assigned to the physical network interface card (NIC). For agent registration with the configuration server to succeed, the source machine must have at least one valid IP v4 address assigned to the physical NIC.
      1. Run one of the following commands on the source machine to get all the IP addresses of the source machine:

         - **Windows**: `> ipconfig /all`
         - **Linux**: `# ifconfig -a`

    - If the string isn't found:

      1. Search for the string **Reason=>NULL**. This error occurs if the source machine uses an empty host to register with the configuration server.

      1. If the string **Reason=>NULL** is found, retry the registration manually after you resolve the issues. Follow the guidelines in [Register the source machine with the configuration server](vmware-azure-troubleshoot-configuration-server.md#register-source-machine-with-configuration-server).

         If the string **Reason=>NULL** isn't found:

         1. On the source machine, open the `C:\ProgramData\ASRSetupLogs\UploadedLogs\ASRUnifiedAgentInstaller.log` file. The `ProgramData` folder might be a hidden folder.
         1. If you don't see the `ProgramData` folder, in File Explorer, on the **View** tab, in the **Show/hide** section, select the **Hidden items** checkbox. Multiple issues might cause failures.

1. Search for the string **post request: (7) - Couldn't connect to server**:

    - If the string is found:

      1. Resolve the network issues between the source machine and the configuration server. Verify that the configuration server is reachable from the source machine by using network tools like ping, traceroute, or a web browser. Ensure that the source machine can reach the configuration server through port 443.
 
      1. Check whether any firewall rules on the source machine block the connection between the source machine and the configuration server. Work with your network admins to unblock any connection issues.

      1. Ensure that the folders listed in [Site Recovery folder exclusions from antivirus programs](vmware-azure-set-up-source.md#azure-site-recovery-folder-exclusions-from-antivirus-program) are excluded from the antivirus software.

      1. When network issues are resolved, retry the registration by following the guidelines in [Register the source machine with the configuration server](vmware-azure-troubleshoot-configuration-server.md#register-source-machine-with-configuration-server).

    - If the string isn't found:

      1. In the same log file, look for the string **request: (60) - Peer certificate cannot be authenticated with given CA certificates**. This error might occur because the configuration server certificate expired or the source machine doesn't support Transport Layer Security (TLS) 1.0 or later protocols. It also might occur if a firewall blocks TLS communication between the source machine and the configuration server.
  
      1. If the string **request: (60) - Peer certificate cannot be authenticated with given CA certificates** is found:

         1. Connect to the configuration server IP address by using a web browser on the source machine. Use the URI `https:\/\/<configuration server IP address\>:443/`. Ensure that the source machine can reach the configuration server through port 443.
         1. Check whether any firewall rules on the source machine need to be added or removed for the source machine to talk to the configuration server. Because of the variety of firewall software that might be in use, we can't list all required firewall configurations. Work with your network admins to unblock any connection issues.
         1. Ensure that the folders listed in [Site Recovery folder exclusions from antivirus programs](vmware-azure-set-up-source.md#azure-site-recovery-folder-exclusions-from-antivirus-program) are excluded from the antivirus software.  
         1. After you resolve the issues, retry the registration by following the guidelines in [Register the source machine with the configuration server](vmware-azure-troubleshoot-configuration-server.md#register-source-machine-with-configuration-server).

1. On Linux, if the value of the platform in `<INSTALLATION_DIR\>/etc/drscout.conf` is corrupted, registration fails. To identify this issue, open the `/var/log/ua_install.log` file. Search for the string **Aborting configuration as VM_PLATFORM value is either null or it is not VmWare/Azure**. The platform should be set to either **VmWare** or **Azure**. If the `drscout.conf` file is corrupted, we recommend that you [uninstall the mobility agent](vmware-physical-manage-mobility-service.md#uninstall-mobility-service) and then reinstall the mobility agent. If uninstallation fails, follow these steps:

    1. Open the `Installation_Directory/uninstall.sh` file and comment out the call to the `StopServices` function.

    1. Open the `Installation_Directory/Vx/bin/uninstall.sh` file and comment out the call to the `stop_services` function.

    1. Open the `Installation_Directory/Fx/uninstall.sh` file and comment out the entire section that's trying to stop the Fx service.

    1. [Uninstall](vmware-physical-manage-mobility-service.md#uninstall-mobility-service) the mobility agent. After successful uninstallation, reboot the system, and then try to reinstall the mobility agent.

1. Ensure that multifactor authentication (MFA) isn't enabled for the user account. Currently, Site Recovery doesn't support MFA for user accounts. Register the configuration server without the MFA-enabled user account.

## Installation failure: Failed to load accounts

This error occurs when the service can't read data from the transport connection when it installs the mobility agent and registers with the configuration server. To resolve the issue, ensure that TLS 1.0 is enabled on your source machine.

## vCenter discovery failures

To resolve vCenter discovery failures, add the vCenter server to the `byPass` list proxy settings:

- Download the `PsExec` tool from [PsExec v2.43](/sysinternals/downloads/psexec) to access the system user content.
- Open Internet Explorer in the system user content by running the following command line:
    `psexec -s -i "%programfiles%\Internet Explorer\iexplore.exe"`
- Add proxy settings in Internet Explorer and restart the `tmanssvc` service.
- To configure proxy settings for disaster recovery architecture, run the following command:
    `cd C:\Program Files\Microsoft Azure Site Recovery Provider`
- Run `DRCONFIGURATOR.EXE /configure /AddBypassUrls [add IP Address/FQDN of vCenter Server provided during the Configure vCenter Server/vSphere ESXi server step of [Configuration Server deployment](vmware-azure-deploy-configuration-server.md#configure-settings)]`.

## Change the IP address of the configuration server

We strongly recommend that you don't change the IP address of a configuration server. Ensure that all IP addresses that are assigned to the configuration server are static IP addresses. Don't use Dynamic Host Configuration Protocol IP addresses.

## ACS50008: SAML token is invalid

To avoid this error, ensure that the time on your system clock isn't different from the local time by more than 15 minutes. Rerun the installer to finish the registration.

## Failed to create a certificate

A certificate that's required to authenticate Site Recovery can't be created. Rerun setup after you ensure that you're running setup as a local administrator.

## Failure to activate Windows license from Server Standard Evaluation to Server Standard

1. As part of configuration server deployment through Open Virtualization Format (OVF), an evaluation license is used, which is valid for 180 days. You need to activate this license before it expires. Otherwise, the configuration server can shut down frequently, which hinders replication activities.
1. If you can't activate the Windows license, contact the [Windows support team](https://aka.ms/Windows_Support) to resolve the issue.

## Register source machine with configuration server

### If the source machine runs Windows

Run the following command on the source machine:

```
  cd C:\Program Files (x86)\Microsoft Azure Site Recovery\agent
  UnifiedAgentConfigurator.exe  /CSEndPoint <configuration server IP address> /PassphraseFilePath <passphrase file path>
```

Setting | Details
--- | ---
Usage | `UnifiedAgentConfigurator.exe  /CSEndPoint <configuration server IP address\> /PassphraseFilePath <passphrase file path\>`
Agent configuration logs | Located under `%ProgramData%\ASRSetupLogs\ASRUnifiedAgentConfigurator.log`.
`/CSEndPoint` | Mandatory parameter. Specifies the IP address of the configuration server. Use any valid IP address.
`/PassphraseFilePath` |  Mandatory. The location of the passphrase. Use any valid Universal Naming Convention or local file path.

### If the source machine runs Linux

Run the following command on the source machine:

```
  /usr/local/ASR/Vx/bin/UnifiedAgentConfigurator.sh -i <configuration server IP address> -P /var/passphrase.txt
  ```

Setting | Details
--- | ---
Usage | `cd /usr/local/ASR/Vx/bin`<br /><br /> `UnifiedAgentConfigurator.sh -i <configuration server IP address\> -P <passphrase file path\>`
`-i` | Mandatory parameter. Specifies the IP address of the configuration server. Use any valid IP address.
`-P` | Mandatory. The full file path of the file in which the passphrase is saved. Use any valid folder.

## Unable to configure the configuration server

If you install applications other than the configuration server on the VM, you might be unable to configure the master target.

The configuration server must be a single-purpose server. Using it as a shared server is unsupported.

For more information, see the configuration FAQ in [Deploy a configuration server](vmware-azure-deploy-configuration-server.md#faqs).

## Remove the stale entries for protected items from the configuration server database

To remove a stale protected machine on the configuration server, follow these steps:

1. To determine the source machine and IP address of the stale entry:

    1. Open the MYSQL command line in administrator mode.
    1. Run the following commands:
   
        ```
        mysql> use svsdb1;
        mysql> select id as hostid, name, ipaddress, ostype as operatingsystem, from_unixtime(lasthostupdatetime) as heartbeat from hosts where name!='InMageProfiler'\G;
        ```

        This command returns the list of registered machines along with their IP addresses and last heartbeat. Find the host that has stale replication pairs.

1. Open an elevated command prompt and go to `C:\ProgramData\ASR\home\svsystems\bin`.
1. To remove the registered hosts details and the stale entry information from the configuration server, run the following command by using the source machine and the IP address of the stale entry.

    `Syntax: Unregister-ASRComponent.pl -IPAddress <IP_ADDRESS_OF_MACHINE_TO_UNREGISTER> -Component <Source/ PS / MT>`

    If you have a source server entry of `"OnPrem-VM01"` with an IP address of 10.0.0.4, use the following command instead:

    `perl Unregister-ASRComponent.pl -IPAddress 10.0.0.4 -Component Source`

1. Restart the following services on the source machine to reregister with the configuration server:

    - InMage Scout Application Service
    - InMage Scout VX Agent - Sentinel/Outpost

## Upgrade fails when the services fail to stop

The configuration server upgrade fails when certain services don't stop.

To identify the issue, go to `C:\ProgramData\ASRSetupLogs\CX_TP_InstallLogFile` on the configuration server. If you find the following errors, follow these steps to resolve the issue:

```output
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
```

To resolve the issue:

Manually stop the following services:

- `cxprocessserver`
- InMage Scout VX Agent – Sentinel/Outpost
- Microsoft Azure Recovery Services (MARS) agent
- Azure Site Recovery
- `tmansvc`

To update the configuration server, run [Unified Setup](/azure/site-recovery/service-updates-how-to#updates-support) again.

<a name='azure-active-directory-application-creation-failure'></a>

## Microsoft Entra application creation failure

You have insufficient permissions to create an application in Microsoft Entra ID by using the [OVA](vmware-azure-deploy-configuration-server.md#deploy-a-configuration-server-through-an-ova-template) template.

To resolve the issue, sign in to the Azure portal and choose one of the following options:

- Request the Application Developer role in Microsoft Entra ID. For more information on the Application Developer role, see [Administrator role permissions in Microsoft Entra ID](../active-directory/roles/permissions-reference.md).
- Verify that the **User can create application** flag is set to **true** in Microsoft Entra ID. For more information, see [Use the portal to create a Microsoft Entra application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md#permissions-required-for-registering-an-app).

## Process server/master targets are unable to communicate with the configuration server

The process server and master target (MT) modules are unable to communicate with the configuration server. Their status is shown as not connected in the Azure portal.

Typically, this issue occurs because of an error with port 443. Use the following steps to unblock the port and reenable communication with the configuration server.

#### Verify that the MARS agent is being invoked by the master target agent

To verify that the master target agent (MTA) can create a TCP session for the configuration server IP, look for a trace similar to the following traces in the MTA logs:

`TCP \<Replace IP with CS IP here>:52739 \<Replace IP with CS IP here>:443 SYN_SENT` 

`TCP    192.168.1.40:52739     192.168.1.40:443      SYN_SENT  // Replace IP with CS IP here`

If you find traces similar to the following traces in the MTA logs, the MTA is reporting errors on port 443:

```output
#~> (11-20-2018 20:31:51):   ERROR  2508 8408 313 FAILED : PostToSVServer with error [at curlwrapper.cpp:CurlWrapper::processCurlResponse:212]   failed to post request: (7) - Couldn't connect to server
#~> (11-20-2018 20:31:54):   ERROR  2508 8408 314 FAILED : PostToSVServer with error [at curlwrapper.cpp:CurlWrapper::processCurlResponse:212]   failed to post request: (7) - Couldn't connect to server
```

This error might occur when other applications are also using port 443 or because a firewall setting blocks the port.

To resolve the issue:

- Verify that your firewall isn't blocking port 443.
- If the port is unreachable because of another application using that port, stop and uninstall the app.
  - If stopping the app isn't feasible, set up a new clean configuration server.
- Restart the configuration server.
- Restart Internet Information Services.

### Configuration server isn't connected because of incorrect UUID entries

This error can occur when there are multiple configuration server instance universally unique identifier (UUID) entries in the database. The issue often occurs when you clone the configuration server VM.

To resolve the issue:

1. Remove the stale/old configuration server VM from vCenter. For more information, see [Remove servers and disable protection](site-recovery-manage-registration-and-protection.md).
1. Sign in to the configuration server VM and connect to the MySQL `svsdb1` database.
1. Run the following query:

    > [!IMPORTANT]
    >
    > Verify that you're entering the UUID details of the cloned configuration server or the stale entry of the configuration server that's no longer used to protect VMs. Entering an incorrect UUID results in losing the information for all existing protected items.
   
    ```
        MySQL> use svsdb1;
        MySQL> delete from infrastructurevms where infrastructurevmid='<Stale CS VM UUID>';
        MySQL> commit; 
    ```
1. Refresh the portal page.

## An infinite sign-in loop occurs when you enter your credentials

After you enter the correct username and password on the configuration server OVF, Azure sign-in continues to prompt for the correct credentials.

This issue can occur when the system time is incorrect.

To resolve the issue, set the correct time on the computer and retry the sign-in.
