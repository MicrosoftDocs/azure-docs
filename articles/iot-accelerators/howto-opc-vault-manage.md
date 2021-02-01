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

# Manage the OPC Vault certificate service

> [!IMPORTANT]
> While we update this article, see [Azure Industrial IoT](https://azure.github.io/Industrial-IoT/) for the most up to date content.

This article explains the administrative tasks for the OPC Vault certificate management service in Azure. It includes information about how to renew Issuer CA certificates, how to renew the Certificate Revocation List (CRL), and how to grant and revoke user access.

## Create or renew the root CA certificate

After deploying OPC Vault, you must create the root CA certificate. Without a valid Issuer CA certificate, you can't sign or issue application certificates. Refer to [Certificates](howto-opc-vault-secure-ca.md#certificates) to manage your certificates with reasonable, secure lifetimes. Renew an Issuer CA certificate after half of its lifetime. When renewing, also consider that the configured lifetime of a newly-signed application certificate shouldn't exceed the lifetime of the Issuer CA certificate.
> [!IMPORTANT]
> The Administrator role is required to create or renew the Issuer CA certificate.

1. Open your certificate service at `https://myResourceGroup-app.azurewebsites.net`, and sign in.
2. Go to **Certificate Groups**.
3. There is one default certificate group listed. Select **Edit**.
4. In **Edit Certificate Group Details**, you can modify the subject name and lifetime of your CA and application certificates. The subject and the lifetimes should only be set once before the first CA certificate is issued. Lifetime changes during operations might result in inconsistent lifetimes of issued certificates and CRLs.
5. Enter a valid subject (for example, `CN=My CA Root, O=MyCompany, OU=MyDepartment`).<br>
   > [!IMPORTANT]
   > If you change the subject, you must renew the Issuer certificate, or the service will fail to sign application certificates. The subject of the configuration is checked against the subject of the active Issuer certificate. If the subjects don't match, certificate signing is refused.
6. Select **Save**.
7. If you encounter a "forbidden" error at this point, your user credentials don't have the administrator permission to modify or create a new root certificate. By default, the user who deployed the service has administrator and signing roles with the service. Other users need to be added to the Approver, Writer or Administrator roles, as appropriate in the Azure Active Directory (Azure AD) application registration.
8. Select **Details**. This should show the updated information.
9. Select **Renew CA Certificate** to issue the first Issuer CA certificate, or to renew the Issuer certificate. Then select **OK**.
10. After a few seconds, you'll see **Certificate Details**. To download the latest CA certificate and CRL for distribution to your OPC UA applications, select **Issuer** or **Crl**.

Now the OPC UA certificate management service is ready to issue certificates for OPC UA applications.

## Renew the CRL

Renewal of the CRL is an update, which should be distributed to the applications at regular intervals. OPC UA devices, which support the CRL Distribution Point X509 extension, can directly update the CRL from the microservice endpoint. Other OPC UA devices might require manual updates, or can be updated by using GDS server push extensions (*) to update the trust lists with the certificates and CRLs.

In the following workflow, all certificate requests in the deleted states are revoked in the CRLs, which correspond to the Issuer CA certificate for which they were issued. The version number of the CRL is incremented by 1. <br>
> [!NOTE]
> All issued CRLs are valid until the expiration of the Issuer CA certificate. This is because the OPC UA specification doesn't require a mandatory, deterministic distribution model for CRL.

> [!IMPORTANT]
> The Administrator role is required to renew the Issuer CRL.

1. Open your certificate service at `https://myResourceGroup.azurewebsites.net`, and sign in.
2. Go to the **Certificate Groups** page.
3. Select **Details**. This should show the current certificate and CRL information.
4. Select **Update CRL Revocation List (CRL)** to issue an updated CRL for all active Issuer certificates in the OPC Vault storage.
5. After a few seconds, you'll see **Certificate Details**. To download the latest CA certificate and CRL for distribution to your OPC UA applications, select **Issuer** or **Crl**.

## Manage user roles

You manage user roles for the OPC Vault microservice in the Azure AD Enterprise Application. For a detailed description of the role definitions, see [Roles](howto-opc-vault-secure-ca.md#roles).

By default, an authenticated user in the tenant can sign in the service as a Reader. Higher privileged roles require manual management in the Azure portal, or by using PowerShell.

### Add user

1. Open the Azure portal.
2. Go to **Azure Active Directory** > **Enterprise applications**.
3. Choose the registration of the OPC Vault microservice (by default, your `resourceGroupName-service`).
4. Go to **Users and Groups**.
5. Select **Add User**.
6. Select or invite the user for assignment to a specific role.
7. Select the role for the users.
8. Select **Assign**.
9. For users in the Administrator or Approver role, continue to add Azure Key Vault access policies.

### Remove user

1. Open the Azure portal.
2. Go to **Azure Active Directory** > **Enterprise applications**.
3. Choose the registration of the OPC Vault microservice (by default, your `resourceGroupName-service`).
4. Go to **Users and Groups**.
5. Select a user with a role to remove, and then select **Remove**.
6. For removed users in the Administrator or Approver role, also remove them from Azure Key Vault policies.

### Add user access policy to Azure Key Vault

Additional access policies are required for Approvers and Administrators.

By default, the service identity has only limited permissions to access Key Vault, to prevent elevated operations or changes to take place without user impersonation. The basic service permissions are Get and List, for both secrets and certificates. For secrets, there is only one exception: the service can delete a private key from the secret store after it's accepted by a user. All other operations require user impersonated permissions.

#### For an Approver role, the following permissions must be added to Key Vault

1. Open the Azure portal.
2. Go to your OPC Vault `resourceGroupName`, used during deployment.
3. Go to the Key Vault `resourceGroupName-xxxxx`.
4. Go to **Access Policies**.
5. Select **Add new**.
6. Skip the template. There's no template that matches requirements.
7. Choose **Select Principal**, and select the user to be added, or invite a new user to the tenant.
8. Select the following **Key permissions**: **Get**, **List**, and **Sign**.
9. Select the following **Secret permissions**: **Get**, **List**, **Set**, and **Delete**.
10. Select the following **Certificate permissions**: **Get** and **List**.
11. Select **OK**, and select **Save**.

#### For an Administrator role, the following permissions must be added to Key Vault

1. Open the Azure portal.
2. Go to your OPC Vault `resourceGroupName`, used during deployment.
3. Go to the Key Vault `resourceGroupName-xxxxx`.
4. Go to **Access Policies**.
5. Select **Add new**.
6. Skip the template. There's no template that matches requirements.
7. Choose **Select Principal**, and select the user to be added, or invite a new user to the tenant.
8. Select the following **Key permissions**: **Get**, **List**, and **Sign**.
9. Select the following **Secret permissions**: **Get**, **List**, **Set**, and **Delete**.
10. Select the following **Certificate permissions**: **Get**, **List**, **Update**, **Create**, and **Import**.
11. Select **OK**, and select **Save**.

### Remove user access policy from Azure Key Vault

1. Open the Azure portal.
2. Go to your OPC Vault `resourceGroupName`, used during deployment.
3. Go to the Key Vault `resourceGroupName-xxxxx`.
4. Go to **Access Policies**.
5. Find the user to remove, and select **Delete**.

## Next steps

Now that you have learned how to manage OPC Vault certificates and users, you can:

> [!div class="nextstepaction"]
> [Secure communication of OPC devices](howto-opc-vault-secure.md)
