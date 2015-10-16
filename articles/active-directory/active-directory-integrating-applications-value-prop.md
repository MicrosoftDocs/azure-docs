<properties
   pageTitle="Increase company productivity and data security by enabling single sign on with Azure Active Directory (AD) |  Microsoft Azure"
   description="This article the benefits of integrating Azure Active Directory with your on-premises, cloud and SaaS applications."
   services="active-directory"
   documentationCenter=""
   authors="ihenkel"
   manager="stevenpo"
   editor=""/>

   <tags
      ms.service="active-directory"
      ms.devlang="na"
      ms.topic="article"
      ms.tgt_pltfrm="na"
      ms.workload="identity"
      ms.date="10/09/2015"
      ms.author="inhenk"/>

# Increase company productivity and data security by enabling single sign on (SSO) with Azure Active Directory (AD)

## Overview
Businesses have two basic requirements for applications:
1.	They should enable productivity for users.
2.	They should provide the best possible security for digital assets

An application that increases productivity is easy to use. It includes intuitive design of the interface and time saving, data sharing integration with other useful applications.
Data security requires control over “WHO is allowed to do WHAT”.  

In computing terminology:

•	*Who* is known as identity - a data store that consists of users and groups
•	*What* is known as access management – management of access to protected resources

Both components together is known as Identity and Access Management (IAM), which is defined by the [Gartner group](http://www.gartner.com/it-glossary/identity-and-access-management-iam) as “the security discipline that enables the right individuals to access the right resources at the right times for the right reasons”.

Okay, so what’s the problem?  If IAM is not managed in one place with an integrated solution:

-	Identity administrators have to individually create and update user accounts in all applications separately, a redundant and time consuming activity.
-	Users have to memorize multiple credentials to access the applications they need to work with, especially since they are encouraged not to use the same password for every application for security reasons.  As a result, users tend to write down their passwords or use other password management solutions which introduces other data security risks.
-	Redundant, time consuming activities reduce the amount of time users and administrators are working on business activities that increase your business’s bottom line.
Solution

## Azure Active Directory (AD) integrated with applications
Azure Active Directory (AD) provides single sign on (SSO) and is pre-integrated with cloud-based applications such as Salesforce, Google Apps, Box, and Concur.  It can also be integrated with any other cloud-based applications including applications developed by your organization.

The value of Azure AD goes beyond “just” cloud applications. You can also use it with on-premises applications by providing secure remote access, avoiding the need for VPNs or other traditional remote access management system.

Additionally, Azure provides an application gallery where you can stand up an application on an Azure compute instance in minutes.  More applications become available on an on-going basis.

What if you need to implement an application that is not yet listed in the application gallery? While this is a bit more time-consuming than configuring SSO for applications from the application gallery, Azure AD provides you with a wizard that helps you with the configuration.

By providing single sign on (SSO) for any application hosted in any cloud, Azure Active Directory provides the solution to data security and productivity problems.

-	Users can access multiple applications with one sign in giving more time to income generating or business operations activities done.
-	Identity administrators can manage access to applications in one place.

The benefit for the user and for your company is obvious. Let’s take a closer look at the benefits for an identity administrator.

## Integrated application components
In the SSO process, there are always two accounts or identities:
-	The Azure Active Directory account used by a user for a primary (single) sign-on operation
-	The counterpart account in the application’s primary IAM service provider

**diagram goes here**

For example, if a user joins your organization, you need to create an account for the user in Azure Active Directory for the primary sign-on operations. If this user requires access to a managed application such as Salesforce, you also need to create an account for this user in Salesforce and link it to the Azure account to make SSO work. When the user leaves your organization, it is advisable to delete the Azure Active Directory and all counterpart accounts in the IAM stores of the applications the user had access to.

## Account management
Managing Azure Active Directory and counterpart accounts is usually a manual operation that is either performed by your IT staff or the support team of your application’s IAM provider.  If the application offers automated user provisioning the efficiency of this process can be improved.

## Access detection
In modern enterprises, IT departments are often not aware of all the cloud applications that are being used. In conjunction with Cloud App Discovery, Azure Active Directory provides you with a solution to detect these applications.   

## Automated user provisioning
Some applications provide automation interfaces for creation and removal (or deactivation) of accounts. If a provider offers such an interface, it is leveraged by Azure Active Directory. This reduces your operational costs because administrative tasks happen automatically, and improves the security of your environment because it decreases the chance of unauthorized access.

## Role assignment in Azure AD

Azure AD supports extensive access management for configured applications, enabling organizations to easily achieve the right access policies ranging from automatic, attribute-based assignment (ABAC or RBAC scenarios) through delegation and including administrator management. With Azure AD you can easily achieve complex policies, combining multiple management models for a single application and can even re-use management rules across applications with the same audiences.

Azure AD's application assignment focuses on two primary assignment modes:

- Individual assignment - access granted to an individual user
- Group-based assignment (paid Azure AD only) - access granted to a group of users

## Individual assignment
An IT admin with global, user, or AU privileges can select individual user accounts and grant them access to the application.

## Group-based assignment
An IT admin with global, user, or AU privileges can assign a group to the application.

A specific users' access is determined by whether they are members of the group at the time they attempt to access the application. In this mode, an administrator can effectively create an assignment rule stating "any current member of the assigned group has access to the application".

With this assignment option, administrators can benefit from any of Azure AD group management options, including attribute-based dynamic groups, external system groups (e.g. AD on premises or Workday), administrator or self-service managed groups.

A single group can be easily assigned to multiple apps, ensuring that applications with assignment affinity can share assignment rules, reducing the overall management complexity.

Using these two assignment modes, administrators can achieve any desirable assignment management approach.

Additionally, with Azure AD, usage and assignment reporting is fully integrated, enabling administrators to easily report on assignment state, assignment errors, and even usage.

## Example Scenario: Integrating Azure AD with Salesforce
Consider an application like Salesforce. In many organizations, Salesforce is primarily used by the marketing and sales organizations. Often, members of the marketing team have highly *privileged* access to Salesforce, while members of the sales team have *limited* access.

In many cases, a broad population of information workers have *restricted* access to the application. Exceptions to these rules complicate matters. It is often the prerogative of the marketing or sales leadership teams to grant a user access or change their roles independently of these generic rules.

With Azure AD, applications like Salesforce can be pre-configured for single sign-on (SSO) and automated provisioning. Once the application is configured, an administrator can take the one-time action to create and assign the appropriate groups. In this example an administrator could execute the following assignments:

- Attribute-based groups can be defined to automatically represent all members of the marketing and sales teams using attributes like department or role:
  - All members of marketing groups would be assigned to the *marketing* role in Salesforce
  - All members of sales team groups would be assigned to the *sales* role in Salesforce. A further refinement could use multiple groups that represent regional sales teams assigned to different salesforce roles.
- To enable the exception mechanism, a self-service group could be created for each role.

**diagram of this goes here**

###The exception
For example, the *salesforce marketing exception* group can be created as a self-service group. The group can be assigned to the *salesforce marketing* role and the *marketing leadership team* can be made owners. Members of the *marketing leadership team* could add or remove users, set a join policy, or even approve or deny individual users' requests to join. This is supported through an information worker appropriate experience that does not require specialized training for owners or members.

**diagram of this goes here**

In this case, all assigned users would be automatically provisioned to Salesforce. As they are added to different groups, their role assignment would be updated in Salesforce. Users would be able to discover and access Salesforce through the Microsoft application access panel, Office web clients, or even by navigating to their organizational Salesforce login page. Administrators would be able to easily view usage and assignment status using Azure AD reporting.

**diagram of this goes here**

 Administrators can employ [Azure AD conditional access](active-directory-conditional-access.md) to set access policies for specific roles. These policies can include whether access is permitted outside the corporate environment and even Multi-Factor Authentication or device requirements to achieve access in various cases.

## Getting started
To get started integrating applications with Azure AD, take a look at the [Integrating Azure Active Directory with applications getting started guide](active-directory-integrating-applications-getting-started.md).
