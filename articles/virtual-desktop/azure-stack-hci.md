---
title: Set up Azure Virtual Desktop for Azure Stack HCI (preview) - Azure
description: How to set up Azure Virtual Desktop for Azure Stack HCI (preview).
author: dansisson
ms.topic: how-to
ms.date: 06/12/2023
ms.author: v-dansisson
ms.reviewer: daknappe
manager: femila
ms.custom: ignite-fall-2021
---
# Set up Azure Virtual Desktop for Azure Stack HCI (preview)

> [!IMPORTANT]
> This feature is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article describes how to set up Azure Virtual Desktop for Azure Stack HCI (preview), deploying session hosts through an automated process.

With Azure Virtual Desktop for Azure Stack HCI (preview), you can use Azure Virtual Desktop session hosts in your on-premises Azure Stack HCI infrastructure that are part of a [pooled host pool](terminology.md#host-pools) in Azure. To learn more, see [Azure Virtual Desktop for Azure Stack HCI (preview)](azure-stack-hci-overview.md).

You deploy an Azure Virtual Desktop environment with session hosts on Azure Stack HCI by using the Arc VM Management Resource Bridge to create virtual machines from an existing image, which are then added to a new host pool.

## Prerequisites

To use Azure Virtual Desktop for Azure Stack HCI, you'll need the following things:

- An Azure subscription for Azure Virtual Desktop session host pool creation with all required admin permissions. For more information, see [Built-in Azure RBAC roles for Azure Virtual Desktop](rbac.md).

- An [Azure Stack HCI cluster registered with Azure](/azure-stack/hci/deploy/register-with-azure) in the same subscription.

- Azure Arc virtual machine (VM) management should be set up on the Azure Stack HCI cluster. For more information, see [VM provisioning through Azure portal on Azure Stack HCI (preview)](/azure-stack/hci/manage/azure-arc-enabled-virtual-machines).

- [An on-premises Active Directory (AD) synced with Microsoft Entra ID](/azure/architecture/reference-architectures/identity/azure-ad). The AD domain should resolve using DNS. For more information, see [Prerequisites for Azure Virtual Desktop](prerequisites.md#network).

- A stable connection to Azure from your on-premises network.

- Access from your on-premises network to all the required URLs listed in Azure Virtual Desktop's [required URL list](safe-url-list.md) for virtual machines.

- There should be at least one Windows OS image available on the cluster. For more information, see how to [create VM images using Azure Marketplace images](/azure-stack/hci/manage/virtual-machine-image-azure-marketplace?tabs=azurecli), [use images in Azure Storage account](/azure-stack/hci/manage/virtual-machine-image-storage-account?tabs=azurecli), and [use images in local share](/azure-stack/hci/manage/virtual-machine-image-local-share?tabs=azurecli).

## Configure Azure Virtual Desktop for Azure Stack HCI via automation

The automated deployment of Azure Virtual Desktop for Azure Stack HCI is based on an Azure Resource Manager template, which automates the following steps:

- Creating the host pool and workspace
- Creating the session hosts on the Azure Stack HCI cluster
- Joining the domain, downloading and installing the Azure Virtual Desktop agents, and then registering them to the host pool

Follow these steps for the automated deployment process:

1. Sign in to the Azure portal.

1. On the Azure portal menu or from the Home page, select **Azure Stack HCI**.

1. Select your Azure Stack HCI cluster.

    :::image type="content" source="media/azure-virtual-desktop-hci/azure-portal.png" alt-text="Screenshot of Azure portal." lightbox="media/azure-virtual-desktop-hci/azure-portal.png":::

1. On the **Overview** page, select the **Get Started** tab.

1. Select the **Deploy** button on the **Azure Virtual Desktop** tile. The **Custom deployment** page will open.

    :::image type="content" source="media/azure-virtual-desktop-hci/custom-template.png" alt-text="Screenshot of custom deployment template." lightbox="media/azure-virtual-desktop-hci/custom-template.png":::

1. Select the correct subscription under **Project details**.

1. Select either **Create new** to create a new resource group or select an existing resource group from the drop-down menu.

1. Select the Azure region for the host pool that’s right for you and your customers.

1. Enter a unique name for your host pool.

    > [!NOTE]
    > The host pool name must not contain spaces.

1. In **Location**, enter a region where Host Pool, Workspace, and VMs machines will be created. The metadata for these objects is stored in the geography associated with the region. For example: East US.

    > [!NOTE]
    > This location must match the Azure region you selected in step 8 above.

1. In **Custom Location Id**, enter the resource ID of the deployment target for creating VMs, which is associated with an Azure Stack HCI cluster. For example:
*/subscriptions/My_subscriptionID/resourcegroups/Contoso-rg/providers/microsoft.extendedlocation/customlocations/Contoso-CL*

1. Enter a value for **Virtual Processor Count** (vCPU) and for **Memory GB** for your VM. Defaults are 4 vCPU and 8GB respectively.

1. Enter a unique name for **Workspace Name**.

1. Enter local administrator credentials for **VM Administrator Account Username** and **VM Administrator Account Password**.

1. Enter the **OU Path**, enter the target organizational unit distinguished name for domain join. *Example: OU=unit1,DC=contoso,DC=com*.

1. Enter the **Domain** name to join your session hosts to the required domain.

1. Enter domain administrator credentials for **Domain Administrator Username** and **Domain Administrator Password** to join your session hosts to the domain. These are mandatory fields.

1. Enter the number of VMs to be created for **VM Number of Instances**. Default is 1.

1. Enter a prefix for the VMs for **VM Name Prefix**.

1. Enter the **Image Id** of the image to be used. This can be a custom image or an Azure Marketplace image.  *Example:  /subscriptions/My_subscriptionID/resourceGroups/Contoso-rg/providers/microsoft.azurestackhci/marketplacegalleryimages/Contoso-Win11image*.

1. Enter the **Virtual Network Id** of the virtual network. *Example: /subscriptions/My_subscriptionID/resourceGroups/Contoso-rg/providers/Microsoft.AzureStackHCI/virtualnetworks/Contoso-virtualnetwork*.

1. Enter the **Token Expiration Time**. If left blank, the default will be the current UTC time. 

1. Enter values for **Tags**. *Example format: { "CreatedBy": "name",  "Test": "Test2"  }*

1. Enter the **Deployment Id**. A new GUID will be created by default.

1. Select the **Validation Environment** - it's **false** by default.

> [!NOTE]
> For more session host configurations, use the Full Configuration [(CreateHciHostpoolTemplate.json)](https://github.com/Azure/RDS-Templates/blob/master/ARM-wvd-templates/HCI/CreateHciHostpoolTemplate.json) template, which offers all the features that can be used to deploy Azure Virtual Desktop on Azure Stack HCI.

## Activate Windows operating system

You must license and activate Windows VMs before you use them on Azure Stack HCI.

For activating your multi-session OS VMs (Windows 10, Windows 11, or later), enable Azure Benefits on the VM once it is created. Make sure to enable Azure Benefits on the host computer also. For more information, see [Azure Benefits on Azure Stack HCI](/azure-stack/hci/manage/azure-benefits).

> [!NOTE]
> You must manually enable access for each VM that requires Azure Benefits.

For all other OS images (such as Windows Server or single-session OS), Azure Benefits is not required. Continue to use the existing activation methods. For more information, see [Activate Windows Server VMs on Azure Stack HCI](/azure-stack/hci/manage/vm-activate).

## Optional configuration

Now that you've set up Azure Virtual Desktop for Azure Stack HCI, here are a few optional things you can do depending on your deployment needs:
 
### Add session hosts

You can add new session hosts to an existing host pool that was created using the custom template. Use the **Quick Deploy** [(AddHciVirtualMachinesQuickDeployTemplate.json)](https://github.com/Azure/RDS-Templates/blob/master/ARM-wvd-templates/HCI/QuickDeploy/AddHciVirtualMachinesQuickDeployTemplate.json) template to get started.

For information on how to deploy a custom template, see [Quickstart: Create and deploy ARM templates by using the Azure portal](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md).

> [!NOTE]
> For more session host configurations, use the **Full Configuration** [(AddHciVirtualMachinesTemplate.json)](https://github.com/Azure/RDS-Templates/blob/master/ARM-wvd-templates/HCI/AddHciVirtualMachinesTemplate.json) template, which offers all the features that can be used to deploy Azure Virtual Desktop on Azure Stack HCI. Learn more at [RDS-Templates](https://github.com/Azure/RDS-Templates/blob/master/ARM-wvd-templates/HCI/Readme.md).

### Create a profile container

To create a profile container using a file share on Azure Stack HCI, do the following:

1. Deploy a file share on a single or clustered Windows Server VM deployment. The Windows Server VMs with file server role can also be co-located on the same cluster where the session host VMs are deployed.

1. Connect to the VM with the credentials you provided when creating the VM.

3. Join the VM to an Active Directory domain.

7. Follow the instructions in [Create a profile container for a host pool using a file share](create-host-pools-user-profile.md) to prepare your VM and configure your profile container.

## Next steps

For an overview and pricing information, see [Azure Virtual Desktop for Azure Stack HCI](azure-stack-hci-overview.md).
