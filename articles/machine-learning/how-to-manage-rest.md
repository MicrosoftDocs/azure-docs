file:///Users/larryobrien/Documents/src/AzureDocs/azure-docs-pr/articles/machine-learning/how-to-manage-rest.md {"mtime":1578512330548,"ctime":1578511816918,"size":6283,"etag":"34elljb926gl","orphaned":false}
---
title: Use REST to manage ML resources  
description: How to use REST APIs to create, run, and delete Azure ML resources 
author: lobrien
ms.author: laobri
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.date: 01/31/2020
---

TODO:s/119ec674-a66c-4b3b-8514-57cb582c4c8c/your-subscription-id/

# Create, run, and delete Azure ML resources using REST

tk applies to boilerplate. tk

There are several ways to manage your Azure ML resources. You can use the [portal](tk), [command-line interface](tk), or [Python SDK](tk). 
Or, you can use the REST API. The REST API uses HTTP verbs in a standard way to create, retrieve, update, and delete resources. The REST
API can be used from any language or tool capable of making HTTP requests. REST's straightforward structure often makes it a good choice in scripting environments and for MLOps automation. 

In this article, you learn how to:

> [!div class="checklist"]
> * Retrieve an authorization token
> * Create a properly-formatted REST request using service principal authentication
> * Use GET requests to retrieve information about Azure ML's hierarchical resources
> * Use POST requests to create resources, run training experiments and pipelines, and score against deployed models
> * Use DELETE requests to clean up resources 


If you don’t have a <service> subscription, create a free trial account...
<!--- Required, if a free trial account exists
Because tutorials are intended to help new customers use the product or
service to complete a top task, include a link to a free trial before the
first H2, if one exists. You can find listed examples in
[Write tutorials](contribute-how-to-mvc-tutorial.md)
--->

<!---Avoid notes, tips, and important boxes. Readers tend to skip over
them. Better to put that info directly into the article text.--->

## Prerequisites

