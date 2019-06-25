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

> [!NOTE]
> 

```console
docker login containerpreview.azurecr.io
```

https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create

```console
kubectl create secret generic containerpreview --from-file=.dockerconfigjson=~/.docker/config.json --type=kubernetes.io/dockerconfigjson
```

```console
secret "containerpreview" created
```

https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get

```console
kuberctl get secrets
```

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
helm install <local path to helm chart YAML> \
    --values <local path to custom values YAML> \
    --name <name>
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
RUNNING:    speech-to-text-readiness-test
PASSED:     speech-to-text-readiness-test
RUNNING:    text-to-speech-readiness-test
PASSED:     text-to-speech-readiness-test
```


i.e.

   You can expect to see something like
    
   User can also choose to verify Speech Service by hitting endpoints from browser. From above sample, endpoints are:
   Speech-to-text:  51.143.59.79:80
   Text-to-speech: 40.91.92.231:80 

## Customizing helm charts

### Speech (umbrella chart)

> [!NOTE]
> Values in the top-level "umbrella" chart override the corresponding sub-chart values. Therefore, all on-premises customized values should be added here.

|Parameter|Description|Values|Default|
| --- | --- | --- | --- |
|`speechToText.enabled`|Specifies whether enable **speech-to-text** service| true/false| `true` |
|`speechToText.verification.enabled`| Specifies whether enable `helm test` capability for **speech-to-text** service | true/false | `true` |
|`speechToText.verification.image.registry`| Specifies docker image repository that `helm test` uses to test **speech-to-text** service. Helm creates separate pod inside the cluster for testing and pulls the test-use image from this registry| valid docker registry | `docker.io` (default test-use image is published here) |
|`speechToText.verification.image.repository`| Specifies docker image repository that `helm test` uses to test **speech-to-text** service. Helm test pod uses this repository to pull test-use image| valid docker image repository |`antsu/on-prem-client`|
|`speechToText.verification.image.tag`| Specifies docker image tag that used `helm test` for **speech-to-text** service. Helm test pod uses this tag to pull test-use image | valid docker image tag | `latest`|
|`speechToText.verification.image.pullByHash`| Specifies whether test-use docker image is pulled by hash.<br/> If `yes`, `speechToText.verification.image.hash` should be added, with valid image hash value. <br/> It's `false` by default.|true/false| `false`|
|`speechToText.verification.image.arguments`| Specifies the arguments to execute test-use docker image. Helm test pod passes these arguments to container when running `helm test`| valid arguments as the test docker image requires |`"./speech-to-text-client"`<br/> `"./audio/whatstheweatherlike.wav"` <br/> `"--expect=What's the weather like"`<br/>`"--host=$(SPEECH_TO_TEXT_HOST)"`<br/>`"--port=$(SPEECH_TO_TEXT_PORT)"`|
|`textToSpeech.enabled`|Specifies whether enable **text-to-speech** service| true/false| `true` |
|`textToSpeech.verification.enabled`| Specifies whether enable `helm test` capability for **text-to-speech** service | true/false | `true` |
|`textToSpeech.verification.image.registry`| Specifies docker image repository that `helm test` uses to test **text-to-speech** service. Helm creates separate pod inside the cluster for testing and pulls the test-use image from this registry| valid docker registry | `docker.io` (default test-use image is published here) |
|`textToSpeech.verification.image.repository`| Specifies docker image repository that `helm test` uses to test **text-to-speech** service. Helm test pod uses this repository to pull test-use image| valid docker image repository |*`antsu/on-prem-client`*|
|`textToSpeech.verification.image.tag`| Specifies docker image tag that used `helm test` for **text-to-speech** service. Helm test pod uses this tag to pull test-use image | valid docker image tag | `latest`|
|`textToSpeech.verification.image.pullByHash`| Specifies whether test-use docker image is pulled by hash.<br/> If `yes`, `textToSpeech.verification.image.hash` should be added, with valid image hash value. <br/> It's `false` by default.|true/false| `false`|
|`textToSpeech.verification.image.arguments`| Specifies the arguments to execute test-use docker image. Helm test pod passes these arguments to container when running `helm test`| valid arguments as the test docker image requires |`"./text-to-speech-client"`<br/> `"--input='What's the weather like'"` <br/> `"--host=$(TEXT_TO_SPEECH_HOST)"`<br/>`"--port=$(TEXT_TO_SPEECH_PORT)"`|

### Speech-to-Text (sub-chart: charts/speechToText)

> [!TIP]
> To override the "umbrella" chart, add the prefix `speechToText.` on any parameter to make it more specific. For example, it will override the corresponding parameter e.g. `speechToText.numberOfConcurrentRequest` overrides `numberOfConcurrentRequest`.

|Parameter|Description|Values|Default|
| --- | --- | --- | --- |
|`enabled`| Specifies whether enable **speech-to-text** service| true/false| `false`|
|`numberOfConcurrentRequest`| Specifies how many concurrent requests for **speech-to-text** service.<br/> This chart automatically calculate CPU and memory resources, based on this value.| int | `2` |
|`optimizeForAudioFiles`| Specifies if service needs to optimize for audio input via audio files. <br/> If `yes`, this chart will allocate more CPU resource to service. <br/> Default is `false`| true/false |`false`|
|`image.registry`| Specifies the **speech-to-text** docker image registry| valid docker image registry| `containerpreview.azurecr.io`|
|`image.repository`| Specifies the **speech-to-text** docker image repository| valid docker image repository| `microsoft/cognitive-services-speech-to-text`|
|`image.tag`| Specifies the **speech-to-text** docker image tag| valid docker image tag| `latest`|
|`image.pullSecrets`| Specifies the image secrets for pulling **speech-to-text** docker image| valid secrets name| |
|`image.pullByHash`| Specifies if pulling docker image by hash.<br/> If `yes`, `image.hash` is required to have as well.<br/> If `no`, set it as 'false'. Default is `false`.| true/false| `false`|
|`image.hash`| Specifies **speech-to-text** docker image hash. Only use it when `image.pullByHash:true`.| valid docker image hash | |
|`image.args.eula`| One of the required arguments by **speech-to-text** container, which indicates you've accepted the license.<br/> The value of this option must be: accept| `accept`, if you want to use the container | |
|`image.args.billing`| One of the required arguments by **speech-to-text** container, which specifies the billing endpoint URI<br/> The billing endpoint URI value is available on the Azure portal's Speech Overview page.|valid billing endpoint URI||
|`image.args.apikey`| One of the required arguments by **speech-to-text** container, which is used to track billing information.| valid apikey||
|`service.type`| Specifies the type of **speech-to-text** service in Kubernetes. <br/> [Kubernetes Service Types Instruction](https://kubernetes.io/docs/concepts/services-networking/service/)<br/> Default is `LoadBalancer` (please make sure you cloud provider supports) | valid Kuberntes service type | `LoadBalancer`|
|`service.port`| Specifies the port of **speech-to-text** service| int| `80`|
|`service.autoScaler.enabled`| Specifies if enable [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)<br/> If enabled, `speech-to-text-autoscaler` will be deployed in the Kubernetes cluster | true/false| `true`|
|`service.podDisruption.enabled`| Specifies if enable [Pod Disruption Budget](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/)<br/> If enabled, `speech-to-text-poddisruptionbudget` will be deployed in the Kubernetes cluster| true/false| `true`|

### Text-to-Speech (subchart: charts/textToSpeech)

> Again, no customized values in sub-chart values.yaml! <br/>
> 
> Add prefix `textToSpeech.` on any parameter below into your values yaml file/umbrella chart's values.yaml can override the corresponding parameter value. <br/>
> i.e. `textToSpeech.numberOfConcurrentRequest` overrides `numberOfConcurrentRequest`.<br/>

|Parameter|Description|Values|Default|
| --- | --- | --- | --- |
|`enabled`| Specifies whether enable **text-to-speech** service| true/false| `false`|
|`numberOfConcurrentRequest`| Specifies how many concurrent requests for **text-to-speech** service.<br/> This chart automatically calculate CPU and memory resources, based on this value.| int | `2` |
|`image.registry`| Specifies the **text-to-speech** docker image registry| valid docker image registry| `containerpreview.azurecr.io`|
|`image.repository`| Specifies the **text-to-speech** docker image repository| valid docker image repository| `microsoft/cognitive-services-text-to-speech`|
|`image.tag`| Specifies the **text-to-speech** docker image tag| valid docker image tag| `latest`|
|`image.pullSecrets`| Specifies the image secrets for pulling **text-to-speech** docker image| valid secrets name||
|`image.pullByHash`| Specifies if pulling docker image by hash.<br/> If `yes`, `image.hash` is required to have as well.<br/> If `no`, set it as 'false'. Default is `false`.| true/false| `false`|
|`image.hash`| Specifies **text-to-speech** docker image hash. Only use it when `image.pullByHash:true`.| valid docker image hash | |
|`image.args.eula`| One of the required arguments by **text-to-speecht** container, which indicates you've accepted the license.<br/> The value of this option must be: accept| `accept`, if you want to use the container | |
|`image.args.billing`| One of the required arguments by **text-to-speech** container, which specifies the billing endpoint URI<br/> The billing endpoint URI value is available on the Azure portal's Speech Overview page.|valid billing endpoint URI||
|`image.args.apikey`| One of the required arguments by **text-to-speech** container, which is used to track billing information.| valid apikey||
|`service.type`| Specifies the type of **text-to-speech** service in Kubernetes. <br/> [Kubernetes Service Types Instruction](https://kubernetes.io/docs/concepts/services-networking/service/)<br/> Default is `LoadBalancer` (please make sure you cloud provider supports) | valid Kuberntes service type | `LoadBalancer`|
|`service.port`| Specifies the port of **text-to-speech** service| int| `80`|
|`service.autoScaler.enabled`| Specifies if enable [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)<br/> If enabled, `text-to-speech-autoscaler` will be deployed in the Kubernetes cluster | true/false| `true`|
|`service.podDisruption.enabled`| Specifies if enable [Pod Disruption Budget](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/)<br/> If enabled, `text-to-speech-poddisruptionbudget` will be deployed in the Kubernetes cluster| true/false| `true`|


## Next steps

* Review [Configure containers](speech-container-configuration.md) for configuration settings
* Use more [Cognitive Services Containers](../cognitive-services-container-support.md)
