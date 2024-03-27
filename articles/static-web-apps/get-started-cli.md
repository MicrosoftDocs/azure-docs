---
title: "Quickstart: Building your first static site with the Azure Static Web Apps using the CLI"
description: Learn to deploy a static site to Azure Static Web Apps with the Azure CLI.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  quickstart
ms.date: 03/21/2024
ms.author: cshoe
ms.custom: mode-api, devx-track-azurecli, innovation-engine, linux-related-content
ms.devlang: azurecli
---

# Quickstart: Building your first static site using the Azure CLI

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://go.microsoft.com/fwlink/?linkid=2262845)

Azure Static Web Apps publishes websites to production by building apps from a code repository.

In this quickstart, you deploy a web application to Azure Static Web apps using the Azure CLI.

## Prerequisites

- [GitHub](https://github.com) account.
- [Azure](https://portal.azure.com) account.
  - If you don't have an Azure subscription, you can [create a free trial account](https://azure.microsoft.com/free).
- [Azure CLI](/cli/azure/install-azure-cli) installed (version 2.29.0 or higher).
- [A Git setup](https://www.git-scm.com/downloads). 

## Define environment variables

The first step in this quickstart is to define environment variables.

```bash
export RANDOM_ID="$(openssl rand -hex 3)"
export MY_RESOURCE_GROUP_NAME="myStaticWebAppResourceGroup$RANDOM_ID"
export REGION=EastUS2
export MY_STATIC_WEB_APP_NAME="myStaticWebApp$RANDOM_ID"
```

## Create a repository (optional)

(Optional) This article uses a GitHub template repository as another way to make it easy for you to get started. The template features a starter app to deploy to Azure Static Web Apps.

1. Navigate to the following location to create a new repository: https://github.com/staticwebdev/vanilla-basic/generate.
2. Name your repository `my-first-static-web-app`.

> [!NOTE]
> Azure Static Web Apps requires at least one HTML file to create a web app. The repository you create in this step includes a single `index.html` file.

3. Select **Create repository**.

## Deploy a Static Web App

Deploy the app as a static web app from the Azure CLI.

1. Create a resource group.

```bash
az group create \
  --name $MY_RESOURCE_GROUP_NAME \
  --location $REGION
```

Results:
<!-- expected_similarity=0.3 -->
```json
{
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-swa-group",
  "location": "eastus2",
  "managedBy": null,
  "name": "my-swa-group",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": "Microsoft.Resources/resourceGroups"
}
```

2. Deploy a new static web app from your repository.

```bash
az staticwebapp create \
    --name $MY_STATIC_WEB_APP_NAME \
    --resource-group $MY_RESOURCE_GROUP_NAME \
    --location $REGION 
```

There are two aspects to deploying a static app. The first operation creates the underlying Azure resources that make up your app. The second is a workflow that builds and publishes your application.

Before you can go to your new static site, the deployment build must first finish running.

3. Return to your console window and run the following command to list the website's URL.

```bash
export MY_STATIC_WEB_APP_URL=$(az staticwebapp show --name  $MY_STATIC_WEB_APP_NAME --resource-group $MY_RESOURCE_GROUP_NAME --query "defaultHostname" -o tsv)
```

```bash
runtime="1 minute";
endtime=$(date -ud "$runtime" +%s);
while [[ $(date -u +%s) -le $endtime ]]; do
    if curl -I -s $MY_STATIC_WEB_APP_URL > /dev/null ; then 
        curl -L -s $MY_STATIC_WEB_APP_URL 2> /dev/null | head -n 9
        break
    else 
        sleep 10
    fi;
done
```

Results:
<!-- expected_similarity=0.3 -->
```HTML
<!DOCTYPE html>
<html lang=en>
<head>
<meta charset=utf-8 />
<meta name=viewport content="width=device-width, initial-scale=1.0" />
<meta http-equiv=X-UA-Compatible content="IE=edge" />
<title>Azure Static Web Apps - Welcome</title>
<link rel="shortcut icon" href=https://appservice.azureedge.net/images/static-apps/v3/favicon.svg type=image/x-icon />
<link rel=stylesheet href=https://ajax.aspnetcdn.com/ajax/bootstrap/4.1.1/css/bootstrap.min.css crossorigin=anonymous />
```

```bash
echo "You can now visit your web server at https://$MY_STATIC_WEB_APP_URL"
```

## Use a GitHub template

You've successfully deployed a static web app to Azure Static Web Apps using the Azure CLI. Now that you have a basic understanding of how to deploy a static web app, you can explore more advanced features and functionality of Azure Static Web Apps.

In case you want to use the GitHub template repository, follow these steps:

Go to https://github.com/login/device and enter the code you get from GitHub to activate and retrieve your GitHub personal access token.

1. Go to https://github.com/login/device.
2. Enter the user code as displayed your console's message.
3. Select `Continue`.
4. Select `Authorize AzureAppServiceCLI`.

### View the Website via Git

1. As you get the repository URL while running the script, copy the repository URL and paste it into your browser.
2. Select the `Actions` tab.

   At this point, Azure is creating the resources to support your static web app. Wait until the icon next to the running workflow turns into a check mark with green background. This operation might take a few minutes to execute.

3. Once the success icon appears, the workflow is complete and you can return back to your console window.
4. Run the following command to query for your website's URL.
```bash
   az staticwebapp show \
     --name $MY_STATIC_WEB_APP_NAME \
     --query "defaultHostname"
```
5. Copy the URL into your browser to go to your website.

## Clean up resources (optional)

If you're not going to continue to use this application, delete the resource group and the static web app using the [az group delete](/cli/azure/group#az-group-delete) command.

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
