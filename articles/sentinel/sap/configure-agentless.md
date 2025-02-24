---
title: Customize your SAP agentless connector for Microsoft Sentinel
description: Learn about the latest new features and announcement in Microsoft Sentinel from the past few months.
author: batamig
ms.author: bagol
ms.topic: how-to-guide
ms.date: 02/23/2025

#Customer intent: As a security engineer, I want to customize settings for my SAP agentless connector for Microsoft Sentinel to meet my organization's needs.

---

# Customize your SAP agentless connector for Microsoft Sentinel

If you have an SAP agentless connector for Microsoft Sentinel, you can use the SAP Cloud Integration Suite to customize how the agentless data connector ingests data from your SAP system into Microsoft Sentinel.

This procedure is only relevant when you want to customize the SAP agentless data connector behavior. If you're satisfied with the default functionality, you can skip the procedures in this article.

## Prerequisites

- You must have an SAP agentless connector for Microsoft Sentinel set up and running. For more information, see [Microsoft Sentinel solution for SAP applications: Deployment overview](deployment-overview.md).
- You must have an SAP Cloud Integration Suite account. For more information, see [SAP Cloud Integration Suite](https://www.sap.com/products/cloud-integration.html).
- You must have the following roles in your SAP Cloud Integration Suite account:
  - **Integration Developer**: This role is required to create and manage integration flows.
  - **Integration Content Administrator**: This role is required to manage integration content.

## Customize specific settings across all SAP systems

For this scenario, select the Global key-value pair, and make changes there.

## Customize settings for specific SAP systems

For this scenario, first create a new basic key-value pair, and then add specific settings.

## Reference of customizable parameters

This section provides a reference of customizable parameters for the SAP agentless connector for Microsoft Sentinel.

|Name  |Description  |Allowed values  |Default value  |
|---------|---------|---------|---------|
|**offset-in-seconds**     |    Determines the offset, in seconds, for both the start and end times of a data collection window. Use this parameter to delay data collection by the configured number of seconds.  |  Integer, between **1**-**600**    |    **60**     |
|**ingestion-cycle-days**     |  Time, in days, given to ingest the full User Master data, including all roles and users. This parameter doesn't affect the ingestion of changes to User Master data.  |  Integer, between **1**-**14**       |    **1**     |
|**force-audit-log-to-read-from-all-clients**     |    Determines whether the Audit Log is read from all clients.     |  - **true**: Read from all clients <br>- **false**: Not read from all clients    |    false     |
|**collect-changedocs-logs**     |   Determines whether Change Docs logs are ingested or not.       |     - **true**: Ingested <br>- **false**: Not ingested    |    **true**     |
|**collect-audit-logs**     |    Determines whether Audit Log data is ingested or not.     |      - **true**: Ingested <br>- **false**: Not ingested     |    **true**     |
|**collect-user-master-data**     |   Determines whether User Master data is ingested or not.      |   - **true**: Ingested <br>- **false**: Not ingested    |  **true**       |
|**changedocs-object-classes**     |   List of object classes that are ingested from Change Docs logs.      |  Comma separated list of object classes       |    BANK,CLEARING,IBAN,IDENTITY,KERBEROS,OA2_CLIENT,PCA_BLOCK,PCA_MASTER,PFCG,SECM,SU_USOBT_C,SECURITY_POLICY,STATUS,SU22_USOBT,SU22_USOBX,SUSR_PROF,SU_USOBX_C,USER_CUA     |


## Related content


