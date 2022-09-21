---
title: Product Ingestion API for the commercial marketplace
description: The Product Ingestion API is a modernized API for the commercial marketplace that unifies all existing APIs.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: iqshahmicrosoft
ms.author: iqshah
ms.reviewer: amhindma
ms.date: 06/17/2022
---

# Product Ingestion API for the commercial marketplace

The _Product Ingestion API_ is a modernized API for the commercial marketplace that unifies all existing APIs. The API lets you create and manage resources associated with products and plans within your Partner Center account. It uses a declarative pattern to submit requests, in which the desired state is indicated as opposed to specifying the individual steps to reach the desired state. It can be accessed using the [MSGraph API](/graph/overview) under the workload name “_product-ingestion_”. The base URL is `https://graph.microsoft.com/rp/product-ingestion`.

This article provides guidance on how to use the APIs for all commercial marketplace offer types. For guidance specific to your offer, review [API guidance per offer type](#api-guidance-per-offer-type).

## Concepts

Before you get started, you need to understand some basic concepts.

### Resources

The API is structured around resource types, where each type is described using a dedicated schema definition as referenced by the “_$schema_” property. The schema consists of the configuration properties of that resource. Resources are fundamental in creating and updating the configuration of various aspects of a given product. For a full list of resource types and their schemas, see the [Resource API reference](#resource-api-reference).

### Durable ID

A _durable ID_ is a global identifier used to uniquely identify any resource. Every resource has an associated "_id_" property, which when combined with the resource type name, makes up a resource’s durable ID. The durable ID is used when referencing resources to either retrieve or modify.

### External ID

An _external ID_ is another unique identifier that can be used to reference specific products or plans. This is an alternative way to reference these resources instead of using the durable ID. The external ID of a product translates to its “_offerID_” and the external ID of a plan translates to its “_planID_”, as defined upon creation.

### API Methods

There are four management APIs that can be used to perform different actions, such as querying existing resources, making configuration updates, and checking the status of a request.

| API Type | Description | HTTP Method & Path |
| ------------ | ------------- | ------------- |
| [Query](#retrieve-existing-resource-configurations) | Retrieves existing resources by:<br>1) “_resource-tree_” resource type<br>2) the durable-id<br>3) query string parameters | Method 1: `GET resource-tree/<product-durableId>`<br>Method 2: `GET <resource-durableId>`<br>Method 3: `GET <resourceType>?<query parameters>` |
| [Configure submit](#configuration-requests) | Submits requests to create or update one or more resources. Upon successful processing, a jobId is returned, which can be used to retrieve the status of the request. This API type can be used to update the draft state as well as publish changes, sync private audiences, and modify the resource lifecycle state. | `POST configure` |
| [Configure status](#status-of-a-pending-request) | Retrieves the status of a pending request via the jobId.| `GET configure/<jobId>/status` |
| [Configure status details](#summary-of-a-completed-request) | Retrieves a detailed summary of a completed request, including the updated resources, via the jobId. | `GET configure/<jobId>/status` |

## A typical workflow

To update an existing resource, a typical workflow would be to:
1. Retrieve an existing resource configuration (API type: Query)*
1. Make any necessary updates and then submit a configuration request (API type: Configure submit)
1. Check the status of the request (API type: _Configure status_ & _Configure status details_)

<sup>`*`</sup> This same workflow can be applied when creating new resources, but instead of retrieving resources (Step 1), use the [Resource API reference](#resource-api-reference) table to ensure that you're using the current schema for the resource type that you're creating.
To summarize, this image shows the typical calling pattern used to submit a configuration request, regardless of whether you're creating new or modifying an existing resource.

:::image type="content" source="./media/product-ingestion-api/product-ingestion-api-workflow.png" alt-text="Image of a typical Product Ingestion API workflow.":::

## Getting started

To use the Product Ingestion API, you need to first acquire the following prerequisites:

- An Azure Active Directory (Azure AD) and ensure that you have Global administrator permissions for the directory
- An Azure AD application
- An Azure AD access token

Follow these [onboarding instructions](submission-api-onboard.md) to get started. After this has been set up once, you can obtain an Azure AD access token to call the APIs with the Authorization header for each API method.

> [!NOTE]
> Be sure to review any additional prerequisites specific to the offer type you’re managing by referring to the [API guidance per offer type](#api-guidance-per-offer-type) section.

## Create new products and resources

You can create new resources, including new products, as part of a single configuration request. By using the [Resource API reference](#resource-api-reference) table, you can retrieve the schema for the resource type you want to create. This ensures that you're using the latest schema and therefore configuring all necessary properties to create the resource.

If you’re creating a new product, requirements will vary by product type. Therefore, you’ll need to provide different resources. You can reference the corresponding commercial marketplace documentation for the respective product type to ensure that you’re configuring the basic requirements in your request.

Similarly, to create a new resource within an existing product, you'll also need to retrieve the latest schema of that specific resource type. Ensure that you provide the dependent resources as part of the configuration request by reviewing the [resource dependencies](#resource-references-and-dependencies).

After configuring your resources, learn how to make a [configuration request](#configuration-requests).

## Retrieve existing resource configurations

Before updating existing resources, it’s important to first retrieve them to ensure that you have their latest configuration. There are several ways to retrieve resources via a GET call. See Method 1, detailed below, to retrieve all resources within a specific product in a single API call.

### Method 1: Resource-tree

`GET resource-tree/<product-durableId>`

You can retrieve all resource configurations within a specific product by using the “resource-tree” resource type along with the product’s durable ID.

> [!NOTE]
> If you don’t know the product’s durable ID, you can retrieve the product resource first by using the product’s [external ID](#external-id) instead and running `GET product?externalId=<product-externalId>`. This request leverages a query string parameter, which is detailed in method 3 below. The response will include the product’s durable ID, which you can use for future requests.

By default, when you run a GET call using the “_resource-tree_”, you’ll get back the draft version of your resources. However, by passing the “_targetType_” query parameter, you can specify the desired target to retrieve the “_preview_” or “_live_” data. In the following example, the GET call will return the configuration of the preview environment for all resources under the product “12345678-abcd-efgh-1234-12345678901”.

***Sample GET call***

`GET https://graph.microsoft.com/rp/product-ingestion/resource-tree/product/12345678-abcd-efgh-1234-12345678901?targetType="preview"`

***Sample response:***

```json
{
  "$schema": "https://product-ingestion.azureedge.net/schema/resource-tree/2022-03-01-preview2",
  "root": "product/12345678-abcd-efgh-1234-12345678901",
  "target": {
    "targetType": "preview"
  },
  "resources": [
  { 
    "$schema": "https://product-ingestion-int.azureedge.net/schema/product/2022-03-01-preview2",
    "id": "product/12345678-abcd-efgh-1234-12345678901",
    "identity": {
      "externalId": "product_external_id_example"
    },
    "type": "azureVirtualMachine",
    "alias": "product_example"
  },
  {
    "$schema": "https://product-ingestion.azureedge.net/schema/plan/2022-03-01-preview2",
    "id": "plan/12345678-abcd-efgh-1234-12345678901/98756328-04e9-55ae-9403-52b6c971a956
  ...
  }, 
     // The response would include all existing resources within this product.
  {
     ...
  }]
}
```

### Method 2: Durable ID

`GET <resource-durableId>`

Retrieve a specific resource by using its [durable-id](#durable-id). Once a resource is created, the durable ID will always remain the same and can be used to retrieve the latest draft changes of that resource by calling the GET method. For example, the following request will return the draft configuration of this specific product.

`GET product/12345678-abcd-efgh-1234-12345678901`

> [!IMPORTANT]
> This method is only used for retrieving the draft configuration. If you would like to retrieve preview or live data, use the “_resource-tree_” method, as detailed above.

To find the durable-id for your resources, you can either:

1. Use the ["resource-tree" method](#method-1-resource-tree) to fetch all resources within the product along with each of their respective durable IDs.
1. Retrieve the [status of a completed resource configuration request](#summary-of-a-completed-request), which includes the durable IDs for all resources created or updated as a part of the request.

Remember, the “_id_” property is the durable-id for the respective resource.

### Method 3: Query string parameters

`GET <resourceType>?<query parameters>`

This method is used to query certain resource types associated with a specific account. For example, you can retrieve all your virtual machine products with a single GET call. Query string parameters are mainly used to query details pertaining to your products, plans, or submissions.

This table shows the supported query parameters for each of the supported resource types. Not all resource types support each of the query parameters. Reference this table for the full list of currently supported query strings.

| Resource Type | Parameters | Query string examples |
| ------------ | ------------- | ------------- |
| plan | product `*`<br>externalId<br>$maxpagesize<br>$skip<br>$top | `GET plan?product=<product-durableId>`<br>`GET plan?product=<product-durableId>&externalId=<plan-externalId>`<br>`GET plan?product=<product-durableId>&$maxpagesize=<#>`<br>`GET plan?product=<product-durableId>&$skip=<#>&$top=<#>` |
| product | externalId<br>type<br>$maxpagesize<br>$skip<br>$top<br>continuationToken | `GET product?externalId=<product-externalId>`<br>`GET product?type=<product-type>`<br>`GET product?$maxpagesize=<#>`<br>`GET product?$skip=<#>&$top=<#>`<br>`GET product?continuationToken=<token>` |
| submission | targetType<br>$maxpagesize<br>continuationToken | `GET submission/<product-durableId>?targetType=<environment>`<br>`GET submission/<product-id>?$maxpagesize=<#>&continuationToken=<token>` |
| resource-tree | targetType | `GET resource-tree/<product-durableId>?targetType=<environment>` |

`*` The product parameter is always

Functionality of each of the supported query parameters:

- _product_ – When passing the “_product_” parameter in context of the “plan” resource type, it will return all plans within that specific product.
- _externalId_ – When passing the “_externalId_” parameter in the context of a product or plan, it will return the configuration of that respective product or plan. Unlike the “resource-tree” method, this query string parameter will only return the details of that resource, not all resources within it.
- _type_ – When passing the “_type_” parameter in context of the “_product_” resource type, it will return all products of that type associated to your account. For example, by specifying “_type=azureVirtualMachine_”, all of your virtual machine products will be returned.
- _targetType_ – This will return the data of a specific environment in the context of the resource type that is used. The supported “_targetType_” values are “_draft_”, “_preview_”, or “_live_”.
- _$maxpagesize_ – By specifying the maximum page size, in the form of a positive whole number, this parameter is used to limit the results of your search when querying your previous submissions. You can use the “_$maxpagesize_” or “_$top_” parameter, but not in the same query.
- _continuationToken_ – This parameter can be used with the “_$maxpagesize_” parameter to query another set of results available in your search. The “_continuationToken_” value is provided in the response of the previous page.
- _$top_ – Limit the results that are returned to the first <#> items. You can use the “_$maxpagesize_” or “_$top_” parameter, but not in the same query.
- _$skip_ – Offset to skip over the number of results indicated by <#>. This is usually used with the “_$top_” parameter to paginate over results.

To learn the specifics regarding how to retrieve your existing submissions, see [Querying your submissions](#querying-your-submissions).

## Modify existing products and resources

You can submit updates by using the configure payload. This payload consists of one or more resource types and the “_$schema_” property indicates the resource type being referenced.

> [!TIP]
> We recommend that you first retrieve existing resources before publishing updates to ensure that you are leveraging the latest configuration.

After configuring your resources, learn how to make a [configuration request](#configuration-requests).

## Configuration requests

You can edit and publish in the same payload. To submit a configuration request, use the HTTP POST method of the configure API. The configure payload consists of an array of resources that indicate the desired changes. All edits affect only the draft version until you explicitly submit a submission configuration to publish your draft changes. When publishing to preview or live, include the submission resource and specify the target environment. Before submitting a request, you'll need to know how to reference resources and understand their dependencies.

### Resource references and dependencies

#### References

To reference a specific resource within a request, provide the “$schema” for that resource type along with the resource's durable ID. In the case of products and plans, you can also reference these resources via its external ID.

For the durable ID, the resource is referenced in the following format:

`"id": "<resource-durableId>"`

The external ID of product and plan resources is defined within the “_identity_” property. The external ID can then be referenced by other subsequent resources in the following format respectively:

```json
{
    "$schema": "https://product-ingestion.azureedge.net/schema/plan/2022-03-01-preview2", 
    "alias": "my new plan",
    "identity": {"externalId": "myPlanName123"} 
     ...
 }
 {
   "$schema": "https://product-ingestion.azureedge.net/schema/plan-listing/2022-03-01-preview2", 
   "product": {"externalId": "myProductName"}
   "plan": {"externalId": "myPlanName123"}
     ...
 }
```

**Sample request:**

In this example, the configure payload is used to create a new plan in draft state with an external ID of “**myPlanName123**”. Upon creation of this plan, you can later reference this plan using its durable ID instead.

```json
POST https://graph.microsoft.com/rp/product-ingestion/configure

{
  "$schema": "https://product-ingestion.azureedge.net/schema/configure/2022-03-01-preview2"
  "resources": [
  {
    "$schema": "https://product-ingestion.azureedge.net/schema/plan/2022-03-01-preview2", 
    "alias": "my new plan",
    "identity": {"externalId": "myPlanName123"} 
     ...
  }, 
  }]
}
```

Then, to later publish this plan to preview, you'll need to include the [submission resource](#submission-resource) within the request.

#### Dependencies

Certain resources have dependencies on the creation of another resource as a prerequisite. In this circumstance, use the “_resourceName_” property within the same payload to denote the dependency.

**Sample request:**

In this example, the product must be created prior to the plan and therefore, the “_resourceName_” property is used.

```json
POST https://graph.microsoft.com/rp/product-ingestion/configure

{
  "$schema": "https://product-ingestion.azureedge.net/schema/configure/2022-03-01-preview2"
  "resources": [
  {
    "$schema": "https://product-ingestion.azureedge.net/schema/product/2022-03-01-preview2", 
    "resourceName": "myNewProduct",
    "alias": "my new product",
    ...
  }, 
  {
    "$schema": "https://product-ingestion.azureedge.net/schema/plan/2022-03-01-preview2", 
    "alias": "my new plan",
    "product": {"resourceName": "myNewProduct”}
     ...
  }, 
  }]
}
```

### Submission resource

If publishing to “preview” or “live”, include the submission resource in your request, which contains:

- The “_product_” property, denoting the product being updated as referenced by either its durable ID or external ID
- The “_targetType_” property, denoting the target environment
- When publishing to live specifically, the “_id_” of the preview submission you're looking to publish

```json
...
  {
    "$schema": "https://product-ingestion.azureedge.net/schema/submission/2022-03-01-preview2",
    "id": "submission/12345678-abcd-efgh-1234-12345678901/11521167929065",    
    "product": "product/12345678-abcd-efgh-1234-12345678901", 
    "target": { "targetType": "live" }
  }
```

> [!NOTE]
> If you don’t include the submission resource, the changes are made to the draft state.

### Publishing to preview

Commercial product types support a preview environment, and each update must be first published to preview before going live. You can't publish directly to live.

> [!IMPORTANT]
> The exception to this is when making changes to the private audience of your plans. When [syncing updates to the private audience](#sync-private-audiences) specifically, you can publish to preview and live at the same time.

There are two ways you can publish your resources to the preview environment. If any changes need to be made to the preview submission, do another GET request, make the necessary changes, and push the changes again. You don’t need to first go live with your initial changes.

#### Method 1: Publish all draft resources

If you want to publish every draft change you have made, you can send a configure request with a submission resource that sets the preview environment as the “targetType”. As shown in the example below, you don't need to explicitly provide every resource that requires an update as this method will publish all changes to the target environment, which in this case is preview. You only need to provide the configure API endpoint and the submission resource.

***Sample request:***

```json
POST https://graph.microsoft.com/rp/product-ingestion/configure

{
  "$schema": "https://product-ingestion.azureedge.net/schema/configure/2022-03-01-preview2"
  "resources": [
  {
    "$schema": "https://product-ingestion.azureedge.net/schema/submission/2022-03-01-preview2",
    "product": "product/12345678-abcd-efgh-1234-12345678901", // This is the product durable ID
    "target": { "targetType": "preview" }
  }
 ]
}
```

#### Method 2: Publish specific draft resources (Also known as Modular publish)

Alternatively, if you aren't prepared to publish all draft changes across various resources, just provide the resources you want to publish along with the submission resource to trigger a modular publish. You can also use this approach to make changes to resources and publish them at the same time instead of as part of a bulk update, as is done through Method 1. For a modular publish, all resources are required except for the offer level details (for example, listing, availability, packages, reseller) as applicable to your offer type.

***Sample request:***

In this example, resources in the product are explicitly provided as part of the modular publish followed by the submission resource.

```json
POST https://graph.microsoft.com/rp/product-ingestion/configure

{
  "$schema": "https://product-ingestion.azureedge.net/schema/configure/2022-03-01-preview2"
  "resources": [
  {
    "$schema": "https://product-ingestion.azureedge.net/schema/product/2022-03-01-preview2", 
    "id": "product/12345678-abcd-efgh-1234-12345678901",
    ...
  },
  {
    "$schema": "https://product-ingestion.azureedge.net/schema/plan/2022-03-01-preview2", 
     ...
  }, 
  // additional resources
  {
     ...
  },
  
  {
    "$schema": "https://product-ingestion.azureedge.net/schema/submission/2022-03-01-preview2",
    "product": "product/12345678-abcd-efgh-1234-12345678901", // This is the product durable ID
    "target": { "targetType": "preview" }
  }
 ]
}
```

### Publishing to live

Once your changes in preview have been tested and verified, you can push your changes to live by sending a configure request with the “_id_” of your preview submission and the “_targetType_” set to “_live_”. To find the “_id_” of your preview submission to incorporate within your configure request, see [Querying your submissions](#querying-your-submissions).

> [!IMPORTANT]
> Unlike when publishing to preview, there is no option to perform a modular publish when publishing to live. Therefore, it is important to ensure that you have verified your preview submission before going live with your changes.

***Sample request:***

```json
POST https://graph.microsoft.com/rp/product-ingestion/configure

{
  "$schema": "https://product-ingestion.azureedge.net/schema/configure/2022-03-01-preview2"
  "resources": [
  // Below is the submission resource, including the preview submission id, to publish to live.
  {
    "$schema": "https://product-ingestion.azureedge.net/schema/submission/2022-03-01-preview2",
    "id": "submission/12345678-abcd-efgh-1234-12345678901/11521167929065",    
    "product": "product/12345678-abcd-efgh-1234-12345678901", // This is the product durable ID
    "target": { "targetType": "live" }
  }
 ]
}
```

## Check the status of a request

Regardless of the environment you're publishing to, you'll get a response back shortly after submitting a request once it's successfully processed. The “_jobId_” is important as it can later be used to check the status of the request.

***Sample response to a processed request:***

```json
{
    "$schema": "https://product-ingestion.azureedge.net/schema/configure-status/2022-03-01-preview2",
    "jobId": "d4261631-c583-4949-a612-5150882632e9",
    "jobStatus": "notStarted",
    "jobResult": "pending",
    "jobStart": "2022-03-01-preview2T13:32:43.123456Z",
    "jobEnd": "0001-01-01T00:00:00",
    "errors": []
}
```

### Status of a pending request

You can retrieve the status until the job finishes using the following call and inputting the “_jobID_” of the request.

`GET https://graph.microsoft.com/rp/product-ingestion/configure/<jobId>/status`

Keep in mind that depending on the complexity of your request, the time it takes to complete may vary.

### Summary of a completed request

After the job finishes, you can get more detailed information on resources created or updated along with any errors by using the following call along with the “_jobId_”.

`GET https://graph.microsoft.com/rp/product-ingestion/configure/<jobId>`

> [!NOTE]
> If you make this call before the job is completed, it will fail.

## Querying your submissions

You can retrieve your existing product submissions by doing `GET submission/<product-durableId>`. By default, you’ll get back all your active submissions including the draft reference, but you can additionally query a specific environment using the “_targetType_” query parameter: (`GET submission/<product-durableId>?targetType=<environment>`).

> [!IMPORTANT]
> Once a "_Preview_" submission is pushed to "_Live_", it replaces any the previous "_Live_" submission. When this happens, the data now represents both “_Preview_” and “_Live_” environments until a new submission is published to "_Preview_".

***Sample request:***

`GET https://graph.microsoft.com/rp/product-ingestion/submission/12345678-abcd-efgh-1234-12345678901`

***Sample response:***

This example shows a GET request for the active submissions associated to _product ID_ “_12345678-abcd-efgh-1234-12345678901_”. The active “_Live_” submission (_submission/12345678-abcd-efgh-1234-12345678901/1152921515689847470_) was published to preview first and then later to live. When this submission was pushed to live on 2022-01-25, it represented both preview and live until a new preview submission (_submission/12345678-abcd-efgh-1234-12345678901/1152921515689848683_) was created on 2022-02-04.

```json
{
  "value": [
    {
      "$schema": "https://product-ingestion.azureedge.net/schema/submission/2022-03-01-preview2",
      "id": "submission/12345678-abcd-efgh-1234-12345688901/0",
      "product": "product/12345678-abcd-efgh-1234-12345678901",
      "target": {
        "targetType": "draft"
      }
    },
    {
      "$schema": "https://product-ingestion.azureedge.net/schema/submission/2022-03-01-preview2",
      "id": "submission/12345678-abcd-efgh-1234-12345678901/1152921515689847470",
      "product": "product/12345678-abcd-efgh-1234-12345678901",
      "target": {
        "targetType": "live"
      },
      "status": "completed",
      "result": "succeeded",
      "created": "2022-01-25T07:13:06.4408032Z"
    },
    {
      "$schema": "https://product-ingestion.azureedge.net/schema/submission/2022-03-01-preview2",
      "id": "submission/12345678-abcd-efgh-1234-12345678901/1152921515689848683",
      "product": "product/12345678-abcd-efgh-1234-12345678901",
      "target": {
        "targetType": "preview"
      },
      "status": "completed",
      "result": "succeeded",
      "created": "2022-02-04T20:07:22.4220588Z"
    }
  ]
}
```

## Sync private audiences

Updates to private audiences in the draft, preview, and live environments can be performed at the same time without requiring a publish. This can be done by utilizing the “_price-and-availability-update-private-audiences_” resource and specifying which audiences you want to add or remove from a specific plan. You don't need to provide the submission resource when syncing the private audience.

> [!IMPORTANT]
> If your product supports more than one type of identifier to configure the private audience (for example, both tenant IDs and subscription IDs), you must perform a full publish if providing a new identifier type for the first time. You cannot sync the private audience in this case.

***Sample request to sync the private audience configuration:***

```json
POST https://graph.microsoft.com/rp/product-ingestion/configure

{
  "$schema": "https://product-ingestion.azureedge.net/schema/configure/2022-03-01-preview2"
  "resources": [
  {
    "$schema": "https://product-ingestion.azureedge.net/schema/price-and-availability-update-private-audiences/2022-03-01-preview2",
    "product": "product/12345678-abcd-efgh-1234-12345678901", // product durable ID
    "plan": "plan/12345678-abcd-efgh-1234-12345678901/7e70b11f-809e-4c45-ae2f-1fb3ceaca33b", //plan durable ID 
    "privateAudiences":
    {
      "add ":
      [
         {
	  "type": "subscription",
           "id": "12345678901",
           "label": "test 1"
         }
      ],
      "remove ":
      [
        {
 	  "type": "subscription",
           "id": "056789011234",
           "label": "test 2"
        }
      ]
    }
  }
 ]
}
```

## Resource lifecycle states

There are different actions you can take that map to a resource’s lifecycle state. Not all resources have a lifecycle state and not all lifecycle states are supported by all resources. To discover if a resource has a lifecycle state and which values are supported, you can check the resource schema for the existence of the property “_lifecycleState_”. Various supported lifecycle states are detailed below.

### Deleted

You can delete specific resources by updating the “_lifecycleState_” property to “_deleted_”. You can only delete draft resources that haven't been published before. This action can't be undone.

***Sample request:***

In the example below, the “_basic_” draft plan is deleted.

```json
POST https://graph.microsoft.com/rp/product-ingestion/configure

{
  "$schema": "https://product-ingestion.azureedge.net/schema/configure/2022-03-01-preview2"
  "resources": [
   {
    "$schema": "https://product-ingestion-int.azureedge.net/schema/plan/2021-12-01-dev",
    "id": "plan/9f8af57f-ab07-461b-8404-50e10e5e80fb/7e70b11f-809e-4c45-ae2f-1fb3ceaca33b",
    "product": "product/9f8af57f-ab07-461b-8404-50e10e5e80fb",
    "identity": { "externalId": "basic" },
    "alias": "basic plan"
    "lifecycleState": "deleted"
   }
  ]
}
```

### Deprecated

Deprecation removes the resource from the commercial marketplace. To deprecate, set the “_lifecycleState_” property to “_deprecated_” on the resources that support it. Various levels of deprecation are supported depending on the product type. For example, in the case of virtual machines, you can deprecate specific images, plans, or the entire offer. To later restore a deprecated resource, refer to the [“generallyAvailable” lifecycle state](#generally-available).

***Sample request:***

In the example below, a plan within a virtual machine product is set to deprecate. As a result of deprecating the plan, all images within the plan will also be deprecated. To apply this change, you can later publish using the submission resource.

```json
POST https://graph.microsoft.com/rp/product-ingestion/configure
{
  "$schema": "https://product-ingestion.azureedge.net/schema/configure/2022-03-01-preview2"
  "resources": [
   {
    "$schema": "https://product-ingestion-int.azureedge.net/schema/plan/2021-12-01-dev",
    "id": "plan/9f8af57f-ab07-461b-8404-50e10e5e80fb/7e70b11f-809e-4c45-ae2f-1fb3ceaca33b",
    "product": "product/9f8af57f-ab07-461b-8404-50e10e5e80fb",
    "identity": { "externalId": "basic" },
    "alias": "basic plan"
    "lifecycleState": "deprecated"
   }
  ]
}
```

### Generally available

“_generallyAvailable_” is the default lifecycle state for all resources. Once a resource is deprecated, you can restore it by changing the “_lifecycleState_” property back to “_generallyAvailable_”.

***Sample request:***

In the example below, VM image version 1.0.0 is intended to be restored. To apply this change, you can later publish using the submission resource.

```json
POST https://graph.microsoft.com/rp/product-ingestion/configure

{
  "$schema": "https://product-ingestion.azureedge.net/schema/configure/2022-03-01-preview2"
  "resources": [
   {
    "$schema": "https://product-ingestion-int.azureedge.net/schema/virtual-machine-plan-technical-configuration/2021-12-01-dev",
    "id": "virtual-machine-plan-technical-configuration/9f8af57f-ab07-461b-8404-50e10e5e80fb/7e70b11f-809e-4c45-ae2f-1fb3ceaca33b",
    "product": "product/9f8af57f-ab07-461b-8404-50e10e5e80fb",
    "plan": "plan/9f8af57f-ab07-461b-8404-50e10e5e80fb/7e70b11f-809e-4c45-ae2f-1fb3ceaca33b",
    ...
    "vmImageVersions": [
      {
        "versionNumber": "1.0.0",
        "lifecycleState": " generallyAvailable",
        "vmImages": [...]
      },
      {
        "versionNumber": "1.0.1",
        "vmImages": [...]
      }
    ]
   }
  ]
}
```

## Resource API Reference

| Resource Type | Schema |
| ------------ | ------------- |
| customer-leads | https://product-ingestion.azureedge.net/schema/customer-leads/2022-03-01-preview2 |
| listing-asset | https://product-ingestion.azureedge.net/schema/listing-asset/2022-03-01-preview2 |
| listing-trailer | https://product-ingestion.azureedge.net/schema/listing-trailer/2022-03-01-preview2 |
| listing | https://product-ingestion.azureedge.net/schema/listing/2022-03-01-preview2 |
| plan-listing | https://product-ingestion.azureedge.net/schema/plan-listing/2022-03-01-preview2 |
| test-drive-listing | https://product-ingestion.azureedge.net/schema/test-drive-listing/2022-03-01-preview2 |
| plan | https://product-ingestion.azureedge.net/schema/plan/2022-03-01-preview2 |
| price-and-availability-apps-and-games | https://product-ingestion.azureedge.net/schema/price-and-availability-apps-and-games/2022-03-01-preview2 |
| price-and-availability-offer | https://product-ingestion.azureedge.net/schema/price-and-availability-offer/2022-03-01-preview2 |
| price-and-availability-plan | https://product-ingestion.azureedge.net/schema/price-and-availability-plan/2022-03-01-preview2 |
| private-and-availability-private-offer-plan | https://product-ingestion.azureedge.net/schema/price-and-availability-private-offer-plan/2022-03-01-preview2 |
| price-and-availability-update-private-audiences | https://product-ingestion.azureedge.net/schema/price-and-availability-update-private-audiences/2022-03-01-preview2 |
| private-offer | https://product-ingestion.azureedge.net/schema/private-offer/2022-03-01-preview2 |
| product | https://product-ingestion.azureedge.net/schema/product/2022-03-01-preview2 |
| property | https://product-ingestion.azureedge.net/schema/property/2022-03-01-preview2 |
| reseller | https://product-ingestion.azureedge.net/schema/reseller/2022-03-01-preview2 |
| resource-tree | https://product-ingestion.azureedge.net/schema/resource-tree/2022-03-01-preview2 |
| submission | https://product-ingestion.azureedge.net/schema/submission/2022-03-01-preview2 |
| test-drive | https://product-ingestion.azureedge.net/schema/test-drive/2022-03-01-preview2 |
| virtual-machine-plan-technical-configuration | https://product-ingestion.azureedge.net/schema/virtual-machine-plan-technical-configuration/2022-03-01-preview2 |
| virtual-machine-test-drive-technical-configuration | https://product-ingestion.azureedge.net/schema/virtual-machine-test-drive-technical-configuration/2022-03-01-preview2 |

## API guidance per offer type

The Product Ingestion API will be made available to other offer types in the future. As more offers are supported, additional guidance specific to each offer type will be made available.

| Offer type | Offer-specific resources |
| ------------ | ------------- |
| Private offers | See [Create and manage private offers via API](private-offers-api.md) |
