---
title: Create an Azure Managed Grafana workspace - Azure portal
titleSuffix: Azure Managed Grafana
description: In this quickstart, you learn how to create an Azure Managed Grafana workspace using the Azure portal.
#customer intent: As a developer or data professional, I want to learn how to create an Azure Managed Grafana workspace so that I use Grafana within Azure.
ms.service: azure-managed-grafana
ms.topic: quickstart
author: maud-lv
ms.author: malev
ms.date: 09/18/2026
--- 

# Quickstart: Create an Azure Managed Grafana workspace using the Azure portal

In this quickstart, you create an Azure Managed Grafana workspace by using the Azure portal and open its Grafana endpoint.

## Prerequisites

- An Azure account for work or school and an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- The Contributor role on the resource group where you create the workspace.

## Create an Azure Managed Grafana workspace

1. Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.  

1. In the **Search resources, services, and docs (G+/)** box, enter *Azure Managed Grafana* and select **Azure Managed Grafana**.

1. Select **Create**.

### Configure the basic settings

1. On the **Basics** tab, enter the following settings.

| Setting | Sample value | Description |
|---|---|---|
| **Subscription ID** | *my-subscription* | Select the Azure subscription you want to use. |
| **Resource group name** | *my-resource-group* | Select **Create new** and create a resource group for this quickstart. Using a dedicated resource group makes it easier to clean up the workspace later. |
| **Location** | *(US) East US* | Select a region for your workspace. |
| **Name** | *my-grafana* | Enter a unique resource name. The name is used in the domain name for the workspace URL. |
| **Pricing plan** | *Standard* | Standard is the only plan available for new workspaces. For details, see [Azure Managed Grafana service tiers](overview.md#service-tiers). |
| **Instance size** | *X1* | Select the default X1 instance size or the larger X2 instance size. X2 incurs an additional cost, and you can't downgrade from X2 to X1. For quota and capacity differences, see [Azure Managed Grafana service tiers](overview.md#service-tiers). |
| **Grafana version** | *Latest available* | Select the latest available Grafana version unless your organization requires a specific supported version. |
| **Zone redundancy** | *Disabled* | Optionally enable zone redundancy for the workspace. This option incurs an additional charge and can be enabled only when you create the workspace. For more information, see [Enable zone redundancy in Azure Managed Grafana](how-to-enable-zone-redundancy.md). |

### Configure advanced settings

1. Select **Next : Advanced >**.
1. Review the following optional settings:
    - **Enable API key creation** is set to **Disable** by default.
    - **Deterministic outbound IP** is set to **Disable** by default. Enable it if downstream services must allow list stable outbound IP addresses from the workspace.

### Configure permissions

1. Select **Next : Permission >** to configure access to the Grafana workspace and its data sources.
1. Review the managed identity setting. If you have the Owner or User Access Administrator role on the subscription, **System assigned managed identity** is set to **On** by default.

    > [!NOTE]
    > After the workspace is deployed, you can replace the system-assigned managed identity with a user-assigned managed identity. For more information, see [Configure Azure Managed Grafana authentication and permissions](how-to-authentication-permissions.md).

1. Configure role assignments based on your Azure permissions:
    - If you're a subscription Owner or a User Access Administrator:
        - **Add role assignment to this identity with 'Monitoring Reader' role on target subscription** is selected by default. This assignment lets Azure Managed Grafana read monitoring data from Azure resources in the subscription.
        - **Include myself** under **Grafana administrator role** is selected. This option assigns you the Grafana Admin role. To assign the role to more people, select **Add**.
    - If you're not a subscription Owner or a User Access Administrator, ask someone with either role to assign you a [Grafana role](how-to-manage-access-permissions-users-identities.md). For testing, you can instead enable **Creator can admin (Preview)** if the option is available.

    > [!NOTE]
    > You can enable **Creator can admin (Preview)** only while creating the workspace. You can disable it later from the **Configuration** menu, but you can't enable it again. Before disabling the option, make sure that the workspace creator has been assigned a [Grafana role](how-to-manage-access-permissions-users-identities.md).

    > [!NOTE]
    > **Creator can admin (Preview)** isn't available for some scenarios, including workspaces managed by Cloud Solution Providers (CSPs). In CSP scenarios, the service can't identify the individual workspace creator and grant that person administrator permissions.

    > [!IMPORTANT]
    > Use **Creator can admin (Preview)** only for testing. For ongoing access, assign a [Grafana role](how-to-manage-access-permissions-users-identities.md) to each person who needs the Grafana application, and then disable **Creator can admin (Preview)**.

### Configure networking and tags

1. Select **Next : Networking >**.
1. Keep public access enabled, or disable it and create a private endpoint for the workspace.
1. Optionally select **Next : Tags >** and add tags to categorize the resource.

### Review and create the workspace

1. Select **Next : Review + create >**.
1. After validation succeeds, select **Create**.
1. Wait for the deployment to finish.

## Access your Azure Managed Grafana workspace

1. When the deployment is complete, select **Go to resource**.

1. On the **Overview** page, select the **Endpoint** URL. Microsoft Entra ID single sign-on is configured automatically. If prompted, sign in with your Azure account.

1. The Grafana application opens. You can now configure data sources and create dashboards, reports, and alerts. For an example, see [Monitor Azure services and applications by using Grafana](/azure/azure-monitor/visualize/grafana-plugin).

    :::image type="content" source="media/quickstart-portal/grafana-ui.png" alt-text="Screenshot of the Grafana home page.":::

## Clean up resources

If you created a resource group for this quickstart and don't need the resources anymore, delete the resource group. Deleting a resource group permanently deletes every resource it contains.

1. In the **Search resources, services, and docs (G+/)** box in the Azure portal, enter the name of your resource group and select it.
1. On the **Overview** page, verify that the resource group contains only resources that you want to delete.
1. Select **Delete**, type the name of your resource group in the text box, and then select **Delete**.

If you used an existing resource group, delete the Azure Managed Grafana workspace instead of the resource group.

## Next step

> [!div class="nextstepaction"]
> [How to configure data sources for Azure Managed Grafana](./how-to-data-source-plugins-managed-identity.md)
