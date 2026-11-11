---
title: Publish a tool container image to Azure Container Registry for Microsoft Discovery
description: Learn how to build, validate, tag, and push a tool container image to Azure Container Registry for use with Microsoft Discovery.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: how-to
ms.date: 11/10/2026

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
- **ACR access**: A registry reachable by the publishing environment and supercomputer workloads. The publishing identity needs **AcrPush** in **RBAC Registry Permissions** mode, or **Container Registry Repository Writer** in **RBAC Registry + ABAC Repository Permissions** mode. The repository-listing examples also require **Container Registry Repository Catalog Lister** in ABAC mode. These publishing permissions are separate from the supercomputer kubelet identity's pull permissions. See [Configure a container registry](how-to-configure-container-registry.md#supercomputer-access) for role and network requirements.
- Sufficient local disk space for image building and caching.

To check your ACR role assignment:

```bash
ACR_NAME="myregistry" # Replace with your registry name
TOOL_NAME="molecular-groups"
IMAGE_TAG="v1.0.0"
PUBLISHER_OBJECT_ID="<publishing-identity-object-id>"
ACR_RESOURCE_ID=$(az acr show --name "$ACR_NAME" --query id -o tsv)

az role assignment list \
  --assignee "$PUBLISHER_OBJECT_ID" \
  --scope "$ACR_RESOURCE_ID" \
  --include-inherited \
  --output table
```

## Step 1: Authenticate with Azure Container Registry

```bash
# Sign in to Azure (if not already signed in)
az login

# Authenticate Docker with your ACR instance
az acr login --name "$ACR_NAME"
```

Verify the authentication succeeded:

```bash
az acr repository list --name "$ACR_NAME" --output table
```

Listing repositories verifies catalog access, not permission to push to a particular repository. ABAC conditions must allow the target repository for publishing.

## Step 2: Build the container image

If you haven't already built the image locally, navigate to your tool directory and build it:

```bash
cd "./$TOOL_NAME"

docker build -t "$TOOL_NAME:latest" .
```

> [!TIP]
> Use a version tag in addition to `latest` so that you can roll back to a previous version if needed. For example: `docker build -t "$TOOL_NAME:$IMAGE_TAG" .`

You can alternatively choose to build the images directly in Azure Container Registry (ACR). This approach is best suited when you don't have local docker runtime environment installed.

```bash
az acr build \
    --registry "$ACR_NAME" \
    --image "$TOOL_NAME:$IMAGE_TAG" \
    --file Dockerfile \
    .
```

Building in ACR also requires [ACR Tasks permissions](/azure/container-registry/container-registry-rbac-built-in-roles-overview) and repository access. Local Docker push permissions alone don't cover this build operation.

## Step 3: Validate the image before pushing

Run a quick validation to confirm the image works correctly with sample inputs before pushing to ACR. This catches issues before they're deployed to the platform.

```bash
# Verify the container starts and the runtime is available
docker run --rm "$TOOL_NAME:latest" python --version

# Run an action with mounted test data
docker run --rm \
  -v "$(pwd)/input:/input" \
  -v "$(pwd)/output:/output" \
  "$TOOL_NAME:latest" \
  python3 /app/entrypoint.py \
    --action identify_functional_groups \
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
ACR_LOGIN_SERVER=$(az acr show --name "$ACR_NAME" --query loginServer --output tsv)
echo "ACR Login Server: $ACR_LOGIN_SERVER"

# Tag the image
docker tag "$TOOL_NAME:latest" "$ACR_LOGIN_SERVER/$TOOL_NAME:latest"
docker tag "$TOOL_NAME:latest" "$ACR_LOGIN_SERVER/$TOOL_NAME:$IMAGE_TAG"

# Confirm the tags are present
docker images | grep -F "$ACR_LOGIN_SERVER"
```

## Step 5: Push the image to ACR

```bash
# Push both tags
docker push "$ACR_LOGIN_SERVER/$TOOL_NAME:latest"
docker push "$ACR_LOGIN_SERVER/$TOOL_NAME:$IMAGE_TAG"
```

## Step 6: Verify the push succeeded

Confirm the image is available in ACR before creating a tool definition that references it.

```bash
# List repositories in your ACR
az acr repository list --name "$ACR_NAME" --output table

# Show tags for your tool's repository
az acr repository show-tags \
  --name "$ACR_NAME" \
  --repository "$TOOL_NAME" \
  --output table
```

You can also verify end-to-end by pulling the image from ACR to a clean environment:

```bash
# Remove the local copy
docker rmi "$ACR_LOGIN_SERVER/$TOOL_NAME:$IMAGE_TAG"

# Pull from ACR and run a quick test
docker pull "$ACR_LOGIN_SERVER/$TOOL_NAME:$IMAGE_TAG"
docker run --rm "$ACR_LOGIN_SERVER/$TOOL_NAME:$IMAGE_TAG" python --version
```

## Step 7: Record the image reference

Note the full image reference. You need it in the tool definition's `infra.image.acr` field:

```text
myregistry.azurecr.io/molecular-groups:v1.0.0
```

> [!TIP]
> Reference a specific version tag (for example, `v1.0.0`) rather than `latest`, and don't overwrite that tag. A version tag alone doesn't make an image immutable. See [Lock an image version](/azure/container-registry/container-registry-image-lock).

## Next steps

With your image published to ACR, proceed to create the tool definition YAML that describes how Discovery deploys and invokes your tool:

- [Create a tool definition](how-to-create-tool-definition.md)

## Related content

- [Plan tool requirements for Microsoft Discovery](how-to-plan-tool-requirements.md)
- [Create a Dockerfile for a Discovery tool](how-to-create-tool-docker-file.md)
- [Azure Container Registry documentation](/azure/container-registry/)
