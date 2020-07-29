---
title: User provisioning to Azure AD Gallery app is taking hours or more
description: How to find out why provisioning to your application may be taking longer than you expected
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: troubleshooting
ms.date: 07/11/2017
ms.author: kenwith
ms.reviewer: asteen
---

# User provisioning to an Azure AD Gallery application is taking hours or more

When first enabling automatic provisioning for an application, the initial cycle can take anywhere from 20 minutes to several hours, depending on the size of the Azure AD directory and the number of users in scope for provisioning. 

Subsequent syncs after the initial cycle be faster, as the provisioning service stores watermarks that represent the state of both systems after the initial cycle, improving performance of subsequent syncs.

## How to improve provisioning performance

If the initial cycle is taking more than a few hours, there is one thing you can do to improve performance:

-   **User scoping filters.** Scoping filters allow you to fine tune the data that the provisioning service extracts from Azure AD by filtering out users based on specific attribute values. For more information on scoping filters, see [Attribute-based application provisioning with scoping filters](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

## Next steps
[Automate User Provisioning and Deprovisioning to SaaS Applications with Azure Active Directory](user-provisioning.md)

