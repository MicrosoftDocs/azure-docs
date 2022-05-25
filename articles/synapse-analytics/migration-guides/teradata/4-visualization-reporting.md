---
title: "Visualization and reporting for Teradata migrations"
description: Learn about Microsoft and third-party BI tools for reports and visualizations in Azure Synapse compared to Teradata.
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.custom:
ms.devlang:
ms.topic: conceptual
author: ajagadish-24
ms.author: ajagadish
ms.reviewer: wiassaf
ms.date: 05/24/2022
---

# Visualization and reporting for Teradata migrations

This article is part four of a seven part series that provides guidance on how to migrate from Teradata to Azure Synapse Analytics. This article provides best practices for visualization and reporting.

## Access Azure Synapse Analytics using Microsoft and third-party BI tools

Almost every organization accesses data warehouses and data marts by using a range of BI tools and applications, such as:

- Microsoft BI tools, like Power BI.

- Office applications, like Microsoft Excel spreadsheets.

- Third-party BI tools from various vendors.

- Custom analytic applications that have embedded BI tool functionality inside the application.

- Operational applications that request BI on demand by invoking queries and reports as-a-service on a BI platform, that in-turn queries data in the data warehouse or data marts that are being migrated.

- Interactive data science development tools, for instance, Azure Synapse Spark Notebooks, Azure Machine Learning, RStudio, Jupyter notebooks.

The migration of visualization and reporting as part of a data warehouse migration program, means that all the existing queries, reports, and dashboards generated and issued by these tools and applications need to run on Azure Synapse and yield the same results as they did in the original data warehouse prior to migration.

> [!TIP]
> Existing users, user groups, roles and assignments of access security privileges need to be migrated first for migration of reports and visualizations to succeed.

To make that happen, everything that BI tools and applications depend on still needs to work once you migrate your data warehouse schema and data to Azure Synapse. That includes the obvious and the not so obvious&mdash;such as access and security. While access and security are discussed in [another guide](3-security-access-operations.md) in this series, it's a prerequisite to accessing data in the migrated system. Access and security include ensuring that:

- Authentication is migrated to let users sign in to the data warehouse and data mart databases on Azure Synapse.

- All users are migrated to Azure Synapse.

- All user groups are migrated to Azure Synapse.

- All roles are migrated to Azure Synapse.

- All authorization privileges governing access control are migrated to Azure Synapse.

- User, role, and privilege assignments are migrated to mirror what you had on your existing data warehouse before migration. For example:
  - Database object privileges assigned to roles
  - Roles assigned to user groups
  - Users assigned to user groups and/or roles

> [!TIP]
> Communication and business user involvement is critical to success.

In addition, all the required data needs to be migrated to ensure the same results appear in the same reports and dashboards that now query data on Azure Synapse. User expectation will undoubtedly be that migration is seamless and there will be no surprises that destroy their confidence in the migrated system on Azure Synapse. So, this is an area where you must take extreme care and communicate as much as possible to allay any fears in your user base. Their expectations are that:

- Table structure will be the same if directly referred to in queries

- Table and column names remain the same if directly referred to in queries; for instance, so that calculated fields defined on columns in BI tools don't fail when aggregate reports are produced

- Historical analysis remains the same

- Data types should, if possible, remain the same

- Query behavior remains the same

- ODBC / JDBC drivers are tested to make sure nothing has changed in terms of query behavior

> [!TIP]
> Views and SQL queries using proprietary SQL query extensions are likely to result in incompatibilities that impact BI reports and dashboards.

If BI tools are querying views in the underlying data warehouse or data mart database, then will these views still work? You might think yes, but if there are proprietary SQL extensions, specific to your legacy data warehouse DBMS in these views that have no equivalent in Azure Synapse, you'll need to know about them and find a way to resolve them.

Other issues like the behavior of nulls or data type variations across DBMS platforms need to be tested, in case they cause slightly different calculation results. Obviously, you want to minimize these issues and take all necessary steps to shield business users from any kind of impact. Depending on your legacy data warehouse system (such as Teradata), there are [tools](/azure/synapse-analytics/partner/data-integration) that can help hide these differences so that BI tools and applications are kept unaware of them and can run unchanged.

