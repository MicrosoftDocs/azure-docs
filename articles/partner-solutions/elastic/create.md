---
title: Create Elastic application
description: This article describes how to use the Azure portal to create Elastic Search, Elastic Vector Database, Elastic Observability, and Elastic Security resources.
author: pdjokar96
ms.author: piyushdash
ms.topic: quickstart
zone_pivot_groups: elastic-resource-type
ms.date: 10/09/2026
#customer intent: As an Azure developer, I want to create Elastic resources for search, vector database, log analytics, and security monitoring workloads.

---

# Quickstart: Create an Elastic resource

::: zone pivot="elastic-search"

In this quickstart, you create an Elastic Search resource for indexing application data and building search and analytics experiences. Choose a serverless project or a Cloud Hosted deployment, then connect a data source and run your first search in Elastic.

## What you create for search

- An Elasticsearch project or deployment for full-text search, vector search, and analytics.
- An Elasticsearch endpoint for indexing and querying data from your application, and access to Kibana to explore that data.
- An Azure resource linked to your Elastic deployment for integrated billing and single sign-on.

Azure log forwarding is optional. Creating the resource doesn't automatically index your application documents.

::: zone-end

::: zone pivot="elastic-vector-database"

In this quickstart, you create an Elastic Vector Database project for semantic search, retrieval-augmented generation (RAG), and AI-powered retrieval. After provisioning, use the guided onboarding to add documents, generate embeddings, and try a semantic search.

## What you create for vector retrieval

- A serverless project with vector-optimized defaults and infrastructure managed by Elastic.
- A resource overview with entry points to ingest and auto-embed documents, chat with your data in Elastic Agent Builder, and query it in Dev Tools.
- An Azure resource linked to your project for integrated billing and single sign-on.

Document ingestion and embedding happen in Elastic after creation. You don't need to enable Azure log forwarding or connect Azure OpenAI to use the built-in embedding workflow.

::: zone-end

::: zone pivot="elastic-observability"

In this quickstart, you create an Elastic Observability resource to monitor your applications and infrastructure. Route Azure platform logs to Elastic, then use Elastic integrations to add application telemetry such as metrics and traces.

## What you create for observability

- A serverless project or Cloud Hosted deployment for analyzing logs, metrics, and traces.
- Azure diagnostic log forwarding for the resources you choose to monitor.
- Access to Elastic to configure integrations, dashboards, and alerts, with billing and single sign-on managed through Azure.

Azure log forwarding provides platform logs. Application performance monitoring (APM), host telemetry, and Azure metrics require the corresponding Elastic integrations or agents.

::: zone-end

::: zone pivot="elastic-security"

In this quickstart, you create an Elastic Security resource to collect security-relevant data and support threat detection and investigation. Choose which Azure logs to forward, then connect additional security data sources and configure detection rules in Elastic.

## What you create for security

- A serverless project or cloud-hosted deployment for security analytics.
- Azure activity and resource log forwarding based on the settings and tag rules you select.
- Access to Elastic Security for integrations, detections, and investigations, with integrated Azure billing and single sign-on.

Creating the Azure resource doesn't automatically enroll endpoints or configure detection rules. You complete those tasks in Elastic after connecting your data sources.

::: zone-end

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]

> [!NOTE]
> A given email address can only be part of one Elastic organization at a time. When you create your first Elastic resource from Azure with a new email, a new organization is created along with your first deployment or serverless project. For subsequent resources created with the same email, all deployments and projects go into the same organization.

> [!NOTE]
> Single sign-on (SSO) between the Azure portal and Elastic Cloud uses Microsoft Entra ID. The first time you select an SSO link, if your tenant has no earlier Elastic resources, Microsoft Entra ID might ask you to grant the Elasticsearch (Elastic Cloud) app permission to sign you in. If your organization requires administrator consent, you see a **Need admin approval** message. Ask a tenant administrator to approve the app. To avoid the prompt, a tenant administrator can add the Elasticsearch (Elastic Cloud) gallery app to your tenant before users select the SSO link. Adding the gallery app is optional.

> [!IMPORTANT]
> Azure free credits and most Azure free trial offers **can't** be used to purchase Azure Marketplace third-party offers, including Elastic. Your Elastic charges are billed against a payment method that supports Marketplace purchases (for example, a pay-as-you-go subscription or an Enterprise Agreement). For details, see [Understand your Azure Marketplace charges](/azure/cost-management-billing/understand/understand-azure-marketplace-charges#azure-credit-eligibility).

## Choose a region

### Serverless regions

The serverless option for all four services is available in:

- East US
- West US 2
- Australia East
- Southeast Asia
- North Europe
- Sweden Central
- Central US
- Germany West Central
- Spain Central
- UAE North
- Brazil South
- East US 2 EUAP

