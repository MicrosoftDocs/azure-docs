---
title: Request access to an access package in Azure AD entitlement management (Preview)
description: #Required; article description that is displayed in search results.
services: active-directory
documentationCenter: ''
author: rolyon
manager: mtillman
editor: mamtakumar
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 03/01/2019
ms.author: rolyon
ms.reviewer: mamkumar
ms.collection: M365-identity-device-management


#Customer intent: As a < type of user >, I want < what? > so that < why? >.

---
# Request access to an access package in Azure AD entitlement management (Preview)

> [!IMPORTANT]
> Azure Active Directory (Azure AD) entitlement management is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Intro

## Prerequisites

- User that needs access to an access package

## Open the My Access portal

The first step is to open the My Access portal where you can request access to an access package. There are two ways to open the My Access portal.

1. Look for an email or a message from the project or business manager you are working with. The email should include a link to the access package you will need access to. Here is an example email with an access package link.

1. Click the **Request access package** link to open the access package in the My Access portal.

If you did not receive an email or message, you can find the access packages you can request by following these steps.

1. Sign in to the My Access portal at [https://myaccess.microsoft.com](https://myaccess.microsoft.com).

1. On the left, click **Request access** to see the list of access packages you can request.

## Request an access package

Once you have opened the My Access portal and found the access package you want to request, you can request access.

1. Click **Request** to request access to an access package.

    The **Request access** pane appears with additional details about the access package. 

1. If the **Business justification** box is displayed, enter a justification for needing access.

1. If **Request for specific period?** is enabled, specify the **Yes** or **No**.

1. If necessary, specify the start date and expire date.

1. When finished, click **Submit* to submit your request.

    If the access package requires approval, the request is now in a pending approval state.

## View your access and requests

The My Access portal shows what you have access to and that status of your requests.

1. In the My Access portal, on the left, click **Access I have** to see the list of access packages you have access to.

1. On the left, click **My requests** to see a list of your requests and the status.

## Cancel a request

If you submit an access request and the request is still in the **pending approval** state, you can cancel the request.

1. In the My Access portal, on the left, click **My requests** to see a list of your requests and the status.

1. Click to open the request you want to cancel.

1. If the request is still in the **pending approval** state, you can click **Cancel** to cancel the request.

1. Click **My requests** to confirm the request was canceled.

## Select a policy

If you are requesting access to an access package that has multiple policies that apply, you might be asked to select a policy. For example, an access package manager might configure an access package with two policies for two groups of internal employees. The first policy might allow access for 60 days and require approval. The second policy might allow access for 2 days and not require approval. If you encounter this scenario, you must select the policy you want to use.

## Next steps

- [Approve or deny access requests](entitlement-management-approve-requests.md)
