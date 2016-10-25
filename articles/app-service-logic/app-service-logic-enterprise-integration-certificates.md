
<properties
	pageTitle="Using certificates with Enterprise Integration Pack | Microsoft Azure"
	description="Learn how to use certificates with the Enterprise Integration Pack and Logic Apps"
	services="logic-apps"
	documentationCenter=".net,nodejs,java"
	authors="msftman"
	manager="erikre"
	editor="cgronlun"/>

<tags
	ms.service="logic-apps"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/06/2016"
	ms.author="deonhe"/>

# Learn about certificates and Enterprise Integration Pack

## Overview
Enterprise integration uses certificates to secure B2B communications. You can use two types of certificates in your enterprise integration apps:

- Public certificates, which must be purchased from a certification authority (CA).
- Private certificates, which you can issue yourself. These certificates are sometimes referred to as self-signed certificates.


## What are certificates?
Certificates are digital documents that verify the identity of the participants in electronic communications and that also secure electronic communications.

## Why use certificates?
Sometimes B2B communications must be kept confidential. Enterprise integration uses certificates to secure these communications in two ways:

- By encrypting the contents of messages
- By digitally signing messages  

## How do you upload certificates?

### Public certificates
To use a *public certificate* in your logic apps with B2B capabilities, you first need to upload the certificate into your integration account. To use a *self-signed certificate*, on the other hand, you must first upload it to [Azure Key Vault](../key-vault/key-vault-get-started.md "Learn about Key Vault").

After you upload a certificate, it's available to help you secure your B2B messages when you define their properties in the [agreements](./app-service-logic-enterprise-integration-agreements.md) that you create.  

Here are the detailed steps for uploading your public certificates into your integration account after you sign in to the Azure portal:

1. Select **Browse**.  
	![Select Browse](./media/app-service-logic-enterprise-integration-overview/overview-1.png)  

2. Enter **integration** in the filter search box, and then select **Integration Accounts** from the results list.     
	![Select Integration Accounts](./media/app-service-logic-enterprise-integration-overview/overview-2.png)

3. Select the integration account to which you want to add the certificate.  
	![Select the integration account to which you want to add the certificate](./media/app-service-logic-enterprise-integration-overview/overview-3.png)  

4.  Select the **Certificates** tile.  
	![Select the Certificates tile](./media/app-service-logic-enterprise-integration-certificates/certificate-1.png)

5. In the **Certificates** blade that opens, select the **Add** button.
	![Select the Add button](./media/app-service-logic-enterprise-integration-certificates/certificate-2.png)

6. Enter a **Name** for your certificate, and then select the certificate type. (In this example, we used the public certificate type.) Then select the folder icon on the right side of the **Certificate** text box.

7. When the file picker opens, find and select the certificate file that you want to upload to your integration account.

8. Select the certificate, and then select **OK** in the file picker. This validates and uploads the certificate to your integration account.

8. Finally, back on the **Add certificate** blade, select the **OK** button.  
	![Select the OK button](./media/app-service-logic-enterprise-integration-certificates/certificate-3.png)  

9. In about a minute, you will see a notification that indicates that the certificate upload is complete.

10. Select the **Certificates** tile. You should see the newly added certificate.  
	![See the new certificate](./media/app-service-logic-enterprise-integration-certificates/certificate-4.png)  

### Private certificates
You can upload private certificates into your integration account by taking the following steps:  

1. [Upload your private key to Key Vault](../key-vault/key-vault-get-started.md "Learn about Key Vault").  

	> [AZURE.TIP] You must authorize the Logic Apps feature of Azure App Service to perform operations on Key Vault. You can grant access to the Logic Apps service principal by using the following PowerShell command: `Set-AzureRmKeyVaultAccessPolicy -VaultName 'TestcertKeyVault' -ServicePrincipalName '7cd684f4-8a78-49b0-91ec-6a35d38739ba' -PermissionsToKeys decrypt, sign, get, list`  

2. Create a private certificate.  

3. Upload the private certificate to your integration account.

After you've taken the previous steps, you can use the private certificate to create agreements.

Following are the detailed steps for uploading your private certificates into your integration account after you sign in to the Azure portal:  

1. Select **Browse**.  
	![Upload your private certificates into your integration account](./media/app-service-logic-enterprise-integration-overview/overview-1.png)    

2. Enter **integration** in the filter search box, and then select **Integration Accounts** from the results list.     
	![Select Integration Accounts](./media/app-service-logic-enterprise-integration-overview/overview-2.png)  

3. Select the integration account to which you want to add the certificate.  
	![Select the integration account to which you want to add the certificate](./media/app-service-logic-enterprise-integration-overview/overview-3.png)  

4. Select the **Certificates** tile.  
	![Select the Certificates tile](./media/app-service-logic-enterprise-integration-certificates/certificate-1.png)  

5. In the **Certificates** blade that opens, select the **Add** button.
	![Select the Add button](./media/app-service-logic-enterprise-integration-certificates/certificate-2.png)

6. Enter a **Name** for your certificate, and then select the certificate type. (In this example, we used the public certificate type.) Then select the folder icon on the right side of the **Certificate** text box.

7. When the file picker opens, find and select the certificate file that you want to upload to your integration account.

8. After you've selected the certificate, select **OK** in the file picker. This action validates the certificate and uploads it to your integration account.

9. Finally, back on the **Add certificate** blade, select the **OK** button.  
	![Add certificate](./media/app-service-logic-enterprise-integration-certificates/privatecertificate-1.png)  

10. In about a minute, you will see a notification that indicates that the certificate upload is complete.

11. Select the **Certificates** tile. You should see the newly added certificate.
	![See the new certificate](./media/app-service-logic-enterprise-integration-certificates/privatecertificate-2.png)  

After you upload a certificate, it's available to help you secure your B2B messages when you define their properties in [agreements](./app-service-logic-enterprise-integration-agreements.md).  

## Next steps
- [Create a logic app that uses B2B features](./app-service-logic-enterprise-integration-b2b.md)  
- [Create a B2B agreement](./app-service-logic-enterprise-integration-agreements.md)  
- [Learn more about Key Vault](../key-vault/key-vault-get-started.md "Learn about Key Vault")  
