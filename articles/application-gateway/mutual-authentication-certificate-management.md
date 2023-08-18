---
title: Export trusted client CA certificate chain for client authentication
titleSuffix: Azure Application Gateway
description: Learn how to export a trusted client CA certificate chain for client authentication on Azure Application Gateway
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: how-to
ms.date: 06/22/2023
ms.author: greglin
---

# Export a trusted client CA certificate chain to use with client authentication
In order to configure mutual authentication with the client, or client authentication, Application Gateway requires a trusted client CA certificate chain to be uploaded to the gateway. If you have multiple certificate chains, you need to create the chains separately and upload them as different files on the Application Gateway. In this article, you learn how to export a trusted client CA certificate chain that you can use in your client authentication configuration on your gateway.  

## Prerequisites

An existing client certificate is required to generate the trusted client CA certificate chain. 

## Export trusted client CA certificate

Trusted client CA certificate is required to allow client authentication on Application Gateway. In this example, we use a TLS/SSL certificate for the client certificate, export its public key and then export the CA certificates from the public key to get the trusted client CA certificates. We then concatenate all the client CA certificates into one trusted client CA certificate chain. 

The following steps help you export the .pem or .cer file for your certificate:

### Export public certificate 

1. To obtain a .cer file from the certificate, open **Manage user certificates**. Locate the certificate, typically in 'Certificates - Current User\Personal\Certificates', and right-click. Click **All Tasks**, and then click **Export**. This opens the **Certificate Export Wizard**. If you can't find the certificate under Current User\Personal\Certificates, you may have accidentally opened "Certificates - Local Computer", rather than "Certificates - Current User"). If you want to open Certificate Manager in current user scope using PowerShell, you type *certmgr* in the console window.

    :::image type="content" source="./media/certificates-for-backend-authentication/export.png" alt-text="Screenshot shows the Certificate Manager with Certificates selected and a contextual menu with All tasks, then Export selected.":::

1. In the Wizard, click **Next**.

    :::image type="content" source="./media/certificates-for-backend-authentication/exportwizard.png" alt-text="Screenshot of export certificate.":::

1. Select **No, do not export the private key**, and then click **Next**.

    :::image type="content" source="./media/certificates-for-backend-authentication/notprivatekey.png" alt-text="Screenshot of do not export the private key.":::

1. On the **Export File Format** page, select **Base-64 encoded X.509 (.CER).**, and then click **Next**.

    :::image type="content" source="./media/certificates-for-backend-authentication/base64.png" alt-text="Screenshot of Base-64 encoded.":::

1. For **File to Export**, **Browse** to the location to which you want to export the certificate. For **File name**, name the certificate file. Then, click **Next**.

    :::image type="content" source="./media/certificates-for-backend-authentication/browse.png" alt-text="Screenshot shows the Certificate Export Wizard where you specify a file to export.":::

1. Click **Finish** to export the certificate.
    
    :::image type="content" source="./media/certificates-for-backend-authentication/finish-screen.png" alt-text="Screenshot shows the Certificate Export Wizard after you complete the file export.":::

1. Your certificate is successfully exported.

    :::image type="content" source="./media/certificates-for-backend-authentication/success.png" alt-text="Screenshot shows the Certificate Export Wizard with a success message.":::

   The exported certificate looks similar to this:

    :::image type="content" source="./media/certificates-for-backend-authentication/exported.png" alt-text="Screenshot shows a certificate symbol.":::
### Export CA certificate(s) from the public certificate

Now that you've exported your public certificate, you'll now export the CA certificate(s) from your public certificate. If you only have a root CA, you'll only need to export that certificate. However, if you have 1+ intermediate CAs, you need to export each of those as well. 

1. Once the public key has been exported, open the file.

    :::image type="content" source="./media/certificates-for-backend-authentication/openAuthcert.png" alt-text="Screenshot of Open authorization certificate.":::

    :::image type="content" source="./media/mutual-authentication-certificate-management/general.png" alt-text="Screenshot of about certificate.":::

1. Select the Certification Path tab to view the certification authority.

    :::image type="content" source="./media/mutual-authentication-certificate-management/cert-details.png" alt-text="Screenshot of certificate details.":::

1. Select the root certificate and click on **View Certificate**.

    :::image type="content" source="./media/mutual-authentication-certificate-management/root-cert.png" alt-text="Screenshot of certificate path.":::

   You should see the root certificate details.

     :::image type="content" source="./media/mutual-authentication-certificate-management/root-cert-details.png" alt-text="Screenshot of certificate info.":::

1. Select the **Details** tab and click **Copy to File...**

     :::image type="content" source="./media/mutual-authentication-certificate-management/root-cert-copy-to-file.png" alt-text="Screenshot of copy root certificate.":::

1. At this point, you've extracted the details of the root CA certificate from the public certificate. You see the **Certificate Export Wizard**. Follow steps 2-7 from the previous section ([Export public certificate](./mutual-authentication-certificate-management.md#export-public-certificate)) to complete the Certificate Export Wizard. 

1. Now repeat steps 2-6 from this current section ([Export CA certificate(s) from the public certificate](./mutual-authentication-certificate-management.md#export-ca-certificates-from-the-public-certificate)) for all intermediate CAs to export all intermediate CA certificates in the Base-64 encoded X.509(.CER) format.

    :::image type="content" source="./media/mutual-authentication-certificate-management/intermediate-cert.png" alt-text="Screenshot of intermediate certificate.":::

    For example, you would repeat steps 2-6 from this section on the *MSIT CAZ2* intermediate CA to extract it as its own certificate. 

### Concatenate all your CA certificates into one file

1. Run the following command with all the CA certificates you extracted earlier. 

    Windows:
    ```console
    type intermediateCA.cer rootCA.cer > combined.cer
    ```
    
    Linux:
    ```console
    cat intermediateCA.cer rootCA.cer >> combined.cer
    ```

    Your resulting combined certificate should look something like the following:
    
    :::image type="content" source="./media/mutual-authentication-certificate-management/combined-cert.png" alt-text="Screenshot of combined certificate.":::

## Next steps

Now you have the trusted client CA certificate chain. You can add this to your client authentication configuration on the Application Gateway to allow mutual authentication with your gateway. See [configure mutual authentication using Application Gateway with Portal](./mutual-authentication-portal.md) or [configure mutual authentication using Application Gateway with PowerShell](./mutual-authentication-powershell.md).

