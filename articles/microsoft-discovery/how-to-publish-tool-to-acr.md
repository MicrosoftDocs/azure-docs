---
title: Publish a tool container image to Azure Container Registry for Microsoft Discovery
description: Learn how to build, validate, tag, and push a tool container image to Azure Container Registry for use with Microsoft Discovery.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: how-to
ms.date: 04/07/2026

#CustomerIntent: As a tool publisher, I want to build, test, and push my tool's container image to Azure Container Registry so that Microsoft Discovery can deploy it within investigations.
---

# Publish a tool container image to Azure Container Registry for Microsoft Discovery

After you have built and tested your tool's container image locally, the next step is to publish it to Azure Container Registry (ACR). The Microsoft Discovery platform pulls tool images from ACR when it deploys tools within investigations.

> [!NOTE]
> This article assumes you have a working, locally tested container image. See [Create a Dockerfile for a Discovery tool](how-to-create-tool-docker-file.md) before proceeding.

## Prerequisites

Before publishing your image to ACR, verify you have the following:

- **Docker** running locally. Verify with: `docker info`.
- **Azure CLI** (version 2.0.80 or later). Verify with: `az --version`. Sign in with: `az login`.
- **ACR access**: An Azure Container Registry instance associated with your Discovery workspace. Your Azure account needs the **AcrPush** role on the registry.
- Sufficient local disk space (minimum 10 GB free) for image building and caching.

To check your ACR role assignment:

```bash
az role assignment list \
  --assignee $(az account show --query user.name -o tsv) \
  --scope $(az acr show --name <registry-name> --query id -o tsv) \
  --output table
```

## Step 1: Authenticate with Azure Container Registry

```bash
# Sign in to Azure (if not already signed in)
az login

# Authenticate Docker with your ACR instance
az acr login --name <registry-name>
```

Verify the authentication succeeded:

```bash
az acr repository list --name <registry-name> --output table
```

## Step 2: Build the container image

If you haven't already built the image locally, navigate to your tool directory and build it:

```bash
cd <tool-name>

docker build -t <tool-name>:latest .
```

> [!TIP]
> Use a version tag in addition to `latest` so that you can roll back to a previous version if needed. For example: `docker build -t <tool-name>:v1.0.0 .`

You can alternatively choose to build the images directly in Azure Container Registry (ACR). This approach is best suited when you don't have local docker runtime environment installed.

```bash
az acr build `
    --registry <AcrName> `
    --image <ImageName>:<ImageTag> `
    --file <DockerfilePath> `
    <ContextPath>
```

## Step 3: Validate the image before pushing

Run a quick validation to confirm the image works correctly with sample inputs before pushing to ACR. This catches issues before they're deployed to the platform.

```bash
# Verify the container starts and the runtime is available
docker run --rm <tool-name>:latest python --version

# Run an action with mounted test data
docker run --rm \
  -v "$(pwd)/input:/input" \
  -v "$(pwd)/output:/output" \
  <tool-name>:latest \
  python3 /app/entrypoint.py \
    --action <action-name> \
    --input /input \
    --output /output

# Confirm output was written
ls ./output/
cat ./output/results.json
```

Verify that:
- The container exits with code `0`
- All expected output files are present
- `results.json` shows `"status": "completed"`

## Step 4: Tag the image for ACR

Tag the image with your ACR login server address so Docker knows where to push it.

```bash
# Get your ACR login server address
ACR_LOGIN_SERVER=$(az acr show --name <registry-name> --query loginServer --output tsv)
echo "ACR Login Server: $ACR_LOGIN_SERVER"

# Tag the image
docker tag <tool-name>:latest $ACR_LOGIN_SERVER/<tool-name>:latest
docker tag <tool-name>:latest $ACR_LOGIN_SERVER/<tool-name>:v1.0.0

# Confirm the tags are present
docker images | grep $ACR_LOGIN_SERVER
```

## Step 5: Push the image to ACR

```bash
# Push both tags
docker push $ACR_LOGIN_SERVER/<tool-name>:latest
docker push $ACR_LOGIN_SERVER/<tool-name>:v1.0.0
```

## Step 6: Verify the push succeeded

Confirm the image is available in ACR before creating a tool definition that references it.

```bash
# List repositories in your ACR
az acr repository list --name <registry-name> --output table

# Show tags for your tool's repository
az acr repository show-tags \
  --name <registry-name> \
  --repository <tool-name> \
  --output table
```

You can also verify end-to-end by pulling the image from ACR to a clean environment:

```bash
# Remove the local copy
docker rmi $ACR_LOGIN_SERVER/<tool-name>:latest

# Pull from ACR and run a quick test
docker pull $ACR_LOGIN_SERVER/<tool-name>:latest
docker run --rm $ACR_LOGIN_SERVER/<tool-name>:latest python --version
```

## Step 7: Record the image reference

Note the full image reference. You need it in the tool definition's `infra.image.acr` field:

```
<registry-name>.azurecr.io/<tool-name>:v1.0.0
```

> [!TIP]
> Reference a specific version tag (for example, `v1.0.0`) in your tool definition rather than `latest`. This ensures consistent behavior: the same image is always used regardless of future pushes to `latest`.

## Next steps

With your image published to ACR, proceed to create the tool definition YAML that describes how Discovery deploys and invokes your tool:

- [Create a tool definition](how-to-create-tool-definition.md)

## Related content

- [Plan tool requirements for Microsoft Discovery](how-to-plan-tool-requirements.md)
- [Create a Dockerfile for a Discovery tool](how-to-create-tool-docker-file.md)
- [Azure Container Registry documentation](/azure/container-registry/)
