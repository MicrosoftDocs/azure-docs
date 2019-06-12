---
title: include file
description: include file with pre-requisites
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: mtillman
editor: curtand

ms.assetid: 66b5f8e2-e08d-43c8-b460-6204aecda8f7
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.custom: include file
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/22/2018
ms.author: maheshu
---

> [!IMPORTANT]
> **Enable password hash synchronization to Azure AD Domain Services, before you complete the tasks in this article.**
>
> Follow the instructions below, depending on the type of users in your Azure
> AD directory. Complete both sets of instructions if you have a mix of cloud-only
> and synced user accounts in your Azure AD directory. You may not be able to carry out the following operations in case you are trying to  use a B2B Guest account (example , your gmail or MSA from a different Identity provider which we allow) becasue we do not have the password for these users synced to managed domain as these are guest accounts in the directory. The complete information about these accounts including their passwords would be outside of Azure AD and as this information is not in Azure AD hence it does not even get synced to the managed domain. 
> - [Instructions for cloud-only user accounts](../articles/active-directory-domain-services/active-directory-ds-getting-started-password-sync.md)
> - [Instructions for user accounts synchronized from an on-premises directory](../articles/active-directory-domain-services/active-directory-ds-getting-started-password-sync-synced-tenant.md)
