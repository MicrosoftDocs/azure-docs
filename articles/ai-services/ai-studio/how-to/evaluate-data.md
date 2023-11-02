---
title: How to evaluate from data in Azure AI Studio
titleSuffix: Azure AI services
description: Evaluate your generated data from your generative model with the Azure AI Studio, Azure AI SDK, and Azure AI CLI.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 10/1/2023
ms.author: eur
---

# How to evaluate from data in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

To thoroughly assess the performance of your generative AI application when applied to a substantial dataset, you can initiate an evaluation process. During this evaluation, your application will be tested with the given dataset, and its performance will be quantitatively measured with both mathematical based metrics and AI-assisted metrics. This evaluation run will provide you with comprehensive insights into the application's capabilities and limitations. 

To carry out this evaluation, you can utilize the evaluation functionality in AI Studio, a comprehensive platform that offers tools and features for assessing the performance of your generative AI model. In AI Studio, you will be able to closely monitor the detailed evaluation metrics. 

By submitting your application for an evaluation in AI Studio, you can gain a deeper understanding of how it generates content, its accuracy, and how well it performs across a wide range of input scenarios. This detailed evaluation process will help you refine and enhance your generative AI application, ensuring it meets the highest standards and delivers the desired outcomes with large datasets. 

In this article you'll learn to create an evaluation run from a test dataset with built-in evaluation metrics from UI, SDK, and CLI.  

Prerequisites 

To run an evaluation with AI-assisted metrics, you need to have the following ready: 

A test dataset in one of these formats: .csv, or .jsonl. If you do not have a dataset available, we also allow you to input data manually from the UI.  

A deployment of one of these models: GPT 3.5 models, GPT 4 models, or Davinci models. Learn more about how to create a deployment here.  

Create an evaluation with built-in evaluation metrics   

An evaluation run allows you to generate metric outputs for each data row in your test dataset. You can choose one or more evaluation metrics to assess the output from different aspects. To start an evaluation run, you can click on the "New evaluation" button on the evaluation page.  image 

Basic information 

When you enter the evaluation creation wizard, your initial steps involve providing a name for your evaluation run and selecting the scenario that best aligns with your application's objectives. Presently, we offer support for two distinct scenarios: 

Question Answering: This scenario is designed for applications that involve answering user queries and providing responses. 

Conversation: This scenario is suitable for applications where the model engages in conversation using a retrieval-augmented approach to extract information from your provided documents and generate detailed responses. 

By specifying the appropriate scenario, we can tailor the evaluation process to the specific nature of your application, ensuring accurate and relevant assessments.  

 

If you intend to evaluate a dataset, you can skip the “Add flow and variants” step and directly go to the next step to select metrics.  

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

You can select from pre-existing datasets or include a new dataset specifically for the evaluation process. The test dataset needs to have the output (answer) to be used for evaluation if there is no flow selected. 

 

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

 
 
 

Next Step  

Upon submission, you can locate the submitted evaluation run within the run list by navigating to the 'Evaluation' tab. 

image 

Refer to the “View the evaluation results and metrics” section in this doc: Visualize and View Evaluation Results.docx (sharepoint-df.com) 