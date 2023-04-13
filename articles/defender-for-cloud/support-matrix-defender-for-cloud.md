---
title: Microsoft Defender for Cloud interoperability with Azure services, Azure clouds, and client operating systems
description: Learn about the Azure cloud environments where Defender for Cloud can be used, the Azure services that Defender for Cloud protects, and the client operating systems that Defender for Cloud supports.
ms.topic: limits-and-quotas
author: bmansheim
ms.author: benmansheim
ms.date: 03/08/2023
---

# Support matrices for Defender for Cloud

This article indicates the Azure clouds, Azure services, and client operating systems that are supported by Microsoft Defender for Cloud.

## Security benefits for Azure services

Defender for Cloud provides recommendations, security alerts, and vulnerability assessment for these Azure services:

|Service|[Recommendations](security-policy-concept.md) free with [Foundational CSPM](concept-cloud-security-posture-management.md) |[Security alerts](alerts-overview.md) |Vulnerability assessment|
|:----|:----:|:----:|:----:|
|Azure App Service|✔|✔|-|
|Azure Automation account|✔|-|-|
|Azure Batch account|✔|-|-|
|Azure Blob Storage|✔|✔|-|
|Azure Cache for Redis|✔|-|-|
|Azure Cloud Services|✔|-|-|
|Azure Cognitive Search|✔|-|-|
|Azure Container Registry|✔|✔|[Defender for Containers](defender-for-containers-introduction.md)|
|Azure Cosmos DB*|✔|✔|-|
|Azure Data Lake Analytics|✔|-|-|
|Azure Data Lake Storage|✔|✔|-|
|Azure Database for MySQL*|-|✔|-|
|Azure Database for PostgreSQL*|-|✔|-|
|Azure Event Hubs namespace|✔|-|-|
|Azure Functions app|✔|-|-|
|Azure Key Vault|✔|✔|-|
|Azure Kubernetes Service|✔|✔|-|
|Azure Load Balancer|✔|-|-|
|Azure Logic Apps|✔|-|-|
|Azure SQL Database|✔|✔|[Defender for Azure SQL](defender-for-sql-introduction.md)|
|Azure SQL Managed Instance|✔|✔|[Defender for Azure SQL](defender-for-sql-introduction.md)|
|Azure Service Bus namespace|✔|-|-|
|Azure Service Fabric account|✔|-|-|
|Azure Storage accounts|✔|✔|-|
|Azure Stream Analytics|✔|-|-|
|Azure Subscription|✔ **|✔|-|
|Azure Virtual Network</br> (incl. subnets, NICs, and network security groups)|✔|-|-|

\* These features are currently supported in preview.

\*\* Azure Active Directory (Azure AD) recommendations are available only for subscriptions with [enhanced security features enabled](enable-enhanced-security.md).

## Features supported in different Azure cloud environments

Microsoft Defender for Cloud is available in the following Azure cloud environments:

| Feature/Service                                                                                                                                               | Azure          | Azure Government               | Azure China 21Vianet           |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|--------------------------------|--------------------------------|
| **Defender for Cloud free features**                                                                                                                          |                |                                |                                |
| - [Continuous export](./continuous-export.md)                                                                                                                 | GA             | GA                             | GA                             |
| - [Workflow automation](./workflow-automation.md)                                                                                                             | GA             | GA                             | GA                             |
| - [Recommendation exemption rules](./exempt-resource.md)                                                                                                      | Public Preview | Not Available                  | Not Available                  |
| - [Alert suppression rules](./alerts-suppression-rules.md)                                                                                                    | GA             | GA                             | GA                             |
| - [Email notifications for security alerts](./configure-email-notifications.md)                                                                               | GA             | GA                             | GA                             |
| - [Deployment of agents and extensions](monitoring-components.md)                                                                                  | GA             | GA                             | GA                             |
| - [Asset inventory](./asset-inventory.md)                                                                                                                     | GA             | GA                             | GA                             |
| - [Azure Monitor Workbooks reports in Microsoft Defender for Cloud's workbooks gallery](./custom-dashboards-azure-workbooks.md)                               | GA             | GA                             | GA                             |
| - [Integration with Microsoft Defender for Cloud Apps](./other-threat-protections.md#display-recommendations-in-microsoft-defender-for-cloud-apps)                | GA             | GA                  | Not Available                  |
| **Microsoft Defender plans and extensions**                                                                                                                   |                |                                |                                |
| - [Microsoft Defender for Servers](./defender-for-servers-introduction.md)                                                                                    | GA             | GA                             | GA                             |
| - [Microsoft Defender for App Service](./defender-for-app-service-introduction.md)                                                                            | GA             | Not Available                  | Not Available                  |
| - [Microsoft Defender for CSPM](./concept-cloud-security-posture-management.md) | GA | Not Available | Not Available |
| - [Microsoft Defender for DNS](./defender-for-dns-introduction.md)                                                                                            | GA             | GA                             | GA                             |
| - [Microsoft Defender for Kubernetes](./defender-for-kubernetes-introduction.md) <sup>[1](#footnote1)</sup>                                                   | GA             | GA                             | GA                             |
| - [Microsoft Defender for Containers](./defender-for-containers-introduction.md) <sup>[7](#footnote7)</sup>                                                  | GA             | GA                             | GA                             |
| - [Defender extension for Azure Arc-enabled Kubernetes clusters, servers or data services](./defender-for-kubernetes-azure-arc.md) <sup>[2](#footnote2)</sup> | Public Preview | Not Available                  | Not Available                  |
| - [Microsoft Defender for Azure SQL database servers](./defender-for-sql-introduction.md)                                                                     | GA             | GA                             | GA  <sup>[6](#footnote6)</sup> |
| - [Microsoft Defender for SQL servers on machines](./defender-for-sql-introduction.md)                                                                        | GA             | GA                             | Not Available                  |
| - [Microsoft Defender for open-source relational databases](./defender-for-databases-introduction.md)                                                         | GA             | Not Available                  | Not Available                  |
| - [Microsoft Defender for Key Vault](./defender-for-key-vault-introduction.md)                                                                                | GA             | Not Available                  | Not Available                  |
| - [Microsoft Defender for Resource Manager](./defender-for-resource-manager-introduction.md)                                                                  | GA             | GA                             | GA                             |
| - [Microsoft Defender for Storage](./defender-for-storage-introduction.md) <sup>[3](#footnote3)</sup>                                                         | GA             | GA (Activity monitoring)                             | Not Available                  |
| - [Microsoft Defender for Azure Cosmos DB](concept-defender-for-cosmos.md)                                              | Public Preview | Not Available                  | Not Available                  |
| - [Kubernetes workload protection](./kubernetes-workload-protections.md)                                                                                      | GA             | GA                             | GA                             |
| - [Bi-directional alert synchronization with Sentinel](../sentinel/connect-azure-security-center.md)                                                          | Public Preview | Not Available                  | Not Available                  |
| **Microsoft Defender for Servers features** <sup>[4](#footnote4)</sup>                                                                                        |                |                                |                                |
| - [Just-in-time VM access](./just-in-time-access-usage.md)                                                                                                    | GA             | GA                             | GA                             |
| - [File Integrity Monitoring](./file-integrity-monitoring-overview.md)                                                                                        | GA             | GA                             | GA                             |
| - [Adaptive application controls](./adaptive-application-controls.md)                                                                                         | GA             | GA                             | GA                             |
| - [Adaptive network hardening](./adaptive-network-hardening.md)                                                                                               | GA             | GA                 | Not Available                  |
| - [Docker host hardening](./harden-docker-hosts.md)                                                                                                           | GA             | GA                             | GA                             |
| - [Integrated Qualys vulnerability scanner](./deploy-vulnerability-assessment-vm.md)                                                                          | GA             | Not Available                  | Not Available                  |
| - [Regulatory compliance dashboard & reports](./regulatory-compliance-dashboard.md) <sup>[5](#footnote5)</sup>                                                | GA             | GA                             | GA                             |
| - [Microsoft Defender for Endpoint deployment and integrated license](./integration-defender-for-endpoint.md)                                                 | GA             | GA                             | Not Available                  |
| - [Connect AWS account](./quickstart-onboard-aws.md)                                                                                                          | GA             | Not Available                  | Not Available                  |
| - [Connect GCP project](./quickstart-onboard-gcp.md)                                                                                                          | GA             | Not Available                  | Not Available                  |

<sup><a name="footnote1"></a>1</sup> Partially GA: Support for Azure Arc-enabled clusters is in public preview and not available on Azure Government.

<sup><a name="footnote2"></a>2</sup> Requires Microsoft Defender for Kubernetes or Microsoft Defender for Containers.

<sup><a name="footnote3"></a>3</sup> Partially GA: Some of the threat protection alerts from Microsoft Defender for Storage are in public preview.

<sup><a name="footnote4"></a>4</sup> These features all require [Microsoft Defender for Servers](./defender-for-servers-introduction.md).

<sup><a name="footnote5"></a>5</sup> There may be differences in the standards offered per cloud type.
 
<sup><a name="footnote6"></a>6</sup> Partially GA: Subset of alerts and vulnerability assessment for SQL servers. Behavioral threat protections aren't available.

<sup><a name="footnote7"></a>7</sup> Partially GA: Support for Arc-enabled Kubernetes clusters (and therefore AWS EKS too) is in public preview and not available on Azure Government. Run-time visibility of vulnerabilities in container images is also a preview feature.

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