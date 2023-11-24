---
title: Deploy Arc-enabled Azure VMware Solution
description: Learn how to set up and enable Arc for your Azure VMware Solution private cloud.
ms.topic: how-to 
ms.service: azure-vmware
ms.date: 11/03/2023
ms.custom: references_regions, devx-track-azurecli
---

# Deploy Arc-enabled Azure VMware Solution

In this article, learn how to deploy Arc for Azure VMware Solution. Once you set up the components needed for this, you're ready to execute operations in Azure VMware Solution vCenter Server from the Azure portal. Arc-enabled Azure VMware Solution allows you to do the  actions:

- Identify your VMware vSphere resources (VMs, templates, networks, datastores, clusters/hosts/resource pools) and register them with Arc at scale. 
- Perform different virtual machine (VM) operations directly from Azure like; create, resize, delete, and power cycle operations (start/stop/restart) on VMware VMs consistently with Azure.
- Permit developers and application teams to use VM operations on-demand with [Role-based access control (RBAC)](https://learn.microsoft.com/azure/role-based-access-control/overview).
- Install the Arc-connected machine agent to [govern, protect, configure, and monitor](https://learn.microsoft.com/azure/azure-arc/servers/overview#supported-cloud-operations) them.
- Browse your VMware vSphere resources (vms, templates, networks, and storage) in Azure


## How Arc-enabled VMware vSphere differs from Arc-enabled servers 

You have the flexibility to start with either option, Arc-enabled servers or Arc-enabled VMware vSphere. With both options, you receive the same consistent experience. Regardless of the initial option chosen, you can incorporate the other one later without disruption. The following information helps you understand the difference between both options:

**Arc-enabled servers**
Azure Arc-enabled servers interact on the guest operating system level. They do that with no awareness of the underlying infrastructure or the virtualization platform they're running on. Since Arc-enabled servers support bare-metal machines, there might not be a host hypervisor in some cases.

**Arc-enabled VMware vSphere**
Arc-enabled VMware vSphere is a superset of Arc-enabled servers that extends management capabilities beyond the quest operating system to the VM itself that provides lifecycle management and CRUD (Create, Read, Update, Delete) operations on a VMware vSphere VM. These lifecycle management capabilities are exposed in the Azure portal with a look and feel just like a regular Azure VM. Azure Arc-enabled VMware vSphere provides guest operating system management that uses the same components as Azure Arc-enabled servers.

## Deploy Arc
The following requirements must be met in order to use Azure Arc-enabled Azure VMware Solutions.

### Prerequisites

> [!IMPORTANT]
> You can't create the resources in a separate resource group. Ensure you use the same resource group from where the Azure VMware Solution private cloud was created to create your resources.

You need the following items to ensure you're set up to begin the onboarding process to deploy Arc for Azure VMware Solution.

- Validate the regional support before you start the onboarding process. Arc for Azure VMware Solution is supported in all regions where Arc for VMware vSphere on-premises is supported. For details, see [Azure Arc-enabled VMware vSphere](https://learn.microsoft.com/azure/azure-arc/vmware-vsphere/overview#supported-regions).
- A [management VM](https://learn.microsoft.com/azure/azure-arc/resource-bridge/system-requirements#management-machine-requirements) with internet access that has a direct line of site to the vCenter.
- From the Management VM, verify you  have access to [vCenter Server and NSX-T manager portals](https://learn.microsoft.com/azure/azure-vmware/tutorial-access-private-cloud#connect-to-the-vcenter-server-of-your-private-cloud).
- A resource group in the subscription where you have an owner or contributor role.
- An unused, isolated [NSX Data Center network segment](https://learn.microsoft.com/azure/azure-vmware/tutorial-nsx-t-network-segment) that is a static network segment used for deploying the Arc for Azure VMware Solution OVA. If an isolated NSX-T Data Center network segment doesn't exist, one gets created.
- Verify your Azure subscription is enabled and has connectivity to Azure end points.
- The firewall and proxy URLs must be allowlisted in order to enable communication from the management machine, Appliance VM, and Control Plane IP to the required Arc resource bridge URLs. See the [Azure eArc resource bridge (Preview) network requirements](https://learn.microsoft.com/azure/azure-arc/resource-bridge/network-requirements).
- Verify your vCenter Server version is 6.7 or higher.
- A resource pool or a cluster with a minimum capacity of 16 GB of RAM and four vCPUs.
- A datastore with a minimum of 100 GB of free disk space is available through the resource pool or cluster. 
- On the vCenter Server, allow inbound connections on TCP port 443. This action ensures that the Arc resource bridge and VMware vSphere cluster extension can communicate with the vCenter Server.
> [!NOTE]
> - Private endpoint is currently not supported.
> - DHCP support isn't available to customers at this time, only static IP addresses are currently supported.


## Registration to Arc for Azure VMware Solution feature set

The following **Register features** are for provider registration using Azure CLI.

```azurecli
az provider register --namespace Microsoft.ConnectedVMwarevSphere 
az provider register --namespace Microsoft.ExtendedLocation 
az provider register --namespace Microsoft.KubernetesConfiguration 
az provider register --namespace Microsoft.ResourceConnector 
az provider register --namespace Microsoft.AVS
```

Alternately, users can sign into their Subscription, navigate to the **Resource providers** tab, and register themselves on the resource providers mentioned previously.

```

## Onboard process to deploy Azure Arc

Use the following steps to guide you through the process to onboard Azure Arc for Azure VMware Solution.

1. Sign into the jumpbox VM and extract the contents from the compressed file from the following [location](https://github.com/Azure/ArcOnAVS/releases/latest). The extracted file contains the scripts to install the preview software.
2. Open the 'config_avs.json' file and populate all the variables.

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
    - `networkForApplianceVM` is the name for the segment for Arc appliance VM. One gets created if it doesn't already exist.  
    - `networkCIDRForApplianceVM` is the IP CIDR of the segment for Arc appliance VM. It should be unique and not affect other networks of Azure VMware Solution management IP CIDR. 
    - `GatewayIPAddress` is the gateway for the segment for Arc appliance VM. 
    - `applianceControlPlaneIpAddress` is the IP address for the Kubernetes API server that should be part of the segment IP CIDR provided. It shouldn't be part of the K8s node pool IP range.  
    - `k8sNodeIPPoolStart`, `k8sNodeIPPoolEnd` are the starting and ending IP of the pool of IPs to assign to the appliance VM. Both need to be within the `networkCIDRForApplianceVM`. 
    - `k8sNodeIPPoolStart`, `k8sNodeIPPoolEnd`, `gatewayIPAddress` ,`applianceControlPlaneIpAddress` are optional. You can choose to skip all the optional fields or provide values for all. If you choose not to provide the optional fields, then you must use /28 address space for `networkCIDRForApplianceVM`

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

3. Run the installation scripts. You can optionionally setup this preview from a Windows or Linux-based jump box/VM. 

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

4. More Azure resources are created in your resource group.
    - Resource bridge
    - Custom location
    - VMware vCenter

> [!IMPORTANT]
> After the successful installation of Azure Arc resource bridge, it's recommended to retain a copy of the resource bridge config.yaml files and the kubeconfig file safe and secure them in a place that facilitates easy retrieval. These files could be needed later to run commands to perform management operations on the resource bridge. You can find the 3 .yaml files (config files) and the kubeconfig file in the same folder where you ran the script.

When the script is run successfully, check the status to see if Azure Arc is now configured. To verify if your private cloud is Arc-enabled, do the following actions:

- In the left navigation, locate **Operations**.
- Choose **Azure Arc**. 
- Azure Arc state shows as **Configured**.

Recover from failed deployments 

If the Azure Arc resource bridge deployment fails, consult the [Azure Arc resource bridge troubleshooting](https://learn.microsoft.com/azure/azure-arc/resource-bridge/troubleshoot-resource-bridge) guide. While there can be many reasons why the Azure Arc resource bridge deployment fails, one of them is KVA timeout error. Learn more about the [KVA timeout error](https://learn.microsoft.com/azure/azure-arc/resource-bridge/troubleshoot-resource-bridge#kva-timeout-error) and how to troubleshoot. 

## Discover and project your VMware vSphere infrastructure resources to Azure

When Arc appliance is successfully deployed on your private cloud, you can do the following actions.

- View the status from within the private cloud left navigation under **Operations > Azure Arc**. 
- View the VMware vSphere infrastructure resources from the private cloud left navigation under **Private cloud** then select **Azure Arc vCenter resources**.
- Discover your VMware vSphere infrastructure resources and project them to Azure by navigating, **Private cloud > Arc vCenter resources > Virtual Machines**.
- Similar to VMs, customers can enable networks, templates, resource pools, and data-stores in Azure.

## Enable resource pools, clusters, hosts, datastores, networks, and VM templates in Azure

Once you connected your Azure VMware Solution private cloud to Azure, you can browse your vCenter inventory from the Azure portal. This section shows you how to enable resource pools, networks, and other non-VM resources in Azure.

> [!NOTE]
> Enabling Azure Arc on a VMware vSphere resource is a read-only operation on vCenter. It doesn't make changes to your resource in vCenter.

1. On your Azure VMware Solution private cloud, in the left navigation, locate **vCenter Inventory**.
2. Select the resource(s) you want to enable, then select **Enable in Azure**.
3. Select your Azure **Subscription** and **Resource Group**, then select **Enable**.

  The enable action starts a deployment and creates a resource in Azure, creating representations for your VMware vSphere resources. It allows you to manage who can access those resources through Role-based access control (RBAC) granularly. 

4. Repeat the previous steps for one or more network, resource pool, and VM template resources.

## Enable guest management and extension installation

Before you install an extension, you need to enable guest management on the VMware VM.

### Prerequisite

Before you can install an extension, ensure your target machine meets the following conditions:

- Is running a [supported operating system](https://learn.microsoft.com/azure/azure-arc/servers/prerequisites#supported-operating-systems).
- Is able to connect through the firewall to communicate over the internet and these [URLs](https://learn.microsoft.com/azure/azure-arc/servers/network-requirements?tabs=azure-cloud#urls) aren't blocked.
- Has VMware tools installed and running.
- Is powered on and the resource bridge has network connectivity to the host running the VM.

### Enable guest management

You need to enable guest management on the VMware VM before you can install an extension. Use the following steps to enable guest management.

1. Navigate to [Azure portal](https://portal.azure.com/).
1. From the left navigation, locate **vCenter Server Inventory** and choose **Virtual Machines** to view the list of VMs.
1. Select the VM you want to install the guest management agent on.
1. Select **Enable guest management** and provide the administrator username and password to enable guest management then select **Apply**.
1. Locate the VMware vSphere VM you want to check for guest management and install extensions on, select the name of the VM.
1. Select **Configuration** from the left navigation for a VMware VM.
1. Verify **Enable guest management** is now checked.

### Install the LogAnalytics extension

1. Go to Azure portal. 
1. Find the Arc-enabled Azure VMware Solution VM that you want to install an extension on and select the VM name. 
1. Locate **Extensions** from the left navigation and select **Add**.
1. Select the extension you want to install. 
    1. Based on the extension, you need to provide details. For example, `workspace Id` and `key` for LogAnalytics extension. 
1. When you're done, select **Review + create**. 

When the extension installation steps are completed, they trigger deployment and install the selected extension on the VM. 

## Supported extensions and management services

Perform VM operations on VMware VMs through Azure using [supported extensions and management services](https://learn.microsoft.com/azure/azure-arc/vmware-vsphere/perform-vm-ops-through-azure#supported-extensions-and-management-services)
