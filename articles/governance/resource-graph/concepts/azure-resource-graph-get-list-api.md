---
title: Azure Resource Graph GET/LIST API Guidance (Preview)
description: Learn to use the GET/LIST API to avoid requests being throttled in Azure Resource Graph.
ms.date: 05/14/2025
ms.topic: conceptual
ms.custom: devx-track-csharp
---

# Azure Resources Graph (ARG) GET/LIST API 

The ARG GET/LIST API is designed to significantly reduce READ throttling by offloading GET and LIST requests to an alternate ARG platform. This action is achieved through intelligent control plane routing, which directs requests to the alternate platform when a specific parameter is present. If the parameter is absent, requests are seamlessly routed back to the original Resource Provider, ensuring flexibility.

ARG GET/LIST provides a default quota of 4k per minute, user, and subscription, on a moving window, which means that the default quota of 4k per minute allows you to make up to 4,000 requests per minute using these APIs. This quota is enforced per user per subscription. This means:
- If User A is accessing Subscription X, they get up to 4,000 requests per minute.
- If User A accesses Subscription Y, that’s a separate quota.
- If User B accesses Subscription X, that’s also a separate quota.
- The API provides a response header “x-ms-user-quota-remaining" indicating remaining quota and "x-ms-user-quota-resets-after" indicating the time for a full quota reset based on which you can understand your quota consumption.  

