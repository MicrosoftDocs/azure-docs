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

## Prerequisites
* An application deployed to Azure Spring Cloud (see [Quickstart: Launch an existing Azure Spring Cloud application using the Azure portal](spring-cloud-quickstart-launch-app-portal.md), or use an existing app).
* A domain name with access to the DNS registry for domain provider such as GoDaddy.
*  A private certificate from a third-party provider. The certificate must match the domain.

## Import Certificate 
 Upload your certificate to key vault, then import it to Azure Spring Cloud.  [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-overview) is an service that safeguards cryptographic keys and secrets used by cloud applications and services. It is the storage of choice for Azure Spring Cloud certificates.
 For information about importing a certificate, see [Import a certificate
](https://docs.microsoft.com/azure/key-vault/certificate-scenarios#import-a-certificate).

 ## Add SSL Binding 
In the custom domain table, select **Add ssl binding**.

## See also
* [About keys, secrets, and certificates](https://docs.microsoft.com/azure/key-vault/about-keys-secrets-and-certificates)
* [What is Azure Key Vault?](https://docs.microsoft.com/azure/key-vault/key-vault-overview)
* [Quickstart: Set and retrieve a secret from Azure Key Vault using the Azure portal](https://docs.microsoft.com/en-us/azure/key-vault/quick-create-portal)
* [Manage storage account keys with Key Vault and the Azure CLI](https://docs.microsoft.com/azure/key-vault/key-vault-ovw-storage-keys)
