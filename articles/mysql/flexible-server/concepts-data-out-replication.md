---
title: Data-out replication - Azure Database for MySQL - Flexible Server
description: Learn about the concepts of data-out replication out of Azure Database for MySQL - Flexible Server to another MySQL server
author: VandhanaMehta
ms.author: vamehta
ms.reviewer: maghan
ms.date: 12/30/2022
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Replicate data from Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Data-out replication allows you to synchronize data out of a Azure Database for MySQL flexible server to another MySQL server using MySQL native replication. The MySQL server (replica) can be on-premises, in virtual machines, or a database service hosted by other cloud providers. While [Data-in replication](concepts-data-in-replication.md) helps to move data into an Azure Database for MySQL flexible server (replica), Data-out replication would allow you to transfer data out of an Azure Database for MySQL flexible server (Primary). With Data-out replication, the binary log (binlog) is made community consumable allowing the an Azure Database for MySQL flexible server to act as a Primary server for the external replicas. To learn more about binlog replication, see the [MySQL binlog replication overview](https://dev.mysql.com/doc/refman/5.7/en/binlog-replication-configuration-overview.html).

> [!NOTE]  
> Data-out replication is not supported on Azure Database for MySQL - Flexible Server, which has Azure authentication configured.

The main scenarios to consider about using Data-out replication are:

- **Hybrid Data Synchronization:** Data-out replication can be used to keep the data synchronized between Azure Database for MySQL - Flexible Server and on-premises servers. This method will help to integrate seamlessly between cloud and on-premises systems in a hybrid solution. This solution can also be useful if you want to avoid vendor lock-in.

- **Multi-Cloud Synchronization:** For complex cloud solutions, use Data-out replication to synchronize data between Azure Database for MySQL - Flexible Server and different cloud providers, including virtual machines and database services hosted in those clouds.

- **Migration:** Customers can do Minimal Time migration using open-source tools such as MyDumper/MyLoader with Data-out replication to migrate data out Azure MySQL Flexible server.

## Limitations and considerations

<a name='azure-ad-isnt-supported'></a>

### Microsoft Entra ID isn't supported

Data-out replication isn't supported on Azure Database for MySQL - Flexible Server, which has Azure authentication configured. Any Microsoft Entra transaction (Microsoft Entra user create/update) on the source server will break data-out replication.

> [!TIP]  
> Use guidance published here - MySQL :: MySQL Replication :: 2.7.3 Skipping Transactions to skip past an event or events by issuing a CHANGE MASTER TO statement to move the source's binary log position forward. Restart replication posts the action.

### Filter

You must use the replication filter to filter out Azure custom tables on the replica server. This can be achieved by setting Replicate_Wild_Ignore_Table = "mysql.\_\_%" to filter the Azure MySQL internal tables on the replica. To modify this parameter from the Azure portal, navigate to Azure Database for MySQL - Flexible Server and select "Server parameters" to view/edit the Replicate_Wild_Ignore_Table parameter.

Refer to the following general guidance on the replication filter in MySQL manual:
- MySQL 5.7 Reference Manual - [13.4.2.2 CHANGE REPLICATION FILTER Statement](https://dev.mysql.com/doc/refman/5.7/en/change-replication-filter.html)
- MySQL 5.7 Reference Manual - [16.1.6.3 Replica Server Options and Variables](https://dev.mysql.com/doc/refman/5.7/en/replication-options-replica.html#option_mysqld_replicate-wild-ignore-table)
- MySQL 8.0 Reference Manual - [17.2.5.4 Replication Channel Based Filters](https://dev.mysql.com/doc/refman/8.0/en/replication-rules-channel-based-filters.html)

## Next steps

- How to configure [Data-out replication](how-to-data-out-replication.md)
- Learn about [Data-in replication](concepts-data-in-replication.md)
- How to configure [Data-in replication](how-to-data-in-replication.md)
