---
title: Create an Azure Operator Nexus virtual machine by using Azure PowerShell
description: Learn how to create an Azure Operator Nexus virtual machine (VM) for virtual network function (VNF) workloads using PowerShell
author: rashirg
ms.author: rajeshwarig
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 09/20/2023
ms.custom: template-how-to-pattern, devx-track-azurepowershell
---

# Quickstart: Create an Azure Operator Nexus virtual machine by using Azure PowerShell

* Deploy an Azure Nexus virtual machine using Azure PowerShell

This quick-start guide is designed to help you get started with using Nexus virtual machines to host virtual network functions (VNFs). By following the steps outlined in this guide, you're able to quickly and easily create a customized Nexus virtual machine that meets your specific needs and requirements. Whether you're a beginner or an expert in Nexus networking, this guide is here to help. You learn everything you need to know to create and customize Nexus virtual machines for hosting virtual network functions.

## Before you begin

[!INCLUDE [virtual-machine-prereq](./includes/virtual-machine/quickstart-prereq-ps.md)]
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
| CPU_CORES                  | The number of CPU cores for the virtual machine (even number, max 46 vCPUs)                                         |
| MEMORY_SIZE                | The amount of memory (in GB, max 224 GB) for the virtual machine.                                                 |
| VM_DISK_SIZE               | The size (in GB) of the virtual machine disk.                                                         |
| VM_IMAGE                   | The URL of the virtual machine image.                                                                 |
| ACR_URL                    | The URL of the Azure Container Registry.                                                              |
| ACR_USERNAME               | The username for the Azure Container Registry.                                                        |
| ACR_PASSWORD               | The password for the Azure Container Registry.                                                        |
| VMDEVICEMODEL            | The VMDeviceModel defaults to T2, available options T2(Modern) and T1(Transitional).     |
| USERDATA                 | The base64 encoded string of cloud-init userdata.                                                       |
| BOOTMETHOD                 | The Method used to boot the virutalmachine UEFI or BIOS.    |
| OS_DISK_CREATE_OPTION       | The OS disk create specifies ephemeral disk option.    |
| OS_DISK_DELETE_OPTION       | The OS disk delete specifies delete disk option.   |
| IP_AllOCATION_METHOD        | The IpAllocationMethod valid for L3Networks specify Dynamic or Static or Disabled.    |
| NETWORKATTACHMENTNAME            | The name of the Network to attach for workload.      |
| NETWORKDATA            | The base64 encoded string of cloud-init network data.      |

Once you've defined these variables, you can run the Azure PowerShell command to create the virtual machine. Add the ```-Debug``` flag at the end to provide more detailed output for troubleshooting purposes.

To define these variables, use the following set commands and replace the example values with your preferred values. You can also use the default values for some of the variables, as shown in the following example:

```azurepowershell-interactive
# Azure parameters
$RESOURCE_GROUP="myResourceGroup"
$SUBSCRIPTION="<Azure subscription ID>"
$CUSTOM_LOCATION="/subscriptions/<subscription_id>/resourceGroups/<managed_resource_group>/providers/microsoft.extendedlocation/customlocations/<custom-location-name>"
$CUSTOM_LOCATION_TYPE="CustomLocation"
$LOCATION="<ClusterAzureRegion>"

# VM parameters
$VM_NAME="myNexusVirtualMachine"
$BOOT_METHOD="UEFI"
$OS_DISK_CREATE_OPTION="Ephemeral"
$OS_DISK_DELETE_OPTION="Delete"
$NETWORKDATA="bmV0d29ya0RhdGVTYW1wbGU="
$VMDEVICEMODEL="T2"
$USERDATA=""

# VM credentials
$ADMIN_USERNAME="admin"
$SSH_PUBLIC_KEY = @{
    KeyData = "$(cat ~/.ssh/id_rsa.pub)"
}

# Network parameters
$CSN_ARM_ID="/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.NetworkCloud/cloudServicesNetworks/<csn-name>"
$L3_NETWORK_ID="/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.NetworkCloud/l3Networks/<l3Network-name>"
$IP_AllOCATION_METHOD="Dynamic"
$CSN_ATTACHMENT_DEFAULTGATEWAY="False"
$CSN_ATTACHMENT_NAME="<l3Network-name>"
$ISOLATE_EMULATOR_THREAD="True"
$VIRTIOINTERFACE="Modern"
$NETWORKATTACHMENTNAME="mgmt0"

# VM Size parameters
$CPU_CORES=4
$MEMORY_SIZE=12
$VM_DISK_SIZE="64"

# Virtual Machine Image parameters
$VM_IMAGE="<VM image, example: myacr.azurecr.io/ubuntu:20.04>"
$ACR_URL="<Azure container registry URL, example: myacr.azurecr.io>"
$ACR_USERNAME="<Azure container registry username>"

$NETWORKATTACHMENT = New-AzNetworkCloudNetworkAttachmentObject `
-AttachedNetworkId $L3_NETWORK_ID `
-IpAllocationMethod $IP_AllOCATION_METHOD `
-DefaultGateway "True" `
-Name $NETWORKATTACHMENTNAME

$SECUREPASSWORD = ConvertTo-SecureString "<YourPassword>" -asplaintext -force
```

