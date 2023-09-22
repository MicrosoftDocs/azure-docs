---
title: 'Manage secure access to resources in spoke VNets for P2S clients'
titleSuffix: Azure Virtual WAN
description: This article helps you use Azure Virtual WAN and Azure Firewall rules to manage secure access to virtual networks for User VPN (point-to-site) clients.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: how-to
ms.date: 06/16/2022
ms.author: cherylmc

---
# Manage secure access to resources in spoke VNets for User VPN clients

This article shows you how to use Virtual WAN and Azure Firewall rules and filters to manage secure access for connections to your resources in Azure over point-to site IKEv2 or OpenVPN connections. This configuration is helpful if you have remote users for whom you want to restrict access to Azure resources, or to secure your resources in Azure.

The steps in this article help you create the architecture in the following diagram to allow User VPN clients to access a specific resource (VM1) in a spoke VNet connected to the virtual hub, but not other resources (VM2). Use this architecture example as a basic guideline.

:::image type="content" source="./media/manage-secure-access-resources-spoke-p2s/diagram.png" alt-text="Diagram of a Secured virtual hub.":::

## Prerequisites

[!INCLUDE [Prerequisites](../../includes/virtual-wan-before-include.md)]

* You have the values available for the authentication configuration that you want to use. For example, a RADIUS server, Azure Active Directory authentication, or [Generate and export certificates](certificates-point-to-site.md).

## Create a virtual WAN

[!INCLUDE [Create virtual WAN](../../includes/virtual-wan-create-vwan-include.md)]

## <a name= "p2s-config"></a>Define P2S configuration parameters

The point-to-site (P2S) configuration defines the parameters for connecting remote clients. This section helps you define P2S configuration parameters, and then create the configuration that will be used for the VPN client profile. The instructions you follow depend on the authentication method you want to use.

### Authentication methods

When selecting the authentication method, you have three choices. Each method has specific requirements. Select one of the following methods, and then complete the steps.

* **Azure Active Directory authentication:** Obtain the following:

   * The **Application ID** of the Azure VPN Enterprise Application registered in your Azure AD tenant.
   * The **Issuer**. Example: `https://sts.windows.net/your-Directory-ID`.
   * The **Azure AD tenant**. Example: `https://login.microsoftonline.com/your-Directory-ID`.

* **Radius-based authentication:** Obtain the Radius server IP, Radius server secret, and certificate information.

* **Azure certificates:** For this configuration, certificates are required. You need to either generate or obtain certificates. A client certificate is required for each client. Additionally, the root certificate information (public key) needs to be uploaded. For more information about the required certificates, see [Generate and export certificates](certificates-point-to-site.md).

[!INCLUDE [Define parameters](../../includes/virtual-wan-p2s-configuration-include.md)]

## <a name="hub"></a>Create the hub and gateway

In this section, you create the virtual hub with a point-to-site gateway. When configuring, you can use the following example values:

* **Hub private IP address space:** 10.1.0.0/16
* **Client address pool:** 10.5.0.0/16
* **Custom DNS Servers:** You can list up to 5 DNS Servers

### Basics page

[!INCLUDE [Create hub basics page](../../includes/virtual-wan-hub-basics.md)]

### Point to site page

[!INCLUDE [Point to site page](../../includes/virtual-wan-p2s-gateway-include.md)]

## <a name="generate"></a>Generate VPN client configuration files

In this section, you generate and download the configuration profile files. These files are used to configure the native VPN client on the client computer. 

[!INCLUDE [Download profile](../../includes/virtual-wan-p2s-download-profile-include.md)]

## <a name="clients"></a>Configure VPN clients

Use the downloaded profile to configure the remote access clients. The procedure for each operating system is different, follow the instructions that apply to your system.

[!INCLUDE [Configure clients](../../includes/virtual-wan-p2s-configure-clients-include.md)]

## <a name="connect-spoke"></a>Connect the spoke VNet

In this section, you create a connection between your hub and the spoke VNet.

[!INCLUDE [Connect spoke virtual network](../../includes/virtual-wan-connect-vnet-hub-include.md)]

## <a name="create-vm"></a>Create virtual machines

