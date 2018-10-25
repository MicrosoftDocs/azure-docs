---
title: "Run analytics queries against Azure SQL databases | Microsoft Docs"
description: "Cross-tenant analytics queries using data extracted from multiple Azure SQL Database databases in a multi-tenant app."
services: sql-database
ms.service: sql-database
ms.subservice: scenario
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: anjangsh,billgib,genemi
manager: craigg
ms.date: 09/19/2018
---
# Cross-tenant analytics using extracted data - multi-tenant app
 
In this tutorial, you walk through a complete analytics scenario for a multitenant implementation. The scenario demonstrates how analytics can enable businesses to make smart decisions. Using data extracted from sharded database, you use analytics to gain insights into tenant behavior, including their use of the sample Wingtip Tickets SaaS application. This scenario involves three steps: 

1.	**Extract data** from each tenant database into an analytics store.
2.	**Optimize the extracted data** for analytics processing.
3.	Use **Business Intelligence** tools to draw out useful insights, which can guide decision making. 

In this tutorial you learn how to:

> [!div class="checklist"]
> - Create the tenant analytics store to extract the data into.
> - Use elastic jobs to extract data from each tenant database into the analytics store.
> - Optimize the extracted data (reorganize into a star-schema).
> -	Query the analytics database.
> -	Use Power BI for data visualization to highlight trends in tenant data and make recommendation for improvements.

![architectureOverView](media/saas-multitenantdb-tenant-analytics/architectureOverview.png)

## Offline tenant analytics pattern

SaaS applications you develop have access to a vast amount of tenant data stored in the cloud. The data provides a rich source of insights about the operation and usage of your application, and about the behavior of the tenants. These insights can guide feature development, usability improvements, and other investments in the app and platform.

Accessing the data for all tenants is simple when all the data is in just one multi-tenant database. But the access is more complex when distributed at scale across thousands of databases. One way to tame the complexity is to extract the data to an analytics database or a data warehouse. You then query the data warehouse to gather insights from the tickets data of all tenants.

This tutorial presents a complete analytics scenario for this sample SaaS application. First, elastic jobs are used to schedule the extraction of data from each tenant database. The data is sent to an analytics store. The analytics store could either be an SQL Database or a SQL Data Warehouse. For large-scale data extraction, [Azure Data Factory](../data-factory/introduction.md) is commended.

