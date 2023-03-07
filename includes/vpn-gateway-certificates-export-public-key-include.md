---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 07/06/2022
 ms.author: cherylmc

 # this include is used for both Virtual WAN and VPN Gateway articles. Any changes you make must apply address both services.
---
After you create a self-signed root certificate, export the root certificate .cer file (not the private key). You'll later upload the necessary certificate data contained in the file to Azure. The following steps help you export the .cer file for your self-signed root certificate and retrieve the necessary certificate data.

1. To get the certificate *.cer* file, open **Manage user certificates**.

   Locate the self-signed root certificate, typically in "Certificates - Current User\Personal\Certificates", and right-click. Click **All Tasks** -> **Export**. This opens the **Certificate Export Wizard**.

   If you can't find the certificate under "Current User\Personal\Certificates", you may have accidentally opened "Certificates - Local Computer", rather than "Certificates - Current User".

   :::image type="content" source="./media/vpn-gateway-certificates-export-public-key-include/export.png" alt-text="Screenshot shows the Certificates window with All Tasks  then Export selected." lightbox="./media/vpn-gateway-certificates-export-public-key-include/export.png":::

1. In the wizard, click **Next**.

1. Select **No, do not export the private key**, and then click **Next**.

   :::image type="content" source="./media/vpn-gateway-certificates-export-public-key-include/not-private-key.png" alt-text="Screenshot shows Do not export the private key." lightbox="./media/vpn-gateway-certificates-export-public-key-include/not-private-key.png":::

1. On the **Export File Format** page, select **Base-64 encoded X.509 (.CER).**, and then click **Next**.

   :::image type="content" source="./media/vpn-gateway-certificates-export-public-key-include/base-64.png" alt-text="Screenshot shows export Base-64 encoded." lightbox="./media/vpn-gateway-certificates-export-public-key-include/base-64.png":::

1. For **File to Export**, **Browse** to the location to which you want to export the certificate. For **File name**, name the certificate file. Then, click **Next**.

1. Click **Finish** to export the certificate.

1. You'll see a confirmation saying "The export was successful".

1. Go to the location where you exported the certificate and open it using a text editor, such as Notepad. If you exported the certificate in the required Base-64 encoded X.509 (.CER) format, you'll see text similar to the following example. The section highlighted in blue contains the information that you copy and upload to Azure.

   :::image type="content" source="./media/vpn-gateway-certificates-export-public-key-include/notepad-file.png" alt-text="Screenshot shows the CER file open in Notepad with the certificate data highlighted." lightbox="./media/vpn-gateway-certificates-export-public-key-include/notepad-file.png":::

   If your file doesn't look similar to the example, typically that means you didn't export it using the Base-64 encoded X.509(.CER) format. Additionally, if you use a text editor other than Notepad, understand that some editors can introduce unintended formatting in the background. This can create problems when uploaded the text from this certificate to Azure.
