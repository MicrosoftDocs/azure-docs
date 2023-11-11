---
title: Develop an evaluation flow
titleSuffix: Azure AI Studio
description: Learn how to customize or create your own evaluation flow tailored to your tasks and objectives, and then use in a batch run as an evaluation method in prompt flow with Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 11/15/2023
ms.author: eur
---

# Develop an evaluation flow in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

Evaluation flows are special types of flows that assess how well the outputs of a run align with specific criteria and goals.

In Prompt flow, you can customize or create your own evaluation flow tailored to your tasks and objectives, and then use it to evaluate other flows. This document you'll learn:

- How to develop an evaluation method
- Understand evaluation in Prompt flow
  - Inputs
  - Outputs and Metrics Logging

## Starting to develop an evaluation method

There are two ways to develop your own evaluation methods:

- **Customize a Built-in Evaluation Flow:** Modify a built-in evaluation flow. Find the built-in evaluation flow from the flow creation wizard - flow gallery, select “Clone” to do customization.  

- **Create a New Evaluation Flow from Scratch:** Develop a brand-new evaluation method from the ground up. In flow creation wizard, select “Create” Evaluation flow, then, you can see a template of evaluation flow. 

## Understand evaluation in Prompt flow

In Prompt flow, a flow is a sequence of nodes that process an input and generate an output. Evaluation flows also take required inputs and produce corresponding outputs.

Some special features of evaluation methods are:

1. They usually run after the run to be tested, and receive outputs from that run.
2. Apart from the outputs from the run to be tested, they can receive an optional additional dataset which might contain corresponding ground truths. 
3. They might have an aggregation node that calculates the overall performance of the flow being tested based on the individual scores.
4. They can log metrics using log_metric() function.

We'll introduce how the inputs and outputs should be defined in developing evaluation methods.

### Inputs

An evaluation runs after another run to assess how well the outputs of that run align with specific criteria and goals. Therefore, evaluation receives the outputs generated from that run.

Other inputs might also be required, such as ground truth, which might come from a dataset. By default, evaluation will use the same dataset as the test dataset provided to the tested run. However, if the corresponding labels or target ground truth values are in a different dataset, you can easily switch to that one.  

Therefore, to run an evaluation, you need to indicate the sources of these required inputs. To do so, when submitting an evaluation, you'll see an  **"input mapping"**  section.

- If the data source is from your run output, the source is indicated as `${run.output.[OutputName]}`
- If the data source is from your test dataset, the source is indicated as `${data.[ColumnName]}`



> [!NOTE]
> If your evaluation doesn't require data from the dataset, you do not need to reference any dataset columns in the input mapping section, indicating the dataset selection is an optional configuration. Dataset selection won't affect evaluation result.

### Input description

To remind what inputs are needed to calculate metrics, you can add a description for each required input. The descriptions are displayed when mapping the sources in batch run submission.


To add descriptions for each input, select **Show description** in the input section when developing your evaluation method. And you can select "Hide description" to hide the description.


Then this description is displayed to when using this evaluation method in batch run submission.

### Outputs and metrics

The outputs of an evaluation are the results that measure the performance of the flow being tested. The output usually contains metrics such as scores, and might also include text for reasoning and suggestions.

#### Instance-level scores — outputs

In Prompt flow, the flow processes each sample dataset one at a time and generates an output record. Similarly, in most evaluation cases, there will be a metric for each output, allowing you to check how the flow performs on each individual data.

To record the score for each data sample, calculate the score for each output, and log the score **as a flow output** by setting it in the output section. This authoring experience is the same as defining a standard flow output.


We calculate this score in `line_process` node, which you can create and edit from scratch when creating by type. You can also replace this python node with an LLM node to use LLM to calculate the score.


When this evaluation method is used to evaluate another flow, the instance-level score can be viewed in the **Overview ->Output** tab.


#### Metrics logging and aggregation node

In addition, it's also important to provide an overall score for the run. You can check the  **"set as aggregation"** of a Python node in an evaluation flow to turn it into a "reduce" node, allowing the node to take in the inputs **as a list** and process them in batch.


In this way, you can calculate and process all the scores of each flow output and compute an overall result for each variant.

You can log metrics in an aggregation node using **Prompt flow_sdk.log_metrics()**. The metrics should be numerical (float/int). String type metrics logging isn't supported.

We calculate this score in `aggregate` node, which you can create and edit from scratch when creating by type. You can also replace this python node with an LLM node to use LLM to calculate the score. See the following example for using the log_metric API in an evaluation flow:


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

As you called this function in the Python node, you don't need to assign it anywhere else, and you can view the metrics later. When this evaluation method is used in a batch run, the instance-level score can be viewed in the **Overview->Metrics** tab.


## Next steps

- [Iterate and optimize your flow by tuning prompts using variants](./flow-tune-prompts-using-variants.md)
- [Submit batch run and evaluate a flow](./flow-bulk-test-evaluation.md)
