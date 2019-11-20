---
title: Tutorial - Create a VM or virtual machine scale set from the Azure Shared Image Gallery using Ansible
description: Learn how to use Ansible to create VM or virtual machine scale set based on a generalized image in Shared Image Gallery.
keywords: ansible, azure, devops, bash, playbook, virtual machine, virtual machine scale set, shared image gallery
ms.topic: tutorial
ms.date: 10/14/2019
---

# Tutorial: Create a VM or virtual machine scale set from the Azure Shared Image Gallery using Ansible

[!INCLUDE [ansible-29-note.md](../../includes/ansible-29-note.md)]

[Shared Image Gallery](/azure/virtual-machines/windows/shared-image-galleries) is a service that allows you to manage, share, and organize custom-managed images easily. This feature is beneficial for scenarios where many images are maintained and shared. Custom images can be shared across subscriptions and between Azure Active Directory tenants. Images can also be replicated to multiple regions for quicker deployment scaling.

[!INCLUDE [ansible-tutorial-goals.md](../../includes/ansible-tutorial-goals.md)]

> [!div class="checklist"]
>
> * Create a generalized VM and custom image
> * Create a Shared Image Gallery
> * Create a shared image and image version
> * Create a VM using the generalized image
> * Create a virtual machine scale set using the generalized image
> * Get information about your Shared Image Gallery, image and version.

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../../includes/open-source-devops-prereqs-azure-subscription.md)]
[!INCLUDE [ansible-prereqs-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-cloudshell-use-or-vm-creation2.md)]

## Get the sample playbooks

There are two ways to get the complete set of sample playbooks:

