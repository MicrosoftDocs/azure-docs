---
title: Routine maintenance, restarts, and downtime
description: Learn about common reasons for restarts and downtime during Routine Maintenance and options to minimize disruptions.
author: kamilsykora
ms.author: kamils

ms.topic: article
ms.date: 09/10/2024
---

# Routine maintenance for Azure App Service, restarts, and downtime


Azure App Service is a Platform as a Service (PaaS) for hosting web applications, REST APIs, and mobile back ends. One of the benefits of the offering is that planned maintenance is performed behind the scenes. Our customers can focus on deploying, running, and maintaining their application code instead of worrying about maintenance activities for the underlying infrastructure. Azure App Service maintenance is a robust process designed to avoid or minimize downtime to hosted applications. This process remains largely invisible to the users of hosted applications. However, our customers are often curious if downtime that they experience is a result of our planned maintenance, especially if they seem to coincide in time.

## Background

Our planned maintenance mechanism revolves around the architecture of the scale units that host the servers on which deployed applications run. Any given scale unit contains several different types of roles that all work together. The two roles that are most relevant to our planned maintenance update mechanism are the Worker and File Server roles. For a more detailed description of all the different roles and other details about the App Service architecture,  review  [Inside the Azure App Service Architecture](/archive/msdn-magazine/2017/february/azure-inside-the-azure-app-service-architecture)
 
There are different ways that an update strategy could be designed and those different designs would each have their own benefits and downsides. One of the strategies that we use for major updates is that these updates don't run on servers / roles that are currently used by our customers. Instead, our update process updates instances in waves and the instances undergoing updates aren't used by applications. Instances being used by applications are gradually swapped out and replaced by updated instances. The resulting effect on an application is that the application experiences a start, or restart. From a statistical perspective and from empirical observations, applications restarts are much less disruptive than performing maintenance on servers that are actively being used by applications. 

## Instance update details
 
There are two slightly different scenarios that play out during every Planned Maintenance cycle. These two scenarios are related to the updates performed on the Worker and File Server roles. At a high level, both these scenarios appear similar from an end-user perspective but there are some important differences that can sometimes cause some unexpected behavior.
 
When a File Server role needs to be updated, the storage volume used by the application needs to be migrated from one File Server instance to another. During this change, an updated File Server role is added to the application. This causes a worker process restart simultaneously on all worker instances in that App Service Plan. The worker process restart is overlapped - the update mechanism starts the new worker process first, lets it complete its start-up, sends new requests to the new worker process. Once the new worker process is responding, the existing requests have 30 seconds by default to complete in the old worker process, then the old worker process is stopped. 
 
When a Worker role is updated, the update mechanism similarly swaps in a new updated Worker role. The worker is swapped as follows - An updated Worker is added to the ASP, the application is started on the new Worker, our infrastructure waits for the application to start-up, new requests are sent to the new worker instance, requests are allowed to complete on the old instance, then the old worker instance is removed from the ASP. This sequence usually occurs once for each worker instance in the ASP and is spread out over minutes or hours depending on the size of the plan and scale unit.
 
The main differences between these two scenarios are:
 
- A File Server role change results in a simultaneous overlapped worker process restart on all instances, whereas a Worker change results in an application start on a single instance.
- A File Server role change means that the application restarts on the same instance as it was running before, whereas a Worker change results in the application running on a different instance after start-up.
 
The overlapped restart mechanism results in zero downtime for most applications and planned maintenance isn't even noticed. If the application takes some time to start, the application can experience some minimal downtime associated with application slowness or failures during or shortly after the process starts. Our platform keeps attempting to start the application until successful but if the application fails to start altogether, a longer downtime can occur. The downtime persists until some corrective action is taken, such as manually restarting the application on that instance.
 
## Unexpected failure handling
 
While this article focuses largely on planned maintenance activities, it's worth mentioning that similar behavior can occur as a result of the platform recovering from unexpected failures. If an unexpected hardware failure occurs that affects a Worker role, the platform similarly replaces it by a new worker. The application starts on this new Worker role. When a failure or latency affects a File Server role that is associated with the application, a new File Server role replaces it. A worker process restart occurs on all the Worker roles. This fact is important to consider when evaluating strategies for improving uptime for your applications.
 
