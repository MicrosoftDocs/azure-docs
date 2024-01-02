---
title: Govern resources for client applications with application groups
description: Learn how to use application groups to govern resources for client applications that connect with Event Hubs. 
ms.topic: how-to
ms.date: 10/12/2022
ms.custom: ignite-2022, devx-track-azurepowershell, devx-track-azurecli
---

# Govern resources for client applications with application groups
Azure Event Hubs enables you to govern event streaming workloads for client applications that connect to Event Hubs by using **application groups**. For more information, see [Resource governance with application groups](resource-governance-overview.md). 

This article shows you how to perform the following tasks:

- Create an application group.
- Enable or disable an application group
- Define threshold limits and apply throttling policies to an application group
- Validate throttling with Diagnostic Logs

> [!NOTE] 
> Application groups are available only in **premium** and **dedicated** tiers. 

## Create an application group
This section shows you how to create an application group using Azure portal, CLI, PowerShell, and an Azure Resource Manager (ARM) template. 

### [Azure portal](#tab/portal)
You can create an application group using the Azure portal by following these steps. 

1. Navigate to your Event Hubs namespace. 
1. On the left menu, select **Application Groups** under **Settings**. 
1. On the **Application Groups** page, select **+ Application Group** on the command bar. 

    :::image type="content" source="./media/resource-governance-with-app-groups/application-groups-page.png" alt-text="Screenshot of the Application Groups page in the Azure portal.":::
1. On the **Add application group** page, follow these steps:
    1. Specify a **name** for the application group.
    1. Confirm that **Enabled** is selected. To have the application group in the disabled state first, clear the **Enabled** option. This flag determines whether the clients of an application group can access Event Hubs or not.
    1. For **Security context type**, select **Namespace Shared access policy**, **event hub Shared Access Policy** or **Microsoft Entra application**.Application group supports the selection of SAS key at either namespace or at entity (event hub) level. When you create the application group, you should associate with either a shared access signatures (SAS) or Microsoft Entra application ID, which is used by client applications. 
    1. If you selected **Namespace Shared access policy**:
        1. For **SAS key name**, select the SAS policy that can be used as a security context for this application group.You can select **Add SAS Policy** to add a new policy and then associate with the application group. 
	
              :::image type="content" source="./media/resource-governance-with-app-groups/create-application-groups-with-namespace-shared-access-key.png" alt-text="Screenshot of the Add application group page with Namespace Shared access policy option selected.":::
     1. If you selected **Event Hubs Shared access policy**:
        1. For **SAS key name**, copy the SAS policy name from Event Hubs "Shared Access Policies" Page and paste into textbox
    
              :::image type="content" source="./media/resource-governance-with-app-groups/create-application-groups-with-event-hub-shared-access-key.png" alt-text="Screenshot of the Add application group page with event hub Shared access policy option selected.":::
     
      1. If you selected **Microsoft Entra application**:
          1. For **Microsoft Entra Application (client) ID**, specify the Microsoft Entra application or client ID. 
          
          	:::image type="content" source="./media/resource-governance-with-app-groups/add-app-group-active-directory.png" alt-text="Screenshot of the Add application group page with Microsoft Entra option.":::

### [Supported Security Context type](#supported-security-context-type)
Review the auto-generated **Client group ID**, which is the unique ID associated with the application group. The scope of application governance (namespace or entity level) would depend on the access level for the used Microsoft Entra application ID. The following table  shows auto generated Client Group ID for different security Context type: 
    
| Security Context type | Auto-generated client group ID|
| ---| ---		| 
| Namespace shared access key	| `NamespaceSASKeyName=<NamespaceLevelKeyName>` |
| Microsoft Entra Application		| `AADAppID=<AppID>`				|
| Event Hubs shared access key 	| `EntitySASKeyName=<EntityLevelKeyName>` 	| 
		
