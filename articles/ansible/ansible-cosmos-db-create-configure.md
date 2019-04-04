---
title: Create and configure an Azure Cosmos DB account by using Ansible
description: Learn how to use Ansible to create and configure an Azure Cosmos DB
ms.service: azure
keywords: ansible, azure, devops, bash, playbook, cosmo db, database
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
---

# Create and configure an Azure Cosmos DB account by using Ansible

[Azure Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/) is a globally distributed, multi-model database service that supports document, key-value, wide-column, and graph databases. Ansible enables you to automate the deployment and configuration of resources in your environment.

This tutorial shows you how to use Ansible to create an Azure Cosmo DB account and retrieve the primary and secondary master write keys and primary and secondary read-only keys for the account. 

## Prerequisites

- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- **Azure service principal** - When [creating the service principal](/cli/azure/create-an-azure-service-principal-azure-cli?view=azure-cli-latest), note the following values: **appId**, **displayName**, **password**, and **tenant**.
- [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation1.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation1.md)] [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation2.md)]

> [!Note]
> Ansible 2.8 is required to run the following the sample playbooks in this tutorial. 

## Create a random postfix

The first task in the [sample playbook](https://github.com/Azure-Samples/ansible-playbooks/blob/master/cosmosdb_create.yml) creates a random postfix to use as part of the Azure Cosmos DB account name.

```yaml
  - hosts: localhost
    tasks:
      - name: Prepare random postfix
        set_fact:
          rpfx: "{{ 1000 | random }}"
        run_once: yes
```

## Create resource group 

The next task creates a resource group; a logical container in which Azure resources are deployed and managed.

```yaml
  - name: Create a resource group
    azure_rm_resourcegroup:
      name: "{{ resource_group }}"
      location: "{{ location }}"
```

## Create virtual network and subnet

You need a virtual network and subnet for your Azure Cosmos DB account.

```yaml
  - name: Create virtual network
    azure_rm_virtualnetwork:
      resource_group: "{{ resource_group }}"
      name: "{{ vnet_name }}"
      address_prefixes_cidr:
        - 10.1.0.0/16
        - 172.100.0.0/16
      dns_servers:
        - 127.0.0.1
        - 127.0.0.3

  - name: Add subnet
    azure_rm_subnet:
      name: "{{ subnet_name }}"
      virtual_network_name: "{{ vnet_name }}"
      resource_group: "{{ resource_group }}"
      address_prefix_cidr: "10.1.0.0/24"
```

## Create an Azure Cosmos DB account

The next sample playbook section includes codes to create the actual Cosmos DB account.

```yaml
  - name: Create instance of Cosmos DB Account
    azure_rm_cosmosdbaccount:
      resource_group: "{{ resource_group }}"
      name: "{{ cosmosdbaccount_name }}"
      location: eastus
      kind: global_document_db
      geo_rep_locations:
        - name: eastus
          failover_priority: 0
        - name: westus
          failover_priority: 1
      database_account_offer_type: Standard
      is_virtual_network_filter_enabled: yes
      virtual_network_rules:
        - subnet:
            resource_group: "{{ resource_group }}"
            virtual_network_name: "{{ vnet_name }}"
            subnet_name: "{{ subnet_name }}"
          ignore_missing_vnet_service_endpoint: yes
      enable_automatic_failover: yes
```

The account creation takes a few minutes to complete.

### Retrieve keys and display the account facts

To fetch the keys to use in applications:

```yaml
  - name: Get Cosmos DB Account facts with keys
    azure_rm_cosmosdbaccount_facts:
      resource_group: "{{ resource_group }}"
      name: "{{ cosmosdbaccount_name }}"
      retrieve_keys: all
    register: output

  - name: Display Cosmos DB Acccount facts output
    debug:
      var: output
```

## Delete the Azure Cosmos DB account

Finally, you can delete the Azure Cosmos DB account:

```yaml
  - name: Delete instance of Cosmos DB Account
    azure_rm_cosmosdbaccount:
      resource_group: "{{ resource_group }}"
      name: "{{ cosmosdbaccount_name }}"
      state: absent
```

## Complete Sample Ansible playbook

This is the complete playbook you have built. [Download the sample playbook](https://github.com/Azure-Samples/ansible-playbooks/blob/master/cosmosdb_create.yml) or save below as `cosmosdb.yml`. Make sure you replace the placeholder **{{ resoruce_group_name }}** in the ```vars``` section with your own resource group name.

> [!Tip]
> ```cosmosdbaccount_name``` should include only lowercase characters and must be globally unique.

```yml
---
- hosts: localhost
  tasks:
    - name: Prepare random postfix
      set_fact:
        rpfx: "{{ 1000 | random }}"
      run_once: yes

- hosts: localhost
#  roles:
#    - azure.azure_preview_modules
  vars:
    resource_group: "{{ resource_group_name }}"
    location: eastus
    vnet_name: myVirtualNetwork
    subnet_name: mySubnet
    cosmosdbaccount_name: cosmos{{ rpfx }}

  tasks:
    - name: Create a resource group
      azure_rm_resourcegroup:
        name: "{{ resource_group }}"
        location: "{{ location }}"

    - name: Create virtual network
      azure_rm_virtualnetwork:
        resource_group: "{{ resource_group }}"
        name: "{{ vnet_name }}"
        address_prefixes_cidr:
          - 10.1.0.0/16
          - 172.100.0.0/16
        dns_servers:
          - 127.0.0.1
          - 127.0.0.3

    - name: Add subnet
      azure_rm_subnet:
        name: "{{ subnet_name }}"
        virtual_network_name: "{{ vnet_name }}"
        resource_group: "{{ resource_group }}"
        address_prefix_cidr: "10.1.0.0/24"

    - name: Create instance of Cosmos DB Account
      azure_rm_cosmosdbaccount:
        resource_group: "{{ resource_group }}"
        name: "{{ cosmosdbaccount_name }}"
        location: eastus
        kind: global_document_db
        geo_rep_locations:
          - name: eastus
            failover_priority: 0
          - name: westus
            failover_priority: 1
        database_account_offer_type: Standard
        is_virtual_network_filter_enabled: yes
        virtual_network_rules:
          - subnet:
              resource_group: "{{ resource_group }}"
              virtual_network_name: "{{ vnet_name }}"
              subnet_name: "{{ subnet_name }}"
            ignore_missing_vnet_service_endpoint: yes
        enable_automatic_failover: yes

    - name: Get Cosmos DB Account facts with keys
      azure_rm_cosmosdbaccount_facts:
        resource_group: "{{ resource_group }}"
        name: "{{ cosmosdbaccount_name }}"
        retrieve_keys: all
      register: output

    - name: Display Cosmos DB Account facts output
      debug:
        var: output

    - name: Delete instance of Cosmos DB Account
      azure_rm_cosmosdbaccount:
        resource_group: "{{ resource_group }}"
        name: "{{ cosmosdbaccount_name }}"
        state: absent
```

To run the playbook, use the **ansible-playbook** command as follows:

```bash
ansible-playbook cosmosdb.yml
```

After running the playbook, output similar to the following example shows that the Azure Cosmos DB account was successfully created and you can find the primary and secondary keys:

```Output
PLAY [localhost] ***************************************************************

TASK [Gathering Facts] *********************************************************
ok: [localhost]

TASK [Prepare random postfix] **************************************************
ok: [localhost]

PLAY [localhost] ***************************************************************

TASK [Gathering Facts] *********************************************************
ok: [localhost]

TASK [Create a resource group] *************************************************
changed: [localhost]

TASK [Create virtual network] **************************************************
changed: [localhost]

TASK [Add subnet] **************************************************************
changed: [localhost]

TASK [Create instance of Cosmos DB Account] ************************************
 [WARNING]: Azure API profile latest does not define an entry for CosmosDB

changed: [localhost]

TASK [Get Cosmos DB Account facts with keys] ***********************************
ok: [localhost]

TASK [Display Cosmos DB Acccount facts output] *********************************
ok: [localhost] => {
    "output": {
        "accounts": [
            {
                "consistency_policy": {
                    "default_consistency_level": "session",
                    "max_interval_in_seconds": 5,
                    "max_staleness_prefix": 100
                },
                "database_account_offer_type": "Standard",
                "document_endpoint": "https://cosmos709.documents.azure.com:443/",
                "enable_automatic_failover": true,
                "enable_cassandra": false,
                "enable_gremlin": false,
                "enable_multiple_write_locations": false,
                "enable_table": false,
                "failover_policies": [
                    {
                        "failover_priority": 0,
                        "id": "cosmos709-eastus",
                        "name": "eastus"
                    },
                    {
                        "failover_priority": 1,
                        "id": "cosmos709-westus",
                        "name": "westus"
                    }
                ],
                "id": "/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/cosmosdbrg/providers/Microsoft.DocumentDB/databaseAccounts/cosmos709",
                "ip_range_filter": "",
                "is_virtual_network_filter_enabled": true,
                "kind": "global_document_db",
                "location": "eastus",
                "name": "cosmos709",
                "primary_master_key": "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
                "primary_readonly_master_key": "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
                "provisioning_state": "Succeeded",
                "read_locations": [
                    {
                        "document_endpoint": "https://cosmos709-eastus.documents.azure.com:443/",
                        "failover_priority": 0,
                        "id": "cosmos709-eastus",
                        "name": "eastus",
                        "provisioning_state": "Succeeded"
                    },
                    {
                        "document_endpoint": "https://cosmos709-westus.documents.azure.com:443/",
                        "failover_priority": 1,
                        "id": "cosmos709-westus",
                        "name": "westus",
                        "provisioning_state": "Succeeded"
                    }
                ],
                "resource_group": "cosmosdbrg",
                "secondary_master_key": "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
                "secondary_readonly_master_key": "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY=",
                "tags": {},
                "virtual_network_rules": [
                    {
                        "id": "/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/cosmosdbrg/providers/Microsoft.Network/virtualNetworks/myvirtualnetwork/subnets/mysubnet",
                        "ignore_missing_vnet_service_endpoint": true
                    }
                ],
                "write_locations": [
                    {
                        "document_endpoint": "https://cosmos709-eastus.documents.azure.com:443/",
                        "failover_priority": 0,
                        "id": "cosmos709-eastus",
                        "name": "eastus",
                        "provisioning_state": "Succeeded"
                    }
                ]
            }
        ],
        "changed": false,
        "failed": false,
        "warnings": [
            "Azure API profile latest does not define an entry for CosmosDB"
        ]
    }
}

TASK [Delete instance of Cosmos DB Account] ************************************
changed: [localhost]

PLAY RECAP *********************************************************************
localhost                  : ok=10   changed=5    unreachable=0    failed=0    skipped=1    rescued=0    ignored=0
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

Save the preceding playbook as **rg_delete.yml**. To run the playbook, use the **ansible-playbook** command as follows:

```bash
ansible-playbook rg_delete.yml
```

## Next steps
> [!div class="nextstepaction"] 
> [Ansible on Azure](https://docs.microsoft.com/azure/ansible/)