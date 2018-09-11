---
title: Endpoint Creation in Azure CycleCloud | Microsoft Docs
description: Manage data endpoints in Azure CycleCloud.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Endpoint Creation

Endpoints are logical connections to storage providers and can be any of the following:

* Azure Block Storage  
* Host data residing on servers accessible to the CycleCloud Data Manager. These can be local directories or other mounted file systems.
* Storage options on other Cloud Providers

To view and manage endpoints, select **Data** then **Transfer Manager** from the CycleCloud menu bar.

## Configuring a Local Endpoint

On the left side of the **Transfer Manager** screen, you can see that an initial
local endpoint has been created by the installer, and is configured to use the
_/tmp_ directory. Click **Save** to create this endpoint.

### Adding Another Local Directory

To add another directory to the local endpoint, click the endpoint name next to the gear in the
top left, and select **Edit Endpoint**.

![Edit Endpoint](~/images/edit_endpoint.png)

Click the **+** to generate a new line, then enter the path. Click **Save** to continue.

![Local Path](~/images/local_path.png)

> [!NOTE]
> Any directories in the **Allowed Paths** must be accessible by the user running CycleCloud.

### Host Endpoint Attributes

| Attribute         | Description                                                               |
| ----------------- | ------------------------------------------------------------------------- |
| Name              | Name of the endpoint                                                      |
| Type              | Type of endpoint                                                          |
| Allowed Paths     | List of system paths accessible by this endpoint                          |
| Encryption Key    | The encryption key used to encrypt all files transferred to this endpoint |
| Local             | When checked, indicates that folders are local to the host                |
| Hostname          | Hostname for host endpoints                                               |
| SSH User          | Remote login name                                                         |
| Credential        | The SSH keypair to use when logging into a remote host                    |
| SSH Port          | Port for connections via SSH                                              |
| Pogo path         | Path to the [pogo](pogo-overview.md) executable on the remote host                            |

## Adding Cloud Provider Credentials

You will need to add credentials for each of the cloud provider accounts you wish to use with the Azre CycleCloud Data Manager.

* Click on the host name in the upper left and select **Add Endpoint**
* Click on the green plus sign next to **Credential**, which will open a new window called **Create Credential**
* Enter a descriptive name for the credential
* Select `Azure` as the Type
* Enter your **Access** and **Secret Keys**
* Select your default region
* Confirm your entries by clicking **Test**
* Click **Save** to save your credentials. You can now use the credentials to create an Azure Block Storage endpoint.

## Adding Endpoints

### Adding a Microsoft Azure Endpoint

Once you've added Azure credentials, you can set up an Azure Storage endpoint.

1. From the New Endpoint window, enter a descriptive **Name**
2. Select Azure Storage as the **Type**
3. Enter the **Allowed Path**. Use the **+** to add additional paths if needed.
4. Select the **Encryption Key**
5. Choose the appropriate Azure **Credential**
6. Select the **Storage Account** and **Storage Container** via the dropdown menus
7. Click **Save** to add your Azure endpoint

![Add Azure Endpoint](~/images/add_endpoint-azure.png)

### Adding a Remote Host Endpoint

For server-to-server transfers, you can create another "Host" type endpoint. To
add a remote host endpoint, select **Add Endpoint** from the **Type** drop-down.
Select **Host** as the endpoint type. Name the endpoint, and make sure the **Local Host**
checkbox is unchecked. Fill in your remote host login credentials, then select
**SSH Private Key Credential** that will be used to connect to the host.

![Remote Host Settings](~/images/add_endpoint-remotehost.png)

## Additional Settings

In order to tune data transfers, a number of settings can be adjusted.
Navigate to the settings page by clicking on the user drop-down menu on the top right of the screen and selecting Settings.

![Settings](~/images/settings_dropdown.png)

On the settings page, double clicking on the DataMan entry displays the DataMan settings form.

**Transfer Threads**: This setting modifies the number of threads used to transfer data. Recommended value of this setting depends on your network bandwidth and the number of CPU cores available on the DataMan host. To prevent http connection errors during uploads, we recommend that this value not be set greater than 32. *Default: 16*

**Transfer Part Size**: This is the size of a single chunk of a multi-part transfer. *Default: 16,777,216*

**Proxy Server Configuration**; To enable using a proxy server for network operations, check the Use Proxy checkbox and put the details of the proxy server in the following fields. *Default: Unchecked*
