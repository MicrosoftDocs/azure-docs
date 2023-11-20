---
title: Troubleshoot Azure IoT Operations
description: Troubleshoot your Azure IoT Operations deployment
author: kgremban
ms.author: kgremban
ms.topic: troubleshooting-general
ms.custom:
  - ignite-2023
ms.date: 09/20/2023
---

# Troubleshoot Azure IoT Operations

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

This article contains troubleshooting tips for Azure IoT Operations Preview.

## Data Processor pipeline deployment status is failed

Your Data Processor pipeline deployment status is showing as **Failed**.

### Find pipeline error codes

To find the pipeline error codes, use the following commands.

To list the Data Processor pipeline deployments, run the following command:

```bash
kubectl get pipelines -A
```

The output from the pervious command looks like the following example:

```text
NAMESPACE                NAME                           AGE
azure-iot-operations     passthrough-data-pipeline      2d20h
azure-iot-operations     reference-data-pipeline        2d20h
azure-iot-operations     contextualized-data-pipeline   2d20h
```

To view detailed information for a pipeline, run the following command:

```bash
kubectl describe pipelines passthrough-data-pipeline -n azure-iot-operations
```

The output from the previous command looks like the following example:

```text
...
Status:
  Provisioning Status:
    Error
      Code:  <ErrorCode>
      Message: <ErrorMessage>
    Status:        Failed
Events:            <none>
```
