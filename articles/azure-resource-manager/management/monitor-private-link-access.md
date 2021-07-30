---
title: Monitor resource management private links
description: Use Azure monitor to track public access to resource management private links.
ms.topic: conceptual
ms.date: 07/30/2021
---

# Monitor public access to resource management private links

This article explains how to monitor access to your resource management private link. Every time that a user sends a request to Azure Resource Manager over the public network, an entry is added to the log. You can see who took the action and which operation was requested. The monitoring applies across your tenant.

## Configure diagnostics

Logging for resource management private link is a tenant-level diagnostic log. For more information about the types of platform logs, see [Overview of Azure platform logs](../../azure-monitor/essentials/platform-logs-overview.md). For help with configuring the log, see [Create diagnostic settings to send platform logs and metrics to different destinations](../../azure-monitor/essentials/diagnostic-settings.md).

For resource management private links, setting up logging is similar to [integrating Azure Active Directory logs with Azure Monitor logs](../../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md#send-logs-to-azure-monitor). Both services support tenant-level diagnostic logs.

Select **PublicAccessLogs** for the category.

After configuring the log, all calls across the tenant are recorded to the log. The resource you used for configuring the log doesn't affect what is recorded.

## Log schema

The log entry includes fields for `callerIpAddress` and `operationName`. It has the following schema:

```json
{
    "time": "2021-07-01T17:42:41.6933309Z",
    "tenantId": "<TENANT ID>",
    "operationName": "MICROSOFT.STORAGE/STORAGEACCOUNTS/READ",
    "providerName" : "MICROSOFT.STORAGE",
    "category": "PublicAccessLogs",
    "resultType": "Failure",
    "resultSignature": "403",
    "durationMs": 0,
    "callerIpAddress": "<CALLER IP ADDRESS>",
    "correlationId": "469f55ef-0d79-4289-9b0d-76491873fbc2",
    "identity": 
        "{\"authorization\":{},
        \"claims\":
            {\"aud\":\"https://management.core.windows.net/\",
            \"iss\":\"https://sts.windows.net/24f15700-370c-45bc-86a7-aee1b0c4eb8a/\",
            \"iat\":\"1625160520\",
            \"nbf\":\"1625160520\",
            \"exp\":\"1625164420\",
            \"http://schemas.microsoft.com/claims/authnclassreference\":\"1\",
            \"aio\":\"AWQAm/8TAAAAEKry1ZK+RW27acobclmXhwqL8TO+OOXlt3xwnyMZfaHT1RTa/VzC3Nxh+Su2v9fjMxaljHwlamo5MGX3rmDanI6iyJSPQlfbrG3/Yg2e1SvjSIbfbqduedfTvUGW1or6\",
            \"altsecid\":\"5::100320003ACDF5D3\",
            \"http://schemas.microsoft.com/claims/authnmethodsreferences\":\"rsa\",
            \"appid\":\"<APP ID>\",
            \"appidacr\":\"2\",
            \"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress\":\"<EMAIL ADDRESS>\",
            \"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname\":\"<IDENTITY SURNAME>\",
            \"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname\":\"<IDENTITY GIVENNAME>\",
            \"groups\":\"18db46e2-2fb2-4c94-9b2b-b548a35d33f1\",
            \"http://schemas.microsoft.com/identity/claims/identityprovider\":\"https://sts.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/\",
            \"ipaddr\":\"<IP ADDRESS>\",
            \"name\":\"Vishakha Narvekar\",
            \"http://schemas.microsoft.com/identity/claims/objectidentifier\":\"ad79bdc7-382f-4db4-a587-04818cfeb6be\",
            \"puid\":\"10032000ED39162F\",
            \"rh\":\"0.AW8AAFfxJAw3vEWGp67hsMTrioNAS8SwO8FJtH2XTlPL3zxvACU.\",
            \"http://schemas.microsoft.com/identity/claims/scope\":\"user_impersonation\",
            \"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier\":\"yT5w3OdImDEBr0CAMJoOt70uLvuiB6nn85MFH9ndIYk\",
            \"http://schemas.microsoft.com/identity/claims/tenantid\":\"24f15700-370c-45bc-86a7-aee1b0c4eb8a\",
            \"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name\":\"<IDENTITY NAME>\",
            \"uti\":\"eO2zu2yrd0SKDX9tkzoLAQ\",
            \"ver\":\"1.0\",
            \"wids\":\"62e90394-69f5-4237-9190-012177145e10\",
            \"xms_tcdt\":\"1599091736\"}}",
    "uri": "/SUBSCRIPTIONS/<SUB-ID>/RESOURCEGROUPS/<RG>/PROVIDERS/MICROSOFT.STORAGE/STORAGEACCOUNTS/<STORAGE-NAME>",
    "properties": privateLinkAssociationIds: xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx,cxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
}
```

You can use this information to diagnose suspicious requests.

## Next steps

* To learn more about private links, see [Azure Private Link](../../private-link/index.yml).
* To create a resource management private links, see [Use portal to create private link for managing Azure resources](create-private-link-access-portal.md) or [Use REST API to create private link for managing Azure resources](create-private-link-access-rest.md).