---
title: How to use Apache HBase HBCK2 Tool
description: Learn how to use  HBase HBCK2 Tool
services: hdinsight
author: robinroy
ms.author: robinroy
ms.service: hdinsight
ms.custom: troubleshooting
ms.topic: conceptual
ms.date: 05/05/2023
---
# How to use Apache HBase HBCK2 Tool

Learn how to use  HBase HBCK2 Tool.

## HBCK2 Overview

HBCK2 is currently a simple tool that does one thing at a time only. In hbase-2.x, the Master is the final arbiter of all state, so a general principle for most HBCK2 commands is that it asks the Master to affect all repair. A Master must be up and running, before you can run HBCK2 commands. While HBCK1 performed analysis reporting your cluster GOOD or BAD, HBCK2 is less presumptuous. In hbase-2.x, the operator figures what needs fixing and then uses tooling including HBCK2 to do fixup.


## HBCK2 vs HBCK1

HBCK2 is the successor to HBCK, the repair tool that shipped with hbase-1.x (A.K.A HBCK1). Use HBCK2 in place of HBCK1 making repairs against hbase-2.x clusters. HBCK1 shouldn't be run against a hbase-2.x install. It may do damage. Its write-facility (-fix) has been removed. It can report on the state of a hbase-2.x cluster but its assessments are inaccurate since it doesn't understand the internal workings of a hbase-2.x. HBCK2 doesn't  work the way HBCK1 used to, even for the case where commands are similarly named across the two versions.

## Obtaining HBCK2

You can find the release under the HBase distribution directory. See the HBASE Downloads Page.
https://dlcdn.apache.org/hbase/hbase-operator-tools-1.2.0/hbase-operator-tools-1.2.0-bin.tar.gz


### Master UI: The HBCK Report

An HBCK Report page added to the Master in 2.1.6 at `/hbck.jsp`, which shows output from two inspections run by the master on an interval. One is the output by the `CatalogJanitor` whenever it runs. If overlaps or holes in, `hbase:meta`, the `CatalogJanitor` lists what it has found. Another background 'chore' process added to compare `hbase:meta` and filesystem content; if any anomaly, it makes note in its HBCK Report section.

To run the CatalogJanitor, execute the command in hbase shell: `catalogjanitor_run`

To run hbck chore, execute the command in hbase shell: `hbck_chore_run`

Both commands don't take any inputs.

## Running HBCK2

We can run the hbck command by launching it via the $HBASE_HOME/bin/hbase script. By default, running bin/hbase hbck, the built-in HBCK1 tooling is run. To run HBCK2, you need to point at a built HBCK2 jar using the -j option as in:
`hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar`

This command with no options or arguments passed prints the HBCK2 help.

## HBCK2 Commands

> [!NOTE]
> Test these commands on a test cluster to understand the functionality before running in production environment

`**assigns [OPTIONS] <ENCODED_REGIONNAME/INPUTFILES_FOR_REGIONNAMES>... | -i <INPUT_FILE>...**`

**Options:**

