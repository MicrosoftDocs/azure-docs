---
title: How to work with the Chat Markup Language (preview)
titleSuffix: Azure OpenAI
description: Learn how to work with Chat Markup Language (preview)
author: mrbullwinkle #dereklegenzoff
ms.author: mbullwin #delegenz
ms.service: azure-ai-openai
ms.topic: include
ms.date: 05/15/2023
manager: nitinme
keywords: ChatGPT
---

## Working with the Chat models

> [!IMPORTANT]
> Using GPT-35-Turbo models with the completion endpoint remains in preview. Due to the potential for changes to the underlying ChatML syntax, we strongly recommend using the Chat Completion API/endpoint. The Chat Completion API is the recommended method of interacting with the GPT-35-Turbo models. The Chat Completion API is also the only way to access the GPT-4 models.

The following code snippet shows the most basic way to use the GPT-35-Turbo models with ChatML. If this is your first time using these models programmatically we recommend starting with our [GPT-35-Turbo & GPT-4 Quickstart](../chatgpt-quickstart.md).

```python
import os
import openai
openai.api_type = "azure"
openai.api_base = "https://{your-resource-name}.openai.azure.com/"
openai.api_version = "2023-05-15"
openai.api_key = os.getenv("OPENAI_API_KEY")

response = openai.Completion.create(
  engine="gpt-35-turbo", # The deployment name you chose when you deployed the GPT-35-Turbo model
  prompt="<|im_start|>system\nAssistant is a large language model trained by OpenAI.\n<|im_end|>\n<|im_start|>user\nWho were the founders of Microsoft?\n<|im_end|>\n<|im_start|>assistant\n",
  temperature=0,
  max_tokens=500,
  top_p=0.5,
  stop=["<|im_end|>"])

print(response['choices'][0]['text'])
```

> [!NOTE]  
> The following parameters aren't available with the gpt-35-turbo model: `logprobs`, `best_of`, and `echo`. If you set any of these parameters, you'll get an error.

