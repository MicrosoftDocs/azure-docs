---
title: Quickstart - GO SDK
description: Create configuration profile assignments using the GO SDK for Automanage.
author: andrsmith
ms.service: automanage
ms.workload: infrastructure
ms.topic: quickstart
ms.date: 08/24/2022
ms.author: andrsmith
---

# Quickstart: Enable Azure Automanage for virtual machines using GO

Get started creating profile assignments using the [azure-sdk-for-go](https://github.com/Azure/azure-sdk-for-go).

## Prerequisites 

- An active [Azure Subscription](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/)
- An existing [Virtual Machine](../virtual-machines/windows/quick-create-portal.md)

> [!NOTE]
> Free trial accounts do not have access to the virtual machines used in this tutorial. Please upgrade to a Pay-As-You-Go subscription.

> [!IMPORTANT]
> You need to have the **Contributor** role on the resource group containing your VMs to enable Automanage. If you are enabling Automanage for the first time on a subscription, you need the following permissions: **Owner** role or **Contributor** along with **User Access Administrator** roles on your subscription.

## Install Required Packages 

For this demo, both the **Azure Identity** and **Azure Automanage** packages are required.

```
go get "github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/automanage/armautomanage"
go get "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
```

## Import Packages 

Import the **Azure Identity** and **Azure Automanage** packages into the script: 

```go
import (
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/automanage/armautomanage"
)
```

## Authenticate to Azure & Create an Automanage Client

Use the **Azure Identity** package to authenticate to Azure and then create an Automanage Client:

```go 
credential, err := azidentity.NewDefaultAzureCredential(nil)
configProfilesClient, err := armautomanage.NewConfigurationProfilesClient("<subscription ID>", credential, nil)
```

## Enable Best Practices Configuration Profile to an Existing Virtual Machine

```go 
configProfileId := "/providers/Microsoft.Automanage/bestPractices/AzureBestPracticesProduction"

properties := armautomanage.ConfigurationProfileAssignmentProperties{
    ConfigurationProfile: &configProfileId,
}

assignment := armautomanage.ConfigurationProfileAssignment{
    Properties: &properties,
}

// assignment name must be 'default'
newAssignment, err = assignmentClient.CreateOrUpdate(context.Background(), "default", "resourceGroupName", "vmName", assignment, nil)
```

## Next Steps

Learn how to conduct more operations with the GO Automanage Client by visiting the [azure-sdk-for-go repo](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/resourcemanager/automanage/armautomanage/).

