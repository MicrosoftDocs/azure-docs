# workspace()

The expression `workspace` is used to query data from a specific Azure Log Analytics workspace in the same resource group, another resource group, or another subscription.
This is useful to query data across multiple workspaces, and can be combined with the `app` expression to process Application Insights data as well.
```
workspace("MyWorkspace").Event
```

**Syntax**

`workspace(`*Identifier*`)`


**Arguments**

- *Identifier*: Identifies the workspace using one of the formats in the table below.

Identifier        |Example                                                                                                                                                 |Description
------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|--------------
Resource Name     |workspace("contosoretail")                                                                                                                              |Human readable name of the workspace (AKA "component name")           
Qualified Name    |workspace('Contoso/ContosoResource/ContosoWorkspace')                                                                                                   |Full name of the workspace in the form: "subscriptionName/resourceGroup/componentName"
ID                |workspace("b438b3f6-912a-46d5-9db1-b42069242ab4")                                                                                                       |GUID of the workspace            
Azure Resource ID |workspace("/subscriptions/e4227-645-44e-9c67-3b84b5982/resourcegroups/ContosoAzureHQ/providers/Microsoft.OperationalInsights/workspaces/contosoretail") |Identifier for the Azure resource      



**Notes**

* You can refer to any workspace to which you have read access.
* A related expression is `app` that allows you to query across Application Insights applications.

**Examples**

```
workspace("contosoretail").Update | count
```
```
workspace("b438b4f6-912a-46d5-9cb1-b44069212ab4").Update | count
```
```
workspace("/subscriptions/e427267-5645-4c4e-9c67-3b84b59a6982/resourcegroups/ContosoAzureHQ/providers/Microsoft.OperationalInsights/workspaces/contosoretail").Event | count
```
```
union 
(workspace("myworkspace").Heartbeat | where Computer contains "Con"),
(app("myapplication").requests | where cloud_RoleInstance contains "Con")
| count  
```
```
union 
(workspace("myworkspace").Heartbeat), (app("myapplication").requests)
| where TimeGenerated between(todatetime("2018-02-08 15:00:00") .. todatetime("2018-12-08 15:05:00"))
```