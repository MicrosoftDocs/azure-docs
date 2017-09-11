---
title: "Enable or disable HTTPS on an Azure Content Delivery Network custom domain | Microsoft Docs"
description: Learn how to enable or disable HTTPS on your Azure CDN endpoint with a custom domain.
services: cdn
documentationcenter: ''
author: camsoper
manager: erikre
editor: ''

ms.assetid: 10337468-7015-4598-9586-0b66591d939b
ms.service: cdn
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/03/2017
ms.author: casoper

---
# Enable or disable HTTPS on an Azure Content Delivery Network custom domain

[!INCLUDE [cdn-verizon-only](../../includes/cdn-verizon-only.md)]

HTTPS support for Microsoft Azure Content Delivery Network (CDN) custom domains enables you to deliver secure content via SSL using your own domain name to improve the security of data while in transit. The end-to-end workflow to enable HTTPS for your custom domain is simplified via one-click enablement, complete certificate management, and all with no additional cost.

It's critical to ensure the privacy and data integrity of all of your web applications sensitive data while in transit. Using the HTTPS protocol ensures that your sensitive data is encrypted when it is sent across the internet. It provides trust, authentication, and protects your web applications from attacks. Currently, Azure CDN supports HTTPS on a CDN endpoint. For example, if you create a CDN endpoint from Azure CDN (such as https://contoso.azureedge.net), HTTPS is enabled by default. Now, with custom domain HTTPS, you can enable secure delivery for a custom domain (for example, https://www.contoso.com) as well. 

Some of the key attributes of HTTPS feature are:

- No additional cost: There are no costs for certificate acquisition or renewal and no additional cost for HTTPS traffic. You just pay for GB egress from the CDN.

