---
title: 'CLI (v2) YAML schema overview'
titleSuffix: Azure Machine Learning
description: Overview and index of CLI (v2) YAML schemas.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: lostmygithubaccount
ms.author: copeters
ms.date: 08/03/2021
ms.reviewer: laobri
---

# CLI (v2) YAML schemas

The Azure Machine Learning CLI (v2), an extension to the Azure CLI, often uses and sometimes requires YAML files with specific schemas. This article lists reference docs and the source schema for YAML files.

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Assets

Reference | URI
- | -
[Workspace](reference-yaml-workspace.md) | https://azuremlschemas.azureedge.net/latest/workspace.schema.json
[Compute](reference-yaml-compute.md) | https://azuremlschemas.azureedge.net/latest/compute.schema.json
[Environment](reference-yaml-environment.md) | https://azuremlschemas.azureedge.net/latest/environment.schema.json
[Dataset](reference-yaml-dataset.md) | https://azuremlschemas.azureedge.net/latest/dataset.schema.json
[Model](reference-yaml-model.md) | https://azuremlschemas.azureedge.net/latest/model.schema.json

## Datastores

Reference | URI
- | -
[Azure Blob](reference-yaml-datastore-blob.md) | https://azuremlschemas.azureedge.net/latest/azureBlob.schema.json
[Azure Files](reference-yaml-datastore-files.md) | https://azuremlschemas.azureedge.net/latest/azureFile.schema.json
[Azure Data Lake Gen1](reference-yaml-datastore-data-lake-gen1.md) | https://azuremlschemas.azureedge.net/latest/azureDataLakeGen1.schema.json
[Azure Data Lake Gen2](reference-yaml-datastore-data-lake-gen2.md) | https://azuremlschemas.azureedge.net/latest/azureDataLakeGen2.schema.json

## Jobs

Reference | URI
- | -
[Command](reference-yaml-job-command.md) | https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
[Sweep](reference-yaml-job-sweep.md) | https://azuremlschemas.azureedge.net/latest/sweepJob.schema.json

## Endpoints

Reference | URI
- | -
[Managed online (real-time)](reference-yaml-endpoint-managed-online.md) | https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json
[Managed batch](reference-yaml-endpoint-managed-batch.md) | https://azuremlschemas.azureedge.net/latest/batchEndpoint.schema.json
[Kubernetes (k8s) online (real-time)](reference-yaml-endpoint-k8s-online.md) | https://azuremlschemas.azureedge.net/latest/k8sOnlineEndpoint.schema.json

## Deployments

Reference | URI
- | -
[Managed online (real-time)](reference-yaml-deployment-managed-online.md) | https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json
[Managed batch](reference-yaml-deployment-managed-batch.md) | https://azuremlschemas.azureedge.net/latest/batchDeployment.schema.json
[Kubernetes (k8s) online (real-time)](reference-yaml-deployment-k8s-online.md) | https://azuremlschemas.azureedge.net/latest/k8sOnelineDeployment.schema.json

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
