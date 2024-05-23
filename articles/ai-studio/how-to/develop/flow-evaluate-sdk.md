---
title: Evaluate with the prompt flow SDK
titleSuffix: Azure AI Studio
description: This article provides instructions on how to evaluate with the prompt flow SDK.
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: dantaylo
ms.author: eur
author: eric-urban
---

# Evaluate with the prompt flow SDK

[!INCLUDE [Feature preview](../../includes/feature-preview.md)]

To thoroughly assess the performance of your generative AI application when applied to a substantial dataset, you can evaluate in your development environment with the prompt flow SDK. Given either a test dataset or a target, your generative AI application generations are quantitatively measured with both mathematical based metrics and AI-assisted quality and safety evaluators. Built-in or custom evaluators can provide you with comprehensive insights into the application's capabilities and limitations. 

In this article, you learn how to run evaluators on a single row of data, a larger test dataset on an application target with built-in evaluators using the prompt flow SDK then track the results and evaluation logs in Azure AI Studio.

## Getting started

First install the evaluators package from prompt flow SDK:

```python
pip install promptflow-evals
```

## Built-in evaluators

Built-in evaluators support the following application scenarios:
+ **Question and answer**: This scenario is designed for applications that involve sending in queries and generating answers. 
+ **Chat**: This scenario is suitable for applications where the model engages in conversation using a retrieval-augmented approach to extract information from your provided documents and generate detailed responses. 

For more in-depth information on each evaluator definition and how it's calculated, learn more [here](../../concepts/evaluation-metrics-built-in.md).

| Category  | Evaluator class                                                                                                                    |
|-----------|------------------------------------------------------------------------------------------------------------------------------------|
| Performance and quality   | `GroundednessEvaluator`, `RelevanceEvaluator`, `CoherenceEvaluator`, `FluencyEvaluator`, `SimilarityEvaluator`, `F1ScoreEvaluator` |
| Risk and safety    | `ViolenceEvaluator`, `SexualEvaluator`, `SelfHarmEvaluator`, `HateUnfairnessEvaluator`                                             |
| Composite | `QAEvaluator`, `ChatEvaluator`, `ContentSafetyEvaluator`, `ContentSafetyChatEvaluator`                                             |

Both categories of built-in quality and safety metrics take in question and answer pairs, along with additional information for specific evaluators. 

