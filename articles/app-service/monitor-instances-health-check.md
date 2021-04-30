---
title: Monitor the health of App Service instances
description: Learn how to monitor the health of App Service instances using Health check.
keywords: azure app service, web app, health check, route traffic, healthy instances, path, monitoring,
author: msangapu-msft

ms.topic: article
ms.date: 12/03/2020
ms.author: msangapu

---
# Monitor App Service instances using Health check

![Health check failure][2]

This article uses Health check in the Azure portal to monitor App Service instances. Health check increases your application's availability by removing unhealthy instances. Your [App Service plan](./overview-hosting-plans.md) should be scaled to two or more instances to use Health check. The Health check path should check critical components of your application. For example, if your application depends on a database and a messaging system, the Health check endpoint should connect to those components. If the application cannot connect to a critical component, then the path should return a 500-level response code to indicate the app is unhealthy.

## What App Service does with Health checks

- When given a path on your app, Health check pings this path on all instances of your App Service app at 1-minute intervals.
- If an instance doesn't respond with a status code between 200-299 (inclusive) after two or more requests, or fails to respond to the ping, the system determines it's unhealthy and removes it.
- After removal, Health check continues to ping the unhealthy instance. If it continues to respond unsuccessfully, App Service restarts the underlying VM in an effort to return the instance to a healthy state.
- If an instance remains unhealthy for one hour, it will be replaced with new instance.
- Furthermore, when scaling up or out, App Service pings the Health check path to ensure new instances are ready.

> [!NOTE]
> Health check doesn't follow 302 redirects. At most one instance will be replaced per hour, with a maximum of three instances per day per App Service Plan.
>

## Enable Health Check

![Health check navigation in Azure Portal][3]

- To enable Health check, browse to the Azure portal and select your App Service app.
- Under **Monitoring**, select **Health check**.
- Select **Enable** and provide a valid URL path on your application, such as `/health` or `/api/health`.
- Click **Save**.

> [!CAUTION]
> Health check configuration changes restart your app. To minimize impact to production apps, we recommend [configuring staging slots](deploy-staging-slots.md) and swapping to production.
>

### Configuration

In addition to configuring the Health check options, you can also configure the following [app settings](configure-common.md):

| App setting name | Allowed values | Description |
|-|-|-|
|`WEBSITE_HEALTHCHECK_MAXPINGFAILURES` | 2 - 10 | The maximum number of ping failures. For example, when set to `2`, your instances will be removed after `2` failed pings. Furthermore, when you are scaling up or out, App Service pings the Health check path to ensure new instances are ready. |
|`WEBSITE_HEALTHCHECK_MAXUNHEALTHYWORKERPERCENT` | 0 - 100 | To avoid overwhelming healthy instances, no more than half of the instances will be excluded. For example, if an App Service Plan is scaled to four instances and three are unhealthy, at most two will be excluded. The other two instances (one healthy and one unhealthy) will continue to receive requests. In the worst-case scenario where all instances are unhealthy, none will be excluded. To override this behavior, set app setting to a value between `0` and `100`. A higher value means more unhealthy instances will be removed (default is 50). |

#### Authentication and security

Health check integrates with App Service's authentication and authorization features. No additional settings are required if these security features are enabled. However, if you're using your own authentication system, the Health check path must allow anonymous access. If the site is HTTP**S**-Only  enabled, the Health check request will be sent via HTTP**S**.

Large enterprise development teams often need to adhere to security requirements for exposed APIs. To secure the Health check endpoint, you should first use features such as [IP restrictions](app-service-ip-restrictions.md#set-an-ip-address-based-rule), [client certificates](app-service-ip-restrictions.md#set-an-ip-address-based-rule), or a Virtual Network to restrict application access. You can secure the Health check endpoint by requiring the `User-Agent` of the incoming request matches `HealthCheck/1.0`. The User-Agent can't be spoofed since the request would already secured by prior security features.

## Monitoring

After providing your application's Health check path, you can monitor the health of your site using Azure Monitor. From the **Health check** blade in the Portal, click the **Metrics** in the top toolbar. This will open a new blade where you can see the site's historical health status and create a new alert rule. For more information on monitoring your sites, [see the guide on Azure Monitor](web-sites-monitor.md).

## Limitations

Health check should not be enabled on Premium Functions sites. Due to the rapid scaling of Premium Functions, the health check requests can cause unnecessary fluctuations in HTTP traffic. Premium Functions have their own internal health probes that are used to inform scaling decisions.

## Next steps
- [Create an Activity Log Alert to monitor all Autoscale engine operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/monitor-autoscale-alert)
- [Create an Activity Log Alert to monitor all failed Autoscale scale-in/scale-out operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/monitor-autoscale-failed-alert)

[1]: ./media/app-service-monitor-instances-health-check/health-check-success-diagram.png
[2]: ./media/app-service-monitor-instances-health-check/health-check-failure-diagram.png
[3]: ./media/app-service-monitor-instances-health-check/azure-portal-navigation-health-check.png
