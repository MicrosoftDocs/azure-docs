## Incremental and complete deployments
When deploying your resources, you specify that the deployment is either an incremental update or a complete update. The primary difference between these two modes is how Resource Manager handles existing resources in the resource group that are not in the template:

* In complete mode, Resource Manager **deletes** resources that exist in the resource group but are not specified in the template. 
* In incremental mode, Resource Manager **leaves unchanged** resources that exist in the resource group but are not specified in the template.

For both modes, Resource Manager attempts to provision all resources specified in the template. If the resource already exists in the resource group and its settings are unchanged, the operation results in no change. If you change the settings for a resource, the resource is provisioned with those new settings. However, you cannot update the location or type of an existing resource. Instead, deploy a new resource with the location or type that you need.

By default, Resource Manager uses the incremental mode.

