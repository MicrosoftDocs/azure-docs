---
title: Use with Kubernetes and Helm - Computer Vision
titleSuffix: Azure Cognitive Services
description: Deploy the Computer Vision container to an Azure Container Instance, and test it in a web browser.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 8/14/2019
ms.author: dapine
---

# Use with Kubernetes and Helm

One option to manage your Computer Vision containers on-premises is to use Kubernetes and Helm. Using Kubernetes and Helm to define the Recognize Text container image, we'll create a Kubernetes package. This package will be deployed to a Kubernetes cluster on-premises. Finally, we'll explore how to test the deployed services and various configuration options. For more information about running Docker containers without Kubernetes orchestration, see [install and run Recognize Text containers](computer-vision-how-to-install-containers.md).

## Prerequisites

The following prerequisites before using Computer Vision containers on-premises:

|Required|Purpose|
|--|--|
| Azure Account | If you don't have an Azure subscription, create a [free account][free-azure-account] before you begin. |
| Container Registry access | In order for Kubernetes to pull the docker images into the cluster, it will need access to the container registry. You're required to [request access to the container registry][vision-preview-access] first. |
| Kubernetes CLI | The [Kubernetes CLI][kubernetes-cli] is required for managing the shared credentials from the container registry. Kubernetes is also needed before Helm, which is the Kubernetes package manager. |
| Helm CLI | As part of the [Helm CLI][helm-install] install, you'll also need to initialize Helm, which will install [Tiller][tiller-install]. |
| Computer Vision resource |In order to use the container, you must have:<br><br>An Azure **Computer Vision** resource and the associated API key the endpoint URI. Both values are available on the Overview and Keys pages for the resource and are required to start the container.<br><br>**{API_KEY}**: One of the two available resource keys on the **Keys** page<br><br>**{ENDPOINT_URI}**: The endpoint as provided on the **Overview** page|

[!INCLUDE [Gathering required parameters](../containers/includes/container-gathering-required-parameters.md)]

### The host computer

[!INCLUDE [Host Computer requirements](../../../includes/cognitive-services-containers-host-computer.md)]

### Container requirements and recommendations

[!INCLUDE [Container requirements and recommendations](includes/container-requirements-and-recommendations.md)]

## Connect to the Kubernetes cluster

The host computer is expected to have an available Kubernetes cluster. See this tutorial on [deploying a Kubernetes cluster](../../aks/tutorial-kubernetes-deploy-cluster.md) for a conceptual understanding of how to deploy a Kubernetes cluster to a host computer.

### Sharing Docker credentials with the Kubernetes cluster

To allow the Kubernetes cluster to `docker pull` the configured image(s) from the `containerpreview.azurecr.io` container registry, you need to transfer the docker credentials into the cluster. Execute the [`kubectl create`][kubectl-create] command below to create a *docker-registry secret* based on the credentials provided from the container registry access prerequisite.

From your command-line interface of choice, run the following command. Be sure to replace the `<username>`, `<password>`, and `<email-address>` with the container registry credentials.

```console
kubectl create secret docker-registry containerpreview \
    --docker-server=containerpreview.azurecr.io \
    --docker-username=<username> \
    --docker-password=<password> \
    --docker-email=<email-address>
```

> [!NOTE]
> If you already have access to the `containerpreview.azurecr.io` container registry, you could create a Kubernetes secret using the generic flag instead. Consider the following command that executes against your Docker configuration JSON.
> ```console
>  kubectl create secret generic containerpreview \
>      --from-file=.dockerconfigjson=~/.docker/config.json \
>      --type=kubernetes.io/dockerconfigjson
> ```

The following output is printed to the console when the secret has been successfully created.

```console
secret "containerpreview" created
```

To verify that the secret has been created, execute the [`kubectl get`][kubectl-get] with the `secrets` flag.

```console
kuberctl get secrets
```

Executing the `kubectl get secrets` prints all the configured secrets.

```console
NAME                  TYPE                                  DATA      AGE
containerpreview      kubernetes.io/dockerconfigjson        1         30s
```

## Configure Helm chart values for deployment

Start by creating a folder named *text-recognizer*, copy and paste the following YAML content into a new file named `Chart.yml`.

```yaml
apiVersion: v1
name: text-recognizer
version: 1.0.0
description: A Helm chart to deploy the microsoft/cognitive-services-recognize-text to a Kubernetes cluster
```

Next, we'll configure our Helm chart values. Copy and paste the following YAML into a file named `config-values.yaml`. For more information on customizing the **Cognitive Services Speech On-Premises Helm Chart**, see [customize helm charts](#customize-helm-charts). Replace the `billing` and `apikey` values with your own.

```yaml
# These settings are deployment specific and users can provide customizations

recognizeText:
  enabled: true
  image:
    name: cognitive-services-recognize-text
    registry: containerpreview.azurecr.io/
    repository: microsoft/cognitive-services-recognize-text
    tag: latest
    pullSecret: containerpreview # Or an existing secret
    args:
      eula: accept
      billing: # {ENDPOINT_URI}
      apikey: # {API_KEY}
```

> [!IMPORTANT]
> If the `billing` and `apikey` values are not provided, the services will expire after 15 min. Likewise, verification will fail as the services will not be available.

Finally, we need to create a *templates* folder under the *text-recognizer* folder. Copy and paste the following YAML into a file named `deployments.yaml`.

