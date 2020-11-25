---
title: View logs and metrics using Kibana and Grafana
description: View logs and metrics using Kibana and Grafana
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# View logs and metrics using Kibana and Grafana

Kibana and Grafana web dashboards are provided to bring insight and clarity to the Kubernetes namespaces being used by Azure Arc enabled data services.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Retrieve the IP address of your cluster

To access the dashboards you will need to retrieve your cluster's IP address. The method for retrieving the correct IP address varies depending on how you have chosen to deploy Kubernetes. Step through the options below to find the right one for you.

### Azure virtual machine

To retrieve the public IP address use the following command:

```azurecli
az network public-ip list -g azurearcvm-rg --query "[].{PublicIP:ipAddress}" -o table
```

### Kubeadm Cluster

To retrieve the cluster ip address use the following command:

```console
kubectl cluster-info
```


### AKS or other load balanced cluster

To monitor your environment in AKS or other load balanced cluster, you need to get the ip address of the management proxy service. Use this command to retrieve the **external ip** address:

```console
kubectl get svc mgmtproxy-svc-external -n <namespace>

#Example:
#kubectl get svc mgmtproxy-svc-external -n arc
NAME                     TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)           AGE
mgmtproxy-svc-external   LoadBalancer   10.0.186.28   52.152.148.25   30777:30849/TCP   19h
```

## Additional firewall configuration

You may find that you need to open up ports on your firewall to access the Kibana and Grafana endpoints.

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

## Monitor Azure SQL managed instances on Azure Arc

Now that you have the IP address and exposed the ports you should be able to access Grafana and Kibana.

> [!NOTE]
>  When prompted to enter a username and password, enter the username and password that you provided at the time that you created the Azure Arc data controller.

> [!NOTE]
>  You will be prompted with a certificate warning because the certificates used in preview are self-signed certificates.

Use the following URL pattern to access the logging and monitoring dashboards for Azure SQL managed instance:

```html
https://<external-ip-from-above>:30777/grafana
https://<external-ip-from-above>:30777/kibana
```

The relevant dashboards are:

* "Azure SQL managed instance Metrics"
* "Host Node Metrics"
* "Host Pods Metrics"

## Monitor Azure Database for PostgreSQL Hyperscale - Azure Arc

Use the following URL pattern to access the logging and monitoring dashboards for PostgreSQL Hyperscale:

```html
https://<external-ip-from-above>:30777/grafana
https://<external-ip-from-above>:30777/kibana
```

The relevant dashboards are:

* "Postgres Metrics"
* "Postgres Table Metrics"
* "Host Node Metrics"
* "Host Pods Metrics"

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