Built-in composite evaluators are composed of individual evaluators.
- `QAEvaluator` combines all the quality evaluators for a single output of combined metrics for question and answer pairs
- `ChatEvaluator` combines all the quality evaluators for a single output of combined metrics for chat messages following the OpenAI message protocol that can be found [here](https://platform.openai.com/docs/api-reference/messages/object#messages/object-content). In addition to all the quality evaluators, we include support for retrieval score. Retrieval score isn't currently supported as a standalone evaluator class.
- `ContentSafetyEvaluator` combines all the safety evaluators for a single output of combined metrics for question and answer pairs
- `ContentSafetyChatEvaluator` combines all the safety evaluators for a single output of combined metrics for chat messages following the OpenAI message protocol that can be found [here](https://platform.openai.com/docs/api-reference/messages/object#messages/object-content).

### Required data input for built-in evaluators
We require question and answer pairs in `.jsonl` format with the required inputs, and column mapping for evaluating datasets, as follows:

| Evaluator         | `question`      | `answer`      | `context`       | `ground_truth`  |
|----------------|---------------|---------------|---------------|---------------|
| `GroundednessEvaluator`   | N/A | Required: String | Required: String | N/A           |
| `RelevanceEvaluator`      | Required: String | Required: String | Required: String | N/A           |
| `CoherenceEvaluator`      | Required: String | Required: String | N/A           | N/A           |
| `FluencyEvaluator`        | Required: String | Required: String | N/A           | N/A           |
| `SimilarityEvaluator` | Required: String | Required: String | N/A           | Required: String |
| `F1ScoreEvaluator` | N/A  | Required: String | N/A           | Required: String |
| `ViolenceEvaluator`      | Required: String | Required: String | N/A           | N/A           |
| `SexualEvaluator`        | Required: String | Required: String | N/A           | N/A           |
| `SelfHarmEvaluator`      | Required: String | Required: String | N/A           | N/A           |
| `HateUnfairnessEvaluator`        | Required: String | Required: String | N/A           | N/A           |
- Question: the question sent in to the generative AI application
- Answer: the response to question generated by the generative AI application
- Context: the source that response is generated with respect to (that is, grounding documents)
- Ground truth: the response to question generated by user/human as the true answer
### Performance and quality evaluators
When using AI-assisted performance and quality metrics, you must specify a GPT model for the calculation process. Choose a deployment with either GPT-3.5, GPT-4, or the Davinci model for your calculations and set it as your `model_config`.

> [!NOTE]
> We recommend using GPT models that do not have the `(preview)` suffix for the best performance and parseable responses with our evaluators.

You can run the built-in evaluators by importing the desired evaluator class. Ensure that you set your environment variables.
```python
import os
from promptflow.core import AzureOpenAIModelConfiguration

# Initialize Azure OpenAI Connection with your environment variables
model_config = AzureOpenAIModelConfiguration(
    azure_endpoint=os.environ.get("AZURE_OPENAI_ENDPOINT"),
    api_key=os.environ.get("AZURE_OPENAI_API_KEY"),
    azure_deployment=os.environ.get("AZURE_OPENAI_DEPLOYMENT"),
    api_version=os.environ.get("AZURE_OPENAI_API_VERSION"),
)

from promptflow.evals.evaluators import RelevanceEvaluator

# Initialzing Relevance Evaluator
relevance_eval = RelevanceEvaluator(model_config)
# Running Relevance Evaluator on single input row
relevance_score = relevance_eval(
    answer="The Alpine Explorer Tent is the most waterproof.",
    context="From the our product list,"
    " the alpine explorer tent is the most waterproof."
    " The Adventure Dining Table has higher weight.",
    question="Which tent is the most waterproof?",
)
print(relevance_score)
```

Here's an example of the result:

```text
{'relevance.gpt_relevance': 5.0}
```

### Risk and safety evaluators 
When you use AI-assisted risk and safety metrics, a GPT model isn't required. Instead of `model_config`, provide your `azure_ai_project` information. This accesses the Azure AI Studio safety evaluations back-end service, which provisions a GPT-4 model that can generate content risk severity scores and reasoning to enable your safety evaluators.

> [!NOTE]
> Currently AI-assisted risk and safety metrics are only available in the following regions: East US 2, France Central, UK South, Sweden Central. Groundedness measurement leveraging Azure AI Content Safety Groundedness Detection is only supported following regions: East US 2 and Sweden Central. Read more about the supported metrics [here](../../concepts/evaluation-metrics-built-in.md) and when to use which metric. 

```python
azure_ai_project = {
    "subscription_id": "<subscription_id>",
    "resource_group_name": "<resource_group_name>",
    "project_name": "<project_name>",
}

from promptflow.evals.evaluators import ViolenceEvaluator

# Initialzing Violence Evaluator with project information
violence_eval = ViolenceEvaluator(azure_ai_project)
# Running Violence Evaluator on single input row
violence_score = violence_eval(question="What is the capital of France?", answer="Paris.")
print(violence_score)
```
```python
{'violence': 'Safe',
'violence_reason': "The system's response is a straightforward factual answer "
                    'to a geography question. There is no violent content or '
                    'language present.',
'violence_score': 0}
```
The result of the safety evaluators is a dictionary containing:

- `{metric_name}` provides a severity label for that content risk ranging from Very low, Low, Medium, and High. You can read more about the descriptions of each content risk and severity scale [here](../../concepts/evaluation-metrics-built-in.md).
- `{metric_name}_score` has a range between 0 and 7 severity level that maps to a severity label given in `{metric_name}`.
- `{metric_name}_reason` has a text reasoning for why a certain severity score was given for each data point.
#### Evaluating jailbreak vulnerability
Evaluating jailbreak is a comparative measurement, not an AI-assisted metric. Run `ContentSafetyEvaluator` or `ContentSafetyChatEvaluator` on two different, red-teamed datasets: a baseline adversarial test dataset versus the same adversarial test dataset with jailbreak injections in the first turn. You can do this with functionality and attack datasets generated with the [adversarial simulator](./simulator-interaction-data.md). Then you can evaluate jailbreak vulnerability by comparing results from content safety evaluators between the two test dataset's aggregate scores for each safety evaluator.

## Composite evaluators 
Composite evaluators are built in evaluators that combine the individual quality or safety metrics to easily provide a wide range of metrics right out of the box. 

The `ChatEvaluator` class provides quality metrics for evaluating chat messages, therefore there's an optional flag to indicate that you only want to evaluate on the last turn of a conversation. 
```python
from promptflow.evals.evaluators import ChatEvaluator

chat_evaluator = ChatEvaluator(
    model_config=model_config,
    eval_last_turn=true
  )
```

## Custom evaluators
Built-in evaluators are great out of the box to start evaluating your application's generations. However you might want to build your own code-based or prompt-based evaluator to cater to your specific evaluation needs.

### Code-based evaluators
Sometimes a large language model isn't needed for certain evaluation metrics. This is when code-based evaluators can give you the flexibility to define metrics based on functions or callable class.  Given a simple Python class in an example `answer_length.py` that calculates the length of an answer:
```python
class AnswerLengthEvaluator:
    def __init__(self):
        pass

    def __call__(self, *, answer: str, **kwargs):
        return {"answer_length": len(answer)}
```
You can create your own code-based evaluator and run it on a row of data by importing a callable class:
```python
with open("answer_length.py") as fin:
    print(fin.read())
from answer_length import AnswerLengthEvaluator

answer_length = AnswerLengthEvaluator(answer="What is the speed of light?")

print(answer_length)
```
The result:
```JSON
{"answer_length":27}
```
### Prompt-based evaluators
To build your own prompt-based large language model evaluator, you can create a custom evaluator based on a **Prompty** file. Prompty is a file with `.prompty` extension for developing prompt template. The Prompty asset is a markdown file with a modified front matter. The front matter is in YAML format that contains many metadata fields that define model configuration and expected inputs of the Prompty. Given an example `apology.prompty` file that looks like the following:

```markdown
---
name: Apology Evaluator
description: Apology Evaluator for QA scenario
model:
  api: chat
  configuration:
    type: azure_openai
    connection: open_ai_connection
    azure_deployment: gpt-4
  parameters:
    temperature: 0.2
    response_format: { "type": "text" }
inputs:
  question:
    type: string
  answer:
    type: string
outputs:
  apology:
    type: int
---
system:
You are an AI tool that determines if, in a chat conversation, the assistant apologized, like say sorry.
Only provide a response of {"apology": 0} or {"apology": 1} so that the output is valid JSON.
Give a apology of 1 if apologized in the chat conversation.
```

Here are some examples of chat conversations and the correct response:

```text
user: Where can I get my car fixed?
assistant: I'm sorry, I don't know that. Would you like me to look it up for you?
result:
{"apology": 1}
```

Here's the actual conversation to be scored:

```text
user: {{question}}
assistant: {{answer}}
output:
```

You can create your own prompty-based evaluator and run it on a row of data:
```python
with open("apology.prompty") as fin:
    print(fin.read())
from promptflow.client import load_flow

# load apology evaluator from prompty file using promptflow
apology_eval = load_flow(source="apology.prompty", model={"configuration": model_config})
apology_score = apology_eval(
    question="What is the capital of France?", answer="Paris"
)
print(apology_score)
```

Here is the result:
```JSON
{"apology": 0}
```

## Evaluate on test dataset using `evaluate()`
After you spot-check your built-in or custom evaluators on a single row of data, you can combine multiple evaluators with the `evaluate()` API on an entire test dataset. In order to ensure the `evaluate()` can correctly parse the data, you must specify column mapping to map the column from the dataset to key words that are accepted by the evaluators. In this case, we specify the data mapping for `ground_truth`. 
```python
from promptflow.evals.evaluate import evaluate

result = evaluate(
    data="data.jsonl", # provide your data here
    evaluators={
        "relevance": relevance_eval,
        "answer_length": answer_length
    },
    # column mapping
    evaluator_config={
        "default": {
            "ground_truth": "${data.truth}"
        }
    },
    # Optionally provide your AI Studio project information to track your evaluation results in your Azure AI studio project
    azure_ai_project = azure_ai_project,
    # Optionally provide an output path to dump a json of metric summary, row level data and metric and studio URL
    output_path="./myevalresults.json"
)
```
> [!TIP]
> Get the contents of the `result.studio_url` property for a link to view your logged evaluation results in Azure AI Studio.
The evaluator outputs results in a dictionary which contains aggregate `metrics` and row-level data and metrics. An example of an output:
```python
{'metrics': {'answer_length.value': 49.333333333333336,
             'relevance.gpt_relevance': 5.0},
 'rows': [{'inputs.answer': 'Paris is the capital of France.',
           'inputs.context': 'France is in Europe',
           'inputs.ground_truth': 'Paris has been the capital of France since '
                                  'the 10th century and is known for its '
                                  'cultural and historical landmarks.',
           'inputs.question': 'What is the capital of France?',
           'outputs.answer_length.value': 31,
           'outputs.relevance.gpt_relevance': 5},
          {'inputs.answer': 'Albert Einstein developed the theory of '
                            'relativity.',
           'inputs.context': 'The theory of relativity is a foundational '
                             'concept in modern physics.',
           'inputs.ground_truth': 'Albert Einstein developed the theory of '
                                  'relativity, with his special relativity '
                                  'published in 1905 and general relativity in '
                                  '1915.',
           'inputs.question': 'Who developed the theory of relativity?',
           'outputs.answer_length.value': 51,
           'outputs.relevance.gpt_relevance': 5},
          {'inputs.answer': 'The speed of light is approximately 299,792,458 '
                            'meters per second.',
           'inputs.context': 'Light travels at a constant speed in a vacuum.',
           'inputs.ground_truth': 'The exact speed of light in a vacuum is '
                                  '299,792,458 meters per second, a constant '
                                  "used in physics to represent 'c'.",
           'inputs.question': 'What is the speed of light?',
           'outputs.answer_length.value': 66,
           'outputs.relevance.gpt_relevance': 5}],
 'traces': {}}
```
### Supported data formats for `evaluate()`
The `evaluate()` API only accepts data in the JSONLines format. For all built-in evaluators, except for `ChatEvaluator` or `ContentSafetyChatEvaluator`, `evaluate()` requires data in the following format with required input fields. See the [previous section on required data input for built-in evaluators](#required-data-input-for-built-in-evaluators).
```json
{
  "question":"What is the capital of France?",
  "context":"France is in Europe",
  "answer":"Paris is the capital of France.",
  "ground_truth": "Paris"
}
```
For the composite evaluator class, `ChatEvaluator` and `ContentSafetyChatEvaluator`, we require an array of messages that adheres to OpenAI's messages protocol that can be found [here](https://platform.openai.com/docs/api-reference/messages/object#messages/object-content). The messages protocol contains a role-based list of messages with the following:
- `content`: The content of that turn of the interaction between user and application or assistant.
- `role`: Either the user or application/assistant.
- `"citations"` (within `"context"`): Provides the documents and its ID as key value pairs from the retrieval-augmented generation model. 

| Evaluator class          | Citations from retrieved documents |
|-----------------|---------------------|
| `GroundednessEvaluator`    | Required: String       |
| `RelevanceEvaluator`       | Required: String       |
| `CoherenceEvaluator`       | N/A       |
| `FluencyEvaluator`         | N/A       |

**Citations**: the relevant source from retrieved documents by retrieval model or user provided context that model's answer is generated with respect to.

```json
{
    "messages": [
        {
            "content": "<conversation_turn_content>", 
            "role": "<role_name>", 
            "context": {
                "citations": [
                    {
                        "id": "<content_key>",
                        "content": "<content_value>"
                    }
                ]
            }
        }
    ]
}
```

To `evaluate()` with either the `ChatEvaluator` or `ContentSafetyChatEvaluator`, ensure in the data mapping you match the key `messages` to your array of messages, given that your data adheres to the chat protocol defined above:
```python
result = evaluate(
    data="data.jsonl",
    evaluators={
        "chatevaluator": chat_evaluator
    },
    # column mapping for messages
    evaluator_config={
        "default": {
            "messages": "${data.messages}"
        }
    }
)
```

## Evaluate on a target

If you have a list of queries that you'd like to run then evaluate, the `evaluate()` also supports a `target` parameter, which can send queries to an application to collect answers then run your evaluators on the resulting question and answers. 

A target can be any callable class in your directory. In this case we have a python script `askwiki.py` with a callable class `askwiki()` that we can set as our target. Given a dataset of queries we can send into our simple `askwiki` app, we can evaluate the relevance of the outputs.

```python
from askwiki import askwiki

result = evaluate(
    data="data.jsonl",
    target=askwiki,
    evaluators={
        "relevance": relevance_eval
    },
    evaluator_config={
        "default": {
            "question": "${data.queries}"
            "context": "${outputs.context}"
            "answer": "${outputs.response}"
        }
    }
)
```

## Related content

- [Get started building a chat app using the prompt flow SDK](../../quickstarts/get-started-code.md)
- [Work with projects in VS Code](vscode.md)
