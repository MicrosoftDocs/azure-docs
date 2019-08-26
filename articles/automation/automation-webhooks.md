---
title: Starting an Azure Automation runbook with a webhook
description: A webhook that allows a client to start a runbook in Azure Automation from an HTTP call.  This article describes how to create a webhook and how to call one to start a runbook.
services: automation
ms.service: automation
ms.subservice: process-automation
author: bobbytreed
ms.author: robreed
ms.date: 03/19/2019
ms.topic: conceptual
manager: carmonm
---
# Starting an Azure Automation runbook with a webhook

A *webhook* allows you to start a particular runbook in Azure Automation through a single HTTP request. This allows external services such as Azure DevOps Services, GitHub, Azure Monitor logs, or custom applications to start runbooks without implementing a full solution using the Azure Automation API.  
![WebhooksOverview](media/automation-webhooks/webhook-overview-image.png)

You can compare webhooks to other methods of starting a runbook in [Starting a runbook in Azure Automation](automation-starting-a-runbook.md)

> [!NOTE]
> Using a webhook to start a Python runbook is not supported.

## Details of a webhook

The following table describes the properties that you must configure for a webhook.

| Property | Description |
|:--- |:--- |
| Name |You can provide any name you want for a webhook since this isn't exposed to the client. It's only used for you to identify the runbook in Azure Automation. <br> As a best practice, you should give the webhook a name related to the client that uses it. |
| URL |The URL of the webhook is the unique address that a client calls with an HTTP POST to start the runbook linked to the webhook. It's automatically generated when you create the webhook. You can't specify a custom URL. <br> <br> The URL contains a security token that allows the runbook to be invoked by a third-party system with no further authentication. For this reason, it should be treated like a password. For security reasons, you can only view the URL in the Azure portal at the time the webhook is created. Note the URL in a secure location for future use. |
| Expiration date |Like a certificate, each webhook has an expiration date at which time it can no longer be used. This expiration date can be modified after the webhook is created as long as the webhook isn't expired. |
| Enabled |A webhook is enabled by default when it's created. If you set it to Disabled, then no client can use it. You can set the **Enabled** property when you create the webhook or anytime once it's created. |

### Parameters

A webhook can define values for runbook parameters that are used when the runbook is started by that webhook. The webhook must include values for any mandatory parameters of the runbook and may include values for optional parameters. A parameter value configured to a webhook can be modified even after creating the webhook. Multiple webhooks linked to a single runbook can each use different parameter values.

When a client starts a runbook using a webhook, it can't override the parameter values defined in the webhook. To receive data from the client, the runbook can accept a single parameter called **$WebhookData**. This parameter is of a type [object] that contains data that the client includes in the POST request.

![Webhookdata properties](media/automation-webhooks/webhook-data-properties.png)

The **$WebhookData** object has the following properties:

| Property | Description |
|:--- |:--- |
| WebhookName |The name of the webhook. |
| RequestHeader |Hash table containing the headers of the incoming POST request. |
| RequestBody |The body of the incoming POST request. This retains any formatting such as string, JSON, XML, or form encoded data. The runbook must be written to work with the data format that is expected. |

There's no configuration of the webhook required to support the **$WebhookData** parameter, and the runbook isn't required to accept it. If the runbook doesn't define the parameter, then any details of the request sent from the client is ignored.

