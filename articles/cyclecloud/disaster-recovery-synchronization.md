# Using Synchronization for Disaster Recovery

The synchronization approach relies on Azure CycleCloud's internal database backup feature to pass snapshots of the data store from the currently active instance to a cold instance in a safe and reliable manner. It requires that you maintain a live machine with a powered-down (cold) CycleCloud instance that matches the active (hot) CycleCloud instance. This method has the advantage of being very fast to bring up in a disaster recovery scenario, thanks to the frequent synchronizations and the already-on hardware.

When the active instance fails:

1. Restore the cold instance from the latest sync
2. Turn on the cold CycleCloud instance
3. Switch DNS records to point to this now-running instance

## Create a CycleCloud Data Store Backup Policy

The active instance must be set to backup the data store to local disk periodically. By default, CycleCloud is set to do backups at intervals that are friendly to the synchronization approach for disaster recovery.

To change the default policy, click on the Admin menu and select **Browse Data**. From the list of data store types on the left side of the page, select **Application** then **Backup Plan**. Select the one plan in the top half of the table view, then select the corresponding entry in the lower half of the table. Click the **Edit** button to adjust the policy.

A plan consists of the following attributes:

| Attribute       | Type    | Description                                                                                                          |
| --------------- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| Name            | String  | A unique identifier for this backup plan.                                                                            |
| Schedule        | String  | How often to take a snapshot.                                                                                        |
| BackupDirectory | String  | Where on disk to store the backup data.                                                                              |
| Description     | String  | Description of backup plan.                                                                                          |
| Disabled        | Boolean | If true, backups will not be taken for this plan. Existing backups will not be removed. Optional; defaults to false. |

## The Schedule

The Schedule attribute of a backup plan controls how often to take backups. It supports a rolling schedule of frequent, recent backups and less frequent, older backups. The schedule is a set of non-overlapping intervals of increasing length. For example, a simple "keep backups every hour for a day, and daily after that, for a week" would produce 24 backups in the first day, and 6 more spaced out through the remaining 6 days. The syntax for expressing this is a comma-separated list of durations, followed by the total duration:

	 1h,1d/7d

In the example above, backups will be taken at a rate of one per hour for one full day. When the 25th is taken, the oldest backup will be preserved as the first daily backup. Subsequent hourly backups will be deleted until another day elapses, at which time the oldest backup becomes the second daily backup and the day-old backup becomes the first daily backup. This will continue for 4 more days, and will create 30 backups. When the oldest backup is over a week old, it will be removed. Note that the backups are not labeled as "hourly" or "daily" on disk - they are simply tagged with the date and time they were taken.

The schedule can be a more complicated pattern than the above. The only requirement is that each successive interval be a multiple of the previous:

	 5m,15m,1h,2h,4h,8h,1d/7d

This would keep 5-minute backups for 15 minutes, 15-minute backups for rest of the hour, backups at the 1 hour, 2 hour, 4 hour, 8 hour and 16 hour marks, and daily backups for 7 days, or 14 total backups, with a focus on recent data.

The schedule can be changed at any time, and CycleCloud will attempt to preserve as many existing backups as it can by reusing them for the new schedule. It will delete backups as necessary to match the desired number of samples and distributions over time. It only deletes backups if there are too many in an interval, not too few, so in no case will changing the schedule wipe all the backups and start over.


# Create a Cold DR Instance

