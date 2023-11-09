---
title: How to evaluate with Azure AI Studio and SDK
titleSuffix: Azure AI Studio
description: Evaluate your generative AI application with Azure AI Studio UI and SDK.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 11/15/2023
ms.author: eur
---

# How to evaluate with Azure AI Studio and SDK

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

To thoroughly assess the performance of your generative AI application when applied to a substantial dataset, you can initiate an evaluation process. During this evaluation, your application is tested with the given dataset, and its performance will be quantitatively measured with both mathematical based metrics and AI-assisted metrics. This evaluation run provides you with comprehensive insights into the application's capabilities and limitations. 

To carry out this evaluation, you can utilize the evaluation functionality in Azure AI Studio, a comprehensive platform that offers tools and features for assessing the performance of your generative AI model. In AI Studio, you're able to log, view and analyze detailed evaluation metrics. 

In this article, you learn to create an evaluation run from a test dataset or flow with built-in evaluation metrics from Azure AI Studio UI. For greater flexibility, you can establish a custom evaluation flow and employ the **custom evaluation** feature. Alternatively, if your objective is solely to conduct a batch run without any evaluation, you can also utilize the custom evaluation feature. 

## Prerequisites

To run an evaluation with AI-assisted metrics, you need to have the following ready: 

+ A test dataset in one of these formats: `csv` or `jsonl`. If you don't have a dataset available, we also allow you to input data manually from the UI.  
+ A deployment of one of these models: GPT 3.5 models, GPT 4 models, or Davinci models. 
+ A runtime with compute instance to run the evaluation.

## Create an evaluation with built-in evaluation metrics

An evaluation run allows you to generate metric outputs for each data row in your test dataset. You can choose one or more evaluation metrics to assess the output from different aspects. You can create an evaluation run from the evaluation and prompt flow pages in AI Studio. Then an evaluation creation wizard appears to guide you through the process of setting up an evaluation run.

### From the evaluate page

From the collapsible left menu, select **Evaluation** > **+ New evaluation**.

:::image type="content" source="../media/evaluations/evaluate/new-evaluation-evaluate-page.png" alt-text="Screenshot of the button to create a new evaluation." lightbox="../media/evaluations/evaluate/new-evaluation-evaluate-page.png":::

### From the flow page

From the collapsible left menu, select **Prompt flow** > **Evaluate** > **Built-in evaluation**.

:::image type="content" source="../media/evaluations/evaluate/new-evaluation-flow-page.png" alt-text="Screenshot of how to select builtin evaluation." lightbox="../media/evaluations/evaluate/new-evaluation-flow-page.png":::

#### Basic information
When you enter the evaluation creation wizard, provide a name for your evaluation run and select the scenario that best aligns with your application's objectives. You need to select a runtime to run the evaluation. A runtime is a compute instance with environment attached. If you don't have any runtime available, navigate to **Build** > **Settings** to create one. We currently offer support for the following scenarios: 

+ **Question answering**: This scenario is designed for applications that involve answering user queries and providing responses. 
+ **Conversation**: This scenario is suitable for applications where the model engages in conversation using a retrieval-augmented approach to extract information from your provided documents and generate detailed responses. 

:::image type="content" source="../media/evaluations/evaluate/basic-information.png" alt-text="Screenshot of the basic information page when creating a new evaluation." lightbox="../media/evaluations/evaluate/basic-information.png":::

> [!NOTE]
> For conversation scenario, we currently only support single turn in the Azure AI Studio UI. However, we provide support for multi-turn conversations in the Azure AI SDK and CLI.

By specifying the appropriate scenario, we can tailor the evaluation to the specific nature of your application, ensuring accurate and relevant metrics. 

+ **Evaluate from data**: If you already have your model generated outputs in a test dataset, skip the “Add flow and variants” step and directly go to the next step to select metrics.  
+ **Evaluate from flow**: If you initiate the evaluation from the Flow page, we'll automatically select your flow to evaluate. If you intend to evaluate another flow, you can select a different one. It's important to note that within a flow, you might have multiple nodes, each of which could have its own set of variants. In such cases, you need to specify both the node and the particular variants you wish to assess during the evaluation process. 

:::image type="content" source="../media/evaluations/evaluate/add-flow-and-variants.png" alt-text="Screenshot of the flow and variants page when creating a new evaluation." lightbox="../media/evaluations/evaluate/add-flow-and-variants.png":::

#### Select metrics
By default, we preselect certain recommended metrics based on the scenario you previously selected. You can refer to the table below for the default metrics, and the complete list of metrics we offer support for in each scenario. For more in-depth information on each metric definition and how it's calculated, learn more [here](../concepts/evaluation-metrics-built-in.md).

| Scenario           | Default metrics                          | All metrics                                                                                        |
|--------------------|------------------------------------------|----------------------------------------------------------------------------------------------------|
| Question Answering | Groundedness, Relevance, Coherence       | Groundedness, Relevance, Coherence, Fluency, GPT Similarity, F1 Score, Exact Match, ADA Similarity<br/><br/>For question answering scenario, we currently don't support Exact Match and ADA Similarity in the Azure AI Studio. These metrics are available in the Azure AI SDK and Azure AI CLI. |
| Conversation       | Groundedness, Relevance, Retrieval Score | Groundedness, Relevance, Retrieval Score                                                           |

