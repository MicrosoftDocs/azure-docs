---
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 05/07/2025
ms.author: cephalin
ms.custom:
  - build-2025
---

## Frequently asked questions

- [How does pricing tier affect the performance of the SLM sidecar?](#how-does-pricing-tier-affect-the-performance-of-the-slm-sidecar)
- [How to use my own SLM sidecar?](#how-to-use-my-own-slm-sidecar)

---

### How does pricing tier affect the performance of the SLM sidecar?

Since AI models consume considerable resources, choose the pricing tier that gives you sufficient vCPUs and memory to run your specific model. For this reason, the built-in AI sidecar extensions only appear when the app is in a suitable pricing tier. If you build your own SLM sidecar container, you should also use a CPU-optimized model, since the App Service pricing tiers are CPU-only tiers.

For example, the [Phi-3 mini model with a 4K context length from Hugging Face](https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-onnx) is designed to run with limited resources and provides strong math and logical reasoning for many common scenarios. It also comes with a CPU-optimized version. In App Service, we tested the model on all premium tiers and found it to perform well in the [P2mv3](https://azure.microsoft.com/pricing/details/app-service/linux/) tier or higher. If your requirements allow, you can run it on a lower tier.

---

### How to use my own SLM sidecar?

The sample repository contains a sample SLM container that you can use as a sidecar. It runs a FastAPI application that listens on port 8000, as specified in its [Dockerfile](https://github.com/Azure-Samples/ai-slm-in-app-service-sidecar/blob/main/bring_your_own_slm/src/phi-3-sidecar/Dockerfile). The application uses [ONNX Runtime](https://onnxruntime.ai/docs/) to load the Phi-3 model, then forwards the HTTP POST data to the model and streams the response from the model back to the client. For more information, see [model_api.py](https://github.com/Azure-Samples/ai-slm-in-app-service-sidecar/blob/main/src/phi-3-sidecar/model_api.py).

To build the sidecar image yourself, you need to install Docker Desktop locally on your machine.

1. Clone the repository locally.

    ```bash
    git clone https://github.com/Azure-Samples/ai-slm-in-app-service-sidecar
    cd ai-slm-in-app-service-sidecar
    ```

1. Change into the Phi-3 image's source directory and download the model locally using the [Huggingface CLI](https://huggingface.co/docs/huggingface_hub/guides/cli).

    ```bash
    cd bring_your_own_slm/src/phi-3-sidecar
    huggingface-cli download microsoft/Phi-3-mini-4k-instruct-onnx --local-dir ./Phi-3-mini-4k-instruct-onnx
    ```
    
    The [Dockerfile](https://github.com/Azure-Samples/ai-slm-in-app-service-sidecar/blob/main/src/phi-3-sidecar/Dockerfile) is configured to copy the model from *./Phi-3-mini-4k-instruct-onnx*.
    
1. Build the Docker image. For example:

    ```bash
    docker build --tag phi-3 .
    ```

1. Upload the built image to Azure Container Registry with [Push your first image to your Azure container registry using the Docker CLI](/azure/container-registry/container-registry-get-started-docker-cli).

1. In the **Deployment Center** > **Containers (new)** tab, select **Add** > **Custom container** and configure the new container as follows:
    - **Name**: *phi-3*
    - **Image source**: **Azure Container Registry**
    - **Registry**: your registry
    - **Image**: the uploaded image
    - **Tag**: the image tag you want
    - **Port**: *8000*
1. Select **Apply**.

See [bring_your_own_slm/src/webapp](https://github.com/Azure-Samples/ai-slm-in-app-service-sidecar/blob/main/bring_your_own_slm/src/webapp) for a sample application that interacts with this custom sidecar container.