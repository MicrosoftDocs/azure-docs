---
title: Azure Service Fabric Monitoring Partners | Microsoft Docs
description: Learn how to monitor Azure Service Fabric with partner monitoring solutions
services: service-fabric
documentationcenter: .net
author: srrengar
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 10/19/2018
ms.author: srrengar

---

# Azure Service Fabric Monitoring Partners

This article illustrates how one can monitor their Service Fabric applications, clusters, and infrastructure with a handful of partner solutions. We have worked with each of the partners below to create integrated offerings for Service Fabric. In addition 


## Dynatrace

Our integration with Dynatrace provides many out of the box features to monitor your Service Fabric clusters. Installing the Dynatrace OneAgent on your VMSS instances gives you performance counters and a topology of your Service Fabric deployment down to the App level. Check out more of the features listed in the [annoucement](https://www.dynatrace.com/news/blog/automatic-end-to-end-service-fabric-monitoring-with-dynatrace/) and [instructions](https://www.dynatrace.com/support/help/cloud-platforms/azure/how-do-i-monitor-azure-service-fabric-applications/) to enable Dynatrace on your cluster. 

## DataDog

DataDog has an extension for VMSS for both Windows and Linux instances. Using DataDog you can collect Windows event logs and thereby collect Service Fabric platform events on Windows. Check out the instructions on how to send your diagnostics to DataDog [here](https://www.datadoghq.com/blog/azure-monitoring-enhancements/#integrate-with-azure-service-fabric).

## AppDynamics

The Service Fabric integration with AppDynamics is at the Application level. By updating some environment variables and using the App Dynamics nuget, you send your application telemetry to AppDynamics. Refer to these [instructions](https://docs.appdynamics.com/display/AZURE/Install+AppDynamics+for+Azure+Service+Fabric) for how to integrate your .NET Service Fabric applications with AppDynamics.

## New Relic

New Relic is another Application Performance Management tool that integrates well with Service Fabric applications. You can install the New Relic nuget package and add specific environment variables in your manifest files to send your application telemetry to New Relic. Check out these [instructions](https://docs.newrelic.com/docs/agents/net-agent/azure-installation/install-net-agent-azure-service-fabric) to enable New Relic telemetry for your .NET Service Fabric applications.

<!-- Need sections for Prometheus and ELK -->



## Next steps