- Simple enablement: One click provisioning is available from the [Azure portal](https://portal.azure.com). You can also use REST API or other developer tools to enable the feature.

- Complete certificate management: All certificate procurement and management is handled for you. Certificates are automatically provisioned and renewed prior to expiration. This completely removes the risks of service interruption as a result of a certificate expiring.

>[!NOTE] 
>Prior to enabling HTTPS support, you must have already established an [Azure CDN custom domain](./cdn-map-content-to-custom-domain.md).

## Enabling HTTPS

To enable HTTPS, follow these steps:

### Step 1: Enable the feature 

1. In the [Azure portal](https://portal.azure.com), browse to your Verizon standard or premium CDN profile.

2. In the list of endpoints, click the endpoint containing your custom domain.

3. Click the custom domain for which you want to enable HTTPS.

    ![Endpoint blade](./media/cdn-custom-ssl/cdn-custom-domain.png)

4. Click **On** to enable HTTPS, then click **Apply**.

    ![Custom HTTPS dialog](./media/cdn-custom-ssl/cdn-enable-custom-ssl.png)


### Step 2: Validate domain

>[!IMPORTANT] 
>You must complete domain validation before HTTPS will be active on your custom domain. You have six business days to approve the domain. Requests that are not approved within six business days will be automatically canceled. 

After you enable HTTPS on your custom domain, our HTTPS certificate provider DigiCert validates ownership of your domain by contacting the registrant for your domain, according to the domain's [WHOIS](http://whois.domaintools.com/) registrant information. Contact is made via the email address (by default) or the phone number listed in the WHOIS registration. 

![WHOIS Record](./media/cdn-custom-ssl/whois-record.png)

In addition, DigiCert will send the verification email to the following addresses. If the WHOIS registrant information is private, verify that you can approve directly from one of these addresses:

admin@&lt;your-domain-name.com&gt;  
administrator@&lt;your-domain-name.com&gt;  
webmaster@&lt;your-domain-name.com&gt;  
hostmaster@&lt;your-domain-name.com&gt;  
postmaster@&lt;your-domain-name.com&gt;  

You should receive an email in a few minutes, similar to the following example, asking you to approve the request. If you are using a spam filter, add admin@digicert.com to its whitelist. If you don't receive an email within 24 hours, contact Microsoft support.
    
![Custom HTTPS dialog](./media/cdn-custom-ssl/domain-validation-email.png)

When you click on the approval link, you will be directed to the following online approval form: 
	
![Custom HTTPS dialog](./media/cdn-custom-ssl/domain-validation-form.png)

Follow the instructions on the form; you have two verification options:

- You can approve all future orders placed through the same account for the same root domain; for example, contoso.com. This is the recommended approach if you are planning to add additional custom domains in the future for the same root domain.

- You can approve just the specific host name used in this request. Additional approval will be required for subsequent requests.

After approval, DigiCert will add your custom domain name to the Subject Alternative Names (SAN) certificate. The certificate is valid for one year and will be auto-renewed before it's expired.

### Step 3: Wait for propagation

After the domain name is validated, it can take up to 6-8 hours for the custom domain HTTPS feature to be activated. When the process is complete, the "Custom HTTPS" status in the Azure portal is set to "Enabled" and the four operation steps in the Custom domain HTTPS blade are marked as complete. Your custom domain is now ready to use HTTPS.

![Enable HTTPS dialog](./media/cdn-custom-ssl/cdn-enable-custom-ssl-complete.png)

### Operation progress

The following table shows the operation progress that occurs when you enable HTTPS. After you enable HTTPS, four operation steps appear in the Custom domain HTTPS blade. Under each step, progress is indicated by a sequence of messages. After a step successfully completes, a green check mark appears next to it. 

| Operation step | Operation step details | 
| --- | --- |
| 1 Submitting request | Submitting request |
| | Your HTTPS request is being submitted. |
| | Your HTTPS request has been submitted successfully. |
| 2 Domain validation | We have sent you an email asking you to validate the domain ownership. Waiting for your confirmation. |
| | Your domain ownership has been successfully validated. |
| | Domain ownership validation request expired (customer likely didn't respond within 6 days). HTTPS will not be enabled on your domain. * |
| | Domain ownership validation request was rejected by the customer. HTTPS will not be enabled on your domain. * |
| 3 Certificate provisioning | The certificate authority is currently issuing the certificate needed to enable HTTPS on your domain. |
| | The certificate has been issued and is currently being deployed to CDN network. This could take up to 6 hours. |
| | The certificate has been successfully deployed to CDN network. |
| 4 Complete | HTTPS has been successfully enabled on your domain. |

\* This message will not appear unless an error has occurred. 

If an error occurs before the request is submitted, you will see the following error message:

```
We encountered an unexpected error while processing your HTTPS request. Please try again and contact support if the issue persists.
```

## Disabling HTTPS

After you have enabled HTTPS, you can later disable it. To disable HTTPS, follow these steps:

### Step 1: Disable the feature 

1. In the [Azure portal](https://portal.azure.com), browse to your Verizon standard or premium CDN profile.

2. In the list of endpoints, click the endpoint containing your custom domain.

3. Click the custom domain for which you want to disable HTTPS.

    ![Endpoint blade](./media/cdn-custom-ssl/cdn-custom-domain-HTTPS-enabled.png)

4. Click **Off** to disable HTTPS, then click **Apply**.

    ![Custom HTTPS dialog](./media/cdn-custom-ssl/cdn-enable-custom-ssl.png)

### Step 2: Wait for propagation

After the custom domain HTTPS feature is disabled, it can take up to 6-8 hours for it to take effect. When the process is complete, the "Custom HTTPS" status in the Azure portal is set to "disabled" and the three operation steps in the Custom domain HTTPS blade are marked as complete. Your custom domain can no longer use HTTPS.

![Disable HTTPS dialog](./media/cdn-custom-ssl/cdn-disable-custom-ssl-complete.png)

### Operation progress

The following table shows the operation progress that occurs when you disable HTTPS. After you enable HTTPS, three operation steps appear in the Custom domain HTTPS blade. Under each step, progress is indicated by a sequence of messages. After a step successfully completes, a green check mark appears next to it. 

| Operation progress | Operation details | 
| --- | --- |
| 1 Submitting request | Submitting your request |
| 2 Certificate deprovisioning | Deleting certificate |
| 3 Complete | Certificate deleted |

## Frequently asked questions

1. *Who is the certificate provider and what type of certificate is used?*

    We use Subject Alternative Names (SAN) certificate provided by DigiCert. A SAN certificate can secure multiple fully qualifIed domain names with one certificate.

2. *Can I use my dedicated certificate?*
    
    Not currently, but it's on the roadmap.

3. *What if I don't receive the domain verification email from DigiCert?*

    Contact Microsoft support if you don't receive an email within 24 hours.

4. *Is using a SAN certificate less secure than a dedicated certificate?*
	
	A SAN cert follows the same encryption and security standards as a dedicated cert. All issued SSL certificates are using SHA-256 for enhanced server security.

5. *Can I use custom domain HTTPS with Azure CDN from Akamai?*

	Currently, this feature is only available with Azure CDN from Verizon. We are working on supporting this feature with Azure CDN from Akamai in the coming months.


## Next steps

- Learn how to set up a [custom domain on your Azure CDN endpoint](./cdn-map-content-to-custom-domain.md)


