---
title: How to evaluate from flows in Azure AI Studio
titleSuffix: Azure AI services
description: Evaluate your flows with either customized metrics or bult-in metrics in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 10/1/2023
ms.author: eur
---

# How to evaluate from flows in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

Evaluate from flows in Azure AI Studio 


To assess the performance of your flow with a large dataset, you have the option to initiate an evaluation run utilizing either the built-in evaluation or a custom evaluation in AI Studio. If custom metrics are unnecessary for your needs, we supply a range of evaluation metrics from various perspectives for evaluating flow performance. You can opt for the built-in evaluation feature for this purpose. For greater flexibility, you can establish a custom evaluation flow and employ the custom evaluation feature. Alternatively, if your objective is solely to conduct a batch run without any evaluation, you can also utilize the custom evaluation feature. 

In this article you'll learn to: 

Create an evaluation with built-in evaluation  

Create an evaluation with custom evaluation   

 

Prerequisites 

To run an evaluation with AI-assisted metrics, you need to have the following ready: 

A test dataset in one of these formats: .csv, or .jsonl. If you do not have a dataset available, we also allow you to input data manually from the UI.  

A deployment of one of these models: GPT 3.5 models, GPT 4 models, or Davinci models. Learn more about how to create a deployment here. 

Create an evaluation with built-in evaluation  

To initiate an evaluation run using our pre-defined metrics, simply select the "Built-in evaluation" option after clicking the "Evaluate" button located at the top right corner of the flow page. Subsequently, an evaluation creation wizard will appear, guiding you through the necessary steps for setting up a new evaluation run. Other than the flow page, you can also start an evaluation run for a flow from the evaluation page by clicking on the "New evaluation" button.  

image 

Basic information 

When you enter the evaluation creation wizard, your initial steps involve providing a name for your evaluation run and selecting the scenario that best aligns with your application's objectives. Presently, we offer support for two distinct scenarios: 

Question Answering: This scenario is designed for applications that involve answering user queries and providing responses. 

Conversation: This scenario is suitable for applications where the model engages in conversation using a retrieval-augmented approach to extract information from your provided documents and generate detailed responses. 

By specifying the appropriate scenario, we can tailor the evaluation process to the specific nature of your application, ensuring accurate and relevant assessments.  

 

If you initiate the evaluation from the flow, we will automatically select the flow to evaluate. If you intend to evaluate another flow, you have the option to select a different one. It's important to note that within a flow, you may have multiple nodes, each of which could have its own set of variants. In such cases, you will need to specify both the node and the particular variants you wish to assess during the evaluation process. 

  

Select metrics  

Next, you can choose the evaluation metrics for your assessment. By default, we will preselect certain recommended metrics based on the scenario you previously selected. You can refer to the table below for the default metrics, as well as the complete list of metrics we offer support for in each scenario. For in-depth information on each metric, please refer to Evaluation and Monitoring Metrics.docx (sharepoint-df.com) 

Scenario 

Default metrics 

All metrics 

Question Answering 

Groundedness, relevance, coherence 

Groundedness, relevance, coherence, fluency, GPT similarity, F1 score, exact match, bert similarity, ada similarity 

Conversation 

Groundedness, relevance, retrieval score. 

Groundedness, relevance, retrieval score 

 

When using AI-assisted metrics for evaluation, it is essential to specify another GPT model for the calculation process. Please choose a deployment with either GPT-3.5, GPT-4, or the Davinci model for our calculations. If you opt for 'ada similarity,' be aware that it necessitates an embedding model. In this case, please select a deployment featuring the 'text-similarity-ada-001' or 'text-similarity-ada-002' model to support ada similarity calculations. 

 

Configure test data  

You can select from pre-existing datasets or include a new dataset specifically for the evaluation process. The test dataset used for evaluation refers to a collection of data samples that are employed to assess the performance and effectiveness of the flow. 

 

Choose existing dataset  

You can choose the test dataset from your established dataset collection.  

 

Add new dataset  

You have the choice to either upload files from your local storage or manually enter the dataset. Please be aware that for the 'Upload file' option, we only support csv and jsonl file formats. 

 

Manual input is only supported for Question Answering scenario.  

 

Data mapping 

Within your evaluation setup, you can associate specific data columns in your dataset with corresponding inputs. This allows you to link particular columns to specific inputs as needed.  

 

Different evaluation metrics demand distinct types of data inputs for accurate calculations. For guidance on the specific data mapping requirements for each metric, please refer to the information provided below. 

Question Answering  

Metric 

Question 

Response 

Context 

Ground truth 

Groundedness 

Required: Str 

Required: Str 

Required: Str 

N/A 

Coherence 

Required: Str 

Required: Str 

N/A 

N/A 

Fluency 

Required: Str 

Required: Str 

N/A 

N/A 

Relevance 

Required: Str 

Required: Str 

Required: Str 

N/A 

GPT similarity 

Required: Str 

Required: Str 

N/A 

Required: Str 

BERT similarity 

Required: Str 

Required: Str 

N/A 

Required: Str 

ADA similarity 

Required: Str 

Required: Str 

N/A 

Required: Str 

Question: the question asked by the user in Question Answer pair 

Response: the response to question generated by the model as answer 

Context: the source that response is generated with respect to (i.e. grounding documents) 

Ground truth: the response to question generated by user/human as the true answer 

Conversation 

Metric 

Question 

Answer 

Retrieved documents 

Groundedness 

Required: str 

Required: str 

Required: str 

Relevance 

Required: str 

Required: str 

Required: str 

Retrieval score 

Required: str 

N/A 

Required: str 

Question: the question asked by the user extracted from the conversation history 

Response: the response generated by the model 

Retrieved documents: string with context from retrieved_documents 

Review and finish  

After completing all the necessary configurations, you can review them, and when you are satisfied, you can proceed to click 'Create' to initiate the submission of a new evaluation run. 

  

Create an evaluation with custom evaluation  

[refer to content in https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/how-to-bulk-test-evaluate-flow?view=azureml-api-2#submit-a-batch-run-and-use-a-built-in-evaluation-method ] 

Develop a custom evaluation flow  

There are two ways to develop your own evaluation methods: 

Customize a Built-in Evaluation Flow: Modify a built-in evaluation flow. Find the built-in evaluation flow from the flow creation wizard - flow gallery, select “Clone” to do customization.  

Create a New Evaluation Flow from Scratch: Develop a brand-new evaluation method from the ground up. In flow creation wizard, select “Create” Evaluation flow, then, you can see a template of evaluation flow. 

The process of customizing and creating evaluation methods is similar to that of a standard flow. 

Understand evaluation flow 

[Refer to content in https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/how-to-develop-an-evaluation-flow?view=azureml-api-2#understand-evaluation-in-prompt-flow  ]  

View evaluation results  

View the evaluation runs 

Upon submitting your evaluation, you can locate the submitted evaluation run within the run list by navigating to the 'Evaluation' tab. 

image 

Refer to the “View the evaluation results and metrics” section in this doc: Visualize and View Evaluation Results.docx (sharepoint-df.com) 

View the detailed results  

[refer to content in https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/how-to-bulk-test-evaluate-flow?view=azureml-api-2#view-the-evaluation-result-and-metrics  , and https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/how-to-bulk-test-evaluate-flow?view=azureml-api-2#check-batch-run-history-and-compare-metrics ] 

 

 

 

 