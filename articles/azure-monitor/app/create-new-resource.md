---
title: Create a new Azure Application Insights resource | Microsoft Docs
description: Manually set up Application Insights monitoring for a new live application.
ms.topic: conceptual
ms.date: 02/10/2021

---

# Create an Application Insights resource

Azure Application Insights displays data about your application in a Microsoft Azure *resource*. Creating a new resource is therefore part of [setting up Application Insights to monitor a new application][start]. After you have created your new resource, you can get its instrumentation key and use that to configure the Application Insights SDK. The instrumentation key links your telemetry to the resource.

> [!IMPORTANT]
> [Classic Application Insights has been deprecated](https://azure.microsoft.com/updates/we-re-retiring-classic-application-insights-on-29-february-2024/). Please follow these [instructions on how upgrade to workspace-based Application Insights](convert-classic-resource.md).

## Sign in to Microsoft Azure

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Create an Application Insights resource

Sign in to the [Azure portal](https://portal.azure.com), and create an Application Insights resource:

![Click the `+` sign in the upper left corner. Select Developer Tools followed by Application Insights](./media/create-new-resource/new-app-insights.png)

   | Settings        |  Value           | Description  |
   | ------------- |:-------------|:-----|
   | **Name**      | `Unique value` | Name that identifies the app you are monitoring. |
   | **Resource Group**     | `myResourceGroup`      | Name for the new or existing resource group to host App Insights data. |
   | **Region** | `East US` | Choose a location near you, or near where your app is hosted. |
   | **Resource Mode** | `Classic` or `Workspace-based` | Workspace-based resources allow you to send your Application Insights telemetry to a common Log Analytics workspace. For more information, see the [article on workspace-based resources](create-workspace-resource.md).

> [!NOTE]
> While you can use the same resource name across different resource groups, it can be beneficial to use a globally unique name. This can be useful if you plan to [perform cross resource queries](../logs/cross-workspace-query.md#identifying-an-application) as it simplifies the required syntax.

Enter the appropriate values into the required fields, and then select **Review + create**.

> [!div class="mx-imgBorder"]
> ![Enter values into required fields, and then select "review + create".](./media/create-new-resource/review-create.png)

When your app has been created, a new pane opens. This pane is where you see performance and usage data about your monitored application. 

## Copy the instrumentation key

The instrumentation key identifies the resource that you want to associate your telemetry data with. You will need to copy the instrumentation key and add it to your application's code.

> [!IMPORTANT]
> New Azure regions **require** the use of connection strings instead of instrumentation keys. [Connection string](./sdk-connection-string.md?tabs=net) identifies the resource that you want to associate your telemetry data with. It also allows you to modify the endpoints your resource will use as a destination for your telemetry. You will need to copy the connection string and add it to your application's code or to an environment variable.

## Install the SDK in your app

Install the Application Insights SDK in your app. This step depends heavily on the type of your application.

Use the instrumentation key to configure [the SDK that you install in your application][start].

The SDK includes standard modules that send telemetry without you having to write any additional code. To track user actions or diagnose issues in more detail, [use the API][api] to send your own telemetry.

## Creating a resource automatically

### PowerShell

Create a new Application Insights resource

```powershell
New-AzApplicationInsights [-ResourceGroupName] <String> [-Name] <String> [-Location] <String> [-Kind <String>]
 [-Tag <Hashtable>] [-DefaultProfile <IAzureContextContainer>] [-WhatIf] [-Confirm] [<CommonParameters>]
```

#### Example

```powershell
New-AzApplicationInsights -Kind java -ResourceGroupName testgroup -Name test1027 -location eastus
```
#### Results

```powershell
Id                 : /subscriptions/{subid}/resourceGroups/testgroup/providers/microsoft.insights/components/test1027
ResourceGroupName  : testgroup
Name               : test1027
Kind               : web
Location           : eastus
Type               : microsoft.insights/components
AppId              : 8323fb13-32aa-46af-b467-8355cf4f8f98
ApplicationType    : web
Tags               : {}
CreationDate       : 10/27/2017 4:56:40 PM
FlowType           :
HockeyAppId        :
HockeyAppToken     :
InstrumentationKey : 00000000-aaaa-bbbb-cccc-dddddddddddd
ProvisioningState  : Succeeded
RequestSource      : AzurePowerShell
SamplingPercentage :
TenantId           : {subid}
```

For the full PowerShell documentation for this cmdlet, and to learn how to retrieve the instrumentation key consult the [Azure PowerShell documentation](/powershell/module/az.applicationinsights/new-azapplicationinsights).

### Azure CLI (preview)

To access the preview Application Insights Azure CLI commands, you first need to run:

```azurecli
 az extension add -n application-insights
```

If you don't run the `az extension add` command, you will see an error message that states: `az : ERROR: az monitor: 'app-insights' is not in the 'az monitor' command group. See 'az monitor --help'.`

Now you can run the following to create your Application Insights resource:

```azurecli
az monitor app-insights component create --app
                                         --location
                                         --resource-group
                                         [--application-type]
                                         [--kind]
                                         [--tags]
```

#### Example

```azurecli
az monitor app-insights component create --app demoApp --location westus2 --kind web -g demoRg --application-type web
```

#### Results

```azurecli
az monitor app-insights component create --app demoApp --location eastus --kind web -g demoApp  --application-type web
{
  "appId": "87ba512c-e8c9-48d7-b6eb-118d4aee2697",
  "applicationId": "demoApp",
  "applicationType": "web",
  "creationDate": "2019-08-16T18:15:59.740014+00:00",
  "etag": "\"0300edb9-0000-0100-0000-5d56f2e00000\"",
  "flowType": "Bluefield",
  "hockeyAppId": null,
  "hockeyAppToken": null,
  "id": "/subscriptions/{subid}/resourceGroups/demoApp/providers/microsoft.insights/components/demoApp",
  "instrumentationKey": "00000000-aaaa-bbbb-cccc-dddddddddddd",
  "kind": "web",
  "location": "eastus",
  "name": "demoApp",
  "provisioningState": "Succeeded",
  "requestSource": "rest",
  "resourceGroup": "demoApp",
  "samplingPercentage": null,
  "tags": {},
  "tenantId": {tenantID},
  "type": "microsoft.insights/components"
}
```

For the full Azure CLI documentation for this command, and to learn how to retrieve the instrumentation key consult the [Azure CLI documentation](/cli/azure/ext/application-insights/monitor/app-insights/component#ext-application-insights-az-monitor-app-insights-component-create).

## Next steps
* [Diagnostic Search](./diagnostic-search.md)
* [Explore metrics](../essentials/metrics-charts.md)
* [Write Analytics queries](../logs/log-query-overview.md)

<!--Link references-->

[api]: ./api-custom-events-metrics.md
[diagnostic]: ./diagnostic-search.md
[metrics]: ../essentials/metrics-charts.md
[start]: ./app-insights-overview.md

