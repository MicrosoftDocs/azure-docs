---
 title: include file
 description: include file
 services: virtual-network
 sub-services: ip-services
 author: mbender-ms
 ms.service: azure-virtual-network
 ms.topic: include
 ms.date: 07/24/2024
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

* A Route Origin Authorization (ROA) document that authorizes Microsoft to advertise the address range must be filled out by the customer on the appropriate Routing Internet Registry (RIR) website or via their API. The RIR requires the ROA to be digitally signed with the Resource Public Key Infrastructure (RPKI) of your RIR.
    
    For this ROA:
        
    * The Origin AS must be listed as 8075 for the Public Cloud. (If the range will be onboarded to the US Gov Cloud, the Origin AS must be listed as 8070.)
    
    * The validity end date (expiration date) needs to account for the time you intend to have the prefix advertised by Microsoft. Some RIRs don't present validity end date as an option and or choose the date for you.
    
    * The prefix length should exactly match the prefixes that can be advertised by Microsoft. For example, if you plan to bring 1.2.3.0/24 and 2.3.4.0/23 to Microsoft, they should both be named.
  
    * After the ROA is complete and submitted, allow at least 24 hours for it to become available to Microsoft, where it will be verified to determine its authenticity and correctness as part of the provisioning process.

> [!NOTE]
> It is also recommended to create a ROA for any existing ASN that is advertising the range to avoid any issues during migration.

> [!IMPORTANT]
> While Microsoft will not stop advertising the range after the specified date,  it is strongly recommended to independently create a follow-up ROA if the original expiration date has passed to avoid external carriers from not accepting the advertisement.

### Certificate readiness

To authorize Microsoft to associate a prefix with a customer subscription, a public certificate must be compared against a signed message. 

The following steps show the steps required to prepare sample customer range (1.2.3.0/24) for provisioning to the Public cloud.

> [!NOTE]
> Execute the following commands in PowerShell with OpenSSL installed.  

    
1. A [self-signed X509 certificate](https://en.wikipedia.org/wiki/Self-signed_certificate) must be created to add to the Whois/RDAP record for the prefix. For information about RDAP, see the [ARIN](https://www.arin.net/resources/registry/whois/rdap/), [RIPE](https://www.ripe.net/manage-ips-and-asns/db/registration-data-access-protocol-rdap), [APNIC](https://www.apnic.net/about-apnic/whois_search/about/rdap/), and [AFRINIC](https://www.afrinic.net/whois/rdap) sites. 

    An example utilizing the OpenSSL toolkit is shown below.  The following commands generate an RSA key pair and create an X509 certificate using the key pair that expires in six months:
    
    ```powershell
    ./openssl genrsa -out byoipprivate.key 2048
    Set-Content -Path byoippublickey.cer (./openssl req -new -x509 -key byoipprivate.key -days 180) -NoNewline
    ```
   
2. After the certificate is created, update the public comments section of the Whois/RDAP record for the prefix. To display for copying, including the BEGIN/END header/footer with dashes, use the command `cat byoippublickey.cer` You should be able to perform this procedure via your Routing Internet Registry.  

    Instructions for each registry are below:
  
    * [ARIN](https://www.arin.net/resources/registry/manage/netmod/) - edit the *Comments* of the prefix record.
    
    * [RIPE](https://www.ripe.net/manage-ips-and-asns/db/support/updating-the-ripe-database) - edit the "Remarks" of the inetnum record.
    
    * [APNIC](https://www.apnic.net/manage-ip/using-whois/updating-whois/) - edit the “Remarks” of the inetnum record using MyAPNIC.
    
    * [AFRINIC](https://afrinic.net/support/my-afrinic-net) - edit the “Remarks” of the inetnum record using MyAFRINIC.
    
    * For ranges from LACNIC registry, create a support ticket with Microsoft.
     
    After the public comments are filled out, the Whois/RDAP record should look like the example below. Ensure there aren't spaces or carriage returns. Include all dashes:
 
    :::image type="content" source="./media/ip-services-pre-provisioning-steps/certificate-example.png" alt-text="Screenshot of example certificate comment":::
    
3. To create the message passed to Microsoft, create a string that contains relevant information about your prefix and subscription. Sign this message with the key pair generated in the previous steps. Use the format that follows, substituting your subscription ID, prefix to be provisioned, and expiration date matching the Validity Date on the ROA. Ensure the format is in that order. 

    Use the following command to create a signed message passed to Microsoft for verification.  
   
    > [!NOTE]
    > If the Validity End date was not included in the original ROA, pick a date that corresponds to the time you intend to have the prefix advertised by Azure.
 
    ```powershell
    $byoipauth="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|1.2.3.0/24|yyyymmdd"
    Set-Content -Path byoipauth.txt -Value $byoipauth -NoNewline
    ./openssl dgst -sha256 -sign byoipprivate.key -keyform PEM -out byoipauthsigned.txt byoipauth.txt
    $byoipauthsigned=(./openssl enc -base64 -in byoipauthsigned.txt) -join ''
    ```

4. To view the contents of the signed message, enter the variable created from the signed message created previously and select **Enter** at the PowerShell prompt:

    ```powershell
    $byoipauthsigned
    dIlwFQmbo9ar2GaiWRlSEtDSZoH00I9BAPb2ZzdAV2A/XwzrUdz/85rNkXybXw457//gHNNB977CQvqtFxqqtDaiZd9bngZKYfjd203pLYRZ4GFJnQFsMPFSeePa8jIFwGJk6JV4reFqq0bglJ3955dVz0v09aDVqjj5UJx2l3gmyJEeU7PXv4wF2Fnk64T13NESMeQk0V+IaEOt1zXgA+0dTdTLr+ab56pR0RZIvDD+UKJ7rVE7nMlergLQdpCx1FoCTm/quY3aiSxndEw7aQDW15+rSpy+yxV1iCFIrUa/4WHQqP4LtNs3FATvLKbT4dBcBLpDhiMR+j9MgiJymA==
    ```