---
title: Deploy AWS event-driven workflow (EDW) workload to Azure
description: Learn how to deploy an AWS EDW workflow to Azure and how to validate your deployment.
ms.topic: how-to
ms.date: 05/22/2024
author: JnHs
ms.author: jenhayes
---

# Deploy the AWS event-driven workflow (EDW) workload to Azure

Now that you've set your environment variables and made the necessary code changes, you're ready to deploy the EDW workload to Azure.

## Sign in to Azure

Before running the `deploy.sh` script, sign in to Azure by running the following command:

```bash
az login
```

If your Azure account has multiple subscriptions, make sure you have selected the correct subscription. To list the names and IDs of your subscriptions, run the following command:

```bash
az account list --query "[].{id: id, name:name }" --output table
```

To select a specific subscription, run the following command:

```bash
az account set --subscription <desired-subscription-id>
```

## Run the deployment command

The `deploy.sh` script in the `deployment` directory is used to deploy the application to Azure.

The deployment scripts used in the workflow are run from the root directory of the project. Deploy the application infrastructure to Azure by running the following command:

```bash
cd deployment
./deploy.sh
```

The script first checks that all of the [prerequisite tools](eks-edw-overview.md#prerequisites) are installed. If not, the script terminates and displays an error message letting you know which prerequisites are missing. If this happens, review the prerequisites, install any missing tools, then run the script again.

One prerequisite is the [Node autoprovisioning (preview) for AKS)](node-autoprovision.md)d. If the  `NodeAutoProvisioningPreview` feature flag isn't already enabled, the script executes an Azure CLI command to do so.

The script records the state of the deployment in a file called `deploy.state`, which is located in the `deployment` directory. You can use this file to set environment variables  when deploying the app.

As the script executes the commands to stand up the infrastructure for the workflow, it checks that each command executes successfully. If an error is encountered, an error message is displayed, and the execution stops.

The script displays a log as it runs. You can persist the log by redirecting the output of this log information when running the script as shown here

```bash
./deployment/infra/deploy.sh | tee ./logs/install.log
```

This enables the script to display the log messages and save them to a file called `install.log` in the `logs` directory.

After confirming that all prerequisites are met, the script creates the [resource group](/azure/azure-resource-manager/management/overview) to contain the resources it creates.

The script creates the following Azure resources:

- Azure Storage account – Used to contain the queue where messages are sent by the producer app and read by the consumer app. This storage account also contains the table where the processed messages are stored by the consumer app.
- Azure Container Registry (ACR) – Used to provide a repository for the container used to deploy the refactored consumer app code.
- Azure Kubernetes Service (AKS) cluster – Used to provide Kubernetes orchestration for the consumer app container. The following AKS features are enabled on the cluster:

  - Node autoprovisioning: Te implementation of Karpenter node autoscaler on AKS.
  - KEDA: The Azure CLI allows users to enable the Kubernetes Event Driven Autoscaler (KEDA) for pod autoscaling. This allows scaling of pods based on events, such as exceeding a specified queue depth threshold.
  - Workload identity: Allows users to attach role-based access policies to pod identities for enhanced security, as opposed to using secrets such as access keys.
  - Attached ACR: This feature allows the AKS cluster to pull images from repositories on the specified ACR instance, allowing users to use a private repository without having to resort to including an `imagePullSecret` in their deployment manifest.
  - The script also creates an application and a system node pool that has a taint to prevent application pods from being scheduled in the system node pool.

In addition to these resources, the script also creates two user assigned managed identities:

- AKS cluster managed identity – The deployment script assigns the `acrPull` role to this identity, which is assigned to the AKS cluster when it is created. This managed identity facilitates access to the attached ACR for pulling images.
- Workload identity – This managed identity is associated with the Kubernetes service account used as the identity for pods on which the consumer app containers are deployed. This provides role-based access control (RBAC) access to Azure resources, based on the level of access granted to the pod, instead of relying on secrets. For this workflow, the managed identity is assigned the **Storage Queue Data Contributor** and **Storage Table Data Contributor** roles.

The script also creates two federated credentials. One credential is used for the managed identity used to implement pod identity. The other credential is used for the KEDA operator service account, providing access for the KEDA scaler to gather the metrics needed to control pod autoscaling.

