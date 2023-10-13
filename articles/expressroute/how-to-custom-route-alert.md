---
title: 'ExpressRoute: How to configure custom alerts for advertised routes'
description: This article shows you how to use Azure Automation and Logic Apps to monitor the number of routes advertised from the ExpressRoute gateway to on-premises networks in order to prevent hitting the 1000 routes limit.
services: expressroute
author: duongau

ms.service: expressroute
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 05/29/2020
ms.author: duau
---
# Configure custom alerts to monitor advertised routes

This article helps you use Azure Automation and Logic Apps to constantly monitor the number of routes advertised from the ExpressRoute gateway to on-premises networks. Monitoring can help prevent hitting the 1000 [routes limit](expressroute-faqs.md#how-many-prefixes-can-be-advertised-from-a-virtual-network-to-on-premises-on-expressroute-private-peering)

**Azure Automation** allows you to automate execution of custom PowerShell script stored in a *runbook*. When using the configuration in this article, the runbook contains a PowerShell script that queries one or more ExpressRoute gateways. It collects a dataset containing the resource group, ExpressRoute gateway name, and number of network prefixes advertised on-premises.

**Azure Logic Apps** schedules a custom workflow that calls the Azure Automation runbook. The execution of the runbook is done using a job. After data collection runs, the Azure Logic Apps workflow classifies the data and, based on match criteria on number of network prefixes above or below a predefine threshold, sends information to a destination email address.

### <a name="workflow"></a>Workflow

Setting up a custom alert is based on three main steps:

1. Create an Automation Account with a "Run As" account and permissions.

2. Create and configure runbooks.

3. Create a logic app that will fire the Automation Account and send an alerts e-mail if the number is greater than a threshold (for example, 160).

## <a name="before"></a>Before you begin

Verify that you have met the following criteria before beginning your configuration:

* You have at least one ExpressRoute gateway in your deployment.

* You are familiar with [Azure Logic Apps](../logic-apps/logic-apps-overview.md).

* You are familiar with using Azure PowerShell. Azure PowerShell is required to collect the network prefixes in ExpressRoute gateway. For more information about Azure PowerShell in general, see the [Azure PowerShell documentation](/powershell/azure/).

### <a name="limitations"></a>Notes and limitations

* The custom alert discussed in this article is an add-on to achieve better operation and control. It is not a replacement for the native alerts in ExpressRoute.
* Data collection for ExpressRoute gateways runs in the background. Runtime can be longer than expected. To avoid job queuing, the workflow recurrence must be set up properly.
* Deployments by scripts or ARM templates could happen faster than the custom alarm trigger. This could result in increasing in number of network prefixes in ExpressRoute gateway above the limit of 1000 routes.

## <a name="accounts"></a>Create and configure accounts

When you create an Automation account in the Azure portal, a Run As account is automatically created. This account takes following actions:

* Creates a Microsoft Entra application with a self-signed certificate. The Run As account itself has a certificate that needs to be renewed by default every year.

* Creates a service principal account for the application in Microsoft Entra ID.

* Assigns itself the Contributor role (Azure RBAC) on the Azure Subscription in use. This role manages Azure Resource Manager resources using runbooks.

In order to create an Automation account, you need privileges and permissions. For information, see [Permissions required to create an Automation account](../automation/automation-create-standalone-account.md#permissions-required-to-create-an-automation-account).

### <a name="about"></a>1. Create an automation account

Create an Automation account with run-as permissions. For instructions, see [Create an Azure Automation account](../automation/quickstarts/create-azure-automation-account-portal.md).

:::image type="content" source="./media/custom-route-alert-portal/create-account.png" alt-text="Add automation account" lightbox="./media/custom-route-alert-portal/create-account-expand.png":::

### <a name="about"></a>2. Assign the Run As account a role

By default, the **Contributor** role is assigned to the service principal that is used by your **Run As** account. You can keep the default role assigned to the service principal, or you can restrict permissions by assigning a [built-in role](../role-based-access-control/built-in-roles.md) (for example, Reader) or a [custom role](../active-directory/roles/custom-create.md).

 Use the following steps to determine the role assign to the service principal that is used by your Run As account:

1. Navigate to your Automation account. Navigate to **Account Settings**, then select **Run as accounts**.

2. Select **Roles** to view the role definition that is being used.

   :::image type="content" source="./media/custom-route-alert-portal/run-as-account-permissions.png" alt-text="Assign role":::

## <a name="runbooks"></a>Create and configure runbooks

### <a name="install-modules"></a>1. Install modules

In order to run PowerShell cmdlets in Azure Automation runbooks, you need to install a few additional Azure PowerShell Az modules. Use the following steps to install the modules:

1. Open your Azure Automation Account and navigate to **Modules**.

   :::image type="content" source="./media/custom-route-alert-portal/navigate-modules.png" alt-text="Navigate to modules":::

2. Search the Gallery and import the following modules: **Az.Accounts**, **Az.Network**, **Az.Automation**, and **Az.Profile**.

   :::image type="content" source="./media/custom-route-alert-portal/import-modules.png" alt-text="Search and import modules" lightbox="./media/custom-route-alert-portal/import-modules-expand.png":::
  
### <a name="create"></a>2. Create a runbook

1. To create your PowerShell runbook, navigate to your Automation Account. Under **Process Automation**, select the **Runbooks** tile, and then select **Create a runbook**.

   :::image type="content" source="./media/custom-route-alert-portal/create-runbook.png" alt-text="Create runbook.":::

2. Select **Create** to create the runbook.

   :::image type="content" source="./media/custom-route-alert-portal/create-runbook-2.png" alt-text="Select Create.":::

3. Select the newly created runbook, then select **Edit**.

   :::image type="content" source="./media/custom-route-alert-portal/edit-runbook.png" alt-text="Edit runbook":::

4. In **Edit**, paste the PowerShell script. The [Example script](#script) can be modified and used to monitor ExpressRoute gateways in one or more resource groups.

   In the example script, notice the following settings:

    * The array **$rgList** contains the list of resource groups with ExpressRoute gateways. You can customize the list-based ExpressRoute gateways.
    * The variable **$thresholdNumRoutes** define the threshold on the number of network prefixes advertised from an ExpressRoute gateway to the on-premises networks.

#### <a name="script"></a>Example script

```powershell
  ################# Input parameters #################
# Resource Group Name where the ExR GWs resides in
$rgList= @('ASH-Cust10-02','ASH-Cust30')  
$thresholdNumRoutes = 160
###################################################

# Ensures you do not inherit an AzContext in your runbook
Disable-AzContextAutosave -Scope Process | Out-Null

Try {

   $conn = Get-AutomationConnection -Name 'AzureRunAsConnection'
   while(!($connectionResult) -And ($logonAttempt -le 5))
   {
        $LogonAttempt++
        # Logging in to Azure...
        $connectionResult =  Connect-AzAccount `
                               -ServicePrincipal `
                               -ApplicationId $conn.ApplicationId `
                               -Tenant $conn.TenantId `
                               -CertificateThumbprint $conn.CertificateThumbprint `
                               -Subscription $conn.SubscriptionId `
                               -Environment AzureCloud 
                               
        Start-Sleep -Seconds 10
    }
} Catch {
    if (!$conn)
    {
        $ErrorMessage = "Service principal not found."
        throw $ErrorMessage
    } 
    else
    {
        Write-Error -Message $_.Exception
        throw $_.Exception
    }
}

# Get the name of the Azure subscription
$subscriptionName=(Get-AzSubscription -SubscriptionId $conn.SubscriptionId).Name

#write-Output "<br>$(Get-Date) - selection of the Azure subscription: $subscriptionName" 
Select-AzSubscription -SubscriptionId $conn.SubscriptionId | Out-Null


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

   :::image type="content" source="./media/custom-route-alert-portal/save-publish-runbook.png" alt-text="Save and publish the runbook.":::

When you run the PowerShell script, a list of values is collected:
 
* Resource group

* ExpressRoute gateway name

* IP address of the first BGP peer (peer1)

* IP address of the second BGP peer (peer2)

* Number of network prefixes advertised from the ExpressRoute gateway to the first BGP peer (peer1)

* Number of network prefixes advertised from the ExpressRoute gateway to the second BGP peer (peer2)

* Timestamp

* Status, classified as:

  * 'OK' if the number of routes is less than a threshold value
  * 'ALERT' if the number of routes if above a threshold value
  * 'WARNING' if the number of network prefixes advertised to the two BGP peer is different

* Alert message, for a verbose description of the status (OK, ALERT, WARNING)

The PowerShell script converts the collected information to a JSON output. The runbook uses the PowerShell cmdlet [Write-Output](/powershell/module/Microsoft.PowerShell.Utility/Write-Output)  as Output stream to communicate information to the client.

### <a name="validate"></a>4. Validate the runbook

Once the runbook is created, it must be validated. Select **Start** and check the output and errors for the different job streams.

:::image type="content" source="./media/custom-route-alert-portal/validate-runbook.png" alt-text="Validate the runbook" lightbox="./media/custom-route-alert-portal/validate-runbook-expand.png":::

## <a name="logic"></a>Create and configure a logic app

Azure Logic Apps is the orchestrator of all process of collection and actions. In the following sections, you build a workflow using a logic app.

### Workflow

For this logic app, you build a workflow that regularly monitors ExpressRoute gateways. If new items exist, the workflow sends an email for each item. When you're done, your workflow looks like this example at a high level:

:::image type="content" source="./media/custom-route-alert-portal/logic-apps-workflow.png" alt-text="Logic Apps workflow":::

### 1. Create a logic app resource

In the Azure portal, create a Consumption logic app resource and then select the **Blank Logic App** template. For more information, see [Create an example Consumption logic app workflow](../logic-apps/quickstart-create-example-consumption-workflow.md).

:::image type="content" source="./media/custom-route-alert-portal/blank-template.png" alt-text="Blank template":::

### 2. Add a trigger

Every workflow starts with a trigger. A trigger fires when a specific event happens, or when a specific condition is met. Each time the trigger fires, Azure Logic Apps creates and runs a new workflow instance.

To regularly run a workflow that is based on a predefined time schedule, add the built-in **Recurrence** trigger to your workflow. In the search box, type **schedule**. Select the **Schedule** icon. From the Triggers list, select **Recurrence**.

:::image type="content" source="./media/custom-route-alert-portal/schedule.png" alt-text="Recurrence: Schedule":::

In the Recurrence trigger, you can set the time zone and a recurrence for repeating that workflow. Together, the interval and frequency define the schedule for your workflow's trigger. To establish a reasonable minimum recurrence frequency, consider the following factors:

* The PowerShell script in the Automation runbook takes time to complete. The runtime depends on the number of ExpressRoute gateways to monitor. A too short recurrence frequency will cause job queuing.

* The PowerShell script runs as a job in background. It doesn’t start immediately; it runs after a variable delay.

* A too short recurrence frequency will generate unneeded load on your Azure ExpressRoute gateways.

At the end of the workflow configuration, you can check the consistency of the recurrence frequency by running the workflow a few times, and then verifying the outcome in the **Runs history**.

:::image type="content" source="./media/custom-route-alert-portal/recurrence.png" alt-text="Screenshot shows the Recurrence Interval and Frequency values." lightbox="./media/custom-route-alert-portal/recurrence-expand.png":::

### <a name="job"></a>3. Create a job

A logic app workflow accesses other apps, services, and the platform though connectors. The next step is to select a connector to access the Azure Automation account that was defined earlier.

1. In **Logic Apps Designer**, below **Recurrence**, select **New step**. Under **Choose an action** and the the search box, select **All**.
2. In the search box, type **Azure Automation** and search. Select **Create job**. **Create job** will be used to fire the automation runbook that was created earlier.

   :::image type="content" source="./media/custom-route-alert-portal/create-job.png" alt-text="Create job":::

3. Sign in using a service principal. You can use an existing service principal, or you can create a new one. To create a new service principal, see [How to use the portal to create a Microsoft Entra service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md). Select **Connect with Service Principal**.

   :::image type="content" source="./media/custom-route-alert-portal/sign-in.png" alt-text="Screenshot that shows the 'Recurrence' section with the 'Connect with Service Principal' action highlighted.":::

4. Type a **Connection Name**, add your **Client ID** (Application ID), **Client Secret**, and your **Tenant ID**. Then, select **Create**.

   :::image type="content" source="./media/custom-route-alert-portal/connect-service-principal.png" alt-text="Connect with service principal":::

5. On the **Create job** page, the service principal should have the "Reader" role on the **Resource Group** hosting the automation account, and "Automation Job Operator" on the **Automation Account**. Additionally, verify that you have added the **Runbook Name** as a new parameter.

   :::image type="content" source="./media/custom-route-alert-portal/roles.png" alt-text="Screenshot shows Create job values in Recurrence, where you can verify the Runbook Name." lightbox="./media/custom-route-alert-portal/roles-expand.png":::

### <a name="output"></a>4. Get the job output

1. Select **New step**. Search for "Azure Automation". From the **Actions** list, select **Get job output**.

   :::image type="content" source="./media/custom-route-alert-portal/get-output.png" alt-text="Get job output":::

2. On the **Get job output** page, specify the required information to access to the automation account. Select the **Subscription, Resource Group**, and **Automation Account** that you want to use. Click inside the **Job ID** box. When the **Dynamic content** list appears, select **Job ID**.

   :::image type="content" source="./media/custom-route-alert-portal/job-id.png" alt-text="Job ID" lightbox="./media/custom-route-alert-portal/job-id-expand.png":::

### <a name="parse"></a>5. Parse the JSON

The information contained in the output from the 'Azure Automation Create job action' (previous steps) generates a JSON object. The built-in **Parse JSON** action creates user-friendly tokens from the properties and their values in JSON content. You can then use those properties in your workflow.

1. Add an action. Under the **Get job output ->action**, select **New step**.
2. In the **Choose an action** search box, type "parse json" to search for connectors that offer this action. Under the **Actions** list, select the **Parse JSON** action for the data operations that you want to use.

   :::image type="content" source="./media/custom-route-alert-portal/parse-json.png" alt-text="Parse JSON":::

3. Click inside the **Content** box. When the Dynamic content list appears, select **Content**.

   :::image type="content" source="./media/custom-route-alert-portal/content.png" alt-text="Screenshot shows the Parse JSON dialog box with Content selected." lightbox="./media/custom-route-alert-portal/content-expand.png":::

4. Parsing a JSON requires a schema. The schema can be generated using the output of the Automation runbook. Open a new web browser session, run the Automation runbook and grab the output. Return to the **Logic Apps Parse JSON Data Operations** action. At the bottom of the page, select **Use sample payload to generate schema**.

   :::image type="content" source="./media/custom-route-alert-portal/sample-payload.png" alt-text="Use sample payload to generate schema":::

5. For **Enter or paste a sample JSON payload**, paste the output of the Automation runbook and select **Done**.

   :::image type="content" source="./media/custom-route-alert-portal/paste-payload.png" alt-text="Paste sample payload" lightbox="./media/custom-route-alert-portal/paste-payload-expand.png":::

6. A schema is automatically generated by parsing the JSON input payload.

   :::image type="content" source="./media/custom-route-alert-portal/generate-schema.png" alt-text="Generate schema" lightbox="./media/custom-route-alert-portal/generate-schema-expand.png":::

### <a name="define-variable"></a>6. Define and initialize a variable

In this step of the workflow, we create a condition to send an alarm by email. For a flexible, custom formatting of an email body message, an auxiliary variable is introduced in the workflow.

1. Under the **Get job output action**, select **New step**. In the search box, find and select **Variables**.

   :::image type="content" source="./media/custom-route-alert-portal/variables.png" alt-text="Screenshot shows the Choose an action dialog box with variable in the search box and Variables selected.":::

2. From the **Actions** list, select the **Initialize variable** action.

   :::image type="content" source="./media/custom-route-alert-portal/initialize-variables.png" alt-text="Initialize variables":::

3. Specify the name of the variable. For **Type**, select **String**. The **Value** of the variable will be assigned later in the workflow.

   :::image type="content" source="./media/custom-route-alert-portal/string.png" alt-text="Screenshot shows Parse JSON associated with Initialize variable, where you can enter a Name, Type, and Value." lightbox="./media/custom-route-alert-portal/string-expand.png":::

### <a name="cycles-json"></a>7. Create a "For each" action

Once the JSON is parsed, the **Parse JSON Data Operations** action stores the content in the *Body* output. To process the output, you can create a "For each" loop repeating one or more actions on each item in the array.

1. Under **Initialize variable**, select **Add an action**. In the search box, type "for each" as your filter.

   :::image type="content" source="./media/custom-route-alert-portal/control.png" alt-text="Screenshot shows the Choose an action dialog box with for each in the search box and Control selected.":::

2. From the **Actions** list, select the action **For each - Control**.

   :::image type="content" source="./media/custom-route-alert-portal/for-each.png" alt-text="For each- Control":::

3. Click in the **Select an output from previous steps** text box. When the **Dynamic content** list appears, select the **Body**, which is output from the parsed JSON.

   :::image type="content" source="./media/custom-route-alert-portal/body.png" alt-text="Screenshot shows Initialized variable associated with For each, which contains the Select an output from previous steps text box.":::

4. For each element of JSON body, we want to set a condition. From the action group, select **Control**.

   :::image type="content" source="./media/custom-route-alert-portal/condition-control.png" alt-text="Control":::

5. In the **Actions** list, select **Condition-Control**. The Condition-Control is a control structure compares the data in your workflow against specific values or fields. You can then specify different actions that run based on whether or not, the data meets the condition.

   :::image type="content" source="./media/custom-route-alert-portal/condition.png" alt-text="Condition Control":::

6. In the root of **Condition** action, change the logic operation to **Or**.

   :::image type="content" source="./media/custom-route-alert-portal/condition-or.png" alt-text="Or" lightbox="./media/custom-route-alert-portal/condition-or-expand.png":::

7. Check the value for the number of network prefixes an ExpressRoute gateway advertises to the two BGP peers. The number of routes is available in "numRoutePeer1" and "numRoutePeer2" in **Dynamic content**. In the value box, type the value for **numRoutePeer1**.

   :::image type="content" source="./media/custom-route-alert-portal/peer-1.png" alt-text="numRoutesPeer1":::

8. To add another row to your condition, choose **Add -> Add row**. In the second box, from **Dynamic content**, select **numRoutePeer2**.

   :::image type="content" source="./media/custom-route-alert-portal/peer-2.png" alt-text="numRoutesPeer2":::

9. The logic condition is true when one of two dynamic variables, numRoute1 or numRoute2, is greater than the threshold. In this example, the threshold is fixed to 800 (80% of max value of 1000 routes). You can change the threshold value to fit your requirements. For consistency, the value should be the same value used in the runbook PowerShell script.

   :::image type="content" source="./media/custom-route-alert-portal/logic-condition.png" alt-text="Logic condition":::

10. Under **If true**, format and create the actions to send the alert by email. In **Choose an action, search and select **Variables**.

    :::image type="content" source="./media/custom-route-alert-portal/condition-if-true.png" alt-text="If true":::

11. In Variables, select **Add an action**. In the **Actions** list,  select **Set variable**.

    :::image type="content" source="./media/custom-route-alert-portal/condition-set-variable.png" alt-text="Screenshot of the 'Variables' section with the 'Actions' tab selected and 'Set variable' highlighted.":::

12. In **Name**, select the variable named **EmailBody** that you previously created. For **Value**, paste the HTML script required to format the alert email. Use the **Dynamic content** to include the values of JSON body. After configuring these settings, the result is that the variable **Emailbody** contains all the information related to the alert, in HTML format.

    :::image type="content" source="./media/custom-route-alert-portal/paste-script.png" alt-text="Set variable":::

### <a name="email"></a>8. Add the Email connector

Logic Apps provides many email connectors. In this example, we add an Outlook connector to send the alert by email. Under **Set variable**, select **Add an action**. In **Choose an action**, type "send email" in the search box.

1. Select **Office 365 Outlook**.

   :::image type="content" source="./media/custom-route-alert-portal/email.png" alt-text="Send email":::

2. In the **Actions** list, select **Send an email(V2)**.

   :::image type="content" source="./media/custom-route-alert-portal/email-v2.png" alt-text="Send an email (V2)":::

3. Sign in to create a connection to Office 365 Outlook.

   :::image type="content" source="./media/custom-route-alert-portal/office-365.png" alt-text="Sign in":::

4. In the **Body** field, click **Add dynamic content**. From the Dynamic content panel, add the the variable **Emailbody**. Fill out the **Subject** and **To** fields.

   :::image type="content" source="./media/custom-route-alert-portal/emailbody.png" alt-text="Body":::

5. The **Send an email (v2)** action complete the workflow setup.

   :::image type="content" source="./media/custom-route-alert-portal/send-email-v2.png" alt-text="Send email v2" lightbox="./media/custom-route-alert-portal/send-email-v2-expand.png":::

### <a name="validation"></a>9. Workflow validation

The final step is the workflow validation. In **Logic Apps Overview**, select **Run Trigger**. Select **Recurrence**. The workflow can be monitored and verified in the **Runs history**.

:::image type="content" source="./media/custom-route-alert-portal/trigger.png" alt-text="Run trigger":::

## Next steps

To learn more about how to customize the workflow, see [Azure Logic Apps](../logic-apps/logic-apps-overview.md).
