---
title: Deploy Workload Item
description: Learn the prerequisites and steps to get started with Business Process Solutions in Microsoft Fabric, including deployment requirements and initial setup.
author: mohitmakhija1
ms.service: sap-on-azure
ms.custom: how-to, references_regions
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 11/07/2025
ms.author: momakhij
---

# Deploy workload item

This article describes the steps that are required to get started with Business Process Solutions.

## Supported regions

Business Process Solutions is delivered as a Microsoft Fabric workload, which runs entirely within the selected Fabric capacity region. All business data processed and transformed by the solution remains within the chosen Fabric capacity and doesn't leave that region.

To support orchestration and management, a back-end service operates in each geography. This back end stores only artifact metadata, such as an object list or source system definition. The back end exists solely to enable workload functionality and doesn't process or retain customer business content.

The following table summarizes the regional availability of the solution and the associated back-end infrastructure.

| Fabric capacity region | Business Process Solutions service region |
|------------------------|------------------------|
| East US                | East US                |
| Central US             | East US                |
| North Central US       | East US                |
| West Central US        | East US                |
| East US 2              | East US                |
| South Central US       | East US                |
| West US                | East US                |
| West US 2              | East US                |
| North Europe           | West Europe            |
| West Europe            | West Europe            |
| Germany West Central   | West Europe            |
| Germany Central        | West Europe            |
| Germany Northeast      | West Europe            |
| Germany North          | West Europe            |
| Italy North            | West Europe            |
| Norway East            | West Europe            |
| Norway West            | West Europe            |
| Poland Central         | West Europe            |
| Spain Central          | West Europe            |
| Sweden Central         | West Europe            |
| Switzerland North      | West Europe            |
| Switzerland West       | West Europe            |
| UK South               | West Europe            |
| UK West                | West Europe            |
| France Central         | West Europe            |
| Southeast Asia         | Australia East         |
| East Asia              | Australia East         |
| Japan East             | Australia East         |
| Japan West             | Australia East         |
| Korea Central          | Australia East         |
| Korea South            | Australia East         |
| Central India          | Australia East         |
| South India            | Australia East         |
| West India             | Australia East         |
| Israel Central         | Australia East         |
| UAE Central            | Australia East         |
| UAE North              | Australia East         |

## Deploy Business Process Solutions in Microsoft Fabric

To deploy Business Process Solutions, you need:

- A Microsoft Fabric capacity license version F2 and later (F32+ recommended) or a Microsoft Power BI Premium license. For more information, see [Fabric license types](/fabric/enterprise/licenses).
- The Global administrator role to enable Business Process Solutions.
- The Power Platform administrator or the Fabric administrator (Workspace Owner) role to create a new workspace, deploy Business Process Solutions in the Fabric admin portal, and add artifacts in Power BI.
- A workspace in your Fabric environment where you want to deploy Business Process Solutions.

### Create a Microsoft Fabric workspace

Before you proceed with deployment of Business Process Solutions, you need to create a Fabric workspace. To set up your workspace, follow these steps:

