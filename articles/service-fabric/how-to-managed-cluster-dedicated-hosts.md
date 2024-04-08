---
title:  Add Azure Dedicated Host to a Service Fabric managed cluster (SFMC)
description: Learn how to add Azure Dedicated Host to a Service Fabric managed cluster (SFMC)
ms.topic: how-to
ms.date: 7/14/2022
---

# Introduction to Dedicated Hosts on Service Fabric managed clusters (Preview)
[Azure Dedicated Host](../virtual-machines/dedicated-hosts.md) is a service that provides physical servers - able to host one or more virtual machines - dedicated to one Azure subscription. The server is dedicated to your organization and workloads and capacity isn't shared with anyone else. Dedicated hosts are the same physical servers used in our data centers, provided as a resource. You can provision dedicated hosts within a region, availability zone, and fault domain. Then, you can place VMs directly into your provisioned hosts, in whatever configuration best meets your needs.

Using Azure Dedicated Hosts for nodes with your Service Fabric managed cluster (SFMC) has the following benefits:

* Host-level hardware isolation at the physical server level. No other VMs will be placed on your hosts. Dedicated hosts are deployed in the same data centers and share the same network and underlying storage infrastructure as other, non-isolated hosts.
* Control over maintenance events initiated by the Azure platform. While most maintenance events have little to no impact on virtual machines, there are some sensitive workloads where each second of pause can have an impact. With dedicated hosts, you can opt into a maintenance window to reduce the impact on service.

