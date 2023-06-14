---
title: Integrating Key Vault with DigiCert certificate authority
description: This article describes how to integrate Key Vault with DigiCert certificate authority so you can provision, manage, and deploy certificates for your network.
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: certificates
ms.topic: how-to
ms.date: 01/24/2022
ms.author: mbaldwin 
ms.custom: devx-track-azurepowershell
---

# Integrating Key Vault with Integrated Certificate Authorities

Azure Key Vault allows you to easily provision, manage, and deploy digital certificates for your network and to enable secure communications for applications. A digital certificate is an electronic credential that establishes proof of identity in an electronic transaction. 

Azure Key Vault has a trusted partnership with the following Certificate Authorities:
- [DigiCert](https://www.digicert.com/)
- [GlobalSign](https://www.globalsign.com/en)

Azure Key Vault users can generate DigiCert/GlobalSign certificates directly from their key vaults. Key Vault's partnership ensures end-to-end certificate lifecycle management for certificates issued by DigiCert.

For more general information about certificates, see [Azure Key Vault certificates](./about-certificates.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you start.

## Prerequisites

To complete the procedures in this article, you need to have:
* A key vault. You can use an existing key vault or create one by completing the steps in one of these quickstarts:
   - [Create a key vault by using the Azure CLI](../general/quick-create-cli.md)
   - [Create a key vault by using Azure PowerShell](../general/quick-create-powershell.md)
   - [Create a key vault by using the Azure portal](../general/quick-create-portal.md)
*	An activated DigiCert CertCentral account. [Sign up](https://www.digicert.com/account/signup/) for your CertCentral account.
*	Administrator-level permissions in your accounts.


### Before you begin

#### DigiCert

Make sure you have the following information from your DigiCert CertCentral account:
-	CertCentral account ID
-	Organization ID
-	API key
-   Account ID
-   Account Password

#### GlobalSign

Make sure you have the following information from your Global Sign account:

- Account ID
- Account Password
- First Name of Administrator
- Last Name of Administrator
- E-mail of Administrator
- Phone Number of Administrator

## Add the certificate authority in Key Vault 
After you gather the preceding information from your DigiCert CertCentral account, you can add DigiCert to the certificate authority list in the key vault.

### Azure portal (DigiCert)

1.	To add DigiCert certificate authority, go to the key vault you want to add it to. 
2.	On the Key Vault property page, select **Certificates**.
3.	Select the **Certificate Authorities** tab:
:::image type="content" source="../media/certificates/how-to-integrate-certificate-authority/select-certificate-authorities.png" alt-text="Screenshot that shows selecting the Certificate Authorities tab.":::
4.	Select **Add**:
:::image type="content" source="../media/certificates/how-to-integrate-certificate-authority/add-certificate-authority.png" alt-text="Screenshot that shows the Add button on the Certificate Authorities tab.":::
5.	Under **Create a certificate authority**, enter these values:
    - 	**Name**: An identifiable issuer name. For example, **DigiCertCA**.
    - 	**Provider**: **DigiCert**.
    - 	**Account ID**: Your DigiCert CertCentral account ID.
    - 	**Account Password**: The API key you generated in your DigiCert CertCentral account.
    - 	**Organization ID**: The organization ID from your DigiCert CertCentral account. 

1. Select **Create**.
   
DigicertCA is now in the certificate authority list.

### Azure portal (GlobalSign)

1.	To add GlobalSign certificate authority, go to the key vault you want to add it to. 
2.	On the Key Vault property page, select **Certificates**.
3.	Select the **Certificate Authorities** tab:
:::image type="content" source="../media/certificates/how-to-integrate-certificate-authority/select-certificate-authorities.png" alt-text="Screenshot that shows selecting the Certificate Authorities tab.":::
4.	Select **Add**:
:::image type="content" source="../media/certificates/how-to-integrate-certificate-authority/add-global-sign-certificate-authority.jpg" alt-text="Screenshot that shows the Add button on the Global Sign Certificate Authorities tab.":::
5.	Under **Create a certificate authority**, enter these values:
    - 	**Name**: An identifiable issuer name. For example, **GlobalSignCA**.
    - 	**Provider**: **GlobalSign**.
    - 	**Account ID**: Your GlobalSign account ID.
    -   **Account Password**: Your GlobalSign account password.
    -   **First Name of Administrator**: The first name of administrator of the Global Sign account.
    -   **Last Name of Administrator**: The last name of administrator of the Global Sign account.
    -   **E-mail of Administrator**: The email of administrator of the Global Sign account.
    -   **Phone number of Administrator**: The phone number of administrator of the Global Sign account.

1. Select **Create**.
   
GlobalSignCA is now in the certificate authority list.


### Azure PowerShell

You can use Azure PowerShell to create and manage Azure resources by using commands or scripts. Azure hosts Azure Cloud Shell, an interactive shell environment that you can use through the Azure portal in a browser.

If you choose to install and use PowerShell locally, you need Azure AZ PowerShell module 1.0.0 or later to complete the procedures here. Type `$PSVersionTable.PSVersion` to determine the version. If you need to upgrade, see [Install Azure AZ PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure:

```azurepowershell-interactive
Connect-AzAccount
```

1.  Create an Azure resource group by using [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed. 

    ```azurepowershell-interactive
    New-AzResourceGroup -Name ContosoResourceGroup -Location EastUS
    ```

2. Create a key vault that has a unique name. Here, `Contoso-Vaultname` is the name for the key vault.

   - **Vault name**: `Contoso-Vaultname`
   - **Resource group name**: `ContosoResourceGroup`
   - **Location**: `EastUS`

    ```azurepowershell-interactive
    New-AzKeyVault -Name 'Contoso-Vaultname' -ResourceGroupName 'ContosoResourceGroup' -Location 'EastUS'
   ```

3. Define variables for the following values from your DigiCert CertCentral account:

   - **Account ID** 
   - **Organization ID** 
   - **API Key** 

   ```azurepowershell-interactive
   $accountId = "myDigiCertCertCentralAccountID"
   $org = New-AzKeyVaultCertificateOrganizationDetail -Id OrganizationIDfromDigiCertAccount
   $secureApiKey = ConvertTo-SecureString DigiCertCertCentralAPIKey -AsPlainText –Force
   ```

4. Set the issuer. Doing so will add Digicert as a certificate authority in the key vault. [Learn more about the parameters.](/powershell/module/az.keyvault/Set-AzKeyVaultCertificateIssuer)
   ```azurepowershell-interactive
   Set-AzKeyVaultCertificateIssuer -VaultName "Contoso-Vaultname" -Name "TestIssuer01" -IssuerProvider DigiCert -AccountId $accountId -ApiKey $secureApiKey -OrganizationDetails $org -PassThru
   ```

5. Set the policy for the certificate and issuing certificate from DigiCert directly in Key Vault:

   ```azurepowershell-interactive
   $Policy = New-AzKeyVaultCertificatePolicy -SecretContentType "application/x-pkcs12" -SubjectName "CN=contoso.com" -IssuerName "TestIssuer01" -ValidityInMonths 12 -RenewAtNumberOfDaysBeforeExpiry 60
   Add-AzKeyVaultCertificate -VaultName "Contoso-Vaultname" -Name "ExampleCertificate" -CertificatePolicy $Policy
   ```

The certificate is now issued by DigiCert certificate authority in the specified key vault.

## Troubleshoot

If the certificate issued is in disabled status in the Azure portal, view the certificate operation to review the DigiCert error message for the certificate:

:::image type="content" source="../media/certificates/how-to-integrate-certificate-authority/certificate-operation-select.png" alt-text="Screenshot that shows the Certificate Operation tab.":::

Error message: "Please perform a merge to complete this certificate request."
   
Merge the CSR signed by the certificate authority to complete the request. For information about merging a CSR, see [Create and merge a CSR](./create-certificate-signing-request.md).

For more information, see [Certificate operations in the Key Vault REST API reference](/rest/api/keyvault). For information on establishing permissions, see [Vaults - Create or update](/rest/api/keyvault/keyvault/vaults/create-or-update) and [Vaults - Update access policy](/rest/api/keyvault/keyvault/vaults/update-access-policy).

## Next steps
- [Frequently asked questions: Integrate Key Vault with Integrated Certificate Authorities](faq.yml)
- [Authentication, requests, and responses](../general/authentication-requests-and-responses.md)
- [Key Vault Developer's Guide](../general/developers-guide.md)
