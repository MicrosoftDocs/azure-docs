---
title: Task workflow to manage public registry content
description: Create an automated Azure Container Registry Tasks workflow to track, manage, and consume public image content in a private Azure container registry.
author: SteveLasker
ms.topic: article
ms.author: stevelas
ms.date: 10/29/2020
ms.custom:
---

# How to consume and maintain public content with Azure Container Registry Tasks

This article provides a sample workflow in Azure Container Registry to help you manage consuming and maintaining public content:

1. Import local copies of dependent public images.
1. Validate public images through security scanning and functional testing.
1. Promote the images to private registries for internal usage.
1. Trigger base image updates for applications dependent upon public content.
1. Use [Azure Container Registry Tasks](container-registry-tasks-overview.md) to automate this workflow.

The workflow is summarized in the following image:

![Consuming public content Workflow](./media/tasks-consume-public-content/consuming-public-content-workflow.png)

The gated import workflow helps manage your organization's dependencies on externally managed artifacts - for example, images sourced from public registries including [Docker Hub][docker-hub], [GCR][gcr], [Quay][quay], [GitHub Container Registry][ghcr], [Microsoft Container Registry][mcr], or even other [Azure container registries][acr]. 

For background about the risks introduced by dependencies on public content and how to use Azure Container Registry to mitigate them, see the [OCI Consuming Public Content Blog post][oci-consuming-public-content] and [Manage public content with Azure Container Registry](buffer-gate-public-content.md).

You can use the Azure Cloud Shell or a local installation of the Azure CLI to complete this walkthrough. Azure CLI version 2.10 or later is recommended. If you need to install or upgrade, see [Install Azure CLI][install-cli].

## Scenario overview

![import workflow components](./media/tasks-consume-public-content/consuming-public-content-objects.png)

This walkthrough sets up:

1. Three **container registries**, representing:
   * A simulated [Docker Hub][docker-hub] (`publicregistry`) to support changing the base image
   * Team registry (`contoso`) to share private images
   * Company/team shared registry (`baseartifacts`) for imported public content
1. An **ACR task** in each registry. The tasks:  
   1. Build a simulated public `node` image
   1. Import and validate the `node` image to the company/team shared registry
   1. Build and deploy the `hello-world` image
1. **ACR task definitions**, including configurations for:
1. A collection of **registry credentials**, which are pointers to a key vault
1. A collection of **secrets**, available within an `acr-task.yaml`, which are pointers to a key vault
1. A collection of **configured values** used within an `acr-task.yaml`
1. An **Azure key vault** to secure all secrets
1. An **Azure container instance**, which hosts the `hello-world` build application

## Prerequisites

The following steps configure values for resources created and used in the walkthrough.

### Set environment variables

Configure variables unique to your environment. We follow best practices for placing resources with durable content in their own resource group to minimize accidental deletion. However, you can place these in a single resource group if desired.

The examples in this article are formatted for the bash shell.

```bash
# Public registry name, which must be globally unique:
REGISTRY_PUBLIC=publicregistry
REGISTRY_PUBLIC_RG=${REGISTRY_PUBLIC}-rg
REGISTRY_PUBLIC_URL=${REGISTRY_PUBLIC}.azurecr.io

REGISTRY_DOCKERHUB_URL=docker.io

# set the location all resources will be created in:
RESOURCE_GROUP_LOCATION=eastus

# Azure key vault for storing secrets, name must be globally unique
AKV=acr-task-credentials
AKV_RG=${AKV}-rg
```

### Git repositories and tokens

To simulate your environment, fork each of the following Git repos into repositories you can manage. 

* https://github.com/importing-public-content/base-image-node.git
* https://github.com/importing-public-content/import-baseimage-node.git
* https://github.com/importing-public-content/hello-world.git

Then, update the following variables for your forked repositories.

The `:main` appended to the end of the git URLs represents the default repository branch.

```bash
GIT_BASE_IMAGE_NODE=https://github.com/<your-fork>/base-image-node.git#main
GIT_NODE_IMPORT=https://github.com/<your-fork>/import-baseimage-node.git#main
GIT_HELLO_WORLD=https://github.com/<your-fork>/hello-world.git#main
```

