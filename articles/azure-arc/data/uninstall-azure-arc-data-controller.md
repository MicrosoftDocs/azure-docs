---
title: Uninstall Azure Arc-enabled data services
description: Uninstall Azure Arc-enabled data services
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.custom: devx-track-azurecli
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 07/28/2022
ms.topic: how-to
---

# Uninstall Azure Arc-enabled data services

This article describes how to delete Azure Arc-enabled data service resources from Azure.

> [!WARNING]
> When you delete resources as described in this article, these actions are irreversible.

Deploying Azure Arc-enabled data services involves deploying an Azure Arc data controller and instances of data services SQL Managed Instance enabled by Azure Arc or Azure Arc-enabled PostgresQL server. Deployment creates several artifacts, such as: 
- Custom Resource Definitions (CRDs)
- Cluster roles
- Cluster role bindings
- API services 
- Namespace, if it didn't exist before 

In directly connected mode, there are additional artifacts such as: 
- Cluster extensions
- Custom locations

## Before

Before you delete a resource such as SQL Managed Instance enabled by Azure Arc or data controller, ensure you complete the following actions first:

1. For an indirectly connected data controller, export and upload the usage information to Azure for accurate billing calculation by following the instructions described in [Upload billing data to Azure - Indirectly connected mode](view-billing-data-in-azure.md#upload-billing-data-to-azure---indirectly-connected-mode).

2. Ensure all the data services that have been create on the data controller are uninstalled as described in:

   - [Delete SQL Managed Instance enabled by Azure Arc](delete-managed-instance.md)
   - [Delete an Azure Arc-enabled PostgreSQL server](delete-postgresql-hyperscale-server-group.md).


After deleting any existing instances of SQL Managed Instance enabled by Azure Arc and/or Azure Arc-enabled PostgreSQL server, delete the data controller using one of the appropriate method for connectivity mode.

> [!Note]
> If you deployed the data controller in directly connected mode then follow the steps to:
> - [Delete data controller in directly connected mode using Azure portal](#delete-data-controller-in-directly-connected-mode-using-azure-portal)
> or
> - [Delete data controller in directly connected mode using Azure CLI](#delete-data-controller-in-directly-connected-mode-using-azure-cli) and then Delete the data controller either from Azure portal or CLI and then (2) Delete Kubernetes cluster artifacts.
>
>If you deployed the data controller in indirectly connected mode then follow the steps to [Delete data controller in indirectly connected mode](#delete-data-controller-in-indirectly-connected-mode). 

## Delete data controller in directly connected mode using Azure portal

From Azure portal:
1. Browse to the resource group and delete the data controller.
2. Select the Azure Arc-enabled Kubernetes cluster, go to the Overview page:
    - Select **Extensions** under Settings
    - In the Extensions page, select the Azure Arc data services extension (of type `microsoft.arcdataservices`) and select on **Uninstall**
3. Optionally, delete the custom location that the data controller is deployed to.
4. Optionally, you can also delete the namespace on your Kubernetes cluster if there are no other resources created in the namespace.

See [Manage Azure resources by using the Azure portal](../../azure-resource-manager/management/manage-resources-portal.md).


## Delete data controller in directly connected mode using Azure CLI

To delete the data controller in directly connected mode with the Azure CLI, there are three steps:

1. [Delete the data controller](#delete-the-data-controller)
1. [Delete the data controller extension](#delete-the-data-controller-extension)
1. [Delete the custom location](#delete-the-custom-location)

### Delete the data controller
After connecting to your Kubernetes cluster, run the following command to delete the data controller:

```azurecli
az arcdata dc delete --name <name of datacontroller> --resource-group <name of resource-group>

## Example
az arcdata dc delete --name arcdc --resource-group myrg
```

### Delete the data controller extension

After you have deleted the data controller, delete the data controller extension as described below. To get the name of the Arc data controller extension, you can either browse to the Overview page of your connected cluster in Azure portal and look under the Extensions tab or use the below command to get a list of all extensions on the cluster:

```azurecli
az k8s-extension list --resource-group <name of resource-group> --cluster-name <name of connected cluster> --cluster-type connectedClusters

## Example
az k8s-extension list --resource-group myrg --cluster-name mycluster --cluster-type  connectedClusters
```
Once you have the name of the Arc data controller extension, delete it by running:

```azurecli
az k8s-extension delete --resource-group <name of resource-group> --cluster-name <name of connected cluster> --cluster-type connectedClusters --name <name of your Arc data controller extension> 

## Example
az k8s-extension delete --resource-group myrg --cluster-name mycluster --cluster-type connectedClusters --name myadsextension 
```

Wait for a few minutes for above actions to complete. Ensure the data controller is deleted by running the below command to verify the status:

```console
kubectl get datacontrollers -A
```

### Delete the custom location

If there are no other extensions associated with this custom location, proceed to delete the custom location as follows:

```azurecli
az customlocation delete --name <Name of customlocation> --resource-group <Name of resource group>

## Example
az customlocation delete --name myCL --resource-group myrg
```

## Delete data controller in indirectly connected mode 

By definition, with an indirectly connected data controller deployment, Azure portal is unaware of your Kubernetes cluster. Hence, in order to delete the data controller, you need to delete it on the Kubernetes cluster as well as Azure portal in two steps.

1. [Delete data controller in indirectly connected mode from cluster](#delete-data-controller-in-indirectly-connected-mode-from-cluster) 
1. [Delete data controller in indirectly connected mode from Azure portal](#delete-data-controller-in-indirectly-connected-mode-from-azure-portal)

### Delete data controller in indirectly connected mode from cluster

Delete the data controller form  the Kubernetes cluster by running the following command:

```azurecli
az arcdata dc delete --name <name of datacontroller> --k8s-namespace <namespace of data controller> --use-k8s

## Example
az arcdata dc delete --name arcdc --k8s-namespace arc --use-k8s
```

### Delete data controller in indirectly connected mode from Azure portal

From the Azure portal, browse to the resource group containing the data controller, and delete. 

## Delete Kubernetes cluster artifacts

After deleting the data controller as described above, follow the below steps to completely remove all artifacts related to Azure Arc-enabled data services. Removing all artifacts could be needed in situations where you have a partial or failed deployment, or simply want to reinstall the Azure Arc-enabled data services.

```console
## Substitute your namespace into the variable
export mynamespace="arc"


## Delete Custom Resource Definitions
kubectl delete crd datacontrollers.arcdata.microsoft.com
kubectl delete crd postgresqls.arcdata.microsoft.com
kubectl delete crd sqlmanagedinstances.sql.arcdata.microsoft.com
kubectl delete crd sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com
kubectl delete crd dags.sql.arcdata.microsoft.com
kubectl delete crd exporttasks.tasks.arcdata.microsoft.com
kubectl delete crd monitors.arcdata.microsoft.com
kubectl delete crd activedirectoryconnectors.arcdata.microsoft.com
kubectl delete crd failovergroups.sql.arcdata.microsoft.com
kubectl delete crd kafkas.arcdata.microsoft.com
kubectl delete crd otelcollectors.arcdata.microsoft.com

## Delete Cluster roles and Cluster role bindings
kubectl delete clusterrole arcdataservices-extension
kubectl delete clusterrole $mynamespace:cr-arc-metricsdc-reader
kubectl delete clusterrole $mynamespace:cr-arc-dc-watch
kubectl delete clusterrole cr-arc-webhook-job
kubectl delete clusterrole $mynamespace:cr-upgrade-worker

kubectl delete clusterrolebinding $mynamespace:crb-arc-metricsdc-reader
kubectl delete clusterrolebinding $mynamespace:crb-arc-dc-watch
kubectl delete clusterrolebinding crb-arc-webhook-job
kubectl delete clusterrolebinding $mynamespace:crb-upgrade-worker

## API services Up to May 2021 release
kubectl delete apiservice v1alpha1.arcdata.microsoft.com
kubectl delete apiservice v1alpha1.sql.arcdata.microsoft.com

## June 2021 release
kubectl delete apiservice v1beta1.arcdata.microsoft.com
kubectl delete apiservice v1beta1.sql.arcdata.microsoft.com

## GA/July 2021 release
kubectl delete apiservice v1.arcdata.microsoft.com
kubectl delete apiservice v1.sql.arcdata.microsoft.com

## Delete mutatingwebhookconfiguration
kubectl delete mutatingwebhookconfiguration arcdata.microsoft.com-webhook-$mynamespace
```

Optionally, also delete the namespace as follows:
```
kubectl delete namespace <name of namespace>

## Example:
kubectl delete namespace arc
```

## Verify all objects are deleted

1. Run `kubectl get crd` and ensure there are no results containing `*.arcdata.microsoft.com`.
2. Run `kubectl get clusterrole` and ensure there are no cluster roles in the format `<namespace>:cr-*`.
3. Run `kubectl get clusterrolebindings` and ensure there are no cluster role bindings in the format `<namespace>:crb-*`.
