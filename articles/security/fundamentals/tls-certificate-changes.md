---
title: Azure TLS Certificate Changes
description: Azure TLS Certificate Changes
services: security
author: msmbaldwin
tags: azure-resource-manager

ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 10/21/2022
ms.author: mbaldwin

---

# Azure TLS certificate changes  

> [!IMPORTANT]
> This article was published concurrent with the TLS certificate change, and is not being updated. For up-to-date information about CAs, see [Azure Certificate Authority details](azure-ca-details.md).

Microsoft uses TLS certificates from the set of Root Certificate Authorities (CAs) that adhere to the CA/Browser Forum Baseline Requirements. All Azure TLS/SSL endpoints contain certificates chaining up to the Root CAs provided in this article. Changes to Azure endpoints began transitioning in August 2020, with some services completing their updates in 2022. All newly created Azure TLS/SSL endpoints contain updated certificates chaining up to the new Root CAs.

All Azure services are impacted by this change. Details for some services are listed below:

- [Azure Active Directory](../../active-directory/index.yml) (Azure AD) services began this transition on July 7, 2020.
- For the most up-to-date information about the TLS certificate changes for Azure IoT services, refer to [this Azure IoT blog post](https://techcommunity.microsoft.com/t5/internet-of-things-blog/azure-iot-tls-critical-changes-are-almost-here-and-why-you/ba-p/2393169).
  - [Azure IoT Hub](../../iot-hub/iot-hub-tls-support.md) began this transition in February 2023 with an expected completion in October 2023.
  - [Azure IoT Central](../../iot-central/index.yml) will begin this transition in July 2023.
  - [Azure IoT Hub Device Provisioning Service](../../iot-dps/tls-support.md) will begin this transition in January 2024.
- [Azure Cosmos DB](/security/benchmark/azure/baselines/cosmos-db-security-baseline) began this transition in July 2022 with an expected completion in October 2022.
- Details on [Azure Storage](../../storage/common/transport-layer-security-configure-minimum-version.md) TLS certificate changes can be found in [this Azure Storage blog post](https://techcommunity.microsoft.com/t5/azure-storage/azure-storage-tls-critical-changes-are-almost-here-and-why-you/ba-p/2741581).
- [Azure Cache for Redis](../../azure-cache-for-redis/cache-overview.md) is moving away from TLS certificates issued by Baltimore CyberTrust Root starting May 2022, as described in this [Azure Cache for Redis article](../../azure-cache-for-redis/cache-whats-new.md)
- [Azure Instance Metadata Service](../../virtual-machines/linux/instance-metadata-service.md) has an expected completion in May 2022, as described in [this Azure Governance and Management blog post](https://techcommunity.microsoft.com/t5/azure-governance-and-management/azure-instance-metadata-service-attested-data-tls-critical/ba-p/2888953).

## What changed?

Prior to the change, most of the TLS certificates used by Azure services chained up to the following Root CA:

| Common name of the CA | Thumbprint (SHA1) |
|--|--|
| [Baltimore CyberTrust Root](https://cacerts.digicert.com/BaltimoreCyberTrustRoot.crt) | d4de20d05e66fc53fe1a50882c78db2852cae474 |

After the change, TLS certificates used by Azure services will chain up to one of the following Root CAs:

| Common name of the CA | Thumbprint (SHA1) |
|--|--|
| [DigiCert Global Root G2](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt) | df3c24f9bfd666761b268073fe06d1cc8d4f82a4 |
| [DigiCert Global Root CA](https://cacerts.digicert.com/DigiCertGlobalRootCA.crt) | a8985d3a65e5e5c4b2d7d66d40c6dd2fb19c5436 |
| [Baltimore CyberTrust Root](https://cacerts.digicert.com/BaltimoreCyberTrustRoot.crt) | d4de20d05e66fc53fe1a50882c78db2852cae474 |
| [D-TRUST Root Class 3 CA 2 2009](https://www.d-trust.net/cgi-bin/D-TRUST_Root_Class_3_CA_2_2009.crt) | 58e8abb0361533fb80f79b1b6d29d3ff8d5f00f0 |
| [Microsoft RSA Root Certificate Authority 2017](https://www.microsoft.com/pkiops/certs/Microsoft%20RSA%20Root%20Certificate%20Authority%202017.crt) | 73a5e64a3bff8316ff0edccc618a906e4eae4d74 | 
| [Microsoft ECC Root Certificate Authority 2017](https://www.microsoft.com/pkiops/certs/Microsoft%20ECC%20Root%20Certificate%20Authority%202017.crt) | 999a64c37ff47d9fab95f14769891460eec4c3c5 |

## <a id="will-this-change-affect-me"></a>Was my application impacted?

If your application explicitly specifies a list of acceptable CAs, your application was likely impacted. This practice is known as certificate pinning. Review the [Microsoft Tech Community article on Azure Storage TLS changes](https://techcommunity.microsoft.com/t5/azure-storage-blog/azure-storage-tls-critical-changes-are-almost-here-and-why-you/ba-p/2741581) for more information on how to determine if your services were impacted and next steps.

Here are some ways to detect if your application was impacted:

- Search your source code for the thumbprint, Common Name, and other cert properties of any of the Microsoft IT TLS CAs in the [Microsoft PKI repository](https://www.microsoft.com/pki/mscorp/cps/default.htm). If there's a match, then your application will be impacted. To resolve this problem, update the source code include the new CAs. As a best practice, ensure that CAs can be added or edited on short notice. Industry regulations require CA certificates to be replaced within seven days of the change and hence customers relying on pinning need to react swiftly.

- If you have an application that integrates with Azure APIs or other Azure services and you're unsure if it uses certificate pinning, check with the application vendor.

- Different operating systems and language runtimes that communicate with Azure services may require more steps to correctly build the certificate chain with these new roots:
    - **Linux**: Many distributions require you to add CAs to /etc/ssl/certs. For specific instructions, refer to the distribution’s documentation.
    - **Java**: Ensure that the Java key store contains the CAs listed above.
    - **Windows running in disconnected environments**: Systems running in disconnected environments will need to have the new roots added to the Trusted Root Certification Authorities store, and the intermediates added to the Intermediate Certification Authorities store.
    - **Android**: Check the documentation for your device and version of Android.
    - **Other hardware devices, especially IoT**: Contact the device manufacturer.

- If you have an environment where firewall rules are set to allow outbound calls to only specific Certificate Revocation List (CRL) download and/or Online Certificate Status Protocol (OCSP) verification locations, you'll need to allow the following CRL and OCSP URLs. For a complete list of CRL and OCSP URLs used in Azure, see the [Azure CA details article](azure-CA-details.md#certificate-downloads-and-revocation-lists).

    - http://crl3&#46;digicert&#46;com
    - http://crl4&#46;digicert&#46;com
    - http://ocsp&#46;digicert&#46;com
    - http://crl&#46;microsoft&#46;com
    - http://oneocsp&#46;microsoft&#46;com
    - http://ocsp&#46;msocsp&#46;com

## Next steps

If you have questions, contact us through [support](https://azure.microsoft.com/support/options/).
