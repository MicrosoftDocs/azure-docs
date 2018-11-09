---
title: Data migration service and tools matrix | Microsoft Docs
description: Learn about the service and tools availabile to support various aspects of the migration process.
services: database-migration
author: pochiraju
ms.author: rajpo
manager: 
ms.reviewer: 
ms.service: database-migration
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 11/02/2018
---

# Service and tools for data migration 
This article calls out the service and tools available to assist customers with various migration scenarios and specialty areas.

## Service and tools for migration planning and the Pre-migration stage
The following table identifies the service and tools that can help customers successfully plan for data migration and complete the **Pre-migration** stage.

<table width="68%">
<tbody>
<tr>
<td width="15%">&nbsp;</td>
<td width="16%">&nbsp;</td>
<td colspan="3" width="35%">
<p><strong>Business justification</strong></p>
</td>
<td colspan="3" width="32%">
<p><strong>Pre-migration</strong></p>
</td>
</tr>
<tr>
<td width="15%">
<p><strong>Source</strong></p>
</td>
<td width="16%">
<p><strong>Target</strong></p>
</td>
<td width="11%">
<p><strong>Discover/ Inventory</strong></p>
</td>
<td width="15%">
<p><strong>Target and SKU recommendation</strong></p>
</td>
<td width="9%">
<p><strong>TCO/ROI and Business case</strong></p>
</td>
<td width="10%">
<p><strong>App Data Access Layer Assessment</strong></p>
</td>
<td width="11%">
<p><strong>Database Assessment</strong></p>
</td>
<td width="11%">
<p><strong>Performance Assessment</strong></p>
</td>
</tr>
<tr>
<td width="15%">
<p>SQL Server</p>
</td>
<td width="16%">
<p>Azure SQL DB</p>
</td>
<td width="11%">
<p><a href="https://msdn.microsoft.com/en-us/library/bb977556.aspx">MAP Toolkit</a></p>
<p><a href="https://azure.microsoft.com/en-us/services/azure-migrate/">Azure Migrate</a></p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="15%">
<p><a href="https://docs.microsoft.com/en-us/sql/dma/dma-overview?view=sql-server-2017">DMA</a></p>
<p><a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="9%">
<p><a href="https://azure.microsoft.com/en-us/pricing/tco/calculator/">TCO Calculator</a></p>
</td>
<td width="10%">&nbsp;</td>
<td width="11%">
<p><a href="https://docs.microsoft.com/en-us/sql/dma/dma-overview?view=sql-server-2017">DMA</a></p>
<p><a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="11%">
<p><a href="https://www.microsoft.com/en-us/download/details.aspx?id=54090">DEA</a></p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
</tr>
<tr>
<td width="15%">
<p>SQL Server</p>
</td>
<td width="16%">
<p>Azure SQL DB MI</p>
</td>
<td width="11%">
<p><a href="https://msdn.microsoft.com/en-us/library/bb977556.aspx">MAP Toolkit</a></p>
<p><a href="https://azure.microsoft.com/en-us/services/azure-migrate/">Azure Migrate</a></p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="15%">
<p><a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="9%">
<p><a href="https://azure.microsoft.com/en-us/pricing/tco/calculator/">TCO Calculator</a></p>
</td>
<td width="10%">&nbsp;</td>
<td width="11%">
<p><a href="https://docs.microsoft.com/en-us/sql/dma/dma-overview?view=sql-server-2017">DMA</a></p>
<p><a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="11%">
<p><a href="https://www.microsoft.com/en-us/download/details.aspx?id=54090">DEA</a></p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
</tr>
<tr>
<td width="15%">
<p>SQL Server</p>
</td>
<td width="16%">
<p>Azure SQL VM</p>
</td>
<td width="11%">
<p><a href="https://msdn.microsoft.com/en-us/library/bb977556.aspx">MAP Toolkit</a></p>
<p><a href="https://azure.microsoft.com/en-us/services/azure-migrate/">Azure Migrate</a></p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="15%">
<p><a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="9%">
<p><a href="https://azure.microsoft.com/en-us/pricing/tco/calculator/">TCO Calculator</a></p>
</td>
<td width="10%">&nbsp;</td>
<td width="11%">
<p><a href="https://docs.microsoft.com/en-us/sql/dma/dma-overview?view=sql-server-2017">DMA</a></p>
<p><a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="11%">
<p><a href="https://www.microsoft.com/en-us/download/details.aspx?id=54090">DEA</a></p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
</tr>
<tr>
<td width="15%">
<p>SQL Server</p>
</td>
<td width="16%">
<p>SQL DW</p>
</td>
<td width="11%">&nbsp;</td>
<td width="15%">&nbsp;</td>
<td width="9%">
<p><a href="https://azure.microsoft.com/en-us/pricing/tco/calculator/">TCO Calculator</a></p>
</td>
<td width="10%">&nbsp;</td>
<td width="11%">&nbsp;</td>
<td width="11%">&nbsp;</td>
</tr>
<tr>
<td width="15%">
<p>RDS SQL</p>
</td>
<td width="16%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="11%">&nbsp;</td>
<td width="15%">
<p><a href="https://docs.microsoft.com/en-us/sql/dma/dma-overview?view=sql-server-2017">DMA</a></p>
</td>
<td width="9%">
<p><a href="https://azure.microsoft.com/en-us/pricing/tco/calculator/">TCO Calculator</a></p>
</td>
<td width="10%">&nbsp;</td>
<td width="11%">
<p><a href="https://docs.microsoft.com/en-us/sql/dma/dma-overview?view=sql-server-2017">DMA</a></p>
</td>
<td width="11%">
<p><a href="https://www.microsoft.com/en-us/download/details.aspx?id=54090">DEA</a></p>
</td>
</tr>
<tr>
<td width="15%">
<p>Oracle</p>
</td>
<td width="16%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="11%">
<p><a href="https://msdn.microsoft.com/en-us/library/bb977556.aspx">MAP Toolkit</a></p>
<p><a href="https://azure.microsoft.com/en-us/services/azure-migrate/">Azure Migrate</a></p>
</td>
<td width="15%">
<p><a href="https://www.migvisor.com/">MigVisor</a>*</p>
</td>
<td width="9%">&nbsp;</td>
<td width="10%">&nbsp;</td>
<td width="11%">
<p><a href="https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="11%">
<p><a href="http://www.simora.co.uk/">Simora</a>*</p>
</td>
</tr>
<tr>
<td width="15%">
<p>Oracle</p>
</td>
<td width="16%">
<p>SQL DW</p>
</td>
<td width="11%">
<p><a href="https://msdn.microsoft.com/en-us/library/bb977556.aspx">MAP Toolkit</a></p>
<p><a href="https://azure.microsoft.com/en-us/services/azure-migrate/">Azure Migrate</a></p>
</td>
<td width="15%">&nbsp;</td>
<td width="9%">&nbsp;</td>
<td width="10%">&nbsp;</td>
<td width="11%">
<p><a href="https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="11%">
<p><a href="http://www.simora.co.uk/">Simora</a>*</p>
</td>
</tr>
<tr>
<td width="15%">
<p>Oracle</p>
</td>
<td width="16%">
<p>Azure DB for PostgreSQL</p>
</td>
<td width="11%">&nbsp;</td>
<td width="15%">&nbsp;</td>
<td width="9%">&nbsp;</td>
<td width="10%">&nbsp;</td>
<td width="11%">&nbsp;</td>
<td width="11%">&nbsp;</td>
</tr>
<tr>
<td width="15%">
<p>MongoDB</p>
</td>
<td width="16%">
<p>Cosmos DB</p>
</td>
<td width="11%">
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="15%">
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="9%">
<p>&nbsp;</p>
</td>
<td width="10%">
<p>&nbsp;</p>
</td>
<td width="11%">
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="11%">
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
</tr>
<tr>
<td width="15%">
<p>Cassandra</p>
</td>
<td width="16%">
<p>Cosmos DB</p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
<td width="15%">
<p>&nbsp;</p>
</td>
<td width="9%">
<p>&nbsp;</p>
</td>
<td width="10%">
<p>&nbsp;</p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="15%">
<p>RDS/Aurora/on-prem MySQL</p>
</td>
<td width="16%">
<p>Azure DB for MySQL</p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
<td width="15%">
<p>&nbsp;</p>
</td>
<td width="9%">
<p><a href="https://azure.microsoft.com/en-us/pricing/tco/calculator/">TCO Calculator</a></p>
</td>
<td width="10%">
<p>&nbsp;</p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="15%">
<p>RDS/Aurora/on-prem PostgreSQL</p>
</td>
<td width="16%">
<p>Azure DB for PostgreSQL</p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
<td width="15%">
<p>&nbsp;</p>
</td>
<td width="9%">
<p><a href="https://azure.microsoft.com/en-us/pricing/tco/calculator/">TCO Calculator</a></p>
</td>
<td width="10%">
<p>&nbsp;</p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="15%">
<p>MySQL</p>
</td>
<td width="16%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="11%">
<p><a href="https://azure.microsoft.com/en-us/services/azure-migrate/">Azure Migrate</a></p>
</td>
<td width="15%">
<p><a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
</td>
<td width="9%">
<p><a href="https://azure.microsoft.com/en-us/pricing/tco/calculator/">TCO Calculator</a></p>
</td>
<td width="10%">
<p>&nbsp;</p>
</td>
<td width="11%">
<p><a href="https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
<p><a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="15%">
<p>DB2</p>
</td>
<td width="16%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
<td width="15%">
<p>&nbsp;</p>
</td>
<td width="9%">
<p>&nbsp;</p>
</td>
<td width="10%">
<p>&nbsp;</p>
</td>
<td width="11%">
<p><a href="https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="15%">
<p>Access</p>
</td>
<td width="16%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
<td width="15%">
<p>&nbsp;</p>
</td>
<td width="9%">
<p>&nbsp;</p>
</td>
<td width="10%">
<p>&nbsp;</p>
</td>
<td width="11%">
<p><a href="https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="15%">
<p>Sybase</p>
</td>
<td width="16%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
<td width="15%">
<p>&nbsp;</p>
</td>
<td width="9%">
<p>&nbsp;</p>
</td>
<td width="10%">
<p>&nbsp;</p>
</td>
<td width="11%">
<p><a href="https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
</tr>
</tbody>
</table>

