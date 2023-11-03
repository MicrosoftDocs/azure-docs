---
title: Evaluation and monitoring metrics for generative AI
titleSuffix: Azure AI services
description: Discover the supported built-in metrics for evaluating large language models, understand their application and usage, and learn how to interpret them effectively.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: conceptual
ms.date: 10/1/2023
ms.author: eur
---

# Evaluation and monitoring metrics for generative AI 
    
[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

We support built-in metrics for the following task types: 

- Single-turn question answering without retrieval augmented generation (non-RAG)
- Multi-turn or single-turn chat with retrieval augmented generation (RAG) 

 
Retrieval augmented generation (RAG) is a methodology that uses pretrained Large Language Models (LLM) with your custom data to produce responses. RAG allows businesses to achieve customized solutions while maintaining data relevance and optimizing costs. By adopting RAG, companies can use the reasoning capabilities of LLMs, utilizing their existing models to process and generate responses based on new data. RAG facilitates periodic data updates without the need for fine-tuning, thereby streamlining the integration of LLMs into businesses. 

- Provide supplemental data as a directive or a prompt to the LLM. 
- Add a fact checking component on your existing models. 
- Train your model on up-to-date data without incurring the extra time and costs associated with fine-tuning. 
- Train on your business specific data. 

Our platform allows you to evaluate single-turn or complex multi-turn conversations where you ground the generative AI model in your specific data (RAG). You can also evaluate general single-turn question answering scenarios, where no context is used to ground your generative AI model (non-RAG). 
 
 ## Single-turn question answering without retrieval (non-RAG) 

In this setup, users pose individual questions or prompts, and a generative AI model is employed to instantly generate responses, making it ideal for obtaining prompt and context-free information.  

 
Example:
>**User**: Tell me a short story about a detective solving a mystery. **AI**: Once upon a time in the bustling city of Noirville, Detective John Steele received a cryptic letter in the mail. The message was simple but perplexing... Or **User**: Who wrote the book "Pride and Prejudice"?  **AI**: "Pride and Prejudice" was written by Jane Austen. 



## Multi-turn or single-turn chat with retrieval (RAG)  

In this context, users engage in conversational interactions, either through a series of turns or in a single exchange. The generative AI model, equipped with retrieval mechanisms, not only generates responses but also has the capability to access and incorporate information from external sources, such as documents. The RAG model enhances the quality and relevance of responses by using external documents and knowledge. 

 

Example (multi-turn): 
>**User**: Can you summarize the Q2 sales data from the quarterly report I uploaded? **AI**: Sure, I've extracted the sales figures from the report. In Q2, the total sales were $500,000, which is a 10% increase compared to Q1.  **User**: Now tell me more about how it compares to Q3 sales.   **AI**: In Q3, the total sales were $600,000, which is a 20% increase compared to Q2. 

Example (single-turn): 
>**User**: How much are the RoadLover V2.0 hiking shoes?**AI**: They are on sale for 56 dollars. 


Whether you need quick answers, data-driven responses, or open-ended conversations, the following built-in measurements could help you evaluate the safety and quality of your generative AI applications. 

## Supported metrics

As described in the [methods for evaluating large language models](https://aka.ms/azureaistudioevaluation), there are manual and automated approaches to measurement. Automated measurement is useful for measuring at a large scale with increased coverage to supply more comprehensive results. It's also helpful for ongoing measurement to monitor for any regression as the system, usage, and mitigations evolve. We support two main methods for automated measurement of generative AI applications: Traditional machine learning metrics and AI-assisted metrics. AI-assisted measurements utilize language models like GPT-4 to assess AI-generated content, especially in situations where expected answers are unavailable due to the absence of a defined ground truth. Traditional machine learning metrics, like Exact Match, gauge the similarity between AI-generated responses and the anticipated answers, focusing on determining if the AI's response precisely matches the expected response. We support the following metrics for the above scenarios:

| Task type | AI-assisted metrics  | Traditional machine learning metrics  | 
| --- | --- | --- |
| Single-turn question answering without retrieval (non-RAG)  | Groundedness, Relevance, Coherence, Fluency, GPT-Similarity  | F1 Score, Exact Match, ADA Similarity  |
| Multi-turn or single-turn chat with retrieval (RAG)  | Groundedness, Relevance, Retrieval Score  | None |


> NOTE: Please note that while we are providing you with a comprehensive set of built-in metrics that facilitate the easy and efficient evaluation of the quality and safety of your generative AI application, you can easily adapt and customize them to your specific scenario. Furthermore, we empower you to introduce entirely new metrics, enabling you to measure your applications from fresh angles and ensuring alignment with your unique objectives. 

## Metrics for single-turn question answering without retrieval (non-RAG)

### AI-assisted: Groundedness 
| Score characteristics | Score details  | 
| ----- | --- | 
| Score range | Integer [1-5]: where 1 is bad and 5 is good  | 
| What is this metric? | Measures how well the model's generated answers align with information from the source data (user-defined context).|
| How does it work?  | The groundedness measure assesses the correspondence between claims in an AI-generated answer and the source context, making sure that these claims are substantiated by the context. Even if the responses from LLM are factually correct, they'll be considered ungrounded if they can't be verified against the provided sources (such as your input source or your database).   |
| When to use it?  | Use the groundedness metric when you need to verify that AI-generated responses align with and are validated by the provided context. It's essential for applications where factual correctness and contextual accuracy are key, like information retrieval, question-answering, and content summarization. This metric ensures that the AI-generated answers are well-supported by the context.   |
| What does it need as input?  | Question, Context, Generated Answer | 


Built-in instructions to measure this metric:

```
You will be presented with a CONTEXT and an ANSWER about that CONTEXT. You need to decide whether the ANSWER is entailed by the CONTEXT by choosing one of the following rating: 

1. 5: The ANSWER follows logically from the information contained in the CONTEXT. 

2. 1: The ANSWER is logically false from the information contained in the CONTEXT. 

3. an integer score between 1 and 5 and if such integer score does not exist,  

use 1: It is not possible to determine whether the ANSWER is true or false without further information. 

Read the passage of information thoroughly and select the correct answer from the three answer labels. 

Read the CONTEXT thoroughly to ensure you know what the CONTEXT entails.  

Note the ANSWER is generated by a computer system, it can contain certain symbols, which should not be a negative factor in the evaluation. 
```

### AI-assisted: Relevance 
| Score characteristics | Score details  | 
| ----- | --- | 
| Score range | Integer [1-5]: where 1 is bad and 5 is good  | 
|  What is this metric? | Measures the extent to which the model's generated responses are pertinent and directly related to the given questions. |
| How does it work? | The relevance measure assesses the ability of answers to capture the key points of the context. High relevance scores signify the AI system's understanding of the input and its capability to produce coherent and contextually appropriate outputs. Conversely, low relevance scores indicate that generated responses might be off-topic, lacking in context, or insufficient in addressing the user's intended queries.    |
| When to use it?   | Use the relevance metric when evaluating the AI system's performance in understanding the input and generating contextually appropriate responses.   |
| What does it need as input?  | Question, Context, Generated Answer | 


Built-in instructions to measure this metric:

```
Relevance measures how well the answer addresses the main aspects of the question, based on the context. Consider whether all and only the important aspects are contained in the answer when evaluating relevance. Given the context and question, score the relevance of the answer between one to five stars using the following rating scale: 

One star: the answer completely lacks relevance 

Two stars: the answer mostly lacks relevance 

Three stars: the answer is partially relevant 

Four stars: the answer is mostly relevant 

Five stars: the answer has perfect relevance 

This rating value should always be an integer between 1 and 5. So the rating produced should be 1 or 2 or 3 or 4 or 5. 
```

### AI-assisted: Coherence 

| Score characteristics | Score details  | 
| ----- | --- | 
| Score range | Integer [1-5]: where 1 is bad and 5 is good  | 
|  What is this metric? | Measures how well the language model can produce output that flows smoothly, reads naturally, and resembles human-like language.  |
| How does it work? | The coherence measure assesses the ability of the language model to generate text that reads naturally, flows smoothly, and resembles human-like language in its responses.     |
| When to use it?   | Use it when assessing the readability and user-friendliness of your model's generated responses in real-world applications.   |
| What does it need as input?  | Question, Generated Answer | 


Built-in instructions to measure this metric:

```
Coherence of an answer is measured by how well all the sentences fit together and sound naturally as a whole. Consider the overall quality of the answer when evaluating coherence. Given the question and answer, score the coherence of answer between one to five stars using the following rating scale: 

One star: the answer completely lacks coherence 

Two stars: the answer mostly lacks coherence 

Three stars: the answer is partially coherent 

Four stars: the answer is mostly coherent 

Five stars: the answer has perfect coherency 

This rating value should always be an integer between 1 and 5. So the rating produced should be 1 or 2 or 3 or 4 or 5. 
```
### AI-assisted: Fluency 
| Score characteristics | Score details  | 
| ----- | --- | 
| Score range | Integer [1-5]: where 1 is bad and 5 is good  | 
|  What is this metric? | Measures the grammatical proficiency of a generative AI's predicted answer.  |
| How does it work? | The fluency measure assesses the extent to which the generated text conforms to grammatical rules, syntactic structures, and appropriate vocabulary usage, resulting in linguistically correct responses.    |
| When to use it?   | Use it when evaluating the linguistic correctness of the AI-generated text, ensuring that it adheres to proper grammatical rules, syntactic structures, and vocabulary usage in the generated responses.   |
| What does it need as input?  | Question, Generated Answer | 




Built-in instructions to measure this metric:

```
Fluency measures the quality of individual sentences in the answer, and whether they are well-written and grammatically correct. Consider the quality of individual sentences when evaluating fluency. Given the question and answer, score the fluency of the answer between one to five stars using the following rating scale: 

One star: the answer completely lacks fluency 

Two stars: the answer mostly lacks fluency 

Three stars: the answer is partially fluent 

Four stars: the answer is mostly fluent 

Five stars: the answer has perfect fluency 

This rating value should always be an integer between 1 and 5. So the rating produced should be 1 or 2 or 3 or 4 or 5. 
```

### AI-assisted: GPT-Similarity 

| Score characteristics | Score details  | 
| ----- | --- | 
| Score range | Integer [1-5]: where 1 is bad and 5 is good  | 
|  What is this metric? | Measures the similarity between a source data (ground truth) sentence and the generated response by an AI model. |
| How does it work? | The GPT-similarity measure evaluates the likeness between a ground truth sentence (or document) and the AI model's generated prediction. This calculation involves creating sentence-level embeddings for both the ground truth and the model's prediction, which are high-dimensional vector representations capturing the semantic meaning and context of the sentences.  |
| When to use it?   | Use it when you want an objective evaluation of an AI model's performance, particularly in text generation tasks where you have access to ground truth responses. GPT-similarity enables you to assess the generated text's semantic alignment with the desired content, helping to gauge the model's quality and accuracy. |
| What does it need as input?  | Question, Ground Truth Answer, Generated Answer  | 



Built-in instructions to measure this metric:

```
GPT-Similarity, as a metric, measures the similarity between the predicted answer and the correct answer. If the information and content in the predicted answer is similar or equivalent to the correct answer, then the value of the Equivalence metric should be high, else it should be low. Given the question, correct answer, and predicted answer, determine the value of Equivalence metric using the following rating scale: 

One star: the predicted answer is not at all similar to the correct answer 

Two stars: the predicted answer is mostly not similar to the correct answer 

Three stars: the predicted answer is somewhat similar to the correct answer 

Four stars: the predicted answer is mostly similar to the correct answer 

Five stars: the predicted answer is completely similar to the correct answer 

This rating value should always be an integer between 1 and 5. So the rating produced should be 1 or 2 or 3 or 4 or 5. 
```

### Traditional machine learning: F1 Score 

| Score characteristics | Score details  | 
| ----- | --- | 
| Score range | Float [0-1]   | 
|  What is this metric? | Measures the ratio of the number of shared words between the model generation and the ground truth answers. |
| How does it work? | The F1-score computes the ratio of the number of shared words between the model generation and the ground truth. Ratio is computed over the individual words in the generated response against those in the ground truth answer. The number of shared words between the generation and the truth is the basis of the F1 score: precision is the ratio of the number of shared words to the total number of words in the generation, and recall is the ratio of the number of shared words to the total number of words in the ground truth. |
| When to use it?   | Use the F1 score when you want a single comprehensive metric that combines both recall and precision in your model's responses. It provides a balanced evaluation of your model's performance in terms of capturing accurate information in the response. |
| What does it need as input?  | Question, Ground Truth Answer, Generated Answer  | 

### AI-assisted: Exact Match 

| Score characteristics | Score details  | 
| ----- | --- | 
| Score range | Bool [0-1]   | 
|  What is this metric? | Measures whether the characters in the model generation exactly match the characters of the ground truth answer.  |
| How does it work? | The exact match metric, in essence, evaluates whether a model's prediction exactly matches one of the true answers through token matching. It employs a strict all-or-nothing criterion, assigning a score of 1 if the characters in the model's prediction exactly match those in any of the true answers, and a score of 0 if there's any deviation. Even being off by a single character results in a score of 0. |
| When to use it?   | The exact match metric is the most stringent/restrictive comparison metric and should be used when you need to assess the precision of a model's responses in text generation tasks, especially when you require exact and precise matches with true answers. (for example, classification scenario) |
| What does it need as input?  | Question, Ground Truth Answer, Generated Answer  | 

### AI-assisted: ADA Similarity 

| Score characteristics | Score details  | 
| ----- | --- | 
| Score range | Float [0-1]   | 
|  What is this metric? | Measures statistical similarity between the model generation and the ground truth. |
| How does it work? | Ada-Similarity computes sentence (document) level embeddings using Ada-embeddings API for both ground truth and generation. Then computes cosine similarity between them.  |
| When to use it?   | Use the Ada-similarity metric when you want to measure the similarity between the embeddings of ground truth text and text generated by an AI model. This metric is valuable when you need to assess the extent to which the generated text aligns with the reference or ground truth content, providing insights into the quality and relevance of the AI application.  |
| What does it need as input?  | Question, Ground Truth Answer, Generated Answer  | 

## Metrics for multi-turn or single-turn chat with retrieval augmentation (RAG)

### AI-assisted: Groundedness 

| Score characteristics | Score details  | 
| ----- | --- | 
| Score range | Float [1-5]: where 1 is bad and 5 is good  | 
| What is this metric? | Measures how well the model's generated answers align with information from the source data (user-defined context).|
| How does it work?  | The groundedness measure assesses the correspondence between claims in an AI-generated answer and the source context, making sure that these claims are substantiated by the context.  Even if the responses from LLM are factually correct, they'll be considered ungrounded if they can't be verified against the provided sources (such as your input source or your database).  A conversation is grounded if all responses are grounded.    |
| When to use it?  | Use the groundedness metric when you need to verify if your application consistently generates responses that are grounded in the provided sources, particularly after multi-turn conversations that might involve potentially misleading interaction. It's essential for applications where factual correctness and contextual accuracy are key, like information retrieval, question-answering, and content summarization.   |
| What does it need as input?  | Question, Context, Generated Answer | 


Built-in instructions to measure this metric:

```
Your task is to check and rate if factual information in chatbot's reply is all grounded to retrieved documents. 

You will be given a question, chatbot's response to the question, a chat history between this chatbot and human, and a list of retrieved documents in json format.  

The chatbot must base its response exclusively on factual information extracted from the retrieved documents, utilizing paraphrasing, summarization, or inference techniques. When the chatbot responds to information that is not mentioned in or cannot be inferred from the retrieved documents, we refer to it as a grounded issue. 

 
To rate the groundness of chat response, follow the below steps: 

1. Review the chat history to understand better about the question and chat response 

2. Look for all the factual information in chatbot's response  

3. Compare the factual information in chatbot's response with the retrieved documents. Check if there are any facts that are not in the retrieved documents at all,or that contradict or distort the facts in the retrieved documents. If there are, write them down. If there are none, leave it blank. Note that some facts may be implied or suggested by the retrieved documents, but not explicitly stated. In that case, use your best judgment to decide if the fact is grounded or not.  

   For example, if the retrieved documents mention that a film was nominated for 12 Oscars, and chatbot's reply states the same, you can consider that fact as grounded, as it is directly taken from the retrieved documents.  

   However, if the retrieved documents do not mention the film won any awards at all, and chatbot reply states that the film won some awards, you should consider that fact as not grounded. 

4. Rate how well grounded the chatbot response is on a Likert scale from 1 to 5 judging if chatbot response has no ungrounded facts. (higher better) 

   5: agree strongly 

   4: agree 

   3: neither agree or disagree 

   2: disagree 

   1: disagree strongly 

   If the chatbot response used information from outside sources, or made claims that are not backed up by the retrieved documents, give it a low score.  

5. Your answer should follow the format:  

    <Quality reasoning:> [insert reasoning here] 

    <Quality score: [insert score here]/5> 

Your answer must end with <Input for Labeling End>. 
```

### AI-assisted: Relevance 

| Score characteristics | Score details  | 
| ----- | --- | 
| Score range | Float [1-5]: where 1 is bad and 5 is good  | 
|  What is this metric? | Measures the extent to which the model's generated responses are pertinent and directly related to the given questions. |
| How does it work? | Step 1: LLM scores the relevance between the model-generated answer and the question based on the retrieved documents.  Step 2: Determines if the generated answer provides enough information to address the question as per the retrieved documents.  Step 3: Reduces the score if the generated answer is lacking relevant information or contains unnecessary information.    |
| When to use it?   | Use the relevance metric when evaluating the AI system's performance in understanding the input and generating contextually appropriate responses.   |
| What does it need as input?  | Question, Context, Generated Answer, (Optional) Ground Truth  | 


Built-in instructions to measure this metric (without Ground Truth available):

```
You will be provided a question, a conversation history, fetched documents related to the question and a response to the question in the {DOMAIN} domain. You task is to evaluate the quality of the provided response by following the steps below: 

- Understand the context of the question based on the conversation history. 

- Generate a reference answer that is only based on the conversation history, question, and fetched documents. Don't generate the reference answer based on your own knowledge. 

- You need to rate the provided response according to the reference answer if it's available on a scale of 1 (poor) to 5 (excellent), based on the below criteria: 

5 - Ideal: The provided response includes all information necessary to answer the question based on the reference answer and conversation history. Please be strict about giving a 5 score. 

4 - Mostly Relevant: The provided response is mostly relevant, although it may be a little too narrow or too broad based on the reference answer and conversation history. 

3 - Somewhat Relevant: The provided response may be partly helpful but might be hard to read or contain other irrelevant content based on the reference answer and conversation history. 

2 - Barely Relevant: The provided response is barely relevant, perhaps shown as a last resort based on the reference answer and conversation history. 

1 - Completely Irrelevant: The provided response should never be used for answering this question based on the reference answer and conversation history. 

- You need to rate the provided response to be 5, if the reference answer can not be generated since no relevant documents were retrieved. 

- You need to first provide a scoring reason for the evaluation according to the above criteria, and then provide a score for the quality of the provided response. 

- You need to translate the provided response into English if it's in another language.  

- Your final response must include both the reference answer and the evaluation result. The evaluation result should be written in English.  
```

Built-in instructions to measure this metric (with Ground Truth available):

```
Your task is to score the relevance between a generated answer and the question based on the ground truth answer in the range between 1 and 5, and please also provide the scoring reason. 

Your primary focus should be on determining whether the generated answer contains sufficient information to address the given question according to the ground truth answer.  

If the generated answer fails to provide enough relevant information or contains excessive extraneous information, then you should reduce the score accordingly. 

If the generated answer contradicts the ground truth answer, it will receive a low score of 1-2.  

For example, for question "Is the sky blue?", the ground truth answer is "Yes, the sky is blue." and the generated answer is "No, the sky is not blue.".  

In this example, the generated answer contradicts the ground truth answer by stating that the sky is not blue, when in fact it is blue.  

This inconsistency would result in a low score of 1-2, and the reason for the low score would reflect the contradiction between the generated answer and the ground truth answer. 

Please provide a clear reason for the low score, explaining how the generated answer contradicts the ground truth answer. 

Labeling standards are as following: 

5 - ideal, should include all information to answer the question comparing to the ground truth answer， and the generated answer is consistent with the ground truth answer 

4 - mostly relevant, although it may be a little too narrow or too broad comparing to the ground truth answer, and the generated answer is consistent with the ground truth answer 

3 - somewhat relevant, may be partly helpful but might be hard to read or contain other irrelevant content comparing to the ground truth answer, and the generated answer is consistent with the ground truth answer 

2 - barely relevant, perhaps shown as a last resort comparing to the ground truth answer, and the generated answer contrdicts with the ground truth answer 

1 - completely irrelevant, should never be used for answering this question comparing to the ground truth answer, and the generated answer contrdicts with the ground truth answer  
```

### AI-assisted: Retrieval Score  

| Score characteristics | Score details  | 
| ----- | --- | 
| Score range | Float [1-5]: where 1 is bad and 5 is good  | 
|  What is this metric? | Measures the extent to which the model's retrieved documents are pertinent and directly related to the given questions.   |
| How does it work? | Retrieval score measures the quality and relevance of the retrieved document to the user's question (summarized within the whole conversation history). Steps: Step 1: Break down user query into intents, Extract the intents from user query like “How much is the Azure linux VM and Azure Windows VM?” -> Intent would be [“what’s the pricing of Azure Linux VM?”, “What’s the pricing of Azure Windows VM?”]. Step 2: For each intent of user query, ask the model to assess if the intent itself or the answer to the intent is present or can be inferred from retrieved documents. The answer can be “No”, or “Yes, documents [doc1], [doc2]…”. “Yes” means the retrieved documents relate to the intent or answer to the intent, and vice versa. Step 3: Calculate the fraction of the intents that have an answer starting with “Yes”. In this case, all intents have equal importance. Step 4: Finally, square the score to penalize the mistakes. |
| When to use it?   | Use the retrieval score when you want to guarantee that the documents retrieved are highly relevant for answering your users' questions. This score helps ensure the quality and appropriateness of the retrieved content.    |
| What does it need as input?  | Question, Context, Generated Answer  | 


Built-in instructions to measure this metric:

```
A chat history between user and bot is shown below 

A list of documents is shown below in json format, and each document has one unique id.  

These listed documents are used as contex to answer the given question. 

The task is to score the relevance between the documents and the potential answer to the given question in the range of 1 to 5.  

1 means none of the documents is relevant to the question at all. 5 means either one of the document or combination of a few documents is ideal for answering the given question. 

Think through step by step: 

- Summarize each given document first 

- Determine the underlying intent of the given question, when the question is ambiguous, refer to the given chat history  

- Measure how suitable each document to the given question, list the document id and the corresponding relevance score.  

- Summarize the overall relevance of given list of documents to the given question after # Overall Reason, note that the answer to the question can soley from single document or a combination of multiple documents.  

- Finally, output "# Result" followed by a score from 1 to 5.  

  

# Question 

{{ query }} 

# Chat History 

{{ history }} 

# Documents 

---BEGIN RETRIEVED DOCUMENTS--- 

{{ FullBody }} 

---END RETRIEVED DOCUMENTS--- 
```


## Next steps

- [Evaluate your generative AI apps via the playground](../how-to/evaluate-prompts-playground.md)
- [Evaluate your generative AI apps with the Azure AI Studio or SDK](../how-to/evaluate-generative-ai-app.md)
- [View the evaluation results](../how-to/evaluate-flow-results.md)