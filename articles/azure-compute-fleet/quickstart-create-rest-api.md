---
title: Create an Azure Compute Fleet using an ARM template
description: Learn how to create an Azure Compute Fleet using an ARM template.
author: rajeeshr
ms.author: rajeeshr
ms.topic: how-to
ms.service: virtual-machines
ms.date: 05/09/2024
ms.reviewer: jushiman
ms.custom: devx-track-arm-template
---

# Create an Azure Compute Fleet using an ARM template (Preview)

> [!IMPORTANT]
> Azure Compute Fleet is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

This article steps through using an ARM template to create an Azure Compute Fleet. 


[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template opens in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.compute%2Fvmss-flexible-orchestration-quickstart%2Fazuredeploy.json":::


## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


## ARM template 

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

ARM templates let you deploy groups of related resources. In a single template, you can create the Virtual Machine Scale Set, install applications, and configure autoscale rules. With the use of variables and parameters, this template can be reused to update existing, or create extra scale sets. You can deploy templates through the Azure portal, Azure CLI, or Azure PowerShell, or from continuous integration / continuous delivery (CI/CD) pipelines.


## Review the template

```armasm
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "fleetName": {
            "type": "string",
            "metadata": {
                "description": "String used as a base for naming resources. Must be 3-61 characters in length and globally unique across Azure. A hash is prepended to this string for some resources, and resource-specific information is appended."
            }
        },
        "adminUsername": {
            "type": "string",
            "defaultValue": "testusername",
            "metadata": {
                "description": "Admin username on all VMs."
            }
        },
        "adminPassword": {
            "type": "string",
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
        }
    },
    "variables": {
        "vnName": "[format('{0}-vnet', parameters('fleetName'))]",
        "lbName": "[format('{0}-lb', parameters('fleetName'))]",
        "imageReference": {
            "publisher": "MicrosoftWindowsServer",
            "offer": "WindowsServer",
            "sku": "2019-DataCenter-GS",
            "version": "latest"
        }
    },
    "resources": [
        {
            "type": "Microsoft.Network/virtualNetworks",
            "apiVersion": "2022-07-01",
            "name": "[variables('vnName')]",
            "location": "[parameters('location')]",
            "properties": {
                "addressSpace": {
                    "addressPrefixes": [
                        "10.0.0.0/16"
                    ]
                },
                "subnets": [
                    {
                        "name": "default",
                        "properties": {
                            "addressPrefix": "10.0.0.0/24"
                        }
                    }
                ]
            }
        },
        {
            "type": "Microsoft.Network/loadBalancers",
            "apiVersion": "2022-07-01",
            "name": "[variables('lbName')]",
            "location": "[parameters('location')]",
            "sku": {
                "name": "Standard"
            },
            "properties": {
                "frontendIPConfigurations": [
                    {
                        "name": "[variables('lbName')]",
                        "properties": {
                            "privateIPAddress": "10.0.0.4",
                            "privateIPAllocationMethod": "Dynamic",
                            "subnet": {
                                "id": "[reference(resourceId('Microsoft.Network/virtualNetworks', variables('vnName'))).subnets[0].id]"
                            }
                        }
                    }
                ],
                "backendAddressPools": [
                    {
                        "name": "[variables('lbName')]"
                    }
                ]
            },
            "dependsOn": [
                "[resourceId('Microsoft.Network/virtualNetworks', variables('vnName'))]"
            ]
        },
        {
            "type": "Microsoft.AzureFleet/fleets",
            "apiVersion": "2024-05-01-Preview",
            "name": "[toLower(parameters('fleetName'))]",
            "location": "[parameters('location')]",
            "properties": {
                "vmSizesProfile": [
                    {
                        "name": "Standard_F2s_v2"
                    },
                    {
                        "name": "Standard_DS1_v2"
                    },
                    {
                        "name": "Standard_DS2_v2"
                    }
                ],
                "spotPriorityProfile": {
                    "capacity": 10,
                    "evictionPolicy": "Delete",
                    "allocationStrategy": "CapacityOptimized",
                    "maintain": false
                },
                "regularPriorityProfile": {
                    "capacity": 50,
                    "minCapacity": 30,
                    "allocationStrategy": "LowestPrice"
                },
                "computeProfile": {
                    "platformFaultDomainCount": 1,
                    "computeApiVersion": "2024-03-01",
                    "baseVirtualMachineProfile": {
                        "storageProfile": {
                            "osDisk": {
                                "osType": "Windows",
                                "createOption": "fromImage",
                                "caching": "ReadWrite",
                                "managedDisk": {
                                    "storageAccountType": "Standard_LRS"
                                }
                            },
                            "imageReference": "[variables('imageReference')]"
                        },
                        "osProfile": {
                            "computerNamePrefix": "[parameters('fleetName')]",
                            "adminUsername": "[parameters('adminUsername')]",
                            "adminPassword": "[parameters('adminPassword')]"
                        },
                        "networkProfile": {
                            "networkApiVersion": "2022-07-01",
                            "networkInterfaceConfigurations": [
                                {
                                    "name": "[variables('vnName')]",
                                    "properties": {
                                        "primary": true,
                                        "enableIPForwarding": true,
                                        "enableAcceleratedNetworking": false,
                                        "ipConfigurations": [
                                            {
                                                "name": "[variables('vnName')]",
                                                "properties": {
                                                    "subnet": {
                                                        "id": "[reference(resourceId('Microsoft.Network/virtualNetworks', variables('vnName'))).subnets[0].id]"
                                                    },
                                                    "primary": true,
                                                    "applicationGatewayBackendAddressPools": [],
                                                    "loadBalancerBackendAddressPools": [
                                                        {
                                                            "id": "[format('{0}/backendAddressPools/{1}', resourceId('Microsoft.Network/loadBalancers', variables('lbName')), variables('lbName'))]"
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            "dependsOn": [
                "[resourceId('Microsoft.Network/virtualNetworks', variables('vnName'))]",
                "[resourceId('Microsoft.Network/loadBalancers', variables('lbName'))]"
            ]
        }
    ]
}
```

These resources are defined in the template:

- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks)
- [**Microsoft.Network/loadBalancers**](/azure/templates/microsoft.network/loadbalancers)


## Clean up resources

When no longer needed, you can use [az group delete](/cli/azure/group) to remove the resource group, scale set, and all related resources as follows. The `--no-wait` parameter returns control to the prompt without waiting for the operation to complete. The `--yes` parameter confirms that you wish to delete the resources without an another prompt to do so.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

## Next steps
> [!div class="nextstepaction"]
> [Create an Azure Compute Fleet with Azure portal.](quickstart-create-portal.md)
