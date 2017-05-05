---
title: Create a Ruby App with Azure App Service on Linux | Microsoft Docs
description: Learn to create a new Ruby app with Azure App Service on Linux.
keywords: azure app service, linux, oss
services: app-service
documentationcenter: ''
author: wesmc7777
manager: erikre
editor: ''

ms.assetid: 6d00c73c-13cb-446f-8926-923db4101afa
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/05/2017
ms.author: wesmc

---
# Create a Ruby App with Azure App Service on Linux - Preview

Azure App Service on Linux is currently in public preview and supports running web apps natively on Linux.

## Overview

This tutorial will show you how to create a basic ruby on rails application locally and prepare/deploy it to Azure App Service on Linux.

## Prerequisites

* [Ruby 2.3.3 or higher](https://www.ruby-lang.org/documentation/installation/#rubyinstaller)  installed on your development machine.
* [Git](https://git-scm.com/downloads) is installed on your development machine
* An [active Azure subscription](https://azure.microsoft.com/pricing/free-trial/)
* This tutorial is written in the context of an Ubuntu environment. All system commands are bash specific.


## Create a new local rails application

1. Create a directory for the new app and change to that directory.

		mkdir ~/workspace
		cd ~/workspace

2. Initialize Ruby and check the version using the `ruby -v` command.

    ![Ruby init](./media/app-service-linux-ruby-get-started/ruby-version.png)

3. Install rails using the `gem install rails` command.

    ![Install rails](./media/app-service-linux-ruby-get-started/install-rails.png)

4. Create a new rails application called **hello-world** using the following command:

	If you are using Rails 5.1.0 or later, include the `--skip-yarn` option as following:

		rails new hello-world --skip-yarn

	For Rails version prior to 5.1.0, use the following command:

		rails new hello-world --skip-yarn

    ![New Hello-world](./media/app-service-linux-ruby-get-started/rails-new-hello-world.png)

    ![New Hello-world](./media/app-service-linux-ruby-get-started/rails-new-hello-world-2.png)

	If you are using Rails 5.1+, a package.json will be created if the `--skip-yarn` option is not used. We don't want it included with our deployment. You can also delete the package.json file or add it to the *.git-ignore* file in the directory as follows: 

		# Ignore package.json
		/package.json

5. Change to the *hello-world* directory, and start the server.

    ![Start Hello-world](./media/app-service-linux-ruby-get-started/start-hello-world-server.png)
	
6. Using your web browser, navigate to `http://localhost:3000` to test the app locally.	

    ![Hello-world](./media/app-service-linux-ruby-get-started/hello-world.png)

## SSH support with custom Docker images

In order for a custom Docker image to support SSH communication between the container and the client in the Azure portal, perform the following steps for your Docker image. 

These steps are are shown in the Azure App Service repo as an example [here](https://github.com/Azure-App-Service/node/tree/master/4.4.7-1).

1. Include the `openssh-server` installation in [`RUN` instruction](https://docs.docker.com/engine/reference/builder/#run) in the Dockerfile for your image and set the password for the root account to `"Docker!"`. 

	> [!NOTE] 
	> This configuration does not allow external connections to the container. SSH can only
	> be accessed via the Kudu / SCM Site, which is authenticated using the publishing
	> credentials.

		```docker
        # ------------------------
        # SSH Server support
        # ------------------------
        RUN apt-get update \ 
		  && apt-get install -y --no-install-recommends openssh-server \
		  && echo "root:Docker!" | chpasswd 

2. Add a [`COPY` instruction](https://docs.docker.com/engine/reference/builder/#copy) to the Dockerfile to copy a [sshd_config](http://man.openbsd.org/sshd_config) file to the */etc/ssh/* directory. Your configuration file should be based on our sshd_config file in the Azure-App-Service GitHub repo [here](https://github.com/Azure-App-Service/node/blob/master/6.9.3-1/sshd_config).

	> [!NOTE] 
	> The *sshd_config* file must include the following or the connection fails: 
	> * `Ciphers` must include at least one of the following: `aes128-cbc,3des-cbc,aes256-cbc`.
	> * `MACs` must include at least one of the following: `hmac-sha1,hmac-sha1-96`.

		```docker
		COPY sshd_config /etc/ssh/


3. Include port 2222 in the [`EXPOSE` instruction](https://docs.docker.com/engine/reference/builder/#expose) for the Dockerfile. Although the root password is known, port 2222 cannot be accessed from the internet. It is an internal only port accessible only by containers within the bridge network of a private virtual network.

		```docker
		EXPOSE 2222 80

4. Make sure to start the ssh service. The example [here](https://github.com/Azure-App-Service/node/blob/master/6.9.3-1/init_container.sh) uses a shell script in */bin* directory.

		```bash
		#!/bin/bash
		service ssh start

	The Dockerfile uses the [`CMD` instruction](https://docs.docker.com/engine/reference/builder/#cmd) to run the script.

		```docker
		COPY init_container.sh /bin/
		...
		RUN chmod 755 /bin/init_container.sh 
		...		
		CMD ["/bin/init_container.sh"]




## Next steps
See the following links for more information regarding App Service on Linux. You can post questions and concerns on [our forum](https://social.msdn.microsoft.com/forums/azure/home?forum=windowsazurewebsitespreview).

* [Creating Web Apps in App Service on Linux](app-service-linux-how-to-create-a-web-app.md)
* [How to use a custom Docker image for App Service on Linux](app-service-linux-using-custom-docker-image.md)
* [Using PM2 Configuration for Node.js in Web Apps on Linux](app-service-linux-using-nodejs-pm2.md)
* [Using .NET Core in Azure App Service Web Apps on Linux](app-service-linux-using-dotnetcore.md)
* [Using Ruby in Azure App Service Web Apps on Linux](app-service-linux-using-ruby.md)
* [Azure App Service Web Apps on Linux FAQ](app-service-linux-faq.md)

