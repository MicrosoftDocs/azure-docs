---
title: Introduction to Microsoft Purview governance solutions
description: This article is an overview of the solutions that Microsoft Purview provides through the Microsoft Purview governance portal, and describes how they work together to help you manage your on-premises, multicloud, and software-as-a-service data.
author: whhender
ms.author: whhender
ms.service: purview
ms.custom: event-tier1-build-2022
ms.topic: overview
ms.date: 11/04/2022
---

# What's available in the Microsoft Purview governance portal?

Microsoft Purview's solutions in the governance portal provide a unified data governance service that helps you manage your on-premises, multicloud, and software-as-a-service (SaaS) data. The Microsoft Purview governance portal allows you to:
- Create a holistic, up-to-date map of your data landscape with automated data discovery, sensitive data classification, and end-to-end data lineage. 
- Enable data curators and security administrators to manage and keep your data estate secure.
- Empower data consumers to find valuable, trustworthy data.

:::image type="complex" source="./media/overview/high-level-overview.png" alt-text="Graphic showing Microsoft Purview's high-level architecture." lightbox="./media/overview/high-level-overview-large.png":::
   Chart shows the high-level architecture of Microsoft Purview. Multicloud and on-premises sources flow into Microsoft Purview's Data Map. On top of it, Microsoft Purview's apps (Data Catalog, Data Estate Insights, Data Policy, and Data Sharing) allow data consumers, data curators and security administrators to view and manage metadata, share data, and protect assets. This metadata is also ported to external analytics services from Microsoft Purview for more processing.
:::image-end:::

>[!TIP]
> Looking to govern your data in Microsoft 365 by keeping what you need and deleting what you don't? Use [Microsoft Purview Data Lifecycle Management](/microsoft-365/compliance/data-lifecycle-management).

