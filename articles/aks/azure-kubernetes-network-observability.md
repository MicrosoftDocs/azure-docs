---
title: Setup Network Observability in Azure Kubernetes Service (AKS)
description: Learn how to configure Network Observability in Azure Kubernetes Service (AKS), including setting up visualization using Azure Managed Prometheus and Azure Managed Grafana.
author: khushbu-parekh
ms.author: kparekh
ms.subservice: aks-networking
ms.topic: how-to
ms.custom: references_regions
ms.date: 04/26/2023
---

# Configure Network Observability addon in Azure Kubernetes Service (AKS)

Networking observability addon is a tool that helps collect network data and enables a centralized platform for monitoring application and network health. To learn more read [Concepts][TODO] before proceeding.

To enable gathering Network observability metrics on your cluster, you can refer to the following guidelines, depending on the dataplane(Cilium/ non Cilium) you are utilizing and whether you opt for Managed or Unmanaged Prometheus and Grafana. By adhering to these instructions, you can enable Network observability on your cluster, customized to your chosen configuration and requirements.

|  | Non Cilium Cluster | Cilium Cluster |
|--|--|--| 
|Managed Prometheus and Grafana |Follow steps [here](#setup-instructions-for-network-observability-addon-with-managed-prometheus-and-managed-grafana-non--cilium) | Follow steps [here](#setup-instructions-for-network-observability-addon-with-managed-prometheus-and-managed-grafana-cilium)|
|Unmanaged Prometheus and Grafana | Follow steps here | Follow steps here |


### Setup instructions for Network Observability addon with Managed Prometheus and Managed Grafana (Non- Cilium)    

1) Create a resource group
```azurecli
az group create --name $RESOURCE_GROUP --location $REGION
```

2) Create AKS cluster
```azurecli
az aks create \
--resource-group $RESOURCE_GROUP \
--name $NAME \
--windows-admin-username $WINDOWS_USERNAME \
--generate-ssh-keys \
--network-plugin azure \
--node-count 2 \
--enable-network-observability \
--max-pods 250
```

By default, your cluster is created with only a Linux node pool. If you would like to use Windows node pools, you can add one. For example:

```azurecli
az aks nodepool add \
--resource-group $RESOURCE_GROUP_NAME \
--cluster-name $CLUSTER_NAME 
--os-type Windows \
--name npwin \
--node-count 1
```

3) Create Azure Monitor resource
```azurecli
az resource create \
--resource-group $RESOURCE_GROUP \
--namespace microsoft.monitor \
--resource-type accounts \
--name $AZMON_NAME \
--location $REGION \
--properties '{}'
```

4) Create Grafana instance
```azurecli
az grafana create \
--name $GRAFANA_NAME \
--resource-group $RESOURCE_GROUP
```

5) Get the Azure Monitor and Grafana resource IDs
```azurecli
export AZMON_RESOURCE_ID=$(az resource show --resource-group $RESOURCE_GROUP --name $AZMON_NAME --resource-type "Microsoft.Monitor/accounts" --query id -o tsv)
export GRAFANA_RESOURCE_ID=$(az resource show --resource-group $RESOURCE_GROUP --name $GRAFANA_NAME --resource-type "microsoft.dashboard/grafana" --query id -o tsv)
```

6) Link Azure Monitor Workspace to cluster, as well as grafana instance
```azurecli
az aks update --enable-azuremonitormetrics \
-n $NAME \
-g $RESOURCE_GROUP \
--azure-monitor-workspace-resource-id $AZMON_RESOURCE_ID \
--grafana-resource-id  $GRAFANA_RESOURCE_ID
```

7) Verify that the Azure Monitor pods are running. For example:

Azure CLI:
```azurecli
kubectl get po -owide -n kube-system | grep ama-
```

```azurecli
ama-metrics-5bc6c6d948-zkgc9          2/2     Running   0 (21h ago)   26h
ama-metrics-ksm-556d86b5dc-2ndkv      1/1     Running   0 (26h ago)   26h
ama-metrics-node-lbwcj                2/2     Running   0 (21h ago)   26h
ama-metrics-node-rzkzn                2/2     Running   0 (21h ago)   26h
ama-metrics-win-node-gqnkw            2/2     Running   0 (26h ago)   26h
ama-metrics-win-node-tkrm8            2/2     Running   0 (26h ago)   26h
```

8) Verify that the Kappie pods are discovered by port forwarding to a node pod with
```azurecli
k port-forward $(k get po -l dsName=ama-metrics-node -oname | head -n 1) 9090:9090
```

