---
title: Create technical assets for an Azure Marketplace virtual machine offer
description: Learn how to create and configure technical assets for a virtual machine (VM) offer for Azure Marketplace.  
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: iqshahmicrosoft
ms.author: iqshah
ms.date: 08/14/2020
---

# Create technical assets for an Azure Marketplace virtual machine offer

When publishing your virtual machine (VM) images to Azure Marketplace, the Azure team validates the VM image to ensure its bootability, security, and Azure compatibility. If any of the high-quality tests fail, the publishing will fail with a message containing the error and possible [rectification steps](https://docs.microsoft.com/azure/marketplace/partner-center-portal/vm-certification-issues-solutions).

This article describes how to create and configure technical assets for a virtual machine (VM) offer for Azure Marketplace. A VM contains two components: the operating system virtual hard disk (VHD) and optional associated data disks VHDs:

- **Operating system VHD**: Contains the operating system and solution that deploys with your offer. The process of preparing the VHD differs depending on whether it is a Linux-based, Windows-based, or a custom- based VM.

- **Data disk VHDs**: Dedicated, persistent storage for a VM. Don't use the operating system VHD (for example, the C: drive) to store persistent information.

A VM image contains one operating system disk and up to 16 data disks. Use one VHD per data disk, even if the disk is blank.

> [!NOTE]
> Regardless of which operating system you use, add only the minimum number of data disks needed by the solution. Customers cannot remove disks that are part of an image at the time of deployment, but they can always add disks during or after deployment.

> [!IMPORTANT]
> Every VM Image in a plan must have the same number of data disks.

## Fundamental technical knowledge

Designing, building, and testing these assets takes time and requires technical knowledge of both the Azure platform and the technologies used to build the offer. In addition to your solution domain, your engineering team should have knowledge of the following Microsoft technologies:

- Basic understanding of [Azure Services](https://azure.microsoft.com/services/)
- How to [design and architect Azure applications](https://azure.microsoft.com/solutions/architecture/)
- Working knowledge of [Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/), [Azure Storage](https://azure.microsoft.com/services/?filter=storage), and [Azure Networking](https://azure.microsoft.com/services/?filter=networking)
- Working knowledge of [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/)
- Working Knowledge of [JSON](https://www.json.org/)

### Optional suggested tools

Consider using one of the following scripting environments to help manage VMs and VHDs:

- [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview)
- [Azure CLI](https://code.visualstudio.com/)

Additionally, consider adding the following tools to your development environment:

- [Azure Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer)
- [Visual Studio Code](https://code.visualstudio.com/)

## Create a VM image using an approved base

To create your virtual machine technical assets using an image you built on your own premises, see [Create a VM image using an approved base](#create-a-vm-image-using-an-approved-base) below.

This section describes various aspects of using an approved base, such as using the Remote Desktop Protocol (RDP), selecting a size for the VM, installing the latest Windows updates, and generalizing the VHD image.

Follow the guidance in this article to use Azure to create a VM containing a pre-configured, endorsed operating system. If this isn't compatible with your solution, it's possible to create and configure an on-premises VM using an approved operating system. You can then configure and prepare it for upload as described in [Prepare a Windows VHD or VHDX to upload to Azure](https://docs.microsoft.com/azure/virtual-machines/windows/prepare-for-upload-vhd-image).

### Select an approved base Image

Select either the Windows operation system or Linux as your base.

The operating system VHD for your VM image must be based on an Azure-approved base image that contains Windows Server or SQL Server.

When you submit a request to republish your image with updates, the part-number verification test case may fail. In that instance, your image won't be approved.

This failure will occur when you used a base image that belongs to another publisher and you have updated the image. In this case, you won't be allowed to publish your image.

To fix this issue, retrieve your latest image from Azure Marketplace and make changes to that image. See the following to view approved base images where you can search for your image:

#### Windows

- Windows Server ([2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftwindowsserver.windowsserver?tab=Overview), [2016](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftwindowsserver.windowsserver?tab=Overview), [2012 R2 Datacenter](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftwindowsserver.windowsserver?tab=Overview), [2012 Datacenter](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftwindowsserver.windowsserver?tab=Overview), [2008 R2 SP1](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftwindowsserver.windowsserver?tab=Overview))
- SQL Server 2019 ([Enterprise](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftsqlserver.sql2019-ws2019?tab=Overview), [Standard](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftsqlserver.sql2019-ws2019?tab=Overview), [Web](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftsqlserver.sql2019-ws2019?tab=Overview))
- SQL Server 2014 ([Enterprise](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-pricing-guidance), [Standard](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-pricing-guidance), [Web](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-pricing-guidance))
- SQL Server 2012 SP2 ([Enterprise](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-pricing-guidance), [Standard](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-pricing-guidance), [Web](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-pricing-guidance))

#### Linux

Azure offers a range of approved Linux distributions. For a current list, see [Linux on distributions endorsed by Azure](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros).

### Create VM on the Azure portal

Follow these steps to create the base VM image on the [Azure portal](https://ms.portal.azure.com/):

1. Sign in to the [Azure portal](https://ms.portal.azure.com/) with the Microsoft account associated with the Azure subscription you want to use to publish your VM offer.
2. Create a new resource group and provide your **Resource group name**, **Subscription**, and **Resource group location**. For details, see [Manage resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-portal).

    :::image type="content" source="media/vm/create-resource-group.png" alt-text="Shows the start of creating a resource group.":::

3. Select **Virtual machines** on the left-nav to display the Virtual machines details page.
4. Select **+ Add** to open the **Create a virtual machine experience**.
5. Select the image from the drop-down list or select **Browse all public and private images** to search or browse all available virtual machine images. Example:

    :::image type="content" source="media/vm/create-resource-group-example.png" alt-text="Shows a sample VM image.":::

6. Select the size of the VM to deploy using the following recommendations:
    1. If you plan to develop the VHD on-premises, the size doesn't matter. Consider using one of the smaller VMs.
    2. If you plan to develop the image in Azure, consider using one of the recommended VM sizes for the selected image.

    :::image type="content" source="media/vm/create-virtual-machine.png" alt-text="Shows selection of VM size.":::

7. In the **Disks** section, expand the **Advanced** section and set the **Use managed disks** option to **No**.

    :::image type="content" source="media/vm/use-managed-disks.png" alt-text="Shows option to use managed disks.":::

8. Provide the other required details to create the VM.
9. Select **Review + create** to review your choices. When you see the **Validation passed** message, select **Create**.

Azure begins provisioning the virtual machine you specified. You can track its progress by selecting the **Virtual Machines** tab on the left. After it's created, the status will change to **Running**.

### Create a Generation 2 VM on the Azure portal

Create a generation 2 (Gen2) VM in Azure portal.

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com/).
2. Select **Create a resource**.
3. Select **See all** from Azure Marketplace on the left.
4. Select an image that supports Gen2.
5. Select **Create**.
6. In the **Advanced** tab, under the **VM generation** section, select the **Gen 2** option.
7. In the **Basics** tab, Under **Instance details**, go to **Size** and open the **Select a VM size** blade.
8. Select a recommended size of [supported Gen 2 VM](https://docs.microsoft.com/azure/virtual-machines/windows/generation-2#generation-2-vm-sizes) and size.
9. Go through the [Azure portal creation flow](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-portal) to finish creating the VM.

    :::image type="content" source="media/vm/vm-generation.png" alt-text="Shows option to select generation of VM.":::

## Connect to your Azure VM

This section explains how to connect and sign into the VM you created on Azure. After you've successfully connected, you can work with the VM as if you were locally logged in to its host server.

### Connect to a Windows-based VM

Use the remote desktop client to connect to the Windows-based VM hosted on Azure. Most versions of Windows natively contain support for the remote desktop protocol (RDP). For other operating systems, you can find more information about clients in [Remote Desktop clients](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/clients/remote-desktop-clients).

This article details how to use the built-in Windows RDP support to connect to your VM: [How to connect and sign on to an Azure virtual machine running Windows](https://docs.microsoft.com/azure/virtual-machines/windows/connect-logon).

> [!TIP]
> You may get security warnings during the process. For example, warnings such as "The .rdp file is from an unknown publisher" or "Your user credentials cannot be verified." It is safe to ignore these warnings.

### Connect to a Linux-based VM

To connect to a Linux-based VM, you need a secure shell protocol (SSH) client. The following steps use the free [PuTTY](https://www.ssh.com/ssh/putty/) SHH terminal.

1. Go to the [Azure portal](https://ms.portal.azure.com/).
2. Search for and select Virtual machines.
3. Select the VM you want to connect to.
4. Start the VM if it isn't already running.
5. Select the name of the VM to open its Overview page.
6. Note the Public IP address and DNS name of your VM (if these values are not set, you must [Create a network interface](https://docs.microsoft.com/azure/virtual-network/virtual-network-network-interface#create-a-network-interface).
7. Open the PuTTY application.
8. In the PuTTY Configuration dialog, enter the IP address or DNS name of your VM.

    :::image type="content" source="media/vm/putty-configuration.png" alt-text="Illustrates the PuTTY terminal settings, highlighting the Host Name and Port fields.":::

9. Select **Open** to open a PuTTY terminal.
10. When prompted, enter the account name and password of your Linux VM account.

## Configure the virtual machine

This section describes how to size, update, and generalize an Azure VM. These steps are necessary to prepare your VM to be deployed on Azure Marketplace.

### Sizing the VHDs

The following rules are for limitations on OS disk size. When you submit any request, ensure the OS disk size is within the limitation for Linux or Windows.

| OS | Recommended VHD size |
| --- | --- |
| Linux | 30 to 1023 GB |
| Windows | 30 to 250 GB |

As VMs allow access to the underlying operating system, ensure the VHD size is large enough for the VHD. Because disks aren't expandable without downtime, use a disk size between 30 and 50&nbsp;GB.

| VHD size | Actual occupied size | Solution |
| --- | --- | --- |
| >500 TB | n/a | Contact the support team for an exception approval. |
| 250-500 TB | >200 GB different from blob size | Contact the support team for an exception approval. |

### Install the most current updates

The base images of operating system VMs must contain the latest updates up to their published date. Before publishing the operating system VHD you created, ensure you update the OS and all installed services with all the latest security and maintenance patches.

- For Windows Server, run the Check for Updates command.
- For Linux distributions, updates are commonly downloaded and installed through a command-line tool or a graphical utility. For example, Ubuntu Linux provides the [apt-get](https://manpages.ubuntu.com/manpages/cosmic/man8/apt-get.8.html) command and the [Update Manager](https://manpages.ubuntu.com/manpages/cosmic/man8/update-manager.8.html) tool for updating the OS.

#### Perform additional security checks

Maintain a high level of security for your solution images in the Azure Marketplace. For a checklist of security configurations and procedures, see [Security Recommendations for Azure Marketplace Images](https://docs.microsoft.com/azure/security/security-recommendations-azure-marketplace-images). Some of these recommendations are specific to Linux-based images, but most apply to any VM image.

#### Perform custom configuration and scheduled tasks

If you need additional configuration, use a scheduled task that runs at startup to make final changes to the VM after it has been deployed. Also consider the following:

- If it is a run-once task, the task should delete itself after it successfully completes.
- Configurations should not rely on drives other than C or D, because only these two drives are always guaranteed to exist (drive C is the operating system disk and drive D is the temporary local disk).

For more information about Linux customizations, see [Virtual machine extensions and features for Linux](https://docs.microsoft.com/azure/virtual-machines/extensions/features-linux).

## Generalize the image

All images in the Azure Marketplace must be reusable in a generic fashion. To achieve this, the operating system VHD must be generalized, an operation that removes all instance-specific identifiers and software drivers from a VM.

### For Windows

Windows OS disks are generalized with the [sysprep](https://docs.microsoft.com/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview) tool. If you later update or reconfigure the OS, you must run sysprep again.

> [!WARNING]
> After you run sysprep, turn the VM off until it's deployed because updates may run automatically. This shutdown will avoid subsequent updates from making instance-specific changes to the operating system or installed services. For more information about running sysprep, see [Steps to generalize a VHD](https://docs.microsoft.com/azure/virtual-machines/windows/capture-image-resource#generalize-the-windows-vm-using-sysprep).

### For Linux

The following process generalizes a Linux VM and redeploys it as a separate VM. For details, see [How to create an image of a virtual machine or VHD](https://docs.microsoft.com/azure/virtual-machines/linux/capture-image). You can stop when you reach the section called "Create a VM from the captured image".

1. Remove the Azure Linux agent

    1. Connect to your Linux VM using an SSH client
    2. In the SSH window, enter the following command: `sudo waagent –deprovision+user`.
    3. Type Y to continue (you can add the -force parameter to the previous command to avoid the confirmation step).
    4. After the command completes, type Exit to close the SSH client.

2. Stop virtual machine

    1. In the Azure portal, select your resource group (RG) and de-allocate the VM.
    2. Your VHD is now generalized and you can create a new VM using this VHD.

## Next steps

- If you encountered difficulty creating your new Azure-based VHD, see [Common issues during VHD creation](common-issues-during-vhd-creation.md).
- If not, [Test Virtual Machine (VM) deployed from VHD](azure-vm-image-certification.md) explains how to test and submit a VM image for Azure Marketplace certification, including where to get the Certification Test Tool for Azure Certified tool and how to use it to certify your VM image.
