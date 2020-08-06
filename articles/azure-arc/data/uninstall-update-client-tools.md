---
title: Uninstall azdata, Azure Data Studio (Insiders), and the Arc extension for Azure Data Studio
description: Uninstall azdata, Azure Data Studio (Insiders), and the Arc extension for Azure Data Studio
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Scenario: Uninstall azdata, Azure Data Studio (Insiders), and the Arc extension for Azure Data Studio

This document walks you through the steps for uninstalling azdata and updating to the latest version of Azure Data Studio insiders in preparation for a new release of Azure Arc enabled data services.

- azdata is a command-line tool to deploy, manage and use Azure Arc enabled data services.
- Azure Data Studio is a GUI tool for DBAs, data engineers, data scientists, and data developers.

## Step 1: Uninstall azdata extensions

> [!NOTE]
>  all necessary extensions are included in the Windows MSI installer, thus this step can be skipped if installing from MSI.

```terminal
azdata extension remove -n azdata-cli-postgres -y
azdata extension remove -n azdata-cli-dc -y
azdata extension remove -n azdata-cli-sqlinstance -y
```

## Step 2: Uninstall azdata

### Choose the steps for the Operating System you are using

Depending on your client OS, choose the instructions from below.

#### Windows

Go to Add/Remove Programs and uninstall the 'Azure Data CLI' program.

#### macOS

```terminal
brew uninstall azdata-cli
```

#### Docker

Run the following command to see the list of docker containers you have running currently and identify the id of the container you want to delete.

```terminal
docker ps -a
```

Delete the identified container.

```terminal
docker rm -f <id>
```

#### Debian/Ubuntu

```terminal
apt-get remove azdata-cli
```

#### RHEL/CentoS

```terminal
yum uninstall azdata-cli
```

## Step 3: Verify azdata is removed

This command should return an error that azdata is not found.

```terminal
azdata --version
```

## Step 4: Upgrade to the latest version of Azure Data Studio - Insiders and Arc extension

Click the cog icon in the lower left corner of Azure Data Studio and click 'Check for Updates...' to get the latest update for the Insiders release train.

If there is already an update pending, there will be a 'Restart to Update' option in the context menu.  Click 'Restart to Update' to apply the update and restart Azure Data Studio.

## Step 5: Upgrade to the latest version of the Azure Arc extension in Azure Data Studio - Insiders

Click on the Extensions tab on the left side of Azure Data Studio.

Click on the Azure Arc extension.  If there is an update available, you can see it and install it.

## Next steps

Now [install the latest version of azdata + extensions](install-client-tools.md)
