---
title: Customize Azure HDInsight on AKS clusters
description: Add custom components to HDInsight on AKS clusters by using script actions. Script actions are Bash scripts that can be used to customize the cluster configuration.
ms.topic: conceptual
ms.service: hdinsight-aks
ms.date: 08/29/2023
---

# Customize Azure HDInsight on AKS clusters using script actions 

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]
 
Azure HDInsight on AKS provides a configuration method called  Script Actions that invoke custom scripts to customize the cluster. These scripts can be used to install more packages/jars and change configuration settings. The Script actions can be used only during cluster creation. Post cluster creation script actions are in the roadmap. Currently Script Actions are available only with Spark clusters.

## Understand script actions

A script action is Bash script that runs on the service components in an HDInsight on AKS cluster. 

The characteristics and features of script actions are as follows: 

- The Bash script URI (the location to access the file) has to be publicly accessible from the HDInsight on AKS resource provider and the cluster.
- The following are possible storage locations for scripts:
  - An ADLS Gen2
  - An Azure Storage account (the storage has to be publicly accessible)
  - The Bash script URI format for ADLS Gen2 is `abfs://<container>@<datalakestoreaccountname>.dfs.core.windows.net/path_to_file.sh`
  - The Bash script URI format for Azure Storage is `wasb://<container>@<azurestorageaccountname>testwasbwithoutmsi.blob.core.windows.net/path_to_file.sh`
- Script actions can be restricted to run on only certain service component types. For example, Resource Manager, Node Manager, Livy, Jupyter, Zeppelin, Metastore etc.
- Script actions are persisted.
  - Persisted script actions must have a unique name.
  - Persisted scripts are used to customize the service components
  - When the service components are scaled up, the persisted script action is applied to them as well
- Script actions can accept parameters that required by the script, during execution.
- You're required to have permissions to create a cluster to execute script actions.

  > [!IMPORTANT]
  > * Script actions that remove or modify service files on the nodes may impact service health and availability. You're required to apply discretion and check scripts before executing them.
  > * There's no automatic way to undo the changes made by a script action.  

## Methods for using script actions 

You have the option of configuring a Script Action to run during cluster creation.

> [!NOTE]
> Configuration of Script Actions on existing cluster is part of the roadmap.

### Script action during the cluster creation process 

In HDInsight on AKS, the script is automatically persisted. A failure in the script can cause the cluster creation process to fail. 

The following diagram illustrates when script action runs during the creation process: 

:::image type="content" source="./media/customize-clusters/script-action-overview.png" alt-text="Screenshot showing the stages during cluster creation for script action.":::
 
**The script runs while HDInsight on AKS cluster is being provisioned. The script runs in parallel on all the specified nodes in the cluster.**

> [!IMPORTANT]
> * During cluster creation, you can use many script actions at once.
> * These scripts are invoked in the order in which they were specified, and not parallelly.

### Next steps

* How to [manage script actions](./manage-script-actions.md)
