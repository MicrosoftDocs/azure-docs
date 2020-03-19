---
# Mandatory fields.
title: 
titleSuffix: Azure Digital Twins
description: See how to set up an ADT service
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

# Creating an ADT Instance

## Introduction
Ok, you just got access to the preview for the new version of Azure Digital Twins. How do you create and set up an ADT instance? 

This how-to will walk you through the basic steps.

Prerequisites:

* Access to a subscription that is whitelisted with access to ADT
* Access to the [Azure CLI extensions for Digital Twins preview](https://github.com/Azure/azure-digital-twins/tree/private-preview/CLI)

## Preparation

Install the Azure CLI extensions for Azure Digital Twins. The instructions are here:
https://github.com/Azure/azure-digital-twins/tree/private-preview/CLI

## Creating an ADT Instance
To create an ADT instance, open a command prompt or PowerShell window.

First, you need to log in into your Azure account:
```bash
az login
```

Next, set your working subscription to the whitelisted subscription that has access to ADT:
```bash
az account set -s <your-whitelisted-subscription-id>
```
To make life easier, let's set a default location for all resources to be created for the rest of this walk-through:
```bash
az configure --defaults location="West Central US"
```

Before we can create an ADT instance, you will need an existing resource group. If you don't have one in your subscription, you can create one with:
```bash
az group create -n <your-rg-name>
```

And now you are ready to create your ADT instance:
```bash
az dt create --name <your-instance-name> -g <your-rg-name>
```

Before you can use the instance, there is one more step: you need to set up access control for the newly created instance. 

## Assigning a role to the instance
To assign a role, you need the resource id of the ADT instance you have created. If you have not recorded it from the output of the creation copmmand, You can get it by running:
```bash
az dt show --name <your-instance-name> -g <your-rg-name>
```

The output will contain a very long string named "id" that will begin with the letters "/subscriptions/…". Use that string in the command below: 
```bash
az role assignment create --role "Azure Digital Twins Owner (Preview)" --assignee <your-AD-email> --scope <resource-instance-id>
```

You should also take note of the "hostname" value returned by az dt show, as you will need this value later.
All set! You now have an ADT instance ready to go.
