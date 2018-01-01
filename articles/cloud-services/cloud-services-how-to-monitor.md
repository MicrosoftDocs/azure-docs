---
title: Monitor a Cloud Service | Microsoft Docs
description: Learn how to monitor cloud services by using the Azure classic portal.
services: cloud-services
documentationcenter: ''
author: thraka
manager: timlt
editor: ''

ms.assetid: 
ms.service: cloud-services
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/22/2017
ms.author: adegeo
---

# Introduction to Cloud Service Monitoring

You can monitor key performance metrics for any cloud service. Every cloud service role will collect minimal data: CPU usage, network usage, and disk utilization. If the cloud service has the `Microsoft.Azure.Diagnostics` extension applied to a role, that role can collect additional points of data. This article provides an introduction to Azure Diagnostics for Cloud Services.

## Basic monitoring

As stated in the introduction, a cloud service will automatically monitor basic resources from the host virtual machine. This includes CPU percentage, network in/out, and disk read/write. The collected monitoring data is automatically displayed in the Azure Portal on the overview and metrics pages of the cloud service. 

Basic monitoring does not require a storage account. 

![basic cloud service monitoring tiles](media/cloud-services-how-to-monitor/basic-tiles.png)

## Advanced monitoring

Advanced monitoring involves using the Azure Diagonstics extension (and optionally the Application Insights SDK) on the role you want to monitor. The diagnostics extension uses a config file (per role) named **diagnostics.wadcfgx** to configure the diagnostics metrics monitored. The data the Azure Diagonstic extension collects is stored in an Azure Storage account, which is configured in the **.wadcfgx** and **ServiceConfig**. See [Setup diagonstics for your Cloud Service]() for more information. This means that there is an extra cost associated with advanced monitoring.

As each role is created, Visual Studio adds the Azure Diagnostics extension to it. This extension can collect the following types of information:

* Custom performance counters
* Application logs
* Windows event logs
* .NET event source
* IIS logs
* Manifest based ETW
* Crash dumps
* Customer error logs

### Use Application Insights

While all this data is aggregated into the storage account, the portal does not provide a native way to chart the data. You can use another service, like Application Insights, to correlate and display the data.

When you publish the Cloud Service from Visual Studio, you are given the option to send the diagnostic data to Application Insights. You can create the Application Insights resource at that time or send the data to an existing resource. Your cloud service can be monitored by Application Insights for availability, performance, failures, and usage. Custom charts can be added to Application Insights so that you can see the data that matters the most to you. Role instance data can be collected by using the Application Insights SDK in your cloud service project. For more information on how to integrate Applciation Insights, see [Application Insights with Cloud Services](../application-insights/app-insights-cloudservices.md).

Please note that while you can use Application Insights to display the performance counters (and the other settings) you have specified through the Windows Azure Diagnostics extension, you will only get a richer experience by integrating the Application Insights SDK into your worker/web roles.

## How does it all work?

With basic monitoring, performance counter data from role instances is sampled and collected at 3-minute intervals. This basic monitoring data is not stored in your storage account and has no additional cost associated with it.

With advanced monitoring, additional metrics are sampled and collected at intervals of 5-minutes, 1-hour, and 12-hours. The aggregated data is stored in a storage account, in tables, and is purged after 10-days. The storage account used is configured by each role, and you can use different storage accounts for different roles. This is configured with a connection string in the [.csdef]() file.

## How to: Add adv. monitoring

First, if you don't have a **classic** storage account, [create one](../storage/common/storage-create-storage-account.md#create-a-storage-account). Make sure the storage account is created with the **Classic deployment model** specified.

Next, navigate to the **Storage account (classic)** resource. Select **Settings** > **Access keys** and copy the **Primary connection string** value. You will need this value for the cloud service. 

There are two config files you must change for advanced diagnostics to be enable, **ServiceDefinition.csdef** and **ServiceConfiguration.cscfg**. Most likely you have two **.cscfg** files, one named **ServiceConfiguration.cloud.cscfg** for deploying to Azure, and one named **ServiceConfiguration.local.cscfg** which is used for local debug deployments. Change both of them.

In the **ServiceDefinition.csdef** file, add a new setting named `Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString` for each role that will use advanced diagnostics. Visual Studio adds this value to the file when you create a new project. In case it is missing, you can add it now. 

```xml
<ServiceDefinition name="AnsurCloudService" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition" schemaVersion="2015-04.2.6">
  <WorkerRole name="WorkerRoleWithSBQueue1" vmsize="Small">
    <ConfigurationSettings>
      <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
```

This defines a new setting that must be added to every **ServiceConfiguration.cscfg** file. Open and change each **.cscfg** file. Add a setting named `Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString` and set the value to either the **Primary connection string** of the classic storage account, or `UseDevelopmentStorage=true` to use the local storage on your development machine for debugging purposes.

```xml
<ServiceConfiguration serviceName="AnsurCloudService" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceConfiguration" osFamily="4" osVersion="*" schemaVersion="2015-04.2.6">
  <Role name="WorkerRoleWithSBQueue1">
    <Instances count="1" />
    <ConfigurationSettings>
      <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="DefaultEndpointsProtocol=https;AccountName=mystorage;AccountKey=KWwkdfmsWOIS240jnBOeeXVGHT9QgKS4kIQ3wWVKzOYkfjdsjfkjdsaf+sddfwwfw+sdffsdafda/w==" />

<!-- or use the local development machine for storage
      <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="UseDevelopmentStorage=true" />
-->
```











