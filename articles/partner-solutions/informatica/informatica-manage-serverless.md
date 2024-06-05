---
title: Manage an Informatica serverless runtime environment through the Azure portal
description: This article describes the management functions for Informatica serverless runtime environment on the Azure portal. 

ms.topic: how-to
ms.date: 04/12/2024
---

# Manage your Informatica serverless runtime environments from Azure portal

In this article, you learn various actions available for each of the serverless runtime environments in an IDMC organization.

## Actions

1. Within your Informatica organization, select **Serverless Runtime Environment** from the Resource menu in your Informatica organization.

1. Use actions from the context menu to manage your serverless runtime environments in **Serverless Runtime Environment** pane.

    :::image type="content" source="media/informatica-manage-serverless/informatica-manage-options.png" alt-text="Screenshot of actions to manage serverless runtime environments.":::

    | Property  | Description |
    |---------|---------|
    | **View properties**  | Display the properties of the serverless runtime environment |
    | **Edit properties**     |Edit the properties of the serverless runtime environment. If the environment is up and running, you can edit only certain properties. If the environment failed, you can edit all the properties. |
    | **Delete environment**  | Delete the serverless runtime environment if there are no dependencies. |
    | **Start environment** | Start a serverless runtime environment that wasn't running because it failed. Use this action after you update the properties of the serverless runtime environment. |
    | **Clone environment** | Copy the selected environment to quickly create a new serverless runtime environment. Cloning an environment can save you time if the properties are mostly similar. |

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
