---
title: Set up Identity Protection and Conditional Access in Azure AD B2C
description: Learn how Conditional Access is at the heart of the new identity driven control plane.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: overview
ms.date: 09/01/2020

ms.author: mimart
author: msmimart
manager: celested

ms.collection: M365-identity-device-management
---
# Set up Identity Protection and Conditional Access in Azure AD B2C

[!INCLUDE [b2c-public-preview-feature](../../includes/active-directory-b2c-public-preview.md)]

Identity Protection provides ongoing risk detection for your Azure AD B2C tenant. If your tenant is linked to an Azure subscription with Azure AD Premium P2, you can view Identity Protection risk events in the Azure portal. You can also use [Conditional Access](https://docs.microsoft.com/azure/active-directory/conditional-access/overview) policies based on these risk detections to determine actions and enforce organizational policies.

## Prerequisites

- Your Azure AD B2C tenant must be [linked to an Azure AD subscription](billing.md#link-an-azure-ad-b2c-tenant-to-a-subscription).
- Azure AD Premium P2 is required to use sign-in and user risk-based Conditional Access. If necessary, [change your Azure AD pricing tier to Premium P2](https://aka.ms/exid-pricing-tier). 
- To manage Identity Protection and Conditional Access in your B2C tenant, you'll need an account that is assigned the Global Administrator role or the Security administrator role.
- To use these features in your tenant, you first need to switch to the Azure AD Premium P2 pricing tier.

## Set up Identity Protection

Identity Protection is on by default. To be able to view Identity Protection risk events in your Azure AD B2C tenant, simply link your Azure AD B2C tenant to an Azure AD subscription and select the Azure AD Premium P2 pricing tier. You'll begin to receive ongoing notifications about risk events, which you can view in the Azure portal. 

### Supported Identity Protection risk detections

The following risk detections are currently supported for Azure AD B2C:  

|Risk detection type  |Description  |
|---------|---------|
| Atypical travel     | Sign in from an atypical location based on the user's recent sign-ins.        |
|Anonymous IP address     | Sign in from an anonymous IP address (for example: Tor browser, anonymizer VPNs)        |
|Unfamiliar sign-in properties     | Sign in with properties we've not seen recently for the given user.        |
|Malware linked IP address     | Sign in from a malware linked IP address         |
|Azure AD threat intelligence     | Microsoft's internal and external threat intelligence sources have identified a known attack pattern        |

### To view risk events for your Azure AD B2C tenant

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.

1. In the Azure portal, search for and select **Azure AD B2C**.

1. Under **Security**, select **Risky users (Preview)**.

   ![Risky users](media/conditional-access-identity-protection-setup/risky-users.png)

1. Under **Security**, select **Risk detections (Preview)**.

   ![Risk detections](media/conditional-access-identity-protection-setup/risk-detections.png)

## Add a Conditional Access policy 

To add a conditional access policy based on the Identity Protection risk detections, make sure security defaults are disabled for your Azure AD B2C tenant, and then create Conditional Access policies.

### To disable security defaults

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.

3. In the Azure portal, search for and select **Azure Active Directory**.

4. Select **Properties**, and then select **Manage Security defaults**.

   ![Disable the security defaults](media/conditional-access-identity-protection-setup/disable-security-defaults.png)

5. Under Enable Security defaults, select No. 

   ![Set the Enable security defaults toggle to No](media/conditional-access-identity-protection-setup/enable-security-defaults-toggle.png)

### To create a Conditional Access policy

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.

1. In the Azure portal, search for and select **Azure AD B2C**.

1. Under **Security**, select **Conditional Access (Preview)**. The **Conditional Access Policies** page opens. 

1. Select **New policy** and follow the Azure AD Conditional Access documentation to create a new policy. The following are examples:

   - [Sign-in risk-based Conditional Access: Enable with Conditional Access policy](https://docs.microsoft.com/azure/active-directory/conditional-access/howto-conditional-access-policy-risk#enable-with-conditional-access-policy)

   - [User risk-based Conditional Access: Enable with Conditional Access policy](https://docs.microsoft.com/en-us/azure/active-directory/conditional-access/howto-conditional-access-policy-risk-user#enable-with-conditional-access-policy)

   > [!IMPORTANT]
   > When selecting the users you want to apply the policy to, don't select **All users** only, or you could block yourself from signing in.

### To test a Conditional Access Policy

1. Create a Conditional Access policy as noted above, with the following settings.

   ![Select users](media/conditional-access-identity-protection-setup/select-users.png)

1. For the clouds app or action, select your relying party application.

    ![Select relying party application for cloud apps](media/conditional-access-identity-protection-setup/cloud-apps.png)


1. Select the condition

1. Under **Access controls**, For the grant select block - MUST be block

    ![Set the condition to block](media/conditional-access-identity-protection-setup/grant-or-block.png)

1. Enable your conditional access policy by clicking “Create.”

1. Simulate a risky sign-in by using the [Tor browser](https://www.torproject.org/download/).

   ![Test a blocked sign-in](media/conditional-access-identity-protection-setup/test-blocked-sign-in.png)
