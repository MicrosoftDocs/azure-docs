---
title: Best practices for least privileged access on Azure AD - Microsoft identity platform
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

# Best practices for least privileged access for applications

The principle of least privilege is an information security concept, which enforces the idea that users and applications should be granted the minimum level of access needed to perform required tasks. Understanding the principle of least privilege helps you build trustworthy applications for your customers.

Least privilege adoption is more than just a good security practice. The concept helps you preserve the integrity and security of your data. It also protects the privacy of your data and reduces risks by preventing applications from having access to data any more than absolutely needed. Looked at on a broader level, the adoption of the least privilege principle is one of the ways organizations can embrace proactive security with [Zero Trust](https://www.microsoft.com/security/business/zero-trust).

This article describes a set of best practices that you can use to adopt the least privilege principle to make your applications more secure for end users. You'll get to understand the following aspects of least privilege:
- How consent works with permissions
- What it means for an app to be overprivileged or least privileged
- How to approach least privilege as a developer
- How to approach least privilege as an organization

## Using consent to control access permissions to data

Access to protected data requires [consent](../develop/application-consent-experience.md#consent-and-permissions) from the end user. Whenever an application that runs in your user's device requests access to protected data, the app should ask for the user's consent before granting access to the protected data. The end user is required to grant (or deny) consent for the requested permission before the application can progress. As an application developer, it's best to request access permission with the least privilege.

:::image type="content" source="./media/least-privilege-best-practice/api-permissions.png" alt-text="Azure portal screenshot showing an app registration's API permissions pane.":::

## Overprivileged and least privileged applications

An overprivileged application may have one of the following characteristics:
- **Unused permissions**: An application could end up with unused permissions when it fails to make API calls that utilize all the permissions granted to it. For example in [MS Graph](/graph/overview), an app might only be reading OneDrive files (using the "*Files.Read.All*" permission) but has also been granted “*Calendars.Read*” permission, despite not integrating with any Calendar APIs.
- **Reducible permissions**: An app has reducible permission when the granted permission has a lesser privileged replacement that can complete the desired API call. For example, an app that is only reading User profiles, but has been granted "*User.ReadWrite.All*" might be considered overprivileged. In this case, the app should be granted "*User.Read.All*" instead, which is the least privileged permission needed to satisfy the request.

For an application to be considered as least privileged, it should have:
- **Just enough permissions**: Grant only the minimum set of permissions required by an end user of an application, service, or system to perform the required tasks.

## Approaching least privilege as an application developer

As a developer, you have a responsibility to contribute to the security of your customer's data. When developing your applications, you need to adopt the principle of least privilege. We recommend that you follow these steps to prevent your application from being overprivileged:
- Fully understand the permissions required for the API calls that your application needs to make
- Understand the least privileged permission for each API call that your app needs to make using [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer)
- Find the corresponding [permissions](/graph/permissions-reference) from least to most privileged
- Remove any duplicate sets of permissions in cases where your app makes API calls that have overlapping permissions
- Apply only the least privileged set of permissions to your application by choosing the least privileged permission in the permission list

## Approaching least privilege as an organization

Organizations often hesitate to modify existing applications as it might affect business operations, but that presents a challenge when already granted permissions are overprivileged and need to be revoked. As an organization, it's good practice to check and review your permissions regularly. We recommend you follow these steps to make your applications stay healthy:
- Evaluate the API calls being made from your applications
- Use [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) and the [Microsoft Graph](/graph/overview) documentation for the required and least privileged permissions
- Audit privileges that are granted to users or applications
- Update your applications with the least privileged permission set
- Conduct permissions review regularly to make sure all authorized permissions are still relevant

## Next steps

- For more information on consent and permissions in Azure Active Directory, see [Understanding Azure AD application consent experiences](../develop/application-consent-experience.md).
- For more information on permissions and consent in Microsoft identity, see [Permissions and consent in the Microsoft identity platform](../develop/v2-permissions-and-consent.md).
- For more information on Zero Trust, see [Zero Trust Deployment Center](/security/zero-trust/).
