---
title: Issues with a full OS disk on a Linux virtual machine
description: How to resolve issues with a full OS disk on a Linux virtual machine
author: v-miegge
ms.author: timothy.basham
ms.service: virtual-machines
ms.subservice: disks
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 11/20/2020

---
# Issues with a full OS disk on a Linux virtual machine

When the OS disk of a Linux virtual machine (VM) becomes full, this can cause problems with the proper operation of the VM.

## Example

As an example, if the customer try to create a new file, they receive this message:

```
username@AZUbuntu1404:~$ touch new 
touch: cannot touch “new”: No space left on device 
username@AZUbuntu1404:~$
```

Multiple daemons then indicate that they are not able to create temporary files during the boot session.

```
ERROR:IOError: [Errno 28] No space left on device: '/var/lib/waagent/events/1474306860983232.tmp' 
    
OSError: [Errno 28] No space left on device: '/var/lib/cloud/data/tmpDZCq0g'
```
	
## Causes and Solutions

### Cause 1

The disk could be full, and the customer needs to remove excess files.

```
$ df -h 
Filesystem      Size  Used Avail Use% Mounted on 
udev            1.7G   12K  1.7G   1% /dev 
tmpfs           344M  404K  344M   1% /run 
/dev/sda1        29G   29G     0 100% / 
none            4.0K     0  4.0K   0% /sys/fs/cgroup 
none            5.0M     0  5.0M   0% /run/lock 
none            1.7G     0  1.7G   0% /run/shm 
none            100M     0  100M   0% /run/user 
none             64K     0   64K   0% /etc/network/interfaces.dynamic.d 
/dev/sdb1        50G   52M   47G   1% /mnt
```

### Solution 1

There is no best method for locating the files that are filling the disk, but a common method to find them is to break the task into multiple steps.

1. Navigate to the root of the filesystem.

   `$ cd /`

2. Use the `du` (disk usage) command to determine which directory contains the file(s) filling the disk.

```
$ sudo du -hs * >2/dev/null 
    
9.6M    bin 
27M     boot 
28G     var 
12K     dev 
5.2M    etc 
36K     home 
0       initrd.img 
188M    lib 
4.0K    lib64 
16K     lost+found 
4.0K    media 
28K     mnt 
21M     opt 
0       proc 
4.0K    root 
404K    run 
9.4M    sbin 
4.0K    srv 
0       sys 
4.0K    tmp 
440M    usr 
313M    test 
0       vmlinuz
```

The `/var` directory is using 28 gigabytes of space.

3. Recursively navigate deeper into the filesystem and repeat the same steps until you find the files filling the disk.

```
$ cd /var 
    
$ sudo du -hs * 
488K    backups 
149M    cache 
180K    crash 
232M    lib 
4.0K    local 
0       lock 
28G     log 
4.0K    mail 
4.0K    mdsd 
60K     opt 
0       run 
36K     spool 
4.0K    tmp
```

4. Continue the previous step down through the directory, until you find the files filling the disk.

Many possible methods and tools exist to find files filling the disk, another method is using the find command.

This command will find the 10 largest directories:

```
$ sudo find / /proc -prune -type d -print0 | xargs -0 du 2>/dev/null | sort -n | tail -10 | cut -f2 | xargs -I{} du -sh 2>/dev/null {} 
 
122M    /var/lib/apt 
144M    /var/lib 
149M    /var/cache 
28G     /var/log 
168M    /usr/share 
188M    /lib 
215M    /usr/lib 
313M    /var 
440M    /usr 
29G     /
```

This command file find the 10 largest files:

```
$ sudo find / -path /proc -prune -o -type f -print0 | xargs -0 du 2>/dev/null | sort -n | tail -10 | cut -f2 | xargs -I{} du -sh 2>/dev/null {} 
    
12M     /var/log/btmp 
18M     /var/lib/apt/lists/azure.archive.ubuntu.com_ubuntu 
23M     /usr/lib/x86_64-linux-gnu/libicudata.so.52.1 
27M     /var/lib/apt/lists/azure.archive.ubuntu.com_ubuntu 
28M     /var/cache/apt/pkgcache.bin 
28M     /var/cache/apt/srcpkgcache.bin 
31M     /var/lib/apt/lists/azure.archive 
35M     /var/cache/apt-xapian-index/index.1/termlist.DB 
46M     /var/cache/apt-xapian-index/index.1/postlist.DB 
28G     /var/log/bigfile
```

