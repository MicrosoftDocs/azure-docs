---
title: "Azure Firewall outbound rules for Azure Operator Nexus"
description: "Guidance on configuring outbound network and FQDN rules in Azure Firewall for Azure Operator Nexus to remove wildcards and strengthen security."
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 08/18/2025
---

# Outbound network and FQDN rules within Azure Firewall for Azure Operator Nexus

Azure Operator Nexus deploys and manages outbound firewall rules to ensure that the infrastructure can securely connect to Microsoft services and external package sources.  
Azure Operator Nexus automatically pushes and maintains these rules as part of the service. Customers **do not need to configure or update these rules manually**.

The following tables provide a reference of how the outbound rules appear within Azure Firewall.

## Traffic flow

The simplified flow of traffic is as follows:

- **Infrastructure traffic** → Infra Proxy allow-list → Azure Firewall  
- **Tenant traffic** → CSN allow-list → Azure Firewall  


## Tenant / CSN

The following **Network Rules** and **Application Rules** are used to allow-list Network Fabric Controller (NFC) traffic from version 6.5 onward. These rules will also apply to Cluster Manager (CM) traffic in future releases.

### Network rules

The following service tags are allowed by network rules:

| Protocol | Port | Destination (Service Tag) |
| -------- | ---- | ------------------------- |
| TCP      | 443  | AzureActiveDirectory      |
| TCP      | 443  | AzureTrafficManager       |
| TCP      | 443  | AzureResourceManager      |
| TCP      | 443  | AzureArcInfrastructure    |
| TCP      | 443  | Storage                   |
| TCP      | 443  | AzureMonitor              |
| TCP      | 443  | AzureContainerRegistry    |
| TCP      | 443  | AzureKubernetesService    |


### Application rules

The application rules allow the following list of (protocol, port, FQDN) combinations:

| Protocol | Port | FQDN                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| -------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTTPS   | 443  | `*.hcp.<region>.azmk8s.io` <br> `management.azure.com` <br> `login.microsoftonline.com` <br> `mcr.microsoft.com` <br> `packages.microsoft.com` <br> `acs-mirror.azureedge.net` <br> `dc.services.visualstudio.com` <br> `production.diagnostics.monitoring.core.windows.net` <br> `global.handler.control.monitor.azure.com` <br> `gbl.his.arc.azure.com` <br> `gcs.prod.monitoring.core.windows.net` <br> `*.prod.microsoftmetrics.com` <br> `*.prod.warm.ingest.monitor.core.windows.net` <br> `*.prod.hot.ingest.monitor.core.windows.net` <br> `onecollector.cloudapp.aria.microsoft.com` <br> `storeedgefd.dsx.mp.microsoft.com` <br> `*.dp.kubernetesconfiguration.azure.com` |
| HTTPS   | 123  | `time.windows.com`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| HTTP   | 80   | `archive.ubuntu.com`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |


## References

- [Azure Arc network requirements - Azure Arc | Microsoft Learn](https://learn.microsoft.com/azure/azure-arc/network-requirements)  
- [Outbound network and FQDN rules for Azure Kubernetes Service (AKS) clusters | Microsoft Learn](https://learn.microsoft.com/azure/aks/outbound-rules-fqdn)  