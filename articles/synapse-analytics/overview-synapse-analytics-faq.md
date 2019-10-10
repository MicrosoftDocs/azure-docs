---
title: FAQ #Required; update as needed page title displayed in search results. Include the brand.
description: #Required; Add article description that is displayed in search results.
services: azure-synapse-analytics #Required for articles that deal with a service, we will use sql-data-warehouse for now and bulk update later once we have the  service slug assigned by ACOM.
author: ArnoMicrosoft #Required; update with your GitHub user alias, with correct capitalization.
ms.service: sql-data-warehouse #Required; we will use sql-data-warehouse for now and bulk update later once the service is added to the approved list.
ms.topic: overview #Required
ms.subservice: design #Required will update once these are established.
ms.date: 10/09/2019 #Update with current date; mm/dd/yyyy format.
ms.author: acomet #Required; update with your microsoft alias of author; optional team alias.
ms.reviewer: jrasnick
---

<!---Recommended: Removal all the comments in this template before you sign-off or merge to master.--->

<!---overview articles are for new customers and explain the service from a technical point of view.
They are not intended to define benefits or value prop; that would be in marketing content.
--->

# FAQ 
<!---Required: 
For the H1 - that's the primary heading at the top of the article - use the format "What is <service>?"
You can also use this in the TOC if your service name doesn’t cause the phrase to wrap.
--->

## Ressources
### Q: What is a good use case for Spark in Synapse

A: Our first goal is to provide a great Data Engineering experience for transforming data over the lake in batch or stream. Its tight and simple integration to our data orchestration makes the operationalization of your development work straightforward.

Another use case for Spark is for a Data Scientist to:
- extract a feature
- explore data
- train a model

### Q: What is a good use case for SQL Analytics On-Demand in Synapse

A: SQL On-Demand is a great tool for exploring the data with T-SQL. It is also a great tool for running Business Intelligence at a low cost if data is accessed infrequently.

## Security and Access
### Q: What is the primary way to authenticate and give access to users 

A: End to end single sign-on experience is very important in Azure Synapse Analytics. Therefore, managing and passing through the identity through a full AAD integration is a must. 

### Q: How do I get access to files and folders in the ADLSg2?

A: Access to files and folders is currently managed through ADLSg2. An interface in the Synapse Studio will be soon available. Formore information, visit the page [here](https://docs.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-access-control).

### Q: Can I use third party business intelligence tools to access Azure Synapse Analytics?

A: Yes, you can use your third-party business applications, like Tableau and Power BI, to connect to SQL Analytics pool and SQL Analytics On-Demand. Spark supports IntelliJ.

### Q: Does Azure Synapse Analytics provide APIs?

A: Yes, we provide an SDK to programatically interact to Azure Synapse Analytics. More information is available [here] on which operations are supported by Synapse.

<!---Required:
The introductory paragraph helps customers quickly determine whether an article is relevant.
Describe in customer-friendly terms what the service is and does, and why the customer should care. Keep it short for the intro.
You can go into more detail later in the article. Many services add artwork or videos below the introduction.
--->

<!---Avoid notes, tips, and important boxes. Readers tend to skip over them. Better to put that info directly into the article text.--->

<!---Screenshots and videos can add another way to show and tell the overview story. But don’t overdo them. Make sure that they offer value for the overview.
If users access your product/service via a web browser, the first screenshot should always include the full browser window in Chrome or Safari. This is to show users that the portal is browser-based - OS and browser agnostic.
--->

## <article body>
<!---
After the intro, you can develop your overview by discussing the features that answer the "Why should I care" question with a bit more depth.
Be sure to call out any basic requirements and dependencies, as well as limitations or overhead.
Don't catalog every feature, and some may only need to be mentioned as available, without any discussion.
--->

## <Top task>
<!---Suggested:
An effective way to structure you overview article is to create an H2 for the top customer tasks identified in milestone one of the [APEX content model](contribute-get-started-mvc.md) and describe how the product/service helps customers with that task.
Create a new H2 for each task you list.
--->

## Next steps

<!---Some context for the following links goes here
- [link to next logical step for the customer](quickstart-view-occupancy.md)
--->

<!--- Required:
In Overview articles, provide at least one next step and no more than three.
Next steps in overview articles will often link to a quickstart.
Use regular links; do not use a blue box link. What you link to will depend on what is really a next step for the customer.
Do not use a "More info section" or a "Resources section" or a "See also section".
--->