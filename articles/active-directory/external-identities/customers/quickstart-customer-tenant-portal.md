---
title: Quickstart - Create a customer tenant
description: In this quickstart, learn how to create a customer tenant in the portal. 
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: quickstart
ms.date: 03/03/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to create a customer tenant in the portal
---

# Quickstart: Create a customer tenant in the portal

Azure Active Directory (Azure AD) offers a customer identity access management (CIAM) solution that lets you create secure, customized sign-in experiences for your customer-facing apps and services. With these built-in customer features, Azure AD can serve as the identity provider and access management service for your customer scenarios.

In this article, you learn how to us Azure portal to:

- Create an Azure AD customer tenant
- Switch to the directory containing your Azure AD customer tenant

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An Azure account that's been assigned at least the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role within the subscription or a resource group within the subscription is required.

## Create a customer tenant

1. Sign in to your organization's Azure portal using [this specific URL to access preview features](https://ms.portal.azure.com/?enableNewTenantCreationUX=true&Microsoft_AAD_B2CAdmin_dc=CPIMEUSSU001-PPE-BL6P&Microsoft_AAD_B2CAdmin_slice=001-001#view/Microsoft_AAD_IAM/DirectorySwitchBlade/subtitle/).

1. The **Manage tenant** page opens with the list of your tenants. You can use the **Tenant type** filter to switch the view to **Workforce**, **Customer**, or **All**.

1. To create a customer tenant, select **Create**.

   <!--[Screenshot that shows how to create a customer tenant.](media/3-create-tenant-create.png)-->

1. Select **Customer**, and then select **Continue**. Note, if you filter the list of tenants by **Customer**, this step is skipped.

   <!--[Screenshot that shows how to select the type of the tenant.](media/4-create-tenant-select-customer1.png)-->

1. In the **Create a tenant for customers** page, on the **Basics** tab, enter the following information:

   - In the **Tenant name** box, type a name for the new customer tenant.

   - In the **Domain name** box, type a domain name (with no spaces). This name must be globally unique.

   - In the **Country/Region** box, select your country or region. This selection can't be changed later.

   - Select **Next: Add a subscription**.  

   <!--[Screenshot that shows the create a tenant for customers basic settings.](media/6-create-tenant-basics.png)-->

1. On the **Add a subscription** tab, enter the following information:

   - Next to **Subscription**, select your subscription from the menu.

   - Next to **Resource group**, select a resource group from the menu. If there are no available resource groups, select **Create new**, type a **Name**, and then select **OK**.

   - If **Resource group location** appears, select the geographic location of the resource group from the menu.

   <!--[Screenshot that shows the create a tenant for customers subscription settings.](media/7-create-tenant-add-subscription1.png)-->

1. Select **Next: Review + Create**. Review the information you entered and if the information is correct, and select **Create**.

## Select your customer tenant

Your new customer tenant is created. To start using your new Azure AD for customer tenant, you need to switch to the directory that contains the tenant: 

1. Make sure you're using the directory that contains your Azure AD for customers tenant. Select the **Directories + subscriptions** icon in the portal toolbar.
    
   <!--  ![Screenshot that shows how to switch tenants.](media/7-select-new-tenant.png)-->

1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD for customers directory in the **Directory name** list, and then select **Switch**. 
1. In the Azure portal, search for and select **Azure Active Directory**. The following screenshot shows the Azure AD for customers overview screen.

   <!--[Screenshot that shows the customer tenant overview page.](media/7-create-tenant-overview.png)-->

## Next steps
