---
title: Monitor the health of App Service instances
description: Learn how to monitor the health of App Service instances using health check.
keywords: azure app service, web app, health check, route traffic, healthy instances, path, monitoring,
author: msangapu-msft

ms.topic: article
ms.date: 12/03/2020
ms.author: msangapu

---
# Monitor App Service instances using health check

![Health check success diagram][1]

This article uses Health check in the Azure Portal to monitor App Service app instances. Health check finds unhealthy instances on your app and removes them, providing smoother end-user experience.

## What App Service does for you with health checks

- When a Health check path is provided, it pings all instances of your App Service web app every minute.
- The path must respond (within one minute) with a status code between 200 and 299 (inclusive).
- If an instance fails to respond to the ping, the system determines it's unhealthy and removes it from the load balancer rotation. This prevents the load balancer from routing requests to the unhealthy instances.
- If it continues to respond unsuccessfully, App Service will restart the underlying VM in an effort to return the instance to a healthy state.

> [!NOTE]
> - If an instance remains unhealthy for one hour, it will be replaced with new instance. At most one instance will be replaced per hour, with a maximum of three instances per day per App Service Plan.
> - Remember that your App Service Plan must be scaled to two or more instances for the load balancer exclusion to occur. If you only have 1 instance, it will not be removed from the load balancer even if it is unhealthy.
> - App Service does not follow 302 redirects on the health check path.
>

## Enable Health Check

**NEED SCREENSHOT and remove Jason's contact info from it**

Open the Portal to your App Service, then select **Health check** under **Monitoring**. Select **Enable** and provide a valid URL path on your application, such as `/health` or `/api/health`. Click **Save**.

## Configuration

### Max failures

You can configure the required number of failed pings with the `WEBSITE_HEALTHCHECK_MAXPINGFAILURES` app setting. This app setting can be set to any integer between 2 and 10. For example, if this is set to `2`, your instances will be removed from the load balancer after two failed pings.

Furthermore, when you are scaling up or out, App Service will ping the health check path to ensure that the new instances are ready for requests before being added to the load balancer.

### Unhealthy instances

![Health check failure diagram][2]

The remaining healthy instances may experience increased load. To avoid overwhelming the remaining instances, no more than half of your instances will be excluded. For example, if an App Service Plan is scaled out to 4 instances and 3 of which are unhealthy, at most 2 will be excluded from the load balancer rotation. The other 2 instances (1 healthy and 1 unhealthy) will continue to receive requests. In the worst-case scenario where all instances are unhealthy, none will be excluded.If you would like to override this behavior, you can set the `WEBSITE_HEALTHCHECK_MAXUNHEALTYWORKERPERCENT` app setting to a value between `0` and `100`. Setting this to a higher value means more unhealthy instances will be removed (the default value is 50).

## Health check path best practices

The Health check path should check the critical components of your application. For example, if your application depends on a database and a messaging system, the Health check endpoint should connect to those components. If the application cannot connect to a critical component, then the path should return a 500-level response code to indicate that the app is unhealthy.

## Authentication

Health check integrates with App Service's authentication and authorization features, the system will reach the endpoint even if these security features are enabled. If you are using your own authentication system, the health check path must allow anonymous access. If the site has HTTP**S**-Only  enabled, the Health check request will be sent via HTTP**S**.

### Security

Development teams at large enterprises often need to adhere to security requirements for their exposed APIs. To secure the Health check endpoint, you should first use features such as [IP restrictions](app-service-ip-restrictions.md#set-an-ip-address-based-rule), [client certificates](app-service-ip-restrictions.md#set-an-ip-address-based-rule), or a Virtual Network to restrict access to the application. You can secure the Health check endpoint itself by requiring that the `User-Agent` of the incoming request matches `ReadyForRequest/1.0`. The User-Agent cannot be spoofed since the request was already secured by the prior security features.

## Monitoring

After providing your application's health check path, you can monitor the health of your site using Azure Monitor. From the **Health check** blade in the Portal, click the **Metrics** in the top toolbar. This will open a new blade where you can see the site's historical health status and create a new alert rule. For more information on monitoring your sites, [see the guide on Azure Monitor](web-sites-monitor.md).


## Next steps
- [Create an Activity Log Alert to monitor all Autoscale engine operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/monitor-autoscale-alert)
- [Create an Activity Log Alert to monitor all failed Autoscale scale-in/scale-out operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/monitor-autoscale-failed-alert)


[1]: ./media/app-service-monitor-health-check/health-check-success-diagram.png
[2]: ./media/app-service-monitor-health-check/health-check-failure-diagram.png