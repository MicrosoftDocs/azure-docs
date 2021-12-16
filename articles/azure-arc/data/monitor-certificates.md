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

Beginning in December, 2021 Azure Arc-enabled data services allows you to provide certificates for the monitoring dashboards. You can use these certificates for logs (Kibana) and metrics (Grafana) dashboards. 

You can specify these certificates when you deploy the data controller. This article demonstrates how to specify certificates during deployment with:

- Azure `az` CLI `arcdata` extension
- Kubernetes native deployment

The following table describes the requirements for each certificate and key. 

|Requirement|Logs certificate|Metrics certificate|
|-----|-----|-----|
|CN|`logsui-svc`|`metricsui-svc`|
|SANs| `logsui-external-svc.${NAMESPACE}.svc.cluster.local`<br/><br>`logsui-svc` | `metricsui-external-svc.${NAMESPACE}.svc.cluster.local`<br/><br>`metricsui-svc`|
|keyUsage|`digitalsignature`<br/><br>`keyEncipherment`|`digitalsignature`<br/><br>`keyEncipherment`|
|extendedKeyUsage|`serverAuth`|`serverAuth`|

## Specify during deployment with CLI

1. Generate a certificate/private key for each endpoint. 

   The Azure Arc samples GitHub repository provides an example of one way to generate a certificate and private key for an endpoint. See the following code from [create-monitoring-tls-files.sh](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/deploy/scripts/monitoring).

   :::code language="bash" source="~/azure_arc_sample/arc_data_services/deploy/scripts/monitoring/create-monitoring-tls-files.sh":::

1. Use the following arguments with `dc create ...`

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

Make sure the services are listed as subject alternative names (SANs) and the certificate usage parameters are correct. 

1. Before you deploy the data controller, provide the certificates and private keys. Create a `logsui-certificiate-secret` and a `metricsui-certificate-secret`.

   The Azure Arc samples repository provides a shell script example to create and verify a valid certificate. See [create-monitoring-tls-files.sh](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/deploy/scripts/monitoring).


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
