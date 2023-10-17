---
title: Configure MFA Server
description: Learn how to configure settings for Azure MFA Server

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 09/13/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: jpettere

ms.collection: M365-identity-device-management
---
# Configure MFA Server settings

This article helps you to manage Azure MFA Server settings.

> [!IMPORTANT]
> In September 2022, Microsoft announced deprecation of Azure Multi-Factor Authentication Server. Beginning September 30, 2024, Azure Multi-Factor Authentication Server deployments will no longer service multifactor authentication (MFA) requests, which could cause authentications to fail for your organization. To ensure uninterrupted authentication services and to remain in a supported state, organizations should [migrate their users’ authentication data](how-to-migrate-mfa-server-to-mfa-user-authentication.md) to the cloud-based Azure MFA service by using the latest Migration Utility included in the most recent [Azure MFA Server update](https://www.microsoft.com/download/details.aspx?id=55849). For more information, see [Azure MFA Server Migration](how-to-migrate-mfa-server-to-azure-mfa.md).

The following MFA Server settings are available:

| Feature | Description |
| ------- | ----------- |
| Server settings | Download MFA Server and generate activation credentials to initialize your environment |
| [One-time bypass](#one-time-bypass) | Allow a user to authenticate without performing multi-factor authentication for a limited time. |
| [Caching rules](#caching-rules) |  Caching is primarily used when on-premises systems, such as VPN, send multiple verification requests while the first request is still in progress. This feature allows the subsequent requests to succeed automatically, after the user succeeds the first verification in progress. |
| Server status | See the status of your on-premises MFA servers including version, status, IP, and last communication time and date. |

## One-time bypass

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

The one-time bypass feature allows a user to authenticate a single time without performing multi-factor authentication. The bypass is temporary and expires after a specified number of seconds. In situations where the mobile app or phone is not receiving a notification or phone call, you can allow a one-time bypass so the user can access the desired resource.

To create a one-time bypass, complete the following steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Authentication Administrator](../roles/permissions-reference.md#authentication-administrator).
1. Browse to **Protection** > **Multifactor authentication** > **One-time bypass**.
1. Select **Add**.
1. If necessary, select the replication group for the bypass.
1. Enter the username as `username@domain.com`. Enter the number of seconds that the bypass should last and the reason for the bypass.
1. Select **Add**. The time limit goes into effect immediately. The user needs to sign in before the one-time bypass expires.

You can also view the one-time bypass report from this same window.

## Caching rules

You can set a time period to allow authentication attempts after a user is authenticated by using the _caching_ feature. Subsequent authentication attempts for the user within the specified time period succeed automatically.

Caching is primarily used when on-premises systems, such as VPN, send multiple verification requests while the first request is still in progress. This feature allows the subsequent requests to succeed automatically, after the user succeeds the first verification in progress.

>[!NOTE]
> The caching feature is not intended to be used for sign-ins to Microsoft Entra ID.

To set up caching, complete the following steps:

1. Browse to **Protection** > **Multifactor authentication** > **Caching rules**.
1. Select **Add**.
1. Select the **cache type** from the drop-down list. Enter the maximum number of **cache seconds**.
1. If necessary, select an authentication type and specify an application.
1. Select **Add**.

## Next steps

Additional MFA Server configuration options are available from the web console of the MFA Server itself. You can also [configure Azure MFA Server for high availability](howto-mfaserver-deploy-ha.md).