### Cause 2

The disk could have space for files, but the filesystem might have run out of iNodes. Each file takes an iNode on Linux, and it’s possible that a program that creates many small files will use all the iNodes before using all the space on the disk.

```
$ df -h 
Filesystem      Size  Used Avail Use% Mounted on 
udev            1.7G   12K  1.7G   1% /dev 
tmpfs           344M  400K  344M   1% /run 
/dev/sda1        29G  1.2G   27G   5% / 
none            4.0K     0  4.0K   0% /sys/fs/cgroup 
none            5.0M     0  5.0M   0% /run/lock 
none            1.7G     0  1.7G   0% /run/shm 
none            100M     0  100M   0% /run/user 
none             64K     0   64K   0% /etc/network/interfaces.dynamic d 
/dev/sdb1        50G   52M   47G   1% /mnt 
    
$ df -i 
Filesystem      Inodes   IUsed   IFree IUse% Mounted on 
udev            439066     434  438632    1% /dev 
tmpfs           440256     359  439897    1% /run 
/dev/sda1      1925120 1925120       0  100% / 
none            440256       2  440254    1% /sys/fs/cgroup 
none            440256       1  440255    1% /run/lock 
none            440256       1  440255    1% /run/shm 
none            440256       2  440254    1% /run/user 
none            440256       1  440255    1% /etc/network/interfaces.dynamic.d 
/dev/sdb1      3276800      14 3276786    1% /mnt
```

### Solution 2:

As with the previous cause, there are many ways to solve this problem.

If the customer knows their system, they might already know which daemon is creating multiple files, and the location of those files.

If the customer does not know where the files are, it’s possible to count the number of files in each directory. This might help to find where the iNodes are being used up.

```
$ find / -xdev -type d -print0 | while IFS= read -d '' dir ; do echo "$(find "$dir" -maxdepth 1 -print0 | grep -zc .) $dir" ; done | sort -rn | head -10 
    
1888650 /var/log/someProgram 
2262 /var/lib/dpkg/info 
731 /usr/share/man/man1 
669 /usr/bin 
568 /usr/share/vim/vim74/syntax 
568 /usr/share/bash-completion/completions 
521 /etc/ssl/certs 
490 /usr/share/man/man8 
471 /usr/share/doc 
443 /usr/lib/python2.7
```

### Cause 3

A data disk mounted over an existing directory might be hiding files.

```
$ df -h 
Filesystem      Size  Used Avail Use% Mounted on 
udev            1.7G   12K  1.7G   1% /dev 
tmpfs           344M  404K  344M   1% /run 
/dev/sda1        29G   28G  8.0M 100% / 
none            4.0K     0  4.0K   0% /sys/fs/cgroup 
none            5.0M     0  5.0M   0% /run/lock 
none            1.7G     0  1.7G   0% /run/shm 
none            100M     0  100M   0% /run/user 
none             64K     0   64K   0% /etc/network/interfaces.dynamic.d 
/dev/sdb1        50G   52M   47G   1% /mnt 
/dev/sdc1      1007G   72M  956G   1% /datadisk 

$ mount 
/dev/sda1 on / type ext4 (rw,discard) 
proc on /proc type proc (rw,noexec,nosuid,nodev) 
sysfs on /sys type sysfs (rw,noexec,nosuid,nodev) 
none on /sys/fs/cgroup type tmpfs (rw) 
none on /sys/fs/fuse/connections type fusectl (rw) 
none on /sys/kernel/debug type debugfs (rw) 
none on /sys/kernel/security type securityfs (rw) 
udev on /dev type devtmpfs (rw,mode=0755) 
devpts on /dev/pts type devpts (rw,noexec,nosuid,gid=5,mode=0620) 
tmpfs on /run type tmpfs (rw,noexec,nosuid,size=10%,mode=0755) 
none on /run/lock type tmpfs (rw,noexec,nosuid,nodev,size=5242880) 
none on /run/shm type tmpfs (rw,nosuid,nodev) 
none on /run/user type tmpfs (rw,noexec,nosuid,nodev,size=104857600,mode=0755) 
none on /sys/fs/pstore type pstore (rw) 
none on /etc/network/interfaces.dynamic.d type tmpfs (rw,noexec,nosuid,nodev,size=64K) 
/dev/sdb1 on /mnt type ext4 (rw) 
systemd on /sys/fs/cgroup/systemd type cgroup (rw,noexec,nosuid,nodev,none,name=systemd) 
/dev/sdc1 on /datadisk type ext4 (rw) 

$ cd / 
$ du -hs * 
9.6M    bin 
27M     boot 
20K     datadisk 
12K     dev 
5.3M    etc 
44K     home 
0       initrd.img 
188M    lib 
4.0K    lib64 
16K     lost+found 
32K     mnt 
21M     opt 
0       proc 
24K     root 
404K    run 
9.4M    sbin 
4.0K    srv 
0       sys 
4.0K    tmp 
440M    usr 
324M    var 
0       vmlinuz
```

