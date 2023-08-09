---
title: Install existing applications with Helm in Azure Kubernetes Service (AKS)
description: Learn how to use the Helm packaging tool to deploy containers in an Azure Kubernetes Service (AKS) cluster
author: zr-msft
ms.topic: article
ms.date: 05/09/2023
ms.author: zarhoads

#Customer intent: As a cluster operator or developer, I want to learn how to deploy Helm into an AKS cluster and then install and manage applications using Helm charts.
---

# Install existing applications with Helm in Azure Kubernetes Service (AKS)

[Helm][helm] is an open-source packaging tool that helps you install and manage the lifecycle of Kubernetes applications. Similar to Linux package managers, such as *APT* and *Yum*, you can use Helm to manage Kubernetes charts, which are packages of preconfigured Kubernetes resources.

This article shows you how to configure and use Helm in a Kubernetes cluster on Azure Kubernetes Service (AKS).

## Before you begin

* This article assumes you have an existing AKS cluster. If you need an AKS cluster, create one using [Azure CLI][aks-quickstart-cli], [Azure PowerShell][aks-quickstart-powershell], or [Azure portal][aks-quickstart-portal].
* Your AKS cluster needs to have **an integrated ACR**. For details on creating an AKS cluster with an integrated ACR, see [Authenticate with Azure Container Registry from Azure Kubernetes Service][aks-integrated-acr].
* You also need the Helm CLI installed, which is the client that runs on your development system. It allows you to start, stop, and manage applications with Helm. If you use the Azure Cloud Shell, the Helm CLI is already installed. For installation instructions on your local platform, see [Installing Helm][helm-install].

> [!IMPORTANT]
> Helm is intended to run on Linux nodes. If you have Windows Server nodes in your cluster, you must ensure that Helm pods are only scheduled to run on Linux nodes. You also need to ensure that any Helm charts you install are also scheduled to run on the correct nodes. The commands in this article use [node-selectors][k8s-node-selector] to make sure pods are scheduled to the correct nodes, but not all Helm charts may expose a node selector. You can also consider using other options on your cluster, such as [taints][taints].

## Verify your version of Helm

* Use the `helm version` command to verify you have Helm 3 installed.

    ```console
    helm version
    ```

    The following example output shows Helm version 3.0.0 installed:

    ```output
    version.BuildInfo{Version:"v3.0.0", GitCommit:"e29ce2a54e96cd02ccfce88bee4f58bb6e2a28b6", GitTreeState:"clean", GoVersion:"go1.13.4"}
    ```

## Install an application with Helm v3

### Add Helm repositories

* Add the *ingress-nginx* repository using the [helm repo][helm-repo-add] command.

    ```console
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    ```

### Find Helm charts

1. Search for precreated Helm charts using the [helm search][helm-search] command.

    ```console
    helm search repo ingress-nginx
    ```

    The following condensed example output shows some of the Helm charts available for use:

    ```output
    NAME                            CHART VERSION   APP VERSION     DESCRIPTION                                       
    ingress-nginx/ingress-nginx     4.7.0           1.8.0           Ingress controller for Kubernetes using NGINX a...
    ```

2. Update the list of charts using the [helm repo update][helm-repo-update] command.

    ```console
    helm repo update
    ```

    The following example output shows a successful repo update:

    ```output
    Hang tight while we grab the latest from your chart repositories...
    ...Successfully got an update from the "ingress-nginx" chart repository
    Update Complete. ⎈ Happy Helming!⎈
    ```

## Import the Helm chart images into your ACR

This article uses the [NGINX ingress controller Helm chart][ingress-nginx-helm-chart], which relies on three container images.

* Use `az acr import` to import the NGINX ingress controller images into your ACR.

    ```azurecli
    REGISTRY_NAME=<REGISTRY_NAME>
    CONTROLLER_REGISTRY=registry.k8s.io
    CONTROLLER_IMAGE=ingress-nginx/controller
    CONTROLLER_TAG=v1.8.0
    PATCH_REGISTRY=registry.k8s.io
    PATCH_IMAGE=ingress-nginx/kube-webhook-certgen
    PATCH_TAG=v20230407
    DEFAULTBACKEND_REGISTRY=registry.k8s.io
    DEFAULTBACKEND_IMAGE=defaultbackend-amd64
    DEFAULTBACKEND_TAG=1.5

    az acr import --name $REGISTRY_NAME --source $CONTROLLER_REGISTRY/$CONTROLLER_IMAGE:$CONTROLLER_TAG --image $CONTROLLER_IMAGE:$CONTROLLER_TAG
    az acr import --name $REGISTRY_NAME --source $PATCH_REGISTRY/$PATCH_IMAGE:$PATCH_TAG --image $PATCH_IMAGE:$PATCH_TAG
    az acr import --name $REGISTRY_NAME --source $DEFAULTBACKEND_REGISTRY/$DEFAULTBACKEND_IMAGE:$DEFAULTBACKEND_TAG --image $DEFAULTBACKEND_IMAGE:$DEFAULTBACKEND_TAG
    ```

    > [!NOTE]
    > In addition to importing container images into your ACR, you can also import Helm charts into your ACR. For more information, see [Push and pull Helm charts to an Azure container registry][acr-helm].

### Run Helm charts

