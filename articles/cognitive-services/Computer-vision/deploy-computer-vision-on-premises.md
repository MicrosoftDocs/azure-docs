---
title: Use Computer Vision container with Kubernetes and Helm
titleSuffix: Azure Cognitive Services
description: Deploy the Computer Vision container to an Azure Container Instance, and test it in a web browser.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 04/01/2020
ms.author: aahi
---

# Use Computer Vision container with Kubernetes and Helm

One option to manage your Computer Vision containers on-premises is to use Kubernetes and Helm. Using Kubernetes and Helm to define a Computer Vision container image, we'll create a Kubernetes package. This package will be deployed to a Kubernetes cluster on-premises. Finally, we'll explore how to test the deployed services. For more information about running Docker containers without Kubernetes orchestration, see [install and run Computer Vision containers](computer-vision-how-to-install-containers.md).

## Prerequisites

The following prerequisites before using Computer Vision containers on-premises:

| Required | Purpose |
|----------|---------|
| Azure Account | If you don't have an Azure subscription, create a [free account][free-azure-account] before you begin. |
| Kubernetes CLI | The [Kubernetes CLI][kubernetes-cli] is required for managing the shared credentials from the container registry. Kubernetes is also needed before Helm, which is the Kubernetes package manager. |
| Helm CLI | Install the [Helm CLI][helm-install], which is used to to install a helm chart (container package definition). |
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
kubectl get secrets
```

Executing the `kubectl get secrets` prints all the configured secrets.

```console
NAME                  TYPE                                  DATA      AGE
containerpreview      kubernetes.io/dockerconfigjson        1         30s
```

## Configure Helm chart values for deployment

Start by creating a folder named *read*, then paste the following YAML content into a new file named *Chart.yml*.

```yaml
apiVersion: v1
name: read
version: 1.0.0
description: A Helm chart to deploy the microsoft/cognitive-services-read to a Kubernetes cluster
```

To configure the Helm chart default values, copy and paste the following YAML into a file named `values.yaml`. Replace the `# {ENDPOINT_URI}` and `# {API_KEY}` comments with your own values.

```yaml
# These settings are deployment specific and users can provide customizations

read:
  enabled: true
  image:
    name: cognitive-services-read
    registry: containerpreview.azurecr.io/
    repository: microsoft/cognitive-services-read
    tag: latest
    pullSecret: containerpreview # Or an existing secret
    args:
      eula: accept
      billing: # {ENDPOINT_URI}
      apikey: # {API_KEY}
```

> [!IMPORTANT]
> If the `billing` and `apikey` values are not provided, the services will expire after 15 min. Likewise, verification will fail as the services will not be available.

Create a *templates* folder under the *read* directory. Copy and paste the following YAML into a file named `deployment.yaml`. The `deployment.yaml` file will serve as a Helm template.

> Templates generate manifest files, which are YAML-formatted resource descriptions that Kubernetes can understand. [- Helm Chart Template Guide][chart-template-guide]

```yaml
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: read
spec:
  template:
    metadata:
      labels:
        app: read-app
    spec:
      containers:
      - name: {{.Values.read.image.name}}
        image: {{.Values.read.image.registry}}{{.Values.read.image.repository}}
        ports:
        - containerPort: 5000
        env:
        - name: EULA
          value: {{.Values.read.image.args.eula}}
        - name: billing
          value: {{.Values.read.image.args.billing}}
        - name: apikey
          value: {{.Values.read.image.args.apikey}}
      imagePullSecrets:
      - name: {{.Values.read.image.pullSecret}}

--- 
apiVersion: v1
kind: Service
metadata:
  name: read
spec:
  type: LoadBalancer
  ports:
  - port: 5000
  selector:
    app: read-app
```

The template specifies a load balancer service and the deployment of your container/image for Read.

### The Kubernetes package (Helm chart)

The *Helm chart* contains the configuration of which docker image(s) to pull from the `containerpreview.azurecr.io` container registry.

> A [Helm chart][helm-charts] is a collection of files that describe a related set of Kubernetes resources. A single chart might be used to deploy something simple, like a memcached pod, or something complex, like a full web app stack with HTTP servers, databases, caches, and so on.

The provided *Helm charts* pull the docker images of the Computer Vision Service, and the corresponding service from the `containerpreview.azurecr.io` container 
registry.

## Install the Helm chart on the Kubernetes cluster

To install the *helm chart*, we'll need to execute the [`helm install`][helm-install-cmd] command. Ensure to execute the install command from the directory above the `read` folder.

```console
helm install read ./read
```

Here is an example output you might expect to see from a successful install execution:

```console
NAME: read
LAST DEPLOYED: Thu Sep 04 13:24:06 2019
NAMESPACE: default
STATUS: DEPLOYED

RESOURCES:
==> v1/Pod(related)
NAME                    READY  STATUS             RESTARTS  AGE
read-57cb76bcf7-45sdh   0/1    ContainerCreating  0         0s

==> v1/Service
NAME     TYPE          CLUSTER-IP    EXTERNAL-IP  PORT(S)         AGE
read     LoadBalancer  10.110.44.86  localhost    5000:31301/TCP  0s

==> v1beta1/Deployment
NAME    READY  UP-TO-DATE  AVAILABLE  AGE
read    0/1    1           0          0s
```

The Kubernetes deployment can take over several minutes to complete. To confirm that both pods and services are properly deployed and available, execute the following command:

```console
kubectl get all
```

You should expect to see something similar to the following output:

```console
kubectl get all
NAME                        READY   STATUS    RESTARTS   AGE
pod/read-57cb76bcf7-45sdh   1/1     Running   0          17s

NAME                   TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
service/kubernetes     ClusterIP      10.96.0.1      <none>        443/TCP          45h
service/read           LoadBalancer   10.110.44.86   localhost     5000:31301/TCP   17s

NAME                   READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/read   1/1     1            1           17s

NAME                              DESIRED   CURRENT   READY   AGE
replicaset.apps/read-57cb76bcf7   1         1         1       17s
```
<!--  ## Validate container is running -->

[!INCLUDE [Container's API documentation](../../../includes/cognitive-services-containers-api-documentation.md)]

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
[helm-install-cmd]: https://helm.sh/docs/intro/using_helm/#helm-install-installing-a-package
[helm-charts]: https://helm.sh/docs/topics/charts/
[kubectl-create]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[helm-test]: https://helm.sh/docs/helm/#helm-test
[chart-template-guide]: https://helm.sh/docs/chart_template_guide

<!-- LINKS - internal -->
[vision-container-host-computer]: computer-vision-how-to-install-containers.md#the-host-computer
[installing-helm-apps-in-aks]: ../../aks/kubernetes-helm.md
[cog-svcs-containers]: ../cognitive-services-container-support.md
