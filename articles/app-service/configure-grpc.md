---
title: Configure gRPC on App Service
description: Learn how to configure a Google Remote Procedure Call (gRPC) application with Azure App Service on Linux.
author: jefmarti
ms.topic: how-to
ms.custom: linux-related-content
ms.date: 02/12/2026
ms.author: jefmarti
ms.service: azure-app-service
#customer intent: As an Azure App Service developer, I want to learn how to configure gRPC for my Linux apps so I can streamline messages between my clients and server over HTTP/2.

---

# Configure gRPC on App Service

This article explains how to configure your web app for gRPC, a remote procedure call framework that can streamline messages between your client and server over HTTP/2. Using the gRPC protocol over HTTP/2 lets you use features like:

- Multiplexing to send multiple parallel requests over the same connection.
- Bidirectional streaming to send requests and responses simultaneously.

Support for gRPC is available on Azure App Service for Linux. To use gRPC on your web app, you configure your app by selecting the HTTP version, proxy, and port.

For gRPC client and server samples for each supported language, see [gRPC on App Service](https://github.com/Azure/app-service-linux-docs/tree/master/HowTo/gRPC) on GitHub.

## Prerequisite

- A Linux [web app](getting-started.md) in Azure App Service that uses your preferred runtime stack.

## Configure gRPC

After you create your web app, configure the following details to enable gRPC before you deploy your application.

> [!NOTE]
> If you're deploying a .NET gRPC app to App Service by using Visual Studio, skip to [Configure the HTTP/2 port](#configure-the-http2-port), because Visual Studio sets the HTTP version and HTTP 2.0 proxy configuration for you.

### Configure the HTTP version and HTTP 2.0 proxy

Use the Azure portal page for your web app to configure your app's HTTP version and proxy.

1. On the left navigation menu of your web app page, select **Settings** > **Configuration**.
1. On the **General settings** tab of the **Stack settings** page, configure the following settings:
   - For **HTTP version**, select **2.0**.
   - For **HTTP 2.0 Proxy**, select **gRPC only**.
1. Select **Apply**.

The **HTTP version** setting restarts your application and configures the front end to allow clients to make HTTP/2 calls. The **HTTP 2.0 Proxy** setting configures your site to receive HTTP/2 requests.

### Configure the HTTP/2 port

App Service requires an application setting that specifically listens for HTTP/2 traffic in addition to HTTP/1.1 traffic. Use **App settings** to define the HTTP/2 port.

1. On the left navigation menu of your web app page, select **Settings** > **Environmental variables**.
1. On the **App settings** tab of the **Environmental variables** page, select **Add**.
1. On the **Add/Edit application setting** screen, add the following app setting:
   - For **Name**, enter *HTTP20_ONLY_PORT*.
   - For **Value**, enter *8585*.
1. Select **Apply**, and confirm that your application might restart if necessary.

This setting configures the port on your application that listens for HTTP/2 requests.

Now that you configured the HTTP version, port, and proxy, you can successfully make HTTP/2 calls to your web app by using gRPC.

### Provide a startup command

For Python applications, you must provide a custom startup command. For other languages, a startup command is optional.

1. On the left navigation menu of your web app page, select **Settings** > **Configuration**.
1. On the **Stack settings** page, select the **Stack settings** tab.
1. Under **Startup command**, enter `python app.py`.
1. Select **Apply**.

## Requirements and limitations

The following requirements and limitations apply to gRPC usage with App Service.

- **App Service Environment version**. App Service Environment v2 doesn't support gRPC. Use App Service Environment v3.
- **OS support**. gRPC is available on Linux. Windows support is currently in preview.
- **Client certificates**. HTTP/2 on App Service doesn't support client certificates. Client certificates must be ignored when you use gRPC.
- **Secure calls**. gRPC must make secure HTTP calls to App Service. You can't make nonsecure calls.
- **Activity timeout**. App Service gRPC requests have a timeout request limit. gRPC requests time out after 20 minutes of inactivity.
- **Custom containers**. HTTP/2 and gRPC support is in addition to App Service HTTP/1.1 support. Custom containers that support HTTP/2 must also support HTTP/1.1.
