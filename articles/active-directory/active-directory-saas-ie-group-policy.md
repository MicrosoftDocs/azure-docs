<properties
   pageTitle="How to Deploy the Access Panel Extension for Internet Explorer using Group Policy | Microsoft Azure"
   description="How to use group policy to deploy the Internet Explorer add-on for the My Apps portal."
   services="active-directory"
   documentationCenter=""
   authors="liviodlc"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="09/24/2015"
   ms.author="liviodlc"/>

#How to Deploy the Access Panel Extension for Internet Explorer using Group Policy

This tutorial shows how to use group policy to remotely install the Access Panel extension for Internet Explorer on your users' machines. This extension is required for Internet Explorer users who need to sign into apps that are configured using [password-based single sign-on](active-directory-appssoaccess-whatis.md#password-based-single-sign-on).

It is recommended that admins automate the deployment of this extension. Otherwise, users will have to download and install the extension themselves, which is prone to user error and requires administrator permissions. This tutorial covers one method of automating software deployments by using group policy. [Learn more about group policy.](https://technet.microsoft.com/en-us/windowsserver/bb310732.aspx)

The Access Panel extension is also available for [Chrome](https://go.microsoft.com/fwLink/?LinkID=311859) and [Firefox](https://go.microsoft.com/fwLink/?LinkID=626998), neither of which require administrator permissions to install.

##Prerequisites

- You have set up [Active Directory Domain Services](https://msdn.microsoft.com/en-us/library/aa362244%28v=vs.85%29.aspx), and you have joined your users' machines to your domain.
- You must have the "Edit settings" permission in order to edit Group Policy Objects (GPOs). By default, members of the following security groups have this permission: Domain Administrators, Enterprise Administrators, and Group Policy Creator Owners. [Learn more here.](https://technet.microsoft.com/en-us/library/cc781991%28v=ws.10%29.aspx)

##Step 1: Create the Distribution Point

First, you must place the installer package on a network location that can be accessed from all of the machines that you wish to remotely install the extension on. To do this, follow these steps:

1. Log on to the server as an administrator
2. In the **Server Manager** window, go to **Files and Storage Services**.
	![Open Files and Storage Services](./media/active-directory-saas-ie-group-policy/files-services.png)
3. Go to the **Shares** tab. Then click on **Tasks** > **New Share...**
	![Open Files and Storage Services](./media/active-directory-saas-ie-group-policy/shares.png)
4. Complete the **New Share Wizard** and set permissions to ensure that it can be accessed from your users' machines. [Learn more about shares.](https://technet.microsoft.com/en-us/library/cc753175.aspx)
5. Download the following Microsoft Windows Installer package (.msi file): [Access Panel Extension.msi](https://account.activedirectory.windowsazure.com/Applications/Installers/x64/Access Panel Extension.msi)
6. Copy the installer package to a desired location on the share.
	![Copy the .msi file to your the share.](./media/active-directory-saas-ie-group-policy/copy-package.png)
8. Verify that your client machines are able to access the installer package from the share. 

##Step 2: Create the Group Policy Object

1. Log on to the server that hosts your Active Directory Domain Services (AD DS) installation.
2. In the Server Manager, go to **Tools** > **Group Policy Management**.
	![Go to Tools > Group Policy Managment](./media/active-directory-saas-ie-group-policy/tools-gpm.png)
3. In the left pane of the **Group Policy Management** window, view your Organizational Unit (OU) hierarchy and determine at which scope you would like to apply the group policy. For instance, you may decide to pick a small OU to deploy to a few users for testing, or you may pick a top-level OU to deploy to your entire organization.
	> [AZURE.NOTE] If you would like to create or edit your Organization Units (OUs), switch back to the Server Manager and go to **Tools** > **Active Directory Users and Computers**.
4. Once you have selected an OU, right-click on it and select **Create a GPO in this domain, and Link it here...**
	![Create a new GPO](./media/active-directory-saas-ie-group-policy/create-gpo.png)
5. In the **New GPO** prompt, type in a name for the new Group Policy Object.
	![Name the new GPO](./media/active-directory-saas-ie-group-policy/name-gpo.png)
6. Right-click on the Group Policy Object that you just created, and select **Edit**.
	![Edit the new GPO](./media/active-directory-saas-ie-group-policy/edit-gpo.png)

##Step 3: Assign the Installation Package

1. Determine whether you would like to deploy the extension based on **Computer Configuration** or **User Configuration**. When using [computer configuration](https://technet.microsoft.com/en-us/library/cc736413%28v=ws.10%29.aspx), the extension will be installed on the computer regardless of which users log on to it. On the other hand, with [user configuration](https://technet.microsoft.com/en-us/library/cc781953%28v=ws.10%29.aspx), users will have the extension installed for them regardless of which computers they log on to.
2. In the left pane of the **Group Policy Management Editor** window, go to either of the following folder paths, depending on which type of configuration you chose:
	- `Computer Configuration/Policies/Software Settings/`
	- `User Configuration/Policies/Software Settings/`
3. Right-click on **Software installation**, then select **New** > **Package...**
	![Create a new software installation package](./media/active-directory-saas-ie-group-policy/new-package.png)
4. Go to the shared folder that contains the .msi file from [Step 1: Create the Distribution Point](#step-1-create-the-distribution-point).
	> [AZURE.IMPORTANT] If the share is located on this same server, verify that you are accessing the .msi through the network file path, rather than the local file path.
	![Select the installation package from the shared folder.](./media/active-directory-saas-ie-group-policy/select-package.png)

##Step 4: Auto-Enable the Extension for Internet Explorer 

##Step 5: Testing the Deployment