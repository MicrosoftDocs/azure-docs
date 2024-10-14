---
title: Configure dataflow endpoints for Azure Data Lake Storage Gen2
description: Learn how to configure dataflow endpoints for Azure Data Lake Storage Gen2 in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/02/2024
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to configure dataflow endpoints for Azure Data Lake Storage Gen2 in Azure IoT Operations so that I can send data to Azure Data Lake Storage Gen2.
---

# Configure dataflow endpoints for Azure Data Lake Storage Gen2

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

To send data to Azure Data Lake Storage Gen2 in Azure IoT Operations Preview, you can configure a dataflow endpoint. This configuration allows you to specify the destination endpoint, authentication method, table, and other settings.

## Prerequisites

- An instance of [Azure IoT Operations Preview](../deploy-iot-ops/howto-deploy-iot-operations.md)
- A [configured dataflow profile](howto-configure-dataflow-profile.md)
- A [Azure Data Lake Storage Gen2 account](../../storage/blobs/create-data-lake-storage-account.md)

## Create an Azure Data Lake Storage Gen2 dataflow endpoint

To configure a dataflow endpoint for Azure Data Lake Storage Gen2, we suggest using the managed identity of the Azure Arc-enabled Kubernetes cluster. This approach is secure and eliminates the need for secret management. Alternatively, you can authenticate with the storage account using an access token. When using an access token, you would need to create a Kubernetes secret containing the SAS token.

### Use managed identity authentication

1. Get the managed identity of the Azure IoT Operations Preview Arc extension.

1. Assign a role to the managed identity that grants permission to write to the storage account, such as *Storage Blob Data Contributor*. To learn more, see [Authorize access to blobs using Microsoft Entra ID](../../storage/blobs/authorize-access-azure-active-directory.md).

# [Kubernetes](#tab/kubernetes)

1. Create the *DataflowEndpoint* resource and specify the managed identity authentication method.

    ```yaml
    apiVersion: connectivity.iotoperations.azure.com/v1beta1
    kind: DataflowEndpoint
    metadata:
      name: adls
    spec:
      endpointType: DataLakeStorage
      datalakeStorageSettings:
        host: <account>.blob.core.windows.net
        authentication:
          method: SystemAssignedManagedIdentity
          systemAssignedManagedIdentitySettings: {}
    ```

# [Bicep](#tab/bicep)

11. A single Bicep template file from the *explore-iot-operations* repository deploys all the required dataflows and dataflow endpoints resources [Bicep File to create Dataflow](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/quickstarts/dataflow.bicep). Download the template file

1. Set environment variables for the resources you create in this section.

   ```azurecli
   export CUSTOM_LOCATION_NAME=<CUSTOM_LOCATION_NAME>
   export SCHEMA_REGISTRY_NAME=<SCHEMA_REGISTRY_NAME>
   export AIO_INSTANCE_NAME=<AIO_INSTANCE_NAME>
   export OPCUA_SCHEMA_NAME=<OPCUA_SCHEMA_NAME>
   ```

1. Deploy the resources using the [az stack group](/azure/azure-resource-manager/bicep/deployment-stacks?tabs=azure-powershell) command in your terminal:

    ```azurecli
    az stack group create --name MyDeploymentStack \
    --resource-group $RESOURCE_GROUP --template-file /workspaces/explore-iot-operations/<filename>.bicep \
    --parameters customLocationName=$CUSTOM_LOCATION_NAME \
    --parameters schemaRegistryName=$SCHEMA_REGISTRY_NAME \
    --parameters aioInstanceName=$AIO_INSTANCE_NAME \
    --parameters opcuaSchemaName=$OPCUA_SCHEMA_NAME \
    --action-on-unmanage 'deleteResources' --deny-settings-mode 'none' --yes
    ```

This endpoint is the destination for the dataflow that receives messages to Azure Data Lake Storage Gen2.

```bicep
resource adlsGen2Endpoint 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-08-15-preview' = {
  parent: <AIO INSTANCE RESOURCE>
  name: '<ENDPOINT NAME>'
  extendedLocation: {
    name: '<CUSTOM LOCATION ID>'
    type: 'CustomLocation'
  }
  properties: {
    endpointType: 'DataLakeStorage'
    dataLakeStorageSettings: {
      host: 'https://<account>.blob.core.windows.net'
      authentication: {
        method: 'SystemAssignedManagedIdentity'
        systemAssignedManagedIdentitySettings: {}
      }
    }
  }
}
```

