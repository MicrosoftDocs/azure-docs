---
title: Azure Service Fabric with API Management overview 
description: This article is an introduction to using Azure API Management as a gateway to your Service Fabric applications. 
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Service Fabric with Azure API Management overview

Cloud applications typically need a front-end gateway to provide a single point of ingress for users, devices, or other applications. In Service Fabric, a gateway can be any stateless service such as an [ASP.NET Core application](service-fabric-reliable-services-communication-aspnetcore.md), or another service designed for traffic ingress, such as [Event Hubs](../event-hubs/index.yml), [IoT Hub](../iot-hub/index.yml), or [Azure API Management](../api-management/index.yml).

This article is an introduction to using Azure API Management as a gateway to your Service Fabric applications. API Management integrates directly with Service Fabric, allowing you to publish APIs with a rich set of routing rules to your back-end Service Fabric services.

## Availability

> [!IMPORTANT]
> This feature is available in the **Premium** and **Developer** tiers of API Management due to the required virtual network support.

## Architecture

A common Service Fabric architecture uses a single-page web application that makes HTTP calls to back-end services that expose HTTP APIs. The [Service Fabric getting-started sample application](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started) shows an example of this architecture.

In this scenario, a stateless web service serves as the gateway into the Service Fabric application. This approach requires you to write a web service that can proxy HTTP requests to back-end services, as shown in the following diagram:

![Diagram that shows how a stateless web service serves as the gateway into the Service Fabric application.][sf-web-app-stateless-gateway]

As applications grow in complexity, so do the gateways that must present an API in front of myriad back-end services. Azure API Management is designed to handle complex APIs with routing rules, access control, rate limiting, monitoring, event logging, and response caching with minimal work on your part. Azure API Management supports Service Fabric service discovery, partition resolution, and replica selection to intelligently route requests directly to back-end services in Service Fabric so you don't have to write your own stateless API gateway. 

In this scenario, the web UI is still served through a web service, while HTTP API calls are managed and routed through Azure API Management, as shown in the following diagram:

![Diagram that shows how the web UI is still served through a web service, while HTTP API calls are managed and routed through Azure API Management.][sf-apim-web-app]

## Application scenarios

Services in Service Fabric may be either stateless or stateful, and they may be partitioned using one of three schemes: singleton, int-64 range, and named. Service endpoint resolution requires identifying a specific partition of a specific service instance. When resolving an endpoint of a service, both the service instance name (for example, `fabric:/myapp/myservice`) as well as the specific partition of the service must be specified, except in the case of singleton partition.

Azure API Management can be used with any combination of stateless services, stateful services, and any partitioning scheme.

## Send traffic to a stateless service

In the simplest case, traffic is forwarded to a stateless service instance. To achieve this, an API Management operation contains an inbound processing policy with a Service Fabric back-end that maps to a specific stateless service instance in the Service Fabric back-end. Requests sent to that service are sent to a random instance of the service.

**Example**

In the following scenario, a Service Fabric application contains a stateless service named `fabric:/app/fooservice` that exposes an internal HTTP API. The service instance name is well known and can be hard-coded directly in the API Management inbound processing policy. 

![Diagram that shows a Service Fabric application contains a stateless service that exposes an internal HTTP API.][sf-apim-static-stateless]

## Send traffic to a stateful service

Similar to the stateless service scenario, traffic can be forwarded to a stateful service instance. In this case, an API Management operation contains an inbound processing policy with a Service Fabric back-end that maps a request to a specific partition of a specific *stateful* service instance. The partition to map each request to is computed via a lambda method using some input from the incoming HTTP request, such as a value in the URL path. The policy may be configured to send requests to the primary replica only, or to a random replica for read operations.

**Example**

In the following scenario, a Service Fabric application contains a partitioned stateful service named `fabric:/app/userservice` that exposes an internal HTTP API. The service instance name is well known and can be hard-coded directly in the API Management inbound processing policy.  

