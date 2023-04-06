---
title: Azure Arc resource bridge (preview) system requirements
description: Learn about system requirements for Azure Arc resource bridge (preview).
ms.topic: conceptual
ms.date: 03/23/2023
---

# Azure Arc resource bridge (preview) system requirements

This article describes the system requirements for deploying Azure Arc resource bridge (preview).

Arc resource bridge is used with other partner products, such as [Azure Stack HCI](/azure-stack/hci/manage/azure-arc-vm-management-overview), [Arc-enabled VMware vSphere](../vmware-vsphere/index.yml), and [Arc-enabled System Center Virtual Machine Manager (SCVMM)](../system-center-virtual-machine-manager/index.yml). These products may have additional requirements.  

## Management tool requirements

[Azure CLI](/cli/azure/install-azure-cli) is required to deploy the Azure Arc resource bridge on supported private cloud environments.

If you're deploying on VMware, a x64 Python environment is required. The [pip](https://pypi.org/project/pip/) package installer for Python is also required.

If you're deploying on Azure Stack HCI, the x32 Azure CLI installer can be used to install Azure CLI.


Arc Appliance CLI extension, 'arcappliance', needs to be installed on the CLI. This can be done by running: `az extension add --name arcappliance`

## Minimum resource requirements

Arc resource bridge has the following minimum resource requirements:

- 50 GB disk space
- 4 vCPUs
- 8 GB memory

These minimum requirements enable most scenarios. However, a partner product may support a higher resource connection count to Arc resource bridge, which requires the bridge to have higher resource requirements. Failure to provide sufficient resources may cause errors during deployment, such as disk copy errors. Review the partner product's documentation for specific resource requirements.

