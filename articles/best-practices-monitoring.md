<properties
   pageTitle="Monitoring and diagnostics guidance | Microsoft Azure"
   description="Best practices for monitoring distributed applications in the cloud."
   services=""
   documentationCenter="na"
   authors="dragon119"
   manager="masimms"
   editor=""
   tags=""/>

<tags
   ms.service="best-practice"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/28/2015"
   ms.author="masashin"/>

# Monitoring and diagnostics guidance

![](media/best-practices-monitoring/pnp-logo.png)

## Overview
Distributed applications and service running in the cloud are, by their very nature, complex pieces of software that comprise many moving parts. In a production environment, it is important to be able to track the way in which users utilize your system, trace resource utilization, and generally monitor the health and performance of your system. This information can be used as a diagnostic aid to detect and correct issues, and also to help spot potential problems and prevent them from occurring.

## Monitoring and diagnostics scenarios
Monitoring enables you to gain an insight into how well a system is functioning, and is a crucial part in maintaining quality-of-service targets. Some common scenarios for collecting monitoring data include:

- Ensuring that the system remains healthy.
- Tracking the availability of the system and its component elements.
- Maintaining performance to ensure that the throughput of the system does not degrade unexpectedly as the volume of work increases.
- Guaranteeing that the system meets any SLAs agreed with customers.
- Protecting the privacy and security of the system, users, and their data.
- Tracking the operations that are performed auditing or regulatory purposes.
- Monitoring the day-to-day usage of the system and help spot trends that could lead to problems if they are not addressed.
- Tracking issues that occur, from initial report through to analysis of possible causes, rectification, consequent software updates, and deployment.
- Tracing operations and debugging software releases.

> [AZURE.NOTE] This list is not intended to be comprehensive. This document focusses on these scenarios as the most common situations for performing monitoring, but there may well be others that are less common or specific to your own environment.

The following sections describe these scenarios in more detail. The information for each scenario is discussed in the following format:

- A brief overview of the scenario.
- The typical requirements of this scenario.
- The raw instrumentation data required to support the scenario, and possible sources of this information.
- How this raw data can be analyzed and combined to generate meaningful diagnostic information.

## Health monitoring
A system is healthy if it is running and capable of processing requests. The purpose of health monitoring is to generate a snapshot of the current health of the system to enable you to verify that all components of the system are functioning as expected.

### Requirements for health monitoring
An operator should be alerted quickly (within a matter of seconds) if any part of the system is deemed to be unhealthy. The operator should be able to ascertain which parts of the system are functioning normally, and which parts are experiencing problems. System health can be highlighted by using a traffic-light system; red for unhealthy (the system has stopped), yellow for partially healthy (the system is running with reduced functionality), and green for completely healthy.

A comprehensive health-monitoring system enables an operator to drill down through the system to view the health status of subsystems and components. For example, if the overall system is depicted as partially healthy, the operator should be able to zoom in and determine which functionality is currently unavailable.

### Data sources, instrumentation, and data collection requirements
The raw data required to support health monitoring can be generated as a result of:

- Tracing execution of user requests. This information can be used to determine which requests have succeeded, which have failed, and how long each request takes.
- Synthetic user monitoring. This process simulates the steps performed by a user and follows a predefined series of steps. The results of each step should be captured.
- Logging exceptions, faults, and warnings. This information can be captured as a result of trace statements embedded into the application code, as well as retrieving information from the event logs of any services referenced by the system.
- Monitoring the health of any third-party services used by the system. This may require retrieving and parsing health data supplied by these services, and this information could take a variety of formats.
- Endpoint monitoring. This mechanism is described in more detail in the Availability monitoring section.
- Collecting ambient performance information, such as background CPU utilization or I/O (including network) activity.

### Analyzing health data
The primary focus of health monitoring is to quickly indicate whether the system is running. Hot analysis of the immediate data can trigger an alert if a critical component is detected to be unhealthy (it fails to respond to a consecutive series of pings, for example). The operator can then take the appropriate corrective action.

A more advanced system might include a predictive element that performs a cold analysis over recent and current workloads to spot trends and determine whether the system is likely to remain healthy or whether additional resources are going to be required. This predictive element should be based on critical performance metrics, such as the rate of requests directed at each service or subsystem, the response times of these requests, and the volume of data flowing into and out of each service. If the value of any metric exceeds a defined threshold the system can raise an alert to enable an operator or auto-scaling (if available) to take the preventative actions necessary to maintain system health. These actions might involve adding resources, restarting one or more services that are failing, or applying throttling to lower-priority requests.

## Availability monitoring
A truly healthy system requires that the components and subsystems that comprise the system are available. Availability monitoring is closely related to health monitoring, but whereas health monitoring provides an immediate view of the current health of the system, availability monitoring is concerned with tracking the availability of the system and its components to generate statistics concerning the uptime of the system.

In many systems, some components (such as a database) are configured with built-in redundancy to permit rapid failover in the event of a serious fault or loss of connectivity. Ideally, users should not be aware that such a failure has occurred, but from an availability monitoring perspective it is necessary to gather as much information as possible about such failures to try and determine the cause and take corrective actions to prevent them from recurring.

The data required to track availability may be dependent on a number of lower-level factors, many of which may be specific to the application, system, and environment. An effective monitoring system captures the availability data that corresponds to these low-level factors and then aggregates them to give an overall picture of the system. For example, in an ecommerce system, the business functionality that enables a customer to place orders might depend on the repository in which order details are stored and the payment system that handles the monetary transactions for paying for these orders. The availability of the order-placement part of the system is therefore a function of the availability of the repository and the payment sub-system.

### Requirements for availability monitoring
An operator should also be able to view the historical availability of each system and subsystem, and use this information to spot any trends that may be causing one or more subsystem to periodically fail (do services start to fail at a particular time of day that corresponds to peak processing hours?)

As well as providing an immediate and historical view of the availability or otherwise of each subsystem, a monitoring solution should also be capable of quickly alerting an operator when one or more services fail or users are unable to connect to services. This is not simply a matter of monitoring each service, but also examining the actions being performed by each user if these actions fail when they attempt to communicate with a service. To some extent, a degree of connectivity failure is normal and may be due to transient errors, but it may be useful to allow the system to raise an alert of the number of connectivity failures to a specified subsystem occur during a specific time period.

### Data sources, instrumentation, and data collection requirements
As with health monitoring, the raw data required to support availability monitoring can be generated as a result of synthetic user monitoring and logging any exceptions, faults, and warnings that may occur. In addition, availability data can be obtained from performing endpoint monitoring. The application can expose one or more health endpoints, each testing access to a functional area within the system. The monitoring system can ping each endpoint following a defined schedule and collect the results (success or fail).

All timeouts and network connectivity failures, and connection retry attempts must be recorded. All data should be time-stamped.

<a name="analyzing-availablity-data"></a>
### Analyzing availability data
The instrumentation data must be aggregated and correlated to support the following types of analysis:

- The immediate availability of the system and subsystems.
- The availability failure rates of the system and subsystems. Ideally an operator should be able to correlate failures with specific activities; what was happening when the system failed?
- An historical view of failure rates of the system or any subsystems across any specified time period, and the loading on the system (number of user requests for example) when a failure occurred.
- The reasons for unavailability of the system or any subsystems. For example, service not running, loss of connectivity, connected but timing out, and connected but returning errors.

You can calculate the percentage availability of a service over a period of time by using the formula:

```
%Availability =  ((Total Time – Total Downtime) / Total Time ) * 100
```

