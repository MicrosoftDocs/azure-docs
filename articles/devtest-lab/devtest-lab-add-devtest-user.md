<properties
	pageTitle="Add owners and users to a lab in Azure DevTest Labs| Microsoft Azure"
	description="Securely add a user who is not in your subscription to Azure DevTest Labs"
	services="devtest-lab,virtual-machines"
	documentationCenter="na"
	authors="tomarcher"
	manager="douge"
	editor=""/>

<tags
	ms.service="devtest-lab"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/08/2016"
	ms.author="tarcher"/>

# Add owners and users to a lab in Azure DevTest Labs

> [AZURE.VIDEO how-to-set-security-in-your-devtest-lab]

Azure DevTest Labs access is controlled by Azure Role-Based Access Control (RBAC). Search for [Role-Based-Access-Control (RBAC)](https://azure.microsoft.com/search/?q=role%20based%20access%20control) in the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040) to learn more.

In this article, you learn the following:

- [Actions that can be performed in each role](#actions-that-can-be-performed-in-each-role)
- [Add an owner or user at the lab level](#add-an-owner-or-user-at-the-lab-level)
- [Add an owner or user at the subscription level](#add-an-owner-or-user-at-the-subscription-level)

## Actions that can be performed in each role

There are three main roles that you can assign a user:

- Owner
- DevTest Labs User
- Contributor

The following table illustrates the actions that can be performed by users in each of these roles:

| **Actions users in this role can perform** | **DevTest Labs User**            | **Owner** | **Contributor** |
|---|---|---|---|
| **Lab tasks**                          |                              |       |             |
| Add users to a lab                     | No                           | Yes   | No          |
| Update cost settings                   | No                           | Yes   | Yes         |
| **VM base tasks**                      |                              |       |             |
| Add and remove custom images           | No                           | Yes   | Yes         |
| Add, update, and delete formulas       | Yes                          | Yes   | Yes         |
| Whitelist Azure Marketplace images     | No                           | Yes   | Yes         |
| **VM tasks**                           |                              |       |             |
| Create VMs                             | Yes                          | Yes   | Yes         |
| Start, stop, and delete VMs            | Only VMs created by the user | Yes   | Yes         |
| Update VM policies                     | No                           | Yes   | Yes         |
| Add/remove data disks to/from VMs      | Only VMs created by the user | Yes   | Yes         |
| **Artifact tasks**                     |                              |       |             |
| Add and remove artifact repositories   | No                           | Yes   | Yes         |
| Apply artifacts                        | Yes                          | Yes   | Yes         |

> [AZURE.NOTE] When a user creates a VM, that user is automatically assigned to the **Owner** role of the created VM.

## Add an owner or user at the lab level

Owners and users can be added at the lab level via the Azure portal.  
Anyone with a valid Microsoft Account (MSA) can be added. This includes 
*external users* who are not members of your organization's Azure Active Directory. 
The following steps guide you through the process of adding 
an owner or user to a lab:

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Select **More Services**, and then select **DevTest Labs** from the list.

1. From the list of labs, select the desired lab.

1. On the lab's blade, select **Configuration**. 

1. On the **Configuration** blade, select **Users**.

1. On the **Users** blade, select **+Add**.

	![Add user](./media/devtest-lab-add-devtest-user/devtest-users-blade.png)

1. On the **Select a role** blade, select the desired role. The section [Actions that can be performed in each role](#actions-that-can-be-performed-in-each-role) lists the various actions that can be performed by users in the Owner, DevTest User, and Contributor roles.

1. On the **Add users** blade, enter the email address or name of the user you want to add in the role you specified. If the user can't be found, an error message explains the issue. If the user is found, that user is listed and selected. 

1. Select **Select**.

1. Select **OK** to close the **Add access** blade.

1. When you return to the **Users** blade, the user has been added.  

## Add an owner or user at the subscription level

Azure permissions are propagated from parent scope to child scope in Azure. Therefore, owners of an Azure subscription that contains labs are automatically owners of those labs. They also own the VMs and other resources created by the lab's users, and the Azure DevTest Labs service. 

You can add additional owners to a lab via the lab's blade in the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040). 
However, the added owner's scope of administration is more narrow than the subscription owner's scope. 
For example, the added owners do not have full access to some of the resources that are created in the subscription by the DevTest Labs service. 

To add an owner to an Azure subscription, follow these steps:

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Select **More Services**, and then select **Subscriptions** from the list.

1. Select the desired subscription.

1. Select **Access** icon. 

	![Access users](./media/devtest-lab-add-devtest-user/access-users.png)

1. On the **Users** blade, select **Add**.

	![Add user](./media/devtest-lab-add-devtest-user/devtest-users-blade.png)

1. On the **Select a role** blade, select **Owner**.

1. On the **Add users** blade, enter the email address or name of the user you want to add as an owner. If the user can't be found, you get an error message explaining the issue. If the user is found, that user is listed under the **User** text box.

1. Select the located user name.

1. Select **Select**.

1. Select **OK** to close the **Add access** blade.

1. When you return to the **Users** blade, the user has been added as an owner. This user is now an owner of any labs created under this subscription, and thus be able to perform owner tasks. 

[AZURE.INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

