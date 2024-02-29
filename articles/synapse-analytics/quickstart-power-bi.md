---
title: 'Quickstart: Linking a Power BI workspace to a Synapse workspace'
description: Link a Power BI workspace to an Azure Synapse Analytics workspace by following the steps in this guide.
author: jocaplan
ms.service: synapse-analytics
ms.topic: quickstart
ms.subservice: business-intelligence
ms.date: 10/27/2020
ms.author: jocaplan
ms.reviewer: sngun
ms.custom: mode-other
---

# Quickstart: Linking a Power BI workspace to a Synapse workspace

In this quickstart, you will learn how to connect a Power BI workspace to an Azure Synapse Analytics workspace to create new Power BI reports and datasets from Synapse Studio.

If you don't have an Azure subscription, [create a free account before you begin](https://azure.microsoft.com/free/).

## Prerequisites

- [Create an Azure Synapse workspace and associated storage account](quickstart-create-workspace.md)
- [A Power BI Professional or Premium workspace](/power-bi/service-create-the-new-workspaces)

## Link Power BI workspace to your Synapse workspace

1. Starting from Synapse Studio, click **Manage**.

    ![Synapse Studio click manage.](media/quickstart-link-powerbi/synapse-studio-click-manage.png)

2. Under **External Connections**, click **Linked services**.

    ![Linked services highlighted.](media/quickstart-link-powerbi/manage-click-linked-services.png)

3. Click **+ New**.

    ![+ New linked services is highlighted.](media/quickstart-link-powerbi/new-highlighted.png)

4. Click **Power BI** and click **Continue**.

    ![Displaying Power BI linked service.](media/quickstart-link-powerbi/powerbi-linked-service.png)

5. Enter a name for the linked service and select a workspace from the dropdown list.

    ![Displaying Power BI linked service setup.](media/quickstart-link-powerbi/workspace-link-dialog.png)

6. Click **Create**.

## View Power BI workspace in Synapse Studio

Once your workspaces are linked, you can browse your Power BI datasets, edit/create new Power BI Reports from Synapse Studio.

1. Click **Develop**.

    ![Synapse Studio click develop.](media/quickstart-link-powerbi/synapse-studio-click-develop.png)

2. Expand Power BI and the workspace you wish to use.

    ![Expand Power BI and the workspace.](media/quickstart-link-powerbi/develop-expand-powerbi.png)

New reports can be created clicking **+** at the top of the **Develop** tab. Existing reports can be edited by clicking on the report name. Any saved changes will be written back to the Power BI workspace.

![View and edit Power BI report.](media/quickstart-link-powerbi/powerbi-report.png)


## Next steps

Learn more about [creating Power BI report on files stored on Azure Storage](sql/tutorial-connect-power-bi-desktop.md).
