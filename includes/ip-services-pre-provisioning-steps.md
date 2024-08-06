---
 title: include file
 description: include file
 services: virtual-network
 sub-services: ip-services
 author: mbender-ms
 ms.service: azure-virtual-network
 ms.topic: include
 ms.date: 08/06/2024
 ms.author: mbender
 ms.custom: include file
---

To utilize the Azure BYOIP feature, you must perform the following steps before the provisioning of your IPv4 address range.

### Requirements and prefix readiness

* The address range must be owned by you and registered under your name with the one of the five major Regional Internet Registries:
    * [American Registry for Internet Numbers (ARIN)](https://www.arin.net/)
    * [Réseaux IP Européens Network Coordination Centre (RIPE NCC)](https://www.ripe.net/)
    * [Asia Pacific Network Information Centre Regional Internet Registries (APNIC)](https://www.apnic.net/)
    * [Latin America and Caribbean Network Information Centre (LACNIC)](https://www.lacnic.net/)
    * [African Network Information Centre (AFRINIC)](https://afrinic.net/)

* The address range must be no smaller than a /24 for Internet Service Providers to accept.

* A Route Origin Authorization (ROA) document that authorizes Microsoft to advertise the address range must be completed by the customer on the appropriate Routing Internet Registry (RIR) website or via their API. The RIR requires the ROA to be digitally signed with the Resource Public Key Infrastructure (RPKI) of your RIR.
    
    For this ROA:
        
    * The Origin AS must be listed as 8075 for the Public Cloud. (If the range will be onboarded to the US Gov Cloud, the Origin AS must be listed as 8070.)
    
    * The validity end date (expiration date) needs to account for the time you intend to have the prefix advertised by Microsoft. Some RIRs don't present validity end date as an option and or choose the date for you.
    
    * The prefix length should exactly match the prefixes that Microsoft advertises. For example, if you plan to bring 1.2.3.0/24 and 2.3.4.0/23 to Microsoft, they should both be named.
  
    * After the ROA is complete and submitted, allow at least 24 hours for it to become available to Microsoft, where it will be verified to determine its authenticity and correctness as part of the provisioning process.

> [!NOTE]
> It is also recommended to create a ROA for any existing ASN that is advertising the range to avoid any issues during migration.

> [!IMPORTANT]
> While Microsoft will not stop advertising the range after the specified date,  it is strongly recommended to independently create a follow-up ROA if the original expiration date has passed to avoid external carriers from not accepting the advertisement.

[!INCLUDE [ip-services-custom-ip-prefix-certificate-creation](ip-services-custom-ip-prefix-certificate-creation.md)]