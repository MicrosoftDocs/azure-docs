---
title: Update virtual machine scale sets in Azure with custom image using Ansible
description: Learn how to use Ansible to update virtual machine scale sets in Azure with custom image
ms.service: azure
keywords: ansible, azure, devops, bash, playbook, virtual machine, virtual machine scale set, vmss
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
---

# Update Virtual Machine Scale Sets in Azure with custom image using Ansible

Ansible allows you to automate the deployment and configuration of resources in your environment. You can use Ansible to manage your virtual machine scale set (VMSS) in Azure. If your VMSS is created with custom image, this tutorial shows you how to update your VMSS with another image.

## Prerequisites

- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation1.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation1.md)] [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation2.md)]

> [!Note]
> Ansible 2.8 is required to run the following the sample playbooks in this tutorial.

## Create two virtual machines and install HTTPD

The first playbook: 

- creates two virtual machines
- installs HTTPD on both of them
- changes index.html to contain **Image A** and **Image B** respectively

You can download the [sample playbook](https://github.com/Azure-Samples/ansible-playbooks/blob/master/vmss_images/01-create-vms.yml) or save the following playbook as *create_vms.yml*. 

```yml
- name: Create two VMs (A and B) with HTTPS
  hosts: localhost
  connection: local
  vars:
    vm_name: vmforimage
    admin_username: testuser
    admin_password: Pass123$$$abx!
    location: eastus
  tasks:
  - name: Create a resource group
    azure_rm_resourcegroup:
      name: "{{ resource_group }}"
      location: "{{ location }}"

  - name: Create virtual network
    azure_rm_virtualnetwork:
      resource_group: "{{ resource_group }}"
      name: "{{ vm_name }}"
      address_prefixes: "10.0.0.0/16"

  - name: Create subnets for VM A and B
    azure_rm_subnet:
      resource_group: "{{ resource_group }}"
      virtual_network: "{{ vm_name }}"
      name: "{{ vm_name }}"
      address_prefix: "10.0.1.0/24"

  - name: Create Network Security Group that allows HTTP
    azure_rm_securitygroup:
      resource_group: "{{ resource_group }}"
      name: "{{ vm_name }}"
      rules:
        - name: HTTP
          protocol: Tcp
          destination_port_range: 80
          access: Allow
          priority: 1002
          direction: Inbound

  - name: Create public IP addresses for VM A and B
    azure_rm_publicipaddress:
      resource_group: "{{ resource_group }}"
      allocation_method: Static
      name: "{{ vm_name }}_{{ item }}"
    loop:
      - A
      - B
    register: pip_output

  - name: Create virtual network inteface cards for VM A and B
    azure_rm_networkinterface:
      resource_group: "{{ resource_group }}"
      name: "{{ vm_name }}_{{ item }}"
      virtual_network: "{{ vm_name }}"
      subnet: "{{ vm_name }}"
      public_ip_name: "{{ vm_name }}_{{ item }}"
      security_group: "{{ vm_name }}"
    loop:
      - A
      - B

  - name: Create VM A and B
    azure_rm_virtualmachine:
      resource_group: "{{ resource_group }}"
      name: "{{ vm_name }}{{ item }}"
      admin_username: "{{ admin_username }}"
      admin_password: "{{ admin_password }}"
      vm_size: Standard_B1ms
      network_interfaces: "{{ vm_name }}_{{ item }}"
      image:
        offer: UbuntuServer
        publisher: Canonical
        sku: 16.04-LTS
        version: latest
    loop:
      - A
      - B

  - name: Create VM Extension
    azure_rm_virtualmachine_extension:
      resource_group: "{{ resource_group }}"
      name: testVMExtension
      virtual_machine_name: "{{ vm_name }}{{ item }}"
      publisher: Microsoft.Azure.Extensions
      virtual_machine_extension_type: CustomScript
      type_handler_version: 2.0
      auto_upgrade_minor_version: true
      settings: {"commandToExecute": "sudo apt-get -y install apache2"}
    loop:
      - A
      - B

  - name: Create VM Extension
    azure_rm_virtualmachine_extension:
      resource_group: "{{ resource_group }}"
      name: testVMExtension
      virtual_machine_name: "{{ vm_name }}{{ item }}"
      publisher: Microsoft.Azure.Extensions
      virtual_machine_extension_type: CustomScript
      type_handler_version: 2.0
      auto_upgrade_minor_version: true
      settings: {"commandToExecute": "printf '<html><body><h1>Image {{ item }}</h1></body></html>' >> index.html; sudo cp index.html /var/www/html/"}
    loop:
      - A
      - B

  - debug:
      msg: "Public IP Address A: {{ pip_output.results[0].state.ip_address }}"

  - debug:
      msg: "Public IP Address B: {{ pip_output.results[1].state.ip_address }}"
```

To run this playbook, use command ansible-playbook as follows:

>[!Tips]
> You can replace `myrg` with your own resource group name.

```bash
ansible-playbook create-vms.yml --extra-vars "resource_group=myrg"
```

Copy and paste IP addresses of both VMs to the browser:

![Public IP Address](media/ansible-vmss-update-image/vmss-update-vms-ip-addresses.png)

You see two different versions of VM:

![VM A](media/ansible-vmss-update-image/vmss-update-browser-vma.png)

and

![VM B](media/ansible-vmss-update-image/vmss-update-browser-vmb.png)


## Capture images from both Virtual Machines

Run second playbook to create the custom images. You can download the [sample](https://github.com/Azure-Samples/ansible-playbooks/blob/master/vmss_images/02-capture-images.yml) or copy below playbook. Save it as *capture-images.yml*

```yml
- name: Capture VM Images
  hosts: localhost
  connection: local
  vars:
    vm_name: vmforimage
  tasks:

  - name: Stop and generalize VMs
    azure_rm_virtualmachine:
      resource_group: "{{ resource_group }}"
      name: "{{ vm_name }}{{ item }}"
      generalized: yes
    loop:
      - A
      - B

  - name: Create an images from a VMs
    azure_rm_image:
      resource_group: "{{ resource_group }}"
      name: "image_{{ vm_name }}{{ item }}"
      source: "{{ vm_name }}{{ item }}"
    loop:
      - A
      - B
```

To run this playbook, use command ansible-playbook as follows:

```bash
ansible-playbook capture-images.yml --extra-vars "resource_group=myrg"
```

## Create VMSS using Image A

Download the [third playbook](https://github.com/Azure-Samples/ansible-playbooks/blob/master/vmss_images/03-create-vmss.yml) or save below as *create-vmss.yml*. This step creates:

- a public IP address
- a load balancer
- a VMSS that refers image A

```yml
---
- hosts: localhost
  vars:
    vmss_name: vmsstest
    location: eastus
    admin_username: vmssadmin
    admin_password: User123!!!abc
    vm_name: vmforimage
    image_name: "image_vmforimageA"

  tasks:

    - name: Create public IP address
      azure_rm_publicipaddress:
        resource_group: "{{ resource_group }}"
        allocation_method: Static
        name: "{{ vmss_name }}"
      register: pip_output

    - name: Create a load balancer
      azure_rm_loadbalancer:
        name: "{{ vmss_name }}lb"
        location: "{{ location }}"
        resource_group: "{{ resource_group }}"
        public_ip: "{{ vmss_name }}"
        probe_protocol: Tcp
        probe_port: 80
        probe_interval: 10
        probe_fail_count: 3
        protocol: Tcp
        load_distribution: Default
        frontend_port: 80
        backend_port: 80
        idle_timeout: 4
        natpool_frontend_port_start: 50000
        natpool_frontend_port_end: 50040
        natpool_backend_port: 22
        natpool_protocol: Tcp

    - name: Create VMSS
      azure_rm_virtualmachine_scaleset:
        resource_group: "{{ resource_group }}"
        name: "{{ vmss_name }}"
        vm_size: Standard_DS1_v2
        admin_username: "{{ admin_username }}"
        admin_password: "{{ admin_password }}"
        ssh_password_enabled: true
        capacity: 2
        virtual_network_name: "{{ vm_name }}"
        subnet_name: "{{ vm_name }}"
        upgrade_policy: Manual
        tier: Standard
        managed_disk_type: Standard_LRS
        os_disk_caching: ReadWrite
        image:
          name: "{{ image_name }}"
          resource_group: "{{ resource_group }}"
        load_balancer: "{{ vmss_name }}lb"

    - debug:
        msg: "VMSS public IP address: {{ pip_output.state.ip_address }}"
```

To run this playbook, use command ansible-playbook as follows:


```bash
ansible-playbook create-vmss.yml --extra-vars "resource_group=myrg"
```

Copy the IP address printed out at the end of your output to a browser:

![Public IP Address](media/ansible-vmss-update-image/vmss-update-vmss-public-ip.png)

You see Image A deployed to the VMSS:

![VMSS Image A](media/ansible-vmss-update-image/vmss-update-browser-initial-vmss.png)

## Update image referenced in VMSS and upgrade instances

The final playbook replaces Image A with Image B. Download the [sample](https://github.com/Azure-Samples/ansible-playbooks/blob/master/vmss_images/04-update-vmss-image.yml) or save below as *update-vmss-image.yml*:

```yml
- name: Update VMSS Image Referece
  hosts: localhost
  connection: local
  vars:
    vmss_name: vmsstest
    image_name: image_vmforimageB
    admin_username: vmssadmin
    admin_password: User123!!!abc
  tasks:

  - name: Update VMSS - second image
    azure_rm_virtualmachine_scaleset:
      resource_group: "{{ resource_group }}"
      name: "{{ vmss_name }}"
      vm_size: Standard_DS1_v2
      admin_username: "{{ admin_username }}"
      admin_password: "{{ admin_password }}"
      ssh_password_enabled: true
      capacity: 3
      virtual_network_name: "{{ vmss_name }}"
      subnet_name: "{{ vmss_name }}"
      upgrade_policy: Manual
      tier: Standard
      managed_disk_type: Standard_LRS
      os_disk_caching: ReadWrite
      image:
        name: "{{ image_name }}"
        resource_group: "{{ resource_group }}"
      load_balancer: "{{ vmss_name }}lb"

  - name: List all of the instances
    azure_rm_virtualmachinescalesetinstance_facts:
      resource_group: "{{ resource_group }}"
      vmss_name: "{{ vmss_name }}"
    register: instances

  - debug:
      var: instances

  - name: manually upgrade all the instances 
    azure_rm_virtualmachinescalesetinstance:
      resource_group: "{{ resource_group }}"
      vmss_name: "{{ vmss_name }}"
      instance_id: "{{ item.instance_id }}"
      latest_model: yes
    with_items: "{{ instances.instances }}"
```

To run this playbook, use command ansible-playbook as follows:

```bash
ansible-playbook update-vmss-image.yml --extra-vars "resource_group=myrg"
```

Now press **F5** in your browser to reload the page. You see that image is updated to Image B:

![VMSS Image B](media/ansible-vmss-update-image/vmss-update-browser-updated-vmss.png)

## Clean up resources

If you don't need these resources, you can delete them by running the following example. It deletes a resource group named **myrg**. 

```yml
- hosts: localhost
  vars:
    resource_group: myrg
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
> [Automatically scale a virtual machine scale set using Ansible](https://docs.microsoft.com/azure/ansible/ansible-auto-scale-vmss)