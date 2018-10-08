---
title: Distributed Tracing in Azure Application Insights | Microsoft Docs
description: Provides information about Microsoft's support for distributed tracing through our local forwarder and partnership in the OpenCensus project
services: application-insights
keywords:
author: nikmd23
ms.author: nimolnar
ms.reviewer: mbullwin
ms.date: 09/17/2018
ms.service: application-insights
ms.topic: conceptual
manager: carmonm
---

# What is Distributed Tracing?

The advent of modern cloud and microservices architectures has given rise to simple, independently deployable services that can help reduce costs while increasing availability and throughput. But while these movements have made individual services easier to understand as a whole, they’ve made overall systems more difficult to reason about and debug.

In monolithic architectures, we’ve gotten used to debugging with call stacks. Call stacks are brilliant tools for showing the flow of execution (Method A called Method B, which called Method C), along with details and parameters about each of those calls. This is great for monoliths or services running on a single process, but how do we debug when the call is across a process boundary, not simply a reference on the local stack? 

That’s where distributed tracing comes in.  

Distributed tracing is the equivalent of call stacks for modern cloud and microservices architectures, with the addition of a simplistic performance profiler thrown in. In Azure Monitor, we provide two experiences for consuming distributed trace data. The first is our [transaction diagnostics](https://docs.microsoft.com/azure/application-insights/app-insights-transaction-diagnostics) view, which is like a call stack with a time dimension added in. The transaction diagnostics view provides visibility into one single transaction/request, and is helpful for finding the root cause of reliability issues and performance bottlenecks on a per request basis.

Azure Monitor also offers an [application map](https://docs.microsoft.com/azure/application-insights/app-insights-app-map) view which aggregates many transactions to show a topological view of how the systems interact, and what the average performance and error rates are. 

## How to Enable Distributed Tracing

Enabling distributed tracing across the services in an application is as simple as adding the proper SDK or library to each service, based on the language the service was implemented in.

## Enabling via Application Insights SDKs

The Application Insights SDKs for .NET, .NET Core, Java, Node.js, and JavaScript all support distributed tracing natively. Instructions for installing and configuring each Application Insights SDK are available below:

* [.NET](https://docs.microsoft.com/azure/application-insights/quick-monitor-portal)
* [.NET Core](https://docs.microsoft.com/azure/application-insights/app-insights-dotnetcore-quick-start)
* [Java](https://docs.microsoft.com/azure/application-insights/app-insights-java-get-started)
* [Node.js](https://docs.microsoft.com/azure/application-insights/app-insights-nodejs-quick-start)
* [JavaScript](https://docs.microsoft.com/azure/application-insights/app-insights-javascript)

With the proper Application Insights SDK installed and configured, tracing information is automatically collected for popular frameworks, libraries, and technologies by SDK dependency auto-collectors. The full list of supported technologies is available in [the Dependency auto-collection documentation](https://docs.microsoft.com/azure/application-insights/auto-collect-dependencies).

 Additionally, any technology can be tracked manually with a call to [TrackDependency](https://docs.microsoft.com/azure/application-insights/app-insights-api-custom-events-metrics) on the [TeleletryClient](https://docs.microsoft.com/azure/application-insights/app-insights-api-custom-events-metrics).

## Enable via OpenCensus

In addition to the Application Insights SDKs, Application Insights also supports distributed tracing through [OpenCensus](https://opencensus.io/). OpenCensus is an open source, vendor-agnostic, single distribution of libraries to provide metrics collection and distributed tracing for services. It also enables the open source community to enable distributed tracing with popular technologies like Redis, Memcached, or MongoDB. [Microsoft collaborates on OpenCensus with several other monitoring and cloud partners](https://open.microsoft.com/2018/06/13/microsoft-joins-the-opencensus-project/).

To add distributed tracing capabilities to an application with OpenCensus, first [install and configure the Application Insights Local Forwarder](./opencensus-local-forwarder.md). From there, configure OpenCensus to route distributed trace data through the Local Forwarder. Both [Python](./opencensus-python.md) and [Go](./opencensus-go.md) are supported.

The OpenCensus website maintains API reference documentation for [Python](https://opencensus.io/api/python/trace/usage.html) and [Go](https://godoc.org/go.opencensus.io), as well as various different guides for using OpenCensus. 

## Next steps

* [OpenCensus Python usage guide](https://opencensus.io/api/python/trace/usage.html)
* [Application map](./app-insights-app-map.md)
* [End-to-end performance monitoring](./app-insights-tutorial-performance.md)