---
title: Start with the Azure CLI extension
titleSuffix: AI Gateway
description: Install the AI Gateway Azure CLI extension, create or select a gateway, import Foundry models, and send a model request.
ms.service: azure
ms.topic: quickstart
ms.date: 10/25/2026
---

# Start with the Azure CLI extension

[!INCLUDE [ai-gateway-preview](./includes/preview.md)]

Use the `aigateway` Azure CLI extension to give applications access to existing Microsoft Foundry model deployments through a shared gateway.

This quickstart introduces the `az aigateway` commands and walks you through your first model request from a Bash or PowerShell terminal.

## Prerequisites

- [Azure CLI version 2.75.0 or later](/cli/azure/install-azure-cli).
- An Azure subscription and an existing resource group.
- The `Microsoft.ApiManagement` resource provider registered in your subscription. See [Register a resource provider](/azure/azure-resource-manager/management/resource-providers-and-types#register-resource-provider).
- The **Contributor** role on the resource group.
    - To use an existing gateway, you need **Contributor** on that gateway, or equivalent permissions.
    - Ensure that your AI Gateway resource is of type `Microsoft.ApiManagement/gateways` or [you have migrated to it](ai-gateway-resource.md).
- A Microsoft Foundry account in the same subscription with at least one deployed model that supports Chat Completions and a publicly accessible backend endpoint.
- The **Reader** and **User Access Administrator** roles on the Foundry account, or equivalent inherited access, to discover deployments and grant the gateway identity access.
- A Bash terminal with `curl`, or a PowerShell terminal. The Bash installer also requires `shasum` or `sha256sum`.

This example uses a Foundry account named `ai-foundry-demo-learn` with a `gpt-6.1-sol` deployment. Model requests can incur inference charges.

## Install the extension

Use the installer from the [AI Gateway CLI repository](https://github.com/Azure/ai-gateway/blob/main/cli/README.md#install). Choose the command for your shell:

### [Bash](#tab/bash)

```bash
curl -fsSL https://aka.ms/aigateway-cli-install | sh
```

### [PowerShell](#tab/powershell)

```powershell
irm https://aka.ms/aigateway-cli-install-ps | iex
```

---

The installers download the published release, verify its SHA-256 checksum, and install or upgrade the `aigateway` extension. Installation requires HTTPS access and permission to write to your Azure CLI extension directory, but doesn't require an Azure sign-in. To review the scripts before running them, see [install.sh](https://github.com/Azure/ai-gateway/blob/main/cli/install.sh) or [install.ps1](https://github.com/Azure/ai-gateway/blob/main/cli/install.ps1).

Check the installation and available commands:

```azurecli
az aigateway version
az aigateway --help
```

We recommend migrating gateways on the earlier `Microsoft.ApiManagement/service` resource type with the AIGateway SKU to `Microsoft.ApiManagement/aigateways`. Complete migration before January 15, 2027. Follow [Migrate to AI Gateway resource type](./ai-gateway-resource.md) to re-create the configuration and update clients. Installing or upgrading the extension doesn't migrate a gateway.

## Create or select your gateway

Create a test gateway or select an existing `Microsoft.ApiManagement/aigateways` resource with public runtime access:

1. Sign in and select the subscription that contains your gateway and Foundry account:

   ```azurecli
   az login
   az account set --subscription "<subscription-id>"
   ```

1. Set the default resource group to the group that contains, or will contain, your gateway:

   ```azurecli
   az configure --defaults group="<gateway-resource-group>"
   ```

   Gateway commands use this default throughout the quickstart. Foundry commands specify their own resource group. The default persists until you change or clear it.

1. Set the gateway name and the other resource names. Use an existing gateway's name or choose a name for a new gateway. Replace the Foundry values with your own, and choose unused provider and key names:

   ### [Bash](#tab/bash)

   ```bash
   GATEWAY="aigw-demo-learn"
   FOUNDRY_RG="aigw-microsoft-learn-docs"
   FOUNDRY_ACCOUNT="ai-foundry-demo-learn"
   KEY_NAME="cli-quickstart-app"
   ```

   ### [PowerShell](#tab/powershell)

   ```powershell
   $GATEWAY = "aigw-demo-learn"
   $FOUNDRY_RG = "aigw-microsoft-learn-docs"
   $FOUNDRY_ACCOUNT = "ai-foundry-demo-learn"
   $KEY_NAME = "cli-quickstart-app"
   ```


1. If you need a new gateway, create it in a supported region. If you selected an existing gateway, continue to the gateway check:

   ### [Bash](#tab/bash)

   ```azurecli
   az aigateway create \
     --name "$GATEWAY" \
     --location eastus2 \
     --system-assigned true
   ```

   ### [PowerShell](#tab/powershell)

   ```powershell
   az aigateway create `
     --name $GATEWAY `
     --location eastus2 `
     --system-assigned true
   ```


1. Check the gateway you created or selected:

   ### [Bash](#tab/bash)

   ```azurecli
   az aigateway show --name "$GATEWAY"
   ```

   ### [PowerShell](#tab/powershell)

   ```powershell
   az aigateway show --name $GATEWAY
   ```


1. Confirm that `type` is `Microsoft.ApiManagement/aigateways` and `properties.provisioningState` is `Succeeded`.

   ```output
   {
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/aigw-microsoft-learn-docs/providers/Microsoft.ApiManagement/aigateways/aigw-demo-learn",
      "identity": {
        "principalId": "00000000-1111-1111-1111-000000000000",
        "tenantId": "00000000-1111-1111-1111-000000000000",
        "type": "SystemAssigned"
      },
      "location": "eastus2",
      "name": "aigw-demo-learn",
      "properties": {
        "frontend": {
          "defaultHostname": "aigw-demo-learn.eastus2-01.ai.gateway.azure.com"
        },
        "provisioningState": "Succeeded"
      },
      "resourceGroup": "aigw-microsoft-learn-docs",
      "sku": {
        "name": "Premium"
      },
      "tags": {},
      "type": "Microsoft.ApiManagement/aigateways"
   }
   ```


## Import Foundry models

Connect models from Microsoft Foundry to use them in your gateway. The import command enables the gateway's system-assigned managed identity, grants it **Foundry User** on the account, and registers the account's current deployments under one provider.

To import your Foundry deployments:

1. Look up the Foundry account's resource ID. Use the account name, not a project or deployment name:

   ### [Bash](#tab/bash)

   ```bash
   FOUNDRY_RESOURCE_ID="$(az cognitiveservices account show \
     --resource-group "$FOUNDRY_RG" --name "$FOUNDRY_ACCOUNT" \
     --query id --output tsv)"
   ```

   ### [PowerShell](#tab/powershell)

   ```powershell
   $FOUNDRY_RESOURCE_ID = az cognitiveservices account show `
     --resource-group $FOUNDRY_RG --name $FOUNDRY_ACCOUNT `
     --query id --output tsv
   ```


1. Import the deployments:

   ### [Bash](#tab/bash)

   ```azurecli
   az aigateway model-provider create \
     --gateway-name "$GATEWAY" \
     --name "$FOUNDRY_ACCOUNT" \
     --foundry-resource-id "$FOUNDRY_RESOURCE_ID"
   ```

   ### [PowerShell](#tab/powershell)

   ```powershell
   az aigateway model-provider create `
     --gateway-name $GATEWAY `
     --name $FOUNDRY_ACCOUNT `
     --foundry-resource-id $FOUNDRY_RESOURCE_ID
   ```


1. Review the import summary for failed registrations before continuing. Keep the returned `roleAssignmentId` for the cleanup review. Allow time for a new role assignment to take effect before testing inference.

1. List the imported models:

   ### [Bash](#tab/bash)

   ```azurecli
   az aigateway model list \
     --gateway-name "$GATEWAY" \
     --model-provider "$FOUNDRY_ACCOUNT" --output table
   ```

   ### [PowerShell](#tab/powershell)

   ```powershell
   az aigateway model list `
     --gateway-name $GATEWAY `
     --model-provider $FOUNDRY_ACCOUNT --output table
   ```


1. The output looks as follows:

   ```output
   Name                    Provider               Kind     Model                   Version
   ----------------------  ---------------------  -------  ----------------------  ----------
   deepseek-v4-flash       ai-foundry-demo-learn  Foundry  DeepSeek-V4-Flash       2026-04-23
   fw-deepseek-v4-1-flash  ai-foundry-demo-learn  Foundry  FW-DeepSeek-V4.1-Flash  1
   fw-kimi-k3              ai-foundry-demo-learn  Foundry  FW-Kimi-K3              1
   gpt-6-1-sol             ai-foundry-demo-learn  Foundry  gpt-6.1-sol             2026-09-29
   gpt-6-astra             ai-foundry-demo-learn  Foundry  gpt-6-astra             2026-09-03
   gpt-6-luna              ai-foundry-demo-learn  Foundry  gpt-6-luna              2026-09-22
   grok-4-7                ai-foundry-demo-learn  Foundry  grok-4.7                1
   ```

1. Set `MODEL` to the registration name of a deployment that supports Chat Completions. For the example deployment:

   ### [Bash](#tab/bash)

   ```bash
   MODEL="gpt-6-1-sol"
   ```

   ### [PowerShell](#tab/powershell)

   ```powershell
   $MODEL = "gpt-6-1-sol"
   ```

The provider groups the model registrations for your account.

## Create a runtime API key

Your terminal uses a gateway runtime API key to authenticate to the gateway. Create a separate key for your test so you can revoke it without changing another application's credentials.

> [!WARNING]
> A runtime API key grants gateway-wide access, not access only to the imported model. Don't print it, enable shell tracing, record it in transcripts, or commit it to source control. Delete the key when you're finished.

To create and retrieve your test key:

1. Create the key:

   ### [Bash](#tab/bash)

   ```azurecli
   az aigateway api-key create \
     --gateway-name "$GATEWAY" \
     --name "$KEY_NAME" --display-name "CLI quickstart application"
   ```

   ### [PowerShell](#tab/powershell)

   ```powershell
   az aigateway api-key create `
     --gateway-name $GATEWAY `
     --name $KEY_NAME --display-name "CLI quickstart application"
   ```


1. Verify the output:

   ```output
   {
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/aigw-microsoft-learn-docs/providers/Microsoft.ApiManagement/aigateways/aigw-demo-learn/apiKeys/cli-quickstart-app",
      "name": "cli-quickstart-app",
      "properties": {
        "createdDate": "2026-10-25T15:24:59.3183401Z",
        "displayName": "All APIs subscription",
        "expirationDate": null,
        "state": "active"
      },
      "resourceGroup": "aigw-microsoft-learn-docs",
      "type": "Microsoft.ApiManagement/aigateways/apiKeys"
   }
   ```

1. Retrieve its primary value into a shell variable:

   ### [Bash](#tab/bash)

   ```bash
   AI_GATEWAY_API_KEY="$(az aigateway api-key list-secrets \
     --gateway-name "$GATEWAY" \
     --name "$KEY_NAME" --query primaryKey --output tsv)"
   ```

   ### [PowerShell](#tab/powershell)

   ```powershell
   $AI_GATEWAY_API_KEY = az aigateway api-key list-secrets `
     --gateway-name $GATEWAY `
     --name $KEY_NAME --query primaryKey --output tsv
   ```


Creating a key returns metadata. The separate `list-secrets` command retrieves the credential used for runtime requests.

## Call the model

Send a prompt through the gateway to verify the model registration, gateway key, and Foundry connection together.

To send your first model request:

1. Retrieve the assigned hostname and runtime model identifier, and then build the Chat Completions URL:

   ### [Bash](#tab/bash)

   ```bash
   AI_GATEWAY_HOSTNAME="$(az aigateway show \
     --name "$GATEWAY" \
     --query properties.frontend.defaultHostname --output tsv)"

   AI_GATEWAY_CHAT_URL="https://${AI_GATEWAY_HOSTNAME}/default/models/openai/v1/chat/completions"
   ```

   ### [PowerShell](#tab/powershell)

   ```powershell
   $AI_GATEWAY_HOSTNAME = az aigateway show `
     --name $GATEWAY `
     --query properties.frontend.defaultHostname --output tsv

   $AI_GATEWAY_CHAT_URL = "https://${AI_GATEWAY_HOSTNAME}/default/models/openai/v1/chat/completions"
   ```

1. Use the returned hostname instead of constructing it from the gateway name. The full Chat Completions URL has the form `https://<assigned-gateway-hostname>.ai.gateway.azure.com/default/models/openai/v1/chat/completions`.

1. Send a Chat Completions request:

   ### [Bash](#tab/bash)

   ```bash
   curl "$AI_GATEWAY_CHAT_URL" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $AI_GATEWAY_API_KEY" \
     --data @- <<EOF
   {
     "model": "$MODEL",
     "messages": [
       {"role": "user", "content": "Give me three uses for an AI gateway."}
     ]
   }
   EOF
   ```

   ### [PowerShell](#tab/powershell)

   ```powershell
   $body = @{
     model = $MODEL
     messages = @(
       @{ role = "user"; content = "Give me three uses for an AI gateway." }
     )
   } | ConvertTo-Json -Depth 5

   $response = Invoke-RestMethod `
     -Uri $AI_GATEWAY_CHAT_URL `
     -Method Post `
     -ContentType "application/json" `
     -Headers @{ Authorization = "Bearer $AI_GATEWAY_API_KEY" } `
     -Body $body
   $response.choices[0].message.content
   ```


The response includes the model's reply in `choices[0].message.content`. A successful response confirms that the model registration, gateway key, and Foundry connection work together.

## Clean up resources

Remove only the resources you created for this quickstart. Keep any pre-existing gateway, all resource groups, and the Foundry account and deployments.

To remove your test configuration:

1. Delete the runtime API key and clear its value from the terminal session:

   ### [Bash](#tab/bash)

   ```bash
   az aigateway api-key delete \
     --gateway-name "$GATEWAY" --name "$KEY_NAME"
   unset AI_GATEWAY_API_KEY
   ```

   ### [PowerShell](#tab/powershell)

   ```powershell
   az aigateway api-key delete `
     --gateway-name $GATEWAY --name $KEY_NAME
   Remove-Variable AI_GATEWAY_API_KEY
   ```


1. Delete the test provider:

   ### [Bash](#tab/bash)

   ```azurecli
   az aigateway model-provider delete \
     --gateway-name "$GATEWAY" --name "$FOUNDRY_ACCOUNT"
   ```

   ### [PowerShell](#tab/powershell)

   ```powershell
   az aigateway model-provider delete `
     --gateway-name $GATEWAY --name $FOUNDRY_ACCOUNT
   ```


1. Review the **Foundry User** role assignment on the Foundry account. If you created it for this quickstart, remove it from **Access control (IAM)** only if no other gateway connection needs it. Keep the gateway's managed identity if other connections use it.

1. If you created a gateway for this quickstart and no longer need it, delete it. Don't run this command for a pre-existing gateway:

   ### [Bash](#tab/bash)

   ```azurecli
   az aigateway delete --name "$GATEWAY"
   ```

   ### [PowerShell](#tab/powershell)

   ```powershell
   az aigateway delete --name $GATEWAY
   ```


1. Review the confirmation prompt before deleting the gateway.

1. Clear the resource-group default:

   ```azurecli
   az configure --defaults group=""
   ```


## Related content

- [AI Gateway CLI command reference](https://github.com/Azure/ai-gateway/blob/main/cli/command-reference.md)
- [Quickstart: Create an AI Gateway](./quickstart-create-ai-gateway.md)
- [AI Gateway concepts](./concepts.md)
- [Migrate from the AIGateway SKU in Azure API Management](./ai-gateway-resource.md)
