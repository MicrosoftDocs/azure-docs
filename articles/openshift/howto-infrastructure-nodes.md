---
title: Deploy infrastructure nodes in an Azure Red Hat OpenShift (ARO) cluster
description: Discover how to deploy infrastructure nodes in Azure Red Hat OpenShift (ARO)
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
keywords: infrastructure nodes, aro, deploy, openshift, red hat
ms.topic: how-to
ms.date: 11/27/2023
ms.custom: template-how-to
---

# Deploy infrastructure nodes in an Azure Red Hat OpenShift (ARO) cluster

ARO allows you to use infrastructure machine sets to create machines that only host infrastructure components, such as the default router, the integrated container registry, and the components for cluster metrics and monitoring. These infrastructure machines don't incur OpenShift costs; they only incur Azure Compute costs.

In a production deployment, it's recommended that you deploy three machine sets to hold infrastructure components. Each of these nodes can be deployed to different availability zones to increase availability. This type of configuration requires three different machines sets; one for each availability zone.

## Qualified workloads

The following infrastructure workloads don't incur Azure Red Hat OpenShift worker subscriptions:

- Kubernetes and Azure Red Hat OpenShift control plane services that run on masters

- The default router

- The integrated container image registry

- The HAProxy-based Ingress Controller

- The cluster metrics collection, or monitoring service, including components for monitoring user-defined projects

- Cluster-aggregated logging

> [!IMPORTANT]
> Running workloads other than the designated kinds on the infrastructure nodes may affect the Service Level Agreement (SLA) and the stability of the cluster. 

## Before you begin

In order for Azure VMs added to an ARO cluster to be recognized as infrastructure nodes (as opposed to more worker nodes) and not be charged an OpenShift fee, the following criteria must be met:

- The nodes must be one of the following instance types only:
    - Standard_E4s_v5
    - Standard_E8s_v5
    - Standard_E16s_v5
    - Standard_E4as_v5
    - Standard_E8as_v5
    - Standard_E16as_v5
    
- There can be no more than three nodes. Any additional nodes are charged an OpenShift fee.

- The nodes must have an Azure tag of **node_role: infra**

- Only workloads designated for infrastructure nodes are allowed. All other workloads would deem these worker nodes and thus subject to the fee. This may also invalidate the SLA and compromise the stability of the cluster.


## Creating infrastructure machine sets

