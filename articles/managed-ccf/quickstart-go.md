---
title: Quickstart – Create an Azure Managed CCF resource using the Azure SDK for Go
description: Learn to use the Azure SDK for Go to create an Azure Managed CCF resource
author: msftsettiy
ms.author: settiy
ms.date: 09/11/2023
ms.service: confidential-ledger
ms.topic: quickstart
ms.custom: devx-track-python, mode-api
---

# Quickstart: Create an Azure Managed CCF resource using the Azure SDK for Go

Azure Managed CCF (Managed CCF) is a new and highly secure service for deploying confidential applications. For more information on Managed CCF, see [About Azure Managed Confidential Consortium Framework](overview.md).

In this quickstart, you learn how to create a Managed CCF resource using the Azure SDK for Go library.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[API reference documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/confidentialledger/armconfidentialledger@v1.2.0-beta.1#section-documentation) | [Library source code](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/resourcemanager/confidentialledger/armconfidentialledger) | [Package (Go)](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/confidentialledger/armconfidentialledger@v1.2.0-beta.1)

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Go 1.18 or higher.
- [OpenSSL](https://www.openssl.org/) on a computer running Windows or Linux.

## Setup

### Create a new Go application

1. In a command shell, run the following command to create a folder named `managedccf-app`:

```Bash
mkdir managedccf-app && cd managedccf-app

go mod init github.com/azure/resourcemanager/confidentialledger
```

### Install the modules

1. Install the Azure Confidential Ledger module.

```go
go get -u github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/confidentialledger/armconfidentialledger@v1.2.0-beta.1
```

For this quickstart, you also need to install the [Azure Identity module for Go](/azure/developer/go/azure-sdk-authentication?tabs=bash).

```go
go get -u github.com/Azure/azure-sdk-for-go/sdk/azidentity
```

### Create a resource group

[!INCLUDE [Create resource group](./includes/powershell-resource-group-create.md)]

### Register the resource provider

[!INCLUDE [Register the resource provider](includes/register-provider.md)]

### Create members

[!INCLUDE [Create members](includes/create-member.md)]

## Create the Go application

The management plane library allows operations on Managed CCF resources, such as creation and deletion, listing the resources associated with a subscription, and viewing the details of a specific resource. The following piece of code creates and views the properties of a Managed CCF resource.

Add the following directives to the top of *main.go*:

```go
package main

import (
    "context"
    "log"
    
    "github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
    "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    "github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/confidentialledger/armconfidentialledger"
)
```

### Authenticate and create a client factory

In this quickstart, logged in user is used to authenticate to Azure Managed CCF, which is the preferred method for local development. This example uses ['NewDefaultAzureCredential()'](/azure/developer/go/azure-sdk-authentication?tabs=bash#authenticate-to-azure-with-defaultazurecredential) class from [Azure Identity module](/azure/developer/go/azure-sdk-authentication?tabs=bash), which allows to use the same code across different environments with different options to provide identity.

```go
cred, err := azidentity.NewDefaultAzureCredential(nil)
if err != nil {
    log.Fatalf("Failed to obtain a credential: %v", err)
}
```

Create an Azure Resource Manager client factory and authenticate using the token credential.

```go
ctx := context.Background()
clientFactory, err := armconfidentialledger.NewClientFactory("0000000-0000-0000-0000-000000000001", cred, nil)

if err != nil {
    log.Fatalf("Failed to create client: %v", err)
}
```

### Create a Managed CCF resource

```go
appName := "confidentialbillingapp"
rgName := "myResourceGroup"

// Create a new resource
poller, err := clientFactory.NewManagedCCFClient().BeginCreate(ctx, rgName, appName, armconfidentialledger.ManagedCCF{
    Location: to.Ptr("SouthCentralUS"),
    Tags: map[string]*string{
        "Department": to.Ptr("Contoso IT"),
    },
    Properties: &armconfidentialledger.ManagedCCFProperties{
        DeploymentType: &armconfidentialledger.DeploymentType{
            AppSourceURI:    to.Ptr(""),
            LanguageRuntime: to.Ptr(armconfidentialledger.LanguageRuntimeJS),
        },
        MemberIdentityCertificates: []*armconfidentialledger.MemberIdentityCertificate{
            {
                Certificate:   to.Ptr("-----BEGIN CERTIFICATE-----\nMIIU4G0d7....1ZtULNWo\n-----END CERTIFICATE-----"),
                Encryptionkey: to.Ptr(""),
                Tags: map[string]any{
                    "owner": "IT Admin1",
                },
            }},
        NodeCount: to.Ptr[int32](3),
    },
}, nil)

if err != nil {
    log.Fatalf("Failed to finish the request: %v", err)
}

_, err = poller.PollUntilDone(ctx, nil)

if err != nil {
    log.Fatalf("Failed to pull the result: %v", err)
}
```

### Get the properties of the Managed CCF resource

The following piece of code retrieves the Managed CCF resource created in the previous step.

```go
log.Println("Getting the Managed CCF resource.")

// Get the resource details and print it
getResponse, err := clientFactory.NewManagedCCFClient().Get(ctx, rgName, appName, nil)

if err != nil {
    log.Fatalf("Failed to get details of mccf instance: %v", err)
}

// Print few properties of the Managed CCF resource
log.Println("Application name:", *getResponse.ManagedCCF.Properties.AppName)
log.Println("Node Count:", *getResponse.ManagedCCF.Properties.NodeCount)
```

### List the Managed CCF resources in a Resource Group

The following piece of code retrieves the Managed CCF resources in the resource group.

```go
pager := clientFactory.NewManagedCCFClient().NewListByResourceGroupPager(rgName, nil)

for pager.More() {
    page, err := pager.NextPage(ctx)
    if err != nil {
        log.Fatalf("Failed to advance page: %v", err)
    }

    for _, v := range page.Value {
        log.Println("Application Name:", *v.Name)
    }
}
```

### Delete the Managed CCF resource

The following piece of code deletes the Managed CCF resource. Other Managed CCF articles can build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you might wish to leave these resources in place.

```go
deletePoller, err := clientFactory.NewManagedCCFClient().BeginDelete(ctx, rgName, appName, nil)

if err != nil {
    log.Fatalf("Failed to finish the delete request: %v", err)
}

_, err = deletePoller.PollUntilDone(ctx, nil)

if err != nil {
    log.Fatalf("Failed to get the delete result: %v", err)
}
```

## Clean up resources

Other Managed CCF articles can build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you might wish to leave these resources in place.

Otherwise, when you're finished with the resources created in this article, use the Azure CLI [az group delete](/cli/azure/group?#az-group-delete) command to delete the resource group and all its contained resources.

```azurecli
az group delete --resource-group contoso-rg
```

## Next steps

In this quickstart, you created a Managed CCF resource by using the Azure Python SDK for Confidential Ledger. To learn more about Azure Managed CCF and how to integrate it with your applications, continue on to these articles:

- [Azure Managed CCF overview](overview.md)
- [Quickstart: Deploy an Azure Managed CCF application](quickstart-deploy-application.md)
- [Quickstart: Azure CLI](quickstart-cli.md)
- [How to: Activate members](how-to-activate-members.md)
