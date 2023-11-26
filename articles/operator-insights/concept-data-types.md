---
title: Data types - Azure Operator Insights
description: This article provides an overview of the data types used by Azure Operator Insights Data Products
author: bettylew
ms.author: bettylew
ms.service: operator-insights
ms.topic: concept-article
ms.date: 10/25/2023

#CustomerIntent: As a Data Product user, I want to understand the concept of Data Types so that I can use Data Product(s) effectively.
---

# Data types overview

A Data Product ingests data from one or more sources, digests and enriches this data, and presents this data to provide domain-specific insights and to support further data analysis.

A data type is used to refer to an individual data source.  The data types can be from outside the Data Product, such as from a network element. The data types can also be created within the Data Product itself by aggregating or enriching the data from other data types.

Data Product operators can choose which data types to use and the data retention period for each data type.

## Data type contents

Each data type contains data from a specific source. The primary source for a data type might be a network element within the subject domain. Some data types are derived by aggregating or enriching the data from other data types.

- The **Quality of Experience – Affirmed MCC** Data Product includes the *edr* data type that handles Event Data Records from the MCC.  
- The same Data Product includes a derived *edr-sanitized* data type. This data type contains the same information as  *edr* but with personal data suppressed to support operators' compliance with privacy legislation.
- The **Monitoring – Affirmed MCC** Data Product includes the *pmstats* data type that contains performance management statistics from the MCC EMS.

## Data type settings

Data types are presented as child resources of the Data Product within the Azure portal as shown in the Data Types page. Relevant settings can be controlled independently for each individual data type.

:::image type="content" source="media/concept-data-types/data-types.png" alt-text="Screenshot of Data Types portal page.":::

- Data Product operators can turn off individual data types to avoid incurring processing and storage costs associated with a data type that isn't valuable for their specific use cases.
- Data Product operators can configure different data retention periods for each data type as shown in the Data Retention page. For example, data types containing personal data are typically configured with a shorter retention period to comply with privacy legislation.

  :::image type="content" source="media/concept-data-types/data-types-data-retention.png" alt-text="Screenshot of Data Types Data Retention portal page.":::
