---
title: Enable trusted launch on existing VMs
description: Learn how to enable trusted launch on existing Azure virtual machines (VMs).
author: AjKundnani
ms.author: ajkundna
ms.reviewer: cynthn
ms.service: virtual-machines
ms.subservice: trusted-launch
ms.topic: how-to
ms.date: 08/13/2023
ms.custom: template-how-to, devx-track-azurepowershell
---

# Enable trusted launch on existing Azure VMs

**Applies to:** :heavy_check_mark: Linux VM :heavy_check_mark: Windows VM :heavy_check_mark: Generation 2 VM

Azure Virtual Machines supports enabling trusted launch on existing [Azure Generation 2](generation-2.md) virtual machines (VMs) by upgrading to the [trusted launch](trusted-launch.md) security type.

[Trusted launch](trusted-launch.md) is a way to enable foundational compute security on [Azure Generation 2 VMs](generation-2.md). Trusted launch protects your VMs against advanced and persistent attack techniques like boot kits and rootkits by combining infrastructure technologies like Secure Boot, virtual Trusted Platform Module (vTPM), and boot integrity monitoring on your VM.

> [!IMPORTANT]
>
> - Support for *enabling trusted launch on existing Azure Generation 1 VMs* is currently in private preview. You can gain access to the preview by using the [registration form](https://aka.ms/Gen1ToTLUpgrade).
> - Enabling trusted launch on the existing Azure Virtual Machine Scale Sets (VMSS) Uniform and Flexible orchestrations is currently not supported.

## Prerequisites

- Azure Generation 2 VMs are configured with:
  - [Trusted launch supported size family](trusted-launch.md#virtual-machines-sizes).
  - [Trusted launch supported operating system (OS) image](trusted-launch.md#operating-systems-supported). For custom OS images or disks, the base image should be *trusted launch capable*.
- Azure Generation 2 VMs aren't using [features that are currently not supported with trusted launch](trusted-launch.md#unsupported-features).
- Azure Generation 2 VMs should be *stopped and deallocated* before you enable the trusted launch security type.
- Azure Backup, if enabled for VMs, should be configured with the [Enhanced backup policy](../backup/backup-azure-vms-enhanced-policy.md). The trusted launch security type can't be enabled for Generation 2 VMs configured with *Standard policy* backup protection.
  - Existing Azure VM backup can be migrated from the *Standard* policy to the *Enhanced* policy. Follow the steps in [Migrate Azure VM backups from Standard to Enhanced policy (preview)](../backup/backup-azure-vm-migrate-enhanced-policy.md).

## Best practices

- Enable trusted launch on a test Generation 2 VM. Determine if any changes are required to meet the prerequisites before you enable trusted launch on Generation 2 VMs associated with production workloads.
- [Create restore point](create-restore-points.md) for Azure Generation 2 VMs associated with production workloads before you enable the trusted launch security type. You can use the restore point to re-create the disks and the Generation 2 VM with the previous well-known state.

## Enable trusted launch on an existing VM

> [!NOTE]
>
> - After you enable trusted launch, currently VMs can't be rolled back to the Standard security type (non-trusted launch configuration).
> - vTPM is enabled by default.
> - We recommend that you enable Secure Boot, if you aren't using custom unsigned kernel or drivers. It's not enabled by default. Secure Boot preserves boot integrity and enables foundational security for VMs.

### [Portal](#tab/portal)

Follow the steps to use the Azure portal to enable trusted launch on an existing Azure Generation 2 VM.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Confirm that the VM generation is **V2** and select **Yes** to stop the VM.

   :::image type="content" source="./media/trusted-launch/02-generation-2-to-trusted-launch-stop-vm.png" alt-text="Screenshot that shows the Generation 2 VM to be deallocated.":::

1. On the **Overview** page in the VM properties, under **Security type**, select **Standard**. The **Configuration** page for the VM opens.

   :::image type="content" source="./media/trusted-launch/03-generation-2-to-trusted-launch-click-standard.png" alt-text="Screenshot that shows the security type as Standard.":::

1. On the **Configuration** page, under the **Security type** section, select the **Security type** dropdown list.

   :::image type="content" source="./media/trusted-launch/04-generation-2-to-trusted-launch-select-dropdown.png" alt-text="Screenshot that shows the Security type dropdown list.":::

1. Under the dropdown list, select **Trusted launch**. Select checkboxes to enable **Secure Boot** and **vTPM**. After you make the changes, select **Save**.

    > [!NOTE]
    > - Generation 2 VMs created by using [Azure Compute Gallery (ACG)](azure-compute-gallery.md), [Managed Image](capture-image-resource.yml), or an [OS disk](./scripts/create-vm-from-managed-os-disks.md) can't be upgraded to trusted launch by using the portal. Ensure that the [OS version is supported for trusted launch](trusted-launch.md#operating-systems-supported). Use PowerShell, the Azure CLI, or an Azure Resource Manager template (ARM template) to run the upgrade.
    
    :::image type="content" source="./media/trusted-launch/05-generation-2-to-trusted-launch-select-uefi-settings.png" alt-text="Screenshot that shows the Secure Boot and vTPM settings.":::
    
1. After the update finishes successfully, close the **Configuration** page. On the **Overview** page in the VM properties, confirm the **Security type** settings.

   :::image type="content" source="./media/trusted-launch/06-generation-2-to-trusted-launch-validate-uefi.png" alt-text="Screenshot that shows the upgraded trusted launch VM.":::

1. Start the upgraded trusted launch VM and ensure that it started successfully. Verify that you can sign in to the VM by using either the Remote Desktop Protocol (RDP) for Windows VMs or Secure Shell (SSH) for Linux VMs.

### [CLI](#tab/cli)

Follow the steps to use the Azure CLI to enable trusted launch on an existing Azure Generation 2 VM.

Make sure that you install the latest [Azure CLI](/cli/azure/install-az-cli2) and are signed in to an Azure account with [az login](/cli/azure/reference-index).

1. Sign in to an Azure subscription.
    
    ```azurecli-interactive
    az login
    
    az account set --subscription 00000000-0000-0000-0000-000000000000
    ```

1. Deallocate the VM.

    ```azurecli-interactive
    az vm deallocate \
        --resource-group myResourceGroup --name myVm
    ```

1. Enable trusted launch by setting `--security-type` to `TrustedLaunch`.

    ```azurecli-interactive
    az vm update \
        --resource-group myResourceGroup --name myVm \
        --security-type TrustedLaunch \
        --enable-secure-boot true --enable-vtpm true
    ```

1. Validate the output of the previous command. Ensure that the `securityProfile` configuration is returned with the command output.

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

1. Start the VM.

    ```azurecli-interactive
    az vm start \
        --resource-group myResourceGroup --name myVm
    ```

1. Start the upgraded trusted launch VM and ensure that it starts successfully. Verify that you can sign in to the VM by using either RDP for Windows VMs or SSH for Linux VMs.

### [PowerShell](#tab/powershell)

Follow the steps to use Azure PowerShell to enable trusted launch on an existing Azure Generation 2 VM.

Make sure that you install the latest [Azure PowerShell](/powershell/azure/install-azps-windows) and are signed in to an Azure account with [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount).

1. Sign in to an Azure subscription.

    ```azurepowershell-interactive
    Connect-AzAccount -SubscriptionId 00000000-0000-0000-0000-000000000000
    ```

1. Deallocate the VM.

    ```azurepowershell-interactive
    Stop-AzVM -ResourceGroupName myResourceGroup -Name myVm
    ```

1. Enable trusted launch by setting `--security-type` to `TrustedLaunch`.

    ```azurepowershell-interactive
    Get-AzVM -ResourceGroupName myResourceGroup -VMName myVm `
        | Update-AzVM -SecurityType TrustedLaunch `
            -EnableSecureBoot $true -EnableVtpm $true
    ```

1. Validate `securityProfile` in an updated VM configuration.

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

1. Start the VM.

    ```azurepowershell-interactive
    Start-AzVM -ResourceGroupName myResourceGroup -Name myVm
    ```

1. Start the upgraded trusted launch VM and ensure that it starts successfully. Verify that you can sign in to the VM by using either RDP for Windows VMs or SSH for Linux VMs.

### [Template](#tab/template)

Follow the steps to use an ARM template to enable trusted launch on an existing Azure Generation 2 VM.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

1. Review the template.

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "vmsToUpgrade": {
                "type": "object",
                "metadata": {
                    "description": "Specifies the list of Gen2 virtual machines to be upgraded to Trusted launch."
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
                "name": "[parameters('vmsToUpgrade').virtualMachines[copyIndex()].vmName]",
                "location": "[parameters('vmsToUpgrade').virtualMachines[copyIndex()].location]",
                "properties": {
                    "securityProfile": {
                        "uefiSettings": {
                            "secureBootEnabled": "[parameters('vmsToUpgrade').virtualMachines[copyIndex()].secureBootEnabled]",
                            "vTpmEnabled": "[parameters('vTpmEnabled')]"
                        },
                        "securityType": "TrustedLaunch"
                    }
                },
                "copy": {
                    "name": "vmCopy",
                    "count": "[length(parameters('vmsToUpgrade').virtualMachines)]"
                }
            }
        ]
    }
    ```

1. Edit the `parameters` JSON file with the VMs to be updated with the `TrustedLaunch` security type.

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "vmsToUpgrade": {
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

    Property    |    Description of property    |    Example template value
    -|-|-
    vmName    |    Name of Azure Generation 2 VM.    |    `myVm`
    location    |    Location of Azure Generation 2 VM.    |    `westus3`
    secureBootEnabled    |    Enable Secure Boot with the trusted launch security type.    |    `true`

1. Deallocate all the Azure Generation 2 VMs to be updated.

    ```azurepowershell-interactive
    Stop-AzVM -ResourceGroupName myResourceGroup -Name myVm01
    ```

1. Run the ARM template deployment.

    ```azurepowershell-interactive
    $resourceGroupName = "myResourceGroup"
    $parameterFile = "folderPathToFile\parameters.json"
    $templateFile = "folderPathToFile\template.json"
    
    New-AzResourceGroupDeployment `
        -ResourceGroupName $resourceGroupName `
        -TemplateFile $templateFile -TemplateParameterFile $parameterFile
    ```

1. Verify that the deployment is successful. Check for the security type and UEFI settings of the VM by using the Azure portal. On the **Overview** page, check the **Security type** section.

   :::image type="content" source="./media/trusted-launch/generation-2-trusted-launch-settings.png" alt-text="Screenshot that shows the trusted launch properties of the VM.":::

1. Start the upgraded trusted launch VM and ensure that it starts successfully. Verify that you can sign in to the VM by using either RDP for Windows VMs or SSH for Linux VMs.

---

## Related content

- After the upgrades, we recommend that you enable [boot integrity monitoring](trusted-launch.md#microsoft-defender-for-cloud-integration) to monitor the health of the VM by using Microsoft Defender for Cloud.
- Learn more about [trusted launch](trusted-launch.md) and review [frequently asked questions](trusted-launch-faq.md).
