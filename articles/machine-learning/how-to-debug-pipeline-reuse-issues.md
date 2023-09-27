---
title: Debug pipeline reuse issues in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how reuse works in pipeline and how to debug reuse issues 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.reviewer: lagayhar
author: zhanxia
ms.author: zhanxia
ms.date: 4/28/2023
---

# How to debug pipeline reuse issues in Azure Machine Learning?

In this article, we explain:

- What is reuse in Azure Machine Learning pipeline
- How does reuse works
- Step by step guidance to debug reuse issues

## What is reuse in Azure Machine Learning pipeline?

Building models with Azure Machine Learning pipeline is an iterative process. As a data scientist, you can start with a basic pipeline and then experiment with different machine learning algorithms or do hyperparamter tuning to improve your model. During this process, you'll submit many pipeline jobs that may only have small changes compared to the previous job. With the reuse feature, the pipeline can automatically use the output from a previous job if it meets certain criteria, without running the component again. This can save you time and money while developing your pipeline.

:::image type="content" source="./media/how-to-debug-pipeline-reuse/reuse-demo.png" alt-text="A diagram showing two pipeline jobs and which components are being reused between them.":::

In the diagram, the data scientist first submits `job_1`, then adds `Component_D` to the pipeline and submits `job_2`. When executing pipeline `job_2`, the pipeline service detects the output for `Component_A`, `Component_B` and `Component_C`, which remain unchanged. So it doesn't run the first three components again. Instead it reuses the output from `job_1` and only runs `Component_D` in `job_2`.  
 
## How does reuse work?

Azure Machine Learning pipeline has holistic logic to calculate whether a component's output can be reused. The next diagram explains the reuse criteria.

:::image type="content" source="./media/how-to-debug-pipeline-reuse/reuse-logic.png" alt-text="Diagram showing the reuse-logic and criteria.":::

Reuse criteria:

- Component definition `is_deterministic` = true
- Pipeline runtime setting `ForceReRun` = false
- Component code, environment definition, inputs and parameters, output settings, and run settings are all the same.

If a component meets the reuse criteria, the pipeline service skips execution for the component, copies original component's status, displays original component's output/logs/metrics for the reused component. In the pipeline UI, the reused component shows a little recycle icon to indicate this component has been reused.  

:::image type="content" source="./media/how-to-debug-pipeline-reuse/recycle-icon.png" alt-text="Screenshot showing the recycle-icon on component.":::

## Steps to debug pipeline reuse issues

If reuse isn't working as expected in your pipeline, try the following steps to debug.

### Step 1: Check if pipeline setting ForceRerun=True

If the pipeline setting `ForceRerun` is set to `True`, all child jobs of the pipeline rerun.

>[!Note]
> All child jobs of the force rerun pipeline cannot be reused by other jobs. So make sure you check the *ForceRerun* value both for the job you expect to reuse and the original job you wish to reuse from.

To check the `ForceRerun` setting in pipeline UI, go to pipeline job overview tab.

:::image type="content" source="./media/how-to-debug-pipeline-reuse/force-rerun.png" alt-text="Screenshot of pipeline job overview tab with force rerun highlighted.":::

### Step 2: Check if component definition is_deterministic = True

Right click on a component and select **View definition**.

:::image type="content" source="./media/how-to-debug-pipeline-reuse/view-definition.png" alt-text="Screenshot showing view component definition.":::

`is_deterministic = True` means this component produces the same output for the same input data. If it's set to `False`, the component always reruns.

### Step 3: Check if there's any code change by comparing "ContentSnapshotId"

If you have two jobs, you expected the second job to reuse the first job, but it didn't. You can compare the component snapshot in the two jobs. If the snapshot ID changes, it means there's some component code content change, which leads to a rerun.

1. Double click a component to open it's right panel
1. Open **Raw JSON** under Overview tab
1. Search for snapshot ID in the raw JSON

:::image type="content" source="./media/how-to-debug-pipeline-reuse/check-snapshot.gif" alt-text="Gif showing the jobs tab and opening component overview to check named component snapshot ID." lightbox = "./media/how-to-debug-pipeline-reuse/check-snapshot.gif":::


### Step 4: Check if there's any environment change

If you're using inline environment, compare the environment definition in the component YAML. Your component YAML may not be uploaded to the Code tab. In such cases, you need to go to your component source code to check the environment definition for your component.

:::image type="content" source="./media/how-to-debug-pipeline-reuse/inline-env.png" alt-text="Screenshot showing how to check inline environment in the code tab." lightbox = "./media/how-to-debug-pipeline-reuse/inline-env.png":::

If you're using named environment, compare environment name and definition by going to the environments tab.

:::image type="content" source="./media/how-to-debug-pipeline-reuse/named-env.png" alt-text="Screenshot showing how to check named environment in the environment tab." lightbox= "./media/how-to-debug-pipeline-reuse/named-env.png":::

You can copy paste the env definition of the two jobs, then compare them using a local editor like VS Code or Notepad++.

The environment can also be compared in the graph comparison feature. We'll cover graph compare in next step.

### Step 5: Use graph comparison to check if there's any other change to the inputs, parameters, output settings, run settings

You can compare the input data, parameters, output settings, run settings of the two components using graph compare. To learn more, see  [how to enable and use the graph compare feature](./how-to-use-pipeline-ui.md#compare-different-pipelines-to-debug-failure-or-other-unexpected-issues-preview)

:::image type="content" source="./media/how-to-debug-pipeline-reuse/compare.png" alt-text="Screenshot showing detail comparison.":::

### Step 6: Contact Microsoft for support

If you follow all above steps, and you still can't find the root cause of unexpected rerun, you can [file a support case ticket](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) to Microsoft to get help.
