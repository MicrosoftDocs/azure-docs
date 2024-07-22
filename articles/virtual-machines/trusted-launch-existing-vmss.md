---
title: Enable Trusted launch on existing Scale set
description: Enable Trusted launch on existing Azure Scale set.
author: AjKundnani
ms.author: ajkundna
ms.reviewer: cynthn
ms.service: azure-virtual-machine-scale-sets
ms.subservice: trusted-launch
ms.topic: how-to
ms.date: 06/10/2024
ms.custom: template-how-to, devx-track-azurepowershell, devx-track-arm-template
---

# (Preview) Enable Trusted launch on existing Virtual machine Scale set

**Applies to:** :heavy_check_mark: Linux VM :heavy_check_mark: Windows VM :heavy_check_mark: Virtual Machine Scale Sets Uniform

Azure Virtual machine Scale sets supports enabling Trusted launch on existing [Uniform Scale sets](overview.md) VMs by upgrading to [Trusted launch](trusted-launch.md) security type.

[Trusted launch](trusted-launch.md) enables foundational compute security on [Azure Generation 2](generation-2.md) virtual machines & scale sets and protects them against advanced and persistent attack techniques like boot kits and rootkits. It does so by combining infrastructure technologies like Secure Boot, vTPM, and Boot Integrity Monitoring on your Scale set.

## Limitations

- Enabling Trusted launch on existing [virtual machine Scale sets with data disks attached](../virtual-machine-scale-sets/virtual-machine-scale-sets-attached-disks.md) is currently not supported.
  - To validate if scale set is configured with data disk, navigate to scale set -> **Disks** under **Settings** menu -> check under heading **Data disks**
    :::image type="content" source="./media/trusted-launch/00-vmss-with-data-disks.png" alt-text="Screenshot of the scale set with data disks.":::

- Enabling Trusted launch on existing [virtual machine Scale sets Flex](../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md) is currently not supported.
- Enabling Trusted launch on existing [Service fabric clusters](../service-fabric/service-fabric-overview.md) and [Service fabric managed clusters](../service-fabric/overview-managed-cluster.md) is currently not supported.

## Prerequisites

