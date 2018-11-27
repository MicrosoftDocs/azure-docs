---
title: Create and configure an Azure Database for MySQL server by using Ansible (preview)
description: Learn how to use Ansible to create and configure an Azure Database for MySQL server
ms.service: ansible
keywords: ansible, azure, devops, bash, playbook, mysql, database
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 09/23/2018
---

# Create and configure an Azure Database for MySQL server by using Ansible (preview)
[Azure Database for MySQL](https://docs.microsoft.com/azure/mysql/) is a managed service that you use to run, manage, and scale highly available MySQL databases in the cloud. Ansible enables you to automate the deployment and configuration of resources in your environment. 

This quickstart shows you how use Ansible to create an Azure Database for MySQL server and configure its firewall rule. You can finish those tasks in about five minutes by using the Azure portal.

## Prerequisites
- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation1.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation1.md)] [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation2.md)]

> [!Note]
> Ansible 2.7 is required to run the following the sample playbooks in this tutorial. You can install the Ansible 2.7 RC version by running `sudo pip install ansible[azure]==2.7.0rc2`. After Ansible 2.7 is released, you won't need to specify the version here because the default version will be 2.7.

## Create a resource group
A resource group is a logical container in which Azure resources are deployed and managed.  

The following example creates a resource group named **myResourceGroup** in the **eastus** location:

```yml
- hosts: localhost
  vars:
    resource_group: myResourceGroup
    location: eastus 
  tasks:
    - name: Create a resource group
      azure_rm_resourcegroup:
        name: "{{ resource_group }}"
        location: "{{ location }}"
```

Save the preceding playbook as **rg.yml**. To run the playbook, use the **ansible-playbook** command as follows:
```bash
ansible-playbook rg.yml
```

## Create a MySQL server and database
The following example creates a MySQL server named **mysqlserveransible** and an Azure Database for MySQL instance named **mysqldbansible**. This is a Gen 5 Basic Purpose server with one vCore. 

