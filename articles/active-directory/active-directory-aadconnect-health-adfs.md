
<properties 
	pageTitle="Monitor your on-premises identity infrastructure in the cloud." 
	description="This is the Azure AD Connect Health page that describes what it is and why you would use it." 
	services="active-directory" 
	documentationCenter="" 
	authors="billmath" 
	manager="stevenpo" 
	editor="curtand"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="get-started-article" 
	ms.date="08/12/2015" 
	ms.author="billmath"/>

# Using Azure AD Connect Health with AD FS 
The following documentation is specific to monitoring your AD FS infrastructure with Azure AD Connect Health.

## Azure AD Connect Health AD FS Features
The Azure AD Connect Health Alerts section provides you the list of active alerts. Each alert includes relevant information, resolution steps, and links to related documentation. By selecting an active or resolved alert you will see a new blade with additional information, as well as steps you can take to resolve the alert, and links to additional documentation. You can also view historical data on alerts that were resolved in the past.

By selecting an alert you will be provided with additional information as well as steps you can take to resolve the alert and links to additional documentation.

![Azure AD Connect Health Portal](./media/active-directory-aadconnect-health/alert2.png)

Azure AD Connect Health Performance Monitoring provides monitoring information on metrics. By selecting the Monitoring box, a blade will open up that provides detailed information on the metrics.


![Azure AD Connect Health Portal](./media/active-directory-aadconnect-health/perf1.png)


By selecting the Filter option at the top of the blade, you can filter by server to see an individual server’s metrics. To change metrics, simply right-click on the monitoring chart under the monitoring blade and select Edit Chart. Then, from the new blade that opens up, you can select additional metrics from the drop-down and specify a time range for viewing the performance data.

Azure AD Connect Health Usage Analytics analyzes the authentication traffic of your federation servers. Selecting the usage analytics box will open the usage analytics blade, which will show you the metrics and groupings.

>[AZURE.NOTE] In order to use Usage Analytics with AD FS, you must ensure that AD FS auditing is enabled. For more information, see Azure AD Connect Health Requirements. 

![Azure AD Connect Health Portal](./media/active-directory-aadconnect-health/report1.png)

To select additional metrics, specify a time range, or to change the grouping, simply right-click on the usage analytics chart and select Edit Chart. Then you can specify the time range, change or select metrics and change the grouping. You can view the distribution of the authentication traffic based on different "metrics" and group each metric using relevant "group by" parameters described below.

| Metric | Group By | What the grouping means and why it's useful? |
| ------ | -------- | -------------------------------------------- |
| Total Requests: The total number of request processed by the federation service | All | This will show the count of total number of requests without grouping. |
|  | Application | This option will group the total requests based on the targeted relying party. This grouping is useful to understand which application is receiving how much percentage of the total traffic. |
|  | Server | This option will group the total requests based on the server that processed the request. This grouping is useful to understand the load distribution of the total traffic. |
|  | Workplace Join | This option will group the total requests based on if the requests are coming from devices that are workplace joined (known). This grouping is useful to understand if your resources are accessed using devices that are unknown to the identity infrastructure. |
|  | Authentication Method | This option will group the total requests based on the authentication method used for authentication. This grouping is useful to understand the common authentication method that gets used for authentication. Following are the possible authentication methods <ol> <li>Windows Integrated Authentication (Windows)</li> <li>Forms Based Authentication (Forms)</li> <li>SSO (Single Sign On)</li> <li>X509 Certificate Authentication (Certificate)</li> <br>Please note that a request is counted as SSO (Single Sign On) if the federation servers receive the request with an SSO Cookie. In such cases, if the cookie is valid, the user is not asked to provide credentials and gets seamless access to the application. This is common if you have multiple relying parties protected by the federation servers. |
|  | Network Location | This option will group the total requests based on the network location of the user. It can be either intranet or extranet. This grouping is useful to know what percentage of the traffic is coming from the intranet verses extranet. |
| Total Failed Requests: The total number failed requests processed by the federation service. <br> (This metric is only available on AD FS for Windows Server 2012 R2)| Error Type | This will show the number of errors based on predefined error types. This grouping is useful to understand the common types of errors. <ul><li>Incorrect Username or Password: Errors due to incorrect username or password.</li> <li>"Extranet Lockout": Failures due to the requests received from a user that was locked out from extranet </li><li> "Expired Password": Failures due to users logging in with an expired password.</li><li>"Disabled Account": Failures due to users logging with a disabled account.</li><li>"Device Authentication": Failures due to users failing to authenticate using Device Authentication.</li><li>"User Certificate Authentication": Failures due to users failing to authenticate because of an invalid certificate.</li><li>"MFA": Failures due to user failing to authenticate using Multi Factor Authentication.</li><li>"Other Credential": "Issuance Authorization": Failures due to authorization failures.</li><li>"Issuance Delegation": Failures due to issuance delegation errors.</li><li>"Token Acceptance": Failures due to ADFS rejecting the token from a 3rd party Identity Provider.</li><li>"Protocol": Failure due to protocol errors.</li><li>"Unknown": Catch all. Any other failures that do not fit into the defined categories.</li> |
|  | Server | This will group the errors based on the server. This is useful to understand the error distribution across servers. Uneven distribution could be an indicator of a server in a faulty state. |
|  | Network Location | This will group the errors based on the network location of the requests (intranet vs extranet). This is useful to understand the type of requests that are failing. |
|  | Application | This will group the failures based on the targeted application (relying party). This is useful to understand which targeted application is seeing most number of errors. |
| User Count: Average number of unique users active in the system | All | This provides a count of average number of users using the federation service in the selected time slice. The users are not grouped. <br>The average will depend on the time slice selected. |
|  | Application | This will group the average number of users based on the targeted application (relying party). This is useful to understand how many users are using which application. |