For cloud-hosted region availability, see [Region availability](overview.md#region-availability).

## Create an Elastic resource

Open the [Elastic resource browse page](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Elastic%2Fmonitors) and select **Create**. The following steps apply to the offer selected in the tabs at the top of this article.

For help choosing an offer, see [Available services](overview.md#available-services).

::: zone pivot="elastic-search"

Select **Elasticsearch** (the Elastic Search offer). You can also open [Elastic Cloud (Elasticsearch) in Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/elastic.ec-azure-pp?tab=Overview) and select **Get It Now**.

Choose **Serverless** for automatically managed infrastructure, or **Cloud Hosted** if you need to select an Elasticsearch version and cluster size.

### Basics tab

1. In the **Basics** tab, enter values for the settings:

    | Field               | Action                                                    |
    |---------------------|-----------------------------------------------------------|
    | Subscription        | Select a subscription from the options. You must be an *Owner* or *Contributor*.   |
    | Resource group      | Use an existing resource group or create a new one.       |
    | Resource name       | Specify a unique name for the resource.                   |
    | Hosting Type        | Select **Serverless** or **Cloud Hosted**. See [Serverless vs. cloud-hosted](overview.md#serverless-vs-cloud-hosted) for guidance. |
    | Region              | Select a region to deploy your resource.                  |
    | Version (**Cloud Hosted** only) | Select an Elasticsearch version.              |
    | Size (**Cloud Hosted** only) | Review the cluster size and configuration.       |
    | Plan                | To choose a different plan, select **Change plan**.       |
    | Billing term        | Select monthly or annual billing.                         |
    | Price + Payment options | Review the pricing details for your configuration.    |

1. At the bottom of the page, select **Next: Logs & metrics**.

### Logs & metrics tab (optional)

Use this tab if you want to search Azure platform logs. For a document or application search workload, you can turn off log forwarding and ingest your content in Elastic after creation.

| Setting | What it does |
|---------|-------------|
| **Send subscription activity logs** | Forwards management plane operations (resource creation, deletion, role assignments) to Elastic |
| **Send Azure resource logs for all defined sources** | Forwards diagnostic logs from supported Azure resources to Elastic |

You can refine which resources send logs by specifying tag-based include/exclude rules under **Logs**. For more information, see [tag rules for sending logs](../metrics-logs.md#tag-rules-for-sending-logs).

> [!NOTE]
> Automatic metrics collection isn't supported yet. To send metrics of Azure services to Elastic, see [Azure Metrics integration](https://www.elastic.co/docs/reference/integrations/azure_metrics) in the Elastic documentation.

At the bottom of the page, select **Next: Azure OpenAI configuration**.

### Azure OpenAI configuration tab (optional)

Connect an Azure OpenAI text or chat completion deployment if you plan to use an Elastic AI Assistant. You don't need this connector to index documents or query Elasticsearch, and it doesn't configure an embedding model.

1. Select an existing **Azure OpenAI Resource**.

1. Select an existing **Azure OpenAI Deployment**.

    > [!TIP]
    > You can skip this step and configure Azure OpenAI later. See [Azure OpenAI integration](manage.md?pivots=elastic-search#azure-openai-integration).

1. At the bottom of the page, select **Next: Tags**.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

::: zone-end

::: zone pivot="elastic-vector-database"

Select **Elasticsearch Vector Database** to open **Create Elastic Vector Database**. You can also open [Elastic Vector Database in Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/elastic.ec-azure-vector?tab=Overview) and select **Get It Now**.

> [!NOTE]
> Elastic Vector Database is serverless only and uses vector-optimized defaults. The creation page doesn't show Hosting Type, Configuration, Version, or Size fields.

### Basics tab

1. In the **Basics** tab, enter values for the following settings:

    | Field               | Action                                                    |
    |---------------------|-----------------------------------------------------------|
    | Subscription        | Select a subscription from the options. You must be an *Owner* or *Contributor*. |
    | Resource group      | Use an existing resource group or create a new one.       |
    | Resource name       | Specify a unique name for the resource.                   |
    | Region              | Select a region to deploy your resource.                  |
    | Plan                | To choose a different plan, select **Change plan**.       |
    | Billing term        | Select monthly or annual billing.                         |
    | Price + Payment options | Review the usage-based pricing details.               |

1. At the bottom of the page, select **Next: Logs & metrics**.

### Logs & metrics tab (optional)

This tab controls Azure platform log forwarding, not document ingestion or embedding generation. For a vector retrieval workload, leave forwarding off unless you also want to index Azure logs.

If you need platform logs, enable **Send subscription activity logs** or **Send Azure resource logs for all defined sources** and apply [tag-based include and exclude rules](../metrics-logs.md#tag-rules-for-sending-logs) to select resources.

At the bottom of the page, select **Next: Azure OpenAI configuration**.

### Azure OpenAI configuration tab (optional)

The built-in embedding workflow uses Elastic's models and doesn't require an Azure OpenAI resource. Skip this tab to use that workflow.

If you also need an Azure OpenAI connector for Elastic's AI Assistant:

1. Select an existing **Azure OpenAI Resource**.

1. Select an existing **Azure OpenAI Deployment** that supports text or chat completion.

Select **Next: Tags** to continue. The Azure OpenAI connector is separate from the embedding configuration in Elastic.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

::: zone-end

::: zone pivot="elastic-observability"

Select **Elastic for Observability**. You can also open [Elastic Observability in Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/elastic.ec-azure-observability?tab=Overview) and select **Get It Now**.

Before configuring log forwarding, identify the applications and Azure resources you want to monitor. Use resource tags to separate environments or application groups.

### Basics tab

1. In the **Basics** tab, enter values for the settings:

    | Field               | Action                                                    |
    |---------------------|-----------------------------------------------------------|
    | Subscription        | Select a subscription from the options. You must be an *Owner* or *Contributor*.   |
    | Resource group      | Use an existing resource group or create a new one.       |
    | Resource name       | Specify a unique name for the resource.                   |
    | Hosting Type        | Select **Serverless** or **Cloud Hosted**. See [Serverless vs. cloud-hosted](overview.md#serverless-vs-cloud-hosted) for guidance. |
    | Region              | Select a region to deploy your resource.                  |
    | Version (**Cloud Hosted** only) | Select an Elasticsearch version.              |
    | Size (**Cloud Hosted** only) | Review the cluster size and configuration.       |
    | Plan                | To choose a different plan, select **Change plan**.       |
    | Billing term        | Select monthly or annual billing.                         |
    | Price + Payment options | Review the pricing details for your configuration.    |

1. At the bottom of the page, select **Next: Logs & metrics**.

### Logs & metrics tab (optional)

Choose the Azure platform logs that help you understand workload health and failures. Resource log forwarding is enabled by default; review the scope so that you collect the environments you intend to monitor.

| Setting | What it does |
|---------|-------------|
| **Send subscription activity logs** | Forwards management plane operations to Elastic |
| **Send Azure resource logs for all defined sources** | Forwards diagnostic logs from supported Azure resources to Elastic (enabled by default) |

Under **Logs**, use tag-based include/exclude rules to select the resources for an application or environment. For examples, see [tag rules for sending logs](../metrics-logs.md#tag-rules-for-sending-logs).

> [!NOTE]
> Automatic metrics collection isn't supported yet. To send metrics of Azure services to Elastic, see [Azure Metrics integration](https://www.elastic.co/docs/reference/integrations/azure_metrics) in the Elastic documentation.

At the bottom of the page, select **Next: Azure OpenAI configuration**.

### Azure OpenAI configuration tab (optional)

Connect an Azure OpenAI text or chat completion deployment for AI-assisted analysis in Elastic's Observability AI Assistant. This feature is optional and doesn't replace telemetry ingestion or alert configuration.

1. Select an existing **Azure OpenAI Resource**.

1. Select an existing **Azure OpenAI Deployment**.

1. At the bottom of the page, select **Next: Tags**.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

::: zone-end

::: zone pivot="elastic-security"

Select **Elastic for Security**. You can also open [Elastic Security in Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/elastic.ec-azure-security?tab=Overview) and select **Get It Now**.

Identify the Azure resources and subscriptions that belong in your security monitoring scope. Plan which additional sources, such as endpoint events, you'll connect in Elastic after creation.

### Basics tab

1. In the **Basics** tab, enter values for the settings:

    | Field               | Action                                                    |
    |---------------------|-----------------------------------------------------------|
    | Subscription        | Select a subscription from the options. You must be an *Owner* or *Contributor*.   |
    | Resource group      | Use an existing resource group or create a new one.       |
    | Resource name       | Specify a unique name for the resource.                   |
    | Hosting Type        | Select **Serverless** or **Cloud Hosted**. See [Serverless vs. cloud-hosted](overview.md#serverless-vs-cloud-hosted) for guidance. |
    | Region              | Select a region to deploy your resource.                  |
    | Version (**Cloud Hosted** only) | Select an Elasticsearch version.              |
    | Size (**Cloud Hosted** only) | Review the cluster size and configuration.       |
    | Plan                | To choose a different plan, select **Change plan**.       |
    | Billing term        | Select monthly or annual billing.                         |
    | Price + Payment options | Review the pricing details for your configuration.    |

1. At the bottom of the page, select **Next: Logs & metrics**.

### Logs & metrics tab (optional)

Choose the Azure platform logs to use for security auditing and investigations. Resource log forwarding is enabled by default. Subscription activity logs help you investigate management-plane changes such as resource deletion and role assignments.

| Setting | What it does |
|---------|-------------|
| **Send subscription activity logs** | Forwards management plane operations for security auditing |
| **Send Azure resource logs for all defined sources** | Forwards diagnostic logs for security analysis (enabled by default) |

Use tag-based include/exclude rules under **Logs** to align collection with your security monitoring scope. These rules select data sources; they aren't threat detection rules. For examples, see [tag rules for sending logs](../metrics-logs.md#tag-rules-for-sending-logs).

> [!NOTE]
> Automatic metrics collection isn't supported yet. To send metrics of Azure services to Elastic, see [Azure Metrics integration](https://www.elastic.co/docs/reference/integrations/azure_metrics) in the Elastic documentation.

At the bottom of the page, select **Next: Azure OpenAI configuration**.

### Azure OpenAI configuration tab (optional)

Connect an Azure OpenAI text or chat completion deployment for AI-assisted security analysis and threat investigation in Elastic. This connector is optional; detection rules and security integrations are configured separately in Elastic.

1. Select an existing **Azure OpenAI Resource**.

1. Select an existing **Azure OpenAI Deployment**.

1. At the bottom of the page, select **Next: Tags**.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

::: zone-end

## Verify your deployment

After the deployment succeeds, select **Go to resource**. If you configured log forwarding, wait a few minutes for data to arrive. Complete the following first-use steps for your offer.

::: zone pivot="elastic-search"

### Index data and run a search

1. On **Overview**, locate the **Elasticsearch endpoint** for API access.
2. Select **Add more data sources in Elastic** to choose an integration and ingest application data, or use the Elasticsearch API to index documents.
3. Select **View and manage your data in Elastic** to open Kibana and inspect the indexed data.
4. Run a search against your index and confirm that it returns the documents you ingested.

::: zone-end

::: zone pivot="elastic-vector-database"

### Add documents and try semantic retrieval

1. On **Overview**, confirm that **Type** is **VectorDB**.
2. In **Ingest and auto-embed your data**, select **Add data & embed**. Follow the onboarding flow in Elastic to add documents and generate embeddings with `semantic_text` and Jina models.
3. After ingestion completes, select **Open in Dev Tools** in **Query your data in Dev Tools**. Scope the prefilled semantic query to your index and use the field name from your documents.
4. Run a query relevant to your content and confirm that it returns matching documents. You can then try **Open Agent Builder** in **Chat with your data**.

::: zone-end

::: zone pivot="elastic-observability"

### Confirm telemetry is arriving

1. Open **Monitored resources** in the resource's configuration menu and check that the expected Azure resources are sending logs.
2. From **Overview**, select **View and manage your data in Elastic**. Confirm that recent logs appear for the resources you selected.
3. Select **Add more data sources in Elastic** to configure APM, host monitoring, or other integrations required by your workload.
4. In Elastic, confirm that the relevant logs, metrics, or traces are available before creating dashboards and alerts.

> [!TIP]
> If Azure logs don't appear after 10 minutes, see [Troubleshooting](troubleshoot.md) for common causes and solutions.

::: zone-end

::: zone pivot="elastic-security"

### Confirm security data coverage

1. Open **Monitored resources** in the resource's configuration menu to confirm that the intended Azure resources are sending logs.
2. From **Overview**, select **View and manage your data in Elastic** and check that recent events from those sources are available.
3. Select **Add more data sources in Elastic** to configure the security integrations your environment needs, such as endpoint or cloud security data.
4. In Elastic Security, review and enable detection rules appropriate to the data you connected. Log forwarding alone doesn't configure detections.

> [!TIP]
> If Azure logs don't appear after 10 minutes, see [Troubleshooting](troubleshoot.md) for common causes and solutions.

::: zone-end

## Next steps

::: zone pivot="elastic-search"

> [!div class="nextstepaction"]
> [Manage search data and application access](manage.md?pivots=elastic-search#manage-search-data)

::: zone-end

::: zone pivot="elastic-vector-database"

> [!div class="nextstepaction"]
> [Embed, chat with, and query your vector data](manage.md?pivots=elastic-vector-database#work-with-your-vector-data)

::: zone-end

::: zone pivot="elastic-observability"

> [!div class="nextstepaction"]
> [Manage telemetry and monitoring coverage](manage.md?pivots=elastic-observability#monitor-applications-and-infrastructure)

::: zone-end

::: zone pivot="elastic-security"

> [!div class="nextstepaction"]
> [Manage security data and investigations](manage.md?pivots=elastic-security#manage-security-coverage-and-investigations)

::: zone-end