You need a [GitHub access token (PAT)][git-token] for ACR Tasks to clone and establish Git webhooks. For steps to create a token with the required permissions to a private repo, see [Create a GitHub access token](container-registry-tutorial-build-task.md#create-a-github-personal-access-token). 

```bash
GIT_TOKEN=<set-git-token-here>
```

### Docker Hub credentials  
To avoid throttling and identity requests when pulling images from Docker Hub, create a [Docker Hub token][docker-hub-tokens]. Then, set the following environment variables:

```bash
REGISTRY_DOCKERHUB_USER=<yourusername>
REGISTRY_DOCKERHUB_PASSWORD=<yourtoken>
```

### Create simulated public registry

Using Azure CLI commands, create a Premium tier container registry in its own resource group:

```azurecli-interactive
az group create --name $REGISTRY_PUBLIC_RG --location $RESOURCE_GROUP_LOCATION
az acr create --resource-group $REGISTRY_PUBLIC_RG --name $REGISTRY_PUBLIC --sku Premium
```

### Create key vault and set secrets

Create a key vault:

```azurecli-interactive
az group create --name $AKV_RG --location $RESOURCE_GROUP_LOCATION
az keyvault create --resource-group $AKV_RG --name $AKV
```

Set Docker Hub username and token in the key vault:

```azurecli-interactive
az keyvault secret set \
--vault-name $AKV \
--name registry-dockerhub-user \
--value $REGISTRY_DOCKERHUB_USER

az keyvault secret set \
--vault-name $AKV \
--name registry-dockerhub-password \
--value $REGISTRY_DOCKERHUB_PASSWORD
```

Set and verify a Git PAT in the key vault:

```azurecli-interactive
az keyvault secret set --vault-name $AKV --name github-token --value $GIT_TOKEN
az keyvault secret show --vault-name $AKV --name github-token --query value -o tsv
```

## Create public `node` base image

For the purposes of this tutorial, simulate the `node` image on Docker Hub by creating an [ACR task][acr-task] to build and maintain the public image. This setup allows simulating changes by the `node` image maintainers. Normally, this step would be skipped, where the gated import would pull from a true public registry.

```azurecli-interactive
az acr task create \
  --name node-public \
  -r $REGISTRY_PUBLIC \
  -f acr-task.yaml \
  --context $GIT_BASE_IMAGE_NODE \
  --git-access-token $(az keyvault secret show \
                        --vault-name $AKV \
                        --name github-token \
                        --query value -o tsv) \
  --set REGISTRY_FROM_URL=${REGISTRY_DOCKERHUB_URL}/ \
  --assign-identity
```

To avoid Docker throttling, add [Docker Hub credentials][docker-hub-tokens] to the task. The [acr task credentials][acr-task-credentials] command may be used to pass Docker credentials to any registry, including Docker Hub.

```azurecli-interactive
az acr task credential add \
  -n node-public \
  -r $REGISTRY_PUBLIC \
  --login-server $REGISTRY_DOCKERHUB_URL \
  -u https://${AKV}.vault.azure.net/secrets/registry-dockerhub-user \
  -p https://${AKV}.vault.azure.net/secrets/registry-dockerhub-password \
  --use-identity [system]
```

Grant the task access to read values from the key vault:

```azurecli-interactive
az keyvault set-policy \
  --name $AKV \
  --resource-group $AKV_RG \
  --object-id $(az acr task show \
                  --name node-public \
                  --registry $REGISTRY_PUBLIC \
                  --query identity.principalId --output tsv) \
  --secret-permissions get
```

[Tasks can be triggered][acr-task-triggers] by Git commits, base image updates, timers, or manual runs. 

Run the task manually to generate the `node` image:

```azurecli-interactive
az acr task run -r $REGISTRY_PUBLIC -n node-public
```

List the image in the simulated public registry:

```azurecli-interactive
az acr repository show-tags -n $REGISTRY_PUBLIC --repository node
```

## Next steps

In this step you created a simulated public registry that allows for changes to the public base image used in the next step.

- [Create a hello-world image which uses this simulated public base image](./tasks-tutorial-consume-public-content-hello-world.md)

[install-cli]:                  /cli/azure/install-azure-cli
[acr]:                          https://aka.ms/acr
[acr-repo-permissions]:         https://aka.ms/acr/repo-permissions
[acr-task]:                     https://aka.ms/acr/tasks
[acr-task-triggers]:            container-registry-tasks-overview.md#task-scenarios
[acr-task-credentials]:       container-registry-tasks-authentication-managed-identity.md#4-optional-add-credentials-to-the-task
[acr-tokens]:                   https://aka.ms/acr/tokens
[aci]:                          https://aka.ms/aci
[alpine-public-image]:          https://hub.docker.com/_/alpine
[docker-hub]:                   https://hub.docker.com
[docker-hub-tokens]:            https://hub.docker.com/settings/security
[git-token]:                    https://github.com/settings/tokens
[gcr]:                          https://cloud.google.com/container-registry
[ghcr]:                         https://docs.github.com/en/free-pro-team@latest/packages/getting-started-with-github-container-registry/about-github-container-registry
[helm-charts]:                  https://helm.sh
[mcr]:                          https://aka.ms/mcr
[nginx-public-image]:           https://hub.docker.com/_/nginx
[oci-artifacts]:                https://aka.ms/acr/artifacts
[oci-consuming-public-content]: https://opencontainers.org/posts/blog/2020-10-30-consuming-public-content/
[opa]:                          https://www.openpolicyagent.org/
[quay]:                         https://quay.io
