---
title: "Tutorial: Express.js chatbot with SLM extension"
description: "Learn how to deploy a Express.js application integrated with a Phi-4 sidecar extension on Azure App Service."
author: cephalin
ms.author: cephalin
ms.date: 05/07/2025
ms.topic: tutorial
ms.custom:
  - build-2025
---

# Tutorial: Run chatbot in App Service with a Phi-4 sidecar extension (Express.js)

This tutorial guides you through deploying a Express.js-based chatbot application integrated with the Phi-4 sidecar extension on Azure App Service. By following the steps, you'll learn how to set up a scalable web app, add an AI-powered sidecar for enhanced conversational capabilities, and test the chatbot's functionality.

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
    cd use_sidecar_extension/expressapp
    az webapp up --sku P3MV3
    ```

This startup command is a common setup for deploying Express.js applications to Azure App Service. For more information, see [Deploy a Node.js web app in Azure](quickstart-nodejs.md).

[!INCLUDE [phi-4-extension-create-test](includes/tutorial-ai-slm/phi-4-extension-create-test.md)]

## How the sample application works

The sample application demonstrates how to integrate a Express.js-based service with the SLM sidecar extension. The `SLMService` class encapsulates the logic for sending requests to the SLM API and processing the streamed responses. This integration enables the application to generate conversational responses dynamically.

Looking in [use_sidecar_extension/expressapp/src/services/slm_service.js](https://github.com/Azure-Samples/ai-slm-in-app-service-sidecar/blob/main/use_sidecar_extension/expressapp/src/services/slm_service.js), you see that:

- The service sends a POST request to the SLM endpoint `http://127.0.0.1:11434/v1/chat/completions`.

    ```javascript
    this.apiUrl = 'http://127.0.0.1:11434/v1/chat/completions';
    ```

- The POST payload includes the system message and the prompt that's built from the selected product and the user query.

    ```javascript
    const requestPayload = {
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
      stream: true,
      cache_prompt: false,
      n_predict: 2048 // Increased token limit to allow longer responses
    };
    ```

- The POST request streams the response line by line. Each line is parsed to extract the generated content (or token).

    ```javascript
    // Set up Server-Sent Events headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const response = await axios.post(this.apiUrl, requestPayload, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'stream'
    });

    response.data.on('data', (chunk) => {
      const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        let parsedLine = line;
        if (line.startsWith('data: ')) {
          parsedLine = line.replace('data: ', '').trim();
        }
        
        if (parsedLine === '[DONE]') {
          return;
        }
        
        try {
          const jsonObj = JSON.parse(parsedLine);
          if (jsonObj.choices && jsonObj.choices.length > 0) {
            const delta = jsonObj.choices[0].delta || {};
            const content = delta.content;
            
            if (content) {
              // Use non-breaking space to preserve formatting
              const formattedToken = content.replace(/ /g, '\u00A0');
              res.write(`data: ${formattedToken}\n\n`);
            }
          }
        } catch (parseError) {
          console.warn(`Failed to parse JSON from line: ${parsedLine}`);
        }
      }
    });
    ```

[!INCLUDE [faq](includes/tutorial-ai-slm/faq.md)]

## Next steps

[Tutorial: Configure a sidecar container for a Linux app in Azure App Service](tutorial-sidecar.md)
