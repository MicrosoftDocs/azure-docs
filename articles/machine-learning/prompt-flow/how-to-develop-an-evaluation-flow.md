---
title: Customize evaluation flow and metrics in prompt flow
titleSuffix: Azure Machine Learning
description: Learn how to customize or create your own evaluation flow and evaluation metrics tailored to your tasks and objectives, and then use in a batch run as an evaluation method in prompt flow with Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.custom:
  - ignite-2023
ms.topic: how-to
author: ZikeiWong
ms.author: ziqiwang
ms.reviewer: lagayhar
ms.date: 12/19/2023
---

# Customize evaluation flow and metrics

Evaluation flows are special types of flows that assess how well the outputs of a run align with specific criteria and goals by calculating metrics.

In prompt flow, you can customize or create your own evaluation flow and metrics tailored to your tasks and objectives, and then use it to evaluate other flows. This document you'll learn:

- Understand evaluation in prompt flow
  - Inputs
  - Outputs and Metrics Logging
- How to develop an evaluation flow
- How to use a customized evaluation flow in batch run

## Understand evaluation in prompt flow

In prompt flow, a flow is a sequence of nodes that process an input and generate an output. Evaluation flows, similarly, can take required inputs and produce corresponding outputs, which are often the scores or metrics. The concepts of evaluation flows are similar to those of standard flows, but there are some differences in the authoring experience and the way they're used.

Some special features of evaluation flows are:

- They usually run after the run to be tested by receiving its outputs. It uses the outputs to calculate the scores and metrics. The outputs of an evaluation flow are the results that measure the performance of the flow being tested. 
- They may have an aggregation node that calculates the overall performance of the flow being tested over the test dataset.
- They can log metrics using `log_metric()` function.

We'll introduce how the inputs and outputs should be defined in developing evaluation methods.

### Inputs

Evaluation flows calculate metrics or scores for a flow batch run based on a dataset. To do so, they need to take in the outputs of the run being tested. You can define the inputs of an evaluation flow in the same way as defining the inputs of a standard flow. 

An evaluation flow runs after another run to assess how well the outputs of that run align with specific criteria and goals. Therefore, evaluation receives the outputs generated from that run. 

For example, if the flow being tested is a QnA flow that generates answers based on a question, you can accordingly name an input of your evaluation as `answer`. If the flow being tested is a classification flow that classifies a text into a category, you can name an input of your evaluation as `category`.

Other inputs such as `ground truth` may also be needed. For example, if you want to calculate the accuracy of a classification flow, you need to provide the `category` column in the dataset as the ground truth. If you want to calculate the accuracy of a QnA flow, you need to provide the `answer` column in the dataset as the ground truth.

By default, evaluation uses the same dataset as the test dataset provided to the tested run. However, if the corresponding labels or target ground truth values are in a different dataset, you can easily switch to that one.

Some other inputs may be needed to calculate the metrics such as `question` and `context` in the QnA or RAG scenario. You can define these inputs in the same way as defining the inputs of a standard flow.

### Input description

To remind what inputs are needed to calculate metrics, you can add a description for each required input. The descriptions are displayed when mapping the sources in batch run submission.

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/input-description.png" alt-text="Screenshot of evaluation input mapping with the answers description highlighted. " lightbox = "./media/how-to-develop-an-evaluation-flow/input-description.png":::

To add descriptions for each input, select **Show description** in the input section when developing your evaluation method. And you can select "Hide description" to hide the description.

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/add-description.png" alt-text="Screenshot of Classification Accuracy Evaluation with hide description highlighted. " lightbox = "./media/how-to-develop-an-evaluation-flow/add-description.png":::

Then this description is displayed to when using this evaluation method in batch run submission.

### Outputs and metrics

The outputs of an evaluation are the results that measure the performance of the flow being tested. The output usually contains metrics such as scores, and may also include text for reasoning and suggestions.

#### Evaluation outputs—instance-level scores

In prompt flow, the flow processes one row of data at a time and generates an output record. Similarly, in most evaluation cases, there is a score for each output, allowing you to check how the flow performs on each individual data.

Evaluation flow can calculate scores for each data, and you can record the scores for each data sample **as flow outputs** by setting them in the output section of the evaluation flow. This authoring experience is the same as defining a standard flow output.

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/eval-output.png" alt-text="Screenshot of the outputs section showing a name and value. " lightbox = "./media/how-to-develop-an-evaluation-flow/eval-output.png":::

