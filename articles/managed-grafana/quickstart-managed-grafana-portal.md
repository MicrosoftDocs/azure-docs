---
title: 'Quickstart: create an Azure Managed Grafana Preview instance using the Azure portal'
description: Learn how to create a Managed Grafana workspace to generate a new Managed Grafana instance in the Azure portal 
ms.service: managed-grafana
ms.topic: quickstart
author: maud-lv
ms.author: malev
ms.date: 06/10/2022

--- 

# Quickstart: Create an Azure Managed Grafana Preview instance using the Azure portal

Get started by creating an Azure Managed Grafana Preview workspace using the Azure portal. Creating a workspace will generate a Managed Grafana instance.

## Prerequisite

An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).

> [!NOTE]
> Azure Managed Grafana doesn't support personal [Microsoft accounts](https://account.microsoft.com) currently.

## Create a Managed Grafana workspace

1. Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.  

1. In the upper-left corner of the home page, select **Create a resource**. In the **Search services and marketplace** box, enter *Managed Grafana* and select **Azure Managed Grafana**.

    :::image type="content" source="media/managed-grafana-quickstart-marketplace.png" alt-text="Screenshot of the Azure platform. Find Azure Managed Grafana in the marketplace." lightbox="media/managed-grafana-quickstart-marketplace-expanded.png":::

1. Select **Create**.

1. In the **Create Grafana Workspace** pane, enter the following settings.

    :::image type="content" source="media/managed-grafana-quickstart-portal-form.png" alt-text="Screenshot of the Azure portal. Create workspace form.":::

    | Setting             | Sample value     | Description                                                                                                         |
    |---------------------|------------------|---------------------------------------------------------------------------------------------------------------------|
    | Subscription ID     | *mysubscription*   | Select the Azure subscription you want to use.                                                                      |
    | Resource group name | *myresourcegroup* | Select or create a resource group for your Azure Managed Grafana resources.                                         |
    | Location            | *East US*          | Use Location to specify the geographic location in which to host your resource. Choose the location closest to you. |
    | Name                | *mygrafanaworkspace* | Enter a unique resource name. It will be used as the domain name in your Managed Grafana instance URL.                             |

1. Select **Next : Permission >** to access rights for your Grafana instance and data sources:
   1. Make sure the **System assigned identity** is set to **On**. The box **Add role assignment to this identity with 'Monitoring Reader' role on target subscription** should also be checked for this Managed Identity to get access to your current subscription.

   1. Make sure that you're listed as a Grafana administrator. You can also add more users as administrators at this point or later.

    If you uncheck this option (or if the option grays out for you), someone with the Owner role on the subscription can do the role assignment to give you the Grafana Admin permission.

    > [!NOTE]
    > If creating a Managed Grafana instance fails the first time, please try again. The failure might be due to a limitation in our backend, and we are actively working to fix.

1. Optionally select **Next : Tags** and add tags to categorize resources.

1. Select **Next : Review + create >** and then **Create**. Your Azure Managed Grafana resource is deploying.

## Access your Managed Grafana instance

1. Once the deployment is complete, select **Go to resource** to open your resource.  

    :::image type="content" source="media/managed-grafana-quickstart-portal-deployment-complete.png" alt-text="Screenshot of the Azure portal. Message: Your deployment is complete.":::

1. In the **Overview** tab's Essentials section, select the **Endpoint** URL. Single sign-on via Azure Active Directory should have been configured for you automatically. If prompted, enter your Azure account.

    :::image type="content" source="media/managed-grafana-quickstart-workspace-overview.png" alt-text="Screenshot of the Azure portal. Endpoint URL display.":::

    :::image type="content" source="media/managed-grafana-quickstart-portal-grafana-workspace.png" alt-text="Screenshot of a Managed Grafana instance.":::

You can now start interacting with the Grafana application to configure data sources, create dashboards, reporting and alerts.

## Next steps

> [!div class="nextstepaction"]
> [How to configure data sources for Azure Managed Grafana](./how-to-data-source-plugins-managed-identity.md)
> [How to modify access permissions to Azure Monitor](./how-to-permissions.md)
