<properties 
 pageTitle="Scheduler High-Availability and Reliability" 
 description="" 
 services="scheduler" 
 documentationCenter=".NET" 
 authors="krisragh" 
 manager="dwrede" 
 editor=""/>
<tags 
 ms.service="scheduler" 
 ms.workload="infrastructure-services" 
 ms.tgt_pltfrm="na" 
 ms.devlang="dotnet" 
 ms.topic="article" 
 ms.date="04/22/2015" 
 ms.author="krisragh"/>
 
 
# Scheduler High-Availability and Reliability

## Azure Scheduler High-Availability

As a core Azure platform service, Azure Scheduler is highly available and features both geo-redundant service deployment and geo-regional job replication.

### Geo-redundant service deployment

Azure Scheduler is available via the UI in almost every geo region that's in Azure today. The list of regions that Azure Scheduler is available in is [listed here](http://azure.microsoft.com/regions/#services). If a data center in a hosted region is rendered unavailable, the failover capabilities of Azure Scheduler are such that the service is available from another data center.

### Geo-regional job replication

Not only is the Azure Scheduler front-end available for management requests, but your own job is also geo-replicated. When there’s an outage in one region, Azure Scheduler fails over and ensures that the job is run from another data center in the paired geographic region.

For example, if you’ve created a job in South Central US, Azure Scheduler automatically replicates that job in North Central US. When there’s a failure in South Central US, Azure Scheduler ensures that the job is run from North Central US. [The list of paired Azure regions is available here](https://msdn.microsoft.com/library/azure/dn758204.aspx).

![][1]

As a result, Azure Scheduler ensures that your data stays within the same broader geographic region in case of an Azure failure. As a result, you need not duplicate your job just to add high availability – Azure Scheduler automatically provides high-availability capabilities for your jobs.

## Azure Scheduler Reliability

Azure Scheduler guarantees its own high-availability and takes a different approach to user-created jobs. For example, your job may invoke an HTTP endpoint that’s unavailable. Azure Scheduler nonetheless tries to execute your job successfully, by giving you alternative options to deal with failure. Azure Scheduler does this in two ways:

### Configurable Retry Policy via “retryPolicy”

Azure Scheduler allows you to configure a retry policy. By default, if a job fails, Scheduler tries the job again four more times, at 30-second intervals. You may re-configure this retry policy to be more aggressive (for example, ten times, at 30-second intervals) or looser (for example, two times, at daily intervals.)

As an example of when this may help, you may create a job that runs once a week and invokes an HTTP endpoint. If the HTTP endpoint is down for a few hours when your job runs, you may not want to wait one more week for the job to run again since even the default retry policy will fail. In such cases, you may reconfigure the standard retry policy to retry every three hours (for example) instead of every 30 seconds.

To learn how to configure a retry policy, refer to [retryPolicy](scheduler-concepts-terms.md#retrypolicy).

### Alternate Endpoint Configurability via “errorAction”

If the target endpoint for your Azure Scheduler job remains unreachable, Azure Scheduler falls back to the alternate error-handling endpoint after following its retry policy. If an alternate error-handling endpoint is configured, Azure Scheduler invokes it. With an alternate endpoint, your own jobs are highly available in the face of failure.

As an example, in the diagram below, Azure Scheduler follows its retry policy to hit a New York web service. After the retries fail, it checks if there's an alternate. It then goes ahead and starts making requests to the alternate with the same retry policy.

![][2]

Note that the same retry policy applies to both the original action and the alternate error action. It’s also possible to have the alternate error action’s action type be different from the main action’s action type. For example, while the main action may be invoking an HTTP endpoint, the error action may instead be a storage queue action that does error-logging.

To learn how to configure an alternate endpoint, refer to [errorAction](scheduler-concepts-terms.md#action-and-erroraction).

## See Also

 [Scheduler Concepts, Terminology, and Entity Hierarchy](scheduler-concepts-terms.md)
 
 [Get Started Using Scheduler in the Management Portal](scheduler-get-started-portal.md)
 
 [Plans and Billing in Azure Scheduler](scheduler-plans-billing.md)
 
 [How to Build Complex Schedules and Advanced Recurrence with Azure Scheduler](scheduler-advanced-complexity.md)
 
 [Scheduler REST API Reference](https://msdn.microsoft.com/library/dn528946)   
 
 [Scheduler Limits, Defaults, and Error Codes](scheduler-limits-defaults-errors.md)
 
 [Scheduler Outbound Authentication](scheduler-outbound-authentication.md)
 
 
[1]: ./media/scheduler-high-availability-reliability/scheduler-high-availability-reliability-image1.png

[2]: ./media/scheduler-high-availability-reliability/scheduler-high-availability-reliability-image2.png