The value of **mysqlserver_name** must be unique. To understand the valid values per region and per tier, see the [pricing tiers documentation](https://docs.microsoft.com/azure/mysql/concepts-pricing-tiers). Replace `<server_admin_password>` with a password.

```yml
- hosts: localhost
  vars:
    resource_group: myResourceGroup
    location: eastus
    mysqlserver_name: mysqlserveransible
    mysqldb_name: mysqldbansible
    admin_username: mysqladmin
    admin_password: <server_admin_password> 
  tasks:
    - name: Create MySQL Server
      azure_rm_mysqlserver:
        resource_group: "{{ resource_group }}"
        name: "{{ mysqlserver_name }}"
        sku:
          name: B_Gen5_1
          tier: Basic
        location: "{{ location }}"
        version: 5.6
        enforce_ssl: True
        admin_username: "{{ admin_username }}"
        admin_password: "{{ admin_password }}"
        storage_mb: 51200
    - name: Create instance of MySQL Database
      azure_rm_mysqldatabase:
        resource_group: "{{ resource_group }}"
        server_name: "{{ mysqlserver_name }}"
        name: "{{ mysqldb_name }}"
```

Save the preceding playbook as **mysql_create.yml**. To run the playbook, use the **ansible-playbook** command as follows:
```bash
ansible-playbook mysql_create.yml
```

## Configure a firewall rule
A server-level firewall rule allows an external application to connect to your server through the Azure MySQL service firewall. An example of an external application is the **mysql** command-line tool or MySQL Workbench.
The following example creates a firewall rule called **extenalaccess** that allows connections from any external IP address. 

Enter your own values for **startIpAddress** and **endIpAddress**. Use the range of IP addresses that correspond to where you'll be connecting from. 

```yml
- hosts: localhost
  vars:
    resource_group: myResourceGroup
    mysqlserver_name: mysqlserveransible
  tasks:
  - name: Open firewall to access MySQL Server from outside
    azure_rm_resource:
      api_version: '2017-12-01'
      resource_group: "{{ resource_group }}"
      provider: dbformysql
      resource_type: servers
      resource_name: "{{ mysqlserver_name }}"
      subresource:
        - type: firewallrules
          name: externalaccess
      body:
        properties:
          startIpAddress: "0.0.0.0"
          endIpAddress: "255.255.255.255"
```

> [!NOTE]
> Connections to Azure Database for MySQL communicate over port 3306. If you try to connect from within a corporate network, outbound traffic over port 3306 might not be allowed. In that case, you can't connect to your server unless your IT department opens port 3306.
> 

Here, the **azure_rm_resource** module is used to perform this task. It allows direct use of the REST API.

Save the preceding playbook as **mysql_firewall.yml**. To run the playbook, use the **ansible-playbook** command as follows:
```bash
ansible-playbook mysql_firewall.yml
```

## Connect to the server by using the command-line tool
You can [download MySQL](https://dev.mysql.com/downloads/) and install it on your computer. Instead, you can select the **Try It** button in code samples, or the  **>_** button from the upper-right toolbar in the Azure portal, and open **Azure Cloud Shell**.

Enter the next commands: 

1. Connect to the server by using the **mysql** command-line tool:
```azurecli-interactive
 mysql -h mysqlserveransible.mysql.database.azure.com -u mysqladmin@mysqlserveransible -p
```

2. View the server status:
```sql
 mysql> status
```

If everything goes well, the command-line tool should output the following text:

```
demo@Azure:~$ mysql -h mysqlserveransible.mysql.database.azure.com -u mysqladmin@mysqlserveransible -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 65233
Server version: 5.6.39.0 MySQL Community Server (GPL)

Copyright (c) 2000, 2018, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> status
--------------
mysql  Ver 14.14 Distrib 5.7.23, for Linux (x86_64) using  EditLine wrapper

Connection id:          65233
Current database:
Current user:           mysqladmin@13.76.42.93
SSL:                    Cipher in use is AES256-SHA
Current pager:          stdout
Using outfile:          ''
Using delimiter:        ;
Server version:         5.6.39.0 MySQL Community Server (GPL)
Protocol version:       10
Connection:             mysqlserveransible.mysql.database.azure.com via TCP/IP
Server characterset:    latin1
Db     characterset:    latin1
Client characterset:    utf8
Conn.  characterset:    utf8
TCP port:               3306
Uptime:                 36 min 21 sec

Threads: 5  Questions: 559  Slow queries: 0  Opens: 96  Flush tables: 3  Open tables: 10  Queries per second avg: 0.256
--------------
```

## Using facts to query MySQL servers
The following example queries MySQL servers in **myResourceGroup** and subsequently all the databases on the servers:

```yml
- hosts: localhost
  vars:
    resource_group: myResourceGroup
    mysqlserver_name: mysqlserveransible
  tasks:
    - name: Query MySQL Servers in current resource group
      azure_rm_mysqlserver_facts:
        resource_group: "{{ resource_group }}"
      register: mysqlserverfacts

    - name: Dump MySQL Server facts
      debug:
        var: mysqlserverfacts

    - name: Query MySQL Databases
      azure_rm_mysqldatabase_facts:
        resource_group: "{{ resource_group }}"
        server_name: "{{ mysqlserver_name }}"
      register: mysqldatabasefacts

    - name: Dump MySQL Database Facts
      debug:
        var: mysqldatabasefacts
```

Save the preceding playbook as **mysql_query.yml**. To run the playbook, use the **ansible-playbook** command as follows:

```bash
ansible-playbook mysql_query.yml
```

Then you'll see the following output for the MySQL server: 
```json
"servers": [
    {
        "admin_username": "mysqladmin",
        "enforce_ssl": false,
        "fully_qualified_domain_name": "mysqlserveransible.mysql.database.azure.com",
        "id": "/subscriptions/685ba005-af8d-4b04-8f16-a7bf38b2eb5a/resourceGroups/myResourceGroup/providers/Microsoft.DBforMySQL/servers/mysqlserveransible",
        "location": "eastus",
        "name": "mysqlserveransible",
        "resource_group": "myResourceGroup",
        "sku": {
            "capacity": 1,
            "family": "Gen5",
            "name": "B_Gen5_1",
            "tier": "Basic"
        },
        "storage_mb": 5120,
        "user_visible_state": "Ready",
        "version": "5.6"
    }
]
```

You'll also see the following output for the MySQL database:
```json
"databases": [
    {
        "charset": "utf8",
        "collation": "utf8_general_ci",
        "name": "information_schema",
        "resource_group": "myResourceGroup",
        "server_name": "mysqlserveransible"
    },
    {
        "charset": "latin1",
        "collation": "latin1_swedish_ci",
        "name": "mysql",
        "resource_group": "myResourceGroup",
        "server_name": "mysqlserveransibler"
    },
    {
        "charset": "latin1",
        "collation": "latin1_swedish_ci",
        "name": "mysqldbansible",
        "resource_group": "myResourceGroup",
        "server_name": "mysqlserveransible"
    },
    {
        "charset": "utf8",
        "collation": "utf8_general_ci",
        "name": "performance_schema",
        "resource_group": "myResourceGroup",
        "server_name": "mysqlserveransible"
    }
]
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
        state: absent
```

Save the preceding playbook as **rg_delete.yml**. To run the playbook, use the **ansible-playbook** command as follows:
```bash
ansible-playbook rg_delete.yml
```

If you want to delete only the one newly created MySQL server, run the following example:

```yml
- hosts: localhost
  vars:
    resource_group: myResourceGroup
    mysqlserver_name: mysqlserveransible
  tasks:
    - name: Delete MySQL Server
      azure_rm_mysqlserver:
        resource_group: "{{ resource_group }}"
        name: "{{ mysqlserver_name }}"
        state: absent
```

Save the preceding playbook as **mysql_delete.yml**. To run the playbook, use the **ansible-playbook** command as follows:
```bash
ansible-playbook mysql_delete.yml
```

## Next steps
> [!div class="nextstepaction"] 
> [Ansible on Azure](https://docs.microsoft.com/azure/ansible/)
