---
title: "Deploy a virtual machine in an Extended Zone - ARM template"
description: Learn how to deploy a virtual machine in an Azure Extended Zone using an Azure Resource Manager template (ARM template).
author: halkazwini
ms.author: halkazwini
ms.service: azure-extended-zones
ms.topic: quickstart-arm
ms.date: 08/02/2024
ms.custom: subject-armqs, devx-track-azurecli

# Customer intent: As a cloud administrator, I want a quick method to deploy a virtual machine in an Azure Extended Zone.
---
  
# Quickstart: Deploy a virtual machine in an Extended Zone using an Azure Resource Manager template (ARM template) 
 
> [!IMPORTANT]
> Azure Extended Zones service is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this quickstart, you learn how to deploy a virtual machine (VM) in Los Angeles Extended Zone using an Azure Resource Manager template (ARM template).

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

You can also complete this quickstart using the [Azure portal](deploy-vm-portal.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure account with an active subscription.

- Access to Los Angeles Extended Zone. For more information, see [Request access to an Azure Extended Zone](request-access.md).

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. This article requires the Azure CLI version 2.26 or higher. Run [az --version](/cli/azure/reference-index#az-version) command to find the installed version. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

## Review the template

The template that you use in this quickstart is from the [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/extended-zones-vm-create).


```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "adminUsername": {
            "type": "String",
            "metadata": {
                "description": "Username for the Virtual Machine."
            }
        },
        "adminPassword": {
            "type": "SecureString",
            "metadata": {
                "description": "Password for the Virtual Machine."
            }
        },
        "dnsLabelPrefix": {
            "type": "String",
            "metadata": {
                "description": "Unique DNS Name for the Public IP used to access the Virtual Machine."
            }
        },
        "vmSize": {
            "defaultValue": "Standard_D2s_v3",
            "type": "String",
            "metadata": {
                "description": "Size of the virtual machine."
            }
        },
        "location": {
            "defaultValue": "[resourceGroup().location]",
            "type": "String",
            "metadata": {
                "description": "Location for all resources."
            }
        },
        "EdgeZone": {
            "type": "String"
        },
        "publisher": { 
            "type": "string", 
            "defaultValue": "Canonical",
            "metadata" : {
                "description": "Publisher for the VM Image"
            }
        }, 
        "offer": { 
            "type": "string",
            "defaultValue": "UbuntuServer",
            "metadata" : {
                "description": "Offer for the VM Image"
            }
        }, 
        "sku": { 
            "type": "string",
            "defaultValue": "18.04-LTS",
            "metadata" : {
                "description": "SKU for the VM Image"
            }
        }, 
        "osVersion": { 
            "type": "string",
            "defaultValue": "latest",
            "metadata" : {
                "description": "version for the VM Image"
            }
        },
        "vmName": {
            "defaultValue": "myEdgeVM",
            "type": "String",
            "metadata": {
                "description": "VM Name."
            }
        }
    },
    "variables": {
        "nicName": "myEdgeVMNic",
        "addressPrefix": "10.0.0.0/16",
        "subnetName": "Subnet",
        "subnetPrefix": "10.0.0.0/24",
        "publicIPAddressName": "myEdgePublicIP",
        "virtualNetworkName": "MyEdgeVNET",
        "subnetRef": "[resourceId('Microsoft.Network/virtualNetworks/subnets', variables('virtualNetworkName'), variables('subnetName'))]",
        "networkSecurityGroupName": "default-NSG"
    },
    "resources": [
        {
            "type": "Microsoft.Network/publicIPAddresses",
            "apiVersion": "2018-11-01",
            "name": "[variables('publicIPAddressName')]",
            "location": "[parameters('location')]",
            "extendedLocation": {
                "type": "EdgeZone",
                "name": "[parameters('EdgeZone')]"
            },
            "sku": {
                "name": "Standard"
            },
            "properties": {
                "publicIPAllocationMethod": "Static",
                "dnsSettings": {
                    "domainNameLabel": "[parameters('dnsLabelPrefix')]"
                }
            }
        },
        {
            "type": "Microsoft.Network/networkSecurityGroups",
            "apiVersion": "2019-08-01",
            "name": "[variables('networkSecurityGroupName')]",
            "location": "[parameters('location')]",
            "properties": {
                "securityRules": [
                   {
                        "name": "AllowHttps",
                        "properties": {
                            "description": "HTTPS is allowed",
                            "protocol": "*",
                            "sourcePortRange": "*",
                            "destinationPortRange": "443",
                            "sourceAddressPrefix": "*",
                            "destinationAddressPrefix": "*",
                            "access": "Allow",
                            "priority": 130,
                            "direction": "Inbound",
                            "sourcePortRanges": [],
                            "destinationPortRanges": [],
                            "sourceAddressPrefixes": [],
                            "destinationAddressPrefixes": []
                         }
                    },
                    { 
                        "name": "AllowSSH",
                        "properties": {
                            "description": "HTTPS is allowed",
                            "protocol": "*",
                            "sourcePortRange": "*",
                            "destinationPortRange": "22",
                            "sourceAddressPrefix": "*",
                            "destinationAddressPrefix": "*",
                            "access": "Allow",
                            "priority": 140,
                            "direction": "Inbound",
                            "sourcePortRanges": [],
                            "destinationPortRanges": [],
                            "sourceAddressPrefixes": [],
                            "destinationAddressPrefixes": []
                         }
                    }
                ]
            }
        },
        {
            "type": "Microsoft.Network/virtualNetworks",
            "apiVersion": "2018-11-01",
            "name": "[variables('virtualNetworkName')]",
            "location": "[parameters('location')]",
            "extendedLocation": {
                "type": "EdgeZone",
                "name": "[parameters('EdgeZone')]"
            },
            "dependsOn": [
                "[resourceId('Microsoft.Network/networkSecurityGroups', variables('networkSecurityGroupName'))]"
            ],
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
                            "addressPrefix": "[variables('subnetPrefix')]",
                            "networkSecurityGroup": {
                                "id": "[resourceId('Microsoft.Network/networkSecurityGroups', variables('networkSecurityGroupName'))]"
                             }
                        }
                    }
                ]
            }
        },
        {
            "type": "Microsoft.Network/networkInterfaces",
            "apiVersion": "2018-11-01",
            "name": "[variables('nicName')]",
            "location": "[parameters('location')]",
            "extendedLocation": {
                "type": "EdgeZone",
                "name": "[parameters('EdgeZone')]"
            },
            "dependsOn": [
                "[resourceId('Microsoft.Network/publicIPAddresses/', variables('publicIPAddressName'))]",
                "[resourceId('Microsoft.Network/virtualNetworks/', variables('virtualNetworkName'))]"
            ],
            "properties": {
                "ipConfigurations": [
                    {
                        "name": "ipconfig1",
                        "properties": {
                            "privateIPAllocationMethod": "Dynamic",
                            "publicIPAddress": {
                                "id": "[resourceId('Microsoft.Network/publicIPAddresses',variables('publicIPAddressName'))]"
                            },
                            "subnet": {
                                "id": "[variables('subnetRef')]"
                            }
                        }
                    }
                ]
            }
        },
        {
            "type": "Microsoft.Compute/virtualMachines",
            "apiVersion": "2020-06-01",
            "name": "[parameters('vmName')]",
            "location": "[parameters('location')]",
            "extendedLocation": {
                "type": "EdgeZone",
                "name": "[parameters('EdgeZone')]"
            },
            "dependsOn": [
                "[resourceId('Microsoft.Network/networkInterfaces/', variables('nicName'))]"
            ],
            "properties": {
                "hardwareProfile": {
                    "vmSize": "[parameters('vmSize')]"
                },
                "osProfile": {
                    "computerName": "[parameters('vmName')]",
                    "adminUsername": "[parameters('adminUsername')]",
                    "adminPassword": "[parameters('adminPassword')]"
                },
                "storageProfile": {
                    "imageReference": {
                        "publisher": "[parameters('publisher')]",
                        "offer": "[parameters('offer')]",
                        "sku": "[parameters('sku')]",
                        "version": "[parameters('osVersion')]"
                    },
                    "osDisk": {
                        "createOption": "FromImage",
                        "managedDisk": {
                            "storageAccountType": "StandardSSD_LRS"
                        }
                    }
                },
                "networkProfile": {
                    "networkInterfaces": [
                        {
                            "id": "[resourceId('Microsoft.Network/networkInterfaces',variables('nicName'))]"
                        }
                    ]
                }
            }
        }
    ],
    "outputs": {
        "hostname": {
            "type": "String",
            "value": "[reference(variables('publicIPAddressName')).dnsSettings.fqdn]"
        },
        "sshCommand": {
            "type": "string",
            "value": "[format('ssh {0}@{1}', parameters('adminUsername'), reference(resourceId('Microsoft.Network/publicIPAddresses', variables('publicIPAddressName'))).dnsSettings.fqdn)]"
        }
    }
}

```
Multiple Azure resources are defined in the template:

- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces?pivots=deployment-language-arm-template)
- [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.network/networksecuritygroups?pivots=deployment-language-arm-template)
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses?pivots=deployment-language-arm-template)
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines?pivots=deployment-language-arm-template)
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks?pivots=deployment-language-arm-template)

> [!NOTE]
> Default outbound access is not available to VMs in Azure Extended Zones. For more information, see [Default outbound access in Azure](../virtual-network/ip-services/default-outbound-access.md).


## Deploy the template

1. Create a resource group using the [az group create](/cli/azure/group#az_group_create) command.

    ```azurecli-interactive
    az group create --name 'myResourceGroup' --location '<location>' 
    ```

    > [!NOTE]
    > Each Azure Extended Zone site is associated with an Azure region. Based on the Azure Extended Zone location where the resource needs to be deployed, select the appropriate region value for the `location` parameter.

2. deploy the template using [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create) command.

    ```azurecli-interactive
    az deployment group create --resource-group 'myResourceGroup' --template-uri 'https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/extended-zones-vm-create/azuredeploy.json'
    ```

## Clean up resources

When no longer needed, delete **myResourceGroup** resource group and all of the resources it contains using the [az group delete](/cli/azure/group#az-group-delete) command.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Related content

- [Deploy an AKS cluster in an Extended Zone](deploy-aks-cluster.md)
- [Deploy a storage account in an Extended Zone](create-storage-account.md)
- [Frequently asked questions](faq.md)
