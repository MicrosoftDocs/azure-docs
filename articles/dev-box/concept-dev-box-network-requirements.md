---
title: Microsoft Dev Box Network Requirements
description: Learn about the network requirements for deploying dev boxes, connecting to cloud-based resources, on-premises resources, and internet resources.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.topic: conceptual
ms.date: 02/16/2023
ms.custom: template-concept
#Customer intent: As a platform engineer, I want to understand Dev Box networking requirments so that developers can access the resources they need.
---

# Microsoft Dev Box network requirements

Microsoft Dev Box is a service that lets users connect to a cloud-based workstation running in Azure through the internet, from any device anywhere. To support these internet connections, you must follow the networking requirements listed in this article. You should work with your organization’s networking team and security team to plan and implement network access for dev boxes.
Microsoft Dev box is closely related to the Windows 365 and Azure Virtual Desktop services, and in many cases network requirements are the same. 

## General network requirements
Dev boxes require a network connection to access resources. You can choose between a Microsoft-hosted network connection, and an Azure network connection that you create in your own subscription. Choosing a method for allowing access to your network resources depends on where your resources are based. 

When using a Microsoft-hosted connection:
•	Microsoft provides and fully manages the infrastructure.
•	You can manage dev box security from Microsoft Intune.

To use your own network and provision Microsoft Entra joined dev boxes, you must meet the following requirements:
•	Azure virtual network: You must have a virtual network in your Azure subscription. The region you select for the virtual network is where Azure deploys the dev boxes. 
•	A subnet within the virtual network and available IP address space.
•	Network bandwidth: See Azure’s Network guidelines.

To use your own network and provision Microsoft Entra hybrid joined dev boxes, you must meet the above requirements, and the following requirements:
•	The Azure virtual network must be able to resolve Domain name Services (DNS) entries for your Active Directory Domain Services (AD DS) environment. To support this resolution, define your AD DS DNS servers as the DNS servers for the virtual network.
•	The Azure virtual network must have network access to an enterprise domain controller, either in Azure or on-premises.

## Allow network connectivity

In your network configuration, you must allow traffic to the following service URLs and ports to support provisioning, management, and remote connectivity of dev boxes.

### Required FQDNs and endpoints for Microsoft Dev Box

To deploy dev boxes and enable your users to connect to resources you must allow specific fully qualified domain names (FQDNs) and endpoints. These FQDNs and endpoints could be blocked if you're using a firewall, such as Azure Firewall, or proxy service.
You can check that your dev boxes can connect to these FQDNs and endpoints by following the steps to run the Azure Virtual Desktop Agent URL Tool in Check access to required FQDNs and endpoints for Azure Virtual Desktop. The Azure Virtual Desktop Agent URL Tool validates each FQDN and endpoint and shows whether your dev boxes can access them.

> [!IMPORTANT] 
> Microsoft doesn't support dev box deployments where the FQDNs and endpoints listed in this article are blocked.

Although most of the configuration is for the cloud-based dev box network, end user connectivity occurs from a physical device. Therefore, you must also follow the connectivity guidelines on the physical device network.

