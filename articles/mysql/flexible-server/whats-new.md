---
title: What's new in Azure Database for MySQL - Flexible Server
description: Learn about recent updates to Azure Database for MySQL - Flexible Server, a relational database service in the Microsoft cloud based on the MySQL Community Edition.
author: hjtoland3
ms.service: mysql
ms.author: jtoland
ms.custom: mvc, references_regions
ms.topic: conceptual
ms.date: 10/12/2021
---

# What's new in Azure Database for MySQL - Flexible Server ?

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

[Azure Database for MySQL - Flexible Server](./overview.md) is a deployment mode that's designed to provide more granular control and flexibility over database management functions and configuration settings than does the Single Server deployment mode. The service currently supports community version of MySQL 5.7 and 8.0.

This article summarizes new releases and features in Azure Database for MySQL - Flexible Server beginning in January 2021. Listings appear in reverse chronological order, with the most recent updates first.
## January 2022
- **Bug fixes**
 
    Restart workflow struck issue with servers with HA and Geo-redundant backup option enabled is fixed. 

- **Known issues**
    
    When you are using ARM templates for provisioning or configuration changes for HA enabled servers, if a single deployment is made to enable/disable HA and along with other server properties like backup redundancy, storage etc. then deployment would fail. You can mitigate it by submit the deployment request separately for to enable\disable and configuration changes. You would not have issue with Portal or Azure cli as these are request already separated. 

## November 2021
- **General Availability of Azure Database for MySQL - Flexible Server**
    
  Azure Database for MySQL - Flexible Server is now **General Availability** in more than [30 Azure regions](overview.md) worldwide.

- **View available full backups in Azure portal**
  A dedicated Backup and Restore blade is now available in the Azure portal. This blade lists the backups available within the server’s retention period, effectively providing you with single pane view for managing a server’s backups and consequent restores. You can use this blade to 
   1) View the completion timestamps for all available full backups within the server’s retention period 
   2) Perform restore operations using these full backups
  
