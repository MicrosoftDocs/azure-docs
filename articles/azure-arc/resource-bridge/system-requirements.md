---
title: Azure Arc resource bridge system requirements
description: Learn about system requirements for Azure Arc resource bridge.
ms.topic: conceptual
ms.date: 05/22/2024
---

# Azure Arc resource bridge system requirements

This article describes the system requirements for deploying Azure Arc resource bridge.

Arc resource bridge is used with other partner products, such as [Azure Stack HCI](/azure-stack/hci/manage/azure-arc-vm-management-overview), [Arc-enabled VMware vSphere](../vmware-vsphere/index.yml), and [Arc-enabled System Center Virtual Machine Manager (SCVMM)](../system-center-virtual-machine-manager/index.yml). These products may have additional requirements.  

## Required Azure permissions

- To onboard Arc resource bridge, you must have the [Contributor](/azure/role-based-access-control/built-in-roles) role for the resource group.

- To read, modify, and delete Arc resource bridge, you must have the [Contributor](/azure/role-based-access-control/built-in-roles) role for the resource group.

## Management tool requirements

[Azure CLI](/cli/azure/install-azure-cli) is required to deploy the Azure Arc resource bridge on supported private cloud environments.

If deploying Arc resource bridge on VMware, Azure CLI 64-bit is required to be installed on the management machine to run the deployment commands.

If deploying on Azure Stack HCI, then Azure CLI 32-bit should be installed on the management machine.

Arc Appliance CLI extension, `arcappliance`, needs to be installed on the CLI. This can be done by running: `az extension add --name arcappliance`

## Minimum resource requirements

Arc resource bridge has the following minimum resource requirements:

- 50 GB disk space
- 4 vCPUs
- 8 GB memory

These minimum requirements enable most scenarios. However, a partner product may support a higher resource connection count to Arc resource bridge, which requires the bridge to have higher resource requirements. Failure to provide sufficient resources may cause errors during deployment, such as disk copy errors. Review the partner product's documentation for specific resource requirements.

## IP address prefix (subnet) requirements

The IP address prefix (subnet) where Arc resource bridge will be deployed requires a minimum prefix of /29. The IP address prefix must have enough available IP addresses for the gateway IP, control plane IP, appliance VM IP, and reserved appliance VM IP. Arc resource bridge only uses the IP addresses assigned to the IP pool range (Start IP, End IP) and the Control Plane IP. We recommend that the End IP immediately follow the Start IP. Ex: Start IP =192.168.0.2, End IP = 192.168.0.3. Please work with your network engineer to ensure that there is an available subnet with the required available IP addresses and IP address prefix for Arc resource bridge.

The IP address prefix is the subnet's IP address range for the virtual network and subnet mask (IP Mask) in CIDR notation, for example `192.168.7.1/29`. You provide the IP address prefix (in CIDR notation) during the creation of the configuration files for Arc resource bridge. 

Consult your network engineer to obtain the IP address prefix in CIDR notation. An IP Subnet CIDR calculator may be used to obtain this value.

## Static IP configuration

If deploying Arc resource bridge to a production environment, static configuration must be used when deploying Arc resource bridge. Static IP configuration is used to assign three static IPs (that are in the same subnet) to the Arc resource bridge control plane, appliance VM, and reserved appliance VM.

DHCP is only supported in a test environment for testing purposes only for VM management on Azure Stack HCI. It should not be used in a production environment. DHCP isn't supported on any other Arc-enabled private cloud, including Arc-enabled VMware, Arc for AVS, or Arc-enabled SCVMM. 

If using DHCP, you must reserve the IP addresses used by the control plane and appliance VM. In addition, these IPs must be outside of the assignable DHCP range of IPs. Ex: The control plane IP should be treated as a reserved/static IP that no other machine on the network will use or receive from DHCP. If the control plane IP or appliance VM IP changes, this impacts the resource bridge availability and functionality.

