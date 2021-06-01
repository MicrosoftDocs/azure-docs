---
title: Use certificates with Azure Stack Edge Pro GPU | Microsoft Docs
description: Describes use of certificates with Azure Stack Edge Pro GPU device including why to use, which types and how to upload certificates on your device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 03/08/2021
ms.author: alkohli
---
# Upload, import, and export certificates on Azure Stack Edge Pro GPU

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes the types of certificates that can be installed on your Azure Stack Edge Pro device. The article also includes the details for each certificate type along with the procedure to install and identify the expiration date.  

To ensure secure and trusted communication between your Azure Stack Edge device and the clients connecting to it, you can use self-signed certificates or bring your own certificates. This article describes how to manage these certificates including how to upload, import, export these certificates or view their expiration date.
To know more about how to create these certificates, see [Create certificates using Azure PowerShell]().


## Upload certificates 

The certificates that you created for your device by default reside in the **Personal store** on your client. These certificates need to be exported on your client into appropriate format files that can then be uploaded to your device.

1. The root certificate must be exported as DER format with `.cer` extension. For detailed steps, see [Export certificates as DER format](#export-certificates-as-der-format).
2. The endpoint certificates must be exported as *.pfx* files with private keys. For detailed steps, see [Export certificates as *.pfx* file with private keys](#export-certificates-as-pfx-format-with-private-key). 
3. The root and endpoint certificates are then uploaded on the device using the **+ Add certificate** option on the Certificates page in the local web UI. 

    1. Upload the root certificates first. In the local web UI, go to **Certificates > + Add certificate**.

        ![Add signing chain certificate 1](media/azure-stack-edge-series-manage-certificates/add-cert-1.png)

    2. Next upload the endpoint certificates. 

        ![Add signing chain certificate 2](media/azure-stack-edge-series-manage-certificates/add-cert-2.png)

        Choose the certificate files in *.pfx* format and enter the password you supplied when you exported the certificate. The Azure Resource Manager certificate may take a few minutes to apply.

        If the signing chain is not updated first, and you try to upload the endpoint certificates, then you will get an error.

        ![Apply certificate error](media/azure-stack-edge-series-manage-certificates/apply-cert-error-1.png)

        Go back and upload the signing chain certificate and then upload and apply the endpoint certificates.

> [!IMPORTANT]
> If the device name or the DNS domain are changed, new certificates must be created. The client certificates and the device certificates should then be updated with the new device name and DNS domain. 

## Import certificates on the client accessing the device

The certificates that you created and uploaded to your device must be imported on your Windows client (accessing the device) into the appropriate certificate store.

1. The root certificate that you exported as the DER should now be imported in the **Trusted Root Certificate Authorities** on your client system. For detailed steps, see [Import certificates into the Trusted Root Certificate Authorities store](#import-certificates-as-der-format).

2. The endpoint certificates that you exported as the `.pfx` must be exported as DER with `.cer` extension. This `.cer` is then imported in the **Personal certificate store** on your system. For detailed steps, see [Import certificates into the Personal certificate store](#import-certificates-as-der-format).

### Import certificates as DER format

To import certificates on a Windows client, take the following steps:

1. Right-click the file and select **Install certificate**. This action starts the Certificate Import Wizard.

    ![Import certificate 1](media/azure-stack-edge-series-manage-certificates/import-cert-1.png)

2. For **Store location**, select **Local Machine**, and then select **Next**.

    ![Import certificate 2](media/azure-stack-edge-series-manage-certificates/import-cert-2.png)

3. Select **Place all certificates in the following store**, and then select **Browse**. 

    - To import into personal store, navigate to the Personal store of your remote host, and then select **Next**.

        ![Import certificate 4](media/azure-stack-edge-series-manage-certificates/import-cert-4.png)


    - To import into trusted store, navigate to the Trusted Root Certificate Authority, and then select **Next**.

        ![Import certificate 3](media/azure-stack-edge-series-manage-certificates/import-cert-3.png)

 
4. Select **Finish**. A message to the effect that the import was successful appears.

### Export certificates as .pfx format with private key

Take the following steps to export an SSL certificate with private key on a Windows machine. 

> [!IMPORTANT]
> Perform these steps on the same machine that you used to create the certificate. 

1. Run *certlm.msc* to launch the local machine certificate store.

1. Double click on the **Personal** folder, and then on **Certificates**.

    ![Export certificate 1](media/azure-stack-edge-series-manage-certificates/export-cert-pfx-1.png)
 
2. Right-click on the certificate you would like to back up and choose **All tasks > Export...**

    ![Export certificate 2](media/azure-stack-edge-series-manage-certificates/export-cert-pfx-2.png)

3. Follow the Certificate Export Wizard to back up your certificate to a .pfx file.

    ![Export certificate 3](media/azure-stack-edge-series-manage-certificates/export-cert-pfx-3.png)

4. Choose **Yes, export the private key**.

    ![Export certificate 4](media/azure-stack-edge-series-manage-certificates/export-cert-pfx-4.png)

5. Choose **Include all certificates in certificate path if possible**, **Export all extended properties** and **Enable certificate privacy**. 

    > [!IMPORTANT]
    > DO NOT select the **Delete Private Key option if export is successful**.

    ![Export certificate 5](media/azure-stack-edge-series-manage-certificates/export-cert-pfx-5.png)

6. Enter a password you will remember. Confirm the password. The password protects the private key.

    ![Export certificate 6](media/azure-stack-edge-series-manage-certificates/export-cert-pfx-6.png)

7. Choose to save file on a set location.

    ![Export certificate 7](media/azure-stack-edge-series-manage-certificates/export-cert-pfx-7.png)
  
8. Select **Finish**.

    ![Export certificate 8](media/azure-stack-edge-series-manage-certificates/export-cert-pfx-8.png)

9. You receive a message The export was successful. Select **OK**.

    ![Export certificate 9](media/azure-stack-edge-series-manage-certificates/export-cert-pfx-9.png)

The .pfx file backup is now saved in the location you selected and is ready to be moved or stored for your safe keeping.


### Export certificates as DER format

1. Run *certlm.msc* to launch the local machine certificate store.

1. In the Personal certificate store, select the root certificate. Right-click and select **All Tasks > Export...**

    ![Export certificate DER 1](media/azure-stack-edge-series-manage-certificates/export-cert-cer-1.png)

2. The certificate wizard opens up. Select the format as **DER encoded binary X.509 (.cer)**. Select **Next**.

    ![Export certificate DER 2](media/azure-stack-edge-series-manage-certificates/export-cert-cer-2.png)

3. Browse and select the location where you want to export the .cer format file.

    ![Export certificate DER 3](media/azure-stack-edge-series-manage-certificates/export-cert-cer-3.png)

4. Select **Finish**.

    ![Export certificate DER 4](media/azure-stack-edge-series-manage-certificates/export-cert-cer-4.png)


## View certificate expiry

If you bring in your own certificates, the certificates will expire typically in 1 year or 6 months. To view the expiration date on your certificate, go to the **Certificates** page in the local web UI of your device. If you select a specific certificate, you can view the expiration date on your certificate.


## Next steps

Learn how to [Troubleshoot certificate issues](azure-stack-edge-gpu-certificate-troubleshooting.md)