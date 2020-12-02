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

# Store and use certificates in Azure Cloud Services (extended support)

To install certificates on Cloud Service roles, users need to add the certificates to an Azure Key Vault and reference the certificate thumbprints in the cscfg and osProfile.

## Upload a certificate to Key Vault 

1.	Sign in to the Azure portal and navigate to the desired Key Vault. If you do not have Key Vault set up, you can opt to create one in this same window.

2. Select **Access polices**

    :::image type="content" source="media/certs-and-key-vault-1.png" alt-text="Image shows selecting access policies from the key vault blade.":::

3. Ensure the access policies include the following properties:
    - **Enable access to Azure Virtual Machines for deployment**
    - **Enable access to Azure Resource Manager for template deployment** 

    :::image type="content" source="media/certs-and-key-vault-2.png" alt-text="Image shows access policies window in the Azure portal.":::
 
4.	Select **Certificates** 

    :::image type="content" source="media/certs-and-key-vault-3.png" alt-text="Image shows selecting the certificates option from the key vault blade policies window in the Azure portal.":::

5. Select **Generate / Import**

    :::image type="content" source="media/certs-and-key-vault-4.png" alt-text="Image shows selecting the generate/ importe option":::

4.	Add the certificate details associated with the role to the cscfg file.

    :::image type="content" source="media/certs-and-key-vault-5.png" alt-text="Image shows importing window in the Azure portal.":::

5.	Add the Key Vault reference to the template file.
    
    >[!NOTE]
    > Certificate Identifier should be in the following format: **https://<vaultEndpoint>/secrets/<secretName>/<secretVersion>**

    ```
    "osProfile": 
    
        { "secrets":  
            [  
                { "sourceVault": { 
                     "id": "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.KeyVault/vaults/{keyvault-name}"  
                },  
    "vaultCertificates": [ 
            { "certificateUrl": "https://{keyvault-name}.vault.azure.net:443/secrets/ContosoCertificate/{secret-id}"  
            } 
        ] 
    } 
    ```

    - `vaultId` is the Azure Resource Manager ID to your Key Vault. You can find this information by looking in the properties section of the Key Vault. 
    - `vaultSecertUrl` is stored in the certificate of your Key Vault. Browse to your certificate in the Azure portal and copy the **Certificate Identifier**.
 

## Next steps

[Enable Remote Desktop](enable-rdp.md) for your Cloud Service (extended support) roles.
