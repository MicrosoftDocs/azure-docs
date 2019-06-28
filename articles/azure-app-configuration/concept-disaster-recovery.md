---
title: Azure App Configuration resiliency and disaster recovery | Microsoft Docs
description: An overview of how to implement resiliency and disaster recovery with Azure App Configuration.
services: azure-app-configuration
documentationcenter: ''
author: yegu-ms
manager: maiye
editor: ''

ms.service: azure-app-configuration
ms.devlang: na
ms.topic: overview
ms.workload: tbd
ms.date: 05/29/2019
ms.author: yegu
---

# Resiliency and disaster recovery

Currently Azure App Configuration is a regional service. Each configuration store is created in a particular Azure region. A region-wide outage will impact all stores in that region. App Configuration doesn't offer automatic fail-over to another region. This article provides general guidance on how you can use multiple configuration stores across Azure regions to increase the geo-resiliency of your application.

## High availability architecture

To realize cross-region redundancy, you need to create multiple app configuration stores in different regions. With this setup, your application will have at least one additional configuration store to fall back onto with the primary store becomes inaccessible. Below is a diagram that illustrates the topology between your application and its primary and secondary configuration stores.

![Geo-redundant stores](./media/geo-redundant-app-configuration-stores.png)

Your application will load its configuration from both the primary and secondary stores in parallel. Doing this increases the chance of successfully getting the configuration data significantly. You're responsible for keeping the data in both stores in sync. The following sections explain how you can build geo-resiliency into your application.

## Failover between configuration stores

Technically your application isn't executing a failover. It's attempting to retrieve the same set of configuration data from two app configuration stores simultaneously. You should arrange your code such that it loads first from the secondary store first and then the primary store. This approach will ensure that the configuration data in the primary store take precedence whenever they are available. The code snippet below shows how you can implement this in .NET Core.

```csharp
public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
    WebHost.CreateDefaultBuilder(args)
        .ConfigureAppConfiguration((hostingContext, config) =>
        {
            var settings = config.Build();
            config.AddAzureAppConfiguration(settings["ConnectionString_SecondaryStore"], optional: true)
                  .AddAzureAppConfiguration(settings["ConnectionString_PrimaryStore"], optional: true);
        })
        .UseStartup<Startup>();
    }
```

Notice the `optional` parameter passed into the `AddAzureAppConfiguration` function. When set to `true`, this parameter will prevent the application from failing to continue if the function can't load configuration data.

## Synchronization between configuration stores

It's important that your geo-redundant configuration stores all have the same set of data. You can use the **Export** function in App Configuration to copy data from the primary store to the secondary on-demand. This function is available through both the Azure portal and CLI.

From the Azure portal, you can push a change to another configuration store by following these steps:

1. Navigate to **Import/Export** tab, select **Export**, select **App Configuration** as the **Target** service, click **Select a resource**.

2. In the new blade that has opened up, specify the subscription, resource group, and resource name of your secondary store and then click **Apply**.

3. The UI will be updated so that you can choose what configuration data you want to export to your secondary store. You can leave the default time value as is and set both **From label** and to **Label** to the same value. Click **Apply**.

4. Repeat the above steps for all configuration changes.

You can automate this exporting process using the Azure CLI. The command below shows how to export a single configuration change from the primary store to the secondary.

    az appconfig kv export --destination appconfig --name {PrimaryStore} --label {Label} --dest-name {SecondaryStore} --dest-label {Label}

## Next steps

In this article, you learned how to augment your application to achieve geo-resiliency during runtime for App Configuration. Alternatively, you can embed configuration data from App Configuration at build or deployment time. For more information, see [Integrate with a CI/CD pipeline](./integrate-ci-cd-pipeline.md).

