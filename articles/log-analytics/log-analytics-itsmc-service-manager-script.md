---
title: Automated script to create Service Manager Web app to connect with IT Service Management connector in OMS | Microsoft Docs
description: Create a Service Manager Web app using an automated script to connect with IT Service Management Connector in OMS, and centrally monitor and manage the ITSM work items.  
services: log-analytics
documentationcenter: ''
author: JYOTHIRMAISURI
manager: riyazp
editor: ''
ms.assetid: 879e819f-d880-41c8-9775-a30907e42059
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/27/2017
ms.author: v-jysur

---

# Create Service Manager Web app using the automated script (Preview)

Use the following script to create the Web app for your Service Manager instance. More information about Service Manager connection is here: [Service Manager Web app](log-analytics-itsmc-connections.md#create-and-deploy-service-manager-web-app-service)

Run the script by providing the following required details:

- Azure subscription details
- Resource group name
- Location
- Service Manager server details (server name,    domain, username and password)
- URL for deployment
- Site name for your Web app
- Biz talk service name.

The script will create the Web app using the name that you specified (along with few additional strings to make it unique). It generates the **Web app URL**, **client ID** and **client secret**.

Save these values, you will need these when you create a connection with IT Service Management Connector.

## Prerequisites

 Windows Management Framework 5.0 or above.
 Windows 10 has 5.1 by default. You can download the framework from [here](https://www.microsoft.com/download/details.aspx?id=53347):

Use the following script:

```
###################################

# User Configuration Section Begins
####################################

# Subscription name in Azure account. Check in Azure Portal.
$azureSubscriptionName = ""

# Resource group name for resource deployment. Could be an existing resource group or a new one to be created.
$resourceGroupName = ""

# Location for Resource group deployment
################################### List of available regions #################################################
# centralus,eastasia,southeastasia,eastus,eastus2,westus,westus2,northcentralus,southcentralus,westcentralus,
# northeurope,westeurope,japaneast,japanwest,brazilsouth,australiasoutheast,australiaeast,westindia,southindia,
# centralindia,canadacentral,canadaeast,uksouth,ukwest.
###############################################################################################################
$location = ""

# Service Manager Authentication Settings
$serverName = ""
$domain = ""
$username = ""
$password = ""


# Site Name Prefix. Default is "smoc". It can be configured to any desired value.
$siteNamePrefix = ""

# BizTalk Service Name. Please provide an already existing biz talk service name. If it doesn't exist, a new one with that name will be created.
$serviceName = ""

##################################
# User Configuration Section Ends
##################################

################
# Installations
################

# Allowing the execution of the script for current user.  
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser -Force

Write-Host "Checking for required modules..."
if(!(Get-PackageProvider -Name NuGet))
{
   Write-Host "Installing NuGet Package Provider..."
   Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Scope CurrentUser -Force -WarningAction SilentlyContinue
}
$module = Get-Module -ListAvailable -Name AzureRM
if(!$module -or ($module.Version.Major -lt 3))
{
    Write-Host "Installing AzureRm Module..."  
    try
    {
        # In case of Win 10 Anniversary update
        Install-Module AzureRM -MinimumVersion 3.3.0 -Scope CurrentUser -Force -WarningAction SilentlyContinue -AllowClobber
    }
    catch
    {
        Install-Module AzureRM -MinimumVersion 3.3.0 -Scope CurrentUser -Force -WarningAction SilentlyContinue
    }

}

Write-Host "Requirement check complete!!"

#############
# Parameters
#############

$errorActionPreference = "Stop"

$templateUri = "https://raw.githubusercontent.com/SystemCenterServiceManager/SMOMSConnector/master/azuredeploy.json"

if(!$siteNamePrefix)
{
    $siteNamePrefix = "smoc"
}

Add-AzureRmAccount

$context = Set-AzureRmContext -SubscriptionName $azureSubscriptionName -WarningAction SilentlyContinue
do
{
    $rand = Get-Random -Maximum 32000

    $siteName = $siteNamePrefix + $rand

    $resource = Find-AzureRmResource -ResourceNameContains $siteName -ResourceType Microsoft.Web/sites

}while($resource)

$azureSite = "https://"+$siteName+".azurewebsites.net"

##############
# MAIN Begins
##############

# Web App Deployment
####################

$tenant = $context.Tenant.TenantId

try
{
    Get-AzureRmResourceGroup -Name $resourceGroupName
}
catch
{
    New-AzureRmResourceGroup -Location $location -Name $resourceGroupName
}

Write-Output "Web App Deployment in progress...."

New-AzureRmResourceGroupDeployment -TemplateUri $templateUri -siteName $siteName -ResourceGroupName $resourceGroupName

Write-Output "Web App Deployed successfully!!"

# AAD Authentication
####################

Add-Type -AssemblyName System.Web

$clientSecret = [System.Web.Security.Membership]::GeneratePassword(30,2).ToString()

try
{

    Write-Host "Creating AzureAD application..."

    $adApp = New-AzureRmADApplication -DisplayName $siteName -HomePage $azureSite -IdentifierUris $azureSite -Password $clientSecret

    Write-Host "AzureAD application created succesfully!!"
}
catch
{
    # Delete the deployed web app if Azure AD application fails
    Remove-AzureRmResource -ResourceGroupName $resourceGroupName -ResourceName $siteName -ResourceType Microsoft.Web/sites -Force

    Write-Host "Faiure occured in Azure AD application....Try again!!"

    exit

}

$clientId = $adApp.ApplicationId

$servicePrincipal = New-AzureRmADServicePrincipal -ApplicationId $clientId

# Web App Configuration
#######################

Write-Host "Configuring deployed Web-App..."
$webApp = Get-AzureRMWebAppSlot -ResourceGroupName $resourceGroupName -Name $siteName -Slot production -WarningAction SilentlyContinue

$appSettingList = $webApp.SiteConfig.AppSettings

$appSettings = @{}
ForEach ($item in $appSettingList) {
    $appSettings[$item.Name] = $item.Value
}
$appSettings['ida:Tenant'] = $tenant
$appSettings['ida:Audience'] = $azureSite
$appSettings['ida:ServerName'] = $serverName
$appSettings['ida:Domain'] = $domain
$appSettings['ida:Username'] = $userName

$connStrings = @{}
$kvp = @{"Type"="Custom"; "Value"=$password}
$connStrings['ida:Password'] = $kvp

Set-AzureRMWebAppSlot -ResourceGroupName $resourceGroupName -Name $siteName -AppSettings $appSettings -ConnectionStrings $connStrings -Slot production -WarningAction SilentlyContinue

# Biz Talk Service
###################

if(!$serviceName)
{
    $serviceName = "ITSMbiz"
}
$resource = Find-AzureRmResource -ResourceNameContains $serviceName -ResourceType Microsoft.BizTalkServices/BizTalk

if(!$resource)
{
    $properties = @{
                    "sku"= @{
                                                "name" = "Free"
                                                "unitCount" = 1
        }
    }
    try
    {
        New-AzureRmResource -ResourceName $serviceName -Location "West US" -PropertyObject $properties -ResourceGroupName $resourceGroupName -ResourceType Microsoft.BizTalkServices/BizTalk -ApiVersion 2014-04-01-preview -Force
    }
    catch
    {
        "Creation of BizTalk Service failed...Please create it manually from Azure Portal.`n"
    }

}

Write-Host "Note: Please Configure Hybrid connection in the Networking section of the application in Azure Portal to link to the on-premises system.`n"
Write-Host "App Details"
Write-Host "============"
Write-Host "App Name:"  $siteName
Write-Host "Client Id:"  $clientId
Write-Host "Client Secret:"  $clientSecret
Write-Host "URI:"  $azureSite

```
## Next steps
[Configure the Hybrid connection](log-analytics-itsmc-connections.md#configure-the-hybrid-connection).
