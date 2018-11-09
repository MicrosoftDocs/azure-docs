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

## Migration planning and pre-migration
The following table identifies the service and tools that can help customers successfully plan for data migration and complete the **Pre-migration** stage.

**Note**: In the following table, items marked with an asterisk (*) represent third-party tools.

<table width="67%">
<tbody>
<tr>
<td width="13%">&nbsp;</td>
<td width="9%">&nbsp;</td>
<td colspan="3" width="39%">
<p><strong>Business justification</strong></p>
</td>
<td colspan="3" width="37%">
<p><strong>Pre-migration</strong></p>
</td>
</tr>
<tr>
<td width="13%">
<p><strong>Source</strong></p>
</td>
<td width="9%">
<p><strong>Target</strong></p>
</td>
<td width="13%">
<p><strong>Discover/ inventory</strong></p>
</td>
<td width="14%">
<p><strong>Target and SKU recommendation</strong></p>
</td>
<td width="11%">
<p><strong>TCO/ROI and business case</strong></p>
</td>
<td width="10%">
<p><strong>App data access layer assessment</strong></p>
</td>
<td width="13%">
<p><strong>Database assessment</strong></p>
</td>
<td width="13%">
<p><strong>Performance assessment</strong></p>
</td>
</tr>
<tr>
<td width="13%">
<p>SQL Server</p>
</td>
<td width="9%">
<p>Azure SQL DB</p>
</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://msdn.microsoft.com/library/bb977556.aspx">MAP Toolkit</a></p>
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/azure-migrate/">Azure Migrate</a></p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/dma/dma-overview?view=sql-server-2017">DMA</a></p>
<p>&middot;&nbsp; <a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="11%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/pricing/tco/calculator/">TCO Calculator</a></p>
</td>
<td width="10%">&nbsp;</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/dma/dma-overview?view=sql-server-2017">DMA</a></p>
<p>&middot;&nbsp; <a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://www.microsoft.com/download/details.aspx?id=54090">DEA</a></p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
</tr>
<tr>
<td width="13%">
<p>SQL Server</p>
</td>
<td width="9%">
<p>Azure SQL DB MI</p>
</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://msdn.microsoft.com/library/bb977556.aspx">MAP Toolkit</a></p>
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/azure-migrate/">Azure Migrate</a></p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="11%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/pricing/tco/calculator/">TCO Calculator</a></p>
</td>
<td width="10%">&nbsp;</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/dma/dma-overview?view=sql-server-2017">DMA</a></p>
<p>&middot;&nbsp; <a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://www.microsoft.com/download/details.aspx?id=54090">DEA</a></p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
</tr>
<tr>
<td width="13%">
<p>SQL Server</p>
</td>
<td width="9%">
<p>Azure SQL VM</p>
</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://msdn.microsoft.com/library/bb977556.aspx">MAP Toolkit</a></p>
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/azure-migrate/">Azure Migrate</a></p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="11%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/pricing/tco/calculator/">TCO Calculator</a></p>
</td>
<td width="10%">&nbsp;</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/dma/dma-overview?view=sql-server-2017">DMA</a></p>
<p>&middot;&nbsp; <a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://www.microsoft.com/download/details.aspx?id=54090">DEA</a></p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
</tr>
<tr>
<td width="13%">
<p>SQL Server</p>
</td>
<td width="9%">
<p>SQL DW</p>
</td>
<td width="13%">&nbsp;</td>
<td width="14%">&nbsp;</td>
<td width="11%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/pricing/tco/calculator/">TCO Calculator</a></p>
</td>
<td width="10%">&nbsp;</td>
<td width="13%">&nbsp;</td>
<td width="13%">&nbsp;</td>
</tr>
<tr>
<td width="13%">
<p>RDS SQL</p>
</td>
<td width="9%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="13%">&nbsp;</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/dma/dma-overview?view=sql-server-2017">DMA</a></p>
</td>
<td width="11%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/pricing/tco/calculator/">TCO Calculator</a></p>
</td>
<td width="10%">&nbsp;</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/dma/dma-overview?view=sql-server-2017">DMA</a></p>
</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://www.microsoft.com/download/details.aspx?id=54090">DEA</a></p>
</td>
</tr>
<tr>
<td width="13%">
<p>Oracle</p>
</td>
<td width="9%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://msdn.microsoft.com/library/bb977556.aspx">MAP Toolkit</a></p>
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/azure-migrate/">Azure Migrate</a></p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://www.migvisor.com/">MigVisor</a>*</p>
</td>
<td width="11%">&nbsp;</td>
<td width="10%">&nbsp;</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="13%">
<p>&middot;&nbsp; <a href="http://www.simora.co.uk/">Simora</a>*</p>
</td>
</tr>
<tr>
<td width="13%">
<p>Oracle</p>
</td>
<td width="9%">
<p>SQL DW</p>
</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://msdn.microsoft.com/library/bb977556.aspx">MAP Toolkit</a></p>
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/azure-migrate/">Azure Migrate</a></p>
</td>
<td width="14%">&nbsp;</td>
<td width="11%">&nbsp;</td>
<td width="10%">&nbsp;</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="13%">
<p>&middot;&nbsp; <a href="http://www.simora.co.uk/">Simora</a>*</p>
</td>
</tr>
<tr>
<td width="13%">
<p>Oracle</p>
</td>
<td width="9%">
<p>Azure DB for PostgreSQL</p>
</td>
<td width="13%">&nbsp;</td>
<td width="14%">&nbsp;</td>
<td width="11%">&nbsp;</td>
<td width="10%">&nbsp;</td>
<td width="13%">&nbsp;</td>
<td width="13%">&nbsp;</td>
</tr>
<tr>
<td width="13%">
<p>MongoDB</p>
</td>
<td width="9%">
<p>Azure Cosmos DB</p>
</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
<td width="10%">
<p>&nbsp;</p>
</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
</tr>
<tr>
<td width="13%">
<p>Cassandra</p>
</td>
<td width="9%">
<p>Azure Cosmos DB</p>
</td>
<td width="13%">
<p>&nbsp;</p>
</td>
<td width="14%">
<p>&nbsp;</p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
<td width="10%">
<p>&nbsp;</p>
</td>
<td width="13%">
<p>&nbsp;</p>
</td>
<td width="13%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="13%">
<p>RDS/Aurora/on-prem MySQL</p>
</td>
<td width="9%">
<p>Azure DB for MySQL</p>
</td>
<td width="13%">
<p>&nbsp;</p>
</td>
<td width="14%">
<p>&nbsp;</p>
</td>
<td width="11%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/pricing/tco/calculator/">TCO Calculator</a></p>
</td>
<td width="10%">
<p>&nbsp;</p>
</td>
<td width="13%">
<p>&nbsp;</p>
</td>
<td width="13%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="13%">
<p>RDS/Aurora/on-prem PostgreSQL</p>
</td>
<td width="9%">
<p>Azure DB for PostgreSQL</p>
</td>
<td width="13%">
<p>&nbsp;</p>
</td>
<td width="14%">
<p>&nbsp;</p>
</td>
<td width="11%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/pricing/tco/calculator/">TCO Calculator</a></p>
</td>
<td width="10%">
<p>&nbsp;</p>
</td>
<td width="13%">
<p>&nbsp;</p>
</td>
<td width="13%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="13%">
<p>MySQL</p>
</td>
<td width="9%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/azure-migrate/">Azure Migrate</a></p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
</td>
<td width="11%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/pricing/tco/calculator/">TCO Calculator</a></p>
</td>
<td width="10%">
<p>&nbsp;</p>
</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
<p>&middot;&nbsp; <a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
</td>
<td width="13%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="13%">
<p>DB2</p>
</td>
<td width="9%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="13%">
<p>&nbsp;</p>
</td>
<td width="14%">
<p>&nbsp;</p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
<td width="10%">
<p>&nbsp;</p>
</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="13%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="13%">
<p>Access</p>
</td>
<td width="9%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="13%">
<p>&nbsp;</p>
</td>
<td width="14%">
<p>&nbsp;</p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
<td width="10%">
<p>&nbsp;</p>
</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="13%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="13%">
<p>Sybase</p>
</td>
<td width="9%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="13%">
<p>&nbsp;</p>
</td>
<td width="14%">
<p>&nbsp;</p>
</td>
<td width="11%">
<p>&nbsp;</p>
</td>
<td width="10%">
<p>&nbsp;</p>
</td>
<td width="13%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="13%">
<p>&nbsp;</p>
</td>
</tr>
</tbody>
</table>

