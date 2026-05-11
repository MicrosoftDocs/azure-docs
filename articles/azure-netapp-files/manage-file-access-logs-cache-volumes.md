---
title: Manage file access logs in Azure NetApp Files cache volumes
description: File access logs provide file access logging for individual cache volumes, capturing file system operations on selected cache volume.
services: azure-netapp-files
author: netapp-manishc
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 03/18/2026
ms.author: anfdocs

# Customer intent: As a storage administrator, I want to enable file access logs on Azure NetApp Files cache volumes so that I can monitor file access operations and troubleshoot access issues effectively.
---
# Manage file access logs in Azure NetApp Files cache volumes

File access logs provide file access logging for individual cache volumes, capturing file system operations on selected cache volumes. The logs capture [standard file operation](#recognized-events). File access logs provide insights beyond the platform logging captured in the [Azure Activity Log](/azure/azure-monitor/essentials/activity-log).

> [!NOTE]
> You should use REST APIs to add/delete diagnostic settings to enable/disable file access logs for cache volumes as portal support is not available.

## Considerations

>[!IMPORTANT]
>The file access logs feature is only supported with SMB3, NFSv4.1, cache volumes, and dual-protocol volumes. It's not supported on NFSv3 volumes. 

* Once file access logs are enabled on a cache volume, they can take up to 75 minutes to become visible. 
* Each log entry consumes approximately 1 KB of space.
* File access logs occasionally create duplicate log entries that must be filtered manually. 
* Deleting any diagnostic settings configured for `ANFFileAccess` causes any file access logs for any cache volume with that setting to become disabled. For more information, see [Diagnostic Settings](/rest/api/monitor/diagnostic-settings).
* Before enabling file access logs on a cache volume, either [access control lists (ACLs)](configure-access-control-lists.md) or Audit access control entries (ACEs) need to be set on a file or directory. You must set ACLs or Audit ACEs after mounting a cache volume.  
    >[!IMPORTANT]
    >For dual-protocol volumes using the NTFS security style, you must set Audit ACLs from a Windows machine. For dual-protocol volumes using UNIX security style, Audit ACLs must be set from a Linux machine.
* Azure NetApp Files file access logs provide detailed information about successful and failed requests to the storage service. This information can be used to monitor individual requests and to diagnose file access issues. Requests are logged on a best-effort basis, meaning that most requests result in a log record, but the completeness and timeliness of file access logs aren't guaranteed. The Azure NetApp Files file access logs feature doesn't provide explicit or implicit expectations or guarantees around logging for auditing and compliance purposes.  


### Performance considerations 

* All file access log file access events have a performance impact.
    * Events such as file/folder creation or deletion are key events to log. 
    * System access control list (SACL) settings for logging should be used sparingly. Frequent operations (for example, READ or GET) can have significant performance impact, but have limited logging value. It's recommended that SACL setting not log these frequent operations to conserve performance. 
    * SACL policy additions aren't currently supported with file access logs. 
* With clubbing events such as READ/WRITE, only a handful of operation per file read or write are captured to reduce event logging rate.  
* File access logs support a [log generation rate metric](azure-netapp-files-metrics.md). 

    If the rate of file access event generation exceeds 64 MiB/minute, the [Activity log](monitor-azure-netapp-files.md) sends a message stating that the rate of file access log generation is exceeding the limit. If log generation exceeds the limit, logging events can be delayed or dropped. If you're approaching this limit, disable noncritical auditing ACLs to reduce the event generation rate. As a precaution, you can [create an alert](/azure/azure-monitor/alerts/alerts-create-activity-log-alert-rule) for this event.
 
* During migration or robocopy operations, disable file access logs to reduce log generation. 
* It's recommended you avoid enabling file access logs on files with more than 450 ACEs to avoid performance issues. 

## Recognized events

The events capture in file access logs depend on the protocol of your cache volume.

### Logged NFS events
* Close
* Create
* Get attributes
* Link
* `Nverify`
* Open
* Open attribute
* Remove
* Rename
* Set attribute 
* Verify 
* Write

### Logged SMB events
* Create
* Delete
* Get attributes
* Hard link
* Open object
* Open object with the intent to delete
* Read
* Rename
* Set attribute 
* Unlink
* Write

## Set SACLs or Audit ACEs on files and directories  

You must set SACLs for SMB shares or Audit ACEs for NFSv4.1 exports for auditing. 

### [Set SACLs for SMB shares](#tab/sacls-smb)

To enable logging access on individual files and directories, complete the following steps on the Windows administration host. 

>[!NOTE]
> Select only the events you need to log. Selecting too many log options can impact system performance. 

#### Steps 

To enable logging access on individual files and directories, complete the following steps on the  Windows administration host. 

1. Select the file or directory for which to enable logging access. 
1. Right-click the file or directory, then select **Properties**. 
1. Select the **Security** tab then **Advanced**.
1. Select the **Auditing** tab. Add, edit, or remove the auditing options you want. 


### [Set Audit ACEs for NFSv4.1 shares](#tab/sacls-nfs)

For NFSv4.1, both discretionary and system ACEs are stored in the same ACL, not separate discretionary ACLs and SACLs. Exercise caution when adding audit ACEs to an existing ACL to avoid overwriting and losing an existing ACL. The order in which you add audit ACEs to an existing ACL doesn't matter. 

When configuring the Audit ACE, ensure you use the `U:` prefix to denote it's an Audit ACE. **For steps**, see [Configure access control lists on NFSv4.1 volumes](configure-access-control-lists.md).

---

## Enable file access logs for cache volumes

The following is an example to enable file access logs for cache volumes:

Request:
```
curl --request PUT \
--url 'https://management.azure.com/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/shn-cache-scus-rg3/providers/Microsoft.NetApp/netAppAccounts/shn-women-scus-na/capacityPools/cp1/caches/shn-nfs-cache101/providers/microsoft.insights/diagnosticSettings/log-analytics-setting?api-version=2021-05-01-preview' \
--header 'authorization: Bearer <TOKEN>' \
--header 'content-type: application/json' \
--data '{
  "name": "log-analytics-setting",
  "properties": {
      "logs": [
          {
              "category": "ANFFileAccess",
              "categoryGroup": null,
              "enabled": true,
              "retentionPolicy": {
                  "days": 0,
                  "enabled": false
              }
          }
      ],
      "metrics": [
          {
              "enabled": false,
              "retentionPolicy": {
                  "days": 0,
                  "enabled": false
              },
              "category": "AllMetrics"
          }
      ],
      "workspaceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/shn-cache-scus-rg3/providers/Microsoft.OperationalInsights/workspaces/shn-log-analytics-workspace",
      "logAnalyticsDestinationType": null
  }
}
```

Response:
```
{
  "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/shn-cache-scus-rg3/providers/microsoft.netapp/netappaccounts/shn-women-scus-na/capacitypools/cp1/caches/shn-nfs-cache101/providers/microsoft.insights/diagnosticSettings/log-analytics-setting",
  "type": "Microsoft.Insights/diagnosticSettings",
  "name": "log-analytics-setting",
  "location": null,
  "kind": null,
  "tags": null,
  "properties": {
    "storageAccountId": null,
    "serviceBusRuleId": null,
    "workspaceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/shn-cache-scus-rg3/providers/Microsoft.OperationalInsights/workspaces/shn-log-analytics-workspace",
    "eventHubAuthorizationRuleId": null,
    "eventHubName": null,
    "metrics": [
      {
        "timeGrain": "PT1M",
        "category": "AllMetrics",
        "enabled": false,
        "retentionPolicy": {
          "enabled": false,
          "days": 0
        }
      }
    ],
    "logs": [
      {
        "category": "ANFFileAccess",
        "categoryGroup": null,
        "enabled": true,
        "retentionPolicy": {
          "enabled": false,
          "days": 0
        }
      }
    ],
    "logAnalyticsDestinationType": null
  },
  "identity": null
}
```

## Fetch diagnostic settings on a cache volume  

The following is an example to fetch diagnostic settings on a cache volume:   

Request:
```
curl --request GET \
  --url 'https://management.azure.com/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/shn-cache-scus-rg3/providers/Microsoft.NetApp/netAppAccounts/shn-women-scus-na/capacityPools/cp1/caches/shn-nfs-cache101/providers/microsoft.insights/diagnosticSettings?api-version=2021-05-01-preview' \
  --header 'authorization: Bearer <TOKEN>' \
  --header 'content-type: application/json'
```

Response:
```
{
  "value": [
    {
      "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/shn-cache-scus-rg3/providers/microsoft.netapp/netappaccounts/shn-women-scus-na/capacitypools/cp1/caches/shn-nfs-cache101/providers/microsoft.insights/diagnosticSettings/log-analytics-setting",
      "type": "Microsoft.Insights/diagnosticSettings",
      "name": "log-analytics-setting",
      "location": "southcentralus",
      "kind": null,
      "tags": null,
      "properties": {
        "storageAccountId": null,
        "serviceBusRuleId": null,
        "workspaceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/shn-cache-scus-rg3/providers/Microsoft.OperationalInsights/workspaces/shn-log-analytics-workspace",
        "eventHubAuthorizationRuleId": null,
        "eventHubName": null,
        "metrics": [
          {
            "category": "AllMetrics",
            "enabled": false,
            "retentionPolicy": {
              "enabled": false,
              "days": 0
            }
          }
        ],
        "logs": [
          {
            "category": "ANFFileAccess",
            "categoryGroup": null,
            "enabled": true,
            "retentionPolicy": {
              "enabled": false,
              "days": 0
            }
          }
        ],
        "logAnalyticsDestinationType": null
      },
      "identity": null
    }
  ]
}    
```

## Disable file access logs on cache volumes by removing diagnostic setting  

The following is an example to disable file access logs on cache volumes by removing diagnostic setting:

Request:
```
curl --request DELETE \
--url 'https://management.azure.com/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/shn-cache-scus-rg3/providers/Microsoft.NetApp/netAppAccounts/shn-women-scus-na/capacityPools/cp1/caches/shn-nfs-cache101/providers/microsoft.insights/diagnosticSettings/log-analytics-setting?api-version=2021-05-01-preview' \
--header 'authorization: Bearer <TOKEN>'
```

Response:
```
200 OK
```

## Next steps

* [Security FAQs](faq-security.md) 
* [Azure resource logs](/azure/azure-monitor/essentials/resource-logs)
* [Understand NFSv4.x access control lists in Azure NetApp Files](nfs-access-control-lists.md)
* [Understand SMB file permissions in Azure NetApp Files](network-attached-file-permissions-smb.md)
