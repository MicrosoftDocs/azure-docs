---
title: include file
description: include file
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.topic: include
ms.date: 04/10/2023
ms.author: barclayn
ms.custom: include file,licensing
---

The required roles and licenses might vary based on the report. Global Administrator can access all reports, but we recommend using a role with least privilege access to align with the [Zero Trust guidance](/security/zero-trust/zero-trust-overview).

| Log / Report | Roles | Licenses |
|--|--|--|
| Audit | Report Reader<br>Security Reader<br>Security Administrator<br>Global Reader<br>A custom role with `AuditLogsRead` or `CustomSecAuditLogsRead` permission | All editions of Azure AD |
| Sign-ins | Report Reader<br>Security Reader<br>Security Administrator<br>Global Reader<br>A custom role with `SignInLogsRead` permission | All editions of Azure AD |
| Provisioning | Same as audit and sign-ins, plus<br>Security Operator<br>Application Administrator<br>Cloud App Administrator<br>A custom role with `ProvisioningLogsRead` permission | Premium P1/P2 |
| Usage and insights | Security Reader<br>Reports Reader<br> Security Administrator  | Premium P1/P2 |
| Identity Protection* | Security Administrator<br>Security Operator<br>Security Reader<br>Global Reader<br>A custom role with `IdentityRiskEventReadWrite` permission | Azure AD Free<br>Microsoft 365 Apps<br>Azure AD Premium P1/P2 |

*The level of access and capabilities for Identity Protection varies with the role and license. For more information, see the [license requirements for Identity Protection](../identity-protection/overview-identity-protection.md#license-requirements).
