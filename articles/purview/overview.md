---
title: Introduction to Azure Purview
description: This article provides an overview of Azure Purview, including its features and the problems it addresses. Azure Purview enables any user to register, discover, understand, and consume data sources.
author: hophanms
ms.author: hophan
ms.service: purview
ms.topic: overview
ms.date: 12/06/2021
---

# What is Azure Purview?

Azure Purview is a unified data governance service that helps you manage and govern your on-premises, multi-cloud, and software-as-a-service (SaaS) data. Create a holistic, up-to-date map of your data landscape with automated data discovery, sensitive data classification, and end-to-end data lineage. Enable data curators to manage and secure your data estate. Empower data consumers to find valuable, trustworthy data.

:::image type="content" source="./media/overview/high-level-overview.png" alt-text="High-level architecture of Azure Purview, showing multi-cloud and on premises sources flowing into Azure Purview, and Azure Purview's apps (Data Catalog, Map, and Insights) allowing data consumers and data curators to view and manage metadata. This metadata is also being ported to external analytics services from Azure Purview for more processing." lightbox="./media/overview/high-level-overview-large.png":::

Azure Purview automates data discovery by providing data scanning and classification as a service for assets across your data estate. Metadata and descriptions of discovered data assets are integrated into a holistic map of your data estate. Atop this map, there are purpose-built apps that create environments for data discovery, access management, and insights about your data landscape.

|App  |Description  |
|----------|-----------|
|[Data Map](#data-map) | Makes your data meaningful by graphing your data assets, and their relationships, across your data estate. The data map used to discover data and manage access to that data. |
|[Data Catalog](#data-catalog)  | Find trusted data sources by browsing and searching your data assets. The data catalog aligns your assets with friendly business terms and data classification to identify data sources.      |
|[Data Insights](#data-insights) | Gives you an overview of your data estate to help you discover what kinds of data you have and where. |

## Data Map

Azure Purview Data Map provides the foundation for data discovery and effective data governance. Azure Purview Data Map is a cloud native PaaS service that captures metadata about enterprise data present in analytics and operation systems on-premises and cloud. Azure Purview Data Map is automatically kept up to date with built-in automated scanning and classification system. Business users can configure and use the Azure Purview Data Map through an intuitive UI and developers can programmatically interact with the Data Map using open-source Apache Atlas 2.0 APIs.
Azure Purview Data Map powers the Azure Purview Data Catalog and Azure Purview data insights as unified experiences within the [Azure Purview Studio](https://web.purview.azure.com/resource/).
For more information, see our [introduction to Data Map](concept-elastic-data-map.md).

## Data Catalog

With the Azure Purview Data Catalog, business and technical users alike can quickly & easily find relevant data using a search experience with filters based on various lenses like glossary terms, classifications, sensitivity labels and more. For subject matter experts, data stewards and officers, the Azure Purview Data Catalog provides data curation features like business glossary management and ability to automate tagging of data assets with glossary terms. Data consumers and producers can also visually trace the lineage of data assets starting from the operational systems on-premises, through movement, transformation & enrichment with various data storage & processing systems in the cloud to consumption in an analytics system like Power BI.
For more information, see our [introduction to search using Data Catalog](concept-search.md).

## Data Insights
With the Azure Purview data insights, data officers and security officers can get a bird’s eye view and at a glance understand what data is actively scanned, where sensitive data is and how it moves.

For more information, see our [introduction to Data Insights](concept-insights.md).

## Discovery challenges for data consumers

Traditionally, discovering enterprise data sources has been an organic process based on communal knowledge. For companies that want the most value from their information assets, this approach presents many challenges:

* Because there's no central location to register data sources, users might be unaware of a data source unless they come into contact with it as part of another process.
* Unless users know the location of a data source, they can't connect to the data by using a client application. Data-consumption experiences require users to know the connection string or path.
* The intended use of the data is hidden to users unless they know the location of a data source's documentation. Data sources and documentation might live in several places and be consumed through different kinds of experiences.
* If users have questions about an information asset, they must locate the expert or team that's responsible for the data and engage them offline. There's no explicit connection between data and the experts that have perspectives on its use.
* Unless users understand the process for requesting access to the data source, discovering the data source and its documentation won't help them access the data.

## Discovery challenges for data producers

Although data consumers face the previously mentioned challenges, users who are responsible for producing and maintaining information assets face challenges of their own:

* Annotating data sources with descriptive metadata is often a lost effort. Client applications typically ignore descriptions that are stored in the data source.
* Creating documentation for data sources can be difficult and it's an ongoing responsibility to keep documentation in sync with data sources. Users might not trust documentation that's perceived as being out of date.
* Creating and maintaining documentation for data sources is complex and time-consuming. Making that documentation readily available to everyone who uses the data source can be even more so.
* Restricting access to data sources and ensuring that data consumers know how to request access is an ongoing challenge.

When such challenges are combined, they present a significant barrier for companies that want to encourage and promote the use and understanding of enterprise data.

## Discovery challenges for security administrators

Users who are responsible for ensuring the security of their organization's data may have any of the challenges listed above as data consumers and producers, and the following extra challenges:

* An organization's data is constantly growing, stored, and shared in new directions. The task of discovering, protecting, and governing your sensitive data is one that never ends. You want to make sure that your organization's content is being shared with the correct people, applications, and with the correct permissions.
* Understanding the risk levels in your organization's data requires diving deep into your content, looking for keywords, RegEx patterns, and sensitive data types. Sensitive data types can include Credit Card numbers, Social Security numbers, or Bank Account numbers, to name a few. You constantly monitor all data sources for sensitive content, as even the smallest amount of data loss can be critical to your organization.
* Ensuring that your organization continues to comply with corporate security policies is a challenging task as your content grows and changes, and as those requirements and policies are updated for changing digital realities. Security administrators are often tasked with ensuring data security in the quickest time possible.

## Azure Purview advantages

Azure Purview is designed to address the issues mentioned in the previous sections and to help enterprises get the most value from their existing information assets. The catalog makes data sources easily discoverable and understandable by the users who manage the data.

Azure Purview provides a cloud-based service into which you can register data sources. During registration, the data remains in its existing location, but a copy of its metadata is added to Azure Purview, along with a reference to the data source location. The metadata is also indexed to make each data source easily discoverable via search and understandable to the users who discover it.

After you register a data source, you can then enrich its metadata. Either the user who registered the data source or another user in the enterprise adds the metadata. Any user can annotate a data source by providing descriptions, tags, or other metadata for requesting data source access. This descriptive metadata supplements the structural metadata, such as column names and data types, that's registered from the data source.

Discovering and understanding data sources and their use is the primary purpose of registering the sources. Enterprise users might need data for business intelligence, application development, data science, or any other task where the right data is required. They use the data catalog discovery experience to quickly find data that matches their needs, understand the data to evaluate its fitness for the purpose, and consume the data by opening the data source in their tool of choice.

At the same time, users can contribute to the catalog by tagging, documenting, and annotating data sources that have already been registered. They can also register new data sources, which are then discovered, understood, and consumed by the community of catalog users.

## In-region data residency
For Azure Purview, certain table names, file paths, and object path information are stored in the United States. Subject to aforementioned exception, the capability to enable storing all other customer data in a single region is currently available in all Geos.

## Next steps

To get started with Azure Purview, see [Create an Azure Purview account](create-catalog-portal.md).
