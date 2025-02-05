---
title: Monitor the health of App Service instances
description: Learn how to monitor the health of App Service instances using Health check.
keywords: azure app service, web app, health check, route traffic, healthy instances, path, monitoring, remove faulty instances, unhealthy instances, remove workers
author: msangapu-msft

ms.topic: overview
ms.date: 09/13/2024
ms.author: msangapu
---

# Monitor App Service instances by using Health check

[!INCLUDE [regionalization-note](./includes/regionalization-note.md)]

This article describes how to use Health check in the Azure portal to monitor App Service instances. Health check increases your application's availability by rerouting requests away from unhealthy instances and replacing instances if they remain unhealthy. It does that by pinging your web application every minute, via a path that you choose.

![Diagram that shows how Health check works.][1]

Note that _/api/health_ is just an example. There is no default Health check path. You should make sure that the path you choose is a valid path that exists within your application.

## How Health check works

- When given a path on your app, Health check pings the path on all instances of your App Service app at 1-minute intervals.
- If a web app that's running on a given instance doesn't respond with a status code between 200 and 299 (inclusive) after 10 requests, App Service determines the instance is unhealthy and removes it from the load balancer for the web app. The required number of failed requests for an instance to be deemed unhealthy is configurable to a minimum of two requests.
- After the instance is removed, Health check continues to ping it. If the instance begins to respond with a healthy status code (200-299), then the instance is returned to the load balancer.
- If the web app that's running on an instance remains unhealthy for one hour, the instance is replaced with a new one.
- When scaling out, App Service pings the Health check path to ensure new instances are ready.

> [!NOTE]
>- Health check doesn't follow 302 redirects. 
>- At most, one instance will be replaced per hour, with a maximum of three instances per day per App Service Plan.
>- If Health check is sending the status `Waiting for health check response`, then the check is likely failing due to an HTTP status code of 307, which can happen if you have HTTPS redirect enabled but have `HTTPS Only` disabled.

## Enable Health check

:::image type="content" source="./media/app-service-monitor-instances-health-check/azure-portal-navigation-health-check.png" alt-text="Screenshot that shows how to enable Health check in the Azure portal." lightbox="./media/app-service-monitor-instances-health-check/azure-portal-navigation-health-check.png":::

1. To enable Health check, browse to the Azure portal and select your App Service app.
1. Under **Monitoring**, select **Health check**.
1. Select **Enable** and provide a valid URL path for your application, such as `/health` or `/api/health`.
1. Select **Save**.

