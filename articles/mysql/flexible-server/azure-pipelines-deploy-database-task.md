---
title: Azure pipelines task for Azure Database for MySQL Flexible Server 
description: Enable  Azure Database for MySQL Flexible Server CLI  task for using with Azure Pipelines
ms.topic: how-to
ms.service: mysql
ms.custom: seodec18, devx-track-azurecli
ms.author: sumuth
author: mksuni
ms.date: 08/09/2021
---

# Azure pipelines for Azure Database for MySQL Flexible Server

You can automatically deploy your database updates to Azure Database for MySQL Flexible Server after every successful build with **Azure Pipelines**.  You can use Azure CLI task to update the database either with a SQL file or an inline SQL script against the database. This task  can be run on cross-platform agents running on Linux, macOS, or Windows operating systems.

## Prerequisites

- An Azure account. If you don't have one, [get a free trial](https://azure.microsoft.com/free/).

- [Azure Resource Manager service connection](https://docs.microsoft.com/azure/devops/pipelines/library/connect-to-azure?view=azure-devops) to your Azure account
- Microsoft hosted agents have Azure CLI pre-installed. However if you are using private agents, [install Azure CLI](/cli/azure/install-azure-cli) on the computer(s) that run the build and release agent. If an agent is already running on the machine on which the Azure CLI is installed, restart the agent to ensure all the relevant stage variables are updated.
  
This quickstart uses the resources created in either of these guides as a starting point:
- Create an Azure Database for MySQL Flexible Server using [Azure portal](./quickstart-create-server-portal.md) or  [Azure CLI](./quickstart-create-server-cli.md)


## Use SQL file

The following example illustrates how to pass database arguments and run ```execute``` command  

```yaml
- task: AzureCLI@2
  displayName: Azure CLI
  inputs:
    azureSubscription: <Name of the Azure Resource Manager service connection>
    scriptLocation: inlineScript
    arguments:
      -SERVERNAME mydemoserver `
      -DBNAME pollsdb `
      -DBUSER pollsdbuser`
      -DBPASSWORD pollsdbpassword
    inlineScript: |
      az login --allow-no-subscription
      az mysql flexible-server execute --name $(SERVERNAME) --admin-user $(DBUSER) --admin-password '$(DBPASSWORD)'  --database-name $(DBNAME) --file-path /code/sql/db-schema-update.sql
```

## Use inline SQL script

The following example illustrates how execute an inline script using ```execute```  command . 

```yaml
- task: AzureCLI@2
  displayName: Azure CLI
  inputs:
    azureSubscription: <Name of the Azure Resource Manager service connection>
    scriptLocation: inlineScript
    arguments:
      -SERVERNAME mydemoserver `
      -DBNAME pollsdb `
      -DBUSER pollsdbuser`
      -DBPASSWORD pollsdbpassword
      -INLINESCRIPT 
    inlineScript: |
      az login --allow-no-subscription
      az mysql flexible-server execute --name $(SERVERNAME) --admin-user $(DBUSER) --admin-password '$(DBPASSWORD)'  --database-name $(DBNAME) --query-text "UPDATE items SET items.retail = items.retail * 0.9 WHERE items.id =100;" 
```

## Task Inputs

You can see the full list of all the task inputs when using Azure CLI task with Azure pipelines. 

<table>
  <thead>
    <tr>
      <th>Parameters</th>
      <th>Description</th>
    </tr>
  </thead>
<tr>
    <td><code>azureSubscription</code><br/>Azure subscription</td>
    <td>(Required) Select an Azure Resource Manager subscription for the deployment. This parameter is shown only when the selected task version is 0.* as Azure CLI task v1.0 supports only Azure Resource Manager (ARM) subscriptions</td>
</tr>
<tr>
    <td><code>scriptType</code><br/>Script Type</td>
  <td>(Required) Type of script: <b>PowerShell</b>/<b>PowerShell Core</b>*/<b>Bat</b>/<b>Shell</b> script.</br>When running on a <b>Linux agent</b>, select one of the following:</br>
     <ul>
       <li><code>bash</code></li>
       <li><code>pscore</code></li>
    </ul>
    On a <b>Windows agent</b>, select one of the following:</br>
    <ul>
      <li><code>batch</code></li>
      <li><code>ps</code></li>
      <li><code>pscore</code></li>
    </ul></br><i>* PowerShell Core scripts can run on cross-platform agents (Linux, macOS, or Windows).</i>
   </td>
</tr>
<tr>
    <td><code>scriptLocation</code><br/>Script Location</td>
    <td>(Required) Path to script: File path or Inline script<br/>Default value: scriptPath</td>
</tr>
<tr>
    <td><code>scriptPath</code><br/>Script Path</td>
    <td>(Required) Fully qualified path of the script(.ps1 or .bat or .cmd when using Windows-based agent else <code>.ps1 </code> or <code>.sh </code> when using linux-based agent) or a path relative to the default working directory</td>
</tr>
<tr>
    <td><code>inlineScript</code><br/>Inline Script</td>
    <td>(Required) You can write your scripts inline here. When using Windows agent, use PowerShell or PowerShell Core or batch scripting whereas use PowerShell Core or shell scripting when using Linux-based agents. For batch files use the prefix \"call\" before every Azure command. You can also pass predefined and custom variables to this script using arguments. <br/><b>Example for PowerShell/PowerShellCore/shell:</b> az --version az account show <br/><b>Example for batch:</b> call az --version call az account show</td>
</tr>
<tr>
    <td><code>arguments</code><br/>Script Arguments</td>
    <td>(Optional) Arguments passed to the script</td>
</tr>
<tr>
    <td><code>powerShellErrorActionPreference</code><br/>ErrorActionPreference</td>
    <td>(Optional) Prepends the line <b>$ErrorActionPreference = 'VALUE'</b> at the top of your PowerShell/PowerShell Core script<br/>Default value: stop<br/>Options are stop, continue, and silentlyContinue</td>
</tr>
<tr>
    <td><code>addSpnToEnvironment</code><br/>Access service principal details in script</td>
    <td>(Optional) Adds service principal id and key of the Azure endpoint you chose to the script's execution environment. You can use these variables: <b>$env:servicePrincipalId, $env:servicePrincipalKey and $env:tenantId</b> in your script. This is honored only when the Azure endpoint has Service Principal authentication scheme<br/>Default value: false</td>
</tr>
<tr>
    <td><code>useGlobalConfig</code><br/>Use global Azure CLI configuration</td>
    <td>(Optional) If this is false, this task will use its own separate <a href= "/cli/azure/azure-cli-configuration?preserve-view=true&view=azure-cli-latest#cli-configuration-file">Azure CLI configuration directory</a>. This can be used to run Azure CLI tasks in <b>parallel</b> releases" <br/>Default value: false</td>
</tr>
<tr>
    <td><code>workingDirectory</code><br/>Working Directory</td>
    <td>(Optional) Current working directory where the script is run.  Empty is the root of the repo (build) or artifacts (release), which is $(System.DefaultWorkingDirectory)</td>
</tr>
<tr>
    <td><code>failOnStandardError</code><br/>Fail on Standard Error</td>
    <td>(Optional) If this is true, this task will fail when any errors are written to the StandardError stream. Unselect the checkbox to ignore standard errors and rely on exit codes to determine the status<br/>Default value: false</td>
</tr>
<tr>
    <td><code>powerShellIgnoreLASTEXITCODE</code><br/>Ignore $LASTEXITCODE</td>
    <td>(Optional) If this is false, the line <code>if ((Test-Path -LiteralPath variable:\\LASTEXITCODE)) { exit $LASTEXITCODE }</code> is appended to the end of your script. This will cause the last exit code from an external command to be propagated as the exit code of PowerShell. Otherwise the line is not appended to the end of your script<br/>Default value: false</td>
</tr>
</table>


Having issues with CLI Task , checkout how to [troubleshoot Build and Release](https://docs.microsoft.com/azure/devops/pipelines/troubleshooting/troubleshooting?view=azure-devops).

## Next Steps 
Here are some related tasks if you wish to deploy an azure resource group or an Azure Web App.

- [Azure Resource Group Deployment](https://docs.microsoft.com/azure/devops/pipelines/tasks/deploy/azure-resource-group-deployment?view=azure-devops)
- [Azure Web App Deployment](https://docs.microsoft.com/azure/devops/pipelines/tasks/deploy/azure-rm-web-app-deployment?view=azure-devops)