You can view the scores in the **Overview->Output** tab when this evaluation method is used to evaluate another flow. This process is the same as checking the batch run outputs of a standard flow. The instance-level score is appended to the output of the flow being tested.

#### Metrics logging and aggregation node
In addition, it's also important to provide an overall assessment for the run. To distinguish from the individual score of assessing each single output, we call the values for evaluating overall performance of a run as **"metrics"**.

To calculate the overall assessment value based on every individual score, you can check the **"Aggregation"** of a Python node in an evaluation flow to turn it into a "reduce" node, allowing the node to take in the inputs **as a list** and process them in batch.

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/set-as-aggregation.png" alt-text="Screenshot of the Python node heading pointing to an unchecked checked box. " lightbox = "./media/how-to-develop-an-evaluation-flow/set-as-aggregation.png":::

In this way, you can calculate and process all the scores of each flow output and compute an overall result for each score output. For example, if you want to calculate the accuracy of a classification flow, you can calculate the accuracy of each score output and then calculate the **average** accuracy of all the score outputs. Then, you can log the average accuracy as a metric using **promptflow_sdk.log_metrics()**. The metrics should be numerical (float/int). String type metrics logging isn't supported.

The following code snippet is an example of calculating the overall accuracy by averaging the accuracy score (`grade`) of each data. The overall accuracy is logged as a metric using **promptflow_sdk.log_metrics()**.

```python
from typing import List
from promptflow import tool, log_metric

@tool
def calculate_accuracy(grades: List[str]): # Receive a list of grades from a previous node
    # calculate accuracy
    accuracy = round((grades.count("Correct") / len(grades)), 2)
    log_metric("accuracy", accuracy)

    return accuracy
```

As you called this function in the Python node, you don't need to assign it anywhere else, and you can view the metrics later. When this evaluation method is used in a batch run, the metrics indicating overall performance can be viewed in the **Overview->Metrics** tab.

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/evaluation-metrics-bulk.png" alt-text="Screenshot of the metrics tab that shows the metrics logged by log metric. " lightbox = "./media/how-to-develop-an-evaluation-flow/evaluation-metrics-bulk.png":::

## Starting to develop an evaluation method

There are two ways to develop your own evaluation methods:

- **Create a new evaluation flow from scratch:** Develop a brand-new evaluation method from the ground up. In prompt flow tab home page, at the “Create by type” section, you can choose "Evaluation flow" and see a template of evaluation flow. 

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/create-by-type.png" alt-text="Screenshot of create a new evaluation flow from scratch. " lightbox = "./media/how-to-develop-an-evaluation-flow/create-by-type.png":::

- **Customize a built-in evaluation flow:** Modify a built-in evaluation flow. Find the built-in evaluation flow from the flow creation wizard - flow gallery, select “Clone” to do customization. You then can see and check the logic and flow of the built-in evaluations and then modify the flow. In this way, you don't start from a very beginning, but a sample for you to use for your customization.

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/create-from-gallery.png" alt-text="Screenshot of cloning a built-in evaluation flow. " lightbox = "./media/how-to-develop-an-evaluation-flow/create-from-gallery.png":::

### Calculate scores for each data

As mentioned, evaluation is run to calculate scores and metrics based a flow that run on a dataset. Therefore, the first step in evaluation flows is calculating scores for each individual output. 

Take the built-in evaluation flow `Classification Accuracy Evaluation` as an example, the score `grade`, which measures the accuracy of each flow-generated output to its corresponding ground truth, is calculated in `grade` node. If you create an evaluation flow and edit from scratch when creating by type, this score is calculated in `line_process` node in the template. You can also replace the `line_process` python node with an LLM node to use LLM to calculate the score, or use multiple nodes to perform the calculation.

:::image type="content" source="./media/how-to-develop-an-evaluation-flow/line-process.png" alt-text="Screenshot of line process node in the template. " lightbox = "./media/how-to-develop-an-evaluation-flow/line-process.png":::

Then, you need to specify the output of the nodes as the outputs of the evaluation flow, which indicates that the outputs are the scores calculated for each data sample. You can also output reasoning as additional information, and it's the same experience in defining outputs in standard flow.

