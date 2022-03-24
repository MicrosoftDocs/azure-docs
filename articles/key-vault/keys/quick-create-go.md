---
title: Quickstart - Azure Key Vault Go client library - manage keys
description: Learn how to create, retrieve, and delete keys from an Azure key vault using the Go client library
author: Duffney
ms.author: jduffney
ms.date: 02/28/2022
ms.service: key-vault
ms.subservice: keys
ms.topic: quickstart
ms.devlang: golang
---

# Quickstart: Azure Key Vault keys client library for Go

In this quickstart, you'll learn to use the Azure SDK for Go to create, retrieve, update, list, and delete Azure Key Vault keys.

Azure Key Vault is a cloud service that works as a secure secrets store. You can securely store keys, passwords, certificates, and other secrets. For more information on Key Vault, you may review the [Overview](../general/overview.md). 

Follow this guide to learn how to use the [azkeys](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/keyvault/azkeys) package to manage your Azure Key Vault keys using Go.

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- **Go installed**: Version 1.16 or [above](https://go.dev/dl/)
- [Azure CLI](/cli/azure/install-azure-cli)


## Set up your environment

1. Sign into Azure.

    ```azurecli
    az login
    ```

1. Create a new resource group.

    ```azurecli
    az group create --name quickstart-rg --location eastus
    ```

1. Deploy a new key vault instance.

    ```azurecli
    az keyvault create --name <keyVaultName> --resource-group quickstart-rg
    ```

    Replace `<keyVaultName>` with a name that's unique across all of Azure. You typically use your personal or company name along with other numbers and identifiers.

1. Create a new Go module and install packages

    ```azurecli
    go mod init quickstart-keys
    go get -u github.com/Azure/azure-sdk-for-go/sdk/azidentity
    go get -u github.com/Azure/azure-sdk-for-go/sdk/keyvault/azkeys
    ```


## Create the sample code

Create a file named main.go and copy the following code into the file:

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/keyvault/azkeys"
)

func main() {
	keyVaultName := os.Getenv("KEY_VAULT_NAME")
	keyVaultUrl := fmt.Sprintf("https://%s.vault.azure.net/", keyVaultName)

	// create credential
	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		log.Fatalf("failed to obtain a credential: %v", err)
	}

	// create azkeys client
	client, err := azkeys.NewClient(keyVaultUrl, cred, nil)
	if err != nil {
		log.Fatalf("failed to connect to client: %v", err)
	}
	// create RSA Key
	rsaResp, err := client.CreateRSAKey(context.TODO(), "new-rsa-key", &azkeys.CreateRSAKeyOptions{KeySize: to.Int32Ptr(2048)})
	if err != nil {
		log.Fatalf("failed to create rsa key: %v", err)
	}
	fmt.Printf("Key ID: %s: Key Type: %s\n", *rsaResp.Key.ID, *rsaResp.Key.KeyType)

	// create EC Key
	ecResp, err := client.CreateECKey(context.TODO(), "new-ec-key", &azkeys.CreateECKeyOptions{CurveName: azkeys.JSONWebKeyCurveNameP256.ToPtr()})
	if err != nil {
		log.Fatalf("failed to create ec key: %v", err)
	}
	fmt.Printf("Key ID: %s: Key Type: %s\n", *ecResp.Key.ID, *ecResp.Key.KeyType)

	// list all vault keys
	fmt.Println("List all vault keys:")
	pager := client.ListKeys(nil)
	for pager.NextPage(context.TODO()) {
		for _, key := range pager.PageResponse().Keys {
			fmt.Println(*key.KID)
		}
	}

	if pager.Err() != nil {
		panic(pager.Err())
	}

	//update key properties to disable key
	updateResp, err := client.UpdateKeyProperties(context.TODO(), "new-rsa-key", &azkeys.UpdateKeyPropertiesOptions{
		KeyAttributes: &azkeys.KeyAttributes{
			Attributes: azkeys.Attributes{
				Enabled: to.BoolPtr(false),
			},
		},
	})
	if err != nil {
		panic(err)
	}
	fmt.Printf("Key %s Enabled attribute set to: %t\n", *updateResp.Key.ID, *updateResp.Attributes.Enabled)

	// delete rsa key
	delResp, err := client.BeginDeleteKey(context.TODO(), "new-rsa-key", nil)
	if err != nil {
		panic(err)
	}
	pollResp, err := delResp.PollUntilDone(context.TODO(), 1*time.Second)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Successfully deleted key %s", *pollResp.Key.ID)
}
```

## Run the code

Before you run the code, create an environment variable named KEY_VAULT_NAME. Set the environment variable's value to the name of the Azure Key Vault created previously.

```bash
export KEY_VAULT_NAME=quickstart-kv
```

Next, run the following `go run` command to run the app:

```bash
go run main.go
```

```output
Key ID: https://quickstart-kv.vault.azure.net/keys/new-rsa-key4/f78fe1f34b064934bac86cc8c66a75c3: Key Type: RSA
Key ID: https://quickstart-kv.vault.azure.net/keys/new-ec-key2/10e2cec51d1749c0a26aab784808cfaf: Key Type: EC
List all vault keys:
https://quickstart-kv.vault.azure.net/keys/new-ec-key
https://quickstart-kv.vault.azure.net/keys/new-ec-key1
https://quickstart-kv.vault.azure.net/keys/new-ec-key2
https://quickstart-kv.vault.azure.net/keys/new-rsa-key4
Enabled set to: false
Successfully deleted key https://quickstart-kv.vault.azure.net/keys/new-rsa-key4/f78fe1f34b064934bac86cc8c66a75c3
```

> [!NOTE]
> The output is for informational purposes only. Your returns values may vary based on your Azure subscription and Azure Key Vault.

## Code examples

These code examples show how to create, retrieve, list, update key properties, and delete a key from Azure Key Vault.

**Authenticate and create a client**

```go
cred, err := azidentity.NewDefaultAzureCredential(nil)
if err != nil {
    log.Fatalf("failed to obtain a credential: %v", err)
}

