# Disaster Recovery and Geo-Distribution Documentation (TODO)

## Overview

*Today, all durable state is stored in a particular storage account + task hub. More info here.
If the whole DC goes down, you'll lose access to both compute and storage, so all in progress orchestrations will be effectively stopped.
When the DC comes back up processing will continue automatically from where it left off. There will be no data loss as long as the underlying Azure Storage data isn't lost (which is highly unlikely).
Multiple function apps cannot collaborate on the same task hub today. For geo/disaster recovery, you will want to go with multiple storage accounts - one in each geo region. It's up to you to decide how you want to configure Traffic Manager (failover mode or geo-load balancing). Just remember that the two environments are completely isolated from each other.*

Using these scenarios requires understanding of 
- [Task Hubs](https://docs.microsoft.com/en-us/azure/azure-functions/durable-functions-task-hubs) in Durable Functions. All function app deployments must share the same task hub name.
- Traffic Manager [priority traffic-routing method](https://docs.microsoft.com/en-us/azure/traffic-manager/traffic-manager-monitoring#traffic-routing-methods) and [endpoint failover and recovery](https://docs.microsoft.com/en-us/azure/traffic-manager/traffic-manager-monitoring#endpoint-failover-and-recovery)

## Scenario 1 - Load Balanced Compute with Shared Storage
### Traffic Manager, Load Balanced Funcion Apps, Single Storage

Storage must be deployed in the same region as the primary compute region

Pros:
- Automatic failover to the secondary region, where function app is deployed. 
- State is kept even if the function app dies.
 

Cons:
- When hosting it on a dedicated App Service Plan, it brings increased costs.
- Storage fails, the whole thing fails.
- Increased network latency and egress costs during fail over period.




## Scenario 2 - Load Balanced Compute with Regional Storage
### Traffic Manager, Load Balanced Function Apps, One Storage account per region

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
