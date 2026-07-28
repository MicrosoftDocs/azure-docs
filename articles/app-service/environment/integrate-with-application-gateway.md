---
title: Integrate with Azure Application Gateway
description: Integrate an app in your internal load balancer (ILB) App Service Environment with Azure Application Gateway in this end-to-end walk-through.
author: seligj95
ms.assetid: a6a74f17-bb57-40dd-8113-a20b50ba3050
ms.topic: how-to
ms.date: 04/06/2026
ms.author: jordanselig
ms.service: azure-app-service
ms.custom: sfi-image-nochange
#customer intent: As a developer, I want to integrate an app in an ILB App Service Environment with an application gateway, so I can benefit from WAF protection, load balancing, and TLS offloading. 

---
# Integrate an ILB App Service Environment with Azure Application Gateway

This article describes how to configure Azure Application Gateway to point to an application hosted in an App Service Environment. [App Service Environment](./overview.md) is a deployment of Azure App Service in the subnet of an organization's Azure virtual network. App Service Environment can be deployed with an external or internal endpoint for app access. A deployment with an internal endpoint is referred to as an _internal load balancer_ (ILB) App Service Environment.

Application Gateway is a virtual appliance that provides layer 7 load balancing, TLS offloading, and web application firewall (WAF) protection. The gateway can listen on a public IP address and route traffic to your application endpoint. WAFs help secure your web apps by inspecting inbound web traffic to block SQL injections, cross-site scripting, malware uploads and application DDoS, and other attacks. You can get a WAF device from Azure Marketplace or you can use the [Azure Application Gateway](/azure/application-gateway/overview).

The integration of the application gateway with the ILB App Service Environment is at the application level. You configure the application gateway with your ILB App Service Environment for specific apps in your environment. The following diagram demonstrates the scenario:

:::image type="content" source="./media/integrate-with-application-gateway/appgw-highlevel.png" border="false" alt-text="Diagram shows a high-level view of the integration between an application gateway and an app in an ILB App Service Environment.":::

## Prerequisites

