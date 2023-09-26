---
title: Prerequisites for Microsoft Entra reporting API
description: Learn how to configure the prerequisites that are required to access the Microsoft Graph reporting API.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: report-monitor
ms.date: 08/24/2023
ms.author: sarahlipsey
ms.reviewer: besiler

---
# Prerequisites to access the Microsoft Entra reporting API

The Microsoft Entra [reporting APIs](/graph/api/resources/azure-ad-auditlog-overview) provide you with programmatic access to the data through a set of REST APIs. You can call these APIs from many programming languages and tools. The reporting API uses [OAuth](../../api-management/api-management-howto-protect-backend-with-aad.md) to authorize access to the web APIs. The Microsoft Graph API is **not** designed for pulling large amounts of activity data. Pulling large amounts of activity data using the API may lead to issues with pagination and performance.

This article describes how to enable Microsoft Graph to access the Microsoft Entra reporting APIs in the Microsoft Entra admin center and through PowerShell

## Roles and license requirements

To get access to the reporting data through the API, you need to have one of the following roles:

- Security Reader
- Security Administrator
- Global Administrator

In order to access the sign-in reports for a tenant, a Microsoft Entra tenant must have associated Microsoft Entra ID P1 or P2 license. If the directory type is Azure AD B2C, the sign-in reports are accessible through the API without any other license requirement. 

Registration is needed even if you're accessing the reporting API using a script. The registration gives you an **Application ID**, which is required for the authorization calls and enables your code to receive tokens. To configure your directory to access the Microsoft Entra reporting API, you must sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/) in one of the required roles.

> [!IMPORTANT]
> Applications running under credentials with administrator privileges can be very powerful, so be sure to keep the application's ID and secret credentials in a secure location.
> 
## Enable the Microsoft Graph API through the Microsoft Entra admin center

To enable your application to access Microsoft Graph without user intervention, you need to register your application with Microsoft Entra ID, then grant permissions to the Microsoft Graph API. This article covers the steps to follow in the Microsoft Entra admin center. 

<a name='register-an-azure-ad-application'></a>

