---
title: How to migrate to Azure Monitor Agent using Red Hat Ansible Automation Platform
description: Learn how to migrate to Azure Monitor Agent using Red Hat Ansible Automation Platform.
ms.date: 10/17/2022
ms.topic: conceptual
ms.custom: devx-track-ansible
---

# Migrate to Azure Monitor Agent on Azure Arc using Red Hat Ansible Automation Platform

This article covers how to use Red Hat Ansible Automation Platform to migrate non-Azure machines from the Azure Log Analytics agent to Azure Monitor agent. This includes onboarding the machines to Azure Arc-enabled servers. Once you have completed the configuration steps in this article, you'll be able to run a workflow against an automation controller inventory that performs the following tasks:

- Ensure that the Azure Connected Machine agent is installed on each machine. 
- Install and enable the Azure Monitor agent.
- Disable and uninstall the Log Analytics agent.

Content from the [Ansible Content Lab for Cloud Automation](https://cloud.lab.ansible.io/) has already been developed to automate this scenario.  This article will walk through how you can import that content as a project in an automation controller to build a workflow to perform the tasks above.

Ansible Automation Platform can automate the deployment of Azure services across your IT landscape to make onboarding to Azure Arc fast and reliable.

> [!NOTE]
> The Ansible content examples in this article target Linux hosts, but the playbooks can be altered to accommodate Windows hosts as well. 


## Prerequisites

### Azure Log Analytics workspace

This article assumes you are using the Azure Log Analytics agent and that the servers are pre-configured to report data to a Log Analytics workspace. You will need the name and resource group of the workspace from which you are migrating.

### Automation controller 2.x

This article is applicable to both self-managed Ansible Automation Platform and Red Hat Ansible Automation Platform on Microsoft Azure.

### Automation execution environment

To use the examples in this article, you'll need an automation execution environment with both the Azure Collection and the Azure CLI installed, since both are required to run the automation.

If you don't have an automation execution environment that meets these requirements, you can [use this example](https://github.com/scottharwell/cloud-ee).

See the [Red Hat Ansible documentation](https://docs.ansible.com/automation-controller/latest/html/userguide/execution_environments.html) for more information about building and configuring automation execution environments.

### Host inventory

You will need an inventory of Linux hosts configured in automation controller that contains a list of VMs that will use Azure Arc and the Azure Monitor Agent.

### Azure Resource Manager credential

A working account credential configured in Ansible Automation Platform for the Azure Resource Manager is required. This credential is used by Ansible Automation Platform to authenticate operations using the Azure Collection and the Azure CLI.

### Server machine credential

A “Machine Credential” configured in Automation Controller for SSH access to the servers in your host inventory is required.

## Configuring the content

The examples in this article rely on content developed and incubated by Red Hat through the [Ansible Content Lab for Cloud Content](https://cloud.lab.ansible.io/).

This article also uses the [Azure Infrastructure Configuration Demo](https://github.com/ansible-content-lab/azure.infrastructure_config_demos) collection. This collection contains a number of roles and playbooks that manage Azure use cases including those with Azure Arc-enabled servers. To use this collection in Automation Controller, follow the steps below to set up a project with the repository:

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

## Migrating Azure agents

In this example, we will assume that our Linux servers are already running the Azure Log Analytics agent, but do not yet have the Azure Connected Machine agent installed. If your organization relies on other Azure services that use the Log Analytics agent, you may need to plan for extra data collection rules prior to migrating to the Azure Monitor agent.

We will create a workflow that leverages the following playbooks to install the Azure Connected Machine agent, deploy the Azure Monitor Agent, disable the Log Analytics agent, and then uninstall the Log Analytics agent:

- install_arc_agent.yml
- replace_log_analytics_with_arc_linux.yml
- uninstall_log_analytics_agent.yml

This workflow performs the following tasks:

- Installs the Azure Connected Machine agent on all of the VMs identified in inventory.
- Enables the Azure Monitor agent extension via Azure Arc.
- Disables the Azure Log Analytics agent extension via Azure Arc.
- Uninstalls the Azure Log Analytics agent if flagged.

### Create template to install Azure Connected Machine agent

This template is responsible for installing the Azure Arc [Connected Machine agent](./agent-overview.md) on hosts within the provided inventory. A successful run will have installed the agent on all machines. 

Follow the steps below to create the template:

1. On the right menu, select **Templates**.
1. Select **Add**.
1. Select **Add job template**, then complete the fields of the form as follows:

    **Name:** Content Lab - Install Arc Connected Machine Agent

    **Job Type:** Run

    **Inventory:** (Your linux host inventory)

    **Project:** Content Lab - Azure Infrastructure Configuration Collection

    **Playbook:** `playbooks/replace_log_analytics_with_arc_linux.yml`

    **Credentials:**
    - Your Azure Resource Manager credential
    - Your Host Inventory Machine credential
    
    **Variables:**

   ```bash
   ---
   region: eastus
   resource_group_name: sh-rg
   subscription_id: "{{ lookup('env', 'AZURE_SUBSCRIPTION_ID') }}"
   service_principal_id: "{{ lookup('env', 'AZURE_CLIENT_ID') }}"
   service_principal_secret: "{{ lookup('env', 'AZURE_SECRET') }}"
   tenant_id: "{{ lookup('env', 'AZURE_TENANT') }}"
   ```
    
   > [!NOTE]
   > The operations in this playbook happen through the Azure CLI.   Most of these variables are set to pass along the proper variable from the Azure Resource Manager credential to the CL.

    **Options:**
        Privilege Escalation: true
1. Select **Save**.

### Create template to replace log analytics

This template is responsible for migrating from the Log Analytics agent to the Azure Monitor agent by enabling the Azure Monitor Agent extension and disabling the Azure Log Analytics extension (if used via the Azure Connected Machine agent).

Follow the steps below to create the template:

1. On the right menu, select **Templates**.
1. Select **Add**.
1. Select **Add job template**, then complete the fields of the form as follows:

    **Name:** Content Lab - Replace Log Analytics agent with Arc Connected Machine agent

    **Job Type:** Run

    **Inventory:** (Your linux host inventory)

    **Project:** Content Lab - Azure Infrastructure Configuration Collection

    **Playbook:** `playbooks/replace_log_analytics_with_arc_linux.yml`

    **Credentials:**
    - Your Azure Resource Manager credential
    - Your Host Inventory Machine credential
    
    **Variables:**
    
    ```bash
   —
   Region: <Azure Region>
   resource_group_name: <Resource Group Name>
   linux_hosts: "{{ hostvars.values() | selectattr('group_names','contains', 'linux') | map(attribute='inventory_hostname') | list }}"
   ```

   > [!NOTE]
   > The `linux_hosts` variable is used to create a list of hostnames to send to the Azure Collection and is not directly related to a host inventory. You may set this list in any way that Ansible supports. In this case, the variable attempts to pull host names from groups with “linux” in the group name.
1. Select **Save**.

### Create template to uninstall Log Analytics

This template will attempt to run the Log Analytics agent uninstall script if the Log Analytics agent was installed outside of the Azure Connected Machine agent.

Follow the steps below to create the template:

1. On the right menu, select **Templates**.
1. Select **Add**.
1. Select **Add job template**, then complete the fields of the form as follows:

    **Name:** Content Lab - Uninstall Log Analytics agent

    **Job Type:** Run

    **Inventory:** (Your linux host inventory)

    **Project:** Content Lab - Azure Infrastructure Configuration Collection

    **Playbook:** `playbooks/uninstall_log_analytics_with_arc_linux.yml`

    **Credentials:**
    - Your Host Inventory Machine credential
    
    **Options:**
    
    - Privilege Escalation: true
1. Select **Save**.

### Create the workflow

An automation controller workflow allows you to construct complex automation by connecting automation templates and other actions together. This workflow example is a simple linear flow that enables the end-to-end scenario in this example, but other nodes could be added for context such as error handling, human approvals, etc.

1. On the right menu, select **Templates**.
1. Select **Add**.
1. Select **Add workflow template**, then complete the following fields as follows:

    **Name:** Content Lab - Migrate Log Agent to Azure Monitor

    **Job Type:** Run

    **Inventory:** (Your linux host inventory)

    **Project:** Content Lab - Azure Infrastructure Configuration Collection

1. Select **Save**.
1. Select **Start** to begin the workflow designer.
1. Set **Node Type** to "Job Template" and select **Content Lab - Replace Log Analytics with Arc Connected Machine Agent**.
1. Select **Next**.
1. Select **Save**.
1. Hover over the **Content Lab - Replace Log Analytics with Arc Connected Machine Agent** node and select the **+** button.
1. Select **On Success**.
1. Select **Next**.
1. Set **Node Type** to "Job Template" and select **Content Lab - Uninstall Log Analytics Agent**.
1. Select **Save**.
1. Select **Save** at the top right corner of the workflow designer.

You will now have a workflow that looks like the following:
:::image type="content" source="media/migrate-ama/workflow.png" alt-text="Diagram showing workflow of Azure Monitor agent migration process.":::

### Add a survey to the workflow

We want to add survey questions to the workflow so that we can collect input when the workflow is run.

1. Select **Survey** from the workflow details screen.
    :::image type="content" source="media/migrate-ama/survey.png" alt-text="Screenshot of template details window with survey tab highlighted on right side.":::
1. Select **Add**, then complete the form using the following values:

    **Question:** Which Azure region will your Arc servers reside?

    **Answer variable name:** region

    **Required:** true

    **Answer type:** Text

1. Select **Save**.
1. Select **Add**, then complete the form using the following values:

    **Question:** What is the name of the resource group?

    **Answer variable name:** resource_group_name

    **Required:** true

    **Answer type:** Text

1. Select **Save**.
1. Select **Add**, then complete the form using the following values:

    **Question:** What is the name of your Log Analytics workspace?

    **Answer variable name:** analytics_workspace_name

    **Required:** true

    **Answer type:** Text

1. Select **Save**.
1. From the Survey list screen, ensure that the survey is enabled.
    :::image type="content" source="media/migrate-ama/survey-enabled.png" alt-text="Screenshot of Survey window with Survey Enabled switched enabled.":::

Your workflow has now been created.

### Running the workflow

Now that you have the workflow created, you can run the workflow at any time. When you click the “launch” 🚀 icon, the survey that you configured will be presented so that you can update the variables across automation runs. This will allow you to move Log Analytics connected servers that are assigned to different regions or resource groups as needed.

:::image type="content" source="media/migrate-ama/launch.png" alt-text="Screenshot of Launch window for workflow.":::

## Conclusion

After following the steps in this article, you have created an automation workflow that migrates your Linux machines from the Azure Log Analytics agent to the Azure Monitor agent. This workflow will onboard the Linux machine to Azure Arc-enabled servers. This example uses the Ansible Content Lab for Cloud Automation to make implementation fast and easy.

## Next steps

Learn more about [connecting machines using Ansible playbooks](onboard-ansible-playbooks.md).