1. Use the [template below](#manifest-definition-template) to create the manifest definition for your infrastructure machine set.

1. Replace all fields in between "<>" with your specific values.

    For example, replace `location: <REGION>` with `location: westus2`

1. For help filling out the required values, see [Commands and values](#commands-and-values).

1. Create the machine set with the following command: `oc create -f <machine-set-filename.yaml>`

1. To verify the creation of the machine set, run the following command: `oc get machineset -n openshift-machine-api`

    The output of the verification command should look similar to below:
    
    ```
    NAME                            DESIRED     CURRENT  READY   AVAILABLE   AGE
    ok0608-vkxvw-infra-westus21     1           1        1       1           165M
    ok0608-vkxvw-worker-westus21    1           1        1       1           4H24M
    ok0608-vkxvw-worker-westus22    1           1        1       1           4H24M 
    ok0608-vkxvw-worker-westus23    1           1        1       1           4H24M
    ```
    
### Manifest definition template

Use the following template in the procedure above to create the manifest definition for your infrastructure machine set:

```
apiVersion: machine.openshift.io/v1beta1
kind: MachineSet
metadata:
  labels:
    machine.openshift.io/cluster-api-cluster: <INFRASTRUCTURE_ID> 
    machine.openshift.io/cluster-api-machine-role: infra 
    machine.openshift.io/cluster-api-machine-type: infra 
  name: <INFRASTRUCTURE_ID>-infra-<REGION><ZONE>
  namespace: openshift-machine-api
spec:
  replicas: 1
  selector:
    matchLabels:
      machine.openshift.io/cluster-api-cluster: <INFRASTRUCTURE_ID>
      machine.openshift.io/cluster-api-machineset: <INFRASTRUCTURE_ID>-infra-<REGION><ZONE>
  template:
    metadata:
      creationTimestamp: null
      labels:
        machine.openshift.io/cluster-api-cluster: <INFRASTRUCTURE_ID>
        machine.openshift.io/cluster-api-machine-role: infra 
        machine.openshift.io/cluster-api-machine-type: infra 
        machine.openshift.io/cluster-api-machineset: <INFRASTRUCTURE_ID>-infra-<REGION><ZONE>
    spec:
      metadata:
        creationTimestamp: null
        labels:
          machine.openshift.io/cluster-api-machineset: <OPTIONAL: Specify the machine set name to enable the use of availability sets. This setting only applies to new compute machines.> 
          node-role.kubernetes.io/infra: ''
      providerSpec:
        value:
          apiVersion: azureproviderconfig.openshift.io/v1beta1
          credentialsSecret:
            name: azure-cloud-credentials
            namespace: openshift-machine-api
          image: 
            offer: aro4
            publisher: azureopenshift
            sku: <SKU>
            version: <VERSION>
          kind: AzureMachineProviderSpec
          location: <REGION>
          metadata:
            creationTimestamp: null
          natRule: null
          networkResourceGroup: <NETWORK_RESOURCE_GROUP>
          osDisk:
            diskSizeGB: 128
            managedDisk:
              storageAccountType: Premium_LRS
            osType: Linux
          publicIP: false
          resourceGroup: <CLUSTER_RESOURCE_GROUP>
          tags:
            node_role: infra
          subnet: <SUBNET_NAME>   
          userDataSecret:
            name: worker-user-data 
          vmSize: <Standard_E4s_v5, Standard_E8s_v5, Standard_E16s_v5>
          vnet: aro-vnet 
          zone: <ZONE>
      taints: 
      - key: node-role.kubernetes.io/infra
        effect: NoSchedule
```

### Commands and values

Below are some common commands/values used when creating and executing the template.

List all machine sets:

```
oc get machineset -n openshift-machine-api
```

Get details for a specific machine set:

```
oc get machineset <machineset_name> -n openshift-machine-api -o yaml
```

Cluster resource group:

```
oc get infrastructure cluster -o jsonpath='{.status.platformStatus.azure.resourceGroupName}'
```

Network resource group:

```
oc get infrastructure cluster -o jsonpath='{.status.platformStatus.azure.networkResourceGroupName}'
```

Infrastructure ID:

```
oc get infrastructure cluster -o jsonpath='{.status.infrastructureName}'
```

Region:

```
oc get machineset <machineset_name> -n openshift-machine-api -o jsonpath='{.spec.template.spec.providerSpec.value.location}'
```

SKU:

```
oc get machineset <machineset_name> -n openshift-machine-api -o jsonpath='{.spec.template.spec.providerSpec.value.image.sku}'
```

Subnet:

```
oc get machineset <machineset_name> -n openshift-machine-api -o jsonpath='{.spec.template.spec.providerSpec.value.subnet}'
```

Version:

```
oc get machineset <machineset_name> -n openshift-machine-api -o jsonpath='{.spec.template.spec.providerSpec.value.image.version}'
```

Vnet:

```
oc get machineset <machineset_name> -n openshift-machine-api -o jsonpath='{.spec.template.spec.providerSpec.value.vnet}'
```

## Moving workloads to the new infrastructure nodes

Use the instructions below to move your infrastructure workloads to the infrastructure nodes previously created.

### Ingress

Use this procedure for any additional ingress controllers you may have in the cluster.

> [!NOTE]
> If your application has very high ingress resource requirements, it may be better to spread them across worker nodes or a dedicated machine set.
> 

1. Set the `nodePlacement` on the `ingresscontroller` to `node-role.kubernetes.io/infra` and increase the `replicas` to match the number of infrastructure nodes:
  
    ```
    oc patch -n openshift-ingress-operator ingresscontroller default --type=merge  \
     -p='{"spec":{"replicas":3,"nodePlacement":{"nodeSelector":{"matchLabels":{"node-role.kubernetes.io/infra":""}},"tolerations":[{"effect":"NoSchedule","key":"node-role.kubernetes.io/infra","operator":"Exists"}]}}}'
    ```
    
1. Verify that the Ingress Controller Operator is starting pods on the new infrastructure nodes:

    ```
    oc -n openshift-ingress get pods -o wide
    ```
    
    ```
    NAME                              READY   STATUS        RESTARTS   AGE   IP         NODE                                                    NOMINATED NODE   READINESS GATES
    router-default-69f58645b7-6xkvh   1/1     Running       0          66s   10.129.6.6    cz-cluster-hsmtw-infra-aro-machinesets-eastus-3-l6dqw   <none>           <none>
    router-default-69f58645b7-vttqz   1/1     Running       0          66s   10.131.4.6    cz-cluster-hsmtw-infra-aro-machinesets-eastus-1-vr56r   <none>           <none>
    router-default-6cb5ccf9f5-xjgcp   1/1     Terminating   0          23h   10.131.0.11   cz-cluster-hsmtw-worker-eastus2-xj9qx                   <none>           <none>
    ```
    
### Registry

1. Set the `nodePlacement` on the registry to `node-role.kubernetes.io/infra`:

    ```
    oc patch configs.imageregistry.operator.openshift.io/cluster --type=merge \
    -p='{"spec":{"affinity":{"podAntiAffinity":{"preferredDuringSchedulingIgnoredDuringExecution":[{"podAffinityTerm":{"namespaces":["openshift-image-registry"],"topologyKey":"kubernetes.io/hostname"},"weight":100}]}},"logLevel":"Normal","managementState":"Managed","nodeSelector":{"node-role.kubernetes.io/infra":""},"tolerations":[{"effect":"NoSchedule","key":"node-role.kubernetes.io/infra","operator":"Exists"}]}}'
    ```
    
1. Verify that the Registry Operator is starting pods on the new infrastructure nodes:

    ```
    oc -n openshift-image-registry get pods -l "docker-registry" -o wide
    ```
    
    ```
    NAME                              READY   STATUS    RESTARTS   AGE     IP           NODE                                                    NOMINATED NODE   READINESS GATES
    image-registry-84cbd76d5d-cfsw7   1/1     Running   0          3h46m   10.128.6.7   cz-cluster-hsmtw-infra-aro-machinesets-eastus-2-kljml   <none>           <none>
    image-registry-84cbd76d5d-p2jf9   1/1     Running   0          3h46m   10.129.6.7   cz-cluster-hsmtw-infra-aro-machinesets-eastus-3-l6dqw   <none>           <none>
    ```
    
### Cluster monitoring

1. Configure the cluster monitoring stack to use the infrastructure nodes.

    > [!NOTE]
    > This will override any other customizations to the cluster monitoring stack, so you may want to merge your existing customizations before running the command.
    > 

    ```
    cat << EOF | oc apply -f -
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: cluster-monitoring-config
      namespace: openshift-monitoring
    data:
      config.yaml: |+
        alertmanagerMain:
          nodeSelector:
            node-role.kubernetes.io/infra: ""
          tolerations:
            - effect: "NoSchedule"
              key: "node-role.kubernetes.io/infra"
              operator: "Exists"
        prometheusK8s:
          nodeSelector:
            node-role.kubernetes.io/infra: ""
          tolerations:
            - effect: "NoSchedule"
              key: "node-role.kubernetes.io/infra"
              operator: "Exists"
        prometheusOperator: {}
        grafana:
          nodeSelector:
            node-role.kubernetes.io/infra: ""
          tolerations:
            - effect: "NoSchedule"
              key: "node-role.kubernetes.io/infra"
              operator: "Exists"
        k8sPrometheusAdapter:
          nodeSelector:
            node-role.kubernetes.io/infra: ""
          tolerations:
            - effect: "NoSchedule"
              key: "node-role.kubernetes.io/infra"
              operator: "Exists"
        kubeStateMetrics:
          nodeSelector:
            node-role.kubernetes.io/infra: ""
          tolerations:
            - effect: "NoSchedule"
              key: "node-role.kubernetes.io/infra"
              operator: "Exists"
        telemeterClient:
          nodeSelector:
            node-role.kubernetes.io/infra: ""
          tolerations:
            - effect: "NoSchedule"
              key: "node-role.kubernetes.io/infra"
              operator: "Exists"
        openshiftStateMetrics:
          nodeSelector:
            node-role.kubernetes.io/infra: ""
          tolerations:
            - effect: "NoSchedule"
              key: "node-role.kubernetes.io/infra"
              operator: "Exists"
        thanosQuerier:
          nodeSelector:
            node-role.kubernetes.io/infra: ""
          tolerations:
            - effect: "NoSchedule"
              key: "node-role.kubernetes.io/infra"
              operator: "Exists"
    EOF
    ```
        
1. Verify that the OpenShift Monitoring Operator is starting pods on the new infrastructure nodes. Note that some nodes (such as `prometheus-operator`) will remain on master nodes.

    ```
    oc -n openshift-monitoring get pods -o wide
    ```
    
    
    ```
    NAME                                           READY   STATUS    RESTARTS   AGE     IP            NODE                                                    NOMINATED NODE   READINESS GATES
    alertmanager-main-0                            6/6     Running   0          2m14s   10.128.6.11   cz-cluster-hsmtw-infra-aro-machinesets-eastus-2-kljml   <none>           <none>
    alertmanager-main-1                            6/6     Running   0          2m46s   10.131.4.11   cz-cluster-hsmtw-infra-aro-machinesets-eastus-1-vr56r   <none>           <none>
    cluster-monitoring-operator-5bbfd998c6-m9w62   2/2     Running   0          28h     10.128.0.23   cz-cluster-hsmtw-master-1                               <none>           <none>
    grafana-599d4b948c-btlp2                       3/3     Running   0          2m48s   10.131.4.10   cz-cluster-hsmtw-infra-aro-machinesets-eastus-1-vr56r   <none>           <none>
    kube-state-metrics-574c5bfdd7-f7fjk            3/3     Running   0          2m49s   10.131.4.8    cz-cluster-hsmtw-infra-aro-machinesets-eastus-1-vr56r   <none>           <none>
    ```
    
