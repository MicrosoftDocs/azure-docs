---
title: Vertical Pod Autoscaling in Azure Kubernetes Service (AKS)
description: Learn how to vertically autoscale your pod on an Azure Kubernetes Service (AKS) cluster.
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 09/28/2023
---

# Vertical Pod Autoscaling in Azure Kubernetes Service (AKS)

This article provides an overview of Vertical Pod Autoscaler (VPA) in Azure Kubernetes Service (AKS), which is based on the open source [Kubernetes](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler) version. When configured, it automatically sets resource requests and limits on containers per workload based on past usage. VPA frees up CPU and Memory for the other pods and helps make effective utilization of your AKS cluster.

Vertical Pod autoscaling provides recommendations for resource usage over time. To manage sudden increases in resource usage, use the [Horizontal Pod Autoscaler][horizontal-pod-autoscaling], which scales the number of pod replicas as needed.

## Benefits

Vertical Pod Autoscaler provides the following benefits:

* It analyzes and adjusts processor and memory resources to *right size* your applications. VPA isn't only responsible for scaling up, but also for scaling down based on their resource use over time.

* A pod is evicted if it needs to change its resource requests if its scaling mode is set to *auto* or *recreate*.

* Set CPU and memory constraints for individual containers by specifying a resource policy

* Ensures nodes have correct resources for pod scheduling

* Configurable logging of any adjustments to processor or memory resources made

* Improve cluster resource utilization and frees up CPU and memory for other pods.

## Limitations

* Vertical Pod autoscaling supports a maximum of 1,000 pods associated with `VerticalPodAutoscaler` objects per cluster.

* VPA might recommend more resources than available in the cluster. As a result, this prevents the pod from being assigned to a node and run, because the node doesn't have sufficient resources. You can overcome this limitation by setting the *LimitRange* to the maximum available resources per namespace, which ensures pods don't ask for more resources than specified. Additionally, you can set maximum allowed resource recommendations per pod in a `VerticalPodAutoscaler` object. Be aware that VPA cannot fully overcome an insufficient node resource issue. The limit range is fixed, but the node resource usage is changed dynamically.

* We don't recommend using Vertical Pod Autoscaler with [Horizontal Pod Autoscaler][horizontal-pod-autoscaler-overview], which scales based on the same CPU and memory usage metrics.

* VPA Recommender only stores up to eight days of historical data.

* VPA does not support JVM-based workloads due to limited visibility into actual memory usage of the workload.

* It is not recommended or supported to run your own implementation of VPA alongside this managed implementation of VPA. Having an extra or customized recommender is supported.

* AKS Windows containers are not supported.

## Before you begin

* AKS cluster is running Kubernetes version 1.24 and higher.

* The Azure CLI version 2.52.0 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

* `kubectl` should be connected to the cluster you want to install VPA.

## VPA overview

### API object

The Vertical Pod Autoscaler is an API resource in the Kubernetes autoscaling API group. The version supported is 0.11 and higher, and can be found in the [Kubernetes autoscaler repo][github-autoscaler-repo-v011].

The VPA object consists of three components:

- **Recommender** - it monitors the current and past resource consumption and, based on it, provides recommended values for the containers' cpu and memory requests/limits. The **Recommender** monitors the metric history, Out of Memory (OOM) events, and the VPA deployment spec, and suggests fair requests. By providing a proper resource request and limits configuration, the limits are raised and lowered.

- **Updater** - it checks which of the managed pods have correct resources set and, if not, kills them so that they can be recreated by their controllers with the updated requests.

