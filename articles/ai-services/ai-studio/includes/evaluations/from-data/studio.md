---
 title: include file
 description: include file
 author: eur
 ms.author: eric-urban
 ms.service: azure-ai-services
 ms.topic: include
 ms.date: 10/1/2023
 ms.custom: include
---

To thoroughly assess the performance of your generative AI application when applied to a substantial dataset, you can initiate an evaluation process. During this evaluation, your application will be tested with the given dataset, and its performance will be quantitatively measured with both mathematical based metrics and AI-assisted metrics. This evaluation run will provide you with comprehensive insights into the application's capabilities and limitations. 

To carry out this evaluation, you can utilize the evaluation functionality in Azure AI Studio, a comprehensive platform that offers tools and features for assessing the performance of your generative AI model. In AI Studio, you will be able to log, view and analyze detailed evaluation metrics. 

In this article you'll learn to create an evaluation run from a test dataset or flow with built-in evaluation metrics from Azure AI Studio UI. For greater flexibility, you can establish a custom evaluation flow and employ the **custom evaluation** feature. Alternatively, if your objective is solely to conduct a batch run without any evaluation, you can also utilize the custom evaluation feature. 

## Prerequisites

To run an evaluation with AI-assisted metrics, you need to have the following ready: 

+ A test dataset in one of these formats: .csv, or .jsonl. If you do not have a dataset available, we also allow you to input data manually from the UI.  
+ A deployment of one of these models: GPT 3.5 models, GPT 4 models, or Davinci models. Learn more about how to create a deployment [here](*TODO:REPLACEWITHDEPLOYMENTDOCLINK*).  
+ A runtime with compute instance to run the evaluation.

## Create an evaluation with built-in evaluation metrics
An evaluation run allows you to generate metric outputs for each data row in your test dataset. You can choose one or more evaluation metrics to assess the output from different aspects. There are two places in AI Studio you can create an evaluation run from, Evaluate and Flow pages. Subsequently, an evaluation creation wizard will appear to guide you through the process of setting up an evaluation run.
### From Evaluate page
From the Evaluate page, click on the "New evaluation" button located at the top left corner of the page.

### From Flow page
From the Flow page, select the "Built-in evaluation" option after clicking the "Evaluate" button located at the top right corner of the page. 

#### Basic information
When you enter the evaluation creation wizard, provide a name for your evaluation run and select the scenario that best aligns with your application's objectives. We currently offer support for the following scenarios: 

+ **Question Answering**: This scenario is designed for applications that involve answering user queries and providing responses. 
+ **Conversation**: This scenario is suitable for applications where the model engages in conversation using a retrieval-augmented approach to extract information from your provided documents and generate detailed responses. 
> **_NOTE:_** For conversation scenario, we currently only support single turn in the Azure AI Studio UI. However, we provide support for multi-turn conversations in the Azure AI SDK and CLI.

By specifying the appropriate scenario, we can tailor the evaluation to the specific nature of your application, ensuring accurate and relevant metrics. 

+ **Evaluate from data**: If you already have your model generated outputs in a test dataset, skip the “Add flow and variants” step and directly go to the next step to select metrics.  
+ **Evaluate from flow**: If you initiate the evaluation from the Flow page, we will automatically select your flow to evaluate. If you intend to evaluate another flow, you have the option to select a different one. It's important to note that within a flow, you may have multiple nodes, each of which could have its own set of variants. In such cases, you will need to specify both the node and the particular variants you wish to assess during the evaluation process. 

#### Select metrics
By default, we will preselect certain recommended metrics based on the scenario you previously selected. You can refer to the table below for the default metrics, as well as the complete list of metrics we offer support for in each scenario. For more in-depth information on each metric definition and how it is calculated, learn more [here](https://aka.ms/azureaistudioevaluationmetrics).
| Scenario           | Default metrics                          | All metrics                                                                                        |
|--------------------|------------------------------------------|----------------------------------------------------------------------------------------------------|
| Question Answering | Groundedness, Relevance, Coherence       | Groundedness, Relevance, Coherence, Fluency, GPT Similarity, F1 Score, Exact Match, ADA Similarity |
| Conversation       | Groundedness, Relevance, Retrieval Score | Groundedness, Relevance, Retrieval Score                                                           |

When using AI-assisted metrics for evaluation, you must specify a GPT model for the calculation process. Please choose a deployment with either GPT-3.5, GPT-4, or the Davinci model for our calculations. If you select ADA similarity, it requires an embedding model and you must additionally select a deployment featuring the `text-similarity-ada-001` or `text-similarity-ada-002` model to support ADA similarity calculations. 

#### Configure test data

You can select from pre-existing datasets or upload a new dataset specifically to evaluate. The test dataset needs to have the model generated outputs to be used for evaluation if there is no flow selected. 

+ **Choose existing dataset**: You can choose the test dataset from your established dataset collection.  
+ **Add new dataset**: You can either upload files from your local storage or manually enter the dataset. Please be aware that for the 'Upload file' option, we only support `.csv` and `.jsonl` file formats. Manual input is only supported for Question Answering scenario.   
+ **Data mapping**: You must specify which data columns in your dataset corresponds with inputs needed in the evaluation. Different evaluation metrics demand distinct types of data inputs for accurate calculations. For guidance on the specific data mapping requirements for each metric, please refer to the information provided below:

##### Question Answering metric requirements
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
- Context: the source that response is generated with respect to (i.e. grounding documents)
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
After completing all the necessary configurations, you can review and proceed to click 'Create' to submit the evaluation run.

## Create an evaluation with custom evaluation flow 
There are two ways to develop your own evaluation methods: 
+ Customize a Built-in Evaluation Flow: Modify a built-in evaluation flow. Find the built-in evaluation flow from the flow creation wizard - flow gallery, select “Clone” to do customization.  
+ Create a New Evaluation Flow from Scratch: Develop a brand-new evaluation method from the ground up. In flow creation wizard, select “Create” Evaluation flow, then, you can see a template of evaluation flow. 

The process of customizing and creating evaluation methods is similar to that of a standard flow. Learn more on how to customize your own evaluation flow [here](https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/how-to-develop-an-evaluation-flow?view=azureml-api-2#understand-evaluation-in-prompt-flow).

## Next steps
Upon submission, you can locate the submitted evaluation run within the run list by navigating to the 'Evaluation' tab of your Azure AI Studio project. Next, learn more about how to [view your evaluation results and metrics](*TODO:REPLACEWITHRELATIVELINK*).

Learn more about how to evaluate your generative AI applications:
+ [Evaluate your generative AI apps via the playground](https://aka.ms/evaluateplayground)
+ [Monitor your generative AI app in production](https://aka.ms/azureaistudiomonitoring)
 
Learn more about the [supported task types and built-in metrics](https://aka.ms/azureaistudioevaluationmetrics) and  [harm mitigation techniques](https://aka.ms/azureaistudioharmsmitigations).