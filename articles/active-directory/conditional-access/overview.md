---
title: What is conditional access in Azure Active Directory? | Microsoft Docs
description: Learn how conditional access in Azure Active Directory helps you to implement automated access decisions that are not only based on who tries to access a resource but also how a resource is accessed.
services: active-directory
keywords: conditional access to apps, conditional access with Azure AD, secure access to company resources, conditional access policies
documentationcenter: ''
author: MarkusVi
manager: mtillman
editor: ''

ms.assetid: 8c1d978f-e80b-420e-853a-8bbddc4bcdad
ms.service: active-directory
ms.component: conditional-access
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 08/15/2018
ms.author: markvi
ms.reviewer: calebb
#Customer intent: As a IT admin, I want to understand conditional access well enough so that I can control how users are accessing my resources.
---

# What is conditional access in Azure Active Directory?

Security is a top concern for organizations using the cloud. A key aspect of cloud security is identity and access when it comes to managing your cloud resources. In a mobile-first, cloud-first world, users can access your organization's resources using a variety of devices and apps from anywhere. As a result of this, just focusing on who can access a resource is not sufficient anymore. To master the balance between security and productivity, you also need to factor how a resource is accessed into an access control decision. With Azure AD conditional access, you can address this requirement. Conditional access is a capability of Azure Active Directory. With conditional access, you can implement automated access control decisions for accessing your cloud apps that are based on conditions. 

![Control](./media/overview/81.png)

This article provides you with a conceptual overview of conditional access in Azure AD.



## Common scenarios

In a mobile-first, cloud-first world, Azure Active Directory enables single sign-on to devices, apps, and services from anywhere. With the proliferation of devices (including BYOD), work off corporate networks, and third-party SaaS apps, you are faced with two opposing goals:

- Empower users to be productive wherever and whenever
- Protect the corporate assets at any time

By using conditional access policies, you can apply the right access controls under the required conditions. Azure AD conditional access provides you with added security when needed and stays out of your user’s way when it isn’t. 

Following are some common access concerns that conditional access can help you with:



- **[Sign-in risk](conditions.md#sign-in-risk)**: Azure AD Identity Protection detects sign-in risks. How do you restrict access if a detected sign-in risk indicates a bad actor? What if you would like to get stronger evidence that a sign-in was  performed by the legitimate user? What if your doubts are strong enough to even block specific users from accessing an app?  

- **[Network location](location-condition.md)**: Azure AD is accessible from anywhere. What if an access attempt is performed from a network location that is not under the control of your IT department? Using a username and password combination might be good enough as proof of identity for access attempts to your resources from your corporate network. What if you demand a stronger proof of identity for access attempts that are initiated from other unexpected countries or regions of the world? What if you even want to block access attempts from certain locations?  

- **[Device management](conditions.md#device-platforms)**: In Azure AD, users can access cloud apps from a broad range of devices including mobile and also personal devices. What if you demand that access attempts should only be performed using devices that are managed by your IT department? What if you even want to block certain device types from accessing cloud apps in your environment? 

- **[Client application](conditions.md#client-apps)**: Today, you can access many cloud apps using different app types such as web-based apps, mobile apps, or desktop apps. What if an access attempt is performed using a client app type that causes known issues? What if you require a device that is managed by your IT department for certain app types? 

These questions and the related answers represent common access scenarios for Azure AD conditional access. 
Conditional access is a capability of Azure Active Directory that enables you to handle access scenarios using a policy-based approach.


## Conditional access policies

A conditional access policy is a definition of an access scenario using the following pattern:

![Control](./media/overview/10.png)

**Then do this** defines the response of your policy. It is important to note that the objective of a conditional access policy is not to grant access to a cloud app. In Azure AD, granting access to cloud apps is subject of user assignments. With a conditional access policy, you control how authorized users (users that have been granted access to a cloud app) can access cloud apps under specific conditions. In your response, you enforce additional requirements such as multi-factor authentication, a managed device, and others. In the context of Azure AD conditional access, the requirements your policy enforces are called access controls. In the most restrictive form, your policy can block access. For more information, see [Access controls in Azure Active Directory conditional access](controls.md).
     

**When this happens** defines the reason for triggering your policy. This reason is characterized by a group of conditions that have been satisfied. In Azure AD conditional access, the two assignment conditions play a special role:

- **[Users](conditions.md#users-and-groups)**: The users performing an access attempt (**Who**). 

- **[Cloud apps](conditions.md#cloud-apps)**: The targets of an access attempt (**What**).    

These two conditions are mandatory in a conditional access policy. In addition to the two mandatory conditions, you can also include additional conditions that describe how the access attempt is performed. Common examples are using mobile devices or locations that are outside your corporate network. For more information, see [Conditions in Azure Active Directory conditional access](conditions.md).   

The combination of conditions with your access controls represents a conditional access policy. 

![Control](./media/overview/51.png)

With Azure AD conditional access, you can control how authorized users can access your cloud apps. The objective of a conditional access policy is to enforce additional access controls on an access attempt to a cloud app that is driven by how an access attempt is performed.

One benefit of using a policy-based approach to protect access to your cloud apps is that you can start drafting the policy requirements for your environment using the structure outlined in this article without worrying about the technical implementation. 


## License requirements for using conditional access

Using conditional access requires an Azure AD Premium license. To find the right license for your requirements, see [Comparing generally available features of the Free, Basic, and Premium editions](https://azure.microsoft.com/pricing/details/active-directory/).


## Next steps

- If you want to know more about:
    - Conditions, see [Conditions in Azure Active Directory conditional access](conditions.md).

    - Access controls, see [Access controls in Azure Active Directory conditional access](controls.md).

- If you want to get some experience with configuring conditional access policies, see [Require MFA for specific apps with Azure Active Directory conditional access](app-based-mfa.md).

- If you are ready to configure conditional access policies for your environment, see the [best practices for conditional access in Azure Active Directory](best-practices.md). 

- If you would like a step-by-step deployment plan with recommended policies, see the [conditional access deployment plan](http://aka.ms/conditionalaccessdeploymentplan)
