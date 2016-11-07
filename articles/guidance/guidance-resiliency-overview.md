---
title: Designing resilient applications | Microsoft Docs
description: How to build resilient applications in Azure, for high availability and disaster recovery.
services: ''
documentationcenter: na
author: MikeWasson
manager: christb
editor: ''
tags: ''

ms.assetid: 8be7ed24-47aa-4b41-b3e5-3f6342265443
ms.service: guidance
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/18/2016
ms.author: mwasson

---
# Designing resilient applications for Azure
In a distributed system, failures will happen. Hardware can fail. The network can have transient failures. Rarely, an entire service or region may experience a disruption, but even those must be planned for. 

Building a reliable application in the cloud is different than building a reliable application in an enterprise setting.  While historically you may have purchased higher-end hardware to scale up, in a cloud environment you must scale out instead of up. Costs for cloud environments are kept low through the use of commodity hardware. Instead of focusing on preventing failures and optimizing "mean time between failures," in this new environment the focus shifts to "mean time to restore." The goal is to minimize the impact from a failure.

This article gives an overview of how to build resilient applications in Microsoft Azure. It starts with a definition of the term *resiliency* and related concepts. Then it describes a process for achieving resiliency, using a structured approach over the life of an application, from design and implementation, to deployment and operations.

## What is resiliency?
**Resiliency** is the ability to recover from failures and continue to function. It's not about *avoiding* failures, but *responding* to failures in a way that avoids downtime or data loss. The goal of resiliency is to return the application to a fully functioning state after a failure.

Two important aspects of resiliency are high availability and disaster recovery.

* **High availability** (HA) is the ability of the application to keep running in a healthy state, without significant downtime. By "healthy state," we mean the application is responsive, and users can connect to the application and interact with it.  
* **Disaster recovery** (DR) is the ability to recover from rare but major incidents: Non-transient, wide-scale failures, such as service disruption that affects an entire region. Disaster recovery includes data backup and archiving, and may include manual interventions, such as restoring a database from backup. 

One way to think about HA versus DR is that DR starts when the impact of a fault exceeds the ability of the HA design to handle it. For example, putting several VMs behind a load balancer will provide availability if one VM fails, but not if they all fail at the same time. 

When you design an application to be resilient, you have to understand your availability requirements. How much downtime is acceptable? This is partly a function of cost. How much will potential downtime cost your business? How much should you invest in making the application highly available? You also have to define what it means for the application to be available. For example, is the application "down" if a customer can submit an order but the system cannot process it in the normal timeframe?

Another common term is **business continuity** (BC), which is the ability to perform essential business functions during and after a disaster. BC covers the entire operation of the business, including physical facilities, people, communications, transportation, and IT. In this article, we are just focused on cloud applications, but resilience planning must be done in the context of overall BC requirements. 

## Process to achieve resiliency
Resiliency is not an add-on. It must be designed into the system and put into operational practice. Here is a general model to follow:

1. **Define** your availability requirements, based on business needs
2. **Design** the application for resiliency. Start with an architecture that follows proven practices, and then identify the possible failure points in that architecture.
3. **Implement** strategies to detect and recover from failures. 
4. **Test** the implementation by simulating faults and triggering forced failovers. 
5. **Deploy** the application into production using a reliable, repeatable process. 
6. **Monitor** the application to detect failures. By monitoring the system, you can gauge the health of the application and respond to incidents if necessary. 
7. **Respond** if there are incidents that require manual interventions.

In the remainder of this article, we discuss each of these steps in more detail.

## Defining your resiliency requirements
Resiliency planning starts with business requirements. Here are some approaches for thinking about resiliency in those terms.

### Decompose by workload
Many cloud solutions consist of multiple application workloads. The term "workload" in this context means a discrete capability or computing task, which can be logically separated from other tasks, in terms of business logic and data storage requirements. For example, an e-commerce app might include the following workloads:

* Browse and search a product catalog.
* Create and track orders.
* View recommendations.

These workloads might have different requirements for availability, scalability, data consistency, disaster recovery, and so forth. Again, these are business decisions.

Also think about usage patterns. Are there certain critical periods when the system must be available? For example, a tax-filing service can't go down right before the filing deadline; a video streaming service must stay up during a big sports event; and so on. During the critical periods, you might have redundant deployments across several regions, so the application could fail over if one region failed. However, a multi-region deployment is more expensive, so during less critical times, you might run the application in a single region.  

### RTO and RPO
Two important metrics to consider are the recovery time objective and recovery point objective:

