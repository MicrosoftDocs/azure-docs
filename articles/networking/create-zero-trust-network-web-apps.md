---
title: Deploy a Zero Trust Virtual Network for Web Applications
description: Deploy a Zero Trust virtual network configuration for web applications in Azure using Azure Firewall, Azure Application Gateway, Web Application Firewall, and other virtual network services.
author: mbender
ms.author: chplut
ms.service: virtual-network
ms.topic: how-to
ms.date: 12/31/2022
ms.custom: template-how-to
# Customer Intent: As a cloud architect, I want to deploy a web app based on Zero Trust principles so that my applications & traffic are always secure.
---
# Deploy a zero trust network for web applications

## Introduction

This how-to follows the [Zero Trust Network for Web Applications reference architecture](/azure/architecture/example-scenario/gateway/application-gateway-before-azure-firewall) from the Azure Architecture Center. The reference architecture's intention is to guide you to publish a web application with secure access through a Web Application Firewall (WAF) and a traditional stateful firewall. In this scenario, the WAF is provided by the application gateway to inspect traffic for SQL injection, cross-site scripting, and other common Open Web Application Security Project (OWASP) rulesets. The stateful packet inspection performed by the Azure Firewall provides extra protection from malicious packets. All communication between services is secured with end-to-end TLS using trusted certificates.

:::image type="content" source="media/create-zero-trust-network-web-apps/zero-trust-diagram.png" alt-text="Diagram of secure virtual network architecture for a web app.":::

## Prerequisites

To complete the Zero Trust deployment, you'll need:
- A Custom domain name
- A Trusted wildcard certificate for your custom domain
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Visual Studio Code (optional, to assist with an automated deployment)

> [!NOTE]
> If you do not have a custom domain name, consider purchasing one through [Azure App Service](../app-service/manage-custom-dns-buy-domain.md).

## Deploying the resources

 For simplicity in the walk-through, all resources will be deployed to a single resource group. Review your management and governance strategy for an appropriate deployment model in your subscription. The reference architecture contains the following resources:
 - Two [virtual networks](../virtual-network/virtual-networks-overview.md)
    - Hub virtual network
    - Spoke virtual network
 - [Application gateway](../application-gateway/overview.md)
 - [Azure Firewall](../firewall/overview.md)
 - [DNS zones and records](../dns/dns-zones-records.md)
 - [Web application on App Service]()

> [!NOTE]
> The web application in the reference architecture is visualized with a Virtual Machine. This could also be an App Service, Kubernetes cluster or other container environment, or Virtual Machine scale set. In this walk through, we will replace the virtual machine with an App Service.

Other Azure services that will be deployed and configured and not explicitly listed in the reference architecture include:

- [Azure Key Vault](../key-vault/general/overview.md)
- [Managed identity](../active-directory/managed-identities-azure-resources/overview.md)
- [Public IP addresses](../virtual-network/ip-services/public-ip-addresses.md)
- [Network security groups](../virtual-network/network-security-groups-overview.md)
- [Private endpoints](../private-link/private-endpoint-overview.md)
- [Route tables](../virtual-network/manage-route-table.md)


### Deploying the resource group

First up, you create a resource group to store all of the created resources. 

> [!IMPORTANT]
> You may use your own resource group name and desired region. For this how-to, we will deploy all resources to the same resource group, **myResourceGroup**, and deploy all resources to the **East US** Azure region. Use these and your Azure subscription as the default settings throughout the article.
>
> Creating all your resources in the same resource group is good practice for keeping track of resources used, and makes it easier to clean up a demonstration or non-production environment. 

1. From the **Azure portal**, search for and select **Resource groups**.
1. On the **Resource groups** page, select **Create**.
1. Use the following settings or your own to create a resource group:
    
    | Setting | Value |
    | --- | --- |
    |Subscription | Select your subscription. |
    |Resource group | Enter **myResourceGroup**
    | Region | Select **East US**. |

1. Select **Review + Create** and then select **Create**.


### Deploying the Azure Key Vault

