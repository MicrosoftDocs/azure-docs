---
title: Your sign-in was blocked
description: Troubleshoot a blocked sign-in to the Microsoft Application Network portal. 
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: troubleshooting
ms.workload: identity
ms.date: 1/18/2022
ms.author: jomondi
ms.reviewer: jeedes
ms.custom: enterprise-apps
#Customer intent: As a publisher of an application, I want troubleshoot a blocked sign-in to the Microsoft Application Network portal.
---

# Your sign-in was blocked

This article provides information for resolving a blocked sign-in to the Microsoft Application Network portal.

## Symptoms

The user sees this message when trying to sign in to the Microsoft Application Network portal.

:::image type="content" source="./media/howto-app-gallery-listing/blocked.png" alt-text="Screenshot that shows a blocked sign-in to the portal.":::

## Cause

The guest user is federated to a home tenant that is also a Microsoft Entra tenant. The guest user is at high risk. High risk users aren't allowed to access resources. All high risk users (employees, guests, or vendors) must remediate their risk to access resources. For guest users, this user risk comes from the home tenant and the policy comes from the resource tenant.
 
## Solutions

- MFA registered guest users remediate their own user risk. The guest user [resets or changes a secured password](https://aka.ms/sspr) at their home tenant (this needs MFA and SSPR at the home tenant). The secured password change or reset must be initiated on Microsoft Entra ID and not on-premises.

- Guest users have their administrators remediate their risk. In this case, the administrator resets a password (temporary password generation). The guest user's administrator can go to https://aka.ms/RiskyUsers and select **Reset password**.

- Guest users have their administrators dismiss their risk. The admin can go to https://aka.ms/RiskyUsers and select **Dismiss user risk**. However, the administrator must do the due diligence to make sure the risk assessment was a false positive before dismissing the user risk. Otherwise, resources are put at risk by suppressing a risk assessment without investigation.

If you have any issues with access, contact the [Microsoft Entra SSO Integration Team](mailto:SaaSApplicationIntegrations@service.microsoft.com).
