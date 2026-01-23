---
title: Configure mutual authentication on Azure Application Gateway through portal
description: Learn how to configure an Application Gateway to have mutual authentication through portal 
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 1/22/2026
ms.author: mbender
# Customer intent: "As a cloud architect, I want to configure mutual authentication on my Application Gateway using the portal, so that I can securely validate client requests through client certificates."
---

# Configure mutual authentication with Application Gateway through portal 

This article describes how to use the Azure portal to configure mutual authentication on your Application Gateway. Mutual authentication means Application Gateway authenticates the client sending the request using the client certificate you upload onto the Application Gateway. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Before you begin

To configure mutual authentication with an Application Gateway, you need a client certificate to upload to the gateway. The client certificate is used to validate the certificate the client presents to Application Gateway. For testing purposes, you can use a self-signed certificate. However, this isn't advised for production workloads, because they're harder to manage and aren't secure. 

To learn more, especially about what kind of client certificates you can upload, see [Overview of mutual authentication with Application Gateway](./mutual-authentication-overview.md#certificates-supported-for-mutual-tls-strict-mode-authentication).

## Create a new Application Gateway

First create a new Application Gateway as you would usually through the portal - there are no extra steps needed to enable mutual authentication. For more information on how to create an Application Gateway in portal, check out our [portal quickstart tutorial](./quick-create-portal.md).

## Configure mutual authentication 

To configure an existing Application Gateway with mutual authentication, you need to first go to the **SSL settings** tab in the Portal and create a new SSL profile. When you create an SSL profile, you see two tabs: **Client Authentication** and **SSL Policy**. The **Client Authentication** tab is where you upload your client certificates. The **SSL Policy** tab is to configure a listener specific SSL policy - for more information, check out [Configuring a listener specific SSL policy](./application-gateway-configure-listener-specific-ssl-policy.md).

> [!IMPORTANT]
> Ensure that you upload the entire client CA certificate chain in one file, and only one chain per file.

1. Search for **Application Gateway** in portal, select **Application gateways**, and select one of your existing Application Gateways. 

1. Select **SSL settings** from the left-side menu.

1. Select the plus sign next to **SSL Profiles** at the top to create a new SSL profile.

1. Enter a name under **SSL Profile Name**. In this example, we call our SSL profile *applicationGatewaySSLProfile*. 

1. Stay in the **Client Authentication** tab.
 - For Strict mutual Authentication: Select client authentication as **Strict** method. Upload the PEM certificate you intend to use for mutual authentication between the client and the Application Gateway using the **Upload a new certificate** button.
 - For Mutual Authentication Passthrough: Select client authentication method as **Passthrough**.

    For more information on how to extract trusted client CA certificate chains to upload here, see [how to extract trusted client CA certificate chains](./mutual-authentication-certificate-management.md).

   > [!NOTE]
   > If this SSL isn't your first SSL profile and you uploaded other client certificates onto your Application Gateway, you can choose to reuse an existing certificate on your gateway through the dropdown menu. 

1. For Strict mutual Authentication: Check the **Verify client certificate issuer's DN** box only if you want Application Gateway to verify the client certificate's immediate issuer Distinguished Name. 

1. For Strict mutual Authentication: Consider adding a listener specific policy. See instructions at [setting up listener specific SSL policies](./application-gateway-configure-listener-specific-ssl-policy.md).

1. Select **Add** to save.
    - For Strict Mutual Authentication:
    :::image type="content" source="./media/mutual-authentication-portal/mutual-authentication-portal.png" alt-text="Screenshot of adding client authentication to SSL profile.":::
    - For Mutual Authentication Passthrough:
    :::image type="content" source="./media/mutual-authentication-portal/mutual-passthrough-portal.png" alt-text="Screenshot of Mutual Authentication Passthrough configuration.":::

## Associate the SSL profile with a listener

Now that we created an SSL profile with mutual authentication configured, we need to associate the SSL profile to the listener to complete the setup of mutual authentication. 

1. Navigate to your existing Application Gateway. If you completed the steps, you don't need to do anything here. 

1. Select **Listeners** from the left-side menu. 

1. Select **Add listener** if you don't already have an HTTPS listener set up. If you already have an HTTPS listener, select it from the list. 

1. Fill out the **Listener name**, **Frontend IP**, **Port**, **Protocol**, and other **HTTPS Settings** to fit your requirements.

1. Check the **Enable SSL Profile** checkbox so that you can select which SSL Profile to associate with the listener. 

1. Select the SSL profile you created from the dropdown list. In this example, we choose the SSL profile we created from the earlier steps: *applicationGatewaySSLProfile*. 

1. Continue configuring the remainder of the listener to fit your requirements. 

1. Select **Add** to save your new listener with the SSL profile associated to it. 

    :::image type="content" source="./media/mutual-authentication-portal/mutual-authentication-listener-portal.png" alt-text="Screenshot of associating SSL profile to new listener.":::

## Renew expired client CA certificates

In the case that your client CA certificate has expired, you can update the certificate on your gateway through the following steps: 

1. Navigate to your Application Gateway and go to the **SSL settings** tab in the left-hand menu.

1. Select one of the existing SSL profiles with the expired client certificate.

1. Select **Upload a new certificate** in the **Client Authentication** tab and upload your new client certificate.

1. Select the trash can icon next to the expired certificate. This removes the association of that certificate from the SSL profile.

1. Repeat steps 2-4 above with any other SSL profile that was using the same expired client certificate. You're able to choose the new certificate you uploaded in step 3 from the dropdown menu in other SSL profiles.

## Next steps

- [Manage web traffic with an application gateway using the Azure CLI](./tutorial-manage-web-traffic-cli.md)