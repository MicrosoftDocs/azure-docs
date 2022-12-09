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

The following table compares the capabilities of this role with related roles.

| Role | Manage user's auth methods | Manage per-user MFA | Manage MFA settings | Manage auth method policy | Manage password protection policy | Update sensitive properties | Delete and restore users |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | --- |
| [Authentication Administrator](#authentication-administrator) | Yes for some users | Yes for some users | No | No | No | Yes for some users | Yes for some users |
| [Privileged Authentication Administrator](#privileged-authentication-administrator) | Yes for all users | Yes for all users | No | No | No | Yes for all users | Yes for all users |
| [Authentication Policy Administrator](#authentication-policy-administrator) | No | No | Yes | Yes | Yes | No | No |
| [User Administrator](#user-administrator) | No | No | No | No | No | Yes for some users | Yes for some users |
