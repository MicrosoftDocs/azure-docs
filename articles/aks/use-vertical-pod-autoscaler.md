---
title: Use the Vertical Pod Autoscaler in Azure Kubernetes Service (AKS)
description: Learn how to deploy, upgrade, or disable the Vertical Pod Autoscaler on your Azure Kubernetes Service (AKS) cluster.
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 02/22/2024
author: schaffererin
ms.author: schaffererin
ms.service: azure-kubernetes-service
---

# Use the Vertical Pod Autoscaler in Azure Kubernetes Service (AKS)

This article shows you how to use the Vertical Pod Autoscaler (VPA) on your Azure Kubernetes Service (AKS) cluster. The VPA automatically adjusts the CPU and memory requests for your pods to match the usage patterns of your workloads. This feature helps to optimize the performance of your applications and reduce the cost of running your workloads in AKS.

For more information, see the [Vertical Pod Autoscaler overview](./vertical-pod-autoscaler.md).

## Before you begin

* If you have an existing AKS cluster, make sure it's running Kubernetes version 1.24 or higher.
* You need the Azure CLI version 2.52.0 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* If enabling VPA on an existing cluster, make sure `kubectl` is installed and configured to connect to your AKS cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --name <cluster-name> --resource-group <resource-group-name>
    ```

## Deploy the Vertical Pod Autoscaler on a new cluster

* Create a new AKS cluster with the VPA enabled using the [`az aks create`][az-aks-create] command with the `--enable-vpa` flag.

    ```azurecli-interactive
    az aks create --name <cluster-name> --resource-group <resource-group-name> --enable-vpa --generate-ssh-keys
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

## Update an existing cluster to use the Vertical Pod Autoscaler

* Update an existing cluster to use the VPA using the [`az aks update`][az-aks-update] command with the `--enable-vpa` flag.

    ```azurecli-interactive
    az aks update --name <cluster-name> --resource-group <resource-group-name> --enable-vpa 
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

## Disable the Vertical Pod Autoscaler on an existing cluster

* Disable the VPA on an existing cluster using the [`az aks update`][az-aks-update] command with the `--disable-vpa` flag.

    ```azurecli-interactive
    az aks update --name <cluster-name> --resource-group <resource-group-name> --disable-vpa
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

## Test Vertical Pod Autoscaler installation

In the following example, we create a deployment with two pods, each running a single container that requests 100 millicore and tries to utilize slightly above 500 millicores. We also create a VPA config pointing at the deployment. The VPA observes the behavior of the pods, and after about five minutes, updates the pods to request 500 millicores.

1. Create a file named `hamster.yaml` and copy in the following manifest of the Vertical Pod Autoscaler example from the [kubernetes/autoscaler][kubernetes-autoscaler-github-repo] GitHub repository:

    ```yml
    apiVersion: "autoscaling.k8s.io/v1"
    kind: VerticalPodAutoscaler
    metadata:
      name: hamster-vpa
    spec:
      targetRef:
        apiVersion: "apps/v1"
        kind: Deployment
        name: hamster
      resourcePolicy:
        containerPolicies:
          - containerName: '*'
            minAllowed:
              cpu: 100m
              memory: 50Mi
            maxAllowed:
              cpu: 1
              memory: 500Mi
            controlledResources: ["cpu", "memory"]
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: hamster
    spec:
      selector:
        matchLabels:
          app: hamster
      replicas: 2
      template:
        metadata:
          labels:
            app: hamster
        spec:
          securityContext:
            runAsNonRoot: true
            runAsUser: 65534
          containers:
            - name: hamster
              image: registry.k8s.io/ubuntu-slim:0.1
              resources:
                requests:
                  cpu: 100m
                  memory: 50Mi
              command: ["/bin/sh"]
              args:
                - "-c"
                - "while true; do timeout 0.5s yes >/dev/null; sleep 0.5s; done"
    ```

2. Deploy the `hamster.yaml` Vertical Pod Autoscaler example using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f hamster.yaml
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

3. View the running pods using the [`kubectl get`][kubectl-get] command.

    ```bash
    kubectl get pods -l app=hamster
    ```

    Your output should look similar to the following example output:

    ```output
    hamster-78f9dcdd4c-hf7gk   1/1     Running   0          24s
    hamster-78f9dcdd4c-j9mc7   1/1     Running   0          24s
    ```

