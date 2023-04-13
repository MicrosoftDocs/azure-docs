---
title: Permissions required to enable Defender for Storage and its features
description: Learn about the permissions required to enable Defender for Storage and its features - Malware Scanning and Sensitive data threat detection.
ms.topic: reference
author: bmansheim
ms.author: benmansheim
ms.date: 03/26/2023
---

# Permissions required to enable Defender for Storage and its features

This article lists the permissions required to [enable Defender for Storage](../storage/common/azure-defender-storage-configure.md) and its features.

To enable Defender for Storage and its features - Malware Scanning and Sensitive data threat detection, various permission levels are required. Below is a breakdown of the required permissions for each scenario.

## Subscription level enablement and configuration (action set 1)

* Microsoft.Security/pricings/write
* Microsoft.Security/pricings/read
* Microsoft.Security/pricings/SecurityOperators/read
* Microsoft.Security/pricings/SecurityOperators/write
* Microsoft.Authorization/roleAssignments/read
* Microsoft.Authorization/roleAssignments/write
* Microsoft.Authorization/roleAssignments/delete

## Storage account level enablement and configuration (action set 2)

* Microsoft.Storage/storageAccounts/write
* Microsoft.Storage/storageAccounts/read
* Microsoft.Security/defenderforstoragesettings/read
* Microsoft.Security/defenderforstoragesettings/write
* Microsoft.EventGrid/eventSubscriptions/read
* Microsoft.EventGrid/eventSubscriptions/write
* Microsoft.EventGrid/eventSubscriptions/delete
* Microsoft.Authorization/roleAssignments/read
* Microsoft.Authorization/roleAssignments/write
* Microsoft.Authorization/roleAssignments/delete

## Permissions for enabling scenarios

| Scenario | Activity monitoring | Malware Scanning | Sensitive data threat detection | Required Permissions<br>(role / action set) |
|--|--|--|--|--|
| Subscription level | Yes | No | No | Security Admin or Pricings/read, Pricings/write on the subscription |
| Subscription level | Yes | Yes | No | Subscription Owner or action set 1 |
| Subscription level | Yes | No | Yes | Subscription Owner or action set 1 |
| Subscription level | Yes | Yes | Yes | Subscription Owner or action set 1 |
| Storage account level | Yes | No | No | Security Admin or Microsoft.Security/defenderforstoragesettings/read, Microsoft.Security/defenderforstoragesettings/write |
| Storage account level | Yes | Yes | No | Storage Account Owner or action set 2 |
| Storage account level | Yes | No | Yes | Storage Account Owner or action set 2 |
| Storage account level | Yes | Yes | Yes | Storage Account Owner or action set 2 |
| Built-in Azure policy<br>(activity monitoring only) | Yes | No | No | Security Admin or action set 1 |
| Built-in Azure policy<br>(all features) | Yes | Yes | Yes | Subscription Owner or action set 1 |
