---
title: Use extended groups in Azure HPC Cache
description: How to configure directory services for client access to storage targets in Azure HPC Cache
author: ekpgh
ms.service: hpc-cache
ms.topic: how-to
ms.date: 07/27/2022
ms.author: rohogue
---

# Configure directory services

The **Directory services** settings allow your Azure HPC Cache to use an outside source to authenticate users for accessing back-end storage.

You might need to enable **Extended groups** if your workflow includes NFS storage targets and clients that are members of more than 16 groups.

After you click the button to enable extended groups, you must choose the source that Azure HPC Cache will use to get user and group credentials.

* [Active Directory](#configure-active-directory) - Get credentials from an external Active Directory server. You can't use Microsoft Entra ID for this task.
* [Flat file](#configure-file-download) - Download `/etc/group` and `/etc/passwd` files from a network location.
* [LDAP](#configure-ldap) - Get credentials from a Lightweight Directory Access Protocol (LDAP)-compatible source.

> [!NOTE]
> Make sure that your cache can access its group information source from inside its secure subnetwork.<!-- + details/examples -->

The **Username downloaded** field shows the status of the most recent group information download.

![Screenshot of directory services page settings page in portal, with the Yes option selected for extended groups, and the drop-down menu labeled 'Download source' open.](media/directory-services-select-group-source.png)

HPC Cache checks the source for updates once an hour. There isn't a direct way to request an immediate poll for updates, but as a workaround you might consider disabling extended groups (change the **Enable extended groups** setting to **No**) and then re-enabling it. This action causes HPC Cache to re-read the settings, but it also can disrupt client access while the group information is unavailable.

## Configure Active Directory

This section explains how to set up the cache to get user and group credentials from an external Active Directory (AD) server.

Under **Active directory details**, supply these values:

* **Primary DNS** - Specify the IP address of a domain name server that the cache can use to resolve the AD domain name.

* **Secondary DNS** (optional) - Enter the address of a name server to use if the primary server is unavailable.

* **AD DNS domain name** - Provide the fully qualified domain name of the AD server that the cache will join to get the credentials.

* **Cache server name (computer account)** - Set the name that will be assigned to this HPC Cache when it joins the AD domain. Specify a name that is easy to recognize as this cache. The name can be up to 15 characters long and can include capital or lowercase letters, numbers, and hyphens (-).

In the **Credentials** section, provide an AD administrator username and password that the Azure HPC Cache can use to access the AD server. This information is encrypted when stored, and can't be queried.

Save the settings by clicking the button at the top of the page.

![screenshot of Download details section with Active Directory values filled in](media/group-download-details-ad.png)

## Configure file download

These values are required if you want to download files with your user and group information. The files must be in the standard Linux/UNIX `/etc/group` and `/etc/passwrd` format.

* **User file URI** - Enter the complete URI for the `/etc/passwrd` file.
* **Group file URI** - Enter the complete URI for the `/etc/group` file.

![screenshot of Download details section for a flat file download](media/group-download-details-file.png)

## Configure LDAP

Fill in these values if you want to use a non-AD LDAP source to get user and group credentials. Check with your LDAP administrator if you need help with these values.

* **LDAP server** - Enter the fully qualified domain name or the IP address of the LDAP server to use. <!-- only one, not up to 3 -->

* **LDAP base DN** - Specify the base distinguished name for the LDAP domain, in DN format. Ask your LDAP administrator if you don’t know your base DN.

The server and base DN are the only required settings to make LDAP work, but the additional options make your connection more secure.

![screenshot of the LDAP configuration area of the directory services page settings page](media/group-download-details-ldap.png)

In the **Secure access** section, you can enable encryption and certificate validation for the LDAP connection. After you click **Yes** to enable encryption, you have these options:

* **Validate certificate** - When this is set, the LDAP server's certificate is verified against the certificate authority in the URI field below.

* **CA certificate URI** - Specify the path to the authoritative certificate. This can be a link to a CA-validated certificate or to a self-signed certificate. This field is required to use the externally validated certificates setting.

* **Auto-download certificate** - Choose **Yes** if you want to try to download a certificate as soon as you submit these settings.

Fill in the **Credentials** section if you want to use static credentials for LDAP security. This information is encrypted when stored, and can't be queried.

* **Bind DN** - Enter the bind distinguished name to use to authenticate to the LDAP server. (Use DN format.)
* **Bind password** - Provide the password for the bind DN.

## Next steps

* Learn more about client access in [Mount the Azure HPC Cache](hpc-cache-mount.md)
* If your credentials don't download correctly, consult the administrator for your source of credentials. Open a [support ticket](hpc-cache-support-ticket.md) if needed.