> [!TIP]
> Use repeatable tests to ensure reports, dashboards, and other visualizations migrate successfully,.

Testing is critical to visualization and report migration. You need a test suite and agreed-on test data to run and rerun tests in both environments. A test harness is also useful, and a few are mentioned later in this guide. In addition, it's also important to have significant business involvement in this area of migration to keep confidence high and to keep them engaged and part of the project.

Finally, you may also be thinking about switching BI tools. For example, you might want to [migrate to Power BI](/power-bi/guidance/powerbi-migration-overview). The temptation is to do all of this at the same time, while migrating your schema, data, ETL processing, and more. However, to minimize risk, it's better to migrate to Azure Synapse first and get everything working before undertaking further modernization.

If your existing BI tools run on premises, ensure that they're able to connect to Azure Synapse through your firewall to run comparisons against both environments. Alternatively, if the vendor of your existing BI tools offers their product on Azure, you can try it there. The same applies for applications running on premises that embed BI or that call your BI server on-demand, requesting a "headless report" with data returned in XML or JSON, for example.

There's a lot to think about here, so let's look at all this in more detail.

> [!TIP]
> A lift and shift data warehouse migration are likely to minimize any disruption to reports, dashboards, and other visualizations.

## Minimize the impact of data warehouse migration on BI tools and reports using data virtualization

> [!TIP]
> Data virtualization allows you to shield business users from structural changes during migration so that they remain unaware of changes.

The temptation during data warehouse migration to the cloud is to take the opportunity to make changes during the migration to fulfill long-term requirements, such as opening business requests, missing data, new features, and more. However, if you're going to do that, it can affect BI tool business users and applications accessing your data warehouse, especially if it involves structural changes in your data model. Even if there were no new data structures because of new requirements, but you're considering adopting a different data modeling technique (like Data Vault) in your migrated data warehouse, you're likely to cause structural changes that impact BI reports and dashboards. If you want to adopt an agile data modeling technique, do so after migration. One way in which you can minimize the impact of things like schema changes on BI tools, users, and the reports they produce, is to introduce data virtualization between BI tools and your data warehouse and data marts. The following diagram shows how data virtualization can hide the migration from users.

:::image type="content" source="../media/4-visualization-reporting/migration-data-virtualization.png" border="true" alt-text="Diagram showing how to hide the migration from users through data virtualization.":::

This breaks the dependency between business users utilizing self-service BI tools and the physical schema of the underlying data warehouse and data marts that are being migrated.

> [!TIP]
> Schema alterations to tune your data model for Azure Synapse can be hidden from users.

By introducing data virtualization, any schema alternations made during data warehouse and data mart migration to Azure Synapse (to optimize performance, for example) can be hidden from business users because they only access virtual tables in the data virtualization layer. If structural changes are needed, only the mappings between the data warehouse or data marts, and any virtual tables would need to be changed so that users remain unaware of those changes and unaware of the migration. [Microsoft partners](/azure/synapse-analytics/partner/data-integration) provides a useful data virtualization software.

## Identify high priority reports to migrate first

A key question when migrating your existing reports and dashboards to Azure Synapse is which ones to migrate first. Several factors can drive the decision. For example:

- Business value

- Usage

- Ease of migration

- Data migration strategy

These factors are discussed in more detail later in this article.

Whatever the decision is, it must involve the business, since they produce the reports and dashboards, and consume the insights these artifacts provide in support of the decisions that are made around your business. That said, if most reports and dashboards can be migrated seamlessly, with minimal effort, and offer up like- for-like results, simply by pointing your BI tool(s) at Azure Synapse, instead of your legacy data warehouse system, then everyone benefits. Therefore, if it's that straight forward and there's no reliance on legacy system proprietary SQL extensions, then there's no doubt that the above ease of migration option breeds confidence.

### Migrate reports based on usage

Usage is interesting, since it's an indicator of business value. Reports and dashboards that are never used clearly aren't contributing to supporting any decisions and don't currently offer any value. So, do you have any mechanism for finding out which reports, and dashboards are currently not used? Several BI tools provide statistics on usage, which would be an obvious place to start.

