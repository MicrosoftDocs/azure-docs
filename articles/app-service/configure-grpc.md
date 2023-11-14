---
title: Configure gRPC on App Service
description: Configure gRPC with your application
author: jefmarti
ms.topic: how-to
ms.date: 11/10/2023
ms.author: jefmarti

---

# Configure gRPC on App Service

This article explains how to configure your Web App for gRPC.  

gRPC is a Remote Procedure Call framework that is used to streamline messages between your client and server over HTTP/2.  Using gRPC protocol over HTTP/2 enables the use of features like multiplexing to send multiple parallel requests over the same connection and bi-directional streaming for sending requests and responses simultaneously.  Support for gRPC on App Service (Linux) is currently available.  

To use gRPC on your application, you'll need to configure your application by selecting the HTTP Version, enabling the HTTP 2.0 Proxy, and setting the HTTP20_ONLY_PORT value.

Follow the steps below to configure a gRPC application with Azure App Service on Linux.

> [!NOTE]
> For gRPC client and server samples for each supported language, please visit the [documentation on GitHub](https://github.com/Azure/app-service-linux-docs/tree/master/HowTo/gRPC). 


## Prerequisite
Create your [Web App](getting-started.md) as you normally would.  Choose your preferred Runtime stack and **Linux** as your Operating System.

After your Web App is created, you'll need to configure the following to enable gRPC before deploying your application:

> [!NOTE]
> If you are deploying a .NET gRPC app to App Service with Visual Studio, skip to step 3.  Visual Studio will set the HTTP version and HTTP 2.0 Proxy configuration for you. 

## 1. Enable HTTP version
The first setting you need to configure is the HTTP version
1. Navigate to **Configuration** under **Settings** in the left pane of your web app
2. Click on the **General Settings** tab and scroll down to **Platform settings**
3. Go to the **HTTP version** drop-down and select **2.0**
4. Click **save**

This restarts your application and configure the front end to allow clients to make HTTP/2 calls.

## 2. Enable HTTP 2.0 Proxy
Next, you'll need to configure the HTTP 2.0 Proxy:
1. Under the same **Platform settings** section, find the **HTTP 2.0 Proxy** setting and select **gRPC Only**.
2. Click **save**

Once turned on, this setting configures your site to be forwarded HTTP/2 requests.

## 3. Add HTTP20_ONLY_PORT application setting
App Service requires an application setting that specifically listens for HTTP/2 traffic in addition to the HTTP/1.1 port.  The HTTP/2 port will be defined in the App Settings.   
1. Navigate to the **Environment variables** under **Settings** on the left pane of your web app.  
2. Under the **App settings** tab, add the following app setting to your application.
	1. **Name =** HTTP20_ONLY_PORT 
	2. **Value =** 8585

This setting will configure the port on your application that is specified to listen for HTTP/2 request.

Once these three steps are configured, you can successfully make HTTP/2 calls to your Web App with gRPC.  

### (Optional) Python Startup command
For Python applications only, you'll also need to set a custom startup command.  
1. Navigate to the **Configuration** under **Settings** on the left pane of your web app.
2. Under **General Settings**, add the following **Startup Command** `python app.py`.

## FAQ

> [!NOTE]
> gRPC is not a supported feature on ASEv2 SKUs.  Please use an ASEv3 SKU.

| Topic | Answer |
| --- | --- |
| **OS support** | Currently gRPC is a Linux only feature.  Support for Windows is coming in 2024 for .NET workloads. |
| **Language support** | gRPC is supported for each language that supports gRPC.  |
| **Client Certificates** | HTTP/2 enabled on App Service doesn't currently support client certificates.  Client certificates will need to be ignored when using gRPC. |
| **Secure calls** | gRPC must make secure HTTP calls to App Service.  You cannot make insecure calls. |
| **Activity Timeout** | gRPC requests on App Service have a timeout request limit.  gRPC requests will time out after 20 minutes of inactivity. |
| **Custom Containers** | HTTP/2 & gRPC support is in addition to App Service HTTP/1.1 support.  Custom containers that would like to support HTTP/2 must still support HTTP/1.1.   |


