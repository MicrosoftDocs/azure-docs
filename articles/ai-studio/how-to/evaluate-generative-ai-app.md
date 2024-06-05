---
title: How to evaluate generative AI apps with Azure AI Studio
titleSuffix: Azure AI Studio
description: Evaluate your generative AI application with Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom: ignite-2023, devx-track-python, references_regions, build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: eur
ms.author: lagayhar
author: lgayhardt
---

# How to evaluate generative AI apps with Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

To thoroughly assess the performance of your generative AI application when applied to a substantial dataset, you can initiate an evaluation process. During this evaluation, your application is tested with the given dataset, and its performance will be quantitatively measured with both mathematical based metrics and AI-assisted metrics. This evaluation run provides you with comprehensive insights into the application's capabilities and limitations. 

To carry out this evaluation, you can utilize the evaluation functionality in Azure AI Studio, a comprehensive platform that offers tools and features for assessing the performance and safety of your generative AI model. In AI Studio, you're able to log, view, and analyze detailed evaluation metrics. 

In this article, you learn to create an evaluation run from a test dataset or a flow with built-in evaluation metrics from Azure AI Studio UI. For greater flexibility, you can establish a custom evaluation flow and employ the  **custom evaluation** feature. Alternatively, if your objective is solely to conduct a batch run without any evaluation, you can also utilize the custom evaluation feature.

## Prerequisites

To run an evaluation with AI-assisted metrics, you need to have the following ready:

- A test dataset in one of these formats: `csv` or `jsonl`.
- An Azure OpenAI connection.
- A deployment of one of these models: GPT 3.5 models, GPT 4 models, or Davinci models.

## Create an evaluation with built-in evaluation metrics

An evaluation run allows you to generate metric outputs for each data row in your test dataset. You can choose one or more evaluation metrics to assess the output from different aspects. You can create an evaluation run from the evaluation and prompt flow pages in AI Studio. Then an evaluation creation wizard appears to guide you through the process of setting up an evaluation run.

### From the evaluate page

From the collapsible left menu, select **Evaluation** > **+ New evaluation**.

:::image type="content" source="../media/evaluations/evaluate/evaluation-list-new-evaluation.png" alt-text="Screenshot of the button to create a new evaluation." lightbox="../media/evaluations/evaluate/evaluation-list-new-evaluation.png":::

### From the flow page

From the collapsible left menu, select **Prompt flow** > **Evaluate** > **Built-in evaluation**.

:::image type="content" source="../media/evaluations/evaluate/new-evaluation-flow-page.png" alt-text="Screenshot of how to select builtin evaluation." lightbox="../media/evaluations/evaluate/new-evaluation-flow-page.png":::

#### Basic information

When you enter the evaluation creation wizard, you can provide an optional name for your evaluation run and select the scenario that best aligns with your application's objectives. We currently offer support for the following scenarios: 

- **Question and answer with context**: This scenario is designed for applications that involve answering user queries and providing responses with context information.
- **Question and answer without context**: This scenario is designed for applications that involve answering user queries and providing responses without context.

You can use the help panel to check the FAQs and guide yourself through the wizard.

:::image type="content" source="../media/evaluations/evaluate/basic-information.png" alt-text="Screenshot of the basic information page when creating a new evaluation." lightbox="../media/evaluations/evaluate/basic-information.png":::

By specifying the appropriate scenario, we can tailor the evaluation to the specific nature of your application, ensuring accurate and relevant metrics. 

- **Evaluate from data**: If you already have your model generated outputs in a test dataset, skip **Select a flow to evaluate** and directly go to the next step to configure test data.  
- **Evaluate from flow**: If you initiate the evaluation from the Flow page, we'll automatically select your flow to evaluate. If you intend to evaluate another flow, you can select a different one. It's important to note that within a flow, you might have multiple nodes, each of which could have its own set of variants. In such cases, you must specify the node and the variants you wish to assess during the evaluation process.

:::image type="content" source="../media/evaluations/evaluate/select-flow.png" alt-text="Screenshot of the select a flow to evaluate page when creating a new evaluation." lightbox="../media/evaluations/evaluate/select-flow.png":::

