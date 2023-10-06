---
title: Store and use certificates in Azure Cloud Services (extended support)
description: Processes for storing and using certificates in Azure Cloud Services (extended support)
ms.topic: how-to
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Use certificates with Azure Cloud Services (extended support)

Key Vault is used to store certificates that are associated to Cloud Services (extended support). Key Vaults can be created through the [Azure portal](../key-vault/general/quick-create-portal.md) and [PowerShell](../key-vault/general/quick-create-powershell.md). Add the certificates to Key Vault, then reference the certificate thumbprints in Service Configuration file. You also need to enable Key Vault for appropriate permissions so that Cloud Services (extended support) resource can retrieve certificate stored as secrets from Key Vault.

## Upload a certificate to Key Vault 

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to the Key Vault. If you do not have a Key Vault set up, you can opt to create one in this same window.

2. Select **Access Configuration**

    :::image type="content" source="media/certs-and-key-vault-1.png" alt-text="Image shows selecting access policies from the key vault blade.":::

3. Ensure the access configuration include the following property:
    - **Enable access to Azure Virtual Machines for deployment**

    :::image type="content" source="media/certs-and-key-vault-2.png" alt-text="Image shows access policies window in the Azure portal.":::
 
4.	Select **Certificates** 

    :::image type="content" source="media/certs-and-key-vault-3.png" alt-text="Image shows selecting the certificates option from the key vault blade policies window in the Azure portal.":::

5. Select **Generate / Import**

    :::image type="content" source="media/certs-and-key-vault-4.png" alt-text="Image shows selecting the generate/ import option":::

4.	Complete the required information to finish uploading the certificate. The certificate needs to be in **.PFX** format.

    :::image type="content" source="media/certs-and-key-vault-5.png" alt-text="Image shows importing window in the Azure portal.":::

5.	Add the certificate details to your role in the Service Configuration (.cscfg) file. Ensure the thumbprint of the certificate in the Azure portal matches the thumbprint in the Service Configuration (.cscfg) file. 
    
    ```json
    <Certificate name="<your cert name>" thumbprint="<thumbprint in key vault" thumbprintAlgorithm="sha1" /> 
    ```
6.  For deployment via ARM Template, certificateUrl can be found by navigating to the certificate in the key vault labeled as Secret Identifier

    :::image type="content" source="media/certs-and-key-vault-6.png" alt-text="Image shows the secret identifier field in the key vault.":::

## Next steps 
- Review the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support).
- Review [frequently asked questions](faq.yml) for Cloud Services (extended support).
- Deploy a Cloud Service (extended support) using the [Azure portal](deploy-portal.md), [PowerShell](deploy-powershell.md), [Template](deploy-template.md) or [Visual Studio](deploy-visual-studio.md).
