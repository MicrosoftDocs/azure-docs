---
title: Create and configure an Azure DevTest Labs instance by using Ansible
description: Learn how to use Ansible to create and configure an Azure DevTest Labs instance
ms.service: azure
keywords: ansible, azure, devops, bash, playbook, devtest lab
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
---

# Create and configure an Azure DevTest Labs instance by using Ansible

[Azure DevTest Labs](https://docs.microsoft.com/en-us/azure/lab-services/devtest-lab-overview) is a service that allows developers to efficiently self-service virtual machines and/or PaaS resources that they need for developing, testing, and training etc. without waiting for constant approvals on the tools that they need.

This tutorial shows you how to use Ansible to create and manage Azure DevTest Labs for your team.

## Prerequisites

- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- **Azure service principal** - When [creating the service principal](/cli/azure/create-an-azure-service-principal-azure-cli?view=azure-cli-latest), note the following values: **appId**, **displayName**, **password**, and **tenant**.
- [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation1.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation1.md)] [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation2.md)]

> [!Note]
> Ansible 2.8 is required to run the following the sample playbooks in this tutorial. 

## Create resource group

The first task in the [sample playbook](https://github.com/Azure-Samples/ansible-playbooks/blob/master/devtestlab-create.yml) creates a resource group; a logical container in which Azure resources are deployed and managed.

```yaml
  - name: Create a resource group
    azure_rm_resourcegroup:
      name: "{{ resource_group }}"
      location: "{{ location }}"
```

## Create an instance of DevTest Labs

The next task creates an instance of DevTest Labs.

```yaml
- name: Create instance of Lab
  azure_rm_devtestlab:
    resource_group: "{{ resource_group }}"
    name: "{{ lab_name }}"
    location: "{{ location }}"
    storage_type: standard
    premium_data_disks: no
  register: output_lab
```

## Set up DevTest Labs policies

You can set up DevTest Labs policy settings. The following values can be set:

- **user_owned_lab_vm_count** is the number of VMs a user can own
- **user_owned_lab_premium_vm_count** is the number of premium VMs a user can own
- **lab_vm_count** is the maximum number of lab VMs
- **lab_premium_vm_count** is the maximum number of lab premium VMs
- **lab_vm_size** is the allowed lab VMs size(s)
- **gallery_image** is the allowed gallery image(s)
- **user_owned_lab_vm_count_in_subnet** is the maximum number of user’s VMs in a subnet
- **lab_target_cost** is the target cost of the lab

```yaml
- name: Create instance of DevTest Lab Policy
  azure_rm_devtestlabpolicy:
    resource_group: "{{ resource_group }}"
    lab_name: "{{ lab_name }}"
    policy_set_name: myDtlPolicySet
    name: myDtlPolicy
    fact_name: user_owned_lab_vm_count
    threshold: 5
```

## Set up DevTest Labs Schedules

You can configure DevTest Labs policy settings. The following values can be set:

- **lab_vms_startup** is the lab VMs' startup time
- **lab_vms_shutdown** is the lab VMs' shutdown time

You must specify time and time zone id.

```yaml
- name: Create instance of DevTest Lab Schedule
  azure_rm_devtestlabschedule:
    resource_group: "{{ resource_group }}"
    lab_name: "{{ lab_name }}"
    name: lab_vms_shutdown
    time: "1030"
    time_zone_id: "UTC+12"
  register: output
```

## Set up virtual network

This task creates the default DevTest Labs virtual network.

```yaml
- name: Create instance of DevTest Labs virtual network
  azure_rm_devtestlabvirtualnetwork:
    resource_group: "{{ resource_group }}"
    lab_name: "{{ lab_name }}"
    name: "{{ vn_name }}"
    location: "{{ location }}"
    description: My DevTest Lab Virtual Network
  register: output
```

## Create DevTest Labs artifact source

DevTest Lab artifacts source is a properly structured GitHub repository that contains artifact definition and ARM templates. Note that every lab comes with predefined public artifacts. The follow tasks shows you how to create the DevTest Labs artifact source.

```yaml
- name: Create instance of DevTest Labs artifacts source
  azure_rm_devtestlabartifactsource:
    resource_group: "{{ resource_group }}"
    lab_name: "{{ lab_name }}"
    name: "{{ artifacts_name }}"
    uri: https://github.com/Azure/azure_preview_modules.git
    source_type: github
    folder_path: /tasks
    security_token: "{{ github_token }}"
```

## Create DevTest Labs virtual machine

Next, create the DevTest Labs virtual machine.

```yaml
- name: Create instance of DTL Virtual Machine
  azure_rm_devtestlabvirtualmachine:
    resource_group: "{{ resource_group }}"
    lab_name: "{{ lab_name }}"
    name: "{{ vm_name }}"
    notes: Virtual machine notes, just something....
    os_type: linux
    vm_size: Standard_A2_v2
    user_name: dtladmin
    password: ZSasfovobocu$$21!
    lab_subnet:
      virtual_network_name: "{{ vn_name }}"
      name: "{{ vn_name }}Subnet"
    disallow_public_ip_address: no
    image:
      offer: UbuntuServer
      publisher: Canonical
      sku: 16.04-LTS
      os_type: Linux
      version: latest
    artifacts:
      - source_name: "{{ artifacts_name }}"
        source_path: "/Artifacts/linux-install-mongodb"
    allow_claim: no
    expiration_date: "2029-02-22T01:49:12.117974Z"
```

## List all artifact sources and artifacts

To list all default and custom artifacts sources in the lab, use the following task:

```yaml
- name: List all artifact sources
  azure_rm_devtestlabartifactsource_facts:
    resource_group: "{{ resource_group }}"
    lab_name: "{{ lab_name }}"
  register: output
- debug:
    var: output
```

The following task lists all the artifacts:

```yaml
- name: Get artifacts source facts
  azure_rm_devtestlabartifact_facts:
    resource_group: "{{ resource_group }}"
    lab_name: "{{ lab_name }}"
    artifact_source_name: public repo
  register: output
- debug:
    var: output
```

## Get information on ARM Templates in artifact source

To list all the ARM templates in **public environment repository**, the predefined repository with templates:

```yaml
- name: List all artifact sources
  azure_rm_devtestlabartifactsource_facts:
    resource_group: "{{ resource_group }}"
    lab_name: "{{ lab_name }}"
  register: output
- debug:
    var: output
```

And the following task retrieves details of a specific ARM template from the repository:

```yaml
- name: Get ARM Template facts
  azure_rm_devtestlabarmtemplate_facts:
    resource_group: "{{ resource_group }}"
    lab_name: "{{ lab_name }}"
    artifact_source_name: "public environment repo"
    name: ServiceFabric-LabCluster
  register: output
- debug:
    var: output
```

## Create DevTest Labs environment

Finally, the following task creates the DevTest Lab environment based on one of the templates from public environment repository.

```yaml
- name: Create instance of DevTest Lab Environment
      azure_rm_devtestlabenvironment:
        resource_group: "{{ resource_group }}"
        lab_name: "{{ lab_name }}"
        user_name: "@me"
        name: myEnvironment
        location: eastus
        deployment_template: "{{ output_lab.id }}/artifactSources/public environment repo/armTemplates/WebApp"
      register: output
```

## Create DevTest Labs image

Another useful task is to create a DevTest Labs image based on an existing DevTest Labs virtual machine. That way, it can be used for creating new DevTest Labs virtual machines.

```yaml
- name: Create instance of DevTest Lab Image
  azure_rm_devtestlabcustomimage:
    resource_group: "{{ resource_group }}"
    lab_name: "{{ lab_name }}"
    name: myImage
    source_vm: "{{ output_vm.virtualmachines[0]['name'] }}"
    linux_os_state: non_deprovisioned
```

## Delete the DevTest Labs instance

To delete the instance, use the following task:

```yaml
- name: Delete instance of Lab
  azure_rm_devtestlab:
    resource_group: "{{ resource_group }}"
    name: "{{ lab_name }}"
    state: absent
  register: output
- name: Assert the change was correctly reported
  assert:
    that:
      - output.changed
```

## Complete sample Ansible playbook

Here is the complete playbook you have built. [Download the sample playbook](https://github.com/Azure-Samples/ansible-playbooks/blob/master/devtestlab-create.yml) or save below as *cosmosdb.yml*. Make sure you replace the placeholder **{{ resoruce_group_name }}** in the `vars` section with your own resource group name.

> [!Tip]
> ```github_token``` - make sure you store the GitHub token as an environment variable GITHUB_ACCESS_TOKEN

```yml
---
- hosts: localhost
  #roles:
  #  - azure.azure_preview_modules
  vars:
    resource_group: "{{ resource_group_name }}"
    lab_name: myLab
    vn_name: myLabVirtualNetwork
    vm_name: myLabVm
    artifacts_name: myArtifacts
    github_token: "{{ lookup('env','GITHUB_ACCESS_TOKEN') }}"
    location: eastus
  tasks:
    - name: Create a resource group
      azure_rm_resourcegroup:
        name: "{{ resource_group }}"
        location: "{{ location }}"

    - name: Create instance of Lab
      azure_rm_devtestlab:
        resource_group: "{{ resource_group }}"
        name: "{{ lab_name }}"
        location: eastus
        storage_type: standard
        premium_data_disks: no
      register: output_lab

    - name: Create instance of DevTest Lab Policy
      azure_rm_devtestlabpolicy:
        resource_group: "{{ resource_group }}"
        lab_name: "{{ lab_name }}"
        policy_set_name: myDtlPolicySet
        name: myDtlPolicy
        fact_name: user_owned_lab_vm_count
        threshold: 5

    - name: Create instance of DevTest Lab Schedule
      azure_rm_devtestlabschedule:
        resource_group: "{{ resource_group }}"
        lab_name: "{{ lab_name }}"
        name: lab_vms_shutdown
        time: "1030"
        time_zone_id: "UTC+12"
      register: output

    - name: Create instance of DevTest Labs virtual network
      azure_rm_devtestlabvirtualnetwork:
        resource_group: "{{ resource_group }}"
        lab_name: "{{ lab_name }}"
        name: "{{ vn_name }}"
        location: eastus
        description: My DevTest Lab
      register: output

    - name: Create instance of DevTest Labs artifacts source
      azure_rm_devtestlabartifactsource:
        resource_group: "{{ resource_group }}"
        lab_name: "{{ lab_name }}"
        name: "{{ artifacts_name }}"
        uri: https://github.com/Azure/azure_preview_modules.git
        source_type: github
        folder_path: /tasks
        security_token: "{{ github_token }}"

    - name:
      set_fact:
        artifact_source:
          - source_name: "{{ artifacts_name }}"
            source_path: "/Artifacts/linux-install-mongodb"
      when: "github_token | length > 0"

    - name:
      set_fact:
        artifact_source: null
      when: "github_token | length == 0"

    - name: Create instance of DTL Virtual Machine
      azure_rm_devtestlabvirtualmachine:
        resource_group: "{{ resource_group }}"
        lab_name: "{{ lab_name }}"
        name: "{{ vm_name }}"
        notes: Virtual machine notes, just something....
        os_type: linux
        vm_size: Standard_A2_v2
        user_name: dtladmin
        password: ZSasfovobocu$$21!
        lab_subnet:
          virtual_network_name: "{{ vn_name }}"
          name: "{{ vn_name }}Subnet"
        disallow_public_ip_address: no
        image:
          offer: UbuntuServer
          publisher: Canonical
          sku: 16.04-LTS
          os_type: Linux
          version: latest
        artifacts:
          - source_name: "{{ artifacts_name }}"
            source_path: "/Artifacts/linux-install-mongodb"
        allow_claim: no
        expiration_date: "2029-02-22T01:49:12.117974Z"

    - name: List all artifact sources
      azure_rm_devtestlabartifactsource_facts:
        resource_group: "{{ resource_group }}"
        lab_name: "{{ lab_name }}"
      register: output
    - debug:
        var: output

    - name: List ARM Template facts
      azure_rm_devtestlabarmtemplate_facts:
        resource_group: "{{ resource_group }}"
        lab_name: "{{ lab_name }}"
        artifact_source_name: "public environment repo"
      register: output
    - debug:
        var: output

    - name: Get ARM Template facts
      azure_rm_devtestlabarmtemplate_facts:
        resource_group: "{{ resource_group }}"
        lab_name: "{{ lab_name }}"
        artifact_source_name: "public environment repo"
        name: ServiceFabric-LabCluster
      register: output
    - debug:
        var: output

    - name: Create instance of DevTest Lab Environment
      azure_rm_devtestlabenvironment:
        resource_group: "{{ resource_group }}"
        lab_name: "{{ lab_name }}"
        user_name: "@me"
        name: myEnvironment
        location: eastus
        deployment_template: "{{ output_lab.id }}/artifactSources/public environment repo/armTemplates/WebApp"

    - name: Create instance of DevTest Lab Image
      azure_rm_devtestlabcustomimage:
        resource_group: "{{ resource_group }}"
        lab_name: "{{ lab_name }}"
        name: myImage
        source_vm: "{{ vm_name }}"
        linux_os_state: non_deprovisioned

    - name: Delete instance of Lab
      azure_rm_devtestlab:
        resource_group: "{{ resource_group }}"
        name: "{{ lab_name }}"
        state: absent
```

To run the playbook, use the **ansible-playbook** command as follows:

```bash
ansible-playbook cosmosdb.yml
```

## Clean up resources

If you don't need these resources, you can delete them by running the following example. It deletes a resource group named **myResourceGroup**. 

```yml
- hosts: localhost
  vars:
    resource_group: myResourceGroup
  tasks:
    - name: Delete a resource group
      azure_rm_resourcegroup:
        name: "{{ resource_group }}"
        force_delete_nonempty: yes
        state: absent
```

Save the preceding playbook as *rg_delete.yml*. To run the playbook, use the **ansible-playbook** command as follows:

```bash
ansible-playbook rg_delete.yml
```

## Next steps
> [!div class="nextstepaction"] 
> [Ansible on Azure](https://docs.microsoft.com/azure/ansible/)