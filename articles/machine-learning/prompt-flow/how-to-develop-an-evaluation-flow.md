---
title: Develop an evaluation flow in Prompt flow (preview)
titleSuffix: Azure Machine Learning
description: Learn how to customize or create your own evaluation flow tailored to your tasks and objectives, and then use in a bulk test as an evaluation method in Prompt flow with Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: ZikeiWong
ms.author: ziqiwang
ms.reviewer: lagayhar
ms.date: 06/30/2023
---

# Develop an evaluation flow (preview)

Evaluation flows are special types of flows that assess how well the outputs of a flow align with specific criteria and goals.

In Prompt flow, you can customize or create your own evaluation flow tailored to your tasks and objectives, and then use in a bulk test as an evaluation method. This document you'll learn:

- How to develop an evaluation method
  - Customize built-in evaluation Method
  - Create new evaluation Flow from Scratch
- Understand evaluation in Prompt flow
  - Inputs
  - Outputs and Metrics Logging

> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Starting to develop an evaluation method

There are two ways to develop your own evaluation methods:

- **Customize a Built-in Evaluation Flow:** Modify a built-in evaluation method based on your needs.
- **Create a New Evaluation Flow from Scratch:**  Develop a brand-new evaluation method from the ground up.

The process of customizing and creating evaluation methods is similar to that of a standard flow.

### Customize built-in evaluation method to measure the performance of a flow

Find the built-in evaluation methods by selecting the  **"Create"**  button on the homepage and navigating to the Create from gallery -\> Evaluation tab. View more details about the evaluation method by selecting  **"View details"**.

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/create-from-gallery.png" alt-text="Screenshot of the Prompt flow gallery with the evaluation tab selected. " lightbox = "./media/how-to-develop-an-evaluation-flow/create-from-gallery.png":::

If you want to customize this evaluation method, you can select the **"Clone"** button.

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/customize-built-in.png" alt-text="Screenshot of Classification Accuracy Evaluation with the clone button highlighted. " lightbox = "./media/how-to-develop-an-evaluation-flow/customize-built-in.png":::

By the name of the flow, you can see an **"evaluation"** tag, indicating you're building an evaluation flow. Similar to cloning a sample flow from gallery, you'll be able to view and edit the flow and the codes and prompts of the evaluation method.

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/evaluation-tag.png" alt-text="Screenshot of Classification Accuracy Evaluation with the evaluation tag underlined. " lightbox = "./media/how-to-develop-an-evaluation-flow/evaluation-tag.png":::

Alternatively, you can customize a built-in evaluation method used in a bulk test by clicking the  **"Clone"**  icon when viewing its snapshot from the bulk test detail page.

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/clone-from-snapshot.gif" alt-text="Gif of cloning a Web Classification bulk test. " lightbox = "./media/how-to-develop-an-evaluation-flow/clone-from-snapshot.gif":::

### Create new evaluation flow from scratch

To create your evaluation method from scratch, select the  **"Create"** button on the homepage and select  **"Evaluation"** as the flow type. You'll enter the flow authoring page.

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/create-by-type.png" alt-text="Screenshot of tiles from the Prompt flow gallery with the create button highlighted on evaluation flow. " lightbox = "./media/how-to-develop-an-evaluation-flow/create-by-type.png":::

## Understand evaluation in Prompt flow

In Prompt flow, a flow is a sequence of nodes that process an input and generate an output. Evaluation methods also take required inputs and produce corresponding outputs.

Some special features of evaluation methods are:

1. They need to handle outputs from flows that contain multiple variants.
2. They usually run after a flow being tested, so there's a field mapping process when submitting an evaluation.
3. They may have an aggregation node that calculates the overall performance of the flow being tested based on the individual scores.

We'll introduce how the inputs and outputs should be defined in developing evaluation methods.

### Inputs

Different from a standard flow, evaluation methods run after a flow being tested, which may have multiple variants. Therefore, evaluation needs to distinguish the sources of the received flow output in a bulk test, including the data sample and variant the output is generated from.

To build an evaluation method that can be used in a bulk test, two additional inputs are required: line\_number and variant\_id(s).

- **line\_number:**  the index of the sample in the test dataset
- **variant\_id(s):** the variant ID that indicates the source variant of the output

There are two types of evaluation methods based on how to process outputs from different variants:

- **Point-based evaluation method:** This type of evaluation flow calculates metrics based on the outputs from different variants **independently and separately.** "line\_number" and  **"variant\_id"**  are the required flow inputs. The receiving output of a flow is from a single variant. Therefore, the evaluation input "variant\_id" is a **string** indicating the source variant of the output.

| Field name | Type | Description | Examples |
| --- | --- | --- | --- |
| line\_number | int | The line number of the test data. | 0, 1, ... |
| **variant\_id** | **string** | **The variant name.** | **"variant\_0", "variant\_1", ...** |

- The built-in evaluation methods in the gallery are mostly this type of evaluation methods, except "QnA Relevance Scores Pairwise Evaluation".

