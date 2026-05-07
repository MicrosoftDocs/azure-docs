---
title: "Tutorial: Durable Text Analysis with Azure Files in Azure Functions"
description: Learn how to deploy a Python Azure Functions app that uses Durable Functions to orchestrate parallel text file analysis by using a mounted Azure Files share on a Flex Consumption plan.
ms.service: azure-functions
ms.topic: tutorial
ms.date: 05/04/2026
ms.custom:
  - devx-track-azurecli
  - devx-track-azdevcli
  - devx-track-python
#customer intent: As a developer, I want to deploy a Durable Functions app on the Flex Consumption plan with Azure Files storage mounts so I can analyze multiple text files in parallel without managing infrastructure.
---

# Tutorial: Durable text analysis with a mounted Azure Files share

In this tutorial, you deploy a Python Azure Functions app that uses [Durable Functions](./durable-functions-overview.md) to orchestrate parallel text file analysis. Your function app mounts an Azure Files share, analyzes multiple text files in parallel (fan-out), aggregates the results (fan-in), and returns them to the caller. This approach demonstrates a key advantage of storage mounts: shared file access across multiple function instances without per-request network overhead.

In this tutorial, you:

> [!div class="checklist"]
> * Use Azure Developer CLI to deploy a Durable Functions app in a Flex Consumption plan with a mounted Azure Files share
> * Trigger an orchestration to process sample text files in parallel
> * Verify the aggregated analysis results

