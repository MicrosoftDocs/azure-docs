```markdown
---
title: "Tutorial: FastAPI chatbot with SLM extension"
description: "Learn how to deploy a FastAPI application integrated with a Phi-3 sidecar extension on Azure App Service."
author: "cephalin"
ms.author: "cephalin"
ms.date: "2025-05-06"
ms.topic: tutorial
ms.service: app-service
---

# Tutorial: Run chatbot in App Service with a Phi-3 sidecar extension (FastAPI)
This tutorial guides you through deploying a FastAPI-based chatbot application integrated with the Phi-3 sidecar extension on Azure App Service. By following the steps, you'll learn how to set up a scalable web app, add an AI-powered sidecar for enhanced conversational capabilities, and test the chatbot's functionality.

Hosting your own small language model (SLM) offers several advantages:

- By hosting the model yourself, you maintain full control over your data. This ensures sensitive information is not exposed to third-party services, which is critical for industries with strict compliance requirements.
- Self-hosted models can be fine-tuned to meet specific use cases or domain-specific requirements. 
- Hosting the model close to your application or users minimizes network latency, resulting in faster response times and a better user experience.
- You can scale the deployment based on your specific needs and have full control over resource allocation, ensuring optimal performance for your application.
- Hosting your own model allows for greater flexibility in experimenting with new features, architectures, or integrations without being constrained by third-party service limitations.

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/) with an active subscription.
- A [GitHub account](https://github.com/).

## Deploy the sample application

1. In the browser, navigate to the [sample application repository](https://github.com/cephalin/sidecar-samples).
2. Start a new Codespace from the repository.
1. Log in with your Azure account:

    ```azurecli
    az login
    ```

1. Open the terminal in the Codespace and run the following commands:

    ```azurecli
    cd fastapiapp
    az webapp up --sku P3MV3
    az webapp config set --startup-file "gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app"
    ```

This startup command is a common setup for deploying FastAPI applications to Azure App Service. For more information, see [Quickstart: Deploy a Python (Django, Flask, or FastAPI) web app to Azure App Service](quickstart-python.md).

## Add the Phi-3 sidecar extension

In this section, you add the Phi-3 sidecar extension to your FastAPI application hosted on Azure App Service.

1. Navigate to the Azure portal and go to your app's management page.
2. In the left-hand menu, select **Deployment** > **Deployment Center**.
3. On the **Containers** tab, select **Add** > **Sidecar extension**.
4. In the sidecar extension options, select **AI: phi-3-mini-4k-instruct-q4-gguf (Experimental)**.
5. Provide a name for the sidecar extension.
6. Select **Save** to apply the changes.
7. Wait a few minutes for the sidecar extension to deploy. Keep selecting **Refresh** until the **Status** column shows **Running**.

## Test the chatbot

1. In your app's management page, in the left-hand menu, select **Overview**.
1. Under **Default domain**, select the URL to open your web app in a browser.
1. Verify that the chatbot application is running and responding to user inputs.

    :::image type="content" source="media/tutorial-ai-slm-dotnet/fashion-store-assistant-live.png" alt-text="screenshot showing the fashion assistant app running in the browser.":::

## How the sample application works

The sample application demonstrates how to integrate a FastAPI-based service with the SLM sidecar extension. The `SLMService` class encapsulates the logic for sending requests to the SLM API and processing the streamed responses. This integration enables the application to generate conversational responses dynamically.

Looking in https://github.com/cephalin/sidecar-samples/blob/webstacks/fastapiapp/app/services/slm_service.py, you see that:

- The service sends a POST request to the SLM endpoint `http://localhost:11434/v1/chat/completions`.

    ```python
    self.api_url = 'http://localhost:11434/v1/chat/completions'
    ```
- The POST payload includes the system message and the prompt that's built from the selected product and the user query.

    ```python
    request_payload = {
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        "stream": True,
        "cache_prompt": False,
        "n_predict": 2048  # Increased token limit to allow longer responses
    }
    ```

- The POST request [streams the response](https://www.python-httpx.org/async/#streaming-responses) line by line. Each line is parsed to extract the generated content (or token).

    ```python
    async with httpx.AsyncClient() as client:
        async with client.stream(
            "POST", 
            self.api_url,
            json=request_payload,
            headers={"Content-Type": "application/json"},
            timeout=30.0
        ) as response:
            async for line in response.aiter_lines():
                if not line or line == "[DONE]":
                    continue
                
                if line.startswith("data: "):
                    line = line.replace("data: ", "").strip()
                    
    
                try:
                    json_obj = json.loads(line)
                    if "choices" in json_obj and len(json_obj["choices"]) > 0:
                        delta = json_obj["choices"][0].get("delta", {})
                        content = delta.get("content")
                        if content:
                            yield content
    ```

## Next steps