* **Recovery time objective** (RTO) is the maximum acceptable time that an application can be unavailable after an incident. If your RTO is 90 minutes, you must be able to restore the application to a running state within 90 minutes from the start of a disaster. If you have a very low RTO, you might keep a second deployment continually running on standby, to protect against a regional outage.
* **Recovery point objective** (RPO) is the maximum duration of data loss that is acceptable during a disaster. For example, if you store data in a single database, with no replication to other databases, and perform hourly backups, you could lose up to an hour of data. 

RTO and RPO are business requirements. Another common metric is **mean time to recover** (MTTR), which is the average time that it takes to restore the application after a failure. MTTR is an empirical fact about a system. If MTTR exceeds the RTO, then a failure in the system will cause an unacceptable business disruption, because it won't be possible to restore the system within the defined RTO. 

### SLAs
In Azure, the [Service Level Agreement][sla] (SLA) describes Microsoft’s commitments for uptime and connectivity. If the SLA for a particular service is 99.9%, it means you should expect the service to be available 99.9% of the time.

> [!NOTE]
> The Azure SLA also includes provisions for obtaining a service credit if the SLA is not met, along with specific definitions of "availability" for each service. That aspect of the SLA acts as an enforcement policy. 
> 
> 

You should define your own target SLAs for each workload in your solution. An SLA makes it possible to reason about the architecture, and whether the architecture meets the business requirements. For example, if a workload requires 99.99% uptime, but depends on a service with a 99.9% SLA, that service cannot be a single-point of failure in the system. One remedy is to have a fallback path in case the service fails, or take other measures to recover from a failure in that service. 

The following table shows the potential cumulative downtime for various SLA levels. 

| SLA | Downtime per week | Downtime per month | Downtime per year |
| --- | --- | --- | --- |
| 99% |1.68 hours |7.2 hours |3.65 days |
| 99.9% |10.1 minutes |43.2 minutes |8.76 hours |
| 99.95% |5 minutes |21.6 minutes |4.38 hours |
| 99.99% |1.01 minutes |4.32 minutes |52.56 minutes |
| 99.999% |6 seconds |25.9 seconds |5.26 minutes |

Of course, higher availability is better, everything else being equal. But as you strive for more 9s, the cost and complexity to achieve that level of availability grows. An uptime of 99.99% translates to about 5 minutes of total downtime per month. Is it worth the additional complexity and cost to reach five 9s? The answer depends on the business requirements. 

Here are some other considerations when defining an SLA:

* To achieve four 9's (99.99%), you probably can't rely on manual intervention to recover from failures. The application must be self-diagnosing and self-healing. 
* Beyond four 9's, it is challenging to detect outages quickly enough to meet the SLA.
* Think about the time window that your SLA is measured against. The smaller the window, the tighter the tolerances. It probably doesn't make sense to define your SLA in terms of hourly or daily uptime. 

### Composite SLAs
Consider an App Service web app that writes to Azure SQL Database. At the time of this writing, these Azure services have the following SLAs:

* App Service Web Apps = 99.95%
* SQL Database = 99.99%

![Composite SLA](media/resiliency/resiliency-sla1.png)

What is the maximum downtime you would expect for this application? If either service fails, the whole application fails. In general, the probability of each service failing is independent, so the composite SLA for this application is 99.95% x 99.99% = 99.94%. That's lower than the individual SLAs, which isn't surprising, because an application that relies on multiple services has more potential failure points. 

On the other hand, you can improve the composite SLA by creating independent fallback paths. For example, if SQL Database is unavailable, put transactions into a queue, to be processed later.

![Composite SLA](media/resiliency/resiliency-sla2.png)

With this design, the application is still available even if it can't connect to the database. However, it fails if the database and the queue both fail at the same time. The expected percentage of time for a simultaneous failure is 0.0001 × 0.001, so the composite SLA for this combined path is  

* Database OR queue = 1.0 &minus; (0.0001 &times; 0.001) = 99.99999%

The total composite SLA is:

* Web app AND (database OR queue) = 99.95% &times; 99.99999% = ~99.95%

But there are tradeoffs to this approach. The application logic is more complex, you are paying for the queue, and there may be data consistency issues to consider.

**SLA for multi-region deployments**. Another HA technique is to deploy the application in more than one region, and use Azure Traffic Manager to fail over if the application fails in one region. For a two-region deployment, the composite SLA is calculated as follows. 

Let *N* be the composite SLA for the application deployed in one region. The expected chance that the application will fail in both regions at the same time is (1 &minus; N) &times; (1 &minus; N). Therefore,

