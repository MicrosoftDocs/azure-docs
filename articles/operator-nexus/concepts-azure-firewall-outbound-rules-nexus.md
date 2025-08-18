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

Network rules allow the following list of (protocol, port, service tags):

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

Application rules allow the following list of (protocol, port, FQDN) combinations:

| Protocol | Port | FQDN                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| -------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTTPS   | 443  | `management.azure.com` <br> `login.microsoftonline.com` <br> `login.windows.net`  <br>  `mcr.microsoft.com` <br> `*.data.mcr.microsoft.com` <br> `gbl.his.arc.azure.com` <br> `*.his.arc.azure.com` <br> `k8connecthelm.azureedge.net` <br> `guestnotificationservice.azure.com` <br> `*.guestnotificationservice.azure.com` <br> `sts.windows.net` <br> `k8sconnectcsp.azureedge.net` <br> `*.servicebus.windows.net` <br> `graph.microsoft.com` <br> `*.arc.azure.net` <br> `dl.k8s.io` <br> `arcdataservicesrow1.azurecr.io` <br> `*.ods.opinsights.azure.com` <br> `*.oms.opinsights.azure.com` <br> `*.monitoring.azure.com` <br> `aka.ms` <br> `download.microsoft.com` <br> `packages.microsoft.com` <br> `pas.windows.net` <br> `*.guestconfiguration.azure.com` <br> `*.waconazure.com` <br> `*.blob.core.windows.net` <br> `dc.services.visualstudio.com` <br> `www.microsoft.com` <br> `kubernetes.default.svc` <br> `acs-mirror.azureedge.net` <br> `vault.azure.net` <br> `data.policy.core.windows.net` <br> `store.policy.core.windows.net` <br> `dc.services.visualstudio.com` <br> `arcmktplaceprod.azurecr.io` <br> `arcmktplaceprod.centralindia.data.azurecr.io` <br> `arcmktplaceprod.japaneast.data.azurecr.io` <br> `arcmktplaceprod.westus2.data.azurecr.io` <br> `arcmktplaceprod.westeurope.data.azurecr.io` <br> `arcmktplaceprod.eastus.data.azurecr.io` <br> `*.ingestion.msftcloudes.com` <br> `*.microsoftmetrics.com` <br> `marketplaceapi.microsoft.com` <br> `download.docker.com` <br> `onegetcdn.azureedge.net` <br> `go.microsoft.com` <br> `kubernetes.default.svc` <br> `crl.microsoft.com` <br> `*.azureedge.net` <br> `pkg-containers.githubusercontent.com` <br> `<region>.dp.kubernetesconfiguration.azure.com` <br> `<region>.login.microsoft.com` <br> `aks-service-nfarp-dns-cd3irif8.hcp.<region>.azmk8s.io` <br> `*.<region>.arcdataservices.com` <br> `cm-pouahzn9.hcp.<region>.azmk8s.io` <br> `<region>.ingest.monitor.azure.com` <br> `<region>.handler.control.monitor.azure.com` |
| HTTPS   | 8084  | `<region>.obo.arc.azure.com`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| HTTPS   | 123  | `time.windows.com`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| HTTP   | 80   | `archive.ubuntu.com` <br> `*.mp.microsoft.com` <br> `www.msftconnecttest.com` <br> `ctldl.windowsupdate.com` <br> `crl3.digicert.com` <br> `ocsp.digicert.com` <br> `*.digicert.com` <br> `crl.microsoft.com`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

>[!Note]
> The `region` placeholder represents the actual Azure region name where the resource is deployed (for example: eastus, westeurope, centralindia, etc.).