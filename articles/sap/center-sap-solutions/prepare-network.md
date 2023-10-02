---
title: Prepare network for infrastructure deployment 
description: Learn how to prepare a network for use with an S/4HANA infrastructure deployment with Azure Center for SAP solutions through the Azure portal.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 10/19/2022
author: sagarkeswani
ms.author: sagarkeswani
#Customer intent: As a developer, I want to create a virtual network so that I can deploy S/4HANA infrastructure in Azure Center for SAP solutions.
---

# Prepare network for infrastructure deployment 



In this how-to guide, you'll learn how to prepare a virtual network to deploy S/4 HANA infrastructure using *Azure Center for SAP solutions*. This article provides general guidance about creating a virtual network. Your individual environment and use case will determine how you need to configure your own network settings for use with a *Virtual Instance for SAP (VIS)* resource.

If you have an existing network that you're ready to use with Azure Center for SAP solutions, [go to the deployment guide](deploy-s4hana.md) instead of following this guide.

## Prerequisites

- An Azure subscription.
- [Review the quotas for your Azure subscription](../../quotas/view-quotas.md). If the quotas are low, you might need to create a support request before creating your infrastructure deployment. Otherwise, you might experience deployment failures or an **Insufficient quota** error.
- It's recommended to have multiple IP addresses in the subnet or subnets before you begin deployment. For example, it's always better to have a `/26` mask instead of `/29`. 
- The names including AzureFirewallSubnet, AzureFirewallManagementSubnet, AzureBastionSubnet and GatewaySubnet are reserved names within Azure. Please do not use these as the subnet names.
- Note the SAP Application Performance Standard (SAPS) and database memory size that you need to allow Azure Center for SAP solutions to size your SAP system. If you're not sure, you can also select the VMs. There are:
    - A single or cluster of ASCS VMs, which make up a single ASCS instance in the VIS.
    - A single or cluster of Database VMs, which make up a single Database instance in the VIS.
    - A single Application Server VM, which makes up a single Application instance in the VIS. Depending on the number of Application Servers being deployed or registered, there can be multiple application instances.

## Create network

You must create a network for the infrastructure deployment on Azure. Make sure to create the network in the same region that you want to deploy the SAP system. 

Some of the required network components are:

- A virtual network
- Subnets for the Application Servers and Database Servers. Your configuration needs to allow communication between these subnets.
- Azure network security groups
- Route tables
- Firewalls (or NAT Gateway)

