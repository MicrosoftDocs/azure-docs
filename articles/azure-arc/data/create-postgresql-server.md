---
title: Create an Azure Arc-enabled PostgreSQL server from CLI
description: Create an Azure Arc-enabled PostgreSQL server from CLI
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
ms.custom: devx-track-azurecli
author: dhanmm
ms.author: dhmahaja
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Create an Azure Arc-enabled PostgreSQL server from CLI

This document describes the steps to create a PostgreSQL server on Azure Arc and to connect to it.

[!INCLUDE [azure-arc-common-prerequisites](../../../includes/azure-arc-common-prerequisites.md)]

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Getting started
If you are already familiar with the topics below, you may skip this paragraph.
There are important topics you may want read before you proceed with creation:
- [Overview of Azure Arc-enabled data services](overview.md)
- [Connectivity modes and requirements](connectivity.md)
- [Storage configuration and Kubernetes storage concepts](storage-configuration.md)
- [Kubernetes resource model](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/resources.md#resource-quantities)

If you prefer to try out things without provisioning a full environment yourself, get started quickly with [Azure Arc Jumpstart](https://azurearcjumpstart.com/azure_arc_jumpstart/azure_arc_data) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM.


## Preliminary and temporary step for OpenShift users only
Implement this step before moving to the next step. To deploy PostgreSQL server onto Red Hat OpenShift in a project other than the default, you need to execute the following commands against your cluster to update the security constraints. This command grants the necessary privileges to the service accounts that will run your PostgreSQL server. The security context constraint (SCC) arc-data-scc is the one you added when you deployed the Azure Arc data controller.

```Console
oc adm policy add-scc-to-user arc-data-scc -z <server-name> -n <namespace-name>
```

**Server-name is the name of the server you will create during the next step.**

For more details on SCCs in OpenShift, refer to the [OpenShift documentation](https://docs.openshift.com/container-platform/4.2/authentication/managing-security-context-constraints.html). Proceed to the next step.


## Create an Azure Arc-enabled PostgreSQL server

To create an Azure Arc-enabled PostgreSQL server on your Arc data controller, you will use the command `az postgres server-arc create` to which you will pass several parameters.

For details about all the parameters you can set at the creation time, review the output of the command:
```azurecli
az postgres server-arc create --help
```

The main parameters should consider are:
- **the name of the server** you want to deploy. Indicate either `--name` or `-n` followed by a name whose length must not exceed 11 characters.

- **The storage classes** you want your server to use. It is important you set the storage class right at the time you deploy a server as this setting cannot be changed after you deploy. You may specify the storage classes to use for the data, logs and the backups. By default, if you do not indicate storage classes, the storage classes of the data controller will be used.
    - To set the storage class for the backups, indicate the parameter `--storage-class-backups` followed by the name of the storage class. Excluding this parameter disables automated backups
    - To set the storage class for the data, indicate the parameter `--storage-class-data` followed by the name of the storage class.
    - To set the storage class for the logs, indicate the parameter `--storage-class-logs` followed by the name of the storage class.

   > [!IMPORTANT]
   > If you need to change the storage class after deployment, extract the data, delete your server, create a new server, and import the data. 

When you execute the create command, you will be prompted to enter the username and password for the administrative user. You may skip the interactive prompt by setting the `AZDATA_USERNAME` and `AZDATA_PASSWORD` session environment variables before you run the create command.

### Examples

**To deploy a PostgreSQL server named postgres01 that uses the same storage classes as the data controller, run the following command**:

```azurecli
az postgres server-arc create -n postgres01 --k8s-namespace <namespace> --use-k8s
```

> [!NOTE]  
> - If you deployed the data controller using `AZDATA_USERNAME` and `AZDATA_PASSWORD` session environment variables in the same terminal session, then the values for `AZDATA_PASSWORD` will be used to deploy the PostgreSQL server too. If you prefer to use another password, either (1) update the values for `AZDATA_USERNAME` and `AZDATA_PASSWORD` or (2) delete the `AZDATA_USERNAME` and `AZDATA_PASSWORD` environment variables or (3) delete their values to be prompted to enter a username and password interactively when you create a server.
> - Creating a PostgreSQL server will not immediately register resources in Azure. As part of the process of uploading [resource inventory](upload-metrics-and-logs-to-azure-monitor.md)  or [usage data](view-billing-data-in-azure.md) to Azure, the resources will be created in Azure and you will be able to see your resources in the Azure portal.


## List the PostgreSQL servers deployed in your Arc data controller

To list the PostgreSQL servers deployed in your Arc data controller, run the following command:

```azurecli
az postgres server-arc list --k8s-namespace <namespace> --use-k8s
```


```output
  {
    "name": "postgres01",
    "state": "Ready"
  }
```

## Get the endpoints to connect to your Azure Arc-enabled PostgreSQL servers

To view the endpoints for a PostgreSQL server, run the following command:

```azurecli
az postgres server-arc endpoint list -n <server name> --k8s-namespace <namespace> --use-k8s
```
For example:
```console
{
  "instances": [
    {
      "endpoints": [
        {
          "description": "PostgreSQL Instance",
          "endpoint": "postgresql://postgres:<replace with password>@123.456.78.912:5432"
        },
        {
          "description": "Log Search Dashboard",
        },
        {
          "description": "Metrics Dashboard",
          "endpoint": "https://98.765.432.11:3000/d/postgres-metrics?var-Namespace=arc&var-Name=postgres01"
        }
      ],
      "engine": "PostgreSql",
      "name": "postgres01"
    }
  ],
  "namespace": "arc"
}
```

You can use the PostgreSQL Instance endpoint to connect to the PostgreSQL server from your favorite tool:  [Azure Data Studio](/azure-data-studio/download-azure-data-studio), [pgcli](https://www.pgcli.com/) psql, pgAdmin, etc.

   [!INCLUDE [use-insider-azure-data-studio](includes/use-insider-azure-data-studio.md)]

## Special note about Azure virtual machine deployments

When you are using an Azure virtual machine, then the endpoint IP address will not show the _public_ IP address. To locate the public IP address, use the following command:
```azurecli
az network public-ip list -g azurearcvm-rg --query "[].{PublicIP:ipAddress}" -o table
```
You can then combine the public IP address with the port to make your connection.

You may also need to expose the port of the PostgreSQL server through the network security gateway (NSG). To allow traffic through the (NSG), set a rule. To set a rule, you will need to know the name of your NSG. You determine the NSG using the command below:

```azurecli
az network nsg list -g azurearcvm-rg --query "[].{NSGName:name}" -o table
```

Once you have the name of the NSG, you can add a firewall rule using the following command. The example values here create an NSG rule for port 30655 and allows connection from **any** source IP address. 

> [!WARNING]
> We do not recommend setting a rule to allow connection from any source IP address. You can lock down things better by specifying a `-source-address-prefixes` value that is specific to your client IP address or an IP address range that covers your team's or organization's IP addresses.

Replace the value of the `--destination-port-ranges` parameter below with the port number you got from the `az postgres server-arc list` command above.

```azurecli
az network nsg rule create -n db_port --destination-port-ranges 30655 --source-address-prefixes '*' --nsg-name azurearcvmNSG --priority 500 -g azurearcvm-rg --access Allow --description 'Allow port through for db access' --destination-address-prefixes '*' --direction Inbound --protocol Tcp --source-port-ranges '*'
```

## Connect with Azure Data Studio

Open Azure Data Studio and connect to your instance with the external endpoint IP address and port number above, and the password you specified at the time you created the instance.  If PostgreSQL isn't available in the *Connection type* dropdown, you can install the PostgreSQL extension by searching for PostgreSQL in the extensions tab.

> [!NOTE]
> You will need to click the [Advanced] button in the connection panel to enter the port number.

Remember, if you are using an Azure VM you will need the _public_ IP address, which is accessible via the following command:

```azurecli
az network public-ip list -g azurearcvm-rg --query "[].{PublicIP:ipAddress}" -o table
```

## Connect with psql

To access your PostgreSQL server, pass the external endpoint of the PostgreSQL server that you retrieved from above:

You can now connect either psql:

```console
psql postgresql://postgres:<EnterYourPassword>@10.0.0.4:30655
```

## Next steps

- Connect to your Azure Arc-enabled PostgreSQL server: read [Get Connection Endpoints And Connection Strings](get-connection-endpoints-and-connection-strings-postgresql-server.md)

    > \* In the documents above, skip the sections **Sign in to the Azure portal**, & **Create an Azure Database for PostgreSQL**. Implement the remaining steps in your Azure Arc deployment. Those sections are specific to the Azure Database for PostgreSQL server offered as a PaaS service in the Azure cloud but the other parts of the documents are directly applicable to your Azure Arc-enabled PostgreSQL server.

- [Storage configuration and Kubernetes storage concepts](storage-configuration.md)
- [Expanding Persistent volume claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)
- [Kubernetes resource model](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/resources.md#resource-quantities)
