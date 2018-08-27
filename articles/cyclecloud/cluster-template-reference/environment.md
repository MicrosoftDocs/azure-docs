# (beta) Environment


Environment is rank 1.  An environment corresponds to a [Resource Manager Deployment](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-template-deploy).

While environment is rank 1 a cluster object is required to manage the environment.

CycleCloud can now manage Azure Resource Manager deployments with ARM templates.
These environments are loaded into the CycleCloud namespace so that they can be 
referred to in CycleCloud template objects.

## Example

```ini
[environment vnet]
  ManagedLifecycle=true
  TemplateURL = az://mystorageaccount/mycontainer/${ProjectVersion}/vnet.json
  ParameterValues.backendIpAddress1 = 10.0.1.4
  VariableOverrides.virtualNetworkName = VPC

[environment appgateway]
  TemplateURL = https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-application-gateway-waf/azuredeploy.json
  ParameterValues.virtualNetworkName = ${vnet.Parameters.virtualNetworkName}

[environment existing]
  Azure.ResourceGroup = existingrg
  ManagedLifecycle = false

[cluster my-cluster]
```

The `$` is a reference to a parameter name. The `${}` is another way of referencing
a parameter name and allows reference to an environment.

## Attribute Reference

Attribute | Type | Definition
------ | ----- | ----------
Credentials | String | Name of cloud provider account
Region | String | Azure location, eg. westus2
TemplateURL | String | Valid URL for ARM template location on web. Use only one Template* attribute.
TemplateContents | String | Read in the template json as a string with `@parametername` reference. Use only one Template* attribute.
TemplatePath | String | For use with Locker. Appends path to locker for arm template location. Use only one Template* attribute.
Locker | String | For use with TemplatePath. Supports pulling arm template from locker. 
ParameterValues. | ARM Parameter | ParameterValues.my-parameter where my-parameter is a parameter. Parameters in ARM templates support string, list, integers, boolean.
VariableOverrides. | ARM Variable | VariableOverrides.my-variable where my-variable is a variable name in the ARM template. Variables in ARM templates support string, list, integers, boolean.
ParameterizeVariables | Boolean | Use with VariableValues. Expose ARM template variables in cluster UI menu and cluster template. 
VariableValues. | ARM Variable | VariableValues.my-variable. Alternative to VariableOverrides. Use with ParameterizeVariables.
Azure.ResourceGroup | String | Name of Azure Resource Group for deployment.
ManagedLifecycle | Boolean | For use with existing deployment. Default is true.
Name | String | Name of pre-exiting resource group.
Tags. | String | Use `tags.my-tag = my-tag-value` to add tags to the resource group possessing the deployment in addition to the tags assigned by CycleCloud by default.

For pre-existing deployments the environment object name refers to the ARM deployment
name.

## Using environment resources and outputs

```ini
[environment vnet]
  ManagedLifecycle=true
  TemplateURL = az://mystorageaccount/mycontainer/${ProjectVersion}/vnet.json

[cluster my-cluster]
    [[node proxy]]
        IsReturnProxy = True
        SubnetId = ${vnet.resources.'VPC/ProxySubnet'.id}
```

Following the ARM deployment model, environments will create resources and expose
those resources to the other Cluster Template objects for use.

Using the `${}` notation, you can then refer to created ARM resources in their
native schema.

Attribute | Definition
------ | ----- | ----------
Outputs. | Use as `${environment-name.Outputs.my-output}` in template where my-output is the name of an output in the ARM template.
Resources. | Use as `${environment-name.Resources.my-resource-name.key1.key2}` in template where my-resource-name is the name of a resource in the ARM template and key1, key2 are related keys in the resource object.