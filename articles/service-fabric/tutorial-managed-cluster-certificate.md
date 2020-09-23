---
title: Add a client certificate to a Service Fabric managed cluster (preview)
description: In this tutorial, learn how to add a client certificate Service Fabric managed cluster.
ms.topic: tutorial
ms.date: 07/31/2020
---

# Tutorial: Add a client certificate to a Service Fabric managed cluster (preview)

In this tutorial series we will discuss:

> [!div class="checklist"]
> * [How to deploy a Service Fabric managed cluster.](tutorial-managed-cluster-deploy.md) 
> * [How to scale out a Service Fabric managed cluster](tutorial-managed-cluster-scale.md)
> * [How to add and remove nodes in a Service Fabric managed cluster](tutorial-managed-cluster-add-remove-node-type.md)
> * How to add a certificate to a Service Fabric managed cluster
> * [How to upgrade your Service Fabric managed cluster resources](tutorial-managed-cluster-upgrade.md)

This part of the series covers how to:

> [!div class="checklist"]
> * How to add a certificate to a Service Fabric managed cluster

## Prerequisites

* A Service Fabric managed cluster (see [*Deploy a managed cluster*](tutorial-managed-cluster-deploy.md)).
* [Azure PowerShell 4.7.0](https://docs.microsoft.com/en-us/powershell/azure/release-notes-azureps?view=azps-4.7.0#azservicefabric) or later (see [*Install Azure PowerShell*](https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-4.7.0)).

## Obtain a certificate

You'll want to make sure you have a certificate ready for use with a Service Fabric cluster. If you don't already have one, follow [these steps](/dotnet/framework/wcf/feature-details/how-to-create-temporary-certificates-for-use-during-development) to obtain a self-signed certificate for development use.

## Deploying a Service Fabric managed cluster with a certificate

If we take a look at the template used in [Deploy a Service Fabric managed cluster](tutorial-managed-cluster-deploy.md), there are parameters corresponding to a client certificate thumbprint in a few places. This thumbprint is used to authenticate client connections to the managed cluster.


```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
    "contentVersion": "1.0.0.0",
    "parameters": {
        ... ,
        "clientCertificateThumbprint": {
            "type": "string",
            "defaultValue": "<your-cert-thumb>"
        },
```

```json
    ...,
    "resources": [
        {
            ...,
            "properties": {
                ...,
                "clients" : [
                    {
                        "isAdmin" : true,
                        "thumbprint" : "<your-cert-thumb>"
                    }
                ]
```

To deploy a new cluster using a certificate, replace the existing value with the thumbprint for your certificate and deploy.

```powershell
New-AzResourceGroupDeployment -Name <your-resource-name> -ResourceGroupName <your-rg> -TemplateFile .\template-cluster-default-2nt.json -clusterName <your-cluster-name> -nodeType1Name FE -nodeType2Name BE -nodeType1vmInstanceCount 5 -nodeType2vmInstanceCount 3 -adminPassword $password -Verbose
```

## Add a client certificate to an existing Service Fabric managed cluster

To add a client certificate, first obtain the resource ID of the Service Fabric managed cluster. Create a custom Powershell object with the properties of the new certificate, and append it to the array of clients in the cluster's properties. To trigger changes, set the resource.

```powershell
$cluster = Get-AzResource -ResourceId <your-cluster-resource-id>
$newCert = [PSCustomObject]@{
    isAdmin = '<True/False>'
    thumbprint = '<your-cert-thumb>'
}
$cluster.properties.clients += $newCert 
$cluster | Set-AzResource

```

An upgrade will begin automatically after which your client certificate will be integrated in the cluster.

## Cleaning Up

Congratulations! You've learned about client certificates in a Service Fabric managed cluster. When no longer needed, simply delete the cluster resource or the resource group.

## Next steps

 In this step we looked at client certificate management in a Service Fabric managed cluster. To learn more about Service Fabric managed clusters, see:

> [!div class="nextstepaction"]
> [Service Fabric managed clusters overview](./overview-managed-cluster.md)
