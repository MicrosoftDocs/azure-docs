<properties
	pageTitle="Conceptual overview of custom domain names in Azure Active Directory | Microsoft Azure"
	description="Explains the conceptual framework for using custom domain names in Azure Active directory, including federation for single sign-on"
	services="active-directory"
	documentationCenter=""
	authors="jeffsta"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/18/2016"
	ms.author="curtand;jeffsta"/>

# Conceptual overview of custom domain names in Azure Active Directory

A domain name is an important part of the identifier for many directory resources: it is part of a user name or email address for a user, part of the address for a group, and can be part of the app ID URI for an application. A resource in Azure Active Directory (Azure AD) can include a domain name that is already verified to be owned by the directory that contains the resource. Only a global administrator can perform domain management tasks in Azure AD.

Domain names in Azure AD are globally unique. A domain name can be used by a single Azure AD. If one Azure AD directory has verified a domain name, then no other Azure AD directory can verify or use that same domain name.

## Initial and custom domain names

Every domain name in Azure AD is either an initial domain name, or a custom domain name.

Every Azure AD comes with an initial domain name in the form contoso.onmicrosoft.com. This third level domain name, in this example “contoso.onmicrosoft.com,” was established when the directory was created, typically by the admin who created the directory. The initial domain name for a directory can't be changed or deleted. The initial domain name, while fully functional, is intended primarily to be used as a bootstrapping mechanism until a custom domain name is verified.

In most production environments, a directory has at least one verified custom domain, such as “contoso.com,” and it is that custom domain that is visible to end users. A custom domain name is a domain name that is owned and used by that organization, such as “contoso.com,” for uses such as hosting its web site. This domain name is familiar to employees because it is part of the user name that they use to sign in to the corporate network, or to send and retrieve email.

Before it can be used by Azure AD, the custom domain name must be added to your directory and verified.

## Verified and unverified domain names

The initial domain name for a directory is implicitly evaluated as verified by Azure AD. When an administrator adds a custom domain name to an Azure AD, it is initially in an unverified state. Azure AD will not allow any directory resources to use an unverified domain name. This ensures that only one directory can use a particular domain name, and that the organization uses the domain name actually owns that domain name.

Azure AD verifies ownership of a domain name by looking for a particular entry in the domain name service (DNS) zone file for the domain name. To verify ownership of a domain name, an admin gets the DNS entry from Azure AD that Azure AD will look for, and adds that entry to the DNS zone file for the domain name. The DNS zone file is maintained by the domain name registrar for that domain. The steps to verify a domain are shown in the article for [adding a custom domain to your Azure AD directory](active-directory-add-domain.md).

Adding a DNS entry to the zone file for the domain name does not affect other domain services such as email or web hosting.

## Federated and managed domain names

A custom domain name in Azure AD can be configured to give users a federated sign in experience between your on-premises Active Directory and Azure AD. Configuring a domain for federation requires updates to privileged resources in Azure AD and also to your Windows Server Active Directory. Configuring a federated domain must be completed from Azure AD Connect or using PowerShell. Federating a custom domain cannot be initiated from the Azure classic portal. [Watch this video to learn about configuring AD FS for user sign in with Azure AD Connect](http://channel9.msdn.com/Series/Azure-Active-Directory-Videos-Demos/Configuring-AD-FS-for-user-sign-in-with-Azure-AD-Connect).

Domains that are not federated are sometimes called managed domains. The initial domain for an Azure AD directory is implicitly evaluated as a managed domain.

## Primary domain names

The primary domain name for a directory is the domain name that is pre-selected as the default value for the ‘domain’ portion of the user name, when an administrator creates a new user in the [Azure classic portal](https://manage.windowsazure.com/) or another portal such as the Office 365 admin portal. A directory can have only one primary domain name. An administrator can change the primary domain name to be any verified custom domain that is not federated, or to the initial domain.

## Domain names in Azure AD and other Microsoft Online Services

A domain name must be verified in Azure AD before it can be used by another Microsoft Online Service such as Exchange Online, SharePoint Online, and Intune. These other services typically require an administrator to add one or more DNS entries that are particular to the service.

An Azure web app uses its own mechanism to verify ownership of a domain. A domain must be verified for use with Azure AD even if it has been previously verified for use by an Azure web app in a subscription that relies on that Azure AD. An Azure web app can use a domain name that has been verified in a different directory from the directory that secures the web app.

## Managing domain names

Domain management tasks can be completed from the Azure classic portal and from PowerShell. Many tasks can be completed using the Azure AD Graph API (in public preview).

-   [Adding and verifying a custom domain name](active-directory-add-domain.md)

-   [Managing domains in the Azure classic portal](active-directory-add-manage-domain-names.md)

-   [Using PowerShell to manage domain names in Azure AD](https://msdn.microsoft.com/library/azure/e1ef403f-3347-4409-8f46-d72dafa116e0#BKMK_ManageDomains)

-   [Using the Azure AD Graph API to manage domain names in Azure AD](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/domains-operations)
