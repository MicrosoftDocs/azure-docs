<properties
	pageTitle="Optimize MySQL Performance on Linux VMs | Microsoft Azure"
	description="Learn how to optimize MySQL running on an Azure virtual machine (VM) running Linux."
	services="virtual-machines-linux"
	documentationCenter=""
	authors="NingKuang"
	manager="timlt"
	editor=""
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="12/15/2015"
	ms.author="ningk"/>

#Optimizing MySQL Performance on Azure Linux VMs

There are many factors that impact MySQL performance on Azure, both in virtual hardware selection and software configuration. This article focuses on optimizing performance through storage, system, and database configurations.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)]


##Utilizing RAID on an Azure virtual machine
Storage is the key factor that impacts database performance in cloud environments.  Compared to a single disk, RAID can provide faster access via concurrency.  Refer to [Standard RAID Levels](http://en.wikipedia.org/wiki/Standard_RAID_levels) for more detail.   

Disk I/O throughput and I/O response time in Azure can be significantly improved through RAID. Our lab tests show disk I/O throughput can be doubled and I/O response time can be reduced by half on average when the number of RAID disks is doubled (from 2 to 4, 4 to 8, etc.). See [Appendix A](#AppendixA) for details.  

In addition to disk I/O, MySQL performance improves when you increase the RAID level.  See [Appendix B](#AppendixB) for details.  

You may also want to consider the chunk size. In general when you have a larger chunk size, you will get lower overhead, especially for large writes. However, when the chunk size is too large, it might add additional overhead and you cannot take advantage of the RAID. The current default size is 512KB, which is proven to be optimal for most general production environments. See [Appendix C](#AppendixC) for details.   

Please note that there are limits on how many disks you can add for different virtual machine types. These limits are detailed in [Virtual Machine and Cloud Service Sizes for Azure](http://msdn.microsoft.com/library/azure/dn197896.aspx). You will need 4 attached data disks to follow the RAID example in this article, although you could choose to set up RAID with fewer disks.  

This article assumes you have already created a Linux virtual machine and have MYSQL installed and configured. For more information on getting started please refer to How to install MySQL on Azure.  

###Setting up RAID on Azure
The following steps show how to create RAID on Azure using the Azure classic portal. You can also set up RAID using Windows PowerShell scripts.
In this example we will configure RAID 0 with 4 disks.  

####Step 1: Add a Data Disk to your Virtual Machine  

In the Virtual Machines page of the Azure classic portal, click the virtual machine to which you want to add a data disk. In this example, the virtual machine is mysqlnode1.  

![][1]

On the page for the virtual machine, click **Dashboard**.  

![][2]


In the task bar, click **Attach**.

![][3]

And then click **Attach empty disk**.  

![][4]

For data disks, the **Host Cache Preference** should be set to **None**.  

This will add one empty disk into your virtual machine. Repeat this step three more times so that you have 4 data disks for RAID.  

You can see the added drives in the virtual machine by looking at the kernel message log. For example, to see this on Ubuntu, use the following command:  

	sudo grep SCSI /var/log/dmesg

####Step 2: Create RAID with the additional disks
Follow this article for detailed RAID setup steps:  

[Configure software RAID on Linux](virtual-machines-linux-configure-raid.md)

>[AZURE.NOTE] If you are using the XFS file system, follow the steps below after you have created RAID.

To install XFS on Debian, Ubuntu, or Linux Mint, use the following command:  

	apt-get -y install xfsprogs  

To install XFS On Fedora, CentOS, or RHEL, use the following command:  

	yum -y install xfsprogs  xfsdump


####Step 3: Set up a new storage path
Use the following command:  

	root@mysqlnode1:~# mkdir -p /RAID0/mysql

####Step 4: Copy the original data to the new storage path
Use the following command:  

	root@mysqlnode1:~# cp -rp /var/lib/mysql/* /RAID0/mysql/

####Step 5: Modify permissions so MySQL can access (read and write) the data disk
Use the following command:  

	root@mysqlnode1:~# chown -R mysql.mysql /RAID0/mysql && chmod -R 755 /RAID0/mysql


##Adjust the disk I/O scheduling algorithm
Linux implements four types of I/O scheduling algorithms:  

-	NOOP algorithm (No Operation)
-	Deadline algorithm (Deadline)
-	Completely fair queuing algorithm (CFQ)
-	Budget period algorithm (Anticipatory)  

You can select different I/O schedulers under different scenarios to optimize performance. In a completely random access environment, there is not a big difference between the CFQ and Deadline algorithms for performance. It is generally recommended to set the MySQL database environment to Deadline for stability. If there is a lot of sequential I/O, CFQ may reduce disk I/O performance.   

For SSD and other equipment, using NOOP or Deadline can achieve better performance than the Default scheduler.   

From the kernel 2.5, the default I/O scheduling algorithm is Deadline. Beginning from the kernel 2.6.18, CFQ became the default I/O scheduling algorithm.  You can specify this setting at Kernel boot time or dynamically modify this setting when the system is running.  

The following example demonstrates how to check and set the default scheduler to the NOOP algorithm.  

For the Debian distribution family:

###Step 1.View the current I/O scheduler
Use the following command:  

	root@mysqlnode1:~# cat /sys/block/sda/queue/scheduler

You will see following output, which indicates the current scheduler.  

	noop [deadline] cfq


###Step 2. Change the current device (/dev/sda) of I/O scheduling algorithm
Use the following commands:  

	azureuser@mysqlnode1:~$ sudo su -
	root@mysqlnode1:~# echo "noop" >/sys/block/sda/queue/scheduler
	root@mysqlnode1:~# sed -i 's/GRUB_CMDLINE_LINUX=""/GRUB_CMDLINE_LINUX_DEFAULT="quiet splash elevator=noop"/g' /etc/default/grub
	root@mysqlnode1:~# update-grub

>[AZURE.NOTE] Setting this for /dev/sda alone is not useful. It needs to be set on all data disks where the database resides.  

You should see the following output, indicating that grub.cfg has been rebuilt successfully and that the default scheduler has been updated to NOOP.  

	Generating grub configuration file ...
	Found linux image: /boot/vmlinuz-3.13.0-34-generic
	Found initrd image: /boot/initrd.img-3.13.0-34-generic
	Found linux image: /boot/vmlinuz-3.13.0-32-generic
	Found initrd image: /boot/initrd.img-3.13.0-32-generic
	Found memtest86+ image: /memtest86+.elf
	Found memtest86+ image: /memtest86+.bin
	done

For the Redhat distribution family, you only need the following command:   

	echo 'echo noop >/sys/block/sda/queue/scheduler' >> /etc/rc.local

##Configure system file operations settings
One best practice is to disable the atime logging feature on the file system. Atime is the last file access time. Whenever a file is accessed, the file system records the timestamp in the log. However, this information is rarely used. You can disable it if you don't need it, which will reduce overall disk access time.  

To disable atime logging, you need to modify the file system configuration file /etc/ fstab and add the **noatime** option.  

For example, edit  the vim /etc/fstab file, adding the noatime as shown below.  

	# CLOUD_IMG: This file was created/modified by the Cloud Image build process
	UUID=3cc98c06-d649-432d-81df-6dcd2a584d41       /        ext4   defaults,discard        0 0
	#Add the “noatime” option below to disable atime logging
	UUID="431b1e78-8226-43ec-9460-514a9adf060e"     /RAID0   xfs   defaults,nobootwait, noatime 0 0
	/dev/sdb1       /mnt    auto    defaults,nobootwait,comment=cloudconfig 0       2

Then, remount the file system with the following command:  

	mount -o remount /RAID0

Test the modified result. Note that when you modify the test file, the access time is not updated.  

Before example:		

![][5]

After example:

![][6]

##Increase the maximum number of system handles for high concurrency
MySQL is high concurrency database. The default number of concurrent handles is 1024 for Linux, which is not always sufficient. **Use the following steps to increase the maximum concurrent handles of the system to support high concurrency of MySQL**.

###Step 1: Modify the limits.conf file
Add the following four lines in the /etc/security/limits.conf file to increase the maximum allowed concurrent handles. Note that 65536 is the maximum number that the system can support.   

	* soft nofile 65536
	* hard nofile 65536
	* soft nproc 65536
	* hard nproc 65536

###Step 2: Update the system for the new limits
Run the following commands:  

	ulimit -SHn 65536
	ulimit -SHu 65536

###Step 3: Ensure that the limits are updated at boot time
Put the following startup commands in the /etc/rc.local file so it will take effect during every boot time.  

	echo “ulimit -SHn 65536” >>/etc/rc.local
	echo “ulimit -SHu 65536” >>/etc/rc.local

##MySQL database optimization
You can use the same performance tuning strategy to configure MySQL on Azure as on an on-premises machine.  

The main I/O optimization rules are:   

-	Increase the cache size.
-	Reduce I/O response time.  

To optimize MySQL server settings, you can update the my.cnf file, which is the default configuration file for both server and client computers.  

The following configuration items are the main factors that affect MySQL performance:  

-	**innodb_buffer_pool_size**: The buffer pool contains buffered data and the index. This is usually set to 70% of physical memory.
-	**innodb_log_file_size**: This is the redo log size. You use redo logs to ensure that write operations are fast, reliable, and recoverable after a crash. This is set to 512MB, which will give you plenty of space for logging write operations.
-	**max_connections**: Sometimes applications do not close connections properly. A larger value will give the server more time to recycle idled connections. The maximum connections is 10000, but the recommended maximum is 5000.
-	**Innodb_file_per_table**: This setting enable or disable the ability of InnoDB to store tables in separate files. Turn on the option will ensure that several advanced administration operations can be applied efficiently. From performance point of view, it can speed up the table space transmission and optimize the debris management performance. So the recommended setting for this is ON.</br>
	From MySQL 5.6, the default setting is ON. Therefore, no action is required. For other versions, which is earlier than 5.6, default settings is OFF. Turning this ON is required. And should apply it before data is loaded, because only newly-created tables are affected.
-	**innodb_flush_log_at_trx_commit**: Default value is 1, with the scope set to 0~2. The default value is the most suitable option for standalone MySQL DB. The setting of 2 enables the most data integrity and is suitable for Master in MySQL cluster. The setting of 0 allows data loss, which can affect reliability, in some cases with better performance, and is suitable for Slave in MySQL cluster.
-	**Innodb_log_buffer_size**: The log buffer allows transactions to run without having to flush the log to disk before the transactions commit. However, if there is large binary object or text field, the cache will be consumed very quickly and frequent disk I/O will be triggered. It is better increase the buffer size if Innodb_log_waits state variable is not 0.
-	**query_cache_size**:  The best option is to disable it from the outset. Set query_cache_size to 0 (this is now the default setting in MySQL 5.6) and use other methods to speed up queries .  

See [Appendix D](#AppendixD) for comparing performance after the optimization.


##Turn on the MySQL slow query log for analyzing the performance bottleneck
The MySQL slow query log can help you identify the slow queries for MySQL. After enabling the MySQL slow query log, you can use MySQL tools like **mysqldumpslow** to identify the performance bottleneck.  

Please note that by default this is not enabled. Turning on the slow query log may consume some CPU resources. Therefore, it is recommended that you enable this temporarily for troubleshooting performance bottlenecks.

###Step 1: Modify my.cnf file by adding the following lines to the end   

	long_query_time = 2
	slow_query_log = 1
	slow_query_log_file = /RAID0/mysql/mysql-slow.log

###Step 2: Restart mysql server
	service  mysql  restart

###Step 3: Check whether the setting is taking effect using the “show” command

![][7]   

![][8]

In this example, you can see that the slow query feature has been turned on. You can then use the **mysqldumpslow** tool to determine performance bottlenecks and optimize performance, such as adding indexes.





##Appendix

The following are sample performance test data produced on targeted lab environment, they provide general background on the performance data trend with different performance tuning approaches, however the results may vary under different environment or product versions.

<a name="AppendixA"></a>Appendix A:  
**Disk Performance (IOPS) with Different RAID Levels**


![][9]

**Test commands:**  

	fio -filename=/path/test -iodepth=64 -ioengine=libaio -direct=1 -rw=randwrite -bs=4k -size=5G -numjobs=64 -runtime=30 -group_reporting -name=test-randwrite

>AZURE.NOTE: The workload of this test uses 64 threads, trying to reach the upper limit of RAID.

<a name="AppendixB"></a>Appendix B:  
**MySQL Performance (Throughput) Comparison with Different RAID Levels**   
(XFS file system)


![][10]  
![][11]

**Test commands:**

	mysqlslap -p0ps.123 --concurrency=2 --iterations=1 --number-int-cols=10 --number-char-cols=10 -a --auto-generate-sql-guid-primary --number-of-queries=10000 --auto-generate-sql-load-type=write –engine=innodb

**MySQL Performance (OLTP) Comparison with Different RAID Levels**  
![][12]

**Test commands:**

	time sysbench --test=oltp --db-driver=mysql --mysql-user=root --mysql-password=0ps.123  --mysql-table-engine=innodb --mysql-host=127.0.0.1 --mysql-port=3306 --mysql-socket=/var/run/mysqld/mysqld.sock --mysql-db=test --oltp-table-size=1000000 prepare

<a name="AppendixC"></a>Appendix C:   
**Disk Performance (IOPS) Comparison for Different Chunk Sizes**  
(XFS file system)


![][13]

**Test commands:**  

	fio -filename=/path/test -iodepth=64 -ioengine=libaio -direct=1 -rw=randwrite -bs=4k -size=30G -numjobs=64 -runtime=30 -group_reporting -name=test-randwrite
	fio -filename=/path/test -iodepth=64 -ioengine=libaio -direct=1 -rw=randwrite -bs=4k -size=1G -numjobs=64 -runtime=30 -group_reporting -name=test-randwrite  

Note the file size used for this testing is 30GB and 1GB respectively, with RAID 0(4 disks) XFS fie system.


<a name="AppendixD"></a>Appendix D:  
**MySQL Performance (Throughput) Comparison Before and After Optimization**  
(XFS File System)


![][14]

**Test commands:**

	mysqlslap -p0ps.123 --concurrency=2 --iterations=1 --number-int-cols=10 --number-char-cols=10 -a --auto-generate-sql-guid-primary --number-of-queries=10000 --auto-generate-sql-load-type=write –engine=innodb,misam

**The configuration setting for default and optmization is as follows:**

|Parameters	|Default	|optmization
|-----------|-----------|-----------
|**innodb_buffer_pool_size**	|None	|7G
|**innodb_log_file_size**	|5M	|512M
|**max_connections**	|100	|5000
|**innodb_file_per_table**	|0	|1
|**innodb_flush_log_at_trx_commit**	|1	|2
|**innodb_log_buffer_size**	|8M	|128M
|**query_cache_size**	|16M	|0


More and more detailed optimization configuration parameters, please refer to the mysql official instructions.  

[http://dev.mysql.com/doc/refman/5.6/en/innodb-configuration.html](http://dev.mysql.com/doc/refman/5.6/en/innodb-configuration.html)  

[http://dev.mysql.com/doc/refman/5.6/en/innodb-parameters.html#sysvar_innodb_flush_method](http://dev.mysql.com/doc/refman/5.6/en/innodb-parameters.html#sysvar_innodb_flush_method)

**Test Environment**  

|Hardware	|Details
|-----------|-------
|Cpu	|AMD Opteron(tm) Processor 4171 HE/4 cores
|Memory	|14G
|disk	|10G/disk
|os	|Ubuntu 14.04.1 LTS



[1]: ./media/virtual-machines-linux-classic-optimize-mysql/virtual-machines-linux-optimize-mysql-perf-01.png
[2]: ./media/virtual-machines-linux-classic-optimize-mysql/virtual-machines-linux-optimize-mysql-perf-02.png
[3]: ./media/virtual-machines-linux-classic-optimize-mysql/virtual-machines-linux-optimize-mysql-perf-03.png
[4]: ./media/virtual-machines-linux-classic-optimize-mysql/virtual-machines-linux-optimize-mysql-perf-04.png
[5]: ./media/virtual-machines-linux-classic-optimize-mysql/virtual-machines-linux-optimize-mysql-perf-05.png
[6]: ./media/virtual-machines-linux-classic-optimize-mysql/virtual-machines-linux-optimize-mysql-perf-06.png
[7]: ./media/virtual-machines-linux-classic-optimize-mysql/virtual-machines-linux-optimize-mysql-perf-07.png
[8]: ./media/virtual-machines-linux-classic-optimize-mysql/virtual-machines-linux-optimize-mysql-perf-08.png
[9]: ./media/virtual-machines-linux-classic-optimize-mysql/virtual-machines-linux-optimize-mysql-perf-09.png
[10]: ./media/virtual-machines-linux-classic-optimize-mysql/virtual-machines-linux-optimize-mysql-perf-10.png
[11]: ./media/virtual-machines-linux-classic-optimize-mysql/virtual-machines-linux-optimize-mysql-perf-11.png
[12]: ./media/virtual-machines-linux-classic-optimize-mysql/virtual-machines-linux-optimize-mysql-perf-12.png
[13]: ./media/virtual-machines-linux-classic-optimize-mysql/virtual-machines-linux-optimize-mysql-perf-13.png
[14]: ./media/virtual-machines-linux-classic-optimize-mysql/virtual-machines-linux-optimize-mysql-perf-14.png
