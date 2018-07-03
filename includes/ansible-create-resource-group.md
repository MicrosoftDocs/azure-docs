1. Type `vi rg.yml` to enter the `VIM` text editor to create file `rg.yml`.

1. Type `:set paster`, press `ENTER`, then type `i` to enter the paste insert mode.

1. Paste the following yaml file:

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

1. Exit `VIM` and save text by typing `ESC` and then typing `:wq`.

1. Run playbook `rg.yml`

   ```bash
   ansible-playbook rg.yml
   ```


The output should like this:

```
PLAY [localhost] **************************************************************************************************

TASK [Gathering Facts] **************************************************************************************************
ok: [localhost]

TASK [Create resource group] **************************************************************************************************
changed: [localhost]

TASK [debug] **************************************************************************************************
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

PLAY RECAP **************************************************************************************************
localhost                  : ok=3    changed=1    unreachable=0    failed=0
```