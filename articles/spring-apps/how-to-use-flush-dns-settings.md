---
title: How to flush DNS settings changes in Azure Spring Apps
titleSuffix: Azure Spring Apps
description: How to update DNS settings in a virtual network injected Azure Spring Apps service.
author: KarlErickson
ms.author: hanren
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
> This feature is only available for virtual network-injected Azure Spring Apps service instance.

This article explains how to update your DNS settings in a virtual network-injected Azure Spring Apps service instance.

With the new flush DNS settings option, you can update the DNS settings in an Azure Spring Apps instance with one simple and fast action. This option doesn't restart any underlying nodes or running applications within your service instance, but restarts the network infrastructure to implement the DNS setting changes.

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

1. Select **Flush DNS Setting (Preview)**.

:::image type="content" source="./media/how-to-flush-dns-settings/flush-dns-settings.png" alt-text="Screenshot of the Azure portal that shows the Overview page with the Flush DNS settings (preview) option highlighted." lightbox="./media/how-to-flush-dns-settings/flush-dns-settings.png":::

### [Azure CLI](#tab/azure-cli)

Use the following command to flush the DNS settings for an existing Azure Spring Apps instance:

```azurecli
az spring flush-virtualnetwork-dns-settings \
            --resource-group <resource-group-name> \
            --name <service-name> 
```

---

## Troubleshoot known issues

This section describes how to troubleshoot known errors when connecting to your DNS server and other related issues.

### Error: `Failed to connect DNS server, connection timed out.`

If you get this error, check whether a network routing rule, or a firewall is blocking traffic from your service runtime or app subnets to your custom DNS server IP on port 53 or your custom DNS server listening port.

### Error: `Failed to resolve IP.`

If you get this error, check whether the upstream DNS server is correctly configured in your DNS server. To solve this issue, add Azure DNS IP `168.63.129.16` as the upstream DNS server in your custom DNS server. If you can't use Azure DNS as the upstream server, use other valid upstream servers. For more information, see [Customer responsibilities for running Azure Spring Apps in a virtual network](vnet-customer-responsibilities.md). can be resolved.

### Error: `Not all the VM instances in the cluster are in succeeded running state.`

This error usually indicates that DNS or other networking settings is blocking the underlying nodes provisioning. For more information, see [Customer responsibilities for running Azure Spring Apps in a virtual network](vnet-customer-responsibilities.md) and [Troubleshooting Azure Spring Apps in virtual networks](troubleshooting-vnet.md).
