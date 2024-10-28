---
title: Configure dataflow endpoints for Azure Data Lake Storage Gen2
description: Learn how to configure dataflow endpoints for Azure Data Lake Storage Gen2 in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/22/2024
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to configure dataflow endpoints for Azure Data Lake Storage Gen2 in Azure IoT Operations so that I can send data to Azure Data Lake Storage Gen2.
---

# Configure dataflow endpoints for Azure Data Lake Storage Gen2

To send data to Azure Data Lake Storage Gen2 in Azure IoT Operations, you can configure a dataflow endpoint. This configuration allows you to specify the destination endpoint, authentication method, table, and other settings.

## Prerequisites

- An instance of [Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md)
- A [configured dataflow profile](howto-configure-dataflow-profile.md)
- A [Azure Data Lake Storage Gen2 account](../../storage/blobs/create-data-lake-storage-account.md)
- A pre-created storage container in the storage account

## Create an Azure Data Lake Storage Gen2 dataflow endpoint

To configure a dataflow endpoint for Azure Data Lake Storage Gen2, we suggest using the managed identity of the Azure Arc-enabled Kubernetes cluster. This approach is secure and eliminates the need for secret management. Alternatively, you can authenticate with the storage account using an access token. When using an access token, you would need to create a Kubernetes secret containing the SAS token.

### Use managed identity authentication

First, in Azure portal, go to the Arc-connected Kubernetes cluster and select **Settings** > **Extensions**. In the extension list, find the name of your Azure IoT Operations extension. Copy the name of the extension.

Then, assign a role to the managed identity that grants permission to write to the storage account, such as *Storage Blob Data Contributor*. To learn more, see [Authorize access to blobs using Microsoft Entra ID](../../storage/blobs/authorize-access-azure-active-directory.md).

Finally, create the *DataflowEndpoint* resource and specify the managed identity authentication method. Replace the placeholder values like `<ENDPOINT_NAME>` with your own.

# [Bicep](#tab/bicep)

Create a Bicep `.bicep` file with the following content.
    
```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param endpointName string = '<ENDPOINT_NAME>'
param host string = 'https://<ACCOUNT>.blob.core.windows.net'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-08-15-preview' existing = {
  name: aioInstanceName
}
resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}
resource adlsGen2Endpoint 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-08-15-preview' = {
  parent: aioInstance
  name: endpointName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    endpointType: 'DataLakeStorage'
    dataLakeStorageSettings: {
      host: host
      authentication: {
        method: 'SystemAssignedManagedIdentity'
        systemAssignedManagedIdentitySettings: {}
      }
    }
  }
}
```

Then, deploy via Azure CLI.

```azurecli
az stack group create --name <DEPLOYMENT_NAME> --resource-group <RESOURCE_GROUP> --template-file <FILE>.bicep --dm None --aou deleteResources --yes
```

# [Kubernetes](#tab/kubernetes)

Create a Kubernetes manifest `.yaml` file with the following content.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: <ENDPOINT_NAME>
  namespace: azure-iot-operations
spec:
  endpointType: DataLakeStorage
  dataLakeStorageSettings:
    host: https://<ACCOUNT>.blob.core.windows.net
    authentication:
      method: SystemAssignedManagedIdentity
      systemAssignedManagedIdentitySettings: {}
```

Then apply the manifest file to the Kubernetes cluster.

```bash
kubectl apply -f <FILE>.yaml
```

---

If you need to override the system-assigned managed identity audience, see the [System-assigned managed identity](#system-assigned-managed-identity) section.

### Use access token authentication

Follow the steps in the [access token](#access-token) section to get a SAS token for the storage account and store it in a Kubernetes secret. 

Then, create the *DataflowEndpoint* resource and specify the access token authentication method. Here, replace `<SAS_SECRET_NAME>` with name of the secret containing the SAS token as well as other placeholder values.

# [Bicep](#tab/bicep)

Create a Bicep `.bicep` file with the following content.

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param endpointName string = '<ENDPOINT_NAME>'
param host string = 'https://<ACCOUNT>.blob.core.windows.net'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-08-15-preview' existing = {
  name: aioInstanceName
}
resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}
resource adlsGen2Endpoint 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-08-15-preview' = {
  parent: aioInstance
  name: endpointName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    endpointType: 'DataLakeStorage'
    dataLakeStorageSettings: {
      host: host
      authentication: {
        method: 'AccessToken'
        accessTokenSettings: {
          secretRef: '<SAS_SECRET_NAME>'
      }
    }
  }
}
```

Then, deploy via Azure CLI.

```azurecli
az stack group create --name <DEPLOYMENT_NAME> --resource-group <RESOURCE_GROUP> --template-file <FILE>.bicep --dm None --aou deleteResources --yes
```

# [Kubernetes](#tab/kubernetes)

Create a Kubernetes manifest `.yaml` file with the following content.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: <ENDPOINT_NAME>
  namespace: azure-iot-operations
spec:
  endpointType: DataLakeStorage
  dataLakeStorageSettings:
    host: https://<ACCOUNT>.blob.core.windows.net
    authentication:
      method: AccessToken
      accessTokenSettings:
        secretRef: <SAS_SECRET_NAME>
