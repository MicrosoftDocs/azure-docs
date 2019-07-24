---

title: Enable Azure Security Center for IoT service in IoT Hub| Microsoft Docs
description: Learn how to enable Azure Security Center for IoT service in your IoT Hub.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.assetid: 670e6d2b-e168-4b14-a9bf-51a33c2a9aad
ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/16/2019
ms.author: mlottner

---

# Quickstart: Onboard Azure Security Center for IoT service in IoT Hub

This article provides an explanation of how to enable the Azure Security Center for IoT service on your existing IoT Hub. If you don't currently have an IoT Hub, see [Create an IoT Hub using the Azure portal](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-create-through-portal) to get started. 

> [!NOTE]
> Azure Security Center for IoT currently only supports standard tier IoT Hubs.
> Azure Security Center for IoT is a single hub solution. If you require multiple hubs, multiple Azure Security Center for IoT solutions are required. 

## Prerequisites for enabling the service

- Log Analytics workspace
  - Two types of information are stored by default in your Log Analytics workspace by Azure Security Center for IoT; **security alerts** and **recommendations**. 
  - You can choose to add storage of an additional information type, **raw events**. Note that storing **raw events** in Log Analytics carries additional storage costs. 
- IoT Hub (standard tier)
- Meet all [service prerequisites](service-prerequisites.md) 

|Supported Azure service regions | ||
|---|---|---|
| Central US |East US |East US 2 |
| West Central US |West US |West US2 |
| Central US South|North Central US | Canada Central|
| Canada East| North Europe|Brazil South|
| France Central| UK West|UK South|
|West Europe|Northern Europe|France South |
| Japan West| Japan East | Australia Southeast|
|Australia East |  East Asia|Southeast Asia|
| Korea Central| Korea South|
 Central India| South India|

## Enable Azure Security Center for IoT on your IoT Hub 

To enable security on your IoT Hub, do the following: 

1. Open your **IoT Hub** in Azure portal. 
1. Under the **Security** menu, click **Secure your IoT solution**
1. Choose **Enable**. 
1. Select your Log analytics workspace.
1. Provide your Log Analytics Workspace details. 
   - Elect to enable **twin collection** by leaving the **twin collection** toggle **On**.
   - Elect to store **raw events** in addition to the default information types of storage by selecting the **Store raw device security events** in Log Analytics. Leave the **raw event** toggle **On**. 
    
1. Click **Save**. 

Congratulations! You've completed enabling Azure Security Center for IoT on your IoT Hub. 

## Next steps

Advance to the next article to configure your solution...

> [!div class="nextstepaction"]
> [Configure your solution](quickstart-configure-your-solution.md)


| Name |Description |Severity |RemediationSteps |
| htaccess file access detected |Analysis of host data detected possible manipulation of an htaccess file. Htaccess is a powerful configuration file that allows you to make multiple changes to a web server running Apache Web software, including basic redirect functionality, and more advanced functions, such as basic password protection. Malicious actors often modify htaccess files on compromised machines to gain persistence. |Medium |Confirm this is legitimate expected activity on the host. If not, escalate the alert to your information security team. |
| Azure IoT Security agent dropped security events |Azure IoT Security agent  dropped more than 5% of your security events in the past 24 hours. (24  hours) |Low |To avoid event loss, raise the maxMessageCacheSizeInBytes configuration. |
| Azure IoT Security agent attempted and failed to parse the Iot Edge module twin configuration |Azure IoT Security agent failed to parse the module twin configuration due to type mismatches in the configuration object. |Medium |Validate your Iot Edge module twin configuration against the IoT agent configuration schema, fix all mismatches.  |
| Binary command line |A Linux binary being called/executed from the command line was detected. This process may be legitimate activity, or an indication that your device is compromised. |High |Review the command with the user that ran it and check if this is something legitimately expected to run on the device. If not, escalate the alert to your information security team. |
| Failed Bruteforce attempt |Multiple unsuccessful login attempts identified.
Potential Bruteforce attack attempt failed on the device.
 |Low |Review SSH bruteforce alerts and the activity on the device. No further action required. |"
