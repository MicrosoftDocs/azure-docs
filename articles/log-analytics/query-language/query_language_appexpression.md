# app()

The expression `app` is used to query data from a specific Application Insights app in the same resource group, another resource group, or another subscription.
This is useful to query data across multiple applications, and can be combined with the `workspace` expression to process Log Analytics data as well.
```
app("MyApp").requests
```

**Syntax**

`app(`*Identifier*`)`


**Arguments**

- *Identifier*: Identifies the app using one of the formats in the table below.

Identifier        |Example                                                                                                                               |Description
------------------|--------------------------------------------------------------------------------------------------------------------------------------|--------------
Resource Name     |app("fabrikamapp")                                                                                                                    |Human readable name of the app (AKA "component name")           
Qualified Name    |app('AI-Prototype/Fabrikam/fabrikamapp')                                                                                              |Full name of the app in the form: "subscriptionName/resourceGroup/componentName"           
ID                |app("988ba129-363e-4415-8fe7-8cbab5447518")                                                                                           |GUID of the app            
Azure Resource ID |app("/subscriptions/7293b69-db12-44fc-9a66-9c2005c3051d/resourcegroups/Fabrikam/providers/microsoft.insights/components/fabrikamapp") |Identifier for the Azure resource            


**Notes**

* You can refer to any application to which you have read access.
* Identifying an application by its name assumes that it is unique across all accessible subscriptions. If you have multiple applications with the specified name, the query will fail because of the ambiguity. In this case you must use one of the other identifiers.
* A related expression is `workspace` that allows you to query across Log Analytics workspaces.

**Examples**

```
app("fabrikamapp").requests | count
```
```
app("AI-Prototype/Fabrikam/fabrikamapp").requests | count
```
```
app("b438b4f6-912a-46d5-9cb1-b44069212ab4").requests | count
```
```
app("/subscriptions/7293b69-db12-44fc-9a66-9c2005c3051d/resourcegroups/Fabrikam/providers/microsoft.insights/components/fabrikamapp").requests | count
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