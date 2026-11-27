---
title: Microsoft Entra Kerberos for Linux clients
description: Learn how to configure Linux clients to access SMB Azure file shares with Microsoft Entra Kerberos cloud trust authentication for hybrid identities.
author: pgangal-git
ms.service: azure-file-storage
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 11/26/2026
ms.author: pgangal
# Customer intent: "As a Linux administrator, I want to configure Microsoft Entra Kerberos cloud trust authentication, so that hybrid users can access SMB Azure file shares from Linux clients."
---

# Microsoft Entra Kerberos for Linux clients

**Applies to:** :heavy_check_mark: SMB file shares

This article explains how to configure a Linux client to mount an SMB Azure file share by using Microsoft Entra Kerberos authentication through a cloud trust between on-premises Active Directory Domain Services (AD DS) and Microsoft Entra ID. You configure the Linux Kerberos client, authenticate with your on-premises credentials, and mount the share without using a storage account key.

> [!IMPORTANT]
> The cloud trust procedure in this article supports **hybrid user identities only**. It doesn't support cloud-only identities. Hybrid identities are on-premises AD DS identities synchronized to Microsoft Entra ID by using [Microsoft Entra Connect Sync](/entra/identity/hybrid/connect/how-to-connect-sync-whatis) or [Microsoft Entra Cloud Sync](/entra/identity/hybrid/cloud-sync/what-is-cloud-sync).

For background, see [Configure a cloud trust between on-premises AD DS and Microsoft Entra ID for accessing Azure Files](storage-files-identity-auth-hybrid-cloud-trust.md).

## Prerequisites

### Azure Files and identity requirements

Before configuring the Linux client, complete the following steps:

