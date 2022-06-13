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

Microsoft provides sample files to create the certificates in the [/microsoft/azure_arc/](https://github.com/microsoft/azure_arc) GitHub repository. 

You can clone the file locally to access the sample files.

```console
git clone https://github.com/microsoft/azure_arc
```

The files that are referenced in this article are in the repository under `/arc_data_services/deploy/scripts/monitoring`. 

## Create or acquire appropriate certificates

You need appropriate certificates for each UI. One for logs, and one for metrics. The following table describes the requirements.

The following table describes the requirements for each certificate and key. 

|Requirement|Logs certificate|Metrics certificate|
|-----|-----|-----|
|CN|`logsui-svc`|`metricsui-svc`|
|SANs| None required | `metricsui-svc.${NAMESPACE}.${K8S_DNS_DOMAIN_NAME}`|
|keyUsage|`digitalsignature`<br/><br>`keyEncipherment`|`digitalsignature`<br/><br>`keyEncipherment`|
|extendedKeyUsage|`serverAuth`|`serverAuth`|

> [!NOTE]
> Default K8S_DNS_DOMAIN_NAME is `svc.cluster.local`, though it may differ depending on environment and configuration.

The GitHub repository directory includes example template files that identify the certificate specifications.

- [/arc_data_services/deploy/scripts/monitoring/logsui-ssl.conf.tmpl](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/deploy/scripts/monitoring/logsui-ssl.conf.tmpl)
- [/arc_data_services/deploy/scripts/monitoring/metricsui-ssl.conf.tmpl](https://github.com/microsoft/azure_arc/blob/main/arc_data_services/deploy/scripts/monitoring/metricsui-ssl.conf.tmpl) 

The Azure Arc samples GitHub repository provides an example you can use to generate a compliant certificate and private key for an endpoint. 

See the code from [/arc_data_services/deploy/scripts/monitoringcreate-monitoring-tls-files.sh](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/deploy/scripts/monitoring).

To use the example to create certificates, update the following command with your `namespace` and the directory for the certificates (`output_directory`). Then run the command.

```console
./create-monitor-tls-files.sh <namespace> <output_directory>
```

This creates compliant certificates in the directory.

## Deploy with CLI

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

## Deploy with Kubernetes native tools

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