For more information, see the [example network configuration](#example-network-configuration).

## Connect network

At a minimum, the network needs to have outbound internet connectivity for successful infrastructure deployment and software installation. The application and database subnets also need to be able to communicate with each other.

If internet connectivity isn't possible, allowlist the IP addresses for the following areas:

- [SUSE or Red Hat endpoints](#allowlist-suse-or-red-hat-endpoints)
- [Azure Storage accounts](#allowlist-storage-accounts)
- [Allowlist Azure Key Vault](#allowlist-key-vault)
- [Allowlist Azure Active Directory (Azure AD)](#allowlist-azure-ad)
- [Allowlist Azure Resource Manager](#allowlist-azure-resource-manager)

Then, make sure all resources within the virtual network can connect to each other. For example, [configure a network security group](../../virtual-network/manage-network-security-group.md#work-with-network-security-groups) to allow resources within the virtual network to communicate by listening on all ports.

- Set the **Source port ranges** to **\***.
- Set the **Destination port ranges** to **\***.
- Set the **Action** to **Allow**

If it's not possible to allow the resources within the virtual network to connect to each other, allow connections between the application and database subnets, and [open important SAP ports in the virtual network](#open-important-sap-ports) instead.

### Allowlist SUSE or Red Hat endpoints

If you're using SUSE for the VMs, [allowlist the SUSE endpoints](https://www.suse.com/c/azure-public-cloud-update-infrastructure-101/). For example:

1. Create a VM with any OS [using the Azure portal](../../virtual-machines/linux/quick-create-portal.md) or [using Azure Cloud Shell](../../cloud-shell/overview.md). Or, install *openSUSE Leap* from the Microsoft Store and enable WSL.
1. Install *pip3* by running `zypper install python3-pip`.
1. Install the *pip* package *susepubliccloudinfo* by running `pip3 install susepubliccloudinfo`.
1. Get a list of IP addresses to configure in the network and firewall by running `pint microsoft servers --json --region` with the appropriate Azure region parameter.
1. Allowlist all these IP addresses on the firewall or network security group where you're planning to attach the subnets.

If you're using Red Hat for the VMs, [allowlist the Red Hat endpoints](../../virtual-machines/workloads/redhat/redhat-rhui.md#the-ips-for-the-rhui-content-delivery-servers) as needed. The default allowlist is the Azure Global IP addresses. Depending on your use case, you might also need to allowlist Azure US Government or Azure Germany IP addresses. Configure all IP addresses from your list on the firewall or the network security group where you want to attach the subnets.

### Allowlist storage accounts

Azure Center for SAP solutions needs access to the following storage accounts to install SAP software correctly:

- The storage account where you're storing the SAP media that is required during software installation.
- The storage account created by Azure Center for SAP solutions in a managed resource group, which Azure Center for SAP solutions also owns and manages.

There are multiple options to allow access to these storage accounts:

- Allow internet connectivity
- Configure a [**Storage** service tag](../../virtual-network/service-tags-overview.md#available-service-tags)
- Configure [**Storage** service tags](../../virtual-network/service-tags-overview.md#available-service-tags) with regional scope. Make sure to configure tags for the Azure region where you're deploying the infrastructure, and where the storage account with the SAP media exists.
- Allowlist the regional [Azure IP ranges](https://www.microsoft.com/en-us/download/details.aspx?id=56519).

### Allowlist Key Vault

Azure Center for SAP solutions creates a key vault to store and access the secret keys during software installation. This key vault also stores the SAP system password. To allow access to this key vault, you can:

- Allow internet connectivity
- Configure a [**AzureKeyVault** service tag](../../virtual-network/service-tags-overview.md#available-service-tags)
- Configure an [**AzureKeyVault** service tag](../../virtual-network/service-tags-overview.md#available-service-tags) with regional scope. Make sure to configure the tag in the region where you're deploying the infrastructure.

### Allowlist Azure AD

Azure Center for SAP solutions uses Azure AD to get the authentication token for obtaining secrets from a managed key vault during SAP installation. To allow access to Azure AD, you can:

- Allow internet connectivity
- Configure an [**AzureActiveDirectory** service tag](../../virtual-network/service-tags-overview.md#available-service-tags).

### Allowlist Azure Resource Manager

Azure Center for SAP solutions uses a managed identity for software installation. Managed identity authentication requires a call to the Azure Resource Manager endpoint. To allow access to this endpoint, you can:

- Allow internet connectivity
- Configure an [**AzureResourceManager** service tag](../../virtual-network/service-tags-overview.md#available-service-tags).

### Open important SAP ports

If you're unable to [allow connection between all resources in the virtual network](#connect-network) as previously described, you can open important SAP ports in the virtual network instead. This method allows resources within the virtual network to listen on these ports for communication purposes. If you're using more than one subnet, these settings also allow connectivity within the subnets.

Open the SAP ports listed in the following table. Replace the placeholder values (`xx`) in applicable ports with your SAP instance number. For example, if your SAP instance number is `01`, then `32xx` becomes `3201`.

| SAP service | Port range | Allow incoming traffic | Allow outgoing traffic | Purpose |
| ---------------- | ---------- | ---------------------- | ---------------------- | ----------- |
| Host Agent | 1128, 1129 | Yes | Yes | HTTP/S port for the SAP host agent. |
| Web Dispatcher | 32xx | Yes | Yes | SAPGUI and RFC communication. |
| Gateway | 33xx | Yes | Yes | RFC communication. |
| Gateway (secured) | 48xx | Yes | Yes | RFC communication. |
| Internet Communication Manager (ICM) | 80xx, 443xx | Yes | Yes | HTTP/S communication for SAP Fiori, WEB GUI |
| Message server | 36xx, 81xx, 444xx | Yes | No | Load balancing; ASCS to app servers communication; GUI sign-in; HTTP/S traffic to and from message server. |
| Control agent | 5xx13, 5xx14 | Yes | No | Stop, start, and get status of SAP system. |
| SAP installation | 4237 | Yes | No | Initial SAP installation. |
| HTTP and HTTPS | 5xx00, 5xx01 | Yes | Yes | HTTP/S server port. |
| IIOP | 5xx02, 5xx03, 5xx07 | Yes | Yes | Service request port. |
| P4 | 5xx04-6 | Yes | Yes | Service request port. |
| Telnet | 5xx08 | Yes | No | Service port for management. |
| SQL communication | 3xx13, 3xx15, 3xx40-98 | Yes | No | Database communication port with application, including ABAP or JAVA subnet. |
| SQL server | 1433 | Yes | No | Default port for MS-SQL in SAP; required for ABAP or JAVA database communication. |
| HANA XS engine | 43xx, 80xx | Yes | Yes | HTTP/S request port for web content. |

## Example network configuration

The configuration process for an example network might include:

1. Create a virtual network, or use an existing virtual network.

1. Create the following subnets inside the virtual network:

    1. An application tier subnet.

    1. A database tier subnet.

    1. A subnet for use with the firewall, named **Azure FirewallSubnet**.

1. Create a new firewall resource:

    1. Attach the firewall to the virtual network.

    1. Create a rule to allowlist RHEL or SUSE endpoints. Make sure to allow all source IP addresses (`*`), set the source port to **Any**, allow the destination IP addresses for RHEL or SUSE, and set the destination port to **Any**.

    1. Create a rule to allow service tags. Make sure to allow all source IP addresses (`*`), set the destination type to **Service tag**. Then, allow the tags **Microsoft.Storage**, **Microsoft.KeyVault**, **AzureResourceManager** and **Microsoft.AzureActiveDirectory**.

1. Create a route table resource:

    1. Add a new route of the type **Virtual Appliance**. 

    1. Set the IP address to the firewall's IP address, which you can find on the overview of the firewall resource in the Azure portal.

1. Update the subnets for the application and database tiers to use the new route table.

1. If you're using a network security group with the virtual network, add the following inbound rule. This rule provides connectivity between the subnets for the application and database tiers.

    | Priority | Port | Protocol | Source | Destination | Action |
    | -------- | ---- | -------- | ------ | ----------- | ------ |
    | 100 | Any | Any | virtual network | virtual network | Allow |

1. If you're using a network security group instead of a firewall, add outbound rules to allow installation.

    | Priority | Port | Protocol | Source | Destination | Action |
    | -------- | ---- | -------- | ------ | ----------- | ------ |
    | 110 | Any | Any | Any | SUSE or Red Hat endpoints | Allow |
    | 115 | Any | Any | Any | Azure Resource Manager  | Allow |
    | 116 | Any | Any | Any | Azure AD | Allow |
    | 117 | Any | Any | Any | Storage accounts | Allow |
    | 118 | 8080 | Any | Any | Key vault | Allow |
    | 119 | Any | Any | Any | virtual network | Allow |
    
## Next steps

- [Deploy S/4HANA infrastructure](deploy-s4hana.md)
