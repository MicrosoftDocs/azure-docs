---
title: Configure Metrics Server VPA in Azure Kubernetes Service (AKS)
description: Learn how to vertically autoscale your Metrics Server pods on an Azure Kubernetes Service (AKS) cluster.
ms.topic: article
ms.date: 03/27/2023
---

# Configure Metrics Server VPA in Azure Kubernetes Service (AKS)

[Metrics Server][metrics-server-overview] is a scalable, efficient source of container resource metrics for Kubernetes built-in autoscaling pipelines. With Azure Kubernetes Service (AKS), vertical pod autoscaling is enabled for the Metrics Server. The Metrics Server is commonly used by other Kubernetes add ons, such as the [Horizontal Pod Autoscaler][horizontal-pod-autoscaler].

Vertical Pod Autoscaler (VPA) enables you to adjust the resource limit when the Metrics Server is experiencing consistent CPU and memory resource constraints.

## Before you begin

AKS cluster is running Kubernetes version 1.24 and higher.

## Metrics server throttling

If the Metrics Server throttling rate is high, and the memory usage of its two pods is unbalanced, this indicates the Metrics Server requires more resources than the default values specified.

To update the coefficient values, create a ConfigMap in the overlay *kube-system* namespace to override the values in the Metrics Server specification. Perform the following steps to update the metrics server.

1. Create a ConfigMap file named *metrics-server-config.yaml* and copy in the following manifest.

    ```yml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: metrics-server-config
      namespace: kube-system
      labels:
        kubernetes.io/cluster-service: "true"
        addonmanager.kubernetes.io/mode: EnsureExists
    data:
      NannyConfiguration: |-
        apiVersion: nannyconfig/v1alpha1
        kind: NannyConfiguration
        baseCPU: 100m
        cpuPerNode: 1m
        baseMemory: 100Mi
        memoryPerNode: 8Mi
    ```

    In the ConfigMap example, the resource limit and request are changed to the following:

    * cpu: (100+1n) millicore
    * memory: (100+8n) mebibyte

    Where *n* is the number of nodes.

