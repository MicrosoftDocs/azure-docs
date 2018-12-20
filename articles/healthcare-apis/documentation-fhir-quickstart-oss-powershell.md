---
title: Deploy Open Source FHIR Server using PowerShell
description: Deploy Open Source FHIR Server using PowerShell.
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.topic: quickstart 
ms.date: 02/11/2019.
ms.author: mihansen
---

# Quickstart: Deploy Open Source FHIR Server using PowerShell

In this quickstart, you can deploy the Open Source Microsoft FHIR Server for Azure Using PowerShell.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- Azure Subscription

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

## Clone required repositories and import PowerShell Modules

This tutorial uses a convenience PowerShell module from the Microsoft FHIR Server for Azure [Open Source Repository](https://github.com/Microsoft/fhir-server). To enable that in your Cloud Shell, you will:

1. Open the Azure Cloud Shell (PowerShell)
1. Clone the FHIR Server repository
1. Import the PowerShell module

```azurepowershell-interactive
cd $HOME
git clone https://github.com/Microsoft/fhir-server
cd fhir-server
Import-Module .\samples\scripts\PowerShell\FhirServer\FhirServer.psd1
```

## Create an Azure Active Directory Resource

The FHIR Server uses Azure Active Directory for Authentication. You need an Azure Active Directory resource to for your FHIR Server. You can create it using the FhirServer PowerShell module.

1. Decide on a service name (must be unique)
1. Create Azure Active Directory Resource Application Registration

```azurepowershell-interactive
$fhirServiceName = "myfhirservice"
$apiAppReg = New-FhirServerApiApplicationRegistration -FhirServiceName $fhirServiceName -AppRoles admin,nurse,patient
```

The `-AppRoles` defines a set of roles that can be granted to users or service principals (service accounts) interacting with the FHIR server API. Configuration settings for the FHIR server will determine which privileges (Read, Write, ...) that are associated with each role.

## Create a client application for accessing the FHIR Server

To access the FHIR server from a client, you also need a client AAD Application registration. Here is how to register a client AAD Application for use with [Postman](https://getpostman.com):

```azurepowershell-interactive
$clientAppReg = New-FhirServerClientApplicationRegistration -ApiAppId $apiAppReg.AppId -DisplayName "myfhirclient" -ReplyUrl "https://www.getpostman.com/oauth2/callback"
```

## Deploy FHIR Server

Last step is to create a resource group and deploy the template:

```azurepowershell-interactive
$rg = New-AzureRmResourceGroup -Name "RG-NAME" -Location westus2

New-AzureRmResourceGroupDeployment `
-TemplateUri "https://raw.githubusercontent.com/Microsoft/fhir-server/master/samples/templates/default-azuredeploy.json" `
-ResourceGroupName $rg.ResourceGroupName ` 
-serviceName $fhirServiceName ` 
-securityAuthenticationAuthority $apiAppReg.Authority ` 
-securityAuthenticationAudience $apiAppReg.Audience
```

## Clean up resources

If you're not going to continue to use this application, delete the resource group
with the following steps:

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name $rg.ResourceGroupName
```

## Next steps

Advance to the next article to learn how to create...