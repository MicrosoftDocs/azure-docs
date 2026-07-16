---
title: Troubleshoot issues in BlobFuse
titleSuffix: Azure Storage
description: Learn how to troubleshoot issues in BlobFuse.
author: normesta
ms.author: normesta

ms.service: azure-blob-storage
ms.topic: troubleshooting
ms.date: 1/29/2026

ms.custom: linux-related-content

# Customer intent: "As a cloud administrator, I want to access troubleshooting resources for BlobFuse, so that I can efficiently resolve any issues that arise during its use."
---

# Troubleshoot issues in BlobFuse

This article discusses common issues that you might encounter when you use BlobFuse.

> [!NOTE]
> To better understand the underlying cause of an issue, set the log level to debug mode (`log_debug`) before you attempt to reproduce an issue. See [Configure logging for BlobFuse](blobfuse2-enable-logs.md).

## Common mount problems

This section lists common problems that can occur when you attempt to mount a container.

### Error: fusermount: failed to open /etc/fuse.conf: Permission denied

Only users who are part of the fuse group and the root user can run the `fusermount` command. To resolve this problem, add your user to the fuse group by using the following command:

```bash
sudo addgroup <user> fuse
```

### Error: mount command successful but log shows 'Failed to init fuse'

If you're using the `allow-other: true` configuration, ensure that `user_allow_other` is enabled in the `/etc/fuse.conf` file. By default, `/etc/fuse.conf` has this option disabled. You need to enable it and save the file.

### Failed to mount: failed to authenticate credentials for Azure Storage

There might be an issue with the storage configuration. Check the storage account name, account key, and `container/filesystem` name.

Possible causes for this issue include the following problems:

- Invalid account or access key.

- Nonexisting container. You must create the container before you mount BlobFuse.

- Windows line endings (CRLF). To fix this problem, run `dos2unix`.

- Use of HTTP while 'Secure Transfer (HTTPS)' is enabled on a storage account.

- Enabled virtual network security rule that blocks VM from connecting to the storage account. Make sure you can connect to your storage account by using AzCopy or Azure CLI.

- DNS issues and timeouts. To bypass the DNS lookup, add the storage account resolution to `/etc/hosts`.

- If you use a proxy endpoint, make sure that you use the correct transfer protocol HTTP versus HTTPS.

### For Managed Service Identity (MSI) or Service Principal (SPN) authorization, HTTP status code = 403 in the response. Authorization error

- Check your storage account access roles. Make sure you have both `Contributor` and `Storage Blob Contributor` roles for the MSI or SPN identity.
- For private AAD endpoint (private MSI endpoints), make sure your environment variables are configured correctly.

### fusermount: mount failed: Operation not permitted (CentOS)

By default, `fusermount` is a privileged operation on CentOS. You can work around this problem by changing the permissions of the `fusermount` operation.

```bash
chown root /usr/bin/fusermount
chmod u+s /usr/bin/fusermount
```

### Can't access mounted directory

FUSE supports mounting filesystems in user space. The mounted filesystem is only accessible by the user who mounted it. For example, if you mount a filesystem by using root but try to access it by using another user, access fails. To work around this limitation, use the nonsecure fuse option `--allow-other`.

```bash
sudo blobfuse2 mount /home/myuser/mount_dir/ --config-file=config.yaml --allow-other
```

### fusermount: command not found

This error can happen when you try to unmount the Blob Storage, but the recommended command isn't found. While `umount` might work instead, fusermount is the recommended method, so install the fuse package. The following example installs the fuse package on Ubuntu 20+:

```bash
sudo apt install fuse3
```

> [!NOTE]
> Fuse version (2 or 3) depends on the Linux distribution you're using. Refer to fuse version for your distribution.

### Hangs while mounting to private link storage account

The BlobFuse configuration file should specify the account name as the original storage account name, not the private link storage account name. For example: `myblobstorageaccount.blob.core.windows.net` is correct, while `privatelink.myblobstorageaccount.blob.core.windows.net` is incorrect.