A mirror installation of the CycleCloud instance is required on the cold instance. The cold instance should be installed in the same local path and have the same file-level permissions and ownership. The cold instance should be set to not start on boot if the server on which it is being staged happens to restart. The cold instance will also require the [HTCondor binaries](http://research.cs.wisc.edu/condor/download/) be installed the same as on the currently active instance if you're using CycleCloud to manage HTCondor pools, or the appropriate [Grid Engine](http://gridengine.org/blog/2011/11/23/what-now/) binaries if you're managing xGE pools.

On Linux you can use `rsync_` to create the initial, mirror copy of the currently active instance. For example, if the currently active instance is in `/opt/cycle_server` on *MachineA* and you want to use *MachineB* for disaster recovery, you could do the initial synchronization of *MachineA* -> *MachineB* with:

	 rsync -avz -e ssh remoteuser@MachineB:/opt/cycle_server /opt/cycle_server/

You will also need to configure *MachineB*'s `/etc/init.d/cycle_server` file and set CycleCloud to not start in any run level on reboot. You can copy the active instance's `/etc/init.d/cycle_server` file to the cold instance in much the same way you copied CycleCloud:

	rsync -avz -e ssh remoteuser@MachineB:/etc/init.d/cycle_server /etc/init.d/

On Windows you should do a fresh install of CycleCloud using the same CycleCloud installation package that was used to deploy CycleCloud on the active instance. Once installed, stop CycleCloud with `c:\Program Files\CycleCloud\cycle_server.cmd stop` and set the two CycleCloud-related services to not run on boot.

![Azure CycleCloud and CycleCloudDB Services](~/images/cs_services.png)

## Configuring Failover Using a Shared Filesystem

If both CycleCloud hosts mount a shared drive, configuring Hot-to-cold failover is simple: install and run CycleCloud directly from the shared drive. With this option, in a failover scenario when CycleCloud is stopped on the currently active machine due to failure, CycleCloud may simply be started on the cold backup and it will immediately resume operation.

>[!NOTE]
>Running CycleCloud from a shared drive may be put a significant load on the filesystem and network. For heavily loaded CycleCloud installations, the recommended configuration is to run CycleCloud from the local drive and store only the backups to the shared drive.

To configure Azure CycleCloud to use a shared drive for backups, select a location on the shared drive to store the CycleCloud backups. Then, for both the Active and Cold CycleCloud instances, configure the BackupDirectory attribute in the BackupPolicy ad to use this location. You can install the active CycleCloud instance, apply the configuration change, then copy it to the cold instance using rsync as described above.

## Configure Periodic Active-to-Cold Instance Synchronization

An active-to-cold synchronization has two parts: the mainly-static parts and the dynamic data store.  The layout of a CycleCloud installation on disk looks like this:

	cycle_server/
		components/
		config/
		cycle_server
		data/
			backups/
			cycle_server/
			derby.properties
		docs/
		lib/
		license.txt
		logs/
		plugins/
		README.txt
		system/
		util/
		work/

The data store, including backups are in the `data` directory. The remaining directories and files
are mostly static. The sync of the static directories should exclude the `data` directory and the
sync of the `data` directory should only include the `backups` subdirectory.

## Sync with [robocopy](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/robocopy) (Windows)

`robocopy_` is an advanced copy tool that can do file system tree synchronization and WAN traffic shaping for large transfers between Windows machines.

The first robocopy_ call will synchronize the mostly static portions of CycleCloud. This includes any plugins that might have been installed and any customer configurations that may have been applied to the CycleCloud instance. A second robocopy_ call is necessary to synchronize the dynamic portion of CycleCloud, the data store, using the periodic backups. You can create a simple script that takes care of this via a Scheduled Task.

This example assumes the cold CycleCloud's `C:\Program Files` is mounted as `Z:`.

1. Synchronize the static content:

    robocopy "C:\Program Files\CycleCloud" Z:\CycleCloud /COPYALL /SL /PURGE /XD data logs /XF license.dat /E

2. Synchronize the backups of the dynamic data store content:

    robocopy "C:\Program Files\CycleCloud\data\backups" Z:\CycleCloud\data\backups /COPYAL /SL /PURGE /E

These two commands can be combined in to a single batch script.

## Sync with [rsync](https://rsync.samba.org/) (Linux)

The rsync_ installation should be configured to allow passwordless rsyncs to occur between the active instance and the cold instance. We recommend using ssh_ to accomplish this, as well as running this process as root so file permissions and ownership are easily maintained across the boxes.

Generate a pair of ssh keys for the active instance to use during the rsync_ process to ensure rsync_ doesn't require a password to communicate with the cold instance from the active instance:

  	% ssh-keygen -t rsa -b 2048 -f /root/cron/dr-rsync-key
  	Generating public/private rsa key pair.
  	Enter passphrase (empty for no passphrase): [press enter here]
  	Enter same passphrase again: [press enter here]
  	Your identification has been saved in ~/cron/dr-rsync-key.
  	Your public key has been saved in ~/cron/dr-rsync-key.pub.
  	The key fingerprint is:
  	2e:28:d9:ec:85:21:e7:ff:73:df:2e:07:78:f0:d0:a0 root@thishost

  	% chmod 600 ~/cron/dr-rsync-key

Add the contents of `~/cron/dr-rsync-key.pub` to the `/root/.ssh/authorized_keys` file on the cold instance:

	 scp ~/cron/dr-rsync-key.pub root@remotehost:/root/

ssh_ to the cold instance, obtain a root prompt, and import the key:

  	% if [ ! -d .ssh ]; then mkdir .ssh ; chmod 700 .ssh ; fi
  	cd .ssh/
  	if [ ! -f authorized_keys ]; then touch authorized_keys ; chmod 600 authorized_keys ; fi
  	cat ~/dr-rsync-key.pub >> authorized_keys
  	rm ~/dr-rsync-key.pub

Ensure the ssh permissions on the cold instance either allow ssh access as root:

	 PermitRootLogin yes

Or at least allow the execution of remote commands via ssh as root with:

	 PermitRootLogin forced-commands-only

From the active instance, you can test that the rsync_ command works with:

    rsync -avz --dry-run -e "ssh -i /root/cron/dr-rsync-key" /opt/cycle_server/ root@remotehost:/opt/cycle_server

This will do a dry run of an rsync. The rsync_ command should connect and compare the files.

The first rsync_ call will synchronize the mostly static portions of CycleCloud. This includes any plugins that might have been installed and any customer configurations that may have been applied to the CycleCloud instance. A second rsync_ call is necessary to synchronize the dynamic portion of CycleCloud using the periodic backups. We can create a simple script that takes care of this via a cron_ job:

  	rsync -avz --delete -e "ssh -i /root/cron/dr-rsync-key" \
  		--exclude 'data/' \
  		--exclude 'logs/' \
                  --exclude 'license.dat' \
  		/opt/cycle_server/ root@remotehost:/opt/cycle_server

With the static content synchronized, the backups of the dynamic data store content can be synchronized with:

  	rsync -avz --delete -e "ssh -i /root/cron/dr-rsync-key" \
  		/opt/cycle_server/data/backups/ root@remotehost:/opt/cycle_server/data/backups

These two commands can be combined in to a single shell script that performs the rsync, logs the output and keeps the log file rotated. For example, the following script, `/root/cron/dr_sync` combines everything:

  	#!/bin/sh
  	COLD_INSTANCE=somehost
  	DIR=/root/cron
  	KEY=${DIR}/dr-rsync-key
  	LOG = ${DIR}/dr_sync.log
  	LOCK = ${DIR}/dr_sync.lock
  	CS_HOME=/opt/cycle_server

  	exec 9>${LOCK}
  	if ! flock -n 9  ; then
  		echo "Another instance of dr_sync is already running";
  		exit 1
  	fi

  	echo "----------" >> ${LOG}
  	echo `date` >> ${LOG}

  	rsync -avz --delete -e "ssh -i ${KEY}" \
  		--exclude 'data/' \
  		--exclude 'logs/' \
  		${CS_HOME}/ root@${COLD_INSTANCE}:${CS_HOME} 2>&1 >> ${LOG}

  	rsync -avz --delete -e "ssh -i ${KEY}" \
  		${CS_HOME}/data/backups/ \
                  root@${COLD_INSTANCE}:${CS_HOME}/data/backups 2>&1 >> ${LOG}

  	logrotate /root/cron/dr_sync.conf

The `dr_sync.conf` file for logrotate_:

  	/root/cron/dr_sync.log {
   	 compress
  	 missingok
  	 copytruncate
  	 nocreate
  	 notifempty
  	 rotate 4
  	 size=5M
  	 daily
  	}

The suggested frequency for this sync is in the 30-60 minute range:

	 0,30 * * * * /root/cron/dr_sync

# Failing Over to a Cold DR Instance

If the primary CycleCloud instance fails, start the DR instance. The first step
is to restore the database from the backups you have synced. CycleCloud provides a restore utility
to make this process easier:

* `C:\Program Files\CycleCloud\util\restore.bat` on Windows
* `/opt/cycle_server/util/restore.sh` on Linux

In most cases, the most recent backup is the correct choice to sync. If the primary CycleCloud instance became unavailable during the synchronization process, you may need to select the next-most recent.

Backups are stored in `$CS_HOME/data/backups` and are named `backup-%Y-%m-%d_%H-%M-%S-%z`. Once you
have the most recent backup, you can run the restore utility:

       % ./util/restore.sh data/backups/backup-2015-12-23_12-19-17-0500
       Backup: data/backups/backup-2015-12-23_12-19-17-0500
       Warning: All current data in the database will be replaced with the contents of this file.
       Are you sure you want to restore the backup? [no] yes
       Stopping...
       Restoring database from data/backups/backup-2015-12-23_12-19-17-0500...
       Restored database (0:00:05 sec).
       Restarted.

The restore utility will restart CycleCloud and when it finishes booting, you will be able to begin
using the DR instance.
