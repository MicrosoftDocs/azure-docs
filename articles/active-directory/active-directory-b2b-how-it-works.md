<properties
   pageTitle="Azure AD B2B collaboration preview: How it works | Microsoft Azure"
   description="Describes how Azure Active Directory B2B collaboration supports your cross-company relationships by enabling business partners to selectively access your corporate applications"
   services="active-directory"
   documentationCenter=""
   authors="viv-liu"
   manager="cliffdi"
   editor=""
   tags=""/>

<tags
   ms.service="active-directory"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="identity"
   ms.date="05/09/2016"
   ms.author="viviali"/>

# Azure AD B2B collaboration preview: How it works
Azure AD B2B collaboration is based on an invite and redeem model. You provide the email addresses of the parties you want to work with, along with the applications you want them to use. Azure AD sends them an email invite with a link. The partner user follows the link and is prompted to sign in using their Azure AD account or sign up for a new Azure AD account.

1. Your admin invites partner users by uploading [a structured .csv file](active-directory-b2b-references-csv-file-format.md) using the Azure portal.
2. The portal sends invite emails to these partner users.
3. The partner users click the link in the email, and are prompted to sign in using their work credentials (if they're already in Azure AD), or to sign up as an Azure AD B2B collaboration user.
4. Partner users are redirected to the application they were invited to, where they now have access.

## Directory operations
Partner users exist in your Azure AD as external users. This means your admin can provision licenses, assign group membership, and further grant access to corporate apps through the Azure portal or using Azure PowerShell just like for users in your company.

While a paid Azure AD subscription (Basic or Premium) is not necessary to use Azure AD B2B, tenants who do have a paid Azure AD subscription (Basic or Premium) receive the following additional benefits:

 - Admins can assign groups to apps, providing for simpler management of invited user access.
 - Admin tenant branding is used to brand the invitation emails and redemption experience, providing more context to invited partner users.

## Related articles
 Browse our other articles on Azure AD B2B collaboration

 - [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md)
 - [Detailed walkthrough](active-directory-b2b-detailed-walkthrough.md)
 - [CSV file format reference](active-directory-b2b-references-csv-file-format.md)
 - [External user token format](active-directory-b2b-references-external-user-token-format.md)
 - [External user object attribute changes](active-directory-b2b-references-external-user-object-attribute-changes.md)
 - [Current preview limitations](active-directory-b2b-current-preview-limitations.md)
 - [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
