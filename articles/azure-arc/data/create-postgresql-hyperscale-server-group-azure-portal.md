---
title: Create an Azure Arc enabled PostgreSQL Hyperscale server group from the Azure portal
description: Create an Azure Arc enabled PostgreSQL Hyperscale server group from the Azure portal
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 04/28/2021
ms.topic: how-to
---

# Create an Azure Arc enabled PostgreSQL Hyperscale server group from the Azure portal

This document describes the steps to create a PostgreSQL Hyperscale server group on Azure Arc from the Azure portal.

[!INCLUDE [azure-arc-common-prerequisites](../../../includes/azure-arc-common-prerequisites.md)]

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Getting started
If you are already familiar with the topics below, you may skip this paragraph.
There are important topics you may want read before you proceed with creation:
- [Overview of Azure Arc enabled data services](overview.md)
- [Connectivity modes and requirements](connectivity.md)
- [Storage configuration and Kubernetes storage concepts](storage-configuration.md)
- [Kubernetes resource model](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/resources.md#resource-quantities)

If you prefer to try out things without provisioning a full environment yourself, get started quickly with [Azure Arc Jumpstart](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_data/) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM.


## Deploy an Arc data controller configured to use the Direct connectivity mode

Requirement: before you deploy an Azure Arc enabled PostgreSQL Hyperscale server group that you operate from the Azure portal you must first deploy an Azure Arc data controller configured to use the *Direct* connectivity mode.
To deploy an Arc data controller, complete the instructions in these articles:
1. [Deploy data controller - direct connect mode (prerequisites)](deploy-data-controller-direct-mode-prerequisites.md)
1. [Deploy Azure Arc data controller | Direct connect mode](deploy-data-controller-direct-mode.md)


## Preliminary and temporary step for OpenShift users only
Implement this step before moving to the next step. To deploy PostgreSQL Hyperscale server group onto Red Hat OpenShift in a project other than the default, you need to execute the following commands against your cluster to update the security constraints. This command grants the necessary privileges to the service accounts that will run your PostgreSQL Hyperscale server group. The security context constraint (SCC) arc-data-scc is the one you added when you deployed the Azure Arc data controller.

```Console
oc adm policy add-scc-to-user arc-data-scc -z <server-group-name> -n <namespace name>
```

**Server-group-name is the name of the server group you will create during the next step.**

For more details on SCCs in OpenShift, refer to the [OpenShift documentation](https://docs.openshift.com/container-platform/4.2/authentication/managing-security-context-constraints.html). 

Proceed to the next step.

## Deploy an Azure Arc enabled PostgreSQL Hyperscale server group from the Azure portal

To deploy and operate an Azure Arc enabled Postgres Hyperscale server group from the Azure portal you must deploy it to an Arc data controller configured to use the *Direct* connectivity mode. 

> [!IMPORTANT]
> You can not operate an Azure Arc enabled PostgreSQL Hyperscale server group from the Azure portal if you deployed it to an Azure Arc data controller configured to use the *Indirect* connectivity mode. 

After you deployed an Arc data controller enabled for Direct connectivity mode:
1. Open a browser to following URL [https://portal.azure.com](https://portal.azure.com)
2. In the search window at the top of the page search for "*azure arc postgres*" in the Azure Market Place and select **Azure Database for PostgreSQL server groups - Azure Arc**.
3. In the page that opens, click **+ Create** at the top left corner. 
4. Fill in the form like you deploy an other Azure resource.


### Important parameters you should consider are:

- **The number of worker nodes** you want to deploy to scale out and potentially reach better performance. Before proceeding, read the [concepts about Postgres Hyperscale](concepts-distributed-postgres-hyperscale.md). For example, if you deploy a server group with two worker nodes, the deployment creates three pods, one for the coordinator node/instance and two for the worker nodes/instances (one for each of the workers).

## Next steps

- Connect to your Azure Arc enabled PostgreSQL Hyperscale: read [Get Connection Endpoints And Connection Strings](get-connection-endpoints-and-connection-strings-postgres-hyperscale.md)
- Read the concepts and How-to guides of Azure Database for PostgreSQL Hyperscale to distribute your data across multiple PostgreSQL Hyperscale nodes and to benefit from better performances potentially:
    * [Nodes and tables](../../postgresql/concepts-hyperscale-nodes.md)
    * [Determine application type](../../postgresql/concepts-hyperscale-app-type.md)
    * [Choose a distribution column](../../postgresql/concepts-hyperscale-choose-distribution-column.md)
    * [Table colocation](../../postgresql/concepts-hyperscale-colocation.md)
    * [Distribute and modify tables](../../postgresql/howto-hyperscale-modify-distributed-tables.md)
    * [Design a multi-tenant database](../../postgresql/tutorial-design-database-hyperscale-multi-tenant.md)*
    * [Design a real-time analytics dashboard](../../postgresql/tutorial-design-database-hyperscale-realtime.md)*

    > \* In the documents above, skip the sections **Sign in to the Azure portal**, & **Create an Azure Database for PostgreSQL - Hyperscale (Citus)**. Implement the remaining steps in your Azure Arc deployment. Those sections are specific to the Azure Database for PostgreSQL Hyperscale (Citus) offered as a PaaS service in the Azure cloud but the other parts of the documents are directly applicable to your Azure Arc enabled PostgreSQL Hyperscale.

- [Scale out your Azure Arc enabled for PostgreSQL Hyperscale server group](scale-out-postgresql-hyperscale-server-group.md)
- [Storage configuration and Kubernetes storage concepts](storage-configuration.md)
- [Expanding Persistent volume claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)
- [Kubernetes resource model](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/resources.md#resource-quantities)


