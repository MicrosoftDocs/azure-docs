---
title: "Tutorial: Process images by using FFmpeg on a mounted Azure Files share in Azure Functions"
description: Learn how to deploy a Python Azure Functions app that uses an ffmpeg binary hosted on a mounted Azure Files share to process images on a Flex Consumption plan.
ms.topic: tutorial
ms.date: 03/24/2026
ms.custom:
  - devx-track-azurecli
  - devx-track-azdevcli
  - devx-track-python
#customer intent: As a developer, I want to host large third-party binaries like ffmpeg on a mounted Azure Files share so I can keep my function deployment small and cold starts fast.
---

# Tutorial: Process images by using FFmpeg on a mounted Azure Files share

In this tutorial, you deploy a Python app that uses an ffmpeg binary on a mounted Azure Files share to process images in Azure Functions. When you upload an image to the container, the function triggers, calls ffmpeg from the mount to convert the image, and saves the result back to storage. By hosting large binaries like ffmpeg on a mounted share instead of in your deployment package, you keep deployments small and cold starts fast.

In this tutorial, you:

> [!div class="checklist"]
> * Deploy a Flex Consumption function app with a mounted Azure Files share by using Azure Developer CLI
> * Upload a sample image to trigger blob-based processing
> * Verify that the function called ffmpeg from the mount and saved the converted image

