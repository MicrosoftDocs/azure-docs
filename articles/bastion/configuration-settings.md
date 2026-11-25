---
title: About Azure Bastion configuration settings
description: Learn about the available configuration settings for Azure Bastion.
author: asudbring
ms.author: allensu
ms.service: azure-bastion
ms.topic: concept-article
ms.date: 11/03/2026
ms.custom: references_regions, ignite-2024, ignite-2026
# Customer intent: "As a cloud administrator, I want to configure Azure Bastion settings, including SKU selection and network requirements, so that I can ensure secure and efficient access to virtual machines within my infrastructure."
---

# About Azure Bastion configuration settings

The sections in this article discuss the resources and settings for Azure Bastion.

## <a name="subnet"></a>Azure Bastion subnet

> [!IMPORTANT]
> For Azure Bastion resources deployed on or after November 2, 2021, the minimum AzureBastionSubnet size is /26 or larger (/25, /24, etc.). All Azure Bastion resources deployed in subnets of size /27 prior to this date are unaffected by this change and will continue to work, but we highly recommend increasing the size of any existing AzureBastionSubnet to /26 in case you choose to take advantage of [host scaling](./configure-host-scaling.md) in the future.
>

When you deploy Azure Bastion using any SKU except the Bastion Developer offering, Bastion requires a dedicated subnet named **AzureBastionSubnet**. You must create this subnet in the same virtual network that you want to deploy Azure Bastion to. The subnet must have the following configuration:

