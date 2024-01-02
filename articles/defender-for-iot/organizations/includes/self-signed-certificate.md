---
title: include
author: batamig
ms.date: 02/05/2023
ms.topic: include
---


1. Select the :::image type="icon" source="../media/how-to-deploy-certificates/warning-icon.png" border="false"::: **Not secure** alert in the address bar of your web browser, then select the **>** icon next to the warning message **"Your connection to this site isn't secure"**. For example:

    :::image type="content" source="../media/how-to-deploy-certificates/connection-is-not-secure.png" alt-text="Screenshot of web page with a Not secure warning in the address bar." lightbox="../media/how-to-deploy-certificates/connection-is-not-secure.png":::

1. Select the :::image type="icon" source="../media/how-to-deploy-certificates/show-certificate-icon.png" border="false"::: **Show certificate** icon to view the security certificate for this website.

1. In the **Certificate viewer** pane, select the **Details** tab, then select **Export** to enter a name for your exported file and save it on your local machine. 

1. Use a certificate management platform to create the following types of SSL/TLS certificate files:

    | File type  | Description  |
    |---------|---------|
    | **.crt – certificate container file** | A `.pem`, or `.der` file, with a different extension for support in Windows Explorer.|
    | **.key – Private key file** | A key file is in the same format as a `.pem` file, with a different extension for support in Windows Explorer.|
    | **.pem – certificate container file (optional)** | Optional. A text file with a Base64-encoding of the certificate text, and a plain-text header and footer to mark the beginning and end of the certificate. |

    For example:

    1. Open the downloaded certificate file and select the **Details** tab > **Copy to file** to run the **Certificate Export Wizard**.

    1. In the **Certificate Export Wizard**, select **Next** > **DER encoded binary X.509 (.CER)** > and then select **Next** again.

    1. In the **File to Export** screen, select **Browse**, choose a location to store the certificate, and then select **Next**.

    1. Select **Finish** to export the certificate.

> [!NOTE]
> You may need to convert existing files types to supported types.