- **VPA Admission controller** - it sets the correct resource requests on new pods (either created or recreated by their controller due to the Updater's activity).

### VPA admission controller

VPA admission controller is a binary that registers itself as a Mutating Admission Webhook. With each pod created, it gets a request from the apiserver and it evaluates if there's a matching VPA configuration, or find a corresponding one and use the current recommendation to set resource requests in the pod.

A standalone job runs outside of the VPA admission controller, called `overlay-vpa-cert-webhook-check`. The `overlay-vpa-cert-webhook-check` is used to create and renew the certificates, and register the VPA admission controller as a `MutatingWebhookConfiguration`.

For high availability, AKS supports two admission controller replicas.

### VPA object operation modes

A Vertical Pod Autoscaler resource is inserted for each controller that you want to have automatically computed resource requirements. This is most commonly a *deployment*. There are four modes in which VPAs operate:

* `Auto` - VPA assigns resource requests during pod creation and updates existing pods using the preferred update mechanism. Currently, `Auto` is equivalent to `Recreate`, and also is the default mode. Once restart free ("in-place") update of pod requests is available, it may be used as the preferred update mechanism by the `Auto` mode. When using `Recreate` mode, VPA evicts a pod if it needs to change its resource requests. It may cause the pods to be restarted all at once, thereby causing application inconsistencies. You can limit restarts and maintain consistency in this situation by using a [PodDisruptionBudget][pod-disruption-budget].
* `Recreate` - VPA assigns resource requests during pod creation as well as update existing pods by evicting them when the requested resources differ significantly from the new recommendation (respecting the Pod Disruption Budget, if defined). This mode should be used rarely, only if you need to ensure that the pods are restarted whenever the resource request changes. Otherwise, the `Auto` mode is preferred, which may take advantage of restart-free updates once they are available.
* `Initial` - VPA only assigns resource requests during pod creation and never changes afterwards.
* `Off` - VPA doesn't automatically change the resource requirements of the pods. The recommendations are calculated and can be inspected in the VPA object.

## Deployment pattern during application development

A common deployment pattern recommended for you if you're unfamiliar with VPA is to perform the following steps during application development in order to identify its unique resource utilization characteristics, test VPA to verify it is functioning properly, and test alongside other Kubernetes components to optimize resource utilization of the cluster.

1. Set UpdateMode = "Off" in your production cluster and run VPA in recommendation mode so you can test and gain familiarity with VPA. UpdateMode = "Off" can avoid introducing a misconfiguration that can cause an outage.

2. Establish observability first by collecting actual resource utilization telemetry over a given period of time. This helps you understand the behavior and signs of symptoms or issues from container and pod resources influenced by the workloads running on them.

3. Get familiar with the monitoring data to understand the performance characteristics. Based on this insight, set the desired requests/limits accordingly and then in the next deployment or upgrade

4. Set `updateMode` value to `Auto`, `Recreate`, or `Initial` depending on your requirements.

## Deploy, upgrade, or disable VPA on a cluster

In this section, you deploy, upgrade, or disable the Vertical Pod Autoscaler on your cluster.

1. To enable VPA on a new cluster, use `--enable-vpa` parameter with the [az aks create][az-aks-create] command.

    ```azurecli-interactive
    az aks create -n myAKSCluster -g myResourceGroup --enable-vpa
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

2. Optionally, to enable VPA on an existing cluster, use the `--enable-vpa` with the [az aks upgrade][az-aks-upgrade] command.

    ```azurecli-interactive
    az aks update -n myAKSCluster -g myResourceGroup --enable-vpa
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

3. Optionally, to disable VPA on an existing cluster, use the `--disable-vpa` with the [az aks upgrade][az-aks-upgrade] command.

    ```azurecli-interactive
    az aks update -n myAKSCluster -g myResourceGroup --disable-vpa
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

4. To verify that the Vertical Pod Autoscaler pods have been created successfully, use the [kubectl get][kubectl-get] command.

```bash
kubectl get pods -n kube-system
```

The output of the command includes the following results specific to the VPA pods. The pods should show a *running* status.

```output
NAME                                        READY   STATUS    RESTARTS   AGE
vpa-admission-controller-7867874bc5-vjfxk   1/1     Running   0          41m
vpa-recommender-5fd94767fb-ggjr2            1/1     Running   0          41m
vpa-updater-56f9bfc96f-jgq2g                1/1     Running   0          41m
```

## Test your Vertical Pod Autoscaler installation

The following steps create a deployment with two pods, each running a single container that requests 100 millicores and tries to utilize slightly above 500 millicores. Also a VPA config is created, pointing at the deployment. The VPA observes the behavior of the pods, and after about five minutes, they're updated with a higher CPU request.

1. Create a file named `hamster.yaml` and copy in the following manifest of the Vertical Pod Autoscaler example from the [kubernetes/autoscaler][kubernetes-autoscaler-github-repo] GitHub repository.

1. Deploy the `hamster.yaml` Vertical Pod Autoscaler example using the [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest:

    ```bash
    kubectl apply -f hamster.yaml
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

1. Run the following [kubectl get][kubectl-get] command to get the pods from the hamster example application:

    ```bash
    kubectl get pods -l app=hamster
    ```

    The example output resembles the following:

    ```output
    hamster-78f9dcdd4c-hf7gk   1/1     Running   0          24s
    hamster-78f9dcdd4c-j9mc7   1/1     Running   0          24s
    ```

1. Use the [kubectl describe][kubectl-describe] command on one of the pods to view its CPU and memory reservation. Replace "exampleID" with one of the pod IDs returned in your output from the previous step.

    ```bash
    kubectl describe pod hamster-exampleID
    ```

    The example output is a snippet of the information about the cluster:

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

    The pod has 100 millicpu and 50 Mibibytes of memory reserved in this example. For this sample application, the pod needs less than 100 millicpu to run, so there's no CPU capacity available. The pods also reserves much less memory than needed. The Vertical Pod Autoscaler *vpa-recommender* deployment analyzes the pods hosting the hamster application to see if the CPU and memory requirements are appropriate. If adjustments are needed, the vpa-updater relaunches the pods with updated values.

1. Wait for the vpa-updater to launch a new hamster pod, which should take a few minutes. You can monitor the pods using the [kubectl get][kubectl-get] command.

    ```bash
    kubectl get --watch pods -l app=hamster
    ```

1. When a new hamster pod is started, describe the pod running the [kubectl describe][kubectl-describe] command and view the updated CPU and memory reservations.

    ```bash
    kubectl describe pod hamster-<exampleID>
    ```

    The example output is a snippet of the information describing the pod:

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

    In the previous output, you can see that the CPU reservation increased to 587 millicpu, which is over five times the original value. The memory increased to 262,144 Kilobytes, which is around 250 Mibibytes, or five times the original value. This pod was under-resourced, and the Vertical Pod Autoscaler corrected the estimate with a much more appropriate value.

1. To view updated recommendations from VPA, run the [kubectl describe][kubectl-describe] command to describe the hamster-vpa resource information.

    ```bash
    kubectl describe vpa/hamster-vpa
    ```

    The example output is a snippet of the information about the resource utilization:

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

## Set Pod Autoscaler requests

Vertical Pod autoscaling uses the `VerticalPodAutoscaler` object to automatically set resource requests on pods when the updateMode is set to a **Auto**. You can set a different value depending on your requirements and testing. In this example, updateMode is set to `Recreate`.

1. Enable VPA for your cluster by running the following command. Replace cluster name `myAKSCluster` with the name of your AKS cluster and replace `myResourceGroup` with the name of the resource group the cluster is hosted in.

    ```azurecli-interactive
    az aks update -n myAKSCluster -g myResourceGroup --enable-vpa
    ```

2. Create a file named `azure-autodeploy.yaml`, and copy in the following manifest.

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

    This manifest describes a deployment that has two pods. Each pod has one container that requests 100 milliCPU and 50 MiB of memory.

3. Create the pod with the [kubectl create][kubectl-create] command, as shown in the following example:

    ```bash
    kubectl create -f azure-autodeploy.yaml
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

4. Run the following [kubectl get][kubectl-get] command to get the pods:

    ```bash
    kubectl get pods
    ```

    The output resembles the following example showing the name and status of the pods:

    ```output
    NAME                                   READY   STATUS    RESTARTS   AGE
    vpa-auto-deployment-54465fb978-kchc5   1/1     Running   0          52s
    vpa-auto-deployment-54465fb978-nhtmj   1/1     Running   0          52s
    ```

5. Create a file named `azure-vpa-auto.yaml`, and copy in the following manifest that describes a `VerticalPodAutoscaler`:

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

    The `targetRef.name` value specifies that any pod that's controlled by a deployment named `vpa-auto-deployment` belongs to `VerticalPodAutoscaler`. The `updateMode` value of `Recreate` means that the Vertical Pod Autoscaler controller can delete a pod, adjust the CPU and memory requests, and then create a new pod.

6. Apply the manifest to the cluster using the [kubectl apply][kubectl-apply] command:

    ```bash
    kubectl create -f azure-vpa-auto.yaml
    ```

7. Wait a few minutes, and view the running pods again by running the following [kubectl get][kubectl-get] command:

    ```bash
    kubectl get pods
    ```

    The output resembles the following example showing the pod names have changed and status of the pods:

    ```output
    NAME                                   READY   STATUS    RESTARTS   AGE
    vpa-auto-deployment-54465fb978-qbhc4   1/1     Running   0          2m49s
    vpa-auto-deployment-54465fb978-vbj68   1/1     Running   0          109s
    ```

8. Get detailed information about one of your running pods by using the [Kubectl get][kubectl-get] command. Replace `podName` with the name of one of your pods that you retrieved in the previous step.

    ```bash
    kubectl get pod podName --output yaml
    ```

    The output resembles the following example, showing that the Vertical Pod Autoscaler controller has increased the memory request to 262144k and CPU request to 25 milliCPU.

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

9. To get detailed information about the Vertical Pod Autoscaler and its recommendations for CPU and memory, use the [kubectl get][kubectl-get] command:

    ```bash
    kubectl get vpa vpa-auto --output yaml
    ```

    The output resembles the following example:

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

    The results show the `target` attribute specifies that for the container to run optimally, it doesn't need to change the CPU or the memory target. Your results may vary where the target CPU and memory recommendation are higher.

    The Vertical Pod Autoscaler uses the `lowerBound` and `upperBound` attributes to decide whether to delete a pod and replace it with a new pod. If a pod has requests less than the lower bound or greater than the upper bound, the Vertical Pod Autoscaler deletes the pod and replaces it with a pod that meets the target attribute.

## Extra Recommender for Vertical Pod Autoscaler

In the VPA, one of the core components is the Recommender. It provides recommendations for resource usage based on real time resource consumption. AKS deploys a recommender when a cluster enables VPA. You can deploy a customized recommender or an extra recommender with the same image as the default one. The benefit of having a customized recommender is that you can customize your recommendation logic. With an extra recommender, you can partition VPAs to multiple recommenders if there are many VPA objects.

The following example is an extra recommender that you apply to your existing AKS cluster. You then configure the VPA object to use the extra recommender.

1. Create a file named `extra_recommender.yaml` and copy in the following manifest:

    ```json
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
            runAsUser: 65534 # nobody 
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

2. Deploy the `extra-recomender.yaml` Vertical Pod Autoscaler example using the [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest.

    ```bash
    kubectl apply -f extra-recommender.yaml 
    ```

   After a few minutes, the command completes and returns JSON-formatted information about the cluster.

3. Create a file named `hamnster_extra_recommender.yaml` and copy in the following manifest:

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

   If `memory` is not specified in `controlledResources`, the Recommender doesn't respond to OOM events. In this case, you are only setting CPU in `controlledValues`. `controlledValues` allows you to choose whether to update the container's resource requests by `RequestsOnly` option, or both resource requests and limits using the `RequestsAndLimits` option. The default value is `RequestsAndLimits`. If you use the `RequestsAndLimits` option, **requests** are computed based on actual usage, and **limits** are calculated based on the current pod's request and limit ratio.

   For example, if you start with a pod that requests 2 CPUs and limits to 4 CPUs, VPA always sets the limit to be twice as much as requests. The same principle applies to memory. When you use the `RequestsAndLimits` mode, it can serve as a blueprint for your initial application resource requests and limits.

You can simplify VPA object by using Auto mode and computing recommendations for both CPU and Memory.

4. Deploy the `hamster_extra-recomender.yaml` example using the [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest.

    ```bash
    kubectl apply -f hamster_customized_recommender.yaml
    ```

5. Wait for the vpa-updater to launch a new hamster pod, which should take a few minutes. You can monitor the pods using the [kubectl get][kubectl-get] command.

    ```bash
    kubectl get --watch pods -l app=hamster
    ````

6. When a new hamster pod is started, describe the pod running the [kubectl describe][kubectl-describe] command and view the updated CPU and memory reservations.

    ```bash
    kubectl describe pod hamster-<exampleID>
    ```

   The example output is a snippet of the information describing the pod:

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

7. To view updated recommendations from VPA, run the [kubectl describe][kubectl-describe] command to describe the hamster-vpa resource information.

    ```bash
    kubectl describe vpa/hamster-vpa
    ```

   The example output is a snippet of the information about the resource utilization:

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

## Troubleshooting

To diagnose problems with a VPA installation, perform the following steps.

1. Check if all system components are running using the following command:

   ```bash
   kubectl --namespace=kube-system get pods|grep vpa
   ```

The output should list three pods - recommender, updater and admission-controller all with the state showing a status of `Running`.

2. Confirm if the system components log any errors. For each of the pods returned by the previous command, run the following command:

    ```bash
    kubectl --namespace=kube-system logs [pod name] | grep -e '^E[0-9]\{4\}'
    ```

3. Confirm that the custom resource definition was created by running the following command:

    ```bash
    kubectl get customresourcedefinition | grep verticalpodautoscalers
    ```

## Next steps

This article showed you how to automatically scale resource utilization, such as CPU and memory, of cluster nodes to match application requirements. 

* You can also use the horizontal pod autoscaler to automatically adjust the number of pods that run your application. For steps on using the horizontal pod autoscaler, see [Scale applications in AKS][scale-applications-in-aks].

* See the Vertical Pod Autoscaler [API reference] to learn more about the definitions for related VPA objects.

<!-- EXTERNAL LINKS -->
[kubernetes-autoscaler-github-repo]: https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/examples/hamster.yaml
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-create]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[github-autoscaler-repo-v011]: https://github.com/kubernetes/autoscaler/blob/vpa-release-0.11/vertical-pod-autoscaler/pkg/apis/autoscaling.k8s.io/v1/types.go
[pod-disruption-budget]: https://kubernetes.io/docs/concepts/workloads/pods/disruptions/

<!-- INTERNAL LINKS -->
[get-started-with-aks]: /azure/architecture/reference-architectures/containers/aks-start-here
[install-azure-cli]: /cli/azure/install-azure-cli
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-upgrade]: /cli/azure/aks#az-aks-upgrade
[horizontal-pod-autoscaling]: concepts-scale.md#horizontal-pod-autoscaler
[scale-applications-in-aks]: tutorial-kubernetes-scale.md
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[horizontal-pod-autoscaler-overview]: concepts-scale.md#horizontal-pod-autoscaler
