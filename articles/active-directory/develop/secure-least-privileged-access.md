---
title: "Increase app security with the principle of least privilege"
titleSuffix: Microsoft identity platform
description: Learn how the principle of least privilege can help increase the security of your application, its data, and which features of the Microsoft identity platform you can use to implement least privileged access.
services: active-directory
author: Chrispine-Chiedo
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/09/2021
ms.custom: template-concept
ms.author: cchiedo
ms.reviewer: yuhko, saumadan, marsma

# Customer intent: As a developer, I want to learn about the principle of least privilege and the features of the Microsoft identity platform that I can use to ensure my application and its users are restricted to actions and have access to only the data they need perform their tasks.
---

# Enhance security with the principle of least privilege

The information security principle of least privilege asserts that users and applications should be granted access only to the data and operations they require to perform their jobs.

Follow the guidance here to help reduce your application's attack surface and the impact of a security breach (the *blast radius*) should one occur in your Microsoft identity platform-integrated application.

## Recommendations at a glance

- Prevent **overprivileged** applications by revoking *unused* and *reducible* permissions.
- Use the identity platform's **consent** framework to require that a human consents to the app's request to access protected data.
- **Build** applications with least privilege in mind during all stages of development.
- **Audit** your deployed applications periodically to identify overprivileged apps.

## What's an *overprivileged* application?

Any application that's been granted an **unused** or **reducible** permission is considered "overprivileged." Unused and reducible permissions have the potential to provide unauthorized or unintended access to data or operations not required by the app or its users to perform their jobs.

:::row:::
   :::column span="":::
      ### Unused permissions

        An unused permission is a permission that's been granted to an application but whose API or operation exposed by that permission isn't called by the app when used as intended.

        - **Example**: An application displays a list of files stored in the signed-in user's OneDrive by calling the Microsoft Graph API and leveraging the [Files.Read](/graph/permissions-reference) permission. However, the app has also been granted the [Calendars.Read](/graph/permissions-reference#calendars-permissions) permission, yet it provides no calendar features and doesn't call the Calendars API.

        - **Security risk**: Unused permissions pose a *horizontal privilege escalation* security risk. An entity that exploits a security vulnerability in your application could use an unused permission to gain access to an API or operation not normally supported or allowed by the application when it's used as intended.

        - **Mitigation**: Remove any permission that isn't used in API calls made by your application.
   :::column-end:::
   :::column span="":::
      ### Reducible permissions

        A reducible permission is a permission that has a lower-privileged counterpart that would still provide the application and its users the access they need to perform their required tasks.

        - **Example**: An application displays the signed-in user's profile information by calling the Microsoft Graph API, but doesn't support profile editing. However, the app has been granted the [User.ReadWrite.All](/graph/permissions-reference#user-permissions) permission. The *User.ReadWrite.All* permission is considered reducible here because the less permissive *User.Read.All* permission grants sufficient read-only access to user profile data.

        - **Security risk**: Reducible permissions pose a *vertical privilege escalation* security risk. An entity that exploits a security vulnerability in your application could use the reducible permission for unauthorized access to data or to perform operations not normally allowed by that entity's role.

        - **Mitigation**: Replace each reducible permission in your application with its least-permissive counterpart still enabling the application's intended functionality.
   :::column-end:::
:::row-end:::

Avoid security risks posed by unused and reducible permissions by granting *just enough* permission: the permission with the least-permissive access required by an application or user to perform their required tasks.

## Use consent to control access to data

Most applications you build will require access to protected data, and the owner of that data needs to [consent](application-consent-experience.md#consent-and-permissions) that access. Consent can be granted in several ways, including by a tenant administrator who can consent for *all* users in an Azure AD tenant, or by the application users themselves who can grant access

Whenever an application that runs in your user's device requests access to protected data, the app should ask for the user's consent before granting access to the protected data. The end user is required to grant (or deny) consent for the requested permission before the application can progress.

:::image type="content" source="./media/least-privilege-best-practice/api-permissions.png" alt-text="Azure portal screenshot showing an app registration's API permissions pane":::

## Least privilege during app development

As a developer building an application, consider the security of your app and its users' data to be *your* responsibility.

Adhere to these guidelines during application development to help avoid building an overprivileged app:

- Fully understand the permissions required for the API calls that your application needs to make.
- Understand the least privileged permission for each API call that your app needs to make using [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).
- Find the corresponding [permissions](/graph/permissions-reference) from least to most privileged.
- Remove any duplicate sets of permissions in cases where your app makes API calls that have overlapping permissions.
- Apply only the least privileged set of permissions to your application by choosing the least privileged permission in the permission list.

## Least privilege for deployed apps

Organizations often hesitate to modify running applications to avoid impacting their normal business operations. However, your organization should consider mitigating the risk of a security incident made possible or more severe by your app's overprivileged permissions to be worthy of a scheduled application update.

Make these standard practices in your organization to help ensure your deployed apps aren't overprivileged and don't become overprivileged over time:

- Evaluate the API calls being made from your applications.
- Use [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) and the [Microsoft Graph](/graph/overview) documentation for the required and least privileged permissions.
- Audit privileges that are granted to users or applications.
- Update your applications with the least privileged permission set.
- Conduct permissions reviews regularly to make sure all authorized permissions are still relevant.

## Next steps

**Protected resource access and consent**

For more information about configuring access to protected resources and the user experience of providing consent to access those protected resources, see the following articles:

- [Permissions and consent in the Microsoft identity platform](../develop/v2-permissions-and-consent.md)
- [Understanding Azure AD application consent experiences](../develop/application-consent-experience.md)

**Zero Trust** - Consider employing the least-privilege measures described here as part of your organization's proactive [Zero Trust security strategy](/security/zero-trust/).
