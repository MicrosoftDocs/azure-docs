---
title: Best practices for least privilege - Microsoft identity platform
description: Learn about a set of best practices and general guidance for least privilege.
services: active-directory
author: Chrispine-Chiedo
manager: CelesteDG
 
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity 
ms.date: 04/26/2021
ms.custom: template-concept
ms.author: cchiedo
ms.reviewer: yuhko, saumadan, marsma

#Customer intent: As a developer, I want to learn how to stay least privileged and require just enough permissions for my application.
---

# Best practices for applying least privilege permissions

The principle of least privilege is an information security concept, which enforces the idea that users should be given the minimum level of access needed to perform required tasks. This concept can be extended to applications that require a set of permissions to access desired data or resources.

Least privilege enforcement is more than just a good security practice. The concept helps you preserve the integrity and accuracy of your data. It also protects the privacy of your data and reduces risks by preventing applications from having unnecessary access to sensitive information that could be used for malicious purposes.

This article describes a set of best practices that you can use to enforce least privileged permissions to make your applications more reliable and secure for end users. You'll get to understand the following aspects of least privilege:
- How consent works with permissions
- What it means to be over-privileged or least privileged
- How to approach least privilege as a developer
- Benefits of the least privilege principle

## Using consent to control permissions to resources

[Consent](../develop/application-consent-experience.md#consent-and-permissions) is becoming an important requirement in most data privacy laws across the World. Most often these laws require developers to obtain consent from end users before allowing an application to access protected data. Every time an application that runs in your user's device or service requests some permission, the app should display an authorization prompt to the user that shows what permission is being requested. The end user is required to allow (or deny) access to that specific permission before the application can progress. As an application developer it's best to request access permission with the least privilege.

![API permissions](media/least-privilege-best-practice/api-permissions.png)

## Behaviors of over-privileged and least privileged applications

An over-privileged application may have one of the following characteristics:
- **Unused permissions**: An application could end up with unused permissions when it fails to make API calls that utilize all the permissions granted to it. For example in [MS Graph](/graph/overview), an app might only be reading OneDrive Files (using the "*Files.Read.All*" permission) but has also been granted “*Calendar.Read.All*” permission, despite not integrating with any Calendar APIs.
- **Reducible permissions**: This implies that the granted permission has a least privileged replacement that can complete the desired API call. For example, an app that is only reading User profiles, but has been granted "*User.ReadWrite.All*" might be considered over-privileged. In this case, the app should be granted "*User.Read.All*" instead, which is the least privileged permission needed to satisfy the request.

For an application to be considered as least privileged, it should have:
- **Just enough permissions**: Grant only the minimum set of permissions required by an end-user application, service, or system to perform the tasks they've been assigned.
- **Minimum level of permission**: Allow lowest level of permission to perform the required API calls to complete a desired task.

![Request API permissions](media/least-privilege-best-practice/request-api-permissions.png)

## Benefits of least privilege principle

Least privilege isn't a blocker. It's important to understand the principle of least privilege to help you build trustworthy applications for your customers. Least privileged permission provides the following benefits:
- **Lower the app adoption friction**: An organization's data is protected against unauthorized access by being authenticated, identified, and authorized. Users might deny consent to give an application permission to access their data because of requesting excessive permissions.
- **Stop the spread**: By enforcing least privilege on permissions, attackers are unable to use excessive privileges to gain further access, making it difficult for attackers to locate more sensitive directories and compromise the whole system.

## How to approach least privilege as an organization and a developer

As a developer, security is your responsibility. Here's how to avoid common mistakes associated with least privilege:
- **Enforce least privilege**: Encouraging developers to understand and strive to minimize their privilege sets is one of the most effective controls an organization can put in place to protect itself from misuse of privileges. Follow these steps to prevent your application from being over-privileged:
    - Understand the API calls you need to make
    - Explore your own data from the user resource in [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)
    - Find the corresponding [permissions](/graph/permissions-reference) from least to most privileged
    - Remove any duplicate sets of permissions
    - Apply only the least privileged set of permissions to your application
- **Check and review your permissions regularly**: Cutting down excessive permissions is the number one priority for securing applications. Organizations rarely modify older applications because of need for stability, but that presents a challenge when already granted permissions are over-privileged and need to be revoked. Follow these steps to make your application stay healthy:
    - Monitor and track the API calls you made in the past. 
    - Referring to the documentation for the required and least privileged permissions
    - Audit privileges are granted to users or applications
    - Update your application with the latest permission set
    - Conduct this review regularly to make sure all authorized permissions are still relevant

Security can be measured by the management of permissions, API, and role privileges. Adhering to the principle of least privilege creates a protected and traceable environment by clearly defining high-level functions and actively controlling access to important resources.


## Next steps

- For more information on consent and permissions in Azure Active Directory, see [Understanding Azure AD application consent experiences](../develop/application-consent-experience.md).
- For more information on permissions and consent in Microsoft identity, see [Permissions and consent in the Microsoft identity platform](../develop/v2-permissions-and-consent.md).
