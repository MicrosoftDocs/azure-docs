---
title: Troubleshoot outbound connectivity with Azure services
titleSuffix: Azure Virtual Network
description: Troubleshoot issues with NAT gateway and Azure services.
author: asudbring
ms.service: nat-gateway
ms.topic: troubleshooting
ms.date: 08/29/2022
ms.author: allensu
---

# Troubleshoot outbound connectivity with NAT gateway and Azure services 

This article provides guidance on how to troubleshoot connectivity issues when using NAT gateway with other Azure services, including:

* [Azure App Services](#azure-app-services)

* [Azure Kubernetes Service](#azure-kubernetes-service) 

* [Azure Firewall](#azure-firewall)

* [Azure Databricks](#azure-databricks)

## Azure App Services 

### Azure App Services regional Virtual network integration turned off 

NAT gateway can be used with Azure app services to allow applications to make outbound calls from a virtual network. To use this integration between Azure app services and NAT gateway, regional virtual network integration must be enabled. See [how regional virtual network integration works](../app-service/overview-vnet-integration.md#how-regional-virtual-network-integration-works) to learn more.  

To use NAT gateway with Azure App services, follow these steps:  

1. Ensure that your application(s) have virtual network integration configured, see [Enable virtual network integration](../app-service/configure-vnet-integration-enable.md).  

2. Ensure that **Route All** is enabled for your virtual network integration, see [Configure virtual network integration routing](../app-service/configure-vnet-integration-routing.md). 

3. Create a NAT gateway resource.  

4. Create a new public IP address or attach an existing public IP address in your network to NAT gateway. 

5. Assign NAT gateway to the same subnet being used for Virtual network integration with your application(s).  

To see step-by-step instructions on how to configure NAT gateway with virtual network integration, see [Configuring NAT gateway integration](../app-service/networking/nat-gateway-integration.md#configure-nat-gateway-integration) 

Important notes about the NAT gateway and Azure App Services integration:  

* Virtual network integration doesn't provide inbound private access to your app from the virtual network.  

* Because of the nature of how virtual network integration operates, the traffic from virtual network integration doesn't show up in Azure Network Watcher or NSG flow logs. 

### App services isn't using the NAT gateway public IP address to connect outbound 

App services can still connect outbound to the internet even if VNet integration isn't enabled. By default, apps that are hosted in App Service are accessible directly through the internet and can reach only internet-hosted endpoints. To learn more, see [App Services Networking Features](/azure/app-service/networking-features). 

If you notice that the IP address used to connect outbound isn't your NAT gateway public IP address or addresses, check that virtual network integration has been enabled. Ensure the NAT gateway is configured to the subnet used for integration with your application(s). 

To validate that web applications are using the NAT gateway public IP, ping a virtual machine on your Web Apps and check the traffic via a network capture.  

## Azure Kubernetes Service

### How to deploy NAT gateway with AKS clusters 

NAT gateway can be deployed with AKS clusters in order to allow for explicit outbound connectivity. There are two different ways to deploy NAT gateway with AKS clusters: 

1. **Managed NAT gateway**: NAT gateway is provisioned by Azure at the time of the AKS cluster creation and managed by AKS. 

2. **User-Assigned NAT gateway**: NAT gateway is provisioned by you to an existing virtual network for the AKS cluster. 

Learn more at [Managed NAT Gateway](../aks/nat-gateway.md).

### Can't update my NAT gateway IPs or idle timeout timer for an AKS cluster 

Public IP addresses and the idle timeout timer for NAT gateway can be updated with the az aks update command for a Managed NAT gateway ONLY.  

If you've provisioned a User-Assigned NAT gateway to your AKS subnets, then you can't use the az aks update command to update public IP addresses or the idle timeout timer. A User-Assigned NAT gateway is managed by the user rather than by AKS. You'll need to update these configurations manually on your NAT gateway resource.  

Update your public IP addresses on your User-Assigned NAT gateway with the following steps: 

1. In your resource group, select on your NAT gateway resource in the portal 

2. Under Settings on the left-hand navigation bar, select Outbound IP 

3. To manage your Public IP addresses, select the blue Change  

4. From the Manage public IP addresses and prefixes configuration that slides in from the right, update your assigned public IPs from the drop-down menu or select **Create a new public IP address**.

5. Once you're done updating your IP configurations, select the OK button at the bottom of the screen.

6. After the configuration page disappears, select the Save button to save your changes 

7. Use steps 3 - 6 to do the same for public IP prefixes. 

Update your idle timeout timer configuration on your User-Assigned NAT gateway with the following steps: 

1. In your resource group, select on your NAT gateway resource in the portal 

2. Under Settings on the left-hand navigation bar, select Configuration 

3. In the TCP idle timeout (minutes) text bar, adjust the idle timeout timer (the timer can be configured 4 – 120 minutes). 

4. Select the Save button when you’re done. 

>[!Note] 
>Increasing the TCP idle timeout timer to longer than 4 minutes can increase the risk of SNAT port exhaustion.

## Azure Firewall 

### SNAT exhaustion when connecting outbound with Azure Firewall

Azure Firewall can provide outbound connectivity to the internet from virtual networks. Azure Firewall provides only 2,496 SNAT ports per public IP address. While Azure Firewall can be associated with up to 250 public IP addresses to handle egress traffic, users may require much fewer public IP addresses for connecting outbound. The requirement for egressing with fewer public IP addresses may be due to various architectural requirements and allowlist limitations by destination endpoints.

One method by which to provide greater scalability for outbound traffic and also reduce the risk of SNAT port exhaustion is to use NAT gateway in the same subnet with Azure Firewall. To set up NAT gateway in an Azure Firewall subnet, see [integrate NAT gateway with Azure Firewall](/azure/virtual-network/nat-gateway/tutorial-hub-spoke-nat-firewall). See [Scale SNAT ports with Azure NAT Gateway](../firewall/integrate-with-nat-gateway.md) to learn more about how NAT gateway works with Firewall.

> [!NOTE]
> NAT gateway is not supported in a vWAN architecture. NAT gateway cannot be configured to an Azure Firewall subnet in a vWAN hub.

## Azure Databricks

### How to use NAT gateway to connect outbound from a databricks cluster 

NAT gateway can be used to connect outbound from your databricks cluster when you create your Databricks workspace. NAT gateway can be deployed to your databricks cluster in one of two ways: 

1. By enabling [Secure Cluster Connectivity (No Public IP)](/azure/databricks/security/secure-cluster-connectivity#use-secure-cluster-connectivity) on the default virtual network that Azure Databricks creates, NAT gateway will automatically be deployed for connecting outbound from your workspace’s subnets to the internet. This NAT gateway resource is created within the managed resource group managed by Azure Databricks. You can't modify this resource group or any other resources provisioned in it. 

2. After deploying Azure Databricks workspace in your own VNet (via [VNet injection](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject)), you can deploy and configure NAT gateway to both of your workspace’s subnets to ensure outbound connectivity through the NAT gateway. You can implement this solution using an [Azure template](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject#advanced-configuration-using-azure-resource-manager-templates) or in the portal. 

## Next steps

We're always looking to improve the experience of our customers. If you're experiencing issues with NAT gateway that aren't listed or resolved by this article, submit feedback through GitHub via the bottom of this page. We'll address your feedback as soon as possible.

To learn more about NAT gateway, see: 

* [Azure NAT Gateway](./nat-overview.md) 

* [NAT gateway resource](./nat-gateway-resource.md) 

* [Metrics and alerts for NAT gateway resources](./nat-metrics.md)
