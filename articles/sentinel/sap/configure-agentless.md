---
title: Customize your SAP agentless data connector for Microsoft Sentinel
description: Learn how to customize settings for your SAP agentless data connector for Microsoft Sentinel.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 02/23/2025

#Customer intent: As a security engineer, I want to customize settings for my SAP agentless connector for Microsoft Sentinel to meet my organization's needs.

---

# Customize your SAP agentless data connector for Microsoft Sentinel

If you have an SAP agentless connector for Microsoft Sentinel, you can use the SAP Cloud Integration Suite to customize how the agentless data connector ingests data from your SAP system into Microsoft Sentinel.

This procedure is only relevant when you want to customize the SAP agentless data connector behavior. If you're satisfied with the default functionality, you can skip the procedures in this article.

## Prerequisites

- You must have an SAP agentless data connector for Microsoft Sentinel set up and running. For more information, see [Microsoft Sentinel solution for SAP applications: Deployment overview](deployment-overview.md?tabs=agentless#data-connector).
- You must have an SAP Cloud Integration Suite account with permissions to edit key value mappings. For more information, see [TBD](xref).

## Download the configuration file and customize settings

A default key-value mapping file is stored at  [TBD link to GitHub](xref). Download the file to a location accessible from your SAP system in order to customize settings.

1. Load the TBD file into your SAP system. TBD NEED MORE DESCRIPTION HERE, XREF.
1. Use one of the following methods to customize your SAP agentless data connector settings:

    - **Customize specific settings across all SAP systems.** If you want to customize settings across all SAP systems, select the **Global** key-value pair, and add local parameters to it. 
    - **Customize settings for specific SAP systems.** If you want to customize settings for specific SAP systems, first create a new basic key-value pair, and then add local parameters to it.

    For more information, see [Reference of customizable parameters](#reference-of-customizable-parameters).

## Reference of customizable parameters

This section provides a reference of customizable parameters for the SAP agentless connector for Microsoft Sentinel.

### offset-in-seconds

Determines the offset, in seconds, for both the start and end times of a data collection window. Use this parameter to delay data collection by the configured number of seconds.

- **Allowed values:** Integer, between **1**-**600**
- **Default value:** **60**

### ingestion-cycle-days

Time, in days, given to ingest the full User Master data, including all roles and users. This parameter doesn't affect the ingestion of changes to User Master data.

- **Allowed values:** Integer, between **1**-**14**
- **Default value:** **1**

### force-audit-log-to-read-from-all-clients

Determines whether the Audit Log is read from all clients.

- **Allowed values:**
  - **true**: Read from all clients
  - **false**: Not read from all clients
- **Default value:** **false**

### collect-changedocs-logs

Determines whether Change Docs logs are ingested or not.

- **Allowed values:**
  - **true**: Ingested
  - **false**: Not ingested
- **Default value:** **true**

### collect-audit-logs

Determines whether Audit Log data is ingested or not.

- **Allowed values:**
  - **true**: Ingested
  - **false**: Not ingested
- **Default value:** **true**

### collect-user-master-data

Determines whether User Master data is ingested or not.

- **Allowed values:**
  - **true**: Ingested
  - **false**: Not ingested
- **Default value:** **true**

### changedocs-object-classes

List of object classes that are ingested from Change Docs logs.

- **Allowed values:** Comma separated list of object classes
- **Default value:** BANK,CLEARING,IBAN,IDENTITY,KERBEROS,OA2_CLIENT,PCA_BLOCK,PCA_MASTER,PFCG,SECM,SU_USOBT_C,SECURITY_POLICY,STATUS,SU22_USOBT,SU22_USOBX,SUSR_PROF,SU_USOBX_C,USER_CUA


## Related content

- [Install a Microsoft Sentinel solution for SAP applications](/azure/sentinel/sap/deploy-sap-security-content?pivots=connection-agentless)
- [Prepare your SAP environment](/azure/sentinel/sap/preparing-sap?pivots=connection-agentless)
- [Connect your SAP system](/azure/sentinel/sap/deploy-data-connector-agent-container?tabs=managed-identity&pivots=connection-agentless)
