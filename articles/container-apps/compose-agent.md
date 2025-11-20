---
title: Deploy Docker Compose for agents to Azure Container Apps Preview
description: Learn how to use Docker Compose for Agents on Azure Container Apps Preview.
ms.topic: how-to
ms.date: 11/18/2025
ms.service: azure-container-apps
ms.author: cshoe
author: craigshoemaker
---

# Deploy Docker Compose for agents to Azure Container Apps Preview

This article shows you how to deploy applications to Azure Container Apps by using Docker’s Compose for Agents. This feature keeps the compose file you already use locally and allows you to deploy it onto Container Apps. The `az-cli` container app extension then translates the compose file into Azure Container App applications and manages identities, scaling, and model lifecycle for you.

In this article, you learn to:

> [!div class="checklist"]
> * Understand the agent-specific resources created in Azure Container Apps.
> * Review sample compose files adapted for Azure Container Apps.
> * Deploy a compose file with the Azure CLI and verify the environment.
> * Troubleshoot issues and learn about current limitations.

> [!IMPORTANT]
> Docker Compose for agents support in Azure Container Apps is in public preview. Features and behavior might change without notice.

## Prerequisites

- Azure CLI 2.70.0 or later with the `containerapp` extension version `1.2.0b5+ai.compose` or later installed (see install instructions).
- An Azure subscription with permissions to create Azure Container Apps resources.
- A Docker Compose for agents file. You can start from the samples in the [docker/compose-for-agents](https://github.com/docker/compose-for-agents/commit/2314180bc5d1f056964a14361f73d2b8f5c247c3) repository.
- Docker install (for local build)
- An Azure Container Apps environment ready for deployments. Create one with `az containerapp env create` if you don't already have an environment. Deploying models on GPU requires you to choose [one of the following locations](gpu-serverless-overview.md#supported-regions). The samples used in this article assume the use of serverless GPU.

## Deployment architecture

When you run `az containerapp compose create`, the CLI translates agent-focused compose elements into the appropriate Azure Container Apps resources. Two critical components in Compose for Agents are the model runner and the MCP gateway, responsible for making the model and MCP tools available to your application.

### Model context protocol (MCP) tooling

Azure Container Apps runs a variant of [Docker’s MCP gateway](https://github.com/docker/mcp-gateway) as its own container app. It uses system-assigned managed identity to add or remove MCP tool containers within the environment dynamically. This setup appears as separate containers under the mcp-gateway application. Gateway to MCP tooling communication is limited to the network. Stdio MCP servers are wrapped to run as SSE based MCP servers on Azure Container Apps. Docker for Agents on Azure Container Apps currently supports the following Stdio MCP servers: AppSignal, BigQuery, Confluence, DuckDuckGo, Fetch, Filesystem, Git, Google Drive, Jira, MongoDB, MySQL, Notion, Playwright, PostgreSQL, SequentialThinking, Slack, SQLite, Supabase, Time, Twist.

### Models

Models get served through [Docker's model runner](https://github.com/docker/model-runner). On Azure Container Apps, the model-runner-config container deployed as part of the models app handles configuration. It ensures the correct model is pulled and configured before your app can interact with it. The configuration is passed to the model config container through the `MODEL_CONFIG` variable.

## Compose files

You can use the same compose file for local development and deployment. To achieve this goal, add the `x-azure-deployment` directive. Docker's Compose ignores this directive, but it gets used during deployment on Azure Container Apps. Here are [some ready-to-deploy samples](https://github.com/docker/compose-for-agents/commit/2314180bc5d1f056964a14361f73d2b8f5c247c3) for you to review. These samples all have the following sections in common for serverless GPU and to deploy the Azure Container Apps version of the mcp-gateway.

```bash
services:
  ...

models:
  gemma:
    model: ai/gemma3-qat
	# run the models on serverless GPU workload profile
    x-azure-deployment:
      workloadProfiles:
        workloadProfileType: Consumption-GPU-NC8as-T4
```

```bash
serivces:
	mcp-gateway:
	...
	# use the Azure Container Apps flavored image for the mcp-gateway
	x-azure-deployment:
	  image: acateam.azurecr.io/preview-ai-compose/mcp-gateway:latest
  ...

models:
  ...
```

Other `x-azure-deployment` options are:

```yaml
x-azure-deployment:
  image: ghcr.io/example/app:custom-build
  resources:
    cpu: 1.0
    memory: 2
  scale:
    maxReplicas: 1
    minReplicas: 1
  ingress:
    external: true
    allowInsecure: false
```

## Installation and usage

Follow the steps below to set up your environment and deploy your applications using your existing compose files.

### Installing Compose for agents

At this stage, this feature requires the installation of two packages. Once installed, these packages provide the capabilities explained. Follow these steps:

```bash
# remove the existing container apps extension
az extension remove --name containerapp

# install the pycomposefile module and the preview extension for containerapps
pip install "https://raw.githubusercontent.com/microsoft/azure-container-apps/main/preview/ai-compose/az-extension/release-1.2.0b5+ai.compose-py2.py3-none-any/pycomposefile-0.0.32-py3-none-any.whl"
az extension add --source "https://raw.githubusercontent.com/microsoft/azure-container-apps/main/preview/ai-compose/az-extension/release-1.2.0b5+ai.compose-py2.py3-none-any/containerapp-1.2.0b5+ai.compose-py2.py3-none-any.whl" --yes

# check of the extension is installed (should show 1.2.0b5+ai.compose)
az extension show --name containerapp --query version -o tsv
# you are ready to use the extension
az containerapp compose --help
```

### Using the Compose for agents

Start with [one of the prepared files located here](https://github.com/docker/compose-for-agents/commit/2314180bc5d1f056964a14361f73d2b8f5c247c3). Then follow the instructions:

```bash
# define the needed variables
export LOCATION=westus2
export RESOURCE_GROUP=rg-compose-for-agents
export ENV_NAME=ai-app-env
export COMPOSE=compose-aca.yml

# create the resource group
az group create --name $RESOURCE_GROUP   --location $LOCATION && 

# create the Azure Container Apps environment
az containerapp env create \
			--name $ENV_NAME \
			--resource-group $RESOURCE_GROUP \
			--location $LOCATION

# deploy your compose file
az containerapp compose create \
			--compose-file-path $COMPOSE \
			--resource-group $RESOURCE_GROUP \
			--environment $ENV_NAME
```

### Uninstalling and switching back

To switch back to the stable release of the container app extension:

```bash
# remove the current extension
az extension remove --name containerapp
# reinstall and confirm stable install
az extension install --name containerapp
az extension show --name containerapp --query version -o tsv
```

## Known issues and troubleshooting

- **Occasional image availability delays**: Sometimes a locally built image isn't immediately available on the platform. Redeploy or restart the application to fix the issue. The error looks as follows:

    ```text
    Failed to provision revision for container app 'app'. Error details: The following field(s) are either invalid or missing. Field 'template.containers.app.image' is invalid with details: 'Invalid value: "acateam.azurecr.io/preview-ai-compose/samples/spring-ai-app:latest": GET https:: MANIFEST_UNKNOWN: manifest tagged by "latest" is not found; map[Tag:latest]'
    ```

- **Managed identity issues**: On redeploy you might see this message. This error occurs because the identity is reassigned to the mcp-gateway. Ignore the message if your gateway is functioning properly.

    ```text
    ⚠️  Could not automatically assign role: AADSTS53003: Access has been blocked by Conditional Access policies. The access policy does not allow token issuance.
    ```

- **Unreachable gateway URLs**: Confirm the gateway hostname omits the port number and matches the value injected into `MCP_GATEWAY_URL`. Don't manually reintroduce ports removed during deployment.

- **MCP gateway tooling**: Check if the mcp-gateway app has multiple containers deployed. If so, things should be operating properly.

- **Models not provisioned**: Review the `model-runner-config` container logs from the `models` app to check for authentication issues when pulling models. Pull the available models by running `curl http://YOUR_MODELS_ENDPOINT/models`.

- **Reporting issues**: Report issues with the extension on [the official Container Apps GitHub](https://github.com/microsoft/azure-container-apps/issues).

## Preview limitations

> [!WARNING]
> These limitations apply during the public preview and might change before general availability.

- Only one SSE-based MCP wrapper per compose file is supported.
- Volumes and networks aren't currently supported.
- Log messages aren't always correct.
