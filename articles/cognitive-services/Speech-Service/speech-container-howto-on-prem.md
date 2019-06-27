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
ms.date: 06/26/2019
ms.author: dapine
---

# Deploy the Speech container to a Kubernetes cluster on-premises

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
    * **Speech** resource with F0 or Standard pricing tiers only.
    * **Cognitive Services** resource with the S0 pricing tier.

## The recommended host computer configuration

Please refer to the [Speech Service container host computer](./speech-container-howto#the-host-computer) details as a reference. This *helm chart* automatically calculates CPU and memory requirements based on how many decodes (concurrent requests) that the user specifies. Additionally, it will adjust accordingly based on whether optimizations for audio/text input are configured as `enabled`. The helm chart defaults to, 2 concurrent requests and disabling optimization.

| Service | CPU / Container | Memory / Container |
|--|--|--|
| **Speech-to-Text** | 1 decoder requires a minimum of 1,150 millicores<br>If the `optimizedForAudioFile` is enabled, then 1,950 millicores is required. (support 2 decoder by default) | Required: 2GB<br>Limited:  4GB |
| **Text-to-Speech** | 1 concurrent request requires a minimum of 500 millicores<br>If the `optimizedForTextFile` is enabled, then 1,000 millicores is required. (support 2 concurrent requests by default) | Required: 1GB<br> Limited: 2GB |

## Request access to the container registry

You must first complete and submit the [Cognitive Services Speech Containers Request form](https://aka.ms/speechcontainerspreview/) to request access to the container. 

[!INCLUDE [Request access to the container registry](../../../includes/cognitive-services-containers-request-access-only.md)]

[!INCLUDE [Authenticate to the container registry](../../../includes/cognitive-services-containers-access-registry.md)]

## Run speech service in K8s / helm

To deploy the Speech Service in a kubernetes cluster, the following YAML file will serve as the Kubernetes package specification. Create a new text file in the working directory named `.yaml`.

```yaml
# These settings are deployment specific and users can provide customizations

# speech-to-text configurations
speechToText:
  enabled: true
  numberOfConcurrentRequest: 3
  optimizeForAudioFiles: true
  image:
    registry: containerpreview.azurecr.io
    repository: microsoft/cognitive-services-speech-to-text
    tag: latest
    pullSecrets:
      - containerpreview # Or an existing secret
    args:
      eula: accept
      billing: #"< Your billing URL >"
      apikey: # < Your API Key >

# text-to-speech configurations
textToSpeech:
  enabled: true
  numberOfConcurrentRequest: 3
  optimizeForAudioFiles: false
  image:
    registry: containerpreview.azurecr.io
    repository: microsoft/cognitive-services-text-to-speech
    tag: latest
    pullSecrets:
      - containerpreview # Or an existing secret
    args:
      eula: accept
      billing: #"< Your billing URL >"
      apikey: # < Your API Key >
```

## The K8s package / helm chart

The *helm chart* contains the configuration of which docker images to pull from the **containerpreview.azurecr.io** container registry.

> A [helm chart](https://helm.sh/docs/developing_charts/) is a collection of files that describe a related set of Kubernetes resources. A single chart might be used to deploy something simple, like a memcached pod, or something complex, like a full web app stack with HTTP servers, databases, caches, and so on.

The provided *helm charts* pull the docker images of the Speech Service, both text-to-speech and the speech-to-text services from **containerpreview.azurecr.io** container registry. 

[!INCLUDE [Authenticate to the container registry](../../../includes/cognitive-services-containers-access-registry.md)]

In order to allow the Kubernetes cluster `docker pull` access of the configured image on `containerpreview.azurecr.io`, you will need to transfer the docker credentials into the cluster. Execute the [`kubectl create`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create) command below to create a generic secret based on the current docker configuration.

```console
kubectl create secret generic containerpreview --from-file=.dockerconfigjson=~/.docker/config.json --type=kubernetes.io/dockerconfigjson
```

The following output is printed to the console when the secret has been successfully created.

```console
secret "containerpreview" created
```

Next, verify that the secret has been created by executing the [`kubectl get`] with the `secrets` flag.

```console
kuberctl get secrets
```

...

```console
NAME                  TYPE                                  DATA      AGE
containerpreview      kubernetes.io/dockerconfigjson        1         30s
```

```console
--set speechToText.image.pullSecrets={<your secret name>},textToSpeech.image.pullSecrets={<your secret name>}
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

https://helm.sh/docs/helm/#helm-install

```console
helm install <local path> --values <local path to custom values YAML> --name <name>
```

```console
helm install "." --values speech-helm-chart.yaml --name on-prem-speech
```

4.	The K8S deployment takes a bit while. Confirm speech-to-text and text-to-speech pods and service are properly deployed and ready
Run command:                    

```console
kubectl get all
```         

The installed helm charts define _helm tests_ which serve as a convenience for verification. To verify that the speech-to-text and text-to-speech services are correctly deployed, configured and available, use the [helm test](https://helm.sh/docs/helm/#helm-test) feature by executing the following command:

```console
helm test 
```

These tests will output various status results:

```console
RUNNING: speech-to-text-readiness-test
PASSED: speech-to-text-readiness-test
RUNNING: text-to-speech-readiness-test
PASSED: text-to-speech-readiness-test
```


i.e.

   You can expect to see something like
    
   User can also choose to verify Speech Service by hitting endpoints from browser. From above sample, endpoints are:
   Speech-to-text:  51.143.59.79:80
   Text-to-speech: 40.91.92.231:80 

## Customizing helm charts

Helm charts are hierarchial. This allows for inheritance, it also caters to the concept of specificity, where settings that are more specific override inherited rules.

[!INCLUDE [Speech umbrella-helm-chart-config](includes/speech-umbrella-helm-chart-config.md)]

[!INCLUDE [Speech-to-Text Helm Chart Config](includes/speech-to-text-chart-config.md)]

[!INCLUDE [Text-to-Speech Helm Chart Config](includes/text-to-speech-chart-config.md)]

## Next steps

> [!div class="nextstepaction"]
> [Cognitive Services Containers](../cognitive-services-container-support.md)
