---
title: Step 4: Create a User | Microsoft Docs
description: Get Started Tutorial with Azure SQL Data Warehouse.
services: sql-data-warehouse
documentationcenter: NA
author: hirokib
manager: johnmac
editor: 'barbkess'

ms.assetid: 34BADEE6-9846-4121-9979-ECA0A419B2E3
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: hero-article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.date: 12/21/2016
ms.author: elbutter

---
# Step 4: Create a User for SQL Data Warehouse

## Why create a separate user?

We will use the connection to the SQL Server (logical server) with server credentials from the previous step 
to create a new user for our SQL Data Warehouse. There are two primary reasons why you may want to create a separate 
user/login for your SQL DW.

1.  Your organization’s users should use a different account to authenticate. 
This way you can limit the permissions granted to the application and reduce 
the risks of malicious activity in case your application code is vulnerable to a SQL injection attack.

2. By default, the server administrator login that you're currently connected with uses a smaller 
resource class. Resource classes help you control memory allocation and CPU cycles given to a query. 
Users in **smallrc** are given a smaller amount of memory and can take advantage of higher concurrency. 
In contrast, users assigned to **xlargerc** are given large amounts of memory, and therefore fewer of their queries can run concurrently. 
For loading data in a way that best optimizes compression, you want to make sure the user loading data 
is part of a larger resource class. Read more about resource classes [here](./sql-data-warehouse-develop-concurrency.md#resource-classes):

## Creating a user of a larger resource class

1. Create a new query on the **master** database of your server

![New Query on Master](./media/sql-data-warehouse-get-started-tutorial/query-on-server.png)

![New Query on Master1](./media/sql-data-warehouse-get-started-tutorial/query-on-master.png)

2. Create a server login and user

```sql
CREATE LOGIN XLRCLOGIN WITH PASSWORD = 'a123reallySTRONGpassword!';
CREATE USER LoadingUser FOR LOGIN XLRCLOGIN;
```

3. Create a new database user based on the server login
```sql
CREATE USER LoadingUser FOR LOGIN XLRCLOGIN;
```

4. Grant user DB control
```sql
GRANT CONTROL ON DATABASE::[NYT] to LoadingUser;
```
> [!NOTE]
> If your database name has hyphens in it, be sure to wrap it in brackets! 
>

5. Add your database user to the **xlargerc** resource class role
```sql
EXEC sp_addrolememeber 'xlargerc', 'LoadingUser';
```

6. Log in to your database with your new credentials

![Log in With New Login](./media/sql-data-warehouse-get-started-tutorial/new-login.png)

