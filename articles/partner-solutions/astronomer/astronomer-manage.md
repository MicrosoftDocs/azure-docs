---
title: Manage an Astro resource through the Azure portal
description: This article describes management functions for Astro on the Azure portal.

ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 11/13/2023
---

# Manage your Astro (Preview) integration through the portal

## Single sign-on

Single sign-on (SSO) is already enabled when you created your Astro (Preview) resource. To access Astro through SSO, follow these steps:

1. Navigate to the Overview for your instance of the Astro resource. Select on the SSO Url.

   :::image type="content" source="media/astronomer-manage/astronomer-sso-overview.png" alt-text="Screenshot showing the Single Sign-on url in the  Overview pane of the Astro resource.":::

1. The first time you access this Url, depending on your Azure tenant settings, you might see a request to grant permissions and User consent. This step is only needed the first time you access the SSO Url.

   > [!NOTE]
   > If you are also seeing Admin consent screen then please check your [tenant consent settings](/azure/active-directory/manage-apps/configure-user-consent).
   >

1. Choose a Microsoft Entra account for the Single Sign-on. Once consent is provided, you're redirected to the Astro portal.

## Delete an Astro deployment

Once the Astro resource is deleted, all billing stops for that resource through Azure Marketplace. If you're done using your resource and would like to delete the same, follow these steps:

1. From the Resource menu, select the Astro deployment you would like to delete.

1. On the working pane of the **Overview**, select **Delete**.

    :::image type="content" source="media/astronomer-manage/astronomer-delete-deployment.png" alt-text="Screenshot showing how to delete an Astro resource.":::

1. Confirm that you want to delete the Astro resource by entering the name of the resource.

    :::image type="content" source="media/astronomer-manage/astronomer-confirm-delete.png" alt-text="Screenshot showing the final confirmation of delete for an Astro resource.":::

1. Select the reason why would you like to delete the resource.

1. Select **Delete**.

## Next steps

- For help with troubleshooting, see [Troubleshooting Astro integration with Azure](astronomer-troubleshoot.md).
- Get started with Apache Airflow on Astro – An Azure Native ISV Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://ms.portal.azure.com/?Azure_Marketplace_Astronomer_assettypeoptions=%7B%22Astronomer%22%3A%7B%22options%22%3A%22%22%7D%7D#browse/Astronomer.Astro%2Forganizations)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/astronomer1591719760654.astronomer?tab=Overview)
