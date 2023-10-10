---
title: Enable Trusted Launch on existing VMs
description: Enable Trusted Launch on existing Azure VMs.
author: AjKundnani
ms.author: ajkundna
ms.reviewer: cynthn
ms.service: virtual-machines
ms.subservice: trusted-launch
ms.topic: how-to
ms.date: 08/13/2023
ms.custom: template-how-to, devx-track-azurepowershell
---

# Enable Trusted Launch on existing Azure VMs

**Applies to:** :heavy_check_mark: Linux VM :heavy_check_mark: Windows VM :heavy_check_mark: Generation 2 VM

Azure Virtual Machines supports enabling Trusted Launch on existing [Azure Generation 2](generation-2.md) VMs by upgrading to [Trusted launch](trusted-launch.md) security type.

[Trusted launch](trusted-launch.md) is a way to enable foundational compute security on [Azure Generation 2 VMs](generation-2.md). Trusted launch protects your Virtual Machines against advanced and persistent attack techniques like boot kits and rootkits by combining infrastructure technologies like Secure Boot, vTPM and Boot Integrity Monitoring on your VM.

> [!IMPORTANT]
> Enabling Trusted Launch on existing virtual machines (VMs) is currently not supported for following scenarios:
>
> - Azure Generation 1 VMs is currently not supported.
> - Azure Virtual Machine Scale Sets (VMSS) Uniform & Flex is currently not supported.

## Prerequisites

- Azure Generation 2 VM(s) is configured with:
  - [Trusted Launch supported size family](trusted-launch.md#virtual-machines-sizes)
  - [Trusted Launch supported OS Image](trusted-launch.md#operating-systems-supported). For custom OS image or disks, the base image should be **Trusted Launch capable**.
- Azure Generation 2 VM(s) is not using [features currently not supported with Trusted Launch](trusted-launch.md#unsupported-features).
- Azure Generation 2 VM(s) should be **stopped and deallocated** before enabling Trusted Launch security type.
- Azure Backup if enabled for Generation 2 VM(s) should be configured with [Enhanced Backup Policy](../backup/backup-azure-vms-enhanced-policy.md). Trusted Launch security type cannot be enabled for Generation 2 VM(s) configured with *Standard Policy* backup protection.

## Best practices

- [Create restore point](create-restore-points.md) for Azure Generation 2 VM(s) before enabling Trusted Launch security type. You can use the Restore Point to re-create the disks and Generation 2 VM with the previous well-known state.
- Enable Trusted launch on a test Generation 2 VM and ensure if any changes are required to meet the prerequisites before enabling Trusted Launch on Generation 2 VMs running production workloads.

## Enable Trusted Launch on existing VM

### [CLI](#tab/cli)

This section steps through using the Azure CLI to enable Trusted Launch on existing Azure Generation 2 VM.

Make sure that you've installed the latest [Azure CLI](/cli/azure/install-az-cli2) and are logged in to an Azure account with [az login](/cli/azure/reference-index).

1. Log in to Azure Subscription

```azurecli-interactive
az login

az account set --subscription 00000000-0000-0000-0000-000000000000
```

2. **Deallocate** VM

```azurecli-interactive
az vm deallocate \
    --resource-group myResourceGroup --name myVm
```

3. Enable Trusted Launch by setting `--security-type` to `TrustedLaunch`.

> [!NOTE]
>
> - After enabling Trusted Launch, currently virtual machine cannot be rolled back to security type **Standard** (Non-Trusted Launch configuration).
> - **vTPM** is enabled by default.
> - **Secure Boot** is recommended to be enabled (not enabled by default) if you are not using custom unsigned kernel or drivers. Secure Boot preserves boot integrity and enables foundational security for VM.

```azurecli-interactive
az vm update \
    --resource-group myResourceGroup --name myVm \
    --security-type TrustedLaunch \
    --enable-secure-boot true --enable-vtpm true
```

4. **Validate** output of previous command. `securityProfile` configuration is returned with command output.

```json
{
  "securityProfile": {
    "securityType": "TrustedLaunch",
    "uefiSettings": {
      "secureBootEnabled": true,
      "vTpmEnabled": true
    }
  }
}
```

5. **Start** the VM.

```azurecli-interactive
az vm start \
    --resource-group myResourceGroup --name myVm
```

6. Start the upgraded Trusted Launch VM and ensure that it has started successfully and verify that you are able to log in to the VM using either RDP (for Windows VM) or SSH (for Linux VM).

### [PowerShell](#tab/powershell)

This section steps through using the Azure PowerShell to enable Trusted Launch on existing Azure Generation 2 VM.

Make sure that you've installed the latest [Azure PowerShell](/powershell/azure/install-azps-windows) and are logged in to an Azure account with [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount).

1. Log in to Azure Subscription

```azurepowershell-interactive
Connect-AzAccount -SubscriptionId 00000000-0000-0000-0000-000000000000
```

2. **Deallocate** VM

```azurepowershell-interactive
Stop-AzVM -ResourceGroupName myResourceGroup -Name myVm
```

3. Enable Trusted Launch by setting `--security-type` to `TrustedLaunch`. 

> [!NOTE]
>
> - After enabling Trusted Launch, currently virtual machine cannot be rolled back to security type **Standard** (Non-Trusted Launch configuration).
> - **vTPM** is enabled by default.
> - **Secure Boot** is recommended to be enabled (not enabled by default) if you are not using custom unsigned kernel or drivers. Secure Boot preserves boot integrity and enables foundational security for VM.

```azurepowershell-interactive
Get-AzVM -ResourceGroupName myResourceGroup -VMName myVm `
    | Update-AzVM -SecurityType TrustedLaunch `
        -EnableSecureBoot $true -EnableVtpm $true
```

4. **Validate** `securityProfile` in updated VM configuration.

```azurepowershell-interactive
# Following command output should be `TrustedLaunch`

(Get-AzVM -ResourceGroupName myResourceGroup -VMName myVm `
    | Select-Object -Property SecurityProfile `
        -ExpandProperty SecurityProfile).SecurityProfile.SecurityType

# Following command output should return `SecureBoot` and `vTPM` settings
(Get-AzVM -ResourceGroupName myResourceGroup -VMName myVm `
    | Select-Object -Property SecurityProfile `
        -ExpandProperty SecurityProfile).SecurityProfile.Uefisettings

```

5. **Start** the VM.

```azurepowershell-interactive
Start-AzVM -ResourceGroupName myResourceGroup -Name myVm
```

6. Start the upgraded Trusted Launch VM and ensure that it has started successfully and verify that you are able to log in to the VM using either RDP (for Windows VM) or SSH (for Linux VM).

### [Template](#tab/template)

This section steps through using an ARM template to enable Trusted Launch on existing Azure Generation 2 VM.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

1. Review the template.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmsToMigrate": {
            "type": "object",
            "metadata": {
                "description": "Specifies the list of Gen2 virtual machines to be migrated to Trusted Launch."
            }
        },
        "vTpmEnabled": {
            "type": "bool",
            "defaultValue": true,
            "metadata": {
                "description": "Specifies whether vTPM should be enabled on the virtual machine."
            }
        }
    },
    "resources": [
        {
            "type": "Microsoft.Compute/virtualMachines",
            "apiVersion": "2022-11-01",
            "name": "[parameters('vmsToMigrate').virtualMachines[copyIndex()].vmName]",
            "location": "[parameters('vmsToMigrate').virtualMachines[copyIndex()].location]",
            "properties": {
                "securityProfile": {
                    "uefiSettings": {
                        "secureBootEnabled": "[parameters('vmsToMigrate').virtualMachines[copyIndex()].secureBootEnabled]",
                        "vTpmEnabled": "[parameters('vTpmEnabled')]"
                    },
                    "securityType": "TrustedLaunch"
                }
            },
            "copy": {
                "name": "vmCopy",
                "count": "[length(parameters('vmsToMigrate').virtualMachines)]"
            }
        }
    ]
}
```

2. Edit the **parameters** json file with virtual machines to be updated with `TrustedLaunch` security type.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmsToMigrate": {
            "value": {
                "virtualMachines": [
                    {
                        "vmName": "myVm01",
                        "location": "westus3",
						            "secureBootEnabled": true
                    },
                    {
                        "vmName": "myVm02",
                        "location": "westus3",
						            "secureBootEnabled": true
                    }
                ]
            }
        }
    }
}
```

