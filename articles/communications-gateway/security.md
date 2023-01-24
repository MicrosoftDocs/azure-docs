---
title: Security for Azure Communications Gateway
description: Understand how Microsoft keeps your Azure Communication Gateway and user data secure
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: conceptual
ms.date: 01/10/2022
ms.custom: template-concept
---

# Security for Azure Communication Gateway

The customer data Azure Communications Gateway handles can be split into:

- Content data, such as media for voice calls.
- Customer data present in call metadata.

## Encryption between Microsoft Teams and Azure Communications Gateway

All traffic between Azure Communications Gateway and Microsoft Teams is encrypted. SIP traffic is encrypted using TLS. Media traffic is encrypted using SRTP.

## Data retention, data security and encryption at rest

Azure Communications Gateway doesn't store content data, but it does store customer data and provide statistics based on it. This data is stored for a maximum of 30 days. After this period, it's no longer accessible to perform diagnostics or analysis of individual calls. Anonymized statistics and logs produced based on customer data will continue to be available beyond the 30 days limit.

Before an engineer can access your data, they'll require the consent of your Azure Subscription Owner. All access is on a just-in-time basis.  

Azure Communication Gateway stores all data at rest securely, including any customer data that has to be temporarily stored, such as call records.  It uses standard Azure infrastructure, with platform-managed encryption keys, to provide server-side encryption compliant with a range of security standards including FedRAMP. For more information, see [encryption of data at rest](../security/fundamentals/encryption-overview.md).

## Next steps

- Learn about [how Azure Communications Gateway communicates with Microsoft Teams and your network](interoperability.md).

