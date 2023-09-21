---
title: Quickstart - Set up a tenant
description: In this quickstart, you learn how to create a tenant with customer configurations.
services: active-directory
author: csmulligan
manager: CelesteDG
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: quickstart
ms.date: 06/19/2023
ms.author: cmulligan
ms.custom: it-pro

#Customer intent: As a dev, devops, or IT admin, I want to create a tenant with customer configurations.
---
# Quickstart: Create a tenant (preview)

Microsoft Entra External ID offers a customer identity access management (CIAM) solution that lets you create secure, customized sign-in experiences for your customer-facing apps and services. You'll need to create a tenant with customer configurations in the Microsoft Entra admin center to get started. Once the tenant with customer configurations is created, you can access it in both the Microsoft Entra admin center and the Azure portal.

In this quickstart, you'll learn how to create a tenant with customer configurations if you already have an Azure subscription. If you don't have an Azure subscription, you can create a customer tenant free trial. For more information about the free trial, see [Set up a free trial](quickstart-trial-setup.md).

## Prerequisites

- An Azure subscription. 
- An Azure account that's been assigned at least the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role scoped to the subscription or to a resource group within the subscription.

[!INCLUDE [preview-alert](../customers/includes/preview-alert/preview-alert-ciam.md)]

## Create a new tenant with customer configurations 

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com). 
1. Browse to **Identity** > **Overview** > **Manage tenants**.
1. Select **Create**.

    :::image type="content" source="media/how-to-create-customer-tenant-portal/create-tenant.png" alt-text="Screenshot of the create tenant option.":::

1. Select **Customer**, and then select **Continue**. 

    :::image type="content" source="media/how-to-create-customer-tenant-portal/select-tenant-type.png" alt-text="Screenshot of the select tenant type screen.":::

1. Select **Use an Azure Subscription**. If you're creating a tenant with customer configurations for the first time, you have the option to create a trial tenant that doesn't require an Azure subscription. For more information about the free trial, see [Set up a free trial](quickstart-trial-setup.md).
 
    :::image type="content" source="media/how-to-create-customer-tenant-portal/create-first-customer-tenant.png" alt-text="Screenshot of the two tenants with customer configurations options available during the initial tenant creation.":::

1. On the **Basics** tab, in the **Create a tenant for customers** page, enter the following information:

    :::image type="content" source="media/how-to-create-customer-tenant-portal/add-basics-to-customer-tenant.png" alt-text="Screenshot of the Basics tab.":::

    - Type your desired **Tenant Name** (for example *Contoso Customers*).

    - Type your desired **Domain Name** (for example *Contosocustomers*).

    - Select your desired **Location**. This selection can't be changed later.

1. Select **Next: Add a subscription**.  

1. On the **Add a subscription** tab, enter the following information:

   - Next to **Subscription**, select your subscription from the menu.

   - Next to **Resource group**, select a resource group from the menu. If there are no available resource groups, select **Create new**, add a name, and then select **OK**.

   - If **Resource group location** appears, select the geographic location of the resource group from the menu.

    :::image type="content" source="media/how-to-create-customer-tenant-portal/add-subscription.png" alt-text="Screenshot that shows the subscription settings.":::

1. Select **Next: Review + Create**. If the information that you entered is correct, select **Create**. The tenant creation process can take up to 30 minutes. You can monitor the progress of the tenant creation process in the **Notifications** pane. Once the tenant is created, you can access it in both the Microsoft Entra admin center and the Azure portal.

    :::image type="content" source="media/how-to-create-customer-tenant-portal/tenant-successfully-created.png" alt-text="Screenshot that shows the link to the new tenant.":::

## Customize your tenant with a guide

Our guide will walk you through the process of setting up a user and configuring a sample app in just a few minutes. This means that you can quickly and easily test out different sign-in and sign-up options and set up a sample app to see what works best for you. This guide is available in any customer tenant.

> [!NOTE]
> The guide won’t run automatically in customer tenants that you created with the steps above. If you want to run the guide, follow the steps below.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com). 
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to your customer tenant. 
1. Browse to **Home** > **Go to Microsoft Entra ID** 
1. On the Get started tab, select **Start the guide**.

    :::image type="content" source="media/how-to-create-customer-tenant-portal/guide-link.png" alt-text="Screenshot that shows how to start the guide.":::

This link will take you to the [guide](quickstart-get-started-guide.md), where you can customize your tenant in three easy steps.

## Clean up resources

If you're not going to continue to use this tenant, you can delete it using the following steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com). 
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to your customer tenant. 
1. Browse to **Identity** > **Overview** > **Manage tenants**.
1. Select the tenant you want to delete, and then select **Delete**.

    :::image type="content" source="media/how-to-create-customer-tenant-portal/delete-tenant.png" alt-text="Screenshot that shows how to delete the tenant.":::

1. You might need to complete required actions before you can delete the tenant. For example, you might need to delete all user flows in the tenant. If you're ready to delete the tenant, select **Delete**.

The tenant and its associated information are deleted.


## Next steps

To learn more about the set-up guide and how to customize your tenant, see the [Get started guide](quickstart-get-started-guide.md) article.