The [Data Map](#data-map): Microsoft Purview automates data discovery by providing data scanning and classification as a service for assets across your data estate. Metadata and descriptions of discovered data assets are integrated into a holistic map of your data estate. Atop this map, there are purpose-built apps that create environments for data discovery, access management, and insights about your data landscape.


|App  |Description  |
|----------|-----------|
|[Data Catalog](#data-catalog)  | Finds trusted data sources by browsing and searching your data assets. The data catalog aligns your assets with friendly business terms and data classification to identify data sources.      |
|[Data Estate Insights](#data-estate-insights) | Gives you an overview of your data estate to help you discover what kinds of data you have and where. |
|[Data Sharing](#data-sharing) | Allows you to securely share data internally or cross organizations with business partners and customers. |
|[Data Policy](#data-policy) | A set of central, cloud-based experiences that help you provision access to data securely and at scale. |

## Data Map

Microsoft Purview Data Map provides the foundation for data discovery and effective data governance. Microsoft Purview Data Map is a cloud native PaaS service that captures metadata about enterprise data present in analytics and operation systems on-premises and cloud. Microsoft Purview Data Map is automatically kept up to date with built-in automated scanning and classification system. Business users can configure and use the Microsoft Purview Data Map through an intuitive UI and developers can programmatically interact with the Data Map using open-source Apache Atlas 2.2 APIs.
Microsoft Purview Data Map powers the Microsoft Purview Data Catalog and Microsoft Purview Data Estate Insights as unified experiences within the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

For more information, see our [introduction to Data Map](concept-elastic-data-map.md).

## Data Catalog

With the Microsoft Purview Data Catalog, business and technical users can quickly and easily find relevant data using a search experience with filters based on  lenses such as glossary terms, classifications, sensitivity labels and more. For subject matter experts, data stewards and officers, the Microsoft Purview Data Catalog provides data curation features such as business glossary management and the ability to automate tagging of data assets with glossary terms. Data consumers and producers can also visually trace the lineage of data assets: for example, starting from operational systems on-premises, through movement, transformation & enrichment with various data storage and processing systems in the cloud, to consumption in an analytics system like Power BI.
For more information, see our [introduction to search using Data Catalog](how-to-search-catalog.md).

## Data Estate Insights
With the Microsoft Purview Data Estate Insights, the chief data officers and other governance stakeholders can get a bird’s eye view of their data estate and can gain actionable insights into the governance gaps that can be resolved from the experience itself.

For more information, see our [introduction to Data Estate Insights](concept-insights.md).

## Data Sharing

Microsoft Purview Data Sharing enables organizations to securely share data both within your organization or cross organizations with business partners and customers. You can share or receive data with just a few clicks. Data providers can centrally manage and monitor data sharing relationships, and revoke sharing at any time. Data consumers can access received data with their own analytics tools and turn data into insights.

For more information, see our [introduction to Data Sharing](concept-data-share.md).

## Data Policy
Microsoft Purview Data Policy is a set of central, cloud-based experiences that help you manage access to data sources and datasets securely and at scale.
Benefits:
* Structure and simplify the process of granting/revoking access
* Reduce the effort of access provisioning
* Access decision in Microsoft data systems has negligible latency penalty
* Enhanced security:
   - Easier to review access/revoke it in a central vs. distributed access provisioning model
   - Reduced need for privileged accounts to configure access
   - Support Principle of Least Privilege (give people the appropriate level of access, limiting to the minimum permissions and the least data objects)

For more information, see our introductory guides:
* [Data owner access policies](concept-policies-data-owner.md)(preview): Provision fine-grained to broad access to users and groups via intuitive authoring experience.
* [Self-service access policies](concept-self-service-data-access-policy.md)(preview): Self-Service: Workflow approval and automatic provisioning of access requests initiated by business analysts that discover data assets in Microsoft Purview’s catalog.
* [DevOps policies](concept-policies-devops.md)(preview): Provision access to system metadata for IT operations and other DevOps personnel, supporting typical functions like SQL Performance Monitor and SQL Security Auditor.

## Traditional challenges that Microsoft Purview seeks to address

### Challenges for data consumers

Traditionally, discovering enterprise data sources has been an organic process based on communal knowledge. For companies that want the most value from their information assets, this approach presents many challenges:

* Because there's no central location to register data sources, users might be unaware of a data source unless they come into contact with it as part of another process.
* Unless users know the location of a data source, they can't connect to the data by using a client application. Data-consumption experiences require users to know the connection string or path.
* The intended use of the data is hidden to users unless they know the location of a data source's documentation. Data sources and documentation might live in several places and be consumed through different kinds of experiences.
* If users have questions about an information asset, they must locate the expert, or team responsible for that data and engage them offline. There's no explicit connection between the data and the experts that understand the data's context.
* Unless users understand the process for requesting access to the data source, discovering the data source and its documentation won't help them access the data.

### Challenges for data producers

Although data consumers face the previously mentioned challenges, users who are responsible for producing and maintaining information assets face challenges of their own:

* Annotating data sources with descriptive metadata is often a lost effort. Client applications typically ignore descriptions that are stored in the data source.
* Creating documentation for data sources can be difficult and it's an ongoing responsibility to keep documentation in sync with data sources. Users might not trust documentation that's perceived as being out of date.
* Creating and maintaining documentation for data sources is complex and time-consuming. Making that documentation readily available to everyone who uses the data source can be even more so.
* Restricting access to data sources and ensuring that data consumers know how to request access is an ongoing challenge.

When such challenges are combined, they present a significant barrier for companies that want to encourage and promote the use and understanding of enterprise data.

### Challenges for security administrators

Users who are responsible for ensuring the security of their organization's data may have any of the challenges listed above as data consumers and producers, and the following extra challenges:

* An organization's data is constantly growing and being stored and shared in new directions. The task of discovering, protecting, and governing your sensitive data is one that never ends. You need to ensure that your organization's content is being shared with the correct people, applications, and with the correct permissions.
* Understanding the risk levels in your organization's data requires diving deep into your content, looking for keywords, RegEx patterns, and sensitive data types. For example, sensitive data types might include Credit Card numbers, Social Security numbers or Bank Account numbers. You must constantly monitor all data sources for sensitive content, as even the smallest amount of data loss can be critical to your organization.
* Ensuring that your organization continues to comply with corporate security policies is a challenging task as your content grows and changes, and as those requirements and policies are updated for changing digital realities. Security administrators need to ensure data security in the quickest time possible.

## Microsoft Purview advantages

Microsoft Purview is designed to address the issues mentioned in the previous sections and to help enterprises get the most value from their existing information assets. The catalog makes data sources easily discoverable and understandable by the users who manage the data.

Microsoft Purview provides a cloud-based service into which you can register data sources. During registration, the data remains in its existing location, but a copy of its metadata is added to Microsoft Purview, along with a reference to the data source location. The metadata is also indexed to make each data source easily discoverable via search and understandable to the users who discover it.

After you register a data source, you can then enrich its metadata. Either the user who registered the data source or another user in the enterprise can add more metadata. Any user can annotate a data source by providing descriptions, tags, or other metadata for requesting data source access. This descriptive metadata supplements the structural metadata, such as column names and data types that are registered from the data source.

Discovering and understanding data sources and their use is the primary purpose of registering the sources. Enterprise users might need data for business intelligence, application development, data science, or any other task where the correct data is required. They can use the data catalog discovery experience to quickly find data that matches their needs, understand the data to evaluate its fitness for purpose, and consume the data by opening the data source in their tool of choice.

At the same time, users can contribute to the catalog by tagging, documenting, and annotating data sources that have already been registered. They can also register new data sources, which are then discovered, understood, and consumed by the community of catalog users.

Lastly, Microsoft Purview Data Policy app leverages the metadata in the Data Map, providing a superior solution to keep your data secure.

## Next steps

>[!TIP]
> Check if Microsoft Purview is available in your region on the [regional availability page](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).

To get started with Microsoft Purview, see [Create a Microsoft Purview account](create-catalog-portal.md).