If the configuration file is correct, verify name resolution. For example, `dig +short myblobstorageaccount.blob.core.windows.net` should return a private IP address such as `10.0.0.5`.

If the translation and name resolution fail, verify the virtual network settings to ensure that DNS translation requests are forwarded to the Azure-provided DNS `168.63.129.16`. If the BlobFuse hosting VM is configured to forward to a custom DNS server, verify the custom DNS settings to ensure they forward DNS requests to the Azure-provided DNS `168.63.129.16`.

To resolve DNS issues when integrating a private endpoint with Azure Private DNS, validate that the private endpoint has the proper DNS record in the Private DNS Zone. If the private endpoint was deleted and recreated, a new IP might exist or duplicate records might be present, which can cause clients to use round-robin and make connectivity unstable. You can also validate whether the DNS settings of the Azure VM have the correct DNS servers. DNS settings can be defined at the virtual network level and NIC level. You can't configure DNS settings inside the guest OS VM NIC.

For custom DNS servers, make sure that custom DNS Server forwards all requests to `168.63.129.16`. If it does, you should be able to consume Azure Private DNS zones correctly. If it doesn't, you might need to create a conditional forwarder either to: private link zone or original PaaS Service Zone.

If a custom DNS has root hits only, then it's best to have a forwarder configured to `168.63.129.16`, which improves performance and doesn't require any extra conditional forwarding setting.

If a custom DNS has DNS forwarders to another DNS server (not Azure-provided DNS), then you need to create a conditional forwarder to original PaaS domain zone (that is, storage you should configure `blob.core.windows.net` conditional forwarder to `168.63.129.16`). Keep in mind using that approach makes all DNS requests to storage account with or without a private endpoint resolved by Azure-provided DNS. By having multiple custom DNS servers in Azure help to get better high availability for requests coming from on-premises.

### BlobFuse killed by OOM

The "OOM Killer" or "Out of Memory Killer" is a process that the Linux kernel employs when the system is critically low on memory. Based on its algorithm, it kills one or more processes to free up memory space. BlobFuse can be one such process. To investigate whether BlobFuse was killed by the OOM killer, run the following command:

```bash
dmesg -T | egrep -i 'killed process'
```

If the BlobFuse process ID (PID) appears in the output, the OOM killer sends a SIGKILL signal to BlobFuse. If BlobFuse isn't running as a service, it doesn't restart automatically and you must manually mount again. If this condition keeps happening, monitor the system and investigate why the system is running low on memory. You might need to upgrade the VM if such high memory usage is expected.

### Unable to access HNS enabled storage account behind a private end point

For HNS-enabled accounts, always add `type: adls` under the `azstorage` section in your configuration file. Avoid using `endpoint` unless your storage account is behind a private endpoint. BlobFuse uses both blob and DFS endpoints to connect to the storage account. You must expose both endpoints over the private endpoint for BlobFuse to function properly.

To create a private-endpoint for DFS in Azure portal: Go to your storage account -> Networking -> Private Endpoint connections. Select `+ Private endpoint`, fill in Subscription, Resource Group, Name, Network Interface Name, and Region. Select next and under Target subresource select `dfs`. Select Virtual network and select virtual network and Subnet. Select DNS. Select Yes for Integrate with private DNS. Select the Subscription and Resource Group for your private link DNS. Select Next, Next, and select Create.

### Failed to initialize new pipeline [configuration error in azstorage [account name not provided]]

Make sure the configuration file has `azstorage` section in your configuration file.

