---
title: Troubleshooting your Informatica deployment
description: This article provides information about getting support and troubleshooting an Informatica integration.

ms.topic: overview
ms.date: 07/05/2024

---

# Troubleshooting Intelligent Data Management Cloud - Azure Native ISV Service

In this article, you see how to troubleshoot problems you might experience in creating and using an Intelligent Data Management Cloud - Azure Native ISV Service resource.

For information on contacting support, see [Get support for Informatica Intelligent Data Management Cloud](informatica-get-support.md#get-support-for-informatica-intelligent-data-management-cloud).

## Unable to create an Informatica resource as not a subscription owner  

The Informatica integration must be set up by users who have _Owner_ access on the Azure subscription. Ensure you have the appropriate _Owner_ access before starting to set up this integration.

## Unable to create an Informatica resource when the details are not present in User profile

User profile needs to be updated with Key business information for Informatica resource creation. You can update by:

1. Select **Users** and fill out the details.
     :::image type="content" source="media/informatica-troubleshoot/informatica-user-profile.png" alt-text="Screenshot of a user resource provider in the Azure portal.":::

1. Search with **UserName** in users interface.
    :::image type="content" source="media/informatica-troubleshoot/informatica-user-profile-two.png" alt-text="Screenshot of a searching for user in the Azure portal.":::

1. Edit **UserInformation**.
    :::image type="content" source="media/informatica-troubleshoot/informatica-user-profile-three.png" alt-text="Screenshot of a user information in the Azure portal.":::

## Next steps

- Learn about [managing your instance](informatica-manage.md) of Informatica.
<!-- 
- Get started with Informatica – An Azure Native ISV Service on

fix  links when marketplace links work.
    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/informatica.informaticaPLUS%2FinformaticaDeployments)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/f5-networks.f5-informatica-for-azure?tab=Overview) 
-->
