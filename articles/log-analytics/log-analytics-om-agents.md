<properties
	pageTitle="Operations Manager agents | Microsoft Azure"
	description="To maintain your existing investment in System Center Operations Manager and use extended capabilities with Log Analytics, you can integrate Operations Manager with your OMS workspace."
	services="log-analytics"
	documentationCenter=""
	authors="bandersmsft"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="log-analytics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/19/2016"
	ms.author="banders"/>

# Operations Manager agents

To maintain your existing investment in System Center Operations Manager and use extended capabilities with Log Analytics, you can integrate Operations Manager with your OMS workspace.  This allows you leverage the opportunities of OMS while continuing to use Operations Manager to:

- Continue monitoring the health of your IT services with Operations Manager
- Maintain integration with your ITSM solutions supporting incident and problem management
- Manage the lifecycle of agents deployed to on-premise and public cloud IaaS virtual machines that you monitor with Operations Manager

Integrating with System Center Operations Manager adds value to your service operations strategy by leveraging the speed and efficiency of OMS in collecting, storing and analyzing data from Operations Manager.  OMS helps correlate and work towards identifying the faults of problems and surfacing reoccurrences in support of your existing problem management process.   The flexibility of the search engine to examine performance, event and alert data, with rich dashboards and reporting capabilities to expose this data in meaningful ways, demonstrates the strength OMS brings in complimenting Operations Manager.

The agents reporting to the Operations Manager management group collect data from your servers based on the Log Analytics data sources and solutions you have enabled in your OMS subscription.  Depending on the solution you have enabled, data from these solutions are either sent directly from an Operations Manager management server to the OMS web service, or because of the volume of data collected on the agent-managed system, are sent directly from the agent to OMS web service.  The management server directly forwards the OMS data to the OMS web service, it is never written to the OperationsManager or OperationsManagerDW database.  When a management server loses connectivity with the OMS web service, it caches the data locally until communication is re-established with OMS.  If the management server is offline due to planned maintenance or unplanned outage, another management server in the management group will resume connectivity with OMS.  

The following diagram shows the System Center Operations Manager and OMS relationship.

![oms-operations-manager-integration-diagram](./media/log-analytics-om-agents/oms-operations-manager-connection.png)

## System requirements
Before starting, please review the following details to verify you meet necessary prerequisites.

- OMS only supports Operations Manager 2012 SP1 UR6 and greater, and Operations Manager 2012 R2 UR2 and greater.  Proxy support was added in Operations Manager 2012 SP1 UR7 and Operations Manager 2012 R2 UR3.
- An OMS subscription.  For further information, please review [First Look: Get started with Log Analytics](log-analytics-get-started.md).

## Connecting Operations Manager to OMS
Perform the following series of steps to configure your Operations Manager management group to connect to one of your OMS workspaces.
1. In the Operations Manager console, select the **Administration** workspace.
2. Expand the Operations Management Suite node and click **Connection**.
3. Click the **Register to Operations Management Suite** link.
4. On the **Operations Management Suite Onboarding Wizard: Authentication** page, enter the email address or phone number and password of the administrator account that is associated with your OMS subscription, and click **Sign in**.
5. After you are successfully authenticated, on the **Operations Management Suite Onboarding Wizard: Select Workspace** page, you will be prompted to select your OMS workspace.  If you have more than one workspace, select the workspace you want to register with the Operations Manager management group from the drop-down list, and then click **Next**.

>[AZURE.NOTE]Operations Manager only supports one OMS workspace at a time. The connection and the computers that were registered to OMS with the previous workspace are removed from OMS.

6. On the **Operations Manager Suite Onboarding Wizard: Summary** page, confirm your settings and if they are correct, click **Create**.
7. On the **Operations Management Suite Onboarding Wizard: Finish** page, click **Close**.

### Add agent-managed computers
After configuring integration with your OMS workspace, this only establishes a connection with OMS, no data is collected from the agents reporting to your management group.  This won’t happen until after you configure which specific agent-managed computers will collect data for Log Analytics.  You can either select the computer objects individually or you can select a group which contains Windows computer objects.  You cannot select a group which contains instances of another class, such as logical disks or SQL databases.

1. Open the Operations Manager console and select the **Administration** workspace.
2. Expand the Operations Management Suite node and click **Connection**.
3. Click the **Add a Computer/Group** link under the Actions heading on the right-side of the pane.
4. In the **Computer Search** dialog box you can search for computers or groups monitored by Operations Manager. Select computers or groups to onboard to OMS, click **Add**, and then click **OK**.

You can view computers and groups configured to collect data from the Managed Computers node under Operations Management Suite in the **Administration** workspace of the Operations console.  From here you can add or remove computers and groups as necessary.

