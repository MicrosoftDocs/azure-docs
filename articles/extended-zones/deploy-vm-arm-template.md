---
title: "Deploy a virtual machine in an Extended Zone - ARM template"
description: Learn how to deploy a virtual machine in an Azure Extended Zone using an Azure Resource Manager template (ARM template).
author: halkazwini
ms.author: halkazwini
ms.service: azure
ms.topic: quickstart-arm  #Don't change
ms.date: 06/10/2024
ms.custom: subject-armqs

# Customer intent: As a cloud administrator, I want a quick method to deploy a virtual machine in an Azure Extended Zone.
---
  
# Quickstart: Deploy a virtual machine in an Extended Zone using an Azure Resource Manager template (ARM template) 
 
In this quickstart, you learn how to deploy a virtual machine (VM) in an Azure Extended Zone using an Azure Resource Manager template (ARM template).

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

You can also complete this quickstart using the [Azure portal](deploy-vm-portal.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure account with an active subscription.

- Bash environment in [Azure Cloud Shell](https://shell.azure.com) or the Azure CLI installed locally. To learn more about using Bash in Azure Cloud Shell, see [Azure Cloud Shell Quickstart - Bash](../cloud-shell/quickstart.md). 

	- If you choose to install and use Azure CLI locally, this article requires the Azure CLI version 2.26 or later. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). Run `az login` to sign in to Azure.

## Review the template



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

- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces)
- [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.network/networksecuritygroups)
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses)
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines)
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks)




## Related content

- [Deploy an AKS cluster in an Extended Zone](deploy-aks-cluster.md)
- [Deploy a storage account in an Extended Zone](create-storage-account.md)
- [Frequently asked questions](faq.md)
