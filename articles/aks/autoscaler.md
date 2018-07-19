---
title: Kubernetes on Azure - Cluster Autoscaler
description: Learn how to use the cluster autoscaler with Azure Kubernetes Service (AKS) to automatically scale your cluster to meet demand.
services: container-service
author: sakthivetrivel
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 07/19/18
ms.author: sakthivetrivel
ms.custom: mvc
---

# Cluster Autoscaler on Azure Kubernetes Service (AKS) - Preview

Azure Kubernetes Service (AKS) provides a flexible solution to deploy a managed Kubernetes cluster in Azure. As resource demands increase, the cluster autoscaler allows your cluster to grow to meet that demand based on constraints you set. The cluster autoscaler (CA) does this by scaling your agent nodes based on pending pods. It scans the cluster periodically to check for pending pods or empty nodes and increases the size if possible. By default, the CA scans for pending pods every 10 seconds and removes a node if it's unneeded for more than 10 minutes. When used with the horizontal pod autoscaler (HPA), the HPA will update pod replicas and resources as per demand. If there are not enough nodes or unneeded nodes following this pod scaling, the CA will respond and schedule the pods on the new set of nodes.

> [!IMPORTANT]
> Azure Kubernetes Service (AKS) cluster autoscaler integration is currently in **preview**. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA).
>

## Prerequisites

This document assumes that you have an RBAC-enabled AKS cluster. If you need an AKS cluster, see the [Azure Kubernetes Service (AKS) quickstart][aks-quick-start].

 To use the cluster autoscaler, your cluster must be using Kubernetes v1.10.X or higher and must be RBAC-enabled. To upgrade your cluster, see the article on [upgrading an AKS cluster][aks-upgrade].

## Gather information

The following list shows all of the information you must provide in the autoscaler definition.

- *Subscription ID*: ID corresponding to the subscription used for this cluster
- *Resource Group Name* : Name of resource group the cluster belongs to 
- *Cluster Name*: Name of the cluster
- *Client ID*: App ID granted by permission generating step
- *Client Secret*: App secret granted by permission generating step
- *Tenant ID*: ID of the tenant (account owner)
- *Node Resource Group*: Name of resource group containing the agent nodes in the cluster
- *Node Pool Name*: Name of the node pool you would like the scale
- *Minimum Number of Nodes*: Minimum number of nodes to exist in the cluster
- *Maximum Number of Nodes*: Maximum number of nodes to exist in the cluster
- *VM Type*: Service used to generate the Kubernetes cluster

Get your subscription ID with: 

``` azurecli
az account show --query id
```

Generate a set of Azure credentials by running the following command:

```console
$ az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/<subscription-id>" --output json

"appId": <app-id>,
"displayName": <display-name>,
"name": <name>,
"password": <app-password>,
"tenant": <tenant-id>
```

The App ID, Password, and Tenant ID will be your clientID, clientSecret, and tenantID in the following steps.

Get the name of your node pool by running the following command. 

```console
$ kubectl get nodes --show-labels
```

Output:

```console
NAME                       STATUS    ROLES     AGE       VERSION   LABELS
aks-nodepool1-37756013-0   Ready     agent     1h        v1.10.3   agentpool=nodepool1,beta.kubernetes.io/arch=amd64,beta.kubernetes.io/instance-type=Standard_DS1_v2,beta.kubernetes.io/os=linux,failure-domain.beta.kubernetes.io/region=eastus,failure-domain.beta.kubernetes.io/zone=0,kubernetes.azure.com/cluster=MC_[resource-group]\_[cluster-name]_[location],kubernetes.io/hostname=aks-nodepool1-37756013-0,kubernetes.io/role=agent,storageprofile=managed,storagetier=Premium_LRS
 ```

Then, extract the value of the label **agentpool**. The default name for the node pool of a cluster is "nodepool1".

To get the name of your node resource group, extract the value of the label **kubernetes.azure.com<span></span>/cluster**. The node resource group name is generally of the form MC_[resource-group]\_[cluster-name]_[location].

The vmType parameter refers to the service being used, which here, is AKS.

Now, you should have the following information:

- SubscriptionID
- ResourceGroup
- ClusterName
- ClientID
- ClientSecret
- TenantID
- NodeResourceGroup
- VMType

Next, encode all of these values with base64. For example, to encode the VMType value with base64:

```console
$ echo AKS | base64
QUtTCg==
```

## Create secret
Using this data, create a secret for the deployment using the values found in the previous steps in the following format:

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: cluster-autoscaler-azure
  namespace: kube-system
data:
  ClientID: <base64-encoded-client-id>
  ClientSecret: <base64-encoded-client-secret>
  ResourceGroup: <base64-encoded-resource-group>
  SubscriptionID: <base64-encode-subscription-id>
  TenantID: <base64-encoded-tenant-id>
  VMType: QUtTCg==
  ClusterName: <base64-encoded-clustername>
  NodeResourceGroup: <base64-encoded-node-resource-group>
