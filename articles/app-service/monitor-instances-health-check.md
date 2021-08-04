---
title: Monitor the health of App Service instances
description: Learn how to monitor the health of App Service instances using Health check.
keywords: azure app service, web app, health check, route traffic, healthy instances, path, monitoring, remove faulty instances, unhealthy instances, remove workers
author: msangapu-msft

ms.topic: article
ms.date: 07/19/2021
ms.author: msangapu
ms.custom: contperf-fy22q1
---

# Monitor App Service instances using Health check

This article uses Health check in the Azure portal to monitor App Service instances. Health check increases your application's availability by re-routing requests away from unhealthy instances, and replacing instances if they remain unhealthy. Your [App Service plan](./overview-hosting-plans.md) should be scaled to two or more instances to fully utilize Health check. The Health check path should check critical components of your application. For example, if your application depends on a database and a messaging system, the Health check endpoint should connect to those components. If the application cannot connect to a critical component, then the path should return a 500-level response code to indicate the app is unhealthy.

![Health check failure][1]

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
|`WEBSITE_HEALTHCHECK_MAXPINGFAILURES` | 2 - 10 | The required number of failed requests for an instance to be deemed unhealthy and removed from the load balancer. For example, when set to `2`, your instances will be removed after `2` failed pings. (Default value is `10`) |
|`WEBSITE_HEALTHCHECK_MAXUNHEALTHYWORKERPERCENT` | 0 - 100 | By default, no more than half of the instances will be excluded from the load balancer at one time to avoid overwhelming the remaining healthy instances. For example, if an App Service Plan is scaled to four instances and three are unhealthy, two will be excluded. The other two instances (one healthy and one unhealthy) will continue to receive requests. In the worst-case scenario where all instances are unhealthy, none will be excluded. <br /> To override this behavior, set app setting to a value between `0` and `100`. A higher value means more unhealthy instances will be removed (default value is `50`). |

#### Authentication and security

Health check integrates with App Service's [authentication and authorization features](overview-authentication-authorization.md). No additional settings are required if these security features are enabled.

If you're using your own authentication system, the Health check path must allow anonymous access. To secure the Health check endpoint, you should first use features such as [IP restrictions](app-service-ip-restrictions.md#set-an-ip-address-based-rule), [client certificates](app-service-ip-restrictions.md#set-an-ip-address-based-rule), or a Virtual Network to restrict application access. You can secure the Health check endpoint by requiring the `User-Agent` of the incoming request matches `HealthCheck/1.0`. The User-Agent can't be spoofed since the request would already secured by prior security features.

## Monitoring

After providing your application's Health check path, you can monitor the health of your site using Azure Monitor. From the **Health check** blade in the Portal, click the **Metrics** in the top toolbar. This will open a new blade where you can see the site's historical health status and create a new alert rule. For more information on monitoring your sites, [see the guide on Azure Monitor](web-sites-monitor.md).

## Limitations

- Health check should not be enabled on Premium Functions sites. Due to the rapid scaling of Premium Functions, the Health check requests can cause unnecessary fluctuations in HTTP traffic. Premium Functions have their own internal health probes that are used to inform scaling decisions.
- Health check can be enabled for **Free** and **Shared** App Service Plans so you can have metrics on the site's health and set up alerts, but because **Free** and **Shared** sites cannot scale out, any unhealthy instances will not be replaced. You should scale up to the **Basic** tier or higher so you can scale out to 2 or more instances and utilize the full benefit of Health check. This is recommended for production-facing applications as it will increase your app's availability and performance.

## Frequently Asked Questions

### What happens if my app is running on a single instance?

If your app is only scaled to one instance and becomes unhealthy, it will not be removed from the load balancer because that would take your application down entirely. Scale out to two or more instances to two or more instances to get the re-routing benefit of Health check. If your app is running on a single instance, you can still use Health check's [monitoring](#monitoring) feature to keep track of your application's health.
 
### Why are the Health check request not showing in my frontend logs?

The Health check request are sent to your site internally, so the request will not show in [the frontend logs](troubleshoot-diagnostic-logs.md#enable-web-server-logging). This also means the request will have an origin of `127.0.0.1` since it the request being sent internally. You can add log statements in your Health check code to keep logs of when your Health check path is pinged.

### Are the Health check requests sent over HTTP or HTTPS?

The Health check requests will be sent via HTTPS when [HTTPS Only](configure-ssl-bindings.md#enforce-https) is enabled on the site. Otherwise, they are sent over HTTP.

### What if I have multiple apps on the same App Service Plan?

Unhealthy instances will be always be removed from the load balancer rotation regardless of other apps on the App Service Plan (up to the percentage specified in [`WEBSITE_HEALTHCHECK_MAXUNHEALTHYWORKERPERCENT`](#configuration)). When an app on an instance remains unhealthy for over one hour, the instance will only be replaced if all other apps with Health check enabled are also unhealthy. Apps which do not have Health check enabled will not be taken into account. 

#### Example 

Imagine you have two applications (or one app with a slot) with Health check enabled, called App A and App B. They are on the same App Service Plan and that the Plan is scaled out to 4 instances. If App A becomes unhealthy on two instances, the load balancer will stop sending requests to App A on those two instances. Requests will still be routed to App B on those instances assuming App B is healthy. If App A remains unhealthy for over an hour on those two instances, those instances will only be replaced if App B is **also** unhealthy on those instances. If App B is healthy, the instance will not be replaced.

![Visual diagram explaining the example scenario above.][2]

> [!NOTE]
> If there were another site or slot on the Plan (Site C) without Health check enabled, it would not be taken into consideration for the instance replacement.

### What if all my instances are unhealthy?

In the scenario where all instances of your application are unhealthy, App Service will remove instances from the load balancer up to the percentage specified in `WEBSITE_HEALTHCHECK_MAXUNHEALTHYWORKERPERCENT`. In this scenario, taking all unhealthy app instances out of the load balancer rotation would effectively cause an outage for your application.

## Next steps
- [Create an Activity Log Alert to monitor all Autoscale engine operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/monitor-autoscale-alert)
- [Create an Activity Log Alert to monitor all failed Autoscale scale-in/scale-out operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/monitor-autoscale-failed-alert)
- [Environment variables and app settings reference](reference-app-settings.md)

[1]: ./media/app-service-monitor-instances-health-check/health-check-diagram.png
[2]: ./media/app-service-monitor-instances-health-check/health-check-multi-app-diagram.png
[3]: ./media/app-service-monitor-instances-health-check/azure-portal-navigation-health-check.png
