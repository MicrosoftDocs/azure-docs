---
title: Azure Resource Graph GET/LIST API Guidance
description: Learn to use the GET/LIST API to avoid requests being throttled in Azure Resource Graph.
ms.date: 05/14/2025
ms.topic: conceptual
ms.custom: devx-track-csharp
---

# Azure Resource Graph (ARG) GET/LIST API 

ARG GET/LIST API significantly reduces READ throttling by serving all incoming GET and LIST calls against ARG platform with smart routing controls in control plane. The API aligns with the existing request and response contracts of Azure control plane APIs while addressing throttling issues for customers. 

ARG GET/LIST provides a default quota of 4k /min /user /subscription on a moving window. This is not a hard limit; we can support more than this based on scenario requirement. The API provides a response header “x-ms-user-quota-remaining" indicating remaining quota and "x-ms-user-quota-resets-after" indicating the time for a full quota reset based on which you can understand your quota consumption.  

> [!NOTE]
> Please keep in mind that the Azure Resource Manager (ARM) quota applies to these calls. Read about the ARM limits here : Understand how Azure Resource Manager throttles requests - Azure Resource Manager | Microsoft Learn. Refer to section "Migrating to regional throttling and token bucket algorithm" , these are the new limits which ARM follows for Azure Public cloud.  

## Using the ARG GET/LIST API 

