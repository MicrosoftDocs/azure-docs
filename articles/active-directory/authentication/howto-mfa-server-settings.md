---
title: Configure MFA Server - Azure Active Directory
description: Learn how to configure settings for Azure MFA Server in the Azure portal

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 06/05/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# Configure MFA Server settings

This article helps you to manage Azure MFA Server settings in the Azure portal.

> [!IMPORTANT]
> As of July 1, 2019, Microsoft will no longer offer MFA Server for new deployments. New customers who would like to require multi-factor authentication from their users should use cloud-based Azure Multi-Factor Authentication. Existing customers who have activated MFA Server prior to July 1 will be able to download the latest version, future updates and generate activation credentials as usual.

The following MFA Server settings are available:

| Feature | Description |
| ------- | ----------- |
| Server settings | Download MFA Server and generate activation credentials to initialize your environment |
| [One-time bypass](#one-time-bypass) | Allow a user to authenticate without performing multi-factor authentication for a limited time. |
| [Caching rules](#caching-rules) |  Caching is primarily used when on-premises systems, such as VPN, send multiple verification requests while the first request is still in progress. This feature allows the subsequent requests to succeed automatically, after the user succeeds the first verification in progress. |
| Server status | See the status of your on-premises MFA servers including version, status, IP, and last communication time and date. |

## One-time bypass

The one-time bypass feature allows a user to authenticate a single time without performing multi-factor authentication. The bypass is temporary and expires after a specified number of seconds. In situations where the mobile app or phone is not receiving a notification or phone call, you can allow a one-time bypass so the user can access the desired resource.

To create a one-time bypass, complete the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com) as an administrator.
1. Search for and select **Azure Active Directory**, then browse to **Security** > **MFA** > **One-time bypass**.
1. Select **Add**.
1. If necessary, select the replication group for the bypass.
1. Enter the username as `username\@domain.com`. Enter the number of seconds that the bypass should last and the reason for the bypass.
1. Select **Add**. The time limit goes into effect immediately. The user needs to sign in before the one-time bypass expires.

You can also view the one-time bypass report from this same window.

## Caching rules

You can set a time period to allow authentication attempts after a user is authenticated by using the _caching_ feature. Subsequent authentication attempts for the user within the specified time period succeed automatically.

Caching is primarily used when on-premises systems, such as VPN, send multiple verification requests while the first request is still in progress. This feature allows the subsequent requests to succeed automatically, after the user succeeds the first verification in progress.

>[!NOTE]
> The caching feature is not intended to be used for sign-ins to Azure Active Directory (Azure AD).

To set up caching, complete the following steps:

1. Browse to **Azure Active Directory** > **Security** > **MFA** > **Caching rules**.
1. Select **Add**.
1. Select the **cache type** from the drop-down list. Enter the maximum number of **cache seconds**.
1. If necessary, select an authentication type and specify an application.
1. Select **Add**.

## Next steps

Additional MFA Server configuration options are available from the web console of the MFA Server itself. You can also [configure Azure MFA Server for high availability](howto-mfaserver-deploy-ha.md).
