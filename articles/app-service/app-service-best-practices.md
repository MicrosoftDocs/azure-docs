---
title: Best practices for Azure App Service
description: Learn best practices and common troubleshooting scenarios for your app running in Azure App Service.

ms.assetid: f3359464-fa44-4f4a-9ea6-7821060e8d0d
ms.topic: article
ms.date: 07/01/2016
author: msangapu-msft
ms.author: msangapu
ms.custom: devx-track-js
---
# Best practices for Azure App Service

This article summarizes best practices for using [Azure App Service](./overview.md).

## <a name="colocation"></a>Colocation

An Azure App Service solution consists of a web app and a database or storage account for holding content or data. When these resources are in different regions, the situation can have the following effects:

* Increased latency in communication between resources
* Monetary charges for outbound data transfer across regions, as noted on the [Azure pricing page](https://azure.microsoft.com/pricing/details/data-transfers)

Colocation is best for Azure resources that compose a solution. When you create resources, make sure they're in the same Azure region unless you have specific business or design reasons for them not to be. You can move an App Service app to the same region as your database by using the [App Service cloning feature](app-service-web-app-cloning.md) available in Premium App Service plans.

## <a name ="certificatepinning"></a>Certificate pinning

Certificate pinning is a practice in which an application allows only a specific list of acceptable certificate authorities (CAs), public keys, thumbprints, or any part of the certificate hierarchy.

Applications should never have a hard dependency or pin to the default wildcard (`*.azurewebsites.net`) TLS certificate. App Service is a platform as a service (PaaS), so this certificate could be rotated anytime. If the service rotates the default wildcard TLS certificate, certificate-pinned applications will break and disrupt the connectivity for applications that are hardcoded to a specific set of certificate attributes. The periodicity with which the certificate is rotated is also not guaranteed because the rotation frequency can change at any time.

Applications that rely on certificate pinning also shouldn't have a hard dependency on an App Service managed certificate. App Service managed certificates could be rotated anytime, leading to similar problems for applications that rely on stable certificate properties. It's a best practice to provide a custom TLS certificate for applications that rely on certificate pinning.

If your application needs to rely on certificate pinning behavior, we recommend that you add a custom domain to a web app and provide a custom TLS certificate for the domain. The application can then rely on the custom TLS certificate for certificate pinning.

## <a name="memoryresources"></a>Memory resources

When monitoring or service recommendations indicate that an app consumes more memory than you expected, consider the [App Service auto-healing feature](/azure/app-service/overview-diagnostics#auto-healing). You can configure auto-healing by using *web.config*.

One of the options for the auto-healing feature is taking custom actions based on a memory threshold. Actions range from email notifications to investigation via memory dump to on-the-spot mitigation by recycling the worker process.

## <a name="CPUresources"></a>CPU resources

When monitoring or service recommendations indicate that an app consumes more CPU than you expected or it experiences repeated CPU spikes, consider scaling up or scaling out the App Service plan. If your application is stateful, scaling up is the only option. If your application is stateless, scaling out gives you more flexibility and higher scale potential.

For more information about App Service scaling and autoscaling options, see [Scale up an app in Azure App Service](manage-scale-up.md).  

## <a name="socketresources"></a>Socket resources

A common reason for exhausting outbound TCP connections is the use of client libraries that don't reuse TCP connections or that don't use a higher-level protocol such as HTTP keep-alive.

Review the documentation for each library that the apps in your App Service plan reference. Ensure that the libraries are configured or accessed in your code for efficient reuse of outbound connections. Also follow the library documentation guidance for proper creation and release or cleanup to avoid leaking connections. While such investigations into client libraries are in progress, you can mitigate impact by scaling out to multiple instances.

### Node.js and outgoing HTTP requests

When you're working with Node.js and many outgoing HTTP requests, dealing with HTTP keep-alive is important. You can use the [agentkeepalive](https://www.npmjs.com/package/agentkeepalive) `npm` package to make it easier in your code.

Always handle the `http` response, even if you do nothing in the handler. If you don't handle the response properly, your application eventually gets stuck because no more sockets are available.

Here's an example of handling the response when you're working with the `http` or `https` package:

```javascript
const request = https.request(options, function(response) {
    response.on('data', function() { /* do nothing */ });
});
```

If you're running your App Service app on a Linux machine that has multiple cores, another best practice is to use PM2 to start multiple Node.js processes to run your application. You can do it by specifying a startup command to your container.

For example, use this command to start four instances:

```
pm2 start /home/site/wwwroot/app.js --no-daemon -i 4
```

## <a name="appbackup"></a>App backup

Backups typically run on a schedule and require access to storage (for outputting the backed-up files) and databases (for copying and reading contents to be included in the backup). The result of failing to access either of these resources is consistent backup failure.

The two most common reasons why app backup fails are invalid storage settings and invalid database configuration. These failures typically happen after changes to storage or database resources, or after changes to credentials for accessing those resources. For example, credentials might be updated for the database that you selected in the backup settings.

When backup failures happen, review the most recent results to understand which type of failure is happening. For storage access failures, review and update the storage settings in your backup configuration. For database access failures, review and update your connection strings as part of app settings. Then proceed to update your backup configuration to properly include the required databases.

For more information on app backups, see [Back up and restore your app in Azure App Service](manage-backup.md).

## <a name="nodejs"></a>Node.js apps

The Azure App Service default configuration for Node.js apps is intended to best suit the needs of most common apps. If you want to personalize the default configuration for your Node.js app to improve performance or optimize resource usage for CPU, memory, or network resources, see [Best practices and troubleshooting guide for Node applications on Azure App Service](app-service-web-nodejs-best-practices-and-troubleshoot-guide.md). That article describes the iisnode settings that you might need to configure for your Node.js app. It also explains how to address scenarios or problems with your app.

## <a name="iotdevices"></a>IoT devices

You can improve your environment when you're running Internet of Things (IoT) devices that are connected to App Service.

One common practice with IoT devices is certificate pinning. To avoid any unforeseen downtime due to changes in the service's managed certificates, you should never pin certificates to the default `*.azurewebsites.net` certificate or to an App Service managed certificate. If your system needs to rely on certificate pinning behavior, we recommend that you add a custom domain to a web app and provide a custom TLS certificate for the domain. The application can then rely on the custom TLS certificate for certificate pinning. For more information, see the [certificate pinning](#certificatepinning) section of this article.

To increase resiliency in your environment, don't rely on a single endpoint for all your devices. Host your web apps in at least two regions to avoid a single point of failure, and be ready to fail over traffic.

In App Service, you can add identical custom domains to multiple web apps, as long as these web apps are hosted in different regions. This capability ensures that if you need to pin certificates, you can also pin on the custom TLS certificate that you provided.

Another option is to use a load balancer in front of the web apps, such as Azure Front Door or Azure Traffic Manager, to ensure high availability for your web apps. For more information, see [Quickstart: Create a Front Door instance for a highly available global web application](../frontdoor/quickstart-create-front-door.md) or [Controlling Azure App Service traffic with Azure Traffic Manager](./web-sites-traffic-manager.md).

## Next steps

To get actionable best practices that are specific to your resource, use [App Service diagnostics](./overview-diagnostics.md):

1. Go to your web app in the [Azure portal](https://portal.azure.com).
1. Open App Service diagnostics by selecting **Diagnose and solve problems** on the left pane.
1. Select the **Best Practices** tile.
1. Select **Best Practices for Availability & Performance** or **Best Practices for Optimal Configuration** to view the current state of your app in regard to these best practices.

You can also use this link to directly open App Service diagnostics for your resource: `https://portal.azure.com/?websitesextension_ext=asd.featurePath%3Ddetectors%2FParentAvailabilityAndPerformance#@microsoft.onmicrosoft.com/resource/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{siteName}/troubleshoot`.
