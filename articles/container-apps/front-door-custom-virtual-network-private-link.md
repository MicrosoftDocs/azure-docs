---
title: Use Azure Front Door Premium with a custom virtual network and Private Link in Azure Container Apps
description: Learn how to deploy an Azure Container Apps environment in a custom virtual network with internal ingress and expose it securely through Azure Front Door Premium with Private Link.
#customer intent: As a cloud architect, I want to deploy Azure Container Apps in a secure custom virtual network so that I can route inbound traffic privately through Azure Front Door Premium with Private Link.
author: kkaushal24011982
ms.author: kkaushal
ms.reviewer: cshoe
ms.service: azure-container-apps
ms.custom:
  - build-2025
ms.topic: how-to
ms.date: 03/05/2026
---

# Use Azure Front Door Premium with a custom virtual network and Private Link

In this article, you learn how to deploy an Azure Container Apps environment in a custom virtual network with an internal virtual IP (VIP) and public network access disabled. You then expose the environment securely through Azure Front Door Premium by using Private Link and private endpoints. This configuration provides a secure inbound path to your container apps while supporting zone redundancy.

> [!IMPORTANT]
> There are [more charges](./private-endpoints-with-dns.md#billing) for enabling private endpoints in both the Dedicated and Consumption plans.

## Prerequisites

- Azure account with an active subscription.
  - If you don't have one, [create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- This feature only supports workload profile environments.

- Make sure the `Microsoft.Cdn` resource provider is registered for your subscription.
    1. Sign in to the [Azure portal](https://portal.azure.com).
    1. Go to your subscription page and select **Settings** > **Resource providers**.
    1. Select **Microsoft.Cdn** from the provider list.
    1. Select **Register**.

## Architecture

The workload profiles environment type supports the combination of custom virtual network integration, private endpoints, and zone redundancy.

The following list describes how inbound traffic flows from the user to your container app:

1. A user connects to the Azure Front Door edge.

1. Azure Front Door forwards traffic to the origin over Private Link.

1. Traffic arrives at the private endpoint IP address in the workload virtual network (for example, `10.0.2.4`).

1. The private endpoint connects to the internal Container Apps environment.

1. Within the virtual network, the environment uses an internal load balancer (ILB) VIP (for example, `10.0.0.165`) to reach the ingress controller.

1. The ingress controller routes traffic to the correct container app, revision, and replica based on host headers and ingress configuration.

### Design considerations

Keep the following design decisions in mind when you plan your deployment:

| Decision | Recommendation | Reason |
|----------|----------------|--------|
| Container Apps subnet size | `/23` | Provides room for scaling replicas and nodes. |
| Private endpoint subnet | Separate, nondelegated subnet (for example, `/24`) | Private endpoints can't share a delegated subnet. |
| Front Door SKU | Premium | Required for Private Link origins. |

## Create the virtual network and subnets

Create a virtual network with two subnets: one delegated to the Container Apps environment and one for private endpoints.

1. Search for **Virtual networks** in the top search bar.

1. Select **Virtual networks** in the search results.

1. Select **Create**.

1. In *Create virtual network*, in the *Basics* tab, enter the following values.

    | Setting | Action |
    |---|---|
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Create new** and enter a name (for example, **my-container-apps**). |
    | Virtual network name | Enter a name (for example, **my-vnet**). |
    | Region | Select your target region. |

1. Select the **IP addresses** tab.

1. Configure the address space (for example, `10.0.0.0/16`).

1. Create two subnets with the following configuration:

    | Subnet name | Address range | Delegation | Purpose |
    |---|---|---|---|
    | **container-apps-subnet** | For example, `10.0.0.0/23` | `Microsoft.App/environments` | Hosts the Container Apps environment. |
    | **private-endpoint-subnet** | For example, `10.0.2.0/24` | None | Hosts private endpoints. |

1. Select **Review + create**, and then select **Create**.

## Create the container app and environment

Create a Container Apps environment with internal ingress in your custom virtual network, and then deploy a container app to the environment.

### Create the container app

1. Search for **Container Apps** in the top search bar.

1. Select **Container Apps** in the search results.

1. Select **Create**.

1. In *Create Container App*, use the *Basics* tab to enter the following values.

    | Setting | Action |
    |---|---|
    | Subscription | Select your Azure subscription. |
    | Resource group | Select the resource group you created (for example, **my-container-apps**). |
    | Container app name | Enter a name (for example, **my-container-app**). |
    | Deployment source | Select **Container image**. |
    | Region | Select the same region as your virtual network. |

1. In *Container Apps Environment*, select **Create new environment**.

### Configure the environment

1. In *Create Container Apps Environment*, in the *Basics* tab, enter the following values.

    | Setting | Action |
    |---|---|
    | Environment name | Enter a name (for example, **my-environment**). |
    | Zone redundancy | Select **Enabled** (if available and required). |

1. Select the **Workload profiles** tab, and add at least one workload profile (for example, **D4**). Set the autoscaling instance count range.

1. Select the **Networking** tab and enter the following values.

    | Setting | Action |
    |---|---|
    | Public network access | Select **Disable: Block all incoming traffic from the public internet**. |
    | Use your own virtual network | Select **Yes**. |
    | Virtual network | Select the virtual network you created (for example, **my-vnet**). |
    | Infrastructure subnet | Select the delegated subnet (for example, **container-apps-subnet**). |
    | Virtual IP | Select **Internal**. |
    | Enable private endpoints | Select **Yes**. |
    | Private endpoint subnet | Select **private-endpoint-subnet**. |
    | DNS | Select **Azure Private DNS zone**. |

1. Select **Create** to create the environment.

### Configure and deploy the container app

1. On *Create Container App*, select the **Container** tab.

1. Select **Use quickstart image** for testing, or clear the checkbox and provide your own container image.

    > [!NOTE]
    > The quickstart image enables ingress automatically. If you don't use the quickstart image, make sure you enable ingress so that your container app can accept traffic from Azure Front Door through the private endpoint.

1. Select **Review + create**, and then select **Create**.

## Verify the environment deployment

Before you create the Azure Front Door profile, confirm that the environment is configured correctly.

1. Go to the resource group you created and open the **Container Apps environment** resource.

1. Select **Networking**.

1. Verify the following settings:

    | Setting | Expected value |
    |---|---|
    | Public network access | **Disabled** |
    | Virtual IP | **Internal** (note the IP address) |
    | Private endpoint connections | At least one connection exists and is approved |

## Create the Azure Front Door Premium profile

Create an Azure Front Door Premium profile to route inbound traffic to your internal container app over Private Link.

1. Search for **Front Door and CDN profiles** in the top search bar.

1. Select **Front Door and CDN profiles** in the search results.

1. Select **Create**.

1. Select **Azure Front Door** and **Quick Create**.

1. Select the **Continue to create a Front Door** button.

1. In *Create a Front Door profile*, in the *Basics* tab, enter the following values.

    | Setting | Action |
    |---|---|
    | Resource group | Select the resource group you created (for example, **my-container-apps**). |
    | Name | Enter a profile name (for example, **my-afd-profile**). |
    | Tier | Select **Premium**. Private Link isn't supported for origins on the Standard tier. |
    | Endpoint name | Enter an endpoint name (for example, **my-afd-endpoint**). |
    | Origin type | Select **Container Apps**. |
    | Origin host name | Select your container app environment. |
    | Enable private link service | Enable this setting. |
    | Region | Select the region of your container app. |
    | Target sub resource | Select **managedEnvironments**. |
    | Request message | Enter a message (for example, **AFD Private Link Request**). |

1. Select **Review + create**, and then select **Create**.

1. After the deployment finishes, select **Go to resource** and find your *Endpoint hostname*. Your hostname looks like the following example. Make a note of this hostname.

    ```text
    my-afd-endpoint.<HASH>.b01.azurefd.net
    ```

## Approve the private endpoint connection

After you deploy Azure Front Door, approve the incoming private endpoint connection request from the Container Apps environment.

1. Go to the **Container Apps environment** resource in the Azure portal.

1. Select **Settings** > **Networking**.

1. Select the link for private endpoint connection requests.

1. Select the pending connection with the description you provided (for example, **AFD Private Link Request**).

1. Select **Approve**.

1. Wait for the status to change to **Approved**.

> [!NOTE]
> Azure Front Door has a known problem where it might create multiple private endpoint connection requests. Approve each request with the matching description.

## Validate the connection

After you approve the private endpoint connection, verify that traffic reaches your container app through Azure Front Door.

1. Browse to the Azure Front Door endpoint hostname you recorded earlier.

1. Verify that your application loads correctly.

1. Confirm that direct access to the container app's default domain fails, since public access is disabled.

1. Verify that DNS resolution for the environment domain resolves to the private IP address within the virtual network.

> [!NOTE]
> Global deployment might take a few minutes to propagate. If you don't see the expected output, wait a few minutes and then refresh.

## Troubleshoot common problems

The following table describes common problems and their resolutions:

| Problem | Resolution |
|---|---|
| Subnet validation errors | Ensure the Container Apps subnet is delegated to `Microsoft.App/environments` and meets the [minimum size requirements](./custom-virtual-networks.md#subnet). |
| Private endpoint creation failure | Ensure the private endpoint is in a separate, nondelegated subnet. |
| Front Door origin returns an error | Verify that the private endpoint connection is approved in the Container Apps environment. It might take a few minutes for the connection to become active. |
| Container app is publicly accessible | Verify that **Public network access** is set to **Disabled** in the Container Apps environment networking settings. |

## Clean up resources

If you don't plan to continue using this application, you can delete the container app and all the associated services by removing the resource group.

1. Select your resource group from the *Overview* section.
1. Select the **Delete resource group** button at the top of the resource group *Overview*.
1. Enter the resource group name in the confirmation dialog.
1. Select **Delete**.

    The process to delete the resource group can take a few minutes.

> [!TIP]
> Having problems? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Related content

- [Networking in Azure Container Apps](./networking.md)
- [Use a private endpoint with an Azure Container Apps environment](./how-to-use-private-endpoint.md)
- [Create a private link to an Azure Container App with Azure Front Door](./how-to-integrate-with-azure-front-door.md)
- [Virtual network configuration](./custom-virtual-networks.md)
- [Private endpoints and DNS](./private-endpoints-with-dns.md)
