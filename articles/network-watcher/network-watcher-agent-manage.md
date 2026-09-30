---
title: Manage Network Watcher Agent VM Extension
description: Learn about the Network Watcher Agent virtual machine extension and how to install, update, and uninstall it on Windows and Linux virtual machines.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 09/14/2026
ms.custom: devx-track-arm-template, linux-related-content, devx-track-azurepowershell, devx-track-azurecli
zone_pivot_groups: network-watcher-agent-os

# Customer intent: As an Azure administrator, I want to manage the Network Watcher Agent VM extension on my Windows or Linux virtual machines, so that I can effectively diagnose and monitor network traffic and performance.
---

# Manage Network Watcher Agent virtual machine extension

The Network Watcher Agent virtual machine extension is a requirement for some of Azure Network Watcher features that capture network traffic to diagnose and monitor Azure virtual machines (VMs). For more information, see [What is Azure Network Watcher?](network-watcher-overview.md)

In this article, you learn how to install, update, and uninstall Network Watcher Agent for Windows and Linux. Installation of the agent doesn't disrupt, or require a reboot of the virtual machine. If the virtual machine is deployed by an Azure service, check the documentation of the service to determine whether the service permits installing extensions in the virtual machine.

::: zone pivot="linux"
> [!NOTE]
> Network Watcher Agent extension isn't supported on AKS clusters.
::: zone-end

## Prerequisites

# [**Portal**](#tab/portal)