## Migration and post-migration stages
The following table identifies the service and tools that can help customers successfully complete the **Migration** and **Post-migration** stages.

**Note**: In the following table, items marked with an asterisk (*) represent third-party tools.

<table width="49%">
<tbody>
<tr>
<td width="18%">&nbsp;</td>
<td width="13%">&nbsp;</td>
<td colspan="3" width="46%">
<p><strong>Migration</strong></p>
</td>
<td width="22%">
<p><strong>Post migration</strong></p>
</td>
</tr>
<tr>
<td width="18%">
<p><strong>Source</strong></p>
</td>
<td width="13%">
<p><strong>Target</strong></p>
</td>
<td width="14%">
<p><strong>Schema</strong></p>
</td>
<td width="14%">
<p><strong>Data (offline)</strong></p>
</td>
<td width="17%">
<p><strong>Data (online)</strong></p>
</td>
<td width="22%">
<p><strong>Optimize</strong></p>
</td>
</tr>
<tr>
<td width="18%">
<p>SQL Server</p>
</td>
<td width="13%">
<p>Azure SQL DB</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/dma/dma-overview?view=sql-server-2017">DMA</a></p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/database-migration/">DMS</a></p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="17%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/database-migration/">DMS</a></p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a></p>
<p>&middot;&nbsp; <a href="https://www.attunity.com/products/replicate/">Attunity</a>*</p>
<p>&middot;&nbsp; <a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="22%">
<p>&middot;&nbsp; <a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
</tr>
<tr>
<td width="18%">
<p>SQL Server</p>
</td>
<td width="13%">
<p>Azure SQL DB MI</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/database-migration/">DMS</a></p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/database-migration/">DMS</a></p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="17%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/database-migration/">DMS</a></p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
<p>&middot;&nbsp; <a href="https://www.attunity.com/products/replicate/">Attunity</a>*</p>
<p>&middot;&nbsp; <a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="22%">
<p>&middot;&nbsp; <a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
</tr>
<tr>
<td width="18%">
<p>SQL Server</p>
</td>
<td width="13%">
<p>Azure SQL VM</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/dma/dma-overview?view=sql-server-2017">DMA</a></p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/dma/dma-overview?view=sql-server-2017">DMA</a></p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
<td width="17%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/database-migration/">DMS</a></p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
<p>&middot;&nbsp; <a href="https://www.attunity.com/products/replicate/">Attunity</a>*</p>
<p>&middot;&nbsp; <a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="22%">
<p>&middot;&nbsp; <a href="https://www.unifycloud.com/cloud-migration-tool/">Cloud Atlas</a>*</p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
</tr>
<tr>
<td width="18%">
<p>SQL Server</p>
</td>
<td width="13%">
<p>SQL DW</p>
</td>
<td width="14%">&nbsp;</td>
<td width="14%">&nbsp;</td>
<td width="17%">&nbsp;</td>
<td width="22%">&nbsp;</td>
</tr>
<tr>
<td width="18%">
<p>RDS SQL</p>
</td>
<td width="13%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/dma/dma-overview?view=sql-server-2017">DMA</a></p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/database-migration/">DMS</a></p>
</td>
<td width="17%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/database-migration/">DMS</a></p>
<p>&middot;&nbsp; <a href="https://www.attunity.com/products/replicate/">Attunity</a>*</p>
<p>&middot;&nbsp; <a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="22%">&nbsp;</td>
</tr>
<tr>
<td width="18%">
<p>Oracle</p>
</td>
<td width="13%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
<p>&middot;&nbsp; <a href="https://www.quest.com/products/shareplex/">SharePlex</a>*</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
<p>&middot;&nbsp; <a href="https://www.quest.com/products/shareplex/">SharePlex</a>*</p>
</td>
<td width="17%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/database-migration/">DMS</a></p>
<p>&middot;&nbsp; <a href="https://www.quest.com/products/shareplex/">SharePlex</a></p>
<p>&middot;&nbsp; <a href="https://www.attunity.com/products/replicate/">Attunity</a>*</p>
<p>&middot;&nbsp; <a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="22%">&nbsp;</td>
</tr>
<tr>
<td width="18%">
<p>Oracle</p>
</td>
<td width="13%">
<p>SQL DW</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="17%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="22%">&nbsp;</td>
</tr>
<tr>
<td width="18%">
<p>Oracle</p>
</td>
<td width="13%">
<p>Azure DB for PostgreSQL</p>
</td>
<td width="14%">&nbsp;</td>
<td width="14%">&nbsp;</td>
<td width="17%">&nbsp;</td>
<td width="22%">&nbsp;</td>
</tr>
<tr>
<td width="18%">
<p>MongoDB</p>
</td>
<td width="13%">
<p>Azure Cosmos DB</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/database-migration/">DMS</a></p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
<p>&middot;&nbsp; <a href="https://www.imanisdata.com/wp-content/uploads/2018/02/Imanis_DS_MongoDB_Azure_FINAL.pdf">Imanis Data</a>*</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/database-migration/">DMS</a></p>
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
<p>&middot;&nbsp; <a href="https://www.imanisdata.com/wp-content/uploads/2018/02/Imanis_DS_MongoDB_Azure_FINAL.pdf">Imanis Data</a>*</p>
</td>
<td width="17%">
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
<p>&middot;&nbsp; <a href="https://www.imanisdata.com/wp-content/uploads/2018/02/Imanis_DS_MongoDB_Azure_FINAL.pdf">Imanis Data</a>*</p>
<p>&middot;&nbsp; <a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="22%">
<p>&middot;&nbsp; <a href="https://www.cloudamize.com/">Cloudamize</a>*</p>
</td>
</tr>
<tr>
<td width="18%">
<p>Cassandra</p>
</td>
<td width="13%">
<p>Azure Cosmos DB</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://www.imanisdata.com/wp-content/uploads/2018/02/Imanis_DS_MongoDB_Azure_FINAL.pdf">Imanis Data</a>*</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://www.imanisdata.com/wp-content/uploads/2018/02/Imanis_DS_MongoDB_Azure_FINAL.pdf">Imanis Data</a>*</p>
</td>
<td width="17%">
<p>&middot;&nbsp; <a href="https://www.imanisdata.com/wp-content/uploads/2018/02/Imanis_DS_MongoDB_Azure_FINAL.pdf">Imanis Data</a>*</p>
</td>
<td width="22%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="18%">
<p>RDS/Aurora/on-prem MySQL</p>
</td>
<td width="13%">
<p>Azure DB for MySQL</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html">MySQL dump</a>*</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/database-migration/">DMS</a></p>
</td>
<td width="17%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/database-migration/">DMS</a></p>
<p>&middot;&nbsp; <a href="https://www.attunity.com/products/replicate/">Attunity</a>*</p>
<p>&middot;&nbsp; <a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="22%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="18%">
<p>RDS/Aurora/on-prem PostgreSQL</p>
</td>
<td width="13%">
<p>Azure DB for PostgreSQL</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://www.postgresql.org/docs/11/static/app-pgdump.html">PG dump</a>*</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/database-migration/">DMS</a></p>
</td>
<td width="17%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/database-migration/">DMS</a></p>
<p>&middot;&nbsp; <a href="https://www.attunity.com/products/replicate/">Attunity</a>*</p>
<p>&middot;&nbsp; <a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="22%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="18%">
<p>MySQL</p>
</td>
<td width="13%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="17%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/database-migration/">DMS</a></p>
<p>&middot;&nbsp; <a href="https://www.attunity.com/products/replicate/">Attunity</a>*</p>
<p>&middot;&nbsp; <a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="22%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="18%">
<p>DB2</p>
</td>
<td width="13%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="17%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/database-migration/">DMS</a></p>
<p>&middot;&nbsp; <a href="https://www.attunity.com/products/replicate/">Attunity</a>*</p>
<p>&middot;&nbsp; <a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="22%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="18%">
<p>Access</p>
</td>
<td width="13%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="17%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="22%">
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td width="18%">
<p>Sybase</p>
</td>
<td width="13%">
<p>Azure SQL DB, MI, VM</p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="14%">
<p>&middot;&nbsp; <a href="https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant?view=sql-server-2017">SSMA</a></p>
</td>
<td width="17%">
<p>&middot;&nbsp; <a href="https://azure.microsoft.com/services/database-migration/">DMS</a></p>
<p>&middot;&nbsp; <a href="https://www.attunity.com/products/replicate/">Attunity</a>*</p>
<p>&middot;&nbsp; <a href="https://www.striim.com/partners/striim-for-microsoft-azure/">Striim</a>*</p>
</td>
<td width="22%">
<p>&nbsp;</p>
</td>
</tr>
</tbody>
</table>

## Next steps
For an overview of the Azure Database Migration Service and regional availability, see the article [What is the Azure Database Migration Service Preview](dms-overview.md). 