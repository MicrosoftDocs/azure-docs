---
title: Overview of admin consent workflow
description: Learn about the admin consent workflow in Microsoft Entra ID 
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 11/02/2022
ms.author: jomondi
ms.reviewer: ergreenl
ms.collection: M365-identity-device-management
ms.custom: enterprise-apps

#customer intent: As an admin, I want to learn about the admin consent workflow and how it affects end-user and admin consent experience
---

# Overview of admin consent workflow

There may be situations where your end-users need to consent to permissions for applications that they're creating or using with their work accounts. However, non-admin users aren't allowed to consent to permissions that require admin consent. Also, users can’t consent to applications when [user consent](configure-user-consent.md) is disabled in the user’s tenant.
 
In such situations where user consent is disabled, an admin can grant users the ability to make requests for gaining access to applications by enabling the admin consent workflow. In this article, you’ll learn about the user and admin experience when the admin consent workflow is disabled vs when it's enabled.

When attempting to sign in,  users may see a consent prompt like the one in the following screenshot: 

:::image type="content" source="media/configure-admin-consent-workflow/admin-consent-workflow-off.png" alt-text="Screenshot of consent prompt when workflow is disabled.":::

If the user doesn’t know who to contact to grant them access, they may be unable to use the application. This situation also requires administrators to create a separate workflow to track requests for applications if they're open to receiving them.
As an admin, the following options exist for you to determine how users consent to applications:
- Disable user consent. For example, a high school may want to turn off user consent so that the school IT administration has full control over all the applications that are used in their tenant. 
- Allow users to consent to the required permissions. It's NOT recommended to keep user consent open if you have sensitive data in your tenant. 
- If you still want to retain admin-only consent for certain permissions but want to assist your end-users in onboarding their application, you can use the admin consent workflow to evaluate and respond to admin consent requests. This way, you can have a queue of all the requests for admin consent for your tenant and can track and respond to them directly through the Microsoft Entra admin center. 
To learn how to configure the admin consent workflow, see [Configure the admin consent workflow](configure-admin-consent-workflow.md).

## How the admin consent workflow works

When you configure the admin consent workflow, your end users can request for consent directly through the prompt. The users may see a consent prompt like the one in the following screenshot:

:::image type="content" source="media/configure-admin-consent-workflow/consent prompt-workflow-on.png" alt-text="Screenshot of consent prompt when workflow is enabled.":::

When an administrator responds to a request, the user receives an email alert informing them that the request has been processed.

When the user submits a consent request, the request shows up in the admin consent request page in the Microsoft Entra admin center. Administrators and designated reviewers sign in to [view and act on the new requests](review-admin-consent-requests.md). Reviewers only see consent requests that were created after they were designated as reviewers. Requests show up in the following two tabs in the admin consent requests blade.
- My pending: This shows any active requests that have the signed-in user designated as a reviewer. Although reviewers can block or deny requests, only people with the correct RBAC permissions to consent to the requested permissions can do so. 
- All(Preview): All requests, active or expired, that exist in the tenant.
Each request includes information about the application and the user(s) requesting the application. 

## Email notifications

If configured, all reviewers will receive email notifications when:

- A new request has been created
- A request has expired
- A request is nearing the expiration date.

Requestors will receive email notifications when:

- They submit a new request for access
- Their request has expired
- Their request has been denied or blocked
- Their request has been approved

## Audit logs

The table below outlines the scenarios and audit values available for the admin consent workflow.

|Scenario  |Audit Service  |Audit Category  |Audit Activity  |Audit Actor  |Audit log limitations  |
|---------|---------|---------|---------|---------|---------|
|Admin enabling the consent request workflow        |Access Reviews           |UserManagement           |Create governance policy template          |App context            |Currently you can’t find the user context            |
|Admin disabling the  consent request workflow       |Access Reviews           |UserManagement           |Delete governance policy template          |App context            |Currently you can’t find the user context           |
|Admin updating the consent workflow configurations        |Access Reviews           |UserManagement           |Update governance policy template          |App context            |Currently you can’t find the user context           |
|End user creating an admin consent request for an app       |Access Reviews           |Policy         |Create request           |App context            |Currently you can’t find the user context           |
|Reviewers approving an admin consent request       |Access Reviews           |UserManagement           |Approve all requests in business flow          |App context            |Currently you can’t find the user context or the app ID that was granted admin consent.           |
|Reviewers denying an admin consent request       |Access Reviews           |UserManagement           |Approve all requests in business flow          |App context            | Currently you can’t find the user context of the actor that denied an admin consent request          |

## Next steps

- [Enable the admin consent request workflow](configure-admin-consent-workflow.md)
- [Review admin consent request](review-admin-consent-requests.md)
- [Manage consent requests](manage-consent-requests.md)
