---
title: SSL/TLS certificate file requirements - Microsoft Defender for IoT
description: Learn about requirements for SSL/TLS certificates used with Microsoft Defender for IOT OT sensors and on-premises management consoles.
ms.date: 01/17/2023
ms.topic: install-set-up-deploy
---

# SSL/TLS certificate requirements for on-premises resources

This article is one in a series of articles describing the [deployment path](../ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT.

Use the content below to learn about the requirements for [creating SSL/TLS certificates](../ot-deploy/create-ssl-certificates.md) for use with Microsoft Defender for IoT appliances.

:::image type="content" source="../media/deployment-paths/progress-plan-and-prepare.png" alt-text="Diagram of a progress bar with Plan and prepare highlighted." border="false" lightbox="../media/deployment-paths/progress-plan-and-prepare.png":::

Defender for IoT uses SSL/TLS certificates to secure communication between the following system components:

- Between users and the OT sensor or on-premises management console UI access
- Between OT sensors and an on-premises management console, including [API communication](../references-work-with-defender-for-iot-apis.md)
- Between an on-premises management console and a high availability (HA) server, if configured
- Between OT sensors or on-premises management consoles and partners servers defined in [alert forwarding rules](../how-to-forward-alert-information-to-partners.md)

Some organizations also validate their certificates against a Certificate Revocation List (CRL) and the certificate expiration date, and the certificate trust chain. Invalid certificates can't be uploaded to OT sensors or on-premises management consoles, and will block encrypted communication between Defender for IoT components.

> [!IMPORTANT]
> You must create a unique certificate for each OT sensor, on-premises management console, and high availability server, where each certificate meets required criteria.

## Supported file types

When preparing SSL/TLS certificates for use with Microsoft Defender for IoT, make sure to create the following file types:

| File type  | Description  |
|---------|---------|
| **.crt – certificate container file** | A `.pem`, or `.der` file, with a different extension for support in Windows Explorer.|
| **.key – Private key file** | A key file is in the same format as a `.pem` file, with a different extension for support in Windows Explorer.|
| **.pem – certificate container file (optional)** | Optional. A text file with a Base64-encoding of the certificate text, and a plain-text header and footer to mark the beginning and end of the certificate. |

## CRT file requirements

Make sure that your certificates include the following CRT parameter details:

| Field | Requirement |
|---------|---------|
| **Signature Algorithm** | SHA256RSA |
| **Signature Hash Algorithm** | SHA256 |
| **Valid from** | A  valid past date |
| **Valid To** | A valid future date |
| **Public Key** | RSA 2048 bits (Minimum) or 4096 bits |
| **CRL Distribution Point** | URL to a CRL server. If your organization doesn't [validate certificates against a CRL server](../ot-deploy/create-ssl-certificates.md#verify-crl-server-access), remove this line from the certificate. |
| **Subject CN (Common Name)** | domain name of the appliance, such as *sensor.contoso.com*, or *.contosocom* |
| **Subject (C)ountry** | Certificate country code, such as `US` |
| **Subject (OU) Org Unit** | The organization's unit name, such as *Contoso Labs* |
| **Subject (O)rganization** | The organization's name, such as *Contoso Inc.* |

> [!IMPORTANT]
> While certificates with other parameters might work, they aren't supported by Defender for IoT. Additionally, wildcard SSL certificates, which are public key certificates that can beused on multiple subdomains such as *.contoso.com*, are insecure and aren't supported.
> Each appliance must use a unique CN.

## Key file requirements

Make sure that your certificate key files use either RSA 2048 bits or 4096 bits. Using a key length of 4096 bits slows down the SSL handshake at the start of each connection, and increases the CPU usage during handshakes.

## Next steps

> [!div class="step-by-step"]
> [« Plan your OT monitoring system](plan-corporate-monitoring.md)
