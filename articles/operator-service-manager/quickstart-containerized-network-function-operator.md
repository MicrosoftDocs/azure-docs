---
title: Prerequisites for Operator and Containerized Network Function (CNF)
description: Install the necessary prerequisites for Operator and Containerized Network Function (CNF).
author: sherrygonz
ms.author: sherryg
ms.date: 09/07/2023
ms.topic: quickstart
ms.service: azure-operator-service-manager
---

# Quickstart: Prerequisites for Operator and Containerized Network Function (CNF)

 This quickstart contains the prerequisite tasks for Operator and Containerized Network Function (CNF). While it's possible to automate these tasks within your NSD (Network Service Definition), in this quickstart, the actions are performed manually.

> [!NOTE]
> The tasks presented in this article may require some time to complete.

## Permissions

In order to complete these prerequisites for Operator and Containerized Network Function, you 
need an Azure subscription where you have the *Contributor* role (in order to create a Resource Group) and you need to be able to attain the *Owner* or *User Access Administrator* role over this Resource Group. Alternatively, you need an existing Resource Group where you have the ‘Owner’ or ‘User Access Administrator’ Role.

You also need the *Owner* or *User Access Administrator* role in the Network Function Definition Publisher Resource Group. The Network Function Definition Publisher Resource Group was created in [Quickstart: Publish Nginx container as Containerized Network Function (CNF)](quickstart-publish-containerized-network-function-definition.md) and named nginx-publisher-rg in the input.json file.

## Set environment variables

Adapt the environment variable settings and references as needed for your particular environment. For example, in Windows PowerShell, you would set the environment variables as follows:

```powershell
$env:ARC_RG=<my rg>
``````

To use an environment variable, you would reference it as `$env:ARC_RG`.

```bash
export resourceGroup=<replace with resourcegroup name>
export location=<region>
export clusterName=<replace with clustername>
export customlocationId=${clusterName}-custom-location
export extensionId=${clusterName}-extension
```

## Create Resource Group

Create a Resource Group to host your Azure Kubernetes Service (AKS) cluster.

```azurecli
az account set --subscription <subscription>
az group create -n ${resourceGroup} -l ${location}
``````

## Provision Azure Kubernetes Service (AKS) cluster

Follow the instructions here [Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster using Azure CLI](../aks/learn/quick-kubernetes-deploy-cli.md) to create the Azure Kubernetes Service (AKS) cluster within the previously created Resource Group.


> [!NOTE]
> Ensure that `agentCount` is set to 1. Only one node is required at this time.

```azurecli
az aks create -g ${resourceGroup} -n ${clusterName} --node-count 1 --generate-ssh-keys
``````

## Enable Azure Arc

Enable Azure Arc for the Azure Kubernetes Service (AKS) cluster. Follow the prerequisites outlined in 
[Create and manage custom locations on Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/custom-locations.md).

## Retrieve the config file for AKS cluster
```azurecli
az aks get-credentials --resource-group ${resourceGroup} --name ${clusterName}
``````

## Create a connected cluster

Create the cluster:

```azurecli
az connectedk8s connect --name ${clusterName} --resource-group ${resourceGroup}
``````

## Register your subscription
Register your subscription to the Microsoft.ExtendedLocation resource provider:

```azurecli
az provider register --namespace Microsoft.ExtendedLocation
``````


### Enable custom locations

Enable custom locations on the cluster:

```azurecli
az connectedk8s enable-features -n ${clusterName} -g ${resourceGroup} --features cluster-connect custom-locations
``````

### Connect cluster

Connect the cluster:

```azurecli
az connectedk8s connect --name ${clusterName} -g ${resourceGroup} --location $location
``````

### Create extension

Create an extension:

```azurecli
az k8s-extension create -g ${resourceGroup} --cluster-name ${clusterName} --cluster-type connectedClusters --name ${extensionId} --extension-type microsoft.azure.hybridnetwork --release-train preview --scope cluster
```

### Create custom location

Create a custom location:

