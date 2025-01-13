---
title: Configure dataflow profile in Azure IoT Operations
description: How to configure a dataflow profile in Azure IoT Operations to change a dataflow behavior.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 11/11/2024

#CustomerIntent: As an operator, I want to understand how to I can configure a a dataflow profile to control a dataflow behavior.
---

# Configure dataflow profile

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

Dataflow profiles can be used to group dataflows together so that they share the same configuration. You can create multiple dataflow profiles to manage sets of different dataflow configurations. 

The most important setting is the instance count, which determines the number of instances that run the dataflows. For example, you might have a dataflow profile with a single instance for development and testing, and another profile with multiple instances for production. Or, you might use a dataflow profile with low instance count for low-throughput dataflows and a profile with high instance count for high-throughput dataflows. Similarly, you can create a dataflow profile with different diagnostic settings for debugging purposes.

## Default dataflow profile

By default, a dataflow profile named "default" is created when Azure IoT Operations is deployed. This dataflow profile has a single instance count. You can use this dataflow profile to get started with Azure IoT Operations.

Currently, when using the [operations experience portal](https://iotoperations.azure.com/), the default dataflow profile is used for all dataflows.

# [Bicep](#tab/bicep)

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

// Pointer to the Azure IoT Operations instance
resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}

// Pointer to your custom location where AIO is deployed
resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

// Pointer to the default dataflow profile
resource defaultDataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2024-11-01' = {
  parent: aioInstance
  name: 'default'
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    instanceCount: 1
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowProfile
metadata:
  name: default
  namespace: azure-iot-operations
spec:
  instanceCount: 1
```

---

Unless you need additional throughput or redundancy, you can use the default dataflow profile for your dataflows. If you need to adjust the instance count or other settings, you can create a new dataflow profile.

## Create a new dataflow profile

To create a new dataflow profile, specify the name of the profile and the instance count.

# [Bicep](#tab/bicep)

```bicep
resource dataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2024-11-01' = {
  parent: aioInstance
  name: '<NAME>'
  properties: {
    instanceCount: <COUNT>
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowProfile
metadata:
  name: '<NAME>'
  namespace: azure-iot-operations
spec:
  instanceCount: <COUNT>
```

---

## Scaling

You can scale the dataflow profile to adjust the number of instances that run the dataflows. Increasing the instance count can improve the throughput of the dataflows by creating multiple clients to process the data. When using dataflows with cloud services that have rate limits per client, increasing the instance count can help you stay within the rate limits.

Scaling can also improve the resiliency of the dataflows by providing redundancy in case of failures.

To manually scale the dataflow profile, specify the number of instances you want to run. For example, to set the instance count to 3:

# [Bicep](#tab/bicep)

```bicep
properties: {
  instanceCount: 3
}
```


# [Kubernetes (preview)](#tab/kubernetes)

```yaml
spec:
  instanceCount: 3
```

---

## Diagnostic settings

You can configure other diagnostics settings for a dataflow profile such as log level and metrics interval. 

In most cases, the default settings are sufficient. However, you can override the log level or other settings for debugging. 

To learn how to configure these diagnostic settings, see [ProfileDiagnostics](/rest/api/iotoperations/dataflow-profile/create-or-update?#profilediagnostics).

For example, to set the log level to debug:

# [Bicep](#tab/bicep)

```bicep
resource dataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2024-11-01' = {
  parent: aioInstance
  name: '<NAME>'
  properties: {
    instanceCount: 1
    diagnostics: {
      {
        logs: {
          level: 'debug'
        }
      }
    }
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowProfile
metadata:
  name: '<NAME>'
  namespace: azure-iot-operations
spec:
  instanceCount: 1
  diagnostics:
    logs:
      level: debug
```

---

## Next steps

To learn more about dataflows, see [Create a dataflow](howto-create-dataflow.md).