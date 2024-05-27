---
title: Configure OPC UA user authentication options
description: How to configure OPC UA Broker user authentication options for it to use when it connects to an OPC UA server.
author: dominicbetts
ms.author: dobett
ms.subservice: opcua-broker
ms.topic: how-to
ms.custom: ignite-2023
ms.date: 05/16/2024

# CustomerIntent: As a user in IT, operations, or development, I want to configure my OPC UA industrial edge environment with custom OPC UA user authentication options to keep it secure and work with my solution.
---

# Configure OPC UA user authentication options for Azure IoT OPC UA Broker Preview to use

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this article, you learn how to configure OPC UA user authentication options. These options provide more control over how OPC UA Broker Preview authenticates with OPC UA servers in your environment.

To learn more, see [OPC UA applications - user authentication](https://reference.opcfoundation.org/Core/Part2/v105/docs/5.2.3).

## Prerequisites

A deployed instance of Azure IoT Operations Preview. To deploy Azure IoT Operations for demonstration and exploration purposes, see [Quickstart: Deploy Azure IoT Operations – to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md).

## Features supported

| Feature  | Supported |
| -------- |:---------:|
| OPC UA user authentication with username and password.     |   ✅     |
| OPC UA user authentication with an X.509 user certificate. |   ❌     |

## Configure username and password authentication

First, configure the secrets for the username and password in Azure Key Vault and project them into the connected cluster by using a `SecretProviderClass` object.

1. Configure the username and password in Azure Key Vault. In the following example, use the `username` and `password` as secret references for the asset endpoint configuration in the Azure IoT Operations (preview) portal.

    Replace the placeholders for username and password with the credentials used to connect to the OPC UA server.

    To configure the username and password, run the following code:

    ```bash
    # Create username Secret in Azure Key Vault
      az keyvault secret set \
        --name "username" \
        --vault-name "<your-azure-key-vault-name>" \
        --value "<your-opc-ua-server-username>" \
        --content-type "text/plain"

    # Create password Secret in Azure Key Vault
      az keyvault secret set \
        --name "password" \
        --vault-name "<your-azure-key-vault-name>" \
        --value "<your-opc-ua-server-username>" \
        --content-type "text/plain"
    ```

1. Configure the `aio-opc-ua-broker-user-authentication` custom resource in the cluster. Use a Kubernetes client such as `kubectl` to configure the `username` and `password` secrets in the `SecretProviderClass` object array in the cluster.

    The following example shows a complete `SecretProviderClass` custom resource after you add the secrets:

    ```yml
    apiVersion: secrets-store.csi.x-k8s.io/v1
    kind: SecretProviderClass
    metadata:
      name: aio-opc-ua-broker-user-authentication
      namespace: azure-iot-operations
    spec:
      provider: azure
      parameters:
        usePodIdentity: 'false'
        keyvaultName: <azure-key-vault-name>
        tenantId: <azure-tenant-id>
        objects: |
          array:
            - |
              objectName: username
              objectType: secret
              objectVersion: ""
            - |
              objectName: password
              objectType: secret
              objectVersion: ""
    ```

    > [!NOTE]
    > The time it takes to project Azure Key Vault certificates into the cluster depends on the configured polling interval.

In the Azure IoT Operations (preview) portal, select the **Username & password** option when you configure the Asset endpoint. Enter the names of the references that store the username and password values. In this example, the names of the references are `username` and `password`.
