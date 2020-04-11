---
title: Implement disaster recovery using backup and restore in API Management
titleSuffix: Azure API Management
description: Learn how to use backup and restore to perform disaster recovery in Azure API Management.
services: api-management
documentationcenter: ''
author: mikebudzynski
manager: erikre
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 02/03/2020
ms.author: apimpm
---

# How to implement disaster recovery using service backup and restore in Azure API Management

By publishing and managing your APIs via Azure API Management, you're taking advantage of fault tolerance and infrastructure capabilities that you'd otherwise design, implement, and manage manually. The Azure platform mitigates a large fraction of potential failures at a fraction of the cost.

To recover from availability problems that affect the region that hosts your API Management service, be ready to reconstitute your service in another region at any time. Depending on your recovery time objective, you might want to keep a standby service in one or more regions. You might also try to maintain their configuration and content in sync with the active service according to your recovery point objective. The service backup and restore features provides the necessary building blocks for implementing disaster recovery strategy.

Backup and restore operations can also be used for replicating API Management service configuration between operational environments, e.g. development and staging. Beware that runtime data such as users and subscriptions will be copied as well, which might not always be desirable.

This guide shows how to automate backup and restore operations and how to ensure successful authenticating of backup and restore requests by Azure Resource Manager.

> [!IMPORTANT]
> Restore operation doesn't change custom hostname configuration of the target service. We recommend to use the same custom hostname and TLS certificate for both active and standby services, so that, after restore operation completes, the traffic can be re-directed to the standby instance by a simple DNS CNAME change.
>
> Backup operation does not capture pre-aggregated log data used in reports shown on the Analytics blade in the Azure portal.

> [!WARNING]
> Each backup expires after 30 days. If you attempt to restore a backup after the 30-day expiration period has expired, the restore will fail with a `Cannot restore: backup expired` message.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Authenticating Azure Resource Manager requests

> [!IMPORTANT]
> The REST API for backup and restore uses Azure Resource Manager and has a different authentication mechanism than the REST APIs for managing your API Management entities. The steps in this section describe how to authenticate Azure Resource Manager requests. For more information, see [Authenticating Azure Resource Manager requests](/rest/api/index).

All of the tasks that you do on resources using the Azure Resource Manager must be authenticated with Azure Active Directory using the following steps:

-   Add an application to the Azure Active Directory tenant.
-   Set permissions for the application that you added.
-   Get the token for authenticating requests to Azure Resource Manager.

### Create an Azure Active Directory application

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Using the subscription that contains your API Management service instance, navigate to the **App registrations** tab in **Azure Active Directory** (Azure Active Directory > Manage/App registrations).

    > [!NOTE]
    > If the Azure Active Directory default directory isn't visible to your account, contact the administrator of the Azure subscription to grant the required permissions to your account.

3. Click **New application registration**.

    The **Create** window appears on the right. That's where you enter the AAD app relevant information.

4. Enter a name for the application.
5. For the application type, select **Native**.
6. Enter a placeholder URL such as `http://resources` for the **Redirect URI**, as it's a required field, but the value isn't used later. Click the check box to save the application.
7. Click **Create**.

### Add an application

1. Once the application is created, click **API permissions**.
2. Click **+ Add a permission**.
4. Press **Select Microsoft APIs**.
5. Choose **Azure Service Management**.
6. Press **Select**.

    ![Add permissions](./media/api-management-howto-disaster-recovery-backup-restore/add-app.png)

7. Click **Delegated Permissions** beside the newly added application, check the box for **Access Azure Service Management (preview)**.
8. Press **Select**.
9. Click **Grant Permissions**.

### Configuring your app

Before calling the APIs that generate the backup and restore it, you need to get a token. The following example uses the [Microsoft.IdentityModel.Clients.ActiveDirectory](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory) NuGet package to retrieve the token.

