---
title: Manage Network Watcher Agent VM extension - Windows 
description: Learn about the Network Watcher Agent virtual machine extension on Windows virtual machines and how to deploy it.
author: halkazwini
ms.author: halkazwini
ms.service: virtual-machines
ms.subservice: extensions
ms.topic: how-to
ms.date: 03/29/2024
ms.collection: windows

#CustomerIntent: As an Azure administrator, I want to learn about Network Watcher Agent VM extension so that I can use Network watcher features to diagnose and monitor my VMs.
---

# Manage Network Watcher Agent virtual machine extension for Windows

[Azure Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md) is a network performance monitoring, diagnostic, and analytics service that allows monitoring for Azure networks. The Network Watcher Agent virtual machine extension is a requirement for some of the Network Watcher features on Azure virtual machines (VMs). For more information, see [Network Watcher Agent FAQ](../../network-watcher/frequently-asked-questions.yml#network-watcher-agent).

In this article, you learn about the supported platforms and deployment options for the Network Watcher Agent VM extension for Windows. Installation of the agent doesn't disrupt, or require a reboot of the virtual machine. You can install the extension on virtual machines that you deploy. If the virtual machine is deployed by an Azure service, check the documentation for the service to determine whether or not it permits installing extensions in the virtual machine.

## Prerequisites

# [**Portal**](#tab/portal)

- An Azure Windows virtual machine. For more information, see [Supported Windows versions](#supported-operating-systems).

- Internet connectivity: Some of the Network Watcher Agent functionality requires that the virtual machine is connected to the Internet. Without the ability to establish outgoing connections, the Network Watcher Agent can't upload packet captures to your storage account. For more information, see [Packet capture overview](../../network-watcher/packet-capture-overview.md).

# [**PowerShell**](#tab/powershell)

- An Azure Windows virtual machine. For more information, see [Supported Windows versions](#supported-operating-systems).

- Internet connectivity: Some of the Network Watcher Agent functionality requires that the virtual machine is connected to the Internet. Without the ability to establish outgoing connections, the Network Watcher Agent can't upload packet captures to your storage account. For more information, see [Packet capture overview](../../network-watcher/packet-capture-overview.md).

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. This article requires the Azure PowerShell `Az` module. To find the installed version, run `Get-Module -ListAvailable Az`. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

# [**Azure CLI**](#tab/cli)

- An Azure Windows virtual machine. For more information, see [Supported Windows versions](#supported-operating-systems).

- Internet connectivity: Some of the Network Watcher Agent functionality requires that the virtual machine is connected to the Internet. Without the ability to establish outgoing connections, the Network Watcher Agent can't upload packet captures to your storage account. For more information, see [Packet capture overview](../../network-watcher/packet-capture-overview.md).

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

# [**Resource Manager**](#tab/arm)

- An Azure Windows virtual machine. For more information, see [Supported Windows versions](#supported-operating-systems).

- Internet connectivity: Some of the Network Watcher Agent functionality requires that the virtual machine is connected to the Internet. Without the ability to establish outgoing connections, the Network Watcher Agent can't upload packet captures to your storage account. For more information, see [Packet capture overview](../../network-watcher/packet-capture-overview.md).

- Azure PowerShell or Azure CLI installed locally to deploy the template. 

    - You can [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. Use [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet to sign in to Azure.

    - You can [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. Use [az login](/cli/azure/reference-index#az-login) command to sign in to Azure.

---

## Supported operating systems

Network Watcher Agent extension for Windows can be installed on Windows Server 2012, 2012 R2, 2016, 2019 and 2022 releases. Currently, Nano Server isn't supported.

## Extension schema

The following JSON shows the schema for the Network Watcher Agent extension. The extension doesn't require, or support, any user-supplied settings, and relies on its default configuration.

```json
{
    "name": "[concat(parameters('vmName'), '/AzureNetworkWatcherExtension')]",
    "type": "Microsoft.Compute/virtualMachines/extensions",
    "apiVersion": "2023-03-01",
    "location": "[resourceGroup().location]",
    "dependsOn": [
        "[concat('Microsoft.Compute/virtualMachines/', parameters('vmName'))]"
    ],
    "properties": {
        "autoUpgradeMinorVersion": true,
        "publisher": "Microsoft.Azure.NetworkWatcher",
        "type": "NetworkWatcherAgentWindows",
        "typeHandlerVersion": "1.4"
    }
}
```

## Install Network Watcher Agent VM extension

# [**Portal**](#tab/portal)

1. In the Azure portal, go to the virtual machine that you want to install the extension on.

1. Under **Settings**, select **Extensions + applications**.

1. Select **+ Add** and search for **Network Watcher Agent** and install it. If the extension is already installed, you can see it in the list of extensions.

    :::image type="content" source="./media/network-watcher/vm-extensions.png" alt-text="Screenshot that shows the VM's extensions page in the Azure portal." lightbox="./media/network-watcher/vm-extensions.png":::

1. In the search box of **Install an Extension**, enter *Network Watcher Agent for Windows*. Select the extension from the list and select **Next**.

    :::image type="content" source="./media/network-watcher/install-extension-windows.png" alt-text="Screenshot that shows how to install Network Watcher Agent for Windows in the Azure portal." lightbox="./media/network-watcher/install-extension-windows.png":::

1. Select **Review + create** and then select **Create**.

# [**PowerShell**](#tab/powershell)

Use [Get-AzVMExtension](/powershell/module/az.compute/get-azvmextension) cmdlet to check if Network Watcher Agent VM extension is installed on the virtual machine:

```azurepowershell-interactive
# List the installed extensions on the virtual machine.
Get-AzVMExtension -VMName 'myVM' -ResourceGroupName 'myResourceGroup' | format-table Name, Publisher, ExtensionType, EnableAutomaticUpgrade 
```

If the extension is already installed on the virtual machine, then you can see it listed in the output of the preceding cmdlet:

```output
Name                         Publisher                      ExtensionType            EnableAutomaticUpgrade
----                         ---------                      -------------            ----------------------
AzureNetworkWatcherExtension Microsoft.Azure.NetworkWatcher NetworkWatcherAgentWindows                   True
```

If the extension isn't installed, then use [Set-AzVMExtension](/powershell/module/az.compute/set-azvmextension) cmdlet to install it:


```azurepowershell-interactive
Set-AzVMExtension -Name 'AzureNetworkWatcherExtension' -Publisher 'Microsoft.Azure.NetworkWatcher' -ExtensionType 'NetworkWatcherAgentWindows' -EnableAutomaticUpgrade 1 -TypeHandlerVersion '1.4' -ResourceGroupName 'myResourceGroup' -VMName 'myVM' 
```

Once the installation is successfully completed, you see the following output:

```output
RequestId IsSuccessStatusCode StatusCode ReasonPhrase
--------- ------------------- ---------- ------------
                         True         OK 
```

# [**Azure CLI**](#tab/cli)

Use [az vm extension list](/cli/azure/vm/extension#az-vm-extension-list) command to check if Network Watcher Agent VM extension is installed on the virtual machine:

```azurecli
az vm extension list --resource-group 'myResourceGroup' --vm-name 'myVM' --out table
```

If the extension is already installed on the virtual machine, then you can see it listed in the output of the preceding command:

```output
Name                          ProvisioningState    Publisher                       Version    AutoUpgradeMinorVersion
----------------------------  -------------------  ------------------------------  ---------  -------------------------
AzureNetworkWatcherExtension  Succeeded            Microsoft.Azure.NetworkWatcher  1.4        True
```

If the extension isn't installed, then use [az vm extension set](/cli/azure/vm/extension#az-vm-extension-set) command to install it: 

```azurecli
az vm extension set --name 'NetworkWatcherAgentWindows' --extension-instance-name 'AzureNetworkWatcherExtension' --publisher 'Microsoft.Azure.NetworkWatcher' --enable-auto-upgrade 'true' --version '1.4' --resource-group 'myResourceGroup' --vm-name 'myVM'
```

# [**Resource Manager**](#tab/arm)

Use the following Azure Resource Manager template (ARM template) to install Network Watcher Agent VM extension on a Windows virtual machine:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
                "type": "string"
            }
    },
    "variables": {},
    "resources": [
        {
                "name": "[parameters('vmName')]",
                "type": "Microsoft.Compute/virtualMachines",
                "apiVersion": "2023-03-01",
                "location": "[resourceGroup().location]",
                "properties": {
                }
            },
            {
                "name": "[concat(parameters('vmName'), '/AzureNetworkWatcherExtension')]",
                "type": "Microsoft.Compute/virtualMachines/extensions",
                "apiVersion": "2023-03-01",
                "location": "[resourceGroup().location]",
                "dependsOn": [
                    "[concat('Microsoft.Compute/virtualMachines/', parameters('vmName'))]"
                ],
                "properties": {
                    "autoUpgradeMinorVersion": true,
                    "publisher": "Microsoft.Azure.NetworkWatcher",
                    "type": "NetworkWatcherAgentWindows",
                    "typeHandlerVersion": "1.4"
                }
            }
    ],
    "outputs": {}
}
```

You can use either Azure PowerShell or Azure CLI to deploy the Resource Manager template:

```azurepowershell
New-AzResourceGroupDeployment -ResourceGroupName 'myResourceGroup' -TemplateFile 'agent.json'
```

```azurecli
az deployment group create --resource-group 'myResourceGroup' --template-file
```

---

## Uninstall Network Watcher Agent VM extension

# [**Portal**](#tab/portal)

From the virtual machine page in the Azure portal, you can uninstall the Network Watcher Agent VM extension by following these steps:

1. Under **Settings**, select **Extensions + applications**.

1. Select **AzureNetworkWatcherExtension** from the list of extensions, and then select **Uninstall**.

    :::image type="content" source="./media/network-watcher/uninstall-extension-windows.png" alt-text="Screenshot that shows how to uninstall Network Watcher Agent for Windows in the Azure portal." lightbox="./media/network-watcher/uninstall-extension-windows.png":::

    > [!NOTE]
    > In the list of extensions, you might see Network Watcher Agent VM extension named differently than **AzureNetworkWatcherExtension**.

# [**PowerShell**](#tab/powershell)

Use [Remove-AzVMExtension](/powershell/module/az.compute/remove-azvmextension) cmdlet to remove Network Watcher Agent VM extension from the virtual machine:

```azurepowershell-interactive
Remove-AzureVMExtension -Name 'AzureNetworkWatcherExtension' -ResourceGroupName 'myResourceGroup' -VMName 'myVM'
```

# [**Azure CLI**](#tab/cli)

Use [az vm extension delete](/cli/azure/vm/extension#az-vm-extension-delete) command to remove Network Watcher Agent VM extension from the virtual machine:

```azurecli-interactive
az vm extension delete --name 'AzureNetworkWatcherExtension' --resource-group 'myResourceGroup' --vm-name 'myVM'
```

# [**Resource Manager**](#tab/arm)

N/A

---


## Related content

- [Update Azure Network Watcher extension to the latest version](network-watcher-update.md).
- [Network Watcher documentation](../../network-watcher/index.yml).
- [Microsoft Q&A - Network Watcher](/answers/topics/azure-network-watcher.html).
