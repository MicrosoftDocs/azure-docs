---
title: Deploy WVD-Diagnostics-UX
---

# Deploy diagnostics for Windows Virtual Desktop

Diagnostics-UX for Windows Virtual Desktop provides you with the following functionality:

- Query diagnostic activities (Management, Connection, Feed) per user for a single week
- Query Log Analytics to gather session host information for connection activities
- Review VM Performance details for a particular host
- View users that are logged into the session host.
- Send message to active users on a specific session host
- Logoff users on a session host.

## Prerequisites

Before deploying the Azure Resource Manager template, you'll need to create an Azure Active Directory App Registration and the Log Analytics workspace. To deploy the UI the following need the administrator deploying should have following permissions:

- Owner on the Azure subscription
- Permission to create resources in your Azure subscription
- Permission to create an Azure AD application.
- RDS Owner or Contributor rights

You will need to install the following PowerShell modules:

- [Azure PowerShell module](https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-2.4.0)
- [Azure AD module](https://docs.microsoft.com/en-us/powershell/azure/active-directory/install-adv2?view=azureadps-2.0)

You will need to have the Subscription ID ready as it will be required.

Once the prerequisites are confirmed start creating the Azure AD App registration.

## Create an Azure AD App Registration using PowerShell script

In this section you will be executing the PowerShell script that is creating the Azure AD Application with service principal and add the API permissions to the AD Application

>[!NOTE]
>The API permissions are Windows Virtual Desktop, Log Analytics and Microsoft Graph API permissions are added to the AD Application.

1. Open PowerShell as an Administrator:
2. [Follow this link](https://github.com/Azure/RDS-Templates/tree/master/wvd-templates/diagnostics-sample/deploy/scripts) for “Create AD App Registration for Diagnostics.ps1” script. Execute it in PowerShell.
3.  Provide unique App Name when asked.
4.  When prompted authenticate with the administrative account. Enter the credentials of a user with [delegated admin access](https://docs.microsoft.com/en-us/azure/virtual-desktop/delegated-access-virtual-desktop). The admin needs to have either RDS Owner or Contributor rights.

After the script successfully runs, you should see the following things:

-  A message confirming that Service principal role assignment completed for this app.
-  Your Print Client ID and Client Secret Key that you'll need to enter when you deploy diagnostics UX.

Next configure your Log Analytics workspace.

## Configure your Log Analytics workspace

In this section you will configure your Log Analytics workspace with following recommended performance counters that allow you to derive statements of the user experience in a remote session. Here is the list of counters with default threshold values the user interface will highlight the session host as unhealthy.

If you don’t have a Log Analytics workspace today use the PowerShell script and instructions we have prepared for you in the next chapter. Otherwise go and configure the counters following the instructions here.

### Create an Azure Log Analytics workspace using PowerShell

In this section you will execute a PowerShell script which creates a Log Analytics Workspace and configures recommended Windows Performance Counters for deriving statements on user experience and app performance:

1.  Open PowerShell as an Administrator and run “Create LogAnalyticsWorkspace for Diagnostics.ps1” which you find in [this location](https://github.com/Azure/RDS-Templates/tree/master/wvd-templates/diagnostics-sample/deploy/scripts).
2. Enter the following values for the parameters:

    - A name for the resource group (ResourceGroupName)
    - A name for your Log Analytics workspace which needs to be unique (LogAnalyticsWorkspaceName)
    - Provide the Azure region (Location)
    - Provide the Azure Subscription ID. Locate it in the Azure Portal under Subscriptions.

3.   Enter the credentials of a user with delegated admin access

4. Authenticate to Azure with the above credentials

5. Remember the LogAnalyticsWorkspace Id for the next step.

Next, continue to [verify the script results in the portal](#validate-the-script-results-in-the-azure-portal) and connect your VMs
to the log analytics workspace.

### Configure Windows Performance counters in your existing Log Analytics workspace

The following instructions explain how you can set-up the expected Performance
counters in your existing Log Analytics workspace.

-   Open a browser and connect to the [Azure Portal](https://portal.azure.com/) with your administrative account.

-   Next go to **Log Analytics workspaces** to review the configured Windows Performance Counters.

-   In the settings section click **Advanced settings**.

-   Next navigate to **Data** > **Windows Performance Counters** and add the following counters – [follow this link for more detailed instructions](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/data-sources-performance-counters):

    -   LogicalDisk(\*)\|%Free Space

    -   LogicalDisk(C:)\\Avg. Disk Queue Length

    -   Memory(\*)\\Available Mbytes

    -   Processor Information(\*)\\Processor Time

    -   User Input Delay per Session(\*)\\Max Input Delay

>[!NOTE]
>Any additional counters you configure won’t show up in the UI. It needs configuration of the config file for the diagnostics UX. The guidance will be available at a later stage on Github for advanced administration.

## Validate the script results in the Azure Portal

### Review your app registration

Before continuing with the deployment of the diagnostics UX we recommend verifying that the AAD Application created with the API permissions and your Log Analytics workspace created with Windows Performance Counters preconfigured.

-   Open a browser and connect to the [Azure Portal](https://portal.azure.com/) with your administrative account.

-   Go to **App registrations** and look for App registrations Azure AD Application with API permissions.

![The API permissions page.](media/2b978bbf5b3769a1d83acd56031ba67b.png)

### Review your log Analytics workspace

-   Next go to **Log Analytics workspaces** to review the configured Windows Performance Counters.

    -   In the settings section click **Advanced settings**.

    -   Next navigate to Data \> **Windows Performance Counters** where the following counters should be preconfigured that are most useful to derive statements on user experience:

        -   LogicalDisk(\*)\|%Free Space: Displays the % of free space of the total usable space on the disk.

        -   LogicalDisk(C:)\\Avg. Disk Queue Length: The length of disk transfer request for disk C:. The value shouldn’t exceed 2 for a longer period of time.

        -   Memory(\*)\\Available Mbytes: The available memory for the system in Mbytes.

        -   Processor Information(\*)\\Processor Time: the percentage of elapsed time that the processor spends to execute a non-Idle thread.

        -   User Input Delay per Session(\*)\\Max Input Delay:

### Connect VMs to in your Log Analytics workspace

In order to be able to view the health of VMs you will need to enable the Log Analytics connection. Follow these steps to connect your VMs:

-   Open a browser and connect to the [Azure Portal](https://portal.azure.com/) with your administrative account.

-   Go to LogAnalyticsWorkspace created/existing one

-   In the left panel, under Workspace Data Sources, select virtual machines

-   Select the required virtual machine and click on it.

-   Click on Connect, it will take few seconds to connect

## Deploy the diagnostics UX

Follow these instructions to deploy the Azure Resource Management template:

1.  Go to the GitHub Azure RDS-Templates page.

2.  Deploy the template to Azure and follow instructions in the template. From
    the previous steps you need to have the following information available:

    -   Client-Id

    -   Client-Secret

    -   Log Analytics workspace ID

3.  Once the input parameters are provided, accept the terms and conditions and select **Purchase**.

The deployment will take 2–3 minutes. After successful deployment, go to the resource group and check that the web app and app service plan resources are created.

As last step you need to set the Redirect URI.

1.  In the Azure Portal navigate to **App Services** and locate the application
    you have just created.

2.  On the overview page **copy the URL**

3.  Next navigate to **app registrations** and click the app.

4.  In the left panel, under manage section select **Authentication**

5.  Set the RedirectURI by and save:

6. Selecting **Public client (mobile & desktop)** in the dropdown under
        Type

7. Enter the appURL and append **/security/signin-callback**.

        E.g: https://\<appname\>.azurewebsites.net**/security/signin-callback**

-   For example:

![](media/8fc125e527af5dbfac48b9f026d18b10.png)

>   Now, go to your Azure resources, select the Azure App Services resource with
>   the name you provided in the template (for example, contosoapp45) and
>   navigate to the URL associated with it; for
>   example, <https://contosoapp45.azurewebsites.net>.

8. Sign in using the appropriate Azure Active Directory user account.

9.  Select **Accept** to provide consent and use the Diagnostics-UX application.

## Distributing the diagnostic UX

Before you distribute the UX for usage ensure that the following permission are applied:

-   Users need read access to log analytics – see here the [RBAC documentation](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/roles-permissions-security).

-   Users need to have read access on the WVD tenant (RDS Reader role) – [go here](https://docs.microsoft.com/en-us/azure/virtual-desktop/delegated-access-virtual-desktop) for more information.

You need to provide the following to users of the diagnostics interface:

-   URL of the application

-   Tenant group and Tenant name they have access to.

## Using the diagnostics UX

Once signed in using with your account using information you have received from your organization (Tenant group/Tenant name) have the UPN ready for the user you want to query the activities. The search result will give you all activities for the specific activity type one week back from now.

### Understand activity search result

The activities are sorted by timestamp where the latest activity shows first. In case of an error verify if it is a service error. In that case you will most likely need to open a support ticket. Provide the Activity with the support ticket which helps us to debug the issue. All other scenarios might need user or administrator intervention. Find the most common scenarios [here](https://docs.microsoft.com/en-us/azure/virtual-desktop/diagnostics-role-service#common-error-scenarios).

Connection activities might have more than one error. You can expand the activity to see the other errors the user has been running into. Click the line to open up a dialog to see the friendly message.

### Investigate the Session host 

In the search results, find and select the session host you want information about.

-   Analyze the session host health:

    -   Based on predefined threshold you will be able to retrieve the session host health information which is queried from log analytics.

    -   In the case where there is no activity, or the session host is not connected to Log Analytics information might be not available.

-   Interact with users on the session host:

    -   For the logged-on users you have two interaction types which is either log-off or message users.

    -   The user from the search result is selected by default. Select additional users to apply the available interactions.

### Windows Performance counters thresholds

-   LogicalDisk(\*)\|%Free Space:

    -   Displays the percentage of the total usable space on the logical disk that is free.

    -   Threshold: Less than 20% will be marked as unhealthy.

-   LogicalDisk(C:)\\Avg. Disk Queue Length:

    -   Represents storage system conditions.

    -   Threshold: Higher than 5 is marked as unhealthy.

-   Memory(\*)\\Available Mbytes:

    -   The available memory for the system.

    -   Threshold: Less than 500 Mbytes marked as unhealthy.

-   Processor Information(\*)\\Processor Time:

    -   Threshold: Higher than 80% is unhealthy.

-   [User Input Delay per Session(\*)\\Max Input Delay](https://docs.microsoft.com/en-us/windows-server/remote/remote-desktop-services/rds-rdsh-performance-counters):

    -   Higher than 2000 ms is unhealthy.
