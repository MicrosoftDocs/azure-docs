---
title: Tutorial to review the assessments created for migration to SQL Server on Azure VM, Azure SQL Managed Instance and Azure SQL Database
description: Learn how to review assessment for Azure SQL in Azure Migrate
author: ankitsurkar06
ms.author: ankitsurkar
ms.topic: tutorial
ms.service: azure-migrate
ms.date: 11/05/2024
ms.custom: engagement-fy24
---

# Review a SQL assessment

This article describes the various components of an assessment and how you can review the assessment after it's created.

## View an assessment

Follow these steps to view the assessment that you created.

1. In **Servers, databases and web apps** > **Azure Migrate: Discovery and assessment**, select the number next to Azure SQL assessment.
2. Select the assessment name, which you wish to view. As an example(estimations and costs, for example, only):
      
      :::image type="content" source="./media/tutorial-assess-sql/assessment-sql-summary-inline.png" alt-text="Screenshot of Overview of SQL assessment." lightbox="./media/tutorial-assess-sql/assessment-sql-summary-expanded.png":::

3. Review the assessment summary. You can also edit the assessment settings or recalculate the assessment.

### Discovered entities

This indicates the number of SQL servers, instances, and databases that were assessed in this assessment.
    
### SQL Server migration scenarios

This indicates the different migration strategies that you can consider for your SQL deployments. You can review the readiness for target deployment types and the cost estimates for SQL Servers/Instances/Databases that are marked ready or ready with conditions: 

1. **Recommended deployment**: 
This is a strategy where an Azure SQL deployment type that is the most compatible with your SQL instance. It is the most cost-effective and is recommended. Migrating to a Microsoft-recommended target reduces your overall migration effort. If your instance is ready for SQL Server on Azure VM, Azure SQL Managed Instance and Azure SQL Database, the target deployment type, which has the least migration readiness issues and is the most cost-effective is recommended.
You can see the SQL Server instance readiness for different recommended deployment targets and monthly cost estimates for SQL instances marked *Ready* and *Ready with conditions*.

    - You can go to the Readiness report to:
        - Review the recommended Azure SQL configurations for migrating to SQL Server on Azure VM and/or Azure SQL databases and/or Azure SQL Managed Instances.
        - Understand details around migration issues/warnings that you can remediate before migration to the different Azure SQL targets. [Learn More](concepts-azure-sql-assessment-calculation.md).
    - You can go to the cost estimates report to review cost of each of the SQL instance after migrating to the recommended deployment target.

   > [!NOTE]
   > In the recommended deployment strategy, migrating instances to SQL Server on Azure VM is the recommended strategy for migrating SQL Server instances. When the SQL Server credentials are not available, the Azure SQL assessment provides right-sized lift-and-shift, that is, *Server to SQL Server on Azure VM* recommendations.

1. **Migrate all instances to Azure SQL MI**: 
In this strategy, you can see the readiness and cost estimates for migrating all SQL Server instances to Azure SQL Managed Instance. 

1. **Migrate all instances to SQL Server on Azure VM**: 
In this strategy, you can see the readiness and cost estimates for migrating all SQL Server instances to SQL Server on Azure VM.

1. **Migrate all servers to SQL Server on Azure VM**: 
In this strategy, you can see how you can rehost the servers running SQL Server to SQL Server on Azure VM and review the readiness and cost estimates.
Even when SQL Server credentials are not available, this report will provide right-sized lift-and-shift, that is, "Server to SQL Server on Azure VM" recommendations. The readiness and sizing logic is similar to Azure VM assessment type.

1. **Migrate all SQL databases to Azure SQL Database**
In this strategy, you can see how you can migrate individual databases to Azure SQL Database and review the readiness and cost estimates.

### Review support status

This indicates the support status of SQL servers, instances, and databases that were assessed in this assessment.

The Supportability section displays the support status of the SQL licenses.
The Discovery details section gives a graphic representation of the number of discovered SQL instances and their SQL editions.

1. Select the graph in the **Supportability** section to view a list of the assessed SQL instances.
2. The **Database instance license support status** column displays the support status of the Operating system, whether it is in mainstream support, extended support, or out of support. Selecting the support status opens a pane on the right, which shows the type of support status, duration of support, and the recommended steps to secure their workloads. 
   - To view the remaining duration of support, that is, the number of months for which the license is valid, 
