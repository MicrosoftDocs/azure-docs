---
title: 'Quickstart: Create a web app on Azure Arc'
description: Get started with App Service on Azure Arc deploying your first web app.
ms.date: 05/04/2021
ms.topic: quickstart
---

# Create an App Service app on Azure Arc

In this quickstart, you create an App Service app to an Azure Arc enabled Kubernetes cluster. This scenario supports Linux apps only, and you can use a built-in language stack or a custom container.

## Prerequisites

- [Create an App Service Kubernetes environment](manage-create-arc-environment) for an Azure Arc-enabled Kubernetes cluster.
- 

## 1. Create a resource group

Run the following command. `TODO: Does location matter?`

```azurecli-interactive
az group create --name myResourceGroup --location eastus 
```

## 2. Create an App Service plan

Run the following command and replace `<environment-name>` with the name of the App Service Kubernetes environment (see [Prerequisites](#prerequisites)).

```azurecli-interactive
az appservice plan create --resource-group myResourceGroup --name myAppServicePlan  --kube-environment <environment-name> --kube-sku ANY
```

## 3. Create an app

The following example creates a Node.js app. Replace <app-name> with a name that's unique within your cluster `TODO: What does that mean?` (valid characters are `a-z`, `0-9`, and `-`). To see all supported runtimes, run [`az webapp list-runtimes --linux`](/cli/azure/webapp). 

```azurecli-interactive
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app-name> --runtime 'NODE|12-lts'
```

`TODO: Currently gets a nasty error, but app does deploy successfully`

## 4. Deploy some code

> [!NOTE]
> `az webapp up` is not supported during the public preview.

Get a simple Node.js app using Git and deploy it using [ZIP deploy](deploy-zip.md).

```azurecli-interactive
git clone https://github.com/Azure-Samples/nodejs-docs-hello-world
cd nodejs-docs-hello-world
zip -r package.zip .
az webapp deployment source config-zip --resource-group myResourceGroup --name myAppServicePlan --src package.zip
```

## 5. Get diagnostic logs using Log Analytics

`TODO: Still need to validate this scenario`

> [!NOTE]
> To use Log Analytics, you should have previously enabled it when [installing the App Service extension](manage-create-arc-environment.md#install-the-app-service-extension).

The application logs for all the apps hosted in your Kubernetes cluster are logged to the Log Analytics workspace, in the custom log table named `AppServiceConsoleLogs_CL`.

You can view the logs by [starting a new empty query in Log Analytics](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-overview#starting-log-analytics), and querying against the AppServiceConsoleLogs_CL table. [This document](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-overview#starting-log-analytics) has information on how to use the Log Analytics interface.

The **Log_s** field contains an application log for a given App Service, and **AppName_s** field contains the App Service name.
In addition to the logs that you write via your application code, the Log_s field also contains container startup and shutdown logs, and Function App host logs.

Here is a sample query that extracts Function App-related fields from the Log_s field, so that you can work with the Function App logs in a structured manner. Further info about parsing data with Kusto can be found [here](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/parse-text).

```
let ST = ago(72h);
let ET = now();
AppServiceConsoleLogs_CL
| where TimeGenerated between (ST .. ET)
| where AppName_s =~ "fakedotnetfuncapp1"
| where Log_s contains "FunctionAppLogs"
| extend logJson = strcat(split(split(Log_s, 'Microsoft.Web/sites/functions/log,FunctionAppLogs,,"')[1], '}"')[0], '}') | extend logJson = replace(@"'", @'"', logJson)
| extend parsedProp = parse_json(logJson)
| project TimeGenerated, AppName_s, parsedProp.category, parsedProp.eventName, parsedProp.functionName, parsedProp.message, parsedProp.category, parsedProp.functionInvocationId, parsedProp.hostInstanceId, parsedProp.level, parsedProp.LevelId
```

Furthr info about working with Kusto queries can be found [here](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/get-started-queries).

## (Optional) Deploy a custom container

To create a custom container app, run [az webapp create](/cli/azure/webapp#az_webapp_create) with `--deployment-container-image-name`. For a private repository add `--docker-registry-server-user` and `--docker-registry-server-password`.

For example, try:

```azurecli-interactive
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app-name> --deployment-container-image-name mcr.microsoft.com/appsvc/node:12-lts
```

`TODO: Currently gets a nasty error, but app does deploy successfully`

To update the image after the app is create, see [Change the Docker image of a custom container](configure-custom-container.md?pivots=container-linux#change-the-docker-image-of-a-custom-container)

## More resources

-[Configure an ASP.NET Core app](https://docs.microsoft.com/en-us/azure/app-service/configure-language-dotnetcore?pivots=platform-linux)
-[Configure a Node.js app](https://docs.microsoft.com/en-us/azure/app-service/configure-language-nodejs?pivots=platform-linux)
-[Configure a PHP app](https://docs.microsoft.com/en-us/azure/app-service/configure-language-php?pivots=platform-linux)
-[Configure a Linux Python app](https://docs.microsoft.com/en-us/azure/app-service/configure-language-python)
-[Configure a Java app](https://docs.microsoft.com/en-us/azure/app-service/configure-language-java?pivots=platform-linux)
-[Configure a Linux Ruby app](https://docs.microsoft.com/en-us/azure/app-service/configure-language-ruby)
-[Configure a custom container](configure-custom-container.md?pivots=container-linux)