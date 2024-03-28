---
title: How to use the Azure AI simulator for interaction data
titleSuffix: Azure AI Studio
description: This article provides instructions on how to use the Azure AI simulator for interaction data.
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 03/28/2024
ms.reviewer: eur
ms.author: eur
author: eric-urban
---

# Generate AI-simulated datasets with your application

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

Large language models are known for their few-shot and zero-shot learning abilities, allowing them to function with minimal data. However, this limited data availability impedes thorough evaluation and optimization when you might not have test datasets to evaluate the quality and effectiveness of your generative AI application. Using GPT to simulate a user interaction with your application, with configurable tone, task, and characteristics can help with stress testing your application under various environments, effectively gauging how a model responds to different inputs and scenarios.

There are two main scenarios for generating a simulated interaction:

- **General-purpose interaction simulation:** generate multiple interaction data samples at one time with user-provided list of tasks or profiles to create a target dataset to evaluate your generative AI applications.
- **Adversarial interaction simulation:** Augment and accelerate your red-teaming operation by leveraging Azure AI Studio safety evaluations to generate an adversarial dataset against your application. We provide adversarial tasks and profiles along with access to an Azure Open AI GPT-4 model with safety behaviors turned off to enable the adversarial simulation.

## Getting started

First install and import the simulator package from Azure AI SDK:
```python
pip install azure-ai-generative[simulator]
from azure.ai.generative import Simulator
```
### Initialize large language model

The general simulator works by setting up a system large language model such as GPT to simulate a user and interact with your application. It takes in task parameters that specify what task you want the simulator to accomplish in interacting with your application as well as giving character and tone to the simulator. First we set up the system large language model, which will interact with your target to simulate a user or test case against your generative AI application.

```python
from azure.identity import DefaultAzureCredential
from azure.ai.resources.client import AIClient
from azure.ai.resources.entities import AzureOpenAIModelConfiguration

# initialize ai_client. This assums that config.json downloaded from ai workspace is present in the working directory
ai_client = AIClient.from_config(DefaultAzureCredential())
# Retrieve default aoai connection if it exists
aoai_connection = ai_client.get_default_aoai_connection()
# alternatively, retrieve connection by name
# aoai_connection = ai_client.connections.get("<name of connection>")

# Specify model and deployment name for your system large language model
aoai_config = AzureOpenAIModelConfiguration.from_connection(
    connection=aoai_connection,
    model_name="<model name>",
    deployment_name="<deployment name>",
    "temperature": 0.1,
    "max_token": 300
)
```

`max_tokens` and `temperature` are optional. The default value for `max_tokens` is 300. The default value for `temperature` is 0.9.

### Initialize simulator class

`Simulator` class supports interacting between the system large language model and the following:

- A local function that follows a protocol.
- A local standard chat PromptFlow as defined with the interface in the [develop a chat flow example](https://microsoft.github.io/promptflow/how-to-guides/develop-a-flow/develop-chat-flow.html).

```python
function_simulator = Simulator.from_fn(
    fn=my_chat_app_function, # Simulate against a local function OR callback function
    simulator_connection=aoai_config # Configure the simulator
) 
promptflow_simulator = Simulator.from_pf(
    pf_path="./mypromptflow", # Simulate against a local promptflow
    simulator_connection=aoai_config # Configure the simulator
) 

```

> [!NOTE]
> Currently on Azure Open AI model configurations are supported for the `simulator_connection`.

#### Specifying a callback function to initialize your Simulator

For a more custom simulator, which can support wrapping a more complex or custom target function, we support passing in a callback function when instantiating your Simulator. The following is an example of providing a local function or local flow, and wrapping it in a `simulate_callback` function:

```python
async def simulate_callback(
        messages: List[Dict], 
        stream: bool = False, 
        session_state: Any = None, 
        context: Dict[str, Any] = None
    ):
    from promptflow import PFClient
    pf_client = PFClient()
    question = messages["messages"][0]["content"]
    inputs = {"question": question}
    return pf_client.test(flow="<flow_folder_path>", inputs=inputs)
"""
Expected response from simulate_callback:
{
    "messages": messages["messages"],
    "stream": stream,
    "session_state": session_state,
    "context": context
}
"""
```

Then pass the `simulate_callback()` function as a parameter when you instantiate your `Simulator.from_fn()`

```python
custom_simulator = Simulator.from_fn(
    callback_fn=simulate_callback, 
    simulator_connection=aoai_config
)
```

## Simulating general scenarios

We provide the basic prompt templates needed for the system large language model to simulate different scenarios with your target.

| Task type          | Template name   |
|--------------------|-----------------|
| Conversation       | `conversation`  |
| Summarization      | `summarization` |

Which can be called as a function by the `Simulator` by passing in the template name for the desired task above in the `get_template()` function.
```python
conversation_template = Simulator.get_template("conversation")
conversation_parameters = task_template.get_parameters
print(conversation_parameters) # shows parameters needed for the prompt template
print(conversation_template) # shows the prompt template that is used to generate conversations
```

Configure the parameters for the simulated scenario (conversation) prompt template as a dictionary with the name of your simulated user, its profile description, tone, task, conversation starter input, and any additional metadata you might want to provide as part of the persona or task. You can also configure the name of your target chat application to ensure that the simulator knows what it's interacting with.
```python
conversation_parameters = {
    "name": "Cortana",
    "profile":"Cortana is a enterprising businesswoman in her 30's looking for ways to improve her hiking experience outdoors in California.",
    "tone":"friendly",
    "conversation_starter":"Hi, this is the conversation starter that Cortana starts the conversation with the chatbot with.",
    "metadata":{"customer_info":"Last purchased item is a OnTrail ProLite Tent on October 13, 2023"},
    "task":"Cortana is looking to complete her camping set to go on an expedition in Patagonia, Chile.",
    "chatbot_name":"YourChatAppNameHere"
}
```
Simulate either synchronously or asynchronously. The `Simulate()` function accepts three inputs: the conversation template, conversation parameters, and maximum number of turns. Optionally you can specify `api_call_delay_sec`, `api_call_retry_sleep_sec`, `api_call_retry_limit`, and `max_simulation_results`.
```python
conversation_result = simulator.simulate(
    template=conversation_template, 
    parameters=conversation_parameters, 
    max_conversation_turns = 3 #optional: specify the number of turns in a conversation
)
conversation_result = await simulator.simulate(
    template=conversation_template, 
    parameters=conversation_parameters, 
    max_conversation_turns = 3
)
```
`max_conversation_turns` defines how many turns the simulator will generate at most. It's optional, default value is 1. A turn is defined as a pair of input from the simulated "user" then response from your "assistant. `max_conversation_turns` parameter is only valid for the template type for conversations.

### Create custom simulation task templates

If the provided built-in templates aren't sufficient, you can create your own templates by either passing in a prompt template directly or passing string in that can be passed to the system large language model simulator.

```python
custom_scenario_template = Simulator.create_template(template="My template content in string") # pass in string
custom_scenario_template = Simulator.create_template(template_path="custom_simulator_prompt.jinja2") # pass in path to local prompt file
```

## Simulating adversarial scenarios

Like the general-purpose simulator, you instantiate the adversarial simulator with the target you want to simulate against. However, you don't need to configure the simulator connection. Instead, pass in your AI Client, as the deployment for handling adversarial simulation for generating adversarial datasets is handled by a backend service.

```python
from azure.identity import DefaultAzureCredential
from azure.ai.resources.client import AIClient
from azure.ai.resources.entities import AzureOpenAIModelConfiguration

ai_client = AIClient.from_config(DefaultAzureCredential())

adversarial_simulator = Simulator.from_fn(
    callback_fn=simulate_callback, 
    ai_client = ai_client # make sure to pass in the AI client to call the safety evaluations service
) 
```

The simulator uses a set of adversarial prompt templates, hosted in the service, to simulate against your target application or endpoint for the following scenarios with the maximum number of simulations we provide:

| Task type                     | Template name                | Maximum number of simulations | Use this dataset for evaluating |
|-------------------------------|------------------------------|---------|---------------------|
| Question Answering            | `adv_qa`                     |1384 | Hateful and unfair content, Sexual content, Violent content, Self-harm-related content |
| Conversation                  | `adv_conversation`           |1018 |Hateful and unfair content, Sexual content, Violent content, Self-harm-related content |
| Summarization                 | `adv_summarization`          |525 |Hateful and unfair content, Sexual content, Violent content, Self-harm-related content |
| Search                        | `adv_search`                 |1000 |Hateful and unfair content, Sexual content, Violent content, Self-harm-related content |
| Text Rewrite                  | `adv_rewrite`                |1000 |Hateful and unfair content, Sexual content, Violent content, Self-harm-related content |
| Ungrounded Content Generation | `adv_content_gen_ungrounded` |496 | Groundedness |
| Grounded Content Generation   | `adv_content_gen_grounded`   |475 |Groundedness |

You can get the templates you need for your scenario and pass it into your Simulator as the `template` parameter when you simulate. 

```python
adv_template = Simulator.get_template("adv_conversation") # get template for content harms
adv_conversation_result = adversarial_simulator.simulate(
    template=adv_template, # pass in the template, no paramaters list necessary
    max_simulation_results=100, # optional: limit the simulation results to the size of the dataset you need
    max_conversation_turns=3 
)
```

You can set `max_simulation_results` which controls the number of generations (conversations) you want in your dataset. By default, the full maximum number of simulations will be generated in the `adv_conversation_result`. 

### Generate an adversarial dataset with jailbreak injections

Evaluating jailbreak is a comparative measurement, not an AI-assisted metric. Run evaluations on two different, red-teamed datasets: a baseline adversarial test dataset versus the same adversarial test dataset with jailbreak injections in the first turn. You can generate the adversarial content harms dataset with jailbreak injections with the following flag. 

```python
adv_conversation_result_with_jailbreak = adversarial_simulator.simulate(
    template=adv_template,
    max_conversation_turns=3, 
    jailbreak=true # by default it is set to false, set to true to inject jailbreak strings into the first turn
)
```

The service provides a list of jailbreak `conversation_starters`, and the `jailbreak=true` randomly samples from that dataset for each generation.

### Output

The `conversation_result` will be an array of messages.

The `messages` in `conversation_result` is a list of conversation turns, for each conversation turn, it contains `content` which is the content of conversation, `role` which is either the user (simulated agent) or assistant and any required citations or context from either simulated user or the chat application.

The `simulation_parameters` contains the parameters passed into the template used for simulating the scenario (conversation).

If an array of parameters is provided for a template, the simulator will return an array of outputs with the format specified as below:

```json
{
    "template_parameters": [
        {
            "name": "<name_of_simulated_agent>",
            "profile": "<description_of_simulated_agent>",
            "tone": "<tone_description>",
            "conversation_starter": "<conversation_starter_input>",
            "metadata": {
                "<content_key>":"<content_value>"
            },
            "task": "<task_description>",
            "chatbot_name": "<name_of_chatbot>"
        }
        
    ],
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

This aligns to Azure AI SDK's `evaluate` function call that takes in this chat format dataset for evaluating metrics such as groundedness, relevance, and retrieval_score if `citations` are provided.

> [!TIP]
> All outputs of the simulator will follow the chat protocol format above. To convert a single turn chat format to Question and Answering pair format, use the helper function `to_eval_qa_json_lines()` on your simulator output.  

### Additional functionality

#### Early termination

Stop conversation earlier if the conversation meets a certain criteria, such as "bye" or "goodbye" appears in the conversation. Users can customize the stopping criteria themselves as well.

#### Retry

The scenario simulator supports retry logic, the default maximum number of retries in case the last API call failed is 3. The default number of seconds to sleep between consequent retries in case the last API call failed is 3.

User can also define their own `api_call_retry_sleep_sec` and `api_call_retry_max_count` and pass it into the `Simulator()`.

#### Example of output conversation from a general simulator

```json
{
    "simulation_parameters": [
         { "name": "Jane",
            "profile": "Jane Doe is a 28-year-old outdoor enthusiast who lives in Seattle, Washington. She has a passion for exploring nature and loves going on camping and hiking trips with her friends. She has recently become a member of the company's loyalty program and has achieved Bronze level status.Jane has a busy schedule, but she always makes time for her outdoor adventures. She is constantly looking for high-quality gear that can help her make the most of her trips and ensure she has a comfortable experience in the outdoors.Recently, Jane purchased a TrailMaster X4 Tent from the company. This tent is perfect for her needs, as it is both durable and spacious, allowing her to enjoy her camping trips with ease. The price of the tent was $250, and it has already proved to be a great investment.In addition to the tent, Jane also bought a Pathfinder Pro-1 Adventure Compass for $39.99. This compass has helped her navigate challenging trails with confidence, ensuring that she never loses her way during her adventures.Finally, Jane decided to upgrade her sleeping gear by purchasing a CozyNights Sleeping Bag for $100. This sleeping bag has made her camping nights even more enjoyable, as it provides her with the warmth and comfort she needs after a long day of hiking.",
            "tone": "happy",
            "metadata": {
                "customer_info": "## customer_info      name: Jane Doe    age: 28     phone_number: 555-987-6543     email: jane.doe@example.com     address: 789 Broadway St, Seattle, WA 98101      loyalty_program: True     loyalty_program Level: Bronze        ## recent_purchases      order_number: 5  date: 2023-05-01  item: - description:  TrailMaster X4 Tent, quantity 1, price $250    item_number: 1   order_number: 18  date: 2023-05-04  item: - description:  Pathfinder Pro-1 Adventure Compass, quantity 1, price $39.99    item_number: 4   order_number: 28  date: 2023-04-15  item: - description:  CozyNights Sleeping Bag, quantity 1, price $100    item_number: 7"
            },
            "task": "Jane is trying to accomplish the task of finding out the best hiking backpacks suitable for her weekend camping trips, and how they compare with other options available in the market. She wants to make an informed decision before making a purchase from the outdoor gear company's website or visiting their physical store.Jane uses Google to search for 'best hiking backpacks for weekend trips,' hoping to find reliable and updated information from official sources or trusted websites. She expects to see a list of top-rated backpacks, their features, capacity, comfort, durability, and prices. She is also interested in customer reviews to understand the pros and cons of each backpack.Furthermore, Jane wants to see the specifications, materials used, waterproof capabilities, and available colors for each backpack. She also wants to compare the chosen backpacks with other popular brands like Osprey, Deuter, or Gregory. Jane plans to spend about 20 minutes on this task and shortlist two or three options that suit her requirements and budget.Finally, as a Bronze level member of the outdoor gear company's loyalty program, Jane might also want to contact customer service to inquire about any special deals or discounts available on her shortlisted backpacks, ensuring she gets the best value for her purchase.",
            "chatbot_name": "ChatBot"
            }
    ],
    "messages": [
        {
            "content": "Hi ChatBot, can you help me find the best hiking backpacks for weekend trips? I want to make an informed decision before making a purchase.",
            "role": "user",
            "context": {
                "customer_info": "## customer_info      name: Jane Doe    age: 28     phone_number: 555-987-6543     email: jane.doe@example.com     address: 789 Broadway St, Seattle, WA 98101      loyalty_program: True     loyalty_program Level: Bronze        ## recent_purchases      order_number: 5  date: 2023-05-01  item: - description:  TrailMaster X4 Tent, quantity 1, price $250    item_number: 1   order_number: 18  date: 2023-05-04  item: - description:  Pathfinder Pro-1 Adventure Compass, quantity 1, price $39.99    item_number: 4   order_number: 28  date: 2023-04-15  item: - description:  CozyNights Sleeping Bag, quantity 1, price $100    item_number: 7"
            }
        },
        {
            "content": "Of course! I'd be happy to help you find the best hiking backpacks for weekend trips. What is your budget for the backpack?",
            "role": "assistant",
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
            "context": {
                "customer_info": "## customer_info      name: Jane Doe    age: 28     phone_number: 555-987-6543     email: jane.doe@example.com     address: 789 Broadway St, Seattle, WA 98101      loyalty_program: True     loyalty_program Level: Bronze        ## recent_purchases      order_number: 5  date: 2023-05-01  item: - description:  TrailMaster X4 Tent, quantity 1, price $250    item_number: 1   order_number: 18  date: 2023-05-04  item: - description:  Pathfinder Pro-1 Adventure Compass, quantity 1, price $39.99    item_number: 4   order_number: 28  date: 2023-04-15  item: - description:  CozyNights Sleeping Bag, quantity 1, price $100    item_number: 7"
            }
        }
    ],
    "$schema": "http://azureml/sdk-2-0/ChatConversation.json"
}
```

## Next steps

- [Learn more about Azure AI Studio](../what-is-ai-studio.md).
- Get started with [samples](https://aka.ms/safetyevalsamples) to try out the simulator.
