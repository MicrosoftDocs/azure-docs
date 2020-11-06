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
# Set the three registry names, must be globally unique:
REGISTRY=contoso
REGISTRY_RG=${REGISTRY}-rg
REGISTRY_URL=${REGISTRY}.azurecr.io

# set the location all resources will be created in:
RESOURCE_GROUP_LOCATION=eastus

# Azure key vault for storing secrets, name must be globally unique. Assumed to exist or be created in the previous tutorial step
AKV=acr-task-credentials

# ACI for hosting the deployed application
ACI=hello-world-aci
ACI_RG=${ACI}-rg
```

### Git repositories and tokens

To simulate your environment, fork the following Git repo into a repository you can manage. 

* https://github.com/importing-public-content/hello-world.git

Then, update the following variable for your forked repositories.

The `:main` appended to the end of the git URLs represents the default repository branch.

```azurecli-interactive
GIT_HELLO_WORLD=https://github.com/<your-fork>/hello-world.git#main
```

### Create registries

Using Azure CLI commands, create three Premium tier container registries, each in its own resource group:

```azurecli-interactive
az group create --name $REGISTRY_RG --location $RESOURCE_GROUP_LOCATION
az acr create --resource-group $REGISTRY_RG --name $REGISTRY --sku Premium
```

### Create key vault secrets

Set and verify a Git PAT in the key vault:

```azurecli-interactive
az keyvault secret set \
  --vault-name $AKV \
  --name github-token 
  --value $GIT_TOKEN
```

### Create resource group for an Azure container instance

This resource group is used in a later task when deploying the `hello-world` image.

```azurecli-interactive
az group create --name $ACI_RG --location $RESOURCE_GROUP_LOCATION
```

## Create the `hello-world` image

Based on the simulated public `node` image, build a `hello-world` image.

### Create token for pull access to simulated public registry

In this step, either 
- build from simulated public registry
- build from Docker Hub

Building from a simulated public registry

Create an [access token][acr-tokens] to the simulated public registry, scoped to `pull`. Then, set it in the key vault:

```azurecli-interactive
az keyvault secret set \
  --vault-name $AKV \
  --name "registry-${REGISTRY_PUBLIC}-user" \
  --value "registry-${REGISTRY_PUBLIC}-user"

az keyvault secret set \
  --vault-name $AKV \
  --name "registry-${REGISTRY_PUBLIC}-password" \
  --value $(az acr token create \
              --name "registry-${REGISTRY_PUBLIC}-user" \
              --registry $REGISTRY_PUBLIC \
              --scope-map _repositories_pull \
              -o tsv \
              --query credentials.passwords[0].value)

# Set the task FROM registry URL
REGISTRY_FROM_URL=$REGISTRY_PUBLIC_URL
```

Building from Docker Hub

To avoid throttling and identity requests when pulling images from Docker Hub, create a [Docker Hub token][docker-hub-tokens]. Then, set the following environment variables:

```bash
REGISTRY_DOCKERHUB_USER=<yourusername>
REGISTRY_DOCKERHUB_PASSWORD=<yourtoken>
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

# Set the task FROM registry URL
REGISTRY_FROM_URL=$REGISTRY_DOCKERHUB_URL
```

### Create token for pull access by Azure Container Instances

Create an [access token][acr-tokens] to the registry hosting the `hello-world` image, scoped to pull. Then, set it in the key vault:

```azurecli-interactive
az keyvault secret set \
  --vault-name $AKV \
  --name "registry-${REGISTRY}-user" \
  --value "registry-${REGISTRY}-user"

az keyvault secret set \
  --vault-name $AKV \
  --name "registry-${REGISTRY}-password" \
  --value $(az acr token create \
              --name "registry-${REGISTRY}-user" \
              --registry $REGISTRY \
              --repository hello-world content/read \
              -o tsv \
              --query credentials.passwords[0].value)
```

### Create task to build and maintain `hello-world` image

The following command creates a task from the definition in `acr-tasks.yaml` in the `hello-world` repo. The task steps build the `hello-world` image and then deploy it to Azure Container Instances. The resource group for Azure Container Instances was created in a previous section. By calling `az container create` in the task with only a difference in the `image:tag`, the task deploys to same instance throughout this walkthrough.

```azurecli-interactive
az acr task create \
  -n hello-world \
  -r $REGISTRY \
  -f acr-task.yaml \
  --context $GIT_HELLO_WORLD \
  --git-access-token $(az keyvault secret show \
                        --vault-name $AKV \
                        --name github-token \
                        --query value -o tsv) \
  --set REGISTRY_FROM_URL=${REGISTRY_FROM_URL}/ \
  --set KEYVAULT=$AKV \
  --set ACI=$ACI \
  --set ACI_RG=$ACI_RG \
  --assign-identity