```csharp
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;

namespace GetTokenResourceManagerRequests
{
    class Program
    {
        static void Main(string[] args)
        {
            var authenticationContext = new AuthenticationContext("https://login.microsoftonline.com/{tenant id}");
            var result = authenticationContext.AcquireTokenAsync("https://management.azure.com/", "{application id}", new Uri("{redirect uri}"), new PlatformParameters(PromptBehavior.Auto)).Result;

            if (result == null) {
                throw new InvalidOperationException("Failed to obtain the JWT token");
            }

            Console.WriteLine(result.AccessToken);

            Console.ReadLine();
        }
    }
}
```

Replace `{tenant id}`, `{application id}`, and `{redirect uri}` using the following instructions:

1. Replace `{tenant id}` with the tenant ID of the Azure Active Directory application you created. You can access the ID by clicking **App registrations** -> **Endpoints**.

    ![Endpoints][api-management-endpoint]

2. Replace `{application id}` with the value you get by navigating to the **Settings** page.
3. Replace the `{redirect uri}` with the value from the **Redirect URIs** tab of your Azure Active Directory application.

    Once the values are specified, the code example should return a token similar to the following example:

    ![Token][api-management-arm-token]

    > [!NOTE]
    > The token may expire after a certain period. Execute the code sample again to generate a new token.

## Calling the backup and restore operations

The REST APIs are [Api Management Service - Backup](/rest/api/apimanagement/2019-12-01/apimanagementservice/backup) and [Api Management Service - Restore](/rest/api/apimanagement/2019-12-01/apimanagementservice/restore).

Before calling the "backup and restore" operations described in the following sections, set the authorization request header for your REST call.

```csharp
request.Headers.Add(HttpRequestHeader.Authorization, "Bearer " + token);
```

### <a name="step1"> </a>Back up an API Management service

To back up an API Management service issue the following HTTP request:

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{serviceName}/backup?api-version={api-version}
```

where:

-   `subscriptionId` - ID of the subscription that holds the API Management service you're trying to back up
-   `resourceGroupName` - name of the resource group of your Azure API Management service
-   `serviceName` - the name of the API Management service you're making a backup of specified at the time of its creation
-   `api-version` - replace with `2018-06-01-preview`

In the body of the request, specify the target Azure storage account name, access key, blob container name, and backup name:

```json
{
    "storageAccount": "{storage account name for the backup}",
    "accessKey": "{access key for the account}",
    "containerName": "{backup container name}",
    "backupName": "{backup blob name}"
}
```

Set the value of the `Content-Type` request header to `application/json`.

Backup is a long running operation that may take more than a minute to complete. If the request succeeded and the backup process began, you receive a `202 Accepted` response status code with a `Location` header. Make 'GET' requests to the URL in the `Location` header to find out the status of the operation. While the backup is in progress, you continue to receive a '202 Accepted' status code. A Response code of `200 OK` indicates successful completion of the backup operation.

Note the following constraints when making a backup or restore request:

-   **Container** specified in the request body **must exist**.
-   While backup is in progress, **avoid management changes in the service** such as SKU upgrade or downgrade, change in domain name, and more.
-   Restore of a **backup is guaranteed only for 30 days** since the moment of its creation.
-   **Usage data** used for creating analytics reports **isn't included** in the backup. Use [Azure API Management REST API][azure api management rest api] to periodically retrieve analytics reports for safekeeping.
-   In addition, the following items are not part of the backup data: custom domain TLS/SSL certificates and any intermediate or root certificates uploaded by customer, developer portal content, and virtual network integration settings.
-   The frequency with which you perform service backups affect your recovery point objective. To minimize it, we recommend implementing regular backups and performing on-demand backups after you make changes to your API Management service.
-   **Changes** made to the service configuration, (for example, APIs, policies, and developer portal appearance) while backup operation is in process **might be excluded from the backup and will be lost**.
-   **Allow** access from control plane to Azure Storage Account, if it has [firewall][azure-storage-ip-firewall] enabled. Customer should open the set of [Azure API Management Control Plane IP Addresses][control-plane-ip-address] on their Storage Account for Backup to or Restore from. 

> [!NOTE]
> If you attempt to do backup/restore from/to an API Management service using a storage account which has [firewall][azure-storage-ip-firewall] 
> enabled, in the same Azure Region, then this will not work. This is because the requests to Azure Storage are not SNATed to a public IP from Compute > (Azure Api Management control Plane). Cross Region storage request will be SNATed.

### <a name="step2"> </a>Restore an API Management service

To restore an API Management service from a previously created backup, make the following HTTP request:

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{serviceName}/restore?api-version={api-version}
```

