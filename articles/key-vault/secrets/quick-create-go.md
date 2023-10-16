---
title: 'Quickstart: Manage secrets by using the Azure Key Vault Go client library'
description: Learn how to create, retrieve, and delete secrets from an Azure key vault by using the Go client library.
author: Duffney
ms.author: jduffney
ms.date: 12/29/2021
ms.service: key-vault
ms.subservice: secrets
ms.topic: quickstart
ms.devlang: golang
ms.custom: devx-track-go
---

# Quickstart: Manage secrets by using the Azure Key Vault Go client library

In this quickstart, you'll learn how to use the Azure SDK for Go to create, retrieve, list, and delete secrets from an Azure key vault.

You can store a variety of [object types](../general/about-keys-secrets-certificates.md#object-types) in an Azure key vault. When you store secrets in a key vault, you avoid having to store them in your code, which helps improve the security of your applications.

Get started with the [azsecrets](https://aka.ms/azsdk/go/keyvault-secrets/docs) package and learn how to manage your secrets in an Azure key vault by using Go.

## Prerequisites

- An Azure subscription. If you don't already have a subscription, you can [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Go version 1.18 or later](https://go.dev/dl/), installed.
- [The Azure CLI](/cli/azure/install-azure-cli), installed.

## Setup

For purposes of this quickstart, you use the [azidentity](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity) package to authenticate to Azure by using the Azure CLI. To learn about the various authentication methods, see [Azure authentication with the Azure SDK for Go](/azure/developer/go/azure-sdk-authentication).

### Sign in to the Azure portal

1. In the Azure CLI, run the following command:

    ```azurecli-interactive
    az login
    ```

    If the Azure CLI can open your default browser, it will do so on the Azure portal sign-in page.

    If the page doesn't open automatically, go to [https://aka.ms/devicelogin](https://aka.ms/devicelogin), and then enter the authorization code that's displayed in your terminal.

1. Sign in to the Azure portal with your account credentials.

### Create a resource group and key vault instance

Run the following Azure CLI commands:

```azurecli
az group create --name quickstart-rg --location eastus
az keyvault create --name quickstart-kv --resource-group quickstart-rg
```

### Create a new Go module and install packages

Run the following Go commands:

```azurecli
go mod init kvSecrets
go get -u github.com/Azure/azure-sdk-for-go/sdk/keyvault/azsecrets
go get -u github.com/Azure/azure-sdk-for-go/sdk/azidentity
```

## Sample code

Create a file named *main.go*, and then paste the following code into it:

```go
package main

import (
    "context"
    "fmt"
    "log"

    "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    "github.com/Azure/azure-sdk-for-go/sdk/keyvault/azsecrets"
)

func main() {
    mySecretName := "secretName01"
    mySecretValue := "secretValue"
    vaultURI := os.Getenv("AZURE_KEY_VAULT_URI")

    // Create a credential using the NewDefaultAzureCredential type.
    cred, err := azidentity.NewDefaultAzureCredential(nil)
    if err != nil {
        log.Fatalf("failed to obtain a credential: %v", err)
    }

    // Establish a connection to the Key Vault client
    client, err := azsecrets.NewClient(vaultURI, cred, nil)

    // Create a secret
    params := azsecrets.SetSecretParameters{Value: &mySecretValue}
    _, err = client.SetSecret(context.TODO(), mySecretName, params, nil)
    if err != nil {
        log.Fatalf("failed to create a secret: %v", err)
    }

    // Get a secret. An empty string version gets the latest version of the secret.
    version := ""
    resp, err := client.GetSecret(context.TODO(), mySecretName, version, nil)
    if err != nil {
        log.Fatalf("failed to get the secret: %v", err)
    }

    fmt.Printf("secretValue: %s\n", *resp.Value)

    // List secrets
    pager := client.NewListSecretsPager(nil)
    for pager.More() {
        page, err := pager.NextPage(context.TODO())
        if err != nil {
            log.Fatal(err)
        }
        for _, secret := range page.Value {
            fmt.Printf("Secret ID: %s\n", *secret.ID)
        }
    }

    // Delete a secret. DeleteSecret returns when Key Vault has begun deleting the secret.
    // That can take several seconds to complete, so it may be necessary to wait before
    // performing other operations on the deleted secret.
    delResp, err := client.DeleteSecret(context.TODO(), mySecretName, nil)
    if err != nil {
        log.Fatalf("failed to delete secret: %v", err)
    }

    fmt.Println(delResp.ID.Name() + " has been deleted")
}
```

## Run the code

1. Before you run the code, create an environment variable named `KEY_VAULT_NAME`. Set the environment variable value to the name of the key vault that you created previously.

    ```azurecli
    export KEY_VAULT_NAME=quickstart-kv
    ```

1. To start the Go app, run the following command:

    ```azurecli
    go run main.go
    ```

    ```output
    secretValue: createdWithGO
    Secret ID: https://quickstart-kv.vault.azure.net/secrets/quickstart-secret
    Secret ID: https://quickstart-kv.vault.azure.net/secrets/secretName
    quickstart-secret has been deleted
    ```

## Code examples

See the [module documentation](https://aka.ms/azsdk/go/keyvault-secrets/docs) for more examples.

## Clean up resources

Delete the resource group and all its remaining resources by running the following command:

```azurecli
az group delete --resource-group quickstart-rg
```

## Next steps

- [Overview of Azure Key Vault](../general/overview.md)
- [Azure Key Vault developers guide](../general/developers-guide.md)
- [Key Vault security overview](../general/security-features.md)
- [Authenticate with Key Vault](../general/authentication.md)
