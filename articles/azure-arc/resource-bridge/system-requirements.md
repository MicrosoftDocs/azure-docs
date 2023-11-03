---
title: Azure Arc resource bridge (preview) system requirements
description: Learn about system requirements for Azure Arc resource bridge (preview).
ms.topic: conceptual
ms.date: 06/15/2023
---

# Azure Arc resource bridge (preview) system requirements

This article describes the system requirements for deploying Azure Arc resource bridge (preview).

Arc resource bridge is used with other partner products, such as [Azure Stack HCI](/azure-stack/hci/manage/azure-arc-vm-management-overview), [Arc-enabled VMware vSphere](../vmware-vsphere/index.yml), and [Arc-enabled System Center Virtual Machine Manager (SCVMM)](../system-center-virtual-machine-manager/index.yml). These products may have additional requirements.  

## Required Azure permissions

- To onboard Arc resource bridge, you must have the [Contributor](/azure/role-based-access-control/built-in-roles) role for the resource group.

- To read, modify, and delete Arc resource bridge, you must have the [Contributor](/azure/role-based-access-control/built-in-roles) role for the resource group.

## Management tool requirements

[Azure CLI](/cli/azure/install-azure-cli) is required to deploy the Azure Arc resource bridge on supported private cloud environments.

If deploying Arc resource bridge on VMware, Azure CLI 64-bit is required to be installed on the management machine to run the deployment commands.

If deploying on Azure Stack HCI, then Azure CLI 32-bit should be installed on the management machine.

Arc Appliance CLI extension, 'arcappliance', needs to be installed on the CLI. This can be done by running: `az extension add --name arcappliance`

## Minimum resource requirements

Arc resource bridge has the following minimum resource requirements:

- 50 GB disk space
- 4 vCPUs
- 8 GB memory

These minimum requirements enable most scenarios. However, a partner product may support a higher resource connection count to Arc resource bridge, which requires the bridge to have higher resource requirements. Failure to provide sufficient resources may cause errors during deployment, such as disk copy errors. Review the partner product's documentation for specific resource requirements.

> [!NOTE]
> To use Azure Kubernetes Service (AKS) on Azure Stack HCI with Arc resource bridge, AKS must be deployed prior to deploying Arc resource bridge. If Arc resource bridge has already been deployed, AKS can't be installed unless you delete Arc resource bridge first. Once AKS is deployed to Azure Stack HCI, you can deploy Arc resource bridge again.

## IP address prefix (subnet) requirements

The IP address prefix (subnet) where Arc resource bridge will be deployed requires a minimum prefix of /29. The IP address prefix must have enough available IP addresses for the gateway IP, control plane IP, appliance VM IP, and reserved appliance VM IP. Please work with your network engineer to ensure that there is an available subnet with the required available IP addresses and IP address prefix for Arc resource bridge.

The IP address prefix is the subnet's IP address range for the virtual network and subnet mask (IP Mask) in CIDR notation, for example `192.168.7.1/24`. You provide the IP address prefix (in CIDR notation) during the creation of the configuration files for Arc resource bridge. 

Consult your network engineer to obtain the IP address prefix in CIDR notation. An IP Subnet CIDR calculator may be used to obtain this value.

## Static IP configuration

If deploying Arc resource bridge to a production environment, static configuration must be used when deploying Arc resource bridge. Static IP configuration is used to assign three static IPs (that are in the same subnet) to the Arc resource bridge control plane, appliance VM, and reserved appliance VM.