- **Fastest restore points**
  
  With the fastest restore point option, you can restore a Flexible Server instance in the fastest time possible on a given day within the server’s retention period. This restore operation will simply restore the full snapshot backup without requiring restore or recovery of logs. With fastest restore point, customers will see 3 options while performing point in time restores from Azure portal viz latest restore point, custom restore point and fastest restore point. [Learn more](concepts-backup-restore.md#point-in-time-restore)
  
- **FAQ blade in Azure portal**

  The Backup and Restore blade will also include section dedicated to listing your most frequently asked questions, together with answers. This should provide you with answers to most questions about backup directly within the Azure portal. In addition, selecting the question mark icon for FAQs on the top menu provides access to even more related detail.

- **Restore a deleted Flexible server**
    
  The service now allows you to recover a deleted MySQL flexible server resource within 5 days from the time of server deletion. For a detailed guide on how to restore a deleted server, [refer documented steps](../flexible-server/how-to-restore-dropped-server.md). To protect server resources post deployment from accidental deletion or unexpected changes, we recommend administrators to leverage [management locks](../../azure-resource-manager/management/lock-resources.md).

- **Known issues**

    On servers where we have HA and  Geo-redundant backup option enabled, we found an rare issue encountered by a race condition which blocks the restart of the standby server to finish. As a result of this issue, when you failover the  HA enabled Azure database for MySQL - Flexible server MySQL Instance may get stuck in restarting state for a long time. The fix will be deployed to the production in the next deployment cycle.

## October 2021

- **Thread pools are now available for Azure Database for MySQL – Flexible Server**
 
    Thread pools enhance the scalability of the Azure Database for MySQL – Flexible Server. By using a thread pool, users can now optimize performance, achieve better throughput, and lower latency for high concurrent workloads. [Learn more](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/achieve-up-to-a-50-performance-boost-in-azure-database-for-mysql/ba-p/2909691).

- **Geo-redundant backup restore to geo-paired region for DR scenarios**

    The service now provides the added flexibility to choose geo-redundant backup storage to provide higher data resiliency. Enabling geo-redundancy empowers customers to recover from a geographic disaster or regional failure when they can’t access the server in the primary region. With this feature enabled, customers can perform geo-restore and deploy a new server to the geo-paired geographic region leveraging the original server’s latest available geo-redundant backup. [Learn more](../flexible-server/concepts-backup-restore.md). 

-  **Availability Zones Selection when creating Read replicas**

    When creating Read replica you have an option to select the Availability Zones location of your choice. An Availability Zone is a high availability offering that protects your applications and data from datacenter failures. Availability Zones are unique physical locations within an Azure region. [Learn more](../flexible-server/concepts-read-replicas.md).

- **Read replicas in Azure Database for MySQL - Flexible servers will no longer be available on Burstable SKUs**
    
    You will not be able to create new or maintain existing read replicas on the Burstable tier server. In the interest of providing a good query and development experience for Burstable SKU tiers, the support for creating and maintaining read replica for servers in the Burstable pricing tier will be discontinued. 

    If you have an existing Azure Database for MySQL - Flexible Server with read replica enabled, you will have to scale up your server to either General Purpose or Memory Optimized pricing tiers or delete the read replica within 60 days. After the 60-day period, while you can continue to use the primary server for your read-write operations, replication to read replica servers will be stopped. For newly created servers, read replica option will be available only for the General Purpose and Memory Optimized pricing tiers.  

 - **Monitoring Azure Database for MySQL - Flexible Server with Azure Monitor Workbooks**
 
     Azure Database for MySQL - Flexible Server is now integrated with Azure Monitor Workbooks. Workbooks provide a flexible canvas for data analysis and the creation of rich visual reports within the Azure portal. With this integration, the server has link to workbooks and few sample templates, which help to monitor the service at scale. These templates can be edited, customized to customer requirements and pinned to dashboard to create a focused and organized view of Azure resources. [Query Performance Insights](./tutorial-query-performance-insights.md), [Auditing](./tutorial-configure-audit.md), and Instance Overview templates are currently available. [Learn more](./concepts-workbooks.md).

- **Prepay for Azure Database for MySQL compute resources with reserved instances**

    Azure Database for MySQL - Flexible Server now helps you save money by prepaying for compute resources compared to pay-as-you-go prices. With Azure Database for MySQL reserved instances, you make an upfront commitment on MySQL server for a one or three year period to get a significant discount on the compute costs. You can also exchange a reservation from Azure Database for MySQL - Single Server with Flexible Server. [Learn more](../concept-reserved-pricing.md).

- **Stopping the server for up to 30 days while the server is not in use**
    
    Azure Database for MySQL Flexible Server now gives you the ability to Stop the server for up to 30 days when not in use and Start the server within this time when you are ready to resume your development. This enables you to develop at your own pace and save development costs on the database servers by paying for the resources only when they are in use. This is important for dev-test workloads and when you are only using the server for part of the day. When you stop the server, all active connections will be dropped. When the server is in the Stopped state, the server's compute is not billed. However, storage continues to to be billed as the server's storage remains to ensure that data files are available when the server is started again. [Learn more](concept-servers.md#stopstart-an-azure-database-for-mysql-flexible-server)

- **Terraform Support for MySQL Flexible Server**
    
    Terraform support for MySQL Flexible Server is now released  with the [latest v2.81.0 release of azurerm](https://github.com/hashicorp/terraform-provider-azurerm/blob/v2.81.0/CHANGELOG.md). The detailed reference document for provisioning and managing a MySQL Flexible Server using Terraform can be found [here](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/mysql_flexible_server). Any bugs or known issues can be found or report [here](https://github.com/hashicorp/terraform-provider-azurerm/issues).

- **Static Parameter innodb_log_file_size is now Configurable**

    - [innodb_log_file_size](https://dev.mysql.com/doc/refman/8.0/en/innodb-parameters.html#sysvar_innodb_log_file_size) can now be configured to any of these values: 256MB, 512MB, 1GB, or 2GB. Because it's a static parameter, it will require a server restart. If you have changed the parameter innodb_log_file_size from default, check if the value of "show global status like 'innodb_buffer_pool_pages_dirty'" stays at 0 for 30 seconds to avoid restart delay. See [Server parameters in Azure Database for MySQL](./concepts-server-parameters.md) to learn more.

- **Availability in two additional Azure regions**

   Azure Database for MySQL - Flexible Server is now available in the following Azure regions:

   - US West 3
   - North Central US
     [Learn more](overview.md#azure-regions).

- **Known Issues**
    - When a primary Azure region is down, one cannot create geo-redundant servers in it's geo-paired region as storage cannot be provisioned in the primary Azure region. One must wait for the primary region to be up to provision geo-redundant servers in the geo-paired region.
    

## September 2021

This release of Azure Database for MySQL - Flexible Server includes the following updates.

- **Availability in three additional Azure regions**

   The public preview of Azure Database for MySQL - Flexible Server is now available in the following Azure regions:

   - UK West
   - Canada East
   - Japan West

- **Bug fixes**

   Same-zone HA creation is fixed in the following regions:

   - Central India
   - East Asia
   - Korea Central
   - South Africa North
   - Switzerland North

## August 2021

This release of Azure Database for MySQL - Flexible Server includes the following updates.

- **High availability within a single zone using Same-Zone High Availability**

  The service now provides customers with the flexibility to choose the preferred availability zone for their standby server when they enable high availability. With this feature, customers can place a standby server in the same zone as the primary server, which reduces the replication lag between primary and standby. This also provides for lower latencies between the application server and database server if placed within the same Azure zone. [Learn more](./concepts-high-availability.md).

- **Standby zone selection using Zone-Redundant High Availability**

  The service now provides customers with the ability to choose the standby server zone location. Using this feature, customers can place their standby server in the zone of their choice. Colocating the standby database servers and standby applications in the same zone reduces latencies and allows customers to better prepare for disaster recovery situations and “zone down” scenarios. [Learn more](./concepts-high-availability.md).

- **Private DNS zone integration**

  [Azure Private DNS](../../dns/private-dns-privatednszone.md) provides a reliable and secure DNS service (responsible for translating a service name to IP address) for your virtual network. Azure Private DNS manages and resolves domain names in the virtual network without the need to configure a custom DNS solution. This enables you to connect your application running on a virtual network to your flexible server running on a locally or globally peered virtual network. The Azure Database for MySQL - Flexible Server now provides integration with an Azure private DNS zone to allow seamless resolution of private DNS within the current VNet, or any peered VNet to which the private DNS zone is linked. With this integration, if the IP address of the backend flexible server changes during failover or any other event, your integrated private DNS zone will be updated automatically to ensure your application connectivity resumes automatically once the server is online. [Learn more](./concepts-networking-vnet.md).

- **Point-In-Time Restore for a server in a specified virtual network**

  The Point-In-Time Restore experience for the service now enables customers to configure networking settings, allowing users to switch between private and public networking options when performing a restore operation. This feature gives customers the flexibility to inject a server being restored into a specified virtual network securing their connection endpoints. [Learn more](./how-to-restore-server-portal.md).

- **Point-In-Time Restore for a server in an availability zone**

  The Point-In-Time Restore experience for the service now enables customers to configure availability zone, Colocating the  database servers and standby applications in the same zone reduces latencies and allows customers to better prepare for disaster recovery situations and “zone down” scenarios. [Learn more](./concepts-high-availability.md).

- **validate_password and caching_sha2_password plugin available in private preview**

  Flexible Server now supports enabling validate_password and caching_sha2_password plugins in private preview. Email us at AskAzureDBforMySQL@service.microsoft.com

- **Availability in four additional Azure regions**

   The public preview of Azure Database for MySQL - Flexible Server is now available in the following Azure regions:

   - Australia Southeast
   - South Africa North
   - East Asia (Hong Kong)
   - Central India

   [Learn more](overview.md#azure-regions).

- **Known issues**

   - Right after Zone-Redundant high availability server failover, clients fail to connect to the server if using SSL with ssl_mode VERIFY_IDENTITY. This issue can be mitigated by using ssl_mode as VERIFY_CA.
   - Unable to create Same-Zone High availability server in the following regions: Central India, East Asia, Korea Central, South Africa North, Switzerland North.
   - In a rare scenario and after HA failover, the primary server will be in read_only mode. Resolve the issue by updating “read_only” value from the server parameters blade to OFF.
   - After successfully scaling Compute in the Compute+Storage blade, IOPS is reset to the SKU default. Customers can work around the issue by rescaling IOPs in the Compute+Storage blade to desired value (previously set) post the compute deployment and consequent IOPS reset.

## July 2021

This release of Azure Database for MySQL - Flexible Server includes the following updates.

- **Online migration from Single Server to Flexible Server**

  Customers can now migrate an instance of Azure Database for MySQL – Single Server to Flexible Server with minimum downtime to their applications by using Data-in Replication. For detailed, step-by-step instructions, see [Migrate Azure Database for MySQL – Single Server to Flexible Server with minimal downtime](../howto-migrate-single-flexible-minimum-downtime.md).

- **Availability in West US and Germany West Central**

  The public preview of Azure Database for MySQL - Flexible Server is now available in the West US  and Germany West Central Azure regions.

## June 2021

This release of Azure Database for MySQL - Flexible Server includes the following updates.

- **Improved performance on smaller storage servers**

    Beginning June 21, 2021, the minimum allowed provisioned storage size for all  newly created server increases from 5 GB to 20 GB. In addition, the available free IOPS increases from 100 to 300. These changes are summarized in the following table:

    | **Current** | **As of June 21, 2021** |
    |:----------|:----------|
    | Minimum allowed storage size: 5 GB | Minimum allowed storage size: 20 GB |
    | IOPS available: Max(100, 3 * [Storage provisioned in GB]) | IOPS available: (300 + 3 * [Storage provisioned in GB]) |

- **Free 12-month offer**

  As of June 15, 2021, the [Azure free account](https://azure.microsoft.com/free/) provides customers with up to 12 months of free access to Azure Database for MySQL – Flexible Server with 750 hours of usage and 32 GB of storage per month. Customers can take advantage of this offer to develop and deploy applications that use Azure Database for MySQL – Flexible Server. [Learn more](./how-to-deploy-on-azure-free-account.md).

- **Storage auto-grow**

  Storage auto grow prevents a server from running out of storage and becoming read-only. If storage auto grow is enabled, the storage automatically grows without impacting the workload. Beginning June 21, 2021, all newly created servers will have storage auto grow enabled by default. [Learn more](concepts-compute-storage.md#storage-auto-grow).

- **Data-in Replication**

    Flexible Server now supports [Data-in Replication](concepts-data-in-replication.md). Use this feature to synchronize and migrate data from a MySQL server running on-premises, in virtual machines, on Azure Database for MySQL Single Server, or on database services outside Azure to Azure Database for MySQL – Flexible Server. Learn more about [How to configure Data-in Replication](how-to-data-in-replication.md).

- **GitHub actions support with Azure CLI**

  Flexible Server CLI now allows customers to automate workflows to deploy updates with GitHub actions. This feature helps set up and deploy database updates with MySQL GitHub action workflow. These CLI commands assist with setting up a repository to enable continuous deployment for ease of development. [Learn more](/cli/azure/mysql/flexible-server/deploy).

- **Zone redundant HA forced failover fixes**

  This release includes fixes for known issues related to forced failover to ensure that server parameters and additional IOPS changes are persisted across failovers.

- **Known issues**

   - Trying to perform a compute scale up or scale down operation on an existing server with less than 20 GB of storage provisioned won't complete successfully. Resolve the issue by scaling up the provisioned storage to 20 GB and retrying the compute scaling operation.

## May 2021

This release of Azure Database for MySQL - Flexible Server includes the following updates.

- **Extended regional availability (France Central, Brazil South, and Switzerland North)**

    The public preview of Azure Database for MySQL - Flexible Server is now available in the France Central, Brazil South, and Switzerland North regions. [Learn more](overview.md#azure-regions).

- **SSL/TLS 1.2 enforcement can be disabled**

   This release provides the enhanced flexibility to customize enforcement of SSL and minimum TLS version. To learn more, see [Connect to Azure Database for MySQL - Flexible Server with encrypted connections](how-to-connect-tls-ssl.md).

- **Zone redundant HA available in UK South and Japan East region**

   Azure Database for MySQL - Flexible Server now offers zone redundant high availability in two additional regions: UK South and Japan East. [Learn more](overview.md#azure-regions).

- **Known issues**

   - Additional IOPs changes don’t take effect in zone redundant HA enabled servers. Customers can work around the issue by disabling HA, scaling IOPs, and the re-enabling zone redundant HA.
   - After force failover, the standby availability zone is inaccurately reflected in the portal. (No workaround)
   - Server parameter changes don't take effect in zone redundant HA enabled server after forced failover. (No workaround)

## April 2021

This release of Azure Database for MySQL - Flexible Server includes the following updates.

- **Ability to force failover to standby server with zone redundant high availability released**

  Customers can now manually force a failover to test functionality with their application scenarios, which can help them to prepare in case of any outages. [Learn more](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/forced-failover-for-azure-database-for-mysql-flexible-server/ba-p/2280671).

- **PowerShell module for Flexible Server released**

  Developers can now use PowerShell to provision, manage, operate, and support MySQL Flexible Servers and dependent resources. [Learn more](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/introducing-the-mysql-flexible-server-powershell-module/ba-p/2203383).

- **Connect, test, and execute queries using Azure CLI**

  Azure Database for MySQL Flexible Server now provides an improved developer experience allowing customers to connect and execute queries to their servers using the Azure CLI with the “az mysql flexible-server connect” and “az mysql flexible-server execute” commands. [Learn more](connect-azure-cli.md#view-all-the-arguments).

- **Fixes for provisioning failures for server creates in virtual network with private access**

  All the provisioning failures caused when creating a server in virtual network are fixed. With this release, users can successfully create flexible servers with private access every time.

## March 2021

This release of Azure Database for MySQL - Flexible Server includes the following updates.

- **MySQL 8.0.21 released**

  MySQL 8.0.21 is now available in Flexible Server in all major [Azure regions](overview.md#azure-regions). Customers can use the Azure portal, the Azure CLI, or Azure Resource Manager templates to provision the MySQL 8.0.21 release. [Learn more](quickstart-create-server-portal.md#create-an-azure-database-for-mysql-flexible-server).

- **Support for Availability zone placement during server creation released**

  Customers can now specify their preferred Availability zone at the time of server creation. This functionality allows customers to collocate their applications hosted on Azure VM, virtual machine scale set, or AKS and database in the same Availability zones to minimize database latency and improve performance. [Learn more](quickstart-create-server-portal.md#create-an-azure-database-for-mysql-flexible-server).

- **Performance fixes for issues when running flexible server in virtual network with private access**

  Before this release, the performance of flexible server degraded significantly when running in virtual network configuration. This release includes the fixes for the issue, which will allow users to see improved performance on flexible server in virtual network.

- **Known issues**

   - SSL\TLS 1.2 is enforced and cannot be disabled. (No workarounds)
   - There are intermittent provisioning failures for servers provisioned in a VNet. The workaround is to retry the server provisioning until it succeeds.

## February 2021

This release of Azure Database for MySQL - Flexible Server includes the following updates.

- **Additional IOPS feature released**

  Azure Database for MySQL - Flexible Server supports provisioning additional [IOPS](concepts-compute-storage.md#iops) independent of the storage provisioned. Customers can use this feature to increase or decrease the number of IOPS anytime based on their workload requirements.

- **Known issues**

  The performance of Azure Database for MySQL – Flexible Server degrades with private access virtual network isolation (No workaround).

## January 2021

This release of Azure Database for MySQL - Flexible Server includes the following updates.

- **Up to 10 read replicas for MySQL - Flexible Server**

  Flexible Server now supports asynchronous replication of data from one Azure Database for MySQL server (the 'source') to up to 10 Azure Database for MySQL servers (the 'replicas') in the same region. This functionality enables read-heavy workloads to scale out and be balanced across replica servers according to a user's preferences. [Learn more](concepts-read-replicas.md).

## Contacts

If you have questions about or suggestions for working with Azure Database for MySQL, consider the following points of contact as appropriate:

- To contact Azure Support, [file a ticket from the Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- To fix an issue with your account, file a [support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.
- To provide feedback or to request new features, email us at AskAzureDBforMySQL@service.microsoft.com.

## Next steps

- Learn more about [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/mysql/server/).
- Browse the [public documentation](index.yml) for Azure Database for MySQL – Flexible Server.
- Review details on [troubleshooting common migration errors](../howto-troubleshoot-common-errors.md).