If your legacy data warehouse has been up and running for many years, there's a high chance you could have hundreds, if not thousands, of reports in existence. In these situations, usage is an important indicator to the business value of a specific report or dashboard. In that sense, it's worth compiling an inventory of the reports and dashboards you've and defining their business purpose and usage statistics.

For those that aren't used at all, it's an appropriate time to seek a business decision, to determine if it necessary to de-commission those reports to optimize your migration efforts. A key question worth asking when deciding to de-commission unused reports is: are they unused because people don't know they exist, or is it because they offer no business value, or have they been superseded by others?

### Migrate reports based on business value

Usage on its own isn't a clear indicator of business value. There needs to be a deeper business context to determine the value to the business. In an ideal world, we would like to know the contribution of the insights produced in a report to the bottom line of the business. That's exceedingly difficult to determine, since every decision made, and its dependency on the insights in a specific report, would need to be recorded along with the contribution that each decision makes to the bottom line of the business. You would also need to do this overtime.

This level of detail is unlikely to be available in most organizations. One way in which you can get deeper on business value to drive migration order is to look at alignment with business strategy. A business strategy set by your executive typically lays out strategic business objectives, key performance indicators (KPIs), and KPI targets that need to be achieved and who is accountable for achieving them. In that sense, classifying your reports and dashboards by strategic business objectives&mdash;for example, reduce fraud, improve customer engagement, and optimize business operations&mdash;will help understand business purpose and show what objective(s), specific reports, and dashboards these are contributing to. Reports and dashboards associated with high priority objectives in the business strategy can then be highlighted so that migration is focused on delivering business value in a strategic high priority area.

It's also worthwhile to classify reports and dashboards as operational, tactical, or strategic, to understand the level in the business where they're used. Delivering strategic business objectives contribution is required at all these levels. Knowing which reports and dashboards are used, at what level, and what objectives they're associated with, helps to focus migration on high priority business value that will drive the company forward. Business contribution of reports and dashboards is needed to understand this, perhaps like what is shown in the following **Business strategy objective** table.

| **Level** | **Report / dashboard name** | **Business purpose** | **Department used** | **Usage frequency** | **Business priority** |
|-|-|-|-|-|-|
| **Strategic**    | | | | | | 
| **Tactical**     | | | | | |  
| **Operational**  | | | | | |

While this may seem too time consuming, you need a mechanism to understand the contribution of reports and dashboards to business value, whether you're migrating or not. Catalogs like Azure Data Catalog are becoming very important because they give you the ability to catalog reports and dashboards, automatically capture the metadata associated with them, and let business users tag and rate them to help you understand business value.

### Migrate reports based on data migration strategy

> [!TIP]
> Data migration strategy could also dictate which reports and visualizations get migrated first.

If your migration strategy is based on migrating "data marts first", clearly, the order of data mart migration will have a bearing on which reports and dashboards can be migrated first to run on Azure Synapse. Again, this is likely to be a business-value-related decision. Prioritizing which data marts are migrated first reflects business priorities. Metadata discovery tools can help you here by showing you which reports rely on data in which data mart tables.

## Migration incompatibility issues that can impact reports and visualizations

When it comes to migrating to Azure Synapse, there are several things that can impact the ease of migration for reports, dashboards, and other visualizations. The ease of migration is affected by:

- Incompatibilities that occur during schema migration between your legacy data warehouse and Azure Synapse.

- Incompatibilities in SQL between your legacy data warehouse and Azure Synapse.

### The impact of schema incompatibilities

> [!TIP]
> Schema incompatibilities include legacy warehouse DBMS table types and data types that are unsupported on Azure Synapse.

BI tool reports and dashboards, and other visualizations, are produced by issuing SQL queries that access physical tables and/or views in your data warehouse or data mart. When it comes to migrating your data warehouse or data mart schema to Azure Synapse, there may be incompatibilities that can impact reports and dashboards, such as:

- Non-standard table types supported in your legacy data warehouse DBMS that don't have an equivalent in Azure Synapse (like the Teradata Time-Series tables)

- Data types supported in your legacy data warehouse DBMS that don't have an equivalent in Azure Synapse. For example, Teradata Geospatial or Interval data types.