### Configure OMS proxy settings in the Operations console
Perform the following steps if an internal proxy server is between the management group and OMS web service.  These settings are centrally managed from the management group and distributed to agent-managed systems that are included in the scope to collect data for OMS.  This is beneficial for when certain solutions bypass the management server and send data directly to OMS web service.

1. Open the Operations Manager console and select the **Administration** workspace.
2. Expand Operations Management Suite, and then click **Connections**.
3. In the OMS Connection view, click **Configure Proxy Server**.
4. On **Operations Management Suite Wizard: Proxy Server** page, select **Use a proxy server to access the Operations Management Suite**, and then type the URL with the port number, for example, http://corpproxy:80 and then click **Finish**.

If your proxy server requires authentication, perform the following steps to configure credentials and settings that need to propagate to managed computers that will report to OMS in the management group.

1. Open the Operations Manager console and select the **Administration** workspace.
2. Under **RunAs Configuration**, select **Profiles**.
3. Open the **System Center Advisor Run As Profile Proxy** profile.
4. In the Run As Profile Wizard, click Add to use a Run As account. You can create a new [Run As account](https://technet.microsoft.com/library/hh321655.aspx) or use an existing account. This account needs to have sufficient permissions to pass through the proxy server.
5. To set the account to manage, choose **A selected class, group, or object**, click **Select…** and then click **Group…** to open the **Group Search** box.
6. Search for and then select **Microsoft System Center Advisor Monitoring Server Group**.  Click **OK** after selecting the group to close the **Group Search** box.
7.	Click **OK** to close the **Add a Run As account** box.
8.	Click **Save** to complete the wizard and save your changes.

After the connection is created and you configure which agents will be collecting and reporting data to OMS, the following configuration is applied in the management group, not necessarily in order:

- The Run As Account **Microsoft.SystemCenter.Advisor.RunAsAccount.Certificate** is created.  It is associated with the Run As profile **Microsoft System Center Advisor Run As Profile Blob** and is targeting two classes - **Collection Server** and **Operations Manager Management Group**.
- Two connectors are created.  The first is named **Microsoft.SystemCenter.Advisor.DataConnector** and is automatically configured with a subscription that will forward all alerts generated from instances of all classes in the management group to OMS Log Analytics. The second connector is **Advisor Connector**, which is responsible for communicating with OMS web service and sharing data.
- Agents and groups that you have selected to collect data in the management group will be added to the **Microsoft System Center Advisor Monitoring Server Group**.

## Management pack updates
After configuration is completed, the Operations Manager management group establishes a connection with the OMS service.  The management server will synchronize with the web service and receive updated configuration information in the form of management packs for the solutions you have enabled that integrate with Operations Manager.   Operations Manager will check for updates to these management packs automatically download and import them when they’re available.  There are two rules in particular which control this behavior:

- **Microsoft.SystemCenter.Advisor.MPUpdate** - Updates the base OMS management packs. Runs every twelve (12) hours by default.
- **Microsoft.SystemCenter.Advisor.Core.GetIntelligencePacksRule** - Updates solution management packs enabled in your workspace. Runs every five (5) minutes by default.

You can override these two rules to either prevent automatic download by disabling them, or modify the frequency for how often the management server synchronizes with OMS to determine if a new management pack is available and should be downloaded.  Follow the steps [How to Override a Rule or Monitor]( https://technet.microsoft.com/library/hh212869.aspx) to modify the **Frequency** parameter with a value in seconds to change the synchronization schedule, or modify the **Enabled** parameter to disable the rules.  Target the overrides to all objects of class Operations Manager Management Group.

If you want to continue following your existing change control process for controlling management pack releases in your production management group, you can disable the rules and enable them during specific times when updates are allowed. If you have a development or QA management group in your environment and it has connectivity to the Internet, you can configure that management group with an OMS workspace to support this scenario.  This will allow you to review and evaluate the iterative releases of the OMS management packs before releasing them into your production management group.

## Validate Operations Manager integration with OMS
There are a few different ways you can verify that your OMS to Operations Manager integration is successful.

### To confirm integration from the OMS portal

1.	In the OMS portal, click on the **Settings** tile
2.	On the top menu, click **Connected Sources**.
3.	Under the System Center Operations Manager section, you should see the status **1 MGMT Group Connected** and in the table below it, the name of the management group listed with the number of agents and status when data was last received.

### To confirm integration from the Operations console

1.	Open the Operations Manager console and select the **Administration** workspace.
2.	Click on the **Management Packs** node and in the **Look for:** text box, type **Advisor** or **Intelligence**.
3.	Depending on the solutions you have enabled, you will see a corresponding management pack listed in the search results.  For example, if you have enabled the Alert Management solution, the management pack Microsoft System Center Advisor Alert Management will be in the list.

## Next steps
- Connect [data sources](log-analytics-data-sources.md)
