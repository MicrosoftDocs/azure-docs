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

Web App on Linux offers two different paths to getting your application published to the web:
 - **Custom image deployment**: "Dockerize" your application into a self-contained Docker image, publish it to a repository, and configure Web App on Linux with your repository information.
 - **Application deployment to a built-in platform image**: Use any one of the classic Azure App Service deployment methods to get your application files to Azure, and then run your app on one of our built-in platform containers. You can upload your compiled application binaries and configuration directly to Azure with FTP/FTPS or Web Deploy, or use Kudu to build and deploy your application from source.

Which method is right for your application? The primary factors to consider are:
 - **Availability of Docker with your development workflow**: Custom image development requires basic knowledge of the Docker development workflow. Deployment of a custom image to a Web App requires publication of your custom image to a repository host like Docker Hub. If you are already familiar with Docker and are able to add image build and publication to your workflow, or if you are already publishing your application as a Docker image, custom image deployment is almost certainly the best choice - custom images are unbeatable in their flexibility and testability.
 - **Unique runtime requirements**: The built-in platform images are designed to meet the needs of most web applications, but are limited in their customizability. Your app may have unique dependencies or other runtime requirements that exceeds what the built-in images are capable of.
 - **App build requirements**: Kudu helps you get your app up and running on Azure directly from source without requiring any external build or publication process. With Kudu, you can iterate and deploy your application rapidly. However, building an app with Kudu uses the same App Service Plan resources as your running site and can be a resource-intensive operation, and there is a limit to its customizability and the availability of build-related tools. Your app may outgrow Kudu's build capabilities as it grows in its dependencies or requirements for custom build logic.
 - **Disk usage at build/deployment time (app size) and runtime (runtime reads of app files)**: Files that need to be visible across scale instances and/or need to persist across site restarts should be written to your persistent site volume, mounted to `/home` at runtime. For built-in containers, `/home/site` is where your application is built and deployed. The filesystem outside of `/home` is local-only and will be reset to the contents of your image when your site restarts, but disk access is much faster than it is to `/home`. If your application is large or has many dependencies, or requires frequent disk access to application files, deploying your app in a custom container is the best option.
 - **Need for rapid iteration**: A Dockerized application image requires additional build time on top of app compilation, and must be published to a repository and pulled to the Azure environment in its entirety every time it is updated. If one of the built-in containers meets your application's needs, deploying from source may offer a faster development workflow.
