---
title: Create a graphical runbook in Azure Automation
description: This article teaches you to create, test, and publish a graphical runbook in Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 07/16/2021
ms.topic: tutorial 
ms.custom: devx-track-azurepowershell
# Customer intent: As an administrator, I want to utilize Runbooks to automate certain aspects of my environment.
---

# Tutorial: Create a graphical runbook

This tutorial walks you through the creation of a [graphical runbook](../automation-runbook-types.md#graphical-runbooks) in Azure Automation. You can create and edit graphical PowerShell Workflow runbooks using the graphical editor in the Azure portal.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a simple graphical runbook
> * Test and publish the runbook
> * Run and track the status of the runbook job
> * Update the runbook to start an Azure virtual machine, with runbook parameters and conditional links

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* [Automation account](../index.yml) with an [Azure Run as account](../create-run-as-account.md) to hold the runbook and authenticate to Azure resources. This account must have permission to start and stop the virtual machine.
* PowerShell modules **Az.Accounts** and **Az.Compute** for the Automation Account. For more information, see [Manage modules in Azure Automation](../shared-resources/modules.md).
* An [Azure virtual machine](../../virtual-machines/windows/quick-create-portal.md) (VM). Since you stop and start this machine, it shouldn't be a production VM. Begin with the VM **stopped**.

## Create runbook

Start by creating a simple runbook that outputs the text `Hello World`.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the Azure portal, navigate to your Automation account.

1. Under **Process Automation**, select **Runbooks** to open the **Runbooks** page.

1. Select **Create a runbook** to open the **Create a runbook** page.

1. Name the runbook `MyFirstRunbook-Graphical`.

1. From the **Runbook type** drop-down menu, select **Graphical**.

   :::image type="content" source="../media/automation-tutorial-runbook-graphical/create-graphical-runbook.png" alt-text="Create a runbook input page.":::

1. Select **Create** to create the runbook and open the graphical editor, the **Edit Graphical Runbook** page.

## Add activities

The left-side of the editor is the **Library control**. The center is the **Canvas**. The right-side is the **Configuration control**. The **Library control**  allows you to select activities to add to your runbook. You're going to add a `Write-Output` cmdlet to output text from the runbook.

1. In the **Library control** search field, enter `Write-Output`.

    ![Microsoft.PowerShell.Utility](../media/automation-tutorial-runbook-graphical/search-powershell-cmdlet-writeoutput.png)

1. Scroll down to the bottom of the list. Right-click **Write-Output** and select **Add to canvas**. You could also select the ellipsis (...) next to the cmdlet name and then select **Add to canvas**.

1. From **Canvas**, select the **Write-Output** activity. This action populates the **Configuration control** page, which allows you to configure the activity.

1. From **Configuration control**, the **Label** field defaults to the name of the cmdlet, but you can change it to something more friendly. Change it to `Write Hello World to output`.

1. Select **Parameters** to provide values for the cmdlet's parameters.

   Some cmdlets have multiple parameter sets, and you need to select which one to use. In this case, `Write-Output` has only one parameter set.

1. From the **Activity Parameter Configuration** page, select the `INPUTOBJECT` parameter to open the **Parameter Value** page. You use this parameter to specify the text to send to the output stream.

1. The **Data source** drop-down menu provides sources that you can use to populate a parameter value. In this menu, select **PowerShell expression**.

   You can use output from such sources as another activity, an Automation asset, or a PowerShell expression. In this case, the output is just `Hello World`. You can use a PowerShell expression and specify a string.

1. In the **Expression** text box, enter `"Hello World"` and then select **OK** twice to return to the graphical editor.

1. Select **Save** to save the runbook.

## Test the runbook

Before you publish the runbook to make it available in production, you should test it to make sure that it works properly. Testing a runbook runs its Draft version and allows you to view its output interactively.

1. From the graphical editor, select **Test pane** to open the **Test** pane.

1. Select **Start** to start the test.

   A [runbook job](../automation-runbook-execution.md) is created and its status is displayed in the pane. The job status starts as `Queued`, indicating that the job is waiting for a runbook worker in the cloud to become available. The status changes to `Starting` when a worker claims the job. Finally, the status becomes `Running` when the runbook actually starts to run.

   When the runbook job completes, the Test pane displays its output. In this case, you see `Hello World`.

   :::image type="content" source="../media/automation-tutorial-runbook-graphical/runbook-test-results.png" alt-text="Hello World runbook output.":::

1. Select **X** in the top-right corner to close the **Test** pane and return to the graphical editor.

## Publish and start the runbook

The runbook that you've created is still in Draft mode and must be published before you can run it in production. When you publish a runbook, you overwrite the existing Published version with the Draft version.

1. From the graphical editor, select **Publish** to publish the runbook and then **Yes** when prompted. You're returned to the **Runbook** Overview page.

1. From the **Runbook** Overview page, the **Status** value is **Published**.

1. Select **Start** and then **Yes** when prompted to start the runbook and open the **Job** page.

   The options across the top allow you to: start the runbook now, schedule a future start time, or create a [webhook](../automation-webhooks.md) so that the runbook can be started through an HTTP call.

   :::image type="content" source="../media/automation-tutorial-runbook-graphical/published-status.png" alt-text="Overview page and published status.":::

1. From the **Job** page, verify that the **Status** field shows **Completed**.

1. Select **Output** to see `Hello World` displayed.

1. Select **All Logs** to view the streams for the runbook job and select the only entry to open the **Job stream details** page. You should only see `Hello World`.

    **All Logs** can show other streams for a runbook job, such as Verbose and Error streams, if the runbook writes to them.

1. Close the **Job stream details** page and then the **Job** page to return to the **Runbook** Overview page.

1. Under **Resources**, select **Jobs** to view all jobs for the runbook. The Jobs page lists all the jobs created by your runbook. You should see only one job listed, since you have only run the job once.

1. Select the job to open the same **Job** page that you viewed when you started the runbook.

1. Close the **Job** page, and then from the left menu, select **Overview**.

## Create variable assets

You've tested and published your runbook, but so far it doesn't do anything useful to manage Azure resources. Before configuring the runbook to authenticate, you must create a variable to hold the subscription ID, set up an activity to authenticate, and then reference the variable. Including a reference to the subscription context allows you to easily work with multiple subscriptions.

1. From **Overview**, select the **Copy to clipboard** icon next to **Subscription ID**.

1. Close the **Runbook** page to return to the **Automation Account** page.

1. Under **Shared Resources**, select **Variables**.

1. Select **Add a variable** to open the **New Variable** page.

1. On the **New Variable** page, set the following values:

    | Field| Value|
    |---|---|
    |Value|Press <kbd>CTRL+V</kbd> to paste in your subscription ID.|
    |Name |Enter `AzureSubscriptionId`.|
    |Type|Keep the default value, **String**.|
    |Encrypted|Keep the default value, **No**.|

1. Select **Create** to create the variable and return to the **Variables** page.

1. Under **Process Automation**, select **Runbooks** and then your runbook, **MyFirstRunbook-Graphical**.

## Add authentication

Now that you have a variable to hold the subscription ID, you can configure the runbook to authenticate with the Run As credentials for your subscription. Configure authentication by adding the Azure Run As connection as an asset. You also must add the [Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount) cmdlet and the [Set-AzContext](/powershell/module/az.accounts/Set-AzContext) cmdlet to the canvas.

> [!NOTE]
> For PowerShell runbooks, `Add-AzAccount` and `Add-AzureRMAccount` are aliases for `Connect-AzAccount`. These aliases are not available for your graphical runbooks. A graphical runbook can only use `Connect-AzAccount`.

1. From your **Runbook** page, select **Edit** to return to the graphical editor.

1. You don't need the `Write Hello World to output` activity anymore. Select the activity and an ellipsis will appear in the top-right corner of the activity. The ellipsis may be difficult to see. Select the ellipsis and then select **Delete**.

1. From **Library control**, navigate to **ASSETS** > **Connections** > **AzureRunAsConnection**. Select the  ellipsis and then select **Add to canvas**.

1. From **Configuration control**, change the **Label** value from `Get-AutomationConnection` to `Get Run As Connection`.

1. From the **Library control** search field, enter `Connect-AzAccount`.

1. Add `Connect-AzAccount` to the canvas, and drag the activity below `Get Run As Connection`.

1. Hover over `Get Run As Connection` until a circle appears on the bottom of the shape. Select and hold the circle and an arrow will appear. Drag the arrow to `Connect-AzAccount` to form a link. The runbook starts with `Get Run As Connection` and then runs `Connect-AzAccount`.

    ![Create link between activities](../media/automation-tutorial-runbook-graphical/runbook-link-auth-activities.png)

1. From **Canvas**, select `Connect-AzAccount`.

1. From **Configuration control**, change **Label** from `Connect-AzAccount` to `Login to Azure`.

1. Select **Parameters** to open the **Activity Parameter Configuration** page.

1. The `Connect-AzAccount` cmdlet has multiple parameter sets, and you need to select one before providing parameter values. Select **Parameter Set** and then select **ServicePrincipalCertificateWithSubscriptionId**. Be careful to not select **ServicePrincipalCertificateFileWithSubscriptionId**, as the names are similar

   The parameters for this parameter set are displayed on the **Activity Parameter Configuration** page.

    ![Add Azure account parameters](../media/automation-tutorial-runbook-graphical/Add-AzureRmAccount-params.png)

1. Select **CERTIFICATETHUMBPRINT** to open the **Parameter Value** page.
    1. From the **Data source** drop-down menu, select **Activity output**.
    1. From **Select data**, select **Get Run As Connection**.
    1. In the **Field path** text box, enter `CertificateThumbprint`.
    1. Select **OK** to return to the **Activity Parameter Configuration** page.

1. Select **SERVICEPRINCIPAL** to open the **Parameter Value** page.
    1. From the **Data source** drop-down menu, select **Constant value**.
    1. Select the option **True**.
    1. Select **OK** to return to the **Activity Parameter Configuration** page.

1. Select **TENANT** to open the **Parameter Value** page.
    1. From the **Data source** drop-down menu, select **Activity output**.
    1. From **Select data**, select **Get Run As Connection**.
    1. In the **Field path** text box, enter `TenantId`.
    1. Select **OK** to return to the **Activity Parameter Configuration** page.

1. Select **APPLICATIONID** to open the **Parameter Value** page.
    1. From the **Data source** drop-down menu, select **Activity output**.
    1. From **Select data**, select **Get Run As Connection**.
    1. In the **Field path** text box, enter `ApplicationId`.
    1. Select **OK** to return to the **Activity Parameter Configuration** page.

1. Select **OK** to return to the graphical editor.

1. From the **Library control** search field, enter `Set-AzContext`.

1. Add `Set-AzContext` to the canvas, and drag the activity below `Login to Azure`.

1. From **Configuration control**, change **Label** from `Set-AzContext` to `Specify Subscription Id`.

1. Select **Parameters** to open the **Activity Parameter Configuration** page.

1. The `Set-AzContext` cmdlet has multiple parameter sets, and you need to select one before providing parameter values. Select **Parameter Set** and then select **Subscription**. The parameters for this parameter set are displayed on the **Activity Parameter Configuration** page.

1. Select **SUBSCRIPTION** to open the **Parameter Value** page.
    1. From the **Data source** drop-down menu, select **Variable asset**.
    1. From the list of variables, select **AzureSubscriptionId**.
    1. Select **OK** to return to the **Activity Parameter Configuration** page.

1. Select **OK** to return to the graphical editor.

1. Form a link between  `Login to Azure` and `Specify Subscription Id`. Your runbook should look like the following at this point.

    :::image type="content" source="../media/automation-tutorial-runbook-graphical/runbook-auth-config.png" alt-text="Screenshot of the runbook after dragging the arrow to 'Specify Subscription ID'.":::

## Add activity to start a virtual machine

Now you must add a `Start-AzVM` activity to start a virtual machine. You can pick any VM in your Azure subscription, and for now you're hard-coding its name into the [Start-AzVM](/powershell/module/az.compute/start-azvm) cmdlet.

1. From the **Library control** search field, enter `Start-AzVM`.

1. Add `Start-AzVM` to the canvas, and drag the activity below `Specify Subscription Id`.

1. From **Configuration control**, select **Parameters** to open the **Activity Parameter Configuration** page.

1. Select **Parameter Set** and then select **ResourceGroupNameParameterSetName**. The parameters for this parameter set are displayed on the **Activity Parameter Configuration** page. The parameters **RESOURCEGROUPNAME** and **NAME** have exclamation marks next to them to indicate that they're required parameters. Both fields expect string values.

1. Select **RESOURCEGROUPNAME** to open the **Parameter Value** page.
    1. From the **Data source** drop-down menu, select **PowerShell expression**.
    1. In the **Expression** text box, enter the name of your resource group in double quotes.
    1. Select **OK** to return to the **Activity Parameter Configuration** page.

1. Select **NAME** to open the **Parameter Value** page.
    1. From the **Data source** drop-down menu, select **PowerShell expression**.
    1. In the **Expression** text box, enter the name of your virtual machine in double quotes.
    1. Select **OK** to return to the **Activity Parameter Configuration** page.

1. Select **OK** to return to the graphical editor.

1. Form a link between `Specify Subscription Id` and `Start-AzVM`. Your runbook should look like the following at this point.

    ![Runbook Start-AzVM output](../media/automation-tutorial-runbook-graphical/runbook-startvm.png)

1. Select **Test pane** so that you can test the runbook.

1. Select **Start** to begin the test.

1. Once it completes, make sure that the VM has started. Then stop the VM for later steps.

1. Return to the graphical editor for your runbook.

## Add input parameters

Your runbook currently starts the VM in the resource group that you specified for the `Start-AzVM` cmdlet. The runbook will be more useful if you specify both name and resource group when the runbook is started. Let's add input parameters to the runbook to provide that functionality.

1. From the graphical editor top menu bar, select **Input and output**.

1. Select **Add input** to open the **Runbook Input Parameter** page.

1. On the **Runbook Input Parameter** page, set the following values:

    | Field| Value|
    |---|---|
    |Name| Enter `VMName`.|
    |Type|Keep the default value, **String**.|
    |Mandatory|Change the value to **Yes**.|

1. Select **OK** to return to the **Input and Output** page

1. Select **Add input** to re-open the **Runbook Input Parameter** page.

1. On the **Runbook Input Parameter** page, set the following values:

    | Field| Value|
    |---|---|
    |Name| Enter `ResourceGroupName`.|
    |Type|Keep the default value, **String**.|
    |Mandatory|Change the value to **Yes**.|

1. Select **OK** to return to the **Input and Output** page. The page may look similar to the following:

    ![Runbook Input Parameters](../media/automation-tutorial-runbook-graphical/start-azurermvm-params-outputs.png)

1. Select **OK** to return to the graphical editor.

1. The new inputs may not be immediately available. Select **Save**, close the graphical editor, and then re-open the graphical editor. The new inputs should now be available.

1. Select the `Start-AzVM` activity and then select **Parameters** to open the **Activity Parameter Configuration** page.

1. For the previously configured parameter, **RESOURCEGROUPNAME**, change the **Data source** to **Runbook input**, and then select **ResourceGroupName**. Select **OK**.

1. For the previously configured parameter, **NAME**, change the **Data source** to **Runbook input**, and then select **VMName**. Select **OK**. The page may look similar to the following:

    ![Start-AzVM Parameters](../media/automation-tutorial-runbook-graphical/start-azurermvm-params-runbookinput.png)

1. Select **OK** to return to the graphical editor.

1. Select **Save** and then **Test pane**. Observe that you can now provide values for the two input variables you created.

1. Close the **Test** page to return to the graphical editor.

1. Select **Publish** and then **Yes** when you're prompted to publish the new version of the runbook. You're returned to the **Runbook** Overview page.

1. Select **Start** to open the **Start Runbook** page.

1. Enter appropriate values for the parameters `VMNAME` and `RESOURCEGROUPNAME`. Then select **OK**. The **Job** page then opens.

1. Monitor the job and verify the VM started after the **Status** turns to **Complete**. Then stop the VM for later steps.

1. Return to the graphical editor for your runbook.

## Create a conditional link

You can now modify the runbook so that it only attempts to start the VM if it's not already started. Do this by adding a [Get-AzVM](/powershell/module/Az.Compute/Get-AzVM) cmdlet that retrieves the instance-level status of the VM. Then you can add a PowerShell Workflow code module called `Get Status` with a snippet of PowerShell code to determine if the VM state is running or stopped. A conditional link from the `Get Status` module only runs `Start-AzVM` if the current running state is stopped. At the end of this procedure, your runbook uses the `Write-Output` cmdlet to output a message to inform you if the VM was successfully started.

1. From the graphical editor, right-click the link between `Specify Subscription Id` and `Start-AzVM` and select **Delete**.

1. From the **Library control** search field, enter `Get-AzVM`.

1. Add `Get-AzVM` to the canvas, and drag the activity below `Specify Subscription Id`.

1. From **Configuration control**, select **Parameters** to open the **Activity Parameter Configuration** page.

   Select **Parameter Set** and then select **GetVirtualMachineInResourceGroupParamSet**. The parameters for this parameter set are displayed on the **Activity Parameter Configuration** page. The parameters **RESOURCEGROUPNAME** and **NAME** have exclamation marks next to them to indicate that they're required parameters. Both fields expect string values.

1. Select **RESOURCEGROUPNAME** to open the **Parameter Value** page.
    1. From the **Data source** drop-down menu, select **Runbook input**.
    1. Select the parameter **ResourceGroupName**.
    1. Select **OK** to return to the **Activity Parameter Configuration** page.

1. Select **NAME** to open the **Parameter Value** page.
    1. From the **Data source** drop-down menu, select **Runbook input**.
    1. Select the parameter **VMName**.
    1. Select **OK** to return to the **Activity Parameter Configuration** page.

1. Select **STATUS** to open the **Parameter Value** page.
    1. From the **Data source** drop-down menu, select **Constant value**.
    1. Select the option **True**.
    1. Select **OK** to return to the **Activity Parameter Configuration** page.

1. Select **OK** to return to the graphical editor.

1. Form a link between `Specify Subscription Id` and `Get-AzVM`.

1. Clear the **Library control** search field, and then navigate to **RUNBOOK CONTROL** > **Code**. Select the ellipsis and then **Add to canvas**. Drag the activity below `Get-AzVM`.

1. From **Configuration control**, change **Label** from `Code` to `Get Status`.

1. From **Configuration control**, select **Code** to open the **Code Editor** page.

1. Paste the following code snippet into the **PowerShell code** text box.

    ```powershell
    $Statuses = $ActivityOutput['Get-AzVM'].Statuses
    $StatusOut = ""
    foreach ($Status in $Statuses) {
      if($Status.Code -eq "Powerstate/running")
        {$StatusOut = "running"}
      elseif ($Status.Code -eq "Powerstate/deallocated")
        {$StatusOut = "stopped"}
    }
    $StatusOut
    ```

1. Select **OK** to return to the graphical editor.

1. Form a link between `Get-AzVM` and `Get Status`.

1. Form a link between `Get Status` and `Start-AzVM`. Your runbook should look like the following at this point.

    ![Runbook with Code Module](../media/automation-tutorial-runbook-graphical/runbook-startvm-get-status.png)  

1. Select the link between `Get Status` and `Start-AzVM`.

1. From **Configuration control**, change **Apply condition** to **Yes**. The link becomes a dashed line, indicating that the target activity only runs if the condition resolves to true.  

1. For **Condition expression**, enter `$ActivityOutput['Get Status'] -eq "Stopped"`. `Start-AzVM` now only runs if the VM is stopped.

1. From the **Library control** search field, enter `Write-Output`.

1. Add `Write-Output` to the canvas, and drag the activity below `Start-AzVM`.

1. Select the activity ellipsis and select **Duplicate**. Drag the duplicate activity to the right of the first activity.

1. Select the first `Write-Output` activity.
    1. From **Configuration control**, change **Label** from `Write-Output` to `Notify VM Started`.
    1. Select **Parameters** to open the **Activity Parameter Configuration** page.
    1. Select **INPUTOBJECT** to open the **Parameter Value** page.
    1. From the **Data source** drop-down menu, select **PowerShell expression**.
    1. In the **Expression** text box, enter `"$VMName successfully started."`.
    1. Select **OK** to return to the **Activity Parameter Configuration** page.
    1. Select **OK** to return to the graphical editor.

1. Select the first `Write-Output1` activity.
    1. From **Configuration control**, change **Label** from `Write-Output1` to `Notify VM Start Failed`.
    1. Select **Parameters** to open the **Activity Parameter Configuration** page.
    1. Select **INPUTOBJECT** to open the **Parameter Value** page.
    1. From the **Data source** drop-down menu, select **PowerShell expression**.
    1. In the **Expression** text box, enter `"$VMName could not start."`.
    1. Select **OK** to return to the **Activity Parameter Configuration** page.
    1. Select **OK** to return to the graphical editor.

1. Form a link between `Start-AzVM` and `Notify VM Started`.

1. Form a link between `Start-AzVM` and `Notify VM Start Failed`.

1. Select the link to `Notify VM Started` and change **Apply condition** to **Yes**.

1. For the **Condition expression**, type `$ActivityOutput['Start-AzVM'].IsSuccessStatusCode -eq $true`. This `Write-Output` control now only runs if the VM starts successfully.

1. Select the link to `Notify VM Start Failed`.

1. From the **Control page**, for **Apply condition**, select **Yes**.

1. In the **Condition expression** text box, enter `$ActivityOutput['Start-AzVM'].IsSuccessStatusCode -ne $true`. This `Write-Output` control now only runs if the VM isn't successfully started. Your runbook should look like the following image.

    ![Runbook with Write-Output](../media/automation-tutorial-runbook-graphical/runbook-startazurermvm-complete.png)

1. Save the runbook and open the Test pane.

1. Start the runbook with the VM stopped, and the machine should start.

## Next steps

* To learn more about graphical authoring, see [Author a graphical runbook in Azure Automation](../automation-graphical-authoring-intro.md).
* To get started with PowerShell runbooks, see [Create a PowerShell runbook](automation-tutorial-runbook-textual-powershell.md).
* To get started with PowerShell Workflow runbooks, see [Create a PowerShell workflow runbook](automation-tutorial-runbook-textual.md).
* For a PowerShell cmdlet reference, see [Az.Automation](/powershell/module/az.automation).
