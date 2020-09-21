---
title: Choose the right PostgreSQL server option in Azure
description: Provides guidelines for choosing the right PostgreSQL server option for your deployments.
author: sunilagarwal
ms.author: sunila
ms.custom: mvc
ms.service: postgresql
ms.topic: overview
ms.date: 09/21/2020
---
# Choose the right PostgreSQL server option in Azure

With Azure, your PostgreSQL Server workloads can run in a hosted virtual machine infrastructure as a service (IaaS) or as a hosted platform as a service (PaaS). PaaS has multiple deployment options, each with multiple service tiers. When you choose between IaaS and PaaS, you must decide if you want to manage your database, apply patches, and make backups, or if you want to delegate these operations to Azure.

When making your decision, consider the following three options in PaaS or alternatively running on Azure VMs (IaaS)
- [Azure database for PostgreSQL Single Server](./overview-single-server.md)
- [Azure database for PostgreSQL Flexible Server](./flexible-server/overview.md)
- [Azure database for PostgreSQL Hyperscale (Citus)]()

**PostgreSQL on Azure VMs** option falls into the industry category of IaaS. With this service, you can run PostgreSQL Server inside a fully managed virtual machine on the Azure cloud platform. All recent versions and editions of PostgreSQL can be installed on an IaaS virtual machine. In the most significant difference from Azure Database for PostgreSQL, PostgreSQL on Azure VMs offers control over the database engine. However, this control comes at the cost of responsibility to manage the VMs and many database administration (DBA) tasks. These tasks include maintaining and patching database servers, database recovery, and high-availability design.

The main differences between these options are listed in the following table:

| **Attribute** | **Postgres on Azure VMs** | **PostgreSQL as PaaS** |
| ----- | ----- | ----- |
| <B> Availability SLA |- 99.99% with availability sets <br> - 99.95% with single VMs | - Single Server – 99.99% <br> - Flexible Server–Not available during Preview <br> - Hyperscale (Citus) - 99.95% (when high availability is enabled)|
| <B> OS and PostgreSQL patching | - Customer managed | - Single Server – Automatic <br> - Flexible Server – Automatic with optional customer managed window <br> - Hyperscale (Citus) – Automatic |
| <B> High availability | - Customers architect, implement, test, and maintain high availability. Capabilities might include clustering, replication etc. | - Single Server:  built-in <br> - Flexible Server: built-in <br> - Hyperscale (Citus): built with standby |
| <B> Zone Redundancy | - Azure VMs can be set up to run in different availability zones. For an on-premises solution, customers must create, manage, and maintain their own secondary data center.	| - Single Server: No <br> - Flexible Server: Yes <br> - Hyperscale (Citus): No |
| <B> Hybrid Scenario | - Customer managed |- Single Server: Read-replica <br> - Flexible Server: Not available during Preview <br> - Hyperscale (Citus): No |
| <B> Backup and Restore | - Customer Managed | - Single Server: built-in with user configuration for local and geo <br> - Flexible Server: built-in with user configuration on zone-redundant storage <br> - Hyperscale (Citus): built-in |
| <B> Monitoring Database Operations | - Customer Managed | - Single Server, Flexible Server, and Hyperscale (Citus): All offer customers the ability to set alerts on the database operation and act upon reaching thresholds. |
| <B> Advanced Threat Protection | - Customers must build this protection for themselves. |- Single Server: Yes <br> - Flexible Server: Not available during Preview <br> - Hyperscale (Citus): No |
| <B> Disaster Recovery | - Customer Managed | - Single Server: Geo redundant backup and geo read-replica <br> - Flexible Server: Not available during Preview <br> - Hyperscale (Citus): No |
| <B> Intelligent Performance | - Customer Managed | - Single Server: Yes <br> - Flexible Server: Not available during Preview <br> - Hyperscale (Citus): No |

## Total cost of ownership (TCO)

TCO is often the primary consideration that determines the best solution for hosting your databases. This is true whether you're a startup with little cash or a team in an established company that operates under tight budget constraints. This section describes billing and licensing basics in Azure as they apply to Azure Database for PostgreSQL and PostgreSQL on Azure VMs.

