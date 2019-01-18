---
title: Troubleshoot issues with the configuration server during disaster recovery of VMware VMs and physical servers to Azure by using Azure Site Recovery | Microsoft Docs
description: This article provides troubleshooting information for deploying the configuration server for disaster recovery of VMware VMs and physical servers to Azure by using Azure Site Recovery.
author: Rajeswari-Mamilla
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 01/14/2019
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

6. If the string **post request: (7) - Couldn't connect to server** isn't found, in the same log file, look for the string **request: (60) - Peer certificate cannot be authenticated with given CA certificates**. This error might occur because the configuration server certificate has expired or the source machine doesn't support TLS 1.0 or later SSL protocols. It also might occur if a firewall blocks SSL communication between the source machine and the configuration server. If the string is found: 
    1. To resolve, connect to the configuration server IP address by using a web browser on the source machine. Use the URI https:\/\/<configuration server IP address\>:443/. Ensure that the source machine can reach the configuration server through port 443.
    2. Check whether any firewall rules on the source machine need to be added or removed for the source machine to talk to the configuration server. Because of the variety of firewall software that might be in use, we can't list all required firewall configurations. Work with your network admins to unblock any connection issues.
    3. Ensure that the folders listed in [Site Recovery folder exclusions from antivirus programs](vmware-azure-set-up-source.md#azure-site-recovery-folder-exclusions-from-antivirus-program) are excluded from the antivirus software.  
    4. After you resolve the issues, retry the registration by following guidelines in [Register the source machine with the configuration server](vmware-azure-troubleshoot-configuration-server.md#register-source-machine-with-configuration-server).

7. On Linux, if the value of the platform in <INSTALLATION_DIR\>/etc/drscout.conf is corrupted, registration fails. To identify this issue, open the /var/log/ua_install.log file. Search for the string **Aborting configuration as VM_PLATFORM value is either null or it is not VmWare/Azure**. The platform should be set to either **VmWare** or **Azure**. If the drscout.conf file is corrupted, we recommend that you [uninstall the mobility agent](vmware-physical-mobility-service-overview.md#uninstall-the-mobility-service) and then reinstall the mobility agent. If uninstallation fails, complete the following steps:
    1. Open the Installation_Directory/uninstall.sh file and comment out the call to the **StopServices** function.
    2. Open the Installation_Directory/Vx/bin/uninstall.sh file and comment out the call to the **stop_services** function.
    3. Open the Installation_Directory/Fx/uninstall.sh file and comment out the entire section that's trying to stop the Fx service.
    4. [Uninstall](vmware-physical-mobility-service-overview.md#uninstall-the-mobility-service) the mobility agent. After successful uninstallation, reboot the system, and then try to reinstall the mobility agent.

## Installation failure: Failed to load accounts

This error occurs when the service can't read data from the transport connection when it's installing the mobility agent and registering with the configuration server. To resolve the issue, ensure that TLS 1.0 is enabled on your source machine.

## vCenter discovery failures

In order to resolve vCenter discovery failures, ensure that vCenter server is added to the byPass list proxy settings.To perform this activity,

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

## Register the source machine with the configuration server

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

