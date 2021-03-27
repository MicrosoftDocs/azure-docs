---
title: Prerequisites | Direct connect mode
description: Prerequisites to deploy the data controller in direct connect mode. 
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 03/31/2021
ms.topic: overview
---

# Prerequisites 

The following tools should be installed on your local computer.

- Helm version 3.3+ ([install](https://helm.sh/docs/intro/install/))
- Azure CLI ([install](/cli/azure/install-azure-cli))
- Azure data CLI (`azdata`)([install](/sql/azdata/install/deploy-install-azdata))

## Configure the subscription

Run the following commands using the Azure CLI (az).  **Set the subscription ID in the command before you run it.**

```console
az provider register --namespace Microsoft.AzureArcData --subscription <subscription id> --wait

az feature register --namespace Microsoft.ExtendedLocation --name  CustomLocations-ppauto --subscription <subscription id>

az feature register --namespace Microsoft.KubernetesConfiguration --name extensions --subscription <subscription id>

az provider register --namespace Microsoft.ExtendedLocation --subscription <subscription id> --wait

az provider register --namespace Microsoft.Kubernetes --subscription <subscription id> --wait

az provider register --namespace Microsoft.KubernetesConfiguration --subscription <subscription id> --wait
```

## Create an onboarding service principal

Follow the directions in the Arc enabled Kubernetes documentation to create an onboarding service principal and assign it the required permissions.

>[!NOTE]
> Follow the instructions to create the service principal and assign it permissions.  Do not follow the last step in the linked documentation article below to actually onboard the Kubernetes cluster.  That will be done in the following steps in this article.

[Create onboarding service principal](../kubernetes/create-onboarding-service-principal.md).

In addition to role assigned in the article the following additional roles need to be assigned.  Be sure to replace the app ID using the `appID` value from the JSON output of creating the service principal in the linked article above.  Also change the subscription ID to be the ID of the subscription in which the service principal was created.

```console
az role assignment create --role "Contributor" --assignee <app ID from preceding article> --scope /subscriptions/<subscription ID>

az role assignment create --role "Monitoring Metrics Publisher" --assignee <app ID from preceding article> --scope /subscriptions/<subscription ID>
```

## Connect your Kubernetes cluster to Azure using Arc enabled Kubernetes

To use Arc enabled data services in the directly connected mode it is required to connect your Kubernetes cluster to Azure using Arc enabled Kubernetes.

### Set environment variables

Set the following environment variables which will be then used in next step.

>[!NOTE]
>The 'client ID' below is the `appId` in the JSON that is returned by the `az ad sp create` command that you ran in the preceding step.  The `client secret` is the `password` value in the JSON.  Example:

```console

{
  "appId": "9a7aa5d1-f475-4a74-aced-e248faasdf12",
  "displayName": "azure-arc-for-k8s-onboarding",
  "name": "https://azure-arc-for-k8s-onboarding",
  "password": "wrd_R74i5bTAJE9Bxy2JI6-8J.oaasdf12",
  "tenant": "asdfasdf-86f1-41af-91ab-2d7cd011db47"
}

```

#### Linux

```console
export tenantID=<tenant ID>
export clientID=<client ID>
export clientSecret=<client secret>

# where you want the connected cluster resource to be created in Azure 
export subscription=<Your subscription ID>
export resourceGroup=<Your resource group>

# this is the connectedCluster resource name
export resourceName=<Your resource name>
export location=<westeurope or eastus>
```

#### Windows PowerShell
``` PowerShell
$ENV:tenantID="<tenant ID>"
$ENV:clientID="<client ID>"
$ENV:clientSecret="<client secret>"

# where you want the connected cluster resource to be created in Azure 
$ENV:subscription="<Your subscription ID>"
$ENV:resourceGroup="<Your resource group>"

# this is the connectedCluster resource name
$ENV:resourceName="<Your resource name>"
$ENV:location="<westeurope or eastus>"
```

### Set the special private preview testing environment variables

These environment variables are used just for private preview testing.  These are shared with your organization under the private preview NDA with Microsoft.  Please do not share publicly.

#### Linux

```console
export HELM_EXPERIMENTAL_OCI=1
export chartVer=0.1.2404-private
```

#### Windows PowerShell

```PowerShell
$ENV:HELM_EXPERIMENTAL_OCI="1"
$ENV:chartVer="0.1.2404-private"
```

### Connect your Kubernetes cluster to Azure using the Arc enabled Kubernetes Helm chart

First run these commands to get the helm chart:

```console
helm chart pull azurearcfork8sdev.azurecr.io/merge/private/azure-arc-k8sagents:$chartVer

helm chart export azurearcfork8sdev.azurecr.io/merge/private/azure-arc-k8sagents:$chartVer --destination .

```

Then, run this command to connect your Kubernetes cluster to Azure using Arc enabled Kubernetes.

#### Linux

```console
helm upgrade azure-arc ./azure-arc-k8sagents --install --set global.subscriptionId="$subscription",global.resourceGroupName="$resourceGroup",global.resourceName="$resourceName",global.location="$location",global.tenantId="$tenantID",global.clientId="$clientID",global.clientSecret="$clientSecret",systemDefaultValues.extensionoperator.enabled=true,systemDefaultValues.clusterconnect-agent.enabled=true,systemDefaultValues.kubeAADProxy.enabled=true,systemDefaultValues.kubeAADProxy.enforcePoP=false,systemDefaultValues.kubeAADProxy.skipHostCheck=true,systemDefaultValues.azureArcAgents.autoUpdate=false,aad.kubernetesServerId=6256c85f-0aad-4d50-b960-e6e9b21efe35,aad.kubernetesClientId=3f4439ff-e698-4d6d-84fe-09c9d574f06b,aad.kubernetesTenantId="$tenantID" --debug
```

#### Windows PowerShell

``` PowerShell
helm upgrade azure-arc ./azure-arc-k8sagents --install --set global.subscriptionId="$ENV:subscription",global.resourceGroupName="$ENV:resourceGroup",global.resourceName="$ENV:resourceName",global.location="$ENV:location",global.tenantId="$ENV:tenantID",global.clientId="$ENV:clientID",global.clientSecret="$ENV:clientSecret",systemDefaultValues.extensionoperator.enabled=true,systemDefaultValues.clusterconnect-agent.enabled=true,systemDefaultValues.kubeAADProxy.enabled=true,systemDefaultValues.kubeAADProxy.enforcePoP=false,systemDefaultValues.kubeAADProxy.skipHostCheck=true,systemDefaultValues.azureArcAgents.autoUpdate=false,aad.kubernetesServerId=6256c85f-0aad-4d50-b960-e6e9b21efe35,aad.kubernetesClientId=3f4439ff-e698-4d6d-84fe-09c9d574f06b,aad.kubernetesTenantId="$ENV:tenantID" --debug

```

### Confirm that everything is deployed correctly

**After a few minutes**, check to make sure everything is deployed correctly by checking for the existence of the Arc enabled Kubernetes connected cluster in the Azure Portal and by running the following command.

```console
kubectl get all -n azure-arc
```

You should see output similar to the following:

```console
NAME                                            READY   STATUS    RESTARTS   AGE
pod/cluster-metadata-operator-dc86d5676-6bchm   2/2     Running   0          2m27s
pod/clusteridentityoperator-7dd695f787-25hcq    3/3     Running   0          2m27s
pod/config-agent-7796bf8b46-5kzxq               3/3     Running   0          2m26s
pod/connect-agent-8cb45c59d-tzzlw               1/1     Running   0          2m27s
pod/controller-manager-6bbcf555df-rh5qw         3/3     Running   0          2m27s
pod/extension-manager-84f4f957c6-8bjn9          3/3     Running   0          2m27s
pod/flux-logs-agent-66b544d855-jb2jf            2/2     Running   0          2m27s
pod/metrics-agent-56bbdf8f74-8w8z2              2/2     Running   0          2m26s
pod/resource-sync-agent-55f97fb7b-vfsbf         3/3     Running   0          2m27s

NAME                                               TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
service/cluster-identity-manager-metrics-service   ClusterIP   10.0.155.15    <none>        8443/TCP   2m27s
service/config-agent-metrics-service               ClusterIP   10.0.118.205   <none>        8443/TCP   2m27s
service/controller-manager-metrics-service         ClusterIP   10.0.54.129    <none>        8443/TCP   2m27s
service/extension-manager-metrics-service          ClusterIP   10.0.203.90    <none>        8443/TCP   2m27s
service/flux-logs-agent                            ClusterIP   10.0.91.40     <none>        80/TCP     2m27s
service/flux-logs-agent-metrics-service            ClusterIP   10.0.189.129   <none>        8443/TCP   2m27s
service/resource-sync-agent-metrics-service        ClusterIP   10.0.225.242   <none>        8443/TCP   2m27s

NAME                                        READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/cluster-metadata-operator   1/1     1            1           2m28s
deployment.apps/clusteridentityoperator     1/1     1            1           2m28s
deployment.apps/config-agent                1/1     1            1           2m28s
deployment.apps/connect-agent               1/1     1            1           2m28s
deployment.apps/controller-manager          1/1     1            1           2m28s
deployment.apps/extension-manager           1/1     1            1           2m28s
deployment.apps/flux-logs-agent             1/1     1            1           2m28s
deployment.apps/metrics-agent               1/1     1            1           2m28s
deployment.apps/resource-sync-agent         1/1     1            1           2m28s

NAME                                                  DESIRED   CURRENT   READY   AGE
replicaset.apps/cluster-metadata-operator-dc86d5676   1         1         1       2m28s
replicaset.apps/clusteridentityoperator-7dd695f787    1         1         1       2m28s
replicaset.apps/config-agent-7796bf8b46               1         1         1       2m28s
replicaset.apps/connect-agent-8cb45c59d               1         1         1       2m28s
replicaset.apps/controller-manager-6bbcf555df         1         1         1       2m28s
replicaset.apps/extension-manager-84f4f957c6          1         1         1       2m28s
replicaset.apps/flux-logs-agent-66b544d855            1         1         1       2m28s
replicaset.apps/metrics-agent-56bbdf8f74              1         1         1       2m28s
replicaset.apps/resource-sync-agent-55f97fb7b         1         1         1       2m28s
```

As a final check, verify that the Arc enabled Kubernetes cluster resource is created in the Azure Portal.

### Deploying the Azure Arc data controller using Cluster Connect

Now that your Kubernetes cluster is connected to Azure, you can use the Cluster Connect feature to deploy the Azure Arc data controller.  Currently the Azure Portal user experience is in development, but the Azure ARM APIs are in place. You can use a HTTP client utility like Postman to call the ARM APIs to trigger the deployment of the Azure Arc data controller.

- Download the Postman collection file (TODO: URL)
- Go to [Postman.com](https://www.postman.com/product/api-client/) and sign up for an account.
- On the Postman home page click on 'Create New -->' under 'Start something new'.
- Click on Import in the top left area to import the collection.  Select the collection file you just downloaded.

#### Get the authentication token for your service account

Click on the '0. Get authentication token' API test.

Click on Send.

If you get a '200 OK' status back then the result was successful and you can proceed.

Copy the value in the 'access_token' property of the JSON response and paste it someplace secure.  You will use it in the next step.  It will be a very long string like this:
`eyJ0eXAiOiJKV1.........ngTgNVxF2NHoi5QmvpPS`.

#### Set variables

Mouse over the collection name 'Arc enabled data services', click on the '...' button and click on Edit.

Click on the Variables tab.

Enter the required variables and confirm the defaults or change them.

|Variable|Default Value|Notes
|---|---|---|
|resource_group||The name of the resource group in which to create the custom location, data controller, and database instances.  Should be the same resource group as the Arc enabled Kubernetes cluster resource|
|connected_cluster_name||The name of the Arc enabled Kubernetes cluster resource in Azure.|
|extension_name|extension-test|The name of the Arc data services extension.|
|custom_location_name|cl-test|The name of the custom location.|
|subscription||The Azure subscription containing the resource group.|
|data_controller_name|arc-dc|The name of the data controller resource in Azure.|
|storage_class||The storage class to be used for all persistent volumes.|
|client_id||The "appId" of the service principal created above.|
|client_secret||The "password" of the service principal created above.|
|tenant_id||The "tenant" of the service principal created above.|
|dc_admin|arcadmin|The data controller administrator username.|
|dc_admin_password||The data controller administrator password.|
|db_admin|arcadmin|The database instance administrator username.|
|db_admin_password||The database instance administrator password.|
|namespace|arc|The namespace in which to deploy Arc enabled data services.|
|sql_instance_name|sql-1|The name of the SQL managed instance.|
|postgres_name|pg-1|The name of the PostgreSQL instance.|
|location|eastus|**Must be one of 'eastus' or 'westeurope'.**|
|image_tag|public-preview-feb-2021|The image tag to use.  Change if you are pulling from a private container registry.|
|registry|mcr.microsoft.com|The registry to pull from. Change if you are pulling from a private container registry.|
|repository|arcdata|The repository to pull from on the registry. Change if you are pulling from a private container registry.|
|service_type|LoadBalancer|The service type to use for the external endpoint services - LoadBalancer or NodePort.|
|custom_location_object_id||The "Custom Locations RP" app object ID.  To find this login to Azure Portal.  Search for 'Enterprise Applications'.  Change the 'Application type' drop down to 'All Applications'.  In the search box enter 'Custom Locations RP' and hit enter.  Click on the 'Custom Locations' app in the table.  Copy and use the 'object ID' text box value here.|
|token||The token that you retrieved in the previous step.|

Now you are ready to begin the deployment of Arc enabled data services on your Arc connected Kubernetes cluster!

#### Create the Arc enabled data services extension

Click on the '**1. Create data services extension**' API test.

Click on Send.

If you get a '200 OK' status back then the result was successful and you can proceed.

Click on the '**2. Get data services extension**' API test.

Click on Send.

If you get a '200 OK' status back then the result was successful.  Check the installState property value.  It should initially be '**Pending**'.

Check the Kubernetes cluster using your Kubernetes tools to see if the namespace was created and that the bootstrapper pod is being created.  This can take a few minutes to happen automatically.

Once you see the pod in the Status = '**Running**' state click Send on '**2. Get data services extension**' again.  You should see the installState property change to '**Installed**'.  Once you see this, you are ready to move on to the next step.

#### Create a custom location

Click on the '**3. Create custom location**' API test.

Click on Send.

If you get a '200 OK' status back then the result was successful and you can proceed.

Click on the '**4. Get custom location**' API test.

Click on Send.

If you get a '200 OK' status back then the result was successful.  Check the provisioningState property value.  It should initially be '**Creating**'.

Continue to click 'Send' until the provisioningState changes to '**Succeeded**'.

#### Create the Azure Arc data controller

Click on the '**5. Create data controller**' API test.

Click on Send.

If you get a '201 Created' status back then the result was successful.  Notice that the 'provisioningState' property is initially '**Accepted**'.

Monitor the target namespace in your Kubernetes cluster to see the pods being deployed.  Once all the pods are in a Running status, check the overall status of the data controller custom resource:

```console
kubectl get datacontrollers -A
```

The data controller status should be '**Ready**'.

Click on the '**6. Get data controller**' API test.

Click on Send.

If you get a '200 OK' status back then the result was successful.  Check the provisioningState property value.  It should now be 'Succeeded'.

#### Create a SQL managed instance and PostgreSQL Hyperscale  server group

Click on the '**7. Create SQL managed instance**' API test.

Click on Send.

If you get a '201 Created' status back then the result was successful. Notice that the 'provisioningState' is 'Accepted'.

Monitor for the SQL managed instance pod to be created in the target namespace.  Once you see the pod created, you are ready to go on.

Click on the '**8. Get SQL managed instance**' API test.

Click on Send.

Notice that the 'provisioningState' property value is now 'Succeeded'.

Do the same general provisioning process for PostgreSQL using the '**9. Create Postgres instance (v11)**' and '**10. Get Postgres instance (v11)**' API tests.

#### Clean up

Once you are done testing, you can use the Delete API tests to clean everything up.  Be sure to do them in order from top to bottom and wait for some time in between each.
