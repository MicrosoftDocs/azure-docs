---
title: How to generate question and answer pairs from your source dataset
titleSuffix: Azure AI services
description: This article provides instructions on how to generate question and answer pairs from your source dataset.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 10/1/2023
ms.author: eur
---

# How to generate question and answer pairs from your source dataset

In this article, you learn how to get question and answer pairs from your source dataset using the Azure AI SDK synthetic data generation. This data can them be used for various purposes like unit testing for your LLM lookup, evaluation and iteration of retrieval augmented generation (RAG) flows, and prompt tuning. 

## Install the Synthetics Package

```shell
python --version  # ensure you've >=3.8
pip3 install azure-identity azure-ai-generative
pip3 install wikipedia langchain nltk unstructured
```

## Connect to Azure Open AI

We need to connect to Azure Open AI so that we can access the LLM to generate data for us.

```python
from azure.ai.resources.client import AIClient 
from azure.identity import DefaultAzureCredential

subscription = "<subscription-id>" # Subscription of your AI Studio project
resource_group = "<resource-group>" # Resource Group of your AI Studio project
project = "<project-name>" #Name of your Ai Studio Project

ai_client = AIClient(
    subscription_id=subscription, 
    resource_group_name=resource_group, 
    project_name=project, 
    credential=DefaultAzureCredential())

# lets get the default AOAI connection
aoai_connection = ai_client.get_default_aoai_connection()
aoai_connection.set_current_environment()
```

## Initialize the LLM to generate data

In this step, we get the LLM ready to generate the data.

```python
import os
from azure.ai.generative.synthetic.qa import QADataGenerator

model_name = "gpt-35-turbo" 

model_config = dict(
    deployment=model_name, 
    model=model_name,  
    max_tokens=2000,
)

qa_generator = QADataGenerator(model_config=model_config)
```

## Generate the data

We use the `QADataGenerator` that we previously initialized to generate the data. The following types of question answer data are supported.

|Type|Description|
|--|--|
|SHORT_ANSWER|Short answer QAs have answers that are only a few words long. These words are commonly relevant details from text like dates, names, statistics, etc.|
|LONG_ANSWER|Long answer QAs have answers that are one or more sentences long. ex. Questions where answer is a definition: What is a {topic_from_text}?|
|BOOLEAN|Boolean QAs have answers that are either True or False.|
|SUMMARY|Summary QAs have questions that ask to write a summary for text's title in a limited number of words. It generates just one QA.|
|CONVERSATION|Conversation QAs have questions that might reference words or ideas from previous QAs. ex. If previous conversation was about some topicX from text, next question might reference it without using its name: How does **it** compare to topicY?|

### Generate data from text

Let us create some text. We use the `generate` function in `QADataGenerator` to generate questions based on the text. In this example, the `generate` function takes the following parameters:

* `text` is your source data.
* `qa_type` defines the type of question and answers to be generated.
* `num_questions` is the number of question-answer pairs to be generated for the text.

To start with, we get text from a wiki page on Leonardo Da Vinci:

```python
# uncomment below line to install wikipedia
#!pip install wikipedia 
import wikipedia

wiki_title = wikipedia.search("Leonardo da vinci")[0]
wiki_page = wikipedia.page(wiki_title)
text = wiki_page.summary[:700]
text
```

Let us use this text to generate some question and answers

```python
from azure.ai.generative.synthetic.qa import QAType

qa_type = QAType.CONVERSATION

result = qa_generator.generate(text=text, qa_type=qa_type, num_questions=5)

for question, answer in result["question_answers"]:
    print(f"Q: {question}")
    print(f"A: {answer}")
```

You can check token usage as follows:

```python
print(f"Tokens used: {result['token_usage']}")
```

## Using the generated data in prompt flow

