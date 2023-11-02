---
title: Evaluation of generative AI applications with Azure AI Studio
titleSuffix: Azure AI services
description: Explore the broader domain of monitoring and evaluating large language models through the establishment of precise metrics, the development of test sets for measurement, and the implementation of iterative testing.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: conceptual
ms.date: 10/1/2023
ms.author: eur
---

# Evaluation of generative AI applications 

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

Advancements in language models such as OpenAI GPT-4 and Llama 2 come with challenges related to responsible AI. If not designed carefully, these models can perpetuate biases, misinformation, manipulative content, and other harmful outcomes. Identifying, measuring, and mitigating potential harms associated with these models requires an iterative, multi-layered approach.  

The goal of the evaluation stage is to measure the frequency and severity of language models' harms by establishing clear metrics, creating measurement test sets, and completing iterative, systematic testing (both manual and automated). This evaluation stage helps app developers and ML professionals to perform targeted mitigation steps by implementing tools and strategies such as prompt engineering and using our content filters. Once the mitigations are applied, one can repeat measurements to test effectiveness after implementing mitigations. 

There are manual and automated approaches to measurement. We recommend you do both, starting with manual measurement. Manual measurement is useful for measuring progress on a small set of priority issues. When mitigating specific harms, it's often most productive to keep manually checking progress against a small dataset until the harm is no longer observed before moving to automated measurement. Azure AI Studio supports a manual evaluation experience for spot-checking small datasets.  

Automated measurement is useful for measuring at a large scale with increased coverage to provide more comprehensive results. It's also helpful for ongoing measurement to monitor for any regression as the system, usage, and mitigations evolve. We support two main methods for automated measurement of generative AI application: traditional metrics and AI-assisted metrics. 
 

## Traditional machine learning measurements 

 In the context of generative AI, traditional metrics are useful when we want to quantify the accuracy of the generated output compared to the expected output. Traditional machine learning metrics are beneficial when one has access to ground truth and expected answers.  

- Ground truth refers to the data that we know to be true and use as a baseline for comparison.  
- Expected answers are the outcomes that we predict should occur based on our ground truth data.  

For instance, in tasks such as classification or short-form question-answering, where there's typically one correct or expected answer, Exact Match or similar traditional metrics can be used to assess whether the AI's output matches the expected output exactly. 

[Traditional metrics](https://aka.ms/azureaistudioevaluationmetrics) are also helpful when we want to understand how much the generated answer is regressing, that is, deviating from the expected answer. They provide a quantitative measure of error or deviation, allowing us to track the performance of our model over time or compare the performance of different models. These metrics, however, might be less suitable for tasks that involve creativity, ambiguity, or multiple correct solutions, as these metrics typically treat any deviation from the expected answer as an error. 

## AI-assisted measurements 

Large language models (LLM) such as GPT-4 can be used to evaluate the output of generative AI language applications. This is achieved by instructing the LLM to quantify certain aspects of the AI-generated output. For instance, you can ask GPT-4 to judge the relevance of the output to the given question and context and instruct it to score the output on a scale (for example, 1-5).  

AI-assisted metrics can be beneficial in scenarios where ground truth and expected answers aren't accessible. Besides lack of ground truth data, in many generative AI tasks, such as open-ended question answering or creative writing, there might not be a single correct answer, making it challenging to establish ground truth or expected answers.  

[AI-assisted metrics](https://aka.ms/azureaistudioevaluationmetrics) could help you measure the quality or safety of the answer. Quality refers to attributes such as relevance, coherence, and fluency of the answer, while safety refers to metrics such as groundedness, which measures whether the answer is grounded in the context provided, or content harms, which measure whether it contains harmful content.  

By instructing the LLM to quantify these attributes, you can get a measure of how well the generative AI is performing even when there isn't a single correct answer. AI-assisted metrics provide a flexible and nuanced way of evaluating generative AI applications, particularly in tasks that involve creativity, ambiguity, or multiple correct solutions. However, the accuracy of these metrics depends on the quality of the LLM, and the instructions given to it.

>[!NOTE]
> We currently support GPT-4 or GPT-3 to run the AI-assisted measurements. To utilize these models for evaluations, you are required to establish valid connections. Please note that we strongly recommend the use of GPT-4, the latest iteration of the GPT series of models, as it can be more reliable to judge the quality and safety of your answers. GPT-4 offers significant improvements in terms of contextual understanding, and when evaluating the quality and safety of your responses, GPT-4 is better equipped to provide more precise and trustworthy results. 


To learn more about the supported task types and built-in metrics, please refer to the [evaluation and monitoring metrics for generative AI](https://aka.ms/azureaistudioevaluationmetrics).

## Evaluating and monitoring of generative AI applications 

Azure AI Studio supports four distinct paths for generative AI app developers to evaluate their applications:  


:::image type="content" source="../media/evaluations/evaluation-monitor-flow.png" alt-text="Diagram of evaluation and monitoring flow with different paths to evaluate generative AI applications." lightbox="../media/evaluations/evaluation-monitor-flow.png":::


- Path 1: [Playground](https://aka.ms/evaluateplayground)- In the first path, you can start by engaging in a "playground" experience. Here, you have the option to select the data you want to use for grounding your model, choose the base model for the application, and provide metaprompt instructions to guide the model's behavior. You can then manually evaluate the application by passing a dataset and observing its responses. Once the manual inspection is complete, you can opt to use the evaluation wizard to conduct more comprehensive assessments, either through traditional mathematical metrics or AI-assisted measurements.  

- Path 2: [Flows](https://aka.ms/evaluateflows)- Azure AI Studio's "Flows" tab offers a dedicated development tool tailored for streamlining the entire lifecycle of AI applications powered by LLMs. With this path, you can create executable flows that link LLMs, prompts, and Python tools through a visualized graph. This feature simplifies debugging, sharing, and collaborative iterations of flows. Furthermore, you can create prompt variants and assess their performance through large-scale testing.  
In addition to the 'Flows' development tool, you also have the option to develop your generative AI applications using a code-first SDK experience. Regardless of your chosen development path, you can evaluate your created flows through the evaluation wizard, accessible from the 'Flows' tab, or via the SDK/CLI experience. From the ‘Flows’ tab, you even have the flexibility to use a customized evaluation wizard and incorporate your own measurements. 

- Path 3: [Direct Dataset Evaluation](https://aka.ms/evaluatedata)- If you have collected a dataset containing interactions between your application and end-users, you can submit this data directly to the evaluation wizard within the "Evaluation" tab. This process enables the generation of automatic AI-assisted measurements, and the results can be visualized in the same tab. This approach centers on a data-centric evaluation method. Alternatively, you have the option to evaluate your conversation dataset using the SDK/CLI experience and generate and visualize measurements through the Azure AI Studio.

After assessing your applications, flows, or data from any of these channels, you can proceed to deploy your generative AI application and [monitor its performance and safety](https://aka.ms/azureaistudiomonitoring) in a production environment as it engages in new interactions with your users.


## Next steps

- [Evaluate your generative AI apps via the playground](../how-to/evaluate-prompts-playground.md)
- [Evaluate your generative AI apps with the Azure AI Studio or SDK](../how-to/evaluate-generative-ai-app.md)
- [View the evaluation results](../how-to/view-evaluation-results.md)