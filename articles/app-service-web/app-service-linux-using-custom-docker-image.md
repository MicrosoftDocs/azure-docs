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

# Using a Custom Docker Image for App Service on Linux #
App Service provides pre-defined application stacks on Linux with support for specific versions, such as PHP 7.0 and Node.js 4.5. App Service on Linux uses Docker containers to host these application stacks. Customers that have an application stack that is not on already built-in can use a custom docker image that is hosted on either a public or private Docker image repository.

From the [Azure management portal](https://portal.azure.com) customers can set the custom image for both a new Web App on Linux or an existing one. Below is a screenshot of how to choose a custom Docker image for a new Web App  on Linux creation.

![Custom Docker Image for New Web App on Linux][1]



## Using a Docker Image from Docker Hub ##
From the [Azure management portal](https://portal.azure.com) customers can select the "Docker Hub" option as shown in the screenshot below for their Web App on Linux.

![Configure Docker Hub public repository image][2]

If your image is from a public repository, all customers need to provide us with the image name and an optional tag name, e.g. node:4.5. The Startup command is automatically used from what is defined in your Dockerfile when the image was built, but if customers want to override this they can set it here. 

If the Docker image you intend to use is from a private repository, you will also need to provide us with the Docker Hub credentials to use to access the image from the private Docker Hub repository as shown in the screenshot below.

![Configure Docker Hub private repository image][3]

## Using a Docker Image from a Private Image Registry ##

If customers need to use Docker images from a private image registry instead of Docker Hub, they need to use the "Private Registry" option as shown in the screenshot below.

![Configure Docker image from private registry][4]

Besides the image name and tag, customers will need to provide the registry URL along with the login information for the private registry. 


## Setting the Port Used by your Docker Image ##

When you use a custom Docker image for your web app, you can use the PORT environment variable in your Dockerfile that we will setup the container to use. So e.g below is a docker file for a Ruby app

	FROM ruby:2.2.0
	RUN mkdir /app
	WORKDIR /app
	ADD . /app
	RUN bundle install
	CMD bundle exec puma config.ru -p $PORT -e production

You can see that we use the PORT environment variable (casing matters!) the command on the last line and this will be passed in to your container at runtime.

If you are using an existing Docker image that you are not building, and it is using a port other than 80 for the application, you can set an app setting called port with the expected value. See the example below.


![Configure PORT app setting for custom Docker image][6]


## Switching Back to Built-In Image ##

If customers need to switch back from a custom image to a built-in image they can choose the option as shown in the screenshot below.

![Configure Built-In Docker image][5]


## Troubleshooting ##

If your application fails to start with your custom Docker image, you can check the Docker logs in the LogFiles/docker directory that you can access either through your SCM site as shown below or through FTP. 

![Using Kudu to view Docker logs][7]

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
