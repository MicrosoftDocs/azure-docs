---
title: Create an Azure Database for PostgreSQL Hyperscale server group on Azure Arc
description: Create an Azure Database for PostgreSQL Hyperscale server group on Azure Arc
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Create an Azure Arc enabled PostgreSQL Hyperscale server group

This document describes the steps to create a PostgreSQL Hyperscale server group on Azure Arc.

[!INCLUDE [azure-arc-common-prerequisites](../../../includes/azure-arc-common-prerequisites.md)]

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Getting started
If you are already familiar with the topics below you may skip this paragraph.
There are important topics you may want read before you proceed with creation:
- [Overview of Azure Arc enabled data services](overview.md)
- [Connectivity modes and requirements](connectivity.md)
- [Storage configuration and Kubernetes storage concepts](storage-configuration.md)
- [Kubernetes resource model](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/resources.md#resource-quantities)

If you prefer to try things out without provisioning an full environment yourself, get started quickly with [Azure Arc Jumpstart](https://github.com/microsoft/azure_arc#azure-arc-enabled-data-services) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM.


## Login to the Azure Arc data controller

Before you can create an instance, you must first login to the Azure Arc data controller. If you are already logged in into the data controller, you can skip this step.

```console
azdata login
```

You will then be prompted for the username, password and the system namespace.  

> If you used the script to create the data controller then your namespace should be **arc**

```console
Namespace: arc
Username: arcadmin
Password:
Logged in successfully to `https://10.0.0.4:30080` in namespace `arc`. Setting active context to `arc`
```

## Preliminary and temporary step for OpenShift users only

Implement this step before moving to the next step. To deploy PostgreSQL Hyperscale server group onto Red Hat OpenShift in a project other than the default, you need to execute the following commands against your cluster to update the security constraints. This command grants the necessary privileges to the service accounts that will run your PostgreSQL Hyperscale server group. The security context constraint (SCC) **_arc-data-scc_** is the one you added when you deployed the Azure Arc data controller.

```console
oc adm policy add-scc-to-user arc-data-scc -z <server-group-name> -n <namespace name>
```

_**Server-group-name** is the name of the server group you will create during the next step._
   
For more details on SCCs in OpenShift, please refer to the [OpenShift documentation](https://docs.openshift.com/container-platform/4.2/authentication/managing-security-context-constraints.html).
You may now implement the next step.

## Create an Azure Database for PostgreSQL Hyperscale server group

To create an Azure Database for PostgreSQL Hyperscale server group on Azure Arc, use the following command:

```console
azdata arc postgres server create -n <name> --workers <# worker nodes with #>=2> --storage-class-data <storage class name> --storage-class-logs <storage class name> --storage-class-backups <storage class name>

#Example
#azdata arc postgres server create -n postgres01 --workers 2
```

> [!NOTE]
> - **There are other command-line parameters available.  See the complete list of options by running `azdata arc postgres server create --help`.**
> - The storage class used for backups (_--storage-class-backups -scb_) defaults to the data controller's data storage class if it is not provided.
> - The unit accepted by the --volume-size-* parameters is a Kubernetes resource quantity (an integer followed by one of these SI suffices (T, G, M, K, m) or their power-of-two equivalents (Ti, Gi, Mi, Ki)).
> - Names must be 12 characters or fewer in length and conform to DNS naming conventions.
> - You will be prompted to enter the password for the _postgres_ standard administrative user.  You can skip the interactive prompt by setting the `AZDATA_PASSWORD` session environment variable before you run the create command.
> - If you deployed the data controller using AZDATA_USERNAME and AZDATA_PASSWORD session environment variables in the same terminal session, then the values for AZDATA_PASSWORD will be used to deploy the PostgreSQL Hyperscale server group too. If you prefer to use another password, either (1) update the value for AZDATA_PASSWORD or (2) delete the AZDATA_PASSWORD environment variable or delete its value be prompted to enter a password interactively when you create a server group.
> - The name of the default administrator user for the PostgreSQL Hyperscale database engine is _postgres_ and cannot be changed at this point.
> - Creating a PostgreSQL Hyperscale server group will not immediately register resources in Azure. As part of the process of uploading [resource inventory](upload-metrics-and-logs-to-azure-monitor.md)  or [usage data](view-billing-data-in-azure.md) to Azure, the resources will be created in Azure and you will be able to see your resources in the Azure portal.



## List your Azure Database for PostgreSQL server groups created in your Arc setup

To view the PostgreSQL Hyperscale server groups on Azure Arc, use the following command:

```console
azdata arc postgres server list
```


```output
Name        State     Workers
----------  --------  ---------
postgres01  Ready     2
```

## Get the endpoints to connect to your Azure Database for PostgreSQL server groups

To view the endpoints for a PostgreSQL instance, run the following command:

```console
azdata arc postgres endpoint list -n <server group name>
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

You can use the PostgreSQL Instance endpoint to connect to the PostgreSQL Hyperscale server group from your favorite tool:  [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio), [pgcli](https://www.pgcli.com/) psql, pgAdmin, etc.

If you are using an Azure VM to test, follow the instructions below:

## Special note about Azure virtual machine deployments

When you are using an Azure virtual machine, then the endpoint IP address will not show the _public_ IP address. To locate the public IP address, use the following command:

```console
az network public-ip list -g azurearcvm-rg --query "[].{PublicIP:ipAddress}" -o table
```

You can then combine the public IP address with the port to make your connection.

You may also need to expose the port of the PostgreSQL Hyperscale server group through the network security gateway (NSG). To allow traffic through the (NSG) you will need to add a rule which you can do using the following command:

To set a rule you will need to know the name of your NSG. You determine the NSG using the command below:

```console
az network nsg list -g azurearcvm-rg --query "[].{NSGName:name}" -o table
```

Once you have the name of the NSG, you can add a firewall rule using the following command. The example values here create an NSG rule for port 30655 and allows connection from **any** source IP address.  This is not a security best practice!  You can lock down things better by specifying a -source-address-prefixes value that is specific to your client IP address or an IP address range that covers your team's or organization's IP addresses.

Replace the value of the --destination-port-ranges parameter below with the port number you got from the 'azdata arc postgres server list' command above.

```console
az network nsg rule create -n db_port --destination-port-ranges 30655 --source-address-prefixes '*' --nsg-name azurearcvmNSG --priority 500 -g azurearcvm-rg --access Allow --description 'Allow port through for db access' --destination-address-prefixes '*' --direction Inbound --protocol Tcp --source-port-ranges '*'
```

## Connect with Azure Data Studio

Open Azure Data Studio and connect to your instance with the external endpoint IP address and port number above, and the password you specified at the time you created the instance.  If PostgreSQL isn't available in the *Connection type* dropdown, you can install the PostgreSQL extension by searching for PostgreSQL in the extensions tab.

> [!NOTE]
> You will need to click the [Advanced] button in the connection panel to enter the port number.

Remember, if you are using an Azure VM you will need the _public_ IP address which is accessible via the following command:

```console
az network public-ip list -g azurearcvm-rg --query "[].{PublicIP:ipAddress}" -o table
```

## Connect with psql

To access your PostgreSQL Hyperscale server group, pass the external endpoint of the PostgreSQL Hyperscale server group that you retrieved from above:

You can now connect either psql:

```console
psql postgresql://postgres:<EnterYourPassword>@10.0.0.4:30655
```

## Next steps

- Read the concepts and How-to guides of Azure Database for PostgreSQL Hyperscale to distribute your data across multiple PostgreSQL Hyperscale nodes and to benefit from all the power of Azure Database for PostgreSQL Hyperscale. :
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
- [Expanding Persistent volume claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)
- [Kubernetes resource model](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/resources.md#resource-quantities)