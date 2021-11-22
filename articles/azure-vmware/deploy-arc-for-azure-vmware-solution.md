---
title: Deploy Arc for Azure VMware Solution 
description: Learn how to set up and enable Arc for your Azure VMware Solution private cloud.
ms.topic: how-to 
ms.date: 12/03/2021
---
# Deploy Arc for Azure VMware Solution

This article will help you deploy Arc for Azure VMware Solution. After you have set up the components needed for this public preview; you will be able to execute operations in Azure VMware Solution vCenter from the Azure portal. Operations are related to Create, Read, Update, and Delete (CRUD) Virtual Machines (VM) in Arc enabled Azure VMware Solution private cloud. User can also enable guest management and install Azure extensions once the private cloud is Arc enabled.

Before you begin checking off the prerequisites below, verify the following actions have been done:
 
- You've deployed an Azure VMware Solution private cluster. 
- You have a connection from your on-prem environment and /or from your native Azure Virtual Network to the Azure VMware Solution private cloud. 
- There should be an isolated NSX-T segment for deploying the Arc for Azure VMware Solution Open Virtualization Appliance (OVA). If an isolated NSX-T segment does not exist, one will be created.

## Prerequisites 

The following is needed to ensure you're set up to begin the onboarding process to deploy Arc for Azure VMware Solution.

- A jump box Virtual Machine (VM) with network access to the Azure VMware Solution vCenter. From the jump-box/virtual machine, ensure you have access to vCenter and NSX-T portals. 
- Internet access from jump box VM. 
- Verify that your Azure Subscription has been enabled. 
- A minimum of three free non-overlapping IPs addresses.  
- Verify that your vCenter Server is 6.7 or above. 
- A resource pool with minimum free capacity of 16 GB of RAM, 4 vCPUs. 
- A datastore with minimum 100 GB of free disk space that is available through the resource pool. 
- On the vCenter Server, allow inbound connections on TCP port 443, so that the Arc resource bridge and VMware cluster extension can communicate with the vCenter server. 

>[!NOTE]
> Only the default port of 443 is supported if you use a different port, Appliance VM creation will fail. 

