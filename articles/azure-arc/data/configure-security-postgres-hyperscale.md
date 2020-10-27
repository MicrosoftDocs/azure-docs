--- 
title: Configure security for your Azure Arc enabled PostgreSQL Hyperscale server group
description: Configure security for your Azure Arc enabled PostgreSQL Hyperscale server group
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Configure security for your Azure Arc enabled PostgreSQL Hyperscale server group

This document describes various aspects related to security of your server group:
- Encryption at rest
- User management
   - General perspectives
   - Change the password of the _postgres_ administrative user

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Encryption at rest
You can implement encryption at rest either by encrypting the disks on which you store your databases and/or by using database functions to encrypt the data you insert or update.

### Hardware: Linux host volume encryption
Implement system data encryption to secure any data that resides on the disks used by your Azure Arc enabled Data Services setup. You can read more about this topic:
- [Data encryption at rest](https://wiki.archlinux.org/index.php/Data-at-rest_encryption) on Linux in general 
- Disk encryption with LUKS `cryptsetup` encrypt command (Linux)(https://www.cyberciti.biz/security/howto-linux-hard-disk-encryption-with-luks-cryptsetup-command/) specifically Since Azure Arc enabled Data Services runs on the physical infrastructure that you provide, you are in charge of securing the infrastructure.

### Software: Use the PostgreSQL `pgcrypto` extension in your server group
In addition of encrypting the disks used to host your Azure Arc setup, you can configure your Azure Arc enabled PostgreSQL Hyperscale server group to expose mechanisms that your applications can use to encrypt data in your database(s). The `pgcrypto` extension is part of the `contrib` extensions of Postgres and is available in your Azure Arc enabled PostgreSQL Hyperscale server group. You find details about the `pgcrypto` extension [here](https://www.postgresql.org/docs/current/pgcrypto.html).
In summary, with the following commands, you enable the extension, you create it and you use it:


#### Create the `pgcrypto` extension
Connect to your server group with the client tool of your choice and run the standard PostgreSQL query:
```console
CREATE EXTENSION pgcrypto;
```

> You find details [here](get-connection-endpoints-and-connection-strings-postgres-hyperscale.md) about how to connect.

#### Verify the list the extensions ready to use in your server group
You can verify that the `pgcrypto` extension is ready to use by listing the extensions available in your server group.
Connect to your server group with the client tool of your choice and run the standard PostgreSQL query:
```console
select * from pg_extension;
```
You should see `pgcrypto` if you enabled and created it with the commands indicated above.

#### Use the `pgcrypto` extension
Now you can adjust the code your applications so that they use any of the functions offered by `pgcrypto`:
- General hashing functions
- Password hashing functions
- PGP encryption functions
- Raw encryption functions
- Random-data functions

For example, to generate hash values. Run the command:

```console
Select crypt('Les sanglots longs des violons de l_automne', gen_salt('md5'));
```

Returns the following hash:

```console
              crypt
------------------------------------
 $1$/9ACBYOV$z52PAGjQ5WTU9xvEECBNv/   
```

Or, for example:

```console
select hmac('Les sanglots longs des violons de l_automne', 'md5', 'sha256');
```

returns the following hash:

```console
                                hmac
--------------------------------------------------------------------
 \xd4e4790b69d2cc8dbce3385ee63272bc7760f1603640bb211a7b864e695570c5
```

Or, for example, to store encrypted data like a password:

Let's assume my application stores secrets in the following table:

```console
create table mysecrets(USERid int, USERname char(255), USERpassword char(512));
```

And I encrypt their password when creating a user:

```console
insert into mysecrets values (1, 'Me', crypt('MySecretPasswrod', gen_salt('md5')));
```

Now, I see that my password is encrypted:

```console
select * from mysecrets;
```

Output:

- USERid: 1
- USERname: Me
- USERpassword: $1$Uc7jzZOp$NTfcGo7F10zGOkXOwjHy31

When I connect with my application and I pass a password, it will look up in the `mysecrets` table and will return the name of the user if there is a match between the password that is provided to the application and the passwords stored in the table. For example:

- I pass the wrong password:
   ```console
   select USERname from mysecrets where (USERpassword = crypt('WrongPassword', USERpassword));
   ```

   Output 

   ```returns
    USERname
   ---------
   (0 rows)
   ```
- I pass the correct password:

   ```console
   select USERname from mysecrets where (USERpassword = crypt('MySecretPasswrod', USERpassword));
   ``` 

   Output:

   ```output
    USERname
   ---------
   Me
   (1 row)
   ```

This small example demonstrates that you can encrypt data at rest (store encrypted data) in Azure Arc enabled PostgreSQL Hyperscale using the Postgres `pgcrypto` extension and your applications can use functions offered by `pgcrypto` to manipulate this encrypted data.

## User management
### General perspectives
You can use the standard Postgres way to  create users or roles. However, if you do so, these artifacts will only be available on the coordinator role. During preview, these users/roles will not yet be able to access data that is distributed outside the Coordinator node and on the Worker nodes of your server group. The reason is that in preview, the user definition is not replicated to the Worker nodes.

### Change the password of the _postgres_ administrative user
Azure Arc enabled PostgreSQL Hyperscale comes with the standard Postgres administrative user _postgres_ for which you set the password when you create your server group.
The general format of the command to change its password is:
```console
azdata arc postgres server edit --name <server group name> --admin-password
```

Where --admin-password is a boolean that relates to the presence of a value in the AZDATA_PASSWORD **session**'s environment variable.
If the AZDATA_PASSWORD **session**'s environment variable exists and has a value, running the above command will set the password of the postgres user to the value of this environment variable.

If the AZDATA_PASSWORD **session**'s environment variable exists but has not value or the AZDATA_PASSWORD **session**'s environment variable does not exist, running the above command will prompt the user to enter a password interactively

#### Changing the password of the postgres administrative user in an interactive way:
1. Delete the AZDATA_PASSWORD **session**'s environment variable or delete its value
2. Run the command:
   ```console
   azdata arc postgres server edit --name <server group name> --admin-password
   ```
   For example
   ```console
   azdata arc postgres server edit -n postgres01 --admin-password
   ```
   You will be prompted to enter the password and to confirm it:
   ```console
   Postgres Server password:
   Confirm Postgres Server password:
   ```
   As the password is being updated, the output of the command shows:
   ```console
   Updating password
   Updating postgres01 in namespace `arc`
   postgres01 is Ready
   ```
   
#### Changing the password of the postgres administrative user using the AZDATA_PASSWORD **session**'s environment variable:
1. Set the value of the AZDATA_PASSWORD **session**'s environment variable to what you want to password to be.
2. Run the  command:
   ```console
   azdata arc postgres server edit --name <server group name> --admin-password
   ```
   For example
   ```console
   azdata arc postgres server edit -n postgres01 --admin-password
   ```
   
   As the password is being updated, the output of the command shows:
   ```console
   Updating password
   Updating postgres01 in namespace `arc`
   postgres01 is Ready
   ```

> [!NOTE]
> To verify if the the AZDATA_PASSWORD session's environment variable exists and what value it has, run:
> - On a Linux client:
> ```console
> printenv AZDATA_PASSWORD
> ```
>
> - On a Windows client with PowerShell:
> ```console
> echo $env:AZDATA_PASSWORD
> ```



## Next steps
- Read details about the `pgcrypto` extension [here](https://www.postgresql.org/docs/current/pgcrypto.html).
- Read details about how to use Postgres extensions [here](using-extensions-in-postgresql-hyperscale-server-group.md).

