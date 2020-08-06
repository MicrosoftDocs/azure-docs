---
title: Deploy Azure SQL managed instance using Azure Data Studio
description: Deploy Azure SQL managed instance using Azure Data Studio
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Scenario: Deploy Azure SQL managed instance using Azure Data Studio

This document walks you through the steps for installing Azure SQL managed instance on Azure Arc with Azure Data Studio

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

## Deploy Azure SQL managed instance on Azure Arc

- Click on the three dots on the top left to create a new instance
![alt text](/assets/newdeployement.png)

- Select Azure SQL managed instance - Azure Arc and hit select
  > **Note:** You may be prompted to install the azdata CLI here if it is not currently installed.  **DO NOT** install azdata from Azure Data Studio!  It will install the wrong version currently.  Instead you should [install azdata by following these instructions](/scenarios/001-install-client-tools.md).

![alt text](/assets/selectsql.png)

- Fill in the required input fields and hit deploy
![alt text](/assets/sqlinput.png)

- You should see that the deployment has started
![alt text](/assets/monitorprogress.png)

- In a few minutes your deployment should successfully complete
![alt text](/assets/successfuldeployement.png)

## View instance on Azure Arc

To view all the instances you provisioned use the following command:

```terminal
azdata sql instance list
```

Output should look like this, copy the external ip and port number from here.

```terminal
Cluster Endpoint                                                   External Endpoint  Name          Status
-----------------------------------------------------------------  ------------------ ------------  ------
demosql-svc.azure-arc-sqldb-mi-system.svc.cluster.local,1433      12.10.144.21,1433  demosql      Ready
```

## Azure virtual machine deployments

If you are using an Azure virtual machine then the endpoint IP address will not show the public IP address. To locate the external IP address use the following command:

```terminal
az network public-ip list -g azurearcvm-rg --query "[].{PublicIP:ipAddress}" -o table
```

You can then combine the public IP address with the port to make your connection.

You may also need to expose the port of the sql instance through the network security gateway (NSG). To allow traffic through the (NSG) you will need to add a rule which you can do using the following command.

To set a rule you will need to know the name of your NSG which you can find out using the command below:

```terminal
az network nsg list -g azurearcvm-rg --query "[].{NSGName:name}" -o table
```

Once you have the name of the NSG, you can add a firewall rule using the following command. The example values here create an NSG rule for port 30913 and allows connection from **any** source IP address.  This is not a security best practice!  You can lock things down better by specifying a -source-address-prefixes value that is specific to your client IP address or an IP address range that covers your team's or organization's IP addresses.

Replace the value of the --destination-port-ranges parameter below with the port number you got from the 'azdata sql instance list' command above.

```terminal
az network nsg rule create -n db_port --destination-port-ranges 30913 --source-address-prefixes '*' --nsg-name azurearcvmNSG --priority 500 -g azurearcvm-rg --access Allow --description 'Allow port through for db access' --destination-address-prefixes '*' --direction Inbound --protocol Tcp --source-port-ranges '*'
```

## Connect with Azure Data Studio

Open Azure Data Studio and connect to your instance with the external endpoint IP address and port number above. Remember if you are using an Azure VM you will need the _public_ IP address which is accessible via the following command:

```terminal
az network public-ip list -g azurearcvm-rg --query "[].{PublicIP:ipAddress}" -o table
```

For example:

- Server: 52.229.9.30,30913
- Username: sa
- Password: your specified SQL password at provisioning time

## Next Steps

Now try to [monitor your SQL instance](005-monitor-grafana-kibana)
