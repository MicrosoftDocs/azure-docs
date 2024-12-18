---
title: .NET on Azure Container Apps overview
description: Learn about the tools and resources needed to run .NET and ASP.NET Core applications on Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 06/13/2024
ms.author: cshoe
---

# .NET on Azure Container Apps overview

To deploy a .NET application to a cloud native environment like Azure Container Apps, there are decisions you need to make to ensure your application runs smoothly and securely. This guide covers key concepts involved in deploying a .NET application to Azure Container Apps.

Azure Container Apps is a fully managed serverless container service that allows you to run containerized applications without having to manage the underlying infrastructure. Container Apps includes built-in support for features including autoscaling, health checks, and transport layer security (TLS) certificates.

This article details the concepts and concerns important to you as you deploy a .NET application on Azure Container Apps.

## Select a resource type

Container Apps supports two types of resources: apps and jobs. Apps are continuously running services, while jobs are short-lived tasks designed to run to completion.

As you prepare to deploy your app, consider differences between these two application types as their behavior affects how you manage your .NET application. The following table describes the difference in use cases between and jobs.

| Use case | Resource type |
|-------------|---------------|
| An ASP.NET Core web API that serves HTTP requests | App |
| A .NET Core console application that processes some data, then exits | Job |
| A continuously running background service that processes messages from a queue | App |
| An image optimization service that runs only when large images are saved to a storage account. | Job |
| An application using a framework like Hangfire, Quartz.NET, or the Azure WebJobs SDK | App |

## Containerize and deploy your .NET application

For both apps or jobs, you need to build a container image to package your .NET application. For more information on building container image, see [Docker images for ASP.NET Core](/aspnet/core/host-and-deploy/docker/building-net-docker-images).

Once set up, you can deploy your application to Azure Container Apps by following these guides:

* [Tutorial: Deploy to Azure Container Apps using Visual Studio](deploy-visual-studio.md)
* [Quickstart: Build and deploy from a repository to Azure Container Apps](quickstart-repo-to-cloud.md)
* [Create a job with Azure Container Apps](jobs-get-started-cli.md)

## Use the HTTP ingress

Azure Container Apps includes a built-in HTTP ingress that allows you to expose your apps to traffic coming from outside the container. The Container Apps ingress sits between your app and the end user. Since the ingress acts as an intermediary, whatever the end user sees ends at the ingress, and whatever your app sees begins at the ingress.

The ingress manages TLS termination and custom domains, eliminating the need for you to manually configure them in your app. Through the ingress, port `443` is exposed for HTTPS traffic, and optionally port `80` for HTTP traffic. The ingress forwards requests to your app at its target port.

If your app needs metadata about the original request, it can use [X-forwarded headers](#define-x-forwarded-headers).

To learn more, see [HTTP ingress in Azure Container Apps](ingress.md).

### Define a target port

To receive traffic, the ingress is configured on a target port where your app listens for traffic.

When ASP.NET Core is running in a container, the application listens to ports as configured in the container image. When you use the [official ASP.NET Core images](/aspnet/core/host-and-deploy/docker/building-net-docker-images), your app is configured to listen to HTTP on a default port. The default port depends on the ASP.NET Core version.

| Runtime | Target port |
|---|---|
| ASP.NET Core 7 and earlier | `80` |
| ASP.NET Core 8 and later | `8080` |

When you configure the ingress, set the target port to the number corresponding to the container image you're using.

### Define X-forwarded headers

As the ingress handles the original HTTP request, your app sees the ingress as the client. There are some situations where your app needs to know the original client's IP address or the original protocol (HTTP or HTTPS). You can access the protocol and IP information via the request's [`X-Forwarded-*` header](ingress-overview.md#http-headers).

You can read original values from these headers by accessing the `ForwardedHeaders` object.

```csharp
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});
```

For more information on working with request headers, see [Configure ASP.NET Core to work with proxy servers and load balancers](/aspnet/core/host-and-deploy/proxy-load-balancer).

## Build cloud-native .NET applications

Applications deployed to Container Apps often work best when you build on the foundations of [cloud-native principles](/dotnet/architecture/cloud-native/definition). The following sections help detail common concerns surrounding cloud-native applications.

### Application configuration

When deploying your .NET application to Azure Container Apps, use environment variables for storing configuration information instead of using *appsettings.json*. This practice allows you to configure your application in different ways in differing environments. Additionally, using environment variables makes it easier to manage configuration values without having to rebuild and redeploy your container image.

In Azure Container Apps, you [set environment variables](./environment-variables.md) when you define your app or job's container. Store sensitive values in secrets and reference them as environment variables. To learn more about managing secrets, see [Manage secrets in Azure Container Apps](manage-secrets.md).

### Managed identity

Azure Container Apps supports managed identity, which allows your app to access other Azure services without needing to exchange credentials. To learn more about securely communicating between Azure services, see [Managed identities in Azure Container Apps](managed-identity.md).

### Logging

In a cloud-native environment, logging is crucial for monitoring and troubleshooting your applications. By default, Azure Container Apps uses Azure Log Analytics to collect logs from your containers. You can configure other logging providers. To learn more about application logging, see [Log storage and monitoring options in Azure Container Apps](log-options.md).

When you configure a [logging provider](/aspnet/core/fundamentals/logging/) that writes logs to the console, Azure Container Apps collects and stores log messages for you.

### Health probes

Azure Container Apps includes built-in support for health probes, which allow you to monitor the health of your applications. If a probe determines your application is in an unhealthy state, then your container is automatically restarted. To learn more about health probes, see [Health probes in Azure Container Apps](health-probes.md).

For a chance to implement custom logic to determine the health of your application, you can configure a health check endpoint. To learn more about health check endpoints, see [Health checks in ASP.NET Core](/aspnet/core/host-and-deploy/health-checks).

### Autoscaling considerations

By default, Azure Container Apps automatically scales your ASP.NET Core apps based on the number of incoming HTTP requests. You can also configure custom autoscaling rules based on other metrics, such as CPU or memory usage. To learn more about scaling, see [Set scaling rules in Azure Container Apps](scale-app.md).

In .NET 8.0.4 and later, ASP.NET Core apps that use [data protection](/aspnet/core/security/data-protection/introduction) are automatically configured to keep protected data accessible to all replicas as the application scales. When your app begins to scale, a key manager handles the writing and sharing keys across multiple revisions. As the app is deployed, the environment variable `autoConfigureDataProtection` is automatically set `true` to enable this feature.  For more information on this auto configuration, see [this GitHub pull request](https://github.com/Azure/azure-rest-api-specs/pull/28001).

Autoscaling changes the number of replicas of your app based on the rules you define. By default, Container Apps randomly routes incoming traffic to the replicas of your ASP.NET Core app. Since traffic can split among different replicas, your app should be stateless so your application doesn't experience state-related issues.

Features such as anti-forgery, authentication, SignalR, Blazor Server, and Razor Pages depend on data protection require extra configuration to work correctly when scaling to multiple replicas.

#### Configure data protection

ASP.NET Core has special features protect and unprotect data, such as session data and anti-forgery tokens. By default, data protection keys are stored on the file system, which isn't suitable for a cloud-native environment.

If you're deploying a .NET Aspire application, data protection is automatically configured for you. In all other situations, you need to [configure data protection manually](/aspnet/core/host-and-deploy/scaling-aspnet-apps/scaling-aspnet-apps?view=aspnetcore-8.0&tabs=login-azure-cli&preserve-view=true#connect-the-azure-services).

#### Configure ASP.NET Core SignalR

ASP.NET Core SignalR requires a backplane to distribute messages to multiple server replicas. When deploying your ASP.NET Core app with SignalR to Azure Container Apps, you must configure one of the supported backplanes, such as Azure SignalR Service or Redis. To learn more about backplanes, see [ASP.NET Core SignalR hosting and scaling](/aspnet/core/signalr/scale).

#### Configure Blazor Server

ASP.NET Core Blazor Server apps store state on the server, which means that each client must be connected to the same server replica during their session. When deploying your Blazor Server app to Azure Container Apps, you must enable sticky sessions to ensure that clients are routed to the same replica. To learn more, see [Session Affinity in Azure Container Apps](sticky-sessions.md).

## Related information

* [Deploy a .NET Aspire app](/dotnet/aspire/deployment/azure/aca-deployment)
* [Deploy and scale an ASP.NET Core app](/aspnet/core/host-and-deploy/scaling-aspnet-apps/scaling-aspnet-apps)
