---
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network
ms.subservice: ip-services
ms.topic: include
ms.date: 06/18/2024
---

### Certificate readiness

To authorize Microsoft to associate a prefix with a customer subscription, a public certificate must be compared against a signed message. 

The following steps show the steps required to prepare sample customer range (1.2.3.0/24) for provisioning to the Public cloud. You can execute these commands with Windows PowerShell or in a Linux Console. Both require OpenSSL to be installed.

# [**PowerShell**](#tab/powershell)

1. A [self-signed X509 certificate](https://en.wikipedia.org/wiki/Self-signed_certificate) must be created to add to the Whois/RDAP record for the prefix. For information about RDAP, see the [ARIN](https://www.arin.net/resources/registry/whois/rdap/), [RIPE](https://www.ripe.net/manage-ips-and-asns/db/registration-data-access-protocol-rdap), [APNIC](https://www.apnic.net/about-apnic/whois_search/about/rdap/), and [AFRINIC](https://www.afrinic.net/whois/rdap) sites. 

   Utilizing the OpenSSL toolkit, the following commands generate an RSA key pair and create an X509 certificate using the key pair that expires in six months.
    
    ```powershell
    ./openssl genrsa -out byoipprivate.key 2048
    Set-Content -Path byoippublickey.cer (./openssl req -new -x509 -key byoipprivate.key -days 180) -NoNewline
    ```
   
2. After the certificate is created, update the public comments section of the Whois/RDAP record for the prefix. To display for copying, including the BEGIN/END header/footer with dashes, use the command `cat byoippublickey.cer` You should be able to perform this procedure via your Routing Internet Registry. 

    Here are instructions for each registry:
  
    * [ARIN](https://www.arin.net/resources/registry/manage/netmod/) - edit the *Comments* of the prefix record.
    
    * [RIPE](https://www.ripe.net/manage-ips-and-asns/db/support/updating-the-ripe-database) - edit the *Remarks* of the inetnum record.
    
    * [APNIC](https://www.apnic.net/manage-ip/using-whois/updating-whois/) - edit the *Remarks* of the inetnum record using MyAPNIC.
    
    * [AFRINIC](https://afrinic.net/support/my-afrinic-net) - edit the *Remarks* of the inetnum record using MyAFRINIC.
    
    * For ranges from LACNIC registry, create a support ticket with Microsoft.
     
    After the public comments are filled out, the Whois/RDAP record should look like the following example. When copying, ensure there aren't spaces, or carriage returns and include all dashes:

    :::image type="content" source="./media/ip-services-pre-provisioning-steps/certificate-example.png" alt-text="Screenshot of example certificate comment.":::
    
3. To create the message passed to Microsoft, create a string that contains relevant information about your prefix and subscription. Sign this message with the key pair generated previously. Use the following format, substituting your subscription ID, prefix to be provisioned, and expiration date matching the Validity Date on the ROA. Ensure the format is in that order. 

    Use the following command to create a signed message passed to Microsoft for verification. 
   
    > [!NOTE]
    > If the Validity End date was not included in the original ROA, pick a date that corresponds to the time you intend to have the prefix advertised by Azure.
    
    ```powershell
    $byoipauth="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|1.2.3.0/24|yyyymmdd"
    Set-Content -Path byoipauth.txt -Value $byoipauth -NoNewline
    ./openssl dgst -sha256 -sign byoipprivate.key -keyform PEM -out byoipauthsigned.txt byoipauth.txt
    $byoipauthsigned=(./openssl enc -base64 -in byoipauthsigned.txt) -join ''
    ```

4. To view the contents of the signed message, enter the variable created from the signed message created previously and select **Enter** at the prompt:

    ```powershell
    $byoipauthsigned

    # Output
    ABCDEFG0a1b2c0a1b2c0a1b2c0ca1b2c0a1b2c0a10a/1234567a/ABCDEFG0a1b2c0//ABCDEFG0a1b2c0a1b2c0a1b2c0ca1b2c0a1b2c0a10aABCDEFG0a1b2c0a1b2c0a1b2c0ca1b2c0a1b2c0a10aABCDEFG0a1b2c0a1b2c0a1b2c0ca1b2c0a1b2c0a10aABCDEFG0a1b2c0a1b2c0a1b2c0ca1b2c0a1b2c0a10aABCDEFG0a1b2c0a1b2c0a1b2c0ca1b2c0/ABCDEFG0a1b2c0a1b2c0a1b21212121212/ABCDEFG0a1b2c0a1b2c0a1b2c0ca1b2c0a1b2c0a10a==
    ```

# [**Console**](#tab/console)

1. A [self-signed X509 certificate](https://en.wikipedia.org/wiki/Self-signed_certificate) must be created to add to the Whois/RDAP record for the prefix. For information about RDAP, see the [ARIN](https://www.arin.net/resources/registry/whois/rdap/), [RIPE](https://www.ripe.net/manage-ips-and-asns/db/registration-data-access-protocol-rdap), [APNIC](https://www.apnic.net/about-apnic/whois_search/about/rdap/), and [AFRINIC](https://www.afrinic.net/whois/rdap) sites. 

    When utilizing the OpenSSL toolkit, the following example commands generate an RSA key pair and create an X509 certificate using the key pair that expires in six months.

    ```console
    openssl genrsa -out byoipprivate.key 2048
    openssl req -new -x509 -key byoipprivate.key -days 180 | tr -d "\n" > byoippublickey.cer
    ```
   
2. After the certificate is created, update the public comments section of the Whois/RDAP record for the prefix. To display for copying, including the BEGIN/END header/footer with dashes, use the command `cat byoippublickey.cer` You should be able to perform this procedure via your Routing Internet Registry. 

    Here are instructions for each registry:
  
    * [ARIN](https://www.arin.net/resources/registry/manage/netmod/) - edit the *Comments* of the prefix record.
    
    * [RIPE](https://www.ripe.net/manage-ips-and-asns/db/support/updating-the-ripe-database) - edit the *Remarks* of the inetnum record.
    
    * [APNIC](https://www.apnic.net/manage-ip/using-whois/updating-whois/) - edit the *Remarks* of the inetnum record using MyAPNIC.
    
    * [AFRINIC](https://afrinic.net/support/my-afrinic-net) - edit the *Remarks* of the inetnum record using MyAFRINIC.
    
    * For ranges from LACNIC registry, create a support ticket with Microsoft.
     
    After the public comments are filled out, the Whois/RDAP record should look like the following example. Ensure there aren't spaces or carriage returns and include all dashes:

    :::image type="content" source="./media/ip-services-pre-provisioning-steps/certificate-example.png" alt-text="Screenshot of example certificate comment.":::
    
3. To create the message passed to Microsoft, create a string that contains relevant information about your prefix and subscription. Sign this message with the key pair generated previously. Use the following format, substituting your subscription ID, prefix to be provisioned, and expiration date matching the Validity Date on the ROA. Ensure the format is in that order. 

    Use the following command to create a signed message passed to Microsoft for verification. 
   
    > [!NOTE]
    > If the Validity End date was not included in the original ROA, pick a date that corresponds to the time you intend to have the prefix advertised by Azure.

    ```console
    byoipauth="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx|1.2.3.0/24|yyyymmdd"
    byoipauthsigned=$(echo $byoipauth | tr -d "\n" | openssl dgst -sha256 -sign byoipprivate.key -keyform PEM | openssl base64 | tr -d "\n")
    ```

4. To view the contents of the signed message, enter the variable created from the signed message created previously and select **Enter** at the prompt:

    ```console
    byoipauthsigned

    # Output

    ABCDEFG0a1b2c0a1b2c0a1b2c0ca1b2c0a1b2c0a10a/1234567a/ABCDEFG0a1b2c0//ABCDEFG0a1b2c0a1b2c0a1b2c0ca1b2c0a1b2c0a10aABCDEFG0a1b2c0a1b2c0a1b2c0ca1b2c0a1b2c0a10aABCDEFG0a1b2c0a1b2c0a1b2c0ca1b2c0a1b2c0a10aABCDEFG0a1b2c0a1b2c0a1b2c0ca1b2c0a1b2c0a10aABCDEFG0a1b2c0a1b2c0a1b2c0ca1b2c0/ABCDEFG0a1b2c0a1b2c0a1b21212121212/ABCDEFG0a1b2c0a1b2c0a1b2c0ca1b2c0a1b2c0a10a==
    ```
---