select **Columns** > **Support ends in** > **Submit**. The **Support ends in** column displays the duration in months. 

### Review readiness
You can review readiness reports for different migration strategies: 

1. Select the **Readiness** report for any of the migration strategies.

    :::image type="content" source="./media/tutorial-assess-sql/assessment-sql-readiness-inline.png" alt-text="Screenshot with Details of Azure SQL readiness" lightbox="./media/tutorial-assess-sql/assessment-sql-readiness-expanded.png":::

1. Review the readiness columns in the respective reports:
    
    **Migration strategy** | **Readiness Columns (Respective deployment target)**
    --- | --- 
    Recommended | MI readiness (Azure SQL MI), VM readiness (SQL Server on Azure VM), DB readiness (Azure SQL DB).
    Instances to Azure SQL MI | MI readiness (Azure SQL Managed Instance)
    Instances to SQL Server on Azure VM | VM readiness (SQL Server on Azure VM).
    Servers to SQL Server on Azure VM | Azure VM readiness (SQL Server on Azure VM).
    Databases to Azure SQL DB | DB readiness (Azure SQL Database)

1. Review the readiness for the assessed SQL instances/SQL Servers/Databases:
    - **Ready**: The instance/server is ready to be migrated to SQL Server on Azure VM/Azure SQL MI/Azure SQL DB without any migration issues or warnings. 
        - Ready: The instance is ready to be migrated to Azure VM/Azure SQL MI/Azure SQL DB without any migration issues but has some migration warnings that you need to review. You can select the hyperlink to review the migration warnings and the recommended remediation guidance.
    - **Ready with conditions**: The instance/server has one or more migration issues for migrating to Azure VM/Azure SQL MI/Azure SQL DB. You can select on the hyperlink and review the migration issues and the recommended remediation guidance.
    - **Not ready**: The assessment could not find a SQL Server on Azure VM/Azure SQL MI/Azure SQL DB configuration meeting the desired configuration and performance characteristics. Select the hyperlink to review the recommendation to make the instance/server ready for the desired target deployment type.
    - **Unknown**: Azure Migrate can't assess readiness, because the discovery is in progress or there are issues during discovery that need to be fixed from the notifications blade. If the issue persists, contact [Microsoft support](https://support.microsoft.com).

1. Select the instance name and drill-down to see the number of user databases, instance details including instance properties, compute (scoped to instance) and source database storage details.
1. Click the number of user databases to review the list of databases and their details.
1. Click review details in the **Migration issues** column to review the migration issues and warnings for a particular target deployment type.

### Review cost estimates
The assessment summary shows the estimated monthly compute and storage costs for Azure SQL configurations corresponding to the recommended SQL Server on Azure VM and/or Azure SQL Managed Instances and/or Azure SQL Database deployment type.

1. Review the monthly total costs. Costs are aggregated for all SQL instances in the assessed group.
    - Cost estimates are based on the recommended Azure SQL configuration for an instance/server/database.
    - Estimated total(compute and storage) monthly costs are displayed. As an example:
    
      :::image type="content" source="./media/tutorial-assess-sql/assessment-sql-cost-inline.png" alt-text="Screenshot of cost details." lightbox="./media/tutorial-assess-sql/assessment-sql-cost-expanded.png":::

    - The compute and storage costs are split in the individual cost estimates reports and at instance/server/database level.
1. You can drill down at an instance level to see Azure SQL configuration and cost estimates at an instance level.  
1. You can also drill down to the database list to review the Azure SQL configuration and cost estimates per database when an Azure SQL Database configuration is recommended.

### Review confidence rating
Azure Migrate assigns a confidence rating to all Azure SQL assessments based on the availability of the performance/utilization data points needed to compute the assessment for all the assessed SQL instances and databases. Rating is from one star (lowest) to five stars (highest).
The confidence rating helps you estimate the reliability of size recommendations in the assessment. Confidence ratings are as follows:

**Data point availability** | **Confidence rating**
--- | ---
0%-20% | 1 star
21%-40% | 2 stars
41%-60% | 3 stars
61%-80% | 4 stars
81%-100% | 5 stars

[Learn more](assessment-report.md#confidence-ratings-performance-based) about confidence ratings.

## Next steps

- [Learn more](concepts-azure-sql-assessment-calculation.md) about how Azure SQL assessments are calculated.
- Start migrating SQL instances and databases using [Azure Database Migration Service](/azure/dms/dms-overview).