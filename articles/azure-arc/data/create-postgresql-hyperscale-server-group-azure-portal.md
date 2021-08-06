---
title: Create an Azure Arc—enabled PostgreSQL Hyperscale server group from the Azure portal
description: Create an Azure Arc—enabled PostgreSQL Hyperscale server group from the Azure portal
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Create an Azure Arc—enabled PostgreSQL Hyperscale server group from the Azure portal

This document describes the steps to create a PostgreSQL Hyperscale server group on Azure Arc from the Azure portal.

[!INCLUDE [azure-arc-common-prerequisites](../../../includes/azure-arc-common-prerequisites.md)]

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Getting started
If you are already familiar with the topics below, you may skip this paragraph.
There are important topics you may want read before you proceed with creation:
- [Overview of Azure Arc—enabled data services](overview.md)
- [Connectivity modes and requirements](connectivity.md)
- [Storage configuration and Kubernetes storage concepts](storage-configuration.md)
- [Kubernetes resource model](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/resources.md#resource-quantities)

If you prefer to try out things without provisioning a full environment yourself, get started quickly with [Azure Arc Jumpstart](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_data/) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM.


## Deploy an Arc data controller configured to use the Direct connectivity mode

Requirement: before you deploy an Azure Arc—enabled PostgreSQL Hyperscale server group that you operate from the Azure portal you must first deploy an Azure Arc data controller configured to use the *Direct* connectivity mode.
To deploy an Arc data controller, complete the instructions in these articles:
1. [Deploy data controller - direct connect mode (prerequisites)](create-data-controller-direct-prerequisites.md)
1. [Deploy Azure Arc data controller in Direct connect mode from Azure portal](create-data-controller-direct-azure-portal.md)


## Preliminary and temporary step for OpenShift users only
Implement this step before moving to the next step. To deploy PostgreSQL Hyperscale server group onto Red Hat OpenShift in a project other than the default, you need to execute the following commands against your cluster to update the security constraints. This command grants the necessary privileges to the service accounts that will run your PostgreSQL Hyperscale server group. The security context constraint (SCC) arc-data-scc is the one you added when you deployed the Azure Arc data controller.

```Console
oc adm policy add-scc-to-user arc-data-scc -z <server-group-name> -n <namespace name>
```

**Server-group-name is the name of the server group you will create during the next step.**

For more details on SCCs in OpenShift, refer to the [OpenShift documentation](https://docs.openshift.com/container-platform/4.2/authentication/managing-security-context-constraints.html). 

Proceed to the next step.

## Deploy an Azure Arc—enabled PostgreSQL Hyperscale server group from the Azure portal

To deploy and operate an Azure Arc—enabled Postgres Hyperscale server group from the Azure portal you must deploy it to an Arc data controller configured to use the *Direct* connectivity mode. 

> [!IMPORTANT]
> You can not operate an Azure Arc—enabled PostgreSQL Hyperscale server group from the Azure portal if you deployed it to an Azure Arc data controller configured to use the *Indirect* connectivity mode. 

After you deployed an Arc data controller enabled for Direct connectivity mode, you may chose one the following 3 options to deploy a Azure Arc—enabled Postgres Hyperscale server group:

### Option 1: Deploy from the Azure Marketplace
1. Open a browser to the following URL [https://portal.azure.com](https://portal.azure.com)
2. In the search window at the top of the page search for "*azure arc postgres*" in the Azure Market Place and select **Azure Database for PostgreSQL server groups - Azure Arc**.
3. In the page that opens, click **+ Create** at the top left corner. 
4. Fill in the form like you deploy an other Azure resource.

### Option 2: Deploy from the Azure Database for PostgreSQL deployment option page
1. Open a browser to the following URL https://ms.portal.azure.com/#create/Microsoft.PostgreSQLServer.
2. Click the tile at the bottom right. It is titled: Azure Arc—enabled PostgreSQL Hyperscale (Preview).
3. Fill in the form like you deploy an other Azure resources.

### Option 3: Deploy from the Azure Arc center
1. Open a browser to the following URL https://ms.portal.azure.com/#blade/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/overview
1. From the center of the page, click [Deploy] under the tile titled *Deploy Azure services* and then click [Deploy] in tile titled PostgreSQL Hyperscale (Preview).
2. or, from the navigation pane on the left of the page, in the Services section, click [PostgreSQL Hyperscale (Preview)] and then click [+ Create] at the top left of the pane.


#### Important parameters you should consider:

- **the number of worker nodes** you want to deploy to scale out and potentially reach better performances. Before proceeding here, read the [concepts about Postgres Hyperscale](concepts-distributed-postgres-hyperscale.md). The table below indicates the range of supported values and what form of Postgres deployment you get with them. For example, if you want to deploy a server group with 2 worker nodes, indicate 2. This will create three pods, one for the coordinator node/instance and two for the worker nodes/instances (one for each of the workers).



|You need   |Shape of the server group you will deploy   |Number of worker nodes to indicate   |Note   |
|---|---|---|---|
|A scaled out form of Postgres to satisfy the scalability needs of your applications.   |3 or more Postgres instances, 1 is coordinator, n  are workers with n >=2.   |n, with n>=2.   |The Citus extension that provides the Hyperscale capability is loaded.   |
|A basic form of Postgres Hyperscale for you to do functional validation of your application at minimum cost. Not valid for performance and scalability validation. For that you need to use the type of deployments described above.   |1 Postgres instance that is both coordinator and worker.   |0 and add Citus to the list of extensions to load.   |The Citus extension that provides the Hyperscale capability is loaded.   |
|A simple instance of Postgres that is ready to scale out when you need it.   |1 Postgres instance. It is not yet aware of the semantic for coordinator and worker. To scale it out after deployment, edit the configuration, increase the number of worker nodes and distribute the data.   |0   |The Citus extension that provides the Hyperscale capability is present on your deployment but is not yet loaded.   |
|   |   |   |   |

While indicating 1 worker works, we do not recommend you use it. This deployment will not provide you much value. With it, you will get 2 instances of Postgres: 1 coordinator and 1 worker. With this setup you actually do not scale out the data since you deploy a single worker. As such you will not see an increased level of performance and scalability. We will remove the support of this deployment in a future release.

- **the storage classes** you want your server group to use. It is important you set the storage class right at the time you deploy a server group as this cannot be changed after you deploy. If you were to change the storage class after deployment, you would need to extract the data, delete your server group, create a new server group, and import the data. You may specify the storage classes to use for the data, logs and the backups. By default, if you do not indicate storage classes, the storage classes of the data controller will be used.
    - to set the storage class for the data, indicate the parameter `--storage-class-data` or `-scd` followed by the name of the storage class.
    - to set the storage class for the logs, indicate the parameter `--storage-class-logs` or `-scl` followed by the name of the storage class.
    - to set the storage class for the backups: in this Preview of the Azure Arc—enabled PostgreSQL Hyperscale there are two ways to set storage classes depending on what types of backup/restore operations you want to do. We are working on simplifying this experience. You will either indicate a storage class or a volume claim mount. A volume claim mount is a pair of an existing persistent volume claim (in the same namespace) and volume type (and optional metadata depending on the volume type) separated by colon. The persistent volume will be mounted in each pod for the PostgreSQL server group.
        - if you want plan to do only full database restores, set the parameter `--storage-class-backups` or `-scb` followed by the name of the storage class.
        - if you plan to do both full database restores and point in time restores, set the parameter `--volume-claim-mounts` or `--volume-claim-mounts` followed by the name of a volume claim and a volume type.


## Next steps

- Connect to your Azure Arc—enabled PostgreSQL Hyperscale: read [Get Connection Endpoints And Connection Strings](get-connection-endpoints-and-connection-strings-postgres-hyperscale.md)
- Read the concepts and How-to guides of Azure Database for PostgreSQL Hyperscale to distribute your data across multiple PostgreSQL Hyperscale nodes and to benefit from better performances potentially:
    * [Nodes and tables](../../postgresql/concepts-hyperscale-nodes.md)
    * [Determine application type](../../postgresql/concepts-hyperscale-app-type.md)
    * [Choose a distribution column](../../postgresql/concepts-hyperscale-choose-distribution-column.md)
    * [Table colocation](../../postgresql/concepts-hyperscale-colocation.md)
    * [Distribute and modify tables](../../postgresql/howto-hyperscale-modify-distributed-tables.md)
    * [Design a multi-tenant database](../../postgresql/tutorial-design-database-hyperscale-multi-tenant.md)*
    * [Design a real-time analytics dashboard](../../postgresql/tutorial-design-database-hyperscale-realtime.md)*

    > \* In the documents above, skip the sections **Sign in to the Azure portal**, & **Create an Azure Database for PostgreSQL - Hyperscale (Citus)**. Implement the remaining steps in your Azure Arc deployment. Those sections are specific to the Azure Database for PostgreSQL Hyperscale (Citus) offered as a PaaS service in the Azure cloud but the other parts of the documents are directly applicable to your Azure Arc—enabled PostgreSQL Hyperscale.

- [Scale out your Azure Arc—enabled for PostgreSQL Hyperscale server group](scale-out-in-postgresql-hyperscale-server-group.md)
- [Storage configuration and Kubernetes storage concepts](storage-configuration.md)
- [Expanding Persistent volume claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)
- [Kubernetes resource model](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/resources.md#resource-quantities)
