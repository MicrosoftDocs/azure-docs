---
title: "Azure Content Delivery Network HTTPS acceleration service: Customer-supplied certificates"
metaKeywords: "Azure CDN, Azure CDN, Azure blobs, Azure caching, Azure add-on, Live Streaming, 流媒体加速, CDN加速,CDN服务,主流CDN, 流媒体直播加速, 媒体服务, Azure Media Service, 缓存规则, HLS, CDN技术文档, CDN帮助文档, 视频直播加速, 直播加速"
description: This article explains how to enable HTTPS acceleration for customer-supplied certificates
metaCanonical: 
services: cdn
documentationCenter: .NET
author: jessie-jyy
solutions: 
manager: 
editor: 
ms.service: cdn
ms.author: v-jijes
ms.topic: article
ms.date: 06/14/2017
wacn.date: 06/14/2017
ms.translationtype: Human Translation
ms.sourcegitcommit: 273aa8c36630cc3b25d9966c7e67b26d71458693
ms.openlocfilehash: 16205ac706e7e1cc05f27880eacb16284b480c9a
ms.contentlocale: en-us
ms.lasthandoff: 07/05/2017

---
# Azure Content Delivery Network HTTPS acceleration service: Customer-supplied certificates
<a id="azure-cdn-https-" class="xliff"></a>

The Azure Content Delivery Network provides HTTPS secure acceleration services that support certificates uploaded by the user and the automatic configuration of certificates applied for by the Azure Content Delivery Network. Both types are available only to paying users.

