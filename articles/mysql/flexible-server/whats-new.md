---
title: What's new in Azure Database for MySQL - Flexible Server
description: Learn about recent updates to Azure Database for MySQL - Flexible Server, a relational database service in the Microsoft cloud based on the MySQL Community Edition.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
author: SudheeshGH
ms.author: sunaray
ms.reviewer: maghan
ms.custom: mvc, references_regions, event-tier1-build-2022
ms.date: 09/16/2022
---

# What's new in Azure Database for MySQL - Flexible Server?

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

[Azure Database for MySQL - Flexible Server](./overview.md) is a deployment mode designed to provide more granular control and flexibility over database management functions and configuration settings than the Single Server deployment mode. The service currently supports the community version of MySQL 5.7 and 8.0.

This article summarizes new releases and features in Azure Database for MySQL - Flexible Server beginning in January 2021. Listings appear in reverse chronological order, with the most recent updates first.

> [!NOTE]
> This article contains references to the term slave, a term that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

## October 2022

- **AMD compute SKUs for General Purpose and Business Critical tiers in in Azure Database for MySQL - Flexible Server**

  You can now choose between Intel and AMD hardware for Azure Database for MySQL flexible servers based on the General Purpose (Dadsv5-series) and Business Critical (Eadsv5-series) tiers. AMD SKU offers competitive price-performance options to all Azure Database for MySQL - Flexible server users. To ensure transparency when working in the portal, you can select the compute hardware vendor for both primary and secondary server. After you determine the best compute processor for your workload, deploy flexible servers in an increased number of availability regions and zones. [Learn more](./concepts-service-tiers-storage.md)

- **Autoscale IOPS in Azure Database for MySQL - Flexible Server (Preview)**

  You can now scale IOPS on demand without having to pre-provision a certain amount of IOPS. With this feature, you can now enjoy worry free IO management in Azure Database for MySQL - Flexible Server because the server scales IOPs up or down automatically depending on workload needs. With this feature you, pay only for the IO you use and no longer need to provision and pay for resources they aren’t fully using, saving both time and money. In addition, mission-critical Tier-1 applications can achieve consistent performance by making additional IO available to the workload at any time. Auto scale IO eliminates the administration required to provide the best performance at the least cost for Azure Database for MySQL customers. [Learn more](./concepts-service-tiers-storage.md)

- **Perform Major version upgrade with minimal efforts for Azure Database for MySQL - Flexible Server (Preview)**

  The major version upgrade feature allows you to perform in-place upgrades of existing instances of Azure Database for MySQL - Flexible Server from MySQL 5.7 to MySQL 8.0 with the click of a button, without any data movement or the need to make any application connection string changes. Take advantage of this functionality to efficiently perform major version upgrades on your instances of Azure Database for MySQL - Flexible Server and leverage the latest that MySQL 8.0 has to offer. [Learn more](./how-to-upgrade.md).

- **MySQL extension for Azure Data Studio (Preview)**

  When you’re working with multiple databases across data platforms and cloud deployment models, being able to perform the most common tasks on all your databases using a single tool enhances your productivity several fold. With the MySQL extension for Azure Data Studio, you can now connect to and modify MySQL databases along with your other databases, taking advantage of the modern editor experience and capabilities in Azure Data Studio, such as IntelliSense, code snippets, source control integration, native Jupyter Notebooks, an integrated terminal, and more. Use this new tooling with any MySQL server hosted on-premises, on virtual machines, on managed MySQL in other clouds, and on Azure Database for MySQL – Flexible Server. [Learn more](/sql/azure-data-studio/quickstart-mysql).

