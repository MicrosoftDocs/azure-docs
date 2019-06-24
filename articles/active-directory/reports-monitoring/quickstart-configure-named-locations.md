---
title: Configure named locations in Azure Active Directory | Microsoft Docs
description: Learn how to configure named locations.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: daveba

ms.assetid: f56e042a-78d5-4ea3-be33-94004f2a0fc3
ms.service: active-directory
ms.workload: identity
ms.subservice: report-monitor
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 11/13/2018
ms.author: markvi
ms.reviewer: dhanyahk
#Customer intent: As an IT administrator, I want to label trusted IP address ranges in my organization so that I can whitelist them and configure location-based Conditional Access.
ms.collection: M365-identity-device-management
---

# Quickstart: Configure named locations in Azure Active Directory

With named locations, you can label trusted IP address ranges in your organization. Azure AD uses named locations to:
- Detect false positives in [risk events](concept-risk-events.md). Signing in from a trusted location lowers a user's sign-in risk.   
- Configure [location-based Conditional Access](../conditional-access/location-condition.md).

In this quickstart, you learn how to configure named locations in your environment.

## Prerequisites

To complete this quickstart, you need:

* An Azure AD tenant. Sign up for a [free trial](https://azure.microsoft.com/trial/get-started-active-directory/). 
* A user, who is a global administrator for the tenant.
* An IP range that is established and credible in your organization. The IP range needs to be in **Classless Interdomain Routing (CIDR)** format.

## Configure named locations

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the left pane, select **Azure Active Directory**, then select **Conditional Access** from the **Security** section.

    ![Conditional Access tab](./media/quickstart-configure-named-locations/entrypoint.png)

3. On the **Conditional Access** page, select **Named locations** and select **New location**.

    ![Named location](./media/quickstart-configure-named-locations/namedlocation.png)

6. Fill out the form on the new page. 

   * In the **Name** box, type a name for your named location.
   * In the **IP ranges** box, type the IP range in CIDR format.  
   * Click **Create**.
    
     ![The New blade](./media/quickstart-configure-named-locations/61.png)

## Next steps

For more information, see:

- [Azure AD Conditional Access](../active-directory-conditional-access-azure-portal.md).
- [Location conditions in Azure AD Conditional Access](../conditional-access/location-condition.md)
- [Risky sign-ins report](concept-risky-sign-ins.md).  
