---
title: Route traffic to healthy instances in Azure App Service
description: Learn how to route traffic to healthy instances on your App Service app.
keywords: azure app service, web app, health check, route traffic, healthy instances, path, monitoring,
author: msangapu-msft

ms.topic: article
ms.date: 12/03/2020
ms.author: msangapu

---
# Route traffic to healthy instances

App Service makes it easy to automatically scale your apps when traffic increases. This increases the throughput, but what if there's an uncaught exception an instance? Health Check finds unhealthy instances and removes them from the load balancer rotation.

This article uses the Azure Portal to work with Health Check. Health Check allows you to specify a path to ping on your App Service web app. If an instance fails to respond to the ping, the system determines it's unhealthy and removes it from the load balancer rotation. This increases the app average availability and resiliency.

**HC SCREENSHOT1**
 If the path responds with an error HTTP status code or does not respond, then the instance is determined to be unhealthy and it is removed from the load balancer rotation. This prevents the load balancer from routing requests to the unhealthy instances.


**HC SCREENSHOT2**
When the instance is unhealthy and removed from the load balancer, the service continues to ping it. If it begins responding with successful response codes then the instance is returned to the load balancer. If it continues to respond unsuccessfully, App Service will restart the underlying VM in an effort to return the instance to a healthy state. Health Check integrates with App Service’s authentication and authorization features, so the system will reach the endpoint even if these security features are enabled. If you are using your own authentication system, the health check path must allow anonymous access.


## Enable Health Check


**SCREENSHOT**

Open the Portal to your App Service, then select **Health check** under **Monitoring**. Select **Enable** and provide a valid URL path on your application, such as `/health` or `/api/health`. Click **Save**.

> [!NOTE]
>To enable the feature with ARM templates, set the `healthcheckpath` property of the `Microsoft.Web/sites` resource to the health check path on your site, for example: `"/api/health/"`. To disable the feature, set the property back to the empty string, `""`.
>

## Health check path

The path must respond within one minute with a status code between 200 and 299 (inclusive). If the path does not respond within one minute, or returns a status code outside the range, then the instance is considered "unhealthy". App Service does not follow 302 redirects on the health check path. Health Check integrates with App Service's authentication and authorization features, the system will reach the endpoint even if these security features are enabled. If you are using your own authentication system, the health check path must allow anonymous access. If the site has HTTP**S**-Only  enabled, the healthcheck request will be sent via HTTP**S**.

The health check path should check the critical components of your application. For example, if your application depends on a database and a messaging system, the health check endpoint should connect to those components. If the application cannot connect to a critical component, then the path should return a 500-level response code to indicate that the app is unhealthy.

### Security

Development teams at large enterprises often need to adhere to security requirements for their exposed APIs. To secure the healthcheck endpoint, you should first use features such as [IP restrictions](../../app-service/app-service-ip-restrictions.md#set-an-ip-address-based-rule), [client certificates](../../app-service/app-service-ip-restrictions.md#set-an-ip-address-based-rule), or a Virtual Network to restrict access to the application. You can secure the healthcheck endpoint itself by requiring that the `User-Agent` of the incoming request matches `ReadyForRequest/1.0`. The User-Agent cannot be spoofed since the request was already secured by the prior security features.

## Behavior

When the health check path is provided, App Service will ping the path on all instances. If a successful response code is not received after 5 pings, that instance is considered "unhealthy". Unhealthy instance(s) will be excluded from the load balancer rotation. You can configure the required number of failed pings with the `WEBSITE_HEALTHCHECK_MAXPINGFAILURES` app setting. This app setting can be set to any integer between 2 and 10. For example, if this is set to `2`, your instances will be removed from the load balancer after two failed pings. Furthermore, when you are scaling up or out, App Service will ping the health check path to ensure that the new instances are ready for requests before being added to the load balancer.

> [!NOTE]
> Remember that your App Service Plan must be scaled out to 2 or more instances for the load balancer exclusion to occur. If you only have 1 instance, it will not be removed from the load balancer even if it is unhealthy.

The remaining healthy instances may experience increased load. To avoid overwhelming the remaining instances, no more than half of your instances will be excluded. For example, if an App Service Plan is scaled out to 4 instances and 3 of which are unhealthy, at most 2 will be excluded from the loadbalancer rotation. The other 2 instances (1 healthy and 1 unhealthy) will continue to receive requests. In the worst-case scenario where all instances are unhealthy, none will be excluded.If you would like to override this behavior, you can set the `WEBSITE_HEALTHCHECK_MAXUNHEALTYWORKERPERCENT` app setting to a value between `0` and `100`. Setting this to a higher value means more unhealthy instances will be removed (the default value is 50).

If an instance remains unhealthy for one hour, it will be replaced with new instance. At most one instance will be replaced per hour, with a maximum of three instances per day per App Service Plan.

## Monitoring

After providing your application's health check path, you can monitor the health of your site using Azure Monitor. From the **Health check** blade in the Portal, click the **Metrics** in the top toolbar. This will open a new blade where you can see the site's historical health status and create a new alert rule. For more information on monitoring your sites, [see the guide on Azure Monitor](../../app-service/web-sites-monitor.md).



## Next steps
- [Create an Activity Log Alert to monitor all Autoscale engine operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/monitor-autoscale-alert)
- [Create an Activity Log Alert to monitor all failed Autoscale scale-in/scale-out operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/monitor-autoscale-failed-alert)