---
```

## Create a deployment chart

Create a file named `aks-cluster-autoscaler.yaml`, and copy into it the following YAML code.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  labels:
    k8s-addon: cluster-autoscaler.addons.k8s.io
    k8s-app: cluster-autoscaler
  name: cluster-autoscaler
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: cluster-autoscaler
  labels:
    k8s-addon: cluster-autoscaler.addons.k8s.io
    k8s-app: cluster-autoscaler
rules:
- apiGroups: [""]
  resources: ["events","endpoints"]
  verbs: ["create", "patch"]
- apiGroups: [""]
  resources: ["pods/eviction"]
  verbs: ["create"]
- apiGroups: [""]
  resources: ["pods/status"]
  verbs: ["update"]
- apiGroups: [""]
  resources: ["endpoints"]
  resourceNames: ["cluster-autoscaler"]
  verbs: ["get","update"]
- apiGroups: [""]
  resources: ["nodes"]
  verbs: ["watch","list","get","update"]
- apiGroups: [""]
  resources: ["pods","services","replicationcontrollers","persistentvolumeclaims","persistentvolumes"]
  verbs: ["watch","list","get"]
- apiGroups: ["extensions"]
  resources: ["replicasets","daemonsets"]
  verbs: ["watch","list","get"]
- apiGroups: ["policy"]
  resources: ["poddisruptionbudgets"]
  verbs: ["watch","list"]
- apiGroups: ["apps"]
  resources: ["statefulsets"]
  verbs: ["watch","list","get"]
- apiGroups: ["storage.k8s.io"]
  resources: ["storageclasses"]
  verbs: ["get", "list", "watch"]

---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: Role
metadata:
  name: cluster-autoscaler
  namespace: kube-system
  labels:
    k8s-addon: cluster-autoscaler.addons.k8s.io
    k8s-app: cluster-autoscaler
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  verbs: ["create"]
- apiGroups: [""]
  resources: ["configmaps"]
  resourceNames: ["cluster-autoscaler-status"]
  verbs: ["delete","get","update"]

---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: cluster-autoscaler
  labels:
    k8s-addon: cluster-autoscaler.addons.k8s.io
    k8s-app: cluster-autoscaler
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-autoscaler
subjects:
  - kind: ServiceAccount
    name: cluster-autoscaler
    namespace: kube-system

---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: cluster-autoscaler
  namespace: kube-system
  labels:
    k8s-addon: cluster-autoscaler.addons.k8s.io
    k8s-app: cluster-autoscaler
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: cluster-autoscaler
subjects:
  - kind: ServiceAccount
    name: cluster-autoscaler
    namespace: kube-system

---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  labels:
    app: cluster-autoscaler
  name: cluster-autoscaler
  namespace: kube-system
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cluster-autoscaler
  template:
    metadata:
      labels:
        app: cluster-autoscaler
    spec:
      serviceAccountName: cluster-autoscaler
      containers:
      - image: k8s.gcr.io/cluster-autoscaler:{{ ca_version }}
        imagePullPolicy: Always
        name: cluster-autoscaler
        resources:
          limits:
            cpu: 100m
            memory: 300Mi
          requests:
            cpu: 100m
            memory: 300Mi
        command:
        - ./cluster-autoscaler
        - --v=3
        - --logtostderr=true
        - --cloud-provider=azure
        - --skip-nodes-with-local-storage=false
        - --nodes=1:10:nodepool1
        env:
        - name: ARM_SUBSCRIPTION_ID
          valueFrom:
            secretKeyRef:
              key: SubscriptionID
              name: cluster-autoscaler-azure
        - name: ARM_RESOURCE_GROUP
          valueFrom:
            secretKeyRef:
              key: ResourceGroup
              name: cluster-autoscaler-azure
        - name: ARM_TENANT_ID
          valueFrom:
            secretKeyRef:
              key: TenantID
              name: cluster-autoscaler-azure
        - name: ARM_CLIENT_ID
          valueFrom:
            secretKeyRef:
              key: ClientID
              name: cluster-autoscaler-azure
        - name: ARM_CLIENT_SECRET
          valueFrom:
            secretKeyRef:
              key: ClientSecret
              name: cluster-autoscaler-azure
        - name: ARM_VM_TYPE
          valueFrom:
            secretKeyRef:
              key: VMType
              name: cluster-autoscaler-azure
        - name: AZURE_CLUSTER_NAME
          valueFrom:
            secretKeyRef:
              key: ClusterName
              name: cluster-autoscaler-azure
        - name: AZURE_NODE_RESOURCE_GROUP
          valueFrom:
            secretKeyRef:
              key: NodeResourceGroup
              name: cluster-autoscaler-azure
      restartPolicy: Always
```

Copy and paste the secret created in the previous step and insert it at the start of the file.

Next, to set the range of nodes, fill in the argument for `--nodes` under `command` in the form MIN:MAX:NODE_POOL_NAME. For example: `--nodes=3:10:nodepool1` sets the minimum number of nodes to 3, the maximum number of nodes to 10, and the node pool name to nodepool1.

Then, fill in the image field under **containers** with the version of the cluster autoscaler you want to use. AKS requires v1.2.2 or newer. The example here uses v1.2.2.

## Deployment

Deploy cluster-autoscaler by running

```console
kubectl create -f cluster-autoscaler-containerservice.yaml
```

To check if the cluster autoscaler is running, use the following command and check the list of pods. If there's a pod prefixed with "cluster-autoscaler" running, your cluster autoscaler has been deployed.

```console
kubectl -n kube-system get pods
```

To view the status of the cluster autoscaler, run

```console
kubectl -n kube-system describe configmap cluster-autoscaler-status
```

## Next steps

To use the cluster autoscaler with the horizontal pod autoscaler, check out [scaling Kubernetes application and infrastructure][aks-tutorial-scale].

Learn more about deploying and managing AKS with the AKS tutorials.

> [!div class="nextstepaction"]
> [AKS Tutorial][aks-tutorial-prepare-app]

<!-- LINKS - internal -->
[aks-quick-start]: ./kubernetes-walkthrough.md
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[aks-tutorial-scale]: ./tutorial-kubernetes-scale.md
[aks-upgrade]: ./upgrade-cluster.md

<!-- LINKS - external -->
[cluster-autoscale]: https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md