- workspace. You'll need your 
- Administrative REST requests use service principal authentication. Follow the steps in [Set up authentication for Azure Machine Learning resources and workflows](how-to-setup-authentication#set-up-service-principal-authentication) to create a service principal in your workspace. 
- The **curl** utility. This is available in the [Windows Subsystem for Linux](https://aka.ms/wslinstall/) or any UNIX distribution. In PowerShell, **curl** is an alias for **Invoke-WebRequest** and `curl -d "key=val" -X POST uri` becomes `Invoke-WebRequest -Body "key=val" -Method POST -Uri uri`. tk TODO: Confirm that all my curl requests work in PS tk. This article uses curl since it is very widely available, but the [source code](tk) uses [Postman](tk), a tool that allows developers to organize requests, swap in variables, and view request and response details in an easy-to-use manner. 


## Retrieve a service principal authentication token

Administrative REST requests are authenticated by a token provided by your workspace's service principal. In order to retrieve this, you will need:

- Your tenantid (identifying the organization to which your subscription belongs)
- Your client id (which will be associated with the created token)
- Your client secret (which you should safeguard)

You should have these values from the response to the creation of your service principal (as discussed in [Set up authentication for Azure Machine Learning resources and workflows](how-to-setup-authentication#set-up-service-principal-authentication). If you are using your company subscription, it is possible that you do not have sufficient permissions to create a service principal. In that case, you should use a personal subscription, such as that provided with your Visual Studio subscription or (tk free? tk)

To retrieve a token, open a terminal window and, substituting your own values as appropriate, run:

```bash
curl -d "grant_type=client_credentials&resource=https%3A%2F%2Fmanagement.azure.com%2F&client_id=your-client-id&client_secret=your-client-secret" \
-X POST https://login.microsoftonline.com/your-tenant-id/oauth2/token
```

The response should provide an access token good for one hour:

```json
{
    "token_type": "Bearer",
    "expires_in": "3599",
    "ext_expires_in": "3599",
    "expires_on": "1578523094",
    "not_before": "1578519194",
    "resource": "https://management.azure.com/",
    "access_token": "your-access-token"
}
```

Make note of the token, as you will use it to authenticate all subsequent administrative requests. You will do so by setting an Authorization header in all requests:

```bash
curl -h "Authentication: Bearer your-access-token" ...more args...
```

Note that the value starts with the string "Bearer " including a single space before you add the token.

## Get a list of resource groups associated with your subscription

| Resource | Verb | Description | 
| ResourceGroups | GET | tk | 

To retrieve the list of resource groups associate with your subscription, run:

```bash
curl https://management.azure.com/subscriptions/your-subscription-id/resourceGroups?api-version=2019-11-01 -H "Authorization: Bearer your-access-token"
```

Across Azure, many REST APIs are published. Each service provider updates their API on their own cadence, but must do so without breaking existing programs. The `api-version` argument varies from service to service. For the Machine Learning Service, for instance, the current API version is `2019-11-01`. For storage accounts, it's 2019-06-01. For key vaults, it's 2019-09-01. All REST calls should set the `api-version` argument to the expected value. You can rely on the syntax and semantics of the specified version even as the API continues to evolve. If you send a request to a provider without the `api-version` argument, the response will contain a human-readable list of supported values. 

The above call will result in a compacted JSON response of the form: 

```json
{
    "value": [
        {
            "id": "/subscriptions/119ec674-a66c-4b3b-8514-57cb582c4c8c/resourceGroups/RG1",
            "name": "RG1",
            "type": "Microsoft.Resources/resourceGroups",
            "location": "westus2",
            "properties": {
                "provisioningState": "Succeeded"
            }
        },
        {
            "id": "/subscriptions/119ec674-a66c-4b3b-8514-57cb582c4c8c/resourceGroups/RG2",
            "name": "RG2",
            "type": "Microsoft.Resources/resourceGroups",
            "location": "eastus",
            "properties": {
                "provisioningState": "Succeeded"
            }
        }
    ]
}
```

## Drill down into workspaces and their resources

To retrieve the set of workspaces in a resource group, run the following, substituting `your-subscription-id`, `your-resource-group`, and `your-access-token`: 

```
curl https://management.azure.com/subscriptions/your-subscription-id/resourceGroups/your-resource-group/providers/Microsoft.MachineLearningServices/workspaces/?api-version=2019-11-01 \
-H "Authorization: Bearer your-access-token"
```

Again you'll receive a JSON list, this time containing a list, each item of which details a workspace:

```json
{
    "id": "/subscriptions/119ec674-a66c-4b3b-8514-57cb582c4c8c/resourceGroups/DeepLearning5RG/providers/Microsoft.MachineLearningServices/workspaces/laobri-rest",
    "name": "laobri-rest",
    "type": "Microsoft.MachineLearningServices/workspaces",
    "location": "centralus",
    "tags": {},
    "etag": null,
    "properties": {
        "friendlyName": "",
        "description": "",
        "creationTime": "2020-01-03T19:56:09.7588299+00:00",
        "storageAccount": "/subscriptions/119ec674-a66c-4b3b-8514-57cb582c4c8c/resourcegroups/deeplearning5rg/providers/microsoft.storage/storageaccounts/laobrirest0275623111",
        "containerRegistry": null,
        "keyVault": "/subscriptions/119ec674-a66c-4b3b-8514-57cb582c4c8c/resourcegroups/deeplearning5rg/providers/microsoft.keyvault/vaults/laobrirest2525649324",
        "applicationInsights": "/subscriptions/119ec674-a66c-4b3b-8514-57cb582c4c8c/resourcegroups/deeplearning5rg/providers/microsoft.insights/components/laobrirest2053523719",
        "hbiWorkspace": false,
        "workspaceId": "12284440-cb1d-494f-92f2-be4dcd7d5297",
        "subscriptionState": null,
        "subscriptionStatusChangeTimeStampUtc": null,
        "discoveryUrl": "https://centralus.experiments.azureml.net/discovery"
    },
    "identity": {
        "type": "SystemAssigned",
        "principalId": "353497de-bc6d-493c-820a-36d10083ecfe",
        "tenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47"
    },
    "sku": {
        "name": "Basic",
        "tier": "Basic"
    }
}
```
Deployed ML Web services use token-based authentication. 


Sign in to the [<service> portal](url).
<!---If you need to sign in to the portal to do the tutorial, this H2 and
link are required.--->

## Procedure 1

<!---Required:
Tutorials are prescriptive and guide the customer through an end-to-end
procedure. Make sure to use specific naming for setting up accounts and
configuring technology.
Don't link off to other content - include whatever the customer needs to
complete the scenario in the article. For example, if the customer needs
to set permissions, include the permissions they need to set, and the
specific settings in the tutorial procedure. Don't send the customer to
another article to read about it.
In a break from tradition, do not link to reference topics in the
procedural part of the tutorial when using cmdlets or code. Provide customers what they need to know in the tutorial to successfully complete
the tutorial.
For portal-based procedures, minimize bullets and numbering.
For the CLI or PowerShell based procedures, don't use bullets or
numbering.
--->

Include a sentence or two to explain only what is needed to complete the
procedure.

1. Step 1 of the procedure
1. Step 2 of the procedure
1. Step 3 of the procedure
   ![Browser](media/contribute-how-to-mvc-tutorial/browser.png)
   <!---Use screenshots but be judicious to maintain a reasonable length. 
   Make sure screenshots align to the
   [current standards](https://review.docs.microsoft.com/help/contribute/contribute-how-to-create-screenshot?branch=master).
   If users access your product/service via a web browser the first 
   screenshot should always include the full browser window in Chrome or
   Safari. This is to show users that the portal is browser-based - OS 
   and browser agnostic.--->
1. Step 4 of the procedure

## Procedure 2

Include a sentence or two to explain only what is needed to complete the procedure.

1. Step 1 of the procedure
1. Step 2 of the procedure
1. Step 3 of the procedure

## Procedure 3

Include a sentence or two to explain only what is needed to complete the
procedure.
<!---Code requires specific formatting. Here are a few useful examples of
commonly used code blocks. Make sure to use the interactive functionality
where possible.

For the CLI or PowerShell based procedures, don't use bullets or
numbering.
--->

Here is an example of a code block for Java:

```java
cluster = Cluster.build(new File("src/remote.yaml")).create();
...
client = cluster.connect();
```

or a code block for Azure CLI:

```azurecli-interactive 
az vm create --resource-group myResourceGroup --name myVM --image win2016datacenter --admin-username azureuser --admin-password myPassword12
```

or a code block for Azure PowerShell:

```azurepowershell-interactive
New-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer -Image microsoft/iis:nanoserver -OsType Windows -IpAddressType Public
```


## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
2. ...click Delete, type...and then click Delete

<!---Required:
To avoid any costs associated with following the tutorial procedure, a
Clean up resources (H2) should come just before Next steps (H2)
--->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-get-started-mvc.md)

<!--- Required:
Tutorials should always have a Next steps H2 that points to the next
logical tutorial in a series, or, if there are no other tutorials, to
some other cool thing the customer can do. A single link in the blue box
format should direct the customer to the next article - and you can
shorten the title in the boxes if the original one doesn’t fit.
Do not use a "More info section" or a "Resources section" or a "See also
section". --->