In many cases, where there are incompatibilities, there may be ways around them. For example, the data in unsupported table types can be migrated into a standard table with appropriate data types and indexed or partitioned on a date/time column. Similarly, it may be able to represent unsupported data types in another type of column and perform calculations in Azure Synapse to achieve the same. Either way, it will need refactoring.

> [!TIP]
> Querying the system catalog of your legacy warehouse DBMS is a quick and straightforward way to identify schema incompatibilities with Azure Synapse.

To identify reports and visualizations impacted by schema incompatibilities, run queries against the system catalog of your legacy data warehouse to identify tables with unsupported data types. Then use metadata from your BI tool or tools to identify reports that access these structures, to see what could be impacted. Obviously, this will depend on the legacy data warehouse DBMS you're migrating from. Find details of how to identify these incompatibilities in [Design and performance for Teradata migrations](1-design-performance-migration.md).

The impact may be less than you think, because many BI tools don't support such data types. As a result, views may already exist in your legacy data warehouse that `CAST` unsupported data types to more generic types.

### The impact of SQL incompatibilities and differences

Additionally, any report, dashboard, or other visualization in an application or tool that makes use of proprietary SQL extensions associated with your legacy data warehouse DBMS, is likely to be impacted when migrating to Azure Synapse. This could happen because the BI tool or application:

- Accesses legacy data warehouse DBMS views that include proprietary SQL functions that have no equivalent in Azure Synapse.

- Issues SQL queries, which include proprietary SQL functions peculiar to the SQL dialect of your legacy data warehouse DBMS, that have no equivalent in Azure Synapse.

### Gauge the impact of SQL incompatibilities on your reporting portfolio

You can't rely on documentation associated with reports, dashboards, and other visualizations to gauge how big of an impact SQL incompatibility may have on the portfolio of embedded query services, reports, dashboards, and other visualizations you're intending to migrate to Azure Synapse. There must be a more precise way of doing that.

#### Use EXPLAIN statements to find SQL incompatibilities

> [!TIP]
> Gauge the impact of SQL incompatibilities by harvesting your DBMS log files and running `EXPLAIN` statements.

One way is to get a hold of the SQL log files of your legacy data warehouse. Use a script to pull out a representative set of SQL statements into a file, prefix each SQL statement with an `EXPLAIN` statement, and then run all the `EXPLAIN` statements in Azure Synapse. Any SQL statements containing proprietary SQL extensions from your legacy data warehouse that are unsupported will be rejected by Azure Synapse when the `EXPLAIN` statements are executed. This approach would at least give you an idea of how significant or otherwise the use of incompatible SQL is.

Metadata from your legacy data warehouse DBMS will also help you when it comes to views. Again, you can capture and view SQL statements, and `EXPLAIN` them as described previously to identify incompatible SQL in views.

## Test report and dashboard migration to Azure Synapse Analytics

> [!TIP]
> Test performance and tune to minimize compute costs.

A key element in data warehouse migration is the testing of reports and dashboards against Azure Synapse to verify that the migration has worked. To do this, you need to define a series of tests and a set of required outcomes for each test that needs to be run to verify success. It's important to ensure that reports and dashboards are tested and compared across your existing and migrated data warehouse systems to:

- Identify whether schema changes made during migration such as data types to be converted, have impacted reports in terms of ability to run, results, and corresponding visualizations.

- Verify all users are migrated.

- Verify all roles are migrated and users assigned to those roles.

- Verify all data access security privileges are migrated to ensure access control list (ACL) migration.

- Ensure consistent results of all known queries, reports, and dashboards.

- Ensure that data and ETL migration is complete and error free.

- Ensure data privacy is upheld.

- Test performance and scalability.

- Test analytical functionality.

For information about how to migrate users, user groups, roles, and privileges, see the [Security, access, and operations for Teradata migrations](3-security-access-operations.md) which is part of this series of articles.

> [!TIP]
> Build an automated test suite to make tests repeatable.