Next, the aggregated data is shredded into a set of [star-schema](https://www.wikipedia.org/wiki/Star_schema) tables. The tables consist of a central fact table plus related dimension tables:

- The central fact table in the star-schema contains ticket data.
- The dimension tables contain data about venues, events, customers, and purchase dates.

Together the central and dimension tables enable efficient analytical processing. The star-schema used in this tutorial is displayed in the following image:
 
![StarSchema](media/saas-multitenantdb-tenant-analytics/StarSchema.png)

Finally, the star-schema tables are queried. The query results are displayed visually to highlight insights into tenant behavior and their use of the application. With this star-schema, you can run queries that help discover items like the following:

- Who is buying tickets and from which venue.
- Hidden patterns and trends in the following areas:
    - The sales of tickets.
    - The relative popularity of each venue.

Understanding how consistently each tenant is using the service provides an opportunity to create service plans to cater to their needs. This tutorial provides basic examples of insights that can be gleaned from tenant data.

## Setup

### Prerequisites

To complete this tutorial, make sure the following prerequisites are met:

- The Wingtip Tickets SaaS Multi-tenant Database application is deployed. To deploy in less than five minutes, see [Deploy and explore the Wingtip Tickets SaaS Multi-tenant Database application](saas-multitenantdb-get-started-deploy.md)
- The Wingtip SaaS scripts and application [source code](https://github.com/Microsoft/WingtipTicketsSaaS-MultiTenantDB) are downloaded from GitHub. Be sure to *unblock the zip file* before extracting its contents. Check out the [general guidance](saas-tenancy-wingtip-app-guidance-tips.md) for steps to download and unblock the Wingtip Tickets SaaS scripts.
- Power BI Desktop is installed. [Download Power BI Desktop](https://powerbi.microsoft.com/downloads/)
- The batch of additional tenants has been provisioned, see the [**Provision tenants tutorial**](saas-multitenantdb-provision-and-catalog.md).
- A job agent and job agent database have been created. See the appropriate steps in the [**Schema management tutorial**](saas-multitenantdb-schema-management.md#create-a-job-agent-database-and-new-job-agent).

### Create data for the demo

In this tutorial, analysis is performed on ticket sales data. In the current step, you generate ticket data for all the tenants.  Later this data is extracted for analysis. *Ensure you have provisioned the batch of tenants as described earlier, so that you have a meaningful amount of data*. A sufficiently large amount of data can expose a range of different ticket purchasing patterns.

1. In **PowerShell ISE**, open *…\Learning Modules\Operational Analytics\Tenant Analytics\Demo-TenantAnalytics.ps1*, and set the following value:
    - **$DemoScenario** = **1** Purchase tickets for events at all venues
2. Press **F5** to run the script and create ticket purchasing history for every event in each venue.  The script runs for several minutes to generate tens of thousands of tickets.

### Deploy the analytics store
Often there are numerous transactional sharded databases that together hold all tenant data. You must aggregate the tenant data from the sharded database into one analytics store. The aggregation enables efficient query of the data. In this tutorial, an Azure SQL Database database is used to store the aggregated data.

In the following steps, you deploy the analytics store, which is called **tenantanalytics**. You also deploy predefined tables that are populated later in the tutorial:
1. In PowerShell ISE, open *…\Learning Modules\Operational Analytics\Tenant Analytics\Demo-TenantAnalytics.ps1* 
2. Set the $DemoScenario variable in the script to match your choice of analytics store. For learning purposes, SQL database without columnstore is recommended.
    - To use SQL database without columnstore, set **$DemoScenario** = **2**
    - To use SQL database with columnstore, set **$DemoScenario** = **3**  
3. Press **F5** to run the demo script (that calls the *Deploy-TenantAnalytics<XX>.ps1* script) which creates the tenant analytics store. 

Now that you have deployed the application and filled it with interesting tenant data, use [SQL Server Management Studio (SSMS)](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms) to connect **tenants1-mt-\<User\>** and **catalog-mt-\<User\>** servers using Login = *developer*, Password = *P@ssword1*.

![architectureOverView](media/saas-multitenantdb-tenant-analytics/ssmsSignIn.png)

In the Object Explorer, perform the following steps:

1. Expand the *tenants1-mt-\<User\>* server.
2. Expand the Databases node, and see *tenants1* database containing multiple tenants.
3. Expand the *catalog-mt-\<User\>* server.
4. Verify that you see the analytics store and the jobaccount database.

See the following database items in the SSMS Object Explorer by expanding the analytics store node:

- Tables **TicketsRawData** and **EventsRawData** hold raw extracted data from the tenant databases.
- The star-schema tables are **fact_Tickets**, **dim_Customers**, **dim_Venues**, **dim_Events**, and **dim_Dates**.
- The **sp_ShredRawExtractedData** stored procedure is used to populate the star-schema tables from the raw data tables.

![tenantAnalytics](media/saas-multitenantdb-tenant-analytics/tenantAnalytics.png)

## Data extraction 

### Create target groups 

Before proceeding, ensure you have deployed the job account and jobaccount database. In the next set of steps, Elastic Jobs is used to extract data from the sharded tenants database, and to store the data in the analytics store. Then the second job shreds the data and stores it into tables in the star-schema. These two jobs run against two different target groups, namely **TenantGroup** and **AnalyticsGroup**. The extract job runs against the TenantGroup, which contains all the tenant databases. The shredding job runs against the AnalyticsGroup, which contains just the analytics store. Create the target groups by using the following steps:

1. In SSMS, connect to the **jobaccount** database in catalog-mt-\<User\>.
2. In SSMS, open *…\Learning Modules\Operational Analytics\Tenant Analytics\ TargetGroups.sql* 
3. Modify the @User variable at the top of the script, replacing <User> with the user value used when you deployed the Wingtip Tickets SaaS Multi-tenant Database application.
4. Press **F5** to run the script that creates the two target groups.

### Extract raw data from all tenants

Transactions might occur more frequently for *ticket and customer* data than for *event and venue* data. Therefore, consider extracting ticket and customer data separately and more frequently than you extract event and venue data. In this section, you define and schedule two separate jobs:

- Extract ticket and customer data.
- Extract event and venue data.

Each job extracts its data, and posts it into the analytics store. There a separate job shreds the extracted data into the analytics star-schema.

1. In SSMS, connect to the **jobaccount** database in catalog-mt-\<User\> server.
2. In SSMS, open *...\Learning Modules\Operational Analytics\Tenant Analytics\ExtractTickets.sql*.
3. Modify @User at the top of the script, and replace <User> with the user name used when you deployed the Wingtip Tickets SaaS Multi-tenant Database application. 
4. Press **F5** to run the script that creates and runs the job that extracts tickets and customers data from each tenant database. The job saves the data into the analytics store.
5. Query the TicketsRawData table in the tenantanalytics database, to ensure that the table is populated with tickets information from all tenants.

![ticketExtracts](media/saas-multitenantdb-tenant-analytics/ticketExtracts.png)

Repeat the preceding steps, except this time replace **\ExtractTickets.sql** with **\ExtractVenuesEvents.sql** in step 2.

Successfully running the job populates the EventsRawData table in the analytics store with new events and venues information from all tenants. 

## Data reorganization

### Shred extracted data to populate star-schema tables

The next step is to shred the extracted raw data into a set of tables that are optimized for analytics queries. A star-schema is used. A central fact table holds individual ticket sales records. Dimension tables are populated with data about venues, events, customers, and purchase dates. 

In this section of the tutorial, you define and run a job that merges the extracted raw data with the data in the star-schema tables. After the merge job is finished, the raw data is deleted, leaving the tables ready to be populated by the next tenant data extract job.

1. In SSMS, connect to the **jobaccount** database in catalog-mt-\<User\>.
2. In SSMS, open *…\Learning Modules\Operational Analytics\Tenant Analytics\ShredRawExtractedData.sql*.
3. Press **F5** to run the script to define a job that calls the sp_ShredRawExtractedData stored procedure in the analytics store.
4. Allow enough time for the job to run successfully.
    - Check the **Lifecycle** column of jobs.jobs_execution table for the status of job. Ensure that the job **Succeeded** before proceeding. A successful run displays data similar to the following chart:

![shreddingJob](media/saas-multitenantdb-tenant-analytics/shreddingJob.PNG)

## Data exploration

### Visualize tenant data

The data in the star-schema table provides all the ticket sales data needed for your analysis. To make it easier to see trends in large data sets, you need to visualize it graphically.  In this section, you learn how to use **Power BI** to manipulate and visualize the tenant data you have extracted and organized.

Use the following steps to connect to Power BI, and to import the views you created earlier:

1. Launch Power BI desktop.
2. From the Home ribbon, select **Get Data**, and select **More…** from the menu.
3. In the **Get Data** window, select Azure SQL Database.
4. In the database login window, enter your server name (catalog-mt-\<User\>.database.windows.net). Select **Import** for **Data Connectivity Mode**, and then click OK. 

    ![powerBISignIn](media/saas-multitenantdb-tenant-analytics/powerBISignIn.PNG)

5. Select **Database** in the left pane, then enter user name = *developer*, and enter password = *P@ssword1*. Click **Connect**.  

    ![DatabaseSignIn](media/saas-multitenantdb-tenant-analytics/databaseSignIn.PNG)

6. In the **Navigator** pane, under the analytics database, select the star-schema tables: fact_Tickets, dim_Events, dim_Venues, dim_Customers and dim_Dates. Then select **Load**. 

Congratulations! You have successfully loaded the data into Power BI. Now you can start exploring interesting visualizations to help gain insights into your tenants. Next you walk through how analytics can enable you to provide data-driven recommendations to the Wingtip Tickets business team. The recommendations can help to optimize the business model and customer experience.

You start by analyzing ticket sales data to see the variation in usage across the venues. Select the following options in Power BI to plot a bar chart of the total number of tickets sold by each venue. Due to random variation in the ticket generator, your results may be different.
 
![TotalTicketsByVenues](media/saas-multitenantdb-tenant-analytics/TotalTicketsByVenues.PNG)

The preceding plot confirms that the number of tickets sold by each venue varies. Venues that sell more tickets are using your service more heavily than venues that sell fewer tickets. There may be an opportunity here to tailor resource allocation according to different tenant needs.

You can further analyze the data to see how ticket sales vary over time. Select the following options in Power BI to plot the total number of tickets sold each day for a period of 60 days.
 
![SaleVersusDate](media/saas-multitenantdb-tenant-analytics/SaleVersusDate.PNG)

The preceding chart displays that ticket sales spike for some venues. These spikes reinforce the idea that some venues might be consuming system resources disproportionately. So far there is no obvious pattern in when the spikes occur.

Next you want to further investigate the significance of these peak sale days. When do these peaks occur after tickets go on sale? To plot tickets sold per day, select the following options in Power BI.

![SaleDayDistribution](media/saas-multitenantdb-tenant-analytics/SaleDistributionPerDay.PNG)

The preceding plot shows that some venues sell a lot of tickets on the first day of sale. As soon as tickets go on sale at these venues, there seems to be a mad rush. This burst of activity by a few venues might impact the service for other tenants.

You can drill into the data again to see if this mad rush is true for all events hosted by these venues. In previous plots, you observed that Contoso Concert Hall sells a lot of tickets, and that Contoso also has a spike in ticket sales on certain days. Play around with Power BI options to plot cumulative ticket sales for Contoso Concert Hall, focusing on sale trends for each of its events. Do all events follow the same sale pattern?

![ContosoSales](media/saas-multitenantdb-tenant-analytics/EventSaleTrends.PNG)

The preceding plot for Contoso Concert Hall shows that the mad rush does not happen for all events. Play around with the filter options to see sale trends for other venues.

The insights into ticket selling patterns might lead Wingtip Tickets to optimize their business model. Instead of charging all tenants equally, perhaps Wingtip should introduce service tiers with different compute sizes. Larger venues that need to sell more tickets per day could be offered a higher tier with a higher service level agreement (SLA). Those venues could have their databases placed in pool with higher per-database resource limits. Each service tier could have an hourly sales allocation, with additional fees charged for exceeding the allocation. Larger venues that have periodic bursts of sales would benefit from the higher tiers, and Wingtip Tickets can monetize their service more efficiently.

Meanwhile, some Wingtip Tickets customers complain that they struggle to sell enough tickets to justify the service cost. Perhaps in these insights there is an opportunity to boost ticket sales for under performing venues. Higher sales would increase the perceived value of the service. Right click fact_Tickets and select **New measure**. Enter the following expression for the new measure called **AverageTicketsSold**:

```
AverageTicketsSold = DIVIDE(DIVIDE(COUNTROWS(fact_Tickets),DISTINCT(dim_Venues[VenueCapacity]))*100, COUNTROWS(dim_Events))
```

Select the following visualization options to plot the percentage tickets sold by each venue to determine their relative success.

![analyticsViews](media/saas-multitenantdb-tenant-analytics/AvgTicketsByVenues.PNG)

The preceding plot shows that even though most venues sell more than 80% of their tickets, some are struggling to fill more than half the seats. Play around with the Values Well to select maximum or minimum percentage of tickets sold for each venue.

Earlier you deepened your analysis to discover that ticket sales tend to follow predictable patterns. This discovery might let Wingtip Tickets help underperforming venues boost ticket sales by recommending dynamic pricing. This discovery could reveal an opportunity to employ machine learning techniques to predict ticket sales for each event. Predictions could also be made for the impact on revenue of offering discounts on ticket sales. Power BI Embedded could be integrated into an event management application. The integration could help visualize predicted sales and the effect of different discounts. The application could help devise an optimum discount to be applied directly from the analytics display.

You have observed trends in tenant data from the Wingtip Tickets SaaS Multi-tenant Database application. You can contemplate other ways the app can inform business decisions for SaaS application vendors. Vendors can better cater to the needs of their tenants. Hopefully this tutorial has equipped you with tools necessary to perform analytics on tenant data to empower your businesses to make data-driven decisions.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> - Deployed a tenant analytics database with pre-defined star schema tables
> - Used elastic jobs to extract data from all the tenant database
> - Merge the extracted data into tables in a star-schema designed for analytics
> -	Query an analytics database 
> -	Use Power BI for data visualization to observe trends in tenant data 

Congratulations!

## Additional resources

Additional [tutorials that build upon the Wingtip SaaS application](saas-dbpertenant-wingtip-app-overview.md#sql-database-wingtip-saas-tutorials). 
- [Elastic Jobs](sql-database-elastic-jobs-overview.md).
- [Cross-tenant analytics using extracted data - single-tenant app](saas-tenancy-tenant-analytics.md) 