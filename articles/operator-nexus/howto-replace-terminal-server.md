---
title: How to replace a terminal server within Azure Operator Nexus Network Fabric
description: Process of replacing terminal server within Azure Operator Nexus Network Fabric
author: sushantjrao 
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 01/24/2025
ms.custom: template-how-to, devx-track-azurecli
---

# Replacing terminal server

This guide provides a step-by-step process for replacing a Terminal Server (TS) within Azure Operator Nexus Network Fabric. The procedure includes cleaning up the existing TS, removing the TS, installing a new TS, and configuring the Terminal Server.

## Pre-replacement cleanup (Customer action)

Before initiating the Return Merchandise Authorization (RMA) for the existing Terminal Server, ensure a thorough cleanup of the device. This step is crucial if the TS is still accessible.

### Manual cleanup tasks

1. Verify TS password in KeyVault

    Confirm that the current Terminal Server password is stored in the customer NFC KeyVault secrets.

2. Stop active services

    On the Terminal Server, navigate to the directory under /mnt/nvram/ that begins with the name `opengear` (ensure you select the directory for the latest version, if multiple directories are present).

3. Run the following command to stop the relevant services:
    
    ```bash
    sudo bash stop.sh   
    ```

4. Remove configuration and certificate files

    Access the /mnt/nvram/ directory to ensure all configuration files, certificates, and the Open Gear file are deleted, leaving no traces of previous configurations.

### Device removal (Customer action)

Once the cleanup is complete, proceed with physically removing the existing Terminal Server from the rack.

### Installation of new device (Customer action)

After the old TS is removed, install the new Terminal Server in the rack. Follow the guidelines provided in the public documentation for [Terminal Server setup](howto-platform-prerequisites.md)

Validate the connectivity of both Net1 and Net2 interfaces to ensure proper network functionality.

Set up the terminal server device with the same password and username as before. This password can be obtained from the customer Network Fabric Controller (NFC) KeyVault secrets. The username can be obtained by doing an ARM GET on the network fabric resource.

### Microsoft engineering support

After the new Terminal Server is installed and configured, open a support ticket with Microsoft to complete the setup. Microsoft engineers will trigger a lockbox action for *Reprovisioning Terminal Server Device*.

>[!Note]
>The user is expected to setup the terminal server with the same username and password as stored in customer NFC key vault.

Wait for the operation to complete.

>[!Note] 
> The lockbox operation will execute the following tasks:
> - Configure's essential services, including httpd and dhcpd.<br>
> - Set's up the Net3 interface.<br>
> - Copies necessary OS, dhcpd configuration, device configurations, and certificate files to the appropriate directories.<br>
> - Transfers the configuration files and certificates to the /mnt/nvram/conf directory.<br>
> - Restarts the DHCPD service.<br>
> - Ensures that configuration files are accessible via the HTTP service for further validation.<br>

