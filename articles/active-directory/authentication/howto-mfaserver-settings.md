---
title: Configure MFA Server - Azure Active Directory
description: Learn how to configure settings for MFA Server in the Azure portal

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 05/11/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# Configure MFA Server settings

| Feature | Description |
| ------- | ----------- |
| Server settings | Download MFA Server and generate activation credentials to initialize your environment |
| [One-time bypass](#one-time-bypass) | Allow a user to authenticate without performing two-step verification for a limited time. |
| [Caching rules](#caching-rules) |  Caching is primarily used when on-premises systems, such as VPN, send multiple verification requests while the first request is still in progress. This feature allows the subsequent requests to succeed automatically, after the user succeeds the first verification in progress. |
| Server status | See the status of your on-premises MFA servers including version, status, IP, and last communication time and date. |

## One-time bypass

The _one-time bypass_ feature allows a user to authenticate a single time without performing two-step verification. The bypass is temporary and expires after a specified number of seconds. In situations where the mobile app or phone is not receiving a notification or phone call, you can allow a one-time bypass so the user can access the desired resource.

### Create a one-time bypass

1. Sign in to the [Azure portal](https://portal.azure.com) as an administrator.
2. Browse to **Azure Active Directory** > **Security** > **MFA** > **One-time bypass**.
3. Select **Add**.
4. If necessary, select the replication group for the bypass.
5. Enter the username as **username\@domain.com**. Enter the number of seconds that the bypass should last. Enter the reason for the bypass.
6. Select **Add**. The time limit goes into effect immediately. The user needs to sign in before the one-time bypass expires.

### View the one-time bypass report

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Browse to **Azure Active Directory** > **Security** > **MFA** > **One-time bypass**.

## Caching rules

You can set a time period to allow authentication attempts after a user is authenticated by using the _caching_ feature. Subsequent authentication attempts for the user within the specified time period succeed automatically. Caching is primarily used when on-premises systems, such as VPN, send multiple verification requests while the first request is still in progress. This feature allows the subsequent requests to succeed automatically, after the user succeeds the first verification in progress.

>[!NOTE]
>The caching feature is not intended to be used for sign-ins to Azure Active Directory (Azure AD).

### Set up caching

1. Sign in to the [Azure portal](https://portal.azure.com) as an administrator.
2. Browse to **Azure Active Directory** > **Security** > **MFA** > **Caching rules**.
3. Select **Add**.
4. Select the **cache type** from the drop-down list. Enter the maximum number of **cache seconds**.
5. If necessary, select an authentication type and specify an application.
6. Select **Add**.