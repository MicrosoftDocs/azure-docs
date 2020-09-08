---
title: Deploy Azure Arc enabled PostgreSQL Hyperscale using Azure Data Studio
description: Deploy Azure Arc enabled PostgreSQL Hyperscale using Azure Data Studio
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Deploy Azure Arc enabled PostgreSQL Hyperscale using Azure Data Studio

This document walks you through the steps for using Azure Data Studio] to provision Azure Arc enabled PostgreSQL Hyperscale server groups.

## Prerequisites

- [Install `azdata`, Azure Data Studio, and Azure CLI](install-client-tools.md)
- Install Azure Data Studio extensions for **Azure Data CLI**, **Azure Arc**, and **PostgreSQL** 
- Install the [Azure Arc Data Controller](create-data-controller-using-azdata.md)

## Connect to the Azure Arc data controller

Before you can create an instance, log in to the Azure Arc data controller if you are not already logged in.

```console
azdata login
```

You will then be prompted for the namespace where the data controller is deployed, the username, and password to log in to the controller.

> If you need to validate the namespace, you can run ```kubectl get pods -A``` to get a list of all the namespaces on the cluster.

```console
Username: arcadmin
Password:
Namespace: arc
Logged in successfully to `https://10.0.0.4:30080` in namespace `arc`. Setting active context to `arc`
```

## Deploy an Azure Arc enabled PostgreSQL Hyperscale server group

- Launch Azure Data Studio
- On the Connections tab, Click on the three dots on the top left and choose "New Deployment"
- From the deployment options, select **PostgreSQL Hyperscale server group - Azure Arc** 
   >[!NOTE]
   > You may be prompted to install the `azdata` CLI here if it is not currently installed.
- Accept the Privacy and license terms and click **Select** at the bottom
- In the Deploy PostgreSQL Hyperscale server group - Azure Arc blade, enter the following information:
  - Enter a name for the server group
  - Enter and confirm a password for the _postgres_ administrator user of the server group
  - Select the storage class as appropriate for data
  - Select the storage class as appropriate for logs
  - Select the storage class as appropriate for backups
  - Select the number of worker nodes to provision

- Click the **Deploy** button

- This starts the deployment of the Azure Arc enabled PostgreSQL Hyperscale server group on the data controller.

- In a few minutes, your deployment should successfully complete

## Next steps
- [Manage your server group using Azure Data Studio](manage-postgresql-hyperscale-server-group-with-azure-data-studio.md)
- [Monitor your server group](monitor-grafana-kibana.md)
- Read the concepts and How-to guides of Azure Database for Postgres Hyperscale to distribute your data across multiple Postgres Hyperscale nodes and to benefit from all the power of Azure Database for Postgres Hyperscale. :
    * [Nodes and tables](../../postgresql/concepts-hyperscale-nodes.md)
    * [Determine application type](../../postgresql/concepts-hyperscale-app-type.md)
    * [Choose a distribution column](../../postgresql/concepts-hyperscale-choose-distribution-column.md)
    * [Table colocation](../../postgresql/concepts-hyperscale-colocation.md)
    * [Distribute and modify tables](../../postgresql/howto-hyperscale-modify-distributed-tables.md)
    * [Design a multi-tenant database](../../postgresql/tutorial-design-database-hyperscale-multi-tenant.md)*
    * [Design a real-time analytics dashboard](../../postgresql/tutorial-design-database-hyperscale-realtime.md)*

> *In these documents, skip the sections [Sign in to the Azure portal], [Create an Azure Database for Postgres - Hyperscale (Citus)] and implement the remaining steps in your Azure Arc deployment. Those sections are specific to the Azure Database for Postgres Hyperscale (Citus) offered as a PaaS service in the Azure cloud but the other parts of the documents are directly applicable to your Azure Arc enabled Postgres Hyperscale.

- [Scale out your Azure Database for PostgreSQL Hyperscale server group](scale-out-postgresql-hyperscale-server-group.md)
- [Storage configuration and Kubernetes storage concepts](storage-configuration.md)
- [Expanding Persistent volume claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)
- [Kubernetes resource model](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/resources.md#resource-quantities)

