---
title: 'Quickstart: Linking a Power BI workspace to a Synapse workspace'
description: Link a Power BI workspace to an Azure Synapse Analytics workspace by following the steps in this guide.
author: jocaplan
ms.service: azure-synapse-analytics
ms.topic: quickstart
ms.subservice: business-intelligence
ms.date: 12/20/2024
ms.author: jocaplan
ms.reviewer: whhender
ms.custom: mode-other
---

# Quickstart: Linking a Power BI workspace to a Synapse workspace

In this quickstart, you learn how to connect a Power BI workspace to an Azure Synapse Analytics workspace to create new Power BI reports and datasets from Synapse Studio.

If you don't have an Azure subscription, [create a free account before you begin](https://azure.microsoft.com/free/).

## Prerequisites

- [Create an Azure Synapse workspace and associated storage account](quickstart-create-workspace.md)
- [A Power BI Professional or Premium workspace](/power-bi/service-create-the-new-workspaces)

## Link Power BI workspace to your Synapse workspace

1. Starting from Synapse Studio, select **Manage**.

1. Under **External Connections**, select **Linked services**.

1. Select **+ New**.

    ![+ New linked services is highlighted.](media/quickstart-link-powerbi/new-highlighted.png)

1. Select **Power BI** and select **Continue**.

    ![Displaying Power BI linked service.](media/quickstart-link-powerbi/powerbi-linked-service.png)

1. Enter a name for the linked service and select a workspace from the dropdown list.

    >[!TIP]
    >If the workspace name doesn't load, select **Edit** and then enter your workspace ID. You can find the ID in the URL for the PowerBI workspace: `https://msit.powerbi.com/groups/<workspace id>/`

    ![Displaying Power BI linked service setup.](media/quickstart-link-powerbi/workspace-link-dialog.png)

1. Select **Create**.

## View Power BI workspace in Synapse Studio

Once your workspaces are linked, you can browse your Power BI datasets, edit/create new Power BI Reports from Synapse Studio.

1. Select **Develop**.

1. Expand Power BI and the workspace you wish to use.

    ![Expand Power BI and the workspace.](media/quickstart-link-powerbi/develop-expand-powerbi.png)

New reports can be created selecting **+** at the top of the **Develop** tab. Existing reports can be edited by selecting on the report name. Any saved changes are written back to the Power BI workspace.

![View and edit Power BI report.](media/quickstart-link-powerbi/powerbi-report.png)

## Related content

Learn more about [creating Power BI report on files stored on Azure Storage](sql/tutorial-connect-power-bi-desktop.md).
