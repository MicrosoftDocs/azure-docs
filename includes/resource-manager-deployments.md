## Incremental and complete deployments
When deploying your resources, you specify that the deployment is either an incremental update or a complete update. The primary difference between these two modes is how Resource Manager handles existing resources in the resource group that are not in the template. In **complete** mode, Resource Manager **deletes** resources that exist in the resource group but are not specified in the template. In incremental mode, Resource Manager **leaves unchanged** resources that exist in the resource group but are not specified in the template.

For both modes, Resource Manager attempts to provision all resources specified in the template. If the resource already exists in the resource group and the settings for that resource are unchanged, the operation results in no change.

By default, Resource Manager uses the incremental mode.

