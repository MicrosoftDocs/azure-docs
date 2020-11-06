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
REGISTRY_BASE_ARTIFACTS=contosobaseartifacts
REGISTRY_BASE_ARTIFACTS_RG=${REGISTRY_BASE_ARTIFACTS}-rg
REGISTRY_BASE_ARTIFACTS_URL=${REGISTRY_BASE_ARTIFACTS}.azurecr.io

# ACI for hosting the deployed application
ACI=hello-world-aci
ACI_RG=${ACI}-rg
```

### Git repositories and tokens

To simulate your environment, fork the following Git repo into repository you can manage. 

* https://github.com/importing-public-content/import-baseimage-node.git

Then, update the following variables for your forked repositories.

The `:main` appended to the end of the git URLs represents the default repository branch.

```bash
GIT_NODE_IMPORT=https://github.com/<your-fork>/import-baseimage-node.git#main
```

### Create registries

Using Azure CLI commands, create a Premium tier container registry, in its own resource group:

```azurecli-interactive
az group create --name $REGISTRY_BASE_ARTIFACTS_RG --location $RESOURCE_GROUP_LOCATION
az acr create --resource-group $REGISTRY_BASE_ARTIFACTS_RG --name $REGISTRY_BASE_ARTIFACTS --sku Premium
```

## Gated imports of public content

To prevent upstream changes from breaking critical workloads, security scanning and functional tests may be added.

In this section, you create an ACR task to:

* Build a test image
* Run a functional test script `./test.sh` against the test image
* If the image tests successfully, import the public image to the **baseimages** registry

### Add automation testing

To gate any upstream content, automated testing is implemented. In this example, a `test.sh` is provided which checks the `$BACKGROUND_COLOR`. If the test fails, an `EXIT_CODE` of `1` is returned which causes the ACR task step to fail, ending the task run. The tests can be expanded in any form of tools, including logging results. The gate is managed by a pass/fail response in the script, reproduced here:

```bash
if [ ""$(echo $BACKGROUND_COLOR | tr '[:lower:]' '[:upper:]') = 'RED' ]; then
    echo -e "\e[31mERROR: Invalid Color:\e[0m" ${BACKGROUND_COLOR}
    EXIT_CODE=1
else
  echo -e "\e[32mValidation Complete - No Known Errors\e[0m"
fi
exit ${EXIT_CODE}
```

### Task YAML 

Review the `acr-task.yaml` in the `import-baseimage-node` repo, which performs the following steps:

1. Build the test base image using the following Dockerfile:
    ```dockerfile
    ARG REGISTRY_FROM_URL=
    FROM ${REGISTRY_FROM_URL}node:15-alpine
    WORKDIR /test
    COPY ./test.sh .
    CMD ./test.sh
    ```
1. When completed, validate the image by running the container, which runs `./test.sh`
1. Only if successfully completed, run the import steps, which are gated with `when: ['validate-base-image']`

```yaml
version: v1.1.0
steps:
  - id: build-test-base-image
    # Build off the base image we'll track
    # Add a test script to do unit test validations
    # Note: the test validation image isn't saved to the registry
    # but the task logs captures log validation results
    build: >
      --build-arg REGISTRY_FROM_URL={{.Values.REGISTRY_FROM_URL}}
      -f ./Dockerfile
      -t {{.Run.Registry}}/node-import:test
      .
  - id: validate-base-image
    # only continues if node-import:test returns a non-zero code
    when: ['build-test-base-image']
    cmd: "{{.Run.Registry}}/node-import:test"
  - id: pull-base-image
    # import the public image to base-artifacts
    # Override the stable tag,
    # and create a unique tag to enable rollback
    # to a previously working image
    when: ['validate-base-image']
    cmd: >
        docker pull {{.Values.REGISTRY_FROM_URL}}node:15-alpine
  - id: retag-base-image
    when: ['pull-base-image']
    cmd: docker tag {{.Values.REGISTRY_FROM_URL}}node:15-alpine {{.Run.Registry}}/node:15-alpine
  - id: retag-base-image-unique-tag
    when: ['pull-base-image']
    cmd: docker tag {{.Values.REGISTRY_FROM_URL}}node:15-alpine {{.Run.Registry}}/node:15-alpine-{{.Run.ID}}
  - id: push-base-image
    when: ['retag-base-image', 'retag-base-image-unique-tag']
    push:
    - "{{.Run.Registry}}/node:15-alpine"
    - "{{.Run.Registry}}/node:15-alpine-{{.Run.ID}}"
