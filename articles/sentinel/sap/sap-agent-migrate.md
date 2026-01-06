---
title: Containerized Agent to Agentless Connector migration guide
description: Learn how to migrate from the containerized SAP agent to the agentless data connector for Microsoft Sentinel Solution for SAP applications.
author: mberdugo
ms.author: monaberdugo
ms.reviewer: mapankra
ms.topic: article
ms.date: 10/23/2025
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security

#Customer intent: As a security operations team member, I want to understand the migration process from the containerized SAP agent to the agentless data connector.

---

# Containerized SAP agent to the agentless data connector migration guide 

This article outlines the steps required to migrate from the containerized SAP agent to the agentless data connector for Microsoft Sentinel Solution for SAP applications.

[!INCLUDE [data-connector-agent-deprecation](../includes/data-connector-agent-deprecation.md)]

## Why move to the agentless data connector?

The migration from the containerized SAP agent to the agentless data connector is a simple exercise that can be accomplished in a few steps. The agentless connector offers several advantages:

- Simplified deployment (zero footprint on SAP NetWeaver)
- Reduced maintenance overhead (no more container management and standard SAP updates)
- Future-proof architecture based on SAP Integration Suite and SAP Cloud Connector
- Improved scalability

In a nut-shell, the migration process involves deploying the new agentless connector side-by-side with the existing containerized agent, validating log retrieval from the new connector, and finally decommissioning of the deprecated containerized agent.

Your existing investment in the Microsoft Sentinel Solution for SAP analytic rules, workbooks, and playbooks remains functional with the agentless data connector. Enhancement of the [kql functions](sap-solution-function-reference.md) used in the solution were applied to support both data ingestion methods side-by-side. They use the fuzzy union operator to combine data from both sources no matter if they exist.

## Migration path

1. **Assess**: Review your existing containerized SAP agent deployment to identify monitored SAP systems, log types collected, and any custom configurations.
1. **Review**: Familiarize yourself with the approaches for feature parity between the containerized agent and the agentless data connector, including configuration options and capabilities.
1. **Deploy**: Set up the agentless data connector following the [deployment guide](deploy-sap-security-content.md?pivots=connection-agentless).
1. **Validate**: Ensure that logs are being collected correctly from your SAP systems using the agentless data connector. Use kql queries to verify log ingestion.
    ```kql
    let startTime = ago(1h);
    let endTime = now();
    ABAPAuditLog
    | where TimeGenerated between (startTime .. endTime)
    | summarize Count = count() by SourceSystem, bin(TimeGenerated, 5m)
    | order by TimeGenerated desc
    ```
1. **Monitor**: Run both the containerized agent and the agentless data connector in parallel for a defined period to ensure stability and completeness of log collection.
1. **Decommission**: Once you have validated that the agentless data connector is functioning correctly, proceed to decommission the containerized SAP agent. See the "[Stop SAP data collection](stop-collection.md)" article for details.

> [!IMPORTANT]
> Review the authorizations of the Sentinel user and role on your SAP systems used with the containerized agent. The agentless data connector requires less but different authorizations compared to the containerized SAP agent. Refer to the [configuration guide](/azure/sentinel/sap/preparing-sap?pivots=connection-agentless#configure-the-microsoft-sentinel-role) for details and SAP role sample for minimum authorizations.

## Feature parity

The agentless data connector provides built-in feature parity with the containerized SAP agent for most important use cases regarding analytic rules and workbooks. See the [content reference](sap-solution-security-content.md) for details. 

All analytics rules and workbooks built on the underlying SAP sources mentioned on the [table reference](./sap-solution-log-reference.md#logs-collected-by-the-agentless-data-connector) remain functional without any changes.

These sources include but are not limited to the following [logs](sap-solution-security-content.md#built-in-analytics-rules):

- SAPcon - Audit Log
- SAPcon - Change Documents Log
- User and User Authorization Details

The solution scope can be extended through [extensions patterns](https://github.com/Azure-Samples/Sentinel-For-SAP-Community) available for the agentless data connector. Watchlists and Playbooks remain fully functional without any changes.

SAP HANA database or OS-level detections are out of scope for the comparison because they are covered by their own connectors in Microsoft Sentinel.

## Next steps

- [Learn more about Microsoft Sentinel Solution for SAP applications](solution-overview.md).

- [Learn more about Microsoft Sentinel Solution for SAP BTP](sap-btp-solution-overview.md).

- [Learn more about Microsoft Sentinel Solution for SAP partner add-ons](solution-partner-overview.md).
