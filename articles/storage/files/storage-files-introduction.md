---
title: What is Azure Files?
description: An overview of Azure Files, a fully managed cloud file share service that supports SMB and NFS protocols for Windows, Linux, and macOS clients.
author: khdownie
ms.service: azure-file-storage
ms.topic: overview
ms.date: 08/17/2026
ms.author: kendownie
# Customer intent: As a cloud architect, I want to implement Azure Files for shared network storage, so that I can simplify file management and enhance accessibility across various operating systems in both cloud and hybrid environments.
---

# What is Azure Files?

Azure Files provides fully managed file shares in the cloud that you can access through the industry-standard [SMB](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) and [NFS](https://en.wikipedia.org/wiki/Network_File_System) protocols. You can mount Azure file shares concurrently from cloud and on-premises clients on Windows, Linux, and macOS — no additional software required.

| Protocol | Supported clients | Best for |
|---|---|---|
| SMB | Windows, Linux, macOS | General-purpose file shares, lift-and-shift apps, hybrid with Azure File Sync |
| NFS | Linux | Linux workloads, containers, HPC |
| [REST API](/rest/api/storageservices/file-service-rest-api) | All platforms | Programmatic access from applications |

## Why use Azure Files?

- **Replace or supplement on-premises file servers** — Mount Azure file shares directly or cache them on Windows servers with [Azure File Sync](../file-sync/file-sync-introduction.md). Use [identity-based authentication](storage-files-active-directory-overview.md) with on-premises Active Directory for seamless access control.
- **Lift and shift applications** — Migrate applications that expect shared file storage to Azure without code changes. Move both the application and its data, or keep the app on-premises and move only the data.
- **Simplify cloud development** — Store shared application settings, write diagnostic logs, and share dev/test tools across VMs — all from a centralized file share accessible via the REST API or standard file system I/O.
- **Containerized workloads** — Use Azure file shares as persistent volumes for stateful containers, providing shared storage regardless of which instance runs the container.

## Key benefits

- **Fully managed** — No hardware to manage, no OS to patch, no disks to replace. Azure handles infrastructure, updates, and backups.
- **Shared access** — Industry-standard SMB and NFS protocols ensure compatibility with existing applications, tools, and workflows.
- **Resilient** — Zone-redundant (ZRS) and geo-redundant (GRS) storage options protect against hardware failures and datacenter outages.
- **Familiar programmability** — Access data through [file system I/O APIs](/dotnet/api/system.io.file), [Azure Storage client libraries](/dotnet/api/overview/azure/storage.files.shares-readme), or the [REST API](/rest/api/storageservices/file-service-rest-api).
- **Scriptable** — Create, mount, and manage file shares using PowerShell, Azure CLI, the Azure portal, or Azure Storage Explorer.

## Get started

- [Plan for an Azure Files deployment](storage-files-planning.md)
- [Create a classic file share (SMB or NFS)](create-classic-file-share.md)
- [Create a file share with Microsoft.FileShares (NFS only)](create-file-share.md)
- [Mount on Windows](storage-how-to-use-files-windows.md) | [Mount on Linux](storage-how-to-use-files-linux.md) | [Mount on macOS](storage-how-to-use-files-mac.md)
- [Migrate to SMB Azure file shares](storage-files-migration-overview.md)
- [Migrate to NFS Azure file shares](storage-files-migration-nfs.md)
- [Azure Files FAQ](storage-files-faq.md)