It's also best practice to automate testing as much as possible, to make each test repeatable and to allow a consistent approach to evaluating results. This works well for known regular reports, and could be managed via [Synapse pipelines](/azure/synapse-analytics/get-started-pipelines?msclkid=8f3e7e96cfed11eca432022bc07c18de) or [Azure Data Factory](/azure/data-factory/introduction?msclkid=2ccc66eccfde11ecaa58877e9d228779) orchestration. If you already have a suite of test queries in place for regression testing, you could use the testing tools to automate the post migration testing.

> [!TIP]
> Leverage tools that can compare metadata lineage to verify results.

Ad-hoc analysis and reporting are more challenging and requires a set of tests to be compiled to verify that results are consistent across your legacy data warehouse DBMS and Azure Synapse. If reports and dashboards are inconsistent, then having the ability to compare metadata lineage across original and migrated systems is extremely valuable during migration testing, as it can highlight differences and pinpoint where they occurred when these aren't easy to detect. This is discussed in more detail later in this article.

In terms of security, the best way to do this is to create roles, assign access privileges to roles, and then attach users to roles. To access your newly migrated data warehouse, set up an automated process to create new users, and to do role assignment. To detach users from roles, you can follow the same steps.

It's also important to communicate the cut-over to all users, so they know what's changing and what to expect.

## Analyze lineage to understand dependencies between reports, dashboards, and data

> [!TIP]
> Having access to metadata and data lineage from reports all the way back to data source is critical for verifying that migrated reports are working correctly.

A critical success factor in migrating reports and dashboards is understanding lineage. Lineage is metadata that shows the journey that data has taken, so you can see the path from the report/dashboard all the way back to where the data originates. It shows how data has gone from point to point, its location in the data warehouse and/or data mart, and where it's used&mdash;for example, in what reports. It helps you understand what happens to data as it travels through different data stores&mdash;files and database&mdash;different ETL pipelines, and into reports. If business users have access to data lineage, it improves trust, breeds confidence, and enables more informed business decisions.

> [!TIP]
> Tools that automate metadata collection and show end-to- end lineage in a multi-vendor environment are valuable when it comes to migration.

In multi-vendor data warehouse environments, business analysts in BI teams may map out data lineage. For example, if you've Informatica for your ETL, Oracle for your data warehouse, and Tableau for reporting, each of which have their own metadata repository, figuring out where a specific data element in a report came from can be challenging and time consuming.

To migrate seamlessly from a legacy data warehouse to Azure Synapse, end-to-end data lineage helps prove like-for-like migration when comparing reports and dashboards against your legacy environment. That means that metadata from several tools needs to be captured and integrated to show the end to end journey. Having access to tools that support automated metadata discovery and data lineage will let you see duplicate reports and ETL processes and reports that rely on data sources that are obsolete, questionable, or even non-existent. With this information, you can reduce the number of reports and ETL processes that you migrate.

You can also compare end-to-end lineage of a report in Azure Synapse against the end-to-end lineage, for the same report in your legacy data warehouse environment, to see if there are any differences that have occurred inadvertently during migration. This helps enormously with testing and verifying migration success.

Data lineage visualization not only reduces time, effort, and error in the migration process, but also enables faster execution of the migration project.

By leveraging automated metadata discovery and data lineage tools that can compare lineage, you can verify if a report is produced using data migrated to Azure Synapse and if it's produced in the same way as in your legacy environment. This kind of capability also helps you determine:

- What data needs to be migrated to ensure successful report and dashboard execution on Azure Synapse

- What transformations have been and should be performed to ensure successful execution on Azure Synapse

- How to reduce report duplication

This substantially simplifies the data migration process, because the business will have a better idea of the data assets it has and what needs to be migrated to enable a solid reporting environment on Azure Synapse.

> [!TIP]
> Azure Data Factory and several third-party ETL tools support lineage.

Several ETL tools provide end-to-end lineage capability, and you may be able to make use of this via your existing ETL tool if you're continuing to use it with Azure Synapse. Microsoft [Synapse pipelines](/azure/synapse-analytics/get-started-pipelines?msclkid=8f3e7e96cfed11eca432022bc07c18de) or [Azure Data Factory](/azure/data-factory/introduction?msclkid=2ccc66eccfde11ecaa58877e9d228779) lets you view lineage in mapping flows. Also, [Microsoft partners](/azure/synapse-analytics/partner/data-integration) provide automated metadata discovery, data lineage, and lineage comparison tools.

