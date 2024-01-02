---
title: Connect machines at scale using Ansible Playbooks
description: In this article, you learn how to connect machines to Azure using Azure Arc-enabled servers using Ansible playbooks.
ms.date: 05/09/2022
ms.topic: conceptual
ms.custom: template-how-to, devx-track-ansible
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

```yaml
---
- name: Onboard Linux and Windows Servers to Azure Arc-enabled servers with public endpoint connectivity
  hosts: all
  # vars:
  #   azure:
  #     service_principal_id: 'INSERT-SERVICE-PRINCIPAL-CLIENT-ID'
  #     service_principal_secret: 'INSERT-SERVICE-PRINCIPAL-SECRET'
  #     resource_group: 'INSERT-RESOURCE-GROUP'
  #     tenant_id: 'INSERT-TENANT-ID'
  #     subscription_id: 'INSERT-SUBSCRIPTION-ID'
  #     location: 'INSERT-LOCATION'
  tasks:
  - name: Check if the Connected Machine Agent has already been downloaded on Linux servers
    stat:
      path: /usr/bin/azcmagent
      get_attributes: False
      get_checksum: False
    register: azcmagent_lnx_downloaded
    when: ansible_system == 'Linux'

  - name: Download the Connected Machine Agent on Linux servers
    become: yes
    get_url:
      url: https://aka.ms/azcmagent
      dest: ~/install_linux_azcmagent.sh
      mode: '700'
    when: (ansible_system == 'Linux') and (azcmagent_lnx_downloaded.stat.exists == false)

  - name: Install the Connected Machine Agent on Linux servers
    become: yes
    shell: bash ~/install_linux_azcmagent.sh
    when: (ansible_system == 'Linux') and (not azcmagent_lnx_downloaded.stat.exists)

  - name: Check if the Connected Machine Agent has already been downloaded on Windows servers
    win_stat:
      path: C:\Program Files\AzureConnectedMachineAgent
    register: azcmagent_win_downloaded
    when: ansible_os_family == 'Windows'

  - name: Download the Connected Machine Agent on Windows servers
    win_get_url:
      url: https://aka.ms/AzureConnectedMachineAgent
      dest: C:\AzureConnectedMachineAgent.msi
    when: (ansible_os_family == 'Windows') and (not azcmagent_win_downloaded.stat.exists)

  - name: Install the Connected Machine Agent on Windows servers
    win_package:
      path: C:\AzureConnectedMachineAgent.msi
    when: (ansible_os_family == 'Windows') and (not azcmagent_win_downloaded.stat.exists)

  - name: Check if the Connected Machine Agent has already been connected
    become: true
    command:
     cmd: azcmagent check
    register: azcmagent_lnx_connected
    ignore_errors: yes
    when: ansible_system == 'Linux'
    failed_when: (azcmagent_lnx_connected.rc not in [ 0, 16 ])
    changed_when: False

  - name: Check if the Connected Machine Agent has already been connected on windows
    win_command: azcmagent check
    register: azcmagent_win_connected
    when: ansible_os_family == 'Windows'
    ignore_errors: yes
    failed_when: (azcmagent_win_connected.rc not in [ 0, 16 ])
    changed_when: False

  - name: Connect the Connected Machine Agent on Linux servers to Azure Arc
    become: yes
    shell: azcmagent connect --service-principal-id "{{ azure.service_principal_id }}" --service-principal-secret "{{ azure.service_principal_secret }}" --resource-group "{{ azure.resource_group }}" --tenant-id "{{ azure.tenant_id }}" --location "{{ azure.location }}" --subscription-id "{{ azure.subscription_id }}"
    when:  (ansible_system == 'Linux') and (azcmagent_lnx_connected.rc is defined and azcmagent_lnx_connected.rc != 0)

  - name: Connect the Connected Machine Agent on Windows servers to Azure
    win_shell: '& $env:ProgramFiles\AzureConnectedMachineAgent\azcmagent.exe connect --service-principal-id "{{ azure.service_principal_id }}" --service-principal-secret "{{ azure.service_principal_secret }}" --resource-group "{{ azure.resource_group }}" --tenant-id "{{ azure.tenant_id }}" --location "{{ azure.location }}" --subscription-id "{{ azure.subscription_id }}"'
    when: (ansible_os_family == 'Windows') and (azcmagent_win_connected.rc is defined and azcmagent_win_connected.rc != 0)
```

## Modify the Ansible playbook

After downloading the Ansible playbook, complete the following steps:

1. Within the Ansible playbook, modify the variables under the **vars section** with the service principal and Azure details collected earlier:

    * Service Principal ID
    * Service Principal Secret
    * Resource Group
    * Tenant ID
    * Subscription ID
    * Region

1. Enter the correct hosts field capturing the target servers for onboarding to Azure Arc. You can employ [Ansible patterns](https://docs.ansible.com/ansible/latest/user_guide/intro_patterns.html#common-patterns) to selectively target which hybrid machines to onboard.

1. This template passes the service principal secret as a variable in the Ansible playbook. Please note that an [Ansible vault](https://docs.ansible.com/ansible/latest/user_guide/vault.html) could be used to encrypt this secret and the variables could be passed through a configuration file.

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
- Learn how to manage your machine using [Azure Policy](../../governance/policy/overview.md) for such things as VM [guest configuration](../../governance/machine-configuration/overview.md), verifying that the machine is reporting to the expected Log Analytics workspace, enabling monitoring with [VM insights](../../azure-monitor/vm/vminsights-enable-policy.md), and much more.
