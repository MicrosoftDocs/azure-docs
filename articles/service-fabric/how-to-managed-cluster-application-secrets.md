---
title: Deploy application secrets to a Service Fabric managed cluster
description: Learn about Azure Service Fabric application secrets and how to deploy them to a managed cluster
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Deploy application secrets to a Service Fabric managed cluster

Secrets can be any sensitive information, such as storage connection strings, passwords, or other values that should not be handled in plain text. We recommend using Azure Key Vault to manage keys and secrets for Service Fabric managed clusters and leverage it for this article. However, *using* secrets in an application is cloud platform-agnostic to allow applications to be deployed to a cluster hosted anywhere.

The recommended way to manage service configuration settings is through [service configuration packages][config-package]. Configuration packages are versioned and updatable through managed rolling upgrades with health-validation and auto rollback. This is preferred to global configuration as it reduces the chances of a global service outage. Encrypted secrets are no exception. Service Fabric has built-in features for encrypting and decrypting values in a configuration package Settings.xml file using certificate encryption.

The following diagram illustrates the basic flow for secret management in a Service Fabric application:

![secret management overview][overview]

There are four main steps in this flow:

1. Obtain a data encipherment certificate.
2. Install the certificate in your cluster.
3. Encrypt secret values when deploying an application with the certificate and inject them into a service's Settings.xml configuration file.
4. Read encrypted values out of Settings.xml by decrypting with the same encipherment certificate. 

[Azure Key Vault][key-vault-get-started] is used here as a safe storage location for certificates and as a way to get certificates installed on the Service Fabric managed cluster nodes in Azure.

For an example on how to implement applications secrets, see [Manage application secrets](service-fabric-application-secret-management.md).

Alternatively, we also support [KeyVaultReference](service-fabric-keyvault-references.md). Service Fabric KeyVaultReference support makes it easy to deploy secrets to your applications simply by referencing the URL of the secret that is stored in Key Vault

## Create a data encipherment certificate
To create your own key vault and setup certificates, follow the instructions from Azure Key Vault by using the [Azure CLI, PowerShell, Portal, and more][key-vault-certs].

>[!NOTE]
> The key vault must be [enabled for template deployment](../key-vault/general/manage-with-cli2.md#setting-key-vault-advanced-access-policies) to allow the compute resource provider to get certificates from it and install it on cluster nodes.

## Install the certificate in your cluster
This certificate must be installed on each node in the cluster and Service Fabric managed clusters helps make this easy. The managed cluster service can push version-specific secrets to the nodes to help install secrets that won't change often like installing a private root CA to the nodes. For most production workloads we suggest using [KeyVault extension][key-vault-windows]. The Key Vault VM extension provides automatic refresh of certificates stored in an Azure key vault vs a static version.

For managed clusters you'll need three values, two from Azure Key Vault, and one you decide on for the local store name on the nodes.

Parameters: 
* `Source Vault`: This is the 
    * e.g.:  /subscriptions/{subscriptionid}/resourceGroups/myrg1/providers/Microsoft.KeyVault/vaults/mykeyvault1
* `Certificate URL`: This is the full object identifier and is case-insensitive and immutable
    * https://mykeyvault1.vault.azure.net/secrets/{secretname}/{secret-version}
* `Certificate Store`: This is the local certificate store on the nodes where the cert will be placed
    * certificate store name on the nodes, e.g.: "MY"

Service Fabric managed clusters supports two methods for adding version-specific secrets to your nodes.

1. Portal during the initial cluster creation only
Insert values from above in to this area:

![portal secrets input][sfmc-secrets]

2. Azure Resource Manager during create or anytime

```json
{
  "apiVersion": "2021-05-01",
  "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
  "properties": {
    "vmSecrets": [
      {
        "sourceVault": {
          "id": "/subscriptions/{subscriptionid}/resourceGroups/myrg1/providers/Microsoft.KeyVault/vaults/mykeyvault1"
        },
        "vaultCertificates": [
          {
            "certificateStore": "MY",
            "certificateUrl": "https://mykeyvault1.vault.azure.net/certificates/{certificatename}/{secret-version}"
          }
        ]
      }
    ]
  }
}
```

<!-- Links -->
[key-vault-get-started]:../key-vault/general/overview.md
[key-vault-certs]: ../key-vault/certificates/quick-create-cli.md
[config-package]: service-fabric-application-and-service-manifests.md
[key-vault-windows]: ../virtual-machines/extensions/key-vault-windows.md

<!-- Images -->
[overview]:./media/service-fabric-application-and-service-security/overview.png
[sfmc-secrets]:./media/how-to-managed-cluster-application-secrets/sfmc-secrets.png
