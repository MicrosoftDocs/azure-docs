## Incremental and complete deployments

By default, Resource Manager handles deployments as incremental updates to the resource group. With incremental deployment, Resource Manager:

- **leaves unchanged** resources that exist in the resource group but are not specified in the template
- **adds** resources that are specified in the template but do not exist in the resource group 
- **does not re-provision** resources that exist in the resource group in the same condition defined in the template
- **re-provisions** existing resources that have updated settings in the template

With complete deployment, Resource Manager:

- **deletes** resources that exist in the resource group but are not specified in the template
- **adds** resources that are specified in the template but do not exist in the resource group 
- **does not re-provision** resources that exist in the resource group in the same condition defined in the template
- **re-provisions** existing resources that have updated settings in the template
 
You specify the type of deployment through the **Mode** property.
