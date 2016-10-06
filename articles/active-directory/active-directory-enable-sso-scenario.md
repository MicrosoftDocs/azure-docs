<properties
    pageTitle="Managing Applications with Azure Active Directory | Microsoft Azure"
    description="This article the benefits of integrating Azure Active Directory with your on-premises, cloud and SaaS applications."
    services="active-directory"
    documentationCenter=""
    authors="markusvi"
    manager="femila"
    editor=""/>

   <tags
      ms.service="active-directory"
      ms.devlang="na"
      ms.topic="article"
      ms.tgt_pltfrm="na"
      ms.workload="identity"
      ms.date="07/20/2016"
      ms.author="markvi"/>

# Managing Applications with Azure Active Directory

Beyond the actual workflow or content, businesses have two basic requirements for all applications:

1. To increase productivity, applications should be easy to discover and access

2. To enable security and governance, the organization needs control and oversight on who can and actually is accessing each application

In the world of cloud applications this can best be achieved using identity to control “*WHO is allowed to do WHAT*”.

In computing terminology:

- *Who* is known as *identity* - the management of users and groups

- *What* is known as *access management* – the management of access to protected resources

Both components together are known as *Identity and Access Management (IAM)*, which is defined by the [Gartner](http://www.gartner.com/it-glossary/identity-and-access-management-iam) group as “*the security discipline that enables the right individuals to access the right resources at the right times for the right reasons*”.

Okay, so what’s the problem? If IAM is *not managed* in one place with an integrated solution:

- Identity administrators have to individually create and update user accounts in all applications separately, a redundant and time consuming activity.

- Users have to memorize multiple credentials to access the applications they need to work with. As a result, users tend to write down their passwords or use other password management solutions which introduces other data security risks.

- Redundant, time consuming activities reduce the amount of time users and administrators are working on business activities that increase your business’s bottom line.

So, what generally prevents organizations from adopting integrated IAM solutions?

- Most technical solutions are based on software platforms that need to be deployed and adapted by each organization for their own applications.

- Cloud applications are often adopted at a higher rate than IT organization can integrate with existing IAM solutions.

- Security and monitoring tooling require additional customization and integration to achieve comprehensive E2E scenarios.

## Azure Active Directory integrated with applications

Azure Active Directory is Microsoft’s comprehensive Identity as a Service (IDaaS) solution that:

- Enables IAM as a cloud service 

- Provides central access management, single-sign on (SSO), and reporting 

- Supports integrated access management for [thousands of applications](https://azure.microsoft.com/marketplace/active-directory/) in the application gallery, including Salesforce, Google Apps, Box, Concur, and more. 


With Azure Active Directory, all applications you publish for your partners and customers (business or consumer) have the same identity and access management capabilities.<br> 
This enables you to significantly reduce your operational costs.

What if you need to implement an application that is not yet listed in the application gallery? While this is a bit more time-consuming than configuring SSO for applications from the application gallery, Azure AD provides you with a wizard that helps you with the configuration.

The value of Azure AD goes beyond “just” cloud applications. You can also use it with on-premises applications by providing secure remote access. With secure remote access, you can eliminate the the need for VPNs or other traditional remote access management implementations.

By providing central access management and single sign on (SSO) for all your applications, Azure AD provides the solution to the main data security and productivity problems.

- Users can access multiple applications with one sign on giving more time to income generating or business operations activities done.

- Identity administrators can manage access to applications in one place.

The benefit for the user and for your company is obvious. Let’s take a closer look at the benefits for an identity administrator and the organization.

## Integrated application benefits

The SSO process has two steps:

- Authentication, the process of validating the user’s identity.

- Authorization, the decision to enable or block access to a resource with an access policy.

When using Azure AD to manage applications and enable SSO:

- Authentication is done on the user’s on-premises (e.g. AD) or Azure AD account.

- Authorization executes on the Azure AD assignment and protection policy ensuring consistent end user experience and enabling you to add assignment, locations, and MFA conditions on any application, regardless of its internal capabilities.

It important to understand that the way the authorization is enacted on the target application varies depending on how the application was integrated with Azure AD.

- **Applications pre-integrated by service provider** Like Office 365 and Azure, these are applications built directly on Azure AD and relying on it for their comprehensive identity and access management capabilities. Access to these applications is enabled through directory information and token issuance.

- **Applications pre-integrated by Microsoft and custom applications** These are independent cloud applications that rely on an internal application directory and can operate independently of Azure AD. Access to these applications is enabled by issuing an application specific credential mapped to an application account. Depending on the application capabilities, the credential may be a federation token or user-name and password for an account that was previously provisioned in the application.

- **On-premises applications** Applications published through the Azure AD application proxy primarily enabling access to on-premises applications. These applications rely on a central on premise directory like Windows Server Active Directory. Access to these applications is enabled by triggering the proxy to deliver the application content to the end user while honoring the on-premises sign-on requirement.

For example, if a user joins your organization, you need to create an account for the user in Azure AD for the primary sign-on operations. If this user requires access to a managed application such as Salesforce, you also need to create an account for this user in Salesforce and link it to the Azure account to make SSO work. When the user leaves your organization, it is advisable to delete the Azure AD account and all counterpart accounts in the IAM stores of the applications the user had access to.

## Access detection

In modern enterprises, IT departments are often not aware of all the cloud applications that are being used. In conjunction with Cloud App Discovery, Azure AD provides you with a solution to detect these applications.

## Account management

Traditionally, managing accounts in the various applications is a manual process performed by IT or support personal in the organization. Azure AD fully automated account management across all service provider integrated applications and those applications pre-integrated by Microsoft supporting automated user provisioning or SAML JIT.

## Automated user provisioning

Some applications provide automation interfaces for creation and removal (or deactivation) of accounts. If a provider offers such an interface, it is leveraged by Azure AD. This reduces your operational costs because administrative tasks happen automatically, and improves the security of your environment because it decreases the chance of unauthorized access.

## Access management

Using Azure AD you can manage access to applications using individual or rule driven assignments. You can also delegate access management to the right people in the organization ensuring the best oversight and reducing the burden on helpdesk.

## On-premises applications

The built in application proxy enables you to publish your on-premises applications to your users resulting in both consistent access experience with modern cloud application and the benefits from Azure AD monitoring, reporting, and security capabilities.

## Reporting and monitoring

Azure AD provides you with pre-integrated reporting and monitoring capabilities that enable you to know who has access to applications and when they actually used them.

## Related capabilities

With Azure AD you can secure your applications with granular access policies and pre-integrated MFA. To learn more about Azure MFA see [Azure MFA](https://azure.microsoft.com/services/multi-factor-authentication/).

## Getting started

To get started integrating applications with Azure AD, take a look at the [Integrating Azure Active Directory with applications getting started guide](active-directory-integrating-applications-getting-started.md).

## See also

[Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
