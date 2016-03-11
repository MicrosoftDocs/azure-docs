<properties
	pageTitle="Azure AD Connect Multiple Domains"
	description="This document describes setting up and configuring multiple top level domains with O365 and Azure AD."
	services="active-directory"
	documentationCenter=""
	authors="billmath"
	manager="stevenpo"
	editor="curtand"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/11/2016"
	ms.author="billmath"/>

# Multiple Domain Support for Federating with Azure AD
The following documentation provides guidance on how to use multiple top level domains and sub-domains when federating with Office 365 or Azure AD domains.

## Multiple top level domains
When you federate your first domain in Azure AD, several properties are set on the domain in Azure.  One important one is IssuerUri.  By default, Azure AD sets this to be the value of the federation service identifier in your on-premises AD FS configuration.  By using the PowerShell command `Get-MsolDomainFederationSettings - DomainName <your domain>`you can view the IssuerUri.

![Get-MsolDomainFederationSettings](./media/active-directory-multiple-domains/MsolDomainFederationSettings.png)

A problem arises when we want to add more than one top-level domain.  For example, let's say you have setup federation between Azure AD and your on-premises environment.  For this document I am using bmcontoso.com.  Now I have added a second, top-level domain, bmfabrikam.com.

![Domains](./media/active-directory-multiple-domains/domains.png)

When we attempt to convert our bmfabrikam.com domain to be federated, we receive an error.  The reason for this is, Azure AD has a constraint that does not allow the IssuerUri property to have the same value for more than one domain.  

![Federation error](./media/active-directory-multiple-domains/error.png)

To workaround this, we need to add a different IssuerUri which can be done by using the `-SupportMultipleDomain` parameter.  This parameter is used with the cmdlets for configuring federation:
	
- `New-MsolFederatedDomain`
- `Convert-MsolDomaintoFederated`
- `Update-MsolFederatedDomain`

This parameter makes Azure AD configure the IssuerUri so that it is based on the name of the domain which will be unique across directories in Azure AD.  So using the parameter we are able to use the PowerShell command.

![Federation error](./media/active-directory-multiple-domains/convert.png)

If we look at the settings of our new bmfabrikam.com domain we see the following.

![Federation error](./media/active-directory-multiple-domains/settings.png)

Note that the IssuerUri has been set to our bmfabrikam.com domain but our other endpoints are still configured to point to our federation service on adfs.bmcontoso.com.

>[AZURE.IMPORTANT]In order to use the -SupportMultipleDomain switch when attempting to add new or convert already added domains, you need to have setup your federated trust to support them originally.  


## How to update the trust between AD FS and Azure AD
If you did not setup the federated trust between AD FS and your instance of Azure AD, you may need to re-create this trust.  This is because, when it is originally setup without the -SupportMultipleDomain switch, the IssuerUri is set with the default value.  In the screenshot below you can see the IssuerUri is set to https://adfs.bmcontoso.com/adfs/services/trust

![Get-MsolDomainFederationSettings](./media/active-directory-multiple-domains/settings2.png)


So now, if we have successfully added an new domain in the Azure AD portal and then attempt to convert it using `Convert-MsolDomaintoFederated -DomainName <your domain>`, we get the following error.

![Federation error](./media/active-directory-multiple-domains/trust1.png)

If you try to add the `-SupportMultipleDomain` switch we will receive the following error:

![Federation error](./media/active-directory-multiple-domains/trust2.png)

Simply trying to run `Update-MsolFederatedDomain -DomainName <your domain> -SupportMultipleDomain` on the original domain will also result in an error.

![Federation error](./media/active-directory-multiple-domains/trust3.png)

Use the following steps to update the trust between AD FS and Azure AD to support multiple domains.  You will need a global administrator account of the original domain you federated with.

1.  On a machine that has [Azure Active Directory Module for Windows PowerShell](https://msdn.microsoft.com/library/azure/jj151815.aspx) installed on it run the following: `$cred=Get-Credential`.  
2.  Enter the username and password of a global administrator for the Azure AD domain you are federating with
2.  In PowerShell enter `Connect-MsolService -Credentail $cred`
3.  In PowerShell enter `Update-MSOLFederatedDomain -DomainName <Federated Domain Name>`.  Make sure this is successful before continuing.
![Federation error](./media/active-directory-multiple-domains/update1.png)
2.  On your AD FS federation server open **AD FS Management.** 
2.  On the left, expand **Trust Relationships** and **Relying Party Trusts**
3.  On the right, delete the **Microsoft Office 365 Identity Platform** entry.
![Federation error](./media/active-directory-multiple-domains/trust4.png)
4.  On the machine with PowerShell enter `Update-MSOLFederatedDomain -DomainName <Federated Domain Name> -SupportMultipleDomain`.  This is for the original domain.  So using the above domains it would be:  `Update-MsolFederatedDomain -DomainName bmcontoso.com -SupportMultipleDomain`
4.  Once this completes successfully you can convert or add new domains using the `-SupportMultipleDomain` parameter.  For example, we would now enter `Convert-MsolDomainToFederated -DomainName bmfabrikam.com -SupportMultipleDomain`.

For additional information on this topic see the support article [here.](https://support.microsoft.com/kb/2618887).

Now we see that the IssuerUri has been updated on our original domain http://bmcontoso.com/adfs/services/trust

![Get-MsolDomainFederationSettings](./media/active-directory-multiple-domains/MsolDomainFederationSettings.png)

And the IssuerUri on our new domain has been set to https://bmfabrikam.com/adfs/services/trust

##Issuer value in AD FS tokens issued for Azure AD

Another thing that -SupportMultipleDomain does is that it ensures that the AD FS system includes the proper Issuer value in tokens issued for Azure AD. It does this by taking the domain portion of the users UPN and setting this as the domain in the IssuerUri, i.e. https://{upn suffix}/adfs/services/trust. Thus during authentication to Azure AD or Office 365, the IssuerUri element in the user’s token is used to locate the domain in Azure AD.  If a match cannot be found the authentication will fail. 

For example, if a user’s UPN is bsimon@bmcontoso.com, the IssuerUri element in the token AD FS issues will be set to http://bmcontoso.com/adfs/services/trust. This will match the Azure AD configuration, and authentication will succeed.

The following is the customized claim rule that implements this logic:

    c:[Type == "http://schemas.xmlsoap.org/claims/UPN"] => issue(Type =   "http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid", Value = regexreplace(c.Value, ".+@(?<domain>.+)", "http://${domain}/adfs/services/trust/"));


also configured to use the SupportMultiple Domains switch as the claim rule update will no longer ever send the default IssuerURI and authentication will fail due to IssuerURI miss match.