---
title: Frequently asked questions about the admin consent workflow
description: Find answers to frequently asked questions (FAQs) about the admin consent workflow.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: reference
ms.date: 05/27/2022
ms.author: jomondi
ms.reviewer: ergreenl
ms.collection: M365-identity-device-management
ms.custom: enterprise-apps
---

# Microsoft Entra admin consent workflow frequently asked questions

## I enabled a workflow, but when testing the functionality, why can’t I see the new “Approval required” prompt that allows me to request access?

After enabling the feature, it may take up to 60 minutes for users to see the update, though it's usually available to all users within a few minutes.

## As a reviewer, why can’t I see all pending requests?

Reviewers can only see admin requests that are created after they're designated as a reviewer. If you've recently been added as a reviewer, you won't see requests that were created before your assignment.

## As a reviewer, why do I see multiple requests for the same application?
  
If an application is configured to use static and dynamic consent to request access to their user’s data, you'll see two admin consent requests. One request represents the static permissions, and the other represents the dynamic permissions.

## As a requestor, can I check the status of my request?

No, requestors are only able to receive updates using email notifications.

## As a reviewer, is it possible to approve the application, but not for everyone?

If you're concerned about granting admin consent and allowing all users in the tenant to use the application, you should deny the request. You can then manually grant admin consent by restricting access to the application. Configure the application to require user assignment, and assign users or groups to the application to restrict access. For more information, see [Methods for assigning users and groups](./assign-user-or-group-access-portal.md).

## I have an application that requires user assignment. A user that I assigned to an application is being asked to request admin consent instead of being able to consent themselves. Why is that?

When access to an application is restricted using the "user assignment required" setting, an administrator needs to consent to all the permissions requested by the application.
