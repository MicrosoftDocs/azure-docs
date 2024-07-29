---
title: Architecture of Azure Operator Insights
description: Learn about the architecture of Azure Operator Insights and how you can integrate with it to analyze date from your network.
author: rcdun
ms.author: rdunstan
ms.reviewer: duncanarcher
ms.service: operator-insights
ms.date: 04/05/2024
ms.topic: concept-article

# Customer intent: As a systems architect at an operator, I want to understand the architecture of Azure Operator Insights so that I can integrate with it to analyze data from my network.

---

# Architecture of Azure Operator Insights

Azure Operator Insights is a fully managed service that enables the collection and analysis of massive quantities of network data gathered from complex multi-part or multi-vendor network functions. It delivers statistical, machine learning, and AI-based insights for operator-specific workloads to help operators understand the health of their networks and the quality of their subscribers' experiences in near real-time. For more information on the problem Azure Operator Insights solves, see [the general overview of Azure Operator Insights](overview.md).

Azure Operator Insights deploys a Data Product resource to encapsulate a specific category or namespace of data. Azure Operator Insights enables a fourth generation data mesh architecture, which offers query-time federation to correlate and query across multiple Data Products.

This following diagram shows the architecture of an Azure Operator Insights Data Product, and the surrounding services it interacts with.

:::image type="complex" source="media/architecture/operator-insights-detailed-architecture.svg" alt-text="Architecture diagram of Azure Operator Insights." lightbox="media/architecture/operator-insights-detailed-architecture.svg":::
  An Azure Operator Insights Data Product is in its own resource group. It deploys a managed resource group containing an Azure Key Vault instance that provides a shared access signature (SAS) token for ingestion storage. The SAS token is used for authentication when ingesting data. The options for ingesting data include Azure Operator Insights ingestion agents; Azure tools such as AzCopy, Azure Storage Explorer, and Azure Data Factory; and code-based mechanisms. The ingestion options can upload data from data sources such as Microsoft products and services, non-Microsoft products, and platforms. The data ingestion options can use the public internet, ExpressRoute, or Azure VPN Gateway. Data Products make data available over an ADLS consumption URL and a KQL consumption URL. Applications and services that can consume data include Azure Data Explorer (in dashboards and a follower database), Microsoft Power BI, Microsoft Fabric, Azure Machine Learning studio, Azure Databricks, Azure Logic Apps, Azure Storage Explorer, AzCopy, and non-Microsoft applications and services. The optional features and capabilities of Azure Operator Insights include Azure Monitor for logs and metrics, customer managed keys, Purview integration for data catalog, restricted IP addresses or private networking for data access, Microsoft Entra ID role-based access control for KQL consumption, and data retention and hot cache sizes.
:::image-end:::

The rest of this article gives an overview of: 

- Deployment of Azure Operator Insights Data Products.
- Data sources that feed an Azure Operator Insights Data Product.
- Ingestion options for getting data from those sources into an Azure Operator Insights Data Product.
- Azure connectivity options to get data from an on-premises private data center into Azure, where Azure Operator Insights Data Products reside.
- Consumption URLs exposed by an Azure Operator Insights Data Product.
- Configuration options and controls available when deploying or after deployment of an Azure Operator Insights Data Product.
- Methods for monitoring an Azure Operator Insights Data Product.

## Deployment of Data Products

