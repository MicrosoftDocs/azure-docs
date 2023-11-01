---
title: Connection libraries - Azure Database for MySQL
description: This article lists each library or driver that client programs can use when connecting to Azure Database for MySQL.
ms.service: mysql
ms.subservice: single-server
ms.topic: conceptual
author: SudheeshGH
ms.author: sunaray
ms.date: 06/20/2022
---

# Connection libraries for Azure Database for MySQL

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article lists each library or driver that client programs can use when connecting to Azure Database for MySQL.

## Client interfaces
MySQL offers standard database driver connectivity for using MySQL with applications and tools that are compatible with industry standards ODBC and JDBC. Any system that works with ODBC or JDBC can use MySQL.

| **Language** | **Platform** | **Additional Resource** | **Download** |
| :----------- | :------------| :-----------------------| :------------|
| PHP | Windows, Linux | [MySQL native driver for PHP - mysqlnd](https://dev.mysql.com/downloads/connector/php-mysqlnd/) | [Download](https://secure.php.net/downloads.php) |
| ODBC | Windows, Linux, macOS X, and Unix platforms | [MySQL Connector/ODBC Developer Guide](https://dev.mysql.com/doc/connector-odbc/en/) | [Download](https://dev.mysql.com/downloads/connector/odbc/) |
| ADO.NET | Windows | [MySQL Connector/Net Developer Guide](https://dev.mysql.com/doc/connector-net/en/) | [Download](https://dev.mysql.com/downloads/connector/net/) |
| JDBC | Platform independent | [MySQL Connector/J 8.1 Developer Guide](https://dev.mysql.com/doc/connector-j/8.1/en/) | [Download](https://dev.mysql.com/downloads/connector/j/) |
| Node.js | Windows, Linux, macOS X | [sidorares/node-mysql2](https://github.com/sidorares/node-mysql2/tree/master/documentation) | [Download](https://github.com/sidorares/node-mysql2) |
| Python | Windows, Linux, macOS X | [MySQL Connector/Python Developer Guide](https://dev.mysql.com/doc/connector-python/en/) | [Download](https://dev.mysql.com/downloads/connector/python/) |
| C++ | Windows, Linux, macOS X | [MySQL Connector/C++ Developer Guide](https://dev.mysql.com/doc/connector-cpp/en/) | [Download](https://dev.mysql.com/downloads/connector/python/) |
| C | Windows, Linux, macOS X | [MySQL Connector/C Developer Guide](https://dev.mysql.com/doc/c-api/8.0/en/) | [Download](https://dev.mysql.com/downloads/connector/c/)
| Perl | Windows, Linux, macOS X, and Unix platforms | [DBD::MySQL](https://metacpan.org/pod/DBD::mysql) | [Download](https://metacpan.org/pod/DBD::mysql) |


## Next steps
Read these quickstarts on how to connect to and query Azure Database for MySQL by using your language of choice:

- [PHP](./connect-php.md)
- [Java](./connect-java.md)
- [.NET (C#)](./connect-csharp.md)
- [Python](./connect-python.md)
- [Node.JS](./connect-nodejs.md)
- [Ruby](./connect-ruby.md)
- [C++](connect-cpp.md)
- [Go](./connect-go.md)
