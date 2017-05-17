---
title: Azure Site Recovery networking guidance for replicating from Azure to Azure | Microsoft Docs
description: Networking guidance for replicating Azure virtual machines
services: site-recovery
documentationcenter: ''
author: sujayt
manager: rochakm
editor: ''

ms.assetid:
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 05/13/2017
ms.author: sujayt

---
# Networking guidance for replicating Azure virtual machines


This article details the networking guidance for Azure Site Recovery when replicating and recovering Azure virtual machines from one region to another region. For more about Azure Site Recovery requirements, see the [prerequisites](site-recovery-prereq.md).

## Outbound connectivity for Azure Site Recovery URLs or IP ranges

If you are using any firewall proxy to control outbound internet connectivity, ensure you whitelist all the required Azure Site recovery service URLs or the IP ranges mentioned below are whitelisted.

### URLs

**URL** | **Purpose**  
--- | --- 
*.blob.core.windows.net | Required so that data can be written to the cache storage account form the VM.
login.microsoftonline.com | Required for authorization and authentication to the Site recovery service URLs.
*.hypervrecoverymanager.windowsazure.com | Required so that the Site recovery service communication can happen from the VM.
*.servicebus.windows.net | Required so that the Site recovery monitoring and diagnostics data  can be written from the VM.
.

### IP ranges

Below are the IP ranges that need to be white-listed depending on the source location where virtual machines are running and target location where the virtual machines will be replicated to.

- Ensure that all IP ranges corresponding to the source location are whitelisted. You can get the IP ranges [here](https://www.google.co.in/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&cad=rja&uact=8&ved=0ahUKEwiax5XFqffTAhUERo8KHc-HB8AQFggoMAE&url=https%3A%2F%2Fwww.microsoft.com%2Fen-in%2Fdownload%2Fdetails.aspx%3Fid%3D41653&usg=AFQjCNF0PQrMilyQDTjmj336PUiOhiViIw). This is required so that data can be written to the cache storage account form the VM.

- Ensure that all IP ranges corresponding to Office 365 [authenticatiion and identity IP V4 endpoints listed here](https://support.office.com/en-us/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2#bkmk_identity) are whitelisted.

- Ensure that you whitelist the below IPs ranges depending on your target location.

**Target Location** | **Site recovery service IPs** |  **Site recovery monitoring IP**
 --- | --- | ---
East Asia | 52.175.17.132 | 40.83.121.61 | 13.94.47.61
Southeast Asia | 52.187.58.193 | 52.187.169.104 | 13.76.179.223
Central India | 52.172.187.37 | 52.172.157.193 | 104.211.98.185
South India | 52.172.46.220 | 52.172.13.124 | 104.211.224.190
North Central US | 23.96.195.247 | 23.96.217.22 | 168.62.249.226
North Europe | 40.69.212.238 | 13.74.36.46 | 52.169.18.8
West Europe | 52.166.13.64 | 52.166.6.245 | 40.68.93.145
East US | 13.82.88.226 | 40.71.38.173 | 104.45.147.24
West US | 40.83.179.48 | 13.91.45.163 | 104.40.26.199
South Central US | 13.84.148.14 | 13.84.172.239 | 104.210.146.250
Central US | 40.69.144.231 | 40.69.167.116 | 52.165.34.144
East US 2 | 52.184.158.163 | 52.225.216.31 | 40.79.44.59
Japan East | 52.185.150.140 | 13.78.87.185 | 138.91.1.105
Japan West | 52.175.146.69 | 52.175.145.200 | 138.91.17.38
Brazil South | 191.234.185.172 | 104.41.62.15 | 23.97.97.36
Australia East | 104.210.113.114 | 40.126.226.199 | 191.239.64.144
Australia Southeast | 13.70.159.158 | 13.73.114.68 | 191.239.160.45
Canada Central | 52.228.36.192 | 52.228.39.52 | 40.85.226.62
Canada East | 52.229.125.98 | 52.229.126.170 | 40.86.225.142
West Central US | 52.161.20.168 | 13.78.230.131 | 13.78.149.209
West US 2 | 52.183.45.166 | 52.175.207.234 | 13.66.228.204
UK West | 51.141.3.203 | 51.140.226.176 | 51.141.14.113
UK South | 51.140.43.158 | 51.140.29.146 | 51.140.189.52


## Network Security Groups

## Proxy

## Azure to on-premises site-to-site VPN

## Next steps
[Replicate Azure virtual machines](site-recovery-azure-vm-enable-rep.md)
