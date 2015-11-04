<properties
	pageTitle="Azure Active Directory Domain Services preview: Troubleshooting Guide | Microsoft Azure"
	description="Troubleshooting guide for Azure AD Domain Services"
	services="active-directory-ds"
	documentationCenter=""
	authors="mahesh-unnikrishnan"
	manager="udayh"
	editor="inhenk"/>

<tags
	ms.service="active-directory-ds"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/16/2015"
	ms.author="maheshu"/>

# Azure AD Domain Services *(Preview)* - Troubleshooting guide
This article provides troubleshooting hints for issues you may encounter when setting up or administering Azure AD Domain Services.


### Users are unable to sign in to the Azure AD Domain Services managed domain
If you encounter a situation where one or more users in your Azure AD tenant are unable to sign in to the newly created managed domain, perform the following troubleshooting steps:

- Ensure that you have [enabled password synchronization](active-directory-ds-getting-started-password-sync.md) in accordance with the steps outlined in the Getting Started guide.

- Ensure that the affected user account is not an external account in the Azure AD tenant. Examples of external accounts include Microsoft accounts (for example, 'joe@live.com') or user accounts from an external Azure AD directory. Since Azure AD Domain Services does not have credentials for such user accounts, these users cannot sign in to the managed domain.

- **Synced accounts:** If the affected user accounts are synchronized from an on-premises directory, ensure that the following steps are followed:
    - You have deployed or updated to the GA release of Azure AD Connect. Older versions will not synchronize credential hashes required for NTLM/Kerberos authentication.
    - You have created the registry key required to enable synchronization of legacy credentials to Azure AD.
    - After creating the above mentioned registry key on the server running Azure AD Connect, you have forced Azure AD to perform a full synchronization as outlined in the document.
    - Depending on the size of your directory, it may take a while for user accounts and credential hashes to be available in Azure AD Domain Services. Ensure you wait long enough before retrying authentication (depends on the size of your directory - a few hours to a day or two for large directories).

- **Cloud-only accounts**: If the affected user account is a cloud-only user account, ensure that the user has changed their password after you enabled Azure AD Domain Services. This step causes the credential hashes required for Azure AD Domain Services to be generated.


### Contact Us
If you have issues with your managed domain, check to see if the steps outlined in this troubleshooting guide resolve the issue. If you're still having trouble, feel free to reach out to us at:

- The [Azure Active Directory User Voice channel](http://feedback.azure.com/forums/169401-azure-active-directory). Ensure you pre-pend your question with the words **'AADDS'** in order to reach us.
- You may also email us at [Azure AD Domain Services Feedback](mailto:aaddsfb@microsoft.com)
