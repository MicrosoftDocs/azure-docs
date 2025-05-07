---
title: Create an Azure Managed Grafana workspace - Azure portal
titleSuffix: Azure Managed Grafana
description: In this quickstart, you learn how to create an Azure Managed Grafana workspace using the Azure portal.
#customer intent: As a developer or data professional, I want to learn how to create an Azure Managed Grafana workspace so that I use Grafana within Azure.
ms.service: azure-managed-grafana
ms.topic: quickstart
author: maud-lv
ms.author: malev
ms.date: 04/16/2025
--- 

# Quickstart: Create an Azure Managed Grafana workspace using the Azure portal

In this quickstart, you get started with Azure Managed Grafana by creating an Azure Managed Grafana workspace using the Azure portal.

## Prerequisites

- An Azure account for work or school and an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- Minimum required role to create a workspace: resource group Contributor.

## Create an Azure Managed Grafana workspace

1. Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.  

1. In the **Search resources, services, and docs (G+/)** box, enter *Azure Managed Grafana* and select **Azure Managed Grafana**.

    :::image type="content" source="media/quickstart-portal/find-azure-portal-grafana.png" alt-text="Screenshot of the Azure platform. Find Azure Managed Grafana in the marketplace." :::

1. Select **Create**.

1. In the **Basics** pane, enter the following settings.

    | Setting             | Sample value          | Description                                                                                                                                                                                                                                                                                                                     |
    |---------------------|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | Subscription ID     | *my-subscription*     | Select the Azure subscription you want to use.                                                                                                                                                                                                                                                                                  |
    | Resource group name | *my-resource-group*   | Create a resource group for your Azure Managed Grafana resources.                                                                                                                                                                                                                                                               |
    | Location            | *(US) East US*        | Use Location to specify the geographic location in which to host your resource. Choose the location closest to you.                                                                                                                                                                                                             |
    | Name                | *my-grafana*          | Enter a unique resource name. It will be used as the domain name in your Azure Managed Grafana workspace URL.                                                                                                                                                                                                                    |
    | Pricing plan        | *Essential (preview)* | Choose between the Essential (preview) or the Standard plan. The Essential plan is the cheapest option you can use to evaluate the service. This plan doesn't have an SLA and isn't recommended for production use. For more information about Azure Managed Grafana plans, go to [pricing plans](overview.md#service-tiers). |
    | Grafana version     | *11*                  | Choose the latest Grafana version, or the version that best suits your needs. |

1. If you've chosen the Standard plan, optionally enable zone redundancy for your new workspace.
1. Select **Next : Advanced >** to access additional options:
    - **Enable API key creation** is set to **Disable** by default.
    - If you've opted for the Standard plan, optionally enable the **Deterministic outbound IP** feature, which is set to **Disable** by default.

1. Select **Next : Permission >** to control access rights for your Grafana instance and data sources:
    - **System assigned managed identity** is set to **On**.

      > [!NOTE]
      > You can use a user-assigned managed identity instead of the default system-assigned managed identity once the Azure Managed Grafana resource is deployed. For more information, go to [Set up Azure Managed Grafana authentication and permissions (preview)](how-to-authentication-permissions.md).

    - If you're a subscription Owner or a User Access Administrator:
        - the box **Add role assignment to this identity with 'Monitoring Reader' role on target subscription** is checked by default. This role assignment allows Azure Managed Grafana to access and display monitoring data from various Azure services.
        - the box **Include myself** under **Grafana administrator role** is checked. This option grants you the Grafana administrator role, and lets you manage access rights. Optionally select **Add** to share this right with team members.
    - If you're not a subscription Owner or a User Access Administrator, you can either:
        - ask a subscription Owner or a User Access Administrator to assign you the Grafana Admin role
        - or enable **Creator can admin (Preview)**. This option available in preview grants you the required permissions to access and manage the Grafana resource.

        > [!NOTE]
        > The **Creator can admin (Preview)** option can only be enabled when creating the workspace. Later on, it can be disabled from the **Configuration** menu if the workspace creator doesn't need this level of access anymore. Once disabled, it cannot be enabled again. If this option is disabled and the user needs to access this Grafana instance again, they will need [a Grafana role](how-to-manage-access-permissions-users-identities.md).

        > [!NOTE]
        > The **Creator can admin (Preview)** option may not be available in some specific scenarios. For example, it doesn't support workspaces managed by Cloud Solution Providers (CSPs). In CSP scenarios, the necessary information about the individual creator of the resource is not accessible. As a result, the feature cannot grant administrative privileges to the creator.

1. If you've opted for the Standard plan, in the **Networking** tab, optionally disable public access and create a private endpoint that can access your resource.
 
1. Optionally select **Next : Tags** and add tags to categorize resources.

1. Select **Next : Review + create >**. After validation runs, select **Create**. Your Azure Managed Grafana resource is deploying.

## Access your Azure Managed Grafana workspace

1. Once the deployment is complete, select **Go to resource** to open your resource.

1. In the **Overview** tab, select the **Endpoint** URL. Single sign-on via Microsoft Entra ID has been configured for you automatically. If prompted, enter your Azure account. 

    :::image type="content" source="media/quickstart-portal/grafana-overview.png" alt-text="Screenshot of the Azure portal. Endpoint URL display.":::

    You can now start interacting with the Grafana application to configure data sources, create dashboards, reports and alerts. Suggested read: [Monitor Azure services and applications using Grafana](/azure/azure-monitor/visualize/grafana-plugin).

    :::image type="content" source="media/quickstart-portal/grafana-ui.png" alt-text="Screenshot of an Azure Managed Grafana workspace.":::

> [!IMPORTANT]
> The **Creator can admin (Preview)** option is designed to be used for testing purposes. Whenever possible, we recommend assigning a [Grafana role](how-to-manage-access-permissions-users-identities.md) to all team members who need to access the Grafana portal and disabling the **Creator can edit** option.

## Clean up resources

In the preceding steps, you created an Azure Managed Grafana workspace in a new resource group. If you don't expect to need these resources again in the future, delete the resource group.

1. In the **Search resources, services, and docs (G+/)** box in the Azure portal, enter the name of your resource group and select it.
1. In the **Overview** page, make sure that the listed resources are the ones you want to delete.
1. Select **Delete**, type the name of your resource group in the text box, and then select **Delete**.

## Next step

> [!div class="nextstepaction"]
> [How to configure data sources for Azure Managed Grafana](./how-to-data-source-plugins-managed-identity.md)
