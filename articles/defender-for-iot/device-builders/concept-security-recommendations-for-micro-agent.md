---
title: Micro agent security recommendations (Preview)
description: Learn about the concept of security recommendations and how they are used with the Defender for IoT micro agent.
ms.topic: conceptual
ms.date: 10/11/2021
---

# Micro agent security recommendations

Defender for IoT scans your Azure resources and IoT devices and provides security recommendations to reduce your attack surface. Security recommendations are actionable and aim to aid customers in complying with security best practices.

In this article, you will find a list of recommendations, which can be triggered on your IoT devices.

## Built in recommendations for the Micro agent

Recommendation alerts provide insight and suggestions for actions to improve the security posture of your environment.

### High severity

| Severity | Name | Data Source | Description |
|--|--|--|--|
| High | Same authentication credentials used by multiple devices | IoT Hub | IoT Hub authentication credentials are used by multiple devices. This could indicate an illegitimate device is impersonating a legitimate device and also exposes the risk of device impersonation by a malicious actor. |
| High | High level permissions configured in IoT Edge model twin for IoT Edge module | IoT Hub | IoT Edge module is configured to run in privileged mode, with extensive Linux capabilities or with host-level network access (send/receive data to host machine). |

### Medium severity

| Severity | Name | Data Source | Description |
|--|--|--|--|
| Medium | Service principal not used with ACR repository | IoT Hub | Authentication schema used to pull an IoT Edge module from an ACR repository does not use Service Principal Authentication. |
| Medium | TLS cipher suite upgrade needed | IoT Hub | Unsecured TLS configurations detected. Immediate TLS cipher suite upgrade recommended. |
| Medium | Default IP filter policy should be deny | IoT Hub | By default, IP filter configuration needs rules defined for allowed traffic and should deny all other traffic. |
| Medium | IP filter rule includes a large IP range | IoT Hub | An IP filter rule source allowable IP range is too large. Overly permissive rules can expose your IoT Hub to malicious actors. |
| Medium | SecurityGroup has inconsistent module settings | IoT Hub | Within this device security group, an anomaly device  has inconsistent IoT Edge module settings when compared with the rest of the security group. |

### Low severity

| Severity | Name | Data Source | Description |
|--|--|--|--|
| Low | IoT Edge Hub memory can be optimized | IoT Hub | Optimize your IoT Edge Hub memory usage by turning off protocol heads for any protocols not used by Edge modules in your solution. |
| Low | No logging configured for IoT Edge module | IoT Hub | Logging is disabled for this IoT Edge module. |

## Next steps

- Learn how to [Configure Azure Defender for IoT agent-based solution](how-to-configure-agent-based-solution.md)
