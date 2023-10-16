---

title: Prerequisites for Using Azure Operator Service Manager as Virtual Network Function (VNF)
description: Use this Quickstart to install and configure the necessary prerequisites for Azure Operator Service Manager as Virtual Network Function (VNF)
author: sherrygonz
ms.author: sherryg
ms.service: azure-operator-service-manager
ms.topic: quickstart
ms.date: 09/11/2023
---

# Quickstart: Complete the prerequisites to deploy a Virtualized Network Function in Azure Operator Service Manager

Before you begin using Azure Operator Service Manager, ensure you have registered the required resource providers and installed the necessary tools to interact with the service.

## Prerequisites

Contact your Microsoft account team to register your Azure subscription for access to Azure Operator Service Manager (AOSM) or express your interest through the [partner registration form](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR7lMzG3q6a5Hta4AIflS-llUMlNRVVZFS00xOUNRM01DNkhENURXU1o2TS4u).

## Download and install Azure CLI

You can use the Bash environment in Azure Cloud Shell. For more information, see [Quickstart for Bash in Azure Cloud Shell](../cloud-shell/quickstart.md).

If you prefer to run CLI reference commands locally, install the Azure CLI using [How to install the Azure CLI](/cli/azure/install-azure-cli).

If you're machine runs on Windows or macOS, consider running Azure CLI in a Docker container. For more information, see [How to run the Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker).

For local installation, sign into Azure CLI using the `az login`  command.

To finish the authentication process, follow the steps displayed in your terminal. For other sign in options, see [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

## Sign in with Azure CLI

To sign in with Azure CLI, issue the following command.

```azurecli
az login
```

## Select subscription

To change the active subscription using the subscription ID, issue the following command.

```azurecli
 change the active subscription using the subscription ID
az account set --subscription "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```
## Install Azure Operator Service Manager (AOSM) CLI extension

To install the Azure Operator Service Manager CLI extension, issue the following command.

```azurecli
az extension add --name aosm
```

Run `az version` to determine the version and dependent libraries installed. Upgrade to the latest version by issuing command `az upgrade`.

## Register required resource providers

Prior to using the Azure Operator Service Manager you must first register the required resource providers by executing these commands. The registration process could take up to 5 minutes.

```azurecli
# Register Resource Provider
az provider register --namespace Microsoft.HybridNetwork
az provider register --namespace Microsoft.ContainerRegistry
```
## Verify registration status

To verify the registration status of the resource providers, you can run the following commands:

```azurecli
# Query the Resource Provider
az provider show -n Microsoft.HybridNetwork --query "{RegistrationState: registrationState, ProviderName: namespace}"
az provider show -n Microsoft.ContainerRegistry --query "{RegistrationState: registrationState, ProviderName: namespace}"
```

> [!NOTE]
> It can take a few minutes for the resource provider registration to complete. Once the registration is successful, you can begin using the Network Function Manager (NFM) or Azure Operator Service Manager.

## Virtual Network Function (VNF) requirements

### Download and extract Ubuntu image

If you already possess the Ubuntu image accessible through a SAS URL in Azure blob storage, you can save time by omitting this step. Keep in mind that the Ubuntu image is sizable, around 650 MB, so the transfer process can take a while.

```bash
# Download the Ubuntu image
wget https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64-azure.vhd.tar.gz

# Extract the downloaded image
tar -xzvf jammy-server-cloudimg-amd64-azure.vhd.tar.gz
```

### Virtual Machine (VM) ARM template


The following sample ARM template for Ubuntu Virtual Machine (VM) is used in this quickstart.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "metadata": {
    "_generator": {
      "name": "bicep",
      "version": "0.21.1.54444",
      "templateHash": "2626436546580286549"
    }
  },
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "subnetName": {
      "type": "string"
    },
    "ubuntuVmName": {
      "type": "string",
      "defaultValue": "ubuntu-vm"
    },
    "virtualNetworkId": {
      "type": "string"
    },
    "sshPublicKeyAdmin": {
      "type": "string"
    },
    "imageName": {
      "type": "string"
    }
  },
  "variables": {
    "imageResourceGroup": "[resourceGroup().name]",
    "subscriptionId": "[subscription().subscriptionId]",
    "vmSizeSku": "Standard_D2s_v3"
  },
  "resources": [
    {
      "type": "Microsoft.Network/networkInterfaces",
      "apiVersion": "2021-05-01",
      "name": "[format('{0}_nic', parameters('ubuntuVmName'))]",
      "location": "[parameters('location')]",
      "properties": {
        "ipConfigurations": [
          {
            "name": "ipconfig1",
            "properties": {
              "subnet": {
                "id": "[format('{0}/subnets/{1}', parameters('virtualNetworkId'), parameters('subnetName'))]"
              },
              "primary": true,
              "privateIPAddressVersion": "IPv4"
            }
          }
        ]
      }
    },
    {
      "type": "Microsoft.Compute/virtualMachines",
      "apiVersion": "2021-07-01",
      "name": "[parameters('ubuntuVmName')]",
      "location": "[parameters('location')]",
      "properties": {
        "hardwareProfile": {
          "vmSize": "[variables('vmSizeSku')]"
        },
        "storageProfile": {
          "imageReference": {
            "id": "[extensionResourceId(format('/subscriptions/{0}/resourceGroups/{1}', variables('subscriptionId'), variables('imageResourceGroup')), 'Microsoft.Compute/images', parameters('imageName'))]"
          },
          "osDisk": {
            "osType": "Linux",
            "name": "[format('{0}_disk', parameters('ubuntuVmName'))]",
            "createOption": "FromImage",
            "caching": "ReadWrite",
            "writeAcceleratorEnabled": false,
            "managedDisk": "[json('{\"storageAccountType\": \"Premium_LRS\"}')]",
            "deleteOption": "Delete",
            "diskSizeGB": 30
          }
        },
        "osProfile": {
          "computerName": "[parameters('ubuntuVmName')]",
          "adminUsername": "azureuser",
          "linuxConfiguration": {
            "disablePasswordAuthentication": true,
            "ssh": {
              "publicKeys": [
                {
                  "path": "/home/azureuser/.ssh/authorized_keys",
                  "keyData": "[parameters('sshPublicKeyAdmin')]"
                }
              ]
            },
            "provisionVMAgent": true,
            "patchSettings": {
              "patchMode": "ImageDefault",
              "assessmentMode": "ImageDefault"
            }
          },
          "secrets": [],
          "allowExtensionOperations": true
        },
        "networkProfile": {
          "networkInterfaces": [
            {
              "id": "[resourceId('Microsoft.Network/networkInterfaces', format('{0}_nic', parameters('ubuntuVmName')))]"
            }
          ]
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.Network/networkInterfaces', format('{0}_nic', parameters('ubuntuVmName')))]"
      ]
    }
  ]
}
```

Save the preceding json file as *ubuntu-template.json* on your local machine.


## Next steps

- [Quickstart: Publish Ubuntu Virtual Machine (VM) as Virtual Network Function (VNF)](quickstart-publish-virtualized-network-function-definition.md)
