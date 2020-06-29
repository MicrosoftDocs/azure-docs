---
title: Configure Mobility Service Proxy Settings for Azure to Azure Disaster Recovery | Microsoft Docs
description: Provides details on how to configure mobility service when customers use a proxy in their source environment.
services: site-recovery
author: sideeksh
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 03/18/2020
ms.author: sideeksh

---
# Configure Mobility Service Proxy Settings for Azure to Azure Disaster Recovery

This article provides guidance on customizing networking configurations on the target Azure virtual machine (VM) when you're replicating and recovering Azure VMs from one region to another, using [Azure Site Recovery](site-recovery-overview.md).

The purpose of this document is to provide steps to configure Proxy Settings for Azure Site Recovery Mobility Service in the Azure to Azure Disaster Recovery scenario. 

Proxies are network gateways that allow/disallow network connections to endpoints. Typically a proxy is a machine outside the client machine that tries to access network endpoints. A bypass list allows the client to make connections directly to the endpoints without going through the proxy. A username and password may be optionally set for a proxy by network admins so that only authenticated clients can use proxy. 

## Before you start

Learn how Site Recovery provides disaster recovery for [this scenario](azure-to-azure-architecture.md).
Understand the [networking guidance](azure-to-azure-about-networking.md) when you're replicating and recovering Azure VMs from one region to another, using [Azure Site Recovery](site-recovery-overview.md).
Ensure your proxy is set up appropriately based on the needs of your organization.

## Configure the Mobility Service

Mobility Service supports unauthenticated proxies only. It provides two ways to enter proxy details for communication with Site Recovery endpoints. 

### Method 1: Auto detection

Mobility Service auto detects the proxy settings from environment settings or IE Settings (Windows Only) during enable replication. 

- Windows OS: During Enable Replication, Mobility Service detects the proxy settings as configured in Internet Explorer for Local System user. To set up proxy for Local System account, an administrator may use psexec to launch a command prompt and then Internet Explorer. 
- Windows OS: Proxy settings are configured as environment variables http_proxy and no_proxy. 
- Linux OS: Proxy settings are configured in /etc/profile or /etc/environment as environment variables http_proxy, no_proxy. 
- The auto-detected proxy settings are saved to Mobility Service proxy config file ProxyInfo.conf 
- Default location of ProxyInfo.conf 
    - Windows: C:\ProgramData\Microsoft Azure Site Recovery\Config\ProxyInfo.conf 
    - Linux: /usr/local/InMage/config/ProxyInfo.conf


### Method 2: Provide custom application proxy settings

In this case, the customer provides custom application proxy settings in Mobility Service config file ProxyInfo.conf. This method allows customers to provide proxy only for Mobility Service or a different proxy for Azure Site Recovery Mobility Service than a proxy (or no proxy) for rest of the applications on the machine.

## Proxy template
ProxyInfo.conf contains the following template 
[proxy] 
Address=http://1.2.3.4 
Port=5678 
BypassList=hypervrecoverymanager.windowsazure.com,login.microsoftonline.com,blob.core.windows.net. 
The BypassList doesn't support wildcards like '*.windows.net' but giving windows.net is good enough to bypass. 

## Next steps:
- Read [networking guidance](site-recovery-azure-to-azure-networking-guidance.md)  for replicating Azure VMs.
- Deploy disaster recovery by [replicating Azure VMs](site-recovery-azure-to-azure.md).