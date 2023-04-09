---
title: Microsoft Defender for Cloud support across public 
description: Review the Defender for Cloud features and plans supported across different clouds
ms.topic: limits-and-quotas
author: bmansheim
ms.author: benmansheim
ms.date: 03/08/2023
---

# Defender for Cloud support for commercial/government clouds

This article indicates which Defender for Cloud features are supported in Azure commercial and government clouds. **NA** indicates that the feature is not available.

**Feature/Plan** | **Details** | **Azure** | **Azure Government** | **Azure China<br/><br/>**21Vianet
--- | --- | --- |--- | --- 
Foundational CSPM: [Continuous export](./continuous-export.md) | GA | GA | GA
Foundational CSPM: [Workflow automation](./workflow-automation.md) | GA | GA | GA
Foundational CSPM: [Recommendation exemption rules](./exempt-resource.md) | Public preview | NA | NA
Foundational CSPM: [Alert suppression rules](./alerts-suppression-rules.md) | GA | GA | GA
Foundational CSPM: [Alert email notifications](./configure-email-notifications.md) | GA | GA | GA
Foundational CSPM: [Agent/extension deployment](monitoring-components.md) | GA | GA | GA
Foundational CSPM: [Asset inventory](./asset-inventory.md) | GA | GA | GA
Foundational CSPM: [Azure Workbooks support](./custom-dashboards-azure-workbooks.md) | GA | GA | GA
Foundational CSPM: [Microsoft Defender for Cloud Apps integration](./other-threat-protections.md#display-recommendations-in-microsoft-defender-for-cloud-apps) | GA | GA | GA
[Defender CSPM](concept-cloud-security-posture-management.md) | GA | NA | NA
[Defender for APIs](defender-for-apis-introduction.md) | Public preview | NA | NA
[Defender for App Service](defender-for-app-service-introduction.md) | GA | NA | NA
[Defender for Azure Cosmos DB](concept-defender-for-cosmos.md) | Public preview | NA | NA
[Defender for Azure SQL database servers](defender-for-sql-introduction.md)<br/><br/> Partial GA in Vianet21. A subset of alerts/vulnerability assessments are available. Behavioral threat protection isn't available. | GA | GA | GA
[Defender for Containers](defender-for-containers-introduction.md)<br/><br/> Support for Azure Arc-enabled Kubernetes cluster/AWS  EKS is public preview in Commercial. See the table entry.<br/><br/> Runtime visiblity of vulnerabilities in container images | GA | GA | GA
Defender for Containers: [Azure Arc extension for Kubernetes clusters/servers/data services](defender-for-kubernetes-azure-arc.md) | Public preview | NA | NA
[Defender for DNS](defender-for-dns-introduction.md) | GA | GA | GA
[Defender for Key Vault](./defender-for-key-vault-introduction.md) | GA | NA | NA
[Defender for Kubernetes](./defender-for-kubernetes-introduction.md)<br/><br/> Defender for Kubernetes is deprecated and doesn't include new features. [Learn more](defender-for-kubernetes-introduction.md) | GA | GA | GA
[Defender for open-source relational databases](defender-for-databases-introduction.md) | GA | NA | NA  
[Defender for Resource Manager](./defender-for-resource-manager-introduction.md) | GA | GA | GA
Defender for Servers: [Just-in-time VM access](./just-in-time-access-usage.md) | GA | GA | GA
Defender for Servers: [File integrity monitoring](./file-integrity-monitoring-overview.md)  | GA | GA | GA
Defender for Servers: [Adaptive application controls](./adaptive-application-controls.md)  | GA | GA | GA
Defender for Servers: [Adaptive network hardening](./adaptive-network-hardening.md) | GA | GA | NA
Defender for Servers: [Docker host hardening](./harden-docker-hosts.md) |  | GA | GA | GA
Defender for Servers: [Integrated Qualys scanner](./deploy-vulnerability-assessment-vm.md) | GA | NA | NA
Defender for Servers: [Compliance dashboard/reports](./regulatory-compliance-dashboard.md)<br/><br/> Compliance standards might differ depending on the cloud type.| GA | GA | GA
Defender for Servers: [Defender for Endpoint integration](./integration-defender-for-endpoint.md) | | GA | GA | NA
Defender for Servers: [Connect AWS account](./quickstart-onboard-aws.md) | GA | NA | NA
Defender for Servers: [Connect GCP project](./quickstart-onboard-gcp.md) | GA | NA | NA
[Defender for Storage](./defender-for-storage-introduction.md)<br/><br/> Some Defender for Storage alerts are in public preview. | GA | GA | NA
[Defender for SQL servers on machines](./defender-for-sql-introduction.md) | GA | GA | NA
[Microsoft Sentinel bi-directional alert synchronization](../sentinel/connect-azure-security-center.md) | Public preview | NA | NA 


## Supported operating systems

Defender for Cloud depends on the [Azure Monitor Agent](../azure-monitor/agents/agents-overview.md) or the [Log Analytics agent](../azure-monitor/agents/log-analytics-agent.md). Make sure that your machines are running one of the supported operating systems as described on the following pages:

- Azure Monitor Agent
    - [Azure Monitor Agent for Windows supported operating systems](../azure-monitor/agents/agents-overview.md#windows)
    - [Azure Monitor Agent for Linux supported operating systems](../azure-monitor/agents/agents-overview.md#linux)
- Log Analytics agent
    - [Log Analytics agent for Windows supported operating systems](../azure-monitor/agents/agents-overview.md#windows)
    - [Log Analytics agent for Linux supported operating systems](../azure-monitor/agents/agents-overview.md#linux)

Also ensure your Log Analytics agent is [properly configured to send data to Defender for Cloud](working-with-log-analytics-agent.md#manual-agent).

To learn more about the specific Defender for Cloud features available on Windows and Linux, see:

- Defender for Servers support for [Windows](support-matrix-defender-for-servers.md#windows-machines) and [Linux](support-matrix-defender-for-servers.md#linux-machines) machines
- Defender for Containers [support for Windows and Linux containers](support-matrix-defender-for-containers.md#defender-for-containers-feature-availability)

> [!NOTE]
> Even though Microsoft Defender for Servers is designed to protect servers, most of its features are supported for Windows 10 machines. One feature that isn't currently supported is [Defender for Cloud's integrated EDR solution: Microsoft Defender for Endpoint](integration-defender-for-endpoint.md).

## Next steps

This article explained how Microsoft Defender for Cloud is supported in the Azure, Azure Government, and Azure China 21Vianet clouds. Now that you're familiar with the Defender for Cloud capabilities supported in your cloud, learn how to:

- [Manage security recommendations in Defender for Cloud](review-security-recommendations.md)
- [Manage and respond to security alerts in Defender for Cloud](managing-and-responding-alerts.md)