---
title: Run Azure Kubernetes Services
titleSuffix: Text Analytics - Azure Cognitive Services
description: Deploy the text analytics containers with the sentiment analysis image, to the Azure Kubernetes Services, and test it in a web browser.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 06/21/2019
ms.author: dapine
---

# Deploy a Sentiment Analysis container to Azure Kubernetes Services (AKS)

Learn how to deploy the Cognitive Services [Text Analytics](https://docs.microsoft.com/azure/cognitive-services/text-analytics/how-tos/text-analytics-how-to-install-containers) container with the Sentiment Analysis image to Azure Kubernetes Services (AKS). This procedure exemplifies the creation of a Text Analytics resource, the creation of an associated Sentiment Analysis image and the ability to exercise this orchestration of the two from a browser. Using containers can shift the developers' attention away from managing infrastructure to instead focusing on application development.

## Prerequisites

This procedure requires several tools that must be installed and run locally. Do not use Azure Cloud shell.

* Use an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* Text editor, for example: [Visual Studio Code](https://code.visualstudio.com/download).
* Install the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).
* Install the [Kubernetes CLI](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
* An Azure resource with the correct pricing tier. Not all pricing tiers work with this container:
    * **Text Analytics** resource with F0 or Standard pricing tiers only.
    * **Cognitive Services** resource with the S0 pricing tier.

[!INCLUDE [Create a Cognitive Services Text Analytics resource](../includes/create-text-analytics-resource.md)]

[!INCLUDE [Create a Text Analytics Containers on Azure Kubernetes Services (AKS)](../../containers/includes/create-aks-resource.md)]

## Deploy Text Analytics Container to an AKS Cluster

1. Open the Azure CLI and Login into Azure

    ```azurecli
    az login
    ```

1. Sign in to the AKS cluster (replace the `your-cluster-name` and `your-resource-group` with the appropriate values)

    ```azurecli
    az aks get-credentials -n your-cluster-name -g -your-resource-group
    ```

    After this command executes, it reports a message similar to the following:

    ```console
    Merged "your-cluster-name" as current context in /home/username/.kube/config
    ```

    > [!WARNING]
    > If you have multiple subscriptions available to you on your Azure account and the `az aks get-credentials` command returns with an error, a common problem is that you're using the wrong subscription. Simply set the context of your Azure CLI session to use the same subscription that you created the resources with and try again.
    > ```azurecli
    >  az account set -s subscription-id
    > ```

1. Open the text editor of choice, (this example uses __Visual Studio Code__):

    ```azurecli
    code .
    ```

1. Within the text editor, create a new file named _sentiment.yaml_ and paste the following YAML into it. Be sure to replace the `billing/value` and `apikey/value` with your own.

    ```yaml
    apiVersion: apps/v1beta1
    kind: Deployment
    metadata:
      name: sentiment
    spec:
      template:
        metadata:
          labels:
            app: sentiment-app
        spec:
          containers:
          - name: sentiment
            image: mcr.microsoft.com/azure-cognitive-services/sentiment
            ports:
            - containerPort: 5000
            env:
            - name: EULA
              value: "accept"
            - name: billing
              value: # < Your endpoint >
            - name: apikey
              value: # < Your API Key >
     
    --- 
    apiVersion: v1
    kind: Service
    metadata:
      name: sentiment
    spec:
      type: LoadBalancer
      ports:
      - port: 5000
      selector:
        app: sentiment-app
    ```

1. Save the file and close the text editor.
1. Execute the Kubernetes `apply` command with the _sentiment.yaml_ as its target:

    ```console
    kuberctl apply -f sentiment.yaml
    ```

    After the command has successfully applied the deployment configuration, a message similar to the following output:

    ```
    deployment.apps "sentiment" created
    service "sentiment" created
    ```
1. Verify that the POD was deployed:

    ```console
    kubectl get pods
    ```

    This will output the running status of the POD:

    ```
    NAME                         READY     STATUS    RESTARTS   AGE
    sentiment-5c9ccdf575-mf6k5   1/1       Running   0          1m
    ```

1. Verify that the service is available and get the IP address:

    ```console
    kubectl get services
    ```

    This will output the running status of the _sentiment_ service in the POD:

    ```
    NAME         TYPE           CLUSTER-IP    EXTERNAL-IP      PORT(S)          AGE
    kubernetes   ClusterIP      10.0.0.1      <none>           443/TCP          2m
    sentiment    LoadBalancer   10.0.100.64   168.61.156.180   5000:31234/TCP   2m
    ```

[!INCLUDE [Verify the Sentiment Analysis container instance](../includes/verify-sentiment-analysis-container.md)]

## Next steps

* Use more [Cognitive Services Containers](../../cognitive-services-container-support.md)
* Use the [Text Analytics Connected Service](../vs-text-connected-service.md)
