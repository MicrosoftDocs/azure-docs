---
title: Create an Azure Red Hat OpenShift 4 cluster application restore using Velero
description: Learn how to create a restore of your Azure Red Hat OpenShift cluster applications using Velero
ms.service: azure-redhat-openshift
ms.topic: article
ms.date: 06/22/2020
author: johnmarco
ms.author: johnmarc
keywords: aro, openshift, az aro, red hat, cli
ms.custom: mvc
#Customer intent: As an operator, I need to create an Azure Red Hat OpenShift cluster application restore
---

# Create an Azure Red Hat OpenShift 4 cluster Application restore

In this article, you'll prepare your environment to create an Azure Red Hat OpenShift 4 cluster application restore. You'll learn how to:

> [!div class="checklist"]
> * Setup the prerequisites and install the necessary tools
> * Create an Azure Red Hat OpenShift 4 application restore

If you choose to install and use the CLI locally, this tutorial requires that you're running the Azure CLI version 2.6.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Before you begin

### Create an Azure Red Hat OpenShift 4 application backup

To create an Azure Red Hat OpenShift 4 application backup, see [Create an Azure Red Hat OpenShift 4 backup](./howto-create-a-backup.md)

## Restore an Azure Red Hat OpenShift 4 Application

These steps will allow you to restore an application that has been previously backed up with Velero.
You can check the list of backups that are currently recognized by the cluster to see what backups are available for restore.  To do this step, you'll need to execute the following command:

_(This step assumes that you installed Velero in a project named "velero")_

```bash
oc get backups -n velero
```

Once you have the backup that you would like to restore, you'll need to perform the restore with the following command:

```bash
velero restore create <name of restore> --from-backup <name of backup from above output list>
```

This step will create the Kubernetes objects that were backed up from the previous step when creating a backup.

To see the status of the restore, execute the following step:

```bash
oc get restore -n velero <name of restore created previously> -o yaml
```
When the phase says `Completed`, your Azure Red Hat 4 application should be restored.

## Restore an Azure Red Hat OpenShift 4 Application with included snapshots


To create a restore of an Azure Red Hat OpenShift 4 application with persistent volumes using Velero, you'll need to perform the restore with the following command:

```bash
velero restore create <name of the restore> --from-backup <name of backup from above output list> --exclude-resources="nodes,events,events.events.k8s.io,backups.ark.heptio.com,backups.velero.io,restores.ark.heptio.com,restores.velero.io"
```
This step will create the Kubernetes objects that were backed up from the previous step when creating a backup.

To see the status of the restore, execute the following step:

```bash
oc get restore -n velero <name of restore created previously> -o yaml
```
When the phase says `Completed`, your Azure Red Hat 4 application should be restored.

For more information, see [Backup OpenShift resources the native way](https://www.openshift.com/blog/backup-openshift-resources-the-native-way)

## Next steps

In this article, an Azure Red Hat OpenShift 4 cluster application was restored. You learned how to:

> [!div class="checklist"]
> * Create a OpenShift v4 cluster application restore using Velero
> * Create a OpenShift v4 cluster application restore with snapshots using Velero


Advance to the next article to learn about Azure Red Hat OpenShift 4 supported resources.

* [Azure Red Hat OpenShift v4 supported resources](support-policies-v4.md#supported-virtual-machine-sizes)
