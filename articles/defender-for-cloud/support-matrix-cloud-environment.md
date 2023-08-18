---
title: Support across Azure clouds
description: Review Defender for Cloud features and plans supported across different clouds
ms.topic: limits-and-quotas
ms.date: 05/01/2023
---

# Defender for Cloud support for Azure commercial/other clouds

This article indicates which Defender for Cloud features are supported in Azure commercial and government clouds.

## Cloud support

In the support table, **NA** indicates that the feature isn't available.


**Feature/Plan** | **Azure** | **Azure Government** | **Microsoft Azure operated by 21Vianet**|
|--- | --- | --- | --- |
|**GENERAL FEATURES** | | |
[Continuous data export](continuous-export.md) | GA | GA | GA
[Response automation with Azure Logic Apps](./workflow-automation.md) | GA | GA | GA
[Security alerts](alerts-overview.md)<br/> Generated when one or more Defender for Cloud plans is enabled. | GA | GA | GA
[Alert email notifications](configure-email-notifications.md) | GA | GA | GA
[Alert suppression rules](alerts-suppression-rules.md) | GA | GA | GA
[Alert bi-directional synchronization with Microsoft Sentinel](../sentinel/connect-azure-security-center.md) | Preview | NA | NA
[Azure Workbooks integration for reporting](custom-dashboards-azure-workbooks.md) | GA | GA | GA
[Automatic component/agent/extension provisioning](monitoring-components.md) | GA | GA | GA
**FOUNDATIONAL CSPM FEATURES (FREE)** | | |  
[Asset inventory](asset-inventory.md) | GA | GA | GA
[Security recommendations](security-policy-concept.md) based on the [Microsoft Cloud Security Benchmark](concept-regulatory-compliance.md)  | GA | GA | GA
[Recommendation exemptions](exempt-resource.md) | Preview | NA | NA
[Secure score](secure-score-security-controls.md) | GA | GA | GA
**DEFENDER FOR CLOUD PLANS** | | |
[Defender CSPM](concept-cloud-security-posture-management.md)| GA | NA | NA
[Defender for APIs](defender-for-apis-introduction.md). [Review support preview regions](defender-for-apis-prepare.md#cloud-and-region-support). | Preview | NA | NA
[Defender for App Service](defender-for-app-service-introduction.md) | GA | NA | NA
[Defender for Azure Cosmos DB](concept-defender-for-cosmos.md) | GA | NA | NA
[Defender for Azure SQL database servers](defender-for-sql-introduction.md) | GA | GA | GA<br/><br/>A subset of alerts/vulnerability assessments is available.<br/>Behavioral threat protection isn't available.
[Defender for Containers](defender-for-containers-introduction.md)<br/>[Review detailed feature support](support-matrix-defender-for-containers.md) | GA | GA | GA
[Defender for DevOps](defender-for-devops-introduction.md) |Preview | NA | NA
[Defender for DNS](defender-for-dns-introduction.md) | GA | GA | GA
[Defender for Key Vault](defender-for-key-vault-introduction.md) | GA | NA | NA
[Defender for Open-Source Relational Databases](defender-for-databases-introduction.md) | GA | NA | NA  
[Defender for Resource Manager](defender-for-resource-manager-introduction.md) | GA | GA | GA
[Defender for Servers](plan-defender-for-servers.md)<br/>[Review detailed feature support](support-matrix-defender-for-servers.md). | GA | GA | GA
[Defender for Storage](defender-for-storage-introduction.md) | GA | GA (activity monitoring) | NA
[Defender for SQL Servers on Machines](defender-for-sql-introduction.md) | GA | GA | NA

[!INCLUDE [Defender for DNS note](./includes/defender-for-dns-note.md)]

## Next steps

Start reading about [Defender for Cloud features](defender-for-cloud-introduction.md).
