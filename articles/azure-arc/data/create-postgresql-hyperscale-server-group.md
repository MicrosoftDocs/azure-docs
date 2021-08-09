---
title: Create an Azure Arc-enabled PostgreSQL Hyperscale server group from CLI
description: Create an Azure Arc-enabled PostgreSQL Hyperscale server group from CLI
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Create an Azure Arc-enabled PostgreSQL Hyperscale server group

This document describes the steps to create a PostgreSQL Hyperscale server group on Azure Arc.

[!INCLUDE [azure-arc-common-prerequisites](../../../includes/azure-arc-common-prerequisites.md)]

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Getting started
If you are already familiar with the topics below, you may skip this paragraph.
There are important topics you may want read before you proceed with creation:
- [Overview of Azure Arc-enabled data services](overview.md)
- [Connectivity modes and requirements](connectivity.md)
- [Storage configuration and Kubernetes storage concepts](storage-configuration.md)
- [Kubernetes resource model](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/resources.md#resource-quantities)

If you prefer to try out things without provisioning a full environment yourself, get started quickly with [Azure Arc Jumpstart](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_data/) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM.


## Preliminary and temporary step for OpenShift users only
Implement this step before moving to the next step. To deploy PostgreSQL Hyperscale server group onto Red Hat OpenShift in a project other than the default, you need to execute the following commands against your cluster to update the security constraints. This command grants the necessary privileges to the service accounts that will run your PostgreSQL Hyperscale server group. The security context constraint (SCC) arc-data-scc is the one you added when you deployed the Azure Arc data controller.

```Console
oc adm policy add-scc-to-user arc-data-scc -z <server-group-name> -n <namespace name>
```

**Server-group-name is the name of the server group you will create during the next step.**

For more details on SCCs in OpenShift, please refer to the [OpenShift documentation](https://docs.openshift.com/container-platform/4.2/authentication/managing-security-context-constraints.html). You may now implement the next step.


## Create an Azure Arc-enabled PostgreSQL Hyperscale server group

To create an Azure Arc-enabled PostgreSQL Hyperscale server group on your Arc data controller, you will use the command `az postgres arc-server create` to which you will pass several parameters.

For details about all the parameters you can set at the creation time, review the output of the command:
```azurecli
az postgres arc-server create --help
```

The main parameters should consider are:
- **the name of the server group** you want to deploy. Indicate either `--name` or `-n` followed by a name whose length must not exceed 11 characters.

- **the version of the PostgreSQL engine** you want to deploy: by default it is version 12. To deploy version 12, you can either omit this parameter or pass one of the following parameters: `--engine-version 12` or `-ev 12`. To deploy version 11, indicate `--engine-version 11` or `-ev 11`.

- **the number of worker nodes** you want to deploy to scale out and potentially reach better performances. Before proceeding here, read the [concepts about Postgres Hyperscale](concepts-distributed-postgres-hyperscale.md). To indicate the number of worker nodes to deploy, use the parameter `--workers` or `-w` followed by an integer. The table below indicates the range of supported values and what form of Postgres deployment you get with them. For example, if you want to deploy a server group with 2 worker nodes, indicate `--workers 2` or `-w 2`. This will create three pods, one for the coordinator node/instance and two for the worker nodes/instances (one for each of the workers).



|You need   |Shape of the server group you will deploy   |-w parameter to use   |Note   |
|---|---|---|---|
|A scaled out form of Postgres to satisfy the scalability needs of your applications.   |3 or more Postgres instances, 1 is coordinator, n  are workers with n >=2.   |Use -w n, with n>=2.   |The Citus extension that provides the Hyperscale capability is loaded.   |
|A basic form of Postgres Hyperscale for you to do functional validation of your application at minimum cost. Not valid for performance and scalability validation. For that you need to use the type of deployments described above.   |1 Postgres instance that is both coordinator and worker.   |Use -w 0 and load the Citus extension. Use the following parameters if deploying from command line: -w 0 --extensions Citus.   |The Citus extension that provides the Hyperscale capability is loaded.   |
|A simple instance of Postgres that is ready to scale out when you need it.   |1 Postgres instance. It is not yet aware of the semantic for coordinator and worker. To scale it out after deployment, edit the configuration, increase the number of worker nodes and distribute the data.   |Use -w 0 or do not specify -w.   |The Citus extension that provides the Hyperscale capability is present on your deployment but is not yet loaded.   |
|   |   |   |   |

While using -w 1 works, we do not recommend you use it. This deployment will not provide you much value. With it, you will get 2 instances of Postgres: 1 coordinator and 1 worker. With this setup you actually do not scale out the data since you deploy a single worker. As such you will not see an increased level of performance and scalability. We will remove the support of this deployment in a future release.

- **the storage classes** you want your server group to use. It is important you set the storage class right at the time you deploy a server group as this cannot be changed after you deploy. If you were to change the storage class after deployment, you would need to extract the data, delete your server group, create a new server group, and import the data. You may specify the storage classes to use for the data, logs and the backups. By default, if you do not indicate storage classes, the storage classes of the data controller will be used.
    - to set the storage class for the data, indicate the parameter `--storage-class-data` or `-scd` followed by the name of the storage class.
    - to set the storage class for the logs, indicate the parameter `--storage-class-logs` or `-scl` followed by the name of the storage class.
    - to set the storage class for the backups: in this Preview of the Azure Arc-enabled PostgreSQL Hyperscale there are two ways to set storage classes depending on what types of backup/restore operations you want to do. We are working on simplifying this experience. You will either indicate a storage class or a volume claim mount. A volume claim mount is a pair of an existing persistent volume claim (in the same namespace) and volume type (and optional metadata depending on the volume type) separated by colon. The persistent volume will be mounted in each pod for the PostgreSQL server group.
        - if you want plan to do only full database restores, set the parameter `--storage-class-backups` or `-scb` followed by the name of the storage class.
        - if you plan to do both full database restores and point in time restores, set the parameter `--volume-claim-mounts` or `--volume-claim-mounts` followed by the name of a volume claim and a volume type.

Note that when you execute the create command, you will be prompted to enter the password of the default `postgres` administrative user. The name of that user cannot be changed in this Preview. You may skip the interactive prompt by setting the `AZDATA_PASSWORD` session environment variable before you run the create command.

### Examples

**To deploy a server group of Postgres version 12 named postgres01 with 2 worker nodes that uses the same storage classes as the data controller, run the following command:**
```azurecli
az postgres arc-server create -n postgres01 --workers 2 --k8s-namespace <namespace> --use-k8s
```

**To deploy a server group of Postgres version 12 named postgres01 with 2 worker nodes that uses the same storage classes as the data controller for data and logs but its specific storage class to do both full restores and point in time restores, use the following steps:**

 This example assumes that your server group is hosted in an Azure Kubernetes Service (AKS) cluster. This example uses azurefile-premium as storage class name. You may adjust the below example to match your environment. Note that **accessModes ReadWriteMany is required** for this configuration.  

First, create a YAML file that contains the below description of the backup PVC and name it CreateBackupPVC.yml for example:
```console
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: backup-pvc
  namespace: arc
spec:
  accessModes:
    - ReadWriteMany
  volumeMode: Filesystem
  resources:
    requests:
      storage: 100Gi
  storageClassName: azurefile-premium
```

Next create a PVC using the definition stored in the YAML file:

```console
kubectl create -f e:\CreateBackupPVC.yml -n arc
``` 

Next, create the server group:

```azurecli
az postgres arc-server create -n postgres01 --workers 2 --volume-claim-mounts backup-pvc:backup --k8s-namespace <namespace> --use-k8s
```

> [!IMPORTANT]
> - Read the [current limitations related to backup/restore](limitations-postgresql-hyperscale.md#backup-and-restore).


> [!NOTE]  
> - If you deployed the data controller using `AZDATA_USERNAME` and `AZDATA_PASSWORD` session environment variables in the same terminal session, then the values for `AZDATA_PASSWORD` will be used to deploy the PostgreSQL Hyperscale server group too. If you prefer to use another password, either (1) update the value for `AZDATA_PASSWORD` or (2) delete the `AZDATA_PASSWORD` environment variable or (3) delete its value to be prompted to enter a password interactively when you create a server group.
> - Creating a PostgreSQL Hyperscale server group will not immediately register resources in Azure. As part of the process of uploading [resource inventory](upload-metrics-and-logs-to-azure-monitor.md)  or [usage data](view-billing-data-in-azure.md) to Azure, the resources will be created in Azure and you will be able to see your resources in the Azure portal.



## List the PostgreSQL Hyperscale server groups deployed in your Arc data controller

To list the PostgreSQL Hyperscale server groups deployed in your Arc data controller, run the following command:

```azurecli
az postgres arc-server list --k8s-namespace <namespace> --use-k8s
```


```output
Name        State     Workers
----------  --------  ---------
postgres01  Ready     2
```

## Get the endpoints to connect to your Azure Arc-enabled PostgreSQL Hyperscale server groups

To view the endpoints for a PostgreSQL server group, run the following command:

```azurecli
az postgres arc-server endpoint list -n <server group name> --k8s-namespace <namespace> --use-k8s
```
For example:
```console
[
  {
    "Description": "PostgreSQL Instance",
    "Endpoint": "postgresql://postgres:<replace with password>@12.345.123.456:1234"
  },
  {
    "Description": "Log Search Dashboard",
    "Endpoint": "https://12.345.123.456:12345/kibana/app/kibana#/discover?_a=(query:(language:kuery,query:'custom_resource_name:\"postgres01\"'))"
  },
  {
    "Description": "Metrics Dashboard",
    "Endpoint": "https://12.345.123.456:12345/grafana/d/postgres-metrics?var-Namespace=arc3&var-Name=postgres01"
  }
]
```

You can use the PostgreSQL Instance endpoint to connect to the PostgreSQL Hyperscale server group from your favorite tool:  [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio), [pgcli](https://www.pgcli.com/) psql, pgAdmin, etc. When you do so, you connect to the coordinator node/instance which takes care of routing the query to the appropriate worker nodes/instances if you have created distributed tables. For more details, read the [concepts of Azure Arc-enabled PostgreSQL Hyperscale](concepts-distributed-postgres-hyperscale.md).

   [!INCLUDE [use-insider-azure-data-studio](includes/use-insider-azure-data-studio.md)]

## Special note about Azure virtual machine deployments

When you are using an Azure virtual machine, then the endpoint IP address will not show the _public_ IP address. To locate the public IP address, use the following command:

```azurecli
az network public-ip list -g azurearcvm-rg --query "[].{PublicIP:ipAddress}" -o table
```

You can then combine the public IP address with the port to make your connection.

You may also need to expose the port of the PostgreSQL Hyperscale server group through the network security gateway (NSG). To allow traffic through the (NSG) you will need to add a rule which you can do using the following command:

To set a rule you will need to know the name of your NSG. You determine the NSG using the command below:

```azurecli
az network nsg list -g azurearcvm-rg --query "[].{NSGName:name}" -o table
```

Once you have the name of the NSG, you can add a firewall rule using the following command. The example values here create an NSG rule for port 30655 and allows connection from **any** source IP address.  This is not a security best practice!  You can lock down things better by specifying a -source-address-prefixes value that is specific to your client IP address or an IP address range that covers your team's or organization's IP addresses.

Replace the value of the --destination-port-ranges parameter below with the port number you got from the 'az postgres arc-server list' command above.

```azurecli
az network nsg rule create -n db_port --destination-port-ranges 30655 --source-address-prefixes '*' --nsg-name azurearcvmNSG --priority 500 -g azurearcvm-rg --access Allow --description 'Allow port through for db access' --destination-address-prefixes '*' --direction Inbound --protocol Tcp --source-port-ranges '*'
```

## Connect with Azure Data Studio

Open Azure Data Studio and connect to your instance with the external endpoint IP address and port number above, and the password you specified at the time you created the instance.  If PostgreSQL isn't available in the *Connection type* dropdown, you can install the PostgreSQL extension by searching for PostgreSQL in the extensions tab.

> [!NOTE]
> You will need to click the [Advanced] button in the connection panel to enter the port number.

Remember, if you are using an Azure VM you will need the _public_ IP address which is accessible via the following command:

```azurecli
az network public-ip list -g azurearcvm-rg --query "[].{PublicIP:ipAddress}" -o table
```

## Connect with psql

To access your PostgreSQL Hyperscale server group, pass the external endpoint of the PostgreSQL Hyperscale server group that you retrieved from above:

You can now connect either psql:

```console
psql postgresql://postgres:<EnterYourPassword>@10.0.0.4:30655
```

## Next steps

- Connect to your Azure Arc-enabled PostgreSQL Hyperscale: read [Get Connection Endpoints And Connection Strings](get-connection-endpoints-and-connection-strings-postgres-hyperscale.md)
- Read the concepts and How-to guides of Azure Database for PostgreSQL Hyperscale to distribute your data across multiple PostgreSQL Hyperscale nodes and to benefit from better performances potentially:
    * [Nodes and tables](../../postgresql/concepts-hyperscale-nodes.md)
    * [Determine application type](../../postgresql/concepts-hyperscale-app-type.md)
    * [Choose a distribution column](../../postgresql/concepts-hyperscale-choose-distribution-column.md)
    * [Table colocation](../../postgresql/concepts-hyperscale-colocation.md)
    * [Distribute and modify tables](../../postgresql/howto-hyperscale-modify-distributed-tables.md)
    * [Design a multi-tenant database](../../postgresql/tutorial-design-database-hyperscale-multi-tenant.md)*
    * [Design a real-time analytics dashboard](../../postgresql/tutorial-design-database-hyperscale-realtime.md)*

    > \* In the documents above, skip the sections **Sign in to the Azure portal**, & **Create an Azure Database for PostgreSQL - Hyperscale (Citus)**. Implement the remaining steps in your Azure Arc deployment. Those sections are specific to the Azure Database for PostgreSQL Hyperscale (Citus) offered as a PaaS service in the Azure cloud but the other parts of the documents are directly applicable to your Azure Arc-enabled PostgreSQL Hyperscale.

- [Scale out your Azure Arc-enabled for PostgreSQL Hyperscale server group](scale-out-in-postgresql-hyperscale-server-group.md)
- [Storage configuration and Kubernetes storage concepts](storage-configuration.md)
- [Expanding Persistent volume claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)
- [Kubernetes resource model](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/resources.md#resource-quantities)
