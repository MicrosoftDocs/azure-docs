<properties 
	pageTitle="PowerShell script to create an Application Insights resource" 
	description="Automate creation of Application Insights resources." 
	services="application-insights" 
    documentationCenter="windows"
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/12/2015" 
	ms.author="awills"/>

#  PowerShell script to create an Application Insights resource

*Application Insights is in preview.*

When you want to monitor a new application - or a new version of an application - with [Visual Studio Application Insights](https://azure.microsoft.com/services/application-insights/), you set up a new resource in Microsoft Azure. This resource is where the telemetry data from your app is analyzed and displayed. 

You can automate the creation of a new resource by using PowerShell.

For example, if you are developing a mobile device app, it's likely that, at any time, there will be several published versions of your app in use by your customers. You don't want to get the telemetry results from different versions mixed up. So you get your build process to create a new resource for each build.

## Script to create an Application Insights resource

*Output*

* App Insights Name =  erimattestapp
* IKey =  00000000-0000-0000-0000-000000000000

*PowerShell Script*  

```PowerShell

cls


##################################################################
# Set Values
##################################################################

#If running manually, comment this out before the first execution to login to the Azure Portal
#Add-AzureAccount

#Set the name of the Application Insights Resource
$appInsightsName = "TestApp"

#Set the application name used for the value of the Tag "AppInsightsApp" - http://azure.microsoft.com/documentation/articles/azure-preview-portal-using-tags/
$applicationTagName = "MyApp"

#Set the name of the Resource Group to use.  By default will use the application name as a starter
$resourceGroupName = "MyAppResourceGroup"

##################################################################
# Create the Resource and Output the name and iKey
##################################################################
#Set the script to Resource Manager - http://azure.microsoft.com/documentation/articles/powershell-azure-resource-manager/
Switch-AzureMode AzureResourceManager

#Select the azure subscription
Select-AzureSubscription -SubscriptionName "MySubscription"

#Create the App Insights Resource
$resource = New-AzureResource -Name $appInsightsName -ResourceGroupName $resourceGroupName -Tag @{ Name = "AppInsightsApp"; Value = $applicationTagName} -ResourceType "Microsoft.Insights/Components" -Location "Central US" -ApiVersion "2014-08-01"

#Give team owner access - http://azure.microsoft.com/documentation/articles/role-based-access-control-powershell/
New-AzureRoleAssignment -Mail "myTeam@fabrikam.com" -RoleDefinitionName Owner -Scope $resource.ResourceId | Out-Null

#Display iKey
Write-Host "App Insights Name = " $resource.Properties["Name"]
Write-Host "IKey = " $resource.Properties["InstrumentationKey"]

```

## What to do with the iKey

Each resource is identified by its instrumentation key (iKey). The iKey is an output of the resource creation script. Your build script should provide the iKey to the Application Insights SDK embedded in your app.

There are two ways to make the iKey available to the SDK:
  
* In [ApplicationInsights.config](app-insights-configuration-with-applicationinsights-config.md): 
 * `<instrumentationkey>`*ikey*`</instrumentationkey>`
* Or in [initialization code](app-insights-api-custom-events-metrics.md): 
 * `Microsoft.ApplicationInsights.Extensibility.
    TelemetryConfiguration.Active.InstrumentationKey = "`*iKey*`";`





 