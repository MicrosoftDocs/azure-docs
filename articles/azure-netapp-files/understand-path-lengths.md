---
title: Understand path lengths in Azure NetApp Files 
description: Learn about the supported languages and character sets with NFS, SMB, and dual-protocol configurations in Azure NetApp Files. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 02/08/2024
ms.author: anfdocs
---

# Understand path lengths in Azure NetApp Files 

File and path length refers to the number of Unicode characters in a file path, including directories. This limit is a factor if the individual character lengths, which are determined by the size of the character in bytes. For instance, NFS and SMB allow path components of 255 bytes. The file encoding format of ASCII uses 8-bit encoding, which means that file path components (such as a file or folder name) in ASCII can be up to 255 characters since ASCII characters are 1 byte in size. 

The following table shows the supported component and path lengths in Azure NetApp Files volumes:

| | NFS | SMB |
| - | - | - | 
| Path component size | 255 bytes | 255 bytes | 
| Path length size | Unlimited | Default: 255 bytes <br /> Maximum in later Windows versions: 32,767 bytes |
| Maximum path size for transversal | 4,096 bytes | 255 bytes |

>[!NOTE]
>Dual-protocol volumes use the lowest maximum value. 

If an SMB share name is `\\SMB-SHARE`, that adds 11 Unicode characters to the path length because each character is 1 byte. If the path to a specific file is `\\SMB-SHARE\apps\archive\file`, that is 29 Unicode characters; each character, including the slashes, is 1 byte. For NFS mounts, the same concepts apply. The mount path  `/AzureNetAppFiles` is 17 Unicode characters of 1 byte each. 

Azure NetApp Files supports the same path length for SMB shares that modern Windows servers support: [up to 32,767 bytes](/windows/win32/fileio/maximum-file-path-limitation). However, depending on the version of the Windows client, some applications might not be able to [support paths longer than 260 bytes](/windows/win32/fileio/naming-a-file). Individual path components (the values between slashes, such as file or folder names) support up to 255 bytes. For instance, a file name using the Latin capital “A” (which takes up 1 byte per character) in a file path in Azure NetApp Files can't exceed 255 characters. 

```
# mkdir 256charsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa 

mkdir: cannot create directory ‘256charsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa’: File name too long 

# mkdir 255charsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa 

# ls | grep 255 
255charsaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa 
```

## Discerning character sizes 

The Linux utility [`uniutils`](https://billposer.org/Software/unidesc.html) can be used to find the byte size of Unicode characters by typing multiple instances of the character instance and viewing the “bytes” field.  

The Latin capital A increments by 1 byte each time it is used (using a single hex value of 41, which is in the 0-255 range of ASCII characters).