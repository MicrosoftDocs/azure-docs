---
author: rothja
ms.service: virtual-machines-sql
ms.topic: include
ms.date: 10/26/2018
ms.author: jroth
---
1. While connected to the virtual machine with remote desktop, search for **Configuration Manager**:

    ![Open SSCM](./media/virtual-machines-sql-server-connection-tcp-protocol/sql-server-configuration-manager.png)

1. In SQL Server Configuration Manager, in the console pane, expand **SQL Server Network Configuration**.

1. In the console pane, click **Protocols for MSSQLSERVER** (the default instance name.) In the details pane, right-click **TCP** and click **Enable** if it is not already enabled.

    ![Enable TCP](./media/virtual-machines-sql-server-connection-tcp-protocol/enable-tcp.png)

1. In the console pane, click **SQL Server Services**. In the details pane, right-click **SQL Server (*instance name*)** (the default instance is **SQL Server (MSSQLSERVER)**), and then click **Restart**, to stop and restart the instance of SQL Server.

    ![Restart Database Engine](./media/virtual-machines-sql-server-connection-tcp-protocol/restart-sql-server.png)

1. Close SQL Server Configuration Manager.

For more information about enabling protocols for the SQL Server Database Engine, see [Enable or Disable a Server Network Protocol](https://msdn.microsoft.com/library/ms191294.aspx).
