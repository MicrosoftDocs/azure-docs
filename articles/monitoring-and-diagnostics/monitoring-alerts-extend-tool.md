---
title: How to extend alerts from Log Analytics to Azure | Microsoft Docs
description: This article describes the tools and API by which you can extend alerts from Log Analytics to Azure Alerts.
author: msvijayn
manager: kmadnani1
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/04/2018
ms.author: vinagara

---
# How to extend alerts from Log Analytics into Azure Alerts
The alerts feature in Azure Log Analytics is being replaced by Azure Alerts. As part of this transition, alerts that you originally configured in Log Analytics will be extended into Azure. If you don't want to wait for them to be automatically moved into Azure, you can initiate the process:

- Manually from the Operations Management Suite portal. 
- Programmatically by using the AlertsVersion API.  

> [!NOTE]
> Microsoft is currently automatically extending alerts created in Log Analytics to Azure alerts, in phases until completed. Microsoft schedules migrating the alerts to Azure, and during this transition, alerts can be managed from both the Operations Management Suite portal and the Azure portal. This process is not destructive or interruptive.  

## Option 1 - Initiate from the Operations Management Suite portal
The following steps describe how to extend alerts for the workspace from the Operations Management Suite portal.  

1. In the Azure portal, select **All services**. In the list of resources, type **Log Analytics**. As you begin typing, the list filters based on your input. Select **Log Analytics**.
2. In the Log Analytics subscriptions pane, select a workspace, and then select the **OMS Portal** tile.
![Screenshot of Log Analytics subscription pane, with OMS Portal tile highlighted](./media/monitor-alerts-extend/azure-portal-01.png) 
3. After you are redirected to the Operations Management Suite portal, select the **Settings** icon.
![Screenshot of Operations Management Suite portal, with Settings icon highlighted](./media/monitor-alerts-extend/oms-portal-settings-option.png) 
4. From the **Settings** page, select **Alerts**.  
5. Select **Extend into Azure**.
![Screenshot of Operations Management Suite portal Alert Settings page, with Extend into Azure highlighted](./media/monitor-alerts-extend/ExtendInto.png)
6. A three-step wizard appears in the **Alerts** pane. Read the overview, and select **Next**.
![Screenshot of step 1 of the wizard](./media/monitor-alerts-extend/ExtendStep1.png)  
7. In the second step, you see a summary of proposed changes, listing appropriate [action groups](monitoring-action-groups.md) for the alerts. If similar actions are seen across more than one alert, the wizard proposes to associate a single action group with all of them.  The naming convention is as follows: *WorkspaceName_AG_#Number*. To proceed, select **Next**.
![Screenshot of step 2 of the wizard](./media/monitor-alerts-extend/ExtendStep2.png)  
8. In the last step of wizard, select **Finish**, and confirm when prompted to initiate the process. Optionally, you can provide an email address, so that you are notified when the process completes and all alerts have been successfully moved to Azure Alerts.
![Screenshot of step 3 of the wizard](./media/monitor-alerts-extend/ExtendStep3.png)

When the wizard is finished, on the **Alert Settings** page, the option to extend alerts to Azure is removed. In the background, your alerts are moved into Azure, and this can take some time. During the operation, you are not able to make changes to alerts from the Operations Management Suite portal. You can see the current status from the banner at the top of the portal. If you provided an email address earlier, you receive an email when the process has successfully completed.  


Alerts continue to be listed in Operations Management Suite portal, even after they are successfully moved into Azure.
![Screenshot of Operations Management Suite portal Alert Settings page](./media/monitor-alerts-extend/PostExtendList.png)


