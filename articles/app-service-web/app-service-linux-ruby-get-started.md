---
title: Create a Ruby App with Web Apps on Linux | Microsoft Docs
description: Learn to create Ruby apps with Azure web wpp on Linux.
keywords: azure app service, linux, oss, ruby
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
ms.date: 08/15/2017
ms.author: wesmc;rachelap
---
# Create a Ruby App with Web Apps on Linux 

[!INCLUDE [app-service-linux-preview](../../includes/app-service-linux-preview.md)]

[Azure Web Apps](https://docs.microsoft.com/azure/app-service-web/app-service-web-overview) provides a highly scalable, self-patching web hosting service. This quickstart shows you how to create a basic Ruby on Rails application You then deploy it to Azure as a Web App on Linux.

![Hello-world](./media/app-service-linux-ruby-get-started/hello-world-updated.png)

## Prerequisites

* [Ruby 2.4.1 or higher](https://www.ruby-lang.org/en/documentation/installation/#rubyinstaller).
* [Git](https://git-scm.com/downloads).
* An [active Azure subscription](https://azure.microsoft.com/pricing/free-trial/).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Download the sample

In a terminal window, run the following command to clone the sample app repository to your local machine:

```bash
git clone https://github.com/Azure-Samples/ruby-docs-hello-world
```

Use this terminal window to run all the commands in this quickstart.

## Run the application locally

Run the rails server in order for the application to work. Change to the *hello-world* directory, and the `rails server` command starts the server.

```bash
cd hello-world\bin
rails server
```
	
Using your web browser, navigate to `http://localhost:3000` to test the app locally.	

    ![Hello-world](./media/app-service-linux-ruby-get-started/hello-world.png)

## Modify app to display welcome message

Modify the application so it displays a welcome message. Change the application's controller so it returns the message as HTML to the browser. 

Open *~/workspace/hello-world/app/controllers/application_controller.rb* for editing. Modify the `ApplicationController` class to look like the following code sample:

  ```ruby
  class ApplicationController > ActionController :: base
    protect_from_forgery with: :exception 
    def hello
      render html: "Hello, world from Azure Web App on Linux!"
    end
  end
  ```

Your app is now configured. Using your web browser, navigate to `http://localhost:3000` to confirm the root landing page.

	![Hello World configured](./media/app-service-linux-ruby-get-started/hello-world-configured.png)

## Create a Ruby web app on Azure

Use the `az appservice create` command to create an app service plan for your web app. Then `az webapp create` command creates the web app that uses the newly created service plan. 
 
```AzureCLI
  az appservice create --name myAppServicePlan --resource-group myResourceGroup --is-linux
  az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name hello-world --runtime "ruby|2.3" --deployment-local-git
```

Once the web app is created, an **Overview** page is available to view. Navigate to it. The following splash page is displayed:

![Splash page](./media/app-service-linux-ruby-get-started/splash-page.png)


## Deploy your application

Use Git to deploy the Ruby application to Azure. The web app already has a Git deployment configured. You can retrieve the deployment URL by issuing an `az webapp deployment` command.  

```bash
az webapp deployment source show --name myWebApp --resource-group myResourceGroup
```

Notice that the Git URL has the following form based on your web app name:

https://<your web app name>.scm.azurewebsites.net/<your web app name>.git

> [!NOTE] The deployment credentials are already set up for this tutorial. Review the document showing how to  [configure deployment credentials](./app-service-deployment-credentials) for more information.
>

Run the following commands to deploy the local application to your Azure website:

```bash
git remote add azure <Git deployment URL from above>
git add -A
git commit -m "Initial deployment commit"
git push azure master
```

Confirm that the remote deployment operations report success. The commands produce output similar to the following text:

```bash
remote: Using sass-rails 5.0.6
remote: Updating files in vendor/cache
remote: Bundle gems are installed into ./vendor/bundle
remote: Updating files in vendor/cache
remote: ~site/repository
remote: Finished successfully.
remote: Running post deployment command(s)...
remote: Deployment successful.
To https://<your web app name>.scm.azurewebsites.net/<your web app name>.git
  579ccb....2ca5f31  master -> master
myuser@ubuntu1234:~workspace/hello-world$
```

Once the deployment has completed, restart your web app for the deployment to take effect by using the `az webapp restart` command, as shown here:

```AzureCLI 
az webapp restart --name "hello-world" --resource-group "myResourceGroup"
```

Navigate to your site and verify the results.

```bash
http://<your web app name>.azurewebsites.net
```
![updated web app](./media/app-service-linux-ruby-get-started/hello-world-updated.png)

> [!NOTE]
> While the app is restarting, attempting to browse the site results in an HTTP status code `Error 503 Server unavailable`. It may take a few minutes to fully restart.
>

[!INCLUDE [Clean-up section](../../includes/clean-up-section-portal-web-app.md)]

## Next steps

[Creating Web Apps in App Service on Linux](app-service-linux-how-to-create-web-app.md)