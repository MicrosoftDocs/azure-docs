---
title: Storage task conditions & operations
titleSuffix: Azure Storage
description: Description of Azure Storage Tasks conditions goes here.
services: storage
author: normesta

ms.service: storage-tasks
ms.topic: conceptual
ms.date: 05/10/2023
ms.author: normesta

---

# Storage task conditions and operations

A storage task performs operations on containers and blobs in an Azure Storage account based on a set of conditions that you define. This article describes the anatomy of conditions and operations and how to define them.

> [!IMPORTANT]
> Azure Storage Tasks is currently in PREVIEW and is available in the following regions: \<List regions here\>.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> To enroll, see \<sign-up form link here\>.

## Defining conditions and operations

A _condition_ contains a property, a value, and an operator. The storage tasks uses the operator to compare a property with a value to determine whether the condition is met by the target object. An _operation_ is the action a storage task performs on each object that meets the defined conditions.

You can define conditions and operations by using a visual designer in the Azure portal. The following image shows the visual designer that you can use to define the conditions and operations of a storage task.

> [!div class="mx-imgBorder"]
> ![Screenshot of the Conditions button and the Conditions editor.](./media/storage-task-conditions-operations-edit/storage-task-condition-editor.png)

Conditions and operations are stored as a JSON document that is generated based on selections that you make in the visual designer. You can view that JSON by selecting the **Code** tab that appears in the designer.  

For more information about how to define conditions and operations, see [Define storage task conditions and operations](storage-task-conditions-operations-edit.md).

## Supported properties in conditions

The following table shows the properties that you can use to compose a condition. A condition can contain string, boolean, numeric, as well as date and time properties.

| String                         | Date and time<sup>3</sup>      | Numeric        | Boolean          |
|--------------------------------|----------------------|----------------|------------------|
| AccessTier<sup>1</sup>         | AccessTierChangeTime | Content-Length | IsCurrentVersion |
| Metadata.Value                 | Creation-Time        | TagCount       |                  |
| Name                           | LastAccessTime       |                |                  |
| BlobType<sup>2</sup>           | Last-Modified        |                |                  |
| Container.Metadata.Value[Name] |                      |                |                  |
| Container.Name                 |                      |                |                  |
| Container.Metadata.Value[Name] |                      |                |                  |
| Container.Name                 |                      |                |                  |
| Tags.Value[Name]               |                      |                |                  |

<sup>1</sup>    Allowed values are `Hot`, `Cool`, or `Archive`.

<sup>2</sup>    Allowed values are `BlockBlob`, `PageBlob`, or `AppendBlob`

<sup>3</sup>    Can be set to a specific time or to a metadata value dynamically obtained from objects. See [Parameters in values](#parameters-in-values).

### Supported operators in conditions

The following table shows the operators that you can use in a condition to evaluate the value of each type of property.

| String | Date and time | Numeric | Boolean |
|---|---|---|---|
| contains | equals |equals | equals |
| empty | greater | greater | not |
| equals | greaterOrEquals |greaterOrEquals ||
| endWith | less | less ||
| length | lessOrEquals | lessOrEquals ||
| startsWith | addToTime | ||

### String matching and wildcards

Explain matching and wild card patterns. At the time of this draft, it appears that `*` and `?` are supported with the addition of a "matches" operator soon which enables the escaping of these characters in a name. This section is TBD pending the addition of the "matches" operator.

#### Obtaining date and time values dynamically

- The values for all Date and time properties in a condition can by dynamically obtained from metadata.

- The value can be any key-value attribute in the metadata of a container or the index tag of a blob.

- Provide a quick example of why anyone would care or use this capability.

- While key names have no restrictions, the value of each key must be formatted by using the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601#Durations) standard. Provide some examples of using that standard in values.

- Choose which type of metadata to reference as you design the condition in the visual editor.

  > [!div class="mx-imgBorder"]
  > ![Screenshot of the dialog box which enables you to reference metadata from objects.](./media/storage-task-conditions-operations/parameterized-condition.png)

The following table describes each option.

| Option | Description |
|--|--|
| Container metadata | Uses the value associated with a key that is defined in the metadata of each container. You specify which key to use. |
| Blob index tags | Uses the value associated with a tag that is set on objects in a container. You specify which tag to use. |
| Custom value | An amount of time that has transpired since the current date and time. You specify a number, and then choose either seconds, minutes, hours, or days. This value uses the current Data and time, and is not obtained from metadata. |
| Specific date | A specific date and time. This is value is not dynamically obtained from from metadata.  |

## Supported operations

The following table shows the supported operations, parameters, and parameter values:

| Operation | Parameters | Values |
|---|---|---|
| Set Blob Tier | Tier | Hot \| Cold \| Archive |
| Delete Blob | None | None |
| Undelete Blob | None | None |
| Set Blob Tags | TagSet | A fixed collection of up to 10 key-value pairs |
| Set Blob Immutability Policy | Need parameter names | Need value names|
| Set Blob Legal Hold | Need parameter names | Need parameter names |

Something here about the fact that there is no design-time validation. Errors are reported at run time.

### Ordering operations

- The order of operations and what order means to users.

- Include information here about onSucceed and onFailure if those capabilities make into the public preview.

## Preview

(Use an include file to share this section with the assignment article)

Describe the experience and the benefit.

It can be used to try things out. Then, you can debug issues. For example, tags value and count apply only to accounts that do not have a hierarchical namespace enabled.

## See also

- [Define conditions and operations](storage-task-conditions-operations-edit.md)
- [Storage task assignments](storage-task-assignment.md)
