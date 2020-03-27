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

1. From the Azure portal menu, or from the Home page, click **Create a resource**.
1. In the search box, enter *Key Vault*.
1. From the results list, choose *Key Vault*.
1. On the Key Vault section, click **Create**.
1. On the **Create key vault** section provide the following information: 
* Name: A unique name
* Subscription: Choose a subscription
* Under Resource Group, choose **Create new** and enter a resource group name.
* In the **Location** pull-down menu, choose a location.
* Leave the other options to their defaults.

After providing the information above, click **Create**.

Take note of the two properties listed below:
* Vault Name: In the example, this is Contoso-Vault2. You will use this name for other steps.
* Vault URI: Applications that use your vault through its REST API must use this URI.

At this point, your Azure account is the only one authorized to perform operations on this new vault.

## Import certificate 
Import certificate – requires a PEM or PFX to be on disk and have a private key.  

Upload your certificate to key vault, then import it to Azure Spring Cloud. For information about importing a certificate, see .

* You must specify: vault name and certificate name (policy is optional)
* PEM/PFX files contains attributes that KV can parse and use to populate the certificate policy. If a certificate policy is already specified, key vault will try to match data from PFX/PEM file.
* Once the import is final, subsequent operations will use new policy with new versions.
* If there are no further operations, the first thing the Key Vault does is send an expiration notice.
* The user can edit the policy, which is functional at the time of import, but where no information was specified at import, such as  no issuer information, it will use default information.

## Create application
Build application in the [Quickstart: Launch an existing Azure Spring Cloud application using the Azure portal](https://review.docs.microsoft.com/azure/spring-cloud/spring-cloud-quickstart-launch-app-portal?branch=master).

## Configure application to use the certificate

Azure Key Vault provides a way to securely store credentials and other secrets, but your code needs to authenticate to key vault to retrieve them. Managed identities for Azure resources overview helps to solve this problem by giving Azure services an automatically managed identity in Azure Active Directory (AD). You can use this identity to authenticate to any service that supports Azure AD authentication, including key vault, without having to display credentials in your code.

In the Azure CLI, to create the identity for this application, run the assign-identity command:

```azurecli
az webapp identity assign --name "<YourAppName>" --resource-group "<YourResourceGroupName>"
```
Replace <YourAppName> with the name of the published app on Azure.

Make a note of the *PrincipalId* when you publish the application to Azure. The output of the command in the step should be in the following format:
```json
{
  "principalId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "type": "SystemAssigned"
}
```
The command in this CLI procedure is the equivalent of going to the Azure portal and switching the Identity/System assigned setting to *On* in the web application properties.

## Add SSL binding 
In the custom domain table, select **Add ssl binding**.

## Test the secure web app

## See also
* [Secure a web server on a Windows virtual machine in Azure with TLS/SSL certificates stored in Key Vault](https://docs.microsoft.com/azure/virtual-machines/windows/tutorial-secure-web-server)
* [About keys, secrets, and certificates](https://docs.microsoft.com/azure/key-vault/about-keys-secrets-and-certificates)
* [What is Azure Key Vault?](https://docs.microsoft.com/azure/key-vault/key-vault-overview)
* [Use Azure Key Vault with an Azure web app in .NET](https://docs.microsoft.com/azure/key-vault/tutorial-net-create-vault-azure-web-app)
* [Import a certificate](https://docs.microsoft.com/azure/key-vault/certificate-scenarios#import-a-certificate)
* [Quickstart: Set and retrieve a secret from Azure Key Vault using the Azure portal](https://docs.microsoft.com/azure/key-vault/quick-create-portal)
* [Manage storage account keys with Key Vault and the Azure CLI](https://docs.microsoft.com/azure/key-vault/key-vault-ovw-storage-keys)
