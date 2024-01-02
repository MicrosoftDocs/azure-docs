---
title: Use the Apache HBase HBCK2 tool
description: Learn how to use the HBase HBCK2 tool.
services: hdinsight
author: robinroy
ms.author: robinroy
ms.service: hdinsight
ms.custom: troubleshooting
ms.topic: conceptual
ms.date: 05/05/2023
---
# Use the Apache HBase HBCK2 tool

This article shows you how to use the HBase HBCK2 tool. HBCK2 is the repair tool for Apache HBase clusters.

## HBCK2 overview

HBCK2 is currently a simple tool that does only one thing at a time. In hbase-2.x, the Master is the final arbiter of all state, so a general principle for most HBCK2 commands is that it asks the Master to make all repairs.

A Master must be up and running before you can run HBCK2 commands. HBCK1 performed analysis and reported your cluster as good or bad, but HBCK2 is less presumptuous. In hbase-2.x, the operator determines what needs to be fixed and then uses tooling, including HBCK2, to make repairs.

## HBCK2 vs. HBCK1

HBCK2 is the successor to HBCK, the repair tool that shipped with hbase-1.x (also known as HBCK1). You can use HBCK2 in place of HBCK1 to make repairs against hbase-2.x clusters. HBCK1 shouldn't be run against an hbase-2.x installation because it might do damage. Its write-facility (`-fix`) has been removed. It can report on the state of an hbase-2.x cluster, but its assessments are inaccurate because it doesn't understand the internal workings of an hbase-2.x.

HBCK2 doesn't work the way HBCK1 used to, even in cases where commands are similarly named across the two versions.

## Obtain HBCK2