## Management machine requirements

The machine used to run the commands to deploy and maintain Arc resource bridge is called the *management machine*. 

Management machine requirements:

- [Azure CLI x64](/cli/azure/install-azure-cli-windows?tabs=azure-cli) installed
- Communication to Control Plane IP (SSH TCP port 22, Kubernetes API port 6443)

- Communication to Appliance VM IPs (SSH TCP port 22, Kubernetes API port 6443)

- Communication to the reserved Appliance VM IPs (SSH TCP port 22, Kubernetes API port 6443)

- communication over port 443 to the private cloud management console (ex: VMware vCenter machine)

- Internal and external DNS resolution. The DNS server must resolve internal names, such as the vCenter endpoint for vSphere or cloud agent service endpoint for Azure Stack HCI. The DNS server must also be able to resolve external addresses that are [required URLs](network-requirements.md#outbound-connectivity-requirements) for deployment.
- Internet access
  
## Appliance VM IP address requirements

Arc resource bridge consists of an appliance VM that is deployed on-premises. The appliance VM has visibility into the on-premises infrastructure and can tag on-premises resources (guest management) for projection into Azure Resource Manager (ARM). The appliance VM is assigned an IP address from the `k8snodeippoolstart` parameter in the `createconfig` command. It may be referred to in partner products as Start Range IP, RB IP Start or VM IP 1. The appliance VM IP is the starting IP address for the appliance VM IP pool range; therefore, when you first deploy Arc resource  bridge, this is the IP that's initially assigned to your appliance VM. The VM IP pool range requires a minimum of 2 IP addresses.

Appliance VM IP address requirements:

- Communication with the management machine (SSH TCP port 22, Kubernetes API port 6443)

- Communication with the private cloud management endpoint via Port 443 (such as VMware vCenter).

- Internet connectivity to [required URLs](network-requirements.md#outbound-connectivity-requirements) enabled in proxy/firewall.
- Static IP assigned and within the IP address prefix.

- Internal and external DNS resolution.
- If using a proxy, the proxy server has to be reachable from this IP and all IPs within the VM IP pool.

## Reserved appliance VM IP requirements

Arc resource bridge reserves an additional IP address to be used for the appliance VM upgrade. The reserved appliance VM IP is assigned an IP address via the `k8snodeippoolend` parameter in the `az arcappliance createconfig` command. This IP address may be referred to as End Range IP, RB IP End, or VM IP 2. The reserved appliance VM IP is the ending IP address for the appliance VM IP pool range. When your appliance VM is upgraded for the first time, this is the IP assigned to your appliance VM post-upgrade and the initial appliance VM IP is returned to the IP pool to be used for a future upgrade. If specifying an IP pool range larger than two IP addresses, the additional IPs are reserved.

Reserved appliance VM IP requirements:  

- Communication with the management machine (SSH TCP port 22, Kubernetes API port 6443)

- Communication with the private cloud management endpoint via Port 443 (such as VMware vCenter).

- Internet connectivity to [required URLs](network-requirements.md#outbound-connectivity-requirements) enabled in proxy/firewall.

- Static IP assigned and within the IP address prefix.

- Internal and external DNS resolution.

- If using a proxy, the proxy server has to be reachable from this IP and all IPs within the VM IP pool.

## Control plane IP requirements

The appliance VM hosts a management Kubernetes cluster with a control plane that requires a single, static IP address. This IP is assigned from the `controlplaneendpoint` parameter in the `createconfig` command or equivalent configuration files creation command.

Control plane IP requirements:

- Communication with the management machine (SSH TCP port 22, Kubernetes API port 6443).

- Static IP address assigned and within the IP address prefix.

- If using a proxy, the proxy server has to be reachable from IPs within the IP address prefix, including the reserved appliance VM IP.

## DNS server

DNS server(s) must have internal and external endpoint resolution. The appliance VM and control plane need to resolve the management machine and vice versa. All three IPs must be able to reach the required URLs for deployment.

## Gateway

The gateway IP is the IP of the gateway for the network where Arc resource bridge is deployed. The gateway IP should be an IP from within the subnet designated in the IP address prefix.

## Example minimum configuration for static IP deployment

The following example shows valid configuration values that can be passed during configuration file creation for Arc resource bridge. 

Notice that the IP addresses for the gateway, control plane, appliance VM and DNS server (for internal resolution) are within the IP address prefix. The VM IP Pool Start/End are sequential. This key detail helps ensure successful deployment of the appliance VM.

   IP Address Prefix (CIDR format): 192.168.0.0/29

   Gateway IP: 192.168.0.1

   VM IP Pool Start (IP format): 192.168.0.2

   VM IP Pool End (IP format): 192.168.0.3

   Control Plane IP: 192.168.0.4

   DNS servers (IP list format): 192.168.0.1, 10.0.0.5, 10.0.0.6

## User account and credentials

Arc resource bridge may require a separate user account with the necessary roles to view and manage resources in the on-premises infrastructure (such as Arc-enabled VMware vSphere). If so, during creation of the configuration files, the `username` and `password` parameters will be required. The account credentials are then stored in a configuration file locally within the appliance VM.  

> [!WARNING]
> Arc resource bridge can only use a user account that does not have multifactor authentication enabled. If the user account is set to periodically change passwords, [the credentials must be immediately updated on the resource bridge](maintenance.md#update-credentials-in-the-appliance-vm). This user account can also be set with a lockout policy to protect the on-premises infrastructure, in case the credentials aren't updated and the resource bridge makes multiple attempts to use expired credentials to access the on-premises control center.

For example, with Arc-enabled VMware, Arc resource bridge needs a separate user account for vCenter with the necessary roles. If the [credentials for the user account change](troubleshoot-resource-bridge.md#insufficient-permissions), then the credentials stored in Arc resource bridge must be immediately updated by running `az arcappliance update-infracredentials` from the [management machine](#management-machine-requirements). Otherwise, the appliance will make repeated attempts to use the expired credentials to access vCenter, which will result in a lockout of the account.

## Configuration files

Arc resource bridge consists of an appliance VM that is deployed in the on-premises infrastructure. To maintain the appliance VM, the configuration files generated during deployment must be saved in a secure location and made available on the management machine.

There are several different types of configuration files, based on the on-premises infrastructure.

### Appliance configuration files

Three configuration files are created when deploying the Arc resource bridge: `<appliance-name>-resource.yaml`, `<appliance-name>-appliance.yaml` and `<appliance-name>-infra.yaml`.

By default, these files are generated in the current CLI directory of where the deployment commands are run. These files should be saved on the management machine because they're required for maintaining the appliance VM. The configuration files reference each other and should be stored in the same location. 

### Kubeconfig

The appliance VM hosts a management Kubernetes cluster. The kubeconfig is a low-privilege Kubernetes configuration file that is used to maintain the appliance VM. By default, it's generated in the current CLI directory when the `deploy` command completes. The kubeconfig should be saved in a secure location on the management machine, because it's required for maintaining the appliance VM. If the kubeconfig is lost, it can be retrieved by running the `az arcappliance get-credentials` command.

> [!IMPORTANT]
> Once the Arc resource bridge VM is created, the configuration settings can't be modified or updated. Also, the appliance VM must stay in the location where it was initially deployed. Capabilities to allow appliance VM configuration and location changes post-deployment will be available in a future release. However, the Arc resource bridge VM name is a unique GUID that can't be renamed as it's an identifier used for cloud-managed upgrade.
## Next steps

- Understand [network requirements for Azure Arc resource bridge](network-requirements.md).
- Review the [Azure Arc resource bridge overview](overview.md) to understand more about features and benefits.
- Learn about [security configuration and considerations for Azure Arc resource bridge](security-overview.md).
