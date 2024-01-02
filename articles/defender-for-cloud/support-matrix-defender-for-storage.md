---
title: Permissions required to enable Defender for Storage and its features
description: Learn about the permissions required to enable Defender for Storage and its features - Malware Scanning and Sensitive data threat detection.
ms.topic: reference
author: dcurwin
ms.author: dacurwin
ms.date: 08/21/2023
---

# Required permissions for enabling Defender for Storage and its features

This article lists the permissions required to [enable Defender for Storage](tutorial-enable-storage-plan.md) and its features.

Microsoft Defender for Storage is an Azure-native layer of security intelligence that detects potential threats to your storage accounts. It helps prevent the three major impacts on your data and workload: malicious file uploads, sensitive data exfiltration, and data corruption.

- **Activity monitoring:** Detects suspicious activities in storage accounts by analyzing data plane and control plane activities and using Microsoft Threat Intelligence, behavioral modeling, and machine-learning.

- **Malware Scanning:** Scans all uploaded blobs in near-real time using Microsoft Defender Antivirus to protect storage accounts from malicious content.

- **Sensitive data threat detection:** Prioritizes security alerts based on data sensitivity discovered by the Sensitive Data Discovery Engine, detects exposure events and suspicious activities, enhancing protection against data breaches.

Depending on the scenario, you need different levels of permissions to enable Defender for Storage and its features. You can enable and configure Defender for Storage at the subscription level or at the storage account level. You can also use built-in Azure policies to enable Defender for Storage and enforce its enablement on a desired scope.

The following table summarizes the permissions you need for each scenario. The permissions are either built-in Azure roles or action sets that you can assign to custom roles.

| Capability | Subscription level | Storage account level |
|---------|---------|---------|
| Activity monitoring | Security Admin or Pricings/read, Pricings/write | Security Admin or Microsoft.Security/defenderforstoragesettings/read, Microsoft.Security/defenderforstoragesettings/write |
| Malware scanning | Subscription Owner or action set 1 | Storage Account Owner or action set 2 |
| Sensitive data threat detection | Subscription Owner or action set 1 | Storage Account Owner or action set 2 |

> [!NOTE]
> Activity monitoring is always enabled when you enable Defender for Storage.

The action sets are collections of Azure resource provider operations that you can use to create custom roles. The action sets for enabling Defender for Storage and its features are:

## Action set 1: Subscription level enablement and configuration

- Microsoft.Security/pricings/write
- Microsoft.Security/pricings/read
- Microsoft.Security/pricings/SecurityOperators/read
- Microsoft.Security/pricings/SecurityOperators/write
- Microsoft.Authorization/roleAssignments/read
- Microsoft.Authorization/roleAssignments/write
- Microsoft.Authorization/roleAssignments/delete

## Action set 2: Storage account level enablement and configuration

- Microsoft.Storage/storageAccounts/write
- Microsoft.Storage/storageAccounts/read
- Microsoft.Security/defenderforstoragesettings/read
- Microsoft.Security/defenderforstoragesettings/write
- Microsoft.EventGrid/eventSubscriptions/read
- Microsoft.EventGrid/eventSubscriptions/write
- Microsoft.EventGrid/eventSubscriptions/delete
- Microsoft.Authorization/roleAssignments/read
- Microsoft.Authorization/roleAssignments/write
- Microsoft.Authorization/roleAssignments/delete