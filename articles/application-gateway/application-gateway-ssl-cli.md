---
title: Configure SSL offload - Azure Application Gateway - Azure CLI 2.0 | Microsoft Docs
description: This page provides instructions to create an application gateway with SSL offload by Azure CLI 2.0
documentationcenter: na
services: application-gateway
author: georgewallace
manager: timlt
editor: tysonn

ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/05/2017
ms.author: gwallace

---
# Configure an application gateway for SSL offload by using Azure CLI 2.0

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-ssl-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-ssl-arm.md)
> * [Azure Classic PowerShell](application-gateway-ssl.md)
> * [Azure CLI 2.0](application-gateway-ssl-cli.md)

Azure Application Gateway can be configured to terminate the Secure Sockets Layer (SSL) session at the gateway to avoid costly SSL decryption tasks to happen at the web farm. SSL offload also simplifies the front-end server setup and management of the web application.

## Prerequisite: Install the Azure CLI 2.0

To perform the steps in this article, you need to [install the Azure Command-Line Interface for Mac, Linux, and Windows (Azure CLI)](https://docs.microsoft.com/en-us/cli/azure/install-az-cli2).

## Required components

* **Back-end server pool:** The list of IP addresses of the back-end servers. The IP addresses listed should either belong to the virtual network subnet or should be a public IP/VIP.
* **Back-end server pool settings:** Every pool has settings like port, protocol, and cookie-based affinity. These settings are tied to a pool and are applied to all servers within the pool.
* **Front-end port:** This port is the public port that is opened on the application gateway. Traffic hits this port, and then gets redirected to one of the back-end servers.
* **Listener:** The listener has a front-end port, a protocol (Http or Https, these settings are case-sensitive), and the SSL certificate name (if configuring SSL offload).
* **Rule:** The rule binds the listener and the back-end server pool and defines which back-end server pool the traffic should be directed to when it hits a particular listener. Currently, only the *basic* rule is supported. The *basic* rule is round-robin load distribution.

**Additional configuration notes**

For SSL certificates configuration, the protocol in **HttpListener** should change to *Https* (case sensitive). The **SslCertificate** element is added to **HttpListener** with the variable value configured for the SSL certificate. The front-end port should be updated to 443.

**To enable cookie-based affinity**: An application gateway can be configured to ensure that a request from a client session is always directed to the same VM in the web farm. This scenario is done by injection of a session cookie that allows the gateway to direct traffic appropriately. To enable cookie-based affinity, set **CookieBasedAffinity** to *Enabled* in the **BackendHttpSettings** element.

## Configure SSL offload on an existing application gateway

```azurecli
az network application-gateway frontend-port create --name sslport --port 443 --gateway-name AdatumAppGateway --resource-group AdatumAppGatewayRG

az network application-gateway ssl-cert create --name newcert --cert-file /home/azureuser/self-signed/AdatumAppGatewayCert.pfx --cert-password P@ssw0rd --gateway-name AdatumAppGateway --resource-group AdatumAppGatewayRG

az network application-gateway http-listener create --frontend-ip appGatewayFrontendIP --frontend-port sslport  --name sslListener --ssl-cert newcert --gateway-name AdatumAppGateway --resource-group AdatumAppGatewayRG

az network application-gateway address-pool create --gateway-name AdatumAppGateway -g AdatumAppGatewayRG -n appGatewayBackendPool2 --servers 10.0.0.7 10.0.0.8

az network application-gateway probe create --name probe2 --host 127.0.0.1 --path / --protocol Http  --gateway-name AdatumAppGateway -g AdatumAppGatewayRG

az network application-gateway http-settings create -n settings2 --port 80 --cookie-based-affinity Enabled --probe probe2 --protocol Http --gateway-name AdatumAppGateway -g AdatumAppGatewayRG

az network application-gateway rule create --name rule2 --rule-type Basic --http-settings settings2 --http-listener ssllistener --address-pool temp1 --gateway-name AdatumAppGateway -g AdatumAppGatewayRG

```

## Create an application gateway with SSL Offload

```azurecli
az network application-gateway create --name "AdatumAppGateway3" --location "eastus" --resource-group "AdatumAppGatewayRG2" --vnet-name "AdatumAppGatewayVNET2" --vnet-address-prefix "10.0.0.0/16" --subnet "Appgatewaysubnet2" --subnet-address-prefix "10.0.0.0/28" --servers "10.0.0.5 10.0.0.4" --capacity 2 --sku "Standard_Small" --http-settings-cookie-based-affinity "Enabled" --http-settings-protocol "Http" --frontend-port "80" --routing-rule-type "Basic" --http-settings-port "80" --public-ip-address "pip2" --public-ip-address-allocation "dynamic"  
```

The difference between using the Azure Classic deployment model and Azure Resource Manager is the order that you create an application gateway and the items that need to be configured.

With Resource Manager, all components of an application gateway are configured individually and then put together to create an application gateway resource.

Here are the steps needed to create an application gateway:

1. Create a resource group for Resource Manager
2. Create virtual network, subnet, and public IP for the application gateway
3. Create an application gateway configuration object
4. Create an application gateway resource

## Create a resource group for Resource Manager

Make sure that you switch PowerShell mode to use the Azure Resource Manager cmdlets. More info is available at [Using Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md).

### Step 1

```powershell
Login-AzureRmAccount
```

### Step 2

Check the subscriptions for the account.

```powershell
Get-AzureRmSubscription
```

You are prompted to authenticate with your credentials.

### Step 3

Choose which of your Azure subscriptions to use.

```powershell
Select-AzureRmSubscription -Subscriptionid "GUID of subscription"
```

### Step 4

Create a resource group (skip this step if you're using an existing resource group).

```powershell
New-AzureRmResourceGroup -Name appgw-rg -Location "West US"
```

Azure Resource Manager requires that all resource groups specify a location. This setting is used as the default location for resources in that resource group. Make sure that all commands to create an application gateway uses the same resource group.

In the example above, we created a resource group called **appgw-RG** and location **West US**.

## Create a virtual network and a subnet for the application gateway

The following example shows how to create a virtual network by using Resource Manager:

### Step 1

```powershell
$subnet = New-AzureRmVirtualNetworkSubnetConfig -Name subnet01 -AddressPrefix 10.0.0.0/24
```

This sample assigns the address range 10.0.0.0/24 to a subnet variable to be used to create a virtual network.

### Step 2

```powershell
$vnet = New-AzureRmVirtualNetwork -Name appgwvnet -ResourceGroupName appgw-rg -Location "West US" -AddressPrefix 10.0.0.0/16 -Subnet $subnet
```

This sample creates a virtual network named **appgwvnet** in resource group **appgw-rg** for the West US region using the prefix 10.0.0.0/16 with subnet 10.0.0.0/24.

### Step 3

```powershell
$subnet = $vnet.Subnets[0]
```

This sample assigns the subnet object to variable $subnet for the next steps.

## Create a public IP address for the front-end configuration

```powershell
$publicip = New-AzureRmPublicIpAddress -ResourceGroupName appgw-rg -name publicIP01 -location "West US" -AllocationMethod Dynamic
```

This sample creates a public IP resource **publicIP01** in resource group **appgw-rg** for the West US region.

## Create an application gateway configuration object

### Step 1

```powershell
$gipconfig = New-AzureRmApplicationGatewayIPConfiguration -Name gatewayIP01 -Subnet $subnet
```

This sample creates an application gateway IP configuration named **gatewayIP01**. When Application Gateway starts, it picks up an IP address from the subnet configured and route network traffic to the IP addresses in the back-end IP pool. Keep in mind that each instance takes one IP address.

### Step 2

```powershell
$pool = New-AzureRmApplicationGatewayBackendAddressPool -Name pool01 -BackendIPAddresses 134.170.185.46, 134.170.188.221,134.170.185.50
```

This sample configures the back-end IP address pool named **pool01** with IP addresses **134.170.185.46**, **134.170.188.221**, **134.170.185.50**. Those values are the IP addresses that receive the network traffic that comes from the front-end IP endpoint. Replace the IP addresses from the preceding example with the IP addresses of your web application endpoints.

### Step 3

```powershell
$poolSetting = New-AzureRmApplicationGatewayBackendHttpSettings -Name poolsetting01 -Port 80 -Protocol Http -CookieBasedAffinity Enabled
```

This sample configures application gateway setting **poolsetting01** to load-balanced network traffic in the back-end pool.

### Step 4

```powershell
$fp = New-AzureRmApplicationGatewayFrontendPort -Name frontendport01  -Port 443
```

This sample configures the front-end IP port named **frontendport01** for the public IP endpoint.

### Step 5

```powershell
$cert = New-AzureRmApplicationGatewaySslCertificate -Name cert01 -CertificateFile <full path for certificate file> -Password "<password>"
```

This sample configures the certificate used for SSL connection. The certificate needs to be in .pfx format, and the password must be between 4 to 12 characters.

### Step 6

```powershell
$fipconfig = New-AzureRmApplicationGatewayFrontendIPConfig -Name fipconfig01 -PublicIPAddress $publicip
```

This sample creates the front-end IP configuration named **fipconfig01** and associates the public IP address with the front-end IP configuration.

### Step 7

```powershell
$listener = New-AzureRmApplicationGatewayHttpListener -Name listener01  -Protocol Https -FrontendIPConfiguration $fipconfig -FrontendPort $fp -SslCertificate $cert
```

This sample creates the listener name **listener01** and associates the front-end port to the front-end IP configuration and certificate.

### Step 8

```powershell
$rule = New-AzureRmApplicationGatewayRequestRoutingRule -Name rule01 -RuleType Basic -BackendHttpSettings $poolSetting -HttpListener $listener -BackendAddressPool $pool
```

This sample creates the load balancer routing rule named **rule01** that configures the load balancer behavior.

### Step 9

```powershell
$sku = New-AzureRmApplicationGatewaySku -Name Standard_Small -Tier Standard -Capacity 2
```

This sample configures the instance size of the application gateway.

> [!NOTE]
> The default value for *InstanceCount* is 2, with a maximum value of 10. The default value for *GatewaySize* is Medium. You can choose between Standard_Small, Standard_Medium, and Standard_Large.

## Create an application gateway by using New-AzureApplicationGateway

```powershell
$appgw = New-AzureRmApplicationGateway -Name appgwtest -ResourceGroupName appgw-rg -Location "West US" -BackendAddressPools $pool -BackendHttpSettingsCollection $poolSetting -FrontendIpConfigurations $fipconfig  -GatewayIpConfigurations $gipconfig -FrontendPorts $fp -HttpListeners $listener -RequestRoutingRules $rule -Sku $sku -SslCertificates $cert
```

This sample creates an application gateway with all configuration items from the preceding steps. In the example, the application gateway is called **appgwtest**.

## Get application gateway DNS name

Once the gateway is created, the next step is to configure the front end for communication. When using a public IP, application gateway requires a dynamically assigned DNS name, which is not friendly. To ensure end users can hit the application gateway a CNAME record can be used to point to the public endpoint of the application gateway. [Configuring a custom domain name for in Azure](../cloud-services/cloud-services-custom-domain-name-portal.md). To do this, retrieve details of the application gateway and its associated IP/DNS name using the PublicIPAddress element attached to the application gateway. The application gateway's DNS name should be used to create a CNAME record, which points the two web applications to this DNS name. The use of A-records is not recommended since the VIP may change on restart of application gateway.


```powershell
Get-AzureRmPublicIpAddress -ResourceGroupName appgw-RG -Name publicIP01
```

```
Name                     : publicIP01
ResourceGroupName        : appgw-RG
Location                 : westus
Id                       : /subscriptions/<subscription_id>/resourceGroups/appgw-RG/providers/Microsoft.Network/publicIPAddresses/publicIP01
Etag                     : W/"00000d5b-54ed-4907-bae8-99bd5766d0e5"
ResourceGuid             : 00000000-0000-0000-0000-000000000000
ProvisioningState        : Succeeded
Tags                     : 
PublicIpAllocationMethod : Dynamic
IpAddress                : xx.xx.xxx.xx
PublicIpAddressVersion   : IPv4
IdleTimeoutInMinutes     : 4
IpConfiguration          : {
                                "Id": "/subscriptions/<subscription_id>/resourceGroups/appgw-RG/providers/Microsoft.Network/applicationGateways/appgwtest/frontendIP
                            Configurations/frontend1"
                            }
DnsSettings              : {
                                "Fqdn": "00000000-0000-xxxx-xxxx-xxxxxxxxxxxx.cloudapp.net"
                            }
```

## Next steps

If you want to configure an application gateway to use with an internal load balancer (ILB), see [Create an application gateway with an internal load balancer (ILB)](application-gateway-ilb.md).

If you want more information about load balancing options in general, see:

* [Azure Load Balancer](https://azure.microsoft.com/documentation/services/load-balancer/)
* [Azure Traffic Manager](https://azure.microsoft.com/documentation/services/traffic-manager/)

---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Intent and product brand in a unique string of 43-59 chars including spaces and | Microsoft Docs 
description: 115-145 characters including spaces. Edit the intro para describing article intent to fit here. This abstract displays in the search result.
services: service-name-with-dashes-AZURE-ONLY 
keywords: Don’t add or edit keywords without consulting your SEO champ.
author: github-alias
ms.author: MSFT-alias-person-or-DL
ms.date: 04/05/2017
ms.topic: article-type-from-white-list
# Use only one of the following. Use ms.service for services, ms.prod for on-prem. Remove the # before the relevant field.
# ms.service: service-name-from-white-list
# product-name-from-white-list

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.devlang:devlang-from-white-list
# ms.suite: 
# ms.tgt_pltfrm:
# ms.reviewer:
# manager: MSFT-alias-manager-or-PM-counterpart
---
<!---
Definition of Quickstart: 
Fundamental, Day 1 instructions for new customers to use an Azure subscription to quickly use a specific product/service 
(zero to Wow in < 10 minutes).

Purpose of a QuickStart article: To help customers complete a basic task and try the service quickly. 
1. Include short, simple info and steps since customers may be new to service.
2. Don't include multiple ways to complete the task, just one.
-->

# Page heading (H1)
<!---
Unique, complements the page title, and 100 characters or fewer including spaces
-->

*H1 EXAMPLE*: 
Create a Linux virtual machine with the Azure portal

<!---
Intro paragraph: 
1. 1-2 sentences that explain what customers will do and why it is useful.
2. Include a simple image if it will help customers understand how components or a workflow fit together.
-->

*INTRO EXAMPLE 1*:
Learn how to create an Apache Spark cluster in HDInsight and then use a Jupyter notebook to run Spark SQL interactive queries on the Spark cluster.

*INTRO EXAMPLE 2*:
Azure virtual machines can be created through the Azure portal. This method provides a browser-based user interface for creating and configuring VMs and all related Azure resources.

## Prerequisites (optional section)

<!---
Create this section if your article has more than 2 prereqs. For 1-2 prereqs just use an inline statement. Include assumed expertise and required accounts and software. Replace the text below with your content. 
-->

*PREREQ EXAMPLE 1 (inline prereq statement)*:

Before you start, you need both a private and public SSH key. For detailed information on creating SSH keys for Azure, see [Create SSH keys for Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/mac-create-ssh-keys).

*PREREQ EXAMPLE 2* (Pre-reqs as part of 'Prerequisites' section):

## Prerequisites

Before you begin this QuickStart, have the following ready:

- Azure subscription. If you don't have a subscription, you can create a free trial account in just a couple of minutes. See the [Free Trial](https://azure.microsoft.com/en-us/?WT.srch=1&WT.mc_id=AID559320__SEM_81Yn5nkM&) article for details.
- Azure Storage Account. You use the blob storage as a source data store in this tutorial. if you don't have an Azure storage account, see the [Create a storage account](https://docs.microsoft.com/en-us/azure/storage/storage-create-storage-account) article for steps to create one.
- Azure SQL Database. You use an Azure SQL database as a destination data store in this tutorial. If you don't have an Azure SQL database that you can use in the tutorial, See How to create and configure an Azure SQL Database to create one.
- SQL Server 2012/2014 or Visual Studio 2013. You use SQL Server Management Studio or Visual Studio to create a sample database and to view the result data in the database.

<!---
The next set of H2s describes the steps. Each H2 tells users exactly what they will do ("Create a virtual machine", "Create a cluster," "Run Hive queries").
-->

*STEPS EXAMPLE 1*:

## Create a virtual machine

1. Sign in to the Azure portal at http://portal.azure.com.
2. Select the New button found on the upper left-hand corner of the Azure portal.
3. Select Compute from the Marketplace screen, select Ubuntu Server 16.04 LTS from the featured apps screen, and then click the Create button.
4. Fill out the virtual machine basics form. For Authentication type, SSH is recommended. When pasting in your SSH public key, take care to remove any leading or trailing white space. For Resource group, create a new one. A resource group is a logical container into which Azure resources are created and collectively managed.
5. Choose a size for the VM and click Select.
6. On the settings pane, select Yes under Use managed disks, keep the defaults for the rest of the settings, and click OK.
7. On the summary page, click Ok to start the virtual machine deployment.

<!---
For each step, evaluate if a screen shot adds value to the text and include per the following guidelines:
- Use default Public Portal colors
- Browser included in the first shot (especially) but all shots if possible
- Resize the browser to minimize white space
- Include complete blades in the screenshots
- Linux: Safari – consider context in images
- 1px thick boarder
- Border color is 195,195,195
- Red boxes where appropriate
-->

*STEPS EXAMPLE 2*:

## Assign licenses to users

1. Sign into the Azure classic portal as the global administrator of the directory you want to customize.
2. Select *Active Directory*, and then select the directory where you want to assign licenses.
3. Select the *Licenses* tab, select *Active Directory Premium* or *Enterprise Mobility Suite*, and then select *Assign*.

<!--- Screen shot per above guidelines --->

4. In the dialog box, select the users you want to assign licenses to, and then select the check mark icon to save the changes.

<!--- Screen shot per above guidelines --->

<!---
Other guidelines: 
Tip, note, important, warning: Use these extensions SPARINGLY to highlight info that broadens a user's knowledge. *Tip* is an easier way to do something, *Note* is "by the way" info, *Important* is info critical to completing a task, *Warning* is serious potential problem such as data loss.
-->

## Clean up resources

<!--
This section should explicitly remind users to delete or clean up what was created in the above steps so that they do incur losses such as unexpected billing charges. 
-->

*DELETE EXAMPLE:*
When no longer needed, delete the resource group, virtual machine, and all related resources. To do so, select the resource group from the virtual machine blade and click Delete.

Other quick starts in this collection build upon this quick start. If you plan to continue on to work with subsequent quick starts or with the tutorials, do not clean up the resources created in this quick start. If you do not plan to continue, use the following command to delete all resources created by this quick start.

## Next steps

<!---
1. Link to logical next steps. For example: A scenario that requires this task, A tutorial that is a superset of this QuickStart. 
2. Include no more than 3 next steps.
3. Each next step should have a brief description.  A simple list is ideal.
-->

*NEXT STEPS EXAMPLE:*
- Connect and query using SQL Server Management Studio, see [Connect and query with SSMS](sql-database-connect-query-ssms.md)
- Connect using Visual Studio, see [Connect and query with Visual Studio](sql-database-connect-query.md).
- Technical overview of SQL Database, see [About the SQL Database service](sql-database-technical-overview.md).