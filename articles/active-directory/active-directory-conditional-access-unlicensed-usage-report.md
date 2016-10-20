<properties
	pageTitle="Unlicensed Usage Report | Microsoft Azure"
	description="The unlicensed usage report helps you identify unlicensed users that are using paid Azure AD features."
	services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/25/2016"
	ms.author="markvi"/>

# Unlicensed usage report

The unlicensed usage report helps you identify unlicensed users that are using paid Azure AD features. This allows you to make better use of licenses that you have purchased and to identify you know when you may need additional licenses. 

The report shows active usage of the paid features in the last 30 days. 

## Report structure
 
| Column name          |	Description |
| :--                  | :--         |
| Unlicensed User      |	Name of the user |
| Feature              | The feature name. For example: conditional access |
| Application Accessed | The name of the application that is being accessed with the feature. For example: Office 365 SharePoint Online |

 
> [AZURE.NOTE] If a user account has been deleted the ‘Unlicensed User’ column will be populated with an ID, like 1003000090D8B285


## Conditional access feature

Unlicensed users will be flagged when they access a service that has conditional access policy applied if they do not have an Azure AD Premium license. 

This applies to MFA / Location policies as well as device polices that use Intune.
 

## See also

- [Using Conditional Access with Office 365 and other Azure Active Directory connected apps](active-directory-conditional-access.md)
- [Getting started with conditional access to Azure AD](active-directory-conditional-access-azuread-connected-apps.md) 


