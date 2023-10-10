---
title: Reliability recommendations
description: Full list of available reliability recommendations in Advisor.
ms.topic: article
ms.custom: ignite-2022
ms.date: 02/04/2022
---

# Reliability recommendations

Azure Advisor helps you ensure and improve the continuity of your business-critical applications. You can get reliability recommendations on the **Reliability** tab on the Advisor dashboard.

1. Sign in to the [**Azure portal**](https://portal.azure.com).

1. Search for and select [**Advisor**](https://aka.ms/azureadvisordashboard) from any page.

1. On the **Advisor** dashboard, select the **Reliability** tab.

## FarmBeats / Azure Data Manager for Agriculture (ADMA)

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

## API Management


### SSL/TLS renegotiation blocked

SSL/TLS renegotiation attempt blocked. Renegotiation happens when a client certificate is requested over an already established connection. When it is blocked, reading 'context.Request.Certificate' in policy expressions returns 'null'. To support client certificate authentication scenarios, enable 'Negotiate client certificate' on listed hostnames. For browser-based clients, enabling this option might result in a certificate prompt being presented to the client.

Learn more about [Api Management - TlsRenegotiationBlocked (SSL/TLS renegotiation blocked)](/azure/api-management/api-management-howto-mutual-certificates-for-clients).

### Hostname certificate rotation failed

API Management service failed to refresh hostname certificate from Key Vault. Ensure that certificate exists in Key Vault and API Management service identity is granted secret read access. Otherwise, API Management service cannot retrieve certificate updates from Key Vault, which may lead to the service using stale certificate and runtime API traffic being blocked as a result.

Learn more about [Api Management - HostnameCertRotationFail (Hostname certificate rotation failed)](https://aka.ms/apimdocs/customdomain).

## App

### Increase the minimal replica count for your container app

We detected the minimal replica count set for your container app may be lower than optimal. Consider increasing the minimal replica count for better availability.

Learn more about [Resource - ContainerAppMinimalReplicaCountTooLow (Increase the minimal replica count for your container app)](https://aka.ms/containerappscalingrules).

## Cache for Redis

### Availability may be impacted from high memory fragmentation. Increase fragmentation memory reservation to avoid potential impact.

Fragmentation and memory pressure can cause availability incidents during a failover or management operations. Increasing reservation of memory for fragmentation helps in reducing the cache failures when running under high memory pressure. Memory for fragmentation can be increased via maxfragmentationmemory-reserved setting available in advanced settings blade.

Learn more about [Redis Cache Server - RedisCacheMemoryFragmentation (Availability may be impacted from high memory fragmentation. Increase fragmentation memory reservation to avoid potential impact.)](https://aka.ms/redis/recommendations/memory-policies).

## CDN

### Switch Secret version to ‘Latest’ for the Azure Front Door customer certificate

We recommend configuring the Azure Front Door customer certificate secret to ‘Latest’ for the AFD to refer to the latest secret version in Azure Key Vault, so that the secret can be automatically rotated.

Learn more about [Front Door Profile - SwitchVersionBYOC (Switch Secret version to ‘Latest’ for the Azure Front Door customer certificate)](/azure/frontdoor/standard-premium/how-to-configure-https-custom-domain#certificate-renewal-and-changing-certificate-types).
## Compute

### Migrate Virtual Machines to Availability Zones

By migrating virtual machines to Availability Zones, you can ensure the isolation of your VMs from potential failures in other zones. With this, you can expect enhanced resiliency in your workload by avoiding downtime and business interruptions. 

Learn more about [Availability Zones](../reliability/availability-zones-overview.md).

### Enable Backups on your Virtual Machines

Enable backups for your virtual machines and secure your data

Learn more about [Virtual machine (classic) - EnableBackup (Enable Backups on your Virtual Machines)](../backup/backup-overview.md).

### Upgrade the standard disks attached to your premium-capable VM to premium disks

We have identified that you are using standard disks with your premium-capable Virtual Machines and we recommend you consider upgrading the standard disks to premium disks. For any Single Instance Virtual Machine using premium storage for all Operating System Disks and Data Disks, we guarantee Virtual Machine Connectivity of at least 99.9%. Consider these factors when making your upgrade decision. The first is that upgrading requires a VM reboot and this process takes 3-5 minutes to complete. The second is if the VMs in the list are mission-critical production VMs, evaluate the improved availability against the cost of premium disks.

Learn more about [Virtual machine - MigrateStandardStorageAccountToPremium (Upgrade the standard disks attached to your premium-capable VM to premium disks)](https://aka.ms/aa_storagestandardtopremium_learnmore).

### Enable virtual machine replication to protect your applications from regional outage

Virtual machines which do not have replication enabled to another region are not resilient to regional outages. Replicating the machines drastically reduce any adverse business impact during the time of an Azure region outage. We highly recommend enabling replication of all the business critical virtual machines from the below list so that in an event of an outage, you can quickly bring up your machines in remote Azure region.
Learn more about [Virtual machine - ASRUnprotectedVMs (Enable virtual machine replication to protect your applications from regional outage)](https://aka.ms/azure-site-recovery-dr-azure-vms).

### Upgrade VM from Premium Unmanaged Disks to Managed Disks at no extra cost

We have identified that your VM is using premium unmanaged disks that can be migrated to managed disks at no extra cost. Azure Managed Disks provides higher resiliency, simplified service management, higher scale target and more choices among several disk types. This upgrade can be done through the portal in less than 5 minutes.

Learn more about [Virtual machine - UpgradeVMToManagedDisksWithoutAdditionalCost (Upgrade VM from Premium Unmanaged Disks to Managed Disks at no extra cost)](https://aka.ms/md_overview).

### Update your outbound connectivity protocol to Service Tags for Azure Site Recovery

Using IP Address based filtering has been identified as a vulnerable way to control outbound connectivity for firewalls. It is advised to use Service Tags as an alternative for controlling connectivity. We highly recommend the use of Service Tags, to allow connectivity to Azure Site Recovery services for the machines.

Learn more about [Virtual machine - ASRUpdateOutboundConnectivityProtocolToServiceTags (Update your outbound connectivity protocol to Service Tags for Azure Site Recovery)](https://aka.ms/azure-site-recovery-using-service-tags).

### Use Managed Disks to improve data reliability

Virtual machines in an Availability Set with disks that share either storage accounts or storage scale units are not resilient to single storage scale unit failures during outages. Migrate to Azure Managed Disks to ensure that the disks of different VMs in the Availability Set are sufficiently isolated to avoid a single point of failure.

Learn more about [Availability set - ManagedDisksAvSet (Use Managed Disks to improve data reliability)](https://aka.ms/aa_avset_manageddisk_learnmore).

### Check Point Virtual Machine may lose Network Connectivity.

We have identified that your Virtual Machine might be running a version of Check Point image that has been known to lose network connectivity in the event of a platform servicing operation. It is recommended that you upgrade to a newer version of the image that addresses this issue. Contact Check Point for further instructions on how to upgrade your image.

Learn more about [Virtual machine - CheckPointPlatformServicingKnownIssueA (Check Point Virtual Machine may lose Network Connectivity.)](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk151752&partition=Advanced&product=CloudGuard).

### Access to mandatory URLs missing for your Azure Virtual Desktop environment

In order for a session host to deploy and register to Azure Virtual Desktop properly, you need to add a set of URLs to allowed list in case your virtual machine runs in restricted environment. After visiting the "Learn More" link, you see the minimum list of URLs you need to unblock to have a successful deployment and functional session host. For specific URL(s) missing from allowed list, you may also search Application event log for event 3702.

Learn more about [Virtual machine - SessionHostNeedsAssistanceForUrlCheck (Access to mandatory URLs missing for your Azure Virtual Desktop environment)](../virtual-desktop/safe-url-list.md).

## PostgreSQL

### Improve PostgreSQL availability by removing inactive logical replication slots

Our internal telemetry indicates that your PostgreSQL server may have inactive logical replication slots. THIS NEEDS IMMEDIATE ATTENTION. This can result in degraded server performance and unavailability due to WAL file retention and buildup of snapshot files. To improve performance and availability, we STRONGLY recommend that you IMMEDIATELY either delete the inactive replication slots, or start consuming the changes from these slots so that the slots' Log Sequence Number (LSN) advances and is close to the current LSN of the server.

Learn more about [PostgreSQL server - OrcasPostgreSqlLogicalReplicationSlots (Improve PostgreSQL availability by removing inactive logical replication slots)](https://aka.ms/azure_postgresql_logical_decoding).

### Improve PostgreSQL availability by removing inactive logical replication slots

Our internal telemetry indicates that your PostgreSQL flexible server may have inactive logical replication slots. THIS NEEDS IMMEDIATE ATTENTION. This can result in degraded server performance and unavailability due to WAL file retention and buildup of snapshot files. To improve performance and availability, we STRONGLY recommend that you IMMEDIATELY either delete the inactive replication slots, or start consuming the changes from these slots so that the slots' Log Sequence Number (LSN) advances and is close to the current LSN of the server.

Learn more about [Azure Database for PostgreSQL flexible server - OrcasPostgreSqlFlexibleServerLogicalReplicationSlots (Improve PostgreSQL availability by removing inactive logical replication slots)](https://aka.ms/azure_postgresql_flexible_server_logical_decoding).

## IoT Hub

### Upgrade device client SDK to a supported version for IotHub

Some or all of your devices are using outdated SDK and we recommend you upgrade to a supported version of SDK. See the details in the recommendation.

Learn more about [IoT hub - UpgradeDeviceClientSdk (Upgrade device client SDK to a supported version for IotHub)](https://aka.ms/iothubsdk).

## Azure Cosmos DB

### Configure Consistent indexing mode on your Azure Cosmos DB container

We noticed that your Azure Cosmos DB container is configured with the Lazy indexing mode, which may impact the freshness of query results. We recommend switching to Consistent mode.

Learn more about [Azure Cosmos DB account - CosmosDBLazyIndexing (Configure Consistent indexing mode on your Azure Cosmos DB container)](/azure/cosmos-db/how-to-manage-indexing-policy).

### Upgrade your old Azure Cosmos DB SDK to the latest version

Your Azure Cosmos DB account is using an old version of the SDK. We recommend upgrading to the latest version for the latest fixes, performance improvements, and new feature capabilities.

Learn more about [Azure Cosmos DB account - CosmosDBUpgradeOldSDK (Upgrade your old Azure Cosmos DB SDK to the latest version)](../cosmos-db/index.yml).

### Upgrade your outdated Azure Cosmos DB SDK to the latest version

Your Azure Cosmos DB account is using an outdated version of the SDK. We recommend upgrading to the latest version for the latest fixes, performance improvements, and new feature capabilities.

Learn more about [Azure Cosmos DB account - CosmosDBUpgradeOutdatedSDK (Upgrade your outdated Azure Cosmos DB SDK to the latest version)](../cosmos-db/index.yml).

### Configure your Azure Cosmos DB containers with a partition key

Your Azure Cosmos DB non-partitioned collections are approaching their provisioned storage quota. Migrate these collections to new collections with a partition key definition so that they can automatically be scaled out by the service.

Learn more about [Azure Cosmos DB account - CosmosDBFixedCollections (Configure your Azure Cosmos DB containers with a partition key)](../cosmos-db/partitioning-overview.md#choose-partitionkey).

### Upgrade your Azure Cosmos DB for MongoDB account to v4.0 to save on query/storage costs and utilize new features

Your Azure Cosmos DB for MongoDB account is eligible to upgrade to version 4.0. Upgrading to v4.0 can reduce your storage costs by up to 55% and your query costs by up to 45% by leveraging a new storage format. Numerous additional features such as multi-document transactions are also included in v4.0.

Learn more about [Azure Cosmos DB account - CosmosDBMongoSelfServeUpgrade (Upgrade your Azure Cosmos DB for MongoDB account to v4.0 to save on query/storage costs and utilize new features)](/azure/cosmos-db/mongodb-version-upgrade).

### Add a second region to your production workloads on Azure Cosmos DB

Based on their names and configuration, we have detected the Azure Cosmos DB accounts below as being potentially used for production workloads. These accounts currently run in a single Azure region. You can increase their availability by configuring them to span at least two Azure regions.

> [!NOTE]
> Additional regions incur extra costs.

Learn more about [Azure Cosmos DB account - CosmosDBSingleRegionProdAccounts (Add a second region to your production workloads on Azure Cosmos DB)](../cosmos-db/high-availability.md).

### Enable Server Side Retry (SSR) on your Azure Cosmos DB for MongoDB account

We observed your account is throwing a TooManyRequests error with the 16500 error code. Enabling Server Side Retry (SSR) can help mitigate this issue for you.

Learn more about [Azure Cosmos DB account - CosmosDBMongoServerSideRetries (Enable Server Side Retry (SSR) on your Azure Cosmos DB for MongoDB account)](/azure/cosmos-db/cassandra/prevent-rate-limiting-errors).

### Migrate your Azure Cosmos DB for MongoDB account to v4.0 to save on query/storage costs and utilize new features

Migrate your database account to a new database account to take advantage of Azure Cosmos DB for MongoDB v4.0. Upgrading to v4.0 can reduce your storage costs by up to 55% and your query costs by up to 45% by leveraging a new storage format. Numerous additional features such as multi-document transactions are also included in v4.0. When upgrading, you must also migrate the data in your existing account to a new account created using version 4.0. Azure Data Factory or Studio 3T can assist you in migrating your data.

Learn more about [Azure Cosmos DB account - CosmosDBMongoMigrationUpgrade (Migrate your Azure Cosmos DB for MongoDB account to v4.0 to save on query/storage costs and utilize new features)](/azure/cosmos-db/mongodb-feature-support-40).

### Your Azure Cosmos DB account is unable to access its linked Azure Key Vault hosting your encryption key

It appears that your key vault's configuration is preventing your Azure Cosmos DB account from contacting the key vault to access your managed encryption keys. If you've recently performed a key rotation, make sure that the previous key or key version remains enabled and available until Azure Cosmos DB has completed the rotation. The previous key or key version can be disabled after 24 hours, or after the Azure Key Vault audit logs don't show activity from Azure Cosmos DB on that key or key version anymore.

Learn more about [Azure Cosmos DB account - CosmosDBKeyVaultWrap (Your Azure Cosmos DB account is unable to access its linked Azure Key Vault hosting your encryption key)](../cosmos-db/how-to-setup-cmk.md).

### Avoid being rate limited from metadata operations

We found a high number of metadata operations on your account. Your data in Azure Cosmos DB, including metadata about your databases and collections is distributed across partitions. Metadata operations have a system-reserved request unit (RU) limit. Avoid being rate limited from metadata operations by using static Azure Cosmos DB client instances in your code and caching the names of databases and collections.

Learn more about [Azure Cosmos DB account - CosmosDBHighMetadataOperations (Avoid being rate limited from metadata operations)](/azure/cosmos-db/performance-tips).

### Use the new 3.6+ endpoint to connect to your upgraded Azure Cosmos DB for MongoDB account

We observed some of your applications are connecting to your upgraded Azure Cosmos DB for MongoDB account using the legacy 3.2 endpoint `[accountname].documents.azure.com`. Use the new endpoint `[accountname].mongo.cosmos.azure.com` (or its equivalent in sovereign, government, or restricted clouds).

Learn more about [Azure Cosmos DB account - CosmosDBMongoNudge36AwayFrom32 (Use the new 3.6+ endpoint to connect to your upgraded Azure Cosmos DB for MongoDB account)](/azure/cosmos-db/mongodb-feature-support-40).

### Upgrade to 2.6.14 version of the Async Java SDK v2 to avoid a critical issue or upgrade to Java SDK v4 as Async Java SDK v2 is being deprecated

There is a critical bug in version 2.6.13 and lower of the Azure Cosmos DB Async Java SDK v2 causing errors when a Global logical sequence number (LSN) greater than the Max Integer value is reached. This happens transparent to you by the service after a large volume of transactions occur in the lifetime of an Azure Cosmos DB container. Note: This is a critical hotfix for the Async Java SDK v2, however it is still highly recommended you migrate to the [Java SDK v4](../cosmos-db/sql/sql-api-sdk-java-v4.md).

Learn more about [Azure Cosmos DB account - CosmosDBMaxGlobalLSNReachedV2 (Upgrade to 2.6.14 version of the Async Java SDK v2 to avoid a critical issue or upgrade to Java SDK v4 as Async Java SDK v2 is being deprecated)](../cosmos-db/sql/sql-api-sdk-async-java.md).

### Upgrade to the current recommended version of the Java SDK v4 to avoid a critical issue

There is a critical bug in version 4.15 and lower of the Azure Cosmos DB Java SDK v4 causing errors when a Global logical sequence number (LSN) greater than the Max Integer value is reached. This happens transparent to you by the service after a large volume of transactions occur in the lifetime of an Azure Cosmos DB container.

Learn more about [Azure Cosmos DB account - CosmosDBMaxGlobalLSNReachedV4 (Upgrade to the current recommended version of the Java SDK v4 to avoid a critical issue)](../cosmos-db/sql/sql-api-sdk-java-v4.md).

## Fluid Relay

### Upgrade your Azure Fluid Relay client library

You have recently invoked the Azure Fluid Relay service with an old client library. Your Azure Fluid Relay client library should now be upgraded to the latest version to ensure your application remains operational. Upgrading provides the most up-to-date functionality, as well as enhancements in performance and stability. For more information on the latest version to use and how to upgrade, please refer to the article.

Learn more about [FluidRelay Server - UpgradeClientLibrary (Upgrade your Azure Fluid Relay client library)](https://github.com/microsoft/FluidFramework).

## HDInsight

### Deprecation of Kafka 1.1 in HDInsight 4.0 Kafka cluster

Starting July 1, 2020, you can't create new Kafka clusters with Kafka 1.1 on HDInsight 4.0. Existing clusters run as is without support from Microsoft. Consider moving to Kafka 2.1 on HDInsight 4.0 by June 30 2020 to avoid potential system/support interruption.

Learn more about [HDInsight cluster - KafkaVersionRetirement (Deprecation of Kafka 1.1 in HDInsight 4.0 Kafka cluster)](https://aka.ms/hdiretirekafka).

### Deprecation of Older Spark Versions in HDInsight Spark cluster

Starting July 1, 2020, you can't create new Spark clusters with Spark 2.1 and 2.2 on HDInsight 3.6, and Spark 2.3 on HDInsight 4.0. Existing clusters run as is without support from Microsoft.

Learn more about [HDInsight cluster - SparkVersionRetirement (Deprecation of Older Spark Versions in HDInsight Spark cluster)](https://aka.ms/hdiretirespark).

### Enable critical updates to be applied to your HDInsight clusters

HDInsight service is applying an important certificate related update to your cluster. However, one or more policies in your subscription are preventing HDInsight service from creating or modifying network resources (Load balancer, Network Interface and Public IP address) associated with your clusters and applying this update. Take actions to allow HDInsight service to create or modify network resources (Load balancer, Network interface and Public IP address) associated with your clusters before Jan 13, 2021 05:00 PM UTC. The HDInsight team is performing updates between Jan 13, 2021 05:00 PM UTC and Jan 16, 2021 05:00 PM UTC. Failure to apply this update may result in your clusters becoming unhealthy and unusable.

Learn more about [HDInsight cluster - GCSCertRotation (Enable critical updates to be applied to your HDInsight clusters)](../hdinsight/hdinsight-hadoop-provision-linux-clusters.md).

### Drop and recreate your HDInsight clusters to apply critical updates

The HDInsight service has attempted to apply a critical certificate update on all your running clusters. However, due to some custom configuration changes, we are unable to apply the certificate updates on some of your clusters.

Learn more about [HDInsight cluster - GCSCertRotationRound2 (Drop and recreate your HDInsight clusters to apply critical updates)](../hdinsight/hdinsight-hadoop-provision-linux-clusters.md).

### Drop and recreate your HDInsight clusters to apply critical updates

The HDInsight service has attempted to apply a critical certificate update on all your running clusters. However, due to some custom configuration changes, we are unable to apply the certificate updates on some of your clusters. Drop and recreate your cluster before Jan 25th, 2021 to prevent the cluster from becoming unhealthy and unusable.

Learn more about [HDInsight cluster - GCSCertRotationR3DropRecreate (Drop and recreate your HDInsight clusters to apply critical updates)](../hdinsight/hdinsight-hadoop-provision-linux-clusters.md).

### Apply critical updates to your HDInsight clusters

The HDInsight service has attempted to apply a critical certificate update on all your running clusters. However, one or more policies in your subscription are preventing HDInsight service from creating or modifying network resources (Load balancer, Network Interface and Public IP address) associated with your clusters and applying this update. Remove or update your policy assignment to allow HDInsight service to create or modify network resources (Load balancer, Network interface and Public IP address) associated with your clusters before Jan 21, 2021 05:00 PM UTC. The HDInsight team is performing updates between Jan 21, 2021 05:00 PM UTC and Jan 23, 2021 05:00 PM UTC. To verify the policy update, you can try to create network resources (Load balancer, Network interface and Public IP address) in the same resource group and Subnet where your cluster is in. Failure to apply this update may result in your clusters becoming unhealthy and unusable. You can also drop and recreate your cluster before Jan 25th, 2021 to prevent the cluster from becoming unhealthy and unusable. The HDInsight service sends another notification if we failed to apply the update to your clusters.

Learn more about [HDInsight cluster - GCSCertRotationR3PlanPatch (Apply critical updates to your HDInsight clusters)](../hdinsight/hdinsight-hadoop-provision-linux-clusters.md).

### Action required: Migrate your A8–A11 HDInsight cluster before 1 March 2021

You're receiving this notice because you have one or more active A8, A9, A10 or A11 HDInsight cluster. The A8-A11 virtual machines (VMs) are retired in all regions on 1 March 2021. After that date, all clusters using A8-A11 are deallocated. Migrate your affected clusters to another HDInsight supported VM (https://azure.microsoft.com/pricing/details/hdinsight/) before that date. For more details, see 'Learn More' link or contact us at askhdinsight@microsoft.com

Learn more about [HDInsight cluster - VM Deprecation (Action required: Migrate your A8–A11 HDInsight cluster before 1 March 2021)](https://azure.microsoft.com/updates/a8-a11-azure-virtual-machine-sizes-will-be-retired-on-march-1-2021/).

## Hybrid Compute

### Upgrade to the latest version of the Azure Connected Machine agent

The Azure Connected Machine agent is updated regularly with bug fixes, stability enhancements, and new functionality. Upgrade your agent to the latest version for the best Azure Arc experience.

Learn more about [Machine - Azure Arc - ArcServerAgentVersion (Upgrade to the latest version of the Azure Connected Machine agent)](../azure-arc/servers/manage-agent.md).

## Kubernetes

### Pod Disruption Budgets Recommended

Pod Disruption Budgets Recommended. Improve service high availability.

Learn more about [Kubernetes service - PodDisruptionBudgetsRecommended (Pod Disruption Budgets Recommended)](../aks/operator-best-practices-scheduler.md#plan-for-availability-using-pod-disruption-budgets).

### Upgrade to the latest agent version of Azure Arc-enabled Kubernetes

Upgrade to the latest agent version for the best Azure Arc enabled Kubernetes experience, improved stability and new functionality.

Learn more about [Kubernetes - Azure Arc - Arc-enabled K8s agent version upgrade (Upgrade to the latest agent version of Azure Arc-enabled Kubernetes)](https://aka.ms/ArcK8sAgentUpgradeDocs).

## Media Services

### Increase Media Services quotas or limits to ensure continuity of service.

Please be advised that your media account is about to hit its quota limits. Review current usage of Assets, Content Key Policies and Stream Policies for the media account. To avoid any disruption of service, you should request quota limits to be increased for the entities that are closer to hitting quota limit. You can request quota limits to be increased by opening a ticket and adding relevant details to it. Do not create additional Azure Media accounts in an attempt to obtain higher limits.

Learn more about [Media Service - AccountQuotaLimit (Increase Media Services quotas or limits to ensure continuity of service.)](https://aka.ms/ams-quota-recommendation/).

## Networking

### Upgrade your SKU or add more instances to ensure fault tolerance

Deploying two or more medium or large sized instances ensures business continuity during outages caused by planned or unplanned maintenance.

Learn more about [Application gateway - AppGateway (Upgrade your SKU or add more instances to ensure fault tolerance)](https://aka.ms/aa_gatewayrec_learnmore).

### Move to production gateway SKUs from Basic gateways

The VPN gateway Basic SKU is designed for development or testing scenarios. Move to a production SKU if you are using the VPN gateway for production purposes. The production SKUs offer higher number of tunnels, BGP support, active-active, custom IPsec/IKE policy in addition to higher stability and availability.

Learn more about [Virtual network gateway - BasicVPNGateway (Move to production gateway SKUs from Basic gateways)](https://aka.ms/aa_basicvpngateway_learnmore).

### Add at least one more endpoint to the profile, preferably in another Azure region

Profiles should have more than one endpoint to ensure availability if one of the endpoints fails. It is also recommended that endpoints be in different regions.

Learn more about [Traffic Manager profile - GeneralProfile (Add at least one more endpoint to the profile, preferably in another Azure region)](https://aka.ms/AA1o0x4).

### Add an endpoint configured to "All (World)"

For geographic routing, traffic is routed to endpoints based on defined regions. When a region fails, there is no pre-defined failover. Having an endpoint where the Regional Grouping is configured to "All (World)" for geographic profiles avoids traffic black holing and guarantee service remains available.

Learn more about [Traffic Manager profile - GeographicProfile (Add an endpoint configured to \""All (World)\"")](https://aka.ms/Rf7vc5).

### Add or move one endpoint to another Azure region

All endpoints associated to this proximity profile are in the same region. Users from other regions may experience long latency when attempting to connect. Adding or moving an endpoint to another region improves overall performance for proximity routing and provide better availability in case all endpoints in one region fail.

Learn more about [Traffic Manager profile - ProximityProfile (Add or move one endpoint to another Azure region)](https://aka.ms/Ldkkdb).

### Implement multiple ExpressRoute circuits in your Virtual Network for cross premises resiliency

We have detected that your ExpressRoute gateway only has 1 ExpressRoute circuit associated to it. Connect 1 or more additional circuits to your gateway to ensure peering location redundancy and resiliency

Learn more about [Virtual network gateway - ExpressRouteGatewayRedundancy (Implement multiple ExpressRoute circuits in your Virtual Network for cross premises resiliency)](../expressroute/designing-for-high-availability-with-expressroute.md).

### Implement ExpressRoute Monitor on Network Performance Monitor for end-to-end monitoring of your ExpressRoute circuit

We have detected that your ExpressRoute circuit is not currently being monitored by ExpressRoute Monitor on Network Performance Monitor. ExpressRoute monitor provides end-to-end monitoring capabilities including: Loss, latency, and performance from on-premises to Azure and Azure to on-premises

Learn more about [ExpressRoute circuit - ExpressRouteGatewayE2EMonitoring (Implement ExpressRoute Monitor on Network Performance Monitor for end-to-end monitoring of your ExpressRoute circuit)](../expressroute/how-to-npm.md).

### Avoid hostname override to ensure site integrity

Try to avoid overriding the hostname when configuring Application Gateway.  Having a different domain on the frontend of Application Gateway than the one which is used to access the backend can potentially lead to cookies or redirect urls being broken.  Note that this might not be the case in all situations and that certain categories of backends (like REST APIs) in general are less sensitive to this.  Make sure the backend is able to deal with this or update the Application Gateway configuration so the hostname does not need to be overwritten towards the backend.  When used with App Service, attach a custom domain name to the Web App and avoid use of the `*.azurewebsites.net` host name towards the backend.

Learn more about [Application gateway - AppGatewayHostOverride (Avoid hostname override to ensure site integrity)](https://aka.ms/appgw-advisor-usecustomdomain).

### Use ExpressRoute Global Reach to improve your design for disaster recovery

You appear to have ExpressRoute circuits peered in at least two different locations. Connect them to each other using ExpressRoute Global Reach to allow traffic to continue flowing between your on-premises network and Azure environments in the event of one circuit losing connectivity. You can establish Global Reach connections between circuits in different peering locations within the same metro or across metros.

Learn more about [ExpressRoute circuit - UseGlobalReachForDR (Use ExpressRoute Global Reach to improve your design for disaster recovery)](../expressroute/about-upgrade-circuit-bandwidth.md).

### Azure WAF RuleSet CRS 3.1/3.2 has been updated with Log4j 2 vulnerability rule

In response to Log4j 2 vulnerability (CVE-2021-44228), Azure Web Application Firewall (WAF) RuleSet CRS 3.1/3.2 has been updated on your Application Gateway to help provide additional protection from this vulnerability. The rules are available under Rule 944240 and no action is needed to enable this.

Learn more about [Application gateway - AppGwLog4JCVEPatchNotification (Azure WAF RuleSet CRS 3.1/3.2 has been updated with log4j2 vulnerability rule)](https://aka.ms/log4jcve).

### Additional protection to mitigate Log4j 2 vulnerability (CVE-2021-44228)

To mitigate the impact of Log4j 2 vulnerability, we recommend these steps:

1) Upgrade Log4j 2 to version 2.15.0 on your backend servers. If upgrade isn't possible, follow the system property guidance link below.
2) Take advantage of WAF Core rule sets (CRS) by upgrading to WAF SKU

Learn more about [Application gateway - AppGwLog4JCVEGenericNotification (Additional protection to mitigate Log4j2 vulnerability (CVE-2021-44228))](https://aka.ms/log4jcve).

### Use NAT gateway for outbound connectivity

Prevent risk of connectivity failures due to SNAT port exhaustion by using NAT gateway for outbound traffic from your virtual networks. NAT gateway scales dynamically and provides secure connections for traffic headed to the internet.

Learn more about [Virtual network - natGateway (Use NAT gateway for outbound connectivity)](/azure/load-balancer/load-balancer-outbound-connections#2-associate-a-nat-gateway-to-the-subnet).

### Enable Active-Active gateways for redundancy

In active-active configuration, both instances of the VPN gateway establish S2S VPN tunnels to your on-premises VPN device. When a planned maintenance or unplanned event happens to one gateway instance, traffic is switched over to the other active IPsec tunnel automatically.

Learn more about [Virtual network gateway - VNetGatewayActiveActive (Enable Active-Active gateways for redundancy)](https://aka.ms/aa_vpnha_learnmore).

## Recovery Services

### Enable soft delete for your Recovery Services vaults

Soft delete helps you retain your backup data in the Recovery Services vault for an additional duration after deletion, giving you an opportunity to retrieve it before it is permanently deleted.

Learn more about [Recovery Services vault - AB-SoftDeleteRsv (Enable soft delete for your Recovery Services vaults)](../backup/backup-azure-security-feature-cloud.md).

### Enable Cross Region Restore for your recovery Services Vault

Enabling cross region restore for your geo-redundant vaults

Learn more about [Recovery Services vault - Enable CRR (Enable Cross Region Restore for your recovery Services Vault)](../backup/backup-azure-arm-restore-vms.md#cross-region-restore).

## Search

### You are close to exceeding storage quota of 2GB. Create a Standard search service.

You are close to exceeding storage quota of 2GB. Create a Standard search service. Indexing operations stop working when storage quota is exceeded.

Learn more about [Search service - BasicServiceStorageQuota90percent (You are close to exceeding storage quota of 2GB. Create a Standard search service.)](https://aka.ms/azs/search-limits-quotas-capacity).

### You are close to exceeding storage quota of 50MB. Create a Basic or Standard search service.

You are close to exceeding storage quota of 50MB. Create a Basic or Standard search service. Indexing operations stop working when storage quota is exceeded.

Learn more about [Search service - FreeServiceStorageQuota90percent (You are close to exceeding storage quota of 50MB. Create a Basic or Standard search service.)](https://aka.ms/azs/search-limits-quotas-capacity).

### You are close to exceeding your available storage quota. Add additional partitions if you need more storage.

You are close to exceeding your available storage quota. Add additional partitions if you need more storage. After exceeding storage quota, you can still query, but indexing operations no longer work.

Learn more about [Search service - StandardServiceStorageQuota90percent (You are close to exceeding your available storage quota. Add additional partitions if you need more storage.)](https://aka.ms/azs/search-limits-quotas-capacity).

## Storage

### Enable Soft Delete to protect your blob data

After enabling Soft Delete, deleted data transitions to a soft deleted state instead of being permanently deleted. When data is overwritten, a soft deleted snapshot is generated to save the state of the overwritten data. You can configure the amount of time soft deleted data is recoverable before it permanently expires.

Learn more about [Storage Account - StorageSoftDelete (Enable Soft Delete to protect your blob data)](https://aka.ms/softdelete).

### Use Managed Disks for storage accounts reaching capacity limit

We have identified that you are using Premium SSD Unmanaged Disks in Storage account(s) that are about to reach Premium Storage capacity limit. To avoid failures when the limit is reached, we recommend migrating to Managed Disks that do not have account capacity limit. This migration can be done through the portal in less than 5 minutes.

Learn more about [Storage Account - StoragePremiumBlobQuotaLimit (Use Managed Disks for storage accounts reaching capacity limit)](https://aka.ms/premium_blob_quota).

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

### Consider scaling out your App Service Plan to optimize user experience and availability.

Consider scaling out your App Service Plan to at least two instances to avoid cold start delays and service interruptions during routine maintenance.

Learn more about [App Service plan - AppServiceNumberOfInstances (Consider scaling out your App Service Plan to optimize user experience and availability.)](https://aka.ms/appsvcnuminstances).

### Consider upgrading the hosting plan of the Static Web App(s) in this subscription to Standard SKU.

The combined bandwidth used by all the Free SKU Static Web Apps in this subscription is exceeding the monthly limit of 100GB. Consider upgrading these apps to Standard SKU to avoid throttling.

Learn more about [Static Web App - StaticWebAppsUpgradeToStandardSKU (Consider upgrading the hosting plan of the Static Web App(s) in this subscription to Standard SKU.)](https://azure.microsoft.com/pricing/details/app-service/static/).

### Application code should be fixed as worker process crashed due to Unhandled Exception

We identified the below thread resulted in an unhandled exception for your App and application code should be fixed to prevent impact to application availability. A crash happens when an exception in your code goes un-handled and terminates the process.

Learn more about [App service - AppServiceProactiveCrashMonitoring (Application code should be fixed as worker process crashed due to Unhandled Exception)](https://azure.github.io/AppService/2020/08/11/Crash-Monitoring-Feature-in-Azure-App-Service.html).

### Consider changing your App Service configuration to 64-bit

We identified your application is running in 32-bit and the memory is reaching the 2GB limit. 
Consider switching to 64-bit processes so you can take advantage of the additional memory available in your Web Worker role. This action triggers a web app restart, so schedule accordingly.

Learn more about [App service 32-bit limitations](/troubleshoot/azure/app-service/web-apps-performance-faqs#i-see-the-message-worker-process-requested-recycle-due-to-percent-memory-limit-how-do-i-address-this-issue).

## Next steps

Learn more about [Reliability - Microsoft Azure Well Architected Framework](/azure/architecture/framework/resiliency/overview)
