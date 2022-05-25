---
title: Configure an automatic assignment policy for an access package in Azure AD entitlement management - Azure Active Directory
description: Learn how to configure automatic assignments based on rules for an access package in Azure Active Directory entitlement management.
services: active-directory
documentationCenter: ''
author: markwahl-msft
manager: karenhoran
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 05/24/2022
ms.author: ajburnle
ms.reviewer: 
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want detailed information about how I can edit an access package to include a policy for users to get and lose access package assignments automatically, without them needing to request access.

---
# Configure an automatic assignment policy for an access package in Azure AD entitlement management

As an access package manager, you can establish a policy for assignments in an access package that creates and removes assignments automatically, based on the attributes of a subject user.

This article describes how to create an access package automatic assignment policy for an existing access package.

## Create an automatic assignment policy (Preview)

To create a policy for an access package, you need to start from the access package policy tab. Follow these steps to create a new policy for an access package.

**Prerequisite role:** Global administrator, Identity Governance administrator, Catalog owner, or Access package manager

1. In the Azure portal, click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Access packages** and then open the access package.

1. Click **Policies**.

## Next steps

- [View assignments for an access package](entitlement-management-access-package-assignments.md)