For more detail, see the `./deployment/infra/deploy.sh` script in our [GitHub repository](https://github.com/Azure-Samples/aks-event-driven-replicate-from-aws).


## Validate deployment and run the workload

Upon successful completion of the deployment script, you can use the `./deployment/environmentVariables.sh` to set the environment variables. Use this command:

```bash
source  ./deployment/environmentVariables.sh
```

Gou can also use the information contained in the `./deployment/deploy.state` file to set environment variables for the names of the resources created in the deployment. Use the `cat` command to display the file contents:

```bash
cat ./deployment/deploy.state
```

You'll see output showing the following values:

```bash
SUFFIX=
RESOURCE_GROUP=
AZURE_STORAGE_ACCOUNT_NAME=
AZURE_QUEUE_NAME=
AZURE_COSMOSDB_TABLE=
AZURE_CONTAINER_REGISTRY_NAME=
AKS_MANAGED_IDENTITY_NAME=
AKS_CLUSTER_NAME=
WORKLOAD_MANAGED_IDENTITY_NAME=
SERVICE_ACCOUNT=
FEDERATED_IDENTITY_CREDENTIAL_NAME=
KEDA_SERVICE_ACCT_CRED_NAME=
```

Use this command to read the file and create environment variables for the names of the Azure resources created by the deployment script:

```bash
while IFS= read -r; line do \
echo "export $line" \
export $line; \
done < ./deployment/deploy.state
```

Before you can verify that the KEDA operator is running, first get the AKS cluster credentials using this Azure CLI command:

```azurecli
az aks get-credentials –resource-group $RESOURCE_GROUP –name $AKS_CLUSTER_NAME
```

The KEDA operator is installed on the AKS cluster in the kube-system namespace. Use the kubectl command as follows to verify that the KEDA operator pods are running:

```bash
kubectl get pods –namespace kube-system | grep keda
```

You should see a response that looks like this:

:::image type="content" source="media/eks-edw-deploy/sample-keda-response.png" alt-text="Screenshot showing an example response from the command to verify that KEDA operator pods are running.":::

### Generate simulated load

Use the producer app to populate the queue with messages. In a separate terminal window, navigate to the project directory. Set the environment variables using the method described earlier. Run the producer app using the following command:

```python
python3 ./app/keda/aqs-producer.py
```

Once the app starts sending messages, switch back to the other terminal window. Deploy the consumer app container onto the AKS cluster using the app install script. Before executing the script, remember to make it executable using the `chmod` command as shown here:

```bash
chmod +x ./deployment/keda/deploy-keda-app-workload-id.sh
./deployment/keda/deploy-keda-app-workload-id.sh
```

The deployment script (`deploy-keda-app-workload-id.sh` in the `deployment` directory in our [GitHub repository](https://github.com/Azure-Samples/aks-event-driven-replicate-from-aws))performs templating on the application manifest YAML specification to pass environment variables to the pod.

Notice the label `azure.workload.identity/use` in the `spec/template` section, which is the pod template for the deployment. Setting the label to `true` specifies that we are using workload identity. The `serviceAccountName` in the pod specification specifies the Kubernetes service account to associate with the workload identity.

Even though the pod specification contains a reference for an image in a private repository, there is no `imagePullSecret` specified.

To verify that the script has run successfully, use the following kubectl command:

```bash
kubectl get pods –namespace $AQS_TARGET_NAMESPACE
```

You should see a single pod.

### Monitor scale out for pods and nodes with k9s

You can use a variety tools to verify the operation of apps deployed to AKS, including the Azure portal.

K9s is an open source tool that can be used to look at the operation of a Kubernetes cluster. After installing the consumer onto the AKS cluster, if you create two windows, and start k9s in each one, with one having a view of the pods and the other a view of the nodes in the namespace you specified in the `AQS_TARGET_NAMESPACE` environment variable (default value is `aqs-demo`) you should see something like this:

:::image type="content" source="media/eks-edw-deploy/sample-k9s-view.png" alt-text="Screenshot showing an example of the K9s view across two windows.":::

After you confirm that the consumer app container is installed and running on the AKS cluster, install the `ScaledObject` and trigger authentication used by KEDA for pod autoscaling by running the scaled object installation script (`keda-scaleobject-workload-id.sh` in the `deployment` directory in our [GitHub repository](https://github.com/Azure-Samples/aks-event-driven-replicate-from-aws)). Remember to use chmod the first time you run the script. Use these commands:

```bash
chmod +x ./deployment/keda/keda-scaleobject-workload-id.sh
./deployment/keda/keda-scaleobject-workload-id.sh
```

This script also performs templating to inject environment variables where needed. The `TriggerAuthentication` object specifies to KEDA that this `ScaledObject` using pod identity for authentication with the managed identity created for use as the workload identity specified.

When the scaled object is correctly installed and KEDA detects the scaling threshold is exceeded, it begins scheduling pods. If you are using k9s, you should see something like this:

:::image type="content" source="media/eks-edw-deploy/sample-k9s-scheduling-view.png" alt-text="Screenshot showing an example of the K9s view with scheduling pods.":::

Finally, if you allow the producer to fill the queue with enough messages, KEDA will need to schedule more pods than there are nodes to serve. This is when Karpenter will kick in and start scheduling nodes. Using k9s, you should see something like this:

In the two images, notice how the number of nodes whose name contains aks-default node pool has increased from one to three nodes. If you stop the producer app from putting messages on the queue, eventually the consumers will reduce the queue depth below the threshold and both KEDA and Karpenter will scale in. Using k9s, you should see something like this:

## Clean up resources

When you are finished, remember to clean up the resources you created. The cleanup script provided at `/deployment/infra/cleanup.sh` in our [GitHub repository](https://github.com/Azure-Samples/aks-event-driven-replicate-from-aws)) can be run to delete all of the resources created in this deployment.