4. View the CPU and Memory reservations on one of the pods using the [`kubectl describe`][kubectl-describe] command. Make sure you replace `<example-pod>` with one of the pod IDs returned in your output from the previous step.

    ```bash
    kubectl describe pod hamster-<example-pod>
    ```

    Your output should look similar to the following example output:

    ```output
     hamster:
        Container ID:  containerd://
        Image:         k8s.gcr.io/ubuntu-slim:0.1
        Image ID:      sha256:
        Port:          <none>
        Host Port:     <none>
        Command:
          /bin/sh
        Args:
          -c
          while true; do timeout 0.5s yes >/dev/null; sleep 0.5s; done
        State:          Running
          Started:      Wed, 28 Sep 2022 15:06:14 -0400
        Ready:          True
        Restart Count:  0
        Requests:
          cpu:        100m
          memory:     50Mi
        Environment:  <none>
    ```

    The pod has 100 millicpu and 50 Mibibytes of Memory reserved in this example. For this sample application, the pod needs less than 100 millicpu to run, so there's no CPU capacity available. The pods also reserves less memory than needed. The Vertical Pod Autoscaler *vpa-recommender* deployment analyzes the pods hosting the hamster application to see if the CPU and Memory requirements are appropriate. If adjustments are needed, the vpa-updater relaunches the pods with updated values.

5. Monitor the pods using the [`kubectl get`][kubectl-get] command.

    ```bash
    kubectl get --watch pods -l app=hamster
    ```

6. When the new hamster pod starts, you can view the updated CPU and Memory reservations using the [`kubectl describe`][kubectl-describe] command. Make sure you replace `<example-pod>` with one of the pod IDs returned in your output from the previous step.

    ```bash
    kubectl describe pod hamster-<example-pod>
    ```

    Your output should look similar to the following example output:

    ```output
    State:          Running
      Started:      Wed, 28 Sep 2022 15:09:51 -0400
    Ready:          True
    Restart Count:  0
    Requests:
      cpu:        587m
      memory:     262144k
    Environment:  <none>
    ```

    In the previous output, you can see that the CPU reservation increased to 587 millicpu, which is over five times the original value. The Memory increased to 262,144 Kilobytes, which is around 250 Mibibytes, or five times the original value. This pod was under-resourced, and the Vertical Pod Autoscaler corrected the estimate with a much more appropriate value.

7. View updated recommendations from VPA using the [`kubectl describe`][kubectl-describe] command to describe the hamster-vpa resource information.

    ```bash
    kubectl describe vpa/hamster-vpa
    ```

    Your output should look similar to the following example output:

    ```output
     State:          Running
      Started:      Wed, 28 Sep 2022 15:09:51 -0400
    Ready:          True
    Restart Count:  0
    Requests:
      cpu:        587m
      memory:     262144k
    Environment:  <none>
    ```

## Set Vertical Pod Autoscaler requests

The `VerticalPodAutoscaler` object automatically sets resource requests on pods with an `updateMode` of `Auto`. You can set a different value depending on your requirements and testing. In this example, we create and test a deployment manifest with two pods, each running a container that requests 100 milliCPU and 50 MiB of Memory, and sets the `updateMode` to `Recreate`.

1. Create a file named `azure-autodeploy.yaml` and copy in the following manifest:

    ```yml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: vpa-auto-deployment
    spec:
      replicas: 2
      selector:
        matchLabels:
          app: vpa-auto-deployment
      template:
        metadata:
          labels:
            app: vpa-auto-deployment
        spec:
          containers:
          - name: mycontainer
            image: mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
            resources:
              requests:
                cpu: 100m
                memory: 50Mi
            command: ["/bin/sh"]
            args: ["-c", "while true; do timeout 0.5s yes >/dev/null; sleep 0.5s; done"]
    ```

2. Create the pod using the [`kubectl create`][kubectl-create] command.

    ```bash
    kubectl create -f azure-autodeploy.yaml
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

3. View the running pods using the [`kubectl get`][kubectl-get] command.

    ```bash
    kubectl get pods
    ```

    Your output should look similar to the following example output:

    ```output
    NAME                                   READY   STATUS    RESTARTS   AGE
    vpa-auto-deployment-54465fb978-kchc5   1/1     Running   0          52s
    vpa-auto-deployment-54465fb978-nhtmj   1/1     Running   0          52s
    ```

4. Create a file named `azure-vpa-auto.yaml` and copy in the following manifest:

    ```yml
    apiVersion: autoscaling.k8s.io/v1
    kind: VerticalPodAutoscaler
    metadata:
      name: vpa-auto
    spec:
      targetRef:
        apiVersion: "apps/v1"
        kind:       Deployment
        name:       vpa-auto-deployment
      updatePolicy:
        updateMode: "Recreate"
    ```

    The `targetRef.name` value specifies that any pod controlled by a deployment named `vpa-auto-deployment` belongs to `VerticalPodAutoscaler`. The `updateMode` value of `Recreate` means that the Vertical Pod Autoscaler controller can delete a pod, adjust the CPU and Memory requests, and then create a new pod.

5. Apply the manifest to the cluster using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl create -f azure-vpa-auto.yaml
    ```

