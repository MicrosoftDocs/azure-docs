---
author: memildin
ms.service: security-center
ms.topic: include
ms.date: 03/22/2021
ms.author: memildin
ms.custom: generated
---

There are **12** recommendations in this category.

|Recommendation |Description |Severity |
|---|---|---|
|Default IP Filter Policy should be Deny |IP Filter Configuration should have rules defined for allowed traffic and should deny all other traffic by default<br />(No related policy) |Medium |
|Diagnostic logs in IoT Hub should be enabled |Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised.<br />(Related policy: [Diagnostic logs in IoT Hub should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f383856f8-de7f-44a2-81fc-e5135b5c2aa4)) |Low |
|Identical Authentication Credentials |Identical authentication credentials to the IoT Hub used by multiple devices. This could indicate an illegitimate device impersonating a legitimate device. It also exposes the risk of device impersonation by an attacker<br />(No related policy) |High |
|IoT Devices - Agent sending underutilized messages |IoT agent message size capacity is currently underutilized, causing an increase in the number of sent messages. Adjust message intervals for better utilization<br />(No related policy) |Low |
|IoT Devices - Auditd process stopped sending events |Security events originated from Auditd process are no longer received from this device<br />(No related policy) |High |
|IoT Devices - Open Ports On Device |A listening endpoint was found on the device<br />(No related policy) |Medium |
|IoT Devices - Operating system baseline validation failure |Security related system configuration issues identified<br />(No related policy) |Medium |
|IoT Devices - Permissive firewall policy in one of the chains was found |An allowed firewall policy was found in main firewall Chains (INPUT/OUTPUT). The policy should Deny all traffic by default define rules to allow necessary communication to/from the device<br />(No related policy) |Medium |
|IoT Devices - Permissive firewall rule in the input chain was found |A rule in the firewall has been found that contains a permissive pattern for a wide range of IP addresses or Ports<br />(No related policy) |Medium |
|IoT Devices - Permissive firewall rule in the output chain was found |A rule in the firewall has been found that contains a permissive pattern for a wide range of IP addresses or ports<br />(No related policy) |Medium |
|IoT Devices - TLS cipher suite upgrade needed |Unsecure TLS configurations detected. Immediate TLS cipher suite upgrade recommended<br />(No related policy) |Medium |
|IP Filter rule large IP range |An Allow IP Filter rule's source IP range is too large. Overly permissive rules might expose your IoT hub to malicious intenders<br />(No related policy) |Medium |
|||
