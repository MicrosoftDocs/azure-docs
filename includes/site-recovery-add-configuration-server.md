---
title: include file
description: include file
services: site-recovery
author: mayurigupta13
manager: rochakm
ms.service: site-recovery
ms.topic: include
ms.date: 02/28/2019
ms.author: mayg
ms.custom: include file

---

1. Run the Unified Setup installation file.
2. In **Before You Begin**, select **Install the configuration server and process server**.

	![Screenshot of the Before You Begin screen in Unified Setup.](./media/site-recovery-add-configuration-server/combined-wiz1.png)

3. In **Third Party Software License**, click **I Accept** to download and install MySQL.

    ![Screenshot of the Third Party Software License screen in Unified Setup.](./media/site-recovery-add-configuration-server/combined-wiz2.png)
4. In **Registration**, select the registration key you downloaded from the vault.

    ![Screenshot of the Registration screen in Unified Setup.](./media/site-recovery-add-configuration-server/combined-wiz3.png)
5. In **Internet Settings**, specify how the Provider running on the configuration server connects to Azure Site Recovery over the Internet. Make sure you've allowed the required URLs.

    - If you want to connect with the proxy that's currently set up on the machine, select **Connect to Azure Site Recovery using a proxy server**.
    - If you want the Provider to connect directly, select **Connect directly to Azure Site Recovery without a proxy server**.
    - If the existing proxy requires authentication, or if you want to use a custom proxy for the Provider connection, select **Connect with custom proxy settings**, and specify the address, port, and credentials.
     ![Screenshot of the Internet Settings screen in Unified Setup.](./media/site-recovery-add-configuration-server/combined-wiz4.png)
6. In **Prerequisites Check**, Setup runs a check to make sure that installation can run. If a warning appears about the **Global time sync check**, verify that the time on the system clock (**Date and Time** settings) is the same as the time zone.

    ![Screenshot of the Prerequisites Check screen in Unified Setup.](./media/site-recovery-add-configuration-server/combined-wiz5.png)
7. In **MySQL Configuration**, create credentials for logging on to the MySQL server instance that is installed.

    ![Screenshot of the MySQL Configuration screen in Unified Setup.](./media/site-recovery-add-configuration-server/combined-wiz6.png)
8. In **Environment Details**, select No if you're replicating Azure Stack VMs or physical servers. 
9. In **Install Location**, select where you want to install the binaries and store the cache. The drive you select must have at least 5 GB of disk space available, but we recommend a cache drive with at least 600 GB of free space.

    ![Screenshot of the Install Location screen in Unified Setup.](./media/site-recovery-add-configuration-server/combined-wiz8.png)
10. In **Network Selection**, first select the NIC that the in-built process server uses for discovery and push installation of mobility service on source machines, and then select the NIC that Configuration Server uses for connectivity with Azure. Port 9443 is the default port used for sending and receiving replication traffic, but you can modify this port number to suit your environment's requirements. In addition to the port 9443, we also open port 443, which is used by a web server to orchestrate replication operations. Do not use port 443 for sending or receiving replication traffic.

    ![Screenshot of the Network Selection screen in Unified Setup.](./media/site-recovery-add-configuration-server/combined-wiz9.png)


11. In **Summary**, review the information and click **Install**. When installation finishes, a passphrase is generated. You will need this when you enable replication, so copy it and keep it in a secure location.

	![Screenshot of the Summary screen in Unified Setup.](./media/site-recovery-add-configuration-server/combined-wiz10.png)

After registration finishes, the server is displayed on the **Settings** > **Servers** blade in the vault.
