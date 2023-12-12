---
title: How to flush DNS settings changes in Azure Spring Apps
titleSuffix: Azure Spring Apps
description: How to update DNS settings in a virtual network injected Azure Spring Apps service.
author: 
ms.author: hanliren
ms.service: spring-apps
ms.topic: how-to
ms.date: 12/12/2023
ms.custom: devx-track-java, devx-track-extended-java, event-tier1-build-2022, devx-track-azurecli
---
# Flush DNS settings changes in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic ✔️ Standard ✔️ Enterprise

> [!NOTE]
> This feature is only available for virtual network injected Azure Spring Apps service.

This article explains how to update in DNS settings in a virtual network injected Azure Spring Apps service.

When you are making changes to the custom DNS servers in the virtual network settings, for the update in DNS settings to take effect, it's required to restart network service in all the underlying nodes to load the new settings.  Before, you had to reboot the whole Azure Spring Apps instance to apply any changes to the DNS settings. This was a heavy and time-consuming operation. Now, with the new flush DNS settings feature, you can update the DNS settings in an Azure Spring Apps instance with a simple and fast action.

## Prerequisites
- An Azure subscription. If you don't have a subscription, create a free account before you begin.
- (Optional) Azure CLI version 2.52.0 or higher. Use the following command to remove previous versions and install the latest extension. If you previously installed the spring-cloud extension, uninstall it to avoid configuration and version mismatches.

  ```
	az extension remove --name spring
	az extension add --name spring
	az extension remove --name spring-cloud
	```
  
- An application deployed to Azure Spring Apps with virtual networking injection enabled.
- Configured Customer DNS server in the virtual network setting.

## Flush the DNS settings for an existing Azure Spring Apps

### [Azure portal](#tab/azure-portal)
Click "Flush DNS Setting (Preview)" button on the Azure Spring Apps service overview page.

:::image type="content" source="./media/how-to-flush-dns-settings/flush-dns-settings.png" alt-text="Screenshot of flush dns settings." lightbox="./media/how-to-flush-dns-settings/flush-dns-settings.png":::

### [Azure CLI](#tab/azure-cli)

Use the following command to flush the DNS settings for an existing Azure Spring Apps instance.

```
az spring flush-virtualnetwork-dns-settings \
            --resource-group <resource-group-name> \
            --name <service-name> 
```

---

## Troubleshooting checklist

1. Troubleshoot "failed to connect DNS server, connection timed out." issue.

   Check whether a network routing rule or a firewall is blocking traffic from your service runtime or app subnets to your customer DNS server IP on port 53 or your customized DNS server listening port.
	
3. Troubleshoot "failed to resolve IP" issue.

   Check the upstream DNS server is correctly configured in your DNS server. We suggest to add Azure DNS IP 168.63.129.16 as the upstream DNS server in your custom DNS server. If you cannot use Azure DNS as the upstream server, please use other proper upstream server to make sure all the domains mentioned in [Customer responsibilities running Azure Spring Apps in a virtual network](https://learn.microsoft.com/en-us/azure/spring-apps/vnet-customer-responsibilities) can be resolved.
	
5. Troubleshoot "Not all the VM instances in the cluster are in succeeded running state." issue.

   This error usually indicates there are some wrong DNS or other networking settings blocked the underlying nodes provision.  Please follow the guides in [Customer responsibilities running Azure Spring Apps in a virtual network](https://learn.microsoft.com/en-us/azure/spring-apps/vnet-customer-responsibilities) and [Troubleshooting Azure Spring Apps in virtual network](https://learn.microsoft.com/en-us/azure/spring-apps/troubleshooting-vnet) to fix the networking related settings and try to restart the Azure Spring Apps service instance to mitigate the issue.



