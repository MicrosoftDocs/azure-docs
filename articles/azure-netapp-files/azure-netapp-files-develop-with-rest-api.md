---
title: Develop for Azure NetApp Files with REST API | Microsoft Docs
description: The REST API for the Azure NetApp Files service defines HTTP operations for resources such as the NetApp account, the capacity pool, the volumes, and snapshots.
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 09/30/2022
ms.author: anfdocs
---
# Develop for Azure NetApp Files with REST API 

The REST API for the Azure NetApp Files service defines HTTP operations against resources such as the NetApp account, the capacity pool, the volumes, and snapshots. This article helps you get started with using the Azure NetApp Files REST API.

## Azure NetApp Files REST API specification

The REST API specification for Azure NetApp Files is published through [GitHub](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/netapp/resource-manager):

`https://github.com/Azure/azure-rest-api-specs/tree/main/specification/netapp/resource-manager`

## Considerations

* When the API limit has been exceeded, the HTTP response code is **429**. For example:

   `"Microsoft.Azure.ResourceProvider.Common.Exceptions.ResourceProviderException: Error getting Pool. Rate limit exceeded for this endpoint - try again later ---> CloudVolumes.Service.Client.Client.ApiException: Error calling V2DescribePool: {\"code\":429,\"message\":\"Rate limit exceeded for this endpoint - try again later\"}`
   
   This response code can come from throttling or a temporary condition. See [Azure Resource Manager HTTP 429 response code](../azure-resource-manager/management/request-limits-and-throttling.md#error-code) for more information.

## Access the Azure NetApp Files REST API  

1. [Install the Azure CLI](/cli/azure/install-azure-cli) if you haven't done so already.
2. Create a service principal in your Azure Active Directory (Azure AD):
   1. Verify that you have [sufficient permissions](../active-directory/develop/howto-create-service-principal-portal.md#permissions-required-for-registering-an-app).

   2. Enter the following command in the Azure CLI: 
    
        ```azurecli
        az ad sp create-for-rbac --name $YOURSPNAMEGOESHERE --role Contributor --scopes /subscriptions/{subscription-id}
        ```

      The command output is similar to the following example:  

        ```output
        { 
            "appId": "appIDgoeshere", 
            "displayName": "APPNAME", 
            "name": "http://APPNAME", 
            "password": "supersecretpassword", 
            "tenant": "tenantIDgoeshere" 
        } 
        ```

      Keep the command output.  You will need the `appId`, `password`, and `tenant` values. 

3. Request an OAuth access token:

    The examples in this article use cURL. You can also use various API tools such as [Postman](https://www.getpostman.com/), [Insomnia](https://insomnia.rest/), and [Paw](https://paw.cloud/).  

    Replace the variables in the following example with the command output from Step 2 above. 
    
    ```azurecli
    curl -X POST -d 'grant_type=client_credentials&client_id=[APP_ID]&client_secret=[PASSWORD]&resource=https%3A%2F%2Fmanagement.azure.com%2F' https://login.microsoftonline.com/[TENANT_ID]/oauth2/token
    ```

    The output provides an access token similar to the following example:

    `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSIsImtpZCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSJ9`

    The displayed token is valid for 3600 seconds. After that, you need to request a new token. 
    Save the token to a text editor.  You will need it for the next step.

4. Send a test call and include the token to validate your access to the REST API:

    ```azurecli
    curl -X GET -H "Authorization: Bearer [TOKEN]" -H "Content-Type: application/json" https://management.azure.com/subscriptions/[SUBSCRIPTION_ID]/providers/Microsoft.Web/sites?api-version=2022-05-01
    ```

## Examples using the API  

This article uses the following URL for the baseline of requests. This URL points to the root of the Azure NetApp Files namespace. 

`https://management.azure.com/subscriptions/SUBIDGOESHERE/resourceGroups/RESOURCEGROUPGOESHERE/providers/Microsoft.NetApp/netAppAccounts?api-version=2022-05-01`

You should replace the `SUBIDGOESHERE` and `RESOURCEGROUPGOESHERE` values in the following examples with your own values. 

### GET request examples

You use a GET request to query objects of Azure NetApp Files in a subscription, as the following examples show: 

```azurecli
#get NetApp accounts 
curl -X GET -H "Authorization: Bearer TOKENGOESHERE" -H "Content-Type: application/json" https://management.azure.com/subscriptions/SUBIDGOESHERE/resourceGroups/RESOURCEGROUPGOESHERE/providers/Microsoft.NetApp/netAppAccounts?api-version=2022-05-01
```

```azurecli
#get capacity pools for NetApp account 
curl -X GET -H "Authorization: Bearer TOKENGOESHERE" -H "Content-Type: application/json" https://management.azure.com/subscriptions/SUBIDGOESHERE/resourceGroups/RESOURCEGROUPGOESHERE/providers/Microsoft.NetApp/netAppAccounts/NETAPPACCOUNTGOESHERE/capacityPools?api-version=2022-05-01
```

```azurecli
#get volumes in NetApp account & capacity pool 
curl -X GET -H "Authorization: Bearer TOKENGOESHERE" -H "Content-Type: application/json" https://management.azure.com/subscriptions/SUBIDGOESHERE/resourceGroups/RESOURCEGROUPGOESHERE/providers/Microsoft.NetApp/netAppAccounts/NETAPPACCOUNTGOESHERE/capacityPools/CAPACITYPOOLGOESHERE/volumes?api-version=2022-05-01
```

```azurecli
#get snapshots for a volume 
curl -X GET -H "Authorization: Bearer TOKENGOESHERE" -H "Content-Type: application/json" https://management.azure.com/subscriptions/SUBIDGOESHERE/resourceGroups/RESOURCEGROUPGOESHERE/providers/Microsoft.NetApp/netAppAccounts/NETAPPACCOUNTGOESHERE/capacityPools/CAPACITYPOOLGOESHERE/volumes/VOLUMEGOESHERE/snapshots?api-version=2022-05-01
```

### PUT request examples

You use a PUT request to create new objects in Azure NetApp Files, as the following examples show. The body of the PUT request can include the JSON formatted data for the changes. It must be included in the curl command as text or references as a file. To reference the body as a file, save the json example to a file and add `-d @<filename>` to the curl command.

```azurecli
#create a NetApp account  
curl -d @<filename> -X PUT -H "Authorization: Bearer TOKENGOESHERE" -H "Content-Type: application/json" https://management.azure.com/subscriptions/SUBIDGOESHERE/resourceGroups/RESOURCEGROUPGOESHERE/providers/Microsoft.NetApp/netAppAccounts/NETAPPACCOUNTGOESHERE?api-version=2022-05-01
```

```azurecli
#create a capacity pool  
curl -d @<filename> -X PUT -H "Authorization: Bearer TOKENGOESHERE" -H "Content-Type: application/json" https://management.azure.com/subscriptions/SUBIDGOESHERE/resourceGroups/RESOURCEGROUPGOESHERE/providers/Microsoft.NetApp/netAppAccounts/NETAPPACCOUNTGOESHERE/capacityPools/CAPACITYPOOLGOESHERE?api-version=2022-05-01
```

```azurecli
#create a volume  
curl -d @<filename> -X PUT -H "Authorization: Bearer TOKENGOESHERE" -H "Content-Type: application/json" https://management.azure.com/subscriptions/SUBIDGOESHERE/resourceGroups/RESOURCEGROUPGOESHERE/providers/Microsoft.NetApp/netAppAccounts/NETAPPACCOUNTGOESHERE/capacityPools/CAPACITYPOOLGOESHERE/volumes/MYNEWVOLUME?api-version=2022-05-01
```

```azurecli
 #create a volume snapshot  
curl -d @<filename> -X PUT -H "Authorization: Bearer TOKENGOESHERE" -H "Content-Type: application/json" https://management.azure.com/subscriptions/SUBIDGOESHERE/resourceGroups/RESOURCEGROUPGOESHERE/providers/Microsoft.NetApp/netAppAccounts/NETAPPACCOUNTGOESHERE/capacityPools/CAPACITYPOOLGOESHERE/volumes/MYNEWVOLUME/Snapshots/SNAPNAME?api-version=2022-05-01
```

### JSON examples

The following example shows how to create a NetApp account:

```json
{ 
    "name": "MYNETAPPACCOUNT", 
    "type": "Microsoft.NetApp/netAppAccounts", 
    "location": "westus2", 
    "properties": { 
        "name": "MYNETAPPACCOUNT" 
    }
} 
```

The following example shows how to create a capacity pool: 

```json
{
    "name": "MYNETAPPACCOUNT/POOLNAME",
    "type": "Microsoft.NetApp/netAppAccounts/capacityPools",
    "location": "westus2",
    "properties": {
        "name": "POOLNAME",
        "size": "4398046511104",
        "serviceLevel": "Premium"
    }
}
```

The following example shows how to create a new volume. (The default protocol for the volume is NFSV3.) 

```json
{
    "name": "MYNEWVOLUME",
    "type": "Microsoft.NetApp/netAppAccounts/capacityPools/volumes",
    "location": "westus2",
    "properties": {
        "serviceLevel": "Premium",
        "usageThreshold": "322122547200",
        "creationToken": "MY-FILEPATH",
        "snapshotId": "",
        "subnetId": "/subscriptions/SUBIDGOESHERE/resourceGroups/RESOURCEGROUPGOESHERE/providers/Microsoft.Network/virtualNetworks/VNETGOESHERE/subnets/MYDELEGATEDSUBNET.sn"
         }
}
```

The following example shows how to create a snapshot of a volume: 

```json
{
    "name": "apitest2/apiPool01/apiVol01/snap02",
    "type": "Microsoft.NetApp/netAppAccounts/capacityPools/Volumes/Snapshots",
    "location": "westus2",
    "properties": {
         "name": "snap02",
        "fileSystemId": "0168704a-bbec-da81-2c29-503825fe7420"
    }
}
```

> [!NOTE] 
> You need to specify `fileSystemId` for creating a snapshot.  You can obtain the `fileSystemId` value with a GET request to a volume. 

## Next steps

[See the Azure NetApp Files REST API reference](/rest/api/netapp/)
