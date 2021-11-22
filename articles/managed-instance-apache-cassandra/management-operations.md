---
title: Management operations in Azure Managed Instance for Apache Cassandra
description: Learn about the management operations supported by Azure Managed Instance for Apache Cassandra. It also explains separation of responsibilities between the Azure support team and customers when maintaining standalone and hybrid clusters.
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: overview
ms.date: 11/02/2021
ms.custom: ignite-fall-2021
---

# Management operations in Azure Managed Instance for Apache Cassandra

Azure Managed Instance for Apache Cassandra provides automated deployment and scaling operations for managed open-source Apache Cassandra data centers. This article defines the management operations and features provided by the service. It also explains the separation of responsibilities between the Azure support team and customers when maintaining standalone and [hybrid](configure-hybrid-cluster.md) clusters.

## Patching

* Operating System-level patches are done automatically at approximately 2-week cadence.

* Apache Cassandra software-level patches are done when security vulnerabilities are identified. The patching cadence may vary.

* During patching, machines are rebooted one rack at a time. You should not experience any degradation at the application side as long as **quorum ALL setting is not being used**, and the replication factor is **3 or higher**.

* The version in Apache Cassandra is in the format `X.Y.Z`. You can control the deployment of major (X) and minor (Y) versions manually via service tools. Whereas the Cassandra patches (Z) that may be required for that major/minor version combination are done automatically.  

## Maintenance

* The [Nodetool repair](https://docs.datastax.com/en/cassandra-oss/3.x/cassandra/tools/toolsRepair.html) is automatically run by the service using [reaper](http://cassandra-reaper.io/). This tool is run once every week. You may wish to disable it if using your own service for a [hybrid deployment](configure-hybrid-cluster.md).

* Node health monitoring consists of:

  * Actively monitoring each node's membership in the Cassandra ring.
  * Actively monitoring virtual machines to identify and fix problems with Azure, Virtual Machines, storage, Linux, and the support software.

* You are responsible for any CPU, disk, and network usage problems, which may arise due to your Cassandra usage. Some examples of such issues include:

  * Inefficient query operations.
  * Throughput that exceeds capacity.
  * Ingesting data that exceeds storage capacity.
  * Incorrect keyspace configuration settings.
  * Poor data model or partition key strategy.

## Backup and restore

Snapshot backups are enabled by default, and taken every 4 hours. Backups are stored in an internal Azure blob storage account, and are retained for up to 2 days (48 hours). This is no cost for backups. To restore from a backup, file a [support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.

> [!WARNING]
> Backups are intended for accidental deletion scenarios, and are not geo-redundant. They are therefore not recommended for use as a disaster recovery (DR) strategy in case of a total regional outage. To safeguard against region-wide outages, we recommend [multi-region](creare-multi-region-cluster.md) deployments.  

## Security

Azure Managed Instance for Apache Cassandra provides many built-in explicit security controls and features:

* Hardened Linux Virtual Machine images with a controlled supply chain.
* Common Vulnerability & Exposure (CVE) monitoring at the Operating System level.
* Certificate rotation for both Apache Cassandra and Prometheus software hosted on the managed Virtual Machines.
* Active vulnerability scanning.
* Active virus scanning.
* Secure coding practices.

## Hybrid support

When a [hybrid](configure-hybrid-cluster.md) cluster is configured, automated reaper operations running in the service will benefit the whole cluster. This includes data centers that are not provisioned by the service. Outside this, it is your responsibility to maintain your on-premise or externally hosted data center.

## Next steps

Get started with one of our quickstarts:
* [Create a managed instance cluster from the Azure portal](create-cluster-portal.md)
* [Deploy a Managed Apache Spark Cluster with Azure Databricks](deploy-cluster-databricks.md)
* [Manage Azure Managed Instance for Apache Cassandra resources using Azure CLI](manage-resources-cli.md)
