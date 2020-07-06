---
title: Key Phrase Extraction Kubernetes config and deploy steps
titleSuffix: Azure Cognitive Services
description: Key Phrase Extraction Kubernetes config and deploy steps
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 04/01/2020
ms.author: aahi
---

### Deploy the Key Phrase Extraction container to an AKS cluster

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

1. Within the text editor, create a new file named *keyphrase.yaml*, and paste the following YAML into it. Be sure to replace `billing/value` and `apikey/value` with your own information.

    ```yaml
    apiVersion: apps/v1beta1
    kind: Deployment
    metadata:
      name: keyphrase
    spec:
      template:
        metadata:
          labels:
            app: keyphrase-app
        spec:
          containers:
          - name: keyphrase
            image: mcr.microsoft.com/azure-cognitive-services/keyphrase
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
      name: keyphrase
    spec:
      type: LoadBalancer
      ports:
      - port: 5000
      selector:
        app: keyphrase-app
    ```

1. Save the file, and close the text editor.
1. Run the Kubernetes `apply` command with the *keyphrase.yaml* file as its target:

    ```console
    kubectl apply -f keyphrase.yaml
    ```

    After the command successfully applies the deployment configuration, a message appears similar to the following output:

    ```output
    deployment.apps "keyphrase" created
    service "keyphrase" created
    ```
1. Verify that the pod was deployed:

    ```console
    kubectl get pods
    ```

    The output for the running status of the pod:

    ```output
    NAME                         READY     STATUS    RESTARTS   AGE
    keyphrase-5c9ccdf575-mf6k5   1/1       Running   0          1m
    ```

1. Verify that the service is available, and get the IP address.

    ```console
    kubectl get services
    ```

    The output for the running status of the *keyphrase* service in the pod:

    ```output
    NAME         TYPE           CLUSTER-IP    EXTERNAL-IP      PORT(S)          AGE
    kubernetes   ClusterIP      10.0.0.1      <none>           443/TCP          2m
    keyphrase    LoadBalancer   10.0.100.64   168.61.156.180   5000:31234/TCP   2m
    ```
