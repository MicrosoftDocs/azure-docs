---
title: Security recommendations for IoT Hub 
description: Learn about the concept of security recommendations and how they are used in the Defender for IoT Hub.
ms.topic: conceptual
ms.date: 10/11/2021
---

# Security recommendations for IoT Hub

Defender for IoT scans your Azure resources and IoT devices and provides security recommendations to reduce your attack surface.
Security recommendations are actionable and aim to aid customers in complying with security best practices.

In this article, you will find a list of recommendations, which can be triggered on your IoT Hub.

## Built in recommendations in IoT Hub

Recommendation alerts provide insight and suggestions for actions to improve the security posture of your environment.

### High severity

| Severity | Name | Data Source | Description |
|--|--|--|--|
| High | Identical authentication credentials used by multiple devices | IoT Hub | IoT Hub authentication credentials are used by multiple devices. This process may indicate an illegitimate device impersonating a legitimate device. Duplicate credential use increases the risk of device impersonation by a malicious actor. |

### Medium severity

| Severity | Name | Data Source | Description |
|--|--|--|--|
| Medium | Default IP filter policy should be deny | IoT Hub | IP filter configuration should have rules defined for allowed traffic, and should by default, deny all other traffic by default. |
| Medium | IP filter rule includes large IP range | IoT Hub | An allow IP filter rule source IP range is too large. Overly permissive rules can expose your IoT hub to malicious actors. |

### Low severity

| Severity | Name | Data Source | Description |
|--|--|--|--|
| Low | Enable diagnostics logs in IoT Hub | IoT Hub | Enable logs and retain them for up to a year. Retaining logs enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |

## Next steps

- Learn more about the [Micro Agent security recommendations](concept-security-recommendations-for-micro-agent.md)
