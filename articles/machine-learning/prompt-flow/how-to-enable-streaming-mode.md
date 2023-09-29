---
title: How to use streaming endpoints deployed from Prompt Flow (preview)
titleSuffix: Azure Machine Learning
description: Learn how use streaming when you consume the endpoints in Azure Machine Learning prompt flow.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.custom: devx-track-python
ms.topic: how-to
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 09/12/2023
---

# How to use streaming endpoints deployed from Prompt Flow (preview)

In Prompt Flow, you can [deploy flow to an Azure Machine Learning managed online endpoint](how-to-deploy-for-real-time-inference.md) for real-time inference.

When consuming the endpoint by sending a request, the default behavior is that the online endpoint will keep waiting until the whole response is ready, and then send it back to the client. This can cause a long delay for the client and a poor user experience.

To avoid this, you can use streaming when you consume the endpoints. Once streaming enabled, you don't have to wait for the whole response to be ready. Instead, the server will send back the response in chunks as they're generated. The client can then display the response progressively, with less waiting time and more interactivity.

This article will describe the scope of streaming, how streaming works, and how to consume streaming endpoints.

> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Create a streaming enabled flow

If you want to use the streaming mode, you need to create a flow that has a node that produces a string generator as the flow’s output. A string generator is an object that can return one string at a time when requested. You can use the following types of nodes to create a string generator:

- LLM node: This node uses a large language model to generate natural language responses based on the input.

  ```jinja
  {# Sample prompt template for LLM node #}

  system:
  You are a helpful assistant.

  user:
  {{question}}
  ```

- Python node: This node allows you to write custom Python code that can yield string outputs. You can use this node to call external APIs or libraries that support streaming. For example, you can use this code to echo the input word by word:

  ```python
  from promptflow import tool

  # Sample code echo input by yield in Python tool node

  @tool
  def my_python_tool(paragraph: str) -> str:
      yield "Echo: "
      for word in paragraph.split():
          yield word + " "
  ```

> [!IMPORTANT]
> Only the output of the last node of the flow can support streaming.
>
> "Last node" means the node output is not consumed by other nodes.

In this guide, we will use the "Chat with Wikipedia" sample flow as an example. This flow processes the user’s question, searches Wikipedia for relevant articles, and answers the question with information from the articles. It uses streaming mode to show the progress of the answer generation.

To learn how to create a chat flow, see  [how to develop a chat flow in prompt flow](how-to-develop-a-chat-flow.md) to create a chat flow.

:::image type="content" source="./media/how-to-enable-streaming-mode/chat-wikipedia-center.png" alt-text="Screenshot of the chat with Wikipedia flow." lightbox = "./media/how-to-enable-streaming-mode/chat-wikipedia-center.png":::

## Deploy the flow as an online endpoint

To use the streaming mode, you need to deploy your flow as an online endpoint. This will allow you to send requests and receive responses from your flow in real time.

To learn how to deploy your flow as an online endpoint, see  [Deploy a flow to online endpoint for real-time inference with CLI](./how-to-deploy-to-code.md) to deploy your flow as an online endpoint.

> [!NOTE]
> 
> Deploy with Runtime environment version later than version `20230710.v2`.

You can check your runtime version and update runtime in the run time detail page.

:::image type="content" source="./media/how-to-enable-streaming-mode/runtime-version.png" alt-text="Screenshot of Azure Machine Learning studio showing the runtime environment." lightbox = "./media/how-to-enable-streaming-mode/runtime-version.png":::

## Understand the streaming process

When you have an online endpoint, the client and the server need to follow specific principles for [content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation) to utilize the streaming mode:

Content negotiation is like a conversation between the client and the server about the preferred format of the data they want to send and receive. It ensures effective communication and agreement on the format of the exchanged data.

To understand the streaming process, consider the following steps:

- First, the client constructs an HTTP request with the desired media type included in the `Accept` header. The media type tells the server what kind of data format the client expects. It's like the client saying, "Hey, I'm looking for a specific format for the data you'll send me. It could be JSON, text, or something else." For example, `application/json` indicates a preference for JSON data, `text/event-stream` indicates a desire for streaming data, and `*/*` means the client accepts any data format.
    > [!NOTE]
    >
    > If a request lacks an `Accept` header or has empty `Accept` header, it implies that the client will accept any media type in response. The server treats it as `*/*`.

