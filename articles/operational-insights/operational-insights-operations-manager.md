<properties
   pageTitle="Operations Manager considerations with Operational Insights"
   description="If you use Microsoft Azure Operational Insights with Operations Manager, then your configuration relies on a distribution of Operations Manager agents and management groups to collect and send data to the Operational Insights service for analysis"
   services="operational-insights"
   documentationCenter=""
   authors="bandersmsft"
   manager="jwhit"
   editor="tysonn" />
<tags
   ms.service="operational-insights"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/02/2015"
   ms.author="banders" />

# Operations Manager considerations with Operational Insights

[AZURE.INCLUDE [operational-insights-note-moms](../../includes/operational-insights-note-moms.md)]

If you use Microsoft Azure Operational Insights with Operations Manager, then your configuration relies on a distribution of Operations Manager agents and management groups  to collect and send data to the Operational Insights service for analysis. However, if you use agents that connect directly to the web service, then you do not need Operations Manager. Consider the following issues when your use Operational Insights with Operations Manager.

Also, you'll need to specify the Run-As credentials for the workloads monitored my Operations Manager to Operational Insights.

## Operational Insights software functions and requirements

Operational Insights consists of a web service in the cloud, and either agents that connect directly to the web service or Operations Manager agents and Operations Manager management groups that are managing computers in your environment.

Before you select Operations Manager agents (to collect data) and management groups (to manage agents and send data to the Operational Insights service), ensure that you understand the following:

- The Operations Manager agent is installed on any server from which you want to collect and analyze data.

- The Operations Manager management group transfers data from agents to the Operational Insights web service. It does not analyze any of the data.

- The Operations Manager management group must have access to the Internet to upload data to the web service.

- For the best results, do not install the Operations Manager management server on a computer that is also a domain controller.

- An Operations Manager agent must have network connectivity to the Operations Manager management group so it can transfer data.

Operational Insights can use the System Center Health Service to collect and analyze data. Operations Manager depends on the System Center Health Service. When you view the programs that are installed on your server, you will see System Center Operations Manager agent software, particularly in Add/Remove Programs. Do not remove these because Operational Insights is dependent on them. If you remove the Operations Manager agent software, Operational Insights will no longer function.

## Coexistence with Operations Manager

When using Operations Manager, Operational Insights is only supported with the Operations Manager agent in System Center Operations Manager 2012 R2 or System Center Operations Manager 2012 SP1. It is not supported with previous versions of System Center Operations Manager. Because the Operations Manager agent is used to collect data, it uses specific credentials (action accounts or Run As accounts) to support some of the analyzed workloads, such as SharePoint 2012.

## Operational Insights and SQL Server 2012

When using Operations Manager, the System Center Health Service runs under the Local System account. In SQL Server versions earlier than SQL Server 2008 R2, the Local System account was enabled by default and was a member of the system administrator server role. In SQL Server 2012, the Local System login is not part of the system administrator server role. As a result, when you use Operational Insights, it cannot monitor the SQL Server 2012 instance completely, and not all rules can generate alerts.

## Internet and internal network connectivity

When using agents that connect directly with the web service, the agents need to access the Internet to send data to the web service and to receive updated configuration information from the web service.

When using Operations Manager, management server needs to access the Internet to send data to the web service and to receive updated configuration information from the web service. However, your agents do not need to access the Internet. If you have Operations Manager agents on servers that are not connected to the Internet, you can use the web service if they can communicate with an Internet-connected management server.

## Clustering support

The Operations Manager agent is supported on computers running Windows Server 2012, Windows Server 2008 R2, or Windows Server 2008 that is configured to be part of a Windows failover cluster. You can view the clusters in the Operational Insights portal. On the Servers page, clusters are identified as TYPE=CLUSTER (as opposed to TYPE=AGENT, which is how physical computers are identified).

The discovery and configuration rules run on the active and passive nodes of the cluster, but any alerts generated on the passive nodes are ignored. If a node shifts from passive to active, alerts for that node are displayed automatically, with no intervention required from you.

Some alerts might be generated twice, depending on the rule that generates the alert. For example, a rule that detects a bad driver by examining the operating system generates alerts for the physical server and for the cluster.

Configuration analysis of passive nodes is not supported.

Operational Insights does not support grouping or linking computers running Windows Server that are part of the same failover cluster.

## Scaling your Operational Insights environment

When you plan your Operational Insights deployment (particularly when you analyze the number of Operations Manager agents that you want to transfer data through a single management group), consider the capacity of that server in terms of file space.

Consider the following variables:

- Number of agents per management group

- The average size of the data transferred from the agent to the management group per day. By default, each agent uploads CAB files to the management group twice per day. The size of the CAB files depends on the configuration of the server (such as number of SQL Server engines and number databases) and the health of the server (such as the number of alerts generated). In most cases, the daily upload size is typically less than 100 KB.

- Archival period for keeping data in the management group (the default is 5 days)

As an example, if you assume a daily upload size of 100 KB per agent and the default archival period, you would need the following storage for the management group:

Number of agents|Estimated space required for the management group
---|---
5|~2.5 MB (5 agents x 100 KB data/day x 5 days = 2,500 KB)
50|~25 MB (50 agents x 100 KB data/day x 5 days = 25,000 KB)

## Operations Manager run-as accounts for Operational Insights

Operational Insights uses the Operations Manager agent and management group to collect and send data to the Operational Insights service. Operational Insights builds upon management packs for workloads to provide value-add services. Each workload requires workload-specific privileges to run management packs in a different security context, such as a domain account. You need to provide credential information by configuring an Operations Manager Run As account.

The following sections describe how to set Operations Manager run-as accounts for the following workloads:

- SQL Assessment
- Virtual Machine Manager
- Lync Server
- SharePoint

### Set the Run As account for SQL assessment

 If you are already using the SQL Server management pack, you should use that Run As account.

#### To configure the SQL Run As account in the Operations console

1. In Operations Manager, open the Operations console, and then click **Administration**.

2. Under **Run As Configuration**, click **Profiles**, and open **Operational Insights SQL Assessment Run As Profile**.

3. On the **Run As Accounts** page, click **Add**.

4. Select a Windows Run As account that contains the credentials needed for SQL Server, or click **New** to create one.
	>[AZURE.NOTE] The Run As account type must be Windows. The Run As account must also be part of Local Administrators group on all Windows Servers hosting SQL Server Instances.

5. Click **Save**.

6. Modify and then execute the following T-SQL sample on each SQL Server Instance to grant minimum permissions required to Run As Account to perform SQL Assessment. However, you don’t need to do this if a Run As Account is already part of the sysadmin server role on SQL Server Instances.

```
---
    -- Replace <UserName> with the actual user name being used as Run As Account.
    USE master

    -- Create login for the user, comment this line if login is already created.
    CREATE LOGIN [<UserName>] FROM WINDOWS

    -- Grant permissions to user.
    GRANT VIEW SERVER STATE TO [<UserName>]
    GRANT VIEW ANY DEFINITION TO [<UserName>]
    GRANT VIEW ANY DATABASE TO [<UserName>]

    -- Add database user for all the databases on SQL Server Instance, this is required for connecting to individual databases.
    -- NOTE: This command must be run anytime new databases are added to SQL Server instances.
    EXEC sp_msforeachdb N'USE [?]; CREATE USER [<UserName>] FOR LOGIN [<UserName>];'

```
#### To configure the SQL Run As account using Windows PowerShell

Open a PowerShell window and run the following script after you’ve updated it with your information:

```

    import-module OperationsManager
    New-SCOMManagementGroupConnection "<your management group name>"
     
    $profile = Get-SCOMRunAsProfile -DisplayName "Operational Insights SQL Assessment Run As Profile"
    $account = Get-SCOMrunAsAccount | Where-Object {$_.Name -eq "<your run as account name>"}
    Set-SCOMRunAsProfile -Action "Add" -Profile $Profile -Account $Account
```


### Set the Run As account for Virtual Machine Manager

Ensure that the Run As account has privileges for the following actions:

- To use the VMM Windows PowerShell module

- To query the VMM database

- To remotely administer the VMM agents running on virtualization hosts

Use the following steps to set the account when you connect Operational Insights to Operations Manager.

#### To set credentials for VMM

1. In Operations Manager, open the Operations console, and then click **Administration**.

2. Under **Run As Configuration**, click **Profiles**, and open **Operational Insights VMM Run As Account**.

3. On the **Run As Accounts** page, click **Add**.

4. Select a Windows Run As account that contains the credentials needed for VMM, or click **New** to create one.
	>[AZURE.NOTE] The Run As account type must be Windows.

5. Click **Save**.


### Set the Run As account for Lync Server

 The Run As account needs to be a member of both the local Administrators and the Lync RTCUniversalUserAdmins security groups.

#### To set credentials for a Lync account

1. In Operations Manager, open the Operations console, and then click **Administration**.

2. Under **Run As Configuration**, click **Profiles**, and open **Operational Insights Lync Run As Account**.

3. On the **Run As Accounts** page, click **Add**.

4. Select a Windows Run As account that is a member of both the Local Administrators and the Lync RTCUniversalUserAdmins security groups.
	>[AZURE.NOTE] The Run As account type must be Windows.

5. Click **Save**.


### Set the Run As account for SharePoint


#### To set credentials for a SharePoint account

1. In Operations Manager, open the Operations console, and then click **Administration**.

2. Under **Run As Configuration**, click **Profiles**, and open **Operational Insights SharePoint Run As Account**.

3. On the **Run As Accounts** page, click **Add**.

4. Select a Windows Run As account that contains the credentials needed for SharePoint, or click **New** to create one.
	>[AZURE.NOTE] The Run As account type must be Windows.

5. Click **Save**.



## Geographic locations

If you want to analyze data from servers in diverse geographic locations, consider having one management group per location. This can improve the performance of data transfer from the agent to the management group.
