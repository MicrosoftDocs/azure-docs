---
title: Enable database protection for your subscription
description: Learn how to enable Microsoft Defender for Cloud for all of your database types for your entire subscription.
author: bmansheim
ms.author: benmansheim
ms.topic: how-to
ms.date: 11/27/2022
---

# Enable Microsoft Defender for Cloud database plans

This article explains how to enable Microsoft Defender for Cloud's database protections for the most common database types, within Azure, hybrid, and multicloud environments.

Defender for Cloud database protections let you protect your entire database estate with attack detection and threat response for the most popular database types in Azure. Defender for Cloud provides protection for the database engines and for data types, according to their attack surface and security risks.

Database protection includes:

- [Microsoft Defender for Azure SQL databases](defender-for-sql-introduction.md)
- [Microsoft Defender for SQL servers on machines](defender-for-sql-usage.md)
- [Microsoft Defender for open-source relational databases](defender-for-databases-introduction.md)
- [Microsoft Defender for Azure Cosmos DB](concept-defender-for-cosmos.md)

When you turn on database protection, you enable all of these Defender plans and protect all of the supported databases in your subscription. If you only want to protect specific types of databases, you can also turn on the database plans individually and exclude specific database resource types.

Defender for Cloud’s database protection detects unusual and potentially harmful attempts to access or exploit your databases. Advanced threat detection capabilities and [Microsoft Threat Intelligence](https://www.microsoft.com/insidetrack/microsoft-uses-threat-intelligence-to-protect-detect-and-respond-to-threats) data are used to provide contextual security alerts. The alerts include steps to mitigate the detected threats and prevent future attacks. 

## Prerequisites

You must have:

- An Azure account. If you don't already have an Azure account, you can [create your Azure free account today](https://azure.microsoft.com/free/).
- To protect SQL databases in hybrid and multicloud environments, you have to connect your AWS account or GCP project to Defender for Cloud. Defender for Cloud uses Azure Arc to communicate with your hybrid and multicloud machines. Check out the following articles for more information:

  - [Connect your AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md)
  - [Connect your GCP project to Microsoft Defender for Cloud](quickstart-onboard-gcp.md)
  - [Connect your on-premises and other cloud machines to Microsoft Defender for Cloud](quickstart-onboard-machines.md)

## Enable database protection on your subscription

**To enable Defender for Databases on a specific subscription**:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.
1. Select the relevant subscription.
1. Either:

    - **Protect all database types** - Select **On** in the Databases section to protect all database types.
    - **Protect specific database types**:
        
        1. Select **Select types** to see the list of Defender plans for databases.

            :::image type="content" source="media/quickstart-enable-database-protections/select-type.png" alt-text="Screenshot showing the toggles to enable specific resource types.":::

        1. Select **On** for each database type that you want to protect.
    
            :::image type="content" source="media/quickstart-enable-database-protections/resource-type.png" alt-text="Screenshot showing the types of resources available.":::

        1. Select **Continue**.

1. Select **Save**.

## Next steps

In this article, you learned how to enable Microsoft Defender for Cloud for all database types on your subscription. Next, read more about each of the resource types:

- [Microsoft Defender for Azure SQL databases](defender-for-sql-introduction.md)
- [Microsoft Defender for open-source relational databases](defender-for-databases-introduction.md)
- [Microsoft Defender for Azure Cosmos DB](concept-defender-for-cosmos.md)
- [Microsoft Defender for SQL servers on machines](defender-for-sql-usage.md)
