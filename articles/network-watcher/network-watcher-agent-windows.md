---
title: Manage Network Watcher Agent VM extension - Windows
description: Learn about the Network Watcher Agent virtual machine extension on Windows virtual machines and how to deploy it.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 09/23/2025
ms.custom: devx-track-arm-template

# Customer intent: As an Azure administrator, I want to manage the Network Watcher Agent VM extension on my virtual machines, so that I can effectively diagnose and monitor network traffic and performance.
---

# Manage Network Watcher Agent virtual machine extension for Windows

The Network Watcher Agent virtual machine extension is a requirement for some of Azure Network Watcher features that capture network traffic to diagnose and monitor Azure virtual machines (VMs). For more information, see [What is Azure Network Watcher?](network-watcher-overview.md)

In this article, you learn how to install and uninstall Network Watcher Agent for Windows. Installation of the agent doesn't disrupt, or require a reboot of the virtual machine. If the virtual machine is deployed by an Azure service, check the documentation of the service to determine whether or not it permits installing extensions in the virtual machine.

## Prerequisites

# [**Portal**](#tab/portal)

- An Azure Windows virtual machine (VM). For more information, see [Supported Windows versions](#supported-operating-systems).

- Outbound TCP connectivity to `169.254.169.254` over `port 80` and `168.63.129.16` over `port 8037`. The agent uses these IP addresses to communicate with the Azure platform. 

- Internet connectivity: Network Watcher Agent requires internet connectivity for some features to properly work. For example, it requires connectivity to your storage account to upload packet captures.

# [**PowerShell**](#tab/powershell)

- An Azure Windows virtual machine (VM). For more information, see [Supported Windows versions](#supported-operating-systems).

- Outbound TCP connectivity to `169.254.169.254` over `port 80` and `168.63.129.16` over `port 8037`. The agent uses these IP addresses to communicate with the Azure platform. 

- Internet connectivity: Network Watcher Agent requires internet connectivity for some features to properly work. For example, it requires connectivity to your storage account to upload packet captures.

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

# [**Azure CLI**](#tab/cli)

- An Azure Windows virtual machine (VM). For more information, see [Supported Windows versions](#supported-operating-systems).

- Outbound TCP connectivity to `169.254.169.254` over `port 80` and `168.63.129.16` over `port 8037`. The agent uses these IP addresses to communicate with the Azure platform. 

- Internet connectivity: Network Watcher Agent requires internet connectivity for some features to properly work. For example, it requires connectivity to your storage account to upload packet captures.

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

# [**Resource Manager**](#tab/arm)

- An Azure Windows virtual machine (VM). For more information, see [Supported Windows versions](#supported-operating-systems).

- Outbound TCP connectivity to `169.254.169.254` over `port 80` and `168.63.129.16` over `port 8037`. The agent uses these IP addresses to communicate with the Azure platform. 

- Internet connectivity: Network Watcher Agent requires internet connectivity for some features to properly work. For example, it requires connectivity to your storage account to upload packet captures.

- Azure PowerShell or Azure CLI installed locally to deploy the template. 

    - You can [install Azure PowerShell](/powershell/azure/install-azure-powershell) to run the cmdlets. Use [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet to sign in to Azure.

    - You can [install Azure CLI](/cli/azure/install-azure-cli) to run the commands. Use [az login](/cli/azure/reference-index#az-login) command to sign in to Azure.

---

## Supported operating systems

Network Watcher Agent extension for Windows can be installed on:

- Windows Server 2012, 2012 R2, 2016, 2019 and 2022 releases.
- Windows 10 and 11 releases.

> [!NOTE]
> Currently, Nano Server isn't supported.

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
## List installed extensions

# [**Portal**](#tab/portal)

From the virtual machine page in the Azure portal, you can view the installed extension by following these steps:

1. Under **Settings**, select **Extensions + applications**.

1. In the **Extensions** tab, you can see all installed extensions on the virtual machine. If the list is long, you can use the search box to filter the list.

    :::image type="content" source="./media/network-watcher-agent-windows/list-vm-extensions.png" alt-text="Screenshot that shows how to view installed extensions on a VM in the Azure portal." lightbox="./media/network-watcher-agent-windows/list-vm-extensions.png":::

# [**PowerShell**](#tab/powershell)

Use [Get-AzVMExtension](/powershell/module/az.compute/get-azvmextension) cmdlet to list all installed extensions on the virtual machine:

```azurepowershell-interactive
# List the installed extensions on the virtual machine.
Get-AzVMExtension -ResourceGroupName 'myResourceGroup' -VMName 'myVM' | format-table Name, Publisher, ExtensionType, AutoUpgradeMinorVersion, EnableAutomaticUpgrade
```

The output of the cmdlet lists the installed extensions:

```output
Name                         Publisher                      ExtensionType              AutoUpgradeMinorVersion EnableAutomaticUpgrade
----                         ---------                      -------------              ----------------------- ----------------------
AzureNetworkWatcherExtension Microsoft.Azure.NetworkWatcher NetworkWatcherAgentWindows                    True                   True
```


# [**Azure CLI**](#tab/cli)

Use [az vm extension list](/cli/azure/vm/extension#az-vm-extension-list) command to list all installed extensions on the virtual machine:

```azurecli
# List the installed extensions on the virtual machine.
az vm extension list --resource-group 'myResourceGroup' --vm-name 'myVM' --out table
```

The output of the command lists the installed extensions:

```output
Name                          ProvisioningState    Publisher                       Version    AutoUpgradeMinorVersion
----------------------------  -------------------  ------------------------------  ---------  -------------------------
AzureNetworkWatcherExtension  Succeeded            Microsoft.Azure.NetworkWatcher  1.4        True
```

# [**Resource Manager**](#tab/arm)

N/A

---

## Install Network Watcher Agent VM extension

# [**Portal**](#tab/portal)

From the virtual machine page in the Azure portal, you can install the Network Watcher Agent VM extension by following these steps:

1. Under **Settings**, select **Extensions + applications**.

1. Select **+ Add** and search for **Network Watcher Agent** and install it. If the extension is already installed, you can see it in the list of extensions.

    :::image type="content" source="./media/network-watcher-agent-windows/vm-extensions.png" alt-text="Screenshot that shows the VM's extensions page in the Azure portal." lightbox="./media/network-watcher-agent-windows/vm-extensions.png":::

1. In the search box of **Install an Extension**, enter *Network Watcher Agent for Windows*. Select the extension from the list and select **Next**.

    :::image type="content" source="./media/network-watcher-agent-windows/install-extension-windows.png" alt-text="Screenshot that shows how to install Network Watcher Agent for Windows in the Azure portal." lightbox="./media/network-watcher-agent-windows/install-extension-windows.png":::

1. Select **Review + create** and then select **Create**.

# [**PowerShell**](#tab/powershell)

Use [Set-AzVMExtension](/powershell/module/az.compute/set-azvmextension) cmdlet to install Network Watcher Agent VM extension on the virtual machine:

```azurepowershell-interactive
# Install Network Watcher Agent for Windows on the virtual machine.
Set-AzVMExtension -Name 'AzureNetworkWatcherExtension' -Publisher 'Microsoft.Azure.NetworkWatcher' -ExtensionType 'NetworkWatcherAgentWindows' -EnableAutomaticUpgrade 1 -TypeHandlerVersion '1.4' -ResourceGroupName 'myResourceGroup' -VMName 'myVM' 
```

Once the installation is successfully completed, you see the following output:

```output
RequestId IsSuccessStatusCode StatusCode ReasonPhrase
--------- ------------------- ---------- ------------
                         True         OK 
```

# [**Azure CLI**](#tab/cli)

Use [az vm extension set](/cli/azure/vm/extension#az-vm-extension-set) command to install Network Watcher Agent VM extension on the virtual machine: 

```azurecli
# Install Network Watcher Agent for Windows on the virtual machine.
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
# Deploy the JSON template file using Azure PowerShell.
New-AzResourceGroupDeployment -ResourceGroupName 'myResourceGroup' -TemplateFile 'agent.json'
```

```azurecli
# Deploy the JSON template file using the Azure CLI.
az deployment group create --resource-group 'myResourceGroup' --template-file 'agent.json'
```

---

## Uninstall Network Watcher Agent VM extension

# [**Portal**](#tab/portal)

From the virtual machine page in the Azure portal, you can uninstall the Network Watcher Agent VM extension by following these steps:

1. Under **Settings**, select **Extensions + applications**.

1. Select **AzureNetworkWatcherExtension** from the list of extensions, and then select **Uninstall**.

    :::image type="content" source="./media/network-watcher-agent-windows/uninstall-extension-windows.png" alt-text="Screenshot that shows how to uninstall Network Watcher Agent for Windows in the Azure portal." lightbox="./media/network-watcher-agent-windows/uninstall-extension-windows.png":::

    > [!NOTE]
    > You might see Network Watcher Agent VM extension named differently than **AzureNetworkWatcherExtension**.

# [**PowerShell**](#tab/powershell)

Use [Remove-AzVMExtension](/powershell/module/az.compute/remove-azvmextension) cmdlet to remove Network Watcher Agent VM extension from the virtual machine:

```azurepowershell-interactive
# Uninstall Network Watcher Agent VM extension.
Remove-AzVMExtension -Name 'AzureNetworkWatcherExtension' -ResourceGroupName 'myResourceGroup' -VMName 'myVM'
```

# [**Azure CLI**](#tab/cli)

Use [az vm extension delete](/cli/azure/vm/extension#az-vm-extension-delete) command to remove Network Watcher Agent VM extension from the virtual machine:

```azurecli-interactive
# Uninstall Network Watcher Agent VM extension.
az vm extension delete --name 'AzureNetworkWatcherExtension' --resource-group 'myResourceGroup' --vm-name 'myVM'
```

# [**Resource Manager**](#tab/arm)

N/A

---

## Frequently asked questions (FAQ)

To get answers to most frequently asked questions about Network Watcher Agent, see [Network Watcher Agent FAQ](frequently-asked-questions.yml#network-watcher-agent).

## Related content

- [Update Azure Network Watcher extension to the latest version](network-watcher-agent-update.md).
- [Network Watcher documentation](index.yml).
- [Microsoft Q&A - Network Watcher](/answers/topics/azure-network-watcher.html).
