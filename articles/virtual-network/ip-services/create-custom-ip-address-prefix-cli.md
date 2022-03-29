---
title: Create a custom IP address prefix - Azure CLI
titleSuffix: Azure Virtual Network
description: Learn about how to onboard a custom IP address prefix using Azure CLI
author: asudbring
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 02/03/2022
ms.author: allensu

---

# Create a custom IP address prefix  using Azure CLI

Use of a custom IP address prefix enables you to bring your own IP ranges to Microsoft and associate it to your Azure subscription. The range would continue to be owned by you, though Microsoft would be permitted to advertise it to the Internet. A custom IP address prefix functions as a regional resource that represents a contiguous block of customer owned IP addresses. 

The steps in this article detail the full process to:

* Prepare a range to provision

* Provision the range for IP allocation

* Enable the range to be advertised by Microsoft

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

- This tutorial requires version 2.28 or later of the Azure CLI (you can run az version to determine which you have). If using Azure Cloud Shell, the latest version is already installed.

- Sign in to Azure CLI and ensure you have selected the subscription with which you want to use this feature using `az account`.

> [!NOTE]
> For problems encountered during the provisioning process, please see [Troubleshooting for custom IP prefix](manage-custom-ip-address-prefix.md#troubleshooting-and-faqs).

> [!NOTE]
> Note that a sample customer range (1.2.3.0/24) is used for this example, which would not be validated by Azure.  Please substitute in applicable customer range/region/etc as required.

## Pre-provisioning steps

In order to utilize the Azure BYOIP feature, you must perform the following steps prior to the provisioning of your IP address range:

### Requirements and prefix readiness

* The address range must be owned by you and registered under your name with the [American Registry for Internet Numbers (ARIN)](https://www.arin.net/), the [Réseaux IP Européens Network Coordination Centre (RIPE NCC)](https://www.ripe.net/), or the [Asia Pacific Network Information Centre Regional Internet Registries (APNIC)](https://www.apnic.net/). If the range is registered under the Latin America and Caribbean Network Information Centre (LACNIC) or the African Network Information Centre (AFRINIC), contact the [Microsoft Azure BYOIP team](mailto:byoipazure@microsoft.com).

* The address range must be no smaller than a /24 so it will be accepted by Internet Service Providers.

* A Route Origin Authorization (ROA) document that authorizes Microsoft to advertise the address range must be filled out by the customer on the appropriate Routing Internet Registry website. ARIN, RIPE, and APNIC.  
    
    For this ROA:
        
    * The Origin AS must be listed as 8075
    
    * The validity end date (expiration date) needs to account for the time you intend to have the prefix advertised by Microsoft. Note that some RIRs don't present validity end date as an option and or choose the date for you.
    
    * The prefix length should exactly match the prefixes that can be advertised by Microsoft. For example, if you plan to bring 1.2.3.0/24 and 2.3.4.0/23 to Microsoft, they should both be named.
  
    * After the ROA is complete and submitted, allow at least 24 hours for it to become available to Microsoft.

### Certificate readiness

In order to authorize Microsoft to associate a prefix with a customer subscription, a public certificate must be compared against a signed message. 

Execute the following commands in PowerShell with OpenSSL installed.  

The following steps show the steps required to prepare sample customer range (1.2.3.0/24) for provisioning.
    
1. A [self-signed X509 certificate](https://en.wikipedia.org/wiki/Self-signed_certificate) must be created to add to the Whois/RDAP record for the prefix For information on RDAP, see the [ARIN](https://www.arin.net/resources/registry/whois/rdap/), [RIPE](https://www.ripe.net/manage-ips-and-asns/db/registration-data-access-protocol-rdap), and [APNIC](https://www.apnic.net/about-apnic/whois_search/about/rdap/) sites. 

    An example utilizing the OpenSSL toolkit is shown below.  The following commands generate an RSA key pair and create an X509 certificate using the key pair that expires in six months:

    ```azurecli-interactive
    openssl genrsa -out byoipprivate.key 2048
    openssl req -new -x509 -key byoipprivate.key -days 180 | tr -d "\n" > byoippublickey.cer
    ```
    
 2. After the certificate is created, update the public comments section of the Whois/RDAP record for the prefix. In order to display for copying, including the BEGIN/END header/footer with dashes, use the command `cat byoippublickey.cer` You should be able to perform this procedure via your Routing Internet Registry.  

    Instructions for each registry are below:
  
    * [ARIN](https://www.arin.net/resources/registry/manage/netmod/) - edit the "Comments" of the prefix record
    * [RIPE](https://www.ripe.net/manage-ips-and-asns/db/support/updating-the-ripe-database) - edit the "Remarks" of the inetnum record
    * [APNIC](https://www.apnic.net/manage-ip/using-whois/updating-whois/) - in order to edit the prefix record, contact helpdesk@apnic.net
    * For ranges from either LACNIC or AFRINIC registries, please create a support ticket with Microsoft.
     
    After the public comments are filled out, the Whois/RDAP record should look like the example below. Ensure there aren't spaces or carriage returns. Include all dashes:

    _Comment:-----BEGIN CERTIFICATE-----abcdefghijklmnopqrstuvwxyz1234567890-----END CERTIFICATE----_
     
3. To create the message that will be passed to Microsoft, first create a string that contains relevant information about your prefix and subscription and then sign this message with the key pair generated in the steps above. Use the format shown below, substituting your subscription ID, prefix to be provisioned, and expiration date matching the Validity Date on the ROA. Ensure the format is in that order. 

    Use the following command to create a signed message that will be passed to Microsoft for verification.  

    > [!NOTE]
    > If the Validity End date was not included in the original ROA, pick a date that corresponds to the time you intend to have the prefix advertised by Azure.

    ```azurecli-interactive
    byoipauth="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|1.2.3.0/24|yyyymmdd"
    byoipauthsigned=$(echo $byoipauth | tr -d "\n" | openssl dgst -sha256 -sign byoipprivate.key -keyform PEM | openssl base64 | tr -d "\n")'
    ```

## Provisioning steps

The following steps display the procedure for provisioning a sample customer range (1.2.3.0/24) to the US West region.  

> [!NOTE]
> Clean up or delete steps aren't shown on this page, given the nature of the resource. For information on removing a provisioned custom IP prefix, see [Manage custom IP prefix](manage-custom-ip-address-prefix.md).

### Create a resource group and specify the prefix and authorization messages

Create a resource group in the desired location (region) for provisioning the BYOIP range.
```azurecli-interactive
  az group create \
    --name myResourceGroup \
    --location westus
```
### Provision a Custom IP address prefix

The following command creates a custom IP prefix in the specified region and resource group. Specify the exact prefix in CIDR notation as a string to ensure there's no syntax error. For the `-Message` parameter, substitute your subscription ID, prefix to be provisioned, and expiration date matching the Validity Date on the ROA. Ensure the format is in that order.

```azurecli-interactive
  byoipauth="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|1.2.3.0/24|yyyymmdd"
  
  az network public-ip prefix create \
    --name myCustomIpPrefix \
    --resource-group myResourceGroup \
    --location westus \
    --cidr ‘1.2.3.0/24’ \
    --authorization-message $byoipauth \
    --signed-message $byoipauthsigned
```
The range will be pushed to the Azure IP Deployment Pipeline. The deployment process is asynchronous. To determine the status, execute the following command:   

 ```azurecli-interactive
  az network custom-ip prefix show \
    --name myCustomIpPrefix \
    --resource-group myResourceGroup
```
Sample output is shown below, with some fields removed for clarity:

```
{
  "cidr": "1.2.3.0/24",
  "commissionedState": "Provisioning",
  "id": "/subscriptions/xxxx/resourceGroups/myResourceGroup/providers/Microsoft.Network/customIPPrefixes/myCustomIpPrefix",
  "location": "westus",
  "name": myCustomIpPrefix,
  "resourceGroup": "myResourceGroup",
}
```

The **CommissionedState** field should show the range as “Provisioning” initially, followed in the future by “Provisioned”.

> [!NOTE]
> The estimated time to complete the provisioning process is 30 minutes.

> [!IMPORTANT]
> After the custom IP prefix is in a "Provisioned" state, a child public IP prefix can be created. These public IP refixes and any public IP addresses can be attached to networking resources. For example, virtual machine network interfaces or load balancer front ends. The IPs won't be advertised and therefore won't be reachable. For more information on a migration of an active prefix, see [Manage a custom IP prefix](manage-custom-ip-address-prefix.md).

### Commission the custom IP address prefix

When the custom IP prefix is in “Provisioned” state, the following command updates the prefix to begin the process of advertising the range from Azure.

```azurecli-interactive
az network custom-ip prefix update \
    --name myCustomIpPrefix \
    --resource-group myResourceGroup \
    --state commission 
```

As before, the operation is asynchronous. The [az network custom-ip prefix show](/cli/azure/network/custom-ip/prefix#az_network_custom_ip_prefix_show) command can be used again to retrieve the status. The **CommissionedState** field will initially show the prefix as “Commissioning”, followed in the future by “Commissioned”. The advertisement rollout isn't binary and the range will be partially advertised while still in "Commissioning".

> [!NOTE]
> The estimated time to fully complete the commissioning process is 3-4 hours.

> [!IMPORTANT]
> As the custom IP prefix transitions to a "Commissioned" state, the range is being advertised with Microsoft from the local Azure region and globally to the Internet by Microsoft's wide area network under Autonomous System Number (ASN) 8075. Advertising this same range to the Internet from a location other than Microsoft at the same time could potentially create BGP routing instability or traffic loss. For example, a customer on-premises building. Plan any migration of an active range during a maintenance period to avoid impact.

## Next steps

- Learn how to [create public IP address prefixes](manage-custom-ip-address-prefix.md) from your provisioned IP address range.
- Learn about scenarios and benefits of using a [custom IP address prefix](custom-ip-address-prefix.md) to bring your IP address ranges to Azure.