In this step, you'll deploy [Azure Key Vault](../key-vault/general/overview.md) to store secrets, keys, and certificates. We'll use a Key Vault to store the public trusted certificate that is used for TLS connections by the application gateway and Azure Firewall in this how-to.

> [!NOTE]
> By default, [soft-delete](../key-vault/general/soft-delete-overview.md) is enabled on Azure Key Vault. This presents the accidental deletion of stored credentials. To allow you to remove the key vault in a timely manner upon completing this how-to, it's recommend to set the **Days to retain deleted vaults** to 7 days.

1. From the Azure portal menu, or from the **Home** page, select **Create a resource**.
1. In the **Search** box, enter **Key Vault** and select **Key Vault** from the results.
1. In the **Key Vault** creation page, select **Create**.
1. In the **Create key vault** page, enter or select these settings along with default values:
    
    | Setting | Value |
    | --- | --- |
    | Name | Enter a unique name for your key vault. This example will use **myKeyVaultZT**. |
    | Pricing tier | Select **Standard**. |
    | Days to retain deleted vaults | Enter **7**. |
    | Purge Protection | Select **Disable purge protection (allow key vault and objects to be purged during retention period)**. |

1. Select **Review + Create** and then select **Create**.

### Upload a certificate to Key Vault

In this task, you'll upload your trusted wildcard certificate for your public domain.

> [!NOTE]
> This task requires a trusted digital certificate for a public domain which you own. Without the certificate, you will not be able to deploy this architecture example in it's entirety.
> In Azure Key Vault, supported certificate formats are PFX and PEM.
> - .pem file format contains one or more X509 certificate files.
> - .pfx file format is an archive file format for storing several cryptographic objects in a single file i.e. server certificate (issued for your domain), a matching private key, and may optionally include an intermediate CA.  

1. Navigate to the previously created key vault, **myKeyVaultZT**.
1. In the **Key Vault** page, select **Certificates** under **Objects**.
1. On the **Certificates** page, select **+ Generate/Import**
1. On the **Create a certificate** page, enter or select these settings along with default values:
    
    | Setting | Value |
    | --- | --- |
    | Method of Certificate Creation | Select **Import**. |
    |Certificate Name | Enter **myTrustedWildCard**. |
    | Upload Certificate File | Select the folder icon and browse to the location of your certificate file. <br/> Select file and select **Open** to upload certificate. </br>  |
    | Password | Enter the certificate password. |

1. Select **Create**.

### Deploy a user-assigned managed identity

You'll create a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) and give that identity access to the Azure Key Vault. The application gateway and Azure Firewall will then use this identity to retrieve the certificate from the vault. 

1. In the **Search** box, enter and select **Managed identities**.
1. Select **+ Create**.
1. On the **Basics** tab, select **myManagedIDappGW** for **Name**.
1. Select **Review + Create** and select **Create**.

#### Assign access to Key Vault for the managed identity

1. Navigate to the previously created key vault, **myKeyVaultZT**.
1. In the **Key Vault** page, select the **Access configuration** from the left-side menu under **Settings**.
1. In the **Access configuration** page, leave the default of **Vault access policy** and select **Go to access
1. In the **Access policies** page, select **+ Create**.
1. In the **Create an access policy** page, select **Get** under **Secret Permissions** and **Certificate permissions**. Select **Next**.
1. On the **Principals** tab, search for and select the **myManagedIDappGW** identity.
1. Select **Next** > **Next** > **Create**.

### Deploying the virtual networks
You'll deploy a hub and spoke architecture for your web application. The hub network contains a centralized Azure Firewall that is used to inspect traffic for the application. The spoke network contains two subnets, one for the application gateway and one for the App Service. 

1. Select **+ Create a resource** in the upper left-hand corner of the portal.
1. In the search box, enter **Virtual Network**. Select **Virtual Network** in the search results.
1. In the **Virtual Network** page, select **Create**.
1. In **Create virtual network**, enter **Name** of **hub-vnet** on the **Basics** tab.

