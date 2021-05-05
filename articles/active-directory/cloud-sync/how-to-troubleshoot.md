---
title: Azure AD Connect cloud sync troubleshooting
description: This article describes how to troubleshoot problems that might arise with the cloud provisioning agent.
author: billmath
ms.author: billmath
manager: daveba
ms.date: 01/19/2021
ms.topic: how-to
ms.prod: windows-server-threshold
ms.technology: identity-adfs
---

# Cloud sync troubleshooting

Cloud sync touches many different things and has many different dependencies. This broad scope can give rise to various problems. This article helps you troubleshoot these problems. It introduces the typical areas for you to focus on, how to gather additional information, and the various techniques you can use to track down problems.


## Common troubleshooting areas

|Name|Description|
|-----|-----|
|[Agent problems](#agent-problems)|Verify that the agent was installed correctly and that it communicates with Azure Active Directory (Azure AD).|
|[Object synchronization problems](#object-synchronization-problems)|Use provisioning logs to troubleshoot object synchronization problems.|
|[Provisioning quarantined problems](#provisioning-quarantined-problems)|Understand provisioning quarantine problems and how to fix them.|


## Agent problems
Some of the first things that you want to verify with the agent are:

-  Is it installed?
-  Is the agent running locally?
-  Is the agent in the portal?
-  Is the agent marked as healthy?

These items can be verified in the Azure portal and on the local server that's running the agent.

### Azure portal agent verification

To verify that the agent is seen by Azure and is healthy, follow these steps.

1. Sign in to the Azure portal.
1. On the left, select **Azure Active Directory** > **Azure AD Connect**. In the center, select **Manage sync**.
1. On the **Azure AD Connect cloud sync** screen, select **Review all agents**.

   ![Review all agents](media/how-to-install/install-7.png)</br>
 
1. On the **On-premises provisioning agents** screen, you see the agents you've installed. Verify that the agent in question is there and is marked *Healthy*.

   ![On-premises provisioning agents screen](media/how-to-install/install-8.png)</br>

### Verify the port

Verify that Azure is listening on port 443 and that your agent can communicate with it. 

This test verifies that your agents can communicate with Azure over port 443. Open a browser, and go to the previous URL from the server where the agent is installed.

![Verification of port reachability](media/how-to-install/verify-2.png)

### On the local server

To verify that the agent is running, follow these steps.

1. On the server with the agent installed, open **Services** by either navigating to it or by going to **Start** > **Run** > **Services.msc**.
1. Under **Services**, make sure **Microsoft Azure AD Connect Agent Updater** and **Microsoft Azure AD Connect Provisioning Agent** are there and their status is *Running*.

   ![Services screen](media/how-to-troubleshoot/troubleshoot-1.png)

### Common agent installation problems

The following sections describe some common agent installation problems and typical resolutions.

#### Agent failed to start

You might receive an error message that states:

**Service 'Microsoft Azure AD Connect Provisioning Agent' failed to start. Verify that you have sufficient privileges to start the system services.** 

This problem is typically caused by a group policy that prevented permissions from being applied to the local NT Service log-on account created by the installer (NT SERVICE\AADConnectProvisioningAgent). These permissions are required to start the service.

To resolve this problem, follow these steps.

1. Sign in to the server with an administrator account.
1. Open **Services** by either navigating to it or by going to **Start** > **Run** > **Services.msc**.
1. Under **Services**, double-click **Microsoft Azure AD Connect Provisioning Agent**.
1. On the **Log On** tab, change **This account** to a domain admin. Then restart the service. 

   ![Log On tab](media/how-to-troubleshoot/troubleshoot-3.png)

#### Agent times out or certificate is invalid

You might get the following error message when you attempt to register the agent.

![Time-out error message](media/how-to-troubleshoot/troubleshoot-4.png)

This problem is usually caused by the agent being unable to connect to the Hybrid Identity Service and requires you to configure an HTTP proxy. To resolve this problem, configure an outbound proxy. 

The provisioning agent supports use of an outbound proxy. You can configure it by editing the agent config file *C:\Program Files\Microsoft Azure AD Connect Provisioning Agent\AADConnectProvisioningAgent.exe.config*.
Add the following lines into it, toward the end of the file just before the closing `</configuration>` tag.
Replace the variables `[proxy-server]` and `[proxy-port]` with your proxy server name and port values.

```xml
    <system.net>
        <defaultProxy enabled="true" useDefaultCredentials="true">
            <proxy
                usesystemdefault="true"
                proxyaddress="http://[proxy-server]:[proxy-port]"
                bypassonlocal="true"
            />
        </defaultProxy>
    </system.net>
```

#### Agent registration fails with security error

You might get an error message when you install the cloud provisioning agent.

This problem is typically caused by the agent being unable to execute the PowerShell registration scripts due to local PowerShell execution policies.

To resolve this problem, change the PowerShell execution policies on the server. You need to have Machine and User policies set as *Undefined* or *RemoteSigned*. If they're set as *Unrestricted*, you'll see this error. For more information, see [PowerShell execution policies](/powershell/module/microsoft.powershell.core/about/about_execution_policies). 

### Log files

By default, the agent emits minimal error messages and stack trace information. You can find these trace logs in the folder **C:\ProgramData\Microsoft\Azure AD Connect Provisioning Agent\Trace**.

To gather additional details for troubleshooting agent-related problems, follow these steps.

1.  Install the AADCloudSyncTools PowerShell module as described [here](reference-powershell.md#install-the-aadcloudsynctools-powershell-module).
2. Use the `Export-AADCloudSyncToolsLogs` PowerShell cmdlet to capture the information.  You can use the following switches to fine tune your data collection.
      - SkipVerboseTrace to only export current logs without capturing verbose logs (default = false)
      - TracingDurationMins to specify a different capture duration (default = 3 mins)
      - OutputPath to specify a different output path (default = User’s Documents)


## Object synchronization problems

The following section contains information on troubleshooting object synchronization.

### Provisioning logs

In the Azure portal, provisioning logs can be used to help track down and troubleshoot object synchronization problems. To view the logs, select **Logs**.

![Logs button](media/how-to-troubleshoot/log-1.png)

Provisioning logs provide a wealth of information on the state of the objects being synchronized between your on-premises Active Directory environment and Azure.

![Provisioning Logs screen](media/how-to-troubleshoot/log-2.png)

You can use the drop-down boxes at the top of the page to filter the view to zero in on specific problems, such as dates. Double-click an individual event to see additional information.

![Provisioning Logs drop-down box information](media/how-to-troubleshoot/log-3.png)

This information provides detailed steps and where the synchronization problem is occurring. In this way, you can pinpoint the exact spot of the problem.


## Provisioning quarantined problems

Cloud sync monitors the health of your configuration and places unhealthy objects in a quarantine state. If most or all of the calls made against the target system consistently fail because of an error, for example, invalid admin credentials, the sync job is marked as in quarantine.

![Quarantine status](media/how-to-troubleshoot/quarantine-1.png)

By selecting the status, you can see additional information about the quarantine. You can also obtain the error code and message.

![Screenshot that shows additional information about the quarantine.](media/how-to-troubleshoot/quarantine-2.png)

Right clicking on the status will bring up additional options:
    
   - view provisioning logs
   - view agent
   - clear quarantine

![Screenshot that shows the right-click menu options.](media/how-to-troubleshoot/quarantine-4.png)


### Resolve a quarantine
There are two different ways to resolve a quarantine.  They are:

  - clear quarantine - clears the watermark and runs a delta sync
  - restart the provisioning job - clears the watermark and runs an initial sync

#### Clear quarantine
To clear the watermark and run a delta sync on the provisioning job once you have verified it, simply right-click on the status and select **clear quarantine**.

You should see an notice that the quarantine is clearing.

![Screenshot that shows the notice that the quarantine is clearing.](media/how-to-troubleshoot/quarantine-5.png)

Then you should see the status on your agent as healthy.

![Quarantine status information](media/how-to-troubleshoot/quarantine-6.png)

#### Restart the provisioning job
Use the Azure portal to restart the provisioning job. On the agent configuration page, select **Restart provisioning**.

  ![Restart provisioning](media/how-to-troubleshoot/quarantine-3.png)

- Use Microsoft Graph to [restart the provisioning job](/graph/api/synchronization-synchronizationjob-restart?tabs=http&view=graph-rest-beta&preserve-view=true). You'll have full control over what you restart. You can choose to clear:
  - Escrows, to restart the escrow counter that accrues toward quarantine status.
  - Quarantine, to remove the application from quarantine.
  - Watermarks. 
  
  Use the following request:
 
  `POST /servicePrincipals/{id}/synchronization/jobs/{jobId}/restart`

## Repairing the the Cloud Sync service account
If you need to repair the cloud sync service account you can use the `Repair-AADCloudSyncToolsAccount`.  


   1.  Use the installation steps outlined [here](reference-powershell.md#install-the-aadcloudsynctools-powershell-module) to begin and then continue with the remaining steps.
   2.  From a Windows PowerShell session with administrative privileges, type or copy and paste the following: 
	```
	Connect-AADCloudSyncTools
	```  
   3. Enter your Azure AD global admin credentials
   4. Type or copy and paste the following: 
	```
	Repair-AADCloudSyncToolsAccount
	```  
   5. Once this completes it should say that the account was repaired successfully.

## Next steps 

- [Known limitations](how-to-prerequisites.md#known-limitations)
- [Error codes](reference-error-codes.md)
