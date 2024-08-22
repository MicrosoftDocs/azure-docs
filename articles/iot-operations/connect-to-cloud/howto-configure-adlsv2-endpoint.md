---
title: Configure dataflow endpoints for Azure Data Lake Storage Gen2
description: Learn how to configure dataflow endpoints for Azure Data Lake Storage Gen2 in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 08/20/2024

#CustomerIntent: As an operator, I want to understand how to configure dataflow endpoints for Azure Data Lake Storage Gen2 in Azure IoT Operations so that I can send data to Azure Data Lake Storage Gen2.
---

# Configure dataflow endpoints for Azure Data Lake Storage Gen2

Azure Data Lake endpoints are used for Azure Data Lake destinations. You can configure the endpoint, authentication, table, and other settings.

## Prerequisites

- **Azure IoT Operations**. See [Deploy Azure IoT Operations Preview](../deploy-iot-ops/howto-deploy-iot-operations.md)
- **Dataflow profile**. See [Configure dataflow profile](howto-configure-dataflow-profile.md)
- **Azure Data Lake Storage Gen2**. See [Create an Azure Data Lake Storage Gen2 account](../../storage/blobs/create-data-lake-storage-account.md)

## How to create a Azure Data Lake Storage Gen2 dataflow endpoint

To create a dataflow endpoint for Azure Data Lake Storage Gen2, we recommend using the Azure Arc-enabled Kubernetes cluster's managed identity. This method is secure and doesn't require you to manage secrets. Alternatively, you can use an access token to authenticate with the storage account. This method requires you to create a Kubernetes secret with the SAS token.

### With managed identity authentication

1. Get the managed identity of the Azure IoT Operations Arc extension.

1. Assign a role to the managed identity that grants permission to write to the storage account, such as Storage Blob Data Contributor. To learn more, see [Authorize access to blobs using Microsoft Entra ID](../../storage/blobs/authorize-access-azure-active-directory.md).

1. Create the DataflowEndpoint resource and specify the managed identity authentication method.

      ```yaml
      apiVersion: connectivity.iotoperations.azure.com/v1beta1
      kind: DataflowEndpoint
      metadata:
        name: adls
      spec:
        endpointType: DataLakeStorage
        datalakeStorageSettings:
          host: example-account.blob.core.windows.net
          authentication:
            method: SystemAssignedManagedIdentity
            systemAssignedManagedIdentitySettings: {}
    ```

If you need to override the system-assigned managed identity audience, see [system-assigned managed identity](#system-assigned-managed-identity).

### With access token authentication

1. Follow instructions [access token](#access-token) to get a SAS token for the storage account and store it in a Kubernetes secret.

1. Create the DataflowEndpoint resource and specify the access token authentication method.

      ```yaml
      apiVersion: connectivity.iotoperations.azure.com/v1beta1
      kind: DataflowEndpoint
      metadata:
        name: adls
      spec:
        endpointType: DataLakeStorage
        datalakeStorageSettings:
          host: example-account.blob.core.windows.net
          authentication:
            method: AccessToken
            accessTokenSettings:
              secretRef: my-sas
    ```

### Use the endpoint in a dataflow destination

Now that you have created the endpoint, you can use it in a dataflow by specifying the endpoint name in the dataflow's destination settings. To learn more, see [Create a dataflow](howto-create-dataflow.md).

> [!NOTE]
> Using the ADLSv2 endpoint as a source in a dataflow isn't supported. You can use the endpoint as a destination only.

## Available authentication methods

The following authentication methods are available for Azure Data Lake Storage Gen2 endpoints.

### System-assigned managed identity

Using system-assigned managed identity is the recommended authentication method. The system-assigned managed identity is automatically created by Azure IoT Operations and assigned to the Azure Arc-enabled Kubernetes cluster. The managed identity is used to authenticate with the Azure Data Lake Storage Gen2 account. No secret management is required.

Before you create the dataflow endpoint, assign a role to the managed identity that grants permission to write to the storage account, such as Storage Blob Data Contributor. To learn more, see [Authorize access to blobs using Microsoft Entra ID](../../storage/blobs/authorize-access-azure-active-directory.md).

Then, create the DataflowEndpoint resource and specify the managed identity authentication method. In most cases, you don't need to specify additional settings. This creates a managed identity with the default audience scoped to your storage account.

```yaml
datalakeStorageSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings: {}
```

If you need to override the system-assigned managed identity audience, you can specify the `audience` setting.

```yaml
datalakeStorageSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      audience: https://<account>.blob.core.windows.net
```

### Access token

Using an access token is an alternative authentication method. This method requires you to create a Kubernetes secret with the SAS token and reference the secret in the DataflowEndpoint resource.

First, get a [SAS token](../../storage/common/storage-sas-overview.md) for an Azure Data Lake Storage Gen2 (ADLSv2) account. For example, use the Azure portal to browse to your storage account. In the menu under *Security + networking*, choose **Shared access signature**. Use the following table to set the required permissions.

| Parameter              | Value                       |
| ---------------------- | --------------------------- |
| Allowed services       | Blob                        |
| Allowed resource types | Object, Container           |
| Allowed permissions    | Read, Write, Delete, List, Create |

To optimize for least privilege, you can also choose to get the SAS for an individual container. To prevent authentication errors, make sure that the container matches the dataflow destination setting when you configure it later

Then, create a Kubernetes secret with the SAS token. Don't include the question mark `?` that might be at the beginning of the token.

```bash
kubectl create secret generic my-sas \
--from-literal=accessToken='sv=2022-11-02&ss=b&srt=c&sp=rwdlax&se=2023-07-22T05:47:40Z&st=2023-07-21T21:47:40Z&spr=https&sig=xDkwJUO....' \
-n azure-iot-operations
```

Finally, create the DataflowEndpoint resource with the secret reference.

```yaml
datalakeStorageSettings:
  authentication:
    method: AccessToken
    accessTokenSettings:
      secretRef: my-sas
```

### User-assigned managed identity

TBD

```yaml
datalakeStorageSettings:
  authentication:
    method: UserAssignedManagedIdentity
    userAssignedManagedIdentitySettings:
      clientId: <id>
      tenantId: <id>
```

## Batching

Use the `batching` settings to configure the maximum number of messages and the maximum latency before the messages are sent to the destination. This setting is useful when you want to optimize for network bandwidth and reduce the number of requests to the destination.

| Field | Description | Required |
| ----- | ----------- | -------- |
| `latencySeconds` | The maximum number of seconds to wait before sending the messages to the destination. The default value is 60 seconds. | No |
| `maxMessages` | The maximum number of messages to send to the destination. The default value is 100000 messages. | No |

For example, to configure the maximum number of messages to 1000 and the maximum latency to 100 seconds, use the following settings.

```yaml
datalakeStorageSettings:
  batching:
    latencySeconds: 100
    maxMessages: 1000
```