where:

-   `subscriptionId` - ID of the subscription that holds the API Management service you're restoring a backup into
-   `resourceGroupName` - name of the resource group that holds the Azure API Management service you're restoring a backup into
-   `serviceName` - the name of the API Management service being restored into specified at its creation time
-   `api-version` - replace with `2018-06-01-preview`

In the body of the request, specify the backup file location. That is, add the Azure storage account name, access key, blob container name, and backup name:

```json
{
    "storageAccount": "{storage account name for the backup}",
    "accessKey": "{access key for the account}",
    "containerName": "{backup container name}",
    "backupName": "{backup blob name}"
}
```

Set the value of the `Content-Type` request header to `application/json`.

Restore is a long running operation that may take up to 30 or more minutes to complete. If the request succeeded and the restore process began, you receive a `202 Accepted` response status code with a `Location` header. Make 'GET' requests to the URL in the `Location` header to find out the status of the operation. While the restore is in progress, you continue to receive '202 Accepted' status code. A response code of `200 OK` indicates successful completion of the restore operation.

> [!IMPORTANT]
> **The SKU** of the service being restored into **must match** the SKU of the backed-up service being restored.
>
> **Changes** made to the service configuration (for example, APIs, policies, developer portal appearance) while restore operation is in progress **could be overwritten**.

<!-- Dummy comment added to suppress markdown lint warning -->

> [!NOTE]
> Backup and restore operations can also be performed with PowerShell [_Backup-AzApiManagement_](/powershell/module/az.apimanagement/backup-azapimanagement) and [_Restore-AzApiManagement_](/powershell/module/az.apimanagement/restore-azapimanagement) commands respectively.

## Next steps

Check out the following resources for different walkthroughs of the backup/restore process.

-   [Replicate Azure API Management Accounts](https://www.returngis.net/en/2015/06/replicate-azure-api-management-accounts/)
-   [Automating API Management Backup and Restore with Logic Apps](https://github.com/Azure/api-management-samples/tree/master/tutorials/automating-apim-backup-restore-with-logic-apps)
-   [Azure API Management: Backing Up and Restoring Configuration](https://blogs.msdn.com/b/stuartleeks/archive/2015/04/29/azure-api-management-backing-up-and-restoring-configuration.aspx)
    _The approach detailed by Stuart does not match the official guidance but it is interesting._

[backup an api management service]: #step1
[restore an api management service]: #step2
[azure api management rest api]: https://docs.microsoft.com/rest/api/apimanagement/apimanagementrest/api-management-rest
[api-management-add-aad-application]: ./media/api-management-howto-disaster-recovery-backup-restore/api-management-add-aad-application.png
[api-management-aad-permissions]: ./media/api-management-howto-disaster-recovery-backup-restore/api-management-aad-permissions.png
[api-management-aad-permissions-add]: ./media/api-management-howto-disaster-recovery-backup-restore/api-management-aad-permissions-add.png
[api-management-aad-delegated-permissions]: ./media/api-management-howto-disaster-recovery-backup-restore/api-management-aad-delegated-permissions.png
[api-management-aad-default-directory]: ./media/api-management-howto-disaster-recovery-backup-restore/api-management-aad-default-directory.png
[api-management-aad-resources]: ./media/api-management-howto-disaster-recovery-backup-restore/api-management-aad-resources.png
[api-management-arm-token]: ./media/api-management-howto-disaster-recovery-backup-restore/api-management-arm-token.png
[api-management-endpoint]: ./media/api-management-howto-disaster-recovery-backup-restore/api-management-endpoint.png
[control-plane-ip-address]: api-management-using-with-vnet.md#control-plane-ips
[azure-storage-ip-firewall]: ../storage/common/storage-network-security.md#grant-access-from-an-internet-ip-range
