---
title: Protect Azure Container Apps with Application Gateway and Web Application Firewall (WAF)
description: Learn how to protect Azure Container Apps with Application Gateway Web Application Firewall (WAF)
services: container-apps
author: cachai2
ms.service: container-apps
ms.topic:  how-to
ms.date: 03/31/2023
ms.author: cachai
---

# Protect Azure Container Apps with Web Application Firewall on Application Gateway

When you host your apps or microservices in Azure Container Apps, you may not always want to publish them directly to the internet. Instead, you may want to expose them through a reverse proxy.

A reverse proxy is a service that sits in front of one or more services, intercepting and directing incoming traffic to the appropriate destination.

Reverse proxies allow you to place services in front of your apps that supports cross-cutting functionality including:

- Routing
- Caching
- Rate limiting
- Load balancing
- Security layers
- Request filtering

This article demonstrates how to protect your container apps using a [Web Application Firewall (WAF) on Azure Application Gateway](../web-application-firewall/ag/ag-overview.md) with an internal Container Apps environment.

For more information on networking concepts in Container Apps, see [Networking Environment in Azure Container Apps](./networking.md).

## Prerequisites

- **Internal environment with custom VNet**: Have a container app that is on an internal environment and integrated with a custom virtual network. For more information on how to create a custom virtual network integrated app, see [provide a virtual network to an internal Azure Container Apps environment](./vnet-custom-internal.md).

- **Security certificates**: If you must use TLS/SSL encryption to the application gateway, a valid public certificate that's used to bind to your application gateway is required.

## Retrieve your container app's domain

Use the following steps to retrieve the values of the **default domain** and the **static IP** to set up your Private DNS Zone.

1. From the resource group's *Overview* window in the portal, select your container app.

1. On the *Overview* window for your container app resource, select the link for **Container Apps Environment**

1. On the *Overview* window for your container app environment resource, select **JSON View** in the upper right-hand corner of the page to view the JSON representation of the container apps environment.

1. Copy the values for the **defaultDomain** and **staticIp** properties and paste them into a text editor. You'll create a private DNS zone using these values for the default domain in the next section.

## Create and configure an Azure Private DNS zone

1. On the Azure portal menu or the *Home* page, select **Create a resource**.

1. Search for *Private DNS Zone*, and select **Private DNS Zone** from the search results.

1. Select the **Create** button.

1. Enter the following values:

    | Setting | Action |
    |---|---|
    | Subscription | Select your Azure subscription. |
    | Resource group | Select the resource group of your container app. |
    | Name | Enter the **defaultDomain** property of the Container Apps Environment from the previous section. |
    | Resource group location | Leave as the default. A value isn't needed as Private DNS Zones are global. |

1. Select **Review + create**. After validation finishes, select **Create**.

1. After the private DNS zone is created, select **Go to resource**.

1. In the *Overview* window, select **+Record set**, to add a new record set.

1. In the *Add record set* window, enter the following values:

    | Setting | Action |
    |---|---|
    | Name | Enter **\***. |
    | Type | Select **A-Address Record**. |
    | TTL | Keep the default values. |
    | TTL unit | Keep the default values. |
    | IP address | Enter the **staticIp** property of the Container Apps Environment from the previous section. |

1. Select **OK** to create the record set.

1. Select **+Record set** again, to add a second record set.

1. In the *Add record set* window, enter the following values:

    | Setting | Action |
    |---|---|
    | Name | Enter **@**. |
    | Type | Select **A-Address Record**. |
    | TTL | Keep the default values. |
    | TTL unit | Keep the default values. |
    | IP address | Enter the **staticIp** property of the Container Apps Environment from the previous section. |

1. Select **OK** to create the record set.

1. Select the **Virtual network links** window from the menu on the left side of the page.

1. Select **+Add** to create a new link with the following values:

    | Setting | Action |
    |---|---|
    | Link name | Enter **my-custom-vnet-pdns-link**. |
    | I know the resource ID of virtual network | Leave it unchecked. |
    | Virtual network | Select the virtual network your container app is integrated with. |
    | Enable auto registration | Leave it unchecked. |

