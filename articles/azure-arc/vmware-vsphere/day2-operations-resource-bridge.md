---
title:  Perform ongoing administration for Arc-enabled VMware vSphere
description: Learn how to perform day 2 administrator operations related to Azure Arc-enabled VMware vSphere
ms.topic: how-to 
ms.date: 03/28/2022

---

# Perform ongoing administration for Arc-enabled VMware vSphere

In this article, you will learn how to perform various administrative operations related to Azure Arc-enabled VMware vSphere (preview):

- Upgrading the Arc resource bridge

- Updating the credentials

- Collecting logs from the Arc resource bridge

## Upgrading the Arc resource bridge and other components

Azure Arc-enabled VMware vSphere requires the Arc resource bridge to connect your VMware vSphere environment with Azure. Periodically, new images of Arc resource bridge will be released to include security and feature updates.

> [!NOTE]
> Arc resource bridge doesn't yet provide an upgrade command. To upgrade the arc resource bridge VM to the latest version, you will need to perform the onboarding again with the same resource ids. This will cause some downtime as operations performed through Arc during this time might fail.

To upgrade to the latest version of the resource bridge, perform the following steps:

- Copy the resource ids of the Arc resource bridge, custom location and vCenter Azure resources

- Find and delete the old Arc resource bridge **template** from your vCenter

- Download and run the onboarding script again as follows

``` powershell-interactive
./resource-bridge-onboarding-script.ps1 --force -
```

- Provide the inputs as prompted.

## Updating the vSphere account credentials

Azure Arc-enabled VMware vSphere uses the vSphere account credentials you provided during the onboarding to communicate with your vCenter server. These credentials are only persisted locally on the Arc resource bridge VM.

As part of your security practices, you might need to rotate credentials for your vCenter accounts. As credentials are rotated, you must also update the credentials provided to Azure Arc to ensure the functioning of Azure Arc-enabled VMware services.

There are two different sets of credentials stored on the Arc resource bridge. But you can use the same account credentials for both.
- **Account for Arc resource bridge**. This account is used for deploying the Arc resource bridge VM and will be used for upgrade
- **Account for VMware cluster extension**. This is the account used to discover inventory and perform all VM operations through Azure Arc-enabled VMware vSphere

To update the credentials of the account for Arc resource bridge, run the following command from a workstation that can access cluster configuration IP  of the Arc resource bridge locally:

```azurecli
az arcappliance setcredential vmware --kubeconfig <kubeconfig>
```

To update the credentials used by the VMware cluster extension on the resource bridge.

```azurecli
az connectedvmware vcenter connect --custom-location <name of the custom location> --location <Azure region>  --name <name of the vCenter resource in Azure>       --resource-group <resource group for the vCenter resource>  --username   <username for the vSphere account>  --password  <password to the vSphere account>
```

## Collecting logs from the Arc resource bridge

## Next steps
