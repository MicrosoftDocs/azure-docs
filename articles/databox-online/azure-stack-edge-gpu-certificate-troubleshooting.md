---
title: Certificates troubleshooting with Azure Stack Edge Pro with GPU| Microsoft Docs
description: Describes troubleshooting certificate errors with Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: troubleshooting
ms.date: 06/01/2021
ms.author: alkohli
---

# Troubleshooting certificate errors

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

The article provides troubleshooting common certificate errors when installing certificates to your Azure Stack Edge Pro device.

## Common certificate errors

The following table shows common certificate errors and detailed information about these errors and possible solutions:

> [!NOTE]
> Occurrences of &#8220;{0}, {1}, ... , {n}&#8221; indicate positional parameters. The positional parameters will take values depending on the certificates that you are using.

| Error Code | Description |
|---|---|
| CertificateManagement_UntrustedCertificate | Certificate with subject name {0} has certificate chain broken. Upload the signing chain certificate before uploading this certificate.|
| CertificateManagement_DeviceNotRegistered| Your device is not activated. You can upload a support certificate only after activation.|
| CertificateManagement_ExpiredCertificate | Certificate with type {0} has expired or expires soon. Check the certificate expiration and if needed, bring in a new certificate.|
| CertificateManagement_FormatMismatch | Certificate format is not supported. Check the certificate format and if needed, bring in a new certificate.  Expected {0}, found {1}. |
| CertificateManagement_GenericError | Could not perform the certificate management operation. Retry this operation in few minutes. If the problem persists, contact Microsoft Support. |
| CertificateManagement_HttpsBindingFailure | Certificate with subject name {0} failed to create a secure https channel. Check the certificate you have uploaded and if needed bring in a new certificate. This error occurs with the device node certificate.|
| CertificateManagement_IncorrectKeyCertSignKeyUsage | Certificate with subject name {0} should not have key usage Certificate Signing. Check the key usage of the certificate and if needed, bring in a new certificate. This error occurs with the signing chain certificate. |
| CertificateManagement_IncorrectKeyNumber | Certificate with subject name {0} has an incorrect key number {1}. Check the key number of the certificate and if needed, bring in a new certificate.|
| CertificateManagement_InvalidP7b | Uploaded certificate file is not valid.  Check the certificate format and if needed, bring in a new certificate.|
| CertificateManagement_KeyAlgorithmNotRSA | This certificate does not use the RSA key algorithm. Only the RSA certificates are supported. |
| CertificateManagement_KeySizeNotSufficient | Certificate with subject name {0} has insufficient key size {1}. Minimum key size is 4096.|
| CertificateManagement_MissingClientOid | Certificate with subject name {0} does not have client authentication OID. Check your certificate properties and if needed, bring in a new certificate.|
| CertificateManagement_MissingDigitalSignatureKeyUsage | Certificate with subject name {0} does not have Digital Signature in Key Usage. Check your certificate properties and if needed, bring in a new certificate. |
| CertificateManagement_MissingKeyCertSignKeyUsage | Certificate with subject name {0} does not have Certificate Signing in Key Usage. Check your certificate properties and if needed, bring in a new certificate.|
| CertificateManagement_MissingKeyEnciphermentKeyUsage | Certificate with subject name {0} does not have Key Encipherment in Key Usage. Check your certificate properties and if needed, bring in a new certificate. |
| CertificateManagement_MissingServerOid | Certificate with subject name {0} does not have server authentication OID. Check your certificate properties and if needed, bring in a new certificate.|
| CertificateManagement_NameMismatch | Certificate type mismatch. Expected scope: {0}, found {1}. Upload appropriate certificate.|
| CertificateManagement_NoPrivateKeyPresent | Certificate with subject name {0} has no private key present. Upload a .pfx certificate with private key.|
| CertificateManagement_NoRSACryptoPrivateKey | The private key for certificate with subject name {​​​​​​​0}​​​​​​​ is not accessible. Make sure that you are using a supported certificate. Only the Microsoft RSA/Schannel Cryptographic Provider is supported. |
| CertificateManagement_NotSelfSignedCertificate | Certificate with subject name {0} is not self signed. Root certificates should be self signed |
| CertificateManagement_NotSupportedOnVirtualAppliance | This operation is not supported on the virtual device. This error indicates that signing will only occur with Data Box Gateway running in Tactical Cloud Appliance. This error occurs while managing the device through Windows PowerShell.|
| CertificateManagement_SelfSignedCertificate | Certificate with subject name {0} is self signed. Upload a certificate which is properly signed.|
| CertificateManagement_SignatureAlgorithmSha1 | Certificate with subject name {0} has unsupported signature algorithm. SHA1-RSA is not supported. |
| CertificateManagement_SubjectNamesInvalid | Certificate with subject name {0} does not have the correct subject name or subject alternative names for {1} certificate. Check the certificate you have uploaded and if needed bring in a new certificate. You should also check you DNS name to match the SANS names.|
| CertificateManagement_UnreadableCertificate | Certificate with type {0} could not be read. This error occurs when the certificate is unreadable or corrupted. Bring in a new certificate.|
| CertificateSubjectNotFound | Certificate with subject name {0} could not be found. Bring in a new certificate.|
| CertificateRotationGenericFailure | One or more certificates rotation failed. Retry in few minutes. If the problem persists, contact Microsoft Support.|
| CertificateImportFailure | Certificate with thumbprint {0} was not imported on node {1}. If the problem persists, contact Microsoft Support. |
| CertificateApplyFailure | Certificate with thumbprint {0} was not applied on node {1}. If the problem persists, contact Microsoft Support.|
| NodeNotReachable | Could not validate certificate on {0}. Check the system hardware and software health.|


## Next steps

- Review [Certificate requirements](azure-stack-edge-gpu-certificate-requirements.md).
- [Troubleshoot using device logs, diagnostic tests](azure-stack-edge-gpu-troubleshoot.md).
