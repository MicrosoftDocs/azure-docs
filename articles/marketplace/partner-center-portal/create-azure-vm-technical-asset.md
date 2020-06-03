---
title: Create your Azure Virtual Machine technical assets 
description: Learn how to create and configure technical assets for a virtual machine (VM) offer for Azure Marketplace.  
author: dannyevers 
ms.author: mingshen
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/13/2020
---

# Create your Azure Virtual Machine technical assets

This article describes how to create and configure technical assets for a virtual machine (VM) offer for Azure Marketplace. A VM contains two components: the operating system virtual hard disk (VHD) and optional associated data disks VHDs:

* **Operating system VHD** – Contains the operating system and solution that deploys with your offer. The process of preparing the VHD differs depending on whether it is a Linux-based, Windows-based, or custom-based VM.
* **Data disks VHDs** - Dedicated, persistent storage for a VM. Don't use the operating system VHD (for example, the C: drive) to store persistent information.

A VM image contains one operating system disk and up to 16 data disks. Use one VHD per data disk, even if the disk is blank.

> [!NOTE]
> Regardless of which operating system you use, add only the minimum number of data disks needed by the solution. Customers cannot remove disks that are part of an image at the time of deployment, but they can always add disks during or after deployment.

> [!IMPORTANT]
> Every VM Image in a plan must have the same number of data disks.

## Fundamental technical knowledge

Designing, building, and testing these assets takes time and requires technical knowledge of both the Azure platform and the technologies used to build the offer. In addition to your solution domain, your engineering team should have knowledge of the following Microsoft technologies:

