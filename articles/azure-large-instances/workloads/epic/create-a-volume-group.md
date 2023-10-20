---
title: Create a volume group
description: Explains how to create an ALI for Epic volume group.
titleSuffix: Azure Large Instances for Epic
ms.title: Create a volume group
ms.topic: conceptual
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: baremetal-infrastructure
ms.date: 06/01/2023
---

# Create a volume group
This article explains how to create an Azure Large Instances for Epic<sup>®</sup> volume group.
1. Discover storage using the following command.

    `[root@rhel101 ~]# lsblk -do KNAME,TYPE,SIZE,MODEL`

1. Create physical disk for database and journal using the WWIDs provided in the reference mapping above.

    `[root@rhel101 ~]# pvcreate /dev/mapper/<WWID`

1. Create and extend the volume groups.

```azurecli
[root @themetal05 ~] # vgcreate prodvg -s 8M /dev/mapper/<WWID>
Expected output: Volume group “prodvg” successfully created
[root @themetal05 ~] # vgextend prodvg /dev/mapper/<WWID>
Expected output: Volume group “prodvg” successfully extended
```

> [!Note]
> The “-s 8M” physical extent size has been used for the environment and was tested to yield the best performance.

4. Create logical volume.

```azurecli
[root @themetal05 ~] # lvcreate -L 2T -n jrnlv -i 8 -I 8M jrnvg
Expected output: Logical volume “jrnlv” created.
[root @themetal05 ~] # lvcreate -L 45T -n prodlv -i 32 -I 8M prodvg
Expected output: Logical volume “prodlv” created.
[root @themetal05 ~]# lvs
Expected output: lists all the logical volumes created.
```

> [!Note]
 > - `-L 45T` specifies the  logical volume size.  
 > - `-i 32` specifies the number of stripes, this is equal to the number of physical LUNs to scatter the logical volume.  
 > - `-I 8M` specifies the stripe size.

5. Make the file system
 
    `[root @themetal05 ~] # mkfs.xfs /dev/mapper/prodvg-prodlv`

6. Create the folders to mount.

```azurecli
[root @themetal05 ~] mkdir /prod0;
[root @themetal05 ~] mkdir /jrn
[root @themetal05 ~] mkdir /prod
```

7. Set required permissions.

```azurecli
[root @themetal05 ~] chmod 755 /prod01
[root @themetal05 ~] chmod 755 /jrn
[root @themetal05 ~] chmod 755 /prod
[root @themetal05 ~] chown root:root /prod01
[root @themetal05 ~] chown root:root /jrn
[root @themetal05 ~] chown root:root /prod
```

8. Add mount to /etc/fstab

```azurecli 
[root @themetal05 ~] /dev/mapper/prodvg-prod01 /prod01 xfs defaults 0 0
[root @themetal05 ~] /dev/mapper/jrnvg-jrn /jrn xfs defaults 0 0 
[root @themetal05 ~] /dev/mapper/instvg-prd /prd xfs defaults 0 0
```

9. Mount storage

     `mount -a`







