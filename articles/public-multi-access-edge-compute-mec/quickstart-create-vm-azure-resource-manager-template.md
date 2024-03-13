---
title: 'Quickstart: Deploy a virtual machine in Azure public MEC using an ARM template'
description: In this quickstart, learn how to deploy a virtual machine in Azure public multi-access edge compute (MEC) by using an Azure Resource Manager template.
author: kunaltelang
ms.author: monikama
ms.service: public-multi-access-edge-compute-mec
ms.topic: quickstart
ms.date: 11/22/2022
ms.custom: template-quickstart, devx-track-azurecli, devx-track-arm-template
---

# Quickstart: Deploy a virtual machine in Azure public MEC using an ARM template

In this quickstart, you learn how to use an Azure Resource Manager (ARM) template to deploy an Ubuntu Linux virtual machine (VM) in Azure public multi-access edge compute (MEC).

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- Add an allowlisted subscription to your Azure account, which allows you to deploy resources in Azure public MEC. If you don't have an active allowed subscription, contact the [Azure public MEC product team](https://aka.ms/azurepublicmec).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

   > [!NOTE]
   > Azure public MEC deployments are supported in Azure CLI versions 2.26 and later.

## Review the template

1. Review the following example ARM template.

   Every resource you deploy in Azure public MEC has an extra attribute named `extendedLocation`, which Azure adds to the resource provider. The example ARM template deploys these resources:

   - Virtual network
   - Public IP address
   - Network interface
   - Network security group
   - Virtual machine

   In this example ARM template:
   - The Azure Edge Zone ID is different from the display name of the Azure public MEC.
   - The Azure network security group has an inbound rule that allows SSH and HTTPS access from everywhere.

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

## Deploy the ARM template using the Azure CLI

1. Save the contents of the sample ARM template from the previous section in a file named *azurepublicmecDeploy.json*.

1. Sign in to Azure with [az login](/cli/azure/reference-index#az-login) and set the Azure subscription with [az account set](/cli/azure/account#az-account-set) command.

    ```azurecli
    az login                                
    az account set --subscription <subscription name>
    ```

1. Create an Azure resource group with the [az group create](/cli/azure/group#az-group-create) command. A resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named myResourceGroup:

    ```azurecli
    az group create --name myResourceGroup --location <location>
    ```

    > [!NOTE]
    > Each Azure public MEC site is associated with an Azure region. Based on the Azure public MEC location where the resource needs to be deployed, select the appropriate region value for the `--location` parameter. For more information, see [Key concepts for Azure public MEC](key-concepts.md).

1. Deploy the ARM template in the resource group with the [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create) command.

    ```azurecli
    az deployment group create --resource-group myResourceGroup --template-file azurepublicmecDeploy.json
    ```

    ```output
    Please provide string value for 'adminUsername' (? for help): <username>
    Please provide securestring value for 'adminPassword' (? for help): <password>
    Please provide string value for 'dnsLabelPrefix' (? for help): <uniqueDnsLabel>
    Please provide string value for 'EdgeZone' (? for help): <edge zone ID>
    ```

1. Wait a few minutes for the deployment to run.

   After the command execution is complete, you can see the new resources in the myResourceGroup resource group. Here's a sample output:

    ```output
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

To use SSH to connect to the virtual machine in the Azure public MEC, the best method is to deploy a jump box in an Azure parent region.

1. Follow the instructions in [Create a virtual machine in a region](../virtual-machines/linux/quick-create-template.md).

1. Use SSH to connect to the jump box virtual machine deployed in the region.

   ```bash
   ssh <username>@<regionVM_publicIP>
   ```

1. From the jump box, use SSH to connect to the virtual machine created in the Azure public MEC.

   ```bash
   ssh <username>@<edgezoneVM_publicIP>
   ```

## Clean up resources

In this quickstart, you deployed an ARM template in Azure public MEC by using the Azure CLI. If you don't expect to need these resources in the future, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, scale set, and all related resources. Using the `--yes` parameter deletes the resources without a confirmation prompt.

```azurecli
az group delete \--name myResourceGroup \--yes
```

## Next steps

To deploy a virtual machine in Azure public MEC using Azure CLI, advance to the following article:

> [!div class="nextstepaction"]
> [Quickstart: Deploy a virtual machine in Azure public MEC using Azure CLI](quickstart-create-vm-cli.md)
