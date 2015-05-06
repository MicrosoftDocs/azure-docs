<properties 
	pageTitle="What is Self-Service Signup for Azure" 
	description="An overview self-service signup, and how to manage it." 
	services="active-directory" 
	documentationCenter="" 
	authors="Justinha" 
	manager="TerryLan" 
	editor="LisaToft"/>

<tags 
	ms.service="active-directory" 
	ms.devlang="na" 
	ms.topic="article" 
    ms.tgt_pltfrm="na" 
    ms.workload="identity" 
	ms.date="03/23/2015" 
	ms.author="Justinha"/>


# What is Self-Service Signup?

TBD

## Section 1:  Why was self-service signup invented?

- Get customers to services they want faster.
- Create email based (viral) offers for your service.
- Create email based signup flows which quickly allow users to create identities using their easy to remember work email.
- Unmanaged tenants can grow up into managed tenants and be reused for other services. 

## Section 2:  Terms and Definitions

+ **Self-service sign up**: This is the method by which a user signs up for a cloud service and has an identity automatically created for them in Azure Active Directory based on their email domain. 
+ **Unmanaged tenant**: This is the directory where that identity is created. An unmanaged tenant is a directory that has no global administrator. 
+ **Email-verified user**: This is a type of user account in Azure AD. A user who has an identity created automatically after signing up for a self-service offer is known as an email-verified user. An email-verified user is a regular member of a directory tagged with creationmethod=EmailVerified.

## Section:  Basic explanation of how we make a user and an Admin happy

For example, let's say a user whose email is Dan@BellowsCollege.com receives sensitive files via email. The files have been protected by Azure Rights Management Service (Azure RMS). But Dan's organization, Bellows College, has not signed up for Azure RMS, nor has it deployed Active Directory RMS. In this case, Dan can sign up for a free subscription to RMS for Individuals in order to read the protected files.

If Dan is the first user with an email address from BellowsCollege.com to sign up for this self-service offering, then an unmanaged tenant will be created for BellowsCollege.com in Azure AD. If other users from the BellowsCollege.com domain sign up for this offering or a similar self-service offering, they will also have email-verified user accounts created in the same unmanaged tenant in Azure.

Generic paragraph saying that Admins can come over and take over or merge the tenant when they prove ownership.

## What is takeover?  Both internal and external.  (Concept article)

### 	What is domain validation and why is it used?
Domain validation is the way in which the owner of a domain validates they can perform a takeover…
	
You might be interested validating that you own a domain because you are taking over an unmanaged tenant after a user performed self-service signup, or you might be adding a new domain to an existing managed tenant. For example, you have a domain named contoso.com and you want to add a new domain named contoso.co.uk or contoso.uk (this is actually DNS validation but has nothing to do with self-service sign up for unmanaged tenants). 

There are two ways to do a DNS takeover of a tenant: 

+ internal takeover  (Admin discovers viral tenant, and wants to turn into managed tenant)
+ external takeover (Admin tries to add a new domain to their managed tenant)

### Internal Takeover
When you do internal takeover, the tenant gets converted from an unmanaged tenant to a managed tenant. You need to complete DNS domain name validation, where you create an MX record or a TXT record in the DNS zone. That action:
+ Validates that you own the domain
+ The tenant becomes managed
+ You become the global admin

### External Takeover

In an external takeover, you already have a managed tenant and you want all users and groups from an unmanaged tenant to join that managed tenant, rather than own two separate tenants.

As an admin of a managed tenant, you add a domain, and that domain happens to have an unmanaged tenant associated with it.
	
For example, let's say you are an IT administrator and you already have a managed tenant for Contoso.com, a domain name that is registered to your organization. You discover that users from your organization have performed self-service sign up for an offering by using email domain name user@contoso.co.uk, which is another domain name that your organization owns. Those users currently have accounts in an unmanaged tenant for contoso.co.uk.
You don't want to manage two separate tenants, so you merge the unmanaged tenant for contoso.co.uk into your existing IT managed tenant for contoso.com.
	
External takeover follows the same DNS validation process as internal takeover.  Difference being: users and services are remapped to the IT managed tenant.
	
*A mapping of users-to-resources is created so users can continue to access services without interruption.*

### 	Service Takeover support

Many applications, including RMS for individuals, handle the mapping of users-to-resources well, and users can continue to access those services without change. If an application does not handle the mapping of users-to-resources effectively, external takeover may be explicitly blocked to prevent users from a poor experience. 

Currently the following services support takeover well:
+ RMS

The following do not:
+ SharePoint/OneDrive
+ PowerBI - Soon to be fixed

