---
title: Manage an Informatica resource through the Azure portal
description: This article describes the management functions for Informatica IDMC on the Azure portal. 

ms.topic: how-to
ms.date: 04/02/2024
---

# Manage your Informatica organization through the portal

In this article about Intelligent Data Management Cloud (Preview) - Azure Native ISV Service, you learn how to manage single sign-on for your organization, and how to delete an Informatica deployment.

## Single sign-on

Single sign-on (SSO) is already enabled when you created your Informatica Organization. To access Organization through SSO, follow these steps:

1. Navigate to the Overview for your instance of the Informatica organization. Select the SSO UrURLl, or select the IDMC Account Login.

   :::image type="content" source="media/informatica-manage/informatica-sso-overview.png" alt-text="Screenshot showing the Single Sign-on URL in the  Overview pane of the Informatica  resource.":::

1. The first time you access this Url, depending on your Azure tenant settings, you might see a request to grant permissions and User consent. This step is only needed the first time you access the SSO Url.

   > [!NOTE]
   > If you are also seeing Admin consent screen then please check your [tenant consent settings](/azure/active-directory/manage-apps/configure-user-consent).
   >

1. Choose a Microsoft Entra account for the Single Sign-on. Once consent is provided, you're redirected to the Informatica  portal.

## Delete an Informatica deployment

Once the Astro resource is deleted, all billing stops for that resource through Azure Marketplace. If you're done using your resource and would like to delete the same, follow these steps:

1. From the Resource menu, select the Informatica deployment you would like to delete.

1. On the working pane of the **Overview**, select **Delete**.

    :::image type="content" source="media/informatica-manage/informatica-delete-overview.png" alt-text="Screenshot showing how to delete an Informatica resource.":::

1. Confirm that you want to delete the Informatica resource by entering the name of the resource.

    :::image type="content" source="media/informatica-manage/informatica-confirm-delete.png" alt-text="Screenshot showing the final confirmation of delete for an Informatica resource.":::

1. Select the reason why would you like to delete the resource.

1. Select **Delete**.

## Next steps

- Get help with troubleshooting, see [Troubleshooting Informatica integration with Azure](informatica-troubleshoot.md).
<!--
- Get started with Informatica – An Azure Native ISV Service on
 
fix  links when marketplace links work.

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/informatica.informaticaPLUS%2FinformaticaDeployments)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/f5-networks.f5-informatica-for-azure?tab=Overview) 
-->
