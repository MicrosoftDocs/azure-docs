---
title: "Increase application security with the principle of least privilege"
description: Learn how the principle of least privilege can help increase the security of an application and its data.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 01/06/2023
ms.custom: template-concept
ms.author: davidmu
ms.reviewer: yuhko, saumadan
# Customer intent: As a developer, I want to learn about the principle of least privilege and the features of the Microsoft identity platform that I can use to make sure my application and its users are restricted to actions and have access to only the data they need perform their tasks.
---

# Enhance security with the principle of least privilege

The information security principle of least privilege asserts that users and applications should be granted access only to the data and operations they require to perform their jobs. Follow the guidance here to help reduce the attack surface of an application and the impact of a security breach (the *blast radius*) should one occur in a Microsoft identity platform-integrated application.

## Recommendations at a glance

- Prevent **overprivileged** applications by revoking *unused* and *reducible* permissions.
- Use the identity platform's **consent** framework to require that a human consent to the request from the application to access protected data.
- **Build** applications with least privilege in mind during all stages of development.
- **Audit** the deployed applications periodically to identify the ones that are overprivileged.

## Overprivileged applications

Any application that's been granted an **unused** or **reducible** permission is considered overprivileged. Unused and reducible permissions have the potential to provide unauthorized or unintended access to data or operations not required by the application or its users to perform their jobs. Avoid security risks posed by unused and reducible permissions by granting only the appropriate permissions. The appropriate permissions are the ones with the least-permissive access required by an application or user to perform their required tasks.

### Unused permissions

An unused permission is a permission that's been granted to an application but whose API or operation exposed by that permission isn't called by the application when used as intended.

- **Example**: An application displays a list of files stored in the signed-in user's OneDrive by calling the Microsoft Graph API using the [Files.Read](/graph/permissions-reference) permission. However, the application has also been granted the [Calendars.Read](/graph/permissions-reference#calendars-permissions) permission, yet it provides no calendar features and doesn't call the Calendars API.

- **Security risk**: Unused permissions pose a *horizontal privilege escalation* security risk. An entity that exploits a security vulnerability in the application could use an unused permission to gain access to an API or operation not normally supported or allowed by the application when it's used as intended.

- **Mitigation**: Remove any permission that isn't used in API calls made by the application.

### Reducible permissions

A reducible permission is a permission that has a lower-privileged counterpart that would still provide the application and its users the access they need to perform their required tasks.

- **Example**: An application displays the signed-in user's profile information by calling the Microsoft Graph API, but doesn't support profile editing. However, the application has been granted the [User.ReadWrite.All](/graph/permissions-reference#user-permissions) permission. The *User.ReadWrite.All* permission is considered reducible here because the less permissive *User.Read.All* permission grants sufficient read-only access to user profile data.

- **Security risk**: Reducible permissions pose a *vertical privilege escalation* security risk. An entity that exploits a security vulnerability in the application could use the reducible permission for unauthorized access to data or to perform operations not normally allowed by that role of the entity.

- **Mitigation**: Replace each reducible permission in the application with its least-permissive counterpart still enabling the intended functionality of the application.

## Use consent to control access to data

Most applications require access to protected data, and the owner of that data needs to [consent](consent-types-developer.md) to that access. Consent can be granted in several ways, including by a tenant administrator who can consent for *all* users in a Microsoft Entra tenant, or by the application users themselves who can grant access.

Whenever an application that runs in a device requests access to protected data, the application should ask for the consent of the user before granting access to the protected data. The user is required to grant (or deny) consent for the requested permission before the application can progress.

## Least privilege during application development

The security of an application and the user data that it accesses is the responsibility of the developer.

Adhere to these guidelines during application development to help avoid making it overprivileged:

- Fully understand the permissions required for the API calls that the application needs to make.
- Understand the least privileged permission for each API call that the application needs to make using [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).
- Find the corresponding [permissions](/graph/permissions-reference) from least to most privileged.
- Remove any duplicate sets of permissions in cases where the application makes API calls that have overlapping permissions.
- Apply only the least privileged set of permissions to the application by choosing the least privileged permission in the permission list.

## Least privilege for deployed applications

Organizations often hesitate to modify running applications to avoid impacting their normal business operations. However, an organization should consider mitigating the risk of a security incident made possible or more severe by using overprivileged permissions to be worthy of a scheduled application update.

Make these standard practices in an organization to help make sure that deployed applications aren't overprivileged and don't become overprivileged over time:

- Evaluate the API calls being made from the applications.
- Use [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) and the [Microsoft Graph](/graph/overview) documentation for the required and least privileged permissions.
- Audit privileges that are granted to users or applications.
- Update the applications with the least privileged permission set.
- Review permissions regularly to make sure all authorized permissions are still relevant.

## Next steps

- [Permissions and consent in the Microsoft identity platform](./permissions-consent-overview.md)
- [Understanding Microsoft Entra application consent experiences](../develop/application-consent-experience.md)
