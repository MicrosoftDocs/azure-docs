---
title: Connect machines at scale using Ansible Playbooks
description: In this article, you learn how to connect machines to Azure using Azure Arc-enabled servers using Ansible playbooks. 
ms.date: 05/09/2022
ms.topic: conceptual
ms.custom: template-how-to
---

# Connect machines at scale using Ansible playbooks

You can onboard Ansible-managed nodes to Azure Arc-enabled servers at scale using Ansible playbooks. To do so, you'll need to download, modify, and then run the appropriate playbook.

Before you get started, be sure to review the [prerequisites](prerequisites.md) and verify that your subscription and resources meet the requirements. For information about supported regions and other related considerations, see [supported Azure regions](overview.md#supported-regions). Also review our [at-scale planning guide](plan-at-scale-deployment.md) to understand the design and deployment criteria, as well as our management and monitoring recommendations.  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Generate a service principal and collect Azure details

Before you can run the script to connect your machines, you'll need to do the following:

1. Follow the steps to [create a service principal for onboarding at scale](onboard-service-principal.md#create-a-service-principal-for-onboarding-at-scale).

    * Assign the Azure Connected Machine Onboarding role to your service principal and limit the scope of the role to the target Azure subscription or resource group.
    * Make a note of the Service Principal Secret and Service Principal Client ID; you'll need these values later.

1. Collect details on the Tenant ID, Subscription ID, Resource Group, and Region where the Azure Arc-enabled resource will be onboarded.

## Download the Ansible playbook

If you are onboarding machines to Azure Arc-enabled servers, copy the following Ansible playbook template and save the playbook as `arc-server-onboard-playbook.yml`.

```
---
- name: Onboard Linux and Windows Servers to Azure Arc-enabled servers with public endpoint connectivity
  hosts: <INSERT-HOSTS>
  tasks:
      - name: Download the Connected Machine Agent on Linux servers 
        become: yes
        get_url:
          url: https://aka.ms/azcmagent
          dest: ~/install_linux_azcmagent.sh
          mode: '700'
        when: ansible_system == 'Linux'
    	- name: Download the Connected Machine Agent on Windows servers
	  win_get_url:
        	url: https://aka.ms/AzureConnectedMachineAgent
        	dest: C:\AzureConnectedMachineAgent.msi
        when: ansible_os_family == 'Windows'
      - name: Install the Connected Machine Agent on Linux servers
        become: yes
        shell: bash ~/install_linux_azcmagent.sh
        when: ansible_system == 'Linux'
      - name: Install the Connected Machine Agent on Windows servers
        path: C:\AzureConnectedMachineAgent.msi
        when: ansible_os_family == 'Windows'
      - name: Connect the Connected Machine Agent on Linux servers to Azure Arc
        become: yes
        shell: sudo azcmagent connect --service-principal-id <INSERT-SERVICE-PRINCIPAL-CLIENT-ID> --service-principal-secret <INSERT-SERVICE-PRINCIPAL-SECRET> --resource-group <INSERT-RESOURCE-GROUP> --tenant-id <INSERT-TENANT-ID> --location <INSERT-REGION> --subscription-id <INSERT-SUBSCRIPTION-ID>
        when: ansible_system == 'Linux'
      - name: Connect the Connected Machine Agent on Windows servers to Azure
        win_shell: '& $env:ProgramFiles\AzureConnectedMachineAgent\azcmagent.exe connect --service-principal-id <INSERT-SERVICE-PRINCIPAL-CLIENT-ID> --service-principal-secret <INSERT-SERVICE-PRINCIPAL-SECRET> --resource-group <INSERT-RESOURCE-GROUP> --tenant-id <INSERT-TENANT-ID> --location <INSERT-REGION> --subscription-id <INSERT-SUBSCRIPTION-ID>'
        when: ansible_os_family == 'Windows'
```

<!--If you are onboarding Linux servers to Azure Arc-enabled servers, download the following Ansible playbook template and save the playbook as `arc-server-onboard-playbook.yml`.

```
---
- name: Onboard Linux Server to Azure Arc-enabled servers with public endpoint
  hosts: <INSERT-HOSTS>
  tasks:
      - name: Download the Connected Machine Agent 
        become: yes
        get_url:
          url: https://aka.ms/azcmagent
          dest: ~/install_linux_azcmagent.sh
          mode: '700'
        when: ansible_system == 'Linux'
      - name: Install the Connected Machine Agent
        become: yes
        shell: bash ~/install_linux_azcmagent.sh
        when: ansible_system == 'Linux'
      - name: Connect the Connected Machine Agent to Azure
        become: yes
        shell: sudo azcmagent connect --service-principal-id <INSERT-SERVICE-PRINCIPAL-CLIENT-ID> --service-principal-secret <INSERT-SERVICE-PRINCIPAL-SECRET> --resource-group <INSERT-RESOURCE-GROUP> --tenant-id <INSERT-TENANT-ID> --location <INSERT-REGION> --subscription-id <INSERT-SUBSCRIPTION-ID>
        when: ansible_system == 'Linux'
```-->

## Modify the Ansible playbook

After downloading the Ansible playbook, complete the following steps:

1. Within the Ansible playbook, modify the fields under the task **Connect the Connected Machine Agent to Azure** with the service principal and Azure details collected earlier:

    * Service Principal Id
    * Service Principal Secret
    * Resource Group
    * Tenant Id
    * Subscription Id
    * Region

1. Enter the correct hosts field capturing the target servers for onboarding to Azure Arc. You can employ Ansible patterns to selectively target which hybrid machines to onboard.

## Run the Ansible playbook

From the Ansible control node, run the Ansible playbook by invoking the `ansible-playbook` command:

```
ansible-playbook arc-server-onboard-playbook.yml
```

After the playbook has run, the **PLAY RECAP** will indicate if all tasks were completed successfully and surface any nodes where tasks failed.

## Verify the connection with Azure Arc

After you have successfully installed the agent and configured it to connect to Azure Arc-enabled servers, go to the Azure portal to verify that the servers in your target hosts have successfully connected. View your machines in the [Azure portal](https://aka.ms/hybridmachineportal). 

## Next steps

- Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.
- Review connection troubleshooting information in the [Troubleshoot Connected Machine agent guide](troubleshoot-agent-onboard.md).
- Learn how to manage your machine using [Azure Policy](../../governance/policy/overview.md) for such things as VM [guest configuration](../../governance/policy/concepts/guest-configuration.md), verifying that the machine is reporting to the expected Log Analytics workspace, enabling monitoring with [VM insights](../../azure-monitor/vm/vminsights-enable-policy.md), and much more.

