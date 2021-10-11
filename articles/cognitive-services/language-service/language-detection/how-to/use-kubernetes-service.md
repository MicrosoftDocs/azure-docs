---
title: Deploy a language detection container to Azure Kubernetes Service 
titleSuffix: Azure Cognitive Services
description: Deploy a language detection container image to Azure Kubernetes Service, and test it in a web browser.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 10/11/2021
ms.author: aahi
---

# Deploy a language detection container to Azure Kubernetes Service

Learn how to deploy a [language detection Docker container](use-containers.md) image to Azure Kubernetes Service (AKS). This procedure shows how to create a Text Analytics resource, how to associate a container image, and how to exercise this orchestration of the two from a browser. Using containers can shift your attention away from managing infrastructure to instead focusing on application development.

## Prerequisites

This procedure requires several tools that must be installed and run locally. Don't use Azure Cloud Shell. You need the following:

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services) before you begin.
* A text editor, for example, [Visual Studio Code](https://code.visualstudio.com/download).
* The [Azure CLI](/cli/azure/install-azure-cli) installed.
* The [Kubernetes CLI](https://kubernetes.io/docs/tasks/tools/install-kubectl/) installed.
* An Azure resource with the correct pricing tier. Not all pricing tiers work with this container:
    * **Azure Text Analytics** resource with F0 or standard pricing tiers only.
    * **Azure Cognitive Services** resource with the S0 pricing tier.

[!INCLUDE [Create a Cognitive Services Text Analytics resource](../../includes/containers/create-text-analytics-resource.md)]

[!INCLUDE [Create a Text Analytics container on Azure Kubernetes Service (AKS)](../../../containers/includes/create-aks-resource.md)]



## Deploy the Language Detection container to an AKS cluster

1. Open the Azure CLI, and sign in to Azure.

    ```azurecli
    az login
    ```

1. Sign in to the AKS cluster. Replace `your-cluster-name` and `your-resource-group` with the appropriate values.

    ```azurecli
    az aks get-credentials -n your-cluster-name -g -your-resource-group
    ```

    After this command runs, it reports a message similar to the following:

    ```output
    Merged "your-cluster-name" as current context in /home/username/.kube/config
    ```

    > [!WARNING]
    > If you have multiple subscriptions available to you on your Azure account and the `az aks get-credentials` command returns with an error, a common problem is that you're using the wrong subscription. Set the context of your Azure CLI session to use the same subscription that you created the resources with and try again.
    > ```azurecli
    >  az account set -s subscription-id
    > ```

1. Open the text editor of choice. This example uses Visual Studio Code.

    ```console
    code .
    ```

1. Within the text editor, create a new file named *language.yaml*, and paste the following YAML into it. Be sure to replace `billing/value` and `apikey/value` with your own information.

    ```yaml
    apiVersion: apps/v1beta1
    kind: Deployment
    metadata:
      name: language
    spec:
      template:
        metadata:
          labels:
            app: language-app
        spec:
          containers:
          - name: language
            image: mcr.microsoft.com/azure-cognitive-services/language
            ports:
            - containerPort: 5000
            resources:
              requests:
                memory: 2Gi
                cpu: 1
              limits:
                memory: 4Gi
                cpu: 1
            env:
            - name: EULA
              value: "accept"
            - name: billing
              value: # {ENDPOINT_URI}
            - name: apikey
              value: # {API_KEY}
     
    --- 
    apiVersion: v1
    kind: Service
    metadata:
      name: language
    spec:
      type: LoadBalancer
      ports:
      - port: 5000
      selector:
        app: language-app
    ```

1. Save the file, and close the text editor.
1. Run the Kubernetes `apply` command with the *language.yaml* file as its target:

    ```console
    kubectl apply -f language.yaml
    ```

    After the command successfully applies the deployment configuration, a message appears similar to the following output:

    ```output
    deployment.apps "language" created
    service "language" created
    ```
1. Verify that the pod was deployed:

    ```console
    kubectl get pods
    ```

    The output for the running status of the pod:

    ```output
    NAME                         READY     STATUS    RESTARTS   AGE
    language-5c9ccdf575-mf6k5   1/1       Running   0          1m
    ```

1. Verify that the service is available, and get the IP address.

    ```console
    kubectl get services
    ```

    The output for the running status of the *language* service in the pod:

    ```output
    NAME         TYPE           CLUSTER-IP    EXTERNAL-IP      PORT(S)          AGE
    kubernetes   ClusterIP      10.0.0.1      <none>           443/TCP          2m
    language     LoadBalancer   10.0.100.64   168.61.156.180   5000:31234/TCP   2m
    ```


## Verify the Language Detection container instance

1. Select the **Overview** tab, and copy the IP address.
1. Open a new browser tab, and enter the IP address. For example, enter `http://<IP-address>:5000 (http://55.55.55.55:5000`). The container's home page is displayed, which lets you know the container is running.

    ![View the container home page to verify that it's running](../media/how-tos/container-instance/swagger-docs-on-container.png)

1. Select the **Service API Description** link to go to the container's Swagger page.

1. Choose any of the **POST** APIs, and select **Try it out**. The parameters are displayed, which includes this example input:

    ```json
    {
      "documents": [
        {
          "language": "en",
          "id": "1",
          "text": "Hello world. This is some input text that I love."
        },
        {
          "language": "fr",
          "id": "2",
          "text": "Bonjour tout le monde"
        },
        {
          "language": "es",
          "id": "3",
          "text": "La carretera estaba atascada. Había mucho tráfico el día de ayer."
        }
      ]
    }
    ```

1. Set **showStats** to `true`.

1. Select **Execute** to determine the sentiment of the text.

    The model that's packaged in the container generates a score that ranges from 0 to 1, where 0 is negative sentiment and 1 is positive sentiment.

    The JSON response that's returned includes sentiment for the updated text input:

    ```json
    {
      "documents": [
        {
          "id": "1",
          "detectedLanguages": [
            {
              "name": "English",
              "iso6391Name": "en",
              "score": 1
            }
          ],
          "statistics": {
            "charactersCount": 11,
            "transactionsCount": 1
          }
        },
        {
          "id": "2",
          "detectedLanguages": [
            {
              "name": "French",
              "iso6391Name": "fr",
              "score": 1
            }
          ],
          "statistics": {
            "charactersCount": 21,
            "transactionsCount": 1
          }
        },
        {
          "id": "3",
          "detectedLanguages": [
            {
              "name": "Spanish",
              "iso6391Name": "es",
              "score": 1
            }
          ],
          "statistics": {
            "charactersCount": 65,
            "transactionsCount": 1
          }
        },
        {
          "id": "4",
          "detectedLanguages": [
            {
              "name": "French",
              "iso6391Name": "fr",
              "score": 1
            }
          ],
          "statistics": {
            "charactersCount": 8,
            "transactionsCount": 1
          }
        }
      ],
      "errors": [],
      "statistics": {
        "documentsCount": 4,
        "validDocumentsCount": 4,
        "erroneousDocumentsCount": 0,
        "transactionsCount": 4
      }
    }
    ```

We can now correlate the documents of the response payload's JSON data to the original request payload documents by their corresponding `id`. Each document is treated independently containing various statistics such as `characterCount` and `transactionCount`. Additionally, each resulting document has the `detectedLanguages` array with the `name`, `iso6391Name`, and `score` for each language detected. When multiple languages are detected, the `score` is used to determine the most probable language.

## Next steps

* Use more [Cognitive Services containers](../../cognitive-services-container-support.md)
* [Key phrase extraction overview](../overview.md)
