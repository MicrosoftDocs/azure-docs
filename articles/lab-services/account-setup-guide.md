---
title: Accelerated lab account setup guide for Azure Lab Services
description: This guide helps administrators quickly set up a lab account for use within their school.
ms.topic: article
ms.date: 06/26/2020
---

# Lab account setup guide

As a first step, administrators should set up a lab account within your Azure subscription. A lab account is a container for your classroom labs, and only takes a few minutes to set up.

## Understand your school's lab account requirements

To understand how to configure your lab account based on your school's needs, you should consider these questions.

### Do I have access to an Azure subscription?

To create a lab account, you need access to an Azure subscription that is configured for your school. Your school might have one or more subscriptions. You use a subscription to manage billing and security for all your Azure resources and services, including lab accounts.

### How many lab accounts need to be created?

To get started quickly, create a single lab account, and then later create additional lab accounts as needed. For example, you might eventually have one lab account per department.

### Who should be owners and contributors of the lab account?

Your administrators are typically the owners and contributors for a lab account. They are responsible for managing the policies that apply to all the labs contained within the lab account. The person that creates the lab account is automatically an owner. You can add additional owners and contributors, typically from the Azure Active Directory (Azure AD) tenant associated with your subscription. This can be useful to help manage a lab account by assigning either the owner or contributor role at the lab account level.

### Who will be allowed to create and manage labs?

You might choose to have your administrators and faculty members create and manage labs. These users (typically from the Azure AD tenant associated with your subscription) are assigned to the Lab Creator role within the lab account.

### Do you want to give lab creators the ability to save images that can be shared across labs?

A shared image gallery is a repository that you can use for saving and sharing images. If you have several classes that need the same images, lab creators can create the image once, and share it across labs. However, to get started, you don't necessarily need a shared image gallery, because you can always add one later.

If you answered "yes" to this question, you need to create or attach a shared image gallery to your lab account. If you answered "I don't know," you can postpone this decision until later.

### Which images in Azure Marketplace will your classroom labs use?

Azure Marketplace provides hundreds of images that you can enable so that lab creators can use the image for creating their lab. Some images might include everything that a lab already needs. In other cases, you might use an image as a starting point, and then the lab creator can customize it by installing additional applications or tools.

If you don't know which images you will need to use, you can always come back to this later to enable them. Also, the best way to see which images are available is to first create a lab account. This gives you access, so that you can review the list of available images and their contents.
  
### Do the lab's virtual machines need to have access to other Azure or on-premises resources?

When you set up a lab account, you also have the option to peer with a virtual network. To decide whether you need this, consider the following questions:

- **Do you need to provide access to a licensing server?**
  
   If you plan to use Azure Marketplace images, the cost of the operating system license is bundled into the pricing for lab services. Therefore, you don't need to provide licenses for the operating system itself. However, for additional software and applications that are installed, you do need to provide a license as appropriate.

- **Do the lab VMs need access to other on-premises resources such as a file share or database?**

   You create a virtual network to provide access to on-premises resources, typically by using a site-to-site virtual network gateway. If you don't have a virtual network configured, you need to invest additional time for this.

- **Do the lab VMs need access to other Azure resources that are located within a virtual network?**

   If you need access to Azure resources that are *not* secured within a virtual network, then you can access these resources through the public internet, without doing any peering.

If you answered "yes" to one or more questions, then you will need to peer the lab account to a virtual network. If you answered "I don't know," then you can postpone this decision until later. You can always choose to peer a virtual network after you create the lab account.

## Set up your lab account

After you understand the requirements for your lab account, you're ready to set it up.

1. **Create your lab account.** Refer to the tutorial on [creating a lab account](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-lab-account#create-a-lab-account) for instructions.

   When you're creating a lab account, you might find it helpful to familiarize yourself with the Azure resources involved. For more information, see the following articles:

   - [Subscription](https://docs.microsoft.com/azure/lab-services/classroom-labs/administrator-guide#subscription)
   - [Resource group](https://docs.microsoft.com/azure/lab-services/classroom-labs/administrator-guide#resource-group)
   - [Lab account](https://docs.microsoft.com/azure/lab-services/classroom-labs/administrator-guide#lab-account)
   - [Classroom lab](https://docs.microsoft.com/azure/lab-services/classroom-labs/administrator-guide#classroom-lab)
   - [Selecting a region and location](https://docs.microsoft.com/azure/lab-services/classroom-labs/administrator-guide#regionslocations)
   - [Naming guidance for resources](https://docs.microsoft.com/azure/lab-services/classroom-labs/administrator-guide#naming)

2. **Add users to the lab creator role.** For instructions, see [adding users to the lab creator role](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-lab-account#add-a-user-to-the-lab-creator-role).

   Also, for more information on the different roles that can be assigned to users who will manage lab accounts and labs, see the [guide on managing identity](https://docs.microsoft.com/azure/lab-services/classroom-labs/administrator-guide#manage-identity).

3. **Connect to a peer virtual network.** For instructions, see [connecting your lab's network with a peer virtual network](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-connect-peer-virtual-network).

   You might also need to refer to instructions on [configuring the lab VMs address range](https://docs.microsoft.com/azure/lab-services/classroom-labs/how-to-configure-lab-accounts#specify-an-address-range-for-vms-in-the-lab).

4. **Enable and review images.** For instructions, see [enabling Azure Marketplace images for lab creators](https://docs.microsoft.com/azure/lab-services/classroom-labs/specify-marketplace-images).

   To review the contents of each Azure Marketplace image, select the image name. For example, the following screenshot shows the details for the Ubuntu Data Science VM image:

   ![Screenshot of Review Azure Marketplace images](./media/setup-guide/review-marketplace-images.png)

   If you have a shared image gallery attached to your lab account, and you want to enable custom images to be shared by lab creators, complete steps similar to those shown in the following screenshot:

   ![Screenshot of Enabling custom images in a shared image gallery](./media/setup-guide/enable-sig-custom-images.png)

## Next steps

- [Manage lab accounts](how-to-manage-lab-accounts.md)

- [Classroom lab setup guide](setup-guide.md)
