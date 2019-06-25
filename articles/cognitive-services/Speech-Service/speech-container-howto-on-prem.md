---
title: Install Speech containers
titleSuffix: Azure Cognitive Services
description: Install and run speech containers. Speech-to-text transcribes audio streams to text in real time that your applications, tools, or devices can consume or display. Text-to-speech converts input text into human-like synthesized speech.  
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 06/24/2019
ms.author: dapine
---

# Deploy the Speech container to a Kubernetes cluster On-Premises

Learn how to deploy a speech container with the text-to-speech and speech-to-text images to an on-premises Kubernetes cluster. This procedure demonstrates how to deploy a helm chart to a Kubernetes cluster, configure the various images within the container and test that the services are available in an automated fashion.

## Prerequisites

This procedure requires several tools that must be installed and run locally. Do not use Azure Cloud shell. 

* Use an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* [Git](https://git-scm.com/downloads) for your operating system so you can clone the [sample](https://github.com/Azure-Samples/cognitive-services-containers-samples) used in this procedure. 
* Install the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).
* [Docker engine](https://www.docker.com/products/docker-engine) and validate that the Docker CLI works in a console window.
* Install the [Kubernetes CLI](https://kubernetes.io/docs/tasks/tools/install-kubectl/) (kubectl v1.12.2-v1.14.1).
* Install the [Helm](https://helm.sh/docs/using_helm/#installing-helm) client, the Kubernetes package manager (v2.12.3-v2.14.0).
    * Install the Helm server, [Tiller](https://helm.sh/docs/install/#installing-tiller) (`helm init`).
* An Azure resource with the correct pricing tier. Not all pricing tiers work with this container:
    * **Cognitive Services** resource with the S0 pricing tier.

## Helm Charts

The *helm chart* contains the configuration of which docker images to pull from containerpreview.azurecr.io.

> A helm chart is a collection of files that describe a related set of Kubernetes resources. A single chart might be used to deploy something simple, like a memcached pod, or something complex, like a full web app stack with HTTP servers, databases, caches, and so on. <cite>[--Helm](https://helm.sh/docs/developing_charts/)</cite>

## Recommended Host Computer Configuration

Please see the [Speech Service container computing](./speech-container-howto#the-host-computer) resource as a reference. This Helm chart automatically calculates CPU and memory requirements base on how many decodes (concurrent requests) that user specifies and also whether optimization for audio/text input is enabled. This Helm chart sets 2 concurrent requests and optimization disabled as default

| Service | CPU / Container | Memory / Container |
|--|--|--|
| **Speech-to-Text** | 1 decoder requires a minimum of 1,150 millicores<br>If the `optimizedForAudioFile` is enabled, then 1,950 millicores is required. (support 2 decoder by default) | Required: 2GB<br>Limited:  4GB |
| **Text-to-Speech** | 1 concurrent request requires a minimum of 500 millicores<br>If the `optimizedForTextFile` is enabled, then 1,000 millicores is required. (support 2 concurrent requests by default) | Required: 1GB<br> Limited: 2GB |


Steps to Run Onprem Speech Service in K8S/helm

1.	To deploy Speech Service in kubernetes cluster, two sample files are provided as a reference under dir **speech-onprem/tests**
    * *containerpreview-sample-deployment.yaml*
    * *containerpreview-multi-decoders-sample-deployment.yaml*
      
Both of them pull the docker images of Speech Service from containerpreview.azurecr.io. To use them, please make sure you have permission to access.

    ```console
    docker login containerpreview.azurecr.io
    ```

https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create

    ```console
    kubectl create secret generic containerpreview --from-file=.dockerconfigjson=~/.docker/config.json --type=kubernetes.io/dockerconfigjson
    ```

https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get

    ```console
    kuberctl get secrets
    ```

    ```console
    TODO: Output
    ```

    ```console
    --set speechToText.image.pullSecrets={<your secret name>},textToSpeech.image.pullSecrets={<your secret name>}
    ```

https://helm.sh/docs/helm/#helm-install

    ```console
    helm install <local path to helm chart YAML> \
        --values <local path to custom values YAML> \
        --name <name>
    ```

    ```console
    kubectl get all
    ```

https://helm.sh/docs/helm/#helm-test

    ```console
    helm test
    ```


If you DON’T have docker repo secret setup ready in Kubernetes cluster, follow below steps to create one in Kubernetes cluster.
Run this command to login


Run command


     containerpreview is the secret name created in Kubernetes cluster. 
     That is the name used by containerpreview-sample-deployment.yaml and containerpreview-multi-decoders-sample-deployment.yaml.
Run this command to verify


output




If you have docker repo secret setup already, please feel free to use it directly when installing speech-onprem Helm chart.
To apply your own secret, add below argument after helm install command in Step.3.

3.	Install speech-onprem helm chart 
Run command:

or

i.e.

4.	The K8S deployment takes a bit while. Confirm speech-to-text and text-to-speech pods and service are properly deployed and ready
Run command:                    

i.e.
                 

5.	To verify speech-to-text and text-to-speech services are ready and on, Helm Test feature is enabled in this helm chart.
Run command:

i.e.

   You can expect to see something like
    
   User can also choose to verify Speech Service by hitting endpoints from browser. From above sample, endpoints are:
   Speech-to-text:  51.143.59.79:80
   Text-to-speech: 40.91.92.231:80 

6.	To get more details about how to customize helm chart. Please take a look at speech-onprem/README.md file.


## Next steps

* Review [Configure containers](speech-container-configuration.md) for configuration settings
* Use more [Cognitive Services Containers](../cognitive-services-container-support.md)
