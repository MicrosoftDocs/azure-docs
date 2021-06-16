---
title: Apply the Key Vault VM Extension in Azure Cloud Services (extended support) 
description: Enable KeyVault VM Extension for Cloud Services (extended support)
ms.topic: how-to
ms.service: cloud-services-extended-support
author: shisriva
ms.author: shisriva
ms.reviewer: gachandw
ms.date: 05/12/2021
ms.custom: 
---

# Apply the Key Vault VM extension to Azure Cloud Services (extended support)

## What is the Key Vault VM Extension?
The Key Vault VM extension provides automatic refresh of certificates stored in an Azure Key Vault. Specifically, the extension monitors a list of observed certificates stored in key vaults, and upon detecting a change, retrieves, and installs the corresponding certificates. For more details, see [Key Vault VM extension for Windows](../virtual-machines/extensions/key-vault-windows.md).

## What's new in the Key Vault VM Extension?
The Key Vault VM extension is now supported on the Azure Cloud Services (extended support) platform to enable the management of certificates end to end. The extension can now pull certificates from a configured Key Vault at a pre-defined polling interval and install them for use by the service. 

## How can I leverage the Key Vault VM extension?
The following tutorial will show you how to install the Key Vault VM extension on PaaSV1 services by first creating a bootstrap certificate in your vault to get a token from AAD that will help in the authentication of the extension with the vault. Once the authentication process is set up and the extension is installed all latest certificates will be pulled down automatically at regular polling intervals. 


## Prerequisites 
To use the Azure Key Vault VM extension, you need to have an Azure Active Directory tenant. For more information on setting up a new Active Directory tenant, see [Setup your AAD tenant](../active-directory/develop/quickstart-create-new-tenant.md)

## Enable the Azure Key Vault VM extension

1. [Generate a certificate](../key-vault/certificates/create-certificate-signing-request.md) in your vault and download the .cer for that certificate.

2. In the [Azure portal](https://portal.azure.com) navigate to **App Registrations**.
    
    :::image type="content" source="media/app-registration-0.jpg" alt-text="Shows selecting app registration in the portal.":::
    

3. In the App Registrations page select **New Registration** on the top left corner of the page
    
    :::image type="content" source="media/app-registration-1.png" alt-text="Shows the app registration sin the Azure portal.":::

4. On the next page you can fill the form and complete the app creation.

5. Upload the .cer of the certificate to the Azure Active Directory app portal.

    - Optionally you can also leverage the [Key Vault Event Grid notification feature](https://azure.microsoft.com/updates/azure-key-vault-event-grid-integration-is-now-available/) to upload the certificate.  

6. Grant the Azure Active Directory app secret list/get permissions in Key Vault:
    - If you are using RBAC preview, search for the name of the AAD app you created and assign it to the Key Vault Secrets User (preview) role.
    - If you are using vault access policies, then assign **Secret-Get** permissions to the AAD app you created. For more information, see [Assign access policies](../key-vault/general/assign-access-policy-portal.md)

7. Install first version of the certificates created in the first step and the Key Vault VM extension using the ARM template as shown below:

    ```json
        {
       "osProfile":{
          "secrets":[
             {
                "sourceVault":{
                   "id":"[parameters('sourceVaultValue')]"
                },
                "vaultCertificates":[
                   {
                      "certificateUrl":"[parameters('bootstrpCertificateUrlValue')]"
                   }
                ]
             }
          ]
       }{
          "name":"KVVMExtensionForPaaS",
          "properties":{
             "type":"KeyVaultForPaaS",
             "autoUpgradeMinorVersion":true,
             "typeHandlerVersion":"1.0",
             "publisher":"Microsoft.Azure.KeyVault",
             "settings":{
                "secretsManagementSettings":{
                   "pollingIntervalInS":"3600",
                   "certificateStoreName":"My",
                   "certificateStoreLocation":"LocalMachine",
                   "linkOnRenewal":false,
                   "requireInitialSync":false, 
                   "observedCertificates":"[parameters('keyVaultObservedCertificates']"
                },
                "authenticationSettings":{
                   "clientId":"Your AAD app ID",
                   "clientCertificateSubjectName":"Your boot strap certificate subject name [Do not include the 'CN=' in the subject name]"
                }
             }
          }
       }
    ```
    You might need to specify the certificate store for boot strap certificate in ServiceDefinition.csdef like below:
    
    ```xml
        <Certificates>
                 <Certificate name="bootstrapcert" storeLocation="LocalMachine" storeName="My" />
        </Certificates> 
    ```

## Next steps
Further improve your deployment by [enabling monitoring in Cloud Services (extended support)](enable-alerts.md)