The `<|im_end|>` token indicates the end of a message. We recommend including `<|im_end|>` token as a stop sequence to ensure that the model stops generating text when it reaches the end of the message. You can read more about the special tokens in the [Chat Markup Language (ChatML)](#chatml) section.

Consider setting `max_tokens` to a slightly higher value than normal such as 300 or 500. This ensures that the model doesn't stop generating text before it reaches the end of the message.

## Model versioning

> [!NOTE]  
> `gpt-35-turbo` is equivalent to the `gpt-3.5-turbo` model from OpenAI.

Unlike previous GPT-3 and GPT-3.5 models, the `gpt-35-turbo` model as well as the `gpt-4` and `gpt-4-32k` models will continue to be updated. When creating a [deployment](../how-to/create-resource.md#deploy-a-model) of these models, you'll also need to specify a model version.

You can find the model retirement dates for these models on our [models](../how-to/working-with-models.md#gpt-35-turbo-0301-and-gpt-4-0314-retirement) page.

<a id="chatml"></a>

## Working with Chat Markup Language (ChatML)

> [!NOTE]  
> OpenAI continues to improve the GPT-35-Turbo and the Chat Markup Language used with the models will continue to evolve in the future. We'll keep this document updated with the latest information.

OpenAI trained GPT-35-Turbo on special tokens that delineate the different parts of the prompt. The prompt starts with a system message that is used to prime the model followed by a series of messages between the user and the assistant.

The format of a basic ChatML prompt is as follows:

```
<|im_start|>system 
Provide some context and/or instructions to the model.
<|im_end|> 
<|im_start|>user 
The user’s message goes here
<|im_end|> 
<|im_start|>assistant 
```

### System message

The system message is included at the beginning of the prompt between the `<|im_start|>system` and `<|im_end|>` tokens. This message provides the initial instructions to the model. You can provide various information in the system message including:

* A brief description of the assistant
* Personality traits of the assistant
* Instructions or rules you would like the assistant to follow
* Data or information needed for the model, such as relevant questions from an FAQ

You can customize the system message for your use case or just include a basic system message. The system message is optional, but it's recommended to at least include a basic one to get the best results.

### Messages

After the system message, you can include a series of messages between the **user** and the **assistant**. Each message should begin with the `<|im_start|>` token followed by the role (`user` or `assistant`) and end with the `<|im_end|>` token.

```
<|im_start|>user
What is thermodynamics?
<|im_end|>
```

To trigger a response from the model, the prompt should end with `<|im_start|>assistant` token indicating that it's the assistant's turn to respond. You can also include messages between the user and the assistant in the prompt as a way to do few shot learning.

### Prompt examples

The following section shows examples of different styles of prompts that you could use with the GPT-35-Turbo and GPT-4 models. These examples are just a starting point, and you can experiment with different prompts to customize the behavior for your own use cases.

#### Basic example

If you want the GPT-35-Turbo and GPT-4 models to behave similarly to [chat.openai.com](https://chat.openai.com/), you can use a basic system message like "Assistant is a large language model trained by OpenAI."

```
<|im_start|>system
Assistant is a large language model trained by OpenAI.
<|im_end|>
<|im_start|>user
Who were the founders of Microsoft?
<|im_end|>
<|im_start|>assistant
```

#### Example with instructions

For some scenarios, you may want to give additional instructions to the model to define guardrails for what the model is able to do.

```
<|im_start|>system
Assistant is an intelligent chatbot designed to help users answer their tax related questions. 

Instructions:
- Only answer questions related to taxes. 
- If you're unsure of an answer, you can say "I don't know" or "I'm not sure" and recommend users go to the IRS website for more information.
<|im_end|>
<|im_start|>user
When are my taxes due?
<|im_end|>
<|im_start|>assistant
```

#### Using data for grounding

You can also include relevant data or information in the system message to give the model extra context for the conversation. If you only need to include a small amount of information, you can hard code it in the system message. If you have a large amount of data that the model should be aware of, you can use [embeddings](../tutorials/embeddings.md?tabs=command-line) or a product like [Azure Cognitive Search](https://techcommunity.microsoft.com/t5/ai-applied-ai-blog/revolutionize-your-enterprise-data-with-chatgpt-next-gen-apps-w/ba-p/3762087) to retrieve the most relevant information at query time.

```
<|im_start|>system
Assistant is an intelligent chatbot designed to help users answer technical questions about Azure OpenAI Serivce. Only answer questions using the context below and if you're not sure of an answer, you can say "I don't know".

Context:
- Azure OpenAI Service provides REST API access to OpenAI's powerful language models including the GPT-3, Codex and Embeddings model series.
- Azure OpenAI Service gives customers advanced language AI with OpenAI GPT-3, Codex, and DALL-E models with the security and enterprise promise of Azure. Azure OpenAI co-develops the APIs with OpenAI, ensuring compatibility and a smooth transition from one to the other.
- At Microsoft, we're committed to the advancement of AI driven by principles that put people first. Microsoft has made significant investments to help guard against abuse and unintended harm, which includes requiring applicants to show well-defined use cases, incorporating Microsoft’s principles for responsible AI use
<|im_end|>
<|im_start|>user
What is Azure OpenAI Service?
<|im_end|>
<|im_start|>assistant
```

#### Few shot learning with ChatML

You can also give few shot examples to the model. The approach for few shot learning has changed slightly because of the new prompt format. You can now include a series of messages between the user and the assistant in the prompt as few shot examples. These examples can be used to seed answers to common questions to prime the model or teach particular behaviors to the model.

This is only one example of how you can use few shot learning with GPT-35-Turbo. You can experiment with different approaches to see what works best for your use case.

```
<|im_start|>system
Assistant is an intelligent chatbot designed to help users answer their tax related questions. 
<|im_end|>
<|im_start|>user
When do I need to file my taxes by?
<|im_end|>
<|im_start|>assistant
In 2023, you will need to file your taxes by April 18th. The date falls after the usual April 15th deadline because April 15th falls on a Saturday in 2023. For more details, see https://www.irs.gov/filing/individuals/when-to-file
<|im_end|>
<|im_start|>user
How can I check the status of my tax refund?
<|im_end|>
<|im_start|>assistant
You can check the status of your tax refund by visiting https://www.irs.gov/refunds
<|im_end|>
```

#### Using Chat Markup Language for non-chat scenarios

ChatML is designed to make multi-turn conversations easier to manage, but it also works well for non-chat scenarios.

For example, for an entity extraction scenario, you might use the following prompt:

```
<|im_start|>system
You are an assistant designed to extract entities from text. Users will paste in a string of text and you will respond with entities you've extracted from the text as a JSON object. Here's an example of your output format:
{
   "name": "",
   "company": "",
   "phone_number": ""
}
<|im_end|>
<|im_start|>user
Hello. My name is Robert Smith. I’m calling from Contoso Insurance, Delaware. My colleague mentioned that you are interested in learning about our comprehensive benefits policy. Could you give me a call back at (555) 346-9322 when you get a chance so we can go over the benefits?
<|im_end|>
<|im_start|>assistant
```


## Preventing unsafe user inputs

It's important to add mitigations into your application to ensure safe use of the Chat Markup Language.

We recommend that you prevent end-users from being able to include special tokens in their input such as `<|im_start|>` and `<|im_end|>`. We also recommend that you include additional validation to ensure the prompts you're sending to the model are well formed and follow the Chat Markup Language format as described in this document.

You can also provide instructions in the system message to guide the model on how to respond to certain types of user inputs. For example, you can instruct the model to only reply to messages about a certain subject. You can also reinforce this behavior with few shot examples.


## Managing conversations

The token limit for `gpt-35-turbo` is 4096 tokens. This limit includes the token count from both the prompt and completion. The number of tokens in the prompt combined with the value of the `max_tokens` parameter must stay under 4096 or you'll receive an error.

It’s your responsibility to ensure the prompt and completion falls within the token limit. This means that for longer conversations, you need to keep track of the token count and only send the model a prompt that falls within the token limit.

The following code sample shows a simple example of how you could keep track of the separate messages in the conversation.

```python
import os
import openai
openai.api_type = "azure"
openai.api_base = "https://{your-resource-name}.openai.azure.com/" #This corresponds to your Azure OpenAI resource's endpoint value
openai.api_version = "2023-05-15" 
openai.api_key = os.getenv("OPENAI_API_KEY")

# defining a function to create the prompt from the system message and the conversation messages
def create_prompt(system_message, messages):
    prompt = system_message
    for message in messages:
        prompt += f"\n<|im_start|>{message['sender']}\n{message['text']}\n<|im_end|>"
    prompt += "\n<|im_start|>assistant\n"
    return prompt

# defining the user input and the system message
user_input = "<your user input>" 
system_message = f"<|im_start|>system\n{'<your system message>'}\n<|im_end|>"

# creating a list of messages to track the conversation
messages = [{"sender": "user", "text": user_input}]

response = openai.Completion.create(
    engine="gpt-35-turbo", # The deployment name you chose when you deployed the GPT-35-Turbo model.
    prompt=create_prompt(system_message, messages),
    temperature=0.5,
    max_tokens=250,
    top_p=0.9,
    frequency_penalty=0,
    presence_penalty=0,
    stop=['<|im_end|>']
)

messages.append({"sender": "assistant", "text": response['choices'][0]['text']})
print(response['choices'][0]['text'])
```

## Staying under the token limit

The simplest approach to staying under the token limit is to remove the oldest messages in the conversation when you reach the token limit.

You can choose to always include as many tokens as possible while staying under the limit or you could always include a set number of previous messages assuming those messages stay within the limit. It's important to keep in mind that longer prompts take longer to generate a response and incur a higher cost than shorter prompts.

You can estimate the number of tokens in a string by using the [tiktoken](https://github.com/openai/tiktoken) Python library as shown below.

```python
import tiktoken 

cl100k_base = tiktoken.get_encoding("cl100k_base") 

enc = tiktoken.Encoding( 
    name="gpt-35-turbo",  
    pat_str=cl100k_base._pat_str, 
    mergeable_ranks=cl100k_base._mergeable_ranks, 
    special_tokens={ 
        **cl100k_base._special_tokens, 
        "<|im_start|>": 100264, 
        "<|im_end|>": 100265
    } 
) 

tokens = enc.encode( 
    "<|im_start|>user\nHello<|im_end|><|im_start|>assistant",  
    allowed_special={"<|im_start|>", "<|im_end|>"} 
) 

assert len(tokens) == 7 
assert tokens == [100264, 882, 198, 9906, 100265, 100264, 78191]
```

## Next steps

* [Learn more about Azure OpenAI](../overview.md).
* Get started with the GPT-35-Turbo model with [the GPT-35-Turbo & GPT-4 quickstart](../chatgpt-quickstart.md).
* For more examples, check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples)