## Strategies for increased uptime
 
Most of our hosted applications experience limited or no downtime during planned maintenance. However, this fact isn't helpful if your specific applications have a more complicated start-up behavior and are therefore susceptible to downtime when restarted. If applications are experiencing downtime every time they're restarted, addressing the downtime is even more pressing. There are several features available in our App Service product offering that are designed to further minimize downtime in these scenarios. Broadly speaking there are two categories of strategies that can be employed:
 
- Improving application start-up consistency
- Minimizing application restarts
 
Improving application start-up speed and ensuring it's consistently successful has a higher success rate statistically. We recommend reviewing options that are available in this area first. Some of them are fairly easy to implement and can yield large improvements. Start-up consistency strategies utilize both App Service features and techniques related to application code or configuration. Minimizing restarts is a group of options that can be used if we can't improve application start-up to be consistent enough. These options are typically more expensive and less reliable as they usually protect against a subset of restarts. Avoiding all restarts isn't possible. Using both types of strategies is something that is highly effective.


### Strategies for start-up consistency
 
#### Application Initialization (AppInit)
 
When an application starts on a Windows Worker, the Azure App Service infrastructure tries to determine when the application is ready to serve requests before external requests are routed to this worker. By default, a successful request to the root (/) of the application is a signal that the application is ready to serve requests. For some applications, this default behavior isn't sufficient to ensure that the application is fully warmed up. Typically that happens if the root of the application has limited dependencies but other paths rely on more libraries or external dependencies to work. The [IIS Application Initialization Module](/iis/get-started/whats-new-in-iis-8/iis-80-application-initialization) works well to fine tune warm-up behavior. At a high level, it allows the application owner to define which path or paths serve as indicators that the application is in fact ready to serve requests. For a detailed discussion of how to implement this mechanism, review the following article: [App Service Warm-Up Demystified](https://michaelcandido.com/app-service-warm-up-demystified/) . When correctly implemented, this feature can result in zero downtime even if the application start-up is more complex.

Linux applications can utilize a similar mechanism by using the WEBSITE_WARMUP_PATH application setting.

#### Health Check
 
[Health Check](monitor-instances-health-check.md) is a feature that is designed to handle unexpected code and platform failures during normal application execution but can also be helpful to augment start-up resiliency. Health Check performs two different healing functions - removing a failing instance from the load balancer, and replacing an entire instance. We can utilize the removal of an instance from the load balancer to handle intermittent start-up failures. If an instance returns failures after start-up despite employing all other strategies, health check can remove that instance from the load balancer until that instance starts returning 200 status code to health check requests again. This feature therefore acts as a fail-safe to minimize any post start-up downtime that occurs. This feature can be useful if the post start-up failures are transient and don't require process restart.

#### Auto-Heal
 
