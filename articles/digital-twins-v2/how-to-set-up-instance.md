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

# Set up an Azure Digital Twins instance

## Introduction

Ok, you just got access to the preview for the new version of Azure Digital Twins. How do you create and set up an Azure Digital Twins instance? 

This how-to will walk you through the basic steps.

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

If you have never created an Azure Digital Twins instance before in your whitelisted subscription, you will need to register the Azure Digital Twins resource provider. This step only has to be done once per subscription.
```bash
 az provider register --namespace 'Microsoft.DigitalTwins'
```

Before we can create an Azure Digital Twins instance, you will need an existing resource group. If you don't have one in your subscription, you can create one with:
```bash
az group create -n <your-rg-name>
```

And now you are ready to create your Azure Digital Twins instance:
```bash
az dt create --name <your-instance-name> -g <your-rg-name>
```

You should  take note of the "hostname" value returned, as you will need this value later.

Before you can use the instance, there is one more step: you need to set up access control for the newly created instance. 

## Assign a role to the instance

Every principal that you want to give access to the Azure Digital Twins instance must have an assigned role for that instance. There are currently two built-in roles ("Admin" or "Owner", and Reader), but you can also create your own custom roles via the IAM blade in the Azure Digital Twins portal page.  

To assign a role for a service principal, Azure CLI for Azure Digital Twins provides a convenience command:
```bash
 az dt rbac assign-role -n <your-instance-name> --role admin -g <your-resource-group> --assignee <service-principal-to-grant-access>
```

Note that the service principal name may not be your actual login name for Azure. If you don't know the principal name, you can find it using, for example:

```bash
az ad user show --displayName <login-name>
```

All set! You now have an Azure Digital Twins instance ready to go.
