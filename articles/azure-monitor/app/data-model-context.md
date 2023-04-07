---
title: 'Application Insights telemetry data model: Telemetry context | Microsoft Docs'
description: Learn about the Application Insights telemetry context data model.
ms.topic: conceptual
ms.date: 05/15/2017
ms.reviewer: osrosado
---

# Telemetry context: Application Insights data model

Every telemetry item might have a strongly typed context field. Every field enables a specific monitoring scenario. Use the custom properties collection to store custom or application-specific contextual information.

## Application version

Information in the application context fields is always about the application that's sending the telemetry. The application version is used to analyze trend changes in the application behavior and its correlation to the deployments.

**Maximum length:** 1,024

## Client IP address

This field is the IP address of the client device. IPv4 and IPv6 are supported. When telemetry is sent from a service, the location context is about the user who initiated the operation in the service. Application Insights extract the geo-location information from the client IP and then truncate it. The client IP by itself can't be used as user identifiable information.

**Maximum length:** 46

## Device type

Originally, this field was used to indicate the type of the device the user of the application is using. Today it's used primarily to distinguish JavaScript telemetry with the device type `Browser` from server-side telemetry with the device type `PC`.

**Maximum length:** 64

## Operation ID

This field is the unique identifier of the root operation. This identifier allows grouping telemetry across multiple components. For more information, see [Telemetry correlation](./correlation.md). The operation ID is created by either a request or a page view. All other telemetry sets this field to the value for the containing request or page view.

**Maximum length:** 128

## Parent operation ID

This field is the unique identifier of the telemetry item's immediate parent. For more information, see [Telemetry correlation](./correlation.md).

**Maximum length:** 128

## Operation name

This field is the name (group) of the operation. The operation name is created by either a request or a page view. All other telemetry items set this field to the value for the containing request or page view. The operation name is used for finding all the telemetry items for a group of operations (for example, `GET Home/Index`). This context property is used to answer questions like What are the typical exceptions thrown on this page?

**Maximum length:** 1,024

## Synthetic source of the operation

This field is the name of the synthetic source. Some telemetry from the application might represent synthetic traffic. It might be the web crawler indexing the website, site availability tests, or traces from diagnostic libraries like the Application Insights SDK itself.

**Maximum length:** 1,024

## Session ID

Session ID is the instance of the user's interaction with the app. Information in the session context fields is always about the user. When telemetry is sent from a service, the session context is about the user who initiated the operation in the service.

**Maximum length:** 64

## Anonymous user ID

The anonymous user ID (User.Id) represents the user of the application. When telemetry is sent from a service, the user context is about the user who initiated the operation in the service.

[Sampling](./sampling.md) is one of the techniques to minimize the amount of collected telemetry. A sampling algorithm attempts to either sample in or out all the correlated telemetry. An anonymous user ID is used for sampling score generation, so an anonymous user ID should be a random enough value.

> [!NOTE]
> The count of anonymous user IDs isn't the same as the number of unique application users. The count of anonymous user IDs is typically higher because each time the user opens your app on a different device or browser, or cleans up browser cookies, a new unique anonymous user ID is allocated. This calculation might result in counting the same physical users multiple times.

User IDs can be cross referenced with session IDs to provide unique telemetry dimensions and establish user activity over a session duration.

Using an anonymous user ID to store a username is a misuse of the field. Use an authenticated user ID.

**Maximum length:** 128

## Authenticated user ID

An authenticated user ID is the opposite of an anonymous user ID. This field represents the user with a friendly name. This ID is only collected by default with the ASP.NET Framework SDK's [`AuthenticatedUserIdTelemetryInitializer`](https://github.com/microsoft/ApplicationInsights-dotnet/blob/develop/WEB/Src/Web/Web/AuthenticatedUserIdTelemetryInitializer.cs).

Use the Application Insights SDK to initialize the authenticated user ID with a value that identifies the user persistently across browsers and devices. In this way, all telemetry items are attributed to that unique ID. This ID enables querying for all telemetry collected for a specific user (subject to [sampling configurations](./sampling.md) and [telemetry filtering](./api-filtering-sampling.md)).

User IDs can be cross referenced with session IDs to provide unique telemetry dimensions and establish user activity over a session duration.

**Maximum length:** 1,024

## Account ID

The account ID, in multi-tenant applications, is the tenant account ID or name that the user is acting with. It's used for more user segmentation when a user ID and an authenticated user ID aren't sufficient. Examples might be a subscription ID for the Azure portal or the blog name for a blogging platform.

**Maximum length:** 1,024

## Cloud role

This field is the name of the role of which the application is a part. It maps directly to the role name in Azure. It can also be used to distinguish micro services, which are part of a single application.

**Maximum length:** 256

## Cloud role instance

This field is the name of the instance where the application is running. For example, it's the computer name for on-premises or the instance name for Azure.

**Maximum length:** 256

## Internal: SDK version

For more information, see this [SDK version article](https://github.com/MohanGsk/ApplicationInsights-Home/blob/master/EndpointSpecs/SDK-VERSIONS.md).

**Maximum length:** 64

## Internal: Node name

This field represents the node name used for billing purposes. Use it to override the standard detection of nodes.

**Maximum length:** 256

## Next steps

- Learn how to [extend and filter telemetry](./api-filtering-sampling.md).
- See the [Application Insights telemetry data model](data-model.md) for Application Insights types and data model.
- Check out standard context properties collection [configuration](./configuration-with-applicationinsights-config.md#telemetry-initializers-aspnet).