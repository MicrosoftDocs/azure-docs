---
title: Deploy Arc for Azure VMware Solution 
description: Learn how to set up and enable Arc for your Azure VMware Solution private cloud.
ms.topic: how-to 
ms.date: 12/03/2021
---
# Deploy Arc for Azure VMware Solution

In this article, you'll learn how to deploy Arc for Azure VMware Solution. Once you've set up the components needed for this public preview, you'll be ready to execute operations in Azure VMware Solution vCenter from the Azure portal. Operations are related to Create, Read, Update, and Delete (CRUD) Virtual Machines (VM) in an Arc enabled Azure VMware Solution private cloud. User can also enable guest management and install Azure extensions once the private cloud is Arc enabled.

Before you begin checking off the prerequisites below, verify the following actions have been done:
 
- You've deployed an Azure VMware Solution private cluster. 
- You have a connection from your on-prem environment and/or from your native Azure Virtual Network to the Azure VMware Solution private cloud. 
- There should be an isolated NSX-T segment for deploying the Arc for Azure VMware Solution Open Virtualization Appliance (OVA). If an isolated NSX-T segment doesn't exist, one will be created.

## Prerequisites 

The following items are needed to ensure you're set up to begin the onboarding process to deploy Arc for Azure VMware Solution.

- A jump box Virtual Machine (VM) with network access to the Azure VMware Solution vCenter. From the jump-box/virtual machine, ensure you have access to vCenter and NSX-T portals. 
- Internet access from jump box VM. 
- Verify that your Azure Subscription has been enabled. 
- A minimum of three free non-overlapping IPs addresses.  
- Verify that your vCenter Server is 6.7 or above. 
- A resource pool with minimum-free capacity of 16 GB of RAM, 4 vCPUs. 
- A datastore with minimum 100 GB of free disk space that is available through the resource pool. 
- On the vCenter Server, allow inbound connections on TCP port 443, so that the Arc resource bridge and VMware cluster extension can communicate with the vCenter server. 

> [!NOTE]
> Only the default port of 443 is supported if you use a different port, Appliance VM creation will fail. 

At this point, you should've already deployed an Azure VMware Solution private cluster. You need to have a connection from your on-prem environment or your native Azure Virtual Network to the Azure VMware Solution private cloud.

For Network planning and setup, use the [Network planning checklist - Azure VMware Solution | Microsoft Docs](/azure/azure-vmware/tutorial-network-checklist)

### Registration to Arc for Azure VMware Solution feature set

The following **Register features** are for provider registration using Azure CLI.

```azurecli
az provider register --namespace Microsoft.ConnectedVMwarevSphere 
az provider register --namespace Microsoft.ExtendedLocation 
az provider register --namespace Microsoft.KubernetesConfiguration 
az provider register --namespace Microsoft.ResourceConnector 
az provider register --namespace Microsoft.AVS
```

Alternatively, users can log into their Subscription, navigate to the **Resource providers** tab, and register themselves on the resource providers mentioned above.

For feature registration, users will need to log into their **Subscription**, navigate to the **Preview features** tab, and search for "Azure Arc for Azure VMware Solution". Once registered, no other permissions are required for users to access Arc.

Use the following features to verify registration.

```azurecli
az feature show --name ConnectedVMwarePreview --namespace Microsoft.ConnectedVMwarevSphere 
az feature show --name Appliances-pp --namespace Microsoft.ResourceConnector 
az feature show –-name AzureArcForAVS --namespace Microsoft.AVS
```

## How to deploy Azure Arc

The steps below guide you through the process to onboard in Arc for Azure VMware Solution preview.

1. Log into the jumpbox VM and extract the contents from the compressed file from the following [location path](). The extracted file contains the scripts to install the preview software.
1. Open the 'config_avs.json' file and populate all the variables.

    **Config JSON**
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
    
    - Populate the `subscriptionId`, `resourceGroup`, and `privateCloud` names respectively.  
    - `isStatic` and `isAVS` are always true. 
    - `networkForApplianceVM` is the name for the segment for Arc appliance VM. One will be created if it doesn't already exist.  
    - `networkCIDRForApplianceVM` is the IP CIDR of the segment for Arc appliance VM. It should be unique and not affect other networks of Azure VMware Solution management IP CIDR. 
    - `GatewayIPAddress` is the gateway for the segment for Arc appliance VM. 
    - `applianceControlPlaneIpAddress` is the IP address for the Kubernetes API server that should be part of the segment IP CIDR provided. It shouldn't be part of the k8s node pool IP range.  
    - `k8sNodeIPPoolStart`, `k8sNodeIPPoolEnd` are the starting and ending IP of the pool of IPs to assign to the appliance VM. Both need to be within the `networkCIDRForApplianceVM`. 

    **Json example**
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

