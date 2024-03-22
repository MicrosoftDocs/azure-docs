---
title: Create Azure Arc-enabled PostgreSQL server using Azure Data Studio
description: Create Azure Arc-enabled PostgreSQL server using Azure Data Studio
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: dhanmm
ms.author: dhmahaja
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Create Azure Arc-enabled PostgreSQL server using Azure Data Studio

This document walks you through the steps for using Azure Data Studio to provision Azure Arc-enabled PostgreSQL servers.

[!INCLUDE [azure-arc-common-prerequisites](../../../includes/azure-arc-common-prerequisites.md)]

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Preliminary and temporary step for OpenShift users only

Implement this step before moving to the next step. To deploy PostgreSQL server onto Red Hat OpenShift in a project other than the default, you need to execute the following commands against your cluster to update the security constraints. This command grants the necessary privileges to the service accounts that will run your PostgreSQL server. The security context constraint (SCC) **_arc-data-scc_** is the one you added when you deployed the Azure Arc data controller.

```console
oc adm policy add-scc-to-user arc-data-scc -z <server-name> -n <namespace name>
```

_**Server-name** is the name of the server you will deploy during the next step._
   
For more details on SCCs in OpenShift, please refer to the [OpenShift documentation](https://docs.openshift.com/container-platform/4.2/authentication/managing-security-context-constraints.html).
You may now implement the next step.

## Create an Azure Arc-enabled PostgreSQL server

1. Launch Azure Data Studio
1. On the Connections tab, Click on the three dots on the top left and choose "New Deployment"
1. From the deployment options, select **PostgreSQL server - Azure Arc**
    >[!NOTE]
    > You may be prompted to install the [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)] here if it is not currently installed.
1. Accept the Privacy and license terms and click **Select** at the bottom
1. In the Deploy PostgreSQL server - Azure Arc blade, enter the following information:
   - Enter a name for the server
   - Enter and confirm a password for the _postgres_ administrator user of the server
   - Select the storage class as appropriate for data
   - Select the storage class as appropriate for logs
   - Select the storage class as appropriate for backups
1. Click the **Deploy** button

This starts the creation of the Azure Arc-enabled PostgreSQL server on the data controller.

In a few minutes, your creation should successfully complete.

### Storage class considerations
 
It is important you set the storage class right at the time you deploy a server as this cannot be changed after you deploy. If you were to change the storage class after deployment, you would need to extract the data, delete your server, create a new server, and import the data. You may specify the storage classes to use for the data, logs and the backups. By default, if you do not indicate storage classes, the storage classes of the data controller will be used.
   
   - to set the storage class for the data, indicate the parameter `--storage-class-data` followed by the name of the storage class.
   - to set the storage class for the logs, indicate the parameter `--storage-class-logs` followed by the name of the storage class.
   - setting the storage class for the backups has been temporarily removed as we temporarily removed the backup/restore functionalities as we finalize designs and experiences.


## Related content
- [Manage your server using Azure Data Studio](manage-postgresql-server-with-azure-data-studio.md)
- [Monitor your server](monitor-grafana-kibana.md)

    > \* In the documents above, skip the sections **Sign in to the Azure portal**, & **Create an Azure Database for PostgreSQL**. Implement the remaining steps in your Azure Arc deployment. Those sections are specific to the Azure Database for PostgreSQL server offered as a PaaS service in the Azure cloud but the other parts of the documents are directly applicable to your Azure Arc-enabled PostgreSQL server.

- [Storage configuration and Kubernetes storage concepts](storage-configuration.md)
- [Kubernetes resource model](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/resources.md#resource-quantities)
