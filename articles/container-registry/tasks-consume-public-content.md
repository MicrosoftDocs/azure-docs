---
title: Task workflow to manage public registry content
description: In this ...
author: SteveLasker
ms.topic: article
ms.author: stevelas
ms.date: 10/28/2020
ms.custom:
---
# How to consume and maintain public content with Azure Container Registry Tasks

This article walks through an end-to-end gated workflow using [Azure Container Tasks](container-registry-tasks-overview.md) to manage public image content in a private Azure container registry. As shown in the following image, the workflow uses several ACR tasks to:

* Import public images to a private registry
* Monitor an upstream public image for updates
* Validate the updated base image and promote verified content to a private base images registry
* Automate rebulding application images that depend on the private base image


![Consuming Public Content Workflow](./media/tasks-consume-public-content/consuming-public-content-workflow.png)

The gated import workflow helps manage your organization's dependencies on externally managed artifacts - for example, images sourced from public registries including [Docker Hub][docker-hub], [GCR][gcr], [Quay][quay], [Github Container Registry][ghcr], [Microsoft Container Registry][mcr], or even other [Azure container Registries][acr]. 

For background about the risks introduced by dependencies on public content and how to use Azure Container Registry to mitigate them, see the [OCI Consuming Public Content Blog post][oci-consuming-public-content] and [Manage public content with Azure Container Registry](buffer-gate-public-content.md).

This article uses Azure CLI commands to create resources for thee workflow. Azure CLI version 2.10 or later is recommended. If you need to install or upgrade, see [Install Azure CLI][install-cli].

## Scenario overview

![import workflow components](./media/tasks-consume-public-content/consuming-public-content-objects.png)

This walk through sets up:

1. Three container registries, representing:
   * Simulated Docker Hub (`publicregistry`) to support changing the base image
   * Team registry (`contoso`) for private images
   * Company/team shared registry (`baseartifacts`) for imported public content
1. An ACR task in each registry. The tasks:  
   * Build the simulated public node image
   * Import and validate the public node image to the company/team shared registry
   * Build and deploy the `hello-world` image
1. ACR task definitions for:
1. A collections of registry credentials, which are pointers to a key vault
1. A collections of secrets, available within an `acr-task.yaml`, which are pointers to a key vault
1. A collection of configured values used within an `acr-task.yaml`
1. An Azure key vault to secure all secrets
1. An Azure container instance, which hosts the hello-world build application

## Prerequisites

* Three Azure container registries. Create three registries to represent the workflow
  * A simulated copy of docker hub for public images.
    * This allows us simulate a base image update, which would normally be initiated on [Docker Hub][docker-hub] or other public registries.
  * A development team registry, that will host one more more teams that build and manage images.
    * **Note:** [repository based RBAC (preview)][acr-repo-permissions] is now available, enabling multiple teams to share a single registry, with unique permission sets
  * A registry to host imported base artifacts.
* An Azure KeyVault for storing access keys to the registries
* An [Azure Container Instance][aci] to host the `hello-world` image.

The following steps will:

1. Configure unique values for your environment
1. Simulate a Public Registry
1. Automate building a hello-world image
1. Automate deploying to an [Azure Container Instance][aci]
1. Simulate upstream changes directly to your environment
1. Create a gated import, that validates upstream changes are appropriate for your environment

![import workflow components](./media/container-registry-consuming-public-content/consuming-public-content-objects.png)

This walk through will:

1. Configure three registries representing:
   * Simulated Docker Hub (`publicregistry`)to support changing the base image
   * Team registry (`contoso`) for private images
   * Company/team shared registry (`baseartifacts`) for imported public content
2. Configure ACR Tasks to:  
   * build the simulated public node image
   * import and validate the public node image to the company/team shared registry
   * build and deploy the hello-world image
3. ACR Task definitions, including configurations for:
4. Collection of registry credentials which can be pointers to KeyVault
5. Collection of secrets, available within an `acr-task.yaml`, which are pointers to KeyVault
6. Collection of configured values used within an `acr-task.yaml`.
7. An Azure KeyVault, securing all secrets
8. An Azure Container Instance, hosting the hello-world build application

### Set environment variables

