---
title: Troubleshoot network issues with registry
description: Symptoms, causes, and resolution of common problems when accessing an Azure container registry in a virtual network or behind a firewall
ms.topic: article
ms.date: 08/11/2020
---

# Troubleshoot network issues with registry

This article helps you troubleshoot problems you might encounter when accessing an Azure container registry in a virtual network or behind a firewall. 

## Symptoms

May include one or more of the following:

* Unable to push or pull images and you receive error `dial tcp: lookup myregistry.azurecr.io`
* Unable to push or pull images and you receive Azure CLI error `Could not connect to the registry login server`
* Unable to pull images from registry to Azure Kubernetes Service or another Azure service
* Unable to access a registry behind an HTTPS proxy and you receive error `Error response from daemon: login attempt failed with status: 403 Forbidden`
* Unable to access or view registry settings in Azure portal or manage registry using the Azure CLI
* Unable to add or modify virtual network settings or public access rules
* ACR Tasks is unable to push or pull images
* Azure Security Center can't scan images in registry, or scan results don't appear in Azure Security Center

## Causes

* A client firewall or proxy prevents access - [solution](#configure-client-firewall-access)
* Public network access rules on the registry prevent access - [solution](#configure-public-access-to-registry)
* Virtual network configuration prevents access - [solution](#configure-vnet-access)
* You attempt to integrate Azure Security Center with a registry that has a private endpoint or service endpoint - [solution](#configure-image-scanning-solution)

## Further diagnosis 

Run the [az acr check-health](/cli/azure/acr#az-acr-check-health) command to get more information about the health of the registry environment and optionally access to a target registry. For example, diagnose certain network connectivity or configuration problems. 

See [Check the health of an Azure container registry](container-registry-check-health.md) for command examples. If errors are reported, review the [error reference](container-registry-health-error-reference.md) and the following sections for recommended solutions.

> [!NOTE]
> Some network connectivity symptoms can also occur when there are issues with registry authentication or authorization. See [Troubleshoot registry login](container-registry-troubleshoot-login.md).

## Potential solutions

### Configure client firewall access

To access a registry from behind a client firewall or proxy server, configure firewall rules to access the registry's REST and data endpoints. If [dedicated data endpoints](container-registry-firewall-access-rules.md#enable-dedicated-data-endpoints) are enabled, you need rules to access:

* REST endpoint: `<registryname>.azurecr.io`
* Data endpoint(s): `<registry-name>.<region>.data.azurecr.io`

For a geo-replicated registry, configure access to the data endpoint for each regional replica.

Behind an HTTPS proxy, ensure that both your Docker client and Docker daemon are configured for proxy behavior.

Registry resource logs in the ContainerRegistryLoginEvents table may help diagnose an attempted connection that is blocked.

Related links:

* [Configure rules to access an Azure container registry behind a firewall](container-registry-firewall-access-rules.md)
* [HTTP/HTTPS proxy configuration](https://docs.docker.com/config/daemon/systemd/#httphttps-proxy)
* [Geo-replicationin Azure Container Registry](container-registry-geo-replication.md)
* [Azure Container Registry logs for diagnostic evaluation and auditing](container-registry-diagnostics-audit-logs.md)

### Configure public access to registry

If accessing a registry over the internet, confirm the registry allows public network access from your client. By default, an Azure container registry allows access to the public registry endpoints from all networks. A registry can limit access to selected networks, or selected IP addresses. 

If the registry is configured for a virtual network with a service endpoint, disabling public network access also disables access over the service endpoint. If your registry is configured for a virtual network with Private Link, IP network rules don't apply to the registry's private endpoints. 

Related links:

* [Configure public IP network rules](container-registry-access-selected-networks.md)
* [Connect privately to an Azure container registry using Azure Private Link](container-registry-private-link.md)
* [Restrict access to a container registry using a service endpoint in an Azure virtual network](container-registry-vnet.md)


### Configure VNet access

Confirm that the virtual network is configured with either a private endpoint for Private Link or a service endpoint (preview). Currently an Azure Bastion endpoint isn't supported.

Review NSG rules and service tags used to limit traffic from other resources in the network to the registry. 

If a service endpoint to the registry is configured, confirm that a network rule is added to the registry that allows access from that network subnet. The service endpoint only supports access from virtual machines and AKS clusters in the network.

If Azure Firewall or a similar solution is configured in the network, check that egress traffic from other resources such as an AKS cluster is enabled to reach the registry endpoints.

Related links:

* [Connect privately to an Azure container registry using Azure Private Link](container-registry-private-link.md)
* [Restrict access to a container registry using a service endpoint in an Azure virtual network](container-registry-vnet.md)
* [Required outbound network rules and FQDNs for AKS clusters](../aks/limit-egress-traffic.md#required-outbound-network-rules-and-fqdns-for-aks-clusters)
* [Kubernetes: Debugging DNS resolution](https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/)
* [Virtual network service tags](../virtual-network/service-tags-overview.md)

### Configure image scanning solution

If your registry is configured with a private endpoint or service endpoint, you can't currently integrate with Azure Security Center for image scanning. Optionally, configure other image scanning solutions available in Azure Marketplace including:

* [Aqua Cloud Native Security Platform](https://azuremarketplace.microsoft.com/marketplace/apps/aqua-security.aqua-security)
* [Twistlock Enterprise Edition](https://azuremarketplace.microsoft.com/marketplace/apps/twistlock.twistlock)

Related links:

* [Azure Container Registry image scanning by Security Center](../security-center/azure-container-registry-integration.md)
* Provide [feedback](https://feedback.azure.com/forums/347535-azure-security-center/suggestions/41091577-enable-vulnerability-scanning-for-images-that-are)


## Advanced troubleshooting

If [collection of resource logs](container-registry-diagnostics-audit-logs.md) is enabled in the registry, review the ContainterRegistryLoginEvents log. This log stores authentication events and status, including the incoming identity and IP address. Query the log for [registry authentication failures](container-registry-diagnostics-audit-logs.md#registry-authentication-failures). 

Related links:

* [Logs for diagnostic evaluation and auditing](container-registry-diagnostics-audit-logs.md)
* [Container registry FAQ](container-registry-faq.md)
* [Azure Security Baseline for Azure Container Registry](security-baseline.md)
* [Best practices for Azure Container Registry](container-registry-best-practices.md)

## Next steps

If you don't resolve your problem here, see the following options.

* Other registry troubleshooting topics include:
  * [Troubleshoot registry login](container-registry-troubleshoot-login.md) 
  * [Troubleshoot registry performance](container-registry-troubleshoot-performance.md)
* [Community support](https://azure.microsoft.com/support/community/) options
* [Microsoft Q&A](https://docs.microsoft.com/answers/products/)
* [Open a support ticket](https://azure.microsoft.com/support/create-ticket/)


