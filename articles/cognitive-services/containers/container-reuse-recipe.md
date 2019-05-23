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

Once you have this new layer of container (with settings), you can store the container in a container registry. When the container needs to be pulled and started, it will only need those settings that are not currently stored in the container.  

## Store no configuration settings

The example Docker commands for each service do not store any configuration settings in the container. When you pull and start the container from a registry service, those values need to passed in.

## Reuse recipe: store billing configuration settings 

Storing the billing information with the container allows you to pull and start the container, without having to know the billing endpoint or billing key.

Issues with this approach:

* The new container has a separate name and tag from the original container.
* In order to change these settings, you will have to change the values of the Dockerfile, rebuild the image, and republish to your registry. 
* If someone gets access to your container registry or your local host, they can run the container and use the Cognitive Services endpoints. 
* If your Cognitive Service doesn't require input mounts, don't add the `COPY` lines to your Dockerfile.


Create Dockerfile with the following text:

```Dockerfile
FROM <container-registry>/<cognitive-service-container-name>:<tag>
ENV billing=<billing value>
ENV apikey=<apikey value>
COPY luisModel1 /input/
COPY luisModel2 /input/ 
```

Use the [How to Use](#how-to-steps) to use the Dockerfile and place the new image in your private container registry. 

## How to use container reuse recipes for your private registry

1. Create a `Dockerfile` with the text from reuse recipe. A `Dockerfile` doesn't have an extension. 

1. Replace any values in the angle brackets with your own values. 

1. Build the file into an image at the command line or terminal, using the following command. Replace the values in the angle brackets, `<>`, with your own container name and tag.  
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