In this section, you create two VMs in your VNet, VM1 and VM2. In the network diagram, we use 10.18.0.4 and 10.18.0.5. When configuring your VMs, make sure to select the virtual network that you created (found on the Networking tab). For steps to create a VM, see [Quickstart: Create a VM](../virtual-machines/windows/quick-create-portal.md).

## <a name="secure"></a>Secure the virtual hub

A standard virtual hub has no built-in security policies to protect the resources in spoke virtual networks. A secured virtual hub uses Azure Firewall or a third-party provider to manage incoming and outgoing traffic to protect your resources in Azure.

Convert the hub to a secured hub using the following article: [Configure Azure Firewall in a Virtual WAN hub](howto-firewall.md).

## <a name= "create-rules"></a> Create rules to manage and filter traffic

Create rules that dictate the behavior of Azure Firewall. By securing the hub, we ensure that all packets that enter the virtual hub are subject to firewall processing before accessing your Azure resources.

Once you complete these steps, you will have created an architecture that allows VPN users to access the VM with private IP address 10.18.0.4, but **NOT** access the VM with private IP address 10.18.0.5

1. In the Azure portal, navigate to **Firewall Manager**.
1. Under Security, select **Azure Firewall policies**.
1. Select **Create Azure Firewall Policy**.
1. Under **Policy details**, type in a name and select the region your virtual hub is deployed in.
1. Select **Next: DNS Settings**.
1. Select **Next: Rules**.
1. On the **Rules** tab, select **Add a rule collection**.
1. Provide a name for the collection. Set the type as **Network**. Add a priority value **100**.
1. Fill in the name of the rule, source type, source, protocol, destination ports, and destination type, as shown in the example below. Then, select **add**. This rule allows any IP address from the VPN client pool to access the VM with private IP address 10.18.04, but not any other resource connected to the virtual hub. Create any rules you want that fit your desired architecture and permissions rules.

   :::image type="content" source="./media/manage-secure-access-resources-spoke-p2s/rules.png" alt-text="Firewall rules" :::

1. Select **Next: Threat intelligence**.
1. Select **Next: Hubs**.
1. On the **Hubs** tab, select **Associate virtual hubs**.
1. Select the virtual hub you created earlier, and then select **Add**.
1. Select **Review + create**.
1. Select **Create**.

It can take 5 minutes or more for this process to complete.

## <a name="send"></a>Route traffic through Azure Firewall

In this section, you need to ensure that the traffic is routed through Azure Firewall.

1. In the portal, from **Firewall Manager**, select **Secured virtual hubs**.
1. Select the virtual hub you created.
1. Under **Settings**, select **Security configuration**.
1. Under **Private traffic**, select **Send via Azure Firewall**.
1. Verify that the VNet connection and the Branch connection private traffic is secured by Azure Firewall.
1. Select **Save**.

> [!NOTE]
> If you want to inspect traffic destined to private endpoints using Azure Firewall in a secured virtual hub, see [Secure traffic destined to private endpoints in Azure Virtual WAN](../firewall-manager/private-link-inspection-secure-virtual-hub.md).
You need to add /32 prefix for each private endpoint in the **Private traffic prefixes** under Security configuration of your Azure Firewall manager for them to be inspected via Azure Firewall in secured virtual hub. If these /32 prefixes are not configured, traffic destined to private endpoints will bypass Azure Firewall.

## <a name="validate"></a>Validate

Verify the setup of your secured hub.

1. Connect to the **Secured Virtual Hub** via VPN from your client device.
1. Ping the IP address **10.18.0.4** from your client. You should see a response.
1. Ping the IP address **10.18.0.5** from your client. You shouldn't be able to see a response.

### Considerations

* Make sure that the **Effective Routes Table** on the secured virtual hub has the next hop for private traffic by the firewall. To access the Effective Routes Table, navigate to your **Virtual Hub** resource. Under **Connectivity**, select **Routing**, and then select **Effective Routes**. From there, select the **Default** Route table.
* Verify that you created rules in the [Create Rules](#create-rules) section. If these steps are missed, the rules you created won't actually be associated to the hub and the route table and packet flow won't use Azure Firewall.

## Next steps

* For more information about Virtual WAN, see the [Virtual WAN FAQ](virtual-wan-faq.md).
* For more information about Azure Firewall, see the [Azure Firewall FAQ](../firewall/firewall-faq.yml).
