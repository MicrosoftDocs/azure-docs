---
author: memildin
ms.service: defender-for-cloud
ms.topic: include
ms.date: 12/26/2021
ms.author: memildin
ms.custom: generated
---

There are **12** AWS recommendations in this category.

|Recommendation |Description |Severity |
|---|---|---|
|[Default IP Filter Policy should be Deny](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/5a3d6cdd-8eb3-46d2-ba11-d24a0d47fe65) |IP Filter Configuration should have rules defined for allowed traffic and should deny all other traffic by default |Medium |
|[Diagnostic logs in IoT Hub should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/77785808-ce86-4e40-b45f-19110a547397) |Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |Low |
|[Identical Authentication Credentials](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9d07b7e6-2986-4964-a76c-b2689604e212) |Identical authentication credentials to the IoT Hub used by multiple devices. This could indicate an illegitimate device impersonating a legitimate device. It also exposes the risk of device impersonation by an attacker |High |
|[IoT Devices - Agent sending underutilized messages](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a9a59ebb-5d6f-42f5-92a1-036fd0fd1879) |IoT agent message size capacity is currently underutilized, causing an increase in the number of sent messages. Adjust message intervals for better utilization |Low |
|[IoT Devices - Auditd process stopped sending events](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d74d2738-2485-4103-9919-69c7e63776ec) |Security events originated from Auditd process are no longer received from this device |High |
|[IoT Devices - Open Ports On Device](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1a36f14a-8bd8-45f5-abe5-eef88d76ab5b) |A listening endpoint was found on the device |Medium |
|[IoT Devices - Operating system baseline validation failure](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/5f65e47f-7a00-4bf3-acae-90ee441ee876) |Security-related system configuration issues identified |Medium |
|[IoT Devices - Permissive firewall policy in one of the chains was found](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/beb62be3-5e78-49bd-ac5f-099250ef3c7c) |An allowed firewall policy was found in main firewall Chains (INPUT/OUTPUT). The policy should Deny all traffic by default define rules to allow necessary communication to/from the device |Medium |
|[IoT Devices - Permissive firewall rule in the input chain was found](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ba975338-f956-41e7-a9f2-7614832d382d) |A rule in the firewall has been found that contains a permissive pattern for a wide range of IP addresses or Ports |Medium |
|[IoT Devices - Permissive firewall rule in the output chain was found](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d5a8d84a-9ad0-42e2-80e0-d38e3d46028a) |A rule in the firewall has been found that contains a permissive pattern for a wide range of IP addresses or ports |Medium |
|[IoT Devices - TLS cipher suite upgrade needed](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/2acc27c6-5fdb-405e-9080-cb66b850c8f5) |Unsecure TLS configurations detected. Immediate TLS cipher suite upgrade recommended |Medium |
|[IP Filter rule large IP range](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d8326952-60bb-40fb-b33f-51e662708a88) |An Allow IP Filter rule's source IP range is too large. Overly permissive rules might expose your IoT hub to malicious intenders |Medium |
|||
