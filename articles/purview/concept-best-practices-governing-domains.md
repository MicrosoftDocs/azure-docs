---
title: Govern your domains with Microsoft Purview. Best practices for using collections, glossary, and business context in your data catalog
description: Understanding your domains is critical for effective data governance. In this article, we'll explore how to analyze a business area, define responsibilities, and implement a domain-driven governance approach in Purview.
author: evangelinew
ms.author: evwhite
ms.service: purview
ms.topic: conceptual
ms.date: 04/24/2023
ms.custom: template-concept
---

# Govern your domains with Microsoft Purview: best practices for using collections, glossary, and business context

Understanding your domains is critical for effective data governance. In this article, we explore how to analyze a business area, define responsibilities, and implement a domain-driven governance approach in Purview. By understanding your domains, you can identify which data is critical to your business and which data requires special governance, quality, or compliance considerations. 

We also review how to apply several Purview features to data governance. We show how to:

- Use collections for creating a domain structure, segregating governance roles and responsibilities, and managing access to metadata.
- Use the glossary to define key terms and data elements, and cover when it might be helpful to separate glossaries for different business areas.
- Use business assets to model the real-world concepts and objectives within a domain.

Let's dive into the world of domains and discover how Purview can help improve your data governance practices.

>[!NOTE]
>The goal of this article is to help you understand Purview’s capabilities, so we’ve described a simple domain where boundaries are clear, and knowledge, applications, processes, data, and people are well-aligned. This often isn't the case, especially if you have large, legacy data platforms. For example, a complex CRM system is often shared between multiple business departments. For deeper guidance on deconstructing your domains and what to do when boundaries overlap, see the [Domain modeling recommendations from the Microsoft Cloud Adoption Framework.](/azure/cloud-adoption-framework/scenarios/cloud-scale-analytics/architectures/data-domains#domain-modeling-recommendations)

## Understand your domains
Domains are problem spaces you want to address. They're areas where knowledge, behavior, laws, and activities come together. People within a domain collaborate on shared business objectives, so a shared vocabulary of terms and concepts ensures teams can communicate and work efficiently. 

For example, a ‘marketing domain’ includes:
- Marketing data.
- Knowledge from subject matter experts regarding how that data is collected and used to support marketing objectives such as ad personalization or campaign segmentation.
- Definitions of key terms and data elements, such as a prospect versus an active customer.
- The people responsible for ensuring marketing data are fit for purpose and used responsibly (privacy and compliance experts as well as stewards). 
- Sources of truth for marketing metrics. For instance, which Power BI report holds the official. count of active customers that is shared with your Chief Marketing Officer during a monthly business review?

Scanning and categorizing data is just the beginning of data governance. Governing a domain of data means describing the data, its meaning, its use in real-world business activities, and how it flows through your technology systems. This helps you identify which data is most critical to your business and which data requires special governance, quality, or compliance considerations.

In the next sections, we'll walk through how to:
- Analyze a business domain.
- Define responsibilities for the domain.
- Implement a domain-driven governance approach in Purview.

## Analyze a domain
When you establish an approach to data governance, a domain model can help create a shared understanding of the domain between technical and business experts. A domain model is a description of the real-world concepts and activities inside the business domain you want to govern. You’ll start by sketching an abstract view of your problem space, then refine it as you work toward the solution you implement in Purview. Don’t be afraid of change. You’ll learn and improve your approach as you tackle new domains. 

Begin by describing business activities and their connections. This should be a collaborative effort that involves data and business stakeholders. This doesn’t have to be formal—use a whiteboard to create a picture that makes sense to everyone.

As you work together, identify which systems are used to support each business capability. Note key data as well—even if you don’t know exactly how this data is sourced or stored yet. This will help you identify important business terms as well as the areas of responsibility for data governance. If you get stuck, remember that governance should be designed around business objectives and capabilities, so don’t be afraid to use a business org chart as a starting point. Just be ready to adjust as your understanding of your domains matures.

### Example: How Contoso uses order data to determine active accounts in different business contexts

In a recent monthly business review with Contoso’s chief financial officer, the supply chain and finance teams presented reports showing different rates of growth in active accounts over the previous 30 days. When Contoso’s CFO asked why the numbers were different, reporting leads from each team began to debate the meaning of an active account and quickly realized they were using different definitions and sources of truth for their reports. The supply chain team counts any account with an order in the past 30 days as active, while the finance organization looks back further, counting every customer with an order in the past 6 months as active. 

