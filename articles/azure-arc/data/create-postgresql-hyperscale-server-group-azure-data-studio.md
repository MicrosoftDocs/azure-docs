---
title: Create Azure Arc enabled PostgreSQL Hyperscale using Azure Data Studio
description: Create Azure Arc enabled PostgreSQL Hyperscale using Azure Data Studio
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Create Azure Arc enabled PostgreSQL Hyperscale using Azure Data Studio

This document walks you through the steps for using Azure Data Studio to provision Azure Arc enabled PostgreSQL Hyperscale server groups.

[!INCLUDE [azure-arc-common-prerequisites](../../../includes/azure-arc-common-prerequisites.md)]

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Connect to the Azure Arc data controller

Before you can create an instance, log in to the Azure Arc data controller if you are not already logged in.

```console
azdata login
```

You will then be prompted for the namespace where the data controller is created, the username, and password to log in to the controller.

> If you need to validate the namespace, you can run ```kubectl get pods -A``` to get a list of all the namespaces on the cluster.

```console
Username: arcadmin
Password:
Namespace: arc
Logged in successfully to `https://10.0.0.4:30080` in namespace `arc`. Setting active context to `arc`
```

## Preliminary and temporary step for OpenShift users only

Implement this step before moving to the next step. To deploy PostgreSQL Hyperscale server group onto Red Hat OpenShift in a project other than the default, you need to execute the following commands against your cluster to update the security constraints. This command grants the necessary privileges to the service accounts that will run your PostgreSQL Hyperscale server group. The security context constraint (SCC) **_arc-data-scc_** is the one you added when you deployed the Azure Arc data controller.

```console
oc adm policy add-scc-to-user arc-data-scc -z <server-group-name> -n <namespace name>
```

_**Server-group-name** is the name of the server group you will deploy during the next step._
   
For more details on SCCs in OpenShift, please refer to the [OpenShift documentation](https://docs.openshift.com/container-platform/4.2/authentication/managing-security-context-constraints.html).
You may now implement the next step.

## Create an Azure Arc enabled PostgreSQL Hyperscale server group

1. Launch Azure Data Studio
1. On the Connections tab, Click on the three dots on the top left and choose "New Deployment"
1. From the deployment options, select **PostgreSQL Hyperscale server group - Azure Arc**
    >[!NOTE]
    > You may be prompted to install the [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)] here if it is not currently installed.
1. Accept the Privacy and license terms and click **Select** at the bottom
1. In the Deploy PostgreSQL Hyperscale server group - Azure Arc blade, enter the following information:
   - Enter a name for the server group
   - Enter and confirm a password for the _postgres_ administrator user of the server group
   - Select the storage class as appropriate for data
   - Select the storage class as appropriate for logs
   - Select the storage class as appropriate for backups
   - Select the number of worker nodes to provision
1. Click the **Deploy** button

This starts the creation of the Azure Arc enabled PostgreSQL Hyperscale server group on the data controller.

In a few minutes, your creation should successfully complete.

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

    > \* In the documents above, skip the sections **Sign in to the Azure portal**, & **Create an Azure Database for PostgreSQL - Hyperscale (Citus)**. Implement the remaining steps in your Azure Arc deployment. Those sections are specific to the Azure Database for PostgreSQL Hyperscale (Citus) offered as a PaaS service in the Azure cloud but the other parts of the documents are directly applicable to your Azure Arc enabled PostgreSQL Hyperscale.

- [Scale out your Azure Database for PostgreSQL Hyperscale server group](scale-out-postgresql-hyperscale-server-group.md)
- [Storage configuration and Kubernetes storage concepts](storage-configuration.md)
- [Kubernetes resource model](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/resources.md#resource-quantities)

