---
title: Quickstart – Azure Key Vault Go client library - Manage certificates
description: Learn how to create, retrieve, and delete certificates from an Azure key vault using the Go client library
author: Duffney
ms.author: jduffney
ms.date: 02/17/2022
ms.service: key-vault
ms.subservice: certificates
ms.topic: quickstart
ms.devlang: golang
ms.custom: devx-track-go
---

# Quickstart: Azure Key Vault certificate client library for Go

In this quickstart, you'll learn to use the Azure SDK for Go to manage certificates in an Azure Key Vault.

Azure Key Vault is a cloud service that works as a secure secrets store. You can securely store keys, passwords, certificates, and other secrets. For more information on Key Vault, you may review the [Overview](../general/overview.md).

Follow this guide to learn how to use the [azcertificates](https://aka.ms/azsdk/go/keyvault-certificates/docs) package to manage your Azure Key Vault certificates using Go.

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
    az group create --name myResourceGroup  --location eastus
    ```

1. Deploy a new key vault instance.

    ```azurecli
    az keyvault create --name <keyVaultName> --resource-group myResourceGroup
    ```

    Replace `<keyVaultName>` with a name that's unique across all of Azure. You typically use your personal or company name along with other numbers and identifiers.

1. Create a new Go module and install packages

    ```azurecli
    go mod init quickstart-go-kvcerts
    go get github.com/Azure/azure-sdk-for-go/sdk/keyvault/azcertificates
    go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
    ```

## Create the sample code

Create a file named `main.go` and copy the following code into the file:

```go
package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/keyvault/azcertificates"
)

func getClient() *azcertificates.Client {
	keyVaultName := os.Getenv("KEY_VAULT_NAME")
	if keyVaultName == "" {
		log.Fatal("KEY_VAULT_NAME environment variable not set")
	}
	keyVaultUrl := fmt.Sprintf("https://%s.vault.azure.net/", keyVaultName)

	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		log.Fatal(err)
	}

	return azcertificates.NewClient(keyVaultUrl, cred, nil)
}

func createCert(client *azcertificates.Client) {
	params := azcertificates.CreateCertificateParameters{
		CertificatePolicy: &azcertificates.CertificatePolicy{
			IssuerParameters: &azcertificates.IssuerParameters{
				Name: to.Ptr("Self"),
			},
			X509CertificateProperties: &azcertificates.X509CertificateProperties{
				Subject: to.Ptr("CN=DefaultPolicy"),
			},
		},
	}
	resp, err := client.CreateCertificate(context.TODO(), "myCertName", params, nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Requested a new certificate. Operation status: %s\n", *resp.Status)
}

func getCert(client *azcertificates.Client) {
	// an empty string version gets the latest version of the certificate
	version := ""
	getResp, err := client.GetCertificate(context.TODO(), "myCertName", version, nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Enabled set to:", *getResp.Attributes.Enabled)
}

func listCert(client *azcertificates.Client) {
	pager := client.NewListCertificatesPager(nil)
	for pager.More() {
		page, err := pager.NextPage(context.Background())
		if err != nil {
			log.Fatal(err)
		}
		for _, cert := range page.Value {
			fmt.Println(*cert.ID)
		}
	}
}

func updateCert(client *azcertificates.Client) {
	// disables the certificate, sets an expires date, and add a tag
	params := azcertificates.UpdateCertificateParameters{
		CertificateAttributes: &azcertificates.CertificateAttributes{
			Enabled: to.Ptr(false),
			Expires: to.Ptr(time.Now().Add(72 * time.Hour)),
		},
		Tags: map[string]*string{"Owner": to.Ptr("SRE")},
	}
	// an empty string version updates the latest version of the certificate
	version := ""
	_, err := client.UpdateCertificate(context.TODO(), "myCertName", version, params, nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Updated certificate properites: Enabled=false, Expires=72h, Tags=SRE")
}

func deleteCert(client *azcertificates.Client) {
	// DeleteCertificate returns when Key Vault has begun deleting the certificate. That can take several
	// seconds to complete, so it may be necessary to wait before performing other operations on the
	// deleted certificate.
	resp, err := client.DeleteCertificate(context.TODO(), "myCertName", nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Deleted certificate with ID: ", *resp.ID)
}

func main() {
	fmt.Println("Authenticating...")
	client := getClient()

	fmt.Println("Creating a certificate...")
	createCert(client)

	fmt.Println("Getting certificate Enabled property ...")
	getCert(client)

	fmt.Println("Listing certificates...")
	listCert(client)

	fmt.Println("Updating a certificate...")
	updateCert(client)

	fmt.Println("Deleting a certificate...")
	deleteCert(client)
}
```

## Run the code

Before you run the code, create an environment variable named `KEY_VAULT_NAME`. Set the environment variable's value to the name of the Azure Key Vault created previously.

# [Bash](#tab/bash)

```bash
export KEY_VAULT_NAME=<YourKeyVaultName>
```

# [PowerShell](#tab/powershell)

```powershell
$env:KEY_VAULT_NAME=<YourKeyVaultName>
```

---

Next, run the following `go run` command to run the app:

```bash
go run main.go
```

## Code examples

See the [module documentation](https://aka.ms/azsdk/go/keyvault-certificates/docs) for more examples.

## Clean up resources

Run the following command to delete the resource group and all its remaining resources:

```azurecli
az group delete --resource-group myResourceGroup
```

## Next steps

- [Overview of Azure Key Vault](../general/overview.md)
- [Secure access to a key vault](../general/security-features.md)
- [Azure Key Vault developer's guide](../general/developers-guide.md)
- [Key Vault security overview](../general/security-features.md)
- [Authenticate with Key Vault](../general/authentication.md)