2. Create the ConfigMap using the [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest:

    ```bash
    kubectl apply -f metrics-server-config.yaml
    ```

3. Restart the Metrics Server pods. There are two Metrics server pods, and the following command deletes all of them.

    ```bash
    kubectl -n kube-system delete po -l k8s-app=metrics-server
    ```

4. To verify the updated resources took effect, run the following command to review the Metrics Server VPA log.

    ```bash
    kubectl -n kube-system logs metrics-server-pod-name -c metrics-server-vpa
    ```

   The following example output resembles the results showing the updated throttling settings were applied.

    ```output
    ERROR: logging before flag.Parse: I0315 23:12:33.956112       1 pod_nanny.go:68] Invoked by [/pod_nanny --config-dir=/etc/config --cpu=44m --extra-cpu=0.5m --memory=51Mi --extra-memory=4Mi --poll-period=180000 --threshold=5 --deployment=metrics-server --container=metrics-server]
    ERROR: logging before flag.Parse: I0315 23:12:33.956159       1 pod_nanny.go:69] Version: 1.8.14
    ERROR: logging before flag.Parse: I0315 23:12:33.956171       1 pod_nanny.go:85] Watching namespace: kube-system, pod: metrics-server-545d8b77b7-5nqq9, container: metrics-server.
    ERROR: logging before flag.Parse: I0315 23:12:33.956175       1 pod_nanny.go:86] storage: MISSING, extra_storage: 0Gi
    ERROR: logging before flag.Parse: I0315 23:12:33.957441       1 pod_nanny.go:116] cpu: 100m, extra_cpu: 1m, memory: 100Mi, extra_memory: 8Mi
    ERROR: logging before flag.Parse: I0315 23:12:33.957456       1 pod_nanny.go:145] Resources: [{Base:{i:{value:100 scale:-3} d:{Dec:<nil>} s:100m Format:DecimalSI} ExtraPerNode:{i:{value:0 scale:-3} d:{Dec:<nil>} s: Format:DecimalSI} Name:cpu} {Base:{i:{value:104857600 scale:0} d:{Dec:<nil>} s:100Mi Format:BinarySI} ExtraPerNode:{i:{value:0 scale:0} d:{Dec:<nil>} s: Format:BinarySI} Name:memory
    ```

Be cautious of the *baseCPU*, *cpuPerNode*, *baseMemory*, and the *memoryPerNode*, because the ConfigMap isn't validated by AKS. As a recommended practice, increase the value gradually to avoid unnecessary resource consumption. Proactively monitor resource usage when updating or creating the ConfigMap. A large number of resource requests could negatively impact the node.

## Manually configure Metrics Server resource usage

The Metrics Server VPA adjusts resource usage by the number of nodes. If the cluster scales up or down often, the Metrics Server might restart frequently. In this case, you can bypass VPA and manually control its resource usage. This method to configure VPA isn't to be performed in addition to the steps described in the previous section.

If you would like to bypass VPA for Metrics Server and manually control its resource usage, perform the following steps.

1. Create a ConfigMap file named *metrics-server-config.yaml* and copy in the following manifest.

    ```yml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: metrics-server-config
      namespace: kube-system
      labels:
        kubernetes.io/cluster-service: "true"
        addonmanager.kubernetes.io/mode: EnsureExists
    data:
      NannyConfiguration: |-
        apiVersion: nannyconfig/v1alpha1
        kind: NannyConfiguration
        baseCPU: 100m
        cpuPerNode: 0m
        baseMemory: 100Mi
        memoryPerNode: 0Mi
    ```

   In this ConfigMap example, it changes the resource limit and request to the following:

   * cpu: 100 millicore
   * memory: 100 mebibyte

   Changing the number of nodes doesn't trigger autoscaling.

2. Create the ConfigMap using the [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest:

   ```yml
   kubectl apply -f metrics-server-config.yaml
   ```

3. Restart the Metrics Server pods. There are two Metrics server pods, and the following command deletes all of them.

    ```bash
    kubectl -n kube-system delete po -l k8s-app=metrics-server
    ```

4. To verify the updated resources took effect, run the following command to review the Metrics Server VPA log.

    ```bash
    kubectl -n kube-system logs metrics-server-pod-name -c metrics-server-vpa
    ```

   The following example output resembles the results showing the updated throttling settings were applied.

    ```output
    ERROR: logging before flag.Parse: I0315 23:12:33.956112       1 pod_nanny.go:68] Invoked by [/pod_nanny --config-dir=/etc/config --cpu=44m 
    --extra-cpu=0.5m --memory=51Mi --extra-memory=4Mi --poll-period=180000 --threshold=5 --deployment=metrics-server --container=metrics-server]
    ERROR: logging before flag.Parse: I0315 23:12:33.956159       1 pod_nanny.go:69] Version: 1.8.14
    ERROR: logging before flag.Parse: I0315 23:12:33.956171       1 pod_nanny.go:85] Watching namespace: kube-system, pod: metrics-server-545d8b77b7-5nqq9, container: metrics-server.
    ERROR: logging before flag.Parse: I0315 23:12:33.956175       1 pod_nanny.go:86] storage: MISSING, extra_storage: 0Gi
    ERROR: logging before flag.Parse: I0315 23:12:33.957441       1 pod_nanny.go:116] cpu: 100m, extra_cpu: 0m, memory: 100Mi, extra_memory: 0Mi
    ERROR: logging before flag.Parse: I0315 23:12:33.957456       1 pod_nanny.go:145] Resources: [{Base:{i:{value:100 scale:-3} d:{Dec:<nil>} s:100m Format:DecimalSI} ExtraPerNode:{i:{value:0 scale:-3} d:{Dec:<nil>} s: Format:DecimalSI} Name:cpu} {Base:{i:{value:104857600 scale:0} d:{Dec:<nil>} s:100Mi Format:BinarySI} 
    ExtraPerNode:{i:{value:0 scale:0} d:{Dec:<nil>} s: Format:BinarySI} Name:memory}]
    ```

## Troubleshooting

1. If you use the following configmap, the Metrics Server VPA customizations aren't applied. You need add a unit for `baseCPU`.

    ```yml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: metrics-server-config
      namespace: kube-system
      labels:
        kubernetes.io/cluster-service: "true"
        addonmanager.kubernetes.io/mode: EnsureExists
    data:
      NannyConfiguration: |-
        apiVersion: nannyconfig/v1alpha1
        kind: NannyConfiguration
        baseCPU: 100
        cpuPerNode: 1m
        baseMemory: 100Mi
        memoryPerNode: 8Mi
    ```
    
   The following example output resembles the results showing the updated throttling settings aren't applied.
    
    ```output
    ERROR: logging before flag.Parse: I0316 23:32:08.383389       1 pod_nanny.go:68] Invoked by [/pod_nanny --config-dir=/etc/config --cpu=44m 
    --extra-cpu=0.5m --memory=51Mi --extra-memory=4Mi --poll-period=180000 --threshold=5 --deployment=metrics-server --container=metrics-server]
    ERROR: logging before flag.Parse: I0316 23:32:08.383430       1 pod_nanny.go:69] Version: 1.8.14
    ERROR: logging before flag.Parse: I0316 23:32:08.383441       1 pod_nanny.go:85] Watching namespace: kube-system, pod: metrics-server-7d78876589-hcrff, container: metrics-server.
    ERROR: logging before flag.Parse: I0316 23:32:08.383446       1 pod_nanny.go:86] storage: MISSING, extra_storage: 0Gi
    ERROR: logging before flag.Parse: I0316 23:32:08.384554       1 pod_nanny.go:192] Unable to decode Nanny Configuration from config map, using default parameters
    ERROR: logging before flag.Parse: I0316 23:32:08.384565       1 pod_nanny.go:116] cpu: 44m, extra_cpu: 0.5m, memory: 51Mi, extra_memory: 4Mi
    ERROR: logging before flag.Parse: I0316 23:32:08.384589       1 pod_nanny.go:145] Resources: [{Base:{i:{value:44 scale:-3} d:{Dec:<nil>} s:44m Format:DecimalSI} ExtraPerNode:{i:{value:5 scale:-4} d:{Dec:<nil>} s: Format:DecimalSI} Name:cpu} {Base:{i:{value:53477376 scale:0} d:{Dec:<nil>} s:51Mi Format:BinarySI} ExtraPerNode:{i:{value:4194304 scale:0} 
    d:{Dec:<nil>} s:4Mi Format:BinarySI} Name:memory}]
    ```

2. For Kubernetes version 1.23 and higher clusters, Metrics Server has a *PodDisruptionBudget*. It ensures the number of available Metrics Server pods is at least one. If you get something like this after running `kubectl -n kube-system get po`, it's possible that the customized resource usage is small. Increase the coefficient values to resolve it.

    ```output
    metrics-server-679b886d4-pxwdf        1/2     CrashLoopBackOff   6 (36s ago)   6m33s
    metrics-server-679b886d4-svxxx        1/2     CrashLoopBackOff   6 (54s ago)   6m33s
    metrics-server-7d78876589-hcrff       2/2     Running            0             37m
    ```

## Next steps

Metrics Server is a component in the core metrics pipeline. For more information see, [Metrics Server API design][metrics-server-api-design]. 

<!-- EXTERNAL LINKS -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[metrics-server-overview]: https://kubernetes-sigs.github.io/metrics-server/
[metrics-server-api-design]: https://github.com/kubernetes/design-proposals-archive/blob/main/instrumentation/resource-metrics-api.md

<!--- INTERNAL LINKS --->
[horizontal-pod-autoscaler]: concepts-scale.md#horizontal-pod-autoscaler