Configure variables unique to your environment. We follow best practices for placing resources with durable content in their own resource group to minimize accidental deletion, however you can place these in a single resource group if desired.

  ```azurecli
  # Set the three registry names, unique to your environment:
  REGISTRY_PUBLIC=publicregistry
  REGISTRY_BASE_ARTIFACTS=contosobaseartifacts
  REGISTRY=contoso

  # set the location all resources will be created in:
  RESOURCE_GROUP_LOCATION=eastus

  # default resource groups
  REGISTRY_PUBLIC_RG=${REGISTRY_PUBLIC}-rg
  REGISTRY_BASE_ARTIFACTS_RG=${REGISTRY_BASE_ARTIFACTS}-rg
  REGISTRY_RG=${REGISTRY}-rg

  # fully qualified registry urls
  REGISTRY_DOCKERHUB_URL=docker.io
  REGISTRY_PUBLIC_URL=${REGISTRY_PUBLIC}.azurecr.io
  REGISTRY_BASE_ARTIFACTS_URL=${REGISTRY_BASE_ARTIFACTS}.azurecr.io
  REGISTRY_URL=${REGISTRY}.azurecr.io

  # Azure KeyVault for storing secrets
  AKV=acr-task-credentials
  AKV_RG=${AKV}-rg

  # ACI for hosting the deployed application
  ACI=hello-world-aci
  ACI_RG=${ACI}-rg
  ```

### GIT repositories and tokens

To simulate your environment, fork each of these into repositories you can mange. Then, update the variables for your forked repositories.
Notice `:main` concatenated to the end of the git URLs representing the default repository branch.

```azurecli
GIT_BASE_IMAGE_NODE=https://github.com/importing-public-content/base-image-node.git#main
GIT_NODE_IMPORT=https://github.com/importing-public-content/import-baseimage-node.git#main
GIT_HELLO_WORLD=https://github.com/importing-public-content/hello-world.git#main
```

Establish a [Git Token][git-token] for ACR Tasks to clone and establish git webhooks.
See: @DAN, CAN YOU UPDATE TO A REFERENCE FOR REQUIRED PERMISSIONS?

```azurecli
GIT_TOKEN=<set-git-token-here>
```

Docker Hub Credentials  
To avoid throttling and identify requests, [create a Docker Hub token][docker-hub-tokens]

```azurecli
REGISTRY_DOCKERHUB_USER=<yourusername>
REGISTRY_DOCKERHUB_PASSWORD=<yourtoken>
```

### Create Resources

Create the three registries:

```azurecli
az group create --name $REGISTRY_PUBLIC_RG --location $RESOURCE_GROUP_LOCATION
az acr create --resource-group $REGISTRY_PUBLIC_RG --name $REGISTRY_PUBLIC --sku Premium

az group create --name $REGISTRY_BASE_ARTIFACTS_RG --location $RESOURCE_GROUP_LOCATION
az acr create --resource-group $REGISTRY_BASE_ARTIFACTS_RG --name $REGISTRY_BASE_ARTIFACTS --sku Premium

az group create --name $REGISTRY_RG --location $RESOURCE_GROUP_LOCATION
az acr create --resource-group $REGISTRY_RG --name $REGISTRY --sku Premium
```

Create a KeyVault for secrets

```azurecli
az group create --name $AKV_RG --location $RESOURCE_GROUP_LOCATION
az keyvault create --resource-group $AKV_RG --name $AKV
```

Create a Docker Hub token  
To avoid throttling and identify requests, [create a Docker Hub token][docker-hub-tokens]

```azurecli
az keyvault secret set \
--vault-name $AKV \
--name registry-dockerhub-user \
--value $REGISTRY_DOCKERHUB_USER

az keyvault secret set \
--vault-name $AKV \
--name registry-dockerhub-password \
--value $REGISTRY_DOCKERHUB_PASSWORD
```

Set and Verify a Git token within KeyVault

```azurecli
az keyvault secret set --vault-name $AKV --name github-token --value $GIT_TOKEN
az keyvault secret show --vault-name $AKV --name github-token --query value -o tsv
```

Create a Resource Group for an Azure Container Instance

```azurecli
az group create --name $ACI_RG --location $RESOURCE_GROUP_LOCATION
```

### Create public node base image

To simulate the node image on Docker Hub, create an [ACR Task][acr-task] to build and maintain the public image. This allows simulating changes by the node image maintainers.

```azurecli
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

To avoid Docker throttling, add [Docker Hub credentials][docker-hub-tokens]:

```azurecli
az acr task credential add \
  -n node-public \
  -r $REGISTRY_PUBLIC \
  --login-server $REGISTRY_DOCKERHUB_URL \
  -u https://${AKV}.vault.azure.net/secrets/registry-dockerhub-user \
  -p https://${AKV}.vault.azure.net/secrets/registry-dockerhub-password \
  --use-identity [system]
