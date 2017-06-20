---
title: Capture an Azure Linux VM to use as a template | Microsoft Docs
description: Learn how to capture and generalize an image of a Linux-based Azure virtual machine (VM) created with the Azure Resource Manager deployment model.
services: virtual-machines-linux
documentationcenter: ''
author: iainfoulds
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: e608116f-f478-41be-b787-c2ad91b5a802
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 02/09/2017
ms.author: iainfou

---
# Capture a Linux virtual machine running on Azure
Follow the steps in this article to generalize and capture your Azure Linux virtual machine (VM) in the Resource Manager deployment model. When you generalize the VM, you remove personal account information and prepare the VM to be used as an image. You then capture a generalized virtual hard disk (VHD) image for the OS, VHDs for attached data disks, and a [Resource Manager template](../../azure-resource-manager/resource-group-overview.md) for new VM deployments. This article details how to capture a VM image with the Azure CLI 1.0 for a VM using unmanaged disks. You can also [capture a VM using Azure Managed Disks with the Azure CLI 2.0](capture-image.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). Managed disks are handled by the Azure platform and do not require any preparation or location to store them. For more information, see [Azure Managed Disks overview](../../storage/storage-managed-disks-overview.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). 

To create VMs using the image, set up network resources for each new VM, and use the template (a JavaScript Object Notation, or JSON, file) to deploy it from the captured VHD images. In this way, you can replicate a VM with its current software configuration, similar to the way you use images in the Azure Marketplace.

> [!TIP]
> If you want to create a copy of your existing Linux VM with its specialized state for backup or debugging, see [Create a copy of a Linux virtual machine running on Azure](copy-vm.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). And if you want to upload a Linux VHD from an on-premises VM, see [Upload and create a Linux VM from custom disk image](upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).  

## CLI versions to complete the task
You can complete the task using one of the following CLI versions:

- [Azure CLI 1.0](#before-you-begin) – our CLI for the classic and resource management deployment models (this article)
- [Azure CLI 2.0](capture-image.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) - our next generation CLI for the resource management deployment model

## Before you begin
Ensure that you meet the following prerequisites:

* **Azure VM created in the Resource Manager deployment model** - If you haven't created a Linux VM, you can use the [portal](quick-create-portal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json), the [Azure CLI](quick-create-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json), or [Resource Manager templates](cli-deploy-templates.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). 
  
    Configure the VM as needed. For example, [add data disks](add-disk.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json), apply updates, and install applications. 
* **Azure CLI** - Install the [Azure CLI](../../cli-install-nodejs.md) on a local computer.

## Step 1: Remove the Azure Linux agent
First, run the **waagent** command with the **deprovision** parameter on the Linux VM. This command deletes files and data to make the VM ready for generalizing. For details, see the [Azure Linux Agent user guide](../windows/agent-user-guide.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

1. Connect to your Linux VM using an SSH client.
2. In the SSH window, type the following command:
   
    ```bash
    sudo waagent -deprovision+user
    ```
   > [!NOTE]
   > Only run this command on a VM that you intend to capture as an image. It does not guarantee that the image is cleared of all sensitive information or is suitable for redistribution.
 
3. Type **y** to continue. You can add the **-force** parameter to avoid this confirmation step.
4. After the command completes, type **exit**. This step closes the SSH client.

## Step 2: Capture the VM
Use the Azure CLI to generalize and capture the VM. In the following examples, replace example parameter names with your own values. Example parameter names include **myResourceGroup**, **myVnet**, and **myVM**.

1. From your local computer, open the Azure CLI and [login to your Azure subscription](../../xplat-cli-connect.md). 
2. Make sure you are in Resource Manager mode.
   
    ```azurecli
    azure config mode arm
    ```
3. Shut down the VM that you already deprovisioned by using the following command:
   
    ```azurecli
    azure vm deallocate -g myResourceGroup -n myVM
    ```
4. Generalize the VM with the following command:
   
    ```azurecli
    azure vm generalize -g myResourceGroup -n myVM
    ```
5. Now run the **azure vm capture** command, which captures the VM. In the following example, the image VHDs are captured with names beginning with **MyVHDNamePrefix**, and the **-t** option specifies a path to the template **MyTemplate.json**. 
   
    ```azurecli
    azure vm capture -g myResourceGroup -n myVM -p myVHDNamePrefix -t myTemplate.json
    ```
   
   > [!IMPORTANT]
   > The image VHD files get created by default in the same storage account that the original VM used. Use the *same storage account* to store the VHDs for any new VMs you create from the image. 

6. To find the location of a captured image, open the JSON template in a text editor. In the **storageProfile**, find the **uri** of the **image** located in the **system** container. For example, the URI of the OS disk image is similar to `https://xxxxxxxxxxxxxx.blob.core.windows.net/system/Microsoft.Compute/Images/vhds/MyVHDNamePrefix-osDisk.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.vhd`

## Step 3: Create a VM from the captured image
Now use the image with a template to create a Linux VM. These steps show you how to use the Azure CLI and the JSON file template you captured to create the VM in a new virtual network.

### Create network resources
To use the template, you first need to set up a virtual network and NIC for your new VM. We recommend you create a resource group for these resources in the location where your VM image is stored. Run commands similar to the following, substituting names for your resources and an appropriate Azure location ("centralus" in these commands):

```azurecli
azure group create myResourceGroup1 -l "centralus"

azure network vnet create myResourceGroup1 myVnet -l "centralus"

azure network vnet subnet create myResourceGroup1 myVnet mySubnet

azure network public-ip create myResourceGroup1 myPublicIP -l "centralus"

azure network nic create myResourceGroup1 myNIC -k mySubnet -m myVnet -p myPublicIP -l "centralus"
```

### Get the Id of the NIC
To deploy a VM from the image by using the JSON you saved during capture, you need the Id of the NIC. Obtain it by running the following command:

```azurecli
azure network nic show myResourceGroup1 myNIC
```

The **Id** in the output is similar to `/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup1/providers/Microsoft.Network/networkInterfaces/myNic`

### Create a VM
Now run the following command to create your VM from the captured VM image. Use the **-f** parameter to specify the path to the template JSON file you saved.

```azurecli
azure group deployment create myResourceGroup1 MyDeployment -f MyTemplate.json
```

In the command output, you are prompted to supply a new VM name, the admin user name and password, and the Id of the NIC you created previously.

```bash
info:    Executing command group deployment create
info:    Supply values for the following parameters
vmName: myNewVM
adminUserName: myAdminuser
adminPassword: ********
networkInterfaceId: /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resource Groups/myResourceGroup1/providers/Microsoft.Network/networkInterfaces/myNic
```

The following sample shows what you see for a successful deployment:

```bash
+ Initializing template configurations and parameters
+ Creating a deployment
info:    Created template deployment xxxxxxx
+ Waiting for deployment to complete
data:    DeploymentName     : MyDeployment
data:    ResourceGroupName  : MyResourceGroup1
data:    ProvisioningState  : Succeeded
data:    Timestamp          : xxxxxxx
data:    Mode               : Incremental
data:    Name                Type          Value

data:    ------------------  ------------  -------------------------------------

data:    vmName              String        myNewVM

data:    vmSize              String        Standard_D1

data:    adminUserName       String        myAdminuser

data:    adminPassword       SecureString  undefined

data:    networkInterfaceId  String        /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup1/providers/Microsoft.Network/networkInterfaces/myNic
info:    group deployment create command OK
```

### Verify the deployment
Now SSH to the virtual machine you created to verify the deployment and start using the new VM. To connect via SSH, find the IP address of the VM you created by running the following command:

```azurecli
azure network public-ip show myResourceGroup1 myPublicIP
```

The public IP address is listed in the command output. By default you connect to the Linux VM by SSH on port 22.

## Create additional VMs
Use the captured image and template to deploy additional VMs using the steps in the preceding section. Other options to create VMs from the image include using a quickstart template or running the **azure vm create** command.

### Use the captured template
To use the captured image and template, follow these steps (detailed in the preceding section):

* Ensure that your VM image is in the same storage account that hosts your VM's VHD.
* Copy the template JSON file and specify a unique name for the OS disk of the new VM's VHD (or VHDs). For example, in the **storageProfile**, under **vhd**, in **uri**, specify a unique name for the **osDisk** VHD, similar to `https://xxxxxxxxxxxxxx.blob.core.windows.net/vhds/MyNewVHDNamePrefix-osDisk.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.vhd`
* Create a NIC in either the same or a different virtual network.
* Using the modified template JSON file, create a deployment in the resource group in which you set up the virtual network.

### Use a quickstart template
If you want the network set up automatically when you create a VM from the image, you can specify those resources in a template. For example, see the [101-vm-from-user-image template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-from-user-image) from GitHub. This template creates a VM from your custom image and the necessary virtual network, public IP address, and NIC resources. For a walkthrough of using the template in the Azure portal, see [How to create a virtual machine from a custom image using a Resource Manager template](http://codeisahighway.com/how-to-create-a-virtual-machine-from-a-custom-image-using-an-arm-template/).

### Use the azure vm create command
Usually it's easiest to use a Resource Manager template to create a VM from the image. However, you can create the VM *imperatively* by using the **azure vm create** command with the **-Q** (**--image-urn**) parameter. If you use this method, you also pass the **-d** (**--os-disk-vhd**) parameter to specify the location of the OS .vhd file for the new VM. This file must be in the vhds container of the storage account where the image VHD file is stored. The command copies the VHD for the new VM automatically to the **vhds** container.

Before running **azure vm create** with the image, complete the following steps:

1. Create a resource group, or identify an existing resource group for the deployment.
2. Create a public IP address resource and a NIC resource for the new VM. For steps to create a virtual network, public IP address, and NIC by using the CLI, see earlier in this article. (**azure vm create** can also create a NIC, but you need to pass additional parameters for a virtual network and subnet.)

Then run a command that passes URIs to both the new OS VHD file and the existing image. In this example, a size Standard_A1 VM is created in the East US region.

```azurecli
azure vm create -g myResourceGroup1 -n myNewVM -l eastus -y Linux \
-z Standard_A1 -u myAdminname -p myPassword -f myNIC \
-d "https://xxxxxxxxxxxxxx.blob.core.windows.net/vhds/MyNewVHDNamePrefix.vhd" \
-Q "https://xxxxxxxxxxxxxx.blob.core.windows.net/system/Microsoft.Compute/Images/vhds/MyVHDNamePrefix-osDisk.vhd"
```

For additional command options, run `azure help vm create`.

## Next steps
To manage your VMs with the CLI, see the tasks in [Deploy and manage virtual machines by using Azure Resource Manager templates and the Azure CLI](cli-deploy-templates.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