[!INCLUDE [functions-azure-files-samples-note](../../includes/functions-azure-files-samples-note.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/install-azd) version 1.9.0 or later
- [Git](https://git-scm.com/)

The CLI examples in this tutorial use Bash syntax and are tested in [Azure Cloud Shell](/azure/cloud-shell/overview) (Bash) and Linux/macOS terminals.

## Initialize the sample project

The sample code for this tutorial is in the [Azure Functions Flex Consumption with Azure Files OS Mount Samples](https://github.com/Azure-Samples/Azure-Functions-Flex-Consumption-with-Azure-Files-OS-Mount-Samples) GitHub repository. The `ffmpeg-image-processing` folder contains the function app code, a Bicep template that provisions the required Azure resources, and a post-deployment script that uploads the ffmpeg binary.

1. Open a terminal and go to the directory where you want to clone the repository.

1. Clone the repository:

    ```bash
    git clone https://github.com/Azure-Samples/Azure-Functions-Flex-Consumption-with-Azure-Files-OS-Mount-Samples.git
    ```

1. Go to the project folder:

    ```bash
    cd Azure-Functions-Flex-Consumption-with-Azure-Files-OS-Mount-Samples/ffmpeg-image-processing
    ```

1. Initialize the `azd` environment. When prompted, enter an environment name such as `ffmpeg-processing`:

    ```bash
    azd init
    ```

## Review the code

The three key pieces that make OS mount–based processing work are the infrastructure that creates the mount, the script that uploads the binary, and the function code that calls it.

### [Mount configuration (Bicep)](#tab/mount-config)

The `mounts.bicep` module configures an Azure Files SMB mount on the function app. The `mountPath` value determines the local path where files appear at runtime. You pass the storage account access key as a parameter, and the platform resolves it at runtime through a Key Vault reference:

:::code language="bicep" source="~/functions-flex-azure-files-samples/ffmpeg-image-processing/infra/app/mounts.bicep" :::  

Because Azure Files SMB mounts don't yet support managed identity authentication, you need a storage account key. As a best practice, store this key in Azure Key Vault and use a [Key Vault reference](/azure/app-service/app-service-key-vault-references) in an app setting. The mount configuration references that app setting by using `@AppSettingRef()`, so the key never appears in your Bicep templates. The `keyvault.bicep` module creates the vault, stores the key, and grants RBAC roles:

:::code language="bicep" source="~/functions-flex-azure-files-samples/ffmpeg-image-processing/infra/app/keyvault.bicep" :::

The `main.bicep` file invokes the mount and Key Vault modules:

:::code language="bicep" source="~/functions-flex-azure-files-samples/ffmpeg-image-processing/infra/main.bicep" range="195-229" :::

### [Post-deployment script](#tab/post-deploy-script)

After `azd up` deploys the infrastructure and code, a post-deployment script downloads the FFmpeg static binary and uploads it to the Azure Files share. It also creates the Event Grid subscription and runs a health check:

:::code language="bash" source="~/functions-flex-azure-files-samples/ffmpeg-image-processing/scripts/post-up.sh" range="33-65" :::

### [Function code](#tab/function-code)

The function reads the mount path from an environment variable (`FFMPEG_PATH`) set in the Bicep template. It calls `process_with_ffmpeg`, which runs the binary as a subprocess against the input image bytes:

:::code language="python" source="~/functions-flex-azure-files-samples/ffmpeg-image-processing/src/function_app.py" range="19-54" :::

---

## Deploy by using Azure Developer CLI

This sample is an [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/overview) template. A single `azd up` command provisions infrastructure, deploys the function code, uploads the ffmpeg binary to Azure Files, and creates the Event Grid subscription for blob triggers.

1. Sign in to Azure. The post-deployment script uses Azure CLI commands, so you need to authenticate by using both tools:

    ```bash
    azd auth login
    az login
    ```

1. Provision and deploy everything:

    ```bash
    azd up
    ```

    When prompted, select the Azure subscription and location to use. The command then:

    - Creates a resource group, storage account, Key Vault, Flex Consumption function app, Application Insights instance, and managed identity.
    - Deploys the Python function code.
    - Downloads and uploads the ffmpeg binary to the Azure Files share.
    - Creates an Event Grid subscription so blob uploads trigger your function.
    - Runs a health check.

    > [!NOTE]
    > Because Azure Files SMB mounts don't yet support managed identity authentication, a storage account key is required. As a best practice, the deployment stores this key in [Azure Key Vault](/azure/key-vault/general/overview) and uses a [Key Vault reference](/azure/app-service/app-service-key-vault-references) so the key is never exposed in app settings. This approach provides centralized secret management, auditing, and support for key rotation.

    The deployment takes a few minutes. When it completes, you see a summary of the created resources.

1. Save resource names as shell variables for the remaining steps:

    ```bash
    RESOURCE_GROUP=$(azd env get-value AZURE_RESOURCE_GROUP)
    STORAGE_ACCOUNT=$(azd env get-value AZURE_STORAGE_ACCOUNT_NAME)
    FUNCTION_APP_NAME=$(azd env get-value AZURE_FUNCTION_APP_NAME)
    INPUT_CONTAINER=$(azd env get-value AZURE_STORAGE_INPUT_CONTAINER)
    OUTPUT_CONTAINER=$(azd env get-value AZURE_STORAGE_OUTPUT_CONTAINER)
    ```

## Process an image

1. Upload the sample image included in the repository to the input container. The Event Grid subscription created during deployment automatically triggers your function when a blob is uploaded.

    ```azurecli
    az storage blob upload \
      --container-name $INPUT_CONTAINER \
      --name sample_image.png \
      --file sample_image.png \
      --account-name $STORAGE_ACCOUNT \
      --auth-mode login
    ```

    > [!TIP]
    > If the trigger doesn't fire immediately, wait 10-15 seconds, and then check the function's execution logs in the Azure portal.

1. Verify the function processed the image by listing the blobs in the output container:

    ```azurecli
    az storage blob list \
      --container-name $OUTPUT_CONTAINER \
      --account-name $STORAGE_ACCOUNT \
      --auth-mode login \
      -o table
    ```

    You should see `sample_image.jpg` in the output container.

1. Download the converted image:

    ```azurecli
    az storage blob download \
      --container-name $OUTPUT_CONTAINER \
      --name sample_image.png \
      --file ./output_image.png \
      --account-name $STORAGE_ACCOUNT \
      --auth-mode login
    ```

> [!NOTE]
> The first execution might be slightly slower (cold start). Subsequent invocations are faster because the function container stays warm and ffmpeg is cached. To minimize cold starts, consider enabling [always-ready instances](./flex-consumption-plan.md#always-ready-instances).

## Clean up resources

To avoid ongoing charges, delete all the resources created by this tutorial:

```bash
azd down --purge
```

> [!WARNING]
> This command deletes the resource group and all resources in it, including the function app, storage account, and Application Insights instance.

## Related content

- [Choose a file access strategy for Azure Functions](./concept-file-access-options.md)
- [Tutorial: Durable text analysis with a mounted Azure Files share](./durable-functions/tutorial-durable-text-analysis-azure-files.md)
- [Flex Consumption plan](./flex-consumption-plan.md)
- [Storage considerations for Azure Functions](./storage-considerations.md)
