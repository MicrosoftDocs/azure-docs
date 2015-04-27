<properties 
	pageTitle="Manage passwords in Azure AD" 
	description="A topic that explains how to manage passwords in Azure AD." 
	services="active-directory" 
	documentationCenter="" 
	authors="Justinha" 
	manager="TerryLan" 
	editor="LisaToft"
	tags="azure-classic-portal"/>

<tags 
	ms.service="active-directory" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/27/2015" 
	ms.author="Justinha"/>

# Manage passwords in Azure AD

If you are an administrator, you can reset a user’s password in Azure in the Azure classic portal. Click the name of your directory and on the Users page, click the name of the user and at the bottom of the portal click **Reset Password**.

This rest of this topic covers the full set of password management capabilities that Azure Active Directory supports, including:

- **Self-service password** change allows end users or administrators to change their expired or non-expired passwords without calling an administrator or helpdesk for support.
- **Self-service password** reset allows end users or administrators to reset their passwords automatically without calling an administrator or helpdesk for support. Self-service password reset requires Azure AD Premium or Basic. For more information, see [Azure Active Directory editions](active-directory-editions.md).
- **Administrator-initiated password reset** allows an administrator to reset an end user’s or another administrator’s password from within the Azure Management Portal.
- **Password management activity reports** give administrators insights into password reset and registration activity occurring in their organization. 
- **Password writeback** allows management of on-premises passwords from the cloud so all of the above scenarios can be performed by, or on the behalf of, federated or password synchronized users. Password writeback requires Azure AD Premium. For more information, see [Getting started with Azure Active Directory Premium](active-directory-get-started-premium.md).

> [AZURE.NOTE] 
> Azure AD Premium is available for Chinese customers using the world wide instance of Azure AD. Azure AD Premium is not currently supported in the Microsoft Azure service operated by 21Vianet in China. For more information, contact us at the [Azure Active Directory Forum](http://feedback.azure.com/forums/169401-azure-active-directory). 

Use the following links to jump to the documentation you are most interested in:

- [Overview: password management in Azure AD](https://msdn.microsoft.com/library/azure/dn683880.aspx)
- [Self-service password reset in Azure AD: how to enable, configure, and test self-service password reset](https://msdn.microsoft.com/library/azure/dn683881.aspx)
- [Self-service password reset in Azure AD: how to customize password reset to meet your needs](https://msdn.microsoft.com/library/azure/dn688249.aspx)
- [Self-service password reset in Azure AD: deployment and management best practices](https://msdn.microsoft.com/library/azure/dn903643.aspx)
- [Password management reports in Azure AD: how to view password management activity in your tenant](https://msdn.microsoft.com/library/azure/dn903641.aspx)
- [Password writeback: how to configure Azure AD to manage on-premises passwords](https://msdn.microsoft.com/library/azure/dn903642.aspx)
- [FAQ/Troubleshooting for Azure AD password management](https://msdn.microsoft.com/library/azure/dn683878.aspx)

## What's next

- [Administering Azure AD](active-directory-administer.md)
- [Create or edit users in Azure AD](active-directory-create-users.md)
- [Manage groups in Azure AD](active-directory-manage-groups.md)
