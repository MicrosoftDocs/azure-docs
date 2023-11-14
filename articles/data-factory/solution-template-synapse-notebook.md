---
title: Call Synapse pipeline with a notebook activity
description:  Learn how to use a solution template to call a Synapse pipeline with a notebook activity in Azure Data Factory.
ms.author: chugu
author: chugugrace
ms.service: data-factory
ms.subservice: tutorials
ms.topic: conceptual
ms.date: 08/10/2023
---

# Call Synapse pipeline with a notebook activity

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

In this tutorial, you create an end-to-end pipeline that contains the **Web**, **Until**, and **Fail** activities in Azure Data Factory.

- **Web** calls a Synapse pipeline with a notebook activity.

- **Until** gets Synapse pipeline status until completion (status output as *Succeeded*, *Failed*, or *canceled*).

- **Fail** fails activity and customizes both error message and error code.

## Prerequisites

- You have a [Synapse pipeline with a notebook activity](../synapse-analytics/synapse-notebook-activity.md).
- Use role-based access control(RBAC) to grant permissions for Data Factory to call Synapse workspace endpoint, details refer to [Managed Identity](control-flow-web-activity.md#managed-identity).
- Grant permissions for Data Factory to execute/run Synapse pipeline, details refer to [Synapse RBAC roles](../synapse-analytics/security/synapse-workspace-understand-what-role-you-need.md#tasks-and-required-roles).

## How to use this template

1. Go to the **Call Synapse pipeline with a notebook activity** template.

1. Select **Use this template**. You'll see a pipeline created.

    :::image type="content" source="media/solution-template-synapse-notebook/pipeline.png" alt-text="New pipeline":::

## Pipeline introduction and configuration

Review the configurations of your pipeline and make any necessary changes.

1. Pipeline parameters. Change settings if necessary.

    - *SynapseEndpoint*: The workspace development endpoint, for example https://`myworkspace`.dev.azuresynapse.net.
    - *PLName*: Synapse pipeline name in Synapse workspace to execute.
    - *FailedOrCancelledErrorCode*: Customize error code if Synapse pipeline fails.
    
        :::image type="content" source="media/solution-template-synapse-notebook/pipeline-parameters.png" alt-text="Pipeline parameters":::

1. A **Web** activity to call Synapse pipeline.

    - *URL*: `@Concat(pipeline().parameters.SynapseEndpoint,'/pipelines/',pipeline().parameters.PLName,'/createRun?api-version=2020-12-01')`. Refer to [Create pipeline run via Synapse REST API](/rest/api/synapse/data-plane/pipeline/create-pipeline-run).
    - *Authentication*: **Managed Identity** is used for authentication. Refer to [Prerequisites](#prerequisites) to grant necessary permissions.
    - *Resource* : `https://dev.azuresynapse.net/`.
    
        :::image type="content" source="media/solution-template-synapse-notebook/web-call-synapse-pipeline-setting.png" alt-text="Call Synapse pipeline":::

1. Do **Web** activity to get Synapse pipeline status, **Until** web activity returns status of *Succeeded*, *Failed*, or *Canceled*.
    - **Web** *URL*: `@concat(pipeline().parameters.SynapseEndpoint,'/pipelineruns/',activity('Call Synapse Pipeline with Notebook').output.runId,'?api-version=2020-12-01')`. Refer to [Synapse Get Pipeline Run REST API](/rest/api/synapse/data-plane/pipeline-run/get-pipeline-run).
    
        :::image type="content" source="media/solution-template-synapse-notebook/get-pipeline-status.png" alt-text="Get pipeline status":::
    
    - **Until** *expression*: `@or(or(equals('Succeeded',activity('Get run status').output.status),equals('Failed',activity('Get run status').output.status)),equals('Cancelled',activity('Get run status').output.status))`.
    
        :::image type="content" source="media/solution-template-synapse-notebook/until-setting.png" alt-text="Until setting":::

1. An **If Condition** activity evaluates pipeline run status.
    - *Expression*": `@equals('Failed',activity('Get run status').output.status)`

    :::image type="content" source="media/solution-template-synapse-notebook/if-condition.png" alt-text="If condition":::

1. A **Fail** activity to fail the pipeline.
    - *Fail message*: `@activity('Get run status').output.message`
    - *Error code*: `@pipeline().parameters.FailedOrCancelledErrorCode`

        :::image type="content" source="media/solution-template-synapse-notebook/fail-activity.png" alt-text="Fail pipeline":::

## Next steps

- [Overview of templates](solution-templates-introduction.md)