- Enable [Microsoft Entra Kerberos authentication](storage-files-identity-auth-hybrid-cloud-trust.md#enable-microsoft-entra-kerberos-authentication) on the storage account that contains your SMB Azure file share.
- [Grant admin consent](storage-files-identity-auth-hybrid-cloud-trust.md#grant-admin-consent-to-the-new-service-principal) to the application created for the storage account.
- Review the [multifactor authentication requirements](storage-files-identity-auth-hybrid-cloud-trust.md#disable-multifactor-authentication-on-the-storage-account) for the storage account application. If a Conditional Access policy requires MFA for this application, exclude the storage account application as documented. Don't disable MFA for users or unrelated applications.
- Assign [share-level permissions](storage-files-identity-assign-share-level-permissions.md) through Azure role-based access control (Azure RBAC) or configure a default share-level permission. Also configure the required [directory and file-level permissions](storage-files-identity-configure-file-level-permissions.md).
- [Create and configure the Microsoft Entra Kerberos Trusted Domain Object](storage-files-identity-auth-hybrid-cloud-trust.md#create-and-configure-the-microsoft-entra-kerberos-trusted-domain-object) to establish the cloud trust for your on-premises AD DS domain. Follow the server-side trust setup in that article, then return here for Linux client configuration instead of following its Windows client steps.
- Verify that the storage account app registration uses a lowercase `cifs` identifier URI prefix, such as `cifs/mystorageaccount.file.core.windows.net`. If it uses uppercase `CIFS`, follow [Update the app registration identifier URI](identity-kerberos-authentication-macos.md#update-the-app-registration-identifier-uri). Although those instructions appear in the macOS article, the identifier URI update also applies to this Linux configuration.

### Linux client requirements

You need the following:

- A local account with `sudo` permissions.
- A hybrid user account with access to the Azure file share.
- DNS resolution and network connectivity to the on-premises AD DS domain controllers to obtain the initial Kerberos ticket with `kinit`.
- HTTPS connectivity to `login.microsoftonline.com` on TCP port 443 for the Microsoft Entra Kerberos endpoint.
- DNS resolution for the storage account file endpoint and SMB connectivity on TCP port 445. For network configuration guidance, see [Azure Files networking considerations](storage-files-networking-overview.md).
- A client clock synchronized with your AD DS environment.
- `cifs-utils`, OpenSSL, and an MIT Kerberos client with HTTPS KDC proxy support. The required Kerberos version depends on the OpenSSL version:

  | OpenSSL version | Minimum MIT Kerberos version |
  | --- | --- |
  | OpenSSL 1.x | 1.17 |
  | OpenSSL 3.0 or later | 1.20 |

## Install and verify client packages

Select your Linux distribution for package installation instructions. Use a release that your vendor maintains, and verify that the installed package versions meet the [Linux client requirements](#linux-client-requirements).

# [Ubuntu and Debian](#tab/ubuntu-debian)

Install the SMB and Kerberos client packages, including the TLS plugin used to contact Microsoft Entra Kerberos:

```bash
sudo apt update
sudo apt install cifs-utils keyutils openssl krb5-user krb5-config krb5-k5tls
```

Check the installed versions:

```bash
dpkg-query -W cifs-utils openssl krb5-user krb5-k5tls
```

> [!IMPORTANT]
> Ubuntu 22.04 can provide Kerberos 1.17 with OpenSSL 3.0.2, which doesn't meet the requirements for this configuration. If you have this combination, upgrade to a maintained release with compatible packages, such as Ubuntu 24.04, or use a compatible Kerberos build. If you must build Kerberos from source, ensure that the build includes HTTPS KDC proxy support and meets the version requirements before continuing.

# [Red Hat Enterprise Linux](#tab/rhel)

On Red Hat Enterprise Linux (RHEL), check the installed OpenSSL version:

```bash
rpm -q openssl
```

Install the SMB and Kerberos client packages:

```bash
sudo dnf install cifs-utils keyutils krb5-workstation krb5-libs
```

Check the installed versions against the [Linux client requirements](#linux-client-requirements):

```bash
rpm -q cifs-utils krb5-workstation krb5-libs openssl
```

For distribution-specific guidance, see the Red Hat documentation for [mounting an SMB share](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/7/html/storage_administration_guide/mounting_an_smb_share) and [configuring a Kerberos 5 client](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/7/html/system-level_authentication_guide/configuring_a_kerberos_5_client). These references describe RHEL 7. Use the corresponding documentation for your installed release when reviewing distribution-specific details.

# [SUSE Linux Enterprise Server](#tab/sles)

On SUSE Linux Enterprise Server (SLES), refresh package information and check the installed versions:

```bash
sudo zypper refresh
zypper info openssl
zypper info cifs-utils
zypper info krb5-client
```

If you don't have a required package installed, use your distribution's package manager to install it before continuing. SUSE also requires the credential cache setting described in [Configure the Kerberos client](#configure-the-kerberos-client).

---

## Configure the Kerberos client

The following configuration applies whether you use your distribution's Kerberos packages or a custom Kerberos build.

1. Back up your existing Kerberos configuration, if present. Create or edit `/etc/krb5.conf` and merge the following settings with any settings your environment already requires.

   Replace the example values as follows:

   | Example value | Replace with |
   | --- | --- |
   | `ADDSDOMAIN.NET` | Your on-premises AD DS Kerberos realm, in uppercase. |
   | `addsdomain.net` | Your on-premises AD DS domain or a reachable domain controller hostname. |
   | `00000000-0000-0000-0000-000000000000` | Your Microsoft Entra tenant ID. |

   Keep `KERBEROS.MICROSOFTONLINE.COM` unchanged and in uppercase.

   ```ini
   [libdefaults]
       default_realm = ADDSDOMAIN.NET
       kdc_timesync = 1
       ccache_type = 4
       forwardable = true
       proxiable = true
       rdns = false
       canonicalize = true

   [realms]
       ADDSDOMAIN.NET = {
           kdc = addsdomain.net
       }

       KERBEROS.MICROSOFTONLINE.COM = {
           kdc = https://login.microsoftonline.com:443/00000000-0000-0000-0000-000000000000/kerberos
       }
   ```

1. On SUSE, also add the following setting under `[libdefaults]`:

   ```ini
   default_ccache_name = FILE:/tmp/krb5cc_%{uid}
   ```

   For details about the SUSE credential cache configuration, see [kinit: Credential cache directory does not exist](https://support.scc.suse.com/s/kb/kinit-Credential-cache-directory-run-user-0-krb5cc-does-not-exist-while-getting-default-ccache-1583239434013?language=en_US).

## Authenticate and mount the file share

The following commands store Kerberos credentials in root's credential cache and mount the share by using that cache. The `cruid=0` mount option matches the use of `sudo kinit`. Don't mix this example with a ticket you get only in an unprivileged user's credential cache.

1. Authenticate by using your on-premises AD DS user account. Replace `username` and `ADDSDOMAIN.NET` with your username and realm:

   ```bash
   sudo kinit username@ADDSDOMAIN.NET
   ```

   Enter the user's password when prompted. Don't include passwords in command arguments or scripts.

1. Verify that a ticket is present in the same credential cache:

   ```bash
   sudo klist
   ```

1. Create a mount point. Replace `mystorageaccount` with your storage account name:

   ```bash
   sudo mkdir -p /mnt/mystorageaccount
   ```

1. Mount the share. Replace `mystorageaccount` and `myfileshare` with your storage account and file share names:

   ```bash
   sudo mount -v -t cifs //mystorageaccount.file.core.windows.net/myfileshare /mnt/mystorageaccount -o sec=krb5,cruid=0,serverino,nosharesock,actimeo=30,mfsymlinks
   ```

1. Verify that the share is mounted and that the user has the expected access:

   ```bash
   findmnt /mnt/mystorageaccount
   ls -la /mnt/mystorageaccount
   sudo klist
   ```

   After access, check the ticket cache for a service ticket for `cifs/mystorageaccount.file.core.windows.net`.

For more mount options, see [Mount SMB Azure file shares on Linux clients](storage-how-to-use-files-linux.md).

> [!NOTE]
> Kerberos tickets expire. If authentication fails after a ticket expires, get a new ticket by using `sudo kinit` and retry access. This procedure doesn't configure unattended ticket renewal or mounting at boot time.

## Troubleshoot authentication and mounting

- **The initial authentication fails:** Check your username, uppercase realm, DNS configuration, domain controller connectivity, and clock synchronization. The initial `kinit` in this procedure requires access to on-premises AD DS.
- **The HTTPS Kerberos request fails:** Verify the Kerberos and OpenSSL version combination, HTTPS KDC proxy support, tenant ID, and connectivity to `login.microsoftonline.com` on TCP port 443. On Ubuntu and Debian, verify that `krb5-k5tls` is installed.
- **The credential cache can't be found:** Run `sudo klist` to inspect the cache used by the mount command. On SUSE, confirm that you added the `default_ccache_name` setting under `[libdefaults]`.
- **Authentication succeeds but mounting fails:** Check the cloud trust configuration, admin consent, lowercase `cifs` identifier URI, storage account DNS resolution, and connectivity on TCP port 445.
- **The share mounts but file access is denied:** Check both share-level permissions and directory and file-level permissions. Obtaining a Kerberos ticket doesn't grant access by itself.

To collect more information about the initial authentication, run `kinit` with Kerberos tracing enabled:

```bash
sudo KRB5_TRACE=/dev/stdout kinit username@ADDSDOMAIN.NET
```

Review trace output for sensitive information before sharing it.

## See also

- [Overview of Azure Files identity-based authentication options for SMB access](storage-files-active-directory-overview.md)
- [Configure a cloud trust between on-premises AD DS and Microsoft Entra ID](storage-files-identity-auth-hybrid-cloud-trust.md)
- [Assign share-level permissions](storage-files-identity-assign-share-level-permissions.md)
- [Mount SMB Azure file shares on Linux clients](storage-how-to-use-files-linux.md)