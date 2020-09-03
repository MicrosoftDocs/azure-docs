---
title: Create an Azure Database for PostgreSQL Hyperscale server group on Azure Arc
description: Create an Azure Database for PostgreSQL Hyperscale server group on Azure Arc
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Create an Azure Database for PostgreSQL Hyperscale server group on Azure Arc

This document describes the steps to deploy a PostgreSQL Hyperscale server group on Azure Arc.

## Select to the Azure Arc data controller

Before you can create an instance, you must first select the Azure Arc data controller if you aren't already logged in.

```console
azdata login
```

You'll then be prompted for the username, password, and the system namespace.  

If you used the script to install the data controller, then your namespace should be **arc**

```console
Namespace: arc
Username: arcadmin
Password:
Logged in successfully to `https://10.0.0.4:30080` in namespace `arc`. Setting active context to `arc`
```

## Preliminary step for OpenShift users only

This preliminary step before moving to the next step _"For all users"_. To deploy PostgreSQL Hyperscale server group onto Red Hat OpenShift in a project other than the default, you need to execute the following commands against your cluster to relax the security constraints.

```console
oc adm policy add-scc-to-user anyuid -z dusky-agent -n projectname
```

For more information on the Security Context Constraints (SCC) in OpenShift, see the OpenShift documentation [here](https://docs.openshift.com/container-platform/4.2/authentication/managing-security-context-constraints.html).
You may now implement the next step explained in the next section _"For all users"_.

## Create an Azure Database for PostgreSQL Hyperscale server group

To create an Azure Database for PostgreSQL Hyperscale server group on Azure Arc, use the following command:

```console
azdata arc postgres server create -n <name> --workers 2 --external-endpoint --storage-class-data <storage class name> --storage-class-logs <storage class name>

#Example
#azdata arc postgres server create -n postgres01 --workers 2 --external-endpoint --storage-class-data managed-premium --storage-class-logs managed-premium
```



 If you don't know the names of the storage classes available in your environment, run the command `kubectl get sc`.

+ Names must be 10 characters or fewer in length and conform to DNS naming conventions
+ Namespace can't be reserved namespaces.

There are other command-line parameters available.  See the complete list of options by running `azdata postgres server create -h`.

You will be prompted to enter the password.  You can skip the interactive prompt by setting the `AZDATA_PASSWORD` environment variable before you run the create command.

If you deployed the data controller using `AZDATA_USERNAME` and `AZDATA_PASSWORD` in the same terminal session, then the values for `AZDATA_USERNAME` and `AZDATA_PASSWORD` will be used to deploy the PostgreSQL instance too.

 Creating a PostgreSQL Instance will not immediately register resources in Azure. As part of the process of [uploading metrics/logs](/scenarios-new/007-upload-metrics-and-logs-to-Azure-Monitor.md) or [billing data](/scenarios-new/view-billing-data-in-azure.md) to Azure, the resources will be created in Azure and you will be able to see your resources in Azure portal.

  If you do not have a default storage class in your Kubernetes cluster, you'll need to use the parameter `--metadataStorageClass` to specify one. Not using this parameter will result in the failure of the create command. To verify if you have a default storage class declared on your Kubernetes cluster, rung the following command: 

```console
kubectl get sc
```

If there is storage class configured as default storage class, you will see **(default)** appended to the name of the storage class. For example:

```console
NAME                       PROVISIONER                        AGE
local-storage (default)    kubernetes.io/no-provisioner       4d18h
```

## Create an Azure Database for PostgreSQL instance single node (not Hyperscale)

To deploy a single node instance of PostgreSQL, that is, a standard Postgres instance without the Citus extension enabled, run the same command as to deploy a Hyperscale server group but don't specify the `--workers parameter`. For example:

```console
azdata arc postgres server create -n <name> -ns <namespace> --external-endpoint --storage-class-data <storage class name> --storage-class-logs <storage class name>

