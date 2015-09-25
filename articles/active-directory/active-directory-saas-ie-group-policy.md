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

##Prerequisites

- You have set up [Active Directory Domain Services](https://msdn.microsoft.com/en-us/library/aa362244%28v=vs.85%29.aspx), and you have joined your users' machines to your domain.
- You must have the "Edit settings" permission in order to edit Group Policy Objects (GPOs). By default, members of the following security groups have this permission: Domain Administrators, Enterprise Administrators, and Group Policy Creator Owners. [Learn more here.](https://technet.microsoft.com/en-us/library/cc781991%28v=ws.10%29.aspx)

##Step 1: Create the Distribution Point

You must have a shared folder that can be accessed by all of the machines on your network. Your machines must be able to access this network location to retrieve the installation package for the extension. [Learn more here.](https://technet.microsoft.com/en-us/library/cc753175.aspx)

##Step 2: Create the Group Policy Object

##Step 3: Assign the Installer Package

##Step 4: Auto-Enable the Extension for Internet Explorer 

##Step 5: Testing the Deployment