```azurecli
export ConnectedClusterResourceId=$(az connectedk8s show --resource-group ${resourceGroup} --name ${clusterName} --query id -o tsv)
export ClusterExtensionResourceId=$(az k8s-extension show -c $clusterName -n $extensionId -t connectedClusters -g ${resourceGroup} --query id -o tsv)
az customlocation create -g ${resourceGroup} -n ${customlocationId} --namespace "azurehybridnetwork" --host-resource-id $ConnectedClusterResourceId --cluster-extension-ids $ClusterExtensionResourceId
``````

## Retrieve custom location value

Retrieve the Custom location value. You need this information to fill in the Configuration Group values for your Site Network Service (SNS).

Search for the name of the Custom location (customLocationId) in the Azure portal, then select Properties. Locate the full Resource ID under the Essentials information area and look for field name ID. The following image provides an example of where the Resource ID information is located.

:::image type="content" source="media/retrieve-azure-arc-custom-location-value.png" alt-text="Screenshot showing the search field and Properties  information.":::


> [!TIP]
> The full Resource ID has a format of: /subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/microsoft.extendedlocation/customlocation/{customLocationName}

## Create User Assigned Managed Identity for the Site Network Service

1. Save the following Bicep script locally as *prerequisites.bicep*.

    ```azurecli
    param location string = resourceGroup().location
    param identityName string = 'identity-for-nginx-sns'
    
    
    resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = {
      name: identityName
      location: location
    }
    output managedIdentityId string = managedIdentity.id
    ```

1. Start the deployment of the User Assigned Managed Identity by issuing the following command.

     ```azurecli
     az deployment group create --name prerequisites --resource-group ${resourceGroup}  --template-file prerequisites.bicep
     ```

1. The script creates a managed identity.  

## Retrieve Resource ID for managed identity

1. Run the following command to find the resource ID of the created managed identity.

    ```azurecli
    az deployment group list -g ${resourceGroup} | jq -r --arg Deployment prerequisites '.[] | select(.name == $Deployment).properties.outputs.managedIdentityId.value'
    ```

1. Copy and save the output, which is the resource identity. You need this output when you create the Site Network Service.

## Update Site Network Service (SNS) permissions

To perform these tasks, you need either the 'Owner' or 'User Access Administrator' role in both the operator and the Network Function Definition Publisher Resource Groups. You created the operator Resource Group in prior tasks. The Network Function Definition Publisher Resource Group was created in [Quickstart: Publish Nginx container as Containerized Network Function (CNF)](quickstart-publish-containerized-network-function-definition.md) and named nginx-publisher-rg in the input.json file.

In prior steps, you created a Managed Identity labeled identity-for-nginx-sns inside your reference resource group. This identity plays a crucial role in deploying the Site Network Service (SNS). Follow the steps in the next sections to grant the identity the 'Contributor' role over the Publisher Resource Group and the Managed Identity Operator role over itself. Through this identity, the Site Network Service (SNS) attains the required permissions.

### Grant Contributor role over publisher Resource Group to Managed Identity

1. Access the Azure portal and open the Publisher Resource Group created when publishing the Network Function Definition.

1. In the side menu of the Resource Group, select **Access Control (IAM)**.

1. Choose Add **Role Assignment**.

    :::image type="content" source="media/add-role-assignment-publisher-resource-group-containerized.png" alt-text="Screenshot showing the publisher resource group add role assignment.":::

1. Under the **Privileged administrator roles**, category pick *Contributor* then proceed with **Next**.

    :::image type="content" source="media/privileged-admin-roles-contributor-resource-group.png" alt-text="Screenshot showing the privileged administrator role with contributor selected.":::

1. Select **Managed identity**.

1. Choose **+ Select members** then find and choose the user-assigned managed identity **identity-for-nginx-sns**.

    :::image type="content" source="media/how-to-create-user-assigned-managed-identity-select-members.png" alt-text="Screenshot showing the select managed identities with user assigned managed identity.":::

### Grant Managed Identity Operator role to itself

1. Go to the Azure portal and search for **Managed Identities**.

1. Select *identity-for-nginx-sns* from the list of **Managed Identities**.

1. On the side menu, select **Access Control (IAM)**.

1. Choose **Add Role Assignment**.

    :::image type="content" source="media/how-to-create-user-assigned-managed-identity-operator.png" alt-text="Screenshot showing identity for nginx sns add role assignment.":::

1. Select the **Managed Identity Operator** role then proceed with **Next**.

    :::image type="content" source="media/add-role-assignment-managed-identity-operator-containerized.png" alt-text="Screenshot showing add role assignment with managed identity operator selected.":::

1. Select **Managed identity**.

1. Select **+ Select members** and navigate to the user-assigned managed identity called *identity-for-nginx-sns* and proceed with the assignment.

    :::image type="content" source="media/how-to-create-user-assigned-managed-identity-select-members.png" alt-text="Screenshot showing the select managed identities with user assigned managed identity.":::

1. Select **Review and assign**.

Completion of all the tasks outlined in these articles ensure that the Site Network Service (SNS) has the necessary permissions to function effectively within the specified Azure environment.

## Next steps

- [Quickstart: Create a Containerized Network Functions (CNF) Site with Nginx](quickstart-containerized-network-function-create-site.md)