```

### Create task to import and test base image

```azurecli-interactive
  az acr task create \
  --name base-import-node \
  -f acr-task.yaml \
  -r $REGISTRY_BASE_ARTIFACTS \
  --context $GIT_NODE_IMPORT \
  --git-access-token $(az keyvault secret show \
                        --vault-name $AKV \
                        --name github-token \
                        --query value -o tsv) \
  --set REGISTRY_FROM_URL=${REGISTRY_PUBLIC_URL}/ \
  --assign-identity
```

Add credentials to the task for the simulated public registry:

```azurecli-interactive
az acr task credential add \
  -n base-import-node \
  -r $REGISTRY_BASE_ARTIFACTS \
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
                  --name base-import-node \
                  --registry $REGISTRY_BASE_ARTIFACTS \
                  --query identity.principalId --output tsv) \
  --secret-permissions get
```

Run the import task:

```azurecli-interactive
az acr task run -n base-import-node -r $REGISTRY_BASE_ARTIFACTS
```

> [!NOTE]
> If the task fails due to `./test.sh: Permission denied`,  ensure that the script has execution permissions, and commit back to the Git repo:
>```bash
>chmod +x ./test.sh
>```

## Update `hello-world` image to build from gated `node` image

Create an [access token][acr-tokens] to access the base-artifacts registry, scoped to `read` from the `node` repository. Then, set in the key vault:

```azurecli-interactive
az keyvault secret set \
  --vault-name $AKV \
  --name "registry-${REGISTRY_BASE_ARTIFACTS}-user" \
  --value "registry-${REGISTRY_BASE_ARTIFACTS}-user"

az keyvault secret set \
  --vault-name $AKV \
  --name "registry-${REGISTRY_BASE_ARTIFACTS}-password" \
  --value $(az acr token create \
              --name "registry-${REGISTRY_BASE_ARTIFACTS}-user" \
              --registry $REGISTRY_BASE_ARTIFACTS \
              --repository node content/read \
              -o tsv \
              --query credentials.passwords[0].value)
```

Add credentials to the **hello-world** task for the base artifacts registry:

```azurecli-interactive
az acr task credential add \
  -n hello-world \
  -r $REGISTRY \
  --login-server $REGISTRY_BASE_ARTIFACTS_URL \
  -u https://${AKV}.vault.azure.net/secrets/registry-${REGISTRY_BASE_ARTIFACTS}-user \
  -p https://${AKV}.vault.azure.net/secrets/registry-${REGISTRY_BASE_ARTIFACTS}-password \
  --use-identity [system]
```

Update the task to change the `REGISTRY_FROM_URL` to use the `BASE_ARTIFACTS` registry

```azurecli-interactive
az acr task update \
  -n hello-world \
  -r $REGISTRY \
  --set KEYVAULT=$AKV \
  --set REGISTRY_FROM_URL=${REGISTRY_BASE_ARTIFACTS_URL}/ \
  --set ACI=$ACI \
  --set ACI_RG=$ACI_RG