6. Wait a few minutes and then view the running pods using the [`kubectl get`][kubectl-get] command.

    ```bash
    kubectl get pods
    ```

    Your output should look similar to the following example output:

    ```output
    NAME                                   READY   STATUS    RESTARTS   AGE
    vpa-auto-deployment-54465fb978-qbhc4   1/1     Running   0          2m49s
    vpa-auto-deployment-54465fb978-vbj68   1/1     Running   0          109s
    ```

7. Get detailed information about one of your running pods using the [`kubectl get`][kubectl-get] command. Make sure you replace `<pod-name>` with the name of one of your pods from your previous output.

    ```bash
    kubectl get pod <pod-name> --output yaml
    ```

    Your output should look similar to the following example output, which shows that VPA controller increased the Memory request to 262144k and the CPU request to 25 milliCPU:

    ```output
    apiVersion: v1
    kind: Pod
    metadata:
      annotations:
        vpaObservedContainers: mycontainer
        vpaUpdates: 'Pod resources updated by vpa-auto: container 0: cpu request, memory
          request'
      creationTimestamp: "2022-09-29T16:44:37Z"
      generateName: vpa-auto-deployment-54465fb978-
      labels:
        app: vpa-auto-deployment

    spec:
      containers:
      - args:
        - -c
        - while true; do timeout 0.5s yes >/dev/null; sleep 0.5s; done
        command:
        - /bin/sh
        image: mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
        imagePullPolicy: IfNotPresent
        name: mycontainer
        resources:
          requests:
            cpu: 25m
            memory: 262144k
    ```

8. Get detailed information about the Vertical Pod Autoscaler and its recommendations for CPU and Memory using the [`kubectl get`][kubectl-get] command.

    ```bash
    kubectl get vpa vpa-auto --output yaml
    ```

    Your output should look similar to the following example output:

    ```output
     recommendation:
      containerRecommendations:
      - containerName: mycontainer
        lowerBound:
          cpu: 25m
          memory: 262144k
        target:
          cpu: 25m
          memory: 262144k
        uncappedTarget:
          cpu: 25m
          memory: 262144k
        upperBound:
          cpu: 230m
          memory: 262144k
    ```

    In this example, the results in the `target` attribute specify that it doesn't need to change the CPU or the Memory target for the container to run optimally. However, results can vary depending on the application and its resource utilization.

    The Vertical Pod Autoscaler uses the `lowerBound` and `upperBound` attributes to decide whether to delete a pod and replace it with a new pod. If a pod has requests less than the lower bound or greater than the upper bound, the Vertical Pod Autoscaler deletes the pod and replaces it with a pod that meets the target attribute.

## Extra Recommender for Vertical Pod Autoscaler

The Recommender provides recommendations for resource usage based on real-time resource consumption. AKS deploys a Recommender when a cluster enables VPA. You can deploy a customized Recommender or an extra Recommender with the same image as the default one. The benefit of having a customized Recommender is that you can customize your recommendation logic. With an extra Recommender, you can partition VPAs to use different Recommenders.

In the following example, we create an extra Recommender, apply to an existing AKS clust, and configure the VPA object to use the extra Recommender.

1. Create a file named `extra_recommender.yaml` and copy in the following manifest:

    ```yml
    apiVersion: apps/v1 
    kind: Deployment 
    metadata: 
      name: extra-recommender 
      namespace: kube-system 
    spec: 
      replicas: 1 
      selector: 
        matchLabels: 
          app: extra-recommender 
      template: 
        metadata: 
          labels: 
            app: extra-recommender 
        spec: 
          serviceAccountName: vpa-recommender 
          securityContext: 
            runAsNonRoot: true 
            runAsUser: 65534
          containers: 
          - name: recommender 
            image: registry.k8s.io/autoscaling/vpa-recommender:0.13.0 
            imagePullPolicy: Always 
            args: 
              - --recommender-name=extra-recommender 
            resources: 
              limits: 
                cpu: 200m 
                memory: 1000Mi 
              requests: 
                cpu: 50m 
                memory: 500Mi 
            ports: 
            - name: prometheus 
              containerPort: 8942 
    ```

