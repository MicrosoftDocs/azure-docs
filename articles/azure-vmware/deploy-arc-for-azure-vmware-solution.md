---
title: Deploy Arc-enabled VMware vSphere for Azure VMware Solution private cloud
description: Learn how to set up and enable Arc for your Azure VMware Solution private cloud.
ms.topic: how-to 
ms.service: azure-vmware
ms.date: 05/15/2024
ms.custom: references_regions, devx-track-azurecli, engagement-fy23
---

# Deploy Arc-enabled VMware vSphere for Azure VMware Solution private cloud

In this article, learn how to deploy Arc-enabled VMware vSphere for Azure VMware Solution private cloud. Once you set up the components needed, you're ready to execute operations in Azure VMware Solution vCenter Server from the Azure portal. 

Arc-enabled Azure VMware Solution allows you to do the following actions:

- Identify your VMware vSphere resources (VMs, templates, networks, datastores, clusters/hosts/resource pools) and register them with Arc at scale. 
- Perform different virtual machine (VM) operations directly from Azure like; create, resize, delete, and power cycle operations (start/stop/restart) on VMware VMs consistently with Azure.
- Permit developers and application teams to use VM operations on-demand with [Role-based access control](/azure/role-based-access-control/overview).
- Install the Arc-connected machine agent to [govern, protect, configure, and monitor](/azure/azure-arc/servers/overview#supported-cloud-operations) them.
- Browse your VMware vSphere resources (vms, templates, networks, and storage) in Azure

## Prerequisites

To deploy Arc for Azure VMware Solution, you need to ensure the following prerequisites are met.
- The following Register features are for provider registration using Azure CLI.

```dotnetcli
  az provider register --namespace Microsoft.ConnectedVMwarevSphere   
  az provider register --namespace Microsoft.ExtendedLocation  
  az provider register --namespace Microsoft.KubernetesConfiguration   
  az provider register --namespace Microsoft.ResourceConnector    
  az provider register --namespace Microsoft.AVS  
```
- Alternately, you can sign in to your Subscription and follow these steps.
1. Navigate to the Resource providers tab.
1. Register the resource providers mentioned above.

> [!IMPORTANT]
> You can't create the resources in a separate resource group. Ensure you use the same resource group from where the Azure VMware Solution private cloud was created to create your resources.

You need the following items to ensure you're set up to begin the onboarding process to deploy [Arc Resource Bridge](/azure/azure-arc/resource-bridge/overview) for Azure VMware Solution. 

- Validate the regional support before you start the onboarding process. Arc for Azure VMware Solution is supported in all regions where Arc for VMware vSphere on-premises is supported. For details, see [Azure Arc-enabled VMware vSphere](/azure/azure-arc/vmware-vsphere/overview#supported-regions).
- A [management VM](/azure/azure-arc/resource-bridge/system-requirements#management-machine-requirements) with internet access that has a direct line of site to the vCenter Server.
- [Support Matrix](/azure/azure-arc/vmware-vsphere/support-matrix-for-arc-enabled-vmware-vsphere) for using Azure Arc to manage your Azure VMware Solution VMs. 
- [Ensure Azure Arc resource bridge system requirements](/azure/azure-arc/resource-bridge/system-requirements) are met before proceeding with the deployment. 
- A [management VM](/azure/azure-arc/resource-bridge/system-requirements#management-machine-requirements) with internet access that has a direct line of site to the vCenter Server.
- From the Management VM, verify you  have access to [vCenter Server and NSX Manager portals](/azure/azure-vmware/tutorial-access-private-cloud#connect-to-the-vcenter-server-of-your-private-cloud).
- A resource group in the subscription where you have an owner or contributor role.
- An unused, [NSX network segment](/azure/azure-vmware/tutorial-nsx-t-network-segment) that is a static network segment used for deploying the Arc for Azure VMware Solution OVA. If an unused NSX network segment doesn't exist, one gets created.
- The firewall and proxy URLs must be allowlisted to enable communication from the management machine and Appliance VM to the required Arc resource bridge URLs. See [Ensure Azure Arc resource bridge system requirements](/azure/azure-arc/resource-bridge/system-requirements) for more details. 

- In addition, Azure VMware Solution requires the following:

    | Service   | Port |  URL      | Direction      | Notes          |
    |----------------------|------|---------------------------------------------------------|----------------------------|--------------------------------------------|
    | aka.ms Shortlinks    | 443  | `https://aka.ms/*`                                                                          | Outbound from Management VM| Used for Azure CLI installer and redirects |
    | GitHub (repos)       | 443  | `https://github.com/vmware/govmomi/*` or `https://github.com/*`                             | Outbound from Management VM| GitHub release files & repos               |
    | GitHub Raw Content   | 443  | `https://raw.githubusercontent.com/Azure/azure-cli/*` or `https://raw.githubusercontent.com/*`| Outbound from Management VM| Raw file access from GitHub                |

- vCenter Server requirements 
    - Verify your vCenter Server version is 7.0 or higher. 
    - Ensure the vCenter Server is accessible from the management VM. The management VM must be able to access the vCenter Server using the FQDN or IP address.
    - A resource pool or a cluster with a minimum capacity of 16 GB of RAM and 4 vCPUs.     
    - A datastore with a minimum of 100 GB of free disk space is available through the resource pool or cluster.  

  > [!Note] 
  > - Private endpoint is currently not supported. 
  > - Customers only have static IP addresses available; DHCP support is not currently offered. 

If you want to use a custom DNS, use the following steps: 

  1. In your Azure VMware Solution private cloud, navigate to the DNS page, under Workload networking, select **DNS, and identify the default forwarder-zones under the DNS zones tab. 
  2. Edit the forwarder zone to add the custom DNS server IP. By adding the custom DNS as the first IP, it allows requests to be directly forwarded to the first IP and decreases the number of retries. 

## Deployment considerations 

When you run software in Azure VMware Solution, as a private cloud in Azure, there are benefits not realized by operating your environment outside of Azure. For software running in a virtual machine (VM) like, SQL Server and Windows Server, running in Azure VMware Solution provides more value such as free Extended Security Updates (ESUs).

To take advantage of the benefits of running in an Azure VMware Solution, use this article to enable Arc and fully integrate the experience with the Azure VMware Solution private cloud. Alternatively, Arc-enabling VMs through the following mechanisms cannot create the necessary attributes to register the VM and software as part of Azure VMware Solution and results in billing for SQL Server ESUs for:

- Arc-enabled servers
- Arc-enabled VMware vSphere
- SQL Server enabled by Azure Arc

## Azure roles and permissions

The minimum Azure roles required for operations related to Arc-enabled VMware vSphere are as follows:

| Operation                                 | Minimum role required                      | Scope                                                                                                           |
|-------------------------------------------|--------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| Onboarding your vCenter Server to Arc     | Azure Arc VMware Private Clouds Onboarding | On the subscription or resource group into which you want to onboard                                            |
| Administering Arc-enabled VMware vSphere  | Azure Arc VMware Administrator             | On the subscription or resource group where vCenter server resource is created                                  |
| VM Provisioning                           | Azure Arc VMware Private Cloud User        | On the subscription or resource group that contains the resource pool/cluster/host, datastore, and virtual network resources, or on the resources themselves |
| VM Provisioning                           | Azure Arc VMware VM Contributor            | On the subscription or resource group where you want to provision VMs                                           |
| VM Operations                             | Azure Arc VMware VM Contributor            | On the subscription or resource group that contains the VM, or on the VM itself                                 |
     
 Any roles with higher permissions on the same scope, such as Owner or Contributor, can also allow you to perform the operations listed above. 

## Onboard process

Use the following steps to guide you through the process to onboard Azure Arc for Azure VMware Solution.

1. Sign in to the Management VM and extract the contents from the compressed file from the following [location](https://github.com/Azure/ArcOnAVS/releases/latest). The extracted file contains the scripts to install the software.
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
    - `k8sNodeIPPoolStart`, `k8sNodeIPPoolEnd`, `gatewayIPAddress` ,`applianceControlPlaneIpAddress` are optional. You can choose to skip all the optional fields or provide values for all. If you choose not to provide the optional fields, then you must use /28 address space for `networkCIDRForApplianceVM` with the first lp as the gateway.
    - If all the parameters are provided, the firewall and proxy URLs must be allowlisted for the lps between K8sNodeIPPoolStart, k8sNodeIPPoolEnd.
    - If you're skipping the optional fields, the firewall and proxy URLs must be allowlisted the following IPs in the segment. If the networkCIDRForApplianceVM is x.y.z.1/28, the IPs to allowlist are between x.y.z.11 – x.y.z.14. See the [Azure Arc resource bridge network requirements](/azure/azure-arc/resource-bridge/network-requirements).  

    **JSON example**
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

3. Run the installation scripts. You can optionally set up this preview from a Windows or Linux-based jump box/VM. 

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
4. More Azure resources are created in your resource group.
    - Resource bridge
    - Custom location
    - VMware vCenter Server
      
5. SSL proxy configuration 

If using a proxy, the Arc Resource Bridge must be configured to use the proxy in order to connect to Azure services. This approach requires other parameters to be specified during the onboarding process via the script. 

>[!Important]
> Arc Resource Bridge supports only direct (explicit) proxies, including unauthenticated proxies, proxies with basic authentication, SSL terminating proxies, and SSL passthrough proxies.

```
{ 

  "subscriptionId": "", 

  "resourceGroup": "", 

  "privateCloud": "", 

  "isStatic": true, 

  "staticIpNetworkDetails": { 

    "networkForApplianceVM": "", 

    "networkCIDRForApplianceVM": "" 

  }, 

  "applianceProxyDetails": { 

    "http": "", 

    "https": "", 

    "noProxy": "", 

    "certificateFilePath": "" 

  }, 

  "managementProxyDetails": { 

    "http": "", 

    "https": "", 

    "noProxy": "", 

    "certificateFilePath": "" 

  } 

} 
 

applianceProxyDetails - Provide the proxy details that needs to be used for the deployment of Arc Appliance in the network. 

managementProxyDetails - Provide the proxy details need to be used on management VM for running of the script. Provide these details only if you want to set or override the existing proxy settings on management VM. 

"http" - Proxy server address for http requests. 

"https" - Proxy server address for https requests. 

"noProxy" - The list of addresses that should be excluded from proxy. The endpoints those need to be excluded for Arc Deployment for both appliance and management VM are -localhost,127.0.0.1,.svc,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16, <esxihost endpoints common suffix> 

"certificateFilePath" - The certificate that has to be used for authentication if it is an SSL proxy. 

For more details on proxy configuration for Arc Deployment, Please check https://learn.microsoft.com/en-us/azure/azure-arc/resource-bridge/network-requirements#ssl-proxy-configuration 

 
Example: 
{ 

{  

  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",  

  "resourceGroup": "test-rg",  

  "privateCloud": "test-pc",  

  "isStatic": true,  

  "staticIpNetworkDetails": {  

   "networkForApplianceVM": "arc-segment",  

   "networkCIDRForApplianceVM": "10.14.10.1/28"  

  }  

} , 

 "applianceProxyDetails": { 

    "http": "http://contoso-proxy.com", 

    "https": "https://contoso-proxysecured.com", 

    "noProxy": "localhost,127.0.0.1,.svc,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,.5edef8ac24a6b4567785cd.australiaeast.avs.azure.com", 

    "certificateFilePath": "C:\Users\sampleUser.sslProxy.crt" 

  }, 

  "managementProxyDetails": { 

    "http": " http://contoso-proxy.com ", 

    "https": "https://contoso-proxysecured.com", 

    "noProxy": "localhost,127.0.0.1,.svc,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,.5edef8ac24a6b4567785cd.australiaeast.avs.azure.com", 

    "certificateFilePath": “C:\Users\sampleUser.sslProxy.crt" 

} 

} 
```

>[!IMPORTANT]
> After the successful installation of Azure Arc Resource Bridge, it's recommended to retain a copy of the resource bridge config.yaml files in a place that facilitates easy retrieval. These files could be needed later to run commands to perform management operations (for example, [az arc appliance upgrade](/cli/azure/arcappliance/upgrade#az-arcappliance-upgrade-vmware)) on the resource bridge. You can find the three .yaml files (config files) in the same folder where you ran the script.

When the script is run successfully, check the status to see if Azure Arc is now configured. To verify if your private cloud is Arc-enabled, do the following actions:

- In the left navigation, locate **Operations**.
- Choose **Azure Arc**. 
- Azure Arc state shows as **Configured**.

To recover from failed deployments: 

If the Azure Arc resource bridge deployment fails, consult the [Azure Arc resource bridge troubleshooting](/azure/azure-arc/resource-bridge/troubleshoot-resource-bridge) guide. While there can be many reasons why the Azure Arc resource bridge deployment fails, one of them is KVA timeout error. Learn more about the [KVA timeout error](/azure/azure-arc/resource-bridge/troubleshoot-resource-bridge#kva-timeout-error) and how to troubleshoot. 

## Discover and project your VMware vSphere infrastructure resources to Azure

When Arc appliance is successfully deployed on your private cloud, you can do the following actions.

- View the status from within the private cloud left navigation under **Operations > Azure Arc**. 
- View the VMware vSphere infrastructure resources from the private cloud left navigation under **Private cloud** then select **Azure Arc vCenter Server resources**.
- Discover your VMware vSphere infrastructure resources and project them to Azure by navigating, **Private cloud > Arc vCenter Server resources > Virtual Machines**.
- Similar to VMs, customers can enable networks, templates, resource pools, and data-stores in Azure.

## Enable virtual machines, resource pools, clusters, hosts, datastores, networks, and VM templates in Azure

Once you connected your Azure VMware Solution private cloud to Azure, you can browse your vCenter Server inventory from the Azure portal. This section shows you how to make these resources Azure enabled.

> [!NOTE]
> Enabling Azure Arc on a VMware vSphere resource is a read-only operation on vCenter Server. It doesn't make changes to your resource in vCenter Server.

1. On your Azure VMware Solution private cloud, in the left navigation, locate **vCenter Server Inventory**.
2. Select the resources you want to enable, then select **Enable in Azure**.
3. Select your Azure **Subscription** and **Resource Group**, then select **Enable**.

  The enable action starts a deployment and creates a resource in Azure, creating representative objects in Azure for your VMware vSphere resources. It allows you to manage who can access those resources through Role-based access control granularly. 

Repeat the previous steps for one or more virtual machine, network, resource pool, and VM template resources.

Additionally, for virtual machines there's another section to configure **VM extensions**.  This enables guest management to facilitate more Azure extensions to be installed on the VM. The steps to enable this would be:

1. Select **Enable guest management**.
2. Choose a __Connectivity Method__ for the Arc agent.
3. Provide an Administrator/Root access username and password for the VM.

If you choose to enable the guest management as a separate step or have issues with the VM extension install steps, see [Enable guest management and install extensions on Arc-enabled VMs](/azure/azure-vmware/arc-enable-guest-management).

## Next Steps

- To manage Arc-enabled Azure VMware Solution, see [Manage Arc-enabled Azure VMware private cloud - Azure VMware Solution](/azure/azure-vmware/manage-arc-enabled-azure-vmware-solution)
- To remove Arc-enabled  Azure VMware Solution resources from Azure, see [Remove Arc-enabled Azure VMware Solution vSphere resources from Azure - Azure VMware Solution.](/azure/azure-vmware/remove-arc-enabled-azure-vmware-solution-vsphere-resources-from-azure)