```

Grant access to ACR for reading values from KeyVault

```azurecli
az keyvault set-policy \
  --name $AKV \
  --resource-group $AKV_RG \
  --object-id $(az acr task show \
                  --name node-public \
                  --registry $REGISTRY_PUBLIC \
                  --query identity.principalId --output tsv) \
  --secret-permissions get
```

[Tasks can be triggered][acr-task-triggers] by git commits, base image updates, scheduled runs or manually executed.
Run the task to generate the `node` image

```azurecli
az acr task run -r $REGISTRY_PUBLIC -n node-public
```

List the image in the simulated public registry

```azurecli
az acr repository show-tags -n $REGISTRY_PUBLIC --repository node
```

## Create the hello-world image

Based on the simulated public node image, build a hello-world image.

### Create a Token for access to the "public" registry

Using [ACR Tokens][acr-tokens], create access tokens, scoped to `pull`

```azurecli
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
```

### Create an ACR Token for access by ACI to pull the image

A token to the registry with `hello-world` is created. Permissions are scoped to read (pull)

```azurecli
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

### Create and maintain a `hello-world` image using ACR Tasks

Simulating a public registry, which could be docker hub, provide credentials using [acr task credentials][acr-task-credentials]. Since the registry is an ACR, use the token created above. The [acr task credentials][acr-task-credentials] may be used to pass docker credentials to any registry, including Docker Hub.

Within the `acr-task.yaml`, we deploy the newly built image to ACI. The resource group was created above. By calling `az container create` with only a difference in the `image:tag`, the same instance is used.

```azurecli
az acr task create \
  -n hello-world \
  -r $REGISTRY \
  -f acr-task.yaml \
  --context $GIT_HELLO_WORLD \
  --git-access-token $(az keyvault secret show \
                        --vault-name $AKV \
                        --name github-token \
                        --query value -o tsv) \
  --set REGISTRY_FROM_URL=${REGISTRY_PUBLIC_URL}/ \
  --set KEYVAULT=$AKV \
  --set ACI=$ACI \
  --set ACI_RG=$ACI_RG \
  --assign-identity
```

Add credentials for our Public Registry

```azurecli
az acr task credential add \
  -n hello-world \
  -r $REGISTRY \
  --login-server $REGISTRY_PUBLIC_URL \
  -u https://${AKV}.vault.azure.net/secrets/registry-${REGISTRY_PUBLIC}-user \
  -p https://${AKV}.vault.azure.net/secrets/registry-${REGISTRY_PUBLIC}-password \
  --use-identity [system]
```

Grant access to read values from the KeyVault

```azurecli
az keyvault set-policy \
  --name $AKV \
  --resource-group $AKV_RG \
  --object-id $(az acr task show \
                  --name hello-world \
                  --registry $REGISTRY \
                  --query identity.principalId --output tsv) \
  --secret-permissions get
```

Grant the task access to create and manage ACI by granting access to the resource group:

```azurecli
az role assignment create \
  --assignee $(az acr task show \
  --name hello-world \
  --registry $REGISTRY \
  --query identity.principalId --output tsv) \
  --scope $(az group show -n $ACI_RG --query id -o tsv) \
  --role owner
```

With the task created, run the task to build/deploy the hello-world image:

```azurecli
az acr task run -r $REGISTRY -n hello-world
```

Once created, browse the site hosting the `hell-world` image.

```bash
explorer.exe "http://"$(az container show \
  --resource-group $ACI_RG \
  --name ${ACI} \
  --query ipAddress.ip \
  --out tsv)
```

## Update the base image with a "bad" change

Open the `Dockerfile` in base-image-node repo
Change the `BACKGROUND_COLOR` to `Red` to simulate a change that would break our environment.

```Dockerfile
ARG REGISTRY_NAME=
FROM ${REGISTRY_NAME}node:15-alpine
ENV NODE_VERSION 15-alpine
ENV BACKGROUND_COLOR Red
```

Commit the change and watch for ACR Tasks to automatically start building.

Watch for the task to start executing:

```azurecli
watch -n1 az acr task list-runs -r $REGISTRY_PUBLIC
```

You should eventually see STATUS `Succeeded` based on a TRIGGER of `Commit`:

```azurecli
RUN ID    TASK      PLATFORM    STATUS     TRIGGER    STARTED               DURATION
--------  --------  ----------  ---------  ---------  --------------------  ----------
ca4       hub-node  linux       Succeeded  Commit     2020-10-24T05:02:29Z  00:00:22
```

