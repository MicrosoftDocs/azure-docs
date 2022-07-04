
# **SAP NetWeaver Provider**

## Prerequisites

To fetch specific metrics, you need to unprotect some methods for the current release. Follow these steps for each SAP system:

1. Open an SAP GUI connection to the SAP server.
2. Sign in by using an administrative account.
3. Execute transaction RZ10.
4. Select the appropriate profile (_DEFAULT.PFL_).
5. Select  **Extended Maintenance**  ->  **Change**.
6. Select the profile parameter &quot;service/protectedwebmethods&quot; and modify to have the following value, then click Copy:

 `  service/protectedwebmethods`

   `SDEFAULT -GetQueueStatistic -ABAPGetWPTable -EnqGetStatistic -GetProcessList`

7. Go back and select  **Profile**  ->  **Save**.

8. After saving the changes for this parameter, please restart the SAPStartSRV service on each of the instances in the SAP system. (Restarting the services will not restart the SAP system; it will only restart the SAPStartSRV service (in Windows) or daemon process (in Unix/Linux)) 
* 8.1. **On Windows systems**, this can be done in a single window using the SAP Microsoft Management Console (MMC) / SAP Management Console(MC). 

  Right-click on each instance and choose All Tasks -> Restart Service.

![](https://github.com/Azure/Azure-Monitor-for-SAP-solutions-preview/blob/main/Media/8.%20SAP%20Management%20Console.png)

* 8.2. **On Linux systems**, use the below command where NN is the SAP instance number to restart the host which is logged into.

`RestartService`

`sapcontrol -nr <NN> -function RestartService`

Once the SAP service is restarted, please check to ensure the updated web method protection exclusion rules have been applied for each instance by running the following command:

Logged as sidadm

`sapcontrol -nr <NN>; -function ParameterValue service/protectedwebmethods`

Logged as a different user

`sapcontrol -nr <NN> -function ParameterValue service/protectedwebmethods -user "<adminUser>" "<adminPassword>"`

The output should look like this:- 

![](https://github.com/Azure/Azure-Monitor-for-SAP-solutions-preview/blob/main/Media/9.%20SAP%20Control%20Output.png)

To conclude and validate, a test query can be done against web methods to validate ( replace the hostname, instance number, and method name ) leverage the below PowerShell script

`Powershell

`$SAPHostName = "<hostname>"`

`$InstanceNumber = "<instancenumber>"`

`$Function = "ABAPGetWPTable"`

`[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}`

`$sapcntrluri = "https://" + $SAPHostName + ":5" + $InstanceNumber + "14/?wsdl"`

`$sapcntrl = New-WebServiceProxy -uri $sapcntrluri -namespace WebServiceProxy -class sapcntrl`

`$FunctionObject = New-Object ($sapcntrl.GetType().NameSpace + ".$Function")`

`$sapcntrl.$Function($FunctionObject)`

\*\*Repeat Steps 3-10 for each instance profile \*\*.

  **Important**

It is critical that the sapstartsrv service is restarted on each instance of the SAP system for the SAPControl web methods to be unprotected. These read-only SOAP API are required for the NetWeaver provider to fetch metric data from the SAP System and failure to unprotect these methods will lead to empty or missing visualizations on the NetWeaver metric workbook.

9. Prerequisites for NetWeaver RFC Metrics:

   **Note:** RFC metrics are only supported for AS ABAP applications.

* 9.1 Create/Upload role in SAP NW ABAP system – This role is created with the guiding principle of “Least Privilege access” and is needed for AMS to connect to SAP
1. Log in to SAP System 
2. Unzip the file attached.
[Z_AMS_NETWEAVER_MONITORING.zip](https://github.com/Azure/Azure-Monitor-for-SAP-solutions-preview/files/8710130/Z_AMS_NETWEAVER_MONITORING.zip)
3. Upload "Z_AMS_NETWEAVER_MONITORING.SAP" file into the SAP system by navigating to Transaction code PFCG -> Role Upload. 
4. Click on Execute (Role gets generated)

   ![image](https://user-images.githubusercontent.com/74435183/168394064-19bcc0b9-2d02-4b3b-ad2e-4de57385d0dc.png)

4. Exit the SAP system. 

* 9.2 Create a new RFC user and assign the authorization.
1. Log in to SAP System. 
2. Create an RFC User and assign the role – “Z_AMS_NETWEAVER_MONITORING” created as part of Step 9.1
* 9.3. Enabling SMON for Monitoring of System Performance 
Enable SDF/SMON snapshot service and configure SDF/SMON metrics to be aggregated each minute. 
For SMON capability the version for ST-PI must be SAPK-74005INSTPI
   * Follow the detailed step to “Turning on the Daily Monitoring” from the SAP Note: “2651881 - How to configure SMON for performance monitoring and 
     analysis.
   * Recommended settings for SDF/SMON:
     Login to SAP and TCODE /SDF/SMON – Schedule SDF/SMON as a background job in your Target SAP Client (each Minute). Reference screenshot shared below 
     
     ![image](https://user-images.githubusercontent.com/74435183/168395025-fd9f8fd6-c859-416e-bebf-3ff97b2a8561.png)
     
     _When using SAP internal ACLs to restrict access by IP address, make sure the IP address of sapmon collector VM is added to ACLs_
 
* 9.4 Enable SAP ICF 
1. Login to SAP System. 
2. Navigate to Transaction code SICF 
3. Navigate to Service with Service Path - /default_host/sap/bc/soap/, and activate **wsdl, wsdl11 and RFC**  service: 

![image](https://user-images.githubusercontent.com/74435183/171516111-595b93e0-0bd8-45af-86a4-448a8bafe64c.png)

* 9.5 Additional checks to enable the ICF Ports (Optional – Recommended )

   * To find in which port your ICF is running. Right-click the ping service and choose the option – ‘Test Service’.  
 
   SAP will start your default browser and navigate to the ping service using the configured port. 

   ![image](https://user-images.githubusercontent.com/74435183/168395183-5badfc27-df27-4e83-96d6-bab2bf1f8b2c.png)

  * If the port could not be reached or the ping test fails, you might need to open the port in the SAP virtual machine by executing the commands below:  
    Linux:  
    sudo firewall-cmd --permanent --zone=public --add-port=<your-port>/TCP 
    sudo firewall-cmd --reload 
 
    Windows: 
    * Select the Start menu, type Windows Defender Firewall, and select it from the list of results. 
    * Select Advanced Settings on the side navigation menu. 
    * Select Inbound Rules. 
    * To open a port, select New Rule, add port = <your-port> and protocol = TCP, complete the instructions. 

## **Add SAP NetWeaver Provider Steps (Using Portal UI):**

1. Click on the **Providers** Tab on the AMS creation Page, then click on &quot; Add Provider&quot; button to go to the &quot; Add Provider&quot; Page

   ![image](https://user-images.githubusercontent.com/74435183/162337237-8032ac11-bb01-480f-9b01-1b29c5c311a9.png)

2. Select Type as SAP NetWeaver

   ![image](https://user-images.githubusercontent.com/74435183/168396901-1d292af1-adbc-4121-99cc-e1277a05b402.png)

* System ID (SID) - Provide the unique SAP system identifier which is a three-character identifier of an SAP system.
* Application Server - Provide the IP address or the fully qualified domain name (FQDN) of the SAP NetWeaver system to be monitored. 
  For example - sapservername.contoso.com where sapservername is the hostname and contoso.com is the subdomain. 
  When using a hostname, please ensure connectivity from within the similar VNET that you used while creating the AMS resource.
* Instance Number - Specify the instance number of the SAP NetWeaver [00-99]
* Host file Entries - Provide the DNS mappings for all the SAP virtual machines associated with the above-mentioned SID (see explanation below).
 ### Host file Entries

 Enter all SAP application servers and ACS host file entries in this box.

 Enter host file mappings in comma-separated format. The expected format for each entry is [IP FQDN HOSTNAME].
 
 For example: **192.X.X.X sapservername.contoso.com sapservername,192.X.X.X sapservername2.contoso.com sapservername2**

 To determine all SAP hostnames associated with the SID, you can login to SAP system using the <sidadm> user, and execute the following command :

 ```/usr/sap/hostctrl/exe/sapcontrol -nr <instancenumber>  -function GetSystemInstanceList```

 For all the hostnames returned from the above command ensure that the host file entries are provided.
* SAP client ID - Provide the SAP Client Id. 
* SAP HTTP Port - Port your ICF is running – E.g 8110 (Please follow step 9.5) 
* SAP username - SAP user to connect to the SAP system (created as Step 9.2) 
* SAP password - SAP password to connect to the SAP system (created as Step 9.2)

 For more details refer to the AMS public documentation : 
 https://docs.microsoft.com/en-us/azure/virtual-machines/workloads/sap/azure-monitor-sap-quickstart#sap-netweaver-provider