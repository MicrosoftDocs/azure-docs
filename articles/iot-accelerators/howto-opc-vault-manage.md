---
title: How to manage the OPC Vault certificate service - Azure | Microsoft Docs
description: Manage the OPC Vault root CA certificates and user permissions.
author: mregen
ms.author: mregen
ms.date: 8/16/2019
ms.topic: conceptual
ms.service: industrial-iot
services: iot-industrialiot
manager: philmea
---

# How to manage the OPC Vault certificate service

This article explains the administrative tasks for the OPC Vault certificate management service in Azure, how to renew Issuer CA certificates, how to renew the Certificate Revocation List (CRL) and how to grant and revoke user access.

## Create or renew the root CA certificate

To create the root CA certificate is a mandatory step after deployment. Without a valid Issuer CA certificate, no application certificates can be signed and issued.<br>Refer to the chapter about [Certificate Lifetimes](howto-opc-vault-secure-ca.md#certificates) to manage your certificates with reasonable, secure lifetimes. 
An Issuer CA certificate should be renewed after half of its lifetime, but no later than before the configured lifetime of a newly signed application certificate would exceed the lifetime of the Issuer certificate.<br>
> [!IMPORTANT]
> The 'Administrator' role is required to create or renew the Issuer CA certificate.

1. Open your certificate service at `https://myResourceGroup-app.azurewebsites.net` and sign in.
2. Navigate to the `Certificate Groups` page.
3. There is one `Default` Certificate Group listed. Click on `Edit`.
4. In `Edit Certificate Group Details` you can modify the Subject Name and Lifetime of your CA and application certificates.<br>The subject and the lifetimes should only be set once before the first CA certificate is issued. Lifetime changes during operations may result in inconsistent lifetimes of issued certificates and CRLs.
5. Enter a valid Subject, for example, `CN=My CA Root, O=MyCompany, OU=MyDepartment`.<br>
   > [!IMPORTANT]
   > Changing the subject requires to renew the Issuer certificate, or the service will fail to sign application certificates. The subject of the configuration is sanity checked against the subject of the active Issuer certificate. If the subjects do not match, certificate signing is refused.
6. Click on the `Save` button.
7. If you hit a 'forbidden' error at this point, your user credentials do not have the administrator permission to modify or create a new root certificate. By default, the user who deployed the service has administrator and signing roles with the service, other users need to be added to the 'Approver', 'Writer' or 'Administrator' roles as appropriate in the AzureAD application registration.
8. Click on the `Details` button. The `View Certificate Group Details` should display the updated information.
9. Click on the `Renew CA Certificate` button to issue the first Issuer CA certificate or to renew the Issuer certificate. Press `Ok` to proceed.
10. After a few seconds the `Certificate Details` are shown. Press `Issuer` or `Crl` to download the latest CA certificate and CRL for distribution to your OPC UA applications.
11. Now the OPC UA Certificate Management Service is ready to issue certificates for OPC UA applications.

## Renew the CRL

Renewal of the Certificate Revocation List (CRL) is an update, which should be distributed to the applications at regular intervals. OPC UA devices, which support the CRL Distribution Point X509 extension, can directly update the CRL from the microservice endpoint. Other OPC UA devices may require manual updates or in the best case, can be updated using GDS server push extensions (*) to update the trust lists with the certificates and CRLs.

In the following workflow all certificate requests in the deleted states are revoked in the CRLs, which correspond to the Issuer CA certificate they were issued for. The version number of the CRL is incremented by 1. <br>
> [!NOTE]
> All issued CRLs are valid until the expiration of the Issuer CA certificate, because the OPC UA specification does not require a mandatory, deterministic distribution model for CRL.

> [!IMPORTANT]
> The 'Administrator' role is required to renew the Issuer CRL.

1. Open your certificate service at `https://myResourceGroup.azurewebsites.net` and sign in.
2. Navigate to the `Certificate Groups` page.
3. Click on the `Details` button. The `View Certificate Group Details` should display the current certificate and CRL information.
4. Click on the `Update CRL Revocation List(CRL)` button to issue an updated CRL for all active Issuer certificates in the OPC Vault storage.
5. After a few seconds the `Certificate Details` are shown. Press `Issuer` or `Crl` to download the latest CA certificate and CRL for distribution to your OPC UA applications.

## Manage user roles

User roles for the OPC Vault microservice are managed in the Azure Active Directory Enterprise Application.

For a detailed description of the role definitions refer to the [Roles](howto-opc-vault-secure-ca.md#roles) section.

By default, an authenticated user in the tenant can sign in the service as a 'Reader'. Higher privileged roles require manual management in the Azure portal or using Powershell.

### Add user

1. Open the Azure portal at `portal.azure.com`.
2. Navigate to `Azure Active Directory`/`Enterprise applications`.
3. Choose the registration of the OPC Vault microservice, by default your `resourceGroupName-service`.
4. Navigate to `Users and Groups`.
5. Click on `Add User`.
6. Select or invite the user for assignment to a specific role.
7. Select the role for the users.
8. Press the `Assign` button.
9. For users in `Administrator` or `Approver` role, continue to add Azure Key Vault access policies.

### Remove user

1. Open the Azure portal at `portal.azure.com`.
2. Navigate to `Azure Active Directory`/`Enterprise applications`.
3. Choose the registration of the OPC Vault microservice, by default your `resourceGroupName-service`.
4. Navigate to `Users and Groups`.
5. Select a user with a role to remove.
6. Press the `Remove` button.
7. Remove removed Administrators and Approvers also from Azure Key Vault policies.

### Add user access policy to Azure Key Vault

Additional access policies are required for **Approvers** and **Administrators**.

By default, the service identity has only limited permissions to access Key Vault to prevent elevated operations or changes to take place without user impersonation. The basic service permissions are `Get` and `List` for both secrets and certificates. For secrets, there is only one exception, the service can `Delete` a private key from the secret store once accepted by a user. All other operations require user impersonated permissions.<br>

#### For an **Approver role** the following permissions must be added to Key Vault:

1. Open the Azure portal at `portal.azure.com`.
2. Navigate to your OPC Vault  `resourceGroupName`used during deployment.
3. Navigate to the Key Vault `resourceGroupName-xxxxx`.
4. Navigate to the `Access Policies`.
5. Click on `Add new`.
6. Skip the template, there is no template, which matches requirements.
7. Click on `Select Principal`  and select the user to be added or invite a new user to the tenant.
8. Check `Key permissions`: `Get`, `List` and most importantly `Sign`.
9. Check `Secret permissions`: `Get`, `List`, `Set` and `Delete`.
10. Check `Certificate permissions`: `Get`and `List`.
11. Click `Ok`.
12. `Save`changes.

#### For an **Administrator role** the following permissions must be added to Key Vault:

1. Open the Azure portal at `portal.azure.com`.
2. Navigate to your OPC Vault  `resourceGroupName`used during deployment.
3. Navigate to the Key Vault `resourceGroupName-xxxxx`.
4. Navigate to the `Access Policies`.
5. Click on `Add new`.
6. Skip the template, there is no template, which matches requirements.
7. Click on `Select Principal`  and select the user to be added or invite a new user to the tenant.
8. Check `Key permissions`: `Get`, `List` and most importantly `Sign`.
9. Check `Secret permissions`: `Get`, `List`, `Set` and `Delete`.
10. Check `Certificate permissions`: `Get`, `List`, `Update`, `Create` and`Import`.
11. Click `Ok`.
12. `Save`changes.

### Remove user access policy from Azure Key Vault

1. Open the Azure portal at `portal.azure.com`.
2. Navigate to your OPC Vault  `resourceGroupName`used during deployment.
3. Navigate to the Key Vault `resourceGroupName-xxxxx`.
4. Navigate to the `Access Policies`.
5. Find the user to remove and click on `... / Delete` to delete user access.

## Next steps

Now that you have learned how to manage OPC Vault certificates and users, here is the suggested next step:

> [!div class="nextstepaction"]
> [Secure communication of OPC devices](howto-opc-vault-secure.md)
