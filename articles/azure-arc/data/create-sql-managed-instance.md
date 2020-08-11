---
title: Create an Azure SQL managed instance on Azure Arc
description: Create an Azure SQL managed instance on Azure Arc
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Scenario: Create an Azure SQL managed instance on Azure Arc

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

Log in to your Azure account.

> [!NOTE]
> Logging into Azure is optional at this point. If you wish to use Azure attached capabilities such as Azure monitor and Azure Log Analytics, log in with your Azure account, else you can skip it.

```terminal
az login
```

> [!NOTE]
>  The az login command will provide a URL and a code to use in a internet browser. If you press CTRL+C instinctively to copy this information, it will kill the az login session and you will have to redo it. Do not press CTRL+C but instead use some other method to copy the code and URL.

## Create an Azure SQL managed instance

To create an Azure SQL managed managed instance use the following command.

> [!NOTE]
>  Names must be less than 13 characters in length and conform to DNS naming conventions

> [!NOTE]
>  When specifying memory allocation and vCore allocation use this formula to ensure your deployment is successful - for each 1 vCore you need at least 4GB of RAM of capacity available on the Kubernetes node where the SQL managed instance pod will run.

> [!NOTE]
>  When creating a SQL instance do not use upper case in the name if you are provisioning in Azure

> [!NOTE]
>  The --port parameter does not work on the July 2020 release.

> [!NOTE]
>  To list available storage classes in your kubernetes cluster run `kubectl get storageclass` 

```terminal
azdata arc sql mi create -n <instanceName> --external-endpoint --storage-class-data <storage class> --storage-class-logs <storage class>
```

Example:

```terminal
azdata arc sql mi create -n sqldemo --external-endpoint --storage-class-data managed-premium --storage-class-logs managed-premium
```

You will then be asked to submit a username and password for the system administrator account:

> If you want to automate the deployment of SQL instances and avoid the interactive prompt for the SA password, you can set the `AZDATA_USERNAME` and `AZDATA_PASSWORD` environment variables to the desired username and password prior to running the `azdata arc sql mi create` command.

> [!NOTE]
>  If you deployed the data controller using AZDATA_USERNAME and AZDATA_PASSWORD in the same terminal session, then the values for AZDATA_USERNAME and AZDATA_PASSWORD will be used to deploy the SQL managed instance too.


## View instance on Azure Arc

To view the instance use the following command:

```terminal
azdata arc sql mi list
```

Output should look like this:

```terminal
Name    Replicas    ServerEndpoint    State
------  ----------  ----------------  -------
sqldemo 1/1         10.240.0.4:32023  Ready
```

If you are using AKS or kubeadm or OpenShift etc., you can copy the external IP and port number from here and connect to it using your favorite tool for connecting to a SQL Sever/Azure SQL instance such as Azure Data Studio or SQL Server Management Studio.  However, if you are using the quick start VM, please see below for special information about how to connect to that VM from outside of Azure.  Please note your corporate policies may block access to the port, especially in the public cloud.

## Special note about Azure virtual machine deployments

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

## Connect with Azure Data Studio or SQL Server Management Studio

Open Azure Data Studio and connect to your instance with the external endpoint IP address and port number above. Remember if you are using an Azure VM you will need the _public_ IP address which is identifiable using the steps above.

For example:

- Server: 52.229.9.30,30913
- Username: sa
- Password: your specified SQL password at provisioning time

## NOTE

- Please note that creating Azure SQL Managed Instance will not register resources in Azure. As part of Step 007 upload-grafana-kibana and 021 view billing data in azure you will be able to see your resources in Azure portal.

## Next steps

- [Register your instance with Azure and upload metrics and logs about your instance](upload-metrics-and-logs-to-azure-monitor.md)
- [Deploy Azure SQL managed instance using Azure Data Studio](create-sql-managed-instance-azure-data-studio.md)
