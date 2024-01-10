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

## Data is corrupted in the Microsoft Fabric lakehouse table

If data is corrupted in the Microsoft Fabric lakehouse table that your Data Processor pipeline is writing to, make sure that no other processes are writing to the table. If you write to the Microsoft Fabric lakehouse table from multiple sources, you might see corrupted data in the table.

## Deployment issues with Data Processor

If you see deployment errors with Data Processor pods, make sure that when you created your Azure Key Vault you chose **Vault access policy** as the **Permission model**.

## Data Processor pipeline edits aren't applied to messages

If edits you make to a pipeline aren't applied to messages, run the following commands to propagate the changes:

```bash
kubectl rollout restart deployment aio-dp-operator -n azure-iot-operations 

kubectl rollout restart statefulset aio-dp-runner-worker -n azure-iot-operations 

kubectl rollout restart statefulset aio-dp-reader-worker -n azure-iot-operations
```

## Data Processor pipeline processing pauses unexpectedly

It's possible a momentary loss of communication with IoT MQ broker pods can pause the processing of data pipelines. You might also see errors such as `service account token expired`. If you notice this happening, run the following commands:

```bash
kubectl rollout restart statefulset aio-dp-runner-worker -n azure-iot-operations
kubectl rollout restart statefulset aio-dp-reader-worker -n azure-iot-operations
```

