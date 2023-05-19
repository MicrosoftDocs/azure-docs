---
title: include
author: batamig
ms.date: 02/02/2023
ms.topic: include
---

You won't be able to upload certificates to your OT sensors or on-premises management consoles if the certificates aren't created properly or are invalid. Use the following table to understand how to take action if your certificate upload fails and an error message is shown:

| **Certificate validation error** | **Recommendation** |
|--|--|
| **Passphrase does not match to the key** | Make sure you have the correct passphrase. If the problem continues, try recreating the certificate using the correct passphrase. |
| **Cannot validate chain of trust. The provided Certificate and Root CA don't match.**  | Make sure a `.pem` file correlates to the  `.crt` file. <br> If the problem continues, try recreating the certificate using the correct chain of trust, as defined by the `.pem` file. |
| **This SSL certificate has expired and isn't considered valid.**  | Create a new certificate with valid dates.|
|**This certificate has been revoked by the CRL and can't be trusted for a secure connection** | Create a new unrevoked certificate. |
|**The CRL (Certificate Revocation List) location is not reachable. Verify the URL can be accessed from this appliance** | Make sure that your network configuration allows the sensor or on-premises management console to reach the CRL server defined in the certificate. <br> For more information, see [Verify CRL server access](../ot-deploy/create-ssl-certificates.md#verify-crl-server-access). |
|**Certificate validation failed**  | This indicates a general error in the appliance. <br> Contact [Microsoft Support](https://support.microsoft.com/supportforbusiness/productselection?sapId=82c8f35-1b8e-f274-ec11-c6efdd6dd099).|