DHCP is only supported in a test environment for testing purposes only for VM management on Azure Stack HCI. DHCP should not be used in a production environment. It is not supported on any other Arc-enabled private cloud, including Arc-enabled VMware, Arc for AVS or Arc-enabled SCVMM. If using DHCP, you must reserve the IP addresses used by the control plane and appliance VM. In addition, these IPs must be outside of the assignable DHCP range of IPs. Ex: The control plane IP should be treated as a reserved/static IP that no other machine on the network will use or receive from DHCP. If the control plane IP or appliance VM IP changes (ex: due to an outage, this impacts the resource bridge availability and functionality.

## Management machine requirements

The machine used to run the commands to deploy and maintain Arc resource bridge is called the *management machine*. 

Management machine requirements:

- [Azure CLI x64](/cli/azure/install-azure-cli-windows?tabs=azure-cli) installed.
- Open communication to Control Plane IP (`controlplaneendpoint` parameter in `createconfig` command).
- Open communication to Appliance VM IP. 
- Open communication to the reserved Appliance VM IP. 
- if applicable, communication over port 443 to the private cloud management console (ex: VMware vCenter host machine)
- Internal and external DNS resolution. The DNS server must resolve internal names, such as the vCenter endpoint for vSphere or cloud agent service endpoint for Azure Stack HCI. The DNS server must also be able to resolve external addresses that are [required URLs](network-requirements.md#outbound-connectivity) for deployment.
- Internet access
  
## Appliance VM IP address requirements

Arc resource bridge consists of an appliance VM that is deployed on-premises. The appliance VM has visibility into the on-premises infrastructure and can tag on-premises resources (guest management) for projection into Azure Resource Manager (ARM). 

The appliance VM is assigned an IP address from the `k8snodeippoolstart` parameter in the `createconfig` command; it may be referred to in partner products as Start Range IP, RB IP Start or VM IP 1. 

The appliance VM IP is the starting IP address for the appliance VM IP pool range. The VM IP pool range requires a minimum of 2 IP addresses.

Appliance VM IP address requirements:

- Open communication with the management machine and management endpoint (such as vCenter for VMware or MOC cloud agent service endpoint for Azure Stack HCI).
- Internet connectivity to [required URLs](network-requirements.md#outbound-connectivity) enabled in proxy/firewall.
- Static IP assigned (strongly recommended)
   - If using DHCP, then the address must be reserved and  outside of the assignable DHCP range of IPs. No other machine on the network will use or receive this IP from DHCP. DHCP is generally not recommended because a change in IP address (ex: due to an outage) impacts the resource bridge availability.

- Must be from within the IP address prefix.
- Internal and external DNS resolution. 
- If using a proxy, the proxy server has to be reachable from this IP and all IPs within the VM IP pool.

## Reserved appliance VM IP requirements

Arc resource bridge reserves an additional IP address to be used for the appliance VM upgrade. 

The reserved appliance VM IP is assigned an IP address via the `k8snodeippoolend` parameter in the `az arcappliance createconfig` command. This IP address may be referred to as End Range IP, RB IP End, or VM IP 2.

The reserved appliance VM IP is the ending IP address for the appliance VM IP pool range. If specifying an IP pool range larger than two IP addresses, the additional IPs are reserved.

Reserved appliance VM IP requirements:  

- Open communication with the management machine and management endpoint (such as vCenter for VMware or MOC cloud agent service endpoint for Azure Stack HCI).

- Internet connectivity to [required URLs](network-requirements.md#outbound-connectivity) enabled in proxy/firewall.

- Static IP assigned (strongly recommended)

   - If using DHCP, then the address must be reserved and  outside of the assignable DHCP range of IPs. No other machine on the network will use or receive this IP from DHCP. DHCP is generally not recommended because a change in IP address (ex: due to an outage) impacts the resource bridge availability.

   - Must be from within the IP address prefix.

   - Internal and external DNS resolution. 

   - If using a proxy, the proxy server has to be reachable from this IP and all IPs within the VM IP pool.

## Control plane IP requirements

The appliance VM hosts a management Kubernetes cluster with a control plane that requires a single, static IP address. This IP is assigned from the `controlplaneendpoint` parameter in the `createconfig` command or equivalent configuration files creation command. 

Control plane IP requirements:

   - Open communication with the management machine.
   - Static IP address assigned; the IP address should be outside the DHCP range but still available on the network segment. This IP address can't be assigned to any other machine on the network. 
   - If using DHCP, the control plane IP should be a single reserved IP that is outside of the assignable DHCP range of IPs. No other machine on the network will use or receive this IP from DHCP. DHCP is generally not recommended because a change in IP address (ex: due to an outage) impacts the resource bridge availability.
   - If using Azure Kubernetes Service on Azure Stack HCI (AKS hybrid) and installing Arc resource bridge, then the control plane IP for the resource bridge can't be used by the AKS hybrid cluster. For specific instructions on deploying Arc resource bridge with AKS on Azure Stack HCI, see [AKS on HCI (AKS hybrid) - Arc resource bridge deployment](/azure/aks/hybrid/deploy-arc-resource-bridge-windows-server).

   - If using a proxy, the proxy server has to be reachable from IPs within the IP address prefix, including the reserved appliance VM IP. 

## DNS server
   
DNS server(s) must have internal and external endpoint resolution. The appliance VM and control plane need to resolve the management machine and vice versa. All three IPs must be able to reach the required URLs for deployment.

## Gateway
   
The gateway IP should be an IP from within the subnet designated in the IP address prefix.

## Example minimum configuration for static IP deployment
   
The following example shows valid configuration values that can be passed during configuration file creation for Arc resource bridge. It is strongly recommended to use static IP addresses when deploying Arc resource bridge. 

Notice that the IP addresses for the gateway, control plane, appliance VM and DNS server (for internal resolution) are within the IP address prefix. This key detail helps ensure successful deployment of the appliance VM.

   IP Address Prefix (CIDR format): 192.168.0.0/29

   Gateway (IP format): 192.168.0.1

   VM IP Pool Start (IP format): 192.168.0.2

   VM IP Pool End (IP format): 192.168.0.3

   Control Plane IP (IP format): 192.168.0.4

   DNS servers (IP list format): 192.168.0.1, 10.0.0.5, 10.0.0.6

## User account and credentials

Arc resource bridge may require a separate user account with the necessary roles to view and manage resources in the on-premises infrastructure (such as Arc-enabled VMware vSphere). If so, during creation of the configuration files, the `username` and `password` parameters will be required. The account credentials are then stored in a configuration file locally within the appliance VM.  

If the user account is set to periodically change passwords, [the credentials must be immediately updated on the resource bridge](maintenance.md#update-credentials-in-the-appliance-vm). This user account may also be set with a lockout policy to protect the on-premises infrastructure, in case the credentials aren't updated and the resource bridge makes multiple attempts to use expired credentials to access the on-premises control center.

For example, with Arc-enabled VMware, Arc resource bridge needs a separate user account for vCenter with the necessary roles. If the [credentials for the user account change](troubleshoot-resource-bridge.md#insufficient-permissions), then the credentials stored in Arc resource bridge must be immediately updated by running `az arcappliance update-infracredentials` from the [management machine](#management-machine-requirements). Otherwise, the appliance will make repeated attempts to use the expired credentials to access vCenter, which will result in a lockout of the account.

## Configuration files

Arc resource bridge consists of an appliance VM that is deployed in the on-premises infrastructure. To maintain the appliance VM, the configuration files generated during deployment must be saved in a secure location and made available on the management machine.

There are several different types of configuration files, based on the on-premises infrastructure.

### Appliance configuration files

Three configuration files are created when the `createconfig` command completes (or the equivalent commands used by Azure Stack HCI and AKS hybrid): `<appliance-name>-resource.yaml`, `<appliance-name>-appliance.yaml` and `<appliance-name>-infra.yaml`.

By default, these files are generated in the current CLI directory when `createconfig` completes. These files should be saved in a secure location on the management machine, because they're required for maintaining the appliance VM. Because the configuration files reference each other, all three files must be stored in the same location. If the files are moved from their original location at deployment, open the files to check that the reference paths to the configuration files are accurate.

By default, these files are generated in the current CLI directory when `createconfig` completes. These files should be saved in a secure location on the management machine, because they're required for maintaining the appliance VM. Because the configuration files reference each other, all three files must be stored in the same location. If the files are moved from their original location at deployment, open the files to check that the reference paths to the configuration files are accurate.

### Kubeconfig

The appliance VM hosts a management Kubernetes cluster. The kubeconfig is a low-privilege Kubernetes configuration file that is used to maintain the appliance VM. By default, it's generated in the current CLI directory when the `deploy` command completes. The kubeconfig should be saved in a secure location to the management machine, because it's required for maintaining the appliance VM. 

### HCI login configuration file (Azure Stack HCI only)

Arc resource bridge uses a MOC login credential called [KVA token](/azure-stack/hci/manage/deploy-arc-resource-bridge-using-command-line#set-up-arc-vm-management) (kvatoken.tok) to interact with Azure Stack HCI. The KVA token is generated with the appliance configuration files when deploying Arc resource bridge. This token is also used when collecting logs for Arc resource bridge, so it should be saved in a secure location with the rest of the appliance configuration files. This file is saved in the directory provided during configuration file creation or the default CLI directory.

## AKS on Azure Stack HCI with Arc resource bridge
   
When you deploy Arc resource bridge with AKS on Azure Stack HCI (AKS-HCI), the following configurations must be applied:

- Arc resource bridge and AKS-HCI should share the same `vswitchname` and be in the same subnet, sharing the same value for the parameter, `ipaddressprefix` .

- The IP address prefix (subnet) must contain enough IP addresses for both the Arc resource bridge and AKS-HCI.

- Arc resource bridge should be given a unique `vnetname` that is different from the one used for AKS Hybrid. 

- The Arc resource bridge requires different IP addresses for `vippoolstart/end` and `k8snodeippoolstart/end`. These IPs can't be shared between the two.

- Arc resource bridge and AKS-HCI must each have a unique control plane IP.

For instructions to deploy Arc resource bridge on AKS Hybrid, see [How to install Azure Arc Resource Bridge on Windows Server - AKS hybrid](/azure/aks/hybrid/deploy-arc-resource-bridge-windows-server). 

## Next steps

- Understand [network requirements for Azure Arc resource bridge (preview)](network-requirements.md).

- Review the [Azure Arc resource bridge (preview) overview](overview.md) to understand more about features and benefits.

- Learn about [security configuration and considerations for Azure Arc resource bridge (preview)](security-overview.md).





