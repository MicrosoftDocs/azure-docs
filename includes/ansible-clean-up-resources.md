---
 author: tomarchermsft
 ms.service: ansible
 ms.topic: include
 ms.date: 04/22/2019
 ms.author: tarcher
---

## Clean up resources

When no longer needed, delete the resources created in this article. 

[!INCLUDE [ansible-playbook-1-objectives.md](ansible-playbook-1-objectives.md)]

- Deletes a resource group referred to in the `vars` section.
- Automatically deletes all resources within the resource group.

[!INCLUDE [ansible-playbook-2-saveas.md](ansible-playbook-2-saveas.md)] `cleanup.yml`:

```yml
---
- hosts: localhost
  vars:
      resource_group: {{ resource_group_name }}
  tasks:
      - name: Clean up resource group
        azure_rm_resourcegroup:
            name: "{{ resource_group }}"
            state: absent
            force: yes
```

[!INCLUDE [ansible-playbook-3-key-notes.md](ansible-playbook-3-key-notes.md)]

- In the `vars` section, replace the `{{ resource_group_name }}` placeholder with the name of your resource group.

[!INCLUDE [ansible-playbook-4-run.md](ansible-playbook-4-run.md)]

```bash
ansible-playbook cleanup.yml
```