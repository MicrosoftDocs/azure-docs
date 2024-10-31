---
title: Configure dataflow profile in Azure IoT Operations
description: How to configure a dataflow profile in Azure IoT Operations to change a dataflow behavior.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 08/29/2024

#CustomerIntent: As an operator, I want to understand how to I can configure a a dataflow profile to control a dataflow behavior.
---

# Configure dataflow profile

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

By default, when you deploy Azure IoT Operations, a dataflow profile is created with default settings. You can configure the dataflow profile to suit your needs.

<!-- TODO: link to reference docs -->

## Default dataflow profile

By default, a dataflow profile named "default" is created when Azure IoT Operations is deployed.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowProfile
metadata:
  name: default
  namespace: azure-iot-operations
spec:
  instanceCount: 1
```

In most cases, you don't need to change the default settings. However, you can create additional dataflow profiles and configure them as needed.

## Scaling

To manually scale the dataflow profile, specify the maximum number of instances you want to run.

```yaml
spec:
  instanceCount: 3
```

If not specified, Azure IoT Operations automatically scales the dataflow profile based on the dataflow configuration. The number of instances is determined by the number of dataflows and the shared subscription configuration.

> [!IMPORTANT]
> Currently in public preview, adjusting the instance count may result in message loss. At this time, it's recommended to not adjust the instance count.

## Configure log level, node tolerations, diagnostic settings, and other deployment-wide settings

You can configure other deployment-wide settings such as log level, node tolerations, and diagnostic settings.

```yaml
spec:
  logLevel: debug
  tolerations:
    - key: "node-role.kubernetes.io/edge"
      operator: "Equal"
      value: "true"
      effect: "NoSchedule"
  diagnostics:
    # ...
```

## Next steps

To learn more about dataflows, see [Create a dataflow](howto-create-dataflow.md).