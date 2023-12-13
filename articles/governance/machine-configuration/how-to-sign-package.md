---
title: How to sign machine configuration packages
description: You can optionally sign machine configuration content packages and force the agent to only allow signed content
ms.date: 04/18/2023
ms.topic: how-to
---

# How to sign machine configuration packages

[!INCLUDE [Machine configuration rename banner](../includes/banner.md)]

Machine configuration custom policies use SHA256 hash to validate the policy package hasn't
changed. Optionally, customers may also use a certificate to sign packages and force the machine
configuration extension to only allow signed content.

To enable this scenario, there are two steps you need to complete. Run the cmdlet to sign the
content package, and append a tag to the machines that should require code to be signed.

## Signature validation using a code signing certificate

To use the Signature Validation feature, run the `Protect-GuestConfigurationPackage` cmdlet to sign
the package before it's published. This cmdlet requires a 'Code Signing' certificate. If you don't
have a 'Code Signing' certificate, use the following script to create a self-signed certificate for
testing purposes to follow along with the example.

## Windows signature validation

```azurepowershell-interactive
# How to create a self sign cert and use it to sign Machine Configuration
# custom policy package

# Create Code signing cert
$codeSigningParams = @{
    Type          = 'CodeSigningCert'
    DnsName       = 'GCEncryptionCertificate'
    HashAlgorithm = 'SHA256'
}
$mycert = New-SelfSignedCertificate @codeSigningParams

# Export the certificates
$mypwd = ConvertTo-SecureString -String "Password1234" -Force -AsPlainText
$mycert | Export-PfxCertificate -FilePath C:\demo\GCPrivateKey.pfx -Password $mypwd
$mycert | Export-Certificate -FilePath "C:\demo\GCPublicKey.cer" -Force

# Import the certificate
$importParams = @{
    FilePath          = 'C:\demo\GCPrivateKey.pfx'
    Password          = $mypwd
    CertStoreLocation = 'Cert:\LocalMachine\My'
}
Import-PfxCertificate @importParams

# Sign the policy package
$certToSignThePackage = Get-ChildItem -Path cert:\LocalMachine\My |
    Where-Object { $_.Subject-eq "CN=GCEncryptionCertificate" }
$protectParams = @{
    Path        = 'C:\demo\AuditWindowsService.zip'
    Certificate = $certToSignThePackage
    Verbose     = $true
}
Protect-GuestConfigurationPackage @protectParams
```

## Linux signature validation

```azurepowershell-interactive
# generate gpg key
gpg --gen-key

# export public key
gpg --output public.gpg --export <email-id-used-to-generate-gpg-key>

# export private key
gpg --output private.gpg --export-secret-key <email-id-used-to-generate-gpg-key>

# Sign linux policy package
Import-Module GuestConfiguration
$protectParams = @{
    Path              = './not_installed_application_linux.zip'
    PrivateGpgKeyPath = './private.gpg'
    PublicGpgKeyPath  = './public.gpg'
    Verbose           = $true
}
Protect-GuestConfigurationPackage
```

Parameters of the `Protect-GuestConfigurationPackage` cmdlet:

- **Path**: Full path of the machine configuration package.
- **Certificate**: Code signing certificate to sign the package. This parameter is only supported
  when signing content for Windows.

## Certificate requirements

The machine configuration agent expects the certificate public key to be present in "Trusted Publishers" on Windows machines and in the path `/usr/local/share/ca-certificates/gc`
on Linux machines. For the node to verify signed content, install the certificate public key on the
machine before applying the custom policy. This process can be done using any technique inside the
VM or by using Azure Policy. An example template is available
[to deploy a machine with a certificate][01]. The Key Vault access policy must allow the Compute
resource provider to access certificates during deployments. For detailed steps, see
[Set up Key Vault for virtual machines in Azure Resource Manager][02].

Following is an example to export the public key from a signing certificate, to import to the
machine.

```azurepowershell-interactive
$Cert = Get-ChildItem -Path cert:\LocalMachine\My |
    Where-Object { $_.Subject-eq "CN=mycert3" } |
    Select-Object -First 1
$Cert | Export-Certificate -FilePath "$env:temp\DscPublicKey.cer" -Force
```

## Tag requirements

After your content is published, append a tag with name `GuestConfigPolicyCertificateValidation`
and value `enabled` to all virtual machines where code signing should be required. See the
[Tag samples][03] for how tags can be delivered at scale using Azure Policy. Once this tag is in
place, the policy definition generated using the `New-GuestConfigurationPolicy` cmdlet enables the
requirement through the machine configuration extension.

## Next steps

- [Test the package artifact][04] from your development environment.
- [Publish the package artifact][05] so it's accessible to your machines.
- Use the `GuestConfiguration` module to [create an Azure Policy definition][06] for at-scale
  management of your environment.
- [Assign your custom policy definition][07] using Azure portal.
- Learn how to view [compliance details for machine configuration][08] policy assignments.

<!-- Reference link definitions -->
[01]: https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/vm-push-certificate-windows
[02]: ../../virtual-machines/windows/key-vault-setup.md#use-templates-to-set-up-key-vault
[03]: ../policy/samples/built-in-policies.md#tags
[04]: ./how-to-test-package.md
[05]: ./how-to-publish-package.md
[06]: ./how-to-create-policy-definition.md
[07]: ../policy/assign-policy-portal.md
[08]: ../policy/how-to/determine-non-compliance.md
