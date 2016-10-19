<properties
	pageTitle="Capture a Linux VM to use as a template | Microsoft Azure"
	description="Learn how to capture and generalize an image of a Linux-based Azure virtual machine (VM) created with the Azure Resource Manager deployment model."
	services="virtual-machines-linux"
	documentationCenter=""
	authors="dlepow"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/18/2016"
	ms.author="danlep"/>


# Capture a Linux virtual machine running on Azure

Follow the steps in this article to capture and generalize your own Azure virtual machine (VM) running Linux. When you generalize the VM, you remove personal account information and prepare the VM to be used as an image, similar to the Linux images available in the Azure Marketplace. You can use the image to replicate a VM with its current state and software, to save you time creating several similar VMs.

At a high level, you capture a generalized virtual hard disk (VHD) image for the OS, VHD images for any attached data disks, and an [Azure Resource Manager template](../resource-group-overview.md) (a JavaScript Object Notation, or JSON, file). Then, set up network resources for any new VM you want to create based on the image, and use the template to deploy it.

If you want to create Azure VMs from a VHD image you set up on-premises, see [Upload and create a Linux VM from custom disk image](virtual-machines-linux-upload-vhd.md).

## Before you begin

Ensure that you meet the following prerequisites:

* **Azure VM created in the Resource Manager deployment model** - If you haven't done this yet, you can create a Linux VM in several ways, including the [portal](virtual-machines-linux-quick-create-portal.md), the [Azure CLI](virtual-machines-linux-quick-create-cli.md), and [Resource Manager templates](virtual-machines-linux-cli-deploy-templates.md). 

    Configure the VM as needed. For example, [add data disks](virtual-machines-linux-add-disk.md), apply updates, and install applications. 
* **Azure CLI** - Install the [Azure CLI](../xplat-cli-install.md) on a local computer.

## Step 1: Remove the Azure Linux agent

First, run the **waagent** command with the **deprovision** parameter on the Linux VM. This command deletes files and data to make the VM ready for generalizing. For details, see the [Azure Linux Agent user guide](virtual-machines-linux-agent-user-guide.md).

1. Connect to your Linux VM using an SSH client.

2. In the SSH window, type the following command:

	`sudo waagent -deprovision+user`

	>[AZURE.NOTE] Only run this command on a VM that you intend to capture as an image. It does not guarantee that the image is cleared of all sensitive information or is suitable for redistribution.

3. Type **y** to continue. You can add the **-force** parameter to avoid this confirmation step.

4. After the command completes, type **exit**. This step closes the SSH client.

	
## Step 2: Capture the VM

Use the Azure CLI to generalize and capture the VM. In the following examples, replace example parameter names with your own values. Example parameter names include **myResourceGroup**, **myVnet**, and **myVM**.

5. From your local computer, open the Azure CLI and  [login to your Azure subscription](../xplat-cli-connect.md). 

6. Make sure you are in Resource Manager mode.

	`azure config mode arm`

7. Shut down the VM that you already deprovisioned by using the following command:

	`azure vm deallocate -g MyResourceGroup -n myVM`

8. Generalize the VM with the following command:

	`azure vm generalize -g MyResourceGroup -n myVM`

9. Now run the **azure vm capture** command to capture the image. In the following example, the image VHDs are captured with names beginning with **MyVHDNamePrefix**, and the **-t** option specifies a path to the template **MyTemplateFile.json**. 

	`azure vm capture MyResourceGroup MyResourceGroup MyVHDNamePrefix -t MyTemplateFile.json`

	>[AZURE.NOTE]The image VHD files get created by default in the same storage account that the original VM used. (The VHDs for any new VMs you create from the image will be stored in the same account.) 

6. To find the location of a captured image, open the JSON template in a text editor. In the **storageProfile**, find the **uri** of the **image** located in the **system** container. For example, the uri of the OS disk image is similar to `https://xxxxxxxxxxxxxx.blob.core.windows.net/system/Microsoft.Compute/Images/vhds/MyVHDNamePrefix-osDisk.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.vhd`.

## Step 3: Create a VM from the captured image
Now use the image with a template to create a Linux VM. These steps show you how to use the Azure CLI and the JSON file template you created with the `azure vm capture` command to create the VM in a new virtual network.

### Create network resources

To use the template, you first need to set up a virtual network and NIC for your new VM. We recommend you create a new resource group for these resources in the location where your VM image is stored. Run commands similar to the following, substituting names for your resources and an appropriate Azure location ("centralus" in these commands):

	azure group create <your-new-resource-group-name> -l "centralus"

	azure network vnet create <your-new-resource-group-name> <your-vnet-name> -l "centralus"

	azure network vnet subnet create <your-new-resource-group-name> <your-vnet-name> <your-subnet-name>

	azure network public-ip create <your-new-resource-group-name> <your-ip-name> -l "centralus"

	azure network nic create <your-new-resource-group-name> <your-nic-name> -k <your-subnetname> -m <your-vnet-name> -p <your-ip-name> -l "centralus"

