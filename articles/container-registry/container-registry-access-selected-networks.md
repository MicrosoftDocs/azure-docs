---
title: Configure access from public networks
description: Configure IP rules to enable access to an Azure container registry from selected public IP addresses or address ranges.
ms.topic: article
ms.date: 05/04/2020
---

# Configure access from selected public networks

An Azure container registry by default accepts connections over the internet from hosts on any network. This article shows how to configure your container registry to allow access from only specific public IP addresses or address ranges. Equivalent steps using the Azure CLI and Azure portal are provided.

In IP network rules, provide allowed internet address ranges using CIDR notation such as *16.17.18.0/24* or an individual IP addresses like *16.17.18.19*. IP network rules are only allowed for *public* internet IP addresses. IP address ranges reserved for private networks (as defined in RFC 1918) aren't allowed.

Configuring IP access rules is available in the **Premium** container registry service tier. For information about registry service tiers and limits, see [Azure Container Registry SKUs](container-registry-skus.md).

## Access from selected public network - CLI

### Change default network access to registry

By default, an Azure container registry allows connections from hosts on any network. To limit access to a selected network, change the default action to deny access. Substitute the name of your registry in the following [az acr update][az-acr-update] command:

```azurecli
az acr update --name myContainerRegistry --default-action Deny
```

### Add network rule to registry

Use the [az acr network-rule add][az-acr-network-rule-add] command to add a network rule to your registry that allows access from a public IP address or range. For example, substitute the container registry's name and the public IP address of a VM in a virtual network.

```azurecli
az acr network-rule add \
  --name mycontainerregistry \
  --ip-address <public-IP-address>
```

After adding a rule, it takes a few minutes for the rule to take effect.

## Access from selected public network - portal

1. In the portal, navigate to your container registry.
1. Under **Settings**, select **Networking**.
1. On the **Public access** tab, select to allow public access from **Selected networks**.
1. Under **Firewall**, enter a public IP address, such as the public IP address of a VM in a virtual network. Or, enter an address range in CIDR notation that contains the VM's IP address.
1. Select **Save**.

![Configure firewall rule for container registry][acr-access-selected-networks]

After adding a rule, it takes a few minutes for the rule to take effect.

> [!TIP]
> Optionally, enable registry access from a local client computer or IP address range. To allow this access, you need the computer's public IPv4 address. You can find this address using a search like "what is my IP address" in an Internet browser. The current client IPv4 address also appears automatically when you configure firewall settings on the **Networking** page in the portal.

## Disable public network access

In certain scenarios, you might want to disable all public network access to registry. For example, if you set up a [private endpoint](container-registry-private-link.md) for a registry in a virtual network, you might also decide to disable access from outside the virtual network.

### Disable public access - CLI

Substitute the name of your registry in the following [az acr update][az-acr-update] command:

```azurecli
az acr update --name myContainerRegistry --default-action Deny
```

### Disable public access - Portal

1. In the portal, navigate to your container registry and select **Settings > Networking**.
1. On the **Public access** tab, in **Allow public access**, select **Disabled**. Then select **Save**.

## Restore default registry access

To restore the registry to allow access by default, update the default action. Equivalent steps using the Azure CLI and Azure portal are provided. 

### Restore default registry access - CLI

Substitute the name of your registry in the following [az acr update][az-acr-update] command:

```azurecli
az acr update --name myContainerRegistry --default-action Allow
```

### Restore default registry access - portal

1. In the portal, navigate to your container registry and select **Settings > Networking**.
1. Under **Firewall**, select each address range, and then select the Delete icon.
1. On the **Public access** tab, in **Allow public access**, select **All networks**. Then select **Save**.

## Next steps

* To restrict access to a registry using a private endpoint in a virtual network, see [Configure Azure Private Link for an Azure container registry](container-registry-private-link.md).
* If you need to set up registry access rules from behind a client firewall, see [Configure rules to access an Azure container registry behind a firewall](container-registry-firewall-access-rules.md).

[az-acr-login]: /cli/azure/acr#az-acr-login
[az-acr-network-rule-add]: /cli/azure/acr/network-rule/#az-acr-network-rule-add
[az-acr-network-rule-remove]: /cli/azure/acr/network-rule/#az-acr-network-rule-remove
[az-acr-network-rule-list]: /cli/azure/acr/network-rule/#az-acr-network-rule-list
[az-acr-run]: /cli/azure/acr#az-acr-run
[az-acr-update]: /cli/azure/acr#az-acr-update
[quickstart-portal]: container-registry-get-started-portal.md
[quickstart-cli]: container-registry-get-started-azure-cli.md
[azure-portal]: https://portal.azure.com

[acr-access-selected-networks]: ./media/container-registry-access-selected-networks/acr-access-selected-networks.png
