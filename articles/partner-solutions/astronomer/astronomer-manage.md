---
title: Manage an Astro resource through the Azure portal
description: This article describes management functions for Astro on the Azure portal. 
author: flang-msft

ms.author: franlanglois
ms.topic: how-to
ms.date: 10/19/2023

ms.custom: ignite-2023-metadata-update
---

# Manage your Astro integration through the portal

Once your Astro resource is created in the Azure portal, you might need to get information about it or change it. Here's how you can manage your Astro resource.

- [Single sign-on](#single-sign-on)
- [Delete an Astro deployment](#delete-an-astro-deployment)

## Single sign-on

To enable SSO, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to the Overview for your instance of the Astro resource. Select on the SSO Url.

   :::image type="content" source="media/astronomer-manage/astronomer-sso-overview.png" alt-text="Screenshot showing the Single Sign-on url in the  Overview pane of the Astro resource.":::

1. The first time you access this Url, depending on your Azure tenant settings, you might see a request to grant permissions and User consent. This step is only needed the first time you access the SSO Url.

<!-- 
this screenshot would not add much value and is hard to replicate

:::image type="content" source="media/astronomer-manage/astronomer-sso-consent.png" alt-text="Screenshot showing the User consent permissions on clicking SSO url for the first time."::: 
-->

    > [!NOTE]
    > If you are also seeing Admin consent screen then please check your [tenant consent settings](/azure/active-directory/manage-apps/configure-user-consent).
    >

1. Choose a Microsoft Entra account for the Single Sign-on. Once consent is provided, you're redirected to the Astro portal.

## Delete an Astro deployment

To delete an Astro resource:

1. From the Resource menu, select the Astro deployment you would like to delete.

1. On the working pane of the **Overview**, select **Delete**.

    :::image type="content" source="media/astronomer-manage/astronomer-delete-deployment.png" alt-text="Screenshot showing how to delete an Astro resource.":::

1. Confirm that you want to delete the Astro resource by entering the name of the resource.

    :::image type="content" source="media/astronomer-manage/astronomer-confirm-delete.png" alt-text="Screenshot showing the final confirmation of delete for an Astro resource.":::

1. Select the reason why would you like to delete the resource.

1. Select **Delete**.

After the account is deleted, all billing stops for that Astro resource through Azure Marketplace.

## Next steps

- For help with troubleshooting, see [Troubleshooting Astro integration with Azure](astronomer-troubleshoot.md).
- Get started with Apache Airflow on Astro – An Azure Native ISV Service on
<!--  fix links when marketplace information exists
    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/astronomer.astronomerPLUS%2FastronomerDeployments)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/f5-networks.f5-astronomer-for-azure?tab=Overview) 
-->
