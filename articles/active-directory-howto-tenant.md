<properties
	pageTitle="How to get an Azure AD tenant | Microsoft Azure"
	description="How to get an Azure Active Directory tenant for registering and building applications."
	services="active-directory"
	documentationCenter=""
	authors="dstrockis"
	manager="terrylan"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/28/2015"
	ms.author="dastrock"/>

# How to get an Azure Active Directory tenant

In Azure Active Directory (Azure AD), a [tenant](https://msdn.microsoft.com/library/azure/jj573650.aspx#BKMK_WhatIsAnAzureADTenant) is representative of an organization.  It is a dedicated instance of the Azure AD service that an organization receives and owns when it signs up for a Microsoft cloud service such as Azure, InTune, or Office 365.  Each Azure AD tenant is distinct and separate from other Azure AD tenants.  

A tenant houses the users in a company and the information about them - their passwords, user profile data, permissions, and so on.  It also contains groups, applications, and other information pertaining to an organization and its security.

To allow Azure AD users to sign in to your application, you must register your application in a tenant of your own.  Publishing an application in an Azure AD tenant is **absolutely free**.  In fact, most developers will create several tenants and applications for experimentation, development, staging and testing purposes.  Organizations that sign up for and consume your application can optionally choose to purchase licenses if they wish to take advantage of advanced directory features.

So, how do you go about getting an Azure AD tenant?  The process might be a little different if you:

- [Have an existing Office 365 subscription](#use-an-existing-office-365-subscription)
- [Have an existing Azure subscription associated with a Microsoft Account](#use-an-msa-azure-subscription)
- [Have an existing Azure subscription associated with an organizational account](#use-an-organizational-azure-subscription)
- [Have none of the above & want to start from scratch](#start-from-scratch)

## Use an existing Office 365 subscription
If you have an existing Office 365 subscription but don't have an Azure subscription (and can't sign into the [Azure Management Portal](https://manage.windowsazure.com)), please follow [these instructions](https://technet.microsoft.com/library/dn832618.aspx) to gain access to your Azure AD tenant.

## Use an MSA Azure subscription
If you have previously signed up for an Azure subscription with your individual Microsoft Account, you already have a tenant!  In the [Azure Management Portal](https://manage.windowsazure.com), you should find a tenant named "Default Tenant" listed under "All Items" and "Active Directory."  You are free to use this tenant as you see fit - but you may want to create an Organizational administrator account.

To do so, follow these steps.  Alternatively, you may wish to create a new tenant and create an administrator in that tenant following a similar process.

1.	Log into the [Azure Management Portal](https://manage.windowsazure.com) with your individual account
2.	Navigate to the “Active Directory” section of the portal (found in the left nav bar)
3.	Select the “Default Directory” entry in the list of available directories
4.	Click on the Users link at the top of the page.  You will see a single user in the list with value “Microsoft account” in the Sourced From column
5.	Click “Add User” at the bottom of the page
6.	In the Add User Form provide the following details:
    - Type of User: New user in your organization
    - User name: (choose a user name for this administrator)
    - First Name/Last Name/Display Name: (choose appropriate values)
    - Role: Global Administrator
    - Alternate Email Address: (enter appropriate values)
    - Optional: Enable Multi-Factor Authentication
    - Lastly, click on the green “CREATE” button to finalize user creation (and display the temporary password).
7.	When you have completed the Add User Form, and receive the temporary password for the new administrative user, be sure to record this password as you will need to login with this new user in order to change the password. You can also send the password directly to the user, using an alternative e-mail.
8.	To change the temporary password, log into https://login.microsoftonline.com with this new user account and change the password when requested.


## Use an organizational Azure subscription
If you have previously signed up for an Azure subscription with your organizational account, you already have a tenant!  In the [Azure Management Portal](https://manage.windowsazure.com), you should find a tenant listed under "All Items" and "Active Directory."  You are free to use this tenant as you see fit.  You may also wish to create a new tenant using the "New" button in the bottom left hand corner of the portal.


## Start from scratch
If all of the above is gibberish to you, don't worry.  Simply visit [https://account.windowsazure.com/organization](https://account.windowsazure.com/organization) to sign up for Azure with a new organization.  Once you've completed the process, you will have your very own Azure AD tenant with the domain name you chose during sign up.  In the [Azure Management Portal](https://manage.windowsazure.com), you can find your tenant by navigating to "Active Directory" in the left hand nav.

As part of the process of signing up for Azure, you will be required to provide credit card details.  You can proceed with confidence - you will not be charged for publishing applications in Azure AD or creating new tenants.