### Register a Microsoft Entra application

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Security Reader](../roles/permissions-reference.md#security-reader).
1. Browse to **Identity** > **Applications** > **App registrations**.

1. Select **New registration**.

    ![Screenshot of the App registrations page, with the New registration button highlighted.](./media/howto-configure-prerequisites-for-reporting-api/new-app-registration.png)

1. On the **Registration an Application** page:
    1. Give the application a **Name** such as `Reporting API application`.
    1. For **Supported accounts type**, select **Accounts in this organizational directory only**.
    1. In the **Redirect URI** section, select **Web** from the list and type `https://localhost`.
    1. Select **Register**.

    ![Screenshot shows the Register an application page where you can enter the values in this step.](./media/howto-configure-prerequisites-for-reporting-api/04.png)

### Grant permissions 

To access the Microsoft Entra reporting API, you must grant your app *Read directory data* and *Read all audit log data* permissions for the Microsoft Graph API.

1. Browse to **Identity** > **Applications** > **App Registrations**.
1. Select **Add a permission**.

    ![Screenshot of the API permissions menu option and Add permissions button.](./media/howto-configure-prerequisites-for-reporting-api/api-permissions-new-permission.png)

1. Select **Microsoft Graph** > **Application permissions**.
1. Add **Directory.Read.All**, **AuditLog.Read.All** and **Policy.Read.ConditionalAccess** then select the **Add permissions** button.
    - If you need more permissions to run the queries you need, you can add them now or modify the permissions as needed in Microsoft Graph.
    - For more information, see [Work with Graph Explorer](/graph/graph-explorer/graph-explorer-features).

    ![Screenshot shows the Request API permissions page where you can select Application permissions.](./media/howto-configure-prerequisites-for-reporting-api/directory-read-all.png)

1. On the **Reporting API Application - API Permissions** page, select **Grant admin consent for Default Directory**.

    ![Screenshot shows the Reporting API Application API permissions page where you can select Grant admin consent.](./media/howto-configure-prerequisites-for-reporting-api/api-permissions-grant-consent.png)

## Access reports using Microsoft Graph Explorer

Once you have the app registration configured, you can run activity log queries in Microsoft Graph.

1. Sign in to https://graph.microsoft.com using the **Security Reader** role.
    - You may need to confirm that you're signed into the appropriate role.
    - Select your profile icon in the upper-right corner of Microsoft Graph.
1. Use one of the following queries to start using Microsoft Graph for accessing activity logs:
    - GET `https://graph.microsoft.com/v1.0/auditLogs/directoryAudits`
    - GET `https://graph.microsoft.com/v1.0/auditLogs/signIns`
    - For more information on Microsoft Graph queries for activity logs, see [Activity reports API overview](/graph/api/resources/azure-ad-auditlog-overview)

    ![Screenshot of an activity log GET query in Microsoft Graph.](./media/howto-configure-prerequisites-for-reporting-api/graph-sample-get-query.png)

## Access reports using Microsoft Graph PowerShell

To use PowerShell to access the Microsoft Entra reporting API, you need to gather a few configuration settings. These settings were created as a part of the [app registration process](#register-an-azure-ad-application).

- Tenant ID
- Client app ID
- Client secret or certificate

You need these values when configuring calls to the reporting API. We recommend using a certificate because it's more secure.

1. Browse to **Identity** > **Applications** > **App Registrations**.
1. Open the application you created.
1. Copy the **Directory (tenant) ID**.
1. Copy the **Application (client) ID**.
1. Browse to **Certificates & secrets** > **Certificates** > **Upload certificate** and upload your certificate's public key file.
    - If you don't have a certificate to upload, follow the steps outlined in the [Create a self-signed certificate to authenticate your application](../develop/howto-create-self-signed-certificate.md) article. 

Next you need to authenticate with the configuration settings you just gathered. Open PowerShell and run the following command, replacing the placeholders with your information.

```powershell
Connect-MgGraph -ClientID YOUR_APP_ID -TenantId YOUR_TENANT_ID -CertificateName YOUR_CERT_SUBJECT ## Or -CertificateThumbprint instead of -CertificateName
```

Microsoft Graph PowerShell cmdlets:

- **Audit logs:** `Get-MgAuditLogDirectoryAudit`
- **Sign-in logs:** `Get-MgAuditLogSignIn`
- **Provisioning logs:** `Get-MgAuditLogProvisioning`
- Explore the full list of [reporting-related Microsoft Graph PowerShell cmdlets](/powershell/module/microsoft.graph.reports).

Programmatic access APIs:
- **Security detections:** [Identity Protection risk detections API](/graph/api/resources/identityprotection-root)
- **Tenant provisioning events:** [Provisioning logs API](/graph/api/resources/provisioningobjectsummary)

<a name='troubleshoot-errors-in-azure-active-directory-reporting-api'></a>

### Troubleshoot errors in Microsoft Entra reporting API

**500 HTTP internal server error while accessing Microsoft Graph beta endpoint**: We don't currently support the Microsoft Graph beta endpoint - make sure to access the activity logs using the Microsoft Graph v1.0 endpoint.
- GET `https://graph.microsoft.com/v1.0/auditLogs/directoryAudits`
- GET `https://graph.microsoft.com/v1.0/auditLogs/signIns`

**Error: Neither tenant is B2C or tenant doesn't have premium license**: Accessing sign-in reports requires a Microsoft Entra ID P1 or P2 1 (P1) license. If you see this error message while accessing sign-ins, make sure that your tenant is licensed with a Microsoft Entra ID P1 license.

**Error: User isn't in the allowed roles**: If you see this error message while trying to access audit logs or sign-ins using the API, make sure that your account is part of the **Security Reader** or **Reports Reader** role in your Microsoft Entra tenant. 

**Error: Application missing Microsoft Entra ID 'Read directory data' or 'Read all audit log data' permission**: Revisit the **[Grant permissions](#grant-permissions)** section of this article to ensure the permissions are properly set.

## Next steps

* [Get started with Microsoft Entra ID Protection and Microsoft Graph](../identity-protection/howto-identity-protection-graph-api.md)
* [Audit API reference](/graph/api/resources/directoryaudit) 
* [Sign-in API reference](/graph/api/resources/signin)
