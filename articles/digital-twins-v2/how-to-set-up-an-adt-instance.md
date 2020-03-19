---
# Mandatory fields.
title: Create an Azure Digital Twins instance
titleSuffix: Azure Digital Twins
description: See how to set up an instance of the Azure Digital Twins service.
author: cschorm
ms.author: cschorm # Microsoft employees only
ms.date: 3/17/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Create an Azure Digital Twins instance

## Introduction

Ok, you just got access to the preview for the new version of Azure Digital Twins. How do you create and set up an Azure Digital Twins instance? 

THis how-to will walk you through the basic steps.

Prerequisites:

* Access to a subscription that is whitelisted with access to Azure Digital Twins
* Access to the [Azure CLI extensions for Digital Twins preview](https://github.com/Azure/azure-digital-twins/tree/private-preview/CLI)

## Prepare

Install the Azure CLI extensions for Azure Digital Twins. The instructions are here:
https://github.com/Azure/azure-digital-twins/tree/private-preview/CLI

## Create an Azure Digital Twins instance

To create an Azure Digital Twins instance, open a command prompt or PowerShell window.

First, you need to log in into your Azure account:
```bash
az login
```

Next, set your working subscription to the whitelisted subscription that has access to Azure Digital Twins:
```bash
az account set -s <your-whitelisted-subscription-ID>
```
To make life easier, let's set a default location for all resources to be created for the rest of this walk-through:
```bash
az configure --defaults location="West Central US"
```

Before we can create an Azure Digital Twins instance, you will need an existing resource group. If you don't have one in your subscription, you can create one with:
```bash
az group create -n <your-rg-name>
```

And now you are ready to create your Azure Digital Twins instance:
```bash
az dt create --name <your-instance-name> -g <your-rg-name>
```

Before you can use the instance, there is one more step: you need to set up access control for the newly created instance. 

## Assign a role to the instance

To assign a role, you need the resource ID of the Azure Digital Twins instance you have created. If you have not recorded it from the output of the creation copmmand, You can get it by running:
```bash
az dt show --name <your-instance-name> -g <your-rg-name>
```

The output will contain a very long string named "id" that will begin with the letters "/subscriptions/…". Use that string in the command below: 
```bash
az role assignment create --role "Azure Digital Twins Owner (Preview)" --assignee <your-AAD-email> --scope <resource-instance-ID>
```

You should also take note of the "hostname" value returned by az dt show, as you will need this value later.
All set! You now have an Azure Digital Twins instance ready to go.
