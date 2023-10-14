---
title: Reliability recommendations
description: Full list of available reliability recommendations in Advisor.
author: mabrahms
ms.author: v-mabrahms
ms.topic: article
ms.date: 09/27/2023
---

# Reliability recommendations

Azure Advisor helps you ensure and improve the continuity of your business-critical applications. You can get reliability recommendations on the **Reliability** tab on the Advisor dashboard.

1. Sign in to the [**Azure portal**](https://portal.azure.com).

1. Search for and select [**Advisor**](https://aka.ms/azureadvisordashboard) from any page.

1. On the **Advisor** dashboard, select the **Reliability** tab.

## AI Services

### You are close to exceeding storage quota of 2GB. Create a Standard search service

You're close to exceeding storage quota of 2GB. Create a Standard search service. Indexing operations stop working when storage quota is exceeded.

Learn more about [Service limits in Azure Cognitive Search](/azure/search/search-limits-quotas-capacity).

### You are close to exceeding storage quota of 50MB. Create a Basic or Standard search service

You're close to exceeding storage quota of 50MB. Create a Basic or Standard search service. Indexing operations stop working when storage quota is exceeded.

Learn more about [Service limits in Azure Cognitive Search](/azure/search/search-limits-quotas-capacity).

### You are close to exceeding your available storage quota. Add more partitions if you need more storage

You're close to exceeding your available storage quota. Add extra partitions if you need more storage. After exceeding storage quota, you can still query, but indexing operations no longer work.

Learn more about [Service limits in Azure Cognitive Search](/azure/search/search-limits-quotas-capacity)

### Quota Exceeded for this resource

We have detected that the quota for your resource has been exceeded.  You can wait for it to automatically get replenished soon, or to get unblocked and use the resource again now, you can upgrade it to a paid SKU.

Learn more about [Cognitive Service - CognitiveServiceQuotaExceeded (Quota Exceeded for this resource)](/azure/cognitive-services/plan-manage-costs#pay-as-you-go).

### Upgrade your application to use the latest API version from Azure OpenAI

We have detected that you have an Azure OpenAI resource that is being used with an older API version. Use the latest REST API version to take advantage of the latest features and functionality.

Learn more about [Cognitive Service - CogSvcApiVersionOpenAI (Upgrade your application to use the latest API version from Azure OpenAI)](/azure/cognitive-services/openai/reference).

### Upgrade your application to use the latest API version from Azure OpenAI

We have detected that you have an Azure OpenAI resource that is being used with an older API version. Use the latest REST API version to take advantage of the latest features and functionality.

Learn more about [Cognitive Service - API version: OpenAI (Upgrade your application to use the latest API version from Azure OpenAI)](/azure/cognitive-services/openai/reference).



## Analytics

### Your cluster running Ubuntu 16.04 is out of support

We detected that your HDInsight cluster still uses Ubuntu 16.04 LTS. End of support for Azure HDInsight clusters on Ubuntu 16.04 LTS began on November 30, 2022. Existing clusters run as is without support from Microsoft. Consider rebuilding your cluster with the latest images.

Learn more about [HDInsight cluster - ubuntu1604HdiClusters (Your cluster running Ubuntu 16.04 is out of support)](/azure/hdinsight/hdinsight-component-versioning#supported-hdinsight-versions).

### Upgrade your HDInsight cluster

We detected your cluster isn't using the latest image. We recommend customers to use the latest versions of HDInsight images as they bring in the best of open source updates, Azure updates and security fixes. HDInsight release happens every 30 to 60 days. Consider moving to the latest release.

Learn more about [HDInsight cluster - upgradeHDInsightCluster (Upgrade your HDInsight Cluster)](/azure/hdinsight/hdinsight-release-notes).

### Your cluster was created one year ago

We detected your cluster was created one year ago. As part of the best practices, we recommend you to use the latest HDInsight images as they bring in the best of open source updates, Azure updates and security fixes. The recommended maximum duration for cluster upgrades is less than six months.

Learn more about [HDInsight cluster - clusterOlderThanAYear (Your cluster was created one year ago)](/azure/hdinsight/hdinsight-overview-before-you-start#keep-your-clusters-up-to-date).

### Your Kafka cluster disks are almost full

The data disks used by Kafka brokers in your HDInsight cluster are almost full. When that happens, the Apache Kafka broker process can't start and fails because of the disk full error. To mitigate, find the retention time for every topic, back up the files that are older and restart the brokers.

Learn more about [HDInsight cluster - KafkaDiskSpaceFull (Your Kafka Cluster Disks are almost full)](https://aka.ms/kafka-troubleshoot-full-disk).

### Creation of clusters under custom VNet requires more permission

Your clusters with custom VNet were created without VNet joining permission. Ensure that the users who perform create operations have permissions to the Microsoft.Network/virtualNetworks/subnets/join action before September 30, 2023.

Learn more about [HDInsight cluster - EnforceVNetJoinPermissionCheck (Creation of clusters under custom VNet requires more permission)](https://aka.ms/hdinsightEnforceVnet).

### Deprecation of Kafka 1.1 in HDInsight 4.0 Kafka cluster

Starting July 1, 2020, you can't create new Kafka clusters with Kafka 1.1 on HDInsight 4.0. Existing clusters run as is without support from Microsoft. Consider moving to Kafka 2.1 on HDInsight 4.0 by June 30 2020 to avoid potential system/support interruption.

Learn more about [HDInsight cluster - KafkaVersionRetirement (Deprecation of Kafka 1.1 in HDInsight 4.0 Kafka cluster)](https://aka.ms/hdiretirekafka).

### Deprecation of Older Spark Versions in HDInsight Spark cluster

Starting July 1, 2020, you can't create new Spark clusters with Spark 2.1 and 2.2 on HDInsight 3.6, and Spark 2.3 on HDInsight 4.0. Existing clusters run as is without support from Microsoft.

Learn more about [HDInsight cluster - SparkVersionRetirement (Deprecation of Older Spark Versions in HDInsight Spark cluster)](https://aka.ms/hdiretirespark).

### Enable critical updates to be applied to your HDInsight clusters

HDInsight service is applying an important certificate related update to your cluster. However, one or more policies in your subscription are preventing HDInsight service from creating or modifying network resources  associated with your clusters and applying this update. Take actions to allow HDInsight service to create or modify network resources such as Load balancer, Network interface and Public IP address, associated with your clusters before January 13, 2021 05:00 PM UTC. The HDInsight team is performing updates between January 13, 2021 05:00 PM UTC and January 16, 2021 05:00 PM UTC. Failure to apply this update might result in your clusters becoming unhealthy and unusable.

Learn more about [HDInsight cluster - GCSCertRotation (Enable critical updates to be applied to your HDInsight clusters)](../hdinsight/hdinsight-hadoop-provision-linux-clusters.md).

### Drop and recreate your HDInsight clusters to apply critical updates

The HDInsight service has attempted to apply a critical certificate update on all your running clusters. However, due to some custom configuration changes, we're unable to apply the certificate updates on some of your clusters.

Learn more about [HDInsight cluster - GCSCertRotationRound2 (Drop and recreate your HDInsight clusters to apply critical updates)](../hdinsight/hdinsight-hadoop-provision-linux-clusters.md).

### Drop and recreate your HDInsight clusters to apply critical updates

The HDInsight service has attempted to apply a critical certificate update on all your running clusters. However, due to some custom configuration changes, we're unable to apply the certificate updates on some of your clusters. Drop and recreate your cluster before January 25, 2021 to prevent the cluster from becoming unhealthy and unusable.

Learn more about [HDInsight cluster - GCSCertRotationR3DropRecreate (Drop and recreate your HDInsight clusters to apply critical updates)](../hdinsight/hdinsight-hadoop-provision-linux-clusters.md).

### Apply critical updates to your HDInsight clusters

The HDInsight service has attempted to apply a critical certificate update on all your running clusters. However, one or more policies in your subscription are preventing HDInsight service from creating or modifying network resources  associated with your clusters and applying this update. Remove or update your policy assignment to allow HDInsight service to create or modify network resources such as load balancer, network interface and public IP address, associated with your clusters. Do this before January 21, 2021 05:00 PM UTC when the HDInsight team is performing updates between January 21, 2021 05:00 PM UTC and January 23, 2021 05:00 PM UTC. To verify the policy update, you can try to create network resources in the same resource group and subnet where your cluster is. Failure to apply this update might result in your clusters becoming unhealthy and unusable. You can also drop and recreate your cluster before January 25, 2021 to prevent the cluster from becoming unhealthy and unusable. The HDInsight service sends another notification if we failed to apply the update to your clusters.

Learn more about [HDInsight cluster - GCSCertRotationR3PlanPatch (Apply critical updates to your HDInsight clusters)](../hdinsight/hdinsight-hadoop-provision-linux-clusters.md).

### Action required: Migrate your A8–A11 HDInsight cluster before 1 March 2021

You're receiving this notice because you have one or more active A8, A9, A10 or A11 HDInsight cluster. The A8-A11 virtual machines (VMs) are retired in all regions on 1 March 2021. After that date, all clusters using A8-A11 are deallocated. Migrate your affected clusters to another HDInsight supported VM (https://azure.microsoft.com/pricing/details/hdinsight/) before that date. For more information, see 'Learn More' link or contact us at askhdinsight@microsoft.com

Learn more about [HDInsight cluster - VM Deprecation (Action required: Migrate your A8–A11 HDInsight cluster before 1 March 2021)](https://azure.microsoft.com/updates/a8-a11-azure-virtual-machine-sizes-will-be-retired-on-march-1-2021/).



## Compute

### Cloud Services (classic) is retiring. Migrate off before 31 August 2024

Cloud Services (classic) is retiring. Migrate off before 31 August 2024 to avoid any loss of data or business continuity.

Learn more about [Resource - Cloud Services Retirement (Cloud Services (classic) is retiring. Migrate off before 31 August 2024)](https://aka.ms/ExternalRetirementEmailMay2022).

### Upgrade the standard disks attached to your premium-capable VM to premium disks

We have identified that you're using standard disks with your premium-capable virtual machines and we recommend you consider upgrading the standard disks to premium disks. For any single instance virtual machine using premium storage for all operating system disks and data disks, we guarantee virtual machine connectivity of at least 99.9%. Consider these factors when making your upgrade decision. The first is that upgrading requires a VM reboot and this process takes 3-5 minutes to complete. The second is if the VMs in the list are mission-critical production VMs, evaluate the improved availability against the cost of premium disks.

Learn more about [Virtual machine - MigrateStandardStorageAccountToPremium (Upgrade the standard disks attached to your premium-capable VM to premium disks)](https://aka.ms/aa_storagestandardtopremium_learnmore).

### Enable virtual machine replication to protect your applications from regional outage

Virtual machines that don't have replication enabled to another region aren't resilient to regional outages. Replicating the machines drastically reduce any adverse business impact during the time of an Azure region outage. We highly recommend enabling replication of all the business critical virtual machines from the following list so that in an event of an outage, you can quickly bring up your machines in remote Azure region.
Learn more about [Virtual machine - ASRUnprotectedVMs (Enable virtual machine replication to protect your applications from regional outage)](https://aka.ms/azure-site-recovery-dr-azure-vms).

### Upgrade VM from Premium Unmanaged Disks to Managed Disks at no extra cost

We have identified that your VM is using premium unmanaged disks that can be migrated to managed disks at no extra cost. Azure Managed Disks provides higher resiliency, simplified service management, higher scale target and more choices among several disk types. This upgrade can be done through the portal in less than 5 minutes.

Learn more about [Virtual machine - UpgradeVMToManagedDisksWithoutAdditionalCost (Upgrade VM from Premium Unmanaged Disks to Managed Disks at no extra cost)](https://aka.ms/md_overview).

### Update your outbound connectivity protocol to Service Tags for Azure Site Recovery

Using IP Address based filtering has been identified as a vulnerable way to control outbound connectivity for firewalls. We advise using Service Tags as an alternative for controlling connectivity. We highly recommend the use of Service Tags, to allow connectivity to Azure Site Recovery services for the machines.

Learn more about [Virtual machine - ASRUpdateOutboundConnectivityProtocolToServiceTags (Update your outbound connectivity protocol to Service Tags for Azure Site Recovery)](https://aka.ms/azure-site-recovery-using-service-tags).

### Update your firewall configurations to allow new RHUI 4 IPs

Your Virtual Machine Scale Sets start receiving package content from RHUI4 servers on October 12, 2023. If you're allowing RHUI 3 IPs [https://aka.ms/rhui-server-list] via firewall and proxy, allow the new RHUI 4 IPs [https://aka.ms/rhui-server-list] to continue receiving RHEL package updates.

Learn more about [Virtual machine - Rhui3ToRhui4MigrationV2 (Update your firewall configurations to allow new RHUI 4 IPs)](https://aka.ms/rhui-server-list).

### Virtual machines in your subscription are running on images that have been scheduled for deprecation

Virtual machines in your subscription are running on images that have been scheduled for deprecation. Once the image is deprecated, new VMs can't be created from the deprecated image. Upgrade to a newer version of the image to prevent disruption to your workloads.

Learn more about [Virtual machine - VMRunningDeprecatedOfferLevelImage (Virtual machines in your subscription are running on images that have been scheduled for deprecation)](https://aka.ms/DeprecatedImagesFAQ).

### Virtual machines in your subscription are running on images that have been scheduled for deprecation

Virtual machines in your subscription are running on images that have been scheduled for deprecation. Once the image is deprecated, new VMs can't be created from the deprecated image. Upgrade to a newer SKU of the image to prevent disruption to your workloads.

Learn more about [Virtual machine - VMRunningDeprecatedPlanLevelImage (Virtual machines in your subscription are running on images that have been scheduled for deprecation)](https://aka.ms/DeprecatedImagesFAQ).

### Virtual machines in your subscription are running on images that have been scheduled for deprecation

Virtual machines in your subscription are running on images that have been scheduled for deprecation. Once the image is deprecated, new VMs can't be created from the deprecated image. Upgrade to newer version of the image to prevent disruption to your workloads.


Learn more about [Virtual machine - VMRunningDeprecatedImage (Virtual machines in your subscription are running on images that have been scheduled for deprecation)](https://aka.ms/DeprecatedImagesFAQ).

### Use Availability zones for better resiliency and availability

Availability Zones (AZ) in Azure help protect your applications and data from datacenter failures. Each AZ is made up of one or more datacenters equipped with independent power, cooling, and networking. By designing solutions to use zonal VMs, you can isolate your VMs from failure in any other zone.

Learn more about [Virtual machine - AvailabilityZoneVM (Use Availability zones for better resiliency and availability)](/azure/reliability/availability-zones-overview).

### Use Managed Disks to improve data reliability

Virtual machines in an Availability Set with disks that share either storage accounts or storage scale units aren't resilient to single storage scale unit failures during outages. Migrate to Azure Managed Disks to ensure that the disks of different VMs in the Availability Set are sufficiently isolated to avoid a single point of failure.

Learn more about [Availability set - ManagedDisksAvSet (Use Managed Disks to improve data reliability)](https://aka.ms/aa_avset_manageddisk_learnmore).

### Access to mandatory URLs missing for your Azure Virtual Desktop environment

In order for a session host to deploy and register to Azure Virtual Desktop properly, you need to add a set of URLs to the allowed list, in case your virtual machine runs in a restricted environment. After visiting the "Learn More" link, you see the minimum list of URLs you need to unblock to have a successful deployment and functional session host. For specific URL(s) missing from allowed list, you might also search your application event log for event 3702.

Learn more about [Virtual machine - SessionHostNeedsAssistanceForUrlCheck (Access to mandatory URLs missing for your Azure Virtual Desktop environment)](../virtual-desktop/safe-url-list.md).

### Update your firewall configurations to allow new RHUI 4 IPs

Your Virtual Machine Scale Sets start receiving package content from RHUI4 servers on October 12, 2023. If you're allowing RHUI 3 IPs [https://aka.ms/rhui-server-list] via firewall and proxy, allow the new RHUI 4 IPs [https://aka.ms/rhui-server-list] to continue receiving RHEL package updates.

Learn more about [Virtual machine scale set - Rhui3ToRhui4MigrationVMSS (Update your firewall configurations to allow new RHUI 4 IPs)](https://aka.ms/rhui-server-list).

### Virtual Machine Scale Sets in your subscription are running on images that have been scheduled for deprecation

Virtual Machine Scale Sets in your subscription are running on images that have been scheduled for deprecation. Once the image is deprecated, your Virtual Machine Scale Sets workloads would no longer scale out. Upgrade to a newer version of the image to prevent disruption to your workload.

Learn more about [Virtual machine scale set - VMScaleSetRunningDeprecatedOfferImage (Virtual Machine Scale Sets in your subscription are running on images that have been scheduled for deprecation)](https://aka.ms/DeprecatedImagesFAQ).

### Virtual Machine Scale Sets in your subscription are running on images that have been scheduled for deprecation

Virtual Machine Scale Sets in your subscription are running on images that have been scheduled for deprecation. Once the image is deprecated, your Virtual Machine Scale Sets workloads would no longer scale out. Upgrade to newer version of the image to prevent disruption to your workload.

Learn more about [Virtual machine scale set - VMScaleSetRunningDeprecatedImage (Virtual Machine Scale Sets in your subscription are running on images that have been scheduled for deprecation)](https://aka.ms/DeprecatedImagesFAQ).

### Virtual Machine Scale Sets in your subscription are running on images that have been scheduled for deprecation

Virtual Machine Scale Sets in your subscription are running on images that have been scheduled for deprecation. Once the image is deprecated, your Virtual Machine Scale Sets workloads would no longer scale out. Upgrade to newer plan of the image to prevent disruption to your workload.

Learn more about [Virtual machine scale set - VMScaleSetRunningDeprecatedPlanImage (Virtual Machine Scale Sets in your subscription are running on images that have been scheduled for deprecation)](https://aka.ms/DeprecatedImagesFAQ).



## Containers

### Increase the minimal replica count for your container app

We detected the minimal replica count set for your container app might be lower than optimal. Consider increasing the minimal replica count for better availability.

Learn more about [Microsoft App Container App - ContainerAppMinimalReplicaCountTooLow (Increase the minimal replica count for your container app)](https://aka.ms/containerappscalingrules).

### Renew custom domain certificate

We detected the custom domain certificate you uploaded is near expiration. Renew your certificate and upload the new certificate for your container apps.

Learn more about [Microsoft App Container App - ContainerAppCustomDomainCertificateNearExpiration (Renew custom domain certificate)](https://aka.ms/containerappcustomdomaincert).

### A potential networking issue has been identified with your Container Apps environment that requires it to be re-created to avoid DNS issues

A potential networking issue has been identified for your Container Apps environments. To prevent this potential networking issue, create a new Container Apps environment, re-create your Container Apps in the new environment, and delete the old Container Apps environment

Learn more about [Managed Environment - CreateNewContainerAppsEnvironment (A potential networking issue has been identified with your Container Apps Environment that requires it to be re-created to avoid DNS issues)](https://aka.ms/createcontainerapp).

### Domain verification required to renew your App Service Certificate

You have an App Service certificate that's currently in a Pending Issuance status and requires domain verification. Failure to validate domain ownership results in an unsuccessful certificate issuance. Domain verification isn't automated for App Service certificates and requires your action.

Learn more about [App Service Certificate - ASCDomainVerificationRequired (Domain verification required to renew your App Service Certificate)](https://aka.ms/ASCDomainVerificationRequired).

### Clusters having node pools using unrecommended B-Series

Cluster has one or more node pools using an unrecommended burstable VM SKU. With burstable VMs, full vCPU capability 100% is unguaranteed. Make sure B-series VMs aren't used in a Production environment.

Learn more about [Kubernetes service - ClustersUsingBSeriesVMs (Clusters having node pools using unrecommended B-Series)](/azure/virtual-machines/sizes-b-series-burstable).

### Upgrade to Standard tier for mission-critical and production clusters

This cluster has more than 10 nodes and hasn't enabled the Standard tier. The Kubernetes Control Plane on the Free tier comes with limited resources and isn't intended for production use or any cluster with 10 or more nodes.

Learn more about [Kubernetes service - UseStandardpricingtier (Upgrade to Standard tier for mission-critical and production clusters)](/azure/aks/uptime-sla).

### Pod Disruption Budgets Recommended

Pod Disruption budgets recommended. Improve service high availability.

Learn more about [Kubernetes service - PodDisruptionBudgetsRecommended (Pod Disruption Budgets Recommended)](../aks/operator-best-practices-scheduler.md#plan-for-availability-using-pod-disruption-budgets).

### Upgrade to the latest agent version of Azure Arc-enabled Kubernetes

Upgrade to the latest agent version for the best Azure Arc enabled Kubernetes experience, improved stability and new functionality.

Learn more about [Kubernetes - Azure Arc - Arc-enabled K8s agent version upgrade (Upgrade to the latest agent version of Azure Arc-enabled Kubernetes)](https://aka.ms/ArcK8sAgentUpgradeDocs).



## Databases

### Replication - Add a primary key to the table that currently does not have one

Based on our internal monitoring, we have observed significant replication lag on your replica server. This lag is occurring because the replica server is replaying relay logs on a table that lacks a primary key. To ensure that the replica can synchronize with the primary and keep up with changes, add primary keys to the tables in the primary server. Once the primary keys are added, recreate the replica server.

Learn more about [Azure Database for MySQL flexible server - MySqlFlexibleServerReplicaMissingPKfb41 (Replication - Add a primary key to the table that currently doesn't have one)](/azure/mysql/how-to-troubleshoot-replication-latency#no-primary-key-or-unique-key-on-a-table).

### High Availability - Add primary key to the table that currently does not have one

Our internal monitoring system has identified significant replication lag on the High Availability standby server. The standby server replaying relay logs on a table that lacks a primary key, is the main cause of the lag. To address this issue and adhere to best practices, we recommend you add primary keys to all tables. Once you add the primary keys, proceed to disable and then re-enable High Availability to mitigate the problem.

Learn more about [Azure Database for MySQL flexible server - MySqlFlexibleServerHAMissingPKcf38 (High Availability - Add primary key to the table that currently doesn't have one.)](/azure/mysql/how-to-troubleshoot-replication-latency#no-primary-key-or-unique-key-on-a-table).

### Availability might be impacted from high memory fragmentation. Increase fragmentation memory reservation to avoid potential impact

Fragmentation and memory pressure can cause availability incidents during a failover or management operations. Increasing reservation of memory for fragmentation helps in reducing the cache failures when running under high memory pressure. Memory for fragmentation can be increased via maxfragmentationmemory-reserved setting available in advanced settings blade.

Learn more about [Redis Cache Server - RedisCacheMemoryFragmentation (Availability might be impacted from high memory fragmentation. Increase fragmentation memory reservation to avoid potential impact.)](https://aka.ms/redis/recommendations/memory-policies).

### Enable Azure backup for SQL on your virtual machines

Enable backups for SQL databases on your virtual machines using Azure backup and realize the benefits of zero-infrastructure backup, point-in-time restore, and central management with SQL AG integration.

Learn more about [SQL virtual machine - EnableAzBackupForSQL (Enable Azure backup for SQL on your virtual machines)](/azure/backup/backup-azure-sql-database).

### Improve PostgreSQL availability by removing inactive logical replication slots

Our internal telemetry indicates that your PostgreSQL server might have inactive logical replication slots. THIS NEEDS IMMEDIATE ATTENTION. Inactive logical replication can result in degraded server performance and unavailability due to WAL file retention and buildup of snapshot files. To improve performance and availability, we STRONGLY recommend that you IMMEDIATELY take action. Either delete the inactive replication slots, or start consuming the changes from these slots so that the slots' Log Sequence Number (LSN) advances and is close to the current LSN of the server.

Learn more about [PostgreSQL server - OrcasPostgreSqlLogicalReplicationSlots (Improve PostgreSQL availability by removing inactive logical replication slots)](https://aka.ms/azure_postgresql_logical_decoding).

### Improve PostgreSQL availability by removing inactive logical replication slots

Our internal telemetry indicates that your PostgreSQL flexible server might have inactive logical replication slots. THIS NEEDS IMMEDIATE ATTENTION. Inactive logical replication slots can result in degraded server performance and unavailability due to WAL file retention and buildup of snapshot files. To improve performance and availability, we STRONGLY recommend that you IMMEDIATELY take action. Either delete the inactive replication slots, or start consuming the changes from these slots so that the slots' Log Sequence Number (LSN) advances and is close to the current LSN of the server.

Learn more about [Azure Database for PostgreSQL flexible server - OrcasPostgreSqlFlexibleServerLogicalReplicationSlots (Improve PostgreSQL availability by removing inactive logical replication slots)](https://aka.ms/azure_postgresql_flexible_server_logical_decoding).

### Configure Consistent indexing mode on your Azure Cosmos DB container

We noticed that your Azure Cosmos DB container is configured with the Lazy indexing mode, which might impact the freshness of query results. We recommend switching to Consistent mode.

Learn more about [Azure Cosmos DB account - CosmosDBLazyIndexing (Configure Consistent indexing mode on your Azure Cosmos DB container)](/azure/cosmos-db/how-to-manage-indexing-policy).

### Upgrade your old Azure Cosmos DB SDK to the latest version

Your Azure Cosmos DB account is using an old version of the SDK. We recommend you upgrade to the latest version for the latest fixes, performance improvements, and new feature capabilities.

Learn more about [Azure Cosmos DB account - CosmosDBUpgradeOldSDK (Upgrade your old Azure Cosmos DB SDK to the latest version)](../cosmos-db/index.yml).

### Upgrade your outdated Azure Cosmos DB SDK to the latest version

Your Azure Cosmos DB account is using an outdated version of the SDK. We recommend you upgrade to the latest version for the latest fixes, performance improvements, and new feature capabilities.

Learn more about [Azure Cosmos DB account - CosmosDBUpgradeOutdatedSDK (Upgrade your outdated Azure Cosmos DB SDK to the latest version)](../cosmos-db/index.yml).

### Configure your Azure Cosmos DB containers with a partition key

Your Azure Cosmos DB nonpartitioned collections are approaching their provisioned storage quota. Migrate these collections to new collections with a partition key definition so the service can automatically scale them out.

Learn more about [Azure Cosmos DB account - CosmosDBFixedCollections (Configure your Azure Cosmos DB containers with a partition key)](../cosmos-db/partitioning-overview.md#choose-partitionkey).

### Upgrade your Azure Cosmos DB for MongoDB account to v4.0 to save on query/storage costs and utilize new features

Your Azure Cosmos DB for MongoDB account is eligible to upgrade to version 4.0. Reduce your storage costs by up to 55% and your query costs by up to 45% by upgrading to the v4.0 new storage format. Numerous other features such as multi-document transactions are also included in v4.0.

Learn more about [Azure Cosmos DB account - CosmosDBMongoSelfServeUpgrade (Upgrade your Azure Cosmos DB for MongoDB account to v4.0 to save on query/storage costs and utilize new features)](/azure/cosmos-db/mongodb-version-upgrade).

### Add a second region to your production workloads on Azure Cosmos DB

Based on their names and configuration, we have detected the Azure Cosmos DB accounts listed as being potentially used for production workloads. These accounts currently run in a single Azure region. You can increase their availability by configuring them to span at least two Azure regions.

> [!NOTE]
> Additional regions incur extra costs.

Learn more about [Azure Cosmos DB account - CosmosDBSingleRegionProdAccounts (Add a second region to your production workloads on Azure Cosmos DB)](../cosmos-db/high-availability.md).

### Enable Server Side Retry (SSR) on your Azure Cosmos DB for MongoDB account

We observed your account is throwing a TooManyRequests error with the 16500 error code. Enabling Server Side Retry (SSR) can help mitigate this issue for you.

Learn more about [Azure Cosmos DB account - CosmosDBMongoServerSideRetries (Enable Server Side Retry (SSR) on your Azure Cosmos DB for MongoDB account)](/azure/cosmos-db/cassandra/prevent-rate-limiting-errors).

### Migrate your Azure Cosmos DB for MongoDB account to v4.0 to save on query/storage costs and utilize new features

Migrate your database account to a new database account to take advantage of Azure Cosmos DB for MongoDB v4.0. Reduce your storage costs by up to 55% and your query costs by up to 45% by upgrading to the v4.0 new storage format. Numerous other features such as multi-document transactions are also included in v4.0. When upgrading, you must also migrate the data in your existing account to a new account created using version 4.0. Azure Data Factory or Studio 3T can assist you in migrating your data.

Learn more about [Azure Cosmos DB account - CosmosDBMongoMigrationUpgrade (Migrate your Azure Cosmos DB for MongoDB account to v4.0 to save on query/storage costs and utilize new features)](/azure/cosmos-db/mongodb-feature-support-40).

### Your Azure Cosmos DB account is unable to access its linked Azure Key Vault hosting your encryption key

It appears that your key vault's configuration is preventing your Azure Cosmos DB account from contacting the key vault to access your managed encryption keys. If you've recently performed a key rotation, make sure that the previous key or key version remains enabled and available until Azure Cosmos DB has completed the rotation. The previous key or key version can be disabled after 24 hours, or after the Azure Key Vault audit logs don't show activity from Azure Cosmos DB on that key or key version anymore.

Learn more about [Azure Cosmos DB account - CosmosDBKeyVaultWrap (Your Azure Cosmos DB account is unable to access its linked Azure Key Vault hosting your encryption key)](../cosmos-db/how-to-setup-cmk.md).

### Avoid being rate limited from metadata operations

We found a high number of metadata operations on your account. Your data in Azure Cosmos DB, including metadata about your databases and collections, is distributed across partitions. Metadata operations have a system-reserved request unit (RU) limit. A high number of metadata operations can cause rate limiting. Avoid rate limiting by using static Azure Cosmos DB client instances in your code, and caching the names of databases and collections.

Learn more about [Azure Cosmos DB account - CosmosDBHighMetadataOperations (Avoid being rate limited from metadata operations)](/azure/cosmos-db/performance-tips).

### Use the new 3.6+ endpoint to connect to your upgraded Azure Cosmos DB for MongoDB account

We observed some of your applications are connecting to your upgraded Azure Cosmos DB for MongoDB account using the legacy 3.2 endpoint `[accountname].documents.azure.com`. Use the new endpoint `[accountname].mongo.cosmos.azure.com` (or its equivalent in sovereign, government, or restricted clouds).

Learn more about [Azure Cosmos DB account - CosmosDBMongoNudge36AwayFrom32 (Use the new 3.6+ endpoint to connect to your upgraded Azure Cosmos DB for MongoDB account)](/azure/cosmos-db/mongodb-feature-support-40).

### Upgrade to 2.6.14 version of the Async Java SDK v2 to avoid a critical issue or upgrade to Java SDK v4 as Async Java SDK v2 is being deprecated

There's a critical bug in version 2.6.13 and lower, of the Azure Cosmos DB Async Java SDK v2 causing errors when a Global logical sequence number (LSN) greater than the Max Integer value is reached. These service errors happen after a large volume of transactions occur in the lifetime of an Azure Cosmos DB container. Note: There's a critical hotfix for the Async Java SDK v2, however we still highly recommend you migrate to the [Java SDK v4](../cosmos-db/sql/sql-api-sdk-java-v4.md).

Learn more about [Azure Cosmos DB account - CosmosDBMaxGlobalLSNReachedV2 (Upgrade to 2.6.14 version of the Async Java SDK v2 to avoid a critical issue or upgrade to Java SDK v4 as Async Java SDK v2 is being deprecated)](../cosmos-db/sql/sql-api-sdk-async-java.md).

### Upgrade to the current recommended version of the Java SDK v4 to avoid a critical issue

There's a critical bug in version 4.15 and lower of the Azure Cosmos DB Java SDK v4 causing errors when a Global logical sequence number (LSN) greater than the Max Integer value is reached. These service errors happen after a large volume of transactions occur in the lifetime of an Azure Cosmos DB container.

Learn more about [Azure Cosmos DB account - CosmosDBMaxGlobalLSNReachedV4 (Upgrade to the current recommended version of the Java SDK v4 to avoid a critical issue)](../cosmos-db/sql/sql-api-sdk-java-v4.md).



## Integration

### Upgrade to the latest FarmBeats API version

We have identified calls to a FarmBeats API version that is scheduled for deprecation. We recommend switching to the latest FarmBeats API version to ensure uninterrupted access to FarmBeats, latest features, and performance improvements.

Learn more about [Azure FarmBeats - FarmBeatsApiVersion (Upgrade to the latest FarmBeats API version)](https://aka.ms/FarmBeatsPaaSAzureAdvisorFAQ).

### Upgrade to the latest ADMA Java SDK version

We have identified calls to an Azure Data Manager for Agriculture (ADMA) Java SDK version that is scheduled for deprecation. We recommend switching to the latest SDK version to ensure uninterrupted access to ADMA, latest features, and performance improvements.

Learn more about [Azure FarmBeats - FarmBeatsJavaSdkVersion (Upgrade to the latest ADMA Java SDK version)](https://aka.ms/FarmBeatsPaaSAzureAdvisorFAQ).

### Upgrade to the latest ADMA DotNet SDK version

We have identified calls to an ADMA DotNet SDK version that is scheduled for deprecation. We recommend switching to the latest SDK version to ensure uninterrupted access to ADMA, latest features, and performance improvements.

Learn more about [Azure FarmBeats - FarmBeatsDotNetSdkVersion (Upgrade to the latest ADMA DotNet SDK version)](https://aka.ms/FarmBeatsPaaSAzureAdvisorFAQ).

### Upgrade to the latest ADMA JavaScript SDK version

We have identified calls to an ADMA JavaScript SDK version that is scheduled for deprecation. We recommend switching to the latest SDK version to ensure uninterrupted access to ADMA, latest features, and performance improvements.

Learn more about [Azure FarmBeats - FarmBeatsJavaScriptSdkVersion (Upgrade to the latest ADMA JavaScript SDK version)](https://aka.ms/FarmBeatsPaaSAzureAdvisorFAQ).

### Upgrade to the latest ADMA Python SDK version

We have identified calls to an ADMA Python SDK version that is scheduled for deprecation. We recommend switching to the latest SDK version to ensure uninterrupted access to ADMA, latest features, and performance improvements.

Learn more about [Azure FarmBeats - FarmBeatsPythonSdkVersion (Upgrade to the latest ADMA Python SDK version)](https://aka.ms/FarmBeatsPaaSAzureAdvisorFAQ).

### SSL/TLS renegotiation blocked

SSL/TLS renegotiation attempt blocked. Renegotiation happens when a client certificate is requested over an already established connection. When it's blocked, reading 'context.Request.Certificate' in policy expressions returns 'null.' To support client certificate authentication scenarios, enable 'Negotiate client certificate' on listed hostnames. For browser-based clients, enabling this option might result in a certificate prompt being presented to the client.

Learn more about [Api Management - TlsRenegotiationBlocked (SSL/TLS renegotiation blocked)](/azure/api-management/api-management-howto-mutual-certificates-for-clients).

### Hostname certificate rotation failed

API Management service failed to refresh hostname certificate from Key Vault. Ensure that certificate exists in Key Vault and API Management service identity is granted secret read access. Otherwise, API Management service can't retrieve certificate updates from Key Vault, which might lead to the service using stale certificate and runtime API traffic being blocked as a result.

Learn more about [Api Management - HostnameCertRotationFail (Hostname certificate rotation failed)](https://aka.ms/apimdocs/customdomain).



## Internet of Things

### Upgrade device client SDK to a supported version for IotHub

Some or all of your devices are using outdated SDK and we recommend you upgrade to a supported version of SDK. See the details in the recommendation.

Learn more about [IoT hub - UpgradeDeviceClientSdk (Upgrade device client SDK to a supported version for IotHub)](https://aka.ms/iothubsdk).

### IoT Hub Potential Device Storm Detected

A device storm is when two or more devices are trying to connect to the IoT Hub using the same device ID credentials. When the second device (B) connects, it causes the first one (A) to become disconnected. Then (A) attempts to reconnect again, which causes (B) to get disconnected.

Learn more about [IoT hub - IoTHubDeviceStorm (IoT Hub Potential Device Storm Detected)](https://aka.ms/IotHubDeviceStorm).

### Upgrade Device Update for IoT Hub SDK to a supported version

Your Device Update for IoT Hub Instance is using an outdated version of the SDK. We recommend you upgrade to the latest version for the latest fixes, performance improvements, and new feature capabilities.

Learn more about [IoT hub - DU_SDK_Advisor_Recommendation (Upgrade Device Update for IoT Hub SDK to a supported version)](/azure/iot-hub-device-update/understand-device-update).

### IoT Hub Quota Exceeded Detected

We have detected that your IoT Hub has exceeded its daily message quota. To prevent your IoT Hub exceeding its daily message quota in the future, add units or increase the SKU level.

Learn more about [IoT hub - IoTHubQuotaExceededAdvisor (IoT Hub Quota Exceeded Detected)](/azure/iot-hub/troubleshoot-error-codes#403002-iothubquotaexceeded).

### Upgrade device client SDK to a supported version for Iot Hub

Some or all of your devices are using outdated SDK and we recommend you upgrade to a supported version of SDK. See the details in the link given.

Learn more about [IoT hub - UpgradeDeviceClientSdk (Upgrade device client SDK to a supported version for IotHub)](https://aka.ms/iothubsdk).

### Upgrade Edge Device Runtime to a supported version for Iot Hub

Some or all of your Edge devices are using outdated versions and we recommend you upgrade to the latest supported version of the runtime. See the details in the link given.

Learn more about [IoT hub - UpgradeEdgeSdk (Upgrade Edge Device Runtime to a supported version for Iot Hub)](https://aka.ms/IOTEdgeSDKCheck).



## Media 

### Increase Media Services quotas or limits to ensure continuity of service

Your media account is about to hit its quota limits. Review current usage of Assets, Content Key Policies and Stream Policies for the media account. To avoid any disruption of service, request quota limits to be increased for the entities that are closer to hitting quota limit. You can request quota limits to be increased by opening a ticket and adding relevant details to it. Don't create extra Azure Media accounts in an attempt to obtain higher limits.

Learn more about [Media Service - AccountQuotaLimit (Increase Media Services quotas or limits to ensure continuity of service.)](https://aka.ms/ams-quota-recommendation/).



## Networking

### Check Point virtual machine might lose Network Connectivity

We have identified that your virtual machine might be running a version of Check Point image that might lose network connectivity during a platform servicing operation. We recommend that you upgrade to a newer version of the image. Contact Check Point for further instructions on how to upgrade your image.

Learn more about [Virtual machine - CheckPointPlatformServicingKnownIssueA (Check Point virtual machine might lose Network Connectivity.)](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk151752&partition=Advanced&product=CloudGuard).

### Upgrade to the latest version of the Azure Connected Machine agent

The Azure Connected Machine agent is updated regularly with bug fixes, stability enhancements, and new functionality. Upgrade your agent to the latest version for the best Azure Arc experience.

Learn more about [Connected Machine agent - Azure Arc - ArcServerAgentVersion (Upgrade to the latest version of the Azure Connected Machine agent)](../azure-arc/servers/manage-agent.md).

### Switch Secret version to ‘Latest’ for the Azure Front Door customer certificate

We recommend configuring the Azure Front Door (AFD) customer certificate secret to ‘Latest’ for the AFD to refer to the latest secret version in Azure Key Vault, so that the secret can be automatically rotated.

Learn more about [Front Door Profile - SwitchVersionBYOC (Switch Secret version to ‘Latest’ for the Azure Front Door customer certificate)](https://aka.ms/how-to-configure-https-custom-domain#certificate-renewal-and-changing-certificate-types).

### Validate domain ownership by adding DNS TXT record to DNS provider.

Validate domain ownership by adding DNS TXT record to DNS provider.

Learn more about [Front Door Profile - ValidateDomainOwnership (Validate domain ownership by adding DNS TXT record to DNS provider.)](https://aka.ms/how-to-add-custom-domain#domain-validation-state).

### Revalidate domain ownership for the Azure Front Door managed certificate renewal

Azure Front Door can't automatically renew the managed certificate because the domain isn't CNAME mapped to AFD endpoint. Revalidate domain ownership for the managed certificate to be automatically renewed.

Learn more about [Front Door Profile - RevalidateDomainOwnership (Revalidate domain ownership for the Azure Front Door managed certificate renewal)](https://aka.ms/how-to-add-custom-domain#domain-validation-state).

### Renew the expired Azure Front Door customer certificate to avoid service disruption

Some of the customer certificates for Azure Front Door Standard and Premium profiles expired. Renew the certificate in time to avoid service disruption.

Learn more about [Front Door Profile - RenewExpiredBYOC (Renew the expired Azure Front Door customer certificate to avoid service disruption.)](https://aka.ms/how-to-configure-https-custom-domain#use-your-own-certificate).

### Upgrade your SKU or add more instances to ensure fault tolerance

Deploying two or more medium or large sized instances ensures business continuity during outages caused by planned or unplanned maintenance.

Learn more about [Application gateway - AppGateway (Upgrade your SKU or add more instances to ensure fault tolerance)](https://aka.ms/aa_gatewayrec_learnmore).

### Avoid hostname override to ensure site integrity

Try to avoid overriding the hostname when configuring Application Gateway.  Having a domain on the frontend of Application Gateway different than the one used to access the backend, can potentially lead to cookies or redirect URLs being broken. A different frontend domain isn't a problem in all situations, and certain categories of backends like REST APIs, are less sensitive in general.  Make sure the backend is able to deal with the domain difference, or update the Application Gateway configuration so the hostname doesn't need to be overwritten towards the backend.  When used with App Service, attach a custom domain name to the Web App and avoid use of the `*.azurewebsites.net` host name towards the backend.

Learn more about [Application gateway - AppGatewayHostOverride (Avoid hostname override to ensure site integrity)](https://aka.ms/appgw-advisor-usecustomdomain).

### Azure WAF RuleSet CRS 3.1/3.2 has been updated with Log4j 2 vulnerability rule

In response to Log4j 2 vulnerability (CVE-2021-44228), Azure Web Application Firewall (WAF) RuleSet CRS 3.1/3.2 has been updated on your Application Gateway to help provide extra protection from this vulnerability. The rules are available under Rule 944240 and no action is needed to enable them.

Learn more about [Application gateway - AppGwLog4JCVEPatchNotification (Azure WAF RuleSet CRS 3.1/3.2 has been updated with log4j2 vulnerability rule)](https://aka.ms/log4jcve).

### Extra protection to mitigate Log4j 2 vulnerability (CVE-2021-44228)

To mitigate the impact of Log4j 2 vulnerability, we recommend these steps:

1) Upgrade Log4j 2 to version 2.15.0 on your backend servers. If upgrade isn't possible, follow the system property guidance link provided.
2) Take advantage of WAF Core rule sets (CRS) by upgrading to WAF SKU.

Learn more about [Application gateway - AppGwLog4JCVEGenericNotification (Additional protection to mitigate Log4j2 vulnerability (CVE-2021-44228))](https://aka.ms/log4jcve).

### Update VNet permission of Application Gateway users

To improve security and provide a more consistent experience across Azure, all users must pass a permission check before creating or updating an Application Gateway in a Virtual Network. The users or service principals must include at least Microsoft.Network/virtualNetworks/subnets/join/action permission.

Learn more about [Application gateway - AppGwLinkedAccessFailureRecmmendation (Update VNet permission of Application Gateway users)](https://aka.ms/agsubnetjoin).

### Use version-less Key Vault secret identifier to reference the certificates

We strongly recommend that you use a version-less secret identifier to allow your application gateway resource to automatically retrieve the new certificate version, whenever available. Example: https://myvault.vault.azure.net/secrets/mysecret/

Learn more about [Application gateway - AppGwAdvisorRecommendationForCertificateUpdate (Use version-less Key Vault secret identifier to reference the certificates)](https://aka.ms/agkvversion).

### Implement multiple ExpressRoute circuits in your Virtual Network for cross premises resiliency

We have detected that your ExpressRoute gateway only has 1 ExpressRoute circuit associated to it. Connect one or more extra circuits to your gateway to ensure peering location redundancy and resiliency

Learn more about [Virtual network gateway - ExpressRouteGatewayRedundancy (Implement multiple ExpressRoute circuits in your Virtual Network for cross premises resiliency)](../expressroute/designing-for-high-availability-with-expressroute.md).

### Implement ExpressRoute Monitor on Network Performance Monitor for end-to-end monitoring of your ExpressRoute circuit

We have detected that ExpressRoute Monitor on Network Performance Monitor isn't currently monitoring your ExpressRoute circuit. ExpressRoute monitor provides end-to-end monitoring capabilities including: loss, latency, and performance from on-premises to Azure and Azure to on-premises

Learn more about [ExpressRoute circuit - ExpressRouteGatewayE2EMonitoring (Implement ExpressRoute Monitor on Network Performance Monitor for end-to-end monitoring of your ExpressRoute circuit)](../expressroute/how-to-npm.md).

### Use ExpressRoute Global Reach to improve your design for disaster recovery

You appear to have ExpressRoute circuits peered in at least two different locations. Connect them to each other using ExpressRoute Global Reach to allow traffic to continue flowing between your on-premises network and Azure environments if one circuit losing connectivity. You can establish Global Reach connections between circuits in different peering locations within the same metro or across metros.

Learn more about [ExpressRoute circuit - UseGlobalReachForDR (Use ExpressRoute Global Reach to improve your design for disaster recovery)](../expressroute/about-upgrade-circuit-bandwidth.md).

### Add at least one more endpoint to the profile, preferably in another Azure region

Profiles require more than one endpoint to ensure availability if one of the endpoints fails. We also recommend that endpoints be in different regions.

Learn more about [Traffic Manager profile - GeneralProfile (Add at least one more endpoint to the profile, preferably in another Azure region)](https://aka.ms/AA1o0x4).

### Add an endpoint configured to "All (World)"

For geographic routing, traffic is routed to endpoints based on defined regions. When a region fails, there's no predefined failover. Having an endpoint where the Regional Grouping is configured to "All (World)" for geographic profiles avoids traffic black holing and guarantee service remains available.

Learn more about [Traffic Manager profile - GeographicProfile (Add an endpoint configured to \""All (World)\"")](https://aka.ms/Rf7vc5).

### Add or move one endpoint to another Azure region

All endpoints associated to this proximity profile are in the same region. Users from other regions might experience long latency when attempting to connect. Adding or moving an endpoint to another region improves overall performance for proximity routing and provide better availability in case all endpoints in one region fail.

Learn more about [Traffic Manager profile - ProximityProfile (Add or move one endpoint to another Azure region)](https://aka.ms/Ldkkdb).

### Move to production gateway SKUs from Basic gateways

The VPN gateway Basic SKU is designed for development or testing scenarios. Move to a production SKU if you're using the VPN gateway for production purposes. The production SKUs offer higher number of tunnels, BGP support, active-active, custom IPsec/IKE policy in addition to higher stability and availability.

Learn more about [Virtual network gateway - BasicVPNGateway (Move to production gateway SKUs from Basic gateways)](https://aka.ms/aa_basicvpngateway_learnmore).

### Use NAT gateway for outbound connectivity

Prevent risk of connectivity failures due to SNAT port exhaustion by using NAT gateway for outbound traffic from your virtual networks. NAT gateway scales dynamically and provides secure connections for traffic headed to the internet.

Learn more about [Virtual network - natGateway (Use NAT gateway for outbound connectivity)](/azure/load-balancer/load-balancer-outbound-connections#2-associate-a-nat-gateway-to-the-subnet).

### Update VNet permission of Application Gateway users

To improve security and provide a more consistent experience across Azure, all users must pass a permission check before creating or updating an Application Gateway in a Virtual Network. The users or service principals must include at least Microsoft.Network/virtualNetworks/subnets/join/action permission.

Learn more about [Application gateway - AppGwLinkedAccessFailureRecmmendation (Update VNet permission of Application Gateway users)](https://aka.ms/agsubnetjoin).

### Use version-less Key Vault secret identifier to reference the certificates

We strongly recommend that you use a version-less secret identifier to allow your application gateway resource to automatically retrieve the new certificate version, whenever available. Example: https://myvault.vault.azure.net/secrets/mysecret/

Learn more about [Application gateway - AppGwAdvisorRecommendationForCertificateUpdate (Use version-less Key Vault secret identifier to reference the certificates)](https://aka.ms/agkvversion).

### Enable Active-Active gateways for redundancy

In active-active configuration, both instances of the VPN gateway establish S2S VPN tunnels to your on-premises VPN device. When a planned maintenance or unplanned event happens to one gateway instance, traffic is switched over to the other active IPsec tunnel automatically.

Learn more about [Virtual network gateway - VNetGatewayActiveActive (Enable Active-Active gateways for redundancy)](https://aka.ms/aa_vpnha_learnmore).


## SAP for Azure

### Enable the 'concurrent-fencing' parameter in Pacemaker cofiguration in ASCS HA setup in SAP workloads

The concurrent-fencing parameter when set to true, enables the fencing operations to be performed in parallel. Set this parameter to 'true' in the pacemaker cluster configuration for ASCS HA setup.

Learn more about [Central Server Instance - ConcurrentFencingHAASCSRH (Enable the 'concurrent-fencing' parameter in Pacemaker cofiguration in ASCS HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability-rhel).

### Ensure that stonith is enabled for the Pacemaker cofiguration in ASCS HA setup in SAP workloads

In a Pacemaker cluster, the implementation of node level fencing is done using STONITH (Shoot The Other Node in the Head) resource. Ensure that 'stonith-enable' is set to 'true' in the HA cluster configuration of your SAP workload.

Learn more about [Central Server Instance - StonithEnabledHAASCSRH (Ensure that stonith is enabled for the Pacemaker cofiguration in ASCS HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability-rhel).

### Set the stonith timeout to 144 for the cluster cofiguration in ASCS HA setup in SAP workloads

Set the stonith timeout to 144 for HA cluster as per recommendation for SAP on Azure.

Learn more about [Central Server Instance - StonithTimeOutHAASCS (Set the stonith timeout to 144 for the cluster cofiguration in ASCS HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Set the corosync token in Pacemaker cluster to 30000 for ASCS HA setup in SAP workloads

The corosync token setting determines the timeout that is used directly or as a base for real token timeout calculation in HA clusters. Set the corosync token to 30000 as per recommendation for SAP on Azure to allow memory-preserving maintenance.

Learn more about [Central Server Instance - CorosyncTokenHAASCSRH (Set the corosync token in Pacemaker cluster to 30000 for ASCS HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability-rhel).

### Set the expected votes parameter to 2 in Pacemaker cofiguration in ASCS HA setup in SAP workloads

In a two node HA cluster, set the quorum votes to 2 as per recommendation for SAP on Azure.

Learn more about [Central Server Instance - ExpectedVotesHAASCSRH (Set the expected votes parameter to 2 in Pacemaker cofiguration in ASCS HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability-rhel).

### Set 'token_retransmits_before_loss_const' to 10 in Pacemaker cluster in ASCS HA setup in SAP workloads

The corosync token_retransmits_before_loss_const determines how many token retransmits the system attempts before timeout in HA clusters. Set the totem.token_retransmits_before_loss_const to 10 as per recommendation for ASCS HA setup.

Learn more about [Central Server Instance - TokenRestransmitsHAASCSSLE (Set 'token_retransmits_before_loss_const' to 10 in Pacemaker cluster in ASCS HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Set the corosync token in Pacemaker cluster to 30000 for ASCS HA setup in SAP workloads

The corosync token setting determines the timeout that is used directly or as a base for real token timeout calculation in HA clusters. Set the corosync token to 30000 as per recommendation for SAP on Azure to allow memory-preserving maintenance.

Learn more about [Central Server Instance - CorosyncTokenHAASCSSLE (Set the corosync token in Pacemaker cluster to 30000 for ASCS HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Set the 'corosync max_messages' in Pacemaker cluster to 20 for ASCS HA setup in SAP workloads

The corosync max_messages constant specifies the maximum number of messages allowed to be sent by one processor once the token is received. We recommend you set to 20 times the corosync token parameter in Pacemaker cluster configuration.

Learn more about [Central Server Instance - CorosyncMaxMessagesHAASCSSLE (Set the 'corosync max_messages' in Pacemaker cluster to 20 for ASCS HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Set the 'corosync consensus' in Pacemaker cluster to 36000 for ASCS HA setup in SAP workloads

The corosync parameter 'consensus' specifies in milliseconds how long to wait for consensus to be achieved before starting a new round of membership in the cluster configuration. We recommend that you set 1.2 times the corosync token in Pacemaker cluster configuration for ASCS HA setup.

Learn more about [Central Server Instance - CorosyncConsensusHAASCSSLE (Set the 'corosync consensus' in Pacemaker cluster to 36000 for ASCS HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Set the expected votes parameter to 2 in the cluster cofiguration in ASCS HA setup in SAP workloads

In a two node HA cluster, set the quorum parameter expected_votes to 2 as per recommendation for SAP on Azure.

Learn more about [Central Server Instance - ExpectedVotesHAASCSSLE (Set the expected votes parameter to 2 in the cluster cofiguration in ASCS HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Set the two_node parameter to 1 in the cluster cofiguration in ASCS HA setup in SAP workloads

In a two node HA cluster, set the quorum parameter 'two_node' to 1 as per recommendation for SAP on Azure.

Learn more about [Central Server Instance - TwoNodesParametersHAASCSSLE (Set the two_node parameter to 1 in the cluster cofiguration in ASCS HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Set the 'corosync join' in Pacemaker cluster to 60 for ASCS HA setup in SAP workloads

The corosync join timeout specifies in milliseconds how long to wait for join messages in the membership protocol. We recommend that you set 60 in Pacemaker cluster configuration for ASCS HA setup.

Learn more about [Central Server Instance - CorosyncJoinHAASCSSLE (Set the 'corosync join' in Pacemaker cluster to 60 for ASCS HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Ensure that stonith is enabled for the cluster cofiguration in ASCS HA setup in SAP workloads

In a Pacemaker cluster, the implementation of node level fencing is done using STONITH (Shoot The Other Node in the Head) resource. Ensure that 'stonith-enable' is set to 'true' in the HA cluster configuration.

Learn more about [Central Server Instance - StonithEnabledHAASCS (Ensure that stonith is enabled for the cluster cofiguration in ASCS HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Set stonith-timeout to 900 in Pacemaker configuration with Azure fence agent for ASCS HA setup

Set the stonith-timeout to 900 for reliable function of the Pacemaker for ASCS HA setup. This stonith-timeout setting is applicable if you're using Azure fence agent for fencing with either managed identity or service principal.

Learn more about [Central Server Instance - StonithTimeOutHAASCSSLE (Set stonith-timeout to 900 in Pacemaker configuration with Azure fence agent for ASCS HA setup)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Enable the 'concurrent-fencing' parameter in Pacemaker cofiguration in ASCS HA setup in SAP workloads

The concurrent-fencing parameter when set to true, enables the fencing operations to be performed in parallel. Set this parameter to 'true' in the pacemaker cluster configuration for ASCS HA setup.

Learn more about [Central Server Instance - ConcurrentFencingHAASCSSLE (Enable the 'concurrent-fencing' parameter in Pacemaker cofiguration in ASCS HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Create the softdog config file in Pacemaker configuration for ASCS HA setup in SAP workloads

The softdog timer is loaded as a kernel module in linux OS. This timer triggers a system reset if it detects that the system has hung. Ensure that the softdog configuration file is created in the Pacemaker cluster for ASCS HA setup.

Learn more about [Central Server Instance - SoftdogConfigHAASCSSLE (Create the softdog config file in Pacemaker configuration for ASCS HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Ensure the softdog module is loaded in for Pacemaker in ASCS HA setup in SAP workloads

The softdog timer is loaded as a kernel module in linux OS. This timer  triggers a system reset if it detects that the system has hung. First ensure that you created the softdog configuration file, then load the softdog module in the Pacemaker configuration for ASCS HA setup.

Learn more about [Central Server Instance - softdogmoduleloadedHAASCSSLE (Ensure the softdog module is loaded in for Pacemaker in ASCS HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Ensure that there is one instance of fence_azure_arm in Pacemaker configuration for ASCS HA setup

The fence_azure_arm is an I/O fencing agent for Azure Resource Manager. Ensure that there's one instance of fence_azure_arm in the pacemaker configuration for ASCS HA setup. The fence_azure_arm requirement is applicable if you're using Azure fence agent for fencing with either managed identity or service principal.

Learn more about [Central Server Instance - FenceAzureArmHAASCSSLE (Ensure that there's one instance of fence_azure_arm in Pacemaker configuration for ASCS HA setup)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Enable HA ports in the Azure Load Balancer for ASCS HA setup in SAP workloads

Enable HA ports in the Load balancing rules for HA set up of ASCS instance in SAP workloads. Open the load balancer, select 'load balancing rules' and add/edit the rule to enable the recommended settings.

Learn more about [Central Server Instance - ASCSHAEnableLBPorts (Enable HA ports in the Azure Load Balancer for ASCS HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/high-availability-guide-rhel-with-hana-ascs-ers-dialog-instance).

### Enable Floating IP in the Azure Load balancer for ASCS HA setup in SAP workloads

Enable floating IP in the load balancing rules for the Azure Load Balancer for HA set up of ASCS instance in SAP workloads. Open the load balancer, select 'load balancing rules' and add/edit the rule to enable the recommended settings.

Learn more about [Central Server Instance - ASCSHAEnableFloatingIpLB (Enable Floating IP in the Azure Load balancer for ASCS HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/high-availability-guide-rhel-with-hana-ascs-ers-dialog-instance).

### Set the Idle timeout in Azure Load Balancer to 30 minutes for ASCS HA setup in SAP workloads

To prevent load balancer timeout, make sure that all Azure Load Balancing Rules have: 'Idle timeout (minutes)' set to the maximum value of 30 minutes. Open the load balancer, select 'load balancing rules' and add/edit the rule to enable the recommended settings.

Learn more about [Central Server Instance - ASCSHASetIdleTimeOutLB (Set the Idle timeout in Azure Load Balancer to 30 minutes for ASCS HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Disable TCP timestamps on VMs placed behind Azure Load Balancer in ASCS HA setup in SAP workloads

Disable TCP timestamps on VMs placed behind Azure Load Balancer. Enabled TCP timestamps cause the health probes to fail due to TCP packets being dropped by the VM's guest OS TCP stack. Dropped TCP packets cause the load balancer to mark the endpoint as down.

Learn more about [Central Server Instance - ASCSLBHADisableTCP (Disable TCP timestamps on VMs placed behind Azure Load Balancer in ASCS HA setup in SAP workloads)](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/sap-on-azure-general-update-november-2021/ba-p/2807619#network-settings-and-tuning-for-sap-on-azure).

### Enable stonith in the cluster cofiguration in HA enabled SAP workloads for VMs with Redhat OS

In a Pacemaker cluster, the implementation of node level fencing is done using STONITH (Shoot The Other Node in the Head) resource. Ensure that 'stonith-enable' is set to 'true' in the HA cluster configuration of your SAP workload.

Learn more about [Database Instance - StonithEnabledHARH (Enable stonith in the cluster cofiguration in HA enabled SAP workloads for VMs with Redhat OS)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability-rhel).

### Set the stonith timeout to 144 for the cluster cofiguration in HA enabled SAP workloads

Set the stonith timeout to 144 for HA cluster as per recommendation for SAP on Azure.

Learn more about [Database Instance - StonithTimeoutHASLE (Set the stonith timeout to 144 for the cluster cofiguration in HA enabled SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Enable stonith in the cluster cofiguration in HA enabled SAP workloads for VMs with SUSE OS

In a Pacemaker cluster, the implementation of node level fencing is done using STONITH (Shoot The Other Node in the Head) resource. Ensure that 'stonith-enable' is set to 'true' in the HA cluster configuration.

Learn more about [Database Instance - StonithEnabledHASLE (Enable stonith in the cluster cofiguration in HA enabled SAP workloads for VMs with SUSE OS)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Set stonith-timeout to 900 in Pacemaker configuration with Azure fence agent for HANA DB HA setup

Set the stonith-timeout to 900 for reliable functioning of the Pacemaker for HANA DB HA setup. This setting is important if you're using the Azure fence agent for fencing with either managed identity or service principal.

Learn more about [Database Instance - StonithTimeOutSuseHDB (Set stonith-timeout to 900 in Pacemaker configuration with Azure fence agent for HANA DB HA setup)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Set the corosync token in Pacemaker cluster to 30000 for HA enabled HANA DB for VM with Redhat OS

The corosync token setting determines the timeout that is used directly or as a base for real token timeout calculation in HA clusters. Set the corosync token to 30000 as per recommendation for SAP on Azure to allow memory-preserving maintenance.

Learn more about [Database Instance - CorosyncTokenHARH (Set the corosync token in Pacemaker cluster to 30000 for HA enabled HANA DB for VM with Redhat OS)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability-rhel).

### Set the expected votes parameter to 2 in the cluster cofiguration in HA enabled SAP workloads

In a two node HA cluster, set the quorum votes to 2 as per recommendation for SAP on Azure.

Learn more about [Database Instance - ExpectedVotesParamtersHARH (Set the expected votes parameter to 2 in the cluster cofiguration in HA enabled SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability-rhel).

### Set the corosync token in Pacemaker cluster to 30000 for HA enabled HANA DB for VM with SUSE OS

The corosync token setting determines the timeout that is used directly or as a base for real token timeout calculation in HA clusters. Set the corosync token to 30000 as per recommendation for SAP on Azure to allow memory-preserving maintenance.

Learn more about [Database Instance - CorosyncTokenHASLE (Set the corosync token in Pacemaker cluster to 30000 for HA enabled HANA DB for VM with SUSE OS)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Set parameter PREFER_SITE_TAKEOVER to 'true' in the Pacemaker cofiguration for HANA DB HA setup

The parameter PREFER_SITE_TAKEOVER in SAP HANA topology defines if the HANA SR resource agent prefers to takeover to the secondary instance instead of restarting the failed primary locally. Set it to 'true' for reliable function of HANA DB HA setup.

Learn more about [Database Instance - PreferSiteTakeOverHARH (Set parameter PREFER_SITE_TAKEOVER to 'true' in the Pacemaker cofiguration for HANA DB HA setup)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability-rhel).

### Enable the 'concurrent-fencing' parameter in the Pacemaker cofiguration for HANA DB HA setup

The concurrent-fencing parameter when set to true, enables the fencing operations to be performed in parallel. Set this parameter to 'true' in the pacemaker cluster configuration for HANA DB HA setup.

Learn more about [Database Instance - ConcurrentFencingHARH (Enable the 'concurrent-fencing' parameter in the Pacemaker cofiguration for HANA DB HA setup)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability-rhel).

### Set parameter PREFER_SITE_TAKEOVER to 'true' in the cluster cofiguration in HA enabled SAP workloads

The parameter PREFER_SITE_TAKEOVER in SAP HANA topology defines if the HANA SR resource agent prefers to takeover to the secondary instance instead of restarting the failed primary locally. Set it to 'true' for reliable function of HANA DB HA setup.

Learn more about [Database Instance - PreferSiteTakeoverHDB (Set parameter PREFER_SITE_TAKEOVER to 'true' in the cluster cofiguration in HA enabled SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Set 'token_retransmits_before_loss_const'  to 10 in Pacemaker cluster in HA enabled SAP workloads

The corosync token_retransmits_before_loss_const determines how many token retransmits are attempted before timeout in HA clusters. Set the totem.token_retransmits_before_loss_const to 10 as per recommendation for HANA DB HA setup.

Learn more about [Database Instance - TokenRetransmitsHDB (Set 'token_retransmits_before_loss_const'  to 10 in Pacemaker cluster in HA enabled SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Set the two_node parameter to 1 in the cluster cofiguration in HA enabled SAP workloads

In a two node HA cluster, set the quorum parameter 'two_node' to 1 as per recommendation for SAP on Azure.

Learn more about [Database Instance - TwoNodeParameterSuseHDB (Set the two_node parameter to 1 in the cluster cofiguration in HA enabled SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Enable the 'concurrent-fencing' parameter in the cluster cofiguration in HA enabled SAP workloads

The concurrent-fencing parameter when set to true, enables the fencing operations to be performed in parallel. Set this parameter to 'true' in the pacemaker cluster configuration for HANA DB HA setup.

Learn more about [Database Instance - ConcurrentFencingSuseHDB (Enable the 'concurrent-fencing' parameter in the cluster cofiguration in HA enabled SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Set the 'corosync join' in Pacemaker cluster to 60 for HA enabled HANA DB in SAP workloads

The corosync join timeout specifies in milliseconds how long to wait for join messages in the membership protocol.  We recommend that you set 60 in Pacemaker cluster configuration for HANA DB HA setup.

Learn more about [Database Instance - CorosyncHDB (Set the 'corosync join' in Pacemaker cluster to 60 for HA enabled HANA DB in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Set the 'corosync max_messages' in Pacemaker cluster to 20 for HA enabled HANA DB in SAP workloads

The corosync max_messages constant specifies the maximum number of messages allowed to be sent by one processor once the token is received.  We recommend that you set 20 times the corosync token parameter in Pacemaker cluster configuration.

Learn more about [Database Instance - CorosyncMaxMessageHDB (Set the 'corosync max_messages' in Pacemaker cluster to 20 for HA enabled HANA DB in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Set the 'corosync consensus' in Pacemaker cluster to 36000 for HA enabled HANA DB in SAP workloads

The corosync parameter 'consensus' specifies in milliseconds how long to wait for consensus to be achieved before starting a new round of membership in the cluster configuration. We recommend that you set 1.2 times the corosync token in Pacemaker cluster configuration for HANA DB HA setup.

Learn more about [Database Instance - CorosyncConsensusHDB (Set the 'corosync consensus' in Pacemaker cluster to 36000 for HA enabled HANA DB in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Create the softdog config file in Pacemaker configuration for HA enable HANA DB in SAP workloads

The softdog timer is loaded as a kernel module in linux OS. This timer  triggers a system reset if it detects that the system has hung. Ensure that the softdog configuration file is created in the Pacemaker cluster for HANA DB HA setup.

Learn more about [Database Instance - SoftdogConfigSuseHDB (Create the softdog config file in Pacemaker configuration for HA enable HANA DB in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Ensure that there is one instance of fence_azure_arm in Pacemaker configuration for HANA DB HA setup

The fence_azure_arm is an I/O fencing agent for Azure Resource Manager. Ensure that there's one instance of fence_azure_arm in the pacemaker configuration for HANA DB HA setup. The fence_azure-arm instance requirement is applicable if you're using Azure fence agent for fencing with either managed identity or service principal.

Learn more about [Database Instance - FenceAzureArmSuseHDB (Ensure that there's one instance of fence_azure_arm in Pacemaker configuration for HANA DB HA setup)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Ensure the softdog module is loaded in for Pacemaker in HA enabled HANA DB in SAP workloads

The softdog timer is loaded as a kernel module in linux OS. This timer  triggers a system reset if it detects that the system has hung. First ensure that you created the softdog configuration file, then load the softdog module in the Pacemaker configuration for HANA DB HA setup.

Learn more about [Database Instance - SoftdogModuleSuseHDB (Ensure the softdog module is loaded in for Pacemaker in HA enabled HANA DB in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Set the Idle timeout in Azure Load Balancer to 30 minutes for HANA DB HA setup in SAP workloads

To prevent load balancer timeout, make sure that all Azure Load Balancing Rules have: 'Idle timeout (minutes)' set to the maximum value of 30 minutes. Open the load balancer, select 'load balancing rules' and add/edit the rule to enable the recommended settings.

Learn more about [Database Instance - DBHASetIdleTimeOutLB (Set the Idle timeout in Azure Load Balancer to 30 minutes for HANA DB HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Enable Floating IP in the Azure Load balancer for HANA DB HA setup in SAP workloads

Enable floating IP in the load balancing rules for the Azure Load Balancer for HA set up of HANA DB instance in SAP workloads. Open the load balancer, select 'load balancing rules' and add/edit the rule to enable the recommended settings.

Learn more about [Database Instance - DBHAEnableFloatingIpLB (Enable Floating IP in the Azure Load balancer for HANA DB HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Enable HA ports in the Azure Load Balancer for HANA DB HA setup in SAP workloads

Enable HA ports in the Load balancing rules for HA set up of HANA DB instance in SAP workloads. Open the load balancer, select 'load balancing rules' and add/edit the rule to enable the recommended settings.

Learn more about [Database Instance - DBHAEnableLBPorts (Enable HA ports in the Azure Load Balancer for HANA DB HA setup in SAP workloads)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).

### Disable TCP timestamps on VMs placed behind Azure Load Balancer in HANA DB HA setup in SAP workloads

Disable TCP timestamps on VMs placed behind Azure Load Balancer. Enabled TCP timestamps cause the health probes to fail due to TCP packets being dropped by the VM's guest OS TCP stack. Dropped TCP packets cause the load balancer to mark the endpoint as down.

Learn more about [Database Instance - DBLBHADisableTCP (Disable TCP timestamps on VMs placed behind Azure Load Balancer in HANA DB HA setup in SAP workloads)](/azure/load-balancer/load-balancer-custom-probe-overview).

### There should be one instance of fence_azure_arm in Pacemaker configuration for HANA DB HA setup

fence_azure_arm is an I/O fencing agent for Azure Resource Manager. Ensure that there is one instance of fence_azure_arm in the pacemaker configuration for HANA DB HA setup. This is applicable if you are using Azure fence agent for fencing with either managed identity or service principal.

Learn more about [Database Instance - FenceAzureArmSuseHDB (There should be one instance of fence_azure_arm in Pacemaker configuration for HANA DB HA setup)](/azure/virtual-machines/workloads/sap/sap-hana-high-availability).


## Storage

### Enable soft delete for your Recovery Services vaults

The soft delete option helps you retain your backup data in the Recovery Services vault for an extra duration after deletion. The extra duration gives you an opportunity to retrieve the data before it's permanently deleted.

Learn more about [Recovery Services vault - AB-SoftDeleteRsv (Enable soft delete for your Recovery Services vaults)](../backup/backup-azure-security-feature-cloud.md).

### Enable Cross Region Restore for your recovery Services Vault

Enabling cross region restore for your geo-redundant vaults.

Learn more about [Recovery Services vault - Enable CRR (Enable Cross Region Restore for your Recovery Services Vault)](../backup/backup-azure-arm-restore-vms.md#cross-region-restore).

### Enable Backups on your virtual machines

Enable backups for your virtual machines and secure your data.

Learn more about [Virtual machine (classic) - EnableBackup (Enable Backups on your virtual machines)](../backup/backup-overview.md).

### Configure blob backup

Configure blob backup.

Learn more about [Storage Account - ConfigureBlobBackup (Configure blob backup)](/azure/backup/blob-backup-overview).

### Turn on Azure Backup to get simple, reliable, and cost-effective protection for your data

Keep your information and applications safe with robust, one click backup from Azure.  Activate Azure Backup to get cost-effective protection for a wide range of workloads including VMs, SQL databases, applications, and file shares.

Learn more about [Subscription - AzureBackupService (Turn on Azure Backup to get simple, reliable, and cost-effective protection for your data)](/azure/backup/).

### You have ADLS Gen1 Accounts Which Need to be Migrated to ADLS Gen2

As previously announced, Azure Data Lake Storage Gen1 will be retired on February 29, 2024. We highly recommend that you migrate your data lake to Azure Data Lake Storage Gen2. Azure Data Lake Storage Gen2 offers advanced capabilities  designed for big data analytics, and is built on top of Azure Blob Storage.

Learn more about [Data lake store account - ADLSGen1_Deprecation (You have ADLS Gen1 Accounts Which Needs to be Migrated to ADLS Gen2)](https://azure.microsoft.com/updates/action-required-switch-to-azure-data-lake-storage-gen2-by-29-february-2024/).

### You have ADLS Gen1 Accounts Which Need to be Migrated to ADLS Gen2

As previously announced, Azure Data Lake Storage Gen1 will be retired on February 29, 2024. We highly recommend that you migrate your data lake to Azure Data Lake Storage Gen2, which offers advanced capabilities specifically designed for big data analytics, and is built on top of Azure Blob Storage.

Learn more about [Data lake store account - ADLSGen1_Deprecation (You have ADLS Gen1 Accounts Which Needs to be Migrated to ADLS Gen2)](https://azure.microsoft.com/updates/action-required-switch-to-azure-data-lake-storage-gen2-by-29-february-2024/).

### Enable Soft Delete to protect your blob data

After enabling the soft delete option, deleted data transitions to a soft deleted state instead of being permanently deleted. When data is overwritten, a soft deleted snapshot is generated to save the state of the overwritten data. You can configure the amount of time soft deleted data is recoverable before it permanently expires.

Learn more about [Storage Account - StorageSoftDelete (Enable Soft Delete to protect your blob data)](https://aka.ms/softdelete).

### Use Managed Disks for storage accounts reaching capacity limit

We have identified that you're using Premium SSD Unmanaged Disks in Storage account(s) that are about to reach Premium Storage capacity limit. To avoid failures when the limit is reached, we recommend migrating to Managed Disks that don't have account capacity limit. This migration can be done through the portal in less than 5 minutes.

Learn more about [Storage Account - StoragePremiumBlobQuotaLimit (Use Managed Disks for storage accounts reaching capacity limit)](https://aka.ms/premium_blob_quota).

### Use Managed Disks to improve data reliability 

Virtual machines in an Availability Set with disks that share either storage accounts or storage scale units aren't resilient to single storage scale unit failures during outages. Migrate to Azure Managed Disks to ensure that the disks of different VMs in the Availability Set are sufficiently isolated to avoid a single point of failure.

Learn more about [Availability set - ManagedDisksAvSet (Use Managed Disks to improve data reliability)](https://aka.ms/aa_avset_manageddisk_learnmore).

### Implement disaster recovery strategies for your Azure NetApp Files Resources

To avoid data or functionality loss in the event of a regional or zonal disaster, implement common disaster recovery techniques such as cross region replication or cross zone replication for your Azure NetApp Files volumes

Learn more about [Volume - ANFCRRCZRRecommendation (Implement disaster recovery strategies for your Azure NetApp Files Resources)](https://aka.ms/anfcrr).

### Azure NetApp Files Enable Continuous Availability for SMB Volumes

Recommendation to enable SMB volume for Continuous Availability.

Learn more about [Volume - anfcaenablement (Azure NetApp Files Enable Continuous Availability for SMB Volumes)](https://aka.ms/anfdoc-continuous-availability).

### Review SAP configuration for timeout values used with Azure NetApp Files

High availability of SAP while used with Azure NetApp Files relies on setting proper timeout values to prevent disruption to your application. Review the documentation to ensure your configuration meets the timeout values as noted in the documentation.

Learn more about [Volume - SAPTimeoutsANF (Review SAP configuration for timeout values used with Azure NetApp Files)](/azure/sap/workloads/get-started).




## Web

### Consider scaling out your App Service Plan to avoid CPU exhaustion

Your App reached >90% CPU over the last couple of days. High CPU utilization can lead to runtime issues with your apps, to solve this you could scale out your app.

Learn more about [App service - AppServiceCPUExhaustion (Consider scaling out your App Service Plan to avoid CPU exhaustion)](https://aka.ms/antbc-cpu).

### Fix the backup database settings of your App Service resource

Your app's backups are consistently failing due to invalid DB configuration, you can find more details in backup history.

Learn more about [App service - AppServiceFixBackupDatabaseSettings (Fix the backup database settings of your App Service resource)](https://aka.ms/antbc).

### Consider scaling up your App Service Plan SKU to avoid memory exhaustion

The App Service Plan containing your app reached >85% memory allocated. High memory consumption can lead to runtime issues with your apps. Investigate which app in the App Service Plan is exhausting memory and scale up to a higher plan with more memory resources if needed.

Learn more about [App service - AppServiceMemoryExhaustion (Consider scaling up your App Service Plan SKU to avoid memory exhaustion)](https://aka.ms/antbc-memory).

### Scale up your App Service resource to remove the quota limit

Your app is part of a shared App Service plan and has met its quota multiple times. Once quota is met, your web app can’t accept incoming requests. To remove the quota, upgrade to a Standard plan.

Learn more about [App service - AppServiceRemoveQuota (Scale up your App Service resource to remove the quota limit)](https://aka.ms/ant-asp).

### Use deployment slots for your App Service resource

You have deployed your application multiple times over the last week. Deployment slots help you manage changes and help you reduce deployment impact to your production web app.

Learn more about [App service - AppServiceUseDeploymentSlots (Use deployment slots for your App Service resource)](https://aka.ms/ant-staging).

### Fix the backup storage settings of your App Service resource

Your app's backups are consistently failing due to invalid storage settings, you can find more details in backup history.

Learn more about [App service - AppServiceFixBackupStorageSettings (Fix the backup storage settings of your App Service resource)](https://aka.ms/antbc).

### Move your App Service resource to Standard or higher and use deployment slots

You have deployed your application multiple times over the last week. Deployment slots help you manage changes and help you reduce deployment impact to your production web app.

Learn more about [App service - AppServiceStandardOrHigher (Move your App Service resource to Standard or higher and use deployment slots)](https://aka.ms/ant-staging).

### Consider scaling out your App Service Plan to optimize user experience and availability

Consider scaling out your App Service Plan to at least two instances to avoid cold start delays and service interruptions during routine maintenance.

Learn more about [App Service plan - AppServiceNumberOfInstances (Consider scaling out your App Service Plan to optimize user experience and availability.)](https://aka.ms/appsvcnuminstances).

### Application code needs fixing when the worker process crashes due to Unhandled Exception

We identified the following thread that resulted in an unhandled exception for your App and the application code must be fixed to prevent impact to application availability. A crash happens when an exception in your code terminates the process.

Learn more about [App service - AppServiceProactiveCrashMonitoring (Application code must be fixed as worker process crashed due to Unhandled Exception)](https://azure.github.io/AppService/2020/08/11/Crash-Monitoring-Feature-in-Azure-App-Service.html).

### Consider changing your App Service configuration to 64-bit

We identified your application is running in 32-bit and the memory is reaching the 2GB limit. Consider switching to 64-bit processes so you can take advantage of the extra memory available in your Web Worker role. This action triggers a web app restart, so schedule accordingly.

Learn more about [App service 32-bit limitations](/troubleshoot/azure/app-service/web-apps-performance-faqs#i-see-the-message-worker-process-requested-recycle-due-to-percent-memory-limit-how-do-i-address-this-issue).

### Upgrade your Azure Fluid Relay client library

You have recently invoked the Azure Fluid Relay service with an old client library. Your Azure Fluid Relay client library must now be upgraded to the latest version to ensure your application remains operational. Upgrading provides the most up-to-date functionality and enhancements in performance and stability. For more information on the latest version to use and how to upgrade, see the following article.

Learn more about [FluidRelay Server - UpgradeClientLibrary (Upgrade your Azure Fluid Relay client library)](https://github.com/microsoft/FluidFramework).

### Consider upgrading the hosting plan of the Static Web App(s) in this subscription to Standard SKU

The combined bandwidth used by all the Free SKU Static Web Apps in this subscription is exceeding the monthly limit of 100GB. Consider upgrading these apps to Standard SKU to avoid throttling.

Learn more about [Static Web App - StaticWebAppsUpgradeToStandardSKU (Consider upgrading the hosting plan of the Static Web App(s) in this subscription to Standard SKU.)](https://azure.microsoft.com/pricing/details/app-service/static/).


## Next steps

Learn more about [Reliability - Microsoft Azure Well Architected Framework](/azure/architecture/framework/resiliency/overview)
