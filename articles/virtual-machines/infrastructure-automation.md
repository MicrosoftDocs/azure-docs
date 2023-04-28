---
title: Use infrastructure automation tools
description: Learn how to use infrastructure automation tools such as Ansible, Chef, Puppet, Terraform, and Packer to create and manage virtual machines in Azure.
author: cynthn
ms.service: virtual-machines
ms.topic: conceptual
ms.workload: infrastructure
ms.custom: devx-track-terraform, devx-track-arm-template
ms.date: 02/25/2023
ms.author: cynthn
ms.reviewer: mattmcinnes
---

# Use infrastructure automation tools with virtual machines in Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

To create and manage Azure virtual machines (VMs) in a consistent manner at scale, some form of automation is typically desired. There are many tools and solutions that allow you to automate the complete Azure infrastructure deployment and management lifecycle. This article introduces some of the infrastructure automation tools that you can use in Azure. These tools commonly fit in to one of the following approaches:

- Automate the configuration of VMs
    - Tools include [Ansible](#ansible), [Chef](#chef), [Puppet](#puppet), and [Azure Resource Manager template](#azure-resource-manager-template).
    - Tools specific to VM customization include [cloud-init](#cloud-init) for Linux VMs, [PowerShell Desired State Configuration (DSC)](#powershell-dsc), and the [Azure Custom Script Extension](#azure-custom-script-extension) for all Azure VMs.

- Automate infrastructure management
    - Tools include [Packer](#packer) to automate custom VM image builds, and [Terraform](#terraform) to automate the infrastructure build process.
    - [Azure Automation](#azure-automation) can perform actions across your Azure and on-premises infrastructure.

- Automate application deployment and delivery
    - Examples include [Azure DevOps Services](#azure-devops-services) and [Jenkins](#jenkins).

## Ansible
[Ansible](https://www.ansible.com/) is an automation engine for configuration management, VM creation, or application deployment. Ansible uses an agent-less model, typically with SSH keys, to authenticate and manage target machines. Configuration tasks are defined in playbooks, with several Ansible modules available to carry out specific tasks. For more information, see [How Ansible works](https://www.ansible.com/how-ansible-works).

Learn how to:

- [Install and configure Ansible on Linux for use with Azure](/azure/developer/ansible/install-on-linux-vm).
- [Create a Linux virtual machine](/azure/developer/ansible/vm-configure).
- [Manage a Linux virtual machine](/azure/developer/ansible/vm-manage).


## Chef
[Chef](https://www.chef.io/) is an automation platform that helps define how your infrastructure is configured, deployed, and managed. Some components include Chef Habitat for application lifecycle automation rather than the infrastructure, and Chef InSpec that helps automate compliance with security and policy requirements. Chef Clients are installed on target machines, with one or more central Chef Servers that store and manage the configurations. For more information, see [An Overview of Chef](https://docs.chef.io/chef_overview.html).

Learn how to:

- [Deploy Chef Automate from the Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/chef-software.chef-automate?tab=Overview).
- [Install Chef on Windows and create Azure VMs](/azure/developer/chef/windows-vm-configure).


## Puppet
[Puppet](https://www.puppet.com) is an enterprise-ready automation platform that handles the application delivery and deployment process. Agents are installed on target machines to allow Puppet Master to run manifests that define the desired configuration of the Azure infrastructure and VMs. Puppet can integrate with other solutions such as Jenkins and GitHub for an improved devops workflow. For more information, see [How Puppet works](https://puppet.com/products/how-puppet-works).

Learn how to:

- [Deploy Puppet](https://puppet.com/docs/puppet/5.5/install_windows.html).


## Cloud-init
[Cloud-init](https://cloudinit.readthedocs.io) is a widely used approach to customize a Linux VM as it boots for the first time. You can use cloud-init to install packages and write files, or to configure users and security. Because cloud-init is called during the initial boot process, there are no extra steps or required agents to apply your configuration.  For more information on how to properly format your `#cloud-config` files, see the [cloud-init documentation site](https://cloudinit.readthedocs.io/en/latest/topics/format.html#cloud-config-data).  `#cloud-config` files are text files encoded in base64.

Cloud-init also works across distributions. For example, you don't use **apt-get install** or **yum install** to install a package. Instead you can define a list of packages to install. Cloud-init automatically uses the native package management tool for the distro you select.

We're actively working with our endorsed Linux distro partners in order to have cloud-init enabled images available in the Azure Marketplace. These images make your cloud-init deployments and configurations work seamlessly with VMs and Virtual Machine Scale Sets.
Learn more details about cloud-init on Azure:

- [Cloud-init support for Linux virtual machines in Azure](./linux/using-cloud-init.md)
- [Try a tutorial on automated VM configuration using cloud-init](./linux/tutorial-automate-vm-deployment.md).


## PowerShell DSC
[PowerShell Desired State Configuration (DSC)](/powershell/dsc/overview) is a management platform to define the configuration of target machines. DSC can also be used on Linux through the [Open Management Infrastructure (OMI) server](https://collaboration.opengroup.org/omi/).

DSC configurations define what to install on a machine and how to configure the host. A Local Configuration Manager (LCM) engine runs on each target node that processes requested actions based on pushed configurations. A pull server is a web service that runs on a central host to store the DSC configurations and associated resources. The pull server communicates with the LCM engine on each target host to provide the required configurations and report on compliance.

Learn how to:

- [Create a basic DSC configuration](/powershell/dsc/quickstarts/website-quickstart).
- [Configure a DSC pull server](/powershell/dsc/pull-server/pullserver).
- [Use DSC for Linux](/powershell/dsc/getting-started/lnxgettingstarted).


## Azure Custom Script Extension
The Azure Custom Script Extension for [Linux](./extensions/custom-script-linux.md) or [Windows](./extensions/custom-script-windows.md) downloads and executes scripts on Azure VMs. You can use the extension when you create a VM, or anytime after the VM is in use.

Scripts can be downloaded from Azure storage or any public location such as a GitHub repository. With the Custom Script Extension, you can write scripts in any language that runs on the source VM. These scripts can be used to install applications or configure the VM as desired. To secure credentials, sensitive information such as passwords can be stored in a protected configuration. These credentials are only decrypted inside the VM.

Learn how to:

- [Create a Linux VM with the Azure CLI and use the Custom Script Extension](/previous-versions/azure/virtual-machines/scripts/virtual-machines-linux-cli-sample-create-vm-nginx?toc=/cli/azure/toc.json).
- [Create a Windows VM with Azure PowerShell and use the Custom Script Extension](/previous-versions/azure/virtual-machines/scripts/virtual-machines-windows-powershell-sample-create-vm-iis).


## Packer
[Packer](https://www.packer.io) automates the build process when you create a custom VM image in Azure. You use Packer to define the OS and run post-configuration scripts that customize the VM for your specific needs. Once configured, the VM is then captured as a Managed Disk image. Packer automates the process to create the source VM, network and storage resources, run configuration scripts, and then create the VM image.

Learn how to:

- [Use Packer to create a Linux VM image in Azure](./linux/build-image-with-packer.md).
- [Use Packer to create a Windows VM image in Azure](./windows/build-image-with-packer.md).


## Terraform
[Terraform](https://www.terraform.io) is an automation tool that allows you to define and create an entire Azure infrastructure with a single template format language - the HashiCorp Configuration Language (HCL). With Terraform, you define templates that automate the process to create network, storage, and VM resources for a given application solution. You can use your existing Terraform templates for other platforms with Azure to ensure consistency and simplify the infrastructure deployment without needing to convert to an Azure Resource Manager template.

Learn how to:

- [Install and configure Terraform with Azure](/azure/developer/terraform/getting-started-cloud-shell).
- [Create an Azure infrastructure with Terraform](/azure/developer/terraform/create-linux-virtual-machine-with-infrastructure).


## Azure Automation
[Azure Automation](https://azure.microsoft.com/services/automation/) uses runbooks to process a set of tasks on the VMs you target. Azure Automation is used to manage existing VMs rather than to create an infrastructure. Azure Automation can run across both Linux and Windows VMs, and on-premises virtual or physical machines with a hybrid runbook worker. Runbooks can be stored in a source control repository, such as GitHub. These runbooks can then run manually or on a defined schedule.

Azure Automation also provides a Desired State Configuration (DSC) service that allows you to create definitions for how a given set of VMs should be configured. DSC then ensures that the required configuration is applied and the VM stays consistent. Azure Automation DSC runs on both Windows and Linux machines.

Learn how to:

- [Create a PowerShell runbook](../automation/learn/powershell-runbook-managed-identity.md).
- [Use Hybrid Runbook Worker to manage on-premises resources](../automation/automation-hybrid-runbook-worker.md).
- [Use Azure Automation DSC](../automation/automation-dsc-getting-started.md).


## Azure DevOps Services
[Azure DevOps Services](https://www.visualstudio.com/team-services/) is a suite of tools that help you share and track code, use automated builds, and create a complete continuous integration and development (CI/CD) pipeline. Azure DevOps Services integrates with Visual Studio and other editors to simplify usage. Azure DevOps Services can also create and configure Azure VMs and then deploy code to them.

Learn more about:

- [Azure DevOps Services](/azure/devops/user-guide/index).


## Jenkins
[Jenkins](https://jenkins.io) is a continuous integration server that helps deploy and test applications, and create automated pipelines for code delivery. There are hundreds of plugins to extend the core Jenkins platform, and you can also integrate with many other products and solutions through webhooks. You can manually install Jenkins on an Azure VM, run Jenkins from within a Docker container, or use a pre-built Azure Marketplace image.

Learn how to:

- [Create a development infrastructure on a Linux VM in Azure with Jenkins, GitHub, and Docker](/azure/developer/jenkins/pipeline-with-github-and-docker).


## Azure Resource Manager template
[Azure Resource Manager](../azure-resource-manager/templates/overview.md) is the deployment and management service for Azure. It provides a management layer that enables you to create, update, and delete resources in your Azure subscription. You use management features, like access control, locks, and tags, to secure and organize your resources after deployment.

Learn how to:

- [Deploy Spot VMs using a Resource Manager template](./linux/spot-template.md).
- [Create a Windows virtual machine from a Resource Manager template](./windows/ps-template.md).
- [Download the template for a VM](/previous-versions/azure/virtual-machines/windows/download-template).
- [Create an Azure Image Builder template](./linux/image-builder-json.md).

## Next steps
There are many different options to use infrastructure automation tools in Azure. You have the freedom to use the solution that best fits your needs and environment. To get started and try some of the tools built-in to Azure, see how to automate the customization of a [Linux](./linux/tutorial-automate-vm-deployment.md) or [Windows](./windows/tutorial-automate-vm-deployment.md) VM.
