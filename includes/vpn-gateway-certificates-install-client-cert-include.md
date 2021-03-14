---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 10/29/2020
 ms.author: cherylmc
 ms.custom: include file
---
If you want to create a P2S connection from a client computer other than the one you used to generate the client certificates, you need to install a client certificate. When installing a client certificate, you need the password that was created when the client certificate was exported.

1. Locate and copy the *.pfx* file to the client computer. On the client computer, double-click the *.pfx* file to install. Leave the **Store Location** as **Current User**, and then select **Next**.
1. On the **File** to import page, don't make any changes. Select **Next**.
1. On the **Private key protection** page, input the password for the certificate, or verify that the security principal is correct, then select **Next**.
1. On the **Certificate Store** page, leave the default location, and then select **Next**.
1. Select **Finish**. On the **Security Warning** for the certificate installation, select **Yes**. You can comfortably select 'Yes' for this security warning because you generated the certificate.
1. The certificate is now successfully imported.
