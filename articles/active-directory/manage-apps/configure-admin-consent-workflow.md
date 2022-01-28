---
title: Configure the admin consent workflow
titleSuffix: Azure AD
description: Learn how to configure a way for end users to request access to applications that require admin consent. 
services: active-directory
author: eringreenlee
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 10/06/2021
ms.author: ergreenl
ms.reviewer: davidmu
ms.collection: M365-identity-device-management
ms.custom: contperf-fy22q2
#customer intent: As an admin, I want to configure the admin consent workflow.
---

# Configure the admin consent workflow

In this article, you'll learn how to configure the admin consent workflow to enable users to request access to applications that require admin consent. You enable the ability to make requests by using an admin consent workflow. For more information on consenting to applications, see [Azure Active Directory consent framework](../develop/consent-framework.md).

The admin consent workflow gives admins a secure way to grant access to applications that require admin approval. When a user tries to access an application but is unable to provide consent, they can send a request for admin approval. The request is sent via email to admins who have been designated as reviewers. A reviewer takes action on the request, and the user is notified of the action.

To approve requests, a reviewer must be a global administrator, cloud application administrator, or application administrator. The reviewer must already have one of these admin roles assigned; simply designating them as a reviewer doesn't elevate their privileges.

## Prerequisites

To configure the admin consent workflow, you need:

- An Azure account. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.

## Enable the admin consent workflow

To enable the admin consent workflow and choose reviewers:

1. Sign in to the [Azure portal](https://portal.azure.com)  with one of the roles listed in the prerequisites.
1. Search for and select **Azure Active Directory**.
1. Select **Enterprise applications**.
1. Under **Manage**, select **User settings**.
Under **Admin consent requests**,  select **Yes** for **Users can request admin consent to apps they are unable to consent to** .
   :::image type="content" source="media/configure-admin-consent-workflow/enable-admin-consent-workflow.png" alt-text="Configure admin consent workflow settings":::
1. Configure the following settings:

   - **Select users to review admin consent requests** - Select reviewers for this workflow from a set of users that have the global administrator, cloud application administrator, or application administrator roles. You can also add groups and roles that can configure an admin consent workflow. You must designate at least one reviewer before the workflow can be enabled.
   - **Selected users will receive email notifications for requests** - Enable or disable email notifications to the reviewers when a request is made.  
   - **Selected users will receive request expiration reminders** - Enable or disable reminder email notifications to the reviewers when a request is about to expire.  
   - **Consent request expires after (days)** - Specify how long requests stay valid.
1. Select **Save**. It can take up to an hour for the feature to become enabled.

> [!NOTE]
> You can add or remove reviewers for this workflow by modifying the **Select admin consent requests reviewers** list. Note that a current limitation of this feature is that reviewers can retain the ability to review requests that were made while they were designated as a reviewer.

## Email notifications

If configured, all reviewers will receive email notifications when:

- A new request has been created
- A request has expired
- A request is nearing the expiration date  

Requestors will receive email notifications when:

- They submit a new request for access
- Their request has expired
- Their request has been denied or blocked
- Their request has been approved

## Audit logs

The table below outlines the scenarios and audit values available for the admin consent workflow.

|Scenario  |Audit Service  |Audit Category  |Audit Activity  |Audit Actor  |Audit log limitations  |
|---------|---------|---------|---------|---------|---------|
|Admin enabling the consent request workflow        |Access Reviews           |UserManagement           |Create governance policy template          |App context            |Currently you cannot find the user context            |
|Admin disabling the  consent request workflow       |Access Reviews           |UserManagement           |Delete governance policy template          |App context            |Currently you cannot find the user context           |
|Admin updating the consent workflow configurations        |Access Reviews           |UserManagement           |Update governance policy template          |App context            |Currently you cannot find the user context           |
|End user creating an admin consent request for an app       |Access Reviews           |Policy         |Create request           |App context            |Currently you cannot find the user context           |
|Reviewers approving an admin consent request       |Access Reviews           |UserManagement           |Approve all requests in business flow          |App context            |Currently you cannot find the user context or the app ID that was granted admin consent.           |
|Reviewers denying an admin consent request       |Access Reviews           |UserManagement           |Approve all requests in business flow          |App context            | Currently you cannot find the user context of the actor that denied an admin consent request          |

## Next steps

[Grant tenant-wide admin consent to an application](grant-admin-consent.md)
