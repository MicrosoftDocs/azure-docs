---
 title: include file
 description: include file
 author: eur
 ms.reviewer: eur
ms.author: eric-urban
 ms.service: azure-ai-studio
 ms.topic: include
 ms.date: 03/28/2024
 ms.custom: include
---

To thoroughly assess the performance of your generative AI application when applied to a substantial dataset, you can initiate an evaluation process. During this evaluation, your application is tested with the given dataset, and its performance will be quantitatively measured with both mathematical based metrics and AI-assisted metrics. This evaluation run provides you with comprehensive insights into the application's capabilities and limitations.

To carry out this evaluation, you can utilize the evaluation functionality in Azure AI Studio, a comprehensive platform that offers tools and features for assessing the performance and safety of your generative AI model. In AI Studio, you're able to log, view, and analyze detailed evaluation metrics.

In this article, you learn to create an evaluation run from a test dataset or a flow with built-in evaluation metrics from Azure AI Studio UI. For greater flexibility, you can establish a custom evaluation flow and employ the  **custom evaluation** feature. Alternatively, if your objective is solely to conduct a batch run without any evaluation, you can also utilize the custom evaluation feature.

## Prerequisites

To run an evaluation with AI-assisted metrics, you need to have the following ready: 

+ A test dataset in one of these formats: `csv` or `jsonl`. If you don't have a dataset available, we also allow you to input data manually from the UI.  
+ A deployment of one of these models: GPT 3.5 models, GPT 4 models, or Davinci models. 
+ A runtime with compute instance to run the evaluation.

## Create an evaluation with built-in evaluation metrics

An evaluation run allows you to generate metric outputs for each data row in your test dataset. You can choose one or more evaluation metrics to assess the output from different aspects. You can create an evaluation run from the evaluation and prompt flow pages in AI Studio. Then an evaluation creation wizard appears to guide you through the process of setting up an evaluation run.

### From the evaluate page

From the collapsible left menu, select **Evaluation** > **+ New evaluation**.

:::image type="content" source="../../../media/evaluations/evaluate/new-evaluation-evaluate-page.png" alt-text="Screenshot of the button to create a new evaluation." lightbox="../../../media/evaluations/evaluate/new-evaluation-evaluate-page.png":::

### From the flow page

From the collapsible left menu, select **Prompt flow** > **Evaluate** > **Built-in evaluation**.

:::image type="content" source="../../../media/evaluations/evaluate/new-evaluation-flow-page.png" alt-text="Screenshot of how to select builtin evaluation." lightbox="../../../media/evaluations/evaluate/new-evaluation-flow-page.png":::

#### Basic information

When you enter the evaluation creation wizard, you can provide an optional name for your evaluation run and select the scenario that best aligns with your application's objectives. We currently offer support for the following scenarios:

+ **Question and answer with context**: This scenario is designed for applications that involve answering user queries and providing responses with context information.
+ **Question and answer without context**: This scenario is designed for applications that involve answering user queries and providing responses without context.
+ **Conversation with context**: This scenario is suitable for applications where the model engages in single-turn or multi-turn conversation with context to extract information from your provided documents and generate detailed responses. We require you to follow a specific data format to run the evaluation. Download the data template to understand how to format your dataset correctly.

:::image type="content" source="../../../media/evaluations/evaluate/basic-information.png" alt-text="Screenshot of the basic information page when creating a new evaluation." lightbox="../../../media/evaluations/evaluate/basic-information.png":::


By specifying the appropriate scenario, we can tailor the evaluation to the specific nature of your application, ensuring accurate and relevant metrics. 

+ **Evaluate from data**: If you already have your model generated outputs in a test dataset, skip the “Select a flow to evaluate” step and directly go to the next step to select metrics.  
+ **Evaluate from flow**: If you initiate the evaluation from the Flow page, we'll automatically select your flow to evaluate. If you intend to evaluate another flow, you can select a different one. It's important to note that within a flow, you might have multiple nodes, each of which could have its own set of variants. In such cases, you must specify the node and the variants you wish to assess during the evaluation process.

:::image type="content" source="../../../media/evaluations/evaluate/select-flow.png" alt-text="Screenshot of the select a flow to evaluate page when creating a new evaluation." lightbox="../../../media/evaluations/evaluate/select-flow.png":::

#### Select metrics

We support two types of metrics curated by Microsoft to facilitate a comprehensive evaluation of your application:  

+ Performance and quality metrics: These metrics evaluate the overall quality and coherence of the generated content.
+ Risk and safety metrics: These metrics focus on identifying potential content risks and ensuring the safety of the generated content.

You can refer to the table below for the complete list of metrics we offer support for in each scenario. For more in-depth information on each metric definition and how it's calculated, see [Evaluation and monitoring metrics](../../../concepts/evaluation-metrics-built-in.md).

| Scenario | Performance and quality metrics | Risk and safety metrics |
|--|--|--|
| Question and answer with context | Groundedness, Relevance, Coherence, Fluency, GPT similarity, F1 score | Self-harm-related content, Hateful and unfair content, Violent content, Sexual content |
| Question and answer without context | Coherence, Fluency, GPT similarity, F1 score | Self-harm-related content, Hateful and unfair content, Violent content, Sexual content |
| Conversation | Groundedness, Relevance, Retrieval Score, Coherence, Fluency | Self-harm-related content, Hateful and unfair content, Violent content, Sexual content |