2. Deploy the `extra-recomender.yaml` Vertical Pod Autoscaler example using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f extra-recommender.yaml 
    ```

   After a few minutes, the command completes and returns JSON-formatted information about the cluster.

3. Create a file named `hamster-extra-recommender.yaml` and copy in the following manifest:

    ```yml
    apiVersion: "autoscaling.k8s.io/v1" 
    kind: VerticalPodAutoscaler 
    metadata: 
      name: hamster-vpa 
    spec: 
      recommenders:  
        - name: 'extra-recommender' 
      targetRef: 
        apiVersion: "apps/v1" 
        kind: Deployment 
        name: hamster 
      updatePolicy: 
        updateMode: "Auto" 
      resourcePolicy: 
        containerPolicies: 
          - containerName: '*' 
            minAllowed: 
              cpu: 100m 
              memory: 50Mi 
            maxAllowed: 
              cpu: 1 
              memory: 500Mi 
            controlledResources: ["cpu", "memory"] 
    --- 
    apiVersion: apps/v1 
    kind: Deployment 
    metadata: 
      name: hamster 
    spec: 
      selector: 
        matchLabels: 
          app: hamster 
      replicas: 2 
      template: 
        metadata: 
          labels: 
            app: hamster 
        spec: 
          securityContext: 
            runAsNonRoot: true 
            runAsUser: 65534 # nobody 
          containers: 
            - name: hamster 
              image: k8s.gcr.io/ubuntu-slim:0.1 
              resources: 
                requests: 
                  cpu: 100m 
                  memory: 50Mi 
              command: ["/bin/sh"] 
              args: 
                - "-c" 
                - "while true; do timeout 0.5s yes >/dev/null; sleep 0.5s; done" 
    ```

   If `memory` isn't specified in `controlledResources`, the Recommender doesn't respond to OOM events. In this example, we only set CPU in `controlledValues`. `controlledValues` allows you to choose whether to update the container's resource requests using the`RequestsOnly` option, or by both resource requests and limits using the `RequestsAndLimits` option. The default value is `RequestsAndLimits`. If you use the `RequestsAndLimits` option, requests are computed based on actual usage, and limits are calculated based on the current pod's request and limit ratio.

   For example, if you start with a pod that requests 2 CPUs and limits to 4 CPUs, VPA always sets the limit to be twice as much as requests. The same principle applies to Memory. When you use the `RequestsAndLimits` mode, it can serve as a blueprint for your initial application resource requests and limits.

    You can simplify the VPA object using `Auto` mode and computing recommendations for both CPU and Memory.

4. Deploy the `hamster-extra-recomender.yaml` example using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f hamster-extra-recommender.yaml
    ```

5. Monitor your pods using the `[kubectl get`][kubectl-get] command.

    ```bash
    kubectl get --watch pods -l app=hamster
    ````

6. When the new hamster pod starts, view the updated CPU and Memory reservations using the [`kubectl describe`][kubectl-describe] command. Make sure you replace `<example-pod>` with one of your pod IDs.

    ```bash
    kubectl describe pod hamster-<example-pod>
    ```

   Your output should look similar to the following example output:

    ```output
    State:          Running
      Started:      Wed, 28 Sep 2022 15:09:51 -0400
    Ready:          True
    Restart Count:  0
    Requests:
      cpu:        587m
      memory:     262144k
    Environment:  <none>
    ```

7. View updated recommendations from VPA using the [`kubectl describe`][kubectl-describe] command.

    ```bash
    kubectl describe vpa/hamster-vpa
    ```

   Your output should look similar to the following example output:

    ```output
    State:          Running
     Started:      Wed, 28 Sep 2022 15:09:51 -0400
    Ready:          True
    Restart Count:  0
    Requests:
      cpu:        587m
      memory:     262144k
    Environment:  <none>
    Spec:
      recommenders:
        Name: customized-recommender
    ```

## Troubleshoot the Vertical Pod Autoscaler

If you encounter issues with the Vertical Pod Autoscaler, you can troubleshoot the system components and custom resource definition to identify the problem.

1. Verify that all system components are running using the following command:

   ```bash
   kubectl --namespace=kube-system get pods|grep vpa
   ```

    Your output should list *three pods*: recommender, updater, and admission-controller, all with a status of `Running`.

2. For each of the pods returned in your previous output, verify that the system components are logging any errors using the following command:

    ```bash
    kubectl --namespace=kube-system logs [pod name] | grep -e '^E[0-9]\{4\}'
    ```

3. Verify that the custom resource definition was created using the following command:

    ```bash
    kubectl get customresourcedefinition | grep verticalpodautoscalers
    ```

## Next steps

To learn more about the VPA object, see the [Vertical Pod Autoscaler API reference](./vertical-pod-autoscaler-api-reference.md).

<!-- EXTERNAL LINKS -->
[kubernetes-autoscaler-github-repo]: https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/examples/hamster.yaml
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-create]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe

<!-- INTERNAL LINKS -->
[install-azure-cli]: /cli/azure/install-azure-cli
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-update]: /cli/azure/aks#az-aks-update
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