- An ILB App Service Environment, as described in [Prepare the ILB App Service Environment](#prepare-the-ilb-app-service-environment).

   - The environment must include an App Service plan.
   
   - The environment must host an App Service app with the ILB App Service Environment set as the application region location.

- An Azure Private DNS zone for the ILB App Service Environment, as described in [Create a Private DNS zone](#create-a-private-dns-zone).

- A public DNS name for your Azure application gateway, as described in [Map the public DNS name to the application gateway](#map-the-public-dns-name-to-the-application-gateway).

- If you plan to use TLS encryption to the application gateway, you need a valid public certificate for binding to your application gateway. For details, see [Create a valid public certificate](#create-a-valid-public-certificate).

### Prepare the ILB App Service Environment

You can create an ILB App Service Environment [in the Azure portal](./creation.md) or by using an [Azure Resource Manager template (ARM template)](./how-to-create-from-template.md).

The ILB App Service Environment provides two resources for your configuration:

- A default domain of the form `<your-app-service-environment-name>.appserviceenvironment.net`.

   :::image type="content" source="./media/integrate-with-application-gateway/ilb-ase.png" border="false" alt-text="Screenshot that shows the domain name for an ILB App Service Environment in the Azure portal.":::

- An internal load balancer provisioned for inbound access. You can check the Inbound address in the IP addresses under App Service Environment Settings. You can create a private DNS zone mapped to this IP address later.

   :::image type="content" source="./media/integrate-with-application-gateway/ip-addresses.png" alt-text="Screenshot that shows the Inbound IP address for an ILB App Service Environment in the Azure portal.":::

The ILB App Service Environment must host an App Service app. When you create the app in the Azure portal, set the **Region** location to the ILB App Service Environment.

### Create a Private DNS zone

You need a [Private DNS zone](/azure/dns/private-dns-overview) for internal name resolution. Create it with the App Service Environment name by defining the following record sets:

| Name | Type | Value |
|:---:|:---:|---|
| `*`     | **A**   | App Service Environment inbound address |
| `@`     | **A**   | App Service Environment inbound address |
| `@`     | **SOA** | App Service Environment DNS name        |
| `*.scm` | **A**   | App Service Environment inbound address |

For detailed instructions, see [Create a Private DNS zone in the Azure portal](/azure/dns/private-dns-getstarted-portal).

### Map the public DNS name to the application gateway

To connect to the application gateway from the internet, you need a routable domain name. The example in this article uses the routable domain name `zava-public.com`. Connections to App Service apps use the domain name `app.zava-public.com`.

After you create the Application Gateway, you need to map the gateway's frontend public IP address to the app domain name. This article creates a record in an Azure DNS zone for the example. To create a DNS zone and recordset, see [Create an Azure DNS zone and record in the Azure portal](/azure/dns/dns-getstarted-portal).

When you map a public domain to an application gateway, you don't need to configure a custom domain in App Service. You can [buy and map an App Service domain](../manage-custom-dns-buy-domain.md#buy-and-map-an-app-service-domain).

### Create a valid public certificate

For security enhancement, bind a TLS certificate for session encryption. The certificate is imported to the application gateway later.

- The certificate file should have a private key.

- Save the certificate in the Personal Information Exchange (_.pfx_) format. 

To bind the TLS certificate to the application gateway, you need a valid public certificate with the following information:

| Name | Description | Value | Example |
|---|---|---|---|
| **Common Name** | A standard certificate or a [wildcard certificate](https://wikipedia.org/wiki/Public_key_certificate#Wildcard_certificate) for the application gateway. | `<your-application-name>.<your-domain-name>` <br> `*.<your-domain-name>` | `app.zava-public.com` <br> `*.zava-public.com` | 
| **Subject Alternative Name** (SAN) | The SAN that allows the connection to the App Service kudu service. If you don't want to publish the App Service kudu service to the internet, this setting is optional. | `<your-application-name>.scm.<your-domain-name>` <br> `*.scm.<your-domain-name>` | `app.scm.zava-public.com` <br> `*.scm.zava-public.com` |

You can [buy and manage an App Service certificate](../configure-ssl-app-service-certificate.md) to use as a TLS certificate and export it in _.pfx_ format.

## Create an application gateway

The following procedure creates an application gateway with an ILB App Service Environment in the Azure portal. For the general instructions to create an application gateway, see [Create an application gateway with a Web Application Firewall in the Azure portal](/azure/web-application-firewall/ag/application-gateway-web-application-firewall-portal).

### Configure basic settings

1. In the [Azure portal](https://portal.azure.com), go to the **Home** page, and select **+ Create a resource**.

1. in the **Marketplace** page, search for **Application Gateway**.

1. On the **Microsoft Application Gateway** card, select **Create** > **Application Gateway**.

1. In the **Create application gateway** pane, configure the following settings on the **Basics** tab:

   1. Select your **Subscription**.

   1. Select an existing **Resource group** or create a new one.

   1. Enter an **Application gateway name**.

   1. Select the **Region** location.

   1. Set the **Tier** to **Standard V2** or **WAF V2** (enables the **WAF** feature on the application gateway). 

   1. Select an existing **Virtual network** or create a new one.

   1. Select an existing **Subnet** or create a new one.

### Configure settings for the frontends

1. Select **Next: Frontends >**, and configure the following **Frontends** settings:

   1. Set the **Frontend IP address type** to **Public**, **Private**, or **Both**.
    
       For the **Private** or **Both** type, you also need to assign a static **Private IP address** in the application gateway subnet range.
    
   1. For the **Public IP address**, enter the public IP address to use for application gateway public access. 
    
        :::image type="content" source="./media/integrate-with-application-gateway/frontends.png" alt-text="Screenshot that shows how to set the public IP address for application gateway access in the Azure portal.":::

   1. Record the public IP address for later, when you add a record for the IP address in your DNS service.

   The example in this article uses the **Public** option to enable public endpoints only.

### Configure settings for the backends

1. Select **Next: Backends >**, and configure the following **Backends** settings:

   <a name="identify-backend-pool"></a>

   1. Enter a **Backend pool name**, such as `zava-backend-pool`.
   
   1. For the **Target type**, select **App Services** or **IP address or FQDN**.

   1. For the **Target**, select the app hosted in your ILB App Service Environment.

   1. Select **Add**.

   The example in this article selects the **App Services** option:

   :::image type="content" source="./media/integrate-with-application-gateway/add-backend-pool.png" alt-text="Screenshot that shows how to add a backend pool for the application gateway in the Azure portal.":::

### Configure routing rules

1. Select **Next: Configuration >**, and then select **Add a routing rule**.

   :::image type="content" source="./media/integrate-with-application-gateway/configuration.png" alt-text="Screenshot that shows how to select 'Add a routing rule' for the application gateway Configuration settings in the Azure portal.":::

1. In the **Add a routing rule** pane, configure the following settings:
   
   1. Enter the **Rule name**, such as `zava-routing-rule`.

   1. Specify the **Priority** for processing the rule in relation to the other rules. Enter a value from 1 (highest priority or first processed) to 20,000 (lowest priority or last processed).

   To complete the rule configure, you need to specify settings for a **Listener** and the **Backend targets**.

### Add an HTTP listener

1. For proof of concept deployment, add an **HTTP** listener with the following settings:
    
   | Setting | Description | Example value |
   |---|---|---|
   | **Listener name** | Enter the name for the listener. | `zava-http-rule-listener` |
   | **Frontend IP** | Identify the frontend IP address type. The example in this article uses an IP that supports public internet access. | Public IPv4 |
   | **Protocol** | Select the protocol for the connection. | **HTTP** <br> **Note**: For this example, don't select **TLS** encryption. |
   | **Port** | Specify the default HTTP port. | 80 |
   | **Listener type** | Indicate whether the listener supports one or more sites. | - For one site only, select **Basic**. <br> - For multiple sites, select **Multi site**. |
   | **Host type** | Identify the website host name type. | - For a single site, select **Single**. <br> - For multiple sites, select **Multiple/Wildcard**. |
   | **Host name** | Enter one or more routable domain names for your App Service app. | `app.zava-public.com`, `app.zava-online.com` |

   The following image shows the routing rule definition and the configuration for an HTTP listener:

   :::image type="content" source="./media/integrate-with-application-gateway/http-routing-rule.png" alt-text="Screenshot that shows how to configure the listener for an HTTP routing rule the application gateway.":::

### Add an HTTPS listener

1. If you want security enhancement, add an **HTTPS** listener with TLS encryption:

   | Setting | Description | Example value |
   |---|---|---|
   | **Listener name** | Enter the name for the listener. | `zave-https-rule-listener` |
   | **Frontend IP** | Identify the frontend IP address type. The example in this article uses an IP that supports public internet access. | Public IPv4 |
   | **Protocol** | Select the protocol for the connection. | **HTTPS** or **TLS** |
   | **Port** | Specify the default HTTPS port. | 443 |
   | **Listener type** | Indicate whether the listener supports one or more sites. | - For one site only, select **Basic**. <br> - For multiple sites, select **Multi site**. |
   | **Host type** | Identify the website host name type. | - For a single site, select **Single**. <br> - For multiple sites, select **Multiple/Wildcard**. |
   | **Host name** | Enter one or more routable domain names for your App Service app. | `app.zava-public-cert.com`, `app.zava-secure.com` |

   For the **Https Settings**, choose the certificate to use for the encrypted connection:
   
   - **Upload a certificate**: Select this option if you want to upload a certificate that contains the CN and the private key with the _.pfx_ format.
   
      1. Enter a **Cert name** to identify the certificate, such as `zava-https-certificate`.

      1. Identify the **PFX certificate file** that defines the certificate. You can use the **Select a file** icon to locate the file by using **File Explorer**.

      1. Enter the certificate **Password**.

   - **Choose a certificate from Key Vault**: Select this option if you want to choose a certificate stored in Azure Key Vault.

      1. Enter a **Cert name** to identify the certificate, such as `zava-https-certificate`.

      1. Identify the **Managed identity** associated with the certificate, such as `zava-https-users`.

         > [!NOTE]
         > If your key vault uses the Role-based access control (RBAC) permission model, You can't use the Azure portal to complete the initial steps to reference the key vault. Instead, use an Azure Resource Manager template (ARM template), Bicep, the Azure CLI, or Azure PowerShell. During the process, the system uses a managed identity that contains the proper RBAC permissions.

      1. Specify the **Key vault** where the certificate is stored, such as `zava-key-vault`.

      1. Identify the **Certificate** ID, such as `https://zava-key-vault.vault.azure.net/secrets/zava-certificate`.

   The following image shows the configuration for an HTTPS listener that accesses a certificate stored in a key vault:

   :::image type="content" source="./media/integrate-with-application-gateway/https-routing-rule.png" alt-text="Screenshot that shows how to configure the listener for an HTTPS routing rule for the application gateway.":::

1. After you configure the HTTPS **Listener** properties, select **Add**.

### Configure the backend pool

1. To complete the routing rule definition, select the **Backend targets** tab, and configure the following settings. For this section, you use the same [backend pool information](#identify-backend-pool) that you specified earlier.

   :::image type="content" source="./media/integrate-with-application-gateway/backend-targets.png" alt-text="Screenshot that shows how to configure the backend targets for an HTTPS routing rule for the application gateway.":::

   1. Set the **Target type** to **Backend pool**.
   
   1. For the **Backend target**, select the [backend pool](#identify-backend-pool) that you specified earlier.
   
   1. For the **Backend settings**, select the **Add new** link and configure the following settings:

      | Setting | Description | Example value |
      |---|---|---|
      | **Backend settings name** | Enter a name to identify the settings for the backend. | `zava-backend-settings` |
      | **Backend protocol** | Select the protocol to use for the backend connection. | **HTTP** or **HTTPS** <br>**Note**: The example in this article uses HTTPS. |
      | **Backend port** | Enter the default port value for the backend connection. | 443 |
      | **Backend certificate validation type** <br><br> and **Backend certificate issuer** | Select the issuer of the certificate and the scope of the validation process. The issuer defines the criteria for a full validation scope. <br> The default domain name of an ILB App Service Environment is `.appserviceenvironment.net`. The issuer for a certificate for this domain is a public trusted root certificate authority (CA). You can choose use to the public CA or a private provider, and specify if you want the validation to be configurable. | - To rely on the full validation process provided by the public authority, select **Complete validation** and **Public CA**. (These options are the default settings.) <br> - To use a private provider with a validation process you can configure to your needs, select **Configurable** and **Private CA**. |
      | **Request time-out (seconds)** | Enter the amount of time the application gateway waits for a response from the backend pool before returning a _Connection timed out_ error message. | 20 |      
      | **Override with new host name** | Specify whether to overwrite the host name header when connecting to the app on the ILB App Service Environment. When you select **Yes**, you also configure the **Host name override** setting. | **Yes** |
      | **Host name override** |  Specify how to override the host name. You can specify to choose a value from the backend target or enter a specific domain name. | **Pick host name from backend target** <br> When you set the backend pool to the App Service app, you can pick the host from the backend target. |
      | **Create custom probes** | Indicate whether to use custom-defined health probes. By default, this setting is enabled (Yes). | **No** |

      The following image shows how to configure the backend settings for an HTTPS protocol connection:

      :::image type="content" source="./media/integrate-with-application-gateway/https-backend-settings.png" alt-text="Screenshot that shows how to configure the backend settings for an HTTPS protocol connection in the Azure portal.":::

1. After you configure the **Backend settings**, select **Add**.

1. To complete the routing rule definition, select **Add**.

1. (Optional) Define tags for the resource.

1. Select **Review + Create** and review the configuration settings. When you're ready to prepare the application gateway, select **Create**.

## Configure gateway integration with the environment

You access the ILB App Service Environment from the application gateway by using an Azure Virtual Network link to an Azure Private DNS zone. The Private DNS zone link points to the virtual network that contains the application gateway.

### Check for an existing virtual network link

Check the virtual network links in your [Private DNS zone](#create-a-private-dns-zone) and confirm you have a link for your application gateway:

1. In the [Azure portal](https://portal.azure.com), go to your **Application Gateway** resource.

1. Record the virtual network that contains the gateway resource:

   :::image type="content" source="./media/integrate-with-application-gateway/gateway-virtual-network.png" alt-text="Screenshot that shows how to locate the virtual network that contains the application gateway in the Azure portal.":::

1. Go to your **Private DNS zone** resource.

1. In the left menu, select **DNS Management** > **Virtual Network Links**.

   The right pane lists any existing links. Each link indicates the virtual network for the integration.

1. Locate a link that has an integration for the virtual network that contains your application gateway.

   If you don't have a link to the virtual network for your application gateway, complete the procedure in the following section and add a virtual network link.

### Configure a virtual network link with a Private DNS zone

1. In the [Azure portal](https://portal.azure.com), go to your **Private DNS zone** resource.

1. In the left menu, select **DNS Management** > **Virtual Network Links**.

1. Select **+ Add**.

1. In the **Add Virtual Network Link** pane, configure the new link:

   - Enter a **Link name**.
   
   - Select your **Subscription**.
   
   - Select the **Virtual Network** that contains your application gateway.

   :::image type="content" source="./media/integrate-with-application-gateway/vnet-link.png" alt-text="Screenshot that shows how to create a new virtual network link in a Private DNS zone in the Azure portal.":::

1. Select **Create**.

### Confirm the backend health status

After you confirm the virtual network link, you can monitor the backend health status for your application gateway.

1. In the [Azure portal](https://portal.azure.com), go to your **Application Gateway** resource.

1. In the left menu, select **Monitoring** > **Backend health**.

   :::image type="content" source="./media/integrate-with-application-gateway/backend-health.png" alt-text="Screenshot that shows how to monitor the backend health status for an application gateway in the Azure portal.":::

### Add a public DNS record

To access the application gateway from the internet, you need to configure DNS mapping.

You can create a public record in an [Azure DNS zone](/azure/dns/dns-getstarted-portal) to point to the frontend public IP address for your application gateway.

1. In the [Azure portal](https://portal.azure.com), go to your **Application Gateway** resource.

1. In the left menu, select **Settings** > **Frontend IP configurations**.

1. Locate the **Public** frontend IP address for the application gateway:

   :::image type="content" source="./media/integrate-with-application-gateway/frontend-ip.png" alt-text="Screenshot that shows how to locate the public frontend IP address for the application gateway in the Azure portal.":::

1. Go to the **Azure DNS zone** resource.
 
1. In the left menu, select **DNS Management** > **Recordsets**.

1. Select **+ Add** and add a record to map your app domain name to the frontend public IP address of your application gateway.

   :::image type="content" source="./media/integrate-with-application-gateway/dns-service.png" alt-text="Screenshot that shows a record added to the DNS zone to map the app domain name to the public IP address of the application gateway.":::

### Validate the connection

Verify the name resolution for the app domain name to the application gateway frontend public IP address.

- Check the connection from a device connected to the internet:

   :::image type="content" source="./media/integrate-with-application-gateway/name-resolution.png" alt-text="Screenshot of a command window showing a name resolution check on the app domain name to the gateway public IP address.":::

- Test web access to the domain for your app in a browser:

   :::image type="content" source="./media/integrate-with-application-gateway/access-web-small.png" alt-text="Screenshot of a browser window showing a test to verify access to the app domain name." lightbox="./media/integrate-with-application-gateway/access-web.png":::

## Related content

- [Azure Application Gateway](/azure/application-gateway/overview)
- [Create an Azure DNS zone and record in the Azure portal](/azure/dns/dns-getstarted-portal)
