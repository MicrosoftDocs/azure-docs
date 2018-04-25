# Disaster Recovery and Geo-Distribution

## Overview

In Azure Durable Functions, all state is persisted in Azure Storage. A task hub is a logical container for Azure Storage resources that are used for orchestrations. Orchestrator and activity functions can only interact with each other when they belong to the same task hub.
The scenarios described in this article propose deployment options to increase availability and minimize downtime during disaster recovery activities.
It is important to notice that these scenarios are based on an Active-Passive configuration, since the underlying storage strategy makes it difficult to implement other approaches.

##Scenario 1 - Load Balanced Compute with Shared Storage
In the event of problems of the compute service in Azure, the Function App could be affected. To minimize the possibility of such downtime, this scenario uses two instances of the Function App deployed to different regions. The underlying storage account and task hub are created in the main region, and it is shared by both instances.
Traffic Manager is configured to detect problems in the main site and automatically redirect traffic to the healthy Function App in the failover region.
Because Function App the failover region shares the same Azure Storage account and Task Hub, the state of the functions is not lost, and word can resume normally. Once the health is restored in the main region, Traffic Manager will start routing requests to that instance of the Function App automatically.

There are several benefits when using this deployment scenario:
- In the case of a failure in the compute layer, work can resume in the failover region without state loss.
- Traffic Manager takes care of the automatic failover to the healthy instance automatically.
- Traffic Manager automatically re-establishes traffic to the main Function App after the outage has been corrected.

However, consider the following when using this scenario.
- If the Function App is deployed using a dedicated AppService plan, there is an increased cost by replicating the compute instance in the failover datacenter.
- This scenario covers outages at the compute layer, but the storage account continues to be the single point of failure for the Function App. If there is a Storage outage, the application suffers a downtime.
- If the FunctionApp is failed over, there will be increased latency since it will access its storage account across regions.
- Accessing the storage service from a different region where it is located incurs in higher cost due to network egress traffic.
- This scenario depends on Traffic Manager. Considering [how Traffic Manager works](https://docs.microsoft.com/en-us/azure/traffic-manager/traffic-manager-overview#how-traffic-manager-works), it may be some time until a client application that consumes a Durable Function needs to re-query the FunctionApp address from Traffic Manager. 


## Scenario 2 - Load Balanced Compute with Regional Storage
### Traffic Manager, Load Balanced Function Apps, One Storage account per region
The previous proposed scenario covers only the case of failure in the compute services. If the storage service fails, it will result in a downtime of the FunctionApp.
To ensure continuous operation of the durable functions, this scenario uses a local storage account on each region to which the FunctionApps are deployed.

Each function app deployment has a dedicated Storage account and deployed in the same region

Pros:
- Automatic failover to the secondary region, where function app is deployed. 
- High-availabily, in case of both compute and storage failures
 

Cons:
- When hosting it on a dedicated App Service Plan, it brings increased costs.
- State is lost (primary region) not kept in sync

## Improved Recovery Option
- Same scenarios, but using RA-GRS for storage -> improves recoverability
- Read-access geo-redundant storage (RA-GRS) maximizes availability for your storage account. RA-GRS provides read-only access to the data in the secondary location, in addition to geo-replication across two regions.
