---
title: "Tutorial - Use custom domain with Azure Spring Cloud"
description: How to map an existing custom DNS name to Azure Spring Cloud
author: MikeDodaro
ms.service: spring-cloud
ms.topic: tutorial
ms.date: 03/19/2020
ms.author: brendm

---
# Map an existing custom DNS name to Azure Spring Cloud
This example imports a certificate from a third-party provider to the key vault and then applies the certificate to a domain.

Transport Layer Security (TLS), also known as Secure Sockets Layer (SSL), certificates encrypt web traffic. These TLS/SSL certificates can be stored in Azure Key Vault, and allow secure deployments of certificates to Windows virtual machines (VMs) in Azure. 

## Prerequisites
* An application deployed to Azure Spring Cloud (see [Quickstart: Launch an existing Azure Spring Cloud application using the Azure portal](spring-cloud-quickstart-launch-app-portal.md), or use an existing app).
* A domain name with access to the DNS registry for domain provider such as GoDaddy.
*  A private certificate from a third-party provider. The certificate must match the domain.

## Create key vault
[Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview) is an service that safeguards cryptographic keys and secrets used by cloud applications and services. It is the storage of choice for Azure Spring Cloud certificates.

1. From the Azure portal menu, or from the Home page, select Create a resource.
1. In the Search box, enter Key Vault.
1. From the results list, choose Key Vault.
1. On the Key Vault section, choose Create.
1. On the Create key vault section provide the following information: 
* Name: A unique name is required. For this quickstart, we use Contoso-vault2.
* Subscription: Choose a subscription.
* Under Resource Group, choose Create new and enter a resource group name.
* In the Location pull-down menu, choose a location.
* Leave the other options to their defaults.
1. After providing the information above, select Create.

Take note of the two properties listed below:
* Vault Name: In the example, this is Contoso-Vault2. You will use this name for other steps.
* Vault URI: Applications that use your vault through its REST API must use this URI.

At this point, your Azure account is the only one authorized to perform operations on this new vault.


## Import certificate 
 Upload your certificate to key vault, then import it to Azure Spring Cloud. For information about importing a certificate, see [Import a certificate
](https://docs.microsoft.com/azure/key-vault/certificate-scenarios#import-a-certificate).

## Create a virtual machine

## Add a certificate to virtual machine from Key Vault

## Configure server to use the certificate

## Add SSL binding 
In the custom domain table, select **Add ssl binding**.

## Test the secure web app

## See also
* [Secure a web server on a Windows virtual machine in Azure with TLS/SSL certificates stored in Key Vault](https://docs.microsoft.com/azure/virtual-machines/windows/tutorial-secure-web-server)
* [About keys, secrets, and certificates](https://docs.microsoft.com/azure/key-vault/about-keys-secrets-and-certificates)
* [What is Azure Key Vault?](https://docs.microsoft.com/azure/key-vault/key-vault-overview)
* [Quickstart: Set and retrieve a secret from Azure Key Vault using the Azure portal](https://docs.microsoft.com/azure/key-vault/quick-create-portal)
* [Manage storage account keys with Key Vault and the Azure CLI](https://docs.microsoft.com/azure/key-vault/key-vault-ovw-storage-keys)
