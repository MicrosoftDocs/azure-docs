---
title: Storing and using certificates in Azure Cloud Services (extended support)
description: Processes for storing and using certificates in Azure Cloud Services (extended support)
ms.topic: conceptual
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Storing and using certificates in Azure Cloud Services (extended support)

To install certificates on your cloud service roles, you used to add the certificates to your hosted service and then reference the certificate thumbprint in your cscfg. Now, you will add the certificated to Key Vault, then reference the certificate thumbprints in the cscfg and add reference to key vault under OS Profile section of Cloud Services Resource . You will also need to add your key vault reference in the OsProfile of the VMSS template. 

1.	Open the Azure Portal and browse to your key vault. If you do not have key vault set up, create a new one. 

2.	Ensure your Access policies include these properties: 

   :::image type="content" source="media/certs-and-key-vault-1.png" alt-text="Image shows selecting the swap option from the Azure portal.":::
 
3.	Click on Certificates in Key Vault and click on “Generate / Import”. Import your certificate that you exported in step 4. 
 
   :::image type="content" source="media/certs-and-key-vault-2.png" alt-text="Image shows selecting the swap option from the Azure portal.":::
4.	In your cscfg, add the certificate details to your role. Be sure the thumbprint of the cert in the Azure portal matches the thumbprint in your cscfg. 
<Certificate name="<your cert name>" thumbprint="<thumbprint in key vault" thumbprintAlgorithm="sha1" />

5.	In your template file, ensure you add the key vault reference with your details. 

   :::image type="content" source="media/certs-and-key-vault-3.png" alt-text="Image shows selecting the swap option from the Azure portal.":::
 
a.	vaultId is the ARM Resource ID to your Key Vault. You can find this information by looking in the properties section of the Key Vault. It is the Resource ID. 
i.	Key Vault  Properties  Resource ID

b.	vaultSecertUrl is stored in the certificate of your key vault. Browse to your certificate in the Azure portal and copy the Certificate Identifier for you vaultSecretURL.

   :::image type="content" source="media/certs-and-key-vault-4.png" alt-text="Image shows selecting the swap option from the Azure portal.":::

i.	Key Vault  Certificates  <Your Cert>  Certificate Identifier

 

## What's next