> [!NOTE]
 > All existing application groups created with namespace shared access key would continue to work with client group ID starting with `SASKeyName`. However all new application groups would have updated client group ID as shown above.

            
   1. To add a policy, follow these steps:
        1. Enter a **name** for the policy.
        1. For **Type**, select **Throttling policy**. 
        1. For **Metric ID**, select one of the following options: **Incoming messages**, **Outgoing messages**, **Incoming bytes**, **Outgoing bytes**. In the following example, **Incoming messages** is selected. 
        1. For **Rate limit threshold**, enter the threshold value. In the following example, **10000** is specified as the threshold for the number of incoming messages. 
        
            :::image type="content" source="./media/resource-governance-with-app-groups/app-group-policy.png" alt-text="Screenshot of the Add application group page with a policy for incoming messages.":::
            
            Here's a screenshot of the page with another policy added. 

			:::image type="content" source="./media/resource-governance-with-app-groups/app-group-policy-2.png" alt-text="Screenshot of the Add application group page with two policies.":::
    1. Now, on the **Add application group** page, select **Add**.
1. Confirm that you see the application group in the list of application groups. 

	:::image type="content" source="./media/resource-governance-with-app-groups/application-group-list.png" alt-text="Screenshot of the Application groups page with the application group you created.":::    

    You can delete the application group in the list by selecting the trash icon button next to it in the list.  


