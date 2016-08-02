<properties 
   pageTitle="Pricing tier recommendations for Azure SQL Database" 
   description="When changing pricing tiers in the Azure portal, pricing tier recommendations are provided that recommend the tier that is best suited for running an existing Azure SQL Database’s workload. Pricing tiers describe the service tier and performance level of a SQL database." 
   services="sql-database" 
   documentationCenter="" 
   authors="stevestein" 
   manager="jhubbard" 
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management" 
   ms.date="05/09/2016"
   ms.author="sstein"/>

# SQL Database pricing tier recommendations

 Pricing tier recommendations are provided that recommend the service tier and performance level that is best suited for running an existing Azure SQL database’s workload.

> [AZURE.NOTE] Pricing tier recommendations are only available for Web and Business databases and elastic database pools -- and only available in the [Azure portal](https://portal.azure.com/).


Get pricing tier recommendations during the following tasks:

- [Change the service tier and performance level (pricing tier) of a SQL database](sql-database-scale-up.md)
- [Upgrade Azure SQL server to V12](sql-database-upgrade-server-portal.md)
- Browse to your V12 server. See [SQL Database pricing tier recommendations](sql-database-service-tier-advisor.md).
- [Create an elastic database pool](sql-database-elastic-pool.md#elastic-database-pool-pricing-tier-recommendations)





## Overview

The SQL Database service analyzes current performance and feature requirements by assessing historical resource usage for a SQL database. In addition, the minimum acceptable service tier is determined based on the size of the database, and enabled [business continuity](sql-database-business-continuity.md) features. 

This information is analyzed and the service tier and performance level that is best suited for running the database’s typical workload and maintaining it's current feature set is recommended.

- The service examines the previous 15 to 30 days of historical data (resource usage, database size, and database activity) and performs a comparison between the amount of resources consumed and the actual limitations of the currently available service tiers and performance levels.
- Data is analyzed in 15 second intervals and each interval's resultset is categorized into the existing service tier and performance level that is best suited for handling that resultset's workload.
- These 15 second samples are then aggregated into the larger 15-30 day analysis and the service tier and performance level that can optimally handle 95% of the historical workload is recommended.

### Recommendations

Based on your database's usage, there are currently 2 categories of recommendations that can be encountered:


| Recommendation | Description |
| :--- | :--- |
| Upgrade | Upgrade to a new tier. |
| Unavailable | A database requires a minimum workload or approximately 35 days of activity. There is not enough data to provide a valid recommendation. |

## Getting pricing tier recommendations

Get pricing tier recommendations by selecting an existing Web or Business database, click **All settings**, then click **Pricing tier (scale DTUs)**. (Pricing tier recommendations are also available when you [Upgrade Azure SQL server to V12](sql-database-upgrade-server-portal.md).)

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Click **BROWSE** > **SQL databases**.
4. In the **SQL databases** blade, click the database that you want to see a recommendation for:

    ![Select database][1]

5. On the database blade, select **All settings** then select **Pricing tier (scale DTUs)**.


7. The **Recommended pricing tiers** open where you can click the suggested tier and then click the **Select** button to change to that tier.

    ![Sign up for the preview][4]

8. Optionally, click **View usage details** to open the **Pricing Tier Recommendation Details** blade where you can view the recommended tier for the database, a feature comparison between current and recommended tiers, and a graph of the  historical resource usage analysis.

    ![Sign up for the preview][5]



## Summary

Pricing tier recommendations provide an automated experience for gathering telemetry data for each SQL database and recommending the best service tier/performance level combination based on a database's actual performance needs and feature requirements. On the Settings blade click **Pricing tier (scale DTUs)** to see pricing tier recommendations for any Web and Business databases.



## Next steps

Depending on the details of your specific database, performing an upgrade or downgrade usually does not happen instantaneously. The portal will provide notifications as the database transitions to it's new tier, or you can monitor the upgrade status by querying the [sys.dm_operation_status (Azure SQL Database)](https://msdn.microsoft.com/library/dn270022.aspx) view in the SQL Database Server's master database.


<!--Image references-->
[1]: ./media/sql-database-service-tier-advisor/select-database.png
[4]: ./media/sql-database-service-tier-advisor/choose-pricing-tier.png
[5]: ./media/sql-database-service-tier-advisor/usage-details.png


 
