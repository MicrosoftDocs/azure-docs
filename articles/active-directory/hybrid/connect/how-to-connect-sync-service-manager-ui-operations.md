---
title: 'Microsoft Entra Connect Synchronization Service Manager Operations'
description: Understand the Operations tab in the Synchronization Service Manager for Microsoft Entra Connect.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''

ms.assetid: 97a26565-618f-4313-8711-5925eeb47cdc
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath
ms.custom: H1Hack27Feb2017
ms.collection: M365-identity-device-management
---
# Using the Sync Service Manager Operations tab

![Sync Service Manager](./media/how-to-connect-sync-service-manager-ui-operations/operations.png)

The operations tab shows the results from the most recent operations. This tab is key to understand and troubleshoot issues.

## Understand the information visible in the operations tab
The top half shows all runs in chronological order. By default, the operations log keeps information about the last seven days, but this setting can be changed with the [scheduler](how-to-connect-sync-feature-scheduler.md). You want to look for any run that does not show a success status. You can change the sorting by clicking the headers.

The **Status** column is the most important information and shows the most severe problem for a run. Here is a quick summary of the most common statuses in order of priority to investigate (where * indicate several possible error strings).

| Status | Comment |
| --- | --- |
| stopped-\* |The run could not complete. For example, if the remote system is down and cannot be contacted. |
| stopped-error-limit |There are more than 5,000 errors. The run was automatically stopped due to the large number of errors. |
| completed-\*-errors |The run completed, but there are errors (fewer than 5,000) that should be investigated. |
| completed-\*-warnings |The run completed, but some data is not in the expected state. If you have errors, then this message is usually only a symptom. Until you have addressed errors, you should not investigate warnings. |
| success |No issues. |

When you select a row, the bottom updates to show the details of that run. To the far left of the bottom, you might have a list saying **Step #**. This list only appears if you have multiple domains in your forest where each domain is represented by a step. The domain name can be found under the heading **Partition**. Under **Synchronization Statistics**, you can find more information about the number of changes that were processed. You can click the links to get a list of the changed objects. If you have objects with errors, those errors show up under **Synchronization Errors**.

For more information, see [troubleshoot an object that is not synchronizing](tshoot-connect-object-not-syncing.md)

## Next steps
Learn more about the [Microsoft Entra Connect Sync](how-to-connect-sync-whatis.md) configuration.

Learn more about [Integrating your on-premises identities with Microsoft Entra ID](../whatis-hybrid-identity.md).
