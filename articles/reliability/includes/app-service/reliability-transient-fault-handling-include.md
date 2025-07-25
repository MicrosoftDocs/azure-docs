---
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/17/2025
 ms.author: anaharris
 ms.custom: include file
---

Microsoft-provided SDKs usually handle transient faults. Because you host your own applications on App Service, take steps to reduce the chance of transient faults:

- **Deploy multiple instances in your plan.** App Service performs automated updates and other forms of maintenance on instances in your plan. If an instance becomes unhealthy, the service can automatically replace that instance with a new healthy instance. During the replacement process, there can be a short period when the previous instance is unavailable and a new instance isn't ready to serve traffic. To mitigate these effects, deploy multiple instances of your App Service plan.

- **Use deployment slots.** App Service [deployment slots](/azure/app-service/deploy-staging-slots) enable zero-downtime deployments of your applications. Use deployment slots to minimize the effect of deployments and configuration changes for your users. Deployment slots also reduce the likelihood that your application restarts. Restarting the application causes a transient fault.

- **Avoid scaling up or scaling down.** These operations change the CPU, memory, and other resources assigned to each instance, and they can trigger an application restart. Instead, select a tier and instance size that meet your performance requirements under typical load. To scale out and scale in, dynamically add and remove instances to handle changes in traffic volume.