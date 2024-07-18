---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 08/07/2023
 ms.author: cherylmc
 ms.custom: include file
---
1. Once the client certificate is exported, locate and copy the *.pfx* file to the client computer.
1. On the client computer, double-click the *.pfx* file to install. Leave the **Store Location** as **Current User**, and then select **Next**.
1. On the **File** to import page, don't make any changes. Select **Next**.
1. On the **Private key protection** page, input the password for the certificate, or verify that the security principal is correct, then select **Next**.
1. On the **Certificate Store** page, leave the default location, and then select **Next**.
1. Select **Finish**. On the **Security Warning** for the certificate installation, select **Yes**. You can comfortably select 'Yes' for this security warning because you generated the certificate.
1. The certificate is now successfully imported.