When using AI-assisted metrics for performance and quality evaluation, you must specify a GPT model for the calculation process. Choose an Azure OpenAI connection and a deployment with either GPT-3.5, GPT-4, or the Davinci model for our calculations.

:::image type="content" source="../../../media/evaluations/evaluate/quality-metrics.png" alt-text="Screenshot of the select metrics page with quality metrics selected when creating a new evaluation." lightbox="../../../media/evaluations/evaluate/quality-metrics.png":::

For risk and safety metrics, you don't need to provide a connection and deployment. The Azure AI Studio safety evaluations back-end service provisions a GPT-4 model that can generate content risk severity scores and reasoning to enable you to evaluate your application for content harms.  

You can set the threshold to calculate the defect rate for the risk and safety metrics. The defect rate is calculated by taking a percentage of instances with severity levels (Very low, Low, Medium, High) above a threshold. By default, we set the threshold as “Medium”.

:::image type="content" source="../../../media/evaluations/evaluate/safety-metrics.png" alt-text="Screenshot of the select metrics page with safety metrics selected when creating a new evaluation." lightbox="../../../media/evaluations/evaluate/safety-metrics.png":::

> [!NOTE]
> AI-assisted risk and safety metrics are hosted by Azure AI Studio safety evaluations back-end service and is only available in the following regions: East US 2, France Central, UK South, Sweden Central

#### Configure test data

You can select from pre-existing datasets or upload a new dataset specifically to evaluate. The test dataset needs to have the model generated outputs to be used for evaluation if there's no flow selected in the previous step.

:::image type="content" source="../../../media/evaluations/evaluate/configure-test-data.png" alt-text="Screenshot of selecting test data when creating a new evaluation." lightbox="../../../media/evaluations/evaluate/configure-test-data.png":::

+ **Choose existing dataset**: You can choose the test dataset from your established dataset collection.  

    :::image type="content" source="../../../media/evaluations/evaluate/choose-existing-dataset.png" alt-text="Screenshot of the option to choose test data when creating a new evaluation." lightbox="../../../media/evaluations/evaluate/choose-existing-dataset.png":::

+ **Add new dataset**: You can either upload files from your local storage or manually enter the dataset.
    - For the 'Upload file' option, we only support `.csv` and `.jsonl` file formats.

        :::image type="content" source="../../../media/evaluations/evaluate/upload-file.png" alt-text="Screenshot of the upload file option when creating a new evaluation." lightbox="../../../media/evaluations/evaluate/upload-file.png":::

    - Manual input is only supported for Question Answering scenario.
    
        :::image type="content" source="../../../media/evaluations/evaluate/input-manually.png" alt-text="Screenshot of the manual data input option when creating a new evaluation." lightbox="../../../media/evaluations/evaluate/input-manually.png":::

+ **Data mapping**: You must specify which data columns in your dataset correspond with inputs needed in the evaluation. Different evaluation metrics demand distinct types of data inputs for accurate calculations. For guidance on the specific data mapping requirements for each metric, refer to the following information:

    :::image type="content" source="../../../media/evaluations/evaluate/data-mapping.png" alt-text="Screenshot of the dataset mapping when creating a new evaluation." lightbox="../../../media/evaluations/evaluate/data-mapping.png":::

> [!NOTE]
>  If you select a flow to evaluate, ensure that your data columns are configured to align with the required inputs for the flow to execute a batch run, generating output for assessment. The evaluation will then be conducted using the output from the flow. Subsequently, configure the data mapping for evaluation inputs.

For guidance on the specific data mapping requirements for each metric, refer to the information in the next section.

##### Question answering metric requirements

| Metric                     | Question      | Response      | Context       | Ground truth  |
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
- Response: the response to question generated by the model as answer
- Context: the source that response is generated with respect to (that is, grounding documents)
- Ground truth: the response to question generated by user/human as the true answer

##### Conversation metric requirements

| Metric                     | Messages       |
|----------------------------|----------------|
| Groundedness               | Required: list |
| Relevance                  | Required: list |
| Retrieval score            | Required: list |
| Self-harm-related content  | Required: list |
| Hateful and unfair content | Required: list |
| Violent content            | Required: list |
| Sexual content             | Required: list |

Messages: message key that follows the chat protocol format defined by Azure Open AI for [conversations](../../../concepts/evaluation-metrics-built-in.md#conversation-single-turn-and-multi-turn). For Groundedness, Relevance and Retrieval score, the citations key is required within your messages list.

#### Review and finish

After completing all the necessary configurations, you can review and proceed to select 'Create' to submit the evaluation run.

:::image type="content" source="../../../media/evaluations/evaluate/review-and-finish.png" alt-text="Screenshot of the review and finish page to create a new evaluation." lightbox="../../../media/evaluations/evaluate/review-and-finish.png":::

## Create an evaluation with custom evaluation flow 

There are two ways to develop your own evaluation methods: 
+ Customize a Built-in Evaluation Flow: Modify a built-in evaluation flow. Find the built-in evaluation flow from the flow creation wizard - flow gallery, select “Clone” to do customization. 
+ Create a New Evaluation Flow from Scratch: Develop a brand-new evaluation method from the ground up. In flow creation wizard, select “Create” Evaluation flow then you can see a template of evaluation flow. The process of customizing and creating evaluation methods is similar to that of a standard flow.