1. Select the **IP Addresses** tab, or select the **Next: IP Addresses** button at the bottom of the page and enter these settings along with default values:

    | Setting   | Value  |
    |--|-|
    | IPv4 address space | Enter **192.168.0.0/16**.     |
    | Select **+ Add subnet**       |
    | Subnet name | Enter **AzureFirewallSubnet**. |
    | Subnet address range | Enter **192.168.100.0/24**.  |
    | Select **Add**.    | |
   
1. Select the **Review + create** > **Create**.
1. Repeat this process to create a second virtual network using the following settings:
    
    | Setting            | Value      |
    |--|-|
    | **Instance details** |   |
    | Name | **spoke-vnet** |
    | IPv4 address space | **172.16.0.0/16**  |
    | Select **+ Add subnet** | |
    | Subnet name        |  Enter **AppGwSubnet**. |
    | Subnet address range | Enter **172.16.0.0/24**.   |
    | Subnet name        | **App1**        |
    | Subnet address range |  **172.16.1.0/24**   |
    | Select **Add**.    | |

1. Select the **Review + create** > **Create**.
1. Navigate to the **hub-vnet** that you previously created.
1. From the **Hub virtual network** page, select **Peerings** from under **Settings**.
1. In the **Peerings** page, select **+ Add**.
1. In the **Add peering** page, enter or select these settings along with default values:
    
    | Setting            | Value                      |
    |--| - |
    | **This virtual network** | |
    | Peering link name | Enter **hub-to-spoke**. |
    | Traffic to remote virtual network | Set to **Allow**. |
    | Traffic forwarded from remote virtual network | Set to **Allow** |
    | Virtual network gateway or Route Server | Set to **None** |
    | **Remote virtual network** | |
    | Peering link name | Enter **spoke-to-hub** |
    | Virtual network deployment model | **Resource manager** |
    | I know my resource ID | Keep default of **Unselected** |
    | Subscription | Select your subscription  |
    | Virtual network | **spoke-vnet** |
    | Traffic to remote virtual network | **Allow** |
    | Traffic forwarded from remote virtual network |  **Allow** |
    | Virtual network gateway or Route Server | **None** |

1. Select **Add**.

### Deploying the Azure  DNS zone

To securely access the web app, a fully qualified DNS name must be configured in DNS that matches the listener on the application gateway **and** the certificate that is uploaded to the Key Vault. To accomplish this, you'll create an Azure DNS zone for your domain that will be used later to create the [DNS record](../dns/dns-zones-records.md) for your web app.

1. Select **+ Create a resource** in the upper left-hand corner of the portal.
1. In the Search box, enter **DNS Zone**.
1. From the results list, select **DNS Zone** > **Create**.
1. On the **Basics** tab, enter your domain name.  
1. Select **Review + Create** > **Create**.

>[!NOTE]
> In order to utilize this DNS zone, you will need to update your domain name servers to the name servers provided by Azure DNS. As the name servers may vary between Azure tenants, use the name servers assigned to you by Azure DNS. The Azure DNS name servers are located on the **Overview** page for the DNS zone created.

### Deploying the Azure App Service

You'll deploy [Azure App Service](../app-service/overview.md).for hosting the secured web application.
1. In the search bar, type **App Services**. Under Services, select **App Services**.
1. In the **App Services** page, select **+ Create**.
1. In the **Create Web App** page, enter or select these settings along with default values on the **Basics** tab:

    | Setting            | Value                      |
    |--| - |
    | **Instance Details** |  |
    | Name | Enter a globally unique name for your web app. For example, **myWebAppZT1**. |
    | Publish | Select **Code** |
    | Runtime stack | select **.NET 6 (LTS)**. |
    | Operating System | Select **Windows** |
    | **Pricing Plans** |  |
    | Windows Plan (East US) | Select **Create new** and enter **zt-asp** for the name. |
    | Pricing plan | Leave default of **Standard S1** or select another plan from the menu. |

1. Select **Review + Create** > **Create**.
1. After the deployment completes, navigate to the App Service.
1. From the **App Service** page, select **Networking** from under **Settings**.
1. In the **Inbound Traffic** section, select **Private endpoints**.
1. In the **Private endpoint connection** page, select **+ Add** > **Express**.
1. In the **Add Private Endpoint** pane, enter or select these settings along with default values:

    | Setting | Value            |
    |--| - |
    | Name | **pe-appservice** |
    | Virtual network | **spoke-vnet** |
    | Subnet | **App1** |

