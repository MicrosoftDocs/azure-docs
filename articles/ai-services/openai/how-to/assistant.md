---
title: 'How to create Assistants with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Learn how to create helpful AI Assistants with tools like Code Interpreter
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.custom: references_regions
ms.topic: how-to
ms.date: 02/01/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false

---

# Getting started with Azure OpenAI Assistants (Preview)

Azure OpenAI Assistants (Preview) allows you to create AI assistants tailored to your needs through custom instructions and augmented by advanced tools like code interpreter, and custom functions. In this article we'll provide an in-depth walkthrough of getting started with the Assistants API.

## Assistants support

### Region and model support

The [models page](../concepts/models.md#assistants-preview) contains the most up-to-date information on regions/models where Assistants are currently supported.

### API Version

- `2024-02-15-preview`

### Supported file types

|File format|MIME Type|Code Interpreter |
|---|---|---|
|.c| text/x-c |✅|
|.cpp|text/x-c++ |✅|
|.csv|application/csv|✅|
|.docx|application/vnd.openxmlformats-officedocument.wordprocessingml.document|✅|
|.html|text/html|✅|
|.java|text/x-java|✅|
|.json|application/json|✅|
|.md|text/markdown| ✅ |
|.pdf|application/pdf|✅|
|.php|text/x-php|✅|
|.pptx|application/vnd.openxmlformats-officedocument.presentationml.presentation|✅|
|.py|text/x-python|✅|
|.py|text/x-script.python|✅|
|.rb|text/x-ruby|✅|
|.tex|text/x-tex|✅|
|.txt|text/plain|✅|
|.css|text/css|✅|
|.jpeg|image/jpeg|✅|
|.jpg|image/jpeg|✅|
|.js|text/javascript|✅|
|.gif|image/gif|✅|
|.png|image/png|✅|
|.tar|application/x-tar|✅|
|.ts|application/typescript|✅|
|.xlsx|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet|✅|
|.xml|application/xml or "text/xml"|✅|
|.zip|application/zip|✅|

### Tools

An individual assistant can access up to 128 tools including `code interpreter`, but you can also define your own custom tools via [functions](./assistant-functions.md).

### Files

Files can be uploaded via Studio, or programmatically. The `file_ids` parameter is required to give tools like `code_interpreter` access to files. When using the File upload endpoint, you must have the `purpose` set to assistants to be used with the Assistants API.

## Assistants playground

We provide a walkthrough of the Assistants playground in our [quickstart guide](../assistants-quickstart.md). This provides a no-code environment to test out the capabilities of assistants.

## Assistants components

| **Component** | **Description** |
|---|---|
| **Assistant** | Custom AI that uses Azure OpenAI models in conjunction with tools. |
|**Thread** | A conversation session between an Assistant and a user. Threads store Messages and automatically handle truncation to fit content into a model’s context.|
| **Message** | A message created by an Assistant or a user. Messages can include text, images, and other files. Messages are stored as a list on the Thread. |
|**Run** | Activation of an Assistant to begin running based on the contents of the Thread. The Assistant uses its configuration and the Thread’s Messages to perform tasks by calling models and tools. As part of a Run, the Assistant appends Messages to the Thread.|
|**Run Step** | A detailed list of steps the Assistant took as part of a Run. An Assistant can call tools or create Messages during it’s run. Examining Run Steps allows you to understand how the Assistant is getting to its final results. |

## Setting up your first Assistant

### Create an assistant

For this example we'll create an assistant that writes code to generate visualizations using the capabilities of the `code_interpreter` tool. The examples below are intended to be run sequentially in an environment like [Jupyter Notebooks](https://jupyter.org/).

```Python
import os
import json
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-02-15-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

# Create an assistant
assistant = client.beta.assistants.create(
    name="Data Visualization",
    instructions=f"You are a helpful AI assistant who makes interesting visualizations based on data." 
    f"You have access to a sandboxed environment for writing and testing code."
    f"When you are asked to create a visualization you should follow these steps:"
    f"1. Write the code."
    f"2. Anytime you write new code display a preview of the code to show your work."
    f"3. Run the code to confirm that it runs."
    f"4. If the code is successful display the visualization."
    f"5. If the code is unsuccessful display the error message and try to revise the code and rerun going through the steps from above again.",
    tools=[{"type": "code_interpreter"}],
    model="gpt-4-1106-preview" #You must replace this value with the deployment name for your model.
)

```

There are a few details you should note from the configuration above:

- We enable this assistant to access code interpreter with the line ` tools=[{"type": "code_interpreter"}],`. This gives the model access to a sand-boxed python environment to run and execute code to help formulating responses to a user's question.
- In the instructions we remind the model that it can execute code. Sometimes the model needs help guiding it towards the right tool to solve a given query. If you know, you want to use a particular library to generate a certain response that you know is part of code interpreter it can help to provide guidance by saying something like "Use Matplotlib to do x."
- Since this is Azure OpenAI the value you enter for `model=` **must match the deployment name**. By convention our docs will often use a deployment name that happens to match the model name to indicate which model was used when testing a given example, but in your environment the deployment names can be different and that is the name that you should enter in the code.

Next we're going to print the contents of assistant that we just created to confirm that creation was successful:

```python
print(assistant.model_dump_json(indent=2))
```

```json
{
  "id": "asst_7AZSrv5I3XzjUqWS40X5UgRr",
  "created_at": 1705972454,
  "description": null,
  "file_ids": [],
  "instructions": "You are a helpful AI assistant who makes interesting visualizations based on data.You have access to a sandboxed environment for writing and testing code.When you are asked to create a visualization you should follow these steps:1. Write the code.2. Anytime you write new code display a preview of the code to show your work.3. Run the code to confirm that it runs.4. If the code is successful display the visualization.5. If the code is unsuccessful display the error message and try to revise the code and rerun going through the steps from above again.",
  "metadata": {},
  "model": "gpt-4-1106-preview",
  "name": "Data Visualization",
  "object": "assistant",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ]
}
```

### Create a thread

Now let's create a thread

```python
# Create a thread
thread = client.beta.threads.create()
print(thread)
```

```output
Thread(id='thread_6bunpoBRZwNhovwzYo7fhNVd', created_at=1705972465, metadata={}, object='thread')
```

A thread is essentially the record of the conversation session between the assistant and the user. It's similar to the messages array/list in a typical chat completions API call. One of the key differences, is unlike a chat completions messages array, you don't need to track tokens with each call to make sure that you're remaining below the context length of the model. Threads abstract away this management detail and will compress the thread history as needed in order to allow the conversation to continue. The ability for threads to accomplish this with larger conversations is enhanced when using the latest models, which have larger context lengths as well as support for the latest features.

Next create the first user question to add to the thread

```python
# Add a user question to the thread
message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="Create a visualization of a sinewave"
)
```

### List thread messages

```python
thread_messages = client.beta.threads.messages.list(thread.id)
print(thread_messages.model_dump_json(indent=2))
```

```json
{
  "data": [
    {
      "id": "msg_JnkmWPo805Ft8NQ0gZF6vA2W",
      "assistant_id": null,
      "content": [
        {
          "text": {
            "annotations": [],
            "value": "Create a visualization of a sinewave"
          },
          "type": "text"
        }
      ],
      "created_at": 1705972476,
      "file_ids": [],
      "metadata": {},
      "object": "thread.message",
      "role": "user",
      "run_id": null,
      "thread_id": "thread_6bunpoBRZwNhovwzYo7fhNVd"
    }
  ],
  "object": "list",
  "first_id": "msg_JnkmWPo805Ft8NQ0gZF6vA2W",
  "last_id": "msg_JnkmWPo805Ft8NQ0gZF6vA2W",
  "has_more": false
}
```

### Run thread

```python
run = client.beta.threads.runs.create(
  thread_id=thread.id,
  assistant_id=assistant.id,
  #instructions="New instructions" #You can optionally provide new instructions but these will override the default instructions
)
```

We could also pass an `instructions` parameter here, but this would override the existing instructions that we have already provided for the assistant.

### Retrieve thread status

```python
# Retrieve the status of the run
run = client.beta.threads.runs.retrieve(
  thread_id=thread.id,
  run_id=run.id
)

status = run.status
print(status)
```

```output
completed
```

Depending on the complexity of the query you run, the thread could take longer to execute. In that case you can create a loop to monitor the [run status](#run-status-definitions) of the thread with code like the example below:

```python
import time
from IPython.display import clear_output

start_time = time.time()

status = run.status

while status not in ["completed", "cancelled", "expired", "failed"]:
    time.sleep(5)
    run = client.beta.threads.runs.retrieve(thread_id=thread.id,run_id=run.id)
    print("Elapsed time: {} minutes {} seconds".format(int((time.time() - start_time) // 60), int((time.time() - start_time) % 60)))
    status = run.status
    print(f'Status: {status}')
    clear_output(wait=True)

messages = client.beta.threads.messages.list(
  thread_id=thread.id
) 

print(f'Status: {status}')
print("Elapsed time: {} minutes {} seconds".format(int((time.time() - start_time) // 60), int((time.time() - start_time) % 60)))
print(messages.model_dump_json(indent=2))
```

When a Run is `in_progress` or in other nonterminal states the thread is locked. When a thread is locked new messages can't be added, and new runs can't be created.

### List thread messages post run

Once the run status indicates successful completion, you can list the contents of the thread again to retrieve the model's and any tools response:

```python
messages = client.beta.threads.messages.list(
  thread_id=thread.id
)

print(messages.model_dump_json(indent=2))
```

```json
{
  "data": [
    {
      "id": "msg_M5pz73YFsJPNBbWvtVs5ZY3U",
      "assistant_id": "asst_eHwhP4Xnad0bZdJrjHO2hfB4",
      "content": [
        {
          "text": {
            "annotations": [],
            "value": "Is there anything else you would like to visualize or any additional features you'd like to add to the sine wave plot?"
          },
          "type": "text"
        }
      ],
      "created_at": 1705967782,
      "file_ids": [],
      "metadata": {},
      "object": "thread.message",
      "role": "assistant",
      "run_id": "run_AGQHJrrfV3eM0eI9T3arKgYY",
      "thread_id": "thread_ow1Yv29ptyVtv7ixbiKZRrHd"
    },
    {
      "id": "msg_oJbUanImBRpRran5HSa4Duy4",
      "assistant_id": "asst_eHwhP4Xnad0bZdJrjHO2hfB4",
      "content": [
        {
          "image_file": {
            "file_id": "assistant-1YGVTvNzc2JXajI5JU9F0HMD"
          },
          "type": "image_file"
        },
        {
          "text": {
            "annotations": [],
            "value": "Here is the visualization of a sine wave: \n\nThe wave is plotted using values from 0 to \\( 4\\pi \\) on the x-axis, and the corresponding sine values on the y-axis. I've also added grid lines for easier reading of the plot."
          },
          "type": "text"
        }
      ],
      "created_at": 1705967044,
      "file_ids": [],
      "metadata": {},
      "object": "thread.message",
      "role": "assistant",
      "run_id": "run_8PsweDFn6gftUd91H87K0Yts",
      "thread_id": "thread_ow1Yv29ptyVtv7ixbiKZRrHd"
    },
    {
      "id": "msg_Pu3eHjM10XIBkwqh7IhnKKdG",
      "assistant_id": null,
      "content": [
        {
          "text": {
            "annotations": [],
            "value": "Create a visualization of a sinewave"
          },
          "type": "text"
        }
      ],
      "created_at": 1705966634,
      "file_ids": [],
      "metadata": {},
      "object": "thread.message",
      "role": "user",
      "run_id": null,
      "thread_id": "thread_ow1Yv29ptyVtv7ixbiKZRrHd"
    }
  ],
  "object": "list",
  "first_id": "msg_M5pz73YFsJPNBbWvtVs5ZY3U",
  "last_id": "msg_Pu3eHjM10XIBkwqh7IhnKKdG",
  "has_more": false
}
```

### Retrieve file ID

We had requested that the model generate an image of a sine wave. In order to download the image, we first need to retrieve the images file ID.

```python
data = json.loads(messages.model_dump_json(indent=2))  # Load JSON data into a Python object
image_file_id = data['data'][0]['content'][0]['image_file']['file_id']

print(image_file_id)  # Outputs: assistant-1YGVTvNzc2JXajI5JU9F0HMD
```

### Download image

```python
content = client.files.content(image_file_id)

image= content.write_to_file("sinewave.png")
```

Open the image locally once it's downloaded:

```python
from PIL import Image

# Display the image in the default image viewer
image = Image.open("sinewave.png")
image.show()
```

:::image type="content" source="../media/how-to/assistants/sine-wave.png" alt-text="Screenshot of code interpreter generated sinewave." lightbox="../media/how-to/assistants/sine-wave.png":::

### Ask a follow-up question on the thread

Since the assistant didn't quite follow our instructions and include the code that was run in the text portion of its response lets explicitly ask for that information.

```python
# Add a new user question to the thread
message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="Show me the code you used to generate the sinewave"
)
```

Again we'll need to run and retrieve the status of the thread:

```python
run = client.beta.threads.runs.create(
  thread_id=thread.id,
  assistant_id=assistant.id,
  #instructions="New instructions" #You can optionally provide new instructions  but these will override the default instructions
)

# Retrieve the status of the run
run = client.beta.threads.runs.retrieve(
  thread_id=thread.id,
  run_id=run.id
)

status = run.status
print(status)

```

```output
completed
```

Once the run status reaches completed, we'll list the messages in the thread again which should now include the response to our latest question.

```python
messages = client.beta.threads.messages.list(
  thread_id=thread.id
)

print(messages.model_dump_json(indent=2))
```

```json
{
  "data": [
    {
      "id": "msg_oaF1PUeozAvj3KrNnbKSy4LQ",
      "assistant_id": "asst_eHwhP4Xnad0bZdJrjHO2hfB4",
      "content": [
        {
          "text": {
            "annotations": [],
            "value": "Certainly, here is the code I used to generate the sine wave visualization:\n\n```python\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# Generating data for the sinewave\nx = np.linspace(0, 4 * np.pi, 1000)  # Generate values from 0 to 4*pi\ny = np.sin(x)  # Compute the sine of these values\n\n# Plotting the sine wave\nplt.plot(x, y)\nplt.title('Sine Wave')\nplt.xlabel('x')\nplt.ylabel('sin(x)')\nplt.grid(True)\nplt.show()\n```\n\nThis code snippet uses `numpy` to generate an array of x values and then computes the sine for each x value. It then uses `matplotlib` to plot these values and display the resulting graph."
          },
          "type": "text"
        }
      ],
      "created_at": 1705969710,
      "file_ids": [],
      "metadata": {},
      "object": "thread.message",
      "role": "assistant",
      "run_id": "run_oDS3fH7NorCUVwROTZejKcZN",
      "thread_id": "thread_ow1Yv29ptyVtv7ixbiKZRrHd"
    },
    {
      "id": "msg_moYE3aNwFYuRq2aXpxpt2Wb0",
      "assistant_id": null,
      "content": [
        {
          "text": {
            "annotations": [],
            "value": "Show me the code you used to generate the sinewave"
          },
          "type": "text"
        }
      ],
      "created_at": 1705969678,
      "file_ids": [],
      "metadata": {},
      "object": "thread.message",
      "role": "user",
      "run_id": null,
      "thread_id": "thread_ow1Yv29ptyVtv7ixbiKZRrHd"
    },
    {
      "id": "msg_M5pz73YFsJPNBbWvtVs5ZY3U",
      "assistant_id": "asst_eHwhP4Xnad0bZdJrjHO2hfB4",
      "content": [
        {
          "text": {
            "annotations": [],
            "value": "Is there anything else you would like to visualize or any additional features you'd like to add to the sine wave plot?"
          },
          "type": "text"
        }
      ],
      "created_at": 1705967782,
      "file_ids": [],
      "metadata": {},
      "object": "thread.message",
      "role": "assistant",
      "run_id": "run_AGQHJrrfV3eM0eI9T3arKgYY",
      "thread_id": "thread_ow1Yv29ptyVtv7ixbiKZRrHd"
    },
    {
      "id": "msg_oJbUanImBRpRran5HSa4Duy4",
      "assistant_id": "asst_eHwhP4Xnad0bZdJrjHO2hfB4",
      "content": [
        {
          "image_file": {
            "file_id": "assistant-1YGVTvNzc2JXajI5JU9F0HMD"
          },
          "type": "image_file"
        },
        {
          "text": {
            "annotations": [],
            "value": "Here is the visualization of a sine wave: \n\nThe wave is plotted using values from 0 to \\( 4\\pi \\) on the x-axis, and the corresponding sine values on the y-axis. I've also added grid lines for easier reading of the plot."
          },
          "type": "text"
        }
      ],
      "created_at": 1705967044,
      "file_ids": [],
      "metadata": {},
      "object": "thread.message",
      "role": "assistant",
      "run_id": "run_8PsweDFn6gftUd91H87K0Yts",
      "thread_id": "thread_ow1Yv29ptyVtv7ixbiKZRrHd"
    },
    {
      "id": "msg_Pu3eHjM10XIBkwqh7IhnKKdG",
      "assistant_id": null,
      "content": [
        {
          "text": {
            "annotations": [],
            "value": "Create a visualization of a sinewave"
          },
          "type": "text"
        }
      ],
      "created_at": 1705966634,
      "file_ids": [],
      "metadata": {},
      "object": "thread.message",
      "role": "user",
      "run_id": null,
      "thread_id": "thread_ow1Yv29ptyVtv7ixbiKZRrHd"
    }
  ],
  "object": "list",
  "first_id": "msg_oaF1PUeozAvj3KrNnbKSy4LQ",
  "last_id": "msg_Pu3eHjM10XIBkwqh7IhnKKdG",
  "has_more": false
}
```

To extract only the response to our latest question:

```python
data = json.loads(messages.model_dump_json(indent=2))
code = data['data'][0]['content'][0]['text']['value']
print(code)
```

*Certainly, here is the code I used to generate the sine wave visualization:*

```python
import numpy as np
import matplotlib.pyplot as plt

