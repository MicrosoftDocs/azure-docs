---
title: Sentiment Analysis Kubernetes config and deploy steps
titleSuffix: Azure Cognitive Services
description: Sentiment Analysis Kubernetes config and deploy steps
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 08/21/2019
ms.author: dapine
---

1. Within the text editor, create a new file named *sentiment.yaml*, and paste the following YAML into it. Be sure to replace `billing/value` and `apikey/value` with your own information.

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
              value: # {ENDPOINT_URI}
            - name: apikey
              value: # {API_KEY}
     
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

1. Save the file, and close the text editor.
1. Run the Kubernetes `apply` command with the *sentiment.yaml* file as its target:

    ```console
    kuberctl apply -f sentiment.yaml
    ```

    After the command successfully applies the deployment configuration, a message appears similar to the following output:

    ```console
    deployment.apps "sentiment" created
    service "sentiment" created
    ```
1. Verify that the pod was deployed:

    ```console
    kubectl get pods
    ```

    The output for the running status of the pod:

    ```console
    NAME                         READY     STATUS    RESTARTS   AGE
    sentiment-5c9ccdf575-mf6k5   1/1       Running   0          1m
    ```

1. Verify that the service is available, and get the IP address.

    ```console
    kubectl get services
    ```

    The output for the running status of the *sentiment* service in the pod:

    ```console
    NAME         TYPE           CLUSTER-IP    EXTERNAL-IP      PORT(S)          AGE
    kubernetes   ClusterIP      10.0.0.1      <none>           443/TCP          2m
    sentiment    LoadBalancer   10.0.100.64   168.61.156.180   5000:31234/TCP   2m
    ```
