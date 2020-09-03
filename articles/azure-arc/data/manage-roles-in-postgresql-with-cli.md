---
title: Manage roles and users in your Azure PostgreSQL Hyperscale server group from CLI
description: Manage roles and users in your Azure PostgreSQL Hyperscale server group from CLI
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Scenario: Manage roles and users in your Azure PostgreSQL Hyperscale server group from CLI

This scenario guides you in managing roles in your server group and explains how to create, edit, list, and delete database roles or users for your server group.

## Getting started with managing database roles and users for your server group

The concepts of roles and users in this guide relate to the standard database roles and users in PostgreSQL. PostgreSQL documentation:

- [Roles](https://www.postgresql.org/docs/11/user-manag.html)
- [Users](https://www.postgresql.org/docs/11/sql-createuser.html)

Azure Arc automatically replicates the commands you're executing about a role/user (`create`, `edit`, `delete`) to all the nodes in your server group provided you execute these commands from the `azdata` command line.
To list the commands, you can execute about roles and users with `azdata` run the following commands:

**For roles:**

```console
azdata postgres role --help
```

You can create, list, or delete a role.

**For users:**

```console
azdata postgres user --help
```

You can create, edit, delete, or list a user.

PostgreSQL specific changes (For example, PostgreSQL permission assignments) are done with engine-specific tools like `psql`.

## Create

### Create a role

Run the following `azdata` command:

```console
azdata postgres role create -ns <namespace of your Arc setup> -n <server group name> -r <role name>
```

You can then edit or adjust this role with an [`alter role`](https://www.postgresql.org/docs/11/sql-alterrole.html) command once connected in your server group.

### Create a user

Run the following `azdata` command:

```console
azdata postgres user create -ns <namespace of your Arc setup> -n <server group name> -r <role name for the user> -u <user name>
```

If you don't specify a password, PostgreSQL Hyperscale will generate a strong password automatically:

```console
Name       Password                          Roles
---------  --------------------------------  --------
mypguser5  wh8w45bm2rekxqwwwye2hfhagn2kaw3d  mypgrole
```

You can use -p to specify a password.

## List

### List roles

From `azdata`, run the following command:

```console
azdata postgres role list -n <server group name>
```

You can also list roles by running the following query from `psql`: ```select * from pg_roles;```

### List users

From `azdata`, run the following command:

```console
azdata postgres user list -n <server group name>
```

You can also list users by running the following query from `psql`: ```select * from pg_user;```

## Edit users

For a given user, you can change the password or the role(s) it's assigned to.

### Change the password

Run the following `azdata` command:

```console
azdata postgres user edit -ns <namespace of your Arc setup> -n <server group name> -u <user name> -p <new password>
```

### Change the role assignments

To assign a user to another role or to multiple roles, run the following `azdata` command:

```console
azdata postgres user edit -ns <namespace of your Arc setup> -n <server group name> -u <user name> -p <new password>
```

Execute this command for each of the roles you want to map a user to.

## Delete

### Delete role

Run the following `azdata` command:

```console
azdata postgres role delete ns <namespace of your Arc setup> -n <server group name> -r <role name>
```

### Delete user

Run the following `azdata` command:

```console
azdata postgres user delete -ns <namespace of your Arc setup> -n <server group name> -r <role name for the user> -u <user name>
```

## Getting details about each azdata command available to manage roles and users

Run the following `azdata` commands as you need:

### Roles

- Details about `role` related commands: ```azdata postgres role --help```
- Details about `create role`: ```azdata postgres role create --help```
- Details about `delete role`: ```azdata postgres role delete --help```
- Details about `list role`: ```azdata postgres role list --help```

### Users

- Details about `users` related commands: ```azdata postgres user --help```
- Details about `create user`: ```azdata postgres user create --help```
- Details about `edit user`: ```azdata postgres user edit --help```
- Details about `delete user`: ```azdata postgres user delete --help```
- Details about `list user`: ```azdata postgres user list --help```

## Next steps

Try out other [scenarios](https://github.com/microsoft/Azure-data-services-on-Azure-Arc/tree/master/scenarios)