|Device or service	|Network connectivity required URLs and ports	|Notes |
|---|---|---|
|Physical device	|[Link](/azure/virtual-desktop/safe-url-list?tabs=azure#remote-desktop-clients) |For Remote Desktop client connectivity and updates.|
|Microsoft Intune service	|[Link](/mem/intune/fundamentals/intune-endpoints) |For Intune cloud services like device management, application delivery, and endpoint analytics.|
|Azure Virtual Desktop session host virtual machine	|[Link](/azure/virtual-desktop/safe-url-list?tabs=azure#session-host-virtual-machines) |For remote connectivity between dev boxes and the backend Azure Virtual Desktop service.|
|Windows 365 service	|[Link](/windows-365/enterprise/requirements-network?tabs=enterprise%2Cent#windows-365-service) |For provisioning and health checks.|

## Endpoints

The following URLs and ports are required for the provisioning of dev boxes and the Azure Network Connection (ANC) health checks. All endpoints connect over port 443 unless otherwise specified.

# [Windows 365 service endpoints](#tab/W365)
*.infra.windows365.microsoft.com
cpcsaamssa1prodprap01.blob.core.windows.net
cpcsaamssa1prodprau01.blob.core.windows.net
cpcsaamssa1prodpreu01.blob.core.windows.net
cpcsaamssa1prodpreu02.blob.core.windows.net
cpcsaamssa1prodprna01.blob.core.windows.net
cpcsaamssa1prodprna02.blob.core.windows.net
cpcstcnryprodprap01.blob.core.windows.net
cpcstcnryprodprau01.blob.core.windows.net
cpcstcnryprodpreu01.blob.core.windows.net
cpcstcnryprodpreu02.blob.core.windows.net
cpcstcnryprodprna01.blob.core.windows.net
cpcstcnryprodprna02.blob.core.windows.net
cpcstprovprodpreu01.blob.core.windows.net
cpcstprovprodpreu02.blob.core.windows.net
cpcstprovprodprna01.blob.core.windows.net
cpcstprovprodprna02.blob.core.windows.net
cpcstprovprodprap01.blob.core.windows.net
cpcstprovprodprau01.blob.core.windows.net
prna01.prod.cpcgateway.trafficmanager.net
prna02.prod.cpcgateway.trafficmanager.net
preu01.prod.cpcgateway.trafficmanager.net
preu02.prod.cpcgateway.trafficmanager.net
prap01.prod.cpcgateway.trafficmanager.net
prau01.prod.cpcgateway.trafficmanager.net

# [Dev box communication endpoints](#tab/DevBox)
endpointdiscovery.cmdagent.trafficmanager.net
registration.prna01.cmdagent.trafficmanager.net
registration.preu01.cmdagent.trafficmanager.net
registration.prap01.cmdagent.trafficmanager.net
registration.prau01.cmdagent.trafficmanager.net
registration.prna02.cmdagent.trafficmanager.net

# [Registration endpoints](#tab/Registration)
login.microsoftonline.com
login.live.com
enterpriseregistration.windows.net
global.azure-devices-provisioning.net (443 & 5671 outbound)
hm-iot-in-prod-prap01.azure-devices.net (443 & 5671 outbound)
hm-iot-in-prod-prau01.azure-devices.net (443 & 5671 outbound)
hm-iot-in-prod-preu01.azure-devices.net (443 & 5671 outbound)
hm-iot-in-prod-prna01.azure-devices.net (443 & 5671 outbound)
hm-iot-in-prod-prna02.azure-devices.net (443 & 5671 outbound)
hm-iot-in-2-prod-preu01.azure-devices.net (443 & 5671 outbound)
hm-iot-in-2-prod-prna01.azure-devices.net (443 & 5671 outbound)
hm-iot-in-3-prod-preu01.azure-devices.net (443 & 5671 outbound)
hm-iot-in-3-prod-prna01.azure-devices.net (443 & 5671 outbound)

---

## Use FQDN tags and service tags for endpoints through Azure Firewall

Windows 365 fully qualified domain name (FQDN) tags make it easier to grant access to Windows 365 required service endpoints through an Azure firewall. For more information, see Use Azure Firewall to manage and secure Windows 365 environments Non-Microsoft firewalls don't usually support FQDN tags or service tags. There might be a different term for the same functionality; check your firewall documentation.
A virtual network service tag represents a group of IP address prefixes from a given Azure service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change, minimizing the complexity of frequent updates to network security rules. Service tags can be used in both Network Security Group (NSG) and Azure Firewall rules to restrict outbound network access. Service tags can be also used in User Defined Route (UDR) to customize traffic routing behavior.
We recommend you use FQDN tags or service tags to simplify configuration. The listed FQDNs and endpoints and tags only correspond to Azure Virtual Desktop sites and resources. They don't include FQDNs and endpoints for other services such as Microsoft Entra ID. For service tags for other services, see Available service tags.
Azure Virtual Desktop doesn't have a list of IP address ranges that you can unblock instead of FQDNs to allow network traffic. If you're using a Next Generation Firewall (NGFW), you need to use a dynamic list made for Azure IP addresses to make sure you can connect.

## Remote Desktop Protocol (RDP) broker service endpoints

Direct connectivity to Azure Virtual Desktop RDP broker service endpoints is critical for remoting performance to a dev box. These endpoints affect both connectivity and latency. To align with the Microsoft 365 network connectivity principles, you should categorize these endpoints as Optimize endpoints. We recommend that you use a direct path from your Azure virtual network to those endpoints. <There’s a performance impact here to draw out>
To make it easier to configure network security controls, use Azure Virtual Desktop service tags to identity those endpoints for direct routing using an Azure Networking User Defined Route (UDR). A UDR results in direct routing between your virtual network and the RDP broker for lowest latency. For more information about Azure Service Tags, see Azure service tags overview.
Changing the network routes of a dev box (at the network layer or at the dev box layer like VPN) might break the connection between the dev box and the Azure Virtual Desktop RDP broker. If so, the end user is disconnected from their dev box until a connection is re-established.

## Session host virtual machines
The following table is the list of FQDNs and endpoints your session host VMsdev boxes need to access. All entries are outbound; you don't need to open inbound ports for dev boxes. 

|Address	|Protocol	|Outbound port	|Purpose	|Service tag|
|---|---|---|---|---|
|login.microsoftonline.com	|TCP	|443	|Authentication to Microsoft Online Services |	
|*.wvd.microsoft.com	|TCP	|443	|Service traffic	|WindowsVirtualDesktop |
|*.prod.warm.ingest.monitor.core.windows.net	|TCP	|443	|Agent traffic [Diagnostic output](/azure/virtual-desktop/diagnostics-log-analytics) |AzureMonitor |
|catalogartifact.azureedge.net	|TCP	|443	|Azure Marketplace	|AzureFrontDoor.Frontend|
|gcs.prod.monitoring.core.windows.net	|TCP	|443	|Agent traffic	|AzureCloud|
|kms.core.windows.net	|TCP	|1688	|Windows activation	|Internet|
|azkms.core.windows.net	|TCP	|1688	|Windows activation	|Internet|
|mrsglobalsteus2prod.blob.core.windows.net	|TCP	|443	|Agent and side-by-side (SXS) stack updates	|AzureCloud|
|wvdportalstorageblob.blob.core.windows.net	|TCP	|443	|Azure portal support	|AzureCloud|
|169.254.169.254	|TCP	|80	|[Azure Instance Metadata service endpoint](/azure/virtual-machines/windows/instance-metadata-service)|N/A|
|168.63.129.16	|TCP	|80	|[Session host health monitoring](/azure/virtual-network/network-security-groups-overview#azure-platform-considerations)|N/A|
|oneocsp.microsoft.com	|TCP	|80	|Certificates	|N/A|
|www.microsoft.com	|TCP	|80	|Certificates	|N/A|

The following table lists optional FQDNs and endpoints that your session host virtual machines might also need to access for other services:

|Address	|Protocol	|Outbound port	|Purpose|
|---|---|---|---|
|login.windows.net	|TCP	|443	|Sign in to Microsoft Online Services and Microsoft 365|
|*.events.data.microsoft.com	|TCP	|443	|Telemetry Service|
|www.msftconnecttest.com	|TCP	|80	|Detects if the session host is connected to the internet|
|*.prod.do.dsp.mp.microsoft.com	|TCP	|443	|Windows Update|
|*.sfx.ms	|TCP	|443	|Updates for OneDrive client software|
|*.digicert.com	|TCP	|80	|Certificate revocation check|
|*.azure-dns.com	|TCP	|443	|Azure DNS resolution|
|*.azure-dns.net	|TCP	|443	|Azure DNS resolution|

This list doesn't include FQDNs and endpoints for other services such as Microsoft Entra ID, Office 365, custom DNS providers, or time services. Microsoft Entra FQDNs and endpoints can be found under ID 56, 59 and 125 in Office 365 URLs and IP address ranges.

> [!TIP]
> You must use the wildcard character (*) for FQDNs involving service traffic. For agent traffic, if you prefer not to use a wildcard, here's how to find specific FQDNs to allow:
> 1.	Ensure your session host virtual machines are registered to a host pool.
> 2.	On a session host, open Event viewer, then go to Windows logs > Application > WVD-Agent and look for event ID 3701.
> 3.	Unblock the FQDNs that you find under event ID 3701. The FQDNs under event ID 3701 are region-specific. You'll need to repeat this process with the relevant FQDNs for each Azure region you want to deploy your session host virtual machines in.

## DNS requirements

As part of the Microsoft Entra hybrid join requirements, your dev boxes must be able to join on-premises Active Directory. That requires that the dev boxes be able to resolve DNS records for your on-premises AD environment.

Configure your Azure Virtual Network where the dev boxes are provisioned as follows:
1.	Make sure that your Azure Virtual Network has network connectivity to DNS servers that can resolve your Active Directory domain.
2.	From the Azure Virtual Network's Settings, select **DNS Servers** > **Custom**.
3.	Enter the IP address of DNS servers that environment that can resolve your AD DS domain.

> [!TIP]
> Adding at least two DNS servers, as you would with a physical PC, helps mitigate the risk of a single point of failure in name resolution.
For more information, see configuring Azure Virtual Networks settings.
<This is specific to hybrid connection. Link to native/hybrid articles>

## Connecting to resources on-premises (through) hybrid

You can allow dev boxes to connect to on-premises resources through a hybrid connection. Work with your Azure network expert to implement a [hub and spoke networking topology](/azure/cloud-adoption-framework/ready/azure-best-practices/hub-spoke-network-topology). The hub is the central point that connects to your on-premises network; you can use an Express Route, a site-to-site VPN, or a point-to-site VPN. The spoke is the virtual network that contains the dev boxes. Hub and spoke topology can help you manage network traffic and security. You peer the dev box virtual network to the on-premises connected virtual network to provide access to on-premises resources.

## Traffic interception technologies

Some enterprise customers use traffic interception, SSL decryption, deep packet inspection, and other similar technologies for security teams to monitor network traffic. Dev box provisioning might need direct access to the virtual machine. These traffic interception technologies can cause issues with running Azure network connection checks or dev box provisioning. Make sure no network interception is enforced for dev boxes provisioned within Microsoft Dev Box.
<Might cause latency issues – short path can help>

## End user devices

Any device on which you use one of the Remote Desktop clients to connect to Azure Virtual Desktop must have access to the following FQDNs and endpoints. Allowing these FQDNs and endpoints is essential for a reliable client experience. Blocking access to these FQDNs and endpoints is unsupported and affects service functionality.

|Address	|Protocol	|Outbound port	|Purpose	|Clients |
|---|---|---|---|---|
|login.microsoftonline.com	|TCP	|443	|Authentication to Microsoft Online Services	|All |
|*.wvd.microsoft.com	|TCP	|443	|Service traffic	|All |
|*.servicebus.windows.net	|TCP	|443	|Troubleshooting data	|All |
|go.microsoft.com	|TCP	|443	|Microsoft FWLinks	|All |
|aka.ms	|TCP	|443	|Microsoft URL shortener	|All |
|learn.microsoft.com	|TCP	|443	|Documentation	|All |
|privacy.microsoft.com	|TCP	|443	|Privacy statement	|All |
|query.prod.cms.rt.microsoft.com	|TCP	|443	|Download an MSI to update the client. Required for automatic updates.	|Windows Desktop |

These FQDNs and endpoints only correspond to client sites and resources. This list doesn't include FQDNs and endpoints for other services such as Microsoft Entra ID or Office 365. Microsoft Entra FQDNs and endpoints can be found under ID 56, 59 and 125 in Office 365 URLs and IP address ranges.

## Troubleshooting
Logon issues: The PKU2U protocol is enabled on both the local PC and the session host.

## Related content

- [Check access to required FQDNs and endpoints for Azure Virtual Desktop](/azure/virtual-desktop/check-access-validate-required-fqdn-endpoint).
- To learn how to unblock these FQDNs and endpoints in Azure Firewall, see [Use Azure Firewall to protect Azure Virtual Desktop](/azure/firewall/protect-azure-virtual-desktop).
- For more information about network connectivity, see [Understanding Azure Virtual Desktop network connectivity](https://learn.microsoft.com/en-us/azure/virtual-desktop/network-connectivity)


/azure/virtual-desktop/rdp-shortpath?tabs=managed-networks