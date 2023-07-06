---
title: Enable VM extension using Red Hat Ansible
description: This article describes how to deploy virtual machine extensions to Azure Arc-enabled servers running in hybrid cloud environments using Red Hat Ansible Automation.
ms.date: 05/15/2023
ms.topic: conceptual
ms.custom: devx-track-ansible
---

# Enable Azure VM extensions using Red Hat Ansible automation

This article shows you how to deploy VM extensions to Azure Arc-enabled servers at scale using the Red Hat Ansible Automation Platform. The examples in this article rely on content developed and incubated by Red Hat through the [Ansible Content Lab for Cloud Content](https://cloud.lab.ansible.io/). This article also uses the [Azure Infrastructure Configuration Demo](https://github.com/ansible-content-lab/azure.infrastructure_config_demos) collection. This collection contains many roles and playbooks that are pertinent to this article, including the following:

|File or Folder  |Description  |
|---------|---------|
|playbook_enable_arc_extension.yml  |Playbook that's used as a job template to enable Azure Arc extensions.  |
|playbook_disable_arc-extension.yml  |Playbook that's used as a job template to disable Azure Arc extensions.  |
|roles/arc  |Ansible role that contains the reusable automation leveraged by the playbooks.  |

> [!NOTE]
> The examples in this article target Linux hosts.
> 

## Prerequisites

### Automation controller 2.x

This article is applicable to both self-managed Ansible Automation Platform and Red Hat Ansible Automation Platform on Microsoft Azure.

### Automation execution environment

To use the examples in this article, you'll need an automation execution environment with both the Azure Collection and the Azure CLI installed, since both are required to run the automation.

If you don't have an automation execution environment that meets these requirements, you can [use this example](https://github.com/scottharwell/cloud-ee).

See the [Red Hat Ansible documentation](https://docs.ansible.com/automation-controller/latest/html/userguide/execution_environments.html) for more information about building and configuring automation execution environments.

### Azure Resource Manager credential

A working account credential configured in Ansible Automation Platform for the Azure Resource Manager is required. This credential is used by Ansible Automation Platform to authenticate operations using the Azure Collection and the Azure CLI.

## Configuring the content

To use the [Azure Infrastructure Configuration Demo collection](https://github.com/ansible-content-lab/azure.infrastructure_config_demos) in Automation Controller, follow the steps below to set up a project with the repository:

1. Log in to automation controller.
1. In the left menu, select **Projects**.
1. Select **Add**, and then complete the fields of the form as follows:

    **Name:** Content Lab - Azure Infrastructure Configuration Collection

    **Automation Environment:** (select with the Azure Collection and CLI instead)

    **Source Control Type:** Git

    **Source Control URL:** https://github.com/ansible-content-lab/azure.infrastructure_config_demos.git

1. Select **Save**.
    :::image type="content" source="media/migrate-ama/configure-content.png" alt-text="Screenshot of Projects window to edit details." lightbox="media/migrate-ama/configure-content.png":::

Once saved, the project should be synchronized with the automation controller.

## Create job templates

The project you created from the Azure Infrastructure Configuration Demo collection contains example playbooks that implement the reusable content implemented in roles. You can learn more about the individual roles in the collection by viewing the [README file](https://github.com/ansible-content-lab/azure.infrastructure_config_demos/blob/main/README.md) included with the collection. Within the collection, the following mapping has been performed to make it easy to identify which extension you want to enable.

|Extension  |Extension Variable Name  |
|---------|---------|
|Microsoft Defender for Cloud integrated vulnerability scanner  |microsoft_defender  |
|Custom Script extension  |custom_script  |
|Log Analytics Agent  |log_analytics_agent  |
|Azure Monitor for VMs (insights)  |azure_monitor_for-vms  |
|Azure Key Vault Certificate Sync  |azure_key_vault  |
|Azure Monitor Agent  |azure_monitor_agent  |
|Azure Automation Hybrid Runbook Worker extension  |azure_hybrid_rubook  |

You'll need to create templates in order to enable and disable Arc-enabled server VM extensions (explained below).

> [!NOTE]
> There are additional VM extensions not included in this collection, outlined in [Virtual machine extension management with Azure Arc-enabled servers](manage-vm-extensions.md#extensions).
> 

### Enable Azure Arc VM extensions

This template is responsible for enabling an Azure Arc-enabled server VM extension on the hosts you identify.

> [!IMPORTANT]
> Arc only supports enabling or disabling a single extension at a time, so this process can take some time. If you attempt to enable or disable another VM extension with this template prior to Azure completing this process, the template reports an error.
> 
> Once the job template has run, it may take minutes to hours for each machine to report that the extension is operational.  Once the extension is operational, then this job template can be run again with another extension and will not report an error.

Follow the steps below to create the template:

1. On the right menu, select **Templates**.
1. Select **Add**.
1. Select **Add job template**, then complete the fields of the form as follows:

    **Name:** Content Lab - Enable Arc Extension

    **Job Type:** Run

    **Inventory:** localhost

    **Project:** Content Lab - Azure Infrastructure Configuration Collection

    **Playbook:** `playbook_enable_arc-extension.yml`

    **Credentials:**
    - Your Azure Resource Manager credential
    
    **Variables:**

   ```bash
   ---
    resource_group: <your_resource_group>
    region: <your_region>
    arc_hosts:
    <first_arc_host>
    <second_arc_host>
    extension: microsoft_defender
   ```
    
   > [!NOTE]
   >  Change the `resource group` and `arc_hosts` to match the names of your Azure resources. If you have a large number of  Arc hosts, use Jinja2 formatting to extract the list from your inventory sources.

1. Check the **Prompt on launch** box for Variables so you can change the extension at run time.
1. Select **Save**.

### Disable Azure Arc VM extensions

This template is responsible for disabling an Azure Arc-enabled server VM extension on the hosts you identify. Follow the steps below to create the template:

1. On the right menu, select **Templates**.
1. Select **Add**.
1. Select **Add job template**, then complete the fields of the form as follows:

    **Name:** Content Lab - Disable Arc Extension

    **Job Type:** Run

    **Inventory:** localhost

    **Project:** Content Lab - Azure Infrastructure Configuration Collection

    **Playbook:** `playbook_disable_arc-extension.yml`

    **Credentials:**
    - Your Azure Resource Manager credential
    
    **Variables:**
    
   ```bash
   ---
    resource_group: <your_resource_group>
    region: <your_region>
    arc_hosts:
    <first_arc_host>
    <second_arc_host>
    extension: microsoft_defender
   ```
    
   > [!NOTE]
   >  Change the `resource group` and `arc_hosts` to match the names of your Azure resources. If you have a large number of  Arc hosts, use Jinja2 formatting to extract the list from your inventory sources.

1. Check the **Prompt on launch** box for Variables so you can change the extension at run time.
1. Select **Save**.

### Run the automation

Now that you have the job templates created, you can enable or disable Arc extensions by simply changing the name of the `extension` variable. Azure Arc extensions are mapped in the "arc" role in [this file](https://github.com/ansible-content-lab/azure.infrastructure_config_demos/blob/main/roles/arc/defaults/main.yml).

When you click the “launch” 🚀 icon, the template will ask you to confirm that the variables are accurate. For example, to enable the Microsoft Defender extension, ensure that the extension variable is set to `microsoft_defender`. Then, click **Next** and then **Launch** to run the template:

:::image type="content" source="media/manage-vm-extensions-ansible/launch-extension.png" alt-text="Screenshot of the window to launch the Arc extension.":::


If no errors are reported, the extension will be enabled and active on the applicable servers after a short period of time. You can then proceed to enable (or disable) other extensions by changing the extension variable in the template.

## Next steps

* You can deploy, manage, and remove VM extensions using the [Azure PowerShell](manage-vm-extensions-powershell.md), from the [Azure portal](manage-vm-extensions-portal.md), or the [Azure CLI](manage-vm-extensions-cli.md).

* Troubleshooting information can be found in the [Troubleshoot VM extensions guide](troubleshoot-vm-extensions.md).