* Combined SLA for both regions = 1 &minus; (1 &minus; N)(1 &minus; N) = N + (1 &minus; N)N

Finally, you must factor in the [SLA for Traffic Manager][tm-sla]. As of when this article was written, the SLA for Traffic Manager SLA is 99.99%.

* Composite SLA = 99.99% &times; (combined SLA for both regions)

A further detail is that failing over is not instantaneous, which can result in some downtime during a failover. See [Traffic Manager endpoint monitoring and failover][tm-failover].

The calculated SLA number is a useful baseline, but it doesn't tell the whole story about availability. Often, an application can degrade gracefully when a non-critical path fails. Consider an application that shows a catalog of books. If the application can't retrieve the thumbnail image for the cover, it might show a placeholder image. In that case, failing to get the image does not reduce the application's uptime, although it affects the user experience.  

## Designing for resiliency
During the design phase, you should perform a failure mode analysis (FMA). The goal of an FMA is to identify possible points of failure, and define how the application will respond to those failures.

* How will the application detect this type of failure?
* How will the application respond to this type of failure?
* How will you log and monitor this type of failure? 

For more information about the FMA process, with specific recommendations for Azure, see [Azure resiliency guidance: Failure mode analysis][fma].

### Example of identifying failure modes and detection strategy
**Failure point:** Call to an external web service / API.

| Failure mode | Detection strategy |
| --- | --- |
| Service is unavailable |HTTP 5xx |
| Throttling |HTTP 429 (Too Many Requests) |
| Authentication |HTTP 401 (Unauthorized) |
| Slow response |Request times out |

## Resiliency strategies
This section provides a survey of some common resiliency strategies. Most of these are not limited to a particular technology. The descriptions in this section are meant to summarize the general idea behind each technique, with links to further reading.

### Retry transient failures
Transient failures can be caused by momentary loss of network connectivity, a dropped database connection, or a timeout when a service is busy. Often, a transient failure can be resolved simply by retrying the request. For many Azure services, the client SDK implements automatic retries, in a way that is transparent to the caller; see [Retry service specific guidance][retry-service-specific guidance].

Each retry attempt adds to the total latency. Also, too many failed requests can cause a bottleneck, as pending requests accumulate in the queue. These blocked requests might hold critical system resources such as memory, threads, database connections, and so on, which can cause cascading failures. To avoid this, increase the delay between each retry attempt, and limit the total number of failed requests.

![Composite SLA](media/resiliency/resiliency-retry.png)

For more information, see [Retry Pattern][retry-pattern].

### Load balance across instances
For scalability, a cloud application should be able to scale out by adding more instances. This approach also improves resiliency, because unhealthy instances can be taken out of rotation.  

For example:

* Put two or more VMs behind a load balancer. The load balancer distributes traffic to all the VMs. See [Running multiple VMs on Azure for scalability and availability][ra-multi-vm].
* Scale out an Azure App Service app to multiple instances. App Service automatically load balances across instances. See [Basic web application][ra-basic-web].
* Use [Azure Traffic Manager][tm] to distribute traffic across a set of endpoints.

### Replicate data
Replicating data is a general strategy for handling non-transient failures in a data store. Many storage technologies provide built-in replication, including Azure SQL Database, DocumentDB, and Apache Cassandra.  

It's important consider both the read and write paths. Depending on the storage technology, you might have multiple writable replicas, or a single writable replica and multiple read-only replicas. 

For highest availability, replicas can be placed in multiple regions. However, this increases the latency to replicate the data. Typically, replicating across regions is done asynchronously, which implies an eventual consistency model and potential data loss if a replica fails. 

### Degrade gracefully
If a service fails and there is no failover path, the application may be able to degrade gracefully, in a way that still provides an acceptable user experience. For example:

* Put a work item on a queue, to be executed later. 
* Return an estimated value 
* Use locally cached data. 
* Show the user an error message. (This option is better than having the application stop responding to requests.)

### Throttle high-volume users
Sometimes a small number of users create excessive load. That can have an impact on other users, reducing the overall availability of your application.

When a single client makes an excessive number of requests, the application might throttle the client for a certain period of time. During the throttling period, the application refuses some or all of the requests from that client (depending on the exact throttling strategy). The threshold for throttling might depend on the customer's service tier. 

Throttling does not imply the client was necessarily acting maliciously. It just means the client exceeded their service quota.  In some cases, a consumer might consistently exceed their quota or otherwise behave badly. In that case, you might go further and block the user. Typically, this is done by blocking an API key or an IP address range.

