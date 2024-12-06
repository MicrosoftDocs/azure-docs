---
title: Remove DSC and node from Automation State Configuration
description: This article explains how to remove an Azure Automation State Configuration (DSC) configuration document assigned and unregister a managed node.
titleSuffix: Azure Automation
services: automation
ms.subservice: desired-state-config
ms.custom: linux-related-content
ms.date: 10/22/2024
ms.topic: how-to
ms.service: azure-automation
---

# How to remove a configuration and node from Automation State Configuration

[!INCLUDE [azure-automation-dsc-end-of-life](~/includes/dsc-automation/azure-automation-dsc-end-of-life.md)]

[!INCLUDE [automation-dsc-linux-retirement-announcement](../includes/automation-dsc-linux-retirement-announcement.md)]

This article covers how to unregister a node managed by Automation State Configuration, and safely
removes a PowerShell Desired State Configuration (DSC) configuration from managed nodes. For both
Windows and Linux nodes, you need to [unregister the node][09] and
[Delete a configuration from the node][07]. For Linux nodes only, you can optionally delete the DSC
packages from the nodes as well. See [Remove the DSC package from a Linux node][08].

## Unregister a node

> [!NOTE]
> Unregistering a node from the service only sets the Local Configuration Manager settings so the
> node is no longer connecting to the service. This doesn't affect the configuration that's
> currently applied to the node, and leaves the related files in place on the node. After you
> unregister/delete the node, to re-register it, clear the existing configuration files. See
> [Delete a configuration from the node][07].

If you no longer want to manage a node using DSC, you can unregister it from the Azure portal or
with Azure PowerShell using the following steps.

# [Azure portal](#tab/azureportal)

1. Sign in to the [Azure portal][11].
1. Search for and select **Automation Accounts**.
1. On the **Automation Accounts** page, select your Automation account from the list.
1. From your Automation account, select **State configuration (DSC)** under **Configuration Management**.
1. On the **State configuration (DSC)** page, select the **Nodes** tab.
1. On the **Nodes** tab, select the name of the node you want to unregister.
1. On the pane for that node, select **Unregister**.

   :::image type="content" source="./media/remove-node-and-configuration-package/unregister-node.png" alt-text="Screenshot of the Node details page highlighting the Unregister button." lightbox="./media/remove-node-and-configuration-package/unregister-node.png":::

# [Azure PowerShell](#tab/powershell)

You can also unregister a node using the PowerShell cmdlet [Unregister-AzAutomationDscNode][04].

>[!NOTE]
> If your organization still uses the deprecated AzureRM modules, you can use
> [Unregister-AzureRmAutomationDscNode][05].

---


## Delete a configuration from the node

Use either of the following steps to remove an imported DSC configuration document (`.mof` file)
assigned to one or more nodes.

# [Azure portal](#tab/delete-azureportal)

You can delete configurations for both Windows and Linux nodes from the Azure portal.

1. Sign in to the [Azure portal][11].
1. Search for and select **Automation Accounts**.
1. On the **Automation Accounts** page, select your Automation account from the list.
1. From your Automation account, select **State configuration (DSC)** under **Configuration
   Management**.
1. On the **State configuration (DSC)** page, select the **Configurations** tab, then select the name
   of the configuration you want to delete.

   :::image type="content" source="./media/remove-node-and-configuration-package/configurations-tab.png" alt-text="Screenshot of configurations tab." lightbox="./media/remove-node-and-configuration-package/configurations-tab.png":::

1. On the configuration's detail page, select **Delete** to remove the configuration.

   :::image type="content" source="./media/remove-node-and-configuration-package/delete-extension.png" alt-text="Screenshot of deleting an extension." lightbox="./media/remove-node-and-configuration-package/delete-extension.png":::

# [Manual Deletion](#tab/manual-delete-azureportal)

To manually delete the .mof configuration files, follow the steps:

**Delete a Windows configuration using PowerShell**

To remove an imported DSC configuration document (.mof), use the
[Remove-DscConfigurationDocument][06] cmdlet.

**Delete a Linux configuration**

To delete the node's configuration, remove the `.mof` configuration files stored in the
`/etc/opt/omi/conf/dsc/configuration/` directory.


---

## Re-register a node

You can re-register a node just as you registered the node initially, using any of the methods
described in [Enable Azure Automation State Configuration][02]


## Remove the DSC package from a Linux node

This step is optional. Unregistering a Linux node from State Configuration (DSC) doesn't remove the
DSC and OMI packages from the machine. Use the following commands to remove the packages, all logs,
and related data.

To find the package names and other relevant details, see the
[PowerShell Desired State Configuration for Linux][10] GitHub repository.

### RPM-based systems

```bash
rpm -e <package name>
```

### dpkg-based systems

```bash
dpkg -P <package name>
```

 ## Next steps

- If you want to re-register the node, or register a new one, see
  [Register a VM to be managed by State Configuration][03].
- If you want to add the configuration back and recompile, see
  [Compile DSC configurations in Azure Automation State Configuration][01].

<!-- updated link references -->
[01]: ../automation-dsc-compile.md
[02]: ../automation-dsc-onboarding.md
[03]: ../tutorial-configure-servers-desired-state.md#register-a-vm-to-be-managed-by-state-configuration
[04]: /powershell/module/az.automation/unregister-azautomationdscnode
[05]: /powershell/module/azurerm.automation/unregister-azurermautomationdscnode
[06]: /powershell/module/psdesiredstateconfiguration/remove-dscconfigurationdocument
[07]: #delete-a-configuration-from-the-node
[08]: #remove-the-dsc-package-from-a-linux-node
[09]: #unregister-a-node
[10]: https://github.com/Microsoft/PowerShell-DSC-for-Linux
[11]: https://portal.azure.com
