---
title: Azure Service Fabric Monitoring Partners 
description: Learn how to monitor Azure Service Fabric applications, clusters, and infrastructure with partner monitoring solutions.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Azure Service Fabric Monitoring Partners

This article illustrates how one can monitor their Service Fabric applications, clusters, and infrastructure with a handful of partner solutions. We have worked with each of the partners below to create integrated offerings for Service Fabric.

## Dynatrace

Our integration with Dynatrace provides many out of the box features to monitor your Service Fabric clusters. Installing the Dynatrace OneAgent on your VMSS instances gives you performance counters and a topology of your Service Fabric deployment down to the App level. Dynatrace is also a great choice for on-premises monitoring. Check out more of the features listed in the [announcement](https://www.dynatrace.com/news/blog/automatic-end-to-end-service-fabric-monitoring-with-dynatrace/) and [instructions](https://www.dynatrace.com/news/blog/automatic-end-to-end-service-fabric-monitoring-with-dynatrace/) to enable Dynatrace on your cluster. 

## Datadog

Datadog has an extension for VMSS for both Windows and Linux instances. Using Datadog you can collect Windows event logs and thereby collect Service Fabric platform events on Windows. Check out the instructions on how to send your diagnostics data to Datadog [here](https://www.datadoghq.com/blog/azure-monitoring-enhancements/#integrate-with-azure-service-fabric).

## AppDynamics

The Service Fabric integration with AppDynamics is at the application level. By updating environment variables and using App Dynamics NuGets, you can send application telemetry to AppDynamics. Refer to these [instructions](https://docs.appdynamics.com/display/AZURE/Install+AppDynamics+for+Azure+Service+Fabric) for how to integrate your .NET Service Fabric applications with AppDynamics.

## New Relic

New Relic is another Application Performance Management tool that integrates well with Service Fabric applications. You can install the New Relic NuGet packages and add specific environment variables in your manifest files to send your application telemetry to New Relic. Check out these [instructions](https://docs.newrelic.com/docs/agents/net-agent/azure-installation/install-net-agent-azure-service-fabric) to enable New Relic telemetry for your .NET Service Fabric applications.

## ELK 

The ELK stack is a collection of open-source technologies: Elasticsearch, Logstash, and Kibana. By using these technologies in combination, you can collect, store, and analyze Service Fabric monitoring and diagnostics data. We have a tutorial for how to do this with Service Fabric native Java applications [here](service-fabric-tutorial-java-elk.md). 

## Humio

Humio is a log collection service that can gather logs from your applications and events from Service Fabric in the cloud or on-premises in real time. In addition to live observability, Humio offers state-of-the-art analysis and visualization capabilities for viewing and collecting information from your diagnostics. Humio has cost effective pricing plans and is built to scale while retaining it's lightening fast speed. It directly integrates with Service Fabric platform events and Application telemetry. You can read more about the Humio and Service Fabric integration [here](https://github.com/humio/service-fabric-humio).

## Next steps

* Get an [overview of monitoring and diagnostics](service-fabric-diagnostics-overview.md) in Service Fabric
* Learn how to [diagnose common scenarios](service-fabric-diagnostics-common-scenarios.md) with our first party tools