For more information, see [Throttling Pattern][throttling-pattern].

### Use a circuit breaker
The Circuit Breaker pattern can prevent an application from repeatedly trying an operation that is likely to fail. The analogy is to a physical circuit breaker, a switch that interrupts the flow of current when a circuit is overloaded.

The circuit breaker wraps calls to a service. It has three states:

* **Closed**. This is the normal state. The circuit breaker sends requests to the service, and a counter tracks the number of recent failures. If the failure count exceeds a threshold within a given time period, the circuit breaker switches to the Open state. 
* **Open**. In this state, the circuit breaker immediately fails all requests, without calling the service. The application should use a mitigation path, such as reading data from a replica or simply returning an error to the user. When the circuit breaker switches to Open, it starts a timer. When the timer expires, the circuit breaker switches to the Half-open state.
* **Half-open**. In this state, the circuit breaker lets a limited number of requests go through to the service. If they succeed, the service is assumed to be recovered, and the circuit breaker switches back to the Closed state. Otherwise, it reverts to the Open state. The Half-Open state prevents a recovering service from suddenly being inundated with requests.

For more information, see [Circuit Breaker Pattern][circuit-breaker-pattern].

### Use load leveling to smooth out spikes in traffic
Applications may experience sudden spikes in traffic, which can overwhelm services on the backend. If a backend service cannot respond to requests quickly enough, it may cause requests to queue (back up), or cause the service to throttle the application.

To avoid this, you can use a queue as a buffer. When there is a new work item, instead of calling the backend service immediately, the application queues a work item to run asynchronously. The queue acts as a buffer that smooths out peaks in the load. 

For more information, see [Queue-Based Load Leveling Pattern][load-leveling-pattern].

### Isolate critical resources
Failures in one subsystem can sometimes cascade, causing failures in other parts of the application. This can happen if a failure causes some resources, such as threads or sockets, not to get freed in a timely manner, leading to resource exhaustion. 

To avoid this, you can partition a system into isolated groups, so that a failure in one partition does not bring down the entire system. This technique is sometimes called the Bulkhead pattern.

Examples:

* Partition a database -- for example, by tenant -- and assign a separate pool of web server instances for each partition.  
* Use separate thread pools to isolate calls to different services. This helps to prevent cascading failures if one of the services fails. For an example, see the Netflix [Hystrix library][hystrix].
* Use [containers][containers] to limit the resources available to a particular subsystem. 

![Composite SLA](media/resiliency/resiliency-bulkhead.png)

### Apply compensating transactions
A compensating transaction is a transaction that undoes the effects of another completed transaction.

In a distributed system, it can be very difficult to achieve strong transactional consistency. Compensating transactions are a way to achieve consistency by using a series of smaller, individual transactions that can be undone at each step.

For example, to book a trip, a customer might reserve a car, a hotel room, and a flight. If any of these steps fails, the entire operation fails. Instead of trying to use a single distributed transaction for the entire operation, you can define a compensating transaction for each step. For example, to undo a car reservation, you cancel the reservation. In order to complete the whole operation, a coordinator executes each step. If any step fails, the coordinator applies compensating transactions to undo any steps that were completed. 

For more information, see [Compensating Transaction Pattern][compensating-transaction-pattern]. 

## Testing for resiliency
Generally, you can't test resiliency in the same way that you test application functionality (by running unit tests and so on). Instead, you must test how the end-to-end workload performs under failure conditions, which by definition don't happen all of the time.

Testing is part of an iterative process. Test the application, measure the outcome, analyze and fix any failures that result, and repeat the process.

**Fault injection testing**. Test the resiliency of the system to failures, either by triggering actual failures or by simulating them. Here are some common failure scenarios to test:

* Shut down VM instances.
* Crash processes.
* Expire certificates.
* Change access keys.
* Shut down the DNS service on domain controllers.
* Limit available system resources, such as RAM or number of threads.
* Unmount disks.
* Redeploy a VM.

Measure the recovery times and verify they meet your business requirements. Test combinations of failure modes, as well. Make sure that failures don't cascade, and are handled in an isolated way.

This is another reason why it's important to analyze possible failure points during the design phase. The results of that analysis should be inputs into your test plan.

**Load testing**. Load test the application using a tool such as [Visual Studio Team Services][vsts] or [Apache JMeter][jmeter] Load testing is crucial for identifying failures that only happen under load, such as the backend database being overwhelmed or service throttling. Test for peak load, using production data, or synthetic data that is as close to production data as possible. The goal is to see how the application behaves under real-world conditions.   

