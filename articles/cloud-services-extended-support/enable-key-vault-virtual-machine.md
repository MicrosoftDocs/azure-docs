---
title: Apply the Key Vault VM extension in Azure Cloud Services (extended support) 
description: Learn about the Key Vault VM extension for Windows and how to enable it in Azure Cloud Services.
ms.topic: how-to
ms.service: cloud-services-extended-support
author: msmbaldwin
ms.author: mbaldwin
ms.reviewer: gachandw
ms.date: 05/12/2021
ms.custom: 
---

# Apply the Key Vault VM extension to Azure Cloud Services (extended support)

This article provides basic information about the Azure Key Vault VM extension for Windows and shows you how to enable it in Azure Cloud Services.

## What is the Key Vault VM extension?
The Key Vault VM extension provides automatic refresh of certificates stored in an Azure key vault. Specifically, the extension monitors a list of observed certificates stored in key vaults. When the extension detects a change, it retrieves and installs the corresponding certificates. For more information, see [Key Vault VM extension for Windows](../virtual-machines/extensions/key-vault-windows.md).

## What's new in the Key Vault VM extension?
The Key Vault VM extension is now supported on the Azure Cloud Services (extended support) platform to enable the management of certificates end to end. The extension can now pull certificates from a configured key vault at a predefined polling interval and install them for the service to use. 

## How can I use the Key Vault VM extension?
The following procedure will show you how to install the Key Vault VM extension on Azure Cloud Services by first creating a bootstrap certificate in your vault to get a token from Microsoft Entra ID. That token will help in the authentication of the extension with the vault. After the authentication process is set up and the extension is installed, all the latest certificates will be pulled down automatically at regular polling intervals. 

> [!NOTE]
> The Key Vault VM extension downloads all the certificates in the Windows certificate store to the location provided by the `certificateStoreLocation` property in the VM extension settings. Currently, the Key Vault VM extension grants access to the private key of the certificate only to the local system admin account. 


### Prerequisites 
To use the Azure Key Vault VM extension, you need to have a Microsoft Entra tenant. For more information, see [Quickstart: Set up a tenant](../active-directory/develop/quickstart-create-new-tenant.md).

### Enable the Azure Key Vault VM extension

1. [Generate a certificate](../key-vault/certificates/create-certificate-signing-request.md) in your vault and download the .cer file for that certificate.

2. In the [Azure portal](https://portal.azure.com), go to **App registrations**.
    
    :::image type="content" source="media/app-registration-0.jpg" alt-text="Screenshot of resources available in the Azure portal, including app registrations.":::
    

3. On the **App registrations** page, select **New registration**.
    
    :::image type="content" source="media/app-registration-1.png" alt-text="Screenshot that shows the page for app registrations in the Azure portal.":::

4. On the next page, fill out the form and complete the app creation.

5. Upload the .cer file of the certificate to the Microsoft Entra app portal.

   Optionally, you can use the [Azure Event Grid notification feature for Key Vault](https://azure.microsoft.com/updates/azure-key-vault-event-grid-integration-is-now-available/) to upload the certificate.  

6. Grant the Microsoft Entra app secret permissions in Key Vault:
   
    - If you're using a role-based access control (RBAC) preview, search for the name of the Microsoft Entra app that you created and assign it to the Key Vault Secrets User (preview) role.
    - If you're using vault access policies, assign **Secret-Get** permissions to the Microsoft Entra app that you created. For more information, see [Assign access policies](../key-vault/general/assign-access-policy-portal.md).

7. Install the Key Vault VM extension by using the Azure Resource Manager template snippet for the `cloudService` resource:

    ```json
    {
        "osProfile":
        {
            "secrets":
            [
                {
                    "sourceVault":
                    {
                        "id": "[parameters('sourceVaultValue')]"
                    },
                    "vaultCertificates":
                    [
                        {
                            "certificateUrl": "[parameters('bootstrpCertificateUrlValue')]"
                        }
                    ]
                }
            ]
        },
        "extensionProfile":
        {
            "extensions":
            [
                {
                    "name": "KVVMExtensionForPaaS",
                    "properties":
                    {
                        "type": "KeyVaultForPaaS",
                        "autoUpgradeMinorVersion": true,
                        "typeHandlerVersion": "1.0",
                        "publisher": "Microsoft.Azure.KeyVault",
                        "settings":
                        {
                            "secretsManagementSettings":
                            {
                                "pollingIntervalInS": "3600",
                                "certificateStoreName": "My",
                                "certificateStoreLocation": "LocalMachine",
                                "linkOnRenewal": false,
                                "requireInitialSync": false,
                                "observedCertificates": "[parameters('keyVaultObservedCertificates']"
                            },
                            "authenticationSettings":
                            {
                                "clientId": "Your AAD app ID",
                                "clientCertificateSubjectName": "Your boot strap certificate subject name [Do not include the 'CN=' in the subject name]"
                            }
                        }
                    }
                }
            ]
        }
    }
    ```
    You might need to specify the certificate store for the bootstrap certificate in *ServiceDefinition.csdef*:
    
    ```xml
        <Certificates>
                 <Certificate name="bootstrapcert" storeLocation="LocalMachine" storeName="My" />
        </Certificates> 
    ```

## Next steps
Further improve your deployment by [enabling monitoring in Azure Cloud Services (extended support)](enable-alerts.md).
