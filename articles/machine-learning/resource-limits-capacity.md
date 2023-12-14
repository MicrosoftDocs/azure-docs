---
title: Service limits
titleSuffix: Azure Machine Learning
description: Service limits used for capacity planning and maximum limits on requests and responses for Azure Machine Learning.
services: machine-learning
author: blackmist
ms.author: larryfr
ms.reviewer: larryfr
ms.topic: reference
ms.service: machine-learning
ms.subservice: core
ms.date: 09/13/2023
ms.metadata: product-dependency
---

# Service limits in Azure Machine Learning

This section lists basic limits and throttling thresholds in Azure Machine Learning. 

> [!IMPORTANT]
> Azure Machine Learning doesn't store or process your data outside of the region where you deploy.

## Workspaces

| Limit | Value |
| --- | --- |
| Workspace name | 2-32 characters |

## Experiments
| Limit | Value |
| --- | --- |
| Name | 256 characters |
| Description | 5,000 characters |
| Number of tags | 50 |
| Length of tag key | 250 characters |
| Length of tag value | 1000 characters |
| Artifact location | 1024 characters |

## Runs
| Limit | Value |
| --- | --- |
| Runs per workspace | 10 million |
| RunId/ParentRunId | 256 characters |
| DataContainerId | 261 characters |
| DisplayName |256 characters|
| Description |5,000 characters|
| Number of properties |50 |
| Length of property key |100 characters |
| Length of property value |1,000 characters |
| Number of tags |50 |
| Length of tag key |100 |
| Length of tag value |1,000 characters |
| CancelUri / CompleteUri / DiagnosticsUri |1,000 characters |
| Error message length |3,000 characters |
| Warning message length |300 characters |
| Number of input datasets |200 |
| Number of output datasets |20 |

## Custom environments
| Limit | Value |
| --- | --- |
| Number of files in Docker build context | 100 |
| Total files size in Docker build context | 1 MB |

## Metrics
| Limit | Value |
| --- | --- |
| Metric names per run |50|
| Metric rows per metric name |1 million|
| Columns per metric row |15|
| Metric column name length |255 characters |
| Metric column value length |255 characters |
| Metric rows per batch uploaded | 250 |

> [!NOTE]
> If you are hitting the limit of metric names per run because you are formatting variables into the metric name, consider instead to use a row metric where one column is the variable value and the second column is the metric value.

## Artifacts

| Limit | Value |
| --- | --- |
| Number of artifacts per run |10 million|
| Max length of artifact path |5,000 characters |

## Models

| Limit | Value |
| --- | --- |
| Number of models per workspace | 5 million model containers/versions (including previously deleted models) |
| Number of artifacts per model version | 1,500 artifacts (files) |

## Limit increases

Some limits can be increased for individual workspaces. To learn how to increase these limits, see ["Manage and increase quotas for resources"](how-to-manage-quotas.md)

## Next steps

- Learn how increase resource quotas in ["Manage and increase quotas for resources"](how-to-manage-quotas.md).
