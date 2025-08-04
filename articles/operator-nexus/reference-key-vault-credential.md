---
title: "Azure Operator Nexus: Password By Key Vault Reference"
description: Reference for using a key vault secret reference instead of a plaintext password
author: ghugo
ms.author: gagehugo
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 05/20/2025
---

# Password by Key Vault reference

This guide details how to configure a Cluster for deployment using a Key Vault Uniform Resource Identifier (URI) instead of a plaintext password. This credential is used when creating or updating an Azure Operator cluster and can be located in the same key vault configured in `--secret-archive-settings` or a separate key vault. The key vault URI is used for deploying the cluster. Once the cluster is deployed, automatic credential rotation handles the rotation of the password.

This Key Vault URI is used to retrieve the password value from the specified Key Vault as a one-time operation. Once this password value is retrieved, the URI is no longer used and the password is securely stored in the cluster.

## Key Vault URI vs. Plaintext Password

Using a key vault URI instead of a password provides extra security by avoiding the issue of using a plaintext value. The URI value isn't used once the Cluster Create/Update & Bare Metal Machine Replace Actions are complete.

>[!NOTE]
> This feature is supported for cluster create and update as part of the 2506.2 release. A later release is planned to remove support for using plaintext passwords.

## Role Assignment

The managed identity that is specified in the `--secret-archive-settings` field needs to be assigned the `Key Vault Secrets User` role on the key vault that contains the password. The role assignment is required so that the cluster can retrieve the password value from the URI value referenced. The `Key Vault Secrets User` role assignment is different than `Operator Nexus Key Vault Writer Service Role`, which is required for the automatic rotation of credentials.

For more information on `--secret-archive-settings`, see [Cluster Support for Managed Identities](./howto-cluster-managed-identity-user-provided-resources.md#key-vault-settings).

## Configuration for Base Management Controller (BMC) and Storage Appliance

When a cluster is deployed, multiple passwords are provided as part of the configuration data. As of the 2506.2 release, the ability to pass in a URI reference value instead of a plaintext password was introduced.

In these examples, the `KEY_VAULT_NAME` is the name of the key vault and `SECRET_NAME` is the name of the secret. If there are multiple versions of a secret, the `VERSION` can be appended to specify that particular version should be used.

## Base Management Controller password

```yaml
"bareMetalMachineConfigurationData": [
    {
        "bmcCredentials": {
            "username": "$BMC_USERNAME",
            "password": "https://$KEY_VAULT_NAME.vault.azure.net/secrets/$SECRET_NAME/$VERSION"
        },
    }
]
```

### Storage Appliance password

```yaml
"storageApplianceConfigurationData": [
    {
        "adminCredentials": {
            "username": "pureuser",
            "password": "https://$KEY_VAULT_NAME.vault.azure.net/secrets/$SECRET_NAME/$VERSION"
        },
    }
]
```

### Bare Metal Machine replacement

This key vault URI can also be provided for the password value when performing a bare metal machine replace: [Replace a Bare Metal Machine](./howto-baremetal-functions.md#replace-a-bare-metal-machine). The same [Role Assignment](#role-assignment) is needed to exist for this functionality to work.