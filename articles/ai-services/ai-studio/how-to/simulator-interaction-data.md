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

# Generate AI-simulated datasets with your application

Large language models are known for their few-shot and zero-shot learning abilities, allowing them to function with minimal data. However, this limited data availability impedes thorough evaluation and optimization when you don't have test datasets to evaluate the quality and effectiveness of your generative AI application. Using GPT to simulate a user interaction with your application, with configurable tone, task and characteristics can help with stress testing your application under various environments, effectively gauging how a model responds to different inputs and scenarios.

There are two main scenarios for generating a simulated interaction (such as conversation with a chat bot):
- Instance level with manual testing: generate one conversation at a time by manually inputting the task parameters such as name, profile, tone and task and iteratively tweaking it to see different outcomes for the simulated interaction. 
- Bulk testing and evaluation orchestration: generate multiple interaction data samples (~100) at one time for a list of tasks or profiles to create a target dataset to evaluate your generative AI applications and streamline the data gathering/prep process.

## Usage

The simulator works by setting up a system large language model such as GPT to simulate a user and interact with your application. It takes in task parameters that specify what task you want the simulator to accomplish in interacting with your application and giving character and tone to the simulator.  First import the simulator package from Azure AI SDK:

```python
from azure.ai.generative import Simulator, SimulatorTemplate
```

## Initialize large language model

First we set up the system large language model, which acts as the "agent" simulating a user or test case against your application.

```python
from azure.identity import DefaultAzureCredential
from azure.ai.generative import AIClient
from azure.ai.generative.entities import AzureOpenAIModelConfiguration

credential = DefaultAzureCredential()
# initialize aiclient. This assumes that config.json downloaded from ai workspace is present in the working directory
ai_client = AIClient.from_config(credential)

# Retrieve default aoai connection if it exists
aoai_connection = client.get_default_aoai_connection()
# alternatively, retrieve connection by name
# aoai_connection = ai_client.connections.get("<name of connection>")

# Specify model and deployment name
aoai_config = AzureOpenAIModelConfiguration.from_connection(
    connection=aoai_connection,
    model_name="<model name>",
    deployment_name="<deployment name>",
    "temperature": 0.1,
    "max_token": 300
)
```
`max_tokens` and `temperature` are optional, the default value for `max_tokens` is 300, the default value for `temperature` is 0.9

## Initialize simulator class 

`Simulator` class supports interacting between a large language model and a local app function that follows a protocol, a local flow or a large language model endpoint (just the configuration need to be passed in). 

```python
simulator = simulator(userConnection=your_target_LLM, systemConnection=aoai_config)
```

`SimulatorTemplate` class provides scenario prompt templates to simulate certain large language model scenarios such as conversations/chats or summarization.

```python
st = SimulatorTemplate()
```

The following is an example of providing a local function or local flow, and wrapping it in the `simulate_callback` function:

```python
async def simulate_callback(question, conversation_history, meta_data):
    from promptflow import PFClient
    pf_client = PFClient()

    inputs = {"question": question}
    return pf_client.test(flow="<flow_folder_path>", inputs=inputs)
```

Then pass the `simulate_callback` function in the `simulate()` function:

```python
simulator = simulator(simulate_callback=simulate_callback, systemConnection=aoai_config)
```

## Simulate a conversation

Use simulator template provided for conversations using the `SimulatorTemplate` class configure the parameters for that task.
```python
conversation_template = st.get_template("conversation")
conversation_parameters = st.get_template_parameters("conversation")
print(conversation_parameters) # shows parameters needed for the prompt template
print(conversation_template) # shows the prompt template that is used to generate conversations
```

Configure the parameters for the simulated task (we support conversation and summarization) as a dictionary with the name of your simulated agent, its profile description, tone, task and any extra metadata you want to provide as part of the persona or task. You can also configure the name of your chat application bot to ensure that the simulator knows what it's interacting with. 

```python
conversation_parameters = {
    "name": "Cortana",
    "profile":"Cortana is a enterprising businesswoman in her 30's looking for ways to improve her hiking experience outdoors in California.",
    "tone":"friendly",
    "metadata":{"customer_info":"Last purchased item is a OnTrail ProLite Tent on October 13, 2023"},
    "task":"Cortana is looking to complete her camping set to go on an expedition in Patagonia, Chile.",
    "chatbot_name":"YourChatAppNameHere"
}
```
Simulate either synchronously or asynchronously, the `simulate` function accepts three inputs: persona, task and max_conversation_turns. 
```python
conversation_result = simulator.simulate(template=conversation_template, parameters=conversation_parameters, max_conversation_turns = 6, max_token = 300, temperature = 0.9)
conversation_result = await simulator.simulate(template=conversation_template, parameters=conversation_parameters, max_conversation_turns = 6, max_token = 300, temperature = 0.9)
```
`max_conversation_turns` defines how many conversation turns it generates at most. It's optional, default value is 2.

