<properties 
	pageTitle="How to connect to Microsoft Azure Stack POC" 
	description="How to connect to Microsoft Azure Stack POC" 
	services="" 
	documentationCenter="" 
	authors="v-anpasi" 
	manager="v-kiwhit" 
	editor=""/>

<tags 
	ms.service="multiple" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="01/04/2016" 
	ms.author="v-anpasi"/>

# How to connect to Microsoft Azure Stack POC

The Microsoft Azure Stack POC is a single-computer environment provided for evaluation purposes. As such, you have the following options when connecting to the environment:

## Log into the portal as service administrator

1.  Log in to the Microsoft Azure Stack physical machine.

2.  Double-click the **ClientVM.AzureStack.local.rdp** desktop icon to open a Remote Desktop Connection to the client virtual machine. This automatically uses the AzureStack\\AzureStackUser account that was created by the deployment script. Use the admin password you gave in step 5 of the script process at the **Enter the password for the built-in administrator** prompt.

3.  On the ClientVM.AzureStack.local desktop, double-click **Microsoft Azure Stack POC Portal** icon (https://portal.azurestack.local/).

4.  Log in using the service administrator account.

## Log into the portal as a tenant

Before logging in as a tenant, you must have created a tenant account. If you don’t already have a tenant account, see the instruction in [Appendix A: Add a new user in Azure Active Directory](azure-stack-add-new-user-aad.md).

1.  Log in to the Microsoft Azure Stack physical machine.

2.  Double-click the **ClientVM.AzureStack.local.rdp** desktop icon to open a Remote Desktop Connection to the client virtual machine. This automatically uses the AzureStack\\AzureStackUser account that was created by the deployment script. Use the admin password you gave in step 5 of the script process at the **Enter the password for the built-in administrator** prompt.

3.  On the ClientVM.AzureStack.local desktop, double-click **Microsoft Azure Stack POC Portal** icon (https://portal.azurestack.local/).

4.  Log in using a tenant account.

**Note**: RDP may restrict how many users can access the physical Microsoft Azure POC host. To enable multiple users, see [Appendix B:Enable multiple concurrent user connections](azure-stack-enable-multiple-concurrent-users.md).
