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

Azure Kubernetes Service (AKS) provides a flexible solution to deploy a managed Kubernetes cluster in Azure. As resource demands increase, the cluster autoscaler allows your cluster to grow to meet that demand based on constraints you set. The cluster autoscaler (CA) does this by scaling your agent nodes based on pending pods. It scans the cluster periodically to check for pending pods or empty nodes and increases the size if possible. By default, the CA scans for pending pods every 10 seconds and removes a node if it's unneeded for more than 10 minutes. When used with the [horizontal pod autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) (HPA), the HPA will update pod replicas and resources as per demand. If there aren't enough nodes or unneeded nodes following this pod scaling, the CA will respond and schedule the pods on the new set of nodes.

This article describes how to deploy the cluster autoscaler on the agent nodes. However, since the cluster autoscaler is deployed in the kube-system namespace, the autoscaler will not scale down the node running that pod.

> [!IMPORTANT]
> Azure Kubernetes Service (AKS) cluster autoscaler integration is currently in **preview**. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA).
>

## Prerequisites

This document assumes that you have an RBAC-enabled AKS cluster. If you need an AKS cluster, see the [Azure Kubernetes Service (AKS) quickstart][aks-quick-start].

 To use the cluster autoscaler, your cluster must be using Kubernetes v1.10.X or higher and must be RBAC-enabled. To upgrade your cluster, see the article on [upgrading an AKS cluster][aks-upgrade].

## Gather information

To generate the permissions for your cluster autoscaler to run in your cluster, run this bash script:

```sh
#! /bin/bash
ID=`az account show --query id -o json`
SUBSCRIPTION_ID=`echo $ID | tr -d '"' `

TENANT=`az account show --query tenantId -o json`
TENANT_ID=`echo $TENANT | tr -d '"' | base64`

read -p "What's your cluster name? " cluster_name
read -p "Resource group name? " resource_group

CLUSTER_NAME=`echo $cluster_name | base64`
RESOURCE_GROUP=`echo $resource_group | base64`

PERMISSIONS=`az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/$SUBSCRIPTION_ID" -o json`
CLIENT_ID=`echo $PERMISSIONS | sed -e 's/^.*"appId"[ ]*:[ ]*"//' -e 's/".*//' | base64`
CLIENT_SECRET=`echo $PERMISSIONS | sed -e 's/^.*"password"[ ]*:[ ]*"//' -e 's/".*//' | base64`

SUBSCRIPTION_ID=`echo $ID | tr -d '"' | base64 `

NODE_RESOURCE_GROUP=`az aks show --name $cluster_name  --resource-group $resource_group -o tsv --query 'nodeResourceGroup' | base64`

echo "---
apiVersion: v1
kind: Secret
metadata:
	name: cluster-autoscaler-azure
	namespace: kube-system
data:
	ClientID: $CLIENT_ID
	ClientSecret: $CLIENT_SECRET
	ResourceGroup: $RESOURCE_GROUP
	SubscriptionID: $SUBSCRIPTION_ID
	TenantID: $TENANT_ID
	VMType: QUtTCg==
	ClusterName: $CLUSTER_NAME
	NodeResourceGroup: $NODE_RESOURCE_GROUP
---"
```

After following the steps in the script, the script will output your details in the form of a secret, like so:

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: cluster-autoscaler-azure
  namespace: kube-system
data:
  ClientID: <base64-encoded-client-id>
  ClientSecret: <base64-encoded-client-secret>$
  ResourceGroup: <base64-encoded-resource-group>  SubscriptionID: <base64-encode-subscription-id>
  TenantID: <base64-encoded-tenant-id>
  VMType: QUtTCg==
  ClusterName: <base64-encoded-clustername>
  NodeResourceGroup: <base64-encoded-node-resource-group>
---
```

Next, get the name of your node pool by running the following command. 

```console
$ kubectl get nodes --show-labels
```

Output:

```console
NAME                       STATUS    ROLES     AGE       VERSION   LABELS
aks-nodepool1-37756013-0   Ready     agent     1h        v1.10.3   agentpool=nodepool1,beta.kubernetes.io/arch=amd64,beta.kubernetes.io/instance-type=Standard_DS1_v2,beta.kubernetes.io/os=linux,failure-domain.beta.kubernetes.io/region=eastus,failure-domain.beta.kubernetes.io/zone=0,kubernetes.azure.com/cluster=MC_[resource-group]\_[cluster-name]_[location],kubernetes.io/hostname=aks-nodepool1-37756013-0,kubernetes.io/role=agent,storageprofile=managed,storagetier=Premium_LRS
 ```

Then, extract the value of the label **agentpool**. The default name for the node pool of a cluster is "nodepool1".

