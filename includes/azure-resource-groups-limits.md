| Resource | Default Limit | Maximum Limit |
| --- | --- | --- |
| Resources per [resource group](../articles/azure-resource-manager/resource-group-overview.md#resource-groups) (per resource type) |800 |Varies per resource type |
| Deployments per resource group |800 |800 |
| Resources per deployment |800 |800 |
| Management Locks (per unique scope) |20 |20 |
| Number of Tags (per resource or resource group) |15 |15 |
| Tag key length |512 |512 |
| Tag value length |256 |256 |


#### Template limits

| Value | Default Limit | Maximum Limit |
| --- | --- | --- |
| Parameters |256 |256 |
| Variables |256 |256 |
| Resources (including copy count) |800 |800 |
| Outputs |64 |64 |
| Template expression |24,576 chars |24,576 chars |
| Resources in exported templates |200 |200 | 
| Template size |1 MB |1 MB |
| Parameter file size |64 KB |64 KB |

You can exceed some template limits by using a nested template. For more information, see [Using linked templates when deploying Azure resources](../articles/azure-resource-manager/resource-group-linked-templates.md). To reduce the number of parameters, variables, or outputs, you can combine several values into an object. For more information, see [Objects as parameters](../articles/azure-resource-manager/resource-manager-objects-as-parameters.md).