## Billing

Azure Database for PostgreSQL is currently available as a service in several tiers with different prices for resources. All resources are billed hourly at a fixed rate. For the latest information on the currently supported service tiers, compute sizes, and storage amounts, see [pricing page](https://azure.microsoft.com/pricing/details/postgresql/server/) You can dynamically adjust service tiers and compute sizes to match your application's varied throughput needs. You're billed for outgoing Internet traffic at regular [data transfer rates](https://azure.microsoft.com/pricing/details/data-transfers/).

With Azure Database for PostgreSQL, Microsoft automatically configures, patches, and upgrades the database software. These automated actions reduce your administration costs. Also, Azure Database for PostgreSQL has [automated backup-link]() capabilities. These capabilities help you achieve significant cost savings, especially when you have a large number of databases. In contrast, with PostgreSQL on Azure VMs you can choose and run any PostgreSQL version. However, you need to pay for the provisioned VM, storage cost associated with the data, backup, monitoring data and log storage and the costs for the specific PostgreSQL license type used (if any).

Azure Database for PostgreSQL provides built-in high availability for any kind of node-level interruption while still maintaining the 99.99% SLA guarantee for the service. However, for database high availability within VMs, you use the high availability options like [Streaming Replication](https://www.postgresql.org/docs/12/warm-standby.html#STREAMING-REPLICATION) that are available on a PostgreSQL database. Using a supported high availability option doesn't provide an additional SLA. But it does let you achieve greater than 99.99% database availability at additional cost and administrative overhead.

For more information on pricing, see the following articles:
- [Azure Database for PostgreSQL pricing](https://azure.microsoft.com/pricing/details/postgresql/server/)
- [Virtual machine pricing](https://azure.microsoft.com/pricing/details/virtual-machines/)
- [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/)

## Administration

For many businesses, the decision to transition to a cloud service is as much about offloading complexity of administration as it is about cost.

With IaaS, Microsoft:

- Administers the underlying infrastructure.
- Provides automated patching for underlying hardware and OS

With PaaS, Microsoft:

- Administers the underlying infrastructure.
- Provides automated patching for underlying hardware, OS and database engine.
- Manages high availability of the database.
- Automatically performs backups and replicates all data to provide disaster recovery.
- Encrypts the data at rest and in motion by default.
- Monitors your server and provides features for query performance insights and performance recommendations.

With Azure Database for PostgreSQL, you can continue to administer your database. But you no longer need to manage the database engine, the operating system, or the hardware. Examples of items you can continue to administer include:

- Databases
- Sign-in
- Index tuning
- Query tuning
- Auditing
- Security

Additionally, configuring high availability to another data center requires minimal to no configuration or administration.

- With PostgreSQL on Azure VMs, you have full control over the operating system and the PostgreSQL server instance configuration. With a VM, you decide when to update or upgrade the operating system and database software and what patches to apply. You also decide when to install any additional software such as an antivirus application. Some automated features are provided to greatly simplify patching, backup, and high availability. You can control the size of the VM, the number of disks, and their storage configurations. For more information, see [Virtual machine and cloud service sizes for Azure](https://docs.microsoft.com/azure/virtual-machines/windows/sizes).

## Time to move to Azure PostgreSQL Service (PaaS)

- Azure Database for PostgreSQL is the right solution for cloud-designed applications when developer productivity and fast time to market for new solutions are critical. With programmatic functionality that is like DBA, the service is suitable for cloud architects and developers because it lowers the need for managing the underlying operating system and database.

- When you want to avoid the time and expense of acquiring new on-premises hardware, PostgreSQL on Azure VMs is the right solution for applications that require a granular control and customization of PostgreSQL engine not supported by the service or requiring access of the underlying OS.

## Next steps

- See Azure Database for [PostgreSQL pricing](https://azure.microsoft.com/pricing/details/postgresql/server/).
- Get started by creating your first server.

