<properties 
	pageTitle="Securing cloud resources with Azure Multi-Factor Authentication and AD FS" 
	description="This is the Azure Multi-Factor authentication page that describes how to get started with Azure MFA and AD FS in the cloud." 
	services="multi-factor-authentication" 
	documentationCenter="" 
	authors="billmath" 
	manager="terrylan" 
	editor="bryanla"/>

<tags 
	ms.service="multi-factor-authentication" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/02/2015" 
	ms.author="billmath"/>

# Securing cloud resources with Azure Multi-Factor Authentication and AD FS

If your organization is federated with Azure Active Directory and you have resources that are accessed by Azure AD, you can use Azure Multi-Factor Authentication or Active Directory Federation Services to secure these resources. Use the procedures below to secure Azure Active Directory resources with either Azure Multi-Factor Authentication or Active Directory Federation Services.

## To secure Azure AD resources using AD FS do the following: 



1. Use the steps outlined in [turn-on multi-factor authentication](multi-factor-authentication-get-started-cloud/#turn-on-multi-factor-authentication-for-users) for users to enable an account.
2. Use the following procedure to setup a claims rule:

<center>![Cloud](./media/multi-factor-authentication-get-started-adfs-cloud/adfs1.png)</center>

- 	Start the AD FS Management console.
- 	Navigate to Relying Party Trusts and right-click on the Relying Party Trust. Select Edit Claim Rules…
- 	Click Add Rule…
- 	From the drop down, select Send Claims Using a Custom Rule and click Next.
- 	Enter a name for the claim rule.
- 	Under Custom rule: add the following:


		=> issue(Type = "http://schemas.microsoft.com/claims/authnmethodsreferences", Value = "http://schemas.microsoft.com/claims/multipleauthn");

	Corresponding claim:

		<saml:Attribute AttributeName="authnmethodsreferences" AttributeNamespace="http://schemas.microsoft.com/claims">
		<saml:AttributeValue>http://schemas.microsoft.com/claims/multipleauthn</saml:AttributeValue>
		</saml:Attribute>
- Click OK. Click Finish. Close the AD FS Management console.

Users then can complete signing in using the on-premises method (such as smartcard).


 