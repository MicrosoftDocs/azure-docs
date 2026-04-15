---
title: SAP LogServ integration with Microsoft Sentinel Solution for SAP overview
description: This article introduces the Microsoft Sentinel Solution for SAP integration with SAP LogServ, an SAP-provided add-on that extends monitoring beyond the SAP application layer to infrastructure, database, and OS logs for SAP RISE customers.
author: MartinPankraz
ms.author: mapankra
ms.topic: concept-article
ms.date: 04/07/2026
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security

#Customer intent: As a security analyst, I want to extend my Microsoft Sentinel SAP monitoring beyond the application layer so that I can gain full-stack visibility into SAP RISE managed infrastructure, database, and OS logs.

---

# SAP LogServ integration with Microsoft Sentinel Solution for SAP overview

The [Microsoft Sentinel Solution for SAP applications](solution-overview.md) provides powerful application-layer monitoring for SAP systems, tracking user activity, business transactions, and critical events. However, in SAP RISE/ECS environments, infrastructure and operating system logs are owned and managed by SAP, and aren't accessible through the standard SAP application connector.

SAP LogServ bridges that gap. It's an SAP Enterprise Cloud Services (ECS) service that centralizes logs from all systems, applications, and ECS services managed by SAP. The **SAP LogServ (RISE), S/4HANA Cloud private edition** solution in the Microsoft Sentinel Content Hub enables ingestion of these infrastructure-level logs into Microsoft Sentinel, complementing the existing application-layer coverage.

> [!IMPORTANT]
> SAP LogServ is an optional service within your SAP Cloud ERP private (RISE) package. A purchase order for SAP LogServ must be completed before you can use this integration. Contact your SAP account team for details.

## What logs does SAP LogServ provide?

LogServ extends your monitoring scope beyond the SAP application layer to include logs that SAP ECS owns as the system provider. The available log types include:

| Log category | Examples |
|---|---|
| **Database** | SAP HANA database logs |
| **Application server** | AS JAVA, ICM, SAP Gateway |
| **Web and connectivity** | SAP Web Dispatcher, SAP Cloud Connector |
| **Operating system** | OS-level logs |
| **Network and security** | Network, DNS, Proxy, Firewall logs |
| **Third-party databases** | Non-HANA database logs where applicable |

Check with SAP for the latest available log types and any updates to supported log sources.

> [!NOTE]
> The SAP Security Audit Log (AS ABAP) for the application layer is handled by the [Microsoft Sentinel Solution for SAP applications](solution-overview.md) data connector, not by SAP LogServ. Deploy both solutions together for full-stack coverage.

## How the two solutions work together

Deploy the SAP LogServ solution alongside the Microsoft Sentinel Solution for SAP applications for comprehensive visibility across the entire SAP RISE stack:

- **Microsoft Sentinel Solution for SAP applications**: Monitors the SAP application layer, including business logic, user activity, sensitive transactions, privilege escalation, and data exfiltration via the [agentless data connector](deployment-overview.md?tabs=agentless).
- **SAP LogServ solution**: Provides infrastructure, database, and OS-layer logs from SAP-managed environments via a dedicated data connector installed from the Content Hub.

