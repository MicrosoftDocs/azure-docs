---
author: mikben
ms.service: azure-communication-services
ms.topic: include
ms.date: 9/1/2020
ms.author: mikben
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- Download ARM Client found [here](https://github.com/projectkudu/ARMClient) to interact with Azure Resource Manager APIs/

## Using ARM Client

**ARM (Azure Resource Manager)** is a service that sits between the developer and the resources behind the scenes. ARM provides an API service that allows you to interact with your resources however you'd like. This allows you to control, deploy, and organize resources in your resource groups in a consistent manner. 

### Set Up ARM Client

1. Install the ARM Client if you have not already, you can find instructions for doing this on the [ARM Client's GitHub Page](https://github.com/projectkudu/ARMClient).

2. Login to the the Azure Resource Manager service by using the `armclient login` command:

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

3. Register the subscription with the resource Provider:

For the `{subscriptionId}` use the Subscription GUID from step #1

```ps
$ armclient post subscriptions/{subscriptionId}/providers/Microsoft.SpoolService/register?api-version=2019-10-01
```

Verify that the *spools* resource type is in the list of resource types in the response. The response also indicates which regions are currently supported for the resource. If *spools* is not in the list then your subscription is not on the allow list. Ask your Microsoft contact to add it!

4. Create a **resource group** to contain you Communication Services resources. A resource group is a set of assets or resources together. This is useful to provision, manage and deploy specific subsets of resources. All resources must be associated with a resource group.

5. For the `{subscriptionId}` use the Subscription GUID from Step 3, for `{resourceGroupName}` use any name you'd like, for example: 'ACSTestGroup'.

6. For the `{region}` at this time, `westus2` is the only supported region for Communication Services resources.

```ps
$ armclient put subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}?api-version=2019-05-10 "{'location':'{region}'}"
```

This should get the response in the format:

```json
{
  "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}",
  "name": "ACSTestGroup",
  "type": "Microsoft.Resources/resourceGroups",
  "location": "{region}",
  "properties": {
    "provisioningState": "Succeeded"
  }
}
```
### Create Azure Communications Resource with ARM Client

1. Create a new Azure Communication Services resource in Azure. This will create an instance of Communication Services inside of your resource group that you created above. 

The `{resourceName}` must be a unique name within the Azure region.

If you get an error `InvalidResourceType`, it's possible that the Azure subscription you're using has not been placed on the allow list for Communication Services resources. Ask your Microsoft contact to add it!

Use the same `{subscriptionId}` and `{resourceGroupName}` as above, use any `{resourceName}` you'd like. The resourceName must be unique within the region across all customers and must use only utf-8 characters, so if you get an error stating that the name is not available try another name.

```ps
$ armclient put subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.SpoolService/spools/{resourceName}?api-version=2019-10-10-preview "{'location':'{region}'}"
```

This should get the response in the format:

```json
{
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.SpoolService/spools/{resourceName}",
    "name": "{resourceName}",
    "type": "Microsoft.SpoolService/spools",
    "location": "{region}",
    "properties": {
        "provisioningState": "Succeeded",
        "hostName": "{resourceName}.{region}.communications.azure.net"
    }
}
```