---
title: Web App on Linux Deployment: Custom container or built-in application stack?  | Microsoft Docs
description: How to decide between custom Docker container deployment and a built-in application framework
keywords: azure app service, web app, linux, oss
services: app-service
documentationcenter: ''
author: nickwalk
manager: erikre
editor: ''

ms.assetid: 
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/14/2017
ms.author: nickwalk

---
# Custom container or built-in application stack? 

[!INCLUDE [app-service-linux-preview](../../includes/app-service-linux-preview.md)]

[Web App on Linux](app-service-linux-intro.md) offers two different paths to getting your application published to the web:
 - **Custom image deployment**: "Dockerize" your application into a self-contained Docker image, publish it to a repository, and configure Web App on Linux with your repository information.
 - **Application deployment to a built-in platform image**: Use any one of the Azure App Service deployment methods to get your application files to Azure, and then run your app on one of our built-in platform containers. Upload your compiled application binaries and configuration with FTP or Web Deploy, or use Kudu to build and deploy your application from source.

Which method is right for your application? The primary factors to consider are:
 - **Availability of Docker with your development workflow**: Custom image development requires basic knowledge of the Docker development workflow. Deployment of a custom image to a Web App requires publication of your custom image to a repository host like Docker Hub. If you are already familiar with Docker and are able to add Docker tasks to your build workflow, or if you are already publishing your application as a Docker image, a custom image is almost certainly the best choice.
 - **Unique runtime requirements**: The built-in platform images are designed to meet the needs of most web applications, but are limited in their customizability. Your app may have unique dependencies or other runtime requirements that exceeds what the built-in images are capable of.
 - **App build requirements**: Kudu helps you get your app up and running on Azure directly from source code. No external build or publication process is required. With Kudu, you can iterate and deploy your application rapidly. However, building an app with Kudu uses the same App Service Plan resources as your running site. Builds can be resource-intensive operations, and there is a limit to the customizability and the availability of build-related tools. Your app may outgrow Kudu's build capabilities as it grows in its dependencies or requirements for custom build logic.
 - **Disk usage at build/deployment time (app size) and runtime (runtime reads of app files)**: Files that need to be visible across scale instances or persist across site restarts must be written to your persistent site volume, mounted to `/home` at runtime. For built-in containers, `/home/site` is where your application is built and deployed. The filesystem outside of `/home` is local-only and will be reset to the contents of your image when your site restarts, but disk access is much faster than it is to `/home`. If your application is large or has many dependencies, or requires frequent disk access to application files, deploying your app in a custom container is the best option.
 - **Need for rapid iteration**: Dockerizing an application requires additional build steps. For changes to take effect, you must push your new image to a repository with each update. These updates are then pulled to the Azure environment. If one of the built-in containers meets your application's needs, deploying from source may offer a faster development workflow.
