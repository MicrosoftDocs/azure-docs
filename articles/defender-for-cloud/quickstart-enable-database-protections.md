---
title: Enable database protection for your subscription
description: Learn how to enable Microsoft Defender for Cloud for all of your database types for your entire subscription. 
titleSuffix: Microsoft Defender for Azure Cosmos DB
ms.topic: quickstart
ms.date: 02/28/2022
---

# Quickstart: Microsoft Defender for Cloud database protection

This article explains how to enable Microsoft Defender for Cloud's database (DB) protection for all database types that exist on your subscription.

Workload protections are provided through the Microsoft Defender plans that are specific to the types of resources in your subscriptions.

Microsoft Defender for Cloud database security, allows you to protect your entire database estate, by detecting common attacks, supporting enablement, and threat response for the most popular database types in Azure.

The types of protected databases are: 

- Azure SQL Databases 
- SQL servers on machines 
- Open-source relational databases (OSS RDB) 
- Microsoft Defender for Azure Cosmos DB

Database provides protection to engines, and data types, with different attack surface, and security risks. Security detections are made for the specific attack surface of each DB type.  

Defender for Cloud’s database protection detects unusual and potentially harmful attempts to access, or exploit your databases. Advanced threat detection capabilities and [Microsoft Threat Intelligence](https://www.microsoft.com/insidetrack/microsoft-uses-threat-intelligence-to-protect-detect-and-respond-to-threats) data are used to provide contextual security alerts. Those alerts include steps to mitigate the detected threats, and prevent future attacks. 

You can enable database protection on your subscription, or exclude specific database resource types. 

## Prerequisites

- You must have Subscription Owner access
- An Azure account. If you don't already have an Azure account, you can [create your Azure free account today](https://azure.microsoft.com/free/).

## Enable database protection on your subscription

**To enable Defender for Storage for individual storage accounts under a specific subscription**:

1. Sign in to the [Azure portal](https://ms.portal.azure.com).

1. Navigate to **Microsoft Defender fo Cloud** > **Environment settings**.

1. Select the relevant subscription.

1. If you want to enable specific plans, set the plans toggle to **On**.

1. (Optional) Select **Select types** to and enable specific resource types.

    :::image type="content" source="media/quickstart-enable-database-protections/select-type.png" alt-text="Screenshot showing the toggles to enable specific resource types.":::

    1. Toggle each desired resource type to **On**.
    
    :::image type="content" source="media/quickstart-enable-database-protections/resource-type.png" alt-text="Screenshot showing the types of resources available.":::

    1. Select **Continue**.

## Next steps

In this article, you learned how to enable Microsoft Defender for Cloud for all database types on your subscription. Next, read more about each of the resource types.

- [Microsoft Defender for Azure SQL databases](defender-for-sql-introduction.md)
- [Microsoft Defender for open-source relational databases](defender-for-databases-introduction.md)
- [Microsoft Defender for Azure Cosmos DB (Preview)](concept-defender-for-cosmos.md)
- [Microsoft Defender for SQL servers on machines](defender-for-sql-usage.md)
