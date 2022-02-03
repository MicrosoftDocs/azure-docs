---
title: Quickstart – Azure Key Vault Go client library – manage secrets
description: Learn how to create, retrieve, and delete secrets from an Azure key vault using the Go client library 
author: Duffney
ms.author: jduffney
ms.date: 12/29/2021
ms.service: key-vault
ms.subservice: secrets
ms.topic: quickstart
ms.devlang: golang
---

# Quickstart: Azure Key Vault secret client library for Go

In this quickstart, you'll learn to use the Azure SDK for Go to create, retrieve, list, and delete secrets from Azure Key Vault.

 Azure Key Vault can store [several objects types](/azure/key-vault/general/about-keys-secrets-certificates#object-types). But, this quickstart focuses on secrets. By using Azure Key Vault to store secrets, you avoid storing secrets in your code, which increases the security of your applications. 

Get started with the [azsecrets](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/keyvault/azsecrets) package and learn how to manage Azure Key Vault secrets using Go.

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- **Go installed**: Version 1.16 or [above](https://golang.org/dl/)
- [Azure CLI](/cli/azure/install-azure-cli)

## Setup

This quickstart uses the [azidentity](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity) package to authenticate to Azure using Azure CLI. To learn more about different methods of authentication, see [Azure authentication with the Azure SDK for Go](/azure/developer/go/azure-sdk-authentication).

###  Sign into Azure

1. Run the `az login` command:

    ```azurecli-interactive
    az login
    ```

    If the CLI can open your default browser, it will do so and load an Azure sign-in page.

    Otherwise, open a browser page at [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter the
    authorization code displayed in your terminal.

2. Sign in with your account credentials in the browser.

### Create a resource group and key vault instance

1. Run the following Azure CLI commands:

	```azurecli
	az group create --name quickstart-rg --location eastus
	az keyvault create --name quickstart-kv --resource-group quickstart-rg
	```

### Create a new Go module and install packages

1. Run the following Go commands:

	```azurecli
	go mod init kvSecrets
	go get -u github.com/Azure/azure-sdk-for-go/sdk/keyvault/azsecrets
	go get -u github.com/Azure/azure-sdk-for-go/sdk/azidentity
	```

## Code examples

This Code examples section shows how to create a client, set a secret, retrieve a secret, and delete a secret.

### Authenticate and create a client

```go
cred, err := azidentity.NewDefaultAzureCredential(nil)
if err != nil {
    log.Fatalf("failed to obtain a credential: %v", err)
}

client, err := azsecrets.NewClient("https://quickstart-kv.vault.azure.net/", cred, nil)
if err != nil {
    log.Fatalf("failed to create a client: %v", err)
}
```

If you used a different Key Vault name, replace `quickstart-kv` with your vault's name.

### Create a secret

```go
resp, err := client.SetSecret(context.TODO(), "secretName", "secretValue", nil)
if err != nil {
  log.Fatalf("failed to create a secret: %v", err)
}

fmt.Printf("Name: %s, Value: %s\n", *resp.ID, *resp.Value)
```

### Get a secret

```go
getResp, err := client.GetSecret(context.TODO(), "secretName", nil)
if err != nil {
  log.Fatalf("failed to get the secret: %v", err)
}

fmt.Printf("secretValue: %s\n", *getResp.Value)
```

### Lists secrets

```go
pager := client.ListSecrets(nil)
for pager.NextPage(context.TODO()) {
  resp := pager.PageResponse()
  for _, secret := range resp.Secrets {
    fmt.Printf("Secret ID: %s\n", *secret.ID)
  }
}

if pager.Err() != nil {
  log.Fatalf("failed to get list secrets: %v", err)
}
```

### Delete a secret

```go
respDel, err := client.BeginDeleteSecret(context.TODO(), mySecretName, nil)
_, err = respDel.PollUntilDone(context.TODO(), time.Second)
if err != nil {
	log.Fatalf("failed to delete secret: %v", err)
}
```

## Sample Code

Create a file named `main.go` and copy the following code into the file:

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

    mySecretName  := "quickstart-secret"
    mySecretValue := "createdWithGO"
    keyVaultName  := os.Getenv("KEY_VAULT_NAME")
        keyVaultUrl := fmt.Sprintf("https://%s.vault.azure.net/", keyVaultName)

	//Create a credential using the NewDefaultAzureCredential type.
	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		log.Fatalf("failed to obtain a credential: %v", err)
	}

	//Establish a connection to the Key Vault client
	client, err := azsecrets.NewClient(keyVaultURL, cred, nil)
	if err != nil {
		log.Fatalf("failed to connect to client: %v", err)
	}

	//Create a secret
	_, err = client.SetSecret(context.TODO(), mySecretName, mySecretValue, nil)
	if err != nil {
		log.Fatalf("failed to create a secret: %v", err)
	}

	//Get a secret
	resp, err := client.GetSecret(context.TODO(), mySecretName, nil)
	if err != nil {
		log.Fatalf("failed to get the secret: %v", err)
	}

	fmt.Printf("secretValue: %s\n", *resp.Value)

	//List secrets
	pager := client.ListSecrets(nil)
	for pager.NextPage(context.TODO()) {
		resp := pager.PageResponse()
		for _, secret := range resp.Secrets {
			fmt.Printf("Secret ID: %s\n", *secret.ID)
		}
	}

	if pager.Err() != nil {
		log.Fatalf("failed to get list secrets: %v", err)
	}

	//Delete a secret
	respDel, err := client.BeginDeleteSecret(context.TODO(), mySecretName, nil)
	_, err = respDel.PollUntilDone(context.TODO(), time.Second)
	if err != nil {
		log.Fatalf("failed to delete secret: %v", err)
	}

	fmt.Println(mySecretName + " has been deleted\n")
}
```

## Run the code

Before you run the code, create an environment variable named `KEY_VAULT_NAME`. Set the environment variable's value to the name of the Azure Key Vault created previously.

```azurecli
export KEY_VAULT_NAME=quickstart-kv
```

Run the following `go run` command to run the Go app:

```azurecli
go run main.go
```

```output
secretValue: createdWithGO
Secret ID: https://quickstart-kv.vault.azure.net/secrets/quickstart-secret
Secret ID: https://quickstart-kv.vault.azure.net/secrets/secretName
quickstart-secret has been deleted
```

## Clean up resources

Run the following command to delete the resource group and all its remaining resources:

```azurecli
az group delete --resource-group quickstart-rg
```

## Next steps

- [Overview of Azure Key Vault](../general/overview.md)
- [Azure Key Vault developer's guide](../general/developers-guide.md)
- [Key Vault security overview](../general/security-features.md)
- [Authenticate with Key Vault](../general/authentication.md)
