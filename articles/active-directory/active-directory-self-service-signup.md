<properties
	pageTitle="What is Self-Service Signup for Azure? | Microsoft Azure"
	description="An overview self-service signup for Azure, how to manage the signup process, and how to take over a DNS domain name."
	services="active-directory"
	documentationCenter=""
	authors="curtand"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="identity"
	ms.date="05/10/2016"
	ms.author="curtand"/>


# What is Self-Service Signup for Azure?

This topic explains the self-service signup process and how to take over a DNS domain name.  

## Why use self-service signup?

- Get customers to services they want faster.
- Create email-based offers for a service.
- Create email-based signup flows which quickly allow users to create identities using their easy-to-remember work email aliases.
- Unmanaged Azure directories can be made into managed directories later and be reused for other services.

## Terms and Definitions

+ **Self-service sign up**: This is the method by which a user signs up for a cloud service and has an identity automatically created for them in Azure Active Directory (Azure AD) based on their email domain.
+ **Unmanaged Azure directory**: This is the directory where that identity is created. An unmanaged directory is a directory that has no global administrator.
+ **Email-verified user**: This is a type of user account in Azure AD. A user who has an identity created automatically after signing up for a self-service offer is known as an email-verified user. An email-verified user is a regular member of a directory tagged with creationmethod=EmailVerified.

## User experience

For example, let's say a user whose email is Dan@BellowsCollege.com receives sensitive files via email. The files have been protected by Azure Rights Management (Azure RMS). But Dan's organization, Bellows College, has not signed up for Azure RMS, nor has it deployed Active Directory RMS. In this case, Dan can sign up for a free subscription to RMS for individuals in order to read the protected files.

If Dan is the first user with an email address from BellowsCollege.com to sign up for this self-service offering, then an unmanaged directory will be created for BellowsCollege.com in Azure AD. If other users from the BellowsCollege.com domain sign up for this offering or a similar self-service offering, they will also have email-verified user accounts created in the same unmanaged directory in Azure.

## Admin experience

An admin who owns the DNS domain name of an unmanaged Azure directory can take over or merge the directory after proving ownership. The next sections explain the admin experience in more detail, but here's a summary:

- When you take over an unmanaged Azure directory, you simply become the global administrator of the unmanaged directory. This is sometimes called an internal takeover.
- When you merge an unmanaged Azure directory, you add the DNS domain name of the unmanaged directory to your managed Azure directory and a mapping of users-to-resources is created so users can continue to access services without interruption. This is sometimes called an external takeover.

## What gets created in Azure Active Directory?

#### directory

- An Azure Active Directory directory for the domain is created, one directory per domain.
- The Azure AD directory directory has no global admin.

#### Users

- For each user who signs up, a user object is created in the Azure AD directory.
- Each user object is marked as external.
- Each user is given access to the service that they signed up for.

### How do I claim a self-service Azure AD directory for a domain I own?

You can claim a self-service Azure AD directory by performing domain validation. Domain validation proves you own the domain by creating DNS records.

There are two ways to do a DNS takeover of an Azure AD directory:

- internal takeover (Admin discovers an unmanaged Azure directory, and wants to turn into a managed directory)
- external takeover (Admin tries to add a new domain to their managed Azure directory)

You might be interested in validating that you own a domain because you are taking over an unmanaged directory after a user performed self-service signup, or you might be adding a new domain to an existing managed directory. For example, you have a domain named contoso.com and you want to add a new domain named contoso.co.uk or contoso.uk.

## What is domain takeover?  

This section covers how to validate that you own a domain

### What is domain validation and why is it used?

In order to perform operations on a directory, Azure AD requires that you validate ownership of the DNS domain.  Validation of the domain allows you to claim the directory and either promote the self-service directory to a managed directory, or merge the self-service directory into an existing managed directory.

## Examples of domain validation

There are two ways to do a DNS takeover of a directory:

+ internal takeover  (For example, an admin discovers a self-service, unmanaged directory, and wants to turn into managed directory)
+ external takeover (For example, a admin tries to add a new domain to a managed directory)

### Internal Takeover - promote a self-service, unmanaged directory to be a managed directory

When you do internal takeover, the directory gets converted from an unmanaged directory to a managed directory. You need to complete DNS domain name validation, where you create an MX record or a TXT record in the DNS zone. That action:

+ Validates that you own the domain
+ Makes the directory managed
+ Makes you the global admin of the directory

Let's say an IT administrator from Bellows College discovers that users from the school have signed up for self-service offerings. As the registered owner of the DNS name BellowsCollege.com, the IT administrator can validate ownership of the DNS name in Azure and then take over the unmanaged directory. The directory then becomes a managed directory, and the IT administrator is assigned the global administrator role for the BellowsCollege.com directory.

### External Takeover - merge a self-service directory into an existing managed directory

In an external takeover, you already have a managed directory and you want all users and groups from an unmanaged directory to join that managed directory, rather than own two separate directories.

As an admin of a managed directory, you add a domain, and that domain happens to have an unmanaged directory associated with it.

For example, let's say you are an IT administrator and you already have a managed directory for Contoso.com, a domain name that is registered to your organization. You discover that users from your organization have performed self-service sign up for an offering by using email domain name user@contoso.co.uk, which is another domain name that your organization owns. Those users currently have accounts in an unmanaged directory for contoso.co.uk.

