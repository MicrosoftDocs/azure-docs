<properties
	pageTitle="Using custom domain names to simplify the sign-in experience for your users | Microsoft Azure"
	description="Explains how to add your own domain name to Azure Active Directory, and other related information."
	services="active-directory"
	documentationCenter=""
	authors="curtand"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="01/19/2016"
	ms.author="curtand;jeffsta"/>

# Using custom domain names to simplify the sign-in experience for your users

You can use your own custom domain names to improve and simplify sign-in and other user experiences in Azure Active Directory. For example, if your organization owns the domain name ‘contoso.com,’ your users can sign in with user names they're familiar with, such as ‘joe@contoso.com.'

Every directory in Azure Active Directory comes with a built-in domain name in the form ‘contoso.onmicrosoft.com’ that lets you get started using Azure or other Microsoft services. [Learn about built-in domains](#_Built_in_domain).

## Use your custom domain name with Azure AD

If your organization owns a custom domain name that is familiar to your users, it is a best practice to use that custom domain name with Azure Active Directory. To use a custom domain name with Azure Active Directory, you:

-   [Add and verify your custom domain name](#_Add_and_verify)

-   [Assign users to the custom domain](#assign-users-to-a-custom-domain)

## Use your custom domain name with Office 365 and other services

Like other resources in your Azure AD, custom domain names that you have added and verified can be used with Office 365, Intune, and other applications that use Azure AD. For example, using a custom domain name with Exchange Online lets users send and receive email at familiar email addresses like <joe@contoso.onmicrosoft.com>. To enable these other applications to use custom domains, you will need to add additional DNS entries at the DNS registrar, as documented by the application.

-   [Using custom domains with Office 365](https://support.office.com/article/Add-your-users-and-domain-to-Office-365-6383f56d-3d09-4dcb-9b41-b5f5a5efd611?ui=en-US&rs=en-US&ad=US)

-   [Using custom domains with Intune](https://technet.microsoft.com/library/dn646966.aspx#BKMK_DomainNames)

## Manage domain names in Azure AD

Domain names generally require no ongoing management or administration in Azure Active Directory.

-   [See the list of domain names in your Azure Active Directory](#_Seeing_the_list)

-   [What to do if you change the DNS registrar for your custom domain name](#what-to-do-if-you-change-the-dns-registrar-for-your-custom-domain-name)

## Delete a custom domain name

You can delete a custom domain name from your Azure AD if your organization no longer uses that domain name, or if you need to use that domain name with another Azure AD.

-   [Delete a custom domain name](#_Deleting_a_custom)

## Use PowerShell or the Graph API to manage domain names

Most management tasks for domain names in Azure Active Directory can also be completed via PowerShell, or programmatically.

-   [Using PowerShell to manage domain names in Azure AD](https://msdn.microsoft.com/library/azure/e1ef403f-3347-4409-8f46-d72dafa116e0#BKMK_ManageDomains)
-   [Using the Graph API to manage domain names in Azure AD (preview)](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/domains-operations)


**Add link to company branding**
