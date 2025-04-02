---
title: Create a new template for the Service Catalog
description: Create a new template for the Service Catalog
author: aserfass-msft
ms.author: aserfass
# ms.service: Azure Virtual Enclaves
ms.topic: tutorial
ms.date: 01/31/2025
---

# Tutorial 9: Create a new template for the Service Catalog
These are the steps to create a new template for the Service Catalog including the UI organization. These templates can only be hosted by the AVE Service Catalog team currently so coordination with the AVE Service Catalog team is advised.

Priorities
1. Create working templates for AVE
2. Reduce user input with smart defaults that results in successful and functional template deployment
3. Incrementally improve templates 

## Responsibilities

### Roles

- **Creator**: The person creating the new template
- **SC Owner**: The owner of the Service Catalog, responsible for the customer UX for AVE.


| Step | SubStep | Creator | SC Owner |
|:--|--|:--:|:--:|
| Create Template | Formatting | ✅ | |
| | Parameter UX Guidance | ✅ | |
| | Storage Location | ✅ |  |
| Testing | PLx Deploy | ✅ | |
| | AVE Deploy | ✅ | |
| | Build Pipeline | ✅ | |
| | Product Bug Fixes | | ✅ |
| Style Template | CreateUIDefinition |  | ✅ |
| Acceptance Testing | Storage Location |  | ✅ |
| | Style Template |  | ✅ |
| | AVE Deploy |  | ✅ |

## Terminology

- **Add** - Service Catalog templates and their resources are ***added*** to the workload rather than *deployed* or *created*.
- **Enclave** - Use ***enclave*** instead of VE, Mission Enclave, etc. for tooltips and parameter descriptions unless referring to a specific enclave product.

## Bicep Formatting

Service Catalog deployment publishing in AVE leverages the [Custom Template Deployment experience using the Azure portal](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md). There are a few recommended guidelines to follow when creating Service Catalog templates that will make it easier to integrate and style the UX.

1. Parameters should all be individual elements and not objects.
2. Consider using `variables` when possible, for parameters that shouldn't be changed in the Virtual Enclaves product. (Arc Rangers)
3. Consider adding template level metadata

| Name | Description | Value |
|:--|:--|:--|
| Description | A description of the template to help the user distinguish what it will create. | string |
| changelogLink | A link to the template changelog. Helps the user decide which version to use. | string |
| tabGroups | A list of tab group. Adding this list creates the order of the tabGroups (that you should supply in the tabGroup parameter metadata mentioned in step 4) | string[] |

