---
title: Deploy an Azure Firewall Manager security partner provider
description: Learn how to deploy an Azure Firewall Manager security partner provider using the Azure portal. 
services: firewall-manager
author: vhorne
ms.service: firewall-manager
ms.topic: how-to
ms.date: 09/28/2023
ms.author: victorh
---

# Deploy a security partner provider

*Security partner providers* in Azure Firewall Manager allow you to use your familiar, best-in-breed third-party security-as-a-service (SECaaS) offerings to protect Internet access for your users.

To learn more about supported scenarios and best practice guidelines, see [What are security partner providers?](trusted-security-partners.md)


Integrated third-party Security as a service (SECaaS) partners are now available: 

- **Zscaler**
- **[Check Point](check-point-overview.md)**
- **iboss**

## Deploy a third-party security provider in a new hub

Skip this section if you're deploying a third-party provider into an existing hub.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In **Search**, type **Firewall Manager** and select it under **Services**.
3. Navigate to **Overview**. Select **View secured virtual hubs**.
4. Select **Create new secured virtual hub**.
5. Enter your subscription and resource group, select a supported region, and add your hub and virtual WAN information. 
6. Select **Include VPN gateway to enable Security Partner Providers**.
7. Select the **Gateway scale units** appropriate for your requirements.
8. Select **Next: Azure Firewall**
   > [!NOTE]
   > Security partner providers connect to your hub using VPN Gateway tunnels. If you delete the VPN Gateway, the connections to your security partner providers are lost.
9. If you want to deploy Azure Firewall to filter private traffic along with third-party service provider to  filter Internet traffic, select a policy for Azure Firewall. See the [supported scenarios](trusted-security-partners.md#key-scenarios).
10. If you want to only deploy a third-party security provider in the hub, select **Azure Firewall: Enabled/Disabled** to set it to **Disabled**. 
11. Select  **Next: Security Partner Provider**.
12. Set **Security Partner Provider** to **Enabled**. 
13. Select a partner. 
14. Select **Next: Review + create**. 
15. Review the content and then select **Create**.

The VPN gateway deployment can take more than 30 minutes.

To verify that the hub has been created, navigate to Azure Firewall Manager->Overview->View secured virtual hubs. You see the security partner provider name and the security partner status as **Security Connection Pending**.

Once the hub is created and the security partner is set up, continue on to connect the security provider to the hub.

## Deploy a third-party security provider in an existing hub

You can also select an existing hub in a Virtual WAN and convert that to a *secured virtual hub*.

1. In **Getting Started**, **Overview**, select **View secured virtual hubs**.
2. Select **Convert existing hubs**.
3. Select a subscription and an existing hub. Follow rest of the steps to deploy a third-party provider in a new hub.

Remember that a VPN gateway must be deployed to convert an existing hub to secured hub with third-party providers.

## Configure third-party security providers to connect to a secured hub

To set up tunnels to your virtual hub’s VPN Gateway, third-party providers need access rights to your hub. To do this, associate a service principal with your subscription or resource group, and grant access rights. You then must give these credentials to the third party using their portal.

> [!NOTE]
> Third-party security providers create a VPN site on your behalf. This VPN site does not appear in the Azure portal.

### Create and authorize a service principal

1. Create Microsoft Entra service principal: You can skip the redirect URL. 

   [How to: Use the portal to create a Microsoft Entra application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal)
2. Add access rights and scope for the service principal.
   [How to: Use the portal to create a Microsoft Entra application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal)

   > [!NOTE]
   > You can limit access to only your resource group for more granular control.

### Visit partner portal

1. Follow your partner provided instructions to complete the setup. This includes submitting Microsoft Entra information to detect and connect to the hub, update the egress policies, and check connectivity status and logs.

   - [Zscaler: Configure Microsoft Azure Virtual WAN integration](https://help.zscaler.com/zia/configuring-microsoft-azure-virtual-wan-integration).
   - [Check Point: Configure Microsoft Azure Virtual WAN integration](https://www.checkpoint.com/cloudguard/microsoft-azure-security/wan).
   - [iboss: Configure Microsoft Azure Virtual WAN integration](https://www.iboss.com/blog/securing-microsoft-azure-with-iboss-saas-network-security). 
   
2. You can look at the tunnel creation status on the Azure Virtual WAN portal in Azure. Once the tunnels show **connected** on both Azure and the partner portal, continue with the next steps to set up routes to select which branches and VNets should send Internet traffic to the partner.

## Configure security with Firewall Manager

1. Browse to the Azure Firewall Manager -> Secured Hubs. 
2. Select a hub. The hub status should now show **Provisioned** instead of **Security Connection Pending**.

   Ensure the third-party provider can connect to the hub. The tunnels on the VPN gateway should be in a **Connected** state. This state is more reflective of the connection health between the hub and the third-party partner, compared to previous status.
3. Select the hub, and navigate to **Security Configurations**.

   When you deploy a third-party provider into the hub, it converts the hub into a *secured virtual hub*. This ensures that the third-party provider is advertising a 0.0.0.0/0 (default) route to the hub. However, virtual network connections and sites connected to the hub don’t get this route unless you opt-in on which connections should get this default route.

   > [!NOTE]
   > Do not manually create a 0.0.0.0/0 (default) route over BGP for branch advertisements. This is automatically done for secure virtual hub deployments with 3rd party security providers. Doing so may break the deployment process.

4. Configure virtual WAN security by setting **Internet Traffic** via Azure Firewall and **Private Traffic** via a trusted security partner. This automatically secures individual connections in the Virtual WAN.

   :::image type="content" source="media/deploy-trusted-security-partner/security-configuration.png" alt-text="Security configuration":::
5. Additionally, if your organization uses public IP ranges in virtual networks and branch offices, you need to specify those IP prefixes explicitly using **Private Traffic Prefixes**. The public IP address prefixes can be specified individually or as aggregates.

   If you use non-RFC1918 addresses for your private traffic prefixes, you may need to configure SNAT policies for your firewall to disable SNAT for non-RFC1918 private traffic. By default, Azure Firewall SNATs all non-RFC1918 traffic.

## Branch or virtual network Internet traffic via third-party service

Next, you can check if virtual network virtual machines or the branch site can access the Internet and validate that the traffic is flowing to the third-party service.

After you finish the route setting steps, the virtual network virtual machines and the branch sites are sent a 0/0 to the third-party service route. You can't RDP or SSH into these virtual machines. To sign in, you can deploy the [Azure Bastion](../bastion/bastion-overview.md) service in a peered virtual network.

## Rule configuration

Use the partner portal to configure firewall rules. Azure Firewall passes the traffic through.

For example, you may observe allowed traffic through the Azure Firewall, even though there's no explicit rule to allow the traffic. This is because Azure Firewall passes the traffic to the next hop security partner provider (ZScalar, CheckPoint, or iBoss). Azure Firewall still has rules to allow outbound traffic, but the rule name isn't logged.

For more information, see the partner documentation.

## Next steps

- [Tutorial: Secure your cloud network with Azure Firewall Manager using the Azure portal](secure-cloud-network.md)
