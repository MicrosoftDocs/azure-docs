---
title: How to use a custom Docker image for App Service on Linux | Microsoft Azure
description: How to use a custom Docker image for App Service on Linux.
keywords: azure app service, web app, linux, docker, container
services: app-service
documentationcenter: ''
author: naziml
manager: wpickett
editor: ''

ms.assetid: 
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/16/2016
ms.author: naziml

---

# Using a custom Docker image for App Service on Linux #

App Service provides pre-defined application stacks on Linux with support for specific versions, such as PHP 7.0 and Node.js 4.5. App Service on Linux uses Docker containers to host these pre-built application stacks. You can also use a custom Docker image to deploy your web app to an application stack that is not already defined in Azure. Custom Docker images can be hosted on either a public or private Docker repository.


## How to: set a custom Docker image for a new web app
You can set the custom Docker image for both new and existing webs apps. When you create a new web app on Linux in the [Azure portal](https://portal.azure.com), click **Configure container** to set a custom Docker image, as shown below:

![Custom Docker Image for a new web app on Linux][1]


## How to: use a custom Docker image from Docker Hub ##
To use a custom Docker image from Docker Hub:

1. In the [Azure portal](https://portal.azure.com), locate your web app on Linux, then in **Settings** click **Docker Container**.

2.  Select **Docker Hub** as the **Image source**, then click either **Public** or **Private** and type the **Image and optional tag name**, such as `node:4.5`. The **Startup command ** is set automatically based on what is defined in the Docker image file, but you can set your own commands.  

	![Configure Docker Hub public repository image][2]


	When your image is from a private repository, you will also need to enter the Docker Hub credentials as (**Login username** and **Password**) for the private Docker Hub repository, as shown below.

	![Configure Docker Hub private repository image][3]

3. After you have configured the container, click **Save**.

## How to use a Docker image from a private image registry ##
To use a custom Docker image from a private image registry:

1. In the [Azure portal](https://portal.azure.com), locate your web app on Linux, then in **Settings** click **Docker Container**.

2.  Select **Private registry** as the **Image source**, then type the **Image and optional tag name**, the **Server URL** for the private registry, along with the credentials as (**Login username** and **Password**), then click **Save**.

	![Configure Docker image from private registry][4]


## How to: set the port used by your Docker image ##

When you use a custom Docker image for your web app, you can use the `PORT` environment variable in your Dockerfile that we will setup the container to use. The following is an example of a docker file for a Ruby app:

	FROM ruby:2.2.0
	RUN mkdir /app
	WORKDIR /app
	ADD . /app
	RUN bundle install
	CMD bundle exec puma config.ru -p $PORT -e production

You can see that the PORT environment variable, on last line of the command, is passed to your container at runtime. Remember that casing matters in commands.

When you use an existing Docker image that you are not building, you may need to specify a port other than port 80 for the application. To do this, you add an app setting named `PORT` with the value expected by the image, as shown below:


![Configure PORT app setting for custom Docker image][6]


## How to: Switch back to using a built-in image ##

To switch from using a custom image to using a built-in image:

1. In the [Azure portal](https://portal.azure.com), locate your web app on Linux, then in **Settings** click **App Service**.

2. Select your **Runtime Stack** to use for the built-in image, then click **Save**. 

![Configure Built-In Docker image][5]


## Troubleshooting ##

When your application fails to start with your custom Docker image, check the Docker logs in the LogFiles/docker directory. You can access this directory either through your SCM site (shown below) or via FTP. 

![Using Kudu to view Docker logs][7]

You can access the SCM site from **Advanced Tools** in the **Development Tools** menu.

## Next Steps ##

Follow the following links to get started with App Service on Linux. Please post questions and concerns on [our forum](https://social.msdn.microsoft.com/forums/azure/home?forum=windowsazurewebsitespreview).

* [Introduction to App Service on Linux](./app-service-linux-intro.md)
* [Creating Web Apps in App Service on Linux](./app-service-linux-how-to-create-a-web-app.md)
* [Using PM2 Configuration for Node.js in Web Apps on Linux](./app-service-linux-using-nodejs-pm2.md)

<!--Image references-->
[1]: ./media/app-service-linux-using-custom-docker-image/new-configure-container.png
[2]: ./media/app-service-linux-using-custom-docker-image/existingapp-configure-dockerhub-public.png
[3]: ./media/app-service-linux-using-custom-docker-image/existingapp-configure-dockerhub-private.png
[4]: ./media/app-service-linux-using-custom-docker-image/existingapp-configure-privateregistry.png
[5]: ./media/app-service-linux-using-custom-docker-image/existingapp-configure-builtin.png
[6]: ./media/app-service-linux-using-custom-docker-image/setting-port.png
[7]: ./media/app-service-linux-using-custom-docker-image/kudu-docker-logs.png