When using AI-assisted metrics for evaluation, you must specify a GPT model for the calculation process. Choose a deployment with either GPT-3.5, GPT-4, or the Davinci model for our calculations.  

:::image type="content" source="../media/evaluations/evaluate/select-metrics.png" alt-text="Screenshot of the select metrics page when creating a new evaluation." lightbox="../media/evaluations/evaluate/select-metrics.png":::

#### Configure test data

You can select from pre-existing datasets or upload a new dataset specifically to evaluate. The test dataset needs to have the model generated outputs to be used for evaluation if there's no flow selected. 

:::image type="content" source="../media/evaluations/evaluate/configure-test-data.png" alt-text="Screenshot of selecting test data when creating a new evaluation." lightbox="../media/evaluations/evaluate/configure-test-data.png":::

+ **Choose existing dataset**: You can choose the test dataset from your established dataset collection.  

    :::image type="content" source="../media/evaluations/evaluate/choose-existing-dataset.png" alt-text="Screenshot of the option to choose test data when creating a new evaluation." lightbox="../media/evaluations/evaluate/choose-existing-dataset.png":::

+ **Add new dataset**: You can either upload files from your local storage or manually enter the dataset. 
    - For the 'Upload file' option, we only support `.csv` and `.jsonl` file formats. 

        :::image type="content" source="../media/evaluations/evaluate/upload-file.png" alt-text="Screenshot of the upload file option when creating a new evaluation." lightbox="../media/evaluations/evaluate/upload-file.png":::

    - Manual input is only supported for Question Answering scenario.   
    
        :::image type="content" source="../media/evaluations/evaluate/input-manually.png" alt-text="Screenshot of the manual data input option when creating a new evaluation." lightbox="../media/evaluations/evaluate/input-manually.png":::

+ **Data mapping**: You must specify which data columns in your dataset correspond with inputs needed in the evaluation. Different evaluation metrics demand distinct types of data inputs for accurate calculations. For guidance on the specific data mapping requirements for each metric, refer to the information provided below:

##### Question answering metric requirements

| Metric         | Question      | Response      | Context       | Ground truth  |
|----------------|---------------|---------------|---------------|---------------|
| Groundedness   | Required: Str | Required: Str | Required: Str | N/A           |
| Coherence      | Required: Str | Required: Str | N/A           | N/A           |
| Fluency        | Required: Str | Required: Str | N/A           | N/A           |
| Relevance      | Required: Str | Required: Str | Required: Str | N/A           |
| GPT-similarity | Required: Str | Required: Str | N/A           | Required: Str |
| F1 Score | Required: Str | Required: Str | N/A           | Required: Str |
| Exact Match | Required: Str | Required: Str | N/A           | Required: Str |
| ADA similarity | Required: Str | Required: Str | N/A           | Required: Str |

- Question: the question asked by the user in Question Answer pair
- Response: the response to question generated by the model as answer
- Context: the source that response is generated with respect to (that is, grounding documents)
- Ground truth: the response to question generated by user/human as the true answer

##### Conversation metric requirements

| Metric          | Question      | Answer        | Context from retrieved documents |
|-----------------|---------------|---------------|---------------------|
| Groundedness    | Required: str | Required: str | Required: str       |
| Relevance       | Required: str | Required: str | Required: str       |
| Retrieval score | Required: str | N/A           | Required: str       |

- Question: the question asked by the user extracted from the conversation history
- Response: the response generated by the model
- Context: the relevant source from retrieved documents by retrieval model or user provided context that response is generated with respect to

#### Review and finish
After completing all the necessary configurations, you can review and proceed to select 'Create' to submit the evaluation run.

:::image type="content" source="../media/evaluations/evaluate/review-and-finish.png" alt-text="Screenshot of the review and finish page to create a new evaluation." lightbox="../media/evaluations/evaluate/review-and-finish.png":::

## Create an evaluation with custom evaluation flow 

There are two ways to develop your own evaluation methods: 
+ Customize a Built-in Evaluation Flow: Modify a built-in evaluation flow. Find the built-in evaluation flow from the flow creation wizard - flow gallery, select “Clone” to do customization.  
+ Create a New Evaluation Flow from Scratch: Develop a brand-new evaluation method from the ground up. In flow creation wizard, select “Create” Evaluation flow then you can see a template of evaluation flow. 

The process of customizing and creating evaluation methods is similar to that of a standard flow. 


## Next steps

Learn more about how to evaluate your generative AI applications:
- [Evaluate your generative AI apps via the playground](./evaluate-prompts-playground.md)
- [View the evaluation results](./evaluate-flow-results.md)

Learn more about [harm mitigation techniques](../concepts/evaluation-improvement-strategies.md).
