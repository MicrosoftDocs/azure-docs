---
title: Get started with autoscale in Azure
description: "Learn how to scale your resource Web App, Cloud Service, Virtual Machine or Virtual Machine Scale set in Azure."
ms.topic: conceptual
ms.date: 07/07/2017
ms.subservice: autoscale
---
# Get started with Autoscale in Azure
This article describes how to set up your Autoscale settings for your resource in the Microsoft Azure portal.

Azure Monitor autoscale applies only to [Virtual Machine Scale Sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/), [Cloud Services](https://azure.microsoft.com/services/cloud-services/), [App Service - Web Apps](https://azure.microsoft.com/services/app-service/web/), and [API Management services](../../api-management/api-management-key-concepts.md).

## Discover the Autoscale settings in your subscription

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4u7ts]

You can discover all the resources for which Autoscale is applicable in Azure Monitor. Use the following steps for a step-by-step walkthrough:

1. Open the [Azure portal.][1]
1. Click the Azure Monitor icon in the left pane.
  ![Open Azure Monitor][2]
1. Click **Autoscale** to view all the resources for which Autoscale is applicable, along with their current Autoscale status.
  ![Discover Autoscale in Azure Monitor][3]

You can use the filter pane at the top to scope down the list to select resources in a specific resource group, specific resource types, or a specific resource.

For each resource, you will find the current instance count and the Autoscale status. The Autoscale status can be:

- **Not configured**: You have not enabled Autoscale yet for this resource.
- **Enabled**: You have enabled Autoscale for this resource.
- **Disabled**: You have disabled Autoscale for this resource.

## Create your first Autoscale setting

Let's now go through a simple step-by-step walkthrough to create your first Autoscale setting.

1. Open the **Autoscale** blade in Azure Monitor and select a resource that you want to scale. (The following steps use an App Service plan associated with a web app. You can [create your first ASP.NET web app in Azure in 5 minutes.][4])
1. Note that the current instance count is 1. Click **Enable autoscale**.
  ![Scale setting for new web app][5]
1. Provide a name for the scale setting, and then click **Add a rule**. Notice the scale rule options that open as a context pane on the right side. By default, this sets the option to scale your instance count by 1 if the CPU percentage of the resource exceeds 70 percent. Leave it at its default values and click **Add**.
  ![Create scale setting for a web app][6]
1. You've now created your first scale rule. Note that the UX recommends best practices and states that "It is recommended to have at least one scale in rule." To do so:

    a. Click **Add a rule**.

    b. Set **Operator** to **Less than**.

    c. Set **Threshold** to **20**.

    d. Set **Operation** to **Decrease count by**.

   You should now have a scale setting that scales out/scales in based on CPU usage.
   ![Scale based on CPU][8]
1. Click **Save**.

Congratulations! You've now successfully created your first scale setting to autoscale your web app based on CPU usage.

> [!NOTE]
> The same steps are applicable to get started with a virtual machine scale set or cloud service role.

## Other considerations
### Scale based on a schedule
In addition to scale based on CPU, you can set your scale differently for specific days of the week.

1. Click **Add a scale condition**.
1. Setting the scale mode and the rules is the same as the default condition.
1. Select **Repeat specific days** for the schedule.
1. Select the days and the start/end time for when the scale condition should be applied.

![Scale condition based on schedule][9]
### Scale differently on specific dates
In addition to scale based on CPU, you can set your scale differently for specific dates.

1. Click **Add a scale condition**.
1. Setting the scale mode and the rules is the same as the default condition.
1. Select **Specify start/end dates** for the schedule.
1. Select the start/end dates and the start/end time for when the scale condition should be applied.

![Scale condition based on dates][10]

### View the scale history of your resource
Whenever your resource is scaled up or down, an event is logged in the activity log. You can view the scale history of your resource for the past 24 hours by switching to the **Run history** tab.

![Run history][11]

If you want to view the complete scale history (for up to 90 days), select **Click here to see more details**. The activity log opens, with Autoscale pre-selected for your resource and category.

### View the scale definition of your resource
Autoscale is an Azure Resource Manager resource. You can view the scale definition in JSON by switching to the **JSON** tab.

![Scale definition][12]

You can make changes in JSON directly, if required. These changes will be reflected after you save them.

### Disable Autoscale and manually scale your instances
There might be times when you want to disable your current scale setting and manually scale your resource.

Click the **Disable autoscale** button at the top.
![Disable Autoscale][13]

> [!NOTE]
> This option disables your configuration. However, you can get back to it after you enable Autoscale again.

You can now set the number of instances that you want to scale to manually.

![Set manual scale][14]

You can always return to Autoscale by clicking **Enable autoscale** and then **Save**.

## Route traffic to healthy instances (App Service)

