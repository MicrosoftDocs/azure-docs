---
title:  Add Azure Dedicated Host to a Service Fabric managed cluster (SFMC)
description: Learn how to add Azure Dedicated Host to a Service Fabric managed cluster (SFMC)
ms.topic: how-to
ms.date: 7/14/2022
---

# Introduction to Dedicated Hosts on Service Fabric managed clusters
[Azure Dedicated Host](../virtual-machines/dedicated-hosts.md) is a service that provides physical servers - able to host one or more virtual machines - dedicated to one Azure subscription. The server is dedicated to your organization and workloads and capacity is not shared with anyone else. Dedicated hosts are the same physical servers used in our data centers, provided as a resource. You can provision dedicated hosts within a region, availability zone, and fault domain. Then, you can place VMs directly into your provisioned hosts, in whatever configuration best meets your needs.

Using Azure Dedicated Hosts for nodes with your SFMC cluster has the following benefits:

* Host-level hardware isolation at the physical server level. No other VMs will be placed on your hosts. hardware isolation helps Dedicated hosts are deployed in the same data centers and share the same network and underlying storage infrastructure as other, non-isolated hosts. 
* Control over maintenance events initiated by the Azure platform. While most maintenance events have little to no impact on virtual machines, there are some sensitive workloads where each second of pause can have an impact. With dedicated hosts, you can opt into a maintenance window to reduce the impact on service.

You can choose the SKU for Dedicated Hosts Virtual Machines based on your workload requirements. For information on pricing, see [Pricing - Dedicated Host Virtual Machines | Microsoft Azure](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/dedicated-host/). The following will take you step by step for how to add an Azure Dedicated Host to a Service Fabric managed cluster with an Azure Resource Manager template.


## Prerequisites
This guide builds upon the managed cluster quick start guide: Deploy a Service Fabric managed cluster using Azure Resource Manager(../service-fabric/quickstart-managed-cluster-template.md)

Before you begin:

* If you do not have an Azure subscription, create a [free account](https://azure.microsoft.com/free)
* Retrieve a managed cluster ARM template. Sample Resource Manager templates are available in the [Azure samples on GitHub](https://github.com/Azure-Samples/service-fabric-cluster-templates). These templates can be used as a starting point for your cluster template. For the sake of this guide, we will be using a six-node Standard SKU cluster.

## Review the template
The template used in this guide is from [Azure Samples - Service Fabric cluster templates](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-1-NT-ADH).

## Create a client certificate
Service Fabric managed clusters use a client certificate as a key for access control. If you already have a client certificate that you would like to use for access control to your cluster, you can skip this step. 

If you need to create a new client certificate, follow the steps in [set and retrieve a certificate from Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/certificates/quick-create-portal). Note the certificate thumbprint as this will be required to deploy the template in the next step. 

## Deploy Dedicated Host Resources
1) Create a dedicated host group pinned to one Availability Zone and five Fault Domains using the provided sample ARM deployment template. The sample will ensure there    is at least one dedicated host per Fault Domain.
```powershell
New-AzResourceGroup -Name $ResourceGroupName -Location $location
New-AzResourceGroupDeployment -Name "hostgroup-deployment" -ResourceGroupName $ResourceGroupName -TemplateFile ".\hostTemplate_sample.json" -hostGroupName $hostGroupName -dedicatedHostNamePrefix $dedicatedHostNamePrefix -dedicatedHostSKU $dedicatedHostSKU -Debug –Verbose 
```

>[!NOTE] 
> 1) At least 5 dedicated hosts should be present in each dedicated host group.
> 2) Ensure you use the correct sku family that matches the one you are going to use for the node type vmSize. See [Azure Dedicated Host pricing](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/dedicated-host/) for more information.


2) Once the Host group is successfully created, provide access for the Host group to Azure Service Fabric managed clusters service.

   a) Add a role assignment to the host group with the Service Fabric Resource Provider application. This assignment allows Service Fabric Resource Provider to deploy VMs on the Dedicated Hosts inside the host group, created on the previous step, to the managed cluster's virtual machine scale set. This is a one-time action.
   

   b) Get SFRP provider id and Service Principal for Service Fabric Resource Provider application:
   ```powershell
   Login-AzAccount  
   Select-AzSubscription -SubscriptionId <SubId>  
   Get-AzADServicePrincipal -DisplayName "Azure Service Fabric Resource Provider"
   ```

   c) Add role assignment to host group with contributor access. This role assignment can be created via PowerShell using the Id of the previous output as principal ID    and role definition name as "Contributor" where applicable. Please see [Azure built-in roles - Azure RBAC](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#all) for more information on Azure roles.

   ```powershell
   New-AzRoleAssignment -PrincipalId "<Service Fabric Resource Provider ID>" -RoleDefinitionName "Contributor" -Scope "<Host Group Id>"  
   ```

      Alternatively, you can also use a template. This role assignment can be defined in the resources section template using the Principal ID and role definition ID: 

   ```JSON
   "variables": {  
           "authorizationApiVersion": "2018-01-01-preview",
           "contributorRoleId": "b24988ac-6180-42a0-ab88-20f7382dd24c",
           "SFRPAadServicePrincipalId": " <Service Fabric Resource Provider ID> -"
       },
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
   ```

>[!NOTE] 
> 1) To do role assignments in a host group, the user needs to have admin access to the host group. Please see this doc [Assign Azure roles using the Azure portal - Azure RBAC | Microsoft Docs](https://docs.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal?tabs=current#prerequisites) for more information.
> 2) Make sure you are in the correct subscription, the principal ID will change if the subscription is in a different tenant.