> [!NOTE]
> - Your [App Service plan](./overview-hosting-plans.md) should be scaled to two or more instances to fully utilize Health check. 
> - The Health check path should check critical components of your application. For example, if your application depends on a database and a messaging system, the Health check endpoint should connect to those components. If the application can't connect to a critical component, then the path should return a 500-level response code to indicate the app is unhealthy. Also, if the path doesn't return a response within one minute, the health check ping is considered unhealthy.
> - When selecting the Health check path, make sure you're selecting a path that returns a 200 status code only when the app is fully warmed up.
> - In order to use Health check on a function app, you must use a [premium or dedicated hosting plan](../azure-functions/functions-scale.md#overview-of-plans).
> - Details about Health check on function apps can be found here: [Monitor function apps using Health check](../azure-functions/configure-monitoring.md?#monitor-function-apps-using-health-check).

> [!CAUTION]
> Health check configuration changes restart your app. To minimize impact to production apps, we recommend [configuring staging slots](deploy-staging-slots.md) and swapping to production.
>

### Configuration

In addition to configuring the Health check options, you can also configure the following [app settings](configure-common.md):

| App setting name | Allowed values | Description |
|-|-|-|
|`WEBSITE_HEALTHCHECK_MAXPINGFAILURES` | 2 - 10 | The required number of failed requests for an instance to be deemed unhealthy and removed from the load balancer. For example, when this is set to `2`, your instances are removed after 2 failed pings. (The default value is `10`.) |
|`WEBSITE_HEALTHCHECK_MAXUNHEALTHYWORKERPERCENT` | 1 - 100 | By default, to avoid overwhelming the remaining healthy instances, no more than half of the instances will be excluded from the load balancer at a time. For example, if an App Service plan is scaled to four instances and three are unhealthy, two are excluded. The other two instances (one healthy and one unhealthy) continue to receive requests. In a scenario where all instances are unhealthy, none are excluded. <br /> To override this behavior, set this app setting to a value between `1` and `100`. A higher value means more unhealthy instances are removed. (The default value is `50`.). |

#### Authentication and security

Health check integrates with the App Service [authentication and authorization features](overview-authentication-authorization.md). No other settings are required if these security features are enabled.

If you're using your own authentication system, the Health check path must allow anonymous access. To provide security for the Health check endpoint, you should first use features such as [IP restrictions](app-service-ip-restrictions.md#set-an-ip-address-based-rule), [client certificates](tutorial-secure-domain-certificate.md), or a virtual network to restrict application access. Once you have those features in place, you can authenticate the Health check request by inspecting the header `x-ms-auth-internal-token` and validating that it matches the SHA256 hash of the environment variable `WEBSITE_AUTH_ENCRYPTION_KEY`. If they match, then the Health check request is valid and originating from App Service. 

> [!NOTE]
> For [Azure Functions authentication](/azure/azure-functions/security-concepts?tabs=v4#function-access-keys), the function that serves as the Health check endpoint needs to allow anonymous access. 

##### [.NET](#tab/dotnet)

```C#
using System;
using System.Text;

/// <summary>
/// Method <c>HeaderMatchesEnvVar</c> returns true if <c>headerValue</c> matches WEBSITE_AUTH_ENCRYPTION_KEY.
/// </summary>
public Boolean HeaderMatchesEnvVar(string headerValue) {
    var sha = System.Security.Cryptography.SHA256.Create();
    String envVar = Environment.GetEnvironmentVariable("WEBSITE_AUTH_ENCRYPTION_KEY");
    String hash = System.Convert.ToBase64String(sha.ComputeHash(Encoding.UTF8.GetBytes(envVar)));
    return hash == headerValue;
}
```

##### [Python](#tab/python)

```python
from hashlib import sha256
import base64
import os

def header_matches_env_var(header_value):
    """
    Returns true if SHA256 of header_value matches WEBSITE_AUTH_ENCRYPTION_KEY.
    
    :param header_value: Value of the x-ms-auth-internal-token header.
    """
    
    env_var = os.getenv('WEBSITE_AUTH_ENCRYPTION_KEY')
    hash = base64.b64encode(sha256(env_var.encode('utf-8')).digest()).decode('utf-8')
    return hash == header_value
```

##### [Java](#tab/java)

```java
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.nio.charset.StandardCharsets;

public static Boolean headerMatchesEnvVar(String headerValue) throws NoSuchAlgorithmException {
    MessageDigest digest = MessageDigest.getInstance("SHA-256");
    String envVar = System.getenv("WEBSITE_AUTH_ENCRYPTION_KEY");
    String hash = new String(Base64.getDecoder().decode(digest.digest(envVar.getBytes(StandardCharsets.UTF_8))));
    return hash.equals(headerValue);
}
```

##### [Node.js](#tab/node)

```javascript
var crypto = require('crypto');

function envVarMatchesHeader(headerValue) {
    let envVar = process.env.WEBSITE_AUTH_ENCRYPTION_KEY;
    let hash = crypto.createHash('sha256').update(envVar).digest('base64');
    return hash == headerValue;
}
```

---

> [!NOTE]
> The `x-ms-auth-internal-token` header is only available on App Service for Windows.

## Instances

Once Health check is enabled, you can restart and monitor the status of your application instances from the instances tab. The instances tab shows your instance's name and the status of that application's instance. You can also manually restart the instance from this tab.

If the status of your application instance is "unhealthy," you can restart the instance manually by using the restart button in the table. Keep in mind that any other applications hosted on the same App Service plan as the instance will also be affected by the restart. If there are other applications using the same App Service plan as the instance, they're listed on the opening blade from the restart button.

If you restart the instance and the restart process fails, you'll be given the option to replace the worker. (Only one instance can be replaced per hour.)  This will also affect any applications using the same App Service plan.

For Windows applications, you can also view processes via the Process Explorer. This gives you further insight on the instance's processes, including thread count, private memory, and total CPU time.

## Diagnostic information collection

For Windows applications, you have the option to collect diagnostic information on the Health Check tab. Enabling diagnostic collection adds an auto-heal rule that creates memory dumps for unhealthy instances and saves them to a designated storage account. Enabling this option changes auto-heal configurations. If there are existing auto-heal rules, we recommend setting this up through App Service diagnostics. 

Once diagnostic collection is enabled, you can create a storage account or choose an existing one for your files. You can only select storage accounts in the same region as your application. Keep in mind that saving restarts your application. After saving, if your site instances are found to be unhealthy after continuous pings, you can go to your storage account resource and view the memory dumps.

## Monitoring

After providing your application's Health check path, you can monitor the health of your site using Azure Monitor. From the **Health check** blade in the portal, select **Metrics** in the top toolbar. This opens a new blade where you can see the site's health check status history and create a new alert rule. Health check status metric aggregate the successful pings and display failures only when the instance was deemed unhealthy based on the Health Check Load balancing threshold value configured. By default this value is set to 10 minutes, so it takes 10 consecutive pings (1 per minute) for a given instance to be deemed unhealthy and only then will it be reflected on the metric. For more information on monitoring your sites, see [Azure App Service quotas and alerts](web-sites-monitor.md).

## Limitations

- Health check can be enabled for **Free** and **Shared** App Service plans, so you can have metrics on the site's health and set up alerts. However, because **Free** and **Shared** sites can't scale out, unhealthy instances won't be replaced. You should scale up to the **Basic** tier or higher so you can scale out to two or more instances and get the full benefit of Health check. This is recommended for production-facing applications as it increases your app's availability and performance.
- An App Service plan can have a maximum of one unhealthy instance replaced per hour and, at most, three instances per day.
- There's a nonconfigurable limit on the total number of instances replaced by Health check per scale unit. If this limit is reached, no unhealthy instances are replaced. This value gets reset every 12 hours.

## Frequently asked questions

### What happens if my app is running on a single instance?

If your app is only scaled to one instance and becomes unhealthy, it won't be removed from the load balancer because that would take down your application entirely. However, after one hour of continuous unhealthy pings, the instance is replaced. Scale out to two or more instances to get the rerouting benefit of Health check. If your app is running on a single instance, you can still use the Health check [monitoring](#monitoring) feature to keep track of your application's health.
 
### Why are the Health check requests not showing in my web server logs?

The Health check requests are sent to your site internally, so the request won't show in [the web server logs](troubleshoot-diagnostic-logs.md#enable-web-server-logging). You can add log statements in your Health check code to keep logs of when your Health check path is pinged.

### Are Health check requests sent over HTTP or HTTPS?

On App Service for Windows and Linux, the Health check requests are sent via HTTPS when [HTTPS Only](configure-ssl-bindings.md#enforce-https) is enabled on the site. Otherwise, they're sent over HTTP.

### Does Health check follow the application-code configured redirects between the default domain and the custom domain?

No, the Health check feature pings the path of the default domain of the web application. If there's a redirect from the default domain to a custom domain, then the status code that Health check returns won't be a 200. It will be a redirect (301), which marks the worker unhealthy.

### What if I have multiple apps on the same App Service plan?

Unhealthy instances will always be removed from the load balancer rotation regardless of other apps on the App Service plan (up to the percentage specified in [`WEBSITE_HEALTHCHECK_MAXUNHEALTHYWORKERPERCENT`](#configuration)). When an app on an instance remains unhealthy for more than one hour, the instance will only be replaced if all other apps on which Health check is enabled are also unhealthy. Apps that don't have Health check enabled won't be taken into account. 

#### Example 

Imagine you have two applications (or one app with a slot) with Health check enabled. They're called App A and App B. They're on the same App Service plan, and the plan is scaled out to four instances. If App A becomes unhealthy on two instances, the load balancer stops sending requests to App A on those two instances. Requests are still routed to App B on those instances, assuming App B is healthy. If App A remains unhealthy for more than an hour on those two instances, the instances are only replaced if App B is **also** unhealthy on those instances. If App B is healthy, the instances aren't replaced.

![Diagram of the example scenario.][2]

> [!NOTE]
> If there were another site or slot on the plan (App C) without Health check enabled, it wouldn't be taken into consideration for the instance replacement.

### What if all my instances are unhealthy?

If all instances of your application are unhealthy, App Service won't remove instances from the load balancer. In this scenario, taking all unhealthy app instances out of the load balancer rotation would effectively cause an outage for your application. However, the instance replacement will still occur.

### Does Health check work on App Service Environments?

Yes, health check is available for App Service Environment v3, but not for versions 1 or 2. If you're using the older versions of App Service Environment, you can use the [migration feature](environment/migrate.md) to migrate your App Service Environment to version 3.

## Next steps

- [Create an Activity Log Alert to monitor all Autoscale engine operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/monitor-autoscale-alert)
- [Create an Activity Log Alert to monitor all failed Autoscale scale-in/scale-out operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/monitor-autoscale-failed-alert)
- [Environment variables and app settings reference](reference-app-settings.md)

[1]: ./media/app-service-monitor-instances-health-check/health-check-diagram.png
[2]: ./media/app-service-monitor-instances-health-check/health-check-multi-app-diagram.png
 