> [!IMPORTANT]
> In the table above, items marked with an asterisk (*) represent third-party tools.

## Service and tools for the Migration and Post-migration stages
The following table identifies the service and tools that can help customers successfully complete the **Migration** and **Post-migration** stages.

<table width="53%">
<tbody>
<tr>
<td width="19%">&nbsp;</td>
<td width="20%">&nbsp;</td>
<td colspan="3" width="42%">
<p><strong>Migration</strong></p>
</td>
<td width="17%">
<p><strong>Post-migration</strong></p>
</td>
</tr>
<tr>
<td width="19%">
<p><strong>Source</strong></p>
</td>
<td width="20%">
<p><strong>Target</strong></p>
</td>
<td width="14%">
<p><strong>Schema</strong></p>
</td>
<td width="14%">
<p><strong>Data (Offline)</strong></p>
</td>
<td width="14%">
<p><strong>Data (Online)</strong></p>
</td>
<td width="17%">
<p><strong>Optimize</strong></p>
</td>
</tr>
<tr>
<td width="19%">
<p>SQL Server</p>
</td>
<td width="20%">
<p>Azure SQL DB</p>
</td>
<td width="14%">
<p><a href="https://docs.microsoft.com/en-us/sql/dma/dma-overview?view=sql-server-2017">DMA</a></p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="14%">
<p><a href="https://azure.microsoft.com/en-us/services/database-migration/">DMS</a></p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="14%">
<p><a href="https://azure.microsoft.com/en-us/services/database-migration/">DMS</a></p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a></p>
<p><a href="https://www.attunity.com/products/replicate/">Attunity</a>*</p>
<p><a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="17%">
<p><a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
</tr>
<tr>
<td width="19%">
<p>SQL Server</p>
</td>
<td width="20%">
<p>Azure SQL DB MI</p>
</td>
<td width="14%">
<p><a href="https://azure.microsoft.com/en-us/services/database-migration/">DMS</a></p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="14%">
<p><a href="https://azure.microsoft.com/en-us/services/database-migration/">DMS</a></p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="14%">
<p><a href="https://azure.microsoft.com/en-us/services/database-migration/">DMS</a></p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
<p><a href="https://www.attunity.com/products/replicate/">Attunity</a>*</p>
<p><a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="17%">
<p><a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
</tr>
<tr>
<td width="19%">
<p>SQL Server</p>
</td>
<td width="20%">
<p>Azure SQL VM</p>
</td>
<td width="14%">
<p><a href="https://docs.microsoft.com/en-us/sql/dma/dma-overview?view=sql-server-2017">DMA</a></p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="14%">
<p><a href="https://docs.microsoft.com/en-us/sql/dma/dma-overview?view=sql-server-2017">DMA</a></p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="14%">
<p><a href="https://azure.microsoft.com/en-us/services/database-migration/">DMS</a></p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
<p><a href="https://www.attunity.com/products/replicate/">Attunity</a>*</p>
<p><a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="17%">
<p><a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
</tr>
<tr>
<td width="19%">
<p>SQL Server</p>
</td>
<td width="20%">
<p>SQL DW</p>
</td>
<td width="14%">&nbsp;</td>
<td width="14%">&nbsp;</td>
<td width="14%">&nbsp;</td>
<td width="17%">&nbsp;</td>
</tr>
<tr>
<td width="19%">
<p>RDS SQL</p>
</td>
<td width="20%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="14%">
<p><a href="https://docs.microsoft.com/en-us/sql/dma/dma-overview?view=sql-server-2017">DMA</a></p>
</td>
<td width="14%">
<p><a href="https://azure.microsoft.com/en-us/services/database-migration/">DMS</a></p>
</td>
<td width="14%">
<p><a href="https://azure.microsoft.com/en-us/services/database-migration/">DMS</a></p>
<p><a href="https://www.attunity.com/products/replicate/">Attunity</a>*</p>
<p><a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="17%">&nbsp;</td>
</tr>
<tr>
<td width="19%">
<p>Oracle</p>
</td>
<td width="20%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="14%">
<p><a href="https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
<p><a href="https://www.quest.com/products/shareplex/">SharePlex</a>*</p>
</td>
<td width="14%">
<p><a href="https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
<p><a href="https://www.quest.com/products/shareplex/">SharePlex</a>*</p>
</td>
<td width="14%">
<p><a href="https://azure.microsoft.com/en-us/services/database-migration/">DMS</a></p>
<p><a href="https://www.quest.com/products/shareplex/">SharePlex</a></p>
<p><a href="https://www.attunity.com/products/replicate/">Attunity</a>*</p>
<p><a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="17%">&nbsp;</td>
</tr>
<tr>
<td width="19%">
<p>Oracle</p>
</td>
<td width="20%">
<p>SQL DW</p>
</td>
<td width="14%">
<p><a href="https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="14%">
<p><a href="https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="14%">
<p><a href="https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="17%">&nbsp;</td>
</tr>
<tr>
<td width="19%">
<p>Oracle</p>
</td>
<td width="20%">
<p>Azure DB for PostgreSQL</p>
</td>
<td width="14%">&nbsp;</td>
<td width="14%">&nbsp;</td>
<td width="14%">&nbsp;</td>
<td width="17%">&nbsp;</td>
</tr>
<tr>
<td width="19%">
<p>MongoDB</p>
</td>
<td width="20%">
<p>Cosmos DB</p>
</td>
<td width="14%">
<p><a href="https://azure.microsoft.com/en-us/services/database-migration/">DMS</a></p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
<p><a href="https://www.imanisdata.com/wp-content/uploads/2018/02/Imanis_DS_MongoDB_Azure_FINAL.pdf">Imanis Data</a>*</p>
</td>
<td width="14%">
<p><a href="https://azure.microsoft.com/en-us/services/database-migration/">DMS</a></p>
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
<p><a href="https://www.imanisdata.com/wp-content/uploads/2018/02/Imanis_DS_MongoDB_Azure_FINAL.pdf">Imanis Data</a>*</p>
</td>
<td width="14%">
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
<p><a href="https://www.imanisdata.com/wp-content/uploads/2018/02/Imanis_DS_MongoDB_Azure_FINAL.pdf">Imanis Data</a>*</p>
<p><a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="17%">
<p><a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
</tr>
<tr>
<td width="19%">
<p>Cassandra</p>
</td>
<td width="20%">
<p>Cosmos DB</p>
</td>
<td width="14%">
<p><a href="https://www.imanisdata.com/wp-content/uploads/2018/02/Imanis_DS_MongoDB_Azure_FINAL.pdf">Imanis Data</a>*</p>
</td>
<td width="14%">
<p><a href="https://www.imanisdata.com/wp-content/uploads/2018/02/Imanis_DS_MongoDB_Azure_FINAL.pdf">Imanis Data</a>*</p>
</td>
<td width="14%">
<p><a href="https://www.imanisdata.com/wp-content/uploads/2018/02/Imanis_DS_MongoDB_Azure_FINAL.pdf">Imanis Data</a>*</p>
</td>
<td width="17%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="19%">
<p>RDS/Aurora/on-prem MySQL</p>
</td>
<td width="20%">
<p>Azure DB for MySQL</p>
</td>
<td width="14%">
<p><a href="https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html">MySQL dump</a>*</p>
</td>
<td width="14%">
<p><a href="https://azure.microsoft.com/en-us/services/database-migration/">DMS</a></p>
</td>
<td width="14%">
<p><a href="https://azure.microsoft.com/en-us/services/database-migration/">DMS</a></p>
<p><a href="https://www.attunity.com/products/replicate/">Attunity</a>*</p>
<p><a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="17%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="19%">
<p>RDS/Aurora/on-prem PostgreSQL</p>
</td>
<td width="20%">
<p>Azure DB for PostgreSQL</p>
</td>
<td width="14%">
<p><a href="https://www.postgresql.org/docs/11/static/app-pgdump.html">PG dump</a>*</p>
</td>
<td width="14%">
<p><a href="https://azure.microsoft.com/en-us/services/database-migration/">DMS</a></p>
</td>
<td width="14%">
<p><a href="https://azure.microsoft.com/en-us/services/database-migration/">DMS</a></p>
<p><a href="https://www.attunity.com/products/replicate/">Attunity</a>*</p>
<p><a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="17%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="19%">
<p>MySQL</p>
</td>
<td width="20%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="14%">
<p><a href="https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="14%">
<p><a href="https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="14%">
<p><a href="https://azure.microsoft.com/en-us/services/database-migration/">DMS</a></p>
<p><a href="https://www.attunity.com/products/replicate/">Attunity</a>*</p>
<p><a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="17%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="19%">
<p>DB2</p>
</td>
<td width="20%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="14%">
<p><a href="https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="14%">
<p><a href="https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="14%">
<p><a href="https://azure.microsoft.com/en-us/services/database-migration/">DMS</a></p>
<p><a href="https://www.attunity.com/products/replicate/">Attunity</a>*</p>
<p><a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="17%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="19%">
<p>Access</p>
</td>
<td width="20%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="14%">
<p><a href="https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="14%">
<p><a href="https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="14%">
<p><a href="https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="17%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="19%">
<p>Sybase</p>
</td>
<td width="20%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="14%">
<p><a href="https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="14%">
<p><a href="https://docs.microsoft.com/en-us/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="14%">
<p><a href="https://azure.microsoft.com/en-us/services/database-migration/">DMS</a></p>
<p><a href="https://www.attunity.com/products/replicate/">Attunity</a>*</p>
<p><a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="17%">
<p>&nbsp;</p>
</td>
</tr>
</tbody>
</table>

> [!IMPORTANT]
> In the table above, items marked with an asterisk (*) represent third-party tools.

## Next steps
For an overview of the Azure Database Migration Service and regional availability, see the article [What is the Azure Database Migration Service Preview](dms-overview.md). 