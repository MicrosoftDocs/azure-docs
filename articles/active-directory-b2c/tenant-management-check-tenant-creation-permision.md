---
title: Review tenant creation permission in Azure Active Directory B2C
titleSuffix: Azure Active Directory B2C
description: Learn how to check tenant creation permission in Azure Active Directory B2C before you create tenant
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.custom: project-no-code, b2c-docs-improvements
ms.date: 11/24/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Review tenant creation permission in Azure Active Directory B2C

<Description goes here>

## Check tenant creation permission 

Before you create an Azure AD B2C tenant, make sure that you've the permission to do so. Use these steps to check that you've the permission to create a tenant: 

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your Azure AD B2C tenant:
    1. Select the **Directories + subscriptions** icon in the portal toolbar.
    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.
1. In the Azure portal, search for and select **Azure Active Directory**.
1. Under **Manage**, select **User Settings**.
1. Review your **Tenant Creation** setting. If the settings is set to **No**, then contact your administrator to assign the tenant creator role to you. The setting is greyed out if you're not an administrator in the tenant.


## Next steps 