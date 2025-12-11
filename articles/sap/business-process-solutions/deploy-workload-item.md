---
title: Deploy workload item
description: Learn the prerequisites and steps to get started with Business Process Solutions in Microsoft Fabric, including deployment requirements and initial setup.
author: mohitmakhija1
ms.service: sap-on-azure
ms.custom: how-to, references_regions
ms.subservice:
ms.topic: how-to
ms.date: 11/07/2025
ms.author: momakhij
---

# Deploy workload item

In this article, we'll describe the steps required to get started with Business Process Solutions. This document contains the prerequisites needed before you can start using Business Process Solutions.

## Supported Regions

Business Process Solutions is delivered as a Fabric workload, which runs entirely within the selected Fabric capacity region. All business data processed and transformed by the solution remains within the chosen Fabric capacity and does not leave that region. To support orchestration and management, a backend service operates in each geography. This backend stores only artifact metadata, such as object list or source system definition. The backend exists solely to enable workload functionality and does not process or retain customer business content. The following table summarizes the regional availability of the solution and the associated backed infrastructure.

| Fabric capacity region | BPS Service Region |
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

## Deploying Business Process Solution in Microsoft Fabric

To deploy Business process solutions, you need:

- A Microsoft Fabric capacity license SKU F2 onwards (F32+ recommended) or Microsoft Power BI Premium license. For more information, see Microsoft Fabric license types.
- You need the Global Administrator role to enable Business Process solutions feature.
- The Power Platform administrator, or the Fabric administrator (Workspace Owner) role to create a new workspace, deploy Business Process solutions in Microsoft Fabric admin portal, and add artifacts in Power BI.
- A workspace in your Fabric environment where you want to deploy Business process solutions.

### Create Microsoft Fabric workspace

Before proceeding with deployment of Business Process Solutions you need to create a Microsoft Fabric workspace. Use the following steps to set up your workspace:

1. Open Microsoft Fabric: [Power BI](https://app.powerbi.com/).
2. From the left menu, choose **Workspaces** and choose **New workspace**.
   :::image type="content" source="./media/deploy-workload-item/new-workspace.jpg" alt-text="Screenshot showing how to create a new Microsoft Fabric workspace." lightbox="./media/deploy-workload-item/new-workspace.jpg":::
3. Provide the Name of the workspace. Open the Advanced settings and choose **Large Semantic Model Storage Format**. Confirm by clicking **Apply**.
   :::image type="content" source="./media/deploy-workload-item/workspace-details.jpg" alt-text="Screenshot showing the new workspace details configuration." lightbox="./media/deploy-workload-item/workspace-details.jpg":::

### Enable Business Process Solutions workload

Use the following steps to enable Business Process Solutions workload in Microsoft Fabric:

1. Open the workloads page by clicking on the more option.
   :::image type="content" source="./media/deploy-workload-item/open-workspace-menu.png" alt-text="Screenshot showing how to open the workloads page." lightbox="./media/deploy-workload-item/open-workspace-menu.png":::
2. Select the Business Process Solutions workload in the Add more workloads section.
   :::image type="content" source="./media/deploy-workload-item/bps-workload.png" alt-text="Screenshot showing how to select the Business Process Solutions workload." lightbox="./media/deploy-workload-item/bps-workload.png":::
3. Once the page opens, click on the Manage button and select 'By workspace'.
   :::image type="content" source="./media/deploy-workload-item/manage-bps-workload.png" alt-text="Screenshot showing how to manage the Business Process Solutions workload." lightbox="./media/deploy-workload-item/manage-bps-workload.png":::
4. Select the workspace you created earlier and click on Update button.
    :::image type="content" source="./media/deploy-workload-item/assign-bps-workload-workspace.png" alt-text="Screenshot showing how to select the workspace for Business Process Solutions workload." lightbox="./media/deploy-workload-item/assign-bps-workload-workspace.png":::

### Deploy Business Process Solutions

Use the following steps to deploy Business Process Solutions:

1. Navigate to the workspace you created earlier.
2. Click on the **New Item** button.
3. Select **Business Process Solutions** from the list of available items.
   :::image type="content" source="./media/deploy-workload-item/bps-workload.png" alt-text="Screenshot showing how to select the Business Process Solutions item." lightbox="./media/deploy-workload-item/bps-workload.png":::
4. Provide a name of the artifact for the Business Process solution and description (optional) that you want to configure. Provide a unique name for the business process solution item in your workspace.
   :::image type="content" source="./media/deploy-workload-item/provide-bps-item-name.png" alt-text="Screenshot showing the Business Process Solutions details input form." lightbox="./media/deploy-workload-item/provide-bps-item-name.png":::
5. After the configuration is complete, You should be able to see the new item created.

### Set up Fabric SQL Database Connection

Business Process Solutions uses a Fabric SQL Database connection to read and orchestrate data processing. This connection must be created before configuring source system connections. Use the following steps to set up the connection.

1. To create a new connection navigate to your workspace and click on the settings button on the top right of the page.
2. Click on the **Manage connections and gateways** button.
   :::image type="content" source="./media/deploy-workload-item/open-settings.png" alt-text="Screenshot showing how to open the settings page." lightbox="./media/deploy-workload-item/open-settings.png":::
3. Click on New Button.

   :::image type="content" source="./media/deploy-workload-item/new-connection.jpg" alt-text="Screenshot showing how to create a new connection." lightbox="./media/deploy-workload-item/new-connection.jpg":::
4. In the new connection input, select the Type as **Cloud**.
5. Enter the connection name.
6. Select Connection type as **Fabric SQL Databas**e.
7. For the authentication method, select **OAuth** and click on **Edit Credentials** and enter the details.
8. Click on Create Button to create the connection.

   :::image type="content" source="./media/deploy-workload-item/enter-connection-details.jpg" alt-text="Screenshot showing how to enter connection details for a new connection." lightbox="./media/deploy-workload-item/enter-connection-details.jpg":::
9. Once the connection is created, open the connection and copy the connection ID and keep it handy.

   :::image type="content" source="./media/deploy-workload-item/copy-connection-details.png" alt-text="Screenshot showing how to copy the connection ID." lightbox="./media/deploy-workload-item/copy-connection-details.png":::

## Next Steps

After deploying Business Process Solutions and creating a Fabric SQL Database connection in your Microsoft Fabric workspace, you can configure source system connections.

- [Configure SAP source system with Azure Data Factory](configure-source-system-with-data-factory.md)
- [Configure SAP source system with Open Mirroring](configure-source-system-with-open-mirroring.md)
- [Configure Salesforce source system](configure-salesforce-source-system.md)
