---
title: Create a customer tenant
description: Learn how to create a customer tenant in the  Microsoft Entra admin center. 
services: active-directory
author: csmulligan
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/25/2023
ms.author: cmulligan
ms.custom: it-pro

#Customer intent: As an it admin, I want to learn how to create a customer tenant in the  Microsoft Entra admin center. 
---

# Create a customer identity and access management (CIAM) tenant

Microsoft Entra offers a customer identity access management (CIAM) solution that lets you create secure, customized sign-in experiences for your customer-facing apps and services. With these built-in CIAM features, Microsoft Entra can serve as the identity provider and access management service for your customer scenarios. You will need to create a customer tenant in the Microsoft Entra admin center to get started. Once the customer tenant is created you can access it in both the Microsoft Entra admin center and the Azure portal.

In this article, you learn how to:

- Create a customer tenant
- Switch to the directory containing your customer tenant
- Find your customer tenant name and ID in the Microsoft Entra admin center

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An Azure account that's been assigned at least the [Contributor](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#contributor) role within the subscription or a resource group within the subscription is required.

## Register the private preview feature <!--  Do we need this step in the tech preview? --> 

Before you can create the new customer tenant in the Microsoft Entra admin center, please register the preview feature in Azure portal. To register, run the following commands from [Azure Cloud Shell](https://learn.microsoft.com/azure/cloud-shell/overview) 

- Ensure you're using the right subscription by running the below command first:
    
    `Select-AzSubscription -SubscriptionName "SubscriptionName"`

- To use your own subscription you have to register to use the feature. The feature flag name is *CIAMApiBeta*. To register your subscription, run the following command:
    
    `Register-AzProviderFeature -FeatureName CIAMApiBeta -ProviderNamespace Microsoft.AzureActiveDirectory`

   It can take anywhere from 15 minutes to 1 hour for changes to reflect the "registered state". Check state by running:
    
    `Get-AzProviderFeature -FeatureName CIAMApiBeta -ProviderNamespace Microsoft.AzureActiveDirectory`

   Once the registration of the *CIAMApiBeta* feature is complete, you might need to register the subscription to detect the new resource that was enabled by the feature flag. It may take a few minutes for the changes to propagate. To register the subscription, run the following command:
   
    `Register-AzResourceProvider -ProviderNamespace Microsoft.AzureActiveDirectory`

## Create a new customer tenant  <!--  The link https://aka.ms/ciam/create brings me to the correct manage tenants page, but in the Azure portal and not in the MS Entra admin center, even if I'm logged in to the MS Entra admin center. I manually have to copy tht URL to the admin center if I want to see this page there. (https://entra.microsoft.com/?enableNewTenantCreationUX=true&Microsoft_AAD_B2CAdmin_dc=CPIMEUSSU001-PPE-BL6P&Microsoft_AAD_B2CAdmin_slice=001-001#view/Microsoft_AAD_IAM/SelectTenantType.ReactView) -->
1. Sign in to your organization's [Microsoft Entra admin center](https://entra.microsoft.com/).

1. From the left menu, select **Azure Active Directory** > **Overview**.
1. On the overview page, select **Manage tenants**
1. Select **Create**.

    :::image type="content" source="media/how-to-create-customer-tenant-portal/create-tenant.png" alt-text="Screenshot of the create tenant option.":::

1. Select **Customer**, and then **Continue**. If you filter the list of tenants by **Tenant type**: **Customer** in the previous step, this step will be skipped.

    :::image type="content" source="media/how-to-create-customer-tenant-portal/select-tenant-type.png" alt-text="Screenshot of the select tenant type screen.":::

1. On the Basics tab, select the type of tenant you want to create, either **Azure Active Directory** or **Azure Active Directory (B2C)**.

1. Select **Next: Configuration** to move on to the Configuration tab.

1.  On the Configuration tab, enter the following information:

    ![Azure Active Directory - Create a tenant page - configuration tab ](media/active-directory-access-create-new-tenant/azure-ad-create-new-tenant.png)

    - Type your desired Organization name (for example _Contoso Organization_) into the **Organization name** box.

    - Type your desired Initial domain name (for example _Contosoorg_) into the **Initial domain name** box.

    - Select your desired Country/Region or leave the _United States_ option in the **Country or region** box.

1. Select **Next: Review + Create**. Review the information you entered and if the information is correct, select **create**.

Your new tenant is created with the domain contoso.onmicrosoft.com.

## 3 - [Doing the next thing]
TODO: Add introduction sentence(s)
TODO: Add ordered list of procedure steps

## [N - Doing the last thing]
TODO: Add introduction sentence(s)
TODO: Add ordered list of procedure steps

## Next steps
