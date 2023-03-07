---
title: Create a private cluster with Azure Red Hat OpenShift 3.11
description: Learn how to create a private cluster with Azure Red Hat OpenShift 3.11 and about the benefits of private clusters.
author: konghot
ms.author: pkonghot
ms.service: azure-redhat-openshift
ms.topic: how-to
ms.date: 06/02/2022
ms.custom: kr2b-contr-experiment
keywords: aro, openshift, private cluster, red hat
#Customer intent: As a customer, I want to create a private cluster on ARO OpenShift.
---

# Create a private cluster with Azure Red Hat OpenShift 3.11

> [!IMPORTANT]
> Azure Red Hat OpenShift 3.11 will be retired. Following retirement, remaining Azure Red Hat OpenShift 3.11 clusters will be shut down to prevent security vulnerabilities.
>
> Follow this guide to [create an Azure Red Hat OpenShift 4 cluster](tutorial-create-cluster.md).
> If you have specific questions, [contact us](mailto:arofeedback@microsoft.com).

Private clusters provide the following benefits:

* Private clusters don't expose cluster control plane components, such as the API servers, on a public IP address.
* The virtual network of a private cluster is configurable by customers. You can set up networking to allow peering with other virtual networks, including ExpressRoute environments. You can also configure custom DNS on the virtual network to integrate with internal services.

## Before you begin

The fields in the following configuration snippet are new and must be included in your cluster configuration. `managementSubnetCidr` must be within the cluster virtual network and is used by Azure to manage the cluster.

```json
properties:
 networkProfile:
   managementSubnetCidr: 10.0.1.0/24
 masterPoolProfile:
   apiProperties:
     privateApiServer: true
```

A private cluster can be deployed using the sample scripts provided below. Once the cluster is deployed, run the `cluster get` command and view the `properties.FQDN` property to determine the private IP address of the OpenShift API server.

The cluster virtual network is created with permissions so that you can modify it. You can set up networking to access the virtual network, such as ExpressRoute, VPN, and virtual network peering.

If you change the DNS nameservers on the cluster virtual network, issue an update on the cluster with the `properties.RefreshCluster` property set to `true` so that the virtual machines can be reimaged. This update allows them to pick up the new nameservers.

## Sample configuration scripts

Use the sample scripts in this section to set up and deploy your private cluster.

### Environment

Fill in the environment variables below as using your own values.

> [!NOTE]
> The location must be set to `eastus2` because this is currently the only supported location for private clusters.

``` bash
export CLUSTER_NAME=
export LOCATION=eastus2
export TOKEN=$(az account get-access-token --query 'accessToken' -o tsv)
export SUBID=
export TENANT_ID=
export ADMIN_GROUP=
export CLIENT_ID=
export SECRET=
```

### private-cluster.json

This sample is a cluster configuration with private cluster enabled. It uses the environment variables defined above.

```json
{
   "location": "$LOCATION",
   "name": "$CLUSTER_NAME",
   "properties": {
       "openShiftVersion": "v3.11",
       "networkProfile": {
           "vnetCIDR": "10.0.0.0/8",
           "managementSubnetCIDR" : "10.0.1.0/24"
       },
       "authProfile": {
           "identityProviders": [
               {
                   "name": "Azure AD",
                   "provider": {
                       "kind": "AADIdentityProvider",
                       "clientId": "$CLIENT_ID",
                       "secret": "$SECRET",
                       "tenantId": "$TENANT_ID",
                       "customerAdminGroupID": "$ADMIN_GROUP"
                   }
               }
           ]
       },
       "masterPoolProfile": {
           "name": "master",
           "count": 3,
           "vmSize": "Standard_D4s_v3",
           "osType": "Linux",
           "subnetCIDR": "10.0.0.0/24",
           "apiProperties": {
                "privateApiServer": true
            }
       },
       "agentPoolProfiles": [
           {
               "role": "compute",
               "name": "compute",
               "count": 1,
               "vmSize": "Standard_D4s_v3",
               "osType": "Linux",
               "subnetCIDR": "10.0.0.0/24"
           },
           {
               "role": "infra",
               "name": "infra",
               "count": 3,
               "vmSize": "Standard_D4s_v3",
               "osType": "Linux",
               "subnetCIDR": "10.0.0.0/24"
           }
       ],
       "routerProfiles": [
           {
               "name": "default"
           }
       ]
   }
}
```

## Deploy a private cluster

After configuring your private cluster with the sample scripts above, run the following command to deploy your private cluster.

``` bash
az group create --name $CLUSTER_NAME --location $LOCATION
cat private-cluster.json | envsubst | curl -v -X PUT \
-H 'Content-Type: application/json; charset=utf-8' \
-H 'Authorization: Bearer '$TOKEN'' -d @- \
 https://management.azure.com/subscriptions/$SUBID/resourceGroups/$CLUSTER_NAME/providers/Microsoft.ContainerService/openShiftManagedClusters/$CLUSTER_NAME?api-version=2019-10-27-preview
```

## Next steps

To learn about how to access the OpenShift console, see [Web Console Walkthrough](https://docs.openshift.com/container-platform/3.11/getting_started/developers_console.html).
