---
title: Tutorial - Deploy apps to virtual machine scale sets in Azure using Ansible
description: Learn how to use Ansible to configure Azure virtual machine scale sets and deploy application on the scale set
keywords: ansible, azure, devops, bash, playbook, virtual machine, virtual machine scale set, vmss
ms.topic: tutorial
ms.date: 01/13/2020
---

# Tutorial: Deploy apps to virtual machine scale sets in Azure using Ansible

[!INCLUDE [ansible-27-note.md](../../includes/ansible-27-note.md)]

[!INCLUDE [open-source-devops-intro-vmss.md](../../includes/open-source-devops-intro-vmss.md)]

[!INCLUDE [ansible-tutorial-goals.md](../../includes/ansible-tutorial-goals.md)]

> [!div class="checklist"]
>
> * Retrieve host information for a group of Azure VMs
> * Clone and build the sample app
> * Install the JRE (Java Runtime Environment) on a scale set
> * Deploy the Java application to a scale set

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../../includes/open-source-devops-prereqs-azure-subscription.md)]
[!INCLUDE [ansible-prereqs-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-cloudshell-use-or-vm-creation2.md)] 
[!INCLUDE [ansible-prereqs-vm-scale-set.md](../../includes/ansible-prereqs-vm-scale-set.md)]
- **git** - [git](https://git-scm.com) is used to download a Java sample used in this tutorial.
- **Java SE Development Kit (JDK)** - The [JDK](https://aka.ms/azure-jdks) is used to build the sample Java project.
- **Apache Maven** - [Apache Maven](https://maven.apache.org/download.cgi) is used to build the sample Java project.

## Get host information

The playbook code in this section retrieves host information for a group of virtual machines. The code gets the public IP addresses and load balancer within a specified resource group and creates a host group named `scalesethosts` in inventory.

Save the following sample playbook as `get-hosts-tasks.yml`:

  ```yml
  - name: Get facts for all Public IPs within a resource groups
    azure_rm_publicipaddress_facts:
      resource_group: "{{ resource_group }}"
    register: output_ip_address

  - name: Get loadbalancer info
    azure_rm_loadbalancer_facts:
      resource_group: "{{ resource_group }}"
      name: "{{ loadbalancer_name }}"
    register: output

  - name: Add all hosts
    add_host:
      groups: scalesethosts
      hostname: "{{ output_ip_address.publicipaddresses[0].ip_address }}_{{ item.properties.frontendPort }}"
      ansible_host: "{{ output_ip_address.publicipaddresses[0].ip_address }}"
      ansible_port: "{{ item.properties.frontendPort }}"
      ansible_ssh_user: "{{ admin_username }}"
      ansible_ssh_pass: "{{ admin_password }}"
    with_items:
      - "{{ output.ansible_info.azure_loadbalancers[0].properties.inboundNatRules }}"
  ```

## Prepare an application for deployment

The playbook code in this section uses `git` to clone a Java sample project from GitHub and builds the project. 

Save the following playbook as `app.yml`:

  ```yml
  - hosts: localhost
    vars:
      repo_url: https://github.com/spring-guides/gs-spring-boot.git
      workspace: ~/src/helloworld

    tasks:
    - name: Git Clone sample app
      git:
        repo: "{{ repo_url }}"
        dest: "{{ workspace }}"

    - name: Build sample app
      shell: mvn package chdir="{{ workspace }}/complete"
  ```

Run the sample Ansible playbook with the following command:

  ```bash
  ansible-playbook app.yml
  ```

After running the playbook, you see output similar to the following results:

  ```Output
  PLAY [localhost] 

  TASK [Gathering Facts] 
  ok: [localhost]

  TASK [Git Clone sample app] 
  changed: [localhost]

  TASK [Build sample app] 
  changed: [localhost]

  PLAY RECAP 
  localhost                  : ok=3    changed=2    unreachable=0    failed=0

  ```

## Deploy the application to a scale set

The playbook code in this section is used to:

* Install the JRE on a host group named `saclesethosts`
* Deploy the Java application to a host group named `saclesethosts`

There are two ways to get the sample playbook:

* [Download the playbook](https://github.com/Azure-Samples/ansible-playbooks/blob/master/vmss/vmss-setup-deploy.yml) and save it to `vmss-setup-deploy.yml`.
* Create a new file named `vmss-setup-deploy.yml` and copy into it the following contents:

```yml
- hosts: localhost
  vars:
    resource_group: myResourceGroup
    scaleset_name: myScaleSet
    loadbalancer_name: myScaleSetLb
    admin_username: azureuser
    admin_password: "{{ admin_password }}"
  tasks:
  - include: get-hosts-tasks.yml

- name: Install JRE on a scale set
  hosts: scalesethosts
  become: yes
  vars:
    workspace: ~/src/helloworld
    admin_username: azureuser

  tasks:
  - name: Install JRE
    apt:
      name: default-jre
      update_cache: yes

  - name: Copy app to Azure VM
    copy:
      src: "{{ workspace }}/complete/target/gs-spring-boot-0.1.0.jar"
      dest: "/home/{{ admin_username }}/helloworld.jar"
      force: yes
      mode: 0755

  - name: Start the application
    shell: java -jar "/home/{{ admin_username }}/helloworld.jar" >/dev/null 2>&1 &
    async: 5000
    poll: 0
```

Before running the playbook, see the following notes:

* In the `vars` section, replace the `{{ admin_password }}` placeholder with your own password.
* To use the ssh connection type with passwords, install the sshpass program:

    Ubuntu:

    ```bash
    apt-get install sshpass
    ```

    CentOS:

    ```bash
    yum install sshpass
    ```

* In some environments, you may see an error about using an SSH password instead of a key. If you do receive that error, you can disable host key checking by adding the following line to `/etc/ansible/ansible.cfg` or `~/.ansible.cfg`:

    ```bash
    [defaults]
    host_key_checking = False
    ```

Run the playbook with the following command:

  ```bash
  ansible-playbook vmss-setup-deploy.yml
  ```

The output from running the ansible-playbook command indicates that the sample Java application has been installed to the host group of the scale set:

  ```Output
  PLAY [localhost]

  TASK [Gathering Facts]
  ok: [localhost]

  TASK [Get facts for all Public IPs within a resource groups]
  ok: [localhost]

  TASK [Get loadbalancer info]
  ok: [localhost]

  TASK [Add all hosts]
  changed: [localhost] ...

  PLAY [Install JRE on scale set]

  TASK [Gathering Facts]
  ok: [40.114.30.145_50000]
  ok: [40.114.30.145_50003]

  TASK [Copy app to Azure VM]
  changed: [40.114.30.145_50003]
  changed: [40.114.30.145_50000]

  TASK [Start the application]
  changed: [40.114.30.145_50000]
  changed: [40.114.30.145_50003]

  PLAY RECAP
  40.114.30.145_50000        : ok=4    changed=3    unreachable=0    failed=0
  40.114.30.145_50003        : ok=4    changed=3    unreachable=0    failed=0
  localhost                  : ok=4    changed=1    unreachable=0    failed=0
  ```

## Verify the results

Verify the results of your work by navigating to the URL of the load balancer for your scale set:

![Java app running in a scale set in Azure.](media/ansible-vmss-deploy/ansible-deploy-app-vmss.png)

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Autoscale virtual machine scale sets in Azure using Ansible](./ansible-auto-scale-vmss.md)