---
title: Configure OPC UA user authentication options
description: How to configure OPC UA user authentication options to use with Azure IoT OPC UA Broker.
author: timlt
ms.author: timlt
ms.subservice: opcua-broker
ms.topic: how-to
ms.custom: ignite-2023
ms.date: 03/01/2024

# CustomerIntent: As a user in IT, operations, or development, I want to configure my OPC UA industrial edge environment
# with custom OPC UA user authentication options to keep it secure and work with my solution.
---

# Configure OPC UA user authentication options to use with Azure IoT OPC UA Broker Preview

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this article, you learn how to configure OPC UA user authentication options. These options provide more control over your OPC UA authentication, and let you configure authentication in a way that makes sense for your solution.

## Prerequisites

Azure IoT Operations Preview installed. For more information, see [Quickstart: Deploy Azure IoT Operations Preview to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md). 

## Features supported

| Features  | Meaning | Symbol |
|---------|---------|---------:|
| Configuration of OPC UA user authentication with username and password        | Supported   |   ✅     |
| Configuration of OPC UA user authentication with an X.509 user certificate	  | Unsupported |   ❌     |

## Configure OPC UA user authentication with username and password
If an OPC UA Server requires user authentication with username and password, you can select that option in Operations Experience, and configure the secrets references for the username and password.

Before you can configure secrets for the username and password, you need to complete two more configuration steps:
If an OPC UA Server requires user authentication with username and password, you can select that option in the Operations Experience portal, and configure the secret references for the username and password.

1. Configure the username and password in Azure Key Vault. In the following example, use the `username` and `password` as secret references for the configuration in Operations Experience.

    > [!NOTE]
    > Replace the values in the example for user (*user1*) and password (*password*) with the actual credentials used in the OPC UA server to connect.


    To configure the username and password, run the following code:

    ```bash
    # Create username Secret in Azure Key Vault
      az keyvault secret set \
        --name "username" \
        --vault-name <azure-key-vault-name> \
        --value "user1" \
        --content-type "text/plain"

    # Create password Secret in Azure Key Vault
      az keyvault secret set \
        --name "password" \
        --vault-name <azure-key-vault-name> \
        --value "password" \
        --content-type "text/plain"
    ```

1. Configure the secret provider class `aio-opc-ua-broker-user-authentication` custom resource (CR) in the connected cluster. Use a K8s client such as kubectl to configure the secrets (`username` and `password`, in the following example) in the SPC object array in the connected cluster.

    The following example shows a complete SPC CR after you add the secret configurations:
    
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
    
    The projection of the Azure Key Vault secrets and certificates into the cluster takes some time depending on the configured polling interval.

## Related content

- [Configure an OPC PLC simulator](howto-configure-opc-plc-simulator.md)
