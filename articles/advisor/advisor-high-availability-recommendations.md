---
title: Improve reliability of your application with Advisor
description: Use Azure Advisor to ensure and improve reliability in your business-critical Azure deployments.
ms.topic: article
ms.custom: devx-track-dotnet, devx-track-extended-java
ms.date: 10/26/2021
---

# Improve the reliability of your application by using Azure Advisor

Azure Advisor helps you ensure and improve the continuity of your business-critical applications. You can get reliability recommendations on the **Reliability** tab of the [Azure Advisor](https://aka.ms/azureadvisordashboard).

## Check the version of your Check Point network virtual appliance image

Advisor can identify whether your virtual machine is running a version of the Check Point image that has been known to lose network connectivity during platform servicing operations. The Advisor recommendation will help you upgrade to a newer version of the image that addresses this problem. This check will ensure business continuity through better network connectivity.

## Ensure application gateway fault tolerance

This recommendation ensures the business continuity of mission-critical applications that are powered by application gateways. Advisor identifies application gateway instances that aren't configured for fault tolerance. It then suggests remediation actions that you can take. Advisor identifies medium or large single-instance application gateways and recommends adding at least one more instance. It also identifies single-instance and multiple-instance small application gateways and recommends migrating them to medium or large SKUs. Advisor recommends these actions to ensure your application gateway instances are configured to satisfy the current SLA requirements for these resources.

## Protect your virtual machine data from accidental deletion

Setting up virtual machine backup ensures the availability of your business-critical data and offers protection against accidental deletion or corruption. Advisor identifies virtual machines where backup isn't enabled and recommends enabling backup. 

## Ensure you have access to Azure experts when you need it

When you're running a business-critical workload, it's important to have access to technical support when you need it. Advisor identifies potential business-critical subscriptions that don't have technical support included in their support plans. It recommends upgrading to an option that includes technical support.

## Create Azure Service Health alerts to be notified when Azure problems affect you

We recommend setting up Azure Service Health alerts so you're notified when Azure service problems affect you. [Azure Service Health](https://azure.microsoft.com/features/service-health/) is a free service that provides personalized guidance and support when you're affected by an Azure service problem. Advisor identifies subscriptions that don't have alerts configured and recommends configuring them.

## Configure Traffic Manager endpoints for resiliency

Azure Traffic Manager profiles with more than one endpoint experience higher availability if any given endpoint fails. Placing endpoints in different regions further improves service reliability. Advisor identifies Traffic Manger profiles where there's only one endpoint and recommends adding at least one more endpoint in another region.

If all endpoints in a Traffic Manager profile that's configured for proximity routing are in the same region, users from other regions might experience connection delays. Adding or moving an endpoint to another region will improve overall performance and provide better availability if all endpoints in one region fail. Advisor identifies Traffic Manager profiles configured for proximity routing where all the endpoints are in the same region. It recommends adding or moving an endpoint to another Azure region.

If a Traffic Manager profile is configured for geographic routing, traffic is routed to endpoints based on defined regions. If a region fails, there's no predefined failover. If you have an endpoint where the Regional Grouping is configured to **All (World)**, you can avoid dropped traffic and improve service availability. Advisor identifies Traffic Manager profiles configured for geographic routing where there's no endpoint configured to have the Regional Grouping as **All (World)**. It recommends changing the configuration to make an endpoint **All (World)**.

## Use soft delete on your Azure storage account to save and recover data after accidental overwrite or deletion

Enable [soft delete](../storage/blobs/soft-delete-blob-overview.md) on your storage account so that deleted blobs transition to a soft deleted state instead of being permanently deleted. When data is overwritten, a soft deleted snapshot is generated to save the state of the overwritten data. Using soft delete allows you to recover from accidental deletions or overwrites. Advisor identifies Azure storage accounts that don't have soft delete enabled and suggests that you enable it.

## Configure your VPN gateway to active-active for connection resiliency

In active-active configuration, both instances of a VPN gateway establish S2S VPN tunnels to your on-premises VPN device. When a planned maintenance event or unplanned event happens to one gateway instance, traffic is automatically switched to the other active IPsec tunnel. Azure Advisor identifies VPN gateways that aren't configured as active-active and suggests that you configure them for high availability.

## Use production VPN gateways to run your production workloads

Azure Advisor checks for any VPN gateways that use a Basic SKU and recommends that you use a production SKU instead. The Basic SKU is designed for development and testing. Production SKUs offer:
- More tunnels. 
- BGP support. 
- Active-active configuration options. 
- Custom Ipsec/IKE policy. 
- Higher stability and availability.

## Ensure reliable outbound connectivity with VNet NAT
Using default outbound connecitivty provided by a Standard Load Balancer or other Azure resources is not recommended for production workloads as this causes connection failures (also called SNAT port exhaustion). The recommended approach is using a VNet NAT which will prevent any failures of connectivity in this regard. NAT can scale seamlessly to ensure your application is never out ports. [Learn more about VNet NAT](../virtual-network/nat-gateway/nat-overview.md).

## Ensure virtual machine fault tolerance (temporarily disabled)

To provide redundancy for your application, we recommend that you group two or more virtual machines in an availability set. Advisor identifies virtual machines that aren't part of an availability set and recommends moving them into one. This configuration ensures that during either planned or unplanned maintenance, at least one virtual machine is available and meets the Azure virtual machine SLA. You can choose to create an availability set for the virtual machine or to add the virtual machine to an existing availability set.

> [!NOTE]
> If you choose to create an availability set, you need to add at least one more virtual machine into it. We recommend that you group two or more virtual machines in an availability set to ensure that at least one machine is available during an outage.

## Ensure availability set fault tolerance (temporarily disabled)

To provide redundancy for your application, we recommend that you group two or more virtual machines in an availability set. Advisor identifies availability sets that contain a single virtual machine and recommends adding one or more virtual machines to it. This configuration ensures that during either planned or unplanned maintenance, at least one virtual machine is available and meets the Azure virtual machine SLA. You can choose to create a virtual machine or to add an existing virtual machine to the availability set.  

## Use managed disks to improve data reliability

Virtual machines in an availability set with disks that share either storage accounts or storage scale units are not resilient to single storage scale unit failures during outages. Migrate to Azure managed disks to ensure that the disks of different VMs in the availability set are sufficiently isolated to avoid a single point of failure.

## Repair invalid log alert rules

Azure Advisor detects log alert rules that have invalid queries specified in their condition section. 
Azure Monitor log alert rules run queries at specified frequency and fire alerts based on the results. Queries can become invalid over time because of changes in the referenced resources, tables, or commands. Advisor recommends corrections for alert queries to prevent the rules from being automatically disabled and to ensure monitoring coverage. For more information, see [Troubleshooting alert rules](../azure-monitor/alerts/alerts-troubleshoot-log.md#query-used-in-a-log-alert-isnt-valid)

## Configure Consistent indexing mode on your Azure Cosmos DB collection

Configuring Azure Cosmos DB containers with Lazy indexing mode might affect the freshness of query results. Advisor detects containers configured this way and recommends switching to Consistent mode. [Learn more about indexing policies in Azure Cosmos DB.](../cosmos-db/how-to-manage-indexing-policy.md)

## Configure your Azure Cosmos DB containers with a partition key

Azure Advisor identifies Azure Cosmos DB non-partitioned collections that are approaching their provisioned storage quota. It recommends that you migrate these collections to new collections with a partition key definition so that they can be automatically scaled out by the service. [Learn more about choosing a partition key.](../cosmos-db/partitioning-overview.md)

## Upgrade your Azure Cosmos DB .NET SDK to the latest version from NuGet

Azure Advisor identifies Azure Cosmos DB accounts that are using old versions of the .NET SDK. It recommends that you upgrade to the latest version from NuGet for the latest fixes, performance improvements, and feature capabilities. [Learn more about Azure Cosmos DB .NET SDK.](../cosmos-db/sql-api-sdk-dotnet-standard.md)

## Upgrade your Azure Cosmos DB Java SDK to the latest version from Maven

Azure Advisor identifies Azure Cosmos DB accounts that are using old versions of the Java SDK. It recommends that you upgrade to the latest version from Maven for the latest fixes, performance improvements, and feature capabilities. [Learn more about Azure Cosmos DB Java SDK.](../cosmos-db/sql-api-sdk-java-v4.md)

## Upgrade your Azure Cosmos DB Spark connector to the latest version from Maven

Azure Advisor identifies Azure Cosmos DB accounts that are using old versions of the Azure Cosmos DB Spark connector. It recommends that you upgrade to the latest version from Maven for the latest fixes, performance improvements, and feature capabilities. [Learn more about Azure Cosmos DB Spark connector.](../cosmos-db/create-sql-api-spark.md)

## Consider moving to Kafka 2.1 on HDInsight 4.0

Starting July 1, 2020, you won't be able to create new Kafka clusters by using Kafka 1.1 on Azure HDInsight 4.0. Existing clusters will run as is without support from Microsoft. Consider moving to Kafka 2.1 on HDInsight 4.0 by June 30, 2020, to avoid potential system/support interruption.

## Consider upgrading older Spark versions in HDInsight Spark clusters

Starting July 1, 2020, you won't be able to create new Spark clusters by using Spark 2.1 or 2.2 on HDInsight 3.6. You won't be able to create new Spark clusters by using Spark 2.3 on HDInsight 4.0. Existing clusters will run as is without support from Microsoft. 

## Enable virtual machine replication
Virtual machines that don't have replication enabled to another region aren't resilient to regional outages. Replicating virtual machines reduces any adverse business impact during Azure region outages. Advisor detects VMs on which replication isn't enabled and recommends enabling it. When you enable replication, if there's an outage, you can quickly bring up your virtual machines in a remote Azure region. [Learn more about virtual machine replication.](../site-recovery/azure-to-azure-quickstart.md)

## Upgrade to the latest version of the Azure Connected Machine agent
The [Azure Connected Machine agent](../azure-arc/servers/manage-agent.md) is updated regularly with bug fixes, stability enhancements, and new functionality. We have identified resources which are not working on the latest version of machine agent and this Advisor recommendation will suggest you to upgrade your agent to the latest version for the best Azure Arc experience.

## Do not override hostname to ensure website integrity
Advisor recommend to try avoid overriding the hostname when configuring Application Gateway. Having a different domain on the frontend of Application Gateway than the one which is used to access the backend can potentially lead to cookies or redirect URLs being broken. Note that this might not be the case in all situations and that certain categories of backends (like REST API's) in general are less sensitive to this. Please make sure the backend is able to deal with this or update the Application Gateway configuration so the hostname does not need to be overwritten towards the backend. When used with App Service, attach a custom domain name to the Web App and avoid use of the `*.azurewebsites.net` host name towards the backend. [Learn more about custom domain](../application-gateway/troubleshoot-app-service-redirection-app-service-url.md).

## Next steps

For more information about Advisor recommendations, see:
* [Introduction to Advisor](advisor-overview.md)
* [Get started with Advisor](advisor-get-started.md)
* [Advisor score](azure-advisor-score.md)
* [Advisor cost recommendations](advisor-cost-recommendations.md)
* [Advisor performance recommendations](advisor-performance-recommendations.md)
* [Advisor security recommendations](advisor-security-recommendations.md)
* [Advisor operational excellence recommendations](advisor-operational-excellence-recommendations.md)