## Migrate BI tool semantic layers to Azure Synapse Analytics

> [!TIP]
> Some BI tools have semantic layers that simplify business user access to physical data structures in your data warehouse or data mart, like SAP Business Objects and IBM Cognos.

Some BI tools have what is known as a semantic metadata layer. The role of this metadata layer is to simplify business user access to physical data structures in an underlying data warehouse or data mart database. It does this by providing high-level objects like dimensions, measures, hierarchies, calculated metrics, and joins. These objects use business terms familiar to business analysts and are mapped to the physical data structures in the data warehouse or data mart database.

When it comes to data warehouse migration, changes to column names or table names may be forced upon you. For example, in Oracle, table names can have a "#". In Azure Synapse, the "#" is only allowed as a prefix to a table name to indicate a temporary table. Therefore, you may need to change a table name if migrating from Oracle. You may need to do rework to change mappings in such cases.

A good way to get everything consistent across multiple BI tools is to create a universal semantic layer, using common data names for high-level objects like dimensions, measures, hierarchies, and joins, in a data virtualization server (as shown in the next diagram) that sits between applications, BI tools, and Azure Synapse. This allows you to set up everything once (instead of in every tool), including calculated fields, joins and mappings, and then point all BI tools at the data virtualization server.

> [!TIP]
> Use data virtualization to create a common semantic layer to guarantee consistency across all BI tools in an Azure Synapse environment.

In this way, you get consistency across all BI tools, while at the same time breaking the dependency between BI tools and applications, and the underlying physical data structures in Azure Synapse. Use [Microsoft partners](/azure/synapse-analytics/partner/data-integration) on Azure to implement this. The following diagram shows how a common vocabulary in the Data Virtualization server lets multiple BI tools see a common semantic layer.

:::image type="content" source="../media/4-visualization-reporting/data-virtualization-semantics.png" border="true" alt-text="Diagram with common data names and definitions that relate to the data virtualization server.":::

## Conclusions

> [!TIP]
> Identify incompatibilities early to gauge the extent of the migration effort. Migrate your users, group roles and privilege assignments. Only migrate the reports and visualizations that are used and are contributing to business value.

In a lift-and-shift data warehouse migration to Azure Synapse, most reports and dashboards should migrate easily.

However, if data structures change, then data is stored in unsupported data types or access to data in the data warehouse or data mart is via a view that includes proprietary SQL that's unsupported in your Azure Synapse environment. You'll need to deal with those issues if they arise.

You can't rely on documentation to find out where the issues are likely to be. Making use of `EXPLAIN` statements is a pragmatic and quick way to identify incompatibilities in SQL. Rework these to achieve similar results in Azure Synapse. In addition, it's recommended that you make use of automated metadata discovery and lineage tools to help you identify duplicate reports, reports that are no longer valid because they're using data from data sources that you no longer use, and to understand dependencies. Some of these tools help compare lineage to verify that reports running in your legacy data warehouse environment are produced identically in Azure Synapse.

Don't migrate reports that you no longer use. BI tool usage data can help determine which ones aren't in use. For the visualizations and reports that you do want to migrate, migrate all users, user groups, roles, and privileges, and associate these reports with strategic business objectives and priorities to help you identify report insight contribution to specific objectives. This is useful if you're using business value to drive your report migration strategy. If you're migrating by data store,&mdash;data mart by data mart&mdash;then metadata will also help you identify which reports are dependent on which tables and views, so that you can focus on migrating to these first.

Finally, consider data virtualization to shield BI tools and applications from structural changes to the data warehouse and/or the data mart data model that may occur during migration. You can also use a common vocabulary with data virtualization to define a common semantic layer that guarantees consistent common data names, definitions, metrics, hierarchies, joins, and more across all BI tools and applications in a migrated Azure Synapse environment.

## Next steps

To learn more about minimizing SQL issues, see the next article in this series: [Minimizing SQL issues for Teradata migrations](5-minimize-sql-issues.md).
