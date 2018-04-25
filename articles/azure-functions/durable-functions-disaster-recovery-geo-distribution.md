# Disaster Recovery and Geo-Distribution Documentation (TODO)

##Overview

In Azure Durable Functions, all state is persisted in Azure Storage. A task hub is a logical container for Azure Storage resources that are used for orchestrations. Orchestrator and activity functions can only interact with each other when they belong to the same task hub.
The scenarios described in this article propose deployment options to increase availability and minimize downtime during disaster recovery activities.

If the whole DC goes down, you'll lose access to both compute and storage, so all in progress orchestrations will be effectively stopped.
When the DC comes back up processing will continue automatically from where it left off. There will be no data loss as long as the underlying Azure Storage data isn't lost (which is highly unlikely).
Multiple function apps cannot collaborate on the same task hub today. For geo/disaster recovery, you will want to go with multiple storage accounts - one in each geo region. It's up to you to decide how you want to configure Traffic Manager (failover mode or geo-load balancing). Just remember that the two environments are completely isolated from each other.

##Scenario 1 - Load Balanced Compute with Shared Storage
//Traffic Manager, Load Balanced Funcion Apps, Single Storage
In the event of problems of the compute service in Azure, the Function App could be affected. To minimize the possibility of such downtime, this scenario uses two instances of the Function App deployed to different regions. The underlying storage account and task hub are created in the main region, and it is shared by both instances.
Traffic Manager is configured to detect problems in the main site and automatically redirect traffic to the healthy Function App in the failover region.
Because Function App the failover region shares the same Azure Storage account and Task Hub, the state of the functions is not lost, and word can resume normally. Once the health is restored in the main region, Traffic Manager will start routing requests to that instance of the Function App automatically.

There are several benefits when using this deployment scenario:
In the case of a failure in the compute layer, work can resume in the failover region without state loss.
Traffic Manager takes care of the automatic failover to the healthy instance automatically.
Traffic Manager automatically re-establishes traffic to the main Function App after the outage has been corrected.

However, consider the following when using this scenario.
If the Function App is deployed using a dedicated AppService plan, there is an increased cost by replicating the compute instance in the failover datacenter.
This scenario covers outages at the compute layer, but the storage account continues to be the single point of failure for the Function App. If there is a Storage outage, the application suffers a downtime.
If the FunctionApp is failed over, there will be increased latency since it will access its storage account across regions.
Accessing the storage service from a different region where it is located incurs in higher cost due to network egress traffic.
This scenario depends on Traffic Manager. Considering the way Traffic Manager works,(https://docs.microsoft.com/en-us/azure/traffic-manager/traffic-manager-overview#how-traffic-manager-works), it may be some time until a client application that consumes a Durable Function needs to re-query the FunctionApp address from Traffic Manager. 




##Scenario 2 - Load Balanced Compute with Regional Storage
//Traffic Manager, Load Balanced Function Apps, One Storage account per region

##Improved Recovery Option
Same scenarios, but using RA-GRS for storage -> improves recoverability