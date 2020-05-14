---
title: "Enable source control for AKS"
services: arc-kubernetes
ms.date: 02/18/2020
ms.topic: "how-to-guide"
description: "Learn GitOps with AKS"
keywords: "Kubernetes, Arc, Azure, AKS, Azure Kubernetes Service, containers"
---
#TODO customer statement

# Enable source contol config for Azure Kubernetes Services(AKS)
Gitops configuration can be enabled for Azure Kubernetes Services(AKS) clusters by following below steps

## Supported AKS cluster regions

1. East US
2. West Europe

## Use Helm to install the config agents to an AKS cluster

Azure k8s config helm chart is stored in our ACR. Add this repo to your Helm configuration.

Add Azure K8S config repo to your local Helm client and update information of available charts locally from the repo:

```console
helm repo add azurearcfork8s https://azurearcfork8s.azurecr.io/helm/v1/repo
helm repo update
```

Fetch azure-k8s-config Helm package from ACR repo (same as any other Helm repo) and list the charts:

```console
helm fetch azurearcfork8s/azure-k8s-config
helm search repo
```

Retrieve tenantId and subscriptionId and set environment variables:

```console
az account show
export RESOURCE_GROUP=managedclusterGroup
export SUBSCRIPTION_ID=57ac26cf-a9f0-4908-b300-9a4e9a0fb205
export LOCATION=eastus # Supported prod regions: eastus, westeurope
export MANAGED_CLUSTER_NAME=azure-k8s1
export AZURE_K8S_ONBOARDING_TENANT=92f988bf-86f1-41af-91ab-2d7cd011db49
```
 
Validate that your environment is configured and ready to go! All values should be filled out.

```console
echo "subscriptionId=${SUBSCRIPTION_ID}"
echo "resourceGroupName=${RESOURCE_GROUP}"
echo "resourceName=${MANAGED_CLUSTER_NAME}"
echo "location=${LOCATION}"
echo "tenantId=${AZURE_K8S_ONBOARDING_TENANT}"
```

Set the KUBECONFIG context to the target AKS cluster
```console
az aks get-credentials --resource-group ${RESOURCE_GROUP} --name ${MANAGED_CLUSTER_NAME} --admin
Merged "azure-k8s1-admin" as current context in C:\Users\yourname\.kube\config
```

Verify KUBECONFIG is pointing to the target AKS cluster
```console
kubectl cluster-info
```

Install the Azure k8s config agent. Ensure that the version of the chart you pass in matches the chart version downloaded above using `helm fetch ...` and listed with `helm search repo`:

```console
helm upgrade azure-k8s-config azure-k8s-config-0.1.18.tgz --install --set global.subscriptionId=${SUBSCRIPTION_ID},global.resourceGroupName=${RESOURCE_GROUP} --set global.resourceName=${MANAGED_CLUSTER_NAME},global.location=${LOCATION} --set global.tenantId=${AZURE_K8S_ONBOARDING_TENANT}     

Release "azure-k8s-config" does not exist. Installing it now.
NAME: azure-k8s-config
LAST DEPLOYED: 2019-01-12 10:58:47.208546 -0700 PDT m=+0.294581782
NAMESPACE: default
STATUS: deployed
```

Verify the agents are installed (you should see the `azure-arc` namespace and the `config-agent` and `controller-manager` pods)
```console
kubectl get namespaces

NAME              STATUS   AGE
azure-arc         Active   59s
default           Active   22h
kube-node-lease   Active   22h
kube-public       Active   22h
kube-system       Active   22h

kubectl get pods -n azure-arc

NAME                                READY   STATUS    RESTARTS   AGE
config-agent-68f64c4f7c-hmptc       1/1     Running   0          3m38s
controller-manager-744744f8-2g2wh   2/2     Running   0          3m38s
```


## Use Azure CLI to enable GitOps in the AKS cluster

Using the Azure CLI extension for `k8sconfiguration`, let's link AKS cluster (managedcluster) to a example git repository. We will give this configuration a name `cluster-config`, instruct the agent to deploy the operator in the `cluster-config` namespace, and give the operator `cluster-admin` permissions.

Make sure to update `k8sconfiguration` CLI version to 0.1.1 or above. [Install or update CLI extensions](./install-cli-extension.md)

```console
az k8sconfiguration create --name cluster-config --cluster-name AzureArcTest1 --resource-group AzureArcTest --operator-instance-name cluster-config --operator-namespace cluster-config --repository-url git://github.com/slack/cluster-config.git --cluster-type managedclusters
```

As seen, the CLI requires additonal parameter "--cluster-type managedclusters" for AKS clusters.  

### Next

To furthur explore k8sconfiguration CLI and gitops scenario follow page: [Apply configuration to your cluster](./03-use-gitops.md)
