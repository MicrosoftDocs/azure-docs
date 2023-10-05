---
title: Deploy Arc for Azure VMware Solution (Preview)
description: Learn how to set up and enable Arc for your Azure VMware Solution private cloud.
ms.topic: how-to 
ms.service: azure-vmware
ms.date: 08/28/2023
ms.custom: references_regions, devx-track-azurecli
---


# Deploy Arc for Azure VMware Solution (Preview)

In this article, you'll learn how to deploy Arc for Azure VMware Solution. Once you've set up the components needed for this public preview, you'll be ready to execute operations in Azure VMware Solution vCenter Server from the Azure portal. Operations are related to Create, Read, Update, and Delete (CRUD) virtual machines (VMs) in an Arc-enabled Azure VMware Solution private cloud. Users can also enable guest management and install Azure extensions once the private cloud is Arc-enabled.

Before you begin checking off the prerequisites, verify the following actions have been done:
 
- You deployed an Azure VMware Solution private cluster. 
- You have a connection to the Azure VMware Solution private cloud through your on-premises environment or your native Azure Virtual Network. 
- There should be an isolated NSX-T Data Center network segment for deploying the Arc for Azure VMware Solution Open Virtualization Appliance (OVA). If an isolated NSX-T Data Center network segment doesn't exist, one will be created.

## Prerequisites 

The following items are needed to ensure you're set up to begin the onboarding process to deploy Arc for Azure VMware Solution (Preview).

- A jump box virtual machine (VM) with network access to the Azure VMware Solution vCenter. 
    - From the jump-box VM, verify you have access to [vCenter Server and NSX-T Manager portals](./tutorial-configure-networking.md). 
