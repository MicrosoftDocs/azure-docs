---
title: "Tutorial: FastAPI chatbot with SLM extension"
description: "Learn how to deploy a FastAPI application integrated with a Phi-4 sidecar extension on Azure App Service."
author: cephalin
ms.author: cephalin
ms.date: 05/07/2025
ms.topic: tutorial
ms.custom:
  - build-2025
---

# Tutorial: Run chatbot in App Service with a Phi-4 sidecar extension (FastAPI)

This tutorial guides you through deploying a FastAPI-based chatbot application integrated with the Phi-4 sidecar extension on Azure App Service. By following the steps, you'll learn how to set up a scalable web app, add an AI-powered sidecar for enhanced conversational capabilities, and test the chatbot's functionality.

[!INCLUDE [advantages](includes/tutorial-ai-slm/advantages.md)]

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/) with an active subscription.
- A [GitHub account](https://github.com/).

## Deploy the sample application

1. In the browser, navigate to the [sample application repository](https://github.com/Azure-Samples/ai-slm-in-app-service-sidecar).
2. Start a new Codespace from the repository.
1. Log in with your Azure account:

    ```azurecli
    az login
    ```

1. Open the terminal in the Codespace and run the following commands:

    ```azurecli
    cd use_sidecar_extension/fastapiapp
    az webapp up --sku P3MV3
    az webapp config set --startup-file "gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app"
    ```

This startup command is a common setup for deploying FastAPI applications to Azure App Service. For more information, see [Quickstart: Deploy a Python (Django, Flask, or FastAPI) web app to Azure App Service](quickstart-python.md).

[!INCLUDE [phi-4-extension-create-test](includes/tutorial-ai-slm/phi-4-extension-create-test.md)]

## How the sample application works

The sample application demonstrates how to integrate a FastAPI-based service with the SLM sidecar extension. The `SLMService` class encapsulates the logic for sending requests to the SLM API and processing the streamed responses. This integration enables the application to generate conversational responses dynamically.

Looking in [use_sidecar_extension/fastapiapp/app/services/slm_service.py](https://github.com/Azure-Samples/ai-slm-in-app-service-sidecar/blob/main/use_sidecar_extension/fastapiapp/app/services/slm_service.py), you see that:

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

[!INCLUDE [faq](includes/tutorial-ai-slm/faq.md)]

## Next steps

[Tutorial: Configure a sidecar container for a Linux app in Azure App Service](tutorial-sidecar.md)
