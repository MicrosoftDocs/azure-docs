--- 
title: Configure security for your Azure Arc enabled PostgreSQL Hyperscale server group
description: Configure security for your Azure Arc enabled PostgreSQL Hyperscale server group
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: TheJY
ms.author: jeanyd
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Configure security for your Azure Arc enabled PostgreSQL Hyperscale server group

This document describes various aspects related to security of your server group:
- Encryption at rest
- User management

## Encryption at rest
There are two ways you can implement encryption at rest for your server group. You can implement either of them or combine them.

### Hardware: Linux host volume encryption
Implement system data encryption to secure any data that resides on the disks used by your Azure Arc enabled Data Services setup. You can read [here](https://wiki.archlinux.org/index.php/Data-at-rest_encryption), for example, more about the perspectives and solutions that you have in this area. Since Azure Arc enabled Data Services runs on the physical infrastructure that you provide, you are in charge of securing the infrastructure.

### Software: Use the PostgreSQL pgcrypto extension in your server group
In addition of encrypting the disks used to host your Azure Arc setup, you can configure your Azure Arc enabled PostgreSQL Hyperscale server group to expose mechanisms that your applications can use to encrypt data in your database(s). The pgcrypto extension is part of the contrib extensions of Postgres and is available in your Azure Arc enabled PostgreSQL Hyperscale server group. You find details about the pgcrypto extension [here](https://www.postgresql.org/docs/current/pgcrypto.html).
In summary, with the following commands, you enable the extension, you create it and you use it:

#### Enable the pgcrypto extension
This step is not needed because pgcrypto is part of contrib.

#### Create the pgcrypto extension
Connect to your server group with the client tool of your choice and run the standard PostgreSQL query:
```terminal
CREATE EXTENSION pgcrypto;
```

#### Verify List the extensions ready to use in your server group
You can verify that the pgcrypto extension is ready to use by listing the extensions available in your server group.
Connect to your server group with the client tool of your choice and run the standard PostgreSQL query:
```terminal
select * from pg_extension;
```
You should see pgcrypto if you enabled and created it with the commands indicated above.

#### Use the pgcrypto extension
Now you can adjust the code your applications so that they use any of the functions offered by pgcrypto:
- General hashing functions
- Password hashing functions
- PGP encryption functions
- Raw encryption functions
- Random-data functions

##### For example, to generate hash values. Run the command:
```terminal
Select crypt('Les sanglots longs des violons de l_automne', gen_salt('md5'));
```
returns the following hash:
```terminal
              crypt
------------------------------------
 $1$/9ACBYOV$z52PAGjQ5WTU9xvEECBNv/   
```

Or, for example:
```terminal
select hmac('Les sanglots longs des violons de l_automne', 'md5', 'sha256');
```
returns the following hash:
```terminal
                                hmac
--------------------------------------------------------------------
 \xd4e4790b69d2cc8dbce3385ee63272bc7760f1603640bb211a7b864e695570c5
```

##### Or, for example,  to store encrypted data like a password:

Let's assume my application stores secrets in the following table:
```terminal
create table mysecrets(USERid int, USERname char(255), USERpassword char(512));
```
And I encrypt their password when creating a user:
```terminal
insert into mysecrets values (1, 'Me', crypt('MySecretPasswrod', gen_salt('md5')));
```
Now, I see that my password is encrypted:
```terminal
select * from mysecrets;
```
Returns:
- USERid: 1
- USERname: Me
- USERpassword: $1$Uc7jzZOp$NTfcGo7F10zGOkXOwjHy31

When I connect with my application and I pass a password, it will look up in the mysecrets table and will return the name of the user if there is a match between the password that is provided to the application and the passwords stored in the table. For example:
- I pass the wrong password:
```terminal
select USERname from mysecrets where (USERpassword = crypt('WrongPassword', USERpassword));
```
Returns 
```terminal
 USERname
---------
(0 rows)
```
- I pass the correct password:
```terminal
select USERname from mysecrets where (USERpassword = crypt('MySecretPasswrod', USERpassword));
``` 
Returns:
```terminal
 USERname
---------
Me
(1 row)
```
This small example demonstrates that you can encrypt data at rest (store encrypted data) in Azure Arc enabled PostgreSQL Hyperscale using the Postgres pgcrypto extension and your applications can use functions offered by pgcrypto to manipulate this encrypted data.

#### What's next?
- Read details about the pgcrypto extension [here](https://www.postgresql.org/docs/current/pgcrypto.html).
- Read details about how to use Postgres extensions, read [here](using-extensions-in-postgresql-hyperscale-server-group.md).



## User management
Azure Arc enabled PostgreSQL Hyperscale comes with the standard Postgres administrative user _postgres_ for which you set the password when you deploy your server group.
It is not yet possible to change this password. This functionality comes soon. Updates will be posted here when it is available.

You can also use the standard Postgres way to  create users or roles. However, if you do so, these artifacts will only be available on the coordinator role. As such these users/roles will not yet be able to access data that is distributed outside the Coordinator node and on the Worker nodes of your server group. The reason is that the user definition is not yet replicated to the Worker nodes. This functionality comes soon. Updates will be posted here when it is available.
