---
 author: tomarchermsft
 ms.service: ansible
 ms.topic: include
 ms.date: 04/22/2019
 ms.author: tarcher
---

1. In Cloud Shell, create a file named `rg.yml`.

    ```bash
    code rg.yml
    ```

1. Paste the following code into the editor:

   ```yaml
   ---
   - hosts: localhost
     connection: local
     tasks:
       - name: Create resource group
         azure_rm_resourcegroup:
           name: ansible-rg
           location: eastus
         register: rg
       - debug:
           var: rg
   ```

1. Save the file and exit the editor.

1. Run the playbook using the `ansible-playbook` command:

   ```bash
   ansible-playbook rg.yml
   ```

After running the playbook, you see output similar to the following results:

```output
PLAY [localhost] *********************************************************************************

TASK [Gathering Facts] ***************************************************************************
ok: [localhost]

TASK [Create resource group] *********************************************************************
changed: [localhost]

TASK [debug] *************************************************************************************
ok: [localhost] => {
    "rg": {
        "changed": true,
        "contains_resources": false,
        "failed": false,
        "state": {
            "id": "/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/ansible-rg",
            "location": "eastus",
            "name": "ansible-rg",
            "provisioning_state": "Succeeded",
            "tags": null
        }
    }
}

PLAY RECAP ***************************************************************************************
localhost                  : ok=3    changed=1    unreachable=0    failed=0
```