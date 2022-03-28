---
title: Create an Azure virtual machine offer (VM) from an approved base
description: Learn how to create a virtual machine (VM) offer from an approved base (Azure Marketplace).
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.author: edewebolton
author: ebolton-cyber
ms.date: 02/23/2022
---

# Create a virtual machine using an approved base

This article describes how to use Azure to create a virtual machine (VM) containing a pre-configured, endorsed operating system. If this isn't compatible with your solution, it's possible to [create and configure an on-premises VM](azure-vm-use-own-image.md) using an approved operating system.

> [!NOTE]
> Before you start this procedure, review the [technical requirements](marketplace-virtual-machines.md#technical-requirements) for Azure VM offers, including virtual hard disk (VHD) requirements.

## Select an approved base Image

Select one of the following Windows or Linux images as your base.

### Windows

- [Windows Server](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoftwindowsserver.windowsserver?tab=Overview)
- SQL Server [2019](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftsqlserver.sql2019-ws2019?tab=Overview), [2014](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftsqlserver.sql2014sp3-ws2012r2?tab=Overview), [2012](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftsqlserver.sql2012sp4-ws2012r2?tab=Overview)

### Linux

Azure offers a range of approved Linux distributions. For a current list, see [Linux on distributions endorsed by Azure](../virtual-machines/linux/endorsed-distros.md).

## Create VM on the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **Virtual machines**.
3. Select **+ Create** and **+ Virtual machine** from the drop-down menu to open the **Create a virtual machine** screen.
4. Select the image from the dropdown list or select **See all images** to search or browse all available virtual machine images. You can also configure the VM generation of your image depending on the image you select.
5. Select the size of the VM to deploy.
6. Provide the other required details to create the VM.
7. Select **Review + create** to review your choices. When the **Validation passed** message appears, select  **Create**.

Azure begins provisioning the virtual machine you specified. Track its progress by selecting the **Virtual Machines** tab in the left menu. After it's created, the status of Virtual Machine changes to **Running**.

## Configure the VM

This section describes how to size, update, and generalize an Azure VM. These steps are necessary to prepare your VM to be deployed on Azure Marketplace.

### Connect to your VM

Refer to the following documentation to connect to your [Windows](../virtual-machines/windows/connect-logon.md) or [Linux](../virtual-machines/linux/ssh-from-windows.md#connect-to-your-vm) VM.

### Install the most current updates

[!INCLUDE [Discussion of most current updates](includes/most-current-updates.md)]

### Perform additional security checks

[!INCLUDE [Discussion of addition security checks](includes/additional-security-checks.md)]

### Customize your VM image

Now, install the necessary software and make any custom configuration changes on your VM for your solution to work properly, including any scheduled tasks that need to run after deployment. Consider the following when making your custom changes:

- If it is a scheduled run-once task, the task should delete itself after it successfully completes.
- Configurations should not rely on drives other than C or D, because only these two drives are always guaranteed to exist (drive C is the operating system disk and drive D is the temporary local disk).
- Make any technical configuration changes necessary for your solution. Later, you will flag the configurations you make on your VM in the **Properties** section of the **Technical Configuration** page in Partner Center. This will show your customers which scenarios are supported based on the configuration changes you make now. Select from the following technical configuration properties during publishing:
    - Supports backup
    - Supports accelerated networking
    - Supports cloud-init configuration
    - Supports extensions
    - Is a network virtual appliance
    - Remote desktop or SSH disabled
    - Requires custom ARM template

For more information about Linux customizations, see [Virtual machine extensions and features for Linux](../virtual-machines/extensions/features-linux.md).

## Generalize the image

All images in Azure Marketplace must be reusable in a generic fashion. To achieve this, the operating system VHD must be generalized, an operation that removes all instance-specific identifiers and software drivers from a VM.

### For Windows

Windows OS disks are generalized with the [sysprep](/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview) tool. If you later update or reconfigure the OS, you must run sysprep again.

> [!WARNING]
> After you run sysprep, turn the VM off until it's deployed because updates may run automatically. This shutdown will avoid subsequent updates from making instance-specific changes to the operating system or installed services. For more information about running sysprep, see [Generalize a Windows VM](../virtual-machines/generalize.md#windows).

> [!NOTE]
> If you have Microsoft Defender for Cloud (Azure Defender) enabled on the subscription where you are creating the VM to be captured and you do not want any VM created from this image to be enrolled in the Defender for Endpoint portal, ensure you disable Microsoft Defender for Cloud on the subscription or for the VM itself. If this is not disabled, any VM created from this image will be enrolled in the Defender for Endpoint portal even if the VM is deployed to a different tenant without Microsoft Defender for Cloud.

### For Linux

1. Remove the Azure Linux agent.
    1. Connect to your Linux VM using an SSH client.
    2. In the SSH window, enter this command: `sudo waagent –deprovision+user`.
    3. Type Y to continue (you can add the -force parameter to the previous command to avoid the confirmation step).
    4. After the command completes, enter **Exit** to close the SSH client.
2. Stop virtual machine.
    1. In the Azure portal, select your resource group (RG) and de-allocate the VM.
    2. Your VM is now generalized and you can create a new VM using this VM disk.

## Capture image

> [!NOTE]
> The Azure subscription containing the Azure Compute Gallery must be under the same tenant as the publisher account in order to publish. Also, the publisher account must have at least Contributor access to the subscription containing Azure Compute Gallery.

Once your VM is ready, you can capture it in an Azure Compute Gallery (formerly know as Shared Image Gallery). Follow the below steps to capture:

1. On the [Azure portal](https://portal.azure.com/), go to your Virtual Machine’s page.
2. Select **Capture**.
3. Under **Share image to Azure Compute Gallery** select **Yes, share it to a gallery as an image version**.
4. Under **Operating system state** select Generalized.
5. Select a Target image gallery or **Create New**.
6. Select a Target image definition or **Create New**.
7. Provide a **Version number** for the image.
8. Select **Review + create** to review your choices.
9. Once the validation is passed, select **Create**.

## Set the right permissions

If your Partner Center account is the owner of the subscription hosting an Azure Compute Gallery, nothing further is needed for permissions.

If you only have read access to the subscription, use one of the following two options.

### Option one – Ask the owner to grant owner permission

Steps for the owner to grant owner permission:

1. Go to the Azure Compute Gallery.
1. Select **Access control** (IAM) on the left panel.
1. Select **Add**, then **Add role assignment**.<br>
    :::image type="content" source="media/create-vm/add-role-assignment.png" alt-text="The add role assignment window is shown.":::
1. For **Role**, select **Owner**.
1. For **Assign access to**, select **User, group, or service principal**.
1. For **Select**, enter the Azure email of the person who will publish the image.
1. Select **Save**.

### Option Two – Run a command

Ask the owner to run either one of these commands (in either case, use the SusbscriptionId of the subscription where you created the Azure Compute Gallery).

```azurecli
az login
az provider register --namespace Microsoft.PartnerCenterIngestion --subscription {subscriptionId}
```
 
```powershell
Connect-AzAccount
Select-AzSubscription -SubscriptionId {subscriptionId}
Register-AzResourceProvider -ProviderNamespace Microsoft.PartnerCenterIngestion
```

> [!NOTE]
> You don’t need to generate SAS URIs as you can now publish an Azure Compute Gallery Image on Partner Center. However, if you still need to refer to the SAS URI generation steps, see [How to generate a SAS URI for a VM image](azure-vm-get-sas-uri.md).

## Next steps

- Recommended next step: [Test your VM image](azure-vm-image-test.md) to ensure it meets Azure Marketplace publishing requirements. This is optional.
- If you don't want to test your VM image, sign in to [Partner Center](https://go.microsoft.com/fwlink/?linkid=2165935) to publish your image.
- If you encountered difficulty creating your new Azure-based VHD, see [VM FAQ for Azure Marketplace](azure-vm-faq.yml).
