---
title: Share link to request an access package in Azure AD entitlement management - Azure Active Directory
description: Learn how to share link to request an access package in Azure Active Directory entitlement management.
services: active-directory
documentationCenter: ''
author: ajburnle
manager: daveba
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 06/22/2021
ms.author: ajburnle
ms.reviewer: 
ms.collection: M365-identity-device-management

#Customer intent: As a global administrator or access package manager, I want detailed information about how I can edit an access package so that requestors have the resources they need to perform their job.

---
# Reprocess requests for an access package in Azure AD entitlement management

As an access package manager, you can automatically retry a user’s request for access to an access package at any time by using the reprocess functionality. Reprocessing eliminates the need for users to repeat the access package request process if their access to resources is not successfully provisioned.

> [!NOTE]
> You can reprocess a request for up to seven days from the time that the original request is completed. For requests that were completed more than seven days ago, users will need to cancel and make new requests in MyAccess.

This article describes how to reprocess requests for an existing access package.

## Open an existing access package and reprocess user requests

Prerequisite role: Global administrator, Identity Governance administrator, User administrator, Catalog owner, Access package manager or Access package assignment manager

If you have a set of users whose requests are in various states (Delivered, Partially Delivered, Failed), you will might need to reprocess some of those requests. Follow these steps to reprocess requests for an existing access package:

1.	In the Azure portal, click Azure Active Directory and then click Identity Governance.

1.	In the left menu, click Access packages and then open the access package.

1.	Underneath Manage on the left side, click Requests.

1.	Select all users whose requests you wish to reprocess.

1.	Click Reprocess.
