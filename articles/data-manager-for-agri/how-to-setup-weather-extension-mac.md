---
title: Weather extension installation on Mac 
description: Provides guidance to install weather extension on Mac
author: lbethapudi
ms.author: lbethapudi
ms.service: data-manager-for-agri
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 02/14/2023
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Alternate methods for installation of Weather Extension 

If you are facing issues using ARM client or unable to use ARM client because you are a MacBook user, the following options could be used.

## Option1 : PowerShell Script

Pre-requisites for PowerShell script:
* Please install AZ module from [here](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azps-8.0.0&viewFallbackFrom=azps-6.3.0) before executing the below PowerShell script.
* Please download the [InstallFBExtension.ps1](./mac-script/InstallFBExtension.ps1) script. 
* Now Open PowerShell and execute the below command
```azurepowershell-interactive
./InstallFbExtension.ps1 <subscription-id> <resourceGroupName> <farmbeats-resource-name> <extension name - e.g.,'dtn.clearag'>
```

## Option 2: Curl commands and AAD app
If you do not have access to PowerShell, the following steps can be used to install extension:
* Create one AAD app in Azure portal and assign it ```Contributor``` access on the resource group where farmbeats resource is created. Make note of client_id and client_secret.
* Use following curl command to acquire access token for that AAD app. Update all ```<placeholders>``` with appropriate values and execute it in command prompt:
```azurepowershell-interactive
curl --request POST "https://login.microsoftonline.com/<tennantid>/oauth2/v2.0/token" --data-urlencode "scope=https://management.azure.com/.default" --data-urlencode "client_id=<clientid>" --data-urlencode "grant_type=client_credentials" --data-urlencode "client_secret=<clientsecret>"
```
* Use following curl command and replace <placeholders> with appropriate values to install IBM.TWC extension:
```azurepowershell-interactive
curl --request PUT "https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.AgFoodPlatform/farmBeats/<farmBeatsResourceName>/extensions/IBM.TWC?api-version=2021-09-01-preview" -H "Content-Type: application/json" -H "Accept: application/json" -H "Authorization: bearer <bearer_token>" -d "{}" -verbose
```

## Option 3: Custom Templates
* Use the following custom template to install IBM.TWC extension from [Azure Portal](https://ms.portal.azure.com/#create/Microsoft.Template)
```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    
  },
  "resources": [
    {
      "apiVersion": "2021-09-01-preview",
      "name": "<farmbeatsResourceName>/IBM.TWC",
      "type": "Microsoft.AgFoodPlatform/farmbeats/extensions"
    }
  ]
}
```