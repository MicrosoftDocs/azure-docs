---
title: "Configure networking for Azure Dev Spaces in different network topologies"
services: azure-dev-spaces
ms.date: 03/17/2020
ms.topic: "conceptual"
description: "Describes the networking requirements for running Azure Dev Spaces in Azure Kubernetes Services" 
keywords: "Azure Dev Spaces, Dev Spaces, Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers, CNI, kubenet, SDN, network"
---

# Configure networking for Azure Dev Spaces in different network topologies

Azure Dev Spaces runs on Azure Kubernetes Service (AKS) clusters with the default networking configuration. If you want to change the networking configuration of your AKS cluster, such as putting the cluster behind a firewall, using network security groups, or using network policies, you have to incorporate additional considerations for running Azure Dev Spaces.

![Virtual network configuration](media/configure-networking/virtual-network-clusters.svg)

## Virtual network or subnet configurations

Your AKS cluster may have a different virtual network or subnet configuration to restrict ingress or egress traffic for your AKS cluster. For example, your cluster may be behind a firewall, such as Azure Firewall, or you might use Network Security Groups or custom roles for restricting network traffic. You can find an example network configuration in the [Azure Dev Spaces sample repository on GitHub][sample-repo].

Azure Dev Spaces has certain requirements for *Ingress and Egress* network traffic as well as *Ingress only* traffic. If you are using Azure Dev Spaces on an AKS cluster with a virtual network or subnet configuration that restricts traffic for your AKS cluster, you must follow the following ingress only and ingress and egress traffic requirements in order for Azure Dev Spaces to function properly.

### Ingress and egress network traffic requirements

Azure Dev Spaces needs ingress and egress traffic for following FQDNs:

| FQDN                       | Port       | Use      |
|----------------------------|------------|----------|
| cloudflare.docker.com      | HTTPS: 443 | To pull docker images for Azure Dev Spaces |
| gcr.io                     | HTTPS: 443 | To pull helm images for Azure Dev Spaces |
| storage.googleapis.com     | HTTPS: 443 | To pull helm images for Azure Dev Spaces |

Update your firewall or security configuration to allow network traffic to and from the all of the above FQDNs and [Azure Dev Spaces infrastructure services][service-tags]. For example, if you are using a firewall to secure your network, the above FQDNs should be added to the application rule of the firewall and the Azure Dev Spaces service tag must also be [added to the firewall][firewall-service-tags]. Both of those updates to the firewall are required to allow traffic to and from these domains.

### Ingress only network traffic requirements

Azure Dev Spaces provides Kubernetes namespace-level routing as well as public access to services using its own FQDN. For both of those features to work, update your firewall or network configuration to allow public ingress to the external IP address of the Azure Dev Spaces ingress controller on your cluster. Alternatively, you can create an [internal load balancer][aks-internal-lb] and add a NAT rule in your firewall to translate the public IP of your firewall to the IP of your internal load balancer. You can also use [traefik][traefik-ingress] or [NGINX][nginx-ingress] to create a custom ingress controller.

## AKS cluster network requirements

AKS allows you to use [network policies][aks-network-policies] to control ingress and egress traffic between pods on a cluster as well as egress traffic from a pod. Azure Dev Spaces has certain requirements for *Ingress and Egress* network traffic as well as *Ingress only* traffic. If you are using Azure Dev Spaces on an AKS cluster with AKS network policies, you must follow the following ingress only and ingress and egress traffic requirements in order for Azure Dev Spaces to function properly.

### Ingress and egress network traffic requirements

Azure Dev Spaces allows you to communicate directly with a pod in a dev space on your cluster for debugging. For this feature to work, add a network policy that allows ingress and egress communication to the IP addresses of the Azure Dev Spaces infrastructure, which [vary by region][service-tags].

### Ingress only network traffic requirements

Azure Dev Spaces provides routing between pods across namespaces. For example, namespaces with Azure Dev Spaces enabled can have a parent/child relationship, which allows network traffic to be routed between pods across the parent and child namespaces. Azure Dev Spaces also exposes service endpoints using its own FQDN. To configure different ways of exposing services and how it impacts namespace level routing see [Using different endpoint options][endpoint-options].

## Using Azure CNI

By default, AKS clusters are configured to use [kubenet][aks-kubenet] for networking, which works with Azure Dev Spaces. You can also configure your AKS cluster to use [Azure Container Networking Interface (CNI)][aks-cni]. To use Azure Dev Spaces with Azure CNI on your AKS cluster, allow your virtual network and subnet address spaces up to 10 private IP addresses for pods deployed by Azure Dev Spaces. More details on allowing private IP addresses are available in the [AKS Azure CNI documentation][aks-cni-ip-planning].

