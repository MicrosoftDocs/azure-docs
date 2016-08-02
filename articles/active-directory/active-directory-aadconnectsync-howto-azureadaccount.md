<properties
	pageTitle="Azure AD Connect sync: How to manage the Azure AD service account | Microsoft Azure"
	description="This topic documents how to restore the Azure AD service account."
	services="active-directory"
    keywords="AADSTS70002, AADSTS50054, How to reset the password for the Azure AD Connect sync Connector service account"
	documentationCenter=""
	authors="andkjell"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/27/2016"
	ms.author="andkjell"/>

# Azure AD Connect sync: How to manage the Azure AD service account
The service account used by the Azure AD Connector is supposed to be service free. But if you need to reset its credentials, then this topic is for you. This can for example happen if a Global Administrator has by mistake reset the password on the service account using PowerShell.

## Reset the credentials
If the service account defined on the Azure AD Connector cannot contact Azure AD due to authentication problems, the password can be reset.

1. Sign-in to the Azure AD Connect sync server and start PowerShell.
2. Run `Add-ADSyncAADServiceAccount`.  
![PowerShell cmdlet addadsyncaadserviceaccount](./media/active-directory-aadconnectsync-howto-azureadaccount/addadsyncaadserviceaccount.png)
3. Provide Azure AD Global admin credentials.

This cmdlet will reset the password for the service account and update it both in Azure AD and in the sync engine.

## Known issues these steps can solve
This is a list of errors reported by customers that were fixed by following these steps.

-----------
Event 6900  
The server encountered an unexpected error while processing a password change notification:  
AADSTS70002: Error validating credentials. AADSTS50054: Old password is used for authentication.

----------
Event 659  
Error while retrieving password policy sync configuration. Microsoft.IdentityModel.Clients.ActiveDirectory.AdalServiceException:  
AADSTS70002: Error validating credentials. AADSTS50054: Old password is used for authentication.

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).