- [Download the SIG folder](https://github.com/Azure-Samples/ansible-playbooks/tree/master/SIG_generalized_image) and save it to your local machine.
- Create a new file for each section and copy the sample playbook in it.

The `vars.yml` file contains the variables used by all sample playbooks for this tutorial. You can edit the file to provide unique names and values.

The first sample playbook `00-prerequisites.yml` creates what's necessary to complete this tutorial:
- A resource group, which is a logical container in which Azure resources are deployed and managed.
- A virtual network; subnet; public IP address and network interface card for the VM.
- A source Virtual Machine, which is used for creating the generalized image.

```yml
- hosts: localhost
  connection: local
  vars_files:
    - ./vars.yml

  tasks:
    - name: Create resource group if doesn't exist
      azure_rm_resourcegroup:
        name: "{{ resource_group }}"
        location: "{{ location }}"
    
    - name: Create virtual network
      azure_rm_virtualnetwork:
        resource_group: "{{ resource_group }}"
        name: "{{ virtual_network_name }}"
        address_prefixes: "10.0.0.0/16"

    - name: Add subnet
      azure_rm_subnet:
        resource_group: "{{ resource_group }}"
        name: "{{ subnet_name }}"
        address_prefix: "10.0.1.0/24"
        virtual_network: "{{ virtual_network_name }}"

    - name: Create public IP address
      azure_rm_publicipaddress:
        resource_group: "{{ resource_group }}"
        allocation_method: Static
        name: "{{ ip_name }}"

    - name: Create virtual network inteface cards for VM A and B
      azure_rm_networkinterface:
        resource_group: "{{ resource_group }}"
        name: "{{ network_interface_name }}"
        virtual_network: "{{ virtual_network_name }}"
        subnet: "{{ subnet_name }}"

    - name: Create VM
      azure_rm_virtualmachine:
        resource_group: "{{ resource_group }}"
        name: "{{ source_vm_name }}"
        admin_username: testuser
        admin_password: "Password1234!"
        vm_size: Standard_B1ms
        network_interfaces: "{{ network_interface_name }}"
        image:
          offer: UbuntuServer
          publisher: Canonical
          sku: 16.04-LTS
          version: latest
```

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook 00-prerequisites.yml
```

In the [Azure portal](https://portal.azure.com), check the resource group you specified in `vars.yml` to see the new virtual machine and various resources you created.

## Generalize the VM and create a custom image

The next playbook, `01a-create-generalized-image.yml`, generalizes the source VM created in previous step and then create a custom image based on it.

```yml
- hosts: localhost
  connection: local
  vars_files:
    - ./vars.yml

  tasks:
    - name: Generalize VM
      azure_rm_virtualmachine:
        resource_group: "{{ resource_group }}"
        name: "{{ source_vm_name }}"
        generalized: yes

    - name: Create custom image
      azure_rm_image:
        resource_group: "{{ resource_group }}"
        name: "{{ image_name }}"
        source: "{{ source_vm_name }}"
```

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook 01a-create-generalized-image.yml
```

Check your resource group and make sure `testimagea` shows up.

## Create the Shared Image Gallery

The image gallery is the repository for sharing and managing images. The sample playbook code in `02-create-shared-image-gallery.yml` creates a Shared Image Gallery in your resource group.

```yml
- hosts: localhost
  connection: local
  vars_files:
    - ./vars.yml

  tasks:
    - name: Create shared image gallery
      azure_rm_gallery:
        resource_group: "{{ resource_group }}"
        name: "{{ shared_gallery_name }}"
        location: "{{ location }}"
        description: This is the gallery description.
```

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook 02-create-shared-image-gallery.yml
```

You now see a new gallery, `myGallery`, in your resource group.

## Create a shared image and image version

The next playbook, `03a-create-shared-image-generalized.yml` creates an image definition and an image version.

Image definitions include the image type (Windows or Linux), release notes, and minimum and maximum memory requirements. Image version is the version of the image. Gallery, image definition, and image version help you organize images in logical groups. 

```yml
- hosts: localhost
  connection: local
  vars_files:
    - ./vars.yml

  tasks:
    - name: Create shared image
      azure_rm_galleryimage:
        resource_group: "{{ resource_group }}"
        gallery_name: "{{ shared_gallery_name }}"
        name: "{{ shared_image_name }}"
        location: "{{ location }}"
        os_type: linux
        os_state: generalized
        identifier:
          publisher: myPublisherName
          offer: myOfferName
          sku: mySkuName
        description: Image description
    
    - name: Create or update a simple gallery image version.
      azure_rm_galleryimageversion:
        resource_group: "{{ resource_group }}"
        gallery_name: "{{ shared_gallery_name }}"
        gallery_image_name: "{{ shared_image_name }}"
        name: "{{ shared_image_version }}"
        location: "{{ location }}"
        publishing_profile:
          end_of_life_date: "2020-10-01t00:00:00+00:00"
          exclude_from_latest: yes
          replica_count: 3
          storage_account_type: Standard_LRS
          target_regions:
            - name: West US
              regional_replica_count: 1
            - name: East US
              regional_replica_count: 2
              storage_account_type: Standard_ZRS
          managed_image:
            name: "{{ image_name }}"
            resource_group: "{{ resource_group }}"
      register: output

    - debug:
        var: output
```

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook 03a-create-shared-image-generalized.yml
```

Your resource group now have an image definition and an image version for your gallery.

## Create a VM based on the generalized image

Finally, run `04a-create-vm-using-generalized-image.yml` to create a VM based on the generalized image you created in previous step.

```yml
- hosts: localhost
  connection: local
  vars_files:
    - ./vars.yml

  tasks:
  - name: Create VM using shared image
    azure_rm_virtualmachine:
      resource_group: "{{ resource_group }}"
      name: "{{ vm_name }}"
      vm_size: Standard_DS1_v2
      admin_username: adminUser
      admin_password: PassWord01
      managed_disk_type: Standard_LRS
      image:
        id: "/subscriptions/{{ lookup('env', 'AZURE_SUBSCRIPTION_ID') }}/resourceGroups/{{ resource_group }}/providers/Microsoft.Compute/galleries/{{ shared_gallery_name }}/images/{{ shared_image_name }}/versions/{{ shared_image_version }}"
```

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook 04a-create-vm-using-generalized-image.yml
```

## Create a virtual machine scale sets based on the generalized image

You can also create a virtual machine scale set based on the generalized image. Run `05a-create-vmss-using-generalized-image.yml` to do so.

```yml
- hosts: localhost
  connection: local
  vars_files:
    - ./vars.yml

  tasks:
  - name: Create a virtual machine scale set using a shared image
    azure_rm_virtualmachinescaleset:
      resource_group: "{{ resource_group }}"
      name: "{{ vmss_name }}"
      vm_size: Standard_DS1_v2
      admin_username: adminUser
      admin_password: PassWord01
      capacity: 2
      virtual_network_name: "{{ virtual_network_name }}"
      upgrade_policy: Manual
      subnet_name: "{{ subnet_name }}"
      managed_disk_type: Standard_LRS
      image:
        id: "/subscriptions/{{ lookup('env', 'AZURE_SUBSCRIPTION_ID') }}/resourceGroups/{{ resource_group }}/providers/Microsoft.Compute/galleries/{{ shared_gallery_name }}/images/{{ shared_image_name }}/versions/{{ shared_image_version }}"
```

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook 05a-create-vmss-using-generalized-image.yml
```

## Get information about the gallery

You can get information about the gallery, image definition, and version by running `06-get-info.yml`.

```yml
- hosts: localhost
  connection: local
  vars_files:
    - ./vars.yml

  tasks:
  - name: Get Shared Image Gallery information
    azure_rm_gallery_info:
      resource_group: "{{ resource_group }}"
      name: "{{ shared_gallery_name }}"
  - name: Get shared image information
    azure_rm_galleryimage_info:
      resource_group: "{{ resource_group }}"
      gallery_name: "{{ shared_gallery_name }}"
      name: "{{ shared_image_name }}"
  - name: Get Shared Image Gallery image version information
    azure_rm_galleryimageversion_info:
      resource_group: "{{ resource_group }}"
      gallery_name: "{{ shared_gallery_name }}"
      gallery_image_name: "{{ shared_image_name }}"
      name: "{{ shared_image_version }}"
```

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook 06-get-info.yml
```

## Delete the shared image

To delete the gallery resources, refer to sample playbook `07-delete-gallery.yml`. Delete resources in reverse order. Start by deleting the image version. After you delete all of the image versions, you can delete the image definition. After you delete all image definitions, you can delete the gallery.

```yml
- hosts: localhost
  connection: local
  vars_files:
    - ./vars.yml

  tasks:
  - name: Delete gallery image version.
    azure_rm_galleryimageversion:
      resource_group: "{{ resource_group }}"
      gallery_name: "{{ shared_gallery_name }}"
      gallery_image_name: "{{ shared_image_name }}"
      name: "{{ shared_image_version }}"
      state: absent

  - name: Delete gallery image
    azure_rm_galleryimage:
      resource_group: "{{ resource_group }}"
      gallery_name: "{{ shared_gallery_name }}"
      name: "{{ shared_image_name }}"
      state: absent

  - name: Delete a simple gallery.
    azure_rm_gallery:
      resource_group: "{{ resource_group }}"
      name: "{{ shared_gallery_name }}"
      state: absent
```

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook 07-delete-gallery.yml
```

## Clean up resources

When no longer needed, delete the resources created in this article. 

The sample playbook code in this section is used to:

- Delete the two resources groups created earlier

Save the following playbook as `cleanup.yml`:

```yml
- hosts: localhost
  vars:
    resource_group: "{{ resource_group_name }}"
  tasks:
    - name: Delete a resource group
      azure_rm_resourcegroup:
        name: "{{ resource_group }}"
        force_delete_nonempty: yes
        state: absent
```

Here are some key notes to consider when working with the sample playbook:

- Replace the `{{ resource_group_name }}` placeholder with the name of your resource group.
- All resources within the two specified resource groups will be deleted.

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook cleanup.yml
```

## Next steps

> [!div class="nextstepaction"] 
> [Ansible on Azure](/azure/ansible/)