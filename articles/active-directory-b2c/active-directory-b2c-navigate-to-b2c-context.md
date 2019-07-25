---
title: Switching to a B2C tenant in Azure Active Directory B2C | Microsoft Docs
description: How to switch into the context of your Active Directory B2C tenant.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 04/13/2017
ms.author: marsma
ms.subservice: B2C
---

# Switching to your Azure AD B2C tenant

In order to configure Azure AD B2C, you need to be in the context of your Azure AD B2C tenant.

## Log into Azure AD B2C tenant

To navigate to your Azure AD B2C tenant, you must be logged into the Azure portal as a global administrator of the Azure AD B2C tenant.

1. Sign into the [Azure portal](https://portal.azure.com).
1. Switch tenants by clicking your email address or picture in the top-right corner.
1. In the `Directory` list that appears, select the Azure AD B2C tenant that you wish to manage.

The Azure portal refreshes.  Now you are signed into the Azure portal in the context of your Azure AD B2C tenant.

## Navigate to the B2C features pane

1. Click **Browse** on the left-hand navigation.
1. Click **All services** and then search for `Azure AD B2C` in the left navigation pane.  (To pin to your left-hand Startboard, click the star to the left of Azure AD B2C)
1. Click **Azure AD B2C** to access the B2C features pane.

    ![Screenshot of Browse to B2C features pane](./media/active-directory-b2c-get-started/b2c-browse.png)

> [!IMPORTANT]
> You need to be a Global Administrator of the B2C tenant to be able to access the B2C features pane. A Global Administrator from any other tenant or a user from any tenant cannot access it.  You can switch to your B2C tenant by using the tenant switcher in the top right corner of the Azure portal.
