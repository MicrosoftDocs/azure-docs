# SubmitOnce

High performance computing clusters are incredibly powerful tools which enable revolutionary software.
Because of this, many organizations are looking to increase the utilization of their existing clusters
and/or expand their clusters into the cloud. SubmitOnce assists with both of these things. If you have more than one physical cluster, SubmitOnce can route jobs to where the free resources are. Whether you have one small cluster, or a dozen spread out all over the globe, SubmitOnce can augment the capabilities of your physical hardware by sending jobs to [Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/).

The SubmitOnce architecture helps you by stitching together multiple disparate computing environments.
At job submission time, a job routing decision is made by the system. If needed, data is transferred to the remote cluster. Jobs are submitted across clusters transparently to the end-user or submitting process. Resulting output data is brought back to the local environment. The end result is a workload which has been completed in the optimal amount of time when considering all available resources.

## Prerequisites

Before installing and configuring SubmitOnce, please verify that your HPC environment has the following characteristics:

1.  At least one server dedicated to running CycleServer. Server should have a minimum of:

      - 2 dedicated CPUs
      - 8 GB dedicated RAM
      - 20 GB of hard-drive space

2. A functional user account (generally with username = "cycle_server") which exists on all
   clusters.

3. A shared filesystem per cluster, mounted by all submitters and all execute hosts in that cluster.

   - This filesystem will be used to share all job data with each execute host.

4. User home directories available on all submitters and preferably all execute hosts.

5. Key-based SSH access (passwordless) for the cycle_server user to a submit host in each cluster.

6. Grid Engine Submitters should have read access to the Grid Engine accounting file.

7. *Either:*

   - A common directory on the shared filesystem of all clusters owned by the functional user
     account (cycle_server by default) and world readable (see: $SO_HOME in the setup section below)
**OR**
   - At least one execute slot on the Submitter host and the "slot_type=master" complex
     applied to that host

## Installation

SubmitOnce is a component of the CycleServer software platform. SubmitOnce and CycleServer will monitor each HPC cluster and act as a job router and meta-scheduler.

CycleServer should be installed on a machine in your local HPC environment (the one from which users will submit jobs) and configured to monitor your cluster(s).

Once CycleServer is installed and monitoring your environment, we can configure job submission through SubmitOnce.

## The *cycle_server* User

This installation guide assumes the existence of a user account named `cycle_server` on all clusters.
Different user accounts maybe configured for any cluster that does not have a `cycle_server` user if desired.

Note that when CycleServer itself is installed, it creates a local `cycle_server` user with no login access by default. If CycleServer is installed on a node capable of submitting to the local Grid Engine cluster, then the local `cycle_server` user may be used by configuring shell access for the user. For most systems the following command is all that is required:

    sudo chsh -s /bin/bash cycle_server

## Setup the SubmitOnce Home Directory

In **each** cluster, create a directory that SubmitOnce can use as scratch space. By default, the absolute path for this directory is `/shared/ss`:

    mkdir /shared/ss
    chown cycle_server:cycle_server /shared/ss

If you use a path other than /shared/ss, you must configure this inside of CycleServer. Log in as an administrator, click the "Admin > System Settings" menu, double-click the settings item for SubmitOnce and change the value of "SubmitOnce Home".

For the purposes of this guide, we will refer to this directory as $SO_HOME. This directory should be owned by the cycle_server user and should be readable by all users of SubmitOnce. For the recommended configuration, it should also be located on a shared filesystem that is mounted by all execute nodes and submitter nodes on the cluster.

Alternatively, if there is no appropriate shared file system available for $SO_HOME, then the directory can be local to just the submitter nodes. However, this requires some additional configuration of both SubmitOnce and the Submitter itself.