## Resilient deployment
Once an application is deployed to production, updates are a possible source of errors. In the worst case, a bad update can cause downtime. To avoid this, the deployment process must be predictable and repeatable. Deployment includes provisioning Azure resources, deploying application code, and applying configuration settings. An update may involve all three, or a subset. 

The crucial point is that manual deployments are prone to error. Therefore, it's recommended to have an automated, idempotent process that you can run on demand, and re-run if something fails. 

* Use Resource Manager templates to automate provisioning of Azure resources.
* Use [Azure Automation Desired State Configuration][dsc] (DSC) to configure VMs.
* Use an automated deployment process for application code.

Two concepts related to resilient deployment are *infrastructure as code* and *immutable infrastructure*.

* **Infrastructure as code** is the practice of using code to provision and configure infrastructure. Infrastructure as code may use a declarative approach or an imperative approach (or a combination of both). Resource Manager templates are an example of a declarative approach. PowerShell scripts are an example of an imperative approach.
* **Immutable infrastructure** is the principle that you shouldn’t modify infrastructure after it’s deployed to production. Otherwise, you can get into a state where ad hoc changes have been applied, so it’s hard to know exactly what changed, and hard to reason about the system. 

Another question is how to roll out an application update. We recommend techniques such as blue-green deployment or canary releases, which push updates in highly controlled way to minimize possible impacts from a bad deployment.

* [Blue-green deployment][blue-green] is a technique where you deploy an update into a separate production environment from the live application. After you validate the deployment, switch the traffic routing to the updated version. For example, Azure App Service Web Apps enables this with [staging slots][staging-slots]. 
* [Canary releases][canary-release] are similar to blue-green deployment. Instead of switching all traffic to the updated version, you roll out the update to a small percentage of users, by routing a portion of the traffic to the new deployment. If there is a problem, back off and revert to the old deployment. Otherwise, route more traffic to the new version, until it gets 100% of traffic.

Whatever approach you take, make sure that you can roll back to the last-known good-deployment, in case the new version is not functioning. Also, if errors occur, it must be possible to tell from the application logs which version caused the error. 

## Monitoring and diagnostics
Monitoring and diagnostics are crucial for resiliency. If something fails, you need to know that it failed, and you need insights into the cause of the failure. 

Monitoring a large-scale distributed system poses a significant challenge. Think about an application that runs on a few dozen VMs -- it's not practical to log into each VM, one at a time, and look through log files, trying to troubleshoot a problem. Moreover, the number of VM instances is probably not static. VMs get added and removed as the application scales in and out, and occasionally an instance may fail and need to be reprovisioned. In addition, a typical cloud application might use multiple data stores (Azure storage, SQL Database, DocumentDB, Redis cache), and a single user action may span multiple subsystems. 

You can think of the monitoring and diagnostics process as a pipeline with several distinct stages:

![Composite SLA](media/resiliency/resiliency-monitoring.png)

* **Instrumentation**. The raw data for monitoring and diagnostics comes from a variety of sources, including application logs, web server logs, OS performance counters, database logs, and diagnostics built into the Azure platform. Most Azure services have a diagnostics feature that you can use to figure out the cause of problems.
* **Collection and storage**. The raw instrumentation data can be held in a variety of locations and with varying formats (application trace logs, performace counters, IIS logs). These disparate sources are collected, consolidated, and put into reliable storage.
* **Analysis and diagnosis**. After the data is consolidated, it can be analyzed, in order to troubleshoot issues and provide an overall view of the health of the application.
* **Visualization and alerts**. In this stage, telemetry data is presented in such a way that an operator can quickly spot trends or problems. Example include dashboards or email alerts.  

Monitoring is different than failure detection. For example, your application might detect a transient error and retry, resulting in no downtime. But it should also log the retry operation, so that you can monitor the error rate, in order to get an overall picture of the application health. 

Application logs are an important source of diagnostics data. Here are some best practices for application logging:

* Log in production. Otherwise, you lose insight at the very times when you need it the most.
* Log events at service boundaries. Include a correlation ID that flows across service boundaries. If transaction X flows through multiple services and one of them fails, the correlation ID will help you pinpoint why the transaction failed.
* Use semantic logging, also called structured logging. Unstructured logs make it hard to automate the consumption and analysis of the log data, which is needed at cloud scale.
* Use asynchronous logging. Otherwise, the logging system itself can cause the application to fail, by causing requests to back up, as they block waiting to write a logging event.
* Application logging is not the same as auditing. Auditing may be done for compliance or regulatory reasons. As such, audit records must be complete, and it's not acceptible to drop any while processing transactions. If an application requires auditing, this should be kept separate from diagnostics logging. 

