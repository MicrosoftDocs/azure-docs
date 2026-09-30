---
title: Install AzCopy v10 on Linux by using a package manager
description: You can install AzCopy by using a Linux package that is hosted on the Linux Software Repository for Microsoft Products.

author: normesta
ms.service: azure-storage
ms.topic: how-to
ms.date: 10/28/2025
ms.author: normesta
ms.subservice: storage-common-concepts
ms.custom: ai-video-demo
ai-usage: ai-assisted
# Customer intent: As a Linux system administrator or developer, I want to install AzCopy using my distribution's package manager, so that I can easily maintain and update the tool while ensuring proper system integration for Azure Storage operations.
---

# Install AzCopy on Linux by using a package manager

This article helps you install [AzCopy](storage-use-azcopy-v10.md) by using popular Linux package managers (dnf, apt, zypper). When you install AzCopy, you make it available system-wide and can easily keep it updated through your regular system maintenance routines.

For more detailed guidance on installing these packages, see [Linux Software Repository for Microsoft Products](/linux/packages).

### [dnf (RHEL)](#tab/dnf)

1. Download the repository configuration package.

   ```bash
   curl -sSL -O https://packages.microsoft.com/config/<distribution>/<version>/packages-microsoft-prod.rpm
   ```

   Replace the `<distribution>` and `<version>` placeholders in this command with the Linux distribution and version that you're running on your machine. See [packages.microsoft.com](https://packages.microsoft.com/) to find the list of supported Linux distributions and versions.

   Use the `cat /etc/os-release` command to get the Linux distribution and version running on your machine. For example, if `Ubuntu` and `version 20.04` appears in the output of that command, then open the [packages.microsoft.com](https://packages.microsoft.com/) page, select **ubuntu**, and then verify that **20.04** appears in the list. Then, use that distribution and version in your comment.

   ````bash
   curl -sSL -O https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.rpm
   ````

1. Install the repository configuration package.

   ```bash
   sudo rpm -i packages-microsoft-prod.rpm
   ````

1. Delete the repository configuration package after you install it.

   ```bash
   rm packages-microsoft-prod.rpm
   ````

1. Update the package index files.

   ```bash
   sudo dnf update
   ```

1. Install AzCopy.

   ```bash
   sudo dnf install azcopy
   ```

### [zypper (openSUSE, SLES)](#tab/zypper)

1. Download the repository configuration package.

   ```bash
   curl -sSL -O https://packages.microsoft.com/config/<distribution>/<version>/packages-microsoft-prod.rpm
   ```

   Replace the `<distribution>` and `<version>` placeholders in this command with the Linux distribution and version that you're running on your machine. See [packages.microsoft.com](https://packages.microsoft.com/) to find the list of supported Linux distributions and versions.

   Use the `cat /etc/os-release` command to get the Linux distribution and version running on your machine. For example, if `Ubuntu` and `version 20.04` appears in the output of that command, then open the [packages.microsoft.com](https://packages.microsoft.com/) page, select **ubuntu**, and then verify that **20.04** appears in the list. Then, use that distribution and version in your comment.

   ````bash
   curl -sSL -O https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.rpm
   ````

1. Install the repository configuration package.

   ```bash
   sudo rpm -i packages-microsoft-prod.rpm
   ```

1. Delete the repository configuration package after you install it.

   ```bash
   rm packages-microsoft-prod.rpm
   ```

1. Update the package index files.

   ```bash
   sudo zypper --gpg-auto-import-keys refresh
   ```

1. Install AzCopy.

   ```bash
   sudo zypper install -y azcopy
   ```

### [apt (Ubuntu, Debian)](#tab/apt)

1. Download the repository configuration package.

   ```bash
   curl -sSL -O https://packages.microsoft.com/config/<distribution>/<version>/packages-microsoft-prod.deb
   ```

   Replace the `<distribution>` and `<version>` placeholders in this command with the Linux distribution and version that you're running on your machine. See [packages.microsoft.com](https://packages.microsoft.com/) to find the list of supported Linux distributions and versions.

   Use the `cat /etc/os-release` command to get the Linux distribution and version running on your machine. For example, if `Ubuntu` and `version 20.04` appears in the output of that command, then open the [packages.microsoft.com](https://packages.microsoft.com/) page, select **ubuntu**, and then verify that **20.04** appears in the list. Then, use that distribution and version in your comment.

   ````bash
   curl -sSL -O https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb
   ````

1. Install the repository configuration package.

   ```bash
   sudo dpkg -i packages-microsoft-prod.deb
   ```

1. Delete the repository configuration package after you install it.

   ```bash
   rm packages-microsoft-prod.deb
   ```

1. Update the package index files.

   ```bash
   sudo apt-get update
   ```

1. Install AzCopy.

   ```bash
   sudo apt-get install azcopy
   ```

# [tdnf (Azure Linux)](#tab/tdnf)

Install AzCopy.

```bash
sudo tdnf install azcopy
```

---

## Next steps

If you have questions, issues, or general feedback, submit them [on GitHub](https://github.com/Azure/azure-storage-azcopy).
