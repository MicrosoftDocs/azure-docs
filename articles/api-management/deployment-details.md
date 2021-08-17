---
title: Azure API Management monetization strategy deployment details
description: Deploy a monetization strategy demo and define a set of products, APIs, and named values. 
author: v-hhunter
ms.author: v-hhunter
ms.date: 08/20/2021
ms.topic: article
ms.service: api-management
---


# Azure API Management monetization strategy deployment details

The following resources are deployed as part of the demo:
- An [API Management service](https://azure.microsoft.com/en-gb/services/api-management/), with the API Management resources required to support the demo project (APIs, Products, Policies, Named Values).
- An [App Service plan](./azure/app-service/overview.md).
- A [Web App for containers](https://azure.microsoft.com/en-gb/services/app-service/containers/), using the billing portal app container image.
- A [Service Principal RBAC assignment](./azure/role-based-access-control/overview.md).

## Technology

This project is currently using [Bicep](./azure/azure-resource-manager/templates/bicep-overview.md) for local development and deployment. Bicep is a templating language for declaratively deploying Azure resources. Currently, the **Deploy to Azure** button does not support Bicep. 

* Prior to deployment, Bicep must be decompiled into an Azure Resource Manager template, which happens when the solution is built by running the [build.ps1](../build.ps1) script.
* You can find the Azure Resource Manager template generated on build in the [/output](../output/) folder.
* You can run the deployment using the [deploy.ps1](../deploy.ps1) script. Follow the steps in the [README](../README.md) file.

## API Management Service

With the demo, you deploy an instance of Azure API Management service. As part of this deployment, we define a set of products, APIs (with accompanying policies), and named values.

### Products 

The API Management instance products are defined as resources as part of the Bicep templates in [templates/apimmonetization-products.bicep](../templates/apimmonetization-products.bicep).

In the following example product definition, we:
* Define the basic product. 
* Define a name, display name, and description. 
* Require subscription in order to use this product.
* Require approval before activating the subscription. 

```bicep
resource ApimServiceName_basic 'Microsoft.ApiManagement/service/products@2019-01-01' = {
  properties: {
    description: 'Basic tier with a monthly quota of 50,000 calls.'
    terms: 'Terms here'
    subscriptionRequired: true
    approvalRequired: true
    state: 'published'
    displayName: 'Basic'
  }
  name: '${ApimServiceName}/basic'
  dependsOn: []
}
```

We link a separate resource to a policy file for that product. 

```bicep
resource ApimServiceName_basic_policy 'Microsoft.ApiManagement/service/products/policies@2019-01-01' = {
  properties: {
    value: concat(artifactsBaseUrl, '/apiConfiguration/policies/products/basic.xml')
    format: 'xml-link'
  }
  name: '${ApimServiceName_basic.name}/policy'
}
```

In the following policy file for the basic product, we define an inbound policy that:
* Limits a single subscription to 50,000 calls/month. 
* Adds a rate limiting policy, ensuring a single subscription is limited to 100 calls/minute.

```xml
<policies>
  <inbound>
    <base />
    <quota calls="50000" renewal-period="2592000" />
    <rate-limit calls="100" renewal-period="60"/>
  </inbound>
  <backend>
    <base />
  </backend>
  <outbound>
    <base />
  </outbound>
  <on-error>
    <base />
  </on-error>
</policies>
```

We also define who can access each product in the [/templates/apimmonetization-productGroups.bicep](../templates/apimmonetization-productGroups.bicep) Bicep file. Developers and guests are able to sign up to the following products:

- Free
- Developer
- PAYG
- Basic 
- Standard
- Pro
- Enterprise

Since the *Admin* product is only used internally for communication between services, we don't want to expose it as a product available for consumer sign-up and use.

### APIs

Two APIs are defined as part of the API Management instance deployment:
* Address API (external)
* Billing API (internal)

Resources of these APIs are defined in the following Bicep templates:
* [templates/apimmonetization-apis-billing.bicep](../templates/apimmonetization-apis-billing.bicep) 
* [templates/apimmonetization-apis-address.bicep](../templates/apimmonetization-apis-address.bicep)

Links between APIs and products are defined in [templates/apimmonetization-productAPIs.bicep](../templates/apimmonetization-productAPIs.bicep).

Each of these APIs and products:
* Are defined in the Bicep templates.
* Has a set of policies defined.
* Has an Open API definition attached.

#### Address API

Address APIs are external APIs. Consumers can only subscribe to address APIs, using a set of differently priced products. 

We provided consumers access to an example address API via API Management and Stripe. In your own solution, replace the example API with the APIs to which your consumers will subscribe. In our example, a subscriber can post an address to the API, which will then be validated.

See [apiConfiguration/openApi/address.yaml](../apiConfiguration/openApi/address.yaml) for the example address API definition.

See in [templates/apimmonetization-productAPIs.bicep](../templates/apimmonetization-productAPIs.bicep) how the example API can be accessed using a range of products: 

* Free
* Developer
* PAYG
* Basic
* Standard
* Pro
* Enterprise

Anyone signing up to any of the above products can access this API using their API key. However, they may be limited to a specific number of calls/month or rate of calls/minute, depending on the product.

#### Billing API

Billing APIs are internal APIs with two endpoints defined:

* **`monetizationModels`** endpoint.  
   Used to retrieve the monetization models defined in the [payment/monetizationModels.json](../payment/monetizationModels.json) file. 
* **`products`** endpoint.  
   Incoming requests are redirected to the management API. Used to retrieve the products defined on the API Management instance. 

See [apiConfiguration/openApi/billing.yaml](../apiConfiguration/openApi/billing.yaml) for the billing API definition.

>[!NOTE]
> The billing API is only exposed under the `Admin` product and will not be exposed to consumers.

### Named Values

API Management also provides a concept of named values as part of deployment. Named values allow you to define specific terms, which will be replaced within your policies. For example:

```xml
<inbound>
  <base />
  <set-backend-service base-url="https://management.azure.com/subscriptions/{{subscriptionId}}/resourceGroups/{{resourceGroupName}}/providers/Microsoft.ApiManagement/service/{{apimServiceName}}" />
</inbound>
```
In the above policy definition, certain values will need to be replaced. We can define named values on the API Management instance and thus automatically override these values. 

Named values are defined in the [templates/apimmonetization-namedValues](../templates/apimmonetization-namedValues.bicep) file. In this file, we set up:
* A list of values
* What the values should be replaced by in the deployed instance. 

## Billing portal

Aside from API Management, the deployment script also deploys the billing portal resource. The billing portal is a `Node.js` app. Consumers directed to the billing portal to activate their subscriptions. You can handle the integration between API Management and the billing portal with the [user registration and product subscription delegation features in API Management](./azure/api-management/api-management-howto-setup-delegation).

As part of the main deployment, the billing portal app is deployed to [Azure Web App for Containers](https://azure.microsoft.com/en-gb/services/app-service/containers/). The container image is pulled from the [GitHub Container Registry](https://docs.github.com/en/packages/guides/about-github-container-registry) associated with this repo.

You can also add configuration to the app as part of the payment provider initialization (Adyen and Stripe).

## Next Steps
* Learn more about configuring and initializing both [Stripe](stripe-details.md) and [Adyen](adyen-details.md) in more detail.
* Understand how [API Management supports monetization](monetization-support.md).