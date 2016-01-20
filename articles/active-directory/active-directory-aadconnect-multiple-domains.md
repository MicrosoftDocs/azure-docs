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
	ms.date="01/11/2016"
	ms.author="billmath"/>

#Multiple Domain Support

Many have asked how you can configure multiple top level Office 365 or Azure AD domains and sub-domains with federation.
While most of it can be done in a fairly straightforward way, because of some things we do behind the scenes, there are a couple of tips and tricks you should know about to avoid the following issues

- Error messages while trying to configure additional domains for federation
- Users in subdomains are unable to login after multiple top level domains have been configured for federation

## Multiple top level domains
I’ll take you through setup of an example organization contoso.com who wants an additional domain named fabrikam.com.

Let’s say that in my on premises system, I have AD FS configured with federation service name fs.contoso100.com.  

When I first sign up for Office 365 or Azure AD, I choose to configure contoso.com as my first sign-on domain.  I can do this via Azure AD Connect or Azure AD Powershell using New-MsolFederatedDomain.

Once this is done, let’s look at the default values for two of the new Azure AD domain’s new configuration properties (These can be queried using Get-MsolDomainFederationSettings):

| Property Name | Value | Description|
| ----- | ----- | -----|
|IssuerURI | http://fs.contoso100.com/adfs/services/trust| While it looks like a URL, this property is really just a name for the on premises authentication system, and so the path does not need to resolve to anything.  By default, Azure AD sets this to the value of the federation service identifier in my on premises AD FS configuration.
|PassiveClientSignInUrl|https://fs.contoso100.com/adfs/ls/|This is the location to which passive signin requests will be sent, and it resolves to my actual AD FS system.  Actually there are several “*Url” properties, but we just need to look at one example to illustrate the difference between this property and a URI such as the IssuerURI.

Now, imagine I add my second domain fabrikam.com.  Again I can do this by running the Azure AD Connect wizard a second time or via PowerShell.

If I try to add the second domain as federated using Azure AD PowerShell, I will get an error.

The reason for this is a constraint in Azure AD where the IssuerURI cannot have the same value for more than one domain.  To overcome this limitation, you must use a different IssuerURI for the new domain.  This is effectively what the SupportMultipleDomain parameter does.  When used with the cmdlets for configuring federation (New-, Convert-, and Update-MsolFederatedDomain), this parameter will cause Azure AD to configure the IssuerURI based on the name of the domain which must be unique across tenants in Azure AD thus it should be unique.  There is also a change to the claim rules but I’ll talk about that in a bit.

So, in Powershell, if I add fabrikam.com using the SupportMultipleDomain parameter,

    PS C:\>New-MsolFederatedDomain -DomainName fabrikam.com –SupportMultipleDomain

I will get the following configuration in Azure AD:

- DomainName: fabrikam.com
- IssuerURI: http://fabrikam.com/adfs/services/trust 
- PassiveClientSignInUrl: https://fs.contoso100.com/adfs/ls/ 

Note that while the IssuerURI has been set to a value based on my domain, and therefore unique, the endpoint url values are still configured to point to my federation service on fs.contoso100.com, just like they are for the original contoso.com domain.  So all the domains will still point to the same AD FS system.

The other thing SupportMultipleDomain does is ensure the AD FS system will include the proper Issuer value in tokens issued for Azure AD.  It does this by taking the domain portion of the users upn and setting this as the domain in the issuerURI, i.e. https://{upn suffix}/adfs/services/trust.  Thus during authentication to Azure AD or Office 365, the Issuer element in the user’s token is used to locate the domain in Azure AD.  If a match can’t be found the authentication will fail.

For example, if a user’s UPN is johndoe@fabrikam.com, the Issuer element in the token AD FS issues will be set to http://fabrikam.com/adfs/services/trust.  This will match the Azure AD configuration, and authentication will succeed.

Below is the customized claim rule that implements this logic:

    c:[Type == "http://schemas.xmlsoap.org/claims/UPN"] => issue(Type =   "http://schemas.microsoft.com/ws/2008/06/identity/claims/issuerid", Value = regexreplace(c.Value, ".+@(?<domain>.+)", "http://${domain}/adfs/services/trust/"));

Now in my setup, I had registered contoso.com first without the supportMultipleDomains switch and with the default IssuerURI value.  When I add fabrikam.com, I actually need to make sure that contoso.com is also configured to use the SupportMultiple Domains switch as the claim rule update will no longer ever send the default IssuerURI and authentication will fail due to IssuerURI miss match.  Don’t worry we will warn you about this before we allow you to use the supportMultipleDomain switch on a different domain.

To remediate this, we need to update the configuration for domain contoso.com as well.  
The Azure AD Connect wizard is pretty good about figuring out when the above needs to be done and doing the right thing when you are adding a second domain.  On first pass, if you are already in SupportMultipleDomain configuration, we will not overwrite you.

In PowerShell, you need to provide the SupportMultipleDomain switch manually.

See below for all of the detailed steps to transition from single domain to multiple domains.

Once we’ve done this, we will then have configuration for two domains in Azure AD:

- DomainName: contoso.com
- IssuerURI: http://contoso.com/adfs/services/trust 
- PassiveClientSignInUrl: https://fs.contoso100.com/adfs/ls/ 
- DomainName: fabrikam.com
- IssuerURI: http://fabrikam.com/adfs/services/trust 
- PassiveClientSignInUrl: https://fs.contoso100.com/adfs/ls/ 

Federated sign on for users from the contoso.com and the fabrikam.com domains will now be working.  There is only one remaining problem: sign on for users in sub domains.

##Sub domains
Let’s say I add my sub domain sub.contoso.com to Azure AD.  Because of the way Azure AD manages domains, the sub domain will inherit the settings of the parent domain, in this case contoso.com.  This means the IssuerURI for user@sub.contoso.com will need to be http://contoso.com/adfs/services/trust.  However the standard rule implemented above for 

Azure AD, will generate a token with an issuer as http://sub.contoso.com/adfs/services/trust, which will not match the domain’s required value and authentication will fail.
Luckily, we have a workaround for this as well, but it is not as well built in to our tools.  You have to update your AD FS relying party trust for Microsoft Online manually.  

You have to configure the custom claim rule so that it strips off any subdomains from the user’s UPN suffix when constructing the custom Issuer value.  You can find the exact steps to do this in the steps below.

So in summary, you can have multiple domains with disparate names, as well as sub domains, all federated to the same AD FS server, it just takes a few extra steps to ensure the Issuer values are set correctly for all users.
