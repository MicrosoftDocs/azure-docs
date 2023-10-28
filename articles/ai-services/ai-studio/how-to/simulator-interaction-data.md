---
title: How to use the Azure AI simulator for interaction data
titleSuffix: Azure AI services
description: This article provides instructions on how to use the Azure AI simulator for interaction data.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 10/1/2023
ms.author: eur
---

# How to use the Azure AI simulator for interaction data

The Azure AI simulator allows you to simulate complex single turn and multi-turn scenarios where a human-like bot interacts with your service to generate targeted synthetic life-like interactions for evaluation. An example would be a conversation.

## Install the Azure AI Tools SDK
To get started we need the Azure AI Tools SDK.
```bash
pip install azure-ai-tools
```
## 1. Defining model connections
There are two models involved for simulator to work. Here, we define a customer bot using gpt-35-turbo model deployment on azure openai.
```python
from azure.ai.tools.synthetic.simulator import (
    OpenAIChatCompletionsModel,
    KeyVaultAPITokenManager
)

# here, we use a token manager connecting to azure keyvault to retrieve api key to connect to an azure openai deployment
token_manager = KeyVaultAPITokenManager(
    secret_identifier="<azure-keyvault secret identifier>",
    auth_header="api-key",
    logger=logging.getLogger("assistant_bot_token_manager"),
)

# a bot representing a user using gpt-35-turbo model
gpt_bot_model = OpenAIChatCompletionsModel(
    endpoint_url="<your azure openai endpoint here>",
    token_manager=token_manager,
    api_version="2023-03-15-preview",
    name="gpt-35-turbo",
    max_tokens=300,
    temperature=0.0,
)
```
NOTE: If using Azure Open AI GPT models, Azure Content Safety will prevent users from generating harmful content during simulation.

For service model connection, a similar OpenAIChatCompletionsModel could be used. An async callback function could also be provided to the SDK connecting to your service for responses

Here's an example defining an async callback function:
```python
async def simulate_callback(question, conversation_history, meta_data):
    reply = call_app(question, chat_history, meta_data)
    return reply["answer"]
```


## 2. Initialize Persona

Create a yaml file to define your persona. In this example, save the following persona yaml to a local file named `jane.yaml`.

```yaml
meta_data:
  customer_info: "## customer_info      name: Jane Doe    age: 28     phone_number:\
    \ 555-987-6543     email: jane.doe@example.com     address: 789 Broadway St, Seattle,\
    \ WA 98101      loyalty_program: True     loyalty_program Level: Bronze      \
    \  ## recent_purchases      order_number: 5  date: 2023-05-01  item: - description:\
    \  TrailMaster X4 Tent, quantity 1, price $250  \_ item_number: 1   order_number:\
    \ 18  date: 2023-05-04  item: - description:  Pathfinder Pro-1 Adventure Compass,\
    \ quantity 1, price $39.99  \_ item_number: 4   order_number: 28  date: 2023-04-15\
    \  item: - description:  CozyNights Sleeping Bag, quantity 1, price $100  \_ item_number:\
    \ 7"
name: Jane
profile: Jane Doe is a 28-year-old outdoor enthusiast who lives in Seattle, Washington.
  She has a passion for exploring nature and loves going on camping and hiking trips
  with her friends. She has recently become a member of the company's loyalty program
  and has achieved Bronze level status.Jane has a busy schedule, but she always makes
  time for her outdoor adventures. She is constantly looking for high-quality gear
  that can help her make the most of her trips and ensure she has a comfortable experience
  in the outdoors.Recently, Jane purchased a TrailMaster X4 Tent from the company.
  This tent is perfect for her needs, as it is both durable and spacious, allowing
  her to enjoy her camping trips with ease. The price of the tent was $250, and it
  has already proved to be a great investment.In addition to the tent, Jane also bought
  a Pathfinder Pro-1 Adventure Compass for $39.99. This compass has helped her navigate
  challenging trails with confidence, ensuring that she never loses her way during
  her adventures.Finally, Jane decided to upgrade her sleeping gear by purchasing
  a CozyNights Sleeping Bag for $100. This sleeping bag has made her camping nights
  even more enjoyable, as it provides her with the warmth and comfort she needs after
  a long day of hiking.
tone: happy
```

TODO: The namespace is just placeholder, these import will come from the namespace where ai.gen sits.

```python
from azure.ai.tools.synthetic import Persona, Simulator

custom_persona = Persona(name="Random Person", profile="50 years old engineer", tone="bored", meta_data={customer_id=50, address=xxx, ...})
# Predefined personas
jane = Persona.load(path="./jane.yaml")
```

There are two ways to initialize Persona class, one is customizing it by passing in name, profile, tone and meta_data. The name and profile are required, tone and metat_data are optional

The other way is that we will also provide predefined personas, users can leverage `Persona.load()` to load the predefined or exported persona.


## 3. Initialize the simulator class 

```python
# Subsititue gptConnection with a model of your choice
simulator = Simulator(systemConnection=gpt_bot_model, userConnection=gpt_bot_model)
# Using simulate_callback defined earlier for application response user's own callback
simulator = Simulator(systemConnection=gpt_bot_model, simulate_callback=simulate_callback)
```



## 4. Simulate conversations
- `Persona` class defines gpt's persona, user can use predefined or customized personas
- `task` the task that persona is trying to achieve
- `Simulator` class accepts a llm model or a customer supplied callback for systemConnection and a llm model for userConnection

There is a sync and async version of simulate provided:
```python
conversation_result = simulator.simulate(persona = jane, task = task, max_conversation_turns = 6)
conversation_result = await simulator.simulate_async(persona = jane, task = task, max_conversation_turns = 6)
```

### 4.1 Output

The `conversation_result` will be dictionary, which contains `conversation_id`, `conversation` and `meta_data`.

The `conversation` is a list of conversation turns, for each conversation turn, it contains `turn_number`, `response`, `actor`, `request`, `full_json_response`.
Please see example in Appendix

{
    "conversation_id": "",
    "conversation": [
        {
            "turn_number": 0,
            "response": "",
            "actor": "",
            "request": "",
            "full_json_response": ""
        }
        {
            "turn_number": 1,
            ...
        }
        ....
    ],
    "meta_data": "" 
}

- `full_json_response` is the full response from the model
- `response` is the extracted message
- `request` is the request to the model,
- `meta_data` includes persona and task

## 5. Additional functionality

### 5.1 Save and load template

```python
# Users can print the prompt template of the persona
print(jane.template)
print(jane.tone)
print(jane.profile)

# Users can export persona to local
jane.export(path="./customPersona_jane.yaml")

# Users can load persona back from local persona profile
custom_persona = Persona.load(path="./customPersona_jane.yaml")
```
