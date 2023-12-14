---
title: How to use function calling with Azure OpenAI Service
titleSuffix: Azure OpenAI Service
description: Learn how to use function calling with the GPT-35-Turbo and GPT-4 models 
author: mrbullwinkle #dereklegenzoff
ms.author: mbullwin #delegenz
ms.service: azure-ai-openai
ms.topic: how-to
ms.date: 12/04/2023
manager: nitinme
---

# How to use function calling with Azure OpenAI Service (Preview)

The latest versions of gpt-35-turbo and gpt-4 are fine-tuned to work with functions and are able to both determine when and how a function should be called. If one or more functions are included in your request, the model determines if any of the functions should be called based on the context of the prompt. When the model determines that a function should be called, it responds with a JSON object including the arguments for the function. 

The models formulate API calls and structure data outputs, all based on the functions you specify. It's important to note that while the models can generate these calls, it's up to you to execute them, ensuring you remain in control.

At a high level you can break down working with functions into three steps:
1. Call the chat completions API with your functions and the user’s input
2. Use the model’s response to call your API or function 
3. Call the chat completions API again, including the response from your function to get a final response

> [!IMPORTANT]
> The `functions` and `function_call` parameters have been deprecated with the release of the [`2023-12-01-preview`](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/preview/2023-12-01-preview/inference.json) version of the API. The replacement for `functions` is the [`tools`](../reference.md#chat-completions) parameter. The replacement for `function_call` is the [`tool_choice`](../reference.md#chat-completions) parameter.

## Using function in the chat completions API

Function calling is available in the `2023-07-01-preview` API version and works with version 0613 of gpt-35-turbo, gpt-35-turbo-16k, gpt-4, and gpt-4-32k.

To use function calling with the Chat Completions API, you need to include two new properties in your request: `functions` and `function_call`. You can include one or more `functions` in your request and you can learn more about how to define functions in the [defining functions](#defining-functions) section. Keep in mind that functions are injected into the system message under the hood so functions count against your token usage.

When functions are provided, by default the `function_call` is set to `"auto"` and the model decides whether or not a function should be called. Alternatively, you can set the `function_call` parameter to `{"name": "<insert-function-name>"}` to force the API to call a specific function or you can set the parameter to `"none"` to prevent the model from calling any functions.

# [OpenAI Python 0.28.1](#tab/python)

```python

import os
import openai

openai.api_key = os.getenv("AZURE_OPENAI_KEY")
openai.api_version = "2023-07-01-preview"
openai.api_type = "azure"
openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT")

messages= [
    {"role": "user", "content": "Find beachfront hotels in San Diego for less than $300 a month with free breakfast."}
]

functions= [  
    {
        "name": "search_hotels",
        "description": "Retrieves hotels from the search index based on the parameters provided",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The location of the hotel (i.e. Seattle, WA)"
                },
                "max_price": {
                    "type": "number",
                    "description": "The maximum price for the hotel"
                },
                "features": {
                    "type": "string",
                    "description": "A comma separated list of features (i.e. beachfront, free wifi, etc.)"
                }
            },
            "required": ["location"]
        }
    }
]  

response = openai.ChatCompletion.create(
    engine="gpt-35-turbo-0613", # engine = "deployment_name"
    messages=messages,
    functions=functions,
    function_call="auto", 
)

print(response['choices'][0]['message'])
```

```json
{
  "role": "assistant",
  "function_call": {
    "name": "search_hotels",
    "arguments": "{\n  \"location\": \"San Diego\",\n  \"max_price\": 300,\n  \"features\": \"beachfront,free breakfast\"\n}"
  }
}
```

# [OpenAI Python 1.x](#tab/python-new)

```python
import os
from openai import AzureOpenAI

client = AzureOpenAI(
  api_key=os.getenv("AZURE_OPENAI_KEY"),  
  api_version="2023-10-01-preview",
  azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
)

messages= [
    {"role": "user", "content": "Find beachfront hotels in San Diego for less than $300 a month with free breakfast."}
]

functions= [  
    {
        "name": "search_hotels",
        "description": "Retrieves hotels from the search index based on the parameters provided",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The location of the hotel (i.e. Seattle, WA)"
                },
                "max_price": {
                    "type": "number",
                    "description": "The maximum price for the hotel"
                },
                "features": {
                    "type": "string",
                    "description": "A comma separated list of features (i.e. beachfront, free wifi, etc.)"
                }
            },
            "required": ["location"]
        }
    }
]  

response = client.chat.completions.create(
    model="gpt-35-turbo-0613", # model = "deployment_name"
    messages= messages,
    functions = functions,
    function_call="auto",
)

print(response.choices[0].message.model_dump_json(indent=2))
```

```json
{
  "content": null,
  "role": "assistant",
  "function_call": {
    "arguments": "{\n  \"location\": \"San Diego\",\n  \"max_price\": 300,\n  \"features\": \"beachfront, free breakfast\"\n}",
    "name": "search_hotels"
  }
}
```

# [PowerShell](#tab/powershell)

```powershell-interactive
$openai = @{
    api_key     = $Env:AZURE_OPENAI_KEY
    api_base    = $Env:AZURE_OPENAI_ENDPOINT # should look like https:/YOUR_RESOURCE_NAME.openai.azure.com/
    api_version = '2023-10-01-preview' # may change in the future
    name        = 'YOUR-DEPLOYMENT-NAME-HERE' # the custom name you chose for your deployment
}

$headers = [ordered]@{
   'api-key' = $openai.api_key
}

$messages   = @()
$messages  += [ordered]@{
    role    = 'user'
    content = 'Find beachfront hotels in San Diego for less than $300 a month with free breakfast.'
}

$functions  = @()
$functions += [ordered]@{
    name        = 'search_hotels'
    description = 'Retrieves hotels from the search index based on the parameters provided'
    parameters  = @{
        type = 'object'
        properties = @{
            location = @{
                type = 'string'
                description = 'The location of the hotel (i.e. Seattle, WA)'
            }
            max_price = @{
                type = 'number'
                description = 'The maximum price for the hotel'
            }
            features = @{
                type = 'string'
                description = 'A comma separated list of features (i.e. beachfront, free wifi, etc.)'
            }
        }
        required = @('location')
    }
}

# these API arguments are introduced in model version 0613
$body = [ordered]@{
    messages      = $messages
    functions         = $functions
    function_call   = 'auto'
} | ConvertTo-Json -depth 6

$url = "$($openai.api_base)/openai/deployments/$($openai.name)/chat/completions?api-version=$($openai.api_version)"

$response = Invoke-RestMethod -Uri $url -Headers $headers -Body $body -Method Post -ContentType 'application/json'
$response.choices[0].message | ConvertTo-Json
```

```json
{
  "role": "assistant",
  "function_call": {
    "name": "search_hotels",
    "arguments": "{\n  \"max_price\": 300,\n  \"features\": \"beachfront, free breakfast\",\n  \"location\": \"San Diego\"\n}"
  }
}
```

---

The response from the API includes a `function_call` property if the model determines that a function should be called. The `function_call` property includes the name of the function to call and the arguments to pass to the function. The arguments are a JSON string that you can parse and use to call your function.

In some cases, the model generates both `content` and a `function_call`. For example, for the prompt above the content could say something like "Sure, I can help you find some hotels in San Diego that match your criteria" along with the function_call.

## Working with function calling

The following section goes into more detail on how to effectively use functions with the Chat Completions API.

### Defining functions

A function has three main parameters: `name`, `description`, and `parameters`. The `description` parameter is used by the model to determine when and how to call the function so it's important to give a meaningful description of what the function does.

`parameters` is a JSON schema object that describes the parameters that the function accepts. You can learn more about JSON schema objects in the [JSON schema reference](https://json-schema.org/understanding-json-schema/).

If you want to describe a function that doesn't accept any parameters, use `{"type": "object", "properties": {}}` as the value for the `parameters` property.

### Managing the flow with functions

Example in Python.

```python

response = openai.ChatCompletion.create(
    deployment_id="gpt-35-turbo-0613",
    messages=messages,
    functions=functions,
    function_call="auto", 
)
response_message = response["choices"][0]["message"]

# Check if the model wants to call a function
if response_message.get("function_call"):

    # Call the function. The JSON response may not always be valid so make sure to handle errors
    function_name = response_message["function_call"]["name"]

    available_functions = {
            "search_hotels": search_hotels,
    }
    function_to_call = available_functions[function_name] 

    function_args = json.loads(response_message["function_call"]["arguments"])
    function_response = function_to_call(**function_args)

    # Add the assistant response and function response to the messages
    messages.append( # adding assistant response to messages
        {
            "role": response_message["role"],
            "function_call": {
                "name": function_name,
                "arguments": response_message["function_call"]["arguments"],
            },
            "content": None
        }
    )
    messages.append( # adding function response to messages
        {
            "role": "function",
            "name": function_name,
            "content": function_response,
        }
    ) 

    # Call the API again to get the final response from the model
    second_response = openai.ChatCompletion.create(
            messages=messages,
            deployment_id="gpt-35-turbo-0613"
            # optionally, you could provide functions in the second call as well
        )
    print(second_response["choices"][0]["message"])
else:
    print(response["choices"][0]["message"])
```

Example in Powershell.

```powershell-interactive
# continues from the previous PowerShell example

$response = Invoke-RestMethod -Uri $url -Headers $headers -Body $body -Method Post -ContentType 'application/json'
$response.choices[0].message | ConvertTo-Json

# Check if the model wants to call a function
if ($null -ne $response.choices[0].message.function_call) {

    $functionName  = $response.choices[0].message.function_call.name
    $functionArgs = $response.choices[0].message.function_call.arguments

    # Add the assistant response and function response to the messages
    $messages += @{
        role          = $response.choices[0].message.role
        function_call = @{
            name      = $functionName
            arguments = $functionArgs
        }
        content       = 'None'
    }
    $messages += @{
        role          = 'function'
        name          = $response.choices[0].message.function_call.name
        content       = "$functionName($functionArgs)"
    }

    # Call the API again to get the final response from the model
    
    # these API arguments are introduced in model version 0613
    $body = [ordered]@{
        messages      = $messages
        functions         = $functions
        function_call   = 'auto'
    } | ConvertTo-Json -depth 6

    $url = "$($openai.api_base)/openai/deployments/$($openai.name)/chat/completions?api-version=$($openai.api_version)"

    $secondResponse = Invoke-RestMethod -Uri $url -Headers $headers -Body $body -Method Post -ContentType 'application/json'
    $secondResponse.choices[0].message | ConvertTo-Json
}
```

Example output.

```output
{
  "role": "assistant",
  "content": "I'm sorry, but I couldn't find any beachfront hotels in San Diego for less than $300 a month with free breakfast."
}
```

In the examples, we don't do any validation or error handling so you'll want to make sure to add that to your code.

For a full example of working with functions, see the [sample notebook on function calling](https://aka.ms/oai/functions-samples). You can also apply more complex logic to chain multiple function calls together, which is covered in the sample as well.

### Prompt engineering with functions

When you define a function as part of your request, the details are injected into the system message using specific syntax that the model is been trained on. This means that functions consume tokens in your prompt and that you can apply prompt engineering techniques to optimize the performance of your function calls. The model uses the full context of the prompt to determine if a function should be called including function definition, the system message, and the user messages.

#### Improving quality and reliability
If the model isn't calling your function when or how you expect, there are a few things you can try to improve the quality.

##### Provide more details in your function definition
It's important that you provide a meaningful `description` of the function and provide descriptions for any parameter that might not be obvious to the model. For example, in the description for the `location` parameter, you could include extra details and examples on the format of the location.
```json
"location": {
    "type": "string",
    "description": "The location of the hotel. The location should include the city and the state's abbreviation (i.e. Seattle, WA or Miami, FL)"
},
```

##### Provide more context in the system message
The system message can also be used to provide more context to the model. For example, if you have a function called `search_hotels` you could include a system message like the following to instruct the model to call the function when a user asks for help with finding a hotel.
```json 
{"role": "system", "content": "You're an AI assistant designed to help users search for hotels. When a user asks for help finding a hotel, you should call the search_hotels function."}
```

##### Instruct the model to ask clarifying questions
In some cases, you want to instruct the model to ask clarifying questions to prevent making assumptions about what values to use with functions. For example, with `search_hotels` you would want the model to ask for clarification if the user request didn't include details on `location`. To instruct the model to ask a clarifying question, you could include content like the next example in your system message.
```json
{"role": "system", "content": "Don't make assumptions about what values to use with functions. Ask for clarification if a user request is ambiguous."}
```

#### Reducing errors

Another area where prompt engineering can be valuable is in reducing errors in function calls. The models are trained to generate function calls matching the schema that you define, but the models produce a function call that doesn't match the schema you defined or try to call a function that you didn't include. 

If you find the model is generating function calls that weren't provided, try including a sentence in the system message that says `"Only use the functions you have been provided with."`.

## Using function calling responsibly
Like any AI system, using function calling to integrate language models with other tools and systems presents potential risks. It’s important to understand the risks that function calling could present and take measures to ensure you use the capabilities responsibly.

Here are a few tips to help you use functions safely and securely:
*	**Validate Function Calls**: Always verify the function calls generated by the model. This includes checking the parameters, the function being called, and ensuring that the call aligns with the intended action.
*	**Use Trusted Data and Tools**: Only use data from trusted and verified sources. Untrusted data in a function’s output could be used to instruct the model to write function calls in a way other than you intended.
*	**Follow the Principle of Least Privilege**: Grant only the minimum access necessary for the function to perform its job. This reduces the potential impact if a function is misused or exploited. For example, if you’re using function calls to query a database, you should only give your application read-only access to the database. You also shouldn’t depend solely on excluding capabilities in the function definition as a security control.
*	**Consider Real-World Impact**: Be aware of the real-world impact of function calls that you plan to execute, especially those that trigger actions such as executing code, updating databases, or sending notifications.
*	**Implement User Confirmation Steps**: Particularly for functions that take actions, we recommend including a step where the user confirms the action before it's executed.

To learn more about our recommendations on how to use Azure OpenAI models responsibly, see the [Overview of Responsible AI practices for Azure OpenAI models](/legal/cognitive-services/openai/overview?context=/azure/ai-services/openai/context/context).

## Next steps

* [Learn more about Azure OpenAI](../overview.md).
* For more examples on working with functions, check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/oai/functions-samples)
* Get started with the GPT-35-Turbo model with [the GPT-35-Turbo quickstart](../chatgpt-quickstart.md).