```

Then apply the manifest file to the Kubernetes cluster.

```bash
kubectl apply -f <FILE>.yaml
```

---

### Available authentication methods

The following authentication methods are available for Azure Data Lake Storage Gen2 endpoints.

For more information about enabling secure settings by configuring an Azure Key Vault and enabling workload identities, see [Enable secure settings in Azure IoT Operations deployment](../deploy-iot-ops/howto-enable-secure-settings.md).

#### System-assigned managed identity

Using the system-assigned managed identity is the recommended authentication method for Azure IoT Operations. Azure IoT Operations creates the managed identity automatically and assigns it to the Azure Arc-enabled Kubernetes cluster. It eliminates the need for secret management and allows for seamless authentication with the Azure Data Lake Storage Gen2 account.

Before creating the dataflow endpoint, assign a role to the managed identity that has write permission to the storage account. For example, you can assign the *Storage Blob Data Contributor* role. To learn more about assigning roles to blobs, see [Authorize access to blobs using Microsoft Entra ID](../../storage/blobs/authorize-access-azure-active-directory.md).

To use system-assigned managed identity, specify the managed identity authentication method in the *DataflowEndpoint* resource. In most cases, you don't need to specify other settings. Not specifying an audience creates a managed identity with the default audience scoped to your storage account.

# [Bicep](#tab/bicep)

```bicep
dataLakeStorageSettings: {
  authentication: {
    method: 'SystemAssignedManagedIdentity'
    systemAssignedManagedIdentitySettings: {}
  }
}
```

# [Kubernetes](#tab/kubernetes)

```yaml
dataLakeStorageSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings: {}
```

---

If you need to override the system-assigned managed identity audience, you can specify the `audience` setting.

# [Bicep](#tab/bicep)

```bicep
dataLakeStorageSettings: {
  authentication: {
    method: 'SystemAssignedManagedIdentity'
    systemAssignedManagedIdentitySettings: {
        audience: 'https://<ACCOUNT>.blob.core.windows.net'
    }
  }
}
```

# [Kubernetes](#tab/kubernetes)

```yaml
dataLakeStorageSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      audience: https://<ACCOUNT>.blob.core.windows.net
```

---

#### Access token

Using an access token is an alternative authentication method. This method requires you to create a Kubernetes secret with the SAS token and reference the secret in the *DataflowEndpoint* resource.

Get a [SAS token](../../storage/common/storage-sas-overview.md) for an Azure Data Lake Storage Gen2 (ADLSv2) account. For example, use the Azure portal to browse to your storage account. On the left menu, choose **Security + networking** > **Shared access signature**. Use the following table to set the required permissions.

| Parameter              | Enabled setting             |
| ---------------------- | --------------------------- |
| Allowed services       | Blob                        |
| Allowed resource types | Object, Container           |
| Allowed permissions    | Read, Write, Delete, List, Create |

To enhance security and follow the principle of least privilege, you can generate a SAS token for a specific container. To prevent authentication errors, ensure that the container specified in the SAS token matches the dataflow destination setting in the configuration.

Create a Kubernetes secret with the SAS token. Don't include the question mark `?` that might be at the beginning of the token.

```bash
kubectl create secret generic <SAS_SECRET_NAME> \
--from-literal=accessToken='sv=2022-11-02&ss=b&srt=c&sp=rwdlax&se=2023-07-22T05:47:40Z&st=2023-07-21T21:47:40Z&spr=https&sig=<signature>' \
-n azure-iot-operations
```

You can also use the IoT Operations portal to create and manage the secret. To learn more, see [Create and manage secrets in Azure IoT Operations](../deploy-iot-ops/howto-manage-secrets.md).

Finally, create the *DataflowEndpoint* resource with the secret reference.

# [Bicep](#tab/bicep)

```bicep
dataLakeStorageSettings: {
  authentication: {
    method: 'AccessToken'
    accessTokenSettings: {
        secretRef: '<SAS_SECRET_NAME>'
    }
  }
}
```

# [Kubernetes](#tab/kubernetes)

```yaml
dataLakeStorageSettings:
  authentication:
    method: AccessToken
    accessTokenSettings:
      secretRef: <SAS_SECRET_NAME>
```

---

#### User-assigned managed identity

To use a user-assigned managed identity, specify the `UserAssignedManagedIdentity` authentication method and provide the `clientId` and `tenantId` of the managed identity.

# [Bicep](#tab/bicep)

```bicep
dataLakeStorageSettings: {
  authentication: {
    method: 'UserAssignedManagedIdentity'
    userAssignedManagedIdentitySettings: {
      cliendId: '<ID>'
      tenantId: '<ID>'
    }
  }
}
```

# [Kubernetes](#tab/kubernetes)

```yaml
dataLakeStorageSettings:
  authentication:
    method: UserAssignedManagedIdentity
    userAssignedManagedIdentitySettings:
      clientId: <ID>
      tenantId: <ID>
```

---

## Advanced settings

You can set advanced settings for the Azure Data Lake Storage Gen2 endpoint, such as the batching latency and message count. 

Use the `batching` settings to configure the maximum number of messages and the maximum latency before the messages are sent to the destination. This setting is useful when you want to optimize for network bandwidth and reduce the number of requests to the destination.

| Field | Description | Required |
| ----- | ----------- | -------- |
| `latencySeconds` | The maximum number of seconds to wait before sending the messages to the destination. The default value is 60 seconds. | No |
| `maxMessages` | The maximum number of messages to send to the destination. The default value is 100000 messages. | No |

For example, to configure the maximum number of messages to 1000 and the maximum latency to 100 seconds, use the following settings:

# [Bicep](#tab/bicep)

```bicep
dataLakeStorageSettings: {
  ...
  batching: {
    latencySeconds: 100
    maxMessages: 1000
  }
}
```

# [Kubernetes](#tab/kubernetes)

```yaml
fabricOneLakeSettings:
  batching:
    latencySeconds: 100
    maxMessages: 1000
```

---

## Next steps

- [Create a dataflow](howto-create-dataflow.md)