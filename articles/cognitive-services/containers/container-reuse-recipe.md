---
title: Docker container recipes
titleSuffix: Azure Cognitive Services
description: Learn how to create Cognitive Services Containers for reuse
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.topic: article 
ms.date: 05/16/2019
ms.author: diberry
#As a potential customer, I want to know how to configure containers so I can reuse them.

# SME: Siddhartha Prasad <siprasa@microsoft.com>
---

# Recipe: Create containers for reuse

Use these container recipes to create Cognitive Services Containers that can be reused. Containers can be built with some or all configuration settings so that they are not needed when the container is started.

Once you have this new layer of container (with settings), and you have tested it locally, you can store the container in a container registry. When the container starts, it will only need those settings that are not currently stored in the container. The private registry container provides configuration space for you to pass those settings in.

## Docker run syntax

Any `docker run` examples in this document assume a Windows console with a `^` line continuation character. Consider the following for your own use:

* Do not change the order of the arguments unless you are very familiar with docker containers.
* If you are using an operating system other than Windows, or a console other than Windows console, use the correct console/terminal, folder syntax for mounts, and line continuation character for your console and system.  Because the Cognitive Services container is a Linux operating system, the target mount uses a Linux-style folder syntax.
* `Docker run` examples use the directory off the `c:` drive to avoid any permission conflicts on Windows. If you need to use a specific directory as the input directory, you may need to grant the docker service permission. 

## Store no configuration settings in image

The example `docker run` commands for each service do not store any configuration settings in the container. When you start the container from a console or registry service, those values need to passed in. The private registry container provides configuration space for you to pass those settings in.

## Reuse recipe: store all configuration settings 

In order to store all configuration settings, create a `Dockerfile` with those settings. 

Issues with this approach:

* The new container has a separate name and tag from the original container.
* In order to change these settings, you will have to change the values of the Dockerfile, rebuild the image, and republish to your registry. 
* If someone gets access to your container registry or your local host, they can run the container and use the Cognitive Services endpoints. 
* If your Cognitive Service doesn't require input mounts, don't add the `COPY` lines to your Dockerfile.

Create Dockerfile, pulling from the existing Cognitive Services container you want to use, then use docker commands in the Dockerfile to set or pull in information the container needs.

This example:

* Sets the billing endpoint, `{BILLING_ENDPOINT}` from the host's environment key using `ENV`.
* Sets the billing api key, `{ENDPOINT_KEY}` from the host's environment key using `ENV.
* Copies the Language Understanding (LUIS) model file from the host's file system using `COPY`. The LUIS container supports more than one model. Make sure to copy each model if they are stored in separate folders. If all models are stored in the same folder, you all need one `COPY` statement.

```Dockerfile
FROM <container-registry>/<cognitive-service-container-name>:<tag>
ENV billing={BILLING_ENDPOINT}
ENV apikey={ENDPOINT_KEY}
COPY {LUIS_MODEL_1} /input/
COPY {LUIS_MODEL_1} /input/ 
```

Build and run the container locally or from your [private registry container](#how-to-use-container-reuse-recipes-for-your-private-registry) as needed. 

## How to use container reuse recipes on your local host

To build the Docker file, replace `<your-image-name>` with the new name of the image, then use: 

```console
docker build -t <your-image-name> .
```

To run the image:

```console
docker run -rt <your-image-name>
```


## How to use container reuse recipes for your private registry

Follow the [steps](#how-to-steps) to use the Dockerfile and place the new image in your private container registry.  


1. Create a `Dockerfile` with the text from reuse recipe. A `Dockerfile` doesn't have an extension. 

1. Replace any values in the angle brackets with your own values. 

1. Build the file into an image at the command line or terminal, using the following command. Replace the values in the angle brackets, `<>`, with your own container name and tag.  
1. 
    ```Bash
    docker build -t <your-new-container-name>:<your-new-tag-name> .
    ```

1. Sign in to your private registry with Azure CLI from command line or terminal.

    Replace the values in the angle brackets, `<myregistry>`, with your own registry name.  

    ```azure-cli
    az acr login --name <myregistry>
    ```

    You can also sign in with docker login if you assigned a service principal.

    ```Bash
    docker login <myregistry>.azurecr.io
    ```

1. Create an alias of the image using the `docker tag` command. Replace the values in the angle brackets, `<myregistry>`, with your own registry name. A subcategory is optional but recommended for organizing your containers. The image in your registry doesn't have to have the same name as the local host image name but it is helpful. 

    ```Bash
    docker tag <your-new-container-name> <myregistry>.azurecr.io/<subcategory>/<your-new-container-name-in-registry>
    ```

1. Push the new image to your private container registry.

    ```Bash
    docker push <myregistry>.azurecr.io/<subcategory>/<your-new-container-name-in-registry>
    ```

## Store input and out configuration settings

Bake in input params only

FROM containerpreview.azurecr.io/microsoft/cognitive-services-luis:<tag>
COPY luisModel1 /input/
COPY luisModel2 /input/


## Store all configuration settings

If you are a single manager of the container, you may want to store all settings in the container. The new, resulting container will not need any variables passed in to run. 

Issues with this approach:

* In order to change these settings, you will have to change the values of the Dockerfile and rebuild the file. 
* If someone gets access to your container registry or your local host, they can run the container and use the Cognitive Services endpoints. 

The following _partial_ Dockerfile shows how to statically set the values for billing and model. This example uses the 

```Dockerfile
FROM <container-registry>/<cognitive-service-container-name>:<tag>
ENV billing=<billing value>
ENV apikey=<apikey value>
COPY luisModel1 /input/
COPY luisModel2 /input/
```