This is useful for SLA purposes ([SLA monitoring](#SLA-monitoring) is described in more detail later in this guidance). The definition of _Downtime_ depends on the service. For example, Visual Studio Online defines downtime as the period during which a customer's attempts to connect to the service take longer than 120 seconds and all basic read and write operations fail after the connection is established within that period.

## Performance monitoring
As the system is placed under more and more stress as the volume of users increase and the size of the datasets that these users access grows, the possible failure of one or more components becomes likely. Frequently, component failure is preceded by a decrease in performance. If you are able detect such a decrease you can take proactive steps to remedy the situation.

System performance is dependent on a number of factors. Each factor is typically measured by using Key Performance Indicators (KPIs), such as the number of database transactions per second, or the volume of network requests that are successfully serviced in a given timeframe. Some of these KPIs may be available as specific performance measures, while others may be derived from a combination of metrics.

> [AZURE.NOTE] Determining poor or good performance requires that you understand the level of performance at which the system should be capable of running. This requires observing the system while it is functioning under a typical load and capturing the data for each KPI over a period of time. This might involve running the system under a simulated load in a test environment and gathering the appropriate data before deploying the system to a production environment.

> You should also ensure that monitoring for performance purposes does not become an unwarranted burden on the system. You may be able to dynamically adjust the level of detail concerning the data that the performance monitoring process gathers.

### Requirements for performance monitoring
To examine system performance, an operator would typically need to see information including:

- The response rates for user requests.
- The number of concurrent user requests.
- The volume of network traffic.
- The rates at which business transactions are being completed.
- The average processing time for requests.

It can also be helpful to provide tools that enable an operator to help spot correlations, such as:

- The number of concurrent users versus request latency times (how long does it take to start processing a request after the user has sent it).
- The number of concurrent users versus the average response time (how long does it take to complete a request after it has started processing).
- The volume of requests versus the number of processing errors.

As well as this high-level functional information, an operator should also be able to obtain a detailed view of the performance for each component in the system. This data is typically provided by using low-level performance counters tracking information such as:

- Memory utilization,
- Number of threads,
- CPU processing time,
- Request queue length,
- Disk or network I/O rates and errors,
- Number of bytes written or read,
- Middleware indicators, such as queue length.

All visualizations should allow an operator to specify a time period; the data displayed could be a snapshot of the current situation and/or an historical view of the performance.

An operator should be able to raise an alert based on any performance measure for any given value during any specified time interval.

### Data sources, instrumentation, and data collection requirements
The high-level performance data (throughput, number of concurrent users, number of business transactions, error rates, and so on) can be gathered by monitoring the progress of users' requests as they arrive and pass through the system. This involves incorporating tracing statements at key points in the application code together with timing information. All faults, exceptions, and warnings should be captured with sufficient data to enable them to be correlated with the requests that caused them. The IIS log is another useful source.

If possible, you should also capture performance data for any external systems that the application uses. These external systems might provide their own performance counters or other features for requesting performance data. If this is not possible, you should record information such as the start time and end time of each request made to an external system, together with the status (success, fail, or warning) of the operation. For example, you can use a stopwatch approach to time requests; start a timer running when the request starts and then stop the timer when the request completes.

Low-level performance data for individual components in a system may be available through features such as Windows performance counters and Azure diagnostics.

### Analyzing performance data
Much of the analysis work consists of aggregating performance data by user request type (such as adding an item to a shopping cart, or performing the checkout process in an ecommerce system) and/or the subsystem or service to which each request is sent.

Another common requirement is summarizing performance data in selected percentiles. For example, determining the response times for 99% of requests, 95% of requests, and 70% of requests. There may be SLA targets or other goals set for each percentile. The ongoing results should be reported in both near real-time to help detect immediate issues, as well as being aggregated over the longer time for statistical purposes.

In the case of latency issues impacting performance, an operator should be quickly able to identify the cause of the bottleneck by examining the latency of each step performed by each request. The performance data must therefore provide a means of correlating performance measures for each step to tie them to a specific request.

Depending on the visualization requirements, it may be useful to generate and store a data cube containing views of the raw data to allow complex ad-hoc querying and analysis of the performance information.

## Security monitoring
All commercial systems that include sensitive data must implement a security structure. The complexity of the security mechanism is usually a function of the sensitivity of the data. In a system that requires users to be authenticated, you should record all login attempts, whether they fail or succeed. Additionally, all operations performed and the details of all resources accessed by an authenticated user should be logged. When the user terminates their session and logs out, this information should also be recorded.

Monitoring may be able to help detect attacks on the system. For example, a large number of failed login attempts might indicate a brute-force attack, or an unexpected surge in requests could be the result of a DDoS attack. You must be prepared to monitor all requests to all resources regardless of the source of these requests; a system with a login vulnerability may accidentally expose resources to the outside world without requiring that a user actually logs in.

### Requirements for security monitoring
The most critical aspects of security monitoring should enable an operator to quickly:

- Detect attempted intrusions by an unauthenticated entity,
- Identify attempts by entities to perform operations on data for which they have not been granted access,
- Determine whether the system, or some part of the system, is under attack from outside or inside (for example, a malicious authenticated user may be attempting to bring the system down).

To support these requirements, an operator should be notified:

- Of any repeated failed login attempts made by the same account within a specified time period.
- If the same authenticated account repeatedly tries to access a prohibited resource during a specified time period.
- If a large number of unauthenticated or unauthorized requests occur during a specified time period.

The information provided to an operator should include the host address of the source for each request. If security violations regularly arise from a particular range of addresses, then these hosts could be blocked.

A key part in maintaining the security of a system is being able to quickly detect actions that deviate from the usual pattern. Information such as the number of failed and/or successful login requests can be displayed visually to help detect whether there is a spike in activity at an unusual time (such as users logging in at 3am and performing a large number of operations when their working day starts at 9am). This information can also be used to help configure time-based autoscaling, For example, if an operator observes that a large number of users regularly log in at a particular time of day, the operator can arrange to start additional authentication services to handle the volume of work, and then shut these additional services down when the peak has passed.

### Data sources, instrumentation, and data collection requirements
Security is an all-encompassing aspect of most distributed systems, and the pertinent data is likely to be generated at multiple points throughout a system. You should consider adopting a Security Information and Event Management (SIEM) approach to gather the security-related information resulting from events raised by the application, network equipment, servers, firewalls, antivirus software, and other intrusion prevention elements.

Security monitoring can incorporate data from tools that are not part of your application, such as utilities that identify port scanning activities by external agencies, or network filters that detect attempts to gain unauthenticated access to your application and data.

In all cases the data gathered must enable an administrator to determine the nature of any attack and take the appropriate counter-measures.

### Analyzing security data
A feature of security monitoring is the variety of sources from which the data arises. The different formats and level of detail often require complex analysis of the data captured to tie it together into a coherent thread of information. Apart from the simplest of cases (such as detecting a large number of failed logins, or repeated attempts to gain unauthorized access to critical resources), it might not be possible to perform any complex automated processing of the security data, and instead it may be preferable to write this data, time-stamped but otherwise in its original form, to a secure repository to allow for expert manual analysis.

<a name="SLA-monitoring"></a>

## SLA monitoring
Many commercial systems that support paying customers make guarantees about the performance of the system in the form of SLAs. Essentially, SLAs state that the system can handle a defined volume of work within an agreed timeframe and without losing critical information. SLA monitoring is concerned with ensuring that the system can meet measurable SLAs.

> [AZURE.NOTE] SLA monitoring is closely related to performance monitoring, but whereas performance monitoring is concerned with ensuring that the system functions _optimally_, SLA monitoring is governed by a contractual obligation that defines what _optimally_ actually means.

SLAs are frequently defined in terms of:

- Overall system availability. For example, an organization may guarantee that the system will be available for 99.9% of the time; this equates to no more than 9 hours of downtime per year, or approximately 10 minutes a week.
- Operational throughput. This aspect is often expressed as one or more key high-water marks, such as guaranteeing that the system will be able to support up to 100,000 concurrent user requests or handle 10,000 concurrent business transactions.
- Operational response time. The system may also make guarantees concerning the rate at which requests are processed, such as 99% of all business transactions will complete within 2 seconds, and no single transaction will take longer than 10 seconds.

> [AZURE.NOTE] Some contracts for commercial systems might also include SLAs concerning customer support, such as all help desk requests will elicit a response within 5 minutes, and that 99% of all problems should be fully addressed within 1 working day. Effective [issue tracking](#issue-tracking) (described later in this section) is key to meeting SLAs such as these.

### Requirements for SLA monitoring
At the highest level, an operator should be able to determine at a glance whether the system is meeting the agreed SLAs or not, and if not then to drill down and examine the underlying factors to determine the reasons for substandard performance.

Typical high-level indicators that can be depicted visually include:

- The percentage of service uptime.
- The application throughput (measured in terms of successful transactions and/or operations per second).
- The number of successful/failing application requests.
- The number of application and system faults, exceptions, and warnings.

All of these indicators should be capable of being filtered by a specified period of time.

A cloud application will likely comprise a number of subsystems and components. An operator should be able to select a high-level indicator and see how it is composed from the health of the underlying elements. For example, if the uptime of the overall system falls below an acceptable value, an operator should be able to zoom in and determine which element(s) are contributing to this failure.

> [AZURE.NOTE] System uptime needs to be defined carefully. In a system that uses redundancy to ensure maximum availability, individual instances of elements may fail, but the system can remain functional. System uptime as presented by health monitoring should indicate the aggregate uptime of each element and not necessarily whether the system has actually halted. Additionally, failures may be isolated, so even if a specific system is unavailable the remainder of the system might remain available, although with decreased functionality (in an ecommerce system, a failure in the system might prevent a customer from placing orders but the customer might still be able to browse the product catalog.)

For alerting purposes, the system should be able to raise an event if any of the high-level indicators exceed a specified threshold. The lower-level details of the various factors that comprise the high-level indicator should be available as contextual data to the alerting system.

### Data sources, instrumentation, and data collection requirements
The raw data required to support SLA monitoring is similar to that required for performance monitoring together with some aspects of health and availability monitoring (see those sections for more details). You can capture this data by:

- Performing endpoint monitoring.
- Logging exceptions, faults, and warnings.
- Tracing execution of user requests.
- Monitoring the availability of any third-party services used by the system.
- Using performance metrics and counters.

All data must be timed and time-stamped.

### Analyzing SLA data
The instrumentation data must be aggregated to generate a picture of the overall performance of the system and to support drill-down to enable examination of the performance of the underlying subsystems. For example, you should be able to:

- Calculate the total number of user requests during a given period and determine the success and failure rate of these requests.
- Combine the response times of user requests to generate an overall view of system response times.
- Analyze the progress of user requests break the overall response time of a given request down into the response times of the individual work items in that request.  
- Determine the overall availability of the system as a percentage uptime for any specific period.
- Analyze the percentage time availability of each of the individual components and services in the system. This may involve parsing logs generating by third-party services.

Many commercial systems are required to report real performance figures against agreed SLAs for a specified period, typically a month. This information can be used to calculate credits or other forms of repayments for customers if the SLAs are not met during that period. You can calculate availability for a service by using the technique described in the section [Analyzing Availability Data](#analyzing-availability-data).

For internal purposes, an organization might also track the number and nature of incidents that caused services to fail. Learning how to resolve these issues quickly, or eliminate them completely, will help to reduce downtime and meet SLAs.

## Auditing
Depending on the nature of the application, there may be statutory or other legal regulations that specify requirements for auditing the operations performed by users and recording all data access. Auditing can provide evidence linking customers to specific requests; non-repudiation is an important factor in many e-business systems to help maintain trust be between a customer and the organization responsible for the application or service.

### Requirements for auditing
An analyst must be able to trace the sequence of business operations being performed by users so that you can reconstruct users' actions. This may be necessary simply as a matter of record, or as part of a forensic investigation.

Audit information is highly sensitive as it will likely include data that identifies the users of the system together with the tasks that they are performing. For this reason, it is most likely that audit information will be visualized in the form of reports only available to trusted analysts rather than by using an interactive system that supports drill-down graphical operations. An analyst should be able to generate a range of reports, for example listing all users' activities occurring during a specified time-frame, detailing the chronology of activity for a single user, or listing the sequence operations performed against one or more resources.

### Data sources, instrumentation, and data collection requirements
The primary sources of information for auditing can include:

- The security system that manages user authentication.
- Trace logs recording user activity.
- Security logs tracking all identifiable and non-identifiable network requests.

The format of the audit data and the way in which it is stored might be driven by regulatory requirements. For example, it may not be possible to clean the data in any way (it must be recorded in its original format), and access to the repository in which it is held must be protected to prevent tampering.

### Analyzing audit data
An analyst must be able to access the raw data in its entirety in its original form. Aside from the requirement to generate common audit reports, the tools used to analyze this data are likely to be specialized and kept external to the system.

## Usage monitoring
Usage monitoring tracks how the features and components of an application are used. The data gathered can be utilized to:

- Determine which features are heavily used and determine any potential hotspots in the system. High-traffic elements could benefit from functional partitioning or even replication to spread the load more evenly. This information can also be used to ascertain which features are infrequently used and are possible candidates for retirement or replacement in a future version of the system.
- Obtain information about the operational events of the system under normal use. For example, in an e-commerce site you could record the statistical information about the number of transactions and the volume of customers that are responsible for them. This information could be used for capacity planning as the number of customers grows.
- Detect (possibly indirectly) user satisfaction with the performance or functionality of the system. For example, if a large number of customers in an e-commerce system regularly abandon their shopping carts this could be due to a problem with the checkout functionality.
- Generate billing information. A commercial application or multi-tenant service may charge customers for the resources that they use.
- Enforce quotas. If a user in a multi-tenant system exceeds their paid quota of processing time or resource usage during a specified period, their access can be limited or processing throttled.

### Requirements for usage monitoring
To examine system usage, an operator would typically need to see information including:

- The number of requests being processed by each subsystem and directed to each resource.
- The work being performed by each user.
- The volume of data storage occupied by each user.
- The resources being accessed by each user.

An operator should also be able to generate graphs, for example, displaying the most resource-hungry users, or the most frequently accessed resources.

### Data sources, instrumentation, and data collection requirements
Usage tracking can be performed at a relatively high level, noting the start and end time of each request and the nature of the request (read, write, and so on, depending on the resource in question). You can obtain this information by:

- Tracing user activity.
- Capturing performance counters measuring the utilization for each resource.
- Monitoring the CPU and I/O utilization of operations performed by each user.

For metering purposes, you also need to be able to identity which users are responsible for performing which operations and the resources that these operations utilize. The information gathered should be detailed enough to enable accurate billing.

<a name="issue-tracking"></a>
## Issue tracking
Customers and other users may report issues if unexpected events or behavior occurs in the system. Issue tracking is concerned with managing these issues, associating them with efforts to resolve any underlying problems in the system, and informing customers of possible resolutions.

### Requirements for issue tracking
Issue tracking is often performed by using a separate system that enables operators to record and report the details of problems reported by users. These details can include information such as the tasks that the user was attempting to perform, symptoms of the problem, the sequence of events, and any error or warning messages that were issued.

### Data sources, instrumentation, and data collection requirements
The initial data source for issue tracking data is the user that reported the issue in the first place. The user may be able to provide additional data such as a crash dump (if the application includes a component that runs on the user's desktop), a screen snapshot, and the date and time at which the error occurred together with any other environmental information such as their location.

This information can be used to feed in to the debugging effort and help to construct a backlog for future releases of the software.

### Analyzing issue tracking data
Different users may report the same problem, and the issue tracking system should associate common reports together.

The progress of the debugging effort should be recorded against each issue report, and when the problem is resolved the customer can be informed of the solution.

If a user reports a recognized issue with a known solution in the issue tracking system, the operator should be able to inform the user of the solution immediately.

## Tracing operations and debugging software releases
When a user reports an issue, the user is often only aware of the immediate impact that it has on his or her operations, and the user can only report the results of their own experience back to an operator responsible for maintaining the system. These experiences are usually just a visible symptom of one or more fundamental problems. In many cases, an analyst will need to dig through the chronology of the underlying operations to establish the root cause of the problem (this process is referred to as _Root Cause Analysis_).

> [AZURE.NOTE] Root Cause Analysis may uncover inefficiencies in the design of an application. In these situations, it may be possible to rework the affected elements and deploy them as part of a subsequent release. This process requires careful control, and the updated components should be monitored closely.

### Requirements for tracing and debugging
For tracing unexpected events and other problems, it is vital that the monitoring data provides enough information not just about issues that occur at the high level, but also includes sufficient detail to enable an analyst to trace back to the origins of these issues and reconstruct the sequence of events that occurred. This information must be sufficient to enable an analyst to diagnose the root cause of any problems so that a developer can make the necessary modifications to prevent them from recurring.

### Data sources, instrumentation, and data collection requirements
Troubleshooting can involve tracing all the methods (and their parameters) invoked as part of an operation to build up a tree depicting the logical flow through the system when a customer makes a specific request. Exceptions and warnings generated by the system as a result of this flow need to be captured and logged.

To support debugging, the system can provide hooks that enable an operator to capture state information at crucial points in the system, or deliver detailed step-by-step information as selected operations progress. Capturing data at this level of detail can impose an additional load on the system should be a temporary process, mainly used when a highly unusual series of events occur that is difficult to replicate, or when a new release of one or more elements into a system require careful monitoring to ensure that they function as expected.

## The monitoring and diagnostics pipeline
Monitoring a large-scale distributed system poses a significant challenge, and each of the scenarios described in the previous section should not necessarily be considered in isolation. There is likely to be a significant overlap in the monitoring and diagnostic data required for each situation, although this data may need to be processed and presented in different ways. For these reasons, you should take a holistic view of monitoring and diagnostics.

You can envisage the entire monitoring and diagnostics process as a pipeline that comprises the stages shown in Figure 1.

![](media/best-practices-monitoring/Pipeline.png)

_Figure 1.
The stages in the monitoring and diagnostics pipeline_

Figure 1 highlights how the data for monitoring and diagnostics can come from a variety of data sources. The Instrumentation/Collection stage is concerned with instrumentation; determining which data to capture, how to capture it, and how to format this data so that it can be easily examined. The Analysis/Diagnosis phase takes the raw data and uses it to generate meaningful information that can be used to determine the state of the system. This information can be used to make decisions about possible actions to take, and the results can be fed back into the Instrumentation/Collection phase. The Visualization/Alerting stage phase presents a consumable view of the system state; it could display information in near real-time by using a series of dashboards, and it could generates reports, graphs, and charts to provide a historical view of the data that can help identify long-term trends. If information indicates that a KPI is likely to exceed acceptable bounds, then this stage can also trigger an alert to an operator. In some cases, an alert can also be used to trigger an automated process that attempts to take corrective actions, such as auto-scaling.

Note that these steps constitute a continuous-flow process where the stages are happening in parallel. Ideally, all the phases should be dynamically configurable; at some points, especially when a system has been newly deployed or is experiencing problems, it may be necessary to gather extended data on a more frequent basis. At other times, it should be possible to revert to capturing a base-level of essential information to verify that the system is functioning properly.

Additionally, the entire monitoring process should be considered a live, ongoing solution that is subject to fine-tuning and improvements as a result of feedback. For example, you might start with measuring many factors to determine system health, but analysis over time might lead to a refinement as you discard measures that are not relevant, enabling you to more precisely focus on the data that you need while minimizing any background noise.

## Sources of monitoring and diagnostic data
The information used by the monitoring process can come from several sources, as illustrated in Figure 1. At the application level, information comes from trace logs incorporated into the code of the system. Developers should follow a standard approach for tracking the flow of control through their code (for example, on entry to a method emit a trace message that specifies the name of the method, the current time, the value of each parameter, and any other pertinent information. Recording the entry and exit times could also prove useful). You should log all exceptions and warnings, and ensure that you retain a full trace of any nested exceptions and warnings. Ideally, you should also capture information that identifies the user running the code together with activity correlation information (to track requests as they pass through the system), and log attempts to access all resources such as message queues, databases, files, and other dependent services; this information can be used for metering and auditing purposes.

Many applications make use of libraries and frameworks to perform common tasks such as accessing a data store or communicating over a network. These frameworks may be configurable to output their own trace messages and raw diagnostic information such as transaction rates, data transmission successes and failures, and so on.

> [AZURE.NOTE] Many modern frameworks automatically publish performance and trace events, and capturing this information is simply a matter of providing a means to retrieve and store it where it can be processed and analyzed.

The operating system on which the application is running can be a source of low-level system-wide information, such as performance counters indicating I/O rates, memory utilization, and CPU usage. Operating system errors (such as the failure to open a file correctly) may also be reported.

You should also consider the underlying infrastructure and components on which your system runs. Virtual machines, virtual networks, and storage services can all be sources of important infrastructure-level performance counters and other diagnostic data.

If your application uses other external services, such as a web server or database management system, these services might publish their own trace information, logs, and performance counters. Examples include SQL Server Dynamic Management Views for tracking operations performed against a SQL Server database, and Internet Information Server trace logs for recording requests made to a web server.

As the components of a system are modified and new versions deployed, it is important to be able to attribute issues, events, and metrics to each version. This information should be tied back to the release pipeline so that problems with a specific version of a component can be tracked quickly and rectified.

Security issues might occur at any point in the system. For example, a user might attempt to log in with an invalid user ID or password; an authenticated user might try and obtain unauthorized access to a resource; or a user might provide an invalid or outdated key to access encrypted information. Security-related information for successful and failing requests should always be logged.

The section [Instrumenting an Application](#instrumenting-an-application) contains further guidance on the information that you should capture, but there are a variety of strategies that you can use to gather this information in the first place:

- **Application/System Monitoring**. This strategy uses internal sources within the application, the application frameworks, operating system, and infrastructure. The application code itself can generate its own monitoring data at notable points during the lifecycle of a client request. The application can include tracing statements which may be selectively enabled or disabled as circumstances dictate. It may also be possible to inject diagnostics dynamically by using a diagnostics framework. These frameworks typically provide plugins that can attach to various instrumentation points in your code and capture trace data at these points.

Additionally, your code and/or the underlying infrastructure may raise events at critical points. Monitoring agents that are configured to listen for these events can record the event information.

- **Real User Monitoring**. This approach records the interactions between a user and the application and observes the flow of each request and response. This information can have a two-fold purpose: it can be used for metering usage by each user, and it can be used to determine whether users are receiving a suitable quality of service (for example, fast response times, low latency, and minimal errors occurring). The data captured can be used to identify areas of concern where failures most frequently occur, and elements where the system slows down, possibly due to hotspots in the application or some other form of bottleneck. If this approach is carefully implemented, it may be possible to reconstruct users' flows through the application for debugging and testing purposes.

	> [AZURE.IMPORTANT] The data captured by monitoring real users should be considered highly sensitive as it may include confidential material. If the captured data is saved it must be stored securely. If the data is being used for performance monitoring or debugging purposes, all personally identifiable information should be stripped out first.

- **Synthetic User Monitoring**. In this approach, you write your own test client that simulates a user and performs a configurable but typical series of operations. You can track the performance of the test client to help determine the state of the system. You can also use multiple instances of the test client as part of a load-testing operation to establish how the system responds under stress, and what sort of monitoring output is generated under these conditions.

	> [AZURE.NOTE] You can implement real and synthetic user monitoring by including code that traces and times the execution of method calls and other critical parts of an application.

- **Profiling**. This approach is primarily targeted at monitoring and improving application performance. Rather than operating at the functional level employed by real and synthetic user monitoring, it captures lower-level information as the application runs. Profiling can be implemented by periodic sampling of the execution state of an application (determining which piece of code that the application is running at a given point in time), or by using instrumentation that inserts probes into the code at important junctures (such as the start and end of a method call) and records which methods were invoked, at what time, and how long each call took. This data can then be analyzed to determine which parts of the application could cause performance problems.

- **Endpoint Monitoring**. This technique uses one or more diagnostic endpoints exposed by the application specifically to enable monitoring. An endpoint provides a pathway into the application code and can return information about the health of the system. Different endpoints could focus on various aspects of the functionality. You can write your own diagnostics client that sends periodic requests to these endpoints and assimilate the responses. This approach is described more fully by the [Health Endpoint Monitoring Pattern](https://msdn.microsoft.com/library/dn589789.aspx) on the Microsoft website.

For maximum coverage, you should use these techniques in combination with each other.

<a name="instrumenting-an-application"></a>
## Instrumenting an application
Instrumentation is a critical part of the monitoring process; you can only make meaningful decisions about the performance and health of a system if you capture the data that enables you to make these decisions in the first place. The information that you gather by using instrumentation should be sufficient to enable you to assess performance, diagnose problems and make decisions without necessitating that you have to log in to a remote production server to perform tracing (and debugging) manually.

The instrumentation data will typically comprise information written to trace logs, and metrics:

- The contents of a trace log can be the result of textual data written by the application, binary data created as the result of a trace event (if the application is using Event Tracing for Windows – ETW), or they can be generated from system logs that record events arising from parts of the infrastructure, such as a web server. Textual log messages are often designed to be human-readable, but they should also be written in a format that enables them to be easily parsed by an automated system. You should also categorize logs; don't write all trace data to a single log but use separate logs to record the trace output from different operational aspects of the system. This enables you to quickly filter log messages by reading from the appropriate log rather than having to process a single lengthy file. Never write information that has different security requirements (such as audit information and debugging data) to the same log.

	> [AZURE.NOTE] A log may be implemented as a file on the file system, or it could be held in some other format such as a blob in blob storage. Log information might also be held in more structured storage, such as rows in a table.

- Metrics will generally simply be a measure or count of some aspect or resource in the system at a specific time with one or more associated tags or dimensions (sometimes referred to as a _sample_). A single instance of a metric is usually not useful in isolation; instead metrics have to be captured over time. The key issue to consider is which metrics should you record and how frequently. Generating data for metrics too often can impose a significant additional load on the system, whereas capturing metrics infrequently may cause you to miss the circumstances leading to a significant event. The considerations will vary from metric to metric. For example, CPU utilization on a server may vary significantly from second to second, but high utilization only becomes an issue if it is long-lived over a number of minutes.

<a name="information-for-correlating-data"></a>
### Information for correlating data
You can easily monitor individual system-level performance counters, capture metrics for resources, and obtain application trace information from various log files, but some forms of monitoring require the analysis and diagnostics stage in the monitoring pipeline to correlate the data retrieved from several sources. This data may take several forms in the raw data, and the analysis process must be provided with sufficient instrumentation data to be able to map these different forms. For example, at the application framework level, a task might be identified by a thread ID but within an application the same work might be associated with the user ID for the user performing that task. Furthermore, there is unlikely to be a 1:1 mapping between threads and user requests as asynchronous operations may reuse the same threads to perform operations on behalf of more than one user.  To complicate matters further, a single request may be handled by more than one thread as execution flows through the system. If possible, associate each request with a unique activity ID that is propagated through the system as part of the request context (the technique for generating and including activity IDs in trace information will be dependent on the technology being used to capture the trace data).

All monitoring data should be time-stamped in the same way. For consistency, record all dates and times by using Coordinated Universal Time. This will help to enable you to more easily trace sequences of events.

> [AZURE.NOTE] Computers operating in different timezones and networks might not be synchronized, so you should not depend on using timestamps alone for correlating instrumentation data that spans multiple machines.

### What information should the instrumentation data include?
Consider the following points when deciding which instrumentation data you need to collect:

- Information captured by trace events should be machine and human readable.  You should adopt well-defined schemas for this information to facilitate automated processing of log data across systems, and provide consistency to operations and engineering staff reading the logs. Include environmental information, such as the deployment environment, the machine on which the process is running, the details of the process, and the call stack.  
- Profiling can impose a significant overhead on the system and should only be enabled when necessary. Profiling by using instrumentation records an event (such as a method call) every time it occurs, whereas sampling only records selected events. The selection could be time-based – once every N seconds, or frequency-based – once every N requests. If events occur very frequently, profiling by instrumentation may cause too much of a burden and itself impact overall performance. In this case, the sampling approach may be preferable. However, if the frequency of events is low, then sampling might miss them and in this case instrumentation might be the better approach.
- Provide sufficient context to enable a developer or administrator to determine the source of each request. This may include some form of activity ID identifying a specific instance of a request, and information that can be used to correlate this activity with the computational work performed and the resources used. Note that this work may cross process and machine boundaries. For metering, the context should also include (either directly or indirectly via other correlated information) a reference to the customer that caused the request to be made. This context provides valuable information about the application state at the time the monitoring data was captured.
- Record all requests, and the locations or regions from which these requests are made. This information can assist in determining whether there are any location-specific hotspots, and provide data that can be useful in determining whether to repartition an application or the data that it uses.
- Record and capture the details of exceptions carefully. Often critical debug information is lost as a result of poor exception handling. Capture the full details of exceptions thrown by the application, including any inner exceptions and other context information, including the call stack if possible.
- Be consistent in the data that the different elements of your application capture as this can assist in analyzing events and correlating them with user requests. Consider utilizing a comprehensive and configurable logging package to gather information rather than depending on developers implementing different parts of the system all adopting the same approach. Gather data from key performance counters, such as the volume of I/O being performed, network utilization, number of requests, memory use, and CPU utilization. Some infrastructure services may provide their own specific performance counters, such as the number of connections to a database, the rate at which transactions are being performed, and the number of transactions that succeed or fail. Applications might also define their own specific performance counters.
- Log all calls made to external services, such as database systems, web services, or other system-level services provided as part of the infrastructure (Azure caching for example). Record information about the time taken to perform each call, and the success or failure of the call. If possible, capture information about all retry attempts and failures for any transient errors that occur.

### Ensuring compatibility with telemetry systems
In many cases, the information produced by instrumentation is generated as a series of events and passed to a separate telemetry system for processing and analysis. A telemetry system is typically independent of any specific application or technology, but expects information to follow a specific format usually defined by a schema. The schema effectively specifies a contract defining the data fields and types that the telemetry system can ingest. The schema should be generalized to allow for data arriving from a range of platforms and devices.

A common schema should include fields that are common to all instrumentation events, such as the event name, the event time, the IP address of the sender, and the details required for correlating with other events (such as a user ID, a device ID, and an application ID). Remember that events may be raised by any number of devices, so the schema should not be dependent on the device type. Additionally, events for the same application might be raised by a number of different devices; the application might support roaming or some other form of cross-device distribution. Ideally the majority of these fields should map to the output of the logging library used to capture the events.

The schema might also include domain fields that are relevant to a particular scenario common across different applications. This could be information about exceptions, application start and end events, and web services API call success and/or failure. All applications that use the same set of domain fields should emit the same set of events, enabling a set of common reports and analytics to be built.

Finally, a schema could contain custom fields for capturing the details of application-specific events.

### Best practices for instrumenting applications
The following list summarizes best practices for instrumenting a distributed application running in the cloud.

- Make logs easy to read and easy to parse. Use structured logging where possible. Be concise and descriptive in log messages.
- In all logs, identify the source and provide context and timing information as each log record is written.
- Use the same time zone and format for all timestamps. This will help to correlate events for operations that span hardware and services running in different geographic regions.
- Categorize logs and write messages to the appropriate log file.
- Do not disclose sensitive information about the system or personal information about users. Scrub this information before it is logged, but ensure that the relevant details are retained. For example, remove the ID and password from any database connection strings, but write the remaining information to the log so that an analyst can determine that the system is accessing the correct database. Log all critical exceptions, but enable the administrator to turn logging on and off for lower levels of exceptions and warnings. Also, capture and log all retry logic information. This data can be useful in monitoring the transient health of the system.
- Trace out of process calls, such as requests to external web services or database.
- Don’t mix log messages with different security requirements in the same log file. For example, don't write debug and audit information to the same log.
- With the exception of auditing events, all logging calls should be fire-and-forget operations that must not block the progress of business operations. Auditing events are exceptional because they are critical to the business and can be classified as a fundamental part of business operations.
- Logging should be extensible and not have any direct dependencies on concrete target. For example, rather than writing information by using _System.Diagnostics.Trace_, define an abstract interface (such as _ILogger_) which exposes logging methods and that can be implemented by using any appropriate means.
- All logging must be fail-safe and should never trigger any cascading errors. Logging must not throw any exceptions.
- Treat instrumentation as an ongoing iterative process and review logs regularly, not just when there is a problem.

## Collecting and storing data
The collection stage of the monitoring process is concerned with retrieving the information generated by instrumentation, formatting this data to make it easier to consume by the analysis/computation phase, and saving the transformed data in reliable and accessible storage. The instrumentation data that you gather from different parts of a distributed system could be held in a variety of locations and with varying formats. For example, your application code might generate trace log files, and generate application event log data, while performance counters that monitor key aspects of the infrastructure that your application uses could be captured by using other technologies.  Any third-party components and services that your application uses may provide instrumentation information in different formats, using separate trace files, blob storage, or even a custom data store.

Data collection is often performed by implementing a collection service which can run autonomously from the application that generates the instrumentation data. Figure 2 illustrates an example of this architecture, highlighting the instrumentation data collection subsystem.

![](media/best-practices-monitoring/TelemetryService.png)

_Figure 2.
Collecting instrumentation data_

Note that this is a simplified view. The collection service is not necessarily a single process and may comprise many constituent parts running on different machines, as described in the following sections. Additionally, if the analysis of some telemetry data needs to be performed quickly (hot analysis, as described in the section [Supporting Hot, Warm, and Cold Analysis](#supporting-hot-warm-and-cold-analysis) later in this document), local components operating outside of the collection service might perform the analysis tasks immediately. Figure 2 depicts this situation for selected events; after analytical processing the results can be sent directly to the visualization and alerting subsystem. Data subjected to warm or cold analysis is held in storage while it awaits processing.

For Azure applications and services, Azure Diagnostics (WAD) provides one possible solution for capturing data. WAD gathers data from the following sources for each compute node, aggregates it together, and then uploads it to Azure storage:

- Azure logs
- IIS logs
- IIS Failed Request logs
- Windows Event logs
- Performance counters
- Crash dumps
- Azure Diagnostic infrastructure logs  
- Custom error logs

For more information, see the article [Azure: Telemetry Basics and Troubleshooting](http://social.technet.microsoft.com/wiki/contents/articles/18146.windows-azure-telemetry-basics-and-troubleshooting.aspx) on the Microsoft website.

### Strategies for collecting instrumentation data
Given the elastic nature of the cloud, and to avoid the necessity of manually retrieving telemetry data from every node in the system, you should arrange for the data to be transferred to a central location and consolidated. In a system that spans multiple datacenters, it may be useful to first collect, consolidate, and store data on a region by region basis, and then aggregate the regional data into a single central system.

To optimize the use of bandwidth, you can elect to transfer less urgent data in chunks, as batches. However, the data must not be delayed indefinitely, especially if it contains time-sensitive information.

#### _Pulling and pushing instrumentation data_
The instrumentation data collection subsystem can either actively retrieve instrumentation data from the various logs and other sources for each instance of the application (the _pull model_), or it can act as a passive receiver waiting for the data to be sent from the components that constitute each instance of the application (the _push model_).

One approach to implementing the pull model is to use monitoring agents running locally with each instance of the application. A monitoring agent is a separate process that periodically retrieves (pulls) telemetry data collected at the local node and writes this information directly to centralized storage that is shared by all instances of the application. This is the mechanism implemented by WAD. Each instance of an Azure web or worker role can be configured to capture diagnostic and other trace information which is stored locally. The monitoring agent that runs alongside each copies the specified data to Azure storage. The page [Configuring Diagnostics for Azure Cloud Services and Virtual Machines](https://msdn.microsoft.com/library/azure/dn186185.aspx) on the Microsoft website provide more details on this process. Some elements, such as IIS logs, crash dumps, and custom error logs are written to blob storage, while data from the Windows Event log, ETW events, and performance counters is recorded in table storage. Figure 3 illustrates this mechanism:

![](media/best-practices-monitoring/PullModel.png)

_Figure 3.
Using a monitoring agent to pull information and write to shared storage_

> [AZURE.NOTE] Using a monitoring agent is ideally suited to capturing instrumentation data that is naturally pulled from a data source, such as information from SQL Server Management Views, or the length of an Azure Service Bus Queue.

For information about configuring and using Azure Diagnostics, visit the [Collect Logging Data by Using Azure Diagnostics](https://msdn.microsoft.com/library/azure/gg433048.aspx) page on the Microsoft website.

Telemetry data for a small-scale application running on a limited number of nodes can feasibly be stored in a single location using the approach just described. However, a complex, highly scalable, global cloud application might easily generate huge volumes of data from hundreds of web and worker roles, database shards, and other services. This flood of data could easily overwhelm the I/O bandwidth available with a single, central location. Therefore your telemetry solution must be scalable to prevent it acting as a bottleneck as the system expands, and ideally incorporate a degree of redundancy to reduce the risks of losing important monitoring information (such as auditing or billing data) if part of the system fails.

To address these issues, you can implement queueing. Figure 4 shows this structure. In this architecture, the local monitoring agent (if it can be configured appropriately) or custom data collection service (if not) posts data to a queue, and a separate process running asynchronously (the Storage Writing Service in Figure 4) takes the data in this queue and writes it to shared storage. A message queue is suitable for this scenario as it provides at least once semantics ensuring that once posted, queued data will not be lost. The Storage Writing Service can be implemented by using a separate worker role.

![](media/best-practices-monitoring/BufferedQueue.png)

_Figure 4.
Using a queue to buffer instrumentation data_

The local data collection service can add data to a queue immediately it is received. The queue acts as a buffer and the storage writing service can retrieve and write the data at its own pace. By default, a queue operates on a first-in-first-out basis, but you can prioritize messages to accelerate them through the queue if they contain data that must be handled more quickly. For more information, see the [Priority Queue](https://msdn.microsoft.com/library/dn589794.aspx) pattern. Alternatively, you could use different channels (such as Service Bus Topics) to direct data to different destinations depending on the form of analytical processing required.

For scalability, you could run multiple instances of the storage writing service. If there is a high volume of events, you could use an event hub to dispatch the data to different compute resources for processing and storage.

<a name="consolidating-instrumentation-data"></a>
#### _Consolidating instrumentation data_
The instrumentation data retrieved by the data collection service from a single instance of an application gives a localized view of the health and performance of that instance. To assess the overall health of the system, it is necessary to consolidate some aspects of the data in the local views together. This can be performed after the data has been stored, but in some cases it could also be achieved as the data is collected. Rather than being written directly to shared storage, the instrumentation data could pass through a separate data consolidation service which combines data and acts as a filter and cleanup process. For example, instrumentation data that includes the same correlation information such as an activity ID can be amalgamated (it is possible that a user starts performing a business operation on one node, and then gets transferred to another node in the event of node failure or depending on how load-balancing is configured). This process can also detect and remove any duplicated data (always a possibility if the telemetry service uses message queues to push instrumentation data out to storage). Figure 5 illustrates an example of this structure.

![](media/best-practices-monitoring/Consolidation.png)

_Figure 5.
Using a separate service to consolidate and clean up instrumentation data_

### Storing instrumentation data
The previous discussions have depicted a rather simplistic view of the way in which instrumentation data is stored. In reality, it can make sense to store the different types of information by using technologies that are most appropriate to the way in which each type is likely to be used. For example, Azure blob and table storage have some similarities in the way in which they are accessed, but have limitations concerning the operations that you can perform using them and the granularity of the data that they hold is quite different. If you need to perform more analytical operations or require full-text search capabilities on the data, it may be more appropriate to use data storage that provides capabilities that are optimized for specific types of queries and data access. For example, performance counter data could be stored in a SQL database to enable ad-hoc analysis; trace logs might be better stored in Azure DocumentDB; security information could be written to HDFS; information requiring full-text search could be stored by using Elastic Search (which can also speed searches by using rich indexing.) You can implement an additional service that periodically retrieves the data from shared storage, partitions and filters the data according to its purpose, and then writes it to an appropriate set of data stores as shown in Figure 6. An alternative approach is to include this functionality in the consolidation and cleanup process and write the data directly to these stores as it is retrieved rather than saving it in an intermediate shared storage area. Each approach has its advantages and disadvantages. Implementing a separate partitioning service lessens the load on the consolidation and cleanup service, and enables at least some of the partitioned data to be regenerated if necessary (depending on how much data is retained in shared storage). However, it consumes additional resources, and there may be a delay between the instrumentation data being received from each application instance and this data being converted into actionable information.

![](media/best-practices-monitoring/DataStorage.png)

_Figure 6.
Partitioning data according to analytical and storage requirements_

The same instrumentation data might be required for more than one purpose. For example, performance counters can be used to provide an historical view of system performance over time, but this information might also be combined with other usage data to generate customer billing information. In these situations, the same data might be sent to more than one destination, such as a document database which can act as a long-term store for holding billing information, and a multi-dimensional store for handling complex performance analytics.

You should also consider how urgently the data is required. Data that provides information for alerting needs to be accessed quickly, and so should be held in fast data storage and indexed or structured to optimize the queries that the alerting system performs. In some cases, it may be necessary for the telemetry service that gathers the data on each node to format and save data locally so that a local instance of the alerting system can quickly notify of any issues. The same data can be dispatched to the storage writing service shown in the previous diagrams and stored centrally if it is also required for other purposes.

Information that is used for more considered analysis, for reporting, and for spotting historical trends is less urgent and can be stored in a manner that supports data mining and ad-hoc queries. For more information, see the section [Supporting Hot, Warm, and Cold Analysis](#supporting-hot-warm-and-cold-analysis) later in this document.

#### _Log rotation and data retention_
Instrumentation can generate considerable volumes of data. This data can be held in several places, starting with the raw log files, trace files, and other information captured at each node to the consolidated, cleaned, and partitioned view of this data held in shared storage. In some cases, once the data has been processed and transferred the original raw source data can be removed from each node. In other cases, it may be necessary or simply useful to save the raw information. For example, data generated for debugging purposes may be best left available in its raw form but can then be discarded quite quickly once any bugs have been rectified. Performance data often has a longer life to enable it to be used to spot performance trends and for capacity planning. The consolidated view of this data is usually kept on-line for a finite period to enable fast access, after which it might be archived or discarded. Data gathered for metering and billing customers may need to be saved indefinitely. Additionally, regulatory requirements might dictate that information collected for auditing and security purposes will also need to be archived and saved. This data is also sensitive and may need to be encrypted or otherwise protected to prevent tampering. You should never record information such as users' passwords or other information that could be used to commit identity fraud; such details should be scrubbed from the data before it is stored.

#### _Down-sampling_
Frequently it is useful to store historical data to be able to spot long-term trends. Rather than saving old data in its entirety, it may be possible to down-sample the data to reduce its resolution and save storage costs. As an example, rather than saving minute-by-minute performance indicators, data more than a month old could be consolidated to form an hour-by-hour view.

### Best practices for collecting and storing logging information
The following list summarizes best practices for capturing and storing logging information.

- The monitoring agent or data collection service should run as an out-of-process service and should be simple to deploy.
- All output from the monitoring agent or data collection service should be an agnostic format that is independent of the machine, operating system, or network protocol. For example, emit information in a self-describing format such as JSON, MessagePack, or Protobuf rather than ETL/ETW. Using a standard format enables the system to construct processing pipelines; components that read, transform, and output data in the agreed format can be easily integrated.
- The monitoring and data collection process must be fail-safe and must not trigger any cascading error conditions.
- In the event of a transient failure while sending information to a data sink the monitoring agent or data collection service should be prepared to reorder telemetry data so that the newest information is sent first (the monitoring agent/data collection service may elect to drop the older data, or save it locally and transmit it later to catch up, at its own discretion.)

## Analyzing data and diagnosing issues
An important part of the monitoring and diagnostics process is analyzing the data gathered to obtain a picture of the overall wellbeing of the system. You should have defined your own KPIs and performance metrics, and it is important to understand how you can structure the data that has been gathered to meet your analysis requirements. It is also important to understand how the data captured in different metrics and log files is correlated, as this information can be key to tracking a sequence of events and help diagnose problems that arise.

As described in the section [Consolidating Instrumentation Data](#consolidating-instrumentation-data), the data for each part of the system is typically captured locally, but generally needs to be combined with data generated at other sites that participate in the system. This information requires careful correlation to ensure that data is combined accurately. For example, the usage data for an operation may span a node hosting a web site to which a user connects, a node running a separate service accessed as part of this operation, and data storage held on a further node. This information needs to be tied together to provide an overall view of the resource and processing usage for the operation. Some pre-processing and filtering of data might occur on the node on which the data is captured, while aggregation and formatting is more likely to occur on a central node.

<a name="supporting-hot-warm-and-cold-analysis"></a>
### Supporting hot, warm, and cold analysis
Analyzing and reformatting data for visualization, reporting, and alerting purposes can be a complex process that consumes its own set of resources. Some forms of monitoring are time critical and require immediate analysis of data to be effective. This is known as _hot analysis_. Examples include the analyses required for alerting and some aspects of security monitoring (such as detecting an attack on the system). Data required for these purposes must be quickly available and structured for efficient processing; it some cases it may be necessary to move the analysis processing to the individual nodes on which the data is held.

Other forms of analysis are less time-critical and may require some computation and aggregation once the raw data has been received. This is known as _warm analysis_. Performance analysis often  falls into this category. In this case, an isolated, single performance event is unlikely to be statistically significant (it could be caused by a sudden spike or glitch), whereas the data from a series of events should provide a more reliable picture of system performance. Warm analysis can also be used to help diagnose health issues. A health event is typically processed by performing hot analysis and can raise an alert immediately. An operator should be able to drill into the reasons for the health event by examining the data from the warm path; this data should contain information about the events leading up to the issue that caused the health event.

Some types of monitoring generate more long-term data, and the analysis can be performed at a later date, possibly according to a predefined schedule. In some cases, the analysis may need to perform complex filtering of large volumes of data captured over a period of time. This is known as _cold analysis_. The key requirement is that the data is stored safely once it has been captured. For example usage monitoring and auditing require an accurate picture of the state of the system at regular points in time, but this state information does not have to be available for processing immediately it has been gathered.  Cold analysis can also be utilized to provide the data for predictive health analysis. The historical information gathered over a specified period of time can be used in conjunction with the current health data (retrieved from the hot path) to spot trends that may soon cause health issues. In these cases, it may be necessary to raise an alert to enable corrective action to be taken.

### Correlating data
The data captured by instrumentation can provide a snapshot of the system state, but the purpose of analysis is to make this data actionable. For example, what has caused an intense I/O loading at the system level at a specific time? Is it the result of a large number of database operations? Is this reflected in the database response times, the number of transactions per second, and application response times at the same juncture? If so, then one remedial action that may reduce the load could be to shard the data over more servers. In addition, exceptions can arise as a result of a fault in any level of the system, and an exception in one level often triggers another fault in the level above. For these reasons you need to be able to correlate the different types of monitoring data at each level to produce an overall view of the state of the system and the applications that are executing on it. You can then use this information to make decisions about whether the system is functioning acceptably or not, and determine what can be done to improve the quality of the system.

As described in the section [Information for Correlating Data](#information-for-correlating-data), you must ensure that the raw instrumentation data includes sufficient context and activity ID information to support the required aggregations for correlating events. Additionally, this data might be held in different formats, and it may be necessary to parse this information to convert it into a standardized format for analysis purposes.

### Troubleshooting and diagnosing issues
Diagnosis requires being able to determine the cause of faults or unexpected behavior, including performing root cause analysis. The information required typically includes:

- Detailed information from event logs and traces either for the entire system or for a specified subsystem during a specified time window.
- Complete stack traces resulting from exceptions and faults of any specified level that occur either within the system or a specified subsystem during a specified period of time.
- Crash dumps for any failed processes either anywhere in the system or for a specified subsystem during a specified time window.
- Activity logs recording the operations being performed either by all users or for selected users during a specified period of time.

Analyzing data for troubleshooting purposes often requires a deep technical understanding of the system architecture and the various components that comprise the solution. As a result, it frequently requires a large degree of manual intervention to interpret the data, establish the cause of problems, and recommend an appropriate strategy to correct them. It may be appropriate simply to store a copy of this information in its original format and make it available for cold analysis by an expert.

## Visualizing data and raising alerts
An important aspect of any monitoring system is the ability to present the data in such a way that an operator can quickly spot any trends or problems, and to quickly inform an operator if a significant event has occurred that may require attention.

Data presentation can take several forms, including visualization by using dashboards, alerting, and reporting.

### Visualization with dashboards
The most common way to visualize data is to use dashboards that can display information as a series of charts, graphs, or some other pictorial manner. These items could be parameterized, and an analyst should be able to select the important parameters (such as the time period) for any specific situation. Dashboards can be organized hierarchically, with top-level dashboards giving an overall view of each aspect of the system but with the facility to enable an operator to drill down to the details. For example, a dashboard that depicts the overall disk I/O for the system should allow an analyst to dig into the data and view the I/O rates for each individual disk to ascertain whether one or more specific devices account for a disproportionate volume of traffic. Ideally the dashboard should also display related information, such as the source of each request (the user or activity) that is generating this I/O. This information could then be used to determine whether (and how) to spread the load more evenly across devices, and whether the system would perform better if more devices were added. A dashboard might also be able to use color-coding or some other visual cues to indicate values that appear anomalous or that are outside an expected range. Using the previous example, a disk with an I/O rate approaching its maximum capacity over an extended period (a hot disk) could be highlighted in red, a disk with an I/O rate that periodically runs at its maximum limit over short periods (a warm disk) could be highlighted in yellow, and a disk exhibiting normal usage could be displayed in green.

Note that for a dashboard system to work effectively, it must have the raw data with which to work. If you are building your own dashboard system, or utilizing a dashboard developed by another organization, you must understand which instrumentation data you need to collect, at what level(s) of granularity, and how it should be formatted for consumption by the dashboard.

A good dashboard does not only display information, it provides a means to allow an analyst to pose ad-hoc questions about that information. Some systems provide management tools that an operator can use to perform these tasks and explore the underlying data. Alternatively, depending on the repository used to hold this information it may be possible to query this data directly, or import it into tools such as Microsoft Excel for further analysis and reporting.

> [AZURE.NOTE] You should restrict access to dashboards to authorized personnel; this information may be commercially sensitive. You should also protect the underlying data presented by the dashboard to prevent users from changing it.

### Raising alerts
Alerting is the process of analyzing the monitoring and instrumentation data and generating a notification if a significant event is detected.

Alerting is used to ensure that the system remains healthy, responsive, and secure. It is an important part of any system that makes performance, availability, and privacy guarantees to the users, and the data may need to be acted on immediately. An operator may need to be notified of the event that triggered the alert. Alerting can also be used to invoke system functions such as autoscaling.

Alerting usually depends on the following instrumentation data:

- Security events. If the event logs indicate that repeated authentication and/or authorization failures are occurring, the system may be under attack and an operator should be informed.
- Performance metrics. The system must quickly respond if a particular performance metric exceeds a specified threshold.
- Availability information. If a fault is detected it may be necessary to quickly restart one or more subsystems, or failover to a backup resource. Repeated faults in a subsystem may indicate more serious concerns.

Operators may receive alert information by using many delivery channels such as email, a pager device, or an SMS text message. An alert might also include an indication of how critical the situation is that has arisen. Many alerting systems support subscriber groups, and all operators that are members of the same group can be sent the same set of alerts.

An alerting system should be customizable and the appropriate values from the underlying instrumentation data could be provided as parameters. This approach enables an operator to filter data and focus on those thresholds or combinations of values which are of interest. Note that in some cases, the raw instrumentation data could be provided to the alerting system, while in other situations it might be more appropriate to supply aggregated data (for example, an alert could be triggered if the CPU utilization for a node exceeded 90% over the last 10 minutes). The details provided to the alerting system should also include any appropriate summary and context information; this data can help to reduce the possibility of false-positive events tripping an alert.

### Reporting
Reporting is used to generate an overall view of the system, and may incorporate historical data as well as current information. Reporting requirements themselves fall into two broad categories: operational reporting and security reporting.

Operational reporting typically includes the following aspects:

- Aggregating statistics which enable you to understand resource utilization of the overall system or specified subsystems during a specified time window.
- Identifying trends in resource usage for the overall system or specified subsystems during a given period of time.
- Monitoring the exceptions that have occurred throughout the system or in specified subsystems during a given period of time.
- Determining the efficiency of the application in terms of the deployed resources, and understanding whether the volume of resources (and their associated cost) can be reduced without impacting performance unnecessarily.

Security reporting is concerned with tracking use of the system by customer, and can include:

- Auditing user operations; this requires recording the individual requests performed by each user together with dates and times. The data should be structured to enable an administrator to quickly reconstruct the sequence of operations performed by a specific user over a specified time period.
- Tracking resource use by user; this requires recording how each request for a user accesses the various resources that comprise the system, and for how long. An administrator must be able to use this data to generate a utilization report by user over a specified time period, possibly for billing purposes.

In many cases, reports can be generated by batch processes according to a defined schedule (latency is not normally an issue), but they should also be available for generation on an ad-hoc basis if needed.  As an example, if you are storing data in a relational database such as Azure SQL Database, you can use a tool such as SQL Server Reporting Services to extract and format data and present it as a set of reports.

## Related patterns and guidance
- The Autoscaling guidance describes how to decrease management overhead by reducing the need for an operator to continually monitor the performance of a system and make decisions about adding or removing resources.
- The [Health Endpoint Monitoring Pattern](https://msdn.microsoft.com/library/dn589789.aspx) describes how to implement functional checks within an application that external tools can access through exposed endpoints at regular intervals.
- The [Priority Queue](https://msdn.microsoft.com/library/dn589794.aspx) pattern shows how to prioritize queued messages so that urgent requests are received and can be processed before less urgent messages.

## More information
- The article [Monitor, Diagnose, and Troubleshoot Microsoft Azure Storage](storage-monitoring-diagnosing-troubleshooting.md) on the Microsoft website.
- The article [Azure: Telemetry Basics and Troubleshooting](http://social.technet.microsoft.com/wiki/contents/articles/18146.windows-azure-telemetry-basics-and-troubleshooting.aspx) on the Microsoft website.
- The page [Collect Logging Data by Using Azure Diagnostics](https://msdn.microsoft.com/library/azure/gg433048.aspx) on the Microsoft website.
- The page [Configuring Diagnostics for Azure Cloud Services and Virtual Machines](https://msdn.microsoft.com/library/azure/dn186185.aspx) on the Microsoft website.
- The [Azure Redis Cache](http://azure.microsoft.com/services/cache/), [Azure DocumentDB](http://azure.microsoft.com/services/documentdb/), and [HDInsight](http://azure.microsoft.com/services/hdinsight/) pages on the Microsoft website.
- The page [How to use Service Bus Queues](http://azure.microsoft.com/) on the Microsoft website.
- The article [SQL Server Business Intelligence in Azure Virtual Machines](./virtual-machines/virtual-machines-sql-server-business-intelligence.md) on the Microsoft website.
- The page [Understanding Monitoring Alerts and Notifications in Azure](https://msdn.microsoft.com/library/azure/dn306639.aspx) on the Microsoft website.
- The [Application Insights](app-insights-get-started/) page on the Microsoft website.
