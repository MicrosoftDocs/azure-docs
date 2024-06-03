---
title: Enable diagnostics settings by category group using built-in policies.
description: Use Azure builtin policies to create diagnostic settings in Azure Monitor.
author: EdB-MSFT
ms.author: edbaynash
services: azure-monitor
ms.topic: conceptual
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 02/25/2024
ms.reviewer: lualderm
--- 

# Built-in policies for Azure Monitor
Policies and policy initiatives provide a simple method to enable logging at-scale via diagnostics settings for Azure Monitor. Using a policy initiative, you can turn on audit logging for all [supported resources](#supported-resources) in your Azure environment.  

Enable resource logs to track activities and events that take place on your resources and give you visibility and insights into any changes that occur.
Assign policies to enable resource logs and to send them to destinations according to your needs. Send logs to event hubs for third-party SIEM systems, enabling continuous security operations. Send logs to storage accounts for longer term storage or the fulfillment of regulatory compliance. 

A set of built-in policies and initiatives exists to direct resource logs to Log Analytics Workspaces, Event Hubs, and Storage Accounts. The policies enable audit logging, sending logs belonging to the **audit** or the **All logs** log category group,  to an event hub, Log Analytics workspace or Storage Account. The policies' `effect` is `DeployIfNotExists`, which deploys the policy as a default if there aren't other settings defined.


## Deploy policies.
Deploy the policies and initiatives using the Portal, CLI, PowerShell, or Azure Resource Management templates
### [Azure portal](#tab/portal)

The following steps show how to apply the policy to send audit logs to for key vaults to a log analytics workspace.

1. From the Policy page, select **Definitions**.

1. Select your scope. You can apply a policy to the entire subscription, a resource group, or an individual resource.
1. From the **Definition type** dropdown, select **Policy**.
1. Select **Monitoring** from the Category dropdown
1. Enter *keyvault* in the **Search** field.
1. Select the **Enable logging by category group for Key vaults (microsoft.keyvault/vaults) to Log Analytics** policy,
    :::image type="content" source="./media/diagnostics-settings-policies-deployifnotexists/policy-definitions.png" lightbox="./media/diagnostics-settings-policies-deployifnotexists/policy-definitions.png" alt-text="A screenshot of the policy definitions page.":::
1. From the policy definition page, select **Assign**
1. Select the **Parameters** tab.
1. Select the Log Analytics Workspace that you want to send the audit logs to.
1. Select the **Remediation** tab.
 :::image type="content" source="./media/diagnostics-settings-policies-deployifnotexists/assign-policy-parameters.png" lightbox="./media/diagnostics-settings-policies-deployifnotexists/assign-policy-parameters.png" alt-text="A screenshot of the assign policy page, parameters tab.":::
1. On the remediation tab, select the keyvault policy from the **Policy to remediate** dropdown.
1. Select the **Create a Managed Identity** checkbox.
1. Under **Type of Managed Identity**, select **System assigned Managed Identity**.
1. Select **Review + create**, then select **Create** .
  :::image type="content" source="./media/diagnostics-settings-policies-deployifnotexists/assign-policy-remediation.png" lightbox="./media/diagnostics-settings-policies-deployifnotexists/assign-policy-remediation.png" alt-text="A screenshot of the assign policy page, remediation tab.":::


### [CLI](#tab/cli)
To apply a policy using the CLI, use the following commands:

1. Create a policy assignment using [`az policy assignment create`](/cli/azure/policy/assignment#az-policy-assignment-create).
    ```azurecli
      az policy assignment create --name <policy assignment name>  --policy "6b359d8f-f88d-4052-aa7c-32015963ecc1"  --scope <scope> --params "{\"logAnalytics\": {\"value\": \"<log analytics workspace resource ID"}}" --mi-system-assigned --location <location>
    ```
    For example, to apply the policy to send audit logs to a log analytics workspace

    ```azurecli
      az policy assignment create --name "policy-assignment-1"  --policy "6b359d8f-f88d-4052-aa7c-32015963ecc1"  --scope /subscriptions/12345678-aaaa-bbbb-cccc-1234567890ab/resourceGroups/rg-001 --params "{\"logAnalytics\": {\"value\": \"/subscriptions/12345678-aaaa-bbbb-cccc-1234567890ab/resourcegroups/rg-001/providers/microsoft.operationalinsights/workspaces/workspace-001\"}}" --mi-system-assigned --location eastus
    ```

1. Assign the required role to the identity created for the policy assignment.
Find the role in the policy definition by searching for *roleDefinitionIds*

    ```json
       ...},
          "roleDefinitionIds": [
            "/providers/Microsoft.Authorization/roleDefinitions/92aaf0da-9dab-42b6-94a3-d43ce8d16293"
          ],
          "deployment": {
            "properties": {...
    ```
    Assign the required role using [`az policy assignment identity assign`](/cli/azure/policy/assignment/identity):
    ```azurecli
    az policy assignment identity assign --system-assigned --resource-group <resource group name> --role <role name or ID> --identity-scope </scope> --name <policy assignment name>
    ```
    For example:
    ```azurecli
    az policy assignment identity assign --system-assigned --resource-group rg-001  --role 92aaf0da-9dab-42b6-94a3-d43ce8d16293 --identity-scope /subscriptions/12345678-aaaa-bbbb-cccc-1234567890ab/resourceGroups/rg001 --name policy-assignment-1
    ```

1. Trigger a scan to find existing resources using [`az policy state trigger-scan`](/cli/azure/policy/state#az-policy-state-trigger-scan).

    ```azurecli
    az policy state trigger-scan --resource-group rg-001
    ```

1. Create a remediation task to apply the policy to existing resources using [`az policy remediation create`](/cli/azure/policy/remediation#az-policy-remediation-create).

    ```azurecli
    az policy remediation create -g <resource group name> --policy-assignment <policy assignment name> --name <remediation name> 
    ```

    For example,
    ```azurecli
    az policy remediation create -g rg-001 -n remediation-001 --policy-assignment policy-assignment-1
    ```

For more information on policy assignment using CLI, see [Azure CLI reference - az policy assignment](/cli/azure/policy/assignment#az-policy-assignment-create)

### [PowerShell](#tab/Powershell)

To apply a policy using the PowerShell, use the following commands:

1. Set up your environment.
    Select your subscription and set your resource group
    ```azurepowershell
    Select-AzSubscription <subscriptionID>
    $rg = Get-AzResourceGroup -Name <resource groups name>    
    ```

1. Get the policy definition and configure the parameters for the policy. In the example below we assign the policy to send keyVault logs to a Log Analytics workspace
    ```azurepowershell
    $definition = Get-AzPolicyDefinition |Where-Object Name -eq 6b359d8f-f88d-4052-aa7c-32015963ecc1
    $params =  @{"logAnalytics"="/subscriptions/<subscriptionID/resourcegroups/<resourcgroup>/providers/microsoft.operationalinsights/workspaces/<log anlaytics workspace name>"}  
    ```

1. Assign the policy 
    ```azurepowershell
    $policyAssignment=New-AzPolicyAssignment -Name <assignment name> -DisplayName "assignment display name" -Scope $rg.ResourceId -PolicyDefinition $definition -PolicyparameterObject $params -IdentityType 'SystemAssigned' -Location <location>
 
    #To get your assignemnt use:
    $policyAssignment=Get-AzPolicyAssignment -Name '<assignment name>' -Scope '/subscriptions/<subscriptionID>/resourcegroups/<resource group name>'

    ```

1. Assign the required role or roles to the system assigned Managed Identity
    ```azurepowershell
        $principalID=$policyAssignment.Identity.PrincipalId
        $roleDefinitionIds=$definition.Properties.policyRule.then.details.roleDefinitionIds
        $roleDefinitionIds | ForEach-Object {
            $roleDefId = $_.Split("/") | Select-Object -Last 1
            New-AzRoleAssignment -Scope $rg.ResourceId -ObjectId $policyAssignment.Identity.PrincipalId -RoleDefinitionId $roleDefId
        }
    ```

1. Scan for compliance, then create a remediation task to force compliance for existing resources.
    ```azurepowershell
        Start-AzPolicyComplianceScan -ResourceGroupName $rg.ResourceGroupName
        Start-AzPolicyRemediation -Name $policyAssignment.Name -PolicyAssignmentId $policyAssignment.PolicyAssignmentId  -ResourceGroupName $rg.ResourceGroupName
    ```

1. Check compliance 
    ```azurepowershell
    Get-AzPolicyState -PolicyAssignmentName  $policyAssignment.Name -ResourceGroupName $policyAssignment.ResourceGroupName|select-object IsCompliant, ResourceID
    ```
---

The policy is visible in the resources' diagnostic settings after approximately 30 minutes.

## Remediation tasks

Policies are applied to new resources when they're created. To apply a policy to existing resources, create a remediation task. Remediation tasks bring resources into compliance with a policy.

Remediation tasks act for specific policies. For initiatives that contain multiple policies, create a remediation task for each policy in the initiative where you have resources that you want to bring into compliance.

 Define remediation tasks when you first assign the policy, or at any stage after assignment. 

To create a remediation task for policies during the policy assignment, select the **Remediation** tab on **Assign policy** page and select the **Create remediation task** checkbox.

To create a remediation task after the policy has been assigned, select your assigned policy from the list on the Policy Assignments page.
 
:::image type="content" source="./media/diagnostics-settings-policies-deployifnotexists/remediation-after-assignment.png"  lightbox="./media/diagnostics-settings-policies-deployifnotexists/remediation-after-assignment.png" alt-text="A screenshot showing the policy remediation page.":::

Select **Remediate**.
Track the status of your remediation task in the **Remediation tasks** tab of the Policy Remediation page.

:::image type="content" source="./media/diagnostics-settings-policies-deployifnotexists/new-remediation-task-after-assignment.png" lightbox="./media/diagnostics-settings-policies-deployifnotexists/new-remediation-task-after-assignment.png" alt-text="A screenshot showing the new remediation task page.":::




For more information on remediation tasks, see [Remediate noncompliant resources](../../governance/policy/how-to/remediate-resources.md)

## Assign initiatives

Initiatives are collections of policies. There are two sets of initiatives for Azure Monitor Diagnostics settings:

1. Enable the *audit* category group resource logging
    + [Enable audit category group resource logging for supported resources to Event Hubs](https://portal.azure.com/?feature.customportal=false&feature.canmodifystamps=true&Microsoft_Azure_Monitoring_Logs=stage1&Microsoft_OperationsManagementSuite_Workspace=stage1#view/Microsoft_Azure_Policy/InitiativeDetailBlade/id/%2Fproviders%2FMicrosoft.Authorization%2FpolicySetDefinitions%2F1020d527-2764-4230-92cc-7035e4fcf8a7/scopes~/%5B%22%2Fsubscriptions%2F12345678-aaaa-bbbb-cccc-1234567890ab%22%5D)
    + [Enable audit category group resource logging for supported resources to Log Analytics](https://portal.azure.com/?feature.customportal=false&feature.canmodifystamps=true&Microsoft_Azure_Monitoring_Logs=stage1&Microsoft_OperationsManagementSuite_Workspace=stage1#view/Microsoft_Azure_Policy/InitiativeDetailBlade/id/%2Fproviders%2FMicrosoft.Authorization%2FpolicySetDefinitions%2Ff5b29bc4-feca-4cc6-a58a-772dd5e290a5/scopes~/%5B%22%2Fsubscriptions%2F12345678-aaaa-bbbb-cccc-1234567890ab%22%5D)
    + [Enable audit category group resource logging for supported resources to storage](https://portal.azure.com/?feature.customportal=false&feature.canmodifystamps=true&Microsoft_Azure_Monitoring_Logs=stage1&Microsoft_OperationsManagementSuite_Workspace=stage1#view/Microsoft_Azure_Policy/InitiativeDetailBlade/id/%2Fproviders%2FMicrosoft.Authorization%2FpolicySetDefinitions%2F8d723fb6-6680-45be-9d37-b1a4adb52207/scopes~/%5B%22%2Fsubscriptions%2F12345678-aaaa-bbbb-cccc-1234567890ab%22%5D)

1. Enable the *allLogs* category group resource logging
    + [Enable allLogs category group resource logging for supported resources to storage](https://portal.azure.com/#view/Microsoft_Azure_Policy/InitiativeDetail.ReactView/id/%2Fproviders%2FMicrosoft.Authorization%2FpolicySetDefinitions%2Fb6b86da9-e527-49de-ac59-6af0a9db10b8/version~/null/scopes~/)
    + [Enable allLogs category group resource logging for supported resources to Event Hubs](https://portal.azure.com/#view/Microsoft_Azure_Policy/InitiativeDetail.ReactView/id/%2Fproviders%2FMicrosoft.Authorization%2FpolicySetDefinitions%2F85175a36-2f12-419a-96b4-18d5b0096531/version~/null/scopes/)
    + [Enable allLogs category group resource logging for supported resources to Log Analytics](https://portal.azure.com/#view/Microsoft_Azure_Policy/InitiativeDetail.ReactView/id/%2Fproviders%2FMicrosoft.Authorization%2FpolicySetDefinitions%2F0884adba-2312-4468-abeb-5422caed1038/version~/null/scopes/%5B%22%2Fsubscriptions%2F""%22%22%5D)


In this example, we assign an initiative for sending audit logs to a Log Analytics workspace.

### [Azure portal](#tab/portal)

1. From the policy **Definitions** page, select your scope.

1. Select *Initiative* in the **Definition type** dropdown.
1. Select *Monitoring* in the **Category** dropdown.
1. Enter *audit* in the **Search** field.
1. Select thee *Enable audit category group resource logging for supported resources to Log Analytics* initiative.
1. On the following page, select **Assign**
:::image type="content" source="./media/diagnostics-settings-policies-deployifnotexists/initiatives-definitions.png" lightbox="./media/diagnostics-settings-policies-deployifnotexists/initiatives-definitions.png" alt-text="A screenshot showing the initiatives definitions page.":::

1. On the **Basics** tab of the **Assign initiative** page, select a **Scope** that you want the initiative to apply to.
1. Enter a name in the **Assignment name** field.
1. Select the **Parameters** tab.
:::image type="content" source="./media/diagnostics-settings-policies-deployifnotexists/assign-initiatives-basics.png"  lightbox="./media/diagnostics-settings-policies-deployifnotexists/assign-initiatives-basics.png" alt-text="A screenshot showing the assign initiatives basics tab.":::  

    The **Parameters** contains the parameters defined in the policy. In this case, we need to select the Log Analytics workspace that we want to send the logs to. For more information in the individual parameters for each policy, see [Policy-specific parameters](#policy-specific-parameters).

1. Select the **Log Analytics workspace** to send your audit logs to.

1. Select **Review + create** then **Create**
:::image type="content" source="./media/diagnostics-settings-policies-deployifnotexists/assign-initiatives-parameters.png" lightbox="./media/diagnostics-settings-policies-deployifnotexists/assign-initiatives-parameters.png" alt-text="A screenshot showing the assign initiatives parameters tab.":::

To verify that your policy or initiative assignment is working, create a resource in the subscription or resource group scope that you defined in your policy assignment.

After 10 minutes, select the **Diagnostics settings** page for your resource.
Your diagnostic setting appears in the list with the default name *setByPolicy-LogAnalytics* and the workspace name that you configured in the policy.

:::image type="content" source="./media/diagnostics-settings-policies-deployifnotexists/diagnostics-settings.png"  lightbox="./media/diagnostics-settings-policies-deployifnotexists/diagnostics-settings.png" alt-text="A screenshot showing the Diagnostics setting page for a resource.":::

Change the default name in the **Parameters** tab of the **Assign initiative** or policy page by unselecting the **Only show parameters that need input or review** checkbox.

:::image type="content" source="./media/diagnostics-settings-policies-deployifnotexists/edit-initiative-assignment.png" lightbox="./media/diagnostics-settings-policies-deployifnotexists/edit-initiative-assignment.png" alt-text="A screenshot showing the edit-initiative-assignment page with the checkbox unselected.":::

### [PowerShell](#tab/Powershell)


1. Set up your environment variables
    ```azurepowershell
    # Set up your environment variables.
    $subscriptionId = <your subscription ID>;
    $rg = Get-AzResourceGroup -Name <your resource group name>;
    Select-AzSubscription $subscriptionId;
    $logAnlayticsWorskspaceId=</subscriptions/$subscriptionId/resourcegroups/$rg.ResourceGroupName/providers/microsoft.operationalinsights/workspaces/<your log analytics workspace>;
    ```    

1. Get the initiative definition. In this example, we'll use Initiative *Enable audit category group resource logging for supported resources to `
Log Analytics*,  ResourceID "/providers/Microsoft.Authorization/policySetDefinitions/f5b29bc4-feca-4cc6-a58a-772dd5e290a5"
    ```azurepowershell
    $definition = Get-AzPolicySetDefinition |Where-Object ResourceID -eq /providers/Microsoft.Authorization/policySetDefinitions/f5b29bc4-feca-4cc6-a58a-772dd5e290a5;
    ```

1. Set an assignment name and configure parameters. For this initiative, the parameters include the Log Analytics workspace ID.
    ```azurepowershell
    $assignmentName=<your assignment name>;
    $params =  @{"logAnalytics"="/subscriptions/$subscriptionId/resourcegroups/$($rg.ResourceGroupName)/providers/microsoft.operationalinsights/workspaces/<your log analytics workspace>"}  
    ```

1. Assign the initiative using the parameters
    ```azurepowershell
    $policyAssignment=New-AzPolicyAssignment -Name $assignmentName  -Scope $rg.ResourceId -PolicySetDefinition $definition -PolicyparameterObject $params -IdentityType 'SystemAssigned' -Location eastus;
    ```

1.  Assign the `Contributor` role to the system assigned Managed Identity. For other initiatives, check which roles are required.
    ```azurepowershell
     New-AzRoleAssignment -Scope $rg.ResourceId -ObjectId $policyAssignment.Identity.PrincipalId -RoleDefinitionName Contributor;
    ```
1. Scan for policy compliance. The `Start-AzPolicyComplianceScan` command takes a few minutes to return
    ```azurepowershell
    Start-AzPolicyComplianceScan -ResourceGroupName $rg.ResourceGroupName;
    ```

1. Get a list of resources to remediate and the required parameters by calling `Get-AzPolicyState`
    ```azurepowershell
    $assignmentState=Get-AzPolicyState -PolicyAssignmentName  $assignmentName -ResourceGroupName $rg.ResourceGroupName;   
    $policyAssignmentId=$assignmentState.PolicyAssignmentId[0];
    $policyDefinitionReferenceIds=$assignmentState.PolicyDefinitionReferenceId;
    ```

1. For each resource type with noncompliant resources, start a remediation task.
    ```azurepowershell
        $policyDefinitionReferenceIds | ForEach-Object {
              $referenceId = $_
              Start-AzPolicyRemediation -ResourceGroupName $rg.ResourceGroupName  -PolicyAssignmentId $policyAssignmentId   -PolicyDefinitionReferenceId $referenceId -Name "$($rg.ResourceGroupName) remediation $referenceId";
        }
    ```

1. Check the compliance state when the remediation tasks have completed. 
    ```azurepowershell
    Get-AzPolicyState -PolicyAssignmentName  $assignmentName -ResourceGroupName $rg.ResourceGroupName|select-object IsCompliant, ResourceID
    ```

You can get your policy assignment details using the following command:
  ```azurepowershell
    $policyAssignment=Get-AzPolicyAssignment -Name $assignmentName -Scope "/subscriptions/$subscriptionId/resourcegroups/$($rg.ResourceGroupName)";
  ```

### [CLI](#tab/cli)


1. Sign in to your Azure account using the `az login` command.

1. Select the subscription where you want to apply the policy initiative using the `az account set` command.

1. Assign the initiative using [`az policy assignment create`](/cli/azure/policy/assignment#az-policy-assignment-create).

    ```azurecli
    az policy assignment create --name <assignment name> --resource-group <resource group name> --policy-set-definition <initiative name> --params <parameters object> --mi-system-assigned --location <location>
    ```
    For example:

    ```azurecli
    az policy assignment create --name "assign-cli-example-01" --resource-group "cli-example-01" --policy-set-definition 'f5b29bc4-feca-4cc6-a58a-772dd5e290a5' --params '{"logAnalytics":{"value":"/subscriptions/12345678-aaaa-bbbb-cccc-1234567890ab/resourcegroups/cli-example-01/providers/microsoft.operationalinsights/workspaces/cli-example-01-ws"}, "diagnosticSettingName":{"value":"AssignedBy-cli-example-01"}}' --mi-system-assigned --location eastus
    ```
1. Assign the required role to the system managed identity

    Find the roles to assign in any of the policy definitions in the initiative by searching the definition for *roleDefinitionIds*, for example:

    ```json
       ...},
          "roleDefinitionIds": [
            "/providers/Microsoft.Authorization/roleDefinitions/92aaf0da-9dab-42b6-94a3-d43ce8d16293"
          ],
          "deployment": {
            "properties": {...
    ```
    Assign the required role using [`az policy assignment identity assign`](/cli/azure/policy/assignment/identity):
    ```azurecli
    az policy assignment identity assign --system-assigned --resource-group <resource group name> --role <role name or ID> --identity-scope <scope> --name <policy assignment name>
    ```

    For example:
    ```azurecli
    az policy assignment identity assign --system-assigned --resource-group "cli-example-01" --role 92aaf0da-9dab-42b6-94a3-d43ce8d16293 --identity-scope "/subscriptions/12345678-aaaa-bbbb-cccc-1234567890ab/resourcegroups/cli-example-01" --name assign-cli-example-01
    ```

1. Create remediation tasks for the policies in the initiative.

    Remediation tasks are created per-policy. Each task is for a specific `definition-reference-id`, specified in the initiative as `policyDefinitionReferenceId`. To find the `definition-reference-id` parameter, use the following command:
    ```azurecli
    az policy set-definition show --name f5b29bc4-feca-4cc6-a58a-772dd5e290a5 |grep policyDefinitionReferenceId
    ```
    Remediate the resources using [`az policy remediation create`](/cli/azure/policy/remediation#az-policy-remediation-create)

    ```azurecli
    az policy remediation create --resource-group <resource group name> --policy-assignment <assignment name> --name <remediation task name> --definition-reference-id  "policy specific reference ID"  --resource-discovery-mode ReEvaluateCompliance
    ```
    For example:
    ```azurecli
    az policy remediation create --resource-group "cli-example-01" --policy-assignment assign-cli-example-01 --name "rem-assign-cli-example-01" --definition-reference-id  "keyvault-vaults"  --resource-discovery-mode ReEvaluateCompliance
    ```
    To create a remediation task for all of the policies in the initiative, use the following example:
    ```bash
    for policyDefinitionReferenceId in $(az policy set-definition show --name f5b29bc4-feca-4cc6-a58a-772dd5e290a5 |grep policyDefinitionReferenceId |cut -d":" -f2|sed s/\"//g) 
    do 
        az policy remediation create --resource-group "cli-example-01" --policy-assignment assign-cli-example-01 --name remediate-$policyDefinitionReferenceId --definition-reference-id $policyDefinitionReferenceId; 
    done 
    ```

---


## Common parameters

The following table describes the common parameters for each set of policies.

|Parameter| Description| Valid Values|Default|
|---|---|---|---|
|effect| Enable or disable the execution of the policy|DeployIfNotExists,<br>AuditIfNotExists,<br>Disabled|DeployIfNotExists|
|diagnosticSettingName|Diagnostic Setting Name||setByPolicy-LogAnalytics|
|categoryGroup|Diagnostic category group|none,<br>audit,<br>allLogs|audit|

## Policy-specific parameters
### Log Analytics policy parameters
 This policy deploys a diagnostic setting using a category group to route logs to a Log Analytics workspace.

|Parameter| Description| Valid Values|Default|
|---|---|---|---|
|resourceLocationList|Resource Location List to send logs to nearby Log Analytics. <br>"*" selects all locations|Supported locations|\*|
|logAnalytics|Log Analytics Workspace|||

### Event Hubs policy parameters

This policy deploys a diagnostic setting using a category group to route logs to an event hub.

|Parameter| Description| Valid Values|Default|
|---|---|---|---|
|resourceLocation|Resource Location must be the same location as the event hub Namespace|Supported locations||
|eventHubAuthorizationRuleId|Event hub Authorization Rule ID. The authorization rule is at event hub namespace level. For example, /subscriptions/{subscription ID}/resourceGroups/{resource group}/providers/Microsoft.EventHub/namespaces/{Event Hub namespace}/authorizationrules/{authorization rule}|||
|eventHubName|Event hub name||Monitoring|


### Storage Accounts policy parameters
This policy deploys a diagnostic setting using a category group to route logs to a Storage Account.

|Parameter| Description| Valid Values|Default|
|---|---|---|---|
|resourceLocation|Resource Location must be in the same location as the Storage Account|Supported locations|
|storageAccount|Storage Account resourceId|||

## Supported resources

Built-in All logs and Audit logs policies for Log Analytics workspaces, Event Hubs, and Storage Accounts exist for the following resources:

|Resource Type| All logs| Audit Logs|
|---|---|---| 
|microsoft.aad/domainservices|Yes|Yes|
|microsoft.agfoodplatform/farmbeats|Yes|Yes|
|microsoft.analysisservices/servers|Yes|No|
|microsoft.apimanagement/service|Yes|Yes|
|microsoft.app/managedenvironments|Yes|Yes|
|microsoft.appconfiguration/configurationstores|Yes|Yes|
|microsoft.appplatform/spring|Yes|No|
|microsoft.attestation/attestationproviders|Yes|Yes|
|microsoft.automation/automationaccounts|Yes|Yes|
|microsoft.autonomousdevelopmentplatform/workspaces|Yes|No|
|microsoft.avs/privateclouds|Yes|Yes|
|microsoft.azureplaywrightservice/accounts|Yes|Yes|
|microsoft.azuresphere/catalogs|Yes|Yes|
|microsoft.batch/batchaccounts|Yes|Yes|
|microsoft.botservice/botservices|Yes|No|
|microsoft.cache/redis|Yes|Yes|
|microsoft.cache/redisenterprise/databases|Yes|Yes|
|microsoft.cdn/cdnwebapplicationfirewallpolicies|Yes|No|
|microsoft.cdn/profiles|Yes|Yes|
|microsoft.cdn/profiles/endpoints|Yes|No|
|microsoft.chaos/experiments|Yes|Yes|
|microsoft.classicnetwork/networksecuritygroups|Yes|No|
|microsoft.cloudtest/hostedpools|Yes|No|
|microsoft.codesigning/codesigningaccounts|Yes|Yes|
|microsoft.cognitiveservices/accounts|Yes|Yes|
|microsoft.communication/communicationservices|Yes|No|
|microsoft.community/communitytrainings|Yes|Yes|
|microsoft.confidentialledger/managedccfs|Yes|Yes|
|microsoft.connectedcache/enterprisemcccustomers|Yes|No|
|microsoft.connectedcache/ispcustomers|Yes|No|
|microsoft.containerinstance/containergroups|Yes|No|
|microsoft.containerregistry/registries|Yes|Yes|
|microsoft.customproviders/resourceproviders|Yes|No|
|microsoft.d365customerinsights/instances|Yes|No|
|microsoft.dashboard/grafana|Yes|Yes|
|microsoft.databricks/workspaces|Yes|No|
|microsoft.datafactory/factories|Yes|No|
|microsoft.datalakeanalytics/accounts|Yes|No|
|microsoft.datalakestore/accounts|Yes|No|
|microsoft.dataprotection/backupvaults|Yes|No|
|microsoft.datashare/accounts|Yes|No|
|microsoft.dbformariadb/servers|Yes|No|
|microsoft.dbformysql/flexibleservers|Yes|Yes|
|microsoft.dbformysql/servers|Yes|No|
|microsoft.dbforpostgresql/flexibleservers|Yes|Yes|
|microsoft.dbforpostgresql/servergroupsv2|Yes|No|
|microsoft.dbforpostgresql/servers|Yes|No|
|microsoft.desktopvirtualization/applicationgroups|Yes|No|
|microsoft.desktopvirtualization/hostpools|Yes|No|
|microsoft.desktopvirtualization/scalingplans|Yes|No|
|microsoft.desktopvirtualization/workspaces|Yes|No|
|microsoft.devcenter/devcenters|Yes|Yes|
|microsoft.devices/iothubs|Yes|Yes|
|microsoft.devices/provisioningservices|Yes|No|
|microsoft.digitaltwins/digitaltwinsinstances|Yes|No|
|microsoft.documentdb/cassandraclusters|Yes|Yes|
|microsoft.documentdb/databaseaccounts|Yes|Yes|
|microsoft.documentdb/mongoclusters|Yes|Yes|
|microsoft.eventgrid/domains|Yes|Yes|
|microsoft.eventgrid/partnernamespaces|Yes|Yes|
|microsoft.eventgrid/partnertopics|Yes|No|
|microsoft.eventgrid/systemtopics|Yes|No|
|microsoft.eventgrid/topics|Yes|Yes|
|microsoft.eventhub/namespaces|Yes|Yes|
|microsoft.experimentation/experimentworkspaces|Yes|No|
|microsoft.healthcareapis/services|Yes|No|
|microsoft.healthcareapis/workspaces/dicomservices|Yes|No|
|microsoft.healthcareapis/workspaces/fhirservices|Yes|No|
|microsoft.healthcareapis/workspaces/iotconnectors|Yes|No|
|microsoft.insights/autoscalesettings|Yes|No|
|microsoft.insights/components|Yes|No|
|microsoft.insights/datacollectionrules|Yes|No|
|microsoft.keyvault/managedhsms|Yes|Yes|
|microsoft.keyvault/vaults|Yes|Yes|
|microsoft.kusto/clusters|Yes|Yes|
|microsoft.loadtestservice/loadtests|Yes|Yes|
|microsoft.logic/integrationaccounts|Yes|No|
|microsoft.logic/workflows|Yes|No|
|microsoft.machinelearningservices/registries|Yes|Yes|
|microsoft.machinelearningservices/workspaces|Yes|Yes|
|microsoft.machinelearningservices/workspaces/onlineendpoints|Yes|No|
|microsoft.managednetworkfabric/networkdevices|Yes|No|
|microsoft.media/mediaservices|Yes|Yes|
|microsoft.media/mediaservices/liveevents|Yes|Yes|
|microsoft.media/mediaservices/streamingendpoints|Yes|Yes|
|microsoft.netapp/netappaccounts/capacitypools/volumes|Yes|Yes|
|microsoft.network/applicationgateways|Yes|No|
|microsoft.network/azurefirewalls|Yes|No|
|microsoft.network/bastionhosts|Yes|Yes|
|microsoft.network/dnsresolverpolicies|Yes|No|
|microsoft.network/expressroutecircuits|Yes|No|
|microsoft.network/frontdoors|Yes|Yes|
|microsoft.network/loadbalancers|Yes|No|
|microsoft.network/networkmanagers|Yes|Yes|
|microsoft.network/networkmanagers/ipampools|Yes|Yes|
|microsoft.network/networksecuritygroups|Yes|No|
|microsoft.network/networksecurityperimeters|Yes|No|
|microsoft.network/p2svpngateways|Yes|Yes|
|microsoft.network/publicipaddresses|Yes|Yes|
|microsoft.network/publicipprefixes|Yes|Yes|
|microsoft.network/trafficmanagerprofiles|Yes|No|
|microsoft.network/virtualnetworkgateways|Yes|Yes|
|microsoft.network/virtualnetworks|Yes|No|
|microsoft.network/vpngateways|Yes|No|
|microsoft.networkanalytics/dataproducts|Yes|Yes|
|microsoft.networkcloud/baremetalmachines|Yes|No|
|microsoft.networkcloud/clusters|Yes|No|
|microsoft.networkcloud/storageappliances|Yes|No|
|microsoft.networkfunction/azuretrafficcollectors|Yes|No|
|microsoft.notificationhubs/namespaces|Yes|Yes|
|microsoft.notificationhubs/namespaces/notificationhubs|Yes|Yes|
|microsoft.openenergyplatform/energyservices|Yes|No|
|microsoft.operationalinsights/workspaces|Yes|Yes|
|microsoft.powerbi/tenants/workspaces|Yes|No|
|microsoft.powerbidedicated/capacities|Yes|No|
|microsoft.purview/accounts|Yes|Yes|
|microsoft.recoveryservices/vaults|Yes|No|
|microsoft.relay/namespaces|Yes|No|
|microsoft.search/searchservices|Yes|Yes|
|microsoft.servicebus/namespaces|Yes|Yes|
|microsoft.servicenetworking/trafficcontrollers|Yes|No|
|microsoft.signalrservice/signalr|Yes|Yes|
|microsoft.signalrservice/webpubsub|Yes|Yes|
|microsoft.sql/managedinstances|Yes|Yes|
|microsoft.sql/managedinstances/databases|Yes|No|
|microsoft.sql/servers/databases|Yes|Yes|
|microsoft.storagecache/caches|Yes|No|
|microsoft.storagemover/storagemovers|Yes|No|
|microsoft.streamanalytics/streamingjobs|Yes|No|
|microsoft.synapse/workspaces|Yes|Yes|
|microsoft.synapse/workspaces/bigdatapools|Yes|Yes|
|microsoft.synapse/workspaces/kustopools|Yes|Yes|
|microsoft.synapse/workspaces/scopepools|Yes|Yes|
|microsoft.synapse/workspaces/sqlpools|Yes|Yes|
|microsoft.timeseriesinsights/environments|Yes|No|
|microsoft.timeseriesinsights/environments/eventsources|Yes|No|
|microsoft.videoindexer/accounts|Yes|No|
|microsoft.web/hostingenvironments|Yes|Yes|
|microsoft.workloads/sapvirtualinstances|Yes|Yes|

## Next Steps

* [Create diagnostic settings at scale using Azure Policy](./diagnostic-settings-policy.md)
* [Azure Policy built-in definitions for Azure Monitor](../policy-reference.md)
* [Azure Policy Overview](../../governance/policy/overview.md)
* [Azure Enterprise Policy as Code](https://techcommunity.microsoft.com/t5/core-infrastructure-and-security/azure-enterprise-policy-as-code-a-new-approach/ba-p/3607843)
