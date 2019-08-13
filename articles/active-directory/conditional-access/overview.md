---
title: What is Conditional Access in Azure Active Directory? | Microsoft Docs
description: Learn how Conditional Access in Azure Active Directory helps you to implement automated access decisions that are not only based on who tries to access a resource but also how a resource is accessed.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: overview
ms.date: 02/14/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb

#Customer intent: As an IT admin, I want to understand Conditional Access well enough so that I can control how users are accessing my resources.
ms.collection: M365-identity-device-management
---
# What is Conditional Access?

Security is a top concern for organizations using the cloud. A key aspect of cloud security is identity and access when it comes to managing your cloud resources. In a mobile-first, cloud-first world, users can access your organization's resources using a variety of devices and apps from anywhere. As a result of this, just focusing on who can access a resource is not sufficient anymore. Organizations must balance security and productivity, they must factor how a resource is accessed into an access control decision. Conditional Access is a capability of Azure Active Directory (Azure AD) that helps organizations address this need. With Conditional Access, you can implement automated access control decisions for accessing your cloud apps that are based on criteria you define.

Conditional Access policies at their simplest are if-then statements, if a user "x" wants to access resource "y", then they must use "z". Example: A payroll manager wants to access the payroll application and is required to perform multi-factor authentication to access it.

Conditional Access policies are enforced after the first-factor authentication has been completed. Conditional Access is not intended as an organization's first line of defense for scenarios like denial-of-service (DoS) attacks, but can use signals from these events to determine access.

![Control](./media/overview/81.png)

This article provides a conceptual overview of Conditional Access in Azure AD.

## Common scenarios

Azure Active Directory enables single sign-on to devices, apps, and services from anywhere. With the continued growth of scenarios like bring your own device (BYOD), working off corporate networks, and the exponential adoption of SaaS apps, organizations are faced with opposing goals:

- Allow users to be productive wherever and whenever
- Protect the organization's assets

Conditional Access provides organizations with added security when needed and stays out of your user’s way when it isn’t.

Common access concerns that Conditional Access policies can help organizations with:

- Require multi-factor authentication for administrative roles
- Require multi-factor authentication for Azure management tasks
- Block sign-ins using legacy authentication protocols
- Require trusted locations for Azure Multi-Factor Authentication registration
- Block access from specific locations
- Block risky sign-in behaviors
- Require organization managed devices for specific applications

- **[Sign-in risk](conditions.md#sign-in-risk)**: Azure AD Identity Protection detects sign-in risks. How do you restrict access if a detected sign-in risk indicates a bad actor? What if you would like to get stronger evidence that a sign-in was  performed by the legitimate user? What if your doubts are strong enough to even block specific users from accessing an app?  
- **[Network location](location-condition.md)**: Azure AD is accessible from anywhere. What if an access attempt is performed from a network location that is not under the control of your IT department? A username and password combination might be good enough as proof of identity for access attempts from your corporate network. What if you demand a stronger proof of identity for access attempts that are initiated from other unexpected countries or regions of the world? What if you even want to block access attempts from certain locations?  
- **[Device management](conditions.md#device-platforms)**: In Azure AD, users can access cloud apps from a broad range of devices including mobile and also personal devices. What if you demand that access attempts should only be performed with devices that are managed by your IT department? What if you even want to block certain device types from accessing cloud apps in your environment?
- **[Client application](conditions.md#client-apps)**: Today, you can access many cloud apps using different app types such as web-based apps, mobile apps, or desktop apps. What if an access attempt is performed using a client app type that causes known issues? What if you require a device that is managed by your IT department for certain app types?

These questions and the related answers represent common access scenarios for Azure AD Conditional Access.
Conditional Access is a capability of Azure Active Directory that enables you to handle access scenarios using a policy-based approach.

> [!VIDEO https://www.youtube.com/embed/eLAYBwjCGoA]

## Conditional Access policies

A Conditional Access policy is a definition of an access scenario using the following pattern:

![Control](./media/overview/10.png)


**When this happens** defines the reason for triggering your policy. This reason is characterized by a group of conditions that have been satisfied. In Azure AD Conditional Access, the two assignment conditions play a special role:

- **[Users](conditions.md#users-and-groups)**: The users performing an access attempt (**Who**).
- **[Cloud apps](conditions.md#cloud-apps-and-actions)**: The targets of an access attempt (**What**).

These two conditions are mandatory in a Conditional Access policy. In addition to the two mandatory conditions, you can also include additional conditions that describe how the access attempt is performed. Common examples are using mobile devices or locations that are outside your corporate network. For more information, see [Conditions in Azure Active Directory Conditional Access](conditions.md).

The combination of conditions with your access controls represents a Conditional Access policy.

![Control](./media/overview/51.png)

With Azure AD Conditional Access, you can control how authorized users can access your cloud apps. The objective of a Conditional Access policy is to enforce additional access controls on an access attempt to a cloud app based on how an access attempt is performed.

A policy-based approach to protect access to your cloud apps enables you to start drafting the policy requirements for your environment using the structure outlined in this article without worrying about the technical implementation.

## Azure AD Conditional Access and federated authentication

Conditional Access policies work seamlessly with [federated authentication](../../security/fundamentals/choose-ad-authn.md#federated-authentication). This support includes all supported conditions and controls and visibility into how policy is applied to active user sign-ins using [Azure AD reporting](../reports-monitoring/concept-sign-ins.md).

*Federated authentication with Azure AD* means that a trusted authentication service handles user authentication to Azure AD. A trusted authentication service is, for example, Active Directory Federation Services (AD FS), or any other federation service. In this configuration, primary user authentication is performed at the service and then Azure AD is used to sign into individual applications. Azure AD Conditional Access is applied before access is granted to the application the user is accessing. 

When the configured Conditional Access policy requires multi-factor authentication, Azure AD defaults to using Azure MFA. If you use the federation service for MFA, you can configure Azure AD to redirect to the federation service when MFA is needed by setting `-SupportsMFA` to `$true` in [PowerShell](https://docs.microsoft.com/powershell/module/msonline/set-msoldomainfederationsettings). This setting works for federated authentication services that support the MFA challenge request issued by Azure AD using `wauth= http://schemas.microsoft.com/claims/multipleauthn`.

After the user has signed in to the federated authentication service, Azure AD handles other policy requirements such as device compliance or an approved application.

## License requirements

[!INCLUDE [Active Directory P1 license](../../../includes/active-directory-p1-license.md)]

Customers with [Microsoft 365 Business licenses](https://docs.microsoft.com/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-business-service-description) also have access to Conditional Access features. 

## Next steps

To learn how to implement Conditional Access in your environment, see [Plan your Conditional Access deployment in Azure Active Directory](plan-conditional-access.md).
