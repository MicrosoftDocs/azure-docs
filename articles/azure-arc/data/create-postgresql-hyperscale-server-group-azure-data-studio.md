---
title: Create Azure Arc–enabled PostgreSQL Hyperscale using Azure Data Studio
description: Create Azure Arc–enabled PostgreSQL Hyperscale using Azure Data Studio
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Create Azure Arc–enabled PostgreSQL Hyperscale using Azure Data Studio

This document walks you through the steps for using Azure Data Studio to provision Azure Arc–enabled PostgreSQL Hyperscale server groups.

[!INCLUDE [azure-arc-common-prerequisites](../../../includes/azure-arc-common-prerequisites.md)]

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Preliminary and temporary step for OpenShift users only

Implement this step before moving to the next step. To deploy PostgreSQL Hyperscale server group onto Red Hat OpenShift in a project other than the default, you need to execute the following commands against your cluster to update the security constraints. This command grants the necessary privileges to the service accounts that will run your PostgreSQL Hyperscale server group. The security context constraint (SCC) **_arc-data-scc_** is the one you added when you deployed the Azure Arc data controller.

```console
oc adm policy add-scc-to-user arc-data-scc -z <server-group-name> -n <namespace name>
```

_**Server-group-name** is the name of the server group you will deploy during the next step._
   
For more details on SCCs in OpenShift, please refer to the [OpenShift documentation](https://docs.openshift.com/container-platform/4.2/authentication/managing-security-context-constraints.html).
You may now implement the next step.

## Create an Azure Arc–enabled PostgreSQL Hyperscale server group

1. Launch Azure Data Studio
1. On the Connections tab, Click on the three dots on the top left and choose "New Deployment"
1. From the deployment options, select **PostgreSQL Hyperscale server group - Azure Arc**
    >[!NOTE]
    > You may be prompted to install the [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)] here if it is not currently installed.
1. Accept the Privacy and license terms and click **Select** at the bottom
1. In the Deploy PostgreSQL Hyperscale server group - Azure Arc blade, enter the following information:
   - Enter a name for the server group
   - The number of worker nodes
   - Enter and confirm a password for the _postgres_ administrator user of the server group
   - Select the storage class as appropriate for data
   - Select the storage class as appropriate for logs
   - Select the storage class as appropriate for backups
   - Select the number of worker nodes to provision
1. Click the **Deploy** button

This starts the creation of the Azure Arc–enabled PostgreSQL Hyperscale server group on the data controller.

In a few minutes, your creation should successfully complete.

### Important parameters you should consider:

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
    - to set the storage class for the backups: in this Preview of the Azure Arc–enabled PostgreSQL Hyperscale there are two ways to set storage classes depending on what types of backup/restore operations you want to do. We are working on simplifying this experience. You will either indicate a storage class or a volume claim mount. A volume claim mount is a pair of an existing persistent volume claim (in the same namespace) and volume type (and optional metadata depending on the volume type) separated by colon. The persistent volume will be mounted in each pod for the PostgreSQL server group.
        - if you want plan to do only full database restores, set the parameter `--storage-class-backups` or `-scb` followed by the name of the storage class.
        - if you plan to do both full database restores and point in time restores, set the parameter `--volume-claim-mounts` or `--volume-claim-mounts` followed by the name of a volume claim and a volume type.


## Next steps
- [Manage your server group using Azure Data Studio](manage-postgresql-hyperscale-server-group-with-azure-data-studio.md)
- [Monitor your server group](monitor-grafana-kibana.md)
- Read the concepts and How-to guides of Azure Database for PostgreSQL Hyperscale to distribute your data across multiple PostgreSQL Hyperscale nodes and to benefit from all the power of Azure Database for Postgres Hyperscale. :
    * [Nodes and tables](../../postgresql/concepts-hyperscale-nodes.md)
    * [Determine application type](../../postgresql/concepts-hyperscale-app-type.md)
    * [Choose a distribution column](../../postgresql/concepts-hyperscale-choose-distribution-column.md)
    * [Table colocation](../../postgresql/concepts-hyperscale-colocation.md)
    * [Distribute and modify tables](../../postgresql/howto-hyperscale-modify-distributed-tables.md)
    * [Design a multi-tenant database](../../postgresql/tutorial-design-database-hyperscale-multi-tenant.md)*
    * [Design a real-time analytics dashboard](../../postgresql/tutorial-design-database-hyperscale-realtime.md)*

    > \* In the documents above, skip the sections **Sign in to the Azure portal**, & **Create an Azure Database for PostgreSQL - Hyperscale (Citus)**. Implement the remaining steps in your Azure Arc deployment. Those sections are specific to the Azure Database for PostgreSQL Hyperscale (Citus) offered as a PaaS service in the Azure cloud but the other parts of the documents are directly applicable to your Azure Arc–enabled PostgreSQL Hyperscale.

- [Scale out your Azure Database for PostgreSQL Hyperscale server group](scale-out-in-postgresql-hyperscale-server-group.md)
- [Storage configuration and Kubernetes storage concepts](storage-configuration.md)
- [Kubernetes resource model](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/resources.md#resource-quantities)
