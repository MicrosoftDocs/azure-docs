---
title: Configure the admin consent workflow
description: Learn how to configure a way for end users to request access to applications that require admin consent. 
services: active-directory
author: eringreenlee
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 09/02/2022
ms.author: ergreenl
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
- You must be a global administrator to turn on the admin consent workflow.

## Enable the admin consent workflow

To enable the admin consent workflow and choose reviewers:

1. Sign-in to the [Azure portal](https://portal.azure.com)  with one of the roles listed in the prerequisites.
1. Search for and select **Azure Active Directory**.
1. Select **Enterprise applications**.
1. Under **Manage**, select **User settings**.
Under **Admin consent requests**,  select **Yes** for **Users can request admin consent to apps they are unable to consent to** .
   :::image type="content" source="media/configure-admin-consent-workflow/enable-admin-consent-workflow.png" alt-text="Configure admin consent workflow settings":::
1. Configure the following settings:

   - **Select users, groups, or roles that will be designated as reviewers for admin consent requests** - Reviewers can view, block, or deny admin consent requests, but only global administrators can approve admin consent requests. People designated as reviewers can view incoming requests in the **My Pending** tab after they have been set as reviewers. Any new reviewers won't be able to act on existing or expired admin consent requests.
   - **Selected users will receive email notifications for requests** - Enable or disable email notifications to the reviewers when a request is made.  
   - **Selected users will receive request expiration reminders** - Enable or disable reminder email notifications to the reviewers when a request is about to expire.  
   - **Consent request expires after (days)** - Specify how long requests stay valid.
1. Select **Save**. It can take up to an hour for the workflow to become enabled.

> [!NOTE]
> You can add or remove reviewers for this workflow by modifying the **Select admin consent requests reviewers** list. A current limitation of this feature is that a reviewer can retain the ability to review requests that were made while they were designated as a reviewer.

## Configure the admin consent workflow using Microsoft Graph

To configure the admin consent workflow programmatically, use the [Update adminConsentRequestPolicy](/graph/api/adminconsentrequestpolicy-update) API in Microsoft Graph.

## Next steps

[Grant tenant-wide admin consent to an application](grant-admin-consent.md)

[Reivew admin consent requests](review-admin-consent-requests.md)