Both teams agree they’d like to get better at governing the data used for critical reports and that they need to disambiguate how their data and reports are used in different contexts. Their approach to governing the data within this problem area will become the blueprint for expanding and adopting a governance strategy in other business domains. 

To begin their work, they sketch a rough view of how order management works at Contoso. 

:::image type="content" source="media/concept-best-practices-domains/01-domain-sketch.png" alt-text="A sketch of a high-level conceptual domain model for order management with boundaries around supply chain responsibilities and uses of data vs. finance department responsibilities and uses of data.":::

Their sketch includes:

- Business objectives: The business activities in this problem area include: order placement, order fulfillment, order shipping, customer invoicing, payments, ledger management. 
- Business terms: Both invoicing and shipping activities use account data, so it will be important to have a definition of the term account, and any critical data elements included in an account. Order data is also critical for this business area.
- Data: Lots of physical data supports order management, but for now, the team focuses on finding the physical data that represents accounts and orders, because this is most critical for the domain.
- Responsibilities: They notice two broad but closely related areas of responsibilities in this diagram. These are two unique domains.
  - The supply chain department manages order placement, order fulfillment, and shipments.
  - The finance department manages invoicing, payments, and ledger management. The finance team is also primarily responsible for managing account data, but supply chain consumes this information, so they are important stakeholders of the data.
- Systems: Finally, there are three key systems that support this domain: the billing system, the order management system, and a data warehouse that makes supply chain and finance data available for reporting.

## Purview implementation
In the next section, we’ll walk through an implementation in Purview. We will:

1. Use collections to establish a domain structure, segregate governance roles and responsibilities, and manage access to metadata.
1. Use the glossary to define key terms and data elements, as well as when it might be helpful to separate glossaries for different business areas. 
1. Use business assets to model the real-world concepts and activities within these domains.
1. Scan metadata into our collections so it can be managed by the right people.
1. Contextualize your data by linking business and technical information in Purview.

### Step 1: Establish a domain structure and assign responsibilities using collections: 
In the previous diagram, the team identified 2 areas of responsibilities: Supply chain and finance, so we’ll create separate collections for the supply chain and finance department:

:::image type="content" source="media/concept-best-practices-domains/02-collection-structure.png" alt-text="Screenshot of Purview sources page shows a root collection called Contoso with 3 sub-collections named Finance domain, Supply chain domain, and Attic for separating assets.":::

Next, we’ll grant our finance curators data curator access to the finance collection. This will ensure they can annotate and manage metadata for finance assets. Our supply chain analysts are consumers of finance data and information, so we’ll add them as data readers. They won’t be able to curate finance assets, but they’ll be able to discover them in Purview, and suggest edits via workflows. We’ll keep permissions manageable by assigning groups to these roles instead of individual users.

:::image type="content" source="media/concept-best-practices-domains/03-collection-permissions.png" alt-text="Screenshot from Purview Collections page shows the role assignments for the Finance collection. A group called Finance curators is assigned to the data curators role and a group called supply chain analysts is assigned to the data readers role.":::

### Step 2. Define key terms in the business glossary

Now we can define key terms for these domains. It’s important for everyone at Contoso to have a shared understanding of core terms like order and account. If we were working with specialized finance or supply chain terms, we could create individual glossaries for these domains, but for now we’ll centralize terms in an enterprise glossary. 

:::image type="content" source="media/concept-best-practices-domains/04-key-terms.png" alt-text="Screenshot from Purview glossary page showing two terms, 'account' and 'order' in the 'Contoso Enterprise Glossary'.":::

Let’s make sure to assign stewards and experts for these terms as well. Experts are people who understand the full context of an asset or glossary term and can help answer questions, provide context, and disambiguate differences between terms when used in different contexts. Stewards are responsible for governance¬—ensuring a term is reviewed, standardized, and approved for use.

:::image type="content" source="media/concept-best-practices-domains/05-glossary-contacts.png" alt-text="Screenshot from Purview glossary contacts page showing an Expert named Vishal and a Steward named Sunetra.":::

### Step 3: Use assets and asset types to model your domain

When we sketched our domain model, we captured the activities and technology systems that operate in the supply chain and finance domains as well. Let’s take a second look at our sketch and add more context by defining the activities and systems in our domain as well as the relationships between them. 

:::image type="content" source="media/concept-best-practices-domains/06-domain-model.png" alt-text="Diagram shows a sketch of a conceptual domain model for order management with boundaries around supply chain responsibilities and uses of data vs. finance department responsibilities and uses of data. Order fulfillment, order placement, shipping, ledger management, invoicing, and payments are highlighted in blue, designating them as business processes. General ledger system and billing system are highlighted in purple, designating them as systems.":::