None of the directories contain 27G of data.

```
$ cd /datadisk 
$ ll 
total 24 
drwxr-xr-x  3 root root  4096 Sep 26 18:04 ./ 
drwxr-xr-x 22 root root  4096 Sep 26 17:49 ../ 
drwx------  2 root root 16384 Sep 26 17:05 lost+found/ 
-rw-r--r--  1 root root     0 Sep 26 18:04 someSmallFile
```

### Solution 3

Files existed in the `/datadisk` directory before the additional data disk was attached and mounted to `/datadisk`.

The files in `/datadisk` were not lost, and are still stored on `/dev/sda1` (the OS disk).

These files are hidden from the `du` (disk usage) find commands in most cases.

Create a temporary directory and rebind the root filesystem to that directory. That will expose the original files in the `/datadisk` directory.

```
$ cd / 
$ mkdir full 
$ mount -o bind / full/ 
$ cd /full 
$ ll 
total 104 
drwxr-xr-x 23 root root  4096 Sep 26 18:15 ./ 
drwxr-xr-x 23 root root  4096 Sep 26 18:15 ../ 
drwxr-xr-x  2 root root  4096 Aug 30 22:06 bin/ 
drwxr-xr-x  3 root root  4096 Aug 30 22:07 boot/ 
drwxr-xr-x  2 root root  4096 Sep 26 17:48 datadisk/ 
drwxr-xr-x  5 root root  4096 Aug 30 20:54 dev/ 
drwxr-xr-x 92 root root  4096 Sep 26 18:16 etc/ 
drwxr-xr-x  2 root root  4096 Sep 26 18:15 full/ 
drwxr-xr-x  3 root root  4096 Sep 12 19:32 home/ 
lrwxrwxrwx  1 root root    32 Aug 30 22:06 initrd.img -> boot/initrd.img-4.4.0-36-generic 
drwxr-xr-x 21 root root  4096 Aug 30 22:07 lib/ 
drwxr-xr-x  2 root root  4096 Aug 30 20:50 lib64/ 
drwx------  2 root root 16384 Aug 30 20:54 lost+found/ 
drwxr-xr-x  3 root root  4096 Sep 12 19:31 mnt/ 
drwxr-xr-x  4 root root  4096 Sep 12 19:33 opt/ 
drwxr-xr-x  2 root root  4096 Apr 10  2014 proc/ 
drwx------  3 root root  4096 Sep 26 17:06 root/ 
drwxr-xr-x  5 root root  4096 Aug 30 22:06 run/ 
drwxr-xr-x  2 root root  4096 Sep 16 03:35 sbin/ 
drwxr-xr-x  2 root root  4096 Aug 30 20:45 srv/ 
drwxr-xr-x  2 root root  4096 Mar 13  2014 sys/ 
drwxrwxrwt  2 root root  4096 Sep 26 18:16 tmp/ 
drwxr-xr-x 10 root root  4096 Aug 30 20:45 usr/ 
drwxr-xr-x 13 root root  4096 Sep 12 19:33 var/ 
lrwxrwxrwx  1 root root    29 Aug 30 22:06 vmlinuz -> boot/vmlinuz-4.4.0-36-generic 
    
$ du -hs * 
9.6M    bin 
27M     boot 
27G     datadisk 
24K     dev 
5.3M    etc 
4.0K    full 
44K     home 
0       initrd.img 
188M    lib 
4.0K    lib64 
16K     lost+found 
12K     mnt 
21M     opt 
4.0K    proc 
24K     root 
68K     run 
9.4M    sbin 
4.0K    srv 
4.0K    sys 
4.0K    tmp 
440M    usr 
324M    var 
0       vmlinuz 
    
$ ll -h 
total 27G 
drwxr-xr-x  2 root root 4.0K Sep 26 17:48 ./ 
drwxr-xr-x 23 root root 4.0K Sep 26 18:15 ../ 
-rw-r--r--  1 root root  26G Sep 26 17:47 bigfile 
-rw-r--r--  1 root root 600M Sep 26 17:49 smallfile
```

