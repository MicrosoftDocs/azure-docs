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
2. Create a shared network folder. [Learn more about shared folders.](https://technet.microsoft.com/en-us/library/cc753175.aspx)
3. Download the following Microsoft Windows Installer package (.msi file): [Access Panel Extension.msi](https://account.activedirectory.windowsazure.com/Applications/Installers/x64/Access Panel Extension.msi)
4. Copy the installer package to a desired location on the share.
5. Set permissions on the share to allow access to the installer package.
6. Verify that your client machines are able to access the installer package from the share. 

##Step 2: Create the Group Policy Object



##Step 3: Assign the Installer Package

##Step 4: Auto-Enable the Extension for Internet Explorer 

##Step 5: Testing the Deployment