We’ll add this context to Purview in two steps:
1. First, we’ll define asset types and their relations.
1. Then we’ll create the individual assets and relationships between them.

### Step 3.1: Define asset types and their relations

In this step, we create a blueprint for the context we want to show in Purview. Purview provides asset types for business processes and systems by default, so we don’t need to add these asset types, but it looks like we need two new relationship definitions. Let’s add these now.

- Business process uses dataset.
- System supports business process.

:::image type="content" source="media/concept-best-practices-domains/07-asset-model.png" alt-text="Screenshot of Purview asset types screen showing the 'new relationship' panel. The relationship head is business process, the tail is dataset, the relationship label is set to 'uses', the relationship category is association, and the cardinality is 'many to many.'":::

Adding these relationship definitions means we’ll now be able to link datasets to business process assets in Purview. This will help us contextualize data for both business and technology stakeholders.

### Step 3.2: Add business assets

Now let’s add the business processes (ledger management, order placement, etc.) and two systems (Contoso billing, General ledger) from our diagram. 

:::image type="content" source="media/concept-best-practices-domains/08-business-assets.png" alt-text="Screenshot from Purview business assets page shows a list of business assets including 6 business process assets for 'ledger management', 'order placement', and others along with 2 systems assets called 'Contoso billing' and 'General ledger.":::

We’ll create data domain assets for 'account' and 'order' as well because these are not only important terms but key entity concepts in these business areas. This will help us show business context for key data entities.

:::image type="content" source="media/concept-best-practices-domains/09-account-data-entity.png" alt-text="Screenshot from Purview asset detail page for the Account data domain asset.":::

### Step 4: Scan data from your domains

Finally, we’re ready to register and scan the Azure SQL instance that supports both our Finance and Supply Chain domains. 

Analytical data sources often centralize data that’s shared by multiple departments. For example, a single Azure SQL Server may have a database that supports Supply Chain, and another database that supports the Finance team. To make sure we can sort these assets from this same source into different collections, we’ll register the source at the root collection and create two scoped scans—one for the finance collection and one for the supply chain collection. 

:::image type="content" source="media/concept-best-practices-domains/10-source-registration.png" alt-text="Screenshot from Purview sources page showing that an Azure SQL database has been registered to the root collection.":::

Then we’ll set up scoped scans to divide the data between areas of responsibility. When you set up a [scoped scan](concept-scans-and-ingestion.md#scope-your-scan), you can choose specific folders or tables that apply to each area of responsibility so you can scan the right data into a collection.

:::image type="content" source="media/concept-best-practices-domains/11-scope-scan.png" alt-text="Screenshot of Purview scan settings showing that data will be scanned into the Finance domain collection next to a screenshot showing the Purview 'scope your scan' panel with individual tables selected for scanning under the main database.":::

### Step 5: Contextualize your data

Now that we’ve creating our building blocks, we’re ready to link the information together in Purview. 

We’ll go to our logical data domain for account, assign the business term account, link account to the physical table called customer account, link its source system, Contoso billing, and establish relationships the 5 business processes that use account information.

:::image type="content" source="media/concept-best-practices-domains/12-edit-relationships.png" alt-text="Screenshot of Purview asset detail page for account data domain with the 'related' tab open, which shows relationships available for editing.":::

The result helps us visualize how physical data is related to its business use and context.

:::image type="content" source="media/concept-best-practices-domains/13-business-context.png" alt-text="Screenshot of related tab after edits have been completed. The account data domain is connected to a business term called 'account', an Azure SQL table called 'customer account', and 5 business processes: 'order fulfillment', 'order shipping', 'invoicing', 'payments management', and 'order placement.'":::

Now, when people search the catalog for account data, they not only find the data but find its business context including how it’s originated, which source system provides the data, its business meaning, as well as how it's used to drive value in critical business domains.

## Next steps

For data mesh-specific guidance on domains, domain-driven design, and data products, see Microsoft's Cloud Adoption Framework:
- [What is data mesh?](/azure/cloud-adoption-framework/scenarios/cloud-scale-analytics/architectures/what-is-data-mesh)
- [Domain-Driven Design](/azure/cloud-adoption-framework/scenarios/cloud-scale-analytics/architectures/data-domains#domain-driven-design)
- [Data products](/azure/cloud-adoption-framework/scenarios/cloud-scale-analytics/architectures/what-is-data-product)

