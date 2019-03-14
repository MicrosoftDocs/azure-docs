---
title: Install TmaxSoft OpenFrame on Azure | Microsoft Docs
description: Rehost your IBM z/OS mainframe workloads using TmaxSoft OpenFrame environment on Azure virtual machines (VMs).
services: virtual-machines-linux
documentationcenter:
author: njray
manager: edprice
editor: edprice
tags:
keywords:
---

# PLACEHOLDER - Install TmaxSoft OpenFrame on Azure

This document explains how to set up an OpenFrame environment on Azure suitable for development, demos, testing, or production workloads. As Figure 1 shows, OpenFrame includes multiple components that create the mainframe emulation environment on Azure. For example, OpenFrame online services replace the mainframe middleware such as IBM Customer Information Control System (CICS), and OpenFrame Batch, with its TJES component, replaces the IBM mainframe’s Job Entry Subsystem (JES).

OpenFrame works with any relational database, including Oracle Database, Microsoft SQL Server, IBM Db2, and MySQL. This installation of OpenFrame uses the TmaxSoft Tibero relational database. Both OpenFrame and Tibero run on a Linux operating system. This deployment installs CentOS 7.3, although you can use other supported Linux distributions, and it installs the OpenFrame application server and the Tibero database on one virtual machine (VM).

Certain components must be installed separately. The tutorial steps you through the installation of the following components of the OpenFrame suite:

**Main components**
- Required installation packages.
- Tibero database.
- Open Database Connectivity (ODBC) is used by applications in OpenFrame to communicate with the Tibero database.
- OpenFrame Base, the middleware that manages the entire system.
- OpenFrame Batch, the solution that replaces the mainframe’s batch systems.
- TACF, a service module that controls user access to systems and resources.
- ProSort, a sort tool for batch transactions.
- OFCOBOL, a compiler that interprets the mainframe’s COBOL programs.
- OFASM, a compiler that interprets the mainframe’s assembler programs.
- OpenFrame Server Type C (OSC ), the solution that replaces the mainframe’s middleware and IBM CICS.
- Java Enterprise User Solution (JEUS ), a web application server that is certified for Java Enterprise Edition 6.
- OFGW, the OpenFrame gateway component that provides a 3270 listener.
- OFManager, a solution that provides OpenFrame’s operation and management functions in the web environment.

**Other required components**
- OSI, the solution that replaces the mainframe middleware and IMS DC.

- TJES, the solution that provides the mainframe’s JES environment.
- OFTSAM, the solution that enables (V)SAM files to be used in the open system.
- OFHiDB, the solution that replaces the mainframe’s IMS DB.
- OFPLI, a compiler that interprets the mainframe’s PL/I programs.
- PROTRIEVE, a solution that executes the mainframe language CA-Easytrieve.
- OFMiner, a solution that analyzes the mainframes assets and then migrates them to Azure.

## Architecture

The following figure provides an overview of the OpenFrame 7.0 architectural components installed in this tutorial:

![OpenFrame components](media/93b80eaa92ca65f08a421bddaff48f94.png)

## Azure system requirements

The following table lists the requirements for the installation on Azure.
<!-- markdownlint-disable MD033 -->

<table>
<thead>
    <tr><th>Requirement</th><th>Description</th></tr>
</thead>
<tbody>
<tr><td>Supported Linux distributions on Azure
</td>
<td>
Linux x86 2.6 (32-bit, 64-bit)<br/>
Red Hat 7.x<br/>
CentOS 7.x<br/>
</td>
</tr>
<tr><td>Hardware
</td>
<td>Cores: 2 (minimum)<br/>
Memory: 4 GB (minimum)<br/>
Swap space: 1 GB (minimum)<br/>
Hard disk: 100 GB (minimum)<br/>
</td>
</tr>
<tr><td>Optional software for Windows users
</td>
<td>PuTTY: Used in this guide to configure VM features<br/>
WinSCP: A popular SFTP client and FTP client you can use<br/>
Eclipse for Windows: A development platform supported by TmaxSoft<br/>
(Microsoft Visual Studio is not supported at this time)
</td>
</tr>
</tbody>
</table>

<!-- markdownlint-enable MD033 -->

