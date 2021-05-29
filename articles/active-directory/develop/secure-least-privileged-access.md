---
title: "App security with the principle of least privilege | Azure"
titleSuffix: Microsoft identity platform
description: Learn how the principle of least privilege can help increase the security of your application, its data, and the Microsoft identity platform features you can use to implement least privileged access.
services: active-directory
author: Chrispine-Chiedo
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/28/2021
ms.custom: template-concept
ms.author: cchiedo
ms.reviewer: yuhko, saumadan, marsma

# Customer intent: As a developer, I want to learn about the principle of least privilege and the features of the Microsoft identity platform that I can use to ensure my application and its users are restricted to actions and have access to only the data they need perform their tasks.
---

# Enhance security with the principle of least privilege

The information security principle of *least privilege* specifies that users and applications should be granted access to only the data and operations they need to perform their jobs. You can reduce the risk of unauthorized access and limit the impact of a security breach (the "blast radius") by following the guidance and using the Microsoft identity platform features described here.

Consider applying these least privilege measures as part of your organization's proactive [Zero Trust security strategy](/security/zero-trust/).

## Recommendations at a glance

- Prevent **overprivileged** applications by revoking *unused* and *reducible* permissions
- Use the identity platform's **consent** framework to require that a human grant the app permission to the minimum level of access
- **Build** applications with least privilege in mind during all stages of development
- **Audit** your organization's applications periodically to identify overprivileged apps

## What's an *overprivileged* application?

An application is considered overprivileged if it's been granted **unused** or **reducible** permissions that enable access to data or operations that aren't required for it to function as designed.

- **Unused permissions**: An unused permission is a permission granted to an application whose API exposing that permission is never called by the application.
  - Example: An application displays a list of files stored in the signed-in user's OneDrive by calling the [Microsoft Graph API](/graph/overview) and leveraging the [Files.Read](/graph/permissions-reference) permission. However, the app has also been granted the [Calendars.Read](/graph/permissions-reference#calendars-permissions) permission, yet it provides no calendar features and doesn't call the Calendars API.
  - Risk: Unused permissions can provide unintended access to API functionality that could be abused by a bad actor who's exploited a security vulnerability in your application.
  - Action: Revoke all permissions not used by any of the API calls made by your application.

- **Reducible permissions**: A reducible permission is a higher-privileged permission granted to an application when that permission has a lower-privileged alternative that would still allow the application feature to function as designed.
  - Example: An application that display user profile ii calls the Microsoft Graph API to retrieve information from the signed-in user's profile but does not provide profile editing capability has been granted the [User.ReadWrite.All] permission. The *User.ReadWrite.All* permission is considered reducible in this case because *User.Read.All* is sufficient for retrieving the user's profile information from Microsoft Graph.
  - Risk: Reducible permissions pose an escalation of privilege security risk. A bad actor that exploits a security vulnerability in your application could perform more powerful operations and access more data than their role normally allows.
  - Action: Replace all reducible permissions with the lowest-privilege counterpart that's required for application functionality.

Avoid the security risks posed by unused and reducible permissions by granting **just enough permissions**: the minimum permissions required by an application or user to perform their required tasks.

## Using consent to control access permissions to data

Access to protected data requires [consent](application-consent-experience.md#consent-and-permissions) from the end user. Whenever an application that runs in your user's device requests access to protected data, the app should ask for the user's consent before granting access to the protected data. The end user is required to grant (or deny) consent for the requested permission before the application can progress. As an application developer, it's best to request access permission with the least privilege.

:::image type="content" source="./media/least-privilege-best-practice/api-permissions.png" alt-text="Azure portal screenshot showing an app registration's API permissions pane":::)

## Approaching least privilege as an application developer

As a developer, you have a responsibility to contribute to the security of your customer's data. When developing your applications, you need to adopt the principle of least privilege. We recommend that you follow these steps to prevent your application from being overprivileged:

- Fully understand the permissions required for the API calls that your application needs to make
- Understand the least privileged permission for each API call that your app needs to make using [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)
- Find the corresponding [permissions](/graph/permissions-reference) from least to most privileged
- Remove any duplicate sets of permissions in cases where your app makes API calls that have overlapping permissions
- Apply only the least privileged set of permissions to your application by choosing the least privileged permission in the permission list

## Approaching least privilege as an organization

Organizations often hesitate to modify existing applications as it might affect business operations, but that presents a challenge when already granted permissions are overprivileged and need to be revoked. As an organization, it's good practice to check and review your permissions regularly. We recommend you follow these steps to make your applications stay healthy:

- Evaluate the API calls being made from your applications
- Use [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer) and the [Microsoft Graph](/graph/overview) documentation for the required and least privileged permissions
- Audit privileges that are granted to users or applications
- Update your applications with the least privileged permission set
- Conduct permissions review regularly to make sure all authorized permissions are still relevant

## Next steps

**Protected resource access and consent**

For more information about configuring access to protected resources and the user experience of providing consent to access those protected resources, see the following articles:

- [Permissions and consent in the Microsoft identity platform](../develop/v2-permissions-and-consent.md)
- [Understanding Azure AD application consent experiences](../develop/application-consent-experience.md)

**Zero Trust**

Least privilege is one of the guiding principles of the Zero Trust security model.   [Zero Trust Resource Center](/security/zero-trust/).
