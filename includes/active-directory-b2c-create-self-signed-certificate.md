---
author: kengaderdus
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 11/12/2021
ms.author: kengaderdus
# Used by the identity provider (IdP) setup articles under "Custom policy".
---

If you don't already have a certificate, you can use a self-signed certificate. A self-signed certificate is a security certificate that is not signed by a certificate authority (CA) and doesn't provide the security guarantees of a certificate signed by a CA. 

# [Windows](#tab/windows)

On Windows, use the [New-SelfSignedCertificate](/powershell/module/pki/new-selfsignedcertificate) cmdlet in PowerShell to generate a certificate.

1. Run the following PowerShell command to generate a self-signed certificate. Modify the `-Subject` argument as appropriate for your application and Azure AD B2C tenant name such as `contosowebapp.contoso.onmicrosoft.com`. You can also adjust the `-NotAfter` date to specify a different expiration for the certificate.

    ```PowerShell
    New-SelfSignedCertificate `
        -KeyExportPolicy Exportable `
        -Subject "CN=yourappname.yourtenant.onmicrosoft.com" `
        -KeyAlgorithm RSA `
        -KeyLength 2048 `
        -KeyUsage DigitalSignature `
        -NotAfter (Get-Date).AddMonths(12) `
        -CertStoreLocation "Cert:\CurrentUser\My"
    ```

1. On Windows computer, search for and select **Manage user certificates** 
1. Under **Certificates - Current User**, select **Personal** > **Certificates**>*yourappname.yourtenant.onmicrosoft.com*.
1. Select the certificate, and then select **Action** > **All Tasks** > **Export**.
1. Select **Next** > **Yes, export the private key** > **Next**.
1. Accept the defaults for **Export File Format**, and then select **Next**.
1. Enable **Password** option, enter a password for the certificate, and then select **Next**.
1. To specify a location to save your certificate, select **Browse** and navigate to a directory of your choice. 
1. On the **Save As** window, enter a **File name**, and then select **Save**.
1. Select **Next**>**Finish**.

For Azure AD B2C to accept the .pfx file password, the password must be encrypted with the TripleDES-SHA1 option in the Windows Certificate Store Export utility, as opposed to AES256-SHA256.

# [macOS](#tab/macos)

On macOS, use [Certificate Assistant](https://support.apple.com/guide/keychain-access/aside/glosa3ed0609/11.0/mac/11.0) in Keychain Access to generate a certificate.

1. Follow the instructions for how to [create self-signed certificates in Keychain Access on a Mac](https://support.apple.com/guide/keychain-access/kyca8916/mac).
1. In the Keychain Access app on your Mac, select the certificate that you created.
1. Select **File** > **Export Items**.
1. Select a file name to save your certificate. For example: **self-signed-certificate.p12**.
1. For **File Format**, select **Personal Information Exchange (.p12)**.
1. Select **Save**.
1. Enter a password in the **Password** and **Verify** boxes.
1. Replace the file extension to .pfx. For example: **self-signed-certificate.pfx**.

---