- Next, the server responds based on the media type specified in the `Accept` header. It's important to note that the client may request multiple media types in the `Accept` header, and the server must consider its capabilities and format priorities to determine the appropriate response.
  - First, the server checks if `text/event-stream` is explicitly specified in the `Accept` header:
    - For a stream-enabled flow, the server returns a response with a `Content-Type` of `text/event-stream`, indicating that the data is being streamed.
    - For a non-stream-enabled flow, the server proceeds to check for other media types specified in the header.
  - If `text/event-stream` isn't specified, the server then checks if `application/json` or `*/*` is specified in the `Accept` header:
    - In such cases, the server returns a response with a `Content-Type` of `application/json`, providing the data in JSON format.
  - If the `Accept` header specifies other media types, such as `text/html`:
    - The server returns a `424` response with a PromptFlow runtime error code `UserError` and a runtime HTTP status `406`, indicating that the server can't fulfill the request with the requested data format.
     To learn more, see [handle errors](#handle-errors).
- Finally, the client checks the `Content-Type` response header. If it's set to `text/event-stream`, it indicates that the data is being streamed.

Let’s take a closer look at how the streaming process works. The response data in streaming mode follows the format of [server-sent events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events).

The overall process works as follows:

### 0. The client sends a message to the server

```JSON
POST https://<your-endpoint>.inference.ml.azure.com/score
Content-Type: application/json
Authorization: Bearer <key or token of your endpoint>
Accept: text/event-stream

{
    "question": "Hello",
    "chat_history": []
}
```

> [!NOTE]
> 
> The `Accept` header is set to `text/event-stream` to request a stream response.

### 1. The server sends back the response in streaming mode

```JSON
HTTP/1.1 200 OK
Content-Type: text/event-stream; charset=utf-8
Connection: close
Transfer-Encoding: chunked

data: {"answer": ""}

data: {"answer": "Hello"}

data: {"answer": "!"}

data: {"answer": " How"}

data: {"answer": " can"}

data: {"answer": " I"}

data: {"answer": " assist"}

data: {"answer": " you"}

data: {"answer": " today"}

data: {"answer": " ?"}

data: {"answer": ""}

```

> [!NOTE]
> The `Content-Type` is set to `text/event-stream; charset=utf-8`, indicating the response is an event stream.

The client should decode the response data as server-sent events and display them incrementally. The server will close the HTTP connection after all the data is sent.

Each response event is the delta to the previous event. It's recommended for the client to keep track of the merged data in memory and send them back to the server as chat history in the next request.

### 2. The client sends another chat message, along with the full chat history, to the server

```JSON
POST https://<your-endpoint>.inference.ml.azure.com/score
Content-Type: application/json
Authorization: Bearer <key or token of your endpoint>
Accept: text/event-stream

{
    "question": "Glad to know you!",
    "chat_history": [
        {
            "inputs": {
                "question": "Hello"
            },
            "outputs": {
                "answer": "Hello! How can I assist you today?"
            }
        }
    ]
}
```

### 3. The server sends back the answer in streaming mode

```JSON
HTTP/1.1 200 OK
Content-Type: text/event-stream; charset=utf-8
Connection: close
Transfer-Encoding: chunked

data: {"answer": ""}

data: {"answer": "Nice"}

data: {"answer": " to"}

data: {"answer": " know"}

data: {"answer": " you"}

data: {"answer": " too"}

data: {"answer": "!"}

data: {"answer": " Is"}

data: {"answer": " there"}

data: {"answer": " anything"}

data: {"answer": " I"}

data: {"answer": " can"}

data: {"answer": " help"}

data: {"answer": " you"}

data: {"answer": " with"}

data: {"answer": "?"}

data: {"answer": ""}

```

The chat then continues in a similar way.

## Handle errors

The client should check the HTTP response code first. See [HTTP status code table](../how-to-troubleshoot-online-endpoints.md#http-status-codes) for common error codes returned by online endpoints.

If the response code is "424 Model Error", it means that the error is caused by the model’s code. The error response from a Prompt Flow model always follows this format:

```json
{
  "error": {
    "code": "UserError",
    "message": "Media type text/event-stream in Accept header is not acceptable. Supported media type(s) - application/json",
  }
}
```

- It is always a JSON dictionary with only one key "error" defined.
- The value for "error" is a dictionary, containing "code", "message".
- "code" defines the error category. Currently, it may be "UserError" for bad user inputs and "SystemError" for errors inside the service.
- "message" is a description of the error. It can be displayed to the end user.

## How to consume the server-sent events

### Consume using Python

We have created [a utility file](https://aka.ms/pf-streaming-sample-util) as an example to demonstrate how to consume the server-sent event. A sample usage would like:

```python
try:
    response = requests.post(url, json=body, headers=headers, stream=stream)
    response.raise_for_status()

    content_type = response.headers.get('Content-Type')
    if "text/event-stream" in content_type:
        event_stream = EventStream(response.iter_lines())
        for event in event_stream:
            # Handle event, i.e. print to stdout
    else:
        # Handle json response

except HTTPError:
    # Handle exceptions
```

### Consume using JavaScript

There are several libraries to consume server-sent events in JavaScript. For example, this is the [sse.js library](https://www.npmjs.com/package/sse.js?activeTab=code).

## A sample chat app using Python

Here's a sample chat app written in Python. (To view the source code, see [chat_app.py](https://aka.ms/pf-streaming-sample-chat))

:::image type="content" source="./media/how-to-enable-streaming-mode/chat-app.gif" alt-text="Gif a sample chat app using Python."lightbox ="./media/how-to-enable-streaming-mode/chat-app.gif":::

## Advance usage - hybrid stream and non-stream flow output

Sometimes, you may want to get both stream and non-stream results from a flow output. For example, in the “Chat with Wikipedia” flow, you may want to get not only LLM’s answer, but also the list of URLs that the flow searched. To do this, you need to modify the flow to output a combination of stream LLM’s answer and non-stream URL list.

In the sample "Chat With Wikipedia" flow, the output is connected to the LLM node `augmented_chat`. To add the URL list to the output, you need to add an output field with the name `url` and the value `${get_wiki_url.output}`.

:::image type="content" source="./media/how-to-enable-streaming-mode/chat-wikipedia-dual-output-center.png" alt-text="Screenshot of hybrid chat with Wikipedia flow." lightbox = "./media/how-to-enable-streaming-mode/chat-wikipedia-dual-output-center.png":::

The output of the flow will be a non-stream field as the base and a stream field as the delta. Here's an example of request and response.

### Advance usage - 0. The client sends a message to the server

```JSON
POST https://<your-endpoint>.inference.ml.azure.com/score
Content-Type: application/json
Authorization: Bearer <key or token of your endpoint>
Accept: text/event-stream
{
    "question": "When was ChatGPT launched?",
    "chat_history": []
}
```

### Advance usage - 1. The server sends back the answer in streaming mode

```JSON
HTTP/1.1 200 OK
Content-Type: text/event-stream; charset=utf-8
Connection: close
Transfer-Encoding: chunked

data: {"url": ["https://en.wikipedia.org/w/index.php?search=ChatGPT", "https://en.wikipedia.org/w/index.php?search=GPT-4"]}

data: {"answer": ""}

data: {"answer": "Chat"}

data: {"answer": "G"}

data: {"answer": "PT"}

data: {"answer": " was"}

data: {"answer": " launched"}

data: {"answer": " on"}

data: {"answer": " November"}

data: {"answer": " "}

data: {"answer": "30"}

data: {"answer": ","}

data: {"answer": " "}

data: {"answer": "202"}

data: {"answer": "2"}

data: {"answer": "."}

data: {"answer": " \n\n"}

...

data: {"answer": "PT"}

data: {"answer": ""}
```

### Advance usage - 2. The client sends another chat message, along with the full chat history, to the server

```JSON
POST https://<your-endpoint>.inference.ml.azure.com/score
Content-Type: application/json
Authorization: Bearer <key or token of your endpoint>
Accept: text/event-stream
{
    "question": "When did OpenAI announce GPT-4? How long is it between these two milestones?",
    "chat_history": [
        {
            "inputs": {
                "question": "When was ChatGPT launched?"
            },
            "outputs": {
                "url": [
                    "https://en.wikipedia.org/w/index.php?search=ChatGPT",
                    "https://en.wikipedia.org/w/index.php?search=GPT-4"
                ],
                "answer": "ChatGPT was launched on November 30, 2022. \n\nSOURCES: https://en.wikipedia.org/w/index.php?search=ChatGPT"
            }
        }
    ]
}
```

### Advance usage - 3. The server sends back the answer in streaming mode

```JSON
HTTP/1.1 200 OK
Content-Type: text/event-stream; charset=utf-8
Connection: close
Transfer-Encoding: chunked

data: {"url": ["https://en.wikipedia.org/w/index.php?search=Generative pre-trained transformer ", "https://en.wikipedia.org/w/index.php?search=Microsoft "]}

data: {"answer": ""}

data: {"answer": "Open"}

data: {"answer": "AI"}

data: {"answer": " released"}

data: {"answer": " G"}

data: {"answer": "PT"}

data: {"answer": "-"}

data: {"answer": "4"}

data: {"answer": " in"}

data: {"answer": " March"}

data: {"answer": " "}

data: {"answer": "202"}

data: {"answer": "3"}

data: {"answer": "."}

data: {"answer": " Chat"}

data: {"answer": "G"}

data: {"answer": "PT"}

data: {"answer": " was"}

data: {"answer": " launched"}

data: {"answer": " on"}

data: {"answer": " November"}

data: {"answer": " "}

data: {"answer": "30"}

data: {"answer": ","}

data: {"answer": " "}

data: {"answer": "202"}

data: {"answer": "2"}

data: {"answer": "."}

data: {"answer": " The"}

data: {"answer": " time"}

data: {"answer": " between"}

data: {"answer": " these"}

data: {"answer": " two"}

data: {"answer": " milestones"}

data: {"answer": " is"}

data: {"answer": " approximately"}

data: {"answer": " "}

data: {"answer": "3"}

data: {"answer": " months"}

data: {"answer": ".\n\n"}

...

data: {"answer": "Chat"}

data: {"answer": "G"}

data: {"answer": "PT"}

data: {"answer": ""}
```

## Next steps

- Learn more about how to [troubleshoot managed online endpoints](../how-to-troubleshoot-online-endpoints.md).
- Once you improve your flow, and would like to deploy the improved version with safe rollout strategy, you can refer to [Safe rollout for online endpoints](../how-to-safely-rollout-online-endpoints.md).
