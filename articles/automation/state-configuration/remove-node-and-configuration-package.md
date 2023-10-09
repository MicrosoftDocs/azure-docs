---
title: Remove DSC and node from Automation State Configuration
description: This article explains how to remove an Azure Automation State Configuration (DSC) configuration document assigned and unregister a managed node.
titleSuffix: Azure Automation
services: automation
ms.subservice: dsc
ms.custom: devx-track-linux
ms.date: 04/16/2021
ms.topic: how-to
---

# How to remove a configuration and node from Automation State Configuration

This article covers how to unregister a node managed by Automation State Configuration, and safely remove a PowerShell Desired State Configuration (DSC) configuration from managed nodes. For both Windows and Linux nodes, you need to [unregister the node](#unregister-a-node) and [Delete a configuration from the node](#delete-a-configuration-from-the-node). For Linux nodes only, you can optionally delete the DSC packages from the nodes as well. See [Remove the DSC package from a Linux node](#remove-the-dsc-package-from-a-linux-node).

## Unregister a node

>[!NOTE]
> Unregistering a node from the service only sets the Local Configuration Manager settings so the node is no longer connecting to the service. This does not effect the configuration that's currently applied to the node, and leaves the related files in place on the node. After you unregister/delete the node, to re-register it, clear the existing configuration files. See [Delete a configuration from the node](#delete-a-configuration-from-the-node).

If you no longer want a node to be managed by State Configuration (DSC), you can unregister it from the Azure portal or with Azure PowerShell using the following steps.

 # [Azure portal](#tab/azureportal)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Automation Accounts**.
1. On the **Automation Accounts** page, select your Automation account from the list.
1. From your Automation account, select **State configuration (DSC)** under **Configuration Management**.
1. On the **State configuration (DSC)** page, click the **Nodes** tab.
1. On the **Nodes** tab, select the name of the node you want to unregister.
1. On the pane for that node, click **Unregister**.

   :::image type="content" source="./media/remove-node-and-configuration-package/unregister-node.png" alt-text="Screenshot of the Node details page highlighting the Unregister button." lightbox="./media/remove-node-and-configuration-package/unregister-node.png":::

# [Azure PowerShell](#tab/powershell)

You can also unregister a node using the PowerShell cmdlet [Unregister-AzAutomationDscNode](/powershell/module/az.automation/unregister-azautomationdscnode).

>[!NOTE]
> If your organization still uses the deprecated AzureRM modules, you can use [Unregister-AzureRmAutomationDscNode](/powershell/module/azurerm.automation/unregister-azurermautomationdscnode).

---


## Delete a configuration from the node

When you're ready to remove an imported DSC configuration document (which is a Managed Object Format (MOF) or .mof file) that's assigned to one or more nodes, follow either of these steps.

# [Azure portal](#tab/delete-azureportal)

You can delete configurations for both Windows and Linux nodes from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Automation Accounts**.
1. On the **Automation Accounts** page, select your Automation account from the list.
1. From your Automation account, select **State configuration (DSC)** under **Configuration Management**.
1. On the **State configuration (DSC)** page, click the **Configurations** tab, then select the name of the configuration you want to delete.

   :::image type="content" source="./media/remove-node-and-configuration-package/configurations-tab.png" alt-text="Screenshot of configurations tab." lightbox="./media/remove-node-and-configuration-package/configurations-tab.png":::

1. On the configuration's detail page, click **Delete** to remove the configuration.

   :::image type="content" source="./media/remove-node-and-configuration-package/delete-extension.png" alt-text="Screenshot of deleting an extension." lightbox="./media/remove-node-and-configuration-package/delete-extension.png":::

# [Manual Deletion](#tab/manual-delete-azureportal)

To manually delete the .mof configuration files, follow the steps:

**Delete a Windows configuration using PowerShell**

To remove an imported DSC configuration document (.mof), use the [Remove-DscConfigurationDocument](/powershell/module/psdesiredstateconfiguration/remove-dscconfigurationdocument) cmdlet.

**Delete a Linux configuration**

The configuration files are stored in /etc/opt/omi/conf/dsc/configuration/. Remove the .mof files in this directory to delete the node's configuration.


---

## Re-register a node
You can re-register a node just as you registered the node initially, using any of the methods described in [Enable Azure Automation State Configuration](../automation-dsc-onboarding.md)


## Remove the DSC package from a Linux node

This step is optional. Unregistering a Linux node from State Configuration (DSC) doesn't remove the DSC and OMI packages from the machine. Use the commands below to remove the packages as well as all logs and related data.

To find the package names and other relevant details, see the [PowerShell Desired State Configuration for Linux](https://github.com/Microsoft/PowerShell-DSC-for-Linux) GitHub repository.

### RPM-based systems

```bash
rpm -e <package name>
``` 

### dpkg-based systems

```bash
dpkg -P <package name>
```

 ## Next steps

- If you want to re-register the node, or register a new one, see [Register a VM to be managed by State Configuration](../tutorial-configure-servers-desired-state.md#register-a-vm-to-be-managed-by-state-configuration).

- If you want to add the configuration back and recompile, see [Compile DSC configurations in Azure Automation State Configuration](../automation-dsc-compile.md).
