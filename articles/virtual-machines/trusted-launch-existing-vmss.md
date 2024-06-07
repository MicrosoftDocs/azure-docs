---
title: Enable Trusted launch on existing VMSS
description: Enable Trusted launch on existing Azure VMSS.
author: AjKundnani
ms.author: ajkundna
ms.reviewer: cynthn
ms.service: virtual-machines
ms.subservice: trusted-launch
ms.topic: how-to
ms.date: 06/10/2024
ms.custom: template-how-to, devx-track-azurepowershell
---

# (Preview) Enable Trusted launch on existing Azure VMSS

**Applies to:** :heavy_check_mark: Linux VM :heavy_check_mark: Windows VM :heavy_check_mark: Virtual Machine Scale Sets Uniform

Azure Virtual Machines supports enabling Trusted launch on existing [Azure Virtual Machine Scale Sets Uniform](overview.md) VMs by upgrading to [Trusted launch](trusted-launch.md) security type.

[Trusted launch](trusted-launch.md) is a way to enable foundational compute security on [Azure Generation 2](generation-2.md). Trusted launch protects your Virtual Machine Scale Sets (VMSS) against advanced and persistent attack techniques like boot kits and rootkits by combining infrastructure technologies like Secure Boot, vTPM and Boot Integrity Monitoring on your VMSS.

> [!IMPORTANT]
>
> - Enabling Trusted launch on existing Azure virtual machine scale sets (VMSS) Flex is currently not supported.

## Prerequisites

