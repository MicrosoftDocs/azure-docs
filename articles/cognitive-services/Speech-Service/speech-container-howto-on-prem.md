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
ms.date: 06/27/2019
ms.author: dapine
---

# Deploy the Speech container to a Kubernetes cluster on-premises

Using Kubernetes (K8s) and Helm to define the speech-to-text and text-to-speech container images, we'll create a Kubernetes package. This package will be deployed to a Kubernetes cluster on-premises. Finally, we'll explore various configuration options and how to test the deployed services.

## Prerequisites

This procedure requires several tools that must be installed and run locally.

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

Refer to the [Speech Service container host computer](speech-container-howto#the-host-computer) details as a reference. This *helm chart* automatically calculates CPU and memory requirements based on how many decodes (concurrent requests) that the user specifies. Additionally, it will adjust based on whether optimizations for audio/text input are configured as `enabled`. The helm chart defaults to, two concurrent requests and disabling optimization.

| Service | CPU / Container | Memory / Container |
|--|--|--|
| **Speech-to-Text** | one decoder requires a minimum of 1,150 millicores<br>If the `optimizedForAudioFile` is enabled, then 1,950 millicores are required. (default: two decoders) | Required: 2 GB<br>Limited:  4 GB |
| **Text-to-Speech** | one concurrent request requires a minimum of 500 millicores<br>If the `optimizedForTextFile` is enabled, then 1,000 millicores are required. (default: two concurrent requests) | Required: 1 GB<br> Limited: 2 GB |

## Request access to the container registry

Submit the [Cognitive Services Speech Containers Request form](https://aka.ms/speechcontainerspreview/) to request access to the container. 

[!INCLUDE [Request access to the container registry](../../../includes/cognitive-services-containers-request-access-only.md)]

[!INCLUDE [Authenticate to the container registry](../../../includes/cognitive-services-containers-access-registry.md)]

## Run speech service in K8s / helm

To deploy the Speech Services in a Kubernetes cluster, the following YAML file will serve as the Kubernetes package specification.

```
// TODO: instead of having the reader create the file, instead have them `git pull` on the repo with these bits.
```

Create a new text file in the working directory named `.yaml`.

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

The *helm chart* contains the configuration of which docker images to pull from the `containerpreview.azurecr.io` container registry.

> A [helm chart](https://helm.sh/docs/developing_charts/) is a collection of files that describe a related set of Kubernetes resources. A single chart might be used to deploy something simple, like a memcached pod, or something complex, like a full web app stack with HTTP servers, databases, caches, and so on.

The provided *helm charts* pull the docker images of the Speech Service, both text-to-speech and the speech-to-text services from the `containerpreview.azurecr.io` container registry.

[!INCLUDE [Authenticate to the container registry](../../../includes/cognitive-services-containers-access-registry.md)]

### Sharing Docker credentials with the Kubernetes cluster

To allow the Kubernetes cluster to `docker pull` the configured image(s) from the `containerpreview.azurecr.io` registry, you need to transfer the docker credentials into the cluster. Execute the [`kubectl create`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create) command below to create a *generic secret* based on the current docker configuration.

```console
kubectl create secret generic containerpreview --from-file=.dockerconfigjson=~/.docker/config.json --type=kubernetes.io/dockerconfigjson
```

The following output is printed to the console when the secret has been successfully created.

```console
secret "containerpreview" created
```

To verify that the secret has been created, execute the [`kubectl get`] with the `secrets` flag.

```console
kuberctl get secrets
```

Executing the `kubectl get secrets` prints all the configured secrets.

```console
NAME                  TYPE                                  DATA      AGE
containerpreview      kubernetes.io/dockerconfigjson        1         30s
```

## Install the helm chart on the host computer

Open your command-line interface of choice at the root of the REPO. To install the *helm chart* we'll need to execute the [`helm install`](https://helm.sh/docs/helm/#helm-install) command with the source directory, replacing the `<path-to-custom-values.yaml>` and `<name>` with the appropriate arguments.

```console
helm install ./ --values <path-to-custom-values.yaml> --name <name>
```
Open your command-line interface of choice at the repository root directory.

```console
helm install ./ --values ./test/containerpreview-multi-decoders-sample-deployment.yaml --name on-prem-speech
```

```console
NAME:   on-prem-speech
LAST DEPLOYED: Thu Jun 27 10:15:49 2019
NAMESPACE: default
STATUS: DEPLOYED

RESOURCES:
==> v1/Pod(related)
NAME                             READY  STATUS   RESTARTS  AGE
speech-to-text-5dfbcd94bb-6nw64  0/1    Pending  0         0s
speech-to-text-5dfbcd94bb-mtvrh  0/1    Pending  0         0s
text-to-speech-66f848df94-xj6qd  0/1    Pending  0         0s
text-to-speech-66f848df94-xzgq7  0/1    Pending  0         0s

==> v1/Service
NAME            TYPE          CLUSTER-IP  EXTERNAL-IP  PORT(S)       AGE
speech-to-text  LoadBalancer  10.0.125.9  <pending>    80:31632/TCP  1s
text-to-speech  LoadBalancer  10.0.80.50  <pending>    80:30071/TCP  1s

==> v1beta1/PodDisruptionBudget
NAME                                MIN AVAILABLE  MAX UNAVAILABLE  ALLOWED DISRUPTIONS  AGE
speech-to-text-poddisruptionbudget  N/A            20%              0                    1s
text-to-speech-poddisruptionbudget  N/A            20%              0                    1s

==> v1beta2/Deployment
NAME            READY  UP-TO-DATE  AVAILABLE  AGE
speech-to-text  0/2    2           0          1s
text-to-speech  0/2    2           0          1s

==> v2beta2/HorizontalPodAutoscaler
NAME                       REFERENCE                  TARGETS        MINPODS  MAXPODS  REPLICAS  AGE
speech-to-text-autoscaler  Deployment/speech-to-text  <unknown>/50%  2        10       0         0s
text-to-speech-autoscaler  Deployment/text-to-speech  <unknown>/50%  2        10       0         0s


NOTES:
speech-onprem has been installed!
Release is named on-prem-speech
```

The Kubernetes deployment takes several minutes to complete. To confirm that both pods and services are properly deployed and available, execute the following command:

```console
kubectl get all
```

You should expect to see something similar to the following output:

```
NAME                                  READY     STATUS    RESTARTS   AGE
pod/speech-to-text-5dfbcd94bb-6nw64   0/1       Pending   0          36m
pod/speech-to-text-5dfbcd94bb-mtvrh   0/1       Pending   0          36m
pod/text-to-speech-66f848df94-xj6qd   0/1       Pending   0          36m
pod/text-to-speech-66f848df94-xzgq7   0/1       Pending   0          36m

NAME                     TYPE           CLUSTER-IP   EXTERNAL-IP      PORT(S)        AGE
service/kubernetes       ClusterIP      10.0.0.1     <none>           443/TCP        1d
service/speech-to-text   LoadBalancer   10.0.125.9   52.173.197.203   80:31632/TCP   36m
service/text-to-speech   LoadBalancer   10.0.80.50   23.99.250.232    80:30071/TCP   36m

NAME                             DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/speech-to-text   2         2         2            0           36m
deployment.apps/text-to-speech   2         2         2            0           36m

NAME                                        DESIRED   CURRENT   READY     AGE
replicaset.apps/speech-to-text-5dfbcd94bb   2         2         0         36m
replicaset.apps/text-to-speech-66f848df94   2         2         0         36m

NAME                                                            REFERENCE                   TARGETS         MINPODS   MAXPODS   REPLICAS   AGE
horizontalpodautoscaler.autoscaling/speech-to-text-autoscaler   Deployment/speech-to-text   <unknown>/50%   2         10        2          36m
horizontalpodautoscaler.autoscaling/text-to-speech-autoscaler   Deployment/text-to-speech   <unknown>/50%   2         10        2          36m
```

### Verify helm deployment with helm tests

The installed helm charts define *helm tests*, which serve as a convenience for verification. To verify both speech-to-text and text-to-speech services, we'll execute the [helm test](https://helm.sh/docs/helm/#helm-test) command. These tests validate service readiness.

```console
helm test on-prem-speech
```

> [!IMPORTANT]
> These tests will fail if the POD status is not `RUNNING` or if the deployment is not listed as `AVAILABLE`. Be patient as this can take several minutes.

These tests will output various status results:

```console
RUNNING: speech-to-text-readiness-test
PASSED: speech-to-text-readiness-test
RUNNING: text-to-speech-readiness-test
PASSED: text-to-speech-readiness-test
```

As an alternative to executing the *helm tests*, you could collect the external IP addresses and corresponding ports from the `kubectl get all` command. Using the IP and port, open a web browser and navigate to `http://<External IP>:<port>:/swagger/index.html` to view the API swagger page(s).

## Customizing helm charts

Helm charts are hierarchical. Being hierarchical allows for chart inheritance, it also caters to the concept of specificity, where settings that are more specific override inherited rules.

[!INCLUDE [Speech umbrella-helm-chart-config](includes/speech-umbrella-helm-chart-config.md)]

[!INCLUDE [Speech-to-Text Helm Chart Config](includes/speech-to-text-chart-config.md)]

[!INCLUDE [Text-to-Speech Helm Chart Config](includes/text-to-speech-chart-config.md)]

## Next steps

> [!div class="nextstepaction"]
> [Cognitive Services Containers](../cognitive-services-container-support.md)