4. Add parameter metadata to assist in the creation of the [CreateUIDefinition](#createuidefinition) file. All of this metadata is optional but provides for a more familiar user experience from the portal.

| Name | Description | Value |
|:--|:--|:--|
| description | A description for the parameter. | string |
| displayName | A readable name for the parameter, what the user will see. | string |
| required | Whether the user needs to input a value in order to validate/deploy. | Boolean |
| tabGroup | Optional, The tab group that the parameter belongs to, default is Basics. Some examples include: Basics, Networking, Monitoring | string |
| hidden | Optional, Hides the parameter on the parameter input page so that the use isn't prompted for it in the UI. This is commonly used with functions like utcNow(). Default is false | Boolean |

5. Don't use prefix/suffix convention that is specific to PLx enclaves. (Arc Rangers)

### Template metadata

All additional metadata for the overall template is optional but description and changelog link are encouraged.

| Name | Description | Value |
|:--|:--|:--|
| description | A description of the template to help the user distinguish what it will create. | string |
| changelogLink | A link to the template changelog. Helps the user decide which version to use. | string |
| tabGroups | a list of tab group. You can find more info [here](#groupings) | string[] |

For example:

**Bicep**

```bicep
metadata tabGroups = ['Basics', 'Enclave', 'Advanced', 'Publish']
metadata description = 'This schema creates a remote application.'
metadata changelogLink = '<universally accessible url>'
```

**ARM template**

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.1.0",
  "metadata": {
    "_generator": {
      "name": "bicep",
      "version": "0.21.1.54444",
      "templateHash": "9713643924654560590"
    },
    "tabGroups": ["Basics", "Enclave", "Advanced", "Publish"],
    "description": "This schema create a remote application.",
    "changelogLink": "<universally accessible url>"
  },
...

```

### Parameter metadata

Additional parameter metadata should be added to help the user in the UI.

| Name | Description | Value |
|:--|:--|:--|
| description | A description for the parameter. | string |
| displayName | A readable name for the parameter, what the user will see. | string |
| required | Whether the user needs to input a value in order to validate/deploy. | Boolean |
| tabGroup | Optional, The tab group that the parameter belongs to, default is Basics | string |
| hidden | Optional, Hides the parameter on the parameter input page so that the use isn't prompted for it in the UI. This is commonly used with functions like utcNow(). Default is false | Boolean |

For example:

**Bicep**

```bicep
@description('Specify the domain admin password for domain join.')
@metadata({
  displayName: 'Domain admin password'
  required: false
  tabGroup: 'Basics'
})
@secure()
param domainAdminPassword string = ''

@description('Specify whether to publish the app')
@metadata({
  displayName: 'Do you want to publish your app?'
  required: true
  tabGroup: 'Publish'
})
param publishApp bool = true
```

**ARM template**

```json
"parameters": {
    "domainAdminPassword": {
      "type": "securestring",
      "defaultValue": "",
      "metadata": {
        "description": "Specify the domain admin password for domain join.",
        "displayName": "Domain admin password",
        "required": false,
        "tabGroup": "Basics"
      }
    },
    "publishApp": {
      "type": "bool",
      "defaultValue": true,
      "metadata": {
        "description": "Specify whether to publish the app",
        "displayName": "Do you want to publish your app?",
        "required": true,
        "tabGroup": "Publish"
      }
    },
...
```

### Groupings

- If you would like to group some of your parameters, you'll have to add `tabGroups` and assign groups to parameters. 
- In the schema metadata, add a list of your tab groups. If no tab groups are supplied, there will just be a Basics tab.

For example:

**Bicep**

```bicep
metadata tabGroups = ['Basics', 'Enclave', 'Advanced', 'Publish']
```

**ARM template**

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.1.0",
  "metadata": {
    "_generator": {
      "name": "bicep",
      "version": "0.21.1.54444",
      "templateHash": "9713643924654560590"
    },
    "tabGroups": ["Basics", "Enclave", "Advanced", "Publish"],
...

```

For each parameter, set a `tabGroup` in the metadata (if a tab group isn't set, 'Basics' will be used). 

For example

**Bicep**

```bicep
@description('Specify the name of the VM.')
@metadata({
  displayName: 'Virtual machine name'
  required: true
  tabGroup: 'Basics'
})
param vmName string

@description('The name of the resource group containing the VNet that the VM will attach to')
@metadata({
  displayName: 'Virtual network resource group'
  required: true
  tabGroup: 'Enclave'
})
param networkingRgName string
```

**ARM template**

```json
...
  "parameters": {
    "vmName": {
      "type": "string",
      "metadata": {
        "description": "Specify the name of the VM.",
        "displayName": "Virtual machine name",
        "required": true,
        "tabGroup": "Basics"
      }
    },
    "networkingRgName": {
      "type": "string",
      "metadata": {
        "description": "The name of the resource group containing the VNet that the VM will attach to",
        "displayName": "Virtual network resource group",
        "required": true,
        "tabGroup": "Enclave"
      }
    },
...
```

### Ordering

- Parameters will be sorted by group and display in the order they're given.
- Group tabs will be ordered by the given list.

### Make accessible

Upload your template to your [Service Catalog](./what-is-the-service-catalog.md) storage account.

You can create a bicep which you should build into ARM before placing in your storage account, or you can start with an ARM template. 

## Prepopulating Enclave Parameters

We pre-populate some enclave parameter values, based on the parameter name. The parameter names we key off include: 
- diagnosticsStorageAccountName
- diagnosticsStorageAccountResourceGroup
- location
- logAnalyticsResourceId
- logAnalyticsWorkspaceName
- networkResourceGroupName
- coreResourceGroupName
- virtualNetworkName
- privateDnsZoneResourceGroupName
- keyVaultName
- keyVaultResourceGroupName
- privateDnsZoneName
- virtualNetworkResourceGroupName
- userAssignedIdentityResourceGroupName
- logAnalyticsWorkspaceResourceGroupName

If you are using an enclave paramater, make your parameter key one of the above. If it doesn't match any of the options above, reach out to someone on the service catalog team to add it. 

## Tags
The created CreateUiDefinition uses a TagsByResource element that allows you to tag each resource. You'll want to get tags from each resource in the following way: 
```
var resourceTags = contains(tags, '<resource type>) ? tags['<resource type>'] : {}
```

We'll additionally want each resource to have the deployedByServiceCatalogTag.

Set up the tags like the following example:

1. add the following parameters: 
```
@metadata({
  tabGroup: 'Tags'
})
param tags object = {}

@metadata({
  hidden: true
})
param currentDateTime string = utcNow()
```

Note: this creates a tags parameters. the date time is going to be used for our default tag. 
In order to get this, we use utcNow(), which can only be used in the parameters. We're hiding it so it isn't displayed to the user. 



2. Create a default tag, and get tags for each resource type that doesn't say existing (example for storage account)
```
var storageAccountTags = contains(tags, 'Microsoft.Storage/storageAccounts') ? tags['Microsoft.Storage/storageAccounts'] : {}

var defaultTag = {
  deployedByServiceCatalog: currentDateTime
}
```

the path for the tag is found in the resource type. use up to the @{version}.


1. Add or update the tags variable to use the default tag with the tag variable you created for that resource type
```
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-06-01' = {
  name: toLower(storageAccountName)
  location: location
  tags: union(defaultTag, storageAccountTags)
 ```
 
 Note: if the tag has a squigly under it, that means that type doesn't use tags, so don't add a tag variable to that. 
 
 For resources that have a path instead of a type, for example: 
 ```
 module privateLink '../../modules/private-endpoint.bicep' = {
  name: '${sqlServerName}-privatelink'
 ```

  look for the definition in the modules directory. That is where you'll find the resource type for getting the correct tag name. 

## CreateUIDefinition

### Purpose

A [CreateUIDefinition.json](../azure-resource-manager/managed-applications/create-uidefinition-overview.md) is used in combination with the resource template for building and styling user interface elements in the Custom Template Deployment. It follows a standard create experience from the Azure portal. 

The `SC Owner` has created helper scripts to facilitate the creation of the CreateUIDefintion.json file using the template parameters and its metadata. If the CreateUIDefinition.json file doesn't exist for a service, the user experience will be more limited.

See more details on the creation of the CreateUIDefinition file in our readme [Styling.md](https://msazure.visualstudio.com/Project-Honeycomb/_git/heather?path=/src/bicep/enclave/servicecatalog/docs/Styling.md&version=GBmain&_a=preview).

### Required

Here's the pipeline that transfers the Service Catalog artifacts (service template compiled to ARM, CreateUIDefinition.json) to the storage account used in all environments:
https://msazure.visualstudio.com/Project-Honeycomb/_git/heather?path=/src/bicep/enclave/servicecatalog

## Exemptions
Some of the AVE Deny Policies will block new template deployments without the proper Policy exemptions. As template creator, you can [create Policy exemptions](https://msazure.visualstudio.com/Project-Honeycomb/_wiki/wikis/Project-Honeycomb.wiki/616076/Policy-compliance-exemptions) in the desired workload to ensure a successful Service Catalog deployment for customers.



