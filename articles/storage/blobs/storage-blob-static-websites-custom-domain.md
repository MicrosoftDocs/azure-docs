---
title: 'Tutorial: Enable custom domain on a static website - Azure Storage'
description: Learn how to configure a custom domain for static website hosting.
services: storage
author: tamram

ms.service: storage
ms.topic: tutorial
ms.date: 12/07/2018
ms.author: tamram
ms.custom: seodec18
---

# Tutorial: Enable custom domain

Part two of the tutorial demonstrates the use of custom domains with SSL using Azure CDN.

In this part two of the tutorial series, you will learn enabling a custom domain endpoint through Azure CDN endpoint. With the use of Azure CDN, you can provision custom SSL certificates, use a custom domain, and configure custom rewrite rules all at the same time. Configuring an Azure CDN results in additional charges for the Azure CDN service (which are documented here), but provides consistent low latencies to your website all around the world. The CDN also provides SSL encryption with your own certificate.

In part two of this tutorial, you learn how to:

1. Create a CDN endpoint on the static website endpoint

2. Enable custom domain and SSL

**1. Create a CDN endpoint on the static website endpoint**

\- Go to the Storage account on the Azure portal.

\- Click ‘Azure CDN’ under Blob Service menu on the left.

\- In the New Endpoint section, fill out the fields to create a new CDN
endpoint.

\- Type an endpoint name, such as ‘mystaticwebsiteCDN’

\- Type a hostname for your CDN endpoint. Ideally use your website domain.

\- For the origin hostname, type in the static website endpoint you retrieved when you created the static website endpoint. For example, ‘myaccount.z22.web.core.windows.net’


\- Test out your CDN endpoint by going to ‘mywebsitecdn.azureedge.net’ on your browser.

**2. Enable custom domain and SSL**

**-** Create a CNAME record with your domain name provider to redirect your custom domain to the CDN endpoint. The CNAME record for ‘www’ should be similar to the following.


**-** In the Azure portal, click on the newly created endpoint to configure the custom domain and the SSL certificate.


-   Select **Add custom domain** and enter your domain name, then click **Add**.


-   Select the newly created custom domain mapping to provision an SSL
    certificate.


-   Set **Custom Domain HTTPS** to **ON**. Select **CDN Managed** if you want     your SSL certificate to be managed by the Azure CDN. Click **Save**.


-   Test your website by accessing your website url.

