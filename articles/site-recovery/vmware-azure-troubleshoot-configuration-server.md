---
title: Troubleshoot issues with the configuration server during disaster recovery of VMware VMs and physical servers to Azure with Azure Site Recovery | Microsoft Docs
description: This article provides troubleshooting information for deploying the configuration server for disaster recovery of VMware VMs and physical servers to Azure with Azure Site Recovery.
author: Rajeswari-Mamilla
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 12/17/2018
ms.author: ramamill

---
# Troubleshoot configuration server issues

This article helps you troubleshoot issues when deploying and managing the [Azure Site Recovery](site-recovery-overview.md) configuration server. The configuration server acts as a management server and is used for setting up disaster recovery for on-premises VMware VMs and physical servers to Azure using Site Recovery. Following sections discusses the most common failures seen while adding a new configuration server and managing a configuration server.

## Registration failures

Source machine registers with configuration server during mobility agent installation. Any failures during this step can be debugged by following the guidelines given below:

1. Go to C:\ProgramData\ASR\home\svsystems\var\configurator_register_host_static_info.log file. ProgramData can be a hidden folder. If not able to locate, try to un-hide the folder. The failures can be due to multiple issues.
2. Search for string “No Valid IP Address found”. If the string is found,
    - Validate if requested host id is same as source machine.
    - The source machine should have at least one IP address assigned to the physical NIC for agent registration with the CS to succeed.
    - Run the command on source machine `> ipconfig /all` (for Windows OS) and `# ifconfig -a` (for Linux OS) to get all IP addresses of source machine.
    - Please note that agent registration requires a valid IP v4 address assigned to the physical NIC.
3. If the above string is not found, search for string "Reason"=>"NULL". If found,
    - When source machine uses an empty host if to register with configuration server, this error occurs.
    - After resolving the issues, follow guidelines given [here](vmware-azure-troubleshoot-configuration-server.md#register-source-machine-with-configuration-server) to retry the registration manually.
4. If the above string is not found, go to source machine, and check the log C:\ProgramData\ASRSetupLogs\UploadedLogs\* ASRUnifiedAgentInstaller.log ProgramData can be a hidden folder. If not able to locate, try to un-hide the folder. The failures can be due to multiple issues. Search for string “post request: (7) - Couldn't connect to server”. If found,
    - Resolve the network issues between the source machine and configuration server. Verify that configuration server is reachable from source machine using network tools like ping, traceroute, web browser etc., Make sure that source machine is able to reach configuration server through port 443.
    - Check if there are any firewall rules on source machine are blocking the connection between source machine and configuration server. Work with the your network admins to unblock the connection issues.
    - Ensure the folders mentioned [here](vmware-azure-set-up-source.md#azure-site-recovery-folder-exclusions-from-antivirus-program) are excluded from the antivirus software.
    - After resolving the network issues, retry the registration by following guidelines given [here](vmware-azure-troubleshoot-configuration-server.md#register-source-machine-with-configuration-server).
5. If not found, in the same log look for string "request: (60) - Peer certificate cannot be authenticated with given CA certificates.". If found, 
    - This error could be because the configuration server certificate has expired or source machine doesn't support TLS 1.0 and above SSL protocols or there is a firewall that is blocking SSL communication between source machine and configuration server.
    - To resolve, connect to configuration server IP address using a web browser on source machine with the help of URI https://<CSIPADDRESS>:443/. Make sure that source machine is able to reach configuration server through port 443.
    - Check if there are any firewall rules on the source machine to be added/removed for the source machine to talk to CS. Since there could be many different firewall software, it is not possible to list down the configs required, please work with the customer network admins.
    - Ensure the folders mentioned [here](vmware-azure-set-up-source.md#azure-site-recovery-folder-exclusions-from-antivirus-program) are excluded from the antivirus software.  
    - After resolving the issues, retry the registration by following guidelines given [here](vmware-azure-troubleshoot-configuration-server.md#register-source-machine-with-configuration-server).
6. In Linux, if the value of platform from <INSTALLATION_DIR>/etc/drscout.conf is corrupted, then registration fails. To identify, go to the log /var/log/ua_install.log. You will find the string "Aborting configuration as VM_PLATFORM value is either null or it is not VmWare/Azure." The platform should be set to either "VmWare" or "Azure". As the drscout.conf file is corrupted, it is recommended to [uninstall](vmware-physical-mobility-service-overview.md#uninstall-the-mobility-service) the mobility agent and re-install. If un-installation fails, follow the below steps:
    - Open file Installation_Directory/uninstall.sh and comment out the call to the function *StopServices*
    - Open file Installation_Directory/Vx/bin/uninstall and comment out the call to the function `stop_services`
    - Open file Installation_Directory/Fx/uninstall and comment out the complete section that is trying to stop the Fx service.
    - Now try to [uninstall](vmware-physical-mobility-service-overview.md#uninstall-the-mobility-service) the mobility agent. After successful un-installation, reboot the system and try to install the agent again.

## Installation failure - Failed to load accounts

This error occurs when service is unable to read data from the transport connection while installing mobility agent and registering with configuration server. To resolve, ensure TLS 1.0 is enable on your source machine.

## Change IP address of configuration server

It is strongly advised to not change the IP address of a configuration server. Ensure all IPs assigned to the Configuration Server are static IPs and not DHCP IPs.

## ACS50008: SAML token is invalid

To avoid this error, ensure that the time on your system clock is not more than 15 minutes off the local time. Rerun the installer to complete the registration.

## Failed to create certificate

A certificate required to authenticate Site Recovery cannot be created. Rerun Setup after ensuring that you are running setup as a local administrator.

## Register source machine with configuration server

### If source machine has Windows OS

Run the following command on source machine

```
  cd C:\Program Files (x86)\Microsoft Azure Site Recovery\agent
  UnifiedAgentConfigurator.exe  /CSEndPoint <CSIP> /PassphraseFilePath <PassphraseFilePath>
  ```
**Setting** | **Details**
--- | ---
Usage | UnifiedAgentConfigurator.exe  /CSEndPoint <CSIP> /PassphraseFilePath <PassphraseFilePath>
Agent configuration logs | Under %ProgramData%\ASRSetupLogs\ASRUnifiedAgentConfigurator.log.
/CSEndPoint | Mandatory parameter. Specifies the IP address of the configuration server. Use any valid IP address.
/PassphraseFilePath |  Mandatory. Location of the passphrase. Use any valid UNC or local file path.

### If source machine has Linux OS

Run the following command on source machine

```
  /usr/local/ASR/Vx/bin/UnifiedAgentConfigurator.sh -i <CSIP> -P /var/passphrase.txt
  ```
**Setting** | **Details**
--- | ---
Usage | cd /usr/local/ASR/Vx/bin<br/><br/> UnifiedAgentConfigurator.sh -i <CSIP> -P <PassphraseFilePath>
-i | Mandatory parameter. Specifies the IP address of the configuration server. Use any valid IP address.
-P |  Mandatory. Full file path of the file in which the passphrase is saved. Use any valid folder