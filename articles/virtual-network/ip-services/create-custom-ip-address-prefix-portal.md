---
title: Create a custom IP address prefix - Azure portal
titleSuffix: Azure Virtual Network
description: Learn about how to onboard a custom IP address prefix using the Azure portal
author: asudbring
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.date: 02/03/2022
ms.author: allensu

---

# Create a custom IP address prefix using the Azure portal

Use of a custom IP address prefix enables you to bring your own IP ranges to Microsoft and associate it to your Azure subscription. The range would continue to be owned by you, though Microsoft would be permitted to advertise it to the Internet. A custom IP address prefix functions as a regional resource that represents a contiguous block of customer owned IP addresses. 

The steps in this article detail the full process to:

* Prepare a range to provision

* Provision the range for IP allocation

* Enable the range to be advertised by Microsoft

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

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
    
    ```azurepowershell-interactive
    openssl genrsa -out byoipprivate.key 2048
    Set-Content -Path byoippublickey.cer (openssl req -new -x509 -key byoipprivate.key -days 180) -NoNewline
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
 
    ```azurepowershell-interactive
    $byoipauth="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|1.2.3.0/24|yyyymmdd"
    Set-Content -Path byoipauth.txt -Value $byoipauth -NoNewline
    openssl dgst -sha256 -sign byoipprivate.key -keyform PEM -out byoipauthsigned.txt byoipauth.txt
    $byoipauthsigned=(openssl enc -base64 -in byoipauthsigned.txt) -join ''
    ```

## Provisioning steps

The following steps display the procedure for provisioning a sample customer range (1.2.3.0/24) to the US West 2 region.

> [!NOTE]
> Clean up or delete steps aren't shown on this page, given the nature of the resource. For information on removing a provisioned custom IP prefix, see [Manage custom IP prefix](manage-custom-ip-address-prefix.md).

## Create and Provision a custom IP address prefix

1. In the search box at the top of the portal, enter **Custom IP**.

2. In the search results, select **Custom IP Prefixes**.

3. Select **+ Create**.

4. In **Create custom IP prefix**, enter, or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription |
    | Resource group | Select **Create new**. </br> Enter **myResourceGroup**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myCustomIPPrefix**. |
    | Region | Select **West US 2**. |
    | Availability Zones | Select **Zone-redundant**. |
    | IPv4 Prefix (CIDR) | Enter **1.2.3.0/24**. |
    | ROA expiration date | Enter in your ROA expiration date in yyyymmdd format. |
    | Signed message | Paste in the output of $byoipauthsigned from the earlier section. |

5. Select the **Review + create** tab or the blue **Review + create** button at the bottom of the page.

6. Select **Create**.

The range will be pushed to the Azure IP Deployment Pipeline. The deployment process is asynchronous.  You can check the status by reviewing the **Commissioned state** field for the Custom IP Prefix.

> [!NOTE]
> The estimated time to complete the provisioning process is 30 minutes.

> [!IMPORTANT]
> After the custom IP prefix is in a "Provisioned" state, a child public IP prefix can be created. These public IP prefixes and any public IP addresses can be attached to networking resources. For example, virtual machine network interfaces or load balancer front ends. The IPs won't be advertised and therefore won't be reachable. For more information on a migration of an active prefix, see [Manage a custom IP prefix](manage-custom-ip-address-prefix.md).

## Create a public IP prefix from custom IP prefix

Once you create a prefix, you must create static IP addresses from the prefix. In this section, you'll create a static IP address from the prefix you created earlier.

1. In the search box at the top of the portal, enter **Custom IP**.

2. In the search results, select **Custom IP Prefixes**.

3. In **Custom IP Prefixes**, select **myCustomIPPrefix**.

4. In **Overview** of **myCustomIPPrefix**, select **+ Add a public IP prefix**.

5. Enter **myPublicIPPrefix** in **Name**.
 
6. Ensure the **Subscription** and **Region** match the region of the **myCustomIPPrefix**.

7. Ensure for **Prefix ownership** that "Custom IP Prefix" is selected, and that in the **Custom IP Prefix** menu that **myCustomIPPrefix** is selected.
 
8. Use the **Prefix size** menu to specify the desired size of the prefix (note it can be as large as the Custom IP Prefix).

9. Select **Review + create**, and then **Create** on the following page.

10. Repeat steps 1-3 as necessary to return to the **Overview** page for **myCustomIPPrefix**.  You should now see **myPublicIPPrefix** listed under the **Associated public IP prefixes** section. You can now allocate Standard SKU Public IP addresses from this prefix.  For more information, see [Create a static public IP address from a prefix](manage-public-ip-address-prefix.md#create-a-static-public-ip-address-from-a-prefix)].

## Commission the custom IP address prefix

Once the custom IP prefix is in “Provisioned” state, you'll need to update the prefix to begin the process of advertising the range from Azure.

1. In the search box at the top of the portal, enter **Custom IP**.

2. In the search results, select **Custom IP Prefixes**.

3. In **Custom IP Prefixes**, select **myCustomIPPrefix**.

4. In **Overview** of **myCustomIPPrefix**, select **Commission**.

As before, the operation is asynchronous. You can check the status by reviewing the **Commissioned state** field for the Custom IP Prefix, which will initially show the prefix as “Commissioning”, followed in the future by “Commissioned”. The advertisement rollout isn't binary and the range will be partially advertised while still in "Commissioning".

> [!NOTE]
> The estimated time to fully complete the commissioning process is 3-4 hours.

> [!IMPORTANT]
> As the custom IP prefix transitions to a "Commissioned" state, the range is being advertised with Microsoft from the local Azure region and globally to the Internet by Microsoft's wide area network under Autonomous System Number (ASN) 8075. Advertising this same range to the Internet from a location other than Microsoft at the same time could potentially create BGP routing instability or traffic loss. For example, a customer on-premises building. Plan any migration of an active range during a maintenance period to avoid impact.

## Next steps

- Learn how to further [manage custom IP address prefixes](manage-custom-ip-address-prefix.md).
- Learn about scenarios and benefits of using a [custom IP address prefix](custom-ip-address-prefix.md) to bring your IP address ranges to Azure.