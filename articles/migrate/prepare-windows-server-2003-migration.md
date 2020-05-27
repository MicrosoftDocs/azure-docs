---
title: Prepare Windows Server 2003 servers for migration with Azure Migrate
description: Learn how to prepare Windows Server 2003 servers for migration with Azure Migrate.
ms.topic: how-to
ms.date: 05/27/2020
---


# Prepare Windows Server 2003 machines for migration

This article describes how to prepare machines running Windows Server 2003 for migration to Azure. 

You can migrate machines running Windows Server 2003 to Azure with Azure Migrate, but you need to install Hyper-V Integration services on the machine before migration. Windows Server 2003 doesn't have this installed by default, and it's needed so that networking works as expected after migration.

## Install on Hyper-V VMs

There's no direct download link for Hyper-V Integration Services. Install on Hyper-V VMs as follows:

1. Sign into a machine running Windows Server 2012 R2/Windows Server 2012 with the Hyper-V role, and navigate to the installation file at **C:\Windows\System32\vmguest.iso**. Note that the file isn't available on machines running Windows Server 2016 with the Hyper-V role.
2. Copy the file to the Hyper-V VM running Windows Server 2003 that you want to migrate.
3. Mount the .iso file, and copy the installation folder to the VM.
4. Install Integration Services on the VM.
5. In Integration Services, the following components should be enabled.

## Install on VMware VMs

You can't install Hyper-V Integration Services directly on a VMware VM. Instead, you copy the installation folder to the VM, and create a startup task to install Hyper-V Integration Services the first time that the Azure VM starts after migration. 

1. Sign into a machine running Windows Server 2012 R2/Windows Server 2012 with the Hyper-V role, and navigate to the installation file at **C:\Windows\System32\vmguest.iso**. 
2. Copy the file to the Hyper-V VM running Windows Server 2003 that you want to migrate.
3. Mount the .iso file, and copy the installation folder to the VM.
4. From the command line on the VM, run ```gpedit.msc```.
5. Open **Computer Configuration** > **Windows Settings** > **Scripts (Startup/Shutdown)**.
6. In **Startup** > **Add** > **Script Name**, type the setup.exe address.
7. After migration to Azure, the script runs the first time the Azure VM starts.
8. You need to manually restart the Azure VM for the script. There's a pop-up in boot diagnostics to indicate this.
9. After the script runs and Hyper-V Integration Services are installed on the Azure VM, you can remove the script from startup.
10. In Integration Services, the following components should be enabled.


## Next steps

- Review migration requirements for [VMware](migrate-support-matrix-vmware-migration.md) and [Hyper-V](migrate-support-matrix-hyper-v-migration.md) VMs.
- Migrate [VMware](server-migrate-overview.md) and [Hyper-V](tutorial-migrate-hyper-v.md) VMs.
