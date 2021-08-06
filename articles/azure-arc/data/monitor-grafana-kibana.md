---
title: View logs and metrics using Kibana and Grafana
description: View logs and metrics using Kibana and Grafana
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# View logs and metrics using Kibana and Grafana

Kibana and Grafana web dashboards are provided to bring insight and clarity to the Kubernetes namespaces being used by Azure Arc—enabled data services.



## Monitor Azure SQL managed instances on Azure Arc

To access the logs and monitoring dashboards for Azure Arc—enabled SQL Managed Instance, run the following `azdata` CLI command

```azurecl
az sql mi-arc endpoint list -n <name of SQL instance>

```
The relevant Grafana dashboards are:

* "Azure SQL managed instance Metrics"
* "Host Node Metrics"
* "Host Pods Metrics"


> [!NOTE]
>  When prompted to enter a username and password, enter the username and password that you provided at the time that you created the Azure Arc data controller.

> [!NOTE]
>  You will be prompted with a certificate warning because the certificates are self-signed certificates.


## Monitor Azure Database for PostgreSQL Hyperscale on Azure Arc

To access the logs and monitoring dashboards for PostgreSQL Hyperscale, run the following `azdata` CLI command

```bash

az postgres arc-server endpoint list -n <name of postgreSQL instance> --k8s-namespace <namespace> --use-k8s

```

The relevant postgreSQL dashboards are:

* "Postgres Metrics"
* "Postgres Table Metrics"
* "Host Node Metrics"
* "Host Pods Metrics"


## Additional firewall configuration

Depending on where the data controller is deployed, you may find that you need to open up ports on your firewall to access the Kibana and Grafana endpoints.

Below is an example of how to do this for an Azure VM. You will need to do this if you have deployed Kubernetes using the script.

The steps below highlight how to create an NSG rule for the Kibana and Grafana endpoints:

### Find the name of the NSG

```azurecli
az network nsg list -g azurearcvm-rg --query "[].{NSGName:name}" -o table
```

### Add the NSG rule

Once you have the name of the NSG you can add a rule using the following command:

```azurecli
az network nsg rule create -n ports_30777 --nsg-name azurearcvmNSG --priority 600 -g azurearcvm-rg --access Allow --description 'Allow Kibana and Grafana ports' --destination-address-prefixes '*' --destination-port-ranges 30777 --direction Inbound --protocol Tcp --source-address-prefixes '*' --source-port-ranges '*'
```


## Next steps
- Try [Upload metrics and logs to Azure Monitor](upload-metrics-and-logs-to-azure-monitor.md)
- Read about Grafana:
   - [Getting started](https://grafana.com/docs/grafana/latest/getting-started/getting-started)
   - [Grafana fundamentals](https://grafana.com/tutorials/grafana-fundamentals/#1)
   - [Grafana tutorials](https://grafana.com/tutorials/grafana-fundamentals/#1)
- Read about Kibana
   - [Introduction](https://www.elastic.co/webinars/getting-started-kibana?baymax=default&elektra=docs&storm=top-video)
   - [Kibana guide](https://www.elastic.co/guide/en/kibana/current/index.html)
   - [Introduction to dashboard drilldowns with data visualizations in Kibana](https://www.elastic.co/webinars/dashboard-drilldowns-with-data-visualizations-in-kibana/)
   - [How to build Kibana dashboards](https://www.elastic.co/webinars/how-to-build-kibana-dashboards/)
