---
title: Microsoft Dev Box Networking Requirements
description: Learn about the networking requirements for deploying dev boxes, connecting to cloud-based resources, on-premises resources, and internet resources.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.topic: concept-article
ms.date: 10/31/2024
ms.custom: template-concept

#Customer intent: As a platform engineer, I want to understand Dev Box networking requirements so that developers can access the resources they need.
---

# Microsoft Dev Box networking requirements

Microsoft Dev Box is a service that lets users connect to a cloud-based workstation running in Azure through the internet, from any device anywhere. To support these internet connections, you must follow the networking requirements listed in this article. You should work with your organization's networking team and security team to plan and implement network access for dev boxes.

Microsoft Dev box is closely related to the Windows 365 and Azure Virtual Desktop services, and in many cases network requirements are the same. 

## General network requirements

Dev boxes require a network connection to access resources. You can choose between a Microsoft-hosted network connection, and an Azure network connection that you create in your own subscription. Choosing a method for allowing access to your network resources depends on where your resources are based. 

When using a Microsoft-hosted connection:
-    Microsoft provides and fully manages the infrastructure.
-    You can manage dev box security from Microsoft Intune.

To use your own network and provision [Microsoft Entra joined](/azure/dev-box/how-to-configure-network-connections?branch=main&tabs=AzureADJoin#review-types-of-active-directory-join) dev boxes, you must meet the following requirements:
-    Azure virtual network: You must have a virtual network in your Azure subscription. The region you select for the virtual network is where Azure deploys the dev boxes. 
-    A subnet within the virtual network and available IP address space.
-    Network bandwidth: See [Azure's Network guidelines](/windows-server/remote/remote-desktop-services/network-guidance).

To use your own network and provision [Microsoft Entra hybrid joined](/azure/dev-box/how-to-configure-network-connections?branch=main&tabs=AzureADJoin#review-types-of-active-directory-join) dev boxes, you must meet the above requirements, and the following requirements:
-    The Azure virtual network must be able to resolve Domain Name Services (DNS) entries for your Active Directory Domain Services (AD DS) environment. To support this resolution, define your AD DS DNS servers as the DNS servers for the virtual network.
-    The Azure virtual network must have network access to an enterprise domain controller, either in Azure or on-premises.

> [!IMPORTANT]
> When using your own network, Microsoft Dev Box currently does not support moving network interfaces to a different virtual network or a different subnet. 

## Allow network connectivity

In your network configuration, you must allow traffic to the following service URLs and ports to support provisioning, management, and remote connectivity of dev boxes.

### Required FQDNs and endpoints for Microsoft Dev Box

To set up dev boxes and allow your users to connect to resources, you must allow traffic for specific fully qualified domain names (FQDNs) and endpoints. These FQDNs and endpoints could be blocked if you're using a firewall, such as [Azure Firewall](/azure/firewall/protect-azure-virtual-desktop), or proxy service.

You can check that your dev boxes can connect to these FQDNs and endpoints by following the steps to run the Azure Virtual Desktop Agent URL Tool in [Check access to required FQDNs and endpoints for Azure Virtual Desktop](/azure/virtual-desktop/check-access-validate-required-fqdn-endpoint). The Azure Virtual Desktop Agent URL Tool validates each FQDN and endpoint and shows whether your dev boxes can access them.

> [!IMPORTANT] 
> Microsoft doesn't support dev box deployments where the FQDNs and endpoints listed in this article are blocked.

### Use FQDN tags and service tags for endpoints through Azure Firewall

Managing network security controls for dev boxes can be complex. To simplify configuration, use fully qualified domain name (FQDN) tags and service tags to allow network traffic. 

- **FQDN tags**

   An [FQDN tag](/azure/firewall/fqdn-tags) is a predefined tag in Azure Firewall that represents a group of fully qualified domain names. By using FQDN tags, you can easily create and maintain egress rules for specific services like Windows 365 without manually specifying each domain name. 

  The groupings defined by FQDN tags can overlap. For example, the Windows365 FQDN tag includes AVD endpoints for standard ports, see [reference](/windows-365/enterprise/azure-firewall-windows-365#windows365-tag). 

   Non-Microsoft firewalls don't usually support FQDN tags or service tags. There might be a different term for the same functionality; check your firewall documentation.

- **Service tags**

   A [service tag](/azure/firewall/service-tags) represents a group of IP address prefixes from a given Azure service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change, minimizing the complexity of frequent updates to network security rules. Service tags can be used in both [Network Security Group (NSG)](/azure/virtual-network/network-security-groups-overview) and [Azure Firewall](/azure/firewall/service-tags) rules to restrict outbound network access, and in [User Defined Route (UDR)](/azure/virtual-network/virtual-networks-udr-overview#user-defined) to customize traffic routing behavior.

## Required endpoints for physical device network connectivity
Although most of the configuration is for the cloud-based dev box network, end user connectivity occurs from a physical device. Therefore, you must also follow the connectivity guidelines on the physical device network.

|Device or service    |Network connectivity required URLs and ports    |Description | Required? |
|---|---|---| --- |
|Physical device    |[Link](/azure/virtual-desktop/safe-url-list?tabs=azure#remote-desktop-clients) |Remote Desktop client connectivity and updates.| Yes |
|Microsoft Intune service    |[Link](/mem/intune/fundamentals/intune-endpoints) |Intune cloud services like device management, application delivery, and endpoint analytics.| Yes |
|Azure Virtual Desktop session host virtual machine    |[Link](/azure/virtual-desktop/safe-url-list?tabs=azure#session-host-virtual-machines) |Remote connectivity between dev boxes and the backend Azure Virtual Desktop service.| Yes |
|Windows 365 service    |[Link](/windows-365/enterprise/requirements-network?tabs=enterprise%2Cent#windows-365-service) |Provisioning and health checks.| Yes |

Any device you use to connect to a dev box must have access to the following FQDNs and endpoints. Allowing these FQDNs and endpoints is essential for a reliable client experience. Blocking access to these FQDNs and endpoints is unsupported and affects service functionality.

|Address    |Protocol    |Outbound port    |Purpose    |Clients | Required? |
|---|---|---|---|---|---|
|login.microsoftonline.com    |TCP    |443    |Authentication to Microsoft Online Services    |All | Yes |
|*.wvd.microsoft.com    |TCP    |443    |Service traffic    |All | Yes |
|*.servicebus.windows.net    |TCP    |443    |Troubleshooting data    |All | Yes |
|go.microsoft.com    |TCP    |443    |Microsoft FWLinks    |All | Yes |
|aka.ms    |TCP    |443    |Microsoft URL shortener    |All | Yes |
|learn.microsoft.com    |TCP    |443    |Documentation    |All | Yes |
|privacy.microsoft.com    |TCP    |443    |Privacy statement    |All | Yes |
|query.prod.cms.rt.microsoft.com    |TCP    |443    |Download an MSI to update the client. Required for automatic updates.    |Windows Desktop | Yes |

These FQDNs and endpoints only correspond to client sites and resources.

## Required endpoints for dev box provisioning

The following URLs and ports are required for the provisioning of dev boxes and the Azure Network Connection (ANC) health checks. All endpoints connect over port 443 unless otherwise specified.

| Category                        | Endpoints                      | FQDN tag or Service tag                        | Required?               |
|---------------------------------|--------------------------------|-------------------------------------|-------------------------------------|
| **Dev box communication endpoints** | *.agentmanagement.dc.azure.com<br>*.cmdagent.trafficmanager.net | N/A | Yes |
| **Windows 365 service and registration endpoints** | For current Windows 365 registration endpoints, see [Windows 365 network requirements](/windows-365/enterprise/requirements-network?tabs=enterprise%2Cent#windows-365-service). | FQDN tag: *Windows365* |  Yes |
| **Azure Virtual Desktop service endpoints** | For current AVD service endpoints, see [Session host virtual machines](/azure/virtual-desktop/required-fqdn-endpoint?tabs=azure#session-host-virtual-machines). | FQDN tag: *WindowsVirtualDesktop* | Yes |
| **Microsoft Entra ID** | FQDNs and endpoints for Microsoft Entra ID can be found under ID 56, 59 and 125 in [Office 365 URLs and IP address ranges](/office365/enterprise/urls-and-ip-address-ranges#microsoft-365-common-and-office-online). | Service tag: *AzureActiveDirectory* | Yes |
| **Microsoft Intune** | For current FQDNs and endpoints for Microsoft Entra ID, see [Intune core service](/mem/intune/fundamentals/intune-endpoints?tabs=north-america#intune-core-service).| FQDN tag: *MicrosoftIntune* | Yes |

The listed FQDNs and endpoints and tags correspond to the required resources. They don't include FQDNs and endpoints for all services. For service tags for other services, see [Available service tags](/azure/virtual-network/service-tags-overview#available-service-tags).

Azure Virtual Desktop doesn't have a list of IP address ranges that you can unblock instead of FQDNs to allow network traffic. If you're using a Next Generation Firewall (NGFW), you need to use a dynamic list made for Azure IP addresses to make sure you can connect.

For more information, see [Use Azure Firewall to manage and secure Windows 365 environments](/windows-365/enterprise/azure-firewall-windows-365).

The following table is the list of FQDNs and endpoints your dev boxes need to access. All entries are outbound; you don't need to open inbound ports for dev boxes. 

|Address    |Protocol    |Outbound port    |Purpose    |Service tag| Required? |
|---|---|---|---|---|---|
|login.microsoftonline.com    |TCP    |443    |Authentication to Microsoft Online Services | AzureActiveDirectory | Yes |   
|*.wvd.microsoft.com    |TCP    |443    |Service traffic    |WindowsVirtualDesktop | Yes |
|*.prod.warm.ingest.monitor.core.windows.net    |TCP    |443    |Agent traffic [Diagnostic output](/azure/virtual-desktop/diagnostics-log-analytics) |AzureMonitor | Yes |
|catalogartifact.azureedge.net    |TCP    |443    |Azure Marketplace    |AzureFrontDoor.Frontend| Yes |
|gcs.prod.monitoring.core.windows.net    |TCP    |443    |Agent traffic    |AzureCloud| Yes |
|kms.core.windows.net    |TCP    |1688    |Windows activation    |Internet| Yes |
|azkms.core.windows.net    |TCP    |1688    |Windows activation    |Internet| Yes |
|mrsglobalsteus2prod.blob.core.windows.net    |TCP    |443    |Agent and side-by-side (SXS) stack updates    |AzureCloud| Yes |
|wvdportalstorageblob.blob.core.windows.net    |TCP    |443    |Azure portal support    |AzureCloud| Yes |
|169.254.169.254    |TCP    |80    |[Azure Instance Metadata service endpoint](/azure/virtual-machines/windows/instance-metadata-service)|N/A| Yes |
|168.63.129.16    |TCP    |80    |[Session host health monitoring](/azure/virtual-network/network-security-groups-overview#azure-platform-considerations)|N/A| Yes |
|oneocsp.microsoft.com    |TCP    |80    |Certificates    |N/A| Yes |
|www.microsoft.com    |TCP    |80    |Certificates    |N/A| Yes |

The following table lists optional FQDNs and endpoints that your session host virtual machines might also need to access for other services:

|Address    |Protocol    |Outbound port    |Purpose| Required? |
|---|---|---|---|---|
|login.windows.net    |TCP    |443    |Sign in to Microsoft Online Services and Microsoft 365| Optional |
|*.events.data.microsoft.com    |TCP    |443    |Telemetry Service|Optional |
|www.msftconnecttest.com    |TCP    |80    |Detects if the session host is connected to the internet| Optional |
|*.prod.do.dsp.mp.microsoft.com    |TCP    |443    |Windows Update| Optional |
|*.sfx.ms    |TCP    |443    |Updates for OneDrive client software| Optional |
|*.digicert.com    |TCP    |80    |Certificate revocation check| Optional |
|*.azure-dns.com    |TCP    |443    |Azure DNS resolution| Optional |
|*.azure-dns.net    |TCP    |443    |Azure DNS resolution| Optional |

This list doesn't include FQDNs and endpoints for other services such as Microsoft Entra ID, Office 365, custom DNS providers, or time services. Microsoft Entra FQDNs and endpoints can be found under ID 56, 59 and 125 in [Office 365 URLs and IP address ranges](/office365/enterprise/urls-and-ip-address-ranges#microsoft-365-common-and-office-online).

> [!TIP]
> You must use the wildcard character (*) for FQDNs involving service traffic. For agent traffic, if you prefer not to use a wildcard, here's how to find specific FQDNs to allow:
> 1.    Ensure your session host virtual machines are registered to a host pool.
> 2.    On a session host, open **Event viewer**, then go to **Windows logs** > **Application** > **WVD-Agent** and look for event ID **3701**.
> 3.    Unblock the FQDNs that you find under event ID 3701. The FQDNs under event ID 3701 are region-specific. You'll need to repeat this process with the relevant FQDNs for each Azure region you want to deploy your session host virtual machines in.

## Remote Desktop Protocol (RDP) broker service endpoints

Direct connectivity to Azure Virtual Desktop RDP broker service endpoints is critical for remote performance to a dev box. These endpoints affect both connectivity and latency. To align with the Microsoft 365 network connectivity principles, you should categorize these endpoints as *Optimize* endpoints, and use a [Remote Desktop Protocol (RDP) Shortpath](/windows-365/enterprise/rdp-shortpath-public-networks) from your Azure virtual network to those endpoints. RDP Shortpath can provide another connection path for improved dev box connectivity, especially in suboptimal network conditions.

To make it easier to configure network security controls, use Azure Virtual Desktop service tags to identify those endpoints for direct routing using an Azure Networking User Defined Route (UDR). A UDR results in direct routing between your virtual network and the RDP broker for lowest latency. 

Changing the network routes of a dev box (at the network layer or at the dev box layer like VPN) might break the connection between the dev box and the Azure Virtual Desktop RDP broker. If so, the end user is disconnected from their dev box until a connection is re-established.

## DNS requirements

As part of the Microsoft Entra hybrid join requirements, your dev boxes must be able to join on-premises Active Directory. Dev boxes must be able to resolve DNS records for your on-premises AD environment to join.

Configure your Azure Virtual Network where the dev boxes are provisioned as follows:
1.    Make sure that your Azure Virtual Network has network connectivity to DNS servers that can resolve your Active Directory domain.
2.    From the Azure Virtual Network's Settings, select **DNS Servers** > **Custom**.
3.    Enter the IP address of DNS servers that environment that can resolve your AD DS domain.

> [!TIP]
> Adding at least two DNS servers, as you would with a physical PC, helps mitigate the risk of a single point of failure in name resolution.
For more information, see configuring [Azure Virtual Networks settings](/azure/virtual-network/manage-virtual-network#change-dns-servers).

## Connecting to on-premises resources

You can allow dev boxes to connect to on-premises resources through a hybrid connection. Work with your Azure network expert to implement a [hub and spoke networking topology](/azure/cloud-adoption-framework/ready/azure-best-practices/hub-spoke-network-topology). The hub is the central point that connects to your on-premises network; you can use an Express Route, a site-to-site VPN, or a point-to-site VPN. The spoke is the virtual network that contains the dev boxes. Hub and spoke topology can help you manage network traffic and security. You peer the dev box virtual network to the on-premises connected virtual network to provide access to on-premises resources.

## Traffic interception technologies

Some enterprise customers use traffic interception, TLS decryption, deep packet inspection, and other similar technologies for security teams to monitor network traffic.  These traffic interception technologies can cause issues with running Azure network connection checks or dev box provisioning. Make sure no network interception is enforced for dev boxes provisioned within Microsoft Dev Box.

Traffic interception technologies can exacerbate latency issues. You can use a [Remote Desktop Protocol (RDP) Shortpath](/windows-365/enterprise/rdp-shortpath-public-networks) to help minimize latency issues.

## Troubleshooting 

This section covers some common connection and network issues.

### Connection issues

- **Logon attempt failed**

  If the dev box user encounters sign in problems and sees an error message indicating that the sign in attempt failed, ensure you enabled the PKU2U protocol on both the local PC and the session host.

  For more information about troubleshooting sign in errors, see [Troubleshoot connections to Microsoft Entra joined VMs - Windows Desktop client](/azure/virtual-desktop/troubleshoot-azure-ad-connections#the-logon-attempt-failed).

- **Group policy issues in hybrid environments**

  If you're using a hybrid environment, you might encounter group policy issues. You can test whether the issue is related to group policy by temporarily excluding the dev box from the group policy.

  For more information about troubleshooting group policy issues, see [Applying Group Policy troubleshooting guidance](/troubleshoot/windows-server/group-policy/applying-group-policy-troubleshooting-guidance).

### IPv6 addressing issues

If you're experiencing IPv6 issues, check that the *Microsoft.AzureActiveDirectory* service endpoint isn't enabled on the virtual network or subnet. This service endpoint converts the IPv4 to IPv6.

For more information, see [Virtual Network service endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview).

### Updating dev box definition image issues

When you update the image used in a dev box definition, you must ensure that you have sufficient IP addresses available in your virtual network. More free IP addresses are necessary for the Azure Network connection health check. If the health check fails, the dev box definition doesn't update. You need one extra IP address per dev box, and one IP addresses for the health check and Dev Box infrastructure.

For more information about updating dev box definition images, see [Update a dev box definition](how-to-manage-dev-box-definitions.md#update-a-dev-box-definition).

## Related content

- [Check access to required FQDNs and endpoints for Azure Virtual Desktop](/azure/virtual-desktop/check-access-validate-required-fqdn-endpoint).
- Learn how to unblock these FQDNs and endpoints in Azure Firewall, see [Use Azure Firewall to protect Azure Virtual Desktop](/azure/firewall/protect-azure-virtual-desktop).
- For more information about network connectivity, see [Understanding Azure Virtual Desktop network connectivity](/azure/virtual-desktop/network-connectivity).
