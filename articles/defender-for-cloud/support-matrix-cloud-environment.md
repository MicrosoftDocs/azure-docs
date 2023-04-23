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

In the support table, **NA** indicates that the feature is not available.

**Feature/Plan** | **Details** | **Azure** | **Azure Government** | **Azure China**<br/><br/>**21Vianet**
--- | --- | --- |--- | --- 
**Foundational CSPM** | | | | 
[Continuous export](./continuous-export.md) | GA | GA | GA
[Workflow automation](./workflow-automation.md) | GA | GA | GA
[Recommendation exemption rules](./exempt-resource.md) | Public preview | NA | NA
[Alert suppression rules](./alerts-suppression-rules.md) | GA | GA | GA
[Alert email notifications](./configure-email-notifications.md) | GA | GA | GA
[Agent/extension deployment](monitoring-components.md) | GA | GA | GA
[Asset inventory](./asset-inventory.md) | GA | GA | GA
[Azure Workbooks support](./custom-dashboards-azure-workbooks.md) | GA | GA | GA
[Microsoft Defender for Cloud Apps integration](./other-threat-protections.md#display-recommendations-in-microsoft-defender-for-cloud-apps) | GA | GA | GA
**[Defender CSPM](concept-cloud-security-posture-management.md)** | GA | NA | NA
**[Defender for APIs](defender-for-apis-introduction.md)** | Public preview | NA | NA
**[Defender for App Service](defender-for-app-service-introduction.md)** | GA | NA | NA
**[Defender for Azure Cosmos DB](concept-defender-for-cosmos.md)** | Public preview | NA | NA
**[Defender for Azure SQL database servers](defender-for-sql-introduction.md)**<br/><br/> Partial GA in Vianet21<br/> - A subset of alerts/vulnerability assessments is available.<br/>- Behavioral threat protection isn't available. | GA | GA | GA
**[Defender for Containers](defender-for-containers-introduction.md)**| GA | GA | GA
[Azure Arc extension for Kubernetes clusters/servers/data services](defender-for-kubernetes-azure-arc.md): | Public preview | NA | NA
Runtime visibility of vulnerabilities in container images | Public preview | NA | NA
**[Defender for DNS](defender-for-dns-introduction.md)** | GA | GA | GA
**[Defender for Key Vault](./defender-for-key-vault-introduction.md)** | GA | NA | NA
[Defender for Kubernetes](./defender-for-kubernetes-introduction.md)<br/><br/> Defender for Kubernetes is deprecated and doesn't include new features. [Learn more](defender-for-kubernetes-introduction.md) | GA | GA | GA
**[Defender for open-source relational databases](defender-for-databases-introduction.md)** | GA | NA | NA  
**[Defender for Resource Manager](./defender-for-resource-manager-introduction.md)** | GA | GA | GA
**[Defender for Servers](plan-defender-for-servers.md)** | | | |
[Just-in-time VM access](./just-in-time-access-usage.md) | GA | GA | GA
[File integrity monitoring](./file-integrity-monitoring-overview.md)  | GA | GA | GA
[Adaptive application controls](./adaptive-application-controls.md)  | GA | GA | GA
[Adaptive network hardening](./adaptive-network-hardening.md) | GA | GA | NA
[Docker host hardening](./harden-docker-hosts.md) |  | GA | GA | GA
[Integrated Qualys scanner](./deploy-vulnerability-assessment-vm.md) | GA | NA | NA
[Compliance dashboard/reports](./regulatory-compliance-dashboard.md)<br/><br/> Compliance standards might differ depending on the cloud type.| GA | GA | GA
[Defender for Endpoint integration](./integration-defender-for-endpoint.md) | | GA | GA | NA
[Connect AWS account](./quickstart-onboard-aws.md) | GA | NA | NA
[Connect GCP project](./quickstart-onboard-gcp.md) | GA | NA | NA
**[Defender for Storage](./defender-for-storage-introduction.md)**<br/><br/> Some alerts in Defender for Storage are in public preview. | GA | GA | NA
**[Defender for SQL servers on machines](./defender-for-sql-introduction.md)** | GA | GA | NA
**[Microsoft Sentinel bi-directional alert synchronization](../sentinel/connect-azure-security-center.md)** | Public preview | NA | NA 



## Next steps

Start reading about [Defender for Cloud features](defender-for-cloud-introduction.md).
