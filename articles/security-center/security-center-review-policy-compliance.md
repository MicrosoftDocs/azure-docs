---
title: Reviewing Security Center policy compliance with Azure REST API | Microsoft Docs
description: Learn how to use Azure REST APIs to review current compliance with Security Center policies.
services: security-center
documentationcenter: na
author: alleonar
manager: MBaldwin
editor: ''

ms.assetid: 82D50B98-40F2-44B1-A445-4391EA9EBBAA
ms.service: security-center
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/05/2017
ms.author: terrylan

---

# Review Security Center policy compliance using REST APIs

In [Managing security recommendations in Azure Security Center](https://docs.microsoft.com/en-us/azure/security-center/security-center-recommendations), you learn how to use  Security Center to monitor compliance with your security policies.  Here, you learn to do so using Azure REST APIs.  

To retrieve the current set of recommendations:
```  
GET https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Security/tasks?api-version={api-version}
Content-Type: application/json   
Authorization: Bearer
```

## Request  
HTTPS is required for all service requests. 

The `{subscription-id}` parameter is required and should contain the subscription ID for the Azure subscription defining the policies.  You can get the subscription ID from the Azure portal.  Choose **All services** and then use the Filter to find Subscriptions. 

The `api-version` parameter is required. At this time, these endpoints are supported only for `api-version=2015-06-01-preview`.  The current version is `api-version=2016-09-01`. To learn more about versions, see See [API versions in Azure Search](https://go.microsoft.com/fwlink/?linkid=834796) for a list of available versions.  

### Request Headers  
 The following table describes the required and optional request headers.  

|Request Header|Description|  
|--------------------|-----------------|  
|*Content-Type:*|Required. Set this to `application/json`|  
|*Authorization: Bearer*|Required. Set this to a valid [access token](https://docs.microsoft.com/en-us/rest/api/azure/#authorization-code-grant-interactive-clients). |  

### Response  
Status code 200 (OK) is returned for a successful response, which contain a list of recommendation tasks.

The response object contains list of 
```  
{  
  "value": [  
    {  
      "key": "unique_key_of_document",  
      "status": true,  
      "errorMessage": null  
    }  
  ]  
}  
```  

Other status codes indicate error conditions.  In these cases, the response object includes a description explaining why the request failed.

```  json
{  
  "value": [  
    {  
      "description": "Error response describing why the operation failed."  
    }  
  ]  
}  
```  


## Example  

```  
{  
  "value": [  
        {
            "id": "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Security/locations/{region}/tasks/{task-id}",
            "name": "{task_id}",
            "type": "Microsoft.Security/locations/{region}/tasks",
            "properties": {
                "state": "Active",
                "subState": "NA",
                "creationTimeUtc": "{create-time}",
                "lastStateChangeTimeUtc": "{last-state-change}",
                "securityTaskParameters": {
                    "vmId": "/subscriptions/{subscription-id}/resourceGroups/{resource_group}/providers/Microsoft.Compute/virtualMachines/{vm_name}",
                    "vmName": "{vm_name}",
                    "severity": "{severity}",
                    "isOsDiskEncrypted": {is_os_disk_encrypted},
                    "isDataDiskEncrypted": {is_data_disk_encrypted},
                    "name": "{recommendation_name}",
                    "uniqueKey": "EncryptionOnVmTaskParameters_/subscriptions/{subscription-id}/resourceGroups/{resoource_group}/providers/Microsoft.Compute/virtualMachines/{vm_name}",
                    "resourceId": "/subscriptions/{subscription_id}/resourceGroups/{resource_group}/providers/Microsoft.Compute/virtualMachines/{vm_name}"
                }
            }
        },
        {
            "id": "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Security/locations/{location}/tasks/{task-id}",
            "name": "{task-id}",
            "type": "Microsoft.Security/locations/{region}/tasks",
            "properties": {
                "state": "Active",
                "subState": "NA",
                "creationTimeUtc": "{create-time}",
                "lastStateChangeTimeUtc": "{last-state-change}",
                "securityTaskParameters": {
                    "serverName": "{sql-server-name}",
                    "serverId": "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Sql/servers/{server-id}",
                    "name": "Enable auditing for the SQL server",
                    "uniqueKey": "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Sql/servers/{server-id}/auditingPolicies/Default",
                    "resourceId": "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Sql/servers/{server-id}"
                }
            }
        }  ]  
}  
```  

This example shows two recommendations; each item in the list corresponds to a specific recommendation and includes the following properties:

| Property | Description |
+----------+-------------+
| **state** | Indicates whether recommendation is `active` or `resolved `. |
| **creationTimeUtc** | Date and time, in UTC, showing when the recommendation was created. |
| **lastStateChange** | Date and time, in UTV, of the last state change, if any. |
| **securityTaskParameters** | contains the details of the recommendation, which vary according to the name.  For currently supported recommendations, see [Implement security recommendations](https://docs.microsoft.com/en-us/azure/security-center/security-center-recommendations).

 are described and the details of each varies according to the specific recommendation.  Recommendations correspond to the ones described in [Managing security recommendations in Azure Security Center](https://docs.microsoft.com/en-us/azure/security-center/security-center-recommendations).



## See also  
- [Set security policies](https://docs.microsoft.com/en-us/azure/security-center/security-center-policies-overview)
- [Azure Security Resource provider REST API](https://msdn.microsoft.com/en-us/library/azure/mt704034.aspx)   
- [Get started with Azure REST API](https://docs.microsoft.com/en-us/rest/api/azure/)   
- [Azure Security Center PowerShell module](https://www.powershellgallery.com/packages/Azure-Security-Center/0.0.22)
