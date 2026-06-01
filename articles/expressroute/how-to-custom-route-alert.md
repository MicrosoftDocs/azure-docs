---
title: 'Configure custom alerts to monitor advertised routes - Azure ExpressRoute'
description: This article shows you how to use Azure Automation and Logic Apps to monitor the number of routes advertised from the ExpressRoute gateway to on-premises networks.
author: duongau
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 03/11/2026
ms.author: duau
ms.custom:
  - devx-track-azurepowershell
  - sfi-image-nochange
# Customer intent: "As a network administrator, I want to configure custom alerts for advertised routes in ExpressRoute, so that I can proactively monitor and manage the number of network prefixes and avoid exceeding limits."
---

# Configure custom alerts to monitor advertised routes

This article shows you how to use Azure Automation and Logic Apps to constantly monitor the number of routes advertised from the ExpressRoute gateway to on-premises networks. Monitoring helps prevent hitting the 1,000 [routes limit](expressroute-faqs.md#how-many-prefixes-can-be-advertised-from-a-virtual-network-to-on-premises-on-expressroute-private-peering).

**Azure Automation** helps you automate the execution of a custom PowerShell script stored in a *runbook*. This article describes a configuration that uses a runbook with a PowerShell script. The script queries one or more ExpressRoute gateways and collects a dataset. The dataset includes the resource group, the ExpressRoute gateway name, and the number of network prefixes advertised from on-premises networks.

**Azure Logic Apps** schedules a custom workflow that calls the Azure Automation runbook. The workflow uses a job to run the runbook. After data collection runs, the Azure Logic Apps workflow classifies the data. Based on match criteria for the number of network prefixes, it sends an email if the count is greater or less than a predefined threshold.

### <a name="workflow"></a>Workflow

Setting up a custom alert involves three main steps:

1. Create an Automation account with a system-assigned managed identity and permissions.

2. Create and configure runbooks.

3. Create a logic app that starts the Automation Account and sends an alert email if the number is greater than a threshold (for example, 160).

## <a name="before"></a>Before you begin

Verify that you meet the following criteria before beginning your configuration:

* You have at least one ExpressRoute gateway in your deployment.

* You're familiar with [Azure Logic Apps](../logic-apps/logic-apps-overview.md).

* You're familiar with using Azure PowerShell. You need Azure PowerShell to collect the network prefixes in ExpressRoute gateway. For more information about Azure PowerShell, see the [Azure PowerShell documentation](/powershell/azure/).

### <a name="limitations"></a>Notes and limitations

* The custom alert discussed in this article provides better operation and control. It isn't a replacement for the native alerts in ExpressRoute.
* Data collection for ExpressRoute gateways runs in the background. Runtime can be longer than expected. To avoid job queuing, set up the workflow recurrence properly.
* Deployments by scripts or ARM templates can happen faster than the custom alert trigger. This speed difference can increase the number of network prefixes in an ExpressRoute gateway beyond the limit of 1,000 routes.

## <a name="accounts"></a>Create and configure accounts

When you create an Automation account in the Azure portal, you automatically create a system-assigned managed identity. Runbooks use this identity to authenticate and access Azure resources, replacing the retired **Run As** account.

To create an Automation account, you need privileges and permissions. For more information, see [Permissions required to create an Automation account](../automation/automation-create-standalone-account.md#permissions-required-to-create-an-automation-account).

### <a name="about"></a>1. Create an automation account

Create an Automation account. For instructions, see [Create an Azure Automation account](../automation/quickstarts/create-azure-automation-account-portal.md).

### <a name="about"></a>2. Assign the managed identity a role

By default, a system-assigned managed identity has no role assignments. Assign it the **Reader** role (or a least-privilege custom role) on the subscriptions or resource groups that contain your ExpressRoute gateways.

Use the following steps to assign a role to the managed identity:

1. Go to your Automation account. Under **Account Settings**, select **Identity**.

2. On the **System assigned** tab, confirm the status is **On**, and then select **Azure role assignments**.

3. Select **Add role assignment**, choose the appropriate **Scope**, **Subscription**, and **Resource group**, and then assign the **Reader** role.

## <a name="runbooks"></a>Create and configure runbooks

### <a name="install-modules"></a>1. Install modules

To run PowerShell cmdlets in Azure Automation runbooks, you need to install a few extra Az PowerShell modules. Use the following steps to install the modules:

1. Open your Azure Automation Account and go to **Modules**.

   :::image type="content" source="./media/custom-route-alert-portal/navigate-modules.png" alt-text="Navigate to modules":::

2. Search the Gallery and import the following modules: **Az.Accounts**, **Az.Network**, **Az.Automation**, and **Az.Profile**.

   :::image type="content" source="./media/custom-route-alert-portal/import-modules.png" alt-text="Search and import modules" lightbox="./media/custom-route-alert-portal/import-modules-expand.png":::
  
### <a name="create"></a>2. Create a runbook

1. To create your PowerShell runbook, go to your Automation Account. Under **Process Automation**, select the **Runbooks** tile, and then select **Create a runbook**.

2. Select **Create** to create the runbook.

3. Select the new runbook, and then select **Edit**.

   :::image type="content" source="./media/custom-route-alert-portal/edit-runbook.png" alt-text="Edit runbook":::

4. In **Edit**, paste the PowerShell script. You can modify and use the [Example script](#script) to monitor ExpressRoute gateways in one or more resource groups.

   In the example script, notice the following settings:

    * The array **$rgList** contains the list of resource groups with ExpressRoute gateways. You can customize the list of ExpressRoute gateways.
    * The variable **$thresholdNumRoutes** defines the threshold for the number of network prefixes advertised from an ExpressRoute gateway to the on-premises networks.

#### <a name="script"></a>Example script

```powershell
  ################# Input parameters #################
# Resource Group Name where the ExR GWs resides in
$rgList= @('ASH-Cust10-02','ASH-Cust30')  
$thresholdNumRoutes = 160
###################################################

# Ensures you do not inherit an AzContext in your runbook
Disable-AzContextAutosave -Scope Process | Out-Null

# Connect using the Automation account's system-assigned managed identity
Try {
    Connect-AzAccount -Identity
} Catch {
    Write-Error -Message $_.Exception
    throw $_.Exception
}

# Get the name of the Azure subscription
$subscriptionName=(Get-AzContext).Subscription.Name


$GtwList = @()
$results= @()

foreach ($rgName in $rgList)
{
## Collect all the ExpressRoute gateways in a Resource Group
$GtwList=Get-AzVirtualNetworkGateway -ResourceGroupName $rgName 

## For each ExpressRoute gateway, get the IP addresses of the BGP peers and collect the number of routes advertised 
foreach ($gw in $GtwList) {
  
  $peers = Get-AzVirtualNetworkGatewayBGPPeerStatus -VirtualNetworkGatewayName $gw.Name -ResourceGroupName $rgName


 if ($peers[0].State -eq 'Connected') {
   $routes1=$null
   $routes1 = Get-AzVirtualNetworkGatewayAdvertisedRoute -VirtualNetworkGatewayName $gw.Name -ResourceGroupName $rgName -Peer $peers[0].Neighbor
 }
  if ($peers[1].State -eq 'Connected') {
  
   $routes2=$null
   $routes2 = Get-AzVirtualNetworkGatewayAdvertisedRoute -VirtualNetworkGatewayName $gw.Name -ResourceGroupName $rgName -Peer $peers[1].Neighbor
 }
 
  $sampleTime=(Get-Date).ToString("dd-MM-yyyy HH:mm:ss")
  if ($routes1.Count -eq $routes2.Count)
  {
     
     if ($routes1.Count -lt $thresholdNumRoutes){
       $status='OK'
       $alertMsg='number of routes below threshold'
     } 
     else {
       $status='ALERT'
       $alertMsg='number of routes above threshold'
     }
  } 
  else
  {
     $status='WARNING'
     $alertMsg='check ER Gateway'
  }
  
  $obj = [psCustomObject]@{
            resourceGroup =$rgName
            nameGtw  = $gw.Name
            peer1 = $peers[0].Neighbor
            peer2 = $peers[1].Neighbor
            numRoutesPeer1=  $routes1.Count
            numRoutesPeer2=  $routes2.Count
            time=$sampleTime
            status=$status
            alertMessage = $alertMsg
        }
  $results += $obj
} ### end foreach gateways in each resource group
} ### end foreach resource group
$jsonResults= ConvertTo-Json $results -Depth 100
Write-Output  $jsonResults
 
 ```

### <a name="publish"></a>3. Save and publish the runbook

1. Select **Save** to save a draft copy of the runbook.
2. Select **Publish** to publish the runbook as the official version of the runbook in the automation account.

When you run the PowerShell script, it collects a list of values:
 
* Resource group

* ExpressRoute gateway name

* IP address of the first BGP peer (peer1)

* IP address of the second BGP peer (peer2)

* Number of network prefixes advertised from the ExpressRoute gateway to the first BGP peer (peer1)

* Number of network prefixes advertised from the ExpressRoute gateway to the second BGP peer (peer2)

* Timestamp

* Status, classified as:

  * `OK` if the number of routes is less than a threshold value
  * `ALERT` if the number of routes is above a threshold value
  * `WARNING` if the number of network prefixes advertised to the two BGP peers is different

* Alert message, for a verbose description of the status (`OK`, `ALERT`, `WARNING`)

The PowerShell script converts the collected information to JSON output. The runbook uses the PowerShell cmdlet [Write-Output](/powershell/module/Microsoft.PowerShell.Utility/Write-Output) to communicate information to the client through the output stream.

### <a name="validate"></a>4. Validate the runbook

After you create the runbook, validate it. Select **Start** and check the output and errors for the different job streams.

## <a name="logic"></a>Create and configure a logic app

Azure Logic Apps orchestrates the entire process of collection and actions. In the following sections, you build a workflow by using a logic app.

### Workflow

For this logic app, you build a workflow that regularly monitors ExpressRoute gateways. If new items exist, the workflow sends an email for each item. When you finish, your workflow looks like this example at a high level:

:::image type="content" source="./media/custom-route-alert-portal/logic-apps-workflow.png" alt-text="Logic Apps workflow":::

### 1. Create a logic app resource

In the Azure portal, create a Consumption logic app resource and then select the **Blank Logic App** template. For more information, see [Create an example Consumption logic app workflow](../logic-apps/quickstart-create-example-consumption-workflow.md).

:::image type="content" source="./media/custom-route-alert-portal/blank-template.png" alt-text="Blank template":::

### 2. Add a trigger

Every workflow starts with a trigger. A trigger fires when a specific event happens, or when a specific condition is met. Each time the trigger fires, Azure Logic Apps creates and runs a new workflow instance.

To regularly run a workflow that is based on a predefined time schedule, add the built-in **Recurrence** trigger to your workflow. In the search box, type **schedule**. Select the **Schedule** icon. From the Triggers list, select **Recurrence**.

In the Recurrence trigger, you can set the time zone and a recurrence for repeating that workflow. Together, the interval and frequency define the schedule for your workflow's trigger. To establish a reasonable minimum recurrence frequency, consider the following factors:

* The PowerShell script in the Automation runbook takes time to complete. The runtime depends on the number of ExpressRoute gateways to monitor. A too short recurrence frequency causes job queuing.

* The PowerShell script runs as a job in background. It doesn't start immediately; it runs after a variable delay.

* A too short recurrence frequency generates unneeded load on your Azure ExpressRoute gateways.

At the end of the workflow configuration, you can check the consistency of the recurrence frequency by running the workflow a few times, and then verifying the outcome in the **Runs history**.

### <a name="job"></a>3. Create a job

A logic app workflow accesses other apps, services, and the platform through connectors. The next step is to select a connector to access the Azure Automation account that you defined earlier.

1. In **Logic Apps Designer**, below **Recurrence**, select **New step**. Under **Choose an action** and the search box, select **All**.
2. In the search box, type **Azure Automation** and search. Select **Create job**. Use **Create job** to start the automation runbook that you created earlier.

3. Sign in by using a managed identity or service principal. To connect by using a managed identity, select **Connect with Managed Identity** and choose the managed identity associated with your Automation account.

4. On the **Create job** page, the managed identity should have the **Reader** role on the **Resource Group** hosting the automation account, and **Automation Job Operator** on the **Automation Account**. Additionally, verify that you added the **Runbook Name** as a new parameter.

### <a name="output"></a>4. Get the job output

1. Select **New step**. Search for *Azure Automation*. From the **Actions** list, select **Get job output**.

2. On **Get job output**, specify the required information to access the automation account. Select the **Subscription**, **Resource Group**, and **Automation Account** that you want to use. Select inside the **Job ID** box. When the **Dynamic content** list appears, select **Job ID**.

### <a name="parse"></a>5. Parse the JSON

The output from the 'Azure Automation Create job action' (previous steps) contains a JSON object. The built-in **Parse JSON** action creates user-friendly tokens from the properties and their values in JSON content. You can then use those properties in your workflow.

1. Add an action. Under the **Get job output ->action**, select **New step**.
2. In the **Choose an action** search box, type "parse json" to search for connectors that offer this action. Under the **Actions** list, select the **Parse JSON** action for the data operations that you want to use.

3. Select inside the **Content** box. When the **Dynamic content** list appears, select **Content**.

4. Parsing a JSON requires a schema. You can generate the schema by using the output of the Automation runbook. Open a new web browser session, run the Automation runbook, and grab the output. Return to the **Logic Apps Parse JSON Data Operations** action. At the bottom of the page, select **Use sample payload to generate schema**.

5. For **Enter or paste a sample JSON payload**, paste the output of the Automation runbook and select **Done**.

   :::image type="content" source="./media/custom-route-alert-portal/paste-payload.png" alt-text="Paste sample payload" lightbox="./media/custom-route-alert-portal/paste-payload-expand.png":::

6. A schema is automatically generated by parsing the JSON input payload.

### <a name="define-variable"></a>6. Define and initialize a variable

In this step of the workflow, you create a condition to send an alarm by email. For a flexible, custom formatting of an email body message, introduce an auxiliary variable in the workflow.

1. Under the **Get job output action**, select **New step**. In the search box, find and select **Variables**.

2. From the **Actions** list, select the **Initialize variable** action.

   :::image type="content" source="./media/custom-route-alert-portal/initialize-variables.png" alt-text="Initialize variables":::

3. Specify the name of the variable. For **Type**, select **String**. Assign the **Value** of the variable later in the workflow.

### <a name="cycles-json"></a>7. Create a "For each" action

Once the JSON is parsed, the **Parse JSON Data Operations** action stores the content in the *Body* output. To process the output, create a "For each" loop that repeats one or more actions on each item in the array.

1. Under **Initialize variable**, select **Add an action**. In the search box, type "for each" as your filter.

2. From the **Actions** list, select the action **For each - Control**.

3. Select in the **Select an output from previous steps** text box. When the **Dynamic content** list appears, select the **Body**, which is output from the parsed JSON.

4. For each element of JSON body, set a condition. From the action group, select **Control**.


5. In the **Actions** list, select **Condition-Control**. The Condition-Control is a control structure that compares the data in your workflow against specific values or fields. You can then specify different actions that run based on whether the data meets the condition.

6. In the root of **Condition** action, change the logic operation to **Or**.

7. Check the value for the number of network prefixes an ExpressRoute gateway advertises to the two BGP peers. The number of routes is available in `numRoutePeer1` and `numRoutePeer2` in **Dynamic content**. In the value box, type the value for `numRoutePeer1`.

8. To add another row to your condition, choose **Add -> Add row**. In the second box, from **Dynamic content**, select `numRoutePeer2`.

9. The logic condition is true when one of two dynamic variables, `numRoute1` or `numRoute2`, is greater than the threshold. In this example, the threshold is fixed to 800 (80% of max value of 1000 routes). You can change the threshold value to fit your requirements. For consistency, use the same value in the runbook PowerShell script.

10. Under **If true**, format and create the actions to send the alert by email. In **Choose an action**, search and select **Variables**.

11. In **Variables**, select **Add an action**. In the **Actions** list, select **Set variable**.

12. In **Name**, select the variable named **EmailBody** that you previously created. For **Value**, paste the HTML script required to format the alert email. Use the **Dynamic content** to include the values of JSON body. After configuring these settings, the variable **EmailBody** contains all the information related to the alert, in HTML format.

### <a name="email"></a>8. Add the Email connector

Logic Apps provides many email connectors. In this example, add an Outlook connector to send the alert by email. Under **Set variable**, select **Add an action**. In **Choose an action**, type "send email" in the search box.

1. Select **Office 365 Outlook**.

2. In the **Actions** list, select **Send an email(V2)**.

3. Sign in to create a connection to Office 365 Outlook.

4. In the **Body** field, select **Add dynamic content**. From the Dynamic content panel, add the variable **Emailbody**. Fill out the **Subject** and **To** fields.

5. The **Send an email (v2)** action completes the workflow setup.

   :::image type="content" source="./media/custom-route-alert-portal/send-email-v2.png" alt-text="Send email v2" lightbox="./media/custom-route-alert-portal/send-email-v2-expand.png":::

### <a name="validation"></a>9. Workflow validation

The final step is the workflow validation. In **Logic Apps Overview**, select **Run Trigger**. Select **Recurrence**. You can monitor and verify the workflow in the **Runs history**.

:::image type="content" source="./media/custom-route-alert-portal/trigger.png" alt-text="Run trigger":::

## Next steps

To learn more about how to customize the workflow, see [Azure Logic Apps](../logic-apps/logic-apps-overview.md).
