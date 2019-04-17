---
title: Azure CycleCloud Submit Once CLI | Microsoft Docs
description: Use the Submit Once Command Line Interface in Azure CycleCloud.
author: KimliW
ms.technology: submitonce
ms.date: 08/01/2018
ms.author: adjohnso
---

# Submit Once Command Line Interface

The SubmitOnce CLI is distributed as a single executable named "submitonce" and a set of Grid Engine
wrapper scripts. These wrapper scripts are intended to function similarly to their Grid Engine
counterparts, listed below:

  * cacct -> qacct
  * cdel -> qdel
  * chost -> qhost
  * cstat -> qstat
  * csub -> qsub
  * croute -> qsub (but used to determine job routing without performing a submission)

Each line of ouput from these scripts will generally be prefixed with a corresponding cluster name.
For example:

``` script
$ cstat
external > [output from a cluster named "external"]
internal > [output from a cluster named "internal"]
```

Note that each wrapper script corresponds to the first argument of the 'submitonce' command, so:

``` script
cstat -c external
```

is the same as calling:

``` script
submitonce cstat -c external
```

## CLI Installation

To install the SubmitOnce CLI, first unpack the tarball:

```azurecli-interactive
tar -xzvf submitonce-2.4.0.linux64.tar.gz
```

then make sure that the bin directory is on your $PATH. One way to do this would be to edit
`.bash_profile` in your home directory and add a line like this:

``` bash
export PATH=$PATH:/path/to/submitonce-2.4.0/bin
```

## CLI Configuration

Before configuring the SubmitOnce CLI, make sure that the CycleServer web interface is running and
accessible from the machine you are installing on, and that you can successfully log in. For
example, if the web interface is running on the same machine, you would point your web browser
to `http://localhost:8080`.

## Initialize the CLI

The configure the SubmitOnce CLI for the first time, you should run the "initialize" command:

```azurecli-interactive
$ submitonce initialize
```

This will ask you a set of questions to configure connectivity to SubmitOnce and the various
clusters in your environment. This creates a file "~/.cycle/config.ini" which you may edit in the
future to change any of these settings.

>[!Note]
>Your home cluster should usually be a cluster that you could submit jobs to using qsub
>directly. SubmitOnce assumes that all data required by a job in your home cluster is already
>available and will skip the data transfer step.

>[!Note]
>Your home cluster will also be given preference in all routing decisions made by SubmitOnce.

## Configuring Your Home Cluster

If no clusters have been configured for SubmitOnce, the `submitonce initialize` command will prompt
you to configure your home cluster directly from the CLI as described below in the `add_cluster`
description.

## Adding Rsync Arguments

When jobs are submitted to remotely the contents of the working directory are copied to
the remote cluster. This sync process is performed automatically using the rsync transfer utility. Additional rsync directives may be used on this transfer by adding them to the submitonce `config.ini`
file typically stored at `~/.cycle/config.ini`. Below is an example of how to add additional
rsync options to all transfers::

``` config-ini
[submitonce]
homecluster = home
allow_local_failback = no
rsync_options = --copy-links --copy-dirlinks --keep-dirlinks
```

## Adding Clusters to SubmitOnce

To submit work to clusters via SubmitOnce, the clusters must be configured via either the GUI or
the CLI. To configure a cluster from the CLI, use the `add_cluster` command:

```azurecli-interactive
$ submitonce add_cluster CLUSTER_NAME
```

The `add_cluster` command will prompt you for all the information that SubmitOnce requires to use
the cluster.

## Pre-Requisites for Adding a Cluster

In order to use the `add_cluster` command (or to set up your home cluster from the `initialize`
command), you'll need:

* The username of the Service Account that CycleServer can use to monitor SGE on the cluster.

    - In CycleCloud clusters, this is generally the `cycle_server` user.

* A private key which can be used by CycleServer to SSH in to the remote cluster as the
  Service Account user (the corresponding public key should be in the user's authorized keys).

* A shared directory owned by the Service Account with identical paths on **ALL** clusters for
  SO_HOME.

    - By default, SO_HOME is set to `/shared/ss`

    - If a different SO_HOME will be used, it should be created on **ALL** clusters.

* A count of the total core count of the cluster for static clusters or the max core count for
  autoscaling clusters.
