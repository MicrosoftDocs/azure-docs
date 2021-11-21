---
title: Cleanup from partial deployment
description: Cleanup from partial deployment
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dinethi
ms.author: dnethi
ms.reviewer: mikeray
ms.date: 11/16/2021
ms.topic: how-to
---

# Uninstall Azure Arc-enabled data services

This article describes how to delete Azure Arc-enabled data service resources from Azure.

> [!WARNING]
> When you delete resources as described in this article, these actions are irreversible.


Deploying Azure Arc-enabled data services involves deploying an Azure Arc data controller and instances of data services Azure Arc-enabled SQL managed instance or Azure Arc-enabled Postgres Hyperscale server groups. As part of deployment, several artifacts get created such as:
- Custom Resource Definitions (CRDs)
- Cluster roles
- Cluster role bindings
- API services 
- namespace, if it didn't exist before 

When deployed in **direct** connected mode, there are additional artifacts such as 
- Cluster Extensions and 
- Custom Locations


## Before

Before you delete a resource such as Azure Arc-enabled SQL managed instance or Azure Arc data controller, ensure you complete the following actions first:

(1) For indirectly conneted data controller, export and upload the usage information to Azure for accurate billing calculation by following the instructions described in [Upload billing data to Azure - Indirectly connected mode](view-billing-data-in-azure.md#upload-billing-data-to-azure---indirectly-connected-mode).

(2) Ensure all the data services that have been create on the data controller are uninstalled as described in [Delete Azure Arc-enabled SQL Managed Instance](delete-managed-instance.md) and [Delete an Azure Arc-enabled PostgreSQL Hyperscale server group](delete-postgresql-hyperscale-server-group.md).


After deleting any existing instances of Azure Arc-enabled SQL managed instances and/or Azure Arc-enabled Postgres Hyperscale Server groups, proceed to delete the Azure Arc data controller using one of the following methods depending on whether the Azure Arc data controller was deployed in **direct** connected mode or **indirect** connected mode.

> [!Note]
> If you deployed the Azure Arc data controller in directly connected mode then follow the steps to (1) Delete the Azure Arc data controller either from Azure portal or CLI and then (2) Delete kubernetes cluster artifacts.
>
> If you deployed the Azure Arc data controller in indirectly connected mode then follow the steps to (1) Delete Azure Arc data controller in **direct** connected mode using Azure CLI and then (2) Delete kubernetes cluster artifacts.


## Delete Azure Arc data controller in **direct** connected mode using Azure portal

From Azure portal:
1. Browse to the resource group and delete the Azure Arc data controller
2. Select the Azure Arc-enabled Kubernetes cluster, go to the Overview page
    - Select **Extensions** under Settings
    - In the Extensions page, select the Azure Arc data services extension (of type microsoft.arcdataservices) and click on **Uninstall**
3. Optionally delete the Custom Location that the Azure Arc data controller is deployed to.
4. Optionally, you can also delete the namespace on your Kubernetes cluster if there are no other resources created in the namespace.

See [Manage Azure resources by using the Azure portal](../../azure-resource-manager/management/manage-resources-portal.md).


## Delete Azure Arc data controller in **direct** connected mode using Azure CLI

### Step 1: Delete the Azure Arc data controller
After connecting to your kubernetes cluster, run the following command to delete the Azure Arc data controller:

```
az arcdata dc delete --name <name of datacontroller> --resource-group <name of resource-group>

## Example
az arcdata dc delete --name arcdc --resource-group myrg
```

### Step 2: Delete the Azure Arc data controller extension
Then, delete the Azure Arc data controller extension as described below. To get the name of the Arc data controller extension, you can either browse to the Overview page of your connected cluster in Azure portal and look under the Extensions tab or use the below command to get a list of all extensions on the cluster:

```
az k8s-extension list --resource-group <name of resource-group> --cluster-name <name of connected cluster> --cluster-type connectedClusters

## Example
az k8s-extension list --resource-group myrg --cluster-name mycluster --cluster-type  connectedClusters
```
Once you have the name of the Arc data controller extension, delete it by running:

```
az k8s-extension delete --resource-group <name of resource-group> --cluster-name <name of connected cluster> --cluster-type connectedClusters --name <name of your Arc data controller extension> 

## Example
az k8s-extension delete --resource-group myrg --cluster-name mycluster --cluster-type connectedClusters --name myadsextension 
```

Wait for a few minutes for above actions to complete. Ensure the Azure Arc data controller is deleted by running the below command to verify the status :

```
kubectl get datacontrollers -A
```

### Step 3: Delete the Custom Location

If there are no other extensions associated with this custom location, proceed to delete the custom location as follows:

```
az customlocation delete --name <Name of customlocation> --resource-group <Name of resource group>

## Example
az customlocation delete --name myCL --resource-group myrg
```

## Delete Azure Arc data controller in **indirect** connected mode 

By definition of **indirect** mode of deployment, Azure portal is unaware of your kubernetes cluster. Hence, deleting Azure Arc data controller requires deleting it on the kubernetes cluster as well as Azure portal in two steps.

### Step 1: Delete Azure Arc data controller in **indirect** connected mode from cluster

Delete the Azure Arc data controller form  the kubernees cluster by running the following command:

```
az arcdata dc delete --name <name of datacontroller> --k8s-namespace <namespace of data controller> --use-k8s

## Example
az arcdata dc delete --name arcdc --k8s-namespace arc --use-k8s
```

### Step 2: Delete Azure Arc data controller in **indirect** connected mode from Azure portal

From Azure portal, browse to the resource group containing the Azure Arc data controller, and delete. 


## Delete kubernetes cluster artifacts

After deleting the Azure Arc data controller as described above, follow the below steps to completely remove all artifacts related to Azure Arc-enabled data services. Removing all artifacts could be needed in situations wher eyou have a partial or failed deployment, or simply want to reinstall the Azure Arc-enabled data services.

```
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
kubectl delete --namespace <name of namespace>

## Example:
kubectl delete --namespace arc
```

## Verify all objects are deleted

1. Run ```kubectl get crd``` and ensure there are no results containing ```*.arcdata.microsoft.com```
2. Run ```kubectl get clusterrole``` and ensure there are no cluster roles in the format ```<namespace>:cr-*```
3. Run ```kubectl get clusterrolebindings``` and ensure there are no cluster role bindings in the format ```<namespace>:crb-*```