Type `CTRL-C` to exit the watch command, then view the logs for the most recent run:

```azurecli
az acr task logs -r $REGISTRY_PUBLIC
```

Once the node image is completed, `watch` for ACR Tasks to automatically start the hello-world image:

```azurecli
watch -n1 az acr task list-runs -r $REGISTRY
```

You should eventually see STATUS `Succeeded` based on a TRIGGER of `Image Update`

```azurecli
RUN ID    TASK         PLATFORM    STATUS     TRIGGER       STARTED               DURATION
--------  -----------  ----------  ---------  ------------  --------------------  ----------
dau       hello-world  linux       Succeeded  Image Update  2020-10-24T05:08:45Z  00:00:31
```

Type `CTRL-C` to exit the watch command, then view the logs for the most recent run:

```azurecli
az acr task logs -r $REGISTRY
```

Once completed, browse the site hosting the updated `hell-world` image, which should have a red (broken) background.

```bash
explorer.exe "http://"$(az container show \
  --resource-group $ACI_RG \
  --name ${ACI} \
  --query ipAddress.ip \
  --out tsv)
```

## Checking in

At this point, you've created a `hello-world` image that is automatically built on git commits, and changes to the base `node` image. While we've built against a base image in ACR, this could be any supported registry.

The ACR Task base image update trigger automatically re-executes as the node image is updated. As seen here, not all updates are wanted.

## Gated imports of public content

To prevent upstream changes from breaking critical workloads, security scanning and functional tests may be addedd.

This section covers:

* Build a test image
* Run a functional test script `./test.sh` against the test image
* If the image tests successfully, import the public image to the **baseimages** registry

### Write automation testing

To gate any upstream content, automated testing is implemented. In this example, a `test.sh` is provided which checks the `$BACKGROUND_COLOR`. If the test fails, an `EXIT_CODE` of `1` is returned which causes the ACR Task step to fail, ending the task run. The tests can be expanded in any form of tools, including logging results. The gate is managed by a pass/fail response.

```bash
if [ ""$(echo $BACKGROUND_COLOR | tr '[:lower:]' '[:upper:]') = 'RED' ]; then
    echo -e "\e[31mERROR: Invalid Color:\e[0m" ${BACKGROUND_COLOR}
    EXIT_CODE=1
else
  echo -e "\e[32mValidation Complete - No Known Errors\e[0m"
fi
exit ${EXIT_CODE}
```

The `acr-task.yaml` performs the following steps:

* Build the test base image using the following dockerfile:
    ```dockerfile
    ARG REGISTRY_FROM_URL=
    FROM ${REGISTRY_FROM_URL}node:15-alpine
    WORKDIR /test
    COPY ./test.sh .
    CMD ./test.sh
    ```
* When completed, validate the image by running the container, which runs `./test.sh`
* Only if successfully completed, run the import steps, which are gated with `when: ['validate-base-image']`

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

Create an ACR Task to import and test the node base image

```azurecli
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

Add credentials for our public registry

```azurecli
az acr task credential add \
  -n base-import-node \
    -r $REGISTRY_BASE_ARTIFACTS \
  --login-server $REGISTRY_PUBLIC_URL \
  -u https://${AKV}.vault.azure.net/secrets/registry-${REGISTRY_PUBLIC}-user \
  -p https://${AKV}.vault.azure.net/secrets/registry-${REGISTRY_PUBLIC}-password \
  --use-identity [system]
```

Grant access to read values from the KeyVault

```azurecli
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

```azurecli
az acr task run -n base-import-node -r $REGISTRY_BASE_ARTIFACTS
```

If the task fails due to `./test.sh: Permission denied` assure the script has execution permissions and commit back to the git repo:

```bash
chmod +x ./test.sh
```

## Update the hello-world image to build from the gated node image

Add a `AcrPull` token to access the base-artifacts registry

```azurecli
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

Add credentials for our Public Registry

```azurecli
az acr task credential add \
  -n hello-world \
    -r $REGISTRY \
  --login-server $REGISTRY_BASE_ARTIFACTS_URL \
  -u https://${AKV}.vault.azure.net/secrets/registry-${REGISTRY_BASE_ARTIFACTS}-user \
  -p https://${AKV}.vault.azure.net/secrets/registry-${REGISTRY_BASE_ARTIFACTS}-password \
  --use-identity [system]
```

Change the REGISTRY_FROM_URL to use the BASE_ARTIFACTS registry

```azurecli
az acr task update \
  -n hello-world \
  -r $REGISTRY \
  --set KEYVAULT=$AKV \
  --set REGISTRY_FROM_URL=${REGISTRY_BASE_ARTIFACTS_URL}/ \
  --set ACI=$ACI \
  --set ACI_RG=$ACI_RG