#### Configure test data

You can select from pre-existing datasets or upload a new dataset specifically to evaluate. The test dataset needs to have the model generated outputs to be used for evaluation if there's no flow selected in the previous step.

- **Choose existing dataset**: You can choose the test dataset from your established dataset collection.

    :::image type="content" source="../media/evaluations/evaluate/use-existing-dataset.png" alt-text="Screenshot of the option to choose test data when creating a new evaluation." lightbox="../media/evaluations/evaluate/use-existing-dataset.png":::

- **Add new dataset**: You can upload files from your local storage. We only support `.csv` and `.jsonl` file formats.

    :::image type="content" source="../media/evaluations/evaluate/upload-file.png" alt-text="Screenshot of the upload file option when creating a new evaluation." lightbox="../media/evaluations/evaluate/upload-file.png":::

- **Data mapping for flow**:  If you select a flow to evaluate, ensure that your data columns are configured to align with the required inputs for the flow to execute a batch run, generating output for assessment. The evaluation will then be conducted using the output from the flow. Then, configure the data mapping for evaluation inputs in the next step.

    :::image type="content" source="../media/evaluations/evaluate/data-mapping-flow.png" alt-text="Screenshot of the dataset mapping when creating a new evaluation." lightbox="../media/evaluations/evaluate/data-mapping-flow.png":::

#### Select metrics

We support two types of metrics curated by Microsoft to facilitate a comprehensive evaluation of your application:  

+ Performance and quality metrics: These metrics evaluate the overall quality and coherence of the generated content.
+ Risk and safety metrics: These metrics focus on identifying potential content risks and ensuring the safety of the generated content.

You can refer to the table for the complete list of metrics we offer support for in each scenario. For more in-depth information on each metric definition and how it's calculated, see [Evaluation and monitoring metrics](../concepts/evaluation-metrics-built-in.md).

| Scenario | Performance and quality metrics | Risk and safety metrics |
|--|--|--|
| Question and answer with context | Groundedness, Relevance, Coherence, Fluency, GPT similarity, F1 score | Self-harm-related content, Hateful and unfair content, Violent content, Sexual content |
| Question and answer without context | Coherence, Fluency, GPT similarity, F1 score | Self-harm-related content, Hateful and unfair content, Violent content, Sexual content |


When using AI-assisted metrics for performance and quality evaluation, you must specify a GPT model for the calculation process. Choose an Azure OpenAI connection and a deployment with either GPT-3.5, GPT-4, or the Davinci model for our calculations. 

:::image type="content" source="../media/evaluations/evaluate/quality-metrics.png" alt-text="Screenshot of the select metrics page with quality metrics selected when creating a new evaluation." lightbox="../media/evaluations/evaluate/quality-metrics.png":::

For risk and safety metrics, you don't need to provide a connection and deployment. The Azure AI Studio safety evaluations back-end service provisions a GPT-4 model that can generate content risk severity scores and reasoning to enable you to evaluate your application for content harms.

You can set the threshold to calculate the defect rate for the risk and safety metrics. The defect rate is calculated by taking a percentage of instances with severity levels (Very low, Low, Medium, High) above a threshold. By default, we set the threshold as "Medium".

:::image type="content" source="../media/evaluations/evaluate/safety-metrics.png" alt-text="Screenshot of the select metrics page with safety metrics selected when creating a new evaluation." lightbox="../media/evaluations/evaluate/safety-metrics.png":::

> [!NOTE]
> AI-assisted risk and safety metrics are hosted by Azure AI Studio safety evaluations back-end service and is only available in the following regions: East US 2, France Central, UK South, Sweden Central

**Data mapping for evaluation**: You must specify which data columns in your dataset correspond with inputs needed in the evaluation. Different evaluation metrics demand distinct types of data inputs for accurate calculations.

:::image type="content" source="../media/evaluations/evaluate/data-mapping-evaluation.png" alt-text="Screenshot of the dataset mapping to your evaluation input." lightbox="../media/evaluations/evaluate/data-mapping-evaluation.png":::

> [!NOTE]
> If you are evaluating from data, "answer" should map to the answer column in your dataset `${data$answer}`. If you are evaluating from flow, "answer" should come from flow output `${run.outputs.answer}`.