```

Add credentials to the task for the simulated public registry:

```azurecli-interactive
az acr task credential add \
  -n hello-world \
  -r $REGISTRY \
  --login-server $REGISTRY_PUBLIC_URL \
  -u https://${AKV}.vault.azure.net/secrets/registry-${REGISTRY_PUBLIC}-user \
  -p https://${AKV}.vault.azure.net/secrets/registry-${REGISTRY_PUBLIC}-password \
  --use-identity [system]
```

Grant the task access to read values from the key vault:

```azurecli-interactive
az keyvault set-policy \
  --name $AKV \
  --resource-group $AKV_RG \
  --object-id $(az acr task show \
                  --name hello-world \
                  --registry $REGISTRY \
                  --query identity.principalId --output tsv) \
  --secret-permissions get
```

Grant the task access to create and manage Azure Container Instances by granting access to the resource group:

```azurecli-interactive
az role assignment create \
  --assignee $(az acr task show \
  --name hello-world \
  --registry $REGISTRY \
  --query identity.principalId --output tsv) \
  --scope $(az group show -n $ACI_RG --query id -o tsv) \
  --role owner
```

With the task created and configured, run the task to build and deploy the `hello-world` image:

```azurecli-interactive
az acr task run -r $REGISTRY -n hello-world
```

Once created, get the IP address of the container hosting the `hello-world` image.

```azurecli-interactive
az container show \
  --resource-group $ACI_RG \
  --name ${ACI} \
  --query ipAddress.ip \
  --out tsv
```

In your browser, go to the IP address to see the running application.

## Update the base image with a "questionable" change

This section simulates a change to the base image that could cause problems in the environment.

1. Open `Dockerfile` in the forked `base-image-node` repo.
1. Change the `BACKGROUND_COLOR` to `Orange` to simulate the change.

```Dockerfile
ARG REGISTRY_NAME=
FROM ${REGISTRY_NAME}node:15-alpine
ENV NODE_VERSION 15-alpine
ENV BACKGROUND_COLOR Orange
```

Commit the change and watch for ACR Tasks to automatically start building.

Watch for the task to start executing:

```azurecli-interactive
watch -n1 az acr task list-runs -r $REGISTRY_PUBLIC -o table
```

You should eventually see STATUS `Succeeded` based on a TRIGGER of `Commit`:

```azurecli-interactive
RUN ID    TASK      PLATFORM    STATUS     TRIGGER    STARTED               DURATION
--------  --------  ----------  ---------  ---------  --------------------  ----------
ca4       hub-node  linux       Succeeded  Commit     2020-10-24T05:02:29Z  00:00:22
```

Type **Ctrl+C** to exit the watch command, then view the logs for the most recent run:

```azurecli-interactive
az acr task logs -r $REGISTRY_PUBLIC
```

Once the `node` image is completed, `watch` for ACR Tasks to automatically start building the `hello-world` image:

```azurecli-interactive
watch -n1 az acr task list-runs -r $REGISTRY -o table
```

You should eventually see STATUS `Succeeded` based on a TRIGGER of `Image Update`:

```azurecli-interactive
RUN ID    TASK         PLATFORM    STATUS     TRIGGER       STARTED               DURATION
--------  -----------  ----------  ---------  ------------  --------------------  ----------
dau       hello-world  linux       Succeeded  Image Update  2020-10-24T05:08:45Z  00:00:31
```

Type **Ctrl+C** to exit the watch command, then view the logs for the most recent run:

```azurecli-interactive
az acr task logs -r $REGISTRY
```

Once completed, get the IP address of the site hosting the updated `hello-world` image:

```azurecli-interactive
az container show \
  --resource-group $ACI_RG \
  --name ${ACI} \
  --query ipAddress.ip \
  --out tsv
```

In your browser, go to the site, which should have an orange (questionable) background.

### Checking in

At this point, you've created a `hello-world` image that is automatically built on Git commits and changes to the base `node` image. In this example, the task builds against a base image in Azure Container Registry, but any supported registry could be used.

The base image update automatically retriggers the task run when the `node` image is updated. As seen here, not all updates are wanted.

## Next steps

- [Create a gated import for the base image](./tasks-consume-public-content-gated-update.md)

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