| Successful Bruteforce attempt |Multiple unsuccessful login attempts were identified, followed by a successful login.
Bruteforce attack attempt may have succeeded on the device.  |High |Review SSH bruteforce alert and the activity on the devices. If the activity was malicious:
1. Roll out password reset for compromised accounts.
2. Investigate and remediate (if found) devices for malware.  |"
| Custom alert - number of active connections outside the allowed range |Number of active connections within a specific time window is outside the currently configured and allowable range. |Low |Investigate the device logs. Learn where the connection originated and determine if it is benign or malicious. If malicious, remove possible malware and understand source. If benign, add the source to the allowed connection list.  |
| Custom alert - number of cloud to device messages in AMQP protocol is outside the allowed range |Number of cloud to device messages (AMQP protocol) within a specific time window is outside the currently configured and allowable range. |Low | |
| Custom alert - number of rejected cloud to device messages in AMQP protocol is outside the allowed range |Number of cloud to device messages (AMQP protocol) rejected by the device,within a specific time window is outside the currently configured and allowable range. |Low | |
| Custom alert - number of device to cloud messages in AMQP protocol is outside the allowed range |The amount of device to cloud messages (AMQP protocol) within a specific time window is outside the currently configured and allowable range. |Low | |
| Custom alert - outbound connection created to an IP that isn't allowed |An outbound connection was created to an IP that is outside your allowed IP list.  |Low |Investigate the device logs. Learn where the connection originated and determine if it is benign or malicious. If malicious, remove possible malware and understand source. If benign, add the source to the allowed IP list.  |
| Custom alert - number of direct method invokes is outside the allowed range |The amount of direct method invokes within a specific time window is outside the currently configured and allowable range. |Low | |
| Custom alert - number of failed local logins is outside the allowed range |The amount of failed local logins within a specific time window is outside the currently configured and allowable range. |Low | |
| Custom alert - number of file uploads is outside the allowed range |The amount of file uploads within a specific time window is outside the currently configured and allowable range. |Low | |
| Custom alert - number of cloud to device messages in HTTP protocol is outside the allowed range |The amount of cloud to device messages (HTTP protocol) within a specific time window is outside the currently configured and allowable range. |Low | |
| Custom alert - number of rejected cloud to device messages in HTTP protocol is outside the allowed range |The amount of cloud to device messages (HTTP protocol) rejected by the device within a specific time window is outside the currently configured and allowable range. |Low | |
| Custom alert - number of device to cloud messages in HTTP protocol is outside the allowed range |The amount of device to cloud messages (HTTP protocol)within a specific time window is outside the currently configured and allowable range. |Low | |
| Custom alert - login of a user that is not on the allowed user list  |A local user outside your allowed user list, logged in to the device. |Low |If you are saving raw data, navigate to your log analytics account and use the data to investigate the device, identify the source and then fix the allow/block list for those settings. If you are not currently saving raw data, go to the device and fix the allow/block list for those settings.   |
| Custom Alert - number of cloud to device messages in MQTT protocol is outside the allowed range |The amount of cloud to device messages (MQTT protocol) within a specific time window is outside the currently configured and allowable range. |Low | |
| Custom Alert - number of rejected cloud to device messages in MQTT protocol is outside the allowed range |The amount of cloud to device messages (MQTT protocol) rejected by the device within a specific time window is outside the currently configured and allowable range. |Low | |
| Custom Alert - number of device to cloud messages in MQTT protocol is outside the allowed range |The amount of device to cloud messages (MQTT protocol) within a specific time window is outside the currently configured and allowable range. |Low | |
| Custom Alert - a process was executed that is not allowed |A process that is not allowed was executed on the device. |Low |If you are saving raw data, navigate to your log analytics account and use the data to investigate the device, identify the source and then fix the allow/block list for those settings. If you are not currently saving raw data, go to the device and fix the allow/block list for those settings.   |
| Custom Alert - number of command queue purges is outside the allowed range |The amount of command queue purges within a specific time window is outside the currently configured and allowable range. |Low | |
| Custom Alert - number of module twin updates is outside the allowed range |The amount of twin updates within a specific time window is outside the currently configured and allowable range. |Low | |
| Custom Alert - number of unauthorized operations is outside the allowed range |The amount of unauthorized operations within a specific time window is outside the currently configured and allowable range. |Low | |
| X.509 certificate expired |X.509 Device certificate has expired. |Low |This could be a legitimate device with an expired certificate or an attempt to impersonate a legitimate  device.  If the legitimate device is currently communicating correctly this is likely an impersonation attempt. |
| x.509 device certificate thumbprint mismatch |X.509 Device certificate thumbprint did not match configuration. |Low |Review alerts on the devices. No further action required. |
| Unsuccessful attempt detected to add a certificate to an IoT Hub |There was an unsuccessful attempt to add certificate \'%{DescCertificateName}\' to IoT Hub \'%{DescIoTHubName}\'. If this action was made by an unauthorized party, it may indicate malicious activity. |Medium |Make sure permissions to change certificates are only granted to an authorized party. |
| Unsuccessful attempt detected to delete a certificate from an IoT Hub |There was an unsuccessful attempt to delete certificate \'%{DescCertificateName}\' from IoT Hub \'%{DescIoTHubName}\'. If this action was made by an unauthorized party, it may indicate malicious activity. |Medium |Make sure permissions to change certificates are only granted to an authorized party. |
| New certificate added to an IoT Hub |A certificate named \'%{DescCertificateName}\' was added to IoT Hub \'%{DescIoTHubName}\'. If this action was made by an unauthorized party, it may indicate malicious activity. |Medium |1. Make sure the certificate was added by an authorized party.
2. If not, remove the certificate and escalate the alert to the organizational security team. || Certificate deleted from an IoT Hub |A certificate named \'%{DescCertificateName}\' was deleted from IoT Hub \'%{DescIoTHubName}\'. If this action was made by an unauthorized party, it may indicate a malicious activity. |Medium |1. Make sure the certificate was removed by an authorized party.
2. If not, add back the certificate and escalate the alert to the organizational security team. |"
| Bash history cleared |Bash history log cleared. Malicious actors commonly erase bash history to hide their own commands from appearing in the logs. |Low |Review with the user that ran the command that the activity in this alert to see if you recognize this as legitimate administrative activity. If not, escalate the alert to the information security team. |
| Behavior similar to common Linux bots detected |Execution of a process normally associated with common Linux botnets detected. |Medium |Review with the user that ran the command this was legitimate activity that you expect to see on the device. If not, escalate the alert to the information security team. |
| Tools commonly used for malicious credentials access detected.  |Detection usage of a tool commonly associated with malicious attemps to access credentials.  |Medium |Review with the user that ran the command this was legitimate activity that you expect to see on the device. If not, escalate the alert to the information security team. |
| Crypto coin miner image |Execution of a process normally associated with digital currency mining detected. |Medium |Verify with the user that ran the command this was legitimate activity on the device. If not, escalate the alert to the information security team. |
"| Crypto coin miner container image detected |Container detecting running known digital currency mining images.  |Medium |1. If this behavior is not intended, delete the relevant 
2. Make sure that the Docker daemon is not accessible via an unsafe TCP socket.
3. Escalate the alert to the information security team. |"
| Device is silent |Device has not sent any telemetry data in the last 72 hours. |Low |Make sure device is online and sending data. Check that the Azure Security Agent is running on the device |
| An attempt to add or edit a diagnostic setting of an IoT Hub was detected |There was %{DescAttemptStatusMessage}\' attempt to add or edit diagnostic setting \'%{DescDiagnosticSettingName}\' of IoT Hub \'%{DescIoTHubName}\'. Diagnostic setting enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. If this action was not made by an authorized party, it may indicate a malicious activity. |Low |1. Make sure the certificate was removed by an authorized party.
2. If not, add the certificate back and escalate the alert to your information security team. |
| An attempt to delete a diagnostic setting from an IoT Hub was detected |There was %{DescAttemptStatusMessage}\' attempt to delete diagnostic settings \'%{DescDiagnosticSettingName}\' from IoT Hub \'%{DescIoTHubName}\'. Diagnostic setting enable you to recreate activity trails for investigation purposes when a security incident occurs, or your network is compromised. If this action was made by an unauthorized party, it may indicate a malicious activity. |Low |Make sure permissions to change diagnostics settings are granted only to an authorized party. |
| Possible attempt to disable auditd logging detected |Linux Audidt system provides a way to track security-relevant information on the system. The system records as much information about the events that are happening on your system as possible. This information is crucial for mission-critical environments to determine who violated the security policy and the actions they performed. Disabling Auditd logging may prevent your ability to discover violations of security policies used on the system. |High |Check with the device owner if this was legitimate activity with business reasons. If not, this event may be hiding activty by malicious actors. Immediately escalated the incident to your information security team. |
| Disable firewall |Possible manipulation of on-host firewall detected. Malicious actors often disable the on-host firewall in an attempt to exfiltrate data. |High |Review with the user that ran the command to confirm if this was legitimate expected activity on the device. If not, escalate the alert to your information security team. |
| Suspicious file download followed by file run activity  |Analysis of host data detected a file that was downloaded and run in the same command. This technique is commonly used by malicious actors to get infected files onto victim machines. |Medium |Review with the user that ran the command if this was legitimate activity that you expect to see on the device. If not, escalate the alert to the information security team. |
| Possible loss of data detected |Possible data egress condition detected using analysis of host data. Malicious actors often egress data from compromised machines. |Medium |Review with the user that ran the command if this was legitimate activity that you expect to see on the device. If not, escalate the alert to the information security team. |
| Space after filename |Execution of a process with a suspicious extension detected using analysis of host data. Suspicious extensions may trick users into thinking files are safe to be opened and can indicate the presence of malware on the system. |Medium |Review with the user that ran the command if this was legitimate activity that you expect to see on the device. If not, escalate the alert to the information security team. |
| Expired SAS token |An expired SAS token used by a device. |Low |May be a legitimate device with an expired token, or an attempt to impersonate a legitimate  device. If the legitimate device is currently communicating correctly, this is likely an impersonation attempt. |
| Exposed Docker daemon by TCP socket |Machine logs indicate that your Docker daemon (dockerd) exposes a TCP socket. By default, Docker configuration, does not use encryption or authentication when a TCP socket is enabled. Default Docker configuration enables full access to the Docker daemon, by anyone with access to the relevant port. |Medium |Review with the user that ran the command if this was legitimate activity that you expect to see on the device. If not, escalate the alert to the information security team. |
| Failed local login |A failed local login attempt to the device was detected |Medium |Make sure no unauthorized party has physical access to the device. |
| Behavior similar to Fairware ransomware detected |Execution of rm -rf commands applied to suspicious locations detected using analysis of host data. Because rm -rf recursively deletes files, it is normally only used on discrete folders. In this case, it is being used in a location that could remove a large amount of data. Fairware ransomware is known to execute rm -rf commands in this folder. |Medium |Review with the user that ran the command this was legitimate activity that you expect to see on the device. If not, escalate the alert to the information security team. |
| Invalid SAS token signature |A SAS token used by a device has an invalid signature. The signature does not match either the primary or secondary key. |Low |Review the alerts on the devices. No further action required. |
| Known attack tool |A tool often associated with malicious users attacking other machines in some way was detected |Medium |Review with the user that ran the command if this was legitimate activity that you expect to see on the device. If not, escalate the alert to the information security team. |
| Possible backdoor detected |A suspicious file was downloaded and then run on a host in your subscription. This type of activity is commonly associated with the installation of a backdoor. |Medium |Review with the user that ran the command if this was legitimate activity that you expect to see on the device. If not, escalate the alert to the information security team. |
| Local host reconnaissance detected |Execution of a command normally associated with common Linux bot reconnaissance detected. |Medium |Review the suspicious command line to confirm that it was executed by a legitimate user. If not, escalate the alert to your information security team. |
| Possible overriding of common files |Common executable overwritten on the device. Malicious actors are known to overwrite common files as a way to hide their actions or as a way to gain persistence. |Medium |Review with the user that ran the command if this was legitimate activity that you expect to see on the device. If not, escalate the alert to the information security team. |
| Port forwarding detection |Initiation of port forwarding to an external IP address detected. |High |Review with the user that ran the command if this was legitimate activity that you expect to see on the device. If not, escalate the alert to the information security team. |
| Detected file download from a known malicious source | Download of a file from a known malware source detected.  |Medium |Review with the user that ran the command if this was legitimate activity that you expect to see on the device. If not, escalate the alert to the information security team. |
| Privileged container detected |Machine logs indicate that a privileged Docker container is running. A privileged container has full access to host  resources. If compromised, a malicious actor can use the privileged container to gain access to the host machine. |Medium |If the container doesn't need to run in privileged mode, remove the privileges from the container. |
| Behavior similar to ransomware detected |Execution of files similar to known ransomware that may prevent users from accessing their system, or personal files, and may demand ransom payment to regain access. |Medium |Review with the user that ran the command if this was legitimate activity that you expect to see on the device. If not, escalate the alert to the information security team. |
| Removal of system logs files detected |Suspicious removal of log files on the host detected. |Medium |Review with the user that ran the command if this was legitimate activity that you expect to see on the device. If not, escalate the alert to the information security team. |
| Reverse shells |Analysis of host data on %{Compromised Host} detected a potential reverse shell. Reverse shells are often used to get a compromised machine to call back into a machine controlled by a malicious actor. |High |Review with the user that ran the command if this was legitimate activity that you expect to see on the device. If not, escalate the alert to the information security team. |
| Mismatch between script interpreter and file extension |Mismatch between the script interpreter and the extension of the script file provided as input detected. This type of mismatch is commonly associated with attacker script executions. |Medium |Review with the user that ran the command if this was legitimate activity that you expect to see on the device. If not, escalate the alert to the information security team. |
| Successful local login |Successful local login to the device detected. |High |Make sure the logged in user is an authorized party. |
| Suspicious compilation detected |Suspicious compilation detected. Malicious actors often compile exploits on a compromised machine to escalate privileges. |Medium |Review with the user that ran the command if this was legitimate activity that you expect to see on the device. If not, escalate the alert to the information security team. |
| Detected suspicious use of the nohup command |Suspicious use of the nohup command on host detected. Malicious actors commonly run the nohup command from a temporary directory, effectively allowing their executables to run in the background. Seeing this command run on files located in a temporary directory is not expected or usual behavior. |Medium |Review with the user that ran the command if this was legitimate activity that you expect to see on the device. If not, escalate the alert to the information security team. |
| Detected suspicious use of the useradd command |Suspicious use of the useradd command detected on the device. |Medium |Review with the user that ran the command if this was legitimate activity that you expect to see on the device. If not, escalate the alert to the information security team. |
| Web shell |Possible web shell detected. Malicious actors commonly upload  a web shell to a compromised machine to gain persistence or for further exploitation. |High |Review with the user that ran the command if this was legitimate activity that you expect to see on the device. If not, escalate the alert to the information security team. |
| Local user deleted from one or more groups |Local user deleted from one or more groups. Malicious actors may use this method in an attempt to deny access to legitimate users, or to delete the history of their actions. |Low |Verify if the change is consistent with the permissions required by the affected user. If the change is inconsistent, escalate the alert to your information security team |
| Local user added to one or more groups |New local user added to a group on this device. Changes to user groups are uncommon, and may indicate a malicious actor collecting additional permissions. |Low |Verify if the change is consistent with the permissions required by the affected user. If the change is inconsistent, escalate the alert to your information security team |
| Local user added to one or more groups |New local user added to a group on this device. Changes to user groups are uncommon, and may indicate a malicious actor collecting additional permissions. |Low |Verify if the change is consistent with the permissions required by the affected user. If the change is inconsistent, escalate the alert to your information security team |
| Local user deletion detected |Deletion of a local user detected. Local user deletion is uncommon, a malicious actor may be trying to deny access to legitimate users, or to delete the history of their actions. |Low |Verify if the change is consistent with the permissions required by the affected user. If the change is inconsistent, escalate the alert to your information security team |
| Suspicious IP address communication |Communication with a suspicious IP address detected. |Medium |Verify if the connection is legitimate. Consider blocking communication with the suspicious IP.  |
