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

# Provide certificates for monitoring

Beginning in December, 2021 Azure Arc-enabled data services allows you to provide certificates for the monitoring dashboards. You can use these certificates for logs (Kibana) and metrics (Grafana) dashboards. 

You can specify these certificates when you deploy the data controller. This article demonstrates how to specify certificates during deployment with:

- Azure `az` CLI `arcdata` extension
- Kubernetes native deployment
- 
- ## Specify during CLI deployment

1. Generate a certificate/private key for each endpoint. 

   See example {create-monitoring-tls-files.sh}

1. Use the following arguments with `dc create ...`

   - `--logs-ui-public-key-file <path\file to logs public key file>`
   - `--logs-ui-private-key-file <path\file to logs private key file>`
   - `--metrics-ui-public-key-file <path\file to metrics public key file>`
   - `--metrics-ui-private-key-file <path\file to metrics private key file>`

## Specify during Kubernetes native tools deployment

1. Before you deploy the data controller, provide the certificates and private keys. Create a `logsui-certificiate-secret` and a `metricsui-certificate-secret`.
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
