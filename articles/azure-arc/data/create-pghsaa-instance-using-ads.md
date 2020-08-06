---
title: Deploy Azure Database for PostgreSQL Hyperscale using Azure Data Studio
description: Deploy Azure Database for PostgreSQL Hyperscale using Azure Data Studio
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Scenario: Deploy Azure Database for PostgreSQL Hyperscale using Azure Data Studio

This document walks you through the steps for using Azure Data Studio to provision Azure Database for PostgreSQL Hyperscale server groups.

## Pre-requisites

- [Install azdata, Azure Data Studio, and Azure CLI](/scenarios/001-install-client-tools.md)

## Login to the Azure Arc data controller

Before you can create an instance you must first login to the Azure Arc data controller if you are not already logged in.

```terminal
azdata login
```

You will then be prompted for the username, password and the system namespace.  

> If you used the script to install the data controller then your namespace should be **arc**

```terminal
Username: arcadmin
Password:
Namespace: arc
Logged in successfully to `https://10.0.0.4:30080` in namespace `arc`. Setting active context to `arc`
```

## Deploy Azure Database for PostgreSQL Hyperscale server group on Azure Arc

- Click on the three dots on the top left to create a new instance
![alt text](/assets/newdeployement.png)

- Select PostgreSQL server groups - Azure Arc and hit select
  
![alt text](/assets/selectpostgres.png)

- Fill in the required input fields and hit deploy

- You should see that the deployment has started
![alt text](/assets/postgresmonitoring.png)

- In a few minutes your deployment should successfully complete
![alt text](/assets/pguccessfuldeployement.png)

## View PostgreSQL Hyperscale server groups on Azure Arc

To view the PostgreSQL Hyperscale server groups on Azure Arc, use the following command:

```terminal
azdata postgres server list -ns arc
```

```terminal
Name        Status    ClusterIP             ExternalIP      MustRestart
----------  --------  --------------------  --------------  -------------
pg1  Running   10.102.204.135:30655  10.0.0.4:30655  False
```

You can then use the ExternalIP and port number when connecting.

If you are using an Azure VM to test, follow the following instructions.

## Azure virtual machine deployments

If you are using an Azure virtual machine, then the endpoint IP address will not show the _public_ IP address. To locate the public IP address, use the following command:

```terminal
az network public-ip list -g azurearcvm-rg --query "[].{PublicIP:ipAddress}" -o table
```

You can then combine the public IP address with the port to make your connection.

You may also need to expose the port of the PostgreSQL instance through the network security gateway (NSG). To allow traffic through the (NSG) you will need to add a rule which you can do using the following command.

To set a rule you will need to know the name of your NSG which you can find out using the command below:

```terminal
az network nsg list -g azurearcvm-rg --query "[].{NSGName:name}" -o table
```

Once you have the name of the NSG, you can add a firewall rule using the following command. The example values here create an NSG rule for port 30655 and allows connection from **any** source IP address.  This is not a security best practice!  You can lock things down better by specifying a -source-address-prefixes value that is specific to your client IP address or an IP address range that covers your team's or organization's IP addresses.

Replace the value of the --destination-port-ranges parameter below with the port number you got from the 'azdata postgres server list' command above.

```terminal
az network nsg rule create -n db_port --destination-port-ranges 30655 --source-address-prefixes '*' --nsg-name azurearcvmNSG --priority 500 -g azurearcvm-rg --access Allow --description 'Allow port through for db access' --destination-address-prefixes '*' --direction Inbound --protocol Tcp --source-port-ranges '*'
```

## Connect with Azure Data Studio

Open Azure Data Studio and connect to your instance with the external endpoint IP address and port number above, and the password retrieved from the `azdata postgres server endpoint` command. Follow steps here on how to [connect to a Postgres endpoint using Azure Data Studio](https://docs.microsoft.com/en-us/sql/azure-data-studio/quickstart-postgres?view=sql-server-ver15)

Remember if you are using an Azure VM you will need the _public_ IP address which is accessible via the following command:

```terminal
az network public-ip list -g azurearcvm-rg --query "[].{PublicIP:ipAddress}" -o table
```

If PostgreSQL isn't available in the *Connection type* dropdown, you can install it by searching for PostgreSQL in the extensions tab.

## Connect with psql

To access your PostgreSQL Hyperscale server group, run `azdata postgres server endpoint` and pass the name of the PostgreSQL Hyperscale server group that you provided when you created the instance as the -n parameter value:

```terminal
azdata postgres server endpoint -n pg1 -ns arc
```

```terminal
Description           Endpoint
--------------------  ----------------------------------------------------------------------------------------------------------------
Log Search Dashboard  https://10.0.0.4:31777/kibana/app/kibana#/discover?_a=(query:(language:kuery,query:'cluster_name:"pg1"'))
Metrics Dashboard     https://10.0.0.4:31777/grafana/d/postgres-metrics?var-Namespace=arc&var-Name=pg1
PostgreSQL Instance   postgresql://postgres:PASSWORD@10.0.0.4:30655
```

The command will output URLs that can be used to access the PostgreSQL instance, its metrics, and its logs. The PostgreSQL URL has the format `postgres://userName:password@host:port`. You can extract the host, port, and login from the URL if your PostgreSQL client application can’t accept the connection string in URL form. The default database name is the same as the initial user (`postgres`).

You can now connect either with psql (install the `postgresql-client` package to use psql on an Azure VM):

```terminal
psql postgresql://postgres:PASSWORD@10.0.0.4:30655
```

For example:

| Setting         | Example value     | Notes                                                        |
| --------------- | ----------------- | ------------------------------------------------------------ |
| Server name     | `52.229.9.30`     | When using an Azure VM make sure to use the Public IP here   |
| Port            | `30655`           | **!** This needs to be entered in **"Advanced..." => "Server" => "Port"** in the connection panel, then click OK to save |
| User name       | `postgres`        | Default user is always named `postgres`                      |
| Password        | `PASSWORD`        | Retrieve the Postgres user password from `azdata postgres server endpoint` as described above |

Once connected, you can utilize the full functionality of PostgreSQL Hyperscale, including [creating distributed tables](https://docs.microsoft.com/en-us/azure/postgresql/quickstart-create-hyperscale-portal#create-and-distribute-tables).

## Next Steps

Try to [Scale out your Azure Database for PostgreSQL Hyperscale server group](008-scale-out-pghsaa.md).
