---
title: Configure data flow profile in Azure IoT Operations
description: How to configure a data flow profile in Azure IoT Operations to change a data flow behavior.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 03/06/2025

#CustomerIntent: As an operator, I want to understand how to I can configure a a data flow profile to control a data flow behavior.
---

# Configure data flow profile

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

Data flow profiles can be used to group data flows together so that they share the same configuration. You can create multiple data flow profiles to manage sets of different data flow configurations. 

The most important setting is the instance count, which determines the number of instances that run the data flows. For example, you might have a data flow profile with a single instance for development and testing, and another profile with multiple instances for production. Or, you might use a data flow profile with low instance count for low-throughput data flows and a profile with high instance count for high-throughput data flows. Similarly, you can create a data flow profile with different diagnostic settings for debugging purposes.

## Default data flow profile

By default, a data flow profile named *default* is created when Azure IoT Operations is deployed. This data flow profile has a single instance count. You can use this data flow profile to get started with Azure IoT Operations.

> [!IMPORTANT]
> Currently, the default data flow profile is the only profile supported by the [operations experience portal](https://iotoperations.azure.com/). All data flows created using the operations experience portal use the default data flow profile.

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

// Pointer to the default data flow profile
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


## Scaling

You can scale the data flow profile to adjust the number of instances that run the data flows. Increasing the instance count can improve the throughput of the data flows by creating multiple clients to process the data. When using data flows with cloud services that have rate limits per client, increasing the instance count can help you stay within the rate limits.

Scaling can also improve the resiliency of the data flows by providing redundancy in case of failures.

To manually scale the data flow profile, specify the number of instances you want to run. For example, to set the instance count to 3:

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

You can configure other diagnostics settings for a data flow profile such as log level and metrics interval. 

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

To learn more about data flows, see [Create a data flow](howto-create-dataflow.md).