    <properties 
	pageTitle="Add a DevTest Lab User | Microsoft Azure" 
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
	ms.date="11/01/2015" 
	ms.author="tarcher"/>

# Securely add a user to your Azure DevTest Lab

## Overview

Access to a **DevTest Lab** is controlled by Azure Role-Based Access Control (RBAC). Search for [Role-Based-Access-Control (RBAC)](https://azure.microsoft.com/searchresults?query=Role%20Based%20Access%20Control%20%28RBAC%29) in the Azure portal to learn more.

You grant access to your **DevTest-Lab** through two roles: 

 - **Owner**: Principals assigned to the **owner** role at the Azure subscription level have complete access to the lab, including management and monitoring functions. To add an **owner** role to your subscription, see [Role-based access control in the Microsoft Azure portal](http://go.microsoft.com/fwlink/?LinkId=624812). 
 
     > [AZURE.NOTE] **Owner** roles that are assigned at RBAC levels other than the subscription level are not supported in **DevTest Lab**. Assigning a principal to the **Owner** roles in the **DevTest Lab** is not supported.
 -  **DevTest Lab User**: Principals assigned to the **DevTest Lab User** role can create VMs, read, update and delete virtual machines in the specified lab. Users can be either *internal* (a member of the Azure Active Directory for the subscription), or *external* (a user who is not a member of the Azure AD, such as a member of a partner organization). 
     -  A **DevTest Lab User** role must be assigned through the **Add Users** tiles of the lab. 
     -  Principals in the **DevTest Lab User** role can perform these operations only inside in the lab that they are assigned to.  
     For example, a **DevTest Lab User** cannot create a virtual machine using the Virtual Machine service of the subscription. Creating a virtual machine is only allowed from the DevTest Lab account.
     - *External* users must have an account in one of the Microsoft account domains (i.e. @hotmail.com, @live.com, @msn.com, @passport.com, @outlook.com, or any variant for a specific country).

## Add a DevTest Lab User to your lab 

1. Sign in to the [Azure preview portal](http://portal.azure.com).

1. Tap **Browse**, and then tap **DevTest Labs** from the list.

1. From the list of labs, tap the desired lab.   

1. Tap the **Access** icon.
	
	![Choose the Access link](./media/devtest-lab-add-devtest-user/devtest-lab-home-blade.png)

1. On the **Users** blade, tap **Add**.

	![Choose the Access link](./media/devtest-lab-add-devtest-user/devtest-users-blade.png)

> [AZURE.NOTE] Only the **Owner** and **DevTest Lab User** roles are currently supported in a **DevTest Lab**.

1. In the **Select a role** blade, tap either **Owner** or **DevTest Lab User**, depending on the type of user you are adding.

1. In the **Add users** blade:

	1. The **Add users** blade will display a list of built-in users. If the desired user is already in the list, you can simply tap the user row to select it. A checkmark will appear to the left of the user to indicate that the user has been selected. To select multiple users, hold the **<Ctrl>**    key while clicking each user. To deselect a user, hold the **<Ctrl>** key and click the user. A counter at the bottom of the blade indicates the number of selected users. 
	
	1. If the desired user is not in the list, enter a valid Microsoft email account in the **Users** text box and press **Enter**. **Note:** An error message is displayed if the account does not exist. 

	1. Once you've selected the users you want to add to the lab, tap **Select**.

	1. The **Add access** blade displays the added roles and users. Click **OK** to close the blade.