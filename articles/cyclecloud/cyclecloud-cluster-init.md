# Cluster Init

Azure CyleCloud's Cluster Init provides cluster developers a very simple means of customizing nodes at startup without requiring custom Chef recipes. Cluster Init is a phase of the node provisioning process in every CycleCloud cluster. It allows you to install software and data onto your cluster in a variety of different ways.

With cluster init you can:

* Sync data from cloud storage to the shared filesystem.
* Sync data from cloud storage to the local scratch space.
* Run an ordered sequence of executables or scripts as the root/system user.

## Cluster Init Setup

Cluster Init is a hierarchy of scripts, packages, and data that is generally stored in a CycleCloud Locker within your Azure account. When a cluster is defined, you can specify the Locker containing the desired cluster init. During the Software Configuration phase for each node in your cluster, the cluster init files will be downloaded and the scripts executed to customize the node.

When you configure your cloud provider account for CycleCloud via the `initialize` command, you provide a name for your initial Locker which will be turned into an Azure storage bucket for your cluster init files.  For example, if you specify a name of 'demo' when running the `initialize` command, you would get a bucket named `com.cyclecloud.demo.locker`. Inside this bucket, you can place cluster init files. An example of how you might structure the contents of the bucket:

		com.cyclecloud.demo.locker/
		|-- clusterinit/
		|---- myapp/
		|------- executables/
		|------- scratch/
		|------- shared/

Notice that at the root level of the bucket there is a directory named
`clusterinit`, and under that another directory named `myapp`. This `myapp` subdirectory is referred to as the Cluster Init "name"; it can be any name you choose or a path. This is the name you will reference in your cluster configuration.

Typical examples of Cluster Init names will be simple names like `myapp` above, version numbers like `myapp/3.0`, or other meaningful names like `myapp/dev` and `myapp/prod` to distinguish between different cluster init configurations for different purposes.

A single CycleCloud Locker will generally contain many named Cluster Inits.

> [!NOTE]
> A cluster init named `default` will be assumed in your cluster template if you do not specify otherwise.

Under the cluster init name, there are several subdirectories:

* `executables`
* `scratch`
* `shared`

all of which have specific meanings which will be described below.

To enable cluster init for a CycleCloud node, use the attribute `ClusterInit` within a node definition to specify the cluster init name. (If needed, use the `Locker` attribute to select a non-default Locker for the cluster init and custom chef repository.)

> [!NOTE]
> By default, Cluster Init runs after the last recipe in a node's Chef run-list. The order in the run-list > may be controlled by explicitly adding the `cluster_init` at the desired position in the run-list.

An example:

		[cluster demo]
		...
		  [[node defaults]]
		  # Use the cluster init named 'myapp/prod' (if omitted, 'default' is assumed)
		  ClusterInit = myapp/prod
		  ...
		    [[configuration]]
		      run_list = recipe[before], recipe[cluster_init], recipe[after]

When Cluster Init runs, the directory structure stored in the named cluster init
will be downloaded locally on each instance in the cluster.

For Linux, the directory structure is replicated under:

		/mnt/cluster-init

For Windows, the directory structure is replicated under:

		C:\cluster-init

The local copy of the cluster init structure also contains a `run` directory used to track execution of the cluster init executables and a `log` directory which stores log output for cluster init execution.

For example, the cluster init directory on a Linux instance will look like this:

		/mnt/
		|-- clusterinit/
		|---- executables/
		|---- log/
		|---- run/
		|---- scratch/
		|---- shared/

> [!NOTE]
> The `/mnt/clusterinit` directory may contain other (deprecated) directories as well.

## Scratch

Files in the cluster init scratch directory will be replicated on the local drive of each instance. The scratch directory provides fast local access to its files, but data stored here will not persist when a node is terminated.

In Linux, the cluster init scratch directory is found at `/mnt/cluster-init/scratch` and on Windows at `C:\cluster-init\scratch`. Upon start-up, each instance will sync all files from the cloud storage scratch directory (for example `az://com.cyclecloud.demo.locker/clusterinit/default/scratch/`) to the local `/mnt/cluster-init/scratch` directory.

