---
title: 'CLI (v2) YAML schema overview'
titleSuffix: Azure Machine Learning
description: Overview and index of CLI (v2) YAML schemas.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: cliv2, event-tier1-build-2022

author: balapv
ms.author: balapv
ms.date: 03/31/2022
ms.reviewer: scottpolly
---

# CLI (v2) YAML schemas

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The Azure Machine Learning CLI (v2), an extension to the Azure CLI, often uses and sometimes requires YAML files with specific schemas. This article lists reference docs and the source schema for YAML files. Examples are included inline in individual articles.



## Workspace

| Reference | URI |
| - | - |
| [Workspace](reference-yaml-workspace.md) | https://azuremlschemas.azureedge.net/latest/workspace.schema.json |

## Environment

| Reference | URI |
| - | - |
| [Environment](reference-yaml-environment.md) | https://azuremlschemas.azureedge.net/latest/environment.schema.json |

## Data

| Reference | URI |
| - | - |
| [Dataset](reference-yaml-data.md) | https://azuremlschemas.azureedge.net/latest/data.schema.json |

## Model

| Reference | URI |
| - | - |
| [Model](reference-yaml-model.md) | https://azuremlschemas.azureedge.net/latest/model.schema.json |

## Schedule

| Reference | URI |
| - | - |
| [CLI (v2) schedule YAML schema](reference-yaml-schedule.md) | https://azuremlschemas.azureedge.net/latest/schedule.schema.json |


## Compute

| Reference | URI |
| - | - |
| [Compute cluster (AmlCompute)](reference-yaml-compute-aml.md) | https://azuremlschemas.azureedge.net/latest/amlCompute.schema.json |
| [Compute instance](reference-yaml-compute-instance.md) | https://azuremlschemas.azureedge.net/latest/computeInstance.schema.json |
| [Attached Virtual Machine](reference-yaml-compute-vm.md) | https://azuremlschemas.azureedge.net/latest/vmCompute.schema.json |
| [Attached Azure Arc-enabled Kubernetes (KubernetesCompute)](reference-yaml-compute-kubernetes.md) | `https://azuremlschemas.azureedge.net/latest/kubernetesCompute.schema.json` |

## Job

| Reference | URI |
| - | - |
| [Command](reference-yaml-job-command.md) | https://azuremlschemas.azureedge.net/latest/commandJob.schema.json |
| [Sweep](reference-yaml-job-sweep.md) | https://azuremlschemas.azureedge.net/latest/sweepJob.schema.json |
| [Pipeline](reference-yaml-job-pipeline.md) | https://azuremlschemas.azureedge.net/latest/pipelineJob.schema.json |

## Datastore

| Reference | URI |
| - | - |
| [Azure Blob](reference-yaml-datastore-blob.md) | https://azuremlschemas.azureedge.net/latest/azureBlob.schema.json |
| [Azure Files](reference-yaml-datastore-files.md) | https://azuremlschemas.azureedge.net/latest/azureFile.schema.json |
| [Azure Data Lake Gen1](reference-yaml-datastore-data-lake-gen1.md) | https://azuremlschemas.azureedge.net/latest/azureDataLakeGen1.schema.json |
| [Azure Data Lake Gen2](reference-yaml-datastore-data-lake-gen2.md) | https://azuremlschemas.azureedge.net/latest/azureDataLakeGen2.schema.json |

## Endpoint

| Reference | URI |
| - | - |
| [Managed online (real-time)](reference-yaml-endpoint-online.md) | https://azuremlschemas.azureedge.net/latest/managedOnlineEndpoint.schema.json |
| [Kubernetes online (real-time)](reference-yaml-endpoint-online.md) | https://azuremlschemas.azureedge.net/latest/kubernetesOnlineEndpoint.schema.json |
| [Batch](reference-yaml-endpoint-batch.md) | https://azuremlschemas.azureedge.net/latest/batchEndpoint.schema.json |

## Deployment

| Reference | URI |
| - | - |
| [Managed online (real-time)](reference-yaml-deployment-managed-online.md) | https://azuremlschemas.azureedge.net/latest/managedOnlineDeployment.schema.json |
| [Kubernetes online (real-time)](reference-yaml-deployment-kubernetes-online.md) | https://azuremlschemas.azureedge.net/latest/kubernetesOnlineDeployment.schema.json |
| [Batch](reference-yaml-deployment-batch.md) | https://azuremlschemas.azureedge.net/latest/batchDeployment.schema.json |

## Component

| Reference | URI |
| - | - |
| [Command](reference-yaml-component-command.md) | https://azuremlschemas.azureedge.net/latest/commandComponent.schema.json |

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