To deploy a VM from the image by using the JSON you saved during capture, you'll need the Id of the NIC. Obtain it by running the following command.

	azure network nic show <your-new-resource-group-name> <your-nic-name>

The **Id** in the output is a string similar to the following.

	/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/<your-new-resource-group-name>/providers/Microsoft.Network/networkInterfaces/<your-nic-name>



### Create a new deployment
Now run the following command to create your VM from the captured VM image and the template JSON file you saved.

	azure group deployment create <your-new-resource-group-name> <your-new-deployment-name> -f <path-to-your-template-file-name.json>

You are prompted to supply a new VM name, the admin user name and password, and the Id of the NIC you created previously.

	info:    Executing command group deployment create
	info:    Supply values for the following parameters
	vmName: mynewvm
	adminUserName: myadminuser
	adminPassword: ********
	networkInterfaceId: /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resource Groups/mynewrg/providers/Microsoft.Network/networkInterfaces/mynewnic

You will see output similar to the following for a successful deployment.

	+ Initializing template configurations and parameters
	+ Creating a deployment
	info:    Created template deployment "dlnewdeploy"
	+ Waiting for deployment to complete
	data:    DeploymentName     : mynewdeploy
	data:    ResourceGroupName  : mynewrg
	data:    ProvisioningState  : Succeeded
	data:    Timestamp          : 2015-10-29T16:35:47.3419991Z
	data:    Mode               : Incremental
	data:    Name                Type          Value


	data:    ------------------  ------------  -------------------------------------

	data:    vmName              String        mynewvm


	data:    vmSize              String        Standard_D1


	data:    adminUserName       String        myadminuser


	data:    adminPassword       SecureString  undefined


	data:    networkInterfaceId  String        /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/mynewrg/providers/Microsoft.Network/networkInterfaces/mynewnic
	info:    group deployment create command OK

### Verify the deployment

Now SSH to the virtual machine you created to verify the deployment and start using the new VM. To connect via SSH, find the IP address of the VM you created by running the following command:

	azure network public-ip show <your-new-resource-group-name> <your-ip-name>

The public IP address is listed in the command output. By default you connect to the Linux VM by SSH on port 22.

## Create additional VMs
Use the captured image and template to deploy additional VMs using the steps in the preceding section. Other options to create VMs from the image include using a quickstart template or running the `azure vm create` command.

### Use the captured template

To use the captured image and template, follow these steps (detailed in the preceding section):

* Ensure that your VM image is in the same storage account that will host your VM's VHD
* Copy the template JSON file and enter a unique value for the **uri** of each VM's VHD
* Create a NIC in either the same or a different virtual network
* Create a deployment in the resource group in which you set up the virtual network, using the modified template JSON file

### Use a quickstart template

If you want the network set up automatically when you create a VM from the image, use the [101-vm-from-user-image template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-from-user-image) from GitHub. This template creates a VM from your custom image and the necessary virtual network, public IP address, and NIC resources. For a walkthrough of using the template in the Azure portal, see [How to create a virtual machine from a custom image using a Resource Manager template](http://codeisahighway.com/how-to-create-a-virtual-machine-from-a-custom-image-using-an-arm-template/).

### Use the azure vm create command

You'll generally want to use a Resource Manager template to create a VM from the image. However, you can create the VM _imperatively_ by using the **azure vm create** command with the **-Q** (**--image-urn**) parameter. If you use this method, you also pass the **-d** (**--os-disk-vhd**) parameter to specify the location of the OS .vhd file for the new VM. This must be in the vhds container of the storage account where the image VHD file is stored. The command copies the VHD for the new VM automatically to the vhds container.

Before running **azure vm create** with the image, do the following:

1.	Create a resource group, or identify an existing resource group for the deployment.

2.	Create a public IP address resource and a NIC resource for the new VM. For steps to create a virtual network, public IP address, and NIC by using the CLI, see earlier in this article. (**azure vm create** can also create a NIC, but you will need to pass additional parameters for a virtual network and subnet.)


Then run a command similar to the following, passing URIs to both the new OS VHD file and the existing image.

	azure vm create <your-resource-group-name> <your-new-vm-name> eastus Linux -d "https://xxxxxxxxxxxxxx.blob.core.windows.net/vhds/<your-new-VM-prefix>.vhd" -Q "https://xxxxxxxxxxxxxx.blob.core.windows.net/system/Microsoft.Compute/Images/vhds/<your-image-prefix>-osDisk.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.vhd" -z Standard_A1 -u <your-admin-name> -p <your-admin-password> -f <your-nic-name>

For additional command options, run `azure help vm create`.

## Next steps

To manage your VMs with the CLI, see the tasks in [Deploy and manage virtual machines by using Azure Resource Manager templates and the Azure CLI](virtual-machines-linux-cli-deploy-templates.md).
