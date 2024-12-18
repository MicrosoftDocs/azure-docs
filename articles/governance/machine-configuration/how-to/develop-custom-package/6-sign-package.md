---
title: How to sign machine configuration packages
description: You can optionally sign machine configuration content packages and force the agent to only allow signed content
ms.date: 02/01/2024
ms.topic: how-to
ms.custom: linux-related-content
---

# How to sign machine configuration packages

Machine configuration custom policies use a SHA256 hash to validate that the policy package hasn't
changed. Optionally, customers may also use a certificate to sign packages and force the machine
configuration extension to only allow signed content.

To enable this scenario, there are two steps you need to complete:

1. Run the cmdlet to sign the content package.
1. Append a tag to the machines that should require code to be signed.

## Signature validation using a code signing certificate

To use the Signature Validation feature, run the `Protect-GuestConfigurationPackage` cmdlet to sign
the package before it's published. This cmdlet requires a 'Code Signing' certificate. If you don't
have a 'Code Signing' certificate, use the following script to create a self-signed certificate for
testing purposes to follow along with the example.

## Windows signature validation

```powershell
# How to create a self sign cert and use it to sign Machine Configuration
# custom policy package

# Create Code signing cert
$codeSigningParams = @{
    Type          = 'CodeSigningCert'
    DnsName       = 'GCEncryptionCertificate'
    HashAlgorithm = 'SHA256'
}
$certificate = New-SelfSignedCertificate @codeSigningParams

# Export the certificates
$privateKey = @{
    Cert     = $certificate
    Password = Read-Host "Enter password for private key" -AsSecureString
    FilePath = '<full-path-to-export-private-key-pfx-file>'
}
$publicKey = @{
    Cert     = $certificate
    FilePath = '<full-path-to-export-public-key-cer-file>'
    Force    = $true
}
Export-PfxCertificate @privateKey
Export-Certificate    @publicKey

# Import the certificate
$importParams = @{
    FilePath          = $privateKey.FilePath
    Password          = $privateKey.Password
    CertStoreLocation = 'Cert:\LocalMachine\My'
}
Import-PfxCertificate @importParams

# Sign the policy package
$certToSignThePackage = Get-ChildItem -Path Cert:\LocalMachine\My |
    Where-Object { $_.Subject -eq "CN=GCEncryptionCertificate" }
$protectParams = @{
    Path        = '<path-to-package-to-sign>'
    Certificate = $certToSignThePackage
    Verbose     = $true
}
Protect-GuestConfigurationPackage @protectParams
```

## Linux signature validation

```powershell
# generate gpg key
gpg --gen-key

$emailAddress      = '<email-id-used-to-generate-gpg-key>'
$publicGpgKeyPath  = '<full-path-to-export-public-key-gpg-file>'
$privateGpgKeyPath = '<full-path-to-export-private-key-gpg-file>'

# export public key
gpg --output $publicGpgKeyPath --export $emailAddress

# export private key
gpg --output $privateGpgKeyPath --export-secret-key $emailAddress

# Sign linux policy package
Import-Module GuestConfiguration
$protectParams = @{
    Path              = '<path-to-package-to-sign>'
    PrivateGpgKeyPath = $privateGpgKeyPath
    PublicGpgKeyPath  = $publicGpgKeyPath
    Verbose           = $true
}
Protect-GuestConfigurationPackage
```

Parameters of the `Protect-GuestConfigurationPackage` cmdlet:

- **Path**: Full path to the machine configuration package.
- **Certificate**: Code signing certificate to sign the package. This parameter is only supported
  when signing content for Windows.
- **PrivateGpgKeyPath**: Full path to the private key `.gpg` file. This parameter is only supported
  when signing content for Linux.
- **PublicGpgKeyPath**: Full path to the public key `.gpg` file. This parameter is only supported
  when signing content for Linux.


## Certificate requirements

The machine configuration agent expects the certificate public key to be present in "Trusted
Publishers" on Windows machines and in the path `/usr/local/share/ca-certificates/gc` on Linux
machines. For the node to verify signed content, install the certificate public key on the machine
before applying the custom policy.

You can install the certificate public key using normal tools inside the VM or by using Azure
Policy. An [example template using Azure Policy][01] shows how you can deploy a machine with a
certificate. The Key Vault access policy must allow the Compute resource provider to access
certificates during deployments. For detailed steps, see
[Set up Key Vault for virtual machines in Azure Resource Manager][02].

Following is an example to export the public key from a signing certificate, to import to the
machine.

```azurepowershell-interactive
$Cert = Get-ChildItem -Path Cert:\LocalMachine\My |
    Where-Object { $_.Subject-eq 'CN=<CN-of-your-signing-certificate>' } |
    Select-Object -First 1

$Cert | Export-Certificate -FilePath '<path-to-export-public-key-cer-file>' -Force
```

## Tag requirements

After your content is published, append a tag with name `GuestConfigPolicyCertificateValidation`
and value `enabled` to all virtual machines where code signing should be required. See the
[Tag samples][03] for how tags can be delivered at scale using Azure Policy. Once this tag is in
place, the policy definition generated using the `New-GuestConfigurationPolicy` cmdlet enables the
requirement through the machine configuration extension.

## Related content

- Use the `GuestConfiguration` module to [create an Azure Policy definition][04] for at-scale
  management of your environment.
- [Assign your custom policy definition][05] using Azure portal.
- Learn how to view [compliance details for machine configuration][06] policy assignments.

<!-- Reference link definitions -->
[01]: https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/vm-push-certificate-windows
[02]: /azure/virtual-machines/windows/key-vault-setup#use-templates-to-set-up-key-vault
[03]: ../../../policy/samples/built-in-policies.md#tags
[04]: ../create-policy-definition.md
[05]: ../../../policy/assign-policy-portal.md
[06]: ../../../policy/how-to/determine-non-compliance.md