1. You're ready to run the installation scripts. We've provided you with the option to set up this preview from a Windows or Linux-based jump box/VM. 

    Run the following commands to execute the installation script. 

    # [Windows based jump box/VM](#tab/windows)
    Script isn't signed so we need to bypass Execution Policy in PowerShell. Run the following commands.

    ```
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy ByPass; .\run.ps1 -Operation onboard -FilePath {config-json-path}
    ```
    # [Linux based jump box/VM](#tab/linux)
    Add execution permission for the script and run the following commands.
    
    ```
    $ chmod +x run.sh  
    $ sudo bash run.sh onboard {config-json-path} 
    ```
---

4. You'll now see additional Azure Resources being created in your Resource Group.
    - Resource bridge
    - Custom location
    - VMware vCenter

> [!IMPORTANT]
> You can't create the resources in a separate resource group. You'll need to use the Resource Group from where the Azure VMware Solution private cloud was created to create the resources. 
 
## Overview of the Onboarding/Off boarding process 

While invoking the script, you'll be required to define one of the Operations listed below. 

**Onboard** 
1. Download and install the tools you’ll need to execute preview software from jump box (Azure CLI tools, Python, etc.). If you already have the necessary tools installed, skip to the next step. 
1. Create Azure VMware Solution segment as per details if not present already. Create a Domain Name server (DNS)  and zones if not already present and get the vCenter credentials. 
1. Create a template for Arc Appliance and take a snapshot of it. 
1. Deploy the Arc for Azure VMware Solution appliance VM. 
1. Create an ARM processor resource for the appliance. 
1. Create a Kubernetes extension resource for Azure VMware. 
1. Create a custom location.  
1. Create an Azure representation of the vCenter. 
1. Link the vCenter resource to the Azure VMware Solution Private cloud resource. 
 
**Off board** 
1. Download and install the tools you’ll need to execute preview software from jump box (Azure CLI tools, Python, etc.). If you already have the necessary tools installed, skip to the next step. 
1. Unlink the vCenter resource from the Azure VMware Solution private cloud resource. 
1. Delete the Azure representation of the vCenter. 
1. Delete the Custom Location resource, the Kubernetes extension for Azure VMware operator, and the Appliance. 
1. Delete the appliance VM. 


## Discover and project your VMware infrastructure resources to Azure

Once Arc appliance is successfully deployed on your private cloud, you can perform the following actions.

- View the status from within the private cloud under **Operations > Arc**. 
- View the Aware infrastructure resources from the private cloud under **Private cloud** then select **Azure Arc vCenter resources**.
- Discover your VMware infrastructure resources and  Project them to Azure using the same browser experience, **Private cloud > Arc vCenter resources > Virtual Machines**.
- Similar to VMs, customers can enable networks, templates, resource pools, and data-stores in Azure.

Once you enable VMs to be managed from Azure, you can proceed to install guest management and perform the following actions.

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

Once the script has run successfully, you can check the status to see if Azure Arc has been configured. To verify if your private cloud is Arc enabled, click on **Operations > Azure Arc**. Azure Arc state should show as **Configured**.

### Manage access to VMware resources through Azure Role-Based Access Control (RBAC)

Once your Azure VMware Solution vCenter resources have been enabled for access through Azure, there's one final step in setting up a self-service experience for your teams. You will need to provide your teams with access to the compute, storage and networking, and other vCenter resources used to provision VMs.

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
    "roleName": "Azure Arc VMware private cloud User",
    "description": "Azure Arc VMware private cloud User has permissions to use the VMware cloud resources to deploy VMs.",
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
1. Click **Add role assignments** on the **Grant access to this resource**. 
1. Select the custom role you want to assign (Azure Arc VMware Solution: **Administrator**, **private cloud User**, or **Contributor**).
1. Search for AAD user or group that you want to assign this role to.
1. Click the AAD user or group name to select. Repeat this for each user or group you want to give permission to.
1. Repeat the above steps for each scope and role.