For Network planning and setup, use the [Network planning checklist - Azure VMware Solution | Microsoft Docs](https://docs.microsoft.com/azure/azure-vmware/tutorial-network-checklist)

### Manual registration to Arc for Azure VMware Solution feature set

**Register features**

```azurecli
az feature register --name ConnectedVMwarePreview --namespace Microsoft.ConnectedVMwarevSphere 
az feature register --name CustomLocations-ppauto --namespace Microsoft.ExtendedLocation 
az feature register --name Extensions --namespace Microsoft.KubernetesConfiguration 
az feature register --name Appliances-ppauto --namespace Microsoft.ResourceConnector 
az feature register –-name AzureArcForAVS --namespace Microsoft.AVS
```

**Verify features are registered**

```azurecli
az feature show --name ConnectedVMwarePreview --namespace Microsoft.ConnectedVMwarevSphere 
az feature show --name CustomLocations-ppauto --namespace Microsoft.ExtendedLocation 
az feature show --name Extensions --namespace Microsoft.KubernetesConfiguration 
az feature show --name Appliances-ppauto --namespace Microsoft.ResourceConnector 
az feature show –-name AzureArcForAVS --namespace Microsoft.AVS 
```


## How to deploy Azure Arc

While invoking the script, you'll be required to define one of the following operations: **Onboard**, or **Offboard**.

**Onboard**

1. Download and install the required tools to execute preview software from jump box (Azure CLI tools, Python, etc.). 
1. Create Azure VMware Solution segment as per details if not present already. Create Domain Name Server (DNS) and zones if not present already. Fetch vCenter credentials. 
1. Create template for Arc Appliance and take snapshot from template created. 
1. Deploy the Arc for Azure VMware Solution appliance VM. 
1. Create an Azure Resource Manager template (ARM template) resource for the appliance. 
1. Create a Kubernetes extension resource for Azure VMware Solution. 
1. Create a custom location.  
1. Create an Azure representation of the vCenter. 
1. Link the vCenter resource to the AVS Azure VMware Solution Private Cloud resource. 

**Offboard**

1. Download and install the required tools needed to execute preview software from jump box (Azure CLI tools, Python, etc.), if not present already. 
1. Unlink the vCenter resource from the Azure VMware Solution Private cloud resource. 
1. Delete the Azure representation of the vCenter. 
1. Delete the Custom Location resource, the Kubernetes extension for Azure VMware operator, the Appliance resource.   
1. Delete the appliance VM. 

### Process to onboard in Arc for Azure VMware Solution preview

Use the steps below to onboard in Arc for Azure VMware Solution preview.

1. Sign in to the jumpbox VM and extract the contents from the compressed file from the following [location path](). The extracted file contains the scripts to install the preview software.
1. Open the 'config_avs.json' file and populate all the variables.

    Config JSON
    ```json
    { 
      "subscriptionId": "", 
      "resourceGroup": "", 
      "resourceGroup": "", 
      "privateCloud": "", 
      "isStatic": true, 
      "staticIpNetworkDetails": { 
        "networkForApplianceVM": "", 
        "networkCIDRForApplianceVM": "", 
        "k8sNodeIPPoolStart": "", 
        "k8sNodeIPPoolEnd": "", 
        "gatewayIPAddress": "" 
      }, 
      "isAVS": true,  
      "applianceControlPlaneIpAddress": "", 
    "location": "westeurope",  
    
      "register": "false" 
    } 
    ```
    
    - subscriptionId, resourceGroup, privateCloud – The subscription ID, Resource Group name, and the Private cloud name respectively.  
    - isStatic and isAVS are always true. 
    - networkForApplianceVM – Name for the segment for Arc appliance VM, one will be created if one does not already exist.  
    - networkCIDRForApplianceVM – The IP CIDR of the segment for Arc appliance VM. It should be unique and not affect other networks of Azure VMware Solution management IP CIDR. 
    - GatewayIPAddress – The gateway for the segment for Arc appliance VM. 
    - applianceControlPlaneIpAddress – The IP address for the Kubernetes API server which should be part of the segment IP CIDR provided but not a part of the k8s node pool IP range.  
    - k8sNodeIPPoolStart, k8sNodeIPPoolEnd - The starting IP and the ending IP of the pool of IPs to assign to the appliance VM, have to be within the networkCIDRForApplianceVM. 

    Sample JSON
    ```json
    { 
      "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", 
      "resourceGroup": "test-rg ", 
      "applianceControlPlaneIpAddress": "10.14.10.10", 
      "privateCloud": "test-pc", 
      "isStatic": true, 
      "staticIpNetworkDetails": { 
       "networkForApplianceVM": "arc-segment", 
        "networkCIDRForApplianceVM": "10.14.10.1/24", 
        "k8sNodeIPPoolStart": "10.14.10.20", 
        "k8sNodeIPPoolEnd": "10.14.10.30", 
        "gatewayIPAddress": "10.14.10.1" 
      }, 
      "isAVS": true, 
    } 
    ```

1. You're ready to run the installation scripts. We provide you the option to set up this preview from both a Windows or a Linux based jump box/VM. 

    Run the following commands to execute the installation script. 

    # [Windows based jump box/VM](#tab/windows)
    Script isn't signed so we need to bypass Execution Policy in PowerShell. Run the following commands.

    ```json
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy ByPass; .\run.ps1 -Operation onboard -FilePath {config-json-path}
    ```
    # [Linux based jump box/VM](#tab/linux)
    Add execution permission for the script and run it.
    
    ```json
    $ chmod +x run.sh  
    $ sudo bash run.sh onboard {config-json-path} 
    ```
---

4. You'll see additional (new) Azure Resources being created in your Resource Group.
    - Resource bridge
    - Custom location
    - VMware vCenter

    In this example, we used the same Resource Group. 
 
## Discover and project your VMware infrastructure resources to Azure

When Arc appliance is successfully deployed on a customer's private cloud, they can do the following:

- View the status from within the private cloud blade under **Operations > Arc**. 
- View their Mware infrastructure resources from the private cloud blade under **Private cloud** then select **Azure Arc vCenter resources**.
- Project their VMware infrastructure resources to Azure using the same browse experience, **Private cloud > Arc vCenter resources > Virtual Machines**.
- Similar to VMs, customers can enable networks, templates, resource pools and data-stores in Azure.

Once customers enable VMs to be managed from Azure, they can proceed to install guest management. By installing guest management, they can do the following:

- Enable customers to install and use extensions.
    - To enable guest management, customers will be required to use admin credentials. 
    - VMtools should already be running on the VM.
    > [!NOTE] 
    > Azure VMware Solution vCenter will be available in global search but will NOT be available in the list of vCenters for ARc for VMware.

- Customers can view the list of VM extensions available in public preview.
    - Change tracking
    - Log analytics
    - Update management
    - Azure policy guest configuration

 **Azure VMware Solution private cloud with Azure Arc**

Click on **Operations > Azure Arc**. Azure Arc state should show as **Configured**.

**Arc enabled VMware resources**
<!--content has been requested to replace an image for this section -->

### Manage access to VMware resources through Azure Role-Based Access Control (RBAC)

Once your Azure VMware Solution vCenter resources have been enabled for access through Azure, there is one final step in setting up a self-service experience for your teams. You will need to provide your teams with access to the compute, storage and networking, and other vCenter resources used to provision VMs.

This section will demonstrate how to use custom roles to manage granular access to VMware resources through Azure.

#### Arc enabled VMware vSphere custom roles

We provide three custom roles to meet your RBACs. These roles can be applied to a whole subscription, resource group, or a single resource.

- Azure Arc VMware Administrator role
- Azure Arc VMware private cloud User role
- Azure Arc VMware VM Contributor role

The first role is for an Administrator and the other two roles apply to anyone who needs to deploy or manage a VM.

**Azure Arc Azure VMware Solution Administrator role**

This custom role provides permission to perform all possible operations for the `Microsoft.ConnectedVMwarevSphere` resource provider. This role should be assigned to users or groups who are administrators that manage Azure Arc enabled Azure VMware Solution deployment.

```json
{
  "properties": {
    "roleName": "Azure Arc VMware Administrator",
    "description": "Azure Arc VMware Administrator has full permissions to connect new vCenter instances to Azure and decide which resource pools, networks and templates can be used by developers, and also create, update and delete VMs",
    "assignableScopes": [
      "/subscriptions/00000000-0000-0000-0000-000000000000"
    ],
    "permissions": [
      {
        "actions": [
          "Microsoft.ConnectedVMwarevSphere/*",
          "Microsoft.Insights/AlertRules/*",
          "Microsoft.Insights/MetricAlerts/*",
          "Microsoft.Support/*",
          "Microsoft.Authorization/*/read",
          "Microsoft.Resources/deployments/*",
          "Microsoft.Resources/subscriptions/read",
          "Microsoft.Resources/subscriptions/resourceGroups/read"
        ],
        "notActions": [],
        "dataActions": [],
        "notDataActions": []
      }
    ]
  }
}
```
Copy the JSON above into an empty file and save the file as `AzureArcAVSAdministratorRole.json`. Replace the 00000000-0000-0000-0000-000000000000 with your subscription id.

**Azure Arc Azure VMware Solution private cloud User role**

This custom role provides permissions to use the Arc enabled Azure VMware Solutions vSphere resources that have been made accessible through Azure. This role should be assigned to any users or groups that need to deploy, update, or delete VMs.

We recommend assigning this role at the individual resource pool (host or cluster), virtual network, or template that you want the user to deploy VMs with.

```json
{
  "properties": {
    "roleName": "Azure Arc VMware Private Cloud User",
    "description": "Azure Arc VMware Private Cloud User has permissions to use the VMware cloud resources to deploy VMs.",
    "assignableScopes": [
      "/subscriptions/00000000-0000-0000-0000-000000000000"
    ],
    "permissions": [
      {
        "actions": [
          "Microsoft.Insights/AlertRules/*",
          "Microsoft.Insights/MetricAlerts/*",
          "Microsoft.Support/*",
          "Microsoft.Authorization/*/read",
          "Microsoft.Resources/deployments/*",
          "Microsoft.Resources/subscriptions/read",
          "Microsoft.Resources/subscriptions/resourceGroups/read",
          "Microsoft.ConnectedVMwarevSphere/virtualnetworks/join/action",
          "Microsoft.ConnectedVMwarevSphere/virtualnetworks/Read",
          "Microsoft.ConnectedVMwarevSphere/virtualmachinetemplates/clone/action",
          "Microsoft.ConnectedVMwarevSphere/virtualmachinetemplates/Read",
          "Microsoft.ConnectedVMwarevSphere/resourcepools/deploy/action",
          "Microsoft.ConnectedVMwarevSphere/resourcepools/Read",
          "Microsoft.ExtendedLocation/customLocations/Read",
          "Microsoft.ExtendedLocation/customLocations/deploy/action"
        ],
        "notActions": [],
        "dataActions": [],
        "notDataActions": []
      }
    ]
  }
}
```
Copy the JSON above into an empty file and save the file as `AzureArcAVSPrivateCloudUserRole.json`. Replace the 00000000-0000-0000-0000-000000000000 with your subscription id. 

**Azure Arc Azure VMware Solution VM Contributor role**

This custom role provides permissions to perform all VMware VM operations. This role should be assigned to any users or groups that need to deploy, update, or delete VMs.

We recommend assigning this role at the subscription level or resource group you want the user to deploy VMs with.

```json
{
  "properties": {
    "roleName": "Arc VMware VM Contributor",
    "description": "Arc VMware VM Contributor has permissions to perform all actions to update ",
    "assignableScopes": [
      "/subscriptions/00000000-0000-0000-0000-000000000000"
    ],
    "permissions": [
      {
        "actions": [
          "Microsoft.Insights/AlertRules/*",
          "Microsoft.Insights/MetricAlerts/*",
          "Microsoft.Support/*",
          "Microsoft.Authorization/*/read",
          "Microsoft.Resources/deployments/*",
          "Microsoft.Resources/subscriptions/read",
          "Microsoft.Resources/subscriptions/resourceGroups/read",
          "Microsoft.ConnectedVMwarevSphere/virtualmachines/Delete",
          "Microsoft.ConnectedVMwarevSphere/virtualmachines/Write",
          "Microsoft.ConnectedVMwarevSphere/virtualmachines/Read"
        ],
        "notActions": [],
        "dataActions": [],
        "notDataActions": []
      }
    ]
  }
}
```
Copy the JSON above into an empty file and save the file as `AzureArcAVSVMContributorRole.json`. Replace the 00000000-0000-0000-0000-000000000000 with your subscription id. 

**Add custom roles to your subscription**

1. Navigate to the Azure portal.
1. Locate the subscription page.
1. Click **Access control (IAM)** in the table of contents located on the left side.
1. Click **Add** on the **Create a custom role** card.
1. On the **Basics** page, select *Start from JSON** on the **Baseline permissions** field.
1. Pick one of the json files you saved from the steps above.
1. Click **Review+Create**, verify that the assignable scope matches your subscription.
1. Click **Create**.
1. Repeat this process for each custom role and subscription.

**Assign the custom roles to users or groups**

1. Navigate to the Azure portal.
1. Locate the subscription, resource group, or the resource at the scope you want to provide for the custom role.
1. Find the Arc enabled Azure VMware Solution vCenter resources.
    1. Navigate to the resource group and select the **Show hidden types** checkbox.
    1. Search for "Azure VMware Solution".
1. Click **Access control (IAM)** in the table of contents located on the left side.
1. Click **Add role assignments** on the **Grant access to this resource** 
1. Select the custom role you want to assign (Azure Arc VMware Solution: **Administrator**, **private cloud User**, or **Contributor**)
1. Search for AAD user or group that you want to assign this role to.
1. Click the AAD user or group name to select. Repeat this for each user or group you want to give permission to.
1. Repeat the above steps for each scope and role.

## Create Arc enabled Azure VMware Solution VM




