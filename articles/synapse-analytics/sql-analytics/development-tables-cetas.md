---
title: Using CETAS in SQL Analytics #Required; update as needed page title displayed in search results. Include the brand.
description: #Required; Add article description that is displayed in search results.
services: sql-data-warehouse #Required for articles that deal with a service, we will use sql-data-warehouse for now and bulk update later once we have the  service slug assigned by ACOM.
author: filippopovic #Required; update with your GitHub user alias, with correct capitalization.
ms.service: sql-data-warehouse #Required; we will use sql-data-warehouse for now and bulk update later once the service is added to the approved list.
ms.topic: overview #Required
ms.subservice: design #Required will update once these are established.
ms.date: 10/21/2019 #Update with current date; mm/dd/yyyy format.
ms.author: fipopovi #Required; update with your microsoft alias of author; optional team alias.
ms.reviewer: jrasnick
---

# Using CETAS in SQL Analytics
CETAS (CREATE EXTERNAL TABLE AS SELECT) Creates an external table and then exports, in parallel, the results of a Transact-SQL SELECT statement to Hadoop, Azure Storage Blob or Azure Date Lake Store.



## CETAS in SQL Analytics pool





## CETAS in SQL Analytics on-demand

Use an external table to:

- Query data in Azure blob storage or Azure Data Lake Store with Transact-SQL statements
- Store results of SQL Analytics on-demand query to files in Azure Blob Storage or Azure Data Lake Store.

You can create external table with following steps:

1. CREATE EXTERNAL DATA SOURCE
2. CREATE EXTERNAL FILE FORMAT
3. CREATE EXTERNAL TABLE

<!---Required: 
For the H1 - that's the primary heading at the top of the article - use the format "What is <service>?"
You can also use this in the TOC if your service name doesn’t cause the phrase to wrap.
--->

Introductory paragraph.
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

<!---Some context for the following links goes here--->
<!--- [link to next logical step for the customer](quickstart-view-occupancy.md)--->

<!--- Required:
In Overview articles, provide at least one next step and no more than three.
Next steps in overview articles will often link to a quickstart.
Use regular links; do not use a blue box link. What you link to will depend on what is really a next step for the customer.
Do not use a "More info section" or a "Resources section" or a "See also section".

--->