- Register Preview Feature `ImageSkuGenUpdateWithVMSS` under `Microsoft.Compute` namespace on scale set subscription. For more details, refer to [Set up preview features in Azure subscription](../azure-resource-manager/management/preview-features.md)
- Scale set is not dependent on [features currently not supported with Trusted launch](trusted-launch.md#unsupported-features).
- Scale set should be configured with [Trusted launch supported size family](trusted-launch.md#virtual-machines-sizes)
    > [!NOTE]
    >
    > - Virtual machine size can be changed along with Trusted launch upgrade. Ensure quota for new VM Size is in-place to avoid upgrade failures. Refer to [Check vCPU quotas](quotas.md).
    > - Changes in Virtual machine size will re-create Virtual machine instance with new size and will require downtime of individual Virtual machine instance. It can be done in a Rolling Upgrade fashion to avoid Scale set downtime.
- Scale set should be configured with [Trusted launch supported OS Image](trusted-launch.md#operating-systems-supported). For [Azure compute gallery OS image](azure-compute-gallery.md), ensure image definition is marked as [TrustedLaunchSupported](trusted-launch-portal.md#deploy-a-trusted-launch-vm-from-an-azure-compute-gallery-image)

## Enable Trusted launch on existing Scale set Uniform

### [Template](#tab/template)

This section documents steps for using an [ARM template](../azure-resource-manager/templates/overview.md) to enable Trusted launch on existing Virtual machine Scale set uniform.

Make the following modifications to your existing ARM template deployment code. For complete template, refer to [Quickstart Trusted launch Scale set ARM template](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.compute/vmss-trustedlaunch-windows/azuredeploy.json).

> [!IMPORTANT]
>
> Trusted launch security type is available with Scale set `apiVersion` `2020-12-01` or higher. Ensure API version is set correctly prior to upgrade.

1. **OS Image**: Update the OS Image reference to Gen2-Trusted launch supported OS image. Make sure the source Gen2 image has `TrustedLaunchSupported` security type if using Azure Compute Gallery OS image.

    ```json
    "storageProfile": { 
            "osDisk": { 
                "createOption": "FromImage", 
                "caching": "ReadWrite" 
            }, 
            "imageReference": { 
                "publisher": "MicrosoftWindowsServer", 
                "offer": "WindowsServer", 
                "sku": "2022-datacenter-azure-edition", 
                "version": "latest" 
            } 
    }
    ```

2. (Optional) **Scale set Size**: Modify the Scale set size if current size family is not [supported with Trusted launch](trusted-launch.md#virtual-machines-sizes) security configuration.

    ```json
        "sku": { 
            "name": "Standard_D2s_v3", 
            "tier": "Standard", 
            "capacity": "[parameters('instanceCount')]" 
        } 
    ```

3. **Security Profile**: Add `securityProfile` block under `virtualMachineProfile` to enable Trusted Launch security configuration.
    > [!NOTE]
    >
    > Recommended settings: `vTPM`: `true` and `secureBoot`: `true`
    > `secureBoot` should be set to `false` if you are using any un-signed custom driver or kernel on OS.

    ```json
    "securityProfile": { 
        "securityType": "TrustedLaunch", 
        "uefiSettings": { 
          "secureBootEnabled": true, 
          "vTpmEnabled": true
        } 
    }
    ```

4. (Recommended) **Guest Attestation Extension**: Add [Guest Attestation (GA) extension](trusted-launch.md#microsoft-defender-for-cloud-integration) for Scale set resource, which enables [Boot integrity monitoring](boot-integrity-monitoring-overview.md) for Scale set.
    > [!Important]
    >
    > Guest attestation extension requires `secureBoot` and `vTPM` set to `true`.

    ```json
    { 
        "condition": "[and(parameters('vTPM'), parameters('secureBoot'))]", 
        "type": "Microsoft.Compute/virtualMachineScaleSets/extensions", 
        "apiVersion": "2022-03-01", 
        "name": "[format('{0}/{1}', parameters('vmssName'), GuestAttestation)]", 
        "location": "[parameters('location')]", 
        "properties": { 
          "publisher": "Microsoft.Azure.Security.WindowsAttestation", 
          "type": "GuestAttestation", 
          "typeHandlerVersion": "1.0", 
          "autoUpgradeMinorVersion": true, 
          "enableAutomaticUpgrade": true, 
          "settings": { 
            "AttestationConfig": { 
              "MaaSettings": { 
                "maaEndpoint": "[substring('emptystring', 0, 0)]", 
                "maaTenantName": "GuestAttestation" 
              } 
            } 
          } 
        }, 
        "dependsOn": [ 
          "[resourceId('Microsoft.Compute/virtualMachineScaleSets', parameters('vmssName'))]" 
        ] 
    } 
    ```

    Name of extension publisher:

    OS Type    |    Extension publisher name
    -|-
    Windows    |    Microsoft.Azure.Security.WindowsAttestation
    Linux    |    Microsoft.Azure.Security.LinuxAttestation

5. Review the changes made to template.

    [!INCLUDE [json](./includes/enable-trusted-launch-vmss-arm-template.md)]

6. Execute the ARM template deployment.

    ```azurepowershell-interactive
    $resourceGroupName = "myResourceGroup"
    $parameterFile = "folderPathToFile\parameters.json"
    $templateFile = "folderPathToFile\template.json"
    
    New-AzResourceGroupDeployment `
        -ResourceGroupName $resourceGroupName `
        -TemplateFile $templateFile -TemplateParameterFile $parameterFile
    ```

7. Verify that the deployment is successful. Check for the security type and UEFI settings of the Scale set uniform using Azure portal. Check the Security type section in the Overview page.

    :::image type="content" source="./media/trusted-launch/05-validate-trustedlaunch-vmss.png" alt-text="Screenshot of the Trusted launch properties of the Scale set.":::

8. Update the VM instances manually if Scale set uniform [upgrade mode](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-policy.md) is set to `Manual`.

    ```azurepowershell-interactive
    $resourceGroupName = "myResourceGroup"
    $vmssName = "VMScaleSet001"
    Update-AzVmssInstance -ResourceGroupName $resourceGroupName -VMScaleSetName $vmssName -InstanceId "0"
    ```

### [CLI](#tab/cli)

This section steps through using the Azure CLI to enable Trusted launch on existing Azure Scale set Uniform resource.

Make sure that you've installed the latest [Azure CLI](/cli/azure/install-az-cli2) and are logged in to an Azure account with [az login](/cli/azure/reference-index).

> [!NOTE]
>
> - **vTPM** is enabled by default.
> - **Secure Boot** is recommended to be enabled (not enabled by default) if you are not using custom unsigned kernel or drivers. Secure Boot preserves boot integrity and enables foundational security for VM.

1. Log in to Azure Subscription

    ```azurecli-interactive
    az login
    
    az account set --subscription 00000000-0000-0000-0000-000000000000
    ```

2. Enable Trusted launch using command [az vmss update](/cli/azure/reference-index) by setting `--security-type`: `TrustedLaunch`, `virtualMachineProfile.storageProfile.imageReference.sku`: Gen2-Trusted launch supported OS image, `--vm-sku`: Gen2-Trusted launch supported VM size.

    ```azurecli-interactive
    az vmss update --name MyScaleSet `
        --resource-group MyResourceGroup `
        --set virtualMachineProfile.storageProfile.imageReference.sku='2022-datacenter-azure-edition' `
        --security-type TrustedLaunch --enable-secure-boot $true --enable-vtpm $true
    ```

    > [!NOTE]
    >
    > OS Image SKU used in command above should be from same OS Image Publisher and Offer.

3. Validate output of previous command. `securityProfile` configuration is returned with command output.

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

4. Update the VM instances manually if Scale set uniform [upgrade mode](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-policy.md) is set to `Manual`.

    ```azurecli-interactive
    az vmss update-instances --instance-ids 1 --name MyScaleSet --resource-group MyResourceGroup
    ```

5. Start rolling upgrade if Scale set uniform [upgrade mode](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-policy.md) is set to `RollingUpgrade`.

    ```azurecli-interactive
    az vmss rolling-upgrade start --name MyScaleSet --resource-group MyResourceGroup
    ```

### [PowerShell](#tab/powershell)

This section steps through using the Azure PowerShell to enable Trusted launch on existing Azure Virtual machine Scale set Uniform.

Make sure that you've installed the latest [Azure PowerShell](/powershell/azure/install-azps-windows) and are logged in to an Azure account with [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount).

> [!NOTE]
>
> - **vTPM** is enabled by default.
> - **Secure Boot** is recommended to be enabled (not enabled by default) if you are not using custom unsigned kernel or drivers. Secure Boot preserves boot integrity and enables foundational security for VM.

1. Log in to Azure Subscription

    ```azurepowershell-interactive
    Connect-AzAccount -SubscriptionId 00000000-0000-0000-0000-000000000000
    ```

2. Enable Trusted launch using command [Update-AzVMSS](/powershell/module/az.compute/update-azvmss) by setting `-SecurityType`: `TrustedLaunch`, `ImageReferenceSku`: Gen2-Trusted launch supported OS image, `-SkuName`: Gen2-Trusted launch supported VM size.

    ```azurepowershell-interactive
    $vmss = Get-AzVmss -VMScaleSetName MyVmssName -ResourceGroupName MyResourceGroup

    # Enable Trusted Launch
    Set-AzVmssSecurityProfile -virtualMachineScaleSet $vmss -SecurityType TrustedLaunch

    # Enable Trusted Launch settings
    Set-AzVmssUefi -VirtualMachineScaleSet $vmss -EnableVtpm $true -EnableSecureBoot $true

    Update-AzVmss -ResourceGroupName $vmss.ResourceGroupName `
        -VMScaleSetName $vmss.Name -VirtualMachineScaleSet $vmss `
        -SecurityType TrustedLaunch -EnableVtpm $true -EnableSecureBoot $true `
        -ImageReferenceSku 2022-datacenter-azure-edition
    ```

    > [!NOTE]
    >
    > OS Image SKU used in Update-AzVMSS command should be from same OS Image Publisher and Offer.

3. Validate `securityProfile` configuration is returned with [Get-AzVMSS](/powershell/module/az.compute/get-azvmss) command output.

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

4. Update the VM instances manually if Scale set uniform [upgrade mode](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-policy.md) is set to `Manual`.

    ```azurepowershell-interactive
    Update-AzVmssInstance -ResourceGroupName "MyResourceGroup" -VMScaleSetName "MyScaleSet" -InstanceId "0"
    ```

5. Start rolling upgrade if Scale set uniform [upgrade mode](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-policy.md) is set to `RollingUpgrade`.

    ```azurepowershell-interactive
    Start-AzVmssRollingOSUpgrade -ResourceGroupName "MyResourceGroup" -VMScaleSetName "MyScaleSet"
    ```

---

## Roll-back

To roll-back changes from Trusted launch to previous known good configuration, you need to set `securityType` of Scale set to **Standard**.

### [Template](#tab/template)

To roll-back changes from Trusted launch to previous known good configuration, set `securityProfile` to **Standard** as shown. Optionally, you can also revert other parameter changes - OS image, VM size, and repeat steps 5-8 described with [Enable Trusted launch on existing scale set](#enable-trusted-launch-on-existing-scale-set-uniform)

```json
"securityProfile": {
    "securityType": "Standard",
    "uefiSettings": "[null()]"
}
```

### [CLI](#tab/cli)

> [!NOTE]
>
> Required Azure CLI version **2.62.0** or above for roll-back of VMSS uniform from Trusted launch to Non-Trusted launch configuration.

To roll-back changes from Trusted launch to previous known good configuration, set `--security-type` to `Standard` as shown. Optionally, you can also revert other parameter changes - OS image, virtual machine size, and repeat steps 2-5 described with [Enable Trusted launch on existing scale set](#enable-trusted-launch-on-existing-scale-set-uniform)

```azurecli-interactive
az vmss update --name MyScaleSet `
        --resource-group MyResourceGroup `
        --security-type Standard
```

### [PowerShell](#tab/powershell)

To roll-back changes from Trusted launch to previous known good configuration, set `-SecurityType` to `Standard` as shown. Optionally, you can also revert other parameter changes - OS image, virtual machine size, and repeat steps 2-5 described with [Enable Trusted launch on existing scale set](#enable-trusted-launch-on-existing-scale-set-uniform)

```azurepowershell-interactive
$vmss = Get-AzVmss -VMScaleSetName MyVmssName -ResourceGroupName MyResourceGroup

# Roll-back Trusted Launch
Set-AzVmssSecurityProfile -virtualMachineScaleSet $vmss -SecurityType Standard

Update-AzVmss -ResourceGroupName $vmss.ResourceGroupName `
    -VMScaleSetName $vmss.Name -VirtualMachineScaleSet $vmss `
    -SecurityType Standard `
    -ImageReferenceSku 2022-datacenter-azure-edition
```

---

## Next steps

**(Recommended)** Post-Upgrades enable [Boot integrity monitoring](trusted-launch.md#microsoft-defender-for-cloud-integration) to monitor the health of the VM using Microsoft Defender for Cloud.

Learn more about [Trusted launch](trusted-launch.md) and review [frequently asked questions](trusted-launch-faq.md).
