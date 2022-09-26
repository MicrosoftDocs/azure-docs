---
title: Azure Application Insights Telemetry Data Model - Telemetry Context | Microsoft Docs
description: Application Insights telemetry context data model
ms.topic: conceptual
ms.date: 05/15/2017
ms.reviewer: osrosado
---

# Telemetry context: Application Insights data model

Every telemetry item may have a strongly typed context field. Every field enables a specific monitoring scenario. Use the custom properties collection to store custom or application-specific contextual information.


## Application version

Information in the application context fields is always about the application that is sending the telemetry. Application version is used to analyze trend changes in the application behavior and its correlation to the deployments.

Max length: 1024


## Client IP address

The IP address of the client device. IPv4 and IPv6 are supported. When telemetry is sent from a service, the location context is about the user that initiated the operation in the service. Application Insights extract the geo-location information from the client IP and then truncate it. So client IP by itself can't be used as end-user identifiable information. 

Max length: 46


## Device type

Originally this field was used to indicate the type of the device the end user of the application is using. Today used primarily to distinguish JavaScript telemetry with the device type 'Browser' from server-side telemetry with the device type 'PC'.

Max length: 64


## Operation ID

A unique identifier of the root operation. This identifier allows grouping telemetry across multiple components. See [telemetry correlation](./correlation.md) for details. The operation ID is created by either a request or a page view. All other telemetry sets this field to the value for the containing request or page view. 

Max length: 128


## Parent operation ID

The unique identifier of the telemetry item's immediate parent. See [telemetry correlation](./correlation.md) for details.

Max length: 128


## Operation name

The name (group) of the operation. The operation name is created by either a request or a page view. All other telemetry items set this field to the value for the containing request or page view. Operation name is used for finding all the telemetry items for a group of operations (for example 'GET Home/Index'). This context property is used to answer questions like "what are the typical exceptions thrown on this page."

Max length: 1024


## Synthetic source of the operation

Name of synthetic source. Some telemetry from the application may represent synthetic traffic. It may be web crawler indexing the web site, site availability tests, or traces from diagnostic libraries like Application Insights SDK itself.

Max length: 1024


## Session ID

Session ID - the instance of the user's interaction with the app. Information in the session context fields is always about the end user. When telemetry is sent from a service, the session context is about the user that initiated the operation in the service.

Max length: 64


## Anonymous user ID

Anonymous user ID. (User.Id) Represents the end user of the application. When telemetry is sent from a service, the user context is about the user that initiated the operation in the service.

[Sampling](./sampling.md) is one of the techniques to minimize the amount of collected telemetry. Sampling algorithm attempts to either sample in or out all the correlated telemetry. Anonymous user ID is used for sampling score generation. So anonymous user ID should be a random enough value. 

> [!NOTE]
> The count of anonymous user IDs is not the same as the number of unique application users. The count of anonymous user IDs is typically higher because each time the user opens your app on a different device or browser, or cleans up browser cookies, a new unique anonymous user id is allocated. This calculation may result in counting the same physical users multiple times.

User IDs can be cross referenced with session IDs to provide unique telemetry dimensions and establish user activity over a session duration.

Using anonymous user ID to store user name is a misuse of the field. Use Authenticated user ID.

Max length: 128


## Authenticated user ID

Authenticated user ID. The opposite of anonymous user ID, this field represents the user with a friendly name. This ID is only collected by default with the ASP.NET Framework SDK's [`AuthenticatedUserIdTelemetryInitializer`](https://github.com/microsoft/ApplicationInsights-dotnet/blob/develop/WEB/Src/Web/Web/AuthenticatedUserIdTelemetryInitializer.cs).  

Use the Application Insights SDK to initialize the Authenticated User ID with a value identifying the user persistently across browsers and devices. In this way, all telemetry items are attributed to that unique ID. This ID enables querying for all telemetry collected for a specific user (subject to [sampling configurations](./sampling.md) and [telemetry filtering](./api-filtering-sampling.md)). 

User IDs can be cross referenced with session IDs to provide unique telemetry dimensions and establish user activity over a session duration.

Max length: 1024


## Account ID

The account ID, in multi-tenant applications, is the tenant account ID or name that the user is acting with. It's used for more user segmentation when user ID and authenticated user ID aren't sufficient. For example, a subscription ID for Azure portal or the blog name for a blogging platform.

Max length: 1024


## Cloud role

Name of the role the application is a part of. Maps directly to the role name in Azure. Can also be used to distinguish micro services, which are part of a single application.

Max length: 256


## Cloud role instance

Name of the instance where the application is running. Computer name for on-premises, instance name for Azure.

Max length: 256


## Internal: SDK version

SDK version. See [this article](https://github.com/MohanGsk/ApplicationInsights-Home/blob/master/EndpointSpecs/SDK-VERSIONS.md) for information.

Max length: 64


## Internal: Node name

This field represents the node name used for billing purposes. Use it to override the standard detection of nodes.

Max length: 256


## Next steps

- Learn how to [extend and filter telemetry](./api-filtering-sampling.md).
- See [data model](data-model.md) for Application Insights types and data model.
- Check out standard context properties collection [configuration](./configuration-with-applicationinsights-config.md#telemetry-initializers-aspnet).