You can find the release under the HBase distribution directory. For more information, see the [HBase downloads page](https://dlcdn.apache.org/hbase/hbase-operator-tools-1.2.0/hbase-operator-tools-1.2.0-bin.tar.gz).

### Master UI: The HBCK Report

An HBCK Report page added to the Master in 2.1.6 at `/hbck.jsp` shows output from two inspections run by the Master on an interval. One is the output by the `CatalogJanitor` whenever it runs. If overlaps or holes are found in `hbase:meta`, the `CatalogJanitor` lists what it has found. Another background `chore` process compares the `hbase:meta` and file-system content. If an anomaly is found, it makes a note in its HBCK Report section.

To run the `CatalogJanitor`, execute the command in the hbase shell: `catalogjanitor_run`.

To run the `hbck chore`, execute the command in the hbase shell: `hbck_chore_run`.

Both commands don't take any inputs.

## Run HBCK2

You can run the `hbck` command by launching it via the `$HBASE_HOME/bin/hbase` script. By default, when you run `bin/hbase hbck`, the built-in HBCK1 tooling is run. To run HBCK2, you need to point at a built HBCK2 jar by using the `-j` option, as in this example:

`hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar`

This command prints the HBCK2 help, without passing options or arguments.

## HBCK2 commands

> [!NOTE]
> Test these commands on a test cluster to understand the functionality before you run them in a production environment.

`assigns [OPTIONS] <ENCODED_REGIONNAME/INPUTFILES_FOR_REGIONNAMES>... | -i <INPUT_FILE>...`

Options:

* `-o,--override`: Overrides ownership by another procedure.
* `-i,--inputFiles`: Takes one or more encoded region names.

This `raw` assign can be used even during Master initialization (if the `-skip` flag is specified). It skirts coprocessors and passes one or more encoded region names. `de00010733901a05f5a2a3a382e27dd4` is an example of what a user-space encoded region name looks like. For example:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar assigns de00010733901a05f5a2a3a382e27dd4
```

It returns the PIDs of the created `AssignProcedures` or -1 if none. If `-i or --inputFiles` is specified, it passes one or more input file names. Each file contains encoded region names, one per line. For example:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar assigns -i fileName1 fileName2
```

`unassigns [OPTIONS] <ENCODED_REGIONNAME>...| -i <INPUT_FILE>...`

Options:

* `-o,--override`: Overrides ownership by another procedure.
* `-i,--inputFiles`: Takes ones or more input files of encoded names.

This `raw` unassign can be used even during Master initialization (if the `-skip` flag is specified). It skirts coprocessors and passes one or more encoded region names. `de00010733901a05f5a2a3a382e27dd4` is an example of what a user override space encoded region name looks like. For example:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar unassign de00010733901a05f5a2a3a382e27dd4 
```

It returns the PIDs of the created `UnassignProcedures` or -1 if none. If `-i or --inputFiles` is specified, it passes one or more input file names. Each file contains encoded region names, one per line. For example:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar unassigns fileName1 -i fileName2
```

`bypass [OPTIONS] <PID>...`

Options:

* `-o,--override`: Overrides if the procedure is running or stuck.
* `-r,--recursive`: Bypasses the parent and its children. *This option is slow and expensive.*
* `-w,--lockWait`: Waits milliseconds before giving up. Default=1.
* `-i,--inputFiles`: Takes one or more input files of PIDs.

It passes one or more procedure PIDs to skip to the procedure finish. The parent of the bypassed procedure skips to the finish. Entities are left in an inconsistent state and require manual repair. It might need a Master restart to clear locks that are still held. Bypass fails if the procedure has children. Add `recursive` if all you have is a parent PID to finish the parent and children. *This option is slow and dangerous, so use it selectively. It doesn't always work*.

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar bypass <PID>
```

If `-i or --inputFiles` is specified, pass one or more input file names. Each file contains PIDs, one per line. For example:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar bypass -i fileName1 fileName2
```

`reportMissingRegionsInMeta <NAMESPACE|NAMESPACE:TABLENAME>... | -i <INPUT_FILE>...`

Option:

* `i,--inputFiles`: Takes one or more input files of namespace or table names.

Use this option when regions are missing from `hbase:meta` but when directories are still present in HDFS. This command is only a check method. It's designed for reporting purposes and doesn't perform any fixes. It provides a view of which regions (if any) would get readded to `hbase:meta`, grouped by respective table or namespace.

To effectively readd regions in meta, run `addFsRegionsMissingInMeta`. This command needs `hbase:meta` to be online. For each namespace/table passed as a parameter, it performs a diff between regions available in `hbase:meta` against existing regions' dirs on HDFS. Region dirs with no matches are printed grouped under its related table name. Tables with no missing regions show a "no missing regions" message. If no namespace or table is specified, it verifies all existing regions.

It accepts a combination of multiple namespaces and tables. Table names should include the namespace portion, even for tables in the default namespace. Otherwise, it assumes a namespace value. This example triggers missing regions reports for the tables `table_1` and `table_2`, under a default namespace:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar reportMissingRegionsInMeta default:table_1 default:table_2

```

This example triggers a missing regions report for the table `table_1` under a default namespace, and for all tables from namespace `ns1`:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar reportMissingRegionsInMeta default:table_1 ns1
```

It returns a list of missing regions for each table passed as a parameter, or for each table on namespaces specified as a parameter. If `-i or --inputFiles` is specified, it passes one or more input file names. Each file contains `<NAMESPACE|NAMESPACE:TABLENAME>`, one per line. For example:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar reportMissingRegionsInMeta -i fileName1 fileName2
```

`addFsRegionsMissingInMeta <NAMESPACE|NAMESPACE:TABLENAME>... | -i <INPUT_FILE>...`

Option:

* `-i,--inputFiles`: Takes one or more input files of namespace table names to be used when regions are missing from `hbase:meta` but directories are still present in HDFS. *Needs `hbase:meta` to be online.*

For each table name passed as a parameter, it performs a diff between regions available in `hbase:meta` and region dirs on HDFS. Then for dirs with no `hbase:meta` matches, it reads the `regioninfo` metadata file and re-creates a specific region in `hbase:meta`. Regions are re-created in the CLOSED state in the `hbase:meta` table, but not in the `Masters` cache. They aren't assigned either. To get these regions online, run the HBCK2 `assigns` command printed when this command run finishes.

If you're using hbase releases older than 2.3.0, a rolling restart of HMasters is needed prior to executing the set of `assigns` output. This example adds missing regions for tables `tbl_1` in the default namespace, `tbl_2` in namespace `n1`, and for all tables from namespace `n2`:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar addFsRegionsMissingInMeta default:tbl_1 n1:tbl_2 n2
```

It returns HBCK2 and an `assigns` command with all reinserted regions. If `-i or --inputFiles` is specified, it passes one or more input file names. Each file contains `<NAMESPACE|NAMESPACE:TABLENAME>`, one per line. For example:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar addFsRegionsMissingInMeta -i fileName1 fileName2
```

`extraRegionsInMeta <NAMESPACE|NAMESPACE:TABLENAME>... | -i <INPUT_FILE>...`

Options:

* `-f, --fix`: Fixes meta by removing all extra regions found.
* `-i,--inputFiles`: Takes one or more input files of namespace or table names.

It reports regions present on `hbase:meta` but with no related directories on the file system. *Needs `hbase:meta` to be online.* For each table name passed as a parameter, it performs diff between regions available in `hbase:meta` and region dirs on the specific file system. Extra regions would get deleted from Meta if it passed the `--fix` option.

> [!NOTE]
> Before you decide to use the `--fix` option, it's worth checking if reported extra regions are overlapping with existing valid regions. If so, then `extraRegionsInMeta --fix` is the optimal solution. Otherwise, the `assigns` command is the simpler solution. It re-creates the regions' dirs in the file system, if they don't exist.

This example triggers extra regions reports for `table_1` under the default namespace, and for all tables from the namespace `ns1`:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar extraRegionsInMeta default:table_1 ns1
```

This example triggers extra regions reports for `table_1` under the default namespace, and for all tables from the namespace `ns1` with the fix option:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar extraRegionsInMeta -f default:table_1 ns1
```

It returns a list of extra regions for each table passed as a parameter, or for each table on namespaces specified as a parameter. If `-i or --inputFiles` is specified, pass one or more input file names. Each file contains `<NAMESPACE|NAMESPACE:TABLENAME>`, one per line. For example:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar extraRegionsInMeta -i fileName1 fileName2
```

`fixMeta`

> [!NOTE]
> This option doesn't work well with HBase 2.1.6. We don't recommend it for use on a 2.1.6 HBase cluster.

Do a server-side fix of bad or inconsistent state in `hbase:meta`. The Master UI has a matching new `HBCK Report` tab that dumps reports generated by the most recent run of `catalogjanitor` and a new `hbck chore`.

*It's critical that `hbase:meta` should first be made healthy before you make any other repairs*. It fixes `holes` and `overlaps`, creating (empty) region directories in HDFS to match regions added to `hbase:meta`.

 *This command isn't the same as the old _hbck1_ command that's similarly named*. It works against the reports generated by the last `catalog_janitor` and `hbck chore` runs. If there's nothing to fix, the run is a loop. Otherwise, if the `HBCK Report` UI reports problems, a run of `fixMeta` clears up `hbase:meta` issues.

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar fixMeta
```

`generateMissingTableDescriptorFile <NAMESPACE:TABLENAME>`

This command tries to fix an orphan table by generating a missing table descriptor file. This command has no effect if the table folder is missing or if `.tableinfo` is present. (We don't override existing table descriptors.) This command first checks if `TableDescriptor` is cached in HBase Master, in which case it recovers `.tableinfo` accordingly. If `TableDescriptor` isn't cached in Master, it creates a default `.tableinfo` file with the following items:

- The table name.
- The column family list determined based on the file system.
- The default properties for both `TableDescriptor` and `ColumnFamilyDescriptors`.
If the `.tableinfo` file was generated by using default parameters, make sure you check the table or column family properties later. (Change them if needed.) This method doesn't change anything in HBase. It only writes the new `.tableinfo` file to the file system. For orphan tables, for example, `ServerCrashProcedures` to stick, you might need to fix the error after you generated the missing table info files.

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar generateMissingTableDescriptorFile namespace:table_name
```

`replication [OPTIONS] [<NAMESPACE:TABLENAME>... | -i <INPUT_FILE>...]`

Options:

* `-f, --fix`: Fixes any replication issues found.
* `-i,--inputFiles`: Takes one or more input files of table names.

It looks for undeleted replication queues and deletes them if it passed the `--fix` option. It passes a table name to check for a replication barrier and purge if `--fix`.

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar replication namespace:table_name
```

If `-i or --inputFiles` is specified, it passes one or more input file names. Each file contains `<TABLENAME>`, one per line. For example:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar replication -i fileName1 fileName2
```

`setRegionState [<ENCODED_REGIONNAME> <STATE> | -i <INPUT_FILE>...]`

Option:

* `-i,--inputFiles`: Takes one or more input files of encoded region names and states.

Possible region states:

* OFFLINE
* OPENING
* OPEN
* CLOSIN
* CLOSED
* SPLITTING
* SPLIT
* FAILED_OPEN
* FAILED_CLOSE
* MERGING
* MERGED
* SPLITTING_NEW
* MERGING_NEW
* ABNORMALLY_CLOSED

> [!WARNING]
> This risky option is intended for use only as a last resort.

Example scenarios include unassigns or assigns that can't move forward because the region is in an inconsistent state in `hbase:meta`. For example, the `unassigns` command can only proceed if it's passed a region in one of the following states: SPLITTING, SPLIT, MERGING, OPEN or CLOSING.

 Before you manually set a region state with this command, certify that this region isn't handled by a running procedure, such as `assign` or `split`. You can get a view of running procedures in the hbase shell by using the `list_procedures` command. This example sets the region `de00010733901a05f5a2a3a382e27dd4` to CLOSING:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar setRegionState de00010733901a05f5a2a3a382e27dd4 CLOSING
```

It returns `0` if the region state changed and `1` otherwise. If `-i or --inputFiles` is specified, pass one or more input file names. Each file contains `<ENCODED_REGIONNAME> <STATE>`, one pair per line. For example:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar setRegionState -i fileName1 fileName2
```

`setTableState [<TABLENAME> <STATE> | -i <INPUT_FILE>...]`

Option:

* `-i,--inputFiles`: Takes one or more input files of table names and states.

Possible table states are ENABLED, DISABLED, DISABLING, and ENABLING.

To read the current table state, in the hbase shell, run:

```
hbase> get 'hbase:meta', '<TABLENAME>', 'table:state'
```

A value of x08x00 == ENABLED, x08x01 == DISABLED, etc. It can also run `describe <TABLENAME>` at the shell prompt. This example makes the table name user ENABLED:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar setTableState users ENABLED
```

It returns whatever the previous table state was. If `-i or --inputFiles` is specified, it passes one or more input file names. Each file contains `<TABLENAME> <STATE>`, one pair per line. For example:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar setTableState -i fileName1 fileName2
```

`scheduleRecoveries <SERVERNAME>... | -i <INPUT_FILE>...`

Option:

* `-i,--inputFiles`: Takes one or more input files of server names.

Schedule `ServerCrashProcedure(SCP)` for a list of `RegionServers`. Format the server name as `<HOSTNAME>,<PORT>,<STARTCODE>`. (See HBase UI/logs.)

This example uses `RegionServer` `a.example.org, 29100,1540348649479`:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar scheduleRecoveries a.example.org,29100,1540348649479
```

It returns the PIDs of the created `ServerCrashProcedures` or -1 if no procedure is created. (See Master logs for why it doesn't.) Command support is added in HBase versions 2.0.3, 2.1.2, 2.2.0, or newer. If `-i or --inputFiles` is specified, it passes one or more input file names. Each file contains `<SERVERNAME>`, one per line. For example:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar scheduleRecoveries -i fileName1 fileName2 

```

## Fix problems

This section helps you troubleshoot common issues.

### General principles

When you make a repair, *make sure that `hbase:meta` is consistent first before you fix any other issue type*, such as a file-system deviance. Deviance in the file system or problems with assign should be addressed after the `hbase:meta` is put in order. If `hbase:meta` has issues, the Master can't make proper placements when it adopts orphan file-system data or makes region assignments.

A region can't be assigned if it's in the CLOSING state (or the inverse, unassigned if in the OPENING state) without first transitioning via CLOSED. Regions must always move from CLOSED, to OPENING, to OPEN, and then to CLOSING and CLOSED.

When you make a repair, fix tables one at a time.

If a table is DISABLED, you can't assign a region. In the Master logs, you see that the Master reports skipped because the table is DISABLED. You can assign a region because it's currently in the OPENING state and you want it in the CLOSED state so that it agrees with the table's DISABLED state. In this situation, you might have to temporarily set the table status to ENABLED so that you can do the assign. Then you set it back again after the unassign statement. HBCK2 has the facility to allow you to do this change. See the HBCK2 usage output.

### Assign and unassign

Generally, on assign, the Master persists until it's successful. An assign takes an exclusive lock on the region. The lock precludes a concurrent assign or unassign from running. An assign against a locked region waits until the lock is released before making progress.

`Master startup cannot progress, in holding-pattern until region online`:

```
2018-10-01 22:07:42,792 WARN org.apache.hadoop.hbase.master.HMaster: hbase:meta,1.1588230740 isn't online; state={1588230740 state=CLOSING, ts=1538456302300, server=ve1017.example.org,22101,1538449648131}; ServerCrashProcedures=true. Master startup cannot progress, in holding-pattern until region online.
```

The Master is unable to continue startup because there's no procedure to assign `hbase:meta` (or `hbase:namespace`). To inject one, use the HBCK2 tool:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar assigns -skip 1588230740
```

In this example, 1588230740 is the encoded name of the `hbase:meta` region. Pass the `-skip` option to stop HBCK2 from doing a version check against the remote Master. If the remote Master isn't up, the version check prompts a `Master is initializing response` or `PleaseHoldException` and drops the assign attempt. The `-skip` command avoids the version check and lands the scheduled assign.

The same might happen to the `hbase:namespace` system table. Look for the encoded region name of the `hbase:namespace` region and take similar steps to what we did for `hbase:meta`. In this latter case, the Master actually prints a helpful message that looks like this example:

```
2019-07-09 22:08:38,966 WARN  [master/localhost:16000:becomeActiveMaster] master.HMaster: hbase:namespace,,1562733904278.9559cf72b8e81e1291c626a8e781a6ae. isn't online; state={9559cf72b8e81e1291c626a8e781a6ae state=CLOSED, ts=1562735318897, server=null}; ServerCrashProcedures=true. Master startup cannot progress, in holding-pattern until region onlined.
```

To schedule an assign for the `hbase:namespace` table noted in the preceding log line:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar -skip assigns 9559cf72b8e81e1291c626a8e781a6ae
```

Pass the encoded name for the namespace region. (The encoded name differs per deployment.)

### Missing regions in hbase:meta region/table restore/rebuild

Some unusual cases had table regions removed from the `hbase:meta` table. Triage on these cases revealed that they were operator induced. Users ran the obsolete HBCK1 OfflineMetaRepair tool against an HBCK2 cluster. OfflineMetaRepair is a well-known tool for fixing `hbase:meta` table-related issues on HBase 1.x versions. The original version isn't compatible with HBase 2.x or higher versions, and it has undergone some adjustments. In extreme situations, it can now be run via HBCK2.

In most of these cases, regions end up missing in `hbase:meta` at random, but hbase might still be operational. In such situations, the problem can be addressed with the Master online by using the `addFsRegionsMissingInMeta` command in HBCK2. This command is less disruptive to hbase than a full `hbase:meta` rebuild, which is covered later. It can be used even for recovering the namespace table region.

### Extra regions in hbase:meta region/table restore/rebuild

There can also be situations where table regions were removed in the file system but still have related entries on the `hbase:meta` table. This scenario might happen because of problems on splitting, manual operation mistakes (like deleting or moving the region dir manually), or even meta info data loss issues such as HBASE-21843.

Such problems can be addressed with the Master online by using the `extraRegionsInMeta --fix` command in HBCK2. This command is less disruptive to hbase than a full `hbase:meta` rebuild, which is covered later. It's also useful when this happens on versions that don't support the `fixMeta` HBCK2 option (any versions prior to 2.0.6, 2.1.6, 2.2.1, 2.3.0, or 3.0.0).
  
### Online hbase:meta rebuild recipe

If `hbase:meta` corruption isn't too critical, hbase can still bring it online. Even if the namespace region is among the missing regions, it's possible to scan `hbase:meta` during the initialization period, where Master is waiting for the namespace to be assigned. To verify this situation, an `hbase:meta` scan command can be executed. If it doesn't time out or show any errors, the `hbase:meta` is online:

```
echo "scan 'hbase:meta', {COLUMN=>'info:regioninfo'}" | hbase shell
```

HBCK2 `addFsRegionsMissingInMeta` can be used if the message doesn't show any errors. It reads region metadata info available on the FS region directories to re-create regions in `hbase:meta`. Because it can run with hbase partially operational, it attempts to disable online tables that are affected by the reported problem and it's going to readd regions to `hbase:meta`. It can check for specific tables or namespaces, or all tables from all namespaces. This example shows adding missing regions for tables `tbl_1` in the default namespace, `tbl_2` in namespace `n1`, and for all tables from the namespace `n2`:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar addFsRegionsMissingInMeta default:tbl_1 n1:tbl_2 n2
```

Because it operates independently from Master, after it finishes successfully, more steps are required to have the readded regions assigned. These messages are listed as follows:

- `addFsRegionsMissingInMeta` outputs an assigns command with all regions that got readded. This command must be executed later, so copy and save it for convenience.
- For HBase versions prior to 2.3.0, after `addFsRegionsMissingInMeta` finished successfully and output has been saved, restart all running HBase Masters.

After Masters are restarted and `hbase:meta` is already online (check if the web UI is accessible), run the assigns command from `addFsRegionsMissingInMeta` output saved earlier.

> [!NOTE]
> If the namespace region is among the missing regions, you need to add the `--skip` flag at the beginning of the assigns command returned.

If a cluster suffers a catastrophic loss of the `hbase:meta` table, a rough rebuild is possible by using the following recipe. In outline, we stop the cluster. Run the HBCK2 OfflineMetaRepair tool, which reads directories and metadata dropped into the file system and makes the best effort at reconstructing a viable `hbase:met` table. Restart your cluster. Inject an assign to bring the system namespace table online. Finally, reassign user space tables you want enabled. (The rebuilt `hbase:meta` creates a table with all tables offline and no regions assigned.)

### Detailed rebuild recipe

> [!NOTE]
> Use this option only as a last resort. We don't recommend it.

* Stop the cluster.
* Run the rebuild `hbase:meta` command from HBCK2. This command moves aside the original `hbase:meta` and puts in place a newly rebuilt one. This example shows how to run the tool. It adds the `-details` flag so that the tool dumps info on the regions it found in HDFS:

     ```
     hbase --config /etc/hbase/conf -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar org.apache.hbase.hbck1.OfflineMetaRepair -details
     ```
* Start up the cluster. It won't start up fully. It's stuck because the namespace table isn't online and there's no assign procedure in the procedure store for this contingency. The HBase Master log shows this state. This example shows what it logs:

     ```
     2019-07-10 18:30:51,090 WARN  [master/localhost:16000:becomeActiveMaster] master.HMaster: hbase:namespace,,1562808216225.725a0fe6c2c869d3d0a9ed82bfa80fa3. isn't online; state={725a0fe6c2c869d3d0a9ed82bfa80fa3 state=CLOSED, ts=1562808619952, server=null}; ServerCrashProcedures=false. Master startup can't progress, in holding-pattern until region onlined.
     ```
     
     To assign the namespace table region, you can't use the shell. If you use the shell, it fails with `PleaseHoldException` because the Master isn't yet up. (It's waiting for the namespace table to come online before it declares itself "up.") You have to use the HBCK2 assigns command. To assign, you need the namespace encoded name. It shows in the log quoted. That's `725a0fe6c2c869d3d0a9ed82bfa80fa3` in this case. You have to pass the `-skip` command to skip the Master version check. (Without it, your HBCK2 invocation elicits the `PleaseHoldException` because the Master isn't up yet.) This example adds an assign of the namespace table:

     ```
     hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar -skip assigns 725a0fe6c2c869d3d0a9ed82bfa80fa3
     ```
     
     If the invocation comes back with `Connection refused`, is the Master up? The Master shuts down after a while if it can't initialize itself. Restart the cluster/Master and rerun the assigns command.

* When the assigns run successfully, you see it emit something similar to the following example. The `48` on the end is the PID of the assign procedure schedule. If the PID returned is `-1`, the Master startup hasn't progressed sufficiently, so retry. Or, the encoded region name might be incorrect, so check for this issue.

     ```
     hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar -skip assigns 725a0fe6c2c869d3d0a9ed82bfa80fa3
     ```
     ```
     18:40:43.817 [main] WARN  org.apache.hadoop.util.NativeCodeLoader - Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
     18:40:44.315 [main] INFO  org.apache.hbase.HBCK2 - hbck sufpport check skipped
     [48]
     ```
* Check the Master logs. The Master should have come up. You see successful completion of PID=48. Look for a line like this example to verify a successful Master launch:

     ```
     master.HMaster: Master has completed initialization 132.515sec
     ```
     
     It might take a while to appear.

     The rebuild of `hbase:meta` adds the user tables in DISABLED state and the regions in CLOSED mode. Reenable tables via the shell to bring all table regions back online. Do it one at a time or see the enable all ".*" command to enable all tables at once.

     The rebuild meta is missing edits and might need subsequent repair and cleaning by using the facility outlined previously in this article.

### Dropped reference files, missing hbase.version file, and corrupted files

HBCK2 can check for hanging references and corrupt files. You can ask it to sideline bad files, which might be needed to get over humps where regions won't online or reads are failing. See the file-system command in the HBCK2 listing. Pass one or more table names (or use `none` to check all tables). Bad files are reported. Pass the `--fix` option to make repairs.

### Procedure restart

As a last resort, if the Master is distraught and all attempts at repair only turn up undoable locks or procedures that can't finish, or if the set of `MasterProcWALs` is growing without bounds, it's possible to wipe the Master state clean. Move aside the `/hbase/MasterProcWALs/` directory under your HBase installation and restart the Master process. It comes back as a tabular format without memory.

If at the time of the erasure all regions were happily assigned or offlined, on Master restart, the Master should pick up and continue as though nothing happened. But if there were regions in transition at the time, the operator has to intervene to bring outstanding assigns or unassigns to their terminal point.

Read the `hbase:meta` `info:state` columns as described to determine what needs to be assigned or unassigned. After all history is erased by moving aside the `MasterProcWALs`, none of the entities should be locked, so you're free to bulk assign or unassign.