1. Open Microsoft Fabric by using [Power BI](https://app.powerbi.com/).
1. Select **Workspaces** > **New workspace**.

   :::image type="content" source="./media/deploy-workload-item/new-workspace.jpg" alt-text="Screenshot that shows how to create a new Microsoft Fabric workspace." lightbox="./media/deploy-workload-item/new-workspace.jpg":::

1. Enter the workspace name. Open **Advanced** and select **Large semantic model storage format**. Select **Apply** to confirm.

   :::image type="content" source="./media/deploy-workload-item/workspace-details.jpg" alt-text="Screenshot that shows the new workspace details configuration." lightbox="./media/deploy-workload-item/workspace-details.jpg":::

### Enable a Business Process Solutions workload

To enable a Business Process Solutions workload in Fabric, follow these steps:

1. To open the workloads page. select the **More** option, and then select **Workloads**.

   :::image type="content" source="./media/deploy-workload-item/open-workspace-menu.png" alt-text="Screenshot that shows how to open the Workloads page." lightbox="./media/deploy-workload-item/open-workspace-menu.png":::

1. In the **Add more workloads** pane, select the **Business Process Solutions** workload.

   :::image type="content" source="./media/deploy-workload-item/bps-workload.png" alt-text="Screenshot that shows how to select the Business Process Solutions workload." lightbox="./media/deploy-workload-item/bps-workload.png":::

1. After the page opens, select **Manage** > **By workspace**.

   :::image type="content" source="./media/deploy-workload-item/manage-bps-workload.png" alt-text="Screenshot that shows how to manage the Business Process Solutions workload." lightbox="./media/deploy-workload-item/manage-bps-workload.png":::

1. Select the workspace that you created earlier, and then select **Update**.

    :::image type="content" source="./media/deploy-workload-item/assign-bps-workload-workspace.png" alt-text="Screenshot that shows how to select the workspace for a Business Process Solutions workload." lightbox="./media/deploy-workload-item/assign-bps-workload-workspace.png":::

### Deploy Business Process Solutions

To deploy Business Process Solutions, follow these steps:

1. Go to the workspace that you created earlier.
1. Select **New Item**.
1. Select **Business Process Solutions** from the list of available items.

   :::image type="content" source="./media/deploy-workload-item/bps-workload.png" alt-text="Screenshot that shows how to select the Business Process Solutions item." lightbox="./media/deploy-workload-item/bps-workload.png":::

1. Enter a name and a description (optional) of the artifact for the solution that you want to configure. Provide a unique name for the Business Process Solutions item in your workspace.

   :::image type="content" source="./media/deploy-workload-item/provide-bps-item-name.png" alt-text="Screenshot that shows the Business Process Solutions details input form." lightbox="./media/deploy-workload-item/provide-bps-item-name.png":::

1. After the configuration is finished, the new item appears.

### Set up a Fabric SQL Database connection

Business Process Solutions uses a Fabric SQL Database connection to read and orchestrate data processing. You must create this connection before you configure source system connections. To set up the connection, follow these steps:

1. To create a new connection, go to your workspace and select **Settings** in the upper-right corner.
1. Select **Manage connections and gateways**.

   :::image type="content" source="./media/deploy-workload-item/open-settings.png" alt-text="Screenshot that shows how to open the Settings page." lightbox="./media/deploy-workload-item/open-settings.png":::

1. Select **New**.

   :::image type="content" source="./media/deploy-workload-item/new-connection.jpg" alt-text="Screenshot that shows how to create a new connection." lightbox="./media/deploy-workload-item/new-connection.jpg":::

1. In the new connection input, select **Cloud** as the type.
1. Enter the connection name.
1. For the connection type, select **Fabric SQL Database**.
1. For the authentication method, select **OAuth** > **Edit Credentials** and enter the details.
1. Select **Create** to create the connection.

   :::image type="content" source="./media/deploy-workload-item/enter-connection-details.jpg" alt-text="Screenshot that shows how to enter connection details for a new connection." lightbox="./media/deploy-workload-item/enter-connection-details.jpg":::

1. Open the connection, copy the connection ID, and keep it handy.

   :::image type="content" source="./media/deploy-workload-item/copy-connection-details.png" alt-text="Screenshot that shows how to copy the connection ID." lightbox="./media/deploy-workload-item/copy-connection-details.png":::

## Related content

After you deploy Business Process Solutions and create a Fabric SQL Database connection in your Fabric workspace, you can configure source system connections:

- [Configure SAP source system with Azure Data Factory](configure-source-system-with-data-factory.md)
- [Configure SAP source system with open mirroring](configure-source-system-with-open-mirroring.md)
- [Configure Salesforce source system](configure-salesforce-source-system.md)
