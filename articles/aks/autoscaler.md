---
title: Kubernetes on Azure - Cluster Autoscaler
description: Kubernetes on Azure - Cluster Autoscaler
services: container-service
author: sakthivetrivel
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 07/18/18
ms.author: sakthivetrivel
ms.custom: mvc
---

# Cluster Autoscaler on Azure Kubernetes Service

The cluster autoscaler on Azure Kubernetes Service (AKS) scales agent nodes within a specific node pool. The autoscaler runs as a deployment in your AKS cluster. This walkthrough will go over the necessary steps to get the cluster autoscaler up and running on an existing cluster. To use the cluster autoscaler, your cluster must be using Kubernetes v1.10.X or higher and must be RBAC-enabled.

## Create a Deployment Chart

Create a file named `aks-cluster-autoscaler.yaml`, and copy into it the following YAML code.


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
        - --nodes=
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

## Gather information

Generate a set of Azure credentials by running the following command:

```console
# replace <subscription-id> with yours.
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/<subscription-id>" --output json
```

The App ID, App Password, and Tenant ID will be your clientID, clientSecret, and tenantID in the following steps.

Get the name of your node pool by running the following command. Then. extract the value of the label **agentpool**. The default value for the node pool of a cluster is nodepool1. 

  ```console
  kubectl get nodes --show-labels
  ```

To get the name of your node resource group, extract the value of the label **kubernetes.azure.com<span></span>/cluster**. The node resource group name is generally of the form MC_[resource-group]\_[cluster-name]_[location].

The vmType parameter refers to the service being used, which here, is AKS, so use the following base64 encoded value:

```console
$ echo AKS | base64
QUtTCg==
```

Edit the values of cluster-autoscaler-azure secret in **cluster-autoscaler-containerservice.yaml** to include the values found in the previous steps, such as:

- ClientID: `<base64-encoded-client-id>`
- ClientSecret: `<base64-encoded-client-secret>`
- ResourceGroup: `<base64-encoded-resource-group>` (Use lower case)
- SubscriptionID: `<base64-encode-subscription-id>`
- TenantID: `<base64-encoded-tenant-id>`
- VMType: `<base64-encoded-vm-type>`
- ClusterName: `<base64-encoded-clustername>`
- NodeResourceGroup: `<base64-encoded-node-resource-group>` (Use the label's value verbatim. Case sensitive)

All of the data above should be encoded with base64.

Next, to set the range of nodes, fill in the argument for `--nodes` under `command` in the form MIN:MAX:NODE_POOL_NAME. For example: `--nodes=3:10:nodepool1` sets the minimum number of nodes to 3, the maximum number of nodes to 10, and the node pool name to nodepool1.

Then, fill in the image field under **containers** with the version of the cluster autoscaler you want to use. AKS requires v1.2.2 or newer. The example here uses v1.2.2.

The resulting section should look like:

```yaml
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
      # other details skipped...
      containers:
      - image: k8s.gcr.io/cluster-autoscaler:v1.2.2
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
        - --nodes=3:10:nodepool1    
```

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
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[aks-tutorial-scale]: ./tutorial-kubernetes-scale.md

<!-- LINKS - external -->
[cluster-autoscale]: https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md