1. Select **OK**.

### Deploying the application gateway

You'll deploy an application gateway and the edge ingress solution for the app that performs TLS termination and WAF services. 

1. In the search bar, type **application gateways**. Under Services, select **Application gateways**.
1. In the **Load balancing | Application gateway** page, select **+ Create**.
1. On the **Basics** tab, enter or select these settings along with default values:

    | Setting            | Value                      |
    |--| - |
    | **Instance details** |  |
    | Application gateway name | Enter **myAppGateway**. |
    | Tier | Select **WAF v2**. |
    | Enable autoscaling | Select **No**. |
    | Instance count |  Enter **1**. |
    | Availability zone | Select **None**. |
    | HTTP2 | Select **Disabled**. |
    | WAF Policy | Select **Create new**. <br/> Enter **myWAFpolicy** for the WAF policy name and select **Ok**.</br>|
    | **Configure virtual network** |  |    
    | Virtual network| Select **spoke-vnet**. |
    | Subnet | Select **AppGwSubnet (172.16.0.0/24)**. |

1. Select **Next: Frontends >** and configure the Frontends with the following settings:
    
    | Setting            | Value                      |
    |--| - |
    | Frontend IP address type | Select **Public**. |
    | Public IP address | Select **Add new**. <br/> Enter **myAppGWpip** for public IP name and select **Ok**. |

1. Select  **Next: Backends >**
1. On the **Backends** tab, select **Add a backend pool**.
1. In the **Add a backend pool** pane, enter or select the following settings:
    
    | Setting            | Value                      |
    |--| - |
    | Name | Enter **myBackendPool**. |
    | Target type | Select **App Services**. |
    | Target | Select **myWebAppZT1**. |

1. Select **Add**, and then select **Next: Configuration >**.
1. On the Configuration tab, select **Add a routing rule**.
1. On the Add a routing rule pane, enter the following settings:
    
    | Setting            | Value                      |
    |--| - |    
    | Rule name: Enter **myRouteRule1** |
    | Priority: Enter **100** |

1. Under the **Listener** tab, enter or select these settings along with default values:
    
    | Setting            | Value                      |
    |--| - | 
    | Listener name | Enter **myListener**. |
    | Frontend IP | Select **Public**. |
    | Protocol | Select **HTTPS**. |
    |Port | Leave default of **443**. |
    | **HTTPS Settings** |  |
    | Choose a certificate | Select **Choose a certificate from Key Vault** |
    | Cert name | Enter **myTrustedWildCard**. |
    | Managed identity | Select **myManagedIDappGW**. |
    | Key vault | Select **myKeyVaultZT**. |
    | Certificate | Select **myTrustedWildCard**. |
    | **Additional settings** |  |
    | Listener type | Select **Multi site**. |
    | Host type | Se: **Single**
    | Host name | Enter the external DNS name for the webapp. |
    | Error page url | Select **No**. |
    
    > [!NOTE] 
    > The FQDN used for **Host name** must match the DNS record that you will create in a later step. If necessary, you can come back to the Listener configuration and change this to the DNS record that you create.

1. Select the **Backend targets** tab.
1. On the **Backend targets** tab, enter or select these settings along with default values:
    
    | Setting            | Value                      |
    |--| - |   
    | Target type | Select **Backend pool**. |
    | Backend target | Enter **myBackendPool**. |
    | Backend settings | Select **Add new**. |
    | **Add Backend setting** | |
    | Backend settings name | Enter **myBackendSetting**. |
    | Backend protocol | Select **HTTPS**. |
    | Backend port | Leave default of **443**. |
    | **Trusted root certificate** | |    
    | Use well known CA certificate | Select **Yes**. |
    | **Host Name** | |
    | Override with new host name |  Select **Yes**. |
    | Host name override | Select **Pick host name from backend target**. |
    
1. Select **Add** twice, and then select **Next: Tags >**.
1. Select **Next: Review + create >** and the select **Create**. Deployment can take up to 30 minutes to complete.