The [BlobFuse base configuration file](https://github.com/Azure/azure-storage-fuse/blob/main/setup/baseConfig.yaml) contains a list of all settings and a brief explanation of each setting. Use the [sample file cache configuration file](https://github.com/Azure/azure-storage-fuse/blob/main/sampleFileCacheConfig.yaml) or the [sample block cache configuration file](https://github.com/Azure/azure-storage-fuse/blob/main/sampleBlockCacheConfig.yaml) to get started quickly by using some basic settings for each of those scenarios.

### Failed to mount in proxy setup [proxyconnect tcp: dial tcp: lookup : no such host]

Make sure to set the proxy URL in the environment variable `https_proxy` or `http_proxy` and that it's accessible to BlobFuse process. If using private endpoint make sure that it's pointing to the `endpoint` in `azstorage` section in config. Alternatively, have a DNS resolution where `account.blob.core.windows.net` can be resolved back to the private endpoint. In case of HNS account, make sure to have the private endpoint configured for both blob and dfs accounts.

### BlobFuse establishes HTTPS communication with blobfuse2.z13.web.core.windows.net

On mount, BlobFuse tries to check if there's an upgrade available. It makes a connection to `blobfuse2.z13.web.core.windows.net` and fetches the latest version details. Due to a network policy or a firewall, if this call fails, mount continues. In case a new version is available, a message on shell is printed calling for an upgrade. In case of failure, only a log message is dumped and it's harmless for any file-system operation or mount. If you don't want BlobFuse to make such check, add `--disable-version-check=true` CLI parameter in your mount command.

## Common problems after a successful mount

This section lists common problems that can occur after successfully mounting a container.

### Errno 24: Failed to open file /mnt/tmp/root/filex in file cache.  errno = 24 OR Too many files open error

`Errno 24` in Linux corresponds to a "Too many files open" error. This error occurs when an application opens more files than the system allows. BlobFuse typically allows 20 fewer files than the ulimit value that you set in Linux. Usually, the Linux limit is 1,024 per process. For example, BlobFuse allows 1,004 open file descriptors at a time. To fix this problem, edit `/etc/security/limits.conf` in Ubuntu and add these two lines:

```
soft nofile 16384
hard nofile 16384
```

The value `16384` refers to the number of allowed open files. You must reboot after editing this file for BlobFuse to pick up the new limits. You might increase the limit by using the command `ulimit -n 16834`. However, this command doesn't work in Ubuntu.

### Input/output error

If you mounted a blob container successfully but failed to create a directory or upload a file, it might be that you mounted a blob container from a Premium (Page) blob account, which doesn't support Block blob. BlobFuse uses Block Blobs as files and requires accounts that support Block blobs.

`mkdir: cannot create directory ‘directoryname' : Input/output error`

### Unexplainable high storage account list usage costs

The most likely reason for high storage account list usage costs is automatic scanning triggered by `updatedb` through the built-in `mlocate` service that is deployed with Linux VMs. `mlocate` is a built-in service that acts as a search tool. The service is added under `/etc/cron.daily` to run daily and triggers the `updatedb` service to scan every directory on the server. The service rebuilds the file index in the database to keep search results up-to-date.

To resolve this issue, type the following command in the shell prompt: `ls -l /etc/cron.daily/mlocate`. If `mlocate` is present in `/etc/cron.daily`, then add BlobFuse to the exclusion list so that the BlobFuse mount directory isn't scanned by `updatedb`. Update the `updatedb.conf` file. 

1. To update that file, type `cat /etc/updatedb.conf`.

   The contents appear similar to the following:

   ```
   PRUNE_BIND_MOUNTS="yes"

   PRUNENAMES=".git .bzr .hg .svn"

   PRUNEPATHS="/tmp /var/spool /media /var/lib/os-prober /var/lib/ceph /home/.ecryptfs /var/lib/schroot"

   PRUNEFS="NFS nfs nfs4 rpc_pipefs afs binfmt_misc proc smbfs autofs iso9660 ncpfs coda devpts ftpfs devfs devtmpfs fuse.mfs shfs sysfs cifs lustre tmpfs usbfs udf fuse.glusterfs fuse.sshfs curlftpfs ceph fuse.ceph fuse.rozofs ecryptfs fusesmb"
   ```

1. Add the BlobFuse mount path (for example: `/mnt`) to the `PRUNEPATHS`.

1. Add "Blobfuse2" and "fuse" to the `PRUNEFS`. Adding both values doesn't cause any harm.

   To automate this configuration at pod creation, create a new `configmap` in the cluster, which contains the new configuration about the script. Then, create a `DaemonSet` with the new `configmap` which could apply the configuration changes to every node in the cluster.

   ```
   Example:
   configmap file: (testcm.yaml)
   apiVersion: v1
   kind: ConfigMap
   metadata:
   name: testcm
   data:
   updatedb.conf: |
   PRUNE_BIND_MOUNTS="yes"
   PRUNEPATHS="/tmp /var/spool /media /var/lib/os-prober /var/lib/ceph /home/.ecryptfs /var/lib/schroot /mnt /var/lib/kubelet"
   PRUNEFS="NFS nfs nfs4 rpc_pipefs afs binfmt_misc proc smbfs autofs iso9660 ncpfs coda devpts ftpfs devfs devtmpfs fuse.mfs shfs sysfs cifs lustre tmpfs usbfs udf fuse.glusterfs use.sshfs curlftpfs ceph fuse.ceph fuse.rozofs ecryptfs fusesmb fuse Blobfuse2"
   DaemonSet file: (testcmds.yaml)
   apiVersion: apps/v1
   kind: DaemonSet
   metadata:
   name: testcmds
   labels:
   test: testcmds
   spec:
   selector:
   matchLabels:
   name: testcmds
   template:
   metadata:
   labels:
   name: testcmds
   spec:
   tolerations:
   - key: "kubernetes.azure.com/scalesetpriority"
   operator: "Equal"
   value: "spot"
   effect: "NoSchedule"
   containers:
   - name: mypod
   image: debian
   volumeMounts:
   - name: updatedbconf
   mountPath: "/tmp"
   - name: source
   mountPath: "/etc"
   command: ["/bin/bash","-c","cp /tmp/updatedb.conf /etc/updatedb.conf;while true; do sleep 30; done;"]
   restartPolicy: Always
   volumes:
   - name: updatedbconf
   configMap:
   name: testcm
   items:
   - key: "updatedb.conf"
   path: "updatedb.conf"
   - name: source
   hostPath:
   path: /etc
   type: Directory
  
   ```

### File contents aren't in sync with storage

Refer to the file cache component setting `timeout-sec`.

### Failed to unmount

Unmount fails when a file is open or when a user or process changes directories into the mount directory or its subdirectories. Ensure that no files are in use and try the unmount command again. Even `umount -f` doesn't work if the mounted files or directories are in use. `umount -l` performs a lazy unmount, meaning it unmounts automatically when the mounted files are no longer in use.

### BlobFuse mounts but isn't functioning at all

Anti-malware and antivirus software can block FUSE functionality. In such cases, although the mount command is successful and the BlobFuse binary is running, the FUSE functionality doesn't work. One way to identify this problem is to turn on debug logs and mount BlobFuse. If you don't see any logs coming from BlobFuse, you might have encountered this problem. Stop the antivirus software and try again. In such cases, mounting through `/etc/fstab` works because it executes the mount command before the anti-malware software starts.

### File cache temp directory not empty

To ensure that you don't have leftover files in your file cache temp directory, unmount rather than stopping BlobFuse. If you stop BlobFuse without unmounting, set `cleanup-on-start` in your configuration file for the next mount to clear the temp directory.

### Unable to modify existing file (error: invalid argument)

By default, `writeback-cache` is enabled for libfuse3 and this setting might cause append and write operations to fail. You can either disable writeback-cache, which might reduce performance, or configure BlobFuse to ignore open flags that the user provides so it works with writeback-cache.

To disable writeback-cache, add `disable-writeback-cache: true` under the libfuse section in your configuration file.

To make it work with writeback-cache, add `ignore-open-flags: true` under the libfuse section in your configuration file.

### Unable to list files and directories for flat-namespace accounts

For non-HNS accounts, BlobFuse expects special directory marker files to exist in the container to identify a directory. If these files don't exist, set `virtual-directory: true` in the `azstorage` section.

### File size and LMT update but file contents don't refresh

BlobFuse supports both fuse2 and fuse3 compatible Linux distributions. In all Linux distributions, the kernel caches file contents in its page cache. As long as the cache is valid, the system serves read and write operations from the cache. Calls don't reach the file system drivers, which in this case is BlobFuse. The system invalidates this page cache when the page is swapped out, the user manually clears it through the CLI, or the file system driver requests it.

In fuse2-compliant distributions, libfuse doesn't support invalidating the page cache. Contents once cached will remain with the kernel until the user manually clears the page cache or the kernel decides to swap it out. This means that even if the file size or LMT has changed and BlobFuse decides to refresh the content by redownloading the file, the user will still get stale contents on read.

In fuse3-compliant distributions, BlobFuse configures libfuse to invalidate the page cache when the file size or LMT changes, so this problem doesn't occur.

If you observe that list or stat calls to a file show updated time or size but the contents don't reflect the changes, first confirm with BlobFuse logs that the file was indeed downloaded fresh. If the file-cache-timeout hasn't expired, then BlobFuse continues using the current version of the file persisted in the temp cache and the contents don't refresh. If BlobFuse downloaded the latest file and you still observe stale contents, then manually clear the kernel page cache by using the `sysctl -w vm.drop_caches=3` command.

If your workflow involves updating the file directly in the container (not using BlobFuse) and you want to get the latest contents on the BlobFuse mount, then do the following steps (for fuse3-compliant Linux distributions only):

- Set all timeouts in libfuse section to 0 (entry, attribute, negative).

- Remove attr_cache from your pipeline section in config.

- Set file-cache-timeout to 0.

- In libfuse section of your configuration file add "disable-writeback-cache: true".

## BlobFuse Health Monitor

One of the BlobFuse features is the health monitor. It provides more insight into how your BlobFuse instance behaves with the rest of your machine. Visit [here](https://github.com/Azure/azure-storage-fuse/blob/main/tools/health-monitor/README.md) to set it up. This feature is currently in preview.

## Problems with build

Make sure you correctly set up your Go development environment. Ensure you install fuse3 or fuse2, for example:

```bash
sudo apt-get install fuse3 libfuse3-dev -y

```

## Issues with private endpoints for hierarchical namespace enabled storage accounts

When you access a hierarchical namespace enabled Azure storage account behind private endpoints, you need to create **two separate private endpoints** to ensure proper connectivity:

1. **Private Endpoint for DFS**  
   - Target: `privatelink.dfs.core.windows.net`  
      - Use this endpoint to access the Data Lake Storage Gen2 functionality.

2. **Private Endpoint for Blob**  
   - Target: `privatelink.blob.core.windows.net`  
   - Use this endpoint to access Blob Storage operations.

### Why you need both endpoints

Hierarchical namespace-enabled storage accounts use separate endpoints for blob and DFS operations:

- The Data Lake Storage endpoint (`dfs.core.windows.net`) handles namespace-related operations such as directory and file management.

- The Blob Storage endpoint (`blob.core.windows.net`) handles operations such as streaming data to and from blobs.

## See also

- [Enable logs for BlobFuse](blobfuse2-enable-logs.md)
- [Troubleshooting BlobFuse](blobfuse2-troubleshooting.md)
- [Known issues with BlobFuse](blobfuse2-known-issues.md)
- [BlobFuse frequently asked questions](blobfuse2-faq.yml)
- [What is BlobFuse?](blobfuse2-what-is.md)