If you specify a value for $WebhookData when you create the webhook, that value is overridden when the webhook starts the runbook with the data from the client POST request, even if the client does not include any data in the request body. If you start a runbook that has $WebhookData using a method other than a webhook, you can provide a value for $Webhookdata that is recognized by the runbook. This value should be an object with the same [properties](#details-of-a-webhook) as $Webhookdata so that the runbook can properly work with it as if it was working with actual WebhookData passed by a webhook.

For example, if you are starting the following runbook from the Azure portal and want to pass some sample WebhookData for testing, since WebhookData is an object, it should be passed as JSON in the UI.

![WebhookData parameter from UI](media/automation-webhooks/WebhookData-parameter-from-UI.png)

For the following runbook, if you have the following properties for the WebhookData parameter:

* WebhookName: *MyWebhook*
* RequestBody: *[{'ResourceGroup': 'myResourceGroup','Name': 'vm01'},{'ResourceGroup': 'myResourceGroup','Name': 'vm02'}]*

Then you would pass the following JSON value in the UI for the WebhookData parameter. The following example with the carriage returns and newline characters matches the format that is passed in from a webhook.

```json
{"WebhookName":"mywebhook","RequestBody":"[\r\n {\r\n \"ResourceGroup\": \"vm01\",\r\n \"Name\": \"vm01\"\r\n },\r\n {\r\n \"ResourceGroup\": \"vm02\",\r\n \"Name\": \"vm02\"\r\n }\r\n]"}
```

![Start WebhookData parameter from UI](media/automation-webhooks/Start-WebhookData-parameter-from-UI.png)

> [!NOTE]
> The values of all input parameters are logged with the runbook job. This means that any input provided by the client in the webhook request will be logged and available to anyone with access to the automation job.  For this reason, you should be cautious about including sensitive information in webhook calls.

## Security

The security of a webhook relies on the privacy of its URL, which contains a security token that allows it to be invoked. Azure Automation does not perform any authentication on the request as long as it is made to the correct URL. For this reason, webhooks should not be used for runbooks that perform highly sensitive functions without using an alternate means of validating the request.

You can include logic within the runbook to determine that it was called by a webhook by checking the **WebhookName** property of the $WebhookData parameter. The runbook could perform further validation by looking for particular information in the **RequestHeader** or **RequestBody** properties.

Another strategy is to have the runbook perform some validation of an external condition when it received a webhook request. For example, consider a runbook that is called by GitHub whenever there's a new commit to a GitHub repository. The runbook might connect to GitHub to validate that a new commit had occurred before continuing.

## Creating a webhook

Use the following procedure to create a new webhook linked to a runbook in the Azure portal.

1. From the **Runbooks page** in the Azure portal, click the runbook that the webhook starts to view its detail page. Ensure the runbook **Status** is **Published**.
2. Click **Webhook** at the top of the page to open the **Add Webhook** page.
3. Click **Create new webhook** to open the **Create webhook page**.
4. Specify a **Name**, **Expiration Date** for the webhook and whether it should be enabled. See [Details of a webhook](#details-of-a-webhook) for more information these properties.
5. Click the copy icon and press Ctrl+C to copy the URL of the webhook. Then record it in a safe place. **Once you create the webhook, you cannot retrieve the URL again.**

   ![Webhook URL](media/automation-webhooks/copy-webhook-url.png)

1. Click **Parameters** to provide values for the runbook parameters. If the runbook has mandatory parameters, then you are not able to create the webhook unless values are provided.
1. Click **Create** to create the webhook.

## Using a webhook

To use a webhook after it has been created, your client application must issue an HTTP POST with the URL for the webhook. The syntax of the webhook is in the following format:

```http
http://<Webhook Server>/token?=<Token Value>
```

The client receives one of the following return codes from the POST request.

| Code | Text | Description |
|:--- |:--- |:--- |
| 202 |Accepted |The request was accepted, and the runbook was successfully queued. |
| 400 |Bad Request |The request was not accepted for one of the following reasons: <ul> <li>The webhook has expired.</li> <li>The webhook is disabled.</li> <li>The token in the URL is invalid.</li>  </ul> |
| 404 |Not Found |The request was not accepted for one of the following reasons: <ul> <li>The webhook was not found.</li> <li>The runbook was not found.</li> <li>The account was not found.</li>  </ul> |
| 500 |Internal Server Error |The URL was valid, but an error occurred. Please resubmit the request. |

Assuming the request is successful, the webhook response contains the job ID in JSON format as follows. It will contain a single job ID, but the JSON format allows for potential future enhancements.

```json
{"JobIds":["<JobId>"]}
```

The client can't determine when the runbook job completes or its completion status from the webhook. It can determine this information using the job ID with another method such as [Windows PowerShell](https://docs.microsoft.com/powershell/module/servicemanagement/azure/get-azureautomationjob) or the [Azure Automation API](/rest/api/automation/job).

## <a name="renew-webhook"></a>Renew a webhook

When a webhook is created, it has a validity time of one year. After that year time the webhook automatically expires. Once a webhook is expired it can't be reactivated, it must be removed and recreated. If a webhook has not reached its expiry time, it can be extended.

To extend a webhook, navigate to the runbook that contains the webhook. Select **Webhooks** under **Resources**. Click the webhook that you want to extend, this action opens the **Webhook** page.  Choose a new expiration date and time and click **Save**.

## Sample runbook

The following sample runbook accepts the webhook data and starts the virtual machines specified in the request body. To test this runbook, in your Automation Account under **Runbooks**, click **+ Add a runbook**. If you don't know how to create a runbook, see [Creating a runbook](automation-quickstart-create-runbook.md).

```powershell
param
(
    [Parameter (Mandatory = $false)]
    [object] $WebhookData
)



# If runbook was called from Webhook, WebhookData will not be null.
if ($WebhookData) {

    # Check header for message to validate request
    if ($WebhookData.RequestHeader.message -eq 'StartedbyContoso')
    {
        Write-Output "Header has required information"}
    else
    {
        Write-Output "Header missing required information";
        exit;
    }

    # Retrieve VM's from Webhook request body
    $vms = (ConvertFrom-Json -InputObject $WebhookData.RequestBody)

    # Authenticate to Azure by using the service principal and certificate. Then, set the subscription.

    Write-Output "Authenticating to Azure with service principal and certificate"
    $ConnectionAssetName = "AzureRunAsConnection"
    Write-Output "Get connection asset: $ConnectionAssetName"

    $Conn = Get-AutomationConnection -Name $ConnectionAssetName
            if ($Conn -eq $null)
            {
                throw "Could not retrieve connection asset: $ConnectionAssetName. Check that this asset exists in the Automation account."
            }
            Write-Output "Authenticating to Azure with service principal." 
            Add-AzureRmAccount -ServicePrincipal -Tenant $Conn.TenantID -ApplicationId $Conn.ApplicationID -CertificateThumbprint $Conn.CertificateThumbprint | Write-Output

        # Start each virtual machine
        foreach ($vm in $vms)
        {
            $vmName = $vm.Name
            Write-Output "Starting $vmName"
            Start-AzureRMVM -Name $vm.Name -ResourceGroup $vm.ResourceGroup
        }
}
else {
    # Error
    write-Error "This runbook is meant to be started from an Azure alert webhook only."
}
```

## Test the example

The following example uses Windows PowerShell to start a runbook with a webhook. Any language that can make an HTTP request can use a webhook; Windows PowerShell is used here as an example.

The runbook is expecting a list of virtual machines formatted in JSON in the body of the request. The runbook validates as well that the headers contain a defined message to validate the webhook caller is valid.

```azurepowershell-interactive
$uri = "<webHook Uri>"

$vms  = @(
            @{ Name="vm01";ResourceGroup="vm01"},
            @{ Name="vm02";ResourceGroup="vm02"}
        )
$body = ConvertTo-Json -InputObject $vms
$header = @{ message="StartedbyContoso"}
$response = Invoke-WebRequest -Method Post -Uri $uri -Body $body -Headers $header
$jobid = (ConvertFrom-Json ($response.Content)).jobids[0]
```

The following example shows the body of the request that is available to the runbook in the **RequestBody** property of **WebhookData**. This value is formatted as JSON because that was the format that was included in the body of the request.

```json
[
    {
        "Name":  "vm01",
        "ResourceGroup":  "myResourceGroup"
    },
    {
        "Name":  "vm02",
        "ResourceGroup":  "myResourceGroup"
    }
]
```

The following image shows the request being sent from Windows PowerShell and the resulting response. The job ID is extracted from the response and converted to a string.

![Webhooks button](media/automation-webhooks/webhook-request-response.png)

## Next steps

* To learn how to use Azure Automation to take action on Azure Alerts, see [Use an alert to trigger an Azure Automation runbook](automation-create-alert-triggered-runbook.md).