### Cause 4

Files that are opened by a process and then deleted, will still appear as used space by the `df` command, but won’t be displayed by the `du` command.

```
$ df -h 
Filesystem      Size  Used Avail Use% Mounted on 
udev            1.7G   12K  1.7G   1% /dev 
tmpfs           344M  404K  344M   1% /run 
/dev/sda1        29G   28G   40M 100% / 
none            4.0K     0  4.0K   0% /sys/fs/cgroup 
none            5.0M     0  5.0M   0% /run/lock 
none            1.7G     0  1.7G   0% /run/shm 
none            100M     0  100M   0% /run/user 
none             64K     0   64K   0% /etc/network/interfaces.dynamic.d 
/dev/sdb1        50G   52M   47G   1% /mnt 
    
$ du -hs * 
9.6M    bin 
27M     boot 
4.0K    datadisk 
12K     dev 
5.3M    etc 
4.0K    full 
44K     home 
0       initrd.img 
188M    lib 
4.0K    lib64 
16K     lost+found 
32K     mnt 
21M     opt 
0       proc 
44K     root 
404K    run 
9.4M    sbin 
4.0K    srv 
0       sys 
4.0K    tmp 
510M    usr 
744M    var 
0       vmlinuz 
    
$ lsof -nP | grep '(deleted)' 
openfile  6951            root    3r      REG                8,1 28000000000        165 /var/log/bigfile (deleted)
```

### Solution 4

Running the `lsof` command shows that a large file has been deleted, but that process 6951 is still holding the file open.

First restart the process holding the file open to release the space.

If this step is not appropriate for the situation due to production use, overwrite the file descriptor with `null` to free the space.

In the previous example, 6951 is the process ID (PID) holding the file open. To identify the file descriptor, use the following command:

```
$ ls -l /proc/6951/fd 
total 0 
lrwx------ 1 root root 64 Sep 26 19:18 0 -> /dev/pts/0 
lrwx------ 1 root root 64 Sep 26 19:18 1 -> /dev/pts/0 
lrwx------ 1 root root 64 Sep 26 19:18 2 -> /dev/pts/0 
lr-x------ 1 root root 64 Sep 26 19:18 3 -> /var/log/bigfile (deleted)
```

As sown previously, the file descriptor is **3**.

Overwrite the FD with `null` to free the space.

```
$ cat /dev/null > /proc/6951/fd/3
```

The file will still be open by the process, but it will be of zero size.

```
$ lsof -nP | grep '(deleted)'     
openfile  6951            root    3r      REG                8,1        0        165 /var/log/bigfile (deleted)
```

Another check of the file system usage shows that the space is now free.

```
$ df -h 
Filesystem      Size  Used Avail Use% Mounted on 
udev            1.7G   12K  1.7G   1% /dev 
tmpfs           344M  404K  344M   1% /run 
/dev/sda1        29G  1.5G   27G   6% / 
none            4.0K     0  4.0K   0% /sys/fs/cgroup 
none            5.0M     0  5.0M   0% /run/lock 
none            1.7G     0  1.7G   0% /run/shm 
none            100M     0  100M   0% /run/user 
none             64K     0   64K   0% /etc/network/interfaces.dynamic.d 
/dev/sdb1        50G   52M   47G   1% /mnt
```

## Mitigation

### Azure Virtual Machine RDPSSH DiskFull Template

1. Check whether the disk is full. If the disk is full, then follow these steps:

   1. For disks below 1TB of capacity:
   
      1. Expand the disk to a maximum of 1TB using PowerShell. For instructions on how to complete this step, refer to [How to expand the OS drive of a Virtual Machine in an Azure Resource Group](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-windows-expand-os-disk?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
	  
   2. If the disk size is already 1TB:
   
      1. The customer needs to perform a disk cleanup. To do so, attach this VM to a working VM and perform a cleanup on the drive.
	  
2. Once the resize or cleanup is complete, perform a defragmentation of the drive.

   `defrag <LETTER ASSIGN TO THE OS DISK>: /u /x /g`

   Depending on the level of drive fragmentation, this step could take several hours.