---

title: Deploy a VM at an Azure public MEC using an ARM template
description: Learn how to deploy a VM in Azure public MEC using an ARM template
author: reemas-new
ms.author: reemas
ms.topic: quickstart
ms.service: public-multi-access-edge-compute-mec
ms.date: 02/14/2022

---

# QuickStart: Deploy a VM in Azure public MEC using an ARM template

In this quickstart, you'll learn how to use an Azure Resource Manager template (ARM template) to deploy an Ubuntu Linux virtual machine (VM) in Azure Public MEC.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

An [ARM
template](../azure-resource-manager/templates/overview.md)
is a JavaScript Object Notation (JSON) file that defines the
infrastructure and configuration for your project. The template uses
declarative syntax. In declarative syntax, you describe your intended
deployment without writing the sequence of programming commands to
create the deployment.

## Prerequisites

1. An Azure account with an allowlisted subscription, which allows you to deploy resources in the Azure Public MEC. If you don't have an active allowed subscription, contact the [Azure public MEC product team](https://aka.ms/azurepublicmec) to help with it.
2. [Install Azure CLI](/cli/azure/install-azure-cli?).

> [!NOTE]
> Azure public MEC deployments are supported in Azure CLI v2.26 onwards.

## Review the template

All the resources deployed in Azure public MEC have an extra attribute
called "extendedLocation" that is added to the Resource Provider. The
ARM Template below provides an example by deploying the following
resources:

1. Virtual Network
2. Public IP address
3. Network Interface
4. Network Security Group
5. Virtual Machine

Notice that the Edge Zone ID used in the template below is different from
the display name of the Azure Public MEC.

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

> [!NOTE]
> The Network Security Group has an inbound rule that allow SSH and HTTPS access from everywhere.

## Deploy using the Azure CLI

1. Save the above contents in a file named "edgeZonesDeploy.json"

1. Sign in to Azure and set Azure Subscription.

    ```azurecli
    az login                                
    az account set -s \<subscription name\>
    ```

1. Create a resource group.

    > [!NOTE]
    > Each Azure public MEC site is associated to an Azure Region. Based on the Azure public MEC location where the resource needs to be deployed, select the appropriate value for the location field in the below command. The mapping can be obtained[here](tbd.md).

    ```azurecli
      az group create \--name myResourceGroup \--location \<location\>
    ```

1. Deploy the ARM template in the Resource Group.

    ```azurecli
    az deployment group create -g myResourceGroup --template-file edgeZonesDeploy.json
    Please provide string value for 'adminUsername' (? for help): <username>
    Please provide securestring value for 'adminPassword' (? for help): <password>
    Please provide string value for 'dnsLabelPrefix' (? for help): <uniqueDnsLabel>
    Please provide string value for 'EdgeZone' (? for help): <edge zone ID>
    ```

1. The deployment will take a few minutes to run and you should be able
    to see the resources in the "myResourceGroup" Resource Group. Here's a sample output after the command execution is complete:

    ```
    { 
    "id": "/subscriptions/xxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.Resources/deployments/edgeZonesDeploy",
      "location": null,
      "name": "edgeZonesDeploy",
      "properties": {
        "correlationId": "<xxxxxxxx>",
        "debugSetting": null,
        "dependencies": [
          {
            "dependsOn": [
              {
                "id": "/subscriptions/xxxxx/resourceGroups/myResourceGroup /providers/Microsoft.Network/networkSecurityGroups/default-NSG",
                "resourceGroup": " myResourceGroup ",
                "resourceName": "default-NSG",
                "resourceType": "Microsoft.Network/networkSecurityGroups"
              }
            ],
            "id": "/subscriptions/xxxxxx/resourceGroups/ myResourceGroup /providers/Microsoft.Network/virtualNetworks/MyEdgeTestVnet",
            "resourceGroup": " myResourceGroup ",
            "resourceName": " MyEdgeTestVnet ",
            "resourceType": "Microsoft.Network/virtualNetworks"
          },
     "outputs": {
          "hostname": {
            "type": "String",
            "value": "xxxxx.cloudapp.azure.com"
          },
          "sshCommand": {
            "type": "String",
            "value": "ssh <adminUsername>@<publicIPFQDN>"
          }
        },
    ...
    }
    ```

## Access the virtual machine

To SSH into the virtual machine in the Azure public MEC, we recommend
deploying a jump box in an Azure parent region. You can follow the steps
to [create a virtual machine in a
region,](../virtual-machines/linux/quick-create-template.md)
and SSH to the Jump box virtual machine deployed in the region. From the
jump box you can then SSH to the virtual machine created in the Azure
public MEC.

```azurecli
ssh  <username>@<regionVM_publicIP>
    
//One logged into the VM in the region, SSH into the VM in the Azure public MEC
    
ssh <username>@<edgezoneVM_publicIP>
```

## Clean up resources

When no longer needed, you can use [az group
delete](/cli/azure/group?) to remove the resource group, scale set, and all related resources as follows. The `\--yes` parameter confirms that you wish to delete the resources without an additional prompt to do so.

```azurecli
az group delete \--name myResourceGroup \--yes
```

## Next steps

> [!div class="nextstepaction"]
> [Create a VM using CLI](quickstart-create-vm-cli.md)
