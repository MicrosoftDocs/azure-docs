---
title: Bicep functions
description: Describes the functions to use in a Bicep file to retrieve values, work with strings and numerics, and retrieve deployment information.
ms.topic: conceptual
ms.date: 06/16/2021
---

# Bicep functions

This article describes all the functions you can use in a Bicep file. For a description of the sections in a Bicep file, see [Understand the structure and syntax of Bicep files](./file.md).

Most functions work the same when deployed to a resource group, subscription, management group, or tenant. A few functions can't be used in all scopes. They're noted in the lists below.

## Any function

The [any function](./bicep-functions-any.md) is available in Bicep to help resolve issues around data type warnings.

## Array functions

The following functions are available for working with arrays.

* [array](./bicep-functions-array.md#array)
* [concat](./bicep-functions-array.md#concat)
* [contains](./bicep-functions-array.md#contains)
* [empty](./bicep-functions-array.md#empty)
* [first](./bicep-functions-array.md#first)
* [intersection](./bicep-functions-array.md#intersection)
* [last](./bicep-functions-array.md#last)
* [length](./bicep-functions-array.md#length)
* [min](./bicep-functions-array.md#min)
* [max](./bicep-functions-array.md#max)
* [range](./bicep-functions-array.md#range)
* [skip](./bicep-functions-array.md#skip)
* [take](./bicep-functions-array.md#take)
* [union](./bicep-functions-array.md#union)

## Date functions

The following functions are available for working with dates.

* [dateTimeAdd](./bicep-functions-date.md#datetimeadd)
* [utcNow](./bicep-functions-date.md#utcnow)

## Deployment value functions

The following functions are available for getting values related to the deployment:

* [deployment](./bicep-functions-deployment.md#deployment)
* [environment](./bicep-functions-deployment.md#environment)

## Logical functions

The following function is available for working with logical conditions:

* [bool](./bicep-functions-logical.md#bool)

## Numeric functions

The following functions are available for working with integers:

* [int](./bicep-functions-numeric.md#int)
* [min](./bicep-functions-numeric.md#min)
* [max](./bicep-functions-numeric.md#max)

## Object functions

The following functions are available for working with objects.

* [contains](./bicep-functions-object.md#contains)
* [empty](./bicep-functions-object.md#empty)
* [intersection](./bicep-functions-object.md#intersection)
* [json](./bicep-functions-object.md#json)
* [length](./bicep-functions-object.md#length)
* [union](./bicep-functions-object.md#union)

## Resource functions

The following functions are available for getting resource values:

* [extensionResourceId](./bicep-functions-resource.md#extensionresourceid)
* [getSecret](./bicep-functions-resource.md#getsecret)
* [listAccountSas](./bicep-functions-resource.md#list)
* [listKeys](./bicep-functions-resource.md#listkeys)
* [listSecrets](./bicep-functions-resource.md#list)
* [list*](./bicep-functions-resource.md#list)
* [pickZones](./bicep-functions-resource.md#pickzones)
* [reference](./bicep-functions-resource.md#reference)
* [resourceId](./bicep-functions-resource.md#resourceid) - can be used at any scope, but the valid parameters change depending on the scope.
* [subscriptionResourceId](./bicep-functions-resource.md#subscriptionresourceid)
* [tenantResourceId](./bicep-functions-resource.md#tenantresourceid)

## Scope functions

The following functions are available for getting scope values.

* [managementGroup](./bicep-functions-scope.md#managementgroup)
* [resourceGroup](./bicep-functions-scope.md#resourcegroup) - can only be used in deployments to a resource group.
* [subscription](./bicep-functions-scope.md#subscription) - can only be used in deployments to a resource group or subscription.
* [tenant](./bicep-functions-scope.md#tenant)

## String functions

Bicep provides the following functions for working with strings:

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
* To iterate a specified number of times when creating a type of resource, see [Deploy multiple instances of resources in Bicep](./loop-resources.md).
* To see how to deploy the Bicep file you've created, see [Deploy resources with Bicep and Azure PowerShell](./deploy-powershell.md).
