---
title: Auditing Microsoft Support Operations
titleSuffix: Azure Synapse Analytics
description: Audit Microsoft support operations performed on Azure Synapse Analytics SQL resources.
author: sravanisaluru
ms.author: srsaluru
ms.reviewer: vanto
ms.date: 10/05/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: concept-article
---

# Auditing Microsoft support operations in Azure Synapse Analytics

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]

By auditing Microsoft support operations for Azure Synapse Analytics SQL server, you can track Microsoft support engineers' actions when they access your server during a support request. Using this capability alongside your own auditing provides greater transparency into your workforce and helps with anomaly detection, trend visualization, and data loss prevention.

Auditing of Microsoft support operations includes the following action groups. These groups audit all queries that run against the database, as well as successful and failed sign-ins by Microsoft support engineers:

- `BATCH_COMPLETED_GROUP`
- `SUCCESSFUL_DATABASE_AUTHENTICATION_GROUP`
- `FAILED_DATABASE_AUTHENTICATION_GROUP`

## Enable auditing

1. In the [Azure portal](https://portal.azure.com), open the Synapse SQL server resource.
1. Under **Security**, select **Auditing**.
1. Turn on **Enable auditing of Microsoft support operations**.
1. Configure Azure Storage, Log Analytics, Event Hubs, or a combination of these destinations, and then save the policy.

To review Microsoft support operations in Log Analytics, run the following query:

```kusto
AzureDiagnostics
| where Category == "DevOpsOperationsAudit"
```

You can choose a different storage destination for this auditing log, or use the same auditing configuration for your server.


> [!NOTE]
> DevOps audit logs stored in Azure Storage might contain sensitive operational details. If a malicious actor within your environment accesses these logs, they could gain insights into system operations, which might lead to unauthorized access or data breaches.
>
> **Customer responsibility -** Secure these logs by:
> - Restricting access to authorized personnel only
> - Applying strong Azure role-based access control (RBAC) and network controls
> - Monitoring and auditing storage access regularly

## Related content

- [Auditing in Azure Synapse Analytics](auditing-overview.md)
- [Analyze Azure Synapse Analytics audit logs and reports](auditing-analyze-audit-logs.md)
- [Manage Azure Synapse Analytics auditing using APIs](auditing-manage-using-api.md)
