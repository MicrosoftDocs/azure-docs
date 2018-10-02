---
title: Reviewing Security Center policy compliance with Azure REST API | Microsoft Docs
description: Learn how to use Azure REST APIs to review current compliance with Security Center policies.
services: security-center
documentationcenter: na
author: lleonard-msft
manager: MBaldwin
editor: ''

ms.assetid: 82D50B98-40F2-44B1-A445-4391EA9EBBAA
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/05/2017
ms.author: alleonar

# As an administrator or developer, I want to review policy compliance with my current Security Center policies.

---

# Review Security Center policy compliance using REST APIs

Security Center periodically validates your Azure resources against your defined security policies. Security Center also provides a REST API that lets you review compliance from your own applications; you can query the service directly or import JSON results into other applications. 

Here, you learn to retrieve the current set of recommendations from all Azure resources associated with a subscription.

To retrieve the current set of recommendations:
``` http
GET https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Security/tasks?api-version={api-version}
Content-Type: application/json   
Authorization: Bearer
```

## Build the request  

The `{subscription-id}` parameter is required and should contain the subscription ID for the Azure subscription defining the policies. If you have multiple subscriptions, see [Working with multiple subscriptions](https://docs.microsoft.com/cli/azure/manage-azure-subscriptions-azure-cli?view=azure-cli-latest#working-with-multiple-subscriptions).  

The `api-version` parameter is required. At this time, these endpoints are supported only for `api-version=2015-06-01-preview`. 

The following headers are required: 

|Request header|Description|  
|--------------------|-----------------|  
|*Content-Type:*|Required. Set to `application/json`.|  
|*Authorization:*|Required. Set to a valid `Bearer` [access token](https://docs.microsoft.com/rest/api/azure/#authorization-code-grant-interactive-clients). |  

## Response  

Status code 200 (OK) is returned for a successful response, which contains a list of recommended tasks to secure your Azure resources.

``` json
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
       "securityTaskParameters": "{security-task-properties}"
    } 
  ]  
}  
```  

Each item in **value** represents a recommendation:

|Response property|Description|
|----------------|----------|
|**state** | Indicates whether recommendation is `active` or `resolved`. |
|**creationTimeUtc** | Date and time, in UTC, showing when the recommendation was created. |
|**lastStateChangeUtc** | Date and time, in UTV, of the last state change, if any. |
|**securityTaskParameters** | Details the recommendation; properties vary according to the underlying recommendation. |
||
  
For currently supported recommendations, see [Implement security recommendations](https://docs.microsoft.com/azure/security-center/security-center-recommendations).

Other status codes indicate error conditions. In these cases, the response object includes a description explaining why the request failed.

``` json
{  
  "value": [  
    {  
      "description": "Error response describing why the operation failed."  
    }  
  ]  
}  
```  

## Example response  

``` json
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
                    "name": "EncryptionOnVm",
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

This response shows two recommendations; each item in the list corresponds to a specific recommendation. The first recommends encrypting storage on a Linux virtual machine and the second suggests that you enable auditing for a SQL server.

The recommendations vary according to the policies you've enabled. To learn more, including the currently available recommendations, see [Managing security recommendations in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-recommendations).


## See also  
- [Set security policies](https://docs.microsoft.com/azure/security-center/security-center-policies-overview)
- [Azure Security Resource provider REST API](https://msdn.microsoft.com/library/azure/mt704034.aspx)   
- [Get started with Azure REST API](https://docs.microsoft.com/rest/api/azure/)   
- [Azure Security Center PowerShell module](https://www.powershellgallery.com/packages/Azure-Security-Center/0.0.22)
