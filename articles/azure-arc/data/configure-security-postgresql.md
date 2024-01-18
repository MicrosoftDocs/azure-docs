---
title: Configure security for your Azure Arc-enabled PostgreSQL server
description: Configure security for your Azure Arc-enabled PostgreSQL server
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: dhanmm
ms.author: dhmahaja
ms.reviewer: mikeray
ms.date: 11/03/2021
ms.topic: how-to
---

# Configure security for your Azure Arc-enabled PostgreSQL server

This document describes various aspects related to security of your server group:

- Encryption at rest
- Postgres roles and users management
   - General perspectives
   - Change the password of the _postgres_ administrative user
- Audit

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Encryption at rest

You can implement encryption at rest either by encrypting the disks on which you store your databases and/or by using database functions to encrypt the data you insert or update.

### Hardware: Linux host volume encryption

Implement system data encryption to secure any data that resides on the disks used by your Azure Arc-enabled Data Services setup. You can read more about this topic:

- [Data encryption at rest](https://wiki.archlinux.org/index.php/Data-at-rest_encryption) on Linux in general 
- Disk encryption with LUKS `cryptsetup` command (Linux)(https://www.cyberciti.biz/security/howto-linux-hard-disk-encryption-with-luks-cryptsetup-command/) specifically. Since Azure Arc-enabled Data Services runs on the physical infrastructure that you provide, you are in charge of securing the infrastructure.

### Software: Use the PostgreSQL `pgcrypto` extension in your server group

In addition of encrypting the disks used to host your Azure Arc setup, you can configure your Azure Arc-enabled PostgreSQL server to expose mechanisms that your applications can use to encrypt data in your database(s). The `pgcrypto` extension is part of the `contrib` extensions of Postgres and is available in your Azure Arc-enabled PostgreSQL server. You find details about the `pgcrypto` extension [here](https://www.postgresql.org/docs/current/pgcrypto.html).
In summary, with the following commands, you enable the extension, you create it and you use it:

#### Create the `pgcrypto` extension

Connect to your server group with the client tool of your choice and run the standard PostgreSQL query:

```console
CREATE EXTENSION pgcrypto;
```

> Find details [here](get-connection-endpoints-and-connection-strings-postgresql-server.md) about how to connect.

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
select crypt('Les sanglots longs des violons de l_automne', gen_salt('md5'));
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

Returns the following hash:

```console
                                hmac
--------------------------------------------------------------------
 \xd4e4790b69d2cc8dbce3385ee63272bc7760f1603640bb211a7b864e695570c5
```

Or, for example, to store encrypted data like a password:

- An application stores secrets in the following table:

   ```console
   create table mysecrets(USERid int, USERname char(255), USERpassword char(512));
   ```

- Encrypt their password when creating a user:

   ```console
   insert into mysecrets values (1, 'Me', crypt('MySecretPasswrod', gen_salt('md5')));
   ```

- Notice that the password is encrypted:

   ```console
   select * from mysecrets;
   ```

Output:

```output
- USERid: 1
- USERname: Me
- USERpassword: $1$Uc7jzZOp$NTfcGo7F10zGOkXOwjHy31
```

When you connect with the application and pass a password, it looks up in the `mysecrets` table and returns the name of the user if there is a match between the password that is provided to the application and the passwords stored in the table. For example:


- Pass the wrong password:
   
   ```console
   select USERname from mysecrets where (USERpassword = crypt('WrongPassword', USERpassword));
   ```

   Output 

   ```output
    USERname
   ---------
   (0 rows)
   ```

- Pass the correct password:

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

This small example demonstrates that you can encrypt data at rest (store encrypted data) in Azure Arc-enabled PostgreSQL server using the Postgres `pgcrypto` extension and your applications can use functions offered by `pgcrypto` to manipulate this encrypted data.

## Postgres roles and users management

### General perspectives

To configure roles and users in your Azure Arc-enabled PostgreSQL server, use the standard Postgres way to manage roles and users. For more details, read [here](https://www.postgresql.org/docs/12/user-manag.html). 

## Audit

For audit scenarios please configure your server group to use the `pgaudit` extensions of Postgres. For more details about `pgaudit` see [`pgAudit` GitHub project](https://github.com/pgaudit/pgaudit/blob/master/README.md). To enable the `pgaudit` extension in your server group read [Use PostgreSQL extensions](using-extensions-in-postgresql-server.md).

## Use SSL connection

SSL is required for client connections. In connection string, the SSL mode parameter should not be disabled. [Form connection strings](get-connection-endpoints-and-connection-strings-postgresql-server.md#form-connection-strings).

## Related content
- See [`pgcrypto` extension](https://www.postgresql.org/docs/current/pgcrypto.html)
- See [Use PostgreSQL extensions](using-extensions-in-postgresql-server.md)