- **Collection-based/Pair-wise evaluation method:**  This type of evaluation flow calculates metrics based on the outputs from different variants  **collectively.** "line\_number" and  **"variant\_ids"**  are the required flow inputs. This evaluation method receives a list of outputs of a flow from multiple variants. Therefore, the evaluation input "variant\_ids" is a **list of strings** indicating the source variants of the outputs. This type of evaluation method can process the outputs from multiple variants at a time, and calculate **relative metrics**, comparing to a baseline variant: variant\_0. This is useful when you want to know how other variants are performing compared to that of variant\_0 (baseline), allowing for the calculation of relative metrics.

| Field name | Type | Description | Examples |
| --- | --- | --- | --- |
| line\_number | int | The line number of the test data. | 0, 1, ... |
| **variant\_ids** | **List[string]** | **The variant name list.** | **["variant\_0", "variant\_1", ...]**|

See "QnA Relevance Scores Pairwise Evaluation" flow in "Create from gallery" for reference.

#### Input mapping

In this context, the inputs are the subjects of evaluation, which are the outputs of a flow. Other inputs may also be required, such as ground truth, which may come from the test dataset you provided. Therefore, to run an evaluation, you need to indicate the sources of these required input test data. To do so, when submitting an evaluation, you'll see an  **"input mapping"**  section.

- If the data source is from your test dataset, the source is indicated as "data.[ColumnName]"
- If the data source is from your flow output, the source is indicated as "output.[OutputName]"

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/bulk-test-eval-input-mapping.png" alt-text="Screenshot of evaluation input mapping." lightbox = "./media/how-to-develop-an-evaluation-flow/bulk-test-eval-input-mapping.png":::

To demonstrate the relationship of how the inputs and outputs are passed between flow and evaluation methods, here's a diagram showing the schema:

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/input-relationship.png" alt-text="Diagram of different input and output screenshots showing the flow between them. " lightbox = "./media/how-to-develop-an-evaluation-flow/input-relationship.png":::

Here's a diagram showing the example how data are passed between test dataset and flow outputs:

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/input-sample.png" alt-text="Diagram of how data is passed between test datasets and flow outputs. " lightbox = "./media/how-to-develop-an-evaluation-flow/input-sample.png":::

### Input description

To remind what inputs are needed to calculate metrics, you can add a description for each required input. The descriptions will be displayed when mapping the sources in bulk test submission.

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/input-description.png" alt-text="Screenshot of evaluation input mapping with the answers description highlighted. " lightbox = "./media/how-to-develop-an-evaluation-flow/input-description.png":::

To add descriptions for each input, select **Show description** in the input section when developing your evaluation method. And you can select "Hide description" to hide the description.

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/add-description.png" alt-text="Screenshot of Classification Accuracy Evaluation with hide description highlighted. " lightbox = "./media/how-to-develop-an-evaluation-flow/add-description.png":::

Then this description will be displayed to when using this evaluation method in bulk test submission.

### Outputs and metrics

The outputs of an evaluation are the results that measure the performance of the flow being tested. The output usually contains metrics such as scores, and may also include text for reasoning and suggestions.

#### Instance-level metrics—outputs

In Prompt flow, the flow processes each sample dataset one at a time and generates an output record. Similarly, in most evaluation cases, there will be a metric for each flow output, allowing you to check how the flow performs on each individual data input.

To record the score for each data sample, calculate the score for each output, and log the score **as a flow output** by setting it in the output section. This is the same as defining a standard flow output.

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/eval-output.png" alt-text="Screenshot of the outputs section showing a name and value. " lightbox = "./media/how-to-develop-an-evaluation-flow/eval-output.png":::

When this evaluation method is used in a bulk test, the instance-level score can be viewed in the **Output** tab.

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/eval-output-bulk.png" alt-text="Screenshot of the output tab with gpt coherence highlighted. " lightbox = "./media/how-to-develop-an-evaluation-flow/eval-output-bulk.png":::

#### Metrics logging and aggregation node

In addition, it's also important to provide an overall score for the run. You can check the  **"set as aggregation"** of a Python node to turn it into a "reduce" node, allowing the node to take in the inputs **as a list** and process them in batch.

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/set-as-aggregation.png" alt-text="Screenshot of the Python node heading pointing to an unchecked checked box. " lightbox = "./media/how-to-develop-an-evaluation-flow/set-as-aggregation.png":::

In this way, you can calculate and process all the scores of each flow output and compute an overall result for each variant.

You can log metrics in an aggregation node using **Prompt flow_sdk.log_metrics()**. The metrics should be numerical (float/int). String type metrics logging isn't supported.

See the following example for using the log_metric API:


```python
from typing import List
from promptflow import tool, log_metric

@tool
def calculate_accuracy(grades: List[str], variant_ids: List[str]):
    aggregate_grades = {}
    for index in range(len(grades)):
        grade = grades[index]
        variant_id = variant_ids[index]
        if variant_id not in aggregate_grades.keys():
            aggregate_grades[variant_id] = []
        aggregate_grades[variant_id].append(grade)

    # calculate accuracy for each variant
    for name, values in aggregate_grades.items():
        accuracy = round((values.count("Correct") / len(values)), 2)
        log_metric("accuracy", accuracy, variant_id=name)

    return aggregate_grades
```

## Next steps

- [Iterate and optimize your flow by tuning prompts using variants](how-to-tune-prompts-using-variants.md)
- [Submit bulk test and evaluate a flow](how-to-develop-a-standard-flow.md)