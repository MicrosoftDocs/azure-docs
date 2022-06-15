---
title: Prepare certificates to upload on your Azure Stack Edge Pro GPU/Pro R/Mini R
description: Describes how to prepare certificates to upload on Azure Stack Edge Pro GPU/Pro R/Mini R devices.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 02/08/2022
ms.author: alkohli
---
# Prepare certificates to upload on your Azure Stack Edge Pro GPU

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to convert the certificates into appropriate format for upload on your Azure Stack Edge device. This procedure is typically required when you bring your own certificates.

To know more about how to create these certificates, see [Create certificates using Azure PowerShell](azure-stack-edge-gpu-create-certificates-powershell.md).


## Prepare certificates

If you bring your own certificates, then the certificates that you created for your device by default reside in the **Personal store** on your client. These certificates need to be exported on your client into appropriate format files that can then be uploaded to your device.

- **Prepare root certificates**: The root certificate must be exported as DER format with `.cer` extension. For detailed steps, see [Export certificates as DER format](#export-certificates-as-der-format).

- **Prepare endpoint certificates**: The endpoint certificates must be exported as *.pfx* files with private keys. For detailed steps, see [Export certificates as *.pfx* file with private keys](#export-certificates-as-pfx-format-with-private-key). 


## Export certificates as DER format

1. Run *certlm.msc* to launch the local machine certificate store.

2. In the Personal certificate store, select the root certificate. Right-click and select **All Tasks > Export...**

    ![Illustration showing the Local Machine Store on a device with the Root certificate selected for Export.](media/azure-stack-edge-gpu-manage-certificates/export-cert-cer-1.png)

3. The certificate wizard opens. Select the format **DER encoded binary X.509 (.cer)**. Select **Next**.

    ![Screenshot of the Export File Format page of the Certificate Export Wizard. The selected DER format and the Next button are highlighted.](media/azure-stack-edge-gpu-manage-certificates/export-cert-cer-2.png)

4. Browse and select the location where you want to export the .cer format file.

    ![Screenshot of the File To Export page of the Certificate Export Wizard with a certificate file uploaded. The Browse button and Next button are highlighted.](media/azure-stack-edge-gpu-manage-certificates/export-cert-cer-3.png)

5. Select **Finish**.

    ![Screenshot of the completion page of the Certificate Export Wizard. The Finish button is highlighted.](media/azure-stack-edge-gpu-manage-certificates/export-cert-cer-4.png)

## Export certificates as .pfx format with private key

Take the following steps to export an SSL certificate with private key on a Windows machine. 

> [!IMPORTANT]
> Perform these steps on the same machine that you used to create the certificate. 

1. Run *certlm.msc* to launch the local machine certificate store.

2. Double-click on the **Personal** folder, and then on **Certificates**.

    ![Screenshot of the Local Machine Store on a device with Certificates displayed for the Personal store. The Personal folder and Certificates store are highlighted.](media/azure-stack-edge-gpu-manage-certificates/export-cert-pfx-1.png)
 
3. Right-click on the certificate you would like to back up and choose **All tasks > Export...**.

    ![Screenshot showing the Export option for a selected certificate in the Personal Certificates store on a device. The Export option on the All Tasks menu is highlighted.](media/azure-stack-edge-gpu-manage-certificates/export-cert-pfx-2.png)

4. Follow the Certificate Export Wizard to back up your certificate to a .pfx file.

    ![Screenshot of the Welcome page of the Certificate Export Wizard. The Next button is highlighted.](media/azure-stack-edge-gpu-manage-certificates/export-cert-pfx-3.png)

5. Choose **Yes, export the private key**.

    ![Screenshot of the Export Private Key page of the Certificate Export Wizard. The Export The Private Key option and Next button are highlighted.](media/azure-stack-edge-gpu-manage-certificates/export-cert-pfx-4.png)

6. Choose **Include all certificates in certificate path if possible**, **Export all extended properties** and **Enable certificate privacy**.

   When you include all certificates in your export, you don't need to add the signing chain separately before adding that certificate when you configure certificates using the local web UI. For more information, see [Bring your own certificates](azure-stack-edge-gpu-deploy-configure-certificates.md#bring-your-own-certificates).

    > [!IMPORTANT]
    > DO NOT select the **Delete Private Key option if export is successful**.

    ![Screenshot of the Export File Format page of the Certificate Export Wizard. The Personal Information Exchange options and the Next button are highlighted.](media/azure-stack-edge-gpu-manage-certificates/export-cert-pfx-5.png)

7. Enter a password you will remember. Confirm the password. The password protects the private key.

    ![Screenshot of the Security page of the Certificate Export Wizard with a password entered. The Password and Confirm Password options are highlighted.](media/azure-stack-edge-gpu-manage-certificates/export-cert-pfx-6.png)

8. Choose to save the file in a set location.

    ![Screenshot of the completion page of the Certificate Export Wizard for a certificate exported in DER format. The Finish button is highlighted.](media/azure-stack-edge-gpu-manage-certificates/export-cert-pfx-7.png)
  
9. Select **Finish**.

    ![Export certificate 8](media/azure-stack-edge-gpu-manage-certificates/export-cert-pfx-8.png)

10. You receive a message that the export was successful. Select **OK**.

    ![Screenshot showing the notification for a successful certificate export. The OK button is highlighted.](media/azure-stack-edge-gpu-manage-certificates/export-cert-pfx-9.png)

The .pfx file backup is now saved in the selected location, and is ready to be moved or stored for safekeeping.


## Next steps

Learn how to [Upload certificates on your device](azure-stack-edge-gpu-manage-certificates.md).
