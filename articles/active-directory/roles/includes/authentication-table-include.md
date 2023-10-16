---
title: include file
description: include file
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: include
ms.date: 10/12/2022
ms.author: rolyon
ms.custom: include file
---

The following table compares the capabilities of authentication-related roles.

| Role | Manage user's auth methods | Manage per-user MFA | Manage MFA settings | Manage auth method policy | Manage password protection policy | Update sensitive properties | Delete and restore users |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | --- |
| [Authentication Administrator](../permissions-reference.md#authentication-administrator) | Yes for [some users](../privileged-roles-permissions.md#who-can-perform-sensitive-actions) | Yes for [some users](../privileged-roles-permissions.md#who-can-perform-sensitive-actions) | No | No | No | Yes for [some users](../privileged-roles-permissions.md#who-can-perform-sensitive-actions) | Yes for [some users](../privileged-roles-permissions.md#who-can-perform-sensitive-actions) |
| [Privileged Authentication Administrator](../permissions-reference.md#privileged-authentication-administrator) | Yes for all users | Yes for all users | No | No | No | Yes for all users | Yes for all users |
| [Authentication Policy Administrator](../permissions-reference.md#authentication-policy-administrator) | No | No | Yes | Yes | Yes | No | No |
| [User Administrator](../permissions-reference.md#user-administrator) | No | No | No | No | No | Yes for [some users](../privileged-roles-permissions.md#who-can-perform-sensitive-actions) | Yes for [some users](../privileged-roles-permissions.md#who-can-perform-sensitive-actions) |