```yaml
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: text-recognizer
spec:
  template:
    metadata:
      labels:
        app: text-recognizer-app
    spec:
      containers:
      - name: {{ .Values.recognizeText.image.name}}
        image: {{.Values.recognizeText.image.registry}}{{.Values.recognizeText.image.repository}}
        ports:
        - containerPort: 5000
        env:
        - name: EULA
          value: {{ .Values.recognizeText.image.args.eula }}
        - name: billing
          value: {{ .Values.recognizeText.image.args.billing }}
        - name: apikey
          value: {{ .Values.recognizeText.image.args.apikey }}
      imagePullSecrets:
      - name: {{ .Values.recognizeText.image.pullSecret }}

--- 
apiVersion: v1
kind: Service
metadata:
  name: text-recognizer
spec:
  type: LoadBalancer
  ports:
  - port: 5000
  selector:
    app: text-recognizer-app
```

### The Kubernetes package (Helm chart)

The *Helm chart* contains the configuration of which docker image(s) to pull from the `containerpreview.azurecr.io` container registry.

> A [Helm chart][helm-charts] is a collection of files that describe a related set of Kubernetes resources. A single chart might be used to deploy something simple, like a memcached pod, or something complex, like a full web app stack with HTTP servers, databases, caches, and so on.

The provided *Helm charts* pull the docker images of the Speech Service, both text-to-speech and the speech-to-text services from the `containerpreview.azurecr.io` container registry.

## Package and Install the Helm chart on the Kubernetes cluster

To package the Helm chart use the [`helm package`][helm-package-cmd] command, given the chart name.

```console
helm package text-recognizer
```

Here is the expected output from a successful package execution:

```console
Successfully packaged chart and saved it to: .\text-recognizer-1.0.0.tgz
```

To install the *helm chart* we'll need to execute the [`helm install`][helm-install-cmd] command, replacing the `<config-values.yaml>` with the appropriate path and file name argument.

```console
helm install -f text-recognizer/config-values.yaml \
    text-recognizer-1.0.0.tgz --name text-recognizer
```

Here is an example output you might expect to see from a successful install execution:

```console
NAME:   text-recognizer
LAST DEPLOYED: Thu Aug 15 13:11:47 2019
NAMESPACE: default
STATUS: DEPLOYED

RESOURCES:
==> v1/Pod(related)
NAME                              READY  STATUS   RESTARTS  AGE
text-recognizer-669c747754-2qh5w  0/1    Pending  0         0s

==> v1/Service
NAME             TYPE          CLUSTER-IP     EXTERNAL-IP  PORT(S)         AGE
text-recognizer  LoadBalancer  10.102.195.88  localhost    5000:30842/TCP  0s

==> v1beta1/Deployment
NAME             READY  UP-TO-DATE  AVAILABLE  AGE
text-recognizer  0/1    0           0          0s
```

The Kubernetes deployment can take over several minutes to complete. To confirm that both pods and services are properly deployed and available, execute the following command:

```console
kubectl get all
```

You should expect to see something similar to the following output:

```console
// TODO : Add output
```

### Verify Helm deployment with Helm tests

The installed Helm charts define *Helm tests*, which serve as a convenience for verification. These tests validate service readiness. To verify both **recognize text** services, we'll execute the [Helm test][helm-test] command.

```console
// TODO: Probably remove this section
```

> [!IMPORTANT]
> These tests will fail if the POD status is not `Running` or if the deployment is not listed under the `AVAILABLE` column. Be patient as this can take over ten minutes to complete.

These tests will output various status results:

```console
// TODO: Probably remove this section
```

As an alternative to executing the *helm tests*, you could collect the *External IP* addresses and corresponding ports from the `kubectl get all` command. Using the IP and port, open a web browser and navigate to `http://<external-ip>:<port>:/swagger/index.html` to view the API swagger page(s).

## Customize Helm charts

Helm charts are hierarchical. Being hierarchical allows for chart inheritance, it also caters to the concept of specificity, where settings that are more specific override inherited rules.

```
TODO: Include all the Helm Chart configuration values here
```

## Next steps

For more details on installing applications with Helm in Azure Kubernetes Service (AKS), [visit here][installing-helm-apps-in-aks].

> [!div class="nextstepaction"]
> [Cognitive Services Containers][cog-svcs-containers]

<!-- LINKS - external -->
[free-azure-account]: https://azure.microsoft.com/free
[git-download]: https://git-scm.com/downloads
[azure-cli]: https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest
[docker-engine]: https://www.docker.com/products/docker-engine
[kubernetes-cli]: https://kubernetes.io/docs/tasks/tools/install-kubectl
[helm-install]: https://helm.sh/docs/using_helm/#installing-helm
[helm-install-cmd]: https://helm.sh/docs/helm/#helm-install
[helm-package-cmd]: https://helm.sh/docs/helm/#helm-pacakge
[tiller-install]: https://helm.sh/docs/install/#installing-tiller
[helm-charts]: https://helm.sh/docs/developing_charts
[kubectl-create]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[helm-test]: https://helm.sh/docs/helm/#helm-test

<!-- LINKS - internal -->
[vision-preview-access]: computer-vision-how-to-install-containers.md#request-access-to-the-private-container-registry
[vision-container-host-computer]: computer-vision-how-to-install-containers.md#the-host-computer
[installing-helm-apps-in-aks]: ../../aks/kubernetes-helm.md
[cog-svcs-containers]: ../cognitive-services-container-support.md
