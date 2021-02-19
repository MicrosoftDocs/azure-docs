---
title: Remove DSC package
description: This article tells how to remove a DSC package
services: automation
ms.subservice: dsc
ms.date: 02/18/2021
ms.topic: how-to
---

# Remove a DSC package

This article provides a step-by-step guide for safely removing a desired state configuration (DSC) from your Automation account nodes.

## Delete a configuration in Azure Automation

After you have imported a configuration, you can view it in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Click **Automation Accounts** and then the name of your Automation account.

   :::image type="content" source="./media/remove-dsc-package/automation-accts.png" alt-text="Screenshot of deleting an extension":::


1. On the Automation account page, select **Configuration Management > State configuration (DSC)**.
1. On the State configuration (DSC) page, click the **Configurations** tab, then select the name of the configuration you want to delete.
1. Click **Delete** to remove the configuration.

   :::image type="content" source="./media/remove-dsc-package/delete-extension.png" alt-text="Screenshot of deleting an extension":::

## Unregister a node

If you no longer want a node to be managed by State Configuration, you can unregister it.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Click **Automation Accounts** and then the name of your Automation account.
1. On the Automation account page, select **Configuration Management > State configuration (DSC)**.
1. On the State configuration (DSC) page, click the **Nodes** tab.
1. On the **Nodes** tab, click on the name of the node you want to unregister.
1. On the pane for that node, click **Unregister**.

:::image type="content" source="./media/remove-dsc-package/unregister-node.png" alt-text="Screenshot of the Node details page highlighting the Unregister button":::

## Remove the DSC package

 ## Next steps
    