1. Install Helm charts using the [helm install][helm-install-command] command and specify a release name and the name of the chart to install.

    > [!TIP]
    > The following example creates a Kubernetes namespace for the ingress resources named *ingress-basic* and is intended to work within that namespace. Specify a namespace for your own environment as needed.

    ```console
    ACR_URL=<REGISTRY_URL>

    # Create a namespace for your ingress resources
    kubectl create namespace ingress-basic

    # Use Helm to deploy an NGINX ingress controller
    helm install ingress-nginx ingress-nginx/ingress-nginx \
        --version 4.0.13 \
        --namespace ingress-basic \
        --set controller.replicaCount=2 \
        --set controller.nodeSelector."kubernetes\.io/os"=linux \
        --set controller.image.registry=$ACR_URL \
        --set controller.image.image=$CONTROLLER_IMAGE \
        --set controller.image.tag=$CONTROLLER_TAG \
        --set controller.image.digest="" \
        --set controller.admissionWebhooks.patch.nodeSelector."kubernetes\.io/os"=linux \
        --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz \
        --set controller.admissionWebhooks.patch.image.registry=$ACR_URL \
        --set controller.admissionWebhooks.patch.image.image=$PATCH_IMAGE \
        --set controller.admissionWebhooks.patch.image.tag=$PATCH_TAG \
        --set defaultBackend.nodeSelector."kubernetes\.io/os"=linux \
        --set defaultBackend.image.registry=$ACR_URL \
        --set defaultBackend.image.image=$DEFAULTBACKEND_IMAGE \
        --set defaultBackend.image.tag=$DEFAULTBACKEND_TAG \
        --set defaultBackend.image.digest=""
    ```

    The following condensed example output shows the deployment status of the Kubernetes resources created by the Helm chart:

    ```output
    NAME: nginx-ingress
    LAST DEPLOYED: Wed Jul 28 11:35:29 2021
    NAMESPACE: ingress-basic
    STATUS: deployed
    REVISION: 1
    TEST SUITE: None
    NOTES:
    The ingress-nginx controller has been installed.
    It may take a few minutes for the LoadBalancer IP to be available.
    You can watch the status by running 'kubectl --namespace ingress-basic get services -o wide -w nginx-ingress-ingress-nginx-controller'
    ...
    ```

2. Get the *EXTERNAL-IP* of your service using the `kubectl get services` command.

    ```console
    kubectl --namespace ingress-basic get services -o wide -w ingress-nginx-ingress-nginx-controller
    ```

    The following example output shows the *EXTERNAL-IP* for the *ingress-nginx-ingress-nginx-controller* service:

    ```output
    NAME                                     TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)                      AGE   SELECTOR
    nginx-ingress-ingress-nginx-controller   LoadBalancer   10.0.254.93   <EXTERNAL_IP>   80:30004/TCP,443:30348/TCP   61s   app.kubernetes.io/component=controller,app.kubernetes.io/instance=nginx-ingress,app.kubernetes.io/name=ingress-nginx
    ```

### List releases

* Get a list of releases installed on your cluster using the `helm list` command.

    ```console
    helm list --namespace ingress-basic
    ```

    The following example output shows the *ingress-nginx* release deployed in the previous step:

    ```output
    NAME            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                   APP VERSION
    ingress-nginx   ingress-basic   1               2021-07-28 11:35:29.9623734 -0500 CDT   deployed        ingress-nginx-3.34.0    0.47.0
    ```

### Clean up resources

Deploying a Helm chart creates Kubernetes resources like pods, deployments, and services.

* Clean up resources using the [helm uninstall][helm-cleanup] command and specify your release name.

    ```console
    helm uninstall --namespace ingress-basic ingress-nginx
    ```

    The following example output shows the release named *ingress-nginx* has been uninstalled:

    ```output
    release "nginx-ingress" uninstalled
    ```

* Delete the entire sample namespace along with the resources using the `kubectl delete` command and specify your namespace name.

    ```console
    kubectl delete namespace ingress-basic
    ```

## Next steps

For more information about managing Kubernetes application deployments with Helm, see the Helm documentation.

> [!div class="nextstepaction"]
> [Helm documentation][helm-documentation]

<!-- LINKS - external -->
[helm]: https://github.com/kubernetes/helm/
[helm-cleanup]: https://helm.sh/docs/intro/using_helm/#helm-uninstall-uninstalling-a-release
[helm-documentation]: https://helm.sh/docs/
[helm-install]: https://helm.sh/docs/intro/install/
[helm-install-command]: https://helm.sh/docs/intro/using_helm/#helm-install-installing-a-package
[helm-repo-add]: https://helm.sh/docs/intro/quickstart/#initialize-a-helm-chart-repository
[helm-search]: https://helm.sh/docs/intro/using_helm/#helm-search-finding-charts
[helm-repo-update]: https://helm.sh/docs/intro/using_helm/#helm-repo-working-with-repositories
[ingress-nginx-helm-chart]: https://github.com/kubernetes/ingress-nginx/tree/main/charts/ingress-nginx
[k8s-node-selector]: https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector

<!-- LINKS - internal -->
[acr-helm]: ../container-registry/container-registry-helm-repos.md
[aks-integrated-acr]: cluster-container-registry-integration.md#create-a-new-acr
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[taints]: operator-best-practices-advanced-scheduler.md
