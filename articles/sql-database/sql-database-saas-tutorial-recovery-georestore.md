# Recover multi-tenant SaaS application in the event of a regional outage

In this tutorial, you learn how to recover a multi-tenant SaaS application into a recovery region in the event of a regional outage. You use the geo-restore and server alias capabilities of Azure SQL database, along with Azure Resource Manager (ARM) templates to restore the Wingtip SaaS application into a recovery region.

You will learn how to:

* Sync tenant configuration data into the tenant catalog database
* Use tenant aliases to ensure no code changes are required during the recovery process 
* Restore tenant resources into a recovery region 
* Repatriate tenant resources back into a primary region

To complete this tutorial, make sure the following prerequisites are completed:

* The Wingtip SaaS app is deployed. To deploy in less than five minutes, [see Deploy and explore the Wingtip SaaS application](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-saas-tutorial)
* Azure PowerShell is installed. For details, see [Getting started with Azure PowerShell](https://docs.microsoft.com/powershell/azure/get-started-azureps)


## Introduction to the SaaS application recovery process

[todo: insert screenshot of primary/recovery wingtip regions complete with resources]

Recovering a SaaS app that operates at scale into a recovery region can be challenging. You have to coordinate the recovery of tenant resources to ensure that: your highest priority tenants are least affected, all existing connections to tenant databases are routed to the recovered instances, and there are minimal or no code changes that you will have to undo once the outage is fixed. All of this has to be done in a speedy, and cost-effective manner that allows you to reduce the impact of an outage on your normal business operations. Azure SQL database provides two capabilities that allow you to recover databases in the event of an outage: [active geo-replication, and geo-restore of databases](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-disaster-recovery). 

In this tutorial, you use the geo-restore capability to restore tenant databases used in the WingtipSaaS application. Geo-restore leverages the automatic backup capability of Azure SQL database to recover a database into another region. Additionally, you use tenant aliases deployed with the WingtipSaaS application to ensure that you will not need to modify tenant database connection strings during recovery. Tenant aliases use the server alias capability of Azure SQL database to create an alternate name for a tenant server that is used by the Wingtip application and can be re-routed to a recovered tenant instance in the event of an outage. This allows for minimal code changes during the recovery process.

The tutorial will focus on recovering the Wingtip SaaS application built using a database-per-tenant model. For this tutorial, the recovery process has been orchestrated to allow for:

* No penalty for attempting a geo-restore when a region goes down and comes back online soon afterwards
* Preserving the identity of a tenant database after recovery. 
* Optimizing for getting tenants online as soon as possible by doing restores in parallel.
* Optimizing for restoring high-priority tenants fastest and minimizing impact to them

## Get the Wingtip application scripts 

The Wingtip SaaS scripts and application source code are available in the [WingtipSaaS github repo](https://github.com/Microsoft/WingtipSaaS). If you have already downloaded the Wingtip scripts, continue to the next section. Otherwise, [follow the steps outlined on the Wingtip overview page](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-wtp-overview#download-and-unblock-the-wingtip-saas-scripts) to download and unblock the tutorial scripts.

## Sync tenant configuration

[todo: insert screenshot of just primary region with tenant resources circled]

Sync the configuration of tenant servers, pools, and databases into the tenant catalog in order to recover them in a recovery region.

1. In the *PowerShell ISE*, open the ...\Learning Modules\Business Continuity and Disaster Recovery\RecoverFromOutage\Demo-RecoverFromOutage.ps1 script and set the following values:
	* **$DemoScenario = 1, Start a background job that syncs tenant server, and pool configuration info into the catalog**

2. Press **F5** to run the sync script. This will launch a new PowerShell window to sync the current and any future configuration of tenant resources.

Leave the PowerShell window running in the background and continue onto the rest of the tutorial. 

## Recover tenant resources into recovery region

[todo: insert screenshot of primary and secondary region with secondary tenant resources circled; or arrow from primary to secondary region]

Use the configuration values synced in the previous step to restore tenant resources into the recovery region. The recovery script selects the Azure paired region of your original Wingtip deployment and uses this as the recovery region.

1. In the *PowerShell ISE*, open the ...\Learning Modules\Business Continuity and Disaster Recovery\RecoverFromOutage\Demo-RecoverFromOutage.ps1 script and set the following values:
	* **$DemoScenario = 2, Restore the SaaS app into a secondary recovery region**

2. Press **F5** to run the recovery script. This will recover tenant databases, servers, and elastic pools into the recovery region. You can monitor the status of the recovery by watching the console section of the PowerShell window.

When the recovery is complete, [navigate to the Azure portal](https://portal.azure.com) and inspect the recovered tenant resources in the recovery region resource group.

## Repatriate tenant resources into primary region

[todo: insert screenshot of primary and secondary region with primary tenant resources circled; or arrow from secondary to primary region]
Recover tenant resources back into the primary region to simulate a region coming back online after an outage. 

1. In the *PowerShell ISE*, open the ...\Learning Modules\Business Continuity and Disaster Recovery\RecoverFromOutage\Demo-RecoverFromOutage.ps1 script and set the following values:
	* **$DemoScenario = 3, Repatriate the SaaS app back into the primary region**

2. Press **F5** to run the repatriation script. This will recover tenant databases, servers, and elastic pools back into the primary region. You can monitor the status of repatriation by watching the console section of the PowerShell window.

When the recovery is complete, [navigate to the Azure portal](https://portal.azure.com) and inspect the recovered tenant resources in the primary region. Look to find where changes in the recovery region were propagated into the primary region.

## Next steps

In this tutorial you learned how to:

* Sync tenant configuration data into the tenant catalog database
* Use tenant aliases to ensure no code changes are required during the recovery process 
* Restore tenant resources into a recovery region 
* Repatriate tenant resources back into a primary region

Now, try the [SaaS failover tutorial]() to learn how to failover a multi-tenant application in the event of a regional outage. This method of recovery dramatically decreases the time needed to recover a multi-tenant application into a recovery region.

## Additional resources

* [A process for SaaS app diaster recovery using geo-restore]()
* [Additional tutorials that build upon the Wingtip SaaS application](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-wtp-overview#sql-database-wingtip-saas-tutorials)