## Deploy Service Fabric managed cluster with Dedicated Host

Create an Azure Service Fabric managed cluster with node type(s) configured to reference the Dedicated Host group ResourceId. The node type needs to be pinned to the same zone as the host group. 
The template used in this guide is from [Azure-Samples - Service Fabric cluster templates](https://github.com/Azure-Samples/service-fabric-cluster-templates). The template is too long to show here.

1) Store the paths of your ARM template and parameter files in variables, then deploy the template.

```powershell
$templateFilePath = "<full path to azuredeploy.json>" 
$parameterFilePath = "<full path to azuredeploy.parameters.json>" 
```

2) Provide your own values for the following template parameters:

   a) Subscription: Select an Azure subscription. 
   b) Resource Group: Select Create new. Enter a unique name for the resource group, such as myResourceGroup, then choose OK.
   c) Location: Select a location.
   d) Cluster Name: Enter a unique name for your cluster, such as mysfcluster. 
   e) Admin Username: Enter a name for the admin to be used for RDP on the underlying VMs in the cluster. 
   f) Admin Password: Enter a password for the admin to be used for RDP on the underlying VMs in the cluster. 
   g) Client Certificate Thumbprint: Provide the thumbprint of the client certificate that you would like to use to access your cluster. If you do not have a certificate, follow set and retrieve a certificate to create a self-signed certificate.
   h) Node Type Name: Enter a unique name for your node type, such as nt1.
   
```powershell
New-AzResourceGroupDeployment ` 
    -Name $DeploymentName ` 
    -ResourceGroupName $resourceGroupName ` 
    -TemplateFile $templateFilePath ` 
    -TemplateParameterFile $parameterFilePath ` 
    -Verbose
```

3) There are two straightforward ways to deploy an ARM template:
      a) Through ARM portal custom template experience: [Custom deployment - Microsoft Azure](https://ms.portal.azure.com/#create/Microsoft.Template)
      b) Through ARM powershell cmdlets: [New-AzResourceGroupDeployment (Az.Resources) | Microsoft Docs](https://docs.microsoft.com/en-us/powershell/module/az.resources/new-azresourcegroupdeployment?view=azps-8.0.0)
   
4) Deploy the template through your chosen method. It takes a few minutes for your managed Service Fabric cluster to deploy. Wait for the deployment to be completed successfully.

## Troubleshooting

1) The following error is thrown when SFRP does not have access to the host group:

{  
      "code": "LinkedAuthorizationFailed",  
      "message": "The client '[<clientId>]' with object id '[<objectId>]' has permission to perform action 'Microsoft.Compute/virtualMachineScaleSets/write' on scope '/subscriptions/[<Subs-Id>]/resourcegroups/[<ResGrp-Id>]/providers/Microsoft.Compute/virtualMachineScaleSets/pnt'; however, it does not have permission to perform action 'write' on the linked scope(s) '/subscriptions/[<Subs-Id>]/resourceGroups/[<ResGrp-Id>]/providers/Microsoft.Compute/hostGroups/HostGroupscu0' or the linked scope(s) are invalid."
    }
    
2) If Host Group is in a different subscription than the clusters, then the following error is reported:

{  
      "code": "BadRequest",  
      "message": "Entity subscriptionId in resource reference id /subscriptions/[<Subs-Id>]/resourceGroups/[<ResGrp-Id>]/providers/Microsoft.Compute/hostGroups/[<HostGroup>] is invalid."  
    }
    
3) If Quota for Host Group is not sufficient, following error is thrown:

{  
      "code": "QuotaExceeded",  
      "message": "Operation could not be completed as it results in exceeding approved standardDSv3Family Cores quota.  
Additional Required: 320, (Minimum) New Limit Required: 320. Submit a request for Quota increase [here](https://aka.ms/ProdportalCRP/#blade/Microsoft_Azure_Capacity/UsageAndQuota.ReactView/Parameters/). Please read more about quota limits [here](https://docs.microsoft.com/en-us/azure/azure-supportability/per-vm-quota-requests)” 
    }

## Next steps
>[!div class="nextstepaction"]
>[Read about Service Fabric managed cluster configuration options](how-to-managed-cluster-configuration.md)