You don't want to manage two separate directories, so you merge the unmanaged directory for contoso.co.uk into your existing IT managed directory for contoso.com.

External takeover follows the same DNS validation process as internal takeover.  Difference being: users and services are remapped to the IT managed directory.

#### What's the impact of performing an external takeover?

With an external takeover, a mapping of users-to-resources is created so users can continue to access services without interruption. Many applications, including RMS for individuals, handle the mapping of users-to-resources well, and users can continue to access those services without change. If an application does not handle the mapping of users-to-resources effectively, external takeover may be explicitly blocked to prevent users from a poor experience.

#### directory takeover support by service

Currently the following services support takeover:

- RMS


The following services will soon be supporting takeover:

- PowerBI

The following do not and require additional admin action to migrate user data after an external takeover.

- SharePoint/OneDrive


## How to perform a DNS domain name takeover

You have a few options for how to perform a domain validation (and do a takeover if you wish):

1.  Azure Management Portal

	A takeover is triggered by doing a domain addition.  If a directory already exists for the domain, you'll have the option to perform an external takeover.

	Sign in to the Azure portal using your credentials.  Navigate to your existing directory and then to **Add domain**.

2.  Office 365

	You can use the options on the [Manage domains](https://support.office.com/article/Navigate-to-the-Office-365-Manage-domains-page-026af1f2-0e6d-4f2d-9b33-fd147420fac2/) page in Office 365 to work with your domains and DNS records. See [Verify your domain in Office 365](https://support.office.com/article/Verify-your-domain-in-Office-365-6383f56d-3d09-4dcb-9b41-b5f5a5efd611/).

3.  Windows PowerShell

	The following steps are required to perform a validation using Windows PowerShell.

	Step	|	Cmdlet to use
	-------	| -------------
	Create a credential object | Get-Credential
	Connect to Azure AD	| Connect-MsolService
	get a list of domains	| Get-MsolDomain
	Create a challenge	| Get-MsolDomainVerificationDns
	Create DNS record	| Do this on your DNS server
	Verify the challenge	| Confirm-MsolEmailVerifiedDomain

For example:

1. Connect to Azure AD using the credentials that were used to respond to the self-service offering:
		import-module MSOnline
		$msolcred = get-credential
		connect-msolservice -credential $msolcred

2. Get a list of domains:

	Get-MsolDomain

3. Then run the Get-MsolDomainVerificationDns cmdlet to create a challenge:

	Get-MsolDomainVerificationDns –DomainName *your_domain_name* –Mode DnsTxtRecord

	For example:

	Get-MsolDomainVerificationDns –DomainName contoso.com –Mode DnsTxtRecord

4. Copy the value (the challenge) that is returned from this command.

	For example:

	MS=32DD01B82C05D27151EA9AE93C5890787F0E65D9

5. In your public DNS namespace, create a DNS txt record that contains the value that you copied in the previous step.

	The name for this record is the name of the parent domain, so if you create this resource record by using the DNS role from Windows Server, leave the Record name blank and just paste the value into the Text box

6. Run the Confirm-MsolDomain cmdlet to verify the challenge:

	Confirm-MsolEmailVerifiedDomain -DomainName *your_domain_name*

	for example:

	Confirm-MsolEmailVerifiedDomain -DomainName contoso.com

A successful challenge returns you to the prompt without an error.

## How do I control self-service settings?

Admins have two self-service controls today. They can control:

- Whether or not users can join the directory via email.
- Whether or not users can license themselves for applications and services.


### How can I control these capabilities?

An admin can configure these capabilities using these Azure AD cmdlet Set-MsolCompanySettings parameters:

+ **AllowEmailVerifiedUsers** controls whether a user can create or join an unmanaged directory. If you set that parameter to $false, no email-verified users can join the directory.
+ **AllowAdHocSubscriptions** controls the ability for users to perform self-service sign up. If you set that parameter to $false, no users can perform self-service signup.


### How do the controls work together?

These two parameters can be used in conjunction to define more precise control over self-service sign up. For example, the following command will allow users to perform self-service sign up, but only if those users already have an account in Azure AD (in other words, users who would need an email-verified account to be created cannot perform self-service sign up):

	Set-MsolCompanySettings -AllowEmailVerifiedUsers $false -AllowAdHocSubscriptions $true

The following flowchart explains all the different combinations for these parameters and the resulting conditions for the directory and self-service sign up.

![][1]

For more information and examples of how to use these parameters, see [Set-MsolCompanySettings](https://msdn.microsoft.com/library/azure/dn194127.aspx).

## See Also

-  [How to install and configure Azure PowerShell](../powershell-install-configure/)

-  [Azure PowerShell](https://msdn.microsoft.com/library/azure/jj156055.aspx)

-  [Azure Cmdlet Reference](https://msdn.microsoft.com/library/azure/jj554330.aspx)

-  [Set-MsolCompanySettings](https://msdn.microsoft.com/library/azure/dn194127.aspx)

<!--Image references-->
[1]: ./media/active-directory-self-service-signup/SelfServiceSignUpControls.png