1. Select **OK** to create the virtual network link.

## Create and configure Azure Application Gateway

### Basics tab

1. Enter the following values in the *Project details* section.

    | Setting | Action |
    |---|---|
    | Subscription | Select your Azure subscription. |
    | Resource group | Select the resource group for your container app. |
    | Application gateway name |  Enter **my-container-apps-agw**. |
    | Region | Select the location where your Container App was provisioned. |
    | Tier | Select **WAF V2**. You can use **Standard V2** if you don't need WAF. |
    | Enable autoscaling | Leave as default. For production environments, autoscaling is recommended. See [Autoscaling Azure Application Gateway](../application-gateway/application-gateway-autoscaling-zone-redundant.md). |
    | Availability zone | Select **None**. For production environments, [Availability Zones](/azure/reliability/availability-zones-overview#availability-zones) are recommended for higher availability. |
    | HTTP2 | Keep the default value. |
    | WAF Policy | Select **Create new** and enter **my-waf-policy** for the WAF Policy. Select **OK**. If you chose **Standard V2** for the tier, skip this step. |
    | Virtual network | Select the virtual network that your container app is integrated with. |
    | Subnet | Select **Manage subnet configuration**. If you already have a subnet you wish to use, use that instead, and skip to [the Frontends section](#frontends-tab). |

1. From within the *Subnets* window of *my-custom-vnet*, select **+Subnet** and enter the following values:

    | Setting | Action |
    |---|---|
    | Name | Enter **appgateway-subnet**. |
    | Subnet address range | Keep the default values. |

1. For the remainder of the settings, keep the default values.

1. Select **Save** to create the new subnet.

1. Close the *Subnets* window to return to the *Create application gateway* window.

1. Select the following values:

    | Setting | Action |
    |---|---|
    | Subnet | Select the **appgateway-subnet** you created. |

1. Select **Next: Frontends**, to proceed.

### Frontends tab

1. On the *Frontends* tab, enter the following values:

    | Setting | Action |
    |---|---|
    | Frontend IP address type | Select **Public**. |
    | Public IP address | Select **Add new**. Enter **my-frontend** for the name of your frontend and select **OK** |

   > [!NOTE]
   > For the Application Gateway v2 SKU, there must be a **Public** frontend IP. You can have both a public and a private frontend IP configuration, but a private-only frontend IP configuration with no public IP is currently not supported in the v2 SKU. To learn more, [read here](../virtual-network/ip-services/configure-public-ip-application-gateway.md).

1. Select **Next: Backends**.

### Backends tab

The backend pool is used to route requests to the appropriate backend servers. Backend pools can be composed of any combination of the following resources:

- NICs
- Public IP addresses
- Internal IP addresses
- Virtual Machine Scale Sets
- Fully qualified domain names (FQDN)
- Multi-tenant back-ends like Azure App Service and Container Apps

In this example, you create a backend pool that targets your container app.

1. Select **Add a backend pool**.

1. Open a new tab and navigate to your container app.

1. In the *Overview* window of the Container App, find the **Application Url** and copy it.

1. Return to the *Backends* tab, and enter the following values in the **Add a backend pool** window:

    | Setting | Action |
    |---|---|
    | Name | Enter **my-agw-backend-pool**. |
    | Add backend pool without targets | Select **No**. |
    | Target type | Select **IP address or FQDN**. |
    | Target | Enter the **Container App Application Url** you copied and remove the *https://* prefix. This location is the FQDN of your container app. |

1. Select **Add**.

1. On the *Backends* tab, select **Next: Configuration**.

### Configuration tab

On the *Configuration* tab, you connect the frontend and backend pool you created using a routing rule.

1. Select **Add a routing rule**. Enter the following values:

    | Setting | Action |
    |---|---|
    | Name | Enter **my-agw-routing-rule**. |
    | Priority | Enter **1**. |

1. Under Listener tab, enter the following values:

    | Setting | Action |
    |---|---|
    | Listener name | Enter **my-agw-listener**. |
    | Frontend IP | Select **Public**. |
    | Protocol | Select **HTTPS**. If you don't have a certificate you want to use, you can select **HTTP** |
    | Port | Enter **443**. If you chose **HTTP** for your protocol, enter **80** and skip to the default/custom domain section. |
    | Choose a Certificate | Select **Upload a certificate**. If your certificate is stored in key vault, you can select **Choose a certificate from Key Vault**. |
    | Cert name | Enter a name for your certificate. |
    | PFX certificate file | Select your valid public certificate. |
    | Password | Enter your certificate password. |

    If you want to use the default domain, enter the following values:

    | Setting | Action |
    |---|---|
    | Listener Type | Select **Basic** |
    | Error page url | Leave as **No** |

    Alternatively, if you want to use a custom domain, enter the following values:

    | Setting | Action |
    |---|---|
    | Listener Type | Select **Multi site** |
    | Host type | Select **Single** |
    | Host Names | Enter the Custom Domain you wish to use. |
    | Error page url | Leave as **No** |

1. Select the **Backend targets** tab and enter the following values:

1. Toggle to the *Backend targets* tab and enter the following values:

    | Setting | Action |
    |---|---|
    | Target type | Select **my-agw-backend-pool** that you created earlier. |
    | Backend settings | Select **Add new**. |

1. In the *Add Backend setting* window, enter the following values:

    | Setting | Action |
    |---|---|
    | Backend settings name | Enter **my-agw-backend-setting**. |
    | Backend protocol | Select **HTTPS**. |
    | Backend port | Enter **443**. |
    | Use well known CA certificate | Select **Yes**. |
    | Override with new host name | Select **Yes**. |
    | Host name override | Select **Pick host name from backend target**. |
    | Create custom probes | Select **No**. |

1. Select **Add**, to add the backend settings.

1. In the *Add a routing rule* window, select **Add** again.

1. Select **Next: Tags**.

1. Select **Next: Review + create**, and then select **Create**.

## Add private link to your Application Gateway

This step is required for internal only container app environments as it allows your Application Gateway to communicate with your Container App on the backend through the virtual network.

1. Once the Application Gateway is created, select **Go to resource**.

1. From the menu on the left, select **Private link**, then select **Add**.

1. Enter the following values:

    | Setting | Action |
    |---|---|
    | Name | Enter **my-agw-private-link**. |
    | Private link subnet | Select the subnet you wish to create the private link with. |
    | Frontend IP Configuration | Select the frontend IP for your Application Gateway. |

1. Under **Private IP address settings** select **Add**.

1. Select **Add** at the bottom of the window.

## Verify the container app

# [Default domain](#tab/default-domain)

1. Find the public IP address for the application gateway on its *Overview* page, or you can search for the address. To search, select *All resources* and enter **my-container-apps-agw-pip** in the search box. Then, select the IP in the search results.

1. Navigate to the public IP address of the application gateway.

1. Your request is automatically routed to the container app, which  verifies the application gateway was successfully created.

# [Custom domain](#tab/custom-domain)

1. Find the public IP address for the application gateway on its *Overview* page, or you can search for the address.

    To search, select *All resources* and enter **my-container-apps-agw-pip** in the search box. Then, select the IP in the search results.

1. Next, you need to update your DNS records via your domain provider's website. Open a new browser window to add the DNS records. Set the A record type to point to the IP address of the application gateway.

1. In your browser, enter your domain. Make sure you use the https protocol.

1. Your request is automatically routed to the container app, which  verifies that the application gateway is successfully created.

---

## Clean up resources

When you no longer need the resources that you created, delete the resource group. When you delete the resource group, you also remove all the related resources.

To delete the resource group:

1. On the Azure portal menu, select **Resource groups** or search for and select *Resource groups*.

1. On the *Resource groups* page, search for and select **my-container-apps**.

1. On the *Resource group page*, select **Delete resource group**.

1. Enter **my-container-apps** under *TYPE THE RESOURCE GROUP NAME* and then select **Delete**

## Next steps

> [!div class="nextstepaction"]
> [Azure Firewall in Azure Container Apps](user-defined-routes.md)
