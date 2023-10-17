---
title: 'What is the provisioning agent?'
description: This article describes the provisioning agent used by cloud sync and on-premsises app provisioning.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.service: active-directory
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 01/11/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---


# What is the Microsoft Entra provisioning agent?

The provisioning agent is the synchronization tool that is used to deliver several features for use with Microsoft Entra ID and is managed from the cloud.

The provisioning agent provides connectivity between Microsoft Entra ID and your on-premises environment.


 These features include:

 - cloud sync
 - on-premises app provisioning

## How it works
The provisioning agent uses SCIM ([System for Cross-domain Identity Management (SCIM) 2.0](https://techcommunity.microsoft.com/t5/identity-standards-blog/provisioning-with-scim-getting-started/ba-p/880010)). The SCIM specification provides a common user schema to help users move into, out of, and around apps. SCIM is becoming the de facto standard for provisioning and, when used in conjunction with federation standards like SAML or OpenID Connect, provides administrators an end-to-end standards-based solution for access management.

## Next steps 

- [What is provisioning?](../what-is-provisioning.md)
- [Install cloud sync](how-to-install.md)
