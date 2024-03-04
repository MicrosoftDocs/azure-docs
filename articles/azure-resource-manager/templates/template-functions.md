---
title: Template functions
description: Describes the functions to use in an Azure Resource Manager template (ARM template) to retrieve values, work with strings and numerics, and retrieve deployment information.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 08/03/2023
---

# ARM template functions

This article describes all the functions you can use in an Azure Resource Manager template (ARM template). For information about using functions in your template, see [template syntax](template-expressions.md).

To create your own functions, see [User-defined functions](./syntax.md#functions).

Most functions work the same when deployed to a resource group, subscription, management group, or tenant. A few functions can't be used in all scopes. They're noted in the lists below.

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [Bicep functions](../bicep/bicep-functions.md) and [Bicep operators](../bicep/operators.md).

<a id="array" aria-hidden="true"></a>
<a id="concatarray" aria-hidden="true"></a>
<a id="contains" aria-hidden="true"></a>
<a id="createarray" aria-hidden="true"></a>
<a id="empty" aria-hidden="true"></a>
<a id="first" aria-hidden="true"></a>
<a id="intersection" aria-hidden="true"></a>
<a id="last" aria-hidden="true"></a>
<a id="length" aria-hidden="true"></a>
<a id="min" aria-hidden="true"></a>
<a id="max" aria-hidden="true"></a>
<a id="range" aria-hidden="true"></a>
<a id="skip" aria-hidden="true"></a>
<a id="take" aria-hidden="true"></a>
<a id="union" aria-hidden="true"></a>

## Any function

The [any function](../bicep/bicep-functions-any.md) is available in Bicep to help resolve issues around data type warnings.

## Array functions

Resource Manager provides several functions for working with arrays.

* [array](template-functions-array.md#array)
* [concat](template-functions-array.md#concat)
* [contains](template-functions-array.md#contains)
* [createArray](template-functions-array.md#createarray)
* [empty](template-functions-array.md#empty)
* [first](template-functions-array.md#first)
* [indexOf](template-functions-array.md#indexof)
* [intersection](template-functions-array.md#intersection)
* [last](template-functions-array.md#last)
* [lastIndexOf](template-functions-array.md#lastindexof)
* [length](template-functions-array.md#length)
* [min](template-functions-array.md#min)
* [max](template-functions-array.md#max)
* [range](template-functions-array.md#range)
* [skip](template-functions-array.md#skip)
* [take](template-functions-array.md#take)
* [union](template-functions-array.md#union)

For Bicep files, use the [array](../bicep/bicep-functions-array.md) functions.

<a id="coalesce" aria-hidden="true"></a>
<a id="equals" aria-hidden="true"></a>
<a id="less" aria-hidden="true"></a>
<a id="lessorequals" aria-hidden="true"></a>
<a id="greater" aria-hidden="true"></a>
<a id="greaterorequals" aria-hidden="true"></a>

## CIDR functions

The following functions are available for working with CIDR. All of these functions are in the `sys` namespace.

* [parseCidr](./template-functions-cidr.md#parsecidr)
* [cidrSubnet](./template-functions-cidr.md#cidrsubnet)
* [cidrHost](./template-functions-cidr.md#cidrhost)

## Comparison functions

Resource Manager provides several functions for making comparisons in your templates.

* [coalesce](template-functions-comparison.md#coalesce)
* [equals](template-functions-comparison.md#equals)
* [less](template-functions-comparison.md#less)
* [lessOrEquals](template-functions-comparison.md#lessorequals)
* [greater](template-functions-comparison.md#greater)
* [greaterOrEquals](template-functions-comparison.md#greaterorequals)

For Bicep files, use the [coalesce](../bicep/operators-logical.md) logical operator. For comparisons, use the [comparison](../bicep/operators-comparison.md) operators.

## Date functions

Resource Manager provides the following functions for working with dates.

* [dateTimeAdd](template-functions-date.md#datetimeadd)
* [dateTimeFromEpoch](template-functions-date.md#datetimefromepoch)
* [dateTimeToEpoch](template-functions-date.md#datetimetoepoch)
* [utcNow](template-functions-date.md#utcnow)

For Bicep files, use the [date](../bicep/bicep-functions-date.md) functions.

<a id="deployment" aria-hidden="true"></a>
<a id="parameters" aria-hidden="true"></a>
<a id="variables" aria-hidden="true"></a>

## Deployment value functions

Resource Manager provides the following functions for getting values from sections of the template and values related to the deployment:

* [deployment](template-functions-deployment.md#deployment)
* [environment](template-functions-deployment.md#environment)
* [parameters](template-functions-deployment.md#parameters)
* [variables](template-functions-deployment.md#variables)

For Bicep files, use the [deployment](../bicep/bicep-functions-deployment.md) functions.

<a id="and" aria-hidden="true"></a>
<a id="bool" aria-hidden="true"></a>
<a id="if" aria-hidden="true"></a>
<a id="not" aria-hidden="true"></a>
<a id="or" aria-hidden="true"></a>

## Logical functions

Resource Manager provides the following functions for working with logical conditions:

* [and](template-functions-logical.md#and)
* [bool](template-functions-logical.md#bool)
* [false](template-functions-logical.md#false)
* [if](template-functions-logical.md#if)
* [not](template-functions-logical.md#not)
* [or](template-functions-logical.md#or)
* [true](template-functions-logical.md#true)

For Bicep files, use the [bool](../bicep/bicep-functions-logical.md) logical function. For other logical values, use [logical](../bicep/operators-logical.md) operators.

<a id="add" aria-hidden="true"></a>
<a id="copyindex" aria-hidden="true"></a>
<a id="div" aria-hidden="true"></a>
<a id="float" aria-hidden="true"></a>
<a id="int" aria-hidden="true"></a>
<a id="minint" aria-hidden="true"></a>
<a id="maxint" aria-hidden="true"></a>
<a id="mod" aria-hidden="true"></a>
<a id="mul" aria-hidden="true"></a>
<a id="sub" aria-hidden="true"></a>

## Numeric functions

Resource Manager provides the following functions for working with integers:

* [add](template-functions-numeric.md#add)
* [copyIndex](template-functions-numeric.md#copyindex)
* [div](template-functions-numeric.md#div)
* [float](template-functions-numeric.md#float)
* [int](template-functions-numeric.md#int)
* [min](template-functions-numeric.md#min)
* [max](template-functions-numeric.md#max)
* [mod](template-functions-numeric.md#mod)
* [mul](template-functions-numeric.md#mul)
* [sub](template-functions-numeric.md#sub)

For Bicep files that use `int`, `min`, and `max` use [numeric](../bicep/bicep-functions-numeric.md) functions. For other numeric values, use [numeric](../bicep/operators-numeric.md) operators.

<a id="json" aria-hidden="true"></a>

## Object functions

Resource Manager provides several functions for working with objects.

* [contains](template-functions-object.md#contains)
* [createObject](template-functions-object.md#createobject)
* [empty](template-functions-object.md#empty)
* [intersection](template-functions-object.md#intersection)
* [items](template-functions-object.md#items)
* [json](template-functions-object.md#json)
* [length](template-functions-object.md#length)
* [null](template-functions-object.md#null)
* [union](template-functions-object.md#union)

For Bicep files, use the [object](../bicep/bicep-functions-object.md) functions.

<a id="extensionResourceId" aria-hidden="true"></a>
<a id="listkeys" aria-hidden="true"></a>
<a id="list" aria-hidden="true"></a>
<a id="providers" aria-hidden="true"></a>
<a id="reference" aria-hidden="true"></a>
<a id="resourceid" aria-hidden="true"></a>
<a id="subscriptionResourceId" aria-hidden="true"></a>
<a id="tenantResourceId" aria-hidden="true"></a>

## Resource functions

Resource Manager provides the following functions for getting resource values:

* [extensionResourceId](template-functions-resource.md#extensionresourceid)
* [listAccountSas](template-functions-resource.md#list)
* [listKeys](template-functions-resource.md#listkeys)
* [listSecrets](template-functions-resource.md#list)
* [list*](template-functions-resource.md#list)
* [pickZones](template-functions-resource.md#pickzones)
* [providers (deprecated)](template-functions-resource.md#providers)
* [reference](template-functions-resource.md#reference)
* [references](template-functions-resource.md#references)
* [resourceId](template-functions-resource.md#resourceid) - can be used at any scope, but the valid parameters change depending on the scope.
* [subscriptionResourceId](template-functions-resource.md#subscriptionresourceid)
* [tenantResourceId](template-functions-resource.md#tenantresourceid)

For Bicep files, use the [resource](../bicep/bicep-functions-resource.md) functions.

<a id="managementgroup" aria-hidden="true"></a>
<a id="resourcegroup" aria-hidden="true"></a>
<a id="subscription" aria-hidden="true"></a>
<a id="tenant" aria-hidden="true"></a>

## Scope functions

Resource Manager provides the following functions for getting deployment scope values:

* [managementGroup](template-functions-scope.md#managementgroup) - can only be used in deployments to a management group.
* [resourceGroup](template-functions-scope.md#resourcegroup) - can only be used in deployments to a resource group.
* [subscription](template-functions-scope.md#subscription) - can only be used in deployments to a resource group or subscription.
* [tenant](template-functions-scope.md#tenant) - can be used for deployments at any scope.

For Bicep files, use the [scope](../bicep/bicep-functions-scope.md) functions.

<a id="base64" aria-hidden="true"></a>
<a id="base64tojson" aria-hidden="true"></a>
<a id="base64tostring" aria-hidden="true"></a>
<a id="concat" aria-hidden="true"></a>
<a id="containsstring" aria-hidden="true"></a>
<a id="datauri" aria-hidden="true"></a>
<a id="datauritostring" aria-hidden="true"></a>
<a id="emptystring" aria-hidden="true"></a>
<a id="endswith" aria-hidden="true"></a>
<a id="firststring" aria-hidden="true"></a>
<a id="guid" aria-hidden="true"></a>
<a id="indexof" aria-hidden="true"></a>
<a id="laststring" aria-hidden="true"></a>
<a id="lastindexof" aria-hidden="true"></a>
<a id="lengthstring" aria-hidden="true"></a>
<a id="padleft" aria-hidden="true"></a>
<a id="replace" aria-hidden="true"></a>
<a id="skipstring" aria-hidden="true"></a>
<a id="split" aria-hidden="true"></a>
<a id="startswith" aria-hidden="true"></a>
<a id="string" aria-hidden="true"></a>
<a id="substring" aria-hidden="true"></a>
<a id="takestring" aria-hidden="true"></a>
<a id="tolower" aria-hidden="true"></a>
<a id="toupper" aria-hidden="true"></a>
<a id="trim" aria-hidden="true"></a>
<a id="uniquestring" aria-hidden="true"></a>
<a id="uri" aria-hidden="true"></a>
<a id="uricomponent" aria-hidden="true"></a>
<a id="uricomponenttostring" aria-hidden="true"></a>

## String functions

Resource Manager provides the following functions for working with strings:

* [base64](template-functions-string.md#base64)
* [base64ToJson](template-functions-string.md#base64tojson)
* [base64ToString](template-functions-string.md#base64tostring)
* [concat](template-functions-string.md#concat)
* [contains](template-functions-string.md#contains)
* [dataUri](template-functions-string.md#datauri)
* [dataUriToString](template-functions-string.md#datauritostring)
* [empty](template-functions-string.md#empty)
* [endsWith](template-functions-string.md#endswith)
* [first](template-functions-string.md#first)
* [format](template-functions-string.md#format)
* [guid](template-functions-string.md#guid)
* [indexOf](template-functions-string.md#indexof)
* [join](template-functions-string.md#join)
* [last](template-functions-string.md#last)
* [lastIndexOf](template-functions-string.md#lastindexof)
* [length](template-functions-string.md#length)
* [newGuid](template-functions-string.md#newguid)
* [padLeft](template-functions-string.md#padleft)
* [replace](template-functions-string.md#replace)
* [skip](template-functions-string.md#skip)
* [split](template-functions-string.md#split)
* [startsWith](template-functions-string.md#startswith)
* [string](template-functions-string.md#string)
* [substring](template-functions-string.md#substring)
* [take](template-functions-string.md#take)
* [toLower](template-functions-string.md#tolower)
* [toUpper](template-functions-string.md#toupper)
* [trim](template-functions-string.md#trim)
* [uniqueString](template-functions-string.md#uniquestring)
* [uri](template-functions-string.md#uri)
* [uriComponent](template-functions-string.md#uricomponent)
* [uriComponentToString](template-functions-string.md#uricomponenttostring)

For Bicep files, use the [string](../bicep/bicep-functions-string.md) functions.

## Next steps

* For a description of the sections in an ARM template, see [Understand the structure and syntax of ARM templates](./syntax.md).
* To merge multiple templates, see [Using linked and nested templates when deploying Azure resources](linked-templates.md).
* To iterate a specified number of times when creating a type of resource, see [Resource iteration in ARM templates](copy-resources.md).
* To see how to deploy the template you've created, see [Deploy resources with ARM templates and Azure PowerShell](deploy-powershell.md).