# Generating data for the sinewave
x = np.linspace(0, 4 * np.pi, 1000)  # Generate values from 0 to 4*pi
y = np.sin(x)  # Compute the sine of these values

# Plotting the sine wave
plt.plot(x, y)
plt.title('Sine Wave')
plt.xlabel('x')
plt.ylabel('sin(x)')
plt.grid(True)
plt.show()
```

### Dark mode

Let's add one last question to the thread to see if code interpreter can swap the chart to dark mode for us.

```python
# Add a user question to the thread
message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="I prefer visualizations in darkmode can you change the colors to make a darkmode version of this visualization."
)

# Run the thread
run = client.beta.threads.runs.create(
  thread_id=thread.id,
  assistant_id=assistant.id,
)

# Retrieve the status of the run
run = client.beta.threads.runs.retrieve(
  thread_id=thread.id,
  run_id=run.id
)

status = run.status
print(status)
```

```output
completed
```

```python
messages = client.beta.threads.messages.list(
  thread_id=thread.id
)

print(messages.model_dump_json(indent=2))
```

```json
{
  "data": [
    {
      "id": "msg_KKzOHCArWGvGpuPo0pVZTHgV",
      "assistant_id": "asst_eHwhP4Xnad0bZdJrjHO2hfB4",
      "content": [
        {
          "text": {
            "annotations": [],
            "value": "You're viewing the dark mode version of the sine wave visualization in the image above. The plot is set against a dark background with a cyan colored sine wave for better contrast and visibility. If there's anything else you'd like to adjust or any other assistance you need, feel free to let me know!"
          },
          "type": "text"
        }
      ],
      "created_at": 1705971199,
      "file_ids": [],
      "metadata": {},
      "object": "thread.message",
      "role": "assistant",
      "run_id": "run_izZFyTVB1AlFM1VVMItggRn4",
      "thread_id": "thread_ow1Yv29ptyVtv7ixbiKZRrHd"
    },
    {
      "id": "msg_30pXFVYNgP38qNEMS4Zbozfk",
      "assistant_id": null,
      "content": [
        {
          "text": {
            "annotations": [],
            "value": "I prefer visualizations in darkmode can you change the colors to make a darkmode version of this visualization."
          },
          "type": "text"
        }
      ],
      "created_at": 1705971194,
      "file_ids": [],
      "metadata": {},
      "object": "thread.message",
      "role": "user",
      "run_id": null,
      "thread_id": "thread_ow1Yv29ptyVtv7ixbiKZRrHd"
    },
    {
      "id": "msg_3j31M0PaJLqO612HLKVsRhlw",
      "assistant_id": "asst_eHwhP4Xnad0bZdJrjHO2hfB4",
      "content": [
        {
          "image_file": {
            "file_id": "assistant-kfqzMAKN1KivQXaEJuU0u9YS"
          },
          "type": "image_file"
        },
        {
          "text": {
            "annotations": [],
            "value": "Here is the dark mode version of the sine wave visualization. I've used the 'dark_background' style in Matplotlib and chosen a cyan color for the plot line to ensure it stands out against the dark background."
          },
          "type": "text"
        }
      ],
      "created_at": 1705971123,
      "file_ids": [],
      "metadata": {},
      "object": "thread.message",
      "role": "assistant",
      "run_id": "run_B91erEPWro4bZIfryQeIDDlx",
      "thread_id": "thread_ow1Yv29ptyVtv7ixbiKZRrHd"
    },
    {
      "id": "msg_FgDZhBvvM1CLTTFXwgeJLdua",
      "assistant_id": null,
      "content": [
        {
          "text": {
            "annotations": [],
            "value": "I prefer visualizations in darkmode can you change the colors to make a darkmode version of this visualization."
          },
          "type": "text"
        }
      ],
      "created_at": 1705971052,
      "file_ids": [],
      "metadata": {},
      "object": "thread.message",
      "role": "user",
      "run_id": null,
      "thread_id": "thread_ow1Yv29ptyVtv7ixbiKZRrHd"
    },
    {
      "id": "msg_oaF1PUeozAvj3KrNnbKSy4LQ",
      "assistant_id": "asst_eHwhP4Xnad0bZdJrjHO2hfB4",
      "content": [
        {
          "text": {
            "annotations": [],
            "value": "Certainly, here is the code I used to generate the sine wave visualization:\n\n```python\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# Generating data for the sinewave\nx = np.linspace(0, 4 * np.pi, 1000)  # Generate values from 0 to 4*pi\ny = np.sin(x)  # Compute the sine of these values\n\n# Plotting the sine wave\nplt.plot(x, y)\nplt.title('Sine Wave')\nplt.xlabel('x')\nplt.ylabel('sin(x)')\nplt.grid(True)\nplt.show()\n```\n\nThis code snippet uses `numpy` to generate an array of x values and then computes the sine for each x value. It then uses `matplotlib` to plot these values and display the resulting graph."
          },
          "type": "text"
        }
      ],
      "created_at": 1705969710,
      "file_ids": [],
      "metadata": {},
      "object": "thread.message",
      "role": "assistant",
      "run_id": "run_oDS3fH7NorCUVwROTZejKcZN",
      "thread_id": "thread_ow1Yv29ptyVtv7ixbiKZRrHd"
    },
    {
      "id": "msg_moYE3aNwFYuRq2aXpxpt2Wb0",
      "assistant_id": null,
      "content": [
        {
          "text": {
            "annotations": [],
            "value": "Show me the code you used to generate the sinewave"
          },
          "type": "text"
        }
      ],
      "created_at": 1705969678,
      "file_ids": [],
      "metadata": {},
      "object": "thread.message",
      "role": "user",
      "run_id": null,
      "thread_id": "thread_ow1Yv29ptyVtv7ixbiKZRrHd"
    },
    {
      "id": "msg_M5pz73YFsJPNBbWvtVs5ZY3U",
      "assistant_id": "asst_eHwhP4Xnad0bZdJrjHO2hfB4",
      "content": [
        {
          "text": {
            "annotations": [],
            "value": "Is there anything else you would like to visualize or any additional features you'd like to add to the sine wave plot?"
          },
          "type": "text"
        }
      ],
      "created_at": 1705967782,
      "file_ids": [],
      "metadata": {},
      "object": "thread.message",
      "role": "assistant",
      "run_id": "run_AGQHJrrfV3eM0eI9T3arKgYY",
      "thread_id": "thread_ow1Yv29ptyVtv7ixbiKZRrHd"
    },
    {
      "id": "msg_oJbUanImBRpRran5HSa4Duy4",
      "assistant_id": "asst_eHwhP4Xnad0bZdJrjHO2hfB4",
      "content": [
        {
          "image_file": {
            "file_id": "assistant-1YGVTvNzc2JXajI5JU9F0HMD"
          },
          "type": "image_file"
        },
        {
          "text": {
            "annotations": [],
            "value": "Here is the visualization of a sine wave: \n\nThe wave is plotted using values from 0 to \\( 4\\pi \\) on the x-axis, and the corresponding sine values on the y-axis. I've also added grid lines for easier reading of the plot."
          },
          "type": "text"
        }
      ],
      "created_at": 1705967044,
      "file_ids": [],
      "metadata": {},
      "object": "thread.message",
      "role": "assistant",
      "run_id": "run_8PsweDFn6gftUd91H87K0Yts",
      "thread_id": "thread_ow1Yv29ptyVtv7ixbiKZRrHd"
    },
    {
      "id": "msg_Pu3eHjM10XIBkwqh7IhnKKdG",
      "assistant_id": null,
      "content": [
        {
          "text": {
            "annotations": [],
            "value": "Create a visualization of a sinewave"
          },
          "type": "text"
        }
      ],
      "created_at": 1705966634,
      "file_ids": [],
      "metadata": {},
      "object": "thread.message",
      "role": "user",
      "run_id": null,
      "thread_id": "thread_ow1Yv29ptyVtv7ixbiKZRrHd"
    }
  ],
  "object": "list",
  "first_id": "msg_KKzOHCArWGvGpuPo0pVZTHgV",
  "last_id": "msg_Pu3eHjM10XIBkwqh7IhnKKdG",
  "has_more": false
}
```

Extract the new image file ID and download and display the image:

```python
data = json.loads(messages.model_dump_json(indent=2))  # Load JSON data into a Python object
image_file_id = data['data'][0]['content'][0]['image_file']['file_id'] # index numbers can vary if you have had a different conversation over the course of the thread.