For guidance on the specific data mapping requirements for each metric, refer to the information provided in the table:

##### Question answering metric requirements

| Metric                     | Question      | Answer        | Context       | Ground truth  |
|----------------------------|---------------|---------------|---------------|---------------|
| Groundedness               | Required: Str | Required: Str | Required: Str | N/A           |
| Coherence                  | Required: Str | Required: Str | N/A           | N/A           |
| Fluency                    | Required: Str | Required: Str | N/A           | N/A           |
| Relevance                  | Required: Str | Required: Str | Required: Str | N/A           |
| GPT-similarity             | Required: Str | Required: Str | N/A           | Required: Str |
| F1 Score                   | Required: Str | Required: Str | N/A           | Required: Str |
| Self-harm-related content  | Required: Str | Required: Str | N/A           | N/A           |
| Hateful and unfair content | Required: Str | Required: Str | N/A           | N/A           |
| Violent content            | Required: Str | Required: Str | N/A           | N/A           |
| Sexual content             | Required: Str | Required: Str | N/A           | N/A           |

- Question: the question asked by the user in Question Answer pair
- Answer: the response to question generated by the model as answer
- Context: the source that response is generated with respect to (that is, grounding documents)
- Ground truth: the response to question generated by user/human as the true answer

#### Review and finish

After completing all the necessary configurations, you can review and proceed to select 'Submit' to submit the evaluation run.

:::image type="content" source="../media/evaluations/evaluate/review-and-finish.png" alt-text="Screenshot of the review and finish page to create a new evaluation." lightbox="../media/evaluations/evaluate/review-and-finish.png":::

## Create an evaluation with custom evaluation flow

You can develop your own evaluation methods:

From the flow page: From the collapsible left menu, select **Prompt flow** > **Evaluate** > **Custom evaluation**.

:::image type="content" source="../media/evaluations/evaluate/new-custom-evaluation-flow-page.png" alt-text="Screenshot of how to create a custom evaluation from a prompt flow." lightbox="../media/evaluations/evaluate/new-custom-evaluation-flow-page.png":::

## View and manage the evaluators in the evaluator library 

The evaluator library is a centralized place that allows you to see the details and status of your evaluators. You can view and manage Microsoft curated evaluators.

> [!TIP]
> You can use custom evaluators via the prompt flow SDK. For more information, see [Evaluate with the prompt flow SDK](../how-to/develop/flow-evaluate-sdk.md#custom-evaluators).
 
The evaluator library also enables version management. You can compare different versions of your work, restore previous versions if needed, and collaborate with others more easily. 

To use the evaluator library in AI Studio, go to your project's **Evaluation** page and select the **Evaluator library** tab. 

:::image type="content" source="../media/evaluations/evaluate/evaluator-library-list.png" alt-text="Screenshot of the page to select evaluators from the evaluator library." lightbox="../media/evaluations/evaluate/evaluator-library-list.png":::

You can select the evaluator name to see more details. You can see the name, description, and parameters, and check any files associated with the evaluator. Here are some examples of Microsoft curated evaluators:
- For performance and quality evaluators curated by Microsoft, you can view the annotation prompt on the details page. You can adapt these prompts to your own use case by changing the parameters or criteria according to your data and objectives [with the prompt flow SDK](../how-to/develop/flow-evaluate-sdk.md#custom-evaluators). For example, you can select *Groundedness-Evaluator* and check the Prompty file showing how we calculate the metric.
- For risk and safety evaluators curated by Microsoft, you can see the definition of the metrics. For example, you can select the *Self-Harm-Related-Content-Evaluator* and learn what it means and how Microsoft determines the various severity levels for this safety metric


## Next steps

Learn more about how to evaluate your generative AI applications:

- [Evaluate your generative AI apps via the playground](./evaluate-prompts-playground.md)
- [View the evaluation results](./evaluate-flow-results.md)
- Learn more about [harm mitigation techniques](../concepts/evaluation-improvement-strategies.md).
- [Transparency Note for Azure AI Studio safety evaluations](../concepts/safety-evaluations-transparency-note.md).
