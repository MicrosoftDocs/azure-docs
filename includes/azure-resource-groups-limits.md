---
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: include
ms.date: 09/26/2023
ms.author: tomfitz
---
| Resource | Limit |
| --- | --- |
| Resources per [resource group](../articles/azure-resource-manager/management/overview.md#resource-groups) | Resources aren't limited by resource group. Instead, they're limited by resource type in a resource group. See next row. |
| Resources per resource group, per resource type |800 - Some resource types can exceed the 800 limit. See [Resources not limited to 800 instances per resource group](../articles/azure-resource-manager/management/resources-without-resource-group-limit.md). |
| Deployments per resource group in the deployment history |800<sup>1</sup> |
| Resources per deployment |800 |
| Management locks per unique [scope](../articles/azure-resource-manager/management/overview.md#understand-scope)  |20 |
| Number of tags per resource or resource group |50 |
| Tag key length |512 |
| Tag value length |256 |

<sup>1</sup>Deployments are automatically deleted from the history as you near the limit. Deleting an entry from the deployment history doesn't affect the deployed resources. For more information, see [Automatic deletions from deployment history](../articles/azure-resource-manager/templates/deployment-history-deletions.md).

#### Template limits

| Value | Limit |
| --- | --- |
| Parameters |256 |
| Variables |256 |
| Resources (including copy count) |800 |
| Outputs |64 |
| Template expression |24,576 chars |
| Resources in exported templates |200 |
| Template size |4 MB |
| Resource definition size |1 MB |
| Parameter file size |4 MB |

You can exceed some template limits by using a nested template. For more information, see [Use linked templates when you deploy Azure resources](../articles/azure-resource-manager/templates/linked-templates.md). To reduce the number of parameters, variables, or outputs, you can combine several values into an object. For more information, see [Objects as parameters](/azure/architecture/guide/azure-resource-manager/advanced-templates/objects-as-parameters).

You may get an error with a template or parameter file of less than 4 MB, if the total size of the request is too large. For more information about how to simplify your template to avoid a large request, see [Resolve errors for job size exceeded](../articles/azure-resource-manager/templates/error-job-size-exceeded.md).