Using the ARG GET/LIST API is very straightforward. If you feel your scenario matches the conditions mentioned [here](./guidance-for-throttled-requests.md#arg-getlist-api), you can simply append the flag `&useResourceGraph=true` to your control plane API calls, and the request will be routed to the ARG GET/LIST API backend.  

Contact the ARG product group by sending an email to Azure Resource Graph team sharing a brief overview of your scenario and the ARG team will reach out to you with next steps. Callers must also design appropriate retry logic and implement fallback mechanisms to ensure smooth and reliable experience. This opt-in model has been deliberately chosen to allow the Azure Resource Graph team to better understand customer usage patterns and make improvements as needed. 

Refer to some known limitations [here](#known-limitations) and [frequently asked questions](#frequently-asked-questions).

## ARG GET/LIST API Contract  

### Resource Point Get 

This request is used for looking up a single resource by providing resource Id. 

**Traditional Point Get Request:**

GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/{providerNamespace}/{resourceType}/{resourceName}?api-version={apiVersion} 

**ARG Point Get Request:**

GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/{providerNamespace}/{resourceType}/{resourceName}?api-version={apiVersion}&**useResourceGraph=true** 

## Subscription Collection Get

This request is used for listing all resources under a single resource type in a subscription. 

**Traditional Subscription Collection Get Request:**

GET https://management.azure.com/subscriptions/{subscriptionId}/providers/{providerNamespace}/{resourceType}?api-version={apiVersion} 

**ARG Subscription Collection Get Request:**

GET https://management.azure.com/subscriptions/{subscriptionId}/providers/{providerNamespace}/{resourceType}?api-version={apiVersion}&**useResourceGraph=true** 

## Resource Group Collection Get

This request is used for listing all resources under a single resource type in a resource group. 

**Traditional Point Get Request:**

GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/{providerNamespace}/{resourceType}?api-version={apiVersion} 

**ARG GET/LIST Point Get Request:**

GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/{providerNamespace}/{resourceType}?api-version={apiVersion}&**useResourceGraph=true** 

## Some frequently used examples

### Scenario: Get VM with InstanceView 

For this specific example, use the following requests to get a virtual machine with InstanceView.

#### ARG GET/LIST Request

HTTP GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft.compute/virtualmachines/{vm}?api-version=2024-07-01&$expand=instanceView&useResourceGraph=true 

#### ARG Query 

Resources 

| where type =~ 'microsoft.compute/virtualmachines'  
| where id = ~ '/subscriptions/{subscriptionId}<br>/resourceGroups/{resourceGroup}/providers/microsoft.compute/virtualmachines/{vm}' 

#### CRP Request 

HTTP GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft.compute/virtualmachines/{vm}?api-version=2024-07-01&$expand=instanceView 


### List VMs under ResourceGroup 

For this specific example, use the following requests to retrieve the list of virtual machines under the resource group. 

#### ARG GET/LIST Request 

HTTP GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft.compute/virtualmachines?api-version=2024-07-01&$expand=instanceView&useResourceGraph=true 

#### ARG Query 

Resources 

| where resourceGroup =~ ‘{resourceGroup}’ 

| where type =~ 'microsoft.compute/virtualmachines' 

### CRP Request 

HTTP GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft.compute/virtualmachines?api-version=2024-07-01 

### List VMSS VM (Uniform) with InstanceView 

#### ARG GET/LIST Request 

HTTP GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft.compute/virtualmachinescalesets/{vmss}/virtualmachines?api-version=2024-07-01&$expand=instanceView&useResourceGraph=true 

#### ARG Query 

ComputeResources 

| where type =~ 'microsoft.compute/virtualmachinescalesets/virtualmachines' 

| where id startswith ‘/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft.compute/virtualmachinescalesets/{vmss}’ 

### CRP Request 

HTTP GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft.compute/virtualmachinescalesets/{vmss}/virtualmachines?api-version=2024-07-01&$expand=instanceView 

## List VMSS VM (Flex) with InstanceView 

For this specific example, use the following requests to retrieve the list of VMSS VM with InstanceView.

### ARG GET/LIST Request 

HTTP GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft.compute/virtualmachinescalesets/{vmss}/virtualmachines?api-version=2024-07-01&$filter=’virtualMachineScaleSet/id’ eq ‘/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft.compute/virtualmachinescalesets/{vmss}’&$expand=instanceView&useResourceGraph=true 

### ARG Query 

Resources 

| where type =~ ‘microsoft.compute/virtualmachines’ 

| where properties.virtualMachineScaleSet.id =~‘/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft.compute/virtualmachinescalesets/{vmss}’ 

### CRP Request 

HTTP GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft.compute/virtualmachines?api-version=2024-07-01&$expand=instanceView&$filter=’virtualMachineScaleSet/id’ eq ‘/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft.compute/virtualmachinescalesets/{vmss}’ 

### List storage accounts in subscription 

For this specific example, use the following requests to retrieve the list of storage accounts in the subscription.

#### ARG GET/LIST request 

HTTP GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft.storage/storageAccounts?api-version=2024-01-01&useResourceGraph=true 

#### ARG Query 

Resources 

| where type =~ ‘microsoft.storage/storageAccounts’ 

#### SRP request 

HTTP GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/microsoft.storage/storageAccounts?api-version=2024-01-01 


## Known Limitations  

1. **VMSS VM Health status** is not supported by default. If you have a requirement for that, do let us know by emailing Azure Resource Graph team. 
2. **Supported Resources** - The ARG GET/LIST API supports resources part of  ‘resources’ and ‘computeresources’ table. If you have a requirement for a specific resource type outside of these tables do let us know by emailing Azure Resource Graph team. 
3. **Single API Version Support** - ARG GET/LIST today only supports a single API version for each resource type. This is generally the latest non-preview version of the type that exists in the Azure REST API spec. The `api-version` parameter in the request URL is ignored by ARG GET/LIST today. ARG GET/LIST returns `apiVersion` field in resource payloads in responses; this is the version that ARG GET/LIST indexed the resource in. Callers can leverage this field to understand the apiVersion to use , if its relevant for their scenario.  
4. **Client Support** - Azure REST API: Supported | Azure SDK: Supported [sample .NET code shared below](#sample-sdk-code)| PowerShell: Currently not supported | Azure CLI: Currently not supported | Azure Portal: Currently not supported 
5. **Client Deserialization Concerns**
    - If a client uses REST API to issue GET calls, there should generally be no concerns regarding deserialization due to API version differences. 
    - If a client uses Azure SDK to issue GET calls, due to relaxed deserialization setting across all languages, the deserialization issue should not be a concern, unless there are contract breaking changes among different versions for the target resource type. 
6. **Unprocessable Resource Request**
    - There are rare scenarios where ARG GET/LIST is not able to index a resource correctly, other than the existence of the resource. To not sacrifice data quality, ARG GET/LIST will refuse serving GET calls for these resources and return an error code of HTTP 422. 
    - Clients of ARG GET/LIST should treat HTTP 422 as a permanent error. Clients should retry by falling back to RP (by removing useResourceGraph=true flag). Since the error is applicable specifically to ARG GET/LIST, fallback to RPs should result in an E2E success. 
7. **Consistency** 
    - As an index of Azure resources, ARG GET/LIST ingests the latest updates within seconds. ARG GET/LIST therefore provides a strict bounded staleness consistency level for all resources. This differs from the strong consistency model of Resource Providers. 
    - In resource Point Get responses, ARG GET/LIST provides a response header x-ms-arg-snapshot-timestamp that indicates the timestamp when the returned resource snapshot was indexed. The value of the header is UTC time in ISO8601 format. (An example, "x-ms-arg-snapshot-timestamp" : "2023-01-20T18:55:59.5610084Z"). 
    
### Sample SDK code

The following is a .NET Code sample to call ARG GET/LIST API by creating an ARMClient with policy that adds the flag `useResourceGraph=true` to each call:

First, We create custom ArmClientOption with policy that adds the `useResourceGraph=True` flag per call: 

```bicep
var ArmClientOptions = new ArmClientOptions(); 

ArmClientOptions.AddPolicy(new ARG GET/LISTHttpPipelinePolicy(),  

HttpPipelinePosition.PerCall); 

```

Then, we create ArmClient using the custom ArmClientOptions:

```bicep
ArmClient client = new ArmClient(new DefaultAzureCredential(), null,  

ArmClientOptions);
```

What if we want to create an ARMClient using a default subscription? We would set the ArmClient client value to:

```bicep
new ArmClient(new DefaultAzureCredential(), defaultSubId,  
ArmClientOptions); 
```

Then use this policy to add query parameters for every request through the client:

internal class ARG GET/LISTHttpPipelinePolicy : HttpPipelineSynchronousPolicy 

```bicep
{ 
 public override void OnSendingRequest(HttpMessage message) 
 { 
 // Adds the required query param to explicitly query ARG GET/LIST  
 message.Request.Uri.AppendQuery("useResourceGraph", bool.TrueString); 
} 
}
```

## Frequently asked questions  

1. How do you ensure the response is returned by ARG GET/LIST API? 

There are a few ways that you can identify when a request is served by ARG GET/LIST:  
- In the response body, the `apiVersion` field of resources will be populated, if served by ARG GET/LIST.  
- ARG GET/LIST/ARG returns some additional response headers, some of which are:   
    - x-ms-arg-snapshot  
    - x-ms-user-quota-remaining  
    - x-ms-user-quota-resets-after  
    - x-ms-resource-graph-request-duration  

2. How do you know which API version was used by ARG GET/LIST? 

This is returned in “apiVersion” field in resource response today.  

3. What happens if a caller calls ARG GET/LIST API with `useResourceGraph=true` flag for a resource not supported by ARG GET/LIST?   

Any unsupported/unroutable requests will result in `useResourceGraph=true` ignored and the call will be automatically routed to be Resource Provider. User does not have to take any action.   

4. What permissions are required for querying ARG GET/LIST APIs? 

No special permissions are required for ARG GET/LIST APIs; ARG GET/LIST APIs are equivalent to native Resource provider based GET APIs and therefore, standard RBAC applies. Callers need to have at least READ permissions to resources/scopes they are trying to access.  

5. What is the rollback strategy, if we find issues while using ARG GET/LIST APIs?   

If onboarded through the flag `useResourceGraph=true`, the caller may choose to remove the flag (or) `useResourceGraph=false` and the call will be automatically routed to be Resource Provider.  

6. What if you're getting a 404 Not Found when trying to get a resource from ARG GET/LIST that was recently created? 

This is a common scenario with a lot of services where customers create resources and immediately issue a GET in 1-2 secs as part of another WRITE workflow. For example - customers create a new resource and right after trying to create a metric alert that monitors it. The resource might not have been indexed by ARG GET/LIST yet. There are 2 ways to work around this:
- Retry on ARG GET/LIST a few times until it returns status code 200.  
- Retry without ARG GET/LIST flag to fall back on the RP. True 404s will not hit the RP since ARM will return the error directly, whereas a false 404 should be served by RPs to get actual data. 