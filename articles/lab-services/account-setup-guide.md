---
title: Accelerated lab account setup guide
description: This guide helps administrators quickly set up a lab account for use within their school. 
ms.topic: how-to
ms.date: 03/15/2022
ms.custom: devdivchpfy22
---

# Lab account setup guide

[!INCLUDE [lab account focused article](./includes/lab-services-labaccount-focused-article.md)]

If you're an administrator, before you set up your Azure Lab Services environment, you first need to create a *lab account* within your Azure subscription. A lab account is a container for one or more labs, and it takes only a few minutes to set up.

This guide includes three sections:

- Prerequisites
- Plan your lab account settings
- Set up your lab account

## Prerequisites

The following sections outline what you need to do before you can set up a lab account.

### Access your Azure subscription

To create a lab account, you need access to an Azure subscription that's already set up for your school. Your school might have one or more subscriptions. You use a subscription to manage billing and security for all your Azure resources and services, including lab accounts. Azure subscriptions are managed by your IT department. For more information, see [Azure Lab Services - Administrator guide](./administrator-guide-1.md#subscription).

### Estimate how many VMs and VM sizes you need

It's important to know how many [virtual machines (VMs) and which VM sizes](./administrator-guide-1.md#vm-sizing) your school lab requires.

For guidance on structuring your labs and images, see [Moving from a physical lab to Azure Lab Services](./concept-migrating-physical-labs.md).