> [!NOTE]
> To [use Arc resource bridge with Azure Kubernetes Service (AKS) on Azure Stack HCI](#aks-and-arc-resource-bridge-on-azure-stack-hci), the AKS clusters must be deployed prior to deploying Arc resource bridge. If Arc resource bridge has already been deployed, AKS clusters can't be installed unless you delete Arc resource bridge first. Once your AKS clusters are deployed to Azure Stack HCI, you can deploy Arc resource bridge again.

## Management machine requirements

The machine used to run the commands to deploy Arc resource bridge, and maintain it, is called the *management machine*. The management machine should be considered part of the Arc resource bridge ecosystem, as it has specific requirements and is necessary to manage the appliance VM.

Because the management machine needs these specific requirements to manage Arc resource bridge, once the machine is set up, it should continue to be the primary machine used to maintain Arc resource bridge.  

The management machine has the following requirements:

- [Azure CLI x64](/cli/azure/install-azure-cli-windows?tabs=azure-cli) installed.
- Open communication to Control Plane IP (`controlplaneendpoint` parameter in `createconfig` command).
- Open communication to Appliance VM IP (`k8snodeippoolstart` parameter in `createconfig` command).
- Open communication to the reserved Appliance VM IP for upgrade (`k8snodeippoolend` parameter in `createconfig` command).
- Internal and external DNS resolution. The DNS server must resolve internal names, such as the vCenter endpoint for vSphere or cloud agent service endpoint for Azure Stack HCI. The DNS server must also be able to resolve external addresses that are [required URLs](network-requirements.md#outbound-connectivity) for deployment.
- If using a proxy, the proxy server configuration on the management machine must allow the machine to have internet access and to connect to [required URLs](network-requirements.md#outbound-connectivity) needed for deployment, such as the URL to download OS images.

## Appliance VM requirements

Arc resource bridge consists of an appliance VM that is deployed on-premises. The appliance VM has visibility into the on-premises infrastructure and can tag on-premises resources (guest management) for availability in Azure Resource Manager (ARM). The appliance VM is assigned an IP address from the `k8snodeippoolstart` parameter in the `createconfig` command.  

The appliance VM has the following requirements:

- Open communication with the management machine, vCenter endpoint (for VMware), MOC cloud agent service endpoint (for Azure Stack HCI), or other control center for the on-premises environment.
- The appliance VM needs to be able to resolve the management machine and vice versa.
- Internet access.
- Connectivity to [required URLs](network-requirements.md#outbound-connectivity) enabled in proxy and firewall.
- Static IP assigned, used for the `k8snodeippoolstart` in configuration command. (If using DHCP, then the address must be reserved.)
- Ability to reach a DNS server that can resolve internal names, such as the vCenter endpoint for vSphere or cloud agent service endpoint for Azure Stack HCI. The DNS server must also be able to resolve external addresses, such as Azure service addresses, container registry names, and other [required URLs](network-requirements.md#outbound-connectivity).
- If using a proxy, the proxy server configuration is provided when running the `createconfig` command, which is used to create the configuration files of the appliance VM. The proxy should allow internet access on the appliance VM to connect to [required URLs](network-requirements.md#outbound-connectivity) needed for deployment, such as the URL to download OS images.

## Reserved appliance VM IP requirements

Arc resource bridge reserves an additional IP address to be used for the appliance VM upgrade. During upgrade, a new appliance VM is created with the reserved appliance VM IP. Once the new appliance VM is created, the old appliance VM is deleted, and its IP address becomes reserved for a future upgrade. The reserved appliance VM IP is assigned an IP address from the `k8snodeippoolend` parameter in the `az arcappliance createconfig` command.  

The reserved appliance VM IP has the following requirements:  

- Open communication with the management machine, vCenter endpoint (for VMware), MOC cloud agent service endpoint (for Azure Stack HCI), or other control center for the on-premises environment.
- The appliance VM needs to be able to resolve the management machine and vice versa.
- Internet access.
- Connectivity to [required URLs](network-requirements.md#outbound-connectivity) enabled in proxy and firewall.
- Static IP assigned, used for the `k8snodeippoolend` in configuration command. (If using DHCP, then the address must be reserved.)
- Ability to reach a DNS server that can resolve internal names, such as the vCenter endpoint for vSphere or cloud agent service endpoint for Azure Stack HCI. The DNS server must also be able to resolve external addresses, such as Azure service addresses, container registry names, and other [required URLs](network-requirements.md#outbound-connectivity).

## Control plane IP requirements

The appliance VM hosts a management Kubernetes cluster with a control plane that should be given a static IP. This IP is assigned from the `controlplaneendpoint` parameter in the `createconfig` command.

The control plane IP has the following requirements:

- Open communication with the management machine.
- The control plane needs to be able to resolve the management machine and vice versa.
- Static IP address assigned; the IP should be outside the DHCP range but still available on the network segment. This IP address can't be assigned to any other machine on the network. If you're using Azure Kubernetes Service on Azure Stack HCI (AKS hybrid) and installing resource bridge, then the control plane IP for the resource bridge can't be used by the AKS hybrid cluster. For specific instructions on deploying Arc resource bridge with AKS on Azure Stack HCI, see [AKS on HCI (AKS hybrid) - Arc resource bridge deployment](/azure/aks/hybrid/deploy-arc-resource-bridge-windows-server).

## User account and credentials

Arc resource bridge may require a separate user account with the necessary roles to view and manage resources in the on-premises infrastructure (such as Arc-enabled VMware vSphere or Arc-enabled SCVMM). If so, during creation of the configuration files, the `username` and `password` parameters will be required. The account credentials are then stored in a configuration file locally within the appliance VM.  

If the user account is set to periodically change passwords, [the credentials must be immediately updated on the resource bridge](maintenance.md#update-credentials-in-the-appliance-vm). This user account may also be set with a lockout policy to protect the on-premises infrastructure, in case the credentials aren't updated and the resource bridge makes multiple attempts to use expired credentials to access the on-premises control center.

For example, with Arc-enabled VMware, Arc resource bridge needs a separate user account for vCenter with the necessary roles. If the [credentials for the user account change](troubleshoot-resource-bridge.md#insufficient-permissions), then the credentials stored in Arc resource bridge must be immediately updated by running `az arcappliance update-infracredentials` from the [management machine](#management-machine-requirements). Otherwise, the appliance will make repeated attempts to use the expired credentials to access vCenter, which will result in a lockout of the account.

## Configuration files

Arc resource bridge consists of an appliance VM that is deployed in the on-premises infrastructure. To maintain the appliance VM, the configuration files generated during deployment must be saved in a secure location and made available on the management machine.

There are several different types of configuration files, based on the on-premises infrastructure.

### Appliance configuration files

Three configuration files are created when the `createconfig` command completes (or the equivalent commands used by Azure Stack HCI and AKS hybrid): resource.yaml, appliance.yaml and infra.yaml.

By default, these files are generated in the current CLI directory when `createconfig` completes. These files should be saved in a secure location on the management machine, because they're required for maintaining the appliance VM. Because the configuration files reference each other, all three files must be stored in the same location. If the files are moved from their original location at deployment, open the files to check that the reference paths to the configuration files are accurate.

### Kubeconfig

The appliance VM hosts a management Kubernetes cluster. The kubeconfig is a low-privilege Kubernetes configuration file that is used to maintain the appliance VM. By default, it's generated in the current CLI directory when the `deploy` command completes. The kubeconfig should be saved in a secure location to the management machine, because it's required for maintaining the appliance VM.

### HCI login configuration file (Azure Stack HCI only)

Arc resource bridge uses a MOC login credential called [KVA token](/azure-stack/hci/manage/deploy-arc-resource-bridge-using-command-line#set-up-arc-vm-management) (kvatoken.tok) to interact with Azure Stack HCI. The KVA token is generated with the appliance configuration files when deploying Arc resource bridge. This token is also used when collecting logs for Arc resource bridge, so it should be saved in a secure location with the rest of the appliance configuration files. This file is saved in the directory provided during configuration file creation or the default CLI directory.

## AKS and Arc Resource Bridge on Azure Stack HCI

To use AKS and Arc resource bridge together on Azure Stack HCI, the AKS cluster must be deployed prior to deploying Arc resource bridge. If Arc resource bridge has already been deployed, AKS can't be deployed unless you delete Arc resource bridge first. Once your AKS cluster is deployed to Azure Stack HCI, you can deploy Arc resource bridge.

When deploying Arc resource bridge with AKS on Azure Stack HCI (AKS Hybrid), the resource bridge should share the same 'vswitchname' and `ipaddressprefix`, but require different IP addresses for `vippoolstart/end` and `k8snodeippoolstart/end`. Arc resource bridge should be given a unique 'vnetname' that is different from the one used for AKS Hybrid. For full instructions to deploy Arc resource bridge on AKS Hybrid, see [How to install Azure Arc Resource Bridge on Windows Server - AKS hybrid](/azure/aks/hybrid/deploy-arc-resource-bridge-windows-server). 

## Next steps

- Understand [network requirements for Azure Arc resource bridge (preview)](network-requirements.md).
- Review the [Azure Arc resource bridge (preview) overview](overview.md) to understand more about features and benefits.
- Learn about [security configuration and considerations for Azure Arc resource bridge (preview)](security-overview.md).
