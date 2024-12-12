---
title: Configure dataflow endpoints for Azure Data Lake Storage Gen2
description: Learn how to configure dataflow endpoints for Azure Data Lake Storage Gen2 in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 11/07/2024
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to configure dataflow endpoints for Azure Data Lake Storage Gen2 in Azure IoT Operations so that I can send data to Azure Data Lake Storage Gen2.
---

# Configure dataflow endpoints for Azure Data Lake Storage Gen2

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

To send data to Azure Data Lake Storage Gen2 in Azure IoT Operations, you can configure a dataflow endpoint. This configuration allows you to specify the destination endpoint, authentication method, table, and other settings.

## Prerequisites

- An instance of [Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md)
- An [Azure Data Lake Storage Gen2 account](../../storage/blobs/create-data-lake-storage-account.md)
- A pre-created storage container in the storage account

## Assign permission to managed identity

To configure a dataflow endpoint for Azure Data Lake Storage Gen2, we recommend using either a user-assigned or system-assigned managed identity. This approach is secure and eliminates the need for managing credentials manually.

After the Azure Data Lake Storage Gen2 is created, you need to assign a role to the Azure IoT Operations managed identity that grants permission to write to the storage account.

If using system-assigned managed identity, in Azure portal, go to your Azure IoT Operations instance and select **Overview**. Copy the name of the extension listed after **Azure IoT Operations Arc extension**. For example, *azure-iot-operations-xxxx7*. Your system-assigned managed identity can be found using the same name of the Azure IoT Operations Arc extension.

Then, go to the Azure Storage account > **Access control (IAM)** > **Add role assignment**.