## Output

The `conversation_result` is a dictionary,

The `conversation` is a list of conversation turns, for each conversation turn, it contains `content` which is the content of conversation, `role` which is either the user (simulated agent) or assistant,`turn_number`,`template_parameters`
```json
{
    "messages": [
        {
            "content": "<conversation_turn_content>", 
            "role": "<role_name>", 
            "turn_number": "<turn_number>",
            "template_parameters": {
                "name": "<name_of_simulated_agent>",
                "profile": "<description_of_simulated_agent>",
                "tone": "<tone_description>",
                "metadata": {
                    "<content_key>":"<content_value>"
                },
                "task": "<task_description>",
                "chatbot_name": "<name_of_chatbot>"
            },
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
This aligns to Azure AI SDK's `evaluate` function call that takes in this chat format dataset for evaluating metrics such as groundedness, relevance, and retrieval_score if `citations` are provided.

## More functionality

### Early termination

Stop conversation earlier if the conversation meets certain criteria, such as "bye" or "goodbye" appears in the conversation. Users can customize the stopping criteria themselves as well.

### Retry

The scenario simulator supports retry logic, the default maximum number of retries in case the last API call failed is 3. The default number of seconds to sleep between consequent retries in case the last API call failed is 3.

Users can also define their own `api_call_retry_sleep_sec` and `api_call_retry_max_count` and pass into the `simulator()` function.

### Example of output conversation

```json
{
    "messages": [
        {
            "content": "<|im_start|>user\nHi ChatBot, can you help me find the best hiking backpacks for weekend trips? I want to make an informed decision before making a purchase.",
            "role": "user",
            "turn_number": 0,
            "template_parameters": {
                "name": "Jane",
                "profile": "Jane Doe is a 28-year-old outdoor enthusiast who lives in Seattle, Washington. She has a passion for exploring nature and loves going on camping and hiking trips with her friends. She has recently become a member of the company's loyalty program and has achieved Bronze level status.Jane has a busy schedule, but she always makes time for her outdoor adventures. She is constantly looking for high-quality gear that can help her make the most of her trips and ensure she has a comfortable experience in the outdoors.Recently, Jane purchased a TrailMaster X4 Tent from the company. This tent is perfect for her needs, as it is both durable and spacious, allowing her to enjoy her camping trips with ease. The price of the tent was $250, and it has already proved to be a great investment.In addition to the tent, Jane also bought a Pathfinder Pro-1 Adventure Compass for $39.99. This compass has helped her navigate challenging trails with confidence, ensuring that she never loses her way during her adventures.Finally, Jane decided to upgrade her sleeping gear by purchasing a CozyNights Sleeping Bag for $100. This sleeping bag has made her camping nights even more enjoyable, as it provides her with the warmth and comfort she needs after a long day of hiking.",
                "tone": "happy",
                "metadata": {
                    "customer_info": "## customer_info      name: Jane Doe    age: 28     phone_number: 555-987-6543     email: jane.doe@example.com     address: 789 Broadway St, Seattle, WA 98101      loyalty_program: True     loyalty_program Level: Bronze        ## recent_purchases      order_number: 5  date: 2023-05-01  item: - description:  TrailMaster X4 Tent, quantity 1, price $250    item_number: 1   order_number: 18  date: 2023-05-04  item: - description:  Pathfinder Pro-1 Adventure Compass, quantity 1, price $39.99    item_number: 4   order_number: 28  date: 2023-04-15  item: - description:  CozyNights Sleeping Bag, quantity 1, price $100    item_number: 7"
                },
                "task": "Jane is trying to accomplish the task of finding out the best hiking backpacks suitable for her weekend camping trips, and how they compare with other options available in the market. She wants to make an informed decision before making a purchase from the outdoor gear company's website or visiting their physical store.Jane uses Google to search for 'best hiking backpacks for weekend trips,' hoping to find reliable and updated information from official sources or trusted websites. She expects to see a list of top-rated backpacks, their features, capacity, comfort, durability, and prices. She is also interested in customer reviews to understand the pros and cons of each backpack.Furthermore, Jane wants to see the specifications, materials used, waterproof capabilities, and available colors for each backpack. She also wants to compare the chosen backpacks with other popular brands like Osprey, Deuter, or Gregory. Jane plans to spend about 20 minutes on this task and shortlist two or three options that suit her requirements and budget.Finally, as a Bronze level member of the outdoor gear company's loyalty program, Jane might also want to contact customer service to inquire about any special deals or discounts available on her shortlisted backpacks, ensuring she gets the best value for her purchase.",
                "chatbot_name": "ChatBot"
            },
            "context": {
                "citations": [
                    {
                        "id": "customer_info",
                        "content": "## customer_info      name: Jane Doe    age: 28     phone_number: 555-987-6543     email: jane.doe@example.com     address: 789 Broadway St, Seattle, WA 98101      loyalty_program: True     loyalty_program Level: Bronze        ## recent_purchases      order_number: 5  date: 2023-05-01  item: - description:  TrailMaster X4 Tent, quantity 1, price $250    item_number: 1   order_number: 18  date: 2023-05-04  item: - description:  Pathfinder Pro-1 Adventure Compass, quantity 1, price $39.99    item_number: 4   order_number: 28  date: 2023-04-15  item: - description:  CozyNights Sleeping Bag, quantity 1, price $100    item_number: 7"
                    }
                ]
            }
        },
        {
            "content": "Of course! I'd be happy to help you find the best hiking backpacks for weekend trips. What is your budget for the backpack?",
            "role": "assistant",
            "turn_number": 1,
            "template_parameters": {
                "name": "Jane",
                "profile": "Jane Doe is a 28-year-old outdoor enthusiast who lives in Seattle, Washington. She has a passion for exploring nature and loves going on camping and hiking trips with her friends. She has recently become a member of the company's loyalty program and has achieved Bronze level status.Jane has a busy schedule, but she always makes time for her outdoor adventures. She is constantly looking for high-quality gear that can help her make the most of her trips and ensure she has a comfortable experience in the outdoors.Recently, Jane purchased a TrailMaster X4 Tent from the company. This tent is perfect for her needs, as it is both durable and spacious, allowing her to enjoy her camping trips with ease. The price of the tent was $250, and it has already proved to be a great investment.In addition to the tent, Jane also bought a Pathfinder Pro-1 Adventure Compass for $39.99. This compass has helped her navigate challenging trails with confidence, ensuring that she never loses her way during her adventures.Finally, Jane decided to upgrade her sleeping gear by purchasing a CozyNights Sleeping Bag for $100. This sleeping bag has made her camping nights even more enjoyable, as it provides her with the warmth and comfort she needs after a long day of hiking.",
                "tone": "happy",
                "metadata": {
                    "customer_info": "## customer_info      name: Jane Doe    age: 28     phone_number: 555-987-6543     email: jane.doe@example.com     address: 789 Broadway St, Seattle, WA 98101      loyalty_program: True     loyalty_program Level: Bronze        ## recent_purchases      order_number: 5  date: 2023-05-01  item: - description:  TrailMaster X4 Tent, quantity 1, price $250    item_number: 1   order_number: 18  date: 2023-05-04  item: - description:  Pathfinder Pro-1 Adventure Compass, quantity 1, price $39.99    item_number: 4   order_number: 28  date: 2023-04-15  item: - description:  CozyNights Sleeping Bag, quantity 1, price $100    item_number: 7"
                },
                "task": "Jane is trying to accomplish the task of finding out the best hiking backpacks suitable for her weekend camping trips, and how they compare with other options available in the market. She wants to make an informed decision before making a purchase from the outdoor gear company's website or visiting their physical store.Jane uses Google to search for 'best hiking backpacks for weekend trips,' hoping to find reliable and updated information from official sources or trusted websites. She expects to see a list of top-rated backpacks, their features, capacity, comfort, durability, and prices. She is also interested in customer reviews to understand the pros and cons of each backpack.Furthermore, Jane wants to see the specifications, materials used, waterproof capabilities, and available colors for each backpack. She also wants to compare the chosen backpacks with other popular brands like Osprey, Deuter, or Gregory. Jane plans to spend about 20 minutes on this task and shortlist two or three options that suit her requirements and budget.Finally, as a Bronze level member of the outdoor gear company's loyalty program, Jane might also want to contact customer service to inquire about any special deals or discounts available on her shortlisted backpacks, ensuring she gets the best value for her purchase.",
                "chatbot_name": "ChatBot"
            },
            "context": {
                "citations": [
                    {
                        "id": "customer_info",
                        "content": "## customer_info      name: Jane Doe    age: 28     phone_number: 555-987-6543     email: jane.doe@example.com     address: 789 Broadway St, Seattle, WA 98101      loyalty_program: True     loyalty_program Level: Bronze        ## recent_purchases      order_number: 5  date: 2023-05-01  item: - description:  TrailMaster X4 Tent, quantity 1, price $250    item_number: 1   order_number: 18  date: 2023-05-04  item: - description:  Pathfinder Pro-1 Adventure Compass, quantity 1, price $39.99    item_number: 4   order_number: 28  date: 2023-04-15  item: - description:  CozyNights Sleeping Bag, quantity 1, price $100    item_number: 7"
                    }
                ]
            }
        },
        {
            "content": "As Jane, my budget is around $150-$200.",
            "role": "user",
            "turn_number": 2,
            "template_parameters": {
                "name": "Jane",
                "profile": "Jane Doe is a 28-year-old outdoor enthusiast who lives in Seattle, Washington. She has a passion for exploring nature and loves going on camping and hiking trips with her friends. She has recently become a member of the company's loyalty program and has achieved Bronze level status.Jane has a busy schedule, but she always makes time for her outdoor adventures. She is constantly looking for high-quality gear that can help her make the most of her trips and ensure she has a comfortable experience in the outdoors.Recently, Jane purchased a TrailMaster X4 Tent from the company. This tent is perfect for her needs, as it is both durable and spacious, allowing her to enjoy her camping trips with ease. The price of the tent was $250, and it has already proved to be a great investment.In addition to the tent, Jane also bought a Pathfinder Pro-1 Adventure Compass for $39.99. This compass has helped her navigate challenging trails with confidence, ensuring that she never loses her way during her adventures.Finally, Jane decided to upgrade her sleeping gear by purchasing a CozyNights Sleeping Bag for $100. This sleeping bag has made her camping nights even more enjoyable, as it provides her with the warmth and comfort she needs after a long day of hiking.",
                "tone": "happy",
                "metadata": {
                    "customer_info": "## customer_info      name: Jane Doe    age: 28     phone_number: 555-987-6543     email: jane.doe@example.com     address: 789 Broadway St, Seattle, WA 98101      loyalty_program: True     loyalty_program Level: Bronze        ## recent_purchases      order_number: 5  date: 2023-05-01  item: - description:  TrailMaster X4 Tent, quantity 1, price $250    item_number: 1   order_number: 18  date: 2023-05-04  item: - description:  Pathfinder Pro-1 Adventure Compass, quantity 1, price $39.99    item_number: 4   order_number: 28  date: 2023-04-15  item: - description:  CozyNights Sleeping Bag, quantity 1, price $100    item_number: 7"
                },
                "task": "Jane is trying to accomplish the task of finding out the best hiking backpacks suitable for her weekend camping trips, and how they compare with other options available in the market. She wants to make an informed decision before making a purchase from the outdoor gear company's website or visiting their physical store.Jane uses Google to search for 'best hiking backpacks for weekend trips,' hoping to find reliable and updated information from official sources or trusted websites. She expects to see a list of top-rated backpacks, their features, capacity, comfort, durability, and prices. She is also interested in customer reviews to understand the pros and cons of each backpack.Furthermore, Jane wants to see the specifications, materials used, waterproof capabilities, and available colors for each backpack. She also wants to compare the chosen backpacks with other popular brands like Osprey, Deuter, or Gregory. Jane plans to spend about 20 minutes on this task and shortlist two or three options that suit her requirements and budget.Finally, as a Bronze level member of the outdoor gear company's loyalty program, Jane might also want to contact customer service to inquire about any special deals or discounts available on her shortlisted backpacks, ensuring she gets the best value for her purchase.",
                "chatbot_name": "ChatBot"
            },
            "context": {
                "citations": [
                    {
                        "id": "customer_info",
                        "content": "## customer_info      name: Jane Doe    age: 28     phone_number: 555-987-6543     email: jane.doe@example.com     address: 789 Broadway St, Seattle, WA 98101      loyalty_program: True     loyalty_program Level: Bronze        ## recent_purchases      order_number: 5  date: 2023-05-01  item: - description:  TrailMaster X4 Tent, quantity 1, price $250    item_number: 1   order_number: 18  date: 2023-05-04  item: - description:  Pathfinder Pro-1 Adventure Compass, quantity 1, price $39.99    item_number: 4   order_number: 28  date: 2023-04-15  item: - description:  CozyNights Sleeping Bag, quantity 1, price $100    item_number: 7"
                    }
                ]
            }
        }
    ],
    "$schema": "http://azureml/sdk-2-0/ChatConversation.json"
}
```

## Next steps

- [Learn more about Azure AI Studio](../what-is-ai-studio.md)
