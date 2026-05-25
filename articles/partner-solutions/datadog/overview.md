---
title: What is Datadog on Azure? - Azure Native Integration overview
description: Learn how the Azure Native Integration for Datadog provides unified monitoring, log forwarding, and metrics collection for your Azure workloads with integrated billing, SSO, and agent management.
ms.topic: overview
ms.date: 03/10/2025
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-desc
  - ai-seo-date:12/03/2024
#customer intent: As a developer or cloud engineer, I want to understand what the Datadog Azure Native Integration offers and why I should use it instead of setting up Datadog manually.
---

# What is Datadog on Azure?

Datadog is a monitoring and analytics platform for large-scale applications. It encompasses infrastructure monitoring, application performance monitoring (APM), log management, and real user monitoring (RUM). Datadog aggregates data across your entire stack with 800+ integrations for troubleshooting, alerting, and graphing.

The Azure Native Integration for Datadog lets you deploy, configure, and manage Datadog directly from the Azure portal as a first-class Azure resource. Instead of manually configuring API keys, setting up log pipelines, and managing separate billing, you get a streamlined experience that handles procurement, identity, data forwarding, and billing in one place.

[!INCLUDE [what-is](../includes/what-is.md)]

Microsoft and [Datadog](https://www.datadoghq.com/) developed this service and manage it together.

You can find Datadog in the [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Datadog%2Fmonitors) or get it on [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/datadog1591740804488.dd_liftr_v2?tab=Overview).

## Why use the Azure Native Integration?

Setting up Datadog manually on Azure requires configuring API keys, building custom log forwarding pipelines, installing agents on each VM individually, and managing a separate Datadog account with its own billing. The native integration eliminates this overhead.

| Capability | Manual setup | Azure Native Integration |
|-----------|-------------|--------------------------|
| **Provisioning** | Create Datadog account separately, exchange API keys | One-click from Azure portal, CLI, or IaC |
| **Billing** | Separate Datadog invoice | Consolidated on your Azure bill, counts toward MACC |
| **Authentication** | Separate Datadog credentials per user | Single sign-on via Microsoft Entra ID |
| **Metrics** | Install agents per VM, configure each resource | Auto-discovery of Azure resources, one-click agent deployment |
| **Logs** | Build custom pipelines to forward Azure logs | Built-in diagnostic settings, toggle on/off per resource type |
| **Multi-subscription** | Repeat setup per subscription | Monitor multiple subscriptions from a single Datadog resource |

## How it works

When you create a Datadog resource in Azure, the following components work together:

- **Datadog resource** (`Microsoft.Datadog/monitors`) — The Azure resource that acts as the control plane for the integration. It manages metric rules, log forwarding, agent installs, SSO configuration, and billing.
- **Datadog SaaS** (datadoghq.com) — The Datadog platform where your organization, API keys, dashboards, alerts, and log storage reside. Datadog owns and runs this application.
- **Diagnostic settings** — Azure Monitor diagnostic settings are automatically created on your resources to forward logs to Datadog.
- **Monitoring Reader role** — Assigned to the Datadog resource's managed identity to collect Azure platform metrics from your subscription.

The Datadog resource:

1. **Creates or links** a Datadog organization on the Datadog SaaS platform.
2. **Configures diagnostic settings** on your Azure resources to forward logs.
3. **Assigns Monitoring Reader** role to collect Azure platform metrics.
4. **Deploys Datadog agents** as VM extensions or App Service extensions.
5. **Maps Microsoft Entra ID** users for single sign-on access.

You manage everything from the Azure portal, Azure CLI, or infrastructure-as-code tools (Terraform, Bicep, ARM templates).

## Common scenarios

### Monitor a microservices application on AKS

You run a Kubernetes cluster with dozens of services. With the Datadog integration, you deploy the Datadog agent to your AKS cluster, auto-collect container metrics and logs, and correlate them with Azure platform metrics — all managed from a single Azure resource.

### Centralize observability across multiple subscriptions

Your organization has separate Azure subscriptions for dev, staging, and production. A single Datadog resource can monitor all three subscriptions, sending unified metrics and logs to one Datadog organization.

### Unified logging for compliance

You need to retain and search Azure activity logs, resource logs, and application traces in a single platform. The integration automatically forwards logs from Azure Monitor diagnostic settings to Datadog for indexing, search, and alerting.

### Proactive alerting on Azure infrastructure

You want to detect Azure VM failures, App Service latency spikes, or SQL Database performance issues before your customers notice. Datadog auto-collects Azure platform metrics and enables you to set up monitors and alerts in the Datadog portal.

## Key capabilities

### Integrated onboarding

Create a Datadog resource directly from the Azure portal, Azure CLI, or infrastructure-as-code templates. The resource provider `Microsoft.Datadog` handles organization creation, API key provisioning, and initial configuration.

### Unified billing

All Datadog costs appear on your Azure monthly bill. Charges count toward your Microsoft Azure Consumption Commitment (MACC). You can change billing plans directly from the Azure portal.

### Single sign-on with Microsoft Entra ID

Authenticate to the Datadog portal using your existing Azure credentials. No separate Datadog login is needed. SSO uses SAML 2.0 via a Microsoft Entra ID enterprise application.

### Automatic log forwarding

Forward Azure subscription activity logs and resource diagnostic logs to Datadog with a toggle. The integration creates and manages Azure Monitor diagnostic settings on your resources automatically. You can filter which resources send logs using tag-based rules.

For more information about supported log categories, see [Monitor & Observe Azure resources with Azure Native Integrations](../metrics-logs.md).

### Metrics collection

Azure platform metrics for all monitored resources are automatically sent to Datadog. The Datadog resource is assigned the **Monitoring Reader** role on your subscription to enable metric collection. You can also collect custom metrics from Application Insights.

### Agent deployment and management

Install and manage Datadog agents on these Azure compute resources directly from the portal:

| Compute type | How it works |
|-------------|-------------|
| **Azure Virtual Machines** | Installed as a VM extension |
| **Azure App Service** | Installed as an App Service extension |
| **Azure Kubernetes Service (AKS)** | Deployed as a DaemonSet |
| **Azure Arc-enabled machines** | Installed as an Arc extension |

### Resource collection and Cloud Security Posture Management

**Resource collection is enabled by default** when you create a Datadog resource. It lets Datadog pull metadata — types, tags, and configurations — for every Azure resource in the linked subscription, populating the Datadog [Resource Catalog](https://docs.datadoghq.com/infrastructure/resource_catalog/) and giving every other Datadog product accurate Azure context at no additional Datadog charge.

**Cloud Security Posture Management (CSPM)** is optional and off by default. When enabled, it continuously assesses your Azure environment against CIS, PCI DSS, SOC 2, HIPAA, and other benchmarks. CSPM can be enabled only when resource collection is on. Learn more about [Cloud Security Posture Management](https://www.datadoghq.com/knowledge-center/cloud-security-posture-management/).

## Region availability

The Datadog Azure Native Integration creates Datadog organizations on Datadog's Azure-specific site, **US3** (`us3.datadoghq.com`). The corresponding Azure region available to host the Datadog resource is **West US 2** (`westus2`). When you create the resource from the Azure portal or CLI, choose **West US 2** as the location — your Datadog organization is provisioned on the US3 site automatically.

> [!NOTE]
> Azure Native Datadog Service doesn't currently support Azure Government or sovereign cloud regions.

## Subscribe to Datadog

Before you create a Datadog resource, you need an active Datadog subscription in Azure Marketplace. The Datadog Azure Native ISV offer is published as **Datadog – An Azure Native ISV Service** (offer ID `dd_liftr_v2`).

To subscribe:

1. Open the [Datadog offer in Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/datadog1591740804488.dd_liftr_v2?tab=Overview), or sign in to the [Azure portal](https://portal.azure.com/), search the global search bar for **Marketplace**, and search for **Datadog – An Azure Native ISV Service**.
1. Choose a plan (or a [private offer](/marketplace/private-offers-in-azure-marketplace) if your account has one) and select **Subscribe**. Marketplace-billed Datadog usage counts toward your organization's [Microsoft Azure Consumption Commitment (MACC)](/marketplace/azure-consumption-commitment-benefit), where applicable.

After you subscribe, the create-resource pane opens. See [Create a Datadog resource](create.md) for the full setup flow.

## Datadog links

For more help using the Datadog service, see the following links to the [Datadog website](https://www.datadoghq.com/):

- [Azure integration documentation](https://docs.datadoghq.com/integrations/guide/azure-native-integration/) — Datadog's guide to the Azure Native Integration
- [Azure solution guide](https://www.datadoghq.com/solutions/azure/) — Overview of Datadog's Azure monitoring capabilities
- [Blog announcing the Datadog <> Azure Partnership](https://www.datadoghq.com/blog/azure-datadog-partnership/) — Announcement of the partnership
- [Datadog Pricing Page](https://www.datadoghq.com/pricing/) — Plans and pricing details

## Next steps

> [!div class="nextstepaction"]
> [Configure your environment](prerequisites.md)

- [QuickStart: Create a new Datadog resource](create.md)
- [Link to an existing Datadog organization](link-to-existing-organization.md)