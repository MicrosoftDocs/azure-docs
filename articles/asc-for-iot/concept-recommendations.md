---
title: Security recommendations 
description: Learn about the concept of security recommendations and how they are used in Azure Security Center for IoT.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.assetid: 02ced504-d3aa-4770-9d10-b79f80af366c
ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/24/2019
ms.author: mlottner
---

# Security recommendations

Azure Security Center for IoT scans your Azure resources and IoT devices and provides security recommendations to reduce your attack surface.
Security recommendations are actionable and aim to aid customers in complying to security best practices.

In this article, you will find a list of recommendations which can be triggered on your IoT Hub and/or IoT devices.

## Recommendations for IoT devices

Device recommendations provide insights and suggestions to improve device security posture.

| Severity | Name                                                      | Data Source | Description                                                                                                                                                                                           |
|----------|-----------------------------------------------------------|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Medium   | Open Ports on device                                      | Agent       | A listening endpoint was found on the device .                                                                                                                                                        |
| Medium   | Permissive firewall policy found in one of the chains. | Agent       | Allowed firewall policy found (INPUT/OUTPUT). Firewall policy should deny all traffic by default, and define rules to allow necessary communication to/from the device.                               |
| Medium   | Permissive firewall rule in the input chain was found     | Agent       | A rule in the firewall has been found that contains a permissive pattern for a wide range of IP addresses or ports.                                                                                    |
| Medium   | Permissive firewall rule in the output chain was found    | Agent       | A rule in the firewall has been found that contains a permissive pattern for a wide range of IP addresses or ports.                                                                                   |
| Medium   | Operation system baseline validation has failed           | Agent       | Device doesn't comply with [CIS Linux benchmarks](https://www.cisecurity.org/cis-benchmarks/).                                                                                                        |

### Operational recommendations for IoT devices

Operational recommendations provide insights and suggestions to improve security agent configuration.

| Severity | Name                                    | Data Source | Description                                                                       |
|----------|-----------------------------------------|-------------|-----------------------------------------------------------------------------------|
| Low      | Agent sends unutilized messages          | Agent       | 10% or more of security messages were smaller than 4 KB during the last 24 hours.  |
| Low      | Security twin configuration not optimal | Agent       | Security twin configuration is not optimal.                                        |
| Low      | Security twin configuration conflict    | Agent       | Conflicts were identified in the security twin configuration. |                          |
|

## Recommendations for IoT Hub

Recommendation alerts provide insight and suggestions for actions to improve the security posture of your environment.

| Severity | Name                                                     | Data Source | Description                                                                                                                                                                                                             |
|----------|----------------------------------------------------------|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| High     | Identical authentication credentials used by multiple devices | IoT Hub     | IoT Hub authentication credentials are used by multiple devices. This may indicate an illegitimate device impersonating a legitimate device. Duplicate credential use increases the risk of device impersonation by a malicious actor. |
| Medium   | Default IP filter policy should be deny                  | IoT Hub     | IP filter configuration should have rules defined for allowed traffic, and should by default, deny all other traffic by default.                                                                                                     |
| Medium   | IP filter rule includes large IP range                   | IoT Hub     | An allow IP filter rule source IP range is too large. Overly permissive rules can expose your IoT hub to malicious actors.                                                                                       |
| Low      | Enable diagnostics logs in IoT Hub                       | IoT Hub     | Enable logs and retain them for up to a year. Retaining logs enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised.                                       |
|

## Next steps

- Azure Security Center for IoT service [Overview](overview.md)
- Learn how to [Access your security data](how-to-security-data-access.md)
- Learn more about [Investigating a device](how-to-investigate-device.md)
