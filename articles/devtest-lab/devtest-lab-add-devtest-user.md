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
	ms.date="08/30/2016"
	ms.author="tarcher"/>

# Add owners and users to a lab in Azure DevTest Labs

> [AZURE.VIDEO how-to-set-security-in-your-devtest-lab]

Azure DevTest Labs access is controlled by Azure Role-Based Access Control (RBAC). Search for [Role-Based-Access-Control (RBAC)](https://azure.microsoft.com/search/?q=role%20based%20access%20control) in the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040) to learn more.

You grant access to a lab through three roles:

- Owner
- DevTest Labs User
- Contributor

The following table illustrates the actions that can be performed by users in each of these roles:

| Actions users in this role can perform | User                           | Contributor                    | Owner | 
|----------------------------------------|--------------------------------|--------------------------------|-------|
| **Lab tasks**                          |                                |                                |       | 
| Add users to a lab                     | No                             | Yes                            | No    |
| Update cost settings                   | No                             | Yes                            | Yes   |
| **VM base tasks**                      |                                |                                |       | 
| Add and remove custom images           | No                             | Yes                            | Yes   |
| Add, update, and delete formulas       | Yes                            | Yes                            | Yes   |
| Whitelist Azure Marketplace images     | No                             | Yes                            | Yes   |
| **VM tasks**                           |                                |                                |       | 
| Create VMs                             | Yes                            | Yes                            | Yes   |   
| Start, stop, and delete VMs            | Only VMs created by the user   | Only VMs created by the user   | Yes   |
| Update VM policies                     | No                             | Yes                            | Yes   |
| Add/remove data disks to/from VMs      | Only VMs created by the user   | Yes                            | Yes   |
| **Artifact tasks**                     |                                |                                |       | 
| Add and remove artifact repositories   | No                             | Yes                            | Yes   |
| Apply artifacts                        | Yes                            | Yes                            | Yes   |


> [AZURE.NOTE] When a user creates a VM, that user is automatically assigned to the **Owner** role of the created VM.]

## Add an owner to a lab

Azure permissions are propagated from parent scope to child scope in Azure. Therefore, owners of an Azure subscription that contains labs will automatically be owner of those labs. They will also own the VMs and other resources created by the lab's users, and the Azure DevTest Labs service. 

You can add additional owners to a lab via the lab's blade in the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040). However, their scope of administration is more narrow than that of the subscription owners. This is because they would not have full access to some of the resources that are created in the subscription by the DevTest Labs service. 

To add an owner to an Azure subscription where you have labs already created or will be creating labs, follow these steps:

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).

1. In the left-nav, select **Subscriptions**.

	![Subscriptions link](./media/devtest-lab-add-devtest-user/subscriptions.png)
	
1. Select the the desired subscription.

1. Select the **Access** icon. 

	![Access users](./media/devtest-lab-add-devtest-user/access-users.png)

1. On the **Users** blade, select **Add**.

	![Add user](./media/devtest-lab-add-devtest-user/devtest-users-blade.png)

1. On the **Select a role** blade, select **Owner**.

1. Enter into the **User** text box the email of the user you want to add as an owner. If the user can't be found, you'll get an error message explaining the issue. If the user is found, that user will be listed under the **User** text box.

1. Select the located user name.

1. Select **Select**.

1. Select **OK** to close the **Add access** blade.

1. When you return to the **Users** blade, you'll see that the user has been added as an owner. This person will now be an owner of any labs created under this subscription, and thus be able to perform owner tasks. 

## Add a DevTest Labs user to a lab

To add a DevTest Labs user to a lab, follow these steps:

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Select **Browse**.

1. Select **DevTest Labs**.

1. From the list of labs, select the desired lab.   

1. Select the **Access** icon.

	![User access](./media/devtest-lab-add-devtest-user/devtest-lab-home-blade.png)

1. On the **Users** blade, select **Add**.

	![Add user](./media/devtest-lab-add-devtest-user/devtest-users-blade.png)

1. In the **Select a role** blade, select **DevTest Labs User**

1. In the **Add users** blade:

	1. The **Add users** blade displays a list of built-in users. If the desired user is already in the list, you can simply select the user row to select it. A checkmark will appear to the left of the user to indicate that the user has been selected. To select multiple users, hold the **&lt;Ctrl>** key while selecting each user. To deselect a user, hold the **&lt;Ctrl>** key and select the user. A counter at the bottom of the blade indicates the number of selected users.

	1. If the desired user is not in the list, enter a valid Microsoft email account in the **Users** text box. If the email address is valid, the user displays below the **User** text box.    

	1. Once you've selected the users you want to add to the lab, select **Select**.

	1. Select **OK** to close the **Add access** blade.

1. The **Users** blade displays the added roles and users.

[AZURE.INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

