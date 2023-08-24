---
title: Recipes for Docker containers
titleSuffix: Azure AI services
description: Learn how to build, test, and store containers with some or all of your configuration settings for deployment and reuse.
services: cognitive-services
author: aahill
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.topic: how-to
ms.date: 10/28/2021
ms.author: aahi
#Customer intent: As a potential customer, I want to know how to configure containers so I can reuse them.
---

# Create containers for reuse

Use these container recipes to create Azure AI services containers that can be reused. Containers can be built with some or all configuration settings so that they are _not_ needed when the container is started.

Once you have this new layer of container (with settings), and you have tested it locally, you can store the container in a container registry. When the container starts, it will only need those settings that are not currently stored in the container. The private registry container provides configuration space for you to pass those settings in.

## Docker run syntax

Any `docker run` examples in this document assume a Windows console with a `^` line continuation character. Consider the following for your own use:

* Do not change the order of the arguments unless you are very familiar with docker containers.
* If you are using an operating system other than Windows, or a console other than Windows console, use the correct console/terminal, folder syntax for mounts, and line continuation character for your console and system.  Because the Azure AI services container is a Linux operating system, the target mount uses a Linux-style folder syntax.
* `docker run` examples use the directory off the `c:` drive to avoid any permission conflicts on Windows. If you need to use a specific directory as the input directory, you may need to grant the docker service permission.

## Store no configuration settings in image

The example `docker run` commands for each service do not store any configuration settings in the container. When you start the container from a console or registry service, those configuration settings need to pass in. The private registry container provides configuration space for you to pass those settings in.

## Reuse recipe: store all configuration settings with container

In order to store all configuration settings, create a `Dockerfile` with those settings.

Issues with this approach:

* The new container has a separate name and tag from the original container.
* In order to change these settings, you will have to change the values of the Dockerfile, rebuild the image, and republish to your registry.
* If someone gets access to your container registry or your local host, they can run the container and use the Azure AI services endpoints.
* If the Azure AI service that you're using doesn't require input mounts, don't add the `COPY` lines to your Dockerfile.

Create Dockerfile, pulling from the existing Azure AI services container you want to use, then use docker commands in the Dockerfile to set or pull in information the container needs.

This example:

* Sets the billing endpoint, `{BILLING_ENDPOINT}` from the host's environment key using `ENV`.
* Sets the billing API-key, `{ENDPOINT_KEY}` from the host's environment key using `ENV.

### Reuse recipe: store billing settings with container

This example shows how to build the Language service's sentiment container from a Dockerfile.

```Dockerfile
FROM mcr.microsoft.com/azure-cognitive-services/sentiment:latest
ENV billing={BILLING_ENDPOINT}
ENV apikey={ENDPOINT_KEY}
ENV EULA=accept
```

Build and run the container [locally](#how-to-use-container-on-your-local-host) or from your [private registry container](#how-to-add-container-to-private-registry) as needed.

### Reuse recipe: store billing and mount settings with container

This example shows how to use Language Understanding, saving billing and models from the Dockerfile.

* Copies the Language Understanding (LUIS) model file from the host's file system using `COPY`.
* The LUIS container supports more than one model. If all models are stored in the same folder, you all need one `COPY` statement.
* Run the docker file from the relative parent of the model input directory. For the following example, run the `docker build` and `docker run` commands from the relative parent of `/input`. The first `/input` on the `COPY` command is the host computer's directory. The second `/input` is the container's directory.

```Dockerfile
FROM <container-registry>/<cognitive-service-container-name>:<tag>
ENV billing={BILLING_ENDPOINT}
ENV apikey={ENDPOINT_KEY}
ENV EULA=accept
COPY /input /input
```

Build and run the container [locally](#how-to-use-container-on-your-local-host) or from your [private registry container](#how-to-add-container-to-private-registry) as needed.

## How to use container on your local host

To build the Docker file, replace `<your-image-name>` with the new name of the image, then use:

```console
docker build -t <your-image-name> .
```

To run the image, and remove it when the container stops (`--rm`):

```console
docker run --rm <your-image-name>
```

## How to add container to private registry

Follow these steps to use the Dockerfile and place the new image in your private container registry.  

1. Create a `Dockerfile` with the text from reuse recipe. A `Dockerfile` doesn't have an extension.

1. Replace any values in the angle brackets with your own values.

1. Build the file into an image at the command line or terminal, using the following command. Replace the values in the angle brackets, `<>`, with your own container name and tag.  

    The tag option, `-t`, is a way to add information about what you have changed for the container. For example, a container name of `modified-LUIS` indicates the original container has been layered. A tag name of `with-billing-and-model` indicates how the Language Understanding (LUIS) container has been modified.

    ```Bash
    docker build -t <your-new-container-name>:<your-new-tag-name> .
    ```

1. Sign in to Azure CLI from a console. This command opens a browser and requires authentication. Once authenticated, you can close the browser and continue working in the console.

    ```azurecli
    az login
    ```

1. Sign in to your private registry with Azure CLI from a console.

    Replace the values in the angle brackets, `<my-registry>`, with your own registry name.  

    ```azurecli
    az acr login --name <my-registry>
    ```

    You can also sign in with docker login if you are assigned a service principal.

    ```Bash
    docker login <my-registry>.azurecr.io
    ```

1. Tag the container with the private registry location. Replace the values in the angle brackets, `<my-registry>`, with your own registry name. 

    ```Bash
    docker tag <your-new-container-name>:<your-new-tag-name> <my-registry>.azurecr.io/<your-new-container-name-in-registry>:<your-new-tag-name>
    ```

    If you don't use a tag name, `latest` is implied.

1. Push the new image to your private container registry. When you view your private container registry, the container name used in the following CLI command will be the name of the repository.

    ```Bash
    docker push <my-registry>.azurecr.io/<your-new-container-name-in-registry>:<your-new-tag-name>
    ```

## Next steps

[Create and use Azure Container Instance](azure-container-instance-recipe.md)

<!--
## Store input and output configuration settings

Bake in input params only

FROM containerpreview.azurecr.io/microsoft/cognitive-services-luis:<tag>
COPY luisModel1 /input/
COPY luisModel2 /input/

## Store all configuration settings

If you are a single manager of the container, you may want to store all settings in the container. The new, resulting container will not need any variables passed in to run. 

Issues with this approach:

* In order to change these settings, you will have to change the values of the Dockerfile and rebuild the file. 
* If someone gets access to your container registry or your local host, they can run the container and use the Azure AI services endpoints. 

The following _partial_ Dockerfile shows how to statically set the values for billing and model. This example uses the 

```Dockerfile
FROM <container-registry>/<cognitive-service-container-name>:<tag>
ENV billing=<billing value>
ENV apikey=<apikey value>
COPY luisModel1 /input/
COPY luisModel2 /input/
```

->