This article discusses how to self-configure user-uploaded certificates and explanations of certificates. For more information about how to configure certificates that the Content Delivery Network applies for on the user’s behalf, see [Azure Content Delivery Network HTTPS acceleration services: Certificates applied for by the Content Delivery Network for users](https://www.azure.cn/documentation/articles/cdn-https-how-to/). For more information about the differences between the two, see [FAQs – Service Consulting](https://www.azure.cn/documentation/articles/cdn-faq-service-inquiry/).


## Configuration
<a id="" class="xliff"></a>

- HTTPS acceleration is available only to paying users.
- Content Delivery Network supports HTTPS acceleration for wildcard domain names.
- The types of acceleration that are supported are standard Content Delivery Network acceleration, such as webpage acceleration, download acceleration, video on demand (VOD) acceleration, and live streaming acceleration.

    >[!NOTE] 
    >The image-processing acceleration type does not currently support HTTPS acceleration.

- You need to enable the HTTPS service in the new Azure Content Delivery Network management interface and upload the certificate in Privacy Enhanced Mail (PEM) format and the private key. For more information, see the “Automatically enable HTTPS acceleration” section.

- After you enable HTTPS acceleration, it supports both HTTP and HTTPS requests by default. If you need to force an HTTP request to jump to an HTTPS request, contact CenturyLink to arrange the configuration. We plan to implement an automated option in the management interface soon.

- By default, the return-to-source protocol follows the request protocol initiated by the user. That is, an HTTP request returns to the source by using the HTTP protocol, and an HTTPS request returns to the source by using the HTTPS protocol. If you need to specify only HTTP returns to source or only HTTPS returns to source, contact CenturyLink to arrange the configuration. We plan to implement an automated option in the management interface soon.


## Certificates
<a id="" class="xliff"></a>

- HTTPS acceleration for customer-supplied certificates is implemented using SNI technology. An SNI certificate enables multiple HTTPS clients to share the same IP address.

    >[!NOTE] 
    >SNI certificates do not support all versions of Internet Explorer on Windows XP, so you will be notified if the browser you are using is not trusted.

- After you enable HTTPS acceleration, you need to upload the certificate and private key for the accelerated domain name. The certificate must match the domain name, and the private key must match the certificate. Otherwise, there will be an authentication error.

- You can view details of certificates, but you cannot download certificates or view private keys, so take the appropriate precautions to safeguard the relevant information.

- Certificate chains are supported. The individual PEM files for the certificate chain must include multiple certificates in following order: public certificate, intermediate certificate, root certificate. Each certificate must start with `-----BEGIN CERTIFICATE-----` and end with `-----END CERTIFICATE-----`.

### **Certificate format**
<a id="" class="xliff"></a>

- Certificates must be in PEM format. Certificates in other formats are not supported and must be converted into PEM format, which you can do by using OpenSSL tools. For more information, see the “Converting common certificate formats” section.

- Certificates start with `-----BEGIN CERTIFICATE-----` and end with `-----END CERTIFICATE-----`.

- PKCS1 and PKCS8 encoding are currently supported for private keys. The format for PKCS1-encoded private keys starts with `-----BEGIN RSA PRIVATE KEY-----` and ends with `-----END RSA PRIVATE KEY-----`; PKCS8-encoded private keys start and finish with `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`.

    >[!NOTE] 
    >You can perform private key-encoding format conversion by using OpenSSL tools. 
    >
    >For example:
    >
    >`openssl.exe pkcs8 -topk8 -inform PEM -outform PEM -in yourkeyfile.key -out yourconverted.key -nocrypt` 
    

### **Convert common certificate formats**
<a id="" class="xliff"></a>

#### Convert DER format to PEM
<a id="derpem" class="xliff"></a>

- Certificate conversion

    ```
    openssl x509 -in cert.der -inform DER -out cert.pem -outform PEM
    ```

- Private key conversion

    ```
    openssl rsa -in privagekey.der -inform DER -out privatekey.pem -outform PEM
    ```

#### Convert PFX format to PEM
<a id="pfxpem" class="xliff"></a>

- Certificate conversion

    ```
    openssl pkcs12 -in cert.pfx -nokeys -out cert.pem
    ```

- Private key conversion

    ```
    openssl pkcs12 -in cert.pfx -nocerts -out key.pem -nodes
    ```

## Pricing
<a id="" class="xliff"></a>

As of July 1, 2017, standard-edition service prices apply to HTTPS acceleration for customer-supplied certificates. Before July 1, 2017, this service was classed and priced as an advanced service. For specific pricing methods, go to the [Azure website](https://www.azure.cn/pricing/details/cdn/).


## Automatically enable HTTPS acceleration
<a id="https" class="xliff"></a>

You can enable customer-supplied certificate HTTPS acceleration for all Content Delivery Network domain names that meet the conditions (in paid accounts, Content Delivery Network domains with all standard version acceleration types except image acceleration nodes).

>[!NOTE] 
>If you need to create a new Content Delivery Network profile and node in the Azure preview portal and enable customer-supplied certificate HTTPS acceleration, select **S1 Standard** for the pricing tier. In **P1 Premium**, HTTPS refers to certificates that the Content Delivery Network applies for on the customer’s behalf.
  
  ![][15]

1. For example, if you are previewing by using the new Azure portal, you need to click **Manage** to go to the old Content Delivery Network management portal. To go to the new Content Delivery Network management portal, click **Access new site**.

    >[!NOTE] 
    >You need to go to the new Azure Content Delivery Network management portal to upload HTTPS customer-supplied certificates.
    
    **The Content Delivery Network profile interface in the new Azure portal preview:**

    ![][1]

    **The old Azure Content Delivery Network management portal interface:**

    ![][2]

    **The new Azure Content Delivery Network management portal interface:** 

    ![][3]

2. To upload a certificate, click **Certificate management**, click **Add SSL certificate**, and then enter the certificate name so that you can identify the certificate. You need to enable the HTTPS service’s domain name certificate to upload. The certificate must be in PEM format and only the RSA PKCS8 encoding format is currently supported for private keys. For specific information about certificate format conversion, see the previous “Certificates” section.

    >[!NOTE] 
    >After you have uploaded the certificate, go to the **Domain Name Management** interface and bind the certificate to the domain name before the certificate can be deployed.
     
    ![][4]

3. To bind a domain name to a certificate, go to either **Certificate Management** or **Domain Name Management**.
    
    - You can directly select the domain name that you want to bind when you upload the certificate in **Certificate Management**.
    
      ![][9]

    - You can also bind the domain name after you have uploaded the certificate by selecting the certificate on the management page and clicking **Edit bindings** > **Add bound domain name**.
     
      ![][5]
      ![][6]

    - You can also click **Domain Name Management** and select the domain name for which you want to enable HTTPS service, select **HTTPS (Customer-supplied Certificate)** at the right, click **Enable** to bind a certificate, select an uploaded certificate in the drop-down list under the uploaded certificate, and then click **Confirm**. If you do not have a compliant certificate, click **Certificate Management** and then, to upload a certificate, refer to step 3.

      ![][8]

    - **Certificate deployment**: After you bind a domain name, the system notifies you that “The certificate is currently being deployed and will generally take effect within 2-4 hours. Please contact us if deployment is not completed within 24 hours. ”

      ![][13]

    - **After the domain name has been successfully bound**, the system notifies you that “The certificate has been successfully bound. You can access the accelerated domain name via HTTPS,” and you can view details of the certificate. The *HTTPS status (customer-supplied certificate)* for the domain name also changes to *Active*.

      - To view details of the certificate, click the domain name.
    
        ![][10]

      - The *HTTPS status (customer-supplied certificate)* for the domain name changes to *Active*.
    
        ![][11]

      - The number of domain names bound to certificates in Certificate Management also changes.
    
        ![][12]

4. To view certificate details and details of all bound domain names, click any certificate in Certificate Management.

    ![][7]
5. To confirm that it has taken effect, look for a small lock flag when you access the domain name by using HTTPS. The flag indicates that HTTPS acceleration was successfully activated.

    ![][14]   

## Replace and delete certificates
<a id="" class="xliff"></a>

### **Delete a certificate**
<a id="" class="xliff"></a>

You can delete a certificate by deleting it from Certificate Management. Select the certificate that you want to delete, and then click **Delete** at the right of the window.

![][19] 

>[!NOTE] 
>If a certificate has a bound domain name, you must unbind the certificate and the domain name before you can delete it. Otherwise, you will be notified that this step must be performed first. You can unbind the certificate and domain name either by replacing the certificate for the domain name or by directly deleting the domain name. For information about how to replace a certificate, see the next section, "Replace a certificate." 

![][16] 

### **Replace a certificate**
<a id="" class="xliff"></a>

If you have already enabled the HTTPS customer-supplied certificate service, you can replace a certificate for the corresponding domain name in Domain Name Management.

1. Select the domain name whose certificate you want to replace, go to HTTPS (customer-supplied certificate), and replace the certificate:

   ![][17]

2. Select the certificate that you want to replace, and then click **Save**.

   ![][18]

3. To automatically enable HTTPS acceleration, repeat steps 3, 4, and 5 from the process.

<!--Image references-->
[1]: ./media/cdn-httpsimage/manage.png
[2]: ./media/cdn-httpsimage/oldportal.png
[3]: ./media/cdn-httpsimage/newportaloverview.png
[4]: ./media/cdn-httpsimage/uploadcert.png
[5]: ./media/cdn-httpsimage/bindcert1.png
[6]: ./media/cdn-httpsimage/bindcert1.1.png
[7]: ./media/cdn-httpsimage/certdetail.png
[8]: ./media/cdn-httpsimage/bindcert2.png
[9]: ./media/cdn-httpsimage/bindcert3.png
[10]: ./media/cdn-httpsimage/success.png
[11]: ./media/cdn-httpsimage/successdomainstatuspng.png
[12]: ./media/cdn-httpsimage/cert4.png
[13]: ./media/cdn-httpsimage/deploying.png
[14]: ./media/cdn-httpsimage/finalaccess.png
[15]: ./media/cdn-httpsimage/ibizapricingtier.png
[16]: ./media/cdn-httpsimage/deletecerterror.png
[17]: ./media/cdn-httpsimage/changecert1.png
[18]: ./media/cdn-httpsimage/changecert2.png
[19]: ./media/cdn-httpsimage/deletecert.png