-o,--override` - override ownership by another procedure

`-i,--inputFiles` - takes one or more encoded region names

A 'raw' assign that can be used even during Master initialization (if the -skip flag is specified). Skirts Coprocessors. Pass one or more encoded region names. de00010733901a05f5a2a3a382e27dd4 is an example of what a user-space encoded region name looks like. For example:
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar assigns de00010733901a05f5a2a3a382e27dd4
```
Returns the PID(s) of the created AssignProcedure(s) or -1 if none. If `-i or --inputFiles` is specified, pass one or more input file names. Each file contains encoded region names, one per line. For example:
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar assigns -i fileName1 fileName2
```

**unassigns [OPTIONS] <ENCODED_REGIONNAME>...| -i <INPUT_FILE>...**

**Options:**

`-o,--override` - override ownership by another procedure

`-i,--inputFiles`  - takes ones or more input files of encoded names

A 'raw' unassign that can be used even during Master initialization (if the -skip flag is specified). Skirts Coprocessors. Pass one or more encoded region names. de00010733901a05f5a2a3a382e27dd4 is an example of what a user override space encoded region name looks like. For example:
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar unassign de00010733901a05f5a2a3a382e27dd4 
```
Returns the PID(s) of the created UnassignProcedure(s) or -1 if none. If `-i or --inputFiles` is specified, pass one or more input file names. Each file contains encoded region names, one per line. For example:
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar unassigns fileName1 -i fileName2
```

`bypass [OPTIONS] <PID>...`

**Options:**

`-o,--override` - override if procedure is running/stuck

`-r,--recursive` - bypass parent and its children. SLOW! EXPENSIVE!

`-w,--lockWait` - milliseconds to wait before giving up; default=1

`-i,--inputFiles` - takes one or more input files of PIDs

Pass one (or more) procedure 'PIDs to skip to procedure finish. Parent of bypassed procedure skips to the finish. Entities are left in an inconsistent state and require manual fixup May need Master restart to clear locks still held. Bypass fails if procedure has children. Add 'recursive' if all you have is a parent PID to finish parent and children. ***This is SLOW, and dangerous so use selectively. Doesn't always work***. 
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar bypass <PID>
```
If `-i or --inputFiles` is specified, pass one or more input file names. Each file contains PIDs, one per line. For example:
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar bypass -i fileName1 fileName2
```

**reportMissingRegionsInMeta <NAMESPACE|NAMESPACE:TABLENAME>... | -i <INPUT_FILE>...**

**Options:**

`i,--inputFiles`  takes one or more input files of namespace or table names

To be used when regions missing from `hbase:meta` but directories are present still in HDFS. This command is an only a check method, designed for reporting purposes and doesn't perform any fixes, providing a view of which regions (if any) would get readded to `hbase:meta`, grouped by respective table/namespace. To effectively readd regions in meta, run addFsRegionsMissingInMeta. **This command needs `hbase:meta` to be online**. For each namespace/table passed as parameter, it performs a diff between regions available in `hbase:meta` against existing regions dirs on HDFS. Region dirs with no matches are printed grouped under its related table name. Tables with no missing regions show a 'no missing regions' message. If no namespace or table is specified, it verifies all existing regions. It accepts a combination of multiple namespace and tables. Table names should include the namespace portion, even for tables in the default namespace, otherwise it assumes as a namespace value. An example triggering missing regions report for tables 'table_1' and 'table_2', under default namespace:
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar reportMissingRegionsInMeta default:table_1 default:table_2
```
An example triggering missing regions report for table 'table_1' under default namespace, and for all tables from namespace 'ns1':
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar reportMissingRegionsInMeta default:table_1 ns1
```
Returns list of missing regions for each table passed as parameter, or for each table on namespaces specified as parameter. If `-i or --inputFiles` is specified, pass one or more input file names. Each file contains <NAMESPACE|NAMESPACE:TABLENAME>, one per line. For example:
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar reportMissingRegionsInMeta -i fileName1 fileName2
```

**addFsRegionsMissingInMeta <NAMESPACE|NAMESPACE:TABLENAME>... | -i <INPUT_FILE>...**

**Options**

`-i,--inputFiles`  takes one or more input files of namespace of table names to be used when regions missing from `hbase:meta` but directories are present still in HDFS. **Needs `hbase:meta` to be online**. For each table name passed as parameter, performs diff between regions available in `hbase:meta` and region dirs on HDFS. Then for dirs with no `hbase:meta` matches, it reads the 'regioninfo' metadata file and re-creates given region in `hbase:meta`. Regions are re-created in 'CLOSED' state in the `hbase:meta` table, but not in the Masters' cache, and they aren't assigned either. To get these regions online, run the HBCK2 'assigns' command printed when this command-run completes.

> [!NOTE]
> If using hbase releases older than 2.3.0, a rolling restart of HMasters is needed prior to executing the set of 'assigns' output**. An example adding missing regions for tables 'tbl_1' in the default namespace, 'tbl_2' in namespace 'n1' and for all tables from namespace 'n2':

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar addFsRegionsMissingInMeta default:tbl_1 n1:tbl_2 n2
```
Returns HBCK2  an 'assigns' command with all reinserted regions. If `-i or --inputFiles` is specified, pass one or more input file names. Each file contains <NAMESPACE|NAMESPACE:TABLENAME>, one per line. For example:
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar addFsRegionsMissingInMeta -i fileName1 fileName2
```

**extraRegionsInMeta <NAMESPACE|NAMESPACE:TABLENAME>... | -i <INPUT_FILE>...**

**Options**

`-f, --fix`- fix meta by removing all extra regions found.

`-i,--inputFiles`- take one or more input files of namespace or table names

Reports regions present on `hbase:meta`, but with no related directories on the file system. Needs `hbase:meta` to be online. For each table name passed as parameter, performs diff between regions available in `hbase:meta` and region dirs on the given file system. Extra regions would get deleted from Meta if passed the --fix option.

