---
title: Enable Trusted launch on existing VMs
description: Learn how to enable Trusted launch on existing Azure virtual machines (VMs).
author: AjKundnani
ms.author: ajkundna
ms.reviewer: cynthn
ms.service: azure-virtual-machines
ms.subservice: trusted-launch
ms.topic: how-to
ms.date: 08/13/2023
ms.custom: template-how-to, devx-track-azurepowershell
---

# Enable Trusted launch on existing Azure VMs

**Applies to:** :heavy_check_mark: Linux VM :heavy_check_mark: Windows VM :heavy_check_mark: Generation 2 VM

Azure Virtual Machines supports enabling Azure Trusted launch on existing [Azure Generation 2](generation-2.md) virtual machines (VMs) by upgrading to the [Trusted launch](trusted-launch.md) security type.

[Trusted launch](trusted-launch.md) is a way to enable foundational compute security on [Azure Generation 2 VMs](generation-2.md) and protects against advanced and persistent attack techniques like boot kits and rootkits. It does so by combining infrastructure technologies like Secure Boot, virtual Trusted Platform Module (vTPM), and boot integrity monitoring on your VM.

> [!IMPORTANT]
> Support for *enabling Trusted launch on existing Azure Generation 1 VMs* is currently in private preview. You can gain access to preview by using the [registration form](https://aka.ms/Gen1ToTLUpgrade).

## Prerequisites

- Azure Generation 2 VM is configured with:
  - [Trusted launch supported size family](trusted-launch.md#virtual-machines-sizes).
  - [Trusted launch supported operating system (OS) image](trusted-launch.md#operating-systems-supported). For custom OS images or disks, the base image should be *Trusted launch capable*.
- Azure Generation 2 VM isn't using [features currently not supported with Trusted launch](trusted-launch.md#unsupported-features).
- Azure Generation 2 VMs should be *stopped and deallocated* before you enable the Trusted launch security type.
- Azure Backup, if enabled, for VMs should be configured with the [Enhanced Backup policy](../backup/backup-azure-vms-enhanced-policy.md). The Trusted launch security type can't be enabled for Generation 2 VMs configured with *Standard policy* backup protection.
  - Existing Azure VM backup can be migrated from the *Standard* to the *Enhanced* policy. Follow the steps in [Migrate Azure VM backups from Standard to Enhanced policy (preview)](../backup/backup-azure-vm-migrate-enhanced-policy.md).

## Best practices

- Enable Trusted launch on a test Generation 2 VM and determine if any changes are required to meet the prerequisites before you enable Trusted launch on Generation 2 VMs associated with production workloads.
- [Create restore points](create-restore-points.md) for Azure Generation 2 VMs associated with production workloads before you enable the Trusted launch security type. You can use the restore points to re-create the disks and Generation 2 VM with the previous well-known state.

## Enable Trusted launch on an existing VM

> [!NOTE]
>
> - After you enable Trusted launch, currently VMs can't be rolled back to the Standard security type (non-Trusted launch configuration).
> - vTPM is enabled by default.
> - We recommend that you enable Secure Boot, if you aren't using custom unsigned kernel or drivers. It's not enabled by default. Secure Boot preserves boot integrity and enables foundational security for VMs.

### [Portal](#tab/portal)

Enable Trusted launch on an existing Azure Generation 2 VM by using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Confirm that the VM generation is **V2** and select **Stop** for the VM.

    :::image type="content" source="./media/trusted-launch/02-generation-2-to-trusted-launch-stop-vm.png" alt-text="Screenshot that shows the Gen2 VM to be deallocated.":::

1. On the **Overview** page in the VM properties, under **Security type**, select **Standard**. The **Configuration** page for the VM opens.

    :::image type="content" source="./media/trusted-launch/03-generation-2-to-trusted-launch-click-standard.png" alt-text="Screenshot that shows the Security type as Standard.":::

1. On the **Configuration** page, under the **Security type** section, select the **Security type** dropdown list.

    :::image type="content" source="./media/trusted-launch/04-generation-2-to-trusted-launch-select-dropdown.png" alt-text="Screenshot that shows the Security type dropdown list.":::

1. Under the dropdown list, select **Trusted launch**. Select checkboxes to enable **Secure Boot** and **vTPM**. After you make the changes, select **Save**.

    > [!NOTE]
    >
    > - Generation 2 VMs created by using [Azure Compute Gallery (ACG)](azure-compute-gallery.md), [Managed image](capture-image-resource.yml), or an [OS disk](./scripts/create-vm-from-managed-os-disks.md) can't be upgraded to Trusted launch by using the portal. Ensure that the [OS version is supported for Trusted launch](trusted-launch.md#operating-systems-supported). Use PowerShell, the Azure CLI, or an Azure Resource Manager template (ARM template) to run the upgrade.

    :::image type="content" source="./media/trusted-launch/05-generation-2-to-trusted-launch-select-uefi-settings.png" alt-text="Screenshot that shows the Secure Boot and vTPM settings.":::

1. After the update successfully finishes, close the **Configuration** page. On the **Overview** page in the VM properties, confirm the **Security type** settings.

    :::image type="content" source="./media/trusted-launch/06-generation-2-to-trusted-launch-validate-uefi.png" alt-text="Screenshot that shows the Trusted launch upgraded VM.":::

1. Start the upgraded Trusted launch VM. Verify that you can sign in to the VM by using either the Remote Desktop Protocol (RDP) for Windows VMs or the Secure Shell Protocol (SSH) for Linux VMs.

### [CLI](#tab/cli)

Follow the steps to enable Trusted launch on an existing Azure Generation 2 VM by using the Azure CLI.

Make sure that you install the latest [Azure CLI](/cli/azure/install-az-cli2) and are signed in to an Azure account with [az login](/cli/azure/reference-index).

1. Sign in to the VM Azure subscription.

    ```azurecli-interactive
    az login
    
    az account set --subscription 00000000-0000-0000-0000-000000000000
    ```

2. Deallocate the VM.

3. Enable Trusted launch by setting `--security-type` to `TrustedLaunch`.

    ```azurecli-interactive
    az vm deallocate \
        --resource-group myResourceGroup --name myVm
    ```

4. Validate the output of the previous command. Ensure that the `securityProfile` configuration is returned with the command output.

    ```azurecli-interactive
    az vm update \
        --resource-group myResourceGroup --name myVm \
        --security-type TrustedLaunch \
        --enable-secure-boot true --enable-vtpm true
    ```

5. Validate the output of the previous command. Ensure that the `securityProfile` configuration is returned with the command output.

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

6. Start the VM.

    ```azurecli-interactive
    az vm start \
        --resource-group myResourceGroup --name myVm
    ```

7. Start the upgraded Trusted launch VM. Verify that you can sign in to the VM by using either RDP (for Windows VMs) or SSH (for Linux VMs).

### [PowerShell](#tab/powershell)

Follow the steps to enable Trusted launch on an existing Azure Generation 2 VM by using Azure PowerShell.

Make sure that you install the latest [Azure PowerShell](/powershell/azure/install-azps-windows) and are signed in to an Azure account with [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount).

1. Sign in to the VM Azure subscription.

    ```azurepowershell-interactive
    Connect-AzAccount -SubscriptionId 00000000-0000-0000-0000-000000000000
    ```

2. Deallocate the VM.

    ```azurepowershell-interactive
    Stop-AzVM -ResourceGroupName myResourceGroup -Name myVm
    ```

3. Enable Trusted launch by setting `-SecurityType` to `TrustedLaunch`.

    ```azurepowershell-interactive
    Get-AzVM -ResourceGroupName myResourceGroup -VMName myVm `
        | Update-AzVM -SecurityType TrustedLaunch `
            -EnableSecureBoot $true -EnableVtpm $true
    ```

4. Validate `securityProfile` in the updated VM configuration.

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

5. Start the VM.

    ```azurepowershell-interactive
    Start-AzVM -ResourceGroupName myResourceGroup -Name myVm
    ```

6. Start the upgraded Trusted launch VM. Verify that you can sign in to the VM by using either RDP (for Windows VMs) or SSH (for Linux VMs).

### [Template](#tab/template)

Follow the steps to enable Trusted launch on an existing Azure Generation 2 VM by using an ARM template.

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

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

2. Edit the `parameters` JSON file with VMs to be updated with the `TrustedLaunch` security type.

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
    secureBootEnabled    |    Enable Secure Boot with the Trusted launch security type.    |    `true`

3. Deallocate all Azure Generation 2 VMs to be updated.

    ```azurepowershell-interactive
    Stop-AzVM -ResourceGroupName myResourceGroup -Name myVm01
    ```

4. Run the ARM template deployment.

    ```azurepowershell-interactive
    $resourceGroupName = "myResourceGroup"
    $parameterFile = "folderPathToFile\parameters.json"
    $templateFile = "folderPathToFile\template.json"
    
    New-AzResourceGroupDeployment `
        -ResourceGroupName $resourceGroupName `
        -TemplateFile $templateFile -TemplateParameterFile $parameterFile
    ```

   :::image type="content" source="./media/trusted-launch/generation-2-trusted-launch-settings.png" alt-text="Screenshot that shows the Trusted launch properties of the VM.":::

    :::image type="content" source="./media/trusted-launch/generation-2-trusted-launch-settings.png" alt-text="Screenshot that shows the Trusted launch properties of the VM.":::

5. Start the upgraded Trusted launch VM. Verify that you can sign in to the VM by using either RDP (for Windows VMs) or SSH (for Linux VMs).

---

## Azure Advisor Recommendation

Azure Advisor populates an **Enable Trusted launch foundational excellence, and modern security for Existing Generation 2 VM(s)** operational excellence recommendation for existing Generation 2 VMs to adopt [Trusted launch](trusted-launch.md), a higher security posture for Azure VMs at no additional cost to you. Ensure Generation 2 VM has all prerequisites to migrate to Trusted launch, follow all the best practices including validation of OS image, VM Size, and creating restore points. For the Advisor recommendation to be considered complete, follow the steps outlined in the [**Enable Trusted launch on an existing VM**](trusted-launch-existing-vm.md#enable-trusted-launch-on-an-existing-vm) to upgrade the virtual machines security type and enable Trusted launch.

**What if there is Generation 2 VMs, that doesn't fit the prerequisites for Trusted launch?**

For a Generation 2 VM, that has not met the [prerequisites](#prerequisites) to upgrade to Trusted launch, look how to fulfill the prerequisites. For example, If using a virtual machine size not supported, please look for an [equivalent Trusted launch supported size](trusted-launch.md#virtual-machines-sizes) that supports Trusted launch.

> [!NOTE]
>
> Please dismiss the recommendation if Gen2 virtual machine is configured with VM size families which are currently not supported with Trusted launch like MSv2-series.

## Related content

- Enable Trusted launch for new virtual machine deployments. For more details, see [Deploy Trusted launch virtual machines](trusted-launch-portal.md)
- After the upgrades, we recommend that you enable [boot integrity monitoring](trusted-launch.md#microsoft-defender-for-cloud-integration) to monitor the health of the VM by using Microsoft Defender for Cloud.
- Learn more about [Trusted launch](trusted-launch.md) and review [frequently asked questions](trusted-launch-faq.md).