- **Enhanced metrics for better monitoring**
 
  You can now monitor more metrics under monitoring for your Azure database for MySQL flexible server. Enhanced metrics allows you to have more visibility and monitor performance with [Innodb metrics](./concepts-monitoring.md#innodb-metrics) and troubleshoot database management operations with metrics like [DML statistics](./concepts-monitoring.md#dml-statistics) and [DDL statistics](./concepts-monitoring.md#ddl-statistics). [Learn more](./concepts-monitoring.md#enhanced-metrics)

- **Server parameters that are now configurable**

  List of server parameters that are now configurable.
  - [slave_transaction_retries](https://dev.mysql.com/doc/mysql-replication-excerpt/8.0/en/replication-options-replica.html#sysvar_slave_transaction_retries)
  - [slave_checkpoint_period](https://dev.mysql.com/doc/mysql-replication-excerpt/8.0/en/replication-options-replica.html#sysvar_slave_checkpoint_period)
  - [slave_checkpoint_group](https://dev.mysql.com/doc/mysql-replication-excerpt/8.0/en/replication-options-replica.html#sysvar_slave_checkpoint_group)


- **Known issues**

  - Change of compute size isn't currently permitted after the [Major version upgrade](./how-to-upgrade.md) of your Azure Database for MySQL - Flexible Server. It is recommended to change the compute size of your Azure Database for MySQL - Flexible Server before the major version upgrade from version 5.7 to version 8.0.


## September 2022

- **Read replica for HA enabled Azure Database for MySQL - Flexible Server (General Availability)**

  The read replica feature allows you to replicate data from an Azure Database for MySQL flexible server to a read-only server. You can replicate the source server to up to 10 replicas. This functionality is now extended to support HA enabled servers within same region.[Learn more](concepts-read-replicas.md)

- **Azure Active Directory authentication for Azure Database for MySQL – Flexible Server (Public Preview)**

  You can now authenticate to Azure Database for MySQL - Flexible server using Microsoft Azure Active Directory (Azure AD) using identities. With Azure AD authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management. [Learn More](concepts-azure-ad-authentication.md)

- **Known issues**

  - The server parameter aad_auth_only stays set to ON when the authentication type is changed to Azure Active Directory authentication only. We recommend disabling it manually when you opt for MySQL authentication only in the future.

  - The newly restored server will also have the server parameter aad_auth_only set to ON if it was ON on the source server during failover. If you wish to use MySQL authentication on the restored server, you must manually disable this server parameter. Otherwise, an Azure AD Admin must be configured.  

- **Customer managed keys data encryption – Azure Database for MySQL – Flexible Server (Preview)**

    With data encryption with customer-managed keys (CMKs) for Azure Database for MySQL - Flexible Server Preview, you can bring your own key (BYOK) for data protection at rest and implement separation of duties for managing keys and data. Data encryption with CMKs is set at the server level. For a given server, a CMK, called the key encryption key (KEK), is used to encrypt the data encryption key (DEK) used by the service. With customer managed keys (CMKs), the customer is responsible for and in a full control of key lifecycle management (key creation, upload, rotation, deletion), key usage permissions, and auditing operations on keys. [Learn More](concepts-customer-managed-key.md)

- **Change Timezone of your Azure Database for MySQL - Flexible Server in a single step**

   Previously to change time_zone of your Azure Database for MySQL - Flexible Server required two steps to take effect. Now you no longer need to call the procedure mysql.az_load_timezone() to populate the mysql.time_zone_name table. Flexible Server timezone can be changed directly by just changing the server parameter time_zone from [portal](./how-to-configure-server-parameters-portal.md#working-with-the-time-zone-parameter) or [CLI](./how-to-configure-server-parameters-cli.md#working-with-the-time-zone-parameter). 

- **Known issues**

  - The server parameter aad_auth_only stays set to ON when the authentication type is changed to Azure Active Directory authentication only. We recommend disabling it manually when you opt for MySQL authentication only in the future.

  - The newly restored server will also have the server parameter aad_auth_only set to ON if it was ON on the source server during failover. If you wish to use MySQL authentication on the restored server, you must manually disable this server parameter. Otherwise, an Azure AD Admin must be configured.  

## August 2022

- **Server logs for Azure Database for MySQL - Flexible Server**

    Server Logs will help customers to emit the server logs to server storage space in file format, which you can later download. Slow query logs are supported with server logs, which can help customers in performance troubleshooting and query tuning. Customers can store logs for up to a week or up to 7 GB. You can configure or download them from [Azure portal](./how-to-server-logs-portal.md) or [Azure CLI](./how-to-server-logs-cli.md).[Learn more](./concepts-monitoring.md#server-logs)

- **On-Demand Backup for Azure Database for MySQL - Flexible Server**

    The on-Demand backup feature allows customers to trigger On-Demand backups of their production workload, in addition to the automated backups taken by Azure Database for MySQL Flexible service, and store it in alignment with the server’s backup retention policy. These backups can be used as the fastest restore point to perform a point-in-time restore for faster and more predictable restore times. [**Learn more**](how-to-trigger-on-demand-backup.md#trigger-on-demand-backup)

- **Business Critical tier now supports Ev5 compute series**

    Business Critical tier for Azure Database for MySQL – Flexible Server now supports the Ev5 compute series in more regions.
Learn more about [Boost Azure MySQL Business Critical flexible server performance by 30% with the Ev5 compute series!](https://techcommunity.microsoft.com/t5/azure-database-for-mysql-blog/boost-azure-mysql-business-critical-flexible-server-performance/ba-p/3603698)

- **Server parameters that are now configurable**

    List of dynamic server parameters that are now configurable
    - [lc_time_names](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_lc_time_names)
    - [replicate_wild_ignore_table](https://dev.mysql.com/doc/refman/8.0/en/replication-options-replica.html#option_mysqld_replicate-wild-ignore-table)
    - [slave_pending_jobs_size_max](https://dev.mysql.com/doc/refman/8.0/en/replication-options-replica.html#sysvar_slave_pending_jobs_size_max)
    - [slave_parallel_workers](https://dev.mysql.com/doc/refman/8.0/en/replication-options-replica.html#sysvar_slave_parallel_workers)
    - [log_output](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_log_output)
    - [performance_schema_max_digest_length](https://dev.mysql.com/doc/refman/8.0/en/performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length)
    - [performance_schema_max_sql_text_length](https://dev.mysql.com/doc/refman/8.0/en/performance-schema-system-variables.html#sysvar_performance_schema_max_sql_text_length) 
 
- **Known Issues**

  - When you try to connect to the server, you receive error "ERROR 9107 (HY000): Only Azure Active Directory accounts are allowed to connect to server".

    Server parameter aad_auth_only was exposed in this month's deployment. Enabling server parameter aad_auth_only will block all non Azure Active Directory MySQL connections to your Azure Database for MySQL Flexible server. We're currently working on additional configurations required for Azure Active Directory authentication to be fully functional, and the feature will be available in the upcoming deployments. Don't enable the aad_auth_only parameter until then.

## June 2022

- **Known Issues**

  On a few servers where audit or slow logs are enabled, you may no longer see logs uploaded to data sinks configured under diagnostics settings. Verify whether your logs have the latest updated timestamp for the events based on the [data sink](./tutorial-query-performance-insights.md#set-up-diagnostics) you've configured. If your server is affected by this issue, open a [support ticket](https://azure.microsoft.com/support/create-ticket/) so that we can apply a quick fix on the server to resolve the issue.

## May 2022

- **Announcing Azure Database for MySQL - Flexible Server for business-critical workloads**
    Azure Database for MySQL – Flexible Server Business Critical service tier is generally available. The Business Critical service tier is ideal for Tier 1 production workloads that require low latency, high concurrency, fast failover, and high scalability, such as gaming, e-commerce, and Internet-scale applications, to learn more about [Business Critical service Tier](https://techcommunity.microsoft.com/t5/azure-database-for-mysql-blog/announcing-azure-database-for-mysql-flexible-server-for-business/ba-p/3361718).

- **Announcing the addition of new Burstable compute instances for Azure Database for MySQL - Flexible Server**
    We're announcing the addition of new Burstable compute instances to support customers’ auto-scaling compute requirements from 1 vCore up to 20 vCores. learn more about [Compute Option for Azure Database for MySQL - Flexible Server](./concepts-compute-storage.md).

- **Known issues**
  - The Reserved instances (RI) feature in Azure Database for MySQL – Flexible server isn't working properly for the Business Critical service tier after its rebranding from the Memory Optimized service tier. Specifically, instance reservation has stopped working, and we're currently working to fix the issue.
  - Private DNS integration details aren't displayed on a few Azure Database for MySQL Database flexible servers, which have HA option enabled. This issue doesn't have any impact on availability of the server or name resolution. We're working on a permanent fix to resolve the issue, and it will be available in the next deployment. Meanwhile, if you want to view the Private DNS Zone details, you can either search under [Private DNS zones](../../dns/private-dns-getstarted-portal.md) in the Azure portal or you can perform a [manual failover](concepts-high-availability.md#planned-forced-failover) of the HA enabled flexible server and refresh the Azure portal.

## April 2022

- **Minor version upgrade for Azure Database for MySQL - Flexible server to 8.0.28**
    Azure Database for MySQL - Flexible Server 8.0 now is running on minor version 8.0.28*, to learn more about changes coming in this minor version [visit Changes in MySQL 8.0.28 (2022-01-18, General Availability)](https://dev.mysql.com/doc/relnotes/mysql/8.0/en/news-8-0-28.html)

- **Minor version upgrade for Azure Database for MySQL - Flexible server to 5.7.37**
    Azure Database for MySQL - Flexible Server 5.7 is now running on minor version 5.7.37*, to learn more about changes coming in this minor version [visit Changes in MySQL 5.7.37 (2022-01-18, General Availability](https://dev.mysql.com/doc/relnotes/mysql/5.7/en/news-5-7-37.html)

    > [!Note]
    > Please note that some regions are still running older minor versions of the Azure Database for MySQL and will be patched by end of April 2022.

- **Deprecation of TLSv1 or TLSv1.1 protocols with Azure Database for MySQL - Flexible Server (8.0.28)**

    Starting version 8.0.28, the MySQL community edition supports TLS protocol TLSv1.2 or TLSv1.3 only. Azure Database for MySQL – Flexible Server will also stop supporting TLSv1 and TLSv1.1 protocols to align with modern security standards. You'll no longer be able to configure TLSv1 or TLSv1.1 from the server parameter pane for newly created resources and previously created resources. The default will be TLSv1.2. Resources created before the upgrade will still support communication through TLS protocol TLSv1 or TLSv1.1 through  May 1, 2022.

## March 2022

This release of Azure Database for MySQL - Flexible Server includes the following updates.

- **Migrate from locally redundant backup storage to geo-redundant backup storage for existing flexible server**
    Azure Database for MySQL - Flexible Server now provides the added flexibility to migrate to geo-redundant backup storage from locally redundant backup storage post server-create to provide higher data resiliency. Enabling geo-redundancy via the server's Compute + Storage page empowers customers to recover their existing flexible servers from a geographic disaster or regional failure when they can’t access the server in the primary region. With this feature enabled for their existing servers, customers can perform geo-restore and deploy a new server to the geo-paired Azure region using the original server’s latest available geo-redundant backup. [Learn more](concepts-backup-restore.md)

- **Simulate disaster recovery drills for your stopped servers**
    Azure Database for MySQL - Flexible Server now provides the ability to perform geo-restore on stopped servers helping users simulate disaster recovery drills for their workloads to estimate impact and recovery time.This will help users plan better to meet their disaster recovery and business continuity objectives by using geo-redundancy feature offered by Azure Database for MySQL Flexible Server. [Learn more](how-to-restore-server-cli.md)

## January 2022

This release of Azure Database for MySQL - Flexible Server includes the following updates.

- **All Operations are disabled on Stopped Azure Database for MySQL - Flexible Server**
    Operations on servers that are in a [Stop](concept-servers.md#stopstart-an-azure-database-for-mysql-flexible-server) state are disabled and show as inactive in the Azure portal. Operations that aren't supported on stopped servers include changing the pricing tier, number of vCores, storage size or IOPS, backup retention day, server tag, the server password, server parameters, storage autogrow, GEO backup, HA, and user identity.

- **Availability in three additional Azure regions**

   The public preview of Azure Database for MySQL - Flexible Server is now available in the following Azure regions:
  - China East 2
  - China North 2
  
- **Reserving 36 IOPs for Azure Database for MySQL Flexible Server which has HA enabled**

    We're adding 36 IOPs and reserving it for supporting standby failover operation on the servers, which has High Availability enabled. This IOPs is in addition to the configured IOPs on your servers, so more charges per month would apply based on your Azure region. The extra IOPS help us ensure our commitment to providing smooth failover experience from primary to standby replica.The extra charge can be estimated by navigating to the [Azure Database for MySQL – Flexible Server pricing page](https://azure.microsoft.com/pricing/details/mysql/flexible-server), choosing the Azure region for your server, and multiplying IOPs/month cost by 36 IOPs. For example: if your server is hosted in East US, the extra IO costs, which you can expect are $0.05*36 = $1.8 USD per month.

- **Bug fixes**

    Restart workflow struck issue with servers with HA, and Geo-redundant backup option enabled is fixed.

- **Known issues**

  - When you're using ARM templates for provisioning or configuration changes for HA enabled servers, if a single deployment is made to enable/disable HA and along with other server properties like backup redundancy, storage etc., then deployment would fail. You can mitigate it by submitting the deployment request separately to enable\disable and configuration changes. You wouldn’t have an issue with Portal or Azure CLI, as these requests are already separated.

  - When you're viewing automated backups for a HA enabled server on the Backup and Restore page, if at some point in time a forced or automatic failover is performed, you may lose viewing rights to the server's backups on the Backup and Restore page. Despite the invisibility of information regarding backups on the portal, the flexible server is successfully taking daily automated backups for the server in the backend. The server can be restored to any point within the retention period.  

## November 2021

- **General Availability of Azure Database for MySQL - Flexible Server**

  Azure Database for MySQL - Flexible Server is now **General Availability** in more than [30 Azure regions](overview.md) worldwide.

- **View available full backups in Azure portal**
  
  A dedicated Backup and Restore option is now available in the Azure portal. This page lists the backups available within the server’s retention period, effectively providing you with single pane view for managing a server’s backups and consequent restores. You can use this option to:
     1) View the completion timestamps for all available full backups within the server’s retention period
     2) Perform restore operations using these full backups
  
- **Fastest restore points**
  
  With the fastest restore point option, you can restore a Flexible Server instance in the fastest time possible on a given day within the server’s retention period. This restore operation restores the full snapshot backup without requiring restore or recovery of logs. With fastest restore point, customers will see three options while performing point in time restores from Azure portal viz latest restore point, custom restore point and fastest restore point. [Learn more](concepts-backup-restore.md#point-in-time-restore)
  
- **FAQ in the Azure portal**

  The Backup and Restore page includes section dedicated to listing your most frequently asked questions, together with answers. This should provide you with answers to most questions about backup directly within the Azure portal. In addition, selecting the question mark icon for FAQs on the top menu provides access to even more related detail.

- **Restore a deleted Flexible server**

  The service now allows you to recover a deleted MySQL flexible server resource within five days from the time of server deletion. For a detailed guide on how to restore a deleted server, [refer documented steps](../flexible-server/how-to-restore-dropped-server.md). To protect server resources post deployment from accidental deletion or unexpected changes, we recommend administrators to use [management locks](../../azure-resource-manager/management/lock-resources.md).

- **Known issues**

    On servers where we have HA and  Geo-redundant backup option enabled, we found a rare issue encountered by a race condition, which blocks the restart of the standby server to finish. As a result of this issue, when you fail over the  HA enabled Azure database for MySQL - Flexible server MySQL Instance may get stuck in restarting state for a long time. The fix will be deployed to the production in the next deployment cycle.

## October 2021

- **Thread pools are now available for Azure Database for MySQL – Flexible Server**

    Thread pools enhance the scalability of the Azure Database for MySQL – Flexible Server. By using a thread pool, users can now optimize performance, achieve better throughput, and lower latency for high concurrent workloads. [Learn more](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/achieve-up-to-a-50-performance-boost-in-azure-database-for-mysql/ba-p/2909691).

- **Geo-redundant backup restore to geo-paired region for DR scenarios**

    The service now provides the added flexibility to choose geo-redundant backup storage to provide higher data resiliency. Enabling geo-redundancy empowers customers to recover from a geographic disaster or regional failure when they can’t access the server in the primary region. With this feature enabled, customers can perform geo-restore and deploy a new server to the geo-paired geographic region using the original server’s latest available geo-redundant backup. [Learn more](../flexible-server/concepts-backup-restore.md).

- **Availability Zones Selection when creating Read replicas**

    When creating Read replica, you have an option to select the Availability Zones location of your choice. An Availability Zone is a high availability offering that protects your applications and data from datacenter failures. Availability Zones are unique physical locations within an Azure region. [Learn more](../flexible-server/concepts-read-replicas.md).

- **Read replicas in Azure Database for MySQL - Flexible servers will no longer be available on Burstable SKUs**

    If you have an existing Azure Database for MySQL - Flexible Server with read replica enabled, you’ll have to scale up your server to either General Purpose or Business Critical pricing tiers or delete the read replica within 60 days. After the 60-day period, while you can continue to use the primary server for your read-write operations, replication to read replica servers will be stopped. For newly created servers, read replica option will be available only for the General Purpose and Business Critical pricing tiers.  

- **Monitoring Azure Database for MySQL - Flexible Server with Azure Monitor Workbooks**

     Azure Database for MySQL - Flexible Server is now integrated with Azure Monitor Workbooks. Workbooks provide a flexible canvas for data analysis and the creation of rich visual reports within the Azure portal. With this integration, the server has link to workbooks and few sample templates, which help to monitor the service at scale. These templates can be edited, customized to customer requirements and pinned to dashboard to create a focused and organized view of Azure resources. [Query Performance Insights](./tutorial-query-performance-insights.md), [Auditing](./tutorial-configure-audit.md), and Instance Overview templates are currently available. [Learn more](./concepts-workbooks.md).

- **Prepay for Azure Database for MySQL compute resources with reserved instances**

    Azure Database for MySQL - Flexible Server now helps you save money by prepaying for compute resources compared to pay-as-you-go prices. With Azure Database for MySQL reserved instances, you make an upfront commitment on MySQL server for a one or three year period to get a significant discount on the compute costs. You can also exchange a reservation from Azure Database for MySQL - Single Server with Flexible Server. [Learn more](../concept-reserved-pricing.md).

- **Stopping the server for up to 30 days while the server is not in use**

    Azure Database for MySQL Flexible Server now gives you the ability to Stop the server for up to 30 days when not in use and Start the server within this time when you’re ready to resume your development. This enables you to develop at your own pace and save development costs on the database servers by paying for the resources only when they are in use. This is important for dev-test workloads and when you’re only using the server for part of the day. When you stop the server, all active connections will be dropped. When the server is in the Stopped state, the server's compute isn’t billed. However, storage continues to be billed as the server's storage remains to ensure that data files are available when the server is started again. [Learn more](concept-servers.md#stopstart-an-azure-database-for-mysql-flexible-server)

- **Terraform Support for MySQL Flexible Server**

    Terraform support for MySQL Flexible Server is now released  with the [latest v2.81.0 release of azurerm](https://github.com/hashicorp/terraform-provider-azurerm/blob/v2.81.0/CHANGELOG.md). The detailed reference document for provisioning and managing a MySQL Flexible Server using Terraform can be found [here](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/mysql_flexible_server). Any bugs or known issues can be found or report [here](https://github.com/hashicorp/terraform-provider-azurerm/issues).

- **Static Parameter innodb_log_file_size is now Configurable**

  - [innodb_log_file_size](https://dev.mysql.com/doc/refman/8.0/en/innodb-parameters.html#sysvar_innodb_log_file_size) can now be configured to any of these values: 256 MB, 512 MB, 1 GB, or 2 GB. Because it's a static parameter, it will require a server restart. If you’ve changed the parameter innodb_log_file_size from default, check if the value of "show global status like 'innodb_buffer_pool_pages_dirty'" stays at 0 for 30 seconds to avoid restart delay. See [Server parameters in Azure Database for MySQL](./concepts-server-parameters.md) to learn more.

- **Availability in two additional Azure regions**

   Azure Database for MySQL - Flexible Server is now available in the following Azure regions:

  - US West 3
  - North Central US
     [Learn more](overview.md#azure-regions).

- **Known Issues**
  - When a primary Azure region is down, one can’t create geo-redundant servers in its geo-paired region as storage can’t be provisioned in the primary Azure region. One must wait for the primary region to be up to provision geo-redundant servers in the geo-paired region.

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

  Flexible Server now supports enabling validate_password and caching_sha2_password plugins in preview. Email us at AskAzureDBforMySQL@service.microsoft.com

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
  - In a rare scenario and after HA failover, the primary server is in read_only mode. Resolve the issue by updating “read_only” value from the server parameters page to OFF.
  - After successfully scaling Compute on the Compute + Storage page, IOPS are reset to the SKU default. Customers can work around the issue by rescaling IOPs on the Compute + Storage page to desired value (previously set) post the compute deployment and consequent IOPS reset.

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

- **GitHub Actions support with Azure CLI**

  Flexible Server CLI now allows customers to automate workflows to deploy updates with GitHub Actions. This feature helps set up and deploy database updates with MySQL GitHub Actions workflow. These CLI commands assist with setting up a repository to enable continuous deployment for ease of development. [Learn more](/cli/azure/mysql/flexible-server/deploy).

- **Zone redundant HA forced failover fixes**

  This release includes fixes for known issues related to forced failover to ensure that server parameters and more IOPS changes are persisted across failovers.

- **Known issues**

  - Trying to perform a compute scale up or scale down operation on an existing server with less than 20 GB of storage provisioned won't complete successfully. Resolve the issue by scaling up the provisioned storage to 20 GB and retrying the compute scaling operation.

## May 2021

This release of Azure Database for MySQL - Flexible Server includes the following updates.

- **Extended regional availability (France Central, Brazil South, and Switzerland North)**

    The public preview of Azure Database for MySQL - Flexible Server is now available in the France Central, Brazil South, and Switzerland North regions. [Learn more](overview.md#azure-regions).

- **SSL/TLS 1.2 enforcement can be disabled**

   This release provides the enhanced flexibility to customize enforcement of SSL and minimum TLS version. To learn more, see [Connect to Azure Database for MySQL - Flexible Server with encrypted connections](how-to-connect-tls-ssl.md).

- **Zone redundant HA available in UK South and Japan East region**

   Azure Database for MySQL - Flexible Server now offers zone-redundant high availability in two more regions: UK South and Japan East. [Learn more](overview.md#azure-regions).

- **Known issues**

  - Additional IOPs changes don’t take effect in zone redundant HA enabled servers. Customers can work around the issue by disabling HA, scaling IOPs, and the re-enabling zone redundant HA.
  - After force failover, the standby availability zone is inaccurately reflected in the portal. (No workaround)
  - Server parameter changes don't take effect in zone redundant HA enabled server after forced failover. (No workaround)

## April 2021

This release of Azure Database for MySQL - Flexible Server includes the following updates.

- **Ability to force failover to standby server with zone redundant high availability released**

  Customers can now manually force a failover to test functionality with their application scenarios, which can help them to prepare for any outages. [Learn more](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/forced-failover-for-azure-database-for-mysql-flexible-server/ba-p/2280671).

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

  Customers can now specify their preferred Availability zone at the time of server creation. This functionality allows customers to collocate their applications hosted on Azure VM, Virtual Machine Scale Set, or AKS and database in the same Availability zones to minimize database latency and improve performance. [Learn more](quickstart-create-server-portal.md#create-an-azure-database-for-mysql-flexible-server).

- **Performance fixes for issues when running flexible server in virtual network with private access**

  Before this release, the performance of flexible server degraded significantly when running in virtual network configuration. This release includes the fixes for the issue, which will allow users to see improved performance on flexible server in virtual network.

- **Known issues**

  - SSL\TLS 1.2 is enforced and can’t be disabled. (No workarounds)
  - There are intermittent provisioning failures for servers provisioned in a VNet. The workaround is to retry the server provisioning until it succeeds.

## February 2021

This release of Azure Database for MySQL - Flexible Server includes the following updates.

- **Additional IOPS feature released**

  Azure Database for MySQL - Flexible Server supports provisioning more [IOPS](concepts-compute-storage.md#iops) independent of the storage provisioned. Customers can use this feature to increase or decrease the number of IOPS anytime based on their workload requirements.

- **Known issues**

  The performance of Azure Database for MySQL – Flexible Server degrades with private access-virtual network isolation (No workaround).

## January 2021

This release of Azure Database for MySQL - Flexible Server includes the following updates.

- **Up to 10 read replicas for MySQL - Flexible Server**

  Flexible Server now supports asynchronous replication of data from one Azure Database for MySQL server (the 'source') to up to 10 Azure Database for MySQL servers (the 'replicas') in the same region. This functionality enables read-heavy workloads to scale out and be balanced across replica servers according to a user's preferences. [Learn more](concepts-read-replicas.md).

## Contacts

If you have questions about or suggestions for working with Azure Database for MySQL, consider the following points of contact as appropriate:

- To contact Azure Support, [file a ticket from the Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- To fix an issue with your account, file a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.
- To provide feedback or to request new features, email us at AskAzureDBforMySQL@service.microsoft.com.

## Next steps

- Learn more about [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/mysql/server/).
- Browse the [public documentation](index.yml) for Azure Database for MySQL – Flexible Server.
- Review details on [troubleshooting common migration errors](../howto-troubleshoot-common-errors.md).