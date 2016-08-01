<properties
	pageTitle="Monitor Apps in Azure App Service"
	description="Learn how to monitor Apps in Azure App Service by using the Azure Portal."
	services="app-service"
	documentationCenter=""
	authors="btardif"
	manager="wpickett"
	editor="mollybos"/>

<tags
	ms.service="app-service"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/31/2016"
	ms.author="byvinyal"/>

# How to: Monitor Apps in Azure App Service

[App Service](http://go.microsoft.com/fwlink/?LinkId=529714) provides 
built in monitoring functionality in the [Azure Portal](https://portal.azure.com). 
This includes the ability to review **quotas** and **metrics** for an app as 
well as the App Service plan, setting up **alerts** and even **scaling** 
automatically based on these metrics.

[AZURE.INCLUDE [app-service-web-to-api-and-mobile](../../includes/app-service-web-to-api-and-mobile.md)]

## Understanding Quotas and Metrics

### Quotas

Applications hosted in App Service are subject to certain *limits* on the 
resources they can use. The limits are defined by the **App Service plan** 
associated with the app. 

If the application is hosted in a **Free** or **Shared** plan, then the limits 
on the resources the app can use are defined by **Quotas**.

If the application is hosted in a **Basic**, **Standard** or **Premium** plan, 
then the limits on the resources they can use are set by the **size** (Small, 
Medium, Large) and **instance count** (1, 2, 3, ...) of the **App Service plan**.

**Quotas** for **Free** or **Shared** apps are:

* **CPU(Short)**
   * Amount of CPU allowed for this application in a 3-minute interval. This 
   quota re-sets every 3 minutes.
* **CPU(Day)**
   * Total amount of CPU allowed for this application in a day. This quota 
   re-sets every 24 hours at midnight UTC.
* **Memory**
   * Total amount of memory allowed for this application.
* **Bandwidth**
   * Total amount of outgoing bandwidth allowed for this application in a day. 
   This quota re-sets every 24 hours at midnight UTC.
* **Filesystem**
   * Total amount of storage allowed.
   
The only quota applicable to apps hosted on **Basic**, **Standard** and 
**Premium** plans is **Filesystem**.

More information about the specific quotas, limits and features available to 
the different App Service SKUs can be found here: 
[Azure Subscription Service Limits](../azure-subscription-service-limits.md/#app-service-limits)

#### Quota Enforcement

If an application in its usage exceeds the **CPU (short)**, **CPU (Day)**, or 
**bandwidth** quota then the application will be stopped until the quota 
re-sets. During this time, all incoming requests will result in an **HTTP 403**.
![][http403]

If the application **memory** quota is exceeded, then the application will be 
re-started.

If the **Filesystem** quota is exceeded, then any write operation will fail, this 
includes writing to logs.

Quotas can be increased or removed from your app by upgrading your App Service plan.

### Metrics

**Metrics** provide information about the app, or App Service plan's behavior.

For an **Application**, the available metrics are:

* **Average Response Time**
   * The average time taken for the app to serve requests in ms.
* **Average memory working set**
   * The average amount of memory in MiBs used by the app.
* **CPU Time**
   * The amount of CPU in seconds consumed by the app. For more information 
   about this metric see: [CPU time vs CPU percentage](#cpu-time-vs-cpu-percentage)
* **Data In**
   * The amount of incoming bandwidth consumed by the app in MiBs.
* **Data Out**
   * The amount of outgoing bandwidth consumed by the app in MiBs.
* **Http 2xx**
   * Count of requests resulting in a http status code >= 200 but < 300. 
* **Http 3xx**
   * Count of requests resulting in a http status code >= 300 but < 400.
* **Http 401**
   * Count of requests resulting in HTTP 401 status code.
* **Http 403**
   * Count of requests resulting in HTTP 403 status code.
* **Http 404**
   * Count of requests resulting in HTTP 404 status code.
* **Http 406**
   * Count of requests resulting in HTTP 406 status code.
* **Http 4xx**
   * Count of requests resulting in a http status code >= 400 but < 500.
* **Http Server Errors**
   * Count of requests resulting in a http status code >= 500 but < 600.
* **Memory working set**
   * Current amount of memory used by the app in MiBs.
* **Requests**
   * Total number of requests regardless of their resulting HTTP status code. 

For an **App Service plan**, the available metrics are:

>[AZURE.NOTE] App Service plan metrics are only available for plans in **Basic**, **Standard** and **Premium** SKU.

* **CPU Percentage**
   * The average CPU used across all instances of the plan.
* **Memory Percentage**
   * The average memory used across all instances of the plan.
* **Data In**
   * The average incoming bandwidth used across all instances of the plan.
* **Data Out**
   * The average outgoing bandwidth used across all instances of the plan.
* **Disk Queue Length**
   * The average number of both read and write requests that were queued 
   on storage. A high disk queue length is an indication of an application 
   that might be slowing down due to excessive disk I/O.
* **Http Queue Length**
   * The average number of HTTP requests that had to sit on the queue before 
   being fulfilled. A high or increasing HTTP Queue length is a symptom of 
   a plan under heavy load.

### CPU time vs CPU percentage
<!-- To do: Fix Anchor (#CPU-time-vs.-CPU-percentage) -->

There are 2 metrics that reflect CPU usage. **CPU time** and **CPU percentage**

**CPU Time** is useful for apps hosted in **Free** or **Shared** plans since 
one of their quotas is defined in CPU minutes used by the app.

**CPU percentage** on the other hand is useful for apps hosted in 
**basic**, **standard** and **premium** plans since they can be 
scaled out and this metric is a good indication of the overall usage across 
all instances. 

##Metrics Granularity and Retention Policy

Metrics for an application and app service plan are logged and aggregated by 
the service with the following granularities and retention policies:

 * **Minute** granularity metrics are retained for **24 hours**
 * **Hour** granularity metrics are retained for **7 days**
 * **Day** granularity metrics are retained for **30 days**

## Monitoring Quotas and Metrics in the Azure Portal.

You can review the status of the different **quotas** and **metrics** 
affecting an application in the [Azure Portal](https://portal.azure.com). 

![][quotas]
**Quotas** can be found under Settings>**Quotas**. The UX allows you to 
review: (1) the quotas name, (2) its reset interval, (3) its current limit 
and (4) current value.

![][metrics]
**Metrics** can be access directly from the resource blade. You can also 
customize the chart by: (1) **click** on it, and select (2) **edit chart**. 
From here you can change the (3) **time range**, (4) **chart type**, and 
(5) **metrics** to display.  


## Alerts and Autoscale
Metrics for an App or App Service plan can be hooked up to alerts, to learn 
more about this, see [Receive alert notifications](../azure-portal/insights-receive-alert-notifications.md)

App Service apps hosted in basic, standard or premium App Service Plans 
support **autoscale**. This allows you to configure rules that monitor the 
App Service plan metrics and can increase or decrease the instance count 
providing additional resources as needed, or saving money when the application 
is over-provision. You can learn more about auto scale here: [How to Scale](../azure-portal/insights-how-to-scale.md) and here [Best practices for Azure Insights autoscaling](../azure-portal/insights-autoscale-best-practices.md)

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)

[fzilla]:http://go.microsoft.com/fwlink/?LinkId=247914
[vmsizes]:http://go.microsoft.com/fwlink/?LinkID=309169



<!-- Images. -->
[http403]: ./media/web-sites-monitor/http403.png
[quotas]: ./media/web-sites-monitor/quotas.png
[metrics]: ./media/web-sites-monitor/metrics.png