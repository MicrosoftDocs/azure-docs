The template for your deployment can be:

- a local file
- an external file available through URI - This option works well for templates stored in github or a storage account. In a storage account, you can restrict access to the template and provide a shared access signature (SAS) token during deployment.

## Incremental and complete deployments

By default, Resource Manager handles deployments as incremental updates to the resource group. With incremental deployment, Resource Manager:

- **leaves unchanged** resources that exist in the resource group but are not specified in the template
- **adds** resources that are specified in the template but do not exist in the resource group 
- **does not re-provision** resources that exist in the resource group in the same condition defined in the template

With complete deployment, Resource Manager:

- **deletes** resources that exist in the resource group but are not specified in the template
- **adds** resources that are specified in the template but do not exist in the resource group 
- **does not re-provision** resources that exist in the resource group in the same condition defined in the template
 
You specify the type of deployment through the **Mode** property.