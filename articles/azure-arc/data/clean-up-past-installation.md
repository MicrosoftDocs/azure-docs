---
title: Clean up past installations
description: Describes how to remove Azure Arc-enabled data controller and associated resources from past installations.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 07/11/2022
ms.topic: how-to
---

# Clean up from past installations

If you installed the data controller in the past and later deleted the data controller, there may be some cluster level objects that would still need to be deleted. 

This article describes how to delete these cluster level objects.

## Replace values in sample script

For some of the tasks, you'll need to replace `{namespace}` with the value for your namespace. Substitute the name of the namespace the data controller was deployed in into `{namespace}`. If unsure, get the name of the `mutatingwebhookconfiguration` using `kubectl get clusterrolebinding`.

## Run script to remove artifacts

Run the following commands to delete the data controller cluster level objects:

> [!NOTE]
> Not all of these objects will exist in your environment. The objects in your environment depend on which version of the Arc data controller was installed

```console
# Clean up azure arc data service artifacts

# Custom resource definitions (CRD)
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
kubectl delete crd postgresqlrestoretasks.tasks.postgresql.arcdata.microsoft.com               
kubectl delete crd sqlmanagedinstancemonitoringprofiles.arcdata.microsoft.com                  
kubectl delete crd sqlmanagedinstancereprovisionreplicatasks.tasks.sql.arcdata.microsoft.com   
kubectl delete crd telemetrycollectors.arcdata.microsoft.com                                   
kubectl delete crd telemetryrouters.arcdata.microsoft.com

# Substitute the name of the namespace the data controller was deployed in into {namespace}.

# Cluster roles and role bindings
kubectl delete clusterrole arcdataservices-extension
kubectl delete clusterrole arc:cr-arc-metricsdc-reader
kubectl delete clusterrole arc:cr-arc-dc-watch
kubectl delete clusterrole cr-arc-webhook-job
kubectl delete clusterrole {namespace}:cr-upgrade-worker
kubectl delete clusterrole {namespace}:cr-deployer
kubectl delete clusterrolebinding {namespace}:crb-arc-metricsdc-reader
kubectl delete clusterrolebinding {namespace}:crb-arc-dc-watch
kubectl delete clusterrolebinding crb-arc-webhook-job
kubectl delete clusterrolebinding {namespace}:crb-upgrade-worker
kubectl delete clusterrolebinding {namespace}:crb-deployer 

# Substitute the name of the namespace the data controller was deployed in into {namespace}.  If unsure, get the name of the mutatingwebhookconfiguration using 'kubectl get clusterrolebinding'

# API services
# Up to May 2021 release
kubectl delete apiservice v1alpha1.arcdata.microsoft.com
kubectl delete apiservice v1alpha1.sql.arcdata.microsoft.com

# June 2021 release
kubectl delete apiservice v1beta1.arcdata.microsoft.com
kubectl delete apiservice v1beta1.sql.arcdata.microsoft.com

# GA/July 2021 release
kubectl delete apiservice v1.arcdata.microsoft.com
kubectl delete apiservice v1.sql.arcdata.microsoft.com

# Substitute the name of the namespace the data controller was deployed in into {namespace}.  If unsure, get the name of the mutatingwebhookconfiguration using 'kubectl get mutatingwebhookconfiguration'
kubectl delete mutatingwebhookconfiguration arcdata.microsoft.com-webhook-{namespace}
```

## Next steps

[Start by creating a Data Controller](create-data-controller-indirect-cli.md)

Already created a Data Controller? [Create an Azure Arc-enabled SQL Managed Instance](create-sql-managed-instance.md)