The service is partitioned using the Int64 partition scheme with two partitions and a key range that spans `Int64.MinValue` to `Int64.MaxValue`. The back-end policy computes a partition key within that range by converting the `id` value provided in the URL request path to a 64-bit integer, although any algorithm can be used here to compute the partition key. 

![Service Fabric with Azure API Management topology overview][sf-apim-static-stateful]

## Send traffic to multiple stateless services

In more advanced scenarios, you can define an API Management operation that maps requests to more than one service instance. In this case, each operation contains a policy that maps requests to a specific service instance based on values from the incoming HTTP request, such as the URL path or query string, and in the case of stateful services, a partition within the service instance.

To achieve this, an API Management operation contains an inbound processing policy with a Service Fabric back-end that maps to a stateless service instance in the Service Fabric back-end based on values retrieved from the incoming HTTP request. Requests to a service are sent to a random instance of the service.

**Example**

In this example, a new stateless service instance is created for each user of an application with a dynamically generated name using the following formula:

- `fabric:/app/users/<username>`

  Each service has a unique name, but the names are not known up-front because the services are created in response to user or admin input and thus cannot be hard-coded into APIM policies or routing rules. Instead, the name of the service to which to send a request is generated in the back-end policy definition from the `name` value provided in the URL request path. For example:

  - A request to `/api/users/foo` is routed to service instance `fabric:/app/users/foo`
  - A request to `/api/users/bar` is routed to service instance `fabric:/app/users/bar`

![Diagram that shows an example where a new stateless service instance is created for each user of an application with a dynamically generated name.][sf-apim-dynamic-stateless]

## Send traffic to multiple stateful services

Similar to the stateless service example, an API Management operation can map requests to more than one **stateful** service instance, in which case you also may need to perform partition resolution for each stateful service instance.

To achieve this, an API Management operation contains an inbound processing policy with a Service Fabric back-end that maps to a stateful service instance in the Service Fabric back-end based on values retrieved from the incoming HTTP request. In addition to mapping a request to specific service instance, the request can also be mapped to a specific partition within the service instance, and optionally to either the primary replica or a random secondary replica within the partition.

**Example**

In this example, a new stateful service instance is created for each user of the application with a dynamically generated name using the following formula:

- `fabric:/app/users/<username>`

  Each service has a unique name, but the names are not known up-front because the services are created in response to user or admin input and thus cannot be hard-coded into APIM policies or routing rules. Instead, the name of the service to which to send a request is generated in the back-end policy definition from the `name` value provided the URL request path. For example:

  - A request to `/api/users/foo` is routed to service instance `fabric:/app/users/foo`
  - A request to `/api/users/bar` is routed to service instance `fabric:/app/users/bar`

Each service instance is also partitioned using the Int64 partition scheme with two partitions and a key range that spans `Int64.MinValue` to `Int64.MaxValue`. The back-end policy computes a partition key within that range by converting the `id` value provided in the URL request path to a 64-bit integer, although any algorithm can be used here to compute the partition key. 

![Diagram that shows that each service instance is also partitioned using the Int64 partition scheme with two partitions and a key range that spans Int64.MinValue to Int64.MaxValue.][sf-apim-dynamic-stateful]

## Next steps

Follow the [tutorial](service-fabric-tutorial-deploy-api-management.md) to set up your first Service Fabric cluster with API Management and flow requests through API Management to your services.

<!-- links -->

<!-- pics -->
[sf-apim-web-app]: ./media/service-fabric-api-management-overview/sf-apim-web-app.png
[sf-web-app-stateless-gateway]: ./media/service-fabric-api-management-overview/sf-web-app-stateless-gateway.png
[sf-apim-static-stateless]: ./media/service-fabric-api-management-overview/sf-apim-static-stateless.png
[sf-apim-static-stateful]: ./media/service-fabric-api-management-overview/sf-apim-static-stateful.png
[sf-apim-dynamic-stateless]: ./media/service-fabric-api-management-overview/sf-apim-dynamic-stateless.png
[sf-apim-dynamic-stateful]: ./media/service-fabric-api-management-overview/sf-apim-dynamic-stateful.png