## Prerequisites

Plan on spending a few days to assemble all the required software and complete all the manual processes.

Before getting started, do the following:

- Get the OpenFrame installation media from TmaxSoft. If you are an existing TmaxSoft customer, contact your TmaxSoft representative for a licensed copy. Otherwise, request a trial version from [TmaxSoft](http://www.tmaxsoft.com/contact/).

- Request the OpenFrame documentation by sending email to <support@tmaxsoft.com>.

- Get an Azure subscription if you don't already have one. You can also create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- Optional. Set up a site-to-site VPN tunnel or a jumpbox that restricts access to the Azure VM to the permitted users in your organization. This step is not required, but it is a best practice.

## Set up a VM on Azure for OpenFrame and Tibero

You can set up the OpenFrame environment using various deployment patterns, but the following procedure shows how to deploy the OpenFrame application server and the Tibero database on one VM. In larger environments and for sizeable workloads, a best practice is to deploy the database separately on its own VM for better performance.

**To create a VM**

1.  Go to the Azure portal at <http://portal.azure.com> and sign in to your account.

2.  Click **Virtual machines**.

     [./media/image3.png](./media/image3.png)

1.  Click **Add**.

![](media/5f527a489f0e13538d6a04dbb075c4ba.png)

1.  To the right of **Operating Systems**, click **More**.

![](media/dae625ac4844c9a7b3c9cd7f9c581e2e.png)

1.  Click **CentOS-based 7.3** to follow this walk-through exactly, or you can choose another supported Linux distribution.

     [./media/image6.png](./media/image6.png)

1.  In the **Basics** settings, enter **Name**, **User name**, **Authentication type**, **Subscription** (Pay-As-You-Go is the AWS style of payment), and **Resource group** (use an existing one or create a TmaxSoft group).

2.  When complete (including the public/private key pair for **Authentication type**), click **Submit**.
> [!NOTE]
> If using an SSH public key for **Authentication type**, see the steps in the next section to generate the public/private key pair, then resume the steps here.

     [./media/image7.png](./media/image7.png)

### Generate a public/private key pair

If you are using a Windows operating system, you need PuTTYgen to generate a public/private key pair.

The public key can be freely shared, but the private key should be kept entirely secret and should never be shared with another party. After generating the keys, you must paste the **SSH public key** into the configuration—in effect, uploading it to the Linux VM. It is stored inside authorized\_keys within the \~/.ssh directory of the user account’s home directory. The Linux VM is then
able to recognize and validate the connection once you provide the associated **SSH private key** in the SSH client (in our case, PuTTY).

When giving new individuals access the VM: 

- Each new individual generates their own public/private keys using PuTTYgen.
- Individuals store their own private keys separately and send the public key information to the administrator of the VM.
- The administrator pastes the contents of the public key to the \~/.ssh/authorized\_keys file.
- The new individual connects via PuTTY.

**To generate a public/private key pair**

1.  Download PuTTYgen from <https://www.putty.org/> and install it using all the default settings.

2.  To open PuTTYgen, locate the PuTTY installation directory in C:\\Program Files\\PuTTY.

     [./media/image8.png](./media/image8.png)

3.  Click **Generate**.

     [./media/image9.png](./media/image9.png)

4.  After generation, save both the public key and private key. Paste the contents of the public key in the **SSH public key** section of the **Create virtual machine \> Basics** pane (shown in steps 6 and 7 in the previous section).

     [./media/image10.png](./media/image10.png)

### Configure VM features

1. In Azure portal, in the **Choose a size** blade, choose the Linux machine hardware settings you want. The *minimum* requirements for installing both Tibero and OpenFrame are 2 CPUs and 4 GB RAM as shown in this example installation:

     [./media/image11.png](./media/image11.png)

2. To configure the optional features, on the **Settings** pane, use the default settings.

     [./media/image12.png](./media/image12.png)

3. Review your payment details.

     [./media/image13.png](./media/image13.png)

4. Submit your selections. Azure begins to deploy the VM. This process typically takes a few minutes.

     [./media/image14.png](./media/image14.png)

5. When the VM is deployed, its dashboard is displayed, showing all the settings that were selected during the configuration. Make a note of the **Public IP address**.

     [./media/image15.png](./media/image15.png)

6. Open PuTTY.

7. For **Host Name**, type your username and the public IP address you copied. For example, **username\@publicip**.

     [./media/image16.png](./media/image16.png)

8. In the **Category** box, click **Connection \> SSH \> Auth**. Provide the path to your **private key** file.

     [./media/image17.png](./media/image17.png)

9. Click **Open** to launch the PuTTY window. If successful, you are connected to your new CentOS VM running on Azure.

10. To log on as root user, type **sudo bash**.

     [./media/image18.png](./media/image18.png)

## Set up the environment and packages

Now that the VM is created and you are logged on, you must perform a few setup steps and install the required preinstallation packages.

1. Map the name **ofdemo** to the local IP address by using vi to edit the hosts file (`vi /etc/hosts`). Assuming our IP is 192.168.96.148 ofdemo, this is before the change:

```vi
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4 
::1              localhost localhost.localdomain localhost6 localhost6.localdomain 
<IP Address>    <your hostname>
```

     This is after the change:

```vi
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4 
::1              localhost localhost.localdomain localhost6 localhost6.localdomain 
192.168.96.148   ofdemo
```

2. Create groups and users:

```vi
[root@ofdemo ~]# adduser -d /home/oframe7 oframe7 
[root@ofdemo ~]# passwd oframe7
```

3. Change the password for user oframe7:

```vi
New password: 
Retype new password: 
passwd: all authentication tokens updated successfully.
```

4. Update the kernel parameters in /etc/sysctl.conf:

```vi
[root@ofdemo ~]# vi /etc/sysctl.conf
kernel.shmall = 7294967296 
kernel.sem = 10000 32000 10000 10000
```

5. Refresh the kernel parameters dynamically without reboot:

```vi
[root@ofdemo ~]# /sbin/sysctl -p
```

6. Install the required packages. Make sure the server is connected to the Internet, download the following packages, and then install them:

-   dos2unix
-   glibc
-   glibc.i686 glibc.x86\_64
-   libaio
-   ncurses (Note: After installing the ncurses package, create the following symbolic link:
```
ln -s /usr/lib64/libncurses.so.5.9 /usr/lib/libtermcap.so
ln -s /usr/lib64/libncurses.so.5.9 /usr/lib/libtermcap.so.2
```
-   gcc
-   gcc-c++
-   libaio-devel.x86\_64
-   strace
-   ltrace
-   gdb

**In case of Java RPM installation**
Do the following:
```
root@ofdemo ~]# rpm -ivh jdk-7u79-linux-x64.rpm 
[root@ofdemo ~]# vi .bash_profile

# JAVA ENV
export JAVA_HOME=/usr/java/jdk1.7.0_79/ 
export PATH=$JAVA_HOME/bin:$PATH 
export CLASSPATH=$CLASSPATH:$JAVA_HOME/jre/lib/ext:$JAVA_HOME/lib/tools.jar

[root@ofdemo ~]# source /etc/profile 
[root@ofdemo ~]# java –version

java version "1.7.0_79" 
Java(TM) SE Runtime Environment (build 1.7.0_79-b15) 
Java HotSpot(TM) 64-Bit Server VM (build 24.79-b02, mixed mode)

[root@ofdemo ~]# echo $JAVA_HOME /usr/java/jdk1.7.0_79/
```

## Install the Tibero database

Tibero provides the several key functions in the OpenFrame environment on Azure:

-   Tibero is used as the OpenFrame internal data store for various system functions.

-   VSAM files, including KSDS, RRDS, and ESDS, use the Tibero database internally for data storage.

-   The TACF data repository is stored in Tibero.

-   The OpenFrame catalog information is stored in Tibero.

-   The Tibero database can be used as a replacement for IBM Db2 to store application data.

**To install Tibero**

1. Verify that the Tibero binary installer file is present and review the version number.
1. Copy the Tibero software to the Tibero user account (oframe):
```
[oframe7@ofdemo ~]$ tar -xzvf tibero6-bin-6_rel_FS04-linux64-121793-opt-tested.tar.gz 
[oframe7@ofdemo ~]$ mv license.xml /opt/tmaxdb/tibero6/license/ 
[oframe7@ofdemo ~]$ vi .bash_profile
```
1. Paste the following into .bash\_profile:
```
# Tibero6 ENV
export TB_HOME=/opt/tmaxdb/tibero6 
export TB_SID=TVSAM export TB_PROF_DIR=$TB_HOME/bin/prof 
export LD_LIBRARY_PATH=$TB_HOME/lib:$TB_HOME/client/lib:$LD_LIBRARY_PATH 
export PATH=$TB_HOME/bin:$TB_HOME/client/bin:$PATH
```
1. Execute:
```
[oframe7@ofdemo ~]$ source .bash_profile
```
1. Generate and modify the tip file (a configuration file for Tibero):
```
[oframe7@ofdemo ~]$ sh $TB_HOME/config/gen_tip.sh
[oframe7@ofdemo ~]$ vi $TB_HOME/config/$TB_SID.tip
```
1. Modify \$TB\_HOME/client/config/tbdsn.tbr and put 127.0.0.1 instead oflocalhost as shown:
```
TVSAM=( 
(INSTANCE=(HOST=127.0.0.1) 
(PT=8629) 
(DB_NAME=TVSAM) 
    	) 
	)
```
1. Create the database. The following output appears:
```
Change core dump dir to /opt/tmaxdb/tibero6/bin/prof. 
Listener port = 8629
Tibero 6
TmaxData Corporation Copyright (c) 2008-. All rights reserved. 
Tibero instance started up (NOMOUNT mode).
 /--------------------- newmount sql ------------------------/ 
create database character set MSWIN949 national character set UTF16; 
/-----------------------------------------------------------/
Database created.
Change core dump dir to /opt/tmaxdb/tibero6/bin/prof. 
Listener port = 8629
Tibero 6
TmaxData Corporation Copyright (c) 2008-. All rights reserved. 
Tibero instance started up (NORMAL mode). 
/opt/tmaxdb/tibero6/bin/tbsvr 
………………………..
Creating agent table... 
Done. 
For details, check /opt/tmaxdb/tibero6/instance/TVSAM/log/system_init.log.
************************************************** 
* Tibero Database TVSAM is created successfully on Fri Aug 12 19:10:43 UTC 2016. 
*     Tibero home directory ($TB_HOME) = 
*         /opt/tmaxdb/tibero6 
*     Tibero service ID ($TB_SID) = TVSAM 
*     Tibero binary path = 
*         /opt/tmaxdb/tibero6/bin:/opt/tmaxdb/tibero6/client/bin 
*     Initialization parameter file = 
*         /opt/tmaxdb/tibero6/config/TVSAM.tip 
* 
* Make sure that you always set up environment variables $TB_HOME and 
* $TB_SID properly before you run Tibero.
 ******************************************************************************

1. To recycle Tibero, first shut it down: 
```
[oframe7@ofdemo ~]$$ tbdown 
Tibero instance terminated (NORMAL mode).
```

1. Now boot Tibero:
```
[oframe7@ofdemo ~]$ tbboot 
Change core dump dir to /opt/tmaxdb/tibero6/bin/prof. Listener port = 8629

Tibero 6  
TmaxData Corporation Copyright (c) 2008-. All rights reserved. 
Tibero instance started up (NORMAL mode).
```

1. To create a tablespace, access the database using SYS user (sys/tmax), then create the necessary tablespace for the default volume and TACF:
```
[oframe7@ofdemo ~]$ tbsql tibero/tmax
tbSQL 6  
TmaxData Corporation Copyright (c) 2008-. All rights reserved.
Connected to Tibero.
```
1. Now type the following SQL commands:
```SQL> create tablespace "DEFVOL" datafile 'DEFVOL.dbf' size 500M autoextend on; create tablespace "TACF00" datafile 'TACF00.dbf' size 500M autoextend on; create tablespace "OFM_REPOSITORY" datafile 'ofm_repository.dbf' size 300M autoextend on;
SQL> Tablespace 'DEFVOL' created.
SQL> Tablespace 'TACF00' created.
SQL> Tablespace ' OFM_REPOSITORY ' created.
SQL> SQL> Disconnected.
```
1. Boot Tibero and verify that the Tibero processes are running:
```
[oframe7@ofdemo ~]$ tbboot 
ps -ef | egrep tbsvr
```

Output:

[Tibero output](./media/tibero_01.png)

## Install ODBC

Applications in OpenFrame communicate with the Tibero database using the ODBC
API provided by the open-source unixODBC project.

To install ODBC:

1.  Verify that the unixODBC-2.3.4.tar.gz installer file is present, or use the `wget unixODBC-2.3.4.tar.gz` command:
```
[oframe7\@ofdemo \~]\$ wget
ftp://ftp.unixodbc.org/pub/unixODBC/unixODBC-2.3.4.tar.gz
```
2.  Unzip the binary:
```
[oframe7\@ofdemo \~]\$ tar -zxvf unixODBC-2.3.4.tar.gz
```

3.  Navigate to unixODBC-2.3.4 directory and generate the Makefile by using the checking machine information:

[oframe7\@ofdemo unixODBC-2.3.4]\$ ./configure --prefix=/opt/tmaxapp/unixODBC/
--sysconfdir=/opt/tmaxapp/unixODBC/etc

> [!NOTE]
> By default, unixODBC is installed in /usr /local. To change the location, add `--prefix=/opt/tmaxapp/unixODBC/`
> In addition, configuration files are installed in /etc by default. To change the location, add `-- sysconfdir=/opt/tmaxapp/unixODBC/etc`

4.  Execute Makefile: `[oframe7@ofdemo unixODBC-2.3.4]$ make`

5.  Copy the executable file in the program directory after compiling: `[oframe7@ofdemo unixODBC-2.3.4]$ make install`

6.  Use vi to edit the bash profile and add the following:
```
[oframe7@ofdemo unixODBC-2.3.4]$ vi ~/.bash_profile

# UNIX ODBC ENV 
export ODBC_HOME=$HOME/unixODBC 
export PATH=$ODBC_HOME/bin:$PATH 
export LD_LIBRARY_PATH=$ODBC_HOME/lib:$LD_LIBRARY_PATH 
export ODBCINI=$HOME/unixODBC/etc/odbc.ini 
export ODBCSYSINI=$HOME
```
7.  Apply the ODBC. Edit the following files accordingly:
```
[oframe7@ofdemo unixODBC-2.3.4]$ source ~/.bash_profile

[oframe7@ofdemo ~]$ cd

[oframe7@ofdemo ~]$ odbcinst -j unixODBC 2.3.4
DRIVERS............: /home/oframe7/odbcinst.ini 
SYSTEM DATA SOURCES: /home/oframe7/odbc.ini 
FILE DATA SOURCES..: /home/oframe7/ODBCDataSources 
USER DATA SOURCES..: /home/oframe7/unixODBC/etc/odbc.ini 
SQLULEN Size.......: 8 
SQLLEN Size........: 8 
SQLSETPOSIROW Size.: 8

[oframe7@ofdemo ~]$ vi odbcinst.ini

[Tibero]
Description = Tibero ODBC driver for Tibero6 
Driver = /opt/tmaxdb/tibero6/client/lib/libtbodbc.so 
Setup = 
FileUsage = 
CPTimeout = 
CPReuse = 
Driver Logging = 7

[ODBC]
Trace = NO 
TraceFile = /home/oframe7/odbc.log 
ForceTrace = Yes 
Pooling = No 
DEBUG = 1

[oframe7@ofdemo ~]$ vi odbc.ini

[TVSAM]
Description = Tibero ODBC driver for Tibero6 
Driver = Tibero 
DSN = TVSAM 
SID = TVSAM 
User = tibero 
password = tmax

```
8.  Create a symbolic link and validate the Tibero database connection:
```
[oframe7@ofdemo ~]$ ln $ODBC_HOME/lib/libodbc.so $ODBC_HOME/lib/libodbc.so.1 [oframe7@ofdemo ~]$ ln $ODBC_HOME/lib/libodbcinst.so 
$ODBC_HOME/lib/libodbcinst.so.1

[oframe7@ofdemo lib]$ isql TVSAM tibero tmax
```

Output:

[ODBC output showing connected](./media/odbc_01)


