---
title: What is Elastic on Azure? - Azure Native Integration
description: Learn about the Elastic Azure Native Integration, which provides managed Elasticsearch, Observability, and Security services deployed and billed directly through Azure.
ms.topic: overview
ms.date: 07/01/2025
ai-usage: ai-assisted
#customer intent: As a developer or cloud engineer, I want to understand what Elastic on Azure offers so I can decide whether to use it for search, observability, or security monitoring.
---

# What is Elastic on Azure?

[!INCLUDE [what-is](../includes/what-is.md)]

Elastic on Azure is a set of managed services that deliver search, log analytics, and security monitoring functions for Azure environments. You deploy Elastic resources directly from the Azure portal, and billing flows through your Azure subscription.

## Why use the Azure Native Integration?

You can run Elastic independently, but the Azure Native Integration simplifies the experience:

| Capability | Without integration | With Azure Native Integration |
|-----------|-------------------|------------------------------|
| **Deployment** | Sign up on elastic.co, configure separately | Deploy from Azure portal or CLI |
| **Billing** | Separate Elastic invoice | Consolidated on your Azure bill |
| **Authentication** | Separate Elastic credentials | Single sign-on via Microsoft Entra ID |
| **Log forwarding** | Manual pipeline configuration | Automated Azure diagnostic log routing |
| **Agent deployment** | Manual agent installation per VM | One-click agent deployment from Azure portal |
| **OpenAI integration** | Manual setup | Built-in Azure OpenAI configuration |

## Available services

Elastic on Azure offers three distinct services, each tailored to a specific workload:

| Service | Use case | What it does |
|---------|----------|-------------|
| **Elastic Cloud (Elasticsearch)** | Search and analytics | Stores, searches, and analyzes structured and unstructured data at scale. Supports full-text search, vector search, and semantic search |
| **Elastic Observability** | Monitoring and APM | Collects logs, metrics, and traces to monitor application performance and infrastructure health. Includes alerting and anomaly detection |
| **Elastic Security** | Threat detection and response | Analyzes security events for threat detection, investigation, and incident response across Azure resources. Includes SIEM and endpoint protection |

Each service is available as a separate Marketplace offering with its own pricing and configuration.

## How it works

When you create an Elastic resource in Azure:

1. **Azure provisions a managed resource** (`Microsoft.Elastic/monitors`) in your chosen resource group and region.
2. **Elastic creates the deployment** — either a serverless project (auto-scaling, usage-based) or a cloud-hosted cluster (dedicated, managed) in the same region.
3. **Azure configures log forwarding** — subscription activity logs and resource diagnostic logs are routed to Elastic based on your tag rules.
4. **SSO is established** — Microsoft Entra ID is linked so your team can access the Elastic portal without separate credentials.

Data stays in the Azure region where the service is deployed.

## Integrated billing

Azure Native ISV Service includes integrated billing: Elastic resource costs are posted to your Azure subscription through the Microsoft Commercial Marketplace. You can create multiple Elastic Cloud resources (deployments) across different Azure subscriptions, and all costs associated with a single Elastic Cloud organization are posted to one Azure subscription — the one used to create the first Elastic resource.

The following terms describe how the pieces fit together:

- **Azure Marketplace SaaS ID** — A unique identifier generated one time by the Microsoft Commercial Marketplace when a user creates their first Elastic resource through Azure (portal, API, SDK, or Terraform). It's mapped 1:1 to an Azure user identity and an Azure subscription.
- **Elastic Cloud organization** — The top-level container in Elastic Cloud under which everything is grouped and managed. The organization is created automatically as part of your first Elastic resource creation. The initial member can invite additional users.
- **Elastic resource (deployment)** — An Elastic Cloud deployment (or Serverless project) that runs an Elasticsearch cluster and other Elastic products. Multiple users in the same Elastic Cloud organization can create deployments from different Azure subscriptions, or from the Elastic Cloud Console directly.

### How Azure and Elastic Cloud IDs map

The Azure Marketplace SaaS ID maps **1:1** to an Elastic Cloud organization, which in turn can hold **many** Elastic deployments — and those deployments can live in different Azure subscriptions. All Elastic Cloud organization costs are posted to the Azure Marketplace SaaS ID, which maps to a single Azure subscription. Charges show up on the Azure Marketplace invoice as a single line item.

> [!IMPORTANT]
> Azure free credits and most Azure free trial offers can't be used to purchase Azure Marketplace third-party offers, including Elastic. For details, see [Understand your Azure Marketplace charges](/azure/cost-management-billing/understand/understand-azure-marketplace-charges#azure-credit-eligibility).

For more Elastic specific billing details, see the Elastic [Billing FAQ](https://www.elastic.co/guide/en/cloud/current/ec-faq-billing.html).

## Serverless vs. cloud-hosted

When creating an Elastic resource, you choose between two hosting types:

| Aspect | Serverless | Cloud hosted |
|--------|-----------|-------------|
| **Scaling** | Automatic, usage-based | Manual or autoscaling with configured limits |
| **Version management** | Always on latest version | You choose and manage the Elasticsearch version |
| **Pricing** | Pay per usage (ingestion, storage, search) | Pay for provisioned capacity |
| **Best for** | Variable workloads, getting started quickly | Predictable workloads, specific version requirements |

## Key capabilities

### Integrated onboarding

Deploy Elastic resources directly from the Azure portal using the `Microsoft.Elastic` resource provider. No separate Elastic account creation needed.

### Azure billing integration

All Elastic consumption is tracked and billed through your Azure subscription. View charges in Azure Cost Management alongside your other Azure resources.

### Single sign-on with Microsoft Entra ID

Access Elastic services using your Entra ID credentials. SSO is automatically enabled for all Azure users when you create an Elastic resource.

### Automated log forwarding

Route Azure subscription activity logs and resource diagnostic logs to Elastic for indexing and analysis. Configure which resources send logs using tag-based rules. For more information, see [Monitor & Observe Azure resources with Azure Native Integrations](../metrics-logs.md).

### Elastic Agent deployment

Deploy and manage Elastic Agents on Azure virtual machines directly from the Azure portal. Agents collect host-level metrics, logs, and security data.

### Azure OpenAI integration

Connect your Elastic deployment with Azure OpenAI to enable AI-powered search experiences, including semantic search and retrieval-augmented generation (RAG).

### Traffic filters

Restrict network access to your Elastic deployment using Azure Private Link or IP-based traffic filters for enhanced security.

## Region availability

Elastic on Azure is available in the regions listed on the create experience in the Azure portal. Select a region close to your workloads to minimize latency.

## Subscribe to Elastic

[!INCLUDE [subscribe](../includes/subscribe.md)]

- [Elastic Cloud (Elasticsearch)](https://azuremarketplace.microsoft.com/marketplace/apps/elastic.ec-azure-pp?tab=Overview)
- [Elastic Observability](https://azuremarketplace.microsoft.com/marketplace/apps/elastic.ec-azure-observability?tab=Overview)
- [Elastic Security](https://azuremarketplace.microsoft.com/marketplace/apps/elastic.ec-azure-security?tab=Overview)

[!INCLUDE [subscribe](../includes/subscribe-from-azure-portal.md)]

## Elastic links

For more help using the Elastic service, see the [Elastic documentation](https://www.elastic.co/guide/en/cloud/current/ec-azure-marketplace-native.html) for Azure integration.

## Next steps

> [!div class="nextstepaction"]
> [QuickStart: Create an Elastic resource](create.md)

- [Manage your Elastic resource](manage.md)
- [FAQ](faq.yml)
