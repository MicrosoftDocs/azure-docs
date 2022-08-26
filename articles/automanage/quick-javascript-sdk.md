---
title: Quickstart - JavaScript SDK
description: Create configuration profile assignments using the JavaScript SDK for Automanage.
author: andrsmith
ms.service: automanage
ms.workload: infrastructure
ms.topic: quickstart
ms.date: 08/24/2022
ms.author: andrsmith
---

# Quickstart: Enable Azure Automanage for virtual machines using JavaScript

Get started creating profile assignments using the [azure-sdk-for-js](https://github.com/Azure/azure-sdk-for-js).

## Prerequisites 

- An active [Azure Subscription](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/)
- An existing [Virtual Machine](/virtual-machines/windows/quick-create-portal)

> [!NOTE]
> Free trial accounts do not have access to the virtual machines used in this tutorial. Please upgrade to a Pay-As-You-Go subscription.

> [!IMPORTANT]
> You need to have the **Contributor** role on the resource group containing your VMs to enable Automanage. If you are enabling Automanage for the first time on a subscription, you need the following permissions: **Owner** role or **Contributor** along with **User Access Administrator** roles on your subscription.

## Install Required Packages 

For this demo, both the **Azure Identity** and **Azure Automanage** packages are required.

```
npm install @azure/arm-automanage
npm install @azure/identity
```

## Import Packages 

Import the **Azure Identity** and **Azure Automanage** packages into the script: 

```javascript
const { AutomanageClient } = require("@azure/arm-automanage");
const { DefaultAzureCredential } = require("@azure/identity");
```

## Authenticate to Azure & Create an Automanage Client

Use the **Azure Identity** package to authenticate to Azure and then create an Automanage Client:

```javascript 
const credential = new DefaultAzureCredential();
const client = new AutomanageClient(credential, "<subscription ID>");
```

## Enable Best Practices Configuration Profile to an Existing Virtual Machine

```javascript 
let assignment = {
    "properties": {
        "configurationProfile": "/providers/Microsoft.Automanage/bestPractices/AzureBestPracticesProduction"
    }
}

// assignment name must be named "default"
await client.configurationProfileAssignments.createOrUpdate("default", "resourceGroupName", "vmName", assignment);
```

## Next Steps

Learn how to conduct more operations with the JavaScript Automanage Client by visiting the [azure-sdk-for-js repo](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/automanage/arm-automanage).

