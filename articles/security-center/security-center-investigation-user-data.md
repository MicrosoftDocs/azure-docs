---
title: Manage user data found in an Azure Security Center investigation
description: " Learn how to manage user data found in Azure Security Center's investigation feature. "
services: operations-management-suite
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 411d7bae-c9d4-4e83-be63-9f2f2312b075
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/20/2018
ms.author: memildin

---

# Manage user data found in an Azure Security Center investigation
This article provides information on how to manage the user data found in Azure Security Center's investigation feature. Investigation data is stored in [Azure Monitor logs](../log-analytics/log-analytics-overview.md) and exposed in Security Center. Managing user data includes the ability to delete or export data.

[!INCLUDE [gdpr-intro-sentence.md](../../includes/gdpr-intro-sentence.md)]

## Searching for and identifying personal data
In the Azure portal, you can use Security Center's investigation feature to search for personal data. The investigation feature is available under **Security Alerts**.

The investigation feature shows all entities, user information, and data under the **Entities** tab.

## Securing and controlling access to personal information
A Security Center user assigned the role of Reader, Owner, Contributor, or Account Administrator can access customer data within the tool.

See [Built-in roles for Azure role-based access control](../role-based-access-control/built-in-roles.md) to learn more about the Reader, Owner, and Contributor roles. See [Azure subscription administrators](../cost-management-billing/manage/add-change-subscription-administrator.md) to learn more about the Account Administrator role.

## Deleting personal data
A Security Center user assigned the role of Owner, Contributor, or Account Administrator can delete the investigation information.

To delete an investigation, you can submit a `DELETE` request to the Azure Resource Manager REST API:

```HTTP
DELETE
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/features/security/incidents/{incidentName}
```

The `incidentName` input can be found by listing all incidents using a `GET` request:

```HTTP
GET
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/features/security/incidents
```

## Exporting personal data
A Security Center user assigned the role of Owner, Contributor, or Account Administrator can export the investigation information. To export investigation information, go to the **Entities** tab to copy and paste the relevant information.

## Next steps
For more information about managing user data, see [Manage user data in Azure Security Center](security-center-privacy.md).
To learn more about deleting private data in Azure Monitor logs, see [How to export and delete private data](../azure-monitor/platform/personal-data-mgmt.md#how-to-export-and-delete-private-data).
