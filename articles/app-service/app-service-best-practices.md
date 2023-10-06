---
title: Best Practices
description: Learn best practices and the common troubleshooting scenarios for your app running in Azure App Service.

ms.assetid: f3359464-fa44-4f4a-9ea6-7821060e8d0d
ms.topic: article
ms.date: 07/01/2016
author: msangapu-msft
ms.author: msangapu
ms.custom: seodec18, devx-track-js
---
# Best Practices for Azure App Service
This article summarizes best practices for using [Azure App Service](./overview.md). 

## <a name="colocation"></a>Colocation
When Azure resources composing a solution such as a web app and a database are located in different regions, it can have the following effects:

* Increased latency in communication between resources
* Monetary charges for outbound data transfer cross-region as noted on the [Azure pricing page](https://azure.microsoft.com/pricing/details/data-transfers).

Colocation in the same region is best for Azure resources composing a solution such as a web app and a database or storage account used to hold content or data. When creating resources, make sure they are in the same Azure region unless you have specific business or design reason for them not to be. You can move an App Service app to the same region as your database by using the [App Service cloning feature](app-service-web-app-cloning.md) currently available for Premium App Service Plan apps.   

## <a name ="certificatepinning"></a>Certificate Pinning
Applications should never have a hard dependency or pin to the default \*.azurewebsites.net TLS certificate because the \*.azurewebsites.net TLS certificate could be rotated anytime given the nature of App Service as a Platform as a Service (PaaS). Certificate pinning is a practice where an application only allows a specific list of acceptable Certificate Authorities (CAs), public keys, thumbprints, or any part of the certificate hierarchy. In the event that the service rotates the App Service default wildcard TLS certificate, certificate pinned applications will break and disrupt the connectivity for applications that are hardcoded to a specific set of certificate attributes. The periodicity with which the \*.azurewebsites.net TLS certificate is rotated is also not guaranteed since the rotation frequency can change at any time.

Note that applications which rely on certificate pinning should also not have a hard dependency on an App Service Managed Certificate. App Service Managed Certificates could be rotated anytime, leading to similar problems for applications that rely on stable certificate properties. It is best practice to provide a custom TLS certificate for applications that rely on certificate pinning.

If an application needs to rely on certificate pinning behavior, it is recommended to add a custom domain to a web app and provide a custom TLS certificate for the domain which can then be relied on for certificate pinning.

## <a name="memoryresources"></a>When apps consume more memory than expected
When you notice an app consumes more memory than expected as indicated via monitoring or service recommendations, consider the [App Service Auto-Healing feature](https://azure.microsoft.com/blog/auto-healing-windows-azure-web-sites). One of the options for the Auto-Healing feature is taking custom actions based on a memory threshold. Actions span the spectrum from email notifications to investigation via memory dump to on-the-spot mitigation by recycling the worker process. Auto-healing can be configured via web.config and via a friendly user interface as described at in this blog post for the App Service Support Site Extension.   

## <a name="CPUresources"></a>When apps consume more CPU than expected
When you notice an app consumes more CPU than expected or experiences repeated CPU spikes as indicated via monitoring or service recommendations, consider scaling up or scaling out the App Service plan. If your application is stateful, scaling up is the only option, while if your application is stateless, scaling out gives you more flexibility and higher scale potential. 

For more information about App Service scaling and autoscaling options, see [Scale a Web App in Azure App Service](manage-scale-up.md).  

## <a name="socketresources"></a>When socket resources are exhausted
A common reason for exhausting outbound TCP connections is the use of client libraries, which are not implemented to reuse TCP connections, or when a higher-level protocol such as HTTP - Keep-Alive is not used. Review the documentation for each of the libraries referenced by the apps in your App Service Plan to ensure they are configured or accessed in your code for efficient reuse of outbound connections. Also follow the library documentation guidance for proper creation and release or cleanup to avoid leaking connections. While such client libraries investigations are in progress, impact may be mitigated by scaling out to multiple instances.

### Node.js and outgoing http requests
When working with Node.js and many outgoing http requests, dealing with HTTP - Keep-Alive is important. You can use the [agentkeepalive](https://www.npmjs.com/package/agentkeepalive) `npm` package to make it easier in your code.

Always handle the `http` response, even if you do nothing in the handler. If you don't handle the response properly, your application gets stuck eventually because no more sockets are available.

For example, when working with the `http` or `https` package:

```javascript
const request = https.request(options, function(response) {
    response.on('data', function() { /* do nothing */ });
});
```

If you are running on App Service on Linux on a machine with multiple cores, another best practice is to use PM2 to start multiple Node.js processes to execute your application. You can do it by specifying a startup command to your container.

For example, to start four instances:

```
pm2 start /home/site/wwwroot/app.js --no-daemon -i 4
```

## <a name="appbackup"></a>When your app backup starts failing
The two most common reasons why app backup fails are: invalid storage settings and invalid database configuration. These failures typically happen when there are changes to storage or database resources, or changes for how to access these resources (for example, credentials updated for the database selected in the backup settings). Backups typically run on a schedule and require access to storage (for outputting the backed-up files) and databases (for copying and reading contents to be included in the backup). The result of failing to access either of these resources would be consistent backup failure. 

When backup failures happen, review most recent results to understand which type of failure is happening. For storage access failures, review and update the storage settings used in the backup configuration. For database access failures, review and update your connections strings as part of app settings; then proceed to update your backup configuration to properly include the required databases. For more information on app backups, see [Back up a web app in Azure App Service](manage-backup.md).

## <a name="nodejs"></a>When new Node.js apps are deployed to Azure App Service
Azure App Service default configuration for Node.js apps is intended to best suit the needs of most common apps. If configuration for your Node.js app would benefit from personalized tuning to improve performance or optimize resource usage for CPU/memory/network resources, see [Best practices and troubleshooting guide for Node applications on Azure App Service](app-service-web-nodejs-best-practices-and-troubleshoot-guide.md). This article describes the iisnode settings you may need to configure for your Node.js app, describes the various scenarios or issues that your app may be facing, and shows how to address these issues.

## <a name=""></a>When Internet of Things (IoT) devices are connected to apps on App Service
There are a few scenarios where you can improve your environment when running Internet of Things (IoT) devices that are connected to App Service. One very common practice with IoT devices is "certificate pinning". To avoid any unforeseen downtime due to changes in the service's managed certificates, you should never pin certificates to the default \*.azurewebsites.net certificate nor to an App Service Managed Certificate. If your system needs to rely on certificate pinning behavior, it is recommended to add a custom domain to a web app and provide a custom TLS certificate for the domain which can then be relied on for certificate pinning. You can refer to the [certificate pinning](#certificatepinning) section of this article for more information.

To increase resiliency in your environment, you should not rely on a single endpoint for all your devices. You should at least host your web apps in two different regions to avoid a single point of failure and be ready to failover traffic. On App Service, you can add identical custom domain to different web apps as long as these web apps are hosted in different regions. This ensures that if you need to pin certificates, you can also pin on the custom TLS certificate that you provided. Another option would be to use a load balancer in front of the web apps, such as Azure Front Door or Traffic Manager, to ensure high availability for your web apps. You can refer to [Quickstart: Create a Front Door for a highly available global web application](../frontdoor/quickstart-create-front-door.md) or [Controlling Azure App Service traffic with Azure Traffic Manager](./web-sites-traffic-manager.md) for more information.

## Next Steps
For more information on best practices, visit [App Service Diagnostics](./overview-diagnostics.md) to find out actionable best practices specific to your resource.

- Navigate to your Web App in the [Azure portal](https://portal.azure.com).
- Click on **Diagnose and solve problems** in the left navigation, which opens App Service Diagnostics.
- Choose **Best Practices** homepage tile.
- Click **Best Practices for Availability & Performance** or **Best Practices for Optimal Configuration** to view the current state of your app in regards to these best practices.

You can also use this link to directly open App Service Diagnostics for your resource: `https://portal.azure.com/?websitesextension_ext=asd.featurePath%3Ddetectors%2FParentAvailabilityAndPerformance#@microsoft.onmicrosoft.com/resource/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{siteName}/troubleshoot`.
