# Disaster Recovery and Geo-Distribution Documentation (TODO)

##Overview

Today, all durable state is stored in a particular storage account + task hub. More info here.
If the whole DC goes down, you'll lose access to both compute and storage, so all in progress orchestrations will be effectively stopped.
When the DC comes back up processing will continue automatically from where it left off. There will be no data loss as long as the underlying Azure Storage data isn't lost (which is highly unlikely).
Multiple function apps cannot collaborate on the same task hub today. For geo/disaster recovery, you will want to go with multiple storage accounts - one in each geo region. It's up to you to decide how you want to configure Traffic Manager (failover mode or geo-load balancing). Just remember that the two environments are completely isolated from each other.

##Scenario 1 - Load Balanced Compute with Shared Storage
//Traffic Manager, Load Balanced Funcion Apps, Single Storage
This scenario 

Storage must be deployed in the same region as the primary compute region

Pros:
State is kept even if compute layer dies.
Automatic failover of the compute layer if it dies

Cons:
increased cost by using an additional compute instance if on dedicated AppService plans.
the storage dies, the whole thing dies
increased latency during fail over period
increased egress networking cost during fail over
depends on Traffic Manager - client affinity takes time to correct; requires understanding of the limitations of TM (ADD URL TO TRAFFIC MANAGER'S EXPLANATION OF THIS ISSUE)




##Scenario 2 - Load Balanced Compute with Regional Storage
//Traffic Manager, Load Balanced Function Apps, One Storage account per region

##Improved Recovery Option
Same scenarios, but using RA-GRS for storage -> improves recoverability