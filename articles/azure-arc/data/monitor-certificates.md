---
title: Provide certificates for monitoring
description: Explains how to provide certificates for monitoring
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 12/15/2021
ms.topic: how-to
---

# Provide SSL certificates for monitoring

Beginning with the December, 2021 release, Azure Arc-enabled data services allows you to provide SSL/TLS certificates for the monitoring dashboards. You can use these certificates for logs (Kibana) and metrics (Grafana) dashboards. 

You can specify the certificate when you create a data controller with:
- Azure `az` CLI `arcdata` extension
- Kubernetes native deployment

## Create or acquire appropriate certificates

The Azure Arc samples GitHub repository provides an example of one way to generate a certificate and private key for an endpoint. 

To use the example, download the contents of the [monitoring](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/deploy/scripts/monitoring) folder.

See the following code from [create-monitoring-tls-files.sh](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/deploy/scripts/monitoring).

:::code language="bash" source="~/azure_arc_sample/arc_data_services/deploy/scripts/monitoring/create-monitoring-tls-files.sh":::

The following table describes the requirements for each certificate and key. 

|Requirement|Logs certificate|Metrics certificate|
|-----|-----|-----|
|CN|`logsui-svc`|`metricsui-svc`|
|SANs| `logsui-external-svc.${NAMESPACE}.svc.cluster.local`<br/><br>`logsui-svc` | `metricsui-external-svc.${NAMESPACE}.svc.cluster.local`<br/><br>`metricsui-svc`|
|keyUsage|`digitalsignature`<br/><br>`keyEncipherment`|`digitalsignature`<br/><br>`keyEncipherment`|
|extendedKeyUsage|`serverAuth`|`serverAuth`|

## Specify during deployment with CLI

After you have the certificate/private key for each endpoint, create the data controller with `az dc create...` command.

To apply your own certificate/private key use the following arguments.

   - `--logs-ui-public-key-file <path\file to logs public key file>`
   - `--logs-ui-private-key-file <path\file to logs private key file>`
   - `--metrics-ui-public-key-file <path\file to metrics public key file>`
   - `--metrics-ui-private-key-file <path\file to metrics private key file>`

For example, the following example creates a data controller with designated certificates for the logs and metrics UI dashboards:

```azurecli
az arcdata dc create --profile-name azure-arc-aks-default-storage --k8s-namespace <namespace> --use-k8s --name arc --subscription <subscription id> --resource-group <resource group name> --location <location> --connectivity-mode indirect --logs-ui-public-key-file <path\file to logs public key file> --logs-ui-private-key-file <path\file to logs private key file> --metrics-ui-public-key-file <path\file to metrics public key file> --metrics-ui-private-key-file <path\file to metrics private key file>

#Example:
#az arcdata dc create --profile-name azure-arc-aks-default-storage  --k8s-namespace arc --use-k8s --name arc --subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx --resource-group my-resource-group --location eastus --connectivity-mode indirect --logs-ui-public-key-file /path/to/logsuipublickeyfile.pem --logs-ui-private-key-file /path/to/logsuiprivatekey.pem --metrics-ui-public-key-file /path/to/metricsuipublickeyfile.pem --metrics-ui-private-key-file /path/to/metricsuiprivatekey.pem
```

You can only specify certificates when you include `--use-k8s` in the `az arcdata dc create ...` statement.

## Specify during Kubernetes native tools deployment

If you are using Kubernetes native tools to deploy, create kubernetes secrets that hold the certificates and private keys. Create the following secrets:

- `logsui-certificiate-secret` 
- `metricsui-certificate-secret`.

Make sure the services are listed as subject alternative names (SANs) and the certificate usage parameters are correct. 

1. Verify each secret has the following fields:
   - `certificate.pem` containing the base64 encoded certificate
   - `privatekey.pem` containing the private key

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
