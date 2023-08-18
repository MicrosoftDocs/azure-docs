---
title: Security recommendations for IoT Hub 
description: Learn about the concept of security recommendations and how they're used in the Defender for IoT Hub.
ms.topic: conceptual
ms.date: 01/01/2023
---

# Security recommendations for IoT Hub

Defender for IoT scans your Azure resources and IoT devices and provides security recommendations to reduce your attack surface.
Security recommendations are actionable and aim to aid customers in complying with security best practices.

In this article, you will find a list of recommendations, which can be triggered on your IoT Hub.

> [!NOTE]
> The Microsoft Defender for IoT legacy experience under IoT Hub has been replaced by our new Defender for IoT standalone experience, in the Defender for IoT area of the Azure portal. The legacy experience under IoT Hub will not be supported after **March 31, 2023**.

## Built in recommendations in IoT Hub

Recommendation alerts provide insight and suggestions for actions to improve the security posture of your environment.

### High severity

| Severity | Name | Data Source | Description | RecommendationType |
|--|--|--|--|--|
| High | Same authentication credentials used by multiple devices | IoT Hub | IoT Hub authentication credentials are used by multiple devices. This could indicate an illegitimate device is impersonating a legitimate device and also exposes the risk of device impersonation by a malicious actor. | IoT_SharedCredentials |
| High | High level permissions configured in IoT Edge model twin for IoT Edge module | IoT Hub | IoT Edge module is configured to run in privileged mode, with extensive Linux capabilities or with host-level network access (send/receive data to host machine). | IoT_PrivilegedDockerOptions |

### Medium severity

| Severity | Name | Data Source | Description | RecommendationType |
|--|--|--|--|--|
| Medium | Service principal not used with ACR repository | IoT Hub | Authentication schema used to pull an IoT Edge module from an ACR repository does not use Service Principal Authentication. | IoT_ACRAuthentication |
| Medium | TLS cipher suite upgrade needed | IoT Hub | Unsecured TLS configurations detected. Immediate TLS cipher suite upgrade recommended. | IoT_VulnerableTLSCipherSuite |
| Medium | Default IP filter policy should be deny | IoT Hub | By default, IP filter configuration needs rules defined for allowed traffic and should deny all other traffic. | IoT_IPFilter_DenyAll |
| Medium | IP filter rule includes a large IP range | IoT Hub | An IP filter rule source allowable IP range is too large. Overly permissive rules can expose your IoT Hub to malicious actors. | IoT_IPFilter_PermissiveRule |
| Medium | Recommended Rules for ip filter | IoT Hub | We Recommend you to change your IP filter to the following rules, the rules obtained by your IotHub behavior | IoT_RecommendedIpRulesByBaseLine |
| Medium | SecurityGroup has inconsistent module settings | IoT Hub | Within this device security group, an anomaly device  has inconsistent IoT Edge module settings when compared with the rest of the security group. | IoT_InconsistentModuleSettings |

### Low severity

| Severity | Name | Data Source | Description | RecommendationType |
|--|--|--|--|--|
| Low | IoT Edge Hub memory can be optimized | IoT Hub | Optimize your IoT Edge Hub memory usage by turning off protocol heads for any protocols not used by Edge modules in your solution. | IoT_EdgeHubMemOptimize |
| Low | No logging configured for IoT Edge module | IoT Hub | Logging is disabled for this IoT Edge module. | IoT_EdgeLoggingOptions |

## Next steps

- Learn more about the [Legacy Defender for IoT devices security alerts](agent-based-security-alerts.md)