## Create Arc enabled Azure VMware Solution VM

This section shows users how to create a virtual machine on VMware vCenter using Azure Arc. Before you begin, check the prerequisite list below to ensure you're set up and ready to create an Arc enabled Azure VMware Solution VM. 

### Prerequisites

- An Azure subscription and resource group where you have an Arc VMware VM **Contributor role**.
- A resource pool resource that you have an Arc VMware private cloud resource **User role**.
- A virtual machine template resource that you have an Arc private cloud resource **User role**.
- (Optional) a virtual network resource on which you have Arc private cloud resource **User role**.

### Create VM flow

- Open the Azure portal
- On the **Home** page, search for **virtual machine**. Once you've navigated to **virtual machine**, click the **+ Create** drop down and select **Azure VMware Solution virtual machine**.
    :::image type="content" source="media/deploy-arc-for-avs/deploy-vm-arc-avs-1.2.png" alt-text="Image showing the location of the plus Create drop down and Azure VMware Solution virtual machine selection option."lightbox="media/deploy-arc-for-avs/deploy-vm-arc-avs-1.2.png"::: 

Near the top of the **Virtual machines** page, you'll find five tabs labeled: **Basics**, **Disks**, **Networking**, **Tags**, and **Review + create**. Follow the steps or options provided in each tab to create your Azure VMware Solution virtual machine.
:::image type="content" source="media/deploy-arc-for-avs/deploy-vm-arc-avs-tabs.png" alt-text="Image showing the five tabs used in the walk-through steps listed below."lightbox="media/deploy-arc-for-avs/deploy-vm-arc-avs-tabs.png":::

**Basics**
1. Project details, select the **Subscription** and **Resource group** where you want to deploy your VM.
1. Instance details, provide the **Virtual machine name**.
1. Select a **Custom location** that your administrator has shared with you.
1. Select the **Resource pool/cluster/host** where the VM should be deployed.
1. Template details, pick a **Template** based on the VM you plan to create.
    - Alternately, you can check the **Override template defaults** box which allows you to override the CPU and memory specifications set in the template. 
    - If you chose a Windows template, you can provide a **Username** and **Password** for the **Administrator account**.
1. Extension setup, the box is checked by default to **Enable guest management**. If you don’t want guest management enabled, uncheck the box.
1. Connectivity method defaults to **Public endpoint**. Create a **Username**, **Password**, and **Confirm password**.
    
**Disks**
  - You can opt to change the disks configured in the template, add more disks, or update existing disks. These disks will be created on the default datastore per the VMWare vCenter storage policies.
  - You can change the network interfaces configured in the template, add Network interface cards (NICs), or update existing NICs. You can also change the network that the NIC will be attached to provided you have permissions to the network resource.
  
**Networking**
  - You can choose to keep the network configuration that is automatically created or override it and add a new network interface.
  - To override it, click **+ Add network interface** and add a new network interface.
  
**Tags**
  - You have the option to add tags to the VM resource.
    
**Review + create**
  - Review the data and properties you've set up for your VM. When everything is set up how you want it, click **Create**. The VM should be provisioned in a few minutes.
 
## Enable guest management and extension installation

The guest management needs to be enabled on teh VMware virtual machine (VM) before you can install an extension. Follow the prerequisite steps below to enable guest management.

**Prerequisite**

1. Go to Azure portal.
1. Locate the VMware VM you want to check for guest management and install extensions on, select the name of the VM.
1.  Click **Configuration** in the left sidebar for a VMware VM.
1. Verify that **Enable guest management** has been checked.

>[!NOTE]
> The following conditions are necessary to enable guest management on a VM.

- Your target machine must be running a [Supported operating system](/azure/azure-arc/servers/agent-overview)
- Machine must be able to connect through the firewall to communicate over the Internet. Make sure the [URLs](/azure/azure-arc/servers/agent-overview) listed are not blocked.
- Machine must not be behind a proxy, it's not supported yet.
- If you're using Linux VM, the account must not prompt for login on pseudo commands.
    
    Avoid pseudo commands by following these steps:
    
    1. Log in to Linux VM.
    1. Open terminal and run the following command: `sudo visudo`.
    1. Add the line below at the end of the file. Replace `username` with the appropriate user-name.
    `username` `ALL=(ALL) NOPASSWD:ALL` 