## Using API server authorized IP ranges

AKS clusters allow you to configure additional security that limits which IP address can interact with your clusters, for example using custom virtual networks or [securing access to the API server using authorized IP ranges][aks-ip-auth-ranges]. To use Azure Dev Spaces when using this additional security while [creating][aks-ip-auth-range-create] your cluster, you must [allow additional ranges based on your region][service-tags]. You can also [update][aks-ip-auth-range-update] an existing cluster to allow those additional ranges. You also need to allow the IP address of any development machines that connect to your AKS cluster for debugging to connect to your API server.

## Using AKS private clusters

At this time, Azure Dev Spaces is not supported with [AKS private clusters][aks-private-clusters].

## Using different endpoint options

Azure Dev Spaces has the option to expose endpoints for your services running on AKS. When enabling Azure Dev Spaces on your cluster, you have the following options for configuring the endpoint type for your cluster:

* A *public* endpoint, which is the default, deploys an ingress controller with a public IP address. The public IP address is registered on the cluster's DNS, allowing public access to your services using a URL. You can view this URL using `azds list-uris`.
* A *private* endpoint deploys an ingress controller with a private IP address. With a private IP address, the load balancer for your cluster is only accessible from inside the virtual network of the cluster. The private IP address of the load balancer is registered on cluster's DNS so that services inside the cluster's virtual network can be accessed using a URL. You can view this URL using `azds list-uris`.
* Setting *none* for the endpoint option causes no ingress controller to be deployed. With no ingress controller deployed, the [Azure Dev Spaces routing capabilities][dev-spaces-routing] will not work. Optionally, you can implement your own ingress controller solution using [traefik][traefik-ingress] or [NGINX][nginx-ingress], which will allow the routing capabilities to work again.

To configure your endpoint option, use *-e* or *--endpoint* when enabling Azure Dev Spaces on your cluster. For example:

> [!NOTE]
> The endpoint option requires that you are running Azure CLI version 2.2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

```azurecli
az aks use-dev-spaces -g MyResourceGroup -n MyAKS -e private
```

## Client requirements

Azure Dev Spaces uses client-side tooling, such as the Azure Dev Spaces CLI extension, Visual Studio Code extension, and Visual Studio extension, to communicate with your AKS cluster for debugging. To use the Azure Dev Spaces client-side tooling, allow traffic from the development machines to the [Azure Dev Spaces infrastructure][dev-spaces-allow-infrastructure]. If using [API server authorized IP ranges][auth-range-section], you also need to allow the IP address of any development machines that connect to your AKS cluster for debugging to connect to your API server.

## Next steps

Learn how Azure Dev Spaces helps you develop more complex applications across multiple containers, and how you can simplify collaborative development by working with different versions or branches of your code in different spaces.

> [!div class="nextstepaction"]
> [Team development in Azure Dev Spaces][team-quickstart]

[aks-cni]: ../aks/configure-azure-cni.md
[aks-cni-ip-planning]: ../aks/configure-azure-cni.md#plan-ip-addressing-for-your-cluster
[aks-kubenet]: ../aks/configure-kubenet.md
[aks-internal-lb]: ../aks/internal-lb.md
[aks-ip-auth-ranges]: ../aks/api-server-authorized-ip-ranges.md
[aks-ip-auth-range-create]: ../aks/api-server-authorized-ip-ranges.md#create-an-aks-cluster-with-api-server-authorized-ip-ranges-enabled
[aks-ip-auth-range-update]: ../aks/api-server-authorized-ip-ranges.md#update-a-clusters-api-server-authorized-ip-ranges
[aks-network-policies]: ../aks/use-network-policies.md
[aks-private-clusters]: ../aks/private-clusters.md
[auth-range-section]: #using-api-server-authorized-ip-ranges
[azure-cli-install]: /cli/azure/install-azure-cli
[dev-spaces-allow-infrastructure]: #virtual-network-or-subnet-configurations
[dev-spaces-routing]: how-dev-spaces-works-routing.md
[endpoint-options]: #using-different-endpoint-options
[firewall-service-tags]: ../firewall/service-tags.md
[traefik-ingress]: how-to/ingress-https-traefik.md
[nginx-ingress]: how-to/ingress-https-nginx.md
[sample-repo]: https://github.com/Azure/dev-spaces/tree/master/advanced%20networking
[service-tags]: ../virtual-network/service-tags-overview.md#available-service-tags
[team-quickstart]: quickstart-team-development.md