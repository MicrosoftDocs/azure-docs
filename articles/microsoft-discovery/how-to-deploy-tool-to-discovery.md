---
title: Deploy a tool to Microsoft Discovery
description: Learn how to convert a tool definition YAML to JSON and create a Microsoft Discovery tool resource by using the Azure portal or REST API.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: how-to
ms.date: 05/01/2026

#CustomerIntent: As a tool publisher, I want to deploy my tool resource to Microsoft Discovery so that agents and investigations can use it.
---

# Deploy a tool to Microsoft Discovery

After you publish your tool's container image to Azure Container Registry (ACR) and author its YAML definition, the next step is to register the tool with Microsoft Discovery as an Azure resource of type `Microsoft.Discovery/tools`. Once registered, agents in any project that has access to the tool can invoke it during investigations.

This article shows you how to:

- Convert your YAML tool definition into the JSON format that the Discovery resource provider accepts.
- Create the tool resource by using the Azure portal or REST API.
- Optionally pass runtime environment variables to the tool's container at deployment time.

## Prerequisites

- A container image published to Azure Container Registry. See [Publish a tool container image to Azure Container Registry](how-to-publish-tool-to-acr.md).
- A tool definition YAML file. See [Create a tool definition for Microsoft Discovery](how-to-create-tool-definition.md).
- An existing Microsoft Discovery workspace and a resource group in a [supported region](quickstart-infrastructure-portal.md#prerequisites).
- Permissions to create resources of type `Microsoft.Discovery/tools` in your target resource group. The **Microsoft Discovery Platform Administrator (Preview)** or **Contributor** role is sufficient.
- For REST API calls: Azure CLI 2.50+ or another HTTP client (`curl`, Postman) able to send authenticated requests.

## Step 1: Convert the tool definition YAML to JSON

The Discovery resource provider stores the tool definition as a JSON document on the resource. You author the definition in YAML for readability, then convert it to JSON before uploading.

# [PowerShell](#tab/powershell)

```powershell
# Requires PowerShell 7+ with the powershell-yaml module
Install-Module powershell-yaml -Scope CurrentUser

$yaml = Get-Content -Raw ./tool.yaml | ConvertFrom-Yaml
$yaml | ConvertTo-Json -Depth 20 | Set-Content ./tool.json
```

# [Python](#tab/python)

```bash
pip install pyyaml
```

Save the following script as `convert-tool.py`. It accepts the input YAML path and the output JSON path as command-line arguments:

```python
import json, sys, yaml

input_path, output_path = sys.argv[1], sys.argv[2]

with open(input_path) as f:
    definition = yaml.safe_load(f)

with open(output_path, "w") as f:
    json.dump(definition, f, indent=2)
```

Run the script, passing your YAML file as the first argument and the desired JSON output path as the second:

```bash
python ./convert-tool.py ./tool.yaml ./tool.json
```

---

> [!TIP]
> Keep both the YAML source and the generated JSON in source control. The YAML is easier to review in pull requests; the JSON is what you upload to Discovery.

## Step 2 (optional): Prepare an environment variables file

Environment variables let you pass runtime configuration to your tool's container without rebuilding the image. Use this when values vary per deployment (for example, endpoints, feature flags, model names, or non-secret tokens) and aren't pre-baked into the image.

The environment variables file is a JSON document containing a flat map of string keys to string values:

```json
{
  "MODEL_ENDPOINT": "https://contoso-models.openai.azure.com/",
  "MAX_BATCH_SIZE": "32",
  "FEATURE_FLAG_NEW_PARSER": "true"
}
```

Save the file (for example, `my-tool.env.json`). You upload it alongside the definition file in step 3.

> [!IMPORTANT]
> Don't store secrets such as API keys or connection strings in the environment variables file. Use a managed identity with appropriate role assignments, or reference a Key Vault, instead.

## Step 3: Create the tool resource

You can create the Discovery tool resource by using either the Azure portal or the REST API.

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://aka.ms/discovery/publicpreviewportal). The link adds the `v2` feature flag required for Public Preview.
1. Search for **Microsoft Discovery Tools** and select it.
1. Select **+ Create**. The **Basics** tab opens.
1. On the **Basics** tab, fill in the following fields:

   | Field | Description |
   |---|---|
   | **Subscription** | The subscription where the tool resource is created. |
   | **Resource group** | An existing resource group, or select **Create new**. Use the same resource group as your workspace for simpler management. |
   | **Name** | A unique name for the tool resource. Use lowercase letters, numbers, and hyphens. |
   | **Region** | An Azure region that supports Microsoft Discovery (East US, East US 2, Sweden Central, or UK South). |
   | **Definition content file** | The JSON file produced in [Step 1](#step-1-convert-the-tool-definition-yaml-to-json). Select the folder icon and upload `my-tool.json`. |
   | **Definition content version** | Any string that identifies the version of the definition (for example, `1.0.0`, `2026-05-01`, or a git commits SHA). Increment this value each time you upload a new definition so that consumers can detect updates. |
   | **Environment variables** | Optional. Upload the JSON file from [Step 2](#step-2-optional-prepare-an-environment-variables-file). Leave blank if your container doesn't need runtime configuration. |

   :::image type="content" source="media/how-to-deploy-tool-to-discovery/tool-deployment.png" alt-text="Screenshot of the Create Tool page in the Azure portal showing the Basics tab with Subscription, Resource group, Name, Region, Definition content file, Definition content version, and Environment variables fields." lightbox="media/how-to-deploy-tool-to-discovery/tool-deployment.png":::

1. (Optional) On the **Tags** tab, add any tags required by your organization.
1. On the **Review + create** tab, verify the settings and select **Create**.

After deployment completes, the tool appears in the Discovery tool catalog and can be added to projects.

# [REST API](#tab/rest)

Send a `PUT` request to the tools resource endpoint. All examples use API version `2026-02-01-preview`.

### Request

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/tools/{toolName}?api-version=2026-02-01-preview
Content-Type: application/json
Authorization: Bearer <access-token>
```

### URI parameters

| Parameter | Description |
|---|---|
| `subscriptionId` | The ID of the target subscription. |
| `resourceGroupName` | Name of the resource group. |
| `toolName` | Name of the Discovery tool. Use lowercase letters, numbers, and hyphens. |

### Request body

```json
{
  "location": "swedencentral",
  "tags": {
    "version": "v2"
  },
  "properties": {
    "definitionContent": { },
    "definitionContentVersion": "1.0.0",
    "environmentVariables": {
      "MODEL_ENDPOINT": "https://contoso-models.openai.azure.com/",
      "MAX_BATCH_SIZE": "32"
    }
  }
}
```

| Property | Required | Description |
|---|---|---|
| `properties.definitionContent` | Yes | The JSON object produced in [Step 1](#step-1-convert-the-tool-definition-yaml-to-json). Inline the contents of `my-tool.json` here. |
| `properties.definitionContentVersion` | Yes | An arbitrary string that identifies this version of the definition (for example, `1.0.0`). Increment when the definition changes. |
| `properties.environmentVariables` | No | A flat map of string keys to string values passed to the tool's container at runtime. Omit if not needed. |

### Example with Azure CLI

```bash
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
RG=my-discovery-rg
TOOL=my-analysis-tool

# Build the request body from the converted definition and the env file
jq -n \
  --slurpfile def my-tool.json \
  --slurpfile env my-tool.env.json \
  '{
     location: "swedencentral",
     properties: {
       definitionContent: $def[0],
       definitionContentVersion: "1.0.0",
       environmentVariables: $env[0]
     }
   }' > tool-body.json

az rest --method PUT \
  --url "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.Discovery/tools/$TOOL?api-version=2026-02-01-preview" \
  --body @tool-body.json
```

### Response

A successful create returns `201 Created` (or `200 OK` when updating an existing tool) with the resource representation:

```json
{
  "id": "/subscriptions/.../providers/Microsoft.Discovery/tools/my-analysis-tool",
  "name": "my-analysis-tool",
  "type": "Microsoft.Discovery/tools",
  "location": "swedencentral",
  "properties": {
    "provisioningState": "Succeeded",
    "definitionContentVersion": "1.0.0"
  }
}
```

---

## Step 4: Verify the deployment

```azurecli
az resource show \
  --ids "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Discovery/tools/<toolName>" \
  --api-version 2026-02-01-preview \
  --query "{name:name, state:properties.provisioningState, version:properties.definitionContentVersion}" \
  -o table
```

The `provisioningState` should be `Succeeded`. The tool is now available to add to projects within workspaces that have access to the resource group.

## Update an existing tool

To publish a new version of a tool, repeat [Step 1](#step-1-convert-the-tool-definition-yaml-to-json) with your updated YAML, then re-run [Step 3](#step-3-create-the-tool-resource) using the same tool name. Always increment **Definition content version** so that downstream consumers can detect the change.

## Troubleshooting

| Symptom | Likely cause | Resolution |
|---|---|---|
| `InvalidDefinitionContent` error during create | The uploaded JSON doesn't match the tool definition schema. | Re-validate the YAML with the tool definition reference and reconvert. See [Create a tool definition](how-to-create-tool-definition.md). |
| `ImagePullBackOff` when the tool runs | The Discovery managed identity lacks **AcrPull** on the registry, or the image reference is wrong. | Verify the image reference in the YAML and that the workspace UAMI has **AcrPull** on the ACR. |
| Environment variables aren't visible in the container | The file wasn't valid JSON or wasn't uploaded. | Confirm the file is a flat `{ "KEY": "value" }` JSON object and re-create the resource. |
| `RoleAssignmentNotFound` when creating the resource | Missing RBAC on the resource group. | Assign **Contributor** or **Microsoft Discovery Platform Administrator (Preview)** at the resource group scope. |

## Next steps

- [Create a tool definition for Microsoft Discovery](how-to-create-tool-definition.md)
- [Publish a tool container image to Azure Container Registry](how-to-publish-tool-to-acr.md)
- [Add agents and tools to a project](quickstart-agents-studio.md)
