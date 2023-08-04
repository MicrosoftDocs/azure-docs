---
title: Configure public registry access
description: Configure IP rules to enable access to an Azure container registry from selected public IP addresses or address ranges.
ms.topic: article
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
---

# Configure public IP network rules

An Azure container registry by default accepts connections over the internet from hosts on any network. This article shows how to configure your container registry to allow access from only specific public IP addresses or address ranges. Equivalent steps using the Azure CLI and Azure portal are provided.

IP network rules are configured on the public registry endpoint. IP network rules do not apply to private endpoints configured with [Private Link](container-registry-private-link.md)

Configuring IP access rules is available in the **Premium** container registry service tier. For information about registry service tiers and limits, see [Azure Container Registry tiers](container-registry-skus.md).

Each registry supports a maximum of 100 IP access rules.

[!INCLUDE [container-registry-scanning-limitation](../../includes/container-registry-scanning-limitation.md)]

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

> [!NOTE]
> If the registry is set up in a virtual network with a [service endpoint](container-registry-vnet.md), disabling access to the registry's public endpoint also disables access to the registry within the virtual network.

### Disable public access - CLI

To disable public access using the Azure CLI, run [az acr update][az-acr-update] and set `--public-network-enabled` to `false`. The `public-network-enabled` argument requires Azure CLI 2.6.0 or later. 

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

## Troubleshoot

### Access behind HTTPS proxy

If a public network rule is set, or public access to the registry is denied, attempts to login to the registry from a disallowed public network will fail. Client access from behind an HTTPS proxy will also fail if an access rule for the proxy is not set. You will see an error message similar to `Error response from daemon: login attempt failed with status: 403 Forbidden` or `Looks like you don't have access to registry`.

These errors can also occur if you use an HTTPS proxy that is allowed by a network access rule, but the proxy isn't properly configured in the client environment. Check that both your Docker client and the Docker daemon are configured for proxy behavior. For details, see [HTTP/HTTPS proxy](https://docs.docker.com/config/daemon/systemd/#httphttps-proxy) in the Docker documentation.

### Access from Azure Pipelines

If you use Azure Pipelines with an Azure container registry that limits access to specific IP addresses, the pipeline may be unable to access the registry, because the outbound IP address from the pipeline is not fixed. By default, the pipeline runs jobs using a Microsoft-hosted [agent](/azure/devops/pipelines/agents/agents) on a virtual machine pool with a changing set of IP addresses.

One workaround is to change the agent used to run the pipeline from Microsoft-hosted to self-hosted. With a self-hosted agent running on a [Windows](/azure/devops/pipelines/agents/v2-windows) or [Linux](/azure/devops/pipelines/agents/v2-linux) machine that you manage, you control the outbound IP address of the pipeline, and you can add this address in a registry IP access rule.

### Access from AKS

If you use Azure Kubernetes Service (AKS) with an Azure container registry that limits access to specific IP addresses, you can't configure a fixed AKS IP address by default. The egress IP address from the AKS cluster is randomly assigned.

To allow the AKS cluster to access the registry, you have these options:

* If you use the Azure Basic Load Balancer, set up a [static IP address](../aks/egress.md) for the AKS cluster. 
* If you use the Azure Standard Load Balancer, see guidance to [control egress traffic](../aks/limit-egress-traffic.md) from the cluster.

## Next steps

* To restrict access to a registry using a private endpoint in a virtual network, see [Configure Azure Private Link for an Azure container registry](container-registry-private-link.md).
* If you need to set up registry access rules from behind a client firewall, see [Configure rules to access an Azure container registry behind a firewall](container-registry-firewall-access-rules.md).
* For more troubleshooting guidance, see [Troubleshoot network issues with registry](container-registry-troubleshoot-access.md).

[az-acr-login]: /cli/azure/acr#az_acr_login
[az-acr-network-rule-add]: /cli/azure/acr/network-rule/#az_acr_network_rule_add
[az-acr-network-rule-remove]: /cli/azure/acr/network-rule/#az_acr_network_rule_remove
[az-acr-network-rule-list]: /cli/azure/acr/network-rule/#az_acr_network_rule_list
[az-acr-run]: /cli/azure/acr#az_acr_run
[az-acr-update]: /cli/azure/acr#az_acr_update
[quickstart-portal]: container-registry-get-started-portal.md
[quickstart-cli]: container-registry-get-started-azure-cli.md

[acr-access-selected-networks]: ./media/container-registry-access-selected-networks/acr-access-selected-networks.png
[acr-access-disabled]: ./media/container-registry-access-selected-networks/acr-access-disabled.png
[acr-access-all-networks]: ./media/container-registry-access-selected-networks/acr-access-all-networks.png