For more information about monitoring and diagnostics, see [Monitoring and diagnostics guidance][monitoring-guidance].

## Manual failure responses
Previous sections have focused on automated recovery strategies, which are critical for high availability. However, sometimes manual intervention is needed.

* **Alerts**. Monitor your application for warning signs that may require pro-active intervention. For example, if you see that SQL Database or DocumentDB consistently throttles your application, you might need to increase your database capacity or optimize your queries. In this example, even though the application might handle the throttling errors transparently, your telemetry should still raise an alert, so that you can follow up.  
* **Manual failover**. Some systems cannot fail over automatically, and require a manual failover. 
* **Operational readiness testing**. If your application fails over to a secondary region, you should perform an operational readiness test before you fail back to the primary region. The test should verify that the primary region is healthy and ready to receive traffic again.
* **Data consistency check**. If a failure happens in a data store, there may be data inconsistencies when the store becomes available again, especially if the data was replicated. 
* **Restoring from backup**. For example, if SQL Database experiences a regional outage, you can geo-restore the database from the latest backup.

Document and test your disaster recovery plan. Include written procedures for any manual steps, such as manual failover, restoring data from backups, and so forth. 

## Summary
This article looked at resiliency from a holistic perspective, emphasizing some of the unique challenges of the cloud. These include the distributed nature of cloud computing, the use of commodity hardware, and the presence of transience network faults.

Here are the major points to take away from this article:

* Resiliency leads to higher availability, and lower mean time to recover from failures. 
* Achieving resiliency in the cloud requires a different set of techniques from traditional on-premises solutions. 
* Resiliency does not happen by accident. It must be designed and built in from the start.
* Resiliency touches every part of the application lifecycle, from planning and coding to operations.
* Test and monitor!

## Next steps
* [Resiliency checklist][resiliency-checklist] contains a recommendations that will help you plan for a variety of failure modes that could occur.
* [Failure mode analysis][fma] (FMA) is a process for building resiliency into a system, by identifying possible failure points. As a starting point for your FMA process, this article contains a catalog of potential failure modes and their mitigations. 
* You can find additional resources here: [Azure resiliency technical guidance](../resiliency/resiliency-technical-guidance.md) 

<!-- links -->

[blue-green]: http://martinfowler.com/bliki/BlueGreenDeployment.html
[canary-release]: http://martinfowler.com/bliki/CanaryRelease.html
[circuit-breaker-pattern]: https://msdn.microsoft.com/library/dn589784.aspx
[compensating-transaction-pattern]: https://msdn.microsoft.com/library/dn589804.aspx
[containers]: https://en.wikipedia.org/wiki/Operating-system-level_virtualization
[dsc]: https://azure.microsoft.com/documentation/articles/automation-dsc-overview/
[fma]: guidance-resiliency-failure-mode-analysis.md
[hystrix]: http://techblog.netflix.com/2012/11/hystrix.html
[jmeter]: http://jmeter.apache.org/
[load-leveling-pattern]: https://msdn.microsoft.com/library/dn589783.aspx
[monitoring-guidance]: https://azure.microsoft.com/documentation/articles/best-practices-monitoring/
[ra-basic-web]: https://azure.microsoft.com/documentation/articles/guidance-web-apps-basic/
[ra-multi-vm]: https://azure.microsoft.com/documentation/articles/guidance-compute-multi-vm/
[resiliency-checklist]: guidance-resiliency-checklist.md
[retry-pattern]: https://msdn.microsoft.com/library/dn589788.aspx
[retry-service-specific guidance]: https://azure.microsoft.com/documentation/articles/best-practices-retry-service-specific/
[sla]: https://azure.microsoft.com/support/legal/sla/
[staging-slots]: https://azure.microsoft.com/documentation/articles/guidance-web-apps-basic/
[throttling-pattern]: https://msdn.microsoft.com/library/dn589798.aspx
[tm]: https://azure.microsoft.com/services/traffic-manager/
[tm-failover]: https://azure.microsoft.com/documentation/articles/traffic-manager-monitoring/
[tm-sla]: https://azure.microsoft.com/support/legal/sla/traffic-manager/v1_0/
[vsts]: https://www.visualstudio.com/features/vso-cloud-load-testing-vs.aspx