1. On the **Role** tab select an appropriate role like `Storage Blob Data Contributor`. This gives the managed identity the necessary permissions to write to the Azure Storage blob containers. To learn more, see [Authorize access to blobs using Microsoft Entra ID](../../storage/blobs/authorize-access-azure-active-directory.md).
1. On the **Members** tab:
    1. If using system-assigned managed identity, for **Assign access to**, select **User, group, or service principal** option, then select **+ Select members** and search for the name of the Azure IoT Operations Arc extension. 
    1. If using user-assigned managed identity, for **Assign access to**, select **Managed identity** option, then select **+ Select members** and search for your [user-assigned managed identity set up for cloud connections](../deploy-iot-ops/howto-enable-secure-settings.md#set-up-a-user-assigned-managed-identity-for-cloud-connections).

## Create dataflow endpoint for Azure Data Lake Storage Gen2

# [Portal](#tab/portal)

1. In the IoT Operations portal, select the **Dataflow endpoints** tab.
1. Under **Create new dataflow endpoint**, select **Azure Data Lake Storage (2nd generation)** > **New**.

    :::image type="content" source="media/howto-configure-adlsv2-endpoint/create-adls-endpoint.png" alt-text="Screenshot using operations experience to create a new ADLS V2 dataflow endpoint.":::

1. Enter the following settings for the endpoint:

    | Setting               | Description                                                                                       |
    | --------------------- | ------------------------------------------------------------------------------------------------- |
    | Name                  | The name of the dataflow endpoint.                                                              |
    | Host                  | The hostname of the Azure Data Lake Storage Gen2 endpoint in the format `<account>.blob.core.windows.net`. Replace the account placeholder with the endpoint account name. |
    | Authentication method | The method used for authentication. We recommend that you choose [*System assigned managed identity*](#system-assigned-managed-identity) or [*User assigned managed identity*](#user-assigned-managed-identity). |
    | Client ID             | The client ID of the user-assigned managed identity. Required if using *User assigned managed identity*. |
    | Tenant ID             | The tenant ID of the user-assigned managed identity. Required if using *User assigned managed identity*. |
    | Access token secret name | The name of the Kubernetes secret containing the SAS token. Required if using *Access token*. |

1. Select **Apply** to provision the endpoint.

# [Bicep](#tab/bicep)

Create a Bicep `.bicep` file with the following content.
    
```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param endpointName string = '<ENDPOINT_NAME>'
param host string = 'https://<ACCOUNT>.blob.core.windows.net'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}
resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}
resource adlsGen2Endpoint 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-11-01' = {
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
        // See available authentication methods section for method types
        // method: <METHOD_TYPE>
      }
    }
  }
}
```

Then, deploy via Azure CLI.

```azurecli
az deployment group create --resource-group <RESOURCE_GROUP> --template-file <FILE>.bicep
```

# [Kubernetes (preview)](#tab/kubernetes)

Create a Kubernetes manifest `.yaml` file with the following content.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowEndpoint
metadata:
  name: <ENDPOINT_NAME>
  namespace: azure-iot-operations
spec:
  endpointType: DataLakeStorage
  dataLakeStorageSettings:
    host: https://<ACCOUNT>.blob.core.windows.net
    authentication:
      # See available authentication methods section for method types
      # method: <METHOD_TYPE>
```

Then apply the manifest file to the Kubernetes cluster.

```bash
kubectl apply -f <FILE>.yaml
```

---

### Use access token authentication

Follow the steps in the [access token](#access-token) section to get a SAS token for the storage account and store it in a Kubernetes secret. 

Then, create the *DataflowEndpoint* resource and specify the access token authentication method. Here, replace `<SAS_SECRET_NAME>` with name of the secret containing the SAS token and other placeholder values.

# [Portal](#tab/portal)

See the [access token](#access-token) section for steps to create a secret in the operations experience portal.

# [Bicep](#tab/bicep)

Create a Bicep `.bicep` file with the following content.

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param endpointName string = '<ENDPOINT_NAME>'
param host string = 'https://<ACCOUNT>.blob.core.windows.net'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}
resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}
resource adlsGen2Endpoint 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-11-01' = {
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
}
```

Then, deploy via Azure CLI.

```azurecli
az deployment group create --resource-group <RESOURCE_GROUP> --template-file <FILE>.bicep
```

# [Kubernetes (preview)](#tab/kubernetes)

Create a Kubernetes manifest `.yaml` file with the following content.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
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

## Available authentication methods

The following authentication methods are available for Azure Data Lake Storage Gen2 endpoints.

### System-assigned managed identity

Before you configure the dataflow endpoint, assign a role to the Azure IoT Operations managed identity that grants permission to write to the storage account:

1. In Azure portal, go to your Azure IoT Operations instance and select **Overview**.
1. Copy the name of the extension listed after **Azure IoT Operations Arc extension**. For example, *azure-iot-operations-xxxx7*.
1. Go to the cloud resource you need to grant permissions. For example, go to the Azure Storage account > **Access control (IAM)** > **Add role assignment**.
1. On the **Role** tab select an appropriate role.
1. On the **Members** tab, for **Assign access to**, select **User, group, or service principal** option, then select **+ Select members** and search for the Azure IoT Operations managed identity. For example, *azure-iot-operations-xxxx7*.

Then, configure the dataflow endpoint with system-assigned managed identity settings.

# [Portal](#tab/portal)

In the operations experience dataflow endpoint settings page, select the **Basic** tab then choose **Authentication method** > **System assigned managed identity**.

In most cases, you don't need to specify a service audience. Not specifying an audience creates a managed identity with the default audience scoped to your storage account.

# [Bicep](#tab/bicep)

```bicep
dataLakeStorageSettings: {
  authentication: {
    method: 'SystemAssignedManagedIdentity'
    systemAssignedManagedIdentitySettings: {}
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
dataLakeStorageSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings: {}
```

---

If you need to override the system-assigned managed identity audience, you can specify the `audience` setting.

# [Portal](#tab/portal)

In most cases, you don't need to specify a service audience. Not specifying an audience creates a managed identity with the default audience scoped to your storage account.

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

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
dataLakeStorageSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      audience: https://<ACCOUNT>.blob.core.windows.net
```

---

### User-assigned managed identity

To use user-assigned managed identity for authentication, you must first deploy Azure IoT Operations with secure settings enabled. Then you need to [set up a user-assigned managed identity for cloud connections](../deploy-iot-ops/howto-enable-secure-settings.md#set-up-a-user-assigned-managed-identity-for-cloud-connections). To learn more, see [Enable secure settings in Azure IoT Operations deployment](../deploy-iot-ops/howto-enable-secure-settings.md).

Before you configure the dataflow endpoint, assign a role to the user-assigned managed identity that grants permission to write to the storage account:

1. In Azure portal, go to the cloud resource you need to grant permissions. For example, go to the Azure Storage account > **Access control (IAM)** > **Add role assignment**.
1. On the **Role** tab select an appropriate role.
1. On the **Members** tab, for **Assign access to**, select **Managed identity** option, then select **+ Select members** and search for your user-assigned managed identity.

Then, configure the dataflow endpoint with user-assigned managed identity settings.

# [Portal](#tab/portal)

In the operations experience dataflow endpoint settings page, select the **Basic** tab then choose **Authentication method** > **User assigned managed identity**.

Enter the user assigned managed identity client ID and tenant ID in the appropriate fields.

# [Bicep](#tab/bicep)

```bicep
dataLakeStorageSettings: {
  authentication: {
    method: 'UserAssignedManagedIdentity'
    userAssignedManagedIdentitySettings: {
      clientId: '<ID>'
      tenantId: '<ID>'
      // Optional, defaults to 'https://storage.azure.com/.default'
      // scope: 'https://<SCOPE_URL>'
    }
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
dataLakeStorageSettings:
  authentication:
    method: UserAssignedManagedIdentity
    userAssignedManagedIdentitySettings:
      clientId: <ID>
      tenantId: <ID>
      # Optional, defaults to 'https://storage.azure.com/.default'
      # scope: https://<SCOPE_URL>
```

---

Here, the scope is optional and defaults to `https://storage.azure.com/.default`. If you need to override the default scope, specify the `scope` setting via the Bicep or Kubernetes manifest.

### Access token

Using an access token is an alternative authentication method. This method requires you to create a Kubernetes secret with the SAS token and reference the secret in the *DataflowEndpoint* resource.

Get a [SAS token](../../storage/common/storage-sas-overview.md) for an Azure Data Lake Storage Gen2 (ADLSv2) account. For example, use the Azure portal to browse to your storage account. On the left menu, choose **Security + networking** > **Shared access signature**. Use the following table to set the required permissions.

| Parameter              | Enabled setting             |
| ---------------------- | --------------------------- |
| Allowed services       | Blob                        |
| Allowed resource types | Object, Container           |
| Allowed permissions    | Read, Write, Delete, List, Create |

To enhance security and follow the principle of least privilege, you can generate a SAS token for a specific container. To prevent authentication errors, ensure that the container specified in the SAS token matches the dataflow destination setting in the configuration.

# [Portal](#tab/portal)

> [!IMPORTANT]
> To use the operations experience portal to manage secrets, Azure IoT Operations must first be enabled with secure settings by configuring an Azure Key Vault and enabling workload identities. To learn more, see [Enable secure settings in Azure IoT Operations deployment](../deploy-iot-ops/howto-enable-secure-settings.md).

In the operations experience dataflow endpoint settings page, select the **Basic** tab then choose **Authentication method** > **Access token**.

Here, under **Synced secret name**, enter a name for the secret. This name is used to reference the secret in the dataflow endpoint settings and is the name of the secret as stored in the Kubernetes cluster.

Then, under **Access token secret name**, select **Add reference** to add the secret from Azure Key Vault. On the next page, select the secret from Azure Key Vault with **Add from Azure Key Vault** or **Create new** secret.

If you select **Create new**, enter the following settings:

| Setting | Description |
| ------- | ----------- |
| Secret name | The name of the secret in Azure Key Vault. Pick a name that is easy to remember to select the secret later from the list. |
| Secret value | The SAS token in the format of `'sv=2022-11-02&ss=b&srt=c&sp=rwdlax&se=2023-07-22T05:47:40Z&st=2023-07-21T21:47:40Z&spr=https&sig=<signature>'`. |
| Set activation date | If turned on, the date when the secret becomes active. |
| Set expiration date | If turned on, the date when the secret expires. |

To learn more about secrets, see [Create and manage secrets in Azure IoT Operations](../secure-iot-ops/howto-manage-secrets.md).

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

# [Kubernetes (preview)](#tab/kubernetes)

Create a Kubernetes secret with the SAS token.

```bash
kubectl create secret generic <SAS_SECRET_NAME> -n azure-iot-operations \
--from-literal=accessToken='sv=2022-11-02&ss=b&srt=c&sp=rwdlax&se=2023-07-22T05:47:40Z&st=2023-07-21T21:47:40Z&spr=https&sig=<signature>'
```

```yaml
dataLakeStorageSettings:
  authentication:
    method: AccessToken
    accessTokenSettings:
      secretRef: <SAS_SECRET_NAME>
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

# [Portal](#tab/portal)

In the operations experience, select the **Advanced** tab for the dataflow endpoint.

:::image type="content" source="media/howto-configure-adlsv2-endpoint/adls-advanced.png" alt-text="Screenshot using operations experience to set ADLS V2 advanced settings.":::

# [Bicep](#tab/bicep)

```bicep
dataLakeStorageSettings: {
  batching: {
    latencySeconds: 100
    maxMessages: 1000
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
dataLakeStorageSettings:
  batching:
    latencySeconds: 100
    maxMessages: 1000
```

---

## Next steps

- To learn more about dataflows, see [Create a dataflow](howto-create-dataflow.md).
- To see a tutorial on how to use a dataflow to send data to Azure Data Lake Storage Gen2, see [Tutorial: Send data to Azure Data Lake Storage Gen2](./tutorial-opc-ua-to-data-lake.md).