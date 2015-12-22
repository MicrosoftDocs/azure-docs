<properties 
   pageTitle="Runbook input parameters"
   description=" Runbook input parameters increase the flexibility of runbooks by allowing you to pass data to a runbook when it is started. This article describes different scenarios where input parameters are used in runbooks."
   services="automation"
   documentationCenter=""
   authors="SnehaGunda"
   manager="stevenka"
   editor="tysonn" />
<tags 
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="12/16/2015"
   ms.author="sngun"/>

# Runbook input parameters

Runbook input parameters increase the flexibility of runbooks by allowing you to pass data to a runbook when it is started. The parameters allow the runbook actions to be targeted for specific scenarios and environments. In this article we will walk you through different scenarios where input parameters are used in runbooks. 

## Configuring input parameters

Input parameters can be configured in PowerShell, PowerShell Workflow, and Graphical runbooks. A runbook can have multiple parameters with different data types, or no parameters at all. Input parameters can be mandatory or optional, and you can assign a default value for optional parameters. The input parameters configured for a runbook can have values assigned when you start a runbook through any of the methods available, this includes starting a runbook through the UI, webhooks, web service, or as a child runbook called inline in another runbook. 

## Configuring input parameters in PowerShell and PowerShell Workflow runbooks

PowerShell and [PowerShell workflow runbooks](automation-first-runbook-textual.md) in Azure Automation support input parameters that are defined using the following attributes:  

| **Property** | **Description** |
|:--- |:---|
| Type | Required. The data type expected for the parameter value. Any .Net type is valid. |
| Name | Required. The name of the parameter. This must be unique within the runbook, and can contain only letters, numbers, or underscore character, and must start with a letter. |
| Mandatory | Optional. Specifies whether a value must be provided for the parameter. If you set this to **$true**, then a value must be provided when the runbook is started. If you set this to **$false**, then a value is optional. |
| Default value | Optional.  Specifies a value that will be used for the parameter if a value is not passed in when the runbook is started. A default value can be set for any parameter and will automatically make the parameter optional regardless of the Mandatory setting. |

Windows PowerShell supports more attributes of input parameters than the ones listed here, such as validation, aliases, and parameter sets; however, Azure Automation currently supports only the list above. 

A parameter definition in PowerShell Workflow runbooks has the following general form, where multiple parameters are separated by comma.

```
     Param
     (
         [Parameter (Mandatory= $true/$false)]
         [Type] Name1 = <Default value>,

         [Parameter (Mandatory= $true/$false)]
         [Type] Name2 = <Default value>
     ) 
```

>[AZURE.NOTE] When defining parameters, if you don’t specify the **Mandatory** attribute, then by default, the parameter is considered optional. Also if you set a default value for a parameter in PowerShell workflow runbooks, then it will be treated by PowerShell as an optional parameter, irrespective of the **Mandatory** attribute value.

As an example, let’s configure the input parameters for a PowerShell Workflow runbook that outputs details about virtual machines – either a single VM or all VMs within a service. This runbook has two parameters: the name of virtual machine and the name of service as seen in the screenshot below.

![Automation PowerShell Workflow](media/automation-runbook-input-parameters/automation_01_PowerShellWorkflow.png)

In this parameter definition, the parameters **$VMName** and **$ServiceName** are simple parameters of type string; however, PowerShell and PowerShell Workflow runbooks support all simple types and complex types, like **object** or **PSCredential** for input parameters. 

If your runbook has an [object] type input parameter, then to pass in a value, use a PowerShell hashtable with (name,value) pairs. For example, if you have the following parameter in a runbook,

     [Parameter (Mandatory = $true)]
     [object] $FullName

Then you can pass the following value to the parameter: 

    @{"FirstName"="Joe";"MiddleName"="Bob";"LastName"="Smith"}


## Configuring input parameters in Graphical runbooks

To configure a graphical runbook with input parameters, let’s create a [Graphical runbook](automation-first-runbook-graphical.md) that outputs details about virtual machines – either a single VM or all VMs within a service. The runbook consists of two major activities:

* [**Add-AzureAccount**](https://msdn.microsoft.com/library/dn495128.aspx) to authenticate with Azure.
* [**Get-AzureVM**](https://msdn.microsoft.com/library/azure/dn495236.aspx) to get all the virtual machines.

You can use the [**Write-Output**](https://technet.microsoft.com/library/hh849921.aspx) activity to output the names of virtual machines. The activity **Get-AzureVM** will accept two parameters: the **virtual machine name** and the **service account name**. Since these parameters could require different values each time you start the runbook, you can add input parameters to your runbook. Here are the steps to add input parameters:

1. Select the graphical runbook from the **Runbooks** blade and [edit](automation-graphical-authoring-intro.md) it. 

2. From the **Edit** blade, click **Input and output** to open the **Input and Output** blade.

    ![Automation Graphical Runbook](media/automation-runbook-input-parameters/automation_02_GraphicalRunbook.png)

 
3. The **Input and Output** blade displays a list of input parameters defined for the runbook.  From this blade, you can either add a new input parameter or edit the configuration of an existing input parameter. To add a new parameter for the runbook, click **Add input** to open the “Runbook Input Parameter” blade where you can configure the following parameters:  

    | **Property** | **Description** |
    |:--- |:---|
    | Name | Required.  The name of the parameter. This must be unique within the runbook, and can contain only letters, numbers, or underscore character, and must start with a letter. |
    | Description | Optional. Description about the purpose of input parameter. |
    | Type | Optional. The data type expected for the parameter value. Supported parameter types are String, Int32, Int64, Decimal, Boolean, DateTime, and Object. If a data type is not selected, it defaults to String. |
    | Mandatory | Optional. Specifies whether a value must be provided for the parameter. If you choose **yes**, then a value must be provided when the runbook is started. If you choose **no**, then a value is not required when the runbook is started, and a default value may be set. |
    | Default Value | Optional. Specifies a value that will be used for the parameter if a value is not passed in when the runbook is started. A default value can be set for a parameter which is not mandatory. You can choose **Custom** to set a default value. This value is used unless another value is provided when the runbook is started. Choose **None** if you don’t want to provide any default value. |  

    ![AddNewInput](media/automation-runbook-input-parameters/automation_03_AddNewInput.png)

4. Create two parameters with the following properties that will be used by the **Get-AzureVM** activity:

    1. **Parameter1:** 
    Name – VMName,
    Type – String,
    Mandatory – No
	
    2. **Parameter2:** 
    Name – ServiceName,
    Type – String,
    Mandatory – No,
    Default Value – Custom,
    Custom default value – \<Name of the default service that contains the virtual machines>

5. Once you add the parameters, click **OK**.  You can now view them in the **Input and Output** blade. Click **OK** again and then **Save** and **Publish** your runbook. 

## Assigning values to Input parameters in runbooks

You can pass values to input parameters in runbooks in the following scenarios:

### Start a runbook and assign parameters

A runbook can be started many ways: Through the Azure portal UI, with a webhook, with the PowerShell cmdlets, REST API, and SDK. Below we discuss different methods to start a runbook and assign parameters. 

* **Start a published runbook through the Azure portal and assign parameters**

When you [start the runbook](automation-starting-a-runbook#starting-a-runbook-with-the-azure-portal.md), the **Start Runbook** blade opens where you can configure values for the parameters you just created.

![Start using Portal](media/automation-runbook-input-parameters/automation_04_StartRunbookUsingPortal.png)

In the label beneath the input textbox you can see attributes set for the parameter: mandatory or optional, the type, and any default value. In the help balloon next to the parameter name, you can see all the key information you need to make decisions about parameter input values. This includes if a parameter is mandatory or optional, the type, any default value, and other helpful notes.

![Help Baloon](media/automation-runbook-input-parameters/automation_05_HelpBaloon.png)


>[AZURE.NOTE] String type parameters support **Empty** string values.  Entering **[EmptyString]** in the input parameter textbox will pass an empty string to the parameter. Also String type parameters don’t support **Null** values being passed. If you don’t pass any value to the string parameter, then PowerShell will interpret it as null. 

* **Start a published runbook using PowerShell cmdlets and assign parameters**

To start a runbook in Service Management model use Service management cmdlets and to start a runbook in Resource Manager deployment model use Resource manager cmdlets.  

    1. **Azure Service Management cmdlets:** You can start an automation runbook created in a default resource group using [Start-AzureAutomationRunbook](https://msdn.microsoft.com/library/dn690259.aspx)

    **Example:**

      ```
        $params = @{“VMName”=”WSVMClassic”; ”ServiceName”=”WSVMClassicSG”}

        Start-AzureAutomationRunbook -AutomationAccountName “TestAutomation” -Name “Get-AzureVMGraphical” -Parameters $params
      ```


    2. **Azure Resource Manager cmdlets:** You can start an Automation runbook created in a resource group using [Start-AzureRMAutomationRunbook](https://msdn.microsoft.com/library/mt603661.aspx)

    **Example:**

      ```
        $params = @{“VMName”=”WSVMClassic”;”ServiceName”=”WSVMClassicSG”}

        Start-AzureRMAutomationRunbook -AutomationAccountName “TestAutomationRG” -Name “Get-AzureVMGraphical” –ResourceGroupName “RG1” -Parameters $params
      ```

>[AZURE.NOTE] When you start a runbook using PowerShell cmdlets, along with the inputs parameters that you passed, a default parameter, **MicrosoftApplicationManagementStartedBy** is created with the value **PowerShell**. You can view this parameter in the Job details blade.

* **Start a runbook using the SDK and assign parameters**

    * **Azure Service Management method:** You can start a runbook using the SDK of a programming language. Below is a C# code snippet to start a runbook in your Automation account, you can view the full code at our [GitHub repository](https://github.com/Azure/azure-sdk-for-net/blob/master/src/ServiceManagement/Automation/Automation.Tests/TestSupport/AutomationTestBase.cs).  

    ```      
        public Job StartRunbook(string runbookName, IDictionary<string, string> parameters = null)
        {
            var response = AutomationClient.Jobs.Create(automationAccount, new JobCreateParameters
            {
                Properties = new JobCreateProperties 
                {
                    Runbook = new RunbookAssociationProperty
                    {
                        Name = runbookName
                    },
                        Parameters = parameters
                }
            });
            return response.Job;
        }
    ```
      
    * **Azure Resource Manager method:** You can start a runbook using the SDK of a programming language. Below is a C# code snippet to start a runbook in your Automation account, you can view the full code at our [GitHub repository](https://github.com/Azure/azure-sdk-for-net/blob/master/src/ResourceManagement/Automation/Automation.Tests/TestSupport/AutomationTestBase.cs).  

    ```
        public Job StartRunbook(string runbookName, IDictionary<string, string> parameters = null)
        {
           var response = AutomationClient.Jobs.Create(resourceGroup, automationAccount, new JobCreateParameters
           {
               Properties = new JobCreateProperties 
               {
                   Runbook = new RunbookAssociationProperty
                   {
                       Name = runbookName
                   },
                       Parameters = parameters
               }
           });
        return response.Job;
        }
    ```

To start this method, create a dictionary to store the runbook parameters, VMName and ServiceName, and their values, and start the runbook. Below is the C# code snippet to call the above defined method.

```
    IDictionary<string, string> RunbookParameters = new Dictionary<string, string>();

    // Add parameters to the dictionary.
    RunbookParameters.Add("VMName", "WSVMClassic");
    RunbookParameters.Add("ServiceName", "WSVMClassicSG");

    //Call the StartRunbook method with parameters
    StartRunbook(“Get-AzureVMGraphical”, RunbookParameters);
```

* **Start a runbook using the REST API and assign parameters**

A runbook job can be created and started with the Azure Automation REST API using the **PUT** method with the following request URI.

    https://management.core.windows.net/<subscription-id>/cloudServices/<cloud-service-name>/resources/automation/~/automationAccounts/<automation-account-name>/jobs/<job-id>?api-version=2014-12-08

In the Request URI, replace the following parameters:
 
    * **subscription-id:** Your Azure subscription ID.  
    * **cloud-service-name:** Name of the cloud service to which request should be sent.  
    * **automation-account-name:** Name of your automation account hosted within the specified cloud service.  
    * **job-id:** The GUID for the job. GUID in PowerShell can be created using **[GUID]::NewGuid().ToString()** cmdlet.
	
In order to pass parameters to the runbook job, use the request body, and it takes two properties provided in JSON format:

    a. **Runbook Name** – Required. Name of the runbook for the job to start.  
    b. **Runbook Parameters** – Optional. A dictionary of the parameter list in (name, value) format where name should be of String type and value can be any valid JSON value. 

If you want to start the **Get-AzureVMTextual** runbook created earlier with VMName and ServiceName as parameters, use the following JSON format for the request body. 

```
        {
           "properties":{
           "runbook":{
               "name":"Get-AzureVMTextual"
           },
           "parameters":{
               "VMName":"WSVMClassic",
               "ServiceName":”WSCS1”
           }
          }
       }
```

An HTTP status code 201 is returned if the job is successfully created, for more information on response headers and response body, please refer to [create a runbook job using REST API](https://msdn.microsoft.com/library/azure/mt163849.aspx).

### Test a runbook and assign parameters

When you [test](automation-testing-runbook.md) the draft version of your runbook using the test option, the **Test** blade opens where you can configure values for the parameters you just created. 

![Test And Assign Parameters](media/automation-runbook-input-parameters/automation_06_TestAndAssignParameters.png)

### Link a schedule to a runbook and assign parameters

You can [link a schedule](automation-scheduling-a-runbook.md) to your runbook to start at a specific time. Input parameters are assigned while creating the schedule, and the runbook will use these values when it is started by the schedule. You can’t save the schedule until all mandatory parameter values are provided.

![Schedule And Assign Parameters](media/automation-runbook-input-parameters/automation_07_ScheduleAndAssignParameters.png)

### Create a webhook for a runbook and assign parameters

You can create a [webhook](automation-webhooks.md) for your runbook and configure runbook input parameters. You can’t save the webhook until all mandatory parameter values are provided.

![Create Webhook and Assign parameters](media/automation-runbook-input-parameters/automation_08_CreateWebhookAndAssignParameters.png)

When you execute a runbook using webhook, a predefined input parameter **[Webhookdata](automation-webhooks.md#details-of-a-webhook)** is sent along with the input parameters that you defined. You can click to expand the WebhookData parameter for more details.

![WebhookData Parameter](media/automation-runbook-input-parameters/automation_09_WebhookDataParameter.png)


## Next Steps

- For more information on runbook input and output, see [Azure Automation: Runbook Input, Output, and Nested Runbooks](https://azure.microsoft.com/blog/azure-automation-runbook-input-output-and-nested-runbooks/)
- For details about different ways to start a runbook, see [Starting a runbook](automation-starting-a-runbook.md)
- To edit a textual runbook, refer to [Editing textual runbooks](automation-edit-textual-runbook.md)
- To edit a graphical runbook, refer to [Graphical authoring in Azure Automation](automation-graphical-authoring-intro.md)