* Subnet name must be *AzureBastionSubnet*.
* Subnet size must be /26 or larger (/25, /24 etc.).
* For host scaling, a /26 or larger subnet is recommended. Using a smaller subnet space limits the number of scale units. For more information, see the [Host scaling](#instance) section of this article.
* The subnet must be in the same virtual network and resource group as the bastion host.
* The subnet can't contain other resources.

You can configure this setting using the following methods:

| Method | Value | Links |
| --- | --- |--- |
| Azure portal | Subnet  |[Quickstart](quickstart-host-portal.md)|
| Azure PowerShell | -subnetName|[cmdlet](/powershell/module/az.network/new-azbastion#parameters) |
| Azure CLI |  --subnet-name | [command](/cli/azure/network/vnet#az-network-vnet-create) |

## <a name="public-ip"></a>Public IP address

Azure Bastion deployments, except Bastion Developer and [Private-only](#private-only), require a Public IP address. The Public IP must have the following configuration:

* The Public IP address SKU must be **Standard**.
* The Public IP address assignment/allocation method must be **Static**.
* The Public IP address name is the resource name by which you want to refer to this public IP address.
* You can choose to use a public IP address that you already created, as long as it meets the criteria required by Azure Bastion and isn't already in use.

You can configure this setting using the following methods:

| Method | Value | Links |
| --- | --- |--- |
| Azure portal | Public IP address |[Azure portal](https://portal.azure.com)|
| Azure PowerShell | -PublicIpAddress| [cmdlet](/powershell/module/az.network/new-azbastion#parameters)  |
| Azure CLI | --public-ip create |[command](/cli/azure/network/public-ip) |

### IPv6 dual stack support (Preview)
Azure Bastion deployments support either IPv4 addresses or IPv4 and IPv6 dual stack IP addresses. Dual stack must be configured when the Bastion is created; existing IPv4-only Bastions can't be converted to dual stack.

IPv6 is supported for the connection between the user and Azure Bastion only. Connections from Azure Bastion to the target VM continue to use IPv4.

#### Prerequisites
To use IPv6 dual stack deployments for Azure Bastion:

* The virtual network and the **AzureBastionSubnet** must be configured for IPv6 dual stack.
* The target virtual machine must be associated with a network interface that has IPv6 dual stack support, in a virtual network that supports IPv6 dual stack.

#### Limitations
* IPv6 only is not supported at this time.
* IPv6 is not supported on Private Only Bastion deployments.
* IPv6 is not supported between Azure Bastion and the target VM.

For additional IPv6 limitations on Azure virtual networks, see [IPv6 for Azure Virtual Network: Limitations](/azure/virtual-network/ip-services/ipv6-overview#limitations)

### Configure Public IP addresses with availability zones configured
Refer to the table below for creating/using public IP addresses for zonal Bastion deployments:

| Scenario| Bastion availability zones  | Public IP availability zones  |
|:-------|:------|:-------|
| Creating a new public IP | 1, 2, 3 | 1, 2, 3 |
| | 1 | 1, 2, 3|
|Using an existing public IP | 1, 2, 3 | 1, 2, 3|
| | 1 | 1, 2, 3|
| | 0 | all public IPs, zonal or not|


## <a name="instance"></a>Instances and host scaling

An instance is an optimized Azure VM that is created when you configure Azure Bastion. Azure fully manages each instance for you. An instance is also referred to as a scale unit. You connect to client VMs via an Azure Bastion instance. When you configure Azure Bastion using the Basic SKU, two instances are created. If you use the Standard SKU or higher, you can specify the number of instances. This is called **host scaling**.

To configure host scaling, see [Configure host scaling](configure-host-scaling.md).

## <a name="ports"></a>Custom ports

You can specify the port that you want to use to connect to your VMs. By default, the inbound ports used to connect are 3389 for RDP and 22 for SSH. If you configure a custom port value, specify that value when you connect to the VM.

Custom port values are supported for the Standard SKU or higher only.

## Shareable link

The Bastion **Shareable Link** feature lets users connect to a target resource using Azure Bastion without accessing the Azure portal.

When a user without Azure credentials clicks a shareable link, a webpage opens that prompts the user to sign in to the target resource via RDP or SSH. Users authenticate using username and password or private key, depending on what you configured in the Azure portal for that target resource. Users can connect to the same resources that you can currently connect to with Azure Bastion: VMs or virtual machine scale set.

| Method | Value | Links | Requires Standard SKU or higher |
| --- | --- | --- | --- |
| Azure portal |Shareable Link  | [Configure](shareable-link.md)| Yes |

## <a name="private-only"></a>Private-only deployment

[!INCLUDE [Private-only deployments](../../includes/bastion-private-only-description.md)] For more information, see [Deploy Bastion as private-only](private-only-deployment.md).

## <a name="session"></a>Session recording

[!INCLUDE [Session recording](../../includes/bastion-session-recording-description.md)] For more information, see [Bastion session recording](session-recording.md).

You enable session recording on the **Configuration** page of your bastion host. Session recording applies to RDP and SSH connections together; you can't enable it for only one protocol. The **Session Recording** setting appears under both **RDP Auditing** and **SSH Auditing**, but it's a single setting that controls recording for both.

To get AI-generated summaries and security findings for recorded RDP sessions, enable [RDP Vision](#vision).

## <a name="command-logging"></a>SSH command logging (Preview)

When you enable **Command Logging** under **SSH Auditing**, Bastion captures all commands run during SSH sessions made through the bastion host. This feature helps with compliance and security auditing. The service writes command logs to the same storage container that's used for session recording. Unlike session recording, which captures the graphical session, command logging produces a text record of the commands that were run. You can review this record after the session ends. SSH command logging requires the Bastion Premium SKU.

Command logging isn't currently available for native client connections.

SSH command logging is required to use [SSH Vision](#vision). For configuration steps, see [Configure RDP/SSH Vision](rdp-ssh-vision.md).

During preview, command logging is available in the same regions as RDP Vision and SSH Vision. For the list of regions, see [RDP Vision and SSH Vision](#vision).

> [!IMPORTANT]
> SSH command logging is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## <a name="vision"></a>RDP Vision and SSH Vision (Preview)

**RDP Vision** and **SSH Vision** use AI to analyze completed Bastion sessions. They summarize what happened during each session and identify activity that might warrant further investigation, so you can focus on the relevant moments instead of reviewing an entire recording or command log.

* **RDP Vision** analyzes the session recording of a completed RDP session and generates security insights and anomaly reports. Each insight includes the time range, severity, category, and confidence level of the activity, and a link that opens the recording at the point where the activity occurred.
* **SSH Vision** analyzes the command log of a completed SSH session to detect suspicious activity or policy violations. Each insight includes the command, a description of what it attempted to do, and its category, severity, and confidence level.

Analysis runs after a session ends. RDP Vision and SSH Vision don't block activity or end sessions while they're in progress. Only sessions recorded after you enable RDP Vision or SSH Vision are analyzed. Use findings to prioritize your investigation, and validate each finding against the original recording or command log. You can't currently customize the behaviors that RDP Vision and SSH Vision detect.

RDP Vision and SSH Vision have the following requirements:

* The bastion host must use the **Premium SKU**.
* For RDP Vision, [session recording](#session) must be enabled. Because session recording isn't available for native client connections, RDP Vision doesn't analyze those sessions.
* For SSH Vision, [command logging](#command-logging) must be enabled. Because command logging isn't available for native client connections, SSH Vision doesn't analyze those sessions.
* Bastion must be able to access the storage container used for session recording, by using a managed identity or a SAS URL.

You can configure RDP Vision, SSH Vision, and command logging by using the following methods:

| Method | Value | Links |
| --- | --- | --- |
| Azure portal | **Configuration** page: **RDP Auditing** > RDP Vision<br>**SSH Auditing** > Command Logging, SSH Vision | [Configure](rdp-ssh-vision.md) |

You can currently configure these features only in the Azure portal. To use RDP Vision and SSH Vision during preview, access the portal at [https://preview.portal.azure.com](https://preview.portal.azure.com).

Billing for RDP Vision and SSH Vision isn't active during the current preview. Standard charges for your Bastion Premium deployment and your storage account still apply. For Bastion pricing, see [Azure Bastion pricing](https://azure.microsoft.com/pricing/details/azure-bastion/).

> [!NOTE]
> During preview, RDP Vision, SSH Vision, and command logging are available in the following regions:
>
> * Central US EUAP
> * East Asia
> * East US 2 EUAP
> * UK South
> * West Central US

> [!IMPORTANT]
> RDP Vision and SSH Vision are currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## <a name="az"></a>Availability zones

[!INCLUDE [Availability Zones description and supported regions](../../includes/bastion-availability-zones-description.md)]

## Next steps

* Learn about [frequently asked questions for Azure Bastion](bastion-faq.md).
* Learn about the different [Azure Bastion SKU tiers](bastion-sku-comparison.md) and choose the right one for your requirements.
* Learn how to [optimize Azure Bastion costs](cost-optimization.md) while maintaining secure remote access.
* Learn how to [add more instances (scale units) to Azure Bastion](configure-host-scaling.md).
* Learn how to [configure RDP Vision and SSH Vision](rdp-ssh-vision.md) to analyze recorded sessions and command logs.