9) Then go to http://localhost:9090/targets to see the Kappie pods being discovered and scraped

10) Now go to the Grafana resource located in portal, and find the endpoint URL, and click on it

11) Then, you can use the ID [18814](https://grafana.com/grafana/dashboards/18814/edit) to import the dashboard from Grafana's public dashboard repo.

12) The Grafana dashboard should now be visible


### Setup instructions for Network Observability addon with Managed Prometheus and Managed Grafana (Cilium)    
1) 	Create a resource group.
```azurecli
az group create --name $RESOURCE_GROUP --location $REGION
```

2)	Create Vnet 
```azurecli 
az network vnet create -g $RESOURCE_GROUP --location $LOCATION --name $NAME-vnet --address-prefixes 10.0.0.0/8 -o none
az network vnet subnet create -g $RESOURCE_GROUP --vnet-name $NAME-vnet --name nodesubnet --address-prefixes 10.240.0.0/16 -o none
```         

3)	Create AKS cluster with Cilium dataplane setup .
```azurecli
az aks create -n $NAME -g $RESOURCE_GROUP -l $LOCATION \
--network-plugin azure \
--network-plugin-mode overlay \
--pod-cidr 192.168.0.0/16 \
--vnet-subnet-id /subscriptions/$SUBSCRIPTION/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Network/virtualNetworks/$NAME-vnet/subnets/nodesubnet \
--enable-cilium-dataplane \
--enable-network-observability
```  

4) Create Azure Monitor resource
```azurecli
az resource create \
--resource-group $RESOURCE_GROUP \
--namespace microsoft.monitor \
--resource-type accounts \
--name $AZMON_NAME \
--location $REGION \
--properties '{}'
```

5) Create Grafana instance
```azurecli
az grafana create \
--name $GRAFANA_NAME \
--resource-group $RESOURCE_GROUP
```

6) Get the Azure Monitor and Grafana resource IDs
```azurecli
export AZMON_RESOURCE_ID=$(az resource show --resource-group $RESOURCE_GROUP --name $AZMON_NAME --resource-type "Microsoft.Monitor/accounts" --query id -o tsv)
export GRAFANA_RESOURCE_ID=$(az resource show --resource-group $RESOURCE_GROUP --name $GRAFANA_NAME --resource-type "microsoft.dashboard/grafana" --query id -o tsv)
```

7) Link Azure Monitor Workspace to cluster, as well as grafana instance
```azurecli
az aks update --enable-azuremonitormetrics \
-n $NAME \
-g $RESOURCE_GROUP \
--azure-monitor-workspace-resource-id $AZMON_RESOURCE_ID \
--grafana-resource-id  $GRAFANA_RESOURCE_ID
```

8) Save the below to ama-cilium-configmap.yaml
```yml
scrape_configs:
- job_name: "cilium-pods"
    kubernetes_sd_configs:
    - role: pod
    relabel_configs:
    - source_labels: [__meta_kubernetes_pod_container_name]
        action: keep
        regex: cilium(.*)
    - source_labels:
        [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        separator: ":"
        regex: ([^:]+)(?::\d+)?
        target_label: __address__
        replacement: ${1}:${2}
        action: replace
    - source_labels: [__meta_kubernetes_pod_node_name]
        action: replace
        target_label: instance
    - source_labels: [__meta_kubernetes_pod_label_k8s_app]
        action: keep
        regex: cilium
    - source_labels: [__meta_kubernetes_pod_name]
        action: replace
        regex: (.*)
        target_label: pod
    metric_relabel_configs:
    - source_labels: [__name__]
        action: keep
        regex: (.*)
```

9) Create the configmap using the following command 
```azurecli
kubectl create configmap ama-metrics-prometheus-config-node --from-file=./ama-cilium-configmap.yaml -n kube-system
```

10) Once the Azure Monitor pods have been deployed on the cluster, port forward to the ama pod to verify the pods are being scraped
```azurecli
k port-forward $(k get po -l dsName=ama-metrics-node -oname | head -n 1) 9090:9090
```

11) Under Targets, the cilium pods should be present


## Next steps

<!-- LINKS - internal -->
[az-provider-registe
r]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-install-cli]: /cli/azure/install-azure-cli
[aks-egress]: limit-egress-traffic.md
[aks-network-policies]: use-network-policies.md
[nsg]: ../virtual-network/network-security-groups-overview.md