client, err := azkeys.NewClient("https://keyVaultName.vault.azure.net/", cred, nil)
if err != nil {
    log.Fatalf("failed to create a client: %v", err)
}
```

If you used a different Key Vault name, replace keyVaultName with your vault's name.

**Create a key**

```go
//RSA Key
resp, err := client.CreateRSAKey(context.TODO(), "new-rsa-key", &azkeys.CreateRSAKeyOptions{KeySize: to.Int32Ptr(2048)})
if err != nil {

}
fmt.Println(*resp.Key.ID)
fmt.Println(*resp.Key.KeyType)

//EC key
resp, err := client.CreateECKey(context.TODO(), "new-ec-key", &azkeys.CreateECKeyOptions{CurveName: azkeys.JSONWebKeyCurveNameP256.ToPtr()})
if err != nil {
  panic(err)
}
fmt.Println(*resp.Key.ID)
fmt.Println(*resp.Key.KeyType)
```

**Get a key**

```go
resp, err := client.GetKey(context.TODO(), "new-rsa-key", nil)
if err != nil {
  panic(err)
}
fmt.Println(*resp.Key.ID)
```

**List all keys**

```go
pager := client.ListKeys(nil)
for pager.NextPage(context.TODO()) {
    for _, key := range pager.PageResponse().Keys {
        fmt.Println(*key.KID)
    }
}

if pager.Err() != nil {
    panic(pager.Err())
}
```

**Update a key properties**

```go
resp, err := client.UpdateKeyProperties(context.TODO(), "new-rsa-key", &azkeys.UpdateKeyPropertiesOptions{
  KeyAttributes: &azkeys.KeyAttributes{
    Attributes: azkeys.Attributes{
      Enabled: to.BoolPtr(false),
    },
  },
})
if err != nil {
  panic(err)
}
fmt.Println(*resp.Attributes.Enabled)
```

**Delete a key**

```go
resp, err := client.BeginDeleteKey(context.TODO(), "new-rsa-key", nil)
if err != nil {
    panic(err)
}
pollResp, err := resp.PollUntilDone(context.TODO(), 1*time.Second)
if err != nil {
    panic(err)
}
fmt.Printf("Successfully deleted key %s", *pollResp.Key.ID)
```


## Clean up resources

Run the following command to delete the resource group and all its remaining resources:

```azurecli
az group delete --resource-group quickstart-rg
```

## Next steps

- [Overview of Azure Key Vault](../general/overview.md)
- [Secure access to a key vault](../general/security-features.md)
- [Azure Key Vault developer's guide](../general/developers-guide.md)
- [Key Vault security overview](../general/security-features.md)
- [Authenticate with Key Vault](../general/authentication.md)
