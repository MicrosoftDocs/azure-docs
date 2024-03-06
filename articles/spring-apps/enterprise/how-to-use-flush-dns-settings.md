---
title: How to flush DNS settings changes in Azure Spring Apps
titleSuffix: Azure Spring Apps
description: How to update DNS settings in a virtual-network-injected Azure Spring Apps service.
author: KarlErickson
ms.author: hanren
ms.service: spring-apps
ms.topic: how-to
ms.date: 01/22/2024
ms.custom: devx-track-java, devx-track-extended-java
---

# Flush DNS settings changes in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic ✔️ Standard ✔️ Enterprise

> [!NOTE]
> This feature is only available for virtual-network-injected Azure Spring Apps service instances.

This article explains how to update your DNS settings in a virtual-network-injected Azure Spring Apps service instance.

Changes to the custom DNS servers in the virtual network settings won't take effect until the network service is restarted in all the underlying nodes. This restart is required so that the nodes can load the new settings. Previously, you had to reboot the whole Azure Spring Apps instance to apply any changes to the DNS settings. With the new *flush DNS settings* feature, you can avoid this time-consuming operation.

Flushing the DNS settings doesn't restart any underlying nodes or running applications within your service instance, but it does restart the network infrastructure to load the DNS setting changes. This restart can interrupt the network services and affect application availability for a few seconds.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create an [Azure free account](https://azure.microsoft.com/free/) before you begin.
- (Optional) [Azure CLI](/cli/azure/install-azure-cli) version 2.52.0 or higher. Use the following commands to remove the previous version and install the latest extension. If you previously installed the Spring Cloud extension, uninstall it before you begin.

   ```azurecli
   az extension remove --name spring
   az extension add --name spring
   az extension remove --name spring-cloud
   ```
  
- An application deployed to Azure Spring Apps with virtual network injection enabled.
- A configured custom DNS server in the virtual network setting.

## Flush the DNS settings for an existing Azure Spring Apps instance

### [Azure portal](#tab/azure-portal)

Use the following steps to flush the DNS settings for an existing Azure Spring Apps instance:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. On the Navigation menu, select **Overview**.

1. Select **Flush DNS settings (preview)**.

:::image type="content" source="./media/how-to-use-flush-dns-settings/flush-dns-settings.png" alt-text="Screenshot of the Azure portal that shows the Overview page with the Flush DNS settings (preview) option highlighted." lightbox="./media/how-to-use-flush-dns-settings/flush-dns-settings.png":::

### [Azure CLI](#tab/azure-cli)

Use the following command to flush the DNS settings for an existing Azure Spring Apps instance:

```azurecli
az spring flush-virtualnetwork-dns-settings \
    --resource-group <resource-group-name> \
    --name <service-name> 
```

---

## Troubleshoot known issues

The following list describes some errors you might encounter when connecting to your DNS server:

- Error: `Failed to connect DNS server, connection timed out.`

  If you get this error, check whether a network routing rule, or a firewall is blocking traffic from your service runtime or app subnets to your custom DNS server IP on port 53 or your custom DNS server listening port.

- Error: `Failed to resolve IP.`

  If you get this error, check whether the upstream DNS server is correctly configured in your DNS server. To solve this issue, add Azure DNS IP `168.63.129.16` as the upstream DNS server in your custom DNS server. If you can't use Azure DNS as the upstream server, use other valid upstream servers to ensure that all required domains can be resolved. For more information, see [Customer responsibilities for running Azure Spring Apps in a virtual network](vnet-customer-responsibilities.md).

- Error: `Not all the VM instances in the cluster are in succeeded running state.`

  This error usually indicates that there are some incorrect DNS or other networking settings blocking the underlying nodes provisioning. To mitigate this issue, fix the networking settings and restart the Azure Spring Apps service instance. For more information, see [Customer responsibilities for running Azure Spring Apps in a virtual network](vnet-customer-responsibilities.md) and [Troubleshooting Azure Spring Apps in virtual networks](troubleshooting-vnet.md).

## Next steps

- [Map an existing custom domain to Azure Spring Apps](how-to-custom-domain.md)
- [Map DNS names to applications in multiple Azure Spring Apps service instances in the same virtual network](how-to-map-dns-virtual-network.md)