> [!IMPORTANT]
> It is essential that you replace the placeholders for CUSTOM_LOCATION, CSN_ARM_ID, L3_NETWORK_ID and ACR parameters with your actual values before running these commands.

After defining these variables, you can create the virtual machine by executing the following Azure PowerShell command.

```azurepowershell-interactive
New-AzNetworkCloudVirtualMachine -Name $VM_NAME `
-ResourceGroupName $RESOURCE_GROUP `
-AdminUsername $ADMIN_USERNAME `
-CloudServiceNetworkAttachmentAttachedNetworkId $CSN_ARM_ID `
-CloudServiceNetworkAttachmentIPAllocationMethod $IP_AllOCATION_METHOD `
-CpuCore $CPU_CORES `
-ExtendedLocationName $CUSTOM_LOCATION `
-ExtendedLocationType $CUSTOM_LOCATION_TYPE `
-Location $LOCATION `
-SubscriptionId $SUBSCRIPTION `
-MemorySizeGb $MEMORY_SIZE `
-OSDiskSizeGb $VM_DISK_SIZE `
-VMImage $VM_IMAGE `
-BootMethod $BOOT_METHOD `
-CloudServiceNetworkAttachmentDefaultGateway $CSN_ATTACHMENT_DEFAULTGATEWAY `
-CloudServiceNetworkAttachmentName $CSN_ATTACHMENT_NAME `
-IsolateEmulatorThread $ISOLATE_EMULATOR_THREAD `
-NetworkAttachment $NETWORKATTACHMENT `
-NetworkData $NETWORKDATA `
-OSDiskCreateOption $OS_DISK_CREATE_OPTION `
-OSDiskDeleteOption $OS_DISK_DELETE_OPTION `
-SshPublicKey $SSH_PUBLIC_KEY `
-UserData $USERDATA `
-VMDeviceModel $VMDEVICEMODEL `
-VMImageRepositoryCredentialsUsername $ACR_USERNAME `
-VMImageRepositoryCredentialsPassword $SECUREPASSWORD `
-VMImageRepositoryCredentialsRegistryUrl $ACR_URL
```

After a few minutes, the command completes and returns information about the virtual machine. You've created the virtual machine. You're now ready to use them.

> [!NOTE]
> If each server has two CPU chipsets and each CPU chip has 28 cores, then with hyperthreading enabled (default), the CPU chip supports 56 vCPUs. With 8 vCPUs in each chip reserved for infrastructure (OS and agents), the remaining 48 are available for tenant workloads.

## Review deployed resources

[!INCLUDE [quickstart-review-deployment-poweshell](./includes/virtual-machine/quickstart-review-deployment-ps.md)]

## Clean up resources

[!INCLUDE [quickstart-cleanup](./includes/virtual-machine/quickstart-cleanup-ps.md)]

## Next steps

You've successfully created a Nexus virtual machine. You can now use the virtual machine to host virtual network functions (VNFs).
