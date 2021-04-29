---
title: Troubleshoot network issues with registry
description: Symptoms, causes, and resolution of common problems when accessing an Azure container registry in a virtual network or behind a firewall
ms.topic: article
ms.date: 03/30/2021
---

# Troubleshoot network issues with registry

This article helps you troubleshoot problems you might encounter when accessing an Azure container registry in a virtual network or behind a firewall or proxy server. 

## Symptoms

May include one or more of the following:

* Unable to push or pull images and you receive error `dial tcp: lookup myregistry.azurecr.io`
* Unable to push or pull images and you receive error `Client.Timeout exceeded while awaiting headers`
* Unable to push or pull images and you receive Azure CLI error `Could not connect to the registry login server`
* Unable to pull images from registry to Azure Kubernetes Service or another Azure service
* Unable to access a registry behind an HTTPS proxy and you receive error `Error response from daemon: login attempt failed with status: 403 Forbidden` or `Error response from daemon: Get <registry>: proxyconnect tcp: EOF Login failed`
* Unable to configure virtual network settings and you receive error `Failed to save firewall and virtual network settings for container registry`
* Unable to access or view registry settings in Azure portal or manage registry using the Azure CLI
* Unable to add or modify virtual network settings or public access rules
* ACR Tasks is unable to push or pull images
* Azure Security Center can't scan images in registry, or scan results don't appear in Azure Security Center
* You receive error `host is not reachable` when attempting to access a registry configured with a private endpoint.

## Causes

* A client firewall or proxy prevents access - [solution](#configure-client-firewall-access)
* Public network access rules on the registry prevent access - [solution](#configure-public-access-to-registry)
* Virtual network configuration prevents access - [solution](#configure-vnet-access)
* You attempt to integrate Azure Security Center or certain other Azure services with a registry that has a private endpoint, service endpoint, or public IP access rules - [solution](#configure-service-access)

## Further diagnosis 

Run the [az acr check-health](/cli/azure/acr#az_acr_check_health) command to get more information about the health of the registry environment and optionally access to a target registry. For example, diagnose certain network connectivity or configuration problems. 

See [Check the health of an Azure container registry](container-registry-check-health.md) for command examples. If errors are reported, review the [error reference](container-registry-health-error-reference.md) and the following sections for recommended solutions.

If you're experiencing problems using an Azure Kubernetes Service with an integrated registry, run the [az aks check-acr](/cli/azure/aks#az_aks_check_acr) command to validate that the AKS cluster can reach the registry.

> [!NOTE]
> Some network connectivity symptoms can also occur when there are issues with registry authentication or authorization. See [Troubleshoot registry login](container-registry-troubleshoot-login.md).

## Potential solutions

### Configure client firewall access

To access a registry from behind a client firewall or proxy server, configure firewall rules to access the registry's public REST and data endpoints. If [dedicated data endpoints](container-registry-firewall-access-rules.md#enable-dedicated-data-endpoints) are enabled, you need rules to access:

* REST endpoint: `<registryname>.azurecr.io`
* Data endpoint(s): `<registry-name>.<region>.data.azurecr.io`

For a geo-replicated registry, configure access to the data endpoint for each regional replica.

Behind an HTTPS proxy, ensure that both your Docker client and Docker daemon are configured for proxy behavior. If you change your proxy settings for the Docker daemon, be sure to restart the daemon. 

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

If a private endpoint is configured, confirm that DNS resolves the registry's public FQDN such as *myregistry.azurecr.io* to the registry's private IP address. Use a network utility such as `dig` or `nslookup` for DNS lookup. Ensure that [DNS records are configured](container-registry-private-link.md#dns-configuration-options) for the registry FQDN and for each of the data endpoint FQDNs.

Review NSG rules and service tags used to limit traffic from other resources in the network to the registry. 

If a service endpoint to the registry is configured, confirm that a network rule is added to the registry that allows access from that network subnet. The service endpoint only supports access from virtual machines and AKS clusters in the network.

If you want to restrict registry access using a virtual network in a different Azure subscription, ensure that you register the `Microsoft.ContainerRegistry` resource provider in that subscription. [Register the resource provider](../azure-resource-manager/management/resource-providers-and-types.md) for Azure Container Registry using the Azure portal, Azure CLI, or other Azure tools.

If Azure Firewall or a similar solution is configured in the network, check that egress traffic from other resources such as an AKS cluster is enabled to reach the registry endpoints.

Related links:

* [Connect privately to an Azure container registry using Azure Private Link](container-registry-private-link.md)
* [Troubleshoot Azure Private Endpoint connectivity problems](../private-link/troubleshoot-private-endpoint-connectivity.md)
* [Restrict access to a container registry using a service endpoint in an Azure virtual network](container-registry-vnet.md)
* [Required outbound network rules and FQDNs for AKS clusters](../aks/limit-egress-traffic.md#required-outbound-network-rules-and-fqdns-for-aks-clusters)
* [Kubernetes: Debugging DNS resolution](https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/)
* [Virtual network service tags](../virtual-network/service-tags-overview.md)

### Configure service access

Currently, access to a container registry with network restrictions isn't allowed from several Azure services:

* Azure Security Center can't perform [image vulnerability scanning](../security-center/defender-for-container-registries-introduction.md?bc=%2fazure%2fcontainer-registry%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fcontainer-registry%2ftoc.json) in a registry that restricts access to private endpoints, selected subnets, or IP addresses. 
* Resources of certain Azure services are unable to access a container registry with network restrictions, including Azure App Service and  Azure Container Instances.

If access or integration of these Azure services with your container registry is required, remove the network restriction. For example, remove the registry's private endpoints, or remove or modify the registry's public access rules.

Starting January 2021, you can configure a network-restricted registry to [allow access](allow-access-trusted-services.md) from select trusted services.

Related links:

* [Azure Container Registry image scanning by Security Center](../security-center/defender-for-container-registries-introduction.md)
* Provide [feedback](https://feedback.azure.com/forums/347535-azure-security-center/suggestions/41091577-enable-vulnerability-scanning-for-images-that-are)
* [Allow trusted services to securely access a network-restricted container registry](allow-access-trusted-services.md)


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
* [Microsoft Q&A](/answers/products/)
* [Open a support ticket](https://azure.microsoft.com/support/create-ticket/)