If your VM template already has these changes incorporated, you won't need to perform the steps for the VM created from that template.

**Extension installation steps**

1. Go to Azure portal. 
1. Find the Arc enabled Azure VMware Solution VM that you want to install an extension on and click on the VM name. 
1. Navigate to **Extensions** and click on **Add**.
1. Select the extension you want to install. 
1. Based on the extension, you will need to provide details. For example, `workspace Id` and `key` for LogAnalytics extension. 
1. Click on **Review + create**. 

This will trigger deployment and install the selected extension on the virtual machine. 

## Off board from Azure Arc enabled Azure MVware Solution

This section will demonstrate how to remove your VMware virtual machines (VMs) from Azure management services.

If you've enabled guest management on your Arc enabled AVS VMs and on boarded them to Azure management services by installing VM extensions on them (e.g. you might have installed MMA extension to collect and send logs to an Azure Log Analytics workspace), you will need to uninstall the extensions to prevent continued billing. You will also need to uninstall the Azure Connected Machine agent to avoid any problems installing the agent in future 

Use the following steps to uninstall extensions from the portal. 

>[!NOTE]
>**Steps 2-5** must be performed for all the VMs that have VM extensions installed.

1. Login to your Azure VMware Solution private cloud. 
1. Click on **Virtual machines** under “Arc enabled VMware resources” in **Private cloud**.
1. Search and select the virtual machine where you have **Guest management** enabled.
1. Click on **Extensions**.
1. Select the extensions and click **Uninstall**.

To avoid problems onboarding the same VM to **Guest management**, we recommend you perform the following steps to cleanly disable guest management capabilities. 

>[!NOTE]
>**Steps 2-3** must be performed for **all VMs** that have **Guest management** enabled.

1. Log in to the virtual machine using administrator or root credentials and run the following command in the shell.
    1. `azcmagent disconnect --force-local-only`
1. Uninstall the `ConnectedMachine agent` from the machine.
1. Set the **identity** on the VM resource to **none**. 

## Remove Arc enabled Azure VMware Solution vSphere resources from Azure

When you enable Arc enabled Azure VMware Solution resources in Azure, a representation is created for them in Azure. Before you can delete the vCenter resource in Azure, you will need to delete all the Azure resource representations you created for your vSphere resources. To achieve this, perform the following steps: 

1. Go to the Azure portal.
1. Click on Virtual machines on Arc enabled VMware resources in the Private Cloud.
1. Select all the VMs that have Azure Enabled value as **Yes**.
1. Click **Remove from Azure**. This will start deployment and remove these resources from Azure. The resources will remain in your vCenter.
    1. Repeat steps 2, 3 and 4 for **Resourcespools/clusters/hosts**, **Templates**, **Networks**, and **Datastores**.
1. When the deletion completes, click **Overview**.
1. Note the Custom location and the Azure Arc Resource bridge resource in the Essentials section.
1. Click Remove from Azure to remove the vCenter resource from Azure.
1. Go to the Custom location resource and click **Delete**.
1. Go to the Azure Arc Resource bridge resource and click **Delete**. 

At this point, all of your Arc-enabled VMware vSphere resources have been removed from Azure.

## Delete Arc resources from vCenter

During onboarding

## Preview FAQ

**Is the preview available in all regions?**

Arc for Azure VMware Solution is currently available in EastUS and West EU.

**How do you onboard a customer?**
 
Fill in the [Customer Enrollment form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR0SUP-7nYapHr1Tk0MFNflVUNEJQNzFONVhVOUlVTVk3V1hNTjJPVDM5WS4u) and we'll be in touch.

**How does support work?**

Standard support process for Azure VMware Solution has been enabled to support customers.

**Does Arc for Azure VMware Solution support private end point?**

Yes. Arc for Azure VMware Solution will support private end point for general audience. However, it is not currently supported.

**Is enabling internet the only option to enable Arc for Azure VMware Solution?**

Yes

**Is DHCP support available?**

DHCP support is on the road map and will soon be available for customers. Currently, we are only supporting static IP.

>[!NOTE]
> This is Azure VMware Solution 2.0 only. It is not available for Azure VMware Solution by Cloudsimple.

## Debugging tips for known issues

The following serve as your self-help guide.

- In windows jumpbox, if you have 32 bit Azure CLI installed, verify that your current version of Azure CLI has been uninstalled (this can be done from the Control Panel).




