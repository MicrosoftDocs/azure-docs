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

Azure Firewall rules must be updated to **remove wildcard entries** from the configuration. This change aligns with the removal of wildcards from the Infra Proxy and CSN allow-lists, which have been identified as potential targets for data exfiltration.

## Traffic flow

The simplified flow of traffic is as follows:

- **Infrastructure traffic** → Infra Proxy allow-list → Azure Firewall  
- **Tenant traffic** → CSN allow-list → Azure Firewall  

## Overview

As part of a broader security hardening initiative, the objective is to:

- Eliminate wildcard entries from:
  - Azure Firewall rules
  - Infra Proxy allow-list
  - CSN default egress allow-list  

## Infrastructure

The following wildcard entries are already identified for removal within the Infra Proxy allow-list:

| Wildcard |
|----------|
| `*.servicebus.windows.net` |
| `*.blob.core.windows.net` |
| `*.ods.opinsights.azure.com`, `*.oms.opinsights.azure.com` |
| `*.monitoring.azure.com` |
| `*.prod.warm.ingest.monitor.core.windows.net`, `*.prod.hot.ingest.monitor.core.windows.net` |

## Tenant / CSN

There is an effort via **WS-11** to negotiate the removal of wildcard entries from the CSN egress default allow-list.

The following **Network Rules** and **Application Rules** are used to allow-list NFC traffic from version 6.5 onward. These rules will also apply to CM traffic in future releases.

### Network rules

The following service tags are allowed by network rules:

- AzureActiveDirectory
- AzureTrafficManager
- AzureResourceManager
- AzureArcInfrastructure
- Storage
- AzureMonitor
- AzureContainerRegistry
- AzureKubernetesService

### Application rules

The application rules allow the following list of (protocol, port, FQDN) combinations:

| Protocol | Port | FQDNs |
|----------|------|-------|
| https | 443 | management.azure.com, login.microsoftonline.com, login.windows.net, mcr.microsoft.com, `*.data.mcr.microsoft.com`, gbl.his.arc.azure.com, `*.his.arc.azure.com`, k8connecthelm.azureedge.net, guestnotificationservice.azure.com, `*.guestnotificationservice.azure.com`, sts.windows.net, k8sconnectcsp.azureedge.net, `*.servicebus.windows.net`, graph.microsoft.com, `*.arc.azure.net`, dl.k8s.io, arcdataservicesrow1.azurecr.io, `*.ods.opinsights.azure.com`, `*.oms.opinsights.azure.com`, `*.monitoring.azure.com`, aka.ms, download.microsoft.com, packages.microsoft.com, pas.windows.net, `*.guestconfiguration.azure.com`, `*.waconazure.com`, `*.blob.core.windows.net`, dc.services.visualstudio.com, www.microsoft.com, msk8s.api.cdp.microsoft.com, msk8s.sb.tlu.dl.delivery.mp.microsoft.com, `*.login.microsoft.com`, `*.dp.prod.appliances.azure.com`, ecpacr.azurecr.io, azurearcfork8s.azurecr.io, adhs.events.data.microsoft.com, v20.events.data.microsoft.com, linuxgeneva-microsoft.azurecr.io, kvamanagementoperator.azurecr.io, gcs.prod.monitoring.core.windows.net, `*.prod.microsoftmetrics.com`, `*.prod.hot.ingest.monitor.core.windows.net`, `*.prod.warm.ingest.monitor.core.windows.net`, `*.dp.kubernetesconfiguration.azure.com`, pypi.org, `*.pypi.org`, pythonhosted.org, `*.pythonhosted.org`, kubernetes.default.svc, acs-mirror.azureedge.net, vault.azure.net, data.policy.core.windows.net, store.policy.core.windows.net, dc.services.visualstudio.com, arcmktplaceprod.azurecr.io, arcmktplaceprod.centralindia.data.azurecr.io, arcmktplaceprod.japaneast.data.azurecr.io, arcmktplaceprod.westus2.data.azurecr.io, arcmktplaceprod.westeurope.data.azurecr.io, arcmktplaceprod.eastus.data.azurecr.io, `*.ingestion.msftcloudes.com`, `*.microsoftmetrics.com`, marketplaceapi.microsoft.com, nvidia.github.io, us.download.nvidia.com, download.docker.com, onegetcdn.azureedge.net, go.microsoft.com, kubernetes.default.svc, crl.microsoft.com, `*.azureedge.net`, pkg-containers.githubusercontent.com, `<region>.dp.kubernetesconfiguration.azure.com`, `<region>.login.microsoft.com`, `aks-service-nfarp-dns-cd3irif8.hcp.<region>.azmk8s.io`, `*.<region>.arcdataservices.com`, `cm-pouahzn9.hcp.<region>.azmk8s.io`, `*.hcp.<region>.azmk8s.io`, `<region>.ingest.monitor.azure.com`, `<region>.handler.control.monitor.azure.com` |
| https | 8084 | `<region>.obo.arc.azure.com` |
| https | 123 | time.windows.com, ntp.ubuntu.com |
| http | 80 | security.ubuntu.com, azure.archive.ubuntu.com, changelogs.ubuntu.com, `*.mp.microsoft.com`, www.msftconnecttest.com, ctldl.windowsupdate.com, crl3.digicert.com, ocsp.digicert.com, `*.digicert.com`, crl.microsoft.com |

> [!NOTE]  
> `<region>` placeholders should be replaced with the appropriate Azure region for your deployment.

## References

- [Azure Arc network requirements - Azure Arc | Microsoft Learn](https://learn.microsoft.com/azure/azure-arc/network-requirements)  
- [Outbound network and FQDN rules for Azure Kubernetes Service (AKS) clusters | Microsoft Learn](https://learn.microsoft.com/azure/aks/outbound-rules-fqdn)  