## AD FS auditing must be enabled to use Usage Analytics

In order for the Usage Analytics feature to gather data and analyze the Azure AD Connect Health agent needs the information in the AD FS Audit Logs. These logs are not enabled by default. This only applies to AD FS federation servers. You do not need to enable auditing on AD FS Proxy servers or Web Application Proxy servers. Use the following procedures to enable AD FS auditing and to locate the AD FS audit logs.

#### To enable auditing for AD FS 2.0

1. Click **Start**, point to **Programs**, point to **Administrative Tools**, and then click **Local Security Policy**.
1. Navigate to the **Security Settings\Local Policies\User Rights Management** folder, and then double-click Generate security audits.
1. On the **Local Security Setting** tab, verify that the AD FS 2.0 service account is listed. If it is not present, click **Add User or Group** and add it to the list, and then click **OK**.
1. Open a command prompt with elevated privileges and run the following command to enable auditing.
 `auditpol.exe /set /subcategory:"Application Generated" /failure:enable /success:enable`
1. Close Local Security Policy, and then open the Management snap-in.  To open the Management snap-in, click **Start**, point to **Programs**, point to **Administrative Tools**, and then click AD FS 2.0 Management.
1. In the Actions pane, click Edit Federation Service Properties.
1. In the **Federation Service Properties** dialog box, click the **Events** tab.
1. Select the **Success audits** and **Failure audits** check boxes.
1. Click **OK**.

#### To enable auditing for AD FS on Windows Server 2012 R2

1. Open **Local Security Policy** by opening **Server Manager** on the Start screen, or Server Manager in the taskbar on the desktop, then click **Tools/Local Security Policy**.
1. Navigate to the **Security Settings\Local Policies\User Rights Assignment** folder, and then double-click **Generate security audits**.
1. On the **Local Security Setting** tab, verify that the AD FS service account is listed. If it is not present, click **Add User or Group** and add it to the list, and then click **OK**.
1. Open a command prompt with elevated privileges and run the following command to enable auditing:
`auditpol.exe /set /subcategory:"Application Generated" /failure:enable /success:enable.`
1. Close **Local Security Policy**, and then open the **AD FS Management** snap-in (in Server Manager, click Tools, and then select AD FS Management).
1. In the Actions pane, click **Edit Federation Service Properties**.
1. In the Federation Service Properties dialog box, click the **Events** tab.
1. Select the **Success audits and Failure audits** check boxes and then click **OK**.






#### To locate the AD FS audit logs


1. Open **Event Viewer**.</li>
1. Go to Windows Logs and select **Security**.
1. On the right, click **Filter Current Logs**.
1. Under Event Source, select **AD FS Auditing**.

![AD FS audit logs](./media/active-directory-aadconnect-health-requirements/adfsaudit.png)

> [AZURE.WARNING] If you have a group policy that is disabling AD FS auditing then the Azure AD Connect Health Agent will not be able to collect information. Ensure that you don’t have a group policy that may be disabling auditing.