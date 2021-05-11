---
title: 'Quickstart: Create a web app on Azure Arc'
description: Get started with App Service on Azure Arc deploying your first web app.
ms.topic: quickstart
ms.date: 05/11/2021
---

# Create an App Service app on Azure Arc (Preview)

In this quickstart, you create an [App Service app to an Azure Arc enabled Kubernetes cluster](overview-arc-integration.md) (Preview). This scenario supports Linux apps only, and you can use a built-in language stack or a custom container.

## Prerequisites

- [Set up your Azure Arc enabled Kubernetes to run App Service](manage-create-arc-environment.md).

## Add Azure CLI extensions

Launch the Bash environment in [Azure Cloud Shell](../cloud-shell/quickstart.md).

[![Launch Cloud Shell in a new window](../../includes/media/cloud-shell-try-it/hdi-launch-cloud-shell.png)](https://shell.azure.com)

Because these CLI commands are not yet part of the core CLI set, add them with the following commands.

```azurecli-interactive
az extension add --upgrade --yes --name customlocation
az extension remove --name appservice-kube
az extension add --yes --source "https://aka.ms/az-appservice-kube/appservice_kube-0.1.13-py2.py3-none-any.whl"
```
`TODO: update app service install command`

## 1. Create a resource group

Run the following command.

```azurecli-interactive
az group create --name myResourceGroup --location eastus 
```

<!-- ## 2. Create an App Service plan

Run the following command and replace `<environment-name>` with the name of the App Service Kubernetes environment (see [Prerequisites](#prerequisites)).

```azurecli-interactive
az appservice plan create --resource-group myResourceGroup --name myAppServicePlan --custom-location <environment-name> --kube-sku K1
``` 

Currently does not work

-->

## 2. Get the custom location

Get the following information about the custom location from your cluster administrator (see [Create a custom location](manage-create-arc-environment.md#create-a-custom-location)).

```azurecli-interactive
customLocationGroup="<resource-group-containing-custom-location>"
customLocationName=<name-of-custom-location>
```

Get the custom location ID for the next step.

```azurecli-interactive
customLocationId=$(az customlocation show \
    --resource-group $customLocationGroup \
    --name $customLocationName \
    --query id \
    --output tsv)
```


## 3. Create an app

The following example creates a Node.js app. Replace `<app-name>` with a name that's unique within your cluster (valid characters are `a-z`, `0-9`, and `-`). To see all supported runtimes, run [`az webapp list-runtimes --linux`](/cli/azure/webapp).

```azurecli-interactive
 az webapp create \
    --resource-group myResourceGroup \
    --name <app-name> \
    --custom-location $customLocationId \
    --runtime 'NODE|12-lts'
```

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

<!-- ## 5. Get diagnostic logs using Log Analytics

`TODO: Still need to validate this scenario`

> [!NOTE]
> To use Log Analytics, you should have previously enabled it when [installing the App Service extension](manage-create-arc-environment.md#install-the-app-service-extension). If you installed the extension without Log Analytics, skip this step.

The application logs for all the apps hosted in your Kubernetes cluster are logged to the Log Analytics workspace, in the custom log table named `AppServiceConsoleLogs_CL`.

You can view the logs by [starting a new empty query in Log Analytics](../azure-monitor/logs/log-analytics-overview.md#starting-log-analytics), and querying against the AppServiceConsoleLogs_CL table.

The **Log_s** field contains an application log for a given App Service, and **AppName_s** field contains the App Service name.
In addition to the logs that you write via your application code, the Log_s field also contains container startup and shutdown logs, and Function App host logs.

Here is a sample query that extracts Function App-related fields from the Log_s field, so that you can work with the Function App logs in a structured manner. Further info about parsing data with Kusto can be found [here](../azure-monitor/logs/parse-text.md).

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

Further info about working with Kusto queries can be found [here](../azure-monitor/logs/get-started-queries.md). -->

## (Optional) Deploy a custom container

To create a custom container app, run [az webapp create](/cli/azure/webapp#az_webapp_create) with `--deployment-container-image-name`. For a private repository add `--docker-registry-server-user` and `--docker-registry-server-password`.

For example, try:

```azurecli-interactive
az webapp create 
    --resource-group myResourceGroup \
    --name <app-name> \
    --custom-location $customLocationId \
    --deployment-container-image-name mcr.microsoft.com/appsvc/node:12-lts
```

`TODO: currently gets an error but the app is successfully created: "Error occurred in request., RetryError: HTTPSConnectionPool(host='management.azure.com', port=443): Max retries exceeded with url: /subscriptions/62f3ac8c-ca8d-407b-abd8-04c5496b2221/resourceGroups/myResourceGroup/providers/Microsoft.Web/sites/cephalin-arctest4/config/appsettings?api-version=2020-12-01 (Caused by ResponseError('too many 500 error responses',))"`

To update the image after the app is create, see [Change the Docker image of a custom container](configure-custom-container.md?pivots=container-linux#change-the-docker-image-of-a-custom-container)

## More resources

- [Configure an ASP.NET Core app](configure-language-dotnetcore.md?pivots=platform-linux)
- [Configure a Node.js app](configure-language-nodejs.md?pivots=platform-linux)
- [Configure a PHP app](configure-language-php.md?pivots=platform-linux)
- [Configure a Linux Python app](configure-language-python.md)
- [Configure a Java app](configure-language-java.md?pivots=platform-linux)
- [Configure a Linux Ruby app](configure-language-ruby.md)
- [Configure a custom container](configure-custom-container.md?pivots=container-linux)