When you are scaled out to multiple instances, App Service can perform health checks on your instances to route traffic only to the healthy instances. To do so, open the Portal to your App Service, then select **Health check** under **Monitoring**. Select **Enable** and provide a valid URL path on your application, such as `/health` or `/api/health`. Click **Save**.

To enable the feature with ARM templates, set the `healthcheckpath` property of the `Microsoft.Web/sites` resource to the health check path on your site, for example: `"/api/health/"`. To disable the feature, set the property back to the empty string, `""`.

### Health check path

The path must respond within one minute with a status code between 200 and 299 (inclusive). If the path does not respond within one minute, or returns a status code outside the range, then the instance is considered "unhealthy". App Service does not follow 302 redirects on the health check path. Health Check integrates with App Service's authentication and authorization features, the system will reach the endpoint even if these secuity features are enabled. If you are using your own authentication system, the health check path must allow anonymous access. If the site has HTTP**S**-Only  enabled, the healthcheck request will be sent via HTTP**S**.

The health check path should check the critical components of your application. For example, if your application depends on a database and a messaging system, the health check endpoint should connect to those components. If the application cannot connect to a critical component, then the path should return a 500-level response code to indicate that the app is unhealthy.

#### Security 

Development teams at large enterprises often need to adhere to security requirements for their exposed APIs. To secure the healthcheck endpoint, you should first use features such as [IP restrictions](../../app-service/app-service-ip-restrictions.md#adding-ip-address-rules), [client certificates](../../app-service/app-service-ip-restrictions.md#adding-ip-address-rules), or a Virtual Network to restrict access to the application. You can secure the healthcheck endpoint itself by requiring that the `User-Agent` of the incoming request matches `ReadyForRequest/1.0`. The User-Agent cannot be spoofed since the request was already secured by the prior security features.

### Behavior

When the health check path is provided, App Service will ping the path on all instances. If a successful response code is not received after 5 pings, that instance is considered "unhealthy". Unhealthy instance(s) will be excluded from the load balancer rotation. You can configure the required number of failed pings with the `WEBSITE_HEALTHCHECK_MAXPINGFAILURES` app setting. This app setting can be set to any integer between 2 and 10. For example, if this is set to `2`, your instances will be removed from the load balancer after two failed pings. Furthermore, when you are scaling up or out, App Service will ping the health check path to ensure that the new instances are ready for requests before being added to the load balancer.

The remaining healthy instances may experience increased load. To avoid overwhelming the remaining instances, no more than half of your instances will be excluded. For example, if an App Service Plan is scaled out to 4 instances and 3 of which are unhealthy, at most 2 will be excluded from the loadbalancer rotation. The other 2 instances (1 healthy and 1 unhealthy) will continue to receive requests. In the worst-case scenario where all instances are unhealthy, none will be excluded.If you would like to override this behavior, you can set the `WEBSITE_HEALTHCHECK_MAXUNHEALTYWORKERPERCENT` app setting to a value between `0` and `100`. Setting this to a higher value means more unhealthy instances will be removed (the default value is 50).

If an instance remains unhealthy for one hour, it will be replaced with new instance. At most one instance will be replaced per hour, with a maximum of three instances per day per App Service Plan.

### Monitoring

After providing your application's health check path, you can monitor the health of your site using Azure Monitor. From the **Health check** blade in the Portal, click the **Metrics** in the top toolbar. This will open a new blade where you can see the site's historical health status and create a new alert rule. For more information on monitoring your sites, [see the guide on Azure Monitor](../../app-service/web-sites-monitor.md).

## Next steps
- [Create an Activity Log Alert to monitor all Autoscale engine operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/monitor-autoscale-alert)
- [Create an Activity Log Alert to monitor all failed Autoscale scale-in/scale-out operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/monitor-autoscale-failed-alert)

<!--Reference-->
[1]:https://portal.azure.com
[2]: ./media/autoscale-get-started/azure-monitor-launch.png
[3]: ./media/autoscale-get-started/discover-autoscale-azure-monitor.png
[4]: ../../app-service/quickstart-dotnetcore.md
[5]: ./media/autoscale-get-started/scale-setting-new-web-app.png
[6]: ./media/autoscale-get-started/create-scale-setting-web-app.png
[7]: ./media/autoscale-get-started/scale-in-recommendation.png
[8]: ./media/autoscale-get-started/scale-based-on-cpu.png
[9]: ./media/autoscale-get-started/scale-condition-schedule.png
[10]: ./media/autoscale-get-started/scale-condition-dates.png
[11]: ./media/autoscale-get-started/scale-history.png
[12]: ./media/autoscale-get-started/scale-definition-json.png
[13]: ./media/autoscale-get-started/disable-autoscale.png
[14]: ./media/autoscale-get-started/set-manualscale.png