print(image_file_id)

content = client.files.content(image_file_id)
image= content.write_to_file("dark_sine.png")

# Display the image in the default image viewer
image = Image.open("dark_sine.png")
image.show()
```

:::image type="content" source="../media/how-to/assistants/dark-mode.png" alt-text="Screenshot of code interpreter generated sinewave in darkmode." lightbox="../media/how-to/assistants/dark-mode.png":::

## Additional reference

### Run status definitions

|**Status**| **Definition**|
|------|--------------|
|`queued`| When Runs are first created or when you complete the required_action, they are moved to a queued status. They should almost immediately move to in_progress.|
|`in_progress` | While in_progress, the Assistant uses the model and tools to perform steps. You can view progress being made by the Run by examining the Run Steps.|
|`completed` | The Run successfully completed! You can now view all Messages the Assistant added to the Thread, and all the steps the Run took. You can also continue the conversation by adding more user Messages to the Thread and creating another Run.|
|`requires_action` | When using the Function calling tool, the Run will move to a required_action state once the model determines the names and arguments of the functions to be called. You must then run those functions and submit the outputs before the run proceeds. If the outputs are not provided before the expires_at timestamp passes (roughly 10-mins past creation), the run will move to an expired status.|
|`expired` | This happens when the function calling outputs weren't submitted before expires_at and the run expires. Additionally, if the runs take too long to execute and go beyond the time stated in expires_at, our systems will expire the run.|
|`cancelling`| You can attempt to cancel an in_progress run using the Cancel Run endpoint. Once the attempt to cancel succeeds, status of the Run moves to canceled. Cancelation is attempted but not guaranteed.|
|`cancelled` |Run was successfully canceled.|
|`failed` |You can view the reason for the failure by looking at the `last_error` object in the Run. The timestamp for the failure will be recorded under failed_at.|

## Message annotations

Assistant message annotations are different from the [content filtering annotations](../concepts/content-filter.md) that are present in completion and chat completion API responses. Assistant annotations can occur within the content array of the object. Annotations provide information around how you should annotate the text in the responses to the user.

When annotations are present in the Message content array, you'll see illegible model-generated substrings in the text that you need to replace with the correct annotations. These strings might look something like `【13†source】` or `sandbox:/mnt/data/file.csv`. Here’s a Python code snippet from OpenAI that replaces these strings with the information present in the annotations.

```Python