It is not recommended to modify files directly in the cluster init `scratch` directory since they are synced from cloud storage.  Every instance in the cluster has a general purpose `scratch` directory on its local drive. This directory is intended to be used for temporary scratch space or local reference files. As with the cluster init scratch directory, data stored here will not be persisted if a node is terminated. On Linux, this directory is located at `/mnt/scratch` and on Windows it is the `C:\` drive.

## Shared

Most CycleCloud clusters include a shared filesystem (usually shared from the head node in the case of Condor or Grid Engine clusters). For clusters with a shared filesystem, the cluster init `shared` directory will be replicated from az to the filer at start-up and shared with all instances in the cluster. This directory is intended to be used for data which needs to be shared with all nodes in the cluster.

In Linux, the cluster-init shared directory is found at `/mnt/cluster-init/shared` and on Windows at `C:\cluster-init\shared`. The shared directory is synced once from the shared Azure directory onto the filer.

It is not recommended to modify files directly in the cluster init
`shared` directory since they are synced from cloud storage. In clusters with a shared drive, by default, every instance has access to a general purpose shared directory as well. On Linux, this directory is located at `/shared` and on Windows it is the `S:\` drive.

## Executables

When a CycleCloud node comes up, after downloading the `shared` and `scratch` directories, it will download **every** file in the executables directory and then run each in lexicographical order as the root/system user. Scripts inside the executables directory can be used to customize each node in your cluster, for example by adding users, creating directories, copying data, etc. These files are downloaded to `/mnt/cluster-init/executables` on Linux and `C:\cluster-init\executables` on Windows. Each script will be run to completion once and only once. Once a file has been executed sucessfully, a file with a `.run` extension will be created in the `/mnt/cluster-init/run/executables` directory on Linux or `C:\cluster-init\run\executables` on Windows.

You can create subdirectories inside the `executables` directory, but files located in subdirectories will **not** be run. You can use subdirectories as a place to put library and support files for the scripts intended to be run, or you can put scripts that you will manually run under certain circumstances. This can be particularly useful for python cluster init scripts, since it allows storing modules relative to the script.

Scripts in the `executables` directory are run in alphabetical order.  To ensure that scripts are run in the proper order, it is common to prefix your scripts with numbers like:

		01-setup.sh
		02-configure.sh
		...
		99-finalize.sh

For example, if we wanted to add an SSH key to the `authorized_keys` file for the root user we could write a cluster init executable script named `01-add-root-key.sh` which contains the following:

		#!/bin/bash echo "ssh-rsa
		AAAAB3NzaC1yc2EAAAABIwAAAQEAy-INCOMPLETE_KEY" >> /root/.ssh/authorized_keys

This file would be located in Azure at a location of `az://com.cyclecloud.demo.locker/cluster-init/default/executables/01-add-root-key.sh`. When it is run, it will append the SSH key to the `authorized_keys` file and then create the file: `/mnt/cluster-init/run/executables/01-add-root-key.sh.run` to indicate that the script has run to completion.

If the script does not run to completion, STDOUT and STDERR are stored for later debugging in the directory `/mnt/cluster-init/log/exexutables` or `C:\cluster-init\log\executables` with filenames similar to the one being run but appended with a timestamp. For example, if the above script had an error we would see log files named:

		01-add-root-key.sh.2013-10-22T14:42:10-04:00.err
		01-add-root-key.sh.2013-10-22T14:42:10-04:00.out

By default, failed scripts **will** prevent the node from successfully converging. This is the correct behavior in almost all cases. (A failed executable is defined as one that returns a non-zero exit code. If a particular executable returns non-zero on success, it should be wrapped with a script that returns 0 when the executable is successful, so that other errors can still be detected.) It is *strongly* recommended to design cluster inits for this behavior. However, if you need to toggle this behavior, set `cluster_init.fail_on_error` to false in the `[[[configuration]]]` section for the node.


## Reading Node Configuration

You can read the values sent to each node in its
`[[[configuration]]]` section from a cluster init script using the
`jetpack config` command:

		$ jetpack config <name of param> [optional default value]

For example, if you had a node definition where you set the Cycle
Server http port to be 8000:

		[[node master]] [[[configuration]]] cycle_server.http_port = 8000

In your cluster init script you may want to use iptables to route port
80 to port 8000. A simple cluster init script may look like the
following:

		#!/bin/bash

		iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8000

Rather than hardcoding the port to 8000, you can use the `jetpack`
tool to pull the Cycle Server port out of the configuration so that
you can change the port without modifying your cluster init scripts:

		#!/bin/bash

		# Get the cycle_server.http port value, or 8080 (default) if not
		specified.

		CS_PORT=$(jetpack config cycle_server.http_port 8080)
		iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port $CS_PORT


# Debugging Cluster Init Failures

There are two main ways that cluster init can fail.

1. The cluster init recipe may fail to download files from the cloud storage provider.
2. One or more cluster init executable scripts may fail during execution.

To detect failures, the best place to look is in the Chef converge log. On Linux, this is generally found at:

		/opt/cycle/jetpack/logs/chef-client.log

and on Windows, it is generally found at:

		C:\cycle\logs\chef-client.log

The failing line will appear in that log as either a "sync" operation or an execute operation for a specific executable. If it is a failing executable, then the full path to the log files for the execution will appear at the top of the Chef stack trace.

Failures to download cluster init from cloud storage indicate either incorrect credentials, an incorrect URL for the Locker, or an incorrect Cluster Init name. Log in to the CycleCloud GUI and check the spelling of the locker URL and the ClusterInit attribute on the node.

The best way to debug Cluster Init executable failures is to examine the log of the last execution of the script. Cluster Init will store standard output and error logs for each executable in the cluster init logs directory.

For Linux, the logs directory is located at:

		/mnt/cluster-init/logs/executables/

and for Windows, the directory is located at:

		C:\cluster-init\logs\executables\

# Tips and Tricks

* Long running executables delay node startup time. Try to keep your script as short as possible.
* Executables only run once by default, but you can force them to re-run by deleting their corresponding run file in `/mnt/cluster-init/run/executables` and triggering another converge with `jetpack converge`
* By default, clusters reconverge every 20 minutes, meaning they will re-sync the cluster init directories and run any new executable scripts.  Developers can take advantage of this to push changes to clusters by adding new executable scripts. Just keep in mind that the new scripts will also be run on new nodes.
* Executables and packages are run in lexical order (ie, alphabetically), so it can be useful to prefix their names with numbers to easily ensure the right ordering.
* Windows supports cluster init with the following conditions:

	* Powershell scripts should be wrapped in a `.cmd` or `.bat` script.
	* For cluster inits intended for use in mixed Linux and Windows clusters, executable scripts may be placed inside a `windows` subdirectory to denote that they are Windows-specific executables.

* To ensure that files in `scratch` and `shared` are available for use by
  `executables`, the order each of the directories are processed is:

        * shared
        * scratch
        * executables
