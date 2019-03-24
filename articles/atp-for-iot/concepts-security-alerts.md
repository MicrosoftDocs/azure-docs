---
title: Security alert guide for Azure IoT Security Preview| Microsoft Docs
description: Learn about security alerts and recommended remediation using Azure IoT Security features and service.
services: ascforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: a5c25cba-59a4-488b-abbe-c37ff9b151f9
ms.service: ascforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/07/2019
ms.author: mlottner

---
# Azure IoT Security security alerts

> [!IMPORTANT]
> Azure IoT Security is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Device alerts

| Severity      | Name                                         | Data source | Description                                                                                                                                                                       |
|---------------|----------------------------------------------|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| High          | Successful Local Login                       | Agent       | Successful local login to the device detected.                                                                                                                              |
| High          | Successful SSH Bruteforce                    | Agent       | Successful brute force attack detected on the device.                                                                                                                         |
| High          | Binary Command Line                          | Agent       | Detected a command line generated Linux binary. This process may be legitimate activity, or an indication that your device is compromised.              |
| High          | Reverse Shells                               | Agent       | Potential reverse shell detected. These are used to get a compromised machine to call back into a machine an attacker owns.                                                 |
| High          | Disable Firewall                             | Agent       | Possible manipulation of the on-host firewall detected. Attackers often disable the on-host firewall to exfiltrate data.                                                                     |
| High          | Known Web Shell commands                     | Agent       | Possible web shell was detected. Attackers often upload a web shell to a compromised machine to gain persistence or for further exploitation.                    |
| High          | Port Forwarding                              | Agent       | Detected initiation of port forwarding to an external IP address.                                                                                                             |
| Medium        | Invalid SAS Token Signature                  | IoT hub     | Device SAS token has an invalid signature. The signature does not match the primary or secondary key.                                                                     |
| Medium        | X.509 Device Certificate Thumbprint Mismatch | IoT hub     | The device attempted to authenticate with a mismatched X.509 certificate thumbprint.                                                                                                 |
| Medium        | X.509 Certificate Expired                    | IoT hub     | The device attempted to authenticate with an expired X.509 certificate.                                                                                                                |
| Medium        | Failed Local Login                           | Agent       | Detected a failed local login attempt to the device.                                                                                                                            |
| Medium        | ReadingHistoryFile                           | Agent       | Detected unusual access to the bash history file.                                                                                                                                               |
| Medium        | CryptoCoinMiner                              | Agent       | Execution of a process normally associated with digital currency mining detected.                                                                                             |
| Medium        | KnownCredentialAccessToolsLinux              | Agent       | Detected a tool often associated with attacker attempts to access credentials.                                                                                                |
| Medium        | MinerContainer	                           | Agent       | Detected a Container that runs known digital currency miner images.                                                                                                           |
| Medium        | KnownAttackToolsLinux                        | Agent       | Detected use of a tool often associated with malicious attacks on other machines.                                                                                   |
| Low           | Expired SAS Token                            | IoT hub     | Device used an expired SAS token.                                                                                                                                          |
| Low           | Failed SSH Bruteforce                        | Agent       | Detected a failed brute force attack on the device.                                                                                                                           |
| Low           | DeviceSilent	                               | Agent       | Device hasn't sent any telemetry data in the last 72 hours.                                                                                                                       |
| Low           | ClearHistoryFile                             | Agent       | A log clear command was observed on a device. Adversaries can use this command to hide their own commands from appearing in device logs.                              |
| Informational | DeviceOnboarded                              | Agent       | Notification signifying successful device onboarding and acknowledgement it is sending security telemetry data.                                                        |

## IoT Hub alerts

| Severity | Name                                                                         | Description                                                                                                                                                                                                                                                                                                                            |
|----------|------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Medium   | Unsuccessful attempt to add a certificate to an IoT Hub was detected      | Unsuccessful attempt to add a certificate to an IoT hub. If this action was not made by an authorized party, it may indicate malicious activity.                                                                                                                                                                     |
| Medium   | Unsuccessful attempt to delete a certificate from an IoT Hub detected | There was an unsuccessful attempt to delete a certificate from an IoT hub. If this action was not made by an authorized party, it may indicate malicious activity.                                                                                                                                                                |
| Medium   | New certificate added to an IoT Hub                                    | A certificate was added to an IoT hub. If this action was not made by an authorized party, it may indicate malicious activity.                                                                                                                                                                                                    |
| Medium   | Certificate deleted from an IoT Hub                                    | Certificate deleted from an IoT hub. If this action was not made by an authorized party, it may indicate malicious activity.                                                                                                                                                                                                |
| Low      | Detected an attempt to add or edit a diagnostic setting of an IoT Hub  | An attempt to add or edit the diagnostic settings of an IoT hub was detected. Diagnostic setting enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. If this action was not made by an authorized party, it may indicate malicious activity.  |
| Low      | Detected an attempt to delete a diagnostic setting from an IoT Hub  | An attempt to delete the diagnostic settings of an IoT Hub was detected. Diagnostic setting enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. If this action was not made by an authorized party, it may indicate malicious activity.       |
## See also
- [Azure IoT Security Preview](preview.md)
- [Installation for Windows](installation-windows.md)
- [Authentication](authentication.md)
- [Data Access](dataaccess.md)