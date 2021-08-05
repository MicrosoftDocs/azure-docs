---
title: What's new in Azure Database for MySQL - Flexible Server
description: Learn about recent updates to Azure Database for MySQL - Flexible Server, a relational database service in the Microsoft cloud based on the MySQL Community Edition.
author: hjtoland3
ms.service: mysql
ms.author: jtoland
ms.custom: mvc
ms.topic: conceptual
ms.date: 07/28/2021
---

# What's new in Azure Database for MySQL - Flexible Server (Preview)?

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

[Azure Database for MySQL - Flexible Server](./overview.md#azure-database-for-mysql---flexible-server-preview) is a deployment mode that's designed to provide more granular control and flexibility over database management functions and configuration settings than does the Single Server deployment mode. The service currently supports community version of MySQL 5.7 and 8.0.

This article summarizes new releases and features in Azure Database for MySQL - Flexible Server beginning in January 2021. Listings appear in reverse chronological order, with the most recent updates first.

## July 2021

This release of Azure Database for MySQL - Flexible Server includes the following updates.

- **Online migration from Single Server to Flexible Server**

  Customers can now migrate an instance of Azure Database for MySQL – Single Server to Flexible Server with minimum downtime to their applications by using Data-in Replication. For detailed, step-by-step instructions, see [Migrate Azure Database for MySQL – Single Server to Flexible Server with minimal downtime](https://docs.microsoft.com/azure/mysql/howto-migrate-single-flexible-minimum-downtime).

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

  As of June 15, 2021, the [Azure free account](https://azure.microsoft.com/free/) provides customers with up to 12 months of free access to Azure Database for MySQL – Flexible Server with 750 hours of usage and 32 GB of storage per month. Customers can take advantage of this offer to develop and deploy applications that use Azure Database for MySQL – Flexible Server. [Learn more](https://go.microsoft.com/fwlink/?linkid=2165892).

- **Storage auto-grow**

  Storage auto-grow prevents a server from running out of storage and becoming read-only. If storage auto grow is enabled, the storage automatically grows without impacting the workload. Beginning June 21, 2021, all newly created servers will have storage auto-grow enabled by default. [Learn more](concepts-compute-storage.md#storage-auto-grow).

- **Data-in Replication**

    Flexible Server now supports [Data-in Replication](concepts-data-in-replication.md). Use this feature to synchronize and migrate data from a MySQL server running on-premises, in virtual machines, on Azure Database for MySQL Single Server, or on database services outside Azure to Azure Database for MySQL – Flexible Server. Learn more about [How to configure Data-in Replication](how-to-data-in-replication.md).

- **GitHub actions support with Azure CLI**

  Flexible Server CLI now allows customers to automate workflows to deploy updates with GitHub actions. This feature helps set up and deploy database updates with MySQL GitHub action workflow. These CLI commands assist with setting up a repository to enable continuous deployment for ease of development. [Learn more](/cli/azure/mysql/flexible-server/deploy?view=azure-cli-latest&preserve-view=true).

- **Zone redundant HA forced failover fixes**

  This release includes fixes for known issues related to forced failover to ensure that server parameters and additional IOPS changes are persisted across failovers.

- **Known issue**

  - If a client application trying to connect to an instance of Flexible Server is in a peered virtual network (VNet), the application may not be able to connect using the Flexible Server *servername* because the application can't resolve the DNS name for the Flexible Server instance from a peered VNet. [Learn more](concepts-networking.md#connecting-from-peered-vnets-in-same-azure-region).
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

  Flexible Server now supports asynchronous replication of data from one Azure Database for MySQL server (the ‘source’) to up to 10 Azure Database for MySQL servers (the ‘replicas’) in the same region. This functionality enables read-heavy workloads to scale out and be balanced across replica servers according to a user's preferences. [Learn more](concepts-read-replicas.md).

## Contacts

If you have questions about or suggestions for working with Azure Database for MySQL, consider the following points of contact as appropriate:

- To contact Azure Support, [file a ticket from the Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- To fix an issue with your account, file a [support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.
- To provide feedback or to request new features, create an entry via [UserVoice](https://feedback.azure.com/forums/597982-azure-database-for-mysql).

## Next steps

- Learn more about [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/mysql/server/).
- Browse the [public documentation](index.yml) for Azure Database for MySQL – Flexible Server.
- Review details on [troubleshooting common migration errors](../howto-troubleshoot-common-errors.md).
