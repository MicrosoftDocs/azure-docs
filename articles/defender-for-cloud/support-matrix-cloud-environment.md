---
title: Microsoft Defender for Cloud support across cloud types
description: Review Defender for Cloud features and plans supported across different clouds
ms.topic: limits-and-quotas
author: bmansheim
ms.author: benmansheim
ms.date: 03/08/2023
---

# Defender for Cloud support for commercial/government clouds

This article indicates which Defender for Cloud features are supported in Azure commercial and government clouds. 

## Cloud support

In the support table, **NA** indicates that the feature isn't available.

**Feature/Plan** | **Azure** | **Azure Government** | **Azure China**<br/><br/>**21Vianet**
--- | --- | --- | --- 
**GENERAL FEATURES** | | |
[Continuous data export](continuous-export.md) | GA | GA | GA
[Response automation with Azure Logic Apps ](./workflow-automation.md) | GA | GA | GA
[Alert email notifications](configure-email-notifications.md)<br/>Security alerts are available when one or more Defender for Cloud plans is enabled. | GA | GA | GA
[Alert suppression rules](alerts-suppression-rules.md) | GA | GA | GA
[Integration with Microsoft Defender for Cloud Apps](other-threat-protections.md#display-recommendations-in-microsoft-defender-for-cloud-apps) | GA | GA | GA
[Alert bi-directional synchronization with Microsoft Sentinel](../sentinel/connect-azure-security-center.md) | Public preview | NA | NA
[Azure Workbooks integration for reporting](custom-dashboards-azure-workbooks.md) | GA | GA | GA
[Automatic component/agent/extension provisioning](monitoring-components.md) | GA | GA | GA
[Integration with Microsoft Defender for Cloud Apps](other-threat-protections.md) | GA | GA | GA
**FOUNDATIONAL CSPM FEATURES (FREE)** | | |  
[Asset inventory](asset-inventory.md) | GA | GA | GA
[Security recommendations](security-policy-concept.md) | GA | GA | GA
[Recommendation exemptions](exempt-resource.md) | Public preview | NA | NA
[Secure score](secure-score-security-controls.md) | GA | GA | GA
[Microsoft Cloud Security Benchmark](concept-regulatory-compliance.md) | GA | NA | NA
**DEFENDER FOR CLOUD PLANS** | | |
[Defender CSPM](concept-cloud-security-posture-management.md)| GA | NA | NA
Defender CSPM: [Agentless container posture/Agentless vulnerability assessments for container images](concept-agentless-containers.md)| Public preview | NA | NA
[Defender for APIs](defender-for-apis-introduction.md) | Public preview | NA | NA
[Defender for App Service](defender-for-app-service-introduction.md) | GA | NA | NA
[Defender for Azure Cosmos DB](concept-defender-for-cosmos.md) | Public preview | NA | NA
[Defender for Azure SQL database servers](defender-for-sql-introduction.md)<br/>Partial GA in Vianet21<br/> - A subset of alerts/vulnerability assessments is available.<br/>- Behavioral threat protection isn't available.| GA | GA | GA
[Defender for Containers](defender-for-containers-introduction.md) | GA | GA | GA
Defender for Containers: [Support for Azure Arc-enabled Kubernetes clusters](defender-for-containers-introduction.md) | Public preview | NA | NA
Defender for Containers: [Run-time visibility of vulnerabilities in container images](defender-for-containers-vulnerability-assessment-azure.md#view-vulnerabilities-for-images-running-on-your-aks-clusters) | Preview | NA | NA
[Defender for DNS](defender-for-dns-introduction.md) | GA | GA | GA
[Defender for Key Vault](defender-for-key-vault-introduction.md) | GA | NA | NA
[Defender for Kubernetes](defender-for-kubernetes-introduction.md)<br/> Deprecated. Defender for Containers has replaced it. | GA | GA | GA
[Defender for Open-Source Relational Databases](defender-for-databases-introduction.md) | GA | NA | NA  
[Defender for Resource Manager](defender-for-resource-manager-introduction.md) | GA | GA | GA
[Defender for Servers](plan-defender-for-servers.md) (Review [detailed feature support](#defender-for-servers-cloud-support) | GA | GA | GA
[Defender for Storage](defender-for-storage-introduction.md)<br/> Some threat protection alerts for Defender for Storage are in public preview. | GA | GA (activity monitoring) | NA
[Defender for SQL Servers on Machines](defender-for-sql-introduction.md) | GA | GA | NA


## Defender for Servers cloud support

**Feature/Plan** | **Azure** | **Azure Government** | **Azure China**<br/><br/>**21Vianet**
--- | --- | --- | --- 
[Just-in-time VM access](./just-in-time-access-usage.md) | GA | GA | GA
[File integrity monitoring](./file-integrity-monitoring-overview.md)  | GA | GA | GA
[Adaptive application controls](./adaptive-application-controls.md)  | GA | GA | GA
[Adaptive network hardening](./adaptive-network-hardening.md) | GA | GA | NA
[Docker host hardening](./harden-docker-hosts.md)  | GA | GA | GA
[Integrated Qualys scanner](./deploy-vulnerability-assessment-vm.md) | GA | NA | NA
[Compliance dashboard/reports](./regulatory-compliance-dashboard.md)<br/><br/> Compliance standards might differ depending on the cloud type.| GA | GA | GA
[Defender for Endpoint integration](./integration-defender-for-endpoint.md) | GA | GA | NA
[Connect AWS account](./quickstart-onboard-aws.md) | GA | NA | NA
[Connect GCP project](./quickstart-onboard-gcp.md) | GA | NA | NA

## Next steps

Start reading about [Defender for Cloud features](defender-for-cloud-introduction.md).
