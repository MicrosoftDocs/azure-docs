---
title: Agent based recommendations
description: Learn about the concept of security recommendations and how they are used for Defender for IoT devices.
ms.topic: conceptual
ms.date: 03/28/2022
---

# Security recommendations for IoT devices

Defender for IoT scans your Azure resources and IoT devices and provides security recommendations to reduce your attack surface.
Security recommendations are actionable and aim to aid customers in complying with security best practices.

In this article, you'll find a list of recommendations, which can be triggered on your IoT devices.

## Agent based recommendations

Device recommendations provide insights and suggestions to improve device security posture.

| Severity | Name | Data Source | Description |
|--|--|--|--|
| Medium | Open Ports on device | Legacy Defender-IoT-micro-agent| A listening endpoint was found on the device. |
| Medium | Permissive firewall policy found in one of the chains. | Legacy Defender-IoT-micro-agent| Allowed firewall policy found (INPUT/OUTPUT). Firewall policy should deny all traffic by default, and define rules to allow necessary communication to/from the device. |
| Medium | Permissive firewall rule in the input chain was found | Legacy Defender-IoT-micro-agent| A rule in the firewall has been found that contains a permissive pattern for a wide range of IP addresses or ports. |
| Medium | Permissive firewall rule in the output chain was found | Legacy Defender-IoT-micro-agent| A rule in the firewall has been found that contains a permissive pattern for a wide range of IP addresses or ports. |
| Medium | Operation system baseline validation has failed | Legacy Defender-IoT-micro-agent| Device doesn't comply with [CIS Linux benchmarks](https://www.cisecurity.org/cis-benchmarks/). |

### Agent based operational recommendations

Operational recommendations provide insights and suggestions to improve security agent configuration.

| Severity | Name | Data Source | Description |
|--|--|--|--|
| Low | Agent sends unutilized messages | Legacy Defender-IoT-micro-agent | 10% or more of security messages were smaller than 4 KB during the last 24 hours. |
| Low | Security twin configuration not optimal | Legacy Defender-IoT-micro-agent | Security twin configuration isn't optimal. |
| Low | Security twin configuration conflict | Legacy Defender-IoT-micro-agent | Conflicts were identified in the security twin configuration. |

## Next steps

- Defender for IoT service [Overview](overview.md)
- Learn how to [Access your security data](how-to-security-data-access.md)
- Learn more about [Investigating a device](how-to-investigate-device.md)
