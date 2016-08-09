<properties
   pageTitle="Manage Azure Resources and Resource Groups using the Ruby SDK for Azure | Microsoft Azure"
   description="Describes how to use the Ruby SDK for Azure to manage resources and resource groups on Azure."
   services="azure-resource-manager"
   documentationCenter="ruby"
   authors="allclark"
   manager="douge"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="ruby"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/29/2016"
   ms.author="allclark"/>

# Manage resources using the Ruby SDK

Use this code sample to learn how to manage your [resources and resource groups](resource-group-overview.md#resource-groups)
in Azure using the Azure Ruby SDK.

## Run the sample

1. If you don't already have it, [install Ruby and the Ruby DevKit](https://www.ruby-lang.org/en/documentation/installation/).

1. If you don't have *bundler*, install it.

    ```
    gem install bundler
    ```

1. Clone the repository.

    ```
    git clone https://github.com/Azure-Samples/resource-manager-ruby-resources-and-groups.git
    ```

1. Install the dependencies using bundle.

    ```
    cd resource-manager-ruby-template-deployment
    bundle install
    ```

1. Create an Azure service principal either through
    [Azure CLI](resource-group-authenticate-service-principal-cli.md),
    [PowerShell](resource-group-authenticate-service-principal.md),
    or [the portal]resource-group-create-service-principal-portal.md).

1. Set the following environment variables using the information from the service principle that you created.

    ```
    export AZURE_TENANT_ID={your tenant id}
    export AZURE_CLIENT_ID={your client id}
    export AZURE_CLIENT_SECRET={your client secret}
    export AZURE_SUBSCRIPTION_ID={your subscription id}
    ```

    > [AZURE.NOTE] On Windows, use `set` instead of `export`.

1. Run the sample.

    ```
    bundle exec ruby example.rb
    ```

## What does example.rb do?

The sample walks you through several resource and resource group management operations.
It starts by setting up a ResourceManagementClient object using your subscription and credentials.

```ruby
subscription_id = ENV['AZURE_SUBSCRIPTION_ID'] ||
    '11111111-1111-1111-1111-111111111111' # your Azure Subscription Id
provider = MsRestAzure::ApplicationTokenProvider.new(
    ENV['AZURE_TENANT_ID'],
    ENV['AZURE_CLIENT_ID'],
    ENV['AZURE_CLIENT_SECRET'])
credentials = MsRest::TokenCredentials.new(provider)
client = Azure::ARM::Resources::ResourceManagementClient.new(credentials)
client.subscription_id = subscription_id
```

It also sets up a ResourceGroup object (resource_group_params) to be used as a parameter in some of the API calls.

```ruby
resource_group_params = Azure::ARM::Resources::Models::ResourceGroup.new.tap do |rg|
    rg.location = `westus`
end
```

There are a couple of supporting functions (`print_item` and `print_properties`) that print a resource group and its properties.
With that set up, the sample lists all resource groups for your subscription, it performs these operations.

### List resource groups

List the resource groups in your subscription.

```ruby
 client.resource_groups.list.value.each{ |group| print_item(group) }
```

### Create a resource group

```ruby
client.resource_groups.create_or_update('azure-sample-group', resource_group_params)
```

### Update a resource group

The sample adds a tag to the resource group.

```ruby
resource_group_params.tags = { hello: 'world' }
client.resource_groups.create_or_update('azure-sample-group', resource_group_params)
```

### Create a key vault in the resource group

```ruby
key_vault_params = Azure::ARM::Resources::Models::GenericResource.new.tap do |rg|
    rg.location = WEST_US
    rg.properties = {
        sku: { family: 'A', name: 'standard' },
        tenantId: ENV['AZURE_TENANT_ID'],
        accessPolicies: [],
        enabledForDeployment: true,
        enabledForTemplateDeployment: true,
        enabledForDiskEncryption: true
    }
  end
  client.resources.create_or_update(GROUP_NAME,
                                    'Microsoft.KeyVault',
                                    '',
                                    'vaults',
                                    'azureSampleVault',
                                    '2015-06-01',
                                    key_vault_params)
```

### List resources within the group

```ruby
client.resource_groups.list_resources(GROUP_NAME).value.each{ |resource| print_item(resource) }
```

### Export the resource group template

You can export the resource group as a template and then use that
to [deploy your resources to Azure](https://azure.microsoft.com/documentation/samples/resource-manager-ruby-template-deployment/).

```ruby
export_params = Azure::ARM::Resources::Models::ExportTemplateRequest.new.tap do |rg|
    rg.resources = ['*']
end
client.resource_groups.export_template(GROUP_NAME, export_params)
```

### Delete a resource group

```ruby
client.resource_groups.delete('azure-sample-group')
```