For more information on how to structure labs, see the "Lab" section of [Azure Lab Services - Administrator guide](./administrator-guide-1.md#lab).

### Understand subscription VM limits and regional VM capacity

After you've estimated the number of VMs and the VM sizes for your labs, you need to:

- Ensure that your Azure subscription's capacity limit allows for the number of VMs and the VM size that you plan to use in your labs.
- Create your lab account within a region that has sufficient available VM capacity.

For more information, see [VM subscription limits and regional capacity](https://techcommunity.microsoft.com/t5/azure-lab-services/vm-subscription-limits-and-regional-capacity/ba-p/1845553).

### Decide how many lab accounts to create

To get started quickly, create a single lab account within its own resource group. Later, you can create more lab accounts and resource groups, as needed. For example, you might eventually have one lab account and resource group per department as a way to clearly separate costs.

For more information about lab accounts, resource groups, and separating costs, see:

- The "Resource group" section of [Azure Lab Services - Administrator guide](./administrator-guide-1.md#resource-group)
- The "Lab account" section of [Azure Lab Services - Administrator guide](./administrator-guide-1.md#lab-account)
- [Cost management for Azure Lab Services](./cost-management-guide.md)

## Plan your lab account settings

To plan your lab account settings, consider the following questions.

### Who should be the Owners and Contributors of the lab account?

Your school's IT administrators ordinarily take on the Owner and Contributor roles for a lab account. These roles are responsible for managing the policies that apply to all the labs in the lab account. The person who creates the lab account is automatically an Owner. You can add more Owners and Contributors from the Azure Active Directory (Azure AD) tenant that's associated with your subscription.

For more information about the lab account Owner and Contributor roles, see the "Manage identity" section of [Azure Lab Services - Administrator guide](./administrator-guide-1.md#manage-identity).

[!INCLUDE [Select a tenant](./includes/multi-tenant-support.md)]

Lab users see only a single list of the VMs that they have access to across Azure AD tenants in Azure Lab Services.

### Who will be allowed to create labs?

You may choose to have your IT team or faculty members create labs. To create labs, you then assign these people to the Lab Creator role within the lab account. You ordinarily assign this role from the Azure AD tenant that's associated with your school subscription. Whoever creates a lab is automatically assigned as the Owner of the lab.  

For more information about the Lab Creator role, see the "Manage identity" section of [Azure Lab Services - Administrator guide](./administrator-guide-1.md#manage-identity).

### Who will be allowed to own and manage labs?

You can also choose to have IT and faculty members own\manage labs *without* giving them the ability to create labs. In this case, users from your subscription's Azure AD tenant are assigned either the Owner or Contributor for existing labs.  

For more information about the lab Owner and Contributor roles, see the "Manage identity" section of [Azure Lab Services - Administrator guide](./administrator-guide-1.md#manage-identity).

### Do you want to save images and share them across labs?

Shared Image Gallery is a service that you can use for saving and sharing images. For classes that need to use the same image, Lab Creators can create the image and then export it to a shared image gallery. After an image is exported to the shared image gallery, it can be used to create new labs.

You might want to create your images in your physical environment and then import them to a shared image gallery. For more information, see the blog post [Import a custom image to a shared image gallery](https://techcommunity.microsoft.com/t5/azure-lab-services/import-custom-image-to-shared-image-gallery/ba-p/1777353).

If you decide to use the Shared Image Gallery service, you'll need to create or attach a shared image gallery to your lab account. You can postpone this decision for now, because a shared image gallery can be attached to a lab account at any time.  

For more information, see:
- The "Shared image gallery" section of [Azure Lab Services - Administrator guide](./administrator-guide-1.md#shared-image-gallery)
- The "Pricing" section of [Azure Lab Services - Administrator guide](./administrator-guide-1.md#pricing)

### Which images in Azure Marketplace will your labs use?

Azure Marketplace provides hundreds of images that you can enable so that Lab Creators can use them for creating their labs. Some images might include everything that a lab already needs. In other cases, you might use an image as a starting point, and then the Lab Creator can customize it by installing more applications or tools.

If you don't know which images you need, you can come back later to enable them. The best way to see which images are available is to create a lab account. Lab account creation will also give you access to review the list of available images and their contents.

For more information, see [Specify the Azure Marketplace images that are available to Lab Creators](./specify-marketplace-images.md).
  
### Do the lab VMs need access to other Azure or on-premises resources?

When you set up a lab account, you also can peer your lab account with a virtual network. Keep in mind that both your virtual network and the lab account must be located in the same region. To decide whether you need to peer with a virtual network, consider the following scenarios:

- **Access to a license server**
  
   When you use Azure Marketplace images, the cost of the operating system license is bundled into the pricing for lab services. However, you don't need to provide licenses for the operating system itself. For any other software and applications that are installed, you do need to provide a license, as appropriate. To access a license server:
  - You may choose to connect to an on-premises license server. Connecting to an on-premises license server requires additional setup.
  - Another option, which is faster to set up, is to create a license server that you host on an Azure VM. The Azure VM is located within a virtual network that you peer with your lab account.

- **Access to other on-premises resources such as a file share or database**

   You ordinarily create a virtual network to provide access to on-premises resources by using a site-to-site virtual network gateway. Setting up this type of environment will take additional time.

- **Access to other Azure resources that are located outside a virtual network**

   You can access the Azure resources that *aren't* secured in a virtual network through the public internet, without having to do any virtual network peering.

   For more information about virtual networks, see:
  - The "Virtual network" section of [Architecture fundamentals in Azure Lab Services](./classroom-labs-fundamentals.md#virtual-network)
  - [Connect your lab network with a peer virtual network in Azure Lab Services](./how-to-connect-peer-virtual-network.md)
  - [Create a lab with a shared resource in Azure Lab Services](./how-to-create-a-lab-with-shared-resource.md)

## Set up your lab account

After you've finished planning, you're ready to set up your lab account. You can apply the same steps to setting up [Azure Lab Services in Teams](./lab-services-within-teams-overview.md).

1. **Create your lab account**. For instructions, see [Create a lab account](./tutorial-setup-lab-account.md#create-a-lab-account).

    For information about naming conventions, see the "Naming" section of [Azure Lab Services - Administrator guide](./administrator-guide-1.md#naming).

1. **Add users to the Lab Creator role**. For instructions, see [Add users to the Lab Creator role](./tutorial-setup-lab-account.md#add-a-user-to-the-lab-creator-role).

1. **Connect to a peer virtual network**. For instructions, see [Connect your lab network with a peer virtual network](./how-to-connect-peer-virtual-network.md).

   You might also need to refer to instructions for [configuring the lab VMs address range](./how-to-configure-lab-accounts.md).

1. **Enable and review images**. For instructions, see [Specify which Azure Marketplace images are available to Lab Creators](./specify-marketplace-images.md).

   To review the contents of each Azure Marketplace image, select the image name. For example, the following screenshot shows the details of the Ubuntu Data Science VM image:

   :::image type="content" source="./media/setup-guide/review-azure-marketplace-images.png" alt-text="Screenshot of a list of images available for review in Azure Marketplace.":::

   If a shared image gallery is attached to your lab account, and you want to enable custom images to be shared by Lab Creators, complete similar steps as shown in the following screenshot:

   :::image type="content" source="./media/setup-guide/enable-azure-compute-gallery-images.png" alt-text="Screenshot of a list of enabled custom images.":::

## Next steps

For more information about setting up and managing labs, see:

- [Manage lab accounts](how-to-manage-lab-accounts.md)  
- [Lab setup guide](setup-guide.md)
