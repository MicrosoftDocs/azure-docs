---
title: Configure SAP NetWeaver for Azure Monitor for SAP solutions (preview)
description: Learn how to configure SAP NetWeaver for use with Azure Monitor for SAP solutions.
author: MightySuz
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.topic: article
ms.date: 11/02/2022
ms.author: sujaj
#Customer intent: As a developer, I want to configure a SAP NetWeaver provider so that I can use Azure Monitor for SAP solutions.
---


# Configure SAP NetWeaver for Azure Monitor for SAP solutions (preview)

[!INCLUDE [Azure Monitor for SAP solutions public preview notice](./includes/preview-azure-monitor.md)]

In this how-to guide, you'll learn to configure the SAP NetWeaver provider for use with *Azure Monitor for SAP solutions*. You can use SAP NetWeaver with both versions of the service, *Azure Monitor for SAP solutions* and *Azure Monitor for SAP solutions (classic)*.

User can select between the two connection types when configuring SAP Netweaver provider to collect information from SAP system. Metrics are collected by using 

- **SAP Control** - The SAP start service provides multiple services, including monitoring the SAP system. Both versions of Azure Monitor for SAP solutions use **SAP Control**, which is a SOAP web service interface that exposes these capabilities. The **SAP Control** interface [differentiates between protected and unprotected web service methods](https://wiki.scn.sap.com/wiki/display/SI/Protected+web+methods+of+sapstartsrv). It's necessary to unprotect some methods to use Azure Monitor for SAP solutions with NetWeaver.
- **SAP RFC** - Azure Monitor for SAP solutions also provides ability to collect additional information from the SAP system using Standard SAP RFC. It's available only as part of Azure Monitor for SAP solution and not available in the classic version. 

You can collect below metric using SAP NetWeaver Provider 

- SAP system and application server availability (for example Instance process availability of dispatcher,ICM,Gateway,Message server,Enqueue Server,IGS Watchdog) (SAP Control)
- Work process usage statistics and trends (SAP Control)
- Enqueue Lock statistics and trends (SAP Control)
- Queue usage statistics and trends (SAP Control)
- SMON Metrics (**transaction code - /SDF/SMON**) (RFC)
- SWNC Workload, Memory, Transaction, User, RFC Usage (**transaction code - St03n**) (RFC)
- Short Dumps (**transaction code - ST22**) (RFC)
- Object Lock (**transaction code - SM12**) (RFC)
- Failed Updates (**transaction code - SM13**) (RFC)
- System Logs Analysis (**transaction code - SM21**) (RFC)
- Batch Jobs Statistics (**transaction code - SM37**) (RFC)
- Outbound Queues (**transaction code - SMQ1**) (RFC)
- Inbound Queues (**transaction code - SMQ2**) (RFC)
- Transactional RFC (**transaction code - SM59**) (RFC)
- STMS Change Transport System Metrics (**transaction code - STMS**) (RFC)


## Prerequisites

- An Azure subscription. 
- An existing Azure Monitor for SAP solutions resource. To create an Azure Monitor for SAP solutions resource, see the [quickstart for the Azure portal](quickstart-portal.md) or the [quickstart for PowerShell](quickstart-powershell.md).

## Configure NetWeaver for Azure Monitor for SAP solutions

To configure the NetWeaver provider for the current Azure Monitor for SAP solutions version, you'll need to:

1. [Prerequisite - Unprotect methods for metrics](#prerequisite-unprotect-methods-for-metrics)
1. [Prerequisite to enable RFC metrics ](#prerequisite-to-enable-rfc-metrics)
1. [Add the NetWeaver provider](#adding-netweaver-provider)

Refer to troubleshooting section to resolve any issue faced while adding the SAP NetWeaver Provider. 

### Prerequisite unprotect methods for metrics

This step is **mandatory** when configuring SAP NetWeaver Provider. To fetch specific metrics, you need to unprotect some methods in each SAP instance:

1. Open an SAP GUI connection to the SAP server.
1. Sign in with an administrative account.
1. Execute transaction **RZ10**.
1. Select the appropriate profile (recommended Instance Profile).
1. Select **Extended Maintenance**  &gt;  **Change**.
1. Select the profile parameter `service/protectedwebmethods`.
1. Change the value to:    
    ```Value field 
    SDEFAULT -GetQueueStatistic -ABAPGetWPTable -EnqGetStatistic -GetProcessList -GetEnvironment
1. Select **Copy**.
1. Select **Profile** &gt; **Save** to save the changes.
1. Restart the **SAPStartSRV** service on each instance in the SAP system. Restarting the services doesn't restart the entire system. This process only restarts **SAPStartSRV** (on Windows) or the daemon process (in Unix or Linux).

    1. On Windows systems, use the SAP Microsoft Management Console (MMC) or SAP Management Console (MC) to restart the service. Right-click each instance. Then, choose **All Tasks** &gt; **Restart Service**.
    
    2. On Linux systems, use the following commands to restart the host. Replace `<instance number>` with your SAP system's instance number.
    
    ```Command to restart the service 
    sapcontrol -nr <instance number> -function RestartService
    ```    
    3. Repeat the previous steps for each instance profile.

### Prerequisite to enable RFC metrics  

For AS ABAP applications only, you can set up the NetWeaver RFC metrics. This step is **mandatory** when connection type selected is **SOAP+RFC**. Below steps need to be performed as a pre-requisite to enable RFC 

1. **Create or upload role** in the SAP NW ABAP system. Azure Monitor for SAP solutions requires this role to connect to SAP. The role uses least privilege access.Download and unzips [Z_AMS_NETWEAVER_MONITORING.zip](https://github.com/Azure/Azure-Monitor-for-SAP-solutions-preview/files/8710130/Z_AMS_NETWEAVER_MONITORING.zip).
    1. Sign in to your SAP system.
    1. Use the transaction code **PFCG** &gt; select on **Role Upload** in the menu.
    1. Upload the **Z_AMS_NETWEAVER_MONITORING.SAP** file from the ZIP file.
    1. Select **Execute** to generate the role. (ensure the profile is also generated as part of the role upload)
    
2. **Create and authorize a new RFC user**.
    1. Create an RFC user.
    1. Assign the role **Z_AMS_NETWEAVER_MONITORING** to the user. It's the role that you uploaded in the previous section.

3. **Enable SICF Services** to access the RFC via the SAP Internet Communication Framework (ICF)
    1. Go to transaction code **SICF**.
    1. Go to the service path `/default_host/sap/bc/soap/`.
    1. Activate the services **wsdl**, **wsdl11** and **RFC**.
  
It's also recommended to check that you enabled the ICF ports.  

4. **SMON** - Enable **SMON** to monitor the system performance.Make sure the version of **ST-PI** is **SAPK-74005INSTPI**. You'll see empty visualization as part of the workbook when it isn't configured. 

    1. Enable the **SDF/SMON** snapshot service for your system. Turn on daily monitoring. For instructions, see [SAP Note 2651881](https://userapps.support.sap.com/sap/support/knowledge/en/2651881).
    2. Configure **SDF/SMON** metrics to be aggregated every minute.
    3. recommended scheduling **SDF/SMON** as a background job in your target SAP client each minute. 

5. **To enable secure communication** 

   To [enable TLS 1.2 or higher](enable-tls-azure-monitor-sap-solutions.md) with SAP NetWeaver provider please execute steps mentioned on this [SAP document](https://help.sap.com/docs/ABAP_PLATFORM_NEW/e73bba71770e4c0ca5fb2a3c17e8e229/4923501ebf5a1902e10000000a42189c.html?version=201909.002)

    **Check if SAP systems are configured for secure communication using TLS 1.2 or higher**  
   
    1.	Go to transaction RZ10.
    2.	Open DEFAULT profile, select Extended Maintenance and click change.
    3.	Below configuration is for TLS1.2 the bit mask will be 544: PFS. If TLS version is higher, then bit mask will be greater than 544.
    
    ![tlsimage1](https://user-images.githubusercontent.com/74435183/219510020-0b26dacd-be34-4441-bf44-f3198338d416.png)

    **Check HTTPS port to be provided during the create provide process**  
    1.	Go to transaction SMICM.
    2.	Choose from the menu GOTO -> Services.
    3.	Verify if HTTPS protocol is in Active status.
    
    ![tlsimage2](https://user-images.githubusercontent.com/74435183/219510068-45f9e083-209c-4f33-86fc-488eb1e73a32.png)
    
### Adding NetWeaver provider

Ensure all the pre-requisites are successfully completed. To add the NetWeaver provider:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the Azure Monitor for SAP solutions service page.
1. Select **Create** to open the resource creation page.
1. Enter information for the **Basics** tab.
1. Select the **Providers** tab. Then, select **Add provider**.
1. Configure the new provider:
    1. For **Type**, select **SAP NetWeaver**.
    2. For **Name**, provide a unique name for the provider 
    3. For **System ID (SID)**, enter the three-character SAP system identifier.
    4. For **Application Server**, enter the IP address or the fully qualified domain name (FQDN) of the SAP NetWeaver system to monitor. For example, `sapservername.contoso.com` where `sapservername` is the hostname and  `contoso.com` is the domain. If you're using a hostname, make sure there's connectivity from the virtual network that you used to create the Azure Monitor for SAP solutions resource.
    5. For **Instance number**, specify the instance number of SAP NetWeaver (00-99)
    6. For **Connection type** - select either [SOAP](#prerequisite-unprotect-methods-for-metrics) + [RFC](#prerequisite-to-enable-rfc-metrics) or [SOAP](#prerequisite-unprotect-methods-for-metrics) based on the metric collected (refer above section for details) 
    7. For **SAP client ID**, provide the SAP client identifier.
    8. For **SAP ICM HTTP Port**, enter the port that the ICM is using, for example, 80(NN) where (NN) is the instance number.
    9. For **SAP username**, enter the name of the user that you created to connect to the SAP system.
    10. For **SAP password**, enter the password for the user.    
    11. For **Host file entries**, provide the DNS mappings for all SAP VMs associated with the SID
        Enter **all SAP application servers and ASCS** host file entries in **Host file entries**. Enter host file mappings in comma-separated format. The expected format for each entry is IP address, FQDN, hostname. For example: **192.X.X.X sapservername.contoso.com sapservername,192.X.X.X sapservername2.contoso.com sapservername2**. Make sure that host file entries are provided for all hostnames that the [command returns](#determine-all-hostname-associated-with-an-sap-system)

## Troubleshooting for SAP Netweaver Provider 

List of common commands and troubleshooting solution for errors. 

### Ensuring Internet communication Framework port is open

1. Sign in to the SAP system
2. Go to transaction code **SICF**.
3. Navigate to the service path `/default_host/sap/bc/soap/`.
3. Right-click the ping service and choose **Test Service**. SAP starts your default browser.
4. If the port can't be reached, or the test fails, open the port in the SAP VM.
    
    1. For Linux, run the following commands. Replace `<your port>` with your configured port.

        ```bash
        sudo firewall-cmd --permanent --zone=public --add-port=<your port>/TCP
        ```
        ```bash
        sudo firewall-cmd --reload
        ```
    1. For Windows, open Windows Defender Firewall from the Start menu. Select **Advanced settings** in the side menu, then select **Inbound Rules**. To open a port, select **New Rule**. Add your port and set the protocol to TCP.

### Check for unprotected updated rules

After you restart the SAP service, check that your updated rules are applied to each instance. 

1. When Sign in to the SAP system as `sidadm`. Run the following command. Replace `<instance number>` with your system's instance number.

    ```Command to list unprotectedmethods 
    sapcontrol -nr <instance number> -function ParameterValue service/protectedwebmethods
    ```

1. When sign in as non SIDADM user. Run the following command, replace `<instance number>` with your system's instance number, `<admin user>` with your administrator username, and `<admin password>` with the password.

    ```Command to list unprotectedmethods
    sapcontrol -nr <instance number> -function ParameterValue service/protectedwebmethods -user "<admin user>" "<admin password>"
    ```

1. Review the output. Ensure in the output you see the name of methods **GetQueueStatistic ABAPGetWPTable EnqGetStatistic GetProcessList GetEnvironment**

1. Repeat the previous steps for each instance profile.

To validate the rules, run a test query against the web methods. Replace the `<hostname>` with your hostname, `<instance number>` with your SAP instance number, and the method name with the appropriate method.

  ```powershell
  $SAPHostName = "<hostname>"
  
  $InstanceNumber = "<instance number>"
  
  $Function = "ABAPGetWPTable"
  
  [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
      
  $sapcntrluri = "https://" + $SAPHostName + ":5" + $InstanceNumber + "14/?wsdl"
      
  $sapcntrl = New-WebServiceProxy -uri $sapcntrluri -namespace WebServiceProxy -class sapcntrl
      
  $FunctionObject = New-Object ($sapcntrl.GetType().NameSpace + ".$Function")
      
  $sapcntrl.$Function($FunctionObject)
 ```

### Determine all hostname associated with an SAP system 
    
To determine all SAP hostnames associated with the SID, Sign in to the SAP system using the `sidadm` user. Then, run the following command:

   ```Command to find list of instances associated to given instance
    /usr/sap/hostctrl/exe/sapcontrol -nr <instancenumber>  -function GetSystemInstanceList
   ```
    
### Common errors and possible solutions 

#### Methods incorrectly unprotected in RZ10
The provider settings validation operation has failed with code ‘SOAPWebMethodsValidationFailed’.
    
Possible Causes: The operation failed with error: ‘Error occurred while validating SOAP client API calls for SAP system saptstgtmci.redmond.corp.microsoft.com [‘ABAPGetWPTable – [[“HTTP 401 Unauthorized”, [“SAPSYSTEM1_10”, “SAPSYSTEM2_10”, “SAPSYSTEM3_10”]]]’, ‘GetQueueStatistic – [[“HTTP 401 Unauthorized”, [“SAPSYSTEM1_10”, “SAPSYSTEM2_10”, “SAPSYSTEM3_10”]]]’].’. 
    
Recommended Action: ‘Ensure that the SOAP web service methods are unprotected correctly. For more information, see'.
(Code: ProviderInstanceValidationOperationFailed) 
    
#### Incorrect username and password 
The provider settings validation operation has failed with code 'NetWeaverAuthenticationFailed'.
    
Possible Causes: The operation failed with error: 'Authentication failed, incorrect SAP NetWeaver username, password or client id.'.
    
Recommended Action: 'Please check the mandatory parameters username, password or client id are provided correctly.'. 
(Code: ProviderInstanceValidationOperationFailed) 

#### WSDL11 is inactive in SICF
The provider settings validation operation has failed with code 'NetWeaverRfcSOAPWSDLInactive'. 
    
Possible Causes: The operation failed with error: 'WSDL11 is inactive in the SAP System: (SID).  
Error occurred while validating RFC SOAP client API calls for SAP system. 
    
Recommended Action: 'Please check the WSDL11 service node is active, refer to SICF Transaction in SAP System to activate the service'.
(Code: ProviderInstanceValidationOperationFailed) 
    
#### Roles incorrectly uploaded and profile not activated
    
The provider settings validation operation has failed with code ‘NetWeaverRFCAuthorizationFailed’. 
    
Possible Causes: Authentication failed, roles file isn't uploaded in the SAP System. 
    
Recommended Action: Ensure that the roles file is uploaded correctly in SAP System. For more information, see.
(Code: ProviderInstanceValidationOperationFaile) 
 
#### Incorrect input provided 
The provider settings validation operation has failed with code 'SOAPApiConnectionError'. 
    
Possible Causes: The operation failed with error: 'Unable to reach the hostname: (hostname) with the input provided.  
    
Recommended Action: 'check the input hostname, instance number, and host file entries. '.
(Code: ProviderInstanceValidationOperationFailed) 
    
#### Batch job metrics not fetched
Apply the OSS Note - 2469926 in your SAP System to resolve the issues with batch job metrics.

After you apply this OSS note you need to execute the RFC function module - BAPI_XMI_LOGON_WS with following parameters:

This function module has the same parameters as BAPI_XMI_LOGON but stores them in the table BTCOPTIONS.

INTERFACE = XBP 
VERSION = 3.0 
EXTCOMPANY = TESTC 
EXTPRODUCT = TESTP

## Configure NetWeaver for Azure Monitor for SAP solutions (classic)

To configure the NetWeaver provider for the Azure Monitor for SAP solutions (classic) version:

1. [Unprotect some methods](#unprotect-methods)
1. [Restart the SAP start service](#restart-sap-start-service)
1. [Check that your settings have been updated properly](#validate-changes)
1. [Install the NetWeaver provider through the Azure portal](#install-netweaver-provider)

### Unprotect methods

To fetch specific metrics, you need to unprotect some methods for the current release. Follow these steps for each SAP system:

1. Open an SAP GUI connection to the SAP server.
1. Sign in with an administrative account.
1. Execute transaction **RZ10**.
1. Select the appropriate profile (*DEFAULT.PFL*).
1. Select **Extended Maintenance** &gt; **Change**. 
1. Select the profile parameter `service/protectedwebmethods`.
1. Change the value to `SDEFAULT -GetQueueStatistic -ABAPGetWPTable -EnqGetStatistic -GetProcessList`.
1. Select **Copy**.
1. Go back and select **Profile** &gt; **Save**.

### Restart SAP start service

After updating the parameter, restart the **SAPStartSRV** service on each of the instances in the SAP system. Restarting the services doesn't restart the SAP system. Only the **SAPStartSRV** service (in Windows) or daemon process (in Unix/Linux) is restarted.

You must restart **SAPStartSRV** on each instance of the SAP system for the SAP Control web methods to be unprotected. These read-only SOAP APIs are required for the NetWeaver provider to fetch metric data from the SAP system. Failure to unprotect these methods results empty or missing visualizations on the NetWeaver metric workbook.

On Windows, open the SAP Microsoft Management Console (MMC) / SAP Management Console (MC).  Right-click on each instance and select **All Tasks** &gt; **Restart Service**.
  
![Screenshot of the MMC console, showing the Restart Service option being selected.](./media/provider-netweaver/azure-monitor-providers-netweaver-mmc-output.png)

On Linux, run the command `sapcontrol -nr <NN> -function RestartService`. Replace `<NN>` with the SAP instance number to restart the host.

## Validate changes

After the SAP service restarts, check that the updated web method protection exclusion rules have been applied for each instance. Run one of the following commands. Again, replace `<NN>` with the SAP instance number.

- If you're logged in as `<sidadm\>`, run `sapcontrol -nr <NN> -function ParameterValue service/protectedwebmethods`.

- If you're logged in as another user, run `sapcontrol -nr <NN> -function ParameterValue service/protectedwebmethods -user "<adminUser>" "<adminPassword>"`.

To validate your settings, run a test query against web methods. Replace the hostname, instance number, and method name with the appropriate values.

```powershell
$SAPHostName = "<hostname>"
$InstanceNumber = "<instance-number>"
$Function = "ABAPGetWPTable"
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
$sapcntrluri = "https://" + $SAPHostName + ":5" + $InstanceNumber + "14/?wsdl"
$sapcntrl = New-WebServiceProxy -uri $sapcntrluri -namespace WebServiceProxy -class sapcntrl
$FunctionObject = New-Object ($sapcntrl.GetType().NameSpace + ".$Function")
$sapcntrl.$Function($FunctionObject)
```

Repeat the previous steps for each instance profile.
   
You can use an access control list (ACL) to filter the access to a server port. For more information, see [SAP note 1495075](https://launchpad.support.sap.com/#/notes/1495075).

### Install NetWeaver provider

To install the NetWeaver provider in the Azure portal:

1. Sign in to the Azure portal. 

1. Go to the **Azure Monitor for SAP solutions** service.

1. Select **Create** to add a new Azure Monitor for SAP solutions resource.

1. Select **Add provider**.

   1. For **Type**, select **SAP NetWeaver**.

   1. *Optional* Select **Enable Secure communcation**, choose certificate from drop down. 

   1. For **Hostname**, enter the host name of the SAP system.

   1. For **Subdomain**, enter a subdomain if applicable.

   1. For **Instance No**, enter the instance number that corresponds to the host name you entered. 

   1. For **SID**, enter the system ID.

1. Select **Add provider** to save your changes. 

1. Continue to add more providers as needed.

1. Select **Review + create** to review the deployment.

1. Select **Create** to finish creating the resource.

If the SAP application servers (VMs) are part of a network domain, such as an Azure Active Directory (Azure AD) managed domain, you must provide the corresponding subdomain. The Azure Monitor for SAP solutions collector VM exists inside the virtual network, and isn't joined to the domain. Azure Monitor for SAP solutions can't resolve the hostname of instances inside the SAP system unless the hostname is an FQDN. If you don't provide the subdomain, there can be missing or incomplete visualizations in the NetWeaver workbook.

For example, if the hostname of the SAP system has an FQDN of `myhost.mycompany.contoso.com`:

- The hostname is `myhost`
- The subdomain is `mycompany.contoso.com`

When the NetWeaver provider invokes the **GetSystemInstanceList** API on the SAP system, SAP returns the hostnames of all instances in the system. The collect VM uses this list to make more API calls to fetch metrics for each instances feature. For example, ABAP, J2EE, MESSAGESERVER, ENQUE, ENQREP, and more. If you specify the subdomain, the collect VM uses the subdomain to build the FQDN of each instance in the system.

Don't specify an IP address for the hostname if your SAP system is part of network domain.

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure Monitor for SAP solutions provider types](providers.md)
