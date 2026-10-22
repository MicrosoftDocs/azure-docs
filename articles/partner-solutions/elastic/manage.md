---
title: Manage settings for your Elastic resource in the Azure portal
description: Manage search data, vector retrieval, observability, or security workflows for your Elastic resource, along with shared Azure integration settings.
author: pdjokar96
ms.author: piyushdash
ms.topic: how-to
zone_pivot_groups: elastic-resource-type
ms.date: 10/09/2026
ms.custom: sfi-image-nochange
#customer intent: As an Azure developer, I want to use the Azure portal to manage Elastic resources for search, vector database, log analytics, and security monitoring workloads.

---

# Manage your Elastic resource

::: zone pivot="elastic-search"

Manage the data and application connections behind your search experience. Use the Azure resource to find endpoints and open Elastic, then manage indexes, ingest content, and explore search results in Elasticsearch and Kibana.

Start with [Manage search data](#manage-search-data). Azure log forwarding is an optional data source, not a prerequisite for application search.

::: zone-end

::: zone pivot="elastic-vector-database"

Manage your vector retrieval workflow from the **Get started with Elastic Vector Database** section on the resource overview. Its three tiles take you to document ingestion and automatic embedding, natural-language chat in Elastic Agent Builder, and semantic queries in Dev Tools.

Start with [Work with your vector data](#work-with-your-vector-data). Your project is serverless, so the core workflow is managing data and retrieval rather than configuring cluster versions or sizes.

::: zone-end

::: zone pivot="elastic-observability"

Manage telemetry collection and monitoring coverage for your applications and infrastructure. Use Azure to control which resources send platform logs, and use Elastic to configure APM and other integrations, explore logs, metrics, and traces, and manage dashboards and alerts.

Start with [Monitor applications and infrastructure](#monitor-applications-and-infrastructure).

::: zone-end

::: zone pivot="elastic-security"

Manage the data sources that support threat detection and investigation. Use Azure to control platform log collection and subscription coverage, and use Elastic Security to manage security integrations, detection rules, alerts, and investigations.

Start with [Manage security coverage and investigations](#manage-security-coverage-and-investigations).

::: zone-end

## Resource overview

[!INCLUDE [manage](../includes/manage.md)]

The **Essentials** section identifies your resource group, region, subscription, and billing term. Use the **Elasticsearch endpoint** for API access. The available links to Kibana and Elastic Cloud vary by hosting type; **Advanced Settings** opens management in Elastic Cloud.

Elastic Search, Elastic Observability, and Elastic Security resources are available as *Serverless* and *Cloud Hosted*. Elastic Vector Database is serverless only. For more information, see [Compare Elastic Cloud Hosted and Serverless](https://www.elastic.co/docs/deploy-manage/deploy/elastic-cloud/differences-from-other-elasticsearch-offerings).

::: zone pivot="elastic-search"

## Manage search data

Use your resource overview to connect applications, add searchable content, and inspect your indexes. Cloud Hosted resources also show the Elasticsearch version and cluster size; serverless resources show their project type.

**Cloud Hosted resource:**

:::image type="content" source="media/manage/resource-overview.png" alt-text="A screenshot of a Cloud Hosted Elastic resource in the Azure portal with the overview displayed in the working pane." lightbox="media/manage/resource-overview.png":::

**Serverless resource:**

:::image type="content" source="media/manage/elastic-search-resource.png" alt-text="A screenshot of an Elastic Search resource in the Azure portal with the overview displayed in the working pane." lightbox="media/manage/elastic-search-resource.png":::

### Add and explore searchable content

1. Select **Add more data sources in Elastic** to configure an integration, or use the **Elasticsearch endpoint** to ingest documents through the API.
2. Select **View and manage your data in Elastic** to open Kibana and inspect your indexes and documents.
3. Run queries against your data and refine your index mappings and search queries in Elastic to meet your application's needs.

Use **Advanced Settings** to manage the deployment in Elastic Cloud, including version and capacity changes for Cloud Hosted resources.

If Azure platform logs are part of your search workload, select **Ingest logs and metrics from Azure Services** to configure forwarding. This step doesn't ingest documents from your application or content store.

::: zone-end

::: zone pivot="elastic-vector-database"

## Work with your vector data

The overview identifies the project as **Type: VectorDB**. Below **Essentials**, **Get started with Elastic Vector Database** presents three tiles for working with your documents. These tiles replace the general log-ingestion and data-source tiles shown for the other offers.

:::image type="content" source="media/manage/elastic-vector-database-resource.png" alt-text="Screenshot of an Elastic Vector Database resource overview in the Azure portal, showing options to ingest and embed data, chat with data, and query data in Dev Tools." lightbox="media/manage/elastic-vector-database-resource.png":::

### Ingest and auto-embed your data

1. On the **Ingest and auto-embed your data** tile, select **Add data & embed**.
2. In the Elastic onboarding flow, add your documents and follow the steps to index them. Elastic generates embeddings automatically by using `semantic_text` and Jina models.
3. Wait for ingestion to complete before querying or chatting with the data. Note your index name and the field used for semantic search.

Azure **Logs & metrics** settings control platform log forwarding. They don't upload your documents or configure their embeddings.

### Chat with your data

1. On the **Chat with your data** tile, select **Open Agent Builder**.
2. Use Elastic Agent Builder to ask a natural-language question about the documents you ingested.
3. Review the answer against your source content and refine your questions or data as needed.

Elastic Agent Builder is the conversational experience for your data. It's different from Elastic Agent, which collects telemetry from virtual machines.

### Query your data in Dev Tools

1. On the **Query your data in Dev Tools** tile, select **Open in Dev Tools**.
2. Review the prefilled semantic search example. Scope it to your index, use the semantic field name from your documents, and replace the example question with one relevant to your data.
3. Run the query and inspect the returned documents to evaluate retrieval before using it in your application.

> [!NOTE]
> The built-in embedding workflow doesn't require the Azure OpenAI connector. [Azure OpenAI integration](#azure-openai-integration) configures a text or chat completion connector for Elastic's AI Assistant, not an embedding model for your documents.

::: zone-end

::: zone pivot="elastic-observability"

## Monitor applications and infrastructure

:::image type="content" source="media/manage/elastic-observability-resource.png" alt-text="A screenshot of an Elastic Observability resource in the Azure portal with the overview displayed in the working pane." lightbox="media/manage/elastic-observability-resource.png":::

Use the overview entry points according to the telemetry you need:

| Entry point | Observability task |
|-------------|--------------------|
| **Ingest logs and metrics from Azure Services** | Select the Azure platform logs to forward and maintain tag-based collection rules |
| **Add more data sources in Elastic** | Configure APM, infrastructure monitoring, or other integrations to collect application telemetry |
| **View and manage your data in Elastic** | Explore logs, metrics, and traces, and create dashboards and alerts |

### Maintain telemetry coverage

1. Review **Monitored resources** to check which Azure resources are sending logs. If expected resources are missing, review their tags and the [log forwarding rules](#reconfigure-rules-for-logs-and-metrics).
2. Use [Monitored Subscriptions](#monitor-multiple-subscriptions) to extend platform log collection across the subscriptions that host your applications.
3. Configure the relevant Elastic integrations or [deploy Elastic Agent](#elastic-agent-deployment) when you need telemetry beyond Azure diagnostic logs.
4. In Elastic, confirm that the required telemetry is arriving and update dashboards and alert rules as applications change.

> [!NOTE]
> Azure diagnostic log forwarding doesn't automatically collect application traces or Azure metrics. For Azure metrics, configure the [Azure Metrics integration](https://www.elastic.co/docs/reference/integrations/azure_metrics).

::: zone-end

::: zone pivot="elastic-security"

## Manage security coverage and investigations

:::image type="content" source="media/manage/elastic-security-resource.png" alt-text="A screenshot of an Elastic Security resource in the Azure portal with the overview displayed in the working pane." lightbox="media/manage/elastic-security-resource.png":::

Use the overview entry points to connect security data and investigate it:

| Entry point | Security task |
|-------------|---------------|
| **Ingest logs and metrics from Azure Services** | Collect activity and resource logs for security auditing and investigations |
| **Add more data sources in Elastic** | Configure endpoint, cloud security, and threat intelligence integrations |
| **View and manage your data in Elastic** | Open Elastic Security to review detections, investigate alerts, and explore security events |

### Maintain security data coverage

1. Review **Monitored resources** and [Monitored Subscriptions](#monitor-multiple-subscriptions) against the Azure environments in your security scope.
2. Check [log forwarding rules](#reconfigure-rules-for-logs-and-metrics) when you add or retag resources. Include and exclude rules control collection, not threat detection.
3. Configure additional integrations and endpoint policies in Elastic for the sources your detections require. Installing an agent alone isn't the same as configuring endpoint protection.
4. Review detection rules and investigate alerts in Elastic Security. Confirm that each rule has the required data sources before relying on its results.

::: zone-end

## Azure integration settings

The following settings manage the Azure integration rather than your indexes, embeddings, dashboards, or detection rules. For Search and Vector Database workloads, platform log collection and virtual machine agents are optional and separate from document ingestion.

### Reconfigure rules for logs and metrics

To change which Azure resources send logs to Elastic:

1. Select **Elastic deployment configuration** > **Logs & metrics** in the service menu.
2. Update the tag-based include/exclude rules or toggle individual settings. See [tag rules for sending metrics](../metrics-logs.md#tag-rules-for-sending-metrics) and [tag rules for sending logs](../metrics-logs.md#tag-rules-for-sending-logs) for worked examples.
3. Changes take effect within a few minutes as diagnostic settings are updated on matching resources.

For a full reference on what data is forwarded and how tag rules behave, see [Monitor & Observe Azure resources with Azure Native Integrations](../metrics-logs.md).

### View monitored resources

To view the list of resources emitting logs to Elastic, select **Elastic deployment configuration** > **Monitored resources** in the service menu.

> [!TIP]
> You can filter the list of resources by type, subscription, resource group, region, and whether the resource is sending logs to Elastic.

If a resource you expect to see isn't sending data, check:

- The resource type supports Azure Monitor diagnostic logs. See [supported categories](/azure/azure-monitor/essentials/resource-logs-categories).
- Your tag rules include (not exclude) the resource.
- The resource hasn't reached the limit of five diagnostic settings.

### Monitor multiple subscriptions

A single Elastic resource can monitor Azure resources across multiple subscriptions. This is useful when you have separate subscriptions for dev, staging, and production but want unified monitoring in Elastic.

#### Prerequisites

- You must have both of the following Azure permissions:

   - `Microsoft.Authorization/roleAssignments/write`
   - `Microsoft.Authorization/roleAssignments/delete`

- The resource provider for Elastic (`Microsoft.Elastic`) must be registered in the target subscription.

#### Add subscriptions

> [!IMPORTANT]
> When you link a subscription to an Elastic resource, ensure that the subscription isn't scope locked (read-only or delete locks). Scope locks can prevent the addition and removal of diagnostic settings. For more information, see [Lock your Azure resources](../../azure-resource-manager/management/lock-resources.md).

To monitor multiple subscriptions:

1. Select **Elastic deployment configuration** > **Monitored Subscriptions**.

1. Select **Add subscriptions** from the Command bar.

    The **Add Subscriptions** experience shows subscriptions you have _Owner_ role assigned to and any Elastic resource created in those subscriptions that is already linked to the same Elastic organization as the current resource.

1. Select the subscriptions you want to monitor and select **Add**.

    > [!IMPORTANT]
    > Setting separate tag rules for different subscriptions isn't supported. The tag rules from the primary resource apply to all monitored subscriptions.

    Diagnostic settings are automatically added to the subscription's resources that match the defined tag rules.

    Select **Refresh** to view the subscriptions and their monitoring status.

Once the subscription is added, the status changes to *Active*.

#### Remove subscriptions

> [!IMPORTANT]
> When you unlink a subscription from an Elastic resource, ensure that the subscription isn't scope locked (read-only or delete locks). Scope locks can prevent the addition and removal of diagnostic settings. For more information, see [Lock your Azure resources](../../azure-resource-manager/management/lock-resources.md).

To unlink subscriptions from an Elastic resource:

1. Select **Elastic deployment configuration** > **Monitored Subscriptions** from the service menu.

1. Select the subscription you want to remove.

1. Choose **Remove subscriptions**.

To view the updated list of monitored subscriptions, select **Refresh** from the Command bar.

### Elastic Agent deployment

You can install Elastic Agents on Azure virtual machines to collect host-level metrics, logs, and security events that aren't available through Azure diagnostic logs alone.

- Select **Elastic deployment configuration** > **Virtual machines** in the service menu.

[!INCLUDE [install-elastic-agent](../includes/agent.md)]

> [!TIP]
> Elastic Agents collect detailed process-level metrics, file integrity monitoring data, and custom application logs. This data complements the Azure platform logs configured in the Logs & metrics section.

### Azure OpenAI integration

Connect an Azure OpenAI text or chat completion deployment for use by Elastic's AI Assistant. This connector is separate from document ingestion and embedding generation; creating it doesn't configure a semantic search index.

To configure Azure OpenAI:

1. Select **Elastic deployment configuration** > **Azure OpenAI configuration**.

1. From the working pane's command bar, select **Add**.

1. In the *Add OpenAI Configuration* panel, select your preferred **Azure OpenAI Resource** and **Azure OpenAI Deployment**.

1. Select the **Create** button.

After the connector is created, navigate to Kibana to use it.

> [!NOTE]
> Kibana is a user interface that lets you visualize your Elasticsearch data and navigate the Elastic Stack. Your connector can be used in Elastic's AI Assistant, which provides contextual responses to your natural language prompts by invoking the Azure OpenAI deployment.

The deployment details (URL and API keys) are passed to Elastic to prepare the connector for use with Elastic's AI Assistant.

Currently, Elastic resources support only deployments of text or chat completion models, like GPT-4. For more information, see [OpenAI connector and action](https://www.elastic.co/docs/reference/kibana/connectors-kibana/openai-action-type).

## Traffic filters

Restrict network access to your Elastic deployment using IP address filtering or Azure Private Link. Traffic filters are defined as **rulesets** that you create once and then associate with one or more deployments. Each ruleset is **region-scoped** and must be in the same region as the deployments it protects; a deployment can have multiple rulesets attached, and once any ruleset is associated, all unmatched traffic is denied.

- **IP filtering** uses an allow list of individual IPv4 addresses or CIDR blocks. It's the simplest option for restricting public endpoint access from known networks (corporate egress, NAT gateways, jump boxes). Rules are evaluated against the source IP of incoming requests to the Elasticsearch and Kibana endpoints.
- **Azure Private Link** routes traffic to your deployment over the Microsoft backbone without traversing the public internet. You create an Azure Private Endpoint in your virtual network that targets the regional Elastic Cloud Private Link service alias, then register the endpoint's resource GUID and name as a Private Link ruleset and associate it with the deployment. The deployment becomes reachable only through that endpoint.

To create a ruleset from the Azure-integrated Elastic experience: in the left menu select **Elastic deployment configuration** > **Traffic Filter**, enter a name, pick **IP Address and CIDR Blocks** or **Private Link**, fill in the rules or endpoint details, and select **Create**. If a traffic filter is no longer needed, unlink it from the deployment first, then delete the ruleset.

> [!IMPORTANT]
> The traffic filter must be in the same region as the deployment.

**Learn more**

- [Configure IP traffic filters (Elastic Cloud)](https://www.elastic.co/docs/deploy-manage/security/ip-filtering-cloud)
- [Private connectivity to Elastic Cloud on Azure](https://www.elastic.co/docs/deploy-manage/security/private-connectivity-azure)
- [What is Azure Private Link?](../../private-link/private-link-overview.md)

## Connected Elastic resources

To view all Elastic resources and deployments you created (from both Azure and Elastic portals), go to the **Connected Elastic Resources** tab in any of your Azure Elastic resources.

You can manage the corresponding Elastic deployments or Azure resources using the links, provided you have Owner or Contributor rights to those deployments and resources.

## Delete Elastic resource

[!INCLUDE [delete-resource](../includes/delete-resource.md)]

> [!IMPORTANT]
>
> - A single Azure Marketplace SaaS subscription unifies billing for multiple Elastic deployments.
> - If you wish to completely stop billing for the Marketplace SaaS, delete all linked Elastic deployments created from the Azure portal or Elastic portal.

## Get support

Contact [Elastic](https://cloud.elastic.co/help) for customer support. If your Elastic Cloud resource is not fully set up and you're not able to access the Support page, send an email to support@elastic.co.

You can also request support in the Azure portal from the [resource overview](#resource-overview). Select **Support + Troubleshooting** > **New support request** from the service menu.

## Related content

::: zone pivot="elastic-search"

- [Create an Elastic Search resource](create.md?pivots=elastic-search)
- [Elastic documentation](https://www.elastic.co/docs)

::: zone-end

::: zone pivot="elastic-vector-database"

- [Create an Elastic Vector Database project](create.md?pivots=elastic-vector-database)
- [Vector Database hosting and capabilities](overview.md#vector-database-experience)

::: zone-end

::: zone pivot="elastic-observability"

- [Create an Elastic Observability resource](create.md?pivots=elastic-observability)
- [Monitor & Observe Azure resources with Azure Native Integrations](../metrics-logs.md)

::: zone-end

::: zone pivot="elastic-security"

- [Create an Elastic Security resource](create.md?pivots=elastic-security)
- [Monitor & Observe Azure resources with Azure Native Integrations](../metrics-logs.md)

::: zone-end

- [Troubleshooting Elastic on Azure](troubleshoot.md)
- [What is Azure Private Link?](../../private-link/private-link-overview.md)