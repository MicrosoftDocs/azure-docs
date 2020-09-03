---
title: Install kickstarter
description: 
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Install the Azure  Arc data controller using a script

This document details the steps to install the Azure Arc data controller in a standalone server using a script.

## Prerequisites

To complete the installation you will need to access to an Ubuntu 18.04 Server.

Minimum config for the server is as follows:

- 8 vCPU
- 32 GiB RAM
- 200 GiB Storage
- Ports 22 open

If you do not have a server available create a virtual machine in Azure. Steps to create an Ubuntu 18.04 VM are available [here](create-ubuntu-vm.md).

## Step 01: SSH onto the Server

SSH onto the VM to begin the installation process.  Use whatever login and password is appropriate for the server you are connecting to.   If you are using Windows, use a tool like PuTTY to create an SSH terminal session.

```terminal
ssh arcadmin@10.10.10.10
```

You will need to provide the password for the provided login.

## Step 02: Install the Azure Arc data controller on your Ubuntu Server

### Download the script

Download the installation script using curl.

```terminal
curl --output setup-controller-new.sh https://raw.githubusercontent.com/microsoft/sql-server-samples/master/samples/features/azure-arc/deployment/kubeadm/ubuntu-single-node-vm/setup-controller-new.sh
```

### Step 03: Grant permissions

To grant execute permissions to the script execute the following command.

```terminal
chmod +x setup-controller-new.sh
```

### Step 04: Execute the script

Execute the script using the following command.

```terminal
./setup-controller-new.sh
```

You will be prompted for the following inputs.

Create Username for Azure Arc Data Controller:<enter_any_name>    Example:arcadmin

Create Password for Azure Arc Data Controller:<any_name>          Example:MyPassword123    Note: min 8 chars

Enter Azure Arc Data Controller repo username provided by Microsoft: 22cda7bb-2eb1-419e-a742-8710c313fe79

Enter Azure Arc Data Controller repo password provided by Microsoft: cb892016-5c33-4135-acbf-7b15bc8cb0f7

Enter a name for the new Azure Arc Data Controller: <enter_any_name> Example:arc

Enter a subscription ID for the new Azure Arc Data Controller: <your_azure_subscription_id>

Enter a resource group for the new Azure Arc Data Controller: <an_existing_Resource_Group_name_in_Azure>

Enter a region for the new Azure Arc Data Controller (eastus or eastus2): <pick_one_of_eastus_regions>

> **Note:** The prompt in the terminal window is a secure prompt so when you paste in the password it wont visibly appear to be copied in.

In case the setup-controller-new.sh fails and does not complete successfully, you should run the [removal script](kickstarter-removal-new.md) before retrying the deployment.

### Step 04: Review the deployment

Once complete, you will be able to see the pods that have been deployed using the following command. These names are fixed when you use the script.

```terminal
kubectl get pods -A
```

## Next Steps

The Azure Arc data controller is now installed on your server.

Proceed to the following steps:

- [Install Azure Data Studio](https://docs.microsoft.com/en-us/sql/azure-data-studio/download?view=sql-server-ver15) on your client machine
- Complete the [scenarios](/scenarios-new)  (Note: you can skip the first two scenarios since you have already done them)
- Remove Azure Arc enabled data services from your server using the [removal script](kickstarter-removal-new.md)
