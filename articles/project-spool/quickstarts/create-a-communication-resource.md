---
title: Create a communication resource
description: This document covers different ways to create a spool resource.
author: mikben    
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 05/27/2020
ms.topic: overview
ms.service: azure-project-spool

---
# to do
- which regions are we deployed in
- python example
- more pictures for portal


# Create an Azure Communication Resource
This page walks through different ways you can create a communication resource and 

## Azure portal

1. To create an Azure Communication Services resource, first sign in to the [Azure portal](https://portal.azure.com). In the upper-left side of the page, select **+ Create a resource**. In the **Search the Marketplace** text box, enter **Azure Communication Service**.

2. Select **Azure Communication Service** in the results, and select **Create**. 

3. On the new **Azure Communication Service** settings page, add the following settings for your new Azure Communication Service

4. Select **Create**. The deployment might take a few minutes to complete

5. After the deployment is complete, Select **Keys**  under **Settings**. Copy your connection string for the primary key. You'll use this string later to configure your app to use the Azure Communication Service resource. 



## ARM Client
This guide uses [ArmClient](https://github.com/projectkudu/ARMClient) for interacting with the Azure Resource Manager APIs, and it is the recommended approach.

 **ARM (Azure Resource Manager)** is a service that sits between the developer and the resources behind the scenes. ARM provides an API service that allows you to interact with your resources however you'd like. This allows you to control, deploy, and organize resources in your resource groups in a consistent manner. 

1. Login to the the Azure Resource Manager service by using the `armclient login` command:

```ps
$ armclient login
```

This should get the response in the format

```
Welcome user@example.com (Tenant: YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY)
User: user@microsoft.com, Tenant: YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY (MSFT.ccsctp.net)
        There are 1 subscriptions
        Subscription XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXX
```

Take note of your **Subscription** ID you want to use above, you'll need it in subsequent steps.

2. Register the subscription with the resource Provider:

For the `{subcriptionId}` use the Subscription GUID from step #1

```ps
$ armclient post subscriptions/{subscriptionId}/providers/Microsoft.SpoolService/register?api-version=2019-10-01
```

Verify that the *spools* resource type is in the list of resource types in the response. The response also indicates which regions are currently supported for the resource. If *spools* is not in the list then your subscription is not on the allowlist

3. Create a **resource group** to contain you Spool resources. A resource group is a set of assets or resources together. This is useful to provision, manage and deploy specific subsets of resources. All resources must be associated with a resource group.

For the `{subcriptionId}` use the Subscription GUID from step #1, for `{resourceGroupName}` use any name you'd like, for example: 'SpoolTestGroup'.

For the `{region}` at this time, `westus2` is the only supported region for Spool resources.

```ps
$ armclient put subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}?api-version=2019-05-10 "{'location':'{region}'}"
```

This should get the response in the format

```json
{
  "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}",
  "name": "SpoolTestGroup",
  "type": "Microsoft.Resources/resourceGroups",
  "location": "{region}",
  "properties": {
    "provisioningState": "Succeeded"
  }
}
```

2. Create a new Spool resource in Azure. This will create an instance of Spool inside of your resource group that you created above. 

The `{resourceName}` must be a unique name within the Azure region.

If you get an error `InvalidResourceType`, it's possible that the Azure subscription you're using has not been placed on the allow list for Spool resources. Ask your Microsoft contact to add it!

Use the same `{subcriptionId}` and `{resourceGroupName}` as above, use any `{resourceName}` you'd like. The resourceName must be unique within the region across all customers and must use only utf-8 characters, so if you get an error stating that the name is not available try another name.

```ps
$ armclient put subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.SpoolService/spools/{resourceName}?api-version=2019-10-10-preview "{'location':'{region}'}"
```

This should get the response in the format

```json
{
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.SpoolService/spools/{resourceName}",
    "name": "{resourceName}",
    "type": "Microsoft.SpoolService/spools",
    "location": "{region}",
    "properties": {
        "provisioningState": "Succeeded",
        "hostName": "{resourceName}.{region}.spool.azure.net"
    }
}
```

## Powershell

Create a new communication resource or update an existing Spool service.

### EXAMPLES

#### Example 1: Create Default Resource
```powershell
PS C:\> New-AzSpool -Name MySpool -ResourceGroupName MyRg -Location westus2

Location Name     Type
-------- ----     ----
westus2  MySpool  Microsoft.SpoolService/spools
```

Creates a new spool resource using only default values.

#### Example 2: Create Fully Specified Resource
Creates a new communication service with tags.

```powershell
PS C:\> New-AzSpool -Name MyNewComm -ResourceGroupName MyRg -SubscriptionId 00000000-0000-0000-0000-000000000000 -Location westus2 -Tag @{
>> FirstTag = 'FirstTagValue'
>> SecondTag = 'SecondTagValue'
}

Location Name     Type
-------- ----     ----
westus2  MySpool  Microsoft.SpoolService/spools
```

## C#

## Javascript

## Java

## Go

## Related content