#Example
#azdata arc postgres server create -n postgres02 -ns arc --external-endpoint --storage-class-data managed-premium --storage-class-logs managed-premium
```

## List your Azure Database for PostgreSQL instances (Hyperscale and single node) deployed in your Arc setup

To view the PostgreSQL Hyperscale server groups on Azure Arc, use the following command:

```console
azdata arc postgres server list

Name        State     Workers
----------  --------  ---------
postgres01  Ready     2
postgres02  Ready     1
```

## Get the endpoints for your Azure Database for PostgreSQL instances

To view the endpoints for a PostgreSQL instance, run the following command:

```console
azdata arc postgres server endpoint list --name <name>

#Example
#azdata arc postgres server endpoint list --name postgres01
#Description           Endpoint
#--------------------  ----------------------------------------------------------------------------------------------------------------------------
#PostgreSQL Instance   postgresql://postgres:<replace with password>@10.240.0.6:31787
#Log Search Dashboard  https://52.152.248.25:30777/kibana/app/kibana#/discover?_a=(query:(language:kuery,query:'kubernetes_pod_name:"postgres01"'))
#Metrics Dashboard     https://52.152.248.25:30777/grafana/d/postgres-metrics?var-Namespace=arc&var-Name=postgres01
```

You can use the endpoint to connect to the PostgreSQL instance from your favorite tool - psql, Azure Data Studio, pgadmin.

If you're using an Azure VM to test, follow the following instructions.

## Special note about Azure virtual machine deployments

If you're using an Azure virtual machine, then the endpoint IP address won't show the _public_ IP address. To locate the public IP address, use the following command:

```console
az network public-ip list -g azurearcvm-rg --query "[].{PublicIP:ipAddress}" -o table
```

You can then combine the public IP address with the port to make your connection.

You may also need to expose the port of the PostgreSQL instance through the network security gateway (NSG). To allow traffic through the (NSG), you'll need to add a rule, which you can do using the following command.

To set a rule you'll need to know the name of your NSG, which you can find out using the command below:

```console
az network nsg list -g azurearcvm-rg --query "[].{NSGName:name}" -o table
```

Once you have the name of the NSG, you can add a firewall rule using the following command. The example values here create an NSG rule for port 30655 and allows connection from **any** source IP address.  A more secure method is to specify a -source-address-prefixes value that is specific to your client IP address or an IP address range that covers your team's or organization's IP addresses.

Replace the value of the `--destination-port-ranges` parameter below with the port number you got from the 'azdata postgres server list' command above.

```console
az network nsg rule create -n db_port --destination-port-ranges 30655 --source-address-prefixes '*' --nsg-name azurearcvmNSG --priority 500 -g azurearcvm-rg --access Allow --description 'Allow port through for db access' --destination-address-prefixes '*' --direction Inbound --protocol Tcp --source-port-ranges '*'
```

## Connect with Azure Data Studio

Open Azure Data Studio and connect to your instance with the external endpoint IP address and port number above, and the password you specified at the time you created the instance.  If PostgreSQL isn't available in the *Connection type* dropdown, you can install the PostgreSQL extension by searching for PostgreSQL in the extensions tab.

You will need to select the advanced tab in the connection panel to enter the port number.
> *NOTE:* You will need to click the Advanced button in the connection panel to enter the port number.

You'll need the _public_ IP address if you are using an Azure VM accessible via the following command:

```console
az network public-ip list -g azurearcvm-rg --query "[].{PublicIP:ipAddress}" -o table
```

## Connect with psql

To access your PostgreSQL Hyperscale server group, pass the external endpoint of the PostgreSQL Hyperscale server group that you retrieved from above:

You can now connect either psql:

```console
psql postgresql://postgres:PASSWORD@10.0.0.4:30655
```

## Next Steps

- [Register your instance with Azure and upload metrics and logs about your instance](upload-metrics-and-logs-to-azure-monitor.md)
- [Scale out your Azure Database for PostgreSQL Hyperscale server group](scale-out-postgresql-hyperscale.md)