- An Azure virtual machine (VM) running a supported operating system. For more information, see [Supported operating systems](#supported-operating-systems).

- Outbound TCP connectivity to `169.254.169.254` over `port 80` and `168.63.129.16` over `port 8037`. The agent uses these IP addresses to communicate with the Azure platform.

- Internet connectivity: Network Watcher Agent requires internet connectivity for some features to work properly. For example, it requires connectivity to your storage account to upload packet captures.

# [**PowerShell**](#tab/powershell)

- An Azure virtual machine (VM) running a supported operating system. For more information, see [Supported operating systems](#supported-operating-systems).

- Outbound TCP connectivity to `169.254.169.254` over `port 80` and `168.63.129.16` over `port 8037`. The agent uses these IP addresses to communicate with the Azure platform.

- Internet connectivity: Network Watcher Agent requires internet connectivity for some features to work properly. For example, it requires connectivity to your storage account to upload packet captures.

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

# [**Azure CLI**](#tab/cli)

- An Azure virtual machine (VM) running a supported operating system. For more information, see [Supported operating systems](#supported-operating-systems).

- Outbound TCP connectivity to `169.254.169.254` over `port 80` and `168.63.129.16` over `port 8037`. The agent uses these IP addresses to communicate with the Azure platform.

- Internet connectivity: Network Watcher Agent requires internet connectivity for some features to work properly. For example, it requires connectivity to your storage account to upload packet captures.

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

# [**Resource Manager**](#tab/arm)

- An Azure virtual machine (VM) running a supported operating system. For more information, see [Supported operating systems](#supported-operating-systems).

- Outbound TCP connectivity to `169.254.169.254` over `port 80` and `168.63.129.16` over `port 8037`. The agent uses these IP addresses to communicate with the Azure platform.

- Internet connectivity: Network Watcher Agent requires internet connectivity for some features to work properly. For example, it requires connectivity to your storage account to upload packet captures.

- Azure PowerShell or Azure CLI installed locally to deploy the template.

    - You can [install Azure PowerShell](/powershell/azure/install-azure-powershell) to run the cmdlets. Use [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet to sign in to Azure.

    - You can [install Azure CLI](/cli/azure/install-azure-cli) to run the commands. Use [az login](/cli/azure/reference-index#az-login) command to sign in to Azure.

---

## Supported operating systems

::: zone pivot="windows"

You can install the Network Watcher Agent extension for Windows on the following operating systems:

- Windows Server 2012, 2012 R2, 2016, 2019, 2022, and 2025 releases.
- Windows 10 and 11 releases.

> [!NOTE]
> Currently, Nano Server isn't supported.

::: zone-end

::: zone pivot="linux"

You can install the Network Watcher Agent extension for Linux on the following Linux distributions:

| Distribution | Version |
|---|---|
| AlmaLinux  | 9.2 |
| Azure Linux | 2.0 |
| CentOS <sup>1</sup> | 6.10 and 7 |
| Debian | 7 and 8 |
| openSUSE Leap | 42.3+ |
| Oracle Linux | 6.10 <sup>2</sup>, 7, 8, and 9+ |
| Red Hat Enterprise Linux (RHEL) | 6.10 <sup>3</sup>, 7, 8, and 9.2 |
| Rocky Linux | 9.1 |
| SUSE Linux Enterprise Server (SLES) | 12 and 15 (SP2, SP3, and SP4) |
| Ubuntu | 16+ |

<sup>1</sup> CentOS Linux reached its end of life (EOL) on June 30, 2024. For more information, see the [CentOS End Of Life guidance](/azure/virtual-machines/workloads/centos/centos-end-of-life).

<sup>2</sup> [Extended life cycle (ELS) support](https://www.oracle.com/a/ocom/docs/linux/oracle-linux-extended-support-ds.pdf) for Oracle Linux version 6.X ended on [July 1, 2024](https://www.oracle.com/a/ocom/docs/elsp-lifetime-069338.pdf).

<sup>3</sup> [Extended life cycle (ELS) support](https://www.redhat.com/en/resources/els-datasheet) for Red Hat Enterprise Linux 6.X ended on [June 30, 2024]( https://access.redhat.com/product-life-cycles/?product=Red%20Hat%20Enterprise%20Linux,OpenShift%20Container%20Platform%204).

> [!NOTE]
> Internet Control Message Protocol (ICMP) monitoring isn't currently supported in the Network Watcher Agent on Oracle Linux due to known kernel-level limitations specific to the distro.

::: zone-end

## Extension schema

The following JSON shows the schema for the Network Watcher Agent extension. The extension doesn't require or support any user-supplied settings, and it relies on its default configuration.

::: zone pivot="windows"

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

::: zone-end

::: zone pivot="linux"

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
        "type": "NetworkWatcherAgentLinux",
        "typeHandlerVersion": "1.4"
    }
}
```

::: zone-end

## List installed extensions

# [**Portal**](#tab/portal)

From the virtual machine page in the Azure portal, you can view the installed extensions by following these steps:

1. Under **Settings**, select **Extensions + applications**.

1. In the **Extensions** tab, you can see all installed extensions on the virtual machine. If the list is long, use the search box to filter the list.

    ::: zone pivot="windows"
    :::image type="content" source="./media/network-watcher-agent-manage/list-vm-extensions.png" alt-text="Screenshot that shows how to view installed extensions on a VM in the Azure portal." lightbox="./media/network-watcher-agent-manage/list-vm-extensions.png":::
    ::: zone-end
    ::: zone pivot="linux"
    :::image type="content" source="./media/network-watcher-agent-manage/list-vm-extensions.png" alt-text="Screenshot that shows how to view installed extensions on a VM in the Azure portal." lightbox="./media/network-watcher-agent-manage/list-vm-extensions.png":::
    ::: zone-end

# [**PowerShell**](#tab/powershell)

Use the [Get-AzVMExtension](/powershell/module/az.compute/get-azvmextension) cmdlet to list all installed extensions on the virtual machine.

```azurepowershell-interactive
# List the installed extensions on the virtual machine.
Get-AzVMExtension -ResourceGroupName 'myResourceGroup' -VMName 'myVM' | format-table Name, Publisher, ExtensionType, AutoUpgradeMinorVersion, EnableAutomaticUpgrade
```

The output of the cmdlet lists the installed extensions:

::: zone pivot="windows"

```output
Name                         Publisher                      ExtensionType              AutoUpgradeMinorVersion EnableAutomaticUpgrade
----                         ---------                      -------------              ----------------------- ----------------------
AzureNetworkWatcherExtension Microsoft.Azure.NetworkWatcher NetworkWatcherAgentWindows                    True                   True
```

::: zone-end

::: zone pivot="linux"

```output
Name                         Publisher                      ExtensionType            AutoUpgradeMinorVersion EnableAutomaticUpgrade
----                         ---------                      -------------            ----------------------- ----------------------
AzureNetworkWatcherExtension Microsoft.Azure.NetworkWatcher NetworkWatcherAgentLinux                    True                   True
```

::: zone-end

# [**Azure CLI**](#tab/cli)

Use the [az vm extension list](/cli/azure/vm/extension#az-vm-extension-list) command to list all installed extensions on the virtual machine.

```azurecli-interactive
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

1. Select **+ Add**, search for **Network Watcher Agent**, and install it. If the extension is already installed, you can see it in the list of extensions.

    :::image type="content" source="./media/network-watcher-agent-manage/vm-extensions.png" alt-text="Screenshot that shows the VM's extensions page in the Azure portal." lightbox="./media/network-watcher-agent-manage/vm-extensions.png":::

1. In the search box of **Install an Extension**, enter *Network Watcher Agent*, select the matching extension for your operating system from the list, and then select **Next**.

    ::: zone pivot="windows"
    :::image type="content" source="./media/network-watcher-agent-manage/install-extension-windows.png" alt-text="Screenshot that shows how to install Network Watcher Agent for Windows in the Azure portal." lightbox="./media/network-watcher-agent-manage/install-extension-windows.png":::
    ::: zone-end
    ::: zone pivot="linux"
    :::image type="content" source="./media/network-watcher-agent-manage/install-extension-linux.png" alt-text="Screenshot that shows how to install Network Watcher Agent for Linux in the Azure portal." lightbox="./media/network-watcher-agent-manage/install-extension-linux.png":::
    ::: zone-end

1. Select **Review + create** and then select **Create**.

# [**PowerShell**](#tab/powershell)

Use the [Set-AzVMExtension](/powershell/module/az.compute/set-azvmextension) cmdlet to install the Network Watcher Agent VM extension on the virtual machine:

::: zone pivot="windows"

```azurepowershell-interactive
# Install Network Watcher Agent for Windows on the virtual machine.
Set-AzVMExtension -Name 'AzureNetworkWatcherExtension' -Publisher 'Microsoft.Azure.NetworkWatcher' -ExtensionType 'NetworkWatcherAgentWindows' -EnableAutomaticUpgrade 1 -TypeHandlerVersion '1.4' -ResourceGroupName 'myResourceGroup' -VMName 'myVM' 
```

::: zone-end

::: zone pivot="linux"

```azurepowershell-interactive
# Install Network Watcher Agent for Linux on the virtual machine.
Set-AzVMExtension -Name 'AzureNetworkWatcherExtension' -Publisher 'Microsoft.Azure.NetworkWatcher' -ExtensionType 'NetworkWatcherAgentLinux' -EnableAutomaticUpgrade 1 -TypeHandlerVersion '1.4' -ResourceGroupName 'myResourceGroup' -VMName 'myVM' 
```

::: zone-end

When the installation finishes, you see the following output:

```output
RequestId IsSuccessStatusCode StatusCode ReasonPhrase
--------- ------------------- ---------- ------------
                         True         OK 
```

# [**Azure CLI**](#tab/cli)

Use the [az vm extension set](/cli/azure/vm/extension#az-vm-extension-set) command to install the Network Watcher Agent VM extension on the virtual machine: 

::: zone pivot="windows"

```azurecli-interactive
# Install Network Watcher Agent for Windows on the virtual machine.
az vm extension set --name 'NetworkWatcherAgentWindows' --extension-instance-name 'AzureNetworkWatcherExtension' --publisher 'Microsoft.Azure.NetworkWatcher' --enable-auto-upgrade 'true' --version '1.4' --resource-group 'myResourceGroup' --vm-name 'myVM'
```

::: zone-end

::: zone pivot="linux"

```azurecli-interactive
# Install Network Watcher Agent for Linux on the virtual machine.
az vm extension set --name 'NetworkWatcherAgentLinux' --extension-instance-name 'AzureNetworkWatcherExtension' --publisher 'Microsoft.Azure.NetworkWatcher' --enable-auto-upgrade 'true' --version '1.4' --resource-group 'myResourceGroup' --vm-name 'myVM'
```

::: zone-end

# [**Resource Manager**](#tab/arm)

Use the following Azure Resource Manager template (ARM template) to install the Network Watcher Agent VM extension on a virtual machine:

::: zone pivot="windows"

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
            "type": "string"
        }
    },
    "resources": [
        {
            "name": "[concat(parameters('vmName'), '/AzureNetworkWatcherExtension')]",
            "type": "Microsoft.Compute/virtualMachines/extensions",
            "apiVersion": "2024-07-01",
            "location": "[resourceGroup().location]",
            "properties": {
                "autoUpgradeMinorVersion": true,
                "publisher": "Microsoft.Azure.NetworkWatcher",
                "type": "NetworkWatcherAgentWindows",
                "typeHandlerVersion": "1.4"
            }
        }
    ]
}
```

::: zone-end

::: zone pivot="linux"

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
            "type": "string"
        }
    },
    "resources": [
        {
            "name": "[concat(parameters('vmName'), '/AzureNetworkWatcherExtension')]",
            "type": "Microsoft.Compute/virtualMachines/extensions",
            "apiVersion": "2024-07-01",
            "location": "[resourceGroup().location]",
            "properties": {
                "autoUpgradeMinorVersion": true,
                "publisher": "Microsoft.Azure.NetworkWatcher",
                "type": "NetworkWatcherAgentLinux",
                "typeHandlerVersion": "1.4"
            }
        }
    ]
}
```

::: zone-end

You can use either Azure PowerShell or Azure CLI to deploy the Resource Manager template:

```azurepowershell
# Deploy the JSON template file using Azure PowerShell.
New-AzResourceGroupDeployment -ResourceGroupName 'myResourceGroup' -TemplateFile 'agent.json'
```

```azurecli-interactive
# Deploy the JSON template file using the Azure CLI.
az deployment group create --resource-group 'myResourceGroup' --template-file 'agent.json'
```

---

## Update Network Watcher Agent VM extension

### Check your extension version

You can check your extension version by using the Azure portal, the Azure CLI, or PowerShell.

# [**Portal**](#tab/portal)

1. Go to **Extensions + applications** of your VM in the Azure portal.
1. In the extensions list, check the **Version** column for **AzureNetworkWatcherExtension**. If a newer version is available, the **Latest Version** column shows **(Update Available)**.

    :::image type="content" source="./media/network-watcher-agent-manage/extensions-list-update-available.png" alt-text="Screenshot that shows the Network Watcher extension." lightbox="./media/network-watcher-agent-manage/extensions-list-update-available.png":::

# [**PowerShell**](#tab/powershell)

Use the [Get-AzVM](/powershell/module/az.compute/get-azvm) cmdlet to check the extension's installed version:

```azurepowershell-interactive
(Get-AzVM -ResourceGroupName 'myResourceGroup' -Name 'myVM' -Status).Extensions | Where-Object { $_.Name -eq 'AzureNetworkWatcherExtension' } | Select-Object Name, TypeHandlerVersion
```

Use the [Get-AzVMExtensionImage](/powershell/module/az.compute/get-azvmextensionimage) cmdlet to find the latest available version of the extension for your VM's operating system and region:

::: zone pivot="windows"

```azurepowershell-interactive
Get-AzVMExtensionImage -Location '<region>' -PublisherName 'Microsoft.Azure.NetworkWatcher' -Type 'NetworkWatcherAgentWindows' | Sort-Object -Property { [Version]$_.Version } -Descending | Select-Object -First 1
```

::: zone-end

::: zone pivot="linux"

```azurepowershell-interactive
Get-AzVMExtensionImage -Location '<region>' -PublisherName 'Microsoft.Azure.NetworkWatcher' -Type 'NetworkWatcherAgentLinux' | Sort-Object -Property { [Version]$_.Version } -Descending | Select-Object -First 1
```

::: zone-end

# [**Azure CLI**](#tab/cli)

Use the [az vm get-instance-view](/cli/azure/vm#az-vm-get-instance-view) command to check the extension's installed version:

```azurecli-interactive
az vm get-instance-view --resource-group 'myResourceGroup' --name 'myVM' --query "extensions[?name=='AzureNetworkWatcherExtension'].typeHandlerVersion" --output tsv
```

Use the [az vm extension image list](/cli/azure/vm/extension/image#az-vm-extension-image-list) command to find the latest available version of the extension for your VM's operating system:

::: zone pivot="windows"

```azurecli-interactive
az vm extension image list --name 'NetworkWatcherAgentWindows' --publisher 'Microsoft.Azure.NetworkWatcher' --latest
```

::: zone-end

::: zone pivot="linux"

```azurecli-interactive
az vm extension image list --name 'NetworkWatcherAgentLinux' --publisher 'Microsoft.Azure.NetworkWatcher' --latest
```

::: zone-end

# [**Resource Manager**](#tab/arm)

N/A

---

> [!NOTE]
> [!INCLUDE [Network Watcher agent version](../../includes/network-watcher-agent-version.md)]

### Enable automatic upgrade

Automatic upgrade lets the Azure platform update the extension to the latest version without manual intervention. Use the following steps to check whether automatic upgrade is enabled, and to enable it if it's not.

# [**Portal**](#tab/portal)

1. Under **Settings** of your VM in the Azure portal, select **Extensions + applications**.
1. Select **AzureNetworkWatcherExtension** from the list of extensions, and check the **Automatic upgrade status** column.

1. If it shows **Disabled**, select **Enable automatic upgrade** from the toolbar.

    :::image type="content" source="./media/network-watcher-agent-manage/extensions-list-update-available.png" alt-text="Screenshot that shows the Network Watcher extension." lightbox="./media/network-watcher-agent-manage/extensions-list-update-available.png":::

1. Select **Yes** to confirm.

    :::image type="content" source="./media/network-watcher-agent-manage/enable-automatic-upgrade-confirm.png" alt-text="Screenshot that shows the confirmation dialog for enabling automatic upgrade on the Network Watcher extension." lightbox="./media/network-watcher-agent-manage/enable-automatic-upgrade-confirm.png":::

# [**PowerShell**](#tab/powershell)

Use [Get-AzVMExtension](/powershell/module/az.compute/get-azvmextension) cmdlet to check whether automatic upgrade is enabled:

```azurepowershell-interactive
Get-AzVMExtension -ResourceGroupName 'myResourceGroup' -VMName 'myVM' -Name 'AzureNetworkWatcherExtension' | Select-Object Name, EnableAutomaticUpgrade
```

If `EnableAutomaticUpgrade` is `False`, use [Set-AzVMExtension](/powershell/module/az.compute/set-azvmextension) cmdlet to enable it:

::: zone pivot="windows"

```azurepowershell-interactive
Set-AzVMExtension -ResourceGroupName 'myResourceGroup' -VMName 'myVM' -Name 'AzureNetworkWatcherExtension' -Publisher 'Microsoft.Azure.NetworkWatcher' -ExtensionType 'NetworkWatcherAgentWindows' -EnableAutomaticUpgrade $true
```

::: zone-end

::: zone pivot="linux"

```azurepowershell-interactive
Set-AzVMExtension -ResourceGroupName 'myResourceGroup' -VMName 'myVM' -Name 'AzureNetworkWatcherExtension' -Publisher 'Microsoft.Azure.NetworkWatcher' -ExtensionType 'NetworkWatcherAgentLinux' -EnableAutomaticUpgrade $true
```

::: zone-end

# [**Azure CLI**](#tab/cli)

Use the [az vm extension show](/cli/azure/vm/extension#az-vm-extension-show) command to check whether automatic upgrade is enabled:

```azurecli-interactive
az vm extension show --resource-group 'myResourceGroup' --vm-name 'myVM' --name 'AzureNetworkWatcherExtension' --query 'enableAutomaticUpgrade'
```

If the command returns `false`, use the [az vm extension set](/cli/azure/vm/extension#az-vm-extension-set) command to enable it:

::: zone pivot="windows"

```azurecli-interactive
az vm extension set --resource-group 'myResourceGroup' --vm-name 'myVM' --name 'NetworkWatcherAgentWindows' --publisher 'Microsoft.Azure.NetworkWatcher' --enable-auto-upgrade 'true'
```

::: zone-end

::: zone pivot="linux"

```azurecli-interactive
az vm extension set --resource-group 'myResourceGroup' --vm-name 'myVM' --name 'NetworkWatcherAgentLinux' --publisher 'Microsoft.Azure.NetworkWatcher' --enable-auto-upgrade 'true'
```

::: zone-end

# [**Resource Manager**](#tab/arm)

Use the following Azure Resource Manager template (ARM template) to enable automatic upgrade on the Network Watcher Agent VM extension:

::: zone pivot="windows"

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
            "type": "string"
        }
    },
    "resources": [
        {
            "name": "[concat(parameters('vmName'), '/AzureNetworkWatcherExtension')]",
            "type": "Microsoft.Compute/virtualMachines/extensions",
            "apiVersion": "2024-07-01",
            "location": "[resourceGroup().location]",
            "properties": {
                "autoUpgradeMinorVersion": true,
                "enableAutomaticUpgrade": true,
                "publisher": "Microsoft.Azure.NetworkWatcher",
                "type": "NetworkWatcherAgentWindows",
                "typeHandlerVersion": "1.4"
            }
        }
    ]
}
```

::: zone-end

::: zone pivot="linux"

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
            "type": "string"
        }
    },
    "resources": [
        {
            "name": "[concat(parameters('vmName'), '/AzureNetworkWatcherExtension')]",
            "type": "Microsoft.Compute/virtualMachines/extensions",
            "apiVersion": "2024-07-01",
            "location": "[resourceGroup().location]",
            "properties": {
                "autoUpgradeMinorVersion": true,
                "enableAutomaticUpgrade": true,
                "publisher": "Microsoft.Azure.NetworkWatcher",
                "type": "NetworkWatcherAgentLinux",
                "typeHandlerVersion": "1.4"
            }
        }
    ]
}
```

::: zone-end

You can use either Azure PowerShell or Azure CLI to deploy the Resource Manager template:

```azurepowershell
# Deploy the JSON template file using Azure PowerShell.
New-AzResourceGroupDeployment -ResourceGroupName 'myResourceGroup' -TemplateFile 'agent.json'
```

```azurecli-interactive
# Deploy the JSON template file using the Azure CLI.
az deployment group create --resource-group 'myResourceGroup' --template-file 'agent.json'
```

---

> [!NOTE]
> After you enable automatic upgrade, Azure updates the extension automatically without requiring a restart of the virtual machine. This process can take up to 30 days after a new version is released.

### Update manually

# [**Portal**](#tab/portal)

1. Under **Settings** of your VM in the Azure portal, select **Extensions + applications**.
1. Select **AzureNetworkWatcherExtension** from the list of extensions, and then select **Update** from the toolbar.

    :::image type="content" source="./media/network-watcher-agent-manage/extensions-list-update-available.png" alt-text="Screenshot that shows the Network Watcher extension." lightbox="./media/network-watcher-agent-manage/extensions-list-update-available.png":::

1. Select **Yes** to confirm.

    :::image type="content" source="./media/network-watcher-agent-manage/update-extension-confirm.png" alt-text="Screenshot that shows the confirmation dialog for updating the Network Watcher extension to the latest version." lightbox="./media/network-watcher-agent-manage/update-extension-confirm.png":::

1. When the update finishes, the **Version** and **Latest Version** columns show the same version number.

    :::image type="content" source="./media/network-watcher-agent-manage/extensions-list-updated.png" alt-text="Screenshot that shows the Network Watcher extension after it's updated to the latest version." lightbox="./media/network-watcher-agent-manage/extensions-list-updated.png":::

If updating doesn't apply the latest version, remove the extension and install it again:

1. Select **AzureNetworkWatcherExtension** from the list of extensions, and then select **Uninstall**.
1. Select **+ Add**, search for **Network Watcher Agent**, and install it again. The platform automatically installs the latest available version. For more information, see [Install Network Watcher Agent VM extension](#install-network-watcher-agent-vm-extension).

# [**PowerShell**](#tab/powershell)

Use the [Set-AzVMExtension](/powershell/module/az.compute/set-azvmextension) cmdlet with the `-ForceRerun` parameter to reapply the extension without uninstalling it. The `-ForceRerun` value must be different from its current value each time you run the command, so use a value that changes, such as the current date and time:

::: zone pivot="windows"

```azurepowershell-interactive
Set-AzVMExtension -ResourceGroupName 'myResourceGroup' -VMName 'myVM' -Name 'AzureNetworkWatcherExtension' -Publisher 'Microsoft.Azure.NetworkWatcher' -Type 'NetworkWatcherAgentWindows' -ForceRerun (Get-Date -Format o)
```

::: zone-end

::: zone pivot="linux"

```azurepowershell-interactive
Set-AzVMExtension -ResourceGroupName 'myResourceGroup' -VMName 'myVM' -Name 'AzureNetworkWatcherExtension' -Publisher 'Microsoft.Azure.NetworkWatcher' -Type 'NetworkWatcherAgentLinux' -ForceRerun (Get-Date -Format o)
```

::: zone-end

If that condition doesn't update the extension, remove it and install it again to get the latest version:

```azurepowershell-interactive
Remove-AzVMExtension -ResourceGroupName 'myResourceGroup' -VMName 'myVM' -Name 'AzureNetworkWatcherExtension'
```

::: zone pivot="windows"

```azurepowershell-interactive
Set-AzVMExtension -ResourceGroupName 'myResourceGroup' -VMName 'myVM' -Name 'AzureNetworkWatcherExtension' -Publisher 'Microsoft.Azure.NetworkWatcher' -Type 'NetworkWatcherAgentWindows'
```

::: zone-end

::: zone pivot="linux"

```azurepowershell-interactive
Set-AzVMExtension -ResourceGroupName 'myResourceGroup' -VMName 'myVM' -Name 'AzureNetworkWatcherExtension' -Publisher 'Microsoft.Azure.NetworkWatcher' -Type 'NetworkWatcherAgentLinux'
```

::: zone-end

# [**Azure CLI**](#tab/cli)

Use the [az vm extension set](/cli/azure/vm/extension#az-vm-extension-set) command with the `--force-update` parameter to reapply the extension without uninstalling it:

::: zone pivot="windows"

```azurecli-interactive
az vm extension set --resource-group 'myResourceGroup' --vm-name 'myVM' --name 'NetworkWatcherAgentWindows' --publisher 'Microsoft.Azure.NetworkWatcher' --force-update
```

::: zone-end

::: zone pivot="linux"

```azurecli-interactive
az vm extension set --resource-group 'myResourceGroup' --vm-name 'myVM' --name 'NetworkWatcherAgentLinux' --publisher 'Microsoft.Azure.NetworkWatcher' --force-update
```

::: zone-end

If that condition doesn't update the extension, remove it and install it again to get the latest version:

```azurecli-interactive
az vm extension delete --resource-group 'myResourceGroup' --vm-name 'myVM' --name 'AzureNetworkWatcherExtension'
```

::: zone pivot="windows"

```azurecli-interactive
az vm extension set --resource-group 'myResourceGroup' --vm-name 'myVM' --name 'NetworkWatcherAgentWindows' --publisher 'Microsoft.Azure.NetworkWatcher'
```

::: zone-end

::: zone pivot="linux"

```azurecli-interactive
az vm extension set --resource-group 'myResourceGroup' --vm-name 'myVM' --name 'NetworkWatcherAgentLinux' --publisher 'Microsoft.Azure.NetworkWatcher'
```

::: zone-end

# [**Resource Manager**](#tab/arm)

Use the following Azure Resource Manager template (ARM template) to reapply the extension. Update the `typeHandlerVersion` parameter to the latest version you identified in [Check your extension version](#check-your-extension-version), and redeploy the template:

::: zone pivot="windows"

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
            "type": "string"
        },
        "typeHandlerVersion": {
            "type": "string"
        }
    },
    "resources": [
        {
            "name": "[concat(parameters('vmName'), '/AzureNetworkWatcherExtension')]",
            "type": "Microsoft.Compute/virtualMachines/extensions",
            "apiVersion": "2024-07-01",
            "location": "[resourceGroup().location]",
            "properties": {
                "autoUpgradeMinorVersion": true,
                "publisher": "Microsoft.Azure.NetworkWatcher",
                "type": "NetworkWatcherAgentWindows",
                "typeHandlerVersion": "[parameters('typeHandlerVersion')]"
            }
        }
    ]
}
```

::: zone-end

::: zone pivot="linux"

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
            "type": "string"
        },
        "typeHandlerVersion": {
            "type": "string"
        }
    },
    "resources": [
        {
            "name": "[concat(parameters('vmName'), '/AzureNetworkWatcherExtension')]",
            "type": "Microsoft.Compute/virtualMachines/extensions",
            "apiVersion": "2024-07-01",
            "location": "[resourceGroup().location]",
            "properties": {
                "autoUpgradeMinorVersion": true,
                "publisher": "Microsoft.Azure.NetworkWatcher",
                "type": "NetworkWatcherAgentLinux",
                "typeHandlerVersion": "[parameters('typeHandlerVersion')]"
            }
        }
    ]
}
```

::: zone-end

You can use either Azure PowerShell or Azure CLI to deploy the Resource Manager template:

```azurepowershell
# Deploy the JSON template file using Azure PowerShell.
New-AzResourceGroupDeployment -ResourceGroupName 'myResourceGroup' -TemplateFile 'agent.json' -typeHandlerVersion '<version>'
```

```azurecli-interactive
# Deploy the JSON template file using the Azure CLI.
az deployment group create --resource-group 'myResourceGroup' --template-file 'agent.json' --parameters typeHandlerVersion='<version>'
```

---

### Update at scale with a PowerShell script

If you have large deployments, use a PowerShell script to update multiple VMs in a subscription at once. The following script updates the Network Watcher extension on all out-of-date VMs in a subscription:

```powershell
<#
    .SYNOPSIS
    This script scans all VMs in the provided subscription and upgrades any out-of-date AzureNetworkWatcherExtensions to the latest available version.
    .DESCRIPTION
    This script is a no-op if AzureNetworkWatcherExtensions are already up to date.
    Requires Azure PowerShell 4.2 or higher to be installed.
    .EXAMPLE
    .\UpdateVMAgentsInSub.ps1 -SubID aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e -NoUpdate
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)]
    [string] $SubID,
    [Parameter(Mandatory=$false)]
    [Switch] $NoUpdate = $false
)
function Get-LatestExtensionVersion($location, $extensionType)
{
    $latestImage = Get-AzVMExtensionImage -Location $location -PublisherName "Microsoft.Azure.NetworkWatcher" -Type $extensionType |
        Sort-Object -Property { [Version]$_.Version } -Descending |
        Select-Object -First 1
    return $latestImage.Version
}
Write-Host "Scanning all VMs in the subscription: $($SubID)"
Set-AzContext -SubscriptionId $SubID
$vms = Get-AzVM
$foundVMs = $false
Write-Host "Starting VM search, this may take a while"
foreach ($vmName in $vms)
{
    # Get Detailed VM info
    $vm = Get-AzVM -ResourceGroupName $vmName.ResourceGroupName -Name $vmName.name -Status
    $isitWindows = $vm.OsName -like "*Windows*"
    $type = if ($isitWindows) { "NetworkWatcherAgentWindows" } else { "NetworkWatcherAgentLinux" }
    $latestVersion = Get-LatestExtensionVersion -location $vmName.Location -extensionType $type

    foreach ($extension in $vm.Extensions)
    {
        if ($extension.Name -eq "AzureNetworkWatcherExtension")
        {
            if ([Version]$extension.TypeHandlerVersion -lt [Version]$latestVersion)
            {
                $foundVMs = $true
                if (-not ($NoUpdate))
                {
                    Write-Host "Found VM that needs to be updated: subscriptions/$($SubID)/resourceGroups/$($vm.ResourceGroupName)/providers/Microsoft.Compute/virtualMachines/$($vm.Name) -> Updating to $latestVersion " -NoNewline
                    Remove-AzVMExtension -ResourceGroupName $vm.ResourceGroupName -VMName $vm.Name -Name "AzureNetworkWatcherExtension" -Force
                    Write-Host "... " -NoNewline
                    Set-AzVMExtension -ResourceGroupName $vm.ResourceGroupName -Location $vmName.Location -VMName $vm.Name -Name "AzureNetworkWatcherExtension" -Publisher "Microsoft.Azure.NetworkWatcher" -Type $type -TypeHandlerVersion $latestVersion
                    Write-Host "Done"
                }
                else
                {
                    Write-Host "Found $(if ($isitWindows) {"Windows"} else {"Linux"}) VM that needs to be updated to $($latestVersion): subscriptions/$($SubID)/resourceGroups/$($vm.ResourceGroupName)/providers/Microsoft.Compute/virtualMachines/$($vm.Name)"
                }
            }
        }
    }
}

if ($foundVMs)
{
    Write-Host "Finished $(if ($NoUpdate) {"searching"} else {"updating"}) out of date AzureNetworkWatcherExtension on VMs"
}
else
{
    Write-Host "All AzureNetworkWatcherExtensions up to date"
}

```

## Uninstall Network Watcher Agent VM extension

# [**Portal**](#tab/portal)

From the virtual machine page in the Azure portal, you can uninstall the Network Watcher Agent VM extension by following these steps:

1. Under **Settings**, select **Extensions + applications**.

1. Select **AzureNetworkWatcherExtension** from the list of extensions, and then select **Uninstall**.

    ::: zone pivot="windows"
    :::image type="content" source="./media/network-watcher-agent-manage/uninstall-extension-windows.png" alt-text="Screenshot that shows how to uninstall Network Watcher Agent for Windows in the Azure portal." lightbox="./media/network-watcher-agent-manage/uninstall-extension-windows.png":::
    ::: zone-end
    ::: zone pivot="linux"
    :::image type="content" source="./media/network-watcher-agent-manage/uninstall-extension-linux.png" alt-text="Screenshot that shows how to uninstall Network Watcher Agent for Linux in the Azure portal." lightbox="./media/network-watcher-agent-manage/uninstall-extension-linux.png":::
    ::: zone-end

    > [!NOTE]
    > You might see Network Watcher Agent VM extension named differently than **AzureNetworkWatcherExtension**.

# [**PowerShell**](#tab/powershell)

Use the [Remove-AzVMExtension](/powershell/module/az.compute/remove-azvmextension) cmdlet to remove the Network Watcher Agent VM extension from the virtual machine:

```azurepowershell-interactive
# Uninstall Network Watcher Agent VM extension.
Remove-AzVMExtension -Name 'AzureNetworkWatcherExtension' -ResourceGroupName 'myResourceGroup' -VMName 'myVM'
```

# [**Azure CLI**](#tab/cli)

Use the [az vm extension delete](/cli/azure/vm/extension#az-vm-extension-delete) command to remove the Network Watcher Agent VM extension from the virtual machine:

```azurecli-interactive
# Uninstall Network Watcher Agent VM extension.
az vm extension delete --name 'AzureNetworkWatcherExtension' --resource-group 'myResourceGroup' --vm-name 'myVM'
```

# [**Resource Manager**](#tab/arm)

N/A

---

## Frequently asked questions (FAQ)

To get answers to the most frequently asked questions about Network Watcher Agent, see [Network Watcher Agent FAQ](frequently-asked-questions.yml#network-watcher-agent).

## Related content

- [Enable or disable Azure Network Watcher](network-watcher-create.md)
- [Microsoft Q&A - Network Watcher](/answers/topics/azure-network-watcher.html)