> [!NOTE]
>  Before deciding on use the "--fix" option, it's worth check if reported extra regions are overlapping with existing valid regions. If so, then `extraRegionsInMeta --fix` is indeed the optimal solution. Otherwise, "assigns" command is the simpler solution, as it recreates regions dirs in the filesystem, if not existing.

An example triggering extra regions report for table 'table_1' under default namespace, and for all tables from namespace 'ns1':
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar extraRegionsInMeta default:table_1 ns1
```
An example triggering extra regions report for table 'table_1' under default namespace, and for all tables from namespace 'ns1' with the fix option:
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar extraRegionsInMeta -f default:table_1 ns1
```
Returns list of extra regions for each table passed as parameter, or for each table on namespaces specified as parameter. If `-i or --inputFiles` is specified, pass one or more input file names. Each file contains <NAMESPACE|NAMESPACE:TABLENAME>, one per line. For example:
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar extraRegionsInMeta -i fileName1 fileName2
```

**fixMeta**

> [!NOTE]
>  This doesn't work well with HBase 2.1.6. Not recommended to be used on a 2.1.6 HBase CLuster.**

Do a server-side fix of bad or inconsistent state in `hbase:meta`. Master UI has matching, new 'HBCK Report' tab that dumps reports generated by most recent run of catalogjanitor and a new 'HBCK Chore'. **It's critical that `hbase:meta` first be made healthy before making any other repairs**. Fixes 'holes', 'overlaps', etc., creating (empty) region directories in HDFS to match regions added to `hbase:meta`. **Command isn't the same as the old _hbck1_ command named similarly**. Works against the reports generated by the last catalog_janitor and hbck chore runs. If nothing to fix, run is a loop. Otherwise, if 'HBCK Report' UI reports problems, a run of fixMeta clears up`hbase:meta` issues. 
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar fixMeta
```

**generateMissingTableDescriptorFile <NAMESPACE:TABLENAME>**