### Calculates and log metrics
The second step in evaluation is to calculate overall metrics to assess the run. As mentioned, the metrics are calculated in a Python node that set as `Aggregation`. This node takes in the scores calculated in the previous node and organizes the score of each data sample into a list, then calculate them together at a time. 

If you create and edit from scratch when creating by type, this score is calculated in `aggregate` node. The  code snippet is the template of an aggregation node. 

```python

from typing import List
from promptflow import tool

@tool
def aggregate(processed_results: List[str]):
    """
    This tool aggregates the processed result of all lines and log metric.
    :param processed_results: List of the output of line_process node.
    """
    # Add your aggregation logic here
    aggregated_results = {}

    # Log metric
    # from promptflow import log_metric
    # log_metric(key="<my-metric-name>", value=aggregated_results["<my-metric-name>"])

    return aggregated_results

```
You can use your own aggregation logic, such as calculating average, mean value, or standard deviation of the scores. 

Then you need to log the metrics with `promptflow.logmetrics()` function. You can log multiple metrics in a single evaluation flow. **The metrics should be numerical (float/int).** 

## Use a customized evaluation flow
After the creation of your own evaluation flow and metrics, you can then use this flow to assess the performance of your standard flow. 

1. First, start from the flow authoring page that you want to evaluate on. For example, a QnA flow that you yet knowing how it performs on a large dataset and want to test with. Click `Evaluate` button and choose `Custom evaluation`.
    
    :::image type="content" source="./media/how-to-develop-an-evaluation-flow/evaluate-button.png" alt-text="Screenshot of evaluation button." lightbox = "./media/how-to-develop-an-evaluation-flow/evaluate-button.png":::
    

2. Then, similar to the steps of submit a batch run as mentioned in [Submit batch run and evaluate a flow in prompt flow](how-to-bulk-test-evaluate-flow.md#submit-batch-run-and-evaluate-a-flow), follow the first few steps to prepare the dataset to run the flow. 

3. Then in the `Evaluation settings - Select evaluation` step, along with the built-in evaluations, the customized evaluations are also available for selection. This lists all your evaluation flows in your flow list that you created, cloned, or customized. **Evaluation flows created by others in the same project will not show up in this section.** 

    :::image type="content" source="./media/how-to-develop-an-evaluation-flow/select-customized-evaluation.png" alt-text="Screenshot of selecting customized evaluation." lightbox = "./media/how-to-develop-an-evaluation-flow/select-customized-evaluation.png":::


4. Next in the `Evaluation settings - Configure evaluation` step, you need to specify the sources of the input data that are needed for the evaluation method. For example, ground truth column might come from a dataset. 


    To run an evaluation, you can indicate the sources of these required inputs in **"input mapping"** section when submitting an evaluation. This process is same as the configuration mentioned in [Submit batch run and evaluate a flow in prompt flow](how-to-bulk-test-evaluate-flow.md#submit-batch-run-and-evaluate-a-flow).
    
    - If the data source is from your run output, the source is indicated as `${run.output.[OutputName]}`
    - If the data source is from your test dataset, the source is indicated as `${data.[ColumnName]}`
    

    :::image type="content" source="./media/how-to-develop-an-evaluation-flow/bulk-test-evaluation-input-mapping.png" alt-text="Screenshot of evaluation input mapping." lightbox = "./media/how-to-develop-an-evaluation-flow/bulk-test-evaluation-input-mapping.png":::
    
    > [!NOTE]
    > If your evaluation doesn't require data from the dataset, you do not need to reference any dataset columns in the input mapping section, indicating the dataset selection is an optional configuration. Dataset selection won't affect evaluation result.

5. When this evaluation method is used to evaluate another flow, the instance-level score can be viewed in the **Overview ->Output** tab.

    :::image type="content" source="./media/how-to-develop-an-evaluation-flow/evaluation-output-bulk.png" alt-text="Screenshot of the output tab with evaluation result appended and highlighted. " lightbox = "./media/how-to-develop-an-evaluation-flow/evaluation-output-bulk.png":::

## Next steps

- [Iterate and optimize your flow by tuning prompts using variants](how-to-tune-prompts-using-variants.md)
- [Submit batch run and evaluate a flow](how-to-bulk-test-evaluate-flow.md)