```

Run the hello-world task to change it's base image dependency

```azurecli
az acr task run -r $REGISTRY -n hello-world
```

## Update the base image with a "valid" change

Open the `Dockerfile` in base-image-node repo
Change the `BACKGROUND_COLOR` to `Green` to simulate a valid change.

```Dockerfile
ARG REGISTRY_NAME=
FROM ${REGISTRY_NAME}node:15-alpine
ENV NODE_VERSION 15-alpine
ENV BACKGROUND_COLOR Green
```

Commit the change and monitor the sequence of updates

```azurecli
watch -n1 az acr task list-runs -r $REGISTRY_PUBLIC
```

Once running, `ctrl+C` and monitor the logs

```azurecli
az acr task logs -r $REGISTRY_PUBLIC
```

Once complete, monitor the base-image-import task

```azurecli
watch -n1 az acr task list-runs -r $REGISTRY_BASE_ARTIFACTS
```

Once running, `ctrl+C` and monitor the logs

```azurecli
az acr task logs -r $REGISTRY_BASE_ARTIFACTS
```

Once complete, monitor the hello-world task

```azurecli
watch -n1 az acr task list-runs -r $REGISTRY
```

Once running, `ctrl+C` and monitor the logs

```azurecli
az acr task logs -r $REGISTRY
```

Once complete, view the ACI hello-world image.

```bash
explorer.exe "http://"$(az container show \
  --resource-group $ACI_RG \
  --name ${ACI} \
  --query ipAddress.ip \
  --out tsv)
```

### View the gated workflow

Perform the above steps again, with a background color of red

Open the `Dockerfile` in base-image-node repo
Change the `BACKGROUND_COLOR` to `Red` to simulate a valid change.

```Dockerfile
ARG REGISTRY_NAME=
FROM ${REGISTRY_NAME}node:15-alpine
ENV NODE_VERSION 15-alpine
ENV BACKGROUND_COLOR Red
```

Commit the change and monitor the sequence of updates

```azurecli
watch -n1 az acr task list-runs -r $REGISTRY_PUBLIC
```

Once running, `ctrl+C` and monitor the logs

```azurecli
az acr task logs -r $REGISTRY_PUBLIC
```

Once complete, monitor the base-image-import task

```azurecli
watch -n1 az acr task list-runs -r $REGISTRY_BASE_ARTIFACTS
```

Once running, `ctrl+C` and monitor the logs

```azurecli
az acr task logs -r $REGISTRY_BASE_ARTIFACTS
```

At this point, you should see base-import-node fail validation and stop the sequence to publish a hello-world update.

### Publish an update to hello-world

Changes to the hello-world image will continue using the last validated node image.

Any additional changes to the base-node image that pass the gated validations will trigger base-updates to the hello-world image.

## Cleaning up

```azurecli
az group delete -n $REGISTRY_RG --no-wait -y
az group delete -n $REGISTRY_PUBLIC_RG --no-wait -y
az group delete -n $REGISTRY_BASE_ARTIFACTS_RG --no-wait -y
az group delete -n $AKV_RG --no-wait -y
az group delete -n $ACI_RG --no-wait -y
```

## Next steps

* [Adopt tagging scheme for base image updates](container-registry-image-tag-version.md)
* [Build images from stable service tags - can continue to receive security patches and framework updates.](container-registry-image-tag-version.md)
* [Protect images using Image/tag locking](container-registry-image-lock.md)

[install-cli]:                  /cli/azure/install-azure-cli
[acr]:                          https://aka.ms/acr
[acr-repo-permissions]:         https://aka.ms/acr/repo-permissions
[acr-task]:                     https://aka.ms/acr/tasks
[acr-task-triggers]:            https://docs.microsoft.com/en-us/azure/container-registry/container-registry-tasks-overview#task-scenarios
[acr-task-credentials]:         https://docs.microsoft.com/en-us/azure/container-registry/container-registry-tasks-authentication-managed-identity#4-optional-add-credentials-to-the-task
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
[oci-consuming-public-content]: https://docs.google.com/document/d/1fxayMznIkszBI9Y2S3KGSyi2hFMwUIwDfn3D2wQcye4/edit?usp=sharing
[opa]:                          https://www.openpolicyagent.org/
[quay]:                         https://quay.io


## Next steps

In this tutorial, you learned how to ....