**Parameter file definition**

Property    |    Description of Property    |    Example template value
-|-|-
vmName    |    Name of Azure Generation 2 VM    |    "myVm"
location    |    Location of Azure Generation 2 VM    |    "westus3"
secureBootEnabled    |    Enable secure boot with Trusted Launch security type    |    true

> [!NOTE]
>
> - After enabling Trusted Launch, currently virtual machine cannot be rolled back to security type **Standard** (Non-Trusted Launch configuration).
> - **vTPM** is enabled by default.
> - **Secure Boot** is recommended to be enabled (not enabled by default) if you are not using custom unsigned kernel or drivers. Secure Boot preserves boot integrity and enables foundational security for VM.

3. **Deallocate** all Azure Generation 2 VM(s) to be updated.

```azurepowershell-interactive
Stop-AzVM -ResourceGroupName myResourceGroup -Name myVm01
```

4. Execute the ARM template deployment.

```azurepowershell-interactive
$resourceGroupName = "myResourceGroup"
$parameterFile = "folderPathToFile\parameters.json"
$templateFile = "folderPathToFile\template.json"

New-AzResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -TemplateFile $templateFile -TemplateParameterFile $parameterFile
```

5. Verify that the deployment is successful. Check for the security type and UEFI settings of the VM using Azure portal. Check the Security type section in the Overview page.

:::image type="content" source="./media/trusted-launch/generation-2-trusted-launch-settings.png" alt-text="Screenshot of the Trusted Launch properties of the VM.":::

6. Start the upgraded Trusted Launch VM and ensure that it has started successfully and verify that you are able to log in to the VM using either RDP (for Windows VM) or SSH (for Linux VM).

---

## Next steps

**(Recommended)** Post-Upgrades enable [Boot Integrity Monitoring](trusted-launch.md#microsoft-defender-for-cloud-integration) to monitor the health of the VM using Microsoft Defender for Cloud.

Learn more about [trusted launch](trusted-launch.md) and review [frequently asked questions](trusted-launch-faq.md)