> [!NOTE]
> Keep in mind that the Azure Resource Manager quota applies to these calls. Read about the [Azure Resource Manager limits](../../../azure-resource-manager/management/request-limits-and-throttling.md#azure-resource-graph-throttling), which are the new limits that Azure Resource Manager follows for Azure Public cloud.  

## Using the ARG GET/LIST API 

To use the [ARG GET/LIST API](./guidance-for-throttled-requests.md#arg-getlist-api), first identify whether or not your scenario matches the conditions mentioned in the guidance for throttled requests. You can then append the flag `&useResourceGraph=true` to your applicable GET/LIST API calls, which routes the request to this ARG backend for response.

While the `useResourceGraph` flag will function as expected, we recommend sharing a brief summary of your scenario via email to [Azure Resource Graph team](mailto:azureresourcegraphsupport@microsoft.com). This will help the Azure Resource Graph (ARG) team better understand your use case and provide appropriate guidance. 

 This opt-in model was deliberately chosen to allow the Azure Resource Graph team to better understand customer usage patterns and make improvements as needed. 

Refer to some known limitations [here](#known-limitations) and [frequently asked questions](#frequently-asked-questions).

## ARG GET/LIST API Contract  

### Resource Point Get 

This request is used for looking up a single resource by providing resource D. 

**Traditional Point Get Request:**

```api 
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/{providerNamespace}/{resourceType}/{resourceName}?api-version={apiVersion} 
```

**ARG Point Get Request:**

```api
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/{providerNamespace}/{resourceType}/{resourceName}?api-version={apiVersion}&useResourceGraph=true 
```

## Subscription Collection Get

This request is used for listing all resources under a single resource type in a subscription. 

**Traditional Subscription Collection Get Request:**

```api
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/{providerNamespace}/{resourceType}?api-version={apiVersion} 
```

**ARG Subscription Collection Get Request:**

```api
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/{providerNamespace}/{resourceType}?api-version={apiVersion}&useResourceGraph=true 
```

## Resource Group Collection Get

This request is used for listing all resources under a single resource type in a resource group. 

**Traditional Point Get Request:**

```api
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/{providerNamespace}/{resourceType}?api-version={apiVersion} 
```

**ARG GET/LIST Point Get Request:**

```api
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/{providerNamespace}/{resourceType}?api-version={apiVersion}&useResourceGraph=true 
```
> [!NOTE]
> The API-version parameter is mandatory for all Azure Resource Graph GET/LIST API calls. However, the value of this parameter is ignored by the service. Regardless of the api-version specified, ARG always returns results based on the latest generally available (GA) non-preview version of the API.

## Some frequently used examples

### Scenario: Get virtual machine (VM) with InstanceView 

For this specific example, use the following requests to get a virtual machine with InstanceView.

#### ARG GET/LIST Request

```api
HTTP GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft.compute/virtualmachines/{vm}?api-version=2024-07-01&$expand=instanceView&useResourceGraph=true 
```

### List VMs under ResourceGroup 

For this specific example, use the following requests to retrieve the list of virtual machines under the resource group. 

#### ARG GET/LIST Request 

```api
HTTP GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft.compute/virtualmachines?api-version=2024-07-01&$expand=instanceView&useResourceGraph=true 
```

### List VMSS VM (Uniform) with InstanceView 

For this specific example, use the following request to retrieve the list of VMSS VM with InstanceView. This scenario is for VMSS VM in Flexible orchestration mode.

#### ARG GET/LIST Request 

```api
HTTP GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft.compute/virtualmachinescalesets/{vmss}/virtualmachines?api-version=2024-07-01&$expand=instanceView&useResourceGraph=true 
```

## List VMSS VM (Flex) with InstanceView 

For this specific example, use the following requests to retrieve the list of VMSS VM with InstanceView.

### ARG GET/LIST Request 

```api
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft.compute/virtualmachines?api-version=2024-07-01&$filter='virtualMachineScaleSet/id' eq '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft.compute/virtualmachinescalesets/{vmss}'&$expand=instanceView&useResourceGraph=true
```

### List storage accounts in subscription 

For this specific example, use the following requests to retrieve the list of storage accounts in the subscription.

#### ARG GET/LIST request 

```api
HTTP GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft.storage/storageAccounts?api-version=2024-01-01&useResourceGraph=true 
```

## Known Limitations  

- **VMSS VM health status** isn't currently supported. If you require this data, you can share your scenario and propose the feature addition on our [feedback forums](https://feedback.azure.com/d365community/forum/675ae472-f324-ec11-b6e6-000d3a4f0da0).
- **VM and VMSS VM extensions** - The running states of VM and VMSS VM extensions isn't supported. If you require this data, you can share your scenario and propose the feature addition on our  [feedback forums](https://feedback.azure.com/d365community/forum/675ae472-f324-ec11-b6e6-000d3a4f0da0).
- **Supported resources** - The ARG GET/LIST API supports all resource types as part of the [`resources`](../reference/supported-tables-resources.md#resources) and [`computeresources`](../reference/supported-tables-resources.md#computeresources) table.  If you require a resource type that isn't part of these tables, you can share your scenario and propose the feature addition on our [feedback forums](https://feedback.azure.com/d365community/forum/675ae472-f324-ec11-b6e6-000d3a4f0da0).
- **Single API version support** - ARG GET/LIST today only supports a single API version for each resource type, which is generally the latest non-preview version of the type that exists in the Azure REST API spec. The ARG GET/LIST functionality returns the `apiVersion` field in the resource payload of the response that indicates the version of the resource type that was used when retrieving the resource details. Callers can apply this field to understand the API version to use, if its relevant for their scenario.  
- **Client support** 
    - Azure REST API: Supported
    - Azure SDK: Supported [sample .NET code](#sample-sdk-code)
    - PowerShell: Currently not supported
    - Azure CLI: Currently not supported
    - Azure portal: Currently not supported 
- **Client deserialization concerns**
    - If a client uses REST API to issue GET calls, there should generally be no concerns regarding deserialization due to API version differences. 
    - If a client uses Azure SDK to issue GET calls, due to relaxed deserialization setting across all languages, the deserialization issue shouldn't be a concern, unless there are contract breaking changes among different versions for the target resource type. 
- **Unprocessable resource request**
    - There are rare scenarios where ARG GET/LIST isn't able to index a resource correctly, other than the existence of the resource. To not sacrifice data quality, ARG GET/LIST refuses to serve GET calls for these resources and returns an error code of HTTP 422. 
    - Clients of ARG GET/LIST should treat HTTP 422 as a permanent error. Clients should retry by falling back to the resource provider (by removing `useResourceGraph=true` flag). Since the error is applicable specifically to ARG GET/LIST, fallback to resource providers should result in an E2E success. 
- **Supported consistency level** 
    - When using ARG GET or LIST, the data you receive reflects recent changes with a slight delay—typically just a few seconds—rather than real-time updates. This is known as 'bounded staleness' and ensures fast, scalable queries while still providing a consistent and up-to-date view of your Azure resources. Unlike direct calls to Resource Providers, which guarantee real-time accuracy (strong consistency), ARG is optimized for performance with predictable, near-real-time data. 
    - In resource Point Get responses, ARG GET/LIST provides a response header x-ms-arg-snapshot-timestamp that indicates the timestamp when the returned resource snapshot was indexed. The value of the header is UTC time in ISO8601 format. (An example, "x-ms-arg-snapshot-timestamp" : "2023-01-20T18:55:59.5610084Z"). 
    
### Sample SDK code

The following example is a .NET Code sample to call ARG GET/LIST API by creating an ARMClient with policy that adds the flag `useResourceGraph=true` to each call:

First, we create custom ArmClientOption with policy that adds the `useResourceGraph=True` flag per call: 

```bicep
var armClientOptions = new ArmClientOptions(); armClientOptions.AddPolicy(new ArgGetListHttpPipelinePolicy(), HttpPipelinePosition.PerCall); 
```

Then, we create ArmClient using the custom ArmClientOptions:

```bicep
ArmClient resourceGraphClient = new ArmClient(new DefaultAzureCredential(), null, armClientOptions); 
```

What if we want to create an ARMClient using a default subscription? We would set the ArmClient client value to:

```bicep
ArmClient resourceGraphClient = new ArmClient(new DefaultAzureCredential(), defaultSubId, armClientOptions);
```

Optionally, to create a default client that doesn't add the `useResourceGraph` flag, the client code chooses which client to use based on the specific scenario and needs. To do so, use the following code block:
 
```bicep
ArmClient defaultClient = new ArmClient(new DefaultAzureCredential(), null, new ArmClientOptions()); 
```

Then use this policy to add query parameters for every request through the client:

```bicep
internal class ArgGetListHttpPipelinePolicy : HttpPipelineSynchronousPolicy 

{ 
    private static const string UseResourceGraph = "useResourceGraph"; 
    public override void OnSendingRequest(HttpMessage message) 

    { 
        // Adds the required query parameter to explicitly query ARG GET/LIST if the flag is not already present 
        if (!message.Request.Uri.ContainsQuery(UseResourceGraph)) 
        { 
          message.Request.Uri.AppendQuery(UseResourceGraph, bool.TrueString); 
        } 
    } 
} 
```

## Frequently asked questions  

- How do you ensure the response is returned by the ARG GET/LIST API? 

    There are a few ways that you can identify when a request the ARG GET/LIST:  
    - In the response body, the `apiVersion` field of resources will be populated, if served by ARG GET/LIST.  
    - ARG GET/LIST/ARG returns some more response headers, some of which are:   
        - x-ms-arg-snapshot  
        - x-ms-user-quota-remaining  
        - x-ms-user-quota-resets-after  
        - x-ms-resource-graph-request-duration  

- How do you know which API version was used by ARG GET/LIST? 

    This value is returned in `apiVersion` field in resource response today.  

- What happens if a caller calls ARG GET/LIST API with `useResourceGraph=true` flag for a resource not supported by ARG GET/LIST?   

    Any unsupported/unroutable requests result in `useResourceGraph=true` ignored, and the call is automatically routed to the resource provider. The user doesn't have to take any action.   

- What permissions are required for querying ARG GET/LIST APIs? 

    No special permissions are required for ARG GET/LIST APIs; ARG GET/LIST APIs are equivalent to native resource provider based GET APIs and therefore, standard RBAC applies. Callers need to have at least READ permissions to resources/scopes they're trying to access.  

-  What is the rollback strategy, if we find issues while using ARG GET/LIST APIs?   

    If onboarded through the flag `useResourceGraph=true`, the caller may choose to remove the flag (or) set the value to `useResourceGraph=false`, and the call is automatically routed to the Resource Provider.  

- What if you're getting a 404 Not Found when trying to get a resource from ARG GET/LIST that was recently created? 

    This is a common scenario with many services where customers create resources and immediately issue a GET in 1-2 seconds part of another WRITE workflow. For example, customers create a new resource and right after trying to create a metric alert that monitors it. The resource might not have been indexed by ARG GET/LIST yet. There are two ways to work around this situation:
    - Retry on ARG GET/LIST a few times until it returns status code 200.  
    - Retry without ARG GET/LIST flag to fall back on the resource provider. True status code 404 doesn't hit the resource provider since Azure Resource Manager returns the error directly, whereas a false 404 should be served by the resource providers to get actual data. 

- What URI parameters are supported by the ARG GET/LIST API?

    The ARG GET/LIST API supports a range of URI parameters to help tailor and paginate query results. These include:
    Standard OData Pagination Parameters:
    - $top: Specifies the number of records to return.
    - $skip: Skips the specified number of records.
    - $skipToken: Used for retrieving the next page of results in paginated queries.
    
    Query Parameters for Virtual Machines and VMSS VMs -
    - statusOnly: statusOnly=true enables fetching run time status of all Virtual Machines in the subscription.
    - $expand=instanceView: The expand expression to apply on operation. 'instanceView' enables fetching run time status of all Virtual Machines, this can only be specified if a valid $filter option is specified
    - $filter: The system query option to filter VMs returned in the response. Allowed value is `virtualMachineScaleSet/id`
    eq 
    /subscriptions/{subId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmssName}

- What should I do if I encounter issues while using the useResourceGraph parameter when calling Azure Resource Graph?

    If you experience any issues while using the `useResourceGraph` parameter with ARG, create a support ticket under the Azure Resource Graph service in the [Azure portal](https://ms.portal.azure.com/#home) under **Help + Support.**