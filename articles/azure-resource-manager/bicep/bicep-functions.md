---
title: Bicep functions
description: Describes the functions to use in a Bicep file to retrieve values, work with strings and numerics, and retrieve deployment information.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 06/05/2023
---

# Bicep functions

This article describes all the functions you can use in a Bicep file. For a description of the sections in a Bicep file, see [Understand the structure and syntax of Bicep files](./file.md).

Most functions work the same when deployed to a resource group, subscription, management group, or tenant. A few functions can't be used in all scopes. They're noted in the lists below.

## Namespaces for functions

All Bicep functions are contained within two namespaces - `az` and `sys`. Typically, you don't need to specify the namespace when you use the function. You specify the namespace only when the function name is the same as another item you've defined in the Bicep file. For example, if you create a parameter named `range`, you need to differentiate the `range` function by adding the `sys` namespace.

```bicep
// Parameter contains the same name as a function
param range int

// Must use sys namespace to call the function.
// The second use of range refers to the parameter.
output result array = sys.range(1, range)
```

The `az` namespace contains functions that are specific to an Azure deployment. The `sys` namespace contains functions that are used to construct values. The `sys` namespace also includes decorators for parameters and resource loops. The namespaces are noted in this article.

## Any function

The [any function](./bicep-functions-any.md) is available in Bicep to help resolve issues around data type warnings. This function is in the `sys` namespace.

## Array functions

The following functions are available for working with arrays. All of these functions are in the `sys` namespace.