Together, these solutions give your security team visibility from business logic down to the infrastructure layer, enabling cross-layer correlation and threat detection using the [60+ built-in analytics rules](sap-solution-security-content.md#built-in-analytics-rules) and the Microsoft Security Suite.

## Key capabilities

- **Near real-time log collection** with agentless integration into Microsoft Sentinel via the SAP LogServ data connector.
- **Built-in security content** including analytics rules and workbooks provided by SAP for LogServ-specific log types.
- **Long-term retention** configurable per data source with up to 12 years retention using [Microsoft Sentinel Data Lake](../datalake/sentinel-lake-overview.md).
- **SOAR integration** with Microsoft Sentinel's security orchestration, automation, and response capabilities, including and [SAP user blocking via Microsoft Teams](https://blogs.sap.com/2023/05/22/from-zero-to-hero-security-coverage-with-microsoft-sentinel-for-your-critical-sap-security-signals-blog-series/).
- **Cross-signal correlation** across endpoints, Microsoft Entra ID data, and other data sources in your Microsoft Sentinel workspace.

## Prerequisites

- A completed purchase order for **SAP LogServ** as part of your SAP RISE/ECS contract.
- A [Microsoft Sentinel](../overview.md) workspace.
- The Microsoft Sentinel Solution for SAP applications installed from the [Microsoft Sentinel Content Hub](https://marketplace.microsoft.com/en-us/product/sentinel4sap.sentinel4sap?tab=Overview) for application-layer monitoring.
- The SAP LogServ (RISE), S/4HANA Cloud private edition solution installed from the [Microsoft Sentinel Content Hub](https://marketplace.microsoft.com/en-us/product/sap_jasondau.azure-sentinel-solution-saplogserv?tab=Overview).

> [!NOTE]
> Only **Azure-hosted SAP RISE** customers have the option for fully integrated deployment. For SAP RISE on other platforms, [SAP's self-hosted log forwarder](https://pypi.org/project/sap-ecs-log-forwarder/) needs to be installed on a customer-hosted component with network connectivity to the SAP LogServ service and the Microsoft Sentinel Data Collection Endpoint. The forwarder has dedicated configuration options for Microsoft Sentinel for SAP.

## Deploy the solution

1. Install the **SAP LogServ (RISE), S/4HANA Cloud Private Edition** solution from the [Microsoft Sentinel Content Hub](https://azuremarketplace.microsoft.com/marketplace/apps/sap_jasondau.azure-sentinel-solution-saplogserv?tab=Overview). The connector deployment creates a Data Collection Endpoint and Data Collection Rule in the same resource group as your Log Analytics workspace.

    If the deploying user lacks permissions to create a Microsoft Entra app registration automatically, create the app registration separately, supply a secret, and assign the app ID to the Data Collection Rule with the [Monitoring Metrics Publisher](/azure/role-based-access-control/built-in-roles/monitor#monitoring-metrics-publisher) role.

1. Contact your **SAP ECS CDM or ECS TSM** to initiate onboarding. Copy `sap-logserv-sentinel-integration@service.microsoft.com` on the email with the subject line **SAP LogServ and Microsoft Sentinel - Activation**, including your SAP RISE customer details.

1. Share the following configuration details with SAP through a secure channel:
    - Microsoft Entra tenant ID
    - Microsoft Entra app ID
    - Microsoft Entra app secret
    - Data Collection Endpoint URL
    - Data Collection Rule Immutable ID

SAP validates eligibility and configures automatic log forwarding to your Microsoft Sentinel for SAP workspace.

> [!TIP]
> Before sharing your configuration with SAP, consider performing a smoke test to validate end-to-end connectivity. For guidance, see the [SAP LogServ blog series](https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-members/ultimate-blog-series-sap-logserv-integration-with-microsoft-sentinel/ba-p/14126401).

## Discovering SAP LogServ data in Microsoft Sentinel for SAP

Once the solution is deployed and logs are flowing, use the following resources to explore and analyze your SAP LogServ data in Microsoft Sentinel.

### SAP LogServ Insights workbook

The SAP LogServ Insights Dashboard workbook provides real-time monitoring of SAP RISE infrastructure log ingestion and system activity.

:::image type="content" source="./media/partner/logserv-workbook.png" alt-text="Screenshot of the SAP LogServ Insights Dashboard workbook." lightbox="./media/partner/logserv-workbook.png":::

The workbook shows:

- An overview of **Total Events**, **Active Systems**, **Data Volume**, **Data Status**, and **Most Recent Data**, helping analysts quickly assess log ingestion health and freshness.
- A **Data Freshness Status** indicator using color-coded labels to highlight whether ingestion is current, delayed, or stale.
- Filters for **Log Analytics Workspace**, **Time Range**, **Log Type**, **Log Sub-Type**, and **Activity Status** to narrow down specific log sources and systems.
- An **Alert Configuration** section that lets you create alert rules directly from the workbook, with configurable alert type, name, threshold, and severity.
- A **Log Volume Timeline** that visualizes log ingestion trends over time, helping analysts identify spikes, drops, or anomalies that might be associated with infrastructure changes or security incidents.

For more information on how to customize and use the workbook, see [Tutorial: Visualize and monitor your data](../monitor-your-data.md).

### Built-in analytics rules

The SAP LogServ solution and the Microsoft Sentinel Solution for SAP applications each provide analytics rules that target different layers of the SAP RISE stack:

- **SAP LogServ analytics rules**: Focus on **infrastructure-layer detections**, such as SAP HANA database audit trail deactivation, OS-level anomalies, network and firewall events, and other logs from SAP-managed infrastructure. These rules are installed with the SAP LogServ solution from the Content Hub.
- **Microsoft Sentinel Solution for SAP applications analytics rules**: Cover the **application layer**, including [60+ built-in rules](sap-solution-security-content.md#built-in-analytics-rules) for detecting privilege escalation, sensitive transactions, data exfiltration, and unauthorized user activity within the SAP business logic.

Deploy both solutions together for cross-layer detection coverage spanning from SAP HANA database and OS infrastructure up through the SAP application layer.

The following example shows a SAP LogServ infrastructure-layer detection for a HANA database audit trail deactivation in Microsoft Sentinel, surfaced as an incident in Microsoft Defender portal:

:::image type="content" source="./media/partner/logserv-hana-db-detection.png" alt-text="Screenshot of a SAP LogServ HANA DB - Deactivation of Audit Trail incident in Microsoft Defender." lightbox="./media/partner/logserv-hana-db-detection.png":::

## Related content

- [Microsoft Sentinel Solution for SAP applications overview](solution-overview.md)
- [Deploy the Microsoft Sentinel solution for SAP applications](deployment-overview.md)
- [Microsoft Sentinel Solution for SAP BTP overview](sap-btp-solution-overview.md)
- [Microsoft Sentinel solution for SAP - Partner add-ons](solution-partner-overview.md)
- [Azure identity and security services with SAP RISE](../../sap/workloads/rise-integration-security.md)
