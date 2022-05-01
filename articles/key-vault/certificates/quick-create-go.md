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
---

# Quickstart: Azure Key Vault certificate client library for Go

In this quickstart, you'll learn to use the Azure SDK for Go to manage certificates in an Azure Key Vault.

Azure Key Vault is a cloud service that works as a secure secrets store. You can securely store keys, passwords, certificates, and other secrets. For more information on Key Vault, you may review the [Overview](../general/overview.md). 

Follow this guide to learn how to use the [azcertificates](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/keyvault/azcertificates) package to manage your Azure Key Vault certificates using Go.

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
	"time"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/keyvault/azcertificates"
)

var (
	ctx = context.Background()
)

func getClient() *azcertificates.Client {

	keyVaultName := os.Getenv("KEY_VAULT_NAME")
	if keyVaultName == "" {
		panic("KEY_VAULT_NAME environment variable not set")
	}
	keyVaultUrl := fmt.Sprintf("https://%s.vault.azure.net/", keyVaultName)

	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		panic(err)
	}

	client, err := azcertificates.NewClient(keyVaultUrl, cred, nil)
	if err != nil {
		panic(err)
	}
	return client
}

func createCert(client *azcertificates.Client) {
	resp, err := client.BeginCreateCertificate(ctx, "myCertName", azcertificates.CertificatePolicy{
		IssuerParameters: &azcertificates.IssuerParameters{
			Name: to.StringPtr("Self"),
		},
		X509CertificateProperties: &azcertificates.X509CertificateProperties{
			Subject: to.StringPtr("CN=DefaultPolicy"),
		},
	}, nil)
	if err != nil {
		panic(err)
	}

	pollerResp, err := resp.PollUntilDone(ctx, 1*time.Second)
	if err != nil {
		panic(err)
	}
        fmt.Printf("Created certificate with ID: %s\n", *pollerResp.ID)
}

func getCert(client *azcertificates.Client) {
	getResp, err := client.GetCertificate(ctx, "myCertName", nil)
	if err != nil {
		panic(err)
	}
	fmt.Println("Enabled set to:", *getResp.Properties.Enabled)
}

func listCert(client *azcertificates.Client) {
	poller := client.ListCertificates(nil)
	for poller.NextPage(ctx) {
		for _, cert := range poller.PageResponse().Certificates {
			fmt.Println(*cert.ID)
		}
	}
	if poller.Err() != nil {
		panic(poller.Err)
	}
}

func updateCert(client *azcertificates.Client) {
	// disables the certificate, sets an expires date, and add a tag
	_, err := client.UpdateCertificateProperties(ctx, "myCertName", &azcertificates.UpdateCertificatePropertiesOptions{
		Version: "myNewVersion",
		CertificateAttributes: &azcertificates.CertificateProperties{
			Enabled: to.BoolPtr(false),
			Expires: to.TimePtr(time.Now().Add(72 * time.Hour)),
		},
		Tags: map[string]string{"Owner": "SRE"},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("Updated certificate properites: Enabled=false, Expires=72h, Tags=SRE")
}

func deleteCert(client *azcertificates.Client) {
	pollerResp, err := client.BeginDeleteCertificate(ctx, "myCertName", nil)
	if err != nil {
		panic(err)
	}
	finalResp, err := pollerResp.PollUntilDone(ctx, time.Second)
	if err != nil {
		panic(err)
	}
	fmt.Println("Deleted certificate with ID: ", *finalResp.ID)
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

**Authenticate and create a client**

```go
cred, err := azidentity.NewDefaultAzureCredential(nil)
if err != nil {
  panic(err)
}

client, err = azcertificates.NewClient("https://my-key-vault.vault.azure.net/", cred, nil)
if err != nil {
  panic(err)
}
```

**Create a certificate**

```go
resp, err := client.BeginCreateCertificate(context.TODO(), "myCert", azcertificates.CertificatePolicy{
  IssuerParameters: &azcertificates.IssuerParameters{
    Name: to.StringPtr("Self"),
  },
  X509CertificateProperties: &azcertificates.X509CertificateProperties{
    Subject: to.StringPtr("CN=DefaultPolicy"),
  },
}, nil)
if err != nil {
  panic(err)
}

pollerResp, err := resp.PollUntilDone(context.TODO(), 1*time.Second)
if err != nil {
  panic(err)
}
fmt.Println(*pollerResp.ID)
```

**Get a certificate**

```go
getResp, err := client.GetCertificate(context.TODO(), "myCertName", nil)
if err != nil {
  panic(err)
}
fmt.Println(*getResp.ID)

//optionally you can get a specific version
getResp, err = client.GetCertificate(context.TODO(), "myCertName", &azcertificates.GetCertificateOptions{Version: "myCertVersion"})
if err != nil {
  panic(err)
}
```

**List certificates**

```go
poller := client.ListCertificates(nil)
for poller.NextPage(context.TODO()) {
  for _, cert := range poller.PageResponse().Certificates {
    fmt.Println(*cert.ID)
  }
}
if poller.Err() != nil {
  panic(err)
}
```

**Update a certificate**

```go
_, err := client.UpdateCertificateProperties(context.TODO(), "myCertName", &azcertificates.UpdateCertificatePropertiesOptions{
  Version: "myNewVersion",
  CertificateAttributes: &azcertificates.CertificateProperties{
    Enabled: to.BoolPtr(false),
    Expires: to.TimePtr(time.Now().Add(72 * time.Hour)),
  },
  Tags: map[string]string{"Owner": "SRE"},
})
if err != nil {
  panic(err)
}
```

**Delete a certificate**

```go
pollerResp, err := client.BeginDeleteCertificate(context.TODO(), "myCertName", nil)
if err != nil {
  panic(err)
}
finalResp, err := pollerResp.PollUntilDone(context.TODO(), time.Second)
if err != nil {
  panic(err)
}

fmt.Println("Deleted certificate with ID: ", *finalResp.ID)
```


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
