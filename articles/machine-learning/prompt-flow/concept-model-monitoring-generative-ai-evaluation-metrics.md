---
title: Monitoring evaluation metrics descriptions and use cases (preview)
titleSuffix: Azure Machine Learning
description: Understand the metrics used when monitoring the performance of generative AI models deployed to production on Azure Machine Learning.
services: machine-learning
author: buchananwp
ms.author: wibuchan
ms.service: machine-learning
ms.subservice: mlops
ms.reviewer: scottpolly
reviewer: s-polly
ms.topic: how-to
ms.date: 09/06/2023
ms.custom: devplatv2
---


# Monitoring evaluation metrics descriptions and use cases

In this article, you learn about the metrics used when monitoring and evaluating generative AI models in Azure Machine Learning, and the recommended practices for using generative AI model monitoring.

> [!IMPORTANT]
> Monitoring is currently in public preview. is currently in public preview. This preview is provided without a service-level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Model monitoring tracks model performance in production and aims to understand it from both data science and operational perspectives. To implement monitoring, Azure Machine Learning uses monitoring signals acquired through data analysis on streamed data.  Each monitoring signal has one or more metrics. You can set thresholds for these metrics in order to receive alerts via Azure Machine Learning or Azure Monitor about model or data anomalies.

## Groundedness
Groundedness evaluates how well the model's generated answers align with information from the input source. Answers are verified as claims against context in the user-defined ground truth source: even if answers are true (factually correct), if not verifiable against the source text, then it's scored as ungrounded. Responses verified as claims against "context" in the ground truth source (such as your input source or your database). 
- **Use it when:** You're worried your application generates information that isn't included as part of your generative AI's trained knowledge (also known as unverifiable information).|
- **How to read it:** If the model's answers are highly grounded, it indicates that the facts covered in the AI system's responses are verifiable by the input source or internal database. Conversely, low groundedness scores suggest that the facts mentioned in the AI system's responses may not be adequately supported or verifiable by the input source or internal database. In such cases, the model's generated answers could be based solely on its pretrained knowledge, which may not align with the specific context or domain of the given input
- **Scale:** 
    - 1 = "ungrounded": suggests that responses aren't verifiable by the input source or internal database. 
    - 5 = "perfect groundedness" suggests that the facts covered in the AI system's responses are verifiable by the input source or internal database. 

## Relevance
The relevance metric measures the extent to which the model's generated responses are pertinent and directly related to the given questions. When users interact with a generative AI model, they pose questions or input prompts, expecting meaningful and contextually appropriate answers.
- **Use it when:** You would like to achieve high relevance for your application's answers to enhance the user experience and utility of your generative AI systems.
- **How to read it:** Answers are scored in their ability to capture the key points of the question from the context in the ground truth source. If the model's answers are highly relevant, it indicates that the AI system comprehends the input and can produce coherent and contextually appropriate outputs. Conversely, low relevance scores suggest that the generated responses might be off-topic, lack context, or fail to address the user's intended queries adequately.    
- **Scale:**
    - 1 = "irrelevant" suggests that the generated responses might be off-topic, lack context, or fail to address the user's intended queries adequately.    
    - 5 = "perfect relevance" suggests contextually appropriate outputs. 

## Coherence
Coherence evaluates how well the language model can produce output that flows smoothly, reads naturally, and resembles human-like language. How well does the bot communicate its messages in a brief and clear way, using simple and appropriate language and avoiding unnecessary or confusing information? How easy is it for the user to understand and follow the bot responses, and how well do they match the user's needs and expectations? 
- **Use it when:** You would like to test the readability and user-friendliness of your model's generated responses in real-world applications.
- **How to read it:** If the model's answers are highly coherent, it indicates that the AI system generates seamless, well-structured text with smooth transitions. Consistent context throughout the text enhances readability and understanding. Low coherence means that the quality of the sentences in a model's predicted answer is poor, and they don't fit together naturally. The generated text may lack a logical flow, and the sentences may appear disjointed, making it challenging for readers to understand the overall context or intended message. Answers are scored in their clarity, brevity, appropriate language, and ability to match defined user needs and expectations 
- **Scale:**
    - 1 = "incoherent": suggests that the quality of the sentences in a model's predicted answer is poor, and they don't fit together naturally. The generated text may lack a logical flow, and the sentences may appear disjointed, making it challenging for readers to understand the overall context or intended message.
    - 5 = "perfectly coherent": suggests that the AI system generates seamless, well-structured text with smooth transitions and consistent context throughout the text that enhances readability and understanding. 

## Fluency
Fluency evaluates the language proficiency of a generative AI's predicted answer. It assesses how well the generated text adheres to grammatical rules, syntactic structures, and appropriate usage of vocabulary, resulting in linguistically correct and natural-sounding responses. Answers are measured by the quality of individual sentences, and whether are they well-written and grammatically correct. This metric is valuable when evaluating the language model's ability to produce text that adheres to proper grammar, syntax, and vocabulary usage. 
- **Use it when:** You would like to assess the grammatical and linguistic accuracy of the generative AI's predicted answers.
- **How to read it:** If the model's answers are highly coherent, it indicates that the AI system follows grammatical rules and uses appropriate vocabulary. Consistent context throughout the text enhances readability and understanding. Conversely, low fluency scores indicate struggles with  grammatical errors and awkward phrasing, making the text less suitable for practical applications.  
- **Scale:**
    - 1 = "halting" suggests struggles with grammatical errors and awkward phrasing, making the text less suitable for practical applications.  
    - 5 = "perfect fluency" suggests that the AI system follows grammatical rules and uses appropriate vocabulary. Consistent context throughout the text enhances readability and understanding. 

## Similarity 
Similarity quantifies the similarity between a ground truth sentence (or document) and the prediction sentence generated by an AI model. It's calculated by first computing sentence-level embeddings for both the ground truth and the model's prediction. These embeddings represent high-dimensional vector representations of the sentences, capturing their semantic meaning and context. 
- **Use it when:** You would like to objectively evaluate the performance of an AI model (for text generation tasks where you have access to ground truth desired responses). Ada similarity allows you to compare the generated text against the desired content.
- **How to read it:** Answers are scored for equivalencies to the ground-truth answer by capturing the same information and meaning as the ground-truth answer for the given question. A high Ada similarity score suggests that the model's prediction is contextually similar to the ground truth, indicating accurate and relevant results. Conversely, a low Ada similarity score implies a mismatch or divergence between the prediction and the actual ground truth, potentially signaling inaccuracies or deficiencies in the model's performance.
- **Scale:**
    - 1 = "nonequivalence" suggests a mismatch or divergence between the prediction and the actual ground truth, potentially signaling inaccuracies or deficiencies in the model's performance.
    - 5 = "perfect equivalence" suggests that the model's prediction is contextually similar to the ground truth, indicating accurate and relevant results. 

## Next steps

- [Get started with prompt flow (preview)](get-started-prompt-flow.md)
- [Submit bulk test and evaluate a flow (preview)](how-to-bulk-test-evaluate-flow.md)
- [Monitoring AI applications](how-to-monitor-generative-ai-applications.md)
