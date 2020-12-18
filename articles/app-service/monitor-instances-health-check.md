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

This article uses Health check in the Azure Portal to monitor App Service app instances. Health check increases your application's availability by removing unhealthy instances from the load balancer.

## Prerequisites

- An existing [App Service app](index.yml).
- An [App Service plan](/overview-hosting-plans) with two or more instances.

## What App Service does with health checks

- Given a custom path on your app, Health check pings this path on all instances of your App Service app at 1-minute intervals.
- If an instance doesn't respond with a status code between 200-299 (inclusive), or fails to respond to the ping, the system determines it's unhealthy and removes it from the load balancer rotation.
- After removal from the load balancer, Health check continues to ping the unhealthy instance. If it continues to respond unsuccessfully, App Service restarts the underlying VM in an effort to return the instance to a healthy state.
- If an instance remains unhealthy for one hour, it will be replaced with new instance.

> [!NOTE]
> - Health check doesn't follow 302 redirects on the custom path.
> - At most one instance will be replaced per hour, with a maximum of three instances per day per App Service Plan.

## Health check path best practices

The Health check path should check the critical components of your application. For example, if your application depends on a database and a messaging system, the Health check endpoint should connect to those components. If the application cannot connect to a critical component, then the path should return a 500-level response code to indicate that the app is unhealthy.

## Enable Health Check

![Health check navigation in Azure Portal][3]

Open the Portal to your App Service, then select **Health check** under **Monitoring**. Select **Enable** and provide a valid URL path on your application, such as `/health` or `/api/health`. Click **Save**.

### Configuration

#### Max failures

You can configure the required number of failed pings with the `WEBSITE_HEALTHCHECK_MAXPINGFAILURES` app setting. This app setting can be set to any integer between 2 and 10. For example, if this is set to `2`, your instances will be removed from the load balancer after two failed pings.

Furthermore, when you are scaling up or out, App Service will ping the health check path to ensure that the new instances are ready for requests before being added to the load balancer.

#### Percentage of unhealthy instances

The remaining healthy instances may experience increased load. To avoid overwhelming the remaining instances, no more than half of your instances will be excluded. For example, if an App Service Plan is scaled out to 4 instances and 3 of which are unhealthy, at most 2 will be excluded from the load balancer rotation. The other 2 instances (1 healthy and 1 unhealthy) will continue to receive requests. In the worst-case scenario where all instances are unhealthy, none will be excluded.If you would like to override this behavior, you can set the `WEBSITE_HEALTHCHECK_MAXUNHEALTYWORKERPERCENT` app setting to a value between `0` and `100`. Setting this to a higher value means more unhealthy instances will be removed (the default value is 50).



## Authentication

Health check integrates with App Service's authentication and authorization features, the system will reach the endpoint even if these security features are enabled. If you are using your own authentication system, the health check path must allow anonymous access. If the site has HTTP**S**-Only  enabled, the Health check request will be sent via HTTP**S**.

### Security

Development teams at large enterprises often need to adhere to security requirements for their exposed APIs. To secure the Health check endpoint, you should first use features such as [IP restrictions](app-service-ip-restrictions.md#set-an-ip-address-based-rule), [client certificates](app-service-ip-restrictions.md#set-an-ip-address-based-rule), or a Virtual Network to restrict access to the application. You can secure the Health check endpoint itself by requiring that the `User-Agent` of the incoming request matches `ReadyForRequest/1.0`. The User-Agent cannot be spoofed since the request was already secured by the prior security features.

## Monitoring

After providing your application's health check path, you can monitor the health of your site using Azure Monitor. From the **Health check** blade in the Portal, click the **Metrics** in the top toolbar. This will open a new blade where you can see the site's historical health status and create a new alert rule. For more information on monitoring your sites, [see the guide on Azure Monitor](web-sites-monitor.md).


## Next steps
- [Create an Activity Log Alert to monitor all Autoscale engine operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/monitor-autoscale-alert)
- [Create an Activity Log Alert to monitor all failed Autoscale scale-in/scale-out operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/monitor-autoscale-failed-alert)


[1]: ./media/app-service-monitor-instances-health-check/health-check-success-diagram.png
[2]: ./media/app-service-monitor-instances-health-check/health-check-failure-diagram.png
[3]: ./media/app-service-monitor-instances-health-check/azure-portal-navigation-health-check.png