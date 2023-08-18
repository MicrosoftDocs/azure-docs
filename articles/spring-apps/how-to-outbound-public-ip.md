---
title: How - to identify outbound public IP addresses in Azure Spring Apps
description: How to view the static outbound public IP addresses to communicate with external resources, such as Database, Storage, Key Vault, etc.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: how-to
ms.date: 09/17/2020
ms.custom: devx-track-java, event-tier1-build-2022
---

# How to identify outbound public IP addresses in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article explains how to view static outbound public IP addresses of applications in Azure Spring Apps. Public IPs are used to communicate with external resources, such as databases, storage, and key vaults.

> [!IMPORTANT]
> If the Azure Spring Apps instance is deployed in your own virtual network, you can leverage either Network Security Group or Azure Firewall to fully control the egress traffic.

## How IP addresses work in Azure Spring Apps

An Azure Spring Apps service has one or more outbound public IP addresses. The number of outbound public IP addresses may vary according to the plan and other factors.

The outbound public IP addresses are usually constant and remain the same, but there are exceptions.

> [!IMPORTANT]
> If the Azure Spring Apps instance is deployed in your own virtual network, the static outbound IP might be changed after the Start/Stop Azure Spring Apps service instance operation.

## When outbound IPs change

Each Azure Spring Apps instance has a set number of outbound public IP addresses at any given time. Any outbound connection from the applications, such as to a back-end database, uses one of the outbound public IP addresses as the origin IP address. The IP address is selected randomly at runtime, so your back-end service must open its firewall to all the outbound IP addresses.

The number of outbound public IPs changes when you perform one of the following actions:

- Upgrade your Azure Spring Apps instance between plans.
- Raise a support ticket for more outbound public IPs for business needs.

## Find outbound IPs

To find the outbound public IP addresses currently used by your service instance in the Azure portal, select **Networking** in your instance's left-hand navigation pane. They are listed in the **Outbound IP addresses** field.

You can find the same information by running the following command in the Cloud Shell

```azurecli
az spring show --resource-group <group_name> --name <service_name> --query properties.networkProfile.outboundIPs.publicIPs --output tsv
```

## Next steps

* [Learn more about managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md)
* [Learn more about key vault in Azure Spring Apps](./tutorial-managed-identities-key-vault.md)
