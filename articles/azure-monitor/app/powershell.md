---
title: Automate Application Insights with PowerShell | Microsoft Docs
description: Automate creating and managing resources, alerts, and availability tests in PowerShell by using an Azure Resource Manager template.
ms.topic: conceptual
ms.date: 09/12/2023
ms.custom: devx-track-azurepowershell, devx-track-arm-template
ms.reviewer: vitalyg
---

# Manage Application Insights resources by using PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

This article shows you how to automate the creation and update of [Application Insights](./app-insights-overview.md) resources automatically by using Azure Resource Manager. You might, for example, do so as part of a build process. Along with the basic Application Insights resource, you can create [availability web tests](./availability-overview.md), set up [alerts](../alerts/alerts-log.md), set the [pricing scheme](../logs/cost-logs.md#application-insights-billing), and create other Azure resources.

The key to creating these resources is JSON templates for [Resource Manager](../../azure-resource-manager/management/manage-resources-powershell.md). The basic procedure is:

- Download the JSON definitions of existing resources.
- Parameterize certain values, such as names.
- Run the template whenever you want to create a new resource.

You can package several resources together to create them all in one go. For example, you can create an app monitor with availability tests, alerts, and storage for continuous export. There are some subtleties to some of the parameterizations, which we'll explain here.

## One-time setup
If you haven't used PowerShell with your Azure subscription before, install the Azure PowerShell module on the machine where you want to run the scripts:

1. Install [Microsoft Web Platform Installer (v5 or higher)](https://www.microsoft.com/web/downloads/platform.aspx).
1. Use it to install Azure PowerShell.

In addition to using Azure Resource Manager templates (ARM templates), there's a rich set of [Application Insights PowerShell cmdlets](/powershell/module/az.applicationinsights). These cmdlets make it easy to configure Application Insights resources programatically. You can use the capabilities enabled by the cmdlets to:

* Create and delete Application Insights resources.
* Get lists of Application Insights resources and their properties.
* Create and manage continuous export.
* Create and manage application keys.
* Set the daily cap.
* Set the pricing plan.

## Create Application Insights resources by using a PowerShell cmdlet

Here's how to create a new Application Insights resource in the Azure East US datacenter by using the [New-AzApplicationInsights](/powershell/module/az.applicationinsights/new-azapplicationinsights) cmdlet:

```PS
New-AzApplicationInsights -ResourceGroupName <resource group> -Name <resource name> -location eastus
```

## Create Application Insights resources by using an ARM template

Here's how to create a new Application Insights resource by using an ARM template.

### Create the ARM template

Create a new .json file. Let's call it `template1.json` in this example. Copy this content into it:

```JSON
    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "appName": {
                "type": "string",
                "metadata": {
                    "description": "Enter the name of your Application Insights resource."
                }
            },
            "appType": {
                "type": "string",
                "defaultValue": "web",
                "allowedValues": [
                    "web",
                    "java",
                    "other"
                ],
                "metadata": {
                    "description": "Enter the type of the monitored application."
                }
            },
            "appLocation": {
                "type": "string",
                "defaultValue": "eastus",
                "metadata": {
                    "description": "Enter the location of your Application Insights resource."
                }
            },
            "retentionInDays": {
                "type": "int",
                "defaultValue": 90,
                "allowedValues": [
                    30,
                    60,
                    90,
                    120,
                    180,
                    270,
                    365,
                    550,
                    730
                ],
                "metadata": {
                    "description": "Data retention in days"
                }
            },
            "ImmediatePurgeDataOn30Days": {
                "type": "bool",
                "defaultValue": false,
                "metadata": {
                    "description": "If set to true when changing retention to 30 days, older data will be immediately deleted. Use this with extreme caution. This only applies when retention is being set to 30 days."
                }
            },
            "priceCode": {
                "type": "int",
                "defaultValue": 1,
                "allowedValues": [
                    1,
                    2
                ],
                "metadata": {
                    "description": "Pricing plan: 1 = Per GB (or legacy Basic plan), 2 = Per Node (legacy Enterprise plan)"
                }
            },
            "dailyQuota": {
                "type": "int",
                "defaultValue": 100,
                "minValue": 1,
                "metadata": {
                    "description": "Enter daily quota in GB."
                }
            },
            "dailyQuotaResetTime": {
                "type": "int",
                "defaultValue": 0,
                "metadata": {
                    "description": "Enter daily quota reset hour in UTC (0 to 23). Values outside the range will get a random reset hour."
                }
            },
            "warningThreshold": {
                "type": "int",
                "defaultValue": 90,
                "minValue": 1,
                "maxValue": 100,
                "metadata": {
                    "description": "Enter the % value of daily quota after which warning mail to be sent. "
                }
            }
        },
        "variables": {
            "priceArray": [
                "Basic",
                "Application Insights Enterprise"
            ],
            "pricePlan": "[take(variables('priceArray'),parameters('priceCode'))]",
            "billingplan": "[concat(parameters('appName'),'/', variables('pricePlan')[0])]"
        },
        "resources": [
            {
                "type": "microsoft.insights/components",
                "kind": "[parameters('appType')]",
                "name": "[parameters('appName')]",
                "apiVersion": "2014-04-01",
                "location": "[parameters('appLocation')]",
                "tags": {},
                "properties": {
                    "ApplicationId": "[parameters('appName')]",
                    "retentionInDays": "[parameters('retentionInDays')]",
                    "ImmediatePurgeDataOn30Days": "[parameters('ImmediatePurgeDataOn30Days')]"
                },
                "dependsOn": []
            },
            {
                "name": "[variables('billingplan')]",
                "type": "microsoft.insights/components/CurrentBillingFeatures",
                "location": "[parameters('appLocation')]",
                "apiVersion": "2015-05-01",
                "dependsOn": [
                    "[resourceId('microsoft.insights/components', parameters('appName'))]"
                ],
                "properties": {
                    "CurrentBillingFeatures": "[variables('pricePlan')]",
                    "DataVolumeCap": {
                        "Cap": "[parameters('dailyQuota')]",
                        "WarningThreshold": "[parameters('warningThreshold')]",
                        "ResetTime": "[parameters('dailyQuotaResetTime')]"
                    }
                }
            }
        ]
    }
```

### Use the ARM template to create a new Application Insights resource

1. In PowerShell, sign in to Azure by using `$Connect-AzAccount`.
1. Set your context to a subscription with `Set-AzContext "<subscription ID>"`.
1. Run a new deployment to create a new Application Insights resource:

    ```PS
        New-AzResourceGroupDeployment -ResourceGroupName Fabrikam `
               -TemplateFile .\template1.json `
               -appName myNewApp

    ``` 

   * `-ResourceGroupName` is the group where you want to create the new resources.
   * `-TemplateFile` must occur before the custom parameters.
   * `-appName` is the name of the resource to create.

You can add other parameters. You'll find their descriptions in the parameters section of the template.

## Get the instrumentation key

After you create an application resource, you'll want the instrumentation key:

1. Sign in to Azure by using `$Connect-AzAccount`.
1. Set your context to a subscription with `Set-AzContext "<subscription ID>"`.
1. Then use:
   1. `$resource = Get-AzResource -Name "<resource name>" -ResourceType "Microsoft.Insights/components"`
   1. `$details = Get-AzResource -ResourceId $resource.ResourceId`
   1. `$details.Properties.InstrumentationKey`

To see a list of many other properties of your Application Insights resource, use:

```PS
Get-AzApplicationInsights -ResourceGroupName Fabrikam -Name FabrikamProd | Format-List
```

More properties are available via the cmdlets:

* `Set-AzApplicationInsightsDailyCap`
* `Set-AzApplicationInsightsPricingPlan`
* `Get-AzApplicationInsightsApiKey`
* `Get-AzApplicationInsightsContinuousExport`

See the [detailed documentation](/powershell/module/az.applicationinsights) for the parameters for these cmdlets.  

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## Set the data retention

You can use the following three methods to programmatically set the data retention on an Application Insights resource.

### Set data retention by using PowerShell commands

Here's a simple set of PowerShell commands to set the data retention for your Application Insights resource:

```PS
$Resource = Get-AzResource -ResourceType Microsoft.Insights/components -ResourceGroupName MyResourceGroupName -ResourceName MyResourceName
$Resource.Properties.RetentionInDays = 365
$Resource | Set-AzResource -Force
```

### Set data retention by using REST

To get the current data retention for your Application Insights resource, you can use the OSS tool [ARMClient](https://github.com/projectkudu/ARMClient). Learn more about ARMClient from articles by [David Ebbo](http://blog.davidebbo.com/2015/01/azure-resource-manager-client.html) and Daniel Bowbyes. Here's an example that uses `ARMClient` to get the current retention:

```PS
armclient GET /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/microsoft.insights/components/MyResourceName?api-version=2018-05-01-preview
```

To set the retention, the command is a similar PUT:

```PS
armclient PUT /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/microsoft.insights/components/MyResourceName?api-version=2018-05-01-preview "{location: 'eastus', properties: {'retentionInDays': 365}}"
```

To set the data retention to 365 days by using the preceding template, run:

```PS
New-AzResourceGroupDeployment -ResourceGroupName "<resource group>" `
       -TemplateFile .\template1.json `
       -retentionInDays 365 `
       -appName myApp
```

### Set data retention by using a PowerShell script

The following script can also be used to change retention. Copy this script to save it as `Set-ApplicationInsightsRetention.ps1`.

```PS
Param(
    [Parameter(Mandatory = $True)]
    [string]$SubscriptionId,

    [Parameter(Mandatory = $True)]
    [string]$ResourceGroupName,

    [Parameter(Mandatory = $True)]
    [string]$Name,

    [Parameter(Mandatory = $True)]
    [string]$RetentionInDays
)
$ErrorActionPreference = 'Stop'
if (-not (Get-Module Az.Accounts)) {
    Import-Module Az.Accounts
}
$azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
if (-not $azProfile.Accounts.Count) {
    Write-Error "Ensure you have logged in before calling this function."    
}
$currentAzureContext = Get-AzContext
$profileClient = New-Object Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient($azProfile)
$token = $profileClient.AcquireAccessToken($currentAzureContext.Tenant.TenantId)
$UserToken = $token.AccessToken
$RequestUri = "https://management.azure.com/subscriptions/$($SubscriptionId)/resourceGroups/$($ResourceGroupName)/providers/Microsoft.Insights/components/$($Name)?api-version=2015-05-01"
$Headers = @{
    "Authorization"         = "Bearer $UserToken"
    "x-ms-client-tenant-id" = $currentAzureContext.Tenant.TenantId
}
## Get Component object via ARM
$GetResponse = Invoke-RestMethod -Method "GET" -Uri $RequestUri -Headers $Headers 

## Update RetentionInDays property
if($($GetResponse.properties | Get-Member "RetentionInDays"))
{
    $GetResponse.properties.RetentionInDays = $RetentionInDays
}
else
{
    $GetResponse.properties | Add-Member -Type NoteProperty -Name "RetentionInDays" -Value $RetentionInDays
}
## Upsert Component object via ARM
$PutResponse = Invoke-RestMethod -Method "PUT" -Uri "$($RequestUri)" -Headers $Headers -Body $($GetResponse | ConvertTo-Json) -ContentType "application/json"
$PutResponse
```

This script can then be used as:

```PS
Set-ApplicationInsightsRetention `
        [-SubscriptionId] <String> `
        [-ResourceGroupName] <String> `
        [-Name] <String> `
        [-RetentionInDays <Int>]
```

## Set the daily cap

To get the daily cap properties, use the [Set-AzApplicationInsightsPricingPlan](/powershell/module/az.applicationinsights/set-azapplicationinsightspricingplan) cmdlet:

```PS
Set-AzApplicationInsightsDailyCap -ResourceGroupName <resource group> -Name <resource name> | Format-List
```

To set the daily cap properties, use the same cmdlet. For instance, to set the cap to 300 GB per day:

```PS
Set-AzApplicationInsightsDailyCap -ResourceGroupName <resource group> -Name <resource name> -DailyCapGB 300
```

You can also use [ARMClient](https://github.com/projectkudu/ARMClient) to get and set daily cap parameters.  To get the current values, use:

```PS
armclient GET /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/microsoft.insights/components/MyResourceName/CurrentBillingFeatures?api-version=2018-05-01-preview
```

## Set the daily cap reset time

To set the daily cap reset time, you can use [ARMClient](https://github.com/projectkudu/ARMClient). Here's an example using `ARMClient` to set the reset time to a new hour. This example shows 12:00 UTC:

```PS
armclient PUT /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/microsoft.insights/components/MyResourceName/CurrentBillingFeatures?api-version=2018-05-01-preview "{'CurrentBillingFeatures':['Basic'],'DataVolumeCap':{'Cap':100,'WarningThreshold':80,'ResetTime':12}}"
```

<a id="price"></a>

## Set the pricing plan

To get the current pricing plan, use the [Set-AzApplicationInsightsPricingPlan](/powershell/module/az.applicationinsights/set-azapplicationinsightspricingplan) cmdlet:

```PS
Set-AzApplicationInsightsPricingPlan -ResourceGroupName <resource group> -Name <resource name> | Format-List
```

To set the pricing plan, use the same cmdlet with the `-PricingPlan` specified:  

```PS
Set-AzApplicationInsightsPricingPlan -ResourceGroupName <resource group> -Name <resource name> -PricingPlan Basic
```

You can also set the pricing plan on an existing Application Insights resource by using the preceding ARM template, omitting the "microsoft.insights/components" resource and the `dependsOn` node from the billing resource. For instance, to set it to the Per GB plan (formerly called the Basic plan), run:

```PS
        New-AzResourceGroupDeployment -ResourceGroupName "<resource group>" `
               -TemplateFile .\template1.json `
               -priceCode 1 `
               -appName myApp
```

The `priceCode` is defined as:

|priceCode|Plan|
|---|---|
|1|Per GB (formerly named the Basic plan)|
|2|Per Node (formerly name the Enterprise plan)|

Finally, you can use [ARMClient](https://github.com/projectkudu/ARMClient) to get and set pricing plans and daily cap parameters. To get the current values, use:

```PS
armclient GET /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/microsoft.insights/components/MyResourceName/CurrentBillingFeatures?api-version=2018-05-01-preview
```

You can set all of these parameters by using:

```PS
armclient PUT /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/microsoft.insights/components/MyResourceName/CurrentBillingFeatures?api-version=2018-05-01-preview
"{'CurrentBillingFeatures':['Basic'],'DataVolumeCap':{'Cap':200,'ResetTime':12,'StopSendNotificationWhenHitCap':true,'WarningThreshold':90,'StopSendNotificationWhenHitThreshold':true}}"
```

This code will set the daily cap to 200 GB per day, configure the daily cap reset time to 12:00 UTC, send emails both when the cap is hit and the warning level is met, and set the warning threshold to 90% of the cap.

## Add a metric alert

To automate the creation of metric alerts, see the [Metric alerts template](../alerts/alerts-metric-create-templates.md#template-for-a-simple-static-threshold-metric-alert) article.

## Add an availability test

To automate availability tests, see the [Metric alerts template](../alerts/alerts-metric-create-templates.md#template-for-an-availability-test-along-with-a-metric-alert) article.

## Add more resources

To automate the creation of any other resource of any kind, create an example manually and then copy and parameterize its code from [Azure Resource Manager](https://resources.azure.com/).

1. Open [Azure Resource Manager](https://resources.azure.com/). Navigate down through `subscriptions/resourceGroups/<your resource group>/providers/Microsoft.Insights/components` to your application resource.

    :::image type="content" source="./media/powershell/01.png" lightbox="./media/powershell/01.png" alt-text="Screenshot that shows navigation in Azure Resource Explorer.":::

    *Components* are the basic Application Insights resources for displaying applications. There are separate resources for the associated alert rules and availability web tests.
1. Copy the JSON of the component into the appropriate place in `template1.json`.
1. Delete these properties:

   * `id`
   * `InstrumentationKey`
   * `CreationDate`
   * `TenantId`
1. Open the `webtests` and `alertrules` sections and copy the JSON for individual items into your template. Don't copy from the `webtests` or `alertrules` nodes. Go into the items under them.

    Each web test has an associated alert rule, so you have to copy both of them.

1. Insert this line in each resource:

    `"apiVersion": "2015-05-01",`

### Parameterize the template
Now you have to replace the specific names with parameters. To [parameterize a template](../../azure-resource-manager/templates/syntax.md), you write expressions using a [set of helper functions](../../azure-resource-manager/templates/template-functions.md).

You can't parameterize only part of a string, so use `concat()` to build strings.

Here are examples of the substitutions you'll want to make. There are several occurrences of each substitution. You might need others in your template. These examples use the parameters and variables we defined at the top of the template.

| Find | Replace with |
| --- | --- |
| `"hidden-link:/subscriptions/.../../components/MyAppName"` |`"[concat('hidden-link:',`<br/>`resourceId('microsoft.insights/components',` <br/> `parameters('appName')))]"` |
| `"/subscriptions/.../../alertrules/myAlertName-myAppName-subsId",` |`"[resourceId('Microsoft.Insights/alertrules', variables('alertRuleName'))]",` |
| `"/subscriptions/.../../webtests/myTestName-myAppName",` |`"[resourceId('Microsoft.Insights/webtests', parameters('webTestName'))]",` |
| `"myWebTest-myAppName"` |`"[variables(testName)]"'` |
| `"myTestName-myAppName-subsId"` |`"[variables('alertRuleName')]"` |
| `"myAppName"` |`"[parameters('appName')]"` |
| `"myappname"` (lower case) |`"[toLower(parameters('appName'))]"` |
| `"<WebTest Name=\"myWebTest\" ...`<br/>`Url=\"http://fabrikam.com/home\" ...>"` |`[concat('<WebTest Name=\"',` <br/> `parameters('webTestName'),` <br/> `'\" ... Url=\"', parameters('Url'),` <br/> `'\"...>')]"`|

### Set dependencies between the resources
Azure should set up the resources in strict order. To make sure one setup completes before the next begins, add dependency lines:

* In the availability test resource:
  
    `"dependsOn": ["[resourceId('Microsoft.Insights/components', parameters('appName'))]"],`
* In the alert resource for an availability test:
  
    `"dependsOn": ["[resourceId('Microsoft.Insights/webtests', variables('testName'))]"],`

## Next steps

See these other automation articles:

* [Create an Application Insights resource](./create-workspace-resource.md)
* [Create web tests](../alerts/resource-manager-alerts-metric.md#availability-test-with-metric-alert).
* [Send Azure Diagnostics to Application Insights](../agents/diagnostics-extension-to-application-insights.md).
* [Create release annotations](annotations.md).
