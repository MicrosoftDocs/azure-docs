---
title: Evaluation of generative AI applications with Azure AI Studio
titleSuffix: Azure AI Studio
description: Explore the broader domain of monitoring and evaluating large language models through the establishment of precise metrics, the development of test sets for measurement, and the implementation of iterative testing.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: conceptual
ms.date: 5/21/2024
ms.reviewer: eur
ms.author: lagayhar
author: lgayhardt
---

# Evaluation of generative AI applications

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

Advancements in language models such as GPT-4 via Azure OpenAI Service offer great promise while coming with challenges related to responsible AI. If not designed carefully, systems built upon these models can perpetuate existing societal biases, promote misinformation, create manipulative content, or lead to a wide range of other negative impacts. Addressing these risks while maximizing benefits to users is possible with an iterative approach through four stages: [identify, measure, and mitigate, operate](https://aka.ms/LLM-RAI-devstages).

The measurement stage provides crucial information for steering development toward quality and safety. On the one hand, this includes evaluation of performance and quality. On the other hand, when evaluating risk and safety, this includes evaluation of an AI system’s predisposition toward different risks (each of which can have different severities). In both cases, this is achieved by establishing clear metrics, creating test sets, and completing iterative, systematic testing. This measurement stage provides practitioners with signals that inform targeted mitigation steps such as prompt engineering and the application of content filters. Once mitigations are applied, one can repeat evaluations to test effectiveness.

Azure AI Studio provides practitioners with tools for manual and automated evaluation that can help you with the measurement stage. We recommend that you start with manual evaluation then proceed to automated evaluation. Manual evaluation, that is, manually reviewing the application’s generated outputs, is useful for tracking progress on a small set of priority issues. When mitigating specific risks, it's often most productive to keep manually checking progress against a small dataset until evidence of the risks is no longer observed before moving to automated evaluation. Azure AI Studio supports a manual evaluation experience for spot-checking small datasets.

Automated evaluation is useful for measuring quality and safety at scale with increased coverage to provide more comprehensive results. Automated evaluation tools also enable ongoing evaluations that periodically run to monitor for regression as the system, usage, and mitigations evolve. We support two main methods for automated evaluation of generative AI applications: traditional machine learning evaluations and AI-assisted evaluation.

## Traditional machine learning measurements 

In the context of generative AI, traditional machine learning evaluations (producing traditional machine learning metrics) are useful when we want to quantify the accuracy of generated outputs compared to expected answers. Traditional metrics are beneficial when one has access to ground truth and expected answers.

- Ground truth refers to data that we believe to be true and therefore use as a baseline for comparisons. 
- Expected answers are the outcomes that we believe should occur based on our ground truth data. 
For instance, in tasks such as classification or short-form question-answering, where there's typically one correct or expected answer, F1 scores or similar traditional metrics can be used to measure the precision and recall of generated outputs against the expected answers.

[Traditional metrics](./evaluation-metrics-built-in.md) are also helpful when we want to understand how much the generated outputs are regressing, that is, deviating from the expected answers. They provide a quantitative measure of error or deviation, allowing us to track the performance of the system over time or compare the performance of different systems. These metrics, however, might be less suitable for tasks that involve creativity, ambiguity, or multiple correct solutions, as these metrics typically treat any deviation from an expected answer as an error.

## AI-assisted evaluations

Large language models (LLM) such as GPT-4 can be used to evaluate the output of generative AI language systems. This is achieved by instructing an LLM to annotate certain aspects of the AI-generated output. For instance, you can provide GPT-4 with a relevance severity scale (for example, provide criteria for relevance annotation on a 1-5 scale) and then ask GPT-4 to annotate the relevance of an AI system’s response to a given question.  

AI-assisted evaluations can be beneficial in scenarios where ground truth and expected answers aren't available. In many generative AI scenarios, such as open-ended question answering or creative writing, single correct answers don't exist, making it challenging to establish the ground truth or expected answers that are necessary for traditional metrics.

In these cases,[AI-assisted evaluations](./evaluation-metrics-built-in.md) can help to measure important concepts like the quality and safety of generated outputs. Here, quality refers to performance and quality attributes such as relevance, coherence, fluency, and groundedness. Safety refers to risk and safety attributes such as presence of harmful content (content risks).

For each of these attributes, careful conceptualization and experimentation is required to create the LLM’s instructions and severity scale. Sometimes, these attributes refer to complex sociotechnical concepts that different people might view differently. So, it’s critical that the LLM’s annotation instructions are created to represent an agreed-upon, concrete definition of the attribute. Then, it’s similarly critical to ensure that the LLM applies the instructions in a way that is consistent with human expert annotators.

By instructing an LLM to annotate these attributes, you can build a metric for how well a generative AI application is performing even when there isn't a single correct answer. AI-assisted evaluations provide a flexible and nuanced way of evaluating generative AI applications, particularly in tasks that involve creativity, ambiguity, or multiple correct solutions. However, the reliability and validity of these evaluations depends on the quality of the LLM and the instructions given to it.

### AI-assisted performance and quality metrics

To run AI-assisted performance and quality evaluations, an LLM is possibly leveraged for two separate functions. First, a test dataset must be created. This can be created manually by choosing prompts and capturing responses from your AI system, or it can be created synthetically by simulating interactions between your AI system and an LLM (referred to as the AI-assisted dataset generator in the following diagram). Then, an LLM is also used to annotate your AI system’s outputs in the test set. Finally, annotations are aggregated into performance and quality metrics and logged to your AI Studio project for viewing and analysis.

:::image type="content" source="../media/evaluations/quality-evaluation-diagram.png" alt-text="Diagram of evaluate generative AI quality applications in AI Studio." lightbox="../media/evaluations/quality-evaluation-diagram.png":::

>[!NOTE]
> We currently support GPT-4 and GPT-3 as models for AI-assisted evaluations. To use these models for evaluations, you are required to establish valid connections. Please note that we strongly recommend the use of GPT-4, as it offers significant improvements in contextual understanding and adherence to instructions.

### AI-assisted risk and safety metrics

One application of AI-assisted quality and performance evaluations is the creation of AI-assisted risk and safety metrics. To create AI-assisted risk and safety metrics, Azure AI Studio safety evaluations provisions an Azure OpenAI GPT-4 model that is hosted in a back-end service, then orchestrates each of the two LLM-dependent steps:

- Simulating adversarial interactions with your generative AI system:

    Generate a high-quality test dataset of inputs and responses by simulating single-turn or multi-turn exchanges guided by prompts that are targeted to generate harmful responses. 
- Annotating your test dataset for content or security risks:

   Annotate each interaction from the test dataset with a severity and reasoning derived from a severity scale that is defined for each type of content and security risk.

Because the provisioned GPT-4 models act as an adversarial dataset generator or annotator, their safety filters are turned off and the models are hosted in a back-end service. The prompts used for these LLMs and the targeted adversarial prompt datasets are also hosted in the service. Due to the sensitive nature of the content being generated and passed through the LLM, the models and data assets aren't directly accessible to Azure AI Studio customers.

The adversarial targeted prompt datasets were developed by Microsoft researchers, applied scientists, linguists, and security experts to help users get started with evaluating content and security risks in generative AI systems.

If you already have a test dataset with input prompts and AI system responses (for example, records from red-teaming), you can directly pass that dataset in to be annotated by the content risk evaluator. Safety evaluations can help augment and accelerate manual red teaming efforts by enabling red teams to generate and automate adversarial prompts at scale. However, AI-assisted evaluations are neither designed to replace human review nor to provide comprehensive coverage of all possible risks.

:::image type="content" source="../media/evaluations/safety-evaluation-service-diagram.png" alt-text="Diagram of evaluate generative AI safety in AI Studio." lightbox="../media/evaluations/safety-evaluation-service-diagram.png":::

#### Evaluating jailbreak vulnerability

Unlike content risks, jailbreak vulnerability can't be reliably measured with direct annotation by an LLM. However, jailbreak vulnerability can be measured via comparison of two parallel test datasets: a baseline adversarial test dataset versus the same adversarial test dataset with jailbreak injections in the first turn. Each dataset can be annotated by the AI-assisted content risk evaluator, producing a content risk defect rate for each. Then the user evaluates jailbreak vulnerability by comparing the defect rates and noting cases where the jailbreak dataset led to more or higher severity defects. For example, if an instance in these parallel test datasets is annotated as more severe for the version with a jailbreak injection, that instance would be considered a jailbreak defect.

To learn more about the supported task types and built-in metrics, see [evaluation and monitoring metrics for generative AI](./evaluation-metrics-built-in.md).

## Evaluating and monitoring of generative AI applications

Azure AI Studio supports several distinct paths for generative AI app developers to evaluate their applications:  

:::image type="content" source="../media/evaluations/evaluation-monitor-flow.png" alt-text="Diagram of evaluation and monitoring flow with different paths to evaluate generative AI applications." lightbox="../media/evaluations/evaluation-monitor-flow.png":::

- Playground: In the first path, you can start by engaging in a "playground" experience. Here, you have the option to select the data you want to use for grounding your model, choose the base model for the application, and provide metaprompt instructions to guide the model's behavior. You can then manually evaluate the application by passing in a dataset and observing the application’s responses. Once the manual inspection is complete, you can opt to use the evaluation wizard to conduct more comprehensive assessments, either through traditional metrics or AI-assisted evaluations.  

- Flows: The Azure AI Studio **Prompt flow** page offers a dedicated development tool tailored for streamlining the entire lifecycle of AI applications powered by LLMs. With this path, you can create executable flows that link LLMs, prompts, and Python tools through a visualized graph. This feature simplifies debugging, sharing, and collaborative iterations of flows. Furthermore, you can create prompt variants and assess their performance through large-scale testing.  
In addition to the 'Flows' development tool, you also have the option to develop your generative AI applications using a code-first SDK experience. Regardless of your chosen development path, you can evaluate your created flows through the evaluation wizard, accessible from the 'Flows' tab, or via the SDK/CLI experience. From the ‘Flows’ tab, you even have the flexibility to use a customized evaluation wizard and incorporate your own metrics.

- Direct Dataset Evaluation: If you have collected a dataset containing interactions between your application and end-users, you can submit this data directly to the evaluation wizard within the "Evaluation" tab. This process enables the generation of automatic AI-assisted evaluations, and the results can be visualized in the same tab. This approach centers on a data-centric evaluation method. Alternatively, you have the option to evaluate your conversation dataset using the SDK/CLI experience and generate and visualize evaluations through the Azure AI Studio.

After assessing your applications, flows, or data from any of these channels, you can proceed to deploy your generative AI application and monitor its quality and safety in a production environment as it engages in new interactions with your users.

## Next steps

- [Evaluate your generative AI apps via the playground](../how-to/evaluate-prompts-playground.md)
- [Evaluate your generative AI apps with the Azure AI Studio or SDK](../how-to/evaluate-generative-ai-app.md)
- [View the evaluation results](../how-to/evaluate-flow-results.md)
- [Transparency Note for Azure AI Studio safety evaluations](safety-evaluations-transparency-note.md)
