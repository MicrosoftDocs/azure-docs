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

- [Install azdata, Azure Data Studio, and Azure CLI](install-client-tools.md)
- Intall in Azure Data Studio the **Azure Data CLI** and **Azure Arc** and **PostgreSQL** extensions
- Install the [Azure Arc Data Controller](create-data-controller-using-azdata.md)

## Connect to the Azure Arc data controller

Before you can create an instance, log in to the Azure Arc data controller if you are not already logged in.

```console
azdata login
```

You will then be prompted for the namespace where the data controller is deployed, the username and password to login to the controller.  

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
  > **Note:** You may be prompted to install the azdata CLI here if it is not currently installed.
- Accept the Privacy and license terms and click **Select** at the bottom
- In the Deploy PostgreSQL Hyperscale server group - Azure Arc blade, enter the following information:
  - Enter a name for the server group
  - Enter and confirm a password for the _postgres_ administrator user of the server group
  - Select the storage class as appropriate for data
  - Select the storage class as appropriate for logs
  - Select the storage class as appropriate for backups
  - Sekect the number of worker nodes to provision

- Click the **Deploy** button

- This should initiate the deployment of the Azure Arc enabled Postgres Hyperscale server group on the data controller.

- In a few minutes, your deployment should successfully complete


## Next steps
- [Monitor your server group](monitor-grafana-kibana.md)

