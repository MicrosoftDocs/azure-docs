---
title: Configure public registry access
description: Configure IP rules to enable access to an Azure container registry from selected public IP addresses or address ranges.
ms.topic: article
ms.date: 05/19/2020
---

# Configure public IP network rules

An Azure container registry by default accepts connections over the internet from hosts on any network. This article shows how to configure your container registry to allow access from only specific public IP addresses or address ranges. Equivalent steps using the Azure CLI and Azure portal are provided.

IP network rules are configured on the public registry endpoint. IP network rules do not apply to private endpoints configured with [Private Link](container-registry-private-link.md)

Configuring IP access rules is available in the **Premium** container registry service tier. For information about registry service tiers and limits, see [Azure Container Registry tiers](container-registry-skus.md).

## Access from selected public network - CLI

### Change default network access to registry

To limit access to a selected public network, first change the default action to deny access. Substitute the name of your registry in the following [az acr update][az-acr-update] command:

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

> [!NOTE]
> After adding a rule, it takes a few minutes for the rule to take effect.

## Access from selected public network - portal

1. In the portal, navigate to your container registry.
1. Under **Settings**, select **Networking**.
1. On the **Public access** tab, select to allow public access from **Selected networks**.
1. Under **Firewall**, enter a public IP address, such as the public IP address of a VM in a virtual network. Or, enter an address range in CIDR notation that contains the VM's IP address.
1. Select **Save**.

![Configure firewall rule for container registry][acr-access-selected-networks]

> [!NOTE]
> After adding a rule, it takes a few minutes for the rule to take effect.

> [!TIP]
> Optionally, enable registry access from a local client computer or IP address range. To allow this access, you need the computer's public IPv4 address. You can find this address by searching "what is my IP address" in an internet browser. The current client IPv4 address also appears automatically when you configure firewall settings on the **Networking** page in the portal.

## Disable public network access

Optionally, disable the public endpoint on the registry. Disabling the public endpoint overrides all firewall configurations. For example, you might want to disable public access to a registry secured in a virtual network using [Private Link](container-registry-private-link.md).

### Disable public access - CLI

To disable public access using the Azure CLI, run [az acr update][az-acr-update] and set `--public-network-enabled` to `false`. 

> [!NOTE]
> The `public-network-enabled` argument requires Azure CLI 2.6.0 or later. 

```azurecli
az acr update --name myContainerRegistry --public-network-enabled false
```

### Disable public access - portal

1. In the portal, navigate to your container registry and select **Settings > Networking**.
1. On the **Public access** tab, in **Allow public network access**, select **Disabled**. Then select **Save**.

![Disable public access][acr-access-disabled]


## Restore public network access

To re-enable the public endpoint, update the networking settings to allow public access. Enabling the public endpoint overrides all firewall configurations. 

### Restore public access - CLI

Run [az acr update][az-acr-update] and set `--public-network-enabled` to `true`. 

> [!NOTE]
> The `public-network-enabled` argument requires Azure CLI 2.6.0 or later. 

```azurecli
az acr update --name myContainerRegistry --public-network-enabled true
```

### Restore public access - portal

1. In the portal, navigate to your container registry and select **Settings > Networking**.
1. On the **Public access** tab, in **Allow public network access**, select **All networks**. Then select **Save**.

![Public access from all networks][acr-access-all-networks]

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
[acr-access-disabled]: ./media/container-registry-access-selected-networks/acr-access-disabled.png
[acr-access-all-networks]: ./media/container-registry-access-selected-networks/acr-access-all-networks.png