[!INCLUDE [functions-azure-files-samples-note](../../../includes/functions-azure-files-samples-note.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/install-azd) version 1.9.0 or later
- [Git](https://git-scm.com/)

The CLI examples in this tutorial use Bash syntax and have been tested in [Azure Cloud Shell](/azure/cloud-shell/overview) (Bash) and Linux/macOS terminals.

## Initialize the sample project

You can find the sample code for this tutorial in the [Azure Functions Flex Consumption with Azure Files OS Mount Samples](https://github.com/Azure-Samples/Azure-Functions-Flex-Consumption-with-Azure-Files-OS-Mount-Samples) GitHub repository. The `durable-text-analysis` folder contains the function app code, a Bicep template that provisions the required Azure resources, and a post-deployment script that uploads sample text files.

1. Open a terminal and go to the directory where you want to clone the repository.

1. Clone the repository:

    ```bash
    git clone https://github.com/Azure-Samples/Azure-Functions-Flex-Consumption-with-Azure-Files-OS-Mount-Samples.git
    ```

1. Go to the project folder:

    ```bash
    cd Azure-Functions-Flex-Consumption-with-Azure-Files-OS-Mount-Samples/durable-text-analysis
    ```

1. Initialize the `azd` environment. When prompted, enter an environment name such as `durable-text`:

    ```bash
    azd init
    ```

## Review the code

The three key pieces that make this sample work are the infrastructure that creates the mount, the script that uploads sample files, and the function code that orchestrates the analysis.

At runtime, the orchestration follows this flow:

1. An HTTP POST to `/api/start-analysis` starts the Durable Functions orchestration.
1. The orchestrator calls the `list_text_files` activity to find all `.txt` files on the mount.
1. The orchestrator fans out, calling `analyse_text_file` for each file in parallel.
1. Once all parallel tasks complete, the orchestrator calls `aggregate_results` to merge per-file metrics into a single summary.
1. The aggregated result is returned as the orchestration output.

### [Mount configuration (Bicep)](#tab/mount-config)

The `mounts.bicep` module configures an Azure Files SMB mount on the function app. The `mountPath` value determines the local path where files appear at runtime. You pass the storage account access key as a parameter, and the platform resolves it at runtime through a Key Vault reference:

:::code language="bicep" source="~/functions-flex-azure-files-samples/durable-text-analysis/infra/app/mounts.bicep" :::

Because Azure Files SMB mounts don't yet support managed identity authentication, you need a storage account key. As a best practice, store this key in Azure Key Vault and use a [Key Vault reference](/azure/app-service/app-service-key-vault-references) in an app setting. The mount configuration references that app setting by using `@AppSettingRef()`, so the key never appears in your Bicep templates. The `keyvault.bicep` module creates the vault, stores the key, and grants RBAC roles:

:::code language="bicep" source="~/functions-flex-azure-files-samples/durable-text-analysis/infra/app/keyvault.bicep" :::

The `main.bicep` file invokes the mount and Key Vault modules:

:::code language="bicep" source="~/functions-flex-azure-files-samples/durable-text-analysis/infra/main.bicep" range="173-206" :::

### [Post-deployment script](#tab/post-deploy-script)

After `azd up` deploys the infrastructure and code, a post-deployment script creates sample text files, uploads them to the Azure Files share, and runs a health check:

:::code language="bash" source="~/functions-flex-azure-files-samples/durable-text-analysis/scripts/post-up.sh" range="33-88" :::

### [Function code](#tab/function-code)

The HTTP starter in `function_app.py` starts a Durable Functions orchestration. The orchestrator in `orchestrator.py` lists all `.txt` files on the mount, fans out to analyze each file in parallel, and aggregates the results:

:::code language="python" source="~/functions-flex-azure-files-samples/durable-text-analysis/src/orchestrator.py" :::

Each activity function reads directly from the mounted share by using standard file I/O. It doesn't need any SDK or network calls:

:::code language="python" source="~/functions-flex-azure-files-samples/durable-text-analysis/src/activities.py" range="30-51" :::

---

## Deploy by using Azure Developer CLI

This sample is an [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/overview) template. A single `azd up` command provisions infrastructure, deploys the function code, and uploads sample text files to the Azure Files share.

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

    - Creates a resource group, storage account, Key Vault, Flex Consumption function app with a Durable Functions configuration, Application Insights instance, and managed identity
    - Deploys the Python function code
    - Uploads sample text files to the Azure Files share
    - Runs a health check

    > [!NOTE]
    > Because Azure Files SMB mounts don't yet support managed identity authentication, you need a storage account key. As a best practice, the deployment stores this key in [Azure Key Vault](/azure/key-vault/general/overview) and uses a [Key Vault reference](/azure/app-service/app-service-key-vault-references) so the key is never exposed in app settings. This approach provides centralized secret management, auditing, and support for key rotation.

    The deployment takes a few minutes. When it completes, you see a summary of the created resources.

1. Save resource names as shell variables for the remaining steps:

    ```bash
    RESOURCE_GROUP=$(azd env get-value AZURE_RESOURCE_GROUP)
    FUNCTION_APP_NAME=$(azd env get-value AZURE_FUNCTION_APP_NAME)
    FUNCTION_APP_URL=$(azd env get-value AZURE_FUNCTION_APP_URL)
    ```

## Trigger the orchestration

1. Get the function host key:

    ```azurecli
    HOST_KEY=$(az functionapp keys list \
      --resource-group $RESOURCE_GROUP \
      --name $FUNCTION_APP_NAME \
      --query "functionKeys.default" \
      -o tsv)
    ```

1. Start the orchestration. You can optionally pass a JSON body with `{"mount_path": "/mounts/data/"}` to override the default mount path:

    ```bash
    curl -s -X POST "${FUNCTION_APP_URL}/api/start-analysis?code=${HOST_KEY}" | jq .
    ```

    The response includes an instance ID and management URIs you can use to check status, send events, or terminate the orchestration:

    ```json
    {
      "id": "abc123def456",
      "statusQueryGetUri": "https://<your-app>.azurewebsites.net/...",
      "sendEventPostUri": "https://...",
      "terminatePostUri": "https://..."
    }
    ```

## Verify results

1. Check orchestration status by using the `statusQueryGetUri` from the trigger response:

    ```bash
    STATUS_URL="<statusQueryGetUri-from-trigger-response>"

    curl -s "${STATUS_URL}" | jq .
    ```

    While the orchestration is running, the `runtimeStatus` is `Running`. When complete, the response looks like:

    ```json
    {
      "instanceId": "abc123def456",
      "runtimeStatus": "Completed",
      "output": {
        "total_files": 3,
        "total_words": 45,
        "total_lines": 12,
        "total_chars": 303,
        "overall_avg_word_length": 4.82,
        "overall_top_characters": [["e", 42], ["t", 38], ["a", 35]],
        "per_file": [
          {
            "file_path": "/mounts/data/sample1.txt",
            "word_count": 15,
            "line_count": 4,
            "char_count": 98,
            "avg_word_length": 5.1,
            "top_characters": [["e", 14], ["t", 12]]
          },
          {
            "file_path": "/mounts/data/sample2.txt",
            "word_count": 18,
            "line_count": 5,
            "char_count": 120,
            "avg_word_length": 4.6,
            "top_characters": [["a", 16], ["e", 15]]
          },
          {
            "file_path": "/mounts/data/sample3.txt",
            "word_count": 12,
            "line_count": 3,
            "char_count": 85,
            "avg_word_length": 4.9,
            "top_characters": [["e", 13], ["t", 11]]
          }
        ]
      }
    }
    ```

    The app also exposes a convenience endpoint at `/api/status/{instance_id}` that returns a simplified status response.

> [!TIP]
> Your function app accesses all three files in parallel through the storage mount. The app doesn't need any per-request network calls. The function reads them directly from the mounted share by using standard file I/O. This approach demonstrates the power of storage mounts combined with Durable Functions.

## Clean up resources

To avoid ongoing charges, delete all the resources created by this tutorial:

```bash
azd down --purge
```

> [!WARNING]
> This command deletes the resource group and all resources in it, including the function app, storage account, and Application Insights instance.

## Related content

- [Durable Functions overview](./durable-functions-overview.md)
- [Choose a file access strategy for Azure Functions](../concept-file-access-options.md)
- [Tutorial: Process images by using FFmpeg on a mounted Azure Files share](../tutorial-ffmpeg-processing-azure-files.md)
- [Flex Consumption plan](../flex-consumption-plan.md)
- [Storage considerations for Azure Functions](../storage-considerations.md)
