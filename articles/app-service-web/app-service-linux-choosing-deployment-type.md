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
 - **Custom image deployment**: "Dockerize" your application into a self-contained Docker image, publish it to a repository, and configure Web App on Linux with your repository information. Generally, any Docker image that can be pulled via `docker pull` can be deployed as a Web App, including images in private password-protected repositories.
 - **Application deployment to a built-in platform image**: Use any one of the classic Azure App Service deployment methods to get your application files to Azure, and then run your app on one of our built-in platform containers. You can upload your compiled application binaries and configuration directly to Azure with FTP/FTPS or Web Deploy, or use Kudu to build and deploy your application from source.

Which method is right for your application? The primary factors to consider are:
 - **Availability of Docker with your development workflow**: Custom image deployment requires basic knowledge of the Docker development workflow and a build process (manual or automated) that includes publication of your application as a Docker image to a web-accessible repository host like Docker Hub. If you are already familiar with Docker and are able to add image build and publication to your workflow, or if you are already publishing your application as a Docker image, custom image deployment is almost certainly the best choice - custom images are unbeatable in their flexibility and testability.
 - **Unique runtime requirements**: The built-in platform images will meet the needs of most web applications across a number of application stacks, but are limited in their customizability. Your app may have unique dependencies or other runtime requirements that exceeds what the built-in images are capable of.
 - **App build requirements**: Kudu will help you get your app up and running on Azure directly from source without requiring any external build or publication process, and can help you iterate and deploy rapidly. However, building an app with Kudu uses the same App Service Plan resources as your running site and can be a resource-intensive operation, and there is a limit to its customizability and the availability of build-related tools. Your app may outgrow Kudu's build capabilities as it grows in its dependencies or requirements for custom build logic.
 - **Disk usage at build/deployment time (app size) and runtime (runtime reads of app files)**: On Azure, your persistent site volume is mounted to `/home` at runtime. This is where your app should write files that need to be visible across scale instances and/or need to persist across site restarts. Additionally, this is where your application is built/deployed if you are not using a custom container. The filesystem outside of `/home` is local-only and will be reset to the contents of your image when your site restarts, but disk access is much faster than it is to `/home`. If your application is large and/or requires building or restoring many dependencies during build, or requires frequent disk access to files deployed with your application at runtime, deploying your app in a custom container is the best option.
 - **Need for rapid iteration**: A Dockerized application image is generally larger than the application it contains, and requires additional build time on top of app compilation, and must be pulled to the Azure environment in its entirety every time it is updated and republished. If you are actively developing and iterating on an application whose needs are met with one of the built-in containers, deploying from source may offer a faster development workflow.
