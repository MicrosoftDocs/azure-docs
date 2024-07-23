---
title: Manage dataflows
description: How to manage dataflows.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-mqtt-broker
ms.topic: conceptual
ms.date: 07/11/2024

#CustomerIntent: As an operator, I want to understand how to I can use Dataflows to .
---

# Manage dataflows

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

## Configure dataflow profile

By default, when you deploy Azure IoT Operations, a dataflow profile is created with default settings. You can configure the dataflow profile to suit your needs.

### Default settings

The default settings for a dataflow profile are:

* Instances: (null)
* Log level: Info
* Node tolerations: None
* Diagnostic settings: None

### Scaling

To manually scale the dataflow profile, specify the maximum number of instances you want to run.

```yaml
spec:
  maxInstances: 3
```

Or use the portal under the Dataflows > Scaling section and set the number of instances.

If not specified, Azure IoT Operations automatically scales the dataflow profile based on the dataflow configuration. The number of instances is determined by the number of dataflows and the shared subscription configuration.

### Configure log level, node tolerations, diagnostic settings, and other deployment-wide settings

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
    ...
```

Or use the portal under the Dataflows > Settings section.

## Manage dataflows

### Enable or disable dataflow

To enable or disable a dataflow, you can use the Azure IoT Operations portal or by updating the Dataflow CR.

```yaml
spec:
  mode: disabled
```

### View dataflow health status and metrics

You can view the health status and metrics of the dataflow in the Azure IoT Operations portal.

### Delete dataflow

To delete a dataflow, you can use the Azure IoT Operations portal or by deleting the Dataflow CR.

```bash
kubectl delete dataflow my-dataflow
```

### Export dataflow configuration

To export the dataflow configuration, you can use the Azure IoT Operations portal or by exporting the Dataflow CR.

```bash
kubectl get dataflow my-dataflow -o yaml > my-dataflow.yaml
```

## Manage endpoints

### View

You can view the health, metrics, configuration, and associated dataflows of an endpoint in the Azure IoT Operations portal.

### Edit

You can edit an endpoint in the Azure IoT Operations portal. Be cautious if the endpoint is in use by a dataflow.

### Delete

You can delete an endpoint in the Azure IoT Operations portal. Be cautious if the endpoint is in use by a dataflow.

```bash
kubectl delete endpoint my-endpoint
```
## Next steps

Tutorial
