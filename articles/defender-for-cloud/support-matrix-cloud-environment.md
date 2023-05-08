---
title: Microsoft Defender for Cloud support across cloud types
description: Review Defender for Cloud features and plans supported across different clouds
ms.topic: limits-and-quotas
ms.date: 05/01/2023
---

# Defender for Cloud support for commercial/government clouds

This article indicates which Defender for Cloud features are supported in Azure commercial and government clouds. 

## Cloud support

In the support table, **NA** indicates that the feature is not available.

**Feature/Plan** | **Azure** | **Azure Government** | **Azure China**<br/><br/>**21Vianet**
--- | --- | --- | --- 
**FOUNDATIONAL CSPM FEATURES** | | |  
[Continuous export](./continuous-export.md) | GA | GA | GA
[Workflow automation](./workflow-automation.md) | GA | GA | GA
[Recommendation exemption rules](./exempt-resource.md) | Public preview | NA | NA
[Alert suppression rules](./alerts-suppression-rules.md) | GA | GA | GA
[Alert email notifications](./configure-email-notifications.md) | GA | GA | GA
[Agent/extension deployment](monitoring-components.md) | GA | GA | GA
[Asset inventory](./asset-inventory.md) | GA | GA | GA
[Azure Workbooks support](./custom-dashboards-azure-workbooks.md) | GA | GA | GA
**DEFENDER FOR CLOUD PLANS** | | | 
**[Agentless discovery for Kubernetes](concept-agentless-containers.md)** | Public preview | NA | NA
**[Agentless vulnerability assessments for container images.](concept-agentless-containers.md)**<br/><br/> Including registry scanning (up to 20 unique images per billable resources) | Public preview | NA | NA
**[Defender CSPM](concept-cloud-security-posture-management.md)** | GA | NA | NA
**[Defender for APIs](defender-for-apis-introduction.md)** | Public preview | NA | NA
**[Defender for App Service](defender-for-app-service-introduction.md)** | GA | NA | NA
**[Defender for Azure Cosmos DB](concept-defender-for-cosmos.md)** | Public preview | NA | NA
**[Defender for Azure SQL database servers](defender-for-sql-introduction.md)**<br/><br/> Partial GA in Vianet21<br/> - A subset of alerts/vulnerability assessments is available.<br/>- Behavioral threat protection isn't available.| GA | GA | GA
**[Defender for Containers](defender-for-containers-introduction.md)**<br/><br/>Support for Arc-enabled Kubernetes clusters (and therefore AWS EKS too) is in public preview and not available on Azure Government.<br/>Run-time visibility of vulnerabilities in container images is also a preview feature. | GA | GA | GA
[Defender extension for Azure Arc-enabled Kubernetes clusters/servers/data services](defender-for-kubernetes-azure-arc.md). Requires Defender for Containers/Defender for Kubernetes. | Public preview | NA | NA
**[Defender for DNS](defender-for-dns-introduction.md)** | GA | GA | GA
**[Defender for Key Vault](./defender-for-key-vault-introduction.md)** | GA | NA | NA
**[Defender for Kubernetes](./defender-for-kubernetes-introduction.md)**<br/><br/> Defender for Kubernetes is deprecated and replaced by Defender for Containers. Support for Azure Arc-enabled clusters is in public preview and not available in government clouds. [Learn more](defender-for-kubernetes-introduction.md). | GA | GA | GA
**[Defender for open-source relational databases](defender-for-databases-introduction.md)** | GA | NA | NA  
**[Defender for Resource Manager](./defender-for-resource-manager-introduction.md)** | GA | GA | GA
**DEFENDER FOR SERVERS FEATURES** | | |
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
**[Defender for Storage](./defender-for-storage-introduction.md)**<br/><br/> Some threat protection alerts for Defender for Storage are in public preview. | GA | GA (activity monitoring) | NA
**[Defender for SQL servers on machines](./defender-for-sql-introduction.md)** | GA | GA | NA
**[Kubernetes workload protection](kubernetes-workload-protections.md)** | GA | GA | GA
**[Microsoft Sentinel bi-directional alert synchronization](../sentinel/connect-azure-security-center.md)** | Public preview | NA | NA 



## Next steps

Start reading about [Defender for Cloud features](defender-for-cloud-introduction.md).
