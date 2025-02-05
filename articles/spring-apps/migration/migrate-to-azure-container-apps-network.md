---
title: Migrating a custom Virtual Network
description: Describes how to migrate custom virtual network settings.
author: KarlErickson
ms.author: dixue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 01/29/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Migrating a custom virtual network

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

In Azure Spring Apps, you can deploy your applications within a managed virtual network. This setup enables secure communication between your applications and other resources in your virtual network, such as databases and other services. Azure Container Apps offers similar functionality but with some differences. This article explores these differences and provides guidance on creating and managing Azure Container Apps environments with managed virtual networks.

## Prerequisites

- An active Azure subscription. If you don't have one, you can [create a free Azure account](https://azure.microsoft.com/free).
- [Azure CLI](/cli/azure/install-azure-cli).

## Create an Azure Container Apps environment with a virtual network

In Azure Spring Apps, you need to configure two subnets within a virtual network: one for the system runtime and another for the user app. This setup ensures isolation and security for both the system components and the user applications. On the other hand, Azure Container Apps simplifies the network configuration by requiring only one subnet for infrastructure within a virtual network.

In Azure Container Apps, the infrastructure virtual network is isolated from the customer virtual network, eliminating the need to grant the service permission to the virtual network as required in Azure Spring Apps. There are two types of environments supported. For more information, see the [Types](../../container-apps/environment.md#types) section of [Azure Container Apps environments](../../container-apps/environment.md). When using the Workload profiles environment, you need to update the virtual network to delegate the subnet to `Microsoft.App/environments`. For more information, see the [Create an environment](../../container-apps/vnet-custom.md?tabs=bash&pivots=azure-cli#create-an-environment) section of [Provide a virtual network to an Azure Container Apps environment](../../container-apps/vnet-custom.md?tabs=bash&pivots=azure-cli).

Also, the requirements for smaller subnet ranges differ between the two services.

To create an Azure Container Apps environment with a virtual network, use the following Azure CLI command:

```azurecli
az containerapp env create \
    --resource-group $RESOURCE_GROUP \
    --name $ENVIRONMENT \
    --location "$LOCATION" \
    --internal-only true \
    --infrastructure-subnet-resource-id "$INFRASTRUCTURE_SUBNET"
```

The variable `$INFRASTRUCTURE_SUBNET` is the Resource ID of a subnet in the customer virtual network, which is for infrastructure components and user app containers. For more information, see the [Create an environment](../../container-apps/vnet-custom.md#create-an-environment) section of [Provide a virtual network to an Azure Container Apps environment](../../container-apps/vnet-custom.md).

Choosing to use a customer virtual network in Azure Container Apps doesn't mean that your container app can't accept public requests. If you want to completely limit access to the customer virtual network only, you need to set the `--internal-only` parameter to `true`. This setting ensures that no public endpoints are created. For more information, see the [Virtual IP](../../container-apps/networking.md#virtual-ip) section of [Networking in Azure Container Apps environment](../../container-apps/networking.md) and [Provide a virtual network to an internal Azure Container Apps environment](../../container-apps/vnet-custom.md).

## Migrate App to Azure Container Apps

After you create an Azure Container Apps Environment, the next step is to migrate your app to Azure Container Apps. For more information, see [Concept Mapping](./migrate-to-azure-container-apps-overview.md). To migrate each Azure Container App, see [Overview of application migration](./migrate-to-azure-container-apps-application-overview.md) and select either a container image or an artifact for the migration process.

## Change Ingress Setting

Azure Container Apps offer more options for customizing ingress settings compared to Azure Spring Apps. For more information, see [Customize the ingress configuration in Azure Spring Apps](../basic-standard/how-to-configure-ingress.md).

The following table maps the configuration properties between the two services:

| Feature                | Azure Spring Apps                      | Azure Container Apps                                     |
|------------------------|----------------------------------------|----------------------------------------------------------|
| Session Affinity       | `ingressSettings.sessionAffinity`      | `ingress.stickySessions.affinity`                        |
| Session Cookie Max Age | `ingressSettings.sessionCookieMaxAge`  | `EasyAuthConfig.login.cookieExpiration.timeToExpiration` |
| Backend Protocol       | `ingressSettings.backendProtocol`      | `ingress.transport`                                      |
| Client Authentication  | `ingressSettings.clientAuth`           | `ingress.clientCertificateMode`                          |
| Ingress Read Timeout   | `ingressSettings.readTimeoutInSeconds` | 240                                                      |
| Ingress Send Timeout   | `ingressSettings.sendTimeoutInSeconds` | 240                                                      |

Azure Container Apps doesn't permit users to specify a custom timeout value. Instead, it enforces a built-in request timeout for HTTP requests, which is capped at 240 seconds. So, if a request exceeds this duration, the connection is automatically terminated to ensure efficient resource management and prevent long-running requests from monopolizing the system.

Azure Container Apps doesn't directly support a `session-max-age` configuration item. However, you can manage session durations and behaviors through other related settings. For instance, you can use the [cookieExpiration](/rest/api/appservice/web-apps/get-auth-settings-v2#cookieexpiration) setting in the `EasyAuth` configuration to control how long an authentication session lasts. This setting enables you to specify the duration for which the authentication cookie remains valid.

For more information about ingress settings provided by Azure Container Apps, see [Ingress in Azure Container Apps](../../container-apps/ingress-overview.md).

Both Azure Spring Apps and Azure Container Apps offer ways to generate publicly accessible endpoints. In Azure Spring Apps, each deployment has a unique URL for testing purposes during blue-green deployments. Similarly, in Azure Container Apps, a revision label provides a unique URL that you can use to route traffic to the specific revision that the label is assigned to. For more information, see the [Labels](../../container-apps/revisions.md#labels) section of [Update and deploy changes in Azure Container Apps](../../container-apps/revisions.md).

In Azure Spring Apps, the system automatically probes port `1025` for applications on the Basic/Standard plan and port `8080` for applications on the Enterprise plan. These probes help determine whether the application container is ready to accept traffic. On the other hand, Azure Container Apps offers more flexibility by enabling users to specify the probe port themselves using the `--target-port` parameter. This setting gives users more control over their application's configuration and behavior.

To update the target port of ingress for a container app, you can use the following Azure CLI command:

```azurecli
az containerapp ingress update \
    --resource-group <resource-group> \
    --name <app-name> \
    --target-port <target-port>
```

The following list explains each parameter:

- `--name`: The name of your container app.
- `--resource-group`: The resource group containing your container app.
- `--target-port`: The port on which your container app is listening.

For more information, see the [Enable ingress](../../container-apps/ingress-how-to.md#enable-ingress) section of [Configure Ingress for your app in Azure Container Apps](../../container-apps/ingress-how-to.md).

## Change egress setting (UDR)

Both Azure Spring Apps and Azure Container Apps offer ways to control outbound traffic through the *bring your own route table* feature - User Defined Routes (UDR) - with [Azure Firewall](../../firewall/overview.md). However, take note of the following differences:

- There's no need to add a role assignment for an Azure Container Apps resource provider.
- A dedicated subnet for the Azure Container Apps service runtime subnet isn't required.
- Azure Container Apps provide a more flexible way to support UDR. In Azure Container Apps, there's no need to explicitly set the option `--outbound-type` to `userDefinedRouting` when provisioning Azure Spring Apps.

For more information, see the [Routes](../../container-apps/networking.md#routes) section of [Subnet configuration with CLI](../../container-apps/networking.md) and [Control outbound traffic in Azure Container Apps with user defined routes](../../container-apps/user-defined-routes.md).

In Azure Container Apps, only workload profiles of the *environment* type support UDR. Additionally, Azure Container Apps support egress through NAT Gateway and the creation of private endpoints on the container app environment.

To create an Azure Container Apps environment that supports UDR, use the following command:

```azurecli
az containerapp env create \
    --resource-group $RESOURCE_GROUP \
    --name $ENVIRONMENT \
    --location "$LOCATION" \
    --enable-workload-profiles \
    --infrastructure-subnet-resource-id "$INFRASTRUCTURE_SUBNET"
```
Set the parameter `--enable-workload-profiles` to `true` to enable workload profiles.

## Secure virtual networks with Network Security Groups

Both Azure Spring Apps and Azure Container Apps offer robust support, enabling you to manage and secure outbound traffic effectively using Network Security Groups (NSG). The main differences lie in the specific configurations.

For more information, see [Securing a custom VNET in Azure Container Apps with Network Security Groups](../../container-apps/firewall-integration.md).

## Change DNS Settings

Both Azure Spring Apps and Azure Container Apps support the use of custom DNS servers in a customer virtual network. We recommend adding Azure DNS IP `168.63.129.16` as the upstream DNS server in the custom DNS server.

For more information, see the [DNS](../../container-apps/networking.md#dns) section of [Networking in Azure Container Apps environment](../../container-apps/networking.md).

Currently, Azure Container Apps in a Consumption-only environment type doesn't support flushing DNS settings changes as Azure Spring Apps does. For more information, see [Flush DNS settings changes in Azure Spring Apps](../basic-standard/how-to-use-flush-dns-settings.md). However, the workload profile type of environment automatically refreshes DNS settings every 5 minutes.

Azure Container Apps supports deployment with a private DNS zone. For more information, see the [Deploy with a private DNS](../../container-apps/vnet-custom.md#deploy-with-a-private-dns) section of [Provide a virtual network to an Azure Container Apps environment](../../container-apps/vnet-custom.md). This approach provides a more flexible way to support linking a private DNS zone than using Azure Spring Apps. For more information, see the [Link the private DNS zone with Azure Spring Apps](../basic-standard/access-app-virtual-network.md#link-the-private-dns-zone-with-azure-spring-apps) section of [Access an app in Azure Spring Apps in a virtual network](../basic-standard/access-app-virtual-network.md).

## Access an app in Azure Container Apps within a customer virtual network

Azure Container Apps provides both [Public network access](../../container-apps/networking.md#public-network-access) and [Private endpoint](../../container-apps/networking.md#private-endpoint) features to expose applications to the internet or to secure them within a private network. Similarly, Azure Spring Apps supports these features as described in the following articles:

- [Access an app in Azure Spring Apps in a virtual network](../basic-standard/access-app-virtual-network.md)
- [Access applications using Azure Spring Apps Standard consumption and dedicated plan in a virtual network](../consumption-dedicated/quickstart-access-standard-consumption-within-virtual-network.md)