* [array](./bicep-functions-array.md#array)
* [concat](./bicep-functions-array.md#concat)
* [contains](./bicep-functions-array.md#contains)
* [empty](./bicep-functions-array.md#empty)
* [indexOf](./bicep-functions-array.md#indexof)
* [first](./bicep-functions-array.md#first)
* [flatten](./bicep-functions-array.md#flatten)
* [intersection](./bicep-functions-array.md#intersection)
* [last](./bicep-functions-array.md#last)
* [lastIndexOf](./bicep-functions-array.md#lastindexof)
* [length](./bicep-functions-array.md#length)
* [min](./bicep-functions-array.md#min)
* [max](./bicep-functions-array.md#max)
* [range](./bicep-functions-array.md#range)
* [skip](./bicep-functions-array.md#skip)
* [take](./bicep-functions-array.md#take)
* [union](./bicep-functions-array.md#union)

## CIDR functions

The following functions are available for working with CIDR. All of these functions are in the `sys` namespace.

* [parseCidr](./bicep-functions-cidr.md#parsecidr)
* [cidrSubnet](./bicep-functions-cidr.md#cidrsubnet)
* [cidrHost](./bicep-functions-cidr.md#cidrhost)

## Date functions

The following functions are available for working with dates. All of these functions are in the `sys` namespace.

* [dateTimeAdd](./bicep-functions-date.md#datetimeadd)
* [dateTimeFromEpoch](./bicep-functions-date.md#datetimefromepoch)
* [dateTimeToEpoch](./bicep-functions-date.md#datetimetoepoch)
* [utcNow](./bicep-functions-date.md#utcnow)

## Deployment value functions

The following functions are available for getting values related to the deployment. All of these functions are in the `az` namespace.

* [deployment](./bicep-functions-deployment.md#deployment)
* [environment](./bicep-functions-deployment.md#environment)

## File functions

The following functions are available for loading the content from external files into your Bicep file. All of these functions are in the `sys` namespace.

* [loadFileAsBase64](bicep-functions-files.md#loadfileasbase64)
* [loadJsonContent](bicep-functions-files.md#loadjsoncontent)
* [loadYamlContent](bicep-functions-files.md#loadyamlcontent)
* [loadTextContent](bicep-functions-files.md#loadtextcontent)

## Lambda functions

The following functions are available for working with lambda expressions. All of these functions are in the `sys` namespace.

* [filter](bicep-functions-lambda.md#filter)
* [map](bicep-functions-lambda.md#map)
* [reduce](bicep-functions-lambda.md#reduce)
* [sort](bicep-functions-lambda.md#sort)

## Logical functions

The following function is available for working with logical conditions. This function is in the `sys` namespace.

* [bool](./bicep-functions-logical.md#bool)

## Numeric functions

The following functions are available for working with integers. All of these functions are in the `sys` namespace.

* [int](./bicep-functions-numeric.md#int)
* [min](./bicep-functions-numeric.md#min)
* [max](./bicep-functions-numeric.md#max)

## Object functions

The following functions are available for working with objects. All of these functions are in the `sys` namespace.

* [contains](./bicep-functions-object.md#contains)
* [empty](./bicep-functions-object.md#empty)
* [intersection](./bicep-functions-object.md#intersection)
* [items](./bicep-functions-object.md#items)
* [json](./bicep-functions-object.md#json)
* [length](./bicep-functions-object.md#length)
* [union](./bicep-functions-object.md#union)

## Parameters file functions

The [getSecret function](./bicep-functions-parameters-file.md) is available in Bicep to get secure value from a KeyVault. This function is in the `az` namespace.

The [readEnvironmentVariable function](./bicep-functions-parameters-file.md) is available in Bicep to read environment variable values. This function is in the `sys` namespace.

## Resource functions

The following functions are available for getting resource values. Most of these functions are in the `az` namespace. The list functions and the getSecret function are called directly on the resource type, so they don't have a namespace qualifier.

* [extensionResourceId](./bicep-functions-resource.md#extensionresourceid)
* [getSecret](./bicep-functions-resource.md#getsecret)
* [listAccountSas](./bicep-functions-resource.md#list)
* [listKeys](./bicep-functions-resource.md#listkeys)
* [listSecrets](./bicep-functions-resource.md#list)
* [list*](./bicep-functions-resource.md#list)
* [pickZones](./bicep-functions-resource.md#pickzones)
* [providers (deprecated)](./bicep-functions-resource.md#providers)
* [reference](./bicep-functions-resource.md#reference)
* [resourceId](./bicep-functions-resource.md#resourceid) - can be used at any scope, but the valid parameters change depending on the scope.
* [subscriptionResourceId](./bicep-functions-resource.md#subscriptionresourceid)
* [tenantResourceId](./bicep-functions-resource.md#tenantresourceid)

## Scope functions

The following functions are available for getting scope values. All of these functions are in the `az` namespace.

* [managementGroup](./bicep-functions-scope.md#managementgroup)
* [resourceGroup](./bicep-functions-scope.md#resourcegroup) - can only be used in deployments to a resource group.
* [subscription](./bicep-functions-scope.md#subscription) - can only be used in deployments to a resource group or subscription.
* [tenant](./bicep-functions-scope.md#tenant)

## String functions

Bicep provides the following functions for working with strings. All of these functions are in the `sys` namespace.

* [base64](./bicep-functions-string.md#base64)
* [base64ToJson](./bicep-functions-string.md#base64tojson)
* [base64ToString](./bicep-functions-string.md#base64tostring)
* [concat](./bicep-functions-string.md#concat)
* [contains](./bicep-functions-string.md#contains)
* [dataUri](./bicep-functions-string.md#datauri)
* [dataUriToString](./bicep-functions-string.md#datauritostring)
* [empty](./bicep-functions-string.md#empty)
* [endsWith](./bicep-functions-string.md#endswith)
* [first](./bicep-functions-string.md#first)
* [format](./bicep-functions-string.md#format)
* [guid](./bicep-functions-string.md#guid)
* [indexOf](./bicep-functions-string.md#indexof)
* [join](./bicep-functions-string.md#join)
* [last](./bicep-functions-string.md#last)
* [lastIndexOf](./bicep-functions-string.md#lastindexof)
* [length](./bicep-functions-string.md#length)
* [newGuid](./bicep-functions-string.md#newguid)
* [padLeft](./bicep-functions-string.md#padleft)
* [replace](./bicep-functions-string.md#replace)
* [skip](./bicep-functions-string.md#skip)
* [split](./bicep-functions-string.md#split)
* [startsWith](./bicep-functions-string.md#startswith)
* [string](./bicep-functions-string.md#string)
* [substring](./bicep-functions-string.md#substring)
* [take](./bicep-functions-string.md#take)
* [toLower](./bicep-functions-string.md#tolower)
* [toUpper](./bicep-functions-string.md#toupper)
* [trim](./bicep-functions-string.md#trim)
* [uniqueString](./bicep-functions-string.md#uniquestring)
* [uri](./bicep-functions-string.md#uri)
* [uriComponent](./bicep-functions-string.md#uricomponent)
* [uriComponentToString](./bicep-functions-string.md#uricomponenttostring)

## Next steps

* For a description of the sections in a Bicep file, see [Understand the structure and syntax of Bicep files](./file.md).
* To iterate a specified number of times when creating a type of resource, see [Iterative loops in Bicep](loops.md).
* To see how to deploy the Bicep file you've created, see [Deploy resources with Bicep and Azure PowerShell](./deploy-powershell.md).
