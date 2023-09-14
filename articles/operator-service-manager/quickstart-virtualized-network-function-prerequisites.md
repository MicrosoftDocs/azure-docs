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

## Register required resource providers

Prior to using the Network Function Manager (NFM) or the Azure Operator Service Manager you must first register the required resource providers by executing these commands. The registration process could take up to 5 minutes.

```azurecli
# Register Resource Provider
az provider register --namespace Microsoft.HybridNetwork
az provider register --namespace Microsoft.ContainerRegistry
az provider register –-namespace Microsoft.HybridNetwork/MsiForResourceEnabled
``````
## Verify registration status

To verify the registration status of the resource providers, you can run the following commands:

```azurecli
# Query the Resource Provider
az provider show -n Microsoft.HybridNetwork --query "{RegistrationState: registrationState, ProviderName: namespace}"
az provider show -n Microsoft.ContainerRegistry --query "{RegistrationState: registrationState, ProviderName: namespace}"
``````

> [!NOTE]
> It may take a few minutes for the resource provider registration to complete. Once the registration is successful, you can begin using the Network Function Manager (NFM) or Azure Operator Service Manager.

## Download and install Azure CLI

You can use the Bash environment in Azure Cloud Shell. For more information, see [Quickstart for Bash in Azure Cloud Shell](../cloud-shell/quickstart.md).

If you prefer to run CLI reference commands locally, install the Azure CLI using [How to install the Azure CLI](/cli/azure/install-azure-cli).

If you're machine runs on Windows or macOS, consider running Azure CLI in a Docker container. For more information, see [How to run the Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker).

For local installation, sign into Azure CLI using the `az login`  command. For more information and examples, see [az login](/cli/azure/reference-index?view=azure-cli-latest).

To finish the authentication process, follow the steps displayed in your terminal. For other sign in options, see [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

To install the Azure Operator Service Manager CLI extension, issue the following command.

```azurecli
az extension add --name aosm
``````
Run `az version` to determine the version and dependent libraries installed. Upgrade to the latest version by issuing command `az upgrade`.

## Virtual Network Function (VNF) requirements

### Download and extract Ubuntu image

If you already possess the Ubuntu image accessible through a SAS URL in Azure blob storage, you can save time by omitting this step. Keep in mind that the Ubuntu image is sizable, around 30 GB, so the transfer process may take a while.

```bash
# Download the Ubuntu image
wget https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64-azure.vhd.tar.gz

# Extract the downloaded image
tar -xzvf jammy-server-cloudimg-amd64-azure.vhd.tar.gz
``````

### Convert Virtual Machine (VM) template

Now convert the Virtual Machine (VM) bicep template into an ARM template.

The following sample Ubuntu Virtual Machine (VM) bicep is used in this quickstart.

```json
param location string = resourceGroup().location
param subnetName string
param ubuntuVmName string = 'ubuntu-vm'
param virtualNetworkId string
param sshPublicKeyAdmin string
param imageName string

var imageResourceGroup = resourceGroup().name
var subscriptionId = subscription().subscriptionId
var vmSizeSku = 'Standard_D2s_v3'

// Create the management nic
resource ubuntuVmName_nic 'Microsoft.Network/networkInterfaces@2021-05-01' = {
  name: '${ubuntuVmName}_nic'
  location: location
  properties: {
    ipConfigurations: [
      {
        name: 'ipconfig1'
        properties: {
          subnet: {
            id: '${virtualNetworkId}/subnets/${subnetName}'
          }
          primary: true
          privateIPAddressVersion: 'IPv4'
        }
      }
    ]
  }
}

resource ubuntuVmVirtualMachine 'Microsoft.Compute/virtualMachines@2021-07-01' = {
  name: ubuntuVmName
  location: location
  properties: {
    hardwareProfile: {
      vmSize: vmSizeSku
    }
    storageProfile: {
      imageReference: {
        id: extensionResourceId('/subscriptions/${subscriptionId}/resourceGroups/${imageResourceGroup}', 'Microsoft.Compute/images', imageName)
      }
      osDisk: {
        osType: 'Linux'
        name: '${ubuntuVmName}_disk'
        createOption: 'FromImage'
        caching: 'ReadWrite'
        writeAcceleratorEnabled: false
        managedDisk: json('{"storageAccountType": "Premium_LRS"}')
        deleteOption: 'Delete'
        diskSizeGB: 30
      }
    }
    osProfile: {
      computerName: ubuntuVmName
      adminUsername: 'azureuser'
      linuxConfiguration: {
        disablePasswordAuthentication: true
        ssh: {
          publicKeys: [
            {
              path: '/home/azureuser/.ssh/authorized_keys'
              keyData: sshPublicKeyAdmin
            }
          ]
        }
        provisionVMAgent: true
        patchSettings: {
          patchMode: 'ImageDefault'
          assessmentMode: 'ImageDefault'
        }
      }
      secrets: []
      allowExtensionOperations: true
    }
    networkProfile: {
      networkInterfaces: [
        {
          id: ubuntuVmName_nic.id
        }
      ]
    }
  }
}
``````

Save the preceding Json file as ubuntu-template-bicep on your local machine.

Convert the Virtual Machine (VM) bicep template into an ARM template using the following command.

```azurecli
az bicep build -f ubuntu-template.bicep --outfile ubuntu-template.json
``````

## Next steps

- [Quickstart: Publish Ubuntu Virtual Machine (VM) as Virtual Network Function (VNF)](quickstart-publish-virtualized-network-function-definition.md)

