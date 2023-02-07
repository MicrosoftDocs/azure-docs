---
title: Export trusted client CA certificate chain for client authentication
titleSuffix: Azure Application Gateway
description: Learn how to export a trusted client CA certificate chain for client authentication on Azure Application Gateway
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: how-to
ms.date: 03/31/2021
ms.author: greglin
---

# Export a trusted client CA certificate chain to use with client authentication
In order to configure mutual authentication with the client, or client authentication, Application Gateway requires a trusted client CA certificate chain to be uploaded to the gateway. If you have multiple certificate chains, you'll need to create the chains separately and upload them as different files on the Application Gateway. In this article, you'll learn how to export a trusted client CA certificate chain that you can use in your client authentication configuration on your gateway.  

## Prerequisites

An existing client certificate is required to generate the trusted client CA certificate chain. 

## Export trusted client CA certificate

Trusted client CA certificate is required to allow client authentication on Application Gateway. In this example, we will use a TLS/SSL certificate for the client certificate, export its public key and then export the CA certificates from the public key to get the trusted client CA certificates. We'll then concatenate all the client CA certificates into one trusted client CA certificate chain. 

The following steps help you export the .pem or .cer file for your certificate:

### Export public certificate 

1. To obtain a .cer file from the certificate, open **Manage user certificates**. Locate the certificate, typically in 'Certificates - Current User\Personal\Certificates', and right-click. Click **All Tasks**, and then click **Export**. This opens the **Certificate Export Wizard**. If you can't find the certificate under Current User\Personal\Certificates, you may have accidentally opened "Certificates - Local Computer", rather than "Certificates - Current User"). If you want to open Certificate Manager in current user scope using PowerShell, you type *certmgr* in the console window.

    > [!div class="mx-imgBorder"]
    > ![Screenshot shows the Certificate Manager with Certificates selected and a contextual menu with All tasks, then Export selected.](./media/certificates-for-backend-authentication/export.png)

2. In the Wizard, click **Next**.
    > [!div class="mx-imgBorder"]
    > ![Export certificate](./media/certificates-for-backend-authentication/exportwizard.png)

3. Select **No, do not export the private key**, and then click **Next**.
    > [!div class="mx-imgBorder"]
    > ![Do not export the private key](./media/certificates-for-backend-authentication/notprivatekey.png)

4. On the **Export File Format** page, select **Base-64 encoded X.509 (.CER).**, and then click **Next**.
    > [!div class="mx-imgBorder"]
    > ![Base-64 encoded](./media/certificates-for-backend-authentication/base64.png)

5. For **File to Export**, **Browse** to the location to which you want to export the certificate. For **File name**, name the certificate file. Then, click **Next**.

    > [!div class="mx-imgBorder"]
   > ![Screenshot shows the Certificate Export Wizard where you specify a file to export.](./media/certificates-for-backend-authentication/browse.png)

6. Click **Finish** to export the certificate.

    > [!div class="mx-imgBorder"]
    > ![Screenshot shows the Certificate Export Wizard after you complete the file export.](./media/certificates-for-backend-authentication/finish-screen.png)

7. Your certificate is successfully exported.

    > [!div class="mx-imgBorder"]
    > ![Screenshot shows the Certificate Export Wizard with a success message.](./media/certificates-for-backend-authentication/success.png)

   The exported certificate looks similar to this:

    > [!div class="mx-imgBorder"]
    > ![Screenshot shows a certificate symbol.](./media/certificates-for-backend-authentication/exported.png)

### Export CA certificate(s) from the public certificate

Now that you've exported your public certificate, you will now export the CA certificate(s) from your public certificate. If you only have a root CA, you'll only need to export that certificate. However, if you have 1+ intermediate CAs, you'll need to export each of those as well. 

1. Once the public key has been exported, open the file.

    > [!div class="mx-imgBorder"]
    > ![Open authorization certificate](./media/certificates-for-backend-authentication/openAuthcert.png)

    > [!div class="mx-imgBorder"]
    > ![about certificate](./media/mutual-authentication-certificate-management/general.png)

1. Select the Certification Path tab to view the certification authority.

    > [!div class="mx-imgBorder"]
    > ![cert details](./media/mutual-authentication-certificate-management/cert-details.png) 

1. Select the root certificate and click on **View Certificate**.

    > [!div class="mx-imgBorder"]
    > ![cert path](./media/mutual-authentication-certificate-management/root-cert.png) 

   You should see the root certificate details.

    > [!div class="mx-imgBorder"]
    > ![cert info](./media/mutual-authentication-certificate-management/root-cert-details.png)

1. Select the **Details** tab and click **Copy to File...**

    > [!div class="mx-imgBorder"]
    > ![copy root cert](./media/mutual-authentication-certificate-management/root-cert-copy-to-file.png)

1. At this point, you've extracted the details of the root CA certificate from the public certificate. You'll see the **Certificate Export Wizard**. Follow steps 2-7 from the previous section ([Export public certificate](./mutual-authentication-certificate-management.md#export-public-certificate)) to complete the Certificate Export Wizard. 

1. Now repeat steps 2-6 from this current section ([Export CA certificate(s) from the public certificate](./mutual-authentication-certificate-management.md#export-ca-certificates-from-the-public-certificate)) for all intermediate CAs to export all intermediate CA certificates in the Base-64 encoded X.509(.CER) format.

    > [!div class="mx-imgBorder"]
    > ![intermediate cert](./media/mutual-authentication-certificate-management/intermediate-cert.png)

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
    
    > [!div class="mx-imgBorder"]
    > ![combined cert](./media/mutual-authentication-certificate-management/combined-cert.png)

## Next steps

Now you have the trusted client CA certificate chain. You can add this to your client authentication configuration on the Application Gateway to allow mutual authentication with your gateway. See [configure mutual authentication using Application Gateway with Portal](./mutual-authentication-portal.md) or [configure mutual authentication using Application Gateway with PowerShell](./mutual-authentication-powershell.md).

