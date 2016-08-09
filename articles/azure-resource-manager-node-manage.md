<properties
   pageTitle="Manage Azure Resources and Resource Groups using the Node.js SDK for Azure | Microsoft Azure"
   description="Code sample that demonstrates how to use the Node.js SDK for Azure to manage resources and resource groups on Azure."
   services="azure-resource-manager"
   documentationCenter="nodejs"
   authors="allclark"
   manager="douge"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="nodejs"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/29/2016"
   ms.author="allclark"/>

# Manage resources using the Node.js SDK

This sample demonstrates how to manage your
[resources and resource groups in Azure](resource-group-overview.md#resource-groups)
using the Azure SDK for Node.js.

## Run this sample

1. If you don't already have it, [get node.js](https://nodejs.org).

2. Clone the repository.

    ```
    git clone http://github.com/Azure-Samples/resource-manager-node-resources-and-groups.git
    ```

3. Install the dependencies.

    ```
    cd resource-manager-node-resources-and-groups
    npm install
    ```

4. Create an Azure service principal either through
    [Azure CLI](resource-group-authenticate-service-principal-cli.md),
    [PowerShell](resource-group-authenticate-service-principal.md),
    or [the portal](resource-group-create-service-principal-portal.md).

5. Set the following environment variables using the information from the service principle that you created.

    ```
    export AZURE_SUBSCRIPTION_ID={your subscription id}
    export CLIENT_ID={your client id}
    export APPLICATION_SECRET={your client secret}
    export DOMAIN={your tenant id as a guid OR the domain name of your org <contosocorp.com>}
    ```

    > [AZURE.NOTE] On Windows, use `set` instead of `export`.

6. Run the sample.

    ```
    node index.js
    ```

7. To clean up after index.js, run the cleanup script.

    ```
    node cleanup.js <resourceGroupName> <resourceName>
    ```

## What is index.js doing?

The sample creates, lists, and updates a website.
It starts by logging in using your service principal.

```
_validateEnvironmentVariables();
var clientId = process.env['CLIENT_ID'];
var domain = process.env['DOMAIN'];
var secret = process.env['APPLICATION_SECRET'];
var subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
var resourceClient;
//Sample Config
var randomIds = {};
var location = 'westus';
var resourceGroupName = _generateRandomId('testrg', randomIds);
var resourceName = _generateRandomId('testresource', randomIds);

var resourceProviderNamespace = 'Microsoft.KeyVault';
var parentResourcePath = '';
var resourceType = 'vaults';
var apiVersion = '2015-06-01';

///////////////////////////////////////
//Entrypoint for the sample script   //
///////////////////////////////////////

msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain, function (err, credentials) {
  if (err) return console.log(err);
  resourceClient = new ResourceManagementClient(credentials, subscriptionId);
```

With that set up, the sample performs these operations.

### Create a resource group

```
var groupParameters = { location: location, tags: { sampletag: 'sampleValue' } };
resourceClient.resourceGroups.createOrUpdate(resourceGroupName, groupParameters, callback);
```

### List resource groups

This code lists the resource groups in your subscription.

```
resourceClient.resourceGroups.list(callback);
```

### Update a resource group

The sample adds a tag to the resource group.

```
var groupParameters = { location: location, tags: { sampletag: 'helloworld' } };
resourceClient.resourceGroups.createOrUpdate(resourceGroupName, groupParameters, callback);
```

### Create a key vault in the resource group

```
var keyvaultParameter = {
  location : "West US",
  properties : {
    sku : {
      family : 'A',
      name : 'standard'
    },
    accessPolicies : [],
    enabledForDeployment: true,
    enabledForTemplateDeployment: true,
    tenantId : domain
  },
  tags : {}
};
resourceClient.resources.createOrUpdate(resourceGroupName, 
                                        resourceProviderNamespace, 
                                        parentResourcePath, 
                                        resourceType, 
                                        resourceName, 
                                        apiVersion, 
                                        keyvaultParameter, 
                                        callback);
```

### Get a resource

```
resourceClient.resources.get(resourceGroupName, 
                             resourceProviderNamespace, 
                             parentResourcePath, 
                             resourceType, 
                             resourceName, 
                             apiVersion, 
                             callback);
```

### Export the resource group template

Export the resource group as a template and then you can use that
to [deploy your resources to Azure](https://azure.microsoft.com/documentation/samples/resource-manager-ruby-template-deployment/).

```
var rgParameter = {
  resources: ['*']
};
resourceClient.resourceGroups.exportTemplate(resourceGroupName, rgParameter, callback);
```

### Delete a resource

```
resourceClient.resources.deleteMethod(resourceGroupName, 
                                      resourceProviderNamespace, 
                                      parentResourcePath, 
                                      resourceType, 
                                      resourceName, 
                                      apiVersion, 
                                      callback);
```

## More information

[Azure SDK for Node.js](https://github.com/Azure/azure-sdk-for-node)

[AZURE.INCLUDE [azure-code-samples-closer](../includes/azure-code-samples-closer.md)]