## Option 2 - Use the AlertsVersion API
You can use the Log Analytics AlertsVersion API to extend alerts from Log Analytics into Azure Alerts from any client that can call a REST API. You can access the API from PowerShell by using [ARMClient](https://github.com/projectkudu/ARMClient), an open-source command-line tool. You can output the results in JSON.  

To use the API, you first create a GET request. This evaluates and returns a summary of the proposed changes, before you attempt to actually extend into Azure by using a POST request. The results list your alerts and a proposed list of [action groups](monitoring-action-groups.md), in JSON format. If similar actions are seen across more than one alert, the service proposes to associate all of them with a single action group. The naming convention is as follows: *WorkspaceName_AG_#Number*.

```
armclient GET  /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/alertsversion?api-version=2017-04-26-preview
```

If the GET request is successful, an HTTP status code 200 is returned, along with a list of alerts and proposed action groups in the JSON data. The following is an example response:

```json
{
    "version": 1,
    "migrationSummary": {
        "alertsCount": 2,
        "actionGroupsCount": 2,
        "alerts": [
            {
                "alertName": "DemoAlert_1",
                "alertId": " /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/savedSearches/<savedSearchId>/schedules/<scheduleId>/actions/<actionId>",
                "actionGroupName": "<workspaceName>_AG_1"
            },
            {
                "alertName": "DemoAlert_2",
                "alertId": " /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/savedSearches/<savedSearchId>/schedules/<scheduleId>/actions/<actionId>",
                "actionGroupName": "<workspaceName>_AG_2"
            }
        ],
        "actionGroups": [
            {
                "actionGroupName": "<workspaceName>_AG_1",
                "actionGroupResourceId": "/subscriptions/<subscriptionid>/resourceGroups/<resourceGroupName>/providers/microsoft.insights/actionGroups/<workspaceName>_AG_1",
                "actions": {
                    "emailIds": [
                        "JohnDoe@mail.com"
                    ],
                    "webhookActions": [
                        {
                            "name": "Webhook_1",
                            "serviceUri": "http://test.com"
                        }
                    ],
                    "itsmAction": {}
                }
            },
            {
                "actionGroupName": "<workspaceName>_AG_1",
                "actionGroupResourceId": "/subscriptions/<subscriptionid>/resourceGroups/<resourceGroupName>/providers/microsoft.insights/actionGroups/<workspaceName>_AG_1",
                 "actions": {
                    "emailIds": [
                        "test1@mail.com",
                          "test2@mail.com"
                    ],
                    "webhookActions": [],
                    "itsmAction": {
                        "connectionId": "<Guid>",
                        "templateInfo":"{\"PayloadRevision\":0,\"WorkItemType\":\"Incident\",\"UseTemplate\":false,\"WorkItemData\":\"{\\\"contact_type\\\":\\\"email\\\",\\\"impact\\\":\\\"3\\\",\\\"urgency\\\":\\\"2\\\",\\\"category\\\":\\\"request\\\",\\\"subcategory\\\":\\\"password\\\"}\",\"CreateOneWIPerCI\":false}"
                    }
                }
            }
        ]
    }
}

```
If the specified workspace does not have any alert rules defined, the JSON data returns the following:

```json
{
    "version": 1,
    "Message": "No Alerts found in the workspace for migration."
}
```

If all alert rules in the specified workspace have already been extended to Azure, the response to the GET request is:

```json
{
    "version": 2
}
```

To initiate migrating the alerts to Azure, initiate a POST response. The POST response confirms your intent, as well as acceptance, to have alerts extended from Log Analytics to Auzre Alerts. The activity is scheduled and the alerts are processed as indicated, based on the results when you performed the GET response earlier. Optionally, you can provide a list of email addresses to which Log Analytics sends a report when the scheduled background process of migrating the alerts completes successfully. You can use the following request example:

```
$emailJSON = “{‘Recipients’: [‘a@b.com’, ‘b@a.com’]}”
armclient POST  /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/alertsversion?api-version=2017-04-26-preview $emailJSON
```

> [!NOTE]
> The result of migrating alerts into Azure Alerts may vary based on the summary provided by GET response. Once scheduled, alerts in Log Analytics are temporarily unavailable for modification in the Operations Management Suite portal. However, you can create new alerts. 

If the POST request is successful, it returns an HTTP 200 OK status, along with the following response:

```json
{
    "version": 2
}
```

This response indicates the alerts have been successfully extended into Azure Alerts. The  version property is only for checking if alerts have been extended to Azure, and have no relation to the [Log Analytics Search API](../log-analytics/log-analytics-api-alerts.md). When the alerts are extended to Azure successfully, any email addresses provided with the POST request are sent a report. If all the alerts in the specified workspace are already scheduled to be extended, the response to your POST request is that the attempt was forbidden (a 403 status code). To view any error message or understand if the process is stuck, you can submit a GET request. If there is an error message, it is returned, along with the summary information.

```json
{
    "version": 1,
    "message": "OMS was unable to extend your alerts into Azure, Error: The subscription is not registered to use the namespace 'microsoft.insights'. OMS will schedule extending your alerts, once remediation steps illustrated in the troubleshooting guide are done.",
    "recipients": [
       "john.doe@email.com",
       "jane.doe@email.com"
     ],
    "migrationSummary": {
        "alertsCount": 2,
        "actionGroupsCount": 2,
        "alerts": [
            {
                "alertName": "DemoAlert_1",
                "alertId": " /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/savedSearches/<savedSearchId>/schedules/<scheduleId>/actions/<actionId>",
                "actionGroupName": "<workspaceName>_AG_1"
            },
            {
                "alertName": "DemoAlert_2",
                "alertId": " /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/savedSearches/<savedSearchId>/schedules/<scheduleId>/actions/<actionId>",
                "actionGroupName": "<workspaceName>_AG_2"
            }
        ],
        "actionGroups": [
            {
                "actionGroupName": "<workspaceName>_AG_1",
                "actionGroupResourceId": "/subscriptions/<subscriptionid>/resourceGroups/<resourceGroupName>/providers/microsoft.insights/actionGroups/<workspaceName>_AG_1",
                "actions": {
                    "emailIds": [
                        "JohnDoe@mail.com"
                    ],
                    "webhookActions": [
                        {
                            "name": "Webhook_1",
                            "serviceUri": "http://test.com"
                        }
                    ],
                    "itsmAction": {}
                }
            },
            {
                "actionGroupName": "<workspaceName>_AG_1",
                "actionGroupResourceId": "/subscriptions/<subscriptionid>/resourceGroups/<resourceGroupName>/providers/microsoft.insights/actionGroups/<workspaceName>_AG_1",
                 "actions": {
                    "emailIds": [
                        "test1@mail.com",
                          "test2@mail.com"
                    ],
                    "webhookActions": [],
                    "itsmAction": {
                        "connectionId": "<Guid>",
                        "templateInfo":"{\"PayloadRevision\":0,\"WorkItemType\":\"Incident\",\"UseTemplate\":false,\"WorkItemData\":\"{\\\"contact_type\\\":\\\"email\\\",\\\"impact\\\":\\\"3\\\",\\\"urgency\\\":\\\"2\\\",\\\"category\\\":\\\"request\\\",\\\"subcategory\\\":\\\"password\\\"}\",\"CreateOneWIPerCI\":false}"
                    }
                }
            }
        ]
    }
}              

```


## Option 3 - Use a custom PowerShell script
 After May 14, 2018 - if Microsoft has not successfully extended your alerts from OMS portal to Azure; then until **July 5, 2018** - user can manually do the same via [Option1 - Via GUI](#option-1---initiate-from-the-oms-portal) or [Option 2 - Via API](#option-2---using-the-alertsversion-api).

After **July 5, 2018** - all alerts from OMS portal will be extended into Azure. Users who didn't take the [necessary remediation steps suggested](#troubleshooting), will have their alerts running without firing actions or notifications due to the lack of associated [Action Groups](monitoring-action-groups.md). 

To manually create [Action Groups](monitoring-action-groups.md) for alerts in Log Analytics, users can use the sample script below.
```PowerShell
########## Input Parameters Begin ###########


$subscriptionId = ""
$resourceGroup = ""
$workspaceName = "" 


########## Input Parameters End ###########

armclient login

try
{
    $workspace = armclient get /subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.OperationalInsights/workspaces/"$workspaceName"?api-version=2015-03-20 | ConvertFrom-Json
    $workspaceId = $workspace.properties.customerId
    $resourceLocation = $workspace.location
}
catch
{
    "Please enter valid input parameters i.e. Subscription Id, Resource Group and Workspace Name !!"
    exit
}

# Get Extend Summary of the Alerts
"`nGetting Extend Summary of Alerts for the workspace...`n"
try
{

    $value = armclient get /subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.OperationalInsights/workspaces/$workspaceName/alertsversion?api-version=2017-04-26-preview

    "Extend preview summary"
    "=========================`n"

    $value

    $result = $value | ConvertFrom-Json
}
catch
{

    $ErrorMessage = $_.Exception.Message
    "Error occured while fetching/parsing Extend summary: $ErrorMessage"
    exit 
}

if ($result.version -eq 2)
{
    "`nThe alerts in this workspace have already been extended to Azure."
    exit
}

$in = Read-Host -Prompt "`nDo you want to continue extending the alerts to Azure? (Y/N)"

if ($in.ToLower() -ne "y")
{
    exit
} 


# Check for resource provider registration
try
{
    $val = armclient get subscriptions/$subscriptionId/providers/microsoft.insights/?api-version=2017-05-10 | ConvertFrom-Json
    if ($val.registrationState -eq "NotRegistered")
    {
        $val = armclient post subscriptions/$subscriptionId/providers/microsoft.insights/register/?api-version=2017-05-10
    }
}
catch
{
    "`nThe user does not have required access to register the resource provider. Please try with user having Contributor/Owner role in the subscription"
    exit
}

$actionGroupsMap = @{}
try
{
    "`nCreating new action groups for alerts extension...`n"
    foreach ($actionGroup in $result.migrationSummary.actionGroups)
    {
        $actionGroupName = $actionGroup.actionGroupName
        $actions = $actionGroup.actions
        if ($actionGroupsMap.ContainsKey($actionGroupName))
        {
            continue
        } 
        
        # Create action group payload
        $shortName = $actionGroupName.Substring($actionGroupName.LastIndexOf("AG_"))
        $properties = @{"groupShortName"= $shortName; "enabled" = $true}
        $emailReceivers = New-Object Object[] $actions.emailIds.Count
        $webhookReceivers = New-Object Object[] $actions.webhookActions.Count
        
        $count = 0
        foreach ($email in $actions.emailIds)
        {
            $emailReceivers[$count] = @{"name" = "Email$($count+1)"; "emailAddress" = "$email"}
            $count++
        }

        $count = 0
        foreach ($webhook in $actions.webhookActions)
        {
            $webhookReceivers[$count] = @{"name" = "$($webhook.name)"; "serviceUri" = "$($webhook.serviceUri)"}
            $count++
        }

        $itsmAction = $actions.itsmAction
        if ($itsmAction.connectionId -ne $null)
        {
            $val = @{
            "name" = "ITSM"
            "workspaceId" = "$subscriptionId|$workspaceId"
            "connectionId" = "$($itsmAction.connectionId)"
            "ticketConfiguration" = $itsmAction.templateInfo
            "region" = "$resourceLocation"
            }
            $properties["itsmReceivers"] = @($val)  
        }

        $properties["emailReceivers"] = @($emailReceivers)
        $properties["webhookReceivers"] = @($webhookReceivers)
        $armPayload = @{"properties" = $properties; "location" = "Global"} | ConvertTo-Json -Compress -Depth 4

    
        # ARM call to create action group
        $response = $armPayload | armclient put /subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.insights/actionGroups/$actionGroupName/?api-version=2017-04-01

        "Created Action Group with name $actionGroupName" 
        $actionGroupsMap[$actionGroupName] = $actionGroup.actionGroupResourceId.ToLower()
        $index++
    }

    "`nSuccessfully created all action groups!!"
}
catch
{
    $ErrorMessage = $_.Exception.Message

    #Delete all action groups in case of failure
    "`nDeleting newly created action groups if any as some error happened..."
    
    foreach ($actionGroup in $actionGroupsMap.Keys)
    {
        $response = armclient delete /subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.insights/actionGroups/$actionGroup/?api-version=2017-04-01      
    }

    "`nError: $ErrorMessage"
    "`nExiting..."
    exit
}

# Update all alerts configuration to the new version
"`nExtending OMS alerts to Azure...`n"

try
{
    $index = 1
    foreach ($alert in $result.migrationSummary.alerts)
    {
        $uri = $alert.alertId + "?api-version=2015-03-20"
        $config = armclient get $uri | ConvertFrom-Json
        $aznsNotification = @{
            "GroupIds" = @($actionGroupsMap[$alert.actionGroupName])
        }
        if ($alert.customWebhookPayload)
        {
            $aznsNotification.Add("CustomWebhookPayload", $alert.customWebhookPayload)
        }
        if ($alert.customEmailSubject)
        {
            $aznsNotification.Add("CustomEmailSubject", $alert.customEmailSubject)
        }      

        # Update alert version
        $config.properties.Version = 2

        $config.properties | Add-Member -MemberType NoteProperty -Name "AzNsNotification" -Value $aznsNotification
        $payload = $config | ConvertTo-Json -Depth 4
        $response = $payload | armclient put $uri
    
        "Extended alert with name $($alert.alertName)"
        $index++
    }
}
catch
{
    $ErrorMessage = $_.Exception.Message   
    if ($index -eq 1)
    {
        "`nDeleting all newly created action groups as no alerts got extended..."
        foreach ($actionGroup in $actionGroupsMap.Keys)
        {
            $response = armclient delete /subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.insights/actionGroups/$actionGroup/?api-version=2017-04-01      
        }
        "`nDeleted all action groups."  
    }
    
    "`nError: $ErrorMessage"
    "`nPlease resolve the issue and try extending again!!"
    "`nExiting..."
    exit
}

"`nSuccessfully extended all OMS alerts to Azure!!" 

# Update version of workspace to indicate extension
"`nUpdating alert version information in OMS workspace..." 

$response = armclient post "/subscriptions/$subscriptionId/resourceGroups/$resourceGroup/providers/Microsoft.OperationalInsights/workspaces/$workspaceName/alertsversion?api-version=2017-04-26-preview&iversion=2"

"`nExtension complete!!"
```


**Using the custom PowerShell script** 
- Pre-requisite is the installation of [ARMclient](https://github.com/projectkudu/ARMClient), an open-source command-line tool that simplifies invoking the Azure Resource Manager API
- User running the said script must have Contributor or Owner role in the Azure Subscription
- The following are the parameters to be provided for the script:
    - $subscriptionId: The Azure Subscription ID associated with the OMS/LA Workspace
    - $resourceGroup: The Azure Resource Group where lies the OMS/LA Workspace
    - $workspaceName: The name of the OMS/LA Workspace

**Output of the custom PowerShell script**
The script is verbose and will output the steps as it executes. 
- It will display the  summary, which contains the information about the existing OMS/LA alerts in the workspace and the Azure action groups to be created for the actions associated with them. 
- User will be prompted to go ahead with the extension or exit after viewing the summary.
- If the user prompts to go ahead with extension, new Azure action groups will be created and all the existing alerts will be associated with them. 
- In the end, the script exits by displaying the message "Extension complete!." In case of any intermediate failures, subsequent errors will be displayed.

## Troubleshooting 
During the process of extending alerts from OMS into Azure, there can be occasional issue that prevents the system from creating necessary [Action Groups](monitoring-action-groups.md). In such cases an error message will be shown in OMS portal via banner in Alert section and in GET call done to API.

> [!WARNING]
> If user doesn't take the precribed remediation steps provided below, before **July 5, 2018** - then alerts will run in Azure but without firing any action or notification. To get notifications for alerts, users must manually edit and add [Action Groups](monitoring-action-groups.md) or use the [custom PowerShell script](#option-3---using-custom-powershell-script) provided above.

Listed below are the remediation steps for each error:
1. **Error: Scope Lock is present at subscription/resource group level for write operations**:
    ![OMS portal Alert Settings page with ScopeLock Error message](./media/monitor-alerts-extend/ErrorScopeLock.png)

    a. When Scope Lock is enabled, restricting any new change in subscription or resource group containing the Log Analytics (OMS) workspace; the system is unable to extend (copy) alerts into Azure and create necessary action groups.
    
    b. To resolve, delete the *ReadOnly* lock on your subscription or resource group containing the workspace; using Azure portal, Powershell, Azure CLI, or API. To learn more, view the article on [resource lock usage](../azure-resource-manager/resource-group-lock-resources.md). 
    
    c. Once resolved as per steps illustrated in the article, OMS will extend your alerts into Azure within the next day's scheduled run; without the need of any action or initiation.

2. **Error: Policy is present at subscription/resource group level**: 
    ![OMS portal Alert Settings page with Policy Error message](./media/monitor-alerts-extend/ErrorPolicy.png)

    a. When [Azure Policy](../azure-policy/azure-policy-introduction.md) is applied, restricting any new resource in subscription or resource group containing the Log Analytics (OMS) workspace; the system is unable to extend (copy) alerts into Azure and create necessary action groups.
    
    b. To resolve, edit the policy causing *[RequestDisallowedByPolicy](../azure-resource-manager/resource-manager-policy-requestdisallowedbypolicy-error.md)* error, which prevents creation of new resources on your subscription or resource group containing the workspace. Using Azure portal, Powershell, Azure CLI or API; you can audit actions to find the appropriate policy causing failure. To learn more, view the article on [viewing activity logs to audit actions](../azure-resource-manager/resource-group-audit.md). 
    
    c. Once resolved as per steps illustrated in the article, OMS will extend your alerts into Azure within the next day's scheduled run; without the need of any action or initiation.


## Next steps

* Learn more about the new [Azure alerts experience](monitoring-overview-unified-alerts.md).
* Learn about [log alerts in Azure Alerts](monitor-alerts-unified-log.md).
