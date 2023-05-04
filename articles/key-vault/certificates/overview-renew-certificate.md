---
title: About Azure Key Vault certificate renewal
description: This article discusses how to renew Azure Key Vault certificates.
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: certificates
ms.topic: overview
ms.date: 01/20/2023
ms.author: mbaldwin
---

# Renew your Azure Key Vault certificates

With Azure Key Vault, you can easily provision, manage, and deploy digital certificates for your network and enable secure communications for your applications. For more information about certificates, see [About Azure Key Vault certificates](./about-certificates.md).

By using short-lived certificates or by increasing the frequency of certificate rotation, you can help prevent access to your applications by unauthorized users.

This article discusses how to renew your Azure Key Vault certificates.

## Get notified about certificate expiration

To get notified about certificate life events, you would need to add certificate contact. Certificate contacts contain contact information to send notifications triggered by certificate lifetime events. The contacts information is shared by all the certificates in the key vault. A notification is sent to all the specified contacts for an event for any certificate in the key vault.

### Steps to set certificate notifications

First, add a certificate contact to your key vault. You can add using the Azure portal or the PowerShell cmdlet [Add-AzKeyVaultCertificateContact](/powershell/module/az.keyvault/add-azkeyvaultcertificatecontact).

Second, configure when you want to be notified about the certificate expiration. To configure the lifecycle attributes of the certificate, see [Configure certificate autorotation in Key Vault](./tutorial-rotate-certificates.md#update-lifecycle-attributes-of-a-stored-certificate).

If a certificate's policy is set to auto renewal, then a notification is sent on the following events:

- Before certificate renewal
- After certificate renewal, stating if the certificate was successfully renewed, or if there was an error, requiring manual renewal of the certificate.  

When a certificate policy is set to be manually renewed (email only), a notification is sent when it's time to renew the certificate.  

In Key Vault, there are three categories of certificates:
- Certificates that are created with an integrated certificate authority (CA), such as DigiCert or GlobalSign.
- Certificates that are created with a nonintegrated CA.
- Self-signed certificates.

## Renew an integrated CA certificate

Azure Key Vault handles the end-to-end maintenance of certificates that are issued by trusted Microsoft certificate authorities DigiCert and GlobalSign. Learn how to [integrate a trusted CA with Key Vault](./how-to-integrate-certificate-authority.md). When a certificate is renewed, a new secret version is created with a new Key Vault identifier.

## Renew a nonintegrated CA certificate

By using Azure Key Vault, you can import certificates from any CA, a benefit that lets you integrate with several Azure resources and make deployment easy. If you're worried about losing track of your certificate expiration dates or, worse, you've discovered that a certificate has already expired, your key vault can help keep you up to date. For nonintegrated CA certificates, the key vault lets you set up near-expiration email notifications. Such notifications can be set for multiple users as well.

> [!IMPORTANT]
> A certificate is a versioned object. If the current version is expiring, you need to create a new version. Conceptually, each new version is a new certificate that's composed of a key and a blob that ties that key to an identity. When you use a nonpartnered CA, the key vault generates a key/value pair and returns a certificate signing request (CSR).

To renew a nonintegrated CA certificate:

# [Azure portal](#tab/azure-portal)

1. Sign in to the Azure portal, and then open the certificate you want to renew.
1. On the certificate pane, select **New Version**.
3. On the **Create a certificate** page, make sure the **Generate** option is selected under **Method of Certificate Creation**.
4. Verify the **Subject** and other details about the certificate and then select **Create**.
5. You should now see the message **The creation of certificate << certificate name >> is currently pending. Click here to go its Certificate Operation to monitor the progress**
1. Select on the message and a new pane should be shown. The pane should show the status as "In Progress". At this point, Key Vault has generated a CSR that you can download using the **Download CSR** option.
1. Select **Download CSR** to download a CSR file to your local drive.
1. Send the CSR to your choice of CA to sign the request.
1. Bring back the signed request, and select **Merge Signed Request** on the same certificate operation pane.
10. The status after merging will show **Completed** and on the main certificate pane you can hit **Refresh** to see the new version of the certificate.

# [Azure CLI](#tab/azure-cli)

Use the Azure CLI [az keyvault certificate create](/cli/azure/keyvault/certificate#az-keyvault-certificate-create) command, providing the name of the certificate you wish to renew:

```azurecli-interactive
az keyvault certificate create --vault-name "<your-unique-keyvault-name>" -n "<name-of-certificate-to-renew>" -p "$(az keyvault certificate get-default-policy)"
```

After renewing the certificate, you can view all the versions of the certificate using the Azure CLI [az keyvault certificate list-versions](/cli/azure/keyvault/certificate#az-keyvault-certificate-list) command:

```azurecli-interactive
az keyvault certificate list-versions --vault-name "<your-unique-keyvault-name>" -n "<name-of-renewed-certificate>"
```

# [Azure PowerShell](#tab/azure-powershell)

Use the Azure PowerShell [New-AzKeyVaultCertificatePolicy](/powershell/module/az.keyvault/new-azkeyvaultcertificatepolicy) cmdlet, providing the name of the certificate you wish to renew:

```azurepowershell-interactive
$Policy = New-AzKeyVaultCertificatePolicy -SecretContentType "application/x-pkcs12" -SubjectName "CN=contoso.com" -IssuerName "Self" -ValidityInMonths 6 -ReuseKeyOnRenewal

Add-AzKeyVaultCertificate -VaultName "<your-unique-keyvault-name>" -Name "<name-of-certificate-to-renew>" -CertificatePolicy $Policy
```

After renewing the certificate, you can view all the versions of the certificate using the Azure PowerShell [Get-AzKeyVaultCertificate](/cli/azure/keyvault/certificate#az-keyvault-certificate-list) cmdlet:

```azurepowershell-interactive
Get-AzKeyVaultCertificate "<your-unique-keyvault-name>" -Name "<name-of-renewed-certificate>" -IncludeVersions
```

---

> [!NOTE]
> It's important to merge the signed CSR with the same CSR request that you created. Otherwise, the key won't match.

For more information about creating a new CSR, see [Create and merge a CSR in Key Vault](create-certificate-signing-request.md).

## Renew a self-signed certificate

Azure Key Vault also handles autorenewal of self-signed certificates. To learn more about changing the issuance policy and updating a certificate's lifecycle attributes, see [Configure certificate autorotation in Key Vault](./tutorial-rotate-certificates.md#update-lifecycle-attributes-of-a-stored-certificate).

## Next steps
- [Azure Key Vault certificate renewal frequently asked questions](faq.yml)
- [Integrate Key Vault with DigiCert certificate authority](how-to-integrate-certificate-authority.md)
- [Tutorial: Configure certificate autorotation in Key Vault](tutorial-rotate-certificates.md)
