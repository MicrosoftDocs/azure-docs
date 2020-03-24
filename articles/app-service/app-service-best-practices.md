---
title: Best Practices
description: Learn best practices and the common troubleshooting scenarios for your app running in Azure App Service.
author: dariagrigoriu

ms.assetid: f3359464-fa44-4f4a-9ea6-7821060e8d0d
ms.topic: article
ms.date: 07/01/2016
ms.author: dariac
ms.custom: seodec18

---
# Best Practices for Azure App Service
This article summarizes best practices for using [Azure App Service](https://go.microsoft.com/fwlink/?LinkId=529714). 

## <a name="colocation"></a>Colocation
When Azure resources composing a solution such as a web app and a database are located in different regions, it can have the following effects:

* Increased latency in communication between resources
* Monetary charges for outbound data transfer cross-region as noted on the [Azure pricing page](https://azure.microsoft.com/pricing/details/data-transfers).

Colocation in the same region is best for Azure resources composing a solution such as a web app and a database or storage account used to hold content or data. When creating resources, make sure they are in the same Azure region unless you have specific business or design reason for them not to be. You can move an App Service app to the same region as your database by using the [App Service cloning feature](app-service-web-app-cloning.md) currently available for Premium App Service Plan apps.   

## <a name="memoryresources"></a>When apps consume more memory than expected
When you notice an app consumes more memory than expected as indicated via monitoring or service recommendations, consider the [App Service Auto-Healing feature](https://azure.microsoft.com/blog/auto-healing-windows-azure-web-sites). One of the options for the Auto-Healing feature is taking custom actions based on a memory threshold. Actions span the spectrum from email notifications to investigation via memory dump to on-the-spot mitigation by recycling the worker process. Auto-healing can be configured via web.config and via a friendly user interface as described at in this blog post for the [App Service Support Site Extension](https://azure.microsoft.com/blog/additional-updates-to-support-site-extension-for-azure-app-service-web-apps).   

## <a name="CPUresources"></a>When apps consume more CPU than expected
When you notice an app consumes more CPU than expected or experiences repeated CPU spikes as indicated via monitoring or service recommendations, consider scaling up or scaling out the App Service plan. If your application is stateful, scaling up is the only option, while if your application is stateless, scaling out gives you more flexibility and higher scale potential. 

For more information about “stateful” vs “stateless” applications you can watch this video: [Planning a Scalable End-to-End Multi-Tier Application on Azure App Service](https://channel9.msdn.com/Events/TechEd/NorthAmerica/2014/DEV-B414#fbid=?hashlink=fbid). For more information about App Service scaling and autoscaling options, see [Scale a Web App in Azure App Service](manage-scale-up.md).  

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


## Next Steps
For more information on best practices, visit [App Service Diagnostics](https://docs.microsoft.com/azure/app-service/overview-diagnostics) to find out actionable best practices specific to your resource.

- Navigate to your Web App in the [Azure portal](https://portal.azure.com).
- Click on **Diagnose and solve problems** in the left navigation, which opens App Service Diagnostics.
- Choose **Best Practices** homepage tile.
- Click **Best Practices for Availability & Performance** or **Best Practices for Optimal Configuration** to view the current state of your app in regards to these best practices.

You can also use this link to directly open App Service Diagnostics for your resource: `https://ms.portal.azure.com/?websitesextension_ext=asd.featurePath%3Ddetectors%2FParentAvailabilityAndPerformance#@microsoft.onmicrosoft.com/resource/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/sites/{siteName}/troubleshoot`.