Trying to fix an orphan table by generating a missing table descriptor file. This command has no effect if the table folder is missing or if the `.tableinfo` is present (we don't override existing table descriptors). This command first checks if the TableDescriptor is cached in HBase Master in which case it recovers the `.tableinfo` accordingly. If TableDescriptor isn't cached in master, then it creates a default `.tableinfo` file with the following items:
- the table name
- the column family list determined based on the file system
- the default properties for both TableDescriptor and `ColumnFamilyDescriptors`
If the `.tableinfo` file was generated using default parameters then make sure you check the table / column family properties later (and change them if needed). This method doesn't change anything in HBase, only writes the new `.tableinfo` file to the file system. Orphan tables, for example, ServerCrashProcedures to stick, you might need to fix the error still after you generated the missing table info files.
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar generateMissingTableDescriptorFile namespace:table_name
```

**replication [OPTIONS] [<NAMESPACE:TABLENAME>... | -i <INPUT_FILE>...]**

**Options**

`-f, --fix` - fix any replication issues found.

`-i,--inputFiles` - take one or more input files of table names

Looks for undeleted replication queues and deletes them if passed the '--fix' option. Pass a table name to check for replication barrier and purge if '--fix'. 
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar replication namespace:table_name
```
If `-i or --inputFiles` is specified, pass one or more input file names. Each file contains `<TABLENAME>`, one per line. For example:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar replication -i fileName1 fileName2
```

`setRegionState [<ENCODED_REGIONNAME> <STATE> | -i <INPUT_FILE>...]`

**Options**

`-i,--inputFiles`  take one or more input files of encoded region names and states
  
**Possible region states:**

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
> This is a very risky option intended for use as last resort.

Example scenarios include unassigns/assigns that can't move forward because region is in an inconsistent state in 'hbase:meta'. For example, the 'unassigns' command can only proceed if passed a region in one of the following states: **SPLITTING|SPLIT|MERGING|OPEN|CLOSING**.

 Before manually setting a region state with this command, certify that this region not handled by a running procedure, such as 'assign' or 'split'. You can get a view of running procedures in the hbase shell using the 'list_procedures' command. An example
setting region 'de00010733901a05f5a2a3a382e27dd4' to CLOSING:

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar setRegionState de00010733901a05f5a2a3a382e27dd4 CLOSING
```
Returns "0" if region state changed and "1" otherwise.
If `-i or --inputFiles` is specified, pass one or more input file names.
Each file contains `<ENCODED_REGIONNAME> <STATE>` one pair per line.
For example,
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar setRegionState -i fileName1 fileName2
```

`setTableState [<TABLENAME> <STATE> | -i <INPUT_FILE>...]`

**Options**

`-i,--inputFiles`  take one or more input files of table names and states

Possible table states: **ENABLED, DISABLED, DISABLING, ENABLING**.

To read current table state, in the hbase shell run:
  
```
hbase> get 'hbase:meta', '<TABLENAME>', 'table:state'
```
A value of x08x00 == ENABLED, x08x01 == DISABLED, etc.
Can also run a 'describe `<TABLENAME>` at the shell prompt. An example making table name 'user` ENABLED:
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar setTableState users ENABLED
```
Returns whatever the previous table state was. If `-i or --inputFiles` is specified, pass one or more input file names. Each file contains `<TABLENAME> <STATE>`, one pair per line.
For example:
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar setTableState -i fileName1 fileName2
```

`scheduleRecoveries <SERVERNAME>... | -i <INPUT_FILE>...`

**Options**

-i,--inputFiles`  take one or more input files of server names

Schedule `ServerCrashProcedure(SCP)` for list of `RegionServers`. Format server name as '<HOSTNAME>,<PORT>,<STARTCODE>' (See HBase UI/logs).
Example using RegionServer 'a.example.org, 29100,1540348649479':

```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar scheduleRecoveries a.example.org,29100,1540348649479
```
Returns the PID(s) of the created ServerCrashProcedure(s) or -1 if no procedure created (see master logs for why not).
Command support added in hbase versions 2.0.3, 2.1.2, 2.2.0 or newer. If `-i or --inputFiles` is specified, pass one or more input file names. Each file contains `<SERVERNAME>`, one per line. For example:
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar scheduleRecoveries -i fileName1 fileName2 

```
## **Fixing Problems** 

### **Some General Principals** 
When making repair, **make sure `hbase:meta` is consistent first before you go about fixing any other issue type** such as a filesystem deviance. Deviance in the filesystem or problems with assign should be addressed after the `hbase:meta` has been put in order. If `hbase:meta` has issues, the Master can't make proper placements when adopting orphan filesystem data or making region assignments.

Other general principals to keep in mind include a Region can't be assigned if it's in CLOSING state (or the inverse, unassigned if in OPENING state) without first transitioning via CLOSED: Regions must always move from CLOSED, to OPENING, to OPEN, and then to CLOSING, CLOSED.

When making repair, do fixup of a table-at-a-time.

If a table is DISABLED, you cant' assign a Region. In the Master logs, you see that the Master reports skipped because the table is DISABLED. You can assign a Region because, currently in the OPENING state and you want it in the CLOSED state so it agrees with the table's DISABLED state. In this situation, you may have to temporarily set the table status to ENABLED, so you can do the assign, and then set it back again after the unassign statement. HBCK2 has facility to allow you to do this change. See the HBCK2 usage output.

### **Assigning/Unassigning** 
  
Generally, on assign, the Master persists until successful. An assign takes an exclusive lock on the Region. This precludes a concurrent assign or unassign from running. An assign against a locked Region waits until the lock is released before making progress. See the [Procedures & Locks] section for current list of outstanding Locks.

**Master startup cannot progress, in holding-pattern until region online**

```
2018-10-01 22:07:42,792 WARN org.apache.hadoop.hbase.master.HMaster: `hbase:meta`,,1.1588230740 isn't online; state={1588230740 state=CLOSING, ts=1538456302300, server=ve1017.example.org,22101,1538449648131}; ServerCrashProcedures=true. Master startup cannot progress, in holding-pattern until region online.
```
The Master is unable to continue startup because there's no Procedure to assign `hbase:meta` (or `hbase:namespace`). To inject one, use the HBCK2 tool:
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar assigns -skip 1588230740
```
where **1588230740 is the encoded name of the `hbase:meta` Region**. Pass the '-skip' option to stop HBCK2 doing a version check against the remote master. If the remote master isn't up, the version check prompts a 'Master is initializing response', or 'PleaseHoldException' and drop the assign attempt. The '-skip' command avoid the version check and lands the scheduled assign.

The same may happen to the `hbase:namespace` system table. Look for the encoded Region name of the `hbase:namespace` Region and do similar to what we did for `hbase:meta`. In this latter case, the Master actually prints a helpful message that looks like

```
2019-07-09 22:08:38,966 WARN  [master/localhost:16000:becomeActiveMaster] master.HMaster: hbase:namespace,,1562733904278.9559cf72b8e81e1291c626a8e781a6ae. isn't online; state={9559cf72b8e81e1291c626a8e781a6ae state=CLOSED, ts=1562735318897, server=null}; ServerCrashProcedures=true. Master startup cannot progress, in holding-pattern until region onlined.
```
To schedule an assign for the `hbase:namespace` table noted in the above log line, you would do:
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar -skip assigns 9559cf72b8e81e1291c626a8e781a6ae
```
passing the encoded name for the namespace region (the encoded name differs per deploy).

### Missing Regions in `hbase:meta` region/table restore/rebuild
There have been some unusual cases where table regions have been removed from `hbase:meta` table. Some triage on such cases revealed these were operator-induced. Users would have run the obsolete hbck1 OfflineMetaRepair tool against an HBCK2 cluster. OfflineMetaRepair is a well known tool for fixing `hbase:meta` table related issues on HBase 1.x versions. The original version isn't compatible with HBase 2.x or higher versions, and it has undergone some adjustments so in the extreme, it can now be run via HBCK2.

In most of these cases, regions end up missing in `hbase:meta` at random, but hbase may still be operational. In such situations, problem can be addressed with the Master online, using the addFsRegionsMissingInMeta command in HBCK2. This command is less disruptive to hbase than a full `hbase:meta` rebuild covered later, and it can be used even for recovering the namespace table region.

### Extra Regions in `hbase:meta` region/table restore/rebuild
There can also be situations where table regions have been removed in file system, but still have related entries on `hbase:meta` table. This may happen due to problems on splitting, manual operation mistakes (like deleting/moving the region dir manually), or even meta info data loss issues such as HBASE-21843.

Such problem can be addressed with the Master online, using the **extraRegionsInMeta `--fix**` command in HBCK2. This command is less disruptive to hbase than a full `hbase:meta` rebuild covered later. Also useful when this happens on versions that don't support fixMeta hbck2 option (any prior to "2.0.6", "2.1.6", "2.2.1", "2.3.0","3.0.0").
  
### Online `hbase:meta` rebuild recipe
If `hbase:meta` corruption isn't too critical, hbase would still be able to bring it online. Even if namespace region is among the missing regions, it's possible to scan `hbase:meta` during the initialization period, where Master is waiting for namespace to be assigned. To verify this situation, a` hbase:meta` scan command can be executed. If it doesn't time out or shows any errors, the `hbase:meta` is online:
```
echo "scan 'hbase:meta', {COLUMN=>'info:regioninfo'}" | hbase shell
```
HBCK2 **addFsRegionsMissingInMeta** can be used if the message doesn't show any errors. It reads region metadata info available on the FS region directories in order to recreate regions in `hbase:meta`. Since it can run with hbase partially operational, it attempts to disable online tables that are affected the reported problem and it's going to readd regions to `hbase:meta`. It can check for specific tables/namespaces, or all tables from all namespaces. An example shows adding missing regions for tables 'tbl_1' in the default namespace, 'tbl_2' in namespace 'n1', and for all tables from namespace 'n2':
```
hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar addFsRegionsMissingInMeta default:tbl_1 n1:tbl_2 n2
```
As it operates independently from Master, once it finishes successfully, more steps are required to actually have the readded regions assigned. These messages are listed as

**addFsRegionsMissingInMeta** outputs an assigns command with all regions that got readded. This command needs to be executed later, so copy and save it for convenience.

**For HBase versions prior to 2.3.0, after addFsRegionsMissingInMeta finished successfully and output has been saved, restart all running HBase Masters.**

Once Master's are restarted and `hbase:meta` is already online (check if Web UI is accessible), run assigns command from addFsRegionsMissingInMeta output saved earlier.

> [!NOTE]
> If namespace region is among the missing regions, you will need to add --skip flag at the beginning of assigns command returned.

Should a cluster suffer a catastrophic loss of the `hbase:meta` table, a rough rebuild is possible using the following recipe. In outline, we stop the cluster. Run the HBCK2 OfflineMetaRepair tool, which reads directories and metadata dropped into the filesystem makes the best effort at reconstructing a viable `hbase:met` table; restart your cluster. Inject an assign to bring the system namespace table online; and then finally, reassign user space tables you'd like enabled (the rebuilt `hbase:meta` creates a table with all tables offline and no regions assigned).

### Detailed rebuild recipe

> [!NOTE]
> Use it only as a last resort. Not recommended.

* Stop the cluster.

* Run the rebuild `hbase:meta` command from HBCK2. This moves aside the original `hbase:meta` and puts in place a newly rebuilt one. As an example of how to run the tool. It adds the -details flag so the tool dumps info on the regions its found in hdfs:
     ```
     hbase --config /etc/hbase/conf -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar org.apache.hbase.hbck1.OfflineMetaRepair -details
     ```
* Start up the cluster. It won't up fully. It's stuck because the namespace table isn't online and there's no assign procedure in the procedure store for this contingency. The hbase master log shows this state. Here's an example of what it logs:
     ```
     2019-07-10 18:30:51,090 WARN  [master/localhost:16000:becomeActiveMaster] master.HMaster: hbase:namespace,,1562808216225.725a0fe6c2c869d3d0a9ed82bfa80fa3. isn't online; state={725a0fe6c2c869d3d0a9ed82bfa80fa3 state=CLOSED, ts=1562808619952, server=null}; ServerCrashProcedures=false. Master startup can't progress, in holding-pattern until region onlined.
     ```
     To assign the namespace table region, you can't use the shell. If you use the shell, it fails with a PleaseHoldException because the master isn't yet up (it's waiting for the namespace table to come online before it declares itself ‘up’). You have to use the HBCK2 assigns command. To assign, you need the namespace encoded name. It shows in the log quoted. That is, 725a0fe6c2c869d3d0a9ed82bfa80fa3 in this case. You have to pass the -skip command to ‘skip’ the master version check (without it, your HBCK2 invocation elicits the PleaseHoldException because the master isn't yet up). Here's an example adding an assign of the namespace table:
     ```
     hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar -skip assigns 725a0fe6c2c869d3d0a9ed82bfa80fa3
     ```
     If the invocation comes back with ‘Connection refused’, is the Master up? The Master will shut down after a while if it can’t initialize itself. Just restart the cluster/master and rerun the assigns command.

* When the assigns run successfully, you see it emit the likes of the following. The ‘48’ on the end is the PID of the assign procedure schedule. If the PID returned is ‘-1’, then the master startup hasn't progressed sufficently… retry. Or, the encoded regionname is incorrect. Check.
     ```
     hbase --config /etc/hbase/conf hbck -j ~/hbase-operator-tools/hbase-hbck2/target/hbase-hbck2-1.x.x-SNAPSHOT.jar -skip assigns 725a0fe6c2c869d3d0a9ed82bfa80fa3
     ```
     ```
     18:40:43.817 [main] WARN  org.apache.hadoop.util.NativeCodeLoader - Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
     18:40:44.315 [main] INFO  org.apache.hbase.HBCK2 - hbck sufpport check skipped
     [48]
     ```
* Check the master logs. The master should have come up. You see successful completion of PID=48. Look for a line like this to verify successful master launch:
     ```
     master.HMaster: Master has completed initialization 132.515sec
     ```
     It might take a while to appear.

     The rebuild of `hbase:meta` adds the user tables in DISABLED state and the regions in CLOSED mode. Re-enable tables via the shell to bring all table regions back online. Do it one-at-a-time or see the enable all ".*" command to enable all tables in one shot.

     The rebuild meta is missing edits and may need subsequent repair and cleaning using facility outlined higher up in this TSG.

### Dropped reference files, missing hbase.version file, and corrupted files

HBCK2 can check for hanging references and corrupt files. You can ask it to sideline bad files, which may be needed to get over humps where regions won't online or reads are failing. See the filesystem command in the HBCK2 listing. Pass one or more tablename (or 'none' to check all tables). It reports bad files. Pass the `--fix` option to effect repairs.

### Procedure Start-over

At an extreme, as a last resource, if the Master is distraught and all attempts at fixup only turn up undoable locks or Procedures that can't finish, and/or the set of MasterProcWALs is growing without bound. It's possible to wipe the Master state clean. Just move aside the `/hbase/MasterProcWALs/` directory under your HBase install and restart the Master process. It comes back as a tabular format  without memory.

If at the time of the erasure, all Regions were happily assigned or off lined, then on Master restart, the Master should pick up and continue as though nothing happened. But if there were Regions-In-Transition at the time, then the operator has to intervene to bring outstanding assigns/unassigns to their terminal point. Read the `hbase:meta` `info:state` columns as described to figure what needs assigning/unassigning. Having erased all history moving aside the MasterProcWALs, none of the entities should be locked so you 'Improved free to bulk assign/unassign.