- Verify that your Azure subscription has been enabled or you have connectivity to Azure end points, mentioned in the [Appendices](#appendices).
- Resource group in the subscription where you have owner or contributor role.  
- A minimum of three free non-overlapping IPs addresses.  
- Verify that your vCenter Server version is 6.7 or higher. 
- A resource pool with minimum-free capacity of 16 GB of RAM, 4 vCPUs. 
- A datastore with minimum 100 GB of free disk space that is available through the resource pool. 
- On the vCenter Server, allow inbound connections on TCP port 443, so that the Arc resource bridge and VMware vSphere cluster extension can communicate with the vCenter Server.
- Please validate the regional support before starting the onboarding. Arc for Azure VMware Solution is supported in all regions where Arc for VMware vSphere on-premises is supported. For more details, see [Azure Arc-enabled VMware vSphere](/azure/azure-arc/vmware-vsphere/overview).
- The firewall and proxy URLs below must be allowlisted in order to enable communication from the management machine, Appliance VM, and Control Plane IP to the required Arc resource bridge URLs.
[Azure Arc resource bridge (preview) network requirements](../azure-arc/resource-bridge/network-requirements.md)

> [!NOTE]
> Only the default port of 443 is supported. If you use a different port, Appliance VM creation will fail. 

At this point, you should have already deployed an Azure VMware Solution private cloud. You need to have a connection from your on-premises environment or your native Azure Virtual Network to the Azure VMware Solution private cloud.

For Network planning and setup, use the [Network planning checklist - Azure VMware Solution | Microsoft Docs](./tutorial-network-checklist.md)

### Registration to Arc for Azure VMware Solution feature set

The following **Register features** are for provider registration using Azure CLI.

```azurecli
az provider register --namespace Microsoft.ConnectedVMwarevSphere 
az provider register --namespace Microsoft.ExtendedLocation 
az provider register --namespace Microsoft.KubernetesConfiguration 
az provider register --namespace Microsoft.ResourceConnector 
az provider register --namespace Microsoft.AVS
```

Alternately, users can sign into their Subscription, navigate to the **Resource providers** tab, and register themselves on the resource providers mentioned previously.

For feature registration, users will need to sign into their **Subscription**, navigate to the **Preview features** tab, and search for 'Azure Arc for Azure VMware Solution'. Once registered, no other permissions are required for users to access Arc.

Users need to ensure they've registered themselves to **Microsoft.AVS/earlyAccess**. After registering, use the following feature to verify registration.

```azurecli
az feature show --name AzureArcForAVS --namespace Microsoft.AVS
```

## Onboard process to deploy Azure Arc

Use the following steps to guide you through the process to onboard Azure Arc for Azure VMware Solution (Preview).

1. Sign into the jumpbox VM and extract the contents from the compressed file from the following [location](https://github.com/Azure/ArcOnAVS/releases/latest). The extracted file contains the scripts to install the preview software.
1. Open the 'config_avs.json' file and populate all the variables.

    **Config JSON**
    ```json
    {
      "subscriptionId": "",
      "resourceGroup": "",
      "applianceControlPlaneIpAddress": "",
      "privateCloud": "",
      "isStatic": true,
      "staticIpNetworkDetails": {
       "networkForApplianceVM": "",
       "networkCIDRForApplianceVM": "",
       "k8sNodeIPPoolStart": "",
       "k8sNodeIPPoolEnd": "",
       "gatewayIPAddress": ""
      }
    }
    ```
    
    - Populate the `subscriptionId`, `resourceGroup`, and `privateCloud` names respectively.  
    - `isStatic` is always true. 
    - `networkForApplianceVM` is the name for the segment for Arc appliance VM. One will be created if it doesn't already exist.  
    - `networkCIDRForApplianceVM` is the IP CIDR of the segment for Arc appliance VM. It should be unique and not affect other networks of Azure VMware Solution management IP CIDR. 
    - `GatewayIPAddress` is the gateway for the segment for Arc appliance VM. 
    - `applianceControlPlaneIpAddress` is the IP address for the Kubernetes API server that should be part of the segment IP CIDR provided. It shouldn't be part of the k8s node pool IP range.  
    - `k8sNodeIPPoolStart`, `k8sNodeIPPoolEnd` are the starting and ending IP of the pool of IPs to assign to the appliance VM. Both need to be within the `networkCIDRForApplianceVM`. 
    - `k8sNodeIPPoolStart`, `k8sNodeIPPoolEnd`, `gatewayIPAddress` ,`applianceControlPlaneIpAddress` are optional. You may choose to skip all the optional fields or provide values for all. If you choose not to provide the optional fields, then you must use /28 address space for `networkCIDRForApplianceVM`

    **Json example**
    ```json
    { 
      "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", 
      "resourceGroup": "test-rg", 
      "privateCloud": "test-pc", 
      "isStatic": true, 
      "staticIpNetworkDetails": { 
       "networkForApplianceVM": "arc-segment", 
       "networkCIDRForApplianceVM": "10.14.10.1/28" 
      } 
    } 
    ```

1. Run the installation scripts. We've provided you with the option to set up this preview from a Windows or Linux-based jump box/VM. 

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

4. You'll notice more Azure Resources have been created in your resource group.
    - Resource bridge
    - Custom location
    - VMware vCenter

> [!IMPORTANT]
> You can't create the resources in a separate resource group. Make sure you use the same resource group from where the Azure VMware Solution private cloud was created to create the resources. 
 
## Discover and project your VMware vSphere infrastructure resources to Azure

When Arc appliance is successfully deployed on your private cloud, you can do the following actions.

- View the status from within the private cloud under **Operations > Azure Arc**, located in the left navigation. 
- View the VMware vSphere infrastructure resources from the private cloud left navigation under **Private cloud** then select **Azure Arc vCenter resources**.
- Discover your VMware vSphere infrastructure resources and  project them to Azure using the same browser experience, **Private cloud > Arc vCenter resources > Virtual Machines**.
- Similar to VMs, customers can enable networks, templates, resource pools, and data-stores in Azure.

After you've enabled VMs to be managed from Azure, you can install guest management and do the following actions.

- Enable customers to install and use extensions.
    - To enable guest management, customers will be required to use admin credentials
    - VMtools should already be running on the VM
> [!NOTE] 
> Azure VMware Solution vCenter Server will be available in global search but will NOT be available in the list of vCenter Servers for Arc for VMware.

- Customers can view the list of VM extensions available in public preview.
    - Change tracking
    - Log analytics
    - Azure policy guest configuration

 **Azure VMware Solution private cloud with Azure Arc**

When the script has run successfully, you can check the status to see if Azure Arc has been configured. To verify if your private cloud is Arc-enabled, do the following action:
- In the left navigation, locate **Operations**.
- Choose **Azure Arc (preview)**. Azure Arc state will show as **Configured**.

    :::image type="content" source="media/deploy-arc-for-azure-vmware-solution/arc-private-cloud-configured.png" alt-text="Image showing navigation to Azure Arc state to verify it's configured."lightbox="media/deploy-arc-for-azure-vmware-solution/arc-private-cloud-configured.png":::

**Arc enabled VMware vSphere resources**

After the private cloud is Arc-enabled, vCenter resources should appear under **Virtual machines**.
- From the left navigation, under **Azure Arc VMware resources (preview)**, locate **Virtual machines**.
- Choose **Virtual machines** to view the vCenter Server resources.

### Manage access to VMware resources through Azure Role-Based Access Control

After your Azure VMware Solution vCenter Server resources have been enabled for access through Azure, there's one final step in setting up a self-service experience for your teams. You'll need to provide your teams with access to: compute, storage, networking, and other vCenter Server resources used to configure VMs.

This section will demonstrate how to use custom roles to manage granular access to VMware vSphere resources through Azure.

#### Arc-enabled VMware vSphere built-in roles

There are three built-in roles to meet your Role-based access control (RBAC) requirements. You can apply these roles to a whole subscription, resource group, or a single resource.

**Azure Arc VMware Administrator role** - is used by administrators

**Azure Arc VMware Private Cloud User role** - is used by anyone who needs to deploy and manage VMs

**Azure Arc VMware VM Contributor role** - is used by anyone who needs to deploy and manage VMs

**Azure Arc Azure VMware Solution Administrator role**

This role provides permissions to perform all possible operations for the Microsoft.ConnectedVMwarevSphere resource provider. Assign this role to users or groups that are administrators managing Azure Arc enabled VMware vSphere deployment.

**Azure Arc Azure VMware Solution Private Cloud User role**

This role gives the user permission to use the Arc-enabled Azure VMware Solutions vSphere resources that have been made accessible through Azure. This role should be assigned to any users or groups that need to deploy, update, or delete VMs.

We recommend assigning this role at the individual resource pool (host or cluster), virtual network, or template that you want the user to deploy VMs with. 

**Azure Arc Azure VMware Solution VM Contributor role**

This role gives the user permission to perform all VMware VM operations. This role should be assigned to any users or groups that need to deploy, update, or delete VMs.

We recommend assigning this role at the subscription level or resource group you want the user to deploy VMs with.

**Assign custom roles to users or groups**

1. Navigate to the Azure portal.
1. Locate the subscription, resource group, or the resource at the scope you want to provide for the custom role.
1. Find the Arc-enabled Azure VMware Solution vCenter Server resources.
    1. Navigate to the resource group and select the **Show hidden types** checkbox.
    1. Search for "Azure VMware Solution".
1. Select **Access control (IAM)** in the table of contents located on the left navigation.
1. Select **Add role assignment** from the **Grant access to this resource**. 
   :::image type="content" source="media/deploy-arc-for-azure-vmware-solution/assign-custom-role-user-groups.png" alt-text="Image showing navigation to access control IAM and add role assignment."lightbox="media/deploy-arc-for-azure-vmware-solution/assign-custom-role-user-groups.png":::
1. Select the custom role you want to assign, Azure Arc VMware Solution: **Administrator**, **Private Cloud User**, or **VM Contributor**.
1. Search for **AAD user** or **group name** that you want to assign this role to.
1. Select the **AAD user** or **group name**. Repeat this step for each user or group you want to give permission to.
1. Repeat the above steps for each scope and role.


## Create Arc-enabled Azure VMware Solution virtual machine

This section shows users how to create a virtual machine (VM) on VMware vCenter Server using Azure Arc. Before you begin, check the following prerequisite list to ensure you're set up and ready to create an Arc-enabled Azure VMware Solution VM. 

### Prerequisites

- An Azure subscription and resource group where you have an Arc VMware VM **Contributor role**.
- A resource pool resource that you have an Arc VMware private cloud resource **User role**.
- A virtual machine template resource that you have an Arc private cloud resource **User role**.
- (Optional) a virtual network resource on which you have Arc private cloud resource **User role**.

### Create VM flow

- Open the [Azure portal](https://portal.azure.com/)
- On the **Home** page, search for **virtual machines**. Once you've navigated to **Virtual machines**, select the **+ Create** drop down and select **Azure VMware Solution virtual machine**.
    :::image type="content" source="media/deploy-arc-for-azure-vmware-solution/deploy-vm-arc-1.2.png" alt-text="Image showing the location of the plus Create drop down menu and Azure VMware Solution virtual machine selection option."lightbox="media/deploy-arc-for-azure-vmware-solution/deploy-vm-arc-1.2.png"::: 

Near the top of the **Virtual machines** page, you'll find five tabs labeled: **Basics**, **Disks**, **Networking**, **Tags**, and **Review + create**. Follow the steps or options provided in each tab to create your Azure VMware Solution virtual machine.
:::image type="content" source="media/deploy-arc-for-azure-vmware-solution/deploy-vm-arc-tabs.png" alt-text="Image showing the five tabs used in the walk-through steps listed."lightbox="media/deploy-arc-for-azure-vmware-solution/deploy-vm-arc-tabs.png":::

**Basics**
1. In **Project details**, select the **Subscription** and **Resource group** where you want to deploy your VM.
1. In **Instance details**, provide the **virtual machine name**.
1. Select a **Custom location** that your administrator has shared with you.
1. Select the **Resource pool/cluster/host** where the VM should be deployed.
1. For **Template details**, pick a **Template** based on the VM you plan to create.
    - Alternately, you can check the **Override template defaults** box that allows you to override the CPU and memory specifications set in the template. 
    - If you chose a Windows template, you can provide a **Username** and **Password** for the **Administrator account**.
1. For **Extension setup**, the box is checked by default to **Enable guest management**. If you don’t want guest management enabled, uncheck the box.
1. The connectivity method defaults to **Public endpoint**. Create a **Username**, **Password**, and **Confirm password**.
    
**Disks**
  - You can opt to change the disks configured in the template, add more disks, or update existing disks. These disks will be created on the default datastore per the VMware vCenter Server storage policies.
  - You can change the network interfaces configured in the template, add Network interface cards (NICs), or update existing NICs. You can also change the network that the NIC will be attached to provided you have permissions to the network resource.
  
**Networking**
  - A network configuration is automatically created for you. You can choose to keep it or override it and add a new network interface instead.
  - To override the network configuration, find and select **+ Add network interface** and add a new network interface.
  
**Tags**
  - In this section, you can add tags to the VM resource.
    
**Review + create**
  - Review the data and properties you've set up for your VM. When everything is set up how you want it, select **Create**. The VM should be created in a few minutes.
 
## Enable guest management and extension installation

The guest management must be enabled on the VMware vSphere virtual machine (VM) before you can install an extension. Use the following prerequisite steps to enable guest management.

**Prerequisite**

1. Navigate to [Azure portal](https://portal.azure.com/).
1. Locate the VMware vSphere VM you want to check for guest management and install extensions on, select the name of the VM.
1. Select **Configuration** from the left navigation for a VMware VM.
1. Verify **Enable guest management** has been checked.

>[!NOTE]
> The following conditions are necessary to enable guest management on a VM.

- The machine must be running a [Supported operating system](../azure-arc/servers/agent-overview.md).
- The machine needs to connect through the firewall to communicate over the internet. Make sure the [URLs](../azure-arc/servers/agent-overview.md) listed aren't blocked.
- The machine can't be behind a proxy, it's not supported yet.
- If you're using Linux VM, the account must not prompt to sign in on pseudo commands.
    
    Avoid pseudo commands by following these steps:
    
    1. Sign into Linux VM.
    1. Open terminal and run the following command: `sudo visudo`.
    1. Add the line `username` `ALL=(ALL) NOPASSWD:ALL` at the end of the file. 
    1. Replace `username` with the appropriate user-name.

If your VM template already has these changes incorporated, you won't need to do the steps for the VM created from that template.

**Extension installation steps**

1. Go to Azure portal. 
1. Find the Arc-enabled Azure VMware Solution VM that you want to install an extension on and select the VM name. 
1. Navigate to **Extensions** in the left navigation, select **Add**.
1. Select the extension you want to install. 
    1. Based on the extension, you'll need to provide details. For example, `workspace Id` and `key` for LogAnalytics extension. 
1. When you're done, select **Review + create**. 

When the extension installation steps are completed, they trigger deployment and install the selected extension on the VM. 

## Change Arc appliance credential

When **cloudadmin** credentials are updated, use the following steps to update the credentials in the appliance store.

1. Log in to the jumpbox VM from where onboarding was performed. Change the directory to **onboarding directory**.
1. Run the following command for Windows-based jumpbox VM.
    
    `./.temp/.env/Scripts/activate`
1. Run the following command.

    `az arcappliance update-infracredentials vmware --kubeconfig <kubeconfig file>`

1. Run the following command

`az connectedvmware vcenter connect --debug --resource-group {resource-group} --name {vcenter-name-in-azure} --location {vcenter-location-in-azure} --custom-location {custom-location-name} --fqdn {vcenter-ip} --port {vcenter-port} --username cloudadmin@vsphere.local --password {vcenter-password}`
    
> [!NOTE]
> Customers need to ensure kubeconfig and SSH keys remain available as they will be required for log collection, appliance Upgrade, and credential rotation. These parameters will be required at the time of upgrade, log collection, and credential update scenarios. 

**Parameters**

Required parameters

`-kubeconfig # kubeconfig of Appliance resource`

**Examples**

The following command invokes the set credential for the specified appliance resource.

` az arcappliance setcredential <provider> --kubeconfig <kubeconfig>`

## Manual appliance upgrade

Use the following steps to perform a manual upgrade for Arc appliance virtual machine (VM).

1. Log into vCenter Server.
1. Locate the Arc appliance VM, which should be in the resource pool that was configured during onboarding.
    1. Power off the VM.
    1. Delete the VM.
1. Delete the download template corresponding to the VM.
1. Delete the resource bridge Azure Resource Manager resource.
1. Get the previous script `Config_avs` file and add the following configuration item:
    1. `"register":false`
1. Download the latest version of the Azure VMware Solution onboarding script.
1. Run the new onboarding script with the previous `config_avs.json` from the jump box VM, without changing other config items.

## Off board from Azure Arc-enabled Azure VMware Solution

This section demonstrates how to remove your VMware vSphere virtual machines (VMs) from Azure management services.

If you've enabled guest management on your Arc-enabled Azure VMware Solution VMs and onboarded them to Azure management services by installing VM extensions on them, you'll need to uninstall the extensions to prevent continued billing. For example, if you installed an MMA extension to collect and send logs to an Azure Log Analytics workspace, you'll need to uninstall that extension. You'll also need to uninstall the Azure Connected Machine agent to avoid any problems installing the agent in future. 

Use the following steps to uninstall extensions from the portal. 

>[!NOTE]
>**Steps 2-5** must be performed for all the VMs that have VM extensions installed.

1. Log in to your Azure VMware Solution private cloud. 
1. Select **Virtual machines** in **Private cloud**, found in the left navigation under “vCenter Server Inventory Page"
1. Search and select the virtual machine where you have **Guest management** enabled.
1. Select **Extensions**.
1. Select the extensions and select **Uninstall**.

To avoid problems onboarding the same VM to **Guest management**, we recommend you do the following steps to cleanly disable guest management capabilities. 

>[!NOTE]
>**Steps 2-3** must be performed for **all VMs** that have **Guest management** enabled.

1. Sign into the virtual machine using administrator or root credentials and run the following command in the shell.
    1. `azcmagent disconnect --force-local-only`.
1. Uninstall the `ConnectedMachine agent` from the machine.
1. Set the **identity** on the VM resource to **none**. 

## Remove Arc-enabled Azure VMware Solution vSphere resources from Azure

When you activate Arc-enabled Azure VMware Solution resources in Azure, a representation is created for them in Azure. Before you can delete the vCenter Server resource in Azure, you'll need to delete all of the Azure resource representations you created for your vSphere resources. To delete the Azure resource representations you created, do the following steps: 

1. Go to the Azure portal.
1. Choose **Virtual machines** from Arc-enabled VMware vSphere resources in the private cloud.
1. Select all the VMs that have an Azure Enabled value as **Yes**.
1. Select **Remove from Azure**. This step will start deployment and remove these resources from Azure. The resources will remain in your vCenter Server.
    1. Repeat steps 2, 3 and 4 for **Resourcespools/clusters/hosts**, **Templates**, **Networks**, and **Datastores**.
1. When the deletion completes, select **Overview**.
    1. Note the Custom location and the Azure Arc Resource bridge resources in the Essentials section.
1. Select **Remove from Azure** to remove the vCenter Server resource from Azure.
1. Go to vCenter Server resource in Azure and delete it.
1. Go to the Custom location resource and select **Delete**.
1. Go to the Azure Arc Resource bridge resources and select **Delete**. 

At this point, all of your Arc-enabled VMware vSphere resources have been removed from Azure.

## Delete Arc resources from vCenter Server

For the final step, you'll need to delete the resource bridge VM and the VM template that were created during the onboarding process. Login to vCenter Server and delete resource bridge VM and the VM template from inside the arc-folder. Once that step is done, Arc won't work on the Azure VMware Solution private cloud. When you delete Arc resources from vCenter Server, it won't affect the Azure VMware Solution private cloud for the customer. 

## Preview FAQ

**Region support for Azure VMware Solution**
 
Arc for Azure VMware Solution is supported in all regions where Arc for VMware vSphere on-premises is supported. For more details, see [Azure Arc-enabled VMware vSphere](/azure/azure-arc/vmware-vsphere/overview).

**How does support work?**

Standard support process for Azure VMware Solution has been enabled to support customers.

**Does Arc for Azure VMware Solution support private endpoint?**

Private endpoint is currently not supported.

**Is enabling internet the only option to enable Arc for Azure VMware Solution?**

Yes, the Azure VMware Solution private cloud and jumpbox VM must have internet access for Arc to function.

**Is DHCP support available?**

DHCP support isn't available to customers at this time, we only support static IP addresses.

## Debugging tips for known issues

Use the following tips as a self-help guide.

**What happens if I face an error related to Azure CLI?**

- For windows jumpbox, if you have 32-bit Azure CLI installed, verify that your current version of Azure CLI has been uninstalled. Verification can be done from the Control Panel. 
- To ensure it's uninstalled, try the `az` version to check if it's still installed. 
- If you already installed Azure CLI using MSI, `az` installed by MSI and pip will conflict on PATH. In this case, it's recommended that you uninstall the current Azure CLI version.

**My script stopped because it timed-out, what should I do?**

- Retry the script for `create`. A prompt will ask you to select **Y** and rerun it.
- It could be a cluster extension issue that would result in adding the extension in the pending state.
- Verify you have the correct script version.
- Verify the VMware pod is running correctly on the system in running state.

**Basic trouble-shooting steps if the script run was unsuccessful.**

- Follow the directions provided in the [Prerequisites](#prerequisites) section of this article to verify that the feature and resource providers are registered.

**What happens if the Arc for VMware section shows no data?**

- If the Azure Arc VMware resources in the Azure UI show no data, verify your subscription was added in the global default subscription filter.

**I see the error:** "`ApplianceClusterNotRunning` Appliance Cluster: `<resource-bridge-id>` expected states to be Succeeded found: Succeeded and expected status to be Running and found: Connected".

- Run the script again.

**I'm unable to install extensions on my virtual machine.**

- Check that **guest management** has been successfully installed.
- **VMware Tools** should be installed on the VM.

**I'm facing Network related issues during on-boarding.**

- Look for an IP conflict. You need IPs with no conflict or from free pool.
- Verify the internet is enabled for the network segment.

**Where can I find more information related to Azure Arc resource bridge?**

- For more information, go to [Azure Arc resource bridge (preview) overview](../azure-arc/resource-bridge/overview.md)

## Appendices

Appendix 1 shows proxy URLs required by the Azure Arc-enabled private cloud. The URLs will get pre-fixed when the script runs and can be run from the jumpbox VM to ping them. The firewall and proxy URLs below must be allowlisted in order to enable communication from the management machine, Appliance VM, and Control Plane IP to the required Arc resource bridge URLs.
[Azure Arc resource bridge (preview) network requirements](../azure-arc/resource-bridge/network-requirements.md)

**Additional URL resources**

- [Google Container Registry](http://gcr.io/)
- [Red Hat Quay.io](http://quay.io/)
- [Docker](https://hub.docker.com/)
- [Harbor](https://goharbor.io/)
- [Container Registry](https://container-registry.com/)
