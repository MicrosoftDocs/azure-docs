---
title: Troubleshoot Azure IoT Operations – enabled by Azure Arc Preview
description: Troubleshoot your Azure IoT Operations deployment
author: kgremban
ms.author: kgremban
ms.topic: troubleshooting-general
ms.date: 09/20/2023
---

# Troubleshoot Azure IoT Operations

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

This article contains troubleshooting tips for Azure IoT Operations – enabled by Azure Arc.

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
alice-springs-solution   passthrough-data-pipeline      2d20h
alice-springs-solution   reference-data-pipeline        2d20h
alice-springs-solution   contextualized-data-pipeline   2d20h
```

To view detailed information for a pipeline, run the following command:

```bash
kubectl describe pipelines passthrough-data-pipeline -n alice-springs-solution
```

The output from the pervious command looks like the following example:

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

## Cause 2: \<summarize the key info of the cause>
TODO: Add a description of the cause.

### Solution 1: \<summarize the key info of the solution>

1. Step 1.
2. Step 2.

### Solution 2: \<summarize the key info of the solution>

1. Step 1.
2. Step 2.