### Create a custom health probe

Now, you'll add a custom health probe for your backend pool.
1. Navigate to the previously created application gateway.
1. From the gateway, select **Health probes** under **Settings**.
1. On the Health probe, select **+ Add**.
1. On the Add health probe page, enter or select these settings along with default values:

    | Setting            | Value                      |
    |--| - |
    | Name | Enter **myHealthProbe**. |
    | Protocol | Select **HTTPS**. |
    | Host | Enter the URL of your App Service. For example, **myWebAppZT1.azurewebsites.net**. |
    | Pick host name from backend settings | Select **No**. |
    | Pick port from backend settings | Select **Yes**. |
    | Path | Enter **/**. |
    |Interval | Enter **30**. |
    | Timeout | Enter **30**. |
    | Unhealthy threshold | Enter **3**. |
    | Use probe matching condition | Select **No**. |
    | Backend settings | Select **myBackendPool**. |

1. Select **Test**, and then select **Add**.

### Add the DNS record for the application gateway

1. To retrieve the Public IP address for your application gateway, navigate to the **Overview** page of the application gateway and copy the **Frontend Public IP Address** listed.
1. Navigate to the DNS zone that you previously created.
1. From the DNS zone, select **+ Record set**.
1. On the **Add record set** pane, enter or select these settings along with default values:
    
    | Setting            | Value                      |
    |--| - |
    | Name | Enter **mywebapp**. |
    | Type | Select **A - Alias record to IPv4 address**. |
    | Alias record set | Select **No**. |
    | TTL | Leave default of **1 Hour**. |
    | IP address | Enter public IP address of your application gateway. |

### Test the initial deployment

At this point, you should be able to connect to the App Service through the application gateway. Navigate to the URL of the DNS record that you created to validate that it resolves to the application gateway and that the default App Service page is displayed. If the application gateway page loads with a gateway error, check the **Backend Health** page of the gateway for any errors relating to the backend pool and check your backend settings. 

### Deploying the Azure Firewall

You'll deploy Azure Firewall to perform packet inspection between the application gateway and the App Service. Your digital certificate stored in Key Vault will be used to secure traffic.

> [!NOTE]
> Basic and Standard tier firewalls do not support SSL termination.

1. In the Azure portal, search for and select **Firewalls**.
1. On the Firewalls page, select **+ Create**.
1. On the **Create a firewall** page, enter or select these settings along with default values:
    
    | Setting | Value |
    |----|---- 
    | Name | Enter **myFirewall**. |
    | Availability zone | Select **None**. |
    | Firewall tier | Select **Premium**. |
    | Firewall policy | Select **Add new**.|
    | **Create a new Firewall Policy** | |
    | Policy name | Enter **myFirewalPolicy**. |
    | Policy tier | Select **Premium** and select **OK**. |
    | Choose a virtual network | Select **Use existing**. |
    | Virtual network | Select **hub-vnet**. |
    | Public IP address | Select **Add new**. <br/> Enter **myFirewallpip** and select **OK**.</br> |

1. Select **Review + create** and then select **Create**. This deployment can take up to 30 minutes to complete.

### Configure the firewall policy

In this task, you'll configure the firewall policy used for packet inspection.

1. Navigate to the Azure Firewall that you previously created.
1. In the **Overview** page, locate and select the link to the **myFirewalPolicy** firewall policy.
1. In the **Firewall Policy** page, select the **IDPS** under **Settings**.
1. On the **IDPS** page, select **Alert and deny** and then select **Apply**. Wait for the firewall policy to complete updating before proceeding to the next step.
1. Select **TLS inspection** under **Settings**
1. On the TLS inspection page, select **Enabled**. Then enter or select these settings along with default values:
    
    | Setting | Value |
    |-----|-----|
    | Managed identity | Enter **myManagedIDappGW**. |
    | Key vault | Select **myKeyVaultZT**. |
    | Certificate | Select **myTrustedWildCard**. |

> [!NOTE]
> In this example, we are reusing a wildcard certificate and the same Managed Identity. In a production environment, you might use different certificates, and thus have a different Managed Identity that can access the Key Vault.

1. Select **Save**.
1. Select the **DNS** page under settings.
1. In the DNS page, select **Enabled**. 
1. In the **DNS Proxy** section, select **Enabled**.
1. Select **Apply**.
1. From the firewall policy, select **Network rules**.
1. In the **Network rules** page, select **Add a rule collection**.
1. In the **Add a rule collection** page, enter or select these settings along with default values:
    
    | Setting            | Value                      |
    |--| - |
    | Name | Enter **myRuleCollection**. |
    | Rule collection type | Select **Network**. |
    | Priority | Enter **500**. |
    | Rule collection action | Select **Allow**. |
    | Rule collection group | Select **DefaultNetworkRuleCollectionGroup**. |
    | **Rules** | Create two rules |
    | Name | Enter **appgw-to-as**        
    | Source type | Select **IP address**.
    | Source | Enter **172.16.0.0/24**. |
    | Protocol | Select **TCP**. |
    | Destination ports | Enter **443**. |
    | Destination type | Select **IP addresses**. |
    | Destination | Enter **172.16.1.0/24**. |
    | Name | Enter **as-to-appgw**. |
    | Source type | Select **IP address**. |
    | Source | **172.16.1.0/24**. |
    | Protocol | Select **TCP**. |
    | Destination port | Enter **443**. |
    | Destination type | Select**IP address**. |
    | Destination | Enter **172.16.0.0/24**. |

1. Select **Add**.

### Deploying route tables

You'll create a route table with user-defined route force traffic all App Service traffic through an Azure Firewall. 

1. Type app services in the search. Under Services, select **Route tables**.
1. In the Route tables page, select **+ Create**.
1. On the Create Route table page, enter or select these settings along with default values:
    
    | Setting            | Value                      |
    |--| - |
    | Name | Enter **myRTspoke2hub**. |
    | Propagate gateway routes | Select **Yes** |

1. Select **Review + Create**, and then select **Create**.
1. Navigate back to the Route Tables page and then select **+ Create**.
1. On the **Create Route** table page, enter or select these settings along with default values:
    
    | Setting            | Value                      |
    |--| - |
    | Name | Enter **myRTapp2web**. |
    | Propagate gateway routes | Select **Yes** |

1. Select **Review + Create**, and then select **Create**.

### Configuring route tables

1. Navigate to the **myRTspoke2hub** route table.
1. From the Route Table, select the **Routes** page under **Settings** and select **+ Add**.
1. On the **Add Route** pane, enter or select these settings along with default values:

    | Setting            | Value                      |
    |--| - |
    | Route name | Enter **ToAppService**. |
    | Address prefix destination | Select **IP addresses**. |
    | Destination IP addresses/CIDR ranges | Enter **172.16.1.0/24**. |
    | Next hop type | Select **Virtual appliance**. |
    | Next hop address |   The private IP address of the Azure Firewall. For example, **192.168.100.4**. |

1. Select **Add**.
1. From the Route table, select **Subnets** under **Settings** and select **+ Associate**.
1. On the **Associate subnet** pane, select the **spoke-vnet** virtual network, and then select the **AppGwSubnet** subnet.
1. Select **OK**.
1. After the association appears, select the link to the **AppGwSubnet** association.
1. In the **Network policy for private endpoints** section, select **Route Tables** and select **Save**.
1. Navigate to the **myRTapp2web** route table.
1. From the **Route Table** page, select **Routes** under **Settings**.
1. In the Add Route pane, enter or select these settings along with default values:
    
    | Setting            | Value                      |
    |--| - |
    | Route name | Enter **ToAppGW**. |   
    | Address prefix destination | Select **IP addresses**. |
    | Destination IP addresses/CIDR ranges | Enter **172.16.0.0/24**. |
    | Next hop type | Select **Virtual appliance**. |
    | Next hop address | Enter the  private IP address of the Azure Firewall. For example, **192.168.100.4**. |

1. Select **Add**.
1. Select the **Subnets** page under settings, and select **+ Associate**.
1. On the **Associate subnet** pane, select the **spoke-vnet** virtual network, and then select the **App1** subnet.
1. Select **OK**.
1. Repeat this process for another subnet by selecting **+ Associate**.
1. Select the **spoke-vnet** virtual network, and then select the **AppGwSubnet** subnet. Select **OK**.
1. After the association appears, select the link to the **App1** association.
1. In the **Network policy for private endpoints** section, select **Network security groups** and **Route Tables**, and then select **Save**.

### Test again

At this point, you should be able to connect to the App Service through the application gateway. Navigate to the URL of the DNS record that you created to validate that it resolves to the application gateway and that the default App Service page is displayed. If the page loads with an error, check the **Backend Health** page of the gateway for any errors relating to the backend pool, and then check your backend settings. Also verify that you have the routes configured correctly. 

The application gateway should be sending traffic to the private IP address of the firewall. The firewall can communicate with the private endpoint through the virtual network peering connection. The route table on the subnet the private endpoint is connected to points back to the firewall to get back to the application gateway.

If you would like to test that the Firewall is actually inspecting or filtering traffic, modify the network rule that you created in the Firewall Policy from **TCP** to **ICMP**. This will then implicitly block TCP traffic from the application gateway and the website access will be denied.

### Deploy the network security groups - optional

You'll deploy network security groups to prevent other subnets from accessing the private endpoint used by the app service.

> [!NOTE]
> In this deployment, network security groups aren't explicitly required. We have configured Route Tables to force the flow of traffic from the defined subnets through an Azure Firewall. However, in a production environment, most organizations have other subnets that might be in the same virtual network or peered to the network that didn't have user-defined routes defined. Network security groups would be beneficial to ensure that other subnets can't access the Private Endpoint of the App Service. Learn more about [network security groups](../virtual-network/network-security-groups-overview.md).

1. From the Azure portal, search for and select **Network security groups**.
1. In the **Network security groups** page, select **Create**.
1. On the Basics tab, enter **nsg-app1** in **Name**.
1. Select **Review + Create** and then select **Create**.
1. Navigate to the newly deployed network security group.
1. In the **network security group** page, select **Inbound security rules** under **Settings**.
1. From **Inbound security rules** page, select **Add**.
1. On the **Add inbound security rule** pane, enter or select these settings along with default values:
    
    | Setting            | Value                      |
    |--| - |
    | Source | Select **IP addresses**. |   
    | Source IP addresses/CIDR ranges | Enter **192.168.100.0/24**. |
    | Source Port ranges | Enter **\***.
    | Destination | Select **Any**. |
    | Service | Select **HTTPS**. |
    | Action | Select **Allow**. |
    | Priority | Enter **300**. |
    | Name | Enter **Allow_HTTPS_From_Firewall**. |

1. Select **Add**.
1. From **Inbound security rules** page, select **Add**.
1. On the **Add inbound security rule** pane, enter or select these settings along with default values:
        
    | Setting            | Value                      |
    |--| - |
    | Source | Select **Any**. |
    | Source Port ranges | Enter **\***. |
    | Destination | Select **Any**. |
    | Service | Select **Custom**. |
    | Destination port ranges | Enter **\***. |
    | Protocol | Select **Any**. |
    | Action | Select **Deny**. |
    | Priority | Enter **310**. |
    | Name | Enter **Deny_All_Traffic**. |

1. Select **Add**.
1. From the **Network security group** page, select **Subnets** under **Settings**.
1. On the **Subnets** page, select **Associate**.
1. In the **Associate subnet** pane, select the **spoke-vnet** virtual network.
1. In the Subnet drop-down, select the **App1** subnet.
1. Select **OK**.

## Clean Up
You'll clean up your environment by deleting the resource group containing all resources, **myResourceGroup**.

## Next steps

After you've created a Zero Trust network for web applications, check out these extra learning opportunities to further your knowledge of Zero Trust security:

> [!div class="nextstepaction"]
- Review the [fundamentals of Zero Trust for Azure infrastructure](/security/zero-trust/azure-infrastructure-overview)
- Complete the Training Guide - [Establish the guiding principles and core components of Zero Trust](/training/paths/zero-trust-principles/)
