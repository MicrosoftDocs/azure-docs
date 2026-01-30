---
title: Install BlobFuse
titleSuffix: Azure Storage
description: Install BlobFuse to mount an Azure Blob Storage container through the Linux file system.
author: normesta
ms.author: normesta

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 1/29/2026

ms.custom: linux-related-content

# Customer intent: "As a Linux user, I want to install BlobFuse on my system, so that I can set up the necessary software to mount Azure Blob Storage containers as a file system."
---

# Install BlobFuse

You can install BlobFuse from Microsoft repositories for Linux by using simple commands to install the BlobFuse package. If no package is available for your distribution and version, you can build the binary from source code.

## Determine if a package is available

First, check your Linux distribution and version by running the following command:

```bash
cat /etc/*-release
```

To determine if a package is available for your distribution and version, see [BlobFuse releases](https://github.com/Azure/azure-storage-fuse/releases).

If no package is available for your distribution or version, you need to build the binary from source code. For detailed instructions, see the [Build the binaries from source code](#build-the-binaries-from-source-code) section of this article.

## Install BlobFuse from the Microsoft software repositories for Linux

If a package is available for your Linux distribution and version, configure the [Linux Package Repository for Microsoft Products](/windows-server/administration/Linux-Package-Repository-for-Microsoft-Software). The following sections show example commands.

### [RHEL](#tab/RHEL)

For Red Hat Enterprise Linux distributions, run the following commands.

```bash
sudo rpm -Uvh https://packages.microsoft.com/config/rhel/<version-number>/packages-microsoft-prod.rpm
sudo dnf update
sudo yum install fuse3 fuse3-libs blobfuse2
```

Replace the `<version-number>` placeholder in this command with `8` or `7` depending on the version of your distribution.

### [Ubuntu](#tab/Ubuntu)

For Ubuntu distributions, run the following commands.

```bash
sudo wget https://packages.microsoft.com/config/ubuntu/<version-number>/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt-get update
sudo apt-get install fuse3 blobfuse2
```

Replace the `<version-number>` placeholder with your Ubuntu version (for example: `20.04` or `22.04`).

### [SLES](#tab/SLES)

For SUSE Linux Enterprise (SLES) distributions, run the following commands.

```bash
sudo rpm -Uvh https://packages.microsoft.com/config/sles/15/packages-microsoft-prod.rpm
sudo zypper refresh
sudo zypper install fuse3 blobfuse2
```

### [Azure Linux](#tab/tdnf)

For Azure Linux distributions, run the following commands.

```bash
sudo tdnf install -y https://packages.microsoft.com/config/mariner/2.0/packages-microsoft-prod.rpm
sudo tdnf repolist --refresh
sudo tdnf install fuse fuse3 blobfuse2
```

---

## Build the binaries from source code

If no package is available for your distribution, you can build BlobFuse from source code. First, install `Go 1.20.x` or later. For installation instructions, see [Go](https://go.dev/doc/install). Then, follow these steps to clone the repository and build the binaries.

### Clone the repository

Use the following commands to clone the BlobFuse repository:

```bash
git clone https://github.com/Azure/azure-storage-fuse/
cd azure-storage-fuse
git checkout -b main origin/main
```

> [!NOTE]
> If Git isn't installed on your system, install it by running `sudo apt-get install git` (Ubuntu/Debian) or use the appropriate command for your distribution.

### Install the dependencies

#### [RHEL](#tab/RHEL)

For Red Hat Enterprise Linux distributions, run the following command.

```bash
sudo yum install fuse3 fuse3-devel
```

#### [Ubuntu](#tab/Ubuntu)

For Ubuntu distributions, run the following command.

```bash
sudo apt-get install fuse3 libfuse3-dev 
```

#### [SLES](#tab/SLES)

For SUSE Linux Enterprise (SLES) distributions, run the following command.

```bash
sudo zypper install fuse3 libfuse3-dev 
```

#### [Azure Linux](#tab/tdnf)

For Azure Linux distributions, run the following command.

```bash
sudo tdnf install fuse libfuse-dev fuse3 libfuse3-dev 
```

---

### Build BlobFuse

Run the build script located in the root folder of the repository.

#### [RHEL](#tab/RHEL)

For Red Hat Enterprise Linux distributions, run the following command.

```bash
./build.sh
```

#### [Ubuntu](#tab/Ubuntu)

For Ubuntu distributions, run the following command.

```bash
./build.sh fuse2
```

#### [SLES](#tab/SLES)

For SUSE Linux Enterprise (SLES) distributions, run the following command.

```bash
./build.sh
```

#### [Azure Linux](#tab/tdnf)

For Azure Linux distributions, run the following command.

```bash
./build.sh
```

---

To build the optional health monitor binary, run the following command:

```bash
./build.sh health
```

## Next steps

- [Configure BlobFuse](blobfuse2-configure.md)
- [Mount an Azure Blob Storage container](blobfuse2-mount-container.md)
- [BlobFuse commands](blobfuse2-commands.md)

## See also

- [What is BlobFuse?](blobfuse2-what-is.md)
