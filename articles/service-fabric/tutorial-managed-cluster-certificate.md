---
title: Add a client certificate to a Managed Service Fabric cluster (preview)
description: In this tutorial, learn how to add a client certificate Managed Service Fabric cluster.
ms.topic: tutorial
ms.date: 07/31/2020
---

# Tutorial: Add a client certificate to a Managed Service Fabric cluster (preview)

In this tutorial series we will discuss:

> [!div class="checklist"]
> * [How to deploy a Managed Service Fabric cluster.](tutorial-managed-cluster-deploy.md) 
> * [How to scale out a Managed Service Fabric cluster](tutorial-managed-cluster-scale.md)
> * [How to add and remove nodes in a Managed Service Fabric cluster](tutorial-managed-cluster-add-remove-node-type.md)
> * How to add a certificate to a Managed Service Fabric cluster
> * [How to upgrade your Managed Service Fabric cluster resources](tutorial-managed-cluster-upgrade.md)

This part of the series covers how to:

> [!div class="checklist"]
> * Add a node type to a Managed Service Fabric cluster
> * Delete a node type from a Managed Service Fabric cluster

## Prerequisites

Before you begin this tutorial:
* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)

## Deploying a Managed Service Fabric cluster with a certificate

If we take a look at the template used in [Deploy a Managed Service Fabric cluster](tutorial-managed-cluster-deploy.md), there are parameters corresponding to a client certificate thumbprint in a few places. This thumbprint is used to authenticate client connections to the managed cluster.


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

## Add a client certificate to an existing Managed Service Fabric cluster

To add a client certificate, first obtain the resource ID of the Managed Service Fabric cluster. Create a custom Powershell object with the properties of the new certificate, and append it to the array of clients in the cluster's properties. To trigger changes, set the resource.

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

Congratulations! You've learned about client certificates in a Managed Service Fabric cluster. When no longer needed, simply delete the cluster resource or the resource group.

## Next steps

In this step we looked at client certificate management in a Managed Service Fabric cluster. To learn more about upgrading a cluster, see:

> [!div class="nextstepaction"]
> [Upgrade a Managed Service Fabric cluster](./tutorial-managed-cluster-upgrade.md)