Now using your secret and node pool, you can create a deployment chart.

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
      - image: gcr.io/google-containers/cluster-autoscaler:v1.2.2
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

Copy and paste the secret created in the previous step, and insert it at the start of the file.

Next, to set the range of nodes, fill in the argument for `--nodes` under `command` in the form MIN:MAX:NODE_POOL_NAME. For example: `--nodes=3:10:nodepool1` sets the minimum number of nodes to 3, the maximum number of nodes to 10, and the node pool name to nodepool1.

Then, fill in the image field under **containers** with the version of the cluster autoscaler you want to use. AKS requires v1.2.2 or newer. The example here uses v1.2.2.

## Deployment

Deploy cluster-autoscaler by running

```console
kubectl create -f aks-cluster-autoscaler.yaml
```

To check if the cluster autoscaler is running, use the following command and check the list of pods. There should be a pod prefixed with "cluster-autoscaler" running. If you see this, your cluster autoscaler has been deployed.

```console
kubectl -n kube-system get pods
```

To view the status of the cluster autoscaler, run

```console
kubectl -n kube-system describe configmap cluster-autoscaler-status
```

## Interpreting the cluster autoscaler status

```console
$ kubectl -n kube-system describe configmap cluster-autoscaler-status
Name:         cluster-autoscaler-status
Namespace:    kube-system
Labels:       <none>
Annotations:  cluster-autoscaler.kubernetes.io/last-updated=2018-07-25 22:59:22.661669494 +0000 UTC

Data
====
status:
----
Cluster-autoscaler status at 2018-07-25 22:59:22.661669494 +0000 UTC:
Cluster-wide:
  Health:      Healthy (ready=1 unready=0 notStarted=0 longNotStarted=0 registered=1 longUnregistered=0)
               LastProbeTime:      2018-07-25 22:59:22.067828801 +0000 UTC
               LastTransitionTime: 2018-07-25 00:38:36.41372897 +0000 UTC
  ScaleUp:     NoActivity (ready=1 registered=1)
               LastProbeTime:      2018-07-25 22:59:22.067828801 +0000 UTC
               LastTransitionTime: 2018-07-25 00:38:36.41372897 +0000 UTC
  ScaleDown:   NoCandidates (candidates=0)
               LastProbeTime:      2018-07-25 22:59:22.067828801 +0000 UTC
               LastTransitionTime: 2018-07-25 00:38:36.41372897 +0000 UTC

NodeGroups:
  Name:        nodepool1
  Health:      Healthy (ready=1 unready=0 notStarted=0 longNotStarted=0 registered=1 longUnregistered=0 cloudProviderTarget=1 (minSize=1, maxSize=5))
               LastProbeTime:      2018-07-25 22:59:22.067828801 +0000 UTC
               LastTransitionTime: 2018-07-25 00:38:36.41372897 +0000 UTC
  ScaleUp:     NoActivity (ready=1 cloudProviderTarget=1)
               LastProbeTime:      2018-07-25 22:59:22.067828801 +0000 UTC
               LastTransitionTime: 2018-07-25 00:38:36.41372897 +0000 UTC
  ScaleDown:   NoCandidates (candidates=0)
               LastProbeTime:      2018-07-25 22:59:22.067828801 +0000 UTC
               LastTransitionTime: 2018-07-25 00:38:36.41372897 +0000 UTC


Events:  <none>
```

The cluster autoscaler status allows you to see the state of the cluster autoscaler on two different levels: cluster-wide and within each node group. Since AKS currently only supports one node pool, these metrics are the same.

* Health indicates the overall health of the nodes. If the cluster autoscaler struggles to create or removes nodes in the cluster, this status will change to "Unhealthy". There's also a breakdown of the status of different nodes:
    * "Ready" means a node is a ready to have pods scheduled on it.
    * "Unready" means a node that broke down after it started.
    * "NotStarted" means a node isn't fully started yet.
    * "LongNotStarted" means a node failed to start within a reasonable limit.
    * "Registered means a node is registered in the group
    * "Unregistered" means a node is present on the cluster provider side but failed to register in Kubernetes.
  
* ScaleUp allows you to check when the cluster determines a scale up should occur in your cluster.
    * A transition is when the number of nodes in the cluster changes or the status of a node changes.
    * The number of ready nodes is the number of nodes available and ready in the cluster. 
    * The cloudProviderTarget is the number of nodes the cluster autoscaler has determined the cluster needs to handle its workload.

* ScaleDown allows you to check if there are candidates for scale down. 
    * A candidate for scale down is a node the cluster autoscaler has determined can be removed without affecting the cluster's ability to handle its workload. 
    * The times provided show the last time the cluster was checked for scale down candidates and its last transition time.

Finally, under Events, you can see up any scale or scale down events, failed or successful, and their times, that the cluster autoscaler has carried out.

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
