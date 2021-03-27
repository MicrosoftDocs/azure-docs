---
title: Create Azure Arc data controller | Direct connect mode
description: Explains how to deploy the data controller in direct connect mode. 
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 03/31/2021
ms.topic: overview
---

#  Create Azure Arc data controller | Direct connect mode

[!NOTE] The steps described in this article apply to the preview release.

To create an Azure Arc data controller in direct connectivity mode involves the following steps:

- Connect a Kubernetes cluster to Azure using Azure Arc enabled Kubernetes
- Create an Azure Arc enabled data services extension
- Create a custom location
- Deploy the data controller to the custom location

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Connect a Kubernetes cluster to Azure using Azure Arc enabled Kubernetes

First, [Connect an existing Kubernetes cluster to Azure Arc](../kubernetes/quickstart-connect-cluster.md) following the steps described in this article.

## Create an Azure Arc enabled data services extension

#TODO - describe at a high level what an extension is and why this is necessary.

Download the [extensions.json](https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/direct-mode/extension.json) and [extension.parameters.json](https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/direct-mode/extension.parameters.json) files.

Edit the ```extension.parameters.json``` file to update the parameters.

For example:

``` json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "connectedCluster": {
            "value": "mycluster"
        },
        "extensionName": {
            "value": "extArcData" 
        },
        "targetNamespace": {
            "value": "arc" 
        },
        "targetReleaseTrain": {
            "value": "preview" 
        },
        "targetLocation": {
            "value": "eastus" 
        },
        "imagePullPolicy": {
            "value": "Always" 
        },
        "registry": {
            "value": "mcr.microsoft.com" 
        },
        "repository": {
            "value": "arcdata" 
        },
        "imageTag": {
            "value": "latest" 
        },
        "version": {
            "value": "1.0.015421"
        }
    }
}
```

#TODO: Let's reorganize this to put the ones that we want them to change at the top - connectedCluster, targetNamespace then followed by ones that we can default and they are unlikely to change - extensionName, targetLocation.  The rest should not be changed.  Let's document what we expect people to change here and what each of these things means.

Then, run the below command from a terminal to create the Arc enabled data services extension on the Arc enabled Kubernetes cluster.

#TODO: Why isnt the example using the az k8s-extension create command?

``` terminal
az deployment group create -g <resource group> --template-file extensions.json --parameters @extensions.parameters.json
```

### Verify the Arc data services extension is created

- Login to the Azure portal and browse to the resource group where the Kubernetes connected cluster resource is located.
- Select the Arc enabled kubernetes cluster (Type = "Kubernetes - Azure Arc") where the extension was deployed.
- In the navigation on the left side, under **Settings**, select "Extensions (preview)".
- You should see the extension that was just created earlier in an "Installed" state.

### Verify the Arc enabled data services extension bootstrapper pod is created

Connect to your Kubernetes cluster via a Terminal window.

Run the below command and ensure the (1) namespace mentioned above is created and (2) the bootstrapper pod is in 'running' state before proceeding to the next step.

``` terminal
kubectl get pods -n <name of namespace used in the json template file above>

#Example:
# kubectl get pods -n arc
```

## Create a Custom Location

A Custom Location is an Azure resource that is equivalent to a namespace in a kubernetes cluster.  Custom Locations are used as a target to deploy resources to from Azure.

Download the [customLocation.json](https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/direct-mode/customLocation.json) and [customLocation.parameters.json](https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/direct-mode/customLocation.parameters.json) files.

Edit the ```customLocation.parameters.json``` file to update the parameters.

For example:

``` json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "customLocationName": {
            "value": "clArcData"
        },
        "targetNamespace": {
            "value": "arc" 
        },
        "targetLocation": {
            "value": "eastus" 
        },
        "sub": {
            "value": "1523401a-129a-7f6a-36z4-fg6e12345a2" 
        },
        "rg": {
            "value": "myresourcegroup" 
        },
        "connectedCluster": {
            "value": "mycluster" 
        },
        "extensionName": {
            "value": "extArcData" 
        }
    }
}
```

Edit the values as appropriate and run the below command from a terminal to create the Custom Location on the Arc enabled kubernetes cluster. 

#TODO: Why isnt the example using the az customlocation create command?

``` terminal
az deployment group create -g dn-clusters --template-file extensions.json --parameters @extensions.parameters.json
```

### Verify the Custom Location is created

From the terminal, run the below command to list the custom locations, and validate that the **Provisioning State** shows Succeeded:

#TODO: Should use the az customlocation list or show commands

```
az resource show -g myresourcegroup --resource-type  "Microsoft.ExtendedLocation/customLocations" -n clArcData
```

## Create the Azure Arc data controller

After the extension and custom location are created, proceed to Azure portal to deploy the Azure Arc data controller.

- Search for "Azure Arc data controller" in the Azure marketplace and initiate the Create flow.
- In the **Prerequisites** section, ensure that the Azure Arc enabled Kubernetes cluster (direct mode) is selected and proceed to the next step.
- In the **Data controller details** section, choose a subscription, resource group and Azure location just like you would for any other resource that you would create in the Azure portal. In this case, the Azure location that you select will be where the metadata about the resource will be stored. The resource itself will be created on whatever infrastructure you choose. It doesn't need to be on Azure infrastructure.
- Enter a name for the data controller
- Choose a configuration profile based on the Kubernetes distribution provider you are deploying to.
- Choose the Custom Location that you created in the previous step.
- Provide details for the data controller administrator login and password
- Provide details for ClientId, TenantId and Client Secret for the Service Principal that would be used to create the Azure objects. Please refer to [Upload metrics](https://docs.microsoft.com/azure/azure-arc/data/upload-metrics-and-logs-to-azure-monitor?pivots=client-operating-system-windows-command) article that has detailed instructions on creating a Service Principal account and the roles that needed to be granted for the account.
#TODO: Seems like we need to pull the Service Principal creation thing out into its own topic now and have that be one of the prerequisite steps before getting to this point.  Feels weird to jump from here to the upload metrics article.
- Click Next, review the summary page for all the details and click on **Create**.

#TODO: Need to document how to verify data controller deployment is successful.
