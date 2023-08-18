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
ms.custom: devx-track-go
---

# Quickstart: Azure Key Vault keys client library for Go

In this quickstart, you'll learn to use the Azure SDK for Go to create, retrieve, update, list, and delete Azure Key Vault keys.

Azure Key Vault is a cloud service that works as a secure secrets store. You can securely store keys, passwords, certificates, and other secrets. For more information on Key Vault, you may review the [Overview](../general/overview.md).

Follow this guide to learn how to use the [azkeys](https://aka.ms/azsdk/go/keyvault-keys/docs) package to manage your Azure Key Vault keys using Go.

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- **Go installed**: Version 1.18 or [above](https://go.dev/dl/)
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
	client := azkeys.NewClient(keyVaultUrl, cred, nil)

	// create RSA Key
	rsaKeyParams := azkeys.CreateKeyParameters{
		Kty:     to.Ptr(azkeys.JSONWebKeyTypeRSA),
		KeySize: to.Ptr(int32(2048)),
	}
	rsaResp, err := client.CreateKey(context.TODO(), "new-rsa-key", rsaKeyParams, nil)
	if err != nil {
		log.Fatalf("failed to create rsa key: %v", err)
	}
	fmt.Printf("New RSA key ID: %s\n", *rsaResp.Key.KID)

	// create EC Key
	ecKeyParams := azkeys.CreateKeyParameters{
		Kty:   to.Ptr(azkeys.JSONWebKeyTypeEC),
		Curve: to.Ptr(azkeys.JSONWebKeyCurveNameP256),
	}
	ecResp, err := client.CreateKey(context.TODO(), "new-ec-key", ecKeyParams, nil)
	if err != nil {
		log.Fatalf("failed to create ec key: %v", err)
	}
	fmt.Printf("New EC key ID: %s\n", *ecResp.Key.KID)

	// list all vault keys
	fmt.Println("List all vault keys:")
	pager := client.NewListKeysPager(nil)
	for pager.More() {
		page, err := pager.NextPage(context.TODO())
		if err != nil {
			log.Fatal(err)
		}
		for _, key := range page.Value {
			fmt.Println(*key.KID)
		}
	}

	// update key properties to disable key
	updateParams := azkeys.UpdateKeyParameters{
		KeyAttributes: &azkeys.KeyAttributes{
			Enabled: to.Ptr(false),
		},
	}
	// an empty string version updates the latest version of the key
	version := ""
	updateResp, err := client.UpdateKey(context.TODO(), "new-rsa-key", version, updateParams, nil)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Key %s Enabled attribute set to: %t\n", *updateResp.Key.KID, *updateResp.Attributes.Enabled)

	// delete the created keys
	for _, keyName := range []string{"new-rsa-key", "new-ec-key"} {
		// DeleteKey returns when Key Vault has begun deleting the key. That can take several
		// seconds to complete, so it may be necessary to wait before performing other operations
		// on the deleted key.
		delResp, err := client.DeleteKey(context.TODO(), keyName, nil)
		if err != nil {
			panic(err)
		}
		fmt.Printf("Successfully deleted key %s", *delResp.Key.KID)
	}
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
> The output is for informational purposes only. Your return values may vary based on your Azure subscription and Azure Key Vault.

## Code examples

See the [module documentation](https://aka.ms/azsdk/go/keyvault-keys/docs) for more examples.

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
