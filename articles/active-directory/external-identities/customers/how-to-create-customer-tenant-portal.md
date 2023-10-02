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
ms.date: 07/12/2023
ms.author: cmulligan
ms.custom: it-pro

#Customer intent: As an it admin, I want to learn how to create a customer tenant in the  Microsoft Entra admin center. 
---

# Create a customer identity and access management (CIAM) tenant (preview)

Microsoft Entra ID offers a customer identity access management (CIAM) solution that lets you create secure, customized sign-in experiences for your customer-facing apps and services. With these built-in CIAM features, Microsoft Entra ID can serve as the identity provider and access management service for your customer scenarios. You'll need to create a customer tenant in the Microsoft Entra admin center to get started. Once the customer tenant is created, you can access it in both the Microsoft Entra admin center and the Azure portal.

In this article, you learn how to:

- Create a customer tenant
- Switch to the directory containing your customer tenant
- Find your customer tenant name and ID in the Microsoft Entra admin center

## Prerequisites

- An Azure subscription. If you don't have one, create a <a href="https://azure.microsoft.com/free/?WT.mc_id=A261C142F" target="_blank">free account</a> before you begin.
- An Azure account that's been assigned at least the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role scoped to the subscription or to a resource group within the subscription.

[!INCLUDE [preview-alert](../customers/includes/preview-alert/preview-alert-ciam.md)]

## Create a new customer tenant  

1. Sign in to your organization's [Microsoft Entra admin center](https://entra.microsoft.com/) as at least a [Contributor](/azure/role-based-access-control/built-in-roles#contributor). 
1. Browse to **Identity** > **Overview** > **Manage tenants**.
1. Select **Create**.

    :::image type="content" source="media/how-to-create-customer-tenant-portal/create-tenant.png" alt-text="Screenshot of the create tenant option.":::

1. Select **Customer**, and then **Continue**. 

    :::image type="content" source="media/how-to-create-customer-tenant-portal/select-tenant-type.png" alt-text="Screenshot of the select tenant type screen.":::

1. If you're creating a customer tenant for the first time, you have the option to create a trial tenant that doesn't require an Azure subscription. Otherwise, use the Azure Subscription option to continue to the next step.
 
    :::image type="content" source="media/how-to-create-customer-tenant-portal/create-first-customer-tenant.png" alt-text="Screenshot of the two customer tenant options available during the initial CIAM tenant creation.":::

1. If you choose the 30-day free trial, an Azure subscription isn't required.
1. If you choose **Use Azure Subscription** option, then the admin center displays the tenant creation page. On the **Basics** tab, in the **Create a tenant for customers** page, enter the following information:

    :::image type="content" source="media/how-to-create-customer-tenant-portal/add-basics-to-customer-tenant.png" alt-text="Screenshot of the Basics tab.":::

    - Type your desired **Tenant Name** (for example *Contoso Customers*).

    - Type your desired **Domain Name** (for example *Contosocustomers*).

    - Select your desired **Location**. This selection can't be changed later.

1. Select **Next: Add a subscription**.  

1. On the **Add a subscription** tab, enter the following information:

   - Next to **Subscription**, select your subscription from the menu.

   - Next to **Resource group**, select a resource group from the menu. If there are no available resource groups, select **Create new**, type a **Name**, and then select **OK**.

   - If **Resource group location** appears, select the geographic location of the resource group from the menu.

    :::image type="content" source="media/how-to-create-customer-tenant-portal/add-subscription.png" alt-text="Screenshot that shows the subscription settings.":::

1. Select **Next: Review + Create**. If the information that you entered is correct, select **Create**. The tenant creation process can take up to 30 minutes. You can monitor the progress of the tenant creation process in the **Notifications** pane. Once the customer tenant is created, you can access it in both the Microsoft Entra admin center and the Azure portal.

    :::image type="content" source="media/how-to-create-customer-tenant-portal/tenant-successfully-created.png" alt-text="Screenshot that shows the link to the new customer tenant.":::

## Get the customer tenant details

If you're not sure which directory contains your customer tenant, you can find the tenant name and ID both in the Microsoft Entra admin center and in the Azure portal.

1. To make sure you're using the directory that contains your customer tenant, select the **Directories + subscriptions** icon :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the toolbar.

    :::image type="content" source="media/how-to-create-customer-tenant-portal/directories-subscription.png" alt-text="Screenshot of the Directories + subscriptions icon.":::

1. On the **Portal settings | Directories + subscriptions** page, find your customer tenant in the **Directory name** list, and then select **Switch**. This step will bring you to the tenant's home page.
1. Select the **Overview** tab at the top of the page. You can find the tenant **Name**, **Tenant ID** and **Primary domain** under **Basic information**.

    :::image type="content" source="media/how-to-create-customer-tenant-portal/tenant-overview.png" alt-text="Screenshot of the tenant details.":::

You can find the same details if you go to **Microsoft Entra ID** either in the Microsoft Entra admin center or in the Azure portal. On the **Microsoft Entra ID** page, you can find the tenant **Name**, **Tenant ID** and **Primary domain** under **Overview** > **Basic information**.

## Next steps
- [Register an app](how-to-register-ciam-app.md)
- [Create user flows](how-to-user-flow-sign-up-sign-in-customers.md)