---

If you need to override the system-assigned managed identity audience, see the [System-assigned managed identity](#system-assigned-managed-identity) section.

---

### Use access token authentication

1. Follow the steps in the [access token](#access-token) section to get a SAS token for the storage account and store it in a Kubernetes secret.

# [Kubernetes](#tab/kubernetes)

1. Create the *DataflowEndpoint* resource and specify the access token authentication method.

    ```yaml
    apiVersion: connectivity.iotoperations.azure.com/v1beta1
    kind: DataflowEndpoint
    metadata:
      name: adls
    spec:
      endpointType: DataLakeStorage
      datalakeStorageSettings:
        host: <account>.blob.core.windows.net
        authentication:
          method: AccessToken
          accessTokenSettings:
            secretRef: my-sas
    ```

# [Bicep](#tab/bicep)

1. In the Bicep file, set the authentication method to access token in the DataflowEndpoint resource.
   
```bicep
resource adls 'connectivity.iotoperations.azure.com/v1beta1@2024-08-15-preview' = {
  kind: 'DataflowEndpoint'
  name: '<ENDPOINT NAME>'
  properties: {
    endpointType: 'DataLakeStorage'
    datalakeStorageSettings: {
      host: '<account>.blob.core.windows.net'
      authentication: {
        method: 'AccessToken'
        accessTokenSettings: {
          secretRef: 'my-sas'
        }
      }
    }
  }
}
```

---

## Configure dataflow destination

Once the endpoint is created, you can use it in a dataflow by specifying the endpoint name in the dataflow's destination settings. The following example is a dataflow configuration that uses the MQTT endpoint for the source and Azure Data Lake Storage Gen2 as the destination. The source data is from the MQTT topics `thermostats/+/telemetry/temperature/#` and `humidifiers/+/telemetry/humidity/#`. The destination sends the data to Azure Data Lake Storage table `telemetryTable`.

# [Kubernetes](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: Dataflow
metadata:
  name: my-dataflow
  namespace: azure-iot-operations
spec:
  profileRef: default
  mode: Enabled
  operations:
    - operationType: Source
      sourceSettings:
        endpointRef: mq
        dataSources:
          - thermostats/+/telemetry/temperature/#
          - humidifiers/+/telemetry/humidity/#
    - operationType: Destination
      destinationSettings:
        endpointRef: adls
        dataDestination: telemetryTable
```

# [Bicep](#tab/bicep)

```bicep
resource dataflow_adls 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflows@2024-08-15-preview' = {
  parent: defaultDataflowProfile
  name: '<DATAFLOW NAME>'
  extendedLocation: {
    name: '<CUSTOM LOCATION ID>'
    type: CustomLocation
  }
  properties: {
    mode: 'Enabled'
    operations: [
      {
        operationType: 'Source'
        sourceSettings: {
          sourceSettings: {
          endpointRef: '<SOURCE ENDPOINT NAME>'
          dataSources: [
            'thermostats/+/telemetry/temperature/#', 
            'humidifiers/+/telemetry/humidity/#'
          ]
        }
        }
      }
      {
        operationType: 'BuiltInTransformation'
        builtInTransformationSettings: {
          // Transformation configuration
        }
      }
      {
        operationType: 'Destination'
        destinationSettings: {
          endpointRef: '<DESTINATION ENDPOINT NAME>'
          dataDestination: '<destinationTopic>'
        }
      }
    ]
  }
}
```

---

For more information about dataflow destination settings, see [Create a dataflow](howto-create-dataflow.md).

> [!NOTE]
> Using the ADLSv2 endpoint as a source in a dataflow isn't supported. You can use the endpoint as a destination only.

To customize the endpoint settings, see the following sections for more information.

---

### Available authentication methods

The following authentication methods are available for Azure Data Lake Storage Gen2 endpoints.

For more information about enabling secure settings by configuring an Azure Key Vault and enabling workload identities, see [Enable secure settings in Azure IoT Operations Preview deployment](../deploy-iot-ops/howto-enable-secure-settings.md).

#### System-assigned managed identity

Using the system-assigned managed identity is the recommended authentication method for Azure IoT Operations. Azure IoT Operations creates the managed identity automatically and assigns it to the Azure Arc-enabled Kubernetes cluster. It eliminates the need for secret management and allows for seamless authentication with the Azure Data Lake Storage Gen2 account.

Before creating the dataflow endpoint, assign a role to the managed identity that has write permission to the storage account. For example, you can assign the *Storage Blob Data Contributor* role. To learn more about assigning roles to blobs, see [Authorize access to blobs using Microsoft Entra ID](../../storage/blobs/authorize-access-azure-active-directory.md).

# [Kubernetes](#tab/kubernetes)

In the *DataflowEndpoint* resource, specify the managed identity authentication method. In most cases, you don't need to specify other settings. Not specifying an audience creates a managed identity with the default audience scoped to your storage account.

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

# [Bicep](#tab/bicep)

In the *DataflowEndpoint* resource, specify the managed identity authentication method. In most cases, you don't need to specify other settings. Not specifying an audience creates a managed identity with the default audience scoped to your storage account.

```bicep
properties: {
    endpointType: 'DataLakeStorage'
    dataLakeStorageSettings: {
      authentication: {
        method: 'SystemAssignedManagedIdentity'
        systemAssignedManagedIdentitySettings: {}
      }
      ...
    }
  }
```

If you need to override the system-assigned managed identity audience, you can specify the `audience` setting.

```bicep
properties: {
    endpointType: 'DataLakeStorage'
    dataLakeStorageSettings: {
      authentication: {
        method: 'SystemAssignedManagedIdentity'
        systemAssignedManagedIdentitySettings: {
            audience: 'https://<account>.blob.core.windows.net'
        }
      }
      ...
    }
  }
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
kubectl create secret generic my-sas \
--from-literal=accessToken='sv=2022-11-02&ss=b&srt=c&sp=rwdlax&se=2023-07-22T05:47:40Z&st=2023-07-21T21:47:40Z&spr=https&sig=<signature>' \
-n azure-iot-operations
```

# [Kubernetes](#tab/kubernetes)

Create the *DataflowEndpoint* resource with the secret reference.

```yaml
datalakeStorageSettings:
  authentication:
    method: AccessToken
    accessTokenSettings:
      secretRef: my-sas
```

# [Bicep](#tab/bicep)

```bicep
resource adlsGen2Endpoint 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-08-15-preview' = {
  ...
  properties: {
    endpointType: 'DataLakeStorage'
    dataLakeStorageSettings: {
      authentication: {
        method: 'AccessToken'
        accessTokenSettings: {
            secretRef: 'my-sas'
        }
      }
      ...
    }
  }
}
```

---

#### User-assigned managed identity

To use a user-assigned managed identity, specify the `UserAssignedManagedIdentity` authentication method and provide the `clientId` and `tenantId` of the managed identity.

# [Kubernetes](#tab/kubernetes)

```yaml
datalakeStorageSettings:
  authentication:
    method: UserAssignedManagedIdentity
    userAssignedManagedIdentitySettings:
      clientId: <ID>
      tenantId: <ID>
```

# [Bicep](#tab/bicep)

```bicep
resource adlsGen2Endpoint 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-08-15-preview' = {
  ...
  properties: {
    endpointType: 'DataLakeStorage'
    dataLakeStorageSettings: {
      authentication: {
        method: 'UserAssignedManagedIdentity'
        userAssignedManagedIdentitySettings: {
            cliendId: '<ID>'
            tenantId: '<ID>'
        }
      }
      ...
    }
  }
}
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

# [Kubernetes](#tab/kubernetes)

Set the values in the dataflow endpoint custom resource.

```yaml
datalakeStorageSettings:
  batching:
    latencySeconds: 100
    maxMessages: 1000
```

# [Bicep](#tab/bicep)

Set the values in the dataflow endpoint bicep file.

```bicep
resource adlsGen2Endpoint 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-08-15-preview' = {
  parent: aioInstance
  name: '<ENDPOINT NAME>'
  ...
  properties: {
    endpointType: 'DataLakeStorage'
    dataLakeStorageSettings: {
      ...
      batching: {
        latencySeconds: 100
        maxMessages: 1000
      }
      ...
    }
  }
}
```

---