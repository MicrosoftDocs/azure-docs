---
title: Troubleshoot connectivity for Azure to Azure disaster recovery with Azure Site Recovery
description: Troubleshoot connectivity issues in Azure VM disaster recovery
author: ankitaduttaMSFT
manager: rochakm
ms.topic: how-to
ms.service: site-recovery
ms.date: 04/06/2020
---

# Troubleshoot Azure-to-Azure VM network connectivity issues

This article describes the common issues related to network connectivity when you replicate and recover Azure virtual machines (VM) from one region to another region. For more information about networking requirements, see the [connectivity requirements for replicating Azure VMs](azure-to-azure-about-networking.md).

For Site Recovery replication to work, outbound connectivity to specific URLs or IP ranges is required from the VM. If your VM is behind a firewall or uses network security group (NSG) rules to control outbound connectivity, you might face one of these issues.

| **Name**                  | **Commercial**                               | **Government**                                 | **Description** |
| ------------------------- | -------------------------------------------- | ---------------------------------------------- | ----------- |
| Storage                   | `*.blob.core.windows.net`                  | `*.blob.core.usgovcloudapi.net` | Required so that data can be written to the cache storage account in the source region from the VM. If you know all the cache storage accounts for your VMs, you can use an allow-list for the specific storage account URLs. For example, `cache1.blob.core.windows.net` and `cache2.blob.core.windows.net` instead of `*.blob.core.windows.net`. |
| Microsoft Entra ID    | `login.microsoftonline.com`                | `login.microsoftonline.us`                   | Required for authorization and authentication to the Site Recovery service URLs. |
| Replication               | `*.hypervrecoverymanager.windowsazure.com` | `*.hypervrecoverymanager.windowsazure.com`	| Required so that the Site Recovery service communication can occur from the VM. You can use the corresponding _Site Recovery IP_ if your firewall proxy supports IPs. |
| Service Bus               | `*.servicebus.windows.net`                 | `*.servicebus.usgovcloudapi.net`             | Required so that the Site Recovery monitoring and diagnostics data can be written from the VM. You can use the corresponding _Site Recovery Monitoring IP_ if your firewall proxy supports IPs. |

## Outbound connectivity for Site Recovery URLs or IP ranges (error code 151037 or 151072)

### Issue 1: Failed to register Azure virtual machine with Site Recovery (151195)

#### Possible cause

A connection can't be established to Site Recovery endpoints because of a Domain Name System (DNS) resolution failure. This problem is more common during reprotection when you've failed over the VM but the DNS server isn't reachable from the disaster recovery (DR) region.

#### Resolution

If you're using custom DNS, make sure that the DNS server is accessible from the disaster recovery region.

To check if the VM uses a custom DNS setting:

1. Open **Virtual machines** and select the VM.
1. Navigate to the VMs **Settings** and select **Networking**.
1. In **Virtual network/subnet**, select the link to open the virtual network's resource page.
1. Go to **Settings** and select **DNS servers**.

Try to access the DNS server from the virtual machine. If the DNS server isn't accessible, make it accessible by either failing over the DNS server or creating the line of site between DR network and DNS.

  :::image type="content" source="./media/azure-to-azure-troubleshoot-errors/custom_dns.png" alt-text="com-error":::

### Issue 2: Site Recovery configuration failed (151196)

> [!NOTE]
> If the VMs are behind a **Standard** internal load balancer, by default, it wouldn't have access to the Microsoft 365 IPs such as `login.microsoftonline.com`. For outbound access create an Azure NAT gateway. For more information see [Quickstart: Create a NAT gateway - Azure CLI](../virtual-network/nat-gateway/quickstart-create-nat-gateway-cli.md).

#### Possible cause

A connection can't be established to Microsoft 365 authentication and identity IP4 endpoints.

#### Resolution

- Azure Site Recovery requires access to the Microsoft 365 IP ranges for authentication.
- If you're using Azure Network security group (NSG) rules/firewall proxy to control outbound network connectivity on the VM, ensure you allow communication to the Microsoft 365 IP ranges. Create an [Microsoft Entra service tag](../virtual-network/network-security-groups-overview.md#service-tags) based NSG rule that allows access to all IP addresses corresponding to Microsoft Entra ID.
- If new addresses are added to Microsoft Entra ID in the future, you need to create new NSG rules.

### Example NSG configuration

This example shows how to configure NSG rules for a VM to replicate.

- If you're using NSG rules to control outbound connectivity, use **Allow HTTPS outbound** rules to port 443 for all the required IP address ranges.
- The example presumes that the VM source location is **East US** and the target location is **Central US**.

#### NSG rules - East US

1. Create an HTTPS outbound security rule for the NSG as shown in the following screenshot. This example uses the **Destination service tag**: _Storage.EastUS_ and **Destination port ranges**: _443_.

     :::image type="content" source="./media/azure-to-azure-about-networking/storage-tag.png" alt-text="Screenshot shows an Add outbound security rule pane for a security rule for Storage dot East U S.":::

1. Create an HTTPS outbound security rule for the NSG as shown in the following screenshot. This example uses the **Destination service tag**: _AzureActiveDirectory_ and **Destination port ranges**: _443_.

     :::image type="content" source="./media/azure-to-azure-about-networking/aad-tag.png" alt-text="Screenshot shows an Add outbound security rule pane for a security rule for Microsoft Entra ID.":::

1. Similar to above security rules, create outbound HTTPS (443) security rule for "EventHub.CentralUS" on the NSG that correspond to the target location. This allows access to Site Recovery monitoring.
1. Create an outbound HTTPS (443) security rule for "AzureSiteRecovery" on the NSG. This allows access to Site Recovery Service in any region.

#### NSG rules - Central US

For this example, these NSG rules are required so that replication can be enabled from the target region to the source region post-failover:

1. Create an HTTPS outbound security rule for _Storage.CentralUS_:

   - **Destination service tag**: _Storage.CentralUS_
   - **Destination port ranges**: _443_

1. Create an HTTPS outbound security rule for _AzureActiveDirectory_.

   - **Destination service tag**: _AzureActiveDirectory_
   - **Destination port ranges**: _443_

1. Similar to above security rules, create outbound HTTPS (443) security rule for "EventHub.EastUS" on the NSG that correspond to the source location. This allows access to Site Recovery monitoring.
1. Create an outbound HTTPS (443) security rule for "AzureSiteRecovery" on the NSG. This allows access to Site Recovery Service in any region.

### Issue 3: Site Recovery configuration failed (151197)

#### Possible cause

A connection can't be established to Azure Site Recovery service endpoints.

#### Resolution

If you are using an Azure Network Security Group (NSG) rule/firewall proxy to control outbound network connectivity on the machine, there are several service tags that need to be allowed. [Learn more](azure-to-azure-about-networking.md#outbound-connectivity-using-service-tags).

### Issue 4: Azure-to-Azure replication failed when the network traffic goes through on-premises proxy server (151072)

#### Possible cause

The custom proxy settings are invalid and the Azure Site Recovery Mobility service agent didn't autodetect the proxy settings from Internet Explorer (IE).

#### Resolution

1. The Mobility service agent detects the proxy settings from IE on Windows and `/etc/environment` on Linux.
1. If you prefer to set proxy only for Azure Site Recovery Mobility service, you can provide the proxy details in _ProxyInfo.conf_ located at:

   - **Linux**: `/usr/local/InMage/config/`
   - **Windows**: `C:\ProgramData\Microsoft Azure Site Recovery\Config`

1. The _ProxyInfo.conf_ should have the proxy settings in the following _INI_ format:

   ```plaintext
   [proxy]
   Address=http://1.2.3.4
   Port=567
   ```

> [!NOTE]
> Azure Site Recovery Mobility service agent supports only **unauthenticated proxies**.

### Fix the problem

To allow [the required URLs](azure-to-azure-about-networking.md#outbound-connectivity-for-urls) or the [required IP ranges](azure-to-azure-about-networking.md#outbound-connectivity-using-service-tags), follow the steps in the [networking guidance document](./azure-to-azure-about-networking.md).

## Next steps

[Replicate Azure VMs to another Azure region](azure-to-azure-how-to-enable-replication.md)
