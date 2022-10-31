---
title: Set up Azure Virtual Desktop for Azure Stack HCI (preview) - Azure
description: How to set up Azure Virtual Desktop for Azure Stack HCI (preview).
author: dansisson
ms.topic: how-to
ms.date: 10/14/2022
ms.author: v-dansisson
ms.reviewer: daknappe
manager: femila
ms.custom: ignite-fall-2021, devx-track-azurecli
---
# Set up Azure Virtual Desktop for Azure Stack HCI (preview)

With Azure Virtual Desktop for Azure Stack HCI (preview), you can use Azure Virtual Desktop session hosts in your on-premises Azure Stack HCI infrastructure. For more information, see [Azure Virtual Desktop for Azure Stack HCI (preview)](azure-stack-hci-overview.md).

> [!IMPORTANT]
> Azure Virtual Desktop for Azure Stack HCI is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply.

## Prerequisites

In order to use Azure Virtual Desktop for Azure Stack HCI, you'll need the following things:

- An Azure subscription for Azure Virtual Desktop session host pool creation with all required admin permissions. For more information, see [Built-in Azure RBAC roles for Azure Virtual Desktop](rbac.md).

- An [Azure Stack HCI cluster registered with Azure](/azure-stack/hci/deploy/register-with-azure) in the same subscription.

- Azure Arc VM management should be set up on the Azure Stack HCI cluster. For more information, see [VM provisioning through Azure portal on Azure Stack HCI (preview)](/azure-stack/hci/manage/azure-arc-enabled-virtual-machines).

- [An on-premises Active Directory (AD) synced with Azure Active Directory](/azure/architecture/reference-architectures/identity/azure-ad). The AD domain should resolve using DNS. For more information, see [Prerequisites for Azure Virtual Desktop](prerequisites.md#network).

- A stable connection to Azure from your on-premises network.

- Access from your on-premises network to all the required URLs listed in Azure Virtual Desktop's [required URL list](safe-url-list.md) for virtual machines.

- There should be at least one Windows OS image available on the cluster. For more information, see [Create Azure Stack HCI VM image using Azure Marketplace images](/azure-stack/hci/manage/virtual-machine-image-azure-marketplace?tabs=azurecli) and [Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/).

## Set up and configuration

Follow the steps below for a simplified process of setting up Azure Virtual Desktop on Azure Stack HCI. This deployment is based on an Azure Resource Manager template that automates creating the host pool and workspace, creating the session hosts on the HCI cluster, joining the domain, downloading and installing the Azure Virtual Desktop agents, and then registering them to the host pool.

1. Sign into the Azure Portal.

1. On the Azure portal menu or from the Home page, select **Azure Stack HCI**.

1. Select your Azure Stack HCI cluster.

    :::image type="content" source="media/azure-virtual-desktop-hci/azure-portal.png" alt-text="Screenshot of Azure portal." lightbox="media/azure-virtual-desktop-hci/azure-portal.png":::

1. On the **Overview** page, select the **Get Started** tab.


1. Select the **Deploy button** on the **Azure Virtual Desktop** tile - the **Custom deployment** page will open.

    :::image type="content" source="media/azure-virtual-desktop-hci/custom-template.png" alt-text="Screenshot of custom deployment template." lightbox="media/azure-virtual-desktop-hci/custom-template.png":::

1. Select the correct subscription under **Project details**.

1. Select either **Create new** to create a new resource group or select an existing resource group from the drop-down menu.

1. Select the Azure region for the host pool that’s right for you and your customers.

1. Enter a unique name for your host pool.

1. In **Location**, enter a region where Host Pool, Workspace, and VMs machines will be created. The metadata for these objects is stored in the geography associated with the region. *Example: East US*.

    > [!NOTE]
    > This location must match the Azure region you selected in step 8 above.

1. In **Custom Location Id**, enter the resource ID of the deployment target for creating VMs, which is associated with an Azure Stack HCI cluster.  
*Example: /subscriptions/My_subscriptionID/resourcegroups/Contoso-rg/providers/microsoft.extendedlocation/customlocations/Contoso-CL*.

1. Enter a value for **Virtual Processor Count** (vCPU) and for **Memory GB** for your VM. Defaults are 4 vCPU and 8GB respectively.

1. Enter a unique name for **Workspace Name**.

1. Enter local administrator credentials for **Vm Administrator Account Username** and **Vm Administrator Account Password**.

1. Enter the **OU Path** value for domain join. *Example: OU=unit1,DC=contoso,DC=com*.

1. Enter the **Domain** name to join your session hosts to the required domain.

1. Enter domain administrator credentials for **Domain Administrator Username** and **Domain Administrator Password** to join your session hosts to the domain. These are mandatory fields.

1. Enter the number of VMs to be created for **Vm Number of Instances**. Default is 1.

1. Enter a prefix for the VMs for **Vm Name Prefix**.

1. Enter the **Image Id** of the image to be used. This can be a custom image or an Azure Marketplace image.  *Example:  /subscriptions/My_subscriptionID/resourceGroups/Contoso-rg/providers/microsoft.azurestackhci/marketplacegalleryimages/Contoso-Win11image*.

1. Enter the **Virtual Network Id** of the virtual network. *Example: /subscriptions/My_subscriptionID/resourceGroups/Contoso-rg/providers/Microsoft.AzureStackHCI/virtualnetworks/Contoso-virtualnetwork*.

1. Enter the **Token Expiration Time**. If left blank, the default will be the current UTC time. 

1. Enter values for **Tags**. *Example format: { "CreatedBy": "name",  "Test": "Test2”  }*

1. Enter the **Deployment Id**. A new GUID will be created by default.

1. Select the **Validation Environment** - it's **false** by default.

> [!NOTE]
> For more session host configurations, use the Full Configuration [(CreateHciHostpoolTemplate.json)](https://github.com/Azure/RDS-Templates/blob/master/ARM-wvd-templates/HCI/CreateHciHostpoolTemplate.json) template, which offers all the features that can be used to deploy Azure Virtual Desktop on Azure Stack HCI.

## Optional configuration

Now that you've set up Azure Virtual Desktop for Azure Stack HCI, here are a few optional things you can do depending on your deployment needs:
 
### Add session hosts

You can add new session hosts to an existing host pool that was created either manually or using the custom template. Use the **Quick Deploy** [(AddHciVirtualMachinesQuickDeployTemplate.json)](https://github.com/Azure/RDS-Templates/blob/master/ARM-wvd-templates/HCI/QuickDeploy/AddHciVirtualMachinesQuickDeployTemplate.json) template to get started.

For information on how to deploy a custom template, see [Quickstart: Create and deploy ARM templates by using the Azure portal](/azure/azure-resource-manager/templates/quickstart-create-templates-use-the-portal).

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