Next, the cluster administrator must create a bin directory within $SO_HOME and copy the SubmitOnce scheduler tools to it from the SubmitOnce distribution:

    cd /tmp
    tar xzfv submitonce-schedtools.tar.gz
    mkdir /shared/ss/bin
    cp /tmp/submitonce-schedtools/* /shared/ss/bin
    chown -R cycle_server:cycle_server /shared/ss/bin

SubmitOnce will create additional directories for it's own use as needed.  After the first submission to a remote cluster, $SO_HOME will contain, at least, the following directory structure:

     $SO_HOME
         |
         |-- bin: contains various SubmitOnce executables
         |
         |-- presubmit: contains files that will be used by each submission
         |
         |-- tickets: used by jobs as a dropbox to initiate file transfers

## SubmitOnce Cluster Setup

For CycleCloud clusters, it is strongly recommended to enable automatic cluster monitoring in the CycleCloud application settings. With automatic cluster monitoring enabled, new CycleCloud GridEngine clusters will automatically be configured for submitonce upon cluster startup. To configure SubmitOnce for existing (on-premise or other non-CycleCloud) clusters, setup the cluster using either the command line `add_cluster` command or by configuring a QMaster using the CycleServer UI.

## Adding a Cluster via the Command Line Interface

This guide documents the complete setup process via the GUI and is a useful reference for making changes to the SubmitOnce data-structures after initial configuration.

However, the SubmitOnce CLI provides a much simpler configuration method which is sufficient for most SubmitOnce clusters. See the `add_cluster` command in the CLI chapter for the command line method.

## Adding a Cluster via the UI

Clusters may also be configured for monitoring and submission in SubmitOnce via the CycleServer GUI.
To add a new cluster, click on the `Systems -> Grid Engine` menu item (this will navigate to the Grid Engine cluster summary page), then click the "Configure QMasters" button to navigate to the QMaster configuration page. In the QMaster table, click the "Create" button and fill out the Qmaster configuration form.

The rest of the SubmitOnce configuration settings described in the *Advanced SubmitOnce Configuration* section below will be configured automatically using the defaults.

After filling out the QMaster configuration form, click the **"Test"** button to verify connectivity to the new cluster.

>[!Note]
>As mentioned earlier, for CycleCloud clusters, it is recommended to enable automatic Cluster Monitoring in the CycleCloud Application Settings. If automatic cluster monitoring is enabled, then CycleCloud will automatically configure new CycleCloud GridEngine clusters for use with SubmitOnce. Manual configuration is only needed to over-ride default settings.

# Advanced SubmitOnce Configuration

To manually update or override settings, or to correct errors in Cluster configuration, there are several other configuration forms available in the GUI to assist in setting the SubmitOnce configuration.

The sections below describe how to use the GUI to (re-)set the default SubmitOnce settings. Modifications to these should only be required in unusual circumstances.

## Configuring File Transfers

SubmitOnce uses CycleServer's file transfer functionality to send data back and forth between clusters. In order for these transfers to work, there are a few default settings that need to be changed. Follow the steps below to configure file transfer:

1. As a CycleServer administrator, click "Data" then "Transfers" on the main menu. In the upper right-hand corner of the page, click "Configuration" to open the file transfer configuration dialog box.

2. Click the "Advanced" link in the dialog box, and change the following fields:

    - Uncheck "Block remotely initiated transfers to remote hosts". This is disabled by default, but is required by SubmitOnce so that jobs on remote clusters may initiate file transfers.

    - Add the following value to "RSync Options":

    ={"--owner","--group","--numeric-ids"}

3. Click the "Ok" button to close the advanced dialog box, then click "Save" to save your changes.

## Setup Data Endpoints

SubmitOnce uses the Data Management file transfer features to move job input & results to and from remote clusters. In order for these transfers to work, we must setup a file transfer endpoint in each cluster.

Log into the CycleServer web interface as an administrator, navigate to the "Data Browser" and select "Endpoints" in the types table. This will bring up a list of configured endpoints. First, we will define the host which CycleServer is running on. Click the 'Create' link above the enpoints table and enter the following information:

table


This configuration tells CycleServer that we have a filesystem that is local, which can transfer files from /shared/ss on any remote host to /shared/ss on the local host.

For each cluster, configure a remote host which will handle file transfer. By convention, this should generally be the same host which CycleServer uses to monitor the cluster's scheduler. When naming these hosts, be sure to name them the same as the cluster which they are in. This will tell SubmitOnce which host to use for each cluster:

table

## Configure Recurring Syncs

Now that we have configured the hosts which we will use for file transfers between clusters, we must configure CycleServer to check the $SO_HOME/tickets directory for any file transfer tickets.

A file transfer ticket is a small text file that tells CycleServer to initiate an rsync transfer between two hosts. Before a SubmitOnce job runs in a remote cluster, it will create a ticket to notify CycleServer to transfer any input files to that cluster. After that job completes, it creates another ticket that tells CycleServer to pull the job output files back to the home cluster. Because file transfer is always initiated from the home cluster, this can help get around firewall restrictions on inbound traffic.

For each cluster, configure a recurring sync. Click the "Data > Recurring Syncs" menu item, then click the "Create" button. Fill in the following information:

table

## Configure QMasters

SubmitOnce relies on the QMaster configurations from the CycleServer GridEngine monitoring component.

Whether you are installing GridEngine monitoring for the first time or adding SubmitOnce capabilities to an existing CycleServer installation, SubmitOnce requires configuration of 2 QMaster attributes which are not required for pure monitoring:

table

The TotalCores attribute provides a hint to SubmitOnce of how many concurrent Jobs may run on the cluster. The JobBuffer attribute gives SubmitOnce a hint as to how many additional jobs beyond the TotalCore count should be queued to maintain full utilization across clusters. The JobBuffer number may require some tweaking based on workload, but goal is to avoid "long-tail" scenarios where any single cluster holds too large a backlog of queued jobs.

To set the TotalCores and JobBuffer attributes, log into the CycleServer web interface as an administrator and click the "Systems > OGS / SGE" link in the main menu. This will bring up the GridEngine monitoring page. From that page click the "Configure QMasters" button to navigate to the current list of monitored QMasters (this list will be empty if you have not already configured monitoring). For each QMaster in the list, select the QMaster and click the 'Edit' (or 'Create' to add a new QMaster) link above the table. In the QMaster configuration form, set the TotalCores and JobBuffer fields to the appropriate values for your cluster.
