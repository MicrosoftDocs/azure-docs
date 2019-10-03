---
title: Quickstart - Configure end-to-end SSL encryption with Azure Application Gateway - Azure portal | Microsoft Docs
description: Learn how to use the Azure portal to create an Azure Application Gateway with end-to-end SSL encryption.
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: article
ms.date: 4/30/2019
ms.author: absha
ms.custom: mvc
---
# Configure end-to-end SSL by using Application Gateway with the portal

This article shows you how to use the Azure portal to configure end-to-end SSL encryption with an application gateway v1 SKU.  

> [!NOTE]
> Application Gateway v2 SKU requires trusted root certificates for enabling end-to-end configuration.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Before you begin

To configure end-to-end SSL with an Application Gateway, a certificate is required for the gateway and certificates are required for the back-end servers. The gateway certificate is used to derive a symmetric key as per SSL protocol specification. The symmetric key is then used to encrypt and decrypt the traffic sent to the gateway. For end-to-end SSL encryption, the right back-end servers must be allowed in the application gateway. To do this, upload the public certificate of the back-end servers, also known as Authentication Certificates (v1) or Trusted Root Certificates (v2), to the Application Gateway. Adding the certificate ensures that the Application Gateway only communicates with known back-end instances. This further secures the end-to-end communication.

To learn more, see [SSL termination and end-to-end SSL](https://docs.microsoft.com/azure/application-gateway/ssl-overview).

## Create a new application gateway with end-to-end SSL

To create a new application gateway with end-to-end SSL encryption, you'll need to first enable SSL termination while creating a new application gateway. This will enable SSL encryption for the communication between the client and application gateway. Then, you'll need to whitelist certificates for backend servers in the HTTP settings to enable SSL encryption for the communication between the application gateway and backend servers, accomplishing end-to-end SSL encryption.

### Enable SSL termination while creating a new application gateway

Refer to this article to understand how to [enable SSL termination while creating a new application gateway](https://docs.microsoft.com/azure/application-gateway/create-ssl-portal).

### Add authentication/root certificate of back-end servers

1. Select **All resources**, and then select **myAppGateway**.

2. Select **HTTP settings** from the left menu. Azure automatically created a default HTTP setting, **appGatewayBackendHttpSettings**, when you created the application gateway. 

3. Select **appGatewayBackendHttpSettings**.

4. Under **Protocol**, select **HTTPS**. A pane for **Backend authentication certificates or Trusted root certificates** will appear. 

5. Choose **Create new**.

6. Enter a suitable **Name**.

7. Select the certificate file using the **Upload CER certificate** box.

   For Standard and WAF (v1) Application Gateways, you should upload the public key of your backend server certificate in .cer format.

   ![addcert](./media/end-to-end-ssl-portal/addcert.png)

   For Standard_v2 and WAF_v2 Application Gateways, you should upload the **root certificate** of the backend server certificate in .cer format. If the backend certificate is issued by a well-known CA, you can check the "Use Well Known CA certificate" box and there is no need to upload a certificate.

   ![addtrustedrootcert](./media/end-to-end-ssl-portal/trustedrootcert-portal.png)

   ![rootcert](./media/end-to-end-ssl-portal/trustedrootcert.png)

8. Select **Save**.

## Enable end-to-end SSL for existing application gateway

To configure an existing application gateway with end-to-end SSL encryption, you'll need to first enable SSL termination in the listener. This will enable SSL encryption for the communication between the client and application gateway. Then, you'll need to whitelist certificates for backend servers in the HTTP settings to enable SSL encryption for the communication between the application gateway and backend servers, accomplishing end-to-end SSL encryption.

You'll need to use a listener with HTTPS protocol and certificate for enabling SSL termination. So, you can either choose to use an existing listener with HTTPS protocol and certificate, or create a new listener. In case you choose the former, you can ignore the below mentioned steps to **Enable SSL termination in existing application gateway** and directly move to **Add authentication/trusted root certificates for back-end servers** section. If you choose the latter, use these steps.

### Enable SSL termination in existing application gateway

1. Select **All resources**, and then select **myAppGateway**.

2. Select **Listeners** from the left menu.

3. Choose between **Basic** and **Multi-site** listener as per your requirement.

4. Under **Protocol**, select **HTTPS**. A pane for **Certificate** will appear.

5. Upload the PFX certificate that you intend to use for SSL termination between the client and application gateway.

   > [!NOTE]
   > For testing purposes, you can use a self-signed certificate. but not advised for production workloads as they are harder to manage and not completely secure. Learn how to [create a self-signed certificate](https://docs.microsoft.com/azure/application-gateway/create-ssl-portal#create-a-self-signed-certificate).

6. Add other required settings for the **Listener** as per your requirement.

7. Select **OK** to save.

### Add authentication/trusted root certificates of back-end servers

1. Select **All resources**, and then select **myAppGateway**.

2. Select **HTTP settings** from the left menu. You can either whitelist certificates in an existing backend HTTP setting or create a new HTTP setting. In the below step, we will whitelist certificate for the default HTTP setting, **appGatewayBackendHttpSettings**.

3. Select **appGatewayBackendHttpSettings**.

4. Under **Protocol**, select **HTTPS**. A pane for **Backend authentication certificates or Trusted root certificates** will appear. 

5. Choose **Create new**.

6. Enter suitable **Name**.

7. Select the certificate file using the **Upload CER certificate** box.

   For Standard and WAF (v1) Application Gateways, you should upload the public key of your backend server certificate in .cer format.

   ![addcert](./media/end-to-end-ssl-portal/addcert.png)

   For Standard_v2 and WAF_v2 Application Gateways, you should upload the **root certificate** of the backend server certificate in .cer format. If the backend certificate is issued by a well-known CA, you can check the "Use Well Known CA certificate" box and there is no need to upload a certificate.

   ![addtrustedrootcert](./media/end-to-end-ssl-portal/trustedrootcert-portal.png)

8. Select **Save**.

## Next steps

> [!div class="nextstepaction"]
> [Manage web traffic with an application gateway using the Azure CLI](./tutorial-manage-web-traffic-cli.md)