from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-02-15-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

# Retrieve the message object
message = client.beta.threads.messages.retrieve(
  thread_id="...",
  message_id="..."
)

# Extract the message content
message_content = message.content[0].text
annotations = message_content.annotations
citations = []

# Iterate over the annotations and add footnotes
for index, annotation in enumerate(annotations):
    # Replace the text with a footnote
    message_content.value = message_content.value.replace(annotation.text, f' [{index}]')

    # Gather citations based on annotation attributes
    if (file_citation := getattr(annotation, 'file_citation', None)):
        cited_file = client.files.retrieve(file_citation.file_id)
        citations.append(f'[{index}] {file_citation.quote} from {cited_file.filename}')
    elif (file_path := getattr(annotation, 'file_path', None)):
        cited_file = client.files.retrieve(file_path.file_id)
        citations.append(f'[{index}] Click <here> to download {cited_file.filename}')
        # Note: File download functionality not implemented above for brevity

# Add footnotes to the end of the message before displaying to user
message_content.value += '\n' + '\n'.join(citations)

```

|Message annotation | Description |
|---|---|
| `file_citation` | File citations are created by the retrieval tool and define references to a specific quote in a specific file that was uploaded and used by the Assistant to generate the response. |
|`file_path` | File path annotations are created by the code_interpreter tool and contain references to the files generated by the tool. |

## See also

* Learn more about Assistants and [Code Interpreter](./code-interpreter.md)
* Learn more about Assistants and [function calling](./assistant-functions.md)
* [Azure OpenAI Assistants API samples](https://github.com/Azure-Samples/azureai-samples/tree/main/scenarios/Assistants)
