---
title: Quickstart – Azure Key Vault Python client library – manage secrets
description: Learn how to create, retrieve, and delete secrets from an Azure key vault using the Go client library 
author: Duffney
ms.author: jduffney
ms.date: 12/27/2021
ms.service: key-vault
ms.subservice: secrets
ms.topic: quickstart
ms.devlang: golang
---

# Quickstart: Azure Key Vault secret client library for Go

<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes what the article covers. Answer the 
fundamental “why would I want to know this?” question. Keep it short.
-->

[Add your introductory paragraph]

<!-- 3. Create a free trial account 
Required if a free trial account exists. Include a link to a free trial before the 
first H2, if one exists. You can find listed examples in [Write quickstart]
(contribute-how-to-mvc-quickstart.md)
-->

If you don’t have a <service> subscription, create a free trial account...

<!-- 4. Prerequisites 
Required. First prerequisite is a link to a free trial account if one exists. If there 
are no prerequisites, state that no prerequisites are needed for this quickstart.
-->

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- **Go installed**: Version 1.16 or [above](https://golang.org/dl/)

## Setup

1. Sign into Azure
1. Create a resource group
1. Create an Azure Key Vault instance
1. Install packages

```azurecli
go get -u github.com/Azure/azure-sdk-for-go/sdk/keyvault/azsecrets
go get -u github.com/Azure/azure-sdk-for-go/sdk/azidentity
```


## Code examples

The Azure Key Vault secret package for the Azure SDK for Go allows you to manage secrets. This Code examples section shows how to create a client, set a secret, retrieve a secret, and delete a secret.

### Authenticate and create a client

```go
cred, err := azidentity.NewDefaultAzureCredential(nil)
if err != nil {
    log.Fatalf("failed to obtain a credential: %v", err)
}

client, err := azsecrets.NewClient("https://<keyVaultName>.vault.azure.net/", cred, nil)
if err != nil {
    log.Fatalf("failed to connect to client: %v", err)
}
```

### Create a secret

```go
resp, err := client.SetSecret(context.Background(), "secretName", "secretValue", nil)
if err != nil {
  log.Fatalf("failed to create a secret: %v", err)
}

fmt.Printf("Name: %s, Value: %s\n", *resp.ID, *resp.Value)
```

### Get a secret

```go
getResp, err := client.GetSecret(context.Background(), "secretName", nil)
if err != nil {
  log.Fatalf("failed to get the secret: %v", err)
}

fmt.Printf("secretValue: %s\n", *getResp.Value)
```

### Lists secrets

```go
pager := client.ListSecrets(nil)
for pager.NextPage(context.Background()) {
  resp := pager.PageResponse()
  for _, secret := range resp.Secrets {
    fmt.Printf("Secret ID: %s", *secret.ID)
  }
}

if pager.Err() != nil {
  log.Fatalf("failed to get list secrets: %v", err)
}
```

### Delete a secret

```go
_, err = client.BeginDeleteSecret(context.Background(), mySecretName, nil)
if err != nil {
  log.Fatalf("failed to delete secret: %v", err)
}
```

## Run the code

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

	//Create a credential using the NewDefaultAzureCredential type.
	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		log.Fatalf("failed to obtain a credential: %v", err)
	}

	//Establish a connection to the Key Vault client
	client, err := azsecrets.NewClient("https://"+keyVaultName+".vault.azure.net/", cred, nil)
	if err != nil {
		log.Fatalf("failed to connect to client: %v", err)
	}

	//Create a secret
	//
	_, err = client.SetSecret(context.Background(), mySecretName, mySecretValue, nil)
	if err != nil {
		log.Fatalf("failed to create a secret: %v", err)
	}

	//Get a secret
	resp, err := client.GetSecret(context.Background(), mySecretName, nil)
	if err != nil {
		log.Fatalf("failed to get the secret: %v", err)
	}

	fmt.Printf("secretValue: %s\n", *resp.Value)

	//List secrets
	pager := client.ListSecrets(nil)
	for pager.NextPage(context.Background()) {
		resp := pager.PageResponse()
		for _, secret := range resp.Secrets {
			fmt.Printf("Secret ID: %s\n", *secret.ID)
		}
	}

	if pager.Err() != nil {
		log.Fatalf("failed to get list secrets: %v", err)
	}

	//Delete a secret
	_, err = client.BeginDeleteSecret(context.Background(), mySecretName, nil)
	if err != nil {
		log.Fatalf("failed to delete secret: %v", err)
	}

	fmt.Println(mySecretName + "has been deleted")
}
```

Create environment variable `KEY_VAULT_NAME`.

```azurecli
go mod init azKeyVaultSecrets
go run main.go
```

## Clean up resources

Delete resource group

## Next steps

- [Overview of Azure Key Vault](../general/overview.md)
- [Azure Key Vault developer's guide](../general/developers-guide.md)
- [Key Vault security overview](../general/security-features.md)
- [Authenticate with Key Vault](../general/authentication.md)
