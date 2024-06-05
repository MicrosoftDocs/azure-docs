 
# How to use Geo replication (Public Preview)
 
## In this article
This tutorial will show you how to use the Geo replication with your Event Hubs Dedicated namespace. To learn more about this feature, read the Geo replication article.  In this article you will learn how to:
-	Enable Geo replication on a new namespace
-	Enable Geo replication on an existing namespace
-	Perform a planned promotion or failover
-	Remove the secondary from your namespace

## Pre-requisites
To use the Geo replication feature you need to have at least one Dedicated Event Hubs cluster in two regions where the Geo replication feature is available.
 
## Enable Geo replication on a new namespace
 
You can enable Geo replication during namespace creation and after a namespace has been created.  
To enable Geo replication on a namespace during namespace creation:
 
1.	Click on ‘Namespace’ to create a new Event Hubs namespace in an Event Hubs cluster in a region with Geo replication enabled. Provide a name for the namespace and check the Enable Geo-replication box
 [namespace create](../media/use-geo-replication/namespace-create.png)
2.	Click on Add secondary region and select a secondary region and a corresponding Event Hubs Dedicated cluster running in that region. 
 [region selection](../media/use-geo-replication/region-selection.png)
3.	Select asynchronous or synchronous replication mode as the replication consistency mode. If selecting asynchronous consistency, enter the allowable amount of time the secondary region can lag behind the primary region in minutes.
 [replication consistency in create flow](../media/use-geo-replication/create-replication-consistency.png)
5.	Then click on ‘Create’ to create the Geo Replicated Event Hubs namespace. The deployment will take a couple of minutes to complete. 
6.	Once the namespace is created you can navigate to it and click on ‘Geo-replication’ tab on the left to see your Geo replication configuration. 
 [geo replication UI](../media/use-geo-replication/geo-replication.png)  
   
## Enable Geo replication on an existing namespace
1.	Go into the namespace in the portal and click on ‘Geo-replication’ on the left.
2.	Click on Add secondary region and select a secondary region and the corresponding Event Hubs Dedicated clusters running in that region
3.	Select asynchronous or synchronous replication mode as the replication consistency mode. If selecting asynchronous consistency, enter the allowable amount of time the secondary region can lag behind the primary region in minutes.
 [replication consistency in geo replication UI](../media/use-geo-replication/geo-replication-consistency.png)
 
After a secondary region is added, all of the data held in the primary namespace will be replicated to the secondary. This can take a while depending on various factors with the main one being how much data is in your primary namespace.  Users can observe progress in this by monitoring the lag to the secondary region as described in the monitoring section below.

## Promote secondary
You can promote your configured secondary region to being the primary region. When you promote a secondary region to primary, the current primary region will become the secondary region. This can be planned or forced. Planned promotions ensure both regions are caught up before accepting new traffic. Forced promotions take effect as quickly as possible and doesn't wait for things to be caught up.
To initiate a promotion of your secondary region to primary, clicking on the failover icon which is shown below.  
 [promotion start](../media/use-geo-replication/promotion-a.png)
When in the promotion flow, you can select planned or forced.  You can also choose to select forced after starting a planned promotion. Enter the word "promote" in the prompt to be able to start the promotion.
 [promotion](../media/use-geo-replication/promotion.png)
 
If doing a planned promotion, then once the promotion process is initiated, the new primary will reject any new events until failover is completed. The promotion process will repoint the FQDN for your namespace to the selected region, complete data replication between the two regions and configure the new primary region to be active.  This means that there is no change needed to clients and that they will continue to work after the promotion event.
In the case where your primary region goes down completely, you can still perform a forced promotion. 

## Remove a secondary
To remove a Geo replication pairing with a secondary, go into 'Geo-replication', select the secondary region, and then select remove. At the prompt, enter the word "delete" and then you can delete the secondary.   
[remove secondary](../media/use-geo-replication/remove-secondary.png) 

When a secondary region is removed, all of the data that it held is also removed.  If you wish to re-enable Geo replication with that region and cluster, it will have to replicate the primary region data all over again.  