Let's say an IT administrator from Bellows College discovers that users from the school have signed up for self-service offerings. As the registered owner of the DNS name BellowsCollege.com, the IT administrator can validate ownership of the DNS name in Azure and then take over the unmanaged tenant. The tenant then becomes a managed tenant, and the IT administrator is assigned the global administrator role for the BellowsCollege.com directory. 
	
Advice for when you run into ones that don't.

	<Link to Office url support guide>
	
	<Insert UI for external takeover>

## How do I perform a takeover (how to guide)

How can you validate that you own a domain? In a case like this, you can perform domain validation using a few methods.

1.  Azure UI

	You would sign in to the existing managed tenant, then add the domain name of the unmanaged tenant, then validate DNS domain ownership, the you get a dialog that says 'this is a separate tenant, do you want to merge it in? Realize that merging the tenant may cause such and such to happen' - this goes back to Office and SharePoint ability to map users to resources. We should be clear in docs about what are all the implications.
	<<Insert UI showing Azure merge>>


2.  Office UI

		Quick blurb
	<Link to Office article and UI>


3.  Windows PowerShell
The following steps are required to perform a validation using Windows PowerShell.

Step	|	Cmdlet to use
-------	| -------------
Connect to Azure AD	| Connect-MsolService
Specify your domain	| New-MsolDomain
Create a challenge	| Get-MsolDomainVerificationDns
Create DNS record	| Do this on your DNS server
Verify the challenge	| Confirm-MsolDomain

For example:
1. Connect to Azure AD by running the following cmdlets:
		import-module MSOnline
		$msolcred = get-credential
		connect-msolservice -credential $msolcred
		
2. Specify your domain, by using the New-MsolDomain cmdlet:
	New-MsolDomain -Name <your-domain_name>
for example:
	New-MsolDomain -Name contoso.com
3. Then run the Get-MsolDomainVerificationDns cmdlet to create a challenge:
	Get-MsolDomainVerificationDns –DomainName <your_domain_name> –Mode DnsTxtRecord
For example: 
	Get-MsolDomainVerificationDns –DomainName contoso.com –Mode DnsTxtRecord
4. Copy the value (the challenge) that is returned from this command.
For example: 
	MS=32DD01B82C05D27151EA9AE93C5890787F0E65D9
5. In your public DNS namespace, create a DNS txt record that contains the value that you copied in the previous step.
The name for this record is the name of the parent domain, so if you create this resource record by using the DNS role from Windows Server, leave the Record name blank and just paste the value into the Text box
6. Run the Confirm-MsolDomain cmdlet to verify the challenge:
	Confirm-MsolDomain -DomainName <your_domain_name>
for example:
	Confirm-MsolDomain –DomainName contoso.com

A successful challenge returns you to the prompt without an error.

## How do I control self-service settings?

Admins have two self-service controls today.
1. Whether or not users can join the tenant via email.
2. Whether or not users can license themselves for applications and services.


### How can I control these capabilities?

An admin can configure these capabilities using these Azure AD cmdlet Set-MsolCompanySettings parameters.
+ **AllowEmailVerifiedUsers** controls whether a user can create or join an unmanaged tenant. If you set that parameter to $false, no email-verified users can join the tenant. 
+ **AllowAdHocSubscriptions** controls the ability for users to perform self-service sign up. If you set that parameter to $false, no users can perform self-service signup. 


### How do the controls work together?

These two parameters can be used in conjunction to define more precise control over self-service sign up. For example, the following command will allow users to perform self-service sign up, but only if those users already have an account in Azure AD (in other words, users who would need an email-verified account to be created cannot perform self-service sign up):

	Set-MsolCompanySettings -AllowEmailVerifiedUsers $false -AllowAdHocSubscriptions $true

The following flowchart explains all the different combinations for these parameters and the resulting conditions for the tenant and self-service sign up.

![][1]

For more information and examples of how to use these parameters, see [Set-MsolCompanySettings](https://msdn.microsoft.com/library/azure/dn194127.aspx).

	A. Potentially include visios showing tenant state pre-post takeover
	
	B. These can be linked to from the ‘what is’ article, the RMS article and other services leveraging ‘viral’.
		a.  Keep the article explaining MSOLCompany settings on MSDN and in the examples link to the new topic where appropriate
		
	Future of self-service -> this should be a blog post not an article until it happens.  We can link to these topics from the blog post for more visibility


## See Also

-  [How to install and configure Azure PowerShell](../powershell-install-configure/)

-  [Azure PowerShell](https://msdn.microsoft.com/library/azure/jj156055.aspx)

-  [Azure Cmdlet Reference](https://msdn.microsoft.com/library/azure/jj554330.aspx)

-  [Set-MsolCompanySettings](https://msdn.microsoft.com/library/azure/dn194127.aspx)

<!--Image references-->
[1]: ./media/active-directory-self-service-signup/SelfServiceSignUpControls.png

