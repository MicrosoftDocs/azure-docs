---
title: Prepare VMware VMs running Linux for migration to Azure with Azure Migrate Server Migration | Microsoft Docs
description: Describes how to prepare a Linux VM for migration to Azure with Azure Migrate Server Migration
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: article
ms.date: 11/14/2018
ms.author: raynew
---



# Prepare Linux VMware VMs for migration to Azure 

This article describes how prepare VMware VMs running Linux when you want to migrate them to Azure using [Azure Migrate](migrate-overview.md). 

> [!NOTE]
> Azure Migrate Server Migration is currently in public preview. You can use the existing GA version of Azure Migrate to discover and assess VMs for migration, but the actual migration isn't supported in the existing GA version.

Prepare Linux machines as follows:

1. Install Hyper-V Linux Integration Services. Newer versions of Linux distributions might have this installed by default).
2. Rebuild the Linux init image so that it contains necessary Hyper-V drivers, and so that the VM will boot in Azure (required for some distributions).
3. Enable serial console logging for troubleshooting. [Learn more](https://docs.microsoft.com/azure/virtual-machines/linux/serial-console).
4. Update the device map file with device name to volume associations, to use persistent device identifiers.
5. Update fstab entries to use persistent volume identifiers.
6. Remove any udev rules that reserve interface names based on MAC address etc.
7. Update network interfaces to receive DHCP IP addresses.
8. Ensure ssh is enabled. Check that sshd service is set to start automatically on reboot.
9. Ensure that incoming ssh connection requests aren't blocked by the operating system firewall, or IP table rules.

[Learn more](https://docs.microsoft.com/azure/virtual-machines/linux/serial-console) about making these changes on the most popular Linux distributions.

## Sample script

This script (prepare-for-azure.sh) provides a sample for preparing Linux machines. The script might not work for all distributions and environments, but it's a useful starting point.

The script shows how to: 

- Regenerate the Linux init image with the necessary drivers if needed.
- Update fstab entries to use persistent volume identifiers.
- Redirect console logs to the serial port.
- Enable Azure serial access console
- Remove udev net rules
- Inject a run on boot script that runs when the VM boots up. It checks if the machine is running in Azure. If it is, it updates the network configuration on the VM, and sets the first ethernet interface to use DHCP to acquire an IP address.

### Before you start

- The sample script contains sample steps. It shouldn't be run on production systems. It could damage or corrupt the VM on which it runs.
- We recommend you run it on a test VM. Before you start, take a VM backup or snapshot so that you can restore the VM if needed. 
- The script works when the VM is running one of these Linux distributions:
    - Red Hat Enterprise Linux 6.5+, 7.1+
    - Cent OS 6.5+, 7.1+
    - SUSE Linux Enterprise Server 12 SP1,SP2, SP3
    - Ubuntu 14.04, 16.04, 18.04
    - Debian 7, 8

### Run the script

1. Copy the script to the Linux test VM using sftp or an scp client such as FileZilla or WinScp.
2. SSH into the Linux machine using an admin account.
3. Navigate to the script directory.
4. To make the script into an executable file, run **sudo chmod 777 prepare-for-azure.sh**.
5. Run the script with **./prepare-for-azure.sh**.

Here's how the script runs:

![Linux script](./media/how-to-prepare-linux-for-migration/script1.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script2.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script3.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script4.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script5.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script6.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script7.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script8.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script9.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script10.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script11.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script12.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script13.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script14.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script15.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script16.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script17.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script18.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script19.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script20.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script21.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script22.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script23.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script24.png)
![Linux script](./media/how-to-prepare-linux-for-migration/script25.png)



## Next steps

- Learn how to use [machine dependency mapping](how-to-create-group-machine-dependencies.md) to create high confidence groups.
- [Learn more](concepts-assessment-calculation.md) about how assessments are calculated.
