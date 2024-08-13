---
title: Configure gRPC on App Service
description: Learn how to configure a gRPC application with Azure App Service on Linux.
author: jefmarti
ms.topic: how-to
ms.custom: linux-related-content
ms.date: 11/10/2023
ms.author: jefmarti
---

# Configure gRPC on App Service

This article explains how to configure your web app for gRPC.

gRPC is a Remote Procedure Call framework that can streamline messages between your client and server over HTTP/2. Using the gRPC protocol over HTTP/2 enables the use of features like:

- Multiplexing to send multiple parallel requests over the same connection.
- Bidirectional streaming to send requests and responses simultaneously.

Support for gRPC is currently available on Azure App Service for Linux. To use gRPC on your web app, you need to configure your app by selecting the HTTP version, proxy, and port.

For gRPC client and server samples for each supported language, see the [documentation on GitHub](https://github.com/Azure/app-service-linux-docs/tree/master/HowTo/gRPC).

## Prerequisite

Create your [web app](getting-started.md) as you normally would. Choose your preferred runtime stack, and choose Linux as your operating system.

After you create your web app, configure the following details to enable gRPC before you deploy your application.

> [!NOTE]
> If you're deploying a .NET gRPC app to App Service by using Visual Studio, skip to [step 3](#3-configure-the-http2-port). Visual Studio sets the HTTP version and the HTTP 2.0 proxy configuration for you.

## 1. Configure the HTTP version

The first setting that you need to configure is the HTTP version:

1. On the left pane of your web app, under **Settings**, go to **Configuration**.
2. On the **General Settings** tab, scroll down to **Platform settings**.
3. In the **HTTP version** dropdown list, select **2.0**.
4. Select **Save**.

This setting restarts your application and configures the front end to allow clients to make HTTP/2 calls.

## 2. Configure the HTTP 2.0 proxy

Next, you need to configure the HTTP 2.0 proxy:

1. In the same **Platform settings** section, find the **HTTP 2.0 Proxy** setting and select **gRPC Only**.
2. Select **Save**.

This setting configures your site to receive HTTP/2 requests.

## 3. Configure the HTTP/2 port

App Service requires an application setting that specifically listens for HTTP/2 traffic in addition to HTTP/1.1 traffic. You define the HTTP/2 port in the app settings:

1. On the left pane of your web app, under **Settings**, go to **Environment variables**.
2. On the **App settings** tab, add the following app settings to your application:
   - **Name** = **HTTP20_ONLY_PORT**
   - **Value** = **8585**

These settings configure the port on your application that's specified to listen for HTTP/2 requests.

Now that you've configured the HTTP version, port, and proxy, you can successfully make HTTP/2 calls to your web app by using gRPC.

### (Optional) Python startup command

For Python applications only, you also need to set a custom startup command:

1. On the left pane of your web app, under **Settings**, go to **Configuration**.
2. Under **General Settings**, add the following value for **Startup Command**: `python app.py`.

## Common topics

The following table can answer your questions about using gRPC with App Service.

> [!NOTE]
> gRPC is not a supported feature in App Service Environment v2. Use App Service Environment v3.

| Topic | Answer |
| --- | --- |
| OS support | gRPC is available on Linux. Windows support is currently in preview. |
| Language support | gRPC is supported for each language that supports gRPC.  |
| Client certificates | HTTP/2 enabled on App Service doesn't currently support client certificates. Client certificates need to be ignored when you're using gRPC. |
| Secure calls | gRPC must make secure HTTP calls to App Service. You can't make nonsecure calls. |
| Activity timeout | gRPC requests on App Service have a timeout request limit. gRPC requests time out after 20 minutes of inactivity. |
| Custom containers | HTTP/2 and gRPC support is in addition to App Service HTTP/1.1 support. Custom containers that support HTTP/2 must also support HTTP/1.1.   |
