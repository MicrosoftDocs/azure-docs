---
title: Create a static HTML web app in Azure in five minutes | Microsoft Docs
description: Learn how easy it is to run web apps in App Service by deploying a sample app.
services: app-service\web
documentationcenter: ''
author: rick-anderson
manager: wpickett
editor: ''

ms.assetid: 60495cc5-6963-4bf0-8174-52786d226c26
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 05/08/2017
ms.author: riande

---
# Create a static HTML web app in Azure in five minutes
[!INCLUDE [login-to-azure](../../includes/login-to-azure.md)] 
[!INCLUDE [configure-deployment-user](../../includes/configure-deployment-user.md)] 
[!INCLUDE [app-service-web-selector-get-started](../../includes/app-service-web-selector-get-started.md)] 

This quickstart walks through how to and deploy a basic HTML+CSS site to Azure. You’ll run the app using an [Azure App Service plan](https://docs.microsoft.com/azure/app-service/azure-web-sites-web-hosting-plans-in-depth-overview), and create a web app in it using the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/get-started-with-azure-cli). You’ll use Git to deploy the app to Azure. It takes about five minutes to complete the tutorial once the prerequisites are installed.

![hello-world-in-browser](media/app-service-web-get-started-html/hello-world-in-browser-az.png)

## Before you begin

Before running this sample, download and install the following prerequisites locally:

- [git](https://git-scm.com/)
- [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli)

## Download the sample

In a terminal window, clone the sample app repository to your local machine:

```bash
git clone https://github.com/Azure-Samples/html-docs-hello-world.git
```

## View the HTML

To see what possible values you can use for `--location`, use the `az appservice list-locations` Azure CLI comman

Navigate to the directory that contains the sample HTML. Open the *index.html* file in your browser.

![hello-world-in-browser](media/app-service-web-get-started-html/hello-world-in-browser.png)

[!INCLUDE [app-service-web-quickstart1](../../includes/app-service-web-quickstart1.md)] 


Create a [Web App](app-service-web-overview.md) in the `quickStartPlan` App Service plan. 
The web app provides a hosting space for your code and provides a URL for to view the deployed app.

[!INCLUDE [app-service-web-quickstart2](../../includes/app-service-web-quickstart2.md)] 

# Update and redeploy the app

Open the *index.html* file. Make a change to the markup. For example, change `Hello world!` to `Hello Azure!`

Commit your changes in Git, then push the code changes to Azure.

```bash
git commit -am "updated HTML"
git push azure master
```

Once deployment has completed, refresh your browser to see the changes.

[!INCLUDE [cli-samples-clean-up](../../includes/cli-samples-clean-up.md)]

## Next steps

- Explore sample [Web Apps CLI scripts](app-service-cli-samples.md).
- Learn how to [Map a custom domain name](app-service-web-tutorial-custom-domain.md), such as contoso.com, to an App Service app(app-service-web-tutorial-custom-domain.md).