- Register Preview Feature `ImageSkuGenUpdateWithVMSS` on subscription. Refer to [How to register feature using PowerShell](/powershell/module/az.resources/register-azproviderfeature)
- VMSS is not dependent on [features currently not supported with Trusted launch](trusted-launch.md#unsupported-features).
- VMSS should be configured with [Trusted launch supported size family](trusted-launch.md#virtual-machines-sizes)
    > [!NOTE]
    >
    > VM size can be changed along with Trusted launch upgrade. Ensure quota for new VM Size is in-place to avoid upgrade failures. Refer to [Check vCPU quotas](quotas.md).
    > Changes in VM size will re-create VM instance with new size and will require downtime of individual VM instance. It can be done in a Rolling Upgrade fashion to avoid VMSS downtime.
- VMSS should be configured with [Trusted launch supported OS Image](trusted-launch.md#operating-systems-supported). For [Azure compute gallery OS image](azure-compute-gallery.md), ensure image definition is marked as [TrustedLaunchSupported](trusted-launch-portal.md#deploy-a-trusted-launch-vm-from-an-azure-compute-gallery-image)

## Enable Trusted launch on existing VMSS Uniform

> [!NOTE]
>
> - **vTPM** is enabled by default.
> - **Secure Boot** is recommended to be enabled (not enabled by default) if you are not using custom unsigned kernel or drivers. Secure Boot preserves boot integrity and enables foundational security for VM.

### [Template](#tab/template)

This section steps through using an ARM template to enable Trusted launch on existing Azure Generation 2 VM.

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

Make the following modifications to your existing ARM template deployment code. For complete template, refer to [Quickstart Trusted launch VMSS ARM template](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.compute/vmss-trustedlaunch-windows/azuredeploy.json).

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

2. (Optional) **VMSS Size**: Modify the VMSS size if current size family is not [supported with Trusted launch](trusted-launch.md#virtual-machines-sizes) security configuration.

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

4. (Optional) **Guest Attestation Extension**: Add [Guest Attestation (GA) extension](trusted-launch.md#microsoft-defender-for-cloud-integration) for VMSS resource, which will enable [Boot integrity monitoring](boot-integrity-monitoring-overview.md) for VMSS.
    > [!NOTE]
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

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "vmSku": {
          "type": "string",
          "defaultValue": "Standard_D2s_v3",
          "metadata": {
            "description": "Size of VMs in the VM Scale Set."
          }
        },
        "sku": {
          "type": "string",
          "defaultValue": "2022-datacenter-azure-edition",
          "allowedValues": [
            "2022-datacenter-azure-edition"
          ],
          "metadata": {
            "description": "The Windows version for the VM. This will pick a fully patched image of this given Windows version."
          }
        },
        "vmssName": {
          "type": "string",
          "maxLength": 61,
          "metadata": {
            "description": "String used as a base for naming resources. Must be 3-61 characters in length and globally unique across Azure. A hash is prepended to this string for some resources, and resource-specific information is appended."
          }
        },
        "instanceCount": {
          "type": "int",
          "defaultValue": 2,
          "maxValue": 100,
          "minValue": 1,
          "metadata": {
            "description": "Number of VM instances (100 or less)."
          }
        },
        "adminUsername": {
          "type": "string",
          "metadata": {
            "description": "Admin username on all VMs."
          }
        },
        "adminPassword": {
          "type": "securestring",
          "metadata": {
            "description": "Admin password on all VMs."
          }
        },
        "location": {
          "type": "string",
          "defaultValue": "[resourceGroup().location]",
          "metadata": {
            "description": "Location for all resources."
          }
        },
        "publicIpName": {
          "type": "string",
          "defaultValue": "myPublicIP",
          "metadata": {
            "description": "Name for the Public IP used to access the virtual machine scale set."
          }
        },
        "publicIPAllocationMethod": {
          "type": "string",
          "defaultValue": "Static",
          "allowedValues": [
            "Dynamic",
            "Static"
          ],
          "metadata": {
            "description": "Allocation method for the Public IP used to access the virtual machine set."
          }
        },
        "publicIpSku": {
          "type": "string",
          "defaultValue": "Standard",
          "allowedValues": [
            "Basic",
            "Standard"
          ],
          "metadata": {
            "description": "SKU for the Public IP used to access the virtual machine scale set."
          }
        },
        "dnsLabelPrefix": {
          "type": "string",
          "defaultValue": "[toLower(format('{0}-{1}', parameters('vmssName'), uniqueString(resourceGroup().id)))]",
          "metadata": {
            "description": "Unique DNS Name for the Public IP used to access the virtual machine scale set."
          }
        },
        "healthExtensionProtocol": {
          "type": "string",
          "defaultValue": "TCP",
          "allowedValues": [
            "TCP",
            "HTTP",
            "HTTPS"
          ]
        },
        "healthExtensionPort": {
          "type": "int",
          "defaultValue": 3389
        },
        "healthExtensionRequestPath": {
          "type": "string",
          "defaultValue": "/"
        },
        "overprovision": {
          "type": "bool",
          "defaultValue": false
        },
        "upgradePolicy": {
          "type": "string",
          "defaultValue": "Manual",
          "allowedValues": [
            "Manual",
            "Rolling",
            "Automatic"
          ]
        },
        "maxBatchInstancePercent": {
          "type": "int",
          "defaultValue": 20
        },
        "maxUnhealthyInstancePercent": {
          "type": "int",
          "defaultValue": 20
        },
        "maxUnhealthyUpgradedInstancePercent": {
          "type": "int",
          "defaultValue": 20
        },
        "pauseTimeBetweenBatches": {
          "type": "string",
          "defaultValue": "PT5S"
        },
        "securityType": {
          "type": "string",
          "defaultValue": "TrustedLaunch",
          "allowedValues": [
            "Standard",
            "TrustedLaunch"
          ],
          "metadata": {
            "description": "Security Type of the Virtual Machine."
          }
        },
        "encryptionAtHost": {
            "type": "bool",
            "defaultValue": false,
            "metadata": {
                "description": "This property can be used by user in the request to enable or disable the Host Encryption for the virtual machine or virtual machine scale set. This will enable the encryption for all the disks including Resource/Temp disk at host itself. The default behavior is: The Encryption at host will be disabled unless this property is set to true for the resource."
            }
        }
      },
      "variables": {
        "namingInfix": "[toLower(substring(format('{0}{1}', parameters('vmssName'), uniqueString(resourceGroup().id)), 0, 9))]",
        "addressPrefix": "10.0.0.0/16",
        "subnetPrefix": "10.0.0.0/24",
        "virtualNetworkName": "[format('{0}vnet', variables('namingInfix'))]",
        "subnetName": "[format('{0}subnet', variables('namingInfix'))]",
        "loadBalancerName": "[format('{0}lb', variables('namingInfix'))]",
        "natPoolName": "[format('{0}natpool', variables('namingInfix'))]",
        "bePoolName": "[format('{0}bepool', variables('namingInfix'))]",
        "natStartPort": 50000,
        "natEndPort": 50119,
        "natBackendPort": 3389,
        "nicName": "[format('{0}nic', variables('namingInfix'))]",
        "ipConfigName": "[format('{0}ipconfig', variables('namingInfix'))]",
        "imageReference": {
          "2022-datacenter-azure-edition": {
            "publisher": "MicrosoftWindowsServer",
            "offer": "WindowsServer",
            "sku": "[parameters('sku')]",
            "version": "latest"
          }
        },
        "extensionName": "GuestAttestation",
        "extensionPublisher": "Microsoft.Azure.Security.WindowsAttestation",
        "extensionVersion": "1.0",
        "maaTenantName": "GuestAttestation",
        "maaEndpoint": "[substring('emptyString', 0, 0)]",
        "uefiSettingsJson": {
            "secureBootEnabled": true,
            "vTpmEnabled": true
        },
        "rollingUpgradeJson": {
          "maxBatchInstancePercent": "[parameters('maxBatchInstancePercent')]",
          "maxUnhealthyInstancePercent": "[parameters('maxUnhealthyInstancePercent')]",
          "maxUnhealthyUpgradedInstancePercent": "[parameters('maxUnhealthyUpgradedInstancePercent')]",
          "pauseTimeBetweenBatches": "[parameters('pauseTimeBetweenBatches')]"
        }
      },
      "resources": [
        {
          "type": "Microsoft.Network/virtualNetworks",
          "apiVersion": "2022-05-01",
          "name": "[variables('virtualNetworkName')]",
          "location": "[parameters('location')]",
          "properties": {
            "addressSpace": {
              "addressPrefixes": [
                "[variables('addressPrefix')]"
              ]
            },
            "subnets": [
              {
                "name": "[variables('subnetName')]",
                "properties": {
                  "addressPrefix": "[variables('subnetPrefix')]"
                }
              }
            ]
          }
        },
        {
          "type": "Microsoft.Network/publicIPAddresses",
          "apiVersion": "2022-05-01",
          "name": "[parameters('publicIpName')]",
          "location": "[parameters('location')]",
          "sku": {
            "name": "[parameters('publicIpSku')]"
          },
          "properties": {
            "publicIPAllocationMethod": "[parameters('publicIPAllocationMethod')]",
            "dnsSettings": {
              "domainNameLabel": "[parameters('dnsLabelPrefix')]"
            }
          }
        },
        {
          "type": "Microsoft.Network/loadBalancers",
          "apiVersion": "2022-05-01",
          "name": "[variables('loadBalancerName')]",
          "location": "[parameters('location')]",
          "sku": {
            "name": "[parameters('publicIpSku')]",
            "tier": "Regional"
          },
          "properties": {
            "frontendIPConfigurations": [
              {
                "name": "LoadBalancerFrontEnd",
                "properties": {
                  "publicIPAddress": {
                    "id": "[resourceId('Microsoft.Network/publicIPAddresses', parameters('publicIpName'))]"
                  }
                }
              }
            ],
            "backendAddressPools": [
              {
                "name": "[variables('bePoolName')]"
              }
            ],
            "inboundNatPools": [
              {
                "name": "[variables('natPoolName')]",
                "properties": {
                  "frontendIPConfiguration": {
                    "id": "[resourceId('Microsoft.Network/loadBalancers/frontendIPConfigurations', variables('loadBalancerName'), 'loadBalancerFrontEnd')]"
                  },
                  "protocol": "Tcp",
                  "frontendPortRangeStart": "[variables('natStartPort')]",
                  "frontendPortRangeEnd": "[variables('natEndPort')]",
                  "backendPort": "[variables('natBackendPort')]"
                }
              }
            ]
          },
          "dependsOn": [
            "[resourceId('Microsoft.Network/publicIPAddresses', parameters('publicIpName'))]"
          ]
        },
        {
          "type": "Microsoft.Compute/virtualMachineScaleSets",
          "apiVersion": "2022-03-01",
          "name": "[parameters('vmssName')]",
          "location": "[parameters('location')]",
          "sku": {
            "name": "[parameters('vmSku')]",
            "tier": "Standard",
            "capacity": "[parameters('instanceCount')]"
          },
          "properties": {
            "virtualMachineProfile": {
              "storageProfile": {
                "osDisk": {
                  "createOption": "FromImage",
                  "caching": "ReadWrite"
                },
                "imageReference": "[variables('imageReference')[parameters('sku')]]"
              },
              "osProfile": {
                "computerNamePrefix": "[variables('namingInfix')]",
                "adminUsername": "[parameters('adminUsername')]",
                "adminPassword": "[parameters('adminPassword')]"
              },
              "securityProfile": {
                  "encryptionAtHost": "[parameters('encryptionAtHost')]",
                  "securityType": "[parameters('securityType')]",
                  "uefiSettings": "[if(equals(parameters('securityType'), 'TrustedLaunch'), variables('uefiSettingsJson'), null())]"
                  
              },
              "networkProfile": {
                "networkInterfaceConfigurations": [
                  {
                    "name": "[variables('nicName')]",
                    "properties": {
                      "primary": true,
                      "ipConfigurations": [
                        {
                          "name": "[variables('ipConfigName')]",
                          "properties": {
                            "subnet": {
                              "id": "[resourceId('Microsoft.Network/virtualNetworks/subnets', variables('virtualNetworkName'), variables('subnetName'))]"
                            },
                            "loadBalancerBackendAddressPools": [
                              {
                                "id": "[resourceId('Microsoft.Network/loadBalancers/backendAddressPools', variables('loadBalancerName'), variables('bePoolName'))]"
                              }
                            ],
                            "loadBalancerInboundNatPools": [
                              {
                                "id": "[resourceId('Microsoft.Network/loadBalancers/inboundNatPools', variables('loadBalancerName'), variables('natPoolName'))]"
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                ]
              },
              "extensionProfile": {
                "extensions": [
                  {
                    "name": "HealthExtension",
                    "properties": {
                      "publisher": "Microsoft.ManagedServices",
                      "type": "ApplicationHealthWindows",
                      "typeHandlerVersion": "1.0",
                      "autoUpgradeMinorVersion": false,
                      "settings": {
                        "protocol": "[parameters('healthExtensionProtocol')]",
                        "port": "[parameters('healthExtensionPort')]",
                        "requestPath": "[if(equals(parameters('healthExtensionProtocol'), 'TCP'), null(), parameters('healthExtensionRequestPath'))]"
                      }
                    }
                  }
                ]
              },
              "diagnosticsProfile": {
                "bootDiagnostics": {
                  "enabled": true
                }
              }
            },
            "orchestrationMode": "Uniform",
            "overprovision": "[parameters('overprovision')]",
            "upgradePolicy": {
              "mode": "[parameters('upgradePolicy')]",
              "rollingUpgradePolicy": "[if(equals(parameters('upgradePolicy'), 'Rolling'), variables('rollingUpgradeJson'), null())]",
              "automaticOSUpgradePolicy": {
                "enableAutomaticOSUpgrade": true
              }
            }
          },
          "dependsOn": [
            "[resourceId('Microsoft.Network/loadBalancers', variables('loadBalancerName'))]",
            "[resourceId('Microsoft.Network/virtualNetworks', variables('virtualNetworkName'))]"
          ]
        },
        {
          "condition": "[and(equals(parameters('securityType'), 'TrustedLaunch'), and(equals(variables('uefiSettingsJson').secureBootEnabled, true()), equals(variables('uefiSettingsJson').vTpmEnabled, true())))]",
          "type": "Microsoft.Compute/virtualMachineScaleSets/extensions",
          "apiVersion": "2022-03-01",
          "name": "[format('{0}/{1}', parameters('vmssName'), variables('extensionName'))]",
          "location": "[parameters('location')]",
          "properties": {
            "publisher": "[variables('extensionPublisher')]",
            "type": "[variables('extensionName')]",
            "typeHandlerVersion": "[variables('extensionVersion')]",
            "autoUpgradeMinorVersion": true,
            "enableAutomaticUpgrade": true,
            "settings": {
              "AttestationConfig": {
                "MaaSettings": {
                  "maaEndpoint": "[variables('maaEndpoint')]",
                  "maaTenantName": "[variables('maaTenantName')]"
                }
              }
            }
          },
          "dependsOn": [
            "[resourceId('Microsoft.Compute/virtualMachineScaleSets', parameters('vmssName'))]"
          ]
        }
      ]
    }
    ```

6. Execute the ARM template deployment.

    ```azurepowershell-interactive
    $resourceGroupName = "myResourceGroup"
    $parameterFile = "folderPathToFile\parameters.json"
    $templateFile = "folderPathToFile\template.json"
    
    New-AzResourceGroupDeployment `
        -ResourceGroupName $resourceGroupName `
        -TemplateFile $templateFile -TemplateParameterFile $parameterFile
    ```

7. Verify that the deployment is successful. Check for the security type and UEFI settings of the VMSS uniform using Azure portal. Check the Security type section in the Overview page.

8. Update the VM instances manually if VMSS uniform [upgrade mode](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-policy.md) is set to `Manual`.

    ```azurepowershell-interactive
    $resourceGroupName = "myResourceGroup"
    $vmssName = "VMScaleSet001"
    Update-AzVmssInstance -ResourceGroupName $resourceGroupName -VMScaleSetName $vmssName -InstanceId "0"
    ```

9. **Roll-back**, to roll-back changes from Trusted launch to previous known good configuration, set `securityProfile` as shown below along with revert of other parameter changes - OS image, VM size, Guest attestation extension and repeat steps 5-8

    ```json
    "securityProfile": {
        "securityType": "Standard",
        "uefiSettings": "[null()]"
    }
    ```

### [CLI](#tab/cli)

This section steps through using the Azure CLI to enable Trusted launch on existing Azure VMSS Uniform resource.

Make sure that you've installed the latest [Azure CLI](/cli/azure/install-az-cli2) and are logged in to an Azure account with [az login](/cli/azure/reference-index).

> [!NOTE]
>
> Azure CLI currently does not supports roll-back of VMSS Uniform from Trusted launch to Standard. As workaround, use Azure PowerShell or ARM template to execute roll-back.

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

4. Update the VM instances manually if VMSS uniform [upgrade mode](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-policy.md) is set to `Manual`.

    ```azurecli-interactive
    az vmss update-instances --instance-ids 1 --name MyScaleSet --resource-group MyResourceGroup
    ```

5. Start rolling upgrade if VMSS uniform [upgrade mode](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-policy.md) is set to `RollingUpgrade`.

    ```azurecli-interactive
    az vmss rolling-upgrade start --name MyScaleSet --resource-group MyResourceGroup
    ```

### [PowerShell](#tab/powershell)

This section steps through using the Azure PowerShell to enable Trusted launch on existing Azure Virtual machine scale set Uniform.

Make sure that you've installed the latest [Azure PowerShell](/powershell/azure/install-azps-windows) and are logged in to an Azure account with [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount).

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
    > OS Image SKU used in command above should be from same OS Image Publisher and Offer.

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

4. Update the VM instances manually if VMSS uniform [upgrade mode](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-policy.md) is set to `Manual`.

    ```azurepowershell-interactive
    Update-AzVmssInstance -ResourceGroupName "MyResourceGroup" -VMScaleSetName "MyScaleSet" -InstanceId "0"
    ```

5. Start rolling upgrade if VMSS uniform [upgrade mode](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-policy.md) is set to `RollingUpgrade`.

    ```azurepowershell-interactive
    Start-AzVmssRollingOSUpgrade -ResourceGroupName "MyResourceGroup" -VMScaleSetName "MyScaleSet"
    ```

6. **Roll-back**, to roll-back changes from Trusted launch to previous known good configuration, set `-SecurityType` to `Standard` as shown below along with revert of other parameter changes - OS image, VM size and repeat steps 2-5

    ```azurepowershell-interactive
    $vmss = Get-AzVmss -VMScaleSetName MyVmssName -ResourceGroupName MyResourceGroup
    
    # Enable Trusted Launch
    Set-AzVmssSecurityProfile -virtualMachineScaleSet $vmss -SecurityType Standard
    
    Update-AzVmss -ResourceGroupName $vmss.ResourceGroupName `
        -VMScaleSetName $vmss.Name -VirtualMachineScaleSet $vmss `
        -SecurityType Standard `
        -ImageReferenceSku 2022-datacenter-azure-edition
    ```

---

## Next steps

**(Recommended)** Post-Upgrades enable [Boot integrity monitoring](trusted-launch.md#microsoft-defender-for-cloud-integration) to monitor the health of the VM using Microsoft Defender for Cloud.

Learn more about [Trusted launch](trusted-launch.md) and review [frequently asked questions](trusted-launch-faq.md)
