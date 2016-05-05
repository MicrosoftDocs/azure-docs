<properties
	pageTitle="Add owners and users to a DevTest Lab | Microsoft Azure"
	description="Securely add a user who is not in your subscription to your Azure DevTest Lab."
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
	ms.date="04/18/2016"
	ms.author="tarcher"/>

# Add owners and users to a DevTest Lab

> [AZURE.NOTE] Click the following link to view this article's accompanying video: [How to set security in your DevTest Lab](/documentation/videos/how-to-set-security-in-your-devtest-lab) 

## Overview

Access to a DevTest Lab is controlled by Azure Role-Based Access Control (RBAC). Search for [Role-Based-Access-Control (RBAC)](https://azure.microsoft.com/searchresults?query=Role%20Based%20Access%20Control%20%28RBAC%29) in the Azure preview portal to learn more.

You grant access to your lab through two roles:

 - **Owner**: Users assigned to the **Owner** role at the lab level have complete access to the lab, including management and monitoring functions. The **Owner** role assigned at the lab level does not grant users permissions to access resources in the subscription outside the lab scope. Users assigned to the **Owner** role at the Azure subscription level automatically have **Owner** rights to any labs created in that subscription.

 -  **DevTest Lab User**: Users assigned to the **DevTest Lab User** role can create, update, and delete VMs in the specified lab. Users can be either *internal* (a member of the Azure Active Directory for the subscription), or *external* (a user who is not a member of the Azure AD, such as a member of a partner organization).
	-  A **DevTest Lab User** role must be assigned through the **Add Users** tiles of the lab.
	-  Users in the **DevTest Lab User** role can perform these operations only inside in the lab that they are assigned to.  
	For example, a **DevTest Lab User** cannot create a virtual machine using the Virtual Machine service of the subscription. Creating a virtual machine is only allowed from the DevTest Lab account.
	- *External* users must have an account in one of the Microsoft account domains (i.e. @hotmail.com, @live.com, @msn.com, @passport.com, @outlook.com, or any variant for a specific country).

## Add an owner to your lab

DevTest Lab considers the owner(s) of an Azure subscription that contains labs to be owner(s) of those labs. While you can add additional owners to a DevTest Lab via the lab's blade in the Azure preview portal, this is not currently supported. 

To add an owner to an Azure subscription where you have labs already created or will be creating new labs, follow these steps:

1. Sign in to the [Azure preview portal](https://portal.azure.com).

1. In the left-nav, tap **Subscriptions**.

	![Subscriptions link](./media/devtest-lab-add-devtest-user/subscriptions.png)
	
1. Tap the subscription that will contain the lab(s).

1. Tap the **Access** icon. 

	![Access users](./media/devtest-lab-add-devtest-user/access-users.png)

1. On the **Users** blade, tap **Add**.

	![Add user](./media/devtest-lab-add-devtest-user/devtest-users-blade.png)

1. On the **Select a role** blade, tap **Owner**.

1. Enter into the **User** text box the email of the user you want to add as an owner. If the user can't be found, you'll get an error message explaining the issue. If the user is found, that user will be listed under the **User** text box.

1. Tap the located user name.

1. Tap **Select**.

1. Tap **OK** to close the **Add access** blade.

1. When you return to the **Users** blade, you'll see that the user has been added as an owner. This person will now be an owner of any labs created under this subscription, and thus be able to perform owner tasks. 

## Add a DevTest Lab user to your lab

To add a DevTest Lab user to your lab, follow these steps:

1. Sign in to the [Azure preview portal](https://portal.azure.com).

1. Tap **Browse**.

1. Tap **DevTest Labs**.

1. From the list of labs, tap the desired lab.   

1. Tap the **Access** icon.

	![User access](./media/devtest-lab-add-devtest-user/devtest-lab-home-blade.png)

1. On the **Users** blade, tap **Add**.

	![Add user](./media/devtest-lab-add-devtest-user/devtest-users-blade.png)

1. In the **Select a role** blade, tap **DevTest Lab User**

1. In the **Add users** blade:

	1. The **Add users** blade will display a list of built-in users. If the desired user is already in the list, you can simply tap the user row to select it. A checkmark will appear to the left of the user to indicate that the user has been selected. To select multiple users, hold the **&lt;Ctrl>** key while clicking each user. To deselect a user, hold the **&lt;Ctrl>** key and click the user. A counter at the bottom of the blade indicates the number of selected users.

	1. If the desired user is not in the list, enter a valid Microsoft email account in the **Users** text box. If the email address is valid, the user will display below the **User** text box. Simply tap it to select it.   

	1. Once you've selected the users you want to add to the lab, tap **Select**.

	1. Tap **OK** to close the **Add access** blade.

	1. The **Users** blade displays the added roles and users.