One of the features of prompt flow is the ability to test and evaluate your flows on batch of inputs. This approach is useful for checking the quality and performance of your flows before deploying them. To use this feature, you need to provide the data in a specific (.jsonl) format that prompt flow can understand. We prepare this data from the questions and answers that we have generated in [Generate data from text](#generate-data-from-text) step. We use this data for batch run and flow evaluation.

### Format and save the generated data

```python
import json
from collections import defaultdict
import pandas as pd

# transform generated Q&A to desired format
data_dict = defaultdict(list)
chat_history = []
for question, answer in result["question_answers"]:
    if qa_type == QAType.CONVERSATION:
        # Chat QnA columns:
        data_dict["chat_history"].append(json.dumps(chat_history))
        data_dict["chat_input"].append(question)
        chat_history.append({"inputs": {"chat_input": question}, "outputs": {"chat_output": answer}})
    else:
        # QnA columns:
        data_dict["question"].append(question)    

    data_dict["ground_truth"].append(answer)  # Consider generated answer as the ground truth

# export to jsonl file
output_file = "generated_qa.jsonl"
data_df = pd.DataFrame(data_dict, columns=list(data_dict.keys()))
data_df.to_json(output_file, lines=True, orient="records")
```

### Use the data for evaluation

To use the "generated_qa.jsonl" file for evaluation, you need to add this file as data to your evaluation flow. Go to a flow in Azure AI Studio and select **Evaluate**.

1. Enter details in **Basic Settings**
2. Select **Add new data** from **Batch run settings**.

    :::image type="content" source="../media/data-connections/batch-run-add-data.png" alt-text="Screenshot of flow batch run file upload." lightbox="../media/data-connections/batch-run-add-data.png":::

1. Provide a name for your data, select the file that you generated, and then select **Add**. You can also use this name to reuse the uploaded file in other flows.

    :::image type="content" source="../media/data-connections/upload-file.png" alt-text="Screenshot of upload batch run file upload." lightbox="../media/data-connections/upload-file.png":::

1. Next, you map the input fields to the prompt flow parameters. 

    :::image type="content" source="../media/data-connections/generate-qa-mappings.png" alt-text="Screenshot of input mappings." lightbox="../media/data-connections/generate-qa-mappings.png":::

1. Complete the rest of the steps in the dialog and submit for evaluation.

## Generate data from files

Generating data from files might be more practical for large amounts of data. You can use the `generate_async()` function OF THE `QADataGenerator` to make concurrent requests to Azure Open AI for generating data from files.

Files might have large texts that go beyond model's context lengths. They need to be split to create smaller chunks. Moreover, they shouldn't be split mid-sentence. Such partial sentences might lead to improper QA samples. You can use LangChain's `NLTKTextSplitter` to split the files before generating data.

Here's an excerpt of the code needed to generate samples using `generate_async()`. 

```python
import asyncio
from collections import Counter

concurrency = 3  # number of concurrent calls
sem = asyncio.Semaphore(concurrency)

async def generate_async(text):
    async with sem:
        return await qa_generator.generate_async(
            text=text,
            qa_type=QAType.LONG_ANSWER,
            num_questions=3,  # Number of questions to generate per text
        )

results = await asyncio.gather(*[generate_async(text) for text in texts],
                               return_exceptions=True)

question_answer_list = []
token_usage = Counter()

# text is the array of split texts from the file which have the source data
for result in results:
    if isinstance(result, Exception):
        raise result  # exception raised inside generate_async()
    question_answer_list.append(result["question_answers"])
    token_usage += result["token_usage"]

print("Successfully generated QAs")
```

## Some Examples of data generation

SHORT_ANSWER:

```text
Q: When was Leonardo da Vinci born and when did he die?
A: 15 April 1452 – 2 May 1519
Q: What fields was Leonardo da Vinci active in during the High Renaissance?
A: painter, engineer, scientist, sculptor, and architect
Q: Who was Leonardo da Vinci's younger contemporary with a similar contribution to later generations of artists?
A: Michelangelo
```

LONG_ANSWER:

```text
Q: Who was Leonardo di ser Piero da Vinci?
A: Leonardo di ser Piero da Vinci (15 April 1452 – 2 May 1519) was an Italian polymath of the High Renaissance who was active as a painter, engineer, scientist, sculptor, and architect.
Q: What subjects did Leonardo da Vinci cover in his notebooks?
A: In his notebooks, Leonardo da Vinci made drawings and notes on a variety of subjects, including anatomy, astronomy, cartography, and paleontology.
```

BOOLEAN:

```text
Q: True or false - Leonardo da Vinci was an Italian polymath of the High Renaissance?
A: True
Q: True or false - Leonardo da Vinci was only known for his achievements as a painter?
A: False
```

SUMMARY:

```text
Q: Write a summary in 100 words for: Leonardo da Vinci
A: Leonardo da Vinci (1452-1519) was an Italian polymath of the High Renaissance, known for his work as a painter, engineer, scientist, sculptor, and architect. Initially famous for his painting, he gained recognition for his notebooks containing drawings and notes on subjects like anatomy, astronomy, cartography, and paleontology. Leonardo is considered a genius who embodied the Renaissance humanist ideal, and his collective works have significantly influenced later generations of artists, rivaling the contributions of his contemporary, Michelangelo.
```

CONVERSATION:

```text
Q: Who was Leonardo da Vinci?
A: Leonardo di ser Piero da Vinci was an Italian polymath of the High Renaissance who was active as a painter, engineer, scientist, sculptor, and architect.
Q: When was he born and when did he die?
A: Leonardo da Vinci was born on 15 April 1452 and died on 2 May 1519.
Q: What are some subjects covered in his notebooks?
A: In his notebooks, Leonardo da Vinci made drawings and notes on a variety of subjects, including anatomy, astronomy, cartography, and paleontology.
```

## Results structure of generated data

The `generate` function results are a dictionary with the following structure:

```json
{
    "question_answers": [
        ("Who described the first rudimentary steam engine?", "Hero of Alexandria"),
        ...
    ],
    "token_usage": {
        "completion_tokens": 611,
        "prompt_tokens": 3630,
        "total_tokens": 4241,
    },
}
```

## Next steps

- [How to create vector index in Azure AI Studio prompt flow (preview)](./index-add.md)
- [Check out the Azure AI samples for RAG and more](https://github.com/Azure-Samples/azureai-samples)