### [Azure CLI](#tab/cli)
Use the CLI command: [`az eventhubs namespace application-group create`](/cli/azure/eventhubs/namespace/application-group#az-eventhubs-namespace-application-group-create) to create an application group at Event Hubs namespace or event hub level. You must set --client-app-group-identifier based on the security
context type you are choosing. Please review the [table](#supported-security-context-type) above to know supported Security context type

The following example creates an application group named `myAppGroup` in the namespace `mynamespace` in the Azure resource group `MyResourceGroup`. It uses the following configurations.

- Shared access policy is used as the security context
- Client app group ID is set to `NamespaceSASKeyName=<NameOfTheSASkey>`.
- First throttling policy for the `Incoming messages` metric with `10000` as the threshold.
- Second throttling policy for the `Incoming bytes` metric with `20000` as the threshold. 

```azurecli-interactive
az eventhubs namespace application-group create --namespace-name mynamespace \
                                                -g MyResourceGroup \
                                                --name myAppGroup \
                                                --client-app-group-identifier NamespaceSASKeyName=keyname \
                                                --throttling-policy-config name=policy1 metric-id=IncomingMessages rate-limit-threshold=10000 \
                                                --throttling-policy-config name=policy2 metric-id=IncomingBytes rate-limit-threshold=20000
```

To learn more about the CLI command, see [`az eventhubs namespace application-group create`](/cli/azure/eventhubs/namespace/application-group#az-eventhubs-namespace-application-group-create). 

### [Azure PowerShell](#tab/powershell)
Use the PowerShell command: [`New-AzEventHubApplicationGroup`](/powershell/module/az.eventhub/new-azeventhubapplicationgroup) to create an application group  at Event Hubs namespace or event hub level. You must set -ClientAppGroupIdentifier based on the security
context type you are choosing. Please review the [table](#supported-security-context-type) above to know supported Security context type

The following example uses the [`New-AzEventHubThrottlingPolicyConfig`](/powershell/module/az.eventhub/new-azeventhubthrottlingpolicyconfig) to create two policies that will be associated with the application.

- First throttling policy for the `Incoming bytes` metric with `12345` as the threshold. 
- Second throttling policy for the `Incoming messages` metric with `23416` as the threshold.

Then, it creates an application group named `myappgroup` in the namespace `mynamespace` in the Azure resource group `myresourcegroup` by specifying the throttling policies and shared access policy as the security context. 

```azurepowershell-interactive
$policy1 = New-AzEventHubThrottlingPolicyConfig -Name policy1 -MetricId IncomingBytes -RateLimitThreshold 12345

$policy2 = New-AzEventHubThrottlingPolicyConfig -Name policy2 -MetricId IncomingMessages -RateLimitThreshold 23416

New-AzEventHubApplicationGroup -ResourceGroupName myresourcegroup -NamespaceName mynamespace -Name myappgroup 
		-ClientAppGroupIdentifier NamespaceSASKeyName=myauthkey -ThrottlingPolicyConfig $policy1, $policy2
```

To learn more about the PowerShell command, see [`New-AzEventHubApplicationGroup`](/powershell/module/az.eventhub/new-azeventhubapplicationgroup).

### [ARM template](#tab/arm)
The following example shows how to create an application group using an ARM template. In this example, the application group is associated with an existing SAS policy name `contososaspolicy` by setting the client `AppGroupIdentifier` as `NamespaceSASKeyName=contososaspolicy`. The application group policies are also defined in the ARM template. You must set ClientAppGroupIdentifier based on the security context type you are choosing. Please review the [table](#supported-security-context-type) above to know supported Security context type


```json
{
	"type": "ApplicationGroups",
	"apiVersion": "2022-01-01-preview",
	"name": "[parameters('applicationGroupName')]",
	"dependsOn": [
		"[resourceId('Microsoft.EventHub/namespaces/', parameters('eventHubNamespaceName'))]",
		"[resourceId('Microsoft.EventHub/namespaces/authorizationRules', parameters('eventHubNamespaceName'),parameters('namespaceAuthorizationRuleName'))]"
	],
	"properties": {
		"ClientAppGroupIdentifier": "NamespaceSASKeyName=contososaspolicy",
		"policies": [{
				"Type": "ThrottlingPolicy",
				"Name": "ThrottlingPolicy1",
				"metricId": "IncomingMessages",
				"rateLimitThreshold": 10
			},
			{
				"Type": "ThrottlingPolicy",
				"Name": "ThrottlingPolicy2",
				"metricId": "IncomingBytes",
				"rateLimitThreshold": 3951729
			}
		],
		"isEnabled": true
	}
}
```
---

## Enable or disable an application group
You can prevent client applications accessing your Event Hubs namespace by disabling the application group that contains those applications. When the application group is disabled, client applications won't be able to publish or consume data. Any established connections from client applications of that application group will also be terminated. 

This section shows you how to enable or disable an application group using Azure portal, PowerShell, CLI, and ARM template. 

### [Azure portal](#tab/portal)

1. On the **Event Hubs Namespace** page, select **Application Groups** on the left menu. 
1. Select the application group that you want to enable or disable. 

    :::image type="content" source="./media/resource-governance-with-app-groups/select-application-group.png" alt-text="Screenshot showing the Application Groups page with an application group selected.":::
1. On the **Edit application group** page, clear checkbox next to **Enabled** to disable an application group, and then select **Update** at the bottom of the page. Similarly, select the checkbox to enable an application group. 

	:::image type="content" source="./media/resource-governance-with-app-groups/disable-app-group.png" alt-text="Screenshot showing the Edit application group page with Enabled option deselected.":::

### [Azure CLI](#tab/cli)
Use the [`az eventhubs namespace application-group update`](/cli/azure/eventhubs/namespace/application-group#az-eventhubs-namespace-application-group-update) command with `--is-enabled` set to `false` to disable an application group. Similarly, to enable an application group, set this property to `true` and run the command.  

The following sample command disables the application group named `myappgroup` in the Event Hubs namespace `mynamespace` that's in the resource group `myresourcegroup`. 

```azurecli-interactive
az eventhubs namespace application-group update --namespace-name mynamespace -g myresourcegroup --name myappgroup --is-enabled false
```

### [Azure PowerShell](#tab/powershell)
Use the [Set-AzEventHubApplicationGroup](/powershell/module/az.eventhub/set-azeventhubapplicationgroup) command with `-IsEnabled` set to `false` to disable an application group. Similarly, to enable an application group, set this property to `true` and run the command.  

The following sample command disables the application group named `myappgroup` in the Event Hubs namespace `mynamespace` that's in the resource group `myresourcegroup`. 

```azurepowershell-interactive
Set-AzEventHubApplicationGroup -ResourceGroupName myresourcegroup -NamespaceName mynamespace -Name myappgroup -IsEnabled false
```

### [ARM template](#tab/arm)
The following ARM template shows how to update an existing namespace (`contosonamespace`) to disable an application group by setting the `isEnabled` property to `false`. The identifier for the app group is `SASKeyName=RootManageSharedAccessKey`. 

> [!NOTE]
> The following sample also adds two throttling policies

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "namespace_name": {
      "defaultValue": "contosonamespace",
      "type": "String"
    },
    "client-app-group-identifier": {
      "defaultValue": "SASKeyName=RootManageSharedAccessKey",
      "type": "String"
    }
  },
  "resources": [
    {
      "type": "Microsoft.EventHub/namespaces/applicationGroups",
      "apiVersion": "2022-01-01-preview",
      "name": "[concat(parameters('namespace_name'), '/contosoappgroup')]",
      "properties": {
        "clientAppGroupIdentifier": "[parameters('client-app-group-identifier')]",
        "isEnabled": false,
		"policies": [
			{
				"type": "ThrottlingPolicy",
				"name": "incomingmsgspolicy",
				"metricId": "IncomingMessages",
				"rateLimitThreshold": 10000
			},
			{
				"type": "ThrottlingPolicy",
				"name": "incomingbytespolicy",
				"metricId": "IncomingBytes",
				"rateLimitThreshold": 20000
			}
		]
      }
    }
  ]
}
```
---

## Apply throttling policies
You can add zero or more policies when you create an application group or to an existing application group. For example, you can add throttling policies related to `IncomingMessages`, `IncomingBytes` or `OutgoingBytes` to the `contosoAppGroup`. These policies will get applied to event streaming workloads of client applications that use the SAS policy `contososaspolicy`. 

To learn how to add policies while creating an application group, see the [Create an application group](#create-an-application-group) section.

You can also add policies after an application group is created.  

### [Azure portal](#tab/portal)
1. On the **Event Hubs Namespace** page, select **Application Groups** on the left menu. 
1. Select the application group that you want to add, update, or delete a policy.

    :::image type="content" source="./media/resource-governance-with-app-groups/select-application-group.png" alt-text="Screenshot showing the Application Groups page with an application group selected.":::
1. On the **Edit application group** page, you can do the following steps:    
    1. Update settings (including threshold values) for existing policies
    1. Add a new policy

### [Azure CLI](#tab/cli)
Use the [`az eventhubs namespace application-group policy add`](/cli/azure/eventhubs/namespace/application-group/policy#az-eventhubs-namespace-application-group-policy-add) to add a policy to an existing application group.

**Example:**

```azurecli-interactive
az eventhubs namespace application-group policy add --namespace-name mynamespace -g MyResourceGroup --name myAppGroup --throttling-policy-config name=policy1 metric-id=OutgoingMessages rate-limit-threshold=10500 --throttling-policy-config name=policy2 metric-id=IncomingBytes rate-limit-threshold=20000
```

### [Azure PowerShell](#tab/powershell)
Use the [Set-AzEventHubApplicationGroup](/powershell/module/az.eventhub/set-azeventhubapplicationgroup) command with `-ThrottingPolicyConfig` set to appropriate values. 

**Example:**
```azurepowershell-interactive
$policyToBeAppended = New-AzEventHubThrottlingPolicyConfig -Name policy1 -MetricId IncomingBytes -RateLimitThreshold 12345

$appGroup = Get-AzEventHubApplicationGroup -ResourceGroupName myresourcegroup -NamespaceName mynamespace -Name myappgroup

$appGroup.ThrottlingPolicyConfig += $policyToBeAppended

Set-AzEventHubApplicationGroup -ResourceGroupName myresourcegroup -NamespaceName mynamespace -Name myappgroup -ThrottlingPolicyConfig $appGroup.ThrottlingPolicyConfig
```

### [ARM template](#tab/arm)
The following ARM template shows how to update an existing namespace (`contosonamespace`) to add throttling policies. The identifier for the app group is `NamespaceSASKeyName=RootManageSharedAccessKey`. 

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "namespace_name": {
      "defaultValue": "contosonamespace",
      "type": "String"
    },
    "client-app-group-identifier": {
      "defaultValue": "NamespaceSASKeyName=RootManageSharedAccessKey",
      "type": "String"
    }
  },
  "resources": [
    {
      "type": "Microsoft.EventHub/namespaces/applicationGroups",
      "apiVersion": "2022-01-01-preview",
      "name": "[concat(parameters('namespace_name'), '/contosoappgroup')]",
      "properties": {
        "clientAppGroupIdentifier": "[parameters('client-app-group-identifier')]",
        "isEnabled": true,
		"policies": [
			{
				"type": "ThrottlingPolicy",
				"name": "incomingmsgspolicy",
				"metricId": "IncomingMessages",
				"rateLimitThreshold": 10000
			},
			{
				"type": "ThrottlingPolicy",
				"name": "incomingbytespolicy",
				"metricId": "IncomingBytes",
				"rateLimitThreshold": 20000
			}
		]
      }
    }
  ]
}

```
---

### Decide threshold value for throttling policies 

Azure Event Hubs supports [Application Metric Logs ](monitor-event-hubs-reference.md#application-metrics-logs) functionality to observe usual throughput within your system and accordingly decide on the threshold value for application group. You can follow these steps to decide on a threshold value:

1. Turn on [diagnostic settings](monitor-event-hubs.md#collection-and-routing) in Event Hubs with **Application Metric logs** as selected category and choose **Log Analytics** as destination.  
2. Create an empty application group without any throttling policy.  
3. Continue sending messages/events to event hub at usual throughput. 
4. Go to **Log Analytics workspace** and query for the right activity name (based on the (resource-governance-overview.md#throttling-policy---threshold-limits)) in **AzureDiagnostics** table. The following sample query is set to track threshold value for incoming messages:  

    ```kusto
    AzureDiagnostics 
        | where ActivityName_s =="IncomingMessages" 
        | where Outcome_s =="Success"      
    ```
5. Select the **Chart** section on Log Analytics workspace and plot a chart between time generated on Y axis and count of messages sent on x axis.  

    :::image type="content" source="./media/resource-governance-with-app-groups/azure-monitor-logs.png" lightbox="./media/resource-governance-with-app-groups/azure-monitor-logs.png" alt-text="Screenshot of the Azure Monitor logs page in the Azure portal.":::
    
    In this example, you can see that the usual throughput never crossed more than 550 messages (expected current throughput). This observation helps you define the actual threshold value.   
6. Once you decide the threshold value, add a new throttling policy inside the application group. 

## Publish or consume events 
Once you successfully add throttling policies to the application group, you can test the throttling behavior by either publishing or consuming events using client applications that are part of the `contosoAppGroup` application group. To test, you can use either an [AMQP client](event-hubs-dotnet-standard-getstarted-send.md) or a [Kafka client](event-hubs-quickstart-kafka-enabled-event-hubs.md) application and same SAS policy name or Microsoft Entra application ID that's used to create the application group. 

> [!NOTE]
> When your client applications are throttled, you should experience a slowness in publishing or consuming data. 

### Validate Throttling with Application Groups

Similar to [Deciding Threshold limits for Throttling Policies](resource-governance-with-app-groups.md#decide-threshold-value-for-throttling-policies), you can use Application Metric logs to validate throttling and find more details. 

You can use the below example query to find out all the throttled requests in certain timeframe. You must update the ActivityName to match the operation that you expect to be throttled. 


  ```kusto
  
    AzureDiagnostics 
    |  where Category =="ApplicationMetricsLogs"
    | where ActivityName_s =="IncomingMessages" 
    | where Outcome_s =="Throttled"  
	
  ``` 
Due to restrictions at protocol level, throttled request logs are not generated for consumer operations within event hub ( `OutgoingMessages` or `OutgoingBytes`). when requests are throttled at consumer side, you would observe sluggish egress throughput. 

## Next steps

- For conceptual information on application groups, see [Resource governance with application groups](resource-governance-overview.md). 
- See [Azure PowerShell reference for Event Hubs](/powershell/module/az.eventhub#event-hub)
- See [Azure CLI reference for Event Hubs](/cli/azure/eventhubs)