You can choose the SKU for Dedicated Hosts Virtual Machines based on your workload requirements. For more information, see [Dedicated Host Virtual Machines](https://azure.microsoft.com/pricing/details/virtual-machines/dedicated-host/). 

The following guide will take you step by step for how to add an Azure Dedicated Host to a Service Fabric managed cluster with an Azure Resource Manager template.


## Prerequisites
This guide builds upon the managed cluster quick start guide: [Deploy a Service Fabric managed cluster using Azure Resource Manager](quickstart-managed-cluster-template.md)

Before you begin:

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free)
* Retrieve a managed cluster ARM template. Sample Resource Manager templates are available in the [Azure samples on GitHub](https://github.com/Azure-Samples/service-fabric-cluster-templates). These templates can be used as a starting point for your cluster template. This guide shows how to deploy a Standard SKU cluster with two node types and 12 nodes.
* The user needs to have Microsoft.Authorization/roleAssignments/write permissions to the host group such as [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator) or [Owner](../role-based-access-control/built-in-roles.md#owner) to do role assignments in a host group. For more information, see [Assign Azure roles using the Azure portal - Azure RBAC](../role-based-access-control/role-assignments-portal.md?tabs=current#prerequisites).


## Review the template
The template used in this guide is from [Azure Samples - Service Fabric cluster templates](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-2-NT-ADH).

## Create a client certificate
Service Fabric managed clusters use a client certificate as a key for access control. If you already have a client certificate that you would like to use for access control to your cluster, you can skip this step. 

If you need to create a new client certificate, follow the steps in [set and retrieve a certificate from Azure Key Vault](../key-vault/certificates/quick-create-portal.md). Note the certificate thumbprint as it will be required to deploy the template in the next step. 

## Deploy Dedicated Host resources and configure access to Service Fabric Resource Provider

Create a dedicated host group and add a role assignment to the host group with the Service Fabric Resource Provider application using the steps below. This role assignment allows Service Fabric Resource Provider to deploy VMs on the Dedicated Hosts inside the host group to the managed cluster's virtual machine scale set. This assignment is a one-time action.

1. Get SFRP provider ID and Service Principal for Service Fabric Resource Provider application.

   ```powershell
   Login-AzAccount  
   Select-AzSubscription -SubscriptionId <SubId>  
   Get-AzADServicePrincipal -DisplayName "Azure Service Fabric Resource Provider"
   ```
   
   >[!NOTE] 
   > Make sure you are in the correct subscription, the principal ID will change if the subscription is in a different tenant.


2. Create a dedicated host group pinned to one availability zone and five fault domains using the provided [sample ARM deployment template for Dedicated Host Group](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-2-NT-ADH). The sample will ensure there is at least one dedicated host per fault domain.
   ```powershell
   New-AzResourceGroup -Name $ResourceGroupName -Location $location
   New-AzResourceGroupDeployment -Name "hostgroup-deployment" -ResourceGroupName $ResourceGroupName -TemplateFile ".\HostGroup-And-RoleAssignment.json" -TemplateParameterFile ".\HostGroup-And-RoleAssignment.parameters.json" -Debug -Verbose
   ```

   >[!NOTE] 
   > * Ensure you choose the correct SKU family for the Dedicated Host that matches the one you are going to use for the underlying node type VM SKU. For more   information, see [Dedicated Host Virtual Machines](https://azure.microsoft.com/pricing/details/virtual-machines/dedicated-host/).
   > * Each fault domain needs a dedicated host to be placed in it and Service Fabric managed clusters require five fault domains. Therefore, at least five dedicated hosts should be present in each dedicated host group.


3. The [sample ARM deployment template for Dedicated Host Group](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-2-NT-ADH) used in the previous step also adds a role assignment to the host group with contributor access. For more information on Azure roles, see [Azure built-in roles - Azure RBAC](../role-based-access-control/built-in-roles.md). This role assignment is defined in the resources section of template with Principal ID determined from the first step and a role definition ID. 

   ```JSON
      "variables": {  
           "authorizationApiVersion": "2018-01-01-preview",
           "contributorRoleId": "b24988ac-6180-42a0-ab88-20f7382dd24c",
           "SFRPAadServicePrincipalId": " <Service Fabric Resource Provider ID> -"
         },
      "resources": [
      {  
               "apiVersion": "[variables('authorizationApiVersion')]",  
               "type": "Microsoft.Compute/Hostgroups/providers/roleAssignments",  
               "name": "[concat(concat(parameters('dhgNamePrefix'), '0'), '/Microsoft.Authorization/', parameters('hostGroupRoleAssignmentId'))]",  
               "dependsOn": [  
                   "[resourceId('Microsoft.Compute/hostGroups', concat(parameters('dhgNamePrefix'), '0'))]"  
               ],  
               "properties": {  
                   "roleDefinitionId": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', variables('contributorRoleId'))]",  
                   "principalId": "[variables('SFRPAadServicePrincipalId')]"  
               }  
             }
             ]
   ```

   or you can also add role assignment via PowerShell using Principal ID determined from the first step and role definition name as "Contributor" where applicable.

   ```powershell
   New-AzRoleAssignment -PrincipalId "<Service Fabric Resource Provider ID>" -RoleDefinitionName "Contributor" -Scope "<Host Group Id>"  
   ```


## Deploy Service Fabric managed cluster

Create an Azure Service Fabric managed cluster with node type(s) configured to reference the Dedicated Host group ResourceId. The node type needs to be pinned to the same availability zone as the host group. 
1. Pick the template from [Service Fabric cluster sample template for Dedicated Host](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-2-NT-ADH), which includes specification for Dedicated Host support.


2. Provide your own values for the following template parameters:

   * Subscription: Select the same Azure subscription as the host group subscription.
   * Resource Group: Select Create new. Enter a unique name for the resource group, such as myResourceGroup, then choose OK.
   * Location: Select the same location as the host group location.
   * Cluster Name: Enter a unique name for your cluster, such as mysfcluster.
   * Admin Username: Enter a name for the admin to be used for RDP on the underlying VMs in the cluster.
   * Admin Password: Enter a password for the admin to be used for RDP on the underlying VMs in the cluster.
   * Client Certificate Thumbprint: Provide the thumbprint of the client certificate that you would like to use to access your cluster. If you don't have a certificate, follow [set and retrieve a certificate](../key-vault/certificates/quick-create-portal.md) to create a self-signed certificate.
   * Node Type Name: Enter a unique name for your node type, such as nt1.

3. Deploy an ARM template through one of the methods below:

   * ARM portal custom template experience: [Custom deployment - Microsoft Azure](https://portal.azure.com/#create/Microsoft.Template). Select the following image to sign in to Azure, and provide your own values for the template parameters, then deploy the template.

      :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fservice-fabric-cluster-templates%2Fmaster%2FSF-Managed-Standard-SKU-2-NT-ADH%2Fazuredeploy.json":::

   * ARM PowerShell cmdlets: [New-AzResourceGroupDeployment (Az.Resources)](/powershell/module/az.resources/new-azresourcegroupdeployment). Store the paths of your ARM template and parameter files in variables, then deploy the template.

      ```powershell
      $templateFilePath = "<full path to azuredeploy.json>" 
      $parameterFilePath = "<full path to azuredeploy.parameters.json>"
      $pass = (ConvertTo-SecureString -AsPlainText -Force "<adminPassword>")

      New-AzResourceGroupDeployment ` 
        -Name $DeploymentName ` 
        -ResourceGroupName $resourceGroupName ` 
        -TemplateFile $templateFilePath ` 
        -TemplateParameterFile $parameterFilePath `
        -adminPassword $pass `
        -Debug -Verbose
      ```
   
    Wait for the deployment to be completed successfully.
    
    
## Troubleshooting

1. The following error is thrown when SFRP doesn't have access to the host group. Review the role assignment steps above and ensure the assignment is done correctly.
      ```
           {  
                  "code": "LinkedAuthorizationFailed",  
                  "message": "The client '[<clientId>]' with object id '[<objectId>]' has permission to perform action 'Microsoft.Compute/virtualMachineScaleSets/write' on scope '/subscriptions/[<Subs-Id>]/resourcegroups/[<ResGrp-Id>]/providers/Microsoft.Compute/virtualMachineScaleSets/pnt'; however, it does not have permission to perform action 'write' on the linked scope(s) '/subscriptions/[<Subs-Id>]/resourceGroups/[<ResGrp-Id>]/providers/Microsoft.Compute/hostGroups/HostGroupscu0' or the linked scope(s) are invalid."
               }
      ```
2. If host group is in a different subscription than the clusters, then the following error is reported. Ensure they both are in the same subscription.
      ```
            {  
                  "code": "BadRequest",  
                  "message": "Entity subscriptionId in resource reference id /subscriptions/[<Subs-Id>]/resourceGroups/[<ResGrp-Id>]/providers/Microsoft.Compute/hostGroups/[<HostGroup>] is invalid."  
                }
      ```    
3. If Quota for Host Group isn't sufficient, following error is thrown:
      ```
            {  
                  "code": "QuotaExceeded",  
                  "message": "Operation could not be completed as it results in exceeding approved standardDSv3Family Cores quota.  
            Additional Required: 320, (Minimum) New Limit Required: 320. Submit a request for Quota increase [here](https://aka.ms/ProdportalCRP/#blade/Microsoft_Azure_Capacity/UsageAndQuota.ReactView/Parameters/). Please read more about quota limits [here](/azure/azure-supportability/per-vm-quota-requests)” 
                }
      ```
## Next steps
> [!div class="nextstepaction"]
> [Read about Service Fabric managed cluster configuration options](how-to-managed-cluster-configuration.md)