```

Run the **hello-world** task to change its base image dependency:

```azurecli-interactive
az acr task run -r $REGISTRY -n hello-world
```

## Update the base image with a "valid" change

1. Open the `Dockerfile` in `base-image-node` repo.
1. Change the `BACKGROUND_COLOR` to `Green` to simulate a valid change.

```Dockerfile
ARG REGISTRY_NAME=
FROM ${REGISTRY_NAME}node:15-alpine
ENV NODE_VERSION 15-alpine
ENV BACKGROUND_COLOR Green
```

Commit the change and monitor the sequence of updates:

```azurecli-interactive
watch -n1 az acr task list-runs -r $REGISTRY_PUBLIC -o table
```

Once running, type **Ctrl+C** and monitor the logs:

```azurecli-interactive
az acr task logs -r $REGISTRY_PUBLIC
```

Once complete, monitor the **base-image-import** task:

```azurecli-interactive
watch -n1 az acr task list-runs -r $REGISTRY_BASE_ARTIFACTS -o table
```

Once running, type **Ctrl+C** and monitor the logs:

```azurecli-interactive
az acr task logs -r $REGISTRY_BASE_ARTIFACTS
```

Once complete, monitor the **hello-world** task:

```azurecli-interactive
watch -n1 az acr task list-runs -r $REGISTRY -o table
```

Once running, type **Ctrl+C** and monitor the logs:

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

In your browser, go to the site, which should have a green (valid) background.

### View the gated workflow

Perform the steps in the preceding section again, with a background color of red.

1. Open the `Dockerfile` in the `base-image-node` repo
1. Change the `BACKGROUND_COLOR` to `Red` to simulate an invalid change.

```Dockerfile
ARG REGISTRY_NAME=
FROM ${REGISTRY_NAME}node:15-alpine
ENV NODE_VERSION 15-alpine
ENV BACKGROUND_COLOR Red
```

Commit the change and monitor the sequence of updates:

```azurecli-interactive
watch -n1 az acr task list-runs -r $REGISTRY_PUBLIC -o table
```

Once running, type **Ctrl+C** and monitor the logs:

```azurecli-interactive
az acr task logs -r $REGISTRY_PUBLIC
```

Once complete, monitor the **base-image-import** task:

```azurecli-interactive
watch -n1 az acr task list-runs -r $REGISTRY_BASE_ARTIFACTS -o table
```

Once running, type **Ctrl+C** and monitor the logs:

```azurecli-interactive
az acr task logs -r $REGISTRY_BASE_ARTIFACTS
```

At this point, you should see the **base-import-node** task fail validation and stop the sequence to publish a `hello-world` update. Output is similar to:

```console
[...]
2020/10/30 03:57:39 Launching container with name: validate-base-image
Validating Image
NODE_VERSION: 15-alpine
BACKGROUND_COLOR: Red
ERROR: Invalid Color: Red
2020/10/30 03:57:40 Container failed during run: validate-base-image. No retries remaining.
failed to run step ID: validate-base-image: exit status 1
```

### Publish an update to `hello-world`

Changes to the `hello-world` image will continue using the last validated `node` image.

Any additional changes to the base `node` image that pass the gated validations will trigger base image updates to the `hello-world` image.

## Cleaning up

When no longer needed, delete the resources used in this article.

```azurecli-interactive
az group delete -n $REGISTRY_RG --no-wait -y
az group delete -n $REGISTRY_PUBLIC_RG --no-wait -y
az group delete -n $REGISTRY_BASE_ARTIFACTS_RG --no-wait -y
az group delete -n $AKV_RG --no-wait -y
az group delete -n $ACI_RG --no-wait -y
```

## Next steps

In this article. you used ACR tasks to create an automated gating workflow to introduce updated base images to your environment. See related information to manage images in Azure Container Registry.


* [Recommendations for tagging and versioning container images](container-registry-image-tag-version.md)
* [Lock a container image in an Azure container registry](container-registry-image-lock.md)

[install-cli]:                  /cli/azure/install-azure-cli
[acr]:                          https://aka.ms/acr
[acr-repo-permissions]:         https://aka.ms/acr/repo-permissions
[acr-task]:                     https://aka.ms/acr/tasks
[acr-task-triggers]:            container-registry-tasks-overview.md#task-scenarios
[acr-task-credentials]:         container-registry-tasks-authentication-managed-identity.md#4-optional-add-credentials-to-the-task
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
