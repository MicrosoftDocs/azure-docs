---
title: 'Troubleshooting issues with the ECMA Connector Host and Azure AD'
description: Describes how to troubleshoot various issues you may encounter when installing and using the ECMCA connector host.
services: active-directory
author: billmath
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 05/28/2021
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Troubleshooting ECMA Connector Host issues

>[!IMPORTANT]
> The on-premises provisioning preview is currently in an invitation-only preview. You can request access to the capability [here](https://aka.ms/onpremprovisioningpublicpreviewaccess). We will open the preview to more customers and connectors over the next few months as we prepare for general availability.


## Troubleshoot test connection issues. 
After configuring the ECMA Host and Provisioning Agent, it's time to test connectivity from the Azure AD Provisioning service to the Provisioning Agent > ECMA Host > Application. This end to end test can be performed by clicking test connection in the application in the Azure portal. When test connection fails, try the following troubleshooting steps:

 1. Verify that the agent and ECMA host are running:
     1. On the server with the agent installed, open **Services** by going to **Start** > **Run** > **Services.msc**.
     2. Under **Services**, make sure **Microsoft Azure AD Connect Agent Updater**, **Microsoft Azure AD Connect Provisioning Agent**, and **Microsoft ECMA2Host** services are present and their status is *Running*. 
![ECMA service running](./media/on-premises-ecma-troubleshoot/tshoot-1.png)

 2. Navigate to the folder where the ECMA Host was installed  > Troubleshooting > Scripts > TestECMA2HostConnection and run the script.  This script will send a SCIM GET or POST request in order to validate that the ECMA Connector Host is operating and responding to requests.
    It should be run on the same computer as the ECMA Connector Host service itself.
 3. Ensure that the agent is active by navigating to your application in the Azure portal, click on admin connectivity, click on the agent dropdown, and ensure your agent is active.
 4. Check if the secret token provided is the same as the secret token on-prem (you will need to go on-prem and provide the secret token again and then copy it into the Azure portal).
 5. Ensure that you have assigned one or more agents to the application in the Azure portal.
 6. After assigning an agent, you need to wait 10-20 minutes for the registration to complete.  The connectivity test will not work until the registration completes.
 7. Ensure that you are using a valid certificate. Navigating the settings tab of the ECMA host allows you to generate a new certificate.
 8. Restart the provisioning agent by navigating to the task bar on your VM by searching for the Microsoft Azure AD Connect provisioning agent. Right-click stop and then start.
 9. When providing the tenant URL in the Azure portal, ensure that it follows the following pattern. You can replace localhost with your hostname, but it is not required. Replace "connectorName" with the name of the connector you specified in the ECMA host.
    ```
    https://localhost:8585/ecma2host_connectorName/scim
    ```

## Unable to configure ECMA host, view logs in event viewer, or start ECMA host service

#### The following issues can be resolved by running the ECMA host as an admin:

* I get an error when opening the ECMA host wizard 
   ![ECMA wizard error](./media/on-premises-ecma-troubleshoot/tshoot-2.png)

* I've been able to configure the ECMA host wizard, but am not able to see the ECMA host logs. In this case you will need to open the host as an admin and setup a connector end to end. This can be simplified by exporting an existing connector and importing it again. 

   ![Host logs](./media/on-premises-ecma-troubleshoot/tshoot-3.png)

* I've been able to configure the ECMA host wizard, but am not able to start the ECMA host service
   ![Host service](./media/on-premises-ecma-troubleshoot/tshoot-4.png)


## Turning on verbose logging 

By default, the swithValue for the ECMA Connector Host is set to Error.  This means it will only log events that are errors.  To enable verbose logging for the ECMA host service and / or Wizard. Set the "switchValue" to Verbose in both locations as shown below.

File location for verbose service logging: c:\program files\Microsoft ECMA2Host\Service\Microsoft.ECMA2Host.Service.exe.config
  ```
  <?xml version="1.0" encoding="utf-8"?> 
  <configuration> 
      <startup>  
          <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.6" /> 
      </startup> 
      <appSettings> 
        <add key="Debug" value="true" /> 
      </appSettings> 
      <system.diagnostics> 
        <sources> 
      <source name="ConnectorsLog" switchValue="Verbose"> 
            <listeners> 
              <add initializeData="ConnectorsLog" type="System.Diagnostics.EventLogTraceListener, System, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" name="ConnectorsLog" traceOutputOptions="LogicalOperationStack, DateTime, Timestamp, Callstack"> 
                <filter type=""/> 
              </add> 
            </listeners> 
          </source> 
          <!-- Choose one of the following switchTrace:  Off, Error, Warning, Information, Verbose --> 
          <source name="ECMA2Host" switchValue="Verbose"> 
            <listeners>  
              <add initializeData="ECMA2Host" type="System.Diagnos
  ```

File location for verbose wizard logging: C:\Program Files\Microsoft ECMA2Host\Wizard\Microsoft.ECMA2Host.ConfigWizard.exe.config
  ```
        <source name="ConnectorsLog" switchValue="Verbose"> 
          <listeners> 
            <add initializeData="ConnectorsLog" type="System.Diagnostics.EventLogTraceListener, System, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" name="ConnectorsLog" traceOutputOptions="LogicalOperationStack, DateTime, Timestamp, Callstack"> 
              <filter type=""/> 
            </add> 
          </listeners> 
        </source> 
        <!-- Choose one of the following switchTrace:  Off, Error, Warning, Information, Verbose --> 
        <source name="ECMA2Host" switchValue="Verbose"> 
          <listeners> 
            <add initializeData="ECMA2Host" type="System.Diagnostics.EventLogTraceListener, System, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" name="ECMA2HostListener" traceOutputOptions="LogicalOperationStack, DateTime, Timestamp, Callstack" /> 
  ```

## Target attribute missing 
The provisioning service automatically discovers attributes in your target application. If you see that a target attribute is missing in the target attribute list in the Azure portal, perform the following troubleshooting step:

 1. Review the "Select Attributes" page of your ECMA host configuration to verify that the attribute has been selected to be exposed to the Azure portal.
 2. Ensure that the ECMA host service is turned on. 
 3. Review the ECMA host logs to verify that a /schemas request was made and review the attributes in the response. This information will be valuable for support to troubleshoot the issue. 

## Collect logs from event viewer as a zip file
Navigate to the folder where the ECMA Host was installed  > Troubleshooting > Scripts. Run the `CollectTroubleshootingInfo` script as an admin. It allows you to capture the logs in a zip file and export them.  

## Reviewing events in the event viewer

Once the ECMA Connector host schema mapping has been configured, start the service so it will listen for incoming connections.  Then, monitor for incoming requests. To do this, do the following:

  1. Click on the start menu, type **event viewer**, and click on Event Viewer. 
  2. In **Event Viewer**, expand **Applications and Services** Logs, and select **Microsoft ECMA2Host Logs**.     
  3. As changes are received by the connector host, events will be written to the application log. 



## Understanding incoming SCIM requests 

Requests made by Azure AD to the provisioning agent and connector host use the SCIM protocol. Requests made from the host to apps use the protocol the app support and the requests from the host to agent to Azure AD rely on SCIM. You can learn more about our SCIM implementation [here](use-scim-to-provision-users-and-groups.md).  

Be aware that at the beginning of each provisioning cycle, before performing on-demand provisioning, and when doing the test connection the Azure AD provisioning service generally makes a get user call for a [dummy user](use-scim-to-provision-users-and-groups.md#request-3) to ensure the target endpoint is available and returning SCIM-compliant responses. 


## How do I troubleshoot the provisioning agent?
### Agent failed to start

You might receive an error message that states:

**Service 'Microsoft Azure AD Connect Provisioning Agent' failed to start. Verify that you have sufficient privileges to start the system services.** 

This problem is typically caused by a group policy that prevented permissions from being applied to the local NT Service log-on account created by the installer (NT SERVICE\AADConnectProvisioningAgent). These permissions are required to start the service.

To resolve this problem, follow these steps.

1. Sign in to the server with an administrator account.
1. Open **Services** by either navigating to it or by going to **Start** > **Run** > **Services.msc**.
1. Under **Services**, double-click **Microsoft Azure AD Connect Provisioning Agent**.
1. On the **Log On** tab, change **This account** to a domain admin. Then restart the service. 

This test verifies that your agents can communicate with Azure over port 443. Open a browser, and go to the previous URL from the server where the agent is installed.

### Agent times out or certificate is invalid

You might get the following error message when you attempt to register the agent.

![Agent times out](./media/on-premises-ecma-troubleshoot/tshoot-5.png)

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
### Agent registration fails with security error

You might get an error message when you install the cloud provisioning agent.

This problem is typically caused by the agent being unable to execute the PowerShell registration scripts due to local PowerShell execution policies.

To resolve this problem, change the PowerShell execution policies on the server. You need to have Machine and User policies set as *Undefined* or *RemoteSigned*. If they're set as *Unrestricted*, you'll see this error. For more information, see [PowerShell execution policies](/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-6). 

### Log files

By default, the agent emits minimal error messages and stack trace information. You can find these trace logs in the folder **C:\ProgramData\Microsoft\Azure AD Connect Provisioning Agent\Trace**.

To gather additional details for troubleshooting agent-related problems, follow these steps.

1.  Install the AADCloudSyncTools PowerShell module as described [here](../../active-directory/cloud-sync/reference-powershell.md#install-the-aadcloudsynctools-powershell-module).
2. Use the `Export-AADCloudSyncToolsLogs` PowerShell cmdlet to capture the information.  You can use the following switches to fine-tune your data collection.
      - SkipVerboseTrace to only export current logs without capturing verbose logs (default = false)
      - TracingDurationMins to specify a different capture duration (default = 3 mins)
      - OutputPath to specify a different output path (default = User’s Documents)

---------------------

Azure AD allows you to monitor the provisioning service in the cloud as well as collect logs on-premises. The provisioning service emits logs for each user that was evaluated as part of the synchronization process. Those logs can be consumed through the [Azure portal UI, APIs, and log analytics](../reports-monitoring/concept-provisioning-logs.md). In addition, the ECMA host generates logs on-premises, showing each provisioning request received and the response sent to Azure AD.

### Agent installation fails
* The error `System.ComponentModel.Win32Exception: The specified service already exists` indicates that the previous ECMA Host was unsuccessfully uninstalled. Please uninstall the host application. Navigate to program files and remove the ECMA Host folder. You may want to store the configuration file for backup. 
* The following error indicates a pre-req has not been fulfilled. Ensure that you have .NET 4.7.1 installed.

  ```
    Method Name : <>c__DisplayClass0_1 : 
    RegisterNotLoadedAssemblies Error during load assembly: System.Management.Automation.resources.dll
    --------- Outer Exception Data ---------
    Message: Could not load file or assembly 'file:///C:\Program Files\Microsoft ECMA2Host\Service\ECMA\System.Management.Automation.resources.dll' or one of its dependencies. The system cannot find the file specified.

  ```


## Next Steps

- [Azure AD ECMA Connector Host installation](on-premises-ecma-install.md)
- [Azure AD ECMA Connector Host configuration](on-premises-ecma-configure.md)
- [Generic SQL Connector](on-premises-sql-connector-configure.md)
- [Tutorial:  ECMA Connector Host Generic SQL Connector](tutorial-ecma-sql-connector.md)