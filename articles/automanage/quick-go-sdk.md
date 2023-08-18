---
title: Azure Quickstart SDK for Go
description: Create configuration profile assignments using the GO SDK for Automanage.
author: andrsmith
ms.service: automanage
ms.workload: infrastructure
ms.custom: devx-track-go
ms.topic: quickstart
ms.date: 08/24/2022
ms.author: andrsmith
---

# Quickstart: Enable Azure Automanage for virtual machines using GO

Azure Automanage allows users to seamlessly apply Azure best practices to their virtual machines. This quickstart guide will help you apply a Best Practices Configuration profile to an existing virtual machine using the [azure-sdk-for-go repo](https://github.com/Azure/azure-sdk-for-go).

## Prerequisites 

- An active [Azure Subscription](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/)
- An existing [Virtual Machine](../virtual-machines/windows/quick-create-portal.md)

> [!NOTE]
> Free trial accounts do not have access to the virtual machines used in this tutorial. Please upgrade to a Pay-As-You-Go subscription.

> [!IMPORTANT]
> You need to have the **Contributor** role on the resource group containing your VMs to enable Automanage. If you are enabling Automanage for the first time on a subscription, you need the following permissions: **Owner** role or **Contributor** along with **User Access Administrator** roles on your subscription.

## Install required packages 

For this demo, both the **Azure Identity** and **Azure Automanage** packages are required.

```
go get "github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/automanage/armautomanage"
go get "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
```

## Import packages 

Import the **Azure Identity** and **Azure Automanage** packages into the script: 

```go
import (
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/automanage/armautomanage"
)
```

## Authenticate to Azure and create an Automanage client

Use the **Azure Identity** package to authenticate to Azure and then create an Automanage Client:

```go 
credential, err := azidentity.NewDefaultAzureCredential(nil)
configProfilesClient, err := armautomanage.NewConfigurationProfilesClient("<subscription ID>", credential, nil)
```

## Enable best practices configuration profile to an existing virtual machine

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

## Next steps

> [!div class="nextstepaction"]
Learn how to conduct more operations with the GO Automanage Client by visiting the [azure-sdk-for-go repo](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/resourcemanager/automanage/armautomanage/).
