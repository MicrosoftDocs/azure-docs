---
title: Create an Azure Operator Nexus virtual machine by using Azure CLI
description: Learn how to create an Azure Operator Nexus virtual machine (VM) for virtual network function (VNF) workloads
author: dramasamy
ms.author: dramasamy
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 07/10/2023
ms.custom: template-how-to-pattern, devx-track-azurecli
---

# Quickstart: Create an Azure Operator Nexus virtual machine by using Azure CLI

* Deploy an Azure Nexus virtual machine using Azure CLI

This quick-start guide is designed to help you get started with using Nexus virtual machines to host virtual network functions (VNFs). By following the steps outlined in this guide, you're able to quickly and easily create a customized Nexus virtual machine that meets your specific needs and requirements. Whether you're a beginner or an expert in Nexus networking, this guide is here to help. You learn everything you need to know to create and customize Nexus virtual machines for hosting virtual network functions.

## Before you begin

[!INCLUDE [virtual-machine-prereq](./includes/virtual-machine/quickstart-prereq.md)]
* Complete the [prerequisites](./quickstarts-tenant-workload-prerequisites.md) for deploying a Nexus virtual machine.

## Create a Nexus virtual machine

The following example creates a virtual machine named *myNexusVirtualMachine* in resource group *myResourceGroup* in the *eastus* location.

Before you run the commands, you need to set several variables to define the configuration for your virtual machine. Here are the variables you need to set, along with some default values you can use for certain variables:

| Variable                   | Description                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------|
| LOCATION                   | The Azure region where you want to create your virtual machine.                                       |
| RESOURCE_GROUP             | The name of the Azure resource group where you want to create the virtual machine.                    |
| SUBSCRIPTION               | The ID of your Azure subscription.                                                                    |
| CUSTOM_LOCATION            | This argument specifies a custom location of the Nexus instance.                                      |
| CSN_ARM_ID                 | CSN ID is the unique identifier for the cloud services network you want to use.                       |
| L3_NETWORK_ID              | L3 Network ID is the unique identifier for the network interface to be used by the virtual machine.   |
| NETWORK_INTERFACE_NAME     | The name of the L3 network interface for the virtual machine.                                         |
| ADMIN_USERNAME             | The username for the virtual machine administrator.                                                   |
| SSH_PUBLIC_KEY             | The SSH public key that is used for secure communication with the virtual machine.                    |
| CPU_CORES                  | The number of CPU cores for the virtual machine (even number, max 44 vCPUs)                                         |
| MEMORY_SIZE                | The amount of memory (in GB, max 224 GB) for the virtual machine.                                                 |
| VM_DISK_SIZE               | The size (in GB) of the virtual machine disk.                                                         |
| VM_IMAGE                   | The URL of the virtual machine image.                                                                 |
| ACR_URL                    | The URL of the Azure Container Registry.                                                              |
| ACR_USERNAME               | The username for the Azure Container Registry.                                                        |
| ACR_PASSWORD               | The password for the Azure Container Registry.                                                        |

Once you've defined these variables, you can run the Azure CLI command to create the virtual machine. Add the ```--debug``` flag at the end to provide more detailed output for troubleshooting purposes.

To define these variables, use the following set commands and replace the example values with your preferred values. You can also use the default values for some of the variables, as shown in the following example:

```bash
# Azure parameters
RESOURCE_GROUP="myResourceGroup"
SUBSCRIPTION="<Azure subscription ID>"
CUSTOM_LOCATION="/subscriptions/<subscription_id>/resourceGroups/<managed_resource_group>/providers/microsoft.extendedlocation/customlocations/<custom-location-name>"
LOCATION="$(az group show --name $RESOURCE_GROUP --query location --subscription $SUBSCRIPTION -o tsv)"

# VM parameters
VM_NAME="myNexusVirtualMachine"

# VM credentials
ADMIN_USERNAME="azureuser"
SSH_PUBLIC_KEY="$(cat ~/.ssh/id_rsa.pub)"

# Network parameters
CSN_ARM_ID="/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.NetworkCloud/cloudServicesNetworks/<csn-name>"
L3_NETWORK_ID="/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.NetworkCloud/l3Networks/<l3Network-name>"
NETWORK_INTERFACE_NAME="mgmt0"

# VM Size parameters
CPU_CORES=4
MEMORY_SIZE=12
VM_DISK_SIZE="64"

# Virtual Machine Image parameters
VM_IMAGE="<VM image, example: myacr.azurecr.io/ubuntu:20.04>"
ACR_URL="<Azure container registry URL, example: myacr.azurecr.io>"
ACR_USERNAME="<Azure container registry username>"
ACR_PASSWORD="<Azure container registry password>"
```

> [!IMPORTANT]
> It is essential that you replace the placeholders for CUSTOM_LOCATION, CSN_ARM_ID, L3_NETWORK_ID and ACR parameters with your actual values before running these commands.

After defining these variables, you can create the virtual machine by executing the following Azure CLI command.

```bash
az networkcloud virtualmachine create \
    --name "$VM_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --subscription "$SUBSCRIPTION" \
    --extended-location name="$CUSTOM_LOCATION" type="CustomLocation" \
    --location "$LOCATION" \
    --admin-username "$ADMIN_USERNAME" \
    --csn "attached-network-id=$CSN_ARM_ID" \
    --cpu-cores $CPU_CORES \
    --memory-size $MEMORY_SIZE \
    --network-attachments '[{"attachedNetworkId":"'$L3_NETWORK_ID'","ipAllocationMethod":"Dynamic","defaultGateway":"True","networkAttachmentName":"'$NETWORK_INTERFACE_NAME'"}]'\
    --storage-profile create-option="Ephemeral" delete-option="Delete" disk-size="$VM_DISK_SIZE" \
    --vm-image "$VM_IMAGE" \
    --ssh-key-values "$SSH_PUBLIC_KEY" \
    --vm-image-repository-credentials registry-url="$ACR_URL" username="$ACR_USERNAME" password="$ACR_PASSWORD"
```

After a few minutes, the command completes and returns information about the virtual machine. You've created the virtual machine. You're now ready to use them.

> [!NOTE]
> If each server has two CPU chipsets and each CPU chip has 28 cores, then with hyperthreading enabled (default), the CPU chip supports 56 vCPUs. With 8 vCPUs in each chip reserved for infrastructure (OS and agents), the remaining 48 are available for tenant workloads.

## Review deployed resources

[!INCLUDE [quickstart-review-deployment-cli](./includes/virtual-machine/quickstart-review-deployment-cli.md)]

## Clean up resources

[!INCLUDE [quickstart-cleanup](./includes/virtual-machine/quickstart-cleanup-cli.md)]

## Next steps

You've successfully created a Nexus virtual machine. You can now use the virtual machine to host virtual network functions (VNFs).