You can deploy Azure Operator Insights Data Products with any standard Azure interface, including the Azure portal, Azure CLI, Azure PowerShell, or direct calls to the Azure Resource Manager (ARM) API. See [Create an Azure Operator Insights Data Product](data-product-create.md?tabs=azure-portal) for a quickstart guide to deploying with the Azure portal or the Azure CLI. When you deploy a Data Product, you can enable specific features such as integration with Microsoft Purview, customer-managed keys for data encryption, or restricted access to the Data Product. For more information on features you can enable at deployment, see [Data Product configuration options and controls](#data-product-configuration-options-and-controls).

Each Azure Operator Insights Data Product is scoped for a given category or namespace of data. An example is the data from a single network function (NF) such as a voice SBC. Some Data Products might contain correlated data from multiple NFs, particularly if the NFs are from the same vendor, such as the UPF, SMF, and AMF from a mobile packet core vendor. Each Data Product appears as a single Azure resource in your resource group and subscription. You can deploy multiple Data Products, for different categories of data, for example different mobile packet core NFs from different vendors, or a mobile packet core plus a radio access network (RAN) Data Product. 

Microsoft publishes several Data Products; the following image shows some examples. Partners and operators can also design and publish Data Products using the Azure Operator Insights data product factory (preview). For more information on the data product factory, see the [overview of the data product factory](data-product-factory.md).

:::image type="content" source="media/data-product-selection.png" alt-text="Screenshot of the Azure portal displaying a selection of Data Products from Microsoft.":::

Deploying an Azure Operator Insights Data Product creates the resource itself and a managed resource group in your subscription. The managed resource group contains an Azure Key Vault instance. The Key Vault instance contains a shared access signature (SAS) that you can use to authenticate when you upload files to the Data Product's ingestion storage URL. 

Once deployed, the Overview screen of the Azure Operator Insights Data Product resource shows essential information including:

- Version, product (Data Product type), and publisher.
- Ingestion storage URLs (see [Data ingestion](#data-ingestion)).
- Consumption URLs for ADLS and KQL (see [Data consumption](#data-consumption)).

:::image type="content" source="media/data-product-properties.png" alt-text="Screenshot of the Azure portal displaying properties of a Data Product, including the version, product, publisher, and ingestion and consumption URLs.":::

## Data sources

Each Azure Operator Insights Data Product ingests data from a particular data source. The data source could be:

- A network function such as a mobile packet core (such as [Azure Operator 5G Core](../operator-5g-core/overview-product.md)), voice session border controller (SBC), radio access network (RAN), or transport switch.
- A platform such as [Azure Operator Nexus](/azure/operator-nexus/overview).

## Data ingestion

There are a range of options for ingesting data from the source into your Azure Operator Insights Data Product.

- Using an Azure Operator Insights ingestion agent – This can consume data from different sources and upload the data to an Azure Operator Insights Data Product. For example, it supports pulling data from an SFTP server, or terminating a TCP stream of enhanced data records (EDRs). For more information, see [Ingestion agent overview](ingestion-agent-overview.md).
- Using other Azure services and tools – Multiple tools can upload data to an Azure Operator Insights Data Product. For example:
  - [AzCopy v10](/azure/storage/common/storage-use-azcopy-v10) – AzCopy from Azure Storage is a robust, high throughput, and reliable ingestion mechanism across both low latency links and high latency links. With `azcopy sync`, you can use cron to automate ingestion from an on-premises virtual machine and achieve "free" ingestion into the Data Product (except for the cost of the on-premises virtual machine and networking).
  - [Azure Data Factory](/azure/data-factory/introduction) - See [Use Azure Data Factory to ingest data into an Azure Operator Insights Data Product](ingestion-with-data-factory.md).
- Using the code samples available in the [Azure Operator Insights sample repository](https://github.com/Azure-Samples/operator-insights-data-ingestion) as a basis for creating your own ingestion agent or script for uploading data to an Azure Operator Insights Data Product. 

## Azure connectivity

There are multiple ways to connect your on-premises private data centers where your network function data sources reside to the Azure cloud. For a general overview of the options, see [Connectivity to Azure - Cloud Adoption Framework](/azure/cloud-adoption-framework/ready/azure-best-practices/connectivity-to-azure). For telco-specific recommendations, see the [Network Analytics Landing Zone for Operators](https://github.com/microsoft/industry/blob/main/telco/solutions/observability/userGuide/readme.md).

## Data consumption

Azure Operator Insights Data Products offer two consumption URLs for accessing the data in the Data Product:

- ADLS consumption URL giving access to Parquet files for batch style consumption or integration with AI / ML tools.
- KQL consumption URL supporting the [Kusto Query Language](/azure/data-explorer/kusto/query) for real-time analytics, reporting, and adhoc queries.

There are multiple possible integrations that can be built on top of one or both of these consumption URLs.

| | Supported with Data Product ADLS consumption URL | Supported with Data Product KQL consumption URL |
|---|---|---|
| [**Azure Data Explorer dashboards**](/azure/data-explorer/azure-data-explorer-dashboards) | ❌ | ✅ |
| [**Azure Data Explorer follower database**](/azure/data-explorer/follower) | ❌ | ✅ |
| [**Power BI reports**](/power-bi/create-reports/) | ✅ | ✅ |
| [**Microsoft Fabric**](/fabric/get-started/microsoft-fabric-overview) | ✅ | ✅ |
| [**Azure Machine Learning Studio**](/azure/machine-learning/overview-what-is-azure-machine-learning) | ✅ | ❌ |
| [**Azure Databricks**](/azure/databricks/introduction/) | ✅ | ✅ |
| [**Azure Logic Apps**](/azure/logic-apps/logic-apps-overview) | ❌ | ✅ |
| [**Azure Storage Explorer**](/azure/storage/storage-explorer/vs-azure-tools-storage-manage-with-storage-explorer) | ✅ | ❌ |
| [**AzCopy**](/azure/storage/common/storage-use-azcopy-v10) | ✅ | ❌ |

## Data Product configuration options and controls

Azure Operator Insights Data Products have several configuration options that can be set when first deploying or modified after deployment.

| | Description | When configurable | More information |
| --- | --- | --- | --- |
| **Integration with Microsoft Purview** | Enabling Purview integration during deployment causes the existence of the Data Product and its data type tables, schemas, and lineage to be published to Purview and visible to your organization in Purview's data catalog. | At deployment | [Use Microsoft Purview with an Azure Operator Insights Data Product](purview-setup.md) |
| **Customer Managed Keys for Data Product storage** | Azure Operator Insights Data Products can secure your data using Microsoft Managed Keys or Customer Managed Keys. | At deployment | [Set up resources for CMK-based data encryption or Microsoft Purview](data-product-create.md#set-up-resources-for-cmk-based-data-encryption-or-microsoft-purview) |
| **Connectivity for ingestion and ADLS consumption URLs** | Azure Operator Insights Data Products can be configured to allow public access from all networks or selected virtual networks and IP addresses. | At deployment. If you deploy with selected virtual networks and IP addresses, you can add or remove networks and IP addresses after deployment. |--|
| **Connectivity for the KQL consumption URL** | Azure Operator Insights Data Products can be configured to allow public access from all networks or selected IP addresses. | At deployment. If you deploy with selected IP addresses, you can add or remove IP addresses after deployment. |--|
| **Data retention and hot cache size** | Azure Operator Insights Data Products are initially deployed with default retention periods and KQL hot cache durations for each data type (group of data within a Data Product). You can set custom thresholds | After deployment | [Data types in Azure Operator Insights](concept-data-types.md) |
| **Access control for ADLS consumption URL** | Access to the ADLS consumption URL is managed on an Azure Operator Insights Data Product by generating a SAS token after deployment. | After deployment |--|
| **Access control for KQL consumption URL** | Access to the KQL consumption URL is granted by adding a principal (which can be an individual user, group, or managed identity) as a Reader or Restricted Reader. | After deployment | [Manage permissions to the KQL consumption URL](consumption-plane-configure-permissions.md) |

## Monitoring

After you deploy a Data Product, you can monitor it for healthy operation or troubleshooting purposes using metrics, resource logs, and activity logs. For more information, see [Monitoring Azure Operator Insights](monitor-operator-insights.md).

## Next step

> [!div class="nextstepaction"]
> [Learn about business continuity and disaster recovery](business-continuity-disaster-recovery.md)