---
title: Troubleshoot connectivity for Azure to Azure disaster recovery with Azure Site Recovery 
description: Troubleshoot connectivity issues in Azure VM disaster recovery
author: sideeksh
manager: rochakm
ms.topic: how-to
ms.date: 08/05/2019
---

# Troubleshoot Azure-to-Azure VM network connectivity issues

This article describes the common issues related to network connectivity when you replicate and recover Azure virtual machines from one region to another region. For more information about networking requirements, see the [connectivity requirements for replicating Azure VMs](azure-to-azure-about-networking.md).

For Site Recovery replication to work, outbound connectivity to specific URLs or IP ranges is required from the VM. If your VM is behind a firewall or uses network security group (NSG) rules to control outbound connectivity, you might face one of these issues.

**URL** | **Details**  
--- | ---
*.blob.core.windows.net | Required so that data can be written to the cache storage account in the source region from the VM. If you know all the cache storage accounts for your VMs, you can allow-list the specific storage account URLs (for example, cache1.blob.core.windows.net and cache2.blob.core.windows.net) instead of *.blob.core.windows.net
login.microsoftonline.com | Required for authorization and authentication to the Site Recovery service URLs.
*.hypervrecoverymanager.windowsazure.com | Required so that the Site Recovery service communication can occur from the VM. You can use the corresponding 'Site Recovery IP' if your firewall proxy supports IPs.
*.servicebus.windows.net | Required so that the Site Recovery monitoring and diagnostics data can be written from the VM. You can use the corresponding 'Site Recovery Monitoring IP' if your firewall proxy supports IPs.

## Outbound connectivity for Site Recovery URLs or IP ranges (error code 151037 or 151072)

## <a name="issue-1-failed-to-register-azure-virtual-machine-with-site-recovery-151195-br"></a>Issue 1: Failed to register Azure virtual machine with Site Recovery (151195) </br>
- **Possible cause** </br>
  - Connection cannot be established to Site Recovery endpoints due to DNS resolution failure.
  - This is more frequently seen during re-protection when you have failed over the virtual machine but the DNS server is not reachable from the DR region.

- **Resolution**
   - If you're using custom DNS, make sure that the DNS server is accessible from the Disaster Recovery region. To check if you have a custom DNS go to the VM> Disaster Recovery network> DNS servers. Try accessing the DNS server from the virtual machine. If it is not accessible, make it accessible by either failing over the DNS server or creating the line of site between DR network and DNS.

    ![com-error](./media/azure-to-azure-troubleshoot-errors/custom_dns.png)


## Issue 2: Site Recovery configuration failed (151196)

> [!NOTE]
> If the virtual machines are behind **Standard** internal load balancer, it would not have access to O365 IPs (that is, login.microsoftonline.com) by default. Either change it to **Basic** internal load balancer type or  create outbound access as mentioned in the [article](https://aka.ms/lboutboundrulescli).

- **Possible cause** </br>
  - Connection cannot be established to Office 365 authentication and identity IP4 endpoints.

- **Resolution**
  - Azure Site Recovery required access to Office 365 IPs ranges for authentication.
    If you are using Azure Network security group (NSG) rules/firewall proxy to control outbound network connectivity on the VM, ensure you allow communication to O365 IPranges. Create an [Azure Active Directory (Azure AD) service tag](../virtual-network/security-overview.md#service-tags) based NSG rule for allowing access to all IP addresses corresponding to Azure AD
      - If new addresses are added to Azure AD in the future, you need to create new NSG rules.

### Example NSG configuration

This example shows how to configure NSG rules for a VM to replicate.

- If you're using NSG rules to control outbound connectivity, use "Allow HTTPS outbound" rules to port:443 for all the required IP address ranges.
- The example presumes that the VM source location is "East US" and the target location is "Central US".

### NSG rules - East US

1. Create an outbound HTTPS (443) security rule for "Storage.EastUS" on the NSG as shown in the screenshot below.

      ![storage-tag](./media/azure-to-azure-about-networking/storage-tag.png)

2. Create an outbound HTTPS (443) security rule for "AzureActiveDirectory" on the NSG as shown in the screenshot below.

      ![aad-tag](./media/azure-to-azure-about-networking/aad-tag.png)

3. Create outbound HTTPS (443) rules for the Site Recovery IPs that correspond to the target location:

   **Location** | **Site Recovery IP address** |  **Site Recovery monitoring IP address**
    --- | --- | ---
   Central US | 40.69.144.231 | 52.165.34.144

### NSG rules - Central US

These rules are required so that replication can be enabled from the target region to the source region post-failover:

1. Create an outbound HTTPS (443) security rule for "Storage.CentralUS" on the NSG.

2. Create an outbound HTTPS (443) security rule for "AzureActiveDirectory" on the NSG.

3. Create outbound HTTPS (443) rules for the Site Recovery IPs that correspond to the source location:

   **Location** | **Site Recovery IP address** |  **Site Recovery monitoring IP address**
    --- | --- | ---
   Central US | 13.82.88.226 | 104.45.147.24
## Issue 3: Site Recovery configuration failed (151197)
- **Possible cause** </br>
  - Connection cannot be established to Azure Site Recovery service endpoints.

- **Resolution**
  - Azure Site Recovery required access to [Site Recovery IP ranges](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-about-networking#outbound-connectivity-for-ip-address-ranges) depending on the region. Make sure that required ip ranges are accessible from the virtual machine.


## Issue 4: A2A replication failed when the network traffic goes through on-premises proxy server (151072)
- **Possible cause** </br>
  - The custom proxy settings are invalid, and Azure Site Recovery Mobility Service agent did not auto-detect the proxy settings from IE


- **Resolution**
  1. Mobility Service agent detects the proxy settings from IE on Windows and /etc/environment on Linux.
  2. If you prefer to set proxy only for Azure Site Recovery Mobility Service, you can provide the proxy details in ProxyInfo.conf located at:</br>
     - ``/usr/local/InMage/config/`` on ***Linux***
     - ``C:\ProgramData\Microsoft Azure Site Recovery\Config`` on ***Windows***
  3. The ProxyInfo.conf should have the proxy settings in the following INI format.</br>
                *[proxy]*</br>
                *Address=http://1.2.3.4*</br>
                *Port=567*</br>
  4. Azure Site Recovery Mobility Service agent supports only ***un-authenticated proxies***.

### Fix the problem
To allow [the required URLs](azure-to-azure-about-networking.md#outbound-connectivity-for-urls) or the [required IP ranges](azure-to-azure-about-networking.md#outbound-connectivity-for-ip-address-ranges), follow the steps in the [networking guidance document](site-recovery-azure-to-azure-networking-guidance.md).


## Next steps
[Replicate Azure virtual machines](site-recovery-replicate-azure-to-azure.md)