* Basic understanding of [Azure Services](https://azure.microsoft.com/services/)
* How to [design and architect Azure applications](https://azure.microsoft.com/solutions/architecture/)
* Working knowledge of [Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/), [Azure Storage](https://azure.microsoft.com/services/?filter=storage) and [Azure Networking](https://azure.microsoft.com/services/?filter=networking)
* Working knowledge of [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/)
* Working Knowledge of [JSON](https://www.json.org/)

## Suggested tools – optional

Consider using one of the following scripting environments to help manage VMs and VHDs:

* [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview)
* [Azure CLI](https://code.visualstudio.com/)

Additionally, consider adding the following tools to your development environment:

* [Azure Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer)
* [Visual Studio Code](https://code.visualstudio.com/)
  * Extension: [Azure Resource Manager Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools)
  * Extension: [Beautify](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify)
  * Extension: [Prettify JSON](https://marketplace.visualstudio.com/items?itemName=mohsen1.prettify-json)

Review the available tools in the [Azure Developer Tools](https://azure.microsoft.com/product-categories/developer-tools/) page and, if you are using Visual Studio, the [Visual Studio Marketplace](https://marketplace.visualstudio.com/).

## Create a VM image using an approved base

> [!NOTE]
> To create your virtual machine technical assets using an image you built on your own premises, go to [Create a VM using your own image](#create-a-vm-using-your-own-image).

This section describes various aspects of using an approved base, such as using the Remote Desktop Protocol (RDP), selecting a size for the VM, installing the latest Windows updates, and generalizing the VHD image.

The following sections focus mainly on windows-based VHDs. For more information about creating Linux-based VHDs, see [Linux on distributions endorsed by Azure](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros).

> [!WARNING]
> Follow the guidance in this topic to use Azure to create a VM containing a pre-configured, endorsed operating system. If this isn't compatible with your solution, it's possible to create and configure an on-premises VM using an approved operating system. You can then configure and prepare it for upload as described in [Prepare a Windows VHD or VHDX to upload to Azure](https://docs.microsoft.com/azure/virtual-machines/windows/prepare-for-upload-vhd-image).

### Select an approved base

Select either the Windows operation system or Linux as your base.

#### Windows

The operating system VHD for your Windows-based VM image must be based on an Azure-approved base image that contains Windows Server or SQL Server. To begin, create a VM from one of the following images from the Azure portal:

* Windows Server ([2016](https://www.microsoft.com/evalcenter/evaluate-windows-server-2016), [2012 R2 Datacenter](https://www.microsoft.com/cloud-platform/windows-server-pricing), [2012 Datacenter](https://www.microsoft.com/cloud-platform/windows-server-pricing), [2008 R2 SP1](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftwindowsserver.windowsserver?tab=Overview))
* [SQL Server 2014](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-pricing-guidance) (Enterprise, Standard, Web)
* [SQL Server 2012 SP2](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-pricing-guidance) (Enterprise, Standard, Web)

> [!NOTE]
> If you're using the current Azure portal or Azure PowerShell, then Windows Server images published on September 8, 2014 and later are approved.

#### Linux

Azure offers a range of approved Linux distributions. For a current list, see [Linux on distributions endorsed by Azure](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros).

### Create VM in the Azure portal

Follow these steps to create the base VM image in the [Azure portal](https://ms.portal.azure.com/):

1. Sign in to the [Azure portal](https://ms.portal.azure.com/) with the Microsoft account associated with the Azure subscription you want to use to publish your VM offer.
2. Create a new resource group and provide your **Resource group name**, **Subscription**, and **Resource group location**. For details, see [Manage resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-portal).
3. Select **Virtual machines** on the left to display the Virtual machines details page.
4. Select **+ Add** to open the **Create a virtual machine experience**.
5. Select the image from the drop-down list or click **Browse all public and private images** to search or browse all available virtual machine images.
6. Select the size of the VM to deploy using the following recommendations:
    * If you plan to develop the VHD on-premises, the size doesn't matter. Consider using one of the smaller VMs.
    * If you plan to develop the image in Azure, consider using one of the recommended VM sizes for the selected image.

7. In the **Disks** section, expand the **Advanced** section and set the **Use managed disks** option to **No**.
8. Provide the other required details to create the VM.
9. Select **Review + create** to review your choices. When you see the **Validation passed** message, select **Create**.

Azure begins provisioning the virtual machine you specified. You can track its progress by selecting the **Virtual Machines** tab on the left. After it's created, the status will change to **Running**.

If you encounter difficulty creating your new Azure-based VHD, see [Common issues during VHD creation (FAQs)](https://docs.microsoft.com/azure/marketplace/partner-center-portal/common-issues-during-vhd-creation).

### Connect to your Azure VM

This section explains how to connect to and sign into the VM you created on Azure. After you've successfully connected, you can work with the VM as if you were locally logged in to its host server.

#### Connect to a Windows-based VM

Use the remote desktop client to connect to the Windows-based VM hosted on Azure. Most versions of Windows natively contain support for the remote desktop protocol (RDP). For other operating systems, you can find more information about clients in [Remote Desktop clients](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/clients/remote-desktop-clients).

This article details how to use the built-in Windows RDP support to connect to your VM: [How to connect and log on to an Azure virtual machine running Windows](https://docs.microsoft.com/azure/virtual-machines/windows/connect-logon).

> [!TIP]
> You may get security warnings during the process. For example, warnings such as "The .rdp file is from an unknown publisher" or "Your user credentials cannot be verified." It is safe to ignore these warnings.

#### Connect to a Linux-based VM

To connect to a Linux-based VM, you need a secure shell protocol (SSH) client. The following steps use the free [PuTTY](https://www.ssh.com/ssh/putty/) SHH terminal.

1. Go to the [Azure portal](https://ms.portal.azure.com/).
2. Search for and select **Virtual machines**.
3. Select the VM you want to connect to.
4. Start the VM if it isn't already running.
5. Select the name of the VM to open its **Overview** page.
6. Note the Public IP address and DNS name of your VM (if these values are not set, you must [Create a network interface](https://docs.microsoft.com/azure/virtual-network/virtual-network-network-interface#create-a-network-interface)).
7. Open the PuTTY application.
8. In the PuTTY Configuration dialog, enter the IP address or DNS name of your VM.

    :::image type="content" source="media/avm-putty.png" alt-text="Illustrates the PuTTY terminal settings. the Host Name or IP address and Port boxes are highlighted.":::

9. Select **Open** to open a PuTTY terminal.
10. When prompted, enter the account name and password of your Linux VM account.

If you have connection problems, refer to the documentation for your SSH client. For example, [Chapter 10: Common error messages](https://www.ssh.com/ssh/putty/putty-manuals).

For details, including how to add a desktop to a provisioned Linux VM, see [Install and configure Remote Desktop to connect to a Linux VM in Azure](https://docs.microsoft.com/azure/virtual-machines/linux/use-remote-desktop).

## Create a VM using your own image

This section describes how to create and deploy a user-provided virtual machine (VM) image. You can do this by providing operating system and data disk VHD images from an Azure-deployed virtual hard disk (VHD).

> [!NOTE]
> To optionally use an approved base image, follow the instructions in [Create a VM image using an approved base](#create-a-vm-image-using-an-approved-base).

1. Upload your images to Azure Storage account.
2. Deploy the VM image.
3. Capture the VM image.

### Upload your images to an Azure storage account

1. Log on to the [Azure portal](https://portal.azure.com/).
2. Upload your generalized operating system VHD and data disk VHDs to your Azure storage account.

### Deploy your image

Create your image using either the Azure portal or Azure PowerShell.

#### Deploy using the Azure portal

1. On the home page, select **Create a resource**, search for "Template Deployment", and select **Create**.
2. Choose **Build your own template in the editor**.

    :::image type="content" source="media/avm-custom-deployment.png" alt-text="Illustrates the Custom deployment page.":::

3. Paste this [JSON template](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/virtual-machine/cpp-deploy-json-template) into the editor and select **Save**.
4. Provide the parameter values for the displayed **Custom deployment** property pages.

    | Parameter | Description |
    | ------------ | ------------- |
    | User Storage Account Name | Content from cell 2 |
    | User Storage Container Name | Storage account name where the generalized VHD is located |
    | DNS Name for Public IP | Public IP DNS name. Define the DNS name for the public IP address in the Azure portal after the offer is deployed. |
    | Admin User Name | Administrator account's username for new VM |
    | Admin Password | Administrator account's password for new VM |
    | OS Type | VM operating system: Windows or Linux |
    | Subscription ID | Identifier of the selected subscription |
    | Location | Geographic location of the deployment |
    | VM Size | [Azure VM size](https://docs.microsoft.com/azure/virtual-machines/windows/sizes), for example Standard_A2 |
    | Public IP Address Name | Name of your public IP address |
    | VM Name | Name of the new VM |
    | Virtual Network Name | Name of the virtual network used by the VM |
    | NIC Name | Name of the network interface card running the virtual network |
    | VHD URL | Complete OS Disk VHD URL |
    |  |  |

5. After you supply these values, select **Purchase**.

Azure will begin deployment. It creates a new VM with the specified unmanaged VHD in the specified storage account path. You can track the progress in the Azure portal by selecting **Virtual Machines** on the left side of the portal. When the VM is created, the status will change from Starting to Running.

#### Deploy using Azure PowerShell

```powershell
    $img = Get-AzureVMImage -ImageName "myVMImage"
    $user = "user123"
    $pass = "adminPassword123"
    $myVM = New-AzureVMConfig -Name "VMImageVM" -InstanceSize "Large" -ImageName $img.ImageName | Add-AzureProvisioningConfig -Windows -AdminUsername $user -Password $pass
    New-AzureVM -ServiceName "VMImageCloudService" -VMs $myVM -Location "West US" -WaitForBoot
```

### Capture the VM image

Use the following instructions that correspond to your approach:

* Azure PowerShell: [How to create an unmanaged VM image from an Azure VM](https://docs.microsoft.com/azure/virtual-machines/windows/capture-image-resource)
* Azure CLI: [How to create an image of a virtual machine or VHD](https://docs.microsoft.com/azure/virtual-machines/linux/capture-image)
* API: [Virtual Machines - Capture](https://docs.microsoft.com/rest/api/compute/virtualmachines/capture)

## Configure the virtual machine

This section describes how to size, update, and generalize an Azure VM. These steps are necessary to prepare your VM to be deployed on Azure Marketplace.

### Sizing the VHDs

If you selected one of the VMs pre-configured with an operating system (and optionally additional services), you have already picked a standard Azure VM size. Starting your solution with a pre-configured OS is the recommended approach. However, if you are installing an OS manually, you must size your primary VHD in your VM image:

* For Windows, the operating system VHD should be created as a 127–128 GB fixed-format VHD.
* For Linux, this VHD should be created as a 30–50 GB fixed-format VHD.

If the physical size is less than 127–128 GB, the VHD should be Expandable (sparse/dynamic). The base Windows and SQL Server images that are provided already meet these requirements, so don't change the format or the size of the VHD.

Data disks can be as large as 1 TB. When deciding on size, remember that customers cannot resize VHDs within an image at the time of deployment. Data disk VHDs should be created as fixed-format VHDs. They should also be Expandable (sparse/dynamic). Data disks can initially be empty or contain data.

### Install the most current updates

The base images of operating system VMs must contain the latest updates up to their published date. Before publishing the operating system VHD you created, ensure you update the OS and all installed services with all the latest security and maintenance patches.

For Windows Server, run the **Check for Updates** command.

For Linux distributions, updates are commonly downloaded and installed through a command-line tool or a graphical utility. For example, Ubuntu Linux provides the [apt-get](https://manpages.ubuntu.com/manpages/cosmic/man8/apt-get.8.html) command and the [Update Manager](https://manpages.ubuntu.com/manpages/cosmic/man8/update-manager.8.html) tool for updating the OS.

### Perform additional security checks

Maintain a high level of security for your solution images in the Azure Marketplace. The following article provides a checklist of security configurations and procedures to assist you: [Security Recommendations for Azure Marketplace Images](https://docs.microsoft.com/azure/security/security-recommendations-azure-marketplace-images). Some of these recommendations are specific to Linux-based images, but most apply to any VM image.

### Perform custom configuration and scheduled tasks

If additional configuration is needed, use a scheduled task that runs at startup to make any final changes to the VM after it has been deployed. Also consider the following recommendations:

* If it is a run-once task, the task should delete itself after it successfully completes.
* Configurations should not rely on drives other than C or D, because only these two drives are always guaranteed to exist (drive C is the operating system disk and drive D is the temporary local disk).

For more information about Linux customizations, see [Virtual machine extensions and features for Linux](https://docs.microsoft.com/azure/virtual-machines/extensions/features-linux).

## Generalize the image

All images in the Azure Marketplace must be reusable in a generic fashion. To achieve this, the operating system VHD must be generalized, an operation that removes all instance-specific identifiers and software drivers from a VM.

### Windows

Windows OS disks are generalized with the [sysprep tool](https://docs.microsoft.com/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview). If you subsequently update or reconfigure the OS, you must rerun sysprep.

> [!WARNING]
> Because updates may run automatically, after you run sysprep, turn off the VM until its deployed. This shutdown will avoid subsequent updates from making instance-specific changes to the operating system or installed services. For more information about running sysprep, see [Steps to generalize a VHD](https://docs.microsoft.com/azure/virtual-machines/windows/capture-image-resource#generalize-the-windows-vm-using-sysprep).

### Linux

The following process generalizes a Linux VM and redeploys it as a separate VM. For details, see [How to create an image of a virtual machine or VHD](https://docs.microsoft.com/azure/virtual-machines/linux/capture-image). You can stop when you reach the section "Create a VM from the captured image".

1. **Remove the Azure Linux agent**

    1. Connect to your Linux VM using an SSH client.
    2. In the SSH window, enter the following command: `sudo waagent -deprovision+user`.
    3. Type **Y** to continue (you can add the **-force** parameter to the previous command to avoid the confirmation step).
    d. After the command completes, type **Exit** to close the SSH client.

2. **Stop virtual machine**

    1. In the Azure portal, select your resource group (RG) and de-allocate the VM.
    2. Your VHD is now generalized and you can create a new VM using this VHD.

## Next steps

If you encountered difficulty creating your new Azure-based VHD, see [Common issues during VHD creation](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/virtual-machine/cpp-common-vhd-creation-issues).

Otherwise:

* [Certify your VM image](https://docs.microsoft.com/azure/marketplace/partner-center-portal/get-sas-uri) explains how to test and submit a VM image for Azure Marketplace certification, including where to get the *Certification Test Tool for Azure Certified* tool and how to use it to certify your VM image.
