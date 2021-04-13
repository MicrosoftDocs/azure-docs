---
title: Remove DSC package
description: This article tells how to remove a DSC package
services: automation
ms.subservice: dsc
ms.date: 04/10/2021
ms.topic: how-to
---

# Remove a DSC package

This article provides a step-by-step guide for safely removing a desired state configuration (DSC) from your Automation account nodes. For both Windows and Linux nodes, you need to delete the configuration and unregister the node. For Linux nodes only, you can optionally remove remove the DSC and OMI packages as well.

## Delete a configuration in Azure Automation

After you have imported a configuration, you can view it in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Click **Automation Accounts** and then the name of your Automation account.

   :::image type="content" source="./media/remove-dsc-package/automation-accts.png" alt-text="Screenshot of deleting an extension":::

1. On the Automation account page, select **State configuration (DSC)** under **Configuration Management**.
1. On the State configuration (DSC) page, click the **Configurations** tab, then select the name of the configuration you want to delete.
1. Click **Delete** to remove the configuration.

   :::image type="content" source="./media/remove-dsc-package/delete-extension.png" alt-text="Screenshot of deleting an extension":::

## Unregister a node

If you no longer want a node to be managed by State Configuration, you can unregister it.

### Unregister in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Click **Automation Accounts** and then the name of your Automation account.
1. On the Automation account page, select **State configuration (DSC)** under **Configuration Management**.
1. On the State configuration (DSC) page, click the **Nodes** tab.
1. On the **Nodes** tab, select the name of the node you want to unregister.
1. On the pane for that node, click **Unregister**.

:::image type="content" source="./media/remove-dsc-package/unregister-node.png" alt-text="Screenshot of the Node details page highlighting the Unregister button":::

### Unregister using PowerShell

You can also unregister a node using the PowerShell cmdlet [Unregister-AzAutomationDscNode](/powershell/module/az.automation/unregister-azautomationdscnode).

>[!NOTE]
>If your organization still uses the deprecated AzureRM modules, you can use [Unregister-AzureRmAutomationDscNode](/powershell/module/azurerm.automation/unregister-azurermautomationdscnode).

## Remove the DSC package from a Linux node

This step is optional. Removing the packages as described will also remove all logs and related data.

#### RPM-based systems

```bash
RPM -e <package name>
``` 

#### dpkg-based systems

```bash
dpkg -P <package name>
```

 ## Next steps