Auto-Heal for [Windows](https://azure.github.io/AppService/2018/09/10/Announcing-the-New-Auto-Healing-Experience-in-App-Service-Diagnostics.html) and [Linux](https://azure.github.io/AppService/2021/04/21/Announcing-Autoheal-for-Azure-App-Service-Linux.html) is another feature that is designed for normal application execution but can be used for improving start-up behavior as well. If we know that the application sometimes enters an unrecoverable state after start-up, Health Check won't be suitable. However, auto-heal can automatically restart the worker process which can be useful in that scenario. We can configure an auto-heal rule that monitors failed requests and trigger a process restart on a single instance.

#### Application start-up testing
 
Testing the start-up of an application exhaustively can be overlooked. Start-up testing in combination with other factors such as dependency failures, library load failures, network issues etc. poses a bigger challenge. A relatively small failure rate for start-up can go unnoticed but can result in a high failure rate when there are multiple instances being restarted every update cycle. A plan with 20 instances and an application with a five-percent failure rate in start-up, results in three instances failing to start on average every update cycle. There are usually three application restarts per instance (20 instance moves and 2 File Server related restarts per instance). 
 
We recommend testing several scenarios
 
- General start-up testing (one instance at a time) to establish individual instance start-up success rate. This simplest scenario should approach 100 percent before moving on to other more complicated scenarios.
- Simulate start-up dependency failure. If the app has any dependency on other Azure or non-Azure services, simulate downtime in those dependencies to reveal application behavior under those conditions.
- Simultaneous start-up of many instances - preferably more instances than in production. Testing with many instances often reveals dependency failures that are often used during start-up only, such as KeyVault references, App Configuration, databases etc. These dependencies should be tested for burst volume of requests that a simultaneous instance restart generates.
- Adding an instance under full load - making sure AppInit is configured correctly and application can be initialized fully before requests are sent to the new instance. Manual scaling out is an easy way to replicate an instance move during maintenance.
- Overlapped worker process restart - again testing whether AppInit is configured correctly and if requests can complete successfully as the old worker process completes and new worker process starts up. Changing an environment variable under load can simulate what a File Server change does.
- Multiple apps in a plan - if there are multiple apps in the same plan, perform all these tests simultaneously across all apps.


#### Start-up logging
 
Having the ability to retroactively troubleshoot start-up failures in production is a consideration that is separate from using testing to improve start-up consistency. However, it's equally or more important since despite all our efforts, we might not be able to simulate all types of real-world failures in a test or QA environment. It's also commonly the weakest area for logging as initializing the logging infrastructure is another start-up activity that must be performed. The order of operations for initializing the application is an important consideration for this reason and can become a chicken and egg type of problem. For example, if we need to configure logging based on a KeyVault reference, and we fail to obtain the KeyVault value, how do we log this failure? We might want to consider duplicating start-up logging using a separate logging mechanism that doesn't depend on any other external factors. For example, logging these types of start-up failures to the local disk. Simply turning on a general logging feature, such as [.NET Core stdout logging](/aspnet/core/test/troubleshoot-azure-iis#aspnet-core-module-stdout-log-azure-app-service), can be counter-productive as this logging keeps generating log data even after start-up, and that can fill up the disk over time. This feature can be used strategically for troubleshooting reproducible start-up failures.

### Strategies for minimizing restarts
 
The following strategies can significantly reduce the number of restarts that an application experiences during planned maintenance. Some of the strategies in this section can also give more control over when these restarts occur. In general, these strategies, while effective, can't avoid restarts altogether. The main reason is that some restarts occur due to unexpected failures rather than planned maintenance.

> [!IMPORTANT]
> Completely avoiding restarts is not possible. The following strategies can help reduce the number of restarts.
 
#### Local Cache
 
[Local Cache](overview-local-cache.md) is a feature that is designed to improve resiliency due to external storage failures. At a high level, it creates a copy of the application content on the local disk of the instance on which it runs. This isolates the application from unexpected storage failures but also prevents restarts due to File Server changes. Utilizing this feature can vastly reduce the number of restarts during public maintenance - typically it can remove about two thirds of those restarts. Since it primarily avoids simultaneous worker process restarts, the observed improvement on application start-up consistency can be even bigger. Local Cache does have some design implications and changes to application behavior so it's important to fully test the application to ensure that the application is compatible with this feature.

#### Planned maintenance notifications and paired regions
 
If we want to reduce the risk of update-related restarts in production, we can utilize [Planned Maintenance Notifications](https://azure.github.io/AppService/2022/02/01/App-Service-Planned-Notification-Feature.html) to find out when any given application will be updated. We can then set up a copy of the application in a [Paired Region](https://azure.github.io/AppService/2022/02/01/App-Service-Planned-Notification-Feature.html) and route traffic to our secondary application copy during maintenance in the primary copy. This option can be costly as the window for this maintenance is fairly wide so the secondary application copy needs to run on sufficient instances for at least several days. This option can be less costly if we already have a secondary application set up for general resiliency. This option can reduce the number of restarts but like other options in this category can't eliminate all restarts.
 
#### Controlling planned maintenance window in ASE v3
 
Controlling the window for maintenance is only available in our isolated ASE v3 environments. If we're using an ASE already, or it's feasible to use an ASE, doing so allows our customers to [Control Planned Maintenance](https://azure.github.io/AppService/2022/09/15/Configure-automation-for-upgrade-preferences-in-App-Service-Environment.html) behavior to a high degree. It isn't possible to control the time of the planned maintenance in a multitenant environment.
