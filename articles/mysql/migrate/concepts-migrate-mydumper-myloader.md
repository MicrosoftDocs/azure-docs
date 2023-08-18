---
title: Migrate large databases to Azure Database for MySQL using mydumper/myloader
description: This article explains two common ways to back up and restore databases in your Azure Database for MySQL, using tool mydumper/myloader
author: SudheeshGH
ms.author: sunaray
ms.service: mysql
ms.subservice: single-server
ms.custom: devx-track-linux
ms.topic: conceptual
ms.date: 05/03/2023
---

# Migrate large databases to Azure Database for MySQL using mydumper/myloader

[!INCLUDE[applies-to-mysql-single-flexible-server](../includes/applies-to-mysql-single-flexible-server.md)]

Azure Database for MySQL is a managed service that you use to run, manage, and scale highly available MySQL databases in the cloud. To migrate MySQL databases larger than 1 TB to Azure Database for MySQL, consider using community tools such as [mydumper/myloader](https://centminmod.com/mydumper.html), which provide the following benefits:

* Parallelism, to help reduce the migration time.
* Better performance, by avoiding expensive character set conversion routines.
* An output format, with separate files for tables, metadata etc., that makes it easy to view/parse data. Consistency, by maintaining snapshot across all threads.
* Accurate primary and replica log positions.
* Easy management, as they support Perl Compatible Regular Expressions (PCRE) for specifying database and tables inclusions and exclusions.
* Schema and data goes together. Don't need to handle it separately like other logical migration tools.

This quickstart shows you how to install, back up, and restore a MySQL database by using mydumper/myloader.

## Prerequisites

Before you begin migrating your MySQL database, you need to:

1. Create an Azure Database for MySQL server by using the [Azure portal](../flexible-server/quickstart-create-server-portal.md).

2. Create an Azure VM running Linux by using the [Azure portal](../../virtual-machines/linux/quick-create-portal.md) (preferably Ubuntu).
    > [!Note]
    > Prior to installing the tools, consider the following points:
    >
    > * If your source is on-premises and has a high bandwidth connection to Azure (using ExpressRoute), consider installing the tool on an Azure VM.<br> 
    > * If you have a challenge in the bandwidth between the source and target, consider installing mydumper near the source and myloader near the target server. You can use tools **[Azcopy](../../storage/common/storage-use-azcopy-v10.md)** to move the data from on-premises or other cloud solutions to Azure.

3. Install mysql client, do the following steps:

4. 

    * Update the package index on the Azure VM running Linux by running the following command:
        ```bash
        sudo apt update
        ```
    * Install the mysql client package by running the following command:
        ```bash
        sudo apt install mysql-client
        ```

## Install mydumper/myloader

To install mydumper/myloader, do the following steps.

1. Depending on your OS distribution, download the appropriate package for mydumper/myloader, running the following command:

    ```bash
    wget https://github.com/maxbube/mydumper/releases/download/v0.10.1/mydumper_0.10.1-2.$(lsb_release -cs)_amd64.deb
    ```

    > [!Note]
    > $(lsb_release -cs) helps to identify your distribution.

3. To install the .deb package for mydumper, run the following command:

    ```bash
    sudo dpkg -i mydumper_0.10.1-2.$(lsb_release -cs)_amd64.deb
    ```

    > [!Tip]
    > The command you use to install the package will differ based on the Linux distribution you have as the installers are different. The mydumper/myloader is available for following distributions Fedora, RedHat , Ubuntu, Debian, CentOS , openSUSE and MacOSX. For more information, see **[How to install mydumper](https://github.com/maxbube/mydumper#how-to-install-mydumpermyloader)**

## Create a backup using mydumper

* To create a backup using mydumper, run the following command:

    ```bash
    mydumper --host=<servername> --user=<username> --password=<Password> --outputdir=./backup --rows=100000 --compress --build-empty-files --threads=16 --compress-protocol --trx-consistency-only --ssl  --regex '^(<Db_name>\.)' -L mydumper-logs.txt
    ```

This command uses the following variables:

* **--host:** The host to connect to
* **--user:** Username with the necessary privileges 
* **--password:** User password
* **--rows:** Try to split tables into chunks of this many rows
* **--outputdir:** Directory to dump output files to
* **--regex:** Regular expression for Database matching.
* **--trx-consistency-only:** Transactional consistency only
* **--threads:** Number of threads to use, default 4. Recommended a use a value equal to 2x of the vCore of the computer.

    >[!Note] 
    >For more information on other options, you can use with mydumper, run the following command:
    **mydumper --help** . For more details see, [mydumper\myloader documentation](https://centminmod.com/mydumper.html)<br>
    >To dump multiple databases in parallel, you can modify regex variable as shown in the example:  **regex ’^(DbName1\.|DbName2\.)**

## Restore your database using myloader

* To restore the database that you backed up using mydumper, run the following command:

    ```bash
    myloader --host=<servername> --user=<username> --password=<Password> --directory=./backup --queries-per-transaction=500 --threads=16 --compress-protocol --ssl --verbose=3 -e 2>myloader-logs.txt
    ```

This command uses the following variables:

* **--host:** The host to connect to
* **--user:** Username with the necessary privileges 
* **--password:** User password
* **--directory:** Location where the backup is stored. 
* **--queries-per-transaction:** Recommend setting to value not more than 500
* **--threads:** Number of threads to use, default 4. Recommended a use a value equal to 2x of the vCore of the computer

> [!Tip]
> For more information on other options you can use with myloader, run the following command:
**myloader --help**

After the database is restored, it’s always recommended to validate the data consistency between the source and the target databases.

> [!Note]
> Submit any issues or feedback regarding the mydumper/myloader tools **[here](https://github.com/maxbube/mydumper/issues)**.

## Next steps

* Learn more about the [mydumper/myloader project in GitHub](https://github.com/maxbube/mydumper).
* Learn [how to migrate large MySQL databases](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/best-practices-for-migrating-large-databases-to-azure-database/ba-p/1362699).
* [Minimal Downtime Migration of Azure Database for MySQL – Single Server to Azure Database for MySQL – Flexible Server](../migrate/how-to-migrate-single-flexible-minimum-downtime.md)
* Learn more about Data-in replication  [Replicate data into Azure Database for MySQL Flexible Server](../flexible-server/concepts-data-in-replication.md) and [Configure Azure Database for MySQL Flexible Server Data-in replication](../flexible-server/how-to-data-in-replication.md)
* Commonly encountered [migration errors](../single